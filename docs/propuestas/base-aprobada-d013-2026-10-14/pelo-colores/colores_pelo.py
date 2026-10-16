#!/usr/bin/env python3
"""
Variantes de color del pelo (D-022): castaño chocolate, rubio miel, castaño oscuro y pelirrojo jengibre, RECOLOREANDO
solo nuestras capas de pelo aprobadas (no se modifican):
  · detrás:  ../pelo-borrador-d012/revision-localizada/variante-experimental/pelo-variante-sin-mechon-detras.png
  · delante: …/variante-experimental/redistribucion-hombros/mechones-completos-chatgpt/pelo-delante-mechones-completos.png

De la lámina aprobada (referencia-tonos-pelo-aprobados.png, imagen generada, sin modificar) solo se MIDE el tono: en
cada recuadro, zonas que son solo pelo (los lados, debajo de las orejas, y lo alto de la cabeza), sin el fondo. No se
toma ningún píxel de ella.

Recoloreado (en Lab), igual para delante y detrás (una sola transformación por tono, calculada con las dos capas
juntas, para que casen):
  · luminosidad: se reparte como en la lámina (igualación de percentiles de L). Es una función creciente: lo que era
    más oscuro sigue más oscuro y lo más claro, más claro, así se conservan los rizos, las sombras y los brillos;
  · tono y saturación: para cada nivel de luminosidad se toman el tono y la saturación medios de la lámina en ese
    nivel, y se conserva la variación de cada píxel respecto a la media de nuestro pelo en ese nivel (vetas y reflejos);
  · el canal alfa no cambia: forma, posición, transparencia y encaje son exactamente los mismos.
El castaño original sigue siendo la opción predeterminada (sus capas no cambian).

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-colores/colores_pelo.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageCms, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; BASE = AQUI.parent; RAIZ = BASE.parents[2]
sys.path[:0] = [str(BASE / 'ojos-abiertos')]
import mascara as MK   # noqa: E402

VAR = BASE / 'pelo-borrador-d012' / 'revision-localizada' / 'variante-experimental'
DETRAS = VAR / 'pelo-variante-sin-mechon-detras.png'
DELANTE = VAR / 'redistribucion-hombros' / 'mechones-completos-chatgpt' / 'pelo-delante-mechones-completos.png'
REF = AQUI / 'referencia-tonos-pelo-aprobados.png'
P = RAIZ / 'docs' / 'propuestas'
MONTAJE_CAPAS = [  # el conjunto aprobado (el de montaje-corona.png), de atrás hacia delante; None = pelo
    'DETRAS', BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png', BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
    P / 'zapatos-rosa-2026-10-15' / 'montaje' / 'zapatos-candidatos.png', P / 'vestido-rosa-2026-10-15' / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png',
    P / 'vestido-rosa-2026-10-15' / 'montaje' / 'brazos-delante-copiados-de-la-base.png', 'DELANTE', P / 'corona-2026-10-15' / 'montaje' / 'corona-candidata.png']
# recuadros de la lámina (x0, y0, x1, y1), medidos por las líneas que los separan
RECUADROS = {'chocolate': (0, 0, 568, 673), 'miel': (577, 0, 1145, 673), 'oscuro': (0, 682, 568, 1374), 'jengibre': (577, 682, 1145, 1374)}
NOMBRES = {'castano': 'Castaño (original)', 'chocolate': 'Castaño chocolate', 'miel': 'Rubio miel', 'oscuro': 'Castaño oscuro', 'jengibre': 'Pelirrojo jengibre'}
Q = np.linspace(0.5, 99.5, 100)          # percentiles para igualar la luminosidad
NIVELES = 12                             # niveles de luminosidad para el tono y la saturación


def lab_a_rgb(lab):
    q = np.round(lab).astype(int); q[..., 0] = np.clip(q[..., 0], 0, 255); q[..., 1:] = np.clip(q[..., 1:], -128, 127) & 255
    t = ImageCms.buildTransform(ImageCms.createProfile('LAB'), ImageCms.createProfile('sRGB'), 'LAB', 'RGB')
    return np.array(ImageCms.applyTransform(Image.fromarray(q.astype(np.uint8), 'LAB'), t))


def muestra_referencia(lab, caja):
    """Píxeles de pelo de un recuadro: los lados (debajo de las orejas) y lo alto de la cabeza, sin el fondo."""
    x0, y0, x1, y1 = caja; YY, XX = np.mgrid[y0:y1, x0:x1]; fx, fy = (XX - x0) / (x1 - x0), (YY - y0) / (y1 - y0)
    zona = (((fx < 0.2) | (fx > 0.8)) & (fy > 0.3) & (fy < 0.85)) | ((fy > 0.04) & (fy < 0.13) & (fx > 0.3) & (fx < 0.7))
    c = lab[y0:y1, x0:x1]; fondo = (c[..., 0] > 225) & (np.hypot(c[..., 1], c[..., 2]) < 18)
    return c[zona & ~fondo], (zona & ~fondo)


def perfil(L, a, b, cortes):
    """Tono (como vector a/b unitario medio) y saturación media en cada nivel de luminosidad."""
    k = np.clip(np.searchsorted(cortes, L, side='right') - 1, 0, NIVELES - 1)
    C = np.hypot(a, b); u = np.stack([a, b], -1) / np.maximum(C, 1e-6)[..., None]
    h = np.zeros(NIVELES); c = np.zeros(NIVELES)
    for i in range(NIVELES):
        s = k == i; v = (u[s] * C[s, None]).sum(0)
        h[i] = np.arctan2(v[1], v[0]); c[i] = np.median(C[s])
    return h, c


def suavizar(v):
    return nd.gaussian_filter1d(v, 1.0, mode='nearest')


def transformacion(capas, ref_px):
    """La transformación de color (Lab → Lab) de un tono, calculada con todas las capas de pelo juntas."""
    labs = [MK.lab_de(Image.fromarray(c)).astype(float) for c in capas]
    juntos = np.concatenate([l[c[..., 3] > 128] for l, c in zip(labs, capas)])
    qn, qr = np.percentile(juntos[:, 0], Q), np.percentile(ref_px[:, 0], Q)
    qr = suavizar(qr); qr = np.maximum.accumulate(qr)                       # creciente
    cn = np.percentile(juntos[:, 0], np.linspace(0, 100, NIVELES + 1)); cr = np.percentile(ref_px[:, 0], np.linspace(0, 100, NIVELES + 1))
    hn, sn = perfil(juntos[:, 0], juntos[:, 1], juntos[:, 2], cn)
    hr, sr = perfil(ref_px[:, 0], ref_px[:, 1], ref_px[:, 2], cr)
    centros = np.percentile(juntos[:, 0], (np.arange(NIVELES) + 0.5) * 100 / NIVELES)
    dh = suavizar(np.angle(np.exp(1j * (hr - hn)))); ks = suavizar(sr / np.maximum(sn, 1e-6))

    def f(l):
        L, a, b = l[..., 0], l[..., 1], l[..., 2]
        giro = np.interp(L, centros, dh); k = np.interp(L, centros, ks)
        C = np.hypot(a, b) * k; h = np.arctan2(b, a) + giro
        return np.stack([np.interp(L, qn, qr), C * np.cos(h), C * np.sin(h)], -1)
    return f, labs, juntos


def recolorear(capas, ref_px):
    """Una transformación por tono, la misma para todas las capas de pelo."""
    f, labs, juntos = transformacion(capas, ref_px)
    out = []
    for l, c in zip(labs, capas):
        o = c.copy(); m = c[..., 3] > 0; o[m, :3] = lab_a_rgb(f(l))[m]
        out.append(o)
    return out, dict(L_percentiles_nuestro=[round(float(x)) for x in np.percentile(juntos[:, 0], [5, 25, 50, 75, 95])],
                     L_percentiles_lamina=[round(float(x)) for x in np.percentile(ref_px[:, 0], [5, 25, 50, 75, 95])])


def estadisticas(capas):
    px = np.concatenate([MK.lab_de(Image.fromarray(c)).astype(float)[c[..., 3] > 128] for c in capas])
    C = np.hypot(px[:, 1], px[:, 2]); h = np.degrees(np.arctan2(px[:, 2], px[:, 1]))
    return dict(L=[round(float(x)) for x in np.percentile(px[:, 0], [5, 25, 50, 75, 95])], tono=round(float(np.median(h)), 1), croma=round(float(np.median(C)), 1))


def detalle(o, n):
    """Correlación del detalle fino (luminosidad menos su versión desenfocada) entre original y variante."""
    lo = MK.lab_de(Image.fromarray(o)).astype(float)[..., 0]; ln = MK.lab_de(Image.fromarray(n)).astype(float)[..., 0]
    m = o[..., 3] > 250
    fo, fn = lo - nd.gaussian_filter(lo, 3), ln - nd.gaussian_filter(ln, 3)
    return round(float(np.corrcoef(fo[m], fn[m])[0, 1]), 3)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def montaje(detras, delante):
    x = Image.new('RGBA', (948, 1659), (0, 0, 0, 0))
    for c in MONTAJE_CAPAS:
        x.alpha_composite(Image.fromarray(detras) if c == 'DETRAS' else Image.fromarray(delante) if c == 'DELANTE' else Image.open(c).convert('RGBA'))
    bg = Image.new('RGBA', x.size, (255, 250, 245, 255)); bg.alpha_composite(x)
    return bg.convert('RGB')


if __name__ == '__main__':
    fuentes = [DETRAS, DELANTE, REF] + [c for c in MONTAJE_CAPAS if not isinstance(c, str)]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    capas = [np.array(Image.open(p).convert('RGBA')) for p in (DETRAS, DELANTE)]
    ref = Image.open(REF).convert('RGBA'); lab = MK.lab_de(ref).astype(float)
    info = {'castano': dict(resultado=estadisticas(capas))}; variantes = {'castano': capas}
    vis = np.array(ref.convert('RGB'))
    for k, caja in RECUADROS.items():
        px, m = muestra_referencia(lab, caja)
        nuevas, i = recolorear(capas, px)
        for nombre, c in zip(('detras', 'delante'), nuevas):
            Image.fromarray(c, 'RGBA').save(AQUI / f'pelo-{nombre}-{k}.png', optimize=True)
        info[k] = dict(px_medidos=int(len(px)), **i)
        Lr = px[:, 0]; Cr = np.hypot(px[:, 1], px[:, 2]); hr = np.degrees(np.arctan2(px[:, 2], px[:, 1]))
        info[k]['lamina'] = dict(L=[round(float(x)) for x in np.percentile(Lr, [5, 25, 50, 75, 95])], tono=round(float(np.median(hr)), 1), croma=round(float(np.median(Cr)), 1))
        info[k]['resultado'] = estadisticas(nuevas)
        info[k]['alfa_identico'] = all(bool((n[..., 3] == o[..., 3]).all()) for n, o in zip(nuevas, capas))
        info[k]['transparente_igual'] = all(bool((n[o[..., 3] == 0] == o[o[..., 3] == 0]).all()) for n, o in zip(nuevas, capas))
        info[k]['detalle_correlacion'] = {nombre: detalle(o, n) for nombre, o, n in zip(('detras', 'delante'), capas, nuevas)}
        variantes[k] = nuevas
        x0, y0, x1, y1 = caja; v = vis[y0:y1, x0:x1]; v[m] = (v[m] * 0.5 + np.array([0, 120, 0])).astype(np.uint8)
    Image.fromarray(vis).resize((vis.shape[1] // 2, vis.shape[0] // 2), Image.LANCZOS).save(AQUI / 'zonas-medidas-en-la-lamina.png', optimize=True)
    # vistas: la muñeca entera y la cabeza (×1) con cada color
    orden = ['castano', 'chocolate', 'miel', 'oscuro', 'jengibre']
    vistas = {k: montaje(*variantes[k]) for k in orden}
    for nombre, caja, esc in (('comparacion-pelo-entera.png', (20, 20, 928, 1640), 0.36), ('comparacion-pelo-cabeza.png', (150, 40, 800, 700), 0.62)):
        tiles = [vistas[k].crop(caja).resize((round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)), Image.LANCZOS) for k in orden]
        w, h = tiles[0].size; out = Image.new('RGB', (len(tiles) * (w + 8), h + 32), 'white'); d = ImageDraw.Draw(out)
        for i, (k, t) in enumerate(zip(orden, tiles)):
            out.paste(t, (i * (w + 8), 30)); d.text((i * (w + 8) + 4, 6), NOMBRES[k], font=MK.F(18), fill=(40, 40, 60))
        out.save(AQUI / nombre, optimize=True)
    comp = dict(metodo='solo color de nuestras capas de pelo (delante y detrás, misma transformación); luminosidad por '
                       'igualación de percentiles (creciente) y tono/saturación por nivel, medidos en la lámina; alfa intacto',
                variantes=info, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
