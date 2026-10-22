#!/usr/bin/env python3
"""
Copia AISLADA conjunta (22/10/2026): Pintar + Heladería + logros en una sola versión de prueba. No es el juego de Amaia.

No modifica ningún archivo del juego ni de las referencias congeladas. Reutiliza EXACTAMENTE los cambios de:
  · Pintar     ../pintar-2026-10-21/preparar_copia.py       (referencia 708c2f2)
  · Heladería  ../heladeria-2026-10-21/preparar_copia.py    (referencia 7aeb5b7)
  · Logros     ../logros-prueba-2026-10-21/preparar_copia.py (primera prueba 192e9b9)
Lee el bloque principal de cada generador (con «ast») y ejecuta sus sustituciones sobre el index.html del juego, en este
orden, saltando solo las de cabecera (aislamiento, modo de pruebas, manifiesto, cinta, service worker, escribir archivos),
que aquí se hacen una vez para la copia conjunta. Cada sustitución sigue comprobando que el texto existe una sola vez.

Saltos y ajustes para que convivan (los únicos cambios propios de esta copia):
  1. «addToGallery» seguro: lo ponen Pintar y Heladería; se aplica una vez (el de Pintar).
  2. Logros: sus dos sustituciones de pedidos son para la Heladería antigua; aquí, los pedidos de la Heladería nueva solo
     usan los 6 sabores y 5 adornos de siempre (NB_FLAV_BASE / NB_TOPS_BASE).
  3. logros.js propio de esta carpeta (adaptado a la Pintar y la Heladería nuevas) y progreso.js de esta carpeta (el del
     juego + logros, tareas, premios en la lista de claves; recuperación como hoy).
  4. Foto de la Heladería: los sabores de premio con degradado usan un color liso en la foto.
  5. Voz: tono natural siempre (1,00) y velocidad 0,95; sin tonos agudos. El botón 🔊/🔇 de inicio sigue silenciándola.
     La clave guardada «tone» no se cambia ni se borra (se ignora).

Uso (desde la raíz del repositorio): python3 docs/propuestas/prueba-conjunta-2026-10-22/preparar_copia.py
"""
import ast, importlib.util
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[2]
P = RAIZ / 'docs' / 'propuestas'
CARPETA = 'docs/propuestas/prueba-conjunta-2026-10-22/'
CABECERA = ('<meta charset', 'MODO_PRUEBAS', 'document.title', 'manifest', 'serviceWorker', 'VERSIÓN DE PRUEBAS', "RAIZ / 'index.html'",
            'AQUI /', 'COPIA AISLADA', 'print(')


def sustituir(texto, viejo, nuevo, veces=1):
    n = texto.count(viejo)
    assert n == veces, f'esperado {veces} vez/veces y encontrado {n}: {viejo[:80]!r}'
    return texto.replace(viejo, nuevo)


def cargar(ruta):
    spec = importlib.util.spec_from_file_location(ruta.parent.name.replace('-', '_'), ruta)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)   # solo define constantes (no ejecuta el bloque principal)
    return mod


def pasos(ruta, saltar=()):
    """Sentencias del bloque «if __name__ == '__main__'» del generador, sin las de cabecera ni las indicadas."""
    src = ruta.read_text(encoding='utf-8'); arbol = ast.parse(src)
    principal = next(n for n in arbol.body if isinstance(n, ast.If) and 'main' in ast.get_source_segment(src, n.test))
    for st in principal.body:
        seg = ast.get_source_segment(src, st)
        if any(c in seg for c in CABECERA) or any(s in seg for s in saltar) or seg.lstrip().startswith(('pr =', 'pr=')):
            continue
        yield seg


def aplicar(h, ruta, saltar=(), extra=None):
    mod = cargar(ruta); ns = dict(vars(mod)); ns.update(extra or {}); ns['h'] = h; n = 0
    for seg in pasos(ruta, saltar):
        exec(compile(seg, f'{ruta}', 'exec'), ns); n += 1
    print(f'  {ruta.parent.name}: {n} pasos')
    return ns['h']


