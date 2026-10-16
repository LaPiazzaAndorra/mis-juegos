#!/usr/bin/env python3
"""
Encaje de los accesorios de pelo (D-024, primera prueba: lazo, pasador de flores y mariposa) sobre los rizos originales.

Cada accesorio es una capa transparente INDEPENDIENTE de 948 × 1659 (el lienzo de la muñeca), que va encima del pelo de
delante y debajo de la corona. Se usa el recorte de extraer.py, solo escalado y girado (sin deformar), y se coloca en los
rizos del lado de la cabeza:
  · no toca la piel visible de la cara (ni las orejas), ni la corona (se pueden llevar a la vez);
  · queda sobre el pelo (pelo de delante o de detrás) en casi toda su superficie.
La muñeca, la cabeza y el peinado no cambian.

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/capas/colocar.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[3]; P = RAIZ / 'docs' / 'propuestas'
B = P / 'base-aprobada-d013-2026-10-14'
sys.path[:0] = [str(B / 'piel-tonos'), str(B / 'ojos-abiertos')]
import piel_tonos as PT   # noqa: E402  (montaje, peso de la piel y piel visible)

# centro (x, y) en el lienzo de la muñeca, ancho final (px) y giro (grados, + = sentido contrario a las agujas del reloj)
ENCAJE = {
    'lazo': dict(centro=(642, 263), ancho=138, giro=-18),
    'flores': dict(centro=(274, 278), ancho=168, giro=32),
    'mariposa': dict(centro=(288, 295), ancho=122, giro=14),
}
NOMBRES = {'lazo': 'Lazo de satén', 'flores': 'Pasador de flores', 'mariposa': 'Mariposa lila'}


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def colocar(recorte, centro, ancho, giro):
    im = Image.open(recorte).convert('RGBA'); s = ancho / im.width
    # escalado y giro con alfa premultiplicada (sin halos)
    a = np.array(im).astype(float); al = a[..., 3:] / 255; pre = np.dstack([a[..., :3] * al, a[..., 3:]])
    W, H = round(im.width * s), round(im.height * s)
    canales = [Image.fromarray(pre[..., i].astype(np.float32), 'F').resize((W, H), Image.LANCZOS).rotate(giro, Image.BICUBIC, expand=True) for i in range(4)]
    c = np.stack([np.array(x) for x in canales], -1); A = np.clip(c[..., 3], 0, 255)
    rgb = c[..., :3] / np.maximum(A[..., None] / 255, 1e-6)
    pieza = np.dstack([np.clip(rgb, 0, 255), A]).round().astype(np.uint8); pieza[A < 1] = 0
    lienzo = np.zeros((1659, 948, 4), np.uint8); h, w = pieza.shape[:2]
    x0, y0 = round(centro[0] - w / 2), round(centro[1] - h / 2)
    lienzo[y0:y0 + h, x0:x0 + w] = pieza
    return lienzo


if __name__ == '__main__':
    fuentes = [AQUI / f'{k}-recortado.png' for k in ENCAJE] + [PT.SIN_OJOS, PT.CP.DELANTE, PT.CP.DETRAS, PT.SIN_PIEL['corona']]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(base); wb, _ = PT.peso_base(base, lab)
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
    delante, detras, corona = f['pelo-delante'], f['pelo-detras'], f['corona']
    piel_visible = (wb > 0) & (base[..., 3] > 0) & (delante[..., 3] < 128)       # cara, orejas y cuello que se ven
    pelo = (delante[..., 3] > 0) | (detras[..., 3] > 0)
    info = {}; capas = {}
    for k, e in ENCAJE.items():
        c = colocar(AQUI / f'{k}-recortado.png', **e); hay = c[..., 3] > 0
        Image.fromarray(c, 'RGBA').save(AQUI / f'capa-{k}.png', optimize=True); capas[k] = c
        ys, xs = np.where(hay)
        info[k] = dict(**e, caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], px=int(hay.sum()),
                       solape_piel_visible_px=int((hay & piel_visible).sum()), solape_corona_px=int((hay & (corona[..., 3] > 0)).sum()),
                       sobre_el_pelo=round(float((hay & pelo).sum() / hay.sum()), 3))
    comp = dict(metodo='recorte de extraer.py escalado y girado (sin deformar), encima del pelo de delante y debajo de la corona',
                accesorios=info, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # vistas: cabeza con cada accesorio (con y sin corona), sobre la muñeca aprobada
    capas_muneca = [detras, base, PT.abrir(PT.OJOS['marron']), f['zapatos'], f['vestido'], PT.abrir(PT.MANOS), delante]
    caja = (120, 20, 840, 560); filas = []
    for con_corona in (True, False):
        fila = []
        for k in ['ninguno'] + list(ENCAJE):
            im = PT.montar(capas_muneca + ([capas[k]] if k != 'ninguno' else []) + ([corona] if con_corona else []))
            fila.append((k, im.crop(caja).resize(((caja[2] - caja[0]) // 2, (caja[3] - caja[1]) // 2), Image.LANCZOS)))
        filas.append((con_corona, fila))
    w, h = filas[0][1][0][1].size; out = Image.new('RGB', (4 * (w + 8), 2 * (h + 30)), 'white'); d = ImageDraw.Draw(out)
    for j, (cc, fila) in enumerate(filas):
        for i, (k, im) in enumerate(fila):
            out.paste(im, (i * (w + 8), j * (h + 30) + 26))
            d.text((i * (w + 8) + 4, j * (h + 30) + 4), (NOMBRES.get(k, 'Sin accesorio')) + (' · con corona' if cc else ' · sin corona'), font=PT.MK.F(15), fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-accesorios.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
