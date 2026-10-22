#!/usr/bin/env node
/* Prueba automática de la página «Comparar voces» (Chromium). Usa audios de PRUEBA generados aquí (un pitido), servidos
   solo durante la prueba: no se guarda ningún audio en el repositorio.
   Uso: python3 -m http.server 8765 &  →  node docs/propuestas/voz-2026-10-21/muestras/prueba-muestras.js [http://localhost:8765/] [carpeta] */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/'), URL = BASE + 'docs/propuestas/voz-2026-10-21/muestras/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-muestras-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
function wav(ms = 300, hz = 440) {   // WAV mono 16 bits, 8 kHz
  const n = Math.round(8 * ms), b = Buffer.alloc(44 + n * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(8000, 24); b.writeUInt32LE(16000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n * 2, 40); for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(8000 * Math.sin(2 * Math.PI * hz * i / 8000)), 44 + i * 2); return b; }
const JSON_PRUEBA = { muestras: [
  { servicio: 'Servicio Uno', voz: 'Voz uno', archivos: ['x-1.wav', 'x-2.wav', 'x-3.wav'] },
  { servicio: 'Servicio Dos', voz: 'Voz dos', archivos: ['y-1.wav', 'y-2.wav', 'y-3.wav'] },
  { servicio: 'Servicio Tres', voz: 'Voz tres', archivos: [null, null, null] }] };
(async () => {
  const b = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const errs = [];
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { errs.push('aviso: ' + d.message()); d.dismiss(); });
  // 1. sin audios: los tres huecos, pendientes
  await p.goto(URL); await p.waitForTimeout(500);
  ok('Con el muestras.json del repositorio: tres voces «pendientes» y sus botones desactivados', (await p.$$('.voz')).length === 3 && (await p.$$('.pend')).length === 3 && await p.$$eval('.voz [data-i]', x => x.every(b => b.disabled)));
  ok('A ciegas: no se ve de qué servicio es cada voz', await p.$$eval('.vdet', x => x.every(e => e.classList.contains('oculta'))));
  // 2. con audios de prueba
  await p.route('**/muestras/muestras.json', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(JSON_PRUEBA) }));
  await p.route('**/muestras/*.wav', r => r.fulfill({ contentType: 'audio/wav', body: wav() }));
  await p.reload(); await p.waitForTimeout(500);
  ok('Con audios: «Voz A» y «Voz B» listas y «Voz C» pendiente', (await p.$$eval('.vnom', x => x.map(e => e.textContent))).join() === 'Voz A,Voz B,Voz C' && (await p.$$('.pend')).length === 1);
  await p.click('.voz >> nth=0 >> [data-i="1"]'); await p.waitForTimeout(400);
  ok('▶ 2 reproduce la frase 2 de esa voz', (await p.evaluate(() => window.__ultimo)).join() === 'x-2.wav');
  await p.click('.voz >> nth=1 >> [data-i="todas"]'); await p.waitForTimeout(1500);
  ok('▶ Las tres reproduce las tres frases seguidas', (await p.evaluate(() => window.__ultimo)).join() === 'y-1.wav,y-2.wav,y-3.wav' && !(await p.$('.voz.sonando')));
  await p.click('.voz >> nth=1 >> [data-n="1"]'); await p.click('.voz >> nth=0 >> [data-n="2"]'); await p.click('.voz >> nth=2 >> [data-n="1"]');
  ok('Orden: cada puesto solo una vez (el 1.º pasa de B a C)', (await p.textContent('#resultado')) === '1.º Voz C\n2.º Voz A');
  await p.click('#destapar');
  ok('«Ver de qué servicio es» lo enseña en las voces y en el orden', /Servicio Tres/.test(await p.textContent('#resultado')) && await p.$$eval('.vdet', x => x.every(e => !e.classList.contains('oculta'))));
  await p.reload(); await p.waitForTimeout(500); ok('El orden se conserva al volver a abrir', /1\.º Voz C/.test(await p.textContent('#resultado')));
  await p.screenshot({ path: path.join(OUT, 'comparar-voces.png'), fullPage: true });
  ok('Sin desbordar a lo ancho', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  ok('Sin errores', !errs.length, errs.join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
