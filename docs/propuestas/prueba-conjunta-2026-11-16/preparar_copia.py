#!/usr/bin/env python3
"""
Copia AISLADA CONJUNTA (16/11/2026): una sola prueba con las dos partes, pedida por la propietaria antes de publicar.
  · el juego publicado (la prueba completa, con sus logros y su progreso);
  · la capa COMÚN de lectura (D-038, docs/propuestas/lectura-2026-11-17/), UNA sola vez, justo después de logros.js;
  · los juegos de Pensar de juegos-pensar (bcb9f4d), de su carpeta y en su orden (Contar, Memoria, ¿Qué sigue?, Sombras,
    El diferente, Unir puntos, Repasar, Dibujos por partes, ¿Quién es?, Retos…);
  · Mi Mundo (habitación, salón, cuidar a la muñeca) de ../prueba-cuidar-2026-11-15/mimundo/ (sin copiarlo);
  · al final, los ajustes propios de Pensar para la lectura (lectura-pensar.css y lectura-pensar.js), «los últimos».
No es el juego de Amaia; datos propios con el prefijo «cnj1:». No publica nada ni cambia ningún archivo de las otras
carpetas. progreso.js: el de la prueba completa + el prefijo «mm_» (Mi Mundo); los niveles de Pensar («lv_») ya van.

Uso (desde la raíz): python3 docs/propuestas/prueba-conjunta-2026-11-16/preparar_copia.py
"""
import importlib.util, shutil
from pathlib import Path

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
CARPETA = 'docs/propuestas/prueba-conjunta-2026-11-16/'
MM = 'docs/propuestas/prueba-cuidar-2026-11-15/'
COMPLETA = P / 'prueba-completa-2026-10-22'; CC_CARPETA = 'docs/propuestas/prueba-completa-2026-10-22/'
PN = 'docs/propuestas/pensar-2026-11-04/'
LE = 'docs/propuestas/lectura-2026-11-17/'   # norma de lectura (D-038), común a todas las ramas
LECTURA = f'<link rel="stylesheet" href="{LE}lectura.css">\n<script src="{LE}lectura.js"></script>'
spec = importlib.util.spec_from_file_location('prueba_completa', COMPLETA / 'preparar_copia.py')
CC = importlib.util.module_from_spec(spec); spec.loader.exec_module(CC)   # solo define funciones y constantes
sustituir = CC.sustituir
PENSAR = (f'<link rel="stylesheet" href="{PN}pensar.css">\n<script src="{PN}dibujos.js"></script>\n<script src="{PN}pensar.js"></script>\n'
          f'<script src="{PN}figuras.js"></script>\n<script src="{PN}pensar2.js"></script>\n<script src="{PN}repasar.js"></script>\n'
          f'<link rel="stylesheet" href="{PN}etapas.css">\n<script src="{PN}ilustraciones.js"></script>\n<script src="{PN}etapas.js"></script>\n<script src="{PN}quien.js"></script>\n'
          f'<link rel="stylesheet" href="{PN}retos.css">\n<script src="{PN}retos.js"></script>')
LECTURA_PENSAR = f'<link rel="stylesheet" href="{PN}lectura-pensar.css">\n<script src="{PN}lectura-pensar.js"></script>'
MIMUNDO = (f'<link rel="stylesheet" href="{MM}mimundo/mimundo.css">\n<script src="{MM}mimundo/catalogo-mimundo.js"></script>\n'
           f'<script src="{MM}mimundo/arte/medidas.js"></script>\n<script src="{MM}mimundo/mimundo.js"></script>')
PREFIJOS_VIEJO = "  const PREFIJOS = ['sc_', 'lv_'];"
PREFIJOS_NUEVO = "  const PREFIJOS = ['sc_', 'lv_', 'mm_'];   // Mi Mundo (D-033): habitación y misiones"

if __name__ == '__main__':
    h, pr = CC.juego_conjunto(CARPETA, 'PRUEBA CONJUNTA', 'PRUEBA CONJUNTA')
    h = sustituir(h, '<script src="avatar/arte/piezas.js"></script>', f'<script src="{CC_CARPETA}avatar/arte/piezas.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="avatar/catalogo-muneca.js"></script>\n<script src="{CC_CARPETA}avatar/catalogo-todo.js"></script>')
    h = sustituir(h, '<script src="avatar/motor.js"></script>', f'<script src="{CC_CARPETA}avatar/motor.js"></script>')
    h = sustituir(h, CC.CAMBIO_VIEJO, CC.CAMBIO_NUEVO)
    h = sustituir(h, CC.ROPA_VIEJO, CC.ROPA_NUEVO)
    h = sustituir(h, CC.ACC_VIEJO, CC.ACC_NUEVO)
    h = sustituir(h, f'<script src="{CARPETA}logros.js"></script>', f'<script src="{CARPETA}logros.js"></script>\n' + LECTURA + '\n' + PENSAR + '\n' + MIMUNDO + '\n' + LECTURA_PENSAR)
    h = ('<!-- COPIA AISLADA CONJUNTA: lo publicado + juegos de Pensar + Mi Mundo + norma de lectura '
         '(generada por preparar_copia.py desde index.html). No es el juego de Amaia. -->\n') + h
    # la línea de los prefijos, igual que la que pone la publicación (--con-mimundo)
    pr = sustituir(pr, PREFIJOS_VIEJO, PREFIJOS_NUEVO)
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    (AQUI / 'progreso.js').write_text(pr, encoding='utf-8')
    shutil.copyfile(COMPLETA / 'logros.js', AQUI / 'logros.js')
    # misma página que la prueba completa salvo la carpeta, el título, la cinta, Contar y Memoria y Mi Mundo
    ref = (COMPLETA / 'index.html').read_text(encoding='utf-8')
    norm = lambda t: (t.replace('\n' + LECTURA + '\n' + PENSAR + '\n' + MIMUNDO + '\n' + LECTURA_PENSAR, '').replace(CARPETA, CC_CARPETA).replace('PRUEBA CONJUNTA', 'PRUEBA COMPLETA').split('\n', 1)[1])
    igual = norm(h) == ref.split('\n', 1)[1]
    assert igual, 'la copia ya no coincide con la prueba completa salvo lo previsto'
    print('index.html, progreso.js y logros.js generados; igual a la prueba completa salvo carpeta, título, Contar y Memoria y Mi Mundo:', igual)
