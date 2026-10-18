/* COPIA para la prueba aislada D-026 (generada por preparar_prueba.py desde avatar/motor.js) */
/* =====================================================================
   Mi Mundo de Juegos · Motor del avatar
   ---------------------------------------------------------------------
   · Avatar.svg(estado, opciones)   → SVG completo por capas
   · Avatar.mount(elemento, estado) → personaje vivo (parpadea, sonríe,
                                      saluda, reacciona, duerme)
   · Avatar.foto(estado, w, h)      → lienzo con la foto del personaje
   · Avatar.cargar / guardar / borrador → guardado local, versionado

   Dos tipos de arte con la misma interfaz:
     · «png»: muñeca ilustrada en capas PNG/WebP (avatar/catalogo-muneca.js
       + avatar/arte/piezas.js, generado por herramientas/optimizar.py)
     · «svg»: muñeca vectorial de la primera prueba (avatar/catalogo.js)
   Se usa la muñeca PNG si sus piezas están disponibles; ?arte=svg fuerza
   la vectorial.

   Claves de guardado nuevas (no se toca ninguna clave existente):
     avatar        → personaje guardado (el que aparece en «Mi Mundo»)
     avatar_draft  → cambios en curso dentro de «Vestir»
   ===================================================================== */
(function () {
  'use strict';
  const byId = (list, id) => list.find(o => o.id === id) || list[0];
  const clone = o => JSON.parse(JSON.stringify(o));
  const PZ = (window.AV_PIEZAS && window.AV_PIEZAS.piezas) || {};
  // Juego de piezas: el definitivo («premium») en cuanto existe su base;
  // si no, las piezas provisionales. ?arte=prueba|demo|svg fuerza uno.
  const SETS = window.AV_MUNECAS || {};
  const pedido = (location.search.match(/[?&]arte=(\w+)/) || [])[1];
  // Un juego está listo cuando tiene al menos una piel, unos ojos, un peinado y una ropa con todas sus piezas
  // (así nunca se ve, por ejemplo, la base premium sin ojos ni pelo mientras llegan las demás piezas).
  const listo = M => !!M && disponibles(M).completo;
  // ?arte=borrador: la muñeca premium con las piezas que ya haya, aunque falten otras (para revisar el arte).
  const tieneBase = M => !!M && M.piel.some(p => PZ[fill(p.capas.cuerpo, { piel: p.id })]);
  const JUEGO = pedido === 'svg' ? null : pedido === 'borrador' && tieneBase(SETS.premium) ? 'premium'
    : pedido && listo(SETS[pedido]) ? pedido : ['d026', 'premium', 'prueba'].find(k => listo(SETS[k])) || null;
  const MODO = JUEGO ? 'png' : 'svg';
  const CAT = JUEGO ? disponibles(SETS[JUEGO]) : window.AV_CAT;
  const KEY = 'avatar', DRAFT = 'avatar_draft', VERSION = 1;
  let uidN = 0;
  function fill(t, ids) { return String(t).replace(/^\?/, '').replace(/\{(\w+)\}/g, (_, k) => ids[k] || ''); }
  // Deja en el catálogo solo las opciones cuyas piezas ya existen.
  function disponibles(M) {
    const C = clone(M), ids = (l) => l.map(o => o.id);
    const combos = []; ids(M.piel).forEach(piel => ids(M.pelo.colores).forEach(pelo => ids(M.ojos.colores).forEach(ojos => combos.push({ piel, pelo, ojos }))));
    const ok = (o, fix) => Object.values(o.capas || {}).every(t => t[0] === '?' || combos.some(c => PZ[fill(t, Object.assign({}, c, fix))]));
    C.piel = M.piel.filter(o => ok(o, { piel: o.id }));
    C.ojos.colores = M.ojos.colores.filter(o => ok(o, { ojos: o.id }));
    C.pelo.estilos = M.pelo.estilos.filter(o => ok(o));
    C.pelo.colores = M.pelo.colores.filter(col => C.pelo.estilos.some(e => ok(e, { pelo: col.id })));
    C.ropa = M.ropa.filter(o => ok(o));
    C.completo = !!(C.piel.length && C.ojos.colores.length && C.pelo.estilos.length && C.ropa.length);
    C.zapatos = (M.zapatos || []).filter(o => ok(o));
    C.accesorios = (M.accesorios || []).filter(o => ok(o));
    ['piel', 'ropa'].forEach(k => { if (!C[k].length) C[k] = [{ id: M.defecto[k], nombre: '', capas: {} }]; });
    if (!C.pelo.estilos.length) C.pelo.estilos = [{ id: 'ninguno', nombre: '', capas: {} }];
    if (!C.pelo.colores.length) C.pelo.colores = M.pelo.colores.slice(0, 1);
    if (!C.ojos.colores.length) C.ojos.colores = M.ojos.colores.slice(0, 1);
    return C;
  }

  /* ---------- compatibilidades de los adornos (copia D-026) ----------
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
    s.zapatos = CAT.zapatos && CAT.zapatos.length ? byId(CAT.zapatos, s.zapatos).id : null;
    const accIds = (CAT.accesorios || []).map(o => o.id);
    s.accesorios = compatibles(Array.isArray(s.accesorios) ? s.accesorios.filter(a => accIds.includes(a)) : [], s.pelo.estilo);
    s.v = VERSION;
    return s;
  }

  /* =================== arte vectorial (primera prueba) =================== */
  function capa(src, x, extra) {
    if (!src) return '';
    if (typeof src === 'function') return src(x, extra);
    return '';
  }
  const VIEWS_SVG = { full: '22 70 356 600', ojos: '116 166 168 84', cabeza: '72 72 256 256', cuerpo: '70 300 260 370', pies: '120 540 160 130' };

  // opt.capas: lista de capas a dibujar (por defecto todas); opt.brazos: 'piel' | 'mangas' | (ambos)
  function svgVector(s, opt) {
    const C = window.AV_CAT, u = opt.uid || ('av' + (++uidN) + '_');
    const skin = byId(C.piel, s.piel), eye = byId(C.ojos.colores, s.ojos.color);
    const hs = byId(C.pelo.estilos, s.pelo.estilo), hc = byId(C.pelo.colores, s.pelo.color);
    const fit = byId(C.ropa, s.ropa);
    const x = { u, skin: skin.c, eye: eye.c, hair: hc.c, ids: { piel: skin.id, ojos: eye.id, pelo: hc.id } };
    const B = C.base, H = hs.layers, O = fit.layers, want = k => !opt.capas || opt.capas.includes(k);
    const arm = side => {
      const [sx, sy, r] = C.hombros[side], sd = side === 'L' ? -1 : 1;
      const parts = (opt.brazos !== 'mangas' ? capa(B.arm, x, sd) : '') + (opt.brazos !== 'piel' ? capa(O.sleeve, x, sd) : '');
      return `<g transform="translate(${sx} ${sy}) rotate(${r})"><g class="av-arm av-arm${side}">${parts}</g></g>`;
    };
    const headG = b => `<g transform="translate(200 290)"><g class="av-head"><g transform="translate(-200 -290)">${b}</g></g></g>`;
    const slot = {
      hairBack: () => headG(capa(H.hairBack, x)),
      legs: () => capa(B.legs, x),
      legwear: () => capa(O.legwear, x),
      shoes: () => capa(O.shoes, x),
      bottom: () => capa(O.bottom, x),
      arms: () => arm('L') + arm('R'),
      neck: () => capa(B.neck, x),
      top: () => capa(O.top, x),
      head: () => headG((want('head') ? capa(B.head, x) : '') + (want('hairFront') ? capa(H.hairFront, x) : '')),
      hairFront: () => '',
      acc: () => '',
    };
    let body = C.capas.filter(k => want(k) || (k === 'head' && want('hairFront'))).map(k => slot[k]()).join('');
    if (opt.expr === 'feliz') body = body.replace('class="av-mouth-c"', 'class="av-mouth-c" display="none"').replace('class="av-mouth-o" display="none"', 'class="av-mouth-o"');
    return {
      defs: capa(B.defs, x) + capa(H.defs, x) + capa(O.defs, x), body,
      vb: opt.viewBox || VIEWS_SVG[opt.view || 'full'] || VIEWS_SVG.full, pie: [200, 660], sombra: [86, 12],
    };
  }

  /* =================== muñeca ilustrada (capas PNG/WebP) =================== */
  // Cada opción del catálogo indica qué pieza ocupa cada capa; las piezas
  // vienen recortadas y optimizadas, con su posición en el lienzo 2000 × 3500.
  function piezasDe(s) {
    const ids = { piel: s.piel, ojos: s.ojos.color, pelo: s.pelo.color };
    const opts = [byId(CAT.piel, s.piel), byId(CAT.ojos.colores, s.ojos.color), byId(CAT.pelo.estilos, s.pelo.estilo), byId(CAT.ropa, s.ropa),
      (CAT.zapatos || []).find(o => o.id === s.zapatos)].filter(Boolean)
      .concat(s.accesorios.map(a => (CAT.accesorios || []).find(o => o.id === a)).filter(Boolean));
    const capas = {};
    opts.forEach(o => Object.entries(o.capas || {}).forEach(([k, t]) => { capas[k] = fill(t, ids); }));
    return CAT.capas.map(k => ({ k, id: capas[k], p: PZ[capas[k]] })).filter(c => c.id && c.p);
  }
  // ojos abiertos (av-open) se ocultan al parpadear o dormir; así los ojos cerrados solo necesitan párpados y pestañas
  const CLS = { ojos: 'av-open', ojosCerrados: 'av-closed', boca: 'av-mouth-c', bocaAbierta: 'av-mouth-o' };
  function svgPNG(s, opt) {
    const res = opt.res || 's', A = CAT.anclas;
    const img = c => {
      const p = c.p, href = p.v[res] || p.v.m;
      return `<image href="${href}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" preserveAspectRatio="none"/>`;
    };
    // Brazo y manga giran juntos alrededor del hombro (saludo, paso).
    const ARM = { brazoIzq: 'L', mangaIzq: 'L', brazoDer: 'R', mangaDer: 'R' }, arms = { L: [], R: [] };
    const armG = side => {
      const [sx, sy] = side === 'L' ? A.hombroIzq : A.hombroDer;
      return `<g transform="translate(${sx} ${sy})"><g class="av-arm av-arm${side}"><g transform="translate(${-sx} ${-sy})">${arms[side].join('')}</g></g></g>`;
    };
    let body = piezasDe(s).map(c => {
      const side = ARM[c.k];
      if (side) { arms[side].push(img(c)); return arms[side].length === 1 ? `@@${side}@@` : ''; }
      const cls = CLS[c.k];
      if (!cls) return img(c);
      const feliz = opt.expr === 'feliz';
      const hidden = c.k === 'ojosCerrados' || (c.k === 'boca' && feliz) || (c.k === 'bocaAbierta' && !feliz);
      return `<g class="${cls}"${hidden ? ' display="none"' : ''}>${img(c)}</g>`;
    }).join('').replace('@@L@@', () => armG('L')).replace('@@R@@', () => armG('R'));
    return { defs: '', body, vb: opt.viewBox || CAT.vistas[opt.view || 'full'] || CAT.vistas.full, pie: [A.eje, A.suelo], sombra: CAT.sombra || [430, 60] };
  }
  function urlsDe(estado, res) { return piezasDe(normalizar(estado)).map(c => c.p.v[res] || c.p.v.m); }

  /* ---------- SVG final ---------- */
  function svg(estado, opt = {}) {
    const s = normalizar(estado), r = MODO === 'png' ? svgPNG(s, opt) : svgVector(s, opt);
    const [px, py] = r.pie;
    const pos = (opt.x != null ? ` x="${opt.x}" y="${opt.y}"` : '') + (opt.w ? ` width="${opt.w}" height="${opt.h}"` : '');
    const shadow = opt.sombra === false ? '' : `<ellipse cx="${px}" cy="${py + r.sombra[1] / 2}" rx="${r.sombra[0]}" ry="${r.sombra[1]}" fill="#4a3a5c" opacity=".12"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" class="av${opt.cls ? ' ' + opt.cls : ''}" viewBox="${r.vb}"${pos} preserveAspectRatio="xMidYMax meet">` +
      `<defs>${r.defs}</defs>${shadow}` +
      `<g transform="translate(${px} ${py})"><g class="av-body"><g transform="translate(${-px} ${-py})">${r.body}</g></g></g></svg>`;
  }

  /* ---------- carga de imágenes ---------- */
  const cache = new Map();
  function precargar(urls) {
    return Promise.all(urls.map(u => {
      if (!cache.has(u)) cache.set(u, new Promise(ok => {
        const im = new Image(); im.decoding = 'async';
        im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => ok(im));
        im.onerror = () => { cache.delete(u); ok(null); };
        im.src = u;
      }));
      return cache.get(u);
    }));
  }
  // Elige la resolución más pequeña que se vea nítida en esta pantalla.
  function resPara(el, view) {
    if (MODO !== 'png') return null;
    const vb = (CAT.vistas[view || 'full'] || CAT.vistas.full).split(' ').map(Number);
    const need = (el.clientHeight || 400) * Math.min(3, window.devicePixelRatio || 1) / vb[3];
    const tams = (window.AV_PIEZAS && window.AV_PIEZAS.tamanos) || { s: .3, m: .5 };
    const sorted = Object.entries(tams).sort((a, b) => a[1] - b[1]);
    return (sorted.find(([, f]) => f >= need * .92) || sorted[sorted.length - 1])[0];
  }

  /* ---------- personaje vivo ---------- */
  const SPARK = c => `<svg viewBox="-10 -10 20 20"><path d="M0-10Q0 0 10 0Q0 0 0 10Q0 0-10 0Q0 0 0-10Z" fill="${c}"/></svg>`;

  function mount(el, estado, opt = {}) {
    let st = normalizar(estado), timers = [], blinkT, ticket = 0;
    el.classList.add('av-host');
    const root = () => el.querySelector('svg.av');
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const flag = (cls, ms) => { const r = root(); if (!r) return; r.classList.remove(cls); void r.getBoundingClientRect(); r.classList.add(cls); if (ms) later(() => { const n = root(); if (n) n.classList.remove(cls); }, ms); };
    function render() {
      const o = Object.assign({}, opt), res = resPara(el, o.view);
      if (res) o.res = res;
      const draw = () => {
        // Solo se conservan los estados duraderos; parpadeo, saludo o salto son momentáneos
        const keep = root() ? [...root().classList].filter(c => c === 'sleep' || c === 'walk') : [];
        el.innerHTML = svg(st, o);
        keep.forEach(c => root().classList.add(c));
      };
      if (MODO !== 'png') return draw();
      // Se cambia de imagen cuando todas las piezas están listas: sin parpadeos.
      const t = ++ticket;
      precargar(urlsDe(st, o.res)).then(() => { if (t === ticket) draw(); });
    }
    function blinkLoop() {
      clearTimeout(blinkT);
      blinkT = setTimeout(() => {
        if (!el.isConnected) return;
        const r = root();
        if (r && !r.classList.contains('sleep')) { flag('blink', 200); if (Math.random() < .25) later(() => flag('blink', 200), 260); }
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

  /* ---------- foto ---------- */
  // Devuelve un lienzo W×H con el personaje (sin fondo) listo para guardar.
  function foto(estado, W, H) {
    const s = normalizar(estado);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    if (MODO !== 'png') {
      return new Promise((ok, ko) => {
        const im = new Image(); im.onload = () => { g.drawImage(im, 0, 0, W, H); ok(c); }; im.onerror = ko;
        im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(s, { expr: 'feliz', w: W, h: H, sombra: false }));
      });
    }
    const [vx, vy, vw, vh] = CAT.vistas.full.split(' ').map(Number), k = Math.min(W / vw, H / vh);
    const ox = (W - vw * k) / 2 - vx * k, oy = H - vh * k - vy * k;
    const cs = piezasDe(s).filter(p => p.k !== 'ojosCerrados' && p.k !== 'boca');
    return precargar(cs.map(p => p.p.v.m)).then(ims => {
      ims.forEach((im, i) => { const p = cs[i].p; if (im) g.drawImage(im, ox + p.x * k, oy + p.y * k, p.w * k, p.h * k); });
      return c;
    });
  }

  /* ---------- guardado ---------- */
  const ls = {
    get(k) { try { const v = localStorage.getItem(k); return v == null ? null : JSON.parse(v); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  // Primer uso: toma el tono de piel y el color de pelo del muñeco antiguo (clave «doll», que no se modifica).
  function desdeMunecoAntiguo() {
    const d = ls.get('doll'); if (!d) return null;
    return { piel: (d.skin | 0) >= 2 ? 'morena' : 'clara', pelo: { color: ['castano', 'negro', 'rubio', 'pelirrojo'][d.hc] || 'castano' } };
  }
  const Avatar = {
    VERSION, MODO, JUEGO, CAT, svg, mount, foto, precargar, normalizar,
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
