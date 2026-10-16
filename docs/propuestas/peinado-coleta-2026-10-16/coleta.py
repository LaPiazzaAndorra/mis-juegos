#!/usr/bin/env python3
"""
Peinado nuevo «coleta alta rizada con cinta deportiva lila» (D-025): de la imagen aprobada
(referencias/referencia-coleta-cinta-aprobada.png, generada, sin modificar) se toman SOLO el pelo y la cinta, en tres
capas, y se adaptan a NUESTRA base (no se toman la cara, el cuerpo ni el vestido de la imagen; nuestra muñeca no cambia).

1. Regiones de la imagen (fondo, pelo, piel, cinta, vestido): semillas claras de cada una (fondo crema; pelo oscuro;
   piel lisa de la cara y las orejas; lila de la cinta; rosa del vestido) y reparto del resto por contraste (watershed).
   Los ojos, las cejas, la nariz y la boca de la imagen (encerrados por su piel) y la sombra del cuello no son pelo.
2. Encaje: la imagen se pasa a nuestro lienzo con la escala y la posición de los ojos (centros de los iris), sin deformar.
3. Capas (948 × 1659):
   · pelo de detrás: el pelo que queda fuera de nuestra cabeza (la coleta, los rizos de los lados) — va detrás de la base;
   · pelo de delante: el pelo que cae sobre nuestra cabeza (nacimiento del pelo, sienes) — va encima de la base;
   · cinta: la cinta con su estrella — encima del pelo. Se puede poner y quitar SOLO cuando haya pelo completo debajo:
     la imagen no tiene pelo bajo la cinta (ver guia-chatgpt/).
   Borde suave de 1 px, quitando el color del fondo o de la piel de la imagen (sin halo).

Uso (desde la raíz): python3 docs/propuestas/peinado-coleta-2026-10-16/coleta.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; B = RAIZ / 'docs' / 'propuestas' / 'base-aprobada-d013-2026-10-14'
sys.path[:0] = [str(B / 'piel-tonos'), str(B / 'ojos-abiertos')]
import piel_tonos as PT   # noqa: E402
MK = PT.MK

REF = AQUI / 'referencias' / 'referencia-coleta-cinta-aprobada.png'
OJOS_REF = [(560, 666), (798, 669)]          # centros de los iris medidos en la imagen
OJOS = [(391, 444), (565, 444)]              # los de nuestra muñeca
CUELLO_REF = (590, 860, 790, 960)            # sombra del cuello en la imagen (no es pelo)
FONDO, PELO, PIEL, CINTA, VESTIDO = 1, 2, 3, 4, 5


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def regiones(lab):
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]; C = np.hypot(a, b); h = np.degrees(np.arctan2(b, a))
    YY, XX = np.mgrid[0:L.shape[0], 0:L.shape[1]]
    var = np.sqrt(np.maximum(nd.uniform_filter(L * L, 7) - nd.uniform_filter(L, 7) ** 2, 0))
    piel = (L > 165) & (h > 30) & (h < 70) & (C > 15) & (C < 55) & (var < 5) & (YY > 400) & (YY < 900) & (XX > 330) & (XX < 1010)
    piel = nd.binary_erosion(piel, iterations=3); et, n = nd.label(piel); s = nd.sum(piel, et, range(1, n + 1))
    piel = np.isin(et, 1 + np.where(s > 800)[0])
    sem = np.zeros(L.shape, np.int32)
    sem[(L > 240) & (C < 6)] = FONDO
    sem[nd.binary_erosion((L < 150) & (h > 35) & (h < 75) & (C > 25), iterations=2)] = PELO
    sem[piel] = PIEL
    sem[nd.binary_erosion((h < -5) & (h > -80) & (C > 12) & (YY < 560), iterations=1)] = CINTA
    sem[nd.binary_erosion((YY > 880) & (h < 30) & (h > -40) & (C > 8), iterations=2)] = VESTIDO
    grad = np.sqrt(sum(nd.sobel(nd.gaussian_filter(lab[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(lab[..., i], 1), 1) ** 2 for i in range(3)))
    reg = watershed(grad, sem)
    # la estrella de la cinta (encerrada por la cinta) es cinta
    cinta = nd.binary_fill_holes(reg == CINTA); reg[cinta] = CINTA
    # ojos, cejas, nariz y boca de la imagen (encerrados por la piel) y la sombra del cuello no son pelo
    cara = nd.binary_fill_holes(reg == PIEL); reg[cara & (reg == PELO)] = PIEL
    x0, y0, x1, y1 = CUELLO_REF; cu = np.zeros(L.shape, bool); cu[y0:y1, x0:x1] = True; reg[cu & (reg == PELO)] = PIEL
    return reg


def suave(m, rgb, otro):
    """Capa RGBA con borde suave de 1 px; en el borde se quita el color de lo que hay al lado (fondo o piel)."""
    fuera = otro & ~nd.binary_dilation(m, iterations=1)
    den = nd.gaussian_filter(fuera.astype(float), 3)
    vec = np.stack([nd.gaussian_filter(rgb[..., i] * fuera, 3) for i in range(3)], -1) / np.maximum(den, 1e-6)[..., None]
    a = np.clip(nd.gaussian_filter(m.astype(float), 0.8) * 1.6 - 0.3, 0, 1) * nd.binary_dilation(m, iterations=1)
    a = np.where(m & ~nd.binary_dilation(~m, iterations=1), 1.0, a)
    col = np.where(a[..., None] > 0, (rgb - (1 - a[..., None]) * np.where(den[..., None] > 0.02, vec, rgb)) / np.maximum(a[..., None], 0.05), 0)
    return np.dstack([np.clip(col, 0, 255), a * 255]).round().astype(np.uint8)


def a_nuestro_lienzo(capa):
    (ax, ay), (bx, by) = OJOS_REF; (cx, cy), (dx, dy) = OJOS
    s = np.hypot(dx - cx, dy - cy) / np.hypot(bx - ax, by - ay)
    mx, my = (ax + bx) / 2, (ay + by) / 2; nx, ny = (cx + dx) / 2, (cy + dy) / 2
    a = capa.astype(float); al = a[..., 3:] / 255; pre = np.dstack([a[..., :3] * al, a[..., 3:]])
    t = (1 / s, 0, mx - nx / s, 0, 1 / s, my - ny / s)
    c = np.stack([np.array(Image.fromarray(pre[..., i].astype(np.float32), 'F').transform((948, 1659), Image.AFFINE, t, Image.BICUBIC)) for i in range(4)], -1)
    A = np.clip(c[..., 3], 0, 255); rgb = c[..., :3] / np.maximum(A[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), A]).round().astype(np.uint8); out[A < 2] = 0
    return out, s, t


if __name__ == '__main__':
    fuentes = [REF, PT.SIN_OJOS, PT.OJOS['marron'], PT.CERRADOS]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    im = Image.open(REF).convert('RGBA'); rgb = np.array(im)[..., :3].astype(float); lab = MK.lab_de(im).astype(float)
    reg = regiones(lab)
    pelo = suave(reg == PELO, rgb, (reg == FONDO) | (reg == PIEL)); cinta = suave(reg == CINTA, rgb, (reg == FONDO) | (reg == PIEL))
    pelo_n, s, t = a_nuestro_lienzo(pelo); cinta_n, _, _ = a_nuestro_lienzo(cinta)
    # delante / detrás: lo que cae sobre nuestra cabeza (base, por encima de la barbilla) va delante
    base = PT.abrir(PT.SIN_OJOS); YY = np.mgrid[0:1659, 0:948][0]
    cabeza = nd.binary_dilation((base[..., 3] > 0) & (YY < 600), iterations=2)
    delante = pelo_n.copy(); delante[~cabeza] = 0
    detras = pelo_n.copy()
    for nombre, c in (('pelo-coleta-detras', detras), ('pelo-coleta-delante', delante), ('cinta-coleta', cinta_n)):
        Image.fromarray(c, 'RGBA').save(AQUI / 'capas' / f'{nombre}.png', optimize=True)
    # comprobaciones sobre nuestra muñeca
    lb = PT.lab_de(base); wb, _ = PT.peso_base(base, lb)
    ojos = (PT.abrir(PT.OJOS['marron'])[..., 3] > 0) | (PT.abrir(PT.CERRADOS)[..., 3] > 0)
    cub = (delante[..., 3] > 128) | (cinta_n[..., 3] > 128)
    craneo = (base[..., 3] > 0) & (YY < 330)
    R = np.array(Image.fromarray(reg.astype(np.uint8)).transform((948, 1659), Image.AFFINE, t, Image.NEAREST))
    hueco = (R == CINTA) & ~nd.binary_dilation((R == PELO), iterations=0)
    comp = dict(escala=round(float(s), 4), px={k: int((c[..., 3] > 0).sum()) for k, c in (('detras', detras), ('delante', delante), ('cinta', cinta_n))},
                pelo_sobre_nuestros_ojos_px=int((delante[..., 3] > 0)[ojos].sum()),
                cinta_sobre_nuestros_ojos_px=int((cinta_n[..., 3] > 0)[ojos].sum()),
                craneo_cubierto_por_pelo_o_cinta=round(float((cub & craneo).sum() / craneo.sum()), 3),
                craneo_visible_como_frente_px=int((craneo & ~cub).sum()),
                fondo_de_la_imagen_sobre_nuestra_cabeza_px=int(((R == FONDO) & (base[..., 3] > 0) & (YY < 600) & ~ojos).sum()),
                bajo_la_cinta_sin_pelo_px=int((cinta_n[..., 3] > 0).sum()),
                sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'capas' / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # vistas: montaje candidato (y lo que queda bajo la cinta si se quita), y regiones de la imagen
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
    ab = PT.abrir(PT.OJOS['marron'])
    comun = lambda pd, pl, ci: PT.montar([pd, base, ab, f['zapatos'], f['vestido'], PT.abrir(PT.MANOS), pl] + ([ci] if ci is not None else []))
    vistas = [('Melena suelta (aprobada)', PT.montar([f['pelo-detras'], base, ab, f['zapatos'], f['vestido'], PT.abrir(PT.MANOS), f['pelo-delante']])),
              ('Coleta con cinta (candidata)', comun(detras, delante, cinta_n)),
              ('Sin la cinta: falta pelo debajo', comun(detras, delante, None))]
    caja = (60, 0, 940, 900); esc = 0.55
    tiles = [(n, v.crop(caja).resize((round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)), Image.LANCZOS)) for n, v in vistas]
    w, h = tiles[0][1].size; out = Image.new('RGB', (3 * (w + 8), h + 30), 'white'); d = ImageDraw.Draw(out)
    for i, (n, v) in enumerate(tiles):
        out.paste(v, (i * (w + 8), 28)); d.text((i * (w + 8) + 4, 5), n, font=MK.F(17), fill=(40, 40, 60))
    out.save(AQUI / 'capas' / 'comparacion-coleta.png', optimize=True)
    cols = {FONDO: (255, 255, 255), PELO: (140, 80, 40), PIEL: (250, 200, 170), CINTA: (170, 120, 230), VESTIDO: (255, 150, 200)}
    v = np.zeros(rgb.shape, np.uint8)
    for k, c in cols.items():
        v[reg == k] = c
    Image.fromarray(np.concatenate([rgb.astype(np.uint8), v], 1)).resize((1402, 561), Image.LANCZOS).save(AQUI / 'capas' / 'regiones-de-la-imagen.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
