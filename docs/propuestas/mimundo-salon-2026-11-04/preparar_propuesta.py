#!/usr/bin/env python3
"""
Mi Mundo · salón (D-034): propuesta de distribución a escala. Solo maquetas para decidir y para generar las ilustraciones:
las zonas de colores NO son dibujos del juego.

Usa la misma cámara que la habitación aprobada (lienzo 1536 × 1024, suelo desde y ≈ 560, la muñeca de 1,10 m mide
250 px con los pies al fondo y 420 delante): así la muñeca, el osito y la cesta ya aprobados sirven igual en el salón.
Escribe en esta carpeta:
  · distribucion-salon.png  el salón con cada pieza en su sitio (zonas numeradas a su tamaño real) y, de verdad, la muñeca
                            guardada, el osito y la cesta aprobados; con la leyenda de piezas;
  · merienda-en-la-mesa.png la mesa vista de cerca con los sitios de la merienda para tres (3 platos, 3 tazas, tetera y
                            galletas) y dónde se sientan los invitados;
  · plantilla-salon.png     plantilla para generar el fondo y los muebles: perspectiva del suelo, siluetas de la muñeca a
                            tres distancias y las zonas, sin texto.
Uso (desde la raíz): python3 docs/propuestas/mimundo-salon-2026-11-04/preparar_propuesta.py
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
MM = P / 'prueba-mimundo-2026-11-04' / 'mimundo' / 'arte'
W, H = 1536, 1024
alto = lambda y: 250 + (y - 560) * 170 / 430          # alto de la muñeca (1,10 m) con los pies en y
pxm = lambda y: alto(y) / 1.10                        # píxeles por metro en esa profundidad
F = lambda n, b=True: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans' + ('-Bold' if b else '') + '.ttf', n)
# n, nombre, (x centro, y base), (ancho, alto) en metros, color, tipo
PIEZAS = [
    (1, 'Fondo del salón (vacío)', None, None, None, 'fondo'),
    (2, 'Sofá de tres plazas', (520, 640), (1.90, 0.85), '#f3c6d6', 'se mueve'),
    (3, 'Estantería baja con libros y juguetes', (1290, 615), (0.95, 1.00), '#e8cfa8', 'se mueve'),
    (4, 'Lámpara de pie', (150, 640), (0.40, 1.50), '#fff0b8', 'se mueve'),
    (5, 'Alfombra redonda', (830, 930), (2.00, 0.30), '#cdeedd', 'se mueve (plana)'),
    (6, 'Mesa baja redonda (merienda)', (830, 880), (0.80, 0.45), '#e9d7bd', 'se mueve; lleva cosas encima'),
    (7, 'Cojín de suelo rosa', (590, 925), (0.48, 0.22), '#ffc2dc', 'se mueve; asiento de invitado'),
    (8, 'Cojín de suelo lila', (1075, 925), (0.48, 0.22), '#dccbff', 'se mueve; asiento de invitado'),
    (9, 'Cojín de sofá (dos)', (410, 560), (0.40, 0.35), '#ffe0a6', 'se pone en el sofá'),
    (10, 'Platos (3)', None, (0.20, 0.05), '#ffffff', 'merienda, sobre la mesa'),
    (11, 'Tazas con platillo (3)', None, (0.12, 0.09), '#ffffff', 'merienda, sobre la mesa'),
    (12, 'Tetera', None, (0.22, 0.20), '#ffffff', 'merienda, sobre la mesa'),
    (13, 'Plato de galletas', None, (0.22, 0.07), '#ffffff', 'merienda, sobre la mesa'),
    (14, 'Conejito de peluche (invitado)', None, (0.26, 0.34), '#ffffff', 'se mueve; se sienta en un cojín'),
]


def muneca(dormida=False):
    ov = json.loads((P / 'prueba-completa-2026-10-22' / 'capas-del-visor.json').read_text(encoding='utf-8'))
    im = Image.new('RGBA', (948, 1659))
    for c in ov['combos']['vestido|rizos|clara|castano']:
        im.alpha_composite(Image.open(RAIZ / c.split('=', 1)[1]).convert('RGBA'))
    return im.crop((0, 20, 948, 1590))                 # pies en y = 1542 del recorte


def pegar_muneca(f, m, x, pies):
    k = alto(pies) / 1500; mm = m.resize((round(m.width * k), round(m.height * k)), Image.LANCZOS)
    f.alpha_composite(mm, (round(x - 479 * k), round(pies - 1542 * k)))


def pegar_objeto(f, nombre, x, base, alto_m):
    med = json.loads((MM / 'medidas.js').read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))[nombre]
    im = Image.open(MM / med['f']).convert('RGBA'); k = alto_m * pxm(base) / med['px'][1]
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    f.alpha_composite(im, (round(x - med['base'][0] * k), round(base - med['base'][1] * k)))


def fondo():
    f = Image.new('RGBA', (W, H), '#f2ede2'); d = ImageDraw.Draw(f)
    d.rectangle((0, 520, W, 560), fill='#e8dccb'); d.rectangle((0, 560, W, H), fill='#e6c49c')
    for y in range(590, H, 48):
        d.line((0, y, W, y), fill='#d9b48a', width=2)
    d.rounded_rectangle((640, 90, 1000, 470), 18, outline='#c9b6e8', width=6)          # ventana (en el fondo)
    return f


def zona(d, n, nombre, xy, tam, col, y_sobre=None):
    x, base = xy; w, h = tam[0] * pxm(base), tam[1] * pxm(base)
    caja = (x - w / 2, base - h, x + w / 2, base)
    d.rounded_rectangle(caja, 18, fill=col + 'cc', outline='#7a5fb0', width=4)
    d.ellipse((caja[0] + 8, caja[1] + 8, caja[0] + 48, caja[1] + 48), fill='#7a5fb0')
    d.text((caja[0] + 28, caja[1] + 28), str(n), font=F(24), fill='white', anchor='mm')
    return caja


def distribucion():
    f = fondo(); d = ImageDraw.Draw(f, 'RGBA'); m = muneca()
    for n, nom, xy, tam, col, tipo in PIEZAS:
        if xy and n not in (6, 7, 8):
            zona(d, n, nom, xy, tam, col)
    # el osito (aprobado) en el sofá y la cesta (aprobada) junto a la estantería, como referencia de escala
    pegar_objeto(f, 'cesta', 1400, 720, 0.40)
    pegar_muneca(f, m, 990, 815)
    d = ImageDraw.Draw(f, 'RGBA')
    for n, nom, xy, tam, col, tipo in PIEZAS:
        if n in (6, 7, 8):
            zona(d, n, nom, xy, tam, col)
    pegar_objeto(f, 'osito', 590, 912, 0.34)           # invitado sentado en el cojín rosa
    d = ImageDraw.Draw(f, 'RGBA'); x, b = 1075, 925; w, h = .26 * pxm(b), .34 * pxm(b)
    d.rounded_rectangle((x - w / 2, b - 12 - h, x + w / 2, b - 12), 14, fill='#ffffffcc', outline='#7a5fb0', width=3)
    d.text((x, b - 12 - h / 2), '14', font=F(24), fill='#7a5fb0', anchor='mm')
    L = Image.new('RGBA', (W, 560), 'white'); dl = ImageDraw.Draw(L)
    dl.text((30, 20), 'Salón · distribución a escala (la muñeca guardada, el osito y la cesta aprobados, de verdad)', font=F(28), fill='#4a3a5c')
    for i, (n, nom, xy, tam, col, tipo) in enumerate(PIEZAS):
        x, y = 30 + (i // 7) * 760, 80 + (i % 7) * 66
        dl.ellipse((x, y, x + 36, y + 36), fill='#7a5fb0'); dl.text((x + 18, y + 18), str(n), font=F(18), fill='white', anchor='mm')
        dl.text((x + 50, y), nom, font=F(21), fill='#333')
        dl.text((x + 50, y + 28), (f'{tam[0]:.2f} × {tam[1]:.2f} m · ' if tam else '') + tipo, font=F(17, False), fill='#666')
    o = Image.new('RGBA', (W, H + 560), 'white'); o.alpha_composite(f); o.alpha_composite(L, (0, H))
    o.convert('RGB').save(AQUI / 'distribucion-salon.png', optimize=True)


def merienda():
    # la mesa de cerca: tablero (elipse) con los sitios de la merienda
    f = fondo().crop((480, 640, 1180, 1010)).resize((1400, 740)); d = ImageDraw.Draw(f, 'RGBA'); s = 2
    cx, cy, rx, ry = 700, 300, 270, 105                 # tablero visto desde arriba (sobre la mesa de 0,80 m)
    d.rectangle((cx - 230, cy, cx + 230, cy + 300), fill='#d8c3a5', outline='#a88b68', width=4)
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill='#efdcc1', outline='#a88b68', width=5)
    sitios = [('plato', -170, 25), ('plato', 0, 70), ('plato', 170, 25), ('taza', -150, -45), ('taza', 60, 30), ('taza', 175, -40),
              ('tetera', -20, -40), ('galletas', 90, -60)]
    for i, (q, dx, dy) in enumerate(sitios):
        w = 92 if q == 'plato' else 58 if q == 'taza' else 84
        d.ellipse((cx + dx - w / 2, cy + dy - w / 4, cx + dx + w / 2, cy + dy + w / 4), fill='#ffffffdd', outline='#7a5fb0', width=3)
        d.text((cx + dx, cy + dy), {'plato': '10', 'taza': '11', 'tetera': '12', 'galletas': '13'}[q], font=F(20), fill='#7a5fb0', anchor='mm')
    for x, t in ((230, 'osito: cojín rosa (7)'), (1170, 'conejito: cojín lila (8)')):
        d.ellipse((x - 150, 560, x + 150, 640), fill='#ffffffaa', outline='#7a5fb0', width=3); d.text((x, 600), t, font=F(19), fill='#4a3a5c', anchor='mm')
    d.text((cx, 690), 'La muñeca, de pie al otro lado de la mesa (sirve la merienda)', font=F(22), fill='#4a3a5c', anchor='mm')
    d.text((20, 16), 'Merienda para tres: 3 platos (10), 3 tazas (11), tetera (12) y galletas (13) sobre la mesa;', font=F(22), fill='#4a3a5c')
    d.text((20, 48), 'dos invitados en los cojines y la muñeca, de pie, sirviendo', font=F(22), fill='#4a3a5c')
    f.convert('RGB').save(AQUI / 'merienda-en-la-mesa.png', optimize=True)


def plantilla():
    f = Image.new('RGBA', (W, H), (253, 250, 245, 255)); d = ImageDraw.Draw(f, 'RGBA')
    d.line((0, 560, W, 560), fill='#b9a6d8', width=4)
    for x in range(-1600, 3200, 160):                  # líneas del suelo hacia el punto de fuga (centro de la ventana)
        d.line((768 + (x - 768) * 0.08, 560, x, H), fill='#e3d9f2', width=2)
    for n, nom, xy, tam, col, tipo in PIEZAS:
        if xy:
            x, base = xy; w, h = tam[0] * pxm(base), tam[1] * pxm(base)
            d.rounded_rectangle((x - w / 2, base - h, x + w / 2, base), 18, outline='#7a5fb0', width=3); d.text((x - w / 2 + 10, base - h + 6), str(n), font=F(24), fill='#7a5fb0')
    sil = muneca().getchannel('A').point(lambda a: 110 if a > 128 else 0); gris = Image.new('RGBA', sil.size, (90, 70, 120, 255)); gris.putalpha(sil)
    for x, pies in ((300, 600), (990, 815), (760, 1000)):
        pegar_muneca(f, gris, x, pies)
    f.convert('RGB').save(AQUI / 'plantilla-salon.png', optimize=True)


if __name__ == '__main__':
    distribucion(); merienda(); plantilla()
    print('distribucion-salon.png, merienda-en-la-mesa.png, plantilla-salon.png')
