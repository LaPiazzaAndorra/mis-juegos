#!/usr/bin/env python3
"""
Copia AISLADA «cuidar a la muñeca» (15/11/2026, D-037, 1.ª entrega): lo publicado en main (la prueba completa con Contar y
Memoria, D-035) + Mi Mundo con la habitación y el salón (D-034) + cámara libre, día y noche, necesidades (sueño y diversión),
interacciones con los objetos y la rutina del pijama; y la norma de lectura (D-038: ../lectura-2026-11-17/, textos en
MAYÚSCULAS, grandes y sencillos). No es el juego de Amaia; datos propios con el prefijo «cui1:». No
publica nada.

El arte de Mi Mundo (23 piezas y medidas.js) se copia tal cual de ../prueba-salon-2026-11-07/mimundo/arte/ (mismos bytes);
el motor, los estilos y el catálogo son de esta carpeta.

Reutiliza los pasos de la prueba completa (importa su preparar_copia.py) y sus archivos de la muñeca (sin copiarlos), como
la copia de la habitación (../prueba-mimundo-2026-11-04/). Genera en esta carpeta:
  · index.html  ← como la prueba completa, con su cabecera de copia, y al final, en el mismo orden que la publicación
                  (preparar_publicacion.py --con-pensar … --con-mimundo …): Contar y Memoria (../pensar-2026-11-04/, sin
                  cambios) y mimundo/ de esta carpeta (estilos, catálogo, medidas del arte y motor). Solo cambian las
                  escenas 🛏️ «habitación» y 🏠 «casa» (el salón) de «Mi Mundo»;
  · progreso.js ← el de la prueba completa + el prefijo «mm_» en «Guardar / Recuperar mi progreso» (la habitación, el
                  salón y las misiones viajan en la copia de seguridad);
  · logros.js   ← copia sin cambios.
aislamiento.js y manifest.json son de esta carpeta (prefijo «cui1:», «PRUEBA CUIDAR»).

Uso (desde la raíz): python3 docs/propuestas/prueba-cuidar-2026-11-15/preparar_copia.py
"""
import importlib.util, shutil
from pathlib import Path

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
CARPETA = 'docs/propuestas/prueba-cuidar-2026-11-15/'
ARTE_SALON = P / 'prueba-salon-2026-11-07' / 'mimundo' / 'arte'
COMPLETA = P / 'prueba-completa-2026-10-22'; CC_CARPETA = 'docs/propuestas/prueba-completa-2026-10-22/'
PN = 'docs/propuestas/pensar-2026-11-04/'
LE = 'docs/propuestas/lectura-2026-11-17/'   # norma de lectura (D-038), común a todas las ramas
LECTURA = f'<link rel="stylesheet" href="{LE}lectura.css">\n<script src="{LE}lectura.js"></script>'
spec = importlib.util.spec_from_file_location('prueba_completa', COMPLETA / 'preparar_copia.py')
CC = importlib.util.module_from_spec(spec); spec.loader.exec_module(CC)   # solo define funciones y constantes
sustituir = CC.sustituir
PENSAR = f'<link rel="stylesheet" href="{PN}pensar.css">\n<script src="{PN}dibujos.js"></script>\n<script src="{PN}pensar.js"></script>'
MIMUNDO = (f'<link rel="stylesheet" href="{CARPETA}mimundo/mimundo.css">\n<script src="{CARPETA}mimundo/catalogo-mimundo.js"></script>\n'
           f'<script src="{CARPETA}mimundo/arte/medidas.js"></script>\n<script src="{CARPETA}mimundo/mimundo.js"></script>')
PREFIJOS_VIEJO = "  const PREFIJOS = ['sc_', 'lv_'];"
PREFIJOS_NUEVO = "  const PREFIJOS = ['sc_', 'lv_', 'mm_'];   // Mi Mundo (D-033): habitación y misiones"

if __name__ == '__main__':
    h, pr = CC.juego_conjunto(CARPETA, 'PRUEBA CUIDAR', 'PRUEBA CUIDAR')
    h = sustituir(h, '<script src="avatar/arte/piezas.js"></script>', f'<script src="{CC_CARPETA}avatar/arte/piezas.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="avatar/catalogo-muneca.js"></script>\n<script src="{CC_CARPETA}avatar/catalogo-todo.js"></script>')
    h = sustituir(h, '<script src="avatar/motor.js"></script>', f'<script src="{CC_CARPETA}avatar/motor.js"></script>')
    h = sustituir(h, CC.CAMBIO_VIEJO, CC.CAMBIO_NUEVO)
    h = sustituir(h, CC.ROPA_VIEJO, CC.ROPA_NUEVO)
    h = sustituir(h, CC.ACC_VIEJO, CC.ACC_NUEVO)
    h = sustituir(h, f'<script src="{CARPETA}logros.js"></script>', f'<script src="{CARPETA}logros.js"></script>\n' + LECTURA + '\n' + PENSAR + '\n' + MIMUNDO)
    h = ('<!-- COPIA AISLADA: lo publicado (prueba completa + Contar y Memoria) + Mi Mundo para cuidar a la muñeca '
         '(generada por preparar_copia.py desde index.html). No es el juego de Amaia. -->\n') + h
    # la línea de los prefijos, igual que la que pone la publicación (--con-mimundo)
    pr = sustituir(pr, PREFIJOS_VIEJO, PREFIJOS_NUEVO)
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    (AQUI / 'progreso.js').write_text(pr, encoding='utf-8')
    shutil.copyfile(COMPLETA / 'logros.js', AQUI / 'logros.js')
    # el arte, tal cual el de la copia del salón
    (AQUI / 'mimundo' / 'arte').mkdir(parents=True, exist_ok=True)
    for f in sorted(ARTE_SALON.iterdir()):
        if f.suffix in ('.webp', '.js', '.json'):
            shutil.copyfile(f, AQUI / 'mimundo' / 'arte' / f.name)
    # misma página que la prueba completa salvo la carpeta, el título, la cinta, Contar y Memoria y Mi Mundo
    ref = (COMPLETA / 'index.html').read_text(encoding='utf-8')
    norm = lambda t: (t.replace('\n' + LECTURA + '\n' + PENSAR + '\n' + MIMUNDO, '').replace(CARPETA, CC_CARPETA).replace('PRUEBA CUIDAR', 'PRUEBA COMPLETA').split('\n', 1)[1])
    igual = norm(h) == ref.split('\n', 1)[1]
    assert igual, 'la copia ya no coincide con la prueba completa salvo lo previsto'
    print('index.html, progreso.js y logros.js generados; igual a la prueba completa salvo carpeta, título, Contar y Memoria y Mi Mundo:', igual)
