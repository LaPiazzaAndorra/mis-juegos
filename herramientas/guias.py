#!/usr/bin/env python3
"""
Mi Mundo de Juegos · Guías de dibujo para cada capa

A partir de la muñeca base aprobada crea, en plantilla/guias/, una lámina por pieza
(2000 × 3500, fondo transparente) para usarla como capa de referencia encima del
dibujo en Procreate o Photoshop:

  guia-ojos.png      dónde van los ojos y qué deben tapar los ojos cerrados
  guia-pelo.png      qué debe cubrir el pelo (coronilla) y hasta dónde puede llegar
  guia-vestido.png   qué parte del cuerpo debe tapar el vestido y por dónde van los hombros
  guia-zapatos.png   los pies que deben quedar tapados y la línea del suelo
  guia-corona.png    zona de los accesorios de la cabeza
  guias-resumen.png  las cinco juntas, en pequeño, para tenerlas a la vista

  python3 herramientas/guias.py [arte/originales/base-clara.png]

Las medidas salen de plantilla/plantilla.js (actualízala antes con medir_base.py).
"""
import json, re, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
DEST = RAIZ / 'plantilla' / 'guias'
W, H = 2000, 3500
FUENTE = next((p for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
                           'C:/Windows/Fonts/arialbd.ttf'] if Path(p).exists()), None)


def plantilla():
    """Lee plantilla.js (objeto JS sencillo) como diccionario."""
    t = (RAIZ / 'plantilla' / 'plantilla.js').read_text(encoding='utf-8')
    t = t[t.index('{'): t.rindex('}') + 1]
    t = re.sub(r'//[^\n]*', '', t)
    t = re.sub(r"'([^']*)'", lambda m: json.dumps(m.group(1)), t)
    t = re.sub(r'([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', t)
    t = re.sub(r',(\s*[}\]])', r'\1', t)
    return json.loads(t)


def fuente(n):
    return ImageFont.truetype(FUENTE, n) if FUENTE else ImageFont.load_default()


def lienzo(base, opacidad=.38):
    b = np.array(base).astype(float)
    b[:, :, 3] *= opacidad
    return Image.fromarray(b.astype(np.uint8), 'RGBA')


def etiqueta(d, xy, texto, color, n=44, ancla='la'):
    f = fuente(n)
    x, y = xy
    caja = d.textbbox((x, y), texto, font=f, anchor=ancla)
    d.rounded_rectangle((caja[0] - 14, caja[1] - 10, caja[2] + 14, caja[3] + 10), 14, fill=(255, 255, 255, 230))
    d.text((x, y), texto, font=f, fill=color, anchor=ancla)


def rayas(d, caja, color, paso=26, ancho=5):
    x0, y0, x1, y1 = caja
    for k in range(-int(y1 - y0), int(x1 - x0), paso):
        d.line((x0 + k, y1, x0 + k + (y1 - y0), y0), fill=color, width=ancho)


def zona(d, r, color, texto):
    d.rectangle(r, outline=color, width=8)
    etiqueta(d, (r[0] + 20, r[1] + 20), texto, color, 38)


def mascara(base, umbral=128):
    return np.array(base)[:, :, 3] > umbral


def recorta_a(capa, mask):
    """Deja la capa solo donde la máscara es verdadera."""
    a = np.array(capa)
    a[:, :, 3] = np.where(mask, a[:, :, 3], 0)
    return Image.fromarray(a, 'RGBA')


def sombreado(mask, color, filas=None, cols=None):
    """Capa de rayas de color sobre la parte de la máscara indicada."""
    capa = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    rayas(d, (0, 0, W, H), color, 30, 6)
    m = mask.copy()
    if filas:
        m[: filas[0]] = False; m[filas[1]:] = False
    if cols:
        m[:, : cols[0]] = False; m[:, cols[1]:] = False
    return recorta_a(capa, m)


