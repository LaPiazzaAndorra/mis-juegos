#!/usr/bin/env python3
"""
Medidas PROVISIONALES de la base D-014 (copia técnica, 948 × 1659, resolución nativa).

Solo lee la imagen: no la amplía, regenera ni deforma. No toca plantilla/plantilla.js ni las
guías V2.1 del juego. Cada medida se marca como:
  · «automática»: detectada en la silueta (alfa > 128) o en los píxeles;
  · «estimada»: calculada a partir de medidas automáticas con una regla indicada (hay que
    revisarla a ojo).

Uso (desde la raíz del repositorio):
  python3 docs/propuestas/base-aprobada-d013-2026-10-14/medidas/medir.py
    → medidas-provisionales.json, guia-provisional.png (capa transparente),
      guia-sobre-base.png y guia-ampliaciones.png en esta carpeta

Requiere Python 3 con Pillow, NumPy y SciPy.
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent
BASE = AQUI.parent / 'base-transparencia-corregida.png'


def tramos(fila):
    x = np.flatnonzero(fila)
    if not len(x):
        return []
    c = np.flatnonzero(np.diff(x) > 1)
    return list(zip(np.r_[x[0], x[c + 1]].tolist(), np.r_[x[c], x[-1]].tolist()))


def iris(Ls, x0, x1, y0, y1):
    """Centro del iris: círculo cuyo aro (mitad inferior y lados, el párpado tapa la superior)
    es más oscuro que lo que lo rodea. Búsqueda exhaustiva de centro y radio."""
    t = np.linspace(0, 2 * np.pi, 180, endpoint=False)
    t = t[np.sin(t) > -0.3]
    mejor = None
    for r in range(26, 42):
        for cy in range(y0, y1):
            for cx in range(x0, x1):
                aro = Ls[np.round(cy + r * np.sin(t)).astype(int), np.round(cx + r * np.cos(t)).astype(int)].mean()
                fuera = Ls[np.round(cy + (r + 5) * np.sin(t)).astype(int), np.round(cx + (r + 5) * np.cos(t)).astype(int)].mean()
                if mejor is None or fuera - aro > mejor[0]:
                    mejor = (fuera - aro, cx, cy, r)
    return mejor[1:]


def medir():
    im = np.array(Image.open(BASE).convert('RGBA'))
    H, W = im.shape[:2]
    m = im[..., 3] > 128
    T = {y: tramos(m[y]) for y in range(H)}
    ancho = lambda y: sum(b - a + 1 for a, b in T[y])
    filas = [y for y in range(H) if T[y]]
    coronilla, suelo = filas[0], filas[-1]
    M = {}

    def pon(nombre, tipo, como, **v):
        M[nombre] = dict(tipo=tipo, metodo=como, **{k: (x if isinstance(x, (bool, str)) else round(float(x), 1) if isinstance(x, (float, np.floating)) else int(x)) for k, x in v.items()})

    pon('coronilla', 'automática', 'primera fila de la silueta', y=coronilla)
    pon('suelo', 'automática', 'última fila de la silueta (planta de los pies)', y=suelo)
    # Cabeza y barbilla
    tercio = range(coronilla, coronilla + (suelo - coronilla) // 3)
    y_orejas = max(tercio, key=ancho)
    cuello_min = min(ancho(y) for y in range(y_orejas, y_orejas + 200))
    y_cuello = next(y for y in range(y_orejas, y_orejas + 200) if ancho(y) == cuello_min)
    barbilla = next(y for y in range(y_orejas, y_cuello + 1) if ancho(y) <= cuello_min * 1.15)
    cabeza = [y for y in range(coronilla, y_orejas) if len(T[y]) == 1]
    pon('barbilla', 'automática', 'fila donde el ancho baja a ≤ 1,15 × el cuello', y=barbilla)
    pon('orejas_mas_anchas', 'automática', 'fila más ancha del primer tercio', y=y_orejas, x0=T[y_orejas][0][0], x1=T[y_orejas][-1][1])
    pon('cuello_mas_estrecho', 'automática', 'fila más estrecha bajo la cabeza', y=y_cuello, x0=T[y_cuello][0][0], x1=T[y_cuello][0][1])
    # Hombros y axilas
    axilas = next(y for y in range(y_cuello, suelo) if len(T[y]) >= 3)
    pon('axilas', 'automática', 'primera fila con los brazos separados del torso', y=axilas)
    # Hombros: esquina del contorno entre el cuello y la axila (punto más alejado de la cuerda)
    esquinas = {}
    for lado in ('izq', 'der'):
        borde = [(T[y][0][0] if lado == 'izq' else T[y][-1][1], y) for y in range(y_cuello, axilas)]
        (xa, ya), (xb, yb) = borde[0], borde[-1]
        dist = [abs((yb - ya) * x - (xb - xa) * y + xb * ya - yb * xa) for x, y in borde]
        esquinas[lado] = borde[int(np.argmax(dist))]
    hombros = int(round((esquinas['izq'][1] + esquinas['der'][1]) / 2))
    pon('hombros', 'automática', 'esquina del contorno entre cuello y axila (punto más alejado de la cuerda), media de los dos lados',
        y=hombros, x0=esquinas['izq'][0], y0=esquinas['izq'][1], x1=esquinas['der'][0], y1=esquinas['der'][1])
    # Entrepierna, cadera y tobillos: tramos del cuerpo junto al eje (los brazos quedan fuera)
    eje0 = float(np.median([(T[y][0][0] + T[y][0][1]) / 2 for y in cabeza]))
    def centro(y):
        dentro = [t for t in T[y] if t[0] <= eje0 <= t[1]]
        if dentro:
            return dentro
        izq = [t for t in T[y] if t[1] < eje0]; der = [t for t in T[y] if t[0] > eje0]
        return ([izq[-1]] if izq else []) + ([der[0]] if der else [])
    entrepierna = next(y for y in range(axilas, suelo) if not any(t[0] <= eje0 <= t[1] for t in T[y]))
    pon('entrepierna', 'automática', 'primera fila con hueco en el eje entre las piernas', y=entrepierna)
    y_cad = max(range(axilas + (entrepierna - axilas) // 2, entrepierna), key=lambda y: centro(y)[0][1] - centro(y)[0][0])
    pon('cadera', 'automática', 'tramo del cuerpo más ancho entre media altura del torso y la entrepierna',
        y=y_cad, x0=centro(y_cad)[0][0], x1=centro(y_cad)[0][1])
    bajo = range(suelo - (suelo - entrepierna) // 3, suelo - 40)
    y_tob = min(bajo, key=lambda y: sum(b - a for a, b in centro(y)))
    pon('tobillos', 'automática', 'piernas más estrechas en el tercio inferior', y=y_tob,
        izq=(centro(y_tob)[0][0] + centro(y_tob)[0][1]) / 2, der=(centro(y_tob)[-1][0] + centro(y_tob)[-1][1]) / 2)
    # Eje central
    medios = [(T[y][0][0] + T[y][0][1]) / 2 for y in cabeza] + \
             [(centro(y)[0][0] + centro(y)[0][1]) / 2 for y in range(axilas + 10, entrepierna - 5)]
    eje = float(np.median(medios))
    pon('eje_central', 'automática', 'mediana del centro de la cabeza y del torso', x=eje, centro_del_lienzo=W / 2)
    # Ojos
    L = 0.299 * im[..., 0] + 0.587 * im[..., 1] + 0.114 * im[..., 2]
    Ls = nd.gaussian_filter(L, 1)
    zona = int(barbilla - (barbilla - coronilla) * 0.62), int(barbilla - (barbilla - coronilla) * 0.30)
    oi = iris(Ls, int(eje - 120), int(eje - 50), *zona)
    od = iris(Ls, int(eje + 50), int(eje + 120), *zona)
    pon('ojo_izq', 'automática', 'centro del círculo del iris', x=oi[0], y=oi[1], radio_iris=oi[2])
    pon('ojo_der', 'automática', 'centro del círculo del iris', x=od[0], y=od[1], radio_iris=od[2])
    # Manos: punta más baja de cada brazo, y centro de la mano
    def brazo(lado):
        # brazo: tramos de ese lado que no son el cuerpo (los que no devuelve centro); el más exterior
        def sel(y):
            c = centro(y)
            r = [t for t in T[y] if t not in c and ((t[1] < eje0) if lado == 'izq' else (t[0] > eje0))]
            return ([r[0]] if lado == 'izq' else [r[-1]]) if r else []
        ys = [y for y in range(axilas, y_tob) if sel(y)]      # por encima de los tobillos (no confundir con los dedos de los pies)
        return ys, sel
    for lado in ('izq', 'der'):
        ys, sel = brazo(lado)
        punta = ys[-1]
        cx = [(sel(y)[0][0] + sel(y)[0][1]) / 2 for y in range(punta - 70, punta - 10) if sel(y)]
        pon(f'mano_{lado}_punta', 'automática', 'punto más bajo del brazo separado del cuerpo', y=punta,
            x=(sel(punta)[0][0] + sel(punta)[0][1]) / 2)
        pon(f'mano_{lado}_centro', 'estimada', 'centro del brazo entre 70 y 10 px por encima de la punta',
            x=float(np.mean(cx)), y=punta - 40)
    # Hombros, codos, cintura anatómica y rodillas: estimaciones SIN VALIDAR
    for lado, s in (('izq', -1), ('der', 1)):
        ex, ey = M['hombros']['x0' if s < 0 else 'x1'], M['hombros']['y0' if s < 0 else 'y1']
        _, sel = brazo(lado)
        ax = sel(axilas)[0][1] if s < 0 else sel(axilas)[0][0]       # axila: borde interior del brazo
        hx, hy = (ex + ax) / 2, (ey + axilas) / 2
        pon(f'hombro_{lado}_estimado', 'estimada', 'punto medio entre la esquina del hombro y la axila', x=hx, y=hy, validada=False, nota='pendiente de comprobar al separar o animar las piezas; no es una articulación validada')
        mc = M[f'mano_{lado}_centro']
        cy = (hy + mc['y']) / 2
        _, sel = brazo(lado)
        tr = sel(int(cy))
        cx = (tr[0][0] + tr[0][1]) / 2 if tr else (hx + mc['x']) / 2
        pon(f'codo_{lado}_estimado', 'estimada', 'a media altura entre hombro y mano, en el centro del brazo', x=cx, y=cy, validada=False, nota='pendiente de comprobar al separar o animar las piezas; no es una articulación validada')
    eje_col = Ls[:, int(eje) - 40:int(eje) + 41].mean(1)
    rango = range(axilas + (entrepierna - axilas) // 2, entrepierna - 10)
    bajo_cam = min(rango, key=lambda y: eje_col[y])
    pon('bajo_camiseta', 'automática', 'sombra más oscura del bajo de la camiseta en el eje (prenda, no anatomía)', y=bajo_cam)
    cint = axilas + 0.6 * (entrepierna - axilas)
    pon('cintura_anatomica', 'estimada', '60 % del camino de las axilas a la entrepierna; la tapa la camiseta y la silueta no se estrecha',
        y=cint, validada=False, nota='no visible en la base: comprobar con el cuerpo sin ropa al separar capas')
    rod = (entrepierna + y_tob) / 2
    pon('rodillas', 'estimada', 'a medio camino entre entrepierna y tobillos', y=rod, validada=False, nota='pendiente de comprobar al separar o animar las piezas; no es una articulación validada',
        izq=(centro(int(rod))[0][0] + centro(int(rod))[0][1]) / 2, der=(centro(int(rod))[-1][0] + centro(int(rod))[-1][1]) / 2)
    altura = suelo - coronilla
    resumen = dict(altura_total=altura, cabeza=barbilla - coronilla,
                   cabezas_de_alto=round(altura / (barbilla - coronilla), 2),
                   separacion_ojos=od[0] - oi[0])
    return im, M, resumen


DERECHA = ('entrepierna', 'hombros')
ROJO, AZUL, NAR = (220, 40, 90, 255), (20, 120, 230, 255), (240, 130, 0, 255)


def dibujar(size, M):
    W, H = size
    g = Image.new('RGBA', size, (0, 0, 0, 0)); d = ImageDraw.Draw(g)
    F = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', 13)
    col = lambda k: AZUL if M[k]['tipo'] == 'automática' else NAR

    def hline(k, txt):
        y = M[k]['y']; c = col(k)
        if M[k]['tipo'] == 'automática':
            d.line([(0, y), (W, y)], fill=c, width=1)
        else:
            for x in range(0, W, 12): d.line([(x, y), (x + 6, y)], fill=c, width=1)
        lab = txt + ('' if M[k]['tipo'] == 'automática' else ' (est., sin validar)' if M[k].get('validada') is False else ' (est.)')
        d.text((4, y - 15) if k not in DERECHA else (W - 8 - d.textlength(lab, font=F), y + 2), lab, font=F, fill=c)

    def punto(k, txt=None):
        x, y = M[k]['x'], M[k]['y']; c = col(k)
        if M[k]['tipo'] == 'automática':
            d.ellipse([x - 5, y - 5, x + 5, y + 5], fill=c)
        else:
            d.ellipse([x - 6, y - 6, x + 6, y + 6], outline=c, width=2)
        if txt: d.text((x + 8, y - 7), txt, font=F, fill=c)

    x = M['eje_central']['x']; d.line([(x, 0), (x, H)], fill=ROJO, width=1); d.text((x + 4, 4), 'eje', font=F, fill=ROJO)
    for k, t in [('coronilla', 'coronilla'), ('barbilla', 'barbilla'), ('hombros', 'hombros'), ('axilas', 'axilas'),
                 ('bajo_camiseta', 'bajo de camiseta'), ('cintura_anatomica', 'cintura anatómica'), ('cadera', 'cadera'), ('entrepierna', 'entrepierna'), ('rodillas', 'rodillas'),
                 ('tobillos', 'tobillos'), ('suelo', 'suelo')]:
        hline(k, t)
    for k in ('ojo_izq', 'ojo_der'):
        o = M[k]; d.ellipse([o['x'] - o['radio_iris'], o['y'] - o['radio_iris'], o['x'] + o['radio_iris'], o['y'] + o['radio_iris']], outline=AZUL, width=1)
        d.line([(o['x'] - 6, o['y']), (o['x'] + 6, o['y'])], fill=AZUL); d.line([(o['x'], o['y'] - 6), (o['x'], o['y'] + 6)], fill=AZUL)
    for kx, ky in (('x0', 'y0'), ('x1', 'y1')):
        d.ellipse([M['hombros'][kx] - 5, M['hombros'][ky] - 5, M['hombros'][kx] + 5, M['hombros'][ky] + 5], fill=AZUL)
    for k in ('cadera',):
        for kx in ('x0', 'x1'): d.ellipse([M[k][kx] - 4, M[k]['y'] - 4, M[k][kx] + 4, M[k]['y'] + 4], fill=AZUL)
    for lado in ('izq', 'der'):
        punto(f'hombro_{lado}_estimado', 'hombro?'); punto(f'codo_{lado}_estimado', 'codo?')
        punto(f'mano_{lado}_centro', 'mano'); punto(f'mano_{lado}_punta')
        for k in ('rodillas', 'tobillos'):
            xx, yy = M[k][lado], M[k]['y']; c = col(k)
            (d.ellipse([xx - 5, yy - 5, xx + 5, yy + 5], fill=c) if M[k]['tipo'] == 'automática'
             else d.ellipse([xx - 6, yy - 6, xx + 6, yy + 6], outline=c, width=2))
    return g


if __name__ == '__main__':
    im, M, resumen = medir()
    datos = dict(base='base-transparencia-corregida.png', tamaño=[im.shape[1], im.shape[0]],
                 estado='PROVISIONAL: para preparar capas; no sustituye a plantilla/plantilla.js (V2.1)',
                 leyenda={'automática': 'detectada en la imagen', 'estimada': 'calculada con la regla de «metodo»; revisar a ojo',
                         'validada=false': 'hombros, codos, rodillas y cintura anatómica: estimaciones sin validar; comprobar al separar o animar las piezas'},
                 resumen=resumen, medidas=M)
    (AQUI / 'medidas-provisionales.json').write_text(json.dumps(datos, ensure_ascii=False, indent=1), encoding='utf-8')
    base = Image.fromarray(im, 'RGBA')
    guia = dibujar(base.size, M); guia.save(AQUI / 'guia-provisional.png', optimize=True)
    fondo = Image.new('RGBA', base.size, (255, 255, 255, 255)); fondo.alpha_composite(base)
    velo = Image.new('RGBA', base.size, (255, 255, 255, 90)); fondo.alpha_composite(velo); fondo.alpha_composite(guia)
    fondo.convert('RGB').save(AQUI / 'guia-sobre-base.png', optimize=True)
    # Ampliaciones ×3 (vecino más próximo): cara, manos y pies
    z = 3; cajas = [('cara', (290, 360, 670, 640)), ('mano izq.', (150, 930, 300, 1100)), ('mano der.', (660, 930, 810, 1100)),
                    ('bajo de camiseta, cintura anatómica y cadera', (300, 900, 660, 1060)), ('tobillos y suelo', (320, 1360, 650, 1555))]
    sueltas = [fondo.crop(c).resize(((c[2] - c[0]) * z, (c[3] - c[1]) * z), Image.NEAREST) for _, c in cajas]
    Wt = max(s.width for s in sueltas); Ht = sum(s.height + 30 for s in sueltas)
    hoja = Image.new('RGB', (Wt, Ht), (255, 255, 255)); d = ImageDraw.Draw(hoja); y = 0
    F = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', 20)
    for (t, _), s in zip(cajas, sueltas):
        d.text((6, y + 4), t + ' (×3)', font=F, fill=(40, 40, 60)); hoja.paste(s.convert('RGB'), (0, y + 30)); y += s.height + 30
    hoja.save(AQUI / 'guia-ampliaciones.png', optimize=True)
    print(json.dumps(resumen, ensure_ascii=False))
    for k, v in M.items():
        print(f"{k:28s} {v['tipo']:11s} " + ' '.join(f'{a}={b}' for a, b in v.items() if a not in ('tipo', 'metodo')))
