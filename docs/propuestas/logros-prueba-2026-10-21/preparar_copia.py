#!/usr/bin/env python3
"""
Copia AISLADA del juego para la primera prueba de logros (21/10/2026). No es el juego de Amaia.

No modifica ningún archivo del juego: genera, dentro de esta carpeta, una copia de index.html y de progreso.js y usa los
demás archivos del juego tal cual (gracias a <base href="../../../">). Las referencias congeladas de Pintar
(../pintar-2026-10-21/, 708c2f2) y de la Heladería (../heladeria-2026-10-21/, 7aeb5b7) no se tocan: aquí Pintar y la
Heladería son las del juego, con los premios provisionales añadidos.

Cambios respecto a los archivos del juego (cada sustitución comprueba que el texto original existe una sola vez):
  index.html
    1. «aislamiento.js» antes que nada: datos propios («rec1:» en localStorage, «rec1-» en IndexedDB). Si no se puede,
       se detiene. Siempre en modo de pruebas, con su cinta y su manifiesto («PRUEBA LOGROS»). Sin service worker.
    2. Inicio: contador 🏅 junto a las estrellas y botón «Retos y logros».
    3. Pantallas nuevas: «Mis logros» (cofres, retos, tareas, premios de prueba) y el reto (3 rondas); ventana del cofre y
       zona de adultos (también desde ⚙️ Ajustes).
    4. Heladería: los pedidos solo usan los 6 sabores y 5 adornos de siempre (los premios no salen en los pedidos).
    5. logros.js después del juego (toda la lógica nueva).
    Vestir, el catálogo, las estrellas y lo que ya existe en Pintar y la Heladería NO cambian.
  progreso.js (copia en esta carpeta)
    Solo se añaden «logros», «tareas» y «premios» a la lista de claves que se guardan. La recuperación es la de hoy
    (sustituye cada clave por la de la copia y no borra las que no trae). «adultos» (el código) NO va en la copia.
    El progreso.js del juego no se toca.

Uso (desde la raíz del repositorio): python3 docs/propuestas/logros-prueba-2026-10-21/preparar_copia.py
"""
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[2]
CARPETA = 'docs/propuestas/logros-prueba-2026-10-21/'


def sustituir(texto, viejo, nuevo, veces=1):
    n = texto.count(viejo)
    assert n == veces, f'esperado {veces} vez/veces y encontrado {n}: {viejo[:80]!r}'
    return texto.replace(viejo, nuevo)