def main():
    ruta = Path(sys.argv[1] if len(sys.argv) > 1 else RAIZ / 'arte' / 'originales' / 'base-clara.png')
    base = Image.open(ruta).convert('RGBA')
    if base.size != (W, H):
        sys.exit(f'{ruta}: debe medir {W} × {H}')
    P = plantilla()
    A, Z = P['anclas'], P['zonas']
    m = mascara(base)
    DEST.mkdir(parents=True, exist_ok=True)
    AZUL, ROSA, MARRON, VERDE, ROJO, LILA = (40, 120, 220, 255), (230, 60, 130, 255), (150, 90, 40, 255), (40, 160, 100, 255), (220, 30, 60, 255), (120, 80, 200, 255)
    hechas = []

    # ---------- ojos ----------
    g = lienzo(base); d = ImageDraw.Draw(g)
    zona(d, Z['ojos']['r'], AZUL, 'Zona de los ojos')
    ey = A['ojos']
    for (x, _) in (A['ojoIzq'], A['ojoDer']):
        d.ellipse((x - 150, ey - 140, x + 150, ey + 140), outline=AZUL, width=10)
        d.line((x - 30, ey, x + 30, ey), fill=AZUL, width=6); d.line((x, ey - 30, x, ey + 30), fill=AZUL, width=6)
    d.line((Z['ojos']['r'][0], ey, Z['ojos']['r'][2], ey), fill=AZUL, width=4)
    etiqueta(d, (1000, Z['ojos']['r'][3] + 40), f'Centros: x {A["ojoIzq"][0]} y {A["ojoDer"][0]} · línea de ojos y {ey}', AZUL, 40, 'ma')
    etiqueta(d, (1000, Z['ojos']['r'][3] + 110), 'Los ojos cerrados deben tapar todo el óvalo', AZUL, 40, 'ma')
    hechas.append(('guia-ojos.png', g))

    # ---------- pelo ----------
    g = lienzo(base); d = ImageDraw.Draw(g)
    cor = A['coronilla'][1]
    g.alpha_composite(sombreado(m, (150, 90, 40, 150), filas=(cor - 10, A['ojos'] - 220)))
    zona(d, Z['pelo-detras']['r'], MARRON, 'Pelo detrás: hasta aquí')
    r = Z['pelo-delante']['r']; d.rectangle((r[0] + 30, r[1] + 30, r[2] - 30, r[3] - 30), outline=(200, 120, 60, 255), width=6)
    etiqueta(d, (r[0] + 50, r[1] + 100), 'Pelo delante: hasta aquí', (200, 120, 60, 255), 38)
    etiqueta(d, (1000, cor - 80), 'Rayado: el pelo DEBE tapar la cabeza', MARRON, 42, 'ma')
    d.line((0, cor, W, cor), fill=MARRON, width=5)
    etiqueta(d, (1000, A['barbilla'][1] + 60), 'Pelo delante: sin piel dentro de la capa', MARRON, 40, 'ma')
    hechas.append(('guia-pelo.png', g))

    # ---------- vestido ----------
    g = lienzo(base); d = ImageDraw.Draw(g)
    y0 = A['hombroIzq'][1] + 40
    g.alpha_composite(sombreado(m, (230, 60, 130, 150), filas=(y0, A['cadera']), cols=(A['cinturaIzq'] - 40, A['cinturaDer'] + 40)))
    zona(d, Z['ropa']['r'], ROSA, 'Ropa: hasta aquí')
    for (x, y) in (A['hombroIzq'], A['hombroDer']):
        d.ellipse((x - 26, y - 26, x + 26, y + 26), fill=ROSA)
    d.line((A['hombroIzq'][0], A['hombroIzq'][1], A['hombroDer'][0], A['hombroDer'][1]), fill=ROSA, width=5)
    etiqueta(d, (1000, A['hombroIzq'][1] - 90), 'Hombros', ROSA, 40, 'ma')
    d.line((A['cinturaIzq'] - 60, A['cintura'], A['cinturaDer'] + 60, A['cintura']), fill=ROSA, width=6)
    etiqueta(d, (A['cinturaDer'] + 80, A['cintura']), f'Cintura y {A["cintura"]}', ROSA, 36, 'lm')
    etiqueta(d, (1000, A['cadera'] + 80), 'Rayado: el vestido DEBE tapar el torso', ROSA, 42, 'ma')
    for (x, y) in (A['manoIzq'], A['manoDer']):
        d.ellipse((x - 70, y - 70, x + 70, y + 70), outline=VERDE, width=6)
    etiqueta(d, (1000, Z['ropa']['r'][3] - 60), 'Círculos verdes: no tapar las manos', VERDE, 38, 'ma')
    hechas.append(('guia-vestido.png', g))

    # ---------- zapatos ----------
    g = lienzo(base); d = ImageDraw.Draw(g)
    g.alpha_composite(sombreado(m, (40, 120, 220, 150), filas=(A['tobilloIzq'][1] + 20, A['suelo'] + 1)))
    zona(d, Z['zapatos']['r'], AZUL, 'Zapatos: hasta aquí')
    d.line((0, A['suelo'], W, A['suelo']), fill=ROJO, width=6)
    etiqueta(d, (1000, A['suelo'] + 70), f'Suela en y {A["suelo"]} o un poco por debajo', ROJO, 40, 'ma')
    etiqueta(d, (1000, Z['zapatos']['r'][1] - 80), 'Rayado: los zapatos DEBEN tapar los pies', AZUL, 42, 'ma')
    hechas.append(('guia-zapatos.png', g))

    # ---------- corona y adornos de la cabeza ----------
    g = lienzo(base); d = ImageDraw.Draw(g)
    r = [int(A['eje'] - 700), max(0, cor - 310), int(A['eje'] + 700), cor + 440]
    zona(d, r, LILA, 'Corona y adornos de cabeza')
    etiqueta(d, (1000, r[3] + 40), 'Apoyada sobre el pelo; sin pelo dentro de la capa', LILA, 40, 'ma')
    hechas.append(('guia-corona.png', g))

    for n, im in hechas:
        im.save(DEST / n, optimize=True)
        print('  plantilla/guias/' + n)
    # resumen
    t = 380
    res = Image.new('RGB', (t * len(hechas) + 20 * (len(hechas) + 1), int(t * H / W) + 90), (255, 248, 252))
    dr = ImageDraw.Draw(res)
    for i, (n, im) in enumerate(hechas):
        x = 20 + i * (t + 20)
        fondo = Image.new('RGBA', im.size, (255, 255, 255, 255)); fondo.alpha_composite(im)
        res.paste(fondo.convert('RGB').resize((t, int(t * H / W)), Image.LANCZOS), (x, 70))
        dr.text((x, 20), n.replace('guia-', '').replace('.png', '').capitalize(), font=fuente(34), fill=(74, 58, 92))
    res.save(DEST / 'guias-resumen.png', optimize=True)
    print('  plantilla/guias/guias-resumen.png')


if __name__ == '__main__':
    main()
