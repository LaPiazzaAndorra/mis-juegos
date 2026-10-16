#!/usr/bin/env python3
"""
CANDIDATA: pelo bajo la cinta (D-025), con la zona ampliada lo mínimo para que las uniones sean naturales.

De la imagen sin cinta (referencias/referencia-coleta-sin-cinta.png, generada, sin modificar) se toma solo el pelo de:
  · la zona de la cinta, más
  · una franja permitida alrededor: hasta 20 px por abajo (sobre la frente) y hasta 8 px por arriba y en las puntas.
Dentro de la franja, la unión se busca (watershed, como con los mechones de los hombros) donde las dos imágenes se
parecen más y por los huecos oscuros entre mechones, siguiendo sus curvas. Transición de 2 px.
No se toca: la piel, la frente y la cara (lo que en cualquiera de las dos imágenes es piel), ni la silueta exterior del
peinado (lo que en la aprobada es fondo). La coleta con cinta aprobada no cambia: con la cinta puesta se usan sus capas.

Salida (capas/candidata-sin-cinta/): pelo de delante y de detrás sin cinta (948 × 1659, como las aprobadas), la unión,
comprobaciones y vistas antes/después.

Uso (desde la raíz): python3 docs/propuestas/peinado-coleta-2026-10-16/sin_cinta.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; sys.path[:0] = [str(AQUI)]
import coleta as CO   # noqa: E402
PT = CO.PT; MK = CO.MK

A = CO.REF; Bn = AQUI / 'referencias' / 'referencia-coleta-sin-cinta.png'
SALIDA = AQUI / 'capas' / 'candidata-sin-cinta'
ABAJO, TRANS = 20, 2
OTROS = int(sys.argv[1]) if len(sys.argv) > 1 else 32         # franja arriba y en las puntas (px)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def lab_rgb(x):
    return MK.lab_de(Image.fromarray(np.dstack([np.clip(x, 0, 255).astype(np.uint8), np.full(x.shape[:2], 255, np.uint8)]))).astype(float)


if __name__ == '__main__':
    SALIDA.mkdir(parents=True, exist_ok=True)
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in [A, Bn] + [AQUI / 'capas' / f'{n}.png' for n in ('pelo-coleta-detras', 'pelo-coleta-delante', 'cinta-coleta')]}
    a = Image.open(A).convert('RGBA'); b = Image.open(Bn).convert('RGBA')
    ra = np.array(a)[..., :3].astype(float); rb = np.array(b)[..., :3].astype(float)
    la = MK.lab_de(a).astype(float); lb = MK.lab_de(b).astype(float)
    reg_a = CO.regiones(la); reg_b = CO.regiones(lb)
    cinta = reg_a == CO.CINTA
    # el borde suave de la cinta (lila mezclado con pelo, junto a la cinta) también es cinta
    ha = np.degrees(np.arctan2(la[..., 2], la[..., 1])); Ca = np.hypot(la[..., 1], la[..., 2])
    cinta |= nd.binary_dilation(cinta, iterations=4) & (ha < 20) & (ha > -90) & (Ca > 6) & (reg_a != CO.PIEL) & (reg_a != CO.FONDO)
    YY, XX = np.mgrid[0:cinta.shape[0], 0:cinta.shape[1]]
    xs = np.where(cinta.any(0))[0]; cen = np.array([YY[:, x][cinta[:, x]].mean() for x in xs]); c = np.interp(XX, xs, cen)
    puntas = (XX < xs.min() + 40) | (XX > xs.max() - 40)
    dout = nd.distance_transform_edt(~cinta)
    limite = np.where((YY > c) & ~puntas, ABAJO, OTROS)
    # se puede cambiar: cinta + franja permitida, solo donde las dos imágenes tienen pelo (nunca piel, ni fondo de la aprobada)
    piel = nd.binary_dilation((reg_a == CO.PIEL) | (reg_b == CO.PIEL), iterations=1)
    pelo_ok = ((reg_a == CO.PELO) | cinta) & (reg_b == CO.PELO) & ~piel
    permitida = (cinta | (dout <= limite)) & pelo_ok
    # unión: watershed entre «la cinta» (nuevo) y «fuera de la franja» (aprobado); la frontera cae donde la elevación es
    # alta: alta donde las dos imágenes se parecen (dE bajo) y en los huecos oscuros entre mechones
    dE = nd.gaussian_filter(np.sqrt(((la - lb) ** 2).sum(-1)), 1.5)
    oscuro = np.clip((110 - np.minimum(la[..., 0], lb[..., 0])) / 60, 0, 1)
    elev = (60 - np.minimum(dE, 60)) + 25 * oscuro
    # junto a la cinta (dentro de la franja), la sombra de la cinta y los huequecitos de fondo que dejaba entre ella y el
    # pelo también se cambian (sin la cinta se verían), si en la imagen sin cinta ahí hay pelo
    cerca = (dout <= limite) & ~cinta & (reg_b == CO.PELO) & ~piel
    sombra0 = cerca & (reg_a == CO.PELO) & (nd.uniform_filter((la[..., 0] < lb[..., 0] - 25).astype(float), 7) > 0.5)
    hueco0 = cerca & (reg_a == CO.FONDO)
    forzado = nd.binary_closing(sombra0 | hueco0, iterations=1) & cerca
    permitida |= forzado
    sem = np.zeros(cinta.shape, np.int32); sem[cinta] = 2; sem[forzado] = 2
    sem[~nd.binary_dilation(permitida | cinta, iterations=1)] = 1
    nuevo = (watershed(elev, sem) == 2) & (permitida | cinta)
    nuevo = nd.binary_opening(nuevo, iterations=1) | cinta | forzado
    w = np.clip(nd.distance_transform_edt(nuevo) / TRANS, 0, 1) * (permitida | cinta)
    w = np.where(cinta | forzado, 1.0, w)
    comp = ra * (1 - w[..., None]) + rb * w[..., None]
    # huecos diminutos de fondo entre rizos dentro de la zona de la cinta (no conectados con el fondo de fuera): se
    # rellenan con el color del pelo de alrededor (si no, se verían como agujeritos)
    hueco = cinta & (reg_b == CO.FONDO)
    et, n = nd.label(hueco); s = nd.sum(hueco, et, range(1, n + 1))
    fondo_fuera = nd.binary_dilation((reg_a == CO.FONDO) & ~cinta, iterations=1)
    pequenos = np.isin(et, [i for i in range(1, n + 1) if s[i - 1] <= 80 and not ((et == i) & fondo_fuera).any()])
    alrededor = ~pequenos & ~(reg_b == CO.FONDO)
    den = nd.gaussian_filter(alrededor.astype(float), 3)
    relleno = np.stack([nd.gaussian_filter(comp[..., i] * alrededor, 3) for i in range(3)], -1) / np.maximum(den, 1e-6)[..., None]
    comp[pequenos] = relleno[pequenos]; reg_b = reg_b.copy(); reg_b[pequenos] = CO.PELO
    lc = lab_rgb(comp)
    # comprobaciones de la unión
    costura = nuevo & ~nd.binary_erosion(nuevo, iterations=1) & ~cinta
    dEs = np.sqrt(((la - lb) ** 2).sum(-1))
    media = nd.uniform_filter(dEs * costura, 9) / np.maximum(nd.uniform_filter(costura.astype(float), 9), 1e-6)
    falla = costura & (media > 30)
    lado = np.where(puntas, 'puntas', np.where(YY < c, 'arriba', 'abajo'))
    h = np.degrees(np.arctan2(lc[..., 2], lc[..., 1])); C = np.hypot(lc[..., 1], lc[..., 2])
    lila = (h < -5) & (h > -80) & (C > 10) & nd.binary_dilation(cinta, iterations=10) & ~((reg_a == CO.FONDO) & ~cinta)
    # sombra de la cinta: junto a la zona, pelo aprobado claramente más oscuro que el de la imagen sin cinta
    junto = nd.binary_dilation(nuevo, iterations=5) & ~nuevo & (reg_a == CO.PELO)
    sombra = junto & (la[..., 0] < lb[..., 0] - 25) & (nd.uniform_filter((la[..., 0] < lb[..., 0] - 25).astype(float), 7) > 0.5)
    res = {k: dict(px=int((costura & (lado == k)).sum()), fallan_px=int((falla & (lado == k)).sum()),
                   fallan=round(float((falla & (lado == k)).sum() / max((costura & (lado == k)).sum(), 1)), 3)) for k in ('arriba', 'abajo', 'puntas')}
    ampl = nuevo & ~cinta
    res.update(px_cambiados=int((w > 0).sum()), px_cinta=int(cinta.sum()), px_ampliacion=int(ampl.sum()),
               ampliacion_maxima_px={k: round(float(dout[ampl & (lado == k)].max()), 1) if (ampl & (lado == k)).any() else 0 for k in ('arriba', 'abajo', 'puntas')},
               piel_tocada_px=int(((w > 0) & ((reg_a == CO.PIEL) | (reg_b == CO.PIEL))).sum()),
               silueta_tocada_px=int(((w > 0) & (reg_a == CO.FONDO) & ~forzado & ~cinta).sum()), huequecitos_junto_a_la_cinta_px=int(hueco0.sum()), restos_lila_px=int(lila.sum()), sombra_de_la_cinta_px=int(sombra.sum()))
    res['resultado'] = 'limpia' if all(res[k]['fallan'] <= 0.05 for k in ('arriba', 'abajo', 'puntas')) and res['restos_lila_px'] <= 5 and res['sombra_de_la_cinta_px'] <= 30 and res['piel_tocada_px'] == 0 and res['silueta_tocada_px'] == 0 else 'falla'
    # capas sin cinta, con el mismo método y encaje que las aprobadas
    # sin cinta: donde estaba la cinta, lo que diga la imagen sin cinta (pelo o huecos de fondo entre rizos)
    reg_c = reg_a.copy(); reg_c[cinta] = np.where(reg_b[cinta] == CO.PELO, CO.PELO, CO.FONDO); reg_c[forzado] = CO.PELO
    pelo = CO.suave(reg_c == CO.PELO, comp, (reg_c == CO.FONDO) | (reg_c == CO.PIEL))
    pelo_n, s, t = CO.a_nuestro_lienzo(pelo)
    base = PT.abrir(PT.SIN_OJOS); cabeza = nd.binary_dilation((base[..., 3] > 0) & (np.mgrid[0:1659, 0:948][0] < 600), iterations=2)
    delante = pelo_n.copy(); delante[~cabeza] = 0
    Image.fromarray(pelo_n, 'RGBA').save(SALIDA / 'pelo-coleta-sin-cinta-detras.png', optimize=True)
    Image.fromarray(delante, 'RGBA').save(SALIDA / 'pelo-coleta-sin-cinta-delante.png', optimize=True)
    # el pelo aprobado fuera de la zona no cambia (en el lienzo de la imagen)
    fuera = ~nd.binary_dilation(w > 0, iterations=2) & (reg_a == CO.PELO)
    res['fuera_de_la_zona_igual'] = bool((np.abs(comp - ra)[fuera] < 0.5).all())
    res['sha256_fuentes'] = antes; res['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (SALIDA / 'comprobaciones.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
    # vistas: uniones marcadas (en la imagen) y antes/después sobre nuestra muñeca
    v = comp.copy(); v[costura & ~falla] = v[costura & ~falla] * 0.3 + np.array([0, 200, 80]) * 0.7; v[falla] = (255, 0, 150); v[lila] = (140, 60, 255); v[sombra] = (0, 160, 255)
    z = (w > 0) & ~cinta; vz = comp.copy(); vz[z] = vz[z] * 0.55 + np.array([255, 220, 0]) * 0.45
    x0, y0, x1, y1 = 330, 180, 1060, 560
    tiles = [('Aprobada (con cinta)', ra), ('Candidata sin cinta', comp), ('Ampliación (amarillo) sobre la zona de la cinta', vz),
             ('Uniones: verde bien · magenta falla · lila restos · azul sombra', v)]
    W, H = x1 - x0, y1 - y0; out = Image.new('RGB', (2 * W + 10, 2 * (H + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (tt, im) in enumerate(tiles):
        X, Y = (i % 2) * (W + 10), (i // 2) * (H + 30)
        out.paste(Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).crop((x0, y0, x1, y1)), (X, Y + 28)); d.text((X + 4, Y + 5), tt, font=MK.F(18), fill=(40, 40, 60))
    out.save(SALIDA / 'uniones-candidata.png', optimize=True)
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}; ab = PT.abrir(PT.OJOS['marron'])
    capa = lambda n: PT.abrir(AQUI / 'capas' / f'{n}.png')
    mont = lambda pd, pl, ci: PT.montar([pd, base, ab, f['zapatos'], f['vestido'], PT.abrir(PT.MANOS), pl] + ci)
    vistas = [('Con cinta (aprobada)', mont(capa('pelo-coleta-detras'), capa('pelo-coleta-delante'), [capa('cinta-coleta')])),
              ('Antes: sin cinta (hueco)', mont(capa('pelo-coleta-detras'), capa('pelo-coleta-delante'), [])),
              ('Después: sin cinta (candidata)', mont(pelo_n, delante, [])),
              ('Candidata + cinta', mont(pelo_n, delante, [capa('cinta-coleta')]))]
    caja = (150, 20, 900, 640); esc = 0.6
    tl = [(n, im.crop(caja).resize((round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)), Image.LANCZOS)) for n, im in vistas]
    w2, h2 = tl[0][1].size; out = Image.new('RGB', (4 * (w2 + 8), h2 + 30), 'white'); d = ImageDraw.Draw(out)
    for i, (n, im) in enumerate(tl):
        out.paste(im, (i * (w2 + 8), 28)); d.text((i * (w2 + 8) + 4, 5), n, font=MK.F(16), fill=(40, 40, 60))
    out.save(SALIDA / 'antes-despues.png', optimize=True)
    # con la cinta puesta, ¿se ve igual con las capas candidatas que con las aprobadas?
    x = np.array(vistas[0][1]).astype(int); y = np.array(vistas[3][1]).astype(int)
    res['con_cinta_diferencia_max_frente_a_aprobada'] = int(np.abs(x - y).max())
    (SALIDA / 'comprobaciones.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in res.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
