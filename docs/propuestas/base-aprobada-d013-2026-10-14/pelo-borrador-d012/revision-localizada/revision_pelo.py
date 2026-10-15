#!/usr/bin/env python3
"""
BORRADOR · revisión LOCALIZADA del pelo de D-012 colocado sobre la base D-014.

Parte del pelo ya colocado del borrador anterior (../pelo-borrador-detras.png, escala 1,0934, que NO se
modifica ni se vuelve a escalar) y de la base (no se modifica). Todo se hace con máscaras por zonas
(coordenadas fijas de la base, 948 × 1659); no hay ningún filtro de color aplicado a toda la melena.

  1. Limpieza por zonas
     · cabeza y cuello: detrás de la cara, las orejas y el cuello opacos de la base no queda nada de la referencia
       (allí estaban su cara, sus orejas, sus pestañas y su cuello); en el borde exterior (4 px) se quitan las
       astillas de piel de la referencia;
     · cejas: los trazos finos de las cejas de la referencia que quedaban sobre las cejas de la base;
     · capa de delante: en la cara por debajo de las cejas, las orejas y el cuello no hay pelo delante (la
       referencia lleva las orejas despejadas); el pelo de las sienes y de la frente se queda como estaba;
     · jersey: en los rizos de abajo (y ≥ 650) se quitan los píxeles rosas del jersey de la referencia.
  2. Huecos junto al cuello y bajo las orejas: se reconstruyen con mechones COPIADOS de la propia melena
     (desplazados, sin escalar ni girar) colocados DETRÁS del pelo existente, con una sombra suave por estar
     detrás de la cabeza. Son zonas RECONSTRUIDAS, no extraídas del original: van marcadas.
  3. Mechón del brazo: su punta se afila con una máscara a lo largo de su eje (sin corte recto).
  4. Lo que este método no resuelve con calidad se marca en zonas-pendientes.png.

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/revision-localizada/revision_pelo.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; BORR = AQUI.parent; PROP = BORR.parent
sys.path[:0] = [str(PROP / 'ojos-abiertos'), str(BORR)]
import mascara as MK          # noqa: E402  (Lab y fuente)
import montaje_pelo as MP     # noqa: E402  (composición y fondo de las vistas del borrador anterior)

H, W = 1659, 948
YY, XX = np.mgrid[0:H, 0:W]
# contorno (holgado) del mechón que cruza el brazo izquierdo; a su izquierda empiezan los rizos
ZONA_MECHON = [(352, 876), (380, 876), (380, 945), (360, 995), (338, 1014), (300, 1014), (312, 985), (336, 945), (349, 926), (350, 900)]
ZONA_HUECOS = (190, 480, 760, 692)             # donde se buscan huecos cerrados entre pelo, orejas y cuello


def lab_rgba(x):
    return MK.lab_de(Image.fromarray(np.dstack([x[..., :3], np.full(x.shape[:2], 255, np.uint8)]), 'RGBA'))


def sd_local(L, n=7):
    mu = nd.uniform_filter(L, n); return np.sqrt(np.maximum(nd.uniform_filter(L * L, n) - mu * mu, 0))


def zonas(base_a):
    op = base_a == 255
    cabeza = op & (((YY >= 330) & (YY < 645)) | ((YY >= 330) & (YY < 690) & (XX > 395) & (XX < 565)))     # cara, orejas, cuello
    # parte de la cabeza que se vacía en la capa de detrás: óvalo de la cara (borde superior curvo, sin cortes
    # rectos) más todo lo que queda por debajo de y = 430 (orejas, mandíbula y cuello)
    ovalo = ((XX - 479) / 215) ** 2 + ((YY - 470) / 150) ** 2 <= 1
    cejas = (((XX - 385) / 45) ** 2 + ((YY - 355) / 12) ** 2 <= 1) | (((XX - 585) / 50) ** 2 + ((YY - 349) / 12) ** 2 <= 1)
    return dict(cabeza=cabeza, vaciar=cabeza & (ovalo | (YY >= 430)), cejas=cejas, cara_baja=cabeza & (YY >= 415), jersey=(YY >= 650) & (YY < 1060))


def limpiar(pelo, base_a, Z):
    """Restos de la referencia fuera de la cabeza → (pelo_limpio, quitado). Solo baja la opacidad; no cambia colores."""
    p = pelo.copy(); a = p[..., 3].astype(float)
    lab = lab_rgba(p); L, A_, B_ = lab[..., 0], lab[..., 1], lab[..., 2]; C = np.hypot(A_, B_); hue = np.degrees(np.arctan2(B_, A_))
    sd = sd_local(L)
    quitar = np.zeros((H, W), bool)
    # astillas de piel de la referencia pegadas por fuera al contorno de la cabeza (4 px)
    borde = nd.binary_dilation(Z['cabeza'], iterations=4) & (base_a == 0) & (YY >= 400)
    piel = (L > 140) & (sd < 14) & (hue > 20) & (hue < 70)
    quitar |= borde & piel & (a > 0)
    # cejas de la referencia: trazos finos sobre las cejas de la base (el pelo grueso de las sienes se queda)
    quitar |= Z['cejas'] & (a > 0) & ~nd.binary_opening(a > 0, np.ones((7, 7)))
    # jersey rosa entre los rizos de abajo
    rosa = (hue < 35) & (C > 14) & (L > 105)
    rosa = rosa | (nd.binary_dilation(rosa, iterations=2) & (hue < 48) & (C > 10))
    quitar |= Z['jersey'] & rosa & (a > 0)
    a[quitar] = 0
    # restos sueltos que hayan quedado aislados dentro de las zonas
    lb, n = nd.label(a > 0, np.ones((3, 3))); sz = nd.sum(a > 0, lb, range(1, n + 1))
    suelto = np.isin(lb, 1 + np.flatnonzero(sz < 400)) & (Z['cabeza'] | Z['jersey'] | nd.binary_dilation(Z['cabeza'], iterations=6))
    quitar |= suelto & (a > 0); a[suelto] = 0
    p[..., 3] = np.round(a).astype(np.uint8); p[p[..., 3] == 0] = 0
    return p, quitar


def banda_contorno(base_a, Z):
    """Franja de 8 px por fuera del contorno de la mandíbula, las orejas (desde su mitad) y el cuello: en la
    referencia allí estaban su cara y su cuello, así que lo que queda son bordes de piel; se reconstruye."""
    return nd.binary_dilation(Z['cara_baja'], iterations=8) & (base_a < 255) & (YY >= 430)


def vaciar_cabeza(pelo, base_a, Z):
    """Capa de detrás: donde la cara, las orejas y el cuello de la base son opacos no queda nada de la referencia,
    ni en la franja del contorno (que luego se reconstruye)."""
    p = pelo.copy(); p[Z['vaciar'] | banda_contorno(base_a, Z)] = 0
    return p


def delante_de(pelo, base_a, Z):
    """Pelo que va delante: el que cae sobre la base, salvo en los ojos (igual que el borrador anterior) y en la
    cara por debajo de las cejas, las orejas y el cuello (con el borde suavizado de la base, 6 px)."""
    zona_ojos = nd.binary_dilation(np.array(Image.open(PROP / 'ojos-cerrados' / 'zona-que-tapan.png')) > 0, iterations=30)
    rampa = np.clip(nd.distance_transform_edt(~zona_ojos) / 12, 0, 1)
    fuera = nd.binary_dilation(Z['cara_baja'], iterations=6)
    rampa = rampa * np.clip(nd.distance_transform_edt(~fuera) / 4, 0, 1)
    d = pelo.copy(); d[..., 3] = np.round(pelo[..., 3] * rampa).astype(np.uint8); d[(base_a == 0) | (d[..., 3] == 0)] = 0
    return d


def huecos(montaje_a):
    U = montaje_a > 40; x0, y0, x1, y1 = ZONA_HUECOS
    G = nd.binary_fill_holes(U) & ~U
    G &= (XX >= x0) & (XX < x1) & (YY >= y0) & (YY < y1)
    lb, n = nd.label(G); sz = nd.sum(G, lb, range(1, n + 1))
    return np.isin(lb, 1 + np.flatnonzero(sz >= 60))


def trozos(G, area=900):
    """Divide cada hueco en trozos pequeños (≈ area px), para copiar mechones pequeños y no un bloque grande."""
    from scipy.cluster.vq import kmeans2
    lb, n = nd.label(G); salida = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lb == i); k = max(1, round(ys.size / area))
        if k == 1:
            salida.append((ys, xs)); continue
        _, et = kmeans2(np.stack([xs, ys], 1).astype(float), k, seed=7, minit='++')
        salida += [(ys[et == j], xs[et == j]) for j in range(k) if (et == j).any()]
    return sorted(salida, key=lambda t: (-t[0].mean()))      # de abajo arriba: primero lo que toca a los rizos


def reconstruir(detras, base_a, G):
    """Rellena los huecos con mechones pequeños COPIADOS de la propia melena (traslado puro: ni escala ni giro),
    colocados DETRÁS del pelo existente y oscurecidos junto a la cabeza (pelo que queda detrás del cuello).
    Para cada trozo se elige, entre los desplazamientos cuyo origen es pelo opaco del mismo lado de la cara,
    el que mejor continúa el pelo (o los trozos ya puestos) que lo rodea, evitando los brillos."""
    src = detras.astype(float); a_src = detras[..., 3] == 255
    lab = lab_rgba(detras)
    sombra = 0.62 + 0.28 * np.clip(nd.distance_transform_edt(base_a < 255) / 35, 0, 1)
    parche = np.zeros((H, W, 4)); lleno = a_src.copy(); lab_act = lab.copy(); elegidos = []
    for ys, xs in trozos(G):
        g = np.zeros((H, W), bool); g[ys, xs] = True
        zona = nd.binary_dilation(g, iterations=9); zy, zx = np.nonzero(zona)
        anillo = nd.binary_dilation(g, iterations=10) & ~g & lleno; ay, ax = np.nonzero(anillo)
        lado = np.sign(xs.mean() - 479); mejor = None
        for dy in range(-90, 131, 3):
            for dx in range(-230, 231, 3):
                if abs(dx) < 24 and abs(dy) < 24:
                    continue
                sy, sx = zy + dy, zx + dx
                if sy.min() < 0 or sx.min() < 0 or sy.max() >= H or sx.max() >= W or np.sign(sx.mean() - 479) != lado:
                    continue
                if (a_src[sy, sx] & ~G[sy, sx]).mean() < 0.98:
                    continue
                err = np.abs(lab_act[ay, ax] - lab[ay + dy, ax + dx]).sum(-1).mean() if ay.size else 0
                brillo = max(0.0, lab[ys + dy, xs + dx, 0].mean() - (lab_act[ay, ax, 0].mean() if ay.size else 50))
                err += 0.5 * brillo
                if mejor is None or err < mejor[0]:
                    mejor = (err, dx, dy)
        if mejor is None:
            elegidos.append(dict(trozo_px=int(ys.size), centro=[int(xs.mean()), int(ys.mean())], resuelto=False)); continue
        e, dx, dy = mejor
        rampa = np.clip((9 - nd.distance_transform_edt(~g)[zy, zx]) / 4, 0, 1)    # opaco hasta 5 px fuera del hueco; luego 4 px de transición
        al = 255 * rampa; nuevo = al > parche[zy, zx, 3]
        rgb = src[zy + dy, zx + dx, :3] * sombra[zy, zx, None]
        parche[zy[nuevo], zx[nuevo], :3] = rgb[nuevo]; parche[zy[nuevo], zx[nuevo], 3] = al[nuevo]
        lleno[ys, xs] = True; lab_act[ys, xs] = lab[ys + dy, xs + dx]
        elegidos.append(dict(trozo_px=int(ys.size), centro=[int(xs.mean()), int(ys.mean())], origen_desplazado=[dx, dy],
                             error_de_continuidad=round(float(e), 1), resuelto=True))
    parche = np.round(parche).clip(0, 255).astype(np.uint8); parche[parche[..., 3] == 0] = 0
    return MP.comp(parche, detras), parche, elegidos          # el pelo existente queda por encima del mechón copiado


def afilar_mechon(capas):
    """Afila la punta del mechón que cruza el brazo: a lo largo de su eje la anchura se reduce de forma suave
    hasta acabar en punta (sin corte recto). Solo baja la opacidad; se aplica igual a las dos capas."""
    zona = Image.new('L', (W, H), 0); ImageDraw.Draw(zona).polygon(ZONA_MECHON, fill=255)
    m = (np.array(zona) > 0) & (np.maximum.reduce([c[..., 3] for c in capas]) > 0)
    ys, xs = np.nonzero(m); c0 = np.array([xs.mean(), ys.mean()])
    v = np.linalg.eigh(np.cov(np.stack([xs, ys])))[1][:, -1]
    if v[1] < 0:
        v = -v                                           # eje de arriba hacia abajo
    t = (xs - c0[0]) * v[0] + (ys - c0[1]) * v[1]; s = -(xs - c0[0]) * v[1] + (ys - c0[1]) * v[0]
    t0, t1 = t.min(), t.max(); u = (t - t0) / (t1 - t0)
    nb = 24; idx = np.minimum((u * nb).astype(int), nb - 1)
    cen = np.array([np.median(s[idx == k]) if (idx == k).any() else 0 for k in range(nb)])
    med = np.array([(s[idx == k].max() - s[idx == k].min()) / 2 if (idx == k).any() else 0 for k in range(nb)])
    cen = nd.uniform_filter1d(cen, 7, mode='nearest'); med = nd.uniform_filter1d(med, 5, mode='nearest')
    uk = (np.arange(nb) + 0.5) / nb; cen_u, med_u = np.interp(u, uk, cen), np.interp(u, uk, med)
    ut = np.clip((u - 0.35) / 0.65, 0, 1); estrecha = np.cos(ut * np.pi / 2) ** 1.2      # 1 → 0 en la parte final
    permitido = med_u * (0.04 + 0.96 * estrecha)
    f = np.clip((permitido - np.abs(s - cen_u)) / 2.5 + 0.5, 0, 1)
    fac = np.ones((H, W)); fac[ys, xs] = f
    salida = []
    for c in capas:
        c = c.copy(); c[..., 3] = np.round(c[..., 3] * fac).astype(np.uint8); c[c[..., 3] == 0] = 0; salida.append(c)
    return salida, (fac < 0.999) & m, dict(eje=[round(float(v[0]), 3), round(float(v[1]), 3)], largo_px=round(float(t1 - t0), 1))


def montar(detras, sin, ojos, delante):
    x = MP.comp(np.zeros_like(sin), detras); x = MP.comp(x, sin); x = MP.comp(x, ojos); return MP.comp(x, delante)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    fuentes = [PROP / 'base-transparencia-corregida.png', BORR / 'pelo-borrador-detras.png', BORR / 'pelo-borrador-delante.png',
               BORR / 'montaje-abiertos.png', BORR / 'montaje-cerrados.png']
    antes = {str(p.relative_to(PROP.parents[2])): sha(p) for p in fuentes}
    base = np.array(Image.open(PROP / 'base-transparencia-corregida.png').convert('RGBA')); ba = base[..., 3]
    pelo = np.array(Image.open(BORR / 'pelo-borrador-detras.png'))          # pelo ya colocado: no se vuelve a escalar
    sin = np.array(Image.open(PROP / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'))
    ab = np.array(Image.open(PROP / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png'))
    ce = np.array(Image.open(PROP / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png'))
    Z = zonas(ba)
    limpio, quitado = limpiar(pelo, ba, Z)
    delante = delante_de(limpio, ba, Z); detras = vaciar_cabeza(limpio, ba, Z)
    (detras, delante), afilado, info_mechon = afilar_mechon([detras, delante])
    G = huecos(montar(detras, sin, ab, delante)[..., 3]) | banda_contorno(ba, Z)
    previo = detras[..., 3].copy()
    detras, parche, trozos_info = reconstruir(detras, ba, G)
    estados = {k: montar(detras, sin, o, delante) for k, o in (('abiertos', ab), ('cerrados', ce))}
    Image.fromarray(detras, 'RGBA').save(AQUI / 'pelo-revisado-detras.png', optimize=True)
    Image.fromarray(delante, 'RGBA').save(AQUI / 'pelo-revisado-delante.png', optimize=True)
    for k, v in estados.items():
        Image.fromarray(v, 'RGBA').save(AQUI / f'montaje-revisado-{k}.png', optimize=True)
    # dónde se ha hecho cada cosa (sobre el montaje anterior, en gris)
    reconstruido = (parche[..., 3] > 0) & (previo < 255) & (ba < 255)          # donde el mechón copiado se ve
    viejo = np.array(Image.open(BORR / 'montaje-abiertos.png'))
    gris = np.array(MP.blanco(viejo, (45, 40, 70)).convert('L').convert('RGB')).astype(float) * 0.55
    marcas = gris.copy()
    quitado_visible = quitado | ((pelo[..., 3] > 0) & (np.array(Image.open(BORR / 'pelo-borrador-delante.png'))[..., 3] > 0) & (delante[..., 3] == 0) & ~afilado)
    for m, col in ((quitado_visible, (255, 60, 200)), (reconstruido, (40, 230, 90)), (afilado, (60, 170, 255))):
        marcas[m] = marcas[m] * 0.25 + np.array(col) * 0.75
    marcas = Image.fromarray(marcas.astype(np.uint8)); dm = ImageDraw.Draw(marcas)
    leyenda = [((255, 60, 200), 'Limpiado: restos de cara, orejas, cejas, cuello y jersey de la referencia'),
               ((40, 230, 90), 'RECONSTRUIDO con mechones copiados de la propia melena (no es del original)'),
               ((60, 170, 255), 'Mechón del brazo: punta afilada')]
    for i, (col, t) in enumerate(leyenda):
        dm.rectangle((14, 14 + 26 * i, 32, 32 + 26 * i), fill=col); dm.text((40, 14 + 26 * i), t, font=MK.F(16), fill=(255, 255, 255))
    marcas.crop((40, 0, 910, 1100)).save(AQUI / 'zonas-revisadas.png', optimize=True)
    Image.fromarray((reconstruido * 255).astype(np.uint8), 'L').save(AQUI / 'mascara-zonas-reconstruidas.png', optimize=True)
    # vistas: capas aisladas sobre fondo oscuro y conjunto montado (antes / después)
    oscuro = (45, 40, 70); caja = (40, 40, 910, 1560); cara = (230, 170, 730, 700)
    capas = [('Detrás · antes', MP.blanco(pelo, oscuro)), ('Detrás · revisada', MP.blanco(detras, oscuro)),
             ('Delante · antes', MP.blanco(np.array(Image.open(BORR / 'pelo-borrador-delante.png')), oscuro)), ('Delante · revisada', MP.blanco(delante, oscuro))]
    ps = [p.crop((40, 40, 910, 1100)).resize((435, 530), Image.LANCZOS) for _, p in capas]
    f = Image.new('RGB', (4 * 445, 530 + 40), (30, 26, 48)); d = ImageDraw.Draw(f)
    for i, ((t, _), p) in enumerate(zip(capas, ps)):
        f.paste(p, (i * 445, 36)); d.text((i * 445 + 6, 8), t, font=MK.F(18), fill=(255, 240, 220))
    f.save(AQUI / 'vista-capas-oscuro.png', optimize=True)
    # capas revisadas grandes, para mirarlas de cerca
    for nombre, capa in (('detras', detras), ('delante', delante)):
        MP.blanco(capa, oscuro).crop((40, 40, 910, 1100)).save(AQUI / f'vista-capa-{nombre}-oscuro.png', optimize=True)
    viejos = {'abiertos': viejo, 'cerrados': np.array(Image.open(BORR / 'montaje-cerrados.png'))}
    pan = [('Antes · abiertos', MP.blanco(viejos['abiertos'])), ('Revisado · abiertos', MP.blanco(estados['abiertos'])), ('Revisado · cerrados', MP.blanco(estados['cerrados']))]
    filas = []
    for alto in (600, 220):
        pp = [p.crop(caja).resize((round(870 * alto / 1520), alto), Image.LANCZOS) for _, p in pan]
        fr = Image.new('RGB', (max(sum(p.width + 12 for p in pp), 520), alto + 56), 'white'); d = ImageDraw.Draw(fr); x = 0
        d.text((2, 2), f'Muñeca de {alto} px de alto' + (' (aprox. «Mi Mundo»)' if alto < 300 else ''), font=MK.F(16), fill=(40, 40, 60))
        for (t, _), p in zip(pan, pp):
            fr.paste(p, (x, 52)); d.text((x + 2, 28), t, font=MK.F(13 if alto < 300 else 15), fill=(90, 80, 110)); x += p.width + 12
        filas.append(fr)
    cs = [p.crop(cara).resize((750, 795), Image.LANCZOS) for _, p in pan[:2]]
    fr = Image.new('RGB', (1510, 830), 'white'); d = ImageDraw.Draw(fr)
    for i, ((t, _), c) in enumerate(zip(pan[:2], cs)):
        d.text((i * 760 + 4, 6), t + ' · cuello y orejas ×1,5', font=MK.F(20), fill=(40, 40, 60)); fr.paste(c, (i * 760, 34))
    filas.append(fr)
    out = Image.new('RGB', (max(r.width for r in filas), sum(r.height + 10 for r in filas)), 'white'); y = 0
    for r in filas:
        out.paste(r, (0, y)); y += r.height + 10
    out.save(AQUI / 'vista-montaje-revisado.png', optimize=True)
    caja_m = (250, 830, 430, 1030)
    fr = Image.new('RGB', (2 * 370 + 10, 440), 'white'); d = ImageDraw.Draw(fr)
    for i, (t, p) in enumerate((('Mechón del brazo · antes ×2', pan[0][1]), ('Mechón del brazo · revisado ×2', pan[1][1]))):
        d.text((i * 380 + 4, 6), t, font=MK.F(17), fill=(40, 40, 60)); fr.paste(p.crop(caja_m).resize((360, 400), Image.LANCZOS), (i * 380, 34))
    fr.save(AQUI / 'vista-mechon-brazo.png', optimize=True)
    for nombre, recorte, esc in (('parpadeo-revisado-tamano-juego.gif', caja, 480 / 1520), ('parpadeo-revisado-cara.gif', (230, 170, 730, 580), 1.2)):
        a_, c_ = MP.blanco(estados['abiertos']).crop(recorte), MP.blanco(estados['cerrados']).crop(recorte)
        tam = (round(a_.width * esc), round(a_.height * esc)); a_, c_ = a_.resize(tam, Image.LANCZOS), c_.resize(tam, Image.LANCZOS)
        a_.save(AQUI / nombre, save_all=True, append_images=[c_, a_, c_, a_], duration=[1200, 200, 1000, 200, 600], loop=0, optimize=True)
    # zonas que este método no resuelve con calidad: los rizos que caían sobre la manga del jersey
    hueco_jersey = nd.binary_dilation(quitado & Z['jersey'], iterations=14)
    lb, n = nd.label(hueco_jersey); pend = []
    marca = MP.blanco(estados['abiertos']); dp = ImageDraw.Draw(marca)
    for k, sl in enumerate(nd.find_objects(lb)):
        if (lb[sl] == k + 1).sum() < 3000:
            continue
        x0, y0, x1, y1 = sl[1].start, sl[0].start, sl[1].stop, sl[0].stop
        lado = 'izquierdo' if (x0 + x1) / 2 < 479 else 'derecho'
        pend.append(dict(zona=f'interior de los rizos sobre el brazo {lado}', caja=[int(x0), int(y0), int(x1), int(y1)],
                         motivo='al quitar la manga rosa de la referencia, los huecos de los rizos dejan ver el brazo y '
                                'conservan un filo rojizo; hay que redibujar el interior de esos rizos'))
        dp.ellipse((x0 - 8, y0 - 8, x1 + 8, y1 + 8), outline=(230, 30, 30), width=5)
    dp.text((50, 1080), 'Rojo: zonas que este método no resuelve con calidad (trabajar a mano)', font=MK.F(22), fill=(200, 20, 20))
    marca.crop((40, 40, 910, 1120)).save(AQUI / 'zonas-pendientes.png', optimize=True)
    # comprobaciones
    despues = {k: sha(PROP.parents[2] / k) for k in antes}
    op = ba == 255
    cara_intacta = bool((estados['abiertos'][Z['cara_baja'] & op] == montar(np.zeros_like(sin), sin, ab, np.zeros_like(sin))[Z['cara_baja'] & op]).all())
    colores = (limpio[..., :3] == pelo[..., :3]) | (limpio[..., 3:] == 0)
    comp_ = dict(fuentes_sin_cambios=antes == despues, sha256_fuentes=antes, escala='ninguna (se usa el pelo ya colocado a 1,0934)',
                 cara_orejas_cuello_de_la_base_sin_nada_encima=cara_intacta,
                 limpieza_solo_opacidad_sin_cambiar_colores=bool(colores.all()),
                 limpiado_px=int(quitado.sum()), reconstruido_visible_px=int(reconstruido.sum()),
                 trozos_reconstruidos=trozos_info, mechon=dict(info_mechon, afilado_px=int(afilado.sum())),
                 huecos_sin_resolver=[t for t in trozos_info if not t['resuelto']], zonas_pendientes=pend)
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp_, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp_.items() if k not in ('trozos_reconstruidos', 'sha256_fuentes')}, ensure_ascii=False))
