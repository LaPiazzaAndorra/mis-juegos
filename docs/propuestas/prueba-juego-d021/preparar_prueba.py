#!/usr/bin/env python3
"""
Copia AISLADA del juego (versión de pruebas) con el conjunto aprobado de la prueba D-016/D-019 + los cuatro colores de
ojos (D-020) + el pintacaras «Estrellas y brillo» (D-021), a 948 × 1659. Es una copia NUEVA: la prueba congelada
../prueba-juego-d016/ (D-019) no se toca.

No modifica ningún archivo del juego: genera, dentro de esta carpeta, una copia de index.html y de los archivos del
avatar que necesitan cambios, y usa los demás archivos del juego tal cual (con la ruta ../../../).

  · index.html   ← copia de ../../../index.html con estos cambios (comprobados uno a uno):
      1. «aislamiento.js» antes que nada: datos propios. Toda la copia lee y escribe en localStorage con el prefijo
         «d021:» y en IndexedDB con «d021-» delante del nombre. No lee, cambia ni migra las claves del juego. Si el
         aislamiento no se puede activar, la copia se detiene y lo dice.
      2. Siempre en modo de pruebas (cinta y ajustes de pruebas), con su propio manifiesto («PRUEBA D-021»).
      3. Rutas: los archivos sin cambios se cargan del juego (../../../); los cambiados, de esta carpeta.
      4. Sin service worker (no se registra ninguno): la copia necesita conexión.
  · avatar/motor.js        ← copia de ../../../avatar/motor.js: prefiere el juego de piezas «d021» y toma la sombra del
                             catálogo (lienzo más pequeño). ?arte=premium|borrador|prueba|demo|svg siguen funcionando.
  · avatar/catalogo-d021.js ← juego de piezas «d021» (mismos identificadores que «premium»: rizos, castano, princesa,
                             corona, marron, azul; nuevos: verde, lila, pintacaras), se añade a los catálogos del juego sin tocarlos.
  · avatar/arte/piezas.js  ← índice del juego (rutas con ../../../) + las piezas d021.
  · avatar/arte/d021/*.webp ← las capas aprobadas recortadas a su contenido (WebP sin pérdida, huella en el nombre).

Uso (desde la raíz): python3 docs/propuestas/prueba-juego-d021/preparar_prueba.py
"""
import hashlib, io, json, re
from pathlib import Path
from PIL import Image

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[2]; P = RAIZ / 'docs' / 'propuestas'
R = '../../../'                                    # de esta carpeta a la raíz del juego
B = P / 'base-aprobada-d013-2026-10-14'; VAR = B / 'pelo-borrador-d012' / 'revision-localizada' / 'variante-experimental'
PIEZAS = {
    'd021-pelo-detras': VAR / 'pelo-variante-sin-mechon-detras.png',
    'd021-base': B / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
    'd021-ojos-marron': B / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
    'd021-ojos-azul': B / 'ojos-colores' / 'capa-ojos-abiertos-azul.png',
    'd021-ojos-verde': B / 'ojos-colores' / 'capa-ojos-abiertos-verde.png',
    'd021-ojos-lila': B / 'ojos-colores' / 'capa-ojos-abiertos-lila.png',
    'd021-pintacaras': B / 'pintacaras' / 'capa-pintacaras-estrellas.png',
    'd021-ojos-cerrados': B / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png',
    'd021-zapatos': P / 'zapatos-rosa-2026-10-15' / 'montaje' / 'zapatos-candidatos.png',
    'd021-vestido': P / 'vestido-rosa-2026-10-15' / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png',
    'd021-manos': P / 'vestido-rosa-2026-10-15' / 'montaje' / 'brazos-delante-copiados-de-la-base.png',
    'd021-pelo-delante': VAR / 'redistribucion-hombros' / 'mechones-completos-chatgpt' / 'pelo-delante-mechones-completos.png',
    'd021-corona': P / 'corona-2026-10-15' / 'montaje' / 'corona-candidata.png',
}


def sustituir(texto, viejo, nuevo, veces=1):
    assert texto.count(viejo) == veces, f'no encontrado {veces} vez/veces: {viejo[:70]!r}'
    return texto.replace(viejo, nuevo)


def piezas():
    carpeta = AQUI / 'avatar' / 'arte' / 'd021'; carpeta.mkdir(parents=True, exist_ok=True)
    for viejo in carpeta.glob('*.webp'):
        viejo.unlink()
    out = {}
    for nombre, ruta in PIEZAS.items():
        im = Image.open(ruta).convert('RGBA'); assert im.size == (948, 1659), (nombre, im.size)
        x0, y0, x1, y1 = im.getchannel('A').getbbox()
        buf = io.BytesIO(); im.crop((x0, y0, x1, y1)).save(buf, 'WEBP', lossless=True, quality=100, method=6, exact=True)
        h = hashlib.sha256(buf.getvalue()).hexdigest()[:8]; f = f'{nombre}.{h}.webp'
        (carpeta / f).write_bytes(buf.getvalue())
        url = f'avatar/arte/d021/{f}'
        out[nombre] = dict(x=x0, y=y0, w=x1 - x0, h=y1 - y0, v=dict(s=url, m=url), kb=round(len(buf.getvalue()) / 1024, 1),
                           fuente=str(ruta.relative_to(RAIZ)))
    return out


