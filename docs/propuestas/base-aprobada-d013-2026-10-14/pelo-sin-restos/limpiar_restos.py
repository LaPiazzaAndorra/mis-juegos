#!/usr/bin/env python3
"""
Limpieza de los restos del bordado del vestido en el pelo de delante de la melena (encontrada con el conjunto de
aventura, D-027) · reutilizable con cualquier otro conjunto.

El pelo de delante aprobado de la melena («mechones completos») lleva 9 trocitos sueltos (1 318 px) sobre el pecho
(x 410–575, y 660–790): restos del bordado del vestido de la imagen de la que salió. Con el vestido rosa no se ven
(quedan encima de su bordado); con otra ropa, sí. Los cinco colores de pelo (D-022) tienen el mismo alfa, así que
llevan los mismos trocitos.

Qué se quita: SOLO los trozos separados del pelo (componentes conexos de menos de 2 000 px; el pelo son tres trozos de
más de 40 000) con el centro dentro de la zona del pecho RESTOS_CAJA. La máscara es la misma para los cinco colores:
`restos-quitados.png`. Los originales no cambian; se escriben copias:
  pelo-delante-<color>-sin-restos.png  (castano = el original aprobado; los otros, de ../pelo-colores/)

Las capas de bordes de cada tono de piel (../piel-tonos/<tono>/bordes-pelo-*.png) no tocan estos trocitos (comprobado):
siguen valiendo.

Uso desde otro script:  import limpiar_restos as LR;  capa_limpia, info = LR.sin_restos(capa_rgba)
Uso (desde la raíz):     python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-sin-restos/limpiar_restos.py
"""
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; B = AQUI.parent; RAIZ = B.parents[2]
ORIGINAL = B / 'pelo-borrador-d012' / 'revision-localizada' / 'variante-experimental' / 'redistribucion-hombros' / 'mechones-completos-chatgpt' / 'pelo-delante-mechones-completos.png'
COLORES = {'castano': ORIGINAL, **{c: B / 'pelo-colores' / f'pelo-delante-{c}.png' for c in ('chocolate', 'miel', 'oscuro', 'jengibre')}}
RESTOS_CAJA = (380, 620, 640, 1000)        # x0, y0, x1, y1: zona del pecho donde se buscan los trocitos sueltos
TAM_MAX = 2000                            # px: un trozo más grande es pelo de verdad


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def mascara_restos(alfa):
    al = alfa > 0
    et, n = nd.label(al, structure=np.ones((3, 3))); tam = nd.sum(al, et, range(1, n + 1)); cm = nd.center_of_mass(al, et, range(1, n + 1))
    x0, y0, x1, y1 = RESTOS_CAJA
    quita = [i + 1 for i in range(n) if tam[i] < TAM_MAX and y0 < cm[i][0] < y1 and x0 < cm[i][1] < x1]
    return np.isin(et, quita), len(quita)


def sin_restos(capa):
    """Copia de la capa RGBA sin los trocitos sueltos del pecho, y cuántos se han quitado."""
    m, n = mascara_restos(capa[..., 3]); c = capa.copy(); c[m] = 0
    return c, dict(trozos=n, px=int(m.sum()))


if __name__ == '__main__':
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in COLORES.values()}
    info, mascaras = {}, []
    for k, p in COLORES.items():
        a = np.array(Image.open(p).convert('RGBA')); c, i = sin_restos(a); info[k] = i
        mascaras.append(mascara_restos(a[..., 3])[0])
        Image.fromarray(c, 'RGBA').save(AQUI / f'pelo-delante-{k}-sin-restos.png', optimize=True)
    m = mascaras[0]
    Image.fromarray(np.where(m, 255, 0).astype(np.uint8)).save(AQUI / 'restos-quitados.png', optimize=True)
    ys, xs = np.where(m)
    comp = dict(metodo=f'componentes sueltos de menos de {TAM_MAX} px con el centro en RESTOS_CAJA', caja_busqueda=RESTOS_CAJA,
                caja_restos=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], por_color=info,
                misma_mascara_en_los_cinco=all((x == m).all() for x in mascaras), sha256_originales=antes)
    comp['originales_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_originales'}, ensure_ascii=False))
