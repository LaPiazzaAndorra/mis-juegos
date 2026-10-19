#!/usr/bin/env python3
"""
Integración de lo que devuelva ChatGPT para el conjunto de aventura (D-027), preparada ANTES de tener las imágenes: alinea
cada imagen con nuestro lienzo, toma SOLO lo pedido en su guía y lo comprueba. No inventa, no deforma la muñeca ni la
ropa (alineación con escala uniforme y desplazamiento, sin giro ni estiramiento) y no toca la base aprobada ni las capas
candidatas actuales: todo sale a integrar/<guía>/ como candidato.

  piernas  <imagen> [máscara carpeta transición base]   rodillas (opción A): toma solo la zona de la máscara (por defecto
                      ../piernas/mascara-zona.png) sobre la base (por defecto ../piernas/base-copia.png)
                      → <carpeta>/base-piernas-sin-mallas.png; la B: mascara-zona-b.png, carpeta piernas-b, transición 3
  ropa     <imagen>   guía 1: camiseta y chaleco sobre nuestra plantilla → ropa/camiseta.png y ropa/chaleco.png
  tiras    <imagen>   guía 2b: tiras sobre nuestra plantilla → mochila/tiras.png
  mochila  <imagen> [cx cy ancho giro]   guía 2a: la mochila sola sobre fondo crema → mochila/mochila-recortada.png y,
                      colocada detrás de la base, mochila/mochila.png

Alineación (piernas, ropa, tiras): la imagen se lleva al ancho de nuestro lienzo y se buscan los centros de los iris cerca
de los nuestros (391, 443) y (567, 443); con ellos, escala y desplazamiento. Se comprueba además que, fuera de la zona
pedida, la imagen coincide con nuestra muñeca (si no coincide, ChatGPT ha cambiado algo más y se avisa).

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/recibir.py <guía> <imagen> [...]
(Para probarlo sin escribir en el repositorio: SALIDA_INTEGRAR=/otra/carpeta.)
"""
import hashlib, json, os, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; sys.path.insert(0, str(CJ))
SAL = Path(os.environ.get('SALIDA_INTEGRAR', AQUI))   # para pruebas, otra carpeta (fuera del repositorio)
import conjunto_aventura as A   # noqa: E402
sys.path.insert(0, str(A.B / 'medidas'))
import medir as MD              # noqa: E402  (búsqueda del centro del iris)
PT = A.PT; CREMA = (253, 250, 245); W, H = 948, 1659
OJOS = [(391, 443), (567, 443)]                      # nuestros iris (medidos en la base)
BUSCA = (30, 45)                                     # margen de búsqueda de los iris (x, y) en px de nuestro lienzo


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def plantilla():
    """Nuestra muñeca como se envía a ChatGPT (base + ojos sobre crema), en RGB."""
    f = Image.new('RGBA', (W, H), CREMA + (255,))
    for c in (PT.abrir(PT.SIN_OJOS), PT.abrir(PT.OJOS['marron'])):
        f.alpha_composite(Image.fromarray(c, 'RGBA'))
    return np.array(f.convert('RGB'))


def alinear(ruta):
    """Imagen de ChatGPT llevada a nuestro lienzo (RGB 948 × 1659, fondo crema fuera) con escala uniforme y desplazamiento."""
    im = Image.open(ruta).convert('RGB'); s0 = W / im.width
    pre = im.resize((W, round(im.height * s0)), Image.LANCZOS); L = np.array(pre.convert('L')).astype(float)
    hallados = []
    for ox, oy in OJOS:
        cx, cy, r = MD.iris(L, ox - BUSCA[0], ox + BUSCA[0], oy - BUSCA[1], min(oy + BUSCA[1], L.shape[0] - 60)); hallados.append((cx, cy))
    (ax, ay), (bx, by) = hallados; s = (OJOS[1][0] - OJOS[0][0]) / max(bx - ax, 1)
    dx = (OJOS[0][0] + OJOS[1][0]) / 2 - s * (ax + bx) / 2; dy = (OJOS[0][1] + OJOS[1][1]) / 2 - s * (ay + by) / 2
    t = (1 / s, 0, -dx / s, 0, 1 / s, -dy / s)          # de nuestro lienzo a la imagen ya llevada a nuestro ancho
    fondo = Image.new('RGB', pre.size, CREMA)
    ali = Image.composite(pre, fondo, Image.new('L', pre.size, 255)).transform((W, H), Image.AFFINE, t, Image.BICUBIC, fillcolor=CREMA)
    info = dict(tamano_recibido=[im.width, im.height], escala_total=round(s0 * s, 4), desplazamiento=[round(dx, 1), round(dy, 1)],
                iris_hallados=[[round(x, 1), round(y, 1)] for x, y in hallados], diferencia_de_altura_de_los_ojos_px=round(abs(ay - by) * s, 1))
    return np.array(ali), info


