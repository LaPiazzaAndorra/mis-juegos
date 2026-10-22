#!/usr/bin/env python3
"""
Hada (D-029) con los tonos de piel aprobados (D-023: dorado, moreno, profundo; el claro es el original), sin tocar las
piezas aprobadas (../capas/, ../agarre/). Como con el pijama (pijama_pieles.py), con la transformación aprobada de
piel_tonos, por tono, en esta carpeta:

1. base-hada.png: la base del tono aprobada y, SOLO donde ../base-hada.png difiere de la base original (los brazos
   completados bajo las mangas de farol), la misma transformación aplicada a ../base-hada.png.
   base-hada-agarre.png: la misma sin nuestra mano abierta por debajo de la muñeca (como ../agarre/base-hada-agarre.png).
2. brazos-agarre.png: las manos de delante del tono aprobadas (piel-tonos/<tono>/manos-delante.png) sin esa mano.
   Sin la varita se usan las manos del tono aprobadas tal cual: vuelve la mano original.
3. mano-agarre.png: la mano de agarre aprobada (../agarre/) con la misma transformación (alfa sin cambios).
   dedos.png: la mano original por delante del palo («varita con la mano original»), con los píxeles de la base del tono.
4. bordes-ropa.png: el borde del vestido y de las bailarinas junto a la piel con la piel clara pegada pasa a la piel
   nueva (conjunto_pieles.corregir); y la piel de la imagen que quedó dentro de las prendas (el empeine en las bailarinas,
   el cuello junto al escote), por color y cercanía a la piel que se ve, con la misma transformación. bordes-pelo-*, bordes-coleta-*, bordes-coletas-*: los bordes del pelo aprobados del
   tono sin lo que cae sobre el vestido ni donde el pelo limpio para la ropa ya no está o se ha rellenado.

Uso (desde la raíz): python3 docs/propuestas/hada-2026-10-22/integrar/pieles/hada_pieles.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; I = AQUI.parent; P = I.parents[1]; B = P / 'base-aprobada-d013-2026-10-14'
sys.path.insert(0, str(P / 'conjunto-aventura-2026-10-18' / 'integrar' / 'pieles')); import conjunto_pieles as CP   # noqa: E402
PT = CP.PT; COLORES = CP.COLORES
ROPA = [I / 'capas' / 'bailarinas.png', I / 'capas' / 'vestido.png']
CORTE = 978


if __name__ == '__main__':
    fuentes = ROPA + [I / 'base-hada.png', I / 'agarre' / 'mano-agarre.png', I / 'capas' / 'dedos.png'] + [B / 'piel-tonos' / t / 'base-sin-ojos.png' for t in PT.TONOS]
    antes = {str(p.relative_to(P.parents[1])): CP.sha(p) for p in fuentes}
    medidas, _ = PT.medir_lamina()
    orig = PT.abrir(PT.SIN_OJOS); bh = PT.abrir(I / 'base-hada.png'); lab = PT.lab_de(bh)
    cambia = (orig != bh).any(-1); wb, _ = PT.peso_base(bh, lab)
    H, W = bh.shape[:2]; YY, XX = np.mgrid[:H, :W]
    mano_nuestra = (bh[..., 3] > 128) & (YY >= CORTE) & (XX < 330) & (YY < 1140)
    ropa = [PT.abrir(r) for r in ROPA]
    cubre = np.zeros(wb.shape, bool)
    for c in ropa:
        cubre |= c[..., 3] > 0
    V = (bh[..., 3] > 250) & ~cubre & ((wb == 1) | ~PT.MV.ropa_de_la_base(bh))
    S, denS = PT.piel_de_alrededor(lab, V)
    encima = [np.zeros(wb.shape, bool), ropa[1][..., 3] > 0]
    bordes = [PT.separar_borde(c, V, S, denS, e, CP.CERCA, CP.INTERIOR) for c, e in zip(ropa, encima)]
    mano = PT.abrir(I / 'agarre' / 'mano-agarre.png'); dedos = PT.abrir(I / 'capas' / 'dedos.png')
    # pelo: como en el pijama
    PC = B / 'pelo-sin-restos' / 'conjunto'; M = lambda n: np.array(Image.open(PC / n)) > 0
    quitado = lambda a, b: (PT.abrir(a)[..., 3] > 0) & (PT.abrir(b)[..., 3] == 0)
    PEL = P / 'peinado-coleta-2026-10-16' / 'capas' / 'variantes'; PELS = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas' / 'variantes'
    cambiado = {'melena': quitado(PT.SIN_PIEL['pelo-delante'], PC / 'pelo-delante-castano.png') | quitado(PT.SIN_PIEL['pelo-detras'], PC / 'pelo-detras-castano.png') | M('rendijas-melena.png')}
    for v in ('con', 'sin'):
        cambiado[f'coleta-{v}'] = quitado(PEL / f'pelo-coleta-{v}-detras-castano.png', PC / f'pelo-coleta-{v}-detras-castano.png') | M(f'rendijas-coleta-{v}.png')
        cambiado[f'coletas-{v}'] = quitado(PELS / f'pelo-coletas-{v}-sombrero-detras-castano.png', PC / f'pelo-coletas-{v}-sombrero-detras-castano.png') | M(f'rendijas-coletas-{v}.png')
    cambiado = {k: nd.binary_dilation(m, iterations=1) for k, m in cambiado.items()}
    sobre_ropa = cubre & ~(PT.abrir(PT.SIN_PIEL['vestido'])[..., 3] > 0)
    info = dict(brazos_completados_px=int(cambia.sum()), mano_original_quitada_px=int(mano_nuestra.sum()), tonos={})
    for t in PT.TONOS:
        f, _ = PT.transformacion(medidas, t); D = AQUI / t; D.mkdir(exist_ok=True); it_piel = 0
        base_t = PT.abrir(B / 'piel-tonos' / t / 'base-sin-ojos.png')
        nueva = PT.aplicar(bh, lab, wb, f); bt = base_t.copy(); bt[cambia] = nueva[cambia]
        Image.fromarray(bt).save(D / 'base-hada.png', optimize=True)
        b2 = bt.copy(); b2[mano_nuestra] = 0; Image.fromarray(b2).save(D / 'base-hada-agarre.png', optimize=True)
        br = PT.abrir(B / 'piel-tonos' / t / 'manos-delante.png'); br[mano_nuestra] = 0
        Image.fromarray(br).save(D / 'brazos-agarre.png', optimize=True)
        mt = PT.aplicar(mano, PT.lab_de(mano), (mano[..., 3] > 0).astype(float), f)
        Image.fromarray(mt).save(D / 'mano-agarre.png', optimize=True)
        dt = dedos.copy(); sel = dedos[..., 3] > 0; dt[sel, :3] = bt[sel, :3]; Image.fromarray(dt).save(D / 'dedos.png', optimize=True)
        fS = f(S); corr = [CP.corregir(c, *bordes[i], S, fS) for i, c in enumerate(ropa)]
        # además: piel de la imagen de ChatGPT que quedó DENTRO de las prendas (el empeine en las bailarinas, el cuello en
        # el escote, de unos px): píxeles de color piel clara cerca de la piel que se ve → la misma transformación
        for i, c in enumerate(ropa):
            lc = PT.lab_de(c); h = np.degrees(np.arctan2(lc[..., 2], lc[..., 1])); C = np.hypot(lc[..., 1], lc[..., 2])
            # (en las bailarinas, la piel del empeine está más en sombra y más saturada que la de alrededor: umbral mayor, y
            # tono < 62° para no tocar el ribete dorado, de ≈ 70°)
            umbral, hmax = (45, 62) if i == 0 else (22, 72)
            pielp = (c[..., 3] > 0) & (np.sqrt(((lc - S) ** 2).sum(-1)) < umbral) & (h > 40) & (h < hmax) & (C > 18) & (denS > 0.02) & (nd.distance_transform_edt(~V) < 30)
            pielp = nd.binary_opening(pielp, iterations=1) | (pielp & nd.binary_dilation(V, iterations=3))
            if pielp.any():
                corr[i] = corr[i].copy(); corr[i][pielp, :3] = PT.a_rgb(f(lc))[pielp]
            it_piel += int(pielp.sum())
        actual = PT.montar_rgba([bt, *ropa]); obj = PT.montar_rgba([bt, *corr])
        sel = (np.abs(obj.astype(int) - actual.astype(int)).max(-1) > 0) & (actual[..., 3] >= 250)
        bro = PT.CJ.capa_sobre(actual, obj[..., :3].astype(float), sel); Image.fromarray(bro).save(D / 'bordes-ropa.png', optimize=True)
        it = dict(bordes_ropa_px=int((bro[..., 3] > 0).sum()), piel_dentro_de_las_prendas_px=it_piel, base_igual_a_la_aprobada_fuera_de_los_brazos=bool((bt[~cambia] == base_t[~cambia]).all()))
        for k in COLORES:
            bp = PT.abrir(B / 'piel-tonos' / t / f'bordes-pelo-{k}.png'); q = (bp[..., 3] > 0) & (sobre_ropa | cambiado['melena'])
            o = bp.copy(); o[q] = 0; Image.fromarray(o).save(D / f'bordes-pelo-{k}.png', optimize=True)
        for carpeta, nombre, peinado in ((CP.COLETA, 'bordes-coleta', 'coleta'), (CP.COLETAS, 'bordes-coletas', 'coletas')):
            for v in ('con', 'sin'):
                for k in COLORES:
                    bp = PT.abrir(carpeta / t / f'{nombre}-{v}-{k}.png'); q = (bp[..., 3] > 0) & (sobre_ropa | cambiado[f'{peinado}-{v}'])
                    o = bp.copy(); o[q] = 0; Image.fromarray(o).save(D / f'{nombre}-{v}-{k}.png', optimize=True)
        info['tonos'][t] = it
    info['originales_sin_cambios'] = antes == {k: CP.sha(P.parents[1] / k) for k in antes}
    info['sha256_originales'] = antes
    (AQUI / 'comprobaciones.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')
    print({t: x for t, x in info['tonos'].items()}, info['originales_sin_cambios'])
