#!/usr/bin/env python3
"""
Pijama (D-028) con los tonos de piel aprobados (D-023: dorado, moreno, profundo; el claro es el original), sin tocar las
prendas aprobadas (../capas/). Como con el conjunto de aventura (conjunto_aventura/integrar/pieles/conjunto_pieles.py,
del que se reutiliza la corrección de bordes), por tono, en esta carpeta:

1. bordes-ropa.png: el borde suave de la camiseta (cuello y puños), del pantalón (puños de los tobillos) y de las
   zapatillas junto a la piel lleva piel clara «pegada» (la imagen de ChatGPT tenía la piel clara): solo la parte de piel
   de cada píxel pasa a la piel nueva; el contorno de las prendas no cambia. Va encima de las prendas.
2. bordes-pelo-<color>.png, bordes-coleta-<con|sin>-<color>.png, bordes-coletas-<con|sin>-<color>.png: las capas de
   bordes aprobadas de cada tono sin lo que cae sobre el pijama (allí no hay piel) ni donde el pelo limpio para la ropa
   ya no está o se ha rellenado (pelo-sin-restos/conjunto/).
La base es la del tono aprobada (../../../base-aprobada-d013-2026-10-14/piel-tonos/<tono>/base-sin-ojos.png), sin cambios.

Uso (desde la raíz): python3 docs/propuestas/pijama-2026-10-22/integrar/pieles/pijama_pieles.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; I = AQUI.parent; P = I.parents[1]; B = P / 'base-aprobada-d013-2026-10-14'
sys.path.insert(0, str(P / 'conjunto-aventura-2026-10-18' / 'integrar' / 'pieles')); import conjunto_pieles as CP   # noqa: E402
PT = CP.PT; COLORES = CP.COLORES
ROPA = [I / 'capas' / 'zapatillas.png', I / 'capas' / 'pantalon.png', I / 'capas-b' / 'camiseta.png']   # camiseta con el borde limpio


if __name__ == '__main__':
    fuentes = ROPA + [B / 'piel-tonos' / t / 'base-sin-ojos.png' for t in PT.TONOS]
    antes = {str(p.relative_to(P.parents[1])): CP.sha(p) for p in fuentes}
    medidas, _ = PT.medir_lamina()
    base = PT.abrir(PT.SIN_OJOS); lab = PT.lab_de(base); wb, _ = PT.peso_base(base, lab)
    ropa = [PT.abrir(r) for r in ROPA]
    cubre = np.zeros(wb.shape, bool)
    for c in ropa:
        cubre |= c[..., 3] > 0
    # piel que se ve con el pijama (sin pelo): cuello y cara, manos y tobillos
    V = (base[..., 3] > 250) & ~cubre & ((wb == 1) | ~PT.MV.ropa_de_la_base(base))
    S, denS = PT.piel_de_alrededor(lab, V)
    encima = [np.zeros(wb.shape, bool) for _ in ropa]
    for i in range(len(ropa)):
        for c in ropa[i + 1:]:
            encima[i] |= c[..., 3] > 0
    bordes = [PT.separar_borde(c, V, S, denS, e, CP.CERCA, CP.INTERIOR) for c, e in zip(ropa, encima)]
    PC = B / 'pelo-sin-restos' / 'conjunto'; M = lambda n: np.array(Image.open(PC / n)) > 0
    quitado = lambda a, b: (PT.abrir(a)[..., 3] > 0) & (PT.abrir(b)[..., 3] == 0)
    PEL = P / 'peinado-coleta-2026-10-16' / 'capas' / 'variantes'; PELS = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas' / 'variantes'
    cambiado = {'melena': quitado(PT.SIN_PIEL['pelo-delante'], PC / 'pelo-delante-castano.png') | quitado(PT.SIN_PIEL['pelo-detras'], PC / 'pelo-detras-castano.png') | M('rendijas-melena.png')}
    for v in ('con', 'sin'):
        cambiado[f'coleta-{v}'] = quitado(PEL / f'pelo-coleta-{v}-detras-castano.png', PC / f'pelo-coleta-{v}-detras-castano.png') | M(f'rendijas-coleta-{v}.png')
        cambiado[f'coletas-{v}'] = quitado(PELS / f'pelo-coletas-{v}-sombrero-detras-castano.png', PC / f'pelo-coletas-{v}-sombrero-detras-castano.png') | M(f'rendijas-coletas-{v}.png')
    cambiado = {k: nd.binary_dilation(m, iterations=1) for k, m in cambiado.items()}
    ves = PT.abrir(PT.SIN_PIEL['vestido'])[..., 3] > 0
    sobre_ropa = cubre & ~ves
    info = dict(tonos={})
    for t in PT.TONOS:
        f, _ = PT.transformacion(medidas, t); D = AQUI / t; D.mkdir(exist_ok=True)
        bt = PT.abrir(B / 'piel-tonos' / t / 'base-sin-ojos.png'); fS = f(S)
        actual = PT.montar_rgba([bt, *ropa]); obj = PT.montar_rgba([bt, *[CP.corregir(c, *bordes[i], S, fS) for i, c in enumerate(ropa)]])
        sel = (np.abs(obj.astype(int) - actual.astype(int)).max(-1) > 0) & (actual[..., 3] >= 250)
        br = PT.CJ.capa_sobre(actual, obj[..., :3].astype(float), sel)
        Image.fromarray(br).save(D / 'bordes-ropa.png', optimize=True)
        it = dict(bordes_ropa_px=int((br[..., 3] > 0).sum()), pelo={})
        for k in COLORES:
            bp = PT.abrir(B / 'piel-tonos' / t / f'bordes-pelo-{k}.png'); quita = (bp[..., 3] > 0) & (sobre_ropa | cambiado['melena'])
            o = bp.copy(); o[quita] = 0; Image.fromarray(o).save(D / f'bordes-pelo-{k}.png', optimize=True)
            it['pelo'][f'melena-{k}'] = int(quita.sum())
        for carpeta, nombre, peinado in ((CP.COLETA, 'bordes-coleta', 'coleta'), (CP.COLETAS, 'bordes-coletas', 'coletas')):
            for v in ('con', 'sin'):
                for k in COLORES:
                    bp = PT.abrir(carpeta / t / f'{nombre}-{v}-{k}.png'); quita = (bp[..., 3] > 0) & (sobre_ropa | cambiado[f'{peinado}-{v}'])
                    o = bp.copy(); o[quita] = 0; Image.fromarray(o).save(D / f'{nombre}-{v}-{k}.png', optimize=True)
                    it['pelo'][f'{nombre}-{v}-{k}'] = int(quita.sum())
        info['tonos'][t] = it
    info['originales_sin_cambios'] = antes == {k: CP.sha(P.parents[1] / k) for k in antes}
    info['sha256_originales'] = antes
    (AQUI / 'comprobaciones.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')
    print({t: x['bordes_ropa_px'] for t, x in info['tonos'].items()}, info['originales_sin_cambios'])
