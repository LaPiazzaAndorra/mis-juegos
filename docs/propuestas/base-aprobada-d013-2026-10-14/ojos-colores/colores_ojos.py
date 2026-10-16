#!/usr/bin/env python3
"""
Variantes de color de los ojos (azul, verde y lila de fantasía) cambiando SOLO el color de los iris de nuestra capa
original de ojos abiertos (../ojos-abiertos/capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png, que no se modifica).

De la referencia aprobada (referencia-tonos-aprobados.png, imagen generada, sin modificar) solo se MIDE el tono:
el tono medio (en Lab) y la saturación media de sus iris. No se toma ningún píxel de ella.

Recoloreado, en Lab, solo dentro de los iris:
  · zona: círculo de radio 31 px alrededor de cada centro (391, 443) y (566, 443), con borde suave hasta 33 px; peso
    por color: solo píxeles de tono marrón (tono 15–80°, croma > 6). Así no cambian las pestañas, el blanco, los
    brillos (sin color) ni la piel;
  · se conserva la LUMINOSIDAD de cada píxel (textura, sombreado, pupila, aro oscuro y brillos);
  · tono nuevo = tono aprobado + la mitad de la variación de tono original (mantiene las vetas);
  · saturación nueva = saturación original × (saturación aprobada / saturación media del iris marrón);
  · el canal alfa no cambia: la posición y la transparencia son las mismas.
El parpadeo reutiliza los ojos cerrados V2.1 aprobados (no cambian).

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-colores/colores_ojos.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageCms, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; BASE = AQUI.parent; RAIZ = BASE.parents[2]
sys.path[:0] = [str(BASE / 'ojos-abiertos')]
import mascara as MK   # noqa: E402

ORIGEN = BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png'
REF = AQUI / 'referencia-tonos-aprobados.png'
CENTROS = [(391, 443), (566, 443)]; RADIO = 31.0; BORDE = 2.0
# pupilas de los ojos de la referencia (medidas: zona oscura central) y familias de tono, solo para MEDIR
REF_OJOS = {'azul': [(211, 381), (438, 378)], 'verde': [(893, 381), (1116, 381)], 'lila': [(1569, 375), (1804, 384)]}
FAMILIA = {'azul': (-140, -60), 'verde': (70, 150), 'lila': (-90, -5)}
NOMBRES = {'azul': 'Azules', 'verde': 'Verdes', 'lila': 'Lilas de fantasía'}


def lab_a_rgb(lab):
    q = np.round(lab).astype(int); q[..., 0] = np.clip(q[..., 0], 0, 255); q[..., 1:] = np.clip(q[..., 1:], -128, 127) & 255
    t = ImageCms.buildTransform(ImageCms.createProfile('LAB'), ImageCms.createProfile('sRGB'), 'LAB', 'RGB')
    return np.array(ImageCms.applyTransform(Image.fromarray(q.astype(np.uint8), 'LAB'), t))


def medir_referencia():
    ref = Image.open(REF).convert('RGBA'); lab = MK.lab_de(ref); L = lab[..., 0]; C = np.hypot(lab[..., 1], lab[..., 2])
    hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1])); YY, XX = np.mgrid[0:L.shape[0], 0:L.shape[1]]
    out = {}
    for k, ps in REF_OJOS.items():
        m = np.zeros(L.shape, bool)
        for px, py in ps:
            r = np.hypot(XX - px, YY - py); m |= (r > 12) & (r < 42)
        lo, hi = FAMILIA[k]; s = m & (hue > lo) & (hue < hi) & (C > 10)
        out[k] = dict(tono=round(float(np.median(hue[s])), 1), croma=round(float(np.median(C[s])), 1), px=int(s.sum()))
    return out


def recolorear(e, tono, croma):
    lab = MK.lab_de(Image.fromarray(e)); L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b); h = np.degrees(np.arctan2(b, a))
    YY, XX = np.mgrid[0:e.shape[0], 0:e.shape[1]]
    r = np.min([np.hypot(XX - cx, YY - cy) for cx, cy in CENTROS], axis=0)
    zona = np.clip((RADIO + BORDE - r) / BORDE, 0, 1)
    marron = (h > 15) & (h < 80) & (C > 6)
    peso = zona * marron * np.clip((C - 6) / 6, 0, 1) * (e[..., 3] > 0)
    iris = (r <= RADIO) & marron & (e[..., 3] > 0)
    h0 = float(np.median(h[iris])); c0 = float(np.median(C[iris]))
    hn = np.radians(tono + 0.5 * (h - h0)); cn = C * (croma / c0)
    an, bn = cn * np.cos(hn), cn * np.sin(hn)
    nuevo = lab.copy(); nuevo[..., 1] = a * (1 - peso) + an * peso; nuevo[..., 2] = b * (1 - peso) + bn * peso
    rgb = lab_a_rgb(nuevo)
    out = e.copy(); m = peso > 0
    out[m, :3] = rgb[m]
    return out, peso, dict(tono_marron_medio=round(h0, 1), croma_marron_media=round(c0, 1))


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    antes = {str(ORIGEN.relative_to(RAIZ)): sha(ORIGEN), str(REF.relative_to(RAIZ)): sha(REF)}
    e = np.array(Image.open(ORIGEN).convert('RGBA'))
    tonos = medir_referencia(); info = {}; capas = {'marron': e}
    for k, t in tonos.items():
        o, peso, i = recolorear(e, t['tono'], t['croma'])
        Image.fromarray(o, 'RGBA').save(AQUI / f'capa-ojos-abiertos-{k}.png', optimize=True)
        cambiados = (o != e).any(-1)
        YY, XX = np.mgrid[0:e.shape[0], 0:e.shape[1]]
        r = np.min([np.hypot(XX - cx, YY - cy) for cx, cy in CENTROS], axis=0)
        lab0 = MK.lab_de(Image.fromarray(e)); lab1 = MK.lab_de(Image.fromarray(o))
        info[k] = dict(referencia=t, **i, px_cambiados=int(cambiados.sum()),
                       fuera_de_los_iris_igual=bool(not (cambiados & (r > RADIO + BORDE)).any()),
                       alfa_identico=bool((o[..., 3] == e[..., 3]).all()),
                       luminosidad_cambio_medio=round(float(np.abs(lab1[..., 0] - lab0[..., 0])[cambiados].mean()), 2) if cambiados.any() else 0)
        capas[k] = o
    # vistas: ojos sobre la muñeca (montaje del conjunto) y comparación con la referencia
    mont = np.array(Image.open(RAIZ / 'docs' / 'propuestas' / 'corona-2026-10-15' / 'montaje' / 'montaje-corona.png').convert('RGBA'))
    abiertos = np.array(Image.open(ORIGEN).convert('RGBA'))
    filas = []
    caja = (300, 380, 660, 515)
    for k in ('marron', 'azul', 'verde', 'lila'):
        x = mont.astype(float); c = capas[k].astype(float); a = c[..., 3:] / 255; a0 = abiertos[..., 3:] / 255
        # sustituye la capa de ojos del montaje por la variante (misma alfa: la mezcla es exacta)
        x[..., :3] = x[..., :3] - abiertos[..., :3] * a0 + c[..., :3] * a
        im = Image.fromarray(np.clip(np.round(x), 0, 255).astype(np.uint8), 'RGBA')
        bg = Image.new('RGBA', im.size, (255, 250, 245, 255)); bg.alpha_composite(im)
        filas.append((k, bg.convert('RGB').crop(caja).resize(((caja[2] - caja[0]) * 2, (caja[3] - caja[1]) * 2), Image.LANCZOS)))
    w, h = filas[0][1].size
    out = Image.new('RGB', (2 * (w + 10), 2 * (h + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (k, im) in enumerate(filas):
        x, y = (i % 2) * (w + 10), (i // 2) * (h + 30)
        out.paste(im, (x, y + 26)); d.text((x + 4, y + 4), {'marron': 'Marrones (original)', **NOMBRES}[k] + ' · ×2', font=MK.F(18), fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-colores.png', optimize=True)
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes, metodo='solo color de los iris en Lab; luminosidad y alfa intactos; tono y saturación medidos en la referencia', variantes=info)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
