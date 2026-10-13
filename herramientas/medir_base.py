#!/usr/bin/env python3
"""
Mi Mundo de Juegos · Medir la muñeca base y actualizar la plantilla

Mide en la base aprobada (PNG 2000 × 3500 transparente) los puntos de referencia
que necesitan las demás capas: suelo, eje, coronilla, barbilla, cuello, hombros,
axilas, cintura, entrepierna, rodillas, tobillos, manos y apertura de los brazos.

  python3 herramientas/medir_base.py arte/originales/base-clara.png
      → informe comparado con plantilla/plantilla.js (no cambia nada)

  python3 herramientas/medir_base.py arte/originales/base-clara.png --escribir
      → reescribe plantilla/plantilla.js con las medidas de la base
        (la línea de ojos se mantiene: es una convención para quien dibuja)

Requiere Python 3 con Pillow y NumPy.
"""
import json, math, re, sys
from pathlib import Path
import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
PLANTILLA = RAIZ / 'plantilla' / 'plantilla.js'


def tramos(fila):
    """Tramos opacos [(x0, x1), …] de una fila."""
    x = np.flatnonzero(fila)
    if not len(x):
        return []
    cortes = np.flatnonzero(np.diff(x) > 1)
    ini = np.r_[x[0], x[cortes + 1]]
    fin = np.r_[x[cortes], x[-1]]
    return list(zip(ini.tolist(), fin.tolist()))


