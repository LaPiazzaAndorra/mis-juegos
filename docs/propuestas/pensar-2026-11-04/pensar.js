/* =====================================================================
   Juegos de pensar · Contar y Memoria (copia aislada, 04/11/2026)
   ---------------------------------------------------------------------
   Sustituye, SOLO en esta copia, «Contar» y «Parejas» del menú Pensar. «¿Qué sigue?», «Sombras» y «El diferente»
   siguen como hoy. Usa las funciones del juego (store, say, sfx, addStar, confetti, toast, go, onShow, onLeave…).

   Reglas comunes
     · Sin cronómetro: nada se acaba por tiempo; la rapidez no cuenta para nada.
     · Cada ejercicio es «limpio» si sale a la primera o con un solo fallo, sin pista. Tras varios limpios seguidos en
       el mismo paso, se sube al siguiente. Si se atasca (2 fallos), sale una pista; si se atasca 3 veces seguidas, el
       siguiente ejercicio es del paso anterior (sin avisos ni castigos; lo ya alcanzado no se pierde).
     · Estrellas como hoy: +1 ⭐ por acierto en Contar, +1 ⭐ por ronda en «¿Dónde estaba?» y «Repite la serie»,
       y 2, 3 o 5 ⭐ al terminar unas parejas. Los fallos no quitan nada. Los logros no cambian (logros.js).
     · Prueba rápida (⏩) para saltar lo que ya domina: solo puede subir el nivel, nunca bajarlo.
   Avance guardado (claves nuevas con el prefijo «lv_», que «Guardar mi progreso» ya incluye):
     lv_contar2, lv_parejas, lv_donde, lv_serie = {v:1, L, max, ok, apuros, prueba}
     La primera vez, Contar mira la clave antigua «lv_contar» (solo la lee; no la cambia).
   ===================================================================== */
