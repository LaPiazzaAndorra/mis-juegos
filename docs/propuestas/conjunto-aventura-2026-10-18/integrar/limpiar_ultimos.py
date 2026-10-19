#!/usr/bin/env python3
"""
Los últimos 12 px de rosa del conjunto (D-027, candidato), con máscaras mínimas y en COPIAS:

1. Cintura derecha (x ≈ 618–620, y ≈ 957–962): el contorno de nuestra cintura sale 1–2 px por fuera de la camiseta, justo
   bajo el chaleco y encima del pantalón. Tela contigua: la camiseta (integrar/ropa-b/camiseta.png), estirada en la misma
   fila hacia fuera (estirar() de retocar_bordes.py) → integrar/ropa-c/camiseta.png.
2. Abertura entre las perneras (x ≈ 487–488, y ≈ 1089–1093): es la parte de arriba del hueco entre las dos perneras del
   pantalón, que sigue el fondo que ya hay debajo (rodillas B2). Transparente, SOLO en los píxeles rosas de la base que
   están dentro de la abertura (pantalón no opaco, también su borde suave) y unidos al fondo de debajo
   → integrar/piernas-b2c/base-piernas-sin-mallas.png.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/limpiar_ultimos.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; sys.path.insert(0, str(AQUI))
import retocar_bordes as RB   # noqa: E402
PT = RB.PT; H, W = RB.H, RB.W; YY, XX = RB.YY, RB.XX; CJ = RB.CJ
CREMA = (253, 250, 245)


def montar(base, cam, pan, pelo=False):
    otras = [PT.abrir(CJ / 'capas' / f'{k}.png') for k in ('calcetines', 'botas')]
    f = ([PT.abrir(PT.SIN_PIEL['pelo-detras'])] if pelo else []) + [base, PT.abrir(PT.OJOS['marron'])] + otras
    f += [cam, pan, PT.abrir(AQUI / 'ropa' / 'chaleco.png'), PT.abrir(PT.MANOS)]
    f += [PT.abrir(RB.A.B / 'pelo-sin-restos' / 'pelo-delante-castano-sin-restos.png')] if pelo else []
    o = Image.new('RGBA', (W, H), CREMA + (255,))
    for c in f:
        o.alpha_composite(Image.fromarray(c, 'RGBA'))
    return np.array(o.convert('RGB'))


def rosa_visto(base, cam, pan):
    encima = [PT.abrir(CJ / 'capas' / f'{k}.png') for k in ('calcetines', 'botas')] + [cam, pan, PT.abrir(AQUI / 'ropa' / 'chaleco.png'), PT.abrir(PT.MANOS)]
    tapa = 1 - np.prod([1 - c[..., 3] / 255 for c in encima], 0); lb = PT.lab_de(base)
    return (base[..., 3] > 128) & (lb[..., 1] > 15) & (lb[..., 2] < 14) & (tapa < 0.5)


if __name__ == '__main__':
    base0 = PT.abrir(AQUI / 'piernas-b2' / 'base-piernas-sin-mallas.png')
    cam0 = PT.abrir(AQUI / 'ropa-b' / 'camiseta.png'); pan = PT.abrir(AQUI / 'ropa-b' / 'pantalon.png')
    visto = rosa_visto(base0, cam0, pan)
    cintura = nd.binary_dilation(visto & (YY > 940) & (YY < 975) & (XX > 600), iterations=1) & (base0[..., 3] > 0)
    cam = RB.estirar(cam0, cintura, +1, base0)
    # abertura: el rosa que se ve entre las perneras + 1 px, dentro del hueco del pantalón y unido al fondo de debajo
    # (también bajo el borde semitransparente del pantalón en la abertura, donde el rosa teñía ese borde)
    hueco = (pan[..., 3] < 250) & (YY > 1060) & (YY < 1100) & (XX > 470) & (XX < 505)
    lb0 = PT.lab_de(base0); rosa0 = (base0[..., 3] > 0) & (lb0[..., 1] > 15) & (lb0[..., 2] < 20) & (lb0[..., 1] > 1.5 * lb0[..., 2])   # también su contorno, más oscuro
    cand = (nd.binary_dilation(visto & hueco, iterations=1) | rosa0) & hueco & (base0[..., 3] > 0)
    fondo = (base0[..., 3] == 0) & (YY >= 1090) & (YY < 1110) & (XX > 470) & (XX < 505)
    et, n = nd.label(cand | fondo); unidos = set(np.unique(et[fondo])) - {0}
    abertura = cand & np.isin(et, list(unidos))
    base = base0.copy(); base[abertura] = 0
    S1 = AQUI / 'ropa-c'; S2 = AQUI / 'piernas-b2c'; S1.mkdir(exist_ok=True); S2.mkdir(exist_ok=True)
    Image.fromarray(cam, 'RGBA').save(S1 / 'camiseta.png', optimize=True)
    Image.fromarray(base, 'RGBA').save(S2 / 'base-piernas-sin-mallas.png', optimize=True)
    Image.fromarray(np.where(cintura, 255, 0).astype(np.uint8)).save(S1 / 'mascara-cintura.png', optimize=True)
    Image.fromarray(np.where(abertura, 255, 0).astype(np.uint8)).save(S2 / 'mascara-abertura.png', optimize=True)
    visto2 = rosa_visto(base, cam, pan)
    comp = dict(cintura=dict(mascara_px=int(cintura.sum()), camiseta_cambia_solo_en_la_mascara=bool((cam[~cintura] == cam0[~cintura]).all()),
                             que_es='el contorno de nuestra cintura, 1–2 px fuera de la camiseta, bajo el chaleco: se cubre con la camiseta'),
                abertura=dict(mascara_px=int(abertura.sum()), candidatos_px=int(cand.sum()), base_cambia_solo_en_la_mascara=bool((base[~abertura] == base0[~abertura]).all()),
                              que_es='la parte alta del hueco entre las perneras, unida al fondo que ya hay debajo: transparente'),
                rosa_a_la_vista=dict(antes=int(visto.sum()), despues=int(visto2.sum())))
    (S1 / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    a, b = montar(base0, cam0, pan), montar(base, cam, pan); F = PT.MK.F(15); hojas = []
    for nombre, m in (('Cintura derecha', cintura), ('Abertura entre las perneras', abertura)):
        ys, xs = np.where(m); cx, cy = int(xs.mean()), int(ys.mean())
        hojas.append(RB.detalle(a, b, m, (cx - 20, cy - 20, cx + 20, cy + 20), 6, f'{nombre} ({m.sum()} px)', F))
    out = Image.new('RGB', (max(h.width for h in hojas), sum(h.height + 10 for h in hojas)), 'white'); y = 0
    for h in hojas:
        out.paste(h, (0, y)); y += h.height + 10
    out.save(S1 / 'antes-despues.png', optimize=True)
    # el conjunto limpio, entero: con la melena y sin pelo, sin mochila
    vistas = []
    for pelo, n in ((True, 'conjunto-limpio-melena.png'), (False, 'conjunto-limpio-sin-pelo.png')):
        im = montar(base, cam, pan, pelo); Image.fromarray(im).save(S1 / n, optimize=True); vistas.append(Image.fromarray(im).crop((60, 120, 888, 1600)))
    w, h = vistas[0].size; hoja = Image.new('RGB', (2 * w + 20, h + 36), 'white'); d = ImageDraw.Draw(hoja)
    for i, (v, t) in enumerate(zip(vistas, ['Con la melena', 'Sin pelo (para ver hombros y mangas)'])):
        hoja.paste(v, (i * (w + 20), 36)); d.text((i * (w + 20) + 8, 8), t + ' · sin mochila · rosa de la base a la vista: 0 px', font=PT.MK.F(20), fill=(40, 40, 60))
    hoja.save(AQUI / 'conjunto-limpio.png', optimize=True)
    print(json.dumps(comp, ensure_ascii=False))
