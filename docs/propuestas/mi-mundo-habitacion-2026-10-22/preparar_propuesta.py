#!/usr/bin/env python3
"""
Mi Mundo · primera habitación ilustrada (propuesta, 22/10/2026). Solo maquetas: NO son ilustraciones definitivas.

Escribe en esta carpeta:
  distribucion.png      la habitación (2000 × 1240, el doble de la de hoy, 1000 × 620) con cada pieza en su sitio como
                        zona de color numerada y la muñeca guardada de verdad, a escala, de pie;
  estados.png           cómo se acuesta y cómo se sienta SIN dibujar posturas nuevas de la muñeca: entre dos capas de la
                        cama (detrás: cabecero y almohada; delante: edredón) y entre la silla (detrás) y la mesa con
                        mantel largo (delante), con la muñeca real (ojos cerrados al dormir);
  plantilla-escala.png  plantilla para generar las ilustraciones: el lienzo, las zonas y la silueta de la muñeca a escala
                        (de pie, acostada y sentada), para que las piezas encajen con ella.
La muñeca se monta con sus capas aprobadas (la receta del vestido, melena, piel clara y castaño de
../prueba-completa-2026-10-22/capas-del-visor.json). No se cambia ninguna capa.

Uso (desde la raíz): python3 docs/propuestas/mi-mundo-habitacion-2026-10-22/preparar_propuesta.py
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
W, H = 2000, 1240                     # lienzo de la habitación (2 × 1000 × 620)
K = 0.41                              # escala de la muñeca (948 × 1659 → unos 620 px de alto de pie, como hoy al fondo)
SUELO = 1562                          # pies de la muñeca en su lienzo
F = lambda n, b=True: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans' + ('-Bold' if b else '') + '.ttf', n)
CERRADOS = P / 'base-aprobada-d013-2026-10-14' / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png'


def muneca(dormida=False):
    ov = json.loads((P / 'prueba-completa-2026-10-22' / 'capas-del-visor.json').read_text(encoding='utf-8'))
    capas = [c.split('=', 1) for c in ov['combos']['vestido|rizos|clara|castano']]
    im = Image.new('RGBA', (948, 1659))
    for i, r in capas:
        if dormida and i == 'c-abiertos':
            r = str(CERRADOS.relative_to(RAIZ))
        im.alpha_composite(Image.open(RAIZ / r).convert('RGBA'))
    return im.resize((round(948 * K), round(1659 * K)), Image.LANCZOS)


def pegar(fondo, im, x, pies, hasta=None):
    """Pega la muñeca con el centro de sus pies en (x, pies); con «hasta», solo lo que queda por encima de esa línea
    (lo que tapa la pieza de delante: el edredón o el mantel, que llegan al suelo)."""
    x0, y0 = round(x - 479 * K), round(pies - SUELO * K)
    if hasta is not None:
        im = im.copy(); ImageDraw.Draw(im).rectangle((0, max(0, hasta - y0), im.width, im.height), fill=(0, 0, 0, 0))
    fondo.alpha_composite(im, (x0, y0))


# ---------------------------------------------------------------- zonas (coordenadas del lienzo 2000 × 1240)
# n, nombre, caja, color, tipo (fija · se mueve · se toca)
ZONAS = [
    (1, 'Pared y suelo', None, None, 'fondo'),
    (2, 'Ventana (día y noche)', (800, 100, 1200, 540), '#bfe6ff', 'se toca'),
    (3, 'Cuadro', (250, 130, 520, 340), '#fff3c4', 'fija'),
    (4, 'Estantería con libros', (1430, 220, 1890, 470), '#f0d2b0', 'fija'),
    (5, 'Cama · detrás (cabecero, colchón y almohada)', (70, 360, 700, 760), '#d8c4ff', 'se toca'),
    (6, 'Cama · delante (edredón hasta el suelo)', (40, 720, 730, 1140), '#ffc2dc', 'se toca'),
    (7, 'Mesita de noche con lámpara', (740, 560, 930, 860), '#fff0b8', 'se toca'),
    (8, 'Alfombra', (700, 950, 1360, 1160), '#c4f0da', 'fija'),
    (9, 'Silla (detrás de la muñeca)', (1420, 700, 1760, 1010), '#ffd9b3', 'se mueve con la mesa'),
    (10, 'Mesa con mantel largo (delante)', (1340, 900, 1840, 1150), '#e6d9ff', 'se mueve con la silla'),
    (11, 'Osito de peluche', (740, 1060, 880, 1200), '#e8c39e', 'se mueve'),
    (12, 'Pelota', (1220, 1010, 1310, 1100), '#ff9ec7', 'se mueve'),
    (13, 'Cesta de juguetes', (1840, 960, 1990, 1110), '#ffe0a6', 'se mueve'),
    (14, 'Puf', (1180, 1130, 1330, 1235), '#bfe0ff', 'se mueve'),
    (15, 'Planta', (1880, 700, 1990, 940), '#bfeac0', 'se mueve'),
]
PIE = 1110          # pies de la muñeca de pie (delante de la alfombra)
CAMA_X, CAMA_PIES = 385, 1095     # acostada: cabeza en la almohada, el resto bajo el edredón (que llega al suelo)
SILLA_X, SILLA_PIES = 1590, 1180  # sentada: más baja (la cadera en el asiento), las piernas detrás del mantel


def fondo():
    f = Image.new('RGBA', (W, H), '#f4eaff'); d = ImageDraw.Draw(f)
    d.rectangle((0, 660, W, 700), fill='#ffd3e6'); d.rectangle((0, 700, W, H), fill='#f2cfa2')
    for y in range(730, H, 60):
        d.line((0, y, W, y), fill='#e3b583', width=3)
    return f


def zona(d, n, nom, caja, col, tipo, etiqueta=True):
    x0, y0, x1, y1 = caja
    d.rounded_rectangle(caja, 26, fill=col + 'd0', outline='#7a5fb0', width=4)
    d.ellipse((x0 + 10, y0 + 10, x0 + 62, y0 + 62), fill='#7a5fb0')
    d.text((x0 + 36, y0 + 36), str(n), font=F(30), fill='white', anchor='mm')
    if etiqueta and x1 - x0 > 200:
        d.text((x0 + 74, y0 + 22), nom.split(' (')[0], font=F(24), fill='#4a3a5c')


def distribucion():
    f = fondo(); d = ImageDraw.Draw(f, 'RGBA')
    for n, nom, caja, col, tipo in ZONAS:
        if caja and n not in (6, 10):
            zona(d, n, nom, caja, col, tipo)
    pegar(f, muneca(), 1040, PIE)
    d = ImageDraw.Draw(f, 'RGBA')
    for n, nom, caja, col, tipo in ZONAS:
        if n in (6, 10):
            zona(d, n, nom, caja, col, tipo)
    # leyenda
    L = Image.new('RGBA', (W, 520), 'white'); dl = ImageDraw.Draw(L)
    dl.text((40, 24), 'Propuesta de distribución · la muñeca guardada, a escala (de pie, delante de la alfombra)', font=F(34), fill='#4a3a5c')
    for i, (n, nom, caja, col, tipo) in enumerate(ZONAS):
        x, y = 40 + (i // 8) * 980, 90 + (i % 8) * 52
        dl.ellipse((x, y, x + 40, y + 40), fill='#7a5fb0'); dl.text((x + 20, y + 20), str(n), font=F(22), fill='white', anchor='mm')
        dl.text((x + 56, y + 6), f'{nom} · {tipo}', font=F(26, False), fill='#333')
    o = Image.new('RGBA', (W, H + 520), 'white'); o.alpha_composite(f); o.alpha_composite(L, (0, H))
    o.convert('RGB').save(AQUI / 'distribucion.png', optimize=True)


def estados():
    m, md = muneca(), muneca(dormida=True)
    paneles = []
    # acostada: cama detrás · muñeca (ojos cerrados) · edredón delante
    a = fondo(); d = ImageDraw.Draw(a, 'RGBA')
    d.rounded_rectangle((70, 360, 700, 760), 40, fill='#d8c4ff', outline='#a07ee8', width=6)
    d.ellipse((190, 500, 580, 660), fill='#ffffff', outline='#eadff5', width=5)
    pegar(a, md, CAMA_X, CAMA_PIES, hasta=750)
    d = ImageDraw.Draw(a, 'RGBA'); d.rounded_rectangle((40, 720, 730, 1140), 40, fill='#ffb3d3', outline='#e57aa8', width=6)
    d.rounded_rectangle((40, 720, 730, 780), 30, fill='#fff0f6', outline='#e57aa8', width=6)
    d.text((760, 760), 'Acostada', font=F(38), fill='#4a3a5c')
    for i, l in enumerate(['5 · cama', '   detrás', 'muñeca con', 'los ojos', 'cerrados', '6 · edredón', '   delante']):
        d.text((760, 820 + i * 38), l, font=F(26, False), fill='#4a3a5c')
    paneles.append(a.crop((0, 300, 1000, 1180)))
    # sentada: silla detrás · muñeca más abajo · mesa con mantel delante
    s = fondo(); d = ImageDraw.Draw(s, 'RGBA')
    d.rounded_rectangle((1420, 700, 1760, 1010), 40, fill='#ffd9b3', outline='#e0a46e', width=6)
    pegar(s, m, SILLA_X, SILLA_PIES, hasta=1150)
    d = ImageDraw.Draw(s, 'RGBA'); d.rounded_rectangle((1340, 930, 1840, 1150), 24, fill='#e6d9ff', outline='#a083ff', width=6)
    d.rounded_rectangle((1320, 900, 1860, 950), 20, fill='#d3c2ff', outline='#a083ff', width=6)
    pegar(s, m, 1180, PIE)
    d.text((1020, 330), 'Sentada (a su lado, de pie, para comparar)', font=F(32), fill='#4a3a5c')
    d.text((1020, 375), '9 · silla detrás · muñeca más baja · 10 · mesa delante', font=F(26, False), fill='#4a3a5c')
    paneles.append(s.crop((1000, 300, 2000, 1180)))
    o = Image.new('RGB', (2040, 880), 'white')
    o.paste(paneles[0].convert('RGB'), (0, 0)); o.paste(paneles[1].convert('RGB'), (1040, 0))
    o.save(AQUI / 'estados.png', optimize=True)


def plantilla():
    f = Image.new('RGBA', (W, H), (253, 250, 245, 255)); d = ImageDraw.Draw(f, 'RGBA')
    d.line((0, 700, W, 700), fill='#c9b6e8', width=4)
    for n, nom, caja, col, tipo in ZONAS:
        if caja:
            d.rounded_rectangle(caja, 26, outline='#7a5fb0', width=4)
            d.text((caja[0] + 14, caja[1] + 10), str(n), font=F(30), fill='#7a5fb0')
    sil = muneca().getchannel('A').point(lambda a: 90 if a > 128 else 0)
    gris = Image.new('RGBA', sil.size, (90, 70, 120, 255)); gris.putalpha(sil)
    for x, pies, hasta in ((1040, PIE, None), (CAMA_X, CAMA_PIES, 750), (SILLA_X, SILLA_PIES, 1150)):
        pegar(f, gris, x, pies, hasta)
    f.convert('RGB').save(AQUI / 'plantilla-escala.png', optimize=True)


if __name__ == '__main__':
    distribucion(); estados(); plantilla()
    print('distribucion.png, estados.png, plantilla-escala.png')
