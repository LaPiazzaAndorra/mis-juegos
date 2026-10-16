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
    pecas, nariz, orejas) se conserva, girada con el tono y proporcional a la luminosidad de la piel nueva (en una piel
    más oscura la misma diferencia de color se ve más fuerte; así el rubor, los labios y las orejas no se enrojecen);
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
  · bordes de otras capas con piel clara «pegada» (solo donde debajo se ve la piel de la base, no el vestido) (el nacimiento del pelo de delante, el cuello del vestido y el borde
    de los zapatos): una capa pequeña de «bordes» por tono (y por color de pelo) que pone encima solo esos píxeles con
    la piel nueva. Las capas de pelo, vestido y zapatos no cambian;
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
    for k, (x0, y0) in RECUADROS.items():
        px = lab[y0:y0 + H, x0:x0 + W][piel]; a, b = np.median(px[:, 1]), np.median(px[:, 2])
        q = np.percentile(px[:, 0], [5, 25, 50, 75, 95])
        out[k] = dict(L=float(q[2]), iqr=float(q[3] - q[1]), tono=float(np.degrees(np.arctan2(b, a))), croma=float(np.hypot(a, b)),
                      L_percentiles=[round(float(x)) for x in q], px=int(piel.sum()))
    return out, piel


def transformacion(m, tono):
    c, t = m['claro'], m[tono]
    s = t['iqr'] / c['iqr']; giro = np.radians(t['tono'] - c['tono'])
    ac, bc = c['croma'] * np.cos(np.radians(c['tono'])), c['croma'] * np.sin(np.radians(c['tono']))
    at, bt = t['croma'] * np.cos(np.radians(t['tono'])), t['croma'] * np.sin(np.radians(t['tono']))
    cg, sg = np.cos(giro) * t['L'] / c['L'], np.sin(giro) * t['L'] / c['L']   # en piel más oscura, la misma diferencia se ve más fuerte

    def f(lab):
        L, da, db = lab[..., 0], lab[..., 1] - ac, lab[..., 2] - bc
        return np.stack([t['L'] + (L - c['L']) * s, at + da * cg - db * sg, bt + da * sg + db * cg], -1)
    return f, dict(dispersion=round(s, 3), giro_tono=round(float(np.degrees(giro)), 1), croma_claro=round(c['croma'], 1), croma_tono=round(t['croma'], 1))


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


def flecos_pelo(capa, lab_base, wb, base, encima, L_pelo=80.0, ancho=10.0):
    """Nacimiento del pelo de delante: borde opaco en el que el pelo ya lleva mezclada piel clara. Para cada píxel, la
    parte de piel que tiene (por su luminosidad entre la del pelo y la de la piel de debajo), menguando hacia dentro."""
    A = capa[..., 3]; la = lab_de(capa)
    dist = nd.distance_transform_edt(A > 0)
    s = np.clip((la[..., 0] - L_pelo) / np.maximum(lab_base[..., 0] - L_pelo, 1), 0, 1) * np.clip(1 - (dist - 1) / ancho, 0, 1)
    return s * (A > 0) * (wb == 1) * (base[..., 3] > 250) * ~encima


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
    # el blanco del ojo (poco color, claro) y lo que encierra quedan fuera; en su borde (mezcla de blanco y piel), la
    # parte de piel que lleva, por su color (el blanco casi no tiene)
    blanco = (C < 14) & (L > 160) & (capa[..., 3] > 0)
    dentro = nd.binary_fill_holes(nd.binary_closing(blanco | (r <= R_IRIS + 1), iterations=3))
    nucleo = nd.binary_erosion(dentro, iterations=1)
    borde = nd.binary_dilation(dentro, iterations=2) & ~nucleo & (r > R_IRIS + 2)
    Cb = np.hypot(lab_base[..., 1], lab_base[..., 2])
    w[borde] = np.minimum(w[borde], np.clip((C[borde] - 6) / np.maximum(Cb[borde] - 6, 1), 0, 1))
    w[nucleo] = 0
    return w * (capa[..., 3] > 0)


