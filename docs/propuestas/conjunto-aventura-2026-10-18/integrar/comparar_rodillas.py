#!/usr/bin/env python3
"""Hoja de revisión de las rodillas (D-027): base aprobada (mallas) · A (solo la zona) · B (+6 px bajo el borde), con el
pantalón y sin él, y el rosa que todavía asoma bajo el pantalón marcado en azul.
Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/comparar_rodillas.py"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; sys.path.insert(0, str(CJ))
import conjunto_aventura as A   # noqa: E402
PT = A.PT; CREMA = (253, 250, 245)


def montar(capas):
    f = Image.new('RGBA', (948, 1659), CREMA + (255,))
    for c in capas:
        f.alpha_composite(Image.fromarray(c, 'RGBA'))
    return np.array(f.convert('RGB'))


if __name__ == '__main__':
    pant = [PT.abrir(CJ / 'capas' / f'{k}.png') for k in ('calcetines', 'botas', 'pantalon')]
    p_al = PT.abrir(CJ / 'capas' / 'pantalon.png')[..., 3] > 128; YY = np.mgrid[0:1659, 0:948][0]
    bases = [('Base aprobada (mallas)', PT.abrir(PT.SIN_OJOS)), ('A · solo la zona', PT.abrir(AQUI / 'piernas' / 'base-piernas-sin-mallas.png')),
             ('B · +6 px bajo el borde', PT.abrir(AQUI / 'piernas-b' / 'base-piernas-sin-mallas.png'))]
    caja = (320, 1090, 640, 1320); F = PT.MK.F(15); w, h = 2 * (caja[2] - caja[0]), 2 * (caja[3] - caja[1])
    out = Image.new('RGB', (3 * (w + 10), 2 * (h + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (n, b) in enumerate(bases):
        lb = PT.lab_de(b); rosa = (b[..., 3] > 128) & (lb[..., 1] > 15) & (lb[..., 2] < 14) & (YY > 1100) & ~p_al
        con = montar([b] + pant); borde = nd.binary_dilation(rosa, iterations=3) & ~nd.binary_dilation(rosa, iterations=1)
        con[borde] = (0, 170, 255)
        for j, im in enumerate([con, montar([b])]):
            out.paste(Image.fromarray(im).crop(caja).resize((w, h), Image.LANCZOS), (i * (w + 10), j * (h + 30) + 26))
        d.text((i * (w + 10) + 4, 4), f'{n} · con el pantalón (rosa que asoma: {int(rosa.sum())} px, en azul)', font=F, fill=(40, 40, 60))
        d.text((i * (w + 10) + 4, h + 34), f'{n} · sin el pantalón', font=F, fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-rodillas.png', optimize=True)
