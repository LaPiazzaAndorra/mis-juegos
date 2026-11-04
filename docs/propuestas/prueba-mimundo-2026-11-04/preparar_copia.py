#!/usr/bin/env python3
"""
Copia AISLADA (04/11/2026): lo publicado en main (la prueba completa, D-030/D-032) + Mi Mundo jugable (D-033): habitación
ilustrada, catálogo ilustrado y misiones. No es el juego de Amaia; datos propios con el prefijo «mmu1:». No publica nada.

Reutiliza los pasos de la prueba completa (importa su preparar_copia.py) y sus archivos de la muñeca (sin copiarlos), como
la prueba de la habitación (D-031). Genera en esta carpeta:
  · index.html  ← como la prueba completa, con su cabecera de copia, y al final mimundo/ (estilos, catálogo, medidas del
                  arte y motor). Solo cambia el escenario «habitación» de «Mi Mundo»; nada de Pintar, Heladería, Pensar
                  (Contar, Memoria…) ni logros;
  · progreso.js ← el de la prueba completa + el prefijo «mm_» en «Guardar / Recuperar mi progreso» (la habitación y las
                  misiones viajan en la copia de seguridad);
  · logros.js   ← copia sin cambios.
aislamiento.js y manifest.json son de esta carpeta (prefijo «mmu1:», «PRUEBA MI MUNDO»).

Uso (desde la raíz): python3 docs/propuestas/prueba-mimundo-2026-11-04/preparar_copia.py
"""
import importlib.util, shutil
from pathlib import Path

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
CARPETA = 'docs/propuestas/prueba-mimundo-2026-11-04/'
COMPLETA = P / 'prueba-completa-2026-10-22'; CC_CARPETA = 'docs/propuestas/prueba-completa-2026-10-22/'
spec = importlib.util.spec_from_file_location('prueba_completa', COMPLETA / 'preparar_copia.py')
CC = importlib.util.module_from_spec(spec); spec.loader.exec_module(CC)   # solo define funciones y constantes
sustituir = CC.sustituir
MIMUNDO = (f'<link rel="stylesheet" href="{CARPETA}mimundo/mimundo.css">\n<script src="{CARPETA}mimundo/catalogo-mimundo.js"></script>\n'
           f'<script src="{CARPETA}mimundo/arte/medidas.js"></script>\n<script src="{CARPETA}mimundo/mimundo.js"></script>')
PREFIJOS_VIEJO = "  const PREFIJOS = ['sc_', 'lv_'];"
PREFIJOS_NUEVO = "  const PREFIJOS = ['sc_', 'lv_', 'mm_'];   // Mi Mundo (D-033): habitación y misiones"

if __name__ == '__main__':
    h, pr = CC.juego_conjunto(CARPETA, 'PRUEBA MI MUNDO', 'PRUEBA MI MUNDO')
    h = sustituir(h, '<script src="avatar/arte/piezas.js"></script>', f'<script src="{CC_CARPETA}avatar/arte/piezas.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="avatar/catalogo-muneca.js"></script>\n<script src="{CC_CARPETA}avatar/catalogo-todo.js"></script>')
    h = sustituir(h, '<script src="avatar/motor.js"></script>', f'<script src="{CC_CARPETA}avatar/motor.js"></script>')
    h = sustituir(h, CC.CAMBIO_VIEJO, CC.CAMBIO_NUEVO)
    h = sustituir(h, CC.ROPA_VIEJO, CC.ROPA_NUEVO)
    h = sustituir(h, CC.ACC_VIEJO, CC.ACC_NUEVO)
    h = sustituir(h, f'<script src="{CARPETA}logros.js"></script>', f'<script src="{CARPETA}logros.js"></script>\n' + MIMUNDO)
    h = ('<!-- COPIA AISLADA: lo publicado (prueba completa) + Mi Mundo jugable con misiones (generada por preparar_copia.py '
         'desde index.html). No es el juego de Amaia. -->\n') + h
    pr = sustituir(pr, PREFIJOS_VIEJO, PREFIJOS_NUEVO)
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    (AQUI / 'progreso.js').write_text(pr, encoding='utf-8')
    shutil.copyfile(COMPLETA / 'logros.js', AQUI / 'logros.js')
    # misma página que la prueba completa salvo la carpeta, el título, la cinta y Mi Mundo
    ref = (COMPLETA / 'index.html').read_text(encoding='utf-8')
    norm = lambda t: (t.replace('\n' + MIMUNDO, '').replace(CARPETA, CC_CARPETA).replace('PRUEBA MI MUNDO', 'PRUEBA COMPLETA').split('\n', 1)[1])
    igual = norm(h) == ref.split('\n', 1)[1]
    assert igual, 'la copia ya no coincide con la prueba completa salvo lo previsto'
    print('index.html, progreso.js y logros.js generados; igual a la prueba completa salvo carpeta, título y Mi Mundo:', igual)