def medir(ruta):
    im = Image.open(ruta)
    if im.size != (2000, 3500):
        sys.exit(f'{ruta}: mide {im.size[0]} × {im.size[1]}, debe ser 2000 × 3500')
    a = np.array(im.convert('RGBA'))[:, :, 3]
    m = a > 128
    filas = np.flatnonzero(m.any(1))
    top, suelo = int(filas[0]), int(filas[-1])
    ancho = {y: tramos(m[y]) for y in range(top, suelo + 1)}
    total = lambda y: sum(b - a_ + 1 for a_, b in ancho[y])
    extremos = lambda y: (ancho[y][0][0], ancho[y][-1][1]) if ancho[y] else (None, None)

    # Cabeza: fila más ancha en el primer tercio; barbilla: donde el ancho cae por debajo del 30 %
    ys_cab = range(top, top + (suelo - top) // 3)
    y_cab = max(ys_cab, key=total)
    w_cab = total(y_cab)
    barbilla = next(y for y in range(y_cab, suelo) if total(y) < w_cab * .3)
    # Cuello: tramo estrecho bajo la barbilla; hombros: primera fila 2,2 veces más ancha que el cuello
    w_cuello = min(total(y) for y in range(barbilla, barbilla + 150))
    y_cuello = next(y for y in range(barbilla, barbilla + 150) if total(y) == w_cuello)
    hombros = next(y for y in range(y_cuello, suelo) if total(y) > w_cuello * 2.2)
    # Axilas: primera fila con brazos separados del torso (3 tramos o más)
    axilas = next(y for y in range(hombros, suelo) if len(ancho[y]) >= 3)

    def torso(y):
        t = [s for s in ancho[y] if s[0] <= 1000 + 60 and s[1] >= 1000 - 60]
        return t[0] if t else None
    # Entrepierna: el torso se divide en dos piernas
    entrepierna = next(y for y in range(axilas, suelo) if torso(y) is None or (torso(y)[1] - torso(y)[0]) < 60
                       or any(s[1] < 1000 and s[1] > 1000 - 80 for s in ancho[y]) and any(s[0] > 1000 and s[0] < 1000 + 80 for s in ancho[y]))
    # Cintura: la parte más estrecha del torso, lejos de las axilas y de la entrepierna
    tramo = entrepierna - axilas
    ys_t = [y for y in range(axilas + tramo // 6, entrepierna - tramo // 6) if torso(y)]
    y_cint = min(ys_t, key=lambda y: torso(y)[1] - torso(y)[0])
    cint = torso(y_cint)

    # Piernas: tramos a cada lado del eje
    def pierna(y, lado):
        t = [s for s in ancho[y] if (s[1] < 1000 if lado < 0 else s[0] > 1000) and abs((s[0] + s[1]) / 2 - 1000) < 400]
        return max(t, key=lambda s: s[1] - s[0]) if t else None
    largo = suelo - entrepierna
    def estrecho(y0, y1, lado):
        ys = [y for y in range(y0, y1) if pierna(y, lado)]
        y = min(ys, key=lambda y: pierna(y, lado)[1] - pierna(y, lado)[0])
        s = pierna(y, lado)
        return [round((s[0] + s[1]) / 2), y]
    rod_i = estrecho(entrepierna + int(largo * .25), entrepierna + int(largo * .55), -1)
    rod_d = estrecho(entrepierna + int(largo * .25), entrepierna + int(largo * .55), 1)
    tob_i = estrecho(entrepierna + int(largo * .7), suelo - 40, -1)
    tob_d = estrecho(entrepierna + int(largo * .7), suelo - 40, 1)

    # Manos: el punto más exterior de cada brazo; hombro: borde del cuerpo en la fila de hombros
    def mano(lado):
        best = None
        for y in range(axilas, entrepierna + 200):
            if not ancho[y]:
                continue
            x = ancho[y][0][0] if lado < 0 else ancho[y][-1][1]
            if best is None or (x < best[0] if lado < 0 else x > best[0]):
                best = (x, y)
        return [int(best[0]), int(best[1])]
    hx0, hx1 = extremos(hombros + 40)
    hom_i, hom_d = [int(hx0 + 30), hombros + 40], [int(hx1 - 30), hombros + 40]
    man_i, man_d = mano(-1), mano(1)
    ang = lambda h, mn: round(math.degrees(math.atan2(abs(mn[0] - h[0]), mn[1] - h[1])), 1)

    cx = lambda y0, y1: float(np.mean(np.nonzero(m[y0:y1])[1]))
    bx0, by0, bx1, by1 = int(np.flatnonzero(m.any(0))[0]), top, int(np.flatnonzero(m.any(0))[-1]), suelo
    return {
        'suelo': suelo, 'eje': round(cx(hombros, entrepierna)), 'eje_cabeza': round(cx(top, barbilla)),
        'coronilla': [round(cx(top, top + 20)), top], 'cabeza_ancho': w_cab, 'cabeza_fila': y_cab,
        'barbilla': [round(cx(barbilla - 20, barbilla)), barbilla], 'cuello': [y_cuello, w_cuello],
        'hombroIzq': hom_i, 'hombroDer': hom_d, 'axilas': axilas,
        'cintura': y_cint, 'cinturaIzq': int(cint[0]), 'cinturaDer': int(cint[1]),
        'cadera': entrepierna, 'rodillaIzq': rod_i, 'rodillaDer': rod_d, 'tobilloIzq': tob_i, 'tobilloDer': tob_d,
        'pieIzq': [tob_i[0], suelo], 'pieDer': [tob_d[0], suelo], 'manoIzq': man_i, 'manoDer': man_d,
        'brazos_grados': [ang(hom_i, man_i), ang(hom_d, man_d)], 'caja': [bx0, by0, bx1, by1],
    }


def cargar_plantilla():
    txt = PLANTILLA.read_text(encoding='utf-8')
    return txt


def informe(med):
    txt = cargar_plantilla()
    def ant(k):
        mt = re.search(rf'\b{k}: (\[[^\]]*\]|\d+)', txt)
        return json.loads(mt.group(1)) if mt else None
    filas = [('Suelo (planta de los pies)', 'suelo'), ('Eje del cuerpo', 'eje'), ('Coronilla', 'coronilla'), ('Barbilla', 'barbilla'),
             ('Hombro izquierdo', 'hombroIzq'), ('Hombro derecho', 'hombroDer'), ('Cintura (altura)', 'cintura'),
             ('Cintura izq.', 'cinturaIzq'), ('Cintura der.', 'cinturaDer'), ('Cadera / entrepierna', 'cadera'),
             ('Rodilla izq.', 'rodillaIzq'), ('Rodilla der.', 'rodillaDer'), ('Tobillo izq.', 'tobilloIzq'), ('Tobillo der.', 'tobilloDer'),
             ('Mano izq.', 'manoIzq'), ('Mano der.', 'manoDer')]
    print(f'{"Punto":<28}{"Base":>16}{"Plantilla actual":>20}')
    for n, k in filas:
        print(f'{n:<28}{str(med[k]):>16}{str(ant(k)):>20}')
    print(f'\nEje de la cabeza: x {med["eje_cabeza"]}  ·  ancho máximo de la cabeza: {med["cabeza_ancho"]} px (fila {med["cabeza_fila"]})')
    print(f'Cuello: fila {med["cuello"][0]}, {med["cuello"][1]} px de ancho, largo {med["hombroIzq"][1] - 40 - med["barbilla"][1]} px')
    print(f'Apertura de los brazos: {med["brazos_grados"][0]}° y {med["brazos_grados"][1]}°  ·  contorno: {med["caja"]}')


def lerp(p, q, t):
    return [round(p[0] + (q[0] - p[0]) * t), round(p[1] + (q[1] - p[1]) * t)]


def escribir(med):
    txt = cargar_plantilla()
    x0, y0, x1, y1 = med['caja']
    nuevas = {
        'eje': med['eje'], 'suelo': med['suelo'], 'coronilla': med['coronilla'], 'barbilla': med['barbilla'],
        'hombroIzq': med['hombroIzq'], 'hombroDer': med['hombroDer'],
        'manoIzq': med['manoIzq'], 'manoDer': med['manoDer'],
        # codo y muñeca: a lo largo del brazo, del hombro a la punta de la mano
        'codoIzq': lerp(med['hombroIzq'], med['manoIzq'], .48), 'codoDer': lerp(med['hombroDer'], med['manoDer'], .48),
        'munecaIzq': lerp(med['hombroIzq'], med['manoIzq'], .86), 'munecaDer': lerp(med['hombroDer'], med['manoDer'], .86),
        'cintura': med['cintura'], 'cinturaIzq': med['cinturaIzq'], 'cinturaDer': med['cinturaDer'], 'cadera': med['cadera'],
        'rodillaIzq': med['rodillaIzq'], 'rodillaDer': med['rodillaDer'], 'tobilloIzq': med['tobilloIzq'], 'tobilloDer': med['tobilloDer'],
        'pieIzq': med['pieIzq'], 'pieDer': med['pieDer'],
    }
    for k, v in nuevas.items():
        txt, n = re.subn(rf'(\b{k}: )(\[[^\]]*\]|\d+)', lambda mt: mt.group(1) + json.dumps(v), txt, count=1)
        if not n:
            sys.exit(f'No encuentro «{k}» en plantilla.js')
    zona = lambda r: '[' + ', '.join(str(int(v)) for v in r) + ']'
    txt = re.sub(r"(base: +\{ r: )\[[^\]]*\]", lambda mt: mt.group(1) + zona([max(0, x0 - 40), max(0, y0 - 40), min(2000, x1 + 40), min(3500, y1 + 60)]), txt)
    txt = re.sub(r"(ropa: +\{ r: )\[[^\]]*\]", lambda mt: mt.group(1) + zona([max(0, x0 - 80), med['barbilla'][1] - 30, min(2000, x1 + 80), med['suelo'] + 30]), txt)
    txt = re.sub(r"(zapatos: +\{ r: )\[[^\]]*\]", lambda mt: mt.group(1) + zona([med['tobilloIzq'][0] - 260, med['tobilloIzq'][1] - 260, med['tobilloDer'][0] + 260, med['suelo'] + 65]), txt)
    ang = round(sum(med['brazos_grados']) / 2)
    txt = re.sub(r'separados del cuerpo unos \d+°', f'separados del cuerpo unos {ang}°', txt)
    txt = re.sub(r'version: (\d+)', lambda mt: f'version: {int(mt.group(1)) + 1}', txt, count=1)
    txt = txt.replace('// Márgenes de error', f'// Medidas tomadas de la base con herramientas/medir_base.py\n  // Márgenes de error', 1) if 'medir_base.py' not in txt else txt
    PLANTILLA.write_text(txt, encoding='utf-8')
    print('\nplantilla/plantilla.js actualizada.')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    med = medir(sys.argv[1])
    informe(med)
    if '--escribir' in sys.argv:
        escribir(med)
