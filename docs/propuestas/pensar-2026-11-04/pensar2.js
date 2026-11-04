/* =====================================================================
   Juegos de pensar · 2.ª entrega (copia aislada, 04/11/2026)
   «¿Qué sigue?», «Sombras» y «El diferente» con dificultad progresiva + «Unir puntos y pintar» (en el menú Pintar).
   Mismas reglas que Contar y Memoria (pensar.js): sin cronómetro, sube tras varios aciertos limpios, pistas al
   atascarse, sin castigos, prueba rápida que solo sube, avance guardado en claves «lv_» nuevas (las antiguas solo se
   leen), estrellas como hoy (+1 ⭐ por acierto o por dibujo terminado) y logros sin cambios.
   Claves nuevas: lv_sigue2, lv_sombras2, lv_distinto2, lv_puntos.
   ===================================================================== */
(function () {
  'use strict';
  const U = window.PENSAR_UTIL, DB = window.DIBUJOS, INF = window.DIBUJOS_INFO, IDS = Object.keys(DB);
  const { Nivel, Prueba, pintarCamino, finPrueba, introHTML, intro, encajar, TAM, espera, barra } = U;

  /* ---------- dibujos con variantes: color, tamaño, giro, espejo y partes quitadas ---------- */
  const COL = [{ c: '#ff6f7d', n: 'rojo' }, { c: '#ffd46b', n: 'amarillo' }, { c: '#6cc8f5', n: 'azul' }, { c: '#5fd39b', n: 'verde' },
    { c: '#c9b6ff', n: 'lila' }, { c: '#ff8fbf', n: 'rosa' }, { c: '#ffab73', n: 'naranja' }];
  const RECOLOR = ['estrella', 'corazon', 'globo', 'pez', 'mariposa', 'seta', 'mariquita'];
  const tpl = document.createElement('template');
  function svgDe(it) {   // it = {id, col, sin:[]}
    const d = DB[it.id]; let s = d.svg;
    if (it.col >= 0 && COL[it.col].c !== d.c) s = s.split(d.c).join(COL[it.col].c);
    if (it.sin && it.sin.length) { tpl.innerHTML = s; it.sin.forEach(p => tpl.content.querySelectorAll(`[data-p="${p}"]`).forEach(e => e.remove())); s = tpl.innerHTML; }
    return s;
  }
  const item = (id, o = {}) => ({ id, col: -1, tam: 0, giro: 0, esp: false, sin: [], ...o });
  const clave = it => [it.id, it.col, it.tam, it.giro, it.esp ? 1 : 0, (it.sin || []).slice().sort().join('+')].join('|');
  function htmlDe(it, cls = '') {
    const tr = `${it.giro ? `rotate(${it.giro}deg) ` : ''}${it.esp ? 'scaleX(-1) ' : ''}${it.tam ? 'scale(.6)' : ''}`;
    return `<span class="pnO pnFig ${cls}" data-k="${clave(it)}"><span class="pnTr" style="transform:${tr || 'none'}">${svgDe(it)}</span></span>`;
  }
  const quitarRepes = arr => { const v = new Set(); return arr.filter(x => { const k = clave(x); if (v.has(k)) return false; v.add(k); return true; }); };
  const NOMBRE_ATR = { id: 'la forma', col: 'el color', tam: 'el tamaño', giro: 'hacia dónde mira', esp: 'hacia dónde mira', sin: 'los detalles: ¿le falta algo?' };
  function diferencias(a, b) { return ['id', 'col', 'tam', 'giro', 'esp', 'sin'].filter(k => k === 'sin' ? (a.sin || []).join() !== (b.sin || []).join() : a[k] !== b[k]); }

  /* =====================================================================
     Motor común de los tres juegos (pantalla «obs»)
     ===================================================================== */
  const JUEGOS = {};
  const ob = { modo: '', item: null, fallos: 0, ocupado: false, turno: 0, repaso: false };
  document.getElementById('logros').insertAdjacentHTML('beforebegin', `
<section class="screen pn" id="obs">
  ${barra('m-think', '<span id="obTitulo"></span>', '<button class="btn" id="obSay" aria-label="Repetir la pregunta">🗣️</button>')}
  <div class="pnFila"><div class="pnCamino" id="obCamino"></div><button class="btn pnSaltar" id="obPrueba">⏩ Saltar lo fácil</button></div>
  <div class="pnWrap" id="obWrap"><div class="pnEscena" id="obEscena"></div><div class="pnLado"><div class="pnTexto" id="obTexto"></div><div class="pnOpts" id="obOpts"></div></div></div>
  ${introHTML('sigue')}
</section>`);
  const J = () => JUEGOS[ob.modo];
  function rondaOb() {
    const j = J(), t = ++ob.turno; ob.fallos = 0; ob.ocupado = false; pintarCamino($('#obCamino'), j.nv, j.pr, j.nombres);
    let L = j.pr.activa ? j.pr.paso() : j.nv.get().L; ob.repaso = !j.pr.activa && L >= 2 && Math.random() < .2; if (ob.repaso) L = rnd(L);
    const it = ob.item = j.crear(L), esc = $('#obEscena'), box = $('#obOpts');
    $('#obWrap').classList.toggle('rejilla', !!it.rejilla); esc.className = 'pnEscena ' + (it.cls || '');
    esc.innerHTML = it.html || ''; box.innerHTML = ''; box.classList.toggle('cuatro', it.opts.length === 4);
    $('#obTexto').textContent = it.texto;
    const destino = it.rejilla ? esc : box;
    if (it.rejilla) { const g = document.createElement('div'); g.className = 'pnRejilla'; g.style.setProperty('--cols', it.cols); esc.appendChild(g); }
    it.opts.forEach((o, i) => { const b = document.createElement('button'); b.className = 'qopt pnOpt pnOptFig' + (it.optCls ? ' ' + it.optCls : ''); b.innerHTML = o.html; b.dataset.i = i;
      b.onclick = () => respuestaOb(b, o); (it.rejilla ? esc.lastChild : destino).appendChild(b); });
    requestAnimationFrame(() => ajustarOb());
    setTimeout(() => { if (t === ob.turno) say(it.voz || it.texto); }, 300);
  }
  function ajustarOb() {
    const it = ob.item; if (!it || current !== 'obs') return; const esc = $('#obEscena');
    if (it.rejilla) {   // rejilla: casillas cuadradas que quepan
      const g = esc.querySelector('.pnRejilla'), n = it.opts.length, c = it.cols, f = Math.ceil(n / c);
      const s = Math.floor(Math.min((esc.clientWidth - 12 * (c - 1) - 8) / c, (esc.clientHeight - 12 * (f - 1) - 8) / f, 150)); g.style.setProperty('--lado', Math.max(s, 44) + 'px');
    } else encajar(esc, it.tam0 || TAM());
  }
  addEventListener('resize', () => ajustarOb());
  function respuestaOb(b, o) {
    const it = ob.item, j = J(), t = ob.turno; if (ob.ocupado || b.classList.contains('fuera')) return;
    if (o.ok) {
      ob.ocupado = true; b.classList.add('ok'); sfx.good(); say(pick(PRAISE)); addStar(); if (stars % 10 === 0) confetti();
      if (it.alAcertar) it.alAcertar();
      const limpio = ob.fallos <= 1; let ms = 1700;
      if (j.pr.activa) { const r = j.pr.resultado(limpio); if (r !== 'sigue') { setTimeout(() => finPrueba(r, j.nv, j.nombres), 900); ms = 3200; } }
      else if (!ob.repaso && j.nv.resultado(limpio) === 'sube') { setTimeout(() => { confetti(); say('¡Subes de nivel! Ahora, un poco más difícil.'); }, 900); ms = 3400; }
      setTimeout(() => { if (t === ob.turno) rondaOb(); }, ms); return;
    }
    ob.fallos++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no', 'fuera'); sfx.bad();
    const buena = () => $$('#obEscena .pnOpt, #obOpts .pnOpt').find(x => it.opts[+x.dataset.i].ok);
    if (j.pr.activa && ob.fallos >= 2) { ob.ocupado = true; buena().classList.add('pista'); const r = j.pr.resultado(false); setTimeout(() => finPrueba(r, j.nv, j.nombres), 700); setTimeout(() => { if (t === ob.turno) rondaOb(); }, 3600); return; }
    if (ob.fallos === 1) say('¡Casi! ' + it.pista1(o));
    else { if (it.pista2) it.pista2(); buena().classList.add('pista'); say(it.voz2 || '¡Mira! Es el que brilla.'); }
  }
  $('#obSay').onclick = () => ob.item && say(ob.item.voz || ob.item.texto);
  $('#obPrueba').onclick = () => { const j = J(); if (!j.pr.empezar()) { toast('¡Ya estás en lo más difícil! 🌟'); return; } say('¡Prueba rápida! Si aciertas, saltamos lo fácil.'); rondaOb(); };
  onShow.obs = arg => {
    if (arg && JUEGOS[arg]) ob.modo = arg; const j = J(); ob.turno++; showStars(); $('#obTitulo').textContent = j.titulo;
    const sec = $('#obs'); sec.querySelector('.pnIntro .ill').dataset.ill = j.ill; paintIll();
    if (intro(sec, j.nv, () => { j.pr.empezar(); rondaOb(); }, rondaOb)) { pintarCamino($('#obCamino'), j.nv, j.pr, j.nombres); $('#obEscena').innerHTML = ''; $('#obOpts').innerHTML = ''; $('#obTexto').textContent = ''; }
    else rondaOb();
  };
  onLeave.obs = () => { ob.turno++; const j = J(); if (j) j.pr.activa = false; };
  function registrar(modo, def) {
    const desdeViejo = () => { const v = +store.get('lv_' + modo, 0) || 0; return v >= 6 ? { L: 1, max: 1 } : {}; };   // la clave antigua solo se lee
    def.nv = Nivel(def.clave, def.niveles.length, 3, desdeViejo); def.pr = Prueba(def.nv, def.prueba); def.nombres = def.niveles; JUEGOS[modo] = def;
    $$(`#m-think [data-go="quiz"][data-arg="${modo}"]`).forEach(b => { b.dataset.go = 'obs'; });
  }

  /* =====================================================================
     ¿QUÉ SIGUE?  patrones con forma, color, tamaño y orientación
     ===================================================================== */
  const SG = [
    { n: 'formas que se repiten', a: { id: [[0, 1]] } },
    { n: 'series de tres', a: { id: [[0, 0, 1], [0, 1, 1], [0, 1, 2]] } },
    { n: 'colores', a: { col: [[0, 1], [0, 1, 2], [0, 0, 1]] } },
    { n: 'grande y pequeño', a: { tam: [[0, 1], [0, 0, 1], [0, 1, 1]] } },
    { n: 'hacia dónde mira', a: { esp: [[0, 1], [0, 0, 1]], giro: [[0, 1, 2, 3]] }, uno: true },
    { n: 'forma y color a la vez', a: { id: [[0, 1]], col: [[0, 1, 2]] }, k: 4 },
    { n: '¿qué falta en medio?', a: { id: [[0, 1], [0, 1, 2]], tam: [[0, 1, 1], [0, 1]] }, k: 4, medio: true },
    { n: 'series largas', a: { col: [[0, 1, 2, 3], [0, 0, 1, 1]], esp: [[0, 1]], tam: [[0, 1]] }, dos: true, k: 4, medio: true, largo: true },
  ];
  const lcm = (a, b) => { const g = (x, y) => y ? g(y, x % y) : x; return a * b / g(a, b); };
  function crearSigue(L) {
    const P = SG[L]; let atrs = Object.keys(P.a);
    if (P.uno) atrs = [pick(atrs)];
    if (P.dos) atrs = shuffle(atrs).slice(0, 2);
    const pats = {}; atrs.forEach(a => pats[a] = pick(P.a[a]));
    const periodo = atrs.reduce((m, a) => lcm(m, pats[a].length), 1), k = Math.max(...atrs.map(a => Math.max(...pats[a]) + 1));
    // valores
    const usaCol = atrs.includes('col'), usaGiro = atrs.includes('giro') || atrs.includes('esp');
    const base = usaGiro ? INF.MIRA : usaCol ? RECOLOR : IDS;
    const ids = shuffle(base).slice(0, Math.max(3, usaGiro || usaCol ? 4 : 4));
    const vals = { id: ids, col: shuffle(COL.map((_, i) => i)).slice(0, 4), tam: [0, 1], esp: [false, true], giro: [0, 90, 180, 270] };
    if (!atrs.includes('id')) vals.id = [ids[0]];
    const de = i => { const it = item(vals.id[atrs.includes('id') ? pats.id[i % pats.id.length] : 0]);
      for (const a of atrs) if (a !== 'id') it[a] = vals[a][pats[a][i % pats[a].length]];
      if (!usaCol) it.col = -1; return it; };
    const n = Math.min(P.largo ? 10 : 9, Math.max(P.medio ? periodo * 2 + 1 : 5, periodo * 2) + (P.largo ? 1 : rnd(2)));
    const hueco = P.medio ? Math.floor(n / 2) + rnd(Math.ceil(n / 2) - 1) : n;
    const total = P.medio ? n : n + 1, sec = Array.from({ length: total }, (_, i) => de(i)), resp = sec[hueco];
    // opciones: cambiar un rasgo cada vez (las que «casi» valen)
    let cand = [];
    for (const a of ['id', ...atrs.filter(a => a !== 'id')]) for (const v of vals[a]) { const c = { ...resp, sin: [] }; if (a === 'id' && !atrs.includes('id')) { const otro = pick(base.filter(x => x !== resp.id)); c.id = otro; } else c[a] = v; cand.push(c); }
    cand = quitarRepes(cand).filter(c => clave(c) !== clave(resp));
    const nOp = P.k || 3, opts = shuffle([resp, ...shuffle(cand).slice(0, nOp - 1)]).map(it => ({ it, ok: clave(it) === clave(resp), html: htmlDe(it) }));
    const cols = L <= 4 && periodo <= 3 ? periodo * Math.floor(6 / periodo) : 0;   // al principio, cada fila empieza igual
    const html = `<div class="pnSerie${cols ? ' filas' : ''}" style="${cols ? `grid-template-columns:repeat(${cols},var(--os))` : ''}">${sec.slice(0, total).map((it, i) => i === hueco ? `<span class="pnO pnHuecoQ">?</span>` : htmlDe(it, 'g' + (Math.floor(i / periodo) % 2))).join('')}</div>`;
    return { html, opts, texto: P.medio ? '¿Qué falta?' : '¿Qué viene después?', voz: P.medio ? '¿Qué falta en el hueco?' : '¿Qué viene después?',
      pista1: o => 'Fíjate en ' + NOMBRE_ATR[diferencias(o.it, resp)[0] || 'id'] + '.', voz2: 'Mira cómo se repite. ¡Es el que brilla!',
      pista2: () => $('#obEscena .pnSerie').classList.add('grupos'), tam0: 86, alAcertar: () => { const h = $('#obEscena .pnHuecoQ'); if (h) h.outerHTML = htmlDe(resp, 'puesto'); } };
  }
  registrar('sigue', { titulo: '¿Qué sigue?', ill: 'sigue', clave: 'lv_sigue2', niveles: SG.map(p => p.n), prueba: [1, 3, 5, 7], crear: crearSigue });

  /* =====================================================================
     SOMBRAS  siluetas parecidas: forma, hacia dónde mira y partes que faltan
     ===================================================================== */
  const SB = ['sombras distintas', 'formas parecidas', 'hacia dónde mira', '¿le falta algo?', 'todo mezclado', 'girado y con detalles'];
  function crearSombras(L) {
    let resp, otros = [], nOp = L === 0 ? 3 : L >= 4 ? 5 : 4, fijos = false;
    if (L <= 1) {
      const id = pick(IDS); resp = item(id);
      const pool = L === 0 ? IDS.filter(x => DB[x].fam !== DB[id].fam) : IDS.filter(x => x !== id && DB[x].fam === DB[id].fam);
      otros = shuffle(pool.length >= nOp - 1 ? pool : IDS.filter(x => x !== id)).slice(0, nOp - 1).map(x => item(x));
    } else if (L === 2) {
      const id = pick(INF.MIRA); resp = item(id, { esp: !!rnd(2) });
      otros = [item(id, { esp: !resp.esp }), item(id, { esp: resp.esp, giro: 90 }), item(id, { esp: resp.esp, giro: 180 }), item(id, { esp: !resp.esp, giro: 270 })];
    } else if (L === 3) {
      const id = pick(Object.keys(DB).filter(x => DB[x].sil.length)), s = DB[id].sil; resp = item(id, { sin: s.length > 1 && rnd(2) ? [pick(s)] : [] });
      otros = [item(id), ...s.map(p => item(id, { sin: [p] })), item(id, { sin: s.slice() })];
      if (INF.GIRA.includes(id)) otros.push(item(id, { esp: true, sin: resp.sin.slice() }));
      otros = shuffle(quitarRepes(otros).filter(o => clave(o) !== clave(resp)));   // primero las variantes de la misma figura
      otros.push(item(pick(IDS.filter(x => x !== id && DB[x].fam === DB[id].fam)) || pick(IDS.filter(x => x !== id))), item(pick(IDS.filter(x => x !== id))));   // por si hay pocas
      fijos = true;
    } else {
      const id = pick(Object.keys(DB).filter(x => DB[x].sil.length && INF.GIRA.includes(x))), s = DB[id].sil;
      resp = item(id, { sin: rnd(2) ? [pick(s)] : [], esp: L === 5 ? !!rnd(2) : false, giro: L === 5 ? pick([0, 90, 270]) : 0 });
      otros = [item(id, { ...resp, esp: !resp.esp }), item(id, { ...resp, sin: resp.sin.length ? [] : [pick(s)] }), item(id, { ...resp, giro: (resp.giro + 180) % 360 }),
        item(pick(IDS.filter(x => x !== id && DB[x].fam === DB[id].fam)) || pick(IDS)), item(id, { ...resp, esp: !resp.esp, sin: resp.sin.length ? [] : [pick(s)] })];
    }
    otros = quitarRepes(otros).filter(o => clave(o) !== clave(resp)); nOp = Math.min(nOp, otros.length + 1);
    const opts = shuffle([resp, ...(fijos ? otros : shuffle(otros)).slice(0, nOp - 1)]).map(it => ({ it, ok: clave(it) === clave(resp), html: htmlDe(it, 'pnSil') }));
    return { html: `<div class="pnModelo">${htmlDe(resp)}</div>`, opts, texto: '¿Cuál es su sombra?', voz: '¿Cuál es su sombra? Fíjate bien.', optCls: 'grande',
      pista1: o => { const d = diferencias(o.it, resp); return d.includes('sin') ? 'Fíjate bien: ¿le falta algo?' : (d.includes('esp') || d.includes('giro')) ? 'Fíjate hacia dónde mira.' : 'Fíjate en su forma.'; },
      tam0: 170 };
  }
  registrar('sombras', { titulo: 'Sombras', ill: 'sombras', clave: 'lv_sombras2', niveles: SB, prueba: [1, 2, 3, 5], crear: crearSombras });

  /* =====================================================================
     EL DIFERENTE  descubrir la regla
     ===================================================================== */
  const DF = [
    { n: 'otra forma', t: 'id' }, { n: 'otro color', t: 'col' }, { n: 'otro tamaño', t: 'tam' }, { n: 'hacia dónde mira', t: 'esp' },
    { n: '¿qué son?', t: 'grupo' }, { n: 'le falta un detalle', t: 'det' }, { n: 'la regla con trampa', t: 'ruido' }, { n: 'cuántos hay', t: 'contar' },
  ];
  const GRUPO_N = { comida: 'cosas de comer', animal: 'animales', cielo: 'cosas del cielo', planta: 'plantas' };
  const PISTA_DF = { id: 'Fíjate en la forma.', col: 'Fíjate en los colores.', tam: 'Fíjate en el tamaño.', esp: 'Fíjate hacia dónde miran.',
    grupo: 'Piensa qué son: ¿animales, comida, cosas del cielo…?', det: 'Mira bien los detalles: a uno le falta algo.', ruido: 'Fíjate en los colores, no en la forma.', contar: 'Cuenta cuántos hay en cada tarjeta.' };
  function crearDistinto(L) {
    const t = DF[L].t; let iguales = [], raro, cols = 3, n = 9, voz2;
    if (t === 'id') { n = 6; const a = pick(IDS), b = pick(IDS.filter(x => DB[x].fam !== DB[a].fam)); iguales = Array(n - 1).fill(0).map(() => item(a)); raro = item(b); }
    if (t === 'col') { const a = pick(RECOLOR), c = shuffle([0, 1, 2, 3, 4, 5, 6]); iguales = Array(n - 1).fill(0).map(() => item(a, { col: c[0] })); raro = item(a, { col: c[1] }); }
    if (t === 'tam') { const a = pick(IDS); iguales = Array(n - 1).fill(0).map(() => item(a)); raro = item(a, { tam: 1 }); }
    if (t === 'esp') { const a = pick(INF.MIRA), e = !!rnd(2); n = pick([9, 12]); cols = n === 12 ? 4 : 3; iguales = Array(n - 1).fill(0).map(() => item(a, { esp: e })); raro = item(a, { esp: !e }); }
    if (t === 'grupo') {
      n = 5; cols = 3; const g = pick(['comida', 'animal', 'cielo']), de = shuffle(IDS.filter(x => DB[x].grupo === g)).slice(0, 4), otro = pick(IDS.filter(x => DB[x].grupo !== g));
      iguales = de.map(x => item(x)); raro = item(otro); voz2 = `Los demás son ${GRUPO_N[g]}. ¡Es el que brilla!`;
    }
    if (t === 'det') { const a = pick(Object.keys(DB).filter(x => DB[x].det.length)); n = pick([6, 9]); iguales = Array(n - 1).fill(0).map(() => item(a)); raro = item(a, { sin: [pick(DB[a].det)] }); }
    if (t === 'ruido') {
      n = 6; const c = shuffle([0, 1, 2, 3, 4, 5, 6]), ids = shuffle(RECOLOR);
      iguales = ids.slice(0, n - 1).map(x => item(x, { col: c[0] })); raro = item(ids[n - 1] || ids[0], { col: c[1] }); voz2 = `Los demás son de color ${COL[c[0]].n}. ¡Es el que brilla!`;
    }
    if (t === 'contar') {
      n = pick([4, 6]); cols = n === 4 ? 2 : 3; const k = 2 + rnd(3), ids = shuffle(IDS);
      const tarjeta = (id, m) => ({ id, m, tarjeta: true });
      iguales = Array(n - 1).fill(0).map((_, i) => tarjeta(ids[i], k)); raro = tarjeta(ids[n - 1], k + (rnd(2) ? 1 : -1)); voz2 = `En las demás hay ${k}. ¡Es la que brilla!`;
    }
    const pos = rnd(n), lista = [...iguales]; lista.splice(pos, 0, raro);
    const html = it => it.tarjeta ? `<span class="pnTarjeta">${Array.from({ length: it.m }, () => `<span class="pnMini">${DB[it.id].svg}</span>`).join('')}</span>` : htmlDe(it);
    return { rejilla: true, cols, opts: lista.map((it, i) => ({ it, ok: i === pos, html: html(it) })), texto: '¿Cuál es diferente?', voz: '¿Cuál es diferente? Busca el que no va con los demás.',
      pista1: () => PISTA_DF[t], voz2, optCls: 'celda' };
  }
  registrar('distinto', { titulo: 'El diferente', ill: 'lupa', clave: 'lv_distinto2', niveles: DF.map(p => p.n), prueba: [1, 3, 4, 6], crear: crearDistinto });

  /* =====================================================================
     UNIR PUNTOS Y PINTAR
     ===================================================================== */
  const FIG = window.FIGURAS, NIV = window.FIGURAS_NIVELES, NS = 'http://www.w3.org/2000/svg';
  const nvPu = Nivel('lv_puntos', NIV.length, 2);
  const pu = { fig: '', pts: [], sig: 0, fallos: 0, turno: 0, hecho: false, ultimas: [] };
  // los puntos: siempre en las esquinas del contorno y el resto repartido por igual
  const medidor = document.createElementNS(NS, 'svg'); medidor.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden'); document.body.appendChild(medidor);
  function puntosDe(d, N, minD = 62) {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); medidor.appendChild(p);
    const Lt = p.getTotalLength(), M = 720, s = []; for (let i = 0; i < M; i++) { const q = p.getPointAtLength(Lt * i / M); s.push([q.x, q.y]); } p.remove();
    const k = 5, ang = s.map((q, i) => { const a = s[(i - k + M) % M], b = s[(i + k) % M], v1 = [q[0] - a[0], q[1] - a[1]], v2 = [b[0] - q[0], b[1] - q[1]];
      const c = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2) || 1); return Math.acos(clamp(c, -1, 1)); });
    let esq = []; for (let i = 0; i < M; i++) { if (ang[i] < .62) continue; let max = true; for (let j = -k; j <= k; j++) if (j && ang[(i + j + M) % M] > ang[i]) max = false; if (max) esq.push(i); }
    esq = esq.filter((e, i) => !i || e - esq[i - 1] > M * .025);
    // repartidos por igual por el contorno; cada uno se va a la esquina cercana si la hay (las puntas de la estrella,
    // el tejado…). Si sobran una o dos esquinas marcadas, se añaden puntos para no perderlas.
    const fuertes = esq.filter(e => ang[e] > 1.0); if (fuertes.length > N && fuertes.length <= N + 2) N = fuertes.length;
    const paso = M / N, ini = fuertes.length ? fuertes[0] : esq.length ? esq[0] : 0; let idx = [];
    for (let j = 0; j < N; j++) { const b = Math.round(ini + j * paso) % M; let mejor = b, dm = paso * .45;
      for (const e of esq) { const d = Math.min(Math.abs(e - b), M - Math.abs(e - b)); if (d < dm && (mejor === b || ang[e] > ang[mejor])) { dm = d; mejor = e; } }
      idx.push(mejor); }
    idx = [...new Set(idx)].sort((a, b) => a - b);
    // ninguno demasiado cerca del anterior (para tocarlos cómodamente)
    const quedan = [];   // minD: separación mínima (≈ 20 px en pantalla)
    for (const i of idx) { const q = s[i]; if (quedan.some(u => Math.hypot(q[0] - s[u][0], q[1] - s[u][1]) < minD)) continue; quedan.push(i); }
    idx = quedan;
    // empezar por el punto de más arriba a la izquierda y seguir en el sentido de las agujas del reloj
    let pts = idx.map(i => s[i]); const area = pts.reduce((a, q, i) => { const r = pts[(i + 1) % pts.length]; return a + q[0] * r[1] - r[0] * q[1]; }, 0);
    if (area < 0) pts.reverse();
    let i0 = 0; pts.forEach((q, i) => { if (q[1] + q[0] * .3 < pts[i0][1] + pts[i0][0] * .3) i0 = i; }); pts = [...pts.slice(i0), ...pts.slice(0, i0)];
    return pts;
  }
  document.getElementById('logros').insertAdjacentHTML('beforebegin', `
<section class="screen pn" id="puntos">
  ${barra('m-paint', 'Unir puntos', '<button class="btn" id="puSay" aria-label="Repetir">🗣️</button>')}
  <div class="subbar" id="puChips"></div>
  <div class="pnWrap"><div class="pnTablero2" id="puTablero"><svg id="puSvg" viewBox="-40 -40 1080 1080" aria-label="Dibujo de puntos"></svg></div>
    <div class="pnLado"><div class="pnTexto" id="puTexto"></div>
      <div class="pnAcciones" id="puFin" hidden><button class="btn pnAccion pnPintar" id="puPintar">🎨 ¡A pintar!</button><button class="btn pnAccion" id="puOtro">▶ Otro</button></div></div></div>
</section>`);
  $$('#m-paint .menu').forEach(m => m.insertAdjacentHTML('beforeend', '<button class="big c3" data-go="puntos"><span class="ill" data-ill="puntos"></span>Unir puntos</button>'));
  ILL.puntos = svg(`<path d="M30 92L60 24L92 92Z" fill="none" stroke="#a083ff" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/>
    ${[[30, 92, 1], [60, 24, 2], [92, 92, 3]].map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="11" fill="#fff" ${S}/><text x="${x}" y="${y + 5}" font-size="14" font-weight="900" text-anchor="middle" fill="${INK}" font-family="ui-rounded,system-ui,sans-serif">${n}</text>`).join('')}
    <path d="M70 70l26 16-12 3 7 13-6 3-7-13-9 8z" fill="#ffd46b" ${S}/>`);
  paintIll();
  function chipsPu() {
    const o = nvPu.get(), box = $('#puChips'); box.innerHTML = '';
    NIV.forEach((nv, i) => { const b = document.createElement('button'); b.className = 'btn pnChip' + (i === o.L ? ' sel' : '') + (i <= o.max ? ' hecho' : '');
      b.textContent = nv.n; b.setAttribute('aria-label', nv.n + ' puntos'); b.onclick = () => { sfx.pop(); nvPu.elegir(i); empezarPu(); }; box.appendChild(b); });
  }
  const el = (tag, at, padre) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; };
  function empezarPu(fig) {
    const t = ++pu.turno, nv = NIV[nvPu.get().L]; chipsPu();
    if (!fig) { const lista = nv.f.filter(f => !pu.ultimas.includes(f)); fig = pick(lista.length ? lista : nv.f); }
    pu.ultimas = [fig, ...pu.ultimas].slice(0, 3);
    ladoPu(); const tam = $('#puSvg').getBoundingClientRect().width || 340;
    Object.assign(pu, { fig, pts: puntosDe(FIG[fig].c, nv.n, Math.max(62, 20 * 1080 / tam)), sig: 1, fallos: 0, fallosTot: 0, hecho: false });
    const g = $('#puSvg'); g.innerHTML = ''; $('#puFin').hidden = true;
    el('polyline', { id: 'puLinea', points: '', class: 'puLinea' }, g); el('line', { id: 'puGuia', class: 'puGuia', x1: 0, y1: 0, x2: 0, y2: 0 }, g);
    const P = pu.pts, n = P.length;
    pu.pts.forEach((q, i) => {
      const gr = el('g', { class: 'puPunto' + (i === 0 ? ' hecho' : i === 1 ? ' sig' : ''), 'data-i': i }, g);
      el('circle', { cx: q[0], cy: q[1], r: 46, class: 'puAro' }, gr); el('circle', { cx: q[0], cy: q[1], r: 21, class: 'puBola' }, gr);
      const a = P[(i - 1 + n) % n], b = P[(i + 1) % n], tx0 = b[0] - a[0], ty0 = b[1] - a[1], m = Math.hypot(tx0, ty0) || 1;
      const nx = ty0 / m, ny = -tx0 / m;   // recorrido en el sentido de las agujas del reloj (pantalla): la normal (ty, -tx) apunta hacia fuera
      const tx = el('text', { x: q[0] + nx * 64, y: q[1] + ny * 64 + 16, class: 'puNum' }, gr); tx.textContent = i + 1;
    });
    $('#puLinea').setAttribute('points', pu.pts[0].join(','));
    $('#puTexto').textContent = '¡Une los puntos en orden!';
    setTimeout(() => { if (t === pu.turno) say('¡Une los puntos! Empieza en el uno y toca el dos, el que brilla.'); }, 300);
    requestAnimationFrame(ladoPu);
  }
  function ladoPu() { const tb = $('#puTablero'); if (!tb.offsetParent) return; const s = Math.floor(Math.min(tb.clientWidth, tb.clientHeight) - 4); $('#puSvg').style.width = $('#puSvg').style.height = Math.max(s, 200) + 'px'; }
  addEventListener('resize', () => { if (current === 'puntos') ladoPu(); });
  function aSvg(e) { const g = $('#puSvg'), pt = g.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const m = g.getScreenCTM(); return pt.matrixTransform(m.inverse()); }
  const escala = () => { const r = $('#puSvg').getBoundingClientRect(); return 1080 / r.width; };   // unidades por píxel
  function unir() {
    const i = pu.sig, g = $('#puSvg'), q = pu.pts[i], ps = g.querySelectorAll('.puPunto');
    ps[i].classList.remove('sig'); ps[i].classList.add('hecho'); $('#puGuia').classList.remove('on');
    const ln = $('#puLinea'); ln.setAttribute('points', ln.getAttribute('points') + ' ' + q.join(','));
    tone(440 + i * 18, .12, 'triangle', .1); say(String(i + 1)); pu.fallos = 0;
    pu.sig++; if (pu.sig < pu.pts.length) { ps[pu.sig].classList.add('sig'); return; }
    terminarPu();
  }
  function terminarPu() {
    const g = $('#puSvg'), ln = $('#puLinea'); ln.setAttribute('points', ln.getAttribute('points') + ' ' + pu.pts[0].join(','));
    pu.hecho = true; const t = pu.turno, f = FIG[pu.fig];
    setTimeout(() => {
      if (t !== pu.turno) return; g.classList.add('fin');
      const arte = el('g', { class: 'puArte' }, g); el('path', { d: f.c }, arte); f.d.forEach(d => el('path', { d }, arte));
      sfx.good(); confetti(); addStar(); say(`¡Es ${f.n}! ¿Lo pintamos?`); $('#puTexto').textContent = `¡Es ${f.n}!`; $('#puFin').hidden = false;
      const r = nvPu.resultado(pu.fallosTot <= 4); if (r === 'sube') setTimeout(() => say('¡La próxima vez, con más puntos!'), 2200);
      chipsPu();
    }, 500);
  }
  function tocarPu(e) {
    if (pu.hecho || current !== 'puntos') return; e.preventDefault();
    const p = aSvg(e), q = pu.pts[pu.sig], d = Math.hypot(p.x - q[0], p.y - q[1]) / escala();
    if (d <= 44) { unir(); return; }
    if (e.type === 'pointerdown') {   // un toque lejos del siguiente: sin castigo; al segundo, una guía
      pu.fallos++; pu.fallosTot = (pu.fallosTot || 0) + 1; sfx.bad();
      if (pu.fallos >= 2) { const a = pu.pts[pu.sig - 1], gu = $('#puGuia'); gu.setAttribute('x1', a[0]); gu.setAttribute('y1', a[1]); gu.setAttribute('x2', q[0]); gu.setAttribute('y2', q[1]); gu.classList.add('on'); }
      say(`Busca el ${pu.sig + 1}, el que brilla.`);
    }
  }
  let arrastre = null;
  $('#puSvg').addEventListener('pointerdown', e => { arrastre = e.pointerId; try { $('#puSvg').setPointerCapture(e.pointerId); } catch (_) {} tocarPu(e); });
  $('#puSvg').addEventListener('pointermove', e => { if (arrastre !== e.pointerId || pu.hecho) return; const p = aSvg(e), q = pu.pts[pu.sig]; if (Math.hypot(p.x - q[0], p.y - q[1]) / escala() <= 30) unir(); });
  addEventListener('pointerup', () => { arrastre = null; });
  $('#puSay').onclick = () => say(pu.hecho ? '¿Lo pintamos? Toca el pincel.' : `Toca el ${pu.sig + 1}, el que brilla.`);
  $('#puOtro').onclick = () => { sfx.pop(); empezarPu(); };
  // pintar: se abre en Pintar como una lámina (mismo cubo, deshacer, guardar en «Mis dibujos»)
  for (const k in FIG) Object.defineProperty(TPL, 'pz:' + k, { enumerable: false, value: g => { g.d(FIG[k].c); FIG[k].d.forEach(d => g.d(d)); } });
  $('#puPintar').onclick = () => { sfx.pop(); go('paint', 'pz:' + pu.fig); };
  { const abrir = onShow.paint; onShow.paint = arg => { const b = $('#paint .ptools [data-go]'); if (b) b.dataset.go = String(arg).startsWith('pz:') ? 'puntos' : 'm-paint'; return abrir(arg); }; }
  onShow.puntos = arg => { showStars(); if (arg === 'volver' || (current === 'puntos' && pu.hecho && false)) return; empezarPu(); };
  onLeave.puntos = () => { pu.turno++; };

  window.PENSAR2 = { JUEGOS, ob, crearSigue, crearSombras, crearDistinto, pu, nvPu, puntosDe, svgDe, item, clave, empezarPu };
})();
