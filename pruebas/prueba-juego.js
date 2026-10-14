#!/usr/bin/env node
/* =====================================================================
   Mi Mundo de Juegos · prueba automática de regresión (navegador real)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &          # servir el juego
     node pruebas/prueba-juego.js            # o: node pruebas/prueba-juego.js http://localhost:8765/ /tmp/capturas

   Necesita Node y Playwright con Chromium (npm i -g playwright; npx playwright install chromium).
   Las capturas se guardan FUERA del repositorio (por defecto en el directorio temporal):
   nunca las añadas a Git salvo como evidencia en docs/capturas/.

   Comprueba, en iPad (1180×820) e iPhone horizontal (852×393):
     · el juego abre sin errores y los datos antiguos simulados no se pierden;
     · «Vestir» con la muñeca que corresponda, guardar y recuperar tras recargar;
     · «Mi Mundo»: habitación, personaje y cama;
     · muñeca vectorial (?arte=svg) y muñeca premium en borrador (?arte=borrador, parpadeo);
     · copia de seguridad: copiar, borrar, restaurar y volver a leer en el juego.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'mis-juegos-capturas-'));
const ANTIGUOS = { stars: '37', gal: JSON.stringify(['data:image/png;base64,iVBORw0KGgo=']), doll: '{"skin":3,"hc":3,"hs":2}', sc_casa: '[{"e":"🐶","x":50,"y":50,"s":13,"f":1}]', lv_contar: '2', iceCoins: '5', sound: 'true' };
const resultados = [];
const ok = (nombre, cond, extra = '') => { resultados.push([!!cond, nombre, extra]); console.log((cond ? '  ✅ ' : '  ❌ ') + nombre + (extra ? ' · ' + extra : '')); };

async function sembrar(p) {
  await p.goto(BASE + 'index.html');
  await p.evaluate(d => { localStorage.clear(); for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v); }, ANTIGUOS);
}
const leerLS = p => p.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])));

async function flujo(b, W, H, dpr, tag) {
  console.log(`\n· ${tag} (${W}×${H})`);
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: dpr });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await sembrar(p); await p.reload(); await p.waitForTimeout(400);
  const juego = await p.evaluate(() => Avatar.JUEGO || Avatar.MODO);
  ok('El juego abre', await p.$('#home'), `muñeca: ${juego}`);
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(OUT, `${tag}-vestir.png`) });
  const pestanas = await p.$$eval('#dtabs .btn', bs => bs.map(x => x.textContent));
  ok('«Vestir» muestra el personaje', await p.$('#avStage svg.av'), `pestañas: ${pestanas.join(' ') || '—'}`);
  if (pestanas.length) { await p.click('#dtabs .btn:last-child'); await p.waitForTimeout(250); const n = await p.$$('#dopts .avopt'); if (n.length > 1) { await n[1].click(); await p.waitForTimeout(800); } }
  const elegido = await p.evaluate(() => JSON.stringify(Avatar.normalizar(avSt)));
  await p.click('#dSave'); await p.waitForTimeout(400);
  await p.reload(); await p.waitForTimeout(400);
  ok('El personaje se recupera tras recargar', await p.evaluate(e => { const g = Avatar.cargar(); return g && JSON.stringify(Object.assign({}, g, { guardado: undefined })) === JSON.stringify(Object.assign(JSON.parse(e), { guardado: undefined })); }, elegido));
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1600);
  ok('«Mi Mundo» muestra la habitación y el personaje', await p.evaluate(() => !!document.querySelector('#roomLayer svg') && document.querySelector('#walker').classList.contains('on')));
  const cama = await p.locator('[data-obj=cama] path[fill="url(#qt)"]').boundingBox();
  await p.mouse.click(cama.x + cama.width / 2, cama.y + cama.height / 2); await p.waitForTimeout(2600);
  ok('El personaje se acuesta en la cama', await p.evaluate(() => document.querySelector('#roomLayer svg').classList.contains('sleeping')));
  await p.screenshot({ path: path.join(OUT, `${tag}-mundo.png`) });
  const ls = await leerLS(p);
  const perdidos = Object.keys(ANTIGUOS).filter(k => k !== 'stars' && ls[k] !== ANTIGUOS[k]);
  ok('Los datos antiguos siguen intactos', !perdidos.length, perdidos.length ? 'cambiados: ' + perdidos.join(', ') : 'stars puede subir al guardar');
  ok('Sin errores de JavaScript', !errs.length, errs.join(' | '));
  await p.close();
}

async function modos(b) {
  console.log('\n· Modos de muñeca');
  const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await sembrar(p);
  await p.goto(BASE + 'index.html?arte=svg'); await p.waitForTimeout(300); await p.evaluate(() => go('dress')); await p.waitForTimeout(800);
  ok('Muñeca vectorial (?arte=svg)', await p.evaluate(() => Avatar.MODO === 'svg' && !!document.querySelector('#avStage svg.av g.av-body')));
  await p.goto(BASE + 'index.html?arte=borrador'); await p.waitForTimeout(300);
  const j = await p.evaluate(() => Avatar.JUEGO);
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const capas = await p.$$eval('#avStage image', im => im.map(i => i.getAttribute('href').split('/').pop().split('.')[0]));
  ok('Muñeca premium en borrador (?arte=borrador)', j === 'premium', capas.join(', '));
  if (capas.some(c => c.startsWith('ojos-'))) {
    await p.evaluate(() => avCtl.blink()); await p.waitForTimeout(60);
    ok('Parpadeo: se ven los ojos cerrados y no los abiertos', await p.evaluate(() => { const r = document.querySelector('#avStage svg.av'), c = r.querySelector('.av-closed'), o = r.querySelector('.av-open'); return c && getComputedStyle(c).display !== 'none' && (!o || getComputedStyle(o).display === 'none'); }));
  }
  ok('Sin errores de JavaScript', !errs.length, errs.join(' | '));
  await p.close();
}

async function copia(b) {
  console.log('\n· Copia de seguridad');
  const ctx = await b.newContext({ acceptDownloads: true }), p = await ctx.newPage();
  p.on('dialog', d => d.accept());
  await sembrar(p);
  await p.evaluate(() => new Promise(r => { const q = indexedDB.open('misjuegos', 1); q.onupgradeneeded = () => q.result.createObjectStore('tpl', { keyPath: 'id' }); q.onsuccess = () => { const t = q.result.transaction('tpl', 'readwrite'); t.objectStore('tpl').put({ id: 'prueba', url: 'data:image/png;base64,AAAA' }); t.oncomplete = () => { q.result.close(); r(); }; }; }));
  const antes = await leerLS(p);
  await p.goto(BASE + 'herramientas/copia-de-seguridad.html'); await p.waitForTimeout(400);
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#exportar')]);
  const archivo = path.join(OUT, 'copia-prueba.json'); await dl.saveAs(archivo);
  const c = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  ok('La copia incluye datos y láminas', c.local_storage.stars === antes.stars && c.indexeddb.misjuegos.tpl.length === 1);
  await p.evaluate(() => new Promise(r => { localStorage.clear(); const q = indexedDB.deleteDatabase('misjuegos'); q.onsuccess = q.onerror = q.onblocked = () => r(); }));
  await p.reload(); await p.waitForTimeout(300);
  await p.setInputFiles('#archivo', archivo); await p.waitForTimeout(300);
  await Promise.all([p.waitForEvent('download'), p.click('#restaurar')]); await p.waitForFunction(() => window.resultadoRestaurar);
  const despues = await leerLS(p);
  ok('Restaurar devuelve los datos exactos', Object.keys(antes).every(k => despues[k] === antes[k]));
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(400);
  ok('El juego lee los datos restaurados', (await p.textContent('.sc')).trim() === antes.stars);
  await ctx.close();
}

(async () => {
  const b = await pw.chromium.launch();
  try {
    await flujo(b, 1180, 820, 2, 'ipad');
    await flujo(b, 852, 393, 3, 'iphone-horizontal');
    await modos(b);
    await copia(b);
  } finally { await b.close(); }
  const fallos = resultados.filter(r => !r[0]).length;
  console.log(`\n${fallos ? '❌' : '✅'} ${resultados.length - fallos}/${resultados.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
