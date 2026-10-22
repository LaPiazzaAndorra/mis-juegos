#!/usr/bin/env python3
"""
Copia AISLADA completa (22/10/2026): la muñeca nueva con sus conjuntos y adornos aprobados + Pintar, Heladería y logros de
la prueba conjunta (461c4f2). No es el juego de Amaia; datos propios con el prefijo «com1:».

No modifica ningún archivo del juego ni de las referencias congeladas (prueba-juego-d016/-d021/-d023/-d026,
prueba-conjunta-2026-10-22, pintar-2026-10-21, heladeria-2026-10-21, logros-prueba-2026-10-21). Genera en esta carpeta:

  · index.html   ← index.html del juego con:
      1. la cabecera de la copia (base ../../../, aislamiento.js, siempre en modo de pruebas, manifiesto propio
         «PRUEBA COMPLETA», sin service worker, cinta «🧪 PRUEBA COMPLETA · datos propios»);
      2. Pintar → Heladería → logros y los ajustes 2, 4 y 5 de la prueba conjunta, con EXACTAMENTE los mismos pasos que
         ../prueba-conjunta-2026-10-22/preparar_copia.py (se importan sus funciones y se reaplican los generadores de las
         tres referencias);
      3. la muñeca nueva: catálogo «todo» y motor de esta carpeta; en «Vestir» → Adornos solo se ofrecen los adornos que
         van con el peinado y la ropa elegidos (sin cambiar de peinado solo); al elegir la ropa de aventura se pone su
         mochila y al elegir el hada, sus alas y su varita (se pueden quitar en Adornos); si al cambiar de peinado o de
         ropa un adorno deja de ir, se quita avisando.
  · progreso.js  ← el de la prueba conjunta (el del juego + logros, tareas y premios en la lista de claves).
  · logros.js    ← copia sin cambios del de la prueba conjunta.
  · avatar/motor.js        ← copia de avatar/motor.js: prefiere el juego «todo»; las capas de cuerpo, ropa y pelo salen de
                             las recetas del catálogo; ojos, párpados, pintacaras y adornos, de sus opciones.
  · avatar/catalogo-todo.js← juego de piezas «todo»: recetas (ropa × peinado × piel × color de pelo) tomadas del visor
                             aprobado (capas-del-visor.json, generado con capas-del-visor.js) y adornos con su colocación
                             para cada peinado y sus compatibilidades (también del visor).
  · avatar/arte/piezas.js  ← índice del juego + las piezas «todo».
  · avatar/arte/todo/*.webp← capas aprobadas recortadas a su contenido (WebP sin pérdida, con huella en el nombre).

Uso (desde la raíz): python3 docs/propuestas/prueba-completa-2026-10-22/preparar_copia.py
"""
import hashlib, importlib.util, io, json, re, shutil
from pathlib import Path
from PIL import Image

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
CARPETA = 'docs/propuestas/prueba-completa-2026-10-22/'
CONJ = P / 'prueba-conjunta-2026-10-22'
ID = 'todo'
B = P / 'base-aprobada-d013-2026-10-14'; T = B / 'piel-tonos'
PIELES = {'clara': None, 'dorada': 'dorado', 'morena': 'moreno', 'profunda': 'profundo'}   # id → carpeta de tono
PIEL_VISOR = {'clara': 'claro', 'dorada': 'dorado', 'morena': 'moreno', 'profunda': 'profundo'}
PELOS = ['castano', 'chocolate', 'miel', 'oscuro', 'jengibre']
OJOS = ['marron', 'azul', 'verde', 'lila']
ESTILOS = ['rizos', 'coleta', 'coleta-sin-cinta', 'coletas', 'coletas-sin-sombrero']
# ropa del juego → receta del visor; las variantes dependen de los adornos propios de esa ropa
ROPA = [
    dict(id='princesa', nombre='Vestido rosa', receta='vestido'),
    dict(id='camiseta', nombre='Camiseta', receta='camiseta'),
    dict(id='aventura', nombre='Conjunto de aventura', incluye=['mochila'],
         variantes=dict(acc=['mochila'], claves={'mochila': 'aventura', '': 'aventura-sin-mochila'})),
    dict(id='pijama', nombre='Pijama', receta='pijama'),
    dict(id='hada', nombre='Hada', incluye=['alas', 'varita'],
         variantes=dict(acc=['alas', 'varita'], claves={'alas,varita': 'hada', 'alas': 'hada-sin-varita', 'varita': 'hada-sin-alas', '': 'hada-sin-nada'})),
]
# adornos del visor (data-acc-pelo) → id y nombre en el juego
ADORNOS = {'lazo': ('lazo', 'Lazo de satén'), 'flores': ('flores', 'Pasador de flores'), 'mariposa': ('mariposa', 'Mariposa lila'),
           'diadema': ('diadema', 'Diadema de estrellas'), 'gorrito-b': ('gorrito', 'Gorrito de dormir'), 'gorra': ('gorra', 'Gorra rosa'),
           'lazos-coleteros': ('lazos-coleteros', 'Dos lazos pequeños')}
