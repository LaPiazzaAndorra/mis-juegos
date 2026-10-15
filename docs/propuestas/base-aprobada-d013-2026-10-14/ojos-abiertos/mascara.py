#!/usr/bin/env python3
"""
Máscara PROPUESTA de los ojos abiertos y sus pestañas (base D-014, copia técnica, 948 × 1659) · versión 2.

Solo calcula una máscara (gris, 0 = fuera, 255 = dentro, intermedios = bordes suaves). NO extrae
ni borra nada: la base no cambia, y los píxeles, la forma, el tamaño y la posición de los ojos
tampoco. La versión 1 se conserva en mascara-ojos-propuesta-v1.png (y su programa en el commit 73ca84d).

Para cada ojo, alrededor del centro del iris medido en ../medidas/:
  (a) abertura del ojo (blanco, iris y brillos): envolvente convexa del blanco y del iris → opaca.
      Es la misma que en la v1: iris, blancos y brillos no cambian.
  (b) línea del párpado pegada al blanco, masa negra del párpado con las raíces de las pestañas y
      sombra del párpado sobre el blanco → opacas. Incluye el trazo fino del párpado en el lagrimal.
  (c) pestañas: opacidad por luminancia respecto al fondo local (la piel o la sombra que hay entre
      ellas, estimada con un cierre en gris de 15 px que borra los trazos finos). Los trazos oscuros
      quedan opacos y la piel entre pestañas pasa a 0 (novedad de la v2).
  (d) pliegue del párpado (piel) FUERA: trazos paralelos al contorno del ojo, la zona nasal no negra
      (regla de la v1) y el resto del arco por encima del ojo, solo si es más claro que los tallos de
      las pestañas y va paralelo al contorno (tensor de estructura). Junto a lo quitado, rampa de 3 px:
      sin cortes rectos y sin tocar la línea del párpado.
  (e) residuos de la selección: grupos de < 6 píxeles separados (> 2 px) del resto.

Uso (desde la raíz del repositorio):
  python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-abiertos/mascara.py
    → mascara-ojos-propuesta-v2.png, vista-v2-ampliada.png, vista-v2-tamano-juego.png,
      vista-v2-sobre-base.png y comprobaciones-v2.json

Requiere Python 3 con Pillow, NumPy y SciPy.
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageCms, ImageDraw, ImageFont
from scipy import ndimage as nd
from scipy.spatial import ConvexHull

AQUI = Path(__file__).resolve().parent
BASE = AQUI.parent / 'base-transparencia-corregida.png'
MED = json.loads((AQUI.parent / 'medidas' / 'medidas-provisionales.json').read_text(encoding='utf-8'))['medidas']
OJOS = [(MED['ojo_izq']['x'], MED['ojo_izq']['y']), (MED['ojo_der']['x'], MED['ojo_der']['y'])]
EJE = MED['eje_central']['x']
CRECER, PERMITIR, SEMILLA = 6, 36, 60          # zona de pestañas (como v1)
FONDO_PX, NUCLEO_L = 15, 20.0                  # opacidad por luminancia (v2)
F = lambda t: ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', t)


def lab_de(im):
    t = ImageCms.buildTransform(ImageCms.createProfile('sRGB'), ImageCms.createProfile('LAB'), 'RGB', 'LAB')
    lab = np.array(ImageCms.applyTransform(im.convert('RGB'), t)).astype(float)
    lab[..., 1:] = np.where(lab[..., 1:] > 127, lab[..., 1:] - 256, lab[..., 1:])   # a y b con signo
    return lab


def mascara(im):
    lab = lab_de(im)
    M = np.zeros(lab.shape[:2]); AB = np.zeros(lab.shape[:2], bool); PL = np.zeros(lab.shape[:2], bool); info = []
    for cx, cy in OJOS:
        cx, cy = int(cx), int(cy); s = 1 if cx < EJE else -1          # s: hacia el lagrimal
        x0, x1, y0, y1 = cx - 100, cx + 100, cy - 60, cy + 50
        sub = lab[y0:y1, x0:x1]; L = sub[..., 0]
        yy, xx = np.mgrid[y0:y1, x0:x1]
        r = np.hypot((xx - cx) / 95, (yy - cy) / 55)
        piel = np.median(sub[(r > 0.95) & (r < 1.05) & (yy > cy)], 0)
        d = np.sqrt(((sub - piel) ** 2).sum(-1)); dL = piel[0] - L; croma = np.hypot(sub[..., 1], sub[..., 2])
        # (a) abertura (igual que v1)
        blanco = (L > 150) & (croma < 14); iris = (np.hypot(xx - cx, yy - cy) <= 33) & (d > 40)
        partes = nd.binary_opening(blanco | iris, np.ones((3, 3))); lb, n = nd.label(partes)
        juntas = np.zeros_like(partes)
        for i in range(1, n + 1):
            c = lb == i
            if c.sum() >= 30 and np.hypot(xx[c].mean() - cx, yy[c].mean() - cy) < 75:
                juntas |= c
        ys, xs = np.nonzero(juntas); h = ConvexHull(np.c_[xs, ys])
        lz = Image.new('L', (x1 - x0, y1 - y0), 0)
        ImageDraw.Draw(lz).polygon([(float(xs[i]), float(ys[i])) for i in h.vertices], fill=255, outline=255)
        ab = np.array(lz) > 0; dist = nd.distance_transform_edt(~ab)
        # zona de párpado y pestañas (como v1, ampliada 2 px)
        lb2, _ = nd.label(dL > SEMILLA, np.ones((3, 3)))
        ids = np.unique(lb2[(dL > SEMILLA) & nd.binary_dilation(ab, iterations=6)]); ids = ids[ids > 0]
        sem = np.isin(lb2, ids); pest = sem.copy()
        for _ in range(CRECER):
            pest = nd.binary_dilation(pest, np.ones((3, 3))) & (dL > PERMITIR)
        zona = nd.binary_dilation(pest | sem, iterations=2) & ~ab
        # (c) opacidad por luminancia
        fondo = nd.grey_closing(L, size=(FONDO_PX, FONDO_PX))
        clave = np.clip((fondo - L - 4) / np.maximum(fondo - NUCLEO_L, 1), 0, 1)
        clave = np.clip((clave - 0.22) / 0.55, 0, 1)
        # (b) partes opacas del párpado
        linea = (dist <= 2) & (dL > 25) & ~ab
        nucleo = sem & (L < 60)
        disco = (lambda y, x: x * x + y * y <= 16)(*np.mgrid[-4:5, -4:5])
        dentro = nd.binary_fill_holes(nd.binary_closing(ab | nucleo | linea, disco)) & ~ab & (dist <= 6)
        dentro |= nd.binary_fill_holes(ab | pest) & ~ab & (dist <= 5)
        # (d) pliegue del párpado
        trazos = (clave > 0.25) & zona & (dist > 3); lb3, n3 = nd.label(trazos, np.ones((3, 3)))
        pliegue = np.zeros_like(trazos)
        for i in range(1, n3 + 1):
            c = lb3 == i; ys_, xs_ = np.nonzero(c); largo = max(np.ptp(xs_), np.ptp(ys_)) + 1
            if largo > 15 and np.ptp(dist[c]) < 0.45 * largo and ((xx[c].mean() - cx) * s) > 0:
                pliegue |= c
        lejos_negro = ~nd.binary_dilation(L < 40, iterations=2)
        pliegue |= ((xx - cx) * s > 5) & (yy < cy + 20) & (dist > 1) & (L >= 60) & lejos_negro & zona
        gy, gx = np.gradient(nd.gaussian_filter(L, 1.0))
        Jxx, Jyy, Jxy = (nd.gaussian_filter(v, 1.5) for v in (gx * gx, gy * gy, gx * gy))
        paralelo = np.abs(np.cos(0.5 * np.arctan2(2 * Jxy, Jxx - Jyy) - np.arctan2(yy - cy, (xx - cx) * 0.6))) > 0.85
        pliegue |= ((xx - cx) * s > -40) & (yy < cy - 15) & (dist > 4) & (L >= 95) & paralelo & lejos_negro & zona
        quitar = nd.binary_dilation(pliegue, iterations=2) & ~nd.binary_dilation(nucleo, iterations=1)
        opaco = linea | dentro | nucleo
        m = np.zeros(L.shape); m[zona] = clave[zona]; m[opaco] = 1; m[quitar & ~opaco] = 0
        dp = nd.distance_transform_edt(~quitar); rampa = (dp > 0) & (dp <= 3) & ~opaco
        m[rampa] *= dp[rampa] / 3
        # (e) residuos
        mm = m > 0.02; lb4, n4 = nd.label(mm, np.ones((3, 3))); sz = nd.sum(mm, lb4, range(1, n4 + 1))
        grande = np.isin(lb4, 1 + np.flatnonzero(sz >= 6))
        resto = mm & ~grande & ~nd.binary_dilation(grande, iterations=2); m[resto] = 0
        m[ab] = 1
        M[y0:y1, x0:x1] = np.maximum(M[y0:y1, x0:x1], m); AB[y0:y1, x0:x1] |= ab; PL[y0:y1, x0:x1] |= quitar & ~opaco
        info.append(dict(ojo=[cx, cy], pliegue_quitado_px=int(pliegue.sum()), residuos_quitados_px=int(resto.sum())))
    mascara.pliegue = PL                         # zona quitada como pliegue (la usa el relleno de la base)
    return (M * 255).round().astype(np.uint8), AB, info


def sobre(rgb, mm, color):
    return rgb * mm + np.array(color, float) * (1 - mm)


def vistas(im, m, m1):
    base = np.array(im.convert('RGB')).astype(float)
    fondo = Image.new('RGBA', im.size, (255, 255, 255, 255)); fondo.alpha_composite(im)
    a = np.array(fondo.convert('RGB')).astype(float)
    mm, mm1 = m.astype(float)[..., None] / 255, m1.astype(float)[..., None] / 255
    CLARO, OSCURO = (255, 246, 251), (45, 40, 70)
    capa_sobre_base = base * mm + a * (1 - mm)              # la capa en su sitio sobre la base
    borde = (m > 127) ^ nd.binary_erosion(m > 127, iterations=1)
    # 1) ampliada ×4
    z = 4; filas = []
    for cx, cy in OJOS:
        x0, y0 = (int(cx) - 96 if cx < EJE else int(cx) - 64), int(cy) - 58
        k = (slice(y0, y0 + 100), slice(x0, x0 + 160))
        o = a[k].copy(); o[borde[k]] = (0, 200, 80)
        cols = [a[k], o, sobre(base[k], mm[k], CLARO), sobre(base[k], mm[k], OSCURO), capa_sobre_base[k], sobre(base[k], mm1[k], OSCURO)]
        sep = np.full((100 * z, 8, 3), 255.0)
        filas.append(np.concatenate(sum([[np.kron(c, np.ones((z, z, 1))), sep] for c in cols], [])[:-1], 1))
    hoja = np.concatenate([np.full((34, filas[0].shape[1], 3), 255.0), filas[0], np.full((8, filas[0].shape[1], 3), 255.0), filas[1]], 0)
    img = Image.fromarray(hoja.astype(np.uint8)); d = ImageDraw.Draw(img); w = 160 * z + 8
    for i, t in enumerate(['Base', 'Máscara v2 (contorno)', 'v2 · fondo claro', 'v2 · fondo oscuro', 'v2 sobre la base', 'v1 · fondo oscuro (antes)']):
        d.text((6 + i * w, 8), t, font=F(20), fill=(40, 40, 60))
    img.save(AQUI / 'vista-v2-ampliada.png', optimize=True)
    # 2) sobre la base completa (máscara en magenta, contorno verde)
    t = a * (1 - 0.45 * mm) + np.array([255, 0, 200]) * 0.45 * mm; t[borde] = (0, 200, 80)
    Image.fromarray(t.astype(np.uint8)).save(AQUI / 'vista-v2-sobre-base.png', optimize=True)
    # 3) tamaño de juego (aprox.): muñeca de ~480 px de alto («Vestir», iPhone) y ~220 px («Mi Mundo»)
    caja = (150, 160, 810, 1550)
    paneles = [('Base', a), ('Ojos · claro', sobre(base, mm, CLARO)), ('Ojos · oscuro', sobre(base, mm, OSCURO)), ('Ojos sobre base', capa_sobre_base)]
    bloques = []
    for alto in (480, 220):
        ims = []
        for t_, arr in paneles:
            p = Image.fromarray(arr.astype(np.uint8)).crop(caja); p = p.resize((round(p.width * alto / p.height), alto), Image.LANCZOS)
            ims.append(p)
        W = max(sum(p.width + 12 for p in ims), 520); blo = Image.new('RGB', (W, alto + 56), (255, 255, 255)); dd = ImageDraw.Draw(blo); x = 0
        dd.text((2, 2), f'Muñeca de {alto} px de alto (aprox. {"«Vestir» en iPhone" if alto > 300 else "«Mi Mundo»"})', font=F(16), fill=(40, 40, 60))
        for (t_, _), p in zip(paneles, ims):
            blo.paste(p, (x, 52)); dd.text((x + 2, 28), t_, font=F(13 if alto < 300 else 15), fill=(90, 80, 110)); x += p.width + 12
        bloques.append(blo)
    W = max(b.width for b in bloques); H = sum(b.height + 10 for b in bloques)
    hoja = Image.new('RGB', (W, H), (255, 255, 255)); y = 0
    for b in bloques:
        hoja.paste(b, (0, y)); y += b.height + 10
    hoja.save(AQUI / 'vista-v2-tamano-juego.png', optimize=True)
    return float(np.abs(capa_sobre_base - a).max())


if __name__ == '__main__':
    im = Image.open(BASE).convert('RGBA')
    m, AB, info = mascara(im)
    Image.fromarray(m, 'L').save(AQUI / 'mascara-ojos-propuesta-v2.png', optimize=True)
    m1 = np.array(Image.open(AQUI / 'mascara-ojos-propuesta-v1.png'))
    dif = vistas(im, m, m1)
    semi = (m > 0) & (m < 255)
    lb, n = nd.label(m > 0, np.ones((3, 3)))
    comp = dict(
        tamaño=list(m.shape[::-1]), pixeles=int((m > 0).sum()), opacos=int((m == 255).sum()), bordes_suaves=int(semi.sum()),
        abertura_px=int(AB.sum()), abertura_opaca_v1=bool((m1[AB] == 255).all()), abertura_opaca_v2=bool((m[AB] == 255).all()),
        quitado_respecto_v1_px=int(((m1 > 0) & (m == 0)).sum()), añadido_respecto_v1_px=int(((m1 == 0) & (m > 0)).sum()),
        grupos=int(n), ojos=info, diferencia_maxima_capa_sobre_base=dif,
        bordes_mezclados_con_piel_px=int((semi & (m < 230)).sum()))
    (AQUI / 'comprobaciones-v2.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
