#!/usr/bin/env python3
"""
Mi Mundo de Juegos · Plantillas para dibujar el pelo

Crea en plantilla/guias/ dos láminas de 2000 × 3500 con fondo transparente,
para usarlas como capa de referencia encima del dibujo (Procreate, Photoshop…):

  plantilla-pelo-detras.png   capa de pelo que va DETRÁS de la muñeca
  plantilla-pelo-delante.png  capa de pelo que va DELANTE (flequillo y mechones)
  plantillas-pelo-resumen.png las dos juntas, para tenerlas a la vista

Las zonas salen de la base aprobada, de los ojos aprobados y de plantilla.js:
  · zona prohibida: ojos y pestañas (+ margen), nariz y boca
  · zona que el pelo debe tapar: parte alta de la cabeza
  · franja recomendada del nacimiento del pelo
  · franja recomendada para las puntas
  · contorno de orejas, hombros y brazos (sin dibujar piel en las capas de pelo)

  python3 herramientas/guias_pelo.py
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parent))
from guias import plantilla, fuente, etiqueta, rayas, recorta_a  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / 'arte' / 'originales'
DEST = RAIZ / 'plantilla' / 'guias'
W, H = 2000, 3500
MARGEN_OJOS = 30


def rayado(mask, color, paso=30, ancho=6):
    capa = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    rayas(ImageDraw.Draw(capa), (0, 0, W, H), color, paso, ancho)
    return recorta_a(capa, mask)


def relleno(mask, color):
    capa = np.zeros((H, W, 4), np.uint8)
    capa[mask] = color
    return Image.fromarray(capa, 'RGBA')


def contorno(mask, color, grosor=6):
    borde = mask & ~ndimage.binary_erosion(mask, iterations=grosor)
    return relleno(borde, color)


def franja(d, y0, y1, x0, x1, color, texto='', n=36):
    for y in (y0, y1):
        for x in range(x0, x1, 40):
            d.line((x, y, x + 22, y), fill=color, width=5)
    if texto:
        etiqueta(d, (x1 + 14, (y0 + y1) // 2), texto, color, n, 'lm')


def main():
    P = plantilla()
    A = P['anclas']
    base = Image.open(ORIG / 'base-clara.png').convert('RGBA')
    ojos = Image.open(ORIG / 'ojos-marron.png').convert('RGBA')
    mb = np.array(base)[:, :, 3] > 128
    mo = np.array(ojos)[:, :, 3] > 40
    yy, xx = np.indices((H, W))

    # Partes del cuerpo a partir de la base
    filas = np.flatnonzero(mb.any(1))
    cor, barb = A['coronilla'][1], A['barbilla'][1]
    cabeza = mb & (yy <= barb)
    cejas_y = A['ojos'] - 215                                    # cejas de la base ≈ 830–950
    tapar = cabeza & (yy < cejas_y - 300)                         # parte alta del cráneo (hasta la franja del nacimiento)
    ojos_prot = ndimage.binary_dilation(mo, iterations=MARGEN_OJOS)
    nariz_boca = cabeza & (np.hypot((xx - A['eje']) / 170, (yy - (A['boca'][1] - 60)) / 150) <= 1)
    orejas = cabeza & ((xx < A['eje'] - 440) | (xx > A['eje'] + 440)) & (yy > A['ojos'] - 120)
    orejas_amplias = ndimage.binary_dilation(orejas, iterations=40)
    # Brazos: en cada fila, los tramos de la base que no son el torso (el tramo que contiene el eje)
    brazos = np.zeros_like(mb)
    for y in range(A['hombroIzq'][1] + 60, A['manoIzq'][1] + 20):
        x = np.flatnonzero(mb[y])
        if not len(x):
            continue
        cortes = np.flatnonzero(np.diff(x) > 1)
        for a, b in zip(np.r_[x[0], x[cortes + 1]], np.r_[x[cortes], x[-1]]):
            if not (a <= A['eje'] <= b) and (y < A['cadera'] or abs((a + b) / 2 - A['eje']) > 300):   # ni torso ni muslos
                brazos[y, a:b + 1] = True
    brazos = ndimage.binary_opening(brazos, iterations=2)
    banda_dentro = cabeza & ~ndimage.binary_erosion(cabeza, iterations=80) & (yy < A['ojos'] - 60) & ~orejas_amplias

    ROJO, MARRON, NARANJA, AZUL, VERDE, LILA = (226, 34, 68, 255), (150, 90, 40, 255), (230, 120, 40, 255), (40, 120, 220, 255), (40, 160, 100, 255), (120, 80, 200, 255)

    def fondo():
        b = np.array(base).astype(float)
        b[:, :, 3] *= .35
        g = Image.fromarray(b.astype(np.uint8), 'RGBA')
        o = np.array(ojos).astype(float); o[:, :, 3] *= .35
        g.alpha_composite(Image.fromarray(o.astype(np.uint8), 'RGBA'))
        return g

    # ---------------- pelo de DETRÁS ----------------
    g = fondo(); d = ImageDraw.Draw(g)
    z = P['zonas']['pelo-detras']['r']
    d.rectangle(z, outline=MARRON, width=8)
    etiqueta(d, (z[0] + 20, z[1] + 20), f'Pelo detrás: zona x {z[0]}–{z[2]}, y {z[1]}–{z[3]}', MARRON, 38)
    g.alpha_composite(rayado(banda_dentro, (150, 90, 40, 170)))
    g.alpha_composite(contorno(cabeza, MARRON, 5))
    etiqueta(d, (A['eje'], cor - 90), 'Rayado: rellenar también por dentro de la cabeza (80 px)', MARRON, 38, 'ma')
    franja(d, 2000, 2350, z[0] + 40, z[2] - 40, VERDE, '', 34)
    etiqueta(d, (A['eje'], 2420), 'Entre las líneas verdes: las puntas terminan aquí, irregulares (nunca en línea recta)', VERDE, 30, 'ma')
    g.alpha_composite(contorno(brazos, AZUL, 5))
    etiqueta(d, (A['eje'], A['cadera'] + 160), 'Sin piel, sin ropa y sin restos de otra figura', ROJO, 38, 'ma')
    etiqueta(d, (A['eje'], A['cadera'] + 230), 'Lienzo completo 2000 × 3500 · opacidad 100 % · PNG transparente', LILA, 34, 'ma')
    detras = g

    # ---------------- pelo de DELANTE ----------------
    g = fondo(); d = ImageDraw.Draw(g)
    z = P['zonas']['pelo-delante']['r']
    d.rectangle(z, outline=NARANJA, width=8)
    etiqueta(d, (z[0] + 20, z[1] + 20), f'Pelo delante: zona x {z[0]}–{z[2]}, y {z[1]}–{z[3]}', NARANJA, 38)
    g.alpha_composite(rayado(tapar, (150, 90, 40, 170)))
    etiqueta(d, (A['eje'], cor - 90), 'Rayado: el pelo DEBE tapar la cabeza', MARRON, 40, 'ma')
    # nacimiento del pelo
    y_nac0, y_nac1 = cejas_y - 300, cejas_y - 140
    cx = A['eje']
    franja(d, y_nac0, y_nac1, cx - 330, cx + 330, MARRON, '', 32)
    etiqueta(d, (cx, y_nac1 + 50), 'Entre las líneas: nacimiento del pelo, suave (20–40 px)', MARRON, 30, 'ma')
    # zonas prohibidas
    g.alpha_composite(relleno(ojos_prot & ~mo, (226, 34, 68, 120)))
    g.alpha_composite(contorno(ojos_prot, ROJO, 6))
    g.alpha_composite(relleno(nariz_boca, (226, 34, 68, 70)))
    etiqueta(d, (A['eje'], A['ojos'] + 200), f'PROHIBIDO: ojos y pestañas (+{MARGEN_OJOS} px), nariz y boca', ROJO, 36, 'ma')
    g.alpha_composite(contorno(orejas, NARANJA, 5))
    etiqueta(d, (A['eje'], A['ojos'] + 270), 'Orejas (naranja): pueden quedar tapadas, pero sin dibujar orejas', NARANJA, 30, 'ma')
    g.alpha_composite(contorno(brazos, AZUL, 5))
    etiqueta(d, (A['eje'], A['hombroIzq'][1] - 70), 'Mechones sobre hombros y brazos: acabar en puntas, nunca cortados por el contorno', AZUL, 30, 'ma')
    etiqueta(d, (A['eje'], A['cadera'] + 160), 'Sin piel ni restos de otra figura · opacidad 100 %', ROJO, 38, 'ma')
    delante = g

    DEST.mkdir(parents=True, exist_ok=True)
    for n, im in (('plantilla-pelo-detras.png', detras), ('plantilla-pelo-delante.png', delante)):
        im.save(DEST / n, optimize=True)
        print('  plantilla/guias/' + n)
    t = 640
    res = Image.new('RGB', (t * 2 + 60, int(t * H / W) + 90), (255, 248, 252))
    dr = ImageDraw.Draw(res)
    for i, (n, im) in enumerate((('Pelo detrás', detras), ('Pelo delante', delante))):
        f_ = Image.new('RGBA', im.size, (255, 255, 255, 255)); f_.alpha_composite(im)
        res.paste(f_.convert('RGB').resize((t, int(t * H / W)), Image.LANCZOS), (20 + i * (t + 20), 70))
        dr.text((20 + i * (t + 20), 18), n, font=fuente(40), fill=(74, 58, 92))
    res.save(DEST / 'plantillas-pelo-resumen.png', optimize=True)
    print('  plantilla/guias/plantillas-pelo-resumen.png')


if __name__ == '__main__':
    main()