if __name__ == '__main__':
    # --- índice de piezas: el del juego (rutas a la raíz) + d021 ---------------------------------------------
    t = (RAIZ / 'avatar' / 'arte' / 'piezas.js').read_text(encoding='utf-8')
    j = json.loads(t[t.index('{'):t.rindex('}') + 1])
    for p in j['piezas'].values():
        p['v'] = {k: R + u for k, u in p['v'].items()}
    nuevas = piezas(); j['piezas'].update(nuevas)
    (AQUI / 'avatar' / 'arte' / 'piezas.js').write_text('/* Generado por docs/propuestas/prueba-juego-d021/preparar_prueba.py — no editar a mano */\n'
                                                        'self.AV_PIEZAS = ' + json.dumps(j, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')
    # --- motor: preferir d021 y sombra del catálogo ------------------------------------------------------------
    m = (RAIZ / 'avatar' / 'motor.js').read_text(encoding='utf-8')
    m = sustituir(m, "['premium', 'prueba'].find(k => listo(SETS[k]))", "['d021', 'premium', 'prueba'].find(k => listo(SETS[k]))")
    m = sustituir(m, "pie: [A.eje, A.suelo], sombra: [430, 60] };", "pie: [A.eje, A.suelo], sombra: CAT.sombra || [430, 60] };")
    m = '/* COPIA para la prueba aislada D-021 (generada por preparar_prueba.py desde avatar/motor.js) */\n' + m
    (AQUI / 'avatar' / 'motor.js').write_text(m, encoding='utf-8')
    # --- index.html ----------------------------------------------------------------------------------------------
    h = (RAIZ / 'index.html').read_text(encoding='utf-8')
    h = sustituir(h, '<link rel="manifest" href="manifest.json">', '<script src="aislamiento.js"></script>\n<link rel="manifest" href="manifest.json">')
    h = sustituir(h, '<link rel="apple-touch-icon" href="icon-512.png">', f'<link rel="apple-touch-icon" href="{R}icon-pruebas-512.png">')
    h = sustituir(h, '<link rel="icon" href="icon-192.png">', f'<link rel="icon" href="{R}icon-pruebas-192.png">')
    h = sustituir(h, "window.MODO_PRUEBAS=['raw.githack.com','rawcdn.githack.com'].includes(location.hostname)||\n"
                     "  (['localhost','127.0.0.1'].includes(location.hostname)&&/[?&]pruebas\\b/.test(location.search));",
                  "window.MODO_PRUEBAS=true; /* copia aislada D-021: siempre en modo de pruebas */")
    h = sustituir(h, "document.querySelector('link[rel=manifest]').href='manifest-pruebas.json';", "")
    h = sustituir(h, "href='icon-pruebas-512.png'", f"href='{R}icon-pruebas-512.png'")
    h = sustituir(h, "href='icon-pruebas-192.png'", f"href='{R}icon-pruebas-192.png'")
    h = sustituir(h, "content='PRUEBAS';document.title='PRUEBAS · Mi Mundo de Juegos'", "content='PRUEBA D-021';document.title='PRUEBA D-021 · Mi Mundo de Juegos'")
    h = sustituir(h, '<link rel="stylesheet" href="avatar/avatar.css">', f'<link rel="stylesheet" href="{R}avatar/avatar.css">')
    h = sustituir(h, '<script src="plantilla/plantilla.js"></script>', f'<script src="{R}plantilla/plantilla.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo.js"></script>', f'<script src="{R}avatar/catalogo.js"></script>')
    h = sustituir(h, '<script src="avatar/catalogo-muneca.js"></script>', f'<script src="{R}avatar/catalogo-muneca.js"></script>\n<script src="avatar/catalogo-d021.js"></script>')
    h = sustituir(h, '<script src="progreso.js"></script>', f'<script src="{R}progreso.js"></script>')
    h = sustituir(h, "if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});",
                  "/* copia aislada D-021: no se registra ningún service worker (necesita conexión) */")
    h = sustituir(h, '🧪 VERSIÓN DE PRUEBAS · datos ficticios</div>', '🧪 PRUEBA D-021 · ojos de colores y pintacaras · datos propios</div>')
    h = '<!-- COPIA AISLADA para probar los colores de ojos y el pintacaras (D-021) (generada por preparar_prueba.py desde index.html). No es el juego de Amaia. -->\n' + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    print(json.dumps({k: dict(caja=[v['x'], v['y'], v['w'], v['h']], kb=v['kb']) for k, v in nuevas.items()}, ensure_ascii=False))