# capas que no salen de la receta: los ojos y los párpados (de su opción), el pintacaras y los adornos
NO_RECETA = re.compile(r'^(abiertos|cerrados|pintacaras|corona|acc-.*|pein-.*)$')
RENOMBRE = {'abiertos': 'ojos', 'cerrados': 'ojosCerrados'}   # nombres que el motor usa para parpadear


def sustituir(texto, viejo, nuevo, veces=1):
    n = texto.count(viejo)
    assert n == veces, f'esperado {veces} vez/veces y encontrado {n}: {viejo[:80]!r}'
    return texto.replace(viejo, nuevo)


def cargar(ruta, nombre):
    spec = importlib.util.spec_from_file_location(nombre, ruta)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    return mod


CJ = cargar(CONJ / 'preparar_copia.py', 'prueba_conjunta')   # solo define funciones y constantes


# ======================================================================================================================
# 1. Pintar + Heladería + logros: los mismos pasos que la prueba conjunta
# ======================================================================================================================
def juego_conjunto(carpeta, titulo, cinta):
    """index.html y progreso.js de la prueba conjunta, con la carpeta, el título y la cinta indicados."""
    pr = (RAIZ / 'progreso.js').read_text(encoding='utf-8')
    pr = sustituir(pr, "  const CLAVES = ['stars', 'gal', 'sound', 'voice', 'tone', 'iceServed', 'iceCoins', 'scKey', 'mm_hab', 'avatar', 'avatar_draft', 'doll'];",
                   "  const CLAVES = ['stars', 'gal', 'sound', 'voice', 'tone', 'iceServed', 'iceCoins', 'scKey', 'mm_hab', 'avatar', 'avatar_draft', 'doll',\n"
                   "    'logros', 'tareas', 'premios'];   // COPIA de la prueba conjunta: solo se añaden estas tres claves")
    pr = '/* COPIA para la prueba conjunta (generada por preparar_copia.py desde progreso.js): solo cambia la lista CLAVES. */\n' + pr
    h = (RAIZ / 'index.html').read_text(encoding='utf-8')
    h = sustituir(h, '<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="../../../">\n'
                  f'<script src="{carpeta}aislamiento.js"></script>')
    h = sustituir(h, "window.MODO_PRUEBAS=['raw.githack.com','rawcdn.githack.com'].includes(location.hostname)||\n"
                     "  (['localhost','127.0.0.1'].includes(location.hostname)&&/[?&]pruebas\\b/.test(location.search));",
                  "window.MODO_PRUEBAS=true; /* copia aislada conjunta: siempre en modo de pruebas */")
    h = sustituir(h, "document.querySelector('link[rel=manifest]').href='manifest-pruebas.json';",
                  f"document.querySelector('link[rel=manifest]').href='{carpeta}manifest.json';")
    h = sustituir(h, "content='PRUEBAS';document.title='PRUEBAS · Mi Mundo de Juegos'",
                  f"content='{titulo}';document.title='{titulo} · Mi Mundo de Juegos'")
    h = sustituir(h, "if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});",
                  "/* copia aislada conjunta: no se registra ningún service worker (necesita conexión) */")
    h = sustituir(h, '🧪 VERSIÓN DE PRUEBAS · datos ficticios</div>', f'🧪 {cinta} · datos propios</div>')
    h = CJ.aplicar(h, P / 'pintar-2026-10-21' / 'preparar_copia.py')
    h = CJ.aplicar(h, P / 'heladeria-2026-10-21' / 'preparar_copia.py', saltar=('GAL_VIEJO',))
    h = CJ.aplicar(h, P / 'logros-prueba-2026-10-21' / 'preparar_copia.py', saltar=('rnd(FLAV.length)', 'rnd(TOPS.length)'), extra={'CARPETA': carpeta})
    h = sustituir(h, "const TOPS=[{e:'🍒',n:'una cereza'},{e:'🍓',n:'una fresa'},{e:'⭐',n:'una estrella'},{e:'🍪',n:'una galleta'},{e:'🍫',n:'chocolate'}];",
                  "const TOPS=[{e:'🍒',n:'una cereza'},{e:'🍓',n:'una fresa'},{e:'⭐',n:'una estrella'},{e:'🍪',n:'una galleta'},{e:'🍫',n:'chocolate'}];\n"
                  "const NB_FLAV_BASE=FLAV.length,NB_TOPS_BASE=TOPS.length;   /* prueba conjunta: los pedidos no usan los premios */")
    h = sustituir(h, 'rnd(FLAV.length)', 'rnd(NB_FLAV_BASE)', 3)
    h = sustituir(h, 'rnd(TOPS.length)', 'rnd(NB_TOPS_BASE)')
    h = sustituir(h, 'x.fillStyle=FLAV[f].c', 'x.fillStyle=FLAV[f].foto||FLAV[f].c')
    h = sustituir(h, "const TONES=[{i:'🙂',p:1.1,r:.95},{i:'🧒',p:1.45,r:.95},{i:'🐭',p:1.8,r:1}];",
                  "const TONES=[{i:'🙂 Natural',p:1,r:.95}];   /* prueba conjunta: tono natural siempre (sin voces agudas) */")
    h = sustituir(h, "tn=TONES[toneIdx]||TONES[1]", "tn=TONES[0]")
    h = sustituir(h, "b.className='btn'+(i===toneIdx?' sel':'');", "b.className='btn sel';b.style.fontSize='19px';")
    h = sustituir(h, "b.onclick=()=>{toneIdx=i;store.set('tone',i);renderSettings();say('¡Hola! ¿Jugamos?',true)};",
                  "b.onclick=()=>say('¡Hola! ¿Jugamos?',true);   /* no cambia la clave «tone» */")
    return h, pr


