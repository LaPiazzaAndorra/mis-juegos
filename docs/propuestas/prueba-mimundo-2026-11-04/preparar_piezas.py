#!/usr/bin/env python3
"""
Mi Mundo · piezas de la habitación a partir de las imágenes recibidas (recibidas/, sin modificar).

  · recibidas/fondo-habitacion-propuesta.png → mimundo/arte/fondo.webp (sin cambios)
  · recibidas/cama-propuesta.png → mimundo/arte/cama-detras.webp y cama-delante.webp (como en la prueba de la
    habitación, D-031: alfa ≥ 240 → 255, motitas sueltas fuera, «delante» = lo que queda por delante del embozo)
  · recibidas/<id>.png de cada objeto del catálogo (cesta, osito, pelota, cubos, cuento…) → mimundo/arte/<id>.webp,
    con las mismas comprobaciones: transparencia, interior opaco (alfa ≥ 240 → 255), motitas sueltas fuera, sin el
    resplandor de alrededor (limpiar_objeto) y recorte a su contenido. Si falta la imagen de un objeto, NO se dibuja nada en su lugar: queda en la lista de pendientes.
Escribe mimundo/arte/medidas.js (tamaño y punto de apoyo de cada capa) y mimundo/arte/comprobaciones.json.

Uso (desde la raíz): python3 docs/propuestas/prueba-mimundo-2026-11-04/preparar_piezas.py
"""
import hashlib, json, re
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; REC = AQUI / 'recibidas'; ARTE = AQUI / 'mimundo' / 'arte'
EMBOZO = [(40, 452), (130, 468), (200, 488), (300, 483), (400, 479), (460, 475), (530, 469), (600, 456), (700, 447), (760, 441),
          (820, 443), (900, 449), (1000, 463), (1100, 490), (1180, 520), (1312, 540)]


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def limpiar(ruta):
    """Interior opaco y sin motitas sueltas; devuelve la imagen y lo corregido."""
    c = np.array(Image.open(ruta).convert('RGBA')); a = c[..., 3].astype(int)
    if (a == 255).all():
        raise ValueError(f'{ruta.name}: no tiene transparencia (hace falta PNG con el fondo transparente)')
    casi = int(((a >= 240) & (a < 255)).sum()); c[..., 3] = np.where(a >= 240, 255, a)
    m = a > 0; lab, n = nd.label(m); tam = nd.sum(m, lab, range(1, n + 1)); grande = int(np.argmax(tam)) + 1
    # se quitan las motitas pequeñas (menos del 0,5 % de la pieza); las partes grandes separadas se conservan
    quitar = [i + 1 for i in range(n) if tam[i] < 0.005 * tam[grande - 1]]
    sueltas = np.isin(lab, quitar); c[sueltas, 3] = 0
    return c.astype(np.uint8), dict(alfa_casi_opaco_corregido_px=casi, motitas_quitadas=len(quitar), motitas_px=int(sueltas.sum()))


# Objetos (04/11/2026): las imágenes llegan con un «resplandor» alrededor: píxeles casi invisibles (alfa 1–3) de color
# naranja, rojo o blanco, a 3–500 px del objeto, que sobre fondos oscuros forman un halo. Se quita SOLO eso:
#   · se conserva el borde de verdad: el antialiasing (alfa ≥ ALFA_MIN) a ≤ RADIO px del cuerpo del objeto (alfa ≥ 240);
#   · para el osito, RADIO mayor: su pelo llega a unos 8–10 px con alfa ~60, y se conserva;
#   · todo lo demás (alfa < ALFA_MIN o más lejos) pasa a transparente. Ningún píxel cambia de color.
ALFA_MIN = 12
RADIO = {'osito': 12}


