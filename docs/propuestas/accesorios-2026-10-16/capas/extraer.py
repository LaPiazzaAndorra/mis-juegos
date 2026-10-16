#!/usr/bin/env python3
"""
Extracción de los accesorios de pelo aprobados (D-024) de la lámina «lazo, flores, mariposa y diadema»
(../referencias/lamina-lazo-flores-mariposa-diadema-aprobada.png, imagen generada, sin modificar): solo el objeto, sin
fondo, marco, texto ni sombra, con transparencia.

  · fondo: color crema medido en el borde de cada recuadro;
  · objeto: el objeto tiene un contorno nítido y la sombra se difumina sin bordes; se toman los bordes fuertes (contraste
    Lab > 40), se cierran (4 px) y se rellena lo que encierran (también el pétalo crema y los brillos); la sombra queda
    fuera. Se quita el crema del fondo que haya quedado pegado al borde;
  · borde: transparencia suave de 1 px, quitando el crema del fondo de los píxeles del borde (sin halo).

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/capas/extraer.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[3]
sys.path[:0] = [str(RAIZ / 'docs' / 'propuestas' / 'base-aprobada-d013-2026-10-14' / 'ojos-abiertos')]
import mascara as MK   # noqa: E402

LAMINA = AQUI.parent / 'referencias' / 'lamina-lazo-flores-mariposa-diadema-aprobada.png'
FONDO_ENCERRADO = {'mariposa': [(291, 806)]}   # (x, y) en la lámina
CAJAS = {'lazo': (40, 25, 600, 475), 'flores': (640, 130, 1235, 360), 'mariposa': (80, 650, 600, 1110)}


def extraer(rgb, lab, caja, nombre):
    x0, y0, x1, y1 = caja; c = lab[y0:y1, x0:x1]; r = rgb[y0:y1, x0:x1].astype(float)
    borde = np.concatenate([c[:4].reshape(-1, 3), c[-4:].reshape(-1, 3), c[:, :4].reshape(-1, 3), c[:, -4:].reshape(-1, 3)])
    bg = np.median(borde, 0); bg_rgb = np.median(np.concatenate([r[:4].reshape(-1, 3), r[-4:].reshape(-1, 3)]), 0)
    dE = np.sqrt(((c - bg) ** 2).sum(-1)); dab = np.hypot(c[..., 1] - bg[1], c[..., 2] - bg[2])
    # el objeto tiene un contorno nítido y la sombra se difumina sin bordes: se toman los bordes fuertes del objeto
    # (contraste > 40), se cierran (4 px) y se rellena lo que encierran (también el pétalo crema y los brillos)
    grad = np.sqrt(sum(nd.sobel(nd.gaussian_filter(c[..., i], 0.7), 0) ** 2 + nd.sobel(nd.gaussian_filter(c[..., i], 0.7), 1) ** 2 for i in range(3)))
    cerrado = nd.binary_closing(grad > 40, iterations=4)
    m = nd.binary_fill_holes(cerrado)
    # huecos rellenados que en realidad son fondo encerrado (solo uno: en la mariposa, entre la antena izquierda y el ala;
    # su crema con sombra es casi igual al pétalo crema de la flor, así que se marca por su posición en la lámina)
    huecos, nh = nd.label(m & ~cerrado)
    for (sx, sy) in FONDO_ENCERRADO.get(nombre, []):
        i = huecos[sy - y0, sx - x0]
        if i:
            m[nd.binary_dilation(huecos == i, iterations=1) & ~(grad > 40)] = False
    m = nd.binary_opening(m, iterations=2)
    et, n = nd.label(m); s = nd.sum(m, et, range(1, n + 1)); m = np.isin(et, 1 + np.where(s >= 2000)[0])
    # fuera: el crema del fondo que el cierre haya cogido junto al borde
    borde_m = m & ~nd.binary_erosion(m, iterations=3)
    m &= ~(borde_m & (dE < 8))
    sombra = np.zeros_like(m)
    a = np.clip(nd.gaussian_filter(m.astype(float), 0.8) * 1.6 - 0.3, 0, 1) * nd.binary_dilation(m, iterations=1)
    col = np.where(a[..., None] > 0, (r - (1 - a[..., None]) * bg_rgb) / np.maximum(a[..., None], 0.05), 0)
    out = np.dstack([np.clip(col, 0, 255), a * 255]).round().astype(np.uint8)
    ys, xs = np.where(out[..., 3] > 0)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return out, dict(px=int((out[..., 3] > 0).sum()), tam=[int(out.shape[1]), int(out.shape[0])], sombra_px=int((sombra & (dE > 12)).sum()))


if __name__ == '__main__':
    im = Image.open(LAMINA).convert('RGBA'); rgb = np.array(im)[..., :3]; lab = MK.lab_de(im).astype(float)
    info = {}
    for k, caja in CAJAS.items():
        o, i = extraer(rgb, lab, caja, k)
        Image.fromarray(o, 'RGBA').save(AQUI / f'{k}-recortado.png', optimize=True); info[k] = i
    print(json.dumps(info, ensure_ascii=False))
