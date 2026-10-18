#!/usr/bin/env python3
"""
Copia AISLADA del juego (versión de pruebas) con la muñeca nueva, sus tres peinados aprobados y los accesorios aprobados
(D-024, D-025, D-026), además de lo de la prueba D-023 (tonos de piel, colores de pelo con cejas a juego, colores de
ojos, pintacaras, vestido, zapatos y corona), a 948 × 1659. Es una copia NUEVA: las pruebas congeladas
../prueba-juego-d016/ (D-019), ../prueba-juego-d021/ y ../prueba-juego-d023/ no se tocan.

No modifica ningún archivo del juego: genera, dentro de esta carpeta, una copia de index.html y de los archivos del
avatar que necesitan cambios, y usa los demás archivos del juego tal cual (con la ruta ../../../).

  · index.html   ← copia de ../../../index.html con estos cambios (comprobados uno a uno):
      1. «aislamiento.js» antes que nada: datos propios («d026:» en localStorage, «d026-» en IndexedDB). No lee, cambia
         ni migra las claves del juego ni las de las pruebas congeladas. Si no se puede activar, la copia se detiene.
      2. Siempre en modo de pruebas (cinta y ajustes de pruebas), con su propio manifiesto («PRUEBA D-026»).
      3. Rutas: los archivos sin cambios se cargan del juego (../../../); los cambiados, de esta carpeta.
      4. Sin service worker: la copia necesita conexión.
      5. «Vestir» → Adornos: un adorno colocado para la melena, elegido con otro peinado, vuelve a la melena (como en
         el visor).
  · avatar/motor.js         ← copia de ../../../avatar/motor.js: prefiere el juego de piezas «d026», toma la sombra del
                              catálogo y aplica las compatibilidades de los adornos (ver catalogo-d026.js).
  · avatar/catalogo-d026.js ← juego de piezas «d026» (se añade a los catálogos del juego sin tocarlos).
  · avatar/arte/piezas.js   ← índice del juego (rutas con ../../../) + las piezas d026.
  · avatar/arte/d026/*.webp ← las capas aprobadas recortadas a su contenido (WebP sin pérdida, huella en el nombre).

Uso (desde la raíz): python3 docs/propuestas/prueba-juego-d026/preparar_prueba.py
"""
import hashlib, io, json
from pathlib import Path
from PIL import Image

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
R = '../../../'
ID = 'd026'
B = P / 'base-aprobada-d013-2026-10-14'; VAR = B / 'pelo-borrador-d012' / 'revision-localizada' / 'variante-experimental'
PIELES = {'clara': None, 'dorada': 'dorado', 'morena': 'moreno', 'profunda': 'profundo'}   # id → carpeta de tono
PELOS = ['castano', 'chocolate', 'miel', 'oscuro', 'jengibre']
OJOS = ['marron', 'azul', 'verde', 'lila']
T = B / 'piel-tonos'; PC = B / 'pelo-colores'; CJ = B / 'cejas-colores'
CO = P / 'peinado-coleta-2026-10-16' / 'capas'; CS = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas'; ACC = P / 'accesorios-2026-10-16'


