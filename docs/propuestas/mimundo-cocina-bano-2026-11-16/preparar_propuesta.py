#!/usr/bin/env python3
"""
Mi Mundo · cocina y baño (D-037, 2.ª entrega): propuesta de distribución a escala. Solo maquetas para decidir y para
generar las ilustraciones: las zonas de colores NO son dibujos del juego.

Misma cámara que el salón aprobado (lienzo 1536 × 1024, suelo desde y ≈ 520; la muñeca de 1,10 m mide 250 px con los pies
en y = 520): así la muñeca y las piezas aprobadas (mesa, platos, tazas, tetera, galletas, cojines, cesta, osito) sirven
igual. Las piezas reutilizadas se pegan DE VERDAD (su ilustración, a su escala); las nuevas, como zonas numeradas.
Escribe en esta carpeta:
  · distribucion-cocina.png, distribucion-bano.png  cada espacio con sus piezas y la leyenda;
  · plantilla-cocina.png, plantilla-bano.png       plantillas para generar el fondo y los muebles: perspectiva del suelo,
                                                   siluetas de la muñeca a tres distancias y las zonas, sin texto.
Uso (desde la raíz): python3 docs/propuestas/mimundo-cocina-bano-2026-11-16/preparar_propuesta.py
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
ARTE = P / 'prueba-salon-2026-11-07' / 'mimundo' / 'arte'
MED = json.loads((ARTE / 'medidas.js').read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))
W, H, SUELO = 1536, 1024, 520
alto = lambda y: 250 + (y - SUELO) * 170 / 430          # alto de la muñeca (1,10 m) con los pies en y (cámara del salón)
pxm = lambda y: alto(y) / 1.10
F = lambda n, b=True: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans' + ('-Bold' if b else '') + '.ttf', n)
MORADO = '#7a5fb0'

# (n, nombre, (x, base) o None, (ancho, alto) m o None, color, nota). Las «R» son piezas aprobadas que se reutilizan.
COCINA = [
    (1, 'Fondo de la cocina (vacío)', None, None, None, 'misma ventana en el centro (día y noche)'),
    (2, 'Encimera con fregadero y armarios', (330, 600), (2.00, 0.95), '#cfe8f3', 'se mueve; lugar de la fruta'),
    (3, 'Cocinita: fogones y horno', (700, 600), (0.65, 0.95), '#f6d7c4', 'se mueve; cocinar (más adelante)'),
    (4, 'Nevera (cerrada y abierta)', (1270, 610), (0.70, 1.55), '#e3f0ff', 'tocarla: se abre y se ve la comida'),
    (5, 'Frutero con fruta', None, (0.30, 0.18), '#ffe9a8', 'sobre la encimera'),
    (6, 'Plato con fruta (entero · a medias · terminado)', None, (0.22, 0.08), '#ffffff', 'comida; va a la mesa'),
    (7, 'Plato con bocadillo (3 estados)', None, (0.22, 0.10), '#ffffff', 'comida; va a la mesa'),
    (8, 'Cuenco de cereales (3 estados)', None, (0.16, 0.09), '#ffffff', 'comida; va a la mesa'),
    (9, 'Vaso de leche (lleno · a medias · vacío)', None, (0.08, 0.12), '#ffffff', 'bebida; va a la mesa'),
    (10, 'Delantal (opcional, en Vestir)', None, None, None, 'ropa adecuada para cocinar; gratis'),
]
COCINA_R = ['Mesa baja redonda (salón)', 'Platos, tazas, tetera y galletas (salón)', 'Cojines de suelo rosa y lila (salón)', 'Cesta (habitación)']
BANO = [
    (1, 'Fondo del baño (vacío)', None, None, None, 'azulejos suaves; ventana en el centro'),
    (2, 'Bañera con patas (detrás y delante)', (380, 760), (1.50, 0.60), '#d6f0f7', 'bañarse (postura nueva)'),
    (3, 'Lavabo con espejo y escalón', (1110, 640), (0.65, 1.45), '#e8f6fb', 'lavarse las manos'),
    (4, 'Inodoro infantil', (1360, 650), (0.45, 0.50), '#ffffff', 'ganas de ir al baño'),
    (5, 'Cortina del inodoro (abierta y cerrada)', (1360, 655), (0.90, 1.60), '#f7dbe9', 'se cierra mientras va al baño'),
    (6, 'Toallero con toalla', (845, 600), (0.50, 0.90), '#ffe3ec', 'secarse'),
    (7, 'Jabón', None, (0.08, 0.05), '#ffffff', 'sobre el lavabo'),
    (8, 'Cepillo de dientes en su vaso', None, (0.08, 0.16), '#ffffff', 'sobre el lavabo (más adelante)'),
    (9, 'Patito de goma', None, (0.14, 0.12), '#ffe27a', 'juguete del baño (diversión)'),
    (10, 'Alfombrilla de baño', (420, 920), (1.00, 0.10), '#cdeedd', 'plana, siempre debajo'),
    (11, 'Espuma de la bañera', None, None, None, 'capa encima del agua al bañarse'),
]
BANO_R = ['Cesta (habitación), como cesto de la ropa o de los juguetes del baño', 'Osito y conejito (de visita)']


def muneca():
    ov = json.loads((P / 'prueba-completa-2026-10-22' / 'capas-del-visor.json').read_text(encoding='utf-8'))
    im = Image.new('RGBA', (948, 1659))
    for c in ov['combos']['vestido|rizos|clara|castano']:
        im.alpha_composite(Image.open(RAIZ / c.split('=', 1)[1]).convert('RGBA'))
    return im.crop((0, 20, 948, 1590))                 # pies en y = 1542 del recorte


def pegar_muneca(f, m, x, pies):
    k = alto(pies) / 1500; mm = m.resize((round(m.width * k), round(m.height * k)), Image.LANCZOS)
    f.alpha_composite(mm, (round(x - 479 * k), round(pies - 1542 * k)))


def pegar(f, nombre, x, base, ancho=None, alto_m=None, prof=None):
    """Una pieza aprobada, a su tamaño real: ancho o alto en metros, en la profundidad prof (por defecto, su base)."""
    m = MED[nombre]; im = Image.open(ARTE / m['f']).convert('RGBA'); y = prof or base
    k = (ancho * pxm(y) / m['px'][0]) if ancho else (alto_m * pxm(y) / m['px'][1])
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    f.alpha_composite(im, (round(x - m['base'][0] * k), round(base - m['base'][1] * k)))
    return k


def fondo(pared, suelo, azulejos=False):
    f = Image.new('RGBA', (W, H), pared); d = ImageDraw.Draw(f)
    if azulejos:
        for y in range(40, 480, 56):
            d.line((0, y, W, y), fill='#d9e7ee', width=2)
        for x in range(0, W, 56):
            d.line((x, 0, x, 480), fill='#d9e7ee', width=2)
    d.rectangle((0, 480, W, SUELO), fill='#e8dccb'); d.rectangle((0, SUELO, W, H), fill=suelo)
    for y in range(550, H, 48):
        d.line((0, y, W, y), fill='#d9b48a' if suelo == '#e6c49c' else '#c9d6dc', width=2)
    d.rounded_rectangle((660, 60, 1030, 330), 18, outline='#c9b6e8', width=6)          # ventana (la misma que en la casa)
    return f


def zona(d, n, xy, tam, col):
    x, base = xy; w, h = tam[0] * pxm(base), tam[1] * pxm(base)
    caja = (x - w / 2, base - h, x + w / 2, base)
    d.rounded_rectangle(caja, 18, fill=col + 'cc', outline=MORADO, width=4)
    d.ellipse((caja[0] + 8, caja[1] + 8, caja[0] + 48, caja[1] + 48), fill=MORADO)
    d.text((caja[0] + 28, caja[1] + 28), str(n), font=F(24), fill='white', anchor='mm')


def etiqueta(d, n, x, y, w, h):
    d.rounded_rectangle((x - w / 2, y - h, x + w / 2, y), 10, fill='#ffffffdd', outline=MORADO, width=3)
    d.text((x, y - h / 2), str(n), font=F(20), fill=MORADO, anchor='mm')


def leyenda(titulo, piezas, reutil):
    L = Image.new('RGBA', (W, 640), 'white'); dl = ImageDraw.Draw(L)
    dl.text((30, 18), titulo, font=F(27), fill='#4a3a5c')
    for i, (n, nom, xy, tam, col, nota) in enumerate(piezas):
        x, y = 30 + (i // 6) * 760, 74 + (i % 6) * 64
        dl.ellipse((x, y, x + 34, y + 34), fill=MORADO); dl.text((x + 17, y + 17), str(n), font=F(17), fill='white', anchor='mm')
        dl.text((x + 46, y - 2), nom, font=F(19), fill='#333')
        dl.text((x + 46, y + 24), (f'{tam[0]:.2f} × {tam[1]:.2f} m · ' if tam else '') + nota, font=F(16, False), fill='#666')
    dl.text((30, 470), 'Reutilizadas (ya aprobadas, sin cambios):', font=F(20), fill='#3a7a5a')
    for i, r in enumerate(reutil):
        dl.text((50 + (i % 2) * 740, 504 + (i // 2) * 34), '· ' + r, font=F(18, False), fill='#3a5a4a')
    return L


def guardar(f, L, nombre):
    o = Image.new('RGBA', (W, H + L.height), 'white'); o.alpha_composite(f); o.alpha_composite(L, (0, H))
    o.convert('RGB').save(AQUI / nombre, optimize=True)


def cocina():
    f = fondo('#fbf3e4', '#e6c49c', azulejos=False); d = ImageDraw.Draw(f, 'RGBA'); m = muneca()
    for n, nom, xy, tam, col, nota in COCINA:
        if xy:
            zona(d, n, xy, tam, col)
    x, b = 330, 600; etiqueta(d, 5, x - 120, b - 0.95 * pxm(b), .30 * pxm(b), .18 * pxm(b))   # frutero sobre la encimera
    pegar_muneca(f, m, 1000, 760)                                                          # la muñeca, de pie junto a la mesa
    # la mesa baja del salón (reutilizada) con lo que se come encima y los cojines (reutilizados) a los lados
    km = pegar(f, 'mesa', 790, 900, ancho=.85)
    mesa = MED['mesa']; enc = {'plato': [[409, 390], [753, 436], [1097, 390]], 'taza': [[316, 286], [1190, 286], [809, 352]]}
    ax = lambda p: (790 + (p[0] - mesa['recorte'][0] - mesa['base'][0]) * km, 900 + (p[1] - mesa['recorte'][1] - mesa['base'][1]) * km)
    for p in enc['plato'][:2]:
        x, y = ax(p); pegar(f, 'plato', x, y, ancho=.22, prof=900)
    x, y = ax(enc['taza'][2]); pegar(f, 'taza', x, y, ancho=.16, prof=900)
    d = ImageDraw.Draw(f, 'RGBA')
    for n, p, w in ((6, enc['plato'][0], .22), (7, enc['plato'][1], .22), (9, enc['taza'][0], .08), (8, enc['plato'][2], .16)):
        x, y = ax(p); etiqueta(d, n, x, y - 6, w * pxm(900), .10 * pxm(900))
    pegar(f, 'cojin-rosa', 560, 985, ancho=.50); pegar(f, 'cojin-lila', 1020, 985, ancho=.50)
    pegar(f, 'cesta', 160, 860, alto_m=.40)
    guardar(f, leyenda('Cocina · distribución a escala (la muñeca y las piezas aprobadas, de verdad)', COCINA, COCINA_R), 'distribucion-cocina.png')


def bano():
    f = fondo('#eef7fb', '#dfe9ee', azulejos=True); d = ImageDraw.Draw(f, 'RGBA'); m = muneca()
    for n, nom, xy, tam, col, nota in BANO:
        if xy and n not in (5,):
            zona(d, n, xy, tam, col)
    # la cortina del inodoro (5), abierta, como un marco alrededor
    x, b = 1360, 655; w, h = .9 * pxm(b), 1.6 * pxm(b)
    d.rounded_rectangle((x - w / 2, b - h, x + w / 2, b), 24, outline='#d48bb0', width=6)
    d.ellipse((x + w / 2 - 44, b - h + 8, x + w / 2 - 6, b - h + 46), fill='#d48bb0'); d.text((x + w / 2 - 25, b - h + 27), '5', font=F(20), fill='white', anchor='mm')
    x, b = 1110, 640; etiqueta(d, 7, x - 50, b - .85 * pxm(b), .1 * pxm(b), .07 * pxm(b)); etiqueta(d, 8, x + 55, b - .85 * pxm(b), .1 * pxm(b), .17 * pxm(b))
    etiqueta(d, 9, 500, 700, .14 * pxm(760), .12 * pxm(760))                                    # el patito, en la bañera
    pegar_muneca(f, m, 820, 870)
    pegar(f, 'cesta', 1180, 930, alto_m=.40)
    guardar(f, leyenda('Baño · distribución a escala (la muñeca y la cesta aprobadas, de verdad)', BANO, BANO_R), 'distribucion-bano.png')


def plantilla(piezas, nombre):
    f = Image.new('RGBA', (W, H), (253, 250, 245, 255)); d = ImageDraw.Draw(f, 'RGBA')
    d.line((0, SUELO, W, SUELO), fill='#b9a6d8', width=4)
    for x in range(-1600, 3200, 160):                  # líneas del suelo hacia el punto de fuga (centro de la ventana)
        d.line((845 + (x - 845) * 0.08, SUELO, x, H), fill='#e3d9f2', width=2)
    d.rounded_rectangle((660, 60, 1030, 330), 18, outline='#c9b6e8', width=4)
    for n, nom, xy, tam, col, nota in piezas:
        if xy:
            x, base = xy; w, h = tam[0] * pxm(base), tam[1] * pxm(base)
            d.rounded_rectangle((x - w / 2, base - h, x + w / 2, base), 18, outline=MORADO, width=3); d.text((x - w / 2 + 10, base - h + 6), str(n), font=F(24), fill=MORADO)
    sil = muneca().getchannel('A').point(lambda a: 110 if a > 128 else 0); gris = Image.new('RGBA', sil.size, (90, 70, 120, 255)); gris.putalpha(sil)
    for x, pies in ((300, 560), (990, 780), (760, 1000)):
        pegar_muneca(f, gris, x, pies)
    f.convert('RGB').save(AQUI / nombre, optimize=True)


if __name__ == '__main__':
    cocina(); bano(); plantilla(COCINA, 'plantilla-cocina.png'); plantilla(BANO, 'plantilla-bano.png')
    print('distribucion-cocina.png, distribucion-bano.png, plantilla-cocina.png, plantilla-bano.png')
