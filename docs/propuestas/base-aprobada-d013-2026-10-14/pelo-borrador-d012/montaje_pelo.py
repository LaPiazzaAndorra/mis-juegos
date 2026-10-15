#!/usr/bin/env python3
"""
BORRADOR de montaje de revisión: el pelo castaño elegido en D-012 sobre la base D-014.

No existe todavía ninguna capa de pelo para esta base. Este borrador RECORTA el pelo de la referencia
de D-012 (docs/propuestas/muneca-elegida-2026-10-14/referencia-aprobada.png, que no se modifica) y lo
coloca sobre la base con una transformación de semejanza:
  · escala UNIFORME (la misma en horizontal y en vertical) = distancia entre los ojos de la base nueva /
    distancia entre los ojos de la referencia; sin giro ni deformación: la melena no se estira;
  · el punto medio entre los ojos de la referencia cae en el punto medio entre los ojos de la base.
La cara de la base (ojos, cejas, nariz, boca, orejas) no se toca: el pelo se pone encima solo donde la
referencia tenía pelo.

Recorte del pelo (en la referencia):
  1. color de pelo (tono 35–80°, croma > 22) y, si es claro, textura de mechones (desviación local > 9);
  2. se quitan la cara (relleno de su piel lisa y elipse de los rasgos), las orejas, el cuello y la piel
     de la frente; se rellenan las sombras entre rizos que no son fondo ni ropa; se descartan restos;
  3. bordes: opacidad y color propio ESTIMADOS contra el fondo local (crema o piel), como en los ojos.

Capas: «detrás» (todo el pelo, detrás de la base) y «delante» (el pelo que cae sobre la silueta de la base,
salvo en la zona de los ojos y 30 px alrededor).
Estados: base sin ojos v3 + ojos abiertos (v3 color experimental) o cerrados (V2.1 reutilizados).

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/montaje_pelo.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; PROP = AQUI.parent; DOCS = PROP.parent
sys.path[:0] = [str(PROP / 'ojos-abiertos')]
import mascara as MK          # noqa: E402  (Lab, fuente, centros de los ojos de la base)

REF = DOCS / 'muneca-elegida-2026-10-14' / 'referencia-aprobada.png'
OJOS_REF = [(392, 352), (552, 348)]           # centros de los iris de la referencia (búsqueda de círculos, medidas/medir.py)


def sd_local(L, n=7):
    mu = nd.uniform_filter(L, n); return np.sqrt(np.maximum(nd.uniform_filter(L * L, n) - mu * mu, 0))


def quitar_pequenos(m, minimo):
    lb, n = nd.label(m, np.ones((3, 3))); sz = nd.sum(m, lb, range(1, n + 1)); return np.isin(lb, 1 + np.flatnonzero(sz > minimo))


def mascara_pelo(ref):
    lab = MK.lab_de(ref); L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b); hue = np.degrees(np.arctan2(b, a)); sd = sd_local(L)
    H, W = L.shape; YY, XX = np.mgrid[0:H, 0:W]
    # 1. color y textura
    col = (hue > 35) & (hue < 80) & (C > 22) & (L < 238)
    m = nd.binary_opening(nd.binary_closing(col & ((L < 165) | (sd > 9)), np.ones((5, 5))) & col, np.ones((3, 3)))
    big = quitar_pequenos(m, 20000)
    h = nd.binary_fill_holes(big) & ~big; lh, nh = nd.label(h); hs = nd.sum(h, lh, range(1, nh + 1))
    pelo = big | np.isin(lh, 1 + np.flatnonzero(hs < 150))
    # 2. fuera la cara (piel lisa rellena), sus rasgos, las orejas y el cuello
    piel_l = nd.binary_opening((hue > 25) & (hue < 62) & (C > 12) & (C < 48) & (L > 170) & (L < 245) & (sd < 10) & ~pelo, np.ones((3, 3)))
    lb, n = nd.label(piel_l); cab = (YY < 620) & (XX > 220) & (XX < 730)
    cara = nd.binary_fill_holes(nd.binary_closing(np.isin(lb, [i for i in range(1, n + 1) if ((lb == i) & cab).sum() > 8000]) & cab, np.ones((7, 7))))
    pelo = quitar_pequenos(pelo & ~nd.binary_dilation(cara, iterations=2), 3000)
    fondo = (L > 232) & (C < 18); ropa = (hue < 38) & (C > 12) & (L > 150)
    piel = nd.binary_opening((hue > 25) & (hue < 62) & (C > 12) & (C < 48) & (L > 165) & (L < 245) & (sd < 12), np.ones((3, 3)))
    rasgos = ((XX - 472) / 138) ** 2 + ((YY - 372) / 118) ** 2 <= 1
    zo = (((XX - 282) / 40) ** 2 + ((YY - 390) / 65) ** 2 <= 1) | (((XX - 660) / 40) ** 2 + ((YY - 390) / 65) ** 2 <= 1)
    orejas = nd.binary_fill_holes(zo & nd.binary_closing(piel, np.ones((5, 5)))) & zo
    cuello = (XX > 400) & (XX < 560) & (YY > 480) & (YY < 600) & nd.binary_closing(piel, np.ones((5, 5)))
    m = pelo & ~rasgos & ~orejas & ~cuello
    cand = nd.binary_closing(m, np.ones((9, 9))) | nd.binary_fill_holes(m)
    m = quitar_pequenos(m | (cand & ~fondo & ~ropa & ~rasgos & ~orejas & ~cuello & ~piel), 800)
    # piel de la frente y restos finos en la frente
    frente = (YY < 320) & (XX > 330) & (XX < 630)
    m0 = m & ~(m & frente & (L > 180) & ((b - a) < 9))
    m = quitar_pequenos(nd.binary_opening(m0, np.ones((2, 2))) | (m0 & nd.binary_erosion(m, iterations=2)), 800)
    caja = (XX > 390) & (XX < 610) & (YY > 170) & (YY < 262)
    abierto = quitar_pequenos(nd.binary_opening(m, np.ones((5, 5))), 2000)
    m = np.where(caja, m & nd.binary_dilation(abierto, iterations=1), m)
    h = nd.binary_fill_holes(m) & ~m; lh, nh = nd.label(h); hs = nd.sum(h, lh, range(1, nh + 1)); m |= np.isin(lh, 1 + np.flatnonzero(hs < 120))
    caja2 = (XX > 380) & (XX < 620) & (YY > 165) & (YY < 265)
    pf = nd.binary_closing(caja2 & (L > 165) & (sd < 14), np.ones((5, 5))) & caja2
    pf = nd.binary_fill_holes(quitar_pequenos(pf, 500))
    return m & ~nd.binary_dilation(pf, iterations=1)


def recortar(ref, m):
    """Capa RGBA del pelo en la referencia, con bordes estimados contra el fondo local."""
    C = np.array(ref).astype(float)
    borde = m & ~nd.binary_erosion(m, iterations=2); nuc = m & ~borde
    _, (iy, ix) = nd.distance_transform_edt(~nuc, return_indices=True); F0 = C[iy, ix]
    no = (~nd.binary_dilation(m, iterations=1)).astype(float); k = np.ones((9, 9))
    n = nd.convolve(no, k, mode='nearest')[..., None]
    B = np.where(n > 0, np.stack([nd.convolve(C[..., c] * no, k, mode='nearest') for c in range(3)], -1) / np.maximum(n, 1e-6), C)
    ext = nd.binary_dilation(m, iterations=1) & ~m; zona = borde | ext; v = F0 - B
    a = np.where(nuc, 1.0, 0.0); ap = np.clip(((C - B) * v).sum(-1) / np.maximum((v * v).sum(-1), 1), 0, 1)
    a[zona] = ap[zona]; a[ext & (ap < 0.15)] = 0
    F = np.where(zona[..., None], np.clip((C - (1 - a[..., None]) * B) / np.maximum(a[..., None], 1e-6), 0, 255), C)
    rgba = np.dstack([F, a * 255]); rgba[a == 0] = 0
    return rgba


def colocar(rgba, H, W):
    nuevos = [(int(x), int(y)) for x, y in MK.OJOS]
    s = (nuevos[1][0] - nuevos[0][0]) / np.hypot(OJOS_REF[1][0] - OJOS_REF[0][0], OJOS_REF[1][1] - OJOS_REF[0][1])
    cr, cn = np.mean(OJOS_REF, 0), np.mean(nuevos, 0)
    al = rgba[..., 3:] / 255; pre = np.concatenate([rgba[..., :3] * al, rgba[..., 3:]], -1)
    w, h = round(pre.shape[1] * s), round(pre.shape[0] * s)
    pre = np.stack([np.array(Image.fromarray(pre[..., c].astype(np.float32), 'F').resize((w, h), Image.LANCZOS)) for c in range(4)], -1).clip(0, 255)
    ox, oy = round(cn[0] - cr[0] * s), round(cn[1] - cr[1] * s)
    lien = np.zeros((H, W, 4)); y0, x0, y1, x1 = max(0, oy), max(0, ox), min(H, oy + h), min(W, ox + w)
    lien[y0:y1, x0:x1] = pre[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    al = lien[..., 3:] / 255; rgb = np.where(al > 0, lien[..., :3] / np.maximum(al, 1e-6), 0)
    return np.dstack([rgb, lien[..., 3]]).round().clip(0, 255).astype(np.uint8), dict(escala=round(float(s), 4), origen=[ox, oy], tamaño=[w, h])


def comp(b, c):
    al = c[..., 3:].astype(float) / 255; r = b.astype(float).copy()
    r[..., :3] = c[..., :3] * al + b[..., :3] * (1 - al); r[..., 3:] = np.maximum(b[..., 3:], c[..., 3:])
    return np.clip(np.round(r), 0, 255).astype(np.uint8)


def blanco(x, c=(255, 250, 245)):
    i = Image.fromarray(x, 'RGBA'); bg = Image.new('RGBA', i.size, c + (255,)); bg.alpha_composite(i); return bg.convert('RGB')


if __name__ == '__main__':
    sha_ref = hashlib.sha256(REF.read_bytes()).hexdigest()
    ref = Image.open(REF).convert('RGB')
    base = np.array(Image.open(PROP / 'base-transparencia-corregida.png').convert('RGBA')); H, W = base.shape[:2]
    m = mascara_pelo(ref)
    pelo, colocacion = colocar(recortar(ref, m), H, W)
    # «delante»: el pelo que cae sobre la base, salvo en la zona de los ojos y 30 px alrededor (ahí la referencia
    # trae restos de sus propias pestañas; ese pelo queda detrás, tapado por la cara)
    zona_ojos = nd.binary_dilation(np.array(Image.open(PROP / 'ojos-cerrados' / 'zona-que-tapan.png')) > 0, iterations=30)
    rampa = np.clip(nd.distance_transform_edt(~zona_ojos) / 12, 0, 1)            # transición de 12 px, sin cortes duros
    delante = pelo.copy(); delante[..., 3] = np.round(pelo[..., 3] * rampa).astype(np.uint8); delante[(base[..., 3] == 0) | (delante[..., 3] == 0)] = 0
    Image.fromarray((m * 255).astype(np.uint8), 'L').save(AQUI / 'mascara-pelo-en-referencia.png', optimize=True)
    Image.fromarray(pelo, 'RGBA').save(AQUI / 'pelo-borrador-detras.png', optimize=True)
    Image.fromarray(delante, 'RGBA').save(AQUI / 'pelo-borrador-delante.png', optimize=True)
    sin = np.array(Image.open(PROP / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'))
    ab = np.array(Image.open(PROP / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png'))
    ce = np.array(Image.open(PROP / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png'))
    estados = {}
    for nombre, ojos in (('abiertos', ab), ('cerrados', ce)):
        x = comp(np.zeros_like(sin), pelo); x = comp(x, sin); x = comp(x, ojos); x = comp(x, delante)   # una sola capa de ojos
        estados[nombre] = x; Image.fromarray(x, 'RGBA').save(AQUI / f'montaje-{nombre}.png', optimize=True)
    # vistas
    caja = (40, 40, 910, 1560); cara = (230, 170, 730, 580)
    refv = blanco(np.dstack([np.array(ref), np.full(np.array(ref).shape[:2], 255, np.uint8)]))
    paneles = [('Referencia D-012', refv), ('Abiertos', blanco(estados['abiertos'])), ('Cerrados', blanco(estados['cerrados']))]
    filas = []
    for alto in (480, 220):
        ps = [p.crop(caja).resize((round(870 * alto / 1520), alto), Image.LANCZOS) for _, p in paneles]
        f = Image.new('RGB', (max(sum(p.width + 12 for p in ps), 520), alto + 56), 'white'); d = ImageDraw.Draw(f); x = 0
        d.text((2, 2), f'Muñeca de {alto} px de alto (aprox. {"«Vestir» en iPhone" if alto > 300 else "«Mi Mundo»"})', font=MK.F(16), fill=(40, 40, 60))
        for (t, _), p in zip(paneles, ps):
            f.paste(p, (x, 52)); d.text((x + 2, 28), t if alto > 300 else t.replace('Referencia ', ''), font=MK.F(13 if alto < 300 else 15), fill=(90, 80, 110)); x += p.width + 12
        filas.append(f)
    cs = [blanco(estados[k]).crop(cara).resize(((cara[2] - cara[0]) * 3 // 2, (cara[3] - cara[1]) * 3 // 2), Image.LANCZOS) for k in ('abiertos', 'cerrados')]
    f = Image.new('RGB', (cs[0].width * 2 + 10, cs[0].height + 34), 'white'); d = ImageDraw.Draw(f)
    for i, (t, c) in enumerate(zip(('Abiertos · cara ×1,5', 'Cerrados · cara ×1,5'), cs)):
        d.text((i * (c.width + 10) + 4, 6), t, font=MK.F(20), fill=(40, 40, 60)); f.paste(c, (i * (c.width + 10), 30))
    filas.append(f)
    out = Image.new('RGB', (max(r.width for r in filas), sum(r.height + 10 for r in filas)), 'white'); y = 0
    for r in filas:
        out.paste(r, (0, y)); y += r.height + 10
    out.save(AQUI / 'vista-montaje-pelo.png', optimize=True)
    # cómo encaja: pelo sobre fondo oscuro (huecos y bordes) y referencia superpuesta al 50 %
    blanco(pelo, (45, 40, 70)).crop(caja).resize((435, 760), Image.LANCZOS).save(AQUI / 'vista-pelo-solo-oscuro.png', optimize=True)
    for nombre, recorte, esc in (('parpadeo-pelo-tamano-juego.gif', caja, 480 / 1520), ('parpadeo-pelo-cara.gif', cara, 1.2)):
        a_, c_ = blanco(estados['abiertos']).crop(recorte), blanco(estados['cerrados']).crop(recorte)
        tam = (round(a_.width * esc), round(a_.height * esc)); a_, c_ = a_.resize(tam, Image.LANCZOS), c_.resize(tam, Image.LANCZOS)
        a_.save(AQUI / nombre, save_all=True, append_images=[c_, a_, c_, a_], duration=[1200, 200, 1000, 200, 600], loop=0, optimize=True)
    comp_ = dict(fuente='docs/propuestas/muneca-elegida-2026-10-14/referencia-aprobada.png', sha256_fuente=sha_ref,
                 fuente_sin_cambios=hashlib.sha256(REF.read_bytes()).hexdigest() == sha_ref, colocacion=colocacion,
                 escala_uniforme=True, ampliacion=round(colocacion['escala'] - 1, 4), pelo_en_referencia_px=int(m.sum()),
                 pelo_colocado_visible_px=int((pelo[..., 3] > 0).sum()),
                 base_intacta_donde_no_hay_pelo_delante=bool((estados['abiertos'][..., :3][(delante[..., 3] == 0) & (base[..., 3] == 255)] == comp(sin, ab)[..., :3][(delante[..., 3] == 0) & (base[..., 3] == 255)]).all()))
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp_, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp_, ensure_ascii=False))