if __name__ == '__main__':
    # ---------- progreso.js (el del juego + 3 claves; recuperación como hoy) ----------
    pr = (RAIZ / 'progreso.js').read_text(encoding='utf-8')
    pr = sustituir(pr, "  const CLAVES = ['stars', 'gal', 'sound', 'voice', 'tone', 'iceServed', 'iceCoins', 'scKey', 'mm_hab', 'avatar', 'avatar_draft', 'doll'];",
                   "  const CLAVES = ['stars', 'gal', 'sound', 'voice', 'tone', 'iceServed', 'iceCoins', 'scKey', 'mm_hab', 'avatar', 'avatar_draft', 'doll',\n"
                   "    'logros', 'tareas', 'premios'];   // COPIA de la prueba conjunta: solo se añaden estas tres claves")
    (AQUI / 'progreso.js').write_text('/* COPIA para la prueba conjunta (generada por preparar_copia.py desde progreso.js): solo cambia la lista CLAVES. */\n' + pr, encoding='utf-8')
    # ---------- index.html ----------
    h = (RAIZ / 'index.html').read_text(encoding='utf-8')
    # cabecera de la copia conjunta
    h = sustituir(h, '<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="../../../">\n'
                  f'<script src="{CARPETA}aislamiento.js"></script>')
    h = sustituir(h, "window.MODO_PRUEBAS=['raw.githack.com','rawcdn.githack.com'].includes(location.hostname)||\n"
                     "  (['localhost','127.0.0.1'].includes(location.hostname)&&/[?&]pruebas\\b/.test(location.search));",
                  "window.MODO_PRUEBAS=true; /* copia aislada conjunta: siempre en modo de pruebas */")
    h = sustituir(h, "document.querySelector('link[rel=manifest]').href='manifest-pruebas.json';",
                  f"document.querySelector('link[rel=manifest]').href='{CARPETA}manifest.json';")
    h = sustituir(h, "content='PRUEBAS';document.title='PRUEBAS · Mi Mundo de Juegos'",
                  "content='PRUEBA CONJUNTA';document.title='PRUEBA CONJUNTA · Mi Mundo de Juegos'")
    h = sustituir(h, "if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});",
                  "/* copia aislada conjunta: no se registra ningún service worker (necesita conexión) */")
    h = sustituir(h, '🧪 VERSIÓN DE PRUEBAS · datos ficticios</div>', '🧪 PRUEBA CONJUNTA · datos propios</div>')
    # Pintar (referencia) → Heladería (referencia) → logros
    h = aplicar(h, P / 'pintar-2026-10-21' / 'preparar_copia.py')
    h = aplicar(h, P / 'heladeria-2026-10-21' / 'preparar_copia.py', saltar=('GAL_VIEJO',))
    h = aplicar(h, P / 'logros-prueba-2026-10-21' / 'preparar_copia.py', saltar=('rnd(FLAV.length)', 'rnd(TOPS.length)'),
                extra={'CARPETA': CARPETA})
    # 2. pedidos de la Heladería nueva: solo lo de siempre
    h = sustituir(h, "const TOPS=[{e:'🍒',n:'una cereza'},{e:'🍓',n:'una fresa'},{e:'⭐',n:'una estrella'},{e:'🍪',n:'una galleta'},{e:'🍫',n:'chocolate'}];",
                  "const TOPS=[{e:'🍒',n:'una cereza'},{e:'🍓',n:'una fresa'},{e:'⭐',n:'una estrella'},{e:'🍪',n:'una galleta'},{e:'🍫',n:'chocolate'}];\n"
                  "const NB_FLAV_BASE=FLAV.length,NB_TOPS_BASE=TOPS.length;   /* prueba conjunta: los pedidos no usan los premios */")
    h = sustituir(h, 'rnd(FLAV.length)', 'rnd(NB_FLAV_BASE)', 3)
    h = sustituir(h, 'rnd(TOPS.length)', 'rnd(NB_TOPS_BASE)')
    # 4. foto con sabores de premio
    h = sustituir(h, 'x.fillStyle=FLAV[f].c', 'x.fillStyle=FLAV[f].foto||FLAV[f].c')
    # 5. voz con tono natural
    h = sustituir(h, "const TONES=[{i:'🙂',p:1.1,r:.95},{i:'🧒',p:1.45,r:.95},{i:'🐭',p:1.8,r:1}];",
                  "const TONES=[{i:'🙂 Natural',p:1,r:.95}];   /* prueba conjunta: tono natural siempre (sin voces agudas) */")
    h = sustituir(h, "tn=TONES[toneIdx]||TONES[1]", "tn=TONES[0]")
    h = sustituir(h, "b.className='btn'+(i===toneIdx?' sel':'');", "b.className='btn sel';b.style.fontSize='19px';")
    h = sustituir(h, "b.onclick=()=>{toneIdx=i;store.set('tone',i);renderSettings();say('¡Hola! ¿Jugamos?',true)};",
                  "b.onclick=()=>say('¡Hola! ¿Jugamos?',true);   /* no cambia la clave «tone» */")
    h = ('<!-- COPIA AISLADA CONJUNTA: Pintar + Heladería + logros (generada por preparar_copia.py desde index.html). '
         'No es el juego de Amaia. -->\n') + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    print('index.html y progreso.js generados:', len(h), len(pr))
