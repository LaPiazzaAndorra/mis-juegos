#!/usr/bin/env node
/* Prueba automática de la página de voces (Chromium, con una lista de voces SIMULADA como la de un iPhone).
   No comprueba cómo suenan (eso solo se puede en el iPhone): comprueba que la página encuentra, ordena y etiqueta las
   voces, que habla con la voz, velocidad y tono elegidos, las favoritas y que no toca datos del juego.
   Uso: python3 -m http.server 8765 &  →  node docs/propuestas/voz-2026-10-21/prueba-voz.js [http://localhost:8765/] [carpeta] */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/'), URL = BASE + 'docs/propuestas/voz-2026-10-21/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-voz-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const VOCES = [
  ['Mónica', 'es-ES', 'com.apple.voice.compact.es-ES.Monica', true], ['Jorge', 'es-ES', 'com.apple.voice.compact.es-ES.Jorge', true],
  ['Paulina', 'es-MX', 'com.apple.voice.compact.es-MX.Paulina', true], ['Marisol (mejorada)', 'es-ES', 'com.apple.voice.enhanced.es-ES.Marisol', true],
  ['Mónica (premium)', 'es-ES', 'com.apple.voice.premium.es-ES.Monica', true], ['Abuela', 'es-ES', 'com.apple.eloquence.es-ES.Grandma', true],
  ['Burbujas', 'es-ES', 'com.apple.speech.synthesis.voice.Bubbles', true], ['Samantha', 'en-US', 'com.apple.voice.compact.en-US.Samantha', true]];
const MOCK = v => { const voces = v.map(([name, lang, voiceURI, localService], i) => ({ name, lang, voiceURI, localService, default: i === 0 }));
  window.__dicho = []; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => voces, cancel() {}, speak(u) { window.__dicho.push({ t: u.text, v: u.voice && u.voice.voiceURI, r: u.rate, p: u.pitch }); setTimeout(() => u.onend && u.onend(), 10); }, onvoiceschanged: null } });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; }; };
(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await c.addInitScript(MOCK, VOCES); const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE + 'index.html?arte=svg'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('stars', '37'); localStorage.setItem('voice', 'x'); localStorage.setItem('tone', '1'); });
  await p.goto(URL); await p.waitForTimeout(700);
  const nombres = await p.$$eval('#lista .voz .vnom', x => x.map(e => e.textContent));
  ok('Solo voces en español; las de efectos, ocultas', nombres.length === 5 && !nombres.includes('Samantha') && !nombres.includes('Abuela') && !nombres.includes('Burbujas'), nombres.join(', '));
  ok('Primero las de calidad alta (Premium, Mejorada)', nombres[0] === 'Mónica (premium)' && nombres[1] === 'Marisol (mejorada)');
  ok('Cuenta las voces y las de calidad alta', /<b>8<\/b>.*<b>7<\/b>.*<b>2<\/b>/.test(await p.innerHTML('#cuenta')));
  await p.click('#verEfectos'); ok('Se pueden ver también las de efectos', (await p.$$('#lista .voz')).length === 7); await p.click('#verEfectos');
  await p.click('#lista .voz >> nth=0 >> [data-f="0"]'); await p.waitForTimeout(150);
  let d = await p.evaluate(() => window.__dicho.at(-1));
  ok('▶ 1 dice la frase 1 con esa voz, velocidad 1 y tono 1 (natural)', d.t === '¡Hola, Amaia! ¿Jugamos juntas?' && d.v === 'com.apple.voice.premium.es-ES.Monica' && d.r === 1 && d.p === 1);
  await p.evaluate(() => { const s = document.querySelector('#vel'); s.value = .9; s.oninput(); const t = document.querySelector('#ton'); t.value = 1.1; t.oninput(); });
  await p.click('#lista .voz >> nth=1 >> [data-f="todas"]'); await p.waitForTimeout(250);
  d = await p.evaluate(() => window.__dicho.slice(-3));
  ok('«Las tres» dice las tres frases seguidas con la velocidad y el tono elegidos', d.length === 3 && d.map(x => x.t).join('|') === '¡Hola, Amaia! ¿Jugamos juntas?|Cuenta las bolas de helado.|¡Lo has conseguido! Puedes abrir tu cofre.' && d.every(x => x.r === .9 && x.p === 1.1 && x.v === 'com.apple.voice.enhanced.es-ES.Marisol'));
  await p.click('#comoJuego'); await p.waitForTimeout(150); d = await p.evaluate(() => window.__dicho.at(-1));
  ok('«Así suena ahora el juego»: la voz que elegiría el juego (misma regla; con este empate, Marisol) con tono 1,45 y velocidad 0,95', d.v === 'com.apple.voice.enhanced.es-ES.Marisol' && d.p === 1.45 && d.r === .95);
  await p.click('#lista .voz >> nth=1 >> .fav'); await p.waitForTimeout(100);
  const favs = await p.textContent('#favs');
  ok('⭐ guarda la favorita con su velocidad y tono, lista para copiar', /Marisol \(mejorada\).*velocidad 0,90 · tono 1,10/.test(favs) && /enhanced\.es-ES\.Marisol/.test(favs));
  await p.reload(); await p.waitForTimeout(600); ok('Las favoritas se conservan al volver a abrir', /Marisol/.test(await p.textContent('#favs')));
  await p.screenshot({ path: path.join(OUT, 'voces-iphone.png'), fullPage: true });
  await p.goto(BASE + 'index.html?arte=svg');
  ok('No toca los datos del juego (estrellas, voz y tono elegidos)', await p.evaluate(() => localStorage.getItem('stars') === '37' && localStorage.getItem('voice') === 'x' && localStorage.getItem('tone') === '1'));
  // sin voces
  const c2 = await b.newContext({ viewport: { width: 390, height: 844 } }); await c2.addInitScript(MOCK, []); const q = await c2.newPage(); q.on('pageerror', e => errs.push(e.message));
  await q.goto(URL); await q.waitForTimeout(3800); ok('Sin voces: lo dice en vez de quedarse en blanco', /No se han encontrado voces/.test(await q.textContent('#cuenta')));
  // sin voces de calidad alta
  const c3 = await b.newContext({ viewport: { width: 820, height: 1180 } }); await c3.addInitScript(MOCK, VOCES.slice(0, 3)); const r = await c3.newPage(); r.on('pageerror', e => errs.push(e.message));
  await r.goto(URL); await r.waitForTimeout(600); ok('Si no hay ninguna de calidad alta, lo dice claramente', /No hay ninguna de calidad alta/.test(await r.textContent('#cuenta')));
  await r.screenshot({ path: path.join(OUT, 'voces-ipad.png'), fullPage: true });
  ok('Sin desbordar a lo ancho', await p.evaluate(() => true) && await r.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  ok('Sin errores de JavaScript', !errs.length, errs.join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
