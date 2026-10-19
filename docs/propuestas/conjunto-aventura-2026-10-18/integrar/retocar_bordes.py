#!/usr/bin/env python3
"""
Retoque de dos filos (D-027, candidato), con máscaras mínimas y en COPIAS (los originales no cambian):

1. Mangas: la camiseta nueva (integrar/ropa/camiseta.png) es 1–3 px más estrecha que la manga rosa de la base, y en el
   borde exterior de las mangas asoma un filo rosa. Máscara: el rosa de la base que se ve en la zona de las mangas, + 1 px.
   Relleno con la tela crema contigua de la MISMA fila de la manga, desplazada hacia fuera lo que mide el filo en esa fila:
   el borde suave de la manga y sus costuras (el dobladillo, que va en horizontal) llegan al nuevo borde.
2. Cadera izquierda: en y ≈ 980–1005, el contorno de nuestra cadera (con el rosa de las mallas de la base) sale 1–4 px por
   fuera del lateral del pantalón, justo encima de su bolsillo. Ahí debería verse el lateral del pantalón verde (la ropa
   tapa el cuerpo; en la imagen aprobada esa zona del pantalón quedaba junto a la mochila). Máscara: ese rosa, + 1 px.
   Relleno con la tela verde contigua de la misma fila del pantalón, desplazada hacia fuera, igual que en las mangas.

Solo cambian los píxeles de las máscaras (se comprueba). Salida: integrar/ropa-b/ (camiseta.png, pantalon.png, máscaras,
comprobaciones.json, antes-despues.png). El chaleco es el de integrar/ropa/.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/retocar_bordes.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; sys.path.insert(0, str(CJ))
import conjunto_aventura as A   # noqa: E402
PT = A.PT; CREMA = (253, 250, 245); SAL = AQUI / 'ropa-b'; H, W = 1659, 948
YY, XX = np.mgrid[0:H, 0:W]


def capas(cam, pan):
    base = PT.abrir(AQUI / 'piernas-b2' / 'base-piernas-sin-mallas.png')
    otras = [PT.abrir(CJ / 'capas' / f'{k}.png') for k in ('calcetines', 'botas')]
    return base, otras + [cam, pan, PT.abrir(AQUI / 'ropa' / 'chaleco.png'), PT.abrir(PT.MANOS)]


def rosa_visto(cam, pan):
    base, encima = capas(cam, pan)
    tapa = 1 - np.prod([1 - c[..., 3] / 255 for c in encima], 0); lb = PT.lab_de(base)
    return (base[..., 3] > 128) & (lb[..., 1] > 15) & (lb[..., 2] < 14) & (tapa < 0.5), base


def estirar(capa, mascara, hacia, base):
    """Rellena la máscara fila a fila con la misma fila de la capa desplazada hacia fuera (hacia = +1 derecha, −1 izquierda)
    lo que mide el filo en esa fila; el borde suave y las costuras de la fila llegan al nuevo borde. La tela cubre en cada
    píxel al menos lo que cubre la base (su contorno suave), para que no asome el rosa por debajo."""
    nueva = capa.copy()
    for y in np.unique(np.where(mascara)[0]):
        xs = np.where(mascara[y])[0]; hay = np.where(capa[y, :, 3] > 0)[0]
        if not len(hay):
            continue
        if hacia > 0:
            borde = hay[hay <= xs.max()].max() if (hay <= xs.max()).any() else hay.min(); d = max(xs.max() - borde, 0)
        else:
            borde = hay[hay >= xs.min()].min() if (hay >= xs.min()).any() else hay.max(); d = max(borde - xs.min(), 0)
        opacos = hay[capa[y, hay, 3] > 250]
        for x in xs:
            src = x - hacia * d
            if not (0 <= src < W):
                continue
            c = capa[y, src].copy()
            if c[3] < 250 and len(opacos):          # el color, de la tela opaca más cercana de la fila
                c[:3] = capa[y, opacos[np.argmin(np.abs(opacos - src))], :3]
            c[3] = max(int(capa[y, src, 3]), int(base[y, x, 3]))
            nueva[y, x] = c
    return nueva


def estirar_abajo(capa, mascara, base):
    """Como estirar(), pero en vertical: la misma columna de la capa, bajada lo que mide el trocito (para los que quedan
    bajo el dobladillo de la manga: ahí la tela tiene que bajar, no salir hacia el lado)."""
    nueva = capa.copy()
    for x in np.unique(np.where(mascara)[1]):
        ys = np.where(mascara[:, x])[0]; hay = np.where(capa[:, x, 3] > 0)[0]; hay = hay[hay <= ys.max()]
        if not len(hay):
            continue
        d = max(ys.max() - hay.max(), 0) + 2; opacos = hay[capa[hay, x, 3] > 250]   # +2: sin el filo claro del borde del dobladillo
        for y in ys:
            src = y - d; c = capa[src, x].copy()
            if c[3] < 250 and len(opacos):
                c[:3] = capa[opacos[np.argmin(np.abs(opacos - src))], x, :3]
            c[3] = max(int(capa[src, x, 3]), int(base[y, x, 3])); nueva[y, x] = c
    return nueva


def por_trozos(capa, mascara, base):
    """Cada trozo de la máscara se rellena desde el lado en que tiene la tela: de lado (fila) o desde arriba (columna)."""
    nueva = capa.copy(); et, n = nd.label(mascara, structure=np.ones((3, 3))); op = capa[..., 3] > 200
    for i in range(1, n + 1):
        m = et == i; ys, xs = np.where(m); anillo = nd.binary_dilation(m, iterations=3) & ~m & op
        ay, ax = np.where(anillo)
        if not len(ay):
            continue
        arriba = (ay < ys.min()).sum(); izq = (ax < xs.min()).sum(); der = (ax > xs.max()).sum()
        if arriba > max(izq, der):
            # bajo el dobladillo: no se alarga la manga (salían dientes); solo se cierra su borde suave donde ya hay tela
            borde = m & (capa[..., 3] > 0); c = capa.copy(); c[borde, 3] = np.maximum(capa[borde, 3], base[borde, 3])
            _, (iy, ix) = nd.distance_transform_edt(capa[..., 3] < 250, return_indices=True)   # color: la tela opaca más cercana
            c[borde, :3] = capa[iy[borde], ix[borde], :3]
            nueva = np.where(m[..., None], c, nueva)
        else:
            nueva = np.where(m[..., None], estirar(capa, m, +1 if der > izq else -1, base), nueva)
    return nueva


def detalle(a, b, mascara, caja, esc, titulo, F):
    borde = nd.binary_dilation(mascara, iterations=1) & ~mascara
    g = a.copy(); g[borde] = (230, 0, 140)
    ims = [Image.fromarray(x).crop(caja).resize(((caja[2] - caja[0]) * esc, (caja[3] - caja[1]) * esc), Image.NEAREST) for x in (a, g, b)]
    w, h = ims[0].size; o = Image.new('RGB', (3 * (w + 10), h + 26), 'white'); d = ImageDraw.Draw(o)
    d.text((4, 4), titulo, font=F, fill=(40, 40, 60))
    for i, (im, t) in enumerate(zip(ims, ['antes', 'máscara', 'después'])):
        o.paste(im, (i * (w + 10), 26)); d.text((i * (w + 10) + w - 70, 4), t, font=F, fill=(120, 40, 90))
    return o


def montar(cam, pan):
    base, encima = capas(cam, pan)
    f = Image.new('RGBA', (W, H), CREMA + (255,))
    for c in [base, PT.abrir(PT.OJOS['marron'])] + encima:
        f.alpha_composite(Image.fromarray(c, 'RGBA'))
    return np.array(f.convert('RGB'))


if __name__ == '__main__':
    cam0 = PT.abrir(AQUI / 'ropa' / 'camiseta.png'); pan0 = PT.abrir(CJ / 'capas' / 'pantalon.png')
    visto, base = rosa_visto(cam0, pan0); dentro = base[..., 3] > 0
    mangas = nd.binary_dilation(visto & (YY > 620) & (YY < 820), iterations=1) & dentro
    cadera = nd.binary_dilation(visto & (YY > 960) & (YY < 1012) & (XX < 360), iterations=1) & dentro
    cam = por_trozos(cam0, mangas, base)
    pan = estirar(pan0, cadera, -1, base)
    SAL.mkdir(exist_ok=True)
    Image.fromarray(cam, 'RGBA').save(SAL / 'camiseta.png', optimize=True); Image.fromarray(pan, 'RGBA').save(SAL / 'pantalon.png', optimize=True)
    for n, m in (('mascara-mangas.png', mangas), ('mascara-cadera.png', cadera)):
        Image.fromarray(np.where(m, 255, 0).astype(np.uint8)).save(SAL / n, optimize=True)
    visto2, _ = rosa_visto(cam, pan)
    def caja(m):
        ys, xs = np.where(m); return [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())] if len(xs) else None
    comp = dict(mangas=dict(mascara_px=int(mangas.sum()), caja=caja(mangas), rosa_antes_px=int((visto & (YY > 620) & (YY < 820)).sum()),
                            rosa_despues_px=int((visto2 & (YY > 620) & (YY < 820)).sum()),
                            camiseta_cambia_solo_en_la_mascara=bool((cam[~mangas] == cam0[~mangas]).all())),
                cadera=dict(mascara_px=int(cadera.sum()), caja=caja(cadera), rosa_antes_px=int((visto & (YY > 960) & (YY < 1012) & (XX < 360)).sum()),
                            rosa_despues_px=int((visto2 & (YY > 960) & (YY < 1012) & (XX < 360)).sum()),
                            pantalon_cambia_solo_en_la_mascara=bool((pan[~cadera] == pan0[~cadera]).all()),
                            que_deberia_verse='el lateral del pantalón verde: es el contorno de nuestra cadera (rosa de las mallas de la base) '
                                              'que sale 1–4 px por fuera del pantalón, encima de su bolsillo; la ropa tapa el cuerpo'),
                rosa_a_la_vista_total=dict(antes=int(visto.sum()), despues=int(visto2.sum())))
    (SAL / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    a, b = montar(cam0, pan0), montar(cam, pan); F = PT.MK.F(15); hojas = []
    for nombre, m in (('Manga derecha', mangas & (XX > W // 2)), ('Manga izquierda', mangas & (XX < W // 2)), ('Cadera izquierda', cadera)):
        if m.any():
            ys, xs = np.where(m); cx, cy = int(xs.mean()), int(ys.mean()); hh = max(30, (ys.max() - ys.min()) // 2 + 12)
            hojas.append(detalle(a, b, m, (cx - 30, cy - hh, cx + 30, cy + hh), 4 if hh < 50 else 3, f'{nombre} ({m.sum()} px)', F))
    W2 = max(h.width for h in hojas); out = Image.new('RGB', (W2, sum(h.height + 10 for h in hojas)), 'white'); y = 0
    for h in hojas:
        out.paste(h, (0, y)); y += h.height + 10
    out.save(SAL / 'antes-despues.png', optimize=True)
    Image.fromarray(b).save(SAL / 'montaje-sin-pelo.png', optimize=True)
    print(json.dumps(comp, ensure_ascii=False))
