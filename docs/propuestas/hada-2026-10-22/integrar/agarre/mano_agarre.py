#!/usr/bin/env python3
"""
Hada (D-029) · mano de agarre para la varita (candidata). Solo se usa con la varita puesta; sin ella, vuelve la mano
original. La base aprobada, la del hada (../base-hada.png) y el resto del conjunto no cambian: todo sale a esta carpeta.

1. La mano cerrada alrededor del palo es la que dibujó ChatGPT en el conjunto sin pelo (../conjunto-alineado.png):
   separada por contraste (semillas de piel frente al palo dorado, las alas, el vestido y el fondo), SIN el palo.
2. Su muñeca estaba unos px desplazada respecto a nuestro brazo: se traslada (sin escalar ni girar) a la posición que
   mejor encaja con los bordes de nuestro antebrazo justo encima (búsqueda), y su piel se iguala en tono con la nuestra
   (diferencia mediana en la franja de la muñeca). Por arriba se funde con nuestro brazo en una franja de 12 px; el canto
   toma el color de la mano de justo dentro (sin el halo claro de lo que había al lado en la imagen).
3. La varita (pieza pendiente) se vuelve a colocar con la misma escala aprobada (0,318) y solo traslación y un giro
   pequeño, para que el palo pase por el hueco del puño (ajuste al palo de la imagen, trasladado como la mano).
4. Capas: mano-agarre.png (encima de la varita: los dedos por delante del palo), varita-agarre.png (la varita recolocada),
   base-hada-agarre.png y brazos-agarre.png (copias sin nuestra mano abierta por debajo de la muñeca, para que no asome
   bajo el puño) y alas-agarre.png (copia de alas.png sin el canto claro que dejó la mano de ChatGPT). Montajes con los
   tres peinados y detalle antes y después.

Uso (desde la raíz): python3 docs/propuestas/hada-2026-10-22/integrar/agarre/mano_agarre.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; I = AQUI.parent
sys.path.insert(0, str(I)); import extraer_hada as EH   # noqa: E402
R, PT, H, W, CREMA = EH.R, EH.PT, EH.H, EH.W, EH.CREMA
CORTE = 978            # fila de la muñeca: por encima, nuestro brazo; por debajo, la mano de agarre
FUNDIDO = 12


def mascara_mano(a, L):
    YY, XX = np.mgrid[:H, :W]; C = np.hypot(L[..., 1], L[..., 2]); h = np.degrees(np.arctan2(L[..., 2], L[..., 1]))
    zona = (XX > 110) & (XX < 300) & (YY > 960) & (YY < 1120)
    ref = np.median(L[1000:1030, 200:240].reshape(-1, 3), 0); dE = np.sqrt(((L - ref) ** 2).sum(-1))
    sem = np.zeros((H, W), np.int32)
    m = nd.binary_erosion((dE < 28) & zona, iterations=2); et, n = nd.label(m); box = et[995:1040, 190:250]
    sem[et == np.bincount(box[box > 0]).argmax()] = 1
    oro = (h > 62) & (C > 45) & (L[..., 0] < 215) & zona
    sem[nd.binary_erosion(oro, iterations=1)] = 2
    sem[nd.binary_erosion(zona & ((C < 22) | (h < 35) | (L[..., 0] > 222)), iterations=2)] = 2
    sem[~zona] = 2
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(L[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(L[..., i], 1), 1) ** 2 for i in range(3)))
    mano = nd.binary_fill_holes(watershed(g, sem) == 1)
    palo = mano & nd.binary_dilation(oro, iterations=1)
    return mano & ~palo, oro


def desplazar(x, dx, dy):
    o = np.zeros_like(x); h, w = x.shape[:2]
    ys0, ys1 = max(0, dy), min(h, h + dy); xs0, xs1 = max(0, dx), min(w, w + dx)
    o[ys0:ys1, xs0:xs1] = x[ys0 - dy:ys1 - dy, xs0 - dx:xs1 - dx]; return o


if __name__ == '__main__':
    YY, XX = np.mgrid[:H, :W]
    a = np.array(Image.open(I / 'conjunto-alineado.png').convert('RGB')); L = R.lab(a)
    base_h = PT.abrir(I / 'base-hada.png'); nuestra = base_h[..., 3] > 128
    mano, oro = mascara_mano(a, L)
    # 2. traslación: los bordes de la mano de ChatGPT en la franja de la muñeca frente a los de nuestro antebrazo
    franja = (YY >= CORTE - 4) & (YY < CORTE + 8) & (XX < 330)
    mejor = None
    for dx in range(-4, 16):
        for dy in range(-6, 9):
            mm = desplazar(mano, dx, dy) & franja; nn = nuestra & franja & (XX > 190)
            e = int((mm ^ nn).sum())
            if mejor is None or e < mejor[0]:
                mejor = (e, dx, dy)
    _, DX, DY = mejor
    mano_t = desplazar(mano, DX, DY); col_t = desplazar(a, DX, DY)
    # tono: la piel de la mano de ChatGPT frente a la nuestra, en la franja común de la muñeca
    comun = mano_t & nuestra & (YY >= CORTE - 10) & (YY < CORTE + 10) & ~nd.binary_dilation(~mano_t, iterations=2)
    Lt = R.lab(col_t); Ln = PT.lab_de(base_h).astype(float)
    dif = np.median(Ln[comun] - Lt[comun], 0) if comun.sum() > 30 else np.zeros(3)
    rgb = np.clip(PT.CP.lab_a_rgb(Lt + dif), 0, 255).astype(np.uint8)
    # el canto (2 px) lleva mezclado el color de lo de al lado en la imagen (alas, fondo): toma el de la mano de justo dentro
    dentro = nd.binary_erosion(mano_t, iterations=2); _, (iy, ix) = nd.distance_transform_edt(~dentro, return_indices=True)
    canto = nd.binary_dilation(mano_t, iterations=1) & ~dentro; rgb[canto] = rgb[iy[canto], ix[canto]]
    alfa = np.clip(nd.gaussian_filter(mano_t.astype(float), 0.8) * 1.6 - 0.3, 0, 1)
    alfa *= np.clip((YY - (CORTE - FUNDIDO)) / FUNDIDO, 0, 1)          # fundido con nuestro brazo
    capa = np.dstack([rgb, np.round(alfa * 255).astype(np.uint8)]); capa[capa[..., 3] == 0] = 0
    # 3. varita: traslación y giro pequeño para que el palo pase por el puño (palo de la imagen, trasladado)
    objetivo = desplazar(oro, DX, DY) & (YY > 985) & (YY < 1120) & (XX < 260)
    V = Image.open(EH.VARITA_IMG).convert('RGBA'); va = np.array(V); ys, xs = np.where(va[..., 3] > 128)
    Vc = V.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)); s = EH.VARITA['s']
    Vr = Vc.resize((round(Vc.width * s), round(Vc.height * s)), Image.LANCZOS)
    mejor = None
    for ang in np.arange(-4, 4.1, 0.5):
        v = Vr.rotate(ang, Image.BICUBIC, expand=True)
        for dx in range(-6, 22, 1):
            for dy in range(-10, 26, 2):
                cx, cy = EH.VARITA['cx'] + dx, EH.VARITA['cy'] + dy
                out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); out.paste(v, (round(cx - v.width / 2), round(cy - v.height / 2)), v)
                pal = (np.array(out)[..., 3] > 128) & (YY > 985) & (YY < 1120) & (XX < 260)
                e = int((pal ^ objetivo).sum())
                if mejor is None or e < mejor[0]:
                    mejor = (e, float(ang), dx, dy, np.array(out))
    _, ANG, VDX, VDY, varita = mejor
    # 4. copias sin nuestra mano abierta por debajo de la muñeca
    mano_nuestra = nuestra & (YY >= CORTE) & (XX < 330) & (YY < 1140)
    b2 = base_h.copy(); b2[mano_nuestra] = 0
    br = PT.abrir(EH.MANOS); br[mano_nuestra] = 0
    # alas: alrededor de la mano de ChatGPT (sin trasladar), alas.png tomó de la imagen un canto claro (el halo de esa
    # mano); con la mano de agarre trasladada queda a la vista: en una copia, esos px con el color de las alas solas
    # igualado (como el resto de lo que tapaba el cuerpo). alas.png no cambia
    alas = PT.abrir(I / 'capas' / 'alas.png'); solas = PT.abrir(I / 'capas' / 'alas-solas.png')
    halo = nd.binary_dilation(mano | nd.binary_dilation(oro, iterations=0) & nd.binary_dilation(mano, iterations=3), iterations=4) & (alas[..., 3] > 0) & ~nd.binary_erosion(mano, iterations=1)
    igual = np.clip(PT.CP.lab_a_rgb(R.lab(solas[..., :3]) + np.array(json.loads((I / 'comprobaciones.json').read_text())['alas']['diferencia_de_color_media_Lab'])), 0, 255).astype(np.uint8)
    alas2 = alas.copy(); alas2[halo, :3] = igual[halo]
    for n, x in (('mano-agarre', capa), ('varita-agarre', varita), ('base-hada-agarre', b2), ('brazos-agarre', br), ('alas-agarre', alas2)):
        Image.fromarray(x, 'RGBA').save(AQUI / f'{n}.png', optimize=True)
    asoma = mano_nuestra & ~(capa[..., 3] > 128) & ~(varita[..., 3] > 128)
    comp = dict(mano=dict(px=int(mano_t.sum()), traslacion=[DX, DY], diferencia_de_tono_Lab=[round(float(x), 1) for x in dif]),
                varita=dict(escala=s, giro=ANG, traslacion=[VDX, VDY], centro=[EH.VARITA['cx'] + VDX, EH.VARITA['cy'] + VDY]),
                corte_muneca_y=CORTE, alas_halo_px=int(halo.sum()), mano_original_quitada_px=int(mano_nuestra.sum()), hueco_bajo_el_puno_px=int(asoma.sum()))
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # 5. montajes (sin pelo, melena, coleta y dos coletas sin sombrero) y detalle antes y después
    ab = PT.abrir; ojos = ab(PT.OJOS['marron']); PC = EH.PC; COL, COLS = EH.COLETA, EH.COLETAS
    pz = {n: ab(I / 'capas' / f'{n}.png') for n in ('vestido', 'bailarinas', 'varita', 'dedos', 'alas')}
    nuevas = {n: ab(AQUI / f'{n}.png') for n in ('mano-agarre', 'varita-agarre', 'base-hada-agarre', 'brazos-agarre', 'alas-agarre')}

    def montar(detras, delante, agarre):
        if agarre:
            cs = [nuevas['alas-agarre']] + detras + [nuevas['base-hada-agarre'], ojos, pz['bailarinas'], pz['vestido'], nuevas['brazos-agarre']] + delante + [nuevas['varita-agarre'], nuevas['mano-agarre']]
        else:
            cs = [pz['alas']] + detras + [base_h, ojos, pz['bailarinas'], pz['vestido'], ab(EH.MANOS)] + delante + [pz['varita'], pz['dedos']]
        f = Image.new('RGBA', (W, H), CREMA + (255,))
        for c in cs:
            f.alpha_composite(Image.fromarray(c) if isinstance(c, np.ndarray) else Image.open(c).convert('RGBA'))
        return f.convert('RGB')
    peinados = [('Sin pelo', [], []), ('Melena', [PC / 'pelo-detras-castano.png'], [PC / 'pelo-delante-castano.png']),
                ('Coleta (con cinta)', [ab(COL / 'variantes' / 'orejas-coleta-detras.png'), PC / 'pelo-coleta-con-detras-castano.png'],
                 [ab(COL / 'variantes' / 'orejas-coleta-delante.png'), COL / 'variantes' / 'pelo-coleta-con-delante-castano.png', COL / 'cinta-coleta.png']),
                ('Dos coletas (sin sombrero)', [PC / 'pelo-coletas-sin-sombrero-detras-castano.png'],
                 [COLS / 'variantes' / 'pelo-coletas-sin-sombrero-delante-castano.png', COLS / 'coleteros.png'])]
    F = PT.MK.F(20); c0 = (10, 40, 940, 1600); esc = 0.42; w, h = int((c0[2] - c0[0]) * esc), int((c0[3] - c0[1]) * esc)
    o = Image.new('RGB', (len(peinados) * (w + 10) + 10, h + 40), 'white'); dr = ImageDraw.Draw(o); antes = None
    for i, (t, dt, de) in enumerate(peinados):
        m = montar(dt, de, True); m.save(AQUI / f'montaje-{i + 1}.png', optimize=True)
        if i == 0:
            antes = montar(dt, de, False); sin_pelo = m
        o.paste(m.crop(c0).resize((w, h), Image.LANCZOS), (10 + i * (w + 10), 36)); dr.text((14 + i * (w + 10), 8), t, font=F, fill=(40, 40, 60))
    o.save(AQUI / 'montajes-peinados.png', optimize=True)
    c1 = (40, 840, 360, 1140); e = 1.6; w1, h1 = int((c1[2] - c1[0]) * e), int((c1[3] - c1[1]) * e)
    o = Image.new('RGB', (3 * w1 + 32, h1 + 40), 'white'); dr = ImageDraw.Draw(o)
    for i, (im, t) in enumerate(((Image.fromarray(a), 'Diseño (ChatGPT, alineado)'), (antes, 'Antes: mano original'), (sin_pelo, 'Después: mano de agarre'))):
        o.paste(im.crop(c1).resize((w1, h1), Image.LANCZOS), (8 + i * (w1 + 8), 36)); dr.text((10 + i * (w1 + 8), 8), t, font=F, fill=(40, 40, 60))
    o.save(AQUI / 'antes-despues.png', optimize=True)
    # 6. guía localizada (por si se prefiere que ChatGPT dibuje el agarre sobre nuestra mano): recorte y zona
    G = I.parent / 'guia-chatgpt' / '3-agarre'; G.mkdir(exist_ok=True)
    antes.crop(c1).resize((w1 * 2 // 2 * 2, h1 * 2 // 2 * 2), Image.LANCZOS).save(G / 'recorte-mano-y-varita.png', optimize=True)
    zona = np.array(antes).astype(float); z = mano_nuestra | nd.binary_dilation(mano_nuestra, iterations=6) & (YY >= CORTE)
    zona[z] = zona[z] * 0.55 + np.array([240, 200, 0]) * 0.45; zona[(YY >= CORTE - 1) & (YY <= CORTE + 1) & (XX > 180) & (XX < 300)] = (220, 0, 0)
    Image.fromarray(zona.astype(np.uint8)).crop(c1).resize((w1 * 2, h1 * 2), Image.LANCZOS).save(G / 'zona-mano.png', optimize=True)
    print(json.dumps(comp, ensure_ascii=False))
