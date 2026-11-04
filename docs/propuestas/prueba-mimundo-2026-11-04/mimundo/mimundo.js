/* =====================================================================
   Mi Mundo · habitación ilustrada jugable (D-033)
   ---------------------------------------------------------------------
   Sustituye, en el escenario «habitación», el dibujo y las pegatinas de emoji
   por el fondo y los objetos ilustrados del catálogo (catalogo-mimundo.js +
   arte/medidas.js). Las demás escenas siguen como están.
   Juego libre:
     · la muñeca guardada se arrastra o camina (tocar el suelo); en la cama se
       acuesta (tocar la cama o soltarla encima) con los ojos cerrados y sin
       alas, mochila ni varita a la vista (lo guardado no cambia); tocarla la
       levanta;
     · la bandeja de abajo es el catálogo ilustrado: tocar un objeto lo pone en
       la habitación; se arrastra (crece o encoge con la profundidad) y se
       quita con 🗑️; los juguetes se guardan soltándolos en la cesta y se
       sacan tocando la cesta.
   Misiones (opcionales, botón 🎯): «Guardar los juguetes» (tipo «meter»). Una
   misión solo se ofrece si todos sus objetos tienen ilustración y son gratis.
   Al terminarla: celebración y 1 ⭐ (no toca los logros de la Pintar ni de
   la Heladería).
   Datos (con el prefijo de la copia): «mm_habitacion2» (habitación) y
   «mm_misiones» (misiones). No se tocan «mm_hab» ni «sc_habitacion».
   Coordenadas: las del fondo (1536 × 1024); la escena se escala para caber.
   ===================================================================== */
