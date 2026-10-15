#!/usr/bin/env python3
"""
Máscara PROPUESTA de los ojos abiertos y sus pestañas (base D-014, copia técnica, 948 × 1659).

Solo calcula una máscara (gris, 0 = fuera, 255 = dentro, valores intermedios en los bordes suaves
de las pestañas). NO extrae ni borra nada: la base no cambia, y los píxeles y la posición de los
ojos tampoco. La extracción se hará después, si la propietaria aprueba esta máscara.

Qué entra en la máscara (para cada ojo, alrededor del centro del iris medido en ../medidas/):
  (a) la abertura del ojo: envolvente convexa del blanco del ojo y del iris (incluye lagrimal,
      brillos y la sombra del párpado sobre el blanco);
  (b) la línea del párpado y las pestañas de arriba y de abajo: trazos muy oscuros (dL > 60
      respecto a la piel de alrededor) pegados a la abertura, que crecen como mucho 6 px por los
      píxeles algo oscuros (dL > 36) para recoger las puntas;
  (c) bordes suaves de las pestañas según su oscuridad.
Qué queda fuera: la piel, las cejas y el pliegue del párpado (arco medio oscuro por encima del lado
del lagrimal; es piel, no pestaña).

Uso (desde la raíz del repositorio):
  python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-abiertos/mascara.py
    → mascara-ojos-propuesta.png, vista-mascara-sobre-base.png y vista-mascara-ampliada.png

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
CRECER, PERMITIR, SEMILLA = 6, 36, 60


def lab_de(im):
    t = ImageCms.buildTransform(ImageCms.createProfile('sRGB'), ImageCms.createProfile('LAB'), 'RGB', 'LAB')
    lab = np.array(ImageCms.applyTransform(im.convert('RGB'), t)).astype(float)
    lab[..., 1:] = np.where(lab[..., 1:] > 127, lab[..., 1:] - 256, lab[..., 1:])   # a y b con signo
    return lab


def mascara(im):
    lab = lab_de(im)
    M = np.zeros(lab.shape[:2])
    for cx, cy in OJOS:
        cx, cy = int(cx), int(cy)
        x0, x1, y0, y1 = cx - 100, cx + 100, cy - 60, cy + 50
        sub = lab[y0:y1, x0:x1]; L = sub[..., 0]
        yy, xx = np.mgrid[y0:y1, x0:x1]
        r = np.hypot((xx - cx) / 95, (yy - cy) / 55)
        piel = np.median(sub[(r > 0.95) & (r < 1.05) & (yy > cy)], 0)      # piel bajo el ojo
        d = np.sqrt(((sub - piel) ** 2).sum(-1)); dL = piel[0] - L; croma = np.hypot(sub[..., 1], sub[..., 2])
        # (a) abertura
        blanco = (L > 150) & (croma < 14)
        iris = (np.hypot(xx - cx, yy - cy) <= 33) & (d > 40)
        partes = nd.binary_opening(blanco | iris, np.ones((3, 3))); lb, n = nd.label(partes)
        juntas = np.zeros_like(partes)
        for i in range(1, n + 1):
            c = lb == i
            if c.sum() >= 30 and np.hypot(xx[c].mean() - cx, yy[c].mean() - cy) < 75:
                juntas |= c
        ys, xs = np.nonzero(juntas); h = ConvexHull(np.c_[xs, ys])
        lienzo = Image.new('L', (x1 - x0, y1 - y0), 0)
        ImageDraw.Draw(lienzo).polygon([(float(xs[i]), float(ys[i])) for i in h.vertices], fill=255, outline=255)
        ab = np.array(lienzo) > 0
        # (b) párpado y pestañas
        lb2, _ = nd.label(dL > SEMILLA, np.ones((3, 3)))
        ids = np.unique(lb2[(dL > SEMILLA) & nd.binary_dilation(ab, iterations=6)]); ids = ids[ids > 0]
        semilla = np.isin(lb2, ids)
        pest = semilla.copy()
        for _ in range(CRECER):
            pest = nd.binary_dilation(pest, np.ones((3, 3))) & (dL > PERMITIR)
        pest &= ~ab
        # pliegue del párpado (fuera): lado nasal, hasta 20 px bajo el centro, fuera de la abertura,
        # no negro (L ≥ 60) y a más de 2 px de los trazos negros de las pestañas (L < 40)
        s = 1 if cx < EJE else -1
        pliegue = ((xx - cx) * s > 5) & (yy < cy + 20) & ~nd.binary_dilation(ab, iterations=1) & \
                  (L >= 60) & ~nd.binary_dilation(L < 40, iterations=2)
        pest &= ~pliegue; semilla &= ~pliegue
        solido = nd.binary_fill_holes(ab | pest)                          # sin huecos entre blanco y párpado
        # (c) valores
        mate = np.clip((dL - 12) / (SEMILLA - 12), 0, 1)
        m = np.zeros(d.shape)
        m[pest] = np.maximum(mate[pest], 0.35); m[semilla & ~ab] = 1; m[solido & ~ab & ~pest] = 1
        suave = nd.binary_dilation(pest, np.ones((3, 3))) & ~solido & ~pliegue
        m[suave] = np.maximum(m[suave], mate[suave])
        borde = nd.binary_dilation(ab, iterations=1) & ~solido
        m[borde] = np.maximum(m[borde], np.clip((d[borde] - 10) / 30, 0, 1)); m[ab] = 1
        M[y0:y1, x0:x1] = np.maximum(M[y0:y1, x0:x1], m)
    return (M * 255).round().astype(np.uint8)


def vistas(im, m):
    F = lambda t: ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', t)
    fondo = Image.new('RGBA', im.size, (255, 255, 255, 255)); fondo.alpha_composite(im)
    a = np.array(fondo.convert('RGB')).astype(float); mm = m.astype(float)[..., None] / 255
    borde = (m > 127) ^ nd.binary_erosion(m > 127, iterations=1)
    # vista general: la máscara en magenta translúcido + contorno verde
    t = a * (1 - 0.45 * mm) + np.array([255, 0, 200]) * 0.45 * mm; t[borde] = (0, 200, 80)
    Image.fromarray(t.astype(np.uint8)).save(AQUI / 'vista-mascara-sobre-base.png', optimize=True)
    # ampliación ×4 de cada ojo: base · contorno · lo que se extraería (vista previa sobre claro y oscuro)
    z = 4; filas = []
    for cx, cy in OJOS:
        x0, y0 = (int(cx) - 96 if cx < EJE else int(cx) - 64), int(cy) - 58      # simétrico: pestañas exteriores incluidas
        caja = (slice(y0, y0 + 100), slice(x0, x0 + 160))
        A = a[caja]; Mm = mm[caja]; B = borde[caja]
        o = A.copy(); o[B] = (0, 200, 80)
        claro = A * Mm + np.array([255, 246, 251]) * (1 - Mm); oscuro = A * Mm + np.array([45, 40, 70]) * (1 - Mm)
        k = lambda x: np.kron(x, np.ones((z, z, 1)))
        sep = np.full((100 * z, 8, 3), 255.0)
        filas.append(np.concatenate([k(A), sep, k(o), sep, k(claro), sep, k(oscuro)], 1))
    hoja = np.concatenate([filas[0], np.full((8, filas[0].shape[1], 3), 255.0), filas[1]], 0)
    cab = np.full((34, hoja.shape[1], 3), 255.0); hoja = np.concatenate([cab, hoja], 0)
    img = Image.fromarray(hoja.astype(np.uint8)); d = ImageDraw.Draw(img); w = 160 * z + 8
    for i, txt in enumerate(['Base', 'Máscara propuesta (contorno)', 'Vista previa · fondo claro', 'Vista previa · fondo oscuro']):
        d.text((6 + i * w, 8), txt, font=F(20), fill=(40, 40, 60))
    img.save(AQUI / 'vista-mascara-ampliada.png', optimize=True)


if __name__ == '__main__':
    im = Image.open(BASE).convert('RGBA')
    m = mascara(im)
    Image.fromarray(m, 'L').save(AQUI / 'mascara-ojos-propuesta.png', optimize=True)
    vistas(im, m)
    ys, xs = np.nonzero(m)
    print(f'máscara {m.shape[1]} × {m.shape[0]}: {int((m > 0).sum())} píxeles (opacos {int((m == 255).sum())}, '
          f'bordes suaves {int(((m > 0) & (m < 255)).sum())}); caja x {xs.min()}–{xs.max()}, y {ys.min()}–{ys.max()}')
