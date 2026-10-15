#!/usr/bin/env python3
"""
PROPUESTA · pelo B: redistribuir el pelo existente entre delante y detrás en hombros y pecho.

Problema: la capa de delante del pelo B se recortó siguiendo la silueta de la base (la camiseta). Sobre el vestido,
cuyas mangas abullonadas sobresalen de esa silueta, los rizos acaban en un corte diagonal y su continuación queda
detrás del vestido: parecen pegados encima.

Método (solo redistribuye: no dibuja, no rellena huecos, no mueve, escala ni recolorea ningún píxel):
  1. Pelo completo = pelo B detrás + pelo B delante (las mismas imágenes, sin cambios).
  2. En hombros, pecho y brazos (y 560–1060) el pelo se divide en RIZOS por sus sombras naturales (cuencas de
     luminosidad: cada rizo es una zona clara rodeada de sombras oscuras).
  3. Un rizo que ya estaba al menos en un 5 % delante, contando la parte que cae sobre el cuerpo o el vestido, pasa
     ENTERO delante. Así el borde de la capa sigue el contorno del rizo y no la silueta de la camiseta. Nada de lo
     que ya estaba delante pasa detrás, de modo que el volumen visible de la melena no disminuye.
  4. Excepciones: el pelo reconstruido de detrás del cuello (sombra, véase ../../zonas-revisadas.png) sigue detrás,
     y no se pone pelo delante sobre la cara, las orejas o el cuello que se ven (como hasta ahora).
  5. La capa de detrás no cambia (lo que pasa delante sigue también detrás, oculto).

Dos propuestas:
  A · solo los pasos 1–5. Junto al escote quedan delante unos trozos de sombra oscura cuyo borde de arriba es un CORTE
      de la imagen original (allí estaban el cuello y el jersey de la referencia): parecen pegados. En A, ese borde es
      «falta pelo» (falta-pelo-ilustrar.png): habría que ilustrar el pelo que pasa por delante del hombro.
  B · A + esos rizos de sombra junto al escote (zona CUELLO_HOMBROS, oscuros, sobre el vestido) pasan DETRÁS enteros,
      por sus límites de sombra; los restos sueltos de menos de 80 px de esa zona, también. El rizo de debajo sale
      entonces por detrás de la manga. No hace falta ilustrar nada.
La cara, el volumen y la forma de la melena, el vestido, la base y los ojos no cambian.

Uso (desde la raíz):
  python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/revision-localizada/variante-experimental/redistribucion-hombros/redistribuir_pelo.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.feature import peak_local_max
from skimage.segmentation import watershed, find_boundaries

AQUI = Path(__file__).resolve().parent; VAR = AQUI.parent; REV = VAR.parent; RAIZ = AQUI.parents[6]
VES = RAIZ / 'docs' / 'propuestas' / 'vestido-rosa-2026-10-15'
sys.path[:0] = [str(VES / 'montaje')]
import montaje_vestido as MV   # noqa: E402

R = MV.R; H, W, YY, XX = MV.H, MV.W, MV.YY, MV.XX
CLARO, OSCURO = MV.CLARO, MV.OSCURO
ZONA = (150, 560, 800, 1060)                      # x0, y0, x1, y1: hombros, pecho y brazos
UMBRAL = 0.05                                     # parte mínima del rizo (sobre el cuerpo) que ya estaba delante
CUELLO_HOMBROS = [(318, 625, 405, 700), (552, 630, 645, 705)]   # junto al escote, donde la referencia tenía cuello y jersey


def rizos(full, zona):
    pelo = full[..., 3] > 100
    L = R.lab_rgba(full)[..., 0]; Ls = nd.gaussian_filter(np.where(pelo, L, 0), 2.0)
    m = pelo & zona
    pk = peak_local_max(np.where(m, Ls, 0), min_distance=10, threshold_abs=60, labels=m.astype(int))
    mk = np.zeros(L.shape, int); mk[tuple(pk.T)] = np.arange(1, len(pk) + 1)
    return watershed(-Ls, mk, mask=m), pelo


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    rutas = dict(pelo_detras=VAR / 'pelo-variante-sin-mechon-detras.png', pelo_delante=VAR / 'pelo-variante-sin-mechon-delante.png',
                 reconstruido=REV / 'mascara-zonas-reconstruidas.png', base=MV.BASE / 'base-transparencia-corregida.png',
                 sin_ojos=MV.BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
                 abiertos=MV.BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
                 cerrados=MV.BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png',
                 vestido=VES / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png', brazos=VES / 'montaje' / 'brazos-delante-copiados-de-la-base.png')
    antes = {k: sha(p) for k, p in rutas.items()}
    det, dela, base, sin, ab, ce, ves, brazos = (MV.abrir(rutas[k]) for k in
        ('pelo_detras', 'pelo_delante', 'base', 'sin_ojos', 'abiertos', 'cerrados', 'vestido', 'brazos'))
    reco = nd.binary_dilation(np.array(Image.open(rutas['reconstruido'])) > 0, iterations=2)
    full = R.MP.comp(det, dela)
    x0, y0, x1, y1 = ZONA; zona = (XX >= x0) & (XX < x1) & (YY >= y0) & (YY < y1)
    reg, pelo = rizos(full, zona)
    delante = dela[..., 3] > 0
    cuerpo = (base[..., 3] > 0) | (ves[..., 3] > 0)
    Z = R.zonas(base[..., 3]); cara = nd.binary_dilation(Z['cara_baja'], iterations=6) & ~(ves[..., 3] > 200)
    pasan = np.zeros((H, W), bool); n_rizos = 0
    for i in range(1, reg.max() + 1):
        r = reg == i; rc = r & cuerpo
        if rc.sum() < 30:
            continue
        if (r & delante).sum() / rc.sum() >= UMBRAL:
            pasan |= r; n_rizos += 1
    nuevo = delante | (pasan & ~reco & ~cara & pelo)
    anadido = nuevo & ~delante
    dela2 = full.copy(); dela2[~nuevo] = 0
    dela2[delante] = dela[delante]                                      # lo que ya estaba delante, idéntico
    Image.fromarray(dela2, 'RGBA').save(AQUI / 'pelo-delante-redistribuido.png', optimize=True)
    # --- propuesta B: los rizos de sombra junto al escote, detrás --------------------------------------------
    Lf = R.lab_rgba(full)[..., 0]
    cerca_b = np.zeros((H, W), bool)
    for a, b, c, d in CUELLO_HOMBROS:
        cerca_b[b:d, a:c] = True
    atras = np.zeros((H, W), bool); rizos_atras = []
    for i in range(1, reg.max() + 1):
        r = reg == i; cy, cx = np.argwhere(r).mean(0).astype(int)
        if cerca_b[cy, cx] and Lf[r].mean() < 75 and (ves[..., 3] > 200)[r].mean() > 0.5:
            atras |= r; rizos_atras.append(dict(rizo=i, px=int(r.sum()), centro=[int(cx), int(cy)], luminosidad_media=round(float(Lf[r].mean()))))
    dela_b = dela2.copy(); dela_b[atras] = 0
    q = (dela_b[..., 3] > 0) & cerca_b; lbq, nq = nd.label(q, np.ones((3, 3))); szq = nd.sum(q, lbq, range(1, nq + 1))
    restos = np.isin(lbq, 1 + np.flatnonzero(szq < 80)); dela_b[restos] = 0
    Image.fromarray(dela_b, 'RGBA').save(AQUI / 'pelo-delante-redistribuido-b.png', optimize=True)

    # --- falta pelo: bordes del pelo de delante sobre el vestido, junto al escote (cortes de la referencia) ----
    borde = nuevo & ~nd.binary_erosion(nuevo, iterations=1)
    cerca = np.zeros((H, W), bool)
    for a, b, c, d in CUELLO_HOMBROS:
        cerca[b:d, a:c] = True
    sobre_vestido = nd.binary_dilation(borde, iterations=1) & ~nuevo & (ves[..., 3] > 200)
    falta = nd.binary_dilation(sobre_vestido & cerca, iterations=4) & ~nuevo & (ves[..., 3] > 200) & cerca
    Image.fromarray((falta * 255).astype(np.uint8), 'L').save(AQUI / 'mascara-falta-pelo.png', optimize=True)

    # --- montajes y vistas -------------------------------------------------------------------------------------
    m = {('vestido', 'antes'): MV.montar([det, sin, ab, ves, brazos, dela]), ('vestido', 'despues'): MV.montar([det, sin, ab, ves, brazos, dela2]),
         ('vestido', 'b'): MV.montar([det, sin, ab, ves, brazos, dela_b]),
         ('camiseta', 'antes'): MV.montar([det, sin, ab, dela]), ('camiseta', 'despues'): MV.montar([det, sin, ab, dela2]),
         ('camiseta', 'b'): MV.montar([det, sin, ab, dela_b])}
    Image.fromarray(m[('vestido', 'b')], 'RGBA').save(AQUI / 'montaje-vestido-pelo-redistribuido-b.png', optimize=True)
    Image.fromarray(m[('vestido', 'despues')], 'RGBA').save(AQUI / 'montaje-vestido-pelo-redistribuido.png', optimize=True)
    Image.fromarray(MV.montar([det, sin, ce, ves, brazos, dela2]), 'RGBA').save(AQUI / 'montaje-vestido-pelo-redistribuido-cerrados.png', optimize=True)
    F = R.MK.F
    caja = (150, 520, 800, 1080)
    pan = [('Vestido · antes', R.MP.blanco(m[('vestido', 'antes')])), ('Vestido · propuesta A', R.MP.blanco(m[('vestido', 'despues')])),
           ('Vestido · propuesta B', R.MP.blanco(m[('vestido', 'b')])),
           ('Camiseta · antes', R.MP.blanco(m[('camiseta', 'antes')])), ('Camiseta · propuesta A', R.MP.blanco(m[('camiseta', 'despues')])),
           ('Camiseta · propuesta B', R.MP.blanco(m[('camiseta', 'b')]))]
    ps = [p.crop(caja) for _, p in pan]
    fr = Image.new('RGB', (3 * 660, 2 * 590), 'white'); d = ImageDraw.Draw(fr)
    for i, ((t, _), p) in enumerate(zip(pan, ps)):
        x, y = (i % 3) * 660, (i // 3) * 590
        fr.paste(p, (x, y + 28)); d.text((x + 4, y + 6), t, font=F(18), fill=(40, 40, 60))
    fr.save(AQUI / 'comparacion-antes-despues.png', optimize=True)
    # ampliaciones ×2 de cada hombro
    filas = []
    for t, cz in (('Hombro y pecho izquierdo', (230, 600, 440, 860)), ('Hombro y pecho derecho', (520, 600, 730, 860))):
        a1 = pan[0][1].crop(cz).resize(((cz[2] - cz[0]) * 2, (cz[3] - cz[1]) * 2), Image.LANCZOS)
        a2 = pan[1][1].crop(cz).resize(a1.size, Image.LANCZOS); a3 = pan[2][1].crop(cz).resize(a1.size, Image.LANCZOS)
        f = Image.new('RGB', (3 * a1.width + 20, a1.height + 26), 'white'); dd = ImageDraw.Draw(f)
        for j, (tt, im_) in enumerate(((f'{t} · antes ×2', a1), ('propuesta A ×2', a2), ('propuesta B ×2', a3))):
            f.paste(im_, (j * (a1.width + 10), 24)); dd.text((j * (a1.width + 10) + 2, 4), tt, font=F(15), fill=(40, 40, 60))
        filas.append(f)
    out = Image.new('RGB', (filas[0].width, sum(f.height + 8 for f in filas)), 'white'); y = 0
    for f in filas:
        out.paste(f, (0, y)); y += f.height + 8
    out.save(AQUI / 'ampliacion-hombros-antes-despues.png', optimize=True)
    # qué ha pasado delante (verde), rizos (amarillo) y dónde falta pelo (rojo)
    o = np.array(R.MP.blanco(m[('vestido', 'despues')])).astype(float)
    o[anadido] = o[anadido] * 0.45 + np.array([0, 200, 0]) * 0.55
    o[find_boundaries(reg) & pelo & zona] = (255, 220, 0)
    o[falta] = o[falta] * 0.2 + np.array([230, 20, 20]) * 0.8
    im = Image.fromarray(o.astype(np.uint8)); dm = ImageDraw.Draw(im)
    for i, (col, t) in enumerate((((0, 200, 0), 'pasa delante (pelo que ya existía, entero por rizos)'), ((255, 220, 0), 'límites de los rizos (sombras)'),
                                  ((230, 20, 20), 'falta pelo: corte de la imagen original junto al escote (ilustrar)'))):
        dm.rectangle((160, 530 + 24 * i, 176, 546 + 24 * i), fill=col); dm.text((182, 530 + 24 * i), t, font=F(15), fill=(40, 40, 60))
    im.crop(caja).save(AQUI / 'mapa-redistribucion.png', optimize=True)
    fz = np.array(R.MP.blanco(m[('vestido', 'despues')])); fz2 = fz.copy(); fz2[falta] = (230, 20, 20)
    zz = [Image.fromarray(np.hstack([fz[b:d, a:c], fz2[b:d, a:c]])).resize(((c - a) * 2 * 4, (d - b) * 4), Image.NEAREST) for a, b, c, d in CUELLO_HOMBROS]
    fz_img = Image.new('RGB', (max(z.width for z in zz), sum(z.height + 30 for z in zz)), 'white'); dz = ImageDraw.Draw(fz_img); y = 0
    for t, z in zip(('Propuesta A · junto al escote, izquierda ×4', 'Propuesta A · junto al escote, derecha ×4'), zz):
        dz.text((4, y + 6), t + ' · rojo: falta pelo (ilustrar)', font=F(16), fill=(40, 40, 60)); fz_img.paste(z, (0, y + 28)); y += z.height + 30
    fz_img.save(AQUI / 'falta-pelo-ilustrar.png', optimize=True)

    # --- comprobaciones ------------------------------------------------------------------------------------------
    cara_op = Z['cara_baja'] & (base[..., 3] == 255) & ~(ves[..., 3] > 200)
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes, umbral=UMBRAL, rizos_en_la_zona=int(reg.max()), rizos_que_pasan_delante=n_rizos,
                px_que_pasan_delante=int(anadido.sum()), px_que_pasan_detras=0,
                delante_anterior_identico=bool((dela2[delante] == dela[delante]).all()),
                colores_identicos_al_pelo_existente=bool((dela2[anadido] == full[anadido]).all()),
                pelo_delante_sobre_cara_orejas_cuello_visibles_px=int(((dela2[..., 3] > 0) & cara_op).sum()),
                pelo_visible_igual_o_mayor=bool(((m[('vestido', 'despues')][..., 3] >= m[('vestido', 'antes')][..., 3])).all()),
                falta_pelo_px_en_A=int(falta.sum()), capa_de_detras='sin cambios',
                propuesta_B=dict(rizos_de_sombra_que_pasan_detras=rizos_atras, restos_quitados_px=int(restos.sum()),
                                 px_delante_que_pasan_detras=int(((dela[..., 3] > 0) & (dela_b[..., 3] == 0)).sum()),
                                 pelo_delante_sobre_cara_orejas_cuello_visibles_px=int(((dela_b[..., 3] > 0) & cara_op).sum()),
                                 falta_pelo_px=0))
    comp['fuentes_sin_cambios'] = antes == {k: sha(p) for k, p in rutas.items()}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
