#!/usr/bin/env python3
"""
Pijama (22/10/2026) · guía para ChatGPT sobre NUESTRA base aprobada (D-013), con y sin pelo, y con el gorrito de dormir
aprobado (D-024, variante B). No cambia ninguna capa: solo monta las aprobadas sobre fondo crema.

Escribe aquí:
  plantilla-con-pelo-y-gorrito.png  la muñeca aprobada (piel clara, ojos marrones, melena castaña con sus mechones
                                    completos, en la copia sin los restos del vestido) con el gorrito de dormir B: el
                                    encaje que tiene que respetar el pijama;
  plantilla-sin-pelo.png            la misma muñeca sin pelo (ni gorrito): el contorno del cuello, los hombros y los
                                    brazos, que el pelo tapa;
  zonas-pijama.png                  sin pelo: en magenta, la ropa de la base (camiseta y mallas rosas) que el pijama
                                    tiene que tapar entera; en azul, lo que NO se toca (cara, cuello, manos); con medidas.
  medidas.json                      cifras (anchos del torso y de las piernas, alto de la ropa de la base).

Uso (desde la raíz): python3 docs/propuestas/pijama-2026-10-22/guia-chatgpt/preparar_guia.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; P = AQUI.parents[1]; B = P / 'base-aprobada-d013-2026-10-14'
sys.path.insert(0, str(B / 'piel-tonos')); import piel_tonos as PT   # noqa: E402
VAR = B / 'pelo-borrador-d012' / 'revision-localizada' / 'variante-experimental'
CAPAS_PELO = (VAR / 'pelo-variante-sin-mechon-detras.png', B / 'pelo-sin-restos' / 'pelo-delante-castano-sin-restos.png')   # sin los restos del vestido
GORRITO = P / 'accesorios-2026-10-16' / 'gorrito' / 'capa-gorrito-b.png'
CREMA = (253, 250, 245)


def montar(rutas):
    f = Image.new('RGBA', (948, 1659), CREMA + (255,))
    for r in rutas:
        f.alpha_composite(Image.open(r).convert('RGBA'))
    return f.convert('RGB')


if __name__ == '__main__':
    base, ojos = PT.SIN_OJOS, PT.OJOS['marron']
    montar([CAPAS_PELO[0], base, ojos, CAPAS_PELO[1], GORRITO]).save(AQUI / 'plantilla-con-pelo-y-gorrito.png', optimize=True)
    sin = montar([base, ojos]); sin.save(AQUI / 'plantilla-sin-pelo.png', optimize=True)
    b = PT.abrir(base); ropa = PT.MV.ropa_de_la_base(b)
    YY, XX = np.mgrid[:b.shape[0], :b.shape[1]]
    cuerpo = b[..., 3] > 128
    no_tocar = cuerpo & ~ropa & ((YY < 640) | ((YY > 1010) & (YY < 1130) & ((XX < 330) | (XX > 625))))   # cabeza, cuello y manos
    v = np.array(sin).astype(float)
    v[ropa] = v[ropa] * 0.45 + np.array([230, 0, 160]) * 0.55
    v[no_tocar] = v[no_tocar] * 0.7 + np.array([40, 110, 230]) * 0.3
    o = Image.fromarray(v.astype(np.uint8)); d = ImageDraw.Draw(o); F = PT.MK.F(20)
    medidas = {}
    for y in (700, 800, 900, 1000, 1100, 1200, 1250):
        tr = np.flatnonzero(ropa[y]); medidas[y] = [int(tr.min()), int(tr.max())] if len(tr) else None
    ys = np.flatnonzero(ropa.any(1))
    d.text((20, 20), 'Magenta: la ropa de la base, que el pijama tapa entera', font=F, fill=(160, 0, 110))
    d.text((20, 48), 'Azul: lo que no se toca (cara, cuello, manos)', font=F, fill=(20, 70, 180))
    d.text((20, 76), f'Ropa de la base: de y = {ys.min()} a y = {ys.max()} (lienzo 948 × 1659)', font=F, fill=(40, 40, 60))
    o.save(AQUI / 'zonas-pijama.png', optimize=True)
    (AQUI / 'medidas.json').write_text(json.dumps(dict(lienzo=[948, 1659], ropa_de_la_base_filas=[int(ys.min()), int(ys.max())],
                                                       ropa_de_la_base_por_fila=medidas), ensure_ascii=False, indent=1), encoding='utf-8')
    print(dict(ropa_px=int(ropa.sum()), filas=[int(ys.min()), int(ys.max())]))
