#!/usr/bin/env python3
"""
Integra el relleno de las axilas hecho con la herramienta de imagen de ChatGPT en una COPIA del vestido opción B.

Solo se toman de la imagen editada los píxeles de la zona marcada (mascara-falta-tela.png). Todo lo demás del
vestido (diseño, bordados, largo, ancho, bordes y tul) se queda EXACTAMENTE como en ../vestido-opcion-b.png, aunque
ChatGPT haya cambiado algo más.

  1. La imagen editada debe ser vertical 2:3 (p. ej. 1024 × 1536, como recorte-para-chatgpt.png). Se reduce a
     540 × 810 y se coloca en su sitio (recorte x 209–749, y 560–1370 de la capa de 948 × 1659).
  2. En la zona marcada: color de la imagen editada y alfa 255 (tela opaca); fundido de 1 px con el borde.
  3. Informe: cuánto ha cambiado ChatGPT FUERA de la zona (solo informativo, no se usa) y vistas para revisar.

Uso (desde la raíz):
  python3 docs/propuestas/vestido-rosa-2026-10-15/opcion-b/para-chatgpt/integrar_relleno.py EDITADA.png
Escribe ../vestido-opcion-b-axilas-candidata.png y ../revision-axilas-chatgpt.png. No toca nada más.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; OPB = AQUI.parent
RECORTE = (209, 560, 749, 1370)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    ed = Image.open(sys.argv[1]).convert('RGB')
    if abs(ed.width / ed.height - 2 / 3) > 0.01:
        sys.exit(f'La imagen editada mide {ed.width} × {ed.height}: no es 2:3. ChatGPT ha cambiado el encuadre; '
                 'no se integra (habría que alinearla a mano).')
    w, h = RECORTE[2] - RECORTE[0], RECORTE[3] - RECORTE[1]
    ed = np.array(ed.resize((w, h), Image.LANCZOS)).astype(float)
    vb = np.array(Image.open(OPB / 'vestido-opcion-b.png').convert('RGBA'))
    m = np.array(Image.open(AQUI / 'mascara-falta-tela.png')) > 0
    x0, y0, x1, y1 = RECORTE
    mr = m[y0:y1, x0:x1]
    peso = np.clip(nd.distance_transform_edt(mr) / 1.5, 0, 1)                 # 1 px de fundido hacia dentro
    sal = vb.copy().astype(float); reg = sal[y0:y1, x0:x1]
    a_old = reg[..., 3:] / 255
    nuevo_rgb = ed * peso[..., None] + reg[..., :3] * (1 - peso[..., None]) * (a_old > 0) + ed * (1 - peso[..., None]) * (a_old == 0)
    reg[mr, :3] = nuevo_rgb[mr]; reg[mr, 3] = 255
    sal[y0:y1, x0:x1] = reg
    sal = np.round(sal).clip(0, 255).astype(np.uint8)
    Image.fromarray(sal, 'RGBA').save(OPB / 'vestido-opcion-b-axilas-candidata.png', optimize=True)
    # cuánto cambió ChatGPT fuera de la zona (comparando con el recorte que se le dio)
    orig = np.array(Image.open(AQUI / 'recorte-para-chatgpt.png').convert('RGB').resize((w, h), Image.LANCZOS)).astype(float)
    fuera = ~nd.binary_dilation(mr, iterations=6)
    dif = np.abs(ed - orig).max(-1)[fuera]
    print(f'Zona integrada: {int(mr.sum())} px. Fuera de la zona, ChatGPT cambió de media {dif.mean():.1f} '
          f'(máx. {dif.max():.0f}); esos cambios NO se usan.')
    bg = (255, 250, 245)
    def ver(x):
        i = Image.fromarray(x, 'RGBA'); b = Image.new('RGBA', i.size, bg + (255,)); b.alpha_composite(i); return b.convert('RGB')
    paneles = [('Opción B', ver(vb)), ('Con relleno de ChatGPT', ver(sal))]
    out = Image.new('RGB', (2 * 2 * 300 + 20, 2 * 140 + 40), 'white'); d = ImageDraw.Draw(out)
    for j, caja in enumerate(((330, 740, 430, 850), (545, 740, 645, 850))):
        for i, (t, p) in enumerate(paneles):
            x = (j * 2 + i) * 305
            out.paste(p.crop(caja).resize((300, 330), Image.LANCZOS), (x, 30)); d.text((x + 2, 8), t, fill=(40, 40, 60))
    out.save(OPB / 'revision-axilas-chatgpt.png')
    print('Escrito: vestido-opcion-b-axilas-candidata.png y revision-axilas-chatgpt.png (revisar antes de aprobar).')
