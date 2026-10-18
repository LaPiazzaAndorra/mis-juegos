#!/usr/bin/env python3
"""
Adornos para la coleta (con y sin cinta, D-025) y las dos coletas (con y sin sombrero, D-026) · D-024, candidatos.

Se reutilizan las piezas aprobadas, solo con escala, posición y giro (colocar() de ../capas/colocar.py), sin deformar la
cabeza ni el pelo; cada adorno es una capa transparente INDEPENDIENTE de 948 × 1659, encima del pelo (y de la cinta o los
coleteros) y, con el sombrero, debajo de él:
  · pasador de flores, mariposa y lazo: sus recortes aprobados (../capas/*-recortado.png);
  · diadema y corona: la capa aprobada recortada a su caja (mismos píxeles), en recortes/.
Con la melena siguen las capas aprobadas. Donde un adorno no cabe (lo tapa la cinta o el sombrero, o pide otra
perspectiva), no se fuerza: queda como incompatible, con su motivo, en comprobaciones.json.

Comprobaciones de cada colocación: nada sobre la piel que se ve (cara y orejas) ni sobre las cejas; qué parte queda sobre el
pelo; qué parte tapa el sombrero; cuánto pisa la cinta. Las capas de los peinados y los recortes no cambian (sha256).

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/peinados/colocar_peinados.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; sys.path[:0] = [str(AQUI)]
import base_peinados as BP   # noqa: E402
PT, CL, CV = BP.PT, BP.CL, BP.CV
ACC = AQUI.parent; RAIZ = ACC.parents[2]; REC = AQUI / 'recortes'
APROBADAS = {'diadema': ACC / 'diadema' / 'capa-diadema.png', 'corona': RAIZ / 'docs' / 'propuestas' / 'corona-2026-10-15' / 'montaje' / 'corona-candidata.png'}
RECORTE = {'flores': ACC / 'capas' / 'flores-recortado.png', 'mariposa': ACC / 'capas' / 'mariposa-recortado.png',
           'lazo': ACC / 'capas' / 'lazo-recortado.png', 'diadema': REC / 'diadema-de-la-capa-aprobada.png',
           'corona': REC / 'corona-de-la-capa-aprobada.png'}
NOMBRE = {'flores': 'Pasador de flores', 'mariposa': 'Mariposa lila', 'diadema': 'Diadema de estrellas', 'corona': 'Corona',
          'lazos-coleteros': 'Dos lazos pequeños en los coleteros'}
# colocación: lista de piezas (recorte, centro, ancho, giro) por adorno y versión del peinado; None = incompatible (motivo)
LAZOS = [('lazo', (240, 545), 75, 15), ('lazo', (716, 545), 75, -15)]      # sobre los dos coleteros, por fuera de la cara
ENCAJE = {
    'coleta-con': {'flores': [('flores', (425, 100), 140, 10)], 'mariposa': [('mariposa', (405, 110), 95, 10)],
                   'corona': [('corona', (469, 80), 280, 0)]},
    'coleta-sin': {'flores': [('flores', (300, 262), 150, 30)], 'mariposa': [('mariposa', (300, 300), 115, 14)],
                   'diadema': [('diadema', (474, 200), 433, 0)], 'corona': [('corona', (469, 110), 312, 0)]},
    'coletas2-con': {'flores': [('flores', (230, 600), 140, -20)], 'mariposa': [('mariposa', (240, 600), 110, -10)],
                     'lazos-coleteros': LAZOS},
    'coletas2-sin': {'flores': [('flores', (274, 278), 168, 32)], 'mariposa': [('mariposa', (288, 295), 122, 14)],
                     'diadema': [('diadema', (474, 212), 433, 0)], 'corona': [('corona', (469, 135), 300, 0)],
                     'lazos-coleteros': LAZOS},
}
INCOMPATIBLE = {
    'coleta-con': {'diadema': 'va justo donde está la cinta (pisaría la cinta entera): no se ponen las dos'},
    'coletas2-con': {'diadema': 'el sombrero la tapa entera', 'corona': 'el sombrero la tapa casi entera (86 %)'},
}
ADORNOS = ['flores', 'mariposa', 'diadema', 'corona', 'lazos-coleteros']


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def recortes_aprobados():
    REC.mkdir(exist_ok=True); info = {}
    for k, p in APROBADAS.items():
        a = PT.abrir(p); ys, xs = np.where(a[..., 3] > 0); x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        Image.fromarray(a[y0:y1, x0:x1], 'RGBA').save(RECORTE[k], optimize=True)
        info[k] = dict(caja=[int(x0), int(y0), int(x1), int(y1)], centro=[(x0 + x1) / 2, (y0 + y1) / 2], ancho=int(x1 - x0))
    return info


def capa(piezas):
    c = np.zeros((1659, 948, 4), np.uint8)
    for k, centro, ancho, giro in piezas:
        c = PT.montar_rgba([c, CL.colocar(RECORTE[k], centro, ancho, giro)]) if c[..., 3].any() else CL.colocar(RECORTE[k], centro, ancho, giro)
    return c


def mascaras(v):
    """pelo (con cinta/coleteros como apoyo), piel que se ve, cejas, cinta y sombrero de cada versión (piel clara, castaño)."""
    debajo, encima = BP.capas_peinado(v)
    p, w = v.split('-')
    base = PT.abrir(PT.SIN_OJOS); wb, _ = PT.peso_base(base, PT.lab_de(base))
    if p == 'coleta':
        pelo = [PT.abrir(CV.VAR / f'pelo-coleta-{w}-{q}-castano.png') for q in ('detras', 'delante')]
        orejas = (PT.abrir(CV.VAR / 'orejas-coleta-detras.png')[..., 3] > 0) | (PT.abrir(CV.VAR / 'orejas-coleta-delante.png')[..., 3] > 0)
        cinta = PT.abrir(CV.CINTA)[..., 3] > 0 if w == 'con' else np.zeros(base.shape[:2], bool)
        apoyo = cinta
    else:
        pelo = [PT.abrir(BP.CS2 / 'variantes' / f'pelo-coletas-{w}-sombrero-{q}-castano.png') for q in ('detras', 'delante')]
        orejas = np.zeros(base.shape[:2], bool); cinta = np.zeros(base.shape[:2], bool)
        apoyo = PT.abrir(BP.CS2 / 'coleteros.png')[..., 3] > 0
    delante = pelo[1][..., 3]
    piel = ((((wb > 0) & (base[..., 3] > 0)) | orejas) & (delante < 128)) & ~apoyo
    piel[700:] = False                                                   # solo la cabeza y el cuello
    ys = np.mgrid[0:1659, 0:948][0]
    cejas = nd.binary_dilation(piel & (ys > 330) & (ys < 400) & (PT.lab_de(base)[..., 0] < 170), iterations=4)   # cejas de la base (más oscuras que la piel)
    sombrero = encima[0][..., 3] > 128 if encima else np.zeros(base.shape[:2], bool)
    return dict(pelo=(pelo[0][..., 3] > 0) | (delante > 0) | apoyo, piel=piel, cejas=cejas, cinta=cinta, sombrero=sombrero)


def comprobar(c, m):
    hay = c[..., 3] > 0; n = int(hay.sum()); ys, xs = np.where(hay)
    return dict(caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], px=n,
                solape_piel_visible_px=int((hay & m['piel']).sum()), solape_cejas_px=int((hay & m['cejas']).sum()),
                sobre_el_pelo=round(float((hay & m['pelo']).sum() / n), 3), sobre_la_cinta_px=int((hay & m['cinta']).sum()),
                tapado_por_el_sombrero=round(float((hay & m['sombrero']).sum() / n), 3))


if __name__ == '__main__':
    fuentes = [RECORTE[k] for k in ('flores', 'mariposa', 'lazo')] + list(APROBADAS.values())
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    medidas = recortes_aprobados(); SAL = AQUI / 'capas'; SAL.mkdir(exist_ok=True)
    info, capas = {}, {}
    for v in BP.VERSIONES:
        m = mascaras(v); info[v] = {}
        for k in ADORNOS:
            if k in ENCAJE[v]:
                c = capa(ENCAJE[v][k]); capas[v, k] = c
                Image.fromarray(c, 'RGBA').save(SAL / f'{k}-{v}.png', optimize=True)
                info[v][k] = dict(piezas=[dict(recorte=r, centro=list(ce), ancho=an, giro=g) for r, ce, an, g in ENCAJE[v][k]], **comprobar(c, m))
            elif k in INCOMPATIBLE.get(v, {}):
                info[v][k] = dict(incompatible=INCOMPATIBLE[v][k])
    # hoja de comparación: una fila por peinado, una columna por adorno
    caja = (150, 0, 800, 650); w, h = 325, 325; F = PT.MK.F(15)
    out = Image.new('RGB', (len(ADORNOS) * (w + 8) + 150, len(BP.VERSIONES) * (h + 8) + 30), 'white'); d = ImageDraw.Draw(out)
    for j, k in enumerate(ADORNOS):
        d.text((150 + j * (w + 8) + 4, 6), NOMBRE[k], font=F, fill=(40, 40, 60))
    for i, v in enumerate(BP.VERSIONES):
        y = 30 + i * (h + 8); d.text((4, y + h // 2), BP.NOMBRE[v].replace(' con', '\ncon').replace(' sin', '\nsin'), font=F, fill=(40, 40, 60))
        for j, k in enumerate(ADORNOS):
            x = 150 + j * (w + 8)
            if (v, k) in capas:
                out.paste(BP.montar(v, [capas[v, k]]).crop(caja).resize((w, h), Image.LANCZOS), (x, y))
            else:
                d.rectangle((x, y, x + w, y + h), fill=(240, 236, 240)); t = info[v].get(k, {}).get('incompatible', 'solo con las dos coletas (van en los coleteros)')
                d.text((x + 10, y + h // 2 - 20), 'No compatible:' if k in INCOMPATIBLE.get(v, {}) else 'No se usa:', font=F, fill=(150, 40, 60))
                d.text((x + 10, y + h // 2), t[:40], font=PT.MK.F(13), fill=(90, 60, 70)); d.text((x + 10, y + h // 2 + 18), t[40:80], font=PT.MK.F(13), fill=(90, 60, 70))
    out.save(AQUI / 'comparacion-adornos-peinados.png', optimize=True)
    comp = dict(metodo='recortes aprobados con colocar(): solo escala, posición y giro; encima del pelo y de la cinta o los coleteros, debajo del sombrero',
                recortes_de_capas_aprobadas=medidas, colocaciones=info, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1, default=float), encoding='utf-8')
    print(json.dumps({v: {k: {x: y for x, y in r.items() if x not in ('piezas', 'caja')} for k, r in d_.items()} for v, d_ in info.items()}, ensure_ascii=False))
