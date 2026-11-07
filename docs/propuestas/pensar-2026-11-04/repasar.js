/* =====================================================================
   Repasar dibujos (copia aislada de Pensar, 3.ª entrega, 07/11/2026) · menú Pintar
   Seguir con el dedo un camino ancho: líneas, curvas, formas y, después, dibujos completos. Tolerancia generosa
   (unos 34 px alrededor del camino); salirse no reinicia ni quita nada: el avance se queda donde estaba y un punto que
   brilla enseña por dónde seguir. Al terminar aparece el dibujo entero, +1 ⭐ (como un acierto) y se puede colorear y
   guardar en Pintar (mismo cubo, mismo «Guardar» en «Mis dibujos»). Avance guardado en «lv_repasar».
   Dibujos: los contornos de figuras.js (cerrados) y formas propias, en el mismo estilo; sin emojis.
   ===================================================================== */
(function () {
  'use strict';
  const U = window.PENSAR_UTIL, FIG = window.FIGURAS, DB = window.DIBUJOS, NS = 'http://www.w3.org/2000/svg';
  const { Nivel, barra } = U;
  const circ = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
  const circT = (x, y, r) => `M${x} ${y - r}A${r} ${r} 0 1 1 ${x - .01} ${y - r}Z`;   // círculo que empieza arriba (para repasar)
  // una figura de figuras.js en pequeño, como decoración: [id, escala, centro x, centro y]
  const fig = (id, s, cx, cy) => ({ id, s, tx: cx - 500 * s, ty: cy - 500 * s });
  /* ---------- los ejercicios ---------- */
  const NIVELES = [
    { n: 'líneas rectas', items: [
      { id: 'recta-pollito', voz: 'Lleva al pollito hasta la manzana.', fin: '¡Ya llegó a la manzana!', t: ['M260 500H740'], deco: [fig('pollito', .26, 130, 500), fig('manzana', .24, 875, 500)] },
      { id: 'recta-nube', voz: 'Haz caer la lluvia de la nube hasta la seta.', fin: '¡Ya llueve sobre la seta!', t: ['M500 270V735'], deco: [fig('nube', .3, 500, 150), fig('seta', .24, 500, 865)] },
      { id: 'recta-globo', voz: 'Lleva el globo hasta la estrella.', fin: '¡El globo llegó a la estrella!', t: ['M265 740L735 270'], deco: [fig('globo', .26, 160, 845), fig('estrella', .26, 845, 155)] },
      { id: 'recta-gatito', voz: 'Lleva al gatito hasta el pez.', fin: '¡El gatito encontró el pez!', t: ['M260 265L740 735'], deco: [fig('gatito', .26, 150, 150), fig('pez', .26, 860, 850)] },
    ] },
    { n: 'curvas', items: [
      { id: 'curva-pez', voz: 'El pez salta por encima del agua hasta la hoja.', fin: '¡Qué buen salto!', t: ['M250 690Q500 120 750 690'], deco: [fig('pez', .25, 140, 760), fig('hoja', .22, 860, 760)], extra: ['M60 930Q140 890 220 930T380 930T540 930T700 930T860 930'] },
      { id: 'curva-mariposa', voz: 'La mariposa vuela haciendo olas hasta el corazón.', fin: '¡Ha llegado volando!', t: ['M250 500C330 320 420 320 500 500S670 680 750 500'], deco: [fig('mariposa', .25, 130, 500), fig('corazon', .22, 870, 500)] },
      { id: 'curva-montana', voz: 'Sube y baja las montañas.', fin: '¡Has cruzado las montañas!', t: ['M150 760L320 380L500 760L680 380L850 760'], deco: [fig('pollito', .22, 85, 880), fig('estrella', .22, 915, 880)], extra: ['M60 760H940'] },
      { id: 'curva-luna', voz: 'Lleva la luna hasta la nube por el camino curvo.', fin: '¡La luna llegó a la nube!', t: ['M310 250C760 320 240 680 690 750'], deco: [fig('luna', .24, 190, 170), fig('nube', .26, 830, 830)] },
    ] },
    { n: 'formas', items: [
      { id: 'forma-sol', voz: 'Repasa el círculo.', fin: '¡Es un sol!', t: [circT(500, 500, 250)],
        extra: Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a); return `M${(500 + 300 * c).toFixed(0)} ${(500 + 300 * s).toFixed(0)}L${(500 + 400 * c).toFixed(0)} ${(500 + 400 * s).toFixed(0)}`; })
          .concat([circ(430, 460, 22), circ(570, 460, 22), 'M420 570Q500 640 580 570']) },
      { id: 'forma-regalo', voz: 'Repasa el cuadrado.', fin: '¡Es un regalo!', t: ['M280 380H720V800H280Z'],
        extra: ['M500 380V800', 'M280 560H720', 'M500 380C420 260 320 300 380 360C420 400 480 390 500 380Z', 'M500 380C580 260 680 300 620 360C580 400 520 390 500 380Z'] },
      { id: 'forma-abeto', voz: 'Repasa el triángulo.', fin: '¡Es un abeto!', t: ['M500 150L790 740H210Z'],
        extra: ['M450 740V880H550V740', 'M330 520Q500 580 670 520', 'M280 640Q500 700 720 640', 'M500 150L470 90L500 40L530 90Z'] },
      { id: 'forma-corazon', voz: 'Repasa el corazón.', fin: '¡Es un corazón!', t: [FIG.corazon.c], extra: FIG.corazon.d },
      { id: 'forma-huevo', voz: 'Repasa el óvalo.', fin: '¡Es un huevo de colores!', t: ['M500 150C680 150 760 420 760 590C760 760 650 870 500 870C350 870 240 760 240 590C240 420 320 150 500 150Z'],
        extra: ['M268 460L340 520L420 460L500 520L580 460L660 520L732 460', 'M245 640Q500 700 755 640'] },
      { id: 'forma-estrella', voz: 'Repasa la estrella.', fin: '¡Es una estrella!', t: [FIG.estrella.c], extra: FIG.estrella.d },
    ] },
    { n: 'dibujos', items: ['globo', 'hoja', 'luna', 'pez', 'manzana', 'nube'].map(k => ({ id: 'dib-' + k, voz: 'Repasa el dibujo.', fin: `¡Es ${FIG[k].n}!`, t: [FIG[k].c], extra: FIG[k].d })) },
    { n: 'dibujos difíciles', items: ['gatito', 'osito', 'mariposa', 'conejo', 'seta', 'casa', 'helado'].map(k => ({ id: 'dif-' + k, voz: 'Repasa el dibujo.', fin: `¡Es ${FIG[k].n}!`, t: [FIG[k].c], extra: FIG[k].d })) },
    { n: 'varios trazos', items: [
      { id: 'var-pez', k: 'pez', t2: ['M440 370Q500 290 590 350', 'M390 430Q430 500 390 570'] },
      { id: 'var-casa', k: 'casa', t2: ['M430 880V680H570V880'] },
      { id: 'var-seta', k: 'seta', t2: ['M360 560H640'] },
      { id: 'var-helado', k: 'helado', t2: ['M300 520Q400 570 500 520Q600 570 700 520'] },
      { id: 'var-mariposa', k: 'mariposa', t2: ['M500 280C530 280 530 620 500 620C470 620 470 280 500 280Z'] },
      { id: 'var-gatito', k: 'gatito', t2: ['M250 230L262 380L365 302Z', 'M750 230L738 380L635 302Z'] },
    ].map(o => ({ id: o.id, voz: 'Repasa el dibujo, trazo a trazo.', fin: `¡Es ${FIG[o.k].n}!`, t: [FIG[o.k].c, ...o.t2], extra: FIG[o.k].d.filter(d => !o.t2.includes(d)) })) },
  ];
  const TODOS = {}; NIVELES.forEach(nv => nv.items.forEach(it => { TODOS[it.id] = it; it.extra = it.extra || []; it.deco = it.deco || []; }));
  const nvRp = Nivel('lv_repasar', NIVELES.length, 2);

  /* ---------- pantalla (menú Pintar) ---------- */
  document.getElementById('logros').insertAdjacentHTML('beforebegin', `
<section class="screen pn" id="repasar">
  ${barra('m-paint', 'Repasar', '<button class="btn" id="rpSay" aria-label="Repetir">🗣️</button>')}
  <div class="subbar" id="rpChips"></div>
  <div class="pnWrap"><div class="pnTablero2" id="rpTablero"><svg id="rpSvg" viewBox="-40 -40 1080 1080" aria-label="Camino para repasar"></svg></div>
    <div class="pnLado"><div class="pnTexto" id="rpTexto"></div>
      <div class="pnAcciones" id="rpFin" hidden><button class="btn pnAccion pnPintar" id="rpPintar">🎨 ¡A pintar!</button><button class="btn pnAccion" id="rpOtro">▶ Otro</button></div></div></div>
</section>`);
  $$('#m-paint .menu').forEach(m => m.insertAdjacentHTML('beforeend', '<button class="big c4" data-go="repasar"><span class="ill" data-ill="repasar"></span>Repasar</button>'));
  ILL.repasar = svg(`<path d="M18 92C30 40 70 96 82 44" fill="none" stroke="#e7defe" stroke-width="18" stroke-linecap="round"/>
    <path d="M18 92C30 40 70 96 82 44" fill="none" stroke="#a083ff" stroke-width="5" stroke-dasharray="3 9" stroke-linecap="round"/>
    <path d="M18 92C26 62 40 62 50 70" fill="none" stroke="#7a5cff" stroke-width="9" stroke-linecap="round"/>
    <path d="M72 18l18 18-38 38-22 4 4-22z" fill="#ffd46b" ${S}/><path d="M34 56l18 18" fill="none" ${S}/><circle cx="82" cy="44" r="8" fill="#ffd46b" ${S}/>`);
  paintIll();
  // iconos de los niveles (dibujados, no emojis)
  const ICONO = ['M20 50H80', 'M15 60C30 25 45 25 50 50S70 75 85 40', circ(50, 50, 32), null, null, null];
  function iconoNivel(i) {
    const d = ICONO[i]; if (d) return `<svg viewBox="0 0 100 100" class="rpIco"><path d="${d}"/></svg>`;
    const k = ['corazon', 'gatito', 'pez'][i - 3];
    return `<svg viewBox="0 0 1000 1000" class="rpIco"><path d="${FIG[k].c}" style="stroke-width:70px"/>${i === 5 ? `<path d="M440 370Q500 290 590 350" style="stroke-width:70px"/>` : ''}</svg>`;
  }
  function chipsRp() {
    const o = nvRp.get(), box = $('#rpChips'); box.innerHTML = '';
    NIVELES.forEach((nv, i) => { const b = document.createElement('button'); b.className = 'btn pnChip' + (i === o.L ? ' sel' : '') + (i <= o.max ? ' hecho' : '');
      b.innerHTML = iconoNivel(i); b.setAttribute('aria-label', 'Nivel ' + (i + 1) + ': ' + nv.n); b.onclick = () => { sfx.pop(); nvRp.elegir(i); empezarRp(); }; box.appendChild(b); });
  }
  const el = (tag, at, padre) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; };
  const decoG = (padre, dc, cls) => { const g = el('g', { transform: `translate(${dc.tx} ${dc.ty}) scale(${dc.s})`, class: cls }, padre); return g; };

  /* ---------- estado ---------- */
  const rp = { it: null, k: 0, tr: [], prog: 0, turno: 0, hecho: false, fuera: 0, apuros: 0, sobre: false, ultimas: [], demo: 0 };
  function muestras(pathEl) {   // puntos cada ~6 unidades con su longitud (para saber dónde está el dedo)
    const L = pathEl.getTotalLength(), n = Math.max(40, Math.ceil(L / 6)), m = [];
    for (let i = 0; i <= n; i++) { const s = L * i / n, q = pathEl.getPointAtLength(s); m.push([q.x, q.y, s]); }
    return { L, m };
  }
  function empezarRp(id) {
    const t = ++rp.turno, nv = NIVELES[nvRp.get().L]; chipsRp();
    if (!id) { const l = nv.items.filter(x => !rp.ultimas.includes(x.id)); id = pick(l.length ? l : nv.items).id; }
    rp.ultimas = [id, ...rp.ultimas].slice(0, 3);
    const it = rp.it = TODOS[id], g = $('#rpSvg'); g.innerHTML = ''; g.classList.remove('fin'); $('#rpFin').hidden = true;
    Object.assign(rp, { k: 0, prog: 0, hecho: false, fuera: 0, apuros: 0, sobre: false });
    // decoraciones (las figuras de los extremos) en color mientras se juega
    it.deco.forEach(dc => { const s = 1000 * dc.s, gx = el('g', { transform: `translate(${dc.tx} ${dc.ty})`, class: 'rpDeco' }, g);
      if (DB[dc.id]) { const tmp = document.createElement('div'); tmp.innerHTML = DB[dc.id].svg; const sv = tmp.querySelector('svg');
        sv.setAttribute('x', 0); sv.setAttribute('y', 0); sv.setAttribute('width', s); sv.setAttribute('height', s); sv.removeAttribute('style'); gx.appendChild(sv); }
      else { const gg = decoG(g, dc, 'rpArteDeco'); [FIG[dc.id].c, ...FIG[dc.id].d].forEach(d => el('path', { d }, gg)); } });
    rp.tr = it.t.map((d, i) => {
      const guia = el('path', { d, class: 'rpGuia' + (i ? ' espera' : '') }, g), linea = el('path', { d, class: 'rpLinea' + (i ? ' espera' : '') }, g);
      const tinta = el('path', { d, class: 'rpTinta' }, g), mu = muestras(guia); tinta.style.strokeDasharray = `0 ${mu.L + 10}`;
      return { d, guia, linea, tinta, ...mu };
    });
    rp.flechas = el('g', { class: 'rpFlechas' }, g); flechas();
    rp.marca = el('circle', { r: 34, class: 'rpMarca' }, g); rp.dedo = el('circle', { r: 16, class: 'rpDedo' }, g);
    rp.demoEl = el('circle', { r: 22, class: 'rpDemo' }, g);
    marcar(); $('#rpTexto').textContent = it.voz;
    setTimeout(() => { if (t === rp.turno) { say(it.voz + ' Pon el dedo en el punto que brilla y sigue el camino.'); demo(380); } }, 300);
    requestAnimationFrame(ladoRp);
  }
  function flechas() {   // flechitas sobre el trazo actual para ver hacia dónde se va
    const T = rp.tr[rp.k], g = rp.flechas; g.innerHTML = ''; if (!T) return;
    const paso = Math.max(150, T.L / 7);
    for (let s = 90; s < T.L - 60; s += paso) {
      const a = T.guia.getPointAtLength(s), b = T.guia.getPointAtLength(Math.min(T.L, s + 4)), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      el('path', { d: 'M-12 -14L10 0L-12 14', transform: `translate(${a.x} ${a.y}) rotate(${ang})` }, g);
    }
  }
  function marcar() {
    const T = rp.tr[rp.k]; if (!T) return; const q = T.guia.getPointAtLength(rp.prog);
    rp.marca.setAttribute('cx', q.x); rp.marca.setAttribute('cy', q.y);
    T.tinta.style.strokeDasharray = `${rp.prog} ${T.L + 10}`;
  }
  function ladoRp() { const tb = $('#rpTablero'); if (!tb.offsetParent) return; const s = Math.floor(Math.min(tb.clientWidth, tb.clientHeight) - 4); $('#rpSvg').style.width = $('#rpSvg').style.height = Math.max(s, 200) + 'px'; }
  addEventListener('resize', () => { if (current === 'repasar') ladoRp(); });
  // pista: un punto recorre el camino desde donde va (sin moverle nada a ella)
  function demo(largo) {
    const T = rp.tr[rp.k], d = rp.demoEl; if (!T || !d) return; const id = ++rp.demo, s0 = rp.prog, s1 = Math.min(T.L, s0 + largo), t0 = performance.now(), dur = 1400;
    d.classList.add('on');
    const paso = now => { if (id !== rp.demo || rp.hecho) { d.classList.remove('on'); return; } const f = Math.min(1, (now - t0) / dur), q = T.guia.getPointAtLength(s0 + (s1 - s0) * f);
      d.setAttribute('cx', q.x); d.setAttribute('cy', q.y); if (f < 1) requestAnimationFrame(paso); else setTimeout(() => d.classList.remove('on'), 250); };
    requestAnimationFrame(paso);
  }
  const aSvg = e => { const g = $('#rpSvg'), pt = g.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(g.getScreenCTM().inverse()); };
  const upp = () => 1080 / $('#rpSvg').getBoundingClientRect().width;   // unidades por píxel
  // dónde cae el dedo sobre el camino, cerca de por donde va (no deja atajos)
  function proyectar(p) {
    const T = rp.tr[rp.k], ven = Math.max(200, T.L * .12), tol = Math.max(70, 34 * upp());
    let mejor = null, dm = 1e9; for (const q of T.m) { if (q[2] < rp.prog - 60 || q[2] > rp.prog + ven) continue; const d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < dm) { dm = d; mejor = q; } }
    return mejor && dm <= tol ? mejor[2] : null;
  }
  function mover(e, inicio) {
    if (rp.hecho || current !== 'repasar' || !rp.tr[rp.k]) return; const p = aSvg(e);
    rp.dedo.setAttribute('cx', p.x); rp.dedo.setAttribute('cy', p.y); rp.dedo.classList.add('on');
    const s = proyectar(p);
    if (s === null) {   // fuera del camino: no se pierde nada; enseñar por dónde seguir
      if (rp.sobre || inicio) { rp.sobre = false; rp.fuera++; avisoFuera(); }
      return;
    }
    if (!rp.sobre) { rp.sobre = true; rp.marca.classList.add('tocando'); }
    if (s > rp.prog) { const antes = rp.prog; rp.prog = s; marcar(); if (Math.floor(antes / 120) !== Math.floor(s / 120)) tone(500 + s / rp.tr[rp.k].L * 300, .06, 'sine', .05); }
    const T = rp.tr[rp.k]; if (rp.prog >= T.L - Math.max(28, T.L * .03)) trazoHecho();
  }
  let ultimoAviso = 0;
  function avisoFuera() {
    rp.marca.classList.remove('tocando');
    const ahora = performance.now(); if (ahora - ultimoAviso < 2500) return; ultimoAviso = ahora;
    if (rp.fuera >= 2) { rp.apuros++; say('¡Por aquí! Sigue desde el punto que brilla.'); demo(320); rp.fuera = 0; }
    else say('Vuelve al camino: sigue desde el punto que brilla.');
  }
  function trazoHecho() {
    const T = rp.tr[rp.k]; rp.prog = T.L; marcar(); T.guia.classList.add('hecho'); T.linea.classList.add('hecho'); sfx.good();
    rp.k++; rp.prog = 0; rp.sobre = false; rp.fuera = 0;
    if (rp.k < rp.tr.length) { const N = rp.tr[rp.k]; N.guia.classList.remove('espera'); N.linea.classList.remove('espera'); flechas(); marcar(); say('¡Muy bien! Ahora este otro.'); demo(300); return; }
    terminarRp();
  }
  function terminarRp() {
    rp.hecho = true; const t = rp.turno, it = rp.it, g = $('#rpSvg'); rp.flechas.innerHTML = ''; rp.marca.remove(); rp.dedo.remove(); rp.demoEl.remove();
    setTimeout(() => {
      if (t !== rp.turno) return; g.classList.add('fin');
      const arte = el('g', { class: 'puArte' }, g); [...it.t, ...it.extra].forEach(d => el('path', { d }, arte));
      it.deco.forEach(dc => { const gg = decoG(arte, dc, ''); gg.setAttribute('style', `--esc:${dc.s}`); [FIG[dc.id].c, ...FIG[dc.id].d].forEach(d => el('path', { d, style: `stroke-width:${10 / dc.s}px` }, gg)); });
      sfx.good(); confetti(); addStar(); say(it.fin + ' ¿Lo pintamos?'); $('#rpTexto').textContent = it.fin; $('#rpFin').hidden = false;
      const r = nvRp.resultado(rp.apuros <= 2); if (r === 'sube') setTimeout(() => say('¡La próxima vez, algo un poco más difícil!'), 2300);
      chipsRp();
    }, 450);
  }
  const svgEl = () => $('#rpSvg');
  let dedoId = null;
  svgEl().addEventListener('pointerdown', e => { e.preventDefault(); dedoId = e.pointerId; try { svgEl().setPointerCapture(e.pointerId); } catch (_) {} rp.sobre = false; mover(e, true); });
  svgEl().addEventListener('pointermove', e => { if (dedoId === e.pointerId) mover(e, false); });
  const soltar = e => { if (dedoId !== e.pointerId) return; dedoId = null; rp.sobre = false; if (rp.dedo) rp.dedo.classList.remove('on'); if (rp.marca) rp.marca.classList.remove('tocando'); };
  svgEl().addEventListener('pointerup', soltar); svgEl().addEventListener('pointercancel', soltar);
  $('#rpSay').onclick = () => say(rp.hecho ? '¿Lo pintamos? Toca el pincel.' : (rp.it ? rp.it.voz : '') + ' Sigue desde el punto que brilla.');
  $('#rpOtro').onclick = () => { sfx.pop(); empezarRp(); };
  // pintar en Pintar, como una lámina (los dibujos pequeños de los extremos, a su tamaño)
  for (const k in TODOS) Object.defineProperty(TPL, 'rp:' + k, { enumerable: false, value: g => {
    const it = TODOS[k]; [...it.t, ...it.extra].forEach(d => g.d(d));
    it.deco.forEach(dc => { const m = new DOMMatrix([dc.s, 0, 0, dc.s, dc.tx, dc.ty]);
      [FIG[dc.id].c, ...FIG[dc.id].d].forEach(d => { const p = new Path2D(); p.addPath(new Path2D(d), m); g.d(p); }); });
  } });
  $('#rpPintar').onclick = () => { sfx.pop(); go('paint', 'rp:' + rp.it.id); };
  { const abrir = onShow.paint; onShow.paint = arg => { const r = abrir(arg); const b = $('#paint .ptools [data-go]'); if (b && String(arg).startsWith('rp:')) b.dataset.go = 'repasar'; return r; }; }
  onShow.repasar = () => { showStars(); empezarRp(); };
  onLeave.repasar = () => { rp.turno++; rp.demo++; };

  window.REPASAR = { NIVELES, TODOS, rp, nvRp, empezarRp, proyectar };
})();
