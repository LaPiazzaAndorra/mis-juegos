#!/usr/bin/env node
/* =====================================================================
   Prueba de las «copias viejas por el camino» (16/11/2026) · Chromium, app instalada simulada (iPhone)

   Lo que vio la propietaria: la app instalada decía «Versión del juego: 08d0743115d0», pero los juegos de Pensar eran
   los antiguos. La versión anterior (021c67e) ya tenía pensar.js, pensar.css y dibujos.js en las MISMAS direcciones: si
   por el camino (la red de GitHub, la caché de Safari) llega la copia vieja de esos archivos, el service worker de
   08d0743115d0 la guardaba sin comprobarla → número nuevo con juegos viejos.

   Uso (desde la raíz):  node herramientas/publicar/prueba-copias-viejas.js ANTIGUA INTERMEDIA NUEVA [capturas]
     ANTIGUA = main 021c67e · INTERMEDIA = main bd8dcbb (08d0743115d0) · NUEVA = lo que escribe preparar_publicacion.py
   El servidor de la prueba hace de «camino con copias viejas»: para pensar.js, pensar.css y dibujos.js responde con la
   copia de ANTIGUA a toda petición sin «r=» en la dirección (también con «?v=…», para obligar al segundo intento).
     1. Se reproduce el fallo: con ANTIGUA instalada y una partida, se publica INTERMEDIA → dice 08d0743115d0 y Pensar es
        el antiguo (sin ¿QUIÉN ES?, RETOS, UNIR PUNTOS, REPASAR, DIBUJOS POR PARTES).
     2. Se publica NUEVA (con el mismo camino de copias viejas): la instalación comprueba cada archivo con su huella, pide
        otra vez los que no coinciden, y al volver a abrir todo es de NUEVA (caché = disco, byte a byte); Pensar completo;
        Ajustes: «… · N de N archivos comprobados ✓»; la partida sigue igual.
     3. Si aun así un archivo de la caché no es el bueno (se estropea a propósito), al abrir se detecta, se vuelve a
        descargar comprobado, avisa «Juego corregido» y al tocar «Abrir» está bien.
     4. Si el camino SOLO da copias viejas (sin arreglo posible), la versión nueva NO se instala y sigue la anterior entera.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs'), http = require('http'), crypto = require('crypto');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const [ANTIGUA, INTERMEDIA, NUEVA] = process.argv.slice(2, 5).map(p => path.resolve(p));
const OUT = process.argv[5] || fs.mkdtempSync(path.join(os.tmpdir(), 'copias-viejas-')); fs.mkdirSync(OUT, { recursive: true });
const PUERTO = 8793, URL0 = `http://localhost:${PUERTO}/mis-juegos/`, APP = URL0 + 'index.html';
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const P = 'docs/propuestas/pensar-2026-11-04/', VIEJOS = [P + 'pensar.js', P + 'pensar.css', P + 'dibujos.js'];
let carpeta = ANTIGUA, camino = 'limpio';   // limpio | viejo (copias viejas salvo con «r=») | siempre (copias viejas siempre)
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x'); let f = decodeURIComponent(u.pathname).replace(/^\/mis-juegos\//, ''); if (f === '' || f.endsWith('/')) f += 'index.html';
  let dir = carpeta;
  if (VIEJOS.includes(f) && (camino === 'siempre' || (camino === 'viejo' && !u.searchParams.has('r')))) dir = ANTIGUA;
  const p = path.join(dir, f); if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': TIPOS[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); r.end(fs.readFileSync(p));
});
const INIT = () => { const mm = window.matchMedia.bind(window);
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true }); };
const PARTIDA = { stars: '37', lv_contar: '{"v":1,"L":2,"max":2,"ok":1,"apuros":0,"prueba":""}', lv_retos: '{"ultimo":"tabla"}', lv_etapas: '{"e":1}', mm_necesidades: '{"hambre":40}', scKey: '"casa"' };
const md5 = b => crypto.createHash('md5').update(b).digest('hex');

(async () => {
  await new Promise(r => srv.listen(PUERTO, r));
  const b = await pw.chromium.launch(); const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await c.addInitScript(INIT); const errs = [];
  let p = null;
  const abrir = async () => { if (p) await p.close(); p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto(APP); await p.waitForTimeout(1500); };
  const esperar = async (f, ms = 60000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(f).catch(() => false)) return true; await p.waitForTimeout(300); } return false; };
  const estado = () => p.evaluate(() => ({ version: window.OFFLINE && OFFLINE.version, think: (go('m-think'), [...document.querySelectorAll('#m-think .big')].map(b => b.dataset.go)),
    paint: (go('m-paint'), [...document.querySelectorAll('#m-paint .big')].map(b => b.dataset.go)), datos: Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, localStorage[k]])),
    cachés: null })).then(async e => { await p.evaluate(() => go('home')); e.cachés = await p.evaluate(() => caches.keys()); return e; });
  const pensarCompleto = e => ['quien', 'retos'].every(g => e.think.includes(g)) && ['puntos', 'repasar', 'grandes'].every(g => e.paint.includes(g));
  const instalarNueva = async (limpiar = false) => {   // como en el iPhone: la versión nueva se instala y espera; se cierra la app y se vuelve a abrir
    await p.reload(); await p.waitForTimeout(800); await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update())).catch(() => {});
    const t = Date.now(); let st;
    while (Date.now() - t < 60000) { st = await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => ({ w: !!r.waiting, i: !!r.installing }))); if (st.w || (!st.i && Date.now() - t > 8000)) break; await p.waitForTimeout(400); }
    await p.close(); p = null; if (limpiar) errs.length = 0;   // lo de antes de cerrar era la versión rota (paso 1)
    await abrir();
    for (let k = 0; k < 3 && (await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => !!r.waiting))); k++) { await p.waitForTimeout(800); await abrir(); }
    return st;
  };
  const cacheIgualQueDisco = async dir => {
    const lista = await p.evaluate(() => OFFLINE.basico.filter(u => u !== './'));
    const cach = await p.evaluate(async l => { const c = await caches.open('mis-juegos-' + OFFLINE.version), o = {};
      for (const u of l) { const r = await c.match(new URL(u, location.href).href); o[u] = r ? [...new Uint8Array(await r.arrayBuffer())] : null; } return o; }, lista);
    const mal = lista.filter(u => !cach[u] || md5(Buffer.from(cach[u])) !== md5(fs.readFileSync(path.join(dir, u))));
    return { total: lista.length, mal };
  };

  // ---------- 0. la versión antigua instalada, con una partida ----------
  carpeta = ANTIGUA; camino = 'limpio'; await abrir();
  await esperar(() => !!navigator.serviceWorker.controller) || await abrir();
  await esperar(() => !!navigator.serviceWorker.controller);
  await p.evaluate(d => { for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v); }, PARTIDA); await p.reload(); await p.waitForTimeout(1000);
  const e0 = await estado();
  ok('Versión anterior instalada y controlando la app, con una partida', !!e0.version && e0.datos.stars === '37', `${e0.version} · ${e0.cachés}`);

  // ---------- 1. reproducir el fallo con INTERMEDIA (08d0743115d0) y el camino de copias viejas ----------
  carpeta = INTERMEDIA; camino = 'viejo'; await instalarNueva();
  const e1 = await estado();
  ok('Reproducido: dice la versión nueva pero Pensar es el antiguo (copias viejas guardadas sin comprobar)', e1.version === '08d0743115d0' && !pensarCompleto(e1),
    `versión ${e1.version} · Pensar: ${e1.think.join(',')} · Pintar: ${e1.paint.join(',')}`);
  await p.evaluate(() => go('m-think')); await p.waitForTimeout(500); await p.screenshot({ path: path.join(OUT, '1-fallo-pensar-antiguo.png') }); await p.evaluate(() => go('home'));
  const d1 = await cacheIgualQueDisco(INTERMEDIA);
  ok('… y la caché tiene archivos que no son los publicados', d1.mal.length > 0, d1.mal.join(', '));
  ok('… y da errores (el pensar.js viejo con los juegos nuevos)', errs.length > 0, errs[0]); errs.length = 0;

  // ---------- 2. publicar NUEVA con el mismo camino de copias viejas ----------
  carpeta = NUEVA; camino = 'viejo'; await instalarNueva(true);
  await esperar(() => window.OfflineEstado && OfflineEstado.comprobados, 30000);
  const e2 = await estado(), d2 = await cacheIgualQueDisco(NUEVA), nueva = JSON.parse(fs.readFileSync(path.join(NUEVA, 'offline-lista.js'), 'utf8').replace(/^[^]*?self\.OFFLINE = /, '').replace(/;\s*$/, ''));
  ok('NUEVA entra y se queda sola (una caché, la suya)', e2.version === nueva.version && e2.cachés.length === 1 && e2.cachés[0] === 'mis-juegos-' + nueva.version, `${e2.version} · ${e2.cachés}`);
  ok('Todo lo que sirve la caché es de NUEVA, byte a byte (también pensar.js, pensar.css y dibujos.js)', d2.mal.length === 0, `${d2.total - d2.mal.length}/${d2.total}` + (d2.mal.length ? ' · mal: ' + d2.mal.join(', ') : ''));
  ok('Pensar completo: ¿QUIÉN ES? y RETOS en Pensar; UNIR PUNTOS, REPASAR y DIBUJOS POR PARTES en Pintar', pensarCompleto(e2), `Pensar: ${e2.think.join(',')} · Pintar: ${e2.paint.join(',')}`);
  for (const [id, sel] of [['retos', '#retos'], ['grandes', '#grandes'], ['repasar', '#repasar']]) {
    const vis = await p.evaluate(([i, s]) => { const b = [...document.querySelectorAll('.big')].find(x => x.dataset.go === i); if (!b) return false; b.click(); const el = document.querySelector(s); return !!el && el.classList.contains('on') && el.innerText.trim().length > 0; }, [id, sel]);
    await p.waitForTimeout(700); await p.screenshot({ path: path.join(OUT, `2-${id}.png`) });
    ok(`Se abre ${id === 'grandes' ? 'DIBUJOS POR PARTES' : id.toUpperCase()} con su contenido`, vis);
    await p.evaluate(() => go('home'));
  }
  const ajustes = await p.evaluate(() => (document.getElementById('verApp') || {}).textContent || '');
  ok('Ajustes: versión y todos los archivos comprobados', new RegExp(`${nueva.version} · (\\d+) de \\1 archivos comprobados ✓`).test(ajustes), ajustes);
  ok('La partida sigue igual (estrellas, niveles de Pensar, Mi Mundo)', JSON.stringify(e2.datos) === JSON.stringify(e0.datos), Object.keys(e2.datos).join(','));

  // ---------- 3. un archivo estropeado en la caché: se detecta y se arregla al abrir ----------
  camino = 'limpio';
  await p.evaluate(async () => { const c = await caches.open('mis-juegos-' + OFFLINE.version); await c.put(new URL('docs/propuestas/pensar-2026-11-04/retos.js', location.href).href, new Response('/* estropeado */', { headers: { 'Content-Type': 'text/javascript' } })); });
  await abrir(); const corr = await esperar(() => window.OfflineEstado && OfflineEstado.comprobados && /Juego corregido/.test(OfflineEstado.texto()), 30000);
  ok('Archivo estropeado en la caché → se detecta, se vuelve a descargar y avisa «Juego corregido»', corr, JSON.stringify(await p.evaluate(() => OfflineEstado.comprobados)));
  await p.screenshot({ path: path.join(OUT, '3-corregido.png') });
  await p.evaluate(() => document.querySelector('#offlineAviso button').click()); await p.waitForTimeout(1800);
  const d3 = await cacheIgualQueDisco(NUEVA);
  ok('Al tocar «Abrir»: todo bien y RETOS funciona', d3.mal.length === 0 && await p.evaluate(() => typeof window.RETOS !== 'undefined' || !!document.querySelector('#m-think .big[data-go="retos"]')), d3.mal.join(', '));

  // ---------- 4. si el camino solo da copias viejas, la versión nueva no se instala ----------
  const otra = fs.mkdtempSync(path.join(os.tmpdir(), 'otra-')); execSync(`cp -a "${NUEVA}/." "${otra}/"`);
  const lst = path.join(otra, 'offline-lista.js'), sw = path.join(otra, 'sw.js');
  for (const f of [lst, sw]) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').split(nueva.version).join('ffffffffffff'));
  carpeta = otra; camino = 'siempre'; await instalarNueva();
  await esperar(() => navigator.serviceWorker.getRegistration().then(r => !r.installing && !r.waiting).then(x => x && caches.keys().then(k => k.length === 1)), 60000);
  const e4 = await estado();
  ok('Copias viejas sin arreglo: la versión nueva NO se instala y sigue la anterior entera', e4.version === nueva.version && e4.cachés.length === 1 && pensarCompleto(e4) && (await cacheIgualQueDisco(NUEVA)).mal.length === 0, `${e4.version} · ${e4.cachés}`);
  ok('La partida sigue igual', JSON.stringify(e4.datos) === JSON.stringify(e0.datos));
  ok('Sin errores de JavaScript', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close(); srv.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
