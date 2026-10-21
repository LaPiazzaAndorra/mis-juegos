#!/usr/bin/env python3
"""
Conjunto de hada (D-029, 22/10/2026) · guía para ChatGPT sobre NUESTRA base aprobada (D-013), con y sin pelo. Cuatro
piezas separadas: vestido, alas, varita y zapatos. No cambia ninguna capa: solo monta las aprobadas sobre fondo crema.

Escribe aquí:
  plantilla-con-pelo.png  la muñeca aprobada (piel clara, ojos marrones, melena castaña limpia para la ropa);
  plantilla-sin-pelo.png  la misma muñeca sin pelo: cuello, hombros, espalda y brazos a la vista;
  zonas-hada.png          sin pelo, dónde va cada pieza: magenta, la ropa de la base que el vestido tapa entera; verde,
                          detrás de la espalda y los hombros, donde salen las alas (por DETRÁS del cuerpo); amarillo, la
                          mano derecha de la muñeca (a la izquierda de la imagen), donde se coge la varita; naranja, los pies
                          (zapatos); azul, lo que no se toca (cabeza, cuello y manos fuera de la varita);
  medidas.json            cifras (caja de cada zona).

Uso (desde la raíz): python3 docs/propuestas/hada-2026-10-22/guia-chatgpt/preparar_guia.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; P = AQUI.parents[1]; B = P / 'base-aprobada-d013-2026-10-14'
sys.path.insert(0, str(B / 'piel-tonos')); import piel_tonos as PT   # noqa: E402
PC = B / 'pelo-sin-restos' / 'conjunto'
CREMA = (253, 250, 245)


def montar(rutas):
    f = Image.new('RGBA', (948, 1659), CREMA + (255,))
    for r in rutas:
        f.alpha_composite(Image.open(r).convert('RGBA'))
    return f.convert('RGB')


def caja(m):
    ys, xs = np.where(m); return [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]


if __name__ == '__main__':
    base, ojos = PT.SIN_OJOS, PT.OJOS['marron']
    montar([PC / 'pelo-detras-castano.png', base, ojos, PC / 'pelo-delante-castano.png']).save(AQUI / 'plantilla-con-pelo.png', optimize=True)
    sin = montar([base, ojos]); sin.save(AQUI / 'plantilla-sin-pelo.png', optimize=True)
    b = PT.abrir(base); ropa = PT.MV.ropa_de_la_base(b); cuerpo = b[..., 3] > 128
    YY, XX = np.mgrid[:b.shape[0], :b.shape[1]]
    pies = cuerpo & (YY > 1430)
    mano = cuerpo & ~ropa & (YY > 1010) & (YY < 1130) & (XX < 330)
    # alas: detrás de la espalda, a los dos lados del torso, de los hombros a la cintura (fuera del cuerpo)
    alas = ~cuerpo & (YY > 620) & (YY < 1000) & (np.abs(XX - 478) > 120) & (np.abs(XX - 478) < 440)
    alas &= ~nd.binary_dilation(cuerpo, iterations=6)
    no_tocar = cuerpo & ~ropa & ~pies & ~mano & ((YY < 640) | ((YY > 1010) & (YY < 1130)))
    v = np.array(sin).astype(float)
    for m, col, k in ((ropa, (230, 0, 160), .55), (alas, (40, 190, 90), .35), (mano, (240, 200, 0), .55), (pies, (245, 130, 20), .55), (no_tocar, (40, 110, 230), .3)):
        v[m] = v[m] * (1 - k) + np.array(col) * k
    o = Image.fromarray(v.astype(np.uint8)); d = ImageDraw.Draw(o); F = PT.MK.F(19)
    for i, (t, c) in enumerate((('Magenta: el vestido tapa entera la ropa de la base', (160, 0, 110)),
                                ('Verde: las alas, por detrás de la espalda y los hombros', (20, 120, 60)),
                                ('Amarillo: la mano que coge la varita', (150, 120, 0)),
                                ('Naranja: los zapatos', (170, 80, 0)),
                                ('Azul: lo que no se toca (cabeza, cuello, la otra mano)', (20, 70, 180)))):
        d.text((16, 14 + 26 * i), t, font=F, fill=c)
    o.save(AQUI / 'zonas-hada.png', optimize=True)
    (AQUI / 'medidas.json').write_text(json.dumps(dict(lienzo=[948, 1659], ropa_de_la_base=caja(ropa), alas=caja(alas), mano_varita=caja(mano), pies=caja(pies)),
                                                  ensure_ascii=False, indent=1), encoding='utf-8')
    print('ok')