(function () {
  'use strict';
  const DB = window.DIBUJOS, IR = window.DIBUJOS_IR, IDS = Object.keys(DB);
  const may = t => t.charAt(0).toUpperCase() + t.slice(1);
  const uno = (n, d) => (n === 1 ? (d.g === 'f' ? 'una' : 'un') : String(n));
  const pro = (n, d) => (n === 1 ? (d.g === 'f' ? 'una' : 'uno') : String(n));   // «uno más», «se va uno»
  const cuant = d => (d.g === 'f' ? 'cuántas' : 'cuántos');
  const art = d => (d.g === 'f' ? 'la' : 'el');
  const nom = (n, d) => (n === 1 ? d.s : d.p);
  const espera = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- avance guardado ---------- */
  function Nivel(clave, total, sube, inicial) {
    const leer = () => {
      const v = store.get(clave, null), o = { v: 1, L: 0, max: 0, ok: 0, apuros: 0, prueba: '' };
      if (v && typeof v === 'object') {
        o.L = clamp(v.L | 0, 0, total - 1); o.max = clamp(Math.max(v.max | 0, o.L), 0, total - 1);
        o.ok = clamp(v.ok | 0, 0, sube - 1); o.apuros = clamp(v.apuros | 0, 0, 2); o.prueba = typeof v.prueba === 'string' ? v.prueba : '';
      } else if (inicial) Object.assign(o, inicial());
      return o;
    };
    const api = {
      total, get: leer, guardar: o => store.set(clave, o),
      resultado(limpio) {            // tras un ejercicio del paso actual → 'sube' | 'baja' | ''
        const o = leer(); let r = '';
        if (limpio) { o.apuros = 0; o.ok++; if (o.ok >= sube) { o.ok = 0; if (o.L < total - 1) { o.L++; o.max = Math.max(o.max, o.L); r = 'sube'; } } }
        else { o.apuros++; if (o.apuros >= 3) { o.apuros = 0; o.ok = 0; if (o.L > 0) { o.L--; r = 'baja'; } } }
        api.guardar(o); return r;
      },
      elegir(L) { const o = leer(); o.L = clamp(L, 0, total - 1); o.ok = 0; o.apuros = 0; api.guardar(o); },
      marcar(p) { const o = leer(); o.prueba = p; api.guardar(o); },
    };
    return api;
  }
  function Prueba(nivel, pasos) {
    const P = { activa: false, i: 0, ultimo: -1, lista: [] };
    P.empezar = () => {
      P.lista = pasos.filter(s => s > nivel.get().L && s < nivel.total); P.i = 0; P.ultimo = -1; P.activa = P.lista.length > 0;
      if (!nivel.get().prueba) nivel.marcar(P.activa ? 'empezada' : 'hecha');   // la presentación no vuelve a salir
      return P.activa;
    };
    P.paso = () => P.lista[P.i];
    P.resultado = bien => { if (bien) { P.ultimo = P.lista[P.i]; P.i++; if (P.i < P.lista.length) return 'sigue'; } return P.terminar(); };
    P.terminar = () => {
      P.activa = false; const o = nivel.get(), antes = o.L;
      if (P.ultimo > o.L) { o.L = P.ultimo; o.max = Math.max(o.max, o.L); o.ok = 0; o.apuros = 0; }
      o.prueba = 'hecha'; nivel.guardar(o); return o.L > antes ? 'subida' : 'igual';
    };
    return P;
  }
  function pintarCamino(el, nivel, prueba, nombres) {
    const o = nivel.get();
    el.innerHTML = `<span class="pnPasos">${Array.from({ length: nivel.total }, (_, i) =>
      `<i class="${i <= o.max ? 'hecho' : ''}${i === o.L && !prueba.activa ? ' actual' : ''}"></i>`).join('')}</span>` +
      `<span class="pnNivel">${prueba.activa ? `⏩ Prueba rápida · ${prueba.i + 1} de ${prueba.lista.length}` : `Nivel ${o.L + 1} de ${nivel.total} · ${nombres[o.L]}`}</span>`;
  }
  function finPrueba(r, nivel, nombres) {
    const L = nivel.get().L;
    if (r === 'subida') { confetti(); say(`¡Muy bien! Empezamos en el nivel ${L + 1}.`); toast(`⏩ Empezamos en el nivel ${L + 1}: ${nombres[L]}`); }
    else { say('¡Vale! Seguimos desde aquí.'); toast(`Seguimos en el nivel ${L + 1}`); }
  }
  // primera vez: elegir entre empezar o hacer la prueba rápida
  function introHTML(ill) {
    return `<div class="pnIntro" hidden><div class="pnIntroCaja"><span class="ill" data-ill="${ill}"></span>
      <p>¿Saltamos lo que ya sabes?</p>
      <button class="btn pnSi" type="button">⏩ Prueba rápida</button><button class="btn pnNo" type="button">▶ Empezar</button></div></div>`;
  }
  function intro(sec, nivel, alProbar, alEmpezar) {
    const box = sec.querySelector('.pnIntro');
    if (nivel.get().prueba) { box.hidden = true; return false; }
    box.hidden = false; say('¿Saltamos lo que ya sabes? Puedes hacer una prueba rápida.');
    box.querySelector('.pnSi').onclick = () => { sfx.pop(); box.hidden = true; alProbar(); };
    box.querySelector('.pnNo').onclick = () => { sfx.pop(); box.hidden = true; nivel.marcar('saltada'); alEmpezar(); };
    return true;
  }
  const TAM = () => Math.round(clamp(Math.min(innerWidth, innerHeight) / 6.5, 92, 140));   // más grandes en el iPad
  // ajusta el tamaño de los dibujos para que quepan
  function encajar(caja, s0) {
    let s = s0; caja.style.setProperty('--os', s + 'px');
    while (s > 28 && (caja.scrollHeight > caja.clientHeight + 1 || caja.scrollWidth > caja.clientWidth + 1)) { s -= 4; caja.style.setProperty('--os', s + 'px'); }
    return s;
  }

  // lado de las casillas para que quepan f × c en el hueco disponible
  function lado(el, f, c, gap, max) {
    if (!el.offsetParent) return; el.style.setProperty('--lado', '10px');
    const W = el.clientWidth - 8, H = el.clientHeight - 8, s = Math.floor(Math.min((W - gap * (c - 1)) / c, (H - gap * (f - 1)) / f, max));
    el.style.setProperty('--lado', Math.max(s, 40) + 'px');
  }
  const ajustar = () => {
    if (current === 'parejas') layoutPj();
    if (current === 'contar') encajar($('#ctEscena'), TAM());
    if (current === 'donde' && DO_ACT) lado($('#doTablero'), DO_ACT.f, DO_ACT.c, 10, 130);
    if (current === 'serie' && sr.P) lado($('#sePads'), sr.P.p === 3 ? 1 : 2, sr.P.p === 4 ? 2 : 3, 16, 170);
  };
  let DO_ACT = null;

  /* ---------- pantallas (se añaden al cargar) ---------- */
  const barra = (atras, titulo, extra) => `<div class="bar"><button class="btn" data-go="${atras}" aria-label="Volver">⬅️</button><div class="title">${titulo}</div>${extra}<div class="stars">⭐ <b class="sc">0</b></div></div>`;
  document.getElementById('logros').insertAdjacentHTML('beforebegin', `
<!-- CONTAR (copia de pensar 04/11) -->
<section class="screen pn" id="contar">
  ${barra('m-think', 'Contar', '<button class="btn" id="ctSay" aria-label="Repetir la pregunta">🗣️</button>')}
  <div class="pnFila"><div class="pnCamino" id="ctCamino"></div><button class="btn pnSaltar" id="ctPrueba">⏩ Saltar lo fácil</button></div>
  <div class="pnWrap"><div class="pnEscena" id="ctEscena"></div><div class="pnLado"><div class="pnTexto" id="ctTexto"></div><div class="pnOpts" id="ctOpts"></div></div></div>
  ${introHTML('contar')}
</section>
<!-- MEMORIA: menú -->
<section class="screen" id="memoria">
  ${barra('m-think', 'Memoria', '')}
  <div class="menu">
    <button class="big c2" data-go="parejas"><span class="ill" data-ill="parejas"></span>Parejas<small class="pnNv" data-nv="parejas"></small></button>
    <button class="big c3" data-go="donde"><span class="ill" data-ill="donde"></span>¿Dónde estaba?<small class="pnNv" data-nv="donde"></small></button>
    <button class="big c4" data-go="serie"><span class="ill" data-ill="serie"></span>Repite la serie<small class="pnNv" data-nv="serie"></small></button>
  </div>
</section>
<section class="screen pn" id="parejas">
  ${barra('memoria', 'Parejas', '')}
  <div class="subbar" id="pjChips"></div>
  <div class="memgrid pnMem" id="pjGrid"></div>
</section>
<section class="screen pn" id="donde">
  ${barra('memoria', '¿Dónde estaba?', '<button class="btn" id="doSay" aria-label="Repetir">🗣️</button>')}
  <div class="pnFila"><div class="pnCamino" id="doCamino"></div><button class="btn pnSaltar" id="doPrueba">⏩ Saltar lo fácil</button></div>
  <div class="pnWrap"><div class="pnTablero" id="doTablero"></div><div class="pnLado"><div class="pnTexto" id="doTexto"></div><div class="pnBusca" id="doBusca"></div>
    <div class="pnAcciones"><button class="btn pnAccion" id="doListo">🙈 ¡Ya me acuerdo!</button><button class="btn pnAccion" id="doOtra" hidden>👀 Mirar otra vez</button></div></div></div>
  ${introHTML('donde')}
</section>
<section class="screen pn" id="serie">
  ${barra('memoria', 'Repite la serie', '<button class="btn" id="seOtra" aria-label="Ver la serie otra vez">👂</button>')}
  <div class="pnFila"><div class="pnCamino" id="seCamino"></div><button class="btn pnSaltar" id="sePrueba">⏩ Saltar lo fácil</button></div>
  <div class="pnWrap"><div class="pnPads" id="sePads"></div><div class="pnLado"><div class="pnTexto" id="seTexto"></div><div class="pnPuntos" id="sePuntos"></div></div></div>
  ${introHTML('serie')}
</section>`);
  paintIll(); showStars();
  // menú Pensar: Contar y Memoria nuevos (los otros tres, como hoy)
  $$('#m-think [data-go="quiz"][data-arg="contar"]').forEach(b => { b.dataset.go = 'contar'; delete b.dataset.arg; });
  $$('#m-think [data-go="memory"]').forEach(b => { b.dataset.go = 'memoria'; b.lastChild.textContent = 'Memoria'; });

  /* =====================================================================
     CONTAR
     ===================================================================== */
  const CT = [
    { n: 'contar hasta 5', t: ['contar'], a: 1, b: 5 },
    { n: 'contar hasta 10', t: ['contar'], a: 5, b: 10 },
    { n: 'contar hasta 15', t: ['contar'], a: 9, b: 15, grupos: true },
    { n: 'contar hasta 20', t: ['contar'], a: 12, b: 20, grupos: true },
    { n: 'sumar', t: ['suma'], b: 6 },
    { n: 'quitar', t: ['resta'], b: 6 },
    { n: '¿cuántos faltan?', t: ['faltan'], b: 10, huecos: true },
    { n: 'sumar y quitar hasta 10', t: ['suma', 'resta'], b: 10 },
    { n: '¿cuántos faltan? sin huecos', t: ['faltan'], b: 10 },
    { n: 'todo hasta 20', t: ['suma', 'resta', 'faltan'], b: 20, grupos: true },
  ];
  const CT_NOM = CT.map(p => p.n), CT_PRUEBA = [1, 3, 4, 5, 6, 8];
  const nvCt = Nivel('lv_contar2', CT.length, 3, () => {   // la primera vez, la clave antigua (solo se lee)
    const viejo = +store.get('lv_contar', 0) || 0; return viejo >= 6 ? { L: 1, max: 1 } : {};
  });
  const prCt = Prueba(nvCt, CT_PRUEBA);
  const ct = { item: null, fallos: 0, ocupado: false, turno: 0, ultimo: '', repaso: false };
  const obj = (id, cls = '') => `<span class="pnO ${cls}">${DB[id].svg}</span>`;
  const objs = (id, n, cls = '') => Array.from({ length: n }, () => obj(id, cls)).join('');
  function caja(html, grupos, extra = '') {   // en grupos de 5 (y de 10) para las cantidades grandes
    return `<div class="pnCaja${grupos ? ' grupos' : ''} ${extra}">${html}</div>`;
  }
  function enGrupos(items) {   // items: lista de html → filas de 5, decenas separadas
    let h = ''; for (let i = 0; i < items.length; i += 10) {
      const d = items.slice(i, i + 10); h += `<span class="pnDecena">${[d.slice(0, 5), d.slice(5)].filter(f => f.length).map(f => `<span class="pnFila5">${f.join('')}</span>`).join('')}</span>`;
    } return h;
  }
  function opciones(resp, extra, k) {
    const s = new Set([resp]), cand = shuffle([resp - 1, resp + 1, resp - 2, resp + 2, ...extra]).filter(x => x >= 1 && x <= 20 && x !== resp);
    for (const x of cand) { if (s.size >= k) break; s.add(x); }
    for (let x = 1; s.size < k; x++) s.add(x);
    return [...s].sort((a, b) => a - b);
  }
  function elegirDibujo(filtro) { const ok = IDS.filter(i => i !== ct.ultimo && (!filtro || filtro(DB[i]))); const id = pick(ok); ct.ultimo = id; return id; }
  function crearCt(L) {
    const P = CT[L], tipo = pick(P.t), k = L < 4 ? 3 : 4;
    if (tipo === 'contar') {
      const id = elegirDibujo(), d = DB[id], n = P.a + rnd(P.b - P.a + 1), lista = Array.from({ length: n }, () => obj(id));
      const ord = P.grupos ? enGrupos(lista) : lista.join('');
      return { tipo, d, resp: n, opts: opciones(n, [], k), html: caja(ord, P.grupos, rnd(2) ? 'suelta' : ''),
        texto: `¿${may(cuant(d))} ${d.p} hay?`, ayuda: 'Toca cada uno para contarlos.', contables: '.pnO' };
    }
    if (tipo === 'suma') {
      const id = elegirDibujo(), d = DB[id], tot = 2 + rnd(P.b - 1), a = 1 + rnd(tot - 1), b = tot - a, g = P.grupos && tot > 10;
      const A = Array.from({ length: a }, () => obj(id)), B = Array.from({ length: b }, () => obj(id, 'llega'));
      return { tipo, d, resp: tot, opts: opciones(tot, [a, b], k),
        html: `<div class="pnSuma">${caja(g ? enGrupos(A) : A.join(''), g)}<span class="pnMas">+</span>${caja(g ? enGrupos(B) : B.join(''), g, 'llegan')}</div>`,
        texto: `Hay ${uno(a, d)} ${nom(a, d)}. ${b === 1 ? 'Llega' : 'Llegan'} ${pro(b, d)} más. ¿${may(cuant(d))} hay ahora?`, ayuda: 'Cuenta todos juntos.', contables: '.pnO' };
    }
    if (tipo === 'resta') {
      const id = elegirDibujo(), d = DB[id], a = 3 + rnd(P.b - 2), q = 1 + rnd(a - 1), g = P.grupos && a > 10;
      const lista = Array.from({ length: a }, (_, i) => obj(id, i >= a - q ? 'sevan' : ''));
      return { tipo, d, resp: a - q, opts: opciones(a - q, [a, q], k), html: caja(g ? enGrupos(lista) : lista.join(''), g),
        texto: `Hay ${a} ${d.p}. ${may(IR[d.ir](pro(q, d), q))} ¿${may(cuant(d))} quedan?`, ayuda: 'Cuenta solo los que quedan.', contables: '.pnO:not(.sevan)' };
    }
    // faltan
    const id = elegirDibujo(), d = DB[id], t = 3 + rnd(P.b - 2), h = 1 + rnd(t - 1), g = P.grupos && t > 10;
    const lista = [...Array.from({ length: h }, () => obj(id)), ...Array.from({ length: t - h }, () => `<span class="pnHueco${P.huecos ? '' : ' oculto'}"></span>`)];
    return { tipo, d, resp: t - h, opts: opciones(t - h, [t, h], k), huecos: !!P.huecos,
      html: `${P.huecos ? '' : `<div class="pnMeta"><b>${t}</b>${obj(id)}</div>`}${caja(g ? enGrupos(lista) : lista.join(''), g)}`,
      texto: `Queremos ${t} ${d.p}. Hay ${pro(h, d)}. ¿${may(cuant(d))} faltan?`,
      ayuda: P.huecos ? 'Cuenta los huecos vacíos.' : `¿${may(cuant(d))} más hacen falta para llegar a ${t}?`, contables: '.pnHueco' };
  }
  function pasoCt() {
    if (prCt.activa) { ct.repaso = false; return prCt.paso(); }
    const L = nvCt.get().L; ct.repaso = L >= 2 && Math.random() < .25; return ct.repaso ? rnd(L) : L;
  }
  function rondaCt() {
    const t = ++ct.turno; ct.fallos = 0; ct.ocupado = false; pintarCamino($('#ctCamino'), nvCt, prCt, CT_NOM);
    const it = ct.item = crearCt(pasoCt()), esc = $('#ctEscena');
    esc.innerHTML = it.html; $('#ctTexto').textContent = it.texto;
    const box = $('#ctOpts'); box.innerHTML = ''; box.classList.toggle('cuatro', it.opts.length > 3);
    it.opts.forEach(v => { const b = document.createElement('button'); b.className = 'qopt pnOpt'; b.innerHTML = `<span class="num">${v}</span>`; b.onclick = () => respuestaCt(b, v); box.appendChild(b); });
    let c = 0;   // contar tocando, como hoy
    esc.querySelectorAll(it.contables).forEach(el => el.onclick = () => { if (el.classList.contains('contado') || ct.ocupado) return; c++; el.classList.add('contado'); el.insertAdjacentHTML('beforeend', `<b>${c}</b>`); sfx.count(c); say(String(c)); });
    encajar(esc, TAM());
    if (it.tipo === 'resta') setTimeout(() => { if (t === ct.turno) esc.querySelectorAll('.sevan').forEach(e => e.classList.add('ido')); }, 900);
    setTimeout(() => { if (t === ct.turno) say(it.texto); }, 300);
  }
  async function pistaCt(t) {
    const esc = $('#ctEscena'), it = ct.item; ct.ocupado = true;
    esc.querySelectorAll('.contado').forEach(e => { e.classList.remove('contado'); const b = e.querySelector('b'); if (b) b.remove(); });
    esc.querySelectorAll('.pnHueco.oculto').forEach(e => e.classList.remove('oculto'));
    say(it.ayuda); await espera(1400);
    const els = [...esc.querySelectorAll(it.contables)];
    for (let i = 0; i < els.length; i++) { if (t !== ct.turno) return; els[i].classList.add('contado'); els[i].insertAdjacentHTML('beforeend', `<b>${i + 1}</b>`); sfx.count(i + 1); say(String(i + 1)); await espera(700); }
    if (t !== ct.turno) return; ct.ocupado = false;
    $$('#ctOpts .pnOpt').forEach(b => { if (+b.textContent === it.resp) b.classList.add('pista'); });
  }
  function respuestaCt(b, v) {
    const it = ct.item, t = ct.turno; if (ct.ocupado || b.classList.contains('fuera')) return;
    if (v === it.resp) {
      ct.ocupado = true; b.classList.add('ok'); sfx.good(); say(`${v}. ${pick(PRAISE)}`); addStar(); if (stars % 10 === 0) confetti();
      const limpio = ct.fallos <= 1; let espera2 = 1700;
      if (prCt.activa) { const r = prCt.resultado(limpio); if (r !== 'sigue') { setTimeout(() => finPrueba(r, nvCt, CT_NOM), 900); espera2 = 3200; } }
      else if (!ct.repaso) { const r = nvCt.resultado(limpio); if (r === 'sube') { setTimeout(() => { confetti(); say('¡Subes de nivel! Ahora, ' + CT_NOM[nvCt.get().L] + '.'); }, 900); espera2 = 3400; } }
      setTimeout(() => { if (t === ct.turno) rondaCt(); }, espera2);
      return;
    }
    ct.fallos++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no', 'fuera'); sfx.bad();
    if (prCt.activa && ct.fallos >= 2) {   // en la prueba rápida: hasta aquí; se enseña la buena y se sigue jugando
      ct.ocupado = true; $$('#ctOpts .pnOpt').forEach(x => { if (+x.textContent === it.resp) x.classList.add('pista'); });
      const r = prCt.resultado(false); setTimeout(() => finPrueba(r, nvCt, CT_NOM), 700); setTimeout(() => { if (t === ct.turno) rondaCt(); }, 3600); return;
    }
    if (ct.fallos === 1) say('¡Casi! ' + it.ayuda);
    else if (ct.fallos === 2) pistaCt(t);
  }
  $('#ctSay').onclick = () => ct.item && say(ct.item.texto);
  $('#ctPrueba').onclick = () => { if (!prCt.empezar()) { toast('¡Ya estás en lo más difícil! 🌟'); return; } say('¡Prueba rápida! Si aciertas, saltamos lo fácil.'); rondaCt(); };
  onShow.contar = () => { ct.turno++; showStars(); if (!intro($('#contar'), nvCt, () => { if (prCt.empezar()) say('¡Prueba rápida! Si aciertas, saltamos lo fácil.'); rondaCt(); }, rondaCt)) rondaCt(); else { pintarCamino($('#ctCamino'), nvCt, prCt, CT_NOM); $('#ctEscena').innerHTML = ''; $('#ctOpts').innerHTML = ''; $('#ctTexto').textContent = ''; } };
  onLeave.contar = () => { ct.turno++; prCt.activa = false; };

  /* =====================================================================
     MEMORIA · menú
     ===================================================================== */
  const PJ = [3, 4, 6, 8, 10, 12];
  const DO = [{ f: 2, c: 2, k: 2, q: 1 }, { f: 2, c: 3, k: 3, q: 1 }, { f: 3, c: 3, k: 3, q: 2 }, { f: 3, c: 3, k: 4, q: 2 }, { f: 3, c: 4, k: 5, q: 2 }, { f: 4, c: 4, k: 6, q: 3 }, { f: 4, c: 4, k: 8, q: 3 }];
  const SE = [{ p: 3, l: 2 }, { p: 3, l: 3 }, { p: 4, l: 3 }, { p: 4, l: 4 }, { p: 4, l: 5 }, { p: 6, l: 5 }, { p: 6, l: 6 }, { p: 6, l: 7 }];
  const nvPj = Nivel('lv_parejas', PJ.length, 2), nvDo = Nivel('lv_donde', DO.length, 3), nvSe = Nivel('lv_serie', SE.length, 3);
  onShow.memoria = () => {
    showStars();
    $('[data-nv="parejas"]').textContent = `${PJ[nvPj.get().L]} parejas`;
    $('[data-nv="donde"]').textContent = `Nivel ${nvDo.get().L + 1}`;
    $('[data-nv="serie"]').textContent = `Nivel ${nvSe.get().L + 1}`;
  };

  /* ---------- Parejas (más parejas; pista si se atasca) ---------- */
  const pj = { cartas: [], abiertas: [], hechas: new Set(), bloqueo: false, fallos: 0, seguidos: 0, pistas: 0, turno: 0 };
  function chipsPj() {
    const o = nvPj.get(), box = $('#pjChips'); box.innerHTML = '';
    PJ.forEach((n, i) => { const b = document.createElement('button'); b.className = 'btn pnChip' + (i === o.L ? ' sel' : '') + (i <= o.max ? ' hecho' : '');
      b.textContent = n; b.setAttribute('aria-label', n + ' parejas'); b.onclick = () => { sfx.pop(); nvPj.elegir(i); empezarPj(); }; box.appendChild(b); });
  }
  function empezarPj() {
    pj.turno++; const n = PJ[nvPj.get().L]; chipsPj();
    Object.assign(pj, { cartas: shuffle(shuffle(IDS).slice(0, n).flatMap(e => [e, e])), abiertas: [], hechas: new Set(), bloqueo: false, fallos: 0, seguidos: 0, pistas: 0 });
    const g = $('#pjGrid'); g.innerHTML = '';
    pj.cartas.forEach((id, i) => { const b = document.createElement('button'); b.className = 'card pnCard'; b.setAttribute('aria-label', 'Carta');
      b.innerHTML = `<span class="pnCara">${DB[id].svg}</span>`; b.onclick = () => tocarPj(i, b); g.appendChild(b); });
    requestAnimationFrame(layoutPj); say(`¡Encuentra las ${n} parejas!`);
  }
  function layoutPj() {
    const g = $('#pjGrid'), n = pj.cartas.length; if (!n || !g.offsetParent) return;
    const r = g.getBoundingClientRect(), W = r.width - 24, H = r.height - 24; let best = { s: 0, c: 2 };
    for (let c = 2; c <= n; c++) { const rows = Math.ceil(n / c), s = Math.min((W - (c - 1) * 10) / c, (H - (rows - 1) * 10) / rows); if (s > best.s) best = { s, c }; }
    const s = Math.floor(Math.min(best.s, 150)); g.style.gridTemplateColumns = `repeat(${best.c},${s}px)`; g.style.setProperty('--cs', s + 'px');
  }
  addEventListener('resize', () => ajustar());
  function tocarPj(i, el) {
    if (pj.bloqueo || pj.abiertas.includes(i) || pj.hechas.has(i)) return;
    el.classList.add('open'); sfx.pop(); pj.abiertas.push(i); if (pj.abiertas.length < 2) return;
    const [a, b] = pj.abiertas, els = $('#pjGrid').children, t = pj.turno; pj.abiertas = [];
    if (pj.cartas[a] === pj.cartas[b]) {
      pj.hechas.add(a); pj.hechas.add(b); pj.seguidos = 0;
      setTimeout(() => { sfx.good(); els[a].classList.add('done'); els[b].classList.add('done'); els[a].classList.remove('asoma'); els[b].classList.remove('asoma'); }, 250);
      if (pj.hechas.size === pj.cartas.length) {
        const n = pj.cartas.length / 2, limpio = pj.fallos <= n * 2 && pj.pistas <= 1;
        setTimeout(() => {
          confetti(); addStar(n >= 8 ? 5 : n >= 6 ? 3 : 2);   // como hoy
          const r = nvPj.resultado(limpio);
          say(r === 'sube' ? `¡Las encontraste todas! La próxima vez, ${PJ[nvPj.get().L]} parejas.` : '¡Las encontraste todas! ¡Bravo!');
          setTimeout(() => { if (t === pj.turno && current === 'parejas') empezarPj(); }, 3200);
        }, 700);
      }
    } else {
      pj.fallos++; pj.seguidos++; pj.bloqueo = true;
      setTimeout(() => {
        els[a].classList.remove('open'); els[b].classList.remove('open'); pj.bloqueo = false;
        if (pj.seguidos >= 3 && t === pj.turno) {   // pista: asoma una pareja un momento
          pj.seguidos = 0; pj.pistas++; const quedan = pj.cartas.map((id, k) => k).filter(k => !pj.hechas.has(k)), id = pj.cartas[pick(quedan)];
          const par = quedan.filter(k => pj.cartas[k] === id); pj.bloqueo = true; say('¡Mira! Aquí hay una pareja.');
          par.forEach(k => els[k].classList.add('asoma'));
          setTimeout(() => { par.forEach(k => els[k].classList.remove('asoma')); pj.bloqueo = false; }, 1600);
        }
      }, 1000);
    }
  }
  onShow.parejas = () => { showStars(); empezarPj(); };
  onLeave.parejas = () => { pj.turno++; };

  /* ---------- ¿Dónde estaba? (recordar posiciones) ---------- */
  const DO_NOM = DO.map(p => `${p.k} dibujos`), prDo = Prueba(nvDo, [1, 3, 5]);
  const dn = { fase: '', celdas: [], pregs: [], q: 0, fallos: 0, fallosQ: 0, mirarOtra: 0, turno: 0, repaso: false };
  function rondaDo() {
    const t = ++dn.turno; pintarCamino($('#doCamino'), nvDo, prDo, DO_NOM);
    const L = prDo.activa ? prDo.paso() : nvDo.get().L; dn.repaso = !prDo.activa && L >= 2 && Math.random() < .2;
    const P = DO[dn.repaso ? rnd(L) : L], n = P.f * P.c, ids = shuffle(IDS).slice(0, P.k), pos = shuffle([...Array(n).keys()]).slice(0, P.k);
    dn.celdas = Array(n).fill(null); pos.forEach((p, i) => dn.celdas[p] = ids[i]);
    Object.assign(dn, { pregs: shuffle(ids).slice(0, P.q), q: 0, fallos: 0, fallosQ: 0, mirarOtra: 0, fase: 'mirar' });
    const tb = $('#doTablero'); tb.style.gridTemplateColumns = `repeat(${P.c},1fr)`; tb.style.setProperty('--f', P.f); tb.style.setProperty('--c', P.c); tb.innerHTML = ''; DO_ACT = P;
    dn.celdas.forEach((id, i) => { const b = document.createElement('button'); b.className = 'pnCelda vista'; b.innerHTML = id ? `<span class="pnCara">${DB[id].svg}</span>` : '';
      b.setAttribute('aria-label', 'Casilla ' + (i + 1)); b.onclick = () => tocarDo(i, b); tb.appendChild(b); });
    $('#doBusca').innerHTML = ''; $('#doListo').hidden = false; $('#doOtra').hidden = true; ajustar();
    $('#doTexto').textContent = '¡Mira dónde está cada uno!'; setTimeout(() => { if (t === dn.turno) say('¡Mira dónde está cada uno! Cuando te acuerdes, toca «Ya me acuerdo».'); }, 300);
  }
  function preguntaDo() {
    const id = dn.pregs[dn.q], d = DB[id]; dn.fallosQ = 0;
    $('#doBusca').innerHTML = `<span class="pnCara">${d.svg}</span>`; $('#doTexto').textContent = `¿Dónde estaba ${art(d)} ${d.s}?`; say(`¿Dónde estaba ${art(d)} ${d.s}?`);
  }
  function taparDo() { dn.fase = 'buscar'; $$('#doTablero .pnCelda').forEach((b, i) => { if (!b.classList.contains('bien')) b.classList.remove('vista'); }); $('#doListo').hidden = true; $('#doOtra').hidden = false; preguntaDo(); }
  $('#doListo').onclick = () => { if (dn.fase !== 'mirar') return; sfx.pop(); taparDo(); };
  $('#doOtra').onclick = () => {   // ayuda: volver a mirar (cuenta como pista)
    if (dn.fase !== 'buscar') return; sfx.pop(); dn.mirarOtra++; dn.fase = 'mirar';
    $$('#doTablero .pnCelda').forEach(b => { b.classList.add('vista'); b.classList.remove('pista'); }); $('#doListo').hidden = false; $('#doOtra').hidden = true;
    $('#doTexto').textContent = '¡Mira otra vez!'; say('¡Mira otra vez!');
  };
  $('#doSay').onclick = () => { if (dn.fase === 'buscar') { const d = DB[dn.pregs[dn.q]]; say(`¿Dónde estaba ${art(d)} ${d.s}?`); } else say('¡Mira dónde está cada uno!'); };
  function tocarDo(i, b) {
    if (dn.fase !== 'buscar' || b.classList.contains('vista')) return; const t = dn.turno;
    if (dn.celdas[i] === dn.pregs[dn.q]) {
      b.classList.add('vista', 'bien'); b.classList.remove('pista'); sfx.good(); dn.q++;
      if (dn.q < dn.pregs.length) { say(pick(PRAISE)); setTimeout(() => { if (t === dn.turno) preguntaDo(); }, 1100); return; }
      dn.fase = 'fin'; addStar(); say(`${pick(PRAISE)} Te acordabas de todo.`); if (stars % 10 === 0) confetti();
      const limpio = dn.fallos <= 1 && !dn.mirarOtra; let ms = 2000;
      if (prDo.activa) { const r = prDo.resultado(limpio); if (r !== 'sigue') { setTimeout(() => finPrueba(r, nvDo, DO_NOM), 900); ms = 3400; } }
      else if (!dn.repaso && nvDo.resultado(limpio) === 'sube') { setTimeout(() => { confetti(); say('¡Subes de nivel! Ahora hay más dibujos.'); }, 900); ms = 3400; }
      setTimeout(() => { if (t === dn.turno) rondaDo(); }, ms);
      return;
    }
    dn.fallos++; dn.fallosQ++; sfx.bad(); b.classList.add('vista', 'mal');   // se ve qué había y se vuelve a tapar
    setTimeout(() => { if (t === dn.turno) b.classList.remove('vista', 'mal'); }, 1100);
    if (prDo.activa && dn.fallosQ >= 2) { dn.fase = 'fin'; const r = prDo.resultado(false); setTimeout(() => finPrueba(r, nvDo, DO_NOM), 700); setTimeout(() => { if (t === dn.turno) rondaDo(); }, 3400); return; }
    if (dn.fallosQ >= 2) { const k = dn.celdas.indexOf(dn.pregs[dn.q]); $('#doTablero').children[k].classList.add('pista'); say('Busca la que brilla.'); }
    else say('¡Casi! Prueba otra vez.');
  }
  $('#doPrueba').onclick = () => { if (!prDo.empezar()) { toast('¡Ya estás en lo más difícil! 🌟'); return; } say('¡Prueba rápida!'); rondaDo(); };
  onShow.donde = () => { dn.turno++; showStars(); if (intro($('#donde'), nvDo, () => { prDo.empezar(); rondaDo(); }, rondaDo)) { pintarCamino($('#doCamino'), nvDo, prDo, DO_NOM); $('#doTablero').innerHTML = ''; } else rondaDo(); };
  onLeave.donde = () => { dn.turno++; prDo.activa = false; };

  /* ---------- Repite la serie (secuencias) ---------- */
  const PADS = [{ id: 'flor', f: 523, c: '#ffd3e6' }, { id: 'estrella', f: 587, c: '#fff3c4' }, { id: 'pez', f: 659, c: '#d6f0ff' }, { id: 'hoja', f: 698, c: '#d4f7e6' }, { id: 'mariposa', f: 784, c: '#e7defe' }, { id: 'seta', f: 880, c: '#ffe3d1' }];
  const SE_NOM = SE.map(p => `${p.l} pasos`), prSe = Prueba(nvSe, [2, 4, 6]);
  const sr = { fase: '', seq: [], pos: 0, fallos: 0, veces: 0, turno: 0, repaso: false, P: null };
  function encender(k, ms = 480) { const el = $('#sePads').children[k]; if (!el) return; el.classList.add('luz'); tone(PADS[k].f, .3, 'sine', .16); setTimeout(() => el.classList.remove('luz'), ms); }
  async function ensenar(t) {
    sr.fase = 'mira'; sr.pos = 0; $$('#sePads .pnPad').forEach(b => b.classList.remove('pista')); $('#seTexto').textContent = '👀 Mira y escucha…'; puntosSe();
    await espera(700);
    for (const k of sr.seq) { if (t !== sr.turno) return; encender(k); await espera(750); }
    if (t !== sr.turno) return; sr.fase = 'toca'; $('#seTexto').textContent = '¡Te toca!'; say('¡Te toca!'); marcarPistaSe();
  }
  function marcarPistaSe() { $$('#sePads .pnPad').forEach((b, k) => b.classList.toggle('pista', sr.fallos >= 2 && sr.fase === 'toca' && k === sr.seq[sr.pos])); }
  function puntosSe() { $('#sePuntos').innerHTML = sr.seq.map((_, i) => `<i class="${i < sr.pos ? 'hecho' : ''}"></i>`).join(''); }
  function rondaSe() {
    const t = ++sr.turno; pintarCamino($('#seCamino'), nvSe, prSe, SE_NOM);
    const L = prSe.activa ? prSe.paso() : nvSe.get().L; sr.repaso = !prSe.activa && L >= 2 && Math.random() < .2;
    const P = sr.P = SE[sr.repaso ? rnd(L) : L], seq = [];
    while (seq.length < P.l) { const k = rnd(P.p); if (seq.length >= 2 && seq[seq.length - 1] === k && seq[seq.length - 2] === k) continue; seq.push(k); }
    Object.assign(sr, { seq, pos: 0, fallos: 0, veces: 0 });
    const box = $('#sePads'); box.className = 'pnPads p' + P.p; box.innerHTML = '';
    PADS.slice(0, P.p).forEach((pd, k) => { const b = document.createElement('button'); b.className = 'pnPad'; b.style.setProperty('--pc', pd.c);
      b.innerHTML = `<span class="pnCara">${DB[pd.id].svg}</span>`; b.setAttribute('aria-label', DB[pd.id].s); b.onclick = () => tocarSe(k); box.appendChild(b); }); ajustar();
    say(`Mira y escucha. Luego repite la serie de ${P.l}.`); ensenar(t);
  }
  function tocarSe(k) {
    if (sr.fase !== 'toca') return; const t = sr.turno; encender(k, 300);
    if (k === sr.seq[sr.pos]) {
      sr.pos++; puntosSe(); marcarPistaSe(); if (sr.pos < sr.seq.length) return;
      sr.fase = 'fin'; setTimeout(() => sfx.good(), 250); addStar(); say(pick(PRAISE)); if (stars % 10 === 0) confetti();
      const limpio = sr.fallos + Math.max(0, sr.veces - 1) <= 1; let ms = 2000;
      if (prSe.activa) { const r = prSe.resultado(limpio); if (r !== 'sigue') { setTimeout(() => finPrueba(r, nvSe, SE_NOM), 900); ms = 3400; } }
      else if (!sr.repaso && nvSe.resultado(limpio) === 'sube') { setTimeout(() => { confetti(); say('¡Subes de nivel! La serie será un poco más larga.'); }, 900); ms = 3400; }
      setTimeout(() => { if (t === sr.turno) rondaSe(); }, ms);
      return;
    }
    sr.fallos++; sr.fase = 'mira'; setTimeout(() => sfx.bad(), 200);
    if (prSe.activa && sr.fallos >= 2) { sr.fase = 'fin'; const r = prSe.resultado(false); setTimeout(() => finPrueba(r, nvSe, SE_NOM), 700); setTimeout(() => { if (t === sr.turno) rondaSe(); }, 3400); return; }
    say(sr.fallos >= 2 ? '¡Uy! Te la enseño otra vez. Sigue la que brilla.' : '¡Uy! Te la enseño otra vez.');
    sr.turno++; const t2 = sr.turno; setTimeout(() => { if (t2 === sr.turno) ensenar(t2); }, 1200);
  }
  $('#seOtra').onclick = () => { if (sr.fase !== 'toca') return; sr.veces++; sr.turno++; ensenar(sr.turno); };
  $('#sePrueba').onclick = () => { if (!prSe.empezar()) { toast('¡Ya estás en lo más difícil! 🌟'); return; } say('¡Prueba rápida!'); setTimeout(rondaSe, 900); };
  onShow.serie = () => { sr.turno++; showStars(); if (intro($('#serie'), nvSe, () => { prSe.empezar(); rondaSe(); }, rondaSe)) { pintarCamino($('#seCamino'), nvSe, prSe, SE_NOM); $('#sePads').innerHTML = ''; } else rondaSe(); };
  onLeave.serie = () => { sr.turno++; prSe.activa = false; };

  window.PENSAR_UTIL = { Nivel, Prueba, pintarCamino, finPrueba, introHTML, intro, encajar, TAM, espera, may, barra, lado };   // para pensar2.js
  window.PENSAR = { crearCt, CT_PRUEBA, nvCt, nvPj, nvDo, nvSe, prCt, prDo, prSe, ct, pj, dn, sr, CT, PJ, DO, SE };   // para las pruebas
})();
