#!/usr/bin/env node
/* =====================================================================
   Prueba de la NORMA DE LECTURA DE AMAIA en todos los juegos de Pensar (Chromium; iPhone e iPad, vertical y horizontal)
   Recorre cada pantalla y sus momentos (inicio, jugando, pistas, final) y comprueba:
     · todo el texto visible en MAYÚSCULAS y a 16 px o más; los mensajes, a 22 px o más, partidos en pasos y con voz;
     · que todo cabe (nada fuera de la pantalla ni encima de otra cosa) y se toca cómodamente (44 px o más).
   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/pensar-2026-11-04/prueba-lectura.js [http://localhost:8765/] [carpeta-capturas]
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const CARP = 'docs/propuestas/pensar-2026-11-04/', COPIA = BASE + CARP + 'index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-lectura-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const errores = [];
const DEV = { 'iPhone vertical': [390, 844, true], 'iPhone horizontal': [844, 390, true], 'iPad vertical': [820, 1180, false], 'iPad horizontal': [1180, 820, false] };
const INIT = () => { window.__voz = []; const mm = window.matchMedia.bind(window);
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true });
  const v = [{ name: 'Mónica', lang: 'es-ES', voiceURI: 'monica', localService: true, default: true }];
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => v, cancel() {}, speak(u) { window.__voz.push(u.text); }, onvoiceschanged: null } });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; }; };
const clic = (p, s) => p.click(s, { force: true }).catch(() => {});
const sinIntro = async p => { if (await p.$('section.screen.on .pnIntro:not([hidden]) .pnNo')) { await clic(p, 'section.screen.on .pnIntro:not([hidden]) .pnNo'); await p.waitForTimeout(500); } };
const retos = (r, L, s) => p => p.evaluate(([r, L, s]) => { const o = RETOS.leer(); o.L[r] = L; localStorage.setItem('lv_retos', JSON.stringify(o)); go(s); }, [r, L, s]);
// cada momento: [nombre, cómo llegar]
const MOMENTOS = [
  ['menú Pensar', p => p.evaluate(() => go('m-think'))],
  ['Contar: inicio', p => p.evaluate(() => { localStorage.setItem('lv_contar', '8'); go('contar'); })],
  ['Contar: jugando', async p => { await sinIntro(p); }],
  ['Contar: dos pasos', async p => { await p.evaluate(() => { PENSAR.nvCt.elegir(7); go('contar'); }); await p.waitForTimeout(400); await sinIntro(p); }],
  ['Memoria: menú', p => p.evaluate(() => go('memoria'))],
  ['Memoria: parejas', async p => { await p.evaluate(() => go('parejas')); await p.waitForTimeout(300); await sinIntro(p); }],
  ['Memoria: ¿dónde estaba? (mirar)', async p => { await p.evaluate(() => go('donde')); await p.waitForTimeout(300); await sinIntro(p); }],
  ['Memoria: ¿dónde estaba? (buscar)', async p => { await clic(p, '#doListo'); await p.waitForTimeout(900); }],
  ['Memoria: serie', async p => { await p.evaluate(() => go('serie')); await p.waitForTimeout(300); await sinIntro(p); await p.waitForTimeout(400); }],
  ['¿Qué sigue?', async p => { await p.evaluate(() => go('obs', 'sigue')); await p.waitForTimeout(400); await sinIntro(p); }],
  ['Sombras', async p => { await p.evaluate(() => go('obs', 'sombras')); await p.waitForTimeout(400); await sinIntro(p); }],
  ['El diferente', async p => { await p.evaluate(() => go('obs', 'distinto')); await p.waitForTimeout(400); await sinIntro(p); }],
  ['menú Pintar', p => p.evaluate(() => go('m-paint'))],
  ['Unir puntos', p => p.evaluate(() => go('puntos'))],
  ['Repasar', p => p.evaluate(() => go('repasar'))],
  ['Dibujos por partes: elegir', p => p.evaluate(() => go('grandes'))],
  ['Dibujos por partes: puntos', p => p.evaluate(() => go('etapa', 'buho:pu'))],
  ['Dibujos por partes: repasar', p => p.evaluate(() => go('etapa', 'unicornio:rp'))],
  ['¿Quién es?: nivel 2', p => p.evaluate(() => { QUIEN.nv.elegir(1); go('quien'); })],
  ['¿Quién es?: recordar (nivel 5)', p => p.evaluate(() => { QUIEN.nv.elegir(4); go('quien'); })],
  ['¿Quién es?: buscar (nivel 5)', async p => { await clic(p, '#qnListo'); await p.waitForTimeout(300); }],
  ['Retos: lista', p => p.evaluate(() => go('retos'))],
  ['Retos: detective', retos('detective', 1, 'rDet')],
  ['Retos: tú preguntas', retos('detective', 2, 'rDet')],
  ['Retos: dos reglas', retos('tabla', 2, 'rTab')],
  ['Retos: ¿qué cambió?', retos('escena', 2, 'rEsc')],
];
function medir() {   // se ejecuta en la página
  const sc = document.querySelector('section.screen.on'), malos = [], chicos = [], R = [];
  // en el menú Pintar (del juego base) solo son de estas entregas los tres últimos botones
  const mias = sc.id === 'm-paint' ? [...sc.querySelectorAll('[data-go="puntos"], [data-go="repasar"], [data-go="grandes"]')] : null;
  const visible = e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || x.hidden) return false; } return e.getClientRects().length > 0; };
  const w = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const t = n.textContent.trim(), e = n.parentElement; if (!t || !e || e.closest('svg') || !/[a-záéíóúñ]/i.test(t) || !visible(e)) continue;
    if (mias && !mias.some(m => m.contains(e))) continue;
    const cs = getComputedStyle(e); if (cs.textTransform !== 'uppercase' && t !== t.toLocaleUpperCase('es')) malos.push(t.slice(0, 40));
    if (parseFloat(cs.fontSize) < 16) chicos.push(t.slice(0, 30) + ' ' + cs.fontSize); }
  const tocables = [...sc.querySelectorAll('button, [role=button], .pnOpt, .pnCard, .pnPad, .pnCelda')].filter(e => !e.closest('svg') && visible(e) && !e.closest('.pnIntro[hidden]'));
  const peque = [], fuera = []; tocables.forEach(e => { const r = e.getBoundingClientRect(); R.push([e, r]);
    if (Math.min(r.width, r.height) < 44 - .5) peque.push((e.id || e.className || e.tagName).toString().slice(0, 30) + ' ' + Math.round(r.width) + '×' + Math.round(r.height));
    if (r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) fuera.push((e.id || e.className).toString().slice(0, 30)); });
  let sol = []; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const [a, ra] = R[i], [b, rb] = R[j]; if (a.contains(b) || b.contains(a)) continue;
    if (ra.left < rb.right - 2 && rb.left < ra.right - 2 && ra.top < rb.bottom - 2 && rb.top < ra.bottom - 2) sol.push((a.id || a.className).toString().slice(0, 20) + '/' + (b.id || b.className).toString().slice(0, 20)); }
  const textos = [...sc.querySelectorAll('.pnTexto, .rtTexto span')].filter(visible).map(e => ({ t: e.textContent.trim(), px: parseFloat(getComputedStyle(e).fontSize), voz: e.classList.contains('lxVoz') || !!e.closest('.rtTexto'), pasos: e.querySelectorAll('.lxPaso').length }));
  const cortados = [...sc.querySelectorAll('.bar .title, .pnNv, .pnCamino, .rtCap, .lxCap, .reAbrir span')].filter(e => visible(e) && (e.scrollWidth > e.clientWidth + 1 || getComputedStyle(e).textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth)).map(e => e.textContent.trim().slice(0, 25));
  return { id: sc.id, malos, chicos, peque, fuera, sol: sol.slice(0, 4), textos, cortados, ancho: document.documentElement.scrollWidth <= innerWidth + 1 };
}

(async () => {
  execSync('python3 ' + CARP + 'preparar_copia.py', { cwd: RAIZ });
  const b = await pw.chromium.launch();
  for (const [dn, d] of Object.entries(DEV)) {
    const c = await b.newContext({ viewport: { width: d[0], height: d[1] }, hasTouch: true, isMobile: d[2], deviceScaleFactor: 1 }); await c.addInitScript(INIT);
    const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
    await p.goto(COPIA); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('stars', '37'); }); await p.reload(); await p.waitForTimeout(500);
    const fallos = { mayus: [], letra: [], tocar: [], cabe: [], mensajes: [] };
    for (const [nombre, llegar] of MOMENTOS) {
      await llegar(p); await p.waitForTimeout(700); const m = await p.evaluate(medir);
      if (m.malos.length) fallos.mayus.push(`${nombre}: ${m.malos.slice(0, 3).join(' | ')}`);
      if (m.chicos.length) fallos.letra.push(`${nombre}: ${m.chicos.slice(0, 3).join(' | ')}`);
      if (m.peque.length) fallos.tocar.push(`${nombre}: ${m.peque.slice(0, 3).join(' | ')}`);
      if (m.fuera.length || m.sol.length || !m.ancho || m.cortados.length) fallos.cabe.push(`${nombre}: fuera ${m.fuera.slice(0, 3).join(',')} encima ${m.sol.join(',')} cortado ${m.cortados.join(',')}`);
      m.textos.filter(x => x.t).forEach(x => { if (x.px < 22 || !x.voz) fallos.mensajes.push(`${nombre}: «${x.t.slice(0, 30)}» ${x.px}px voz:${x.voz}`); });
      if (dn === 'iPhone vertical' || dn === 'iPhone horizontal') await p.screenshot({ path: path.join(OUT, `${dn.replace(' ', '-')}-${nombre.replace(/[^a-z0-9áéíóúñ]+/gi, '-')}.png`.toLowerCase()) });
    }
    ok(`${dn}: todo el texto visible en MAYÚSCULAS (${MOMENTOS.length} momentos de los 10 juegos; en el menú Pintar, sus 3 botones)`, !fallos.mayus.length, fallos.mayus.slice(0, 3).join(' || '));
    ok(`${dn}: ninguna letra por debajo de 16 px`, !fallos.letra.length, fallos.letra.slice(0, 3).join(' || '));
    ok(`${dn}: mensajes a 22 px o más y con voz al tocarlos`, !fallos.mensajes.length, fallos.mensajes.slice(0, 3).join(' || '));
    ok(`${dn}: todo cabe (nada fuera, encima de otra cosa ni cortado con «…»)`, !fallos.cabe.length, fallos.cabe.slice(0, 3).join(' || '));
    ok(`${dn}: todo lo que se toca mide 44 px o más`, !fallos.tocar.length, fallos.tocar.slice(0, 3).join(' || '));
    if (dn === 'iPhone vertical') {
      // pasos breves y voz
      for (let k = 0; k < 15; k++) { await p.evaluate(() => { PENSAR.nvCt.elegir(7); go('contar'); }); await p.waitForTimeout(400); await sinIntro(p); await p.waitForTimeout(300);
        if (await p.evaluate(() => LECTURA.pasos(document.querySelector('#ctTexto').textContent.trim()).length >= 2)) break; }
      const ct = await p.evaluate(() => { const e = document.querySelector('#ctTexto'); return { t: e.textContent, pasos: e.querySelectorAll('.lxPaso').length, frases: LECTURA.pasos(e.textContent.trim()).length }; });
      ok('Un enunciado de varias frases (Contar, dos pasos) se ve en pasos: una frase por línea, sin cambiar lo que dice', ct.pasos === ct.frases && ct.frases >= 2, JSON.stringify(ct));
      const v0 = await p.evaluate(() => window.__voz.length); await clic(p, '#ctTexto'); await p.waitForTimeout(100);
      const v = await p.evaluate(() => ({ n: window.__voz.length, u: window.__voz.at(-1) }));
      ok('Al tocar el mensaje se oye entero (en minúsculas normales, para que la voz lo lea bien)', v.n === v0 + 1 && v.u === ct.t.trim() && v.u !== v.u.toLocaleUpperCase('es'), JSON.stringify(v));
      await clic(p, '#contar .bar .title'); await p.waitForTimeout(100);
      ok('Al tocar el título se oye el nombre del juego', await p.evaluate(() => window.__voz.at(-1)) === 'Contar');
      await p.evaluate(() => { QUIEN.nv.elegir(2); go('quien'); }); await p.waitForTimeout(500);
      const qn = await p.evaluate(() => ({ caps: [...document.querySelectorAll('#qnPistas .lxCap')].map(e => e.textContent), n: QUIEN.qn.caso.pistas.length }));
      await clic(p, '#qnPistas .qnPistaW >> nth=0'); await p.waitForTimeout(100);
      ok('¿Quién es?: cada pista con su palabra debajo («NO ES …», «ES …», «HAY …») y se oye al tocarla', qn.caps.length === qn.n && qn.caps.every(c => /^(No es|Es|Hay) /.test(c)) && /^(No )?[Ee]s|^Hay/.test(await p.evaluate(() => window.__voz.at(-1))), JSON.stringify(qn.caps));
      await p.evaluate(() => { QUIEN.nv.elegir(3); go('quien'); }); await p.waitForTimeout(400); await clic(p, '#qnListo'); await p.waitForTimeout(200);
      ok('¿Quién es?: con las pistas escondidas, también se esconden sus palabras (no se revela la respuesta)', await p.evaluate(() => [...document.querySelectorAll('#qnPistas .lxCap')].every(e => getComputedStyle(e).visibility === 'hidden')));
    }
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
