#!/usr/bin/env python3
"""
Copia AISLADA nueva (22/10/2026): la prueba completa (D-030, aprobada en general) + la habitación ilustrada de «Mi Mundo»
(D-031). No es el juego de Amaia; datos propios con el prefijo «hab1:». La prueba completa no cambia: esta copia reutiliza
sus pasos (importa su preparar_copia.py) y usa sus archivos de la muñeca (motor, catálogo «todo» y piezas) sin copiarlos.

Genera en esta carpeta:
  · index.html  ← index.html del juego con los mismos cambios que la prueba completa (cabecera de la copia, Pintar,
                  Heladería, logros, voz natural y la muñeca nueva con sus conjuntos y adornos) y, al final, habitacion.css y
                  habitacion.js (la habitación nueva; solo en el escenario «habitación»);
  · progreso.js ← el de la prueba completa; logros.js ← copia sin cambios.
aislamiento.js y manifest.json son de esta carpeta (prefijo «hab1:», «PRUEBA HABITACIÓN»).

Uso (desde la raíz): python3 docs/propuestas/prueba-habitacion-2026-10-22/preparar_copia.py
"""
import importlib.util, shutil
from pathlib import Path

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
CARPETA = 'docs/propuestas/prueba-habitacion-2026-10-22/'
COMPLETA = P / 'prueba-completa-2026-10-22'; CC_CARPETA = 'docs/propuestas/prueba-completa-2026-10-22/'
spec = importlib.util.spec_from_file_location('prueba_completa', COMPLETA / 'preparar_copia.py')
CC = importlib.util.module_from_spec(spec); spec.loader.exec_module(CC)   # solo define funciones y constantes
sustituir = CC.sustituir

if __name__ == '__main__':
    h, pr = CC.juego_conjunto(CARPETA, 'PRUEBA HABITACIÓN', 'PRUEBA HABITACIÓN')
    # la muñeca: los archivos de la prueba completa, sin copiarlos
    h = sustituir(h, '<script src="avatar/arte/piezas.js"></script>', f'<script src="{CC_CARPETA}avatar/arte/piezas.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="avatar/catalogo-muneca.js"></script>\n<script src="{CC_CARPETA}avatar/catalogo-todo.js"></script>')
    h = sustituir(h, '<script src="avatar/motor.js"></script>', f'<script src="{CC_CARPETA}avatar/motor.js"></script>')
    h = sustituir(h, CC.CAMBIO_VIEJO, CC.CAMBIO_NUEVO)
    h = sustituir(h, CC.ROPA_VIEJO, CC.ROPA_NUEVO)
    h = sustituir(h, CC.ACC_VIEJO, CC.ACC_NUEVO)
    # la habitación nueva (después de todo lo demás)
    h = sustituir(h, f'<script src="{CARPETA}logros.js"></script>',
                  f'<script src="{CARPETA}logros.js"></script>\n<link rel="stylesheet" href="{CARPETA}habitacion.css">\n<script src="{CARPETA}habitacion.js"></script>')
    h = ('<!-- COPIA AISLADA: prueba completa + habitación ilustrada de Mi Mundo (generada por preparar_copia.py desde '
         'index.html). No es el juego de Amaia. -->\n') + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    (AQUI / 'progreso.js').write_text(pr, encoding='utf-8')
    shutil.copyfile(COMPLETA / 'logros.js', AQUI / 'logros.js')
    # misma página que la prueba completa salvo la carpeta, el título, la cinta y la habitación
    ref = (COMPLETA / 'index.html').read_text(encoding='utf-8')
    norm = lambda t: (t.replace(CARPETA, CC_CARPETA).replace('PRUEBA HABITACIÓN', 'PRUEBA COMPLETA')
                      .replace(f'\n<link rel="stylesheet" href="{CC_CARPETA}habitacion.css">\n<script src="{CC_CARPETA}habitacion.js"></script>', '')
                      .split('\n', 1)[1])
    igual = norm(h) == ref.split('\n', 1)[1]
    assert igual, 'la copia ya no coincide con la prueba completa salvo lo previsto'
    print('index.html, progreso.js y logros.js generados; igual a la prueba completa salvo carpeta, título y habitación:', igual)
