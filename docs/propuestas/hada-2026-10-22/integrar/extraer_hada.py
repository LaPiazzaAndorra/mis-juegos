#!/usr/bin/env python3
"""
Conjunto de hada (D-029, candidato): de las tres imágenes de ChatGPT (guia-chatgpt/de-chatgpt/, sin modificar) se toman
SOLO el vestido, las bailarinas, las alas y la varita, cada uno en su capa (capas/), sobre NUESTRA muñeca original (nada
de su cara, piel, cuerpo, pelo ni postura). Cada pieza se coloca por separado (escala uniforme y desplazamiento, sin
deformarla); no se supone que coincidan por compartir encuadre.

1. Conjunto sin pelo: alineado con nuestra plantilla sin pelo por los ojos y afinado por la cara, la mano libre y las
   piernas (escala ESCALA_CONJUNTO). De ahí, el vestido y las bailarinas (reparto por contraste con semillas). La manga
   de farol es más corta que la manga de la camiseta de nuestra base: la piel del brazo que ChatGPT pintó debajo no va en
   el vestido; el brazo se completa en una copia de la base (base-hada.png: la manga rosa y la sombra de su dobladillo
   bajo la manga de farol, con nuestra piel de justo debajo reflejada por columnas). La base aprobada no cambia.
2. Alas solas: colocadas sobre las alas que se ven en el conjunto (búsqueda de escala y posición que mejor cubre lo
   visible): escala ALAS['s'] (casi la misma), desplazamiento (ALAS['dx'], ALAS['dy']). Dos capas:
   - alas.png (por defecto): la FORMA de las alas solas y, donde las alas se ven en el conjunto (fuera del cuerpo, del
     vestido y de la varita), su COLOR del diseño; el resto (lo que tapan el cuerpo y la varita), de las alas solas con el
     color medio igualado al del diseño;
   - alas-solas.png: las alas solas tal cual (más saturadas y con el contorno dorado más grueso que en el diseño).
3. Varita sola: en su imagen está unas 3 veces más grande: colocada sobre la del conjunto (búsqueda de escala, giro y
   posición): escala VARITA['s'], sin giro. Capa varita.png y, encima, dedos.png: nuestra mano donde la cruza la varita
   (el palo pasa por detrás de la mano y asoma por arriba y por abajo). No se copia la mano de ChatGPT (la cerró para
   agarrar la varita): se conserva la nuestra.
4. Comprobaciones (comprobaciones.json) y montajes (sin pelo, melena, coleta con cinta y dos coletas sin sombrero; con y
   sin alas y varita). Orden de las capas: alas (detrás de todo, también del pelo de detrás), pelo de detrás, base-hada, ojos,
   bailarinas, vestido, manos de delante, pelo de delante, varita, dedos.

Uso (desde la raíz): python3 docs/propuestas/hada-2026-10-22/integrar/extraer_hada.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; HD = AQUI.parent; P = HD.parent; B = P / 'base-aprobada-d013-2026-10-14'
sys.path.insert(0, str(P / 'conjunto-aventura-2026-10-18' / 'integrar')); import recibir as R   # noqa: E402
PT, A = R.PT, R.A; H, W = R.H, R.W; CREMA = R.CREMA
DE = HD / 'guia-chatgpt' / 'de-chatgpt'
CONJUNTO, ALAS_IMG, VARITA_IMG = DE / 'conjunto-sin-pelo-chatgpt.png', DE / 'alas-chatgpt.png', DE / 'varita-chatgpt.png'
PLANTILLA = HD / 'guia-chatgpt' / 'plantilla-sin-pelo.png'
SAL = AQUI / 'capas'
# medidas (de las búsquedas descritas arriba; en el LEEME, cómo se hicieron)
ESCALA_CONJUNTO = dict(s=1.0023, dx=-0.63, dy=0.90)
ALAS = dict(s=0.9925, dx=5.555, dy=3.625)
VARITA = dict(s=0.318, ang=0.0, cx=112.5, cy=916.0)
PC = B / 'pelo-sin-restos' / 'conjunto'
COLETA = P / 'peinado-coleta-2026-10-16' / 'capas'; COLETAS = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas'
MANOS = P / 'vestido-rosa-2026-10-15' / 'montaje' / 'brazos-delante-copiados-de-la-base.png'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def poner(im, s, dx, dy, filtro=Image.BICUBIC, fondo=None):
    return np.array(im.transform((W, H), Image.AFFINE, (1 / s, 0, -dx / s, 0, 1 / s, -dy / s), filtro, fillcolor=fondo))


def varita_colocada():
    V = Image.open(VARITA_IMG).convert('RGBA'); a = np.array(V); ys, xs = np.where(a[..., 3] > 128)
    Vc = V.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    v = Vc.resize((round(Vc.width * VARITA['s']), round(Vc.height * VARITA['s'])), Image.LANCZOS).rotate(VARITA['ang'], Image.BICUBIC, expand=True)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); out.paste(v, (round(VARITA['cx'] - v.width / 2), round(VARITA['cy'] - v.height / 2)), v)
    return np.array(out), dict(recorte=[Vc.width, Vc.height], en_el_lienzo=[v.width, v.height])


if __name__ == '__main__':
    antes = {p.name: sha(p) for p in (CONJUNTO, ALAS_IMG, VARITA_IMG)}
    YY, XX = np.mgrid[0:H, 0:W]
    pl = np.array(Image.open(PLANTILLA).convert('RGB'))
    base = PT.abrir(PT.SIN_OJOS); cuerpo = base[..., 3] > 128
    ali = poner(Image.open(CONJUNTO).convert('RGB'), ESCALA_CONJUNTO['s'], ESCALA_CONJUNTO['dx'], ESCALA_CONJUNTO['dy'], fondo=CREMA)
    Image.fromarray(ali).save(AQUI / 'conjunto-alineado.png', optimize=True)
    d = R.diferencia(ali, pl); L = R.lab(ali)
    # varita y dedos
    var, info_var = varita_colocada()
    mano = cuerpo & (YY > 990) & (YY < 1140) & (XX < 340)
    # agarre: nuestra mano es más abierta que la que dibujó ChatGPT (no se copia la suya): el palo pasa por DETRÁS de toda
    # la mano (los dedos, delante) y asoma por encima y por debajo de ella
    dedos = mano & (var[..., 3] > 0)
    dedos_capa = base.copy(); dedos_capa[~dedos] = 0
    # alas: forma de las alas solas
    alas_s = poner(Image.open(ALAS_IMG).convert('RGBA'), ALAS['s'], ALAS['dx'], ALAS['dy'])
    forma = alas_s[..., 3] > 0
    # vestido y bailarinas: reparto por contraste
    cambia = d > 10
    sem = np.zeros((H, W), np.int32)
    sem[nd.binary_erosion(cambia & cuerpo & (YY > 650) & (YY < 1330), iterations=3) & ~mano] = 1          # vestido
    sem[nd.binary_erosion(cambia & (YY > 1160) & (YY < 1345) & (XX > 150) & (XX < 800), iterations=2)] = 1
    sem[nd.binary_erosion(cambia & (YY > 1445), iterations=1)] = 2                                         # bailarinas
    sem[nd.binary_erosion(forma & ~nd.binary_dilation(cuerpo, iterations=8) & (YY < 990) & (var[..., 3] == 0), iterations=2)] = 3   # alas
    sem[nd.binary_erosion(var[..., 3] > 200, iterations=1) & ~dedos] = 4                                   # varita
    sem[nd.binary_erosion(~cambia, iterations=2)] = 5                                                      # nuestra muñeca y el fondo
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(L[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(L[..., i], 1), 1) ** 2 for i in range(3)))
    reg = watershed(g, sem)
    for k in (1, 2):
        m = nd.binary_fill_holes(reg == k) & (reg == 5); et, n = nd.label(m); t = nd.sum(m, et, range(1, n + 1))
        reg[np.isin(et, 1 + np.where(t < 3000)[0])] = k
        m = reg == k; et, n = nd.label(m); t = nd.sum(m, et, range(1, n + 1)); reg[m & ~np.isin(et, 1 + np.where(t > 1500)[0])] = 5
    # la manga de farol de la imagen es más corta que la manga de la camiseta de nuestra base: debajo, ChatGPT pintó piel
    # del brazo. Esa piel NO es del vestido: se quita de él y el brazo se completa en una COPIA de la base (base-hada.png)
    # con nuestra propia piel (la base aprobada no cambia)
    ropa = PT.MV.ropa_de_la_base(base); Lb = PT.lab_de(base).astype(float)
    brazos = ((XX < 380) | (XX > 580)) & (YY > 680) & (YY < 900)
    h = np.degrees(np.arctan2(L[..., 2], L[..., 1]))
    pielcg = (reg == 1) & brazos & (L[..., 0] > 120) & (h > 40) & (h < 75) & (np.hypot(L[..., 1], L[..., 2]) > 18)
    pielcg = nd.binary_opening(pielcg, iterations=1)
    # solo por debajo del borde de la manga en cada columna (la tela transparente de la manga deja ver el hombro: eso es
    # del vestido)
    pielcg &= YY > 755                     # el volante de las mangas acaba en y ≈ 765–800 (medido en la imagen alineada)
    # solo la piel que sigue al brazo (toca nuestra piel del brazo, que la imagen no cambia); los trocitos de color piel
    # dentro de la manga (reflejos de la tela rosa) son del vestido
    brazo_igual = (d < 8) & cuerpo & brazos & ~nd.binary_dilation(PT.MV.ropa_de_la_base(base), iterations=1)
    et, n = nd.label(pielcg); toca = np.unique(et[nd.binary_dilation(brazo_igual, iterations=2) & pielcg]); pielcg = np.isin(et, toca[toca > 0])
    reg[pielcg] = 5
    # lo que hay que completar: la manga rosa de la base bajo la manga de farol y la sombra de su dobladillo (6 px por
    # debajo); se completa con NUESTRA piel de justo debajo, reflejada en cada columna (como la cintura del pantalón de
    # aventura): sin escalón de tono y sin tomar piel de la imagen
    completar = (ropa | (nd.binary_dilation(ropa, iterations=6) & (base[..., 3] > 250))) & brazos & nd.binary_dilation(reg != 1, iterations=1)
    completar &= (YY > 700)
    base_h = base.copy(); dif_piel = np.zeros(3)
    for x in np.unique(np.where(completar)[1]):
        ys = np.where(completar[:, x])[0]; yb = ys.max()
        for y in ys:
            src = 2 * yb + 1 - y
            if src < H and base[src, x, 3] > 250 and not ropa[src, x]:
                base_h[y, x] = base[src, x]
            else:
                completar[y, x] = False
    # lo que no se pudo reflejar (junto a la axila): la piel del brazo más cercana, suavizada
    resto = (ropa | (nd.binary_dilation(ropa, iterations=6) & (base[..., 3] > 250))) & brazos & (YY > 700) & ~completar & (reg != 1)
    piel_b = (base[..., 3] > 250) & ~ropa & brazos & (YY > 700)
    _, (iy, ix) = nd.distance_transform_edt(~piel_b, return_indices=True)
    base_h[resto] = base[iy[resto], ix[resto]]; base_h[resto, 3] = base[resto, 3]; completar |= resto
    # y se suaviza por difusión desde su borde (sin bloques): cada píxel, la media de sus vecinos, muchas veces
    col = base_h[..., :3].astype(float)
    for _ in range(300):
        prom = (np.roll(col, 1, 0) + np.roll(col, -1, 0) + np.roll(col, 1, 1) + np.roll(col, -1, 1)) / 4
        col[resto] = prom[resto]
    base_h[resto, :3] = np.round(col[resto]).astype(np.uint8)
    Image.fromarray(base_h).save(AQUI / 'base-hada.png', optimize=True)
    Image.fromarray(np.where(completar, 255, 0).astype(np.uint8)).save(AQUI / 'mascara-brazos.png', optimize=True)
    base0 = base; base = base_h
    SAL.mkdir(exist_ok=True); capas = {}
    capas['vestido'] = A.CO.suave(reg == 1, ali, reg != 1)
    # donde asoma la ropa rosa de la base (unión de las mangas con el cuerpo, junto a los hombros), el vestido se alarga
    # con su propia tela (la del píxel opaco más cercano) hasta taparla
    v = capas['vestido']; ropa_v = ropa & ~completar
    falta = nd.binary_dilation(ropa_v & (v[..., 3] < 128), iterations=1) & (base[..., 3] > 0) & (v[..., 3] < 250) & (YY < 1000)
    _, (iy, ix) = nd.distance_transform_edt(~(v[..., 3] == 255), return_indices=True)
    v = v.copy(); v[falta, :3] = v[iy[falta], ix[falta], :3]; v[falta, 3] = np.maximum(v[falta, 3], base[falta, 3])
    propia = falta & cambia & (reg != 3) & (reg != 4)          # donde la imagen ya tiene el vestido (la manga), su color
    v[propia, :3] = ali[propia]; capas['vestido'] = v
    capas['bailarinas'] = A.CO.suave(reg == 2, ali, reg != 2)
    # alas del diseño: color del conjunto donde se ven; el resto, de las alas solas con el color medio igualado
    se_ve = forma & (reg == 3) & nd.binary_erosion(forma, iterations=3)
    Ls = R.lab(alas_s[..., :3]); dif = np.median(L[se_ve] - Ls[se_ve], 0)
    igual = np.clip(PT.CP.lab_a_rgb(Ls + dif), 0, 255).astype(np.uint8)
    alas = alas_s.copy(); alas[..., :3] = igual; alas[se_ve, :3] = ali[se_ve]
    capas['alas'] = alas; capas['alas-solas'] = alas_s; capas['varita'] = var; capas['dedos'] = dedos_capa
    for k, c in capas.items():
        Image.fromarray(c, 'RGBA').save(SAL / f'{k}.png', optimize=True)
    # comprobaciones
    tapa = 1 - (1 - capas['vestido'][..., 3] / 255) * (1 - capas['bailarinas'][..., 3] / 255)
    caja = lambda m: [int(np.where(m)[1].min()), int(np.where(m)[0].min()), int(np.where(m)[1].max()), int(np.where(m)[0].max())] if m.any() else None
    cara = nd.binary_erosion(cuerpo, iterations=4) & (YY < 620)
    pies = cuerpo & (YY > 1440)
    comp = dict(sha256_recibidas=antes, recibidas_sin_cambios=antes == {p.name: sha(p) for p in (CONJUNTO, ALAS_IMG, VARITA_IMG)},
                conjunto=dict(ESCALA_CONJUNTO, cara_mediana_dE=round(float(np.median(d[cara])), 2)),
                alas=dict(ALAS, visibles_en_el_conjunto_px=int(se_ve.sum()), diferencia_de_color_media_Lab=[round(float(x), 1) for x in dif]),
                varita=dict(VARITA, **info_var, dedos_delante_del_palo_px=int(dedos.sum())),
                prendas={k: dict(px=int((capas[k][..., 3] > 128).sum()), caja=caja(capas[k][..., 3] > 128)) for k in capas},
                vestido_alargado_px=int(falta.sum()), brazos_completados_en_la_copia_de_la_base_px=int(completar.sum()),
                ropa_rosa_a_la_vista_px=int((ropa & ~completar & (tapa < 0.5)).sum()), ropa_rosa_a_la_vista_caja=caja(ropa & ~completar & (tapa < 0.5)),
                pies_a_la_vista_px=int((pies & (capas['bailarinas'][..., 3] < 128)).sum()))
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # montajes
    ab = PT.abrir; ojos = ab(PT.OJOS['marron']); manos = ab(MANOS)

    def montar(detras, delante, con_alas=True, con_varita=True):
        cs = ([capas['alas']] if con_alas else []) + detras + [base, ojos, capas['bailarinas'], capas['vestido'], manos] + delante
        cs += [capas['varita'], capas['dedos']] if con_varita else []
        f = Image.new('RGBA', (W, H), CREMA + (255,))
        for c in cs:
            f.alpha_composite(Image.fromarray(c) if isinstance(c, np.ndarray) else Image.open(c).convert('RGBA'))
        return f.convert('RGB')
    peinados = [('Sin pelo', [], []),
                ('Melena', [PC / 'pelo-detras-castano.png'], [PC / 'pelo-delante-castano.png']),
                ('Coleta (con cinta)', [ab(COLETA / 'variantes' / 'orejas-coleta-detras.png'), PC / 'pelo-coleta-con-detras-castano.png'],
                 [ab(COLETA / 'variantes' / 'orejas-coleta-delante.png'), COLETA / 'variantes' / 'pelo-coleta-con-delante-castano.png', COLETA / 'cinta-coleta.png']),
                ('Dos coletas (sin sombrero)', [PC / 'pelo-coletas-sin-sombrero-detras-castano.png'],
                 [COLETAS / 'variantes' / 'pelo-coletas-sin-sombrero-delante-castano.png', COLETAS / 'coleteros.png'])]
    F = PT.MK.F(20); c0 = (10, 40, 940, 1600); esc = 0.42; w, h = int((c0[2] - c0[0]) * esc), int((c0[3] - c0[1]) * esc)
    o = Image.new('RGB', (len(peinados) * (w + 10) + 10, 2 * (h + 40)), 'white'); dr = ImageDraw.Draw(o)
    for i, (t, dt, de) in enumerate(peinados):
        for j, (ca, cv, sub) in enumerate(((True, True, 'con alas y varita'), (False, False, 'sin alas ni varita'))):
            m = montar(dt, de, ca, cv)
            if j == 0:
                m.save(AQUI / f'montaje-{i + 1}.png', optimize=True)
            o.paste(m.crop(c0).resize((w, h), Image.LANCZOS), (10 + i * (w + 10), 36 + j * (h + 40))); dr.text((14 + i * (w + 10), 8 + j * (h + 40)), f'{t} · {sub}', font=F, fill=(40, 40, 60))
    o.save(AQUI / 'montajes-peinados.png', optimize=True)
    # comparación: imagen alineada frente a nuestra muñeca con solo las piezas (sin pelo)
    m1 = montar([], []); o2 = Image.new('RGB', (2 * w + 30, h + 40), 'white'); dr = ImageDraw.Draw(o2)
    for i, (im, t) in enumerate(((Image.fromarray(ali), 'Imagen de ChatGPT (alineada)'), (m1, 'Nuestra muñeca + solo las piezas'))):
        o2.paste(im.crop(c0).resize((w, h), Image.LANCZOS), (10 + i * (w + 10), 36)); dr.text((14 + i * (w + 10), 8), t, font=F, fill=(40, 40, 60))
    o2.save(AQUI / 'comparacion-recibida.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_recibidas'}, ensure_ascii=False))
