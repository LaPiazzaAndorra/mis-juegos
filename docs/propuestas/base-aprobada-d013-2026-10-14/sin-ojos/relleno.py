#!/usr/bin/env python3
"""
PROPUESTA de base sin ojos (base D-014) y comprobación real del montaje.

En una COPIA de ../base-transparencia-corregida.png (que no se toca), se rellena de piel solo la zona de
los ojos; el resto de la imagen queda idéntico, píxel a píxel (cara, cejas, nariz, boca, pliegue del
párpado y proporciones). No se regenera nada.

  · Zona de relleno: la capa de ojos (máscara v2) y 2 px alrededor, más los restos del dibujo de los ojos
    que la capa no lleva (puntas y trozos de pestañas, trazos oscuros pegados a ella; dentro de la zona
    del pliegue, solo trazos de pestaña) y el borde claro del párpado y del lagrimal pegado al ojo.
    El pliegue del párpado (piel) se deja en la base.
  · Relleno: interpolación armónica (ecuación de Laplace) por canal, tomando como borde solo los píxeles
    de piel que rodean la zona (ignora trazos oscuros y brillos): continúa el color y el degradado de la
    piel de alrededor. Es un relleno liso: no inventa textura ni pecas.

Montaje: A = capa de prueba (máscara v2, ../ojos-abiertos/capa-ojos-abiertos-prueba.png) sobre la base
sin ojos. B (solo referencia) = los mismos colores originales con opacidad completa en toda la zona de
relleno: muestra cuánto falta en A, sin cambiar colores.

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/sin-ojos/relleno.py
Requiere Python 3 con Pillow, NumPy y SciPy (y ../ojos-abiertos/mascara.py).
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
import scipy.sparse as sp
from scipy.sparse.linalg import spsolve

AQUI = Path(__file__).resolve().parent
PROP = AQUI.parent
sys.path.insert(0, str(PROP / 'ojos-abiertos'))
import mascara as MK          # noqa: E402  (máscara v2, centros de los ojos, Lab, fuente)

BASE = PROP / 'base-transparencia-corregida.png'


def zona_relleno(im, m, AB, PL):
    lab = MK.lab_de(im); L = lab[..., 0]; H, W = L.shape; YY, XX = np.mgrid[0:H, 0:W]
    dm = nd.distance_transform_edt(m == 0); dab = nd.distance_transform_edt(~AB)
    croma = np.hypot(lab[..., 1], lab[..., 2])
    gy, gx = np.gradient(nd.gaussian_filter(L, 1.0))
    Jxx, Jyy, Jxy = (nd.gaussian_filter(v, 1.5) for v in (gx * gx, gy * gy, gx * gy))
    Z = np.zeros((H, W), bool); pieles = []
    for cx, cy in MK.OJOS:
        cx, cy = int(cx), int(cy)
        r = np.hypot((XX - cx) / 95, (YY - cy) / 55)
        piel = np.median(lab[(r > 0.95) & (r < 1.05) & (YY > cy)], 0); pieles.append(piel); dL = piel[0] - L
        roi = (np.abs(XX - cx) < 115) & (np.abs(YY - cy) < 70)
        paralelo = np.abs(np.cos(0.5 * np.arctan2(2 * Jxy, Jxx - Jyy) - np.arctan2(YY - cy, (XX - cx) * 0.6))) > 0.85
        z = (m > 0) | (dm <= 2)
        tr = roi & (dL > 35) & (((YY < cy) & (dm <= 20)) | ((YY >= cy) & (dm <= 12))) & (~PL | ((dL > 45) & ~paralelo))
        lbt, _ = nd.label(tr | z, np.ones((3, 3))); ids = np.unique(lbt[z]); ids = ids[ids > 0]
        z |= np.isin(lbt, ids) & tr
        z |= nd.binary_dilation(tr & z, iterations=1) & (dL > 15) & ~PL
        z |= roi & (dab <= 8) & ((L > piel[0] + 5) | (croma < 0.6 * np.hypot(piel[1], piel[2])) | (lab[..., 2] < piel[2] - 8)) & ~PL
        z = nd.binary_closing(z, np.ones((3, 3))) & roi & (~PL | z)
        Z |= z
    return Z, lab, pieles


def rellenar(A, Z, lab, pieles):
    out = A[..., :3].astype(float).copy()
    for (cx, cy), piel in zip(MK.OJOS, pieles):
        cx, cy = int(cx), int(cy)
        y0, y1, x0, x1 = cy - 80, cy + 70, cx - 120, cx + 120
        Hh = Z[y0:y1, x0:x1]; sub = lab[y0:y1, x0:x1]
        fijo = (np.sqrt(((sub - piel) ** 2).sum(-1)) < 28) & (sub[..., 0] > piel[0] - 22) & (sub[..., 0] < piel[0] + 8) & ~Hh
        idx = -np.ones(Hh.shape, int); ys, xs = np.nonzero(Hh); idx[ys, xs] = np.arange(len(ys)); N = len(ys)
        filas, cols, vals = [], [], []; b = np.zeros((N, 3)); cnt = np.zeros(N); reg = out[y0:y1, x0:x1]
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            yy, xx = ys + dy, xs + dx; j = idx[yy, xx]; h = j >= 0
            filas += list(np.flatnonzero(h)); cols += list(j[h]); vals += [-1.0] * int(h.sum()); cnt[h] += 1
            f = (~h) & fijo[yy, xx]; b[f] += reg[yy[f], xx[f]]; cnt[f] += 1
        cnt[cnt == 0] = 1
        Am = sp.csc_matrix((vals + list(cnt), (filas + list(range(N)), cols + list(range(N)))), shape=(N, N))
        for c in range(3):
            reg[ys, xs, c] = spsolve(Am, b[:, c])
        out[y0:y1, x0:x1] = reg
    sin = A.copy(); sin[..., :3] = np.clip(np.round(out), 0, 255).astype(np.uint8)
    return sin


def componer(capa, fondo):
    al = capa[..., 3:].astype(float) / 255; r = fondo.astype(float).copy()
    r[..., :3] = capa[..., :3] * al + fondo[..., :3] * (1 - al)
    return np.clip(np.round(r), 0, 255).astype(np.uint8)


def blanco(x):
    i = Image.fromarray(x, 'RGBA'); bg = Image.new('RGBA', i.size, (255, 255, 255, 255)); bg.alpha_composite(i)
    return bg.convert('RGB')


def vistas(A, sin, recA, recB, Z):
    paneles = [('Original', A), ('Base sin ojos (propuesta)', sin), ('Montaje A: capa v2', recA), ('Montaje B: referencia', recB)]
    # tamaño de juego
    caja = (150, 160, 810, 1550); bloques = []
    for alto in (480, 220):
        ims = [blanco(x).crop(caja) for _, x in paneles]; ims = [p.resize((round(p.width * alto / p.height), alto), Image.LANCZOS) for p in ims]
        Wb = max(sum(p.width + 12 for p in ims), 560); blo = Image.new('RGB', (Wb, alto + 56), 'white'); d = ImageDraw.Draw(blo); x = 0
        d.text((2, 2), f'Muñeca de {alto} px de alto (aprox. {"«Vestir» en iPhone" if alto > 300 else "«Mi Mundo»"})', font=MK.F(16), fill=(40, 40, 60))
        for (t, _), p in zip(paneles, ims):
            corto = {'Base sin ojos (propuesta)': 'Sin ojos', 'Montaje A: capa v2': 'Montaje A', 'Montaje B: referencia': 'Montaje B'}.get(t, t) if alto < 300 else t
            blo.paste(p, (x, 52)); d.text((x + 2, 28), corto, font=MK.F(13 if alto < 300 else 15), fill=(90, 80, 110)); x += p.width + 12
        bloques.append(blo)
    hoja = Image.new('RGB', (max(b.width for b in bloques), sum(b.height + 10 for b in bloques)), 'white'); y = 0
    for b in bloques:
        hoja.paste(b, (0, y)); y += b.height + 10
    hoja.save(AQUI / 'vista-tamano-juego.png', optimize=True)
    # cara ×3 y diferencias
    box = (290, 370, 670, 500); z = 3
    dif = np.abs(recA[..., :3].astype(int) - A[..., :3].astype(int)).max(-1)
    mapa = np.zeros(A.shape[:2] + (3,), np.uint8); mapa[...] = (255, 255, 255)
    mapa[dif > 0] = (255, 200, 120); mapa[dif > 8] = (255, 120, 0); mapa[dif > 24] = (200, 0, 60)
    borde = Z ^ nd.binary_erosion(Z); zona = np.array(blanco(A)).copy(); zona[borde] = (0, 160, 255)
    filas = [(t, blanco(x)) for t, x in paneles] + [('Zona rellenada (contorno azul)', Image.fromarray(zona)),
                                                     ('Diferencias del montaje A (naranja > 8, rojo > 24)', Image.fromarray(mapa))]
    trozos = [p.crop(box).resize(((box[2] - box[0]) * z, (box[3] - box[1]) * z), Image.NEAREST) for _, p in filas]
    Wt = trozos[0].width; Ht = trozos[0].height
    hoja = Image.new('RGB', (Wt * 2 + 10, (Ht + 34) * 3), 'white'); d = ImageDraw.Draw(hoja)
    for i, ((t, _), p) in enumerate(zip(filas, trozos)):
        x, y = (i % 2) * (Wt + 10), (i // 2) * (Ht + 34)
        d.text((x + 4, y + 6), t, font=MK.F(20), fill=(40, 40, 60)); hoja.paste(p, (x, y + 30))
    hoja.save(AQUI / 'vista-ampliada.png', optimize=True)


if __name__ == '__main__':
    im = Image.open(BASE).convert('RGBA'); A = np.array(im)
    m, AB, _ = MK.mascara(im); PL = MK.mascara.pliegue
    assert (m == np.array(Image.open(PROP / 'ojos-abiertos' / 'mascara-ojos-propuesta-v2.png'))).all(), 'la máscara v2 no coincide'
    Z, lab, pieles = zona_relleno(im, m, AB, PL)
    sin = rellenar(A, Z, lab, pieles)
    capaA = np.array(Image.open(PROP / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba.png'))
    capaB = A.copy(); capaB[..., 3] = np.where(Z, 255, 0).astype(np.uint8); capaB[~Z] = 0
    recA, recB = componer(capaA, sin), componer(capaB, sin)
    Image.fromarray(sin, 'RGBA').save(AQUI / 'base-sin-ojos-propuesta.png', optimize=True)
    Image.fromarray((Z * 255).astype(np.uint8), 'L').save(AQUI / 'zona-relleno.png', optimize=True)
    Image.fromarray(capaB, 'RGBA').save(AQUI / 'capa-referencia-B.png', optimize=True)
    vistas(A, sin, recA, recB, Z)
    cambiado = (sin != A).any(-1)
    def err(r):
        d = np.abs(r[..., :3].astype(int) - A[..., :3].astype(int)).max(-1)
        return dict(pixeles_distintos=int((d > 0).sum()), mas_de_8=int((d > 8).sum()), mas_de_24=int((d > 24).sum()), maximo=int(d.max()))
    comp = dict(tamaño=[A.shape[1], A.shape[0]], zona_relleno_px=int(Z.sum()), pixeles_cambiados_en_la_base=int(cambiado.sum()),
                cambiados_fuera_de_la_zona=int((cambiado & ~Z).sum()), caja_de_cambios=list(Image.fromarray(cambiado.astype(np.uint8) * 255).getbbox()),
                montaje_A_capa_v2=err(recA), montaje_B_referencia=err(recB),
                sha256_base_sin_ojos=hashlib.sha256((AQUI / 'base-sin-ojos-propuesta.png').read_bytes()).hexdigest())
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
