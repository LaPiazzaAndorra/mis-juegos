/* =====================================================================
   Mi Mundo · habitación y salón ilustrados jugables (D-033, D-034)
   ---------------------------------------------------------------------
   Motor de la habitación aprobada (D-033), ampliado a varios escenarios:
   cada escenario del catálogo (catalogo-mimundo.js + arte/medidas.js)
   ocupa una escena del juego (🛏️ habitación, 🏠 casa → salón) con su fondo,
   su suelo, sus objetos, sus misiones y su propia clave de datos: al cambiar
   de escena, cada uno conserva su distribución. Las demás escenas siguen
   como están (pegatinas).
   Juego libre:
     · la muñeca guardada se arrastra o camina (tocar el suelo); en la cama se
       acuesta (tocar la cama o soltarla encima) con los ojos cerrados y sin
       alas, mochila ni varita a la vista (lo guardado no cambia); tocarla la
       levanta;
     · la bandeja de abajo es el catálogo ilustrado del escenario: tocar un
       objeto lo pone (las cosas de la merienda van a un sitio libre de la
       mesa; los cojines de sofá, al sofá); se arrastra (crece o encoge con la
       profundidad) y se quita con 🗑️;
     · los juguetes se guardan soltándolos en la cesta y se sacan tocando la
       cesta;
     · cosas encima de los muebles: soltadas encima de la mesa, el sofá o un
       cojín de suelo, van a su sitio libre (platos, tazas, tetera y galletas a
       la mesa; peluches sentados en el sofá o en un cojín; cojines de sofá al
       sofá). Al mover el mueble, lo que tiene encima va con él; al
       arrastrarlas, se separan del mueble. Si se quita el mueble, lo que tenía
       encima queda en el suelo.
   Misiones (opcionales, botón 🎯; solo las del escenario): «Guardar los
   juguetes» (tipo «meter») y «Merienda para tres» (tipo «poner»: exactamente
   3 platos y 3 tazas, la tetera y las galletas en la mesa, y el osito y el
   conejito sentados). Una misión solo se ofrece si todos sus objetos tienen
   ilustración y son gratis. Al terminarla: celebración y 1 ⭐ (no toca los
   logros).
   Datos (con el prefijo de la copia): la clave de cada escenario
   («mm_habitacion2», «mm_salon») y «mm_misiones». No se tocan «mm_hab» ni
   «sc_*» (las pegatinas de cada escena se conservan, sin mostrarse).
   Coordenadas: las del fondo (1536 × 1024); la escena se escala para caber.
   ===================================================================== */