CSS = """<style>
/* ---------- Prueba de logros (21/10/2026) ---------- */
.lcp{background:linear-gradient(150deg,#fff3c4,#ffe49a)}
#logros .lgcuerpo{flex:1;overflow:auto;padding:4px 14px calc(40px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:14px;max-width:900px;width:100%;margin:0 auto}
#logros .lgsec{background:#fff;border-radius:26px;padding:14px;box-shadow:var(--shadow)}
#logros .lgtit{font-weight:900;font-size:18px;color:var(--soft);margin:0 4px 10px}
.lgcamino{display:flex;align-items:center;justify-content:center;gap:4px}
.camino-sep{flex:0 1 30px;height:6px;border-radius:3px;background:#efe4ff}
.cofre{border:none;border-radius:24px;background:#f5eefa;width:clamp(86px,24vmin,130px);aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;box-shadow:0 4px 0 rgba(0,0,0,.08);padding:4px;color:var(--ink)}
.cofre .ci2{font-size:clamp(40px,11vmin,62px);line-height:1;filter:grayscale(.6) opacity(.7)}
.cofre .cn{font-weight:900;font-size:15px;letter-spacing:1px;color:var(--purple)}
.cofre.listo{background:linear-gradient(150deg,#fff3c4,#ffe49a);box-shadow:0 0 0 4px #ffd46b,0 6px 0 rgba(0,0,0,.08);animation:bob 1.2s infinite}
.cofre.listo .ci2,.cofre.abierto .ci2{filter:none}
.cofre.abierto{background:linear-gradient(150deg,#ddfaeb,#b8efd3)}
.lgretos{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.lgretos .big{min-height:130px;font-size:clamp(20px,5vw,26px)}
.lgretos .big .ill{width:84px;height:84px}
.lgretos .hoy{position:absolute;top:10px;right:12px;background:#fff;border-radius:14px;padding:3px 9px;font-size:14px;font-weight:900;color:#2e9e6a;z-index:2}
.lgretos .hoy[hidden]{display:none}
.tarea{display:flex;align-items:center;gap:10px;padding:8px 6px;border-bottom:2px dashed var(--line);flex-wrap:wrap}
.tarea:last-child{border-bottom:none}
.tarea .td{font-size:44px}.tarea .tn{flex:1 1 140px;font-weight:900;font-size:19px}
.tarea .thecho{padding:0 16px;font-size:18px;background:linear-gradient(150deg,#ddfaeb,#b8efd3)}
.tarea .tw{font-weight:900;color:var(--soft);font-size:16px;background:#f5eefa;border-radius:16px;padding:10px 14px}
.lgpremios{display:flex;flex-wrap:wrap;gap:8px}
.pchip{background:#f5eefa;border-radius:16px;padding:8px 12px;font-weight:800}.pchip i{font-style:normal;color:var(--soft);font-weight:700}
.pvacio{color:var(--soft);font-weight:700}
/* reto */
#reto .rtpuntos{display:flex;gap:8px;justify-content:center}
#reto .rtpuntos i{width:18px;height:18px;border-radius:50%;background:#e7defe;display:block}
#reto .rtpuntos i.h{background:var(--green)}#reto .rtpuntos i.a{background:var(--purple)}
.rtcolor{font-size:110px;line-height:1;animation:bob 2s infinite}
.rtbola{width:86px;height:86px;border-radius:50%;display:block;border:5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.qopt.pista{animation:pista 1s infinite;box-shadow:0 0 0 6px #ffd46b inset}
@keyframes pista{50%{transform:scale(1.08)}}
.rtfin{font-size:120px;line-height:1;animation:pop .5s}.rttxt{font-size:26px;font-weight:900;text-align:center}
.rtbtn{padding:0 18px;font-size:20px;min-height:64px}.rtbtn.verde{background:linear-gradient(150deg,#ddfaeb,#b8efd3)}
/* cofre y adultos */
.cfgrande{font-size:120px;text-align:center;animation:shake .6s 2}
.cfop{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.cfpremio{border:none;border-radius:24px;background:#f5eefa;padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:6px;font:inherit;color:var(--ink);box-shadow:var(--shadow)}
.cfpremio .cfi{font-size:64px;line-height:1}.cfpremio b{font-size:19px}.cfpremio .cfd{font-weight:700;color:var(--soft)}
.cfprov{font-size:13px;font-weight:900;background:#fff4e0;border:2px dashed #ffb347;border-radius:12px;padding:2px 8px}
.adpuntos{display:flex;gap:12px;justify-content:center}.adpuntos i{width:20px;height:20px;border-radius:50%;border:3px solid var(--purple);display:block}.adpuntos i.h{background:var(--purple)}
.admsg{text-align:center;font-weight:800;color:#c0392b;min-height:22px}.admsg.ok{color:#2e9e6a}
.adtecl{display:grid;grid-template-columns:repeat(3,72px);gap:10px;justify-content:center}.adtecl .adk{width:72px;height:64px;font-size:28px}
.adrow{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-weight:800;padding:6px 0;border-bottom:1px solid var(--line)}
.adrow .btn{height:48px;font-size:16px;padding:0 10px;margin-left:6px}
.adlista{max-height:30vh;overflow:auto}
/* premios provisionales: marca 🎁 */
.premio{position:relative;outline:3px dashed #ffb347;outline-offset:2px}
.premio:after{content:"🎁";position:absolute;right:-8px;top:-10px;font-size:16px}
.premio[hidden]{display:none!important}
@media (max-width:420px){.lgretos .big{min-height:110px;flex-direction:column;gap:4px;padding:12px 6px}.lgretos .big .ill{width:64px;height:64px}}
</style>
"""

