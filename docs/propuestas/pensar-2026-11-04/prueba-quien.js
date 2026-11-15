#!/usr/bin/env node
/* =====================================================================
   Prueba automática de «¿Quién es?» (4.ª entrega de Pensar, ejemplo; Chromium, iPhone e iPad simulados)
   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/pensar-2026-11-04/prueba-quien.js [http://localhost:8765/] [carpeta-capturas]
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const CARP = 'docs/propuestas/pensar-2026-11-04/', COPIA = BASE + CARP + 'index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-quien-')); fs.mkdirSync(OUT, { recursive: true });
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
const iSol = p => p.evaluate(() => QUIEN.qn.caso.cartas.indexOf(QUIEN.qn.caso.sol));
const iMal = p => p.evaluate(() => QUIEN.qn.caso.cartas.findIndex(t => t !== QUIEN.qn.caso.sol));

(async () => {
  execSync('python3 ' + CARP + 'preparar_copia.py', { cwd: RAIZ });
  const b = await pw.chromium.launch();
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('m-think')); await p.waitForTimeout(300);
    const mt = await p.$$eval('#m-think .big', x => x.map(e => e.lastChild.textContent.trim()));
    ok('Menú Pensar: los juegos de antes igual y, después, «¿Quién es?»', mt.join('|').startsWith('Memoria|Contar|¿Qué sigue?|Sombras|El diferente|¿Quién es?'), mt.join('|'));
    // casos: solución única entre las tarjetas y ninguna pista sobra
    const casos = await p.evaluate(() => { const malos = [];
      for (let L = 0; L < 5; L++) for (let i = 0; i < 400; i++) { const c = QUIEN.crearCaso(L), vale = t => c.pistas.every(q => QUIEN.cumple(t, q));
        const unica = c.cartas.filter(vale).length === 1 && vale(c.sol), distintas = new Set(c.cartas.map(t => t.k + t.c + t.n)).size === c.cartas.length;
        const necesarias = c.pistas.every(p => c.cartas.some(t => !QUIEN.cumple(t, p) && c.pistas.every(q => q === p || QUIEN.cumple(t, q))));
        if (!unica || !distintas || !necesarias || c.cartas.length !== c.D.cartas) malos.push(L); } return malos.length; });
    ok('2.000 casos de los 5 niveles: una sola tarjeta cumple todas las pistas, todas distintas y ninguna pista sobra (hay que combinarlas)', casos === 0, casos + ' malos');
    await p.click('#m-think [data-go="quien"]'); await p.waitForTimeout(700);
    const ini = await p.evaluate(() => ({ chips: document.querySelectorAll('#qnChips .pnChip').length, pistas: document.querySelectorAll('#qnPistas .qnPista').length, cartas: document.querySelectorAll('#qnRejilla .qnCarta').length,
      voz: window.__voz.join(' '), emoji: /\p{Extended_Pictographic}/u.test(document.querySelector('#qnPistas').textContent + document.querySelector('#qnRejilla').textContent + document.querySelector('#qnChips').textContent),
      bombilla: !document.querySelector('#qnPista').hidden }));
    ok('Nivel 1: dos pistas dibujadas (sin texto ni emojis) y 6 tarjetas; la voz dice las pistas; cinco niveles con iconos', ini.chips === 5 && ini.pistas === 2 && ini.cartas === 6 && !ini.emoji && /Busca la tarjeta que cumple todas las pistas\. Es/.test(ini.voz) && !ini.bombilla, JSON.stringify(ini));
    const s0 = await p.evaluate(() => stars); await p.click(`#qnRejilla .qnCarta >> nth=${await iMal(p)}`); await p.waitForTimeout(200);
    const mal = await p.evaluate(() => ({ desc: document.querySelectorAll('.qnCarta.descartada').length, mira: document.querySelectorAll('.qnPista.mira').length, voz: window.__voz.at(-1), stars }));
    ok('Tarjeta equivocada: se aparta, se ilumina la pista que no cumple y la dice; no quita nada', mal.desc === 1 && mal.mira === 1 && /^Esa no\. Mira esta pista: /.test(mal.voz) && mal.stars === s0, JSON.stringify(mal));
    await p.click(`#qnRejilla .qnCarta >> nth=${await iSol(p)}`); await p.waitForTimeout(300);
    ok('Tarjeta correcta: +1 ⭐ y «¡Lo encontraste!» repitiendo por qué', await p.evaluate(() => stars) === s0 + 1 && /Lo encontraste/.test(await p.evaluate(() => window.__voz.at(-1))));
    // subir con dos aciertos limpios
    for (let k = 0; k < 2; k++) { await p.evaluate(() => QUIEN.ronda()); await p.waitForTimeout(150); await p.click(`#qnRejilla .qnCarta >> nth=${await iSol(p)}`); await p.waitForTimeout(150); }
    ok('Dos aciertos limpios: sube de nivel y se guarda (lv_quien)', JSON.parse(await p.evaluate(() => localStorage.getItem('lv_quien'))).L === 1);
    // niveles avanzados directamente
    await p.click('#qnChips .pnChip >> nth=4'); await p.waitForTimeout(500);
    const mem = await p.evaluate(() => ({ L: QUIEN.nv.get().L, cartas: document.querySelectorAll('#qnRejilla .qnCarta').length, tapada: document.querySelector('#qnRejilla').classList.contains('tapada'),
      lupa: !document.querySelector('#qnListo').hidden, pistas: document.querySelectorAll('#qnPistas .qnPista').length, no: document.querySelectorAll('#qnPistas .qnMarca.no').length, voz: window.__voz.at(-1) }));
    ok('El gran reto se elige directamente: 3 pistas (dos de «no»), 12 tarjetas; primero se miran las pistas y las tarjetas esperan', mem.L === 4 && mem.cartas === 12 && mem.tapada && mem.lupa && mem.pistas === 3 && mem.no === 2 && /Acuérdate de las pistas/.test(mem.voz), JSON.stringify(mem));
    await p.screenshot({ path: path.join(OUT, 'quien-recordar.png') });
    await p.click('#qnListo', { force: true }); await p.waitForTimeout(300);
    ok('Al tocar la lupa se tapan las pistas y salen las tarjetas (sin reloj)', await p.evaluate(() => document.querySelector('#qnPistas').classList.contains('tapadas') && !document.querySelector('#qnRejilla').classList.contains('tapada')));
    await p.screenshot({ path: path.join(OUT, 'quien-buscar.png') });
    await p.click('#qnPista'); await p.waitForTimeout(200);
    ok('💡 vuelve a enseñar y decir las pistas, sin castigo', await p.evaluate(() => !document.querySelector('#qnPistas').classList.contains('tapadas') && /^No es/.test(window.__voz.at(-1)) && QUIEN.qn.vistas === 1));
    await p.waitForTimeout(5300);
    ok('… y se vuelven a tapar al rato', await p.evaluate(() => document.querySelector('#qnPistas').classList.contains('tapadas')));
    const l0 = await p.evaluate(() => Logros.total()), s1 = await p.evaluate(() => stars);
    await p.click(`#qnRejilla .qnCarta >> nth=${await iSol(p)}`); await p.waitForTimeout(300);
    ok('Acierto en el gran reto: +1 ⭐, sin logros nuevos', await p.evaluate(() => stars) === s1 + 1 && await p.evaluate(() => Logros.total()) === l0);
    await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => go('quien')); await p.waitForTimeout(400);
    ok('Al volver a abrir sigue en el nivel elegido', await p.evaluate(() => QUIEN.nv.get().L) === 4);
    await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(600); await p.tap('#setClose');
    const copia = JSON.parse((await p.evaluate(() => window.__comp))[0].text);
    ok('«Guardar mi progreso» incluye su nivel (lv_quien)', JSON.parse(copia.local_storage.lv_quien).L === 4);
    await c.close();
  }
  for (const [n, d] of Object.entries(DEV)) for (const L of [1, 4]) {
    const { c, p } = await pagina(b, d); await p.evaluate(L => { QUIEN.nv.elegir(L); go('quien'); }, L); await p.waitForTimeout(700); if (L === 4) { await p.click('#qnListo', { force: true }); await p.waitForTimeout(300); }
    const m = await p.evaluate(() => { const els = [...document.querySelectorAll('#quien .bar .btn, #qnChips .pnChip, .qnPista, .qnCarta')].filter(e => e.offsetParent && getComputedStyle(e).visibility !== 'hidden'), R = els.map(e => e.getBoundingClientRect());
      let sol = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) sol++; }
      return { min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))), dentro: R.every(r => r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), sol, ancho: document.documentElement.scrollWidth <= innerWidth + 1,
        carta: Math.round(document.querySelector('.qnCarta').getBoundingClientRect().width) }; });
    await p.screenshot({ path: path.join(OUT, `quien-${L + 1}-${n.replace(' ', '-').toLowerCase()}.png`) });
    ok(`${n}, nivel ${L + 1}: todo a la vista, sin solaparse, tarjetas de ${m.carta} px (44 o más)`, m.dentro && !m.sol && m.min >= 44 && m.ancho, JSON.stringify(m));
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
