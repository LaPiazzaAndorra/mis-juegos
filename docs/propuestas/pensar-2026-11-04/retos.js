/* =====================================================================
   Retos para pensar (copia aislada de Pensar, 5.ª entrega · prueba de niveles avanzados, 15/11/2026) · menú Pensar
   Tres retos distintos, con niveles avanzados que se eligen directamente:
     1. ¿Quién se esconde?  combinar 3–4 pistas (negaciones, cantidades y relaciones de posición) entre 8–12
                            sospechosos; o «Tú preguntas»: elegir qué preguntar para descartar.
     2. La tabla de dos reglas  completar huecos interiores donde mandan dos reglas a la vez, y ordenar piezas.
     3. ¿Qué ha cambiado?   recordar una escena: qué cambió (1 o 2 cosas), colocar de memoria y repetir al revés.
   En todos se responde y se REVISA antes de dar por buena la respuesta (seleccionar → tachar o comprobar).
   Pistas voluntarias (💡, cada vez más concretas); sin cronómetro ni castigos: un error no quita nada y explica por qué.
   +1 ⭐ por reto resuelto, como un acierto en los demás juegos; sin logros nuevos.
   Recuerda el último reto y el nivel elegido en cada uno: clave nueva «lv_retos».
   NORMA DE LECTURA DE AMAIA (15/11/2026): todo texto que ve la niña va en MAYÚSCULAS, con letra grande y frases cortas,
   y siempre con apoyo visual (dibujos, marcas ✓/✗) o de voz (tocar un texto lo lee). Se simplifica cómo se explica,
   no lo que hay que resolver. Las frases de voz van en minúsculas normales para que el iPhone las lea bien.
   ===================================================================== */
