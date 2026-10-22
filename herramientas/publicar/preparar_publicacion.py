#!/usr/bin/env python3
"""
Publicación en main de la versión aprobada de la prueba completa (D-030, commit 4d950bc), para jugar en el iPhone/iPad
instalado y sin conexión. Autorizado por la propietaria el 22/10/2026.

Escribe en DESTINO (una copia de trabajo de main) SOLO los archivos que el juego necesita, en las mismas rutas que en la
prueba completa (así el código aprobado no cambia de rutas):
  · index.html   ← docs/propuestas/prueba-completa-2026-10-22/index.html (la aprobada) con la cabecera del juego de verdad:
                   sin aislamiento (lee y guarda los datos de siempre: estrellas, dibujos, personaje…), sin «base»,
                   modo de pruebas solo en las direcciones de prueba (como hoy), su manifiesto, su título, su cinta de
                   pruebas, y el registro del service worker cambiado por offline.js (jugar sin conexión). Nada más.
  · sw.js, offline-lista.js (versión y lista de archivos), offline.js;
  · los archivos que carga: progreso.js, logros.js, motor, catálogo y piezas de la muñeca (prueba completa), láminas de
    Pintar, plantilla.js, avatar.css y los catálogos del juego, manifiestos e iconos; y .nojekyll (GitHub Pages sin Jekyll).
La versión es una huella de todos los archivos: si cambia cualquiera, cambia la caché (no se mezclan versiones).

Uso (desde la raíz de avatar-creador):  python3 herramientas/publicar/preparar_publicacion.py DESTINO
"""
import hashlib, json, shutil, sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[1]
CC = 'docs/propuestas/prueba-completa-2026-10-22/'
LAM = 'docs/propuestas/pintar-2026-10-21/laminas/'
LAMINAS = ['heladeria', 'gatito', 'hada', 'unicornio', 'perrito', 'conejito', 'princesa', 'helado', 'mariposa', 'explorador', 'hada-jardin', 'sirena']
COPIAR = ['manifest.json', 'manifest-pruebas.json', 'icon-192.png', 'icon-512.png', 'icon-pruebas-192.png', 'icon-pruebas-512.png',
          'plantilla/plantilla.js', 'avatar/avatar.css', 'avatar/catalogo.js', 'avatar/catalogo-muneca.js',
          CC + 'progreso.js', CC + 'logros.js', CC + 'avatar/motor.js', CC + 'avatar/catalogo-todo.js', CC + 'avatar/arte/piezas.js'] + \
         [LAM + n + '.png' for n in LAMINAS]
PIEZAS = sorted(str(p.relative_to(RAIZ)) for d in ('avatar/arte/m', 'avatar/arte/s', CC + 'avatar/arte/todo') for p in (RAIZ / d).glob('*.webp'))


def sustituir(t, a, b, n=1):
    assert t.count(a) == n, f'esperado {n} y encontrado {t.count(a)}: {a[:80]!r}'
    return t.replace(a, b)


def pagina():
    h = (RAIZ / CC / 'index.html').read_text(encoding='utf-8')
    h = h.split('\n', 1)[1]                                   # sin el comentario de la copia aislada
    h = sustituir(h, '<meta charset="utf-8">\n<base href="../../../">\n<script src="docs/propuestas/prueba-completa-2026-10-22/aislamiento.js"></script>', '<meta charset="utf-8">')
    h = sustituir(h, "window.MODO_PRUEBAS=true; /* copia aislada conjunta: siempre en modo de pruebas */",
                  "window.MODO_PRUEBAS=['raw.githack.com','rawcdn.githack.com'].includes(location.hostname)||\n"
                  "  (['localhost','127.0.0.1'].includes(location.hostname)&&/[?&]pruebas\\b/.test(location.search));")
    h = sustituir(h, "document.querySelector('link[rel=manifest]').href='docs/propuestas/prueba-completa-2026-10-22/manifest.json';",
                  "document.querySelector('link[rel=manifest]').href='manifest-pruebas.json';")
    h = sustituir(h, "content='PRUEBA COMPLETA';document.title='PRUEBA COMPLETA · Mi Mundo de Juegos'", "content='PRUEBAS';document.title='PRUEBAS · Mi Mundo de Juegos'")
    h = sustituir(h, '🧪 PRUEBA COMPLETA · datos propios</div>', '🧪 VERSIÓN DE PRUEBAS · datos ficticios</div>')
    h = sustituir(h, "/* copia aislada conjunta: no se registra ningún service worker (necesita conexión) */",
                  "/* jugar sin conexión: el service worker lo registra offline.js */")
    h = sustituir(h, '</body>', '<script src="offline-lista.js"></script>\n<script src="offline.js"></script>\n</body>')
    assert 'aislamiento' not in h and 'PRUEBA COMPLETA' not in h and '<base' not in h
    return h


if __name__ == '__main__':
    destino = Path(sys.argv[1]).resolve(); destino.mkdir(parents=True, exist_ok=True)
    assert (destino / '.git').exists() or len(sys.argv) > 2 and sys.argv[2] == '--sin-git', 'DESTINO debe ser una copia de trabajo de main'
    archivos = {'index.html': pagina().encode('utf-8'), 'offline.js': (AQUI / 'offline.js').read_bytes(), '.nojekyll': b''}
    for f in COPIAR + PIEZAS:
        archivos[f] = (RAIZ / f).read_bytes()
    basico = ['./', 'index.html', 'offline.js'] + [f for f in COPIAR if f != 'manifest-pruebas.json' and 'pruebas' not in f] + ['offline-lista.js']
    huella = hashlib.sha256(b''.join(hashlib.sha256(archivos[k]).digest() for k in sorted(archivos)) + (AQUI / 'sw-plantilla.js').read_bytes()).hexdigest()[:12]
    lista = 'self.OFFLINE = ' + json.dumps(dict(version=huella, basico=basico, piezas=PIEZAS), ensure_ascii=False) + ';\n'
    archivos['offline-lista.js'] = ('/* Generado por herramientas/publicar/preparar_publicacion.py: versión y archivos para jugar sin conexión */\n' + lista).encode('utf-8')
    archivos['sw.js'] = (AQUI / 'sw-plantilla.js').read_text(encoding='utf-8').replace('__LISTA__', lista).encode('utf-8')
    # limpiar lo que ya no se publica (salvo .git) y escribir
    for p in sorted(destino.rglob('*'), reverse=True):
        rel = p.relative_to(destino).as_posix()
        if rel.startswith('.git/') or rel == '.git':
            continue
        if p.is_file() and rel not in archivos:
            p.unlink()
        elif p.is_dir() and not any(p.iterdir()):
            p.rmdir()
    for f, b in archivos.items():
        (destino / f).parent.mkdir(parents=True, exist_ok=True); (destino / f).write_bytes(b)
    mb = sum(len(b) for b in archivos.values()) / 1048576
    print(json.dumps(dict(version=huella, archivos=len(archivos), basico=len(basico), piezas=len(PIEZAS), mb=round(mb, 1)), ensure_ascii=False))