# ======================================================================================================================
# 2. La muñeca: recetas del visor, piezas y catálogo
# ======================================================================================================================
def ruta_visor(s):
    return RAIZ / s


def piezas_opcion():
    """Piezas que no salen de las recetas: ojos abiertos de cada color y piel, párpados de cada piel y pintacaras."""
    p = {f'{ID}-pintacaras': B / 'pintacaras' / 'capa-pintacaras-estrellas.png'}
    for piel, t in PIELES.items():
        p[f'{ID}-cerrados-{piel}'] = T / t / 'ojos-cerrados.png' if t else B / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png'
        for o in OJOS:
            p[f'{ID}-ojos-{o}-{piel}'] = (T / t / f'ojos-abiertos-{o}.png' if t else
                                         B / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png' if o == 'marron' else B / 'ojos-colores' / f'capa-ojos-abiertos-{o}.png')
    return p


def nombre_pieza(ruta, usados):
    """Nombre legible y único para una capa: todo-<carpeta>-<archivo> (sin extensión)."""
    partes = Path(ruta).with_suffix('').parts
    for n in range(2, len(partes) + 1):
        base = ID + '-' + re.sub(r'[^a-z0-9]+', '-', '-'.join(partes[-n:]).lower()).strip('-')
        if usados.get(base, ruta) == ruta:
            usados[base] = ruta
            return base
    raise ValueError(ruta)


def catalogo_y_piezas(ov):
    orden = [RENOMBRE.get(i[2:], i[2:]) for i in ov['orden']]
    usados, piezas = {}, {}                                       # nombre → ruta (relativa a la raíz)

    def pieza(ruta):
        n = nombre_pieza(ruta, usados); piezas[n] = ruta
        return n
    # recetas: ropa × peinado × piel × color de pelo → [[capa, pieza], …] en el orden del visor
    recetas = {}
    for clave, capas in ov['combos'].items():
        lista = []
        for c in capas:
            i, s = c.split('=', 1); k = RENOMBRE.get(i[2:], i[2:])
            if NO_RECETA.match(i[2:]):
                continue
            lista.append([orden.index(k), pieza(s)])
        recetas[clave] = lista
    # ojos de la receta (marrones) = los de la opción: comprobación
    opc = piezas_opcion()
    for clave, capas in ov['combos'].items():
        piel = clave.split('|')[2]
        ab = [c.split('=', 1)[1] for c in capas if c.startswith('c-abiertos=')]
        assert ab == [str(opc[f'{ID}-ojos-marron-{piel}'].relative_to(RAIZ))], (clave, ab)
    for n, r in opc.items():
        piezas[n] = str(r.relative_to(RAIZ)); usados[n] = piezas[n]
    # adornos: lo que añade cada uno a cada peinado (con el vestido; no depende de la piel) y sus compatibilidades
    base = {(e, pi): set(v['capas']) for k, v in ov['adornos'].items() for e, pi, cor, a in [k.split('|')] if cor == 'no' and a == 'ninguno'}
    acc = {}                                                      # id → {estilo: {capa: pieza}}
    excluye_corona = set()
    for k, v in ov['adornos'].items():
        e, pi, cor, a = k.split('|'); extra = sorted(set(v['capas']) - base[(e, pi)]); pz = v['puesto']
        if cor == 'no' and a != 'ninguno' and pz['acc'] == a:
            capas = {RENOMBRE.get(c.split('=')[0][2:], c.split('=')[0][2:]): pieza(c.split('=', 1)[1]) for c in extra}
            prev = acc.setdefault(ADORNOS[a][0], {}).setdefault(e, capas); assert prev == capas, (k, prev, capas)
        if cor == 'si' and a == 'ninguno' and pz['corona']:
            capas = {RENOMBRE.get(c.split('=')[0][2:], c.split('=')[0][2:]): pieza(c.split('=', 1)[1]) for c in extra}
            prev = acc.setdefault('corona', {}).setdefault(e, capas); assert prev == capas, (k, prev, capas)
    # la corona no va con un adorno si, con un peinado con el que van los dos, al elegir el adorno se quita la corona
    for k, v in ov['adornos'].items():
        e, pi, cor, a = k.split('|'); pz = v['puesto']
        if cor == 'si' and a != 'ninguno' and pz['acc'] == a and not pz['corona'] and e in acc['corona']:
            excluye_corona.add(ADORNOS[a][0])
    # juntos (corona y otro adorno), el visor muestra exactamente las dos colocaciones; los adornos son los mismos con la
    # piel clara y con la dorada (comprobado arriba)
    for k, v in ov['adornos'].items():
        e, pi, cor, a = k.split('|'); pz = v['puesto']
        if cor == 'si' and a != 'ninguno' and pz['acc'] == a and pz['corona']:
            extra = {c.split('=', 1)[1] for c in set(v['capas']) - base[(e, pi)]}
            assert extra == {piezas[n] for x in ('corona', ADORNOS[a][0]) for n in acc[x][e].values()}, k
    accesorios = [dict(id='corona', nombre='Corona', excluye=sorted(excluye_corona), capasPor=acc['corona'])]
    for _, (aid, nom) in ADORNOS.items():
        accesorios.append(dict(id=aid, nombre=nom, grupo='pelo', capasPor=acc[aid]))
    accesorios += [dict(id='pintacaras', nombre='Estrellas y brillo', capas={'pintacaras': f'{ID}-pintacaras'}),
                   dict(id='mochila', nombre='Mochila', ropas=['aventura'], vista='cuerpo'),
                   dict(id='alas', nombre='Alas de hada', ropas=['hada'], vista='full'),
                   dict(id='varita', nombre='Varita', ropas=['hada'], vista='cuerpo')]
    return orden, recetas, accesorios, piezas


def webp(piezas):
    carpeta = AQUI / 'avatar' / 'arte' / ID; carpeta.mkdir(parents=True, exist_ok=True)
    # se reutiliza la pieza ya hecha si tiene exactamente los mismos píxeles (codificar sin pérdida es lento)
    previas = {f.name.rsplit('.', 2)[0]: f for f in carpeta.glob('*.webp')}
    out, hechos, escritas = {}, {}, set()
    for nombre, rel in sorted(piezas.items()):
        if rel not in hechos:
            im = Image.open(RAIZ / rel).convert('RGBA'); assert im.size == (948, 1659), (nombre, im.size)
            x0, y0, x1, y1 = im.getchannel('A').getbbox(); rec = im.crop((x0, y0, x1, y1))
            pre = previas.get(nombre)
            if pre and Image.open(pre).convert('RGBA').tobytes() == rec.tobytes():
                datos = pre.read_bytes()
            else:
                buf = io.BytesIO(); rec.save(buf, 'WEBP', lossless=True, quality=100, method=6, exact=True); datos = buf.getvalue()
            h = hashlib.sha256(datos).hexdigest()[:8]; f = f'{nombre}.{h}.webp'
            (carpeta / f).write_bytes(datos); escritas.add(f)
            hechos[rel] = dict(x=x0, y=y0, w=x1 - x0, h=y1 - y0, url=CARPETA + f'avatar/arte/{ID}/{f}', kb=round(len(datos) / 1024, 1))
        d = hechos[rel]
        out[nombre] = dict(x=d['x'], y=d['y'], w=d['w'], h=d['h'], v=dict(s=d['url'], m=d['url']), kb=d['kb'], fuente=rel)
    for f in carpeta.glob('*.webp'):                              # las que ya no se usan
        if f.name not in escritas:
            f.unlink()
    return out, hechos


CATALOGO = """/* =====================================================================
   Prueba completa (22/10/2026) · juego de piezas «todo» (generado por
   preparar_copia.py; no editar a mano)
   ---------------------------------------------------------------------
   La muñeca nueva con todo lo aprobado, a 948 × 1659 (la resolución de
   2000 × 3500 sigue pendiente):
     · 4 tonos de piel, 5 colores de pelo (cejas a juego), 4 colores de ojos;
     · peinados: melena suelta, coleta con cinta y sin cinta, dos coletas con
       sombrero y sin sombrero;
     · ropa: vestido rosa (con sus zapatos), camiseta, conjunto de aventura
       (con mochila o sin ella), pijama y hada (alas y varita con su mano de
       agarre, que se pueden quitar: sin varita vuelve la mano original);
     · adornos: corona, lazo, flores, mariposa, diadema, gorrito, gorra, dos
       lazos pequeños y pintacaras, cada uno con la colocación aprobada para
       cada peinado (solo con los peinados con los que va).
   «recetas»: para cada ropa × peinado × piel × color de pelo, las capas de
   cuerpo, ropa y pelo que se ven en el visor aprobado, en su orden
   (capas-del-visor.json). Los ojos, los párpados, el pintacaras y los adornos
   salen de sus opciones. Se añade a los catálogos del juego sin modificarlos.
   ===================================================================== */
(function () {
  'use strict';
  const D = __DATOS__;
  const pelo = (id, nombre, light, base, shade) => ({ id, nombre, c: { light, base, shade } });
  window.AV_MUNECAS = window.AV_MUNECAS || {};
  window.AV_MUNECAS.todo = {
    version: 1,
    tipo: 'png',
    nombre: 'Muñeca nueva con todo lo aprobado (prueba completa, 948 × 1659)',
    lienzo: { w: 948, h: 1659 },
    anclas: { eje: 479, suelo: 1562, hombroIzq: [380, 700], hombroDer: [578, 700], ojoIzq: [391, 443], ojoDer: [566, 443], ojos: 443 },
    sombra: [205, 28],
    capas: D.capas,
    recetas: D.recetas,
    vistas: { full: '0 20 948 1590', cabeza: '149 20 660 660', ojos: '295 370 367 147', cuerpo: '79 560 800 1080', pies: '279 1300 400 300' },
    piel: [['clara', 'Claro'], ['dorada', 'Dorado'], ['morena', 'Moreno'], ['profunda', 'Profundo']]
      .map(([id, nombre]) => ({ id, nombre, capas: { ojosCerrados: 'todo-cerrados-{piel}' } })),
    ojos: {
      colores: [['marron', 'Marrones'], ['azul', 'Azules'], ['verde', 'Verdes'], ['lila', 'Lilas']]
        .map(([id, nombre]) => ({ id, nombre, capas: { ojos: 'todo-ojos-{ojos}-{piel}' } })),
      formas: [{ id: 'redondos', nombre: 'Redondos' }],
    },
    pelo: {
      estilos: [['rizos', 'Melena suelta'], ['coleta', 'Coleta con cinta'], ['coleta-sin-cinta', 'Coleta sin cinta'],
        ['coletas', 'Dos coletas con sombrero'], ['coletas-sin-sombrero', 'Dos coletas sin sombrero']].map(([id, nombre]) => ({ id, nombre, capas: {} })),
      colores: [
        pelo('castano', 'Castaño', '#aa6038', '#6b2f14', '#3c1405'),
        pelo('chocolate', 'Castaño chocolate', '#996344', '#592d14', '#2b1106'),
        pelo('miel', 'Rubio miel', '#e4aa6f', '#b3692e', '#783507'),
        pelo('oscuro', 'Castaño oscuro', '#7a4e37', '#412011', '#1c0b06'),
        pelo('jengibre', 'Pelirrojo jengibre', '#e07d44', '#a63c0e', '#691904'),
      ],
    },
    ropa: D.ropa,
    zapatos: [{ id: 'princesa', nombre: 'Zapatos de princesa', capas: {} }],
    accesorios: D.accesorios,
    defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: ['corona'] },
  };
})();
"""

# --- motor: recetas, compatibilidades por peinado y por ropa ------------------------------------------------------------
MOTOR_COMPAT = """    s.accesorios = compatibles(Array.isArray(s.accesorios) ? s.accesorios.filter(a => accIds.includes(a)) : [], s.pelo.estilo, s.ropa);"""
FUNC_COMPAT = """  /* ---------- compatibilidades de los adornos (copia «prueba completa») ----------
     Del catálogo: «capasPor» (peinados con los que va, cada uno con su colocación; con otro, se quita), «ropas» (ropa con
     la que va: la mochila, las alas y la varita), «grupo» (de uno en uno) y «excluye» (no van juntos). Si dos chocan,
     queda el último que se ha elegido (el último de la lista). */
  const ACC = id => (CAT.accesorios || []).find(o => o.id === id) || { id };
  function acepta(id, estilo, ropa) {
    const a = ACC(id);
    return !(a.capasPor && !a.capasPor[estilo]) && !(a.ropas && !a.ropas.includes(ropa));
  }
  function compatibles(lista, estilo, ropa) {
    const choca = (a, b) => (a.grupo && a.grupo === b.grupo) || (a.excluye || []).includes(b.id) || (b.excluye || []).includes(a.id);
    const quedan = [];
    for (let i = lista.length - 1; i >= 0; i--) {
      const a = ACC(lista[i]);
      if (!acepta(a.id, estilo, ropa)) continue;
      if (quedan.includes(a.id) || quedan.some(b => choca(a, ACC(b)))) continue;
      quedan.unshift(a.id);
    }
    return quedan;
  }
  // receta de cuerpo, ropa y pelo (la del visor aprobado) para esta ropa (y sus adornos propios), peinado, piel y pelo
  function receta(s) {
    const r = byId(CAT.ropa, s.ropa), v = r.variantes;
    const k = v ? v.claves[v.acc.filter(a => s.accesorios.includes(a)).join(',')] : r.receta;
    return CAT.recetas[[k, s.pelo.estilo, s.piel, s.pelo.color].join('|')] || [];
  }

  /* ---------- estado ---------- */"""
PIEZAS_VIEJO = """  function piezasDe(s) {
    const ids = { piel: s.piel, ojos: s.ojos.color, pelo: s.pelo.color };
    const opts = [byId(CAT.piel, s.piel), byId(CAT.ojos.colores, s.ojos.color), byId(CAT.pelo.estilos, s.pelo.estilo), byId(CAT.ropa, s.ropa),
      (CAT.zapatos || []).find(o => o.id === s.zapatos)].filter(Boolean)
      .concat(s.accesorios.map(a => (CAT.accesorios || []).find(o => o.id === a)).filter(Boolean));
    const capas = {};
    opts.forEach(o => Object.entries(o.capas || {}).forEach(([k, t]) => { capas[k] = fill(t, ids); }));
    return CAT.capas.map(k => ({ k, id: capas[k], p: PZ[capas[k]] })).filter(c => c.id && c.p);
  }"""
PIEZAS_NUEVO = """  function piezasDe(s) {
    // copia «prueba completa»: cuerpo, ropa y pelo de la receta; ojos, párpados, pintacaras y adornos de sus opciones
    const ids = { piel: s.piel, ojos: s.ojos.color, pelo: s.pelo.color }, capas = {};
    if (CAT.recetas) receta(s).forEach(([k, p]) => { capas[CAT.capas[k]] = p; });
    const opts = [byId(CAT.piel, s.piel), byId(CAT.ojos.colores, s.ojos.color)].concat(CAT.recetas ? [] : [byId(CAT.pelo.estilos, s.pelo.estilo), byId(CAT.ropa, s.ropa),
      (CAT.zapatos || []).find(o => o.id === s.zapatos)].filter(Boolean))
      .concat(s.accesorios.map(a => (CAT.accesorios || []).find(o => o.id === a)).filter(Boolean));
    opts.forEach(o => Object.entries((o.capasPor && o.capasPor[s.pelo.estilo]) || o.capas || {}).forEach(([k, t]) => { capas[k] = fill(t, ids); }));
    return CAT.capas.map(k => ({ k, id: capas[k], p: PZ[capas[k]] })).filter(c => c.id && c.p);
  }"""

# --- «Vestir»: adornos que van con el peinado y la ropa; la ropa pone sus adornos; avisos al quitar ---------------------
CAMBIO_VIEJO = """function avChange(patch){
  avSt=avWith(patch);Avatar.guardarBorrador(avSt);avCtl.set(avSt);avCtl.reaccionar();"""
CAMBIO_NUEVO = """function avChange(patch){
  /* prueba completa: si un adorno deja de ir con el peinado o la ropa, se quita avisando (los de la ropa se van con ella) */
  const antes=patch.accesorios||avSt.accesorios,ropaAntes=avSt.ropa;
  avSt=avWith(patch);Avatar.guardarBorrador(avSt);avCtl.set(avSt);avCtl.reaccionar();
  const qu=antes.filter(a=>!avSt.accesorios.includes(a)).map(a=>(AVC.accesorios||[]).find(o=>o.id===a)).filter(o=>o&&!(o.ropas&&avSt.ropa!==ropaAntes));
  if(qu.length)toast('Se ha quitado: '+qu.map(o=>o.nombre).join(', '));"""
ROPA_VIEJO = """  if(dTab==='ropa')AVC.ropa.forEach(o=>tile(avThumb(avWith({ropa:o.id}),'cuerpo')+o.nombre,avSt.ropa===o.id,()=>avChange({ropa:o.id}),'tall'));"""
ROPA_NUEVO = """  /* prueba completa: al elegir una ropa se ponen sus adornos (la mochila; las alas y la varita) */
  if(dTab==='ropa')AVC.ropa.forEach(o=>{const p=avSt.ropa===o.id?{ropa:o.id}:{ropa:o.id,accesorios:avSt.accesorios.filter(a=>!(o.incluye||[]).includes(a)).concat(o.incluye||[])};
    tile(avThumb(avWith(p),'cuerpo')+o.nombre,avSt.ropa===o.id,()=>avChange(p),'tall')});"""
ACC_VIEJO = """  if(dTab==='acc')(AVC.accesorios||[]).forEach(o=>{const on=avSt.accesorios.includes(o.id),next=on?avSt.accesorios.filter(a=>a!==o.id):avSt.accesorios.concat(o.id);
    tile(avThumb(avWith({accesorios:avSt.accesorios.concat(on?[]:o.id)}),'cabeza')+o.nombre,on,()=>avChange({accesorios:next}))});"""
ACC_NUEVO = """  /* prueba completa: solo los adornos que van con el peinado y la ropa elegidos (no se cambia de peinado solo) */
  if(dTab==='acc')(AVC.accesorios||[]).filter(o=>Avatar.acepta(o.id,avSt)).forEach(o=>{const on=avSt.accesorios.includes(o.id),next=on?avSt.accesorios.filter(a=>a!==o.id):avSt.accesorios.concat(o.id);
    tile(avThumb(avWith({accesorios:avSt.accesorios.concat(on?[]:o.id)}),o.vista||'cabeza')+o.nombre,on,()=>avChange({accesorios:next}))});"""


if __name__ == '__main__':
    ov = json.loads((AQUI / 'capas-del-visor.json').read_text(encoding='utf-8'))
    assert not ov['errores'] and len(ov['combos']) == 9 * 5 * 4 * 5, 'capas-del-visor.json incompleto'
    # ---------- piezas y catálogo ----------
    orden, recetas, accesorios, piezas = catalogo_y_piezas(ov)
    nuevas, archivos = webp(piezas)
    ropa = [{k: v for k, v in r.items()} for r in ROPA]
    for r in ropa:
        r['capas'] = {}
    datos = dict(capas=orden, recetas=recetas, ropa=ropa, accesorios=accesorios)
    (AQUI / 'avatar').mkdir(exist_ok=True)
    (AQUI / 'avatar' / f'catalogo-{ID}.js').write_text(CATALOGO.replace('__DATOS__', json.dumps(datos, ensure_ascii=False, separators=(',', ':'))), encoding='utf-8')
    t = (RAIZ / 'avatar' / 'arte' / 'piezas.js').read_text(encoding='utf-8')
    j = json.loads(t[t.index('{'):t.rindex('}') + 1]); j['piezas'].update(nuevas)
    (AQUI / 'avatar' / 'arte' / 'piezas.js').write_text(f'/* Generado por {CARPETA}preparar_copia.py — no editar a mano */\n'
                                                        'self.AV_PIEZAS = ' + json.dumps(j, ensure_ascii=False, indent=0) + ';\n', encoding='utf-8')
    # ---------- motor ----------
    m = (RAIZ / 'avatar' / 'motor.js').read_text(encoding='utf-8')
    m = sustituir(m, "['premium', 'prueba'].find(k => listo(SETS[k]))", f"['{ID}', 'premium', 'prueba'].find(k => listo(SETS[k]))")
    m = sustituir(m, "pie: [A.eje, A.suelo], sombra: [430, 60] };", "pie: [A.eje, A.suelo], sombra: CAT.sombra || [430, 60] };")
    m = sustituir(m, "    s.accesorios = Array.isArray(s.accesorios) ? s.accesorios.filter(a => accIds.includes(a)) : [];", MOTOR_COMPAT)
    m = sustituir(m, "  /* ---------- estado ---------- */", FUNC_COMPAT)
    m = sustituir(m, PIEZAS_VIEJO, PIEZAS_NUEVO)
    m = sustituir(m, "    VERSION, MODO, JUEGO, CAT, svg, mount, foto, precargar, normalizar,",
                  "    VERSION, MODO, JUEGO, CAT, svg, mount, foto, precargar, normalizar, piezasDe: e => piezasDe(normalizar(e)),\n"
                  "    acepta: (id, e) => acepta(id, e.pelo.estilo, e.ropa),")
    m = f'/* COPIA para la prueba completa (generada por {CARPETA}preparar_copia.py desde avatar/motor.js) */\n' + m
    (AQUI / 'avatar' / 'motor.js').write_text(m, encoding='utf-8')
    # ---------- index.html y progreso.js ----------
    h, pr = juego_conjunto(CARPETA, 'PRUEBA COMPLETA', 'PRUEBA COMPLETA')
    h = sustituir(h, '<script src="avatar/arte/piezas.js"></script>', f'<script src="{CARPETA}avatar/arte/piezas.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="avatar/catalogo-muneca.js"></script>\n<script src="{CARPETA}avatar/catalogo-{ID}.js"></script>')
    h = sustituir(h, '<script src="avatar/motor.js"></script>', f'<script src="{CARPETA}avatar/motor.js"></script>')
    h = sustituir(h, CAMBIO_VIEJO, CAMBIO_NUEVO)
    h = sustituir(h, ROPA_VIEJO, ROPA_NUEVO)
    h = sustituir(h, ACC_VIEJO, ACC_NUEVO)
    h = ('<!-- COPIA AISLADA COMPLETA: muñeca nueva con sus conjuntos y adornos aprobados + Pintar, Heladería y logros '
         '(generada por preparar_copia.py desde index.html). No es el juego de Amaia. -->\n') + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    (AQUI / 'progreso.js').write_text(pr, encoding='utf-8')
    shutil.copyfile(CONJ / 'logros.js', AQUI / 'logros.js')
    # ---------- comprobación: con la carpeta de la prueba conjunta, se obtiene exactamente su index.html y su progreso.js
    h2, pr2 = juego_conjunto('docs/propuestas/prueba-conjunta-2026-10-22/', 'PRUEBA CONJUNTA', 'PRUEBA CONJUNTA')
    h2 = ('<!-- COPIA AISLADA CONJUNTA: Pintar + Heladería + logros (generada por preparar_copia.py desde index.html). '
          'No es el juego de Amaia. -->\n') + h2
    igual = h2 == (CONJ / 'index.html').read_text(encoding='utf-8') and pr2 == (CONJ / 'progreso.js').read_text(encoding='utf-8')
    assert igual, 'los pasos de la prueba conjunta ya no dan su index.html'
    kb = sum(d['kb'] for d in archivos.values())
    print(json.dumps(dict(recetas=len(recetas), piezas=len(nuevas), archivos=len(archivos), mb=round(kb / 1024, 1),
                          conjunta_reproducida=igual, adornos=[a['id'] for a in accesorios]), ensure_ascii=False))
