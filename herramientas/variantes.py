#!/usr/bin/env python3
"""
Mi Mundo de Juegos · Borradores de variantes de color

Crea BORRADORES de variantes a partir de una pieza ya pintada, conservando el
sombreado, los brillos y los detalles. Siempre hay que revisarlos a ojo (y
retocarlos si hace falta) antes de usarlos en el juego.

  python3 herramientas/variantes.py piel arte/originales/base-clara.png arte/originales/base-morena.png
  python3 herramientas/variantes.py piel arte/originales/ojos-cerrados-clara.png arte/originales/ojos-cerrados-morena.png
  python3 herramientas/variantes.py iris arte/originales/ojos-marron.png arte/originales/ojos-azul.png \
          --mascara arte/originales/ojos-iris-mascara.png      (recomendado)

  python3 herramientas/variantes.py mascara arte/originales/ojos-marron.png arte/mascaras/ojos-iris-mascara.png
      → calcula la máscara del iris a partir de los ojos (no hace falta pintarla)

  python3 herramientas/variantes.py cerrados ojos-cerrados-BORRADOR.png arte/originales/ojos-cerrados-clara.png \
          --abiertos arte/originales/ojos-marron.png
      → ojos cerrados finales: solo párpado y pestañas (sin piel ni fondos), cada ojo
        centrado sobre su ojo abierto, al 92 % de su ancho y a la altura del párpado

  Opciones:  --tono "#b97a52"   color medio de la piel de destino (piel)
             --tono "#3d8ee0"   color del iris de destino (iris)

Cómo funciona (en el espacio de color CIELAB, que separa luz y color):
  · piel: localiza los píxeles de piel por su tono (amarillo-anaranjado) y los
    traslada al tono de destino manteniendo el contraste de luces y sombras.
    Las mejillas, los labios y el maillot rosa se protegen por su tono.
  · iris: cambia el matiz del iris conservando su luz, sus vetas y sus brillos.
    Con --mascara (dos círculos blancos sobre los iris, mismo lienzo) el resultado
    es limpio; sin máscara intenta localizar el iris solo, y puede dejar zonas
    sin cambiar en ilustraciones con iris muy oscuros.
Además deja un archivo «…-comparar.png» con el original y el borrador lado a lado.

Requiere Python 3 con Pillow y NumPy.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

# ---------- sRGB ⇄ CIELAB (D65) ----------
M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
Mi = np.linalg.inv(M)
BLANCO = np.array([0.95047, 1.0, 1.08883])


def a_lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ M.T / BLANCO
    f = np.where(xyz > (6 / 29) ** 3, np.cbrt(xyz), xyz / (3 * (6 / 29) ** 2) + 4 / 29)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def a_rgb(lab):
    fy = (lab[..., 0] + 16) / 116
    f = np.stack([fy + lab[..., 1] / 500, fy, fy - lab[..., 2] / 200], -1)
    xyz = np.where(f > 6 / 29, f ** 3, 3 * (6 / 29) ** 2 * (f - 4 / 29)) * BLANCO
    c = xyz @ Mi.T
    c = np.where(c > 0.0031308, 1.055 * np.clip(c, 0, None) ** (1 / 2.4) - 0.055, 12.92 * c)
    return np.clip(c * 255, 0, 255)


def hexlab(h):
    h = h.lstrip('#')
    return a_lab(np.array([[int(h[i:i + 2], 16) for i in (0, 2, 4)]], float))[0]


def angulo(lab):
    return np.degrees(np.arctan2(lab[..., 2], lab[..., 1])) % 360


def banda(h, centro, ancho, suave):
    """Peso 1 dentro de la banda de matiz, bajando suavemente a 0 en los bordes."""
    d = np.abs((h - centro + 180) % 360 - 180)
    return np.clip(1 - (d - ancho) / suave, 0, 1)


def piel(px, lab, tono):
    L, C, h = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2]), angulo(lab)
    # Piel: matiz ~43–65° (melocotón, incluidas orejas, nariz y mejillas). Labios (~38°) y maillot (~8°) aparte.
    w = banda(h, 54, 11, 5) * np.clip((C - 6) / 6, 0, 1) * np.clip((L - 25) / 10, 0, 1) * (px[..., 3] / 255)
    sel = w > 0.5
    if sel.sum() < 500:
        sys.exit('No encuentro suficiente piel en la imagen')
    Lm, am, bm = (np.average(lab[..., i][sel], weights=w[sel]) for i in range(3))
    Lt, at, bt = hexlab(tono)
    k = 1.05  # contraste de luces y sombras (algo más marcado en pieles oscuras)
    nuevo = np.stack([Lt + (L - Lm) * k, at + (lab[..., 1] - am) * .9, bt + (lab[..., 2] - bm) * .9], -1)
    # Las zonas rosadas (mejillas, labios) se oscurecen igual pero conservan su color
    rosa = banda(h, 34, 8, 6) * (1 - w) * np.clip((C - 8) / 8, 0, 1) * (px[..., 3] > 0)
    rosa *= np.clip((L - 30) / 10, 0, 1) * (lab[..., 1] > 15)
    rosa_nuevo = np.stack([lab[..., 0] - (Lm - Lt) * .85, lab[..., 1] * .9, lab[..., 2] * .9 + (bt - bm) * .3], -1)
    out = lab * (1 - w[..., None]) + nuevo * w[..., None]
    es_maillot = banda(h, 350, 18, 10) * np.clip((C - 20) / 6, 0, 1) * (lab[..., 0] > 60)
    r = rosa * (1 - es_maillot)
    out = out * (1 - r[..., None]) + rosa_nuevo * r[..., None]
    return out, w


def iris(px, lab, tono, mascara=None):
    L, C, h = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2]), angulo(lab)
    if mascara is not None:
        # Con máscara: todo el color dentro de los círculos del iris, salvo la pupila y los brillos blancos
        w = mascara * np.clip((C - 3) / 5, 0, 1) * np.clip((L - 6) / 8, 0, 1) * np.clip((88 - L) / 8, 0, 1) * (px[..., 3] / 255)
        return recolor_iris(lab, L, C, w, tono)
    # Color del iris: saturado y de luz media; quedan fuera el blanco, la pupila, las pestañas y la piel clara
    w = np.clip((C - 10) / 8, 0, 1) * np.clip((L - 12) / 10, 0, 1) * np.clip((66 - L) / 8, 0, 1) * (px[..., 3] / 255)
    if (w > .5).sum() < 200:
        sys.exit('No encuentro el iris en la imagen')
    # Cada ojo: centro del iris (masa de color) y radio donde la densidad de color cae;
    # fuera de ese círculo (pestañas marrones, piel) no se cambia nada.
    ys, xs = np.nonzero(w > .5)
    corte = (xs.min() + xs.max()) / 2
    yy, xx = np.indices(w.shape)
    limite = np.zeros_like(w)
    for lado in (xs < corte, xs >= corte):
        if lado.sum() < 100:
            continue
        cy, cx = np.average(ys[lado], weights=w[ys[lado], xs[lado]]), np.average(xs[lado], weights=w[ys[lado], xs[lado]])
        d = np.hypot(ys[lado] - cy, xs[lado] - cx)
        anillos = np.bincount((d // 4).astype(int), weights=w[ys[lado], xs[lado]])
        dens = anillos / (2 * np.pi * (np.arange(len(anillos)) * 4 + 2) * 4)
        ip = int(np.argmax(dens[: max(3, len(dens) // 2)]))  # la pupila, en el centro, no tiene color
        R = 4 * next((i for i in range(ip, len(dens)) if dens[i] < dens[ip] * .25), len(dens))
        dist = np.hypot(yy - cy, xx - cx)
        limite = np.maximum(limite, np.clip((R + 6 - dist) / 6, 0, 1))
    w = w * limite
    return recolor_iris(lab, L, C, w, tono)


def recolor_iris(lab, L, C, w, tono):
    Lt, at, bt = hexlab(tono)
    ht, Ct = np.degrees(np.arctan2(bt, at)), np.hypot(at, bt)
    sel = w > .5
    Cm, Lm = np.average(C[sel], weights=w[sel]), np.average(L[sel], weights=w[sel])
    C2 = C / max(Cm, 1) * Ct
    L2 = L + (Lt - Lm) * .6
    nuevo = np.stack([L2, C2 * np.cos(np.radians(ht)), C2 * np.sin(np.radians(ht))], -1)
    return lab * (1 - w[..., None]) + nuevo * w[..., None], w


def mascara_iris(px, lab):
    """Máscara del iris: zona de color de cada ojo, con la pupila y los brillos dentro."""
    from scipy import ndimage
    L, C = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2])
    cand = (C > 12) & (L > 14) & (L < 78) & (px[..., 3] > 128)
    lab_, n = ndimage.label(ndimage.binary_opening(cand, iterations=2))
    if n < 2:
        sys.exit('No encuentro los dos iris')
    tam = ndimage.sum(np.ones_like(lab_), lab_, range(1, n + 1))
    yy, xx = np.indices(L.shape)
    m = np.zeros(L.shape, bool)
    for k in 1 + np.argsort(tam)[-2:]:
        ys, xs = np.nonzero(lab_ == k)
        # El iris es un círculo: su ancho da el radio y su borde inferior (no lo tapa el párpado) el centro
        r = (xs.max() - xs.min()) / 2 + 2
        cx, cy = (xs.max() + xs.min()) / 2, ys.max() - r + 2
        m |= np.hypot(xx - cx, yy - cy) <= r
    blanco = (L > 82) & (C < 12)                    # esclerótica y brillos grandes fuera del iris
    pestana = (L < 20) & (C < 9)                    # pestañas y línea del párpado
    m &= (px[..., 3] > 128) & ~(blanco & ~ndimage.binary_fill_holes(cand)) & ~pestana
    m = ndimage.binary_fill_holes(ndimage.binary_closing(m, iterations=2))
    return ndimage.gaussian_filter(m.astype(float), 1.2)


def cerrados(ce, ab, ancho=.92, altura=.62):
    """Ojos cerrados alineados con los abiertos: se quedan solo las líneas oscuras (pestañas)."""
    L = ce[..., :3].mean(-1)
    pest = ce.copy()
    pest[..., 3] = ce[..., 3] * np.clip((125 - L) / 45, 0, 1)          # fuera piel, sombras claras y fondos
    pest[..., 3] = np.where(pest[..., 3] < 24, 0, pest[..., 3])         # sin restos tenues
    m, ma = pest[..., 3] > 128, ab[..., 3] > 128                         # se alinea por la parte opaca
    out = Image.new('RGBA', (ce.shape[1], ce.shape[0]), (0, 0, 0, 0))
    for lado in (-1, 1):
        sel = lambda a: a & ((np.indices(a.shape)[1] < 1000) if lado < 0 else (np.indices(a.shape)[1] >= 1000))
        ys, xs = np.nonzero(sel(m)); ya, xa = np.nonzero(sel(ma))
        if not len(xs) or not len(xa):
            sys.exit('Falta un ojo en alguna de las dos capas')
        todo = np.nonzero(sel(pest[..., 3] > 0))
        caja = (todo[1].min(), todo[0].min(), todo[1].max() + 1, todo[0].max() + 1)   # se recorta con su borde suave
        abajo = ys.max() + 1 - caja[1]                                                  # fondo de la línea opaca
        trozo = Image.fromarray(pest[caja[1]:caja[3], caja[0]:caja[2]].clip(0, 255).astype(np.uint8), 'RGBA')
        k = (xa.max() - xa.min()) * ancho / (xs.max() - xs.min() + 1)
        trozo = trozo.convert('RGBa').resize((round(trozo.width * k), round(trozo.height * k)), Image.LANCZOS).convert('RGBA')
        cx = (xa.min() + xa.max()) / 2
        fondo = ya.min() + (ya.max() - ya.min()) * altura                 # borde inferior del párpado cerrado
        cxo = ((xs.min() + xs.max()) / 2 - caja[0]) * k                                 # centro de la parte opaca
        out.alpha_composite(trozo, (round(cx - cxo), round(fondo - abajo * k)))
        print(f'Ojo {"izquierdo" if lado < 0 else "derecho"}: ×{k:.2f}, centro x {cx:.0f}, párpado en y {fondo:.0f}')
    return out


def main():
    if len(sys.argv) >= 4 and sys.argv[1] == 'cerrados':
        ce = np.array(Image.open(sys.argv[2]).convert('RGBA')).astype(float)
        ab = np.array(Image.open(sys.argv[sys.argv.index('--abiertos') + 1]).convert('RGBA'))
        cerrados(ce, ab).save(sys.argv[3], optimize=True)
        print(f'Ojos cerrados: {sys.argv[3]}')
        return
    if len(sys.argv) >= 4 and sys.argv[1] == 'mascara':
        im = Image.open(sys.argv[2]).convert('RGBA')
        px = np.array(im).astype(float)
        m = mascara_iris(px, a_lab(px[..., :3]))
        out = np.zeros(px.shape, np.uint8); out[..., :3] = 255; out[..., 3] = (m * 255).astype(np.uint8)
        Image.fromarray(out, 'RGBA').save(sys.argv[3], optimize=True)
        ys, xs = np.nonzero(m > .5)
        izq, der = xs < (xs.min() + xs.max()) / 2, xs >= (xs.min() + xs.max()) / 2
        for n_, sel in (('izquierdo', izq), ('derecho', der)):
            print(f'Iris {n_}: centro ({xs[sel].mean():.0f}, {ys[sel].mean():.0f}) · {xs[sel].max() - xs[sel].min()} × {ys[sel].max() - ys[sel].min()} px')
        print(f'Máscara: {sys.argv[3]}')
        return
    if len(sys.argv) < 4 or sys.argv[1] not in ('piel', 'iris'):
        sys.exit(__doc__)
    modo, ent, sal = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
    tono = sys.argv[sys.argv.index('--tono') + 1] if '--tono' in sys.argv else ('#b97a52' if modo == 'piel' else '#3d8ee0')
    im = Image.open(ent).convert('RGBA')
    px = np.array(im).astype(float)
    lab = a_lab(px[..., :3])
    if modo == 'iris' and '--mascara' in sys.argv:
        mk = Image.open(sys.argv[sys.argv.index('--mascara') + 1]).convert('RGBA')
        mk = np.array(mk).astype(float)
        mascara = (mk[..., 3] / 255) * (mk[..., :3].mean(-1) / 255)  # blanco opaco = iris
        out, w = iris(px, lab, tono, mascara)
    else:
        out, w = (piel if modo == 'piel' else iris)(px, lab, tono)
    res = np.dstack([a_rgb(out), px[..., 3]]).astype(np.uint8)
    nuevo = Image.fromarray(res, 'RGBA')
    nuevo.save(sal, optimize=True)
    # comparación: original | borrador, sobre blanco, recortado al contenido
    caja = im.getbbox()
    a, b = im.crop(caja), nuevo.crop(caja)
    k = min(1, 1400 / a.height)
    a, b = (x.resize((int(x.width * k), int(x.height * k)), Image.LANCZOS) for x in (a, b))
    cmp_ = Image.new('RGBA', (a.width * 2 + 60, a.height + 40), (255, 255, 255, 255))
    cmp_.alpha_composite(a, (20, 20)); cmp_.alpha_composite(b, (a.width + 40, 20))
    cmp_.convert('RGB').save(sal.with_name(sal.stem + '-comparar.png'))
    print(f'Borrador: {sal}  ·  píxeles cambiados: {int((w > .5).sum())}  ·  comparación: {sal.stem}-comparar.png')


if __name__ == '__main__':
    main()
