#!/usr/bin/env python3
"""
Integra el relleno de las axilas hecho con la herramienta de imagen de ChatGPT en una COPIA del vestido opción B.

Solo se toman de la imagen editada los píxeles de la zona marcada (mascara-falta-tela.png). Todo lo demás del
vestido (diseño, bordados, largo, ancho, bordes y tul) se queda EXACTAMENTE como en ../vestido-opcion-b.png, aunque
ChatGPT haya cambiado algo más.

  1. La imagen editada debe ser vertical 2:3 (p. ej. 1024 × 1536, como recorte-para-chatgpt.png). Se reduce a
     540 × 810 y se coloca en su sitio (recorte x 209–749, y 560–1370 de la capa de 948 × 1659).
  2. En la zona marcada: color de la imagen editada y alfa 255 (tela opaca); fundido de 1 px con el borde.
  3. Comprobaciones: alineación (correlación de bordes fuera de la zona, desplazamientos de ±6 px) y que TODA la zona
     sea tela, sin blanco del fondo (L > 230 y croma < 12 en la escala del proyecto). Si algo falla, NO se escribe la
     candidata: solo la revisión, que marca en rojo lo que falla.
  4. Informe: cuánto ha cambiado ChatGPT FUERA de la zona (solo informativo, no se usa) y vistas para revisar.

Uso (desde la raíz):
  python3 docs/propuestas/vestido-rosa-2026-10-15/opcion-b/para-chatgpt/integrar_relleno.py EDITADA.png
Escribe ../revision-axilas-chatgpt.png y, solo si todo encaja, ../vestido-opcion-b-axilas-candidata.png.
No toca nada más.
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; OPB = AQUI.parent
sys.path[:0] = [str(OPB.parent / 'montaje')]
import montaje_vestido as MV   # noqa: E402  (Lab del proyecto)
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
    # --- alineación: correlación de bordes fuera de la zona, desplazamientos de ±6 px ----------------------
    gris = lambda x: x.mean(-1) if x.ndim == 3 else x
    orig = np.array(Image.open(AQUI / 'recorte-para-chatgpt.png').convert('RGB').resize((w, h), Image.LANCZOS)).astype(float)
    grad = lambda x: np.hypot(*np.gradient(nd.gaussian_filter(gris(x), 1.0)))
    ge, go = grad(ed), grad(orig); val = ~nd.binary_dilation(mr, iterations=10); val[:20] = val[-20:] = False; val[:, :20] = val[:, -20:] = False
    corr = {(dy, dx): float(np.corrcoef(np.roll(np.roll(ge, dy, 0), dx, 1)[val], go[val])[0, 1]) for dy in range(-6, 7) for dx in range(-6, 7)}
    mejor = max(corr, key=corr.get); alineada = mejor == (0, 0) and corr[(0, 0)] > 0.9
    # --- ¿toda la zona es tela? (sin blanco del fondo) ------------------------------------------------------
    lab = MV.R.lab_rgba(sal); L = lab[..., 0]; C = np.hypot(lab[..., 1], lab[..., 2])
    blanco = m & (L > 230) & (C < 12)
    fuera = ~nd.binary_dilation(mr, iterations=6)
    dif = np.abs(ed - orig).max(-1)[fuera]
    informe = dict(imagen=Path(sys.argv[1]).name, zona_px=int(m.sum()), alineacion=dict(desplazamiento_mejor=list(mejor),
                   correlacion_sin_mover=round(corr[(0, 0)], 4), correlacion_mejor=round(corr[mejor], 4), alineada=bool(alineada)),
                   blanco_del_fondo_en_la_zona_px=int(blanco.sum()), tela_en_la_zona_px=int(m.sum() - blanco.sum()),
                   cambio_de_chatgpt_fuera_de_la_zona=dict(media=round(float(dif.mean()), 1), maximo=int(dif.max()), nota='no se usa'))
    encaja = alineada and blanco.sum() == 0
    informe['encaja'] = bool(encaja)
    (OPB / 'revision-axilas-chatgpt.json').write_text(json.dumps(informe, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(informe, ensure_ascii=False))
    if encaja:
        Image.fromarray(sal, 'RGBA').save(OPB / 'vestido-opcion-b-axilas-candidata.png', optimize=True)
    # --- revisión: recorte de ChatGPT, integrada sobre fondo oscuro (rojo = blanco del fondo) y montaje -----
    bg = (255, 250, 245); osc = (45, 40, 70)
    def ver(x, c=bg):
        i = Image.fromarray(x, 'RGBA'); b = Image.new('RGBA', i.size, c + (255,)); b.alpha_composite(i); return b.convert('RGB')
    edc = Image.open(sys.argv[1]).convert('RGB').resize((w, h), Image.LANCZOS); ed_full = Image.new('RGB', (vb.shape[1], vb.shape[0]), (255, 255, 255)); ed_full.paste(edc, (x0, y0))
    ed_arr = np.array(ed_full); borde_m = m & ~nd.binary_erosion(m); ed_arr[borde_m] = (0, 120, 255)
    integ = np.array(ver(sal, osc)); integ[blanco] = (230, 20, 20)
    paneles = [('Opción B (sin relleno)', ver(vb, osc)), ('Imagen de ChatGPT (azul: zona)', Image.fromarray(ed_arr)),
               ('Integrada · rojo: blanco del fondo', Image.fromarray(integ))]
    out = Image.new('RGB', (3 * 2 * 255 + 30, 2 * 330 + 60), 'white'); d = ImageDraw.Draw(out); F = MV.R.MK.F
    d.text((4, 4), ('ENCAJA' if encaja else 'NO ENCAJA') + f' · blanco del fondo en la zona: {int(blanco.sum())} de {int(m.sum())} px · '
           f'alineación {mejor} (correlación {corr[mejor]:.3f})', font=F(15), fill=(200, 20, 20) if not encaja else (20, 120, 20))
    for j, caja in enumerate(((330, 740, 430, 850), (545, 740, 645, 850))):
        for i, (t, p) in enumerate(paneles):
            x = (j * 3 + i) * 255
            out.paste(p.crop(caja).resize((250, 275), Image.NEAREST), (x, 50 + 0)); d.text((x + 2, 30), t, font=F(13), fill=(40, 40, 60))
    out = out.crop((0, 0, out.width, 340)); out.save(OPB / 'revision-axilas-chatgpt.png')
    print('Encaja: escrita vestido-opcion-b-axilas-candidata.png (revisar antes de aprobar).' if encaja else
          'NO encaja: no se escribe la candidata; ver revision-axilas-chatgpt.png.')
    sys.exit(0 if encaja else 2)
