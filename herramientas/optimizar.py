#!/usr/bin/env python3
"""
Mi Mundo de Juegos · Optimizador de piezas de la muñeca

Convierte los originales (arte/originales/*.png, 2000 × 3500, transparentes)
en las imágenes ligeras que usa el juego:

  · recorta cada pieza a su contenido y guarda su posición en el lienzo
    (así el juego la coloca en su sitio exacto, sin desplazamientos);
  · genera dos tamaños en WebP con transparencia:
        m = 50 %  (1000 × 1750 de lienzo) → «Vestir» en iPhone y iPad
        s = 30 %  ( 600 × 1050 de lienzo) → «Mi Mundo» y miniaturas
    el juego elige el más pequeño que se vea nítido en cada pantalla;
  · reduce con el alfa premultiplicado (sin bordes oscuros ni halos);
  · pone una huella del contenido en el nombre (pelo-rizos.3fa2c1d0.webp)
    para que el iPhone nunca muestre una versión antigua guardada;
  · escribe avatar/arte/piezas.js con la lista de piezas.

Uso:  python3 herramientas/optimizar.py
Requiere Python 3 con Pillow (pip install pillow).
"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / 'arte' / 'originales'
DEST = RAIZ / 'avatar' / 'arte'
LIENZO = (2000, 3500)
TAMANOS = {'s': 0.3, 'm': 0.5}
PASO = 20          # el recorte se alinea a 20 px: posiciones exactas en todos los tamaños
CALIDAD = 90       # WebP: color con pérdida casi invisible; transparencia sin pérdida


def recorte(im):
    bbox = im.getchannel('A').point(lambda a: 255 if a > 2 else 0).getbbox()
    if not bbox:
        return None
    x0, y0, x1, y1 = bbox
    x0, y0 = max(0, x0 - x0 % PASO), max(0, y0 - y0 % PASO)
    x1, y1 = min(LIENZO[0], x1 + (-x1) % PASO), min(LIENZO[1], y1 + (-y1) % PASO)
    return x0, y0, x1, y1


def reducir(im, f):
    w, h = round(im.width * f), round(im.height * f)
    return im.convert('RGBa').resize((w, h), Image.LANCZOS).convert('RGBA')


def main():
    if not ORIG.is_dir():
        sys.exit(f'No existe {ORIG}')
    piezas, errores, total = {}, [], {k: 0 for k in TAMANOS}
    for t in TAMANOS:
        (DEST / t).mkdir(parents=True, exist_ok=True)
    nuevos = set()
    for f in sorted(ORIG.glob('*.png')):
        im = Image.open(f)
        if im.size != LIENZO:
            errores.append(f'{f.name}: mide {im.size[0]} × {im.size[1]}, debe ser {LIENZO[0]} × {LIENZO[1]}')
            continue
        im = im.convert('RGBA')
        caja = recorte(im)
        if not caja:
            errores.append(f'{f.name}: está vacía')
            continue
        pid = f.stem
        huella = hashlib.sha1(im.tobytes()).hexdigest()[:8]
        x0, y0, x1, y1 = caja
        pieza = im.crop(caja)
        info = {'x': x0, 'y': y0, 'w': x1 - x0, 'h': y1 - y0, 'v': {}, 'kb': {}}
        for t, fac in TAMANOS.items():
            nombre = f'{pid}.{huella}.webp'
            ruta = DEST / t / nombre
            if not ruta.exists():
                reducir(pieza, fac).save(ruta, 'WEBP', quality=CALIDAD, alpha_quality=100, method=6)
            nuevos.add(ruta)
            info['v'][t] = f'avatar/arte/{t}/{nombre}'
            info['kb'][t] = round(ruta.stat().st_size / 1024, 1)
            total[t] += ruta.stat().st_size
        piezas[pid] = info
        print(f'  {pid:<38} {info["w"]:>5} × {info["h"]:<5} s {info["kb"]["s"]:>6} KB   m {info["kb"]["m"]:>6} KB')
    # elimina versiones antiguas
    for t in TAMANOS:
        for r in (DEST / t).glob('*.webp'):
            if r not in nuevos:
                r.unlink()
    datos = {'version': 1, 'lienzo': {'w': LIENZO[0], 'h': LIENZO[1]}, 'tamanos': TAMANOS, 'piezas': piezas}
    (DEST / 'piezas.js').write_text(
        '/* Generado por herramientas/optimizar.py — no editar a mano */\n'
        f'self.AV_PIEZAS = {json.dumps(datos, ensure_ascii=False, indent=1)};\n', encoding='utf-8')
    print(f'\n{len(piezas)} piezas · total s {total["s"] / 1024:.0f} KB · total m {total["m"] / 1024:.0f} KB')
    if errores:
        print('\nErrores:\n  ' + '\n  '.join(errores))
        sys.exit(1)


if __name__ == '__main__':
    main()
