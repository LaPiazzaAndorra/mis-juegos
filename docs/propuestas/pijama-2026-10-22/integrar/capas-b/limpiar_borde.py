#!/usr/bin/env python3
"""
Camiseta del pijama con el borde de fuera limpio (D-028, 22/10). Al alargar la tela de las mangas para tapar la ropa
rosa de la base (extraer_pijama.py, paso 3b) quedaron, en el contorno, píxeles sueltos a cuadros (alfa 255 junto a
alfa casi 0): sobre el fondo, el pelo o la piel oscura se ven como una línea de puntos claros. Aquí, SOLO en esa zona
alargada (+2 px): fuera los píxeles que no resisten una apertura de 3 × 3, y el alfa del borde se rehace suave (como
el resto de las capas). El color no cambia. La camiseta aprobada (../capas/camiseta.png) se conserva sin cambios.

Uso (desde la raíz): python3 docs/propuestas/pijama-2026-10-22/integrar/capas-b/limpiar_borde.py
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; I = AQUI.parent
if __name__ == '__main__':
    c = np.array(Image.open(I / 'capas' / 'camiseta.png').convert('RGBA')); a = c[..., 3].astype(float)
    zona = nd.binary_dilation(np.array(Image.open(I / 'mascara-ampliado-camiseta.png')) > 0, iterations=2)
    m = a > 128; m2 = nd.binary_opening(m, structure=np.ones((3, 3))) | (m & ~zona)
    suave = np.clip(nd.gaussian_filter(m2.astype(float), 0.8) * 1.6 - 0.3, 0, 1) * 255
    suave = np.where(m2 & ~nd.binary_dilation(~m2, iterations=1), 255, suave)
    nueva = np.where(zona, suave, a)
    o = c.copy(); o[..., 3] = np.round(nueva).astype(np.uint8); o[zona & (o[..., 3] == 0)] = 0
    # donde el alfa sube (borde rehecho), el color es el del píxel opaco más cercano
    sube = zona & (o[..., 3] > c[..., 3]); _, (iy, ix) = nd.distance_transform_edt(~(c[..., 3] == 255), return_indices=True)
    o[sube, :3] = c[iy[sube], ix[sube], :3]
    Image.fromarray(o, 'RGBA').save(AQUI / 'camiseta.png', optimize=True)
    cambia = (o != c).any(-1)
    comp = dict(sueltos_quitados_px=int((m & ~m2).sum()), px_cambiados=int(cambia.sum()), solo_en_la_zona_alargada=bool(not (cambia & ~zona).any()))
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8'); print(comp)
