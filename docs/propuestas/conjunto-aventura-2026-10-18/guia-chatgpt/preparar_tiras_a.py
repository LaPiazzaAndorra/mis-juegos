#!/usr/bin/env python3
"""
Guía 2b · tiras nuevas de la mochila, tomando como referencia la mochila A (centrada, elegida el 20/10/2026) y el
conjunto ajustado (camiseta de integrar/ropa-c, pantalón, chaleco, calcetines y botas de integrar/ropa-d).

Escribe en 2-mochila/:
  plantilla-tiras-con-mochila-a.png  nuestra muñeca con el conjunto y la mochila A detrás, SIN pelo (para que se vean los
                                     hombros), sobre crema, en nuestro lienzo de 948 × 1659: es la imagen sobre la que
                                     ChatGPT dibuja las tiras (integrar/recibir.py la usa para alinear y comparar);
  guia-tiras-sobre-a.png             detalle de los hombros: en morado, los hombros del chaleco (por donde bajan las
                                     tiras: nuestro chaleco cubre los hombros hasta la manga, así que, por debajo de él,
                                     las tiras no se verían); en azul, el borde de arriba de la mochila A, detrás de los
                                     hombros (de donde salen).
No cambia ninguna capa.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/guia-chatgpt/preparar_tiras_a.py
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; P = CJ.parent; I = CJ / 'integrar'
sys.path.insert(0, str(I)); import retocar_bordes as RB   # noqa: E402
PT = RB.PT; W, H = RB.W, RB.H; CREMA = (253, 250, 245)
CAPAS = [I / 'mochila-b' / 'mochila-cuerpo-centrada.png', I / 'piernas-b2c' / 'base-piernas-sin-mallas.png',
         P / 'base-aprobada-d013-2026-10-14' / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
         I / 'ropa-d' / 'calcetines.png', I / 'ropa-d' / 'botas.png', I / 'ropa-c' / 'camiseta.png', I / 'ropa-d' / 'pantalon.png',
         I / 'ropa-d' / 'chaleco.png', P / 'vestido-rosa-2026-10-15' / 'montaje' / 'brazos-delante-copiados-de-la-base.png']


def montar(rutas):
    f = Image.new('RGBA', (W, H), CREMA + (255,))
    for r in rutas:
        f.alpha_composite(Image.open(r).convert('RGBA'))
    return f.convert('RGB')


def borde(m):
    return m & ~nd.binary_erosion(m, iterations=2)


if __name__ == '__main__':
    S = AQUI / '2-mochila'
    pl = montar(CAPAS); pl.save(S / 'plantilla-tiras-con-mochila-a.png', optimize=True)
    cam = PT.abrir(I / 'ropa-c' / 'camiseta.png')[..., 3] > 128; cha = PT.abrir(I / 'ropa-d' / 'chaleco.png')[..., 3] > 128
    moch = PT.abrir(CAPAS[0])[..., 3] > 128; delante = np.zeros((H, W), bool)
    for r in CAPAS[1:]:
        delante |= PT.abrir(r)[..., 3] > 128
    YY, XX = np.mgrid[:H, :W]
    hombros = cha & (YY > 630) & (YY < 800) & ((XX < 425) | (XX > 530))      # hombros del chaleco
    hombros = nd.binary_opening(hombros, iterations=2)
    arriba = moch & ~delante                                       # lo que asoma de la mochila por encima de los hombros
    v = np.array(pl).copy()
    v[borde(hombros)] = (130, 0, 190); v[borde(moch) & (YY < 700) & ~delante] = (0, 90, 230)
    caja = (250, 580, 710, 860); esc = 2
    det = Image.fromarray(v).crop(caja).resize(((caja[2] - caja[0]) * esc, (caja[3] - caja[1]) * esc), Image.LANCZOS)
    o = Image.new('RGB', (det.width, det.height + 58), 'white'); o.paste(det, (0, 58)); d = ImageDraw.Draw(o); F = PT.MK.F(18)
    d.text((8, 6), 'Morado: los hombros del chaleco, por donde bajan las tiras (por encima del chaleco)', font=F, fill=(110, 0, 170))
    d.text((8, 30), 'Azul: borde de arriba de la mochila A, detrás de los hombros (de donde salen)', font=F, fill=(0, 80, 200))
    o.save(S / 'guia-tiras-sobre-a.png', optimize=True)
    ys, xs = np.where(hombros)
    print(dict(plantilla=pl.size, hombros_px=int(hombros.sum()), hombros_caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
               mochila_asoma_px=int(arriba.sum())))
