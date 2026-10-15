#!/usr/bin/env python3
"""
Variante EXPERIMENTAL sobre la revisión localizada del pelo (../pelo-revisado-*.png, que NO se modifican).

  A · Bordes: corrige SOLO la contaminación rosada (de la manga de la referencia) en los bordes de los rizos de las
      dos zonas rojas de ../zonas-pendientes.png. Se mantienen la posición, la forma y la transparencia: el canal
      alfa no cambia en ningún píxel. Los huecos de los rizos no se rellenan: siguen dejando ver el brazo o la ropa.
      Máscara explícita del cambio de color (mascara-cambio-de-color.png), dentro de las zonas rojas:
        · a ≤ 6 px del borde transparente de cada capa;
        · tono más rojizo que el pelo limpio de alrededor (tono medio de los píxeles limpios en 21 × 21 px):
          peso = (tono_local − 3° − tono) / 6°, entre 0 y 1.
      Color nuevo = color medio del pelo limpio de alrededor + la mitad de la diferencia de luminosidad del píxel
      (conserva el modelado del rizo), mezclado según el peso. Nada cambia fuera de la máscara.
  B · Mechón: alternativa SIN el mechón suelto que cruza el brazo izquierdo. Se quita solo el mechón (oscuro);
      el borde claro del rizo vecino que entra en su zona se conserva. No se recorta ningún rizo ni se inventa una
      unión. B lleva también los bordes de A.

Uso (desde la raíz):
  python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/revision-localizada/variante-experimental/variante.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; REV = AQUI.parent
sys.path[:0] = [str(REV)]
import revision_pelo as R     # noqa: E402  (zonas, composición y montaje de la revisión)

H, W, YY, XX = R.H, R.W, R.YY, R.XX
CLARO, OSCURO = (255, 250, 245), (45, 40, 70)


def lum(x):
    return 0.299 * x[..., 0] + 0.587 * x[..., 1] + 0.114 * x[..., 2]


def zonas_rojas():
    z = np.zeros((H, W), bool)
    for p in json.loads((REV / 'comprobaciones.json').read_text(encoding='utf-8'))['zonas_pendientes']:
        x0, y0, x1, y1 = p['caja']
        z |= ((XX - (x0 + x1) / 2) / ((x1 - x0) / 2 + 8)) ** 2 + ((YY - (y0 + y1) / 2) / ((y1 - y0) / 2 + 8)) ** 2 <= 1
    return z


def bordes(capa, zona):
    """→ (capa corregida, peso del cambio 0–1). Solo cambia RGB dentro de la máscara; el alfa queda igual."""
    lab = R.lab_rgba(capa); hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1])); C = np.hypot(lab[..., 1], lab[..., 2])
    a = capa[..., 3] > 0; dist = nd.distance_transform_edt(a)
    limpio = a & zona & (hue >= 45) & (dist > 4)
    k = np.ones((21, 21)); n = nd.convolve(limpio.astype(float), k, mode='constant')
    tono_local = nd.convolve(np.where(limpio, hue, 0), k, mode='constant') / np.maximum(n, 1)
    peso = np.clip((tono_local - 3 - hue) / 6, 0, 1) * (C > 6) * (n > 10) * (zona & a & (dist <= 6))
    rgb = capa[..., :3].astype(float)
    ref = np.stack([nd.convolve(rgb[..., i] * limpio, k, mode='constant') for i in range(3)], -1) / np.maximum(n, 1)[..., None]
    nuevo = np.clip(ref + 0.5 * (lum(rgb) - lum(ref))[..., None], 0, 255)
    m = peso > 0
    out = capa.copy()
    out[m, :3] = np.round(rgb[m] * (1 - peso[m, None]) + nuevo[m] * peso[m, None]).astype(np.uint8)
    return out, peso


def mechon(detras, delante):
    """Píxeles del mechón suelto: dentro de su zona (revision_pelo.ZONA_MECHON), salvo el borde claro del rizo
    vecino (L > 60, unido al pelo de fuera de la zona)."""
    z = Image.new('L', (W, H), 0); ImageDraw.Draw(z).polygon(R.ZONA_MECHON, fill=255); P = np.array(z) > 0
    pelo = (detras[..., 3] > 0) | (delante[..., 3] > 0)
    L = R.lab_rgba(R.MP.comp(detras, delante))[..., 0]
    claro = P & pelo & (L > 60) & (YY < 935)
    rizo = nd.binary_propagation(nd.binary_dilation(pelo & ~P, iterations=1) & claro, mask=claro)
    return P & pelo & ~rizo, rizo


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    raiz = R.PROP.parents[2]
    fuentes = [REV / 'pelo-revisado-detras.png', REV / 'pelo-revisado-delante.png', REV / 'montaje-revisado-abiertos.png',
               R.PROP / 'base-transparencia-corregida.png', R.PROP / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
               R.PROP / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
               R.PROP / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png']
    antes = {str(p.relative_to(raiz)): sha(p) for p in fuentes}
    det = np.array(Image.open(REV / 'pelo-revisado-detras.png')); dela = np.array(Image.open(REV / 'pelo-revisado-delante.png'))
    sin = np.array(Image.open(R.PROP / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'))
    ab = np.array(Image.open(R.PROP / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png'))
    ce = np.array(Image.open(R.PROP / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png'))
    zona = zonas_rojas()
    detA, pd = bordes(det, zona); delA, pf = bordes(dela, zona)
    quitar, rizo = mechon(detA, delA)
    detB, delB = detA.copy(), delA.copy(); detB[quitar] = 0; delB[quitar] = 0
    salidas = {'pelo-variante-bordes-detras.png': detA, 'pelo-variante-bordes-delante.png': delA,
               'pelo-variante-sin-mechon-detras.png': detB, 'pelo-variante-sin-mechon-delante.png': delB}
    for k, v in salidas.items():
        Image.fromarray(v, 'RGBA').save(AQUI / k, optimize=True)
    peso = np.maximum(pd, pf)
    Image.fromarray(np.round(peso * 255).astype(np.uint8), 'L').save(AQUI / 'mascara-cambio-de-color.png', optimize=True)
    Image.fromarray((quitar * 255).astype(np.uint8), 'L').save(AQUI / 'mascara-mechon-quitado.png', optimize=True)
    mont = {'rev': R.montar(det, sin, ab, dela), 'A': R.montar(detA, sin, ab, delA), 'B': R.montar(detB, sin, ab, delB)}
    for k, x in (('bordes', mont['A']), ('sin-mechon', mont['B'])):
        Image.fromarray(x, 'RGBA').save(AQUI / f'montaje-variante-{k}-abiertos.png', optimize=True)
    Image.fromarray(R.montar(detB, sin, ce, delB), 'RGBA').save(AQUI / 'montaje-variante-sin-mechon-cerrados.png', optimize=True)
    pelo = {'rev': R.MP.comp(det, dela), 'A': R.MP.comp(detA, delA), 'B': R.MP.comp(detB, delB)}
    F = R.MK.F

    def tabla(cajas, claves, nombre, titulo, k=2):
        fondos = [('fondo claro', lambda c: R.MP.blanco(pelo[c], CLARO)), ('fondo oscuro', lambda c: R.MP.blanco(pelo[c], OSCURO)),
                  ('sobre la muñeca', lambda c: R.MP.blanco(mont[c], CLARO))]
        filas = []
        for caja in cajas:
            w, h = (caja[2] - caja[0]) * k, (caja[3] - caja[1]) * k
            fr = Image.new('RGB', (len(fondos) * len(claves) * (w + 8) + 40, h + 30), 'white'); d = ImageDraw.Draw(fr); x = 0
            for i, (tf, fn) in enumerate(fondos):
                for c, tc in claves:
                    fr.paste(fn(c).crop(caja).resize((w, h), Image.LANCZOS), (x, 28)); d.text((x + 2, 6), f'{tc} · {tf}', font=F(15), fill=(40, 40, 60)); x += w + 8
                x += 20
            filas.append(fr)
        out = Image.new('RGB', (max(f.width for f in filas), 40 + sum(f.height + 10 for f in filas)), 'white')
        ImageDraw.Draw(out).text((4, 8), titulo, font=F(20), fill=(40, 40, 60)); y = 40
        for f in filas:
            out.paste(f, (0, y)); y += f.height + 10
        out.save(AQUI / nombre, optimize=True)

    cajas_rojas = [(200, 700, 420, 1030), (570, 720, 790, 1030)]
    tabla(cajas_rojas, [('rev', 'Antes'), ('A', 'Bordes corregidos')], 'comparacion-bordes.png',
          'Bordes de los rizos en las zonas rojas · antes / después (×2) · solo cambia el color dentro de la máscara')
    tabla([(250, 830, 430, 1030)], [('rev', 'Con mechón'), ('B', 'Sin mechón')], 'comparacion-mechon.png',
          'Mechón suelto del brazo izquierdo · con / sin (×2) · los rizos vecinos no se recortan')
    # dónde está la máscara (verde: cambio de color; azul: mechón quitado; rojo: borde del rizo que se conserva)
    g = np.array(R.MP.blanco(pelo['rev'], OSCURO)).astype(float)
    g[peso > 0] = g[peso > 0] * (1 - 0.8 * peso[peso > 0, None]) + np.array([40, 230, 90]) * 0.8 * peso[peso > 0, None]
    g[quitar] = g[quitar] * 0.3 + np.array([60, 170, 255]) * 0.7; g[rizo] = (255, 60, 60)
    v = Image.fromarray(g.astype(np.uint8)).crop((190, 680, 800, 1040)); d = ImageDraw.Draw(v)
    for i, (col, t) in enumerate((((40, 230, 90), 'cambio de color (más intenso = más cambio)'), ((60, 170, 255), 'mechón quitado (variante B)'),
                                  ((255, 60, 60), 'borde del rizo vecino que se conserva'))):
        d.rectangle((8, 8 + 22 * i, 22, 22 + 22 * i), fill=col); d.text((28, 8 + 22 * i), t, font=F(15), fill=(255, 255, 255))
    v.resize((v.width * 2, v.height * 2), Image.NEAREST).save(AQUI / 'vista-mascaras.png', optimize=True)
    # conjunto, para ver que el resto no cambia
    caja = (40, 40, 910, 1560); pan = [('Revisión (punto de partida)', 'rev'), ('A · bordes corregidos', 'A'), ('B · bordes + sin mechón', 'B')]
    ps = [R.MP.blanco(mont[c]).crop(caja).resize((343, 600), Image.LANCZOS) for _, c in pan]
    fr = Image.new('RGB', (3 * 355, 630), 'white'); d = ImageDraw.Draw(fr)
    for i, ((t, _), p) in enumerate(zip(pan, ps)):
        fr.paste(p, (i * 355, 28)); d.text((i * 355 + 2, 6), t, font=F(15), fill=(90, 80, 110))
    fr.save(AQUI / 'vista-conjunto.png', optimize=True)
    # comprobaciones
    despues = {k: sha(raiz / k) for k in antes}
    cambio_rgb = ((detA[..., :3] != det[..., :3]).any(-1) & (det[..., 3] > 0)) | ((delA[..., :3] != dela[..., :3]).any(-1) & (dela[..., 3] > 0))
    dif = np.abs(np.concatenate([(detA[..., :3].astype(int) - det[..., :3])[pd > 0], (delA[..., :3].astype(int) - dela[..., :3])[pf > 0]]))
    comp = dict(fuentes_sin_cambios=antes == despues, sha256_fuentes=antes,
                A_alfa_identico=bool((detA[..., 3] == det[..., 3]).all() and (delA[..., 3] == dela[..., 3]).all()),
                A_color_solo_dentro_de_la_mascara=bool((~cambio_rgb | (peso > 0)).all()),
                A_mascara_solo_en_zonas_rojas=bool((~(peso > 0) | zona).all()),
                A_pixeles_con_cambio_de_color=int(cambio_rgb.sum()), A_cambio_maximo_por_canal=int(dif.max()) if dif.size else 0,
                A_cambio_medio_por_canal=round(float(dif.mean()), 1) if dif.size else 0,
                B_pixeles_quitados_mechon=int(quitar.sum()), B_borde_del_rizo_conservado_px=int(rizo.sum()),
                B_solo_cambia_el_mechon=bool(((detB != detA).any(-1) | (delB != delA).any(-1))[~quitar].sum() == 0),
                montaje_igual_fuera_de_los_cambios=bool((mont['A'] == mont['rev'])[~nd.binary_dilation(peso > 0, iterations=1)].all()))
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