def alinear_por_silueta(ruta, excluir, referencia=None):
    """Para imágenes sin ojos (la plantilla de las rodillas es la base sin ojos): escala por la caja de la silueta y ajuste
    fino de escala y desplazamiento (sub-píxel) minimizando la diferencia con nuestra base fuera de `excluir`."""
    from skimage.registration import phase_cross_correlation
    im = Image.open(ruta).convert('RGB'); a = np.array(im).astype(int)
    fondo = np.median(np.r_[a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3)], 0)
    fg = nd.binary_opening(np.abs(a - fondo).max(-1) > 12, iterations=2); ys, xs = np.where(fg)
    if referencia is None:
        base = PT.abrir(PT.SIN_OJOS); bm = base[..., 3] > 128; pl = plantilla()
    else:   # la imagen que se envió (p. ej. la muñeca con el pantalón): su silueta es lo que no es fondo
        pl = np.array(Image.open(referencia).convert('RGB')); bm = nd.binary_opening(np.abs(pl.astype(int) - np.array(CREMA)).max(-1) > 12, iterations=2)
    by, bx = np.where(bm)
    s0 = ((by.max() - by.min()) / (ys.max() - ys.min()) + (bx.max() - bx.min()) / (xs.max() - xs.min())) / 2
    gpl = np.array(Image.fromarray(pl).convert('L')).astype(float)
    sil = nd.binary_erosion(bm, iterations=3) & ~nd.binary_dilation(excluir, iterations=12)
    def poner(s, dx, dy):
        t = (1 / s, 0, -dx / s, 0, 1 / s, -dy / s)
        return np.array(im.transform((W, H), Image.AFFINE, t, Image.BICUBIC, fillcolor=CREMA))
    mejor = None
    for s in np.arange(s0 - 0.004, s0 + 0.0041, 0.0005):
        dx = (bx.min() + bx.max()) / 2 - s * (xs.min() + xs.max()) / 2; dy = (by.min() + by.max()) / 2 - s * (ys.min() + ys.max()) / 2
        g = np.array(Image.fromarray(poner(s, dx, dy)).convert('L')).astype(float)
        sh = phase_cross_correlation(gpl, g, upsample_factor=20, reference_mask=sil, moving_mask=sil)
        sh = sh[0] if isinstance(sh, tuple) else sh
        ali = poner(s, dx + sh[1], dy + sh[0]); dE = float(np.median(diferencia(ali, pl)[sil]))
        if mejor is None or dE < mejor[0]:
            mejor = (dE, s, dx + sh[1], dy + sh[0], ali)
    dE, s, dx, dy, ali = mejor
    return ali, dict(metodo='silueta + ajuste fino (sin ojos en la imagen)', tamano_recibido=[im.width, im.height],
                     escala=round(float(s), 4), desplazamiento=[round(float(dx), 2), round(float(dy), 2)], mediana_dE_en_la_silueta=round(dE, 2))


def lab(rgb):
    return PT.lab_de(np.dstack([rgb, np.full(rgb.shape[:2], 255, np.uint8)])).astype(float)


def diferencia(a, b):
    return np.sqrt(((lab(a) - lab(b)) ** 2).sum(-1))


def igual_fuera(ali, zona, nombre, ref=None):
    """Cuánto se parece la imagen alineada a nuestra muñeca fuera de la zona pedida (en la silueta de la muñeca)."""
    base = PT.abrir(PT.SIN_OJOS); sil = nd.binary_erosion(base[..., 3] > 128, iterations=4) & ~nd.binary_dilation(zona, iterations=12)
    d = diferencia(ali, plantilla() if ref is None else ref)[sil]
    return {f'{nombre}_mediana_dE': round(float(np.median(d)), 2), f'{nombre}_px_con_dE_mayor_20': int((d > 20).sum()), f'{nombre}_px_comparados': int(sil.sum())}


