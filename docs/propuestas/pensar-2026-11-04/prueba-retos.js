#!/usr/bin/env node
/* =====================================================================
   Prueba automática de «Retos» (5.ª entrega de Pensar: prueba de niveles avanzados; Chromium, iPhone e iPad simulados)
   ¿Quién se esconde?, La tabla de dos reglas y ¿Qué ha cambiado?
   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/pensar-2026-11-04/prueba-retos.js [http://localhost:8765/] [carpeta-capturas]
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const CARP = 'docs/propuestas/pensar-2026-11-04/', COPIA = BASE + CARP + 'index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-retos-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const errores = [];
const DEV = { 'iPhone vertical': [390, 844, true], 'iPhone horizontal': [844, 390, true], 'iPad vertical': [820, 1180, false], 'iPad horizontal': [1180, 820, false] };
const INIT = () => { window.__comp = []; window.__voz = []; const mm = window.matchMedia.bind(window);
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true }); navigator.canShare = d => !!(d && d.files);
  navigator.share = async d => { if (!navigator.userActivation.isActive) throw new DOMException('sin toque', 'NotAllowedError'); window.__comp.push({ text: await d.files[0].text() }); };
  const v = [{ name: 'Mónica', lang: 'es-ES', voiceURI: 'monica', localService: true, default: true }];
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => v, cancel() {}, speak(u) { window.__voz.push(u.text); }, onvoiceschanged: null } });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; }; };
async function pagina(b, d = DEV['iPhone vertical']) {
  const c = await b.newContext({ viewport: { width: d[0], height: d[1] }, hasTouch: true, isMobile: d[2], deviceScaleFactor: 2 });
  await c.addInitScript(INIT); const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message)); p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400); return { c, p };
}
const nivel = (p, r, L, s) => p.evaluate(([r, L, s]) => { const o = RETOS.leer(); o.L[r] = L; localStorage.setItem('lv_retos', JSON.stringify(o)); go(s); }, [r, L, s]);
const voz = p => p.evaluate(() => window.__voz.at(-1) || '');
const clic = (p, sel) => p.click(sel, { force: true });

(async () => {
  execSync('python3 ' + CARP + 'preparar_copia.py', { cwd: RAIZ });
  {
    const git = c => execSync(c, { cwd: RAIZ }).toString().trim();
    ok('Fuera de su carpeta (y de la capa común de lectura) no cambia nada (ni main, ni el juego, ni los archivos de avatar-creador)', git(`git status --porcelain -- . ':!${CARP}' ':!docs/propuestas/lectura-2026-11-17/'`) === '');
  }
  const b = await pw.chromium.launch();
  // ---------- 0. menú, elegir reto y nivel, recordar ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('m-think')); await p.waitForTimeout(300);
    const mt = await p.$$eval('#m-think .big', x => x.map(e => e.lastChild.textContent.trim()));
    ok('Menú Pensar: lo de antes igual y, al final, «RETOS»', mt.join('|') === 'Memoria|Contar|¿Qué sigue?|Sombras|El diferente|¿Quién es?|RETOS', mt.join('|'));
    await p.click('#m-think [data-go="retos"]'); await p.waitForTimeout(500);
    const li = await p.evaluate(() => ({ cartas: document.querySelectorAll('.reCarta').length, chips: [...document.querySelectorAll('.reCarta')].map(c => c.querySelectorAll('.pnChip').length).join(), emoji: /\p{Extended_Pictographic}/u.test(document.querySelector('#reLista').textContent) }));
    ok('Tres retos, cada uno con sus niveles a la vista (3, 4 y 4), sin emojis', li.cartas === 3 && li.chips === '3,4,4' && !li.emoji, JSON.stringify(li));
    await p.screenshot({ path: path.join(OUT, 'retos-elegir.png') });
    await p.click('.reCarta >> nth=1 >> .pnChip >> nth=2'); await p.waitForTimeout(600);
    ok('Un nivel avanzado se elige directamente desde la lista (sin pasar por los fáciles)', await p.evaluate(() => current === 'rTab' && RETOS.tb.caso.D.tipo === 'latino'));
    await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => go('retos')); await p.waitForTimeout(300);
    ok('Al volver recuerda el último reto (resaltado) y su nivel', await p.evaluate(() => document.querySelectorAll('.reCarta')[1].classList.contains('ultimo') && document.querySelectorAll('.reCarta')[1].querySelector('.pnChip.sel').textContent === '3'));
    await c.close();
  }
  // ---------- 1. ¿Quién se esconde? ----------
  {
    const { c, p } = await pagina(b);
    const casos = await p.evaluate(() => { const r = { malos: 0, tipos: [new Set(), new Set()], n: [] };
      for (let L = 0; L < 2; L++) for (let i = 0; i < 500; i++) { const k = RETOS.crearDet(L), T = k.T, vale = t => k.pistas.every(q => RETOS.cumple(T, t, q));
        if (T.cartas.filter(vale).length !== 1 || !vale(k.sol)) r.malos++;
        if (k.pistas.some(p => T.cartas.filter(t => RETOS.cumple(T, t, p)).length < 3)) r.malos++;
        if (k.pistas.some(p => T.cartas.filter(t => k.pistas.every(q => q === p || RETOS.cumple(T, t, q))).length < 2)) r.malos++;
        if (new Set(T.cartas.map(t => t.k + t.c + t.n)).size !== T.cartas.length) r.malos++;
        k.pistas.forEach(p => r.tipos[L].add(p.t)); r.n[L] = T.cartas.length; }
      return { malos: r.malos, t0: [...r.tipos[0]].sort().join(), t1: [...r.tipos[1]].sort().join(), n: r.n.join() }; });
    ok('1.000 casos: 8 y 12 sospechosos; una sola respuesta; ninguna pista sola deja menos de 3; todas hacen falta', casos.malos === 0 && casos.n === '8,12', JSON.stringify(casos));
    ok('Pistas con negaciones, cantidades (más de / menos de) y relaciones (a su lado / encima)', /noK/.test(casos.t0) && /mas|menos/.test(casos.t0) && /lado/.test(casos.t1) && /encima/.test(casos.t1) && /noC/.test(casos.t1), casos.t0 + ' | ' + casos.t1);
    await nivel(p, 'detective', 1, 'rDet'); await p.waitForTimeout(700);
    const ini = await p.evaluate(() => ({ cartas: document.querySelectorAll('#rdRej .rtCarta').length, pistas: document.querySelectorAll('#rdPistas .rtPista').length, caps: [...document.querySelectorAll('#rdPistas .rtCap')].map(e => e.textContent).join('|'), voz: window.__voz.join(' '), es: document.querySelector('#rdEs').disabled }));
    ok('12 sospechosos y 4 pistas con dibujo y palabra corta en MAYÚSCULAS; la voz las dice; «Elegir» espera a que elija uno', ini.cartas === 12 && ini.pistas === 4 && ini.caps.split('|').length === 4 && ini.caps === ini.caps.toLocaleUpperCase('es') && /Pistas: /.test(ini.voz) && ini.es, JSON.stringify(ini));
    const mal = await p.evaluate(() => RETOS.dt.caso.T.cartas.findIndex(t => t !== RETOS.dt.caso.sol)), bien = await p.evaluate(() => RETOS.dt.caso.T.cartas.indexOf(RETOS.dt.caso.sol));
    await p.click(`#rdRej .rtCarta >> nth=${mal}`); await clic(p, '#rdTachar'); await p.click(`#rdRej .rtCarta >> nth=${mal}`); await clic(p, '#rdTachar');
    ok('Tachar es su herramienta y se puede deshacer', await p.evaluate(i => !document.querySelectorAll('#rdRej .rtCarta')[i].classList.contains('tachada') && RETOS.dt.tachadas.size === 0, mal));
    const s0 = await p.evaluate(() => stars); await p.click(`#rdRej .rtCarta >> nth=${mal}`); await clic(p, '#rdEs'); await p.waitForTimeout(200);
    const e1 = await p.evaluate(i => ({ tach: document.querySelectorAll('#rdRej .rtCarta')[i].classList.contains('tachada'), mira: document.querySelectorAll('#rdPistas .rtPista.mira').length, stars }), mal);
    ok('Respuesta equivocada: explica qué pista no cumple, lo tacha y no quita nada', e1.tach && e1.mira === 1 && /^Ese no puede ser\. Mira esta pista: /.test(await voz(p)) && e1.stars === s0, JSON.stringify(e1));
    await clic(p, '#rdPista'); await p.waitForTimeout(100); const v1 = await voz(p), t1 = await p.evaluate(() => RETOS.dt.tachadas.size);
    await clic(p, '#rdPista'); await p.waitForTimeout(100); const t2 = await p.evaluate(() => RETOS.dt.tachadas.size);
    ok('💡 voluntaria: primero señala la pista que más descarta; si la pide otra vez, tacha los que no la cumplen', /^Fíjate en esta/.test(v1) && t2 > t1 && /^Tacho los que no cumplen/.test(await voz(p)), `${t1}→${t2}`);
    ok('Lo que tacha la ayuda nunca es la respuesta', await p.evaluate(i => !RETOS.dt.tachadas.has(i), bien));
    await p.screenshot({ path: path.join(OUT, 'quien-se-esconde.png') });
    const l0 = await p.evaluate(() => Logros.total());
    await p.click(`#rdRej .rtCarta >> nth=${bien}`); await clic(p, '#rdEs'); await p.waitForTimeout(300);
    ok('Respuesta correcta: +1 ⭐, sin logros nuevos; «Otro» a la vista', await p.evaluate(() => stars) === s0 + 1 && await p.evaluate(() => Logros.total()) === l0 && await p.evaluate(() => !document.querySelector('#rdOtro').hidden));
    // tú preguntas
    await nivel(p, 'detective', 2, 'rDet'); await p.waitForTimeout(600);
    const q0 = await p.evaluate(() => ({ preg: document.querySelectorAll('#rdPreg .rtQ').length, cartas: document.querySelectorAll('#rdRej .rtCarta').length }));
    await clic(p, '#rdPista'); await p.waitForTimeout(100);
    ok('Tú preguntas: 12 sospechosos y 11 preguntas dibujadas; 💡 sugiere una buena pregunta', q0.preg === 11 && q0.cartas === 12 && /^Prueba a preguntar esto: ¿/.test(await voz(p)), JSON.stringify(q0));
    let n = 0;
    for (; n < 11; n++) {   // estrategia: la pregunta que más reparte, tachar y seguir
      const st = await p.evaluate(() => { const T = RETOS.dt.caso.T, viv = T.cartas.filter((_, j) => !RETOS.dt.tachadas.has(j)); return viv.length; }); if (st === 1) break;
      const idx = await p.evaluate(() => { const T = RETOS.dt.caso.T, viv = T.cartas.filter((_, j) => !RETOS.dt.tachadas.has(j)), q = RETOS.mejorPregunta(viv); return RETOS.preguntas(T).findIndex(x => x.t === q.t && x.v === q.v); });
      await clic(p, `#rdPreg .rtQ >> nth=${idx}`); await p.waitForTimeout(80); await clic(p, '#rdPista'); await clic(p, '#rdPista'); await p.waitForTimeout(80);
    }
    const resp = await p.evaluate(() => ({ n: RETOS.dt.resp.length, coherentes: RETOS.dt.resp.every(r => RETOS.cumple(RETOS.dt.caso.T, RETOS.dt.caso.sol, r.q) === r.si), strip: document.querySelectorAll('#rdPreg .rtQ.hecha').length, sol: !RETOS.dt.tachadas.has(RETOS.dt.caso.T.cartas.indexOf(RETOS.dt.caso.sol)) }));
    ok('Cada pregunta responde sí o no (coherente con el escondido) y la respuesta se queda en su pregunta; tachar nunca quita al escondido', resp.coherentes && resp.strip === resp.n && resp.sol && resp.n >= 2, JSON.stringify(resp));
    const s1 = await p.evaluate(() => stars); await p.click(`#rdRej .rtCarta >> nth=${await p.evaluate(() => RETOS.dt.caso.T.cartas.indexOf(RETOS.dt.caso.sol))}`); await clic(p, '#rdEs'); await p.waitForTimeout(300);
    ok(`Lo encuentra preguntando (${resp.n} preguntas con buena estrategia): +1 ⭐ y le dice cuántas ha usado`, await p.evaluate(() => stars) === s1 + 1 && /preguntas?!/.test(await voz(p)), await voz(p));
    await p.screenshot({ path: path.join(OUT, 'tu-preguntas.png') });
    await c.close();
  }
  // ---------- 2. La tabla de dos reglas ----------
  {
    const { c, p } = await pagina(b);
    const tab = await p.evaluate(() => { let malos = 0; const tipos = [];
      for (let L = 0; L < 4; L++) for (let i = 0; i < 200; i++) { const k = RETOS.crearTabla(L); tipos[L] = k.D.tipo;
        const faltan = k.huecos.map(h => k.celdas[h]), ban = k.bandeja; if (!faltan.every(f => ban.some(p => p.k === f.k && p.c === f.c && p.n === f.n))) malos++;
        if (ban.length < k.huecos.length + 3) malos++; if (k.D.tipo !== 'serie' && !k.huecos.includes(4)) malos++;
        if (k.D.tipo === 'latino' && !RETOS.unicoLatino(k.celdas, k.huecos, [...new Set(k.celdas.map(x => x.k))])) malos++;
        if (k.D.tipo === 'serie' && k.huecos.join() !== '3,4,5') malos++; }
      return { malos, tipos: tipos.join() }; });
    ok('800 tablas: siempre el hueco del centro; la bandeja trae lo que falta y piezas trampa (aciertan una regla y fallan otra); el cuadrado latino tiene una sola solución', tab.malos === 0 && tab.tipos === 'kc,kn,latino,serie', JSON.stringify(tab));
    await nivel(p, 'tabla', 1, 'rTab'); await p.waitForTimeout(700);
    const k = await p.evaluate(() => ({ huecos: RETOS.tb.caso.huecos, celdas: RETOS.tb.caso.celdas, ban: RETOS.tb.caso.bandeja }));
    // poner una trampa en el primer hueco y las buenas en los demás
    const iguales = (a, b) => a.k === b.k && a.c === b.c && a.n === b.n;
    const trampa = k.ban.find(x => !k.huecos.some(h => iguales(x, k.celdas[h])));
    const poner = async (pieza, h) => {
      const lista = await p.evaluate(() => { const usadas = new Set(Object.values(RETOS.tb.puestas).map(p => p.id)); return RETOS.tb.caso.bandeja.filter(p => !usadas.has(p.id)).map(p => p.id); });
      await clic(p, `#rtBandeja .rtPieza >> nth=${lista.indexOf(pieza.id)}`); await clic(p, `#rtRej .rtCelda >> nth=${h}`); };
    await poner(trampa, k.huecos[0]); for (const h of k.huecos.slice(1)) await poner(k.ban.find(x => iguales(x, k.celdas[h])), h);
    ok('Hasta llenar todos los huecos no se puede comprobar; luego sí', await p.evaluate(() => !document.querySelector('#rtComp').disabled));
    const s0 = await p.evaluate(() => stars); await clic(p, '#rtComp'); await p.waitForTimeout(300);
    const e1 = await p.evaluate(() => ({ puestas: Object.keys(RETOS.tb.puestas).length, guia: document.querySelectorAll('#rtRej .rtCelda.guia').length, stars }));
    ok('Comprobar: solo vuelve a la bandeja la que no va (las buenas se quedan) y explica las dos reglas de ese hueco', e1.puestas === k.huecos.length - 1 && e1.guia >= 5 && /En esta fila todos son .*En esta columna siempre hay/.test(await voz(p)) && e1.stars === s0, JSON.stringify(e1) + ' ' + await voz(p));
    for (let i = 0; i < 3; i++) { await clic(p, '#rtPista'); await p.waitForTimeout(80); }
    ok('💡 voluntaria en tres pasos: la regla de la fila, la de la columna y, si la pide otra vez, coloca esa pieza', await p.evaluate(() => Object.keys(RETOS.tb.puestas).length) === k.huecos.length && /Esta va aquí/.test(await voz(p)));
    await clic(p, '#rtComp'); await p.waitForTimeout(300);
    ok('Todo bien: +1 ⭐', await p.evaluate(() => stars) === s0 + 1 && /dos reglas/.test(await voz(p)));
    await p.screenshot({ path: path.join(OUT, 'tabla.png') });
    // ordenar el final de la fila
    await nivel(p, 'tabla', 3, 'rTab'); await p.waitForTimeout(600);
    const sr = await p.evaluate(() => ({ celdas: document.querySelectorAll('#rtRej .rtCelda').length, huecos: document.querySelectorAll('#rtRej .hueco').length, ban: document.querySelectorAll('#rtBandeja .rtPieza').length, voz: window.__voz.at(-1) }));
    ok('Ordenar: una fila de 6 con dos reglas que se repiten a distinto ritmo; hay que colocar las 3 últimas entre 6 piezas', sr.celdas === 6 && sr.huecos === 3 && sr.ban === 6 && /dos reglas a la vez/.test(sr.voz), JSON.stringify(sr));
    await p.screenshot({ path: path.join(OUT, 'tabla-ordenar.png') });
    await c.close();
  }
  // ---------- 3. ¿Qué ha cambiado? ----------
  {
    const { c, p } = await pagina(b);
    const esc = await p.evaluate(() => { let malos = 0; const tipos = new Set();
      for (let L = 0; L < 4; L++) for (let i = 0; i < 200; i++) { const k = RETOS.crearEsc(L); if (k.antes.filter(Boolean).length !== k.D.obj) malos++;
        if (k.D.cambios) { if (k.cambios.length !== k.D.cambios) malos++; k.cambios.forEach(x => tipos.add(x.t)); const cel = k.cambios.flatMap(x => x.celdas); if (new Set(cel).size !== cel.length) malos++;
          const dif = k.antes.map((a, j) => JSON.stringify(a) !== JSON.stringify(k.despues[j])).filter(Boolean).length; if (dif !== cel.length) malos++; }
        if (k.D.modo === 'reves' && new Set(k.orden).size !== k.D.pasos) malos++; }
      return { malos, tipos: [...tipos].sort().join() }; });
    ok('800 escenas: el número de cambios es el que toca y solo cambia eso (moverse, desaparecer, aparecer, cambiar de color)', esc.malos === 0 && esc.tipos === 'color,mover,poner,quitar', JSON.stringify(esc));
    await nivel(p, 'escena', 0, 'rEsc'); await p.waitForTimeout(600);
    ok('Mirar sin reloj: la estantería se queda a la vista hasta que toca «Esconder»', await p.evaluate(() => RETOS.es.fase === 'mirar' && !document.querySelector('#reYa').hidden && document.querySelectorAll('#reRej .rtHueco svg').length === 6));
    await p.waitForTimeout(1500); ok('… también pasado un rato', await p.evaluate(() => RETOS.es.fase === 'mirar'));
    await clic(p, '#reYa'); await p.waitForTimeout(1200);
    const cel = await p.evaluate(() => RETOS.es.caso.cambios[0].celdas), otra = await p.evaluate(c => [...Array(9).keys()].find(i => !c.includes(i)), cel);
    const s0 = await p.evaluate(() => stars); await clic(p, `#reRej .rtHueco >> nth=${otra}`); await p.waitForTimeout(150);
    ok('Tocar donde no cambió nada: lo dice y propone volver a mirar; no quita nada', /no ha cambiado nada/.test(await voz(p)) && await p.evaluate(() => stars) === s0 && await p.evaluate(() => !RETOS.es.hecho));
    await clic(p, '#rePista'); await p.waitForTimeout(150);
    ok('💡 vuelve a enseñar cómo estaba (fondo azul) y con otra vez, la de ahora', await p.evaluate(() => document.querySelector('#reRej').classList.contains('recuerdo')) && (await clic(p, '#rePista'), await p.waitForTimeout(150), await p.evaluate(() => !document.querySelector('#reRej').classList.contains('recuerdo'))));
    await clic(p, `#reRej .rtHueco >> nth=${cel[cel.length - 1]}`); await p.waitForTimeout(200);
    ok('Lo encuentra: +1 ⭐ y le dice qué cambió', await p.evaluate(() => stars) === s0 + 1 && /^¡Sí! /.test(await voz(p)), await voz(p));
    // dos cambios: una bien y otra mal → se queda la buena
    await nivel(p, 'escena', 1, 'rEsc'); await p.waitForTimeout(600); await clic(p, '#reYa'); await p.waitForTimeout(1200);
    const cs = await p.evaluate(() => RETOS.es.caso.cambios.map(x => x.celdas)), libre = await p.evaluate(c => [...Array(12).keys()].find(i => !c.flat().includes(i)), cs);
    await clic(p, `#reRej .rtHueco >> nth=${cs[0][0]}`); await clic(p, `#reRej .rtHueco >> nth=${libre}`); await clic(p, '#reComp'); await p.waitForTimeout(200);
    ok('Dos cambios: marca dos y comprueba; la buena se queda en verde y la otra se desmarca («Falta otra»)', await p.evaluate(() => RETOS.es.marcas.size === 1 && RETOS.es.bien.size === 1) && /Falta otra/.test(await voz(p)));
    await clic(p, `#reRej .rtHueco >> nth=${cs[1][0]}`); await clic(p, '#reComp'); await p.waitForTimeout(200);
    ok('Con las dos: +1 ⭐ y le dice las dos', await p.evaluate(() => RETOS.es.hecho) && /^¡Las dos!/.test(await voz(p)));
    await p.screenshot({ path: path.join(OUT, 'que-ha-cambiado.png') });
    // colocar de memoria
    await nivel(p, 'escena', 2, 'rEsc'); await p.waitForTimeout(600); await clic(p, '#reYa'); await p.waitForTimeout(1200);
    const antes = await p.evaluate(() => RETOS.es.caso.antes.map((x, i) => x ? i : -1).filter(i => i >= 0));
    const colocar = async (de, a) => { const lista = await p.evaluate(() => { const us = new Set(Object.values(RETOS.es.puestas)); return RETOS.es.caso.antes.map((x, i) => x && !us.has(i) ? i : -1).filter(i => i >= 0); });
      await clic(p, `#reBandeja .rtPieza >> nth=${lista.indexOf(de)}`); await clic(p, `#reRej .rtHueco >> nth=${a}`); };
    await colocar(antes[0], antes[1]); await colocar(antes[1], antes[0]); for (const i of antes.slice(2)) await colocar(i, i);
    await clic(p, '#reComp'); await p.waitForTimeout(200);
    ok('Colocar de memoria: comprobar devuelve solo las dos cambiadas de sitio; las demás quedan en verde', await p.evaluate(() => Object.keys(RETOS.es.puestas).length === RETOS.es.caso.D.obj - 2 && RETOS.es.bien.size === RETOS.es.caso.D.obj - 2) && /dos no estaban ahí/.test(await voz(p)));
    await colocar(antes[0], antes[0]); await colocar(antes[1], antes[1]); await clic(p, '#reComp'); await p.waitForTimeout(200);
    ok('Todas en su sitio: +1 ⭐', await p.evaluate(() => RETOS.es.hecho) && /Todas en su sitio/.test(await voz(p)));
    // al revés
    await nivel(p, 'escena', 3, 'rEsc'); await p.waitForTimeout(600);
    await p.waitForFunction(() => RETOS.es.fase === 'reves', null, { timeout: 15000 });
    const orden = await p.evaluate(() => RETOS.es.caso.orden);
    await clic(p, `#reRej .rtHueco >> nth=${orden[orden.length - 1]}`); await clic(p, `#reRej .rtHueco >> nth=${orden[0]}`); await p.waitForTimeout(100);
    ok('Al revés: un toque fuera de orden no borra lo hecho («¿Cuál brilló justo antes?»)', await p.evaluate(() => RETOS.es.paso) === 1 && /justo antes/.test(await voz(p)));
    for (const i of orden.slice(0, -1).reverse()) await clic(p, `#reRej .rtHueco >> nth=${i}`);
    ok('Repite los cuatro al revés: +1 ⭐', await p.evaluate(() => RETOS.es.hecho) && /Al revés/.test(await voz(p)));
    // datos
    const guard = await p.evaluate(() => JSON.parse(localStorage.getItem('lv_retos')));
    ok('Se guarda el último reto, el nivel de cada uno y cuántos ha resuelto (lv_retos)', guard.ultimo === 'escena' && guard.L.escena === 3 && guard.hechos.escena === 4, JSON.stringify(guard));
    await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(600); await p.tap('#setClose');
    const copia = JSON.parse((await p.evaluate(() => window.__comp))[0].text);
    ok('«Guardar mi progreso» incluye los retos (lv_retos)', JSON.parse(copia.local_storage.lv_retos).L.escena === 3);
    await p.evaluate(() => localStorage.setItem('lv_retos', '{"v":1,"ultimo":"zzz","L":{"tabla":99,"escena":"x"},"hechos":7}')); await p.evaluate(() => go('retos')); await p.waitForTimeout(300);
    ok('Datos estropeados: se corrigen al leerlos, sin errores', await p.evaluate(() => { const o = RETOS.leer(); return o.ultimo === '' && o.L.tabla === 3 && o.L.escena === undefined; }));
    await c.close();
  }
  // ---------- 4. norma de lectura de Amaia: MAYÚSCULAS, letra grande, frases cortas, voz ----------
  {
    const { c, p } = await pagina(b);
    const textos = s => p.evaluate(s => { const malos = [], chicos = [], largos = [];
      const w = document.createTreeWalker(document.querySelector(s), NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const t = n.textContent.trim(), e = n.parentElement; if (!t || !e || e.closest('svg') || !e.offsetParent || getComputedStyle(e).visibility === 'hidden') continue;
        if (/^[0-9?¿!¡.,:+ -]*$/.test(t)) continue;
        if (t !== t.toLocaleUpperCase('es')) malos.push(t);
        if (parseFloat(getComputedStyle(e).fontSize) < 16) chicos.push(t + ' ' + getComputedStyle(e).fontSize);
        if (e.closest('.rtTexto') && t.split(/\s+/).length > 7) largos.push(t); }
      return { malos, chicos, largos }; }, s);
    const fallos = [];
    const revisar = async (n, s) => { const r = await textos(s); if (r.malos.length || r.chicos.length || r.largos.length) fallos.push(n + ': ' + JSON.stringify(r)); };
    await p.evaluate(() => go('retos')); await p.waitForTimeout(400); await revisar('lista', '#retos');
    for (const L of [0, 1, 2]) { await nivel(p, 'detective', L, 'rDet'); await p.waitForTimeout(600); await revisar('detective ' + L, '#rDet');
      await p.click('#rdRej .rtCarta >> nth=0'); await clic(p, '#rdPista'); await clic(p, '#rdPista'); await p.waitForTimeout(100); await revisar('detective ayuda ' + L, '#rDet');
      if (L === 2) { await clic(p, '#rdPreg .rtQ >> nth=0'); await clic(p, '#rdPreg .rtQ >> nth=3'); await p.waitForTimeout(100); await revisar('respuestas', '#rDet'); } }
    for (const L of [0, 1, 2, 3]) { await nivel(p, 'tabla', L, 'rTab'); await p.waitForTimeout(500); await clic(p, '#rtPista'); await clic(p, '#rtPista'); await p.waitForTimeout(100); await revisar('tabla ' + L, '#rTab'); }
    for (const L of [0, 1, 2]) { await nivel(p, 'escena', L, 'rEsc'); await p.waitForTimeout(500); await revisar('escena mirar ' + L, '#rEsc'); await clic(p, '#reYa'); await p.waitForTimeout(1200);
      await clic(p, '#reRej .rtHueco >> nth=0'); await clic(p, '#rePista'); await p.waitForTimeout(100); await revisar('escena ' + L, '#rEsc'); }
    ok('Todo el texto que ve la niña está en MAYÚSCULAS, a 16 px o más, y los mensajes tienen 7 palabras o menos (lista, pistas, preguntas, respuestas, botones y explicaciones)', !fallos.length, fallos.slice(0, 2).join(' || '));
    const tam = await p.evaluate(() => ({ msg: parseFloat(getComputedStyle(document.querySelector('#reTexto span')).fontSize), boton: parseFloat(getComputedStyle(document.querySelector('#rEsc .rtBtn .rtCap')).fontSize), titulo: document.querySelector('#rEsc .bar .title').textContent }));
    ok('Letra grande: los mensajes a 22 px o más y las palabras de los botones a 16 px; títulos cortos en mayúsculas', tam.msg >= 22 && tam.boton >= 16 && tam.titulo === '¿QUÉ CAMBIÓ?', JSON.stringify(tam));
    const v0 = await p.evaluate(() => window.__voz.length); await clic(p, '#reTexto'); await p.waitForTimeout(100);
    const v1 = await p.evaluate(() => ({ n: window.__voz.length, u: window.__voz.at(-1), t: document.querySelector('#reTexto span').textContent }));
    ok('Apoyo de voz: al tocar el mensaje (con su altavoz) se oye la frase entera; la voz va en minúsculas normales', v1.n === v0 + 1 && v1.u !== v1.u.toLocaleUpperCase('es') && v1.u.length >= v1.t.length, JSON.stringify(v1));
    await clic(p, '#rEsc .bar .title'); await p.waitForTimeout(100);
    ok('Tocar el título dice el nombre del reto', await voz(p) === '¿Qué ha cambiado?');
    await c.close();
  }
  {   // «Tú preguntas» en horizontal: preguntas grandes, sin reducir la letra
    const { c, p } = await pagina(b, DEV['iPhone horizontal']); await nivel(p, 'detective', 2, 'rDet'); await p.waitForTimeout(800);
    const m = await p.evaluate(() => { const q = [...document.querySelectorAll('#rdPreg .rtQ')].map(e => e.getBoundingClientRect()), cap = document.querySelector('#rdPreg .rtQ .rtCap');
      const mini = [...document.querySelectorAll('#rdPreg .rtMini')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect());
      return { n: q.length, ancho: Math.round(Math.min(...q.map(r => r.width))), alto: Math.round(Math.min(...q.map(r => r.height))), letra: parseFloat(getComputedStyle(cap).fontSize),
        dentro: [...q, ...mini].every(r => r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 && r.top >= 0), botones: mini.length, cartas: Math.round(document.querySelector('#rdRej .rtCarta').getBoundingClientRect().width) }; });
    ok('Tú preguntas, iPhone en horizontal: 11 preguntas de 110 px o más con su palabra a 16 px; «TACHAR» y «¡ES ESTE!» en la casilla libre; tarjetas de 60 px o más', m.n === 11 && m.ancho >= 110 && m.alto >= 64 && m.letra >= 16 && m.dentro && m.botones === 2 && m.cartas >= 60, JSON.stringify(m));
    await p.click('#rdRej .rtCarta >> nth=0'); await clic(p, '#rdPreg .rtMini >> nth=0'); await p.waitForTimeout(100);
    ok('Los botones de la casilla libre hacen lo mismo (tachar)', await p.evaluate(() => RETOS.dt.tachadas.has(0)));
    await p.screenshot({ path: path.join(OUT, 'tu-preguntas-horizontal.png') });
    await c.close();
  }
  // ---------- 5. pantallas ----------
  for (const [n, d] of Object.entries(DEV)) for (const [r, L, s, prep] of [['detective', 1, 'rDet'], ['detective', 2, 'rDet'], ['tabla', 2, 'rTab'], ['tabla', 3, 'rTab'], ['escena', 1, 'rEsc', 'ya'], ['escena', 2, 'rEsc', 'ya']]) {
    const { c, p } = await pagina(b, d); await nivel(p, r, L, s); await p.waitForTimeout(700); if (prep) { await clic(p, '#reYa'); await p.waitForTimeout(1200); }
    const m = await p.evaluate(s => { const els = [...document.querySelectorAll(`#${s} .bar .btn, #${s} .subbar .pnChip, #${s} .rtCarta, #${s} .rtBtn, #${s} .qnPista`)].filter(e => e.offsetParent && getComputedStyle(e).visibility !== 'hidden'), R = els.map(e => e.getBoundingClientRect());
      let sol = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) sol++; }
      return { min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))), dentro: R.every(r => r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), sol, ancho: document.documentElement.scrollWidth <= innerWidth + 1 }; }, s);
    await p.screenshot({ path: path.join(OUT, `${r}${L + 1}-${n.replace(' ', '-').toLowerCase()}.png`) });
    ok(`${n}, ${r} ${L + 1}: todo a la vista, sin solaparse, botones y casillas de 44 px o más`, m.dentro && !m.sol && m.min >= 44 && m.ancho, JSON.stringify(m));
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
