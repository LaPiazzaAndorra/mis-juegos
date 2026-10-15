#!/usr/bin/env python3
"""
Integra en una COPIA de la propuesta C (../pelo-delante-mechones-c.png, que no se modifica) SOLO los píxeles de
../mascara-falta-pelo-mechones.png tomados de una imagen editada con ChatGPT (2:3, del recorte-para-chatgpt.png).
Fuera de la máscara, la capa es idéntica a C.

Comprobaciones:
  · alineación global (correlación de bordes fuera de la máscara, ±6 px) y local alrededor de cada zona (±8 px);
  · continuidad: diferencia de color entre la imagen editada y el montaje C en un anillo de 3 px alrededor de cada
    zona (si es grande, la unión tendrá costura);
  · máscara corta: pelo que ChatGPT dibuja delante de las mangas FUERA de la máscara (solo se señala, no se usa).

Uso (desde la raíz):
  python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/revision-localizada/variante-experimental/redistribucion-hombros/para-chatgpt-mechones/integrar_mechones.py EDITADA.png SUFIJO
Escribe ../pelo-delante-mechones-c-chatgpt-SUFIJO.png, ../revision-mechones-chatgpt-SUFIJO.png y .json.
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; RH = AQUI.parent
sys.path[:0] = [str(RH)]
import mechones_hombros as MH   # noqa: E402

RP = MH.RP; MV = RP.MV; R = RP.R; H, W = RP.H, RP.W
MANGAS = [(255, 600, 400, 800), (560, 600, 725, 800)]

if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    edi = Image.open(sys.argv[1]).convert('RGB'); suf = sys.argv[2]
    if abs(edi.width / edi.height - 2 / 3) > 0.01:
        sys.exit(f'{edi.width} × {edi.height}: no es 2:3; no se integra.')
    x0, y0, x1, y1 = MH.RECORTE; w, h = x1 - x0, y1 - y0
    ed = np.array(edi.resize((w, h), Image.LANCZOS)).astype(float)
    og = np.array(Image.open(AQUI / 'recorte-para-chatgpt.png').convert('RGB').resize((w, h), Image.LANCZOS)).astype(float)
    m = np.array(Image.open(RH / 'mascara-falta-pelo-mechones.png')) > 0; mr = m[y0:y1, x0:x1]
    dc = MV.abrir(RH / 'pelo-delante-mechones-c.png')
    det = MV.abrir(RP.VAR / 'pelo-variante-sin-mechon-detras.png'); ves = MV.abrir(RP.VES / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png')
    sin = MV.abrir(MV.BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png')
    ab = MV.abrir(MV.BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png')
    br = MV.abrir(RP.VES / 'montaje' / 'brazos-delante-copiados-de-la-base.png')
    # integración: solo la máscara, opaca
    reg = dc[y0:y1, x0:x1].astype(float); reg[mr, :3] = ed[mr]; reg[mr, 3] = 255
    dn = dc.copy(); dn[y0:y1, x0:x1] = np.round(reg).astype(np.uint8)
    Image.fromarray(dn, 'RGBA').save(RH / f'pelo-delante-mechones-c-chatgpt-{suf}.png', optimize=True)
    # alineación
    g = lambda x: np.hypot(*np.gradient(nd.gaussian_filter(x.mean(-1), 1.0)))
    ge, go = g(ed), g(og)
    val = ~nd.binary_dilation(mr, iterations=20); val[:20] = val[-20:] = False; val[:, :20] = val[:, -20:] = False
    cg = {(dy, dx): float(np.corrcoef(np.roll(np.roll(ge, dy, 0), dx, 1)[val], go[val])[0, 1]) for dy in range(-6, 7, 2) for dx in range(-6, 7, 2)}
    mejor = max(cg, key=cg.get)
    zonas = []; lb, n = nd.label(m)
    for i, sl in enumerate(nd.find_objects(lb)):
        z = (lb == i + 1)[y0:y1, x0:x1]
        win = np.zeros(mr.shape, bool); win[sl[0].start - y0 - 40:sl[0].stop - y0 + 40, sl[1].start - x0 - 40:sl[1].stop - x0 + 40] = True
        win &= ~nd.binary_dilation(mr, iterations=4)
        cl = {(dy, dx): float(np.corrcoef(np.roll(np.roll(ge, dy, 0), dx, 1)[win], go[win])[0, 1]) for dy in range(-8, 9, 2) for dx in range(-8, 9, 2)}
        anillo = nd.binary_dilation(z, iterations=3) & ~z
        zonas.append(dict(zona=i + 1, px=int(z.sum()), caja=[sl[1].start, sl[0].start, sl[1].stop, sl[0].stop],
                          correlacion_local_sin_mover=round(cl[(0, 0)], 3), desplazamiento_local_mejor=list(max(cl, key=cl.get)),
                          diferencia_de_color_en_la_union=round(float(np.abs(ed - og).max(-1)[anillo].mean()), 1)))
    # pelo de ChatGPT delante de las mangas fuera de la máscara (máscara corta)
    edF = np.zeros((H, W, 3), np.uint8); edF[y0:y1, x0:x1] = ed.round().astype(np.uint8)
    lab = R.lab_rgba(np.dstack([edF, np.full((H, W), 255, np.uint8)]))
    hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1])); C = np.hypot(lab[..., 1], lab[..., 2])
    pelo_ed = nd.binary_opening((hue > 40) & (lab[..., 0] < 75) & (C > 12), np.ones((3, 3)))
    cajas = np.zeros((H, W), bool)
    for a, b, c, d in MANGAS:
        cajas[b:d, a:c] = True
    visto = (ves[..., 3] > 200) & (dc[..., 3] < 128)
    corta = nd.binary_closing(pelo_ed & visto & cajas, np.ones((5, 5))) & visto & cajas & ~m
    lb2, n2 = nd.label(corta); sz = nd.sum(corta, lb2, range(1, n2 + 1)); corta = np.isin(lb2, 1 + np.flatnonzero(sz >= 150))
    Image.fromarray((corta * 255).astype(np.uint8), 'L').save(RH / f'mascara-mechones-chatgpt-{suf}-fuera-de-la-mascara.png', optimize=True)
    # revisión visual
    a_ = np.array(R.MP.blanco(MV.montar([det, sin, ab, ves, br, dc]))); b_ = np.array(R.MP.blanco(MV.montar([det, sin, ab, ves, br, dn])))
    c_ = b_.copy(); c_[m & ~nd.binary_erosion(m)] = (0, 200, 255)
    c_[corta] = (c_[corta] * 0.35 + np.array([255, 150, 0]) * 0.65).astype(np.uint8)
    F = R.MK.F; filas = []
    for t, cz in (('Hombro izquierdo', (270, 560, 410, 760)), ('Hombro derecho', (550, 560, 690, 760))):
        ims = [Image.fromarray(x[cz[1]:cz[3], cz[0]:cz[2]]).resize((420, 600), Image.NEAREST) for x in (a_, edF, b_, c_)]
        f = Image.new('RGB', (4 * 430, 626), 'white'); d = ImageDraw.Draw(f)
        for j, (tt, im) in enumerate(zip(('Propuesta C', 'Imagen de ChatGPT', 'C + zonas de la máscara', 'azul: máscara · naranja: pelo de ChatGPT fuera'), ims)):
            f.paste(im, (j * 430, 24)); d.text((j * 430 + 2, 4), f'{t} · {tt}' if j == 0 else tt, font=F(14), fill=(40, 40, 60))
        filas.append(f)
    out = Image.new('RGB', (filas[0].width, sum(f.height + 8 for f in filas)), 'white'); y = 0
    for f in filas:
        out.paste(f, (0, y)); y += f.height + 8
    out.save(RH / f'revision-mechones-chatgpt-{suf}.png', optimize=True)
    inf = dict(imagen=Path(sys.argv[1]).name, alineacion_global=dict(sin_mover=round(cg[(0, 0)], 3), mejor=list(mejor)), zonas=zonas,
               fuera_de_la_mascara_identico=bool((dn == dc)[~m].all()), pelo_de_chatgpt_fuera_de_la_mascara_px=int(corta.sum()),
               zonas_fuera=[[int(s.start), int(t.start), int(s.stop), int(t.stop)] for t, s in nd.find_objects(nd.label(corta)[0])])
    (RH / f'revision-mechones-chatgpt-{suf}.json').write_text(json.dumps(inf, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(inf, ensure_ascii=False))
