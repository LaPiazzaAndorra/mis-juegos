#!/usr/bin/env python3
"""
Mi Mundo · piezas de la copia del salón (D-034, 07/11/2026).

  · La habitación (aprobada y publicada): sus piezas se COPIAN tal cual de ../prueba-mimundo-2026-11-04/mimundo/arte/
    (mismos bytes y mismas medidas); aquí no se vuelven a preparar.
  · El salón: las 14 imágenes recibidas (recibidas/, sin modificar) → mimundo/arte/, con las mismas comprobaciones que la
    habitación (las funciones de ../prueba-mimundo-2026-11-04/preparar_piezas.py): transparencia, interior opaco
    (alfa ≥ 240 → 255), motitas sueltas fuera, sin el resplandor de alrededor y recorte a su contenido. Los dos cojines del
    sofá llegan en una sola imagen (09-cojines-sofa.png): se separan (izquierda: corazón; derecha: estrella).
    Punto de apoyo de los muebles y objetos del salón: el centro de abajo de la pieza (en la habitación era el centro de la
    fila más baja; en la mesa o la estantería esa fila es una sola pata y desplazaba el mueble).
Si falta la imagen de un objeto, NO se dibuja nada en su lugar: queda en la lista de pendientes.
Escribe mimundo/arte/medidas.js y mimundo/arte/comprobaciones.json.

Uso (desde la raíz): python3 docs/propuestas/prueba-salon-2026-11-07/preparar_piezas.py
"""
import hashlib, importlib.util, json, re, shutil
from pathlib import Path
import numpy as np
from PIL import Image

AQUI = Path(__file__).resolve().parent; REC = AQUI / 'recibidas'; ARTE = AQUI / 'mimundo' / 'arte'
HAB = AQUI.parent / 'prueba-mimundo-2026-11-04'
spec = importlib.util.spec_from_file_location('piezas_habitacion', HAB / 'preparar_piezas.py')
PH = importlib.util.module_from_spec(spec); spec.loader.exec_module(PH)   # solo define funciones y constantes
PH.RADIO['conejito'] = 12   # como el osito: el pelo del peluche llega a unos 8–10 px del cuerpo y se conserva
from scipy import ndimage as nd
SALON = {'sofa': '02-sofa.png', 'estanteria': '03-estanteria.png', 'lampara': '04-lampara.png', 'alfombra': '05-alfombra.png',
         'mesa': '06-mesa.png', 'cojin-rosa': '07-cojin-rosa.png', 'cojin-lila': '08-cojin-lila.png',
         'cojin-corazon': ('09-cojines-sofa.png', 0), 'cojin-estrella': ('09-cojines-sofa.png', 1),
         'plato': '10-plato.png', 'taza': '11-taza.png', 'tetera': '12-tetera.png', 'galletas': '13-galletas.png', 'conejito': '14-conejito.png'}


def separar(arr, cual):
    """De una imagen con dos piezas, la de la izquierda (0) o la de la derecha (1): cada píxel va con la pieza más cercana."""
    cuerpo = arr[..., 3] >= 240; lab, n = nd.label(cuerpo); tam = nd.sum(cuerpo, lab, range(1, n + 1))
    dos = [int(i) + 1 for i in np.argsort(tam)[-2:]]
    dos.sort(key=lambda i: np.where(lab == i)[1].mean())
    d0 = nd.distance_transform_edt(lab != dos[0]); d1 = nd.distance_transform_edt(lab != dos[1])
    otra = (d1 < d0) if cual == 0 else (d0 <= d1)
    o = arr.copy(); o[otra, 3] = 0
    return o


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def leer_medidas(p):
    t = p.read_text(encoding='utf-8'); return json.loads(t[t.index('{'):t.rindex('}') + 1])


def guardar(arr, nombre, caja):
    x0, y0, x1, y1 = caja; im = Image.fromarray(arr).crop(caja)
    im.save(ARTE / f'{nombre}.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    return dict(f=f'{nombre}.webp', px=[x1 - x0, y1 - y0], recorte=[x0, y0])


if __name__ == '__main__':
    ARTE.mkdir(parents=True, exist_ok=True)
    antes = {p.name: sha(p) for p in sorted(REC.glob('*.png'))}
    # la habitación, tal cual
    mh = leer_medidas(HAB / 'mimundo' / 'arte' / 'medidas.js'); medidas = dict(mh); comp, pendientes = {}, []
    for m in mh.values():
        shutil.copyfile(HAB / 'mimundo' / 'arte' / m['f'], ARTE / m['f'])
    # el salón
    Image.open(REC / '01-fondo.png').convert('RGB').save(ARTE / 'fondo-salon.webp', 'WEBP', quality=92, method=6)
    medidas['fondo-salon'] = dict(f='fondo-salon.webp', px=list(Image.open(REC / '01-fondo.png').size))
    cat = (AQUI / 'mimundo' / 'catalogo-mimundo.js').read_text(encoding='utf-8')
    for oid, nombre in re.findall(r"\{ id: '([a-z-]+)', nombre: '([^']+)'", cat):
        if oid in mh or oid not in SALON:
            continue
        fuente = SALON[oid]; parte = None
        if isinstance(fuente, tuple):
            fuente, parte = fuente
        r = REC / fuente
        if not r.exists():
            pendientes.append(dict(id=oid, nombre=nombre, archivo=str(r.relative_to(AQUI)))); continue
        arr, comp[oid] = PH.limpiar_objeto(r, oid)
        if parte is not None:
            arr = separar(arr, parte); comp[oid]['separado_de'] = fuente
        caja = Image.fromarray(arr).getchannel('A').getbbox()
        medidas[oid] = dict(guardar(arr, oid, caja), base=[(caja[2] - caja[0]) // 2, caja[3] - caja[1] - 1])
    (ARTE / 'medidas.js').write_text('/* Generado por preparar_piezas.py: tamaño (px), recorte y punto de apoyo (base) de cada capa del arte de Mi Mundo */\n'
                                     'window.MM_MEDIDAS = ' + json.dumps(medidas, ensure_ascii=False) + ';\n', encoding='utf-8')
    res = dict(piezas=comp, pendientes=pendientes, habitacion_copiada_sin_cambios=all(sha(ARTE / m['f']) == sha(HAB / 'mimundo' / 'arte' / m['f']) for m in mh.values()),
               kb={p.name: round(p.stat().st_size / 1024, 1) for p in sorted(ARTE.glob('*.webp'))},
               recibidas_sin_cambios=antes == {p.name: sha(p) for p in sorted(REC.glob('*.png'))}, sha256_recibidas=antes)
    (ARTE / 'comprobaciones.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(dict(hechas=sorted(medidas), pendientes=[p['id'] for p in pendientes], habitacion_sin_cambios=res['habitacion_copiada_sin_cambios'],
                          recibidas_sin_cambios=res['recibidas_sin_cambios']), ensure_ascii=False))