(function () {
  'use strict';
  const DIR = document.currentScript.src.replace(/[^/]*$/, '');
  const W = 1536, H = 1024, KEY_MIS = 'mm_misiones';
  const DATOS = window.MM_CATALOGO, ESCENARIOS = DATOS.escenarios, CAT = DATOS.objetos, MISIONES = DATOS.misiones;
  const OCULTAR_ACOSTADA = ['alas', 'mochila', 'varita'];
  let E = ESCENARIOS.habitacion;                                   // el escenario que se ve
  const alto = y => 250 + (y - E.suelo0) * 170 / 430;             // alto de la muñeca (1,10 m) con los pies en y
  const S = () => E.suelo;
  const MED = () => window.MM_MEDIDAS || {};
  const porId = id => CAT.find(o => o.id === id);
  const urlDe = f => /^(data:|blob:|https?:)/.test(f) ? f : DIR + 'arte/' + f;
  const conArte = o => !!o && Object.values(o.capas).every(c => MED()[c]);
  const bloqueado = o => !!(o.desbloqueo && !(window.Logros && Logros.total && Logros.total() >= o.desbloqueo.logros));
  const escenarioDe = k => Object.keys(ESCENARIOS).find(id => ESCENARIOS[id].escena === k);
  const objetosDe = m => m.objetivo.tipo === 'poner' ? [m.objetivo.mueble].concat(Object.keys(m.objetivo.cosas), m.objetivo.sentar)
    : [m.objetivo.contenedor].concat(m.objetivo.objetos);
  const misionLista = m => objetosDe(m).every(id => conArte(porId(id)) && !porId(id).desbloqueo);
  const misionesAqui = () => MISIONES.filter(m => E.misiones.includes(m.id));

  let est = null, mis = null, escena = null, caja = null, mun = null, av = null, sel = null, arrastre = null, paseo = null;
  const guardar = () => store.set(E.clave, est), guardarMis = () => store.set(KEY_MIS, mis);
  function cargar() {
    const e = store.get(E.clave, null);
    if (e && e.v === 1) return e;
    return { v: 1, muneca: { x: E.muneca[0], y: E.muneca[1], en: null },
      objetos: E.inicial.filter(i => conArte(porId(i.id))).map((i, n) => ({ uid: 'o' + n, id: i.id, x: i.x, y: i.y })) };
  }
  const cargarMis = () => Object.assign({ v: 1, activa: null, hechas: {} }, store.get(KEY_MIS, {}) || {});
  // escala del arte con la base en y: la de la cama, fija (respecto a su imagen); la de los demás, por su alto o su ancho
  // real (sin deformar: la misma en ancho y alto)
  function escalaDe(o, y) {
    const m = MED()[o.capas.detras];
    if (o.escala) return o.escala * alto(y) / alto(o.yRef);
    return o.anchoM ? o.anchoM / 1.10 * alto(y) / m.px[0] : o.altoM / 1.10 * alto(y) / m.px[1];
  }

  /* ---------- cosas encima de los muebles ---------- */
  // sitios de un mueble: [{ key, tipo, solo (solo para ese objeto), p (píxel de la imagen recibida), orden (0–5, delante = más) }]
  function sitiosDe(o) {
    if (!o || !o.encima) return [];
    if (o._sitios) return o._sitios;
    const r = [];
    Object.entries(o.encima).forEach(([tipo, v]) => {
      if (Array.isArray(v)) v.forEach((p, i) => r.push({ key: tipo + ':' + i, tipo, p }));
      else Object.entries(v).forEach(([solo, ps]) => ps.forEach((p, i) => r.push({ key: tipo + ':' + solo + ':' + i, tipo, solo, p })));
    });
    const ys = r.map(s => s.p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    r.forEach(s => { s.orden = y1 > y0 ? Math.round((s.p[1] - y0) / (y1 - y0) * 5) : 0; });
    return (o._sitios = r);
  }
  const cabe = (s, o) => !!o.va && s.tipo === o.va && (!s.solo || s.solo === o.id);
  const padreDe = it => it.sobre ? est.objetos.find(x => x.uid === it.sobre && !x.dentro) : null;
  const hijos = p => est.objetos.filter(x => x.sobre === p.uid);
  function ancla(padre, key) {
    const o = porId(padre.id), s = sitiosDe(o).find(z => z.key === key); if (!s) return null;
    const m = MED()[o.capas.detras], k = escalaDe(o, padre.y);
    return [padre.x + (s.p[0] - m.recorte[0] - m.base[0]) * k, padre.y + (s.p[1] - m.recorte[1] - m.base[1]) * k, s];
  }
  const libres = (padre, o, sin) => sitiosDe(porId(padre.id)).filter(s => cabe(s, o) &&
    !est.objetos.some(x => x !== sin && x.sobre === padre.uid && x.sitio === s.key));
  function ponerEn(it, padre, s) { it.sobre = padre.uid; it.sitio = s.key; it.dentro = null; const a = ancla(padre, s.key); it.x = a[0]; it.y = a[1]; }
  function bajar(it) { it.sobre = null; it.sitio = null; }
  // un sitio libre para o (al ponerlo desde la bandeja): el primero libre de un mueble del escenario
  function sitioLibre(o, sin) {
    for (const p of est.objetos) { if (p.dentro || p.sobre) continue; const l = libres(p, o, sin); if (l.length) return { padre: p, s: l[0] }; }
    return null;
  }

  /* ---------- montaje ---------- */
  function foco(soloMuneca) {
    const mi = !soloMuneca && misionActiva(); if (mi && mi.foco) return mi.foco.slice();   // al empezar una misión, la cámara mira a sus objetos
    const m = est.muneca, cama = m.en && est.objetos.find(x => x.uid === m.en);
    if (cama) { const [cx, cy] = anclaCama(cama); return [cx, cy]; }
    return [m.x, m.y - alto(m.y) * 0.5];
  }
  // Encuadre: en pantallas anchas llena el ancho (recorta pared, hasta un 55 % del alto); en las estrechas llena el
  // alto. Cámara LIBRE (D-037): mira a est.cam (el centro de la vista, en coordenadas del fondo) y no sigue a la muñeca;
  // se mueve con las flechas, arrastrando el suelo o llevando algo cerca del borde, y el botón con su cara la encuentra.
  let vista = null;
  function encajar(sinAnim) {
    if (!escena) return;
    const r = board.getBoundingClientRect(), bw = r.width, bh = r.height;
    if (!est.cam) est.cam = foco();
    const [fx, fy] = est.cam;
    let k = bw / bh >= W / H ? Math.min(bw / W, bh / (0.45 * H)) : bh / H;
    // durante una misión con «vista», en pantallas estrechas (iPhone en vertical) la cámara se abre hasta verla entera;
    // la escena queda abajo (el suelo junto a la bandeja) y arriba sigue el color de la pared
    const mi = misionActiva(), abrir = mi && mi.vista && bw / (mi.vista[1] - mi.vista[0]) < k;
    if (abrir) k = bw / (mi.vista[1] - mi.vista[0]);
    const tx = W * k > bw ? clamp(bw / 2 - fx * k, bw - W * k, 0) : (bw - W * k) / 2;
    const ty = H * k > bh ? clamp(bh / 2 - fy * k, bh - H * k, 0) : abrir ? bh - H * k : (bh - H * k) / 2;
    if (W * k > bw) est.cam[0] = (bw / 2 - tx) / k;   // la cámara no sale del fondo
    if (H * k > bh) est.cam[1] = (bh / 2 - ty) / k;
    escena.classList.toggle('mm-sinanim', !!sinAnim);
    escena.style.transform = `translate(${tx}px,${ty}px) scale(${k})`;
    escena.dataset.k = k; vista = { tx, ty, k, bw, bh };
    pintarControles();
  }
  function mirar(x, y, sinAnim) { est.cam = [x, y == null ? est.cam[1] : y]; encajar(sinAnim); }
  // las flechas solo se ven si hay más escena hacia ese lado; el botón para encontrarla, solo si no está a la vista
  function pintarControles() {
    if (!caja || !vista || !caja.querySelector('.mm-flecha')) return;
    const { tx, k, bw, bh, ty } = vista, ancho = W * k > bw + 1;
    caja.querySelector('.mm-flecha.izq').classList.toggle('on', ancho && tx < -1);
    caja.querySelector('.mm-flecha.der').classList.toggle('on', ancho && tx > bw - W * k + 1);
    const [mx, my] = foco(true), sx = tx + mx * k, sy = ty + my * k;
    caja.querySelector('.mm-buscar').classList.toggle('on', sx < 20 || sx > bw - 20 || sy < 20 || sy > bh - 20);
  }
  // orden de dibujo: por la profundidad (y) ×10; +1 la muñeca, +2 la capa «delante» (cama), +3…+8 lo que está encima de
  // un mueble (más delante en el mueble, más arriba); la alfombra («plano»), siempre debajo de todo
  function pintarObjeto(it) {
    const o = porId(it.id);
    if (!o || it.dentro || !conArte(o)) { escena.querySelectorAll(`[data-uid="${it.uid}"]`).forEach(e => e.remove()); return; }
    const p = padreDe(it);
    if (it.sobre && !p) bajar(it);
    let yProf = it.y, z = Math.round(it.y) * 10;
    if (p) { const a = ancla(p, it.sitio); if (a) { it.x = a[0]; it.y = a[1]; yProf = p.y; z = Math.round(p.y) * 10 + 3 + a[2].orden; } else bajar(it); }
    if (o.plano) z = 1;
    const k = escalaDe(o, yProf);
    ['detras', 'delante'].forEach((capa, j) => {
      if (!o.capas[capa]) return;
      const m = MED()[o.capas[capa]], w = m.px[0] * k, h = m.px[1] * k, x = it.x - m.base[0] * k, y = it.y - m.base[1] * k;
      let el = escena.querySelector(`[data-uid="${it.uid}"][data-capa="${capa}"]`);
      if (!el) { el = document.createElement('img'); el.className = 'mm-obj'; el.dataset.uid = it.uid; el.dataset.capa = capa; el.dataset.id = o.id; el.src = urlDe(m.f); el.draggable = false; el.alt = ''; escena.appendChild(el); }
      Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', zIndex: z + (j ? 2 : 0) });
      el.classList.toggle('sel', sel === it.uid);
    });
    hijos(it).forEach(pintarObjeto);   // lo que tiene encima va con el mueble
    if (o.interruptor) pintarLuz(it);
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
      Object.assign(mun.style, { left: cx - w / 2 + 'px', top: cy - h / 2 + 'px', width: w + 'px', height: h + 'px', transform: `rotate(${a.giro}deg)`, zIndex: Math.round(cama.y) * 10 + 1 });
    } else {
      const h = alto(m.y) * 1590 / 1500, w = h * 948 / 1590;
      Object.assign(mun.style, { left: m.x - w * 479 / 948 + 'px', top: m.y - h * 1542 / 1590 + 'px', width: w + 'px', height: h + 'px', transform: '', zIndex: Math.round(m.y) * 10 + 1 });
    }
    mun.classList.toggle('acostada', !!cama);
    pintarControles();   // la cámara no la sigue: si sale de la vista, aparece el botón para encontrarla
  }
  function pintarTodo() { est.objetos.forEach(pintarObjeto); pintarMuneca(0); }
  function montar() {
    roomL.innerHTML = '';
    caja = document.createElement('div'); caja.className = 'mm'; caja.dataset.escenario = E.id;
    escena = document.createElement('div'); escena.className = 'mm-escena';
    escena.innerHTML = `<img class="mm-fondo" src="${urlDe(MED()[E.fondo].f)}" draggable="false" alt="">`;
    mun = document.createElement('div'); mun.className = 'mm-muneca'; mun.innerHTML = '<div class="mm-av"></div><span class="mm-zzz">Z z z</span>';
    escena.appendChild(mun); caja.appendChild(escena); roomL.appendChild(caja);
    montarCiclo(); montarControles();
    av = Avatar.mount(mun.firstElementChild, estadoVisible(Avatar.principal()));
    const dormida = () => { if (!est.muneca.en || !mun.isConnected) return; if (mun.querySelector('svg.av')) av.dormir(true); else setTimeout(dormida, 80); };
    dormida();
    pintarTodo(); encajar(); pintarMision(); pintarNecesidades(); pintarLuces();
    caja.addEventListener('pointerdown', abajo);
    if (!Avatar.cargar()) setTimeout(() => toast('Crea y guarda tu personaje en «Vestir» 👗'), 500);
  }

  /* ---------- la muñeca ---------- */
  function acostar(uid) {
    clearTimeout(paseo); cerrarAviso(); est.muneca.en = uid; guardar(); pintarMuneca(0);
    av.set(estadoVisible(Avatar.principal())); av.andar(false); av.dormir(true);
    say('Buenas noches…'); tone(500, .3, 'sine', .1); tone(400, .4, 'sine', .1, .25);
  }
  function levantar(saludo = true) {
    if (!est.muneca.en) return false;
    const cama = est.objetos.find(x => x.uid === est.muneca.en);
    est.muneca.en = null;
    if (cama) { est.muneca.x = Math.min(S().x1, cama.x + 300); est.muneca.y = Math.min(S().y1, cama.y + 10); }
    guardar(); av.set(Avatar.principal()); av.dormir(false); pintarMuneca(0);
    if (saludo) { av.saludar(); const t = activa('sueno') && nec.sueno >= 90 ? '¡He dormido genial!' : '¡Ya me desperté!'; bocadillo(t); say(t);
      setTimeout(proponerRopaDeDia, 1800); }
    return true;
  }
  function caminar(x, y, luego) {
    if (levantar(false)) return;
    x = clamp(x, S().x0, S().x1); y = clamp(y, S().y0, S().y1);
    const ms = Math.max(250, Math.hypot(x - est.muneca.x, (y - est.muneca.y) * 1.6) / 380 * 1000);
    est.muneca.x = x; est.muneca.y = y; guardar(); av.andar(true); pintarMuneca(ms);
    clearTimeout(paseo); paseo = setTimeout(() => { av.andar(false); if (luego) luego(); }, ms);
  }

  /* ---------- objetos ---------- */
  function seleccionar(uid) { sel = uid; est.objetos.forEach(pintarObjeto); quitarBtn.style.display = uid ? '' : 'none'; }
  function nuevoUid() { return 'o' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); }
  function colocar(o) {
    if (bloqueado(o)) { toast(`🔒 Se consigue con ${o.desbloqueo.logros} logros`); tone(300, .12, 'triangle'); return; }
    const ya = est.objetos.filter(x => x.id === o.id);
    if (o.unico && ya.length) {
      const it = ya[0];
      if (it.dentro) { sacarUno(it, est.objetos.find(x => x.uid === it.dentro)); guardar(); seleccionar(it.uid); return; }
      seleccionar(it.uid); toast(`${o.nombre}: ya está en ${E.nombre === 'Salón' ? 'el salón' : 'la habitación'}`); return;
    }
    if (o.max && ya.length >= o.max) { toast(`${o.nombre}: ya hay ${o.max}`); tone(300, .12, 'triangle'); return; }
    const [nx, ny] = E.sitioNuevo || [760, 820];
    const it = { uid: nuevoUid(), id: o.id, x: nx + Math.random() * 200, y: ny + Math.random() * 120 };
    // las cosas de la merienda van a un sitio libre de la mesa y los cojines de sofá, al sofá (los peluches, al suelo)
    const d = o.va && o.va !== 'peluche' && sitioLibre(o, it);
    est.objetos.push(it); if (d) ponerEn(it, d.padre, d.s);
    guardar(); pintarObjeto(it); seleccionar(it.uid); tone(600, .1, 'triangle');
    if (d) revisarMision(); else pintarMision();
  }
  function quitar() {
    if (!sel) return;
    if (est.muneca.en === sel) levantar(false);
    const cont = est.objetos.find(x => x.uid === sel);
    est.objetos.filter(x => x.dentro === sel || x.sobre === sel).forEach((it, i) => sacarUno(it, cont, i));   // lo que hubiera dentro o encima, al suelo
    est.objetos = est.objetos.filter(x => x.uid !== sel);
    escena.querySelectorAll(`[data-uid="${sel}"]`).forEach(e => e.remove()); seleccionar(null); guardar(); pintarTodo(); pintarMision(); tone(250, .15, 'triangle');
  }
  // guardar un juguete en un contenedor (soltándolo encima)
  function meter(it, cont) {
    bajar(it); it.dentro = cont.uid; guardar(); if (sel === it.uid) seleccionar(null);
    const els = escena.querySelectorAll(`[data-uid="${it.uid}"]`);
    els.forEach(el => { el.classList.add('mm-entra'); setTimeout(() => el.remove(), 380); });
    tone(700, .08, 'triangle'); tone(950, .1, 'sine', .1, .08);
    revisarMision();
  }
  function sacarUno(it, cont, i = 0) {
    const ang = -Math.PI / 2 + (i - 1.5) * 0.7;
    bajar(it); it.dentro = null;
    it.x = clamp((cont ? cont.x : 900) + Math.cos(ang) * 150, S().x0, S().x1); it.y = clamp((cont ? cont.y : 860) + 60 + Math.abs(Math.sin(ang)) * 40, S().y0, S().y1);
    pintarObjeto(it);
  }
  function sacar(cont) {
    const dentro = est.objetos.filter(x => x.dentro === cont.uid);
    dentro.forEach((it, i) => sacarUno(it, cont, i)); guardar(); tone(500, .1, 'triangle');
    if (dentro.length) say('¡Juguetes fuera!');
    return dentro.length;
  }
  // dónde va lo que se suelta en e: un sitio libre de un mueble (el más cercano al dedo) o dentro de un contenedor
  function destinoBajo(e, it) {
    const o = porId(it.id), [x, y] = punto(e), m = TOQUE;
    const els = [...escena.querySelectorAll('.mm-obj[data-capa="detras"]')].sort((a, b) => b.style.zIndex - a.style.zIndex);
    for (const el of els) {
      const p = est.objetos.find(q => q.uid === el.dataset.uid); if (!p || p.uid === it.uid || p.sobre) continue;
      const r = el.getBoundingClientRect();
      if (!(e.clientX > r.left - m && e.clientX < r.right + m && e.clientY > r.top - m && e.clientY < r.bottom + m)) continue;
      const l = o.va ? libres(p, o, it) : [];
      if (l.length) {
        const s = l.map(z => { const a = ancla(p, z.key); return [Math.hypot(a[0] - x, a[1] - y), z]; }).sort((a, b) => a[0] - b[0])[0][1];
        return { padre: p, s };
      }
      if (o.guardable && porId(p.id).contenedor) return { cont: p };
    }
    return null;
  }

  /* ---------- misiones ---------- */
  const misionActiva = () => mis && mis.activa && misionesAqui().find(m => m.id === mis.activa && misionLista(m));
  const totalDe = m => m.objetivo.tipo === 'poner' ? Object.values(m.objetivo.cosas).reduce((a, b) => a + b, 0) + m.objetivo.sentar.length : m.objetivo.objetos.length;
  function progreso(m) {
    const ob = m.objetivo;
    if (ob.tipo === 'poner') {
      const mueble = est.objetos.find(x => x.id === ob.mueble && !x.dentro);
      let n = 0;
      Object.entries(ob.cosas).forEach(([id, c]) => { n += Math.min(c, mueble ? est.objetos.filter(x => x.id === id && x.sobre === mueble.uid).length : 0); });
      return n + ob.sentar.filter(id => { const it = est.objetos.find(x => x.id === id), p = it && padreDe(it); return !!p && ob.asientos.includes(p.id); }).length;
    }
    const cont = est.objetos.find(x => x.id === ob.contenedor && !x.dentro);
    return ob.objetos.filter(id => cont && est.objetos.some(x => x.id === id && x.dentro === cont.uid)).length;
  }
  function empezar(id) {
    const m = misionesAqui().find(x => x.id === id); if (!m || !misionLista(m)) return false;
    levantar(false); cerrarPanel(); seleccionar(null);
    const ob = m.objetivo, poner = ob.tipo === 'poner';
    if (m.sitioMuneca && (poner || est.muneca.x > m.sitioMuneca[0] + 50)) { est.muneca.x = m.sitioMuneca[0]; est.muneca.y = m.sitioMuneca[1]; }   // que no tape los objetos
    const nuevo = (oid, [x, y]) => { const it = { uid: nuevoUid(), id: oid, x, y }; est.objetos.push(it); return it; };
    const lejos = ([x, y]) => Math.abs(x - est.muneca.x) > 170 || y > est.muneca.y + 40;
    if (poner) {
      // la mesa (y los cojines de suelo, si faltan); todo lo de la merienda, al suelo, y lo que falte aparece: la misión
      // pide exactamente 3 platos y 3 tazas, la tetera y las galletas, y sentar al osito y al conejito
      // se prepara la mesa: la mesa y los cojines de suelo, a su sitio (los que falten aparecen)
      const aSu = (oid, s) => { const it = est.objetos.find(x => x.id === oid) || nuevo(oid, s); bajar(it); it.dentro = null; [it.x, it.y] = s; return it; };
      aSu(ob.mueble, m.sitioMueble);
      (m.sitiosAsientos || []).forEach((s, i) => aSu(ob.asientos[i], s));
      const sitios = m.sitios.filter(lejos).concat(m.sitios.filter(s => !lejos(s))).sort(() => Math.random() - .5);
      let i = 0;
      Object.entries(ob.cosas).forEach(([oid, c]) => {
        const ya = est.objetos.filter(x => x.id === oid);
        while (ya.length < c) ya.push(nuevo(oid, [0, 0]));
        ya.forEach(it => { bajar(it); it.dentro = null; [it.x, it.y] = sitios[i++ % sitios.length]; });
      });
      ob.sentar.forEach((oid, j) => { const it = est.objetos.find(x => x.id === oid) || nuevo(oid, [0, 0]); bajar(it); it.dentro = null; [it.x, it.y] = m.sitiosInvitados[j]; });
    } else {
      let cont = est.objetos.find(x => x.id === ob.contenedor);
      if (!cont) cont = nuevo(ob.contenedor, m.sitioContenedor);
      cont.dentro = null;
      // los juguetes, en sitios del suelo que no tape la muñeca (los más alejados de ella, en orden al azar)
      const sitios = m.sitios.filter(lejos).concat(m.sitios.filter(s => !lejos(s))).slice(0, ob.objetos.length).sort(() => Math.random() - .5);
      ob.objetos.forEach((oid, i) => {
        let it = est.objetos.find(x => x.id === oid);
        if (!it) it = nuevo(oid, [0, 0]);
        bajar(it); it.dentro = null; [it.x, it.y] = sitios[i % sitios.length];
      });
    }
    mis.activa = m.id; est.cam = m.vista ? [(m.vista[0] + m.vista[1]) / 2, m.foco[1]] : m.foco.slice();   // la vista, a la misión
    guardar(); guardarMis(); pintarTodo(); pintarMision(); encajar(); cerrarAviso(); pintarNecesidades();
    say(m.inicio); tone(600, .1, 'triangle'); tone(800, .12, 'sine', .1, .1);
    return true;
  }
  function dejar() { mis.activa = null; guardarMis(); pintarMision(); encajar(); pintarNecesidades(); sfx.pop(); }
  function revisarMision() {
    const m = misionActiva(); if (!m) return;
    const n = progreso(m), total = totalDe(m);
    pintarMision();
    if (n >= total) {
      mis.activa = null; mis.hechas[m.id] = (mis.hechas[m.id] || 0) + 1; guardarMis();
      if (m.premio && m.premio.estrellas) addStar(m.premio.estrellas);
      subir('diversion', 30);   // las misiones también divierten
      setTimeout(() => { confetti(); sfx.good(); say(m.fin); toast('⭐ ¡Misión cumplida!'); av && av.saludar(); pintarMision(); encajar(); pintarNecesidades(); }, 400);
    } else say(`${pick(m.bien)} ${total - n === 1 ? 'Falta uno' : 'Faltan ' + (total - n)}`);
  }
  function pintarMision() {
    if (!caja) return;
    let b = caja.querySelector('.mm-mision'); const m = misionActiva();
    if (!m) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.className = 'mm-mision'; caja.appendChild(b); }
    const n = progreso(m), total = totalDe(m);
    b.innerHTML = `<b>${m.titulo}</b><span class="mm-puntos${total > 6 ? ' muchos' : ''}" aria-hidden="true">${Array.from({ length: total }, (_, i) => `<i class="${i < n ? 'si' : ''}"></i>`).join('')}</span>` +
      `<span class="mm-cuenta">${n} de ${total}</span><button class="btn" aria-label="Dejar la misión">✖</button>`;
    b.querySelector('button').onclick = e => { e.stopPropagation(); dejar(); };
    b.addEventListener('pointerdown', e => e.stopPropagation());
  }
  function abrirPanel() {
    cerrarPanel(); const lista = misionesAqui().filter(misionLista); if (!lista.length) return;
    const p = document.createElement('div'); p.className = 'mm-panel';
    p.innerHTML = '<div class="mm-panel-caja"><h3>Misiones</h3>' + lista.map(m => `<button class="btn mm-mis" data-id="${m.id}">${m.titulo}` +
      `${mis.hechas[m.id] ? ` <small>✓ ${mis.hechas[m.id]}</small>` : ''}</button>`).join('') + '<button class="btn mm-cerrar">Jugar libre</button></div>';
    p.addEventListener('pointerdown', e => e.stopPropagation());
    p.onclick = e => { const b = e.target.closest('button'); if (!b) { cerrarPanel(); return; } if (b.dataset.id) empezar(b.dataset.id); else cerrarPanel(); };
    caja.appendChild(p); sfx.pop();
  }
  function cerrarPanel() { const p = caja && caja.querySelector('.mm-panel'); if (p) p.remove(); }

  /* ---------- tocar y arrastrar ---------- */
  const TOQUE = 26;
  const pequeno = o => !!o && !!(o.guardable || o.contenedor || o.va);   // juguetes, cesta, cosas de la merienda, cojines de sofá
  // se toca el DIBUJO, no la parte transparente de su imagen (la alfa de cada imagen, a 1/4, se lee una vez)
  const alfas = {};
  function alfa(el) {
    if (el.src in alfas) return alfas[el.src];
    if (!el.complete || !el.naturalWidth) return null;
    const w = Math.ceil(el.naturalWidth / 4), h = Math.ceil(el.naturalHeight / 4), cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    try { const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(el, 0, 0, w, h); const d = cx.getImageData(0, 0, w, h).data, a = new Uint8Array(w * h);
      for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3]; return (alfas[el.src] = { w, h, a }); } catch (e) { return (alfas[el.src] = null); }
  }
  function opaco(el, x, y) {
    const r = el.getBoundingClientRect(); if (x < r.left || x >= r.right || y < r.top || y >= r.bottom) return false;
    const m = alfa(el); if (!m) return true;
    return m.a[Math.floor((y - r.top) / r.height * m.h) * m.w + Math.floor((x - r.left) / r.width * m.w)] > 40;
  }
  // a qué distancia (px de pantalla) del dibujo de el está el dedo: 0 encima; 9, 18 o 26 alrededor; Infinity si más lejos
  const RADIOS = [9, 18, TOQUE], DIRS = Array.from({ length: 12 }, (_, i) => [Math.cos(i * Math.PI / 6), Math.sin(i * Math.PI / 6)]);
  function distancia(el, x, y) {
    if (opaco(el, x, y)) return 0;
    for (const rd of RADIOS) if (DIRS.some(([dx, dy]) => opaco(el, x + dx * rd, y + dy * rd))) return rd;
    return Infinity;
  }
  // el objeto pequeño más cercano a menos de TOQUE px de su dibujo
  function cercano(x, y) {
    let mejor = null, dm = Infinity;
    escena.querySelectorAll('.mm-obj[data-capa="detras"]').forEach(el => {
      if (!pequeno(porId(el.dataset.id))) return;
      const d = distancia(el, x, y); if (d < dm || (d === dm && mejor && +el.style.zIndex > +mejor.style.zIndex)) { dm = d; mejor = el; }
    });
    return dm <= TOQUE ? mejor : null;
  }
  // qué se toca en (x, y) de la pantalla: el dibujo de más arriba (o la muñeca); los objetos pequeños tienen preferencia si
  // el dedo cae a menos de TOQUE px de su dibujo (iPhone), aunque sea sobre un mueble o sobre la muñeca
  function queToca(x, y) {
    let arriba = null;
    for (const el of document.elementsFromPoint(x, y)) {
      if (!escena.contains(el)) continue;
      const m = el.closest('.mm-muneca'); if (m) { arriba = m; break; }
      if (el.classList.contains('mm-obj') && el.dataset.capa === 'detras' && opaco(el, x, y)) { arriba = el; break; }
    }
    if (!(arriba && arriba.classList.contains('mm-obj') && pequeno(porId(arriba.dataset.id)))) { const c = cercano(x, y); if (c) arriba = c; }
    return arriba;
  }
  function punto(e) { const r = escena.getBoundingClientRect(), k = +escena.dataset.k; return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; }
  function abajo(e) {
    e.stopPropagation(); e.preventDefault();
    const [x, y] = punto(e);
    const t = queToca(e.clientX, e.clientY), enMun = t && t.classList.contains('mm-muneca'), objEl = !enMun && t;
    if (enMun) arrastre = { tipo: 'muneca', x0: x, y0: y, dx: est.muneca.x - x, dy: est.muneca.y - y, movido: false };
    else if (objEl) { const it = est.objetos.find(o => o.uid === objEl.dataset.uid); arrastre = { tipo: 'obj', it, x0: x, y0: y, dx: it.x - x, dy: it.y - y, movido: false }; }
    else arrastre = { tipo: 'suelo', x0: x, y0: y, sx: e.clientX, sy: e.clientY, cam: (est.cam || foco()).slice() };
    arrastre.id = e.pointerId;
  }
  function mover(e) {
    if (!arrastre || arrastre.id !== e.pointerId || !escena) return;
    if (arrastre.tipo === 'suelo') {   // arrastrar el suelo mueve la vista (no a la muñeca)
      const k = +escena.dataset.k, dx = e.clientX - arrastre.sx, dy = e.clientY - arrastre.sy;
      if (!arrastre.movido && Math.hypot(dx, dy) < 12) return;
      arrastre.movido = true; mirar(arrastre.cam[0] - dx / k, arrastre.cam[1] - dy / k, true); return;
    }
    arrastre.ult = { clientX: e.clientX, clientY: e.clientY, pointerId: e.pointerId };
    moverA(arrastre.ult); bordeVista();
  }
  // lo arrastrado sigue al dedo; si el dedo se queda un momento junto al borde, la vista se desplaza (para llevar a la
  // muñeca o un objeto a otra zona); al pasar por el borde o soltar algo junto a él, la vista no se mueve
  const BORDE = 44, ESPERA = 400;
  function bordeVista() {
    if (!arrastre || !arrastre.movido || !arrastre.ult || arrastre.bucle) return;
    const paso = () => {
      if (!arrastre || !arrastre.ult || !escena) return;
      const r = board.getBoundingClientRect(), e = arrastre.ult, k = +escena.dataset.k;
      const vx = e.clientX < r.left + BORDE ? -1 : e.clientX > r.right - BORDE ? 1 : 0, vy = e.clientY < r.top + BORDE ? -1 : e.clientY > r.bottom - BORDE ? 1 : 0;
      if (!vx && !vy) { arrastre.bucle = null; arrastre.enBorde = 0; return; }
      if (!arrastre.enBorde) arrastre.enBorde = performance.now();
      if (performance.now() - arrastre.enBorde < ESPERA) { arrastre.bucle = requestAnimationFrame(paso); return; }
      const antes = est.cam.slice(); mirar(est.cam[0] + vx * 9 / k, est.cam[1] + vy * 9 / k, true);
      if (Math.abs(est.cam[0] - antes[0]) + Math.abs(est.cam[1] - antes[1]) < .01) { arrastre.bucle = null; return; }   // ya en el borde del fondo
      moverA(e); arrastre.bucle = requestAnimationFrame(paso);
    };
    arrastre.bucle = requestAnimationFrame(paso);
  }
  function moverA(e) {
    const [x, y] = punto(e);
    if (!arrastre.movido && Math.hypot(x - arrastre.x0, y - arrastre.y0) < 12) return;
    if (!arrastre.movido) {
      arrastre.movido = true;
      if (arrastre.tipo === 'muneca') { levantar(false); arrastre.dx = est.muneca.x - x; arrastre.dy = est.muneca.y - y; }
      else if (arrastre.it.sobre) { bajar(arrastre.it); pintarMision(); }   // se separa del mueble al arrastrarlo
    }
    const nx = clamp(x + arrastre.dx, S().x0, S().x1), ny = clamp(y + arrastre.dy, S().y0, S().y1);
    if (arrastre.tipo === 'muneca') { clearTimeout(paseo); av.andar(false); est.muneca.x = nx; est.muneca.y = ny; pintarMuneca(0); }
    else { const it = arrastre.it; it.x = nx; it.y = ny; pintarObjeto(it); if (est.muneca.en === it.uid) pintarMuneca(0);
      const d = destinoBajo(e, it); escena.querySelectorAll('.mm-obj.encima').forEach(el => el.classList.remove('encima'));
      if (d) escena.querySelectorAll(`[data-uid="${(d.padre || d.cont).uid}"][data-capa="detras"]`).forEach(el => el.classList.add('encima')); }
  }
  function arriba(e) {
    if (!arrastre || arrastre.id !== e.pointerId) return;
    const a = arrastre; arrastre = null; if (!escena) return;
    if (a.bucle) cancelAnimationFrame(a.bucle);
    const [x, y] = punto(e);
    if (a.movido) guardar();
    escena.querySelectorAll('.mm-obj.encima').forEach(el => el.classList.remove('encima'));
    if (a.tipo === 'suelo') {
      if (a.movido) return;   // se ha movido la vista
      seleccionar(null); cerrarPanel();
      const v = E.ventana;   // tocar la ventana: día ↔ noche
      if (v && x >= v[0] && x <= v[2] && y >= v[1] && y <= v[3]) { cambiarCiclo(); return; }
      caminar(x, y); return;
    }
    if (a.tipo === 'muneca') {
      if (!a.movido) { if (!levantar()) { av.saludar(); sfx.pop(); say(pick(['¡Hola!', E.saludo || '¡Qué bonita es mi habitación!', '¿Jugamos?'])); } return; }
      const cama = [...escena.querySelectorAll('.mm-obj[data-capa="detras"]')].reverse().find(el => { const it = est.objetos.find(o => o.uid === el.dataset.uid), r = el.getBoundingClientRect();
        return it && porId(it.id).acostar && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; });
      if (cama) irADormir(cama.dataset.uid); else { guardar(); sfx.pop(); }
      return;
    }
    const o = porId(a.it.id);
    if (a.movido) {
      const d = destinoBajo(e, a.it);
      if (d && d.cont) meter(a.it, d.cont);
      else if (d) { ponerEn(a.it, d.padre, d.s); guardar(); pintarObjeto(d.padre); tone(700, .08, 'triangle'); revisarMision(); }
      else { guardar(); sfx.pop(); pintarMision(); }
      return;
    }
    seleccionar(a.it.uid);
    if (o.contenedor && est.objetos.some(x => x.dentro === a.it.uid) && !misionActiva()) { sacar(a.it); return; }
    if (o.acostar && est.muneca.en !== a.it.uid) {   // tocar la cama: va a la cama y (con la rutina del pijama) se acuesta
      const k = escalaDe(o, a.it.y); caminar(a.it.x + 260 * k, a.it.y + 8, () => irADormir(a.it.uid));
      return;
    }
    if (o.interruptor) { encender(a.it); return; }
    if (o.juego && !misionActiva()) jugarCon(a.it);
  }
  addEventListener('pointermove', mover); addEventListener('pointerup', arriba); addEventListener('pointercancel', arriba);
  addEventListener('resize', () => { if (escena && escena.isConnected) encajar(true); });

  /* =====================================================================
     Cuidar a la muñeca (D-037, 1.ª entrega): cámara, día y noche, necesidades (sueño y diversión), juegos con los
     objetos y la rutina del pijama. Nada castiga: las necesidades bajan despacio y solo mientras se juega en Mi Mundo
     (nunca con la app cerrada), no bajan de un mínimo, no quitan premios y avisan como mucho una vez cada vez que bajan.
     ===================================================================== */
  const KEY_NEC = 'mm_necesidades', KEY_CICLO = 'mm_ciclo';
  const NECESIDADES = DATOS.necesidades || [];
  // una necesidad solo está activa si hay un objeto con su ilustración para atenderla (la cama, los juguetes…)
  const activa = id => { const n = NECESIDADES.find(x => x.id === id); return !!n && n.objetos.some(o => conArte(porId(o))); };
  let nec = null, ciclo = null, volver = null, ultimoAviso = 0, latidos = 0, jugando = false;
  function cargarNec() {
    const d = store.get(KEY_NEC, null) || {}, r = { v: 1, avisado: Object.assign({}, d.avisado) };
    NECESIDADES.forEach(n => { r[n.id] = typeof d[n.id] === 'number' ? clamp(d[n.id], n.minimo, 100) : 85; });
    return r;
  }
  const guardarNec = () => store.set(KEY_NEC, nec);
  nec = cargarNec();
  ciclo = Object.assign({ v: 1, noche: false, preguntado: {} }, store.get(KEY_CICLO, {}) || {});
  const guardarCiclo = () => store.set(KEY_CICLO, ciclo);
  function subir(id, n) {
    if (!activa(id)) return;
    nec[id] = clamp(nec[id] + n, 0, 100); if (nec[id] >= 60) nec.avisado[id] = false;
    guardarNec(); pintarNecesidades();
  }
  // cada segundo, solo con Mi Mundo a la vista (si la app está cerrada o en otra pantalla, no cambia nada)
  function latido(forzado) {
    if (!forzado && (current !== 'scene' || !caja || !caja.isConnected || document.hidden)) return;
    if (est && misionActiva()) return;   // durante una misión, las necesidades esperan (y no hay avisos)
    const dormida = !!(est && est.muneca.en);
    NECESIDADES.forEach(n => {
      if (!activa(n.id)) return;
      if (n.id === 'sueno' && dormida) nec.sueno = Math.min(100, nec.sueno + n.recupera);
      else if (!dormida) nec[n.id] = Math.max(n.minimo, nec[n.id] - n.baja * (ciclo.noche && n.noche ? n.noche : 1));
      if (nec[n.id] >= n.rearme) nec.avisado[n.id] = false;
    });
    if (++latidos % 10 === 0 || forzado) guardarNec();
    pintarNecesidades(); revisarAvisos();
  }
  setInterval(latido, 1000);
  addEventListener('pagehide', () => { if (nec) guardarNec(); });
  function revisarAvisos() {
    if (!caja || !est || est.muneca.en || caja.querySelector('.mm-aviso, .mm-panel') || Date.now() - ultimoAviso < 90000) return;
    const n = NECESIDADES.find(x => activa(x.id) && nec[x.id] < x.umbral && !nec.avisado[x.id]);
    if (n) mostrarAviso(n);
  }
  // aviso breve: el dibujo del objeto que lo resuelve, una frase y la voz; tocarlo lleva la vista a ese objeto
  function mostrarAviso(n, texto) {
    cerrarAviso(); texto = texto || pick(n.avisos);
    nec.avisado[n.id] = true; guardarNec(); ultimoAviso = Date.now();
    const b = document.createElement('button'); b.className = 'mm-aviso'; b.dataset.id = n.id;
    b.innerHTML = `<img src="${urlDe(MED()[n.icono].f)}" alt="" draggable="false"><span>${texto}</span>`;
    b.addEventListener('pointerdown', e => e.stopPropagation());
    b.onclick = () => {
      const it = est.objetos.find(x => n.objetos.includes(x.id) && !x.dentro);
      if (it) mirar(it.x, it.y - 120); else toast(n.donde);
      cerrarAviso();
    };
    caja.appendChild(b); say(texto); tone(660, .12, 'sine', .08);
    b._t = setTimeout(cerrarAviso, 7000);
  }
  function cerrarAviso() { const b = caja && caja.querySelector('.mm-aviso'); if (b) { clearTimeout(b._t); b.remove(); } }
  function pintarNecesidades() {
    if (!caja) return;
    const act = NECESIDADES.filter(n => activa(n.id));
    let h = caja.querySelector('.mm-nec');
    if (!act.length) { if (h) h.remove(); return; }
    if (!h) {
      h = document.createElement('div'); h.className = 'mm-nec'; h.addEventListener('pointerdown', e => e.stopPropagation());
      h.innerHTML = act.map(n => `<button class="mm-nec-i" data-id="${n.id}" aria-label="${n.nombre}"><img src="${urlDe(MED()[n.icono].f)}" alt="" draggable="false"><i><b></b></i></button>`).join('');
      h.onclick = e => { const b = e.target.closest('.mm-nec-i'); if (!b) return; const n = NECESIDADES.find(x => x.id === b.dataset.id), v = nec[n.id];
        const t = v >= 60 ? n.bien : v >= n.umbral ? n.regular : pick(n.avisos); bocadillo(t); say(t); };
      caja.appendChild(h);
    }
    h.style.display = misionActiva() ? 'none' : '';   // durante una misión no se ven (la misión se juega como siempre)
    act.forEach(n => { const b = h.querySelector(`[data-id="${n.id}"]`); if (!b) return; const v = Math.round(nec[n.id]);
      b.querySelector('b').style.width = v + '%'; b.dataset.nivel = v >= 60 ? 'bien' : v >= n.umbral ? 'medio' : 'bajo'; b.dataset.valor = v; });
  }
  // lo que dice la muñeca, también escrito (por si el sonido está apagado), encima de su cabeza
  function bocadillo(texto) {
    if (!caja || !vista) return;
    let b = caja.querySelector('.mm-bocadillo'); if (!b) { b = document.createElement('div'); b.className = 'mm-bocadillo'; caja.appendChild(b); }
    const m = est.muneca, cama = m.en && est.objetos.find(x => x.uid === m.en);
    const [x, y] = cama ? anclaCama(cama) : [m.x, m.y - alto(m.y) * 1.02];
    b.textContent = texto;
    b.style.left = clamp(vista.tx + x * vista.k, 90, vista.bw - 90) + 'px'; b.style.top = clamp(vista.ty + y * vista.k, 40, vista.bh - 40) + 'px';
    b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
    clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('on'), 3200);
  }

  /* ---------- controles de la cámara ---------- */
  function montarControles() {
    const f = (lado, txt, etiqueta) => { const b = document.createElement('button'); b.className = 'mm-flecha ' + lado; b.textContent = txt; b.setAttribute('aria-label', etiqueta);
      b.addEventListener('pointerdown', e => e.stopPropagation());
      b.onclick = () => { const k = vista.k, paso = .6 * vista.bw / k; mirar(est.cam[0] + (lado === 'izq' ? -paso : paso)); guardar(); sfx.pop(); };
      caja.appendChild(b); };
    f('izq', '◀', 'Mirar a la izquierda'); f('der', '▶', 'Mirar a la derecha');
    // 📍: vuelve a encontrar a la muñeca (con su cara)
    const b = document.createElement('button'); b.className = 'mm-buscar'; b.setAttribute('aria-label', 'Buscar a la muñeca');
    b.innerHTML = '<span class="mm-buscar-cara"><span></span></span>';
    b.addEventListener('pointerdown', e => e.stopPropagation());
    b.onclick = () => { const [x, y] = foco(true); mirar(x, y); guardar(); sfx.pop(); setTimeout(() => av && av.saludar(), 450); };
    caja.appendChild(b);
    try { Avatar.mount(b.querySelector('.mm-buscar-cara span'), Avatar.principal()); } catch (e) {}
  }

  /* ---------- día y noche ---------- */
  // provisional: la noche es una luz azulada sobre la escena y un cielo oscuro en la ventana (no hay todavía fondos de
  // noche ilustrados); la lámpara encendida da una luz cálida
  function montarCiclo() {
    const n = document.createElement('div'); n.className = 'mm-noche'; escena.appendChild(n);
    const v = E.ventana;
    if (v) { const c = document.createElement('div'); c.className = 'mm-cielo'; Object.assign(c.style, { left: v[0] + 'px', top: v[1] + 'px', width: v[2] - v[0] + 'px', height: v[3] - v[1] + 'px' }); escena.appendChild(c); }
    escena.classList.toggle('noche', !!ciclo.noche);
  }
  function cambiarCiclo() {
    ciclo.noche = !ciclo.noche; ciclo.preguntado = {}; guardarCiclo();   // un día o una noche nuevos: se puede volver a preguntar una vez
    escena.classList.toggle('noche', ciclo.noche);
    tone(ciclo.noche ? 400 : 800, .15, 'sine');
    if (ciclo.noche) {
      bocadillo('¡Ya es de noche!'); say('¡Ya es de noche!');
      const n = NECESIDADES.find(x => x.id === 'sueno');
      if (n && activa('sueno') && !est.muneca.en && nec.sueno < 70) setTimeout(() => mostrarAviso(n, n.noche_aviso), 1600);
    } else {
      bocadillo('¡Buenos días!'); say('¡Buenos días!');
      if (!est.muneca.en) setTimeout(proponerRopaDeDia, 1600);
    }
  }
  function pintarLuz(it) {
    const o = porId(it.id); let el = escena.querySelector(`.mm-luz[data-uid="${it.uid}"]`);
    if (!it.luz || it.dentro || !o.luz) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.className = 'mm-luz'; el.dataset.uid = it.uid; escena.appendChild(el); }
    const m = MED()[o.capas.detras], k = escalaDe(o, it.y), x = it.x + (o.luz[0] - m.recorte[0] - m.base[0]) * k, y = it.y + (o.luz[1] - m.recorte[1] - m.base[1]) * k, r = o.luz[2] * k;
    Object.assign(el.style, { left: x - r + 'px', top: y - r + 'px', width: 2 * r + 'px', height: 2 * r + 'px' });
  }
  function pintarLuces() { est.objetos.filter(it => porId(it.id) && porId(it.id).interruptor).forEach(pintarLuz); }
  function encender(it) { it.luz = !it.luz; guardar(); pintarLuz(it); tone(it.luz ? 900 : 500, .06, 'square', .06); }

  /* ---------- jugar con los objetos ---------- */
  // la muñeca va junto al objeto y responde con lo que ya sabe hacer (saltar, saludar, sonreír, destellos), sin posturas
  // nuevas; el objeto se anima; sube la diversión
  function jugarCon(it) {
    if (jugando) return;
    const o = porId(it.id), j = o.juego; jugando = true;
    levantar(false); cerrarAviso();
    const p = padreDe(it), base = p ? p.y + 10 : it.y, k = escalaDe(o, base), ancho = MED()[o.capas.detras].px[0] * k;
    const lado = est.muneca.x <= it.x ? -1 : 1, x = clamp(it.x + lado * (ancho / 2 + 70), S().x0, S().x1);
    caminar(x, clamp(base + 6, S().y0, S().y1), () => {
      const els = escena.querySelectorAll(`.mm-obj[data-uid="${it.uid}"]`);
      els.forEach(el => { el.classList.remove('mm-j-' + j.tipo); void el.offsetWidth; el.classList.add('mm-j-' + j.tipo); setTimeout(() => el.classList.remove('mm-j-' + j.tipo), 1700); });
      if (j.tipo === 'pelota') { av.saltar(); setTimeout(() => av.saltar(), 650); setTimeout(() => av.saltar(), 1300); tone(520, .08, 'triangle'); tone(700, .08, 'triangle', .1, .65); }
      else if (j.tipo === 'cubos') { av.reaccionar(); tone(600, .06, 'square', .05); tone(800, .06, 'square', .05, .2); }
      else if (j.tipo === 'cuento') { av.sonreir(3200); tone(500, .2, 'sine', .08); }
      else { av.saludar(); tone(750, .12, 'sine', .08); }
      const t = pick(j.frases); bocadillo(t); say(t);
      subir('diversion', j.mas);
      setTimeout(() => { jugando = false; }, 1200);
    });
    setTimeout(() => { jugando = false; }, 8000);   // por si se interrumpe el paseo
  }

  /* ---------- rutinas y ropa (nunca se cambia la ropa sin que ella elija) ---------- */
  // una pregunta con dibujo: la muñeca guardada con la ropa propuesta (solo para enseñarla; no se le cambia nada)
  function preguntar(texto, ropa, botones) {
    cerrarPanel(); cerrarAviso();
    const p = document.createElement('div'); p.className = 'mm-panel mm-pregunta';
    p.innerHTML = `<div class="mm-panel-caja"><div class="mm-prev"></div><p>${texto}</p>` + botones.map((b, i) => `<button class="btn" data-i="${i}">${b[0]}</button>`).join('') + '</div>';
    p.addEventListener('pointerdown', e => e.stopPropagation());
    p.onclick = e => { const b = e.target.closest('button'); if (!b) return; p.remove(); botones[+b.dataset.i][1](); };
    caja.appendChild(p); say(texto);
    try { const st = Avatar.principal(); Avatar.mount(p.querySelector('.mm-prev'), Object.assign({}, st, { ropa, accesorios: (st.accesorios || []).filter(a => !['alas', 'varita', 'mochila'].includes(a)) })); } catch (e) {}
  }
  // para acostarla, se le propone el pijama (una vez por noche); si ya lo lleva, a dormir
  function irADormir(uid) {
    const st = Avatar.cargar() && Avatar.principal();
    if (!st || st.ropa === 'pijama' || ciclo.preguntado.pijama) { if (st && st.ropa === 'pijama') bocadillo('¡Con mi pijama!'); acostar(uid); return; }
    ciclo.preguntado.pijama = true; guardarCiclo();
    preguntar('Para dormir, ¿nos ponemos el pijama?', 'pijama', [
      ['👗 Ponerse el pijama', () => aVestir({ accion: 'dormir', uid })],
      ['Dormir así', () => acostar(uid)],
    ]);
  }
  // de día, si lleva el pijama, se propone una vez vestirse para jugar
  function proponerRopaDeDia() {
    if (!caja || ciclo.noche || ciclo.preguntado.dia || est.muneca.en || !Avatar.cargar() || Avatar.principal().ropa !== 'pijama' || caja.querySelector('.mm-panel')) return;
    ciclo.preguntado.dia = true; guardarCiclo();
    preguntar('Ya es de día. ¿Nos vestimos para jugar?', 'princesa', [['👗 Elegir la ropa', () => aVestir({ accion: 'dia' })], ['Así está bien', () => {}]]);
  }
  // ir a Vestir y volver al mismo escenario
  const volverBtn = document.createElement('button'); volverBtn.className = 'btn save'; volverBtn.id = 'mmVolver'; volverBtn.style.display = 'none';
  volverBtn.textContent = '✅ Guardar y volver';
  volverBtn.onclick = () => { $('#dSave').click(); setTimeout(() => { volverBtn.style.display = 'none'; go('scene'); }, 250); };
  $('#dSave').after(volverBtn);
  document.addEventListener('click', e => {   // con una rutina pendiente, ⬅️ vuelve a Mi Mundo (sin guardar la ropa)
    if (volver && current === 'dress' && e.target.closest('#dress [data-go]')) { e.stopPropagation(); e.preventDefault(); sfx.pop(); volverBtn.style.display = 'none'; go('scene'); }
  }, true);
  function aVestir(pend) {
    volver = Object.assign({ escena: scKey }, pend); go('dress'); volverBtn.style.display = '';
    setTimeout(() => toast(pend.accion === 'dormir' ? 'Elige el pijama 🌙 y toca «Guardar y volver»' : 'Elige la ropa y toca «Guardar y volver»'), 500);
  }
  function continuarRutina(v) {
    if (v.accion === 'dormir') {
      const cama = est.objetos.find(x => x.uid === v.uid) || est.objetos.find(x => porId(x.id).acostar);
      if (!cama) return;
      const o = porId(cama.id), k = escalaDe(o, cama.y), pij = Avatar.principal().ropa === 'pijama';
      bocadillo(pij ? '¡Qué pijama tan cómodo!' : '¡A dormir!');
      caminar(cama.x + 260 * k, cama.y + 8, () => acostar(cama.uid));
    } else { av.reaccionar(); bocadillo('¡Lista para jugar!'); say('¡Lista para jugar!'); }
  }

  /* ---------- bandeja: catálogo ilustrado del escenario ---------- */
  function bandeja() {
    const row = $('#stkRow'); row.innerHTML = ''; row.scrollLeft = 0;
    E.objetos.map(porId).filter(conArte).forEach(o => {
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
  Object.entries(ESCENARIOS).forEach(([id, e]) => { e.id = id; });
  roomSetup = function () {
    const id = escenarioDe(scKey), nueva = !!id && conArte({ capas: { f: ESCENARIOS[id].fondo } });
    clearTimeout(paseo); arrastre = null;
    stkL.style.display = nueva ? 'none' : ''; quitarBtn.style.display = 'none'; sel = null;
    $('#stkTabs').style.display = nueva ? 'none' : '';
    if (!nueva) { escena = null; caja = null; misBtn.style.display = 'none'; roomSetupHoy(); return; }
    E = ESCENARIOS[id];
    misBtn.style.display = misionesAqui().some(misionLista) ? '' : 'none';
    clearTimeout(walkT); walker.classList.remove('on'); $('#stkCtl').classList.remove('on');
    board.style.background = E.bg || 'linear-gradient(#f6dcd0 0 55%,#d9924f 55%)';
    est = cargar(); mis = cargarMis(); montar(); bandeja();
    if (volver && current === 'scene') { const v = volver; volver = null; setTimeout(() => continuarRutina(v), 500); }
    else if (!est.muneca.en && Avatar.cargar()) setTimeout(() => av && av.saludar(), 400);
  };
  avPlace = function () {};
  roomFit = function () { encajar(); };
  // para la prueba automática y para depurar
  window.MM = { CAT, MISIONES, ESCENARIOS, conArte, misionLista, empezar, dejar, progreso: id => progreso(MISIONES.find(m => m.id === id)),
    total: id => totalDe(MISIONES.find(m => m.id === id)), estado: () => est, misiones: () => mis, escenario: () => E.id,
    queToca: (x, y) => { const t = escena && queToca(x, y); return t ? (t.dataset.uid || 'muneca') : null; },
    camara: () => est && est.cam && est.cam.slice(), mirar, necesidades: () => nec, ciclo: () => ciclo, avanzar: s => { for (let i = 0; i < s; i++) latido(true); },
    activas: () => NECESIDADES.filter(n => activa(n.id)).map(n => n.id), KEY_NEC, KEY_CICLO,
    KEY: ESCENARIOS.habitacion.clave, KEY_MIS };
  if (typeof current !== 'undefined' && current === 'scene') scLoad();
})();
