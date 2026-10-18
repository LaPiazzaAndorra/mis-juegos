#!/usr/bin/env python3
"""
Dos coletas completas (D-026), con y sin sombrero, en los cinco colores de pelo (D-022) y los cuatro tonos de piel (D-023).

Las capas aprobadas (capas/completado/pelo-coletas-{con,sin}-sombrero-*.png, coleteros.png y sombrero-aventura.png) NO
cambian. Igual que con la coleta (D-025, ../peinado-coleta-2026-10-16/coleta_variantes.py):
  · color de pelo: la transformación aprobada de cada color de la melena, aplicada al pelo (el alfa no cambia);
  · los coleteros verdes y el sombrero no cambian con el color ni con la piel;
  · la cara y las orejas son las de nuestra base: con otro tono se usan las piezas aprobadas de ese tono (base, ojos
    abiertos y cerrados, manos y cejas a juego). En la capa de pelo aprobada quedaron trocitos del interior de la oreja
    de la imagen generada (sobre nuestra oreja derecha; con la piel clara no se notan): en las variantes se quitan, de
    forma que se ve nuestra oreja (también en el castaño); y, sin sombrero, el pelo de detrás que faltaba justo detrás
    del borde suave de nuestras orejas (se veía el fondo, una línea clara con pieles oscuras) se rellena con el pelo de
    al lado;
  · tono de piel (dorado, moreno, profundo): una capa pequeña de «bordes» por versión y color, encima del pelo de delante
    y debajo de los coleteros y el sombrero: en el borde del pelo junto a la piel que se ve (frente, sienes, junto a las
    orejas, cuello) la parte de piel clara pegada pasa a la piel nueva y la de pelo al pelo de alrededor (franja de 5 px
    como máximo), y la franja del cuero cabelludo en el borde de la cabeza se cubre con el pelo de detrás.

Salida: capas/variantes/pelo-coletas-{con,sin}-sombrero-{detras,delante}-{color}.png (20), capas/pieles/<tono>/
bordes-coletas-{con,sin}-{color}.png (30), revision-variantes/ y comprobaciones-variantes.json.

Uso (desde la raíz): python3 docs/propuestas/peinado-coletas-sombrero-2026-10-17/coletas2_variantes.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]
sys.path[:0] = [str(RAIZ / 'docs' / 'propuestas' / 'peinado-coleta-2026-10-16')]
import coleta_variantes as CV   # noqa: E402  (métodos aprobados con la coleta)
PT, CP, CJ, MK = CV.PT, CV.CP, CV.CJ, CV.MK
C = AQUI / 'capas'
VERSIONES = {v: {p: C / 'completado' / f'pelo-coletas-{v}-sombrero-{p}.png' for p in CV.PARTES} for v in ('con', 'sin')}
COLETEROS, SOMBRERO = C / 'coleteros.png', C / 'sombrero-aventura.png'
VAR, PIELES_DIR, REV = C / 'variantes', C / 'pieles', AQUI / 'revision-variantes'
COLORES, PIELES = CV.COLORES, CV.PIELES


OREJAS_Y, OREJAS_X = (430, 550), (318, 640)        # nuestras orejas: a esta altura, fuera de estas columnas de la cara


def orejas_base(base):
    """Nuestras orejas: la base a su altura, a los lados de la cara."""
    YY, XX = np.mgrid[0:base.shape[0], 0:base.shape[1]]
    dentro = nd.binary_erosion(base[..., 3] == 255, iterations=2)       # sin el borde suave (detrás sigue el pelo)
    return dentro & (YY >= OREJAS_Y[0]) & (YY < OREJAS_Y[1]) & ((XX < OREJAS_X[0]) | (XX > OREJAS_X[1]))


def restos_de_oreja(capa, base):
    """En el diseño aprobado las orejas van delante del pelo: lo que la capa de pelo tenga encima de nuestras orejas son
    restos de la oreja de la imagen generada (con la piel clara no se notaban; con otro tono o color se verían). Se
    quitan, de forma que se ve nuestra oreja."""
    return orejas_base(base) & (capa[..., 3] > 0)


def tapar_borde_de_la_base(capa, base, ancho=4):
    """Pelo de detrás que falta justo detrás del borde suave (semitransparente) de nuestra base junto a las orejas: por
    ahí se veía el fondo (una línea clara alrededor de la oreja con pieles oscuras). Se rellena con el pelo de detrás más
    cercano; va detrás de la base, así que solo se ve a través de ese borde."""
    YY = np.mgrid[0:capa.shape[0], 0:capa.shape[1]][0]
    borde = nd.binary_dilation(base[..., 3] > 0, iterations=2) & (base[..., 3] < 255) & (YY >= OREJAS_Y[0] - 20) & (YY < OREJAS_Y[1] + 20)   # con los puntitos transparentes del borde
    hay = capa[..., 3] == 255
    d, (iy, ix) = nd.distance_transform_edt(~hay, return_indices=True)
    falta = borde & (capa[..., 3] < 255) & (d <= ancho)
    out = capa.copy(); out[falta] = capa[iy[falta], ix[falta]]
    return out, int(falta.sum())


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    fuentes = [p for v in VERSIONES.values() for p in v.values()] + [COLETEROS, SOMBRERO, PT.SIN_OJOS, CP.DETRAS, CP.DELANTE, CP.REF, PT.REF]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    for d in (VAR, REV, *[PIELES_DIR / t for t in PT.TONOS]):
        d.mkdir(parents=True, exist_ok=True)
    ref_pelo = MK.lab_de(Image.open(CP.REF).convert('RGBA')).astype(float)
    melena = [PT.abrir(CP.DETRAS), PT.abrir(CP.DELANTE)]
    G = {k: CP.transformacion(melena, CP.muestra_referencia(ref_pelo, caja)[0])[0] for k, caja in CP.RECUADROS.items()}
    medidas, _ = PT.medir_lamina()
    F = {t: PT.transformacion(medidas, t)[0] for t in PT.TONOS}
    base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(base); wb, _ = PT.peso_base(base, lab)
    D = CJ.preparar(); wb[D['hay']] = 0
    fijas = {k: PT.abrir(p) for k, p in PT.SIN_PIEL.items()}
    encima = (fijas['vestido'][..., 3] > 0) | (fijas['zapatos'][..., 3] > 0)
    pieles = {t: CV.piezas_piel(t) for t in PIELES}
    coleteros, sombrero = PT.abrir(COLETEROS), PT.abrir(SOMBRERO)
    tapan = (coleteros[..., 3] > 0) | (sombrero[..., 3] > 0)
    orig = {v: {p: PT.abrir(r) for p, r in rutas.items()} for v, rutas in VERSIONES.items()}
    quitados = {}
    for v in orig:
        for p in CV.PARTES:
            r = restos_de_oreja(orig[v][p], base); quitados[f'{v}-{p}'] = int(r.sum())
            c = orig[v][p].copy(); c[r] = 0
            if p == 'detras':
                c, n = tapar_borde_de_la_base(c, base); quitados[f'{v}-borde'] = n
            orig[v][p] = c

    # 1) color de pelo
    pelo = {}
    for v in VERSIONES:
        for p in CV.PARTES:
            pelo[(v, p, 'castano')] = orig[v][p]
            for k in G:
                pelo[(v, p, k)] = CV.recolor(orig[v][p], G[k])
            for k in COLORES:
                Image.fromarray(pelo[(v, p, k)]).save(VAR / f'pelo-coletas-{v}-sombrero-{p}-{k}.png', optimize=True)
    info = dict(versiones={})
    for v in VERSIONES:
        info['versiones'][v] = dict(alfa_igual_en_los_5_colores=all(bool((pelo[(v, p, k)][..., 3] == orig[v][p][..., 3]).all()) for p in CV.PARTES for k in COLORES),
                                    restos_de_oreja_quitados_px={p: quitados[f'{v}-{p}'] for p in CV.PARTES}, borde_de_la_oreja_tapado_px=quitados[f'{v}-borde'], pieles={})

    # 2) bordes por tono de piel (sin orejas que excluir: las orejas son de nuestra base)
    nada = np.zeros(base.shape[:2], bool)
    for v in VERSIONES:
        de0, dt0 = orig[v]['delante'], orig[v]['detras']
        cuero = PT.cuero_cabelludo(base, de0, dt0)
        tapa_v = tapan if v == 'con' else (coleteros[..., 3] > 0)
        V = PT.piel_visible(base, wb, de0, encima | tapa_v, cuero)
        S_alr, denS = PT.piel_de_alrededor(lab, V)
        borde = {p: CV.separar_borde(orig[v][p], V, S_alr, denS, encima | tapa_v, nada) for p in CV.PARTES}
        dV = nd.distance_transform_edt(~V)
        for t in PT.TONOS:
            b2 = pieles[t]['base']; fS = F[t](S_alr); it = {}
            for k in COLORES:
                corr = {}
                for p in CV.PARTES:
                    c = pelo[(v, p, k)]; s, tau, dentro = borde[p]
                    if p == 'detras':
                        tau = tau * (base[..., 3] < 250)
                    objetivo = s[..., None] * fS + (1 - s[..., None]) * PT.pelo_de_alrededor(c, dentro, CV.SIGMA)
                    nl = PT.lab_de(c) * (1 - tau[..., None]) + objetivo * tau[..., None]
                    nueva = c.copy(); sl = tau > 0; nueva[sl, :3] = PT.a_rgb(nl)[sl]
                    corr[p] = (nueva, tau)
                dtk = pelo[(v, 'detras', k)]
                actual = PT.montar_rgba([dtk, b2, pelo[(v, 'delante', k)]]); obj = PT.montar_rgba([corr['detras'][0], b2, corr['delante'][0]])
                Hb = CP.lab_a_rgb(PT.pelo_de_alrededor(dtk, dtk[..., 3] == 255)).astype(float)
                cu = cuero * ~tapa_v
                o3 = obj[..., :3].astype(float) * (1 - cu[..., None]) + Hb * cu[..., None]
                sel = ((corr['delante'][1] > 0) | (corr['detras'][1] > 0) | (cu > 0)) & (actual[..., 3] >= 250) & ~tapa_v
                capa = CJ.capa_sobre(actual, o3, sel)
                Image.fromarray(capa).save(PIELES_DIR / t / f'bordes-coletas-{v}-{k}.png', optimize=True)
                lejos = (capa[..., 3] > 0) & (dV > CV.CERCA) & (cu == 0)
                it[k] = dict(px=int((capa[..., 3] > 0).sum()), pelo_tocado_lejos_de_la_piel_px=int(lejos.sum()))
            info['versiones'][v]['pieles'][t] = it

    # 3) montajes (orden del visor) y comprobaciones: borde del pelo más claro que la piel de alrededor
    def montaje(v, t, k, ojos='ojos', con_bordes=True, fondo=(255, 250, 245)):
        pz = pieles[t]; cj = CV.cejas(t, k)
        capas = [pelo[(v, 'detras', k)], pz['base']] + ([cj] if cj is not None else []) + [pz[ojos], fijas['zapatos']]
        capas += ([] if t == 'claro' else [PT.abrir(CV.PTD / t / 'bordes-zapatos.png')]) + [fijas['vestido']]
        capas += ([] if t == 'claro' else [PT.abrir(CV.PTD / t / 'bordes-vestido.png')]) + [pz['manos'], pelo[(v, 'delante', k)]]
        if t != 'claro' and con_bordes:
            capas.append(PT.abrir(PIELES_DIR / t / f'bordes-coletas-{v}-{k}.png'))
        capas += [coleteros] + ([sombrero] if v == 'con' else [])
        x = Image.new('RGBA', (948, 1659), (0, 0, 0, 0))
        for c in capas:
            x.alpha_composite(Image.fromarray(c))
        bg = Image.new('RGBA', x.size, fondo + (255,)); bg.alpha_composite(x)
        return bg.convert('RGB')

    lab_rgb = lambda im: MK.lab_de(Image.fromarray(np.dstack([np.array(im), np.full((1659, 948), 255, np.uint8)]))).astype(float)
    YY = np.mgrid[0:1659, 0:948][0]
    for v in VERSIONES:
        de0, dt0 = orig[v]['delante'], orig[v]['detras']
        tapa_v = tapan if v == 'con' else (coleteros[..., 3] > 0)
        Vv = PT.piel_visible(base, wb, de0, encima | tapa_v, PT.cuero_cabelludo(base, de0, dt0))
        franja = nd.binary_dilation(Vv, iterations=3) & ~nd.binary_erosion(Vv, iterations=2) & ~encima & ~tapa_v & (YY < 640)
        res = {}
        for t in PIELES:
            for k in COLORES:
                r = {}
                for nombre, cb in (('antes', False), ('despues', True)):
                    L = lab_rgb(montaje(v, t, k, con_bordes=cb))
                    piel_L = nd.gaussian_filter(L[..., 0] * Vv, 6) / np.maximum(nd.gaussian_filter(Vv * 1.0, 6), 1e-6)
                    r[nombre] = int((franja & (L[..., 0] > piel_L + 20)).sum())
                res[f'{t}-{k}'] = dict(borde_mas_claro_que_la_piel_px_antes=r['antes'], despues=r['despues'])
        info['versiones'][v]['montaje'] = res
    info['sha256_fuentes'] = antes; info['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones-variantes.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')

    # 4) vistas: las 20 combinaciones (ojos abiertos y cerrados) y el detalle a tamaño real de los bordes
    F15 = MK.F(15)

    def rejilla(v, ojos='ojos', caja=(60, 0, 900, 1000), esc=0.3):
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
        rejilla(v).save(REV / f'combinaciones-{v}-sombrero.png', optimize=True)
        rejilla(v, ojos='cerrados').save(REV / f'parpadeo-{v}-sombrero.png', optimize=True)
    ZONAS = [('Frente y sienes', (250, 180, 700, 420)), ('Orejas y coleteros', (180, 380, 780, 560)), ('Cuello', (380, 540, 580, 660))]
    for v in VERSIONES:
        for t in PT.TONOS:
            filas = [(k, [[im.crop(z) for im in (montaje(v, t, k, con_bordes=False), montaje(v, t, k), montaje(v, t, k, fondo=(40, 40, 55)))] for _, z in ZONAS]) for k in COLORES]
            H = max(z[3] - z[1] for _, z in ZONAS); W = 170 + sum(3 * (z[2] - z[0]) + 24 for _, z in ZONAS)
            out = Image.new('RGB', (W, 46 + len(filas) * (H + 8)), 'white'); d = ImageDraw.Draw(out); x = 170
            for nz, z in ZONAS:
                d.text((x, 4), nz, font=F15, fill=(40, 40, 60)); d.text((x, 24), 'antes · después · después (fondo oscuro)', font=MK.F(12), fill=(90, 90, 110)); x += 3 * (z[2] - z[0]) + 24
            for j, (k, grupos) in enumerate(filas):
                y = 46 + j * (H + 8); d.text((4, y + H // 2 - 8), f'{PT.NOMBRES[t]} · {CP.NOMBRES[k]}', font=MK.F(13), fill=(40, 40, 60)); x = 170
                for g_ in grupos:
                    for im in g_:
                        out.paste(im, (x, y)); x += im.width
                    x += 24
            out.save(REV / f'detalle-{v}-sombrero-{t}.png', optimize=True)
    print(json.dumps({v: {a: b for a, b in iv.items() if a != 'montaje'} for v, iv in info['versiones'].items()}, ensure_ascii=False))
    for v, iv in info['versiones'].items():
        print(v, {k: (r['borde_mas_claro_que_la_piel_px_antes'], r['despues']) for k, r in iv['montaje'].items()})
    print('fuentes sin cambios:', info['fuentes_sin_cambios'])