def vista(capas, caja, F, titulo):
    f = Image.new('RGBA', (W, H), CREMA + (255,))
    for c in capas:
        f.alpha_composite(Image.fromarray(c, 'RGBA'))
    v = f.convert('RGB').crop(caja); o = Image.new('RGB', (v.width, v.height + 28), 'white'); o.paste(v, (0, 28))
    ImageDraw.Draw(o).text((6, 6), titulo, font=F, fill=(40, 40, 60)); return o


def guardar(carpeta, comp, vistas):
    carpeta.mkdir(exist_ok=True)
    (carpeta / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    w = sum(v.width for v in vistas) + 10 * (len(vistas) - 1); o = Image.new('RGB', (w, max(v.height for v in vistas)), 'white'); x = 0
    for v in vistas:
        o.paste(v, (x, 0)); x += v.width + 10
    o.save(carpeta / 'revision.png', optimize=True)
    print(json.dumps(comp, ensure_ascii=False))


def piernas(ruta, mascara=None, carpeta='piernas', transicion=0, sobre=None, referencia=None):
    P = CJ / 'piernas'; mascara = Path(mascara).resolve() if mascara else P / 'mascara-zona.png'; zona = np.array(Image.open(mascara)) > 127
    base_aprob = sha(PT.SIN_OJOS); copia = PT.abrir(Path(sobre) if sobre else P / 'base-copia.png'); ali, info = alinear_por_silueta(ruta, zona, referencia)
    peso = np.clip(nd.gaussian_filter(zona.astype(float), 0.8) * 1.6 - 0.3, 0, 1) * nd.binary_dilation(zona, iterations=1)
    peso = np.where(zona & ~nd.binary_dilation(~zona, iterations=1), 1.0, peso)      # borde suave de 1 px hacia la piel de alrededor
    junto_a_piel = nd.distance_transform_edt(~(~zona & (copia[..., 3] > 200))) <= 1.5
    peso = np.where(zona & ~junto_a_piel, 1.0, peso)                                  # en el contorno de la pierna se sustituye del todo (sin restos del borde de las mallas)
    peso *= (copia[..., 3] > 0)                                                       # nunca fuera de nuestra silueta
    if transicion:   # (zona B) en los últimos `transicion` px de la franja de abajo, paso suave a nuestra piel (dentro de la zona)
        YYt = np.mgrid[0:H, 0:W][0]; lct = PT.lab_de(copia)
        piel_abajo = ~zona & (copia[..., 3] > 200) & ~((lct[..., 1] > 15) & (lct[..., 2] < 14)) & (YYt > 1200)
        dist = nd.distance_transform_edt(~piel_abajo)
        peso = np.where(zona & (dist <= transicion), np.minimum(peso, (dist - 0.5) / transicion), peso)
    # tono: la piel de la imagen es algo más clara que la nuestra; se mide la diferencia (Lab) en la piel de debajo de la
    # zona, donde las dos imágenes tienen la pierna sin mallas, y se corrige con ese desplazamiento (no se pinta nada nuevo)
    YY = np.mgrid[0:H, 0:W][0]; lc = PT.lab_de(copia); rosa_c = (lc[..., 1] > 15) & (lc[..., 2] < 14)
    la = lab(ali)
    debajo = nd.binary_dilation(zona, iterations=30) & ~nd.binary_dilation(zona, iterations=4) & (copia[..., 3] > 200) & ~rosa_c & (YY > 1100) & (YY < 1330)
    debajo &= np.sqrt(((lc - la) ** 2).sum(-1)) < 15                                  # piel en las dos (no el pantalón de la imagen)
    desv = np.median(lc[debajo] - la[debajo], 0) if debajo.sum() >= 50 else np.zeros(3)
    ali = PT.a_rgb(la + desv)
    # dentro de la zona, donde la imagen tiene fondo (la pierna sin mallas es algo más fina que con ellas) queda transparente
    dfondo = np.sqrt(((lab(ali) - lab(np.full_like(ali, CREMA))) ** 2).sum(-1))
    opaco = np.clip((dfondo - 4) / 10, 0, 1)
    nueva = copia.copy().astype(float)
    a_new = opaco * 255; a_old = copia[..., 3].astype(float)
    alfa = a_old * (1 - peso) + a_new * peso
    rgb = (copia[..., :3] * (a_old * (1 - peso))[..., None] + ali * (a_new * peso)[..., None]) / np.maximum(alfa, 1e-6)[..., None]
    toca = peso > 0                                                                   # fuera de la zona (y su borde de 1 px), nada cambia
    nueva[toca, :3] = np.where(alfa[toca, None] > 0, rgb[toca], 0); nueva[toca, 3] = alfa[toca]
    nueva = nueva.round().astype(np.uint8)
    S = SAL / carpeta; S.mkdir(exist_ok=True); Image.fromarray(nueva, 'RGBA').save(S / 'base-piernas-sin-mallas.png', optimize=True)
    ln = lab(nueva[..., :3]); rosa_nueva = (nueva[..., 3] > 128) & (ln[..., 1] > 15) & (ln[..., 2] < 14) & (YY > 1100)
    pantalon = PT.abrir(CJ / 'capas' / 'pantalon.png')[..., 3] > 128
    rosa_visto = rosa_nueva & ~pantalon
    # unión: la franja de debajo de la zona (piel nuestra) y la de dentro, en las columnas de las piernas
    abajo = nd.binary_dilation(zona, iterations=4) & ~zona & (copia[..., 3] > 200) & (YY > 1200)
    dentro = zona & ~nd.binary_erosion(zona, iterations=4) & (YY > 1200) & (nueva[..., 3] > 200)
    union = [round(float(x), 1) for x in np.median(ln[dentro], 0) - np.median(ln[abajo], 0)]
    # contorno: piel de la imagen justo fuera de nuestra silueta junto a la zona (quedaría cortada)
    fuera = nd.binary_dilation(zona, iterations=3) & (copia[..., 3] < 20) & (opaco > 0.5)
    # línea en la unión de abajo: luminosidad justo debajo de la zona (1–3 px) frente a un poco más abajo (8–12 px), por columna
    lineas, saltos = [], []
    for x in range(W):
        col = np.where(zona[:, x] & (YY[:, x] > 1200))[0]
        if len(col) and nueva[col.max() + 12, x, 3] > 200 and nueva[col.max() + 1, x, 3] > 200:
            yb = col.max(); lineas.append(ln[yb + 1:yb + 4, x, 0].mean() - ln[yb + 8:yb + 13, x, 0].mean())
            saltos.append(ln[yb - 1:yb + 1, x, 0].mean() - ln[yb + 1:yb + 3, x, 0].mean())   # escalón justo en el borde
    lineas = np.array(lineas or [0.0]); saltos = np.array(saltos or [0.0])
    comp = dict(guia='rodillas (opción A)', transicion_px=transicion, mascara=str(mascara.relative_to(A.RAIZ)) if mascara.is_relative_to(A.RAIZ) else str(mascara), alineacion=info,
                ajuste_de_tono_Lab=[round(float(x), 1) for x in desv], tono_medido_en_px=int(debajo.sum()), **igual_fuera(ali, zona, 'fuera_de_la_zona', None if referencia is None else np.array(Image.open(referencia).convert('RGB'))),
                zona_px=int(zona.sum()), rosa_en_la_copia_bajo_y_1100_px=int(rosa_nueva.sum()),
                rosa_que_no_tapa_el_pantalon_px=int(rosa_visto.sum()), rosa_que_no_tapa_dentro_de_la_zona_px=int((rosa_visto & zona).sum()),
                union_diferencia_mediana_Lab_dentro_menos_debajo=union,
                linea_bajo_la_zona_L=dict(mediana=round(float(np.median(lineas)), 1), peor=round(float(lineas.min()), 1),
                                          columnas_mas_oscuras_de_6=int((lineas < -6).sum()), columnas=int(len(lineas)),
                                          nota='compara 1–3 px bajo la zona con 8–12 px: también recoge el sombreado natural junto al contorno'),
                escalon_en_el_borde_L=dict(mediana=round(float(np.median(saltos)), 1), columnas_con_mas_de_4=int((np.abs(saltos) > 4).sum()), columnas=int(len(saltos))),
                zona_que_queda_transparente_px=int((zona & (alfa < 128) & (a_old >= 128)).sum()),
                piel_de_la_imagen_fuera_de_nuestra_silueta_px=int(fuera.sum()),
                fuera_de_la_zona_sin_cambios=bool((nueva[~nd.binary_dilation(zona, iterations=1)] == copia[~nd.binary_dilation(zona, iterations=1)]).all()),
                base_aprobada_sin_cambios=sha(PT.SIN_OJOS) == base_aprob)
    F = PT.MK.F(15); caja = (300, 1080, 660, 1400); pant = [PT.abrir(CJ / 'capas' / f'{k}.png') for k in ('calcetines', 'botas', 'pantalon')]
    guardar(S, comp, [vista([copia] + pant, caja, F, 'Ahora (mallas)'), vista([nueva] + pant, caja, F, 'Con la piel completada'),
                      vista([nueva], caja, F, 'Sin el pantalón (zona completada)')])
    return nueva, rosa_visto


def ropa(ruta):
    ali, info = alinear(ruta); pl = plantilla(); base = PT.abrir(PT.SIN_OJOS)
    d = diferencia(ali, pl); cambia = nd.binary_opening(d > 12, iterations=1)
    YY, XX = np.mgrid[0:H, 0:W]; zona_torso = (YY > 590) & (YY < 1010)
    manos = PT.abrir(PT.MANOS)[..., 3] > 128
    nueva = nd.binary_fill_holes(cambia & zona_torso) & zona_torso
    L, a, b = [lab(ali)[..., i] for i in range(3)]; C = np.hypot(a, b)
    sem = np.zeros((H, W), np.int32)
    sem[nd.binary_erosion(nueva & (L > 214) & (C < 25) & (a < 9), iterations=2)] = 1                      # camiseta crema
    arena = nd.binary_erosion(nueva & (L > 160) & (L < 212) & (a >= 8) & (a < 16) & (b > 22), iterations=1)
    et, n = nd.label(arena); tam = nd.sum(arena, et, range(1, n + 1)); arena = np.isin(et, 1 + np.where(tam > 150)[0])   # sin las sombras de la camiseta
    ribete = nueva & (a < 6) & (b > 8) & (L < 215) & (nd.distance_transform_edt(~arena) < 12)
    sem[arena | ribete] = 2                                                                                  # chaleco: arena y ribete verde
    sem[nd.binary_erosion(~nueva, iterations=2)] = 3
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(lab(ali)[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(lab(ali)[..., i], 1), 1) ** 2 for i in range(3)))
    reg = watershed(g, sem); reg[~nueva] = 3
    # lo que la camiseta encierra (la hoja bordada y sombras sueltas) es de la camiseta
    dentro = nd.binary_fill_holes(reg == 1) & (reg == 2); et, n = nd.label(dentro); tam = nd.sum(dentro, et, range(1, n + 1))
    reg[np.isin(et, 1 + np.where(tam < 1500)[0])] = 1
    S = SAL / 'ropa'; S.mkdir(exist_ok=True); capas = {}
    for k, n in (('camiseta', 1), ('chaleco', 2)):
        capas[k] = A.CO.suave(reg == n, ali, reg != n); Image.fromarray(capas[k], 'RGBA').save(S / f'{k}.png', optimize=True)
    lb = PT.lab_de(base).astype(float); rosa = (base[..., 3] > 128) & (lb[..., 1] > 15) & (lb[..., 2] < 14) & zona_torso
    tapa = 1 - np.prod([1 - capas[k][..., 3] / 255 for k in capas], 0)
    pantalon = PT.abrir(CJ / 'capas' / 'pantalon.png')[..., 3] > 128
    comp = dict(guia='1 · camiseta y chaleco', alineacion=info, **igual_fuera(ali, nueva, 'fuera_de_la_ropa'),
                camiseta_px=int((reg == 1).sum()), chaleco_px=int((reg == 2).sum()),
                camiseta_rosa_a_la_vista_px=int((rosa & (tapa < 0.5) & ~pantalon & ~manos).sum()),
                ropa_sobre_nuestros_antebrazos_px=int(((tapa > 0.5) & manos).sum()),
                cambios_en_nuestros_brazos_px=int((cambia & manos).sum()))
    F = PT.MK.F(15); caja = (150, 560, 800, 1120); otras = [PT.abrir(CJ / 'capas' / f'{k}.png') for k in ('calcetines', 'botas', 'pantalon')]
    guardar(S, comp, [vista([base, PT.abrir(PT.OJOS['marron'])] + otras + [capas['camiseta'], capas['chaleco'], PT.abrir(PT.MANOS)], caja, F, 'Camiseta y chaleco nuevos sobre nuestra muñeca'),
                      vista([capas['chaleco']], caja, F, 'Chaleco solo'), vista([capas['camiseta']], caja, F, 'Camiseta sola')])


