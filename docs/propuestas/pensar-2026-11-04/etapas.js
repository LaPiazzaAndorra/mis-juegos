/* =====================================================================
   Dibujos por partes (copia aislada de Pensar, 4.ª entrega · ejemplos para revisar, 15/11/2026) · menú Pintar
   Las ilustraciones de ilustraciones.js se descubren por etapas (el cuerpo, la cara, las alas…), de dos maneras:
     · Unir puntos: 30, 45 o 60 puntos repartidos entre las etapas; en pantalla solo los de la etapa que toca
       (no se amontonan). El siguiente punto brilla siempre o solo al pedir pista (💡), según la ayuda elegida.
       Tocar otro número no castiga: dice cuál es y cuál toca.
     · Repasar: cada etapa tiene varios trazos (curvas, esquinas, detalles interiores) con camino ancho y la misma
       tolerancia de Repasar; salirse no borra nada.
   Arriba, una tira con las partes: hechas (con su dibujo y ✓), la actual y las que faltan (?).
   El avance se guarda al momento («lv_etapas»): se puede salir y seguir más tarde donde se dejó.
   Al terminar: +1 ⭐ (como un dibujo de Unir puntos o de Repasar; sin logros nuevos) y se puede colorear y guardar
   en Pintar (mismo cubo, mismo «Guardar» en «Mis dibujos»).
   ===================================================================== */
