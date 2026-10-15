#!/usr/bin/env python3
"""
Ojos cerrados de PRUEBA para la base D-014 y prueba de parpadeo (PROPUESTA).

Se monta sobre la base sin ojos v3 (../sin-ojos/) y acompaña a la capa abierta candidata
(../ojos-abiertos/capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png).

La capa de ojos cerrados tiene dos partes, ambas hechas con material de la propia muñeca (no se
regenera nada; cejas, nariz, boca y proporciones no se tocan):
  1. PÁRPADO: piel que cubre por completo la zona rellenada de la base, el pliegue del párpado y las
     raíces que quedan sobre él (más 3 px), opaca, con una rampa de 7 px hacia la piel de alrededor.
     Su color es una interpolación armónica (Laplace) desde la piel ORIGINAL que rodea esa zona.
  2. LÍNEA DE PESTAÑAS CERRADA: la línea del párpado superior y las pestañas de arriba de la capa
     abierta, en espejo vertical respecto a la línea del párpado (ajustada con una parábola), colocada
     en una curva de sonrisa más alta hacia el rabillo, con la línea (6 px) entera y las pestañas
     acortadas al 60 %; se desvanece en los extremos. Es una DEFORMACIÓN de las pestañas reales, no
     un dibujo nuevo: conserva su estilo, pero no sustituye a unos ojos cerrados ilustrados a mano.

Al parpadear, la capa abierta se OCULTA por completo y se muestra la cerrada (cambio instantáneo, como
hace ya el juego con «display: none»); nunca se mezclan con transparencia, así que no se ven los parches.

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-cerrados/cerrados.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
import scipy.sparse as sp
from scipy.sparse.linalg import spsolve

AQUI = Path(__file__).resolve().parent; PROP = AQUI.parent
sys.path[:0] = [str(PROP / 'ojos-abiertos'), str(PROP / 'sin-ojos')]
import mascara as MK          # noqa: E402
import mascara_v3 as M3       # noqa: E402

BAJA, K1, K2, ESC, LINEA = 18, 6, 24, 0.6, 6     # posición y forma de la línea cerrada


def laplace(A, hueco, fijo):
    y0, x0 = np.argwhere(hueco).min(0) - 2; y1, x1 = np.argwhere(hueco).max(0) + 3
    Hh = hueco[y0:y1, x0:x1]; F = fijo[y0:y1, x0:x1]; reg = A[y0:y1, x0:x1, :3].astype(float).copy()
    idx = -np.ones(Hh.shape, int); ys, xs = np.nonzero(Hh); idx[ys, xs] = np.arange(len(ys)); N = len(ys)
    fi, co, va = [], [], []; b = np.zeros((N, 3)); cnt = np.zeros(N)
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        yy, xx = ys + dy, xs + dx; j = idx[yy, xx]; h = j >= 0
        fi += list(np.flatnonzero(h)); co += list(j[h]); va += [-1.0] * int(h.sum()); cnt[h] += 1
        f = (~h) & F[yy, xx]; b[f] += reg[yy[f], xx[f]]; cnt[f] += 1
    cnt[cnt == 0] = 1
    M = sp.csc_matrix((va + list(cnt), (fi + list(range(N)), co + list(range(N)))), shape=(N, N))
    out = A[..., :3].astype(float).copy()
    for c in range(3):
        reg[ys, xs, c] = spsolve(M, b[:, c])
    out[y0:y1, x0:x1] = reg
    return out


def capa_cerrada(A, AB, PL, Z3, abierta, lab):
    L = lab[..., 0]; H, W = L.shape; YY, XX = np.mgrid[0:H, 0:W]
    ven = np.zeros((H, W), bool); pieles = []
    for cx, cy in MK.OJOS:
        cx, cy = int(cx), int(cy); ven |= (np.abs(XX - cx) < 118) & (YY > cy - 78) & (YY < cy + 68)
        r = np.hypot((XX - cx) / 95, (YY - cy) / 55); pieles.append(np.median(lab[(r > 0.95) & (r < 1.05) & (YY > cy)], 0))
    tapar = (Z3 | (nd.binary_dilation(PL, iterations=3) & ven)) & ven
    nucleo = nd.binary_dilation(tapar, iterations=3) & ven
    alfa = np.clip(1 - nd.distance_transform_edt(~nucleo) / 7, 0, 1) * ven
    pielosa = np.zeros((H, W), bool)
    for piel in pieles:
        pielosa |= (np.sqrt(((lab - piel) ** 2).sum(-1)) < 28) & (L > piel[0] - 22) & (L < piel[0] + 8)
    piel_rgb = laplace(A, alfa > 0, pielosa & ~(alfa > 0))
    capa = np.zeros_like(A); capa[..., :3] = np.clip(np.round(piel_rgb), 0, 255).astype(np.uint8)
    capa[..., 3] = np.round(alfa * 255).astype(np.uint8)
    copiadas = []
    for (cx, cy), piel in zip(MK.OJOS, pieles):
        cx, cy = int(cx), int(cy)
        top = np.full(W, 10 ** 6); ys, xs = np.nonzero(AB & (np.abs(XX - cx) < 115)); np.minimum.at(top, xs, ys)
        cols = np.flatnonzero(top < 10 ** 6); yfit = np.polyval(np.polyfit(cols, top[cols], 2), np.arange(W))
        wcol = np.clip(1 - np.maximum(cols.min() - np.arange(W), np.arange(W) - cols.max()).clip(0) / 25, 0, 1)
        sel = (abierta[..., 3] > 0) & ~AB & (YY < cy + 5) & (np.abs(XX - cx) < 115) & (np.abs(YY - cy) < 70)
        sel &= (YY <= yfit[None, :] + 2) & (XX >= cols.min() - 25) & (XX <= cols.max() + 25) & (L < piel[0] - 30) & ((yfit[None, :] - YY) <= 34)
        ys, xs = np.nonzero(sel)
        s = 1 if cx < MK.EJE else -1; t = np.clip((xs - cx) / 95.0, -1, 1); ext = np.clip(-t * s, 0, 1)
        ylin = cy + BAJA - K1 * t ** 2 - K2 * ext ** 1.5
        dd = yfit[xs] - ys; dd = np.where(dd < LINEA, dd, LINEA + ESC * (dd - LINEA))
        yn = np.round(ylin + dd).astype(int); ok = (yn >= 0) & (yn < H)
        src = abierta[ys[ok], xs[ok]].astype(float); src[:, 3] *= wcol[xs[ok]]; dst = capa[yn[ok], xs[ok]].astype(float)
        a = src[:, 3:] / 255; dst[:, :3] = src[:, :3] * a + dst[:, :3] * (1 - a); dst[:, 3:] = np.maximum(dst[:, 3:], src[:, 3:])
        primera = np.full(W, 10 ** 6); np.minimum.at(primera, xs[ok], yn[ok]); borde = yn[ok] == primera[xs[ok]]
        dst[borde, :3] = dst[borde, :3] * 0.55 + capa[yn[ok][borde], xs[ok][borde], :3] * 0.45
        capa[yn[ok], xs[ok]] = np.round(dst).astype(np.uint8); copiadas.append(int(ok.sum()))
    capa[capa[..., 3] == 0] = 0                      # fuera de la capa, transparente de verdad
    return capa, tapar, copiadas


def componer(base, capa):
    al = capa[..., 3:].astype(float) / 255; r = base.astype(float).copy()
    r[..., :3] = capa[..., :3] * al + base[..., :3] * (1 - al)
    return np.clip(np.round(r), 0, 255).astype(np.uint8)


def blanco(x):
    i = Image.fromarray(x, 'RGBA'); bg = Image.new('RGBA', i.size, (255, 255, 255, 255)); bg.alpha_composite(i); return bg.convert('RGB')


if __name__ == '__main__':
    im = Image.open(PROP / 'base-transparencia-corregida.png').convert('RGBA'); A = np.array(im)
    m3, m2, AB, PL, _, _ = M3.mascara_v3(im); lab = MK.lab_de(im)
    sin = np.array(Image.open(PROP / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'))
    Z3 = np.array(Image.open(PROP / 'sin-ojos' / 'zona-relleno-v3.png')) > 0
    abierta = np.array(Image.open(PROP / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png'))
    capa, tapar, copiadas = capa_cerrada(A, AB, PL, Z3, abierta, lab)
    Image.fromarray(capa, 'RGBA').save(AQUI / 'capa-ojos-cerrados-prueba.png', optimize=True)
    Image.fromarray((tapar * 255).astype(np.uint8), 'L').save(AQUI / 'zona-que-tapan.png', optimize=True)
    # estados: base sin ojos + UNA sola capa (nunca las dos)
    abiertos, cerrados = componer(sin, abierta), componer(sin, capa)
    Image.fromarray(cerrados, 'RGBA').save(AQUI / 'estado-cerrados.png', optimize=True)
    Image.fromarray(abiertos, 'RGBA').save(AQUI / 'estado-abiertos.png', optimize=True)
    # vistas fijas: tamaño de juego y cara ampliada
    caja = (150, 160, 810, 1550); cara = (270, 330, 690, 560)
    est = [('Original', blanco(A)), ('Abiertos (v3 color exp.)', blanco(abiertos)), ('Cerrados (prueba)', blanco(cerrados))]
    filas = []
    for alto in (480, 220):
        ps = [p.crop(caja).resize((round(660 * alto / 1390), alto), Image.LANCZOS) for _, p in est]
        f = Image.new('RGB', (max(sum(p.width + 12 for p in ps), 520), alto + 56), 'white'); d = ImageDraw.Draw(f); x = 0
        d.text((2, 2), f'Muñeca de {alto} px de alto (aprox. {"«Vestir» en iPhone" if alto > 300 else "«Mi Mundo»"})', font=MK.F(16), fill=(40, 40, 60))
        for (t, _), p in zip(est, ps):
            f.paste(p, (x, 52)); d.text((x + 2, 28), t if alto > 300 else t.split(' (')[0], font=MK.F(13 if alto < 300 else 15), fill=(90, 80, 110)); x += p.width + 12
        filas.append(f)
    cs = [p.crop(cara).resize(((cara[2] - cara[0]) * 2, (cara[3] - cara[1]) * 2), Image.LANCZOS) for _, p in est]
    f = Image.new('RGB', (cs[0].width, (cs[0].height + 34) * 3), 'white'); d = ImageDraw.Draw(f)
    for i, ((t, _), c) in enumerate(zip(est, cs)):
        d.text((4, i * (c.height + 34) + 6), t + ' · cara ×2', font=MK.F(20), fill=(40, 40, 60)); f.paste(c, (0, i * (c.height + 34) + 30))
    filas.append(f)
    out = Image.new('RGB', (max(r.width for r in filas), sum(r.height + 10 for r in filas)), 'white'); y = 0
    for r in filas:
        out.paste(r, (0, y)); y += r.height + 10
    out.save(AQUI / 'vista-estados.png', optimize=True)
    # cobertura y bordes: zona que debe tapar + diferencia con la piel de alrededor
    marca = np.array(blanco(cerrados)).copy(); bz = tapar ^ nd.binary_erosion(tapar); marca[bz] = (0, 160, 255)
    Image.fromarray(marca).crop(cara).resize(((cara[2] - cara[0]) * 2, (cara[3] - cara[1]) * 2), Image.NEAREST).save(AQUI / 'vista-cobertura.png', optimize=True)
    # animación de parpadeo (cambio instantáneo de capa): 1,2 s abiertos · 0,2 s cerrados · 1,0 s abiertos · 0,2 · 0,6
    def fotogramas(recorte, escala):
        ab = blanco(abiertos).crop(recorte); ce = blanco(cerrados).crop(recorte)
        if escala != 1:
            tam = (round(ab.width * escala), round(ab.height * escala)); ab, ce = ab.resize(tam, Image.LANCZOS), ce.resize(tam, Image.LANCZOS)
        return [ab, ce, ab, ce, ab], [1200, 200, 1000, 200, 600]
    for nombre, recorte, esc in (('parpadeo-tamano-juego.gif', caja, 480 / 1390), ('parpadeo-cara.gif', cara, 1.5)):
        fr, dur = fotogramas(recorte, esc)
        fr[0].save(AQUI / nombre, save_all=True, append_images=fr[1:], duration=dur, loop=0, optimize=True)
    cub = (capa[..., 3] == 255)
    fuera = (cerrados != A).any(-1) & ~nd.binary_dilation(tapar, iterations=11)
    comp = dict(zona_que_deben_tapar_px=int(tapar.sum()), tapada_por_completo_px=int((tapar & cub).sum()),
                pestañas_copiadas_px=copiadas, cambios_lejos_de_los_ojos_px=int(fuera.sum()),
                caja_de_cambios_cerrados=list(Image.fromarray(((cerrados != A).any(-1)).astype(np.uint8) * 255).getbbox()),
                parpadeo='cambio instantáneo de capa (sin mezcla de opacidad), 200 ms cerrados como en el juego')
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
