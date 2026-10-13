/* =====================================================================
   Mi Mundo de Juegos · Motor del avatar
   ---------------------------------------------------------------------
   · Avatar.svg(estado, opciones)   → SVG completo por capas
   · Avatar.mount(elemento, estado) → personaje vivo (parpadea, sonríe,
                                      saluda, reacciona, duerme)
   · Avatar.cargar / guardar / borrador → guardado local, versionado

   Claves de guardado nuevas (no se toca ninguna clave existente):
     avatar        → personaje guardado (el que aparece en «Mi Mundo»)
     avatar_draft  → cambios en curso dentro de «Vestir»
   ===================================================================== */
(function () {
  'use strict';
  const CAT = window.AV_CAT;
  const KEY = 'avatar', DRAFT = 'avatar_draft', VERSION = 1;
  let uidN = 0;

  const byId = (list, id) => list.find(o => o.id === id) || list[0];
  const clone = o => JSON.parse(JSON.stringify(o));

  /* ---------- estado ---------- */
  // Completa campos que falten y descarta ids desconocidos (catálogos futuros).
  function normalizar(e) {
    const d = clone(CAT.defecto), s = Object.assign({}, d, e || {});
    s.ojos = Object.assign({}, d.ojos, (e && e.ojos) || {});
    s.pelo = Object.assign({}, d.pelo, (e && e.pelo) || {});
    s.piel = byId(CAT.piel, s.piel).id;
    s.ojos.color = byId(CAT.ojos.colores, s.ojos.color).id;
    s.ojos.forma = byId(CAT.ojos.formas, s.ojos.forma).id;
    s.pelo.estilo = byId(CAT.pelo.estilos, s.pelo.estilo).id;
    s.pelo.color = byId(CAT.pelo.colores, s.pelo.color).id;
    s.ropa = byId(CAT.ropa, s.ropa).id;
    if (!Array.isArray(s.accesorios)) s.accesorios = [];
    s.v = VERSION;
    return s;
  }

  /* ---------- composición ---------- */
  function capa(src, x, extra) {
    if (!src) return '';
    if (typeof src === 'function') return src(x, extra);
    if (src.img) { // PNG transparente del mismo tamaño que el lienzo
      const href = src.img.replace('{piel}', x.ids.piel).replace('{pelo}', x.ids.pelo).replace('{ojos}', x.ids.ojos);
      const [w, h] = src.size || [CAT.lienzo.w, CAT.lienzo.h], [ox, oy] = src.at || [0, 0];
      return `<image href="${href}" x="${ox}" y="${oy}" width="${w}" height="${h}"/>`;
    }
    return '';
  }

  const VIEWS = { full: '22 70 356 600', ojos: '116 166 168 84', cabeza: '72 72 256 256', cuerpo: '70 300 260 370', pies: '120 540 160 130' };

  function svg(estado, opt = {}) {
    const s = normalizar(estado), u = opt.uid || ('av' + (++uidN) + '_');
    const skin = byId(CAT.piel, s.piel), eye = byId(CAT.ojos.colores, s.ojos.color);
    const hs = byId(CAT.pelo.estilos, s.pelo.estilo), hc = byId(CAT.pelo.colores, s.pelo.color);
    const fit = byId(CAT.ropa, s.ropa);
    const x = { u, skin: skin.c, eye: eye.c, hair: hc.c, ids: { piel: skin.id, ojos: eye.id, pelo: hc.id } };
    const B = CAT.base, H = hs.layers, O = fit.layers;
    const arm = side => {
      const [sx, sy, r] = CAT.hombros[side], sd = side === 'L' ? -1 : 1;
      return `<g transform="translate(${sx} ${sy}) rotate(${r})"><g class="av-arm av-arm${side}">${capa(B.arm, x, sd)}${capa(O.sleeve, x, sd)}</g></g>`;
    };
    const slot = {
      hairBack: () => `<g transform="translate(200 290)"><g class="av-head"><g transform="translate(-200 -290)">${capa(H.hairBack, x)}</g></g></g>`,
      legs: () => capa(B.legs, x),
      legwear: () => capa(O.legwear, x),
      shoes: () => capa(O.shoes, x),
      bottom: () => capa(O.bottom, x),
      arms: () => arm('L') + arm('R'),
      neck: () => capa(B.neck, x),
      top: () => capa(O.top, x),
      head: () => `<g transform="translate(200 290)"><g class="av-head"><g transform="translate(-200 -290)">${capa(B.head, x)}${capa(H.hairFront, x)}</g></g></g>`,
      hairFront: () => '',
      acc: () => '',
    };
    const happy = opt.expr === 'feliz';
    let body = CAT.capas.map(k => slot[k]()).join('');
    if (happy) body = body.replace('class="av-mouth-c"', 'class="av-mouth-c" display="none"').replace('class="av-mouth-o" display="none"', 'class="av-mouth-o"');
    const vb = opt.viewBox || VIEWS[opt.view || 'full'];
    const shadow = opt.sombra === false ? '' : `<ellipse cx="200" cy="660" rx="86" ry="12" fill="#4a3a5c" opacity=".12"/>`;
    const pos = (opt.x != null ? ` x="${opt.x}" y="${opt.y}"` : '') + (opt.w ? ` width="${opt.w}" height="${opt.h}"` : '');
    return `<svg xmlns="http://www.w3.org/2000/svg" class="av${opt.cls ? ' ' + opt.cls : ''}" viewBox="${vb}"${pos} preserveAspectRatio="xMidYMax meet">` +
      `<defs>${capa(B.defs, x)}${capa(H.defs, x)}${capa(O.defs, x)}</defs>${shadow}` +
      `<g transform="translate(200 660)"><g class="av-body"><g transform="translate(-200 -660)">${body}</g></g></g></svg>`;
  }

  /* ---------- personaje vivo ---------- */
  const SPARK = c => `<svg viewBox="-10 -10 20 20"><path d="M0-10Q0 0 10 0Q0 0 0 10Q0 0-10 0Q0 0 0-10Z" fill="${c}"/></svg>`;

  function mount(el, estado, opt = {}) {
    let st = normalizar(estado), timers = [], blinkT;
    el.classList.add('av-host');
    const root = () => el.querySelector('svg.av');
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const flag = (cls, ms) => { const r = root(); if (!r) return; r.classList.remove(cls); void r.getBoundingClientRect(); r.classList.add(cls); if (ms) later(() => r.classList.remove(cls), ms); };
    function render() {
      const keep = root() ? [...root().classList].filter(c => c !== 'av') : [];
      el.innerHTML = svg(st, opt);
      keep.forEach(c => root().classList.add(c));
    }
    function blinkLoop() {
      clearTimeout(blinkT);
      blinkT = setTimeout(() => {
        if (!el.isConnected) return;
        if (!root().classList.contains('sleep')) { flag('blink', 200); if (Math.random() < .25) later(() => flag('blink', 200), 260); }
        blinkLoop();
      }, 2200 + Math.random() * 2800);
    }
    const api = {
      el,
      get estado() { return clone(st); },
      set(e) { st = normalizar(e); render(); },
      blink() { flag('blink', 200); },
      sonreir(ms = 1400) { flag('happy', ms); },
      saludar() { api.dormir(false); flag('wave', 1600); api.sonreir(1800); },
      saltar() { flag('bounce', 600); api.sonreir(1000); },
      reaccionar() {
        api.dormir(false); flag('bounce', 600); api.sonreir(1400);
        const cols = ['#ffd46b', '#ff8fbf', '#a083ff', '#6cc8f5', '#5fd39b'];
        for (let i = 0; i < 9; i++) {
          const sp = document.createElement('span'); sp.className = 'av-spark'; sp.innerHTML = SPARK(cols[i % cols.length]);
          const a = Math.PI * 2 * i / 9 + Math.random() * .4, d = 38 + Math.random() * 18;
          sp.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + '%'); sp.style.setProperty('--dy', (Math.sin(a) * d * .7).toFixed(1) + '%');
          sp.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
          el.appendChild(sp); later(() => sp.remove(), 1100);
        }
      },
      dormir(on = true) { const r = root(); if (r) r.classList.toggle('sleep', on); },
      andar(on = true) { const r = root(); if (r) r.classList.toggle('walk', on); },
      destruir() { timers.forEach(clearTimeout); clearTimeout(blinkT); el.innerHTML = ''; },
    };
    render(); blinkLoop();
    return api;
  }

  /* ---------- guardado ---------- */
  const ls = {
    get(k) { try { const v = localStorage.getItem(k); return v == null ? null : JSON.parse(v); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  // Primer uso: toma el tono de piel y el color de pelo del muñeco antiguo (clave «doll», que no se modifica).
  function desdeMunecoAntiguo() {
    const d = ls.get('doll'); if (!d) return null;
    return { piel: (d.skin | 0) >= 2 ? 'morena' : 'clara', pelo: { estilo: 'melena', color: ['castano', 'negro', 'rubio', 'pelirrojo'][d.hc] || 'castano' } };
  }
  const Avatar = {
    VERSION, svg, mount, normalizar,
    cargar() { const a = ls.get(KEY); return a ? normalizar(a) : null; },
    guardar(e) { const s = normalizar(e); s.guardado = new Date().toISOString(); const ok = ls.set(KEY, s); if (ok) ls.set(DRAFT, s); return ok; },
    borrador() { const a = ls.get(DRAFT) || ls.get(KEY) || desdeMunecoAntiguo(); return normalizar(a); },
    guardarBorrador(e) { return ls.set(DRAFT, normalizar(e)); },
    iguales(a, b) { const k = o => JSON.stringify(Object.assign({}, normalizar(o), { guardado: 0 })); return k(a) === k(b); },
    // Personaje para «Mi Mundo»: el guardado, o el borrador si aún no hay ninguno guardado.
    principal() { return Avatar.cargar() || Avatar.borrador(); },
    aleatorio() {
      const p = l => l[Math.floor(Math.random() * l.length)].id;
      return normalizar({ piel: p(CAT.piel), ojos: { color: p(CAT.ojos.colores) }, pelo: { estilo: p(CAT.pelo.estilos), color: p(CAT.pelo.colores) }, ropa: p(CAT.ropa) });
    },
  };
  window.Avatar = Avatar;
})();
