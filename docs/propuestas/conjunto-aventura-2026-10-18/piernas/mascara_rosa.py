#!/usr/bin/env python3
"""
Máscara mínima para el rosa que aún asoma bajo el pantalón (D-027, rodillas B): los píxeles rosas de la base B
(`../integrar/piernas-b/base-piernas-sin-mallas.png`) que el pantalón de aventura no tapa, más 2 px alrededor (sus bordes
suaves), SOLO donde el pantalón no es opaco (bajo el pantalón el rosa no se ve y la imagen de ChatGPT tendrá allí el
pantalón: no se toma). Nada más.

A ChatGPT se le envía la muñeca con el pantalón, las botas y los calcetines puestos (así entiende que es piel que asoma
bajo el pantalón verde) y se toma solo esta zona.

Salidas: mascara-rosa.png (blanco = completar), mascara-rosa-transparente.png, para-chatgpt/rosa/ (la muñeca con el
pantalón sobre crema, la zona marcada y las zonas ampliadas ×4) y comprobaciones-rosa.json.
Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/piernas/mascara_rosa.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; sys.path.insert(0, str(CJ))
import conjunto_aventura as A   # noqa: E402
PT = A.PT; CREMA = (253, 250, 245)
BASE_B = CJ / 'integrar' / 'piernas-b' / 'base-piernas-sin-mallas.png'

if __name__ == '__main__':
    b = PT.abrir(BASE_B); lb = PT.lab_de(b); YY = np.mgrid[0:1659, 0:948][0]
    pa = PT.abrir(CJ / 'capas' / 'pantalon.png')[..., 3]; pant = pa > 128
    rosa = (b[..., 3] > 128) & (lb[..., 1] > 15) & (lb[..., 2] < 14) & (YY > 1095)
    visto = rosa & ~pant
    zona = nd.binary_dilation(visto, iterations=2) & (pa < 128) & (b[..., 3] > 0)
    Image.fromarray(np.where(zona, 255, 0).astype(np.uint8)).save(AQUI / 'mascara-rosa.png', optimize=True)
    t = b.copy(); t[zona] = 0; Image.fromarray(t, 'RGBA').save(AQUI / 'mascara-rosa-transparente.png', optimize=True)
    D = AQUI / 'para-chatgpt' / 'rosa'; D.mkdir(parents=True, exist_ok=True)
    f = Image.new('RGBA', (948, 1659), CREMA + (255,))
    for c in [b, PT.abrir(PT.OJOS['marron'])] + [PT.abrir(CJ / 'capas' / f'{k}.png') for k in ('calcetines', 'botas', 'pantalon')]:
        f.alpha_composite(Image.fromarray(c, 'RGBA'))
    f.convert('RGB').save(D / 'con-pantalon-a-completar.png', optimize=True)
    o = np.array(f.convert('RGB')).astype(float); o[zona] = o[zona] * 0.3 + np.array((230, 0, 140)) * 0.7
    o[nd.binary_dilation(zona, iterations=2) & ~zona] = (150, 0, 90); o = o.astype(np.uint8)
    Image.fromarray(o).save(D / 'zona-rosa-marcada.png', optimize=True)
    et, n = nd.label(nd.binary_dilation(zona, iterations=8)); partes = []
    for i in range(1, n + 1):
        ys, xs = np.where(et == i); cx, cy = int(xs.mean()), int(ys.mean()); partes.append(dict(centro=[cx, cy], px=int((zona & (et == i)).sum())))
    w = 60; tiras = []
    for p in partes:
        cx, cy = p['centro']; caja = (cx - w, cy - w // 2, cx + w, cy + w // 2)
        a = Image.fromarray(o).crop(caja).resize((4 * 2 * w, 4 * w), Image.NEAREST); c = f.convert('RGB').crop(caja).resize((4 * 2 * w, 4 * w), Image.LANCZOS)
        tiras += [c, a]
    hoja = Image.new('RGB', (2 * (8 * w + 10), len(partes) * (4 * w + 10)), 'white')
    for i, im in enumerate(tiras):
        hoja.paste(im, ((i % 2) * (8 * w + 10), (i // 2) * (4 * w + 10)))
    hoja.save(D / 'zonas-rosa-ampliadas.png', optimize=True)
    ys, xs = np.where(zona)
    comp = dict(rosa_a_la_vista_px=int(visto.sum()), zona_px=int(zona.sum()), caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
                partes=partes, bajo_el_pantalon_px=int((zona & pant).sum()), base=str(BASE_B.relative_to(A.RAIZ)))
    (AQUI / 'comprobaciones-rosa.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
