#!/usr/bin/env python3
"""
Copia AISLADA del salón (07/11/2026, D-034): lo publicado en main (la prueba completa, D-030/D-032, con Contar y Memoria de
la 1.ª entrega, D-035) + Mi Mundo con la habitación (aprobada, D-033) y el salón (pendiente de la prueba y la aprobación de
la propietaria). No es el juego de Amaia; datos propios con el prefijo «sal1:». No publica nada.

Reutiliza los pasos de la prueba completa (importa su preparar_copia.py) y sus archivos de la muñeca (sin copiarlos), como
la copia de la habitación (../prueba-mimundo-2026-11-04/). Genera en esta carpeta:
  · index.html  ← como la prueba completa, con su cabecera de copia, y al final, en el mismo orden que la publicación
                  (preparar_publicacion.py --con-pensar … --con-mimundo …): Contar y Memoria (../pensar-2026-11-04/, sin
                  cambios) y mimundo/ de esta carpeta (estilos, catálogo, medidas del arte y motor). Solo cambian las
                  escenas 🛏️ «habitación» y 🏠 «casa» (el salón) de «Mi Mundo»;
  · progreso.js ← el de la prueba completa + el prefijo «mm_» en «Guardar / Recuperar mi progreso» (la habitación, el
                  salón y las misiones viajan en la copia de seguridad);
  · logros.js   ← copia sin cambios.
aislamiento.js y manifest.json son de esta carpeta (prefijo «sal1:», «PRUEBA SALÓN»).

Uso (desde la raíz): python3 docs/propuestas/prueba-salon-2026-11-07/preparar_copia.py
"""
import importlib.util, shutil
from pathlib import Path

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
CARPETA = 'docs/propuestas/prueba-salon-2026-11-07/'
COMPLETA = P / 'prueba-completa-2026-10-22'; CC_CARPETA = 'docs/propuestas/prueba-completa-2026-10-22/'
PN = 'docs/propuestas/pensar-2026-11-04/'
spec = importlib.util.spec_from_file_location('prueba_completa', COMPLETA / 'preparar_copia.py')
CC = importlib.util.module_from_spec(spec); spec.loader.exec_module(CC)   # solo define funciones y constantes
sustituir = CC.sustituir
PENSAR = f'<link rel="stylesheet" href="{PN}pensar.css">\n<script src="{PN}dibujos.js"></script>\n<script src="{PN}pensar.js"></script>'
MIMUNDO = (f'<link rel="stylesheet" href="{CARPETA}mimundo/mimundo.css">\n<script src="{CARPETA}mimundo/catalogo-mimundo.js"></script>\n'
           f'<script src="{CARPETA}mimundo/arte/medidas.js"></script>\n<script src="{CARPETA}mimundo/mimundo.js"></script>')
PREFIJOS_VIEJO = "  const PREFIJOS = ['sc_', 'lv_'];"
PREFIJOS_NUEVO = "  const PREFIJOS = ['sc_', 'lv_', 'mm_'];   // Mi Mundo (D-033): habitación y misiones"

if __name__ == '__main__':
    h, pr = CC.juego_conjunto(CARPETA, 'PRUEBA SALÓN', 'PRUEBA SALÓN')
    h = sustituir(h, '<script src="avatar/arte/piezas.js"></script>', f'<script src="{CC_CARPETA}avatar/arte/piezas.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="avatar/catalogo-muneca.js"></script>\n<script src="{CC_CARPETA}avatar/catalogo-todo.js"></script>')
    h = sustituir(h, '<script src="avatar/motor.js"></script>', f'<script src="{CC_CARPETA}avatar/motor.js"></script>')
    h = sustituir(h, CC.CAMBIO_VIEJO, CC.CAMBIO_NUEVO)
    h = sustituir(h, CC.ROPA_VIEJO, CC.ROPA_NUEVO)
    h = sustituir(h, CC.ACC_VIEJO, CC.ACC_NUEVO)
    h = sustituir(h, f'<script src="{CARPETA}logros.js"></script>', f'<script src="{CARPETA}logros.js"></script>\n' + PENSAR + '\n' + MIMUNDO)
    h = ('<!-- COPIA AISLADA: lo publicado (prueba completa + Contar y Memoria) + Mi Mundo con la habitación y el salón '
         '(generada por preparar_copia.py desde index.html). No es el juego de Amaia. -->\n') + h
    # la línea de los prefijos, igual que la que pone la publicación (--con-mimundo)
    pr = sustituir(pr, PREFIJOS_VIEJO, PREFIJOS_NUEVO)
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    (AQUI / 'progreso.js').write_text(pr, encoding='utf-8')
    shutil.copyfile(COMPLETA / 'logros.js', AQUI / 'logros.js')
    # misma página que la prueba completa salvo la carpeta, el título, la cinta, Contar y Memoria y Mi Mundo
    ref = (COMPLETA / 'index.html').read_text(encoding='utf-8')
    norm = lambda t: (t.replace('\n' + PENSAR + '\n' + MIMUNDO, '').replace(CARPETA, CC_CARPETA).replace('PRUEBA SALÓN', 'PRUEBA COMPLETA').split('\n', 1)[1])
    igual = norm(h) == ref.split('\n', 1)[1]
    assert igual, 'la copia ya no coincide con la prueba completa salvo lo previsto'
    print('index.html, progreso.js y logros.js generados; igual a la prueba completa salvo carpeta, título, Contar y Memoria y Mi Mundo:', igual)
