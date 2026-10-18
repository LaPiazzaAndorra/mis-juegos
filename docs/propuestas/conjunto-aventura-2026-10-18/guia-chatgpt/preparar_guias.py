#!/usr/bin/env python3
"""
Guías para ChatGPT del conjunto de aventura (D-027), por separado:
  1-camiseta-y-chaleco/  camiseta y chaleco adaptados al espacio entre nuestros brazos, hombros completos, sin tiras;
  2-mochila/             mochila completa: cuerpo de detrás y tiras de delante, independientes.
Solo lee: la imagen aprobada, nuestra base y las capas candidatas. Nada se deforma; las medidas salen de nuestra base.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/guia-chatgpt/preparar_guias.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; sys.path.insert(0, str(CJ))
import conjunto_aventura as A   # noqa: E402
PT = A.PT; CREMA = (253, 250, 245)


def tramos(f):
    x = np.flatnonzero(f)
    if not len(x):
        return []
    c = np.flatnonzero(np.diff(x) > 1)
    return list(zip(np.r_[x[0], x[c + 1]].tolist(), np.r_[x[c], x[-1]].tolist()))


def sobre_crema(capas):
    f = Image.new('RGBA', (948, 1659), CREMA + (255,))
    for c in capas:
        f.alpha_composite(Image.fromarray(c, 'RGBA'))
    return f.convert('RGB')


def rotulo(im, textos, F):
    """La imagen con una franja blanca arriba para los textos (no tapan el dibujo)."""
    alto = 12 + 22 * len(textos); o = Image.new('RGB', (im.width, im.height + alto), 'white'); o.paste(im, (0, alto))
    d = ImageDraw.Draw(o)
    for i, (t, col) in enumerate(textos):
        d.text((8, 6 + 22 * i), t, font=F, fill=col)
    return o


if __name__ == '__main__':
    F = PT.MK.F(16)
    base = PT.abrir(PT.SIN_OJOS); ojos = PT.abrir(PT.OJOS['marron']); manos = PT.abrir(PT.MANOS)
    m = base[..., 3] > 128; H = m.shape[0]
    # torso entre los brazos: el tramo del medio en las filas en que los brazos están separados del cuerpo
    torso = np.zeros_like(m); brazos = manos[..., 3] > 128; medidas = []
    for y in range(600, 1001):
        t = tramos(m[y])
        if len(t) >= 3:
            torso[y, t[1][0]:t[1][1] + 1] = True; brazos[y, t[0][0]:t[0][1] + 1] = True; brazos[y, t[-1][0]:t[-1][1] + 1] = True
            if y % 20 == 0 and y <= 980:
                medidas.append(dict(y=y, torso_x=[t[1][0], t[1][1]], ancho=t[1][1] - t[1][0] + 1))
    lab = PT.lab_de(base).astype(float); wb, _ = PT.peso_base(base, lab); YY, XX = np.mgrid[0:H, 0:948]
    rosa = (lab[..., 1] > 15) & (lab[..., 2] < 14)
    brazos |= m & (wb > 0) & ~rosa & (YY > 700) & (YY < 1001) & ((XX < 380) | (XX > 578))   # parte de arriba de los brazos, bajo la manga
    ch = PT.abrir(CJ / 'capas' / 'chaleco.png')[..., 3] > 128
    ancho_chaleco = {r['y']: (lambda tt: [tt[0][0], tt[-1][1]] if tt else None)(tramos(ch[r['y']])) for r in medidas}
    for r in medidas:
        r['chaleco_actual_x'] = ancho_chaleco[r['y']]
    # ---- guía 1: plantilla con los brazos, el espacio libre del torso y el chaleco actual -------------------------------
    g1 = AQUI / '1-camiseta-y-chaleco'; g1.mkdir(exist_ok=True)
    o = np.array(sobre_crema([base, ojos])).astype(float)
    o[brazos] = o[brazos] * 0.55 + np.array((80, 140, 255)) * 0.45
    borde_t = nd.binary_dilation(torso, iterations=2) & ~torso; o[borde_t] = (0, 160, 70)
    borde_c = nd.binary_dilation(ch, iterations=1) & ~ch; o[borde_c & ~torso] = (255, 120, 0)
    pl = Image.fromarray(o.astype(np.uint8)).crop((150, 560, 800, 1120))
    pl = rotulo(pl, [('Azul: nuestros brazos (van delante; no se tapan)', (40, 70, 160)),
                ('Verde: espacio del torso entre los brazos', (0, 120, 50)),
                ('Naranja: borde del chaleco actual (sobra fuera del verde)', (200, 90, 0))], F)
    pl.save(g1 / 'plantilla-espacio-entre-brazos.png', optimize=True)
    sobre_crema([base, ojos]).save(g1 / 'plantilla-nuestra-muneca-entera.png', optimize=True)
    rgb = Image.open(A.REF).convert('RGB')
    tiras = PT.abrir(CJ / 'capas' / 'tiras.png')[..., 3] > 128
    r = np.array(rgb).astype(float); bt = nd.binary_dilation(tiras, iterations=3) & ~nd.binary_dilation(tiras, iterations=1); r[bt] = (140, 0, 220)
    ref1 = Image.fromarray(r.astype(np.uint8)).crop((250, 580, 710, 1000))
    ref1 = rotulo(ref1, [('Morado: las tiras de la mochila (quitarlas y completar', (110, 0, 170)), ('debajo los hombros de la camiseta y del chaleco)', (110, 0, 170))], F)
    ref1.save(g1 / 'referencia-camiseta-y-chaleco.png', optimize=True)
    # ---- guía 2: mochila -------------------------------------------------------------------------------------------
    g2 = AQUI / '2-mochila'; g2.mkdir(exist_ok=True)
    moch = PT.abrir(CJ / 'capas' / 'mochila.png')[..., 3] > 128; oculta = np.zeros_like(moch)
    reg = None
    r2 = np.array(rgb).astype(float)
    for mk, col in ((moch, (0, 160, 60)), (tiras, (140, 0, 220))):
        b_ = nd.binary_dilation(mk, iterations=3) & ~nd.binary_dilation(mk, iterations=1); r2[b_] = col
    ref2 = Image.fromarray(r2.astype(np.uint8)).crop((170, 590, 720, 1010))
    ref2 = rotulo(ref2, [('Verde: cuerpo de la mochila que se ve (detrás de la niña)', (0, 110, 40)),
                  ('Morado: tiras de delante', (110, 0, 170))], F)
    ref2.save(g2 / 'referencia-mochila.png', optimize=True)
    # dónde irá sobre nuestra muñeca: el cuerpo detrás (asoma junto al brazo izquierdo de la imagen) y las tiras en los hombros
    o2 = np.array(sobre_crema([PT.abrir(CJ / 'capas' / 'mochila.png'), base, ojos, manos])).astype(float)
    hombros = np.zeros_like(m); hombros[600:760] = m[600:760] & ~nd.binary_erosion(m, iterations=60)[600:760]
    o2[brazos] = o2[brazos] * 0.6 + np.array((80, 140, 255)) * 0.4
    b2 = nd.binary_dilation(tiras, iterations=2) & ~tiras; o2[b2] = (140, 0, 220)
    pl2 = Image.fromarray(o2.astype(np.uint8)).crop((150, 560, 800, 1120))
    pl2 = rotulo(pl2, [('Nuestra muñeca con el cuerpo de la mochila actual detrás', (40, 40, 60)),
                 ('Morado: dónde van ahora las tiras; azul: nuestros brazos', (110, 0, 170))], F)
    pl2.save(g2 / 'plantilla-mochila-sobre-nuestra-muneca.png', optimize=True)
    (AQUI / 'medidas-torso.json').write_text(json.dumps(dict(nota='x en el lienzo de 948 × 1659; el torso es el tramo entre los brazos', filas=medidas), ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(medidas, ensure_ascii=False))
