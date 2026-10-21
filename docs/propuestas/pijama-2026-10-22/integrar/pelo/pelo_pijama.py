#!/usr/bin/env python3
"""
Pelo de detrás para el pijama (D-028): las copias limpias para la ropa (../../../base-aprobada-d013-2026-10-14/
pelo-sin-restos/conjunto/) con las rendijas de fondo rellenadas también junto a las mangas del pijama, más anchas que el
brazo de la base (con las dos coletas se veía una línea de puntos claros entre los rizos y la manga). Mismo método que
limpiar_conjunto.py (rendijas + rellenar con el pelo más cercano), con el cuerpo = base + pijama. Las copias del
conjunto no cambian. Cinco colores; misma máscara en todos (rendijas-<peinado>.png).

Uso (desde la raíz): python3 docs/propuestas/pijama-2026-10-22/integrar/pelo/pelo_pijama.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image

AQUI = Path(__file__).resolve().parent; I = AQUI.parent; P = I.parents[1]
sys.path.insert(0, str(P / 'base-aprobada-d013-2026-10-14' / 'pelo-sin-restos')); import limpiar_conjunto as LCJ   # noqa: E402
PT, PC, COLORES = LCJ.PT, LCJ.SAL, LCJ.COLORES

if __name__ == '__main__':
    cuerpo = PT.abrir(PT.SIN_OJOS)[..., 3] > 128
    for r in (I / 'capas' / 'zapatillas.png', I / 'capas' / 'pantalon.png', I / 'capas-b' / 'camiseta.png'):
        cuerpo |= PT.abrir(r)[..., 3] > 128
    casos = [('melena', 'pelo-detras-{c}', PC / 'pelo-delante-castano.png')] + \
            [(f'coleta-{v}', f'pelo-coleta-{v}-detras-{{c}}', str(LCJ.DELANTE_COLETA).format(v=v)) for v in ('con', 'sin')] + \
            [(f'coletas-{v}', f'pelo-coletas-{v}-sombrero-detras-{{c}}', str(LCJ.DELANTE_COLETAS).format(v=v)) for v in ('con', 'sin')]
    comp = {}
    for nombre, patron, delante in casos:
        dl = PT.abrir(delante)
        for c in COLORES:
            dt = PT.abrir(PC / (patron.format(c=c) + '.png')); r = LCJ.rendijas(dt, dl, cuerpo); o = LCJ.rellenar(dt, r)
            if c == 'castano':
                LCJ.Image.fromarray(np.where(r, 255, 0).astype(np.uint8)).save(AQUI / f'rendijas-{nombre}.png', optimize=True)
            Image.fromarray(o).save(AQUI / (patron.format(c=c) + '.png'), optimize=True)
            comp[f'{nombre}-{c}'] = dict(rendijas_px=int(r.sum()), fuera_igual=bool((o[~r] == dt[~r]).all()))
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print({k: v['rendijas_px'] for k, v in comp.items() if k.endswith('castano')})
