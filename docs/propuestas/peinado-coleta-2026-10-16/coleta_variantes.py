#!/usr/bin/env python3
"""
Coleta (D-025), con y sin cinta, en los cinco colores de pelo (D-022) y los cuatro tonos de piel (D-023).

Las capas aprobadas de la coleta (con cinta: capas/pelo-coleta-*.png; sin cinta: capas/candidata-sin-cinta/*.png) NO
cambian. Las variantes se hacen con los mismos métodos aprobados para la melena:

  · Orejas: en la coleta, las orejas que se ven son las de la imagen aprobada y van DENTRO de las capas de pelo (delante
    y detrás). Se separan del pelo (semillas de piel y de mechones, reparto por contraste) y pasan a una capa propia,
    justo debajo de su capa de pelo, de forma que el montaje queda igual que el aprobado (pelo encima de la oreja, con
    la misma transparencia en total). Así las orejas no cambian con el color de pelo y, con otro tono de piel, llevan
    la transformación aprobada de la piel (piel_tonos.transformacion) también en su borde suave, con un ajuste: la oreja
    de la imagen tiene sombras y una línea dibujada mucho más oscuras que nuestra piel, y la transformación (que suma
    las diferencias de luminosidad) las llevaba casi a negro en la piel profunda; en las orejas, la luminosidad es la
    media entre la aprobada y la que conserva el contraste relativo de la imagen (L + 16 multiplicado por la razón de
    los dos tonos). El color (tono y saturación) es el de la transformación aprobada. Son las mismas con y sin cinta
    (la cinta no llega a las orejas).
  · Color de pelo: la transformación de cada color de la melena (colores_pelo.transformacion, calculada con las capas
    de la melena), aplicada al pelo de la coleta. El castaño es el original. El alfa no cambia.
  · Tono de piel (dorado, moreno, profundo): además de las orejas, una capa pequeña de «bordes» por versión y color de
    pelo, encima del pelo de delante y debajo de la cinta: en el borde del pelo junto a la piel que se ve (nacimiento
    del pelo, sienes, junto a las orejas, cuello) se separa la parte de piel clara pegada y la de pelo (como
    piel_tonos.separar_borde, con la franja estrecha del cuello del vestido: el borde de la coleta es de 1–3 px); y la
    franja del cuero cabelludo en el borde de la cabeza se cubre con el pelo de detrás de alrededor. La piel clara no
    lleva bordes.
  · Las cejas a juego, los ojos (abiertos y cerrados), la base y las manos de cada tono son las aprobadas (piel-tonos/).

Salida (capas/variantes/ y capas/pieles/<tono>/): pelo de la coleta sin las orejas (con y sin cinta, delante y detrás,
5 colores: 20), orejas (delante y detrás: 2, y 2 por tono), bordes (2 versiones × 5 colores por tono: 30),
comprobaciones-variantes.json y vistas de revisión en revision-variantes/.

Uso (desde la raíz): python3 docs/propuestas/peinado-coleta-2026-10-16/coleta_variantes.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; sys.path[:0] = [str(AQUI)]
import coleta as CO   # noqa: E402
PT = CO.PT; CP = PT.CP; CJ = PT.CJ; MK = PT.MK
PTD = PT.AQUI                                          # piezas aprobadas de cada tono de piel

CAPAS = AQUI / 'capas'
VERSIONES = {'con': {'detras': CAPAS / 'pelo-coleta-detras.png', 'delante': CAPAS / 'pelo-coleta-delante.png'},
             'sin': {'detras': CAPAS / 'candidata-sin-cinta' / 'pelo-coleta-sin-cinta-detras.png',
                     'delante': CAPAS / 'candidata-sin-cinta' / 'pelo-coleta-sin-cinta-delante.png'}}
PARTES = ('detras', 'delante')
CINTA = CAPAS / 'cinta-coleta.png'
COLORES = ['castano'] + list(CP.RECUADROS)
PIELES = ['claro'] + PT.TONOS
CAJA_OREJAS = [(235, 400, 335, 560), (615, 400, 725, 560)]      # x0, y0, x1, y1 en el lienzo de la muñeca
DESPLAZ = 16 * 2.55                              # el 16 de L* (en la escala 0–255 de la Lab de 8 bits)
CERCA, INTERIOR, SIGMA = 5.0, (3, 8), 4          # franja corregida junto a la piel; pelo «de dentro» (px) y su desenfoque
VAR, PIELES_DIR, REV = CAPAS / 'variantes', CAPAS / 'pieles', AQUI / 'revision-variantes'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def orejas(capa):
    """Parte de oreja (0–1) de cada píxel de una capa de la coleta. Semillas: piel (clara o rojiza: la oreja) y mechones
    (oscuros y amarillentos); el resto se reparte por contraste (watershed). Fuera de los recuadros de las orejas, pelo.
    La línea oscura dibujada en el contorno de la oreja va con el pelo (así sigue siendo una línea continua, del color
    del pelo de alrededor). Transición suave de ~1,5 px entre oreja y pelo (no en el borde exterior: ahí la oreja
    sigue siendo oreja)."""
    lab = PT.lab_de(capa); L = lab[..., 0]; C = np.hypot(lab[..., 1], lab[..., 2]); h = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    A = capa[..., 3]; YY, XX = np.mgrid[0:A.shape[0], 0:A.shape[1]]
    caja = np.zeros(A.shape, bool)
    for x0, y0, x1, y1 in CAJA_OREJAS:
        caja |= (XX > x0) & (XX < x1) & (YY > y0) & (YY < y1)
    piel = caja & (A == 255) & (((h < 43) & (C > 55)) | ((L > 140) & (h < 53)))
    piel = nd.binary_opening(piel, iterations=1); et, n = nd.label(piel); s = nd.sum(piel, et, range(1, n + 1))
    piel = np.isin(et, 1 + np.where(s > 25)[0])
    pelo = nd.binary_erosion(caja & (A > 0) & (((h >= 47) & (L < 112)) | (L < 85)), iterations=1)
    sem = np.zeros(A.shape, np.int32); sem[pelo] = 2; sem[piel] = 1; sem[A == 0] = 3; sem[~caja & (A > 0)] = 2
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(lab[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(lab[..., i], 1), 1) ** 2 for i in range(3)))
    oreja = (watershed(g, sem) == 1) & caja
    banda = nd.binary_dilation(oreja, iterations=3) & ~nd.binary_erosion(oreja, iterations=2)
    oreja &= ~(banda & (L < 120) & (h >= 44))                  # línea del contorno: con el pelo
    hay = (A > 0).astype(float)
    s = nd.gaussian_filter(oreja * 1.0, 1.5) / np.maximum(nd.gaussian_filter(hay, 1.5), 1e-6)
    return np.clip(s, 0, 1) * (A > 0) * caja


def separar(capa, s):
    """Pelo (encima) y oreja (debajo) con el mismo color; juntos dan exactamente la capa original: el pelo con alfa
    α·(1−s) y la oreja con el alfa que completa α."""
    a = capa[..., 3] / 255.0
    ah = np.round(255 * a * (1 - s)) / 255
    ae = np.where(ah < 1, (a - ah) / np.maximum(1 - ah, 1e-6), 0)
    pelo, oreja = capa.copy(), capa.copy()
    pelo[..., 3] = np.round(ah * 255).astype(np.uint8); oreja[..., 3] = np.clip(np.round(ae * 255), 0, 255).astype(np.uint8)
    pelo[pelo[..., 3] == 0] = 0; oreja[oreja[..., 3] == 0] = 0
    return pelo, oreja


def separar_borde(capa, V, S, denS, encima, excluir):
    """Como piel_tonos.separar_borde (con la franja estrecha del cuello del vestido), sin las orejas."""
    A = capa[..., 3]; O = PT.lab_de(capa)
    dV = nd.distance_transform_edt(~V); dA = nd.distance_transform_edt(A > 0)
    dentro = (A == 255) & (dA > INTERIOR[0]) & (dA <= INTERIOR[1]) & ~excluir
    Hc, denH = PT.piel_de_alrededor(O, dentro, SIGMA)
    d = S - Hc; e = O - Hc
    s = np.clip((d * e).sum(-1) / np.maximum((d * d).sum(-1), 1e-6), 0, 1)
    tau = np.clip((CERCA - dV) / (CERCA / 2), 0, 1) * (A > 0) * ~encima * (denH > 0.02) * (denS > 0.02) * ~excluir
    return s, tau, dentro


def recolor(capa, g):
    o = capa.copy(); m = capa[..., 3] > 0; o[m, :3] = CP.lab_a_rgb(g(PT.lab_de(capa)))[m]
    return o


def piezas_piel(t, ojo='marron'):
    if t == 'claro':
        return dict(base=PT.abrir(PT.SIN_OJOS), ojos=PT.abrir(PT.OJOS[ojo]), cerrados=PT.abrir(PT.CERRADOS), manos=PT.abrir(PT.MANOS))
    d = PTD / t
    return dict(base=PT.abrir(d / 'base-sin-ojos.png'), ojos=PT.abrir(d / f'ojos-abiertos-{ojo}.png'),
                cerrados=PT.abrir(d / 'ojos-cerrados.png'), manos=PT.abrir(d / 'manos-delante.png'))


def cejas(t, k):
    if k == 'castano':
        return None
    return PT.abrir(CJ.AQUI / f'cejas-{k}.png') if t == 'claro' else PT.abrir(PTD / t / f'cejas-{k}.png')


if __name__ == '__main__':
    fuentes = [p for v in VERSIONES.values() for p in v.values()] + [CINTA, PT.SIN_OJOS, CP.DETRAS, CP.DELANTE, CP.REF, PT.REF]
    fuentes += [PTD / t / n for t in PT.TONOS for n in ['base-sin-ojos.png', 'ojos-cerrados.png', 'manos-delante.png', 'ojos-abiertos-marron.png'] + [f'cejas-{k}.png' for k in CP.RECUADROS]]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    for d in (VAR, REV, *[PIELES_DIR / t for t in PT.TONOS]):
        d.mkdir(parents=True, exist_ok=True)

    # transformaciones aprobadas: color de pelo (con las capas de la melena) y tono de piel (medidas de la lámina)
    ref_pelo = MK.lab_de(Image.open(CP.REF).convert('RGBA')).astype(float)
    melena = [PT.abrir(CP.DETRAS), PT.abrir(CP.DELANTE)]
    G = {k: CP.transformacion(melena, CP.muestra_referencia(ref_pelo, caja)[0])[0] for k, caja in CP.RECUADROS.items()}
    medidas, _ = PT.medir_lamina()
    F = {t: PT.transformacion(medidas, t)[0] for t in PT.TONOS}

    # la piel que se ve (como en piel_tonos): sin cejas, sin vestido ni zapatos encima
    base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(base); wb, _ = PT.peso_base(base, lab)
    D = CJ.preparar(); wb[D['hay']] = 0
    fijas = {k: PT.abrir(p) for k, p in PT.SIN_PIEL.items()}
    encima = (fijas['vestido'][..., 3] > 0) | (fijas['zapatos'][..., 3] > 0)
    pieles = {t: piezas_piel(t) for t in PIELES}
    cinta = PT.abrir(CINTA)
    orig = {v: {p: PT.abrir(r) for p, r in rutas.items()} for v, rutas in VERSIONES.items()}
    zona_orejas = np.zeros(base.shape[:2], bool)
    for x0, y0, x1, y1 in CAJA_OREJAS:
        zona_orejas[y0:y1, x0:x1] = True
    assert all((orig['con'][p][zona_orejas] == orig['sin'][p][zona_orejas]).all() for p in PARTES), 'las orejas no son las mismas con y sin cinta'

    # 1) orejas en capa propia (las mismas con y sin cinta) y pelo sin orejas
    sig = {p: orejas(orig['con'][p]) for p in PARTES}
    oreja = {('claro', p): separar(orig['con'][p], sig[p])[1] for p in PARTES}
    for p in PARTES:
        Image.fromarray(oreja[('claro', p)]).save(VAR / f'orejas-coleta-{p}.png', optimize=True)
        for t in PT.TONOS:
            e = oreja[('claro', p)].copy(); m = e[..., 3] > 0
            le = PT.lab_de(e); n = F[t](le)
            razon = (medidas[t]['L'] + DESPLAZ) / (medidas['claro']['L'] + DESPLAZ)
            n[..., 0] = 0.5 * n[..., 0] + 0.5 * ((le[..., 0] + DESPLAZ) * razon - DESPLAZ)
            e[m, :3] = PT.a_rgb(n)[m]
            oreja[(t, p)] = e; Image.fromarray(e).save(PIELES_DIR / t / f'orejas-coleta-{p}.png', optimize=True)
    pelo = {}
    for v in VERSIONES:
        for p in PARTES:
            pelo[(v, p, 'castano')] = separar(orig[v][p], sig[p])[0]
            for k in G:
                pelo[(v, p, k)] = recolor(pelo[(v, p, 'castano')], G[k])
            for k in COLORES:
                Image.fromarray(pelo[(v, p, k)]).save(VAR / f'pelo-coleta-{v}-{p}-{k}.png', optimize=True)

    info = dict(metodo=[x.strip() for x in __doc__.strip().split('\n\n')[1:3]], orejas_px={p: int((sig[p] > 0.5).sum()) for p in PARTES}, versiones={})
    # el montaje castaño con piel clara (orejas + pelo sin orejas) es el aprobado, sobre cualquier fondo
    for v in VERSIONES:
        dif = 0
        for fondo in ((255, 250, 245), (40, 40, 55), (0, 255, 0)):
            for p in PARTES:
                bg = np.zeros_like(orig[v][p]); bg[...] = fondo + (255,)
                a = PT.montar_rgba([bg, orig[v][p]]).astype(int); b = PT.montar_rgba([bg, oreja[('claro', p)], pelo[(v, p, 'castano')]]).astype(int)
                dif = max(dif, int(np.abs(a - b).max()))
        info['versiones'][v] = dict(castano_claro_igual_al_aprobado_dif_max=dif,
                                    alfa_de_cada_color_igual=all(bool((pelo[(v, p, k)][..., 3] == pelo[(v, p, 'castano')][..., 3]).all()) for p in PARTES for k in COLORES),
                                    pieles={})

    # 2) bordes por tono de piel
    excl = {p: nd.binary_dilation(sig[p] > 0.02, iterations=1) for p in PARTES}
    for v in VERSIONES:
        de0, dt0 = orig[v]['delante'], orig[v]['detras']
        cuero = PT.cuero_cabelludo(base, de0, dt0)
        V = PT.piel_visible(base, wb, de0, encima, cuero)
        S_alr, denS = PT.piel_de_alrededor(lab, V)
        borde = {p: separar_borde(pelo[(v, p, 'castano')], V, S_alr, denS, encima, excl[p]) for p in PARTES}
        dV = nd.distance_transform_edt(~V)
        for t in PT.TONOS:
            b2 = pieles[t]['base']; fS = F[t](S_alr); it = {}
            for k in COLORES:
                corr = {}
                for p in PARTES:
                    c = pelo[(v, p, k)]; s, tau, dentro = borde[p]
                    if p == 'detras':
                        tau = tau * (base[..., 3] < 250)          # el de detrás solo se ve fuera de la silueta de la base
                    objetivo = s[..., None] * fS + (1 - s[..., None]) * PT.pelo_de_alrededor(c, dentro, SIGMA)
                    nl = PT.lab_de(c) * (1 - tau[..., None]) + objetivo * tau[..., None]
                    nueva = c.copy(); sl = tau > 0; nueva[sl, :3] = PT.a_rgb(nl)[sl]
                    corr[p] = (nueva, tau)
                dtk = pelo[(v, 'detras', k)]
                pila = lambda d_, e_: PT.montar_rgba([oreja[(t, 'detras')], d_, b2, oreja[(t, 'delante')], e_])
                actual = pila(dtk, pelo[(v, 'delante', k)]); obj = pila(corr['detras'][0], corr['delante'][0])
                Hb = CP.lab_a_rgb(PT.pelo_de_alrededor(dtk, dtk[..., 3] == 255)).astype(float)
                o3 = obj[..., :3].astype(float) * (1 - cuero[..., None]) + Hb * cuero[..., None]
                sel = ((corr['delante'][1] > 0) | (corr['detras'][1] > 0) | (cuero > 0)) & (actual[..., 3] >= 250)
                capa = CJ.capa_sobre(actual, o3, sel)
                Image.fromarray(capa).save(PIELES_DIR / t / f'bordes-coleta-{v}-{k}.png', optimize=True)
                lejos = (capa[..., 3] > 0) & (dV > CERCA) & (cuero == 0)
                it[k] = dict(px=int((capa[..., 3] > 0).sum()), pelo_tocado_lejos_de_la_piel_px=int(lejos.sum()))
            info['versiones'][v]['pieles'][t] = it

    if '--solo-capas' in sys.argv:                                     # para probar ajustes: sin comprobaciones ni vistas
        sys.exit(0)

    # 3) comprobaciones en el montaje (como en el visor)
    def montaje(v, t, k, ojos='ojos', con_bordes=True, fondo=(255, 250, 245)):
        pz = pieles[t]; cj = cejas(t, k)
        capas = [oreja[(t, 'detras')], pelo[(v, 'detras', k)], pz['base']] + ([cj] if cj is not None else [])
        capas += [pz[ojos], fijas['zapatos'], fijas['vestido'], pz['manos'], oreja[(t, 'delante')], pelo[(v, 'delante', k)]]
        if t != 'claro' and con_bordes:
            capas.append(PT.abrir(PIELES_DIR / t / f'bordes-coleta-{v}-{k}.png'))
        if v == 'con':
            capas.append(cinta)
        x = Image.new('RGBA', (948, 1659), (0, 0, 0, 0))
        for c in capas:
            x.alpha_composite(Image.fromarray(c))
        bg = Image.new('RGBA', x.size, fondo + (255,)); bg.alpha_composite(x)
        return bg.convert('RGB')

    def montaje_sin_variantes(v, t, k):     # «antes»: las capas aprobadas tal cual (orejas dentro del pelo, sin bordes)
        pz = pieles[t]; cj = cejas(t, k)
        x = Image.new('RGBA', (948, 1659), (0, 0, 0, 0))
        dt = orig[v]['detras'] if k == 'castano' else recolor(orig[v]['detras'], G[k])
        de = orig[v]['delante'] if k == 'castano' else recolor(orig[v]['delante'], G[k])
        for c in [dt, pz['base']] + ([cj] if cj is not None else []) + [pz['ojos'], fijas['zapatos'], fijas['vestido'], pz['manos'], de] + ([cinta] if v == 'con' else []):
            x.alpha_composite(Image.fromarray(c))
        bg = Image.new('RGBA', x.size, (255, 250, 245, 255)); bg.alpha_composite(x)
        return bg.convert('RGB')

    lab_rgb = lambda im: MK.lab_de(Image.fromarray(np.dstack([np.array(im), np.full((1659, 948), 255, np.uint8)]))).astype(float)
    YY = np.mgrid[0:1659, 0:948][0]
    nucleo_oreja = {p: (sig[p] > 0.99) & nd.binary_erosion(orig['con'][p][..., 3] == 255, iterations=3) for p in PARTES}
    oreja_ve = nucleo_oreja['delante'] | (nucleo_oreja['detras'] & (base[..., 3] == 0))
    for v in VERSIONES:
        de0, dt0 = orig[v]['delante'], orig[v]['detras']
        Vv = PT.piel_visible(base, wb, de0, encima, PT.cuero_cabelludo(base, de0, dt0))
        franja = nd.binary_dilation(Vv, iterations=3) & ~nd.binary_erosion(Vv, iterations=2) & ~encima & (YY < 600)
        franja &= ~nd.binary_dilation(sig['delante'] > 0.02, iterations=3) & ~nd.binary_dilation(sig['detras'] > 0.02, iterations=3)
        cara = Vv & (YY < 560)
        res = {}
        for t in PIELES:
            for k in COLORES:
                r = {}
                for nombre, im in (('antes', montaje_sin_variantes(v, t, k)), ('despues', montaje(v, t, k))):
                    L = lab_rgb(im); piel_L = nd.gaussian_filter(L[..., 0] * Vv, 6) / np.maximum(nd.gaussian_filter(Vv * 1.0, 6), 1e-6)
                    r[nombre] = dict(borde_mas_claro_que_la_piel_px=int((franja & (L[..., 0] > piel_L + 20)).sum()),
                                     oreja_menos_cara_L=round(float(np.median(L[..., 0][oreja_ve]) - np.median(L[..., 0][cara])), 1))
                res[f'{t}-{k}'] = r
        info['versiones'][v]['montaje'] = res
    info['sha256_fuentes'] = antes
    info['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones-variantes.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')

    # 4) vistas de revisión: todas las combinaciones (ojos abiertos y cerrados) y detalle a tamaño real de los bordes
    F15 = PT.MK.F(15)

    def rejilla(v, caja=(150, 40, 800, 760), esc=0.42, ojos='ojos'):
        w, h = round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)
        out = Image.new('RGB', (110 + 5 * (w + 6), 24 + 4 * (h + 6)), 'white'); d = ImageDraw.Draw(out)
        for i, k in enumerate(COLORES):
            d.text((110 + i * (w + 6) + 4, 4), CP.NOMBRES[k], font=F15, fill=(40, 40, 60))
        for j, t in enumerate(PIELES):
            d.text((4, 24 + j * (h + 6) + h // 2), PT.NOMBRES[t], font=F15, fill=(40, 40, 60))
            for i, k in enumerate(COLORES):
                out.paste(montaje(v, t, k, ojos=ojos).crop(caja).resize((w, h), Image.LANCZOS), (110 + i * (w + 6), 24 + j * (h + 6)))
        return out
    for v in VERSIONES:
        rejilla(v).save(REV / f'combinaciones-{v}-cinta.png', optimize=True)
        rejilla(v, ojos='cerrados').save(REV / f'parpadeo-{v}-cinta.png', optimize=True)
    ZONAS = [('Nacimiento del pelo y sienes', (290, 200, 670, 340)), ('Oreja izquierda', (215, 395, 345, 575)),
             ('Oreja derecha', (605, 395, 745, 575)), ('Cuello', (390, 540, 570, 640))]
    for v in VERSIONES:
        for t in PT.TONOS:
            filas = []
            for k in COLORES:
                ims = [montaje_sin_variantes(v, t, k), montaje(v, t, k), montaje(v, t, k, fondo=(40, 40, 55))]
                filas.append((k, [[im.crop(z) for im in ims] for _, z in ZONAS]))
            anchos = [z[2] - z[0] for _, z in ZONAS]; H = max(z[3] - z[1] for _, z in ZONAS)
            W = 170 + sum(3 * a + 24 for a in anchos)
            out = Image.new('RGB', (W, 46 + len(filas) * (H + 8)), 'white'); d = ImageDraw.Draw(out)
            x = 170
            for (nz, _), a in zip(ZONAS, anchos):
                d.text((x, 4), nz, font=F15, fill=(40, 40, 60)); d.text((x, 24), 'antes · después · después (fondo oscuro)', font=PT.MK.F(12), fill=(90, 90, 110)); x += 3 * a + 24
            for j, (k, grupos) in enumerate(filas):
                y = 46 + j * (H + 8); d.text((4, y + H // 2 - 8), f'{PT.NOMBRES[t]} · {CP.NOMBRES[k]}', font=PT.MK.F(13), fill=(40, 40, 60))
                x = 170
                for g_ in grupos:
                    for im in g_:
                        out.paste(im, (x, y)); x += im.width
                    x += 24
            out.save(REV / f'detalle-{v}-cinta-{t}.png', optimize=True)
    print(json.dumps({v: {x: y for x, y in iv.items() if x != 'montaje'} for v, iv in info['versiones'].items()}, ensure_ascii=False))
    for v, iv in info['versiones'].items():
        print(v, {k: (r['antes']['borde_mas_claro_que_la_piel_px'], r['despues']['borde_mas_claro_que_la_piel_px'], r['antes']['oreja_menos_cara_L'], r['despues']['oreja_menos_cara_L']) for k, r in iv['montaje'].items()})
    print('fuentes sin cambios:', info['fuentes_sin_cambios'])