(function () {
  'use strict';
  const DIR = document.currentScript.src.replace(/[^/]*$/, '');
  const W = 1536, H = 1024, KEY = 'mm_habitacion2', KEY_MIS = 'mm_misiones';
  const alto = y => 250 + (y - 560) * 170 / 430;           // alto de la muñeca (1,10 m) con los pies en y
  const SUELO = { x0: 90, x1: 1450, y0: 585, y1: 1005 };
  const OCULTAR_ACOSTADA = ['alas', 'mochila', 'varita'];
  const CAT = window.MM_CATALOGO.objetos, MISIONES = window.MM_CATALOGO.misiones;
  const MED = () => window.MM_MEDIDAS || {};
  const porId = id => CAT.find(o => o.id === id);
  const urlDe = f => /^(data:|blob:|https?:)/.test(f) ? f : DIR + 'arte/' + f;
  const conArte = o => !!o && Object.values(o.capas).every(c => MED()[c]);
  const bloqueado = o => !!(o.desbloqueo && !(window.Logros && Logros.total && Logros.total() >= o.desbloqueo.logros));
  const misionLista = m => [m.objetivo.contenedor].concat(m.objetivo.objetos).every(id => conArte(porId(id)) && !porId(id).desbloqueo);

  let est = null, mis = null, escena = null, caja = null, mun = null, av = null, sel = null, arrastre = null, paseo = null;
  const guardar = () => store.set(KEY, est), guardarMis = () => store.set(KEY_MIS, mis);
  function cargar() {
    const e = store.get(KEY, null);
    if (e && e.v === 1) return e;
    return { v: 1, muneca: { x: 1000, y: 860, en: null }, objetos: CAT.filter(o => o.inicial && conArte(o)).map((o, i) => ({ uid: 'o' + i, id: o.id, x: o.inicial.x, y: o.inicial.y })) };
  }
  const cargarMis = () => Object.assign({ v: 1, activa: null, hechas: {} }, store.get(KEY_MIS, {}) || {});
  // escala del arte con la base en y: la de la cama, fija (respecto a su imagen); la de los demás, por su alto real
  function escalaDe(o, y) {
    const m = MED()[o.capas.detras];
    return o.escala ? o.escala * alto(y) / alto(o.yRef) : o.altoM / 1.10 * alto(y) / m.px[1];
  }
  const vivos = () => est.objetos.filter(it => !it.dentro && conArte(porId(it.id)));

  /* ---------- montaje ---------- */
  function foco() {
    const m = est.muneca, cama = m.en && est.objetos.find(x => x.uid === m.en);
    if (cama) { const [cx, cy] = anclaCama(cama); return [cx, cy]; }
    return [m.x, m.y - alto(m.y) * 0.5];
  }
  // Encuadre: en pantallas anchas llena el ancho (recorta pared, hasta un 55 % del alto); en las estrechas llena el
  // alto. Si no cabe entera, la cámara sigue a la muñeca (o a su almohada, si está acostada).
  function encajar() {
    if (!escena) return;
    const r = board.getBoundingClientRect(), bw = r.width, bh = r.height, [fx, fy] = foco();
    const k = bw / bh >= W / H ? Math.min(bw / W, bh / (0.45 * H)) : bh / H;
    const tx = W * k > bw ? clamp(bw / 2 - fx * k, bw - W * k, 0) : (bw - W * k) / 2;
    const ty = H * k > bh ? clamp(bh / 2 - fy * k, bh - H * k, 0) : (bh - H * k) / 2;
    escena.style.transform = `translate(${tx}px,${ty}px) scale(${k})`;
    escena.dataset.k = k;
  }
  function pintarObjeto(it) {
    const o = porId(it.id);
    if (!o || it.dentro || !conArte(o)) { escena.querySelectorAll(`[data-uid="${it.uid}"]`).forEach(e => e.remove()); return; }
    const k = escalaDe(o, it.y);
    ['detras', 'delante'].forEach((capa, j) => {
      if (!o.capas[capa]) return;
      const m = MED()[o.capas[capa]], w = m.px[0] * k, h = m.px[1] * k, x = it.x - m.base[0] * k, y = it.y - m.base[1] * k;
      let el = escena.querySelector(`[data-uid="${it.uid}"][data-capa="${capa}"]`);
      if (!el) { el = document.createElement('img'); el.className = 'mm-obj'; el.dataset.uid = it.uid; el.dataset.capa = capa; el.dataset.id = o.id; el.src = urlDe(m.f); el.draggable = false; el.alt = ''; escena.appendChild(el); }
      Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', zIndex: Math.round(it.y) * 4 + (j ? 2 : 0) });
      el.classList.toggle('sel', sel === it.uid);
    });
  }
  function anclaCama(cama) {
    const o = porId(cama.id), m = MED()[o.capas.detras], k = escalaDe(o, cama.y), a = o.acostar;
    return [cama.x + (a.cx - m.recorte[0] - m.base[0]) * k, cama.y + (a.cy - m.recorte[1] - m.base[1]) * k, k];
  }
  function estadoVisible(st) {
    return est.muneca.en ? Object.assign({}, st, { accesorios: st.accesorios.filter(a => !OCULTAR_ACOSTADA.includes(a)) }) : st;
  }
  function pintarMuneca(ms) {
    const m = est.muneca; mun.style.transitionDuration = (ms || 0) + 'ms';
    const cama = m.en && est.objetos.find(x => x.uid === m.en);
    if (cama) {
      const [cx, cy, k] = anclaCama(cama), a = porId(cama.id).acostar, s = a.alto / 1500 * k, w = 948 * s, h = 1590 * s;
      Object.assign(mun.style, { left: cx - w / 2 + 'px', top: cy - h / 2 + 'px', width: w + 'px', height: h + 'px', transform: `rotate(${a.giro}deg)`, zIndex: Math.round(cama.y) * 4 + 1 });
    } else {
      const h = alto(m.y) * 1590 / 1500, w = h * 948 / 1590;
      Object.assign(mun.style, { left: m.x - w * 479 / 948 + 'px', top: m.y - h * 1542 / 1590 + 'px', width: w + 'px', height: h + 'px', transform: '', zIndex: Math.round(m.y) * 4 + 1 });
    }
    mun.classList.toggle('acostada', !!cama);
    if (escena.dataset.k && !(arrastre && arrastre.movido)) encajar();   // la cámara no se mueve mientras se arrastra
  }
  function pintarTodo() { est.objetos.forEach(pintarObjeto); pintarMuneca(0); }
  function montar() {
    roomL.innerHTML = '';
    caja = document.createElement('div'); caja.className = 'mm';
    escena = document.createElement('div'); escena.className = 'mm-escena';
    escena.innerHTML = `<img class="mm-fondo" src="${urlDe(MED().fondo.f)}" draggable="false" alt="">`;
    mun = document.createElement('div'); mun.className = 'mm-muneca'; mun.innerHTML = '<div class="mm-av"></div><span class="mm-zzz">Z z z</span>';
    escena.appendChild(mun); caja.appendChild(escena); roomL.appendChild(caja);
    av = Avatar.mount(mun.firstElementChild, estadoVisible(Avatar.principal()));
    const dormida = () => { if (!est.muneca.en || !mun.isConnected) return; if (mun.querySelector('svg.av')) av.dormir(true); else setTimeout(dormida, 80); };
    dormida();
    pintarTodo(); encajar(); pintarMision();
    caja.addEventListener('pointerdown', abajo);
    if (!Avatar.cargar()) setTimeout(() => toast('Crea y guarda tu personaje en «Vestir» 👗'), 500);
  }

  /* ---------- la muñeca ---------- */
  function acostar(uid) {
    clearTimeout(paseo); est.muneca.en = uid; guardar(); pintarMuneca(0);
    av.set(estadoVisible(Avatar.principal())); av.andar(false); av.dormir(true);
    say('Buenas noches…'); tone(500, .3, 'sine', .1); tone(400, .4, 'sine', .1, .25);
  }
  function levantar(saludo = true) {
    if (!est.muneca.en) return false;
    const cama = est.objetos.find(x => x.uid === est.muneca.en);
    est.muneca.en = null;
    if (cama) { est.muneca.x = Math.min(SUELO.x1, cama.x + 300); est.muneca.y = Math.min(SUELO.y1, cama.y + 10); }
    guardar(); av.set(Avatar.principal()); av.dormir(false); pintarMuneca(0);
    if (saludo) { av.saludar(); say('¡Ya me desperté!'); }
    return true;
  }
  function caminar(x, y, luego) {
    if (levantar(false)) return;
    x = clamp(x, SUELO.x0, SUELO.x1); y = clamp(y, SUELO.y0, SUELO.y1);
    const ms = Math.max(250, Math.hypot(x - est.muneca.x, (y - est.muneca.y) * 1.6) / 380 * 1000);
    est.muneca.x = x; est.muneca.y = y; guardar(); av.andar(true); pintarMuneca(ms);
    clearTimeout(paseo); paseo = setTimeout(() => { av.andar(false); if (luego) luego(); }, ms);
  }

  /* ---------- objetos ---------- */
  function seleccionar(uid) { sel = uid; est.objetos.forEach(pintarObjeto); quitarBtn.style.display = uid ? '' : 'none'; }
  function nuevoUid() { return 'o' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); }
  function colocar(o) {
    if (bloqueado(o)) { toast(`🔒 Se consigue con ${o.desbloqueo.logros} logros`); tone(300, .12, 'triangle'); return; }
    const ya = est.objetos.find(x => x.id === o.id);
    if (o.unico && ya) {
      if (ya.dentro) { sacarUno(ya, est.objetos.find(x => x.uid === ya.dentro)); guardar(); seleccionar(ya.uid); return; }
      seleccionar(ya.uid); toast(`${o.nombre}: ya está en la habitación`); return;
    }
    const it = { uid: nuevoUid(), id: o.id, x: 760 + Math.random() * 200, y: 820 + Math.random() * 120 };
    est.objetos.push(it); guardar(); pintarObjeto(it); seleccionar(it.uid); tone(600, .1, 'triangle');
  }
  function quitar() {
    if (!sel) return;
    if (est.muneca.en === sel) levantar(false);
    const cont = est.objetos.find(x => x.uid === sel);
    est.objetos.filter(x => x.dentro === sel).forEach((it, i) => sacarUno(it, cont, i));   // lo que hubiera dentro sale al suelo
    est.objetos = est.objetos.filter(x => x.uid !== sel);
    escena.querySelectorAll(`[data-uid="${sel}"]`).forEach(e => e.remove()); seleccionar(null); guardar(); pintarTodo(); tone(250, .15, 'triangle');
  }
  // guardar un juguete en un contenedor (soltándolo encima)
  function meter(it, cont) {
    it.dentro = cont.uid; guardar(); if (sel === it.uid) seleccionar(null);
    const els = escena.querySelectorAll(`[data-uid="${it.uid}"]`);
    els.forEach(el => { el.classList.add('mm-entra'); setTimeout(() => el.remove(), 380); });
    tone(700, .08, 'triangle'); tone(950, .1, 'sine', .1, .08);
    revisarMision();
  }
  function sacarUno(it, cont, i = 0) {
    const ang = -Math.PI / 2 + (i - 1.5) * 0.7;
    it.dentro = null; it.x = clamp((cont ? cont.x : 900) + Math.cos(ang) * 150, SUELO.x0, SUELO.x1); it.y = clamp((cont ? cont.y : 860) + 60 + Math.abs(Math.sin(ang)) * 40, SUELO.y0, SUELO.y1);
    pintarObjeto(it);
  }
  function sacar(cont) {
    const dentro = est.objetos.filter(x => x.dentro === cont.uid);
    dentro.forEach((it, i) => sacarUno(it, cont, i)); guardar(); tone(500, .1, 'triangle');
    if (dentro.length) say('¡Juguetes fuera!');
    return dentro.length;
  }
  function contenedorBajo(e, sinUid) {
    return [...escena.querySelectorAll('.mm-obj[data-capa="detras"]')].reverse().map(el => est.objetos.find(o => o.uid === el.dataset.uid))
      .find(it => { if (!it || it.uid === sinUid || !porId(it.id).contenedor) return false;
        const r = escena.querySelector(`[data-uid="${it.uid}"][data-capa="detras"]`).getBoundingClientRect(), m = 14;
        return e.clientX > r.left - m && e.clientX < r.right + m && e.clientY > r.top - m && e.clientY < r.bottom + m; });
  }

  /* ---------- misiones ---------- */
  const misionActiva = () => mis && mis.activa && MISIONES.find(m => m.id === mis.activa && misionLista(m));
  function progreso(m) {
    const cont = est.objetos.find(x => x.id === m.objetivo.contenedor && !x.dentro);
    return m.objetivo.objetos.filter(id => cont && est.objetos.some(x => x.id === id && x.dentro === cont.uid)).length;
  }
  function empezar(id) {
    const m = MISIONES.find(x => x.id === id); if (!m || !misionLista(m)) return false;
    levantar(false); cerrarPanel();
    let cont = est.objetos.find(x => x.id === m.objetivo.contenedor);
    if (!cont) { cont = { uid: nuevoUid(), id: m.objetivo.contenedor, x: m.sitioContenedor[0], y: m.sitioContenedor[1] }; est.objetos.push(cont); }
    cont.dentro = null;
    // los juguetes, en sitios del suelo que no tape la muñeca (los más alejados de ella, en orden al azar)
    const lejos = ([x, y]) => Math.abs(x - est.muneca.x) > 170 || y > est.muneca.y + 40;
    const sitios = m.sitios.filter(lejos).concat(m.sitios.filter(s => !lejos(s))).slice(0, m.objetivo.objetos.length).sort(() => Math.random() - .5);
    m.objetivo.objetos.forEach((id, i) => {
      let it = est.objetos.find(x => x.id === id);
      if (!it) { it = { uid: nuevoUid(), id }; est.objetos.push(it); }
      it.dentro = null; [it.x, it.y] = sitios[i % sitios.length];
    });
    mis.activa = m.id; guardar(); guardarMis(); pintarTodo(); pintarMision();
    say(m.inicio); tone(600, .1, 'triangle'); tone(800, .12, 'sine', .1, .1);
    return true;
  }
  function dejar() { mis.activa = null; guardarMis(); pintarMision(); sfx.pop(); }
  function revisarMision() {
    const m = misionActiva(); if (!m) return;
    const n = progreso(m), total = m.objetivo.objetos.length;
    pintarMision();
    if (n >= total) {
      mis.activa = null; mis.hechas[m.id] = (mis.hechas[m.id] || 0) + 1; guardarMis();
      if (m.premio && m.premio.estrellas) addStar(m.premio.estrellas);
      setTimeout(() => { confetti(); sfx.good(); say(m.fin); toast('⭐ ¡Misión cumplida!'); av && av.saludar(); pintarMision(); }, 400);
    } else say(`${pick(m.bien)} ${total - n === 1 ? 'Falta uno' : 'Faltan ' + (total - n)}`);
  }
  function pintarMision() {
    if (!caja) return;
    let b = caja.querySelector('.mm-mision'); const m = misionActiva();
    if (!m) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.className = 'mm-mision'; caja.appendChild(b); }
    const n = progreso(m), total = m.objetivo.objetos.length;
    b.innerHTML = `<b>${m.titulo}</b><span class="mm-puntos">${m.objetivo.objetos.map((_, i) => `<i class="${i < n ? 'si' : ''}"></i>`).join('')}</span><span>${n} de ${total}</span><button class="btn" aria-label="Dejar la misión">✖</button>`;
    b.querySelector('button').onclick = e => { e.stopPropagation(); dejar(); };
    b.addEventListener('pointerdown', e => e.stopPropagation());
  }
  function abrirPanel() {
    cerrarPanel(); const lista = MISIONES.filter(misionLista); if (!lista.length) return;
    const p = document.createElement('div'); p.className = 'mm-panel';
    p.innerHTML = '<div class="mm-panel-caja"><h3>Misiones</h3>' + lista.map(m => `<button class="btn mm-mis" data-id="${m.id}">${m.titulo}` +
      `${mis.hechas[m.id] ? ` <small>✓ ${mis.hechas[m.id]}</small>` : ''}</button>`).join('') + '<button class="btn mm-cerrar">Jugar libre</button></div>';
    p.addEventListener('pointerdown', e => e.stopPropagation());
    p.onclick = e => { const b = e.target.closest('button'); if (!b) { cerrarPanel(); return; } if (b.dataset.id) empezar(b.dataset.id); else cerrarPanel(); };
    caja.appendChild(p); sfx.pop();
  }
  function cerrarPanel() { const p = caja && caja.querySelector('.mm-panel'); if (p) p.remove(); }

  /* ---------- tocar y arrastrar ---------- */
  function punto(e) { const r = escena.getBoundingClientRect(), k = +escena.dataset.k; return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; }
  function abajo(e) {
    e.stopPropagation(); e.preventDefault();
    const [x, y] = punto(e), objEl = e.target.closest('.mm-obj'), enMun = e.target.closest('.mm-muneca');
    if (enMun) arrastre = { tipo: 'muneca', x0: x, y0: y, dx: est.muneca.x - x, dy: est.muneca.y - y, movido: false };
    else if (objEl) { const it = est.objetos.find(o => o.uid === objEl.dataset.uid); arrastre = { tipo: 'obj', it, x0: x, y0: y, dx: it.x - x, dy: it.y - y, movido: false }; }
    else arrastre = { tipo: 'suelo', x0: x, y0: y };
    arrastre.id = e.pointerId;
  }
  function mover(e) {
    if (!arrastre || arrastre.id !== e.pointerId || arrastre.tipo === 'suelo') return;
    const [x, y] = punto(e);
    if (!arrastre.movido && Math.hypot(x - arrastre.x0, y - arrastre.y0) < 12) return;
    if (!arrastre.movido) { arrastre.movido = true; if (arrastre.tipo === 'muneca') { levantar(false); arrastre.dx = est.muneca.x - x; arrastre.dy = est.muneca.y - y; } }
    const nx = clamp(x + arrastre.dx, SUELO.x0, SUELO.x1), ny = clamp(y + arrastre.dy, SUELO.y0, SUELO.y1);
    if (arrastre.tipo === 'muneca') { clearTimeout(paseo); av.andar(false); est.muneca.x = nx; est.muneca.y = ny; pintarMuneca(0); }
    else { const it = arrastre.it; it.x = nx; it.y = ny; pintarObjeto(it); if (est.muneca.en === it.uid) pintarMuneca(0);
      const c = porId(it.id).guardable && contenedorBajo(e, it.uid); escena.querySelectorAll('.mm-obj.encima').forEach(el => el.classList.remove('encima'));
      if (c) escena.querySelectorAll(`[data-uid="${c.uid}"]`).forEach(el => el.classList.add('encima')); }
  }
  function arriba(e) {
    if (!arrastre || arrastre.id !== e.pointerId) return;
    const a = arrastre; arrastre = null; const [x, y] = punto(e);
    if (a.movido) encajar();
    if (escena) escena.querySelectorAll('.mm-obj.encima').forEach(el => el.classList.remove('encima'));
    if (a.tipo === 'suelo') { seleccionar(null); cerrarPanel(); caminar(x, y); return; }
    if (a.tipo === 'muneca') {
      if (!a.movido) { if (!levantar()) { av.saludar(); sfx.pop(); say(pick(['¡Hola!', '¡Qué bonita es mi habitación!', '¿Jugamos?'])); } return; }
      const cama = [...escena.querySelectorAll('.mm-obj[data-capa="detras"]')].reverse().find(el => { const it = est.objetos.find(o => o.uid === el.dataset.uid), r = el.getBoundingClientRect();
        return porId(it.id).acostar && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; });
      if (cama) acostar(cama.dataset.uid); else { guardar(); sfx.pop(); }
      return;
    }
    const o = porId(a.it.id);
    if (a.movido) {
      const c = o.guardable && contenedorBajo(e, a.it.uid);
      if (c) meter(a.it, c); else { guardar(); sfx.pop(); }
      return;
    }
    seleccionar(a.it.uid);
    if (o.contenedor && est.objetos.some(x => x.dentro === a.it.uid) && !misionActiva()) { sacar(a.it); return; }
    if (o.acostar && est.muneca.en !== a.it.uid) {   // tocar la cama: va a la cama y se acuesta
      const k = escalaDe(o, a.it.y); caminar(a.it.x + 260 * k, a.it.y + 8, () => acostar(a.it.uid));
    }
  }
  addEventListener('pointermove', mover); addEventListener('pointerup', arriba); addEventListener('pointercancel', arriba);
  addEventListener('resize', () => { if (escena && escena.isConnected) encajar(); });

  /* ---------- bandeja: catálogo ilustrado ---------- */
  function bandeja() {
    const row = $('#stkRow'); row.innerHTML = '';
    CAT.filter(conArte).forEach(o => {
      const b = document.createElement('button'); b.className = 'stkbtn mm-item' + (bloqueado(o) ? ' bloq' : ''); b.dataset.id = o.id;
      b.innerHTML = `<img src="${urlDe(MED()[o.capas.detras].f)}" alt="" draggable="false"><span>${o.nombre}</span>` + (bloqueado(o) ? '<i>🔒</i>' : '');
      b.onclick = () => colocar(o); row.appendChild(b);
    });
  }

  /* ---------- enganche con «Mi Mundo» (las demás escenas, como hoy) ---------- */
  const roomSetupHoy = roomSetup;
  const quitarBtn = document.createElement('button'); quitarBtn.className = 'btn'; quitarBtn.id = 'mmQuitar'; quitarBtn.textContent = '🗑️'; quitarBtn.style.display = 'none';
  quitarBtn.onclick = quitar;
  const misBtn = document.createElement('button'); misBtn.className = 'btn'; misBtn.id = 'mmMisiones'; misBtn.textContent = '🎯'; misBtn.setAttribute('aria-label', 'Misiones'); misBtn.style.display = 'none';
  misBtn.onclick = () => { if (caja && caja.querySelector('.mm-panel')) cerrarPanel(); else abrirPanel(); };
  $('#stkCtl').after(quitarBtn); quitarBtn.after(misBtn);
  roomSetup = function () {
    const nueva = scKey === 'habitacion';
    stkL.style.display = nueva ? 'none' : ''; quitarBtn.style.display = 'none'; sel = null;
    $('#stkTabs').style.display = nueva ? 'none' : '';
    misBtn.style.display = nueva && MISIONES.some(misionLista) ? '' : 'none';
    if (!nueva) { escena = null; caja = null; roomSetupHoy(); return; }
    clearTimeout(walkT); walker.classList.remove('on'); $('#stkCtl').classList.remove('on');
    board.style.background = 'linear-gradient(#f6dcd0 0 55%,#d9924f 55%)';
    est = cargar(); mis = cargarMis(); montar(); bandeja();
    if (!est.muneca.en && Avatar.cargar()) setTimeout(() => av && av.saludar(), 400);
  };
  avPlace = function () {};
  roomFit = function () { encajar(); };
  // para la prueba automática y para depurar
  window.MM = { CAT, MISIONES, conArte, misionLista, empezar, dejar, progreso: id => progreso(MISIONES.find(m => m.id === id)),
    estado: () => est, misiones: () => mis, KEY, KEY_MIS };
  if (typeof current !== 'undefined' && current === 'scene') scLoad();
})();
