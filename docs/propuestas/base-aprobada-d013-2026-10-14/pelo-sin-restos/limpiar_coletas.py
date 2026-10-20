#!/usr/bin/env python3
"""
Limpieza de restos en el pelo de DETRÁS de la coleta y de las dos coletas (vistos con el conjunto de aventura, D-027,
20/10/2026) · reutilizable con cualquier otro conjunto, como limpiar_restos.py para la melena.

Con el vestido rosa no se ven (los tapan sus mangas, más anchas); con ropa de mangas más estrechas, sí:
1. Coleta (con y sin cinta): dos trocitos SUELTOS que no son pelo, del color de la piel y del vestido de la imagen de la
   que salió: uno junto al cuello, a la izquierda (≈ 89 px, x 403–413, y 629–644, el que se ve) y otro detrás del cuello
   (≈ 229 px, tapado por la base). Se quitan: componentes conexos de menos de 3 000 px con el centro por debajo de
   y = 600 (los demás trocitos pequeños son puntas de rizos junto a las orejas, más arriba, y se conservan).
2. Dos coletas (con y sin sombrero): restos ROSAS del vestido entre los rizos, junto a los hombros y los brazos. Se
   reconocen por el color (en Lab, a > 1,05·b, croma > 10 y L > 60; o, los claros, a > 0,9·b, croma > 12 y L > 130: el
   pelo castaño tiene a ≈ 0,5–0,75·b) en la zona de
   los lados del cuerpo (x < 380 o x > 570, y 600–900). En cada píxel:
   - si toca pelo de verdad (a 2 px o menos), se queda con su alfa y toma el color del pelo más cercano (el canto de los
     rizos no se recorta);
   - si no, y el hueco da al fondo, es un hueco entre rizos por el que se veía el vestido: pasa a transparente (detrás
     está el fondo); si el hueco está cerrado por el pelo, toma también el color del pelo más cercano (sin agujeros).
Las máscaras son las mismas para los cinco colores de pelo (mismo alfa; comprobado); el color de relleno sale de cada
color. Los originales no cambian; se escriben copias en esta carpeta:
  pelo-coleta-<con|sin>-detras-<color>-sin-restos.png
  pelo-coletas-<con|sin>-sombrero-detras-<color>-sin-restos.png
y las máscaras restos-coleta.png y restos-coletas-<con|sin>.png. El pelo de DELANTE de los dos peinados no lleva restos
(comprobado: 0 px rosas por debajo de los hombros). El montaje anterior de las dos coletas (referencia) no se toca.

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-sin-restos/limpiar_coletas.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; B = AQUI.parent; P = B.parent; RAIZ = B.parents[2]
sys.path.insert(0, str(P / 'conjunto-aventura-2026-10-18' / 'integrar')); import retocar_bordes as RB   # noqa: E402
PT = RB.PT
COLORES = ('castano', 'chocolate', 'miel', 'oscuro', 'jengibre')
COLETA = P / 'peinado-coleta-2026-10-16' / 'capas' / 'variantes'
COLETAS = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas' / 'variantes'
SUELTO_MAX, SUELTO_Y = 3000, 600
ZONA_ROSA = dict(x_izq=380, x_der=570, y0=600, y1=900)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def sueltos(alfa):
    """Trocitos sueltos (no pelo) por debajo de la barbilla."""
    al = alfa > 0
    et, n = nd.label(al, structure=np.ones((3, 3))); tam = nd.sum(al, et, range(1, n + 1)); cm = nd.center_of_mass(al, et, range(1, n + 1))
    return np.isin(et, [i + 1 for i in range(n) if tam[i] < SUELTO_MAX and cm[i][0] > SUELTO_Y])


def rosa(capa):
    L = PT.lab_de(capa).astype(float); C = np.hypot(L[..., 1], L[..., 2])
    YY, XX = np.mgrid[:capa.shape[0], :capa.shape[1]]; z = ZONA_ROSA
    zona = ((XX < z['x_izq']) | (XX > z['x_der'])) & (YY > z['y0']) & (YY < z['y1'])
    rosado = (L[..., 1] > 1.05 * L[..., 2]) & (C > 10) & (L[..., 0] > 60)      # rosa y rosa oscuro
    salmon = (L[..., 1] > 0.9 * L[..., 2]) & (C > 12) & (L[..., 0] > 130)       # rosa claro, más anaranjado
    return (capa[..., 3] > 0) & (rosado | salmon) & zona


def limpiar_rosa(capa, m):
    """m: máscara del rosa. Canto junto al pelo → color del pelo más cercano (mismo alfa); el resto → transparente."""
    pelo = (capa[..., 3] > 128) & ~m
    d, (iy, ix) = nd.distance_transform_edt(~pelo, return_indices=True)
    canto = m & (d <= 2); hueco = m & ~canto
    # un hueco cerrado por el pelo (sin salida al fondo) se rellena también con el pelo de al lado: si no, quedaría un
    # agujero blanco entre los rizos
    et, n = nd.label(hueco); fondo = nd.binary_dilation(capa[..., 3] == 0, iterations=1)
    abiertos = [i for i in range(1, n + 1) if (fondo & (et == i)).any()]
    hueco = np.isin(et, abiertos); canto = m & ~hueco
    c = capa.copy(); c[canto, :3] = capa[iy[canto], ix[canto], :3]; c[hueco] = 0
    return c, canto, hueco


if __name__ == '__main__':
    fuentes = [COLETA / f'pelo-coleta-{v}-detras-{c}.png' for v in ('con', 'sin') for c in COLORES] + \
              [COLETAS / f'pelo-coletas-{v}-sombrero-detras-{c}.png' for v in ('con', 'sin') for c in COLORES]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    comp = dict(coleta={}, coletas={})
    # 1. coleta
    ref = PT.abrir(COLETA / 'pelo-coleta-con-detras-castano.png'); m1 = sueltos(ref[..., 3])
    Image.fromarray(np.where(m1, 255, 0).astype(np.uint8)).save(AQUI / 'restos-coleta.png', optimize=True)
    et, n = nd.label(m1, structure=np.ones((3, 3)))
    comp['coleta']['trozos'] = [dict(px=int((et == i).sum()), caja=[int(x) for x in (np.where(et == i)[1].min(), np.where(et == i)[0].min(), np.where(et == i)[1].max(), np.where(et == i)[0].max())]) for i in range(1, n + 1)]
    for v in ('con', 'sin'):
        for c in COLORES:
            a = PT.abrir(COLETA / f'pelo-coleta-{v}-detras-{c}.png')
            assert (sueltos(a[..., 3]) == m1).all(), (v, c)
            o = a.copy(); o[m1] = 0
            Image.fromarray(o, 'RGBA').save(AQUI / f'pelo-coleta-{v}-detras-{c}-sin-restos.png', optimize=True)
            comp['coleta'][f'{v}-{c}'] = dict(px=int(m1.sum()), fuera_igual=bool((o[~m1] == a[~m1]).all()))
    # 2. dos coletas
    for v in ('con', 'sin'):
        ref = PT.abrir(COLETAS / f'pelo-coletas-{v}-sombrero-detras-castano.png'); m2 = rosa(ref)
        Image.fromarray(np.where(m2, 255, 0).astype(np.uint8)).save(AQUI / f'restos-coletas-{v}.png', optimize=True)
        for c in COLORES:
            a = PT.abrir(COLETAS / f'pelo-coletas-{v}-sombrero-detras-{c}.png')
            assert (a[..., 3] == ref[..., 3]).all(), (v, c)
            o, canto, hueco = limpiar_rosa(a, m2)
            Image.fromarray(o, 'RGBA').save(AQUI / f'pelo-coletas-{v}-sombrero-detras-{c}-sin-restos.png', optimize=True)
            comp['coletas'][f'{v}-{c}'] = dict(px=int(m2.sum()), canto_recoloreado=int(canto.sum()), hueco_transparente=int(hueco.sum()),
                                               fuera_igual=bool((o[~m2] == a[~m2]).all()))
    comp['zona_rosa'] = ZONA_ROSA
    comp['originales_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    comp['sha256_originales'] = antes
    (AQUI / 'comprobaciones-coletas.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_originales'}, ensure_ascii=False))