def tiras(ruta):
    ali, info = alinear(ruta); pl = plantilla(); d = diferencia(ali, pl)
    YY, XX = np.mgrid[0:H, 0:W]; L, a, b = [lab(ali)[..., i] for i in range(3)]
    zona = (YY > 590) & (YY < 830) & (((XX > 320) & (XX < 430)) | ((XX > 530) & (XX < 650)))
    verde = (a < 6) & (b > 8) & (L < 215) & (L > 40)
    nueva = nd.binary_fill_holes(nd.binary_opening((d > 12) & zona & (verde | nd.binary_dilation(verde, iterations=6)), iterations=1)) & zona
    S = SAL / 'mochila'; S.mkdir(exist_ok=True); c = A.CO.suave(nueva, ali, ~nueva); Image.fromarray(c, 'RGBA').save(S / 'tiras.png', optimize=True)
    comp = dict(guia='2b · tiras', alineacion=info, **igual_fuera(ali, nueva, 'fuera_de_las_tiras'), tiras_px=int(nueva.sum()))
    F = PT.MK.F(15); caja = (250, 560, 710, 860)
    guardar(S, comp, [vista([PT.abrir(PT.SIN_OJOS), PT.abrir(PT.OJOS['marron']), c], caja, F, 'Tiras sobre nuestra muñeca')])


