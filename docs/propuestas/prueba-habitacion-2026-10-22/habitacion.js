/* =====================================================================
   Prueba de la habitación ilustrada de «Mi Mundo» (D-031) · solo en esta copia
   ---------------------------------------------------------------------
   Sustituye, en el escenario «habitación», el dibujo de hoy por el fondo y los
   muebles ilustrados. Las demás escenas siguen como están.
     · La muñeca guardada se arrastra; tocar el suelo la hace caminar; soltarla
       en la cama (o tocar la cama) la acuesta: ojos cerrados, entre la cama
       (detrás) y el embozo (delante); tocarla la levanta. Acostada, se ocultan
       las alas, la mochila y la varita (solo lo que se ve: lo guardado no cambia).
     · Catálogo de muebles y objetos de la habitación (bandeja de abajo): cada
       uno se coloca, se mueve y se quita; los iniciales son gratis y los
       demás se desbloquean con logros (con candado hasta entonces). Nada de lo
       ya aprobado se bloquea.
     · Todo se guarda en «mm_habitacion2» (con el prefijo de la copia). Las
       claves de la habitación de hoy (mm_hab, sc_habitacion) no se tocan.
   Coordenadas: las del fondo (1536 × 1024); la escena se escala para caber.
   ===================================================================== */
(function () {
  'use strict';
  const DIR = document.currentScript.src.replace(/[^/]*$/, '');
  const W = 1536, H = 1024, KEY = 'mm_habitacion2';
  // altura de la muñeca de pie según lo cerca que esté (pies en y): medida sobre el fondo con la ventana
  const alto = y => 250 + (y - 560) * 170 / 430;
  const SUELO = { x0: 90, x1: 1450, y0: 585, y1: 1005 };
  const OCULTAR_ACOSTADA = ['alas', 'mochila', 'varita'];
  // catálogo de la habitación: px = tamaño de la imagen; base = punto de apoyo (abajo, en el centro) en la imagen;
  // escala = escala de la imagen con la base en yRef; acostar = ancla de la muñeca acostada (en px de la imagen)
  const CATALOGO = [
    { id: 'cama', nombre: 'Cama', unico: true, inicial: { x: 416, y: 979 }, px: [1312, 1199], base: [656, 1190], escala: 0.62, yRef: 979,
      capas: { detras: 'arte/cama-detras.webp', delante: 'arte/cama-delante.webp' }, acostar: { cx: 385, cy: 525, giro: -25, alto: 560 } },
  ];
  window.HAB_CATALOGO = CATALOGO;   // para la prueba automática
  const porId = id => CATALOGO.find(o => o.id === id);
  const bloqueado = o => !!(o.desbloqueo && !(window.Logros && Logros.total && Logros.total() >= o.desbloqueo.logros));

  let est = null, escena = null, mun = null, av = null, sel = null, arrastre = null, paseo = null;
  const guardar = () => store.set(KEY, est);
  function cargar() {
    const e = store.get(KEY, null);
    if (e && e.v === 1) return e;
    return { v: 1, muneca: { x: 1000, y: 860, en: null }, objetos: CATALOGO.filter(o => o.inicial).map((o, i) => ({ uid: 'o' + i, id: o.id, x: o.inicial.x, y: o.inicial.y })) };
  }
  const escalaDe = (o, y) => o.escala * alto(y) / alto(o.yRef);

  /* ---------- montaje ---------- */
  // Encuadre: en pantallas anchas llena el ancho (recorta pared si hace falta, hasta un 55 % del alto); en las estrechas
  // (iPhone en vertical) llena el alto. Si no cabe entera, la cámara sigue a la muñeca (o a su almohada, si está acostada).
  function foco() {
    const m = est.muneca, cama = m.en && est.objetos.find(x => x.uid === m.en);
    if (cama) { const o = porId(cama.id), k = escalaDe(o, cama.y); return [cama.x + (o.acostar.cx - o.base[0]) * k, cama.y + (o.acostar.cy - o.base[1]) * k]; }
    return [m.x, m.y - alto(m.y) * 0.5];
  }
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
    const o = porId(it.id); if (!o) return;
    const k = escalaDe(o, it.y), w = o.px[0] * k, h = o.px[1] * k, x = it.x - o.base[0] * k, y = it.y - o.base[1] * k;
    ['detras', 'delante'].forEach((capa, j) => {
      let el = escena.querySelector(`[data-uid="${it.uid}"][data-capa="${capa}"]`);
      if (!o.capas[capa]) return;
      if (!el) { el = document.createElement('img'); el.className = 'hab2-obj'; el.dataset.uid = it.uid; el.dataset.capa = capa; el.src = DIR + o.capas[capa]; el.draggable = false; escena.appendChild(el); }
      Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', zIndex: Math.round(it.y) * 4 + (j ? 2 : 0) });
      el.classList.toggle('sel', sel === it.uid);
    });
  }
  function estadoVisible(st) {
    return est.muneca.en ? Object.assign({}, st, { accesorios: st.accesorios.filter(a => !OCULTAR_ACOSTADA.includes(a)) }) : st;
  }
  function pintarMuneca(ms) {
    const m = est.muneca; mun.style.transitionDuration = (ms || 0) + 'ms';
    const cama = m.en && est.objetos.find(x => x.uid === m.en);
    if (cama) {
      const o = porId(cama.id), k = escalaDe(o, cama.y), a = o.acostar, s = a.alto / 1500 * k;
      const w = 948 * s, h = 1590 * s, cx = cama.x + (a.cx - o.base[0]) * k, cy = cama.y + (a.cy - o.base[1]) * k;
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
    const caja = document.createElement('div'); caja.className = 'hab2';
    escena = document.createElement('div'); escena.className = 'hab2-escena';
    escena.innerHTML = `<img class="hab2-fondo" src="${DIR}arte/fondo-habitacion.webp" draggable="false" alt="">`;
    mun = document.createElement('div'); mun.className = 'hab2-muneca'; mun.innerHTML = '<div class="hab2-av"></div><span class="hab2-zzz">Z z z</span>';
    escena.appendChild(mun); caja.appendChild(escena); roomL.appendChild(caja);
    const st = Avatar.principal();
    av = Avatar.mount(mun.firstElementChild, estadoVisible(st));
    // el motor dibuja la muñeca cuando han cargado sus piezas: se espera a que esté para cerrarle los ojos
    const dormida = () => { if (!est.muneca.en || !mun.isConnected) return; if (mun.querySelector('svg.av')) av.dormir(true); else setTimeout(dormida, 80); };
    dormida();
    pintarTodo(); encajar();
    caja.addEventListener('pointerdown', abajo);
    if (!Avatar.cargar()) setTimeout(() => toast('Crea y guarda tu personaje en «Vestir» 👗'), 500);
  }

  /* ---------- acciones ---------- */
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
  function seleccionar(uid) { sel = uid; est.objetos.forEach(pintarObjeto); quitarBtn.style.display = uid ? '' : 'none'; }
  function colocar(o) {
    if (bloqueado(o)) { toast(`🔒 Se consigue con ${o.desbloqueo.logros} logros`); tone(300, .12, 'triangle'); return; }
    const ya = est.objetos.find(x => x.id === o.id);
    if (o.unico && ya) { seleccionar(ya.uid); toast(`${o.nombre}: ya está en la habitación`); return; }
    const uid = 'o' + Date.now().toString(36);
    est.objetos.push({ uid, id: o.id, x: 760 + Math.random() * 200, y: 820 + Math.random() * 120 }); guardar();
    pintarObjeto(est.objetos[est.objetos.length - 1]); seleccionar(uid); tone(600, .1, 'triangle');
  }
  function quitar() {
    if (!sel) return;
    if (est.muneca.en === sel) levantar(false);
    est.objetos = est.objetos.filter(x => x.uid !== sel);
    escena.querySelectorAll(`[data-uid="${sel}"]`).forEach(e => e.remove()); seleccionar(null); guardar(); tone(250, .15, 'triangle');
  }

  /* ---------- tocar y arrastrar ---------- */
  function punto(e) { const r = escena.getBoundingClientRect(), k = +escena.dataset.k; return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; }
  function abajo(e) {
    e.stopPropagation(); e.preventDefault();
    const [x, y] = punto(e), objEl = e.target.closest('.hab2-obj'), enMun = e.target.closest('.hab2-muneca');
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
    else { const it = arrastre.it; it.x = nx; it.y = ny; pintarObjeto(it); if (est.muneca.en === it.uid) pintarMuneca(0); }
  }
  function arriba(e) {
    if (!arrastre || arrastre.id !== e.pointerId) return;
    const a = arrastre; arrastre = null; const [x, y] = punto(e);
    if (a.movido) encajar();
    if (a.tipo === 'suelo') { seleccionar(null); caminar(x, y); return; }
    if (a.tipo === 'muneca') {
      if (!a.movido) { if (!levantar()) { av.saludar(); sfx.pop(); say(pick(['¡Hola!', '¡Qué bonita es mi habitación!', '¿Jugamos?'])); } return; }
      // soltada encima de una cama → se acuesta
      const cama = [...escena.querySelectorAll('.hab2-obj[data-capa="detras"]')].reverse().find(el => { const it = est.objetos.find(o => o.uid === el.dataset.uid), r = el.getBoundingClientRect();
        return porId(it.id).acostar && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; });
      if (cama) acostar(cama.dataset.uid); else { guardar(); sfx.pop(); }
      return;
    }
    if (a.movido) { guardar(); sfx.pop(); return; }
    seleccionar(a.it.uid);
    if (porId(a.it.id).acostar && est.muneca.en !== a.it.uid) {   // tocar la cama: va a la cama y se acuesta
      const o = porId(a.it.id), k = escalaDe(o, a.it.y); caminar(a.it.x + 260 * k, a.it.y + 8, () => acostar(a.it.uid));
    }
  }
  addEventListener('pointermove', mover); addEventListener('pointerup', arriba); addEventListener('pointercancel', arriba);
  addEventListener('resize', () => { if (escena && escena.isConnected) encajar(); });

  /* ---------- bandeja: catálogo de la habitación ---------- */
  function bandeja() {
    const row = $('#stkRow'); row.innerHTML = '';
    CATALOGO.forEach(o => {
      const b = document.createElement('button'); b.className = 'stkbtn hab2-item' + (bloqueado(o) ? ' bloq' : ''); b.dataset.id = o.id;
      b.innerHTML = `<img src="${DIR}${o.capas.detras}" alt="" draggable="false"><span>${o.nombre}</span>` + (bloqueado(o) ? '<i>🔒</i>' : '');
      b.onclick = () => colocar(o); row.appendChild(b);
    });
  }

  /* ---------- enganche con «Mi Mundo» (las demás escenas, como hoy) ---------- */
  const roomSetupHoy = roomSetup;
  const quitarBtn = document.createElement('button'); quitarBtn.className = 'btn'; quitarBtn.id = 'hab2Quitar'; quitarBtn.textContent = '🗑️'; quitarBtn.style.display = 'none';
  quitarBtn.onclick = quitar; $('#stkCtl').after(quitarBtn);
  roomSetup = function () {
    const nueva = scKey === 'habitacion';
    stkL.style.display = nueva ? 'none' : ''; quitarBtn.style.display = 'none'; sel = null;
    $('#stkTabs').style.display = nueva ? 'none' : '';
    if (!nueva) { escena = null; roomSetupHoy(); return; }
    clearTimeout(walkT); walker.classList.remove('on'); $('#stkCtl').classList.remove('on');
    board.style.background = 'linear-gradient(#f6dcd0 0 55%,#d9924f 55%)';
    est = cargar(); montar(); bandeja();
    if (!est.muneca.en && Avatar.cargar()) setTimeout(() => av && av.saludar(), 400);
  };
  avPlace = function () {};    // la habitación de hoy ya no coloca su personaje en esta escena
  roomFit = function () { encajar(); };
  // si ya estaba abierta (no debería), se vuelve a montar
  if (typeof current !== 'undefined' && current === 'scene') scLoad();
})();
