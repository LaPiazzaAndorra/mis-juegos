#!/usr/bin/env python3
"""
Conjunto de aventura (D-027): de la imagen aprobada (referencias/referencia-conjunto-aventura-aprobada.png, generada, sin
modificar) se toman SOLO la ropa y la mochila, en capas independientes, y se colocan sobre NUESTRA base (no se toman la
cara, la piel, el cuerpo, el pelo ni el sombrero de la imagen; nuestra muñeca no cambia).

1. Regiones de la imagen: semillas claras de cada pieza (color y zona) y reparto del resto por contraste (watershed):
   fondo y sombra del suelo, piel, pelo, sombrero y coleteros (no se usan), camiseta (con la hoja), chaleco (arena, con su
   ribete verde, bolsillos y botones), tiras de la mochila, cuerpo de la mochila, pantalón, calcetines y botas.
2. Encaje: la imagen está en el mismo lienzo que nuestra base y su cuerpo coincide con el nuestro (se mide: ojos,
   hombros, manos, pies); se coloca sin escalar ni deformar.
3. Capas (948 × 1659), de abajo arriba: mochila (cuerpo, detrás de la base) · base · calcetines · botas · pantalón ·
   camiseta · tiras de la mochila · chaleco. Borde suave de 1 px sin el color de al lado (sin halo).
4. Comprobaciones: que la ropa tape la camiseta y las mallas rosas de la base (sin tocar la base) y qué falta en la
   imagen (zonas ocultas): se marcan para completarlas en ChatGPT, sin inventarlas aquí.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/conjunto_aventura.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; B = RAIZ / 'docs' / 'propuestas' / 'base-aprobada-d013-2026-10-14'
sys.path[:0] = [str(B / 'piel-tonos'), str(B / 'ojos-abiertos'), str(B / 'medidas'), str(RAIZ / 'docs' / 'propuestas' / 'peinado-coleta-2026-10-16')]
import piel_tonos as PT   # noqa: E402
import coleta as CO       # noqa: E402  (borde suave sin el color de al lado)
MK = PT.MK

REF = AQUI / 'referencias' / 'referencia-conjunto-aventura-aprobada.png'
SAL = AQUI / 'capas'
(FONDO, PIEL, PELO, SOMBRERO, CAMISETA, CHALECO, TIRAS, MOCHILA, PANTALON, CALCETINES, BOTAS) = range(1, 12)
NOMBRES = {FONDO: 'fondo', PIEL: 'piel', PELO: 'pelo', SOMBRERO: 'sombrero', CAMISETA: 'camiseta', CHALECO: 'chaleco',
           TIRAS: 'tiras', MOCHILA: 'mochila', PANTALON: 'pantalon', CALCETINES: 'calcetines', BOTAS: 'botas'}
COLOR = {FONDO: (255, 255, 255), PIEL: (255, 150, 150), PELO: (120, 50, 10), SOMBRERO: (200, 200, 0), CAMISETA: (0, 200, 255),
         CHALECO: (255, 140, 0), TIRAS: (255, 0, 200), MOCHILA: (120, 0, 255), PANTALON: (0, 170, 0), CALCETINES: (0, 0, 255),
         BOTAS: (150, 90, 40)}
TIRA_ZONAS = [(335, 600, 412, 812), (553, 600, 632, 805)]      # x0, y0, x1, y1 de cada tira (izquierda y derecha de la imagen)
MOCHILA_ZONAS = [(195, 780, 338, 1002)]
HEBILLAS = [(346, 714, 366, 739), (603, 713, 621, 739)]         # interior de las dos hebillas


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def caja(sh, zonas):
    z = np.zeros(sh, bool)
    for x0, y0, x1, y1 in zonas:
        z[y0:y1, x0:x1] = True
    return z


def regiones(lab):
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]; C = np.hypot(a, b); h = np.degrees(np.arctan2(b, a))
    sh = L.shape; YY, XX = np.mgrid[0:sh[0], 0:sh[1]]
    var = np.sqrt(np.maximum(nd.uniform_filter(L * L, 7) - nd.uniform_filter(L, 7) ** 2, 0))
    er = lambda m, n=2: nd.binary_erosion(m, iterations=n)
    verde = (a < 6) & (b > 8) & (L < 215) & (L > 40)
    arena = (L > 165) & (L < 222) & (a >= 6) & (a < 15.5) & (b > 20) & (b < 36) & (var < 14)
    tiras, mochila = caja(sh, TIRA_ZONAS), caja(sh, MOCHILA_ZONAS)
    sem = np.zeros(sh, np.int32)
    sem[er((L >= 246) & (C < 7)) | ((YY > 1470) & (C < 12) & (L > 120))] = FONDO      # también la sombra del suelo
    sem[er((h > 40) & (h < 64) & (a > 11) & (L > 165) & (var < 8), 3)] = PIEL
    sem[er((L < 160) & (h > 22) & (h < 62) & (C > 14) & ((XX < 335) | (XX > 615) | (YY < 600)) & (YY < 1010) & ~mochila, 1)] = PELO
    sem[er((YY < 535) & (C > 7) & (L > 60) & ~((h > 40) & (h < 64) & (a > 11)) & ~((L < 160) & (h > 22) & (h < 62) & (C > 14))) | er(verde & (YY > 470) & (YY < 575))] = SOMBRERO
    chal = er(arena & (YY > 640) & (YY < 975) & (XX > 300) & (XX < 668), 1)
    et, n = nd.label(chal); tam = nd.sum(chal, et, range(1, n + 1)); chal = np.isin(et, 1 + np.where(tam > 150)[0])   # sin manchitas sueltas (sombras de la camiseta o del brazo)
    cerca = nd.distance_transform_edt(~nd.binary_dilation(chal, iterations=2))
    sem[er((L > 214) & (C > 5) & (C < 25) & (h > 50) & (h < 100) & (YY > 622) & (YY < 890) & (XX > 268) & (XX < 692)) | caja(sh, [(482, 682, 528, 762)])] = CAMISETA
    lejos = nd.distance_transform_edt(~chal)
    sem[chal | (verde & (cerca < 12) & ~tiras)] = CHALECO   # con el ribete verde (fuera de las tiras)
    sem[er(verde & tiras & (cerca > 6), 1)] = TIRAS
    sem[caja(sh, HEBILLAS)] = TIRAS                     # las hebillas (color latón) son de las tiras
    sem[er(mochila & (lejos > 24) & ~((h > 40) & (h < 64) & (a > 11)) & (L < 214) & (L > 40) & (C > 6), 2)] = MOCHILA
    sem[er(verde & (YY > 880) & (YY < 1180) & (lejos > 22) & ~mochila, 2)] = PANTALON
    sem[er((L > 214) & (L < 246) & (C > 5) & (C < 20) & (YY > 1285) & (YY < 1365) & (XX > 315) & (XX < 650), 2)] = CALCETINES
    sem[er((YY > 1335) & (YY < 1545) & (C > 9) & (L < 214) & ~((h > 40) & (h < 64) & (a > 11) & (L > 165)), 2)] = BOTAS
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(lab[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(lab[..., i], 1), 1) ** 2 for i in range(3)))
    reg = watershed(g, sem)
    # lo que una pieza encierra (botones, hebillas, la hoja) es de esa pieza
    for k in (CHALECO, TIRAS, PANTALON, MOCHILA, BOTAS, CAMISETA):
        reg[nd.binary_fill_holes(reg == k) & ~np.isin(reg, [PIEL, PELO, FONDO])] = k
    return reg, sem


def mapa(reg, rgb):
    o = (rgb.astype(float) * 0.35).astype(np.uint8)
    for k, c in COLOR.items():
        m = reg == k; o[m] = (o[m] * 0.4 + np.array(c) * 0.6).astype(np.uint8)
    return Image.fromarray(o)


PIEZAS = ['mochila', 'calcetines', 'botas', 'camiseta', 'pantalon', 'tiras', 'chaleco']   # de abajo arriba (la mochila, detrás de la base)
ETIQUETA = {'mochila': MOCHILA, 'calcetines': CALCETINES, 'botas': BOTAS, 'camiseta': CAMISETA, 'pantalon': PANTALON,
            'tiras': TIRAS, 'chaleco': CHALECO}
# el pelo de delante aprobado de la melena lleva 9 trocitos sueltos (1 318 px, restos del bordado del vestido) sobre el pecho
# (x 410–575, y 660–790): con el vestido no se ven; con otra ropa, sí. COPIA corregida sin ellos (el original no cambia).
PELO_DELANTE = PT.SIN_PIEL['pelo-delante']
RESTOS_CAJA = (380, 620, 640, 1000)        # x0, y0, x1, y1: solo trocitos separados del pelo, con el centro en esta zona


def pelo_sin_restos():
    a = PT.abrir(PELO_DELANTE).copy(); al = a[..., 3] > 0
    et, n = nd.label(al, structure=np.ones((3, 3))); tam = nd.sum(al, et, range(1, n + 1)); cm = nd.center_of_mass(al, et, range(1, n + 1))
    x0, y0, x1, y1 = RESTOS_CAJA
    quita = [i + 1 for i in range(n) if tam[i] < 2000 and y0 < cm[i][0] < y1 and x0 < cm[i][1] < x1]
    m = np.isin(et, quita); a[m] = 0
    return a, dict(trozos=len(quita), px=int(m.sum()))


def capas_de(reg, rgb):
    return {k: CO.suave(reg == ETIQUETA[k], rgb, reg != ETIQUETA[k]) for k in PIEZAS}


def pila(capas, pelo_delante, piezas=PIEZAS):
    """Capas de la muñeca con el conjunto (orden del visor): pelo de detrás · mochila · base · ojos · ropa · brazos · pelo de delante."""
    f = [PT.abrir(PT.SIN_PIEL['pelo-detras'])] + [capas[k] for k in piezas if k == 'mochila'] + [PT.abrir(PT.SIN_OJOS), PT.abrir(PT.OJOS['marron'])]
    return f + [capas[k] for k in piezas if k != 'mochila'] + [PT.abrir(PT.MANOS), pelo_delante]


def comprobar(reg, capas, pelo_delante):
    base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(base).astype(float)
    rosa = (base[..., 3] > 128) & (lab[..., 1] > 15) & (lab[..., 2] < 14)                 # camiseta y mallas rosas de la base
    YY = np.mgrid[0:1659, 0:948][0]
    encima = lambda ks: 1 - np.prod([1 - c[..., 3] / 255 for c in ks], 0)              # opacidad de lo que hay encima
    ropa = [capas[k] for k in PIEZAS if k != 'mochila']
    cubre = encima(ropa + [PT.abrir(PT.MANOS), pelo_delante])
    rosa_visto = rosa & (cubre < 0.5)
    ropa_a = encima(ropa); manos = PT.abrir(PT.MANOS)[..., 3] > 128
    bajo_brazo = (ropa_a > 0.5) & manos                                                # ropa tapada por nuestros brazos
    wb, _ = PT.peso_base(base, lab); piel_base = (wb > 0) & (base[..., 3] > 128) & ~rosa
    XX = np.mgrid[0:1659, 0:948][1]
    sobre_brazo = (ropa_a > 0.5) & piel_base & ~manos & (YY > 700) & (YY < 1150) & ((XX < 360) | (XX > 600))   # ropa encima de nuestros brazos
    todo = encima(pila(capas, pelo_delante))
    hueco = (todo < 0.5) & (reg == PIEL) & (nd.distance_transform_edt(ropa_a < 0.5) < 30)   # donde estaba el brazo de la imagen: queda el fondo
    tiras = capas['tiras'][..., 3] > 128
    sin_mochila = encima([capas[k] for k in PIEZAS if k not in ('mochila', 'tiras')] + [PT.abrir(PT.MANOS), pelo_delante])
    bajo_tiras = tiras & (sin_mochila < 0.5)                                            # lo que hay debajo de las tiras: no está en la imagen
    moch = capas['mochila'][..., 3] > 128
    oculta = nd.binary_dilation(moch, iterations=25) & ~moch & np.isin(reg, [PIEL, PELO]) & (YY > 760) & (YY < 1010)
    oculta &= nd.binary_fill_holes(nd.binary_closing(moch | oculta, iterations=12)) & (np.arange(948)[None, :] < 340)   # parte de la mochila tapada por el brazo y el pelo de la imagen
    zonas = dict(rosa_visto=rosa_visto, bajo_brazo=bajo_brazo, sobre_brazo=sobre_brazo, hueco=hueco, bajo_tiras=bajo_tiras, mochila_oculta=oculta)
    def caja_de(m):
        ys, xs = np.where(m)
        return [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())] if len(xs) else None
    info = {k: dict(px=int(m.sum()), caja=caja_de(m)) for k, m in zonas.items()}
    rv = rosa_visto
    info['rosa_visto'].update(rodillas_px=int((rv & (YY > 1150)).sum()), resto_px=int((rv & (YY <= 1150)).sum()),
                              rodillas_caja=caja_de(rv & (YY > 1150)), rosa_base_px=int(rosa.sum()))
    return zonas, info


def marcar(zonas, fondo):
    o = np.array(fondo.convert('RGB')).astype(float) * 0.55 + 255 * 0.45
    COL = dict(rosa_visto=(230, 0, 120), bajo_brazo=(0, 90, 255), sobre_brazo=(0, 200, 220), hueco=(255, 140, 0),
               bajo_tiras=(140, 0, 220), mochila_oculta=(0, 160, 60))
    for k, c in COL.items():
        m = zonas[k]; o[m] = o[m] * 0.25 + np.array(c) * 0.75
        borde = nd.binary_dilation(m, iterations=3) & ~nd.binary_dilation(m, iterations=1)
        o[borde] = c
    return Image.fromarray(o.astype(np.uint8)), COL


if __name__ == '__main__':
    fuentes = [REF, PT.SIN_OJOS, PT.OJOS['marron'], PT.MANOS, PELO_DELANTE, PT.SIN_PIEL['pelo-detras']]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    rgb = np.array(Image.open(REF).convert('RGB'))
    lab = PT.lab_de(np.dstack([rgb, np.full(rgb.shape[:2], 255, np.uint8)])).astype(float)
    reg, sem = regiones(lab)
    SAL.mkdir(exist_ok=True)
    mapa(reg, rgb).save(SAL / 'regiones-de-la-imagen.png', optimize=True)
    capas = capas_de(reg, rgb)
    for k, c in capas.items():
        Image.fromarray(c, 'RGBA').save(SAL / f'{k}.png', optimize=True)
    pd, restos = pelo_sin_restos()
    Image.fromarray(pd, 'RGBA').save(SAL / 'pelo-delante-melena-sin-restos.png', optimize=True)
    zonas, info = comprobar(reg, capas, pd)
    montaje = PT.montar(pila(capas, pd)); montaje.save(SAL / 'montaje-melena.png', optimize=True)
    PT.montar([c for c in pila(capas, pd) if c is not capas['mochila'] and c is not capas['tiras']]).save(SAL / 'montaje-melena-sin-mochila.png', optimize=True)
    m, COL = marcar(zonas, montaje)
    # comparación: imagen aprobada · nuestra base · con el conjunto · sin la mochila
    F = MK.F(22); vistas = [('Imagen aprobada (referencia)', Image.open(REF).convert('RGB')),
                            ('Nuestra base (sin cambios)', PT.montar([PT.abrir(PT.SIN_PIEL['pelo-detras']), PT.abrir(PT.SIN_OJOS), PT.abrir(PT.OJOS['marron']), PT.abrir(PELO_DELANTE)])),
                            ('Conjunto sobre nuestra base (candidato)', montaje), ('Sin la mochila', Image.open(SAL / 'montaje-melena-sin-mochila.png').convert('RGB'))]
    w, h = 474, 830; out = Image.new('RGB', (4 * (w + 10), h + 40), 'white'); d = ImageDraw.Draw(out)
    for i, (n, im) in enumerate(vistas):
        out.paste(im.convert('RGB').resize((w, h), Image.LANCZOS), (i * (w + 10), 40)); d.text((i * (w + 10) + 6, 8), n, font=F, fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-conjunto.png', optimize=True)
    # dónde falla, con la leyenda
    LEY = dict(rosa_visto='1 · Mallas rosas de la base a la vista (rodillas)', bajo_brazo='2 · Chaleco tapado por nuestros brazos',
               sobre_brazo='2 · Chaleco y mangas encima de nuestros brazos', bajo_tiras='3 · Debajo de las tiras (sin mochila: falta)',
               mochila_oculta='4 · Mochila tapada en la imagen por su brazo y su pelo', hueco='5 · Huecos pequeños junto a las piernas')
    cj = (140, 560, 810, 1330); g = m.crop(cj); o2 = Image.new('RGB', (g.width + 420, g.height), 'white'); o2.paste(g, (0, 0)); d = ImageDraw.Draw(o2)
    for i, (k, t) in enumerate(LEY.items()):
        y = 30 + i * 46; d.rectangle((g.width + 14, y, g.width + 40, y + 26), fill=tuple(COL[k])); d.text((g.width + 50, y + 2), t, font=MK.F(17), fill=(40, 40, 60))
    o2.save(AQUI / 'donde-falla-ampliado.png', optimize=True)
    (AQUI / 'guia-chatgpt').mkdir(exist_ok=True)       # nuestra muñeca sin pelo, para pedir las piezas a su medida
    PT.montar([PT.abrir(PT.SIN_OJOS), PT.abrir(PT.OJOS['marron'])]).convert('RGB').save(AQUI / 'guia-chatgpt' / 'plantilla-nuestra-muneca.png', optimize=True)
    comp = dict(metodo='regiones de la imagen (semillas por color y zona + watershed); cada pieza sin escalar ni deformar, en el mismo lienzo; '
                       'borde suave de 1 px sin el color de al lado', piezas={k: dict(px=int((c[..., 3] > 0).sum())) for k, c in capas.items()},
                zonas=info, colores_de_donde_falla=COL, pelo_delante_sin_restos=restos, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