def mochila(ruta, cx=262, cy=890, ancho=150, giro=0):
    im = np.array(Image.open(ruta).convert('RGB')); lb = lab(im); C = np.hypot(lb[..., 1], lb[..., 2])
    fondo = (lb[..., 0] >= 240) & (C < 9)
    et, n = nd.label(fondo); borde = set(np.unique(np.r_[et[0], et[-1], et[:, 0], et[:, -1]])) - {0}
    fuera = np.isin(et, list(borde)); obj = nd.binary_fill_holes(~fuera)
    et2, n2 = nd.label(obj); tam = nd.sum(obj, et2, range(1, n2 + 1)); obj = et2 == (1 + int(np.argmax(tam)))   # la pieza más grande
    c = A.CO.suave(obj, im, ~obj); ys, xs = np.where(obj); rec = c[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    S = SAL / 'mochila'; S.mkdir(exist_ok=True); Image.fromarray(rec, 'RGBA').save(S / 'mochila-recortada.png', optimize=True)
    sys.path.insert(0, str(CJ.parent / 'accesorios-2026-10-16' / 'capas')); import colocar as CL
    capa = CL.colocar(S / 'mochila-recortada.png', (cx, cy), ancho, giro); Image.fromarray(capa, 'RGBA').save(S / 'mochila.png', optimize=True)
    base = PT.abrir(PT.SIN_OJOS); hay = capa[..., 3] > 0; visible = hay & (base[..., 3] < 128)
    comp = dict(guia='2a · cuerpo de la mochila', recibido=[int(im.shape[1]), int(im.shape[0])], recorte=[int(rec.shape[1]), int(rec.shape[0])],
                colocacion=dict(centro=[cx, cy], ancho=ancho, giro=giro), px=int(hay.sum()), se_ve_fuera_de_la_muneca_px=int(visible.sum()))
    F = PT.MK.F(15); caja = (100, 560, 860, 1120); pelo = PT.abrir(A.PELO_DELANTE)
    guardar(S, comp, [vista([PT.abrir(PT.SIN_PIEL['pelo-detras']), capa, base, PT.abrir(PT.OJOS['marron']), PT.abrir(PT.MANOS), pelo], caja, F, 'Con la melena'),
                      vista([capa, base, PT.abrir(PT.OJOS['marron']), PT.abrir(PT.MANOS)], caja, F, 'Sin pelo (como con la coleta)')])


if __name__ == '__main__':
    guia, ruta = sys.argv[1], sys.argv[2]
    if guia == 'mochila':
        mochila(ruta, *[float(x) for x in sys.argv[3:7]])
    elif guia == 'piernas' and len(sys.argv) > 3:
        piernas(ruta, sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else 'piernas', int(sys.argv[5]) if len(sys.argv) > 5 else 0,
                sys.argv[6] if len(sys.argv) > 6 else None, sys.argv[7] if len(sys.argv) > 7 else None)
    else:
        {'piernas': piernas, 'ropa': ropa, 'tiras': tiras}[guia](ruta)