ILL_LOGROS = """  logros:svg(`<path d="M42 10h36l-6 34H48z" fill="#a083ff" ${S}/><path d="M52 10l8 34 8-34" fill="#ff8fbf" ${S}/>
    <circle cx="60" cy="74" r="32" fill="#ffd46b" ${S}/><circle cx="60" cy="74" r="22" fill="#fff3c4" ${S}/><path d="${starP(60,74,14,6)}" fill="#ffab73" ${S}/>${spark(98,30,9)}${spark(22,40,7,'#6cc8f5')}`),
"""

PANTALLAS = """<!-- PRUEBA DE LOGROS (21/10/2026) -->
<section class="screen" id="logros">
  <div class="bar"><button class="btn" data-go="home" aria-label="Volver">⬅️</button><div class="title">🏅 Mis logros</div>
    <button class="btn" id="lgAdultos" aria-label="Zona de adultos">👪</button><div class="stars lcp">🏅 <b class="lc">0</b></div></div>
  <div class="lgcuerpo">
    <div class="lgsec"><div class="lgtit">Cofres</div><div class="lgcamino" id="lgCamino"></div></div>
    <div class="lgsec"><div class="lgtit">Retos (un logro al día por reto)</div><div class="lgretos" id="lgRetos">
      <button class="big c5" data-go="reto" data-arg="contar" data-reto="contar"><span class="hoy" hidden>✓ Hoy</span><span class="ill" data-ill="contar"></span>Contar</button>
      <button class="big c3" data-go="reto" data-arg="colores" data-reto="colores"><span class="hoy" hidden>✓ Hoy</span><span class="ill" data-ill="pintar"></span>Colores</button>
    </div></div>
    <div class="lgsec"><div class="lgtit">Tareas de casa (las confirma un adulto)</div><div id="lgTareas"></div></div>
    <div class="lgsec"><div class="lgtit">🎁 Premios de prueba (provisionales)</div><div class="lgpremios" id="lgPremios"></div></div>
  </div>
</section>
<section class="screen" id="reto">
  <div class="bar"><button class="btn" data-go="logros" aria-label="Volver">⬅️</button><div class="title" id="rtTitulo"></div>
    <div class="rtpuntos" id="rtPuntos"></div><div class="stars lcp">🏅 <b class="lc">0</b></div></div>
  <div class="qwrap"><div class="qprompt" id="rtPrompt"></div><div class="qopts" id="rtOpts"></div></div>
</section>
<div id="cofreModal" class="modal"><div class="mbox"><div id="cfBox"></div><button class="btn" id="cfCerrar" style="align-self:center;min-width:130px">Ahora no</button></div></div>
<div id="adModal" class="modal"><div class="mbox" id="adBox"></div></div>

<div id="settings" class="modal">"""

