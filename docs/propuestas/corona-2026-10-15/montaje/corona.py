#!/usr/bin/env python3
"""
Corona dorada (diseño aprobado, D-018): extrae la corona de la imagen generada ../referencia-muneca-con-corona.png
(sin modificar) como capa independiente y la coloca sobre nuestra muñeca (conjunto D-016 + zapatos D-017).

Extracción (solo la corona; los huecos entre adornos quedan transparentes; sin pelo de la imagen generada):
  · zona y 40–215, x 300–640, por encima de la curva inferior de la diadema (parábola por (327,197), (467,162), (613,197));
  · semillas por color: oro (tono 64–100°, croma > 35, L > 110), perlas (croma < 24, L > 165) y piedras rosas
    (tono −45–35°, croma > 18, L > 95). El pelo (tono 44–56°) no entra;
  · límite: envolvente convexa de perlas, piedras y diadema (+2 px);
  · se recuperan sombras de perlas, engastes y perfiles del oro creciendo 3 px solo por píxeles que no tienen color de
    pelo, y se cierran huecos de ≤ 2 px; se queda la pieza grande. Los bordes conservan el alfa original.
Colocación: sin mover ni escalar (la cabeza de la imagen generada coincide con la nuestra); la diadema apoya sobre
nuestro pelo. Va encima de todas las capas.

Uso (desde la raíz): python3 docs/propuestas/corona-2026-10-15/montaje/corona.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.morphology import convex_hull_image

AQUI = Path(__file__).resolve().parent; COR = AQUI.parent; RAIZ = COR.parents[2]
sys.path[:0] = [str(RAIZ / 'docs' / 'propuestas' / 'vestido-rosa-2026-10-15' / 'montaje')]
import montaje_vestido as MV   # noqa: E402

R = MV.R; H, W, YY, XX = MV.H, MV.W, MV.YY, MV.XX
ZAP = RAIZ / 'docs' / 'propuestas' / 'zapatos-rosa-2026-10-15' / 'montaje'
RH = MV.VAR / 'redistribucion-hombros'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def disco(r):
    return np.hypot(*np.mgrid[-r:r + 1, -r:r + 1]) <= r


def extraer(g):
    lab = R.lab_rgba(g); L = lab[..., 0]; C = np.hypot(lab[..., 1], lab[..., 2]); hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    zona = (YY >= 40) & (YY < 215) & (XX >= 300) & (XX <= 640) & (g[..., 3] > 0)
    ybot = np.polyval(np.polyfit([327, 467, 613], [197, 162, 197], 2), XX)
    oro = (hue > 64) & (hue < 100) & (C > 35) & (L > 110)
    perla = (C < 24) & (L > 165)
    gema = (hue < 35) & (hue > -45) & (C > 18) & (L > 95)
    arriba = zona & (YY <= ybot + 3)
    sem = arriba & (perla | gema); lb, n = nd.label(sem); sz = nd.sum(sem, lb, range(1, n + 1)); sem = np.isin(lb, 1 + np.flatnonzero(sz >= 80))
    envolvente = nd.binary_dilation(convex_hull_image(sem | (arriba & oro & (np.abs(YY - ybot) < 6))), iterations=2)
    m = envolvente & arriba & (oro | perla | gema)
    lb, n = nd.label(m, np.ones((3, 3))); sz = nd.sum(m, lb, range(1, n + 1)); m = np.isin(lb, 1 + np.flatnonzero(sz >= 200))
    h = nd.binary_fill_holes(m) & ~m; lh, nh = nd.label(h); hs = nd.sum(h, lh, range(1, nh + 1)); m |= np.isin(lh, 1 + np.flatnonzero(hs < 10))
    sin_pelo = ((hue > 56) | (hue < 38) | (C < 26)) & (L > 60)
    for _ in range(3):
        m |= nd.binary_dilation(m, disco(1)) & sin_pelo & envolvente & (YY <= ybot + 4)
    m |= nd.binary_closing(m, disco(2)) & (L > 60) & envolvente
    lb, n = nd.label(m, np.ones((3, 3))); sz = nd.sum(m, lb, range(1, n + 1)); m = np.isin(lb, 1 + np.flatnonzero(sz >= 150))
    pelo_tomado = m & (hue > 44) & (hue < 56) & (C > 25) & (L < 140)
    return m, int(pelo_tomado.sum())


if __name__ == '__main__':
    rutas = dict(generada=COR / 'referencia-muneca-con-corona.png', sin_ojos=MV.BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
                 abiertos=MV.BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
                 cerrados=MV.BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png',
                 vestido=MV.VES / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png', brazos=MV.VES / 'montaje' / 'brazos-delante-copiados-de-la-base.png',
                 zapatos=ZAP / 'zapatos-candidatos.png', pelo_detras=MV.VAR / 'pelo-variante-sin-mechon-detras.png',
                 pelo_delante=RH / 'mechones-completos-chatgpt' / 'pelo-delante-mechones-completos.png')
    antes = {k: sha(p) for k, p in rutas.items()}
    g, sin, ab, ce, ves, br, zap, det, dela = (MV.abrir(rutas[k]) for k in
        ('generada', 'sin_ojos', 'abiertos', 'cerrados', 'vestido', 'brazos', 'zapatos', 'pelo_detras', 'pelo_delante'))
    m, pelo_tomado = extraer(g)
    cor = g.copy(); cor[~m] = 0
    Image.fromarray(cor, 'RGBA').save(AQUI / 'corona-candidata.png', optimize=True)
    m0 = MV.montar([det, sin, ab, zap, ves, br, dela])
    m1 = MV.montar([det, sin, ab, zap, ves, br, dela, cor])
    Image.fromarray(m1, 'RGBA').save(AQUI / 'montaje-corona.png', optimize=True)
    Image.fromarray(MV.montar([det, sin, ce, zap, ves, br, dela, cor]), 'RGBA').save(AQUI / 'montaje-corona-cerrados.png', optimize=True)
    pelo_nuestro = R.MP.comp(det, dela)[..., 3] > 128
    banda = m & (YY > 150)
    ys, xs = np.nonzero(m)
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes, corona_px=int(m.sum()),
                caja=[int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1], desplazamiento_px=[0, 0], escala=1.0,
                px_con_color_de_pelo_en_la_capa=pelo_tomado,
                diadema_apoyada_sobre_nuestro_pelo_pct=round(float(pelo_nuestro[banda].mean()) * 100),
                huecos_transparentes_dentro_de_la_corona_px=int((nd.binary_fill_holes(m) & ~m).sum()),
                muneca_igual_fuera_de_la_corona=bool((m1 == m0)[cor[..., 3] == 0].all()), capa='encima de todas')
    comp['fuentes_sin_cambios'] = antes == {k: sha(p) for k, p in rutas.items()}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    F = R.MK.F; caja = (250, 20, 700, 300)
    def vista(x, fondo=MV.CLARO, k=2):
        return R.MP.blanco(x, fondo).crop(caja).resize(((caja[2] - caja[0]) * k, (caja[3] - caja[1]) * k), Image.LANCZOS)
    pan = [('Referencia generada (diseño)', vista(g)), ('Antes · conjunto D-016 + zapatos', vista(m0)), ('Corona sobre la muñeca', vista(m1)),
           ('Corona sola · fondo oscuro', vista(cor, MV.OSCURO)), ('Corona sola · fondo claro', vista(cor)), ('Corona sola · cuadros', None)]
    cu = np.indices((caja[3] - caja[1], caja[2] - caja[0])).sum(0) // 8 % 2
    fondo = np.where(cu[..., None] == 1, 230, 255).astype(np.uint8).repeat(3, -1)
    fc = Image.fromarray(np.dstack([fondo, np.full(fondo.shape[:2], 255, np.uint8)]), 'RGBA'); fc.alpha_composite(Image.fromarray(cor[caja[1]:caja[3], caja[0]:caja[2]], 'RGBA'))
    pan[5] = ('Corona sola · cuadros (huecos transparentes)', fc.convert('RGB').resize(pan[0][1].size, Image.NEAREST))
    w_, h_ = pan[0][1].size
    fr = Image.new('RGB', (3 * (w_ + 10), 2 * (h_ + 30)), 'white'); d = ImageDraw.Draw(fr)
    for i, (t, p) in enumerate(pan):
        x, y = (i % 3) * (w_ + 10), (i // 3) * (h_ + 30)
        fr.paste(p, (x, y + 26)); d.text((x + 2, y + 4), t, font=F(16), fill=(40, 40, 60))
    fr.save(AQUI / 'encaje-corona.png', optimize=True)
    ent = [('Antes', R.MP.blanco(m0)), ('Con corona', R.MP.blanco(m1))]
    fr = Image.new('RGB', (2 * 370, 670), 'white'); d = ImageDraw.Draw(fr)
    for i, (t, p) in enumerate(ent):
        fr.paste(p.crop((20, 20, 928, 1640)).resize((358, 640), Image.LANCZOS), (i * 370, 28)); d.text((i * 370 + 2, 6), t, font=F(15), fill=(90, 80, 110))
    fr.save(AQUI / 'vista-muneca-con-corona.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