def aplicar(capa, lab, w, f):
    nuevo = lab * (1 - w[..., None]) + f(lab) * w[..., None]
    o = capa.copy(); m = w > 0; o[m, :3] = a_rgb(nuevo)[m]
    return o


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
    w_fl = {k: flecos(fijas[k], lab, wb, base) for k in ('vestido', 'zapatos')}; w_fl['pelo'] = flecos_pelo(fijas['pelo-delante'], lab, wb, base,
                             encima=(fijas['vestido'][..., 3] > 0) | (fijas['zapatos'][..., 3] > 0))   # solo donde se ve la piel de la base
    pelos_delante = {'castano': fijas['pelo-delante'], **{k: abrir(CP.AQUI / f'pelo-delante-{k}.png') for k in CP.RECUADROS}}
    info = dict(lamina={k: {x: v[x] for x in ('L_percentiles', 'tono', 'croma', 'px')} for k, v in medidas.items()}, tonos={})
    vacia = np.zeros_like(base)
    resultados = {'claro': dict(base=base, cerrados=cerr, manos=manos, **{f'ojos-{k}': v for k, v in ojos.items()},
                                **{f'bordes-{k}': vacia for k in ('pelo-castano', 'zapatos', 'vestido')})}
    for t in TONOS:
        f, par = transformacion(medidas, t)
        carpeta = AQUI / t; carpeta.mkdir(exist_ok=True)
        nb = lab * (1 - wb[..., None]) + f(lab) * wb[..., None]
        ww = wc[hay][:, None]; nb[hay] = ww * pura[hay] + (1 - ww) * f(pz[hay])   # cejas: la misma ceja sobre la piel nueva
        b2 = base.copy(); m = (wb > 0) | hay; b2[m, :3] = a_rgb(nb)[m]
        m2 = manos.copy(); sel = manos[..., 3] > 0; m2[sel, :3] = b2[sel, :3]
        o2 = {k: aplicar(v, lab_de(v), w_ab, f) for k, v in ojos.items()}
        c2 = aplicar(cerr, lab_de(cerr), w_ce, f)
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
                wf = w_fl['pelo']
                for kp, cap in variantes_capa.items():
                    debajo = Image.fromarray(b2); actual = debajo.copy(); actual.alpha_composite(Image.fromarray(cap))
                    deseada = cap.copy(); sel = wf > 0
                    lk = lab_de(cap)   # se le suma su parte de piel × el cambio de la piel de debajo
                    deseada[sel, :3] = a_rgb(lk + wf[..., None] * (f(lab) - lab))[sel]
                    obj = debajo.copy(); obj.alpha_composite(Image.fromarray(deseada))
                    Image.fromarray(CJ.capa_sobre(np.array(actual), np.array(obj)[..., :3].astype(float), sel)).save(carpeta / f'bordes-pelo-{kp}.png', optimize=True)
            else:
                # zapatos (encima de la base) y vestido (encima de base + zapatos): cada uno, su capa de bordes
                actual = Image.fromarray(b2)
                for kc in ('zapatos', 'vestido'):
                    cap = fijas[kc]; wf = w_fl[kc]; sel = wf > 0
                    des = cap.copy(); des[sel, :3] = a_rgb(lab_de(cap) * (1 - wf[..., None]) + f(lab_de(cap)) * wf[..., None])[sel]
                    obj = actual.copy(); obj.alpha_composite(Image.fromarray(des))
                    actual.alpha_composite(Image.fromarray(cap))
                    Image.fromarray(CJ.capa_sobre(np.array(actual), np.array(obj)[..., :3].astype(float), sel)).save(carpeta / f'bordes-{kc}.png', optimize=True)
        # comprobaciones
        cara = np.zeros(wb.shape, bool); cara[220:330, 420:540] = True       # frente
        lp = lb2[..., 0][cara & (wb == 1)]
        det = lambda a, b, mm: round(float(np.corrcoef((a - nd.gaussian_filter(a, 3))[mm], (b - nd.gaussian_filter(b, 3))[mm])[0, 1]), 3)
        piel1 = (wb == 1) & nd.binary_erosion(base[..., 3] > 250, iterations=2)
        iris_igual = all(bool((o2[k][..., :3][w_ab == 0] == ojos[k][..., :3][w_ab == 0]).all()) for k in ojos)
        info['tonos'][t] = dict(**par,
                                frente_L_mediana=round(float(np.median(lp)), 1), lamina_L_mediana=round(medidas[t]['L'], 1),
                                frente_L_original=round(float(np.median(lab[..., 0][cara & (wb == 1)])), 1), lamina_claro_L=round(medidas['claro']['L'], 1),
                                ropa_de_la_base_igual=bool((b2[ropa] == base[ropa]).all()),
                                alfa_identico=all(bool((a[..., 3] == b[..., 3]).all()) for a, b in [(b2, base), (m2, manos), (c2, cerr)] + [(o2[k], ojos[k]) for k in ojos]),
                                ojos_fuera_de_la_piel_igual=iris_igual, cerrados_fuera_de_la_piel_igual=bool((c2[w_ce == 0] == cerr[w_ce == 0]).all()),
                                px_piel_ojos_abiertos=int((w_ab > 0).sum()), px_piel_ojos_cerrados=int((w_ce > 0).sum()),
                                detalle_piel_correlacion=det(lab[..., 0], lb2[..., 0], piel1),
                                ceja_nucleo_cambio_medio=round(float(np.abs(lb2[wc > 0.8] - lab[wc > 0.8]).mean()), 1))
        resultados[t] = dict(base=b2, cerrados=c2, manos=m2, **{f'ojos-{k}': v for k, v in o2.items()},
                             **{f'bordes-{k}': abrir(carpeta / f'bordes-{k}.png') for k in ('pelo-castano', 'zapatos', 'vestido')})
        info['tonos'][t]['px_bordes'] = {k: int((resultados[t][f'bordes-{k}'][..., 3] > 0).sum()) for k in ('pelo-castano', 'zapatos', 'vestido')}
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
