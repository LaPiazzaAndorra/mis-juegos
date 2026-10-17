#!/usr/bin/env python3
"""
CANDIDATAS: pelo bajo el sombrero y puntas de las coletas (D-026), de la imagen nueva sin sombrero y con las coletas
enteras (referencias/referencia-coletas-sin-sombrero-puntas.png, generada en ChatGPT con la guía, sin modificar).

La imagen nueva tiene otro encuadre: se pasa a nuestro lienzo con la escala y la posición de los ojos (iris medidos) y se
comprueba la alineación con la aprobada (cara, coleteros) antes de usarla.

Se toma de la imagen nueva SOLO el pelo de:
  · las puntas: por debajo de donde la imagen aprobada corta las coletas (y = Y_CORTE), más una franja de hasta ABAJO px
    por encima para buscar la unión;
  · (solo sin sombrero) todo el pelo por encima de los coleteros: lo que tapaba el sombrero y el pelo de debajo del ala
    (que en la imagen nueva sigue al de arriba), más una franja de hasta ARRIBA px por debajo; los coleteros tapan la unión
    con las coletas aprobadas.
Dentro de la franja la unión se busca (watershed) donde las dos imágenes se parecen y por los huecos oscuros entre rizos;
transición de TRANS px. Fuera de la zona, el pelo aprobado queda igual. No se toman la cara, las orejas, la piel, el
cuerpo, el vestido ni los coleteros de la imagen nueva (se usan los nuestros y los coleteros aprobados).

Salida (capas/completado/): pelo de detrás y de delante con sombrero y sin sombrero, uniones marcadas, antes/después y
comprobaciones.json. Las capas aprobadas no cambian.

Uso (desde la raíz): python3 docs/propuestas/peinado-coletas-sombrero-2026-10-17/completar_pelo.py [ABAJO=60] [ARRIBA=40]
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed
from skimage.registration import phase_cross_correlation

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; sys.path[:0] = [str(AQUI)]
import coletas_sombrero as CS   # noqa: E402
PT, MK, CO = CS.PT, CS.MK, CS.CO
FONDO, PELO, PIEL, SOMBRERO, COLETERO, VESTIDO = CS.FONDO, CS.PELO, CS.PIEL, CS.SOMBRERO, CS.COLETERO, CS.VESTIDO

NUEVA = AQUI / 'referencias' / 'referencia-coletas-sin-sombrero-puntas.png'
OJOS_NUEVA = [(506, 483), (715, 482)]                       # iris medidos en la imagen nueva (círculos ajustados, r ≈ 40)
CEJAS_NUEVA = [(380, 340, 600, 440), (610, 340, 840, 440)]  # zona de las cejas de la imagen nueva
COLETEROS_NUEVA_Y = (520, 640)
ABAJO = int(sys.argv[1]) if len(sys.argv) > 1 else 60       # franja por encima del corte de las coletas (px del lienzo)
ARRIBA = int(sys.argv[2]) if len(sys.argv) > 2 else 40      # sin sombrero: franja de unión bajo los coleteros (px del lienzo)
TRANS = 2
W, H = 948, 1659
SAL = AQUI / 'capas' / 'completado'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def transformacion(ojos):
    (ax, ay), (bx, by) = ojos; (cx, cy), (ex, ey) = CS.OJOS
    s = np.hypot(ex - cx, ey - cy) / np.hypot(bx - ax, by - ay)
    mx, my = (ax + bx) / 2, (ay + by) / 2; nx, ny = (cx + ex) / 2, (cy + ey) / 2
    return (1 / s, 0, mx - nx / s, 0, 1 / s, my - ny / s), s


def al_lienzo(x, t, vecino=False):
    """Imagen (RGB/RGBA uint8 o mapa de regiones) de la referencia → nuestro lienzo."""
    if x.ndim == 2:
        return np.array(Image.fromarray(x.astype(np.uint8)).transform((W, H), Image.AFFINE, t, Image.NEAREST))
    if x.shape[2] == 3:
        return np.array(Image.fromarray(x.astype(np.uint8)).transform((W, H), Image.AFFINE, t, Image.BICUBIC, fillcolor=(253, 251, 248))).astype(float)
    a = x.astype(float); al = a[..., 3:] / 255; pre = np.dstack([a[..., :3] * al, a[..., 3:]])
    c = np.stack([np.array(Image.fromarray(pre[..., i].astype(np.float32), 'F').transform((W, H), Image.AFFINE, t, Image.BICUBIC)) for i in range(4)], -1)
    A = np.clip(c[..., 3], 0, 255); rgb = c[..., :3] / np.maximum(A[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), A]); out[A < 2] = 0
    return out


def regiones_nueva(lab):
    """Como coletas_sombrero.regiones, para la imagen sin sombrero: fondo, pelo, piel, coleteros y vestido."""
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]; C = np.hypot(a, b); h = np.degrees(np.arctan2(b, a))
    YY, XX = np.mgrid[0:L.shape[0], 0:L.shape[1]]
    var = np.sqrt(np.maximum(nd.uniform_filter(L * L, 7) - nd.uniform_filter(L, 7) ** 2, 0))
    sem = np.zeros(L.shape, np.int32)
    sem[nd.binary_erosion((L >= 248) & (C < 5), iterations=2)] = FONDO
    sem[nd.binary_erosion((L < 160) & (h > 30) & (h < 60) & (C > 20), iterations=2)] = PELO
    piel = (h > 30) & (h < 62) & (C > 18) & (L > 150) & (var < 6) & (YY > 260)            # cara, cuello, brazos y manos
    piel |= (h > 30) & (h < 47) & (C > 48) & (L > 115) & (var < 16) & (YY > 430) & (YY < 610)   # orejas (más rojizas, con pliegues)
    piel = nd.binary_erosion(piel, iterations=3); et, n = nd.label(piel); s = nd.sum(piel, et, range(1, n + 1))
    sem[np.isin(et, 1 + np.where(s > 400)[0])] = PIEL
    verde = (h > 85) & (C > 8) & (L < 190)
    sem[nd.binary_erosion(verde & (YY > COLETEROS_NUEVA_Y[0]) & (YY < COLETEROS_NUEVA_Y[1]), iterations=1)] = COLETERO
    sem[nd.binary_erosion((YY > 700) & (XX > 330) & (XX < 880) & (h < 35) & (h > -40) & (C > 8), iterations=2)] = VESTIDO
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(lab[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(lab[..., i], 1), 1) ** 2 for i in range(3)))
    reg = watershed(g, sem)
    cara = nd.binary_fill_holes(reg == PIEL); reg[cara & (reg == PELO)] = PIEL
    # cejas (como en coletas_sombrero): pelo con piel justo encima y justo debajo en su columna
    z = np.zeros(L.shape, bool)
    for x0, y0, x1, y1 in CEJAS_NUEVA:
        z[y0:y1, x0:x1] = True
    p = reg == PELO; ceja = np.zeros(L.shape, bool)
    for x in np.where(z.any(0))[0]:
        col = reg[:, x]; ys = np.where(p[:, x] & z[:, x])[0]
        for tramo in (np.split(ys, np.where(np.diff(ys) > 1)[0] + 1) if len(ys) else []):
            if col[tramo[0] - 1] == PIEL and col[tramo[-1] + 1] == PIEL and len(tramo) < 45:
                ceja[tramo, x] = True
    reg[nd.binary_dilation(ceja, iterations=2) & p & z] = PIEL
    # el pelo son tres piezas (la cabeza y las dos coletas): lo demás oscuro suelto (sombras de la falda, etc.) no es pelo
    p = reg == PELO; et, n = nd.label(p); s = nd.sum(p, et, range(1, n + 1))
    reg[p & ~np.isin(et, 1 + np.argsort(-s)[:3])] = FONDO
    return reg


def lab_rgb(x):
    return MK.lab_de(Image.fromarray(np.dstack([np.clip(x, 0, 255).astype(np.uint8), np.full(x.shape[:2], 255, np.uint8)]))).astype(float)


def unir(A, Bc, la, lb, zona, permitida):
    """Unión por watershed entre la zona (nuevo) y lo de fuera de la franja (aprobado). Devuelve el peso de lo nuevo."""
    dE = nd.gaussian_filter(np.sqrt(((la - lb) ** 2).sum(-1)), 1.5)
    oscuro = np.clip((110 - np.minimum(la[..., 0], lb[..., 0])) / 60, 0, 1)
    elev = (60 - np.minimum(dE, 60)) + 25 * oscuro
    sem = np.zeros(zona.shape, np.int32); sem[zona] = 2
    sem[~nd.binary_dilation(permitida | zona, iterations=1)] = 1
    nuevo = ((watershed(elev, sem) == 2) & (permitida | zona)) | zona
    nuevo = nd.binary_opening(nuevo, iterations=1) | zona
    w = np.clip(nd.distance_transform_edt(nuevo) / TRANS, 0, 1)
    w = np.where(zona, 1.0, w)
    return w, nuevo


def mezclar(A, B, w):
    """Mezcla en alfa premultiplicada (A aprobado, B nuevo; w = peso de B)."""
    pa = np.dstack([A[..., :3] * A[..., 3:] / 255, A[..., 3:]]); pb = np.dstack([B[..., :3] * B[..., 3:] / 255, B[..., 3:]])
    p = pa * (1 - w[..., None]) + pb * w[..., None]
    al = p[..., 3]; rgb = p[..., :3] / np.maximum(al[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), np.clip(al, 0, 255)]).round().astype(np.uint8); out[out[..., 3] == 0] = 0
    return out


def revisar(nuevo, zona, la, lb, A, B):
    """Costura (borde de lo nuevo fuera de la zona) donde las dos tienen pelo: falla si la diferencia media local > 30."""
    hay = (A[..., 3] > 128) & (B[..., 3] > 128)
    costura = nuevo & ~nd.binary_erosion(nuevo, iterations=1) & ~zona & hay
    dEs = np.sqrt(((la - lb) ** 2).sum(-1))
    media = nd.uniform_filter(dEs * costura, 9) / np.maximum(nd.uniform_filter(costura.astype(float), 9), 1e-6)
    falla = costura & (media > 30)
    return costura, falla


if __name__ == '__main__':
    SAL.mkdir(parents=True, exist_ok=True)
    capas = {n: AQUI / 'capas' / f'{n}.png' for n in ('pelo-coletas-detras', 'pelo-coletas-delante', 'coleteros', 'sombrero-aventura')}
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in [CS.REF, NUEVA, *capas.values()]}
    ia = Image.open(CS.REF).convert('RGBA'); ib = Image.open(NUEVA).convert('RGBA')
    ta, sa = transformacion(CS.OJOS_REF); tb, sb = transformacion(OJOS_NUEVA)
    ra = al_lienzo(np.array(ia)[..., :3], ta); rb = al_lienzo(np.array(ib)[..., :3], tb)
    la, lb = lab_rgb(ra), lab_rgb(rb)
    reg_a = al_lienzo(CS.regiones(MK.lab_de(ia).astype(float)), ta)
    lab_b = MK.lab_de(ib).astype(float); reg_b_img = regiones_nueva(lab_b); reg_b = al_lienzo(reg_b_img, tb)
    # alineación (en nuestro lienzo): cara y coleteros
    gris = lambda x: x.mean(-1)
    alin = {}
    for nombre, (ys, xs) in dict(cara=((400, 600), (330, 630)), coletero_izq=((500, 640), (150, 350)), coletero_der=((500, 640), (600, 800))).items():
        z = (slice(*ys), slice(*xs)); d = phase_cross_correlation(gris(ra)[z], gris(rb)[z], upsample_factor=10)[0]
        alin[nombre] = dict(dy=round(float(d[0]), 1), dx=round(float(d[1]), 1))
    # capas: aprobada (A) y pelo de la imagen nueva (B), con el mismo borde suave
    A = PT.abrir(capas['pelo-coletas-detras']).astype(float)
    rgb_b = np.array(ib)[..., :3].astype(float)
    B = al_lienzo(CO.suave(reg_b_img == PELO, rgb_b, (reg_b_img == FONDO) | (reg_b_img == PIEL) | (reg_b_img == VESTIDO) | (reg_b_img == COLETERO)), tb)
    YY, XX = np.mgrid[0:H, 0:W]
    # nuestra cara y nuestras orejas no cambian: el pelo nuevo solo puede ir encima de nuestra base donde ya la tapaban el
    # sombrero o el pelo aprobado
    base = PT.abrir(PT.SIN_OJOS); tapaba = nd.binary_dilation(PT.abrir(capas['sombrero-aventura'])[..., 3] > 0, iterations=1) | (PT.abrir(capas['pelo-coletas-delante'])[..., 3] > 0)
    protegida = (base[..., 3] > 0) & ~tapaba
    res_prot = int(((B[..., 3] > 0) & protegida).sum()); B[protegida] = 0
    y_corte = json.loads((AQUI / 'capas' / 'comprobaciones.json').read_text(encoding='utf-8'))['coletas_cortadas_por_el_borde_de_la_imagen']['y']
    sombrero = PT.abrir(capas['sombrero-aventura'])[..., 3] > 0
    coleteros = PT.abrir(capas['coleteros'])[..., 3] > 0
    piel = nd.binary_dilation((reg_a == PIEL) | (reg_b == PIEL), iterations=1)
    pelo_ok = (A[..., 3] > 0) & (B[..., 3] > 0) & ~piel & ~nd.binary_dilation(coleteros, iterations=2)
    res = dict(pelo_nuevo_quitado_de_nuestra_cara_y_orejas_px=res_prot, escala_nueva=round(float(sb), 4), escala_aprobada=round(float(sa), 4), alineacion=alin, y_corte=y_corte, franja_abajo_px=ABAJO, franja_arriba_px=ARRIBA)
    salidas = {}
    for version in ('con', 'sin'):
        zona = (YY >= y_corte - 4)                                  # el borde de la imagen aprobada (2–3 px) también
        dist_corte = np.where(YY < y_corte, y_corte - YY, 0)
        permitida = pelo_ok & (YY < y_corte) & (dist_corte <= ABAJO)
        # rizos de la imagen nueva que salen de la silueta aprobada justo encima del corte y siguen hasta las puntas: enteros
        # (si no, quedarían cortados en recto a la altura del corte)
        bh = B[..., 3] > 0; vacio = A[..., 3] == 0
        extra = bh & vacio & (YY < y_corte) & (dist_corte <= ABAJO)
        et, n = nd.label(extra | (bh & zona)); ok = np.unique(et[bh & zona & (YY == y_corte)]); ok = ok[ok > 0]
        zona = zona | (extra & np.isin(et, ok))
        if version == 'sin':
            # sin sombrero: todo el pelo por encima de los coleteros es de la imagen nueva (lo que tapaba el sombrero y el pelo
            # de debajo del ala, que en la imagen nueva sigue al de arriba); la unión, alrededor de los coleteros
            zs = nd.binary_dilation(sombrero, iterations=1)
            y_col = int(np.median(YY[coleteros]))
            arriba = (YY < y_col) & ((A[..., 3] > 0) | bh)
            zona = zona | zs | arriba
            permitida = permitida | (pelo_ok & (YY >= y_col) & (YY <= y_col + ARRIBA))
            res['y_coleteros'] = y_col
        w, nuevo = unir(A, B, la, lb, zona, permitida)
        capa = mezclar(A, B, w)
        costura, falla = revisar(nuevo, zona, la, lb, A, B)
        lado = np.where(YY > y_corte - ABAJO - 5, 'puntas', 'arriba')
        r = {k: dict(px=int((costura & (lado == k)).sum()), fallan_px=int((falla & (lado == k)).sum()),
                     fallan=round(float((falla & (lado == k)).sum() / max((costura & (lado == k)).sum(), 1)), 3)) for k in ('puntas', 'arriba')}
        fuera = ~nd.binary_dilation(w > 0, iterations=2)
        r['pelo_aprobado_fuera_de_la_zona_igual'] = bool((capa[fuera].astype(int) == A[fuera].round().astype(int)).all())
        r['px_nuevos'] = int((w > 0).sum())
        salidas[version] = (capa, w, nuevo, costura, falla)
        res[version] = r
        base = PT.abrir(PT.SIN_OJOS)
        cabeza = nd.binary_dilation((base[..., 3] > 0) & (YY < 600), iterations=2)
        ojos_n = (PT.abrir(PT.OJOS['marron'])[..., 3] > 0) | (PT.abrir(PT.CERRADOS)[..., 3] > 0)
        delante = capa.copy(); delante[~cabeza] = 0; delante[nd.binary_dilation(ojos_n, iterations=3)] = 0
        Image.fromarray(capa, 'RGBA').save(SAL / f'pelo-coletas-{version}-sombrero-detras.png', optimize=True)
        Image.fromarray(delante, 'RGBA').save(SAL / f'pelo-coletas-{version}-sombrero-delante.png', optimize=True)
        salidas[version] += (delante,)
    res['sha256_fuentes'] = antes; res['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (SAL / 'comprobaciones.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')

    # vistas: uniones marcadas (verde bien · magenta falla) y antes/después sobre nuestra muñeca
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}; base = PT.abrir(PT.SIN_OJOS); ab = PT.abrir(PT.OJOS['marron']); manos = PT.abrir(PT.MANOS)
    ap = {n: PT.abrir(p) for n, p in capas.items()}
    mont = lambda dt, de, extra: PT.montar([dt, base, ab, f['zapatos'], f['vestido'], manos, de, ap['coleteros']] + extra)
    vistas = [('Antes: con sombrero (puntas cortadas)', mont(ap['pelo-coletas-detras'], ap['pelo-coletas-delante'], [ap['sombrero-aventura']])),
              ('Con sombrero y puntas (candidata)', mont(salidas['con'][0], salidas['con'][5], [ap['sombrero-aventura']])),
              ('Sin sombrero y puntas (candidata)', mont(salidas['sin'][0], salidas['sin'][5], []))]
    caja = (40, 0, 948, 1200); esc = 0.5
    tl = [(n, im.crop(caja).resize((round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)), Image.LANCZOS)) for n, im in vistas]
    w2, h2 = tl[0][1].size; out = Image.new('RGB', (3 * (w2 + 8), h2 + 30), 'white'); d = ImageDraw.Draw(out)
    for i, (n, im) in enumerate(tl):
        out.paste(im, (i * (w2 + 8), 28)); d.text((i * (w2 + 8) + 4, 5), n, font=MK.F(16), fill=(40, 40, 60))
    out.save(SAL / 'antes-despues.png', optimize=True)
    capa, w, nuevo, costura, falla, _ = salidas['sin']
    v = np.array(vistas[2][1]).astype(float)
    z = (w > 0) & (capa[..., 3] > 0); v[z] = v[z] * 0.6 + np.array([255, 220, 0]) * 0.4
    v[costura & ~falla] = (0, 200, 80); v[falla] = (255, 0, 150)
    Image.fromarray(v.astype(np.uint8)).crop((40, 0, 948, 1200)).save(SAL / 'uniones.png', optimize=True)
    print(json.dumps({k: v for k, v in res.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