(function () {
  'use strict';
  const U = window.PENSAR_UTIL, IL = window.ILUSTRACIONES, NS = 'http://www.w3.org/2000/svg';
  const { barra } = U;
  const NIV = [30, 45, 60], MINL = 170, CLAVE = 'lv_etapas';
  const AYUDA_DEF = [true, false, false];   // con 30 puntos el siguiente brilla siempre; con 45 y 60, al pedir pista

  /* ---------- datos guardados (solo se añade «lv_etapas»; se valida al leer) ---------- */
  function leer() {
    const v = store.get(CLAVE, null), o = { v: 1, nivel: 0, ayuda: null, hechos: {}, curso: {} };
    if (v && typeof v === 'object') {
      o.nivel = clamp(v.nivel | 0, 0, NIV.length - 1);
      if (typeof v.ayuda === 'boolean') o.ayuda = v.ayuda;
      if (v.hechos && typeof v.hechos === 'object') for (const k in v.hechos) if (IL[k.split(':')[0]]) o.hechos[k] = v.hechos[k] | 0;
      if (v.curso && typeof v.curso === 'object') for (const k in v.curso) if (IL[k.split(':')[0]] && v.curso[k] && typeof v.curso[k] === 'object') o.curso[k] = v.curso[k];
    }
    return o;
  }
  const guardar = o => store.set(CLAVE, o);
  const cambiar = f => { const o = leer(); f(o); guardar(o); return o; };
  const ayudaDe = o => o.ayuda === null ? AYUDA_DEF[o.nivel] : o.ayuda;

  /* ---------- medir los trazos ---------- */
  const medidor = document.createElementNS(NS, 'svg'); medidor.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden'); document.body.appendChild(medidor);
  const MED = {};
  function medir(d) {
    if (MED[d]) return MED[d];
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); medidor.appendChild(p);
    const L = p.getTotalLength(), n = Math.max(60, Math.ceil(L / 5)), m = [];
    for (let i = 0; i <= n; i++) { const s = L * i / n, q = p.getPointAtLength(s); m.push([q.x, q.y, s]); }
    p.remove(); return (MED[d] = { L, m });
  }
  // los trazos de un dibujo, en orden, con su etapa
  function trazos(il) { const r = []; il.etapas.forEach((e, ei) => e.t.forEach((t, ti) => r.push({ ei, ti, d: t.d, c: !!t.c, w: t.w || 1, ...medir(t.d) }))); return r; }

  /* ---------- los puntos de un trazo: en las esquinas y repartidos por igual, sin amontonarse ---------- */
  function puntosTrazo(tr, N, minD) {
    const m = tr.m, M = m.length - 1, paso = tr.L / M, k = Math.max(2, Math.round(48 / paso));   // ventana de unas 48 unidades: también ve las esquinas redondeadas
    const ult = tr.c ? M - 1 : M;   // en un trazo cerrado el último punto repite el primero
    const ang = i => { if (!tr.c && (i - k < 0 || i + k > M)) return 0;
      const a = m[(i - k + M) % M], b = m[(i + k) % M], q = m[i], v1 = [q[0] - a[0], q[1] - a[1]], v2 = [b[0] - q[0], b[1] - q[1]];
      return Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2) || 1), -1, 1)); };
    const A = []; for (let i = 0; i <= ult; i++) A.push(ang(i));
    let esq = []; for (let i = 0; i <= ult; i++) { if (A[i] < .6) continue; let max = true; for (let j = -k; j <= k; j++) { const x = tr.c ? (i + j + M) % M : i + j; if (j && x >= 0 && x <= ult && A[x] > A[i]) max = false; } if (max) esq.push(i); }
    const huecos = tr.c ? N : N - 1, idx = [];
    for (let j = 0; j < N; j++) { const b = Math.round(j * M / huecos); let mejor = Math.min(b, ult), dm = M / huecos * .45;
      if (!(!tr.c && (j === 0 || j === N - 1))) for (const e of esq) { const d = Math.abs(e - b); if (d < dm) { dm = d; mejor = e; } }
      idx.push(mejor); }
    esq.forEach(e => { if (A[e] > 1.0 && !idx.some(i => Math.abs(i - e) <= k)) idx.push(e); });   // ninguna esquina marcada se pierde
    let orden = [...new Set(idx)].sort((a, b) => a - b), quedan = [];
    for (const i of orden) { const q = m[i]; if (quedan.some(u => Math.hypot(q[0] - m[u][0], q[1] - m[u][1]) < minD)) continue; quedan.push(i); }
    if (!tr.c && quedan[quedan.length - 1] !== M) { const q = m[M]; while (quedan.length > 1 && Math.hypot(q[0] - m[quedan[quedan.length - 1]][0], q[1] - m[quedan[quedan.length - 1]][1]) < minD) quedan.pop(); quedan.push(M); }
    let pts = quedan.map(i => [Math.round(m[i][0]), Math.round(m[i][1])]);
    if (tr.c) {   // cerrados: en el sentido de las agujas del reloj, empezando arriba a la izquierda
      const area = pts.reduce((a, q, i) => { const r = pts[(i + 1) % pts.length]; return a + q[0] * r[1] - r[0] * q[1]; }, 0); if (area < 0) pts.reverse();
      let i0 = 0; pts.forEach((q, i) => { if (q[1] + q[0] * .3 < pts[i0][1] + pts[i0][0] * .3) i0 = i; }); pts = [...pts.slice(i0), ...pts.slice(0, i0)];
    }
    return pts;
  }
  // reparte N puntos entre los trazos según lo largos y lo curvos que son (los muy cortos se dibujan solos);
  // se ajusta hasta acercarse al total pedido (las esquinas y la separación mínima pueden sumar o quitar alguno)
  function giro(t) { let a = 0; const m = t.m, k = Math.max(1, Math.round(m.length / 80));
    for (let i = k; i + k < m.length; i += k) { const u = Math.atan2(m[i][1] - m[i - k][1], m[i][0] - m[i - k][0]), v = Math.atan2(m[i + k][1] - m[i][1], m[i + k][0] - m[i][0]);
      let d = Math.abs(v - u); if (d > Math.PI) d = 2 * Math.PI - d; a += d; } return a; }
  function prepararPuntos(id, N, minD) {
    const trs = trazos(IL[id]), largos = trs.filter(t => t.L >= MINL);
    trs.forEach(t => { t.auto = t.L < MINL; t.pts = []; t.peso = (t.L + 70 * giro(t)) * t.w; });
    const suma = largos.reduce((a, t) => a + t.peso, 0); let f = 1;
    for (let vuelta = 0; vuelta < 5; vuelta++) {
      largos.forEach(t => { t.pts = puntosTrazo(t, Math.max(t.c ? 4 : 2, Math.round(f * N * t.peso / suma)), minD); });
      const tot = largos.reduce((a, t) => a + t.pts.length, 0); if (Math.abs(tot - N) <= 2) break; f *= N / tot;
    }
    return trs;
  }
  // dónde va cada número: hacia fuera y lejos de los demás puntos, números y del propio trazo
  function sitiosNumeros(trs) {
    const obst = [], res = new Map();
    trs.forEach(t => { t.pts.forEach(q => obst.push([q[0], q[1], 1])); for (let i = 0; i < t.m.length; i += 6) obst.push([t.m[i][0], t.m[i][1], .8]); });
    const cx = trs.reduce((a, t) => a + t.pts.reduce((b, q) => b + q[0], 0), 0) / Math.max(1, trs.reduce((a, t) => a + t.pts.length, 0));
    const cy = trs.reduce((a, t) => a + t.pts.reduce((b, q) => b + q[1], 0), 0) / Math.max(1, trs.reduce((a, t) => a + t.pts.length, 0));
    trs.forEach(t => t.pts.forEach((q, i) => {
      let mejor = null, ms = -1e9;
      for (let a = 0; a < 16; a++) { const ang = a * Math.PI / 8, R = 64, x = q[0] + R * Math.cos(ang), y = q[1] + R * Math.sin(ang);
        if (x < -10 || x > 1010 || y < 0 || y > 1030) continue;
        let dmin = 1e9; for (const o of obst) { const d = Math.hypot(o[0] - x, o[1] - y) / o[2]; if (d < dmin) dmin = d; }
        const fuera = ((x - q[0]) * (q[0] - cx) + (y - q[1]) * (q[1] - cy)) / (R * (Math.hypot(q[0] - cx, q[1] - cy) || 1));
        const s = Math.min(dmin, 70) + fuera * 12; if (s > ms) { ms = s; mejor = [x, y]; } }
      mejor = mejor || [q[0], q[1] - 64]; res.set(t.pts[i], mejor); obst.push([mejor[0], mejor[1], .7]);
    }));
    return res;
  }

  /* ---------- pantallas ---------- */
  const IDS = Object.keys(IL);
  const el = (tag, at, padre) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; };
  const lineas = (il, ancho = 10) => { let s = ''; il.etapas.forEach(e => e.t.forEach(t => { s += `<path d="${t.d}"/>`; })); il.extra.forEach(d => { s += `<path d="${d}"/>`; });
    return `<g fill="none" stroke="#4a3a5c" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round">${s}</g>`; };
  document.getElementById('logros').insertAdjacentHTML('beforebegin', `
<section class="screen pn" id="grandes">
  ${barra('m-paint', 'Por partes', '<button class="btn" id="grSay" aria-label="Repetir">🗣️</button>')}
  <div class="grLista" id="grLista"></div>
</section>
<section class="screen pn" id="etapa">
  ${barra('grandes', '<span id="etTitulo"></span>', '<button class="btn" id="etPista" aria-label="Pista">💡</button><button class="btn" id="etSay" aria-label="Repetir">🗣️</button>')}
  <div class="subbar etSub"><div class="etPasos" id="etPasos"></div><div class="etOpc" id="etOpc"></div></div>
  <div class="pnWrap"><div class="pnTablero2" id="etTablero"><svg id="etSvg" viewBox="-40 -40 1080 1080" aria-label="Dibujo por partes"></svg></div>
    <div class="pnLado"><div class="pnTexto" id="etTexto"></div>
      <div class="pnAcciones" id="etFin" hidden><button class="btn pnAccion pnPintar" id="etPintar">🎨 ¡A pintar!</button><button class="btn pnAccion" id="etOtro">▶ Otro</button></div></div></div>
</section>`);
  $$('#m-paint .menu').forEach(m => m.insertAdjacentHTML('beforeend', '<button class="big c5" data-go="grandes"><span class="ill" data-ill="grandes"></span>Dibujos por partes</button>'));
  ILL.grandes = svg(`<g transform="translate(6 4) scale(.108)">
      <path d="${IL.buho.etapas[0].t[0].d}" fill="#c9b6ff"/><path d="${IL.buho.etapas[1].t[0].d}" fill="#fff3d6"/>
      <path d="${IL.buho.etapas[2].t[0].d}" fill="#a083ff"/><path d="${IL.buho.etapas[2].t[1].d}" fill="#a083ff"/>
      <path d="${IL.buho.etapas[3].t[0].d}" fill="#ffab73"/></g>
    <g transform="translate(6 4) scale(.108)" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">
      ${IL.buho.etapas.slice(0, 4).map(e => e.t.map(t => `<path d="${t.d}"/>`).join('')).join('')}
      <circle cx="352" cy="362" r="58" fill="#fff"/><circle cx="508" cy="362" r="58" fill="#fff"/><circle cx="362" cy="372" r="18" fill="${INK}"/><circle cx="498" cy="372" r="18" fill="${INK}"/></g>
    ${[[96, 22], [104, 70], [20, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" stroke="${INK}" stroke-width="3.5"/>`).join('')}`);
  paintIll();

  /* ---------- elegir dibujo y manera ---------- */
  const ICO_PU = ILL.puntos, ICO_RP = ILL.repasar;
  function lista() {
    const o = leer(), box = $('#grLista'); box.innerHTML = '';
    IDS.forEach(id => {
      const il = IL[id], c = document.createElement('div'); c.className = 'grCarta';
      const marca = m => (o.curso[id + ':' + m] ? '<i class="grSigue" aria-label="a medias"></i>' : '') + (o.hechos[id + ':' + m] ? '<i class="grHecho" aria-label="terminado"></i>' : '');
      const visto = o.hechos[id + ':pu'] || o.hechos[id + ':rp'];   // hasta terminarlo, solo se ve una pista: la primera parte
      c.innerHTML = `<div class="grDibW">${visto ? `<svg class="grDib" viewBox="-30 -30 1060 1060" aria-hidden="true">${lineas(il, 14)}</svg>`
        : `<svg class="grDib grMisterio" viewBox="-30 -30 1060 1060" aria-hidden="true"><g fill="#f4effd" stroke="#c9b6ff" stroke-width="16" stroke-dasharray="4 30" stroke-linecap="round">${il.etapas[0].t.map(t => `<path d="${t.d}"/>`).join('')}</g><text x="500" y="640" text-anchor="middle">?</text></svg>`}</div>
        <div class="grBotones"><button class="btn grModo" data-m="pu" aria-label="${il.titulo}: unir puntos">${ICO_PU}${marca('pu')}</button>
        <button class="btn grModo" data-m="rp" aria-label="${il.titulo}: repasar">${ICO_RP}${marca('rp')}</button></div>`;
      c.querySelectorAll('.grModo').forEach(b => b.onclick = () => { sfx.pop(); go('etapa', id + ':' + b.dataset.m); });
      box.appendChild(c);
    });
  }
  $('#grSay').onclick = () => say('Elige un dibujo. Con los puntos, unes los números. Con el lápiz, repasas el camino.');
  onShow.grandes = () => { showStars(); lista(); setTimeout(() => { if (current === 'grandes') say('Elige un dibujo: unir puntos o repasar.'); }, 300); };

  /* ---------- estado del juego ---------- */
  const et = { id: '', modo: '', il: null, trs: [], e: 0, j: 0, i: 0, prog: 0, turno: 0, hecho: false, fallos: 0, fallosTot: 0, pistas: 0, fuera: 0, apuros: 0, sobre: false, demo: 0 };
  const g = () => $('#etSvg');
  const clv = () => et.id + ':' + et.modo;
  const deEtapa = e => et.trs.filter(t => t.ei === e);
  const jugables = e => deEtapa(e).filter(t => et.modo === 'rp' || !t.auto);
  const actual = () => jugables(et.e)[et.j];
  function guardarCurso() {
    if (et.hecho) return;
    cambiar(o => { o.curso[clv()] = et.modo === 'pu'
      ? { v: 1, N: et.N, e: et.e, j: et.j, i: et.i, pts: et.trs.map(t => t.pts) }
      : { v: 1, e: et.e, j: et.j, prog: Math.round(et.prog) }; });
  }
  // la tira de partes: hecha (su dibujo y ✓), la de ahora (resaltada) y las que faltan (?)
  function pasos() {
    const box = $('#etPasos'); box.innerHTML = '';
    et.il.etapas.forEach((st, i) => {
      const s = document.createElement('span'); s.className = 'etPaso' + (i < et.e || et.hecho ? ' hecho' : i === et.e ? ' ahora' : '');
      s.setAttribute('aria-label', (i < et.e || et.hecho ? 'hecha: ' : i === et.e ? 'ahora: ' : 'falta: ') + st.n);
      s.innerHTML = i <= et.e || et.hecho ? `<svg viewBox="-60 -60 1120 1120">${st.t.map(t => `<path d="${t.d}"/>`).join('')}</svg>` : '<b>?</b>';
      box.appendChild(s);
    });
  }
  function opciones() {
    const box = $('#etOpc'); box.innerHTML = ''; if (et.modo !== 'pu') return;
    const o = leer();
    NIV.forEach((n, i) => { const b = document.createElement('button'); b.className = 'btn pnChip' + (i === o.nivel ? ' sel' : ''); b.textContent = n; b.setAttribute('aria-label', n + ' puntos');
      b.onclick = () => { sfx.pop(); elegirNivel(i); }; box.appendChild(b); });
    const a = document.createElement('button'); a.className = 'btn pnChip etAyuda' + (ayudaDe(o) ? ' sel' : ''); a.setAttribute('aria-label', ayudaDe(o) ? 'Ayuda: el siguiente brilla siempre' : 'Ayuda: brilla solo con pista');
    a.innerHTML = `<svg viewBox="0 0 100 100" class="rpIco"><circle cx="50" cy="50" r="20" style="fill:${ayudaDe(o) ? '#ffd46b' : '#fff'};stroke:#4a3a5c;stroke-width:8px"/>${ayudaDe(o) ? '<path d="M50 10V20M50 80V90M10 50H20M80 50H90M22 22L29 29M71 71L78 78M78 22L71 29M29 71L22 78"/>' : ''}</svg>`;
    a.onclick = () => { sfx.pop(); const v = !ayudaDe(leer()); cambiar(o => { o.ayuda = v; }); opciones(); marcarSig(); say(v ? 'El siguiente punto brillará siempre.' : 'Ahora el siguiente no brilla. Si lo necesitas, pide pista con la bombilla.'); };
    box.appendChild(a);
  }
  function elegirNivel(i) {
    const empezado = et.e > 0 || et.j > 0 || et.i > 0;
    cambiar(o => { o.nivel = i; o.ayuda = null; if (!empezado) delete o.curso[clv()]; });
    if (empezado) { opciones(); say(`El próximo dibujo tendrá ${NIV[i]} puntos. Este lo acabamos como está.`); return; }
    empezar(et.id, et.modo);
  }

  /* ---------- empezar o seguir ---------- */
  function empezar(id, modo) {
    const t = ++et.turno, o = leer(), il = IL[id];
    Object.assign(et, { id, modo, il, e: 0, j: 0, i: 0, prog: 0, hecho: false, fallos: 0, fallosTot: 0, pistas: 0, fuera: 0, apuros: 0, sobre: false });
    $('#etTitulo').textContent = 'Por partes';   // sin el nombre del dibujo: no se desvela la sorpresa (lo dice al terminar) $('#etFin').hidden = true; $('#etPista').hidden = false;
    ladoEt(); const tam = g().getBoundingClientRect().width || 340, minD = Math.max(60, 22 * 1080 / tam);
    const guardado = o.curso[id + ':' + modo]; let sigue = false;
    if (modo === 'pu') {
      et.N = NIV[o.nivel]; et.trs = prepararPuntos(id, et.N, minD);
      if (guardado && Array.isArray(guardado.pts) && guardado.pts.length === et.trs.length && guardado.pts.every(p => Array.isArray(p))) {
        et.N = guardado.N | 0 || et.N; et.trs.forEach((tr, k) => { tr.pts = guardado.pts[k].filter(q => Array.isArray(q) && q.length === 2).map(q => [+q[0], +q[1]]); tr.auto = tr.L < MINL || !tr.pts.length; });
        sigue = true;
      }
      let n = 1; et.trs.forEach(tr => { tr.num0 = n; n += tr.pts.length; }); et.total = n - 1;
    } else { et.trs = trazos(il); sigue = !!guardado; }
    if (sigue) { et.e = clamp(guardado.e | 0, 0, il.etapas.length - 1); et.j = clamp(guardado.j | 0, 0, Math.max(0, jugables(et.e).length - 1));
      if (modo === 'pu') et.i = clamp(guardado.i | 0, 0, (actual() || { pts: [0] }).pts.length - 1); else et.prog = clamp(+guardado.prog || 0, 0, (actual() || { L: 0 }).L); }
    dibujar(); opciones(); pasos();
    const st = il.etapas[et.e];
    $('#etTexto').textContent = sigue ? '¡Seguimos donde lo dejaste!' : (modo === 'pu' ? '¡Une los puntos en orden!' : 'Repasa el camino.');
    setTimeout(() => { if (t !== et.turno) return;
      if (sigue) say('¡Seguimos donde lo dejaste! ' + (modo === 'pu' ? `Toca el ${numSig()}.` : 'Sigue desde el punto que brilla.'));
      else say(st.voz + (modo === 'pu' ? ' Empieza en el uno.' : ' Pon el dedo en el punto que brilla y sigue el camino.'));
      if (modo === 'rp') demo(380); }, 300);
    guardarCurso();
    requestAnimationFrame(ladoEt);
  }
  function ladoEt() { const tb = $('#etTablero'); if (!tb.offsetParent) return; const s = Math.floor(Math.min(tb.clientWidth, tb.clientHeight) - 4); g().style.width = g().style.height = Math.max(s, 200) + 'px'; }
  addEventListener('resize', () => { if (current === 'etapa') ladoEt(); });

  // lo ya hecho: las etapas anteriores dibujadas en limpio
  function dibujar() {
    const s = g(); s.innerHTML = ''; s.classList.remove('fin');
    et.hechoG = el('g', { class: 'etHecho' }, s);
    et.trs.forEach(t => { if (t.ei < et.e) el('path', { d: t.d }, et.hechoG); });
    et.capa = el('g', {}, s);
    if (et.modo === 'pu') etapaPu(); else etapaRp();
  }

  /* =====================================================================
     UNIR PUNTOS
     ===================================================================== */
  const numSig = () => { const t = actual(); return t ? t.num0 + et.i : 0; };
  function etapaPu() {
    const c = et.capa; c.innerHTML = '';
    const lista = jugables(et.e), sitios = sitiosNumeros(lista);
    lista.forEach((t, k) => {
      t.linea = el('polyline', { points: '', class: 'puLinea' }, c);
      if (k < et.j) { t.linea.remove(); t.linea = null; el('path', { d: t.d }, et.hechoG); return; }
      t.grupos = t.pts.map((q, i) => {
        const gr = el('g', { class: 'puPunto' + (k === et.j && i < et.i ? ' hecho' : ''), 'data-n': t.num0 + i }, c);
        el('circle', { cx: q[0], cy: q[1], r: 46, class: 'puAro' }, gr); el('circle', { cx: q[0], cy: q[1], r: 19, class: 'puBola' }, gr);
        const p = sitios.get(q), tx = el('text', { x: p[0], y: p[1] + 15, class: 'puNum' }, gr); tx.textContent = t.num0 + i;
        return gr;
      });
      if (k === et.j && et.i > 0) t.linea.setAttribute('points', t.pts.slice(0, et.i).map(q => q.join(',')).join(' '));
    });
    // los trazos cortos de esta etapa (la sonrisa…) aparecen solos al acabarla
    et.guia = el('line', { class: 'puGuia', x1: 0, y1: 0, x2: 0, y2: 0 }, c);
    marcarSig();
    // una parte solo de detalles pequeños (el ojo y la sonrisa del unicornio): aparece sola
    if (!lista.length) { const tt = et.turno; et.ocupado = true; setTimeout(() => { if (tt !== et.turno) return; et.ocupado = false; etapaHecha(); }, 1200); }
  }
  function marcarSig(pista) {
    if (et.modo !== 'pu' || et.hecho) return; const t = actual(); if (!t) return;
    g().querySelectorAll('.puPunto.sig').forEach(x => x.classList.remove('sig'));
    if (pista || ayudaDe(leer())) t.grupos[et.i].classList.add('sig');
    if (pista && et.i > 0) { const a = t.pts[et.i - 1], q = t.pts[et.i]; Object.entries({ x1: a[0], y1: a[1], x2: q[0], y2: q[1] }).forEach(([k, v]) => et.guia.setAttribute(k, v)); et.guia.classList.add('on'); }
  }
  function unirPu() {
    const t = actual(), q = t.pts[et.i], gr = t.grupos[et.i];
    gr.classList.remove('sig'); gr.classList.add('hecho'); et.guia.classList.remove('on'); clearTimeout(et.tPista);
    t.linea.setAttribute('points', (t.linea.getAttribute('points') + ' ' + q.join(',')).trim());
    const n = t.num0 + et.i; tone(440 + (n % 24) * 15, .12, 'triangle', .1); say(String(n)); et.fallos = 0;
    et.i++;
    if (et.i < t.pts.length) { marcarSig(); guardarCurso(); return; }
    // trazo terminado: se cierra si es cerrado y queda en limpio
    if (t.c) t.linea.setAttribute('points', t.linea.getAttribute('points') + ' ' + t.pts[0].join(','));
    const tt = et.turno; et.ocupado = true;
    setTimeout(() => { if (tt !== et.turno) return; et.ocupado = false;
      t.grupos.forEach(x => x.remove()); t.linea.remove(); const p = el('path', { d: t.d, class: 'etNuevo' }, et.hechoG);
      et.j++; et.i = 0;
      if (et.j < jugables(et.e).length) { marcarSig(); guardarCurso(); say(`¡Muy bien! Ahora empieza en el ${numSig()}.`); return; }
      etapaHecha(); }, 380);
  }
  function tocarPu(e, inicio) {
    if (et.hecho || et.ocupado || current !== 'etapa' || et.modo !== 'pu') return; const t = actual(); if (!t) return;
    const p = aSvg(e), q = t.pts[et.i], u = upp(), d = Math.hypot(p.x - q[0], p.y - q[1]) / u;
    if (d <= (inicio ? 44 : 30)) { unirPu(); return; }
    if (!inicio) return;
    // ¿ha tocado otro número? se le dice cuál es (sin castigo)
    let otro = null, dm = 44; jugables(et.e).forEach((tr, k) => { if (k < et.j) return; tr.pts.forEach((r, i) => { if (k === et.j && i < et.i) return; const dd = Math.hypot(p.x - r[0], p.y - r[1]) / u; if (dd < dm) { dm = dd; otro = tr.num0 + i; } }); });
    et.fallos++; et.fallosTot++; sfx.bad();
    if (otro) say(`Ese es el ${otro}. Busca el ${numSig()}.`);
    else say(`Busca el ${numSig()}.`);
    if (et.fallos >= 3) { marcarSig(true); say(`Mira, el ${numSig()} es el que brilla.`); }
  }
  function pista() {
    if (et.hecho) return; et.pistas++; sfx.pop();
    if (et.modo === 'pu') { marcarSig(true); clearTimeout(et.tPista); et.tPista = setTimeout(() => { et.guia.classList.remove('on'); marcarSig(); }, 4500);
      say(et.i > 0 ? `Busca el ${numSig()}: sigue la rayita desde el ${numSig() - 1}.` : `Busca el ${numSig()}: es el que brilla.`); }
    else { say('Sigue desde el punto que brilla.'); demo(420); }
  }

  /* =====================================================================
     REPASAR
     ===================================================================== */
  function etapaRp() {
    const c = et.capa; c.innerHTML = '';
    et.rtr = deEtapa(et.e).map((t, k) => {
      const guia = el('path', { d: t.d, class: 'rpGuia' + (k > et.j ? ' espera' : k < et.j ? ' hecho' : '') }, c);
      const linea = el('path', { d: t.d, class: 'rpLinea' + (k > et.j ? ' espera' : k < et.j ? ' hecho' : '') }, c);
      const tinta = el('path', { d: t.d, class: 'rpTinta' }, c); tinta.style.strokeDasharray = k < et.j ? 'none' : `${k === et.j ? et.prog : 0} ${t.L + 10}`;
      return { ...t, guia, linea, tinta };
    });
    et.flechas = el('g', { class: 'rpFlechas' }, c); flechas();
    et.marca = el('circle', { r: 34, class: 'rpMarca' }, c); et.dedo = el('circle', { r: 16, class: 'rpDedo' }, c); et.demoEl = el('circle', { r: 22, class: 'rpDemo' }, c);
    marcarRp();
  }
  const T = () => et.rtr && et.rtr[et.j];
  function flechas() {
    const t = T(), f = et.flechas; f.innerHTML = ''; if (!t) return; const paso = Math.max(150, t.L / 7);
    for (let s = 90; s < t.L - 60; s += paso) { const a = t.guia.getPointAtLength(s), b = t.guia.getPointAtLength(Math.min(t.L, s + 4)), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      el('path', { d: 'M-12 -14L10 0L-12 14', transform: `translate(${a.x} ${a.y}) rotate(${ang})` }, f); }
  }
  function marcarRp() { const t = T(); if (!t) return; const q = t.guia.getPointAtLength(et.prog); et.marca.setAttribute('cx', q.x); et.marca.setAttribute('cy', q.y); t.tinta.style.strokeDasharray = `${et.prog} ${t.L + 10}`; }
  function demo(largo) {
    const t = T(), d = et.demoEl; if (!t || !d) return; const id = ++et.demo, s0 = et.prog, s1 = Math.min(t.L, s0 + largo), t0 = performance.now(), dur = 1400;
    d.classList.add('on');
    const paso = now => { if (id !== et.demo || et.hecho) { d.classList.remove('on'); return; } const f = Math.min(1, (now - t0) / dur), q = t.guia.getPointAtLength(s0 + (s1 - s0) * f);
      d.setAttribute('cx', q.x); d.setAttribute('cy', q.y); if (f < 1) requestAnimationFrame(paso); else setTimeout(() => d.classList.remove('on'), 250); };
    requestAnimationFrame(paso);
  }
  function proyectar(p) {   // cerca de por donde va (no deja atajos); tolerancia de Repasar: unos 34 px
    const t = T(), ven = Math.max(200, t.L * .12), tol = Math.max(70, 34 * upp());
    let mejor = null, dm = 1e9; for (const q of t.m) { if (q[2] < et.prog - 60 || q[2] > et.prog + ven) continue; const d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < dm) { dm = d; mejor = q; } }
    return mejor && dm <= tol ? mejor[2] : null;
  }
  function moverRp(e, inicio) {
    if (et.hecho || et.ocupado || current !== 'etapa' || et.modo !== 'rp' || !T()) return; const p = aSvg(e);
    et.dedo.setAttribute('cx', p.x); et.dedo.setAttribute('cy', p.y); et.dedo.classList.add('on');
    const s = proyectar(p);
    if (s === null) { if (et.sobre || inicio) { et.sobre = false; et.fuera++; avisoFuera(); } return; }
    if (!et.sobre) { et.sobre = true; et.marca.classList.add('tocando'); }
    if (s > et.prog) { const antes = et.prog; et.prog = s; marcarRp(); if (Math.floor(antes / 120) !== Math.floor(s / 120)) tone(500 + s / T().L * 300, .06, 'sine', .05); }
    if (et.prog >= T().L - Math.max(28, T().L * .03)) trazoRp();
  }
  let ultimoAviso = 0;
  function avisoFuera() {
    et.marca.classList.remove('tocando'); const ahora = performance.now(); if (ahora - ultimoAviso < 2500) return; ultimoAviso = ahora;
    if (et.fuera >= 2) { et.apuros++; say('¡Por aquí! Sigue desde el punto que brilla.'); demo(320); et.fuera = 0; } else say('Vuelve al camino: sigue desde el punto que brilla.');
  }
  function trazoRp() {
    const t = T(); et.prog = t.L; marcarRp(); t.guia.classList.add('hecho'); t.linea.classList.add('hecho'); t.tinta.style.strokeDasharray = 'none'; sfx.good();
    et.j++; et.prog = 0; et.sobre = false; et.fuera = 0;
    if (et.j < et.rtr.length) { const N = T(); N.guia.classList.remove('espera'); N.linea.classList.remove('espera'); flechas(); marcarRp(); guardarCurso(); say('¡Muy bien! Ahora este otro.'); demo(300); return; }
    etapaHecha();
  }

  /* ---------- etapa terminada y dibujo terminado ---------- */
  function etapaHecha() {
    const st = et.il.etapas[et.e];
    deEtapa(et.e).forEach(t => { if (et.modo === 'pu' && t.auto) el('path', { d: t.d, class: 'etNuevo' }, et.hechoG); });
    if (et.modo === 'rp') deEtapa(et.e).forEach(t => el('path', { d: t.d, class: 'etNuevo' }, et.hechoG));
    et.e++; et.j = 0; et.i = 0; et.prog = 0;
    if (et.e >= et.il.etapas.length) { terminar(); return; }
    sfx.good(); guardarCurso();
    const tt = et.turno, sig = et.il.etapas[et.e]; et.ocupado = true;
    $('#etTexto').textContent = `¡Ya está ${st.n}!`; say(`¡Ya está ${st.n}!`);
    setTimeout(() => { if (tt !== et.turno) return; et.ocupado = false; pasos(); et.capa.innerHTML = '';
      if (et.modo === 'pu') etapaPu(); else etapaRp();
      $('#etTexto').textContent = sig.voz; say(sig.voz + (et.modo === 'pu' ? ` Empieza en el ${numSig()}.` : '')); if (et.modo === 'rp') demo(380); }, 1300);
  }
  function terminar() {
    et.hecho = true; const tt = et.turno, s = g(); et.capa.innerHTML = '';
    const o = cambiar(o => { delete o.curso[clv()]; o.hechos[clv()] = (o.hechos[clv()] | 0) + 1; });
    pasos(); $('#etPista').hidden = true;
    setTimeout(() => {
      if (tt !== et.turno) return; s.classList.add('fin'); s.querySelectorAll('.etHecho').forEach(x => x.remove());
      const arte = el('g', { class: 'puArte' }, s); et.trs.forEach(t => el('path', { d: t.d }, arte)); et.il.extra.forEach(d => el('path', { d }, arte));
      sfx.good(); confetti(); addStar(); say(et.il.fin + ' ¿Lo pintamos?'); $('#etTexto').textContent = et.il.fin; $('#etFin').hidden = false;
      // con pocas ayudas, el próximo con más puntos (sin bajar nunca)
      if (et.modo === 'pu' && et.fallosTot <= 4 && et.pistas <= 2 && o.nivel < NIV.length - 1 && et.N >= NIV[o.nivel]) {
        cambiar(x => { x.nivel = o.nivel + 1; x.ayuda = null; }); opciones(); setTimeout(() => say(`¡La próxima vez, con ${NIV[o.nivel + 1]} puntos!`), 2600); }
    }, 450);
  }

  /* ---------- toques ---------- */
  const aSvg = e => { const s = g(), pt = s.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(s.getScreenCTM().inverse()); };
  const upp = () => 1080 / g().getBoundingClientRect().width;
  let dedoId = null;
  g().addEventListener('pointerdown', e => { e.preventDefault(); dedoId = e.pointerId; try { g().setPointerCapture(e.pointerId); } catch (_) {}
    if (et.modo === 'pu') tocarPu(e, true); else { et.sobre = false; moverRp(e, true); } });
  g().addEventListener('pointermove', e => { if (dedoId !== e.pointerId) return; if (et.modo === 'pu') tocarPu(e, false); else moverRp(e, false); });
  const soltar = e => { if (dedoId !== e.pointerId) return; dedoId = null; et.sobre = false;
    if (et.modo === 'rp') { if (et.dedo) et.dedo.classList.remove('on'); if (et.marca) et.marca.classList.remove('tocando'); guardarCurso(); } };
  g().addEventListener('pointerup', soltar); g().addEventListener('pointercancel', soltar);
  $('#etPista').onclick = pista;
  $('#etSay').onclick = () => say(et.hecho ? '¿Lo pintamos? Toca el pincel.' : et.il.etapas[et.e].voz + (et.modo === 'pu' ? ` Toca el ${numSig()}.` : ' Sigue desde el punto que brilla.'));
  $('#etOtro').onclick = () => { sfx.pop(); go('grandes'); };

  /* ---------- pintar en Pintar, como una lámina (no sale en «Colorear dibujos») ---------- */
  IDS.forEach(id => Object.defineProperty(TPL, 'gd:' + id, { enumerable: false, value: gg => { const il = IL[id]; il.etapas.forEach(e => e.t.forEach(t => gg.d(t.d))); il.extra.forEach(d => gg.d(d)); } }));
  $('#etPintar').onclick = () => { sfx.pop(); go('paint', 'gd:' + et.id); };
  { const abrir = onShow.paint; onShow.paint = arg => { const r = abrir(arg); const b = $('#paint .ptools [data-go]'); if (b && String(arg).startsWith('gd:')) b.dataset.go = 'grandes'; return r; }; }

  onShow.etapa = arg => { showStars(); const [id, modo] = String(arg || '').split(':'); if (!IL[id] || !['pu', 'rp'].includes(modo)) { go('grandes'); return; } empezar(id, modo); };
  onLeave.etapa = () => { if (!et.hecho && et.id) guardarCurso(); et.turno++; et.demo++; et.ocupado = false; clearTimeout(et.tPista); };

  window.ETAPAS = { et, NIV, CLAVE, leer, prepararPuntos, puntosTrazo, empezar, actual, numSig, jugables };
})();
