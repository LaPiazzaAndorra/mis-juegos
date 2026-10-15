#!/usr/bin/env python3
"""
Zapatos rosa (diseño aprobado, D-017): extrae cada zapato de la imagen generada ../referencia-muneca-con-zapatos.png
(sin modificar) como CANDIDATA de capa y comprueba su encaje sobre los pies originales de la base D-014 / conjunto D-016.

Extracción (solo el zapato; nada más de la imagen generada):
  · zona de los pies (y 1415–1580, x 300–660);
  · se quita la piel: la pierna (unida al borde superior de la zona) y la piel grande dentro de la abertura del zapato
    (empeine), por color (tono 42–75°, L > 62, croma 14–50). Queda el zapato: pala, tira, hebilla, lazo, corazón y suela;
  · se quedan las dos piezas grandes (izquierdo y derecho); los bordes conservan el alfa original de la imagen.
Por la abertura se ve el empeine de NUESTRA base, no el de la imagen generada.

Encaje: traslado puro (sin escala) hasta que ningún píxel del pie de la base quede fuera del contorno del zapato:
  · izquierdo: sin cambio (0, 0); derecho: +2 px en horizontal (el pie asomaba 24 px por el borde exterior).
Orden de capas: pelo detrás · base · ojos · ZAPATOS · vestido · brazos · pelo delante.

Uso (desde la raíz): python3 docs/propuestas/zapatos-rosa-2026-10-15/montaje/zapatos.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.morphology import convex_hull_image

AQUI = Path(__file__).resolve().parent; ZAP = AQUI.parent; RAIZ = ZAP.parents[2]
sys.path[:0] = [str(RAIZ / 'docs' / 'propuestas' / 'vestido-rosa-2026-10-15' / 'montaje')]
import montaje_vestido as MV   # noqa: E402

R = MV.R; H, W, YY, XX = MV.H, MV.W, MV.YY, MV.XX
RH = MV.VAR / 'redistribucion-hombros'
DESPLAZAMIENTO = {'izquierdo': (0, 0), 'derecho': (2, 0)}       # (dx, dy) en px; sin escala


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def extraer(g):
    lab = R.lab_rgba(g); L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b); hue = np.degrees(np.arctan2(b, a))
    zona = (YY >= 1405) & (YY < 1580) & (XX > 300) & (XX < 660) & (g[..., 3] > 8)
    piel = (hue > 42) & (hue < 75) & (L > 62) & (C > 14) & (C < 50)
    pierna = nd.binary_propagation(piel & (YY >= 1405) & (YY < 1415), mask=piel & (YY < 1530))
    pz = piel & zona & (YY < 1515); lb, n = nd.label(pz); sz = nd.sum(pz, lb, range(1, n + 1))
    grande = np.isin(lb, 1 + np.flatnonzero(sz > 300))
    grande = nd.binary_dilation(grande, iterations=1) & (piel | (hue > 30)) & ~((hue < 35) & (C > 20))
    m = nd.binary_opening(zona & ~pierna & ~grande & (YY >= 1415), np.ones((3, 3)))
    lb, n = nd.label(m); sz = nd.sum(m, lb, range(1, n + 1))
    piezas = {}
    for i in 1 + np.argsort(sz)[-2:]:
        p = lb == i; lado = 'izquierdo' if np.nonzero(p)[1].mean() < 479 else 'derecho'
        piezas[lado] = p
    return piezas


def mover(capa, dx, dy):
    out = np.zeros_like(capa); out[max(dy, 0):H + min(dy, 0), max(dx, 0):W + min(dx, 0)] = capa[max(-dy, 0):H + min(-dy, 0), max(-dx, 0):W + min(-dx, 0)]
    return out


if __name__ == '__main__':
    rutas = dict(generada=ZAP / 'referencia-muneca-con-zapatos.png', base=MV.BASE / 'base-transparencia-corregida.png',
                 sin_ojos=MV.BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
                 abiertos=MV.BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
                 cerrados=MV.BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png',
                 vestido=MV.VES / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png', brazos=MV.VES / 'montaje' / 'brazos-delante-copiados-de-la-base.png',
                 pelo_detras=MV.VAR / 'pelo-variante-sin-mechon-detras.png', pelo_delante=RH / 'mechones-completos-chatgpt' / 'pelo-delante-mechones-completos.png')
    antes = {k: sha(p) for k, p in rutas.items()}
    g, base, sin, ab, ce, ves, br, det, dela = (MV.abrir(rutas[k]) for k in
        ('generada', 'base', 'sin_ojos', 'abiertos', 'cerrados', 'vestido', 'brazos', 'pelo_detras', 'pelo_delante'))
    piezas = extraer(g)
    pies = (base[..., 3] > 128) & (YY >= 1440)
    capa = np.zeros_like(g); info = {}
    for lado, m in piezas.items():
        z = g.copy(); z[~m] = 0
        Image.fromarray(z, 'RGBA').save(AQUI / f'zapato-{lado}-candidato-sin-ajustar.png', optimize=True)
        dx, dy = DESPLAZAMIENTO[lado]; zm = mover(z, dx, dy)
        lado_px = (XX < 479) if lado == 'izquierdo' else (XX >= 479)
        def fuera(capa_z):
            return int((pies & lado_px & ~convex_hull_image(capa_z[..., 3] > 0) & (YY > 1450)).sum())
        ys, xs = np.nonzero(zm[..., 3] > 0); yp, xp = np.nonzero(pies & lado_px)
        info[lado] = dict(desplazamiento_px=[dx, dy], escala=1.0, pie_fuera_del_zapato_px_sin_ajustar=fuera(z), pie_fuera_del_zapato_px=fuera(zm),
                          caja_zapato=[int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
                          caja_pie=[int(xp.min()), int(yp.min()), int(xp.max()) + 1, int(yp.max()) + 1], px=int((zm[..., 3] > 0).sum()))
        capa = R.MP.comp(capa, zm)
    Image.fromarray(capa, 'RGBA').save(AQUI / 'zapatos-candidatos.png', optimize=True)
    m0 = MV.montar([det, sin, ab, ves, br, dela])
    m1 = MV.montar([det, sin, ab, capa, ves, br, dela])
    Image.fromarray(m1, 'RGBA').save(AQUI / 'montaje-zapatos.png', optimize=True)
    Image.fromarray(MV.montar([det, sin, ce, capa, ves, br, dela]), 'RGBA').save(AQUI / 'montaje-zapatos-cerrados.png', optimize=True)
    # comprobaciones
    lab = R.lab_rgba(capa); hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1])); C = np.hypot(lab[..., 1], lab[..., 2])
    piel_tomada = (capa[..., 3] > 200) & (hue > 42) & (hue < 75) & (lab[..., 0] > 62) & (C > 14) & (C < 50)
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes, zapatos=info,
                muneca_igual_fuera_de_los_zapatos=bool((m1 == m0)[capa[..., 3] == 0].all()),
                solo_zona_de_los_pies=bool((capa[..., 3] == 0)[(YY < 1415) | (YY >= 1580)].all()),
                px_con_color_de_piel_en_la_capa=int(piel_tomada.sum()),
                nota_piel='el corazón dorado y algunos brillos del lazo tienen tono parecido a la piel; se revisan a ojo')
    comp['fuentes_sin_cambios'] = antes == {k: sha(p) for k, p in rutas.items()}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # vistas
    F = R.MK.F; caja = (290, 1380, 670, 1590)
    def vista(x, fondo=MV.CLARO):
        return R.MP.blanco(x, fondo).crop(caja).resize(((caja[2] - caja[0]) * 2, (caja[3] - caja[1]) * 2), Image.LANCZOS)
    pies_borde = pies & ~nd.binary_erosion(pies); g1 = np.array(R.MP.blanco(m1)); g1[pies_borde & (capa[..., 3] > 0)] = (0, 200, 255)
    pan = [('Referencia generada (diseño)', vista(g)), ('Antes · pies de D-016', vista(m0)), ('Zapatos sobre la muñeca', vista(m1)),
           ('Azul: contorno del pie bajo el zapato', Image.fromarray(g1).crop(caja).resize(((caja[2] - caja[0]) * 2, (caja[3] - caja[1]) * 2), Image.NEAREST)),
           ('Zapatos solos · fondo oscuro', vista(capa, MV.OSCURO))]
    fr = Image.new('RGB', (3 * (pan[0][1].width + 10), 2 * (pan[0][1].height + 30)), 'white'); d = ImageDraw.Draw(fr)
    for i, (t, p) in enumerate(pan):
        x, y = (i % 3) * (p.width + 10), (i // 3) * (p.height + 30)
        fr.paste(p, (x, y + 26)); d.text((x + 2, y + 4), t, font=F(16), fill=(40, 40, 60))
    fr.save(AQUI / 'encaje-zapatos.png', optimize=True)
    ent = [('Antes (D-016)', R.MP.blanco(m0)), ('Con zapatos', R.MP.blanco(m1))]
    fr = Image.new('RGB', (2 * 370, 670), 'white'); d = ImageDraw.Draw(fr)
    for i, (t, p) in enumerate(ent):
        fr.paste(p.crop((20, 20, 928, 1640)).resize((358, 640), Image.LANCZOS), (i * 370, 28)); d.text((i * 370 + 2, 6), t, font=F(15), fill=(90, 80, 110))
    fr.save(AQUI / 'vista-muneca-con-zapatos.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
