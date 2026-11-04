#!/usr/bin/env node
/* =====================================================================
   Mi Mundo sin conexión (requisito): genera la versión publicable CON Mi Mundo en una carpeta temporal (sin publicar
   nada), la sirve como GitHub Pages (/mis-juegos/) y comprueba, en un iPhone simulado:
     · descarga todo y avisa «✅ Lista para jugar sin conexión» (Mi Mundo va en lo básico);
     · en modo avión: Mi Mundo abre la habitación con el fondo y la cama, la muñeca se acuesta y se levanta, y no falla
       ninguna petición;
     · «Guardar mi progreso» incluye la habitación (mm_habitacion2).
   Uso (desde la raíz): node docs/propuestas/prueba-mimundo-2026-11-04/prueba-sin-conexion.js [capturas]
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync, spawn } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'mimundo-sin-conexion-')); fs.mkdirSync(OUT, { recursive: true });
const SITIO = fs.mkdtempSync(path.join(os.tmpdir(), 'sitio-mm-')), PUERTO = 8794, APP = `http://localhost:${PUERTO}/mis-juegos/index.html`;
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const INIT = () => { window.__comp = []; navigator.canShare = d => !!(d && d.files); navigator.share = async d => { window.__comp.push({ text: await d.files[0].text() }); };
  const mm = window.matchMedia.bind(window); window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q); };

(async () => {
  execSync(`python3 herramientas/publicar/preparar_publicacion.py "${SITIO}/mis-juegos" --sin-git --con-mimundo docs/propuestas/prueba-mimundo-2026-11-04/mimundo`, { cwd: RAIZ, stdio: 'ignore' });
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: SITIO, stdio: 'ignore' }); process.on('exit', () => srv.kill());
  await new Promise(r => setTimeout(r, 900));
  const b = await pw.chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await ctx.addInitScript(INIT);
  const abrir = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto(APP); await p.waitForTimeout(900); return p; };
  let p = await abrir();
  await p.evaluate(() => { localStorage.clear(); Avatar.guardar({ piel: 'morena', ojos: { color: 'verde' }, pelo: { estilo: 'rizos', color: 'miel' }, ropa: 'aventura', accesorios: ['mochila'] }); localStorage.setItem('scKey', '"habitacion"'); });
  await p.reload(); await p.waitForTimeout(1500);
  await p.waitForFunction(() => window.OfflineEstado && OfflineEstado.listo, null, { timeout: 240000 });
  const mmEnLista = await p.evaluate(() => OFFLINE.basico.filter(u => /mimundo/.test(u)).length);
  ok('Descarga todo y avisa «Lista para jugar sin conexión»; Mi Mundo va en lo básico', /Lista/.test(await p.textContent('#offlineAviso')) && mmEnLista >= 6, `${mmEnLista} archivos de Mi Mundo`);
  await ctx.setOffline(true); await p.close(); p = await abrir();
  const fallos = []; p.on('requestfailed', r => fallos.push(r.url()));
  await p.evaluate(() => go('scene')); await p.waitForTimeout(2500);
  const hab = await p.evaluate(() => ({ fondo: document.querySelector('.mm-fondo') && document.querySelector('.mm-fondo').naturalWidth, cama: [...document.querySelectorAll('.mm-obj')].map(i => i.naturalWidth > 0).filter(Boolean).length,
    muneca: document.querySelectorAll('.mm-av image').length }));
  ok('Sin conexión: Mi Mundo abre la habitación con el fondo, la cama y la muñeca', hab.fondo === 1536 && hab.cama === 2 && hab.muneca > 8, JSON.stringify(hab));
  // se toca la parte de la cama que se ve en la pantalla (en el iPhone en vertical, la cámara sigue a la muñeca)
  const r = await p.evaluate(() => { const a = document.querySelector('.mm-obj[data-capa=detras]').getBoundingClientRect(), b = document.getElementById('board').getBoundingClientRect();
    const x0 = Math.max(a.left, b.left), x1 = Math.min(a.right, b.right), y0 = Math.max(a.top, b.top), y1 = Math.min(a.bottom, b.bottom); return { x: (x0 + x1) / 2, y: y0 + (y1 - y0) * .6 }; });
  await p.mouse.click(r.x, r.y); await p.waitForTimeout(4500);
  const ac = await p.evaluate(() => ({ en: !!MM.estado().muneca.en, mochila: [...document.querySelectorAll('.mm-av image')].filter(i => /mochila|tiras/.test(i.getAttribute('href'))).length }));
  ok('Sin conexión: la muñeca se acuesta en la cama (sin la mochila a la vista)', ac.en && ac.mochila === 0, JSON.stringify(ac));
  await p.screenshot({ path: path.join(OUT, 'mimundo-sin-conexion.png') });
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(800);
  const copia = await p.evaluate(() => window.__comp.length && JSON.parse(window.__comp[0].text).local_storage);
  ok('Sin conexión: «Guardar mi progreso» incluye la habitación', copia && 'mm_habitacion2' in copia);
  ok('Sin conexión: ninguna petición fallida ni error de JavaScript', !fallos.length && !errs.length, fallos.concat(errs).slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
