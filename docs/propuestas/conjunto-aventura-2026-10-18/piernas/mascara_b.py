#!/usr/bin/env python3
"""
Variante B de la zona de las rodillas (D-027), candidata: la zona aprobada como fuente (`mascara-zona.png`) deja justo
debajo, en nuestra base, la sombra del borde de las mallas (una línea más oscura de 1–5 px sobre la piel, por debajo de la
rodilla). La B añade SOLO esa franja: hasta EXTRA px por debajo del borde inferior de la zona, dentro de la pierna (nada
por los lados ni por arriba). Fuera de la zona B, la base no cambia.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/piernas/mascara_b.py
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent
EXTRA = 6

if __name__ == '__main__':
    zona = np.array(Image.open(AQUI / 'mascara-zona.png')) > 127; base = np.array(Image.open(AQUI / 'base-copia.png'))
    H, W = zona.shape; YY = np.mgrid[0:H, 0:W][0]; extra = np.zeros_like(zona)
    for x in range(W):
        col = np.where(zona[:, x] & (YY[:, x] > 1200))[0]
        if len(col):
            yb = col.max(); extra[yb + 1:yb + 1 + EXTRA, x] = True
    extra &= nd.binary_erosion(base[..., 3] > 200, iterations=2)          # dentro de la pierna, sin tocar su contorno
    b = zona | extra
    Image.fromarray(np.where(b, 255, 0).astype(np.uint8)).save(AQUI / 'mascara-zona-b.png', optimize=True)
    print(json.dumps(dict(extra_px=int(extra.sum()), zona_b_px=int(b.sum()), extra_por_columna=EXTRA)))
