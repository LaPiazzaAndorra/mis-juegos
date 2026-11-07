#!/usr/bin/env node
/* =====================================================================
   Prueba SIN CONEXIÓN de los juegos de Pensar como quedarían al integrarlos (Chromium; iPhone instalado simulado)

   Uso (desde la raíz del repositorio):
     node docs/propuestas/pensar-2026-11-04/prueba-sin-conexion.js [carpeta-capturas]
   1. simular_publicacion.py escribe en una carpeta TEMPORAL el juego publicado + Pensar con el generador de
      publicación de avatar-creador (sin modificarlo); nada va al repositorio ni a main;
   2. se sirve como GitHub Pages (/mis-juegos/), se abre con una partida, espera «Lista para jugar sin conexión»;
   3. en modo avión: Contar, Memoria (parejas, ¿dónde estaba?, serie), ¿Qué sigue?, Sombras, El diferente y Unir
      puntos (con pintar y guardar) funcionan, sin peticiones fallidas ni errores, y la partida no se pierde.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync, spawn } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'sin-conexion-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const SITIO = fs.mkdtempSync(path.join(os.tmpdir(), 'sitio-pensar-')), DEST = path.join(SITIO, 'mis-juegos');
const PUERTO = 8793, APP = `http://localhost:${PUERTO}/mis-juegos/index.html`;
const INIT = () => { const mm = window.matchMedia.bind(window); window.__voz = [];
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true });
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [], cancel() {}, speak(u) { window.__voz.push(u.text); }, onvoiceschanged: null } });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; }; };
const PARTIDA = { stars: '37', gal: '[]', iceCoins: '5', lv_contar: '8', lv_sigue: '3', avatar: '{"v":1}', sound: 'true' };

(async () => {
  const sal = execSync(`python3 ${path.join(__dirname, 'simular_publicacion.py')} "${DEST}"`, { cwd: RAIZ }).toString().trim();
  const lista = fs.readFileSync(path.join(DEST, 'offline-lista.js'), 'utf8');
  ok('Simulación escrita fuera del repositorio con Pensar en la lista para jugar sin conexión', ['pensar.css', 'dibujos.js', 'pensar.js', 'figuras.js', 'pensar2.js', 'repasar.js'].every(f => lista.includes('pensar-2026-11-04/' + f)) &&
    execSync('git status --porcelain', { cwd: RAIZ }).toString().split('\n').every(l => !l || l.includes('pensar-2026-11-04/')), sal);
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: SITIO, stdio: 'ignore' });
  process.on('exit', () => srv.kill()); await new Promise(r => setTimeout(r, 900));
  const b = await pw.chromium.launch(), errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await ctx.addInitScript(INIT);
  const abrir = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto(APP); await p.waitForTimeout(900); return p; };
  let p = await abrir();
  await p.evaluate(d => { localStorage.clear(); for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v); }, PARTIDA); await p.reload(); await p.waitForTimeout(800);
  await p.waitForFunction(() => window.OfflineEstado && OfflineEstado.listo, null, { timeout: 300000 });
  ok('Con conexión: descarga todo y avisa «Lista para jugar sin conexión»', /Lista para jugar sin conexión/.test(await p.textContent('#offlineAviso')));
  // ---------- modo avión ----------
  await ctx.setOffline(true); await p.close(); p = await abrir(); const fallidas = []; p.on('requestfailed', r => fallidas.push(r.url()));
  ok('Sin conexión: abre con la partida (⭐ 37) y con los juegos de Pensar cargados', await p.textContent('.sc') === '37' && await p.evaluate(() => !!(window.PENSAR && window.PENSAR2 && window.FIGURAS)));
  const resp = async (sel, okFn) => { const i = await p.evaluate(okFn); await p.click(sel(i), { force: true }); };
  // Contar (empieza en el nivel 2 por lv_contar 8)
  await p.evaluate(() => go('contar')); await p.waitForTimeout(500); await p.click('#contar .pnNo'); await p.waitForTimeout(500);
  const s0 = await p.evaluate(() => stars); const r = await p.evaluate(() => PENSAR.ct.item.resp);
  await p.click(`#ctOpts .pnOpt:has-text("${r}") >> nth=0`); await p.waitForTimeout(300);
  ok('Sin conexión: Contar (nivel 2 por el avance de antes; +1 ⭐)', await p.evaluate(() => PENSAR.nvCt.get().L) === 1 && await p.evaluate(() => stars) === s0 + 1);
  // Memoria
  let mem = true;
  for (const s of ['parejas', 'donde', 'serie']) { await p.evaluate(s => go(s), s); await p.waitForTimeout(700);
    const n = await p.evaluate(s => document.querySelectorAll({ parejas: '#pjGrid .pnCard svg', donde: '#doTablero .pnCelda, #donde .pnIntro:not([hidden])', serie: '#sePads .pnPad svg, #serie .pnIntro:not([hidden])' }[s]).length, s); if (!n) mem = false; }
  ok('Sin conexión: Memoria (parejas, ¿dónde estaba?, serie) con sus dibujos', mem);
  // ¿Qué sigue?, Sombras, El diferente
  let obs = [];
  for (const m of ['sigue', 'sombras', 'distinto']) { await p.evaluate(m => { PENSAR2.JUEGOS[m].nv.marcar('x'); go('obs', m); }, m); await p.waitForTimeout(600);
    const t0 = await p.evaluate(() => stars); const i = await p.evaluate(() => PENSAR2.ob.item.opts.findIndex(o => o.ok));
    await p.click(`#obs .pnOpt[data-i="${i}"]`, { force: true }); await p.waitForTimeout(300); obs.push(await p.evaluate(() => stars) === t0 + 1); }
  ok('Sin conexión: ¿Qué sigue? (empieza en su nivel), Sombras y El diferente', obs.every(Boolean) && await p.evaluate(() => PENSAR2.JUEGOS.sigue.nv.get().L) === 0);
  // Unir puntos, pintar y guardar
  await p.evaluate(() => go('puntos')); await p.waitForTimeout(600);
  const n = await p.evaluate(() => PENSAR2.pu.pts.length);
  for (let i = 1; i < n; i++) { const q = await p.evaluate(i => { const g = document.querySelector('#puSvg'), pt = g.createSVGPoint(); [pt.x, pt.y] = PENSAR2.pu.pts[i]; const s = pt.matrixTransform(g.getScreenCTM()); return [s.x, s.y]; }, i); await p.mouse.click(...q); }
  await p.waitForTimeout(1200); await p.click('#puPintar'); await p.waitForTimeout(1200);
  const r0 = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
  await p.mouse.click(r0.x + r0.width / 2, r0.y + r0.height / 2); await p.waitForTimeout(200); await p.click('#saveBtn'); await p.waitForTimeout(300);
  ok('Sin conexión: Unir puntos → pintar con el cubo → guardar en «Mis dibujos»', await p.evaluate(() => JSON.parse(localStorage.getItem('gal')).length) === 1);
  // Repasar dibujos: recorrer el camino, pintar y guardar
  await p.evaluate(() => go('repasar')); await p.waitForTimeout(600);
  const nt = await p.evaluate(() => REPASAR.rp.tr.length);
  for (let k = 0; k < nt; k++) { const pts = await p.evaluate(() => { const T = REPASAR.rp.tr[REPASAR.rp.k], g = document.querySelector('#rpSvg'), M = g.getScreenCTM(), o = [];
      for (let i = 0; i <= 50; i++) { const q = T.guia.getPointAtLength(T.L * i / 50), pt = g.createSVGPoint(); pt.x = q.x; pt.y = q.y; const r = pt.matrixTransform(M); o.push([r.x, r.y]); } return o; });
    await p.mouse.move(...pts[0]); await p.mouse.down(); for (const q of pts.slice(1)) await p.mouse.move(...q, { steps: 2 }); await p.mouse.up(); }
  await p.waitForTimeout(1200); await p.click('#rpPintar'); await p.waitForTimeout(1200);
  const r1 = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
  await p.mouse.click(r1.x + r1.width / 2, r1.y + r1.height / 2); await p.waitForTimeout(200); await p.click('#saveBtn'); await p.waitForTimeout(300);
  ok('Sin conexión: Repasar → pintar con el cubo → guardar en «Mis dibujos»', await p.evaluate(() => JSON.parse(localStorage.getItem('gal')).length) === 2);
  await p.screenshot({ path: path.join(OUT, 'sin-conexion-pintar.png') });
  const d = await p.evaluate(ks => Object.fromEntries(ks.map(k => [k, localStorage.getItem(k)])), Object.keys(PARTIDA));
  ok('La partida se conserva (solo suman estrellas y el dibujo nuevo)', ['iceCoins', 'lv_contar', 'lv_sigue', 'avatar', 'sound'].every(k => d[k] === PARTIDA[k]) && +d.stars > 37);
  ok('Sin conexión: ninguna petición fallida y sin errores de JavaScript', !fallidas.length && !errs.length, fallidas.concat(errs).slice(0, 3).join(' | '));
  await b.close(); srv.kill(); fs.rmSync(SITIO, { recursive: true, force: true });
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
