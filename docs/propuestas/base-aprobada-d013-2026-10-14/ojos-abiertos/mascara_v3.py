#!/usr/bin/env python3
"""
Máscara PROPUESTA de los ojos abiertos · versión 3 (base D-014, 948 × 1659).

v3 = v2 (mascara.py, sin cambios) + lo que la comprobación del montaje mostró que faltaba:
  (1) borde rosado del párpado inferior y lagrimal: píxeles pegados a la abertura del ojo (≤ 8 px),
      más claros, menos saturados o más fríos que la piel, unidos a la v2 → opacos;
  (2) pestañas que faltaban: trazos oscuros (dL > 35) pegados a la v2 (hasta 20 px por arriba y 12 por
      abajo; en la zona del pliegue, solo trazos de pestaña, no paralelos al contorno), con opacidad por
      luminancia como en la v2.
El pliegue del párpado sigue fuera. No se cambia ningún color: solo la máscara.

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-abiertos/mascara_v3.py
  → mascara-ojos-propuesta-v3.png
"""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd
import mascara as MK

AQUI = Path(__file__).resolve().parent


def mascara_v3(im):
    m2, AB, _ = MK.mascara(im); PL = MK.mascara.pliegue
    lab = MK.lab_de(im); L = lab[..., 0]; H, W = L.shape; YY, XX = np.mgrid[0:H, 0:W]
    dm = nd.distance_transform_edt(m2 == 0); dab = nd.distance_transform_edt(~AB); croma = np.hypot(lab[..., 1], lab[..., 2])
    gy, gx = np.gradient(nd.gaussian_filter(L, 1.0))
    Jxx, Jyy, Jxy = (nd.gaussian_filter(v, 1.5) for v in (gx * gx, gy * gy, gx * gy))
    a = m2.astype(float) / 255; rosado = np.zeros((H, W), bool); extra = np.zeros((H, W), bool)
    for cx, cy in MK.OJOS:
        cx, cy = int(cx), int(cy)
        r = np.hypot((XX - cx) / 95, (YY - cy) / 55); piel = np.median(lab[(r > 0.95) & (r < 1.05) & (YY > cy)], 0); dL = piel[0] - L
        roi = (np.abs(XX - cx) < 115) & (np.abs(YY - cy) < 70)
        paralelo = np.abs(np.cos(0.5 * np.arctan2(2 * Jxy, Jxx - Jyy) - np.arctan2(YY - cy, (XX - cx) * 0.6))) > 0.85
        # (1) borde rosado del párpado y lagrimal
        rim = roi & (dab <= 8) & ((L > piel[0] + 5) | (croma < 0.6 * np.hypot(piel[1], piel[2])) | (lab[..., 2] < piel[2] - 8)) & ~PL & (m2 < 255)
        lb, _ = nd.label(rim | (m2 > 0), np.ones((3, 3))); ids = np.unique(lb[m2 > 0]); ids = ids[ids > 0]
        rosado |= rim & np.isin(lb, ids)
        # (2) pestañas que faltaban
        tr = roi & (dL > 35) & (((YY < cy) & (dm <= 20)) | ((YY >= cy) & (dm <= 12))) & (~PL | ((dL > 45) & ~paralelo))
        lbt, _ = nd.label(tr | (m2 > 0), np.ones((3, 3))); ids = np.unique(lbt[m2 > 0]); ids = ids[ids > 0]; tr &= np.isin(lbt, ids)
        fondo = nd.grey_closing(L, size=(MK.FONDO_PX, MK.FONDO_PX))
        clave = np.clip((fondo - L - 4) / np.maximum(fondo - MK.NUCLEO_L, 1), 0, 1); clave = np.clip((clave - 0.22) / 0.55, 0, 1)
        ext = (tr | (nd.binary_dilation(tr, iterations=1) & (dL > 15) & ~PL)) & (m2 < 255) & roi
        extra |= ext & (clave > 0); a[ext] = np.maximum(a[ext], clave[ext])
    a[rosado] = 1
    return (a * 255).round().astype(np.uint8), m2, AB, PL, rosado, extra


if __name__ == '__main__':
    im = Image.open(AQUI.parent / 'base-transparencia-corregida.png').convert('RGBA')
    m3, m2, AB, PL, rosado, extra = mascara_v3(im)
    assert (m2 == np.array(Image.open(AQUI / 'mascara-ojos-propuesta-v2.png'))).all(), 'la v2 no coincide'
    Image.fromarray(m3, 'L').save(AQUI / 'mascara-ojos-propuesta-v3.png', optimize=True)
    print(f'v3: {int((m3 > 0).sum())} px (opacos {int((m3 == 255).sum())}); añadidos sobre la v2 {int(((m2 == 0) & (m3 > 0)).sum())}; '
          f'borde rosado {int((rosado & (m2 < 255)).sum())}; pestañas recuperadas {int(extra.sum())}')
