#!/usr/bin/env python3
"""
Revisión de la gorra aprobada (D-024) con los cinco colores de pelo (D-022) y los cuatro tonos de piel (D-023) sobre la
melena, con el mismo encaje (capa-gorra.png, que no cambia). Como revisar_b.py del gorrito: se montan las capas
aprobadas en el orden del visor y, en el borde semitransparente de la gorra, se buscan halos (píxeles más claros o más
oscuros que la gorra de dentro y que lo de fuera).

Salida (revision/): combinaciones-melena.png, detalle-bordes.png y comprobaciones.json.

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/gorra/revisar_gorra.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[3]; sys.path[:0] = [str(AQUI.parent / 'gorrito')]
import revisar_b as R   # noqa: E402  (montaje de la melena con cada piel y color)
PT, CP, MK = R.PT, R.CP, R.MK
SAL = AQUI / 'revision'
CAPA = Path(sys.argv[1]) if len(sys.argv) > 1 else AQUI / 'capa-gorra.png'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def revisar(capa_gorra, f):
    """Halos en el borde semitransparente de la gorra, para cada piel y color de pelo, y las vistas montadas."""
    G = capa_gorra[..., 3] >= 128; hay = capa_gorra[..., 3] > 0
    anillo = nd.binary_dilation(hay, iterations=7) & ~nd.binary_dilation(hay, iterations=3)
    borde = hay & (capa_gorra[..., 3] < 255); dentro = nd.binary_erosion(G, iterations=3)
    lab_rgb = lambda im: MK.lab_de(Image.fromarray(np.dstack([np.array(im), np.full((1659, 948), 255, np.uint8)]))).astype(float)
    info, vistas = {}, {}
    for t in R.PIELES:
        for k in R.COLORES:
            capas = R.capas_melena(t, k, f); al = PT.montar_rgba(capas)[..., 3] > 0
            im = R.montar(capas + [capa_gorra]); L = lab_rgb(im)[..., 0]; L0 = lab_rgb(R.montar(capas))[..., 0]
            Lg = nd.gaussian_filter(L * dentro, 4) / np.maximum(nd.gaussian_filter(dentro * 1.0, 4), 1e-6)
            Lf = nd.gaussian_filter(L0 * anillo, 4) / np.maximum(nd.gaussian_filter(anillo * 1.0, 4), 1e-6)
            m = borde & al; lo, hi = np.minimum(Lg, Lf), np.maximum(Lg, Lf)
            info[f'{t}-{k}'] = dict(halo_claro_px=int((m & (L > hi + 15)).sum()), halo_oscuro_px=int((m & (L < lo - 15)).sum()), borde_px=int(m.sum()),
                                    _claro=m & (L > hi + 15), _oscuro=m & (L < lo - 15))
            vistas[(t, k)] = im
    return info, vistas


if __name__ == '__main__':
    SAL.mkdir(exist_ok=True)
    capa = PT.abrir(CAPA); antes = {str(p.relative_to(RAIZ)): sha(p) for p in [CAPA, CP.DETRAS, CP.DELANTE, PT.SIN_OJOS]}
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
    info, vistas = revisar(capa, f)
    caja = (150, 0, 830, 600); esc = 0.38; w, h = round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)
    out = Image.new('RGB', (110 + 5 * (w + 6), 24 + 4 * (h + 6)), 'white'); d = ImageDraw.Draw(out)
    for i, k in enumerate(R.COLORES):
        d.text((110 + i * (w + 6) + 4, 4), CP.NOMBRES[k], font=MK.F(15), fill=(40, 40, 60))
    for j, t in enumerate(R.PIELES):
        d.text((4, 24 + j * (h + 6) + h // 2), PT.NOMBRES[t], font=MK.F(15), fill=(40, 40, 60))
        for i, k in enumerate(R.COLORES):
            out.paste(vistas[(t, k)].crop(caja).resize((w, h), Image.LANCZOS), (110 + i * (w + 6), 24 + j * (h + 6)))
    out.save(SAL / 'combinaciones-melena.png', optimize=True)
    ZONAS = [('Lado izquierdo y visera', (180, 230, 360, 420)), ('Visera sobre la frente', (340, 290, 620, 400)), ('Lado derecho y pestaña lila', (600, 230, 800, 420))]
    filas = [('claro', 'castano'), ('claro', 'miel'), ('dorado', 'jengibre'), ('moreno', 'oscuro'), ('profundo', 'miel'), ('profundo', 'chocolate')]
    H = max(z[3] - z[1] for _, z in ZONAS); W = 190 + sum((z[2] - z[0]) * 2 + 20 for _, z in ZONAS)
    out = Image.new('RGB', (W, 30 + len(filas) * (H + 8)), 'white'); d = ImageDraw.Draw(out); x = 190
    for nz, z in ZONAS:
        d.text((x, 6), nz + ' · fondo claro y oscuro', font=MK.F(14), fill=(40, 40, 60)); x += (z[2] - z[0]) * 2 + 20
    for j, (t, k) in enumerate(filas):
        y = 30 + j * (H + 8); d.text((4, y + H // 2 - 8), f'{PT.NOMBRES[t]} · {CP.NOMBRES[k]}', font=MK.F(13), fill=(40, 40, 60))
        ims = [vistas[(t, k)], R.montar(R.capas_melena(t, k, f) + [capa], (40, 40, 55))]; x = 190
        for _, z in ZONAS:
            for im in ims:
                out.paste(im.crop(z), (x, y)); x += z[2] - z[0]
            x += 20
    out.save(SAL / 'detalle-bordes.png', optimize=True)
    res = {k: {a: b for a, b in v.items() if not a.startswith('_')} for k, v in info.items()}
    comp = dict(capa=str(CAPA.relative_to(RAIZ)), melena=res, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (SAL / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(res, ensure_ascii=False))
