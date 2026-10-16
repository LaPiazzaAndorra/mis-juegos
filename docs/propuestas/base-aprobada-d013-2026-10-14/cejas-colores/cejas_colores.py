#!/usr/bin/env python3
"""
PROPUESTA de cejas que acompañan cada color de pelo (D-022): cambia SOLO el color de las cejas de nuestra base
(../sin-ojos/base-sin-ojos-propuesta-v3.png, que no se modifica), conservando su forma, su detalle y la expresión.

Cada propuesta es una capa transparente aparte que va encima de la base (y debajo de los ojos y del pelo de delante).
Solo tiene píxeles donde están las cejas: al ponerla encima, la cara queda exactamente igual salvo el color de las
cejas.

Cómo:
  · cejas: los dos trazos más oscuros que la piel por encima de los ojos (no se tocan los pliegues de los párpados);
  · cobertura de cada píxel (w): cuánto tiene de ceja y cuánto de piel, por su luminosidad respecto a la piel de
    alrededor. Se separa el color «puro» de la ceja, se le cambia el color y se vuelve a mezclar con la MISMA cobertura:
    la forma, los pelitos y el borde suave son los de la base;
  · color nuevo, por tono:
      - castaño chocolate y castaño oscuro: la misma transformación que su pelo (colores_pelo.py);
      - rubio miel: la del pelo, pero algo más oscura que el pelo (luminosidad × 0,70, saturación × 0,80);
      - pelirrojo jengibre: castaño cobrizo suave (la del pelo, más oscura y menos saturada: L × 0,80, saturación × 0,62,
        tono 4° hacia el marrón);
  · la capa guarda solo la diferencia, con la transparencia mínima que da exactamente ese resultado sobre la base.
El castaño original no lleva capa (son las cejas de la base).

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/cejas-colores/cejas_colores.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; BASE = AQUI.parent; RAIZ = BASE.parents[2]
sys.path[:0] = [str(BASE / 'ojos-abiertos'), str(BASE / 'pelo-colores')]
import mascara as MK      # noqa: E402
import colores_pelo as CP  # noqa: E402

SIN_OJOS = BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'
OJOS = [BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png', BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png']
ZONA = (slice(330, 402), slice(300, 660))       # franja de las cejas (encima de los ojos)
# ajustes sobre la transformación del pelo: (luminosidad, saturación, giro de tono en grados)
AJUSTE = {'chocolate': (1.0, 1.0, 0.0), 'oscuro': (1.0, 1.0, 0.0), 'miel': (0.70, 0.80, 0.0), 'jengibre': (0.80, 0.62, -4.0)}


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def cejas(base, lab):
    L = lab[..., 0]; piel = nd.median_filter(L, size=41)
    m = np.zeros(L.shape, bool); m[ZONA] = ((piel - L > 12) & (base[..., 3] > 250))[ZONA]
    et, n = nd.label(m); s = nd.sum(m, et, range(1, n + 1))
    m = np.isin(et, 1 + np.argsort(s)[::-1][:2])            # las dos cejas (las manchas más grandes)
    return m, piel


if __name__ == '__main__':
    fuentes = [SIN_OJOS, CP.DETRAS, CP.DELANTE, CP.REF] + OJOS
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    base = np.array(Image.open(SIN_OJOS).convert('RGBA')); lab = MK.lab_de(Image.fromarray(base)).astype(float)
    m, pielL = cejas(base, lab)
    zona = nd.binary_dilation(m, iterations=3)
    # piel de alrededor (sin las cejas), en Lab
    sin = lab.copy(); sin[zona] = np.nan
    piel = np.stack([nd.generic_filter(np.where(np.isnan(sin[..., i]), np.nan, sin[..., i])[310:420, 280:680], np.nanmedian, size=25) for i in range(3)], -1)
    pz = np.zeros_like(lab); pz[310:420, 280:680] = piel
    oscuro = np.percentile(lab[..., 0][m], 5)
    w = np.clip((pz[..., 0] - lab[..., 0]) / np.maximum(pz[..., 0] - oscuro, 1), 0, 1) * zona
    w = np.where(w > 0.04, w, 0)
    pura = (lab - (1 - w[..., None]) * pz) / np.maximum(w[..., None], 1e-6)   # color de la ceja sin la piel
    capas = [np.array(Image.open(p).convert('RGBA')) for p in (CP.DETRAS, CP.DELANTE)]
    ref = MK.lab_de(Image.open(CP.REF).convert('RGBA')).astype(float)
    info = {}; vistas = {'castano': None}
    hay = w > 0
    for k, caja in CP.RECUADROS.items():
        f, _, _ = CP.transformacion(capas, CP.muestra_referencia(ref, caja)[0])
        sL, sC, giro = AJUSTE[k]
        t = f(pura[hay][None])[0]
        C = np.hypot(t[:, 1], t[:, 2]) * sC; h = np.arctan2(t[:, 2], t[:, 1]) + np.radians(giro)
        t = np.stack([t[:, 0] * sL, C * np.cos(h), C * np.sin(h)], -1)
        nuevo_lab = lab.copy(); ww = w[hay][:, None]
        nuevo_lab[hay] = ww * t + (1 - ww) * pz[hay]
        nuevo = CP.lab_a_rgb(nuevo_lab).astype(float); orig = base[..., :3].astype(float)
        # capa con la transparencia mínima que, encima de la base, da exactamente «nuevo»
        d = nuevo - orig
        need = np.where(d > 0, d / np.maximum(255 - orig, 1e-6), np.where(d < 0, -d / np.maximum(orig, 1e-6), 0)).max(-1)
        A = np.clip(need, 0, 1) * hay
        A = np.where(A > 0, np.maximum(A, 1 / 255), 0)
        A8 = np.ceil(A * 255).astype(np.uint8); Af = A8 / 255
        col = np.where(Af[..., None] > 0, orig + d / np.maximum(Af[..., None], 1e-6), 0)
        capa = np.dstack([np.clip(np.round(col), 0, 255), A8]).astype(np.uint8)
        Image.fromarray(capa, 'RGBA').save(AQUI / f'cejas-{k}.png', optimize=True)
        enc = Image.fromarray(base); enc.alpha_composite(Image.fromarray(capa))
        res = np.array(enc).astype(int)
        nl = MK.lab_de(enc).astype(float)
        info[k] = dict(px_con_capa=int((A8 > 0).sum()),
                       diferencia_maxima_fuera_de_las_cejas=int(np.abs(res - base.astype(int))[~zona].max()),
                       error_maximo_frente_al_calculado=int(np.abs(res[..., :3] - nuevo.round())[hay].max()),
                       ceja_L_mediana=round(float(np.median(nl[..., 0][m])), 1), ceja_nucleo_L=round(float(np.median(nl[..., 0][w > 0.6])), 1), ceja_tono=round(float(np.median(np.degrees(np.arctan2(nl[..., 2][m], nl[..., 1][m])))), 1),
                       ceja_croma=round(float(np.median(np.hypot(nl[..., 1][m], nl[..., 2][m]))), 1),
                       detalle_correlacion=round(float(np.corrcoef((lab[..., 0] - nd.gaussian_filter(lab[..., 0], 3))[m], (nl[..., 0] - nd.gaussian_filter(nl[..., 0], 3))[m])[0, 1]), 3))
        vistas[k] = capa
    info['castano'] = dict(ceja_L_mediana=round(float(np.median(lab[..., 0][m])), 1), ceja_nucleo_L=round(float(np.median(lab[..., 0][w > 0.6])), 1), ceja_tono=round(float(np.median(np.degrees(np.arctan2(lab[..., 2][m], lab[..., 1][m])))), 1),
                           ceja_croma=round(float(np.median(np.hypot(lab[..., 1][m], lab[..., 2][m]))), 1))
    pelo_L = {k: CP.estadisticas([np.array(Image.open(CP.AQUI / f'pelo-{p}-{k}.png')) for p in ('detras', 'delante')])['L'][2] for k in CP.RECUADROS}
    pelo_L['castano'] = CP.estadisticas(capas)['L'][2]
    for k in info:
        info[k]['pelo_L_mediana'] = pelo_L[k]
    ojos = np.zeros(m.shape, bool)
    for p in OJOS:
        ojos |= np.array(Image.open(p))[..., 3] > 0
    comp = dict(metodo='solo color de las cejas de la base (cobertura conservada); capa aparte encima de la base',
                ajustes=AJUSTE, px_cejas=int(m.sum()), solape_con_capas_de_ojos_px=int((ojos & zona).sum()), tonos=info, sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # comparación: cabeza con cada pelo, con las cejas de la base y con la propuesta
    orden = ['castano', 'chocolate', 'miel', 'oscuro', 'jengibre']; caja = (250, 230, 710, 520); esc = 1.0
    filas = []
    for propuesta in (False, True):
        fila = []
        for k in orden:
            d, f = (capas if k == 'castano' else [np.array(Image.open(CP.AQUI / f'pelo-{p}-{k}.png')) for p in ('detras', 'delante')])
            im = CP.montaje(d, f).convert('RGBA')
            if propuesta and vistas[k] is not None:
                # la capa va encima de la base: se recompone el montaje con ella en su sitio
                x = Image.new('RGBA', (948, 1659), (0, 0, 0, 0))
                for c in CP.MONTAJE_CAPAS:
                    x.alpha_composite(Image.fromarray(d) if c == 'DETRAS' else Image.fromarray(f) if c == 'DELANTE' else Image.open(c).convert('RGBA'))
                    if c == SIN_OJOS:
                        x.alpha_composite(Image.fromarray(vistas[k]))
                im = Image.new('RGBA', x.size, (255, 250, 245, 255)); im.alpha_composite(x)
            fila.append(im.convert('RGB').crop(caja))
        filas.append(fila)
    w_, h_ = filas[0][0].size; out = Image.new('RGB', (len(orden) * (w_ + 8), 2 * (h_ + 30)), 'white'); dr = ImageDraw.Draw(out)
    for j, (titulo, fila) in enumerate(zip(('cejas de la base', 'propuesta'), filas)):
        for i, (k, t) in enumerate(zip(orden, fila)):
            out.paste(t, (i * (w_ + 8), j * (h_ + 30) + 28)); dr.text((i * (w_ + 8) + 4, j * (h_ + 30) + 5), CP.NOMBRES[k] + ' · ' + titulo, font=MK.F(16), fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-cejas.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
