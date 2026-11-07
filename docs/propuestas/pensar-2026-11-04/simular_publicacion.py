#!/usr/bin/env python3
"""
SIMULACIÓN (no publica nada): cómo quedaría el juego publicado con Contar, Memoria, ¿Qué sigue?, Sombras, El diferente
y Unir puntos, para comprobar que funciona SIN CONEXIÓN antes de integrarlo.

Usa el generador de publicación de avatar-creador (herramientas/publicar/preparar_publicacion.py) SIN modificarlo:
lo importa, añade a su página los archivos de Pensar (los mismos que carga esta copia) y a su lista de archivos para
jugar sin conexión, y escribe el resultado en una carpeta temporal (nunca en el repositorio ni en main).

Uso: python3 docs/propuestas/pensar-2026-11-04/simular_publicacion.py CARPETA_TEMPORAL
"""
import ast, importlib.util, sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]
CARPETA = 'docs/propuestas/pensar-2026-11-04/'
PENSAR = ['pensar.css', 'dibujos.js', 'pensar.js', 'figuras.js', 'pensar2.js', 'repasar.js']
GEN = RAIZ / 'herramientas' / 'publicar' / 'preparar_publicacion.py'

destino = Path(sys.argv[1]).resolve()
assert RAIZ not in destino.parents and destino != RAIZ, 'la simulación se escribe fuera del repositorio'
spec = importlib.util.spec_from_file_location('preparar_publicacion', GEN); G = importlib.util.module_from_spec(spec); spec.loader.exec_module(G)
pagina_original = G.pagina
def pagina():
    h = pagina_original()
    extra = f'<link rel="stylesheet" href="{CARPETA}pensar.css">\n' + ''.join(f'<script src="{CARPETA}{f}"></script>\n' for f in PENSAR if f.endswith('.js'))
    return G.sustituir(h, '<script src="offline-lista.js"></script>', extra + '<script src="offline-lista.js"></script>')
G.pagina = pagina
G.COPIAR = G.COPIAR + [CARPETA + f for f in PENSAR]
src = GEN.read_text(encoding='utf-8'); arbol = ast.parse(src)
principal = next(n for n in arbol.body if isinstance(n, ast.If) and 'main' in ast.get_source_segment(src, n.test))
sys.argv = [str(GEN), str(destino), '--sin-git']
for st in principal.body:
    exec(compile(ast.get_source_segment(src, st), str(GEN), 'exec'), vars(G))
