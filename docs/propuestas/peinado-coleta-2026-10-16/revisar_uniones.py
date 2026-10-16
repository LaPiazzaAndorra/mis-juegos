#!/usr/bin/env python3
"""
Revisión de las uniones del pelo bajo la cinta (D-025), ANTES de integrarlo.

Se toma de la imagen sin cinta (referencias/referencia-coleta-sin-cinta.png, generada, sin modificar) SOLO el pelo de la
zona de la cinta, con un margen mínimo (3 px) de transición, sobre la imagen aprobada. No se sustituye la cara ni el
peinado completo. Para cada píxel de la unión (hasta 5 px fuera de la cinta) se mide la diferencia (ΔE Lab, media local)
entre el pelo nuevo y el aprobado: si los mechones no continúan (ΔE > 30), la unión se marca como fallida.
Se separan la unión de arriba, la de abajo (sobre la frente) y las puntas de la cinta (restos lila).
Nada se integra en las capas ni en el visor: solo se revisa.

Uso (desde la raíz): python3 docs/propuestas/peinado-coleta-2026-10-16/revisar_uniones.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; sys.path[:0] = [str(AQUI)]
import coleta as CO   # noqa: E402

A = AQUI / 'referencias' / 'referencia-coleta-cinta-aprobada.png'; Bn = AQUI / 'referencias' / 'referencia-coleta-sin-cinta.png'
MARGEN, UMBRAL = 3, 30.0

if __name__ == '__main__':
    a = Image.open(A).convert('RGBA'); b = Image.open(Bn).convert('RGBA')
    la = CO.MK.lab_de(a).astype(float); lb = CO.MK.lab_de(b).astype(float); reg = CO.regiones(la)
    ra = np.array(a)[..., :3].astype(float); rb = np.array(b)[..., :3].astype(float)
    cinta = reg == CO.CINTA
    zona = nd.binary_dilation(cinta, iterations=MARGEN)
    w = np.where(cinta, 1, np.clip(1 - nd.distance_transform_edt(~cinta) / (MARGEN + 1), 0, 1)) * zona
    comp = ra * (1 - w[..., None]) + rb * w[..., None]
    dE = np.sqrt(((la - lb) ** 2).sum(-1)); dout = nd.distance_transform_edt(~cinta)
    anillo = (dout > 0) & (dout <= MARGEN + 2) & (reg != CO.FONDO)
    media = nd.uniform_filter(dE * anillo, 9) / np.maximum(nd.uniform_filter(anillo.astype(float), 9), 1e-6)
    falla = anillo & (media > UMBRAL)
    # lado de cada píxel del anillo: arriba o abajo de la cinta (por columnas), y puntas (extremos de la cinta)
    YY, XX = np.mgrid[0:cinta.shape[0], 0:cinta.shape[1]]
    xs = np.where(cinta.any(0))[0]; x0c, x1c = xs.min(), xs.max()
    centro = np.full(cinta.shape[1], np.nan)
    for x in xs:
        centro[x] = YY[:, x][cinta[:, x]].mean()
    c = np.interp(XX, xs, centro[xs])
    puntas = (XX < x0c + 40) | (XX > x1c - 40)
    lado = np.where(puntas, 'puntas', np.where(YY < c, 'arriba', 'abajo'))
    # restos lila de la cinta en el resultado (el borde suave de la cinta que queda fuera de la zona)
    lc = CO.MK.lab_de(Image.fromarray(np.dstack([np.clip(comp, 0, 255).astype(np.uint8), np.full(cinta.shape, 255, np.uint8)]))).astype(float)
    h = np.degrees(np.arctan2(lc[..., 2], lc[..., 1])); C = np.hypot(lc[..., 1], lc[..., 2])
    lila = (h < -5) & (h > -80) & (C > 12) & nd.binary_dilation(cinta, iterations=8)
    res = {}
    for k in ('arriba', 'abajo', 'puntas'):
        m = anillo & (lado == k)
        res[k] = dict(px=int(m.sum()), fallan_px=int((falla & m).sum()), fallan=round(float((falla & m).sum() / max(m.sum(), 1)), 3),
                      dE_mediana=round(float(np.median(dE[m])), 1))
    res['restos_lila_px'] = int(lila.sum())
    res['resultado'] = 'falla' if any(res[k]['fallan'] > 0.1 for k in ('arriba', 'abajo', 'puntas')) or res['restos_lila_px'] > 20 else 'limpia'
    (AQUI / 'uniones').mkdir(exist_ok=True)
    (AQUI / 'uniones' / 'uniones.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
    # vista: aprobada · sin cinta · unión con margen mínimo · uniones marcadas (verde = bien, magenta = falla, lila = restos)
    v = comp.copy(); okm = anillo & ~falla
    v[okm] = v[okm] * 0.35 + np.array([0, 200, 80]) * 0.65
    v[falla] = v[falla] * 0.2 + np.array([255, 0, 150]) * 0.8
    v[lila] = (140, 60, 255)
    x0, y0, x1, y1 = 330, 180, 1060, 560
    tiles = [('Aprobada (con cinta)', ra), ('Imagen sin cinta', rb), ('Unión con margen de 3 px', comp), ('Uniones: verde bien · magenta falla · lila restos', v)]
    W, H = x1 - x0, y1 - y0; out = Image.new('RGB', (2 * W + 10, 2 * (H + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (t, im) in enumerate(tiles):
        X, Y = (i % 2) * (W + 10), (i // 2) * (H + 30)
        out.paste(Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).crop((x0, y0, x1, y1)), (X, Y + 28)); d.text((X + 4, Y + 5), t, font=CO.MK.F(18), fill=(40, 40, 60))
    out.save(AQUI / 'uniones' / 'uniones-marcadas.png', optimize=True)
    print(json.dumps(res, ensure_ascii=False))