def lista_piezas():
    """Todas las piezas de la copia (nombre → archivo aprobado)."""
    p = {f'{ID}-vestido': P / 'vestido-rosa-2026-10-15' / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png',
         f'{ID}-zapatos': P / 'zapatos-rosa-2026-10-15' / 'montaje' / 'zapatos-candidatos.png',
         f'{ID}-corona': P / 'corona-2026-10-15' / 'montaje' / 'corona-candidata.png',
         f'{ID}-pintacaras': B / 'pintacaras' / 'capa-pintacaras-estrellas.png',
         # accesorios aprobados (D-024): el gorrito es el B, el elegido
         f'{ID}-lazo': ACC / 'capas' / 'capa-lazo.png', f'{ID}-flores': ACC / 'capas' / 'capa-flores.png',
         f'{ID}-mariposa': ACC / 'capas' / 'capa-mariposa.png', f'{ID}-diadema': ACC / 'diadema' / 'capa-diadema.png',
         f'{ID}-gorrito': ACC / 'gorrito' / 'capa-gorrito-b.png', f'{ID}-gorra': ACC / 'gorra' / 'capa-gorra.png',
         # coleta (D-025) y dos coletas (D-026)
         f'{ID}-cinta-coleta': CO / 'cinta-coleta.png', f'{ID}-coleteros': CS / 'coleteros.png', f'{ID}-sombrero': CS / 'sombrero-aventura.png'}
    for pelo in PELOS:
        p[f'{ID}-pelo-detras-{pelo}'] = VAR / 'pelo-variante-sin-mechon-detras.png' if pelo == 'castano' else PC / f'pelo-detras-{pelo}.png'
        p[f'{ID}-pelo-delante-{pelo}'] = (VAR / 'redistribucion-hombros' / 'mechones-completos-chatgpt' / 'pelo-delante-mechones-completos.png'
                                          if pelo == 'castano' else PC / f'pelo-delante-{pelo}.png')
        for v in ('con', 'sin'):
            for parte in ('detras', 'delante'):
                p[f'{ID}-coleta-{v}-{parte}-{pelo}'] = CO / 'variantes' / f'pelo-coleta-{v}-{parte}-{pelo}.png'
                p[f'{ID}-coletas-{v}-{parte}-{pelo}'] = CS / 'variantes' / f'pelo-coletas-{v}-sombrero-{parte}-{pelo}.png'
    for piel, t in PIELES.items():
        p[f'{ID}-base-{piel}'] = T / t / 'base-sin-ojos.png' if t else B / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'
        p[f'{ID}-cerrados-{piel}'] = T / t / 'ojos-cerrados.png' if t else B / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png'
        p[f'{ID}-manos-{piel}'] = T / t / 'manos-delante.png' if t else P / 'vestido-rosa-2026-10-15' / 'montaje' / 'brazos-delante-copiados-de-la-base.png'
        for parte in ('detras', 'delante'):
            p[f'{ID}-orejas-coleta-{parte}-{piel}'] = (CO / 'pieles' / t if t else CO / 'variantes') / f'orejas-coleta-{parte}.png'
        for o in OJOS:
            p[f'{ID}-ojos-{o}-{piel}'] = (T / t / f'ojos-abiertos-{o}.png' if t else
                                         B / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png' if o == 'marron' else B / 'ojos-colores' / f'capa-ojos-abiertos-{o}.png')
        for pelo in PELOS[1:]:                       # el castaño usa las cejas de la base (sin capa)
            p[f'{ID}-cejas-{pelo}-{piel}'] = T / t / f'cejas-{pelo}.png' if t else CJ / f'cejas-{pelo}.png'
        if t:                                        # la piel clara no lleva capas de bordes
            for pelo in PELOS:
                p[f'{ID}-bordes-pelo-{pelo}-{piel}'] = T / t / f'bordes-pelo-{pelo}.png'
                for v in ('con', 'sin'):
                    p[f'{ID}-bordes-coleta-{v}-{pelo}-{piel}'] = CO / 'pieles' / t / f'bordes-coleta-{v}-{pelo}.png'
                    p[f'{ID}-bordes-coletas-{v}-{pelo}-{piel}'] = CS / 'pieles' / t / f'bordes-coletas-{v}-{pelo}.png'
            p[f'{ID}-bordes-vestido-{piel}'] = T / t / 'bordes-vestido.png'
            p[f'{ID}-bordes-zapatos-{piel}'] = T / t / 'bordes-zapatos.png'
    return p


PIEZAS = lista_piezas()


def sustituir(texto, viejo, nuevo, veces=1):
    assert texto.count(viejo) == veces, f'no encontrado {veces} vez/veces: {viejo[:70]!r}'
    return texto.replace(viejo, nuevo)


def piezas():
    carpeta = AQUI / 'avatar' / 'arte' / ID; carpeta.mkdir(parents=True, exist_ok=True)
    for viejo in carpeta.glob('*.webp'):
        viejo.unlink()
    out = {}
    for nombre, ruta in PIEZAS.items():
        im = Image.open(ruta).convert('RGBA'); assert im.size == (948, 1659), (nombre, im.size)
        x0, y0, x1, y1 = im.getchannel('A').getbbox()
        buf = io.BytesIO(); im.crop((x0, y0, x1, y1)).save(buf, 'WEBP', lossless=True, quality=100, method=6, exact=True)
        h = hashlib.sha256(buf.getvalue()).hexdigest()[:8]; f = f'{nombre}.{h}.webp'
        (carpeta / f).write_bytes(buf.getvalue())
        url = f'avatar/arte/{ID}/{f}'
        out[nombre] = dict(x=x0, y=y0, w=x1 - x0, h=y1 - y0, v=dict(s=url, m=url), kb=round(len(buf.getvalue()) / 1024, 1),
                           fuente=str(ruta.relative_to(RAIZ)))
    return out


MOTOR_COMPAT = """    s.accesorios = compatibles(Array.isArray(s.accesorios) ? s.accesorios.filter(a => accIds.includes(a)) : [], s.pelo.estilo);"""
FUNC_COMPAT = """  /* ---------- compatibilidades de los adornos (copia D-026) ----------
     Del catálogo: «estilos» (peinados con los que va; con otro, se quita), «grupo» (de uno en uno) y «excluye» (no van
     juntos). Si dos chocan, queda el último que se ha elegido (el último de la lista). */
  function compatibles(lista, estilo) {
    const A = id => (CAT.accesorios || []).find(o => o.id === id) || { id };
    const choca = (a, b) => (a.grupo && a.grupo === b.grupo) || (a.excluye || []).includes(b.id) || (b.excluye || []).includes(a.id);
    const quedan = [];
    for (let i = lista.length - 1; i >= 0; i--) {
      const a = A(lista[i]);
      if (a.estilos && !a.estilos.includes(estilo)) continue;
      if (quedan.includes(a.id) || quedan.some(b => choca(a, A(b)))) continue;
      quedan.unshift(a.id);
    }
    return quedan;
  }

  /* ---------- estado ---------- */"""
ACC_VIEJO = """  if(dTab==='acc')(AVC.accesorios||[]).forEach(o=>{const on=avSt.accesorios.includes(o.id),next=on?avSt.accesorios.filter(a=>a!==o.id):avSt.accesorios.concat(o.id);
    tile(avThumb(avWith({accesorios:avSt.accesorios.concat(on?[]:o.id)}),'cabeza')+o.nombre,on,()=>avChange({accesorios:next}))});"""
ACC_NUEVO = """  if(dTab==='acc')(AVC.accesorios||[]).forEach(o=>{const on=avSt.accesorios.includes(o.id),next=on?avSt.accesorios.filter(a=>a!==o.id):avSt.accesorios.concat(o.id);
    /* copia D-026: un adorno colocado para la melena, elegido con otro peinado, vuelve a la melena */
    const pein=!on&&o.estilos&&!o.estilos.includes(avSt.pelo.estilo)?{pelo:{estilo:o.estilos[0]}}:{};
    tile(avThumb(avWith(Object.assign({accesorios:avSt.accesorios.concat(on?[]:o.id)},pein)),'cabeza')+o.nombre,on,()=>avChange(Object.assign({accesorios:next},pein)))});"""

if __name__ == '__main__':
    t = (RAIZ / 'avatar' / 'arte' / 'piezas.js').read_text(encoding='utf-8')
    j = json.loads(t[t.index('{'):t.rindex('}') + 1])
    for p in j['piezas'].values():
        p['v'] = {k: R + u for k, u in p['v'].items()}
    nuevas = piezas(); j['piezas'].update(nuevas)
    (AQUI / 'avatar' / 'arte' / 'piezas.js').write_text(f'/* Generado por docs/propuestas/prueba-juego-{ID}/preparar_prueba.py — no editar a mano */\n'
                                                        'self.AV_PIEZAS = ' + json.dumps(j, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')
    # --- motor: preferir d026, sombra del catálogo y compatibilidades de los adornos ------------------------------
    m = (RAIZ / 'avatar' / 'motor.js').read_text(encoding='utf-8')
    m = sustituir(m, "['premium', 'prueba'].find(k => listo(SETS[k]))", f"['{ID}', 'premium', 'prueba'].find(k => listo(SETS[k]))")
    m = sustituir(m, "pie: [A.eje, A.suelo], sombra: [430, 60] };", "pie: [A.eje, A.suelo], sombra: CAT.sombra || [430, 60] };")
    m = sustituir(m, "    s.accesorios = Array.isArray(s.accesorios) ? s.accesorios.filter(a => accIds.includes(a)) : [];", MOTOR_COMPAT)
    m = sustituir(m, "  /* ---------- estado ---------- */", FUNC_COMPAT)
    m = f'/* COPIA para la prueba aislada D-026 (generada por preparar_prueba.py desde avatar/motor.js) */\n' + m
    (AQUI / 'avatar' / 'motor.js').write_text(m, encoding='utf-8')
    # --- index.html ----------------------------------------------------------------------------------------------
    h = (RAIZ / 'index.html').read_text(encoding='utf-8')
    h = sustituir(h, '<link rel="manifest" href="manifest.json">', '<script src="aislamiento.js"></script>\n<link rel="manifest" href="manifest.json">')
    h = sustituir(h, '<link rel="apple-touch-icon" href="icon-512.png">', f'<link rel="apple-touch-icon" href="{R}icon-pruebas-512.png">')
    h = sustituir(h, '<link rel="icon" href="icon-192.png">', f'<link rel="icon" href="{R}icon-pruebas-192.png">')
    h = sustituir(h, "window.MODO_PRUEBAS=['raw.githack.com','rawcdn.githack.com'].includes(location.hostname)||\n"
                     "  (['localhost','127.0.0.1'].includes(location.hostname)&&/[?&]pruebas\\b/.test(location.search));",
                  "window.MODO_PRUEBAS=true; /* copia aislada D-026: siempre en modo de pruebas */")
    h = sustituir(h, "document.querySelector('link[rel=manifest]').href='manifest-pruebas.json';", "")
    h = sustituir(h, "href='icon-pruebas-512.png'", f"href='{R}icon-pruebas-512.png'")
    h = sustituir(h, "href='icon-pruebas-192.png'", f"href='{R}icon-pruebas-192.png'")
    h = sustituir(h, "content='PRUEBAS';document.title='PRUEBAS · Mi Mundo de Juegos'", "content='PRUEBA D-026';document.title='PRUEBA D-026 · Mi Mundo de Juegos'")
    h = sustituir(h, '<link rel="stylesheet" href="avatar/avatar.css">', f'<link rel="stylesheet" href="{R}avatar/avatar.css">')
    h = sustituir(h, '<script src="plantilla/plantilla.js"></script>', f'<script src="{R}plantilla/plantilla.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo.js"></script>', f'<script src="{R}avatar/catalogo.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="{R}avatar/catalogo-muneca.js"></script>\n<script src="avatar/catalogo-{ID}.js"></script>')
    h = sustituir(h, '<script src="progreso.js"></script>', f'<script src="{R}progreso.js"></script>')
    h = sustituir(h, "if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});",
                  "/* copia aislada D-026: no se registra ningún service worker (necesita conexión) */")
    h = sustituir(h, '🧪 VERSIÓN DE PRUEBAS · datos ficticios</div>', '🧪 PRUEBA D-026 · peinados y accesorios · datos propios</div>')
    h = sustituir(h, ACC_VIEJO, ACC_NUEVO)
    h = '<!-- COPIA AISLADA para probar los tres peinados y los accesorios aprobados (D-024, D-025, D-026) (generada por preparar_prueba.py desde index.html). No es el juego de Amaia. -->\n' + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    tam = sum(v['kb'] for v in nuevas.values())
    print(json.dumps(dict(piezas=len(nuevas), mb=round(tam / 1024, 1)), ensure_ascii=False))
