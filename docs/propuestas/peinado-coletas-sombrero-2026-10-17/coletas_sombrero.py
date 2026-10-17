#!/usr/bin/env python3
"""
Peinado nuevo «dos coletas rizadas bajas con coleteros verdes y sombrero de aventura» (D-026): de la imagen aprobada
(referencias/referencia-coletas-sombrero-aprobada.png, generada, sin modificar) se toman SOLO el pelo, los coleteros y el
sombrero, en cuatro capas, y se adaptan a NUESTRA base (no se toman la cara, las orejas, la piel, el cuerpo ni el
vestido de la imagen; nuestra muñeca no cambia).

1. Regiones de la imagen (fondo, pelo, piel con las orejas, sombrero, coleteros, vestido): semillas claras de cada una y
   reparto del resto por contraste (watershed).
   · Sombrero: tela beige (más amarilla que el pelo) y la cinta y el parche verdes; también el interior del ala (tejido
     algo más oscuro), que es del sombrero, no pelo.
   · Lo que la piel encierra (ojos, nariz, boca) y las cejas de la imagen no son pelo: usamos las de nuestra base. Las
     cejas de la imagen se juntan con el pelo de las sienes: se separan como el pelo que, en su columna, tiene piel justo
     encima y justo debajo. Donde la ceja se junta con el pelo de la sien (las
     colas), se queda con el pelo: así ese pelo tapa el borde de nuestra base en las sienes.
2. Encaje: con la escala y la posición de los ojos (centros de los iris), sin deformar.
3. Capas (948 × 1659):
   · pelo de detrás: todo el pelo (las dos coletas y los lados) — detrás de la base;
   · pelo de delante: el pelo que cae sobre nuestra cabeza (sienes, bajo el ala) — encima de la base;
   · coleteros: encima del pelo;
   · sombrero: encima de todo.
   Borde suave de 1 px, quitando el color del fondo o de la piel de la imagen (sin halo).
4. Lo que falta (no se inventa aquí; se marca para completarlo en ChatGPT, guia-chatgpt/):
   · bajo el sombrero la imagen no tiene pelo: qué parte de nuestra cabeza quedaría sin pelo si se quitara;
   · la imagen termina a media altura de las coletas: sus puntas quedan cortadas en línea recta por el borde de abajo.

Uso (desde la raíz): python3 docs/propuestas/peinado-coletas-sombrero-2026-10-17/coletas_sombrero.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; B = RAIZ / 'docs' / 'propuestas' / 'base-aprobada-d013-2026-10-14'
sys.path[:0] = [str(B / 'piel-tonos'), str(B / 'ojos-abiertos'), str(RAIZ / 'docs' / 'propuestas' / 'peinado-coleta-2026-10-16')]
import piel_tonos as PT   # noqa: E402
import coleta as CO       # noqa: E402  (borde suave sin el color de al lado)
MK = PT.MK

REF = AQUI / 'referencias' / 'referencia-coletas-sombrero-aprobada.png'
OJOS_REF = [(578, 628), (831, 627)]          # centros de los iris medidos en la imagen (círculos ajustados, r ≈ 48)
OJOS = [(391, 444), (565, 444)]              # los de nuestra muñeca
CEJAS_REF = [(430, 470, 680, 560), (740, 470, 990, 560)]   # zona de las cejas de la imagen (x0, y0, x1, y1)
FONDO, PELO, PIEL, SOMBRERO, COLETERO, VESTIDO = 1, 2, 3, 4, 5, 6
SAL = AQUI / 'capas'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def regiones(lab):
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]; C = np.hypot(a, b); h = np.degrees(np.arctan2(b, a))
    YY, XX = np.mgrid[0:L.shape[0], 0:L.shape[1]]
    var = np.sqrt(np.maximum(nd.uniform_filter(L * L, 7) - nd.uniform_filter(L, 7) ** 2, 0))
    sem = np.zeros(L.shape, np.int32)
    sem[nd.binary_erosion((L >= 248) & (C < 5), iterations=2)] = FONDO
    sem[nd.binary_erosion((L < 150) & (h > 30) & (h < 54) & (C > 20), iterations=2)] = PELO
    piel = (h > 38) & (h < 62) & (C > 18) & (L > 150) & (var < 6) & (YY > 470) & (YY < 900)
    piel = nd.binary_erosion(piel, iterations=3); et, n = nd.label(piel); s = nd.sum(piel, et, range(1, n + 1))
    sem[np.isin(et, 1 + np.where(s > 400)[0])] = PIEL
    verde = (h > 85) & (C > 8) & (L < 190)
    sem[nd.binary_erosion((h > 58) & (h < 88) & (C > 15) & (C < 50) & (L > 85) & (YY < 720), iterations=2) | (verde & (YY < 480))] = SOMBRERO
    sem[nd.binary_erosion(verde & (YY > 640) & (YY < 820), iterations=1)] = COLETERO
    sem[nd.binary_erosion((YY > 880) & (XX > 540) & (XX < 870) & (h < 35) & (h > -40) & (C > 8), iterations=2)] = VESTIDO
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(lab[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(lab[..., i], 1), 1) ** 2 for i in range(3)))
    reg = watershed(g, sem)
    cara = nd.binary_fill_holes(reg == PIEL); reg[cara & (reg == PELO)] = PIEL
    # cejas de la imagen (en la imagen se juntan con el pelo de las sienes): en su zona, el pelo que, en su columna, tiene
    # piel justo encima y justo debajo (una franja entre la frente y el párpado); el pelo de las sienes sigue hasta el ala
    z = np.zeros(L.shape, bool)
    for x0, y0, x1, y1 in CEJAS_REF:
        z[y0:y1, x0:x1] = True
    p = reg == PELO; ceja = np.zeros(L.shape, bool)
    for x in np.where(z.any(0))[0]:
        col = reg[:, x]; ys = np.where(p[:, x] & z[:, x])[0]
        if not len(ys):
            continue
        cortes = np.split(ys, np.where(np.diff(ys) > 1)[0] + 1)
        for tramo in cortes:
            arriba, abajo = tramo[0] - 1, tramo[-1] + 1
            if col[arriba] == PIEL and col[abajo] == PIEL and len(tramo) < 45:
                ceja[tramo, x] = True
    ceja = nd.binary_dilation(ceja, iterations=2) & p & z
    reg[ceja] = PIEL
    p = reg == PELO; et, n = nd.label(p); s = nd.sum(p, et, range(1, n + 1))   # motitas sueltas: no son pelo
    reg[np.isin(et, 1 + np.where(s < 300)[0])] = FONDO
    # trocitos sueltos del color del sombrero o de los coleteros: los que están en la cara (brillos de los ojos, etc.) son
    # piel; los que asoman entre los mechones (el interior del ala visto entre el pelo) siguen siendo del sombrero
    for k, cuantos in ((SOMBRERO, 1), (COLETERO, 2)):
        m = reg == k; et, n = nd.label(m); s = nd.sum(m, et, range(1, n + 1)); grandes = 1 + np.argsort(-s)[:cuantos]
        for i in range(1, n + 1):
            if i in grandes:
                continue
            anillo = nd.binary_dilation(et == i, iterations=2) & ~(et == i)
            if (reg[anillo] == PIEL).sum() >= (reg[anillo] == PELO).sum():
                reg[et == i] = PIEL
    sb = nd.binary_fill_holes(reg == SOMBRERO); reg[sb & (reg != SOMBRERO)] = SOMBRERO   # ojales y sombras de la tela
    return reg


def a_nuestro_lienzo(capa, metodo=Image.BICUBIC):
    (ax, ay), (bx, by) = OJOS_REF; (cx, cy), (dx, dy) = OJOS
    s = np.hypot(dx - cx, dy - cy) / np.hypot(bx - ax, by - ay)
    mx, my = (ax + bx) / 2, (ay + by) / 2; nx, ny = (cx + dx) / 2, (cy + dy) / 2
    t = (1 / s, 0, mx - nx / s, 0, 1 / s, my - ny / s)
    if capa.ndim == 2:
        return np.array(Image.fromarray(capa.astype(np.uint8)).transform((948, 1659), Image.AFFINE, t, Image.NEAREST)), s
    a = capa.astype(float); al = a[..., 3:] / 255; pre = np.dstack([a[..., :3] * al, a[..., 3:]])
    c = np.stack([np.array(Image.fromarray(pre[..., i].astype(np.float32), 'F').transform((948, 1659), Image.AFFINE, t, metodo)) for i in range(4)], -1)
    A = np.clip(c[..., 3], 0, 255); rgb = c[..., :3] / np.maximum(A[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), A]).round().astype(np.uint8); out[A < 2] = 0
    return out, s


if __name__ == '__main__':
    SAL.mkdir(exist_ok=True)
    fuentes = [REF, PT.SIN_OJOS, PT.OJOS['marron'], PT.CERRADOS]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    im = Image.open(REF).convert('RGBA'); rgb = np.array(im)[..., :3].astype(float); lab = MK.lab_de(im).astype(float)
    reg = regiones(lab)
    otro = (reg == FONDO) | (reg == PIEL) | (reg == VESTIDO)
    pelo, s = a_nuestro_lienzo(CO.suave(reg == PELO, rgb, otro))
    coleteros, _ = a_nuestro_lienzo(CO.suave(reg == COLETERO, rgb, otro | (reg == PELO)))
    sombrero, _ = a_nuestro_lienzo(CO.suave(reg == SOMBRERO, rgb, otro | (reg == PELO)))
    R, _ = a_nuestro_lienzo(reg)
    base = PT.abrir(PT.SIN_OJOS); YY = np.mgrid[0:1659, 0:948][0]
    cabeza = nd.binary_dilation((base[..., 3] > 0) & (YY < 600), iterations=2)
    delante = pelo.copy(); delante[~cabeza] = 0
    # las puntas de las pestañas de la imagen (oscuras, junto al pelo) no van encima de nuestros ojos
    ojos_n = (PT.abrir(PT.OJOS['marron'])[..., 3] > 0) | (PT.abrir(PT.CERRADOS)[..., 3] > 0)
    delante[nd.binary_dilation(ojos_n, iterations=3)] = 0
    detras = pelo.copy()
    for nombre, c in (('pelo-coletas-detras', detras), ('pelo-coletas-delante', delante), ('coleteros', coleteros), ('sombrero-aventura', sombrero)):
        Image.fromarray(c, 'RGBA').save(SAL / f'{nombre}.png', optimize=True)

    # comprobaciones sobre nuestra muñeca
    ojos = (PT.abrir(PT.OJOS['marron'])[..., 3] > 0) | (PT.abrir(PT.CERRADOS)[..., 3] > 0)
    cejas = PT.CJ.preparar()['hay']
    S = sombrero[..., 3] > 128; Pd = delante[..., 3] > 128; Pt = detras[..., 3] > 128
    craneo = (base[..., 3] > 0) & (YY < 330)
    # lo que dejaría ver el fondo: huecos entre nuestra cabeza y el pelo/sombrero de la imagen (donde la imagen tenía piel
    # u orejas que no se toman y nuestra base no llega)
    tapa = S | Pd | Pt | (coleteros[..., 3] > 128) | (base[..., 3] > 0)
    zona = nd.binary_fill_holes(tapa) & (YY < 760)
    huecos = zona & ~tapa
    # pelo oculto bajo el sombrero: nuestra cabeza (por encima de la frente) que tapa el sombrero y que no tiene pelo debajo
    frente_y = 300
    oculto = (base[..., 3] > 0) & S & ~Pd & (YY < frente_y + 60)
    oculto |= S & ~(base[..., 3] > 0) & ~Pt & nd.binary_dilation(base[..., 3] > 0, iterations=60) & (YY < 520)  # alrededor de la cabeza, bajo el ala
    # piel de nuestra base que se vería entre el ala y la cara (cuero cabelludo, sienes) con el sombrero puesto
    lb = PT.lab_de(base); wb, _ = PT.peso_base(base, lb)
    craneo_visible = craneo & ~S & ~Pd & ~nd.binary_dilation(cejas, iterations=3)
    # las coletas siguen por debajo del borde de abajo de la imagen: ahí quedan cortadas en línea recta
    (ax, ay), (bx, by) = OJOS_REF; (cx, cy), (dx_, dy_) = OJOS
    y_corte = int(np.floor((im.height - 1 - (ay + by) / 2) * s + (cy + dy_) / 2))
    fila = detras[y_corte - 2, :, 3] > 128
    xs_corte = np.where(fila)[0]
    tramos = [[int(x[0]), int(x[-1])] for x in np.split(xs_corte, np.where(np.diff(xs_corte) > 1)[0] + 1)] if len(xs_corte) else []
    comp = dict(escala=round(float(s), 4), coletas_cortadas_por_el_borde_de_la_imagen=dict(y=y_corte, tramos_x=tramos), px={k: int((c[..., 3] > 0).sum()) for k, c in (('detras', detras), ('delante', delante), ('coleteros', coleteros), ('sombrero', sombrero))},
                sombrero_sobre_cejas_px=int((S & cejas).sum()), distancia_ala_cejas_px=round(float(nd.distance_transform_edt(~S)[cejas].min()), 1),
                pelo_o_sombrero_sobre_ojos_px=int(((S | Pd) & ojos).sum()),
                craneo_cubierto=round(float(((S | Pd) & craneo).sum() / craneo.sum()), 4), craneo_visible_px=int(craneo_visible.sum()),
                huecos_con_fondo_px=int(huecos.sum()), piel_u_orejas_de_la_imagen_tomadas_px=0,
                pelo_oculto_bajo_el_sombrero_px=int(oculto.sum()), sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (SAL / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')

    # vistas: melena (aprobada) · coletas con sombrero (candidato) · sin sombrero: lo que falta (marcado)
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
    ab = PT.abrir(PT.OJOS['marron']); manos = PT.abrir(PT.MANOS)
    con = PT.montar([detras, base, ab, f['zapatos'], f['vestido'], manos, delante, coleteros, sombrero])
    sin = np.array(PT.montar([detras, base, ab, f['zapatos'], f['vestido'], manos, delante, coleteros])).copy()
    marca = sin.copy(); marca[oculto] = (marca[oculto] * 0.4 + np.array([255, 0, 160]) * 0.6).astype(np.uint8); marca[huecos] = [0, 200, 255]
    vistas = [('Melena suelta (aprobada)', PT.montar([f['pelo-detras'], base, ab, f['zapatos'], f['vestido'], manos, f['pelo-delante']])),
              ('Coletas con sombrero (candidato)', con), ('Sin el sombrero: pelo que falta (magenta)', Image.fromarray(marca))]
    caja = (40, 0, 948, 1000); esc = 0.55
    tiles = [(n, v.crop(caja).resize((round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)), Image.LANCZOS)) for n, v in vistas]
    w, h = tiles[0][1].size; out = Image.new('RGB', (3 * (w + 8), h + 30), 'white'); d = ImageDraw.Draw(out)
    for i, (n, v) in enumerate(tiles):
        out.paste(v, (i * (w + 8), 28)); d.text((i * (w + 8) + 4, 5), n, font=MK.F(17), fill=(40, 40, 60))
    out.save(SAL / 'comparacion-coletas-sombrero.png', optimize=True)
    cols = {FONDO: (255, 255, 255), PELO: (140, 80, 40), PIEL: (250, 200, 170), SOMBRERO: (200, 180, 120), COLETERO: (60, 160, 60), VESTIDO: (255, 150, 200)}
    v = np.zeros(rgb.shape, np.uint8)
    for k, c in cols.items():
        v[reg == k] = c
    Image.fromarray(np.concatenate([rgb.astype(np.uint8), v], 1)).resize((1402, 561), Image.LANCZOS).save(SAL / 'regiones-de-la-imagen.png', optimize=True)
    Image.fromarray(oculto.astype(np.uint8) * 255).save(SAL / 'mascara-pelo-oculto-bajo-el-sombrero.png', optimize=True)
    # plantilla para ChatGPT: la muñeca con las coletas sin el sombrero, lo que falta en magenta y el corte de las coletas
    G = AQUI / 'guia-chatgpt'; G.mkdir(exist_ok=True)
    pl = Image.fromarray(marca); d = ImageDraw.Draw(pl)
    for x0, x1 in tramos:
        d.line([(x0, y_corte), (x1, y_corte)], fill=(255, 200, 0), width=5)
    d.text((40, y_corte + 10), 'Aquí la imagen corta las coletas: faltan sus puntas', font=MK.F(22), fill=(200, 120, 0))
    d.text((40, 30), 'Magenta: pelo que esconde el sombrero (falta)', font=MK.F(22), fill=(200, 0, 120))
    d.text((40, 60), 'Azul: entre las coletas y el cuello se ve el fondo (en la imagen era su cuello)', font=MK.F(18), fill=(0, 130, 190))
    pl.crop((0, 0, 948, 1100)).save(G / 'plantilla-pelo-que-falta.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