(function () {
  'use strict';
  const U = window.PENSAR_UTIL, P2 = window.PENSAR2, DB = window.DIBUJOS;
  const { barra } = U;
  // mismos colores (y orden) que pensar2.js, para recolorear con su svgDe
  const COL = [{ c: '#ff6f7d', n: 'rojo' }, { c: '#ffd46b', n: 'amarillo' }, { c: '#6cc8f5', n: 'azul' }, { c: '#5fd39b', n: 'verde' }, { c: '#c9b6ff', n: 'lila' }];
  const KINDS = ['estrella', 'corazon', 'globo', 'pez', 'mariposa', 'seta', 'mariquita'];
  const NUM = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis'];
  const rnd = n => Math.floor(Math.random() * n), pick = a => a[rnd(a.length)];
  const mezclar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const art = k => DB[k].g === 'f' ? 'una' : 'un', nombre = k => `${art(k)} ${DB[k].s}`;
  const svgK = (k, c) => P2.svgDe(P2.item(k, { col: c === undefined || c === null ? -1 : c }));
  const cosas = (k, c, n = 1) => `<span class="qnCosas n${n}">${Array.from({ length: n }, () => `<span class="qnCosa">${svgK(k, c)}</span>`).join('')}</span>`;
  const SI = `<svg class="qnMarca si" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/><path d="M11 21l6 6 12-13"/></svg>`;
  const NO = `<svg class="qnMarca no" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/><path d="M13 13l14 14M27 13L13 27"/></svg>`;
  const PREG = `<svg class="qnMarca preg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/><text x="20" y="28" text-anchor="middle">?</text></svg>`;
  const ICO = {
    tachar: `<svg viewBox="0 0 100 100"><rect x="18" y="14" width="64" height="72" rx="14" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M30 30L70 70M70 30L30 70" stroke="#e5484d" stroke-width="11" stroke-linecap="round"/></svg>`,
    es: `<svg viewBox="0 0 100 100"><circle cx="44" cy="44" r="28" fill="#efe6ff" stroke="${INK}" stroke-width="7"/><path d="M64 64l24 24" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M31 45l9 9 17-19" fill="none" stroke="#2b9a66" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    comprobar: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#5fd39b" stroke="${INK}" stroke-width="6"/><path d="M30 52l13 13 27-30" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    ojo: `<svg viewBox="0 0 100 100"><path d="M8 50Q50 8 92 50Q50 92 8 50Z" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="50" cy="50" r="17" fill="#6cc8f5" stroke="${INK}" stroke-width="6"/><circle cx="50" cy="50" r="6" fill="${INK}"/><path d="M60 78l10 10 20-22" fill="none" stroke="#2b9a66" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    otro: `<svg viewBox="0 0 100 100"><path d="M30 18L80 50L30 82Z" fill="#ffd46b" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></svg>`,
    ver: `<svg viewBox="0 0 100 100"><path d="M8 50Q50 8 92 50Q50 92 8 50Z" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="50" cy="50" r="17" fill="#6cc8f5" stroke="${INK}" stroke-width="6"/><circle cx="50" cy="50" r="6" fill="${INK}"/></svg>`,
  };
  const M = t => String(t).toLocaleUpperCase('es');   // la norma: lo que se lee, en mayúsculas
  // botón con dibujo y palabra corta debajo
  const boton = (id, ico, palabra, cls = '') => `<button class="btn rtBtn ${cls}" id="${id}" aria-label="${palabra}">${ICO[ico]}<b class="rtCap">${M(palabra)}</b></button>`;
  const ALTAVOZ = `<svg class="rtAltavoz" viewBox="0 0 100 100" aria-hidden="true"><path d="M14 38H34L58 18V82L34 62H14Z" fill="#c9b6ff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M70 34Q80 50 70 66M80 24Q96 50 80 76" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/></svg>`;
  const texto = id => `<button class="rtTexto" id="${id}" aria-label="Escuchar">${ALTAVOZ}<span></span></button>`;
  // texto corto en pantalla (en mayúsculas) + la frase de voz; tocar el texto la repite
  const VOZ = {};
  function habla(id, txt, voz) {
    const el = $(id); el.querySelector('span').textContent = M(txt); VOZ[id] = voz || txt;
    if (voz !== null) say(voz || txt);
  }

  /* ---------- lo guardado: último reto y nivel de cada uno («lv_retos»; se valida al leer) ---------- */
  const CLAVE = 'lv_retos', RETOS = ['detective', 'tabla', 'escena'];
  const NOMBRES = { detective: '¿Quién se esconde?', tabla: 'La tabla de dos reglas', escena: '¿Qué ha cambiado?' };
  const TITULO = { detective: 'Detective', tabla: 'Dos reglas', escena: '¿Qué cambió?' };   // cortos, caben en la barra
  const PANT = { detective: 'rDet', tabla: 'rTab', escena: 'rEsc' };
  let NIVELES = {};   // se rellena abajo
  function leer() {
    const v = store.get(CLAVE, null), o = { v: 1, ultimo: '', L: {}, hechos: {} };
    if (v && typeof v === 'object') {
      if (RETOS.includes(v.ultimo)) o.ultimo = v.ultimo;
      for (const r of RETOS) {
        if (v.L && Number.isInteger(v.L[r])) o.L[r] = clamp(v.L[r], 0, NIVELES[r].length - 1);
        if (v.hechos && (v.hechos[r] | 0) > 0) o.hechos[r] = v.hechos[r] | 0;
      }
    }
    return o;
  }
  const cambiar = f => { const o = leer(); f(o); store.set(CLAVE, o); return o; };
  const nivelDe = r => leer().L[r] | 0;
  function resuelto(r) { cambiar(o => { o.hechos[r] = (o.hechos[r] | 0) + 1; }); sfx.good(); confetti(); addStar(); }
  function chips(r, box, alElegir) {
    box.innerHTML = ''; const L = nivelDe(r);
    NIVELES[r].forEach((d, i) => { const b = document.createElement('button'); b.className = 'btn pnChip' + (i === L ? ' sel' : ''); b.textContent = i + 1;
      b.setAttribute('aria-label', `Reto ${i + 1}: ${d.n}`); b.onclick = () => { sfx.pop(); cambiar(o => { o.L[r] = i; }); alElegir(); }; box.appendChild(b); });
  }
  // cuadrícula: casillas tan grandes como quepan
  function encajar(el, cols, filas, max = 150) {
    if (!el || !el.offsetParent) return; const cs = getComputedStyle(el), px = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight), py = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const w = el.clientWidth - px, h = el.clientHeight - py;
    const s = Math.floor(Math.min((w - (cols - 1) * 8) / cols, (h - (filas - 1) * 8) / filas, max)); el.style.setProperty('--s', Math.max(s, 46) + 'px'); el.style.setProperty('--cols', cols);
  }

  /* =====================================================================
     PANTALLAS
     ===================================================================== */
  const ILLR = {
    detective: svg(`<rect x="10" y="22" width="34" height="44" rx="8" fill="#fff6d3" stroke="${INK}" stroke-width="4"/><rect x="50" y="22" width="34" height="44" rx="8" fill="#e6f6ff" stroke="${INK}" stroke-width="4"/>
      <path d="M58 36l18 18M76 36L58 54" stroke="#e5484d" stroke-width="6" stroke-linecap="round"/><text x="27" y="56" font-size="30" font-weight="900" text-anchor="middle" fill="#a083ff" font-family="ui-rounded,system-ui,sans-serif">?</text>
      <circle cx="78" cy="84" r="20" fill="#efe6ff" stroke="${INK}" stroke-width="5"/><path d="M92 98l14 14" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`),
    tabla: svg(`${[0, 1, 2].map(f => [0, 1, 2].map(c => `<rect x="${14 + c * 32}" y="${14 + f * 32}" width="28" height="28" rx="7" fill="${f === 1 && c === 1 ? '#fff' : ['#ffd6dc', '#fff3c4', '#d6efff'][c]}" stroke="${INK}" stroke-width="3.5" ${f === 1 && c === 1 ? 'stroke-dasharray="5 4"' : ''}/>`).join('')).join('')}
      <circle cx="28" cy="28" r="8" fill="${INK}"/><path d="M60 20l8 14h-16z" fill="${INK}"/><rect x="84" y="20" width="16" height="16" fill="${INK}"/>
      <text x="60" y="68" font-size="22" font-weight="900" text-anchor="middle" fill="#a083ff" font-family="ui-rounded,system-ui,sans-serif">?</text>`),
    escena: svg(`<rect x="10" y="12" width="100" height="96" rx="12" fill="#ffe4c8" stroke="${INK}" stroke-width="4"/><path d="M10 44H110M10 76H110M44 12V108M76 12V108" stroke="${INK}" stroke-width="4"/>
      <circle cx="27" cy="28" r="9" fill="#ff6f7d" stroke="${INK}" stroke-width="3"/><path d="M93 54l7 13H86z" fill="#ffd46b" stroke="${INK}" stroke-width="3"/><rect x="51" y="83" width="18" height="18" rx="4" fill="#6cc8f5" stroke="${INK}" stroke-width="3"/>
      <circle cx="60" cy="60" r="11" fill="#fff" stroke="#ffab73" stroke-width="5" stroke-dasharray="5 4"/>`),
  };
  ILL.retos = svg(`<path d="M34 18H86V44C86 66 74 78 60 80C46 78 34 66 34 44Z" fill="#ffd46b" stroke="${INK}" stroke-width="5"/>
    <path d="M34 26H18C18 46 26 54 36 54M86 26H102C102 46 94 54 84 54" fill="none" stroke="${INK}" stroke-width="5"/>
    <path d="M60 80V94M42 104H78L74 94H46Z" fill="#ffab73" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <text x="60" y="60" font-size="34" font-weight="900" text-anchor="middle" fill="#fff" stroke="${INK}" stroke-width="2" font-family="ui-rounded,system-ui,sans-serif">?</text>`);
  document.getElementById('logros').insertAdjacentHTML('beforebegin', `
<section class="screen pn" id="retos">
  ${barra('m-think', M('Retos'), '<button class="btn" id="reSay" aria-label="Escuchar">🗣️</button>')}
  <div class="reLista" id="reLista"></div>
</section>
<section class="screen pn rt" id="rDet">
  ${barra('retos', M(TITULO.detective), '<button class="btn" id="rdPista" aria-label="Pista">💡</button>')}
  <div class="subbar" id="rdChips"></div>
  <div class="rtWrap">
    <div class="rtArriba"><div class="rtPistas" id="rdPistas"></div><div class="rtPreg" id="rdPreg"></div></div>
    <div class="rtRejilla" id="rdRej"></div>
    <div class="rtAbajo">${texto('rdTexto')}<div class="rtBotones">${boton('rdTachar', 'tachar', 'Tachar')}${boton('rdEs', 'es', '¡Es este!', 'rtSi')}${boton('rdOtro', 'otro', 'Otro', 'rtSi')}</div></div>
  </div>
</section>
<section class="screen pn rt" id="rTab">
  ${barra('retos', M(TITULO.tabla), '<button class="btn" id="rtPista" aria-label="Pista">💡</button>')}
  <div class="subbar" id="rtChips"></div>
  <div class="rtWrap">
    <div class="rtRejilla rtTabla" id="rtRej"></div>
    <div class="rtBandeja" id="rtBandeja"></div>
    <div class="rtAbajo">${texto('rtTexto')}<div class="rtBotones">${boton('rtComp', 'comprobar', 'Comprobar', 'rtSi')}${boton('rtOtro', 'otro', 'Otro', 'rtSi')}</div></div>
  </div>
</section>
<section class="screen pn rt" id="rEsc">
  ${barra('retos', M(TITULO.escena), '<button class="btn" id="rePista" aria-label="Volver a mirar">💡</button>')}
  <div class="subbar" id="reChips"></div>
  <div class="rtWrap">
    <div class="rtRejilla rtEstante" id="reRej"></div>
    <div class="rtBandeja" id="reBandeja"></div>
    <div class="rtAbajo">${texto('reTexto')}<div class="rtBotones">${boton('reYa', 'ojo', '¡Ya!', 'rtSi')}${boton('reComp', 'comprobar', 'Comprobar', 'rtSi')}${boton('reOtro', 'otro', 'Otro', 'rtSi')}</div></div>
  </div>
</section>`);
  ['rdTexto', 'rtTexto', 'reTexto'].forEach(id => { $('#' + id).onclick = () => { if (VOZ['#' + id]) say(VOZ['#' + id]); }; });
  // tocar el título de la barra dice el nombre del reto
  RETOS.forEach(r => { const t = $(`#${PANT[r]} .bar .title`); if (t) { t.style.cursor = 'pointer'; t.onclick = () => say(NOMBRES[r]); } });
  $$('#m-think .menu').forEach(m => m.insertAdjacentHTML('beforeend', '<button class="big c1" data-go="retos"><span class="ill" data-ill="retos"></span>' + M('Retos') + '</button>'));
  paintIll();
  const ver = (id, si) => { $(id).hidden = !si; };

  /* ---------- elegir reto ---------- */
  function lista() {
    const o = leer(), box = $('#reLista'); box.innerHTML = '';
    RETOS.forEach(r => {
      const c = document.createElement('div'); c.className = 'reCarta' + (o.ultimo === r ? ' ultimo' : '');
      c.innerHTML = `<button class="btn reAbrir" aria-label="${NOMBRES[r]}">${ILLR[r]}<span>${M(NOMBRES[r])}</span>${o.hechos[r] ? `<i class="reHechos">${o.hechos[r]}</i>` : ''}</button><div class="reNiv"></div>`;
      c.querySelector('.reAbrir').onclick = () => { sfx.pop(); go(PANT[r]); };
      chips(r, c.querySelector('.reNiv'), () => go(PANT[r]));
      box.appendChild(c);
    });
  }
  $('#reSay').onclick = () => say('Elige un reto. Los números son los niveles. Empieza por el que quieras.');
  onShow.retos = () => { showStars(); lista(); setTimeout(() => { if (current === 'retos') say('Elige un reto y su nivel.'); }, 300); };
  const entrar = r => cambiar(o => { o.ultimo = r; });

  /* =====================================================================
     1. ¿QUIÉN SE ESCONDE?
     ===================================================================== */
  NIVELES.detective = [
    { n: '8 sospechosos y 3 pistas (una de «no» y una de cuántos)', cartas: 8, cols: 4, pistas: ['noK', 'c', 'cmp'] },
    { n: '12 sospechosos y 4 pistas (con «a su lado» o «encima»)', cartas: 12, cols: 4, pistas: ['noC', 'cmp', 'rel', 'noK'] },
    { n: 'Tú preguntas: elige qué preguntar para descartar', cartas: 12, cols: 4, preguntar: true },
  ];
  function tablero(N, cols) {
    const ks = mezclar(KINDS).slice(0, 3), cs = mezclar([0, 1, 2, 3, 4]).slice(0, 3), todas = [];
    ks.forEach(k => cs.forEach(c => [1, 2, 3].forEach(n => todas.push({ k, c, n }))));
    return { ks, cs, cols, cartas: mezclar(todas).slice(0, N).map((t, i) => ({ ...t, i, f: Math.floor(i / cols), col: i % cols })) };
  }
  const vecinos = (T, t, rel) => rel === 'lado' ? T.cartas.filter(u => u.f === t.f && Math.abs(u.col - t.col) === 1) : T.cartas.filter(u => u.col === t.col && u.f === t.f - 1);
  function cumple(T, t, p) {
    switch (p.t) {
      case 'k': return t.k === p.v; case 'noK': return t.k !== p.v; case 'c': return t.c === p.v; case 'noC': return t.c !== p.v;
      case 'mas': return t.n > p.v; case 'menos': return t.n < p.v; case 'n': return t.n === p.v;
      case 'lado': case 'encima': return vecinos(T, t, p.t).some(u => u.k === p.v);
    }
    return false;
  }
  function pistaDe(T, sol, t) {
    if (t === 'k') return { t, v: sol.k }; if (t === 'c') return { t, v: sol.c };
    if (t === 'noK') return { t, v: pick(T.ks.filter(k => k !== sol.k)) }; if (t === 'noC') return { t, v: pick(T.cs.filter(c => c !== sol.c)) };
    if (t === 'cmp') { const op = []; for (let v = 1; v < sol.n; v++) op.push({ t: 'mas', v }); for (let v = sol.n + 1; v <= 3; v++) op.push({ t: 'menos', v }); return pick(op); }
    if (t === 'rel') { const op = []; vecinos(T, sol, 'lado').forEach(u => op.push({ t: 'lado', v: u.k })); vecinos(T, sol, 'encima').forEach(u => op.push({ t: 'encima', v: u.k })); return op.length ? pick(op) : null; }
    return null;
  }
  function crearDet(L) {
    const D = NIVELES.detective[L];
    for (let i = 0; i < 6000; i++) {
      const T = tablero(D.cartas, D.cols), sol = pick(T.cartas);
      if (D.preguntar) return { T, sol, D, pistas: [] };
      const pistas = D.pistas.map(t => pistaDe(T, sol, t));
      if (pistas.some(p => !p) || !pistas.every(p => cumple(T, sol, p))) continue;
      if (T.cartas.filter(t => pistas.every(p => cumple(T, t, p))).length !== 1) continue;                       // una sola respuesta
      if (pistas.some(p => T.cartas.filter(t => cumple(T, t, p)).length < 3)) continue;                           // ninguna pista sola la adivina
      if (pistas.some(p => T.cartas.filter(t => pistas.every(q => q === p || cumple(T, t, q))).length < 2)) continue; // todas hacen falta
      return { T, sol, D, pistas };
    }
    throw new Error('sin caso');
  }
  // dibujo de una pista o pregunta (sin texto): marca = 'si' | 'no' | 'preg'
  const gota = c => `<svg viewBox="0 0 100 100"><path d="M50 8C66 34 82 50 82 66a32 32 0 0 1-64 0C18 50 34 34 50 8Z" fill="${COL[c].c}" stroke="${INK}" stroke-width="5"/></svg>`;
  const puntitos = (n, signo) => `<svg viewBox="0 0 100 100">${Array.from({ length: n }, (_, i) => `<circle cx="${50 + (i - (n - 1) / 2) * 24}" cy="${signo ? 40 : 50}" r="10" fill="${INK}"/>`).join('')}
    ${signo === '+' ? '<path d="M50 62V92M35 77H65" stroke="#2b9a66" stroke-width="10" stroke-linecap="round"/>' : signo === '-' ? '<path d="M35 77H65" stroke="#e5484d" stroke-width="10" stroke-linecap="round"/>' : ''}</svg>`;
  const caja = (x, y, w, h, dentro) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/>${dentro}`;
  function relacion(t, k) {   // [?] junto a / debajo de [la cosa]
    const sil = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" class="rtSilG">${svgK(k).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`;
    const q = (x, y) => `<text x="${x}" y="${y}" font-size="30" font-weight="900" text-anchor="middle" fill="#a083ff" font-family="ui-rounded,system-ui,sans-serif">?</text>`;
    return t === 'lado' ? `<svg viewBox="0 0 100 100">${caja(4, 28, 44, 44, q(26, 61))}${caja(52, 28, 44, 44, sil(55, 31, .38))}</svg>`
      : `<svg viewBox="0 0 100 100">${caja(28, 4, 44, 44, sil(31, 7, .38))}${caja(28, 52, 44, 44, q(50, 85))}</svg>`;
  }
  function dibujoPista(p, marca) {
    let d;
    if (p.t === 'k' || p.t === 'noK') d = `<span class="qnSil">${svgK(p.v)}</span>`;
    else if (p.t === 'c' || p.t === 'noC') d = gota(p.v);
    else if (p.t === 'mas') d = puntitos(p.v, '+'); else if (p.t === 'menos') d = puntitos(p.v, '-'); else if (p.t === 'n') d = puntitos(p.v);
    else d = relacion(p.t, p.v);
    const m = marca === 'preg' ? PREG : marca === 'no' || p.t.startsWith('no') ? NO : SI;
    return `${d}${m}`;
  }
  // frase de voz (minúsculas normales) y texto corto para leer (se muestra en MAYÚSCULAS)
  function vozPista(p, si = true) {
    const N = () => nombre(p.v), C = () => COL[p.v].n;
    if (si) switch (p.t) {
      case 'k': return `Es ${N()}.`; case 'noK': return `No es ${N()}.`; case 'c': return `Es de color ${C()}.`; case 'noC': return `No es de color ${C()}.`;
      case 'mas': return `Hay más de ${NUM[p.v]}.`; case 'menos': return `Hay menos de ${NUM[p.v]}.`; case 'n': return `Hay ${NUM[p.v]}.`;
      case 'lado': return `A su lado hay ${N()}.`; case 'encima': return `Justo encima tiene ${N()}.`;
    }
    switch (p.t) {
      case 'k': return `No es ${N()}.`; case 'c': return `No es de color ${C()}.`; case 'mas': return `No hay más de ${NUM[p.v]}.`; case 'lado': return `A su lado no hay ${N()}.`;
    }
    return 'No.';
  }
  function capPista(p, si = true) {
    const K = () => DB[p.v].s, C = () => COL[p.v].n;
    if (si) switch (p.t) {
      case 'k': return `Es ${K()}`; case 'noK': return `No es ${K()}`; case 'c': return `Es ${C()}`; case 'noC': return `No es ${C()}`;
      case 'mas': return `Más de ${p.v}`; case 'menos': return `Menos de ${p.v}`; case 'n': return `Hay ${p.v}`;
      case 'lado': return `${K()} al lado`; case 'encima': return `${K()} encima`;
    }
    switch (p.t) { case 'k': return `No es ${K()}`; case 'c': return `No es ${C()}`; case 'mas': return `No más de ${p.v}`; case 'lado': return `Sin ${K()} al lado`; }
    return 'No';
  }
  function vozPregunta(q) {
    switch (q.t) { case 'k': return `¿Es ${nombre(q.v)}?`; case 'c': return `¿Es de color ${COL[q.v].n}?`; case 'mas': return `¿Hay más de ${NUM[q.v]}?`; case 'lado': return `¿Tiene ${nombre(q.v)} al lado?`; }
    return '';
  }
  function capPregunta(q) {
    switch (q.t) { case 'k': return `¿${DB[q.v].s}?`; case 'c': return `¿${COL[q.v].n}?`; case 'mas': return `¿Más de ${q.v}?`; case 'lado': return `¿${DB[q.v].s} al lado?`; }
    return '';
  }
  const tarjetaPista = (p, marca, cap, extra = '') => `<span class="qnPista">${dibujoPista(p, marca)}</span><b class="rtCap">${M(cap)}</b>${extra}`;
  const preguntas = T => [...T.ks.map(v => ({ t: 'k', v })), ...T.cs.map(v => ({ t: 'c', v })), { t: 'mas', v: 1 }, { t: 'mas', v: 2 }, ...T.ks.map(v => ({ t: 'lado', v }))];

  const dt = { caso: null, turno: 0, sel: -1, tachadas: new Set(), resp: [], ayudas: 0, pistaSig: 0, hecho: false, fallos: 0 };
  const encajarDet = () => dt.caso && encajar($('#rdRej'), dt.caso.D.cols, Math.ceil(dt.caso.D.cartas / dt.caso.D.cols), 130);
  function rondaDet() {
    const t = ++dt.turno, L = nivelDe('detective'); entrar('detective'); chips('detective', $('#rdChips'), rondaDet);
    const caso = dt.caso = crearDet(L); Object.assign(dt, { sel: -1, tachadas: new Set(), resp: [], ayudas: 0, pistaSig: 0, hecho: false, fallos: 0 });
    $('#rDet').classList.toggle('preguntar', !!caso.D.preguntar);
    pintarPistas(); pintarPreguntas();
    const rej = $('#rdRej'); rej.innerHTML = '';
    caso.T.cartas.forEach((c, i) => { const b = document.createElement('button'); b.className = 'rtCarta'; b.dataset.i = i; b.innerHTML = cosas(c.k, c.c, c.n);
      b.setAttribute('aria-label', `${NUM[c.n]} ${c.n > 1 ? DB[c.k].p : DB[c.k].s}, ${COL[c.c].n}`); b.onclick = () => elegirCarta(i); rej.appendChild(b); });
    ver('#rdTachar', true); ver('#rdEs', true); ver('#rdOtro', false); botonesDet();
    habla('#rdTexto', caso.D.preguntar ? 'Pregunta y tacha.' : '¿Quién se esconde?', null);
    setTimeout(() => { if (t !== dt.turno) return;
      if (caso.D.preguntar) habla('#rdTexto', 'Pregunta y tacha.', 'Se ha escondido uno. Toca una pregunta. Te digo sí o no. Luego tacha los que no pueden ser. Usa pocas preguntas.');
      else habla('#rdTexto', '¿Quién se esconde?', 'Se ha escondido uno. Pistas: ' + caso.pistas.map(p => vozPista(p)).join(' ') + ' Tacha los que no pueden ser.'); }, 300);
    requestAnimationFrame(encajarDet); setTimeout(encajarDet, 120);
  }
  function pintarPistas() {   // las pistas (en «Tú preguntas», las respuestas se quedan en su pregunta)
    const box = $('#rdPistas'), caso = dt.caso; box.innerHTML = ''; if (caso.D.preguntar) return;
    caso.pistas.forEach((p, i) => { const e = document.createElement('button'); e.className = 'rtPista'; e.innerHTML = tarjetaPista(p, '', capPista(p)); e.setAttribute('aria-label', vozPista(p));
      e.onclick = () => say(vozPista(p)); box.appendChild(e); });
  }
  function pintarPreguntas() {
    const box = $('#rdPreg'); box.innerHTML = ''; if (!dt.caso.D.preguntar) return;
    preguntas(dt.caso.T).forEach(q => { const b = document.createElement('button'); b.className = 'btn rtPista rtQ'; b.innerHTML = tarjetaPista(q, 'preg', capPregunta(q)); b.setAttribute('aria-label', vozPregunta(q));
      b.onclick = () => preguntar(q, b); box.appendChild(b); });
    // en horizontal no cabe una fila de botones: «Tachar», «¡Es este!» y «Otro» van en la casilla libre de las preguntas
    const hueco = document.createElement('div'); hueco.className = 'rtPregBotones';
    ['rdTachar', 'rdEs', 'rdOtro'].forEach(id => { const o = $('#' + id), c = document.createElement('button'); c.className = 'btn rtMini ' + o.className.replace('btn rtBtn', '').trim(); c.dataset.de = id;
      c.innerHTML = o.innerHTML; c.setAttribute('aria-label', o.getAttribute('aria-label')); c.onclick = () => o.click(); hueco.appendChild(c); });
    box.appendChild(hueco); copiarBotones();
  }
  function copiarBotones() { $$('#rdPreg .rtMini').forEach(c => { const o = $('#' + c.dataset.de); c.hidden = o.hidden; c.disabled = o.disabled; }); }
  new MutationObserver(copiarBotones).observe($('#rDet .rtBotones'), { attributes: true, subtree: true, attributeFilter: ['hidden', 'disabled'] });
  function preguntar(q, b) {
    if (dt.hecho) return;
    if (b.classList.contains('hecha')) { const r = dt.resp.find(r => r.b === b); say(vozPista(r.q, r.si)); return; }   // ya preguntada: la repite
    sfx.pop(); const si = cumple(dt.caso.T, dt.caso.sol, q); dt.resp.push({ q, si, b });
    b.classList.add('hecha', si ? 'si' : 'no'); b.innerHTML = tarjetaPista(q, si ? 'si' : 'no', capPista(q, si)); b.setAttribute('aria-label', vozPista(q, si));
    habla('#rdTexto', si ? '¡Sí! Ahora, tacha.' : 'No. Ahora, tacha.', vozPregunta(q) + ' ' + (si ? '¡Sí!' : 'No.') + ' Ahora tacha los que no pueden ser.');
  }
  function botonesDet() { $('#rdTachar').disabled = dt.sel < 0 || dt.hecho; $('#rdEs').disabled = dt.sel < 0 || dt.hecho || dt.tachadas.has(dt.sel); }
  function elegirCarta(i) {
    if (dt.hecho) return; sfx.pop(); dt.sel = dt.sel === i ? -1 : i;
    $$('#rdRej .rtCarta').forEach((b, j) => b.classList.toggle('sel', j === dt.sel)); botonesDet();
  }
  $('#rdTachar').onclick = () => {   // tachar o destachar: es su herramienta para pensar; se puede deshacer
    if (dt.sel < 0 || dt.hecho) return; const i = dt.sel, b = $$('#rdRej .rtCarta')[i]; sfx.pop();
    if (dt.tachadas.has(i)) { dt.tachadas.delete(i); b.classList.remove('tachada'); } else { dt.tachadas.add(i); b.classList.add('tachada'); }
    dt.sel = -1; b.classList.remove('sel'); botonesDet();
    const quedan = dt.caso.T.cartas.filter((_, j) => !dt.tachadas.has(j)).length; if (quedan === 1) habla('#rdTexto', '¡Solo queda uno!', 'Solo queda uno. ¿Es ese? Tócalo y pulsa la lupa.');
  };
  $('#rdEs').onclick = () => {
    if (dt.sel < 0 || dt.hecho) return; const i = dt.sel, c = dt.caso.T.cartas[i], b = $$('#rdRej .rtCarta')[i];
    if (c === dt.caso.sol) {
      dt.hecho = true; b.classList.add('ok'); resuelto('detective'); botonesDet(); ver('#rdTachar', false); ver('#rdEs', false); ver('#rdOtro', true);
      const n = dt.resp.length;
      if (dt.caso.D.preguntar) habla('#rdTexto', `¡Lo encontraste! ${n} ${n === 1 ? 'pregunta' : 'preguntas'}.`, `¡Lo encontraste con ${NUM[n] || n} ${n === 1 ? 'pregunta' : 'preguntas'}!` + (n <= 4 ? ' ¡Muy buenas preguntas!' : ''));
      else habla('#rdTexto', '¡Lo encontraste!', '¡Lo encontraste! Cumple todas las pistas: ' + dt.caso.pistas.map(p => vozPista(p)).join(' '));
      return;
    }
    // no es: se explica por qué (sin quitar nada) y se tacha
    dt.fallos++; sfx.bad(); dt.tachadas.add(i); b.classList.add('tachada'); b.classList.remove('sel'); dt.sel = -1; botonesDet();
    if (dt.caso.D.preguntar) {
      const r = dt.resp.find(r => cumple(dt.caso.T, c, r.q) !== r.si);
      if (r) { habla('#rdTexto', 'Ese no. Mira esta.', 'Ese no puede ser. Mira esta respuesta: ' + vozPista(r.q, r.si)); marcarPista(dt.resp.indexOf(r)); }
      else habla('#rdTexto', 'No es ese. Pregunta.', 'No es ese. Haz otra pregunta.');
    } else { const k = dt.caso.pistas.findIndex(p => !cumple(dt.caso.T, c, p)); habla('#rdTexto', 'Ese no. Mira esta pista.', 'Ese no puede ser. Mira esta pista: ' + vozPista(dt.caso.pistas[k])); marcarPista(k); }
  };
  function marcarPista(i) {
    const e = dt.caso.D.preguntar ? (dt.resp[i] && dt.resp[i].b) : $$('#rdPistas .rtPista')[i]; if (!e) return;
    e.classList.add('mira'); setTimeout(() => e.classList.remove('mira'), 2400);
  }
  // 💡 primero señala la pista que más descarta; si se vuelve a pedir, tacha los que no la cumplen
  $('#rdPista').onclick = () => {
    if (dt.hecho || !dt.caso) return; dt.ayudas++; sfx.pop(); const T = dt.caso.T, vivas = T.cartas.filter((_, j) => !dt.tachadas.has(j));
    const sugerir = (q, antes = '') => { const b = [...$$('#rdPreg .rtQ')].find(x => x.getAttribute('aria-label') === vozPregunta(q));
      if (b) { b.classList.add('mira'); setTimeout(() => b.classList.remove('mira'), 2600); } habla('#rdTexto', 'Pregunta esta.', antes + 'Prueba a preguntar esto: ' + vozPregunta(q)); };
    if (dt.caso.D.preguntar && !dt.resp.length) { sugerir(mejorPregunta(vivas)); return; }
    const lista = dt.caso.D.preguntar ? dt.resp.map(r => ({ f: t => cumple(T, t, r.q) === r.si, v: vozPista(r.q, r.si) })) : dt.caso.pistas.map(p => ({ f: t => cumple(T, t, p), v: vozPista(p) }));
    let mejor = -1, m = 0; lista.forEach((x, i) => { const n = vivas.filter(t => !x.f(t)).length; if (n > m) { m = n; mejor = i; } });
    if (mejor < 0) {
      if (dt.caso.D.preguntar) { if (vivas.length === 1) habla('#rdTexto', '¡Solo queda uno!', 'Solo queda uno: ¡elígelo!'); else sugerir(mejorPregunta(vivas), 'Ya has tachado bien. '); }
      else habla('#rdTexto', '¿Cuál queda?', 'Ya has tachado todos los que no pueden ser. ¿Cuál queda?');
      return;
    }
    marcarPista(mejor);
    if (dt.pistaSig === mejor + 1) {   // segunda vez con la misma: tacha por ella
      T.cartas.forEach((t, j) => { if (!lista[mejor].f(t) && !dt.tachadas.has(j)) { dt.tachadas.add(j); $$('#rdRej .rtCarta')[j].classList.add('tachada'); } });
      habla('#rdTexto', 'Tacho los que no.', 'Tacho los que no cumplen: ' + lista[mejor].v); dt.pistaSig = 0;
    } else { habla('#rdTexto', 'Mira esta pista.', 'Fíjate en esta: ' + lista[mejor].v + ' ¿Cuáles no la cumplen? Si quieres, pide pista otra vez y los tacho.'); dt.pistaSig = mejor + 1; }
  };
  function mejorPregunta(vivas) {   // la que parte a los que quedan más por la mitad
    const T = dt.caso.T, hechas = new Set(dt.resp.map(r => r.q.t + r.q.v)); let mejor = null, d = 1e9;
    preguntas(T).forEach(q => { if (hechas.has(q.t + q.v)) return; const si = vivas.filter(t => cumple(T, t, q)).length, x = Math.abs(si - (vivas.length - si)); if (si && si < vivas.length && x < d) { d = x; mejor = q; } });
    return mejor || preguntas(T)[0];
  }
  $('#rdOtro').onclick = () => { sfx.pop(); rondaDet(); };
  onShow.rDet = () => { showStars(); rondaDet(); };
  onLeave.rDet = () => { dt.turno++; };

  /* =====================================================================
     2. LA TABLA DE DOS REGLAS
     ===================================================================== */
  NIVELES.tabla = [
    { n: 'filas: qué es · columnas: color (3 huecos)', tipo: 'kc', huecos: 3 },
    { n: 'filas: qué es · columnas: cuántos (4 huecos)', tipo: 'kn', huecos: 4 },
    { n: 'cada cosa una vez en cada fila y columna · color por fila', tipo: 'latino', huecos: 4 },
    { n: 'ordenar el final de la fila (dos reglas que se repiten)', tipo: 'serie', huecos: 3 },
  ];
  const igual = (a, b) => a && b && a.k === b.k && a.c === b.c && a.n === b.n;
  const kPieza = p => p.k + p.c + p.n;
  function crearTabla(L) {
    const D = NIVELES.tabla[L], ks = mezclar(KINDS).slice(0, 3), cs = mezclar([0, 1, 2, 3, 4]).slice(0, 3);
    let filas = 3, cols = 3, celdas = [], huecos = [], regla;
    if (D.tipo === 'kc') { celdas = [0, 1, 2].flatMap(f => [0, 1, 2].map(c => ({ k: ks[f], c: cs[c], n: 1 }))); regla = { fila: f => `En esta fila todos son ${DB[ks[f]].p}.`, col: c => `En esta columna todos son de color ${COL[cs[c]].n}.`, tf: f => `Fila: ${DB[ks[f]].p}`, tc: c => `Columna: ${COL[cs[c]].n}` }; }
    if (D.tipo === 'kn') { const ns = mezclar([1, 2, 3]), c0 = pick(cs); celdas = [0, 1, 2].flatMap(f => [0, 1, 2].map(c => ({ k: ks[f], c: c0, n: ns[c] }))); regla = { fila: f => `En esta fila todos son ${DB[ks[f]].p}.`, col: c => `En esta columna siempre hay ${NUM[ns[c]]}.`, tf: f => `Fila: ${DB[ks[f]].p}`, tc: c => `Columna: ${ns[c]}` }; }
    if (D.tipo === 'latino') {
      const pf = mezclar([0, 1, 2]), pc = mezclar([0, 1, 2]); celdas = [0, 1, 2].flatMap(f => [0, 1, 2].map(c => ({ k: ks[(pf[f] + pc[c]) % 3], c: cs[f], n: 1 })));
      regla = { fila: f => `En cada fila hay ${nombre(ks[0])}, ${nombre(ks[1])} y ${nombre(ks[2])}, sin repetir. Y todos son de color ${COL[cs[f]].n}.`, col: () => 'En cada columna tampoco se repite ninguno.', tf: f => `Fila: ${COL[cs[f]].n}, sin repetir`, tc: () => 'Columna: sin repetir' };
    }
    if (D.tipo === 'serie') {
      filas = 1; cols = 6; const c2 = cs.slice(0, 2); celdas = Array.from({ length: 6 }, (_, i) => ({ k: ks[i % 3], c: c2[i % 2], n: 1 })); huecos = [3, 4, 5];
      regla = { fila: () => `Las cosas se repiten de tres en tres: ${nombre(ks[0])}, ${nombre(ks[1])}, ${nombre(ks[2])}.`, col: () => `Y los colores, de dos en dos: ${COL[c2[0]].n}, ${COL[c2[1]].n}, ${COL[c2[0]].n}.`, tf: () => 'Cosas: de 3 en 3', tc: () => 'Colores: de 2 en 2' };
    }
    if (!huecos.length) {   // huecos interiores: siempre el centro; en el latino, que solo haya una manera de llenarlos
      for (let n = 0; n < 500; n++) { huecos = [4, ...mezclar([0, 1, 2, 3, 5, 6, 7, 8]).slice(0, D.huecos - 1)].sort((a, b) => a - b);
        if (D.tipo !== 'latino' || unicoLatino(celdas, huecos, ks)) break; }
    }
    // la bandeja: lo que falta y piezas que casi valen (aciertan una regla y fallan la otra)
    const buenas = huecos.map(h => celdas[h]), trampas = [];
    buenas.forEach(p => { const op = [{ ...p, c: pick(cs.filter(c => c !== p.c)) }, { ...p, k: pick(ks.filter(k => k !== p.k)) }];
      if (D.tipo === 'kn') op.push({ ...p, n: pick([1, 2, 3].filter(n => n !== p.n)) }); trampas.push(...op); });
    const vistas = new Set(buenas.map(kPieza)), extra = [];
    const meter = p => { if (!vistas.has(kPieza(p)) && extra.length < Math.max(3, D.huecos)) { vistas.add(kPieza(p)); extra.push(p); } };
    mezclar(trampas).forEach(meter);
    // si las trampas coinciden con piezas buenas, se completa con otras parecidas (misma familia de cosas y colores)
    mezclar(ks.flatMap(k => cs.flatMap(c => (D.tipo === 'kn' ? [1, 2, 3] : [1]).map(n => ({ k, c, n }))))).forEach(meter);
    const bandeja = mezclar([...buenas, ...extra]).map((p, i) => ({ ...p, id: i }));
    return { D, filas, cols, celdas, huecos, bandeja, regla };
  }
  function unicoLatino(celdas, huecos, ks) {
    let n = 0; const rec = (i, sol) => { if (n > 1) return; if (i === huecos.length) { n++; return; }
      for (const k of ks) { const c = celdas.map((x, j) => sol[j] ? sol[j] : (huecos.includes(j) ? null : x)), h = huecos[i]; const f = Math.floor(h / 3), col = h % 3;
        const fila = [0, 1, 2].map(x => c[f * 3 + x]).filter(Boolean).map(x => x.k), colm = [0, 1, 2].map(x => c[x * 3 + col]).filter(Boolean).map(x => x.k);
        if (fila.includes(k) || colm.includes(k)) continue; rec(i + 1, { ...sol, [h]: { k } }); } };
    rec(0, {}); return n === 1;
  }
  const tb = { caso: null, turno: 0, puestas: {}, sel: -1, ayudas: 0, hecho: false, pista: 0 };
  function rondaTabla() {
    const t = ++tb.turno, L = nivelDe('tabla'); entrar('tabla'); chips('tabla', $('#rtChips'), rondaTabla);
    const caso = tb.caso = crearTabla(L); Object.assign(tb, { puestas: {}, sel: -1, ayudas: 0, hecho: false, pista: 0 });
    $('#rTab').classList.toggle('serie', caso.D.tipo === 'serie');
    pintarTabla(); ver('#rtComp', true); ver('#rtOtro', false); botonesTabla();
    const txt = caso.D.tipo === 'serie' ? 'Termina la fila.' : 'Toca una pieza. Luego, su hueco.';
    habla('#rtTexto', txt, null);
    setTimeout(() => { if (t !== tb.turno) return;
      habla('#rtTexto', txt, caso.D.tipo === 'serie' ? 'Termina la fila. Hay dos reglas a la vez: una para las cosas y otra para los colores. Toca una pieza. Luego, su hueco. Al final, comprueba.'
        : caso.D.tipo === 'latino' ? 'Rellena los huecos. En cada fila y en cada columna, nada se repite. Y cada fila tiene su color. Toca una pieza. Luego, su hueco. Al final, comprueba.'
          : 'Rellena los huecos. Mira las filas y las columnas: cada una tiene su regla. Toca una pieza. Luego, su hueco. Al final, comprueba.'); }, 300);
    requestAnimationFrame(ajustarTabla); setTimeout(ajustarTabla, 120);
  }
  const apaisado = () => matchMedia('(orientation:landscape) and (max-height:600px)').matches;
  function ajustarTabla() {   // primero la bandeja (en horizontal, una sola fila de piezas de 56 px) y luego la tabla con el sitio que queda
    if (!tb.caso) return; $('#rtBandeja').style.setProperty('--s', apaisado() ? '56px' : '72px'); encajar($('#rtRej'), tb.caso.cols, tb.caso.filas, 120); }
  function pintarTabla() {
    const c = tb.caso, rej = $('#rtRej'); rej.innerHTML = '';
    c.celdas.forEach((x, i) => { const hueco = c.huecos.includes(i), d = document.createElement(hueco ? 'button' : 'div'); d.className = 'rtCarta rtCelda' + (hueco ? ' hueco' : ''); d.dataset.i = i;
      const p = tb.puestas[i]; d.innerHTML = hueco ? (p ? cosas(p.k, p.c, p.n) : '<b>?</b>') : cosas(x.k, x.c, x.n);
      if (hueco) { d.classList.toggle('lleno', !!p); d.onclick = () => tocarHueco(i); d.setAttribute('aria-label', 'Hueco'); } rej.appendChild(d); });
    const ban = $('#rtBandeja'); ban.innerHTML = ''; const usadas = new Set(Object.values(tb.puestas).map(p => p.id));
    c.bandeja.forEach(p => { if (usadas.has(p.id)) return; const b = document.createElement('button'); b.className = 'rtCarta rtPieza' + (tb.sel === p.id ? ' sel' : ''); b.innerHTML = cosas(p.k, p.c, p.n);
      b.onclick = () => { if (tb.hecho) return; sfx.pop(); tb.sel = tb.sel === p.id ? -1 : p.id; pintarTabla(); }; ban.appendChild(b); });
  }
  function tocarHueco(i) {
    if (tb.hecho) return; sfx.pop();
    if (tb.puestas[i]) { delete tb.puestas[i]; }                                  // quitarla (vuelve a la bandeja)
    if (tb.sel >= 0) { tb.puestas[i] = tb.caso.bandeja.find(p => p.id === tb.sel); tb.sel = -1; }
    pintarTabla(); botonesTabla();
  }
  function botonesTabla() { $('#rtComp').disabled = tb.hecho || Object.keys(tb.puestas).length < tb.caso.huecos.length; }
  function resaltar(i) {   // fila y columna de una casilla
    const c = tb.caso, f = Math.floor(i / c.cols), col = i % c.cols;
    $$('#rtRej .rtCelda').forEach((d, j) => d.classList.toggle('guia', Math.floor(j / c.cols) === f || (c.filas > 1 && j % c.cols === col)));
    setTimeout(() => $$('#rtRej .rtCelda').forEach(d => d.classList.remove('guia')), 3000);
  }
  $('#rtComp').onclick = () => {
    if (tb.hecho) return; const c = tb.caso, mal = c.huecos.filter(h => !igual(tb.puestas[h], c.celdas[h]));
    if (!mal.length) { tb.hecho = true; resuelto('tabla'); $$('#rtRej .hueco').forEach(d => d.classList.add('ok')); ver('#rtComp', false); ver('#rtOtro', true);
      habla('#rtTexto', '¡Todo bien!', '¡Todo bien! Has usado las dos reglas a la vez.'); return; }
    // las que no van vuelven a la bandeja (las buenas se quedan); se explica una
    sfx.bad(); mal.forEach(h => delete tb.puestas[h]); pintarTabla(); botonesTabla();
    mal.forEach(h => { const d = $$('#rtRej .rtCelda')[h]; d.classList.add('mal'); setTimeout(() => d.classList.remove('mal'), 900); });
    const h = mal[0], f = Math.floor(h / c.cols), col = h % c.cols; resaltar(h);
    habla('#rtTexto', `${mal.length === 1 ? '1 no va' : `${mal.length} no van`}. ${c.regla.tf(f)}.`,
      `${mal.length === 1 ? 'Una pieza no va ahí' : `${NUM[mal.length]} piezas no van ahí`}. Las he devuelto. ${c.regla.fila(f)} ${c.regla.col(col)}`);
  };
  // 💡 1.ª: la regla de la fila del primer hueco sin resolver; 2.ª: también la de la columna; 3.ª: pone esa pieza
  $('#rtPista').onclick = () => {
    if (tb.hecho || !tb.caso) return; const c = tb.caso; tb.ayudas++; sfx.pop();
    const h = c.huecos.find(x => !igual(tb.puestas[x], c.celdas[x])); if (h === undefined) { habla('#rtTexto', '¡Comprueba!', 'Todo está puesto. ¡Comprueba!'); return; }
    const f = Math.floor(h / c.cols), col = h % c.cols; resaltar(h); tb.pista++;
    if (tb.pista === 1) habla('#rtTexto', c.regla.tf(f) + '.', c.regla.fila(f) + ' Mira el hueco que brilla.');
    else if (tb.pista === 2) habla('#rtTexto', c.regla.tc(col) + '.', c.regla.fila(f) + ' ' + c.regla.col(col));
    else { const p = c.bandeja.find(p => igual(p, c.celdas[h]) && !Object.values(tb.puestas).some(q => q.id === p.id)) || c.bandeja.find(p => igual(p, c.celdas[h]));
      Object.keys(tb.puestas).forEach(k => { if (tb.puestas[k].id === p.id) delete tb.puestas[k]; }); tb.puestas[h] = p; tb.pista = 0; pintarTabla(); botonesTabla(); habla('#rtTexto', 'Esta va aquí. Sigue tú.', 'Esta va aquí. ¡Sigue tú con las demás!'); }
  };
  $('#rtOtro').onclick = () => { sfx.pop(); rondaTabla(); };
  onShow.rTab = () => { showStars(); rondaTabla(); };
  onLeave.rTab = () => { tb.turno++; };
  addEventListener('resize', () => { if (current === 'rTab') ajustarTabla(); if (current === 'rDet' && dt.caso) encajar($('#rdRej'), dt.caso.D.cols, Math.ceil(dt.caso.D.cartas / dt.caso.D.cols), 130); if (current === 'rEsc') ajustarEsc(); });

  /* =====================================================================
     3. ¿QUÉ HA CAMBIADO?
     ===================================================================== */
  NIVELES.escena = [
    { n: 'una cosa ha cambiado (6 cosas en la estantería)', f: 3, c: 3, obj: 6, cambios: 1 },
    { n: 'dos cosas han cambiado (7 cosas, también colores)', f: 3, c: 4, obj: 7, cambios: 2 },
    { n: 'colócalas donde estaban (5 cosas)', f: 3, c: 3, obj: 5, modo: 'colocar' },
    { n: 'tócalas al revés del orden en que brillan', f: 3, c: 3, obj: 6, modo: 'reves', pasos: 4 },
  ];
  const TODAS = Object.keys(DB), RECOLOR = KINDS;
  const es = { caso: null, turno: 0, fase: '', marcas: new Set(), bien: new Set(), puestas: {}, sel: -1, paso: 0, ayudas: 0, viendo: false, hecho: false };
  function crearEsc(L) {
    const D = NIVELES.escena[L], N = D.f * D.c, ids = mezclar(TODAS).slice(0, D.obj + 3), celdas = Array(N).fill(null);
    mezclar([...Array(N).keys()]).slice(0, D.obj).forEach((p, i) => { celdas[p] = { id: ids[i], col: -1 }; });
    const caso = { D, N, antes: celdas, despues: celdas.map(x => x && { ...x }), cambios: [] };
    if (D.cambios) {
      const usadas = new Set(), libres = () => [...Array(N).keys()].filter(i => !caso.despues[i] && !usadas.has(i) && !caso.antes[i]);
      const llenas = () => [...Array(N).keys()].filter(i => caso.antes[i] && !usadas.has(i));
      const tipos = mezclar(D.cambios > 1 ? ['mover', 'color', 'quitar', 'poner'] : ['mover', 'quitar', 'poner', 'color']);
      for (const t of tipos) { if (caso.cambios.length >= D.cambios) break;
        if (t === 'mover') { const a = pick(llenas()), b = pick(libres()); if (a === undefined || b === undefined) continue; caso.despues[b] = caso.despues[a]; caso.despues[a] = null; usadas.add(a); usadas.add(b); caso.cambios.push({ t, celdas: [a, b], voz: `${nombre(caso.antes[a].id)} se ha cambiado de sitio`, txt: 'Se ha movido' }); }
        if (t === 'quitar') { const a = pick(llenas()); if (a === undefined) continue; caso.despues[a] = null; usadas.add(a); caso.cambios.push({ t, celdas: [a], voz: `ha desaparecido ${nombre(caso.antes[a].id)}`, txt: 'Ha desaparecido' }); }
        if (t === 'poner') { const b = pick(libres()); if (b === undefined) continue; const id = ids.find(x => !caso.antes.some(y => y && y.id === x)); caso.despues[b] = { id, col: -1 }; usadas.add(b); caso.cambios.push({ t, celdas: [b], voz: `ha aparecido ${nombre(id)}`, txt: 'Ha aparecido' }); }
        if (t === 'color') { const a = pick(llenas().filter(i => RECOLOR.includes(caso.antes[i].id))); if (a === undefined) continue; const col = pick([0, 1, 2, 3, 4].filter(c => COL[c].c !== DB[caso.antes[a].id].c));
          caso.despues[a] = { ...caso.antes[a], col }; usadas.add(a); caso.cambios.push({ t, celdas: [a], voz: `${nombre(caso.antes[a].id)} ha cambiado de color`, txt: 'Otro color' }); }
      }
      if (caso.cambios.length < D.cambios) return crearEsc(L);
    }
    if (D.modo === 'reves') { const llenas = [...Array(N).keys()].filter(i => celdas[i]); caso.orden = mezclar(llenas).slice(0, D.pasos); }
    return caso;
  }
  const cosaHTML = x => x ? `<span class="qnCosas n1"><span class="qnCosa">${P2.svgDe(P2.item(x.id, { col: x.col }))}</span></span>` : '';
  function rondaEsc() {
    const t = ++es.turno, L = nivelDe('escena'); entrar('escena'); chips('escena', $('#reChips'), rondaEsc);
    const caso = es.caso = crearEsc(L); Object.assign(es, { fase: 'mirar', marcas: new Set(), bien: new Set(), puestas: {}, sel: -1, paso: 0, ayudas: 0, viendo: false, hecho: false });
    pintarEsc(caso.antes); $('#reBandeja').innerHTML = '';
    ver('#reYa', caso.D.modo !== 'reves'); ver('#reComp', false); ver('#reOtro', false); ver('#rePista', true);
    const txt = caso.D.modo === 'reves' ? 'Mira el orden.' : 'Mira y acuérdate.';
    habla('#reTexto', txt, null);
    setTimeout(() => { if (t !== es.turno) return;
      if (caso.D.modo === 'reves') { habla('#reTexto', txt, 'Mira en qué orden brillan. Luego, tócalos al revés. Empieza por el último.'); setTimeout(() => { if (t === es.turno) brillar(); }, 2200); }
      else habla('#reTexto', txt, caso.D.modo === 'colocar' ? 'Mira dónde está cada cosa. Acuérdate. Cuando estés lista, toca el ojo.' : 'Mira bien la estantería. Acuérdate. Cuando estés lista, toca el ojo.'); }, 300);
    requestAnimationFrame(ajustarEsc); setTimeout(ajustarEsc, 120);
  }
  function ajustarEsc() { if (es.caso) { encajar($('#reRej'), es.caso.D.c, es.caso.D.f, 120); $('#reBandeja').style.setProperty('--s', '72px'); } }
  function pintarEsc(celdas, tapar) {
    const rej = $('#reRej'); rej.innerHTML = '';
    celdas.forEach((x, i) => { const b = document.createElement('button'); b.className = 'rtCarta rtHueco' + (tapar ? ' tapado' : '') + (es.marcas.has(i) ? ' marcada' : '') + (es.bien.has(i) ? ' ok' : '');
      b.innerHTML = tapar ? '' : cosaHTML(x); b.dataset.i = i; b.onclick = () => tocarEsc(i); rej.appendChild(b); });
  }
  function telon(despues) {   // las casillas se cierran un momento y se abren con la escena nueva
    const t = es.turno; pintarEsc(es.caso.antes, true); sfx.pop();
    setTimeout(() => { if (t === es.turno) despues(); }, 900);
  }
  $('#reYa').onclick = () => {
    if (es.fase !== 'mirar') return; const c = es.caso;
    telon(() => {
      if (c.D.cambios) { es.fase = 'buscar'; pintarEsc(c.despues); ver('#reYa', false); ver('#reComp', c.D.cambios > 1); botonesEsc();
        if (c.D.cambios > 1) habla('#reTexto', 'Han cambiado 2 cosas.', 'Han cambiado dos cosas. Tócalas. Luego, comprueba.'); else habla('#reTexto', '¿Qué ha cambiado?', '¿Qué ha cambiado? Toca dónde.'); }
      else { es.fase = 'colocar'; pintarEsc(c.antes.map(() => null)); pintarBandeja(); ver('#reYa', false); ver('#reComp', true); botonesEsc();
        habla('#reTexto', 'Ponlas en su sitio.', 'Ponlas donde estaban. Toca una cosa. Luego, su sitio. Al final, comprueba.'); }
    });
  };
  function botonesEsc() { const c = es.caso; $('#reComp').disabled = es.hecho || (c.D.cambios > 1 ? es.marcas.size < c.D.cambios : c.D.modo === 'colocar' ? Object.keys(es.puestas).length < c.D.obj : true); }
  function pintarBandeja() {
    const c = es.caso, ban = $('#reBandeja'); ban.innerHTML = ''; const usadas = new Set(Object.values(es.puestas));
    c.antes.forEach((x, i) => { if (!x || usadas.has(i)) return; const b = document.createElement('button'); b.className = 'rtCarta rtPieza' + (es.sel === i ? ' sel' : ''); b.innerHTML = cosaHTML(x);
      b.onclick = () => { if (es.hecho) return; sfx.pop(); es.sel = es.sel === i ? -1 : i; pintarBandeja(); }; ban.appendChild(b); });
  }
  function pintarColocadas() { const c = es.caso; pintarEsc(c.antes.map(() => null));
    Object.entries(es.puestas).forEach(([pos, de]) => { $$('#reRej .rtHueco')[pos].innerHTML = cosaHTML(c.antes[de]); }); es.bien.forEach(i => $$('#reRej .rtHueco')[i].classList.add('ok')); }
  function tocarEsc(i) {
    const c = es.caso; if (es.hecho || es.viendo) return;
    if (es.fase === 'buscar') {
      const cambio = c.cambios.find(x => x.celdas.includes(i));
      if (c.D.cambios === 1) {
        if (cambio) { es.hecho = true; es.bien.add(i); pintarEsc(c.despues); resuelto('escena'); fin('¡Sí! ' + cambio.txt + '.', '¡Sí! ' + cambio.voz.charAt(0).toUpperCase() + cambio.voz.slice(1) + '.'); }
        else { sfx.bad(); habla('#reTexto', 'Ahí no cambió nada.', 'Ahí no ha cambiado nada. Si quieres, toca la bombilla para volver a mirar.'); const b = $$('#reRej .rtHueco')[i]; b.classList.add('mal'); setTimeout(() => b.classList.remove('mal'), 900); }
        return;
      }
      sfx.pop(); if (es.marcas.has(i)) es.marcas.delete(i); else if (es.marcas.size < c.D.cambios) es.marcas.add(i); pintarEsc(c.despues); botonesEsc(); return;
    }
    if (es.fase === 'colocar') {
      sfx.pop(); if (es.bien.has(i)) return;
      if (es.puestas[i] !== undefined) delete es.puestas[i];
      if (es.sel >= 0) { es.puestas[i] = es.sel; es.sel = -1; }
      pintarColocadas(); pintarBandeja(); botonesEsc(); return;
    }
    if (es.fase === 'reves') {
      const esperado = c.orden[c.orden.length - 1 - es.paso];
      if (i === esperado) { es.paso++; tone(400 + es.paso * 70, .14, 'triangle', .1); const b = $$('#reRej .rtHueco')[i]; b.classList.add('ok');
        if (es.paso === c.orden.length) { es.hecho = true; resuelto('escena'); fin('¡Al revés! ¡Muy bien!', '¡Al revés y sin equivocarte de orden! ¡Muy bien!'); }
        else habla('#reTexto', '¡Sí! ¿Y antes?', '¡Sí! ¿Y antes?'); }
      else { sfx.bad(); if (c.orden.includes(i)) habla('#reTexto', 'Ese no toca ahora.', 'Ese brilló, pero no toca ahora. ¿Cuál brilló justo antes?'); else habla('#reTexto', 'Ese no brilló.', 'Ese no brilló. Si quieres, toca la bombilla y lo vuelvo a enseñar.'); }
    }
  }
  $('#reComp').onclick = () => {
    const c = es.caso; if (es.hecho) return;
    if (es.fase === 'buscar') {
      const buenas = [...es.marcas].filter(i => c.cambios.some(x => x.celdas.includes(i))), cambiosOk = c.cambios.filter(x => x.celdas.some(i => es.marcas.has(i)));
      if (cambiosOk.length === c.D.cambios) { es.hecho = true; buenas.forEach(i => es.bien.add(i)); pintarEsc(c.despues); resuelto('escena'); fin('¡Las dos!', '¡Las dos! ' + c.cambios.map(x => x.voz).join(' y ') + '.'); return; }
      sfx.bad(); const malas = [...es.marcas].filter(i => !buenas.includes(i)); malas.forEach(i => es.marcas.delete(i)); buenas.forEach(i => es.bien.add(i)); pintarEsc(c.despues); botonesEsc();
      if (buenas.length) habla('#reTexto', '1 bien. Falta otra.', `Una está bien: ${cambiosOk.map(x => x.voz).join('')}. Falta otra. Mira bien.`);
      else habla('#reTexto', 'Esas no cambiaron.', 'Esas no han cambiado. Si quieres, toca la bombilla para volver a mirar.');
      return;
    }
    if (es.fase === 'colocar') {
      const mal = Object.entries(es.puestas).filter(([pos, de]) => +pos !== +de && !(c.antes[pos] && c.antes[pos].id === c.antes[de].id)).map(([pos]) => +pos);
      Object.entries(es.puestas).forEach(([pos]) => { if (!mal.includes(+pos)) es.bien.add(+pos); });
      if (!mal.length) { es.hecho = true; pintarColocadas(); resuelto('escena'); fin('¡Todas en su sitio!', '¡Todas en su sitio! ¡Qué buena memoria!'); return; }
      sfx.bad(); mal.forEach(p => delete es.puestas[p]); pintarColocadas(); pintarBandeja(); botonesEsc();
      habla('#reTexto', `${mal.length === 1 ? '1 no va ahí' : `${mal.length} no van ahí`}.`, `${mal.length === 1 ? 'Una no estaba ahí' : `${NUM[mal.length]} no estaban ahí`}. Las he devuelto. Las demás, ¡bien! Si quieres, toca la bombilla para volver a mirar.`);
    }
  };
  function brillar() {   // los objetos brillan uno tras otro (se puede repetir con 💡)
    const c = es.caso, t = es.turno; es.fase = 'enseñando'; let k = 0; pintarEsc(c.antes);
    const sig = () => { if (t !== es.turno) return; $$('#reRej .rtHueco').forEach(b => b.classList.remove('brilla'));
      if (k >= c.orden.length) { es.fase = 'reves'; es.paso = 0; $$('#reRej .rtHueco').forEach(b => b.classList.remove('ok')); habla('#reTexto', 'Ahora, al revés.', 'Ahora tú, al revés. Empieza por el último que brilló.'); return; }
      const b = $$('#reRej .rtHueco')[c.orden[k]]; b.classList.add('brilla'); tone(400 + k * 70, .2, 'sine', .1); k++; setTimeout(() => { b.classList.remove('brilla'); setTimeout(sig, 300); }, 900); };
    sig();
  }
  function fin(txt, voz) { ver('#reComp', false); ver('#reYa', false); ver('#reOtro', true); habla('#reTexto', txt, voz); }
  // 💡: volver a ver cómo estaba (o volver a ver el orden), las veces que quiera
  $('#rePista').onclick = () => {
    const c = es.caso; if (!c || es.hecho) return; sfx.pop();
    if (es.fase === 'mirar') { habla('#reTexto', 'Sin prisa. Luego, el ojo.', 'Tómate tu tiempo. Cuando te acuerdes, toca el ojo.'); return; }
    es.ayudas++;
    if (c.D.modo === 'reves') { if (es.fase === 'reves') { es.paso = 0; habla('#reTexto', 'Mira otra vez.', 'Mira otra vez.'); setTimeout(brillar, 700); } return; }
    if (es.viendo) { es.viendo = false; $('#reRej').classList.remove('recuerdo');
      if (es.fase === 'buscar') pintarEsc(c.despues); else pintarColocadas(); habla('#reTexto', 'Ahora tú.', 'Ahora tú.'); return; }
    es.viendo = true; $('#reRej').classList.add('recuerdo'); pintarEsc(c.antes); habla('#reTexto', 'Así estaba.', 'Así estaba. Cuando quieras, toca la bombilla otra vez.');
  };
  $('#reOtro').onclick = () => { sfx.pop(); rondaEsc(); };
  onShow.rEsc = () => { showStars(); rondaEsc(); };
  onLeave.rEsc = () => { es.turno++; es.viendo = false; $('#reRej').classList.remove('recuerdo'); };

  window.RETOS = { M, capPista, capPregunta, NIVELES, leer, crearDet, cumple, crearTabla, crearEsc, unicoLatino, dt, tb, es, rondaDet, rondaTabla, rondaEsc, preguntas, mejorPregunta };
})();
