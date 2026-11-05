#!/usr/bin/env python3
"""
Copia AISLADA (04/11/2026): el juego publicado (la prueba completa, D-030/D-032) con «Contar» y «Memoria» mejorados en
Pensar. No es el juego de Amaia; datos propios con el prefijo «pen1:». No cambia ningún archivo del juego, de la prueba
completa ni de otras carpetas: reutiliza sus pasos (importa su preparar_copia.py) y sus archivos de la muñeca.

Genera en esta carpeta:
  · index.html  ← index.html del juego con los mismos cambios que la prueba completa (lo publicado en main) y, al final,
                  pensar.css, dibujos.js y pensar.js (Contar y Memoria nuevos; los otros juegos de Pensar, como hoy);
  · progreso.js ← el de la prueba completa (sin cambios: las claves nuevas empiezan por «lv_» y ya van en la copia);
  · logros.js   ← copia sin cambios (las reglas de logros no cambian).
aislamiento.js y manifest.json son de esta carpeta (prefijo «pen1:», «PRUEBA PENSAR»).

Uso (desde la raíz): python3 docs/propuestas/pensar-2026-11-04/preparar_copia.py
"""
import importlib.util, shutil
from pathlib import Path

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
CARPETA = 'docs/propuestas/pensar-2026-11-04/'
COMPLETA = P / 'prueba-completa-2026-10-22'; CC_CARPETA = 'docs/propuestas/prueba-completa-2026-10-22/'
spec = importlib.util.spec_from_file_location('prueba_completa', COMPLETA / 'preparar_copia.py')
CC = importlib.util.module_from_spec(spec); spec.loader.exec_module(CC)   # solo define funciones y constantes
sustituir = CC.sustituir
EXTRA = (f'\n<link rel="stylesheet" href="{CARPETA}pensar.css">\n<script src="{CARPETA}dibujos.js"></script>'
         f'\n<script src="{CARPETA}pensar.js"></script>')

if __name__ == '__main__':
    h, pr = CC.juego_conjunto(CARPETA, 'PRUEBA PENSAR', 'PRUEBA PENSAR')
    # la muñeca: los archivos de la prueba completa, sin copiarlos (como en la prueba completa)
    h = sustituir(h, '<script src="avatar/arte/piezas.js"></script>', f'<script src="{CC_CARPETA}avatar/arte/piezas.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="avatar/catalogo-muneca.js"></script>\n<script src="{CC_CARPETA}avatar/catalogo-todo.js"></script>')
    h = sustituir(h, '<script src="avatar/motor.js"></script>', f'<script src="{CC_CARPETA}avatar/motor.js"></script>')
    h = sustituir(h, CC.CAMBIO_VIEJO, CC.CAMBIO_NUEVO)
    h = sustituir(h, CC.ROPA_VIEJO, CC.ROPA_NUEVO)
    h = sustituir(h, CC.ACC_VIEJO, CC.ACC_NUEVO)
    # Contar y Memoria nuevos (después de todo lo demás; el resto del juego no cambia)
    h = sustituir(h, f'<script src="{CARPETA}logros.js"></script>', f'<script src="{CARPETA}logros.js"></script>' + EXTRA)
    h = ('<!-- COPIA AISLADA: juego publicado + Contar y Memoria mejorados (generada por preparar_copia.py desde '
         'index.html). No es el juego de Amaia. -->\n') + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    (AQUI / 'progreso.js').write_text(pr, encoding='utf-8')
    shutil.copyfile(COMPLETA / 'logros.js', AQUI / 'logros.js')
    # misma página que la prueba completa salvo la carpeta, el título, la cinta y los tres archivos de Pensar
    ref = (COMPLETA / 'index.html').read_text(encoding='utf-8')
    norm = lambda t: t.replace(EXTRA, '').replace(CARPETA, CC_CARPETA).replace('PRUEBA PENSAR', 'PRUEBA COMPLETA').split('\n', 1)[1]
    igual = norm(h) == ref.split('\n', 1)[1]
    assert igual, 'la copia ya no coincide con la prueba completa salvo lo previsto'
    assert pr == (COMPLETA / 'progreso.js').read_text(encoding='utf-8'), 'progreso.js distinto del de la prueba completa'
    print('index.html, progreso.js y logros.js generados; igual a la prueba completa salvo carpeta, título y Pensar:', igual)
