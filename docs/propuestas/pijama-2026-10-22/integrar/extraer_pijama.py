#!/usr/bin/env python3
"""
Pijama (D-028): de la imagen de ChatGPT sin pelo ni gorrito (guia-chatgpt/de-chatgpt/, sin modificar) se toman SOLO la
camiseta, el pantalón y las zapatillas, cada uno en su capa (capas/), sobre NUESTRA muñeca original (no se toma nada de
su cara, piel, cuerpo ni fondo). Candidato: el encaje queda pendiente de la aprobación de la propietaria.

1. Alineación por la silueta del cuerpo (cabeza, cuello y manos, lo que no tapa el pijama), con escala uniforme y
   desplazamiento, sin giro ni deformación (recibir.alinear_por_silueta). Por los ojos sale un 2 % más grande (los iris
   se miden a 1 px): con la silueta, las manos coinciden (mediana dE 5,7 frente a 13,2).
2. Separación por color y reparto por contraste (watershed): semillas de la camiseta (azul por encima del bajo, cuello y
   puños rosas), del pantalón (azul por debajo del bajo, puños rosas de los tobillos), de las zapatillas (crema y suela
   rosa por debajo de los tobillos) y de «no es pijama» (lo que coincide con nuestra plantilla: piel y fondo). Las lunas
   y estrellas, encerradas por la tela, son de su prenda.
3. Capas con borde suave de 1 px (sin el color de lo de al lado), en nuestro lienzo de 948 × 1659. Donde el pijama de
   la imagen queda 1–4 px más estrecho que la ropa rosa de nuestra base (esquinas de las mangas cortas junto al hombro,
   costado de una pernera, donde asomaba también la pierna), la prenda se alarga con su propia tela hasta taparla
   (máscaras mascara-ampliado-*.png).
4. Comprobaciones: que fuera del pijama la imagen coincide con nuestra muñeca (cara, cuello, manos) y que el pijama tapa
   toda la ropa rosa de la base (camiseta y mallas).
5. Montajes de revisión: sin pelo; melena con el gorrito de dormir B; coleta (con cinta) y dos coletas (sin sombrero), con
   el pelo limpio para la ropa (../../base-aprobada-d013-2026-10-14/pelo-sin-restos/conjunto/). El gorrito B solo está
   colocado para la melena (con la coleta y las dos coletas, pendiente: D-024).

Uso (desde la raíz): python3 docs/propuestas/pijama-2026-10-22/integrar/extraer_pijama.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; PJ = AQUI.parent; P = PJ.parent; B = P / 'base-aprobada-d013-2026-10-14'
sys.path.insert(0, str(P / 'conjunto-aventura-2026-10-18' / 'integrar')); import recibir as R   # noqa: E402
PT, A = R.PT, R.A; H, W = R.H, R.W; CREMA = R.CREMA
RECIBIDA = PJ / 'guia-chatgpt' / 'de-chatgpt' / 'pijama-sin-pelo-chatgpt.png'
PLANTILLA = PJ / 'guia-chatgpt' / 'plantilla-sin-pelo.png'
SAL = AQUI / 'capas'
PC = B / 'pelo-sin-restos' / 'conjunto'
COLETA = P / 'peinado-coleta-2026-10-16' / 'capas'; COLETAS = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas'
GORRITO = P / 'accesorios-2026-10-16' / 'gorrito' / 'capa-gorrito-b.png'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    antes = sha(RECIBIDA)
    YY, XX = np.mgrid[0:H, 0:W]
    manos = (YY > 1010) & (YY < 1130) & ((XX < 330) | (XX > 625))
    ali, info = R.alinear_por_silueta(RECIBIDA, (YY > 630) & ~manos)
    pl = np.array(Image.open(PLANTILLA).convert('RGB'))
    d = R.diferencia(ali, pl); L, a, b = [R.lab(ali)[..., i] for i in range(3)]; C = np.hypot(a, b)
    fondo = np.sqrt(((R.lab(ali) - R.lab(np.full((1, 1, 3), CREMA, np.uint8))[0, 0]) ** 2).sum(-1)) < 5
    azul = (b < -6) & (L < 215) & (YY > 620)
    rosa = (a > 12) & (b < 16) & (L > 110) & (YY > 620)
    crema = (L > 200) & (C < 24) & ~fondo & (YY > 1435)
    HEM = 1012                                    # bajo de la camiseta (sombra del dobladillo, medida en la imagen alineada)
    sem = np.zeros((H, W), np.int32)
    sem[nd.binary_erosion(azul & (YY < HEM - 8), iterations=1)] = 1
    sem[nd.binary_erosion(rosa & (YY < HEM), iterations=1) & nd.binary_dilation(azul, iterations=6)] = 1          # cuello y puños
    sem[nd.binary_erosion(azul & (YY > HEM + 8) & (YY < 1420), iterations=1)] = 2
    sem[nd.binary_erosion(rosa & (YY > 1340) & (YY < 1425), iterations=1)] = 2                                   # puños del pantalón
    sem[nd.binary_erosion(crema | (rosa & (YY > 1490)), iterations=1)] = 3                                       # zapatillas
    sem[nd.binary_erosion((d < 6) | fondo, iterations=2)] = 4                                                    # nuestra muñeca y el fondo
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(R.lab(ali)[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(R.lab(ali)[..., i], 1), 1) ** 2 for i in range(3)))
    reg = watershed(g, sem)
    for k in (1, 2, 3):                                    # lo que encierra cada prenda (lunas, estrellas, sombras) es suyo
        m = nd.binary_fill_holes(reg == k) & (reg == 4); et, n = nd.label(m); t = nd.sum(m, et, range(1, n + 1))
        reg[np.isin(et, 1 + np.where(t < 3000)[0])] = k
    # trocitos sueltos de cada prenda (fuera de su pieza grande) → no son pijama
    for k in (1, 2, 3):
        m = reg == k; et, n = nd.label(m); t = nd.sum(m, et, range(1, n + 1))
        reg[m & ~np.isin(et, 1 + np.where(t > 2000)[0])] = 4
    SAL.mkdir(exist_ok=True); capas = {}
    for nombre, k in (('camiseta', 1), ('pantalon', 2), ('zapatillas', 3)):
        capas[nombre] = A.CO.suave(reg == k, ali, reg != k)
        Image.fromarray(capas[nombre], 'RGBA').save(SAL / f'{nombre}.png', optimize=True)
    Image.fromarray(ali).save(AQUI / 'recibida-alineada.png', optimize=True)
    # 3b. donde el pijama de la imagen es 1–4 px más estrecho que la ropa rosa de nuestra base (las esquinas de las mangas
    #     cortas de la camiseta, junto al hombro, y el costado de una pernera), se alarga la prenda de al lado con su
    #     propia tela (la del píxel opaco más cercano), con el alfa del borde de nuestra base: tapa la ropa rosa sin
    #     ensanchar nada más
    base = PT.abrir(PT.SIN_OJOS); ropa = PT.MV.ropa_de_la_base(base)
    tapa0 = 1 - np.prod([1 - c[..., 3] / 255 for c in capas.values()], 0)
    # (y la pierna que asoma por el costado de una pernera, entre el bajo de la camiseta y los puños de los tobillos)
    pierna = (base[..., 3] > 128) & (YY > HEM) & (YY < 1405) & (XX > 320) & (XX < 640)
    falta = nd.binary_dilation((ropa | pierna) & (tapa0 < 0.5), iterations=1) & (base[..., 3] > 0) & (tapa0 < 0.99)
    ampliado = {}
    for nombre, zona in (('camiseta', YY < HEM), ('pantalon', YY >= HEM)):
        c = capas[nombre]; m = falta & zona
        if m.any():
            # el contorno nuevo, redondeado (sin esquinas en punta): lo que cierra la prenda con lo que falta, cerca de ahí
            from skimage.morphology import disk
            prenda = c[..., 3] > 128
            m = (m | (nd.binary_closing(prenda | m, structure=disk(6)) & ~prenda & nd.binary_dilation(m, iterations=6))) & zona
            if nombre == 'camiseta':
                # en las mangas, el contorno de fuera pasa a ser una curva suave que tapa las esquinas de las mangas cortas
                # (sin escalones ni picos): por cada fila, hasta lo que haga falta, suavizado y sin quedarse corto
                from scipy.ndimage import gaussian_filter1d
                lleno = prenda | m; filas = np.arange(640, 900)
                for lado in (-1, 1):
                    ext = np.array([(np.flatnonzero(lleno[y]).min() if lado < 0 else np.flatnonzero(lleno[y]).max()) if lleno[y].any() else (W // 2) for y in filas], float)
                    sm = gaussian_filter1d(ext, 5)
                    sm = np.minimum(sm, ext) if lado < 0 else np.maximum(sm, ext)
                    sm = gaussian_filter1d(sm, 2); sm = np.minimum(sm, ext) if lado < 0 else np.maximum(sm, ext)
                    for y, e, t in zip(filas, ext, sm):
                        a0, a1 = (int(np.floor(t)), int(e)) if lado < 0 else (int(e) + 1, int(np.ceil(t)) + 1)
                        if a1 > a0:
                            m[y, a0:a1] |= nd.binary_dilation(prenda, iterations=12)[y, a0:a1]
            # con la tela azul de al lado (no la de las lunas y estrellas, que son claras)
            tela = (c[..., 3] == 255) & (b < -6)
            _, (iy, ix) = nd.distance_transform_edt(~tela, return_indices=True)
            c = c.copy(); c[m, :3] = c[iy[m], ix[m], :3]; c[m, 3] = np.maximum(c[m, 3], np.where(base[m, 3] > 0, base[m, 3], 255))
            capas[nombre] = c; Image.fromarray(c, 'RGBA').save(SAL / f'{nombre}.png', optimize=True)
        ampliado[nombre] = m
        Image.fromarray(np.where(m, 255, 0).astype(np.uint8)).save(AQUI / f'mascara-ampliado-{nombre}.png', optimize=True)
    # comprobaciones
    tapa = 1 - np.prod([1 - c[..., 3] / 255 for c in capas.values()], 0)
    rosa_vista = ropa & (tapa < 0.5)
    pijama = reg != 4
    caja = lambda m: [int(np.where(m)[1].min()), int(np.where(m)[0].min()), int(np.where(m)[1].max()), int(np.where(m)[0].max())] if m.any() else None
    cara = nd.binary_erosion(base[..., 3] > 128, iterations=4) & (YY < 630); mano = nd.binary_erosion(base[..., 3] > 128, iterations=4) & manos & ~pijama
    comp = dict(recibida=str(RECIBIDA.relative_to(PJ)), sha256=antes, recibida_sin_cambios=sha(RECIBIDA) == antes, alineacion=info,
                prendas={k: dict(px=int((v[..., 3] > 128).sum()), caja=caja(v[..., 3] > 128)) for k, v in capas.items()},
                fuera_del_pijama=dict(cara_mediana_dE=round(float(np.median(d[cara])), 2), manos_mediana_dE=round(float(np.median(d[mano])), 2)),
                ampliado_para_tapar_el_rosa_px={k: dict(px=int(m.sum()), caja=caja(m)) for k, m in ampliado.items()},
                ropa_rosa_de_la_base_px=int(ropa.sum()), ropa_rosa_a_la_vista_antes_de_ampliar_px=int((ropa & (tapa0 < 0.5)).sum()), ropa_rosa_a_la_vista_px=int(rosa_vista.sum()), ropa_rosa_a_la_vista_caja=caja(rosa_vista),
                pies_fuera_de_las_zapatillas_px=int(((base[..., 3] > 128) & (YY > 1440) & (capas['zapatillas'][..., 3] < 128) & (capas['pantalon'][..., 3] < 128)).sum()))
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # montajes
    ab = PT.abrir; ojos = ab(PT.OJOS['marron']); pij = [capas['zapatillas'], capas['pantalon'], capas['camiseta']]
    def montar(cs):
        f = Image.new('RGBA', (W, H), CREMA + (255,))
        for c in cs:
            f.alpha_composite(Image.fromarray(c) if isinstance(c, np.ndarray) else Image.open(c).convert('RGBA'))
        return f.convert('RGB')
    vistas = [('Sin pelo', [base, ojos, *pij]),
              ('Melena con el gorrito B', [PC / 'pelo-detras-castano.png', base, ojos, *pij, PC / 'pelo-delante-castano.png', GORRITO]),
              ('Coleta (con cinta)', [ab(COLETA / 'variantes' / 'orejas-coleta-detras.png'), PC / 'pelo-coleta-con-detras-castano.png', base, ojos, *pij,
                                      ab(COLETA / 'variantes' / 'orejas-coleta-delante.png'), COLETA / 'variantes' / 'pelo-coleta-con-delante-castano.png', COLETA / 'cinta-coleta.png']),
              ('Dos coletas (sin sombrero)', [PC / 'pelo-coletas-sin-sombrero-detras-castano.png', base, ojos, *pij,
                                              COLETAS / 'variantes' / 'pelo-coletas-sin-sombrero-delante-castano.png', COLETAS / 'coleteros.png'])]
    F = PT.MK.F(20); c0 = (60, 40, 890, 1600); esc = 0.5; w, h = int((c0[2] - c0[0]) * esc), int((c0[3] - c0[1]) * esc)
    o = Image.new('RGB', (len(vistas) * (w + 10) + 10, h + 40), 'white'); dr = ImageDraw.Draw(o)
    for i, (t, cs) in enumerate(vistas):
        m = montar(cs); m.save(AQUI / f'montaje-{i + 1}.png', optimize=True)
        o.paste(m.crop(c0).resize((w, h), Image.LANCZOS), (10 + i * (w + 10), 36)); dr.text((14 + i * (w + 10), 8), t, font=F, fill=(40, 40, 60))
    o.save(AQUI / 'montajes-peinados.png', optimize=True)
    # la recibida, alineada, frente a nuestro montaje sin pelo
    m1 = montar(vistas[0][1]); o2 = Image.new('RGB', (2 * w + 30, h + 40), 'white'); dr = ImageDraw.Draw(o2)
    for i, (im, t) in enumerate(((Image.fromarray(ali), 'Imagen de ChatGPT (alineada)'), (m1, 'Nuestra muñeca + solo el pijama'))):
        o2.paste(im.crop(c0).resize((w, h), Image.LANCZOS), (10 + i * (w + 10), 36)); dr.text((14 + i * (w + 10), 8), t, font=F, fill=(40, 40, 60))
    o2.save(AQUI / 'comparacion-recibida.png', optimize=True)
    print(json.dumps(comp, ensure_ascii=False))
