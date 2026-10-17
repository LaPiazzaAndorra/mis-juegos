#!/usr/bin/env python3
"""
Gorrito de dormir de frente (D-024): se extrae SOLO el gorro (tela azul de estrellas y lunas, borde rosa) y el pompón de
la imagen aprobada (referencia-gorrito-de-frente-aprobado.png, generada, sin modificar), sin pelo ni piel, y se coloca
sobre NUESTRA muñeca con la melena suelta (que no cambia).

Extracción:
  · gorro: semillas de tela azul y de borde rosa; fondo, piel y pelo como semillas contrarias; reparto por contraste
    (watershed); las estrellas y lunas (encerradas por la tela) son parte del gorro;
  · pompón (crema sobre fondo crema): lo que se distingue del fondo (diferencia de color > 7) en su círculo, sin el pelo
    que asoma por detrás;
  · borde de abajo del ala rosa: en la imagen, algunos mechones caen por delante del ala y la dejan con muescas; se
    cierran con una curva suave que pasa por las esquinas de fuera de los escalones, con la textura del ala de justo
    encima, para que el borde sea liso (nuestro pelo va detrás);
  · borde: suave (1 px), quitando el color del fondo, la piel o el pelo de alrededor (sin halo).
Encaje: con la escala y la posición de los ojos (centros de los iris medidos en las dos imágenes), sin deformar.
Comprobaciones: cuánto pelo de arriba de nuestra melena queda sin cubrir, si toca las cejas y si deja los rizos de los
lados; todo se marca en una vista antes de tocar el peinado (que no se toca).

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/gorrito/gorrito.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[3]; B = RAIZ / 'docs' / 'propuestas' / 'base-aprobada-d013-2026-10-14'
sys.path[:0] = [str(B / 'piel-tonos'), str(B / 'ojos-abiertos')]
import piel_tonos as PT   # noqa: E402
MK = PT.MK; CJ = PT.CJ

REF = AQUI / 'referencia-gorrito-de-frente-aprobado.png'
OJOS_REF = [(576, 622), (827, 622)]          # centros de los iris medidos en la imagen (círculos ajustados, r ≈ 48)
OJOS = [(391, 444), (565, 444)]              # los de nuestra muñeca
POMPON = ((1240, 617), 98)                   # centro y radio máximo del pompón en la imagen
ALA_X = (286, 1118)                          # columnas del ala rosa en la imagen (a la derecha, la cola y el pompón)
TRAMOS_ALA = [(286, 560), (940, 1118)]       # tramos del borde de abajo del ala con muescas (a los lados de la cara)
FONDO_LAB = np.array([251.5, 0.5, 3.0])      # el crema del fondo (medido)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def extraer():
    im = Image.open(REF).convert('RGBA'); rgb = np.array(im)[..., :3].astype(float)
    lab = MK.lab_de(im).astype(float); L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b); h = np.degrees(np.arctan2(b, a)); YY, XX = np.mgrid[0:L.shape[0], 0:L.shape[1]]
    azul = (b < -5) & (C > 6)
    rosa = (h > 0) & (h < 40) & (a > 9) & (L > 150) & (YY > 270) & (YY < 610)
    (px, py), pr = POMPON
    sem = np.zeros(L.shape, np.int32)
    sem[nd.binary_erosion((L >= 248) & (C < 5), iterations=2)] = 2                         # fondo
    sem[nd.binary_erosion((h > 45) & (C > 18) & (L > 140) & (YY > 430), iterations=2)] = 3  # piel
    sem[nd.binary_erosion((L < 130) & (h > 25) & (C > 12), iterations=1)] = 4              # pelo
    sem[nd.binary_erosion(azul | rosa, iterations=2) | (np.hypot(XX - px, YY - py) < 55)] = 1
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(lab[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(lab[..., i], 1), 1) ** 2 for i in range(3)))
    m = nd.binary_fill_holes(watershed(g, sem) == 1)
    # pompón: lo que no es fondo en su círculo (sin el pelo de detrás)
    dE = np.sqrt(((lab - FONDO_LAB) ** 2).sum(-1))
    pp = (np.hypot(XX - px, YY - py) < pr) & ~((C > 28) | (L < 170)) & (dE > 7)
    pp = nd.binary_fill_holes(nd.binary_closing(nd.binary_opening(pp, iterations=1), iterations=3))
    et, n = nd.label(pp); pp = et == (np.argmax(nd.sum(pp, et, range(1, n + 1))) + 1)
    m = nd.binary_fill_holes(m | pp)
    et, n = nd.label(m); m = et == (np.argmax(nd.sum(m, et, range(1, n + 1))) + 1)
    # muescas del borde de abajo del ala (mechones de la imagen por delante, en diagonal): en los dos tramos de los lados,
    # el borde pasa por una curva suave que toca las esquinas de fuera de los escalones (no baja el ala más allá de ellas)
    # y los huecos se rellenan con la textura del ala que tienen justo encima
    sin_pompon = m & ~(np.hypot(XX - px, YY - py) < pr)
    cols = np.where(sin_pompon.any(0))[0]; x0, x1 = max(ALA_X[0], int(cols.min())), min(ALA_X[1], int(cols.max()) + 1)
    y_bajo = np.array([np.where(sin_pompon[:, x])[0].max() for x in range(x0, x1)])
    cerrado = y_bajo.copy()
    xs = np.arange(x0, x1)
    for t0, t1 in TRAMOS_ALA:                       # curva suave por las esquinas de fuera de los escalones (envolvente)
        sel = (xs >= t0) & (xs < t1); X, Y = xs[sel].astype(float), y_bajo[sel].astype(float); keep = np.ones(len(X), bool)
        for _ in range(15):
            pz = np.polyfit(X[keep], Y[keep], 3); keep = Y >= np.polyval(pz, X) - 1.0
        cerrado[sel] = np.maximum(Y, np.round(np.polyval(pz, X))).astype(int)
    rgb2 = rgb.copy(); nuevo = np.zeros(m.shape, bool)
    for i, x in enumerate(range(x0, x1)):
        hueco = cerrado[i] - y_bajo[i]
        for y in range(y_bajo[i] + 1, cerrado[i] + 1):
            if not m[y, x]:
                nuevo[y, x] = True; rgb2[y, x] = rgb[y - hueco - 3, x]
    m = m | nuevo
    # mechones de la imagen que quedaban por encima del ala (motas y líneas marrones dentro del ala): se cambian por la
    # textura rosa del ala que tienen más cerca por encima
    zona_ala = nd.binary_closing(rosa, iterations=8) | nuevo
    L_ala = nd.gaussian_filter(L * rosa, 8) / np.maximum(nd.gaussian_filter(rosa * 1.0, 8), 1e-6)   # luz del ala alrededor
    marron = m & zona_ala & ~rosa & ~azul & (((C > 18) & (h > 33) & (L < 225)) | (L < L_ala - 30))
    agujeros = nd.binary_fill_holes(nd.binary_closing(m, iterations=3)) & ~m & zona_ala   # huequecitos dentro del ala
    m = m | agujeros
    marron = (nd.binary_dilation(marron, iterations=1) & m & ~azul) | agujeros
    ys_m, xs_m = np.where(marron)
    for y, x in zip(ys_m, xs_m):
        for k in range(2, 60):
            if y - k >= 0 and rosa[y - k, x] and not marron[y - k, x]:
                rgb2[y, x] = rgb2[y - k, x]; break
    # borde suave sin el color de alrededor (fondo, piel o pelo)
    fuera = ~nd.binary_dilation(m, iterations=2)
    den = nd.gaussian_filter(fuera.astype(float), 4)
    alrededor = np.stack([nd.gaussian_filter(rgb[..., i] * fuera, 4) for i in range(3)], -1) / np.maximum(den, 1e-6)[..., None]
    al = np.clip(nd.gaussian_filter(m.astype(float), 0.8) * 1.6 - 0.3, 0, 1) * nd.binary_dilation(m, iterations=1)
    al[nuevo] = 1
    col = np.where(al[..., None] > 0, (rgb2 - (1 - al[..., None]) * alrededor) / np.maximum(al[..., None], 0.05), 0)
    pieza = np.dstack([np.clip(col, 0, 255), al * 255]).round().astype(np.uint8)
    ys, xs = np.where(al > 0); caja = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    return pieza[caja[1]:caja[3], caja[0]:caja[2]], caja, dict(px=int((al > 0).sum()), pompon_px=int(pp.sum()), muescas_cerradas_px=int(nuevo.sum()), mechones_sobre_el_ala_px=int(marron.sum()), agujeros_en_el_ala_px=int(agujeros.sum()), caja_en_la_imagen=list(caja))


def a_nuestro_lienzo(pieza, caja):
    (ax, ay), (bx, by) = OJOS_REF; (cx, cy), (dx, dy) = OJOS
    s = np.hypot(dx - cx, dy - cy) / np.hypot(bx - ax, by - ay)
    mx, my = (ax + bx) / 2, (ay + by) / 2; nx, ny = (cx + dx) / 2, (cy + dy) / 2
    ox = nx + (caja[0] - mx) * s; oy = ny + (caja[1] - my) * s
    a = pieza.astype(float); al = a[..., 3:] / 255; pre = np.dstack([a[..., :3] * al, a[..., 3:]])
    W, H = 948, 1659
    canales = [np.array(Image.fromarray(pre[..., i].astype(np.float32), 'F').transform((W, H), Image.AFFINE, (1 / s, 0, -ox / s, 0, 1 / s, -oy / s), Image.BICUBIC)) for i in range(4)]
    c = np.stack(canales, -1); A = np.clip(c[..., 3], 0, 255); rgb = c[..., :3] / np.maximum(A[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), A]).round().astype(np.uint8); out[A < 2] = 0
    return out, dict(escala=round(float(s), 4), esquina=[round(float(ox), 1), round(float(oy), 1)])


if __name__ == '__main__':
    fuentes = [REF, PT.SIN_OJOS, PT.CP.DELANTE, PT.CP.DETRAS, PT.SIN_PIEL['corona']]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    pieza, caja, i1 = extraer(); Image.fromarray(pieza, 'RGBA').save(AQUI / 'gorrito-recortado.png', optimize=True)
    capa, i2 = a_nuestro_lienzo(pieza, caja); Image.fromarray(capa, 'RGBA').save(AQUI / 'capa-gorrito.png', optimize=True)

    base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(base); wb, _ = PT.peso_base(base, lab)
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
    gorro = capa[..., 3] >= 128; hay = capa[..., 3] > 0
    de, dt = f['pelo-delante'][..., 3] > 0, f['pelo-detras'][..., 3] > 0; pelo = de | dt
    cejas = CJ.preparar()['hay']
    # borde de abajo del gorro en cada columna (sin el pompón, que cuelga a un lado)
    YY, XX = np.mgrid[0:1659, 0:948]
    (ppx, ppy), ppr = POMPON; s = i2['escala']; (ax, ay), (bx, by) = OJOS_REF; (cx, cy), (dx, dy) = OJOS
    pcx = (cx + dx) / 2 + (ppx - (ax + bx) / 2) * s; pcy = (cy + dy) / 2 + (ppy - (ay + by) / 2) * s
    pompon = np.hypot(XX - pcx, YY - pcy) < ppr * s + 2
    cuerpo = gorro & ~pompon
    cols = np.where(cuerpo.any(0))[0]
    abajo = np.full(948, -1); abajo[cols] = [np.where(cuerpo[:, x])[0].max() for x in cols]
    # «pelo de arriba»: el pelo de la melena por encima del borde de abajo del gorro (en las columnas del gorro), y el
    # pelo por encima de esa altura fuera de ellas (lo que asomaría por los lados o por encima)
    y_ala = int(np.median(abajo[cols]))
    arriba = pelo & (((abajo[None, :] >= 0) & (YY <= abajo[None, :])) | ((abajo[None, :] < 0) & (YY <= y_ala)))
    sin_cubrir = arriba & ~gorro
    et, n = nd.label(sin_cubrir); tam = nd.sum(sin_cubrir, et, range(1, n + 1))
    zonas = []
    for i in np.argsort(-tam)[:8]:
        if tam[i] < 30:
            break
        ys, xs = np.where(et == i + 1); zonas.append(dict(px=int(tam[i]), caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]))
    dist = nd.distance_transform_edt(~gorro)[sin_cubrir]
    grosor = dict(maximo_px=round(float(dist.max()), 1), p95_px=round(float(np.percentile(dist, 95)), 1)) if sin_cubrir.any() else {}
    ys_c, xs_c = np.where(cejas)
    dist_cejas = float(nd.distance_transform_edt(~gorro)[cejas].min())
    lados = pelo & (YY > abajo.max()) ; lados_tapados = lados & gorro
    comp = dict(extraccion=i1, encaje=i2,
                caja=[int(XX[hay].min()), int(YY[hay].min()), int(XX[hay].max()), int(YY[hay].max())],
                borde_de_abajo_del_gorro_y=dict(mediana=y_ala, minimo=int(abajo[cols].min()), maximo=int(abajo[cols].max())),
                arriba_del_pelo_y=int(YY[pelo].min()), pelo_de_arriba_px=int(arriba.sum()), pelo_de_arriba_sin_cubrir_px=int(sin_cubrir.sum()),
                pelo_de_arriba_cubierto=round(float((arriba & gorro).sum() / arriba.sum()), 4), zonas_sin_cubrir=zonas, grosor_de_lo_sin_cubrir=grosor,
                cejas_tapadas_px=int((cejas & hay).sum()), cejas_arriba_y=int(ys_c.min()), distancia_minima_a_las_cejas_px=round(dist_cejas, 1),
                rizos_de_los_lados_px=int(lados.sum()), rizos_de_los_lados_tapados_por_el_pompon_px=int(lados_tapados.sum()),
                piel_de_la_frente_tapada_px=int((gorro & (wb > 0) & (base[..., 3] > 0) & ~de).sum()), sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')

    # vistas: sin gorro (con corona), con el gorrito, la cobertura marcada y la referencia al mismo tamaño
    capas = [f['pelo-detras'], base, PT.abrir(PT.OJOS['marron']), f['zapatos'], f['vestido'], PT.abrir(PT.MANOS), f['pelo-delante']]
    vc = (130, 0, 940, 720)
    sin = PT.montar(capas + [f['corona']]); con = PT.montar(capas + [capa])
    marc = np.array(PT.montar(capas)).copy()
    marc[gorro] = (marc[gorro] * 0.45 + np.array([90, 140, 255]) * 0.55).astype(np.uint8)
    marc[sin_cubrir] = [255, 0, 160]; marc[cejas & hay] = [255, 40, 0]
    ref_es = Image.open(REF).convert('RGB'); s_ = i2['escala']
    ref_es = ref_es.resize((round(ref_es.width * s_), round(ref_es.height * s_)), Image.LANCZOS)
    ox = (cx + dx) / 2 - (ax + bx) / 2 * s_; oy = (cy + dy) / 2 - (ay + by) / 2 * s_
    lienzo_ref = Image.new('RGB', (948, 1659), (255, 250, 245)); lienzo_ref.paste(ref_es, (round(ox), round(oy)))
    tiles = [('Melena con corona (aprobada)', sin), ('Con el gorrito (candidato)', con),
             ('Cobertura: azul gorro · magenta pelo sin cubrir', Image.fromarray(marc)), ('Imagen aprobada, misma escala', lienzo_ref)]
    w, h = vc[2] - vc[0], vc[3] - vc[1]; out = Image.new('RGB', (2 * (w + 8), 2 * (h + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (t, im) in enumerate(tiles):
        x, y = (i % 2) * (w + 8), (i // 2) * (h + 30)
        out.paste(im.crop(vc), (x, y + 28)); d.text((x + 4, y + 5), t, font=MK.F(18), fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-gorrito.png', optimize=True)
    # dónde no cubre (ampliado ×2): con el gorrito · marcado en magenta
    z = (160, 60, 470, 380); zw, zh = (z[2] - z[0]) * 2, (z[3] - z[1]) * 2
    out = Image.new('RGB', (2 * zw + 12, zh + 30), 'white'); d = ImageDraw.Draw(out)
    for i, (t_, im) in enumerate((('Con el gorrito (×2)', con), ('Pelo de arriba sin cubrir, en magenta (×2)', Image.fromarray(marc)))):
        out.paste(im.crop(z).resize((zw, zh), Image.LANCZOS), (i * (zw + 12), 30)); d.text((i * (zw + 12) + 4, 6), t_, font=MK.F(18), fill=(40, 40, 60))
    out.save(AQUI / 'zonas-sin-cubrir.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
