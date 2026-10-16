#!/usr/bin/env python3
"""
Tonos de piel dorado, moreno y profundo (D-023): variantes de NUESTRAS piezas originales, cambiando solo el color de la
piel. No se extrae la muñeca de la lámina ni cambian sus facciones. Las piezas originales no se modifican.

De la lámina aprobada (referencia-tonos-piel-aprobados.png, imagen generada, sin modificar) solo se MIDE el tono: la
piel de la cara, las orejas y el cuello se marca en el recuadro «Claro (original)» (donde se distingue bien del pelo) y
se miden esos mismos sitios en los otros tres (la muñeca está en la misma posición). No se toma ningún píxel.

Transformación (Lab), una por tono, la misma para todas las piezas:
  · luminosidad: L' = L_tono + (L − L_claro) × s  (s = dispersión del tono / dispersión del claro), así se conservan
    las sombras, el volumen, el rubor y las pecas;
  · color: el color medio de la piel pasa al de la lámina y la variación de cada píxel respecto a él (rubor, labios,
    pecas, nariz, orejas) se conserva girada con el tono y en la proporción MEDIDA en la lámina (lo rojizo del claro,
    medido en los mismos sitios de cada tono: dorado ≈ 0,75, moreno ≈ 0,67, profundo ≈ 0,42), para que no se enrojezca;
  · contorno de los ojos (corrección localizada): los brillos más claros que la piel junto a la abertura del ojo (borde
    del párpado, lagrimal) se suavizan en proporción al oscurecimiento ((L_tono / L_claro)²), para que no queden restos
    claros. Los blancos y los iris no cambian;
  · si un color queda fuera de lo que la pantalla puede mostrar, se le baja un poco la saturación (no se recorta);
  · el canal alfa no cambia.
Qué se cambia en cada pieza (lo demás queda igual, píxel a píxel):
  · base sin ojos: toda la piel (cara, orejas, cuello, brazos, manos, piernas y pies), labios, rubor y pecas. NO la ropa
    de la base (camiseta y mallas; en su borde, solo la parte de piel) ni las cejas: en las cejas se separa la ceja de
    la piel (su cobertura, como en ../cejas-colores/) y solo cambia la piel de debajo;
  · ojos abiertos (los 4 colores) y cerrados: solo la piel de los párpados y del borde (no los iris, los blancos ni las
    pestañas);
  · manos delante del vestido: son píxeles de la base, así que llevan exactamente el mismo cambio;
  · cejas a juego con el pelo: se recalculan sobre la piel nueva (mismo color de ceja aprobado), para que no quede
    piel clara alrededor;
  · bordes de otras capas con piel clara «pegada»: los dos pelos (delante y detrás) junto a la piel que se ve de verdad
    (frente, sienes, orejas, mandíbula, cuello), el cuello del vestido y el borde de los zapatos: una capa pequeña de «bordes» por tono (y por color de pelo) que pone encima solo esos píxeles con
    la piel nueva. Las capas de pelo, vestido y zapatos no cambian;
  · la franja estrecha del cuero cabelludo de la base que asoma en el borde de la cabeza entre el pelo de delante y el de
    detrás (en la piel clara pasa por un brillo; en la oscura sería una línea) se cubre, en esa misma capa de bordes, con
    el color del pelo de detrás de alrededor (de cada color de pelo);
  · corona, pintacaras y el resto del pelo, del vestido y de los zapatos: no tienen piel; no cambian.
El claro original sigue siendo la opción predeterminada (sus piezas no cambian).

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/piel-tonos/piel_tonos.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; BASE = AQUI.parent; RAIZ = BASE.parents[2]; P = RAIZ / 'docs' / 'propuestas'
sys.path[:0] = [str(BASE / 'ojos-abiertos'), str(BASE / 'pelo-colores'), str(BASE / 'cejas-colores'), str(P / 'vestido-rosa-2026-10-15' / 'montaje')]
import mascara as MK          # noqa: E402
import colores_pelo as CP     # noqa: E402
import cejas_colores as CJ    # noqa: E402
import montaje_vestido as MV  # noqa: E402

REF = AQUI / 'referencia-tonos-piel-aprobados.png'
SIN_OJOS = BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'
OJOS = {'marron': BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
        **{k: BASE / 'ojos-colores' / f'capa-ojos-abiertos-{k}.png' for k in ('azul', 'verde', 'lila')}}
CERRADOS = BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png'
MANOS = P / 'vestido-rosa-2026-10-15' / 'montaje' / 'brazos-delante-copiados-de-la-base.png'
SIN_PIEL = {'vestido': P / 'vestido-rosa-2026-10-15' / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png',
            'zapatos': P / 'zapatos-rosa-2026-10-15' / 'montaje' / 'zapatos-candidatos.png', 'corona': P / 'corona-2026-10-15' / 'montaje' / 'corona-candidata.png',
            'pintacaras': BASE / 'pintacaras' / 'capa-pintacaras-estrellas.png', 'pelo-detras': CP.DETRAS, 'pelo-delante': CP.DELANTE}
# recuadros de la lámina (x, y de la esquina; todos de 510 × 668), medidos por las líneas que los separan
RECUADROS = {'claro': (0, 0), 'dorado': (514, 0), 'moreno': (0, 762), 'profundo': (514, 762)}
TONOS = ['dorado', 'moreno', 'profundo']
NOMBRES = {'claro': 'Claro (original)', 'dorado': 'Dorado', 'moreno': 'Moreno', 'profundo': 'Profundo'}
IRIS = [(391, 443), (566, 443)]; R_IRIS = 31
BLANCO_C = 14            # dentro del ojo, hasta esta saturación es blanco (no cambia); desde 22, piel del párpado
BLANCO_C_LAGRIMAL = 6    # en el lagrimal (rosa pálido), desde 6 ya es piel


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def abrir(p):
    return np.array(Image.open(p).convert('RGBA'))


def lab_de(x):
    return MK.lab_de(Image.fromarray(x)).astype(float)


def medir_lamina():
    """Piel marcada en el recuadro claro (cara, orejas y cuello) y medida en los mismos sitios de los cuatro."""
    lab = MK.lab_de(Image.open(REF).convert('RGBA')).astype(float); H, W = 668, 510; YY, XX = np.mgrid[0:H, 0:W]
    c = lab[:H, :W]; L, C = c[..., 0], np.hypot(c[..., 1], c[..., 2]); h = np.degrees(np.arctan2(c[..., 2], c[..., 1]))
    piel = (XX > 60) & (XX < 450) & (YY > 130) & (YY < 500) & (L > 165) & (h > 25) & (h < 75) & (C > 12) & (C < 65)
    piel = nd.binary_opening(piel, iterations=2); et, n = nd.label(piel); s = nd.sum(piel, et, range(1, n + 1))
    piel = nd.binary_erosion(np.isin(et, 1 + np.where(s > 2000)[0]), iterations=4)   # 4 px de margen
    out = {}
    c0 = lab[:H, :W]; d0 = c0 - np.median(c0[piel], 0); rojizo = piel & (d0[..., 1] > 8)   # rubor, orejas, labios
    for k, (x0, y0) in RECUADROS.items():
        c = lab[y0:y0 + H, x0:x0 + W]; px = c[piel]; a, b = np.median(px[:, 1]), np.median(px[:, 2])
        q = np.percentile(px[:, 0], [5, 25, 50, 75, 95])
        dk = c - np.median(px, 0)
        out[k] = dict(L=float(q[2]), iqr=float(q[3] - q[1]), tono=float(np.degrees(np.arctan2(b, a))), croma=float(np.hypot(a, b)),
                      L_percentiles=[round(float(x)) for x in q], px=int(piel.sum()),
                      # cuánto se conserva, en este tono, la diferencia de color de lo rojizo respecto a la piel (en la lámina)
                      rojizo=float(np.median(dk[rojizo][:, 1]) / np.median(d0[rojizo][:, 1])), px_rojizo=int(rojizo.sum()))
    return out, piel


def transformacion(m, tono):
    c, t = m['claro'], m[tono]
    s = t['iqr'] / c['iqr']; giro = np.radians(t['tono'] - c['tono'])
    ac, bc = c['croma'] * np.cos(np.radians(c['tono'])), c['croma'] * np.sin(np.radians(c['tono']))
    at, bt = t['croma'] * np.cos(np.radians(t['tono'])), t['croma'] * np.sin(np.radians(t['tono']))
    k = t['rojizo']                                   # medido en la lámina: en piel más oscura, el rubor se suaviza
    cg, sg = np.cos(giro) * k, np.sin(giro) * k

    def f(lab, q=None):
        """q (opcional, por píxel): cuánto se conserva lo que es MÁS CLARO que la piel (1 = todo)."""
        L, da, db = lab[..., 0], lab[..., 1] - ac, lab[..., 2] - bc
        dL = L - c['L']
        if q is not None:
            dL = np.where(dL > 0, dL * q, dL)
        return np.stack([t['L'] + dL * s, at + da * cg - db * sg, bt + da * sg + db * cg], -1)
    return f, dict(dispersion=round(s, 3), giro_tono=round(float(np.degrees(giro)), 1), croma_claro=round(c['croma'], 1), croma_tono=round(t['croma'], 1),
                   rojizo_conservado=round(k, 2), claros_en_contorno_de_ojos=round((t['L'] / c['L']) ** 2, 2))


def a_rgb(lab):
    """Lab → sRGB; si un color no cabe, se baja su saturación poco a poco (en vez de recortar un canal)."""
    lab = lab.copy()
    for _ in range(12):
        rgb = CP.lab_a_rgb(lab)
        vuelta = MK.lab_de(Image.fromarray(np.dstack([rgb, np.full(rgb.shape[:2], 255, np.uint8)]))).astype(float)
        fuera = np.abs(vuelta - lab).max(-1) > 3
        if not fuera.any():
            break
        lab[fuera, 1:] *= 0.92
    return CP.lab_a_rgb(lab)


def piel_visible(base, wb, delante, encima, cuero):
    """Piel de la base que se ve de verdad en el montaje (sin pelo de delante, vestido ni zapatos encima, y sin la franja
    del cuero cabelludo, que se cubre aparte)."""
    return (wb == 1) & (base[..., 3] > 250) & (delante[..., 3] < 128) & ~encima & (cuero == 0)


def piel_de_alrededor(lab_base, V, sigma=6):
    """Color medio (Lab) de lo marcado en V alrededor de cada píxel (también fuera de la silueta de la base)."""
    den = nd.gaussian_filter(V.astype(float), sigma)
    return np.stack([nd.gaussian_filter(lab_base[..., i] * V, sigma) for i in range(3)], -1) / np.maximum(den, 1e-6)[..., None], den


def separar_borde(capa, V, S, denS, encima, cerca=12.0, interior=(10, None)):
    """Borde de una capa de pelo (delante o detrás) junto a la piel que se ve: cada píxel es una mezcla de pelo y de la
    piel clara original. Devuelve (s, tau, dentro): s = parte de piel (proyección entre el pelo de alrededor y la piel
    de alrededor), tau = cuánto se corrige (1 junto a la piel, hasta 0 a «cerca» px) y dentro = pelo sin mezcla."""
    A = capa[..., 3]; O = lab_de(capa)
    dV = nd.distance_transform_edt(~V)
    dA = nd.distance_transform_edt(A > 0)
    dentro = (A == 255) & (dA > interior[0]) & ((dA <= interior[1]) if interior[1] else True)
    Hc, denH = piel_de_alrededor(O, dentro, 10 if not interior[1] else 4)
    d = S - Hc; e = O - Hc
    s = np.clip((d * e).sum(-1) / np.maximum((d * d).sum(-1), 1e-6), 0, 1)
    # también los píxeles de pelo casi transparentes encima de la piel (llevan el mismo color claro)
    tau = np.clip((cerca - dV) / (cerca / 2), 0, 1) * (A > 0) * ~encima * (denH > 0.02) * (denS > 0.02)
    return s, tau, dentro


def cuero_cabelludo(base, delante, detras, ancho=6.0):
    """Franja estrecha de la cabeza de la base (cuero cabelludo) que se ve en el borde de la silueta, entre el pelo de
    delante y el de detrás (sienes, junto a las orejas). En la piel clara pasa por un brillo del pelo; en una piel más
    oscura se vería como una línea. Devuelve cuánto se cubre (1 en el borde, 0 a «ancho» px hacia dentro)."""
    A = base[..., 3]; YY = np.mgrid[0:A.shape[0], 0:A.shape[1]][0]
    d = nd.distance_transform_edt(A > 0)
    return np.clip((ancho - d) / (ancho - 2), 0, 1) * (A > 0) * (delante[..., 3] < 255) * (detras[..., 3] > 0) * (YY < 560)


def pelo_de_alrededor(capa, dentro, sigma=10):
    """Color medio de la capa (pelo o vestido) en «dentro» (sin mezcla con piel) alrededor de cada píxel."""
    O = lab_de(capa); den = nd.gaussian_filter(dentro.astype(float), sigma)
    return np.stack([nd.gaussian_filter(O[..., i] * dentro, sigma) for i in range(3)], -1) / np.maximum(den, 1e-6)[..., None]


def flecos(capa, lab_base, wb, base):
    """Píxeles del borde de una capa que llevan piel clara «pegada» (parecidos a la piel de debajo)."""
    A = capa[..., 3]; la = lab_de(capa)
    borde = (A > 0) & nd.binary_dilation(A == 0, iterations=8)
    dE = np.sqrt(((la - lab_base) ** 2).sum(-1))
    return np.clip((22 - dE) / 8, 0, 1) * borde * (wb == 1) * (base[..., 3] > 250)


def peso_base(base, lab):
    """1 en la piel de la base; 0 en la ropa de la base; en el borde de la ropa, según cuánto tiene de piel."""
    ropa = MV.ropa_de_la_base(base)
    h = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    w = (base[..., 3] > 0).astype(float); w[ropa] = 0
    borde = nd.binary_dilation(ropa, iterations=3) & ~nd.binary_erosion(ropa, iterations=2)
    w[borde] = np.clip((h[borde] - 38) / 10, 0, 1) * (base[..., 3][borde] > 0)
    return w, ropa


def peso_ojos(capa, lab, lab_base, abiertos=True):
    """Parte de piel de cada píxel de una capa de ojos: 1 en la piel de los párpados, 0 en las pestañas (oscuras) y, en
    el borde de las pestañas, la parte de piel que llevan mezclada (por su luminosidad entre la de la pestaña y la de la
    piel de debajo). Con los ojos abiertos quedan fuera los iris y los blancos. Con los cerrados no hay ni iris ni blancos."""
    L, C = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2])
    YY, XX = np.mgrid[0:capa.shape[0], 0:capa.shape[1]]
    r = np.min([np.hypot(XX - x, YY - y) for x, y in IRIS], axis=0)
    w = np.clip((L - 35) / np.maximum(lab_base[..., 0] - 35, 1), 0, 1)
    if not abiertos:
        return w * (capa[..., 3] > 0)
    w *= np.clip((r - (R_IRIS + 2)) / 2, 0, 1)
    # dentro de la abertura del ojo: el blanco (casi sin color, también su sombreado) NO cambia; el borde rosado del
    # párpado y el lagrimal sí son piel: se separan por el color (más del blanco = menos piel)
    blanco = (C < 14) & (L > 160) & (capa[..., 3] > 0)
    dentro = nd.binary_fill_holes(nd.binary_closing(blanco | (r <= R_IRIS + 1), iterations=3))
    abertura = nd.binary_dilation(dentro, iterations=2)
    umbral = np.full(L.shape, float(BLANCO_C)); umbral[lagrimales(dentro)] = BLANCO_C_LAGRIMAL
    w[abertura] = np.minimum(w[abertura], np.clip((C[abertura] - umbral[abertura]) / 8, 0, 1))
    return w * (capa[..., 3] > 0)


def lagrimales(dentro, ancho=14):
    """Extremo de cada ojo hacia la nariz (lagrimal): ahí el rosa pálido es piel, no blanco."""
    YY, XX = np.mgrid[0:dentro.shape[0], 0:dentro.shape[1]]; z = np.zeros(dentro.shape, bool)
    et, n = nd.label(dentro)
    for i in range(1, n + 1):
        xs = XX[et == i]
        if len(xs) < 500:
            continue
        borde = xs.max() if xs.mean() < 479 else xs.min()
        z |= nd.binary_dilation(et == i, iterations=3) & (np.abs(XX - borde) <= ancho)
    return z


def contorno_ojos(capa):
    """Franja alrededor de la abertura de los ojos (borde de los párpados y lagrimal), en la base y en las capas de ojos."""
    lab = lab_de(capa); L, C = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2])
    YY, XX = np.mgrid[0:capa.shape[0], 0:capa.shape[1]]
    r = np.min([np.hypot(XX - x, YY - y) for x, y in IRIS], axis=0)
    dentro = nd.binary_fill_holes(nd.binary_closing(((C < 14) & (L > 160) & (capa[..., 3] > 0)) | (r <= R_IRIS + 1), iterations=3))
    return nd.binary_dilation(dentro, iterations=7)


def aplicar(capa, lab, w, f, q=None):
    nuevo = lab * (1 - w[..., None]) + f(lab, q) * w[..., None]
    o = capa.copy(); m = w > 0; o[m, :3] = a_rgb(nuevo)[m]
    return o


def montar_rgba(capas):
    x = Image.new('RGBA', (948, 1659), (0, 0, 0, 0))
    for c in capas:
        x.alpha_composite(Image.fromarray(c))
    return np.array(x)


def montar(capas):
    x = Image.new('RGBA', (948, 1659), (0, 0, 0, 0))
    for c in capas:
        x.alpha_composite(Image.fromarray(c))
    bg = Image.new('RGBA', x.size, (255, 250, 245, 255)); bg.alpha_composite(x)
    return bg.convert('RGB')


if __name__ == '__main__':
    todas = [REF, SIN_OJOS, CERRADOS, MANOS] + list(OJOS.values()) + list(SIN_PIEL.values()) + [CJ.AQUI / f'cejas-{k}.png' for k in CP.RECUADROS]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in todas}
    medidas, _ = medir_lamina()
    base = abrir(SIN_OJOS); lab = lab_de(base); wb, ropa = peso_base(base, lab)
    D = CJ.preparar(); hay, wc, pura, pz = D['hay'], D['w'], D['pura'], D['pz']
    wb[hay] = 0                                                       # las cejas se tratan aparte
    manos = abrir(MANOS); assert (np.abs(manos[..., :3].astype(int) - base[..., :3])[manos[..., 3] > 0].max() <= 0), 'las manos no son píxeles de la base'
    ojos = {k: abrir(p) for k, p in OJOS.items()}; cerr = abrir(CERRADOS)
    w_ab = peso_ojos(ojos['marron'], lab_de(ojos['marron']), lab); w_ce = peso_ojos(cerr, lab_de(cerr), lab, abiertos=False)
    capas_pelo = [abrir(CP.DETRAS), abrir(CP.DELANTE)]; ref_pelo = MK.lab_de(Image.open(CP.REF).convert('RGBA')).astype(float)
    color_ceja = {k: CJ.color_cejas(k, pura[hay], capas_pelo, ref_pelo) for k in CP.RECUADROS}
    fijas = {k: abrir(p) for k, p in SIN_PIEL.items()}
    w_fl = {k: flecos(fijas[k], lab, wb, base) for k in ('vestido', 'zapatos')}
    encima = (fijas['vestido'][..., 3] > 0) | (fijas['zapatos'][..., 3] > 0)
    contorno = nd.gaussian_filter(contorno_ojos(ojos['marron']).astype(float), 2)
    pelos_delante = {'castano': fijas['pelo-delante'], **{k: abrir(CP.AQUI / f'pelo-delante-{k}.png') for k in CP.RECUADROS}}
    pelos_detras = {'castano': fijas['pelo-detras'], **{k: abrir(CP.AQUI / f'pelo-detras-{k}.png') for k in CP.RECUADROS}}
    cuero = cuero_cabelludo(base, fijas['pelo-delante'], fijas['pelo-detras'])
    # bordes de los dos pelos junto a la piel que se ve (frente, sienes, orejas, mandíbula, cuello)
    V = piel_visible(base, wb, fijas['pelo-delante'], encima, cuero)
    S_alr, denS = piel_de_alrededor(lab, V)
    borde_pelo = {k: separar_borde(fijas[f'pelo-{k}'], V, S_alr, denS, encima) for k in ('delante', 'detras')}
    # borde del vestido (cuello y mangas) junto a la piel: mezcla del color del vestido de justo dentro (4–7 px) y la piel
    Vv = piel_visible(base, wb, fijas['pelo-delante'], fijas['zapatos'][..., 3] > 0, cuero) & (fijas['vestido'][..., 3] == 0)
    S_v, denSv = piel_de_alrededor(lab, Vv)
    borde_vestido = separar_borde(fijas['vestido'], Vv, S_v, denSv, fijas['zapatos'][..., 3] > 0, cerca=5.0, interior=(4, 7))
    w_fl['pelo'] = np.maximum(borde_pelo['delante'][1], borde_pelo['detras'][1] * (base[..., 3] < 250))
    info = dict(lamina={k: {x: v[x] for x in ('L_percentiles', 'tono', 'croma', 'px')} for k, v in medidas.items()}, tonos={})
    vacia = np.zeros_like(base)
    resultados = {'claro': dict(base=base, cerrados=cerr, manos=manos, **{f'ojos-{k}': v for k, v in ojos.items()},
                                **{f'bordes-{k}': vacia for k in ('pelo-castano', 'zapatos', 'vestido')})}
    for t in TONOS:
        f, par = transformacion(medidas, t)
        carpeta = AQUI / t; carpeta.mkdir(exist_ok=True)
        qmap = 1 - (1 - par['claros_en_contorno_de_ojos']) * contorno      # corrección localizada del contorno de los ojos
        nb = lab * (1 - wb[..., None]) + f(lab, qmap) * wb[..., None]
        ww = wc[hay][:, None]; nb[hay] = ww * pura[hay] + (1 - ww) * f(pz[hay])   # cejas: la misma ceja sobre la piel nueva
        b2 = base.copy(); m = (wb > 0) | hay; b2[m, :3] = a_rgb(nb)[m]
        m2 = manos.copy(); sel = manos[..., 3] > 0; m2[sel, :3] = b2[sel, :3]
        o2 = {k: aplicar(v, lab_de(v), w_ab, f, qmap) for k, v in ojos.items()}
        c2 = aplicar(cerr, lab_de(cerr), w_ce, f, qmap)
        Image.fromarray(b2).save(carpeta / 'base-sin-ojos.png', optimize=True)
        Image.fromarray(m2).save(carpeta / 'manos-delante.png', optimize=True)
        Image.fromarray(c2).save(carpeta / 'ojos-cerrados.png', optimize=True)
        for k, v in o2.items():
            Image.fromarray(v).save(carpeta / f'ojos-abiertos-{k}.png', optimize=True)
        # cejas a juego, recalculadas sobre la piel nueva
        lb2 = lab_de(b2)
        for k in CP.RECUADROS:
            nl = lb2.copy(); nl[hay] = ww * color_ceja[k] + (1 - ww) * f(pz[hay])
            Image.fromarray(CJ.capa_sobre(b2, CP.lab_a_rgb(nl).astype(float), hay)).save(carpeta / f'cejas-{k}.png', optimize=True)
        # bordes con piel clara pegada: pelo de delante (por color de pelo) y vestido + zapatos
        for nombre, capa_o, variantes_capa in (('pelo', fijas['pelo-delante'], pelos_delante), ('ropa', None, None)):
            if nombre == 'pelo':
                fS = f(S_alr)
                for kp, cap in variantes_capa.items():
                    det = pelos_detras[kp]; capas_k = {'delante': cap, 'detras': det}; corregidas = {}
                    for parte, c in capas_k.items():
                        s, tau, dentro = borde_pelo[parte]
                        if parte == 'detras':
                            tau = tau * (base[..., 3] < 250)          # el de detrás solo se ve fuera de la silueta de la base
                        lk = lab_de(c)   # parte de piel → piel nueva; parte de pelo → el pelo de alrededor, en su color aprobado
                        objetivo = s[..., None] * fS + (1 - s[..., None]) * pelo_de_alrededor(c, dentro)
                        nueva = c.copy(); sl = tau > 0
                        nueva[sl, :3] = a_rgb(lk * (1 - tau[..., None]) + objetivo * tau[..., None])[sl]
                        corregidas[parte] = (nueva, tau)
                    actual = montar_rgba([det, b2, cap]); obj = montar_rgba([corregidas['detras'][0], b2, corregidas['delante'][0]])
                    # franja del cuero cabelludo en el borde de la cabeza: se cubre con el pelo de detrás de alrededor
                    Hb = CP.lab_a_rgb(pelo_de_alrededor(det, det[..., 3] == 255)).astype(float)
                    o3 = obj[..., :3].astype(float) * (1 - cuero[..., None]) + Hb * cuero[..., None]
                    selc = ((corregidas['delante'][1] > 0) | (corregidas['detras'][1] > 0) | (cuero > 0)) & (actual[..., 3] >= 250)
                    Image.fromarray(CJ.capa_sobre(actual, o3, selc)).save(carpeta / f'bordes-pelo-{kp}.png', optimize=True)
            else:
                # zapatos (encima de la base) y vestido (encima de base + zapatos): cada uno, su capa de bordes
                actual = Image.fromarray(b2)
                for kc in ('zapatos', 'vestido'):
                    cap = fijas[kc]; des = cap.copy()
                    if kc == 'vestido':
                        s, wf, dentro = borde_vestido; sel = wf > 0; lk = lab_de(cap)
                        objetivo = s[..., None] * f(S_v) + (1 - s[..., None]) * pelo_de_alrededor(cap, dentro, 4)
                        des[sel, :3] = a_rgb(lk * (1 - wf[..., None]) + objetivo * wf[..., None])[sel]
                    else:
                        wf = w_fl[kc]; sel = wf > 0
                        des[sel, :3] = a_rgb(lab_de(cap) * (1 - wf[..., None]) + f(lab_de(cap)) * wf[..., None])[sel]
                    obj = actual.copy(); obj.alpha_composite(Image.fromarray(des))
                    actual.alpha_composite(Image.fromarray(cap))
                    Image.fromarray(CJ.capa_sobre(np.array(actual), np.array(obj)[..., :3].astype(float), sel)).save(carpeta / f'bordes-{kc}.png', optimize=True)
        # comprobaciones
        cara = np.zeros(wb.shape, bool); cara[220:330, 420:540] = True       # frente
        lp = lb2[..., 0][cara & (wb == 1)]
        det = lambda a, b, mm: round(float(np.corrcoef((a - nd.gaussian_filter(a, 3))[mm], (b - nd.gaussian_filter(b, 3))[mm])[0, 1]), 3)
        piel1 = (wb == 1) & nd.binary_erosion(base[..., 3] > 250, iterations=2)
        iris_igual = all(bool((o2[k][..., :3][w_ab == 0] == ojos[k][..., :3][w_ab == 0]).all()) for k in ojos)
        lo_ab = lab_de(ojos['marron']); C_ab = np.hypot(lo_ab[..., 1], lo_ab[..., 2])
        blancos = (C_ab < BLANCO_C) & (lo_ab[..., 0] > 160) & (ojos['marron'][..., 3] > 0)
        lag = lagrimales(nd.binary_fill_holes(nd.binary_closing(blancos | (np.min([np.hypot(np.mgrid[0:1659, 0:948][1] - x, np.mgrid[0:1659, 0:948][0] - y) for x, y in IRIS], axis=0) <= R_IRIS + 1), iterations=3)))
        cambio_blancos = (o2['marron'][..., :3] != ojos['marron'][..., :3]).any(-1) & blancos
        info['tonos'][t] = dict(**par,
                                frente_L_mediana=round(float(np.median(lp)), 1), lamina_L_mediana=round(medidas[t]['L'], 1),
                                frente_L_original=round(float(np.median(lab[..., 0][cara & (wb == 1)])), 1), lamina_claro_L=round(medidas['claro']['L'], 1),
                                ropa_de_la_base_igual=bool((b2[ropa] == base[ropa]).all()),
                                alfa_identico=all(bool((a[..., 3] == b[..., 3]).all()) for a, b in [(b2, base), (m2, manos), (c2, cerr)] + [(o2[k], ojos[k]) for k in ojos]),
                                ojos_fuera_de_la_piel_igual=iris_igual,
                                blancos_cambiados_fuera_del_lagrimal_px=int((cambio_blancos & ~lag).sum()), blancos_px=int(blancos.sum()),
                                lagrimal_rosado_cambiado_px=int((cambio_blancos & lag).sum()), cerrados_fuera_de_la_piel_igual=bool((c2[w_ce == 0] == cerr[w_ce == 0]).all()),
                                px_piel_ojos_abiertos=int((w_ab > 0).sum()), px_piel_ojos_cerrados=int((w_ce > 0).sum()),
                                detalle_piel_correlacion=det(lab[..., 0], lb2[..., 0], piel1),
                                ceja_nucleo_cambio_medio=round(float(np.abs(lb2[wc > 0.8] - lab[wc > 0.8]).mean()), 1))
        resultados[t] = dict(base=b2, cerrados=c2, manos=m2, **{f'ojos-{k}': v for k, v in o2.items()},
                             **{f'bordes-{k}': abrir(carpeta / f'bordes-{k}.png') for k in ('pelo-castano', 'zapatos', 'vestido')})
        info['tonos'][t]['px_bordes'] = {k: int((resultados[t][f'bordes-{k}'][..., 3] > 0).sum()) for k in ('pelo-castano', 'zapatos', 'vestido')}
        dV = nd.distance_transform_edt(~V)
        info['tonos'][t]['pelo_tocado_a_mas_de_12px_de_la_piel_px'] = {kp: int(((abrir(carpeta / f'bordes-pelo-{kp}.png')[..., 3] > 0) & (dV > 12) & (cuero == 0)).sum()) for kp in pelos_delante}
    # parches: en el montaje, junto a los ojos y en el borde de las manos, la piel no debe quedar del tono anterior
    for t in TONOS:
        r = resultados[t]; mo = np.array(montar([fijas['pelo-detras'], r['base'], r['ojos-marron'], fijas['zapatos'], r['bordes-zapatos'], fijas['vestido'], r['bordes-vestido'], r['manos'], fijas['pelo-delante'], r['bordes-pelo-castano']])).astype(float)
        mc = np.array(montar([fijas['pelo-detras'], r['base'], r['cerrados'], fijas['zapatos'], r['bordes-zapatos'], fijas['vestido'], r['bordes-vestido'], r['manos'], fijas['pelo-delante'], r['bordes-pelo-castano']])).astype(float)
        lo, lc = MK.lab_de(Image.fromarray(mo.astype(np.uint8))).astype(float), MK.lab_de(Image.fromarray(mc.astype(np.uint8))).astype(float)
        anillo = nd.binary_dilation(w_ab > 0.5, iterations=6) & ~nd.binary_dilation(w_ab > 0, iterations=1) & (wb == 1)
        dentro = (w_ab > 0.9)
        info['tonos'][t]['borde_ojos_L_piel_capa_vs_base'] = [round(float(np.median(lo[..., 0][dentro])), 1), round(float(np.median(lo[..., 0][anillo])), 1)]
        dc = (w_ce > 0.9); anc = nd.binary_dilation(w_ce > 0.5, iterations=6) & ~nd.binary_dilation(w_ce > 0, iterations=1) & (wb == 1)
        info['tonos'][t]['parpados_cerrados_L_capa_vs_base'] = [round(float(np.median(lc[..., 0][dc])), 1), round(float(np.median(lc[..., 0][anc])), 1)]
    comp = dict(metodo='solo la piel de nuestras piezas; tono medido en la lámina (mismos sitios en los 4 recuadros); '
                       'L desplazada y escalada, tono girado y saturación escalada; alfa intacto; ropa, pelo, ojos (iris, blancos, pestañas) y adornos sin cambios',
                **info, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # vistas
    orden = ['claro'] + TONOS
    for nombre, caja, esc, ojo in (('comparacion-piel-entera.png', (20, 20, 928, 1640), 0.36, 'ojos-marron'), ('comparacion-piel-cara.png', (200, 150, 760, 640), 0.7, 'ojos-marron'),
                                   ('comparacion-piel-parpadeo.png', (280, 330, 680, 560), 1.0, 'cerrados')):
        tiles = []
        for t in orden:
            r = resultados[t]
            im = montar([fijas['pelo-detras'], r['base'], r[ojo], fijas['zapatos'], r['bordes-zapatos'], fijas['vestido'], r['bordes-vestido'], r['manos'], fijas['pelo-delante'], r['bordes-pelo-castano'], fijas['corona']])
            tiles.append(im.crop(caja).resize((round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)), Image.LANCZOS))
        w, h = tiles[0].size; out = Image.new('RGB', (len(tiles) * (w + 8), h + 32), 'white'); d = ImageDraw.Draw(out)
        for i, (t, im) in enumerate(zip(orden, tiles)):
            out.paste(im, (i * (w + 8), 30)); d.text((i * (w + 8) + 4, 6), NOMBRES[t], font=MK.F(18), fill=(40, 40, 60))
        out.save(AQUI / nombre, optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
