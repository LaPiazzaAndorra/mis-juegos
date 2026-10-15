#!/usr/bin/env python3
"""
PRUEBA de encaje del vestido rosa (candidata de capa) sobre la base D-014 aprobada.

Fuentes, todas sin modificar:
  · ../vestido-candidato-original.png (948 × 1659, mismo lienzo que la base): se coloca TAL CUAL, sin mover,
    escalar, recortar ni deformar.
  · base: ../../base-aprobada-d013-2026-10-14/sin-ojos/base-sin-ojos-propuesta-v3.png
    (+ base-transparencia-corregida.png para medir la ropa y copiar los brazos);
  · ojos abiertos v3 color experimental / cerrados V2.1;
  · pelo B (variante sin mechón).

Orden de capas (de abajo arriba):
  pelo B detrás · base sin ojos · ojos · VESTIDO · brazos y manos de la base · pelo B delante.
«Brazos y manos de la base» son píxeles COPIADOS sin cambios de la base (antebrazos y manos, y ≥ 840, fuera de la
ropa): así las manos quedan por delante de la falda, como en la muñeca vestida de referencia. No se dibuja nada.

Comprobaciones: dónde se seguiría viendo la ropa de la base (camiseta y mallas), huecos de la capa, manchitas
sueltas fuera del vestido y transparencia. Si algo falla, se marca en donde-falla.png; no se corrige.

Uso (desde la raíz): python3 docs/propuestas/vestido-rosa-2026-10-15/montaje/montaje_vestido.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; VES = AQUI.parent; RAIZ = VES.parents[2]
BASE = RAIZ / 'docs' / 'propuestas' / 'base-aprobada-d013-2026-10-14'
REV = BASE / 'pelo-borrador-d012' / 'revision-localizada'; VAR = REV / 'variante-experimental'
sys.path[:0] = [str(REV)]
import revision_pelo as R     # noqa: E402  (Lab, composición y fuentes de las propuestas anteriores)

H, W, YY, XX = R.H, R.W, R.YY, R.XX
CLARO, OSCURO = (255, 250, 245), (45, 40, 70)


def abrir(p):
    return np.array(Image.open(p).convert('RGBA'))


def ropa_de_la_base(base):
    """Camiseta y mallas rosas de la base (tono < 38°, croma > 12, entre el cuello y las rodillas)."""
    lab = R.lab_rgba(base); hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1])); C = np.hypot(lab[..., 1], lab[..., 2])
    m = nd.binary_opening((base[..., 3] > 128) & (hue < 38) & (C > 12) & (YY > 630) & (YY < 1270), np.ones((3, 3)))
    lb, n = nd.label(m); sz = nd.sum(m, lb, range(1, n + 1))
    return nd.binary_fill_holes(np.isin(lb, 1 + np.flatnonzero(sz > 2000)))


def brazos_de_la_base(base, ropa):
    """Antebrazos y manos copiados de la base (sin cambios), para ponerlos delante de la falda."""
    sel = (base[..., 3] > 0) & ~nd.binary_dilation(ropa, iterations=2) & (YY >= 840) & (YY < 1120) & ((XX < 380) | (XX > 580))
    b = base.copy(); b[~sel] = 0
    return b


def montar(capas):
    x = np.zeros((H, W, 4), np.uint8)
    for c in capas:
        x = R.MP.comp(x, c)
    return x


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    rutas = dict(vestido=VES / 'vestido-candidato-original.png', referencia=VES / 'referencia-muneca-vestida.png',
                 base=BASE / 'base-transparencia-corregida.png', sin_ojos=BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
                 abiertos=BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
                 cerrados=BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png',
                 pelo_detras=VAR / 'pelo-variante-sin-mechon-detras.png', pelo_delante=VAR / 'pelo-variante-sin-mechon-delante.png')
    antes = {k: sha(p) for k, p in rutas.items()}
    ves, base, sin, ab, ce, det, dela = (abrir(rutas[k]) for k in ('vestido', 'base', 'sin_ojos', 'abiertos', 'cerrados', 'pelo_detras', 'pelo_delante'))
    assert ves.shape == base.shape, 'el vestido no tiene el lienzo de la base'
    ropa = ropa_de_la_base(base); brazos = brazos_de_la_base(base, ropa)
    Image.fromarray(brazos, 'RGBA').save(AQUI / 'brazos-delante-copiados-de-la-base.png', optimize=True)
    estados = {'abiertos': montar([det, sin, ab, ves, brazos, dela]), 'cerrados': montar([det, sin, ce, ves, brazos, dela])}
    for k, v in estados.items():
        Image.fromarray(v, 'RGBA').save(AQUI / f'montaje-vestido-{k}.png', optimize=True)
    camiseta = montar([det, sin, ab, dela])

    # --- comprobaciones -------------------------------------------------------------------------------
    af = lambda c: c[..., 3] / 255
    visible = af(base) * (1 - af(ves)) * (1 - af(brazos)) * (1 - af(dela))       # cuánto se ve de la base
    asoma = ropa & (visible > 0.10)
    lb, n = nd.label(asoma); zonas_asoma = []
    for i, sl in enumerate(nd.find_objects(lb)):
        px = int((lb[sl] == i + 1).sum())
        if px >= 20:
            zonas_asoma.append(dict(px=px, caja=[sl[1].start, sl[0].start, sl[1].stop, sl[0].stop]))
    va = ves[..., 3] > 0; lbv, nv = nd.label(va, np.ones((3, 3))); szv = nd.sum(va, lbv, range(1, nv + 1))
    sueltas = va & (lbv != 1 + int(np.argmax(szv)))
    a_v = ves[..., 3][ves[..., 3] > 0]
    # muescas de los hombros (vistas en la revisión): la capa está cortada en diagonal donde la referencia tenía
    # pelo delante; el corte deja un filo claro punteado y, junto al cuello, sombra de pelo con borde recto
    MUESCAS = [(355, 705, 50, 80), (618, 708, 62, 82)]          # centro x, y y radios de cada zona
    zona_m = np.zeros((H, W), bool)
    for cx, cy, rx, ry in MUESCAS:
        zona_m |= ((XX - cx) / rx) ** 2 + ((YY - cy) / ry) ** 2 <= 1
    muescas = zona_m & (ves[..., 3] < 128) & (base[..., 3] > 0)
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes,
                colocacion='tal cual: mismo lienzo que la base (948 × 1659), sin mover, escalar, recortar ni deformar',
                orden_de_capas=['pelo B detrás', 'base sin ojos v3', 'ojos', 'vestido', 'brazos y manos copiados de la base', 'pelo B delante'],
                ropa_de_la_base_px=int(ropa.sum()),
                ropa_que_asoma_mas_del_10_por_ciento_px=int(asoma.sum()), zonas_donde_asoma=zonas_asoma,
                ropa_que_se_transparenta_1_a_10_por_ciento_px=int((ropa & (visible > 0.01) & (visible <= 0.10)).sum()),
                mallas_que_asoman_px=int((asoma & (YY > 990)).sum()),
                manchitas_sueltas_fuera_del_vestido=dict(px=int(sueltas.sum()), trozos=int(nv - 1)),
                alfa_del_vestido=dict(opacos_255=int((ves[..., 3] == 255).sum()), mediana=int(np.median(a_v)),
                                      nota='casi ningún píxel es del todo opaco (alfa ≈ 250–254), como el original de la base'),
                muescas_de_los_hombros=dict(zonas=[dict(centro=[c[0], c[1]], radios=[c[2], c[3]]) for c in MUESCAS],
                                            px_sin_vestido_sobre_la_base=int(muescas.sum())),
                manos_delante=bool((brazos[..., 3] > 0).sum() > 0))
    # --- donde-falla.png: sobre el montaje, sin corregir nada ------------------------------------------
    w = np.array(R.MP.blanco(estados['abiertos'])).astype(float)
    def pintar(m, col, k=0.75):
        w[m] = w[m] * (1 - k) + np.array(col) * k
    pintar(nd.binary_dilation(asoma, iterations=2), (230, 20, 20))
    pintar(nd.binary_dilation(sueltas, iterations=3), (220, 0, 220))
    pintar(muescas, (255, 170, 0), 0.35)
    img = Image.fromarray(w.astype(np.uint8)); d = ImageDraw.Draw(img); F = R.MK.F
    for cx, cy, rx, ry in MUESCAS:
        d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), outline=(255, 150, 0), width=4)
    for z in zonas_asoma:
        x0, y0, x1, y1 = z['caja']; d.ellipse((x0 - 18, y0 - 18, x1 + 18, y1 + 18), outline=(230, 20, 20), width=4)
    ley = [((230, 20, 20), f'Asoma la camiseta de la base ({comp["ropa_que_asoma_mas_del_10_por_ciento_px"]} px, axilas)'),
           ((255, 170, 0), 'Muescas de los hombros: la capa está cortada donde la referencia tenía pelo'),
           ((220, 0, 220), f'Manchitas sueltas fuera del vestido ({comp["manchitas_sueltas_fuera_del_vestido"]["trozos"]} trozos)')]
    for i, (col, t) in enumerate(ley):
        d.rectangle((14, 14 + 26 * i, 32, 32 + 26 * i), fill=col); d.text((40, 14 + 26 * i), t, font=F(16), fill=(40, 40, 60))
    img.crop((0, 0, W, 1480)).save(AQUI / 'donde-falla.png', optimize=True)
    # --- vistas ---------------------------------------------------------------------------------------
    ref = abrir(rutas['referencia'])[:H]
    pan = [('Referencia vestida (diseño aprobado)', R.MP.blanco(ref)), ('Antes: base con camiseta', R.MP.blanco(camiseta)),
           ('Prueba: vestido sobre la base', R.MP.blanco(estados['abiertos'])), ('Prueba: ojos cerrados', R.MP.blanco(estados['cerrados']))]
    caja = (20, 20, 928, 1640); ps = [p.crop(caja).resize((358, 640), Image.LANCZOS) for _, p in pan]
    fr = Image.new('RGB', (4 * 368, 670), 'white'); d = ImageDraw.Draw(fr)
    for i, ((t, _), p) in enumerate(zip(pan, ps)):
        fr.paste(p, (i * 368, 28)); d.text((i * 368 + 2, 6), t, font=F(14), fill=(90, 80, 110))
    fr.save(AQUI / 'vista-montaje-vestido.png', optimize=True)
    zonas = [('Cuello', (330, 560, 630, 700)), ('Manga izquierda y axila', (240, 620, 420, 840)),
             ('Manga derecha y axila', (540, 620, 720, 840)), ('Cintura', (330, 760, 630, 900)),
             ('Mano izquierda', (150, 940, 330, 1110)), ('Bajo y piernas', (250, 1240, 700, 1420))]
    filas = []
    for t, z in zonas:
        k = 2 if (z[2] - z[0]) <= 300 else 1.5
        s = (round((z[2] - z[0]) * k), round((z[3] - z[1]) * k))
        a1 = R.MP.blanco(camiseta).crop(z).resize(s, Image.LANCZOS); a2 = R.MP.blanco(estados['abiertos']).crop(z).resize(s, Image.LANCZOS)
        a3 = R.MP.blanco(estados['abiertos'], OSCURO).crop(z).resize(s, Image.LANCZOS)
        f = Image.new('RGB', (3 * s[0] + 20, s[1] + 26), 'white'); dd = ImageDraw.Draw(f)
        for j, (tt, im) in enumerate((('antes', a1), ('vestido · fondo claro', a2), ('vestido · fondo oscuro', a3))):
            f.paste(im, (j * (s[0] + 10), 24)); dd.text((j * (s[0] + 10) + 2, 4), f'{t} · {tt}', font=F(14), fill=(40, 40, 60))
        filas.append(f)
    out = Image.new('RGB', (max(f.width for f in filas), sum(f.height + 8 for f in filas)), 'white'); y = 0
    for f in filas:
        out.paste(f, (0, y)); y += f.height + 8
    out.save(AQUI / 'vista-zonas.png', optimize=True)
    caja_g = (20, 20, 928, 1640)
    for nombre, recorte, esc in (('parpadeo-vestido-tamano-juego.gif', caja_g, 480 / 1620), ('parpadeo-vestido-cara.gif', (230, 170, 730, 580), 1.2)):
        a_, c_ = R.MP.blanco(estados['abiertos']).crop(recorte), R.MP.blanco(estados['cerrados']).crop(recorte)
        tam = (round(a_.width * esc), round(a_.height * esc)); a_, c_ = a_.resize(tam, Image.LANCZOS), c_.resize(tam, Image.LANCZOS)
        a_.save(AQUI / nombre, save_all=True, append_images=[c_, a_, c_, a_], duration=[1200, 200, 1000, 200, 600], loop=0, optimize=True)
    comp['fuentes_sin_cambios'] = antes == {k: sha(p) for k, p in rutas.items()}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
