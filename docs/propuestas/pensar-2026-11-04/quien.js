/* =====================================================================
   ¿Quién es? (copia aislada de Pensar, 4.ª entrega · ejemplo para revisar, 15/11/2026) · menú Pensar
   Juego de detective: hay que COMBINAR pistas dibujadas (qué es, de qué color, cuántos hay, y pistas de «no es»)
   para encontrar la única tarjeta que las cumple todas. En los niveles altos las pistas se ESCONDEN antes de buscar
   (hay que recordarlas; se pueden volver a ver con 💡, sin castigo).
   Las tarjetas están hechas para que ninguna pista sobre: siempre hay una tarjeta que cumple todas menos una.
   Los cinco niveles se pueden elegir directamente (sin repetir antes los fáciles); también sube solo tras dos
   aciertos limpios. +1 ⭐ por acierto, como los demás juegos de Pensar; sin cronómetro, sin castigos, sin logros nuevos.
   Clave nueva: lv_quien (con el formato de Nivel de pensar.js).
   ===================================================================== */
(function () {
  'use strict';
  const U = window.PENSAR_UTIL, P2 = window.PENSAR2, DB = window.DIBUJOS, NS = 'http://www.w3.org/2000/svg';
  const { Nivel, barra } = U;
  // mismos colores (y en el mismo orden) que pensar2.js, para recolorear con su svgDe
  const COL = [{ c: '#ff6f7d', n: 'rojo', f: 'roja' }, { c: '#ffd46b', n: 'amarillo', f: 'amarilla' }, { c: '#6cc8f5', n: 'azul', f: 'azul' }, { c: '#5fd39b', n: 'verde', f: 'verde' },
    { c: '#c9b6ff', n: 'lila', f: 'lila' }];
  const COSAS = ['estrella', 'corazon', 'globo', 'pez', 'mariposa', 'seta', 'mariquita'];
  const NUM = ['', 'uno', 'dos', 'tres'];
  /* niveles: qué pistas hay (k = qué es, c = color, n = cuántos; «no» = pista negativa), cuántas tarjetas y si se esconden */
  const NIVELES = [
    { n: 'dos pistas', pistas: ['k', 'c'], cartas: 6, cols: 3 },
    { n: 'tres pistas', pistas: ['k', 'c', 'n'], cartas: 9, cols: 3 },
    { n: 'pista de «no»', pistas: ['noK', 'c', 'n'], cartas: 9, cols: 3 },
    { n: 'pistas escondidas', pistas: ['k', 'c', 'n'], cartas: 9, cols: 3, esconder: true },
    { n: 'el gran reto', pistas: ['noK', 'noC', 'n'], cartas: 12, cols: 4, esconder: true },
  ];
  const nv = Nivel('lv_quien', NIVELES.length, 2);
  const pick = a => a[Math.floor(Math.random() * a.length)], mezclar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- crear un caso: entre las tarjetas solo una cumple todas las pistas, y ninguna pista sobra ---------- */
  const cumple = (t, p) => p.t === 'k' ? t.k === p.v : p.t === 'noK' ? t.k !== p.v : p.t === 'c' ? t.c === p.v : p.t === 'noC' ? t.c !== p.v : t.n === p.v;
  const clave = t => t.k + '|' + t.c + '|' + t.n;
  function crearCaso(L) {
    const D = NIVELES[L];
    for (let intento = 0; intento < 200; intento++) {
      const kinds = mezclar(COSAS).slice(0, 3), cols = mezclar([0, 1, 2, 3, 4]).slice(0, 3), nums = [1, 2, 3];
      const todas = []; kinds.forEach(k => cols.forEach(c => nums.forEach(n => todas.push({ k, c, n }))));
      const sol = pick(todas);
      const pistas = D.pistas.map(t => t === 'k' ? { t, v: sol.k } : t === 'c' ? { t, v: sol.c } : t === 'n' ? { t, v: sol.n }
        : t === 'noK' ? { t, v: pick(kinds.filter(k => k !== sol.k)) } : { t, v: pick(cols.filter(c => c !== sol.c)) });
      const vale = t => pistas.every(p => cumple(t, p));   // solo «sol» la cumple entre las tarjetas que se ven
      // para cada pista, una tarjeta que cumple todas las demás pero no esa (así hace falta mirarlas todas)
      const cartas = [sol];
      let bien = true;
      for (const p of pistas) {
        const casi = mezclar(todas.filter(t => !cumple(t, p) && pistas.every(q => q === p || cumple(t, q)) && !cartas.includes(t)));
        if (!casi.length) { bien = false; break; } cartas.push(casi[0]);
      }
      if (!bien) continue;
      // el resto: tarjetas parecidas (que cumplen al menos una pista), todas distintas
      const resto = mezclar(todas.filter(t => !cartas.includes(t) && !vale(t))).sort((a, b) => pistas.filter(p => cumple(b, p)).length - pistas.filter(p => cumple(a, p)).length);
      cartas.push(...resto.slice(0, D.cartas - cartas.length));
      if (cartas.length < D.cartas) continue;
      return { sol, pistas, cartas: mezclar(cartas), D };
    }
    throw new Error('sin caso');
  }

  /* ---------- dibujos de las pistas (sin texto: se pueden «leer» sin saber leer) ---------- */
  const it = (k, c) => P2.item(k, { col: c });
  const tarjetaHTML = t => `<span class="qnCosas n${t.n}">${Array.from({ length: t.n }, () => `<span class="qnCosa">${P2.svgDe(it(t.k, t.c))}</span>`).join('')}</span>`;
  const SI = `<svg class="qnMarca si" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/><path d="M11 21l6 6 12-13"/></svg>`;
  const NO = `<svg class="qnMarca no" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/><path d="M13 13l14 14M27 13L13 27"/></svg>`;
  const gota = c => `<svg viewBox="0 0 100 100"><path d="M50 8C66 34 82 50 82 66a32 32 0 0 1-64 0C18 50 34 34 50 8Z" fill="${COL[c].c}" stroke="${INK}" stroke-width="5"/><path d="M34 64q2 12 12 16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/></svg>`;
  const puntos = n => `<svg viewBox="0 0 100 100">${[[50], [30, 70], [22, 50, 78]][n - 1].map(x => `<circle cx="${x}" cy="50" r="12" fill="${INK}"/>`).join('')}</svg>`;
  function pistaHTML(p) {
    const dib = p.t === 'k' || p.t === 'noK' ? `<span class="qnSil">${P2.svgDe(it(p.v, -1))}</span>` : p.t === 'c' || p.t === 'noC' ? gota(p.v) : puntos(p.v);
    // norma de lectura: debajo del dibujo, la palabra corta (se ve en MAYÚSCULAS); al tocarla se oye la pista
    return `<span class="qnPistaW" role="button" aria-label="${pistaVoz(p)}"><span class="qnPista" data-t="${p.t}">${dib}${p.t.startsWith('no') ? NO : SI}</span><b class="lxCap">${capPista(p)}</b></span>`;
  }
  function capPista(p) {
    if (p.t === 'k') return `Es ${DB[p.v].s}`; if (p.t === 'noK') return `No es ${DB[p.v].s}`;
    if (p.t === 'c') return `Es ${COL[p.v].n}`; if (p.t === 'noC') return `No es ${COL[p.v].n}`;
    return `Hay ${p.v}`;
  }
  const art = k => DB[k].g === 'f' ? 'una' : 'un';
  function pistaVoz(p) {
    if (p.t === 'k') return `Es ${art(p.v)} ${DB[p.v].s}.`;
    if (p.t === 'noK') return `No es ${art(p.v)} ${DB[p.v].s}.`;
    if (p.t === 'c') return `Es de color ${COL[p.v].n}.`;
    if (p.t === 'noC') return `No es de color ${COL[p.v].n}.`;
    return p.v === 1 ? 'Hay uno solo.' : `Hay ${NUM[p.v]}.`;
  }

  /* ---------- pantalla ---------- */
  document.getElementById('logros').insertAdjacentHTML('beforebegin', `
<section class="screen pn" id="quien">
  ${barra('m-think', '¿Quién es?', '<button class="btn" id="qnPista" aria-label="Ver las pistas otra vez">💡</button><button class="btn" id="qnSay" aria-label="Repetir las pistas">🗣️</button>')}
  <div class="subbar" id="qnChips"></div>
  <div class="qnWrap">
    <div class="qnPistas" id="qnPistas" aria-label="Pistas"></div>
    <button class="btn pnAccion qnListo" id="qnListo" hidden aria-label="Ya me acuerdo: a buscar">${svg(`<circle cx="52" cy="52" r="30" fill="#efe6ff" stroke="${INK}" stroke-width="7"/><path d="M74 74l26 26" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M38 52l10 10 18-20" fill="none" stroke="#2b9a66" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`)}</button>
    <div class="qnRejilla" id="qnRejilla"></div>
    <div class="pnTexto" id="qnTexto"></div>
  </div>
</section>`);
  ILL.quien = svg(`<rect x="14" y="20" width="56" height="74" rx="12" fill="#fff6d3" stroke="${INK}" stroke-width="4"/>
    <text x="42" y="74" font-size="46" font-weight="900" text-anchor="middle" fill="#a083ff" font-family="ui-rounded,system-ui,sans-serif">?</text>
    <circle cx="78" cy="66" r="22" fill="#efe6ff" stroke="${INK}" stroke-width="5"/><path d="M94 82l16 16" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`);
  $$('#m-think .menu').forEach(m => m.insertAdjacentHTML('beforeend', '<button class="big c6" data-go="quien"><span class="ill" data-ill="quien"></span>¿Quién es?</button>'));
  paintIll();
  const ICO_NIV = [
    `<svg viewBox="0 0 100 100" class="rpIco"><circle cx="34" cy="50" r="13"/><circle cx="66" cy="50" r="13"/></svg>`,
    `<svg viewBox="0 0 100 100" class="rpIco"><circle cx="22" cy="50" r="11"/><circle cx="50" cy="50" r="11"/><circle cx="78" cy="50" r="11"/></svg>`,
    `<svg viewBox="0 0 100 100" class="rpIco"><circle cx="50" cy="50" r="30"/><path d="M30 30L70 70M70 30L30 70"/></svg>`,
    `<svg viewBox="0 0 100 100" class="rpIco"><path d="M10 50Q50 10 90 50Q50 90 10 50Z"/><path d="M14 86L86 14"/></svg>`,
    `<svg viewBox="0 0 100 100" class="rpIco"><path d="M50 8L61 38H92L67 57L76 88L50 69L24 88L33 57L8 38H39Z"/></svg>`,
  ];
  function chips() {
    const o = nv.get(), box = $('#qnChips'); box.innerHTML = '';
    NIVELES.forEach((d, i) => { const b = document.createElement('button'); b.className = 'btn pnChip' + (i === o.L ? ' sel' : '') + (i <= o.max ? ' hecho' : '');
      b.innerHTML = ICO_NIV[i]; b.setAttribute('aria-label', 'Nivel ' + (i + 1) + ': ' + d.n); b.onclick = () => { sfx.pop(); nv.elegir(i); ronda(); }; box.appendChild(b); });
  }

  /* ---------- jugar ---------- */
  const qn = { caso: null, turno: 0, fallos: 0, vistas: 0, buscando: false, hecho: false };
  function ronda(L) {
    const t = ++qn.turno; L = L === undefined ? nv.get().L : L; chips();
    const caso = qn.caso = crearCaso(L); Object.assign(qn, { fallos: 0, vistas: 0, hecho: false, buscando: !caso.D.esconder });
    $('#qnPistas').innerHTML = caso.pistas.map(pistaHTML).join(''); $('#qnPistas').classList.remove('tapadas');
    $$('#qnPistas .qnPistaW').forEach((e, i) => e.onclick = () => { if (!$('#qnPistas').classList.contains('tapadas')) say(pistaVoz(caso.pistas[i])); });
    const rej = $('#qnRejilla'); rej.innerHTML = ''; rej.style.setProperty('--cols', caso.D.cols); rej.classList.toggle('tapada', !qn.buscando);
    caso.cartas.forEach((c, i) => { const b = document.createElement('button'); b.className = 'qopt qnCarta'; b.dataset.i = i; b.innerHTML = tarjetaHTML(c);
      b.setAttribute('aria-label', `${NUM[c.n]} ${DB[c.k].s}, ${COL[c.c].n}`); b.onclick = () => elegir(b, c); rej.appendChild(b); });
    $('#qnListo').hidden = qn.buscando; $('#qnPista').hidden = !caso.D.esconder;
    $('#qnTexto').textContent = qn.buscando ? '¿Quién es? Mira todas las pistas.' : 'Mira las pistas. Acuérdate.';
    setTimeout(() => { if (t !== qn.turno) return;
      say((caso.D.esconder ? 'Acuérdate de las pistas. ' : 'Busca la tarjeta que cumple todas las pistas. ') + caso.pistas.map(pistaVoz).join(' ') + (caso.D.esconder ? ' Cuando te acuerdes, toca la lupa.' : '')); }, 300);
    requestAnimationFrame(ajustar); setTimeout(ajustar, 60);
  }
  function aBuscar() {   // se tapan las pistas y salen las tarjetas
    if (qn.buscando) return; qn.buscando = true; sfx.pop();
    $('#qnPistas').classList.add('tapadas'); $('#qnRejilla').classList.remove('tapada'); $('#qnListo').hidden = true;
    $('#qnTexto').textContent = '¿Quién es? Si no te acuerdas, toca la bombilla.'; say('¿Quién es?'); ajustar();
  }
  function verPistas() {   // ver las pistas otra vez (sin castigo: solo cuenta como ayuda para subir de nivel)
    if (!qn.caso || qn.hecho) return; sfx.pop(); qn.vistas++;
    const box = $('#qnPistas'); box.classList.remove('tapadas'); say(qn.caso.pistas.map(pistaVoz).join(' '));
    if (qn.buscando && qn.caso.D.esconder) { const t = qn.turno; clearTimeout(qn.tVer); qn.tVer = setTimeout(() => { if (t === qn.turno && !qn.hecho) box.classList.add('tapadas'); }, 5000); }
  }
  function elegir(b, c) {
    if (qn.hecho || !qn.buscando || b.classList.contains('descartada')) return;
    const caso = qn.caso;
    if (c === caso.sol) {
      qn.hecho = true; b.classList.add('ok'); $('#qnPistas').classList.remove('tapadas'); $$('#qnPistas .qnPista').forEach(x => x.classList.add('bien'));
      sfx.good(); confetti(); addStar();
      const limpio = qn.fallos === 0 && qn.vistas <= 1, r = nv.resultado(limpio);
      say('¡Lo encontraste! ' + caso.pistas.map(pistaVoz).join(' ') + (r === 'sube' ? ' ¡La próxima, más difícil!' : ''));
      $('#qnTexto').textContent = '¡Lo encontraste!'; chips();
      const t = qn.turno; setTimeout(() => { if (t === qn.turno) ronda(); }, 4200); return;
    }
    // no es: se aparta y se enseña qué pista no cumple (sin quitar nada)
    qn.fallos++; sfx.bad(); b.classList.add('descartada');
    const p = caso.pistas.find(q => !cumple(c, q)), i = caso.pistas.indexOf(p), el = $$('#qnPistas .qnPista')[i];
    $('#qnPistas').classList.remove('tapadas'); el.classList.add('mira'); setTimeout(() => el.classList.remove('mira'), 2200);
    say('Esa no. Mira esta pista: ' + pistaVoz(p));
    if (caso.D.esconder) { const t = qn.turno; clearTimeout(qn.tVer); qn.tVer = setTimeout(() => { if (t === qn.turno && !qn.hecho) $('#qnPistas').classList.add('tapadas'); }, 4000); }
  }
  function ajustar() {   // tarjetas tan grandes como quepan
    const rej = $('#qnRejilla'); if (!rej.offsetParent || !qn.caso) return; const cols = qn.caso.D.cols, filas = Math.ceil(qn.caso.D.cartas / cols);
    const w = rej.clientWidth, h = rej.clientHeight, s = Math.floor(Math.min((w - (cols - 1) * 10) / cols, (h - (filas - 1) * 10) / filas, 150));
    rej.style.setProperty('--s', Math.max(s, 60) + 'px');
  }
  addEventListener('resize', () => { if (current === 'quien') ajustar(); });
  $('#qnListo').onclick = aBuscar; $('#qnPista').onclick = verPistas;
  $('#qnSay').onclick = () => qn.caso && say((qn.buscando && qn.caso.D.esconder && $('#qnPistas').classList.contains('tapadas')) ? '¿Quién es? Si no te acuerdas de las pistas, toca la bombilla.' : qn.caso.pistas.map(pistaVoz).join(' '));
  onShow.quien = () => { showStars(); ronda(); setTimeout(ajustar, 120); };
  onLeave.quien = () => { qn.turno++; clearTimeout(qn.tVer); };

  window.QUIEN = { qn, nv, NIVELES, crearCaso, cumple, ronda, aBuscar };
})();
