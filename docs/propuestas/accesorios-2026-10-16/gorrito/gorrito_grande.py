#!/usr/bin/env python3
"""
Variante B del gorrito de dormir (D-024): el MISMO gorro recortado (gorrito-recortado.png, de gorrito.py), entre un 6 y
un 9 % más grande, con la posición ajustada para cubrir el pelo de arriba de la melena y dejar las cejas libres. Solo se
escala y se mueve el gorro (sin deformarlo); el peinado y la cabeza no cambian. El candidato A (capa-gorrito.png) se
conserva.

Búsqueda: escala ×1,06–×1,09 (sobre la de los ojos) y desplazamiento de −16 a +16 px en horizontal y de −24 a +6 px en
vertical; condiciones: el gorro no toca las cejas y queda al menos a CEJAS_MIN px de ellas (el A queda a 6,3 px), no
tapa los ojos y cabe entero en el lienzo (el pompón no se corta). Entre las que cubren el pelo de arriba (≤ 150 px sin
cubrir: solo restos de 1–2 px), se elige la que deja el ala a la altura más parecida a la del candidato A (misma
distancia a las cejas; si no, el ala sube y se ve más frente), y a igualdad, la que menos cambia.
«Pelo de arriba» se mide igual que en gorrito.py: el pelo de la melena por encima del borde de abajo del gorro.

Salida: capa-gorrito-b.png, comprobaciones-b.json, antes-despues-gorrito.png y zonas-sin-cubrir-b.png.

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/gorrito/gorrito_grande.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[3]; sys.path[:0] = [str(AQUI)]
import gorrito as G   # noqa: E402
PT = G.PT; MK = G.MK; CJ = G.CJ

ESCALAS = [1.06, 1.065, 1.07, 1.075, 1.08, 1.085, 1.09]
DX = range(-16, 17, 2); DY = range(-24, 13, 2)
CEJAS_MIN = 6.0                                 # distancia mínima (px) entre el gorro y las cejas
UMBRAL = 150                                    # px sin cubrir que se aceptan (restos de 1–2 px)
MARGEN = 4                                      # el gorro entero dentro del lienzo (px hasta el borde), sin cortar el pompón
CAJA = (286, 69, 1333, 713)                     # caja del recorte en la imagen (gorrito.py)
W, H = 948, 1659


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def colocar(pieza, k, dx, dy, solo_alfa=False):
    """Como gorrito.a_nuestro_lienzo, con la escala ×k (alrededor del punto medio de los ojos) y un desplazamiento."""
    (ax, ay), (bx, by) = G.OJOS_REF; (cx, cy), (ex, ey) = G.OJOS
    s = np.hypot(ex - cx, ey - cy) / np.hypot(bx - ax, by - ay) * k
    mx, my = (ax + bx) / 2, (ay + by) / 2; nx, ny = (cx + ex) / 2, (cy + ey) / 2
    ox = nx + (CAJA[0] - mx) * s + dx; oy = ny + (CAJA[1] - my) * s + dy
    a = pieza.astype(float); al = a[..., 3:] / 255; pre = np.dstack([a[..., :3] * al, a[..., 3:]])
    idx = [3] if solo_alfa else range(4)
    canales = {i: np.array(Image.fromarray(pre[..., i].astype(np.float32), 'F').transform((W, H), Image.AFFINE, (1 / s, 0, -ox / s, 0, 1 / s, -oy / s), Image.BICUBIC)) for i in idx}
    A = np.clip(canales[3], 0, 255)
    if solo_alfa:
        return A, s, (ox, oy)
    rgb = np.stack([canales[i] for i in range(3)], -1) / np.maximum(A[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), A]).round().astype(np.uint8); out[A < 2] = 0
    return out, s, (ox, oy)


class Medida:
    def __init__(self):
        self.base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(self.base); self.wb, _ = PT.peso_base(self.base, lab)
        self.f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
        self.de = self.f['pelo-delante'][..., 3] > 0; self.pelo = self.de | (self.f['pelo-detras'][..., 3] > 0)
        self.cejas = CJ.preparar()['hay']
        self.YY, self.XX = np.mgrid[0:H, 0:W]
        ojos = PT.abrir(PT.OJOS['marron'])[..., 3] > 0
        self.ojos = ojos & (self.YY > 400) & (self.YY < 500)

    def __call__(self, A, s, o, detalle=False):
        gorro = A >= 128; hay = A > 0
        (ppx, ppy), ppr = G.POMPON
        pcx = o[0] + (ppx - CAJA[0]) * s; pcy = o[1] + (ppy - CAJA[1]) * s
        pompon = np.hypot(self.XX - pcx, self.YY - pcy) < ppr * s + 2
        cuerpo = gorro & ~pompon; cols = np.where(cuerpo.any(0))[0]
        abajo = np.full(W, -1); abajo[cols] = [np.where(cuerpo[:, x])[0].max() for x in cols]
        y_ala = int(np.median(abajo[cols]))
        arriba = self.pelo & (((abajo[None, :] >= 0) & (self.YY <= abajo[None, :])) | ((abajo[None, :] < 0) & (self.YY <= y_ala)))
        sin = arriba & ~gorro
        dcej = float(nd.distance_transform_edt(~gorro)[self.cejas].min())
        r = dict(sin_cubrir_px=int(sin.sum()), cejas_tapadas_px=int((self.cejas & hay).sum()), distancia_cejas_px=round(dcej, 1),
                 ojos_tapados_px=int((self.ojos & hay).sum()),
                 margen_al_borde_del_lienzo_px=int(min(self.XX[hay].min(), W - 1 - self.XX[hay].max(), self.YY[hay].min())))
        if detalle:
            d = nd.distance_transform_edt(~gorro)[sin]
            et, n = nd.label(sin); tam = nd.sum(sin, et, range(1, n + 1)); zonas = []
            for i in np.argsort(-tam)[:6]:
                if tam[i] < 30:
                    break
                ys, xs = np.where(et == i + 1); zonas.append(dict(px=int(tam[i]), caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]))
            lados = self.pelo & (self.YY > abajo.max())
            r.update(pelo_de_arriba_px=int(arriba.sum()), pelo_de_arriba_cubierto=round(float((arriba & gorro).sum() / arriba.sum()), 4),
                     grosor_sin_cubrir=dict(maximo_px=round(float(d.max()), 1), p95_px=round(float(np.percentile(d, 95)), 1)) if sin.any() else {},
                     zonas_sin_cubrir=zonas, borde_de_abajo_y=dict(mediana=y_ala, minimo=int(abajo[cols].min()), maximo=int(abajo[cols].max())),
                     caja=[int(self.XX[hay].min()), int(self.YY[hay].min()), int(self.XX[hay].max()), int(self.YY[hay].max())],
                     rizos_de_los_lados_tapados_px=int((lados & gorro).sum()), rizos_de_los_lados_px=int(lados.sum()),
                     piel_de_la_frente_tapada_px=int((gorro & (self.wb > 0) & (self.base[..., 3] > 0) & ~self.de).sum()))
            r['_mascaras'] = (gorro, sin)
        return r


if __name__ == '__main__':
    fuentes = [AQUI / 'gorrito-recortado.png', AQUI / 'capa-gorrito.png', PT.SIN_OJOS, PT.CP.DELANTE, PT.CP.DETRAS]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    pieza = PT.abrir(AQUI / 'gorrito-recortado.png'); M = Medida()
    pruebas = []
    for k in ESCALAS:
        for dx in DX:
            for dy in DY:
                A, s, o = colocar(pieza, k, dx, dy, solo_alfa=True); r = M(A, s, o)
                r.update(escala=k, dx=dx, dy=dy); pruebas.append(r)
    validas = [r for r in pruebas if r['cejas_tapadas_px'] == 0 and r['distancia_cejas_px'] >= CEJAS_MIN and r['ojos_tapados_px'] == 0 and r['margen_al_borde_del_lienzo_px'] >= MARGEN]
    # entre las que cubren (≤ UMBRAL px sin cubrir: solo restos de 1–2 px en los extremos del ala), la que deja el ala a
    # la altura más parecida a la del candidato A (misma distancia a las cejas) y, a igualdad, el cambio más pequeño
    A0_, s0_, o0_ = colocar(pieza, 1.0, 0, 0, solo_alfa=True); dA = M(A0_, s0_, o0_)['distancia_cejas_px']
    cubren = [r for r in validas if r['sin_cubrir_px'] <= UMBRAL]
    mejor = min(cubren, key=lambda r: (round(abs(r['distancia_cejas_px'] - dA)), r['sin_cubrir_px'] // 25, r['escala'], abs(r['dx']) + abs(r['dy'])))
    # sin las condiciones, ¿cuánto se podría cubrir? (para saber si limitan)
    libre = min(pruebas, key=lambda r: r['sin_cubrir_px'])
    capa, s, o = colocar(pieza, mejor['escala'], mejor['dx'], mejor['dy'])
    Image.fromarray(capa, 'RGBA').save(AQUI / 'capa-gorrito-b.png', optimize=True)
    rB = M(capa[..., 3].astype(float), s, o, detalle=True); gB, sinB = rB.pop('_mascaras')
    capaA = PT.abrir(AQUI / 'capa-gorrito.png'); A0, s0, o0 = colocar(pieza, 1.0, 0, 0, solo_alfa=True)
    rA = M(capaA[..., 3].astype(float), s0, o0, detalle=True); gA, sinA = rA.pop('_mascaras')
    por_escala = {str(k): min([r for r in validas if r['escala'] == k], key=lambda r: r['sin_cubrir_px'])['sin_cubrir_px'] for k in ESCALAS}
    comp = dict(metodo='el mismo recorte del gorro, escalado ×k sobre la escala de los ojos y desplazado (sin deformar); peinado sin cambios',
                elegido=dict(escala=mejor['escala'], escala_final=round(float(s), 4), dx=mejor['dx'], dy=mejor['dy']),
                b=rB, a=rA, mejor_sin_cubrir_por_escala_con_cejas_libres=por_escala,
                mejor_sin_condiciones=dict((k, libre[k]) for k in ('escala', 'dx', 'dy', 'sin_cubrir_px', 'distancia_cejas_px', 'cejas_tapadas_px', 'margen_al_borde_del_lienzo_px')),
                pruebas=len(pruebas), validas=len(validas), cubren=len(cubren), umbral_px=UMBRAL, distancia_cejas_a_px=dA,
                todas=[{k: r[k] for k in ('escala', 'dx', 'dy', 'sin_cubrir_px', 'distancia_cejas_px', 'margen_al_borde_del_lienzo_px')} for r in validas], cejas_min_px=CEJAS_MIN, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones-b.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')

    # antes / después: A y B montados, y la cobertura marcada (magenta: pelo de arriba sin cubrir; rojo: cejas)
    f = M.f; capas = [f['pelo-detras'], M.base, PT.abrir(PT.OJOS['marron']), f['zapatos'], f['vestido'], PT.abrir(PT.MANOS), f['pelo-delante']]
    vc = (130, 0, 940, 720)

    def marcar(g, sin):
        m = np.array(PT.montar(capas)).copy()
        m[g] = (m[g] * 0.45 + np.array([90, 140, 255]) * 0.55).astype(np.uint8); m[sin] = [255, 0, 160]
        m[M.cejas] = [255, 60, 0]
        return Image.fromarray(m)
    tiles = [(f'A · ×1,00 (candidato anterior): sin cubrir {rA["sin_cubrir_px"]} px', PT.montar(capas + [capaA])),
             (f'B · ×{mejor["escala"]:.3f}, {mejor["dx"]:+d}/{mejor["dy"]:+d} px: sin cubrir {rB["sin_cubrir_px"]} px', PT.montar(capas + [capa])),
             (f'A · cobertura (cejas a {rA["distancia_cejas_px"]} px)', marcar(gA, sinA)), (f'B · cobertura (cejas a {rB["distancia_cejas_px"]} px)', marcar(gB, sinB))]
    w, h = vc[2] - vc[0], vc[3] - vc[1]; out = Image.new('RGB', (2 * (w + 8), 2 * (h + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (t, im) in enumerate(tiles):
        x, y = (i % 2) * (w + 8), (i // 2) * (h + 30)
        out.paste(im.crop(vc), (x, y + 28)); d.text((x + 4, y + 5), t, font=MK.F(17), fill=(40, 40, 60))
    out.save(AQUI / 'antes-despues-gorrito.png', optimize=True)
    z = (160, 60, 470, 420); zw, zh = (z[2] - z[0]) * 2, (z[3] - z[1]) * 2
    out = Image.new('RGB', (2 * zw + 12, 2 * (zh + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (t, im) in enumerate(tiles):
        x, y = (i % 2) * (zw + 12), (i // 2) * (zh + 30)
        out.paste(im.crop(z).resize((zw, zh), Image.LANCZOS), (x, y + 30)); d.text((x + 4, y + 6), t + ' (×2)', font=MK.F(16), fill=(40, 40, 60))
    out.save(AQUI / 'zonas-sin-cubrir-b.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k not in ('sha256_fuentes',)}, ensure_ascii=False))
