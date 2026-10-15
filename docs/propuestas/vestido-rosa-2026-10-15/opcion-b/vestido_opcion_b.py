#!/usr/bin/env python3
"""
Opción B del vestido rosa: COPIA técnica limpia de la capa candidata (../vestido-candidato-original.png, que no
se modifica). Solo cambia el canal alfa; los colores, el diseño, los bordados, el largo y el ancho no se tocan.

  1. Puntos sueltos: se quitan todos los trozos que no están unidos al vestido (halo de la imagen generada) y la
     neblina casi invisible (alfa < 4).
  2. Opacidad del cuerpo y el forro: el vestido venía con alfa ≈ 253 en lugar de 255. Se normaliza
     (alfa × 255 / máximo real del interior, percentil 99,5 = 254) y el interior macizo (alfa ≥ 245 y a más de 2 px de cualquier
     zona con alfa < 200) queda a 255.
  3. Se conservan los bordes suaves y la transparencia intencionada del tul: lo que tenía alfa < 245 solo cambia por
     la normalización (≈ +0,4 %, como mucho +1 de alfa).

Además, sin tocar la capa:
  · máscara EXACTA de dónde falta tela respecto a la base (axilas): donde, con el vestido puesto, se seguiría viendo
    la camiseta de la base, ampliada 4 px solo hacia el propio hueco del vestido (para que el relleno empalme);
  · ampliaciones del montaje en las axilas y los hombros;
  · paquete para completar las axilas con la herramienta de imagen de ChatGPT (para-chatgpt/).

La base no se modifica (no se aplica la opción C).

Uso (desde la raíz): python3 docs/propuestas/vestido-rosa-2026-10-15/opcion-b/vestido_opcion_b.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; VES = AQUI.parent
sys.path[:0] = [str(VES / 'montaje')]
import montaje_vestido as MV   # noqa: E402  (fuentes, ropa de la base, brazos, composición)

R = MV.R; H, W, YY, XX = MV.H, MV.W, MV.YY, MV.XX
CLARO, OSCURO = MV.CLARO, MV.OSCURO
AXILAS = [(330, 740, 420, 850), (550, 740, 640, 850)]         # cajas de búsqueda (x0, y0, x1, y1)
RECORTE = (209, 560, 749, 1370)                               # 540 × 810 = 2:3, el formato vertical de ChatGPT
TAM_CHATGPT = (1024, 1536)


def limpiar(ves):
    a = ves[..., 3].astype(float)
    lb, n = nd.label(a > 0, np.ones((3, 3))); sz = nd.sum(a > 0, lb, range(1, n + 1))
    principal = lb == 1 + int(np.argmax(sz))
    sueltos = (a > 0) & ~principal
    neblina = principal & (a < 4)
    macizo = nd.distance_transform_edt(a >= 200) > 2
    interior = macizo & (a >= 245)
    tope = float(np.percentile(a[interior], 99.5))
    b = np.clip(a * 255.0 / tope, 0, 255); b[interior] = 255; b[sueltos | neblina] = 0
    out = ves.copy(); out[..., 3] = np.round(b).astype(np.uint8); out[out[..., 3] == 0] = 0
    return out, dict(sueltos=sueltos, neblina=neblina, interior=interior, tope=tope)


def falta_tela(ves_b, base, ropa, brazos, dela):
    """Donde se vería la ropa de la base con este vestido (> 5 %), dentro de las cajas de las axilas,
    ampliado 4 px hacia el hueco del vestido."""
    af = lambda c: c[..., 3] / 255
    visible = af(base) * (1 - af(ves_b)) * (1 - af(brazos)) * (1 - af(dela))
    cajas = np.zeros((H, W), bool)
    for x0, y0, x1, y1 in AXILAS:
        cajas[y0:y1, x0:x1] = True
    m = ropa & (visible > 0.05) & cajas
    z = nd.binary_dilation(m, iterations=4) & (ves_b[..., 3] < 250) & cajas
    z = nd.binary_fill_holes(nd.binary_closing(z, np.ones((3, 3))) | z)
    lb, n = nd.label(z); sz = nd.sum(z, lb, range(1, n + 1))
    return np.isin(lb, 1 + np.flatnonzero(sz >= 30)), m


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def zoom(img, caja, k):
    return img.crop(caja).resize(((caja[2] - caja[0]) * k, (caja[3] - caja[1]) * k), Image.NEAREST)


if __name__ == '__main__':
    rutas = {k: v for k, v in dict(vestido=VES / 'vestido-candidato-original.png', base=MV.BASE / 'base-transparencia-corregida.png',
             sin_ojos=MV.BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
             abiertos=MV.BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
             cerrados=MV.BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png',
             pelo_detras=MV.VAR / 'pelo-variante-sin-mechon-detras.png', pelo_delante=MV.VAR / 'pelo-variante-sin-mechon-delante.png',
             brazos=VES / 'montaje' / 'brazos-delante-copiados-de-la-base.png').items()}
    antes = {k: sha(p) for k, p in rutas.items()}
    ves, base, sin, ab, ce, det, dela, brazos = (MV.abrir(rutas[k]) for k in
        ('vestido', 'base', 'sin_ojos', 'abiertos', 'cerrados', 'pelo_detras', 'pelo_delante', 'brazos'))
    vb, info = limpiar(ves)
    Image.fromarray(vb, 'RGBA').save(AQUI / 'vestido-opcion-b.png', optimize=True)
    ropa = MV.ropa_de_la_base(base)
    estados = {'abiertos': MV.montar([det, sin, ab, vb, brazos, dela]), 'cerrados': MV.montar([det, sin, ce, vb, brazos, dela])}
    for k, v in estados.items():
        Image.fromarray(v, 'RGBA').save(AQUI / f'montaje-opcion-b-{k}.png', optimize=True)
    orig = MV.montar([det, sin, ab, ves, brazos, dela])
    mascara, asoma = falta_tela(vb, base, ropa, brazos, dela)
    Image.fromarray((mascara * 255).astype(np.uint8), 'L').save(AQUI / 'mascara-falta-tela.png', optimize=True)
    F = R.MK.F

    # --- comparación antes / después (tres fondos) ------------------------------------------------------
    pan = [('Original · fondo claro', R.MP.blanco(ves, CLARO)), ('Opción B · fondo claro', R.MP.blanco(vb, CLARO)),
           ('Original · fondo oscuro', R.MP.blanco(ves, OSCURO)), ('Opción B · fondo oscuro', R.MP.blanco(vb, OSCURO)),
           ('Original · sobre la muñeca', R.MP.blanco(orig)), ('Opción B · sobre la muñeca', R.MP.blanco(estados['abiertos']))]
    caja = (0, 0, W, 1480); ps = [p.crop(caja).resize((316, 493), Image.LANCZOS) for _, p in pan]
    fr = Image.new('RGB', (6 * 324, 522), 'white'); d = ImageDraw.Draw(fr)
    for i, ((t, _), p) in enumerate(zip(pan, ps)):
        fr.paste(p, (i * 324, 26)); d.text((i * 324 + 2, 6), t, font=F(14), fill=(40, 40, 60))
    fr.save(AQUI / 'comparacion-opcion-b.png', optimize=True)
    # detalle: bajo de tul (transparencia conservada) y un borde de falda, ×3 sobre fondo oscuro
    filas = []
    for t, z in (('Bajo de tul', (380, 1320, 560, 1400)), ('Borde de la falda', (20, 1160, 140, 1260)), ('Manga', (255, 630, 330, 790))):
        a1 = zoom(R.MP.blanco(ves, OSCURO), z, 3); a2 = zoom(R.MP.blanco(vb, OSCURO), z, 3)
        f = Image.new('RGB', (2 * a1.width + 10, a1.height + 26), 'white'); dd = ImageDraw.Draw(f)
        f.paste(a1, (0, 24)); f.paste(a2, (a1.width + 10, 24))
        dd.text((2, 4), f'{t} · original ×3 (fondo oscuro)', font=F(14), fill=(40, 40, 60)); dd.text((a1.width + 12, 4), 'opción B', font=F(14), fill=(40, 40, 60))
        filas.append(f)
    out = Image.new('RGB', (max(f.width for f in filas), sum(f.height + 8 for f in filas)), 'white'); y = 0
    for f in filas:
        out.paste(f, (0, y)); y += f.height + 8
    out.save(AQUI / 'detalle-bordes-y-tul.png', optimize=True)
    # dónde estaban los puntos sueltos
    g = np.array(R.MP.blanco(ves, OSCURO)).astype(float); m = nd.binary_dilation(info['sueltos'], iterations=3)
    g[m] = g[m] * 0.2 + np.array([255, 0, 220]) * 0.8
    im = Image.fromarray(g.astype(np.uint8)); ImageDraw.Draw(im).text((10, 10), f'Puntos sueltos quitados: {int(info["sueltos"].sum())} px en {int(nd.label(info["sueltos"], np.ones((3, 3)))[1])} trozos (magenta)', font=F(18), fill=(255, 255, 255))
    im.crop((0, 0, W, 1480)).save(AQUI / 'puntos-sueltos-quitados.png', optimize=True)

    # --- ampliaciones: axilas (falta tela) y hombros (la tela está entera; lo que se ve es el pelo de delante) ---
    def ampliacion(nombre, cajas, titulo, con_mascara):
        filas = []
        for t, z in cajas:
            mont = R.MP.blanco(estados['abiertos']); solo = R.MP.blanco(vb, OSCURO); k = 3
            p1 = zoom(mont, z, k); p2 = zoom(solo, z, k)
            p3 = mont.copy(); d3 = ImageDraw.Draw(p3, 'RGBA')
            if con_mascara:
                ys, xs = np.nonzero(mascara[z[1]:z[3], z[0]:z[2]])
                ov = np.array(p3).astype(float); mm = mascara
                ov[mm] = ov[mm] * 0.35 + np.array([0, 210, 255]) * 0.65; p3 = Image.fromarray(ov.astype(np.uint8))
            else:
                pel = dela[..., 3] > 0; ov = np.array(p3).astype(float); bb = pel & ~nd.binary_erosion(pel, iterations=2)
                ov[bb] = (255, 150, 0); p3 = Image.fromarray(ov.astype(np.uint8))
            p3 = zoom(p3, z, k)
            f = Image.new('RGB', (3 * p1.width + 20, p1.height + 26), 'white'); dd = ImageDraw.Draw(f)
            for j, (tt, p) in enumerate(((f'{t} · montaje', p1), ('vestido solo (opción B, fondo oscuro)', p2),
                                         ('azul: falta tela' if con_mascara else 'naranja: borde del pelo de delante', p3))):
                f.paste(p, (j * (p1.width + 10), 24)); dd.text((j * (p1.width + 10) + 2, 4), tt, font=F(14), fill=(40, 40, 60))
            filas.append(f)
        out = Image.new('RGB', (max(f.width for f in filas), 34 + sum(f.height + 8 for f in filas)), 'white')
        ImageDraw.Draw(out).text((4, 8), titulo, font=F(18), fill=(40, 40, 60)); y = 34
        for f in filas:
            out.paste(f, (0, y)); y += f.height + 8
        out.save(AQUI / nombre, optimize=True)
    ampliacion('ampliacion-axilas.png', [('Axila izquierda', (330, 740, 430, 850)), ('Axila derecha', (545, 740, 645, 850))],
               'Axilas ×3 · falta tela entre la manga y el cuerpo: se ve la camiseta de la base', True)
    ampliacion('ampliacion-hombros.png', [('Hombro izquierdo', (290, 620, 420, 800)), ('Hombro derecho', (550, 620, 700, 800))],
               'Hombros ×3 · la tela del vestido está entera; el corte en diagonal es el borde del pelo de delante (pelo B)', False)

    # --- paquete para ChatGPT -----------------------------------------------------------------------------
    P = AQUI / 'para-chatgpt'
    blanco = Image.new('RGBA', (W, H), (255, 255, 255, 255)); blanco.alpha_composite(Image.fromarray(vb, 'RGBA'))
    blanco.convert('RGB').save(P / 'vestido-opcion-b-sobre-blanco.png', optimize=True)
    Image.fromarray((mascara * 255).astype(np.uint8), 'L').save(P / 'mascara-falta-tela.png', optimize=True)
    # misma imagen con la zona a rellenar transparente (formato de máscara de edición: transparente = rellenar)
    gm = np.array(blanco.convert('RGB')).astype(float); gm[mascara] = gm[mascara] * 0.3 + np.array([0, 210, 255]) * 0.7
    gi = Image.fromarray(gm.astype(np.uint8)); dg = ImageDraw.Draw(gi)
    for x0, y0, x1, y1 in AXILAS:
        dg.rectangle((x0, y0, x1, y1), outline=(0, 120, 255), width=3)
    dg.text((10, 10), 'Azul: rellenar con tela del vestido (axilas). Nada más cambia.', font=F(20), fill=(0, 80, 200))
    gi.crop(RECORTE).resize(TAM_CHATGPT, Image.LANCZOS).save(P / 'guia-donde-rellenar.png', optimize=True)
    # recorte 2:3 ampliado a 1024 × 1536 (lo que se sube a ChatGPT) y su máscara al mismo tamaño
    blanco.convert('RGB').crop(RECORTE).resize(TAM_CHATGPT, Image.LANCZOS).save(P / 'recorte-para-chatgpt.png', optimize=True)
    mr = Image.fromarray((mascara * 255).astype(np.uint8), 'L').crop(RECORTE).resize(TAM_CHATGPT, Image.NEAREST)
    mr.save(P / 'mascara-recorte.png', optimize=True)
    tr = blanco.crop(RECORTE).resize(TAM_CHATGPT, Image.LANCZOS); tra = np.array(tr); tra[np.array(mr) > 0, 3] = 0
    Image.fromarray(tra, 'RGBA').save(P / 'recorte-zona-transparente.png', optimize=True)

    # --- comprobaciones -----------------------------------------------------------------------------------
    a0, a1 = ves[..., 3].astype(int), vb[..., 3].astype(int)
    tul = (a0 > 0) & (a0 < 245) & ~info['sueltos'] & ~info['neblina']
    cajas_ax = np.zeros((H, W), bool)
    for x0, y0, x1, y1 in AXILAS:
        cajas_ax[y0:y1, x0:x1] = True
    af = lambda c: c[..., 3] / 255
    vis = af(base) * (1 - af(vb)) * (1 - af(brazos)) * (1 - af(dela))
    lbm, nmm = nd.label(mascara)
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes, base_intacta=True,
                colores_rgb_identicos_donde_hay_vestido=bool((vb[..., :3] == ves[..., :3])[vb[..., 3] > 0].all()),
                tamano=[W, H], puntos_sueltos_quitados=dict(px=int(info['sueltos'].sum()), trozos=int(nd.label(info['sueltos'], np.ones((3, 3)))[1])),
                neblina_alfa_menor_4_quitada_px=int(info['neblina'].sum()), tope_alfa_interior=info['tope'],
                interior_opaco_255=dict(antes=int((a0 == 255).sum()), despues=int((a1 == 255).sum())),
                bordes_y_tul=dict(px=int(tul.sum()), cambio_medio_alfa=round(float((a1 - a0)[tul].mean()), 2), cambio_maximo_alfa=int((a1 - a0)[tul].max()),
                                  nota='solo la normalización ×255/254; la transparencia del tul se conserva'),
                ropa_de_la_base_visible_mas_10_por_ciento_px=int((ropa & (vis > 0.10)).sum()),
                ropa_visible_mas_10_por_ciento_fuera_de_las_axilas_px=int((ropa & (vis > 0.10) & ~cajas_ax).sum()),
                ropa_que_se_transparenta_1_a_10_por_ciento_px=int((ropa & (vis > 0.01) & (vis <= 0.10)).sum()),
                mascara_falta_tela=dict(px=int(mascara.sum()), zonas=[[int(v) for v in (s[1].start, s[0].start, s[1].stop, s[0].stop)] for s in nd.find_objects(lbm)]),
                hombros=dict(falta_tela=False, alfa_minimo_del_vestido_bajo_el_pelo=int(a1[(dela[..., 3] > 0) & (YY > 640) & (YY < 790) & (a1 > 0) & ((XX < 400) | (XX > 570)) & nd.binary_erosion(a1 > 200, iterations=3)].min()),
                             nota='la capa está entera; el corte diagonal y el filo claro son el borde del pelo de delante (pelo B)'))
    comp['fuentes_sin_cambios'] = antes == {k: sha(p) for k, p in rutas.items()}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
