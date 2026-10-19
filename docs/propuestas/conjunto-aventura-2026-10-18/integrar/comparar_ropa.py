#!/usr/bin/env python3
"""Hoja de revisión de la guía 1 (D-027): conjunto con la camiseta y el chaleco de la imagen aprobada (antes) y con los
nuevos a nuestra medida (integrar/ropa/), con y sin mochila, sobre las rodillas B2 y la melena; y el rosa de la base que
aún se ve, marcado en azul.
Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/comparar_ropa.py"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; sys.path.insert(0, str(CJ))
import conjunto_aventura as A   # noqa: E402
PT = A.PT; CREMA = (253, 250, 245)
PELO = A.B / 'pelo-sin-restos' / 'pelo-delante-castano-sin-restos.png'


def capa(k, nueva):
    return PT.abrir(AQUI / 'ropa' / f'{k}.png') if nueva and k in ('camiseta', 'chaleco') else PT.abrir(CJ / 'capas' / f'{k}.png')


def montaje(nueva, mochila, pelo=True):
    base = PT.abrir(AQUI / 'piernas-b2' / 'base-piernas-sin-mallas.png')
    f = ([PT.abrir(PT.SIN_PIEL['pelo-detras'])] if pelo else []) + ([capa('mochila', nueva)] if mochila else []) + [base, PT.abrir(PT.OJOS['marron'])]
    f += [capa(k, nueva) for k in ('calcetines', 'botas', 'camiseta', 'pantalon') + (('tiras',) if mochila else ()) + ('chaleco',)]
    f += [PT.abrir(PT.MANOS)] + ([PT.abrir(PELO)] if pelo else [])
    o = Image.new('RGBA', (948, 1659), CREMA + (255,))
    for c in f:
        o.alpha_composite(Image.fromarray(c, 'RGBA'))
    i0 = next(i for i, c in enumerate(f) if c is base)
    tapa = 1 - np.prod([1 - c[..., 3] / 255 for c in f[i0 + 2:]], 0)          # lo que va encima de la base (sin los ojos)
    return np.array(o.convert('RGB')), base, tapa


if __name__ == '__main__':
    F = PT.MK.F(16); caja = (150, 560, 800, 1180); w, h = 520, 496; vistas = []; YY = np.mgrid[0:1659, 0:948][0]
    for pelo in (False, True):
        for nueva in (False, True):
            im, base, tapa = montaje(nueva, False, pelo)
            lb = PT.lab_de(base); rosa = (base[..., 3] > 128) & (lb[..., 1] > 15) & (lb[..., 2] < 14) & (tapa < 0.5) & (YY > 590)
            b = nd.binary_dilation(rosa, iterations=3) & ~nd.binary_dilation(rosa, iterations=1); im = im.copy(); im[b] = (0, 160, 255)
            t1 = ('Nuevos (guía 1)' if nueva else 'Antes (imagen aprobada)') + (' · con melena' if pelo else ' · sin pelo')
            vistas.append((t1, f'sin mochila · rosa de la base a la vista: {int(rosa.sum())} px (azul)', Image.fromarray(im).crop(caja).resize((w, h), Image.LANCZOS)))
    out = Image.new('RGB', (2 * (w + 10), 2 * (h + 48)), 'white'); d = ImageDraw.Draw(out)
    for i, (t1, t2, v) in enumerate(vistas):
        x, y = (i % 2) * (w + 10), (i // 2) * (h + 48); out.paste(v, (x, y + 46))
        d.text((x + 4, y + 4), t1, font=F, fill=(40, 40, 60)); d.text((x + 4, y + 24), t2, font=PT.MK.F(14), fill=(90, 60, 80))
    out.save(AQUI / 'comparacion-camiseta-chaleco.png', optimize=True)
    entera, _, _ = montaje(True, False)
    Image.fromarray(entera).save(AQUI / 'ropa' / 'montaje-entero-sin-mochila.png', optimize=True)
