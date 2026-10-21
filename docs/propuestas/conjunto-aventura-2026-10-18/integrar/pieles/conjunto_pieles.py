#!/usr/bin/env python3
"""
Conjunto de aventura (D-027) con los tonos de piel aprobados (D-023: dorado, moreno, profundo; el claro es el original),
sin tocar el conjunto aprobado, la mochila A ni las tiras: solo se añaden, por tono, en esta carpeta:

1. base-piernas-sin-mallas.png: la base del conjunto (rodillas B2c: piel completada bajo el pantalón) en el tono. Es la
   base de ese tono aprobada (../../../base-aprobada-d013-2026-10-14/piel-tonos/<tono>/base-sin-ojos.png) y, SOLO donde la
   base B2c difiere de la base original (las rodillas, 27 736 px), la misma transformación aprobada (piel_tonos) aplicada
   a la base B2c. Así las rodillas no conservan restos del tono claro.
2. bordes-ropa.png y bordes-tiras.png: la ropa (calcetines, botas, camiseta, pantalón y chaleco) y las tiras se
   separaron de una imagen con piel clara, así que su borde suave junto a la piel lleva piel clara «pegada» (filos de las
   mangas sobre los brazos, bajo del pantalón sobre las rodillas, puño de los calcetines…; las tiras, además, unos
   píxeles de piel junto al cuello y al brazo). Como en piel_tonos (cuello del vestido), en el borde de cada prenda junto a
   la piel que se ve se mide qué parte de cada píxel es piel (s: entre el color de la prenda de justo dentro y la piel de
   alrededor) y SOLO esa parte pasa a la piel nueva (color + s·(piel nueva − piel clara)): el contorno de la prenda no
   cambia. Estas capas pequeñas van encima de la ropa (la de las tiras, encima de las tiras) y ponen solo esos píxeles;
   las prendas no cambian.
3. bordes-pelo-<color>.png (melena), bordes-coleta-<con|sin>-<color>.png y bordes-coletas-<con|sin>-<color>.png: las
   capas de bordes aprobadas de cada tono (hechas con el vestido) sin los píxeles que ahora caen sobre la ropa del
   conjunto (allí no hay piel) ni donde el pelo limpiado para el conjunto ya no está o se ha rellenado (trocitos y huecos
   quitados, rendijas; +1 px): ahí manda el pelo limpio (../../../base-aprobada-d013-2026-10-14/pelo-sin-restos/conjunto/).

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/pieles/conjunto_pieles.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; I = AQUI.parent; CJ = I.parent; P = CJ.parent; B = P / 'base-aprobada-d013-2026-10-14'
sys.path.insert(0, str(B / 'piel-tonos')); import piel_tonos as PT   # noqa: E402
COLORES = ('castano', 'chocolate', 'miel', 'oscuro', 'jengibre')
B2C = I / 'piernas-b2c' / 'base-piernas-sin-mallas.png'
ROPA = [I / 'ropa-d' / 'calcetines.png', I / 'ropa-d' / 'botas.png', I / 'ropa-c' / 'camiseta.png', I / 'ropa-d' / 'pantalon.png', I / 'ropa-d' / 'chaleco.png']
TIRAS = I / 'mochila-b' / 'tiras.png'
RESTOS_MELENA = B / 'pelo-sin-restos' / 'restos-quitados.png'
COLETA = P / 'peinado-coleta-2026-10-16' / 'capas' / 'pieles'; COLETAS = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas' / 'pieles'
CERCA, INTERIOR = 5.0, (4, 7)          # como el cuello del vestido en piel_tonos


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def corregir(capa, s, tau, dentro, S, fS):
    """Solo la parte de piel de cada píxel pasa a la piel nueva: color + s·(piel nueva − piel clara). La parte de prenda
    (también su contorno oscuro) no cambia; un píxel que es todo piel (s = 1) queda con la piel nueva. Alfa sin cambios."""
    # junto a la piel (2 px), además, por distancias: un borde de un color parecido al de la piel clara (el arena del
    # chaleco, el crema del cuello) da una proyección poco fiable; ahí, s = dH / (dH + dS) (dH: al color de la prenda de
    # justo dentro; dS: a la piel clara de alrededor)
    O = PT.lab_de(capa); Hc = PT.pelo_de_alrededor(capa, dentro, 4)
    dH = np.sqrt(((O - Hc) ** 2).sum(-1)); dS = np.sqrt(((O - S) ** 2).sum(-1))
    s = np.where(tau >= 0.6, np.maximum(s, dH / np.maximum(dH + dS, 1e-6)), s)
    w = (s * tau)[..., None]
    nueva = capa.copy(); sl = (s * tau) > 0.02
    nueva[sl, :3] = PT.a_rgb(O + w * (fS - S))[sl]
    return nueva


if __name__ == '__main__':
    fuentes = [B2C, *ROPA, TIRAS] + [B / 'piel-tonos' / t / f'bordes-pelo-{k}.png' for t in PT.TONOS for k in COLORES]
    antes = {str(p.relative_to(P.parents[1])): sha(p) for p in fuentes}
    medidas, _ = PT.medir_lamina()
    orig = PT.abrir(PT.SIN_OJOS); b2c = PT.abrir(B2C); lab = PT.lab_de(b2c)
    cambia = (orig != b2c).any(-1)                                   # las rodillas (y la abertura, transparente)
    wb, _ = PT.peso_base(b2c, lab)
    ropa = [PT.abrir(r) for r in ROPA]; tiras = PT.abrir(TIRAS)
    cubre = np.zeros(wb.shape, bool)
    for c in ropa:
        cubre |= c[..., 3] > 0
    V = (wb == 1) & (b2c[..., 3] > 250) & ~cubre                      # piel que se ve con el conjunto (sin pelo)
    S, denS = PT.piel_de_alrededor(lab, V)
    # bordes de cada prenda: solo donde no la tapa una prenda de encima
    encima = [np.zeros(wb.shape, bool) for _ in ropa]
    for i in range(len(ropa)):
        for c in ropa[i + 1:]:
            encima[i] |= c[..., 3] > 0
    bordes = [PT.separar_borde(c, V, S, denS, e, CERCA, INTERIOR) for c, e in zip(ropa, encima)]
    Vt = V & (tiras[..., 3] == 0)
    St, denSt = PT.piel_de_alrededor(lab, Vt)
    borde_tiras = PT.separar_borde(tiras, Vt, St, denSt, np.zeros(wb.shape, bool), CERCA, INTERIOR)
    ves = PT.abrir(PT.SIN_PIEL['vestido'])[..., 3] > 0
    restos = np.array(Image.open(RESTOS_MELENA)) > 0
    # pelo limpiado para el conjunto (../../../base-aprobada-d013-2026-10-14/pelo-sin-restos/conjunto/): donde el pelo ya no
    # está (trocitos y huecos quitados, que ahora son transparentes) o se ha rellenado (rendijas), los bordes aprobados ya
    # no valen; donde solo cambió de color (canto rosa → pelo), sí (su corrección ya tapaba ese rosa con piel nueva)
    PSR = B / 'pelo-sin-restos'; PC = PSR / 'conjunto'; M = lambda n: np.array(Image.open(PC / n)) > 0
    quitado = lambda a, b: (PT.abrir(a)[..., 3] > 0) & (PT.abrir(b)[..., 3] == 0)
    PEL = P / 'peinado-coleta-2026-10-16' / 'capas' / 'variantes'; PELS = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas' / 'variantes'
    cambiado = {'melena': quitado(PT.SIN_PIEL['pelo-delante'], PC / 'pelo-delante-castano.png') | quitado(PT.SIN_PIEL['pelo-detras'], PC / 'pelo-detras-castano.png') | M('rendijas-melena.png')}
    for v in ('con', 'sin'):
        cambiado[f'coleta-{v}'] = quitado(PEL / f'pelo-coleta-{v}-detras-castano.png', PC / f'pelo-coleta-{v}-detras-castano.png') | M(f'rendijas-coleta-{v}.png')
        cambiado[f'coletas-{v}'] = quitado(PELS / f'pelo-coletas-{v}-sombrero-detras-castano.png', PC / f'pelo-coletas-{v}-sombrero-detras-castano.png') | M(f'rendijas-coletas-{v}.png')
    cambiado = {k: nd.binary_dilation(m, iterations=1) for k, m in cambiado.items()}
    info = dict(rodillas_px=int(cambia.sum()), tonos={})
    for t in PT.TONOS:
        f, _ = PT.transformacion(medidas, t); D = AQUI / t; D.mkdir(exist_ok=True)
        base_t = PT.abrir(B / 'piel-tonos' / t / 'base-sin-ojos.png')
        nueva = PT.aplicar(b2c, lab, wb, f)                          # la transformación aprobada, en la base B2c
        bt = base_t.copy(); bt[cambia] = nueva[cambia]
        Image.fromarray(bt).save(D / 'base-piernas-sin-mallas.png', optimize=True)
        fS = f(S)
        actual = PT.montar_rgba([bt, *ropa]); corr = [corregir(c, *bordes[i], S, fS) for i, c in enumerate(ropa)]
        obj = PT.montar_rgba([bt, *corr])
        sel = (np.abs(obj.astype(int) - actual.astype(int)).max(-1) > 0) & (actual[..., 3] >= 250)
        br = PT.CJ.capa_sobre(actual, obj[..., :3].astype(float), sel)
        Image.fromarray(br).save(D / 'bordes-ropa.png', optimize=True)
        act2 = PT.montar_rgba([actual, tiras]); obj2 = PT.montar_rgba([actual, corregir(tiras, *borde_tiras, St, f(St))])
        sel2 = (np.abs(obj2.astype(int) - act2.astype(int)).max(-1) > 0) & (act2[..., 3] >= 250)
        bt2 = PT.CJ.capa_sobre(act2, obj2[..., :3].astype(float), sel2)
        Image.fromarray(bt2).save(D / 'bordes-tiras.png', optimize=True)
        it = dict(base_rodillas_px=int(cambia.sum()), bordes_ropa_px=int((br[..., 3] > 0).sum()), bordes_tiras_px=int((bt2[..., 3] > 0).sum()),
                  base_igual_a_la_aprobada_fuera_de_las_rodillas=bool((bt[~cambia] == base_t[~cambia]).all()), pelo={})
        sobre_ropa = (cubre | (tiras[..., 3] > 0)) & ~ves
        for k in COLORES:
            bp = PT.abrir(B / 'piel-tonos' / t / f'bordes-pelo-{k}.png'); quita = (bp[..., 3] > 0) & (sobre_ropa | cambiado['melena'])
            o = bp.copy(); o[quita] = 0
            Image.fromarray(o).save(D / f'bordes-pelo-{k}.png', optimize=True)
            it['pelo'][k] = dict(px=int((bp[..., 3] > 0).sum()), quitados_px=int(quita.sum()))
        # coleta y dos coletas: copias de sus bordes aprobados sin lo que cae sobre la ropa ni sobre el pelo limpiado
        it['coletas'] = {}
        for carpeta, nombre, peinado in ((COLETA, 'bordes-coleta', 'coleta'), (COLETAS, 'bordes-coletas', 'coletas')):
            for v in ('con', 'sin'):
                for k in COLORES:
                    bp = PT.abrir(carpeta / t / f'{nombre}-{v}-{k}.png'); quita = (bp[..., 3] > 0) & (sobre_ropa | cambiado[f'{peinado}-{v}'])
                    o = bp.copy(); o[quita] = 0
                    Image.fromarray(o).save(D / f'{nombre}-{v}-{k}.png', optimize=True)
                    it['coletas'][f'{nombre}-{v}-{k}'] = dict(px=int((bp[..., 3] > 0).sum()), quitados_px=int(quita.sum()))
        info['tonos'][t] = it
    info['originales_sin_cambios'] = antes == {k: sha(P.parents[1] / k) for k in antes}
    info['sha256_originales'] = antes
    (AQUI / 'comprobaciones.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({t: {k: v for k, v in x.items() if k != 'coletas'} | {'coletas_quitados_max': max(y['quitados_px'] for y in x['coletas'].values())}
                      for t, x in info['tonos'].items()}, ensure_ascii=False), info['originales_sin_cambios'])
