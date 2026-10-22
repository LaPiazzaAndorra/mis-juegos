/* =====================================================================
   Prueba de logros · COPIA para la prueba conjunta (22/10/2026), docs/propuestas/prueba-conjunta-2026-10-22/.
   Igual que ../logros-prueba-2026-10-21/logros.js salvo los premios, adaptados a la Pintar y la Heladería nuevas
   (paleta con círculo interior y nombre, sellos en rejilla, hasta 4 bolas, varios adornos en el juego libre,
   «quitar la última»).
   ---------------------------------------------------------------------
   · Un único contador de logros 🏅, separado de las estrellas ⭐ (que no cambian):
       +1 por terminar un reto (Contar o Colores, 3 rondas) · como mucho 1 por reto y día (se puede repetir sin más logros);
       +1 por cada tarea real confirmada por un adulto · cada confirmación cuenta una sola vez.
   · Sin duplicados: cada logro es una entrada con identificador único y el total se CALCULA contando entradas
       reto  → «r:<día>:<reto>»     tarea → «t:<id del aviso>»
     Al leer se limpian repetidos (por si una copia de seguridad o un archivo editado los trajera).
   · Cofres a los 3, 6 y 10 logros; en cada uno se elige 1 de 2 premios PROVISIONALES nuevos de Pintar y la Heladería
     (marcados con 🎁). No se bloquea nada que ya exista: los premios solo AÑADEN.
   · Zona de adultos (código de 4 cifras): confirmar o dejar para luego los avisos de tareas, ver logros y premios.
   Claves (en esta copia, con el prefijo «rec1:»): logros, tareas, premios, adultos.
   Usa lo que define el juego (go, onShow, say, sfx, toast, confetti, store, P, ICE, FLAV, TOPS…).
   ===================================================================== */