if __name__ == '__main__':
    # ---------- progreso.js (copia: solo la lista de claves) ----------
    pr = (RAIZ / 'progreso.js').read_text(encoding='utf-8')
    pr = sustituir(pr, "  const CLAVES = ['stars', 'gal', 'sound', 'voice', 'tone', 'iceServed', 'iceCoins', 'scKey', 'mm_hab', 'avatar', 'avatar_draft', 'doll'];",
                   "  const CLAVES = ['stars', 'gal', 'sound', 'voice', 'tone', 'iceServed', 'iceCoins', 'scKey', 'mm_hab', 'avatar', 'avatar_draft', 'doll',\n"
                   "    'logros', 'tareas', 'premios'];   // COPIA de la prueba de logros: solo se añaden estas tres claves")
    pr = '/* COPIA para la prueba de logros (generada por preparar_copia.py desde progreso.js): solo cambia la lista CLAVES. */\n' + pr
    (AQUI / 'progreso.js').write_text(pr, encoding='utf-8')
    # ---------- index.html ----------
    h = (RAIZ / 'index.html').read_text(encoding='utf-8')
    h = sustituir(h, '<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="../../../">\n'
                  f'<script src="{CARPETA}aislamiento.js"></script>')
    h = sustituir(h, "window.MODO_PRUEBAS=['raw.githack.com','rawcdn.githack.com'].includes(location.hostname)||\n"
                     "  (['localhost','127.0.0.1'].includes(location.hostname)&&/[?&]pruebas\\b/.test(location.search));",
                  "window.MODO_PRUEBAS=true; /* copia aislada de la prueba de logros: siempre en modo de pruebas */")
    h = sustituir(h, "document.querySelector('link[rel=manifest]').href='manifest-pruebas.json';",
                  f"document.querySelector('link[rel=manifest]').href='{CARPETA}manifest.json';")
    h = sustituir(h, "content='PRUEBAS';document.title='PRUEBAS · Mi Mundo de Juegos'",
                  "content='PRUEBA LOGROS';document.title='PRUEBA LOGROS · Mi Mundo de Juegos'")
    h = sustituir(h, "if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});",
                  "/* copia aislada de la prueba de logros: no se registra ningún service worker (necesita conexión) */")
    h = sustituir(h, '🧪 VERSIÓN DE PRUEBAS · datos ficticios</div>', '🧪 PRUEBA LOGROS · datos propios</div>')
    h = sustituir(h, '<link rel="stylesheet" href="avatar/avatar.css">', '<link rel="stylesheet" href="avatar/avatar.css">\n' + CSS)
    # inicio: contador 🏅 y botón
    h = sustituir(h, """    <div class="stars">⭐ <b class="sc">0</b></div>
  </div>
  <div class="home-sub">""", """    <div style="display:flex;gap:8px"><div class="stars lcp">🏅 <b class="lc">0</b></div><div class="stars">⭐ <b class="sc">0</b></div></div>
  </div>
  <div class="home-sub">""")
    h = sustituir(h, """    <button class="big c3" data-go="m-think"><span class="ill" data-ill="pensar"></span>Pensar</button>
  </div>
</section>""", """    <button class="big c3" data-go="m-think"><span class="ill" data-ill="pensar"></span>Pensar</button>
    <button class="big c5" data-go="logros"><span class="ill" data-ill="logros"></span>Retos y logros</button>
  </div>
</section>""")
    h = sustituir(h, '<div id="settings" class="modal">', PANTALLAS)
    h = sustituir(h, """  <button class="btn" id="setClose" style="align-self:center;min-width:140px">✅ Listo</button>""",
                  """  <div class="bk"><div class="mtitle" style="font-size:24px">👪 Zona de adultos</div>
    <button class="bkbtn r" id="adBtn"><span class="ico">👪</span>Entrar con el código</button></div>
  <button class="btn" id="setClose" style="align-self:center;min-width:140px">✅ Listo</button>""")
    h = sustituir(h, "  arcoiris:svg(", ILL_LOGROS + "  arcoiris:svg(")
    # Heladería: los pedidos usan solo lo de siempre (los premios no salen en los pedidos)
    h = sustituir(h, "for(let i=0;i<n;i++)scoops.push(rnd(FLAV.length));", "for(let i=0;i<n;i++)scoops.push(rnd(6));   /* prueba de logros: solo los 6 sabores de siempre */")
    h = sustituir(h, "top:s>=2&&rnd(3)?rnd(TOPS.length):null};", "top:s>=2&&rnd(3)?rnd(5):null};   /* solo los 5 adornos de siempre */")
    # progreso.js de esta carpeta y la lógica nueva
    h = sustituir(h, '<script src="progreso.js"></script>', f'<script src="{CARPETA}progreso.js"></script>')
    h = sustituir(h, "</script>\n</body>", f"</script>\n<script src=\"{CARPETA}logros.js\"></script>\n</body>")
    h = ('<!-- COPIA AISLADA para la primera prueba de logros (generada por preparar_copia.py desde index.html). '
         'No es el juego de Amaia. -->\n') + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    print('index.html y progreso.js generados:', len(h), len(pr))