def limpiar_objeto(ruta, oid):
    c, info = limpiar(ruta); a = c[..., 3].astype(int)
    cuerpo = a >= 240; lab, n = nd.label(cuerpo); tam = nd.sum(cuerpo, lab, range(1, n + 1))
    cuerpo = np.isin(lab, [i + 1 for i in range(n) if tam[i] >= 0.005 * tam.max()])
    d = nd.distance_transform_edt(~cuerpo)
    quitar = (a > 0) & ((a < ALFA_MIN) | (d > RADIO.get(oid, 6)))
    info.update(resplandor_quitado_px=int(quitar.sum()), radio_borde_px=RADIO.get(oid, 6), alfa_min=ALFA_MIN,
                borde_conservado_px=int(((a > 0) & (a < 255) & ~quitar).sum()))
    c[quitar, 3] = 0
    return c, info


def guardar(arr, nombre, caja):
    x0, y0, x1, y1 = caja; im = Image.fromarray(arr).crop(caja)
    im.save(ARTE / f'{nombre}.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    return dict(f=f'{nombre}.webp', px=[x1 - x0, y1 - y0], recorte=[x0, y0])   # recorte: dónde empieza en la imagen recibida


if __name__ == '__main__':
    ARTE.mkdir(parents=True, exist_ok=True)
    antes = {p.name: sha(p) for p in sorted(REC.glob('*.png'))}
    medidas, comp, pendientes = {}, {}, []
    # fondo
    Image.open(REC / 'fondo-habitacion-propuesta.png').convert('RGB').save(ARTE / 'fondo.webp', 'WEBP', quality=92, method=6)
    medidas['fondo'] = dict(f='fondo.webp', px=list(Image.open(REC / 'fondo-habitacion-propuesta.png').size))
    # cama en dos capas (mismo recorte)
    c, comp['cama'] = limpiar(REC / 'cama-propuesta.png'); Hc, Wc = c.shape[:2]
    linea = Image.new('L', (Wc, Hc), 0); ImageDraw.Draw(linea).polygon(EMBOZO + [(Wc, Hc), (0, Hc)], fill=255)
    linea = np.array(linea.filter(ImageFilter.GaussianBlur(1.2))).astype(float) / 255
    d = c.copy(); d[..., 3] = (c[..., 3] * linea).astype(np.uint8)
    caja = Image.fromarray(c).getchannel('A').getbbox()
    medidas['cama-detras'] = dict(guardar(c, 'cama-detras', caja), base=[656 - caja[0], 1190 - caja[1]])
    medidas['cama-delante'] = dict(guardar(d, 'cama-delante', caja), base=[656 - caja[0], 1190 - caja[1]])
    # objetos del catálogo
    ids = re.findall(r"\{ id: '([a-z-]+)', nombre: '([^']+)'", (AQUI / 'mimundo' / 'catalogo-mimundo.js').read_text(encoding='utf-8'))
    for oid, nombre in ids:
        if oid == 'cama':
            continue
        r = REC / f'{oid}.png'
        if not r.exists():
            pendientes.append(dict(id=oid, nombre=nombre, archivo=f'recibidas/{oid}.png')); continue
        arr, comp[oid] = limpiar_objeto(r, oid); caja = Image.fromarray(arr).getchannel('A').getbbox()
        a = arr[..., 3] > 128; ys = np.where(a.any(1))[0]; fila = a[ys.max()]; xs = np.where(fila)[0]
        medidas[oid] = dict(guardar(arr, oid, caja), base=[int((xs.min() + xs.max()) / 2) - caja[0], int(ys.max()) - caja[1]])
    (ARTE / 'medidas.js').write_text('/* Generado por preparar_piezas.py: tamaño (px) y punto de apoyo (base) de cada capa del arte de Mi Mundo */\n'
                                     'window.MM_MEDIDAS = ' + json.dumps(medidas, ensure_ascii=False) + ';\n', encoding='utf-8')
    res = dict(piezas=comp, pendientes=pendientes, kb={p.name: round(p.stat().st_size / 1024, 1) for p in sorted(ARTE.glob('*.webp'))},
               recibidas_sin_cambios=antes == {p.name: sha(p) for p in sorted(REC.glob('*.png'))}, sha256_recibidas=antes)
    (ARTE / 'comprobaciones.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(dict(hechas=sorted(medidas), pendientes=[p['id'] for p in pendientes], recibidas_sin_cambios=res['recibidas_sin_cambios']), ensure_ascii=False))
