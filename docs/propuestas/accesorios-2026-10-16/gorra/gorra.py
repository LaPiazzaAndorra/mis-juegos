#!/usr/bin/env python3
"""
Gorra rosa de frente con el rayo bordado (D-024): se extrae SOLO la gorra (copa, visera, botón, rayo y la pestaña lila
del lateral) de la imagen aprobada (referencia-gorra-de-frente-aprobada.png, generada, sin modificar), sin pelo ni piel,
y se coloca sobre NUESTRA muñeca con la melena suelta (que no cambia: no se recortan ni se deforman los rizos).

Extracción: semillas de rosa de la gorra y de lila de la pestaña; fondo, piel y pelo como semillas contrarias; reparto por
contraste (watershed); el rayo y las costuras (encerrados por la gorra) son parte de ella. Borde suave de 1 px quitando
el color del fondo, la piel o el pelo de alrededor (sin halo).

Encaje: se parte de la escala y la posición de los ojos (iris medidos) y se busca la escala (×0,94 a ×1,14) y el
desplazamiento que cubren el pelo de arriba con las cejas libres. Solo se escala y se mueve la gorra, sin deformarla.
  · «Pelo de arriba»: una zona FIJA, todo el pelo de la melena por encima de y = Y_SUP (lo alto de la cabeza hasta las
    sienes; el nacimiento del pelo en la frente está en y ≈ 250). Con la medida del gorrito (el pelo por encima del borde
    de la gorra), subir la gorra parecía cubrir más, porque menos pelo quedaba «por encima»; con una zona fija no.
  · Condiciones: no toca las cejas (al menos CEJAS_MIN px), no tapa los ojos, cabe entera en el lienzo y queda centrada
    en la cara (el rayo en el eje de la cara, ±DX_MAX px). Sin centrar, lo que más cubría era ×1,14 desplazada 28 px a la
    izquierda y pegada al borde de arriba del lienzo.
  · Se elige la que deja menos pelo de arriba sin cubrir; a igualdad, la visera más cerca de las cejas (como en la
    imagen aprobada), la más centrada y la que menos cambia la escala. Si ninguna cubre, se dice y se marca dónde falla.

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/gorra/gorra.py
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

REF = AQUI / 'referencia-gorra-de-frente-aprobada.png'
OJOS_REF = [(582, 623), (828, 621)]          # centros de los iris medidos en la imagen (círculos ajustados, r ≈ 48)
OJOS = [(391, 444), (565, 444)]              # los de nuestra muñeca
ESCALAS = np.round(np.arange(0.94, 1.1401, 0.01), 3)
DX_MAX = 6; DX = range(-DX_MAX, DX_MAX + 1, 2); DY = range(-40, 21, 2)
Y_SUP = 300                                  # «pelo de arriba»: el pelo por encima de esta altura (zona fija)
CEJAS_MIN = 6.0; UMBRAL = 30; MARGEN = 4
W, H = 948, 1659


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def extraer():
    im = Image.open(REF).convert('RGBA'); rgb = np.array(im)[..., :3].astype(float)
    lab = MK.lab_de(im).astype(float); L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b); h = np.degrees(np.arctan2(b, a)); YY, XX = np.mgrid[0:L.shape[0], 0:L.shape[1]]
    rosa = (h > 5) & (h < 40) & (a > 14) & (L > 110) & (YY < 600)
    lila = (b < -8) & (a > 8) & (XX > 1000) & (YY < 600)
    sem = np.zeros(L.shape, np.int32)
    sem[nd.binary_erosion((L >= 248) & (C < 5), iterations=2)] = 2                         # fondo
    sem[nd.binary_erosion((h > 45) & (C > 18) & (L > 140) & (YY > 450), iterations=2)] = 3  # piel
    sem[nd.binary_erosion((L < 130) & (h > 35) & (C > 12), iterations=1)] = 4              # pelo
    sem[nd.binary_erosion(rosa, iterations=2) | lila] = 1
    g = np.sqrt(sum(nd.sobel(nd.gaussian_filter(lab[..., i], 1), 0) ** 2 + nd.sobel(nd.gaussian_filter(lab[..., i], 1), 1) ** 2 for i in range(3)))
    m = nd.binary_fill_holes(watershed(g, sem) == 1)
    et, n = nd.label(m); m = et == (np.argmax(nd.sum(m, et, range(1, n + 1))) + 1)
    fuera = ~nd.binary_dilation(m, iterations=2)
    den = nd.gaussian_filter(fuera.astype(float), 4)
    alrededor = np.stack([nd.gaussian_filter(rgb[..., i] * fuera, 4) for i in range(3)], -1) / np.maximum(den, 1e-6)[..., None]
    al = np.clip(nd.gaussian_filter(m.astype(float), 0.8) * 1.6 - 0.3, 0, 1) * nd.binary_dilation(m, iterations=1)
    col = np.where(al[..., None] > 0, (rgb - (1 - al[..., None]) * alrededor) / np.maximum(al[..., None], 0.05), 0)
    pieza = np.dstack([np.clip(col, 0, 255), al * 255]).round().astype(np.uint8)
    ys, xs = np.where(al > 0); caja = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    return pieza[caja[1]:caja[3], caja[0]:caja[2]], caja, dict(px=int((al > 0).sum()), pestana_lila_px=int((lila & m).sum()), caja_en_la_imagen=list(caja))


def colocar(pieza, caja, k, dx, dy, solo_alfa=False):
    (ax, ay), (bx, by) = OJOS_REF; (cx, cy), (ex, ey) = OJOS
    s = np.hypot(ex - cx, ey - cy) / np.hypot(bx - ax, by - ay) * k
    mx, my = (ax + bx) / 2, (ay + by) / 2; nx, ny = (cx + ex) / 2, (cy + ey) / 2
    ox = nx + (caja[0] - mx) * s + dx; oy = ny + (caja[1] - my) * s + dy
    a = pieza.astype(float); al = a[..., 3:] / 255; pre = np.dstack([a[..., :3] * al, a[..., 3:]])
    idx = [3] if solo_alfa else range(4)
    c = {i: np.array(Image.fromarray(pre[..., i].astype(np.float32), 'F').transform((W, H), Image.AFFINE, (1 / s, 0, -ox / s, 0, 1 / s, -oy / s), Image.BICUBIC)) for i in idx}
    A = np.clip(c[3], 0, 255)
    if solo_alfa:
        return A, s
    rgb = np.stack([c[i] for i in range(3)], -1) / np.maximum(A[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), A]).round().astype(np.uint8); out[A < 2] = 0
    return out, s


class Medida:
    def __init__(self):
        self.base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(self.base); self.wb, _ = PT.peso_base(self.base, lab)
        self.f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
        self.de = self.f['pelo-delante'][..., 3] > 0; self.pelo = self.de | (self.f['pelo-detras'][..., 3] > 0)
        self.cejas = CJ.preparar()['hay']; self.YY, self.XX = np.mgrid[0:H, 0:W]
        self.ojos = (PT.abrir(PT.OJOS['marron'])[..., 3] > 0) & (self.YY > 400) & (self.YY < 500)
        ys, xs = np.where(self.cejas); self.zc = (slice(ys.min() - 60, ys.max() + 5), slice(xs.min() - 60, xs.max() + 61))

    def __call__(self, gorro, hay, detalle=False):
        cols = gorro.any(0)
        abajo = np.where(cols, H - 1 - np.argmax(gorro[::-1], 0), -1)
        y_ala = int(np.median(abajo[cols]))
        arriba = self.pelo & (self.YY < Y_SUP)                    # zona fija
        sin = arriba & ~gorro
        dist = nd.distance_transform_edt(~gorro[self.zc])[self.cejas[self.zc]].min() if gorro[self.zc].any() else 99.0
        ys, xs = np.where(hay)
        r = dict(sin_cubrir_px=int(sin.sum()), cejas_tapadas_px=int((self.cejas & hay).sum()), distancia_cejas_px=round(float(dist), 1),
                 ojos_tapados_px=int((self.ojos & hay).sum()), margen_px=int(min(xs.min(), W - 1 - xs.max(), ys.min())))
        if detalle:
            d = nd.distance_transform_edt(~gorro)[sin]
            et, n = nd.label(sin); tam = nd.sum(sin, et, range(1, n + 1)); zonas = []
            for i in np.argsort(-tam)[:6]:
                if tam[i] < 30:
                    break
                yy, xx = np.where(et == i + 1); zonas.append(dict(px=int(tam[i]), caja=[int(xx.min()), int(yy.min()), int(xx.max()), int(yy.max())]))
            lados = self.pelo & (self.YY > abajo.max())
            por_encima = self.pelo & np.where(cols[None, :], self.YY <= abajo[None, :], self.YY <= y_ala) & ~gorro
            r.update(pelo_de_arriba_px=int(arriba.sum()), pelo_de_arriba_cubierto=round(float((arriba & gorro).sum() / arriba.sum()), 4),
                     grosor_sin_cubrir=dict(maximo_px=round(float(d.max()), 1), p95_px=round(float(np.percentile(d, 95)), 1)) if sin.any() else {},
                     zonas_sin_cubrir=zonas, borde_de_abajo_y=dict(mediana=y_ala, minimo=int(abajo[cols].min()), maximo=int(abajo[cols].max())),
                     caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], rizos_de_los_lados_tapados_px=int((lados & gorro).sum()),
                     piel_de_la_frente_tapada_px=int((gorro & (self.wb > 0) & (self.base[..., 3] > 0) & ~self.de).sum()),
                     pelo_por_encima_del_borde_de_la_gorra_sin_cubrir_px=int(por_encima.sum()), _sin=sin)
        return r


def desplazar(A, dx, dy):
    out = np.zeros_like(A)
    ys, xs = slice(max(dy, 0), H + min(dy, 0)), slice(max(dx, 0), W + min(dx, 0))
    yo, xo = slice(max(-dy, 0), H + min(-dy, 0)), slice(max(-dx, 0), W + min(-dx, 0))
    out[ys, xs] = A[yo, xo]
    return out


if __name__ == '__main__':
    fuentes = [REF, PT.SIN_OJOS, PT.CP.DELANTE, PT.CP.DETRAS, PT.SIN_PIEL['corona']]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    pieza, caja, i1 = extraer(); Image.fromarray(pieza, 'RGBA').save(AQUI / 'gorra-recortada.png', optimize=True)
    M = Medida(); pruebas = []
    for k in ESCALAS:
        A0, _ = colocar(pieza, caja, float(k), 0, 0, solo_alfa=True)
        for dx in DX:
            for dy in DY:
                A = desplazar(A0, dx, dy)
                if not (A > 0).any() or (A[:, 0] > 0).any() or (A[:, -1] > 0).any() or (A[0] > 0).any():
                    continue
                r = M(A >= 128, A > 0); r.update(escala=float(k), dx=dx, dy=dy); pruebas.append(r)
    validas = [r for r in pruebas if r['cejas_tapadas_px'] == 0 and r['distancia_cejas_px'] >= CEJAS_MIN and r['ojos_tapados_px'] == 0 and r['margen_px'] >= MARGEN]
    cubren = [r for r in validas if r['sin_cubrir_px'] <= UMBRAL]
    neutra = M(*(lambda A: (A >= 128, A > 0))(colocar(pieza, caja, 1.0, 0, 0, solo_alfa=True)[0]))
    if cubren:
        mejor = min(cubren, key=lambda r: (r['sin_cubrir_px'] // 10, round(r['distancia_cejas_px']), abs(r['dx']), abs(r['escala'] - 1), abs(r['dy'])))
    else:
        mejor = min(validas, key=lambda r: (r['sin_cubrir_px'], abs(r['escala'] - 1), abs(r['dx']) + abs(r['dy'])))
    capa, s = colocar(pieza, caja, mejor['escala'], 0, 0)
    capa = np.stack([desplazar(capa[..., i], mejor['dx'], mejor['dy']) for i in range(4)], -1)
    Image.fromarray(capa, 'RGBA').save(AQUI / 'capa-gorra.png', optimize=True)
    rB = M(capa[..., 3] >= 128, capa[..., 3] > 0, detalle=True); sin = rB.pop('_sin')
    comp = dict(extraccion=i1, cubre=bool(cubren), elegido=dict(escala=mejor['escala'], escala_final=round(float(s), 4), dx=mejor['dx'], dy=mejor['dy']),
                resultado=rB, con_la_escala_de_los_ojos_sin_mover=neutra, pruebas=len(pruebas), validas=len(validas), cubren=len(cubren),
                cejas_min_px=CEJAS_MIN, umbral_px=UMBRAL, y_sup=Y_SUP, dx_max=DX_MAX, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')

    # vistas: melena con corona · con la gorra · cobertura marcada · la imagen aprobada a la misma escala
    f = M.f; capas = [f['pelo-detras'], M.base, PT.abrir(PT.OJOS['marron']), f['zapatos'], f['vestido'], PT.abrir(PT.MANOS), f['pelo-delante']]
    gorro = capa[..., 3] >= 128
    marc = np.array(PT.montar(capas)).copy()
    marc[gorro] = (marc[gorro] * 0.45 + np.array([90, 140, 255]) * 0.55).astype(np.uint8); marc[sin] = [255, 0, 160]; marc[M.cejas] = [255, 60, 0]
    ref = Image.open(REF).convert('RGB'); ref = ref.resize((round(ref.width * s), round(ref.height * s)), Image.LANCZOS)
    (ax, ay), (bx, by) = OJOS_REF; (cx, cy), (ex, ey) = OJOS
    lienzo = Image.new('RGB', (W, H), (255, 250, 245))
    lienzo.paste(ref, (round((cx + ex) / 2 - (ax + bx) / 2 * s + mejor['dx']), round((cy + ey) / 2 - (ay + by) / 2 * s + mejor['dy'])))
    tiles = [('Melena con corona (aprobada)', PT.montar(capas + [f['corona']])),
             (f'Con la gorra (candidata) · ×{mejor["escala"]:.2f}, {mejor["dx"]:+d}/{mejor["dy"]:+d} px', PT.montar(capas + [capa])),
             (f'Cobertura: sin cubrir {rB["sin_cubrir_px"]} px (magenta) · cejas a {rB["distancia_cejas_px"]} px', Image.fromarray(marc)),
             ('Imagen aprobada, misma escala', lienzo)]
    vc = (130, 0, 860, 720); w, h = vc[2] - vc[0], vc[3] - vc[1]
    out = Image.new('RGB', (2 * (w + 8), 2 * (h + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (t, im) in enumerate(tiles):
        x, y = (i % 2) * (w + 8), (i // 2) * (h + 30)
        out.paste(im.crop(vc), (x, y + 28)); d.text((x + 4, y + 5), t, font=MK.F(17), fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-gorra.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
