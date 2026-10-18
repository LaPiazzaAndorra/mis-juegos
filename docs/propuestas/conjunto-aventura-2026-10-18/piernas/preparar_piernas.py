#!/usr/bin/env python3
"""
Opción A de las rodillas (D-027): una COPIA independiente de la base aprobada en la que se completará en ChatGPT
únicamente la piel que las mallas rosas dejan al descubierto bajo el pantalón de aventura. La base aprobada no cambia.

Zona a completar (`mascara-zona.png`, blanco = completar): las mallas rosas de la base (camiseta y mallas: a* > 15 y
b* < 14 en Lab) por debajo de y = 1 135, es decir, desde unos 25–30 px por DENTRO del pantalón (para que bajo el borde del
pantalón ya haya piel) hasta el borde de las mallas en la rodilla, más 3 px hacia la piel de debajo de la rodilla (para
que la unión quede limpia). Nada más de la muñeca entra en la zona.

Salidas (en esta carpeta):
  · base-copia.png                  copia exacta (mismos bytes) de la base aprobada: la que se completará;
  · mascara-zona.png                zona en blanco sobre negro (para tomar luego solo esos píxeles);
  · mascara-zona-transparente.png   la copia con la zona transparente (para editores que usan transparencia);
  · para-chatgpt/base-a-completar.png   la copia sobre fondo crema (sin transparencias);
  · para-chatgpt/zona-marcada.png        la misma con la zona en magenta y su borde;
  · para-chatgpt/referencia-piel-piernas.png  nuestra piel de las piernas (bajo la rodilla y los pies) para el tono y la
    textura, y cómo queda el pantalón encima;
  · comprobaciones.json.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/piernas/preparar_piernas.py
"""
import hashlib, json, shutil, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; sys.path.insert(0, str(CJ))
import conjunto_aventura as A   # noqa: E402
PT = A.PT; RAIZ = A.RAIZ
Y_DESDE, MARGEN = 1135, 3
CREMA = (253, 250, 245)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    base_p = PT.SIN_OJOS; antes = sha(base_p)
    shutil.copyfile(base_p, AQUI / 'base-copia.png')
    base = PT.abrir(base_p); lab = PT.lab_de(base).astype(float); YY = np.mgrid[0:1659, 0:948][0]
    rosa = (base[..., 3] > 128) & (lab[..., 1] > 15) & (lab[..., 2] < 14)
    mallas = rosa & (YY >= Y_DESDE)
    mallas = nd.binary_fill_holes(mallas) & (YY >= Y_DESDE)
    zona = nd.binary_dilation(mallas, iterations=MARGEN) & (base[..., 3] > 0) & (YY >= Y_DESDE)
    pantalon = PT.abrir(CJ / 'capas' / 'pantalon.png')[..., 3] > 128
    Image.fromarray(np.where(zona, 255, 0).astype(np.uint8)).save(AQUI / 'mascara-zona.png', optimize=True)
    t = base.copy(); t[zona] = 0; Image.fromarray(t, 'RGBA').save(AQUI / 'mascara-zona-transparente.png', optimize=True)
    (AQUI / 'para-chatgpt').mkdir(exist_ok=True)
    fondo = Image.new('RGBA', (948, 1659), CREMA + (255,)); fondo.alpha_composite(Image.fromarray(base, 'RGBA'))
    fondo.convert('RGB').save(AQUI / 'para-chatgpt' / 'base-a-completar.png', optimize=True)
    o = np.array(fondo.convert('RGB')).astype(float); o[zona] = o[zona] * 0.35 + np.array((230, 0, 140)) * 0.65
    borde = nd.binary_dilation(zona, iterations=2) & ~zona; o[borde] = (150, 0, 90)
    Image.fromarray(o.astype(np.uint8)).save(AQUI / 'para-chatgpt' / 'zona-marcada.png', optimize=True)
    # referencia: nuestra piel de las piernas (sin mallas) y cómo quedará con el pantalón y las botas encima
    pie = fondo.crop((300, 1180, 660, 1560))
    con = Image.new('RGBA', (948, 1659), CREMA + (255,)); con.alpha_composite(Image.fromarray(base, 'RGBA'))
    for k in ('calcetines', 'botas', 'pantalon'):
        con.alpha_composite(Image.fromarray(PT.abrir(CJ / 'capas' / f'{k}.png'), 'RGBA'))
    con = con.crop((300, 1000, 660, 1560))
    ref = Image.new('RGB', (pie.width + con.width + 30, max(pie.height, con.height) + 40), 'white'); d = ImageDraw.Draw(ref)
    ref.paste(pie.convert('RGB'), (0, 40)); ref.paste(con.convert('RGB'), (pie.width + 30, 40))
    d.text((6, 8), 'Nuestra piel bajo la rodilla (tono y textura)', font=PT.MK.F(15), fill=(40, 40, 60))
    d.text((pie.width + 36, 8), 'Con el pantalón y las botas: las mallas asoman', font=PT.MK.F(15), fill=(40, 40, 60))
    ref.save(AQUI / 'para-chatgpt' / 'referencia-piel-piernas.png', optimize=True)
    ys, xs = np.where(zona); vis = zona & ~pantalon
    comp = dict(zona_px=int(zona.sum()), caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
                bajo_el_pantalon_px=int((zona & pantalon).sum()), a_la_vista_con_el_pantalon_px=int(vis.sum()),
                mallas_a_la_vista_que_cubre=int((rosa & ~pantalon & (YY > 1150)).sum()), mallas_a_la_vista_fuera_de_la_zona=int((rosa & ~pantalon & (YY > 1150) & ~zona).sum()),
                y_desde=Y_DESDE, margen_px=MARGEN, base=str(Path(base_p).relative_to(RAIZ)), sha256_base=antes,
                copia_identica=sha(AQUI / 'base-copia.png') == antes)
    comp['base_sin_cambios'] = sha(base_p) == antes
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
