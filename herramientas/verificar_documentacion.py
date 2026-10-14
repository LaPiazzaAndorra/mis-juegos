#!/usr/bin/env python3
"""
Mi Mundo de Juegos · comprobación de documentación

Comprueba que cada cambio funcional (juego, avatar, arte, plantillas o herramientas) llega
acompañado de su documentación, y que no se olvida la versión de la caché sin conexión.

  python3 herramientas/verificar_documentacion.py BASE HEAD     # PR / rango de commits
  python3 herramientas/verificar_documentacion.py               # origin/main...HEAD
  python3 herramientas/verificar_documentacion.py --preparado   # lo que está en `git add` (antes de commit)

Reglas (salida 1 si alguna falla):
  1. Si hay cambios funcionales, deben cambiar también docs/ESTADO_ACTUAL.md y docs/REGISTRO_CAMBIOS.md.
  2. docs/REGISTRO_CAMBIOS.md debe ganar al menos una entrada nueva con fecha («## AAAA-MM-DD …» o «### AAAA-MM-DD …»).
  3. Si cambia un archivo que sw.js guarda en caché (lista FILES), debe cambiar la versión `const C='mis-juegos-vN'`.
No sustituye a las pruebas ni a la revisión de la propietaria.
"""
import re, subprocess, sys

NECESARIOS = ('docs/ESTADO_ACTUAL.md', 'docs/REGISTRO_CAMBIOS.md')
FUNCIONALES = ('index.html', 'sw.js', 'manifest.json', 'icon-192.png', 'icon-512.png',
               'avatar/', 'arte/', 'plantilla/', 'herramientas/')
EXCLUIDOS = ('herramientas/verificar_documentacion.py',)   # el propio comprobador


def git(*args):
    return subprocess.check_output(['git', *args], text=True)


def es_funcional(p):
    return p not in EXCLUIDOS and any(p == f or (f.endswith('/') and p.startswith(f)) for f in FUNCIONALES)


def cacheados(sw_texto):
    m = re.search(r'FILES\s*=\s*\[(.*?)\]', sw_texto, re.S)
    return {x.lstrip('./') or 'index.html' for x in re.findall(r"'([^']+)'", m.group(1))} if m else set()


def main(argv):
    if '--preparado' in argv:
        rango, diff_args = 'cambios preparados', ['--cached']
    else:
        base = argv[0] if len(argv) > 0 else 'origin/main'
        head = argv[1] if len(argv) > 1 else 'HEAD'
        rango, diff_args = f'{base}...{head}', [f'{base}...{head}']
    try:
        cambios = set(git('diff', '--name-only', *diff_args).split())
    except subprocess.CalledProcessError as e:
        print('No se ha podido calcular el diff (¿historial incompleto?):', e)
        return 2
    funcionales = sorted(p for p in cambios if es_funcional(p))
    print(f'Rango: {rango} · {len(cambios)} archivo(s) cambiado(s), {len(funcionales)} funcional(es)')
    if not funcionales:
        print('OK: no hay cambios funcionales que exijan actualizar la documentación.')
        return 0
    errores = []
    faltan = [d for d in NECESARIOS if d not in cambios]
    if faltan:
        errores.append('Faltan por actualizar en el mismo cambio: ' + ', '.join(faltan))
    if 'docs/REGISTRO_CAMBIOS.md' in cambios:
        d = git('diff', '-U0', *diff_args, '--', 'docs/REGISTRO_CAMBIOS.md')
        if not re.search(r'^\+#{2,3} \d{4}-\d{2}-\d{2}', d, re.M):
            errores.append('docs/REGISTRO_CAMBIOS.md no tiene ninguna entrada nueva con fecha («### AAAA-MM-DD — título»)')
    try:
        sw = git('show', 'HEAD:sw.js') if '--preparado' not in argv else open('sw.js', encoding='utf-8').read()
        en_cache = sorted(p for p in cambios if p in cacheados(sw))
    except (subprocess.CalledProcessError, OSError):
        en_cache = []
    if en_cache:
        dsw = git('diff', '-U0', *diff_args, '--', 'sw.js')
        if not re.search(r"^\+.*const C\s*=\s*'mis-juegos-v\d+'", dsw, re.M):
            errores.append('Cambian archivos guardados en caché (' + ', '.join(en_cache) +
                           ") pero no la versión de la caché en sw.js (const C='mis-juegos-vN'): el iPad seguiría mostrando la versión antigua")
    print('Cambios funcionales:', ', '.join(funcionales[:12]) + (' …' if len(funcionales) > 12 else ''))
    if errores:
        for e in errores:
            print('ERROR:', e)
        return 1
    print('OK: estado, registro de cambios y versión de caché actualizados junto al código.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