'use strict';
(function () {
  const pad = n => String(n).padStart(2, '0');
  const hoy = () => { if (window.__hoy) return window.__hoy; const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const ahora = () => new Date().toISOString();
  const UMBRALES = [3, 6, 10];
  const RONDAS = 3;
  const RETOS = { contar: { nombre: 'Contar', ill: 'contar' }, colores: { nombre: 'Colores', ill: 'pintar' } };
  const TAREAS = [{ id: 'juguetes', dibujo: '🧸', nombre: 'Recoger los juguetes' }, { id: 'dientes', dibujo: '🪥', nombre: 'Lavarse los dientes' }];
  /* premios provisionales: todos NUEVOS, solo para probar el camino (ids «prov-…») */
  const PREMIOS = [
    [{ id: 'prov-sellos-magia', icono: '🦄', nombre: 'Sellos mágicos', donde: 'Pintar', sellos: ['🦄', '🧚', '💖', '🌟'] },
     { id: 'prov-sabor-arcoiris', icono: '🌈', nombre: 'Sabor arcoíris', donde: 'Heladería', sabor: { c: 'linear-gradient(180deg,#ff8fab 0 20%,#ffd60a 20% 40%,#8ac926 40% 60%,#4cc9f0 60% 80%,#c77dff 80%)', n: 'arcoíris', col: 'de colores', foto: '#ff8fab' } }],
    [{ id: 'prov-color-dorado', icono: '✨', nombre: 'Color dorado', donde: 'Pintar', color: '#e0b030' },
     { id: 'prov-caramelos', icono: '🍬', nombre: 'Caramelos de adorno', donde: 'Heladería', adorno: { e: '🍬', n: 'un caramelo' } }],
    [{ id: 'prov-sellos-mar', icono: '🐬', nombre: 'Sellos del mar', donde: 'Pintar', sellos: ['🐬', '🐚', '🐙', '🦀'] },
     { id: 'prov-sabor-chicle', icono: '🫧', nombre: 'Sabor chicle', donde: 'Heladería', sabor: { c: '#7fd6ff', n: 'chicle', col: 'azul clarito' } }],
  ];
  const premioPorId = id => PREMIOS.flat().find(p => p.id === id);

  /* ---------- datos (con limpieza de repetidos al leer) ---------- */
  const unicos = (lista, clave) => { const vistos = new Set(), out = []; (Array.isArray(lista) ? lista : []).forEach(x => { if (!x || x[clave] == null || vistos.has(x[clave])) return; vistos.add(x[clave]); out.push(x); }); return out; };
  const leerLogros = () => unicos((store.get('logros', {}) || {}).lista, 'id');
  const leerAvisos = () => { const ya = new Set(leerLogros().map(l => l.id)); return unicos((store.get('tareas', {}) || {}).avisos, 'id').filter(a => !ya.has('t:' + a.id)); };
  const leerCofres = () => unicos((store.get('premios', {}) || {}).cofres, 'n').filter(c => premioPorId(c.elegido));
  const guardarLogros = l => store.set('logros', { v: 1, lista: l });
  const guardarAvisos = a => store.set('tareas', { v: 1, avisos: a });
  const guardarCofres = c => store.set('premios', { v: 1, cofres: c });
  const total = () => leerLogros().length;
  const abiertos = () => leerCofres().map(c => c.elegido);
  const tiene = id => abiertos().includes(id);
  function anadirLogro(id, tipo, que) {
    const l = leerLogros(); if (l.some(x => x.id === id)) return false;
    l.push({ id, tipo, que, fecha: ahora(), dia: hoy(), visto: tipo === 'reto' }); guardarLogros(l); pintarContador(); return true;
  }
  const cofreListo = n => total() >= UMBRALES[n - 1] && !leerCofres().some(c => c.n === n);
  const siguienteCofre = () => [1, 2, 3].find(cofreListo) || null;

  /* ---------- contador 🏅 junto a las estrellas ---------- */
  function pintarContador() { document.querySelectorAll('.lc').forEach(e => e.textContent = total()); }

  /* ================= pantalla «Mis logros» ================= */
  function pintarLogros() {
    pintarContador();
    const t = total(), cof = leerCofres();
    // camino de cofres
    $('#lgCamino').innerHTML = UMBRALES.map((u, i) => {
      const n = i + 1, ab = cof.find(c => c.n === n), listo = cofreListo(n), antes = i ? UMBRALES[i - 1] : 0;
      const hechos = Math.max(0, Math.min(u - antes, t - antes));
      const puntos = '●'.repeat(hechos) + '○'.repeat(u - antes - hechos);
      if (ab) { const p = premioPorId(ab.elegido); return `<button class="cofre abierto" data-n="${n}" aria-label="Cofre ${n} abierto"><span class="ci2">${p.icono}</span><span class="cn">✓</span></button>`; }
      return `<button class="cofre${listo ? ' listo' : ''}" data-n="${n}" aria-label="Cofre ${n}"><span class="ci2">🎁</span><span class="cn">${listo ? '¡Ábrelo!' : puntos}</span></button>`;
    }).join('<span class="camino-sep"></span>');
    $$('#lgCamino .cofre').forEach(b => b.onclick = () => tocarCofre(+b.dataset.n));
    // retos
    const dia = hoy(), l = leerLogros();
    $$('#lgRetos [data-reto]').forEach(b => b.querySelector('.hoy').hidden = !l.some(x => x.id === `r:${dia}:${b.dataset.reto}`));
    // tareas
    const av = leerAvisos();
    $('#lgTareas').innerHTML = TAREAS.map(tk => {
      const esp = av.some(a => a.tarea === tk.id);
      return `<div class="tarea${esp ? ' espera' : ''}"><span class="td">${tk.dibujo}</span><span class="tn">${tk.nombre}</span>` +
        (esp ? '<span class="tw">⏳ Esperando a un adulto</span>' : `<button class="btn thecho" data-t="${tk.id}">¡Lo he hecho!</button>`) + '</div>';
    }).join('');
    $$('#lgTareas .thecho').forEach(b => b.onclick = () => avisarTarea(b.dataset.t));
    // premios de prueba abiertos
    const ab = abiertos().map(premioPorId);
    $('#lgPremios').innerHTML = ab.length ? ab.map(p => `<span class="pchip">${p.icono} ${p.nombre} <i>(${p.donde})</i></span>`).join('') : '<span class="pvacio">Todavía ninguno</span>';
  }
  function celebrarConfirmadas() {
    const l = leerLogros(), nuevas = l.filter(x => x.tipo === 'tarea' && !x.visto);
    if (!nuevas.length) return;
    nuevas.forEach(x => x.visto = true); guardarLogros(l);
    const tk = TAREAS.find(t => t.id === nuevas[0].que);
    setTimeout(() => { confetti(); sfx.good(); say(`¡Un adulto ha visto que has hecho: ${tk ? tk.nombre.toLowerCase() : 'tu tarea'}! ¡Un logro más!`); toast(`🏅 +${nuevas.length}`); }, 400);
  }
  onShow.logros = () => { pintarLogros(); celebrarConfirmadas();
    const n = siguienteCofre(); if (n) setTimeout(() => say('¡Tienes un cofre para abrir! Tócalo.'), 900); };

  function avisarTarea(id) {
    const av = leerAvisos(); if (av.some(a => a.tarea === id)) return;
    av.push({ id: 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), tarea: id, fecha: ahora() });
    guardarAvisos(av); sfx.good(); say('¡Muy bien! Cuando lo vea un adulto, ganarás un logro.'); pintarLogros();
  }

  /* ================= retos (3 rondas) ================= */
  const COLS = [{ n: 'rojo', c: '#ff4d6d' }, { n: 'amarillo', c: '#ffd60a' }, { n: 'azul', c: '#3a86ff' }, { n: 'verde', c: '#8ac926' },
    { n: 'naranja', c: '#ff9f1c' }, { n: 'morado', c: '#7b2cbf' }, { n: 'rosa', c: '#ff8fab' }, { n: 'marrón', c: '#8d5524' }];
  const R = { reto: null, ronda: 0, intentos: 0, ok: 0, busy: false, cur: null };
  function rondaReto() {
    R.intentos = 0; R.busy = false;
    $('#rtPuntos').innerHTML = Array.from({ length: RONDAS }, (_, i) => `<i class="${i < R.ronda ? 'h' : i === R.ronda ? 'a' : ''}"></i>`).join('');
    let prompt = '', opts = [], voz = '';
    if (R.reto === 'contar') {
      const n = 1 + rnd(5), [e, q] = pick(COUNT), s = new Set([n]);
      while (s.size < 3) s.add(1 + rnd(6));
      prompt = `<div class="countbox">${Array.from({ length: n }, () => `<span class="ci">${e}</span>`).join('')}</div><div class="hint" style="width:100%">👆 toca cada uno para contar</div>`;
      opts = shuffle([...s]).map(k => ({ h: `<span class="num">${k}</span>`, ok: k === n, v: String(k) })); voz = q; R.cur = { n };
    } else {
      const c = shuffle(COLS).slice(0, 3), bueno = c[0];
      prompt = `<div class="rtcolor">🎨</div>`;
      opts = shuffle(c).map(x => ({ h: `<span class="rtbola" style="background:${x.c}"></span>`, ok: x === bueno, v: x.n })); voz = `¿Cuál es el ${bueno.n}?`; R.cur = { color: bueno.n };
    }
    $('#rtPrompt').innerHTML = prompt; const box = $('#rtOpts'); box.innerHTML = '';
    opts.forEach(o => { const b = document.createElement('button'); b.className = 'qopt'; b.innerHTML = o.h; b.setAttribute('aria-label', o.v); b.dataset.ok = o.ok ? 1 : ''; b.onclick = () => respuesta(b, o); box.appendChild(b); });
    if (R.reto === 'contar') { let k = 0; $$('#rtPrompt .ci').forEach(el => el.onclick = () => { if (el.classList.contains('counted')) return; k++; el.classList.add('counted'); el.insertAdjacentHTML('beforeend', `<b>${k}</b>`); sfx.count(k); say(String(k)); }); }
    R.voz = voz; setTimeout(() => { if (current === 'reto') say(voz); }, 300);
  }
  function respuesta(b, o) {
    if (R.busy) return;
    if (o.ok) { R.busy = true; b.classList.add('ok'); sfx.good(); say((o.v ? o.v + '. ' : '') + pick(PRAISE)); R.ok++; setTimeout(siguiente, 1500); return; }
    R.intentos++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); sfx.bad();
    const buena = $('#rtOpts [data-ok="1"]');
    if (R.intentos === 1) say('¡Casi! Prueba otra vez.');
    else if (R.intentos === 2) { buena.classList.add('pista'); say(R.reto === 'contar' ? 'Cuenta conmigo, tocando cada uno.' : `Busca el ${R.cur.color}. ¡Brilla un poquito!`); }
    else { R.busy = true; buena.classList.remove('pista'); buena.classList.add('ok'); say('Mira, era este. ¡Vamos a por otra!'); setTimeout(siguiente, 2000); }
  }
  function siguiente() { R.ronda++; if (R.ronda < RONDAS) rondaReto(); else finReto(); }
  function finReto() {
    $('#rtPuntos').innerHTML = '<i class="h"></i>'.repeat(RONDAS);
    const nuevo = anadirLogro(`r:${hoy()}:${R.reto}`, 'reto', R.reto), n = siguienteCofre();
    $('#rtPrompt').innerHTML = `<div class="rtfin">${nuevo ? '🏅' : '🌟'}</div><div class="rttxt">${nuevo ? '¡Has ganado un logro!' : '¡Muy bien! Hoy ya tienes el logro de este reto.'}</div>`;
    $('#rtOpts').innerHTML = `<button class="btn rtbtn" id="rtOtra">🔁 Otra vez</button><button class="btn rtbtn verde" id="rtVolver">${n ? '🎁 ¡Al cofre!' : '🏅 Mis logros'}</button>`;
    $('#rtOtra').onclick = () => { sfx.pop(); empezarReto(R.reto); }; $('#rtVolver').onclick = () => { sfx.pop(); go('logros'); };
    confetti(); sfx.good();
    say((nuevo ? '¡Has ganado un logro!' : '¡Muy bien! Hoy ya tienes el logro de este reto.') + (n ? ' ¡Y se ha abierto un cofre!' : ''));
  }
  function empezarReto(reto) { Object.assign(R, { reto, ronda: 0, ok: 0 }); $('#rtTitulo').textContent = (reto === 'contar' ? '🔢 ' : '🎨 ') + RETOS[reto].nombre; rondaReto(); }
  onShow.reto = arg => empezarReto(arg || R.reto || 'contar');
  onLeave.reto = () => { R.busy = true; };

  /* ================= cofres ================= */
  function tocarCofre(n) {
    const ab = leerCofres().find(c => c.n === n);
    if (ab) { const p = premioPorId(ab.elegido); say(`Aquí está tu premio: ${p.nombre}. Lo tienes en ${p.donde}.`); return; }
    if (!cofreListo(n)) { const falta = UMBRALES[n - 1] - total(); sfx.pop(); say(`Este cofre se abre con ${falta} ${falta === 1 ? 'logro' : 'logros'} más.`); return; }
    if (siguienteCofre() !== n) { say('Primero abre el cofre anterior.'); return; }
    const m = $('#cofreModal'); m.classList.add('on');
    $('#cfBox').innerHTML = '<div class="cfgrande">🎁</div><div class="mtitle">¡Un cofre!</div>';
    sfx.good(); say('¡Un cofre! Vamos a abrirlo.');
    setTimeout(() => {
      $('#cfBox').innerHTML = '<div class="mtitle">Elige tu premio</div><div class="cfop">' + PREMIOS[n - 1].map(p =>
        `<button class="cfpremio" data-id="${p.id}"><span class="cfi">${p.icono}</span><b>${p.nombre}</b><span class="cfd">para ${p.donde}</span><span class="cfprov">🎁 premio de prueba</span></button>`).join('') + '</div>';
      $$('#cfBox .cfpremio').forEach(b => b.onclick = () => elegir(n, b.dataset.id));
      say(`Elige uno: ${PREMIOS[n - 1][0].nombre}, o ${PREMIOS[n - 1][1].nombre}.`);
    }, 1300);
  }
  function elegir(n, id) {
    const c = leerCofres(); if (c.some(x => x.n === n)) { $('#cofreModal').classList.remove('on'); return; }
    c.push({ n, elegido: id, fecha: ahora() }); guardarCofres(c); aplicarPremios();
    const p = premioPorId(id); $('#cofreModal').classList.remove('on'); confetti(); sfx.good();
    say(`¡Ya tienes ${p.nombre}! Lo encontrarás en ${p.donde}.`); pintarLogros();
  }
  $('#cfCerrar').onclick = () => $('#cofreModal').classList.remove('on');

  /* ================= premios provisionales en Pintar y la Heladería =================
     Se crean ocultos y se enseñan solo si están abiertos. Lo que ya existía no cambia. */
  const NB_FLAV = FLAV.length, NB_TOPS = TOPS.length;
  PREMIOS.flat().forEach(p => {
    if (p.sellos) p.sellos.forEach(s => { const b = document.createElement('button'); b.className = 'stp premio'; b.dataset.premio = p.id; b.textContent = s; b.title = 'Premio de prueba';
      b.onclick = () => { P.stamp = s; $$('.stp').forEach(x => x.classList.toggle('sel', x === b)); sfx.pop(); }; $('#stamps').appendChild(b); });
    /* Pintar nuevo: el color va en un círculo interior, con marca ✓ de contraste y su nombre en voz alta */
    if (p.color) { const b = document.createElement('button'); b.className = 'sw premio'; b.dataset.premio = p.id; b.title = 'Premio de prueba'; b.setAttribute('aria-label', 'dorado');
      b.innerHTML = '<i style="background:linear-gradient(135deg,#fff3b0,#e0b030 45%,#a87a10)"></i>'; b.style.setProperty('--ck', '#4a3a5c');
      b.onclick = () => { P.color = p.color; $$('.sw').forEach(x => x.classList.toggle('sel', x === b)); pDot(); if (P.tool === 'eraser' || P.tool === 'rainbow' || P.tool === 'stamp') setTool('brush'); sfx.pop(); say('dorado'); }; $('#colors').appendChild(b); }
    /* Heladería nueva: hasta 4 bolas, «quitar la última», la voz dice número, color o sabor según el reto */
    if (p.sabor) { const i = FLAV.push(p.sabor) - 1, b = document.createElement('button'); b.className = 'fl premio'; b.dataset.premio = p.id; b.style.background = p.sabor.c; b.title = 'Premio de prueba'; b.setAttribute('aria-label', p.sabor.n);
      b.onclick = () => { const s = ICE.build.scoops; if (s.length >= MAXB) { sfx.bad(); say('¡Ya no caben más bolas!'); return; }
        antesDeCambiar(); s.push(i); iceDraw(); sfx.count(s.length); const t = ICE.mode === 'pedidos' && ICE.order ? ICE.order.t : '';
        say(t === 'cantidad' || t === 'mezcla' ? NUM[s.length] : p.sabor.n); }; $('#iceFlavs').appendChild(b); }
    if (p.adorno) { const i = TOPS.push(p.adorno) - 1, b = document.createElement('button'); b.className = 'btn premio'; b.dataset.premio = p.id; b.dataset.i = i; b.textContent = p.adorno.e; b.title = 'Premio de prueba'; b.setAttribute('aria-label', p.adorno.n);
      b.onclick = () => { const T = ICE.build.tops, on = T.includes(i);
        if (ICE.mode === 'libre' && !on && T.length >= MAXT_LIBRE) { sfx.bad(); say('¡Ya hay muchos adornos!'); return; }
        antesDeCambiar(); if (ICE.mode === 'libre') { if (on) T.splice(T.indexOf(i), 1); else T.push(i); } else ICE.build.tops = on ? [] : [i];
        iceDraw(); sfx.pop(); }; $('#iceTops').appendChild(b); }
  });
  function aplicarPremios() { const a = abiertos(); $$('[data-premio]').forEach(b => b.hidden = !a.includes(b.dataset.premio)); }
  aplicarPremios();
  const showPaint = onShow.paint, showIce = onShow.ice;
  onShow.paint = arg => { aplicarPremios(); return showPaint(arg); };
  onShow.ice = arg => { aplicarPremios(); return showIce(arg); };

  /* ================= zona de adultos (código de 4 cifras) ================= */
  const huella = s => { let h = 5381; for (const ch of 'mi-mundo:' + s) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0; return h.toString(36); };   // no es seguridad real
  const A = { modo: 'entrar', escrito: '', primero: '', reto: null };
  const adultos = () => store.get('adultos', null);
  function abrirAdultos() { A.escrito = ''; A.modo = adultos() && adultos().codigo ? 'entrar' : 'crear'; A.primero = ''; $('#adModal').classList.add('on'); pintarTeclado(); }
  function pintarTeclado(msg) {
    const tit = { entrar: 'Código de adulto', crear: 'Elige un código de 4 cifras', repetir: 'Repite el código', olvido: `¿Cuánto es ${A.reto && A.reto.a} × ${A.reto && A.reto.b}?` }[A.modo];
    const len = A.modo === 'olvido' ? 2 : 4;
    $('#adBox').innerHTML = `<div class="mtitle" style="font-size:24px">👪 ${tit}</div><div class="adpuntos">${Array.from({ length: len }, (_, i) => `<i class="${i < A.escrito.length ? 'h' : ''}"></i>`).join('')}</div>` +
      `<div class="admsg">${msg || ''}</div><div class="adtecl">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map(k => k === '' ? '<span></span>' : `<button class="btn adk" data-k="${k}">${k}</button>`).join('')}</div>` +
      `<div class="bkacc">${A.modo === 'entrar' ? '<button class="bklink" id="adOlvido">¿Has olvidado el código?</button>' : ''}<button class="btn" id="adCancelar" style="min-width:130px">Cancelar</button></div>`;
    $$('#adBox .adk').forEach(b => b.onclick = () => tecla(b.dataset.k, len));
    $('#adCancelar').onclick = () => $('#adModal').classList.remove('on');
    if ($('#adOlvido')) $('#adOlvido').onclick = () => { A.modo = 'olvido'; A.escrito = ''; A.reto = { a: 6 + rnd(4), b: 6 + rnd(4) }; pintarTeclado(); };
  }
  function tecla(k, len) {
    sfx.pop();
    if (k === '⌫') A.escrito = A.escrito.slice(0, -1); else if (A.escrito.length < len) A.escrito += k;
    if (A.escrito.length < len) return pintarTeclado();
    const e = A.escrito; A.escrito = '';
    if (A.modo === 'crear') { A.primero = e; A.modo = 'repetir'; return pintarTeclado(); }
    if (A.modo === 'repetir') { if (e !== A.primero) { A.modo = 'crear'; return pintarTeclado('No coinciden. Vuelve a empezar.'); }
      const ad = adultos() || { v: 1 }; ad.codigo = huella(e); store.set('adultos', ad); return pintarZona('Código guardado.'); }
    if (A.modo === 'olvido') { if (+e === A.reto.a * A.reto.b) { A.modo = 'crear'; return pintarTeclado('Elige un código nuevo.'); } A.modo = 'entrar'; return pintarTeclado('No es correcto.'); }
    if (huella(e) === (adultos() || {}).codigo) return pintarZona();
    pintarTeclado('Código incorrecto.');
  }
  function pintarZona(msg) {
    const av = leerAvisos(), l = leerLogros().slice().reverse(), ab = abiertos().map(premioPorId);
    const nom = id => (TAREAS.find(t => t.id === id) || {}).nombre || id, fecha = f => new Date(f).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    $('#adBox').innerHTML = `<div class="mtitle" style="font-size:24px">👪 Zona de adultos</div>${msg ? `<div class="admsg ok">${msg}</div>` : ''}` +
      `<div class="mlabel">Tareas por confirmar</div>` +
      (av.length ? av.map(a => `<div class="adrow"><span>${(TAREAS.find(t => t.id === a.tarea) || {}).dibujo || ''} ${nom(a.tarea)} · ${fecha(a.fecha)}</span><span><button class="btn adconf" data-id="${a.id}">✅ Confirmar</button><button class="btn adno" data-id="${a.id}">Todavía no</button></span></div>`).join('') : '<div class="bkinfo">No hay avisos pendientes.</div>') +
      `<div class="mlabel">Logros: ${l.length}</div><div class="adlista">` +
      (l.length ? l.slice(0, 20).map(x => `<div class="bkinfo" style="text-align:left">🏅 ${x.tipo === 'reto' ? 'Reto ' + RETOS[x.que].nombre : 'Tarea: ' + nom(x.que)} · ${fecha(x.fecha)}</div>`).join('') : '<div class="bkinfo">Todavía ninguno.</div>') + '</div>' +
      `<div class="mlabel">Premios de prueba abiertos</div><div class="bkinfo" style="text-align:left">${ab.length ? ab.map(p => `${p.icono} ${p.nombre} (${p.donde})`).join(' · ') : 'Ninguno'}</div>` +
      `<div class="bkacc"><button class="bklink" id="adCodigo">Cambiar el código</button><button class="btn" id="adSalir" style="min-width:130px">✅ Listo</button></div>`;
    $$('#adBox .adconf').forEach(b => b.onclick = () => confirmar(b.dataset.id));
    $$('#adBox .adno').forEach(b => b.onclick = () => { guardarAvisos(leerAvisos().filter(a => a.id !== b.dataset.id)); pintarZona('Aviso quitado (sin castigo).'); });
    $('#adCodigo').onclick = () => { A.modo = 'crear'; A.escrito = ''; pintarTeclado(); };
    $('#adSalir').onclick = () => { $('#adModal').classList.remove('on'); if (current === 'logros') onShow.logros(); };
  }
  function confirmar(id) {
    const a = leerAvisos().find(x => x.id === id);
    if (a) anadirLogro('t:' + a.id, 'tarea', a.tarea);   // si ya existe, no se añade (cada confirmación cuenta una vez)
    guardarAvisos(leerAvisos()); sfx.good(); pintarZona(a ? 'Confirmada: +1 logro.' : 'Ya estaba confirmada.');
  }
  $('#lgAdultos').onclick = abrirAdultos; $('#adBtn').onclick = () => { $('#settings').classList.remove('on'); abrirAdultos(); };

  pintarContador();
  window.Logros = { total, leerLogros, leerAvisos, leerCofres, abiertos, siguienteCofre, UMBRALES, PREMIOS, TAREAS, hoy, huella, NB_FLAV, NB_TOPS };
})();
