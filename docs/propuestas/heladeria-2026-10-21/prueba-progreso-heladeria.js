#!/usr/bin/env node
/* =====================================================================
   «Guardar / Recuperar mi progreso» con los datos de la Heladería nueva (21/10/2026)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/heladeria-2026-10-21/prueba-progreso-heladeria.js [http://localhost:8765/] [carpeta]

   Igual que pruebas/prueba-copia.js, simula la app instalada en el iPhone (display-mode standalone) y la hoja de
   compartir de iOS (exige un toque reciente). NO sustituye la prueba en un iPhone real.

   A. En la copia de la Heladería (datos «hel1:»), jugando de verdad:
      · «Guardar mi progreso» exporta estrellas, monedas, pedidos servidos, el nivel «lv_heladeria» y la foto del juego
        libre, tal cual están guardados; el archivo es de pruebas;
      · tras seguir jugando (sube de nivel, más estrellas, se borra la foto), «Recuperar mi progreso» enseña la
        comparación, y al confirmar devuelve exactamente los datos de la copia; la Heladería vuelve a abrir en el nivel y
        con las monedas de la copia;
      · «Deshacer la última recuperación» vuelve al estado de antes, nivel incluido;
      · una copia antigua SIN «lv_heladeria» no borra el nivel actual (recuperar añade y sustituye, no borra);
      · una copia con «lv_heladeria» dañado se rechaza sin cambiar nada; con valores fuera de rango se acepta y la
        Heladería abre en un nivel válido, sin errores;
      · las claves del juego y de otras copias no se tocan.
   B. En el juego principal (sin cambios): recupera y vuelve a exportar «lv_heladeria» de una copia normal, y rechaza
      la copia hecha en la versión de pruebas.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/heladeria-2026-10-21/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'progreso-heladeria-'));
fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const CLAVES = ['stars', 'iceCoins', 'iceServed', 'lv_heladeria', 'gal'];
const AJENOS = { stars: '37', iceCoins: '5', iceServed: '9', lv_contar: '2', 'pin1:stars': '3', 'd026:stars': '4' };
// app instalada + hoja de compartir simulada (como pruebas/prueba-copia.js)
const INIT = () => { window.__comp = []; const mm = window.matchMedia.bind(window);
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true }); navigator.canShare = d => !!(d && d.files);
  navigator.share = async d => { if (!navigator.userActivation.isActive) throw new DOMException('sin toque', 'NotAllowedError');
    window.__comp.push({ name: d.files[0].name, type: d.files[0].type, text: await d.files[0].text() }); }; };
const LS = p => p.evaluate(k => Object.fromEntries(k.map(x => [x, localStorage.getItem(x)])), CLAVES);
async function ajustes(p) { if (await p.isVisible('#settings.on')) return; await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); }
async function recuperarArchivo(p, archivo, confirmar = true) {
  await ajustes(p);
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.tap('#bkRecuperar')]); await fc.setFiles(archivo); await p.waitForTimeout(600);
  const modal = await p.isVisible('#bkModal'), vista = modal ? await p.textContent('#bkVista') : '', aviso = await p.textContent('#toast');
  if (modal && confirmar) { await p.tap('#bkConfirmar'); await p.waitForTimeout(2700); }
  else if (modal) await p.tap('#bkCancelar');
  return { modal, vista, aviso };
}
async function cerrarAjustes(p) { if (await p.isVisible('#setClose')) { await p.tap('#setClose'); await p.waitForTimeout(200); } }
async function servir(p, n) {   // sirve n pedidos tocando los botones
  await cerrarAjustes(p); await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(500);
  for (let i = 0; i < n; i++) {
    await p.waitForFunction(() => ICE.order && !ICE.busy); const o = await p.evaluate(() => ICE.order);
    await p.click('#iceReset'); await p.click(`#iceBases .btn[data-k="${o.base}"]`);
    for (const f of o.scoops) await p.locator('#iceFlavs .fl').nth(f).click();
    for (const t of o.tops) await p.click(`#iceTops .btn[data-i="${t}"]`);
    await p.click('#iceGive'); await p.waitForTimeout(150); await p.evaluate(() => iceNew());
  }
}

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  // ---------------- A. copia de la Heladería ----------------
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript(INIT); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE + 'index.html?arte=svg'); await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
  await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  console.log('· Copia de la Heladería (hel1:), iPhone instalado simulado');
  await servir(p, 4);                                                   // nivel 1 → 2 (ok 1)
  await p.evaluate(() => go('ice', 'libre')); await p.waitForTimeout(400);
  await p.locator('#iceFlavs .fl').nth(0).click(); await p.locator('#iceFlavs .fl').nth(4).click(); await p.click('#icePhoto'); await p.waitForTimeout(300);
  const A = await LS(p);
  ok('Datos de la Heladería antes de guardar', A.stars === '4' && A.iceServed === '4' && JSON.parse(A.lv_heladeria).L === 1 && JSON.parse(A.lv_heladeria).ok === 1 && JSON.parse(A.gal).length === 1,
    `⭐ ${A.stars} · 🪙 ${A.iceCoins} · servidos ${A.iceServed} · nivel ${A.lv_heladeria} · fotos ${JSON.parse(A.gal).length}`);
  // guardar
  await ajustes(p); await p.tap('#bkGuardar'); await p.waitForTimeout(600);
  const comp = await p.evaluate(() => window.__comp);
  ok('«Guardar mi progreso» abre la hoja de compartir con un archivo', comp.length === 1, comp[0] && comp[0].name);
  const copia = JSON.parse(comp[0].text); fs.writeFileSync(path.join(OUT, 'copia-heladeria.json'), comp[0].text);
  const dif = CLAVES.filter(k => copia.local_storage[k] !== A[k]);
  ok('El archivo trae estrellas, monedas, pedidos servidos, nivel «lv_heladeria» y la foto, tal cual', !dif.length, dif.join(', ') || `lv_heladeria = ${copia.local_storage.lv_heladeria}`);
  ok('Es una copia de pruebas (no se podrá recuperar en el juego de Amaia)', copia.version_pruebas === true && /^PRUEBAS-/.test(comp[0].name));
  ok('El resumen cuenta el nivel de la Heladería', (await p.evaluate(c => Progreso.resumen(c), copia)).niveles === 1);
  // seguir jugando: sube de nivel, más estrellas y monedas, se borra la foto
  await servir(p, 2); await p.evaluate(() => localStorage.setItem('gal', '[]'));
  const B = await LS(p);
  ok('Después de seguir jugando, los datos son otros', B.stars === '6' && JSON.parse(B.lv_heladeria).L === 2 && B.gal === '[]', `⭐ ${B.stars} · nivel ${B.lv_heladeria}`);
  // recuperar
  const r1 = await recuperarArchivo(p, path.join(OUT, 'copia-heladeria.json'), false);
  ok('«Recuperar» enseña la comparación (estrellas y monedas de la copia y de ahora); cancelar no cambia nada',
    r1.modal && r1.vista.includes(A.stars) && r1.vista.includes(B.stars) && r1.vista.includes(A.iceCoins) && (await LS(p)).stars === B.stars);
  await recuperarArchivo(p, path.join(OUT, 'copia-heladeria.json'));
  const C = await LS(p), difC = CLAVES.filter(k => C[k] !== A[k]);
  ok('Al confirmar, vuelven exactamente los datos de la copia (nivel incluido)', !difC.length, difC.join(', '));
  await cerrarAjustes(p); await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(500);
  const ui = await p.evaluate(() => ({ nv: ICE.nv, lv: document.querySelector('#iceLv').textContent, coins: document.querySelector('#coins').textContent, sc: document.querySelector('.sc').textContent }));
  ok('La Heladería abre en el nivel y con las monedas recuperadas', ui.nv.L === 1 && ui.nv.ok === 1 && /^Nivel 2/.test(ui.lv) && ui.coins === A.iceCoins && ui.sc === A.stars, `${ui.lv} · 🪙 ${ui.coins}`);
  await p.screenshot({ path: path.join(OUT, 'heladeria-tras-recuperar.png') });
  // deshacer
  await ajustes(p); p.once('dialog', d => d.accept()); await p.tap('#bkDeshacer'); await p.waitForTimeout(2700);
  const D = await LS(p), difD = CLAVES.filter(k => D[k] !== B[k]);
  ok('«Deshacer la última recuperación» vuelve a lo de antes, nivel incluido', !difD.length, difD.join(', '));
  // copia antigua sin lv_heladeria
  const vieja = JSON.parse(JSON.stringify(copia)); delete vieja.local_storage.lv_heladeria; vieja.local_storage.stars = '50';
  fs.writeFileSync(path.join(OUT, 'copia-sin-nivel.json'), JSON.stringify(vieja));
  await recuperarArchivo(p, path.join(OUT, 'copia-sin-nivel.json'));
  const E = await LS(p);
  ok('Copia antigua sin «lv_heladeria»: recupera lo que trae y no borra el nivel actual', E.stars === '50' && E.lv_heladeria === B.lv_heladeria, `nivel ${E.lv_heladeria}`);
  // nivel dañado y fuera de rango
  const danada = JSON.parse(JSON.stringify(copia)); danada.local_storage.lv_heladeria = '{L:';
  fs.writeFileSync(path.join(OUT, 'copia-nivel-danado.json'), JSON.stringify(danada));
  const r2 = await recuperarArchivo(p, path.join(OUT, 'copia-nivel-danado.json'));
  ok('Copia con «lv_heladeria» dañado: se rechaza y no cambia nada', !r2.modal && /dañado/.test(r2.aviso) && (await LS(p)).stars === '50', r2.aviso);
  const rara = JSON.parse(JSON.stringify(copia)); rara.local_storage.lv_heladeria = '{"L":99,"ok":-4}';
  fs.writeFileSync(path.join(OUT, 'copia-nivel-raro.json'), JSON.stringify(rara));
  await recuperarArchivo(p, path.join(OUT, 'copia-nivel-raro.json'));
  await cerrarAjustes(p); await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(500);
  const nv = await p.evaluate(() => ICE.nv);
  ok('Nivel fuera de rango: la Heladería abre en un nivel válido (el 6) y se puede jugar', nv.L === 5 && nv.ok === 0 && await p.evaluate(() => !!ICE.order));
  // aislamiento
  await p.goto(BASE + 'index.html?arte=svg');
  const real = await p.evaluate(k => Object.fromEntries(k.map(x => [x, localStorage.getItem(x)])), Object.keys(AJENOS));
  ok('Las claves del juego y de otras copias siguen igual', Object.entries(AJENOS).every(([k, v]) => real[k] === v));
  const bds = await p.evaluate(async () => (await indexedDB.databases()).map(d => d.name));
  ok('La copia de seguridad interna de la copia va en su propia base («hel1-misjuegos-copias»)', bds.includes('hel1-misjuegos-copias'), bds.join(', '));
  await ctx.close();
  // ---------------- B. juego principal ----------------
  console.log('\n· Juego principal (sin cambios)');
  const ctx2 = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx2.addInitScript(INIT); const q = await ctx2.newPage(); q.on('pageerror', e => errs.push(e.message));
  await q.goto(BASE + 'index.html'); await q.evaluate(() => { localStorage.clear(); localStorage.setItem('stars', '7'); }); await q.reload(); await q.waitForTimeout(400);
  const normal = JSON.parse(JSON.stringify(copia)); delete normal.version_pruebas; normal.local_storage.lv_heladeria = '{"L":3,"ok":2}';
  fs.writeFileSync(path.join(OUT, 'copia-normal.json'), JSON.stringify(normal));
  await recuperarArchivo(q, path.join(OUT, 'copia-normal.json'));
  const F = await LS(q);
  ok('Recupera una copia normal con «lv_heladeria» y los datos de la Heladería', F.lv_heladeria === '{"L":3,"ok":2}' && F.iceCoins === A.iceCoins && F.iceServed === A.iceServed && F.stars === A.stars);
  await ajustes(q); await q.tap('#bkGuardar'); await q.waitForTimeout(600);
  const c2 = JSON.parse((await q.evaluate(() => window.__comp))[0].text);
  ok('Y lo vuelve a exportar en «Guardar mi progreso»', c2.local_storage.lv_heladeria === '{"L":3,"ok":2}' && !c2.version_pruebas);
  const r3 = await recuperarArchivo(q, path.join(OUT, 'copia-heladeria.json'));
  ok('Rechaza la copia hecha en la versión de pruebas', !r3.modal && /PRUEBAS/.test(r3.aviso) && (await LS(q)).stars === A.stars, r3.aviso);
  await ctx2.close();
  ok('Sin errores de JavaScript', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · archivos en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
