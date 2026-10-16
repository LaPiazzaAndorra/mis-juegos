#!/usr/bin/env python3
"""
Diadema de estrellas de frente (D-024): se extrae SOLO el arco dorado, las dos estrellas y las perlas de la imagen
aprobada (referencia-diadema-de-frente-aprobada.png, generada, sin modificar), sin pelo ni piel, y se coloca sobre
NUESTRA muñeca (que no cambia).

Extracción:
  · arco: el camino «más dorado» entre sus dos puntas (medidas en la imagen) y una franja fina (4 px) alrededor;
  · adornos: junto al arco, manchas de color de la diadema rellenas por dentro, solo donde están los adornos (la perla
    de la izquierda y el grupo de estrellas, perlas y bolitas); los brillos del pelo de la imagen no entran;
  · borde: suave (1 px), quitando el color del pelo de alrededor de los píxeles del borde (sin halo marrón).
Encaje: la imagen tiene otro encuadre; se pasa a nuestro lienzo con la escala y la posición de los ojos (centros de los
iris medidos en las dos), sin deformar. Se comprueba que no toca la piel que se ve ni la corona y que queda sobre el pelo.

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/diadema/diadema.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.graph import route_through_array

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[3]; B = RAIZ / 'docs' / 'propuestas' / 'base-aprobada-d013-2026-10-14'
sys.path[:0] = [str(B / 'piel-tonos'), str(B / 'ojos-abiertos')]
import piel_tonos as PT   # noqa: E402
MK = PT.MK

REF = AQUI / 'referencia-diadema-de-frente-aprobada.png'
ZONA = (360, 190, 1040, 440)                  # recuadro de la diadema en la imagen
OJOS_REF = [(576, 653), (832, 653)]          # centros de los iris medidos en la imagen
OJOS = [(391, 444), (565, 444)]              # los de nuestra muñeca
EXTREMOS = [(383, 398), (1013, 414)]
ADORNOS = [(400, 445, 305, 350), (740, 1005, 200, 345)]   # (x0, x1, y0, y1) de la perla izquierda y del grupo de estrellas        # puntas del arco en la imagen (medidas)
AJUSTE = (0, 0)                              # ajuste fino de la colocación (px en nuestro lienzo)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def trazar_arco(oro, inicio, fin):
    """El arco como el camino «más dorado» entre sus dos extremos (camino de coste mínimo)."""
    coste = np.where(oro, 1.0, 40.0)
    camino, _ = route_through_array(coste, (inicio[1], inicio[0]), (fin[1], fin[0]), fully_connected=True, geometric=True)
    m = np.zeros(oro.shape, bool); r, c = np.array(camino).T; m[r, c] = True
    return m


def extraer():
    im = Image.open(REF).convert('RGBA'); x0, y0, x1, y1 = ZONA
    lab = MK.lab_de(im).astype(float)[y0:y1, x0:x1]; rgb = np.array(im)[y0:y1, x0:x1, :3].astype(float)
    L, C = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2]); h = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    oro = (h > 62) & (h < 100) & (C > 12) & (L > 110)
    linea = trazar_arco(nd.binary_closing(oro, iterations=1), *[(x - x0, y - y0) for x, y in EXTREMOS])
    d = nd.distance_transform_edt(~linea)
    en_x = np.ones(L.shape, bool)
    color_diadema = ((h > 60) & (h < 100) & (C > 12)) | ((C < 14) & (L > 165)) | ((h > -80) & (h < 25) & (L > 150) & (C > 6))
    arco = (d < 5) & en_x & color_diadema
    # adornos: dentro de las dos zonas donde están (perla izquierda; grupo de estrellas, perlas y bolitas), lo que tiene
    # color de la diadema junto al arco, cerrado y relleno; fuera de esas zonas solo hay arco (los brillos del pelo no entran)
    YY, XX = np.mgrid[0:L.shape[0], 0:L.shape[1]]
    zona = np.zeros(L.shape, bool)
    for a_, b_, c_, e_ in ADORNOS:
        zona |= (XX + x0 >= a_) & (XX + x0 <= b_) & (YY + y0 >= c_) & (YY + y0 <= e_)
    piezas = nd.binary_fill_holes(nd.binary_closing(zona & (d < 38) & color_diadema, iterations=2)) & zona
    piezas = nd.binary_opening(piezas, iterations=1)
    et, n = nd.label(piezas); s = nd.sum(piezas, et, range(1, n + 1))
    piezas = np.isin(et, [i for i in range(1, n + 1) if s[i - 1] >= 20 and (et == i)[nd.binary_dilation(d < 5, iterations=4)].any()])
    # el arco: franja fina (5 px) dorada alrededor del camino, con el camino siempre incluido (no se rompe)
    arco = ((d < 5) & color_diadema) | (d < 1.5)
    m = arco | piezas
    et, n = nd.label(m); s = nd.sum(m, et, range(1, n + 1)); m = np.isin(et, 1 + np.where(s >= 30)[0])
    # borde suave y sin el color del pelo de alrededor
    fuera = ~nd.binary_dilation(m, iterations=2)
    den = nd.gaussian_filter(fuera.astype(float), 4)
    fondo = np.stack([nd.gaussian_filter(rgb[..., i] * fuera, 4) for i in range(3)], -1) / np.maximum(den, 1e-6)[..., None]
    a = np.clip(nd.gaussian_filter(m.astype(float), 0.8) * 1.6 - 0.3, 0, 1) * nd.binary_dilation(m, iterations=1)
    col = np.where(a[..., None] > 0, (rgb - (1 - a[..., None]) * fondo) / np.maximum(a[..., None], 0.05), 0)
    pieza = np.dstack([np.clip(col, 0, 255), a * 255]).round().astype(np.uint8)
    return pieza, dict(extremos_arco=EXTREMOS, px_linea_arco=int(linea.sum()), px=int((a > 0).sum()))


def a_nuestro_lienzo(pieza):
    (ax, ay), (bx, by) = OJOS_REF; (cx, cy), (dx, dy) = OJOS
    s = np.hypot(dx - cx, dy - cy) / np.hypot(bx - ax, by - ay)
    # esquina del recuadro en nuestro lienzo
    mx, my = (ax + bx) / 2, (ay + by) / 2; nx, ny = (cx + dx) / 2, (cy + dy) / 2
    ox = nx + (ZONA[0] - mx) * s + AJUSTE[0]; oy = ny + (ZONA[1] - my) * s + AJUSTE[1]
    a = pieza.astype(float); al = a[..., 3:] / 255; pre = np.dstack([a[..., :3] * al, a[..., 3:]])
    # se escala (sin deformar) al tamaño de nuestro lienzo, con la posición sub-píxel incluida
    W, H = 948, 1659
    canales = [np.array(Image.fromarray(pre[..., i].astype(np.float32), 'F').transform((W, H), Image.AFFINE, (1 / s, 0, -ox / s, 0, 1 / s, -oy / s), Image.BICUBIC)) for i in range(4)]
    c = np.stack(canales, -1); A = np.clip(c[..., 3], 0, 255); rgb = c[..., :3] / np.maximum(A[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), A]).round().astype(np.uint8); out[A < 2] = 0
    return out, dict(escala=round(float(s), 4), esquina=[round(float(ox), 1), round(float(oy), 1)])


if __name__ == '__main__':
    fuentes = [REF, PT.SIN_OJOS, PT.CP.DELANTE, PT.CP.DETRAS, PT.SIN_PIEL['corona']]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    pieza, i1 = extraer(); Image.fromarray(pieza, 'RGBA').save(AQUI / 'diadema-recortada.png', optimize=True)
    capa, i2 = a_nuestro_lienzo(pieza); Image.fromarray(capa, 'RGBA').save(AQUI / 'capa-diadema.png', optimize=True)
    base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(base); wb, _ = PT.peso_base(base, lab)
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
    hay = capa[..., 3] > 0; piel = (wb > 0) & (base[..., 3] > 0) & (f['pelo-delante'][..., 3] < 128)
    pelo = (f['pelo-delante'][..., 3] > 0) | (f['pelo-detras'][..., 3] > 0)
    ys, xs = np.where(hay)
    comp = dict(extraccion=i1, encaje=i2, caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], px=int(hay.sum()),
                solape_piel_visible_px=int((hay & piel).sum()), solape_corona_px=int((hay & (f['corona'][..., 3] > 0)).sum()),
                sobre_el_pelo=round(float((hay & pelo).sum() / hay.sum()), 3), fuera_del_pelo_px=int((hay & ~pelo).sum()), sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # vista: nuestra muñeca con la diadema (sin corona y con corona), y la referencia al mismo tamaño
    capas = [f['pelo-detras'], base, PT.abrir(PT.OJOS['marron']), f['zapatos'], f['vestido'], PT.abrir(PT.MANOS), f['pelo-delante']]
    caja = (150, 40, 810, 600); tiles = []
    for t, extra in (('Sin diadema', []), ('Diadema (candidata)', [capa]), ('Diadema + corona', [capa, f['corona']])):
        tiles.append((t, PT.montar(capas + extra).crop(caja)))
    w, h = tiles[0][1].size; out = Image.new('RGB', (3 * (w + 8), h + 30), 'white'); d = ImageDraw.Draw(out)
    for i, (t, im) in enumerate(tiles):
        out.paste(im, (i * (w + 8), 28)); d.text((i * (w + 8) + 4, 5), t, font=MK.F(18), fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-diadema.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
