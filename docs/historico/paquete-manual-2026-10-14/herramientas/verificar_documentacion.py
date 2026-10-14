#!/usr/bin/env python3
"""Comprueba en un PR que los cambios funcionales actualicen estado + changelog.
Uso: python3 herramientas/verificar_documentacion.py BASE_SHA HEAD_SHA
No reemplaza pruebas ni la revisión humana; pensado para ejecutarse en GitHub Actions.
"""
import subprocess, sys

NECESARIOS = {'docs/ESTADO_ACTUAL.md', 'docs/REGISTRO_CAMBIOS.md'}
FUNCIONALES = (
    'index.html', 'sw.js', 'manifest.json', 'avatar/', 'arte/',
    'plantilla/', 'herramientas/', 'icon-192.png', 'icon-512.png',
)
# El propio validador de documentación no es un cambio funcional del juego.
EXCLUIDOS = {'herramientas/verificar_documentacion.py'}


def es_funcional(path):
    if path in EXCLUIDOS:
        return False
    return any(path == p or (p.endswith('/') and path.startswith(p)) for p in FUNCIONALES)


def main():
    if len(sys.argv) != 3:
        print('Uso: verificar_documentacion.py BASE_SHA HEAD_SHA')
        return 2
    base, head = sys.argv[1:]
    try:
        out = subprocess.check_output(['git', 'diff', '--name-only', f'{base}...{head}'], text=True)
    except subprocess.CalledProcessError as e:
        print('No se ha podido calcular el diff; revisar la historia Git:', e)
        return 2
    cambios = set(out.splitlines())
    funcionales = sorted(p for p in cambios if es_funcional(p))
    if not funcionales:
        print('OK: no hay cambios funcionales que requieran actualización documental.')
        return 0
    faltan = NECESARIOS - cambios
    if faltan:
        print('ERROR: cambios funcionales detectados:', ', '.join(funcionales))
        print('Actualiza en el MISMO PR: ' + ', '.join(sorted(faltan)))
        return 1
    print('OK: se actualizaron estado y registro de cambios junto al código.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
