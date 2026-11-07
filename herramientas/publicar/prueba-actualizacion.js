#!/usr/bin/env node
/* =====================================================================
   Prueba de la ACTUALIZACIÓN de la app instalada: de lo publicado (031ce07) a la versión nueva (Chromium; iPhone simulado,
   app instalada simulada). Publicación del 05/11/2026: Contar y Memoria (1.ª entrega de Pensar) + habitación de Mi Mundo.

   Uso (desde la raíz):
     node herramientas/publicar/prueba-actualizacion.js CARPETA_ANTIGUA CARPETA_NUEVA [capturas]
   CARPETA_ANTIGUA: los archivos de main de hoy (031ce07); CARPETA_NUEVA: lo que escribe preparar_publicacion.py con
   --con-pensar y --con-mimundo. Sirve las dos, una tras otra, en la misma dirección (/mis-juegos/, como GitHub Pages):
     1. con la versión de hoy instalada, lista sin conexión y una partida completa (estrellas, dibujos, Heladería, niveles,
        voz, muñeca, escenas, logros, cofres y una lámina propia en IndexedDB), se publica la nueva;
     2. la app instalada la descubre, avisa «Hay una versión nueva» y al tocar «Actualizar» se abre entera la nueva
        (también entra sola al cerrar y volver a abrir); una sola caché; la versión se ve en Ajustes;
     3. ningún dato cambia ni se pierde;
     4. en modo avión: Contar y Memoria nuevos (sin la 2.ª entrega), la habitación de Mi Mundo con la misión «Guardar los
        juguetes» (sin el salón), Pintar, Heladería, Vestir y «Guardar mi progreso» con lo nuevo; sin peticiones fallidas ni errores.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync, spawn } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const [ANTIGUA, NUEVA] = process.argv.slice(2, 4).map(p => path.resolve(p));
const OUT = process.argv[4] || fs.mkdtempSync(path.join(os.tmpdir(), 'actualizacion-')); fs.mkdirSync(OUT, { recursive: true });
const PUERTO = 8794, APP = `http://localhost:${PUERTO}/mis-juegos/index.html`;
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const SITIO = fs.mkdtempSync(path.join(os.tmpdir(), 'sitio-act-'));
const servir = carpeta => { try { fs.unlinkSync(path.join(SITIO, 'mis-juegos')); } catch (e) {} fs.symlinkSync(carpeta, path.join(SITIO, 'mis-juegos')); execSync(`find "${carpeta}" -type f -exec touch {} +`); };
const INIT = () => { window.__comp = []; const mm = window.matchMedia.bind(window);
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true }); navigator.canShare = d => !!(d && d.files);
  navigator.share = async d => { window.__comp.push({ text: await d.files[0].text() }); }; };
const DIB = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const PARTIDA = { stars: '137', gal: JSON.stringify([DIB, DIB, DIB]), iceCoins: '25', iceServed: '41', lv_contar: '8', lv_sigue: '4', lv_heladeria: '{"L":2,"ok":1}',
  voice: '"com.apple.voice.compact.es-ES.Monica"', tone: '1', sound: 'true', doll: '{"skin":1,"hc":0,"hs":1}', sc_casa: '[{"e":"🐶","x":50,"y":50,"s":13,"f":1}]',
  scKey: '"casa"', mm_hab: '{"x":1}', logros: '{"v":1,"lista":[{"id":"r:2026-10-30:contar","t":1}]}', premios: '{"v":1,"cofres":[]}', tareas: '[]' };
const volcar = p => p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });

(async () => {
  servir(ANTIGUA);
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: SITIO, stdio: 'ignore' }); process.on('exit', () => srv.kill());
  await new Promise(r => setTimeout(r, 900));
  const b = await pw.chromium.launch(), errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await ctx.addInitScript(INIT);
  const abrir = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto(APP); await p.waitForTimeout(1200); return p; };
  // ---------- 1. la app de hoy instalada, lista sin conexión y con una partida ----------
  let p = await abrir();
  for (let k = 0; k < 3; k++) { try { await p.waitForFunction(() => window.OfflineEstado && OfflineEstado.listo, null, { timeout: 300000 }); break; } catch (e) { await p.waitForTimeout(1500); } }   // primera instalación
  await p.waitForTimeout(1500);
  await p.evaluate(d => { localStorage.clear(); for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v); }, PARTIDA);
  await p.evaluate(() => Avatar.guardar({ piel: 'morena', ojos: { color: 'verde' }, pelo: { estilo: 'rizos', color: 'miel' }, ropa: 'aventura', accesorios: ['mochila'] }));
  await p.evaluate(() => new Promise(ok => { const r = indexedDB.open('misjuegos', 1); r.onupgradeneeded = () => r.result.createObjectStore('tpl', { keyPath: 'id' });
    r.onsuccess = () => { const tx = r.result.transaction('tpl', 'readwrite'); tx.objectStore('tpl').put({ id: 'u:mi-lamina', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' }); tx.oncomplete = () => { r.result.close(); ok(); }; }; })).catch(e => console.log('IDB', e.message));
  await p.reload(); await p.waitForTimeout(1500);
  await p.waitForFunction(() => window.OfflineEstado && OfflineEstado.listo, null, { timeout: 300000 });
  const v0 = await p.evaluate(() => OFFLINE.version), antes = await volcar(p);
  ok('Versión de hoy instalada, «Lista para jugar sin conexión», con la partida', /Lista/.test(await p.textContent('#offlineAviso')) && antes.stars === '137', 'versión ' + v0);
  // ---------- 2. se publica la nueva: aviso y «Actualizar» ----------
  servir(NUEVA); await p.close(); p = await abrir();
  await p.waitForFunction(() => /Hay una versión nueva/.test((document.getElementById('offlineAviso') || {}).textContent || ''), null, { timeout: 180000 });
  const esperando = await p.evaluate(() => OFFLINE.version);
  ok('Al abrir la app instalada, descubre la nueva y avisa «✨ Hay una versión nueva» (sin mezclar: sigue entera la de antes)', esperando === v0);
  await Promise.all([p.waitForEvent('load', { timeout: 60000 }), p.click('#offlineAviso button')]); await p.waitForTimeout(1500);
  await p.waitForFunction(() => window.OfflineEstado && OfflineEstado.listo, null, { timeout: 300000 });
  const v1 = await p.evaluate(() => OFFLINE.version), cach = await p.evaluate(async () => caches.keys());
  ok('Al tocar «Actualizar» se abre la nueva entera, se descarga y queda una sola caché', v1 !== v0 && cach.length === 1 && cach[0] === 'mis-juegos-' + v1 && /Lista/.test(await p.textContent('#offlineAviso')), `${v0} → ${v1} · ${cach}`);
  await p.tap('#setBtn'); await p.waitForTimeout(500);
  const ver = await p.textContent('#verApp').catch(() => '');
  ok('La versión se ve en Ajustes', ver === 'Versión del juego: ' + v1, ver); await p.screenshot({ path: path.join(OUT, 'ajustes-version.png') }); await p.tap('#setClose');
  const desp = await volcar(p), idb = await p.evaluate(() => new Promise(ok => { const r = indexedDB.open('misjuegos'); r.onsuccess = () => { const db = r.result; if (!db.objectStoreNames.contains('tpl')) return ok(null);
    const g = db.transaction('tpl').objectStore('tpl').get('u:mi-lamina'); g.onsuccess = () => ok(g.result && g.result.id); }; }));
  const cambian = Object.keys(antes).filter(k => antes[k] !== desp[k]), nuevas = Object.keys(desp).filter(k => !(k in antes));
  ok('Ningún dato cambia ni se pierde al actualizar (estrellas, dibujos, Heladería, niveles, voz, muñeca, escenas, logros, lámina propia)', !cambian.length && idb === 'u:mi-lamina', `cambian: ${cambian} · nuevas: ${nuevas}`);
  // también entra sola al cerrar y volver a abrir (otra publicación igual no hace falta: comprobamos que la nueva sigue al reabrir)
  await p.close(); p = await abrir();
  ok('Al cerrar y volver a abrir sigue la nueva', await p.evaluate(() => OFFLINE.version) === v1);
  // ---------- 3. modo avión ----------
  await ctx.setOffline(true); await p.close(); p = await abrir(); const fallos = []; p.on('requestfailed', r => fallos.push(r.url()));
  ok('Sin conexión: abre la nueva con la partida (⭐ 137)', await p.evaluate(() => OFFLINE.version) === v1 && await p.textContent('.sc') === '137');
  // Pensar: 1.ª entrega sí, 2.ª no
  const pen = await p.evaluate(() => ({ contar: !!window.PENSAR, segunda: !!(window.PENSAR2 || window.FIGURAS), menu: [...document.querySelectorAll('#m-think .big')].map(b => b.dataset.go).join(),
    puntos: !!document.querySelector('[data-go="puntos"]') }));
  ok('Contar y Memoria nuevos en Pensar; ni la 2.ª entrega ni Unir puntos', pen.contar && !pen.segunda && !pen.puntos && pen.menu === 'memoria,contar,quiz,quiz,quiz', JSON.stringify(pen));
  await p.evaluate(() => go('contar')); await p.waitForTimeout(500); await p.click('#contar .pnNo'); await p.waitForTimeout(500);
  const r = await p.evaluate(() => PENSAR.ct.item.resp); await p.click(`#ctOpts .pnOpt:has-text("${r}") >> nth=0`); await p.waitForTimeout(300);
  ok('Sin conexión: Contar empieza en el nivel 2 (por lo que ya sabía) y el acierto da +1 ⭐', await p.evaluate(() => PENSAR.nvCt.get().L) === 1 && await p.textContent('.sc') === '138');
  let mem = [];
  for (const s of ['parejas', 'donde', 'serie']) { await p.evaluate(s => go(s), s); await p.waitForTimeout(800);
    mem.push(await p.evaluate(s => document.querySelectorAll({ parejas: '#pjGrid .pnCard svg', donde: '#doTablero .pnCelda, #donde .pnIntro:not([hidden])', serie: '#sePads .pnPad svg, #serie .pnIntro:not([hidden])' }[s]).length > 0, s)); }
  ok('Sin conexión: Memoria (parejas, ¿dónde estaba?, repite la serie)', mem.every(Boolean));
  // Mi Mundo: la habitación y la misión
  await p.evaluate(() => go('scene')); await p.waitForTimeout(800);
  const casa = await p.evaluate(() => scItems.length);   // abre en la escena que tenía (la casa, con su perrito)
  await p.click('#scenePick [data-k="habitacion"]'); await p.waitForTimeout(2500);   // como Amaia: tocar la habitación
  const hab = await p.evaluate(() => ({ fondo: document.querySelector('.mm-fondo') && document.querySelector('.mm-fondo').naturalWidth, muneca: document.querySelectorAll('.mm-av image').length, salon: /sal[oó]n/i.test(document.getElementById('scene').textContent) }));
  ok('Sin conexión: Mi Mundo abre en su escena de antes (la casa con el perrito) y la habitación ilustrada con la muñeca guardada (sin el salón)', casa === 1 && hab.fondo > 0 && hab.muneca > 8 && !hab.salon, JSON.stringify({ casa, ...hab }));
  await p.click('#mmMisiones'); await p.waitForTimeout(300); await p.click('.mm-panel .mm-mis[data-id="guardar-juguetes"]'); await p.waitForTimeout(900);
  const caja = sel => p.$(sel).then(e => e.boundingBox());
  for (const id of ['osito', 'pelota', 'cubos', 'cuento']) { const a = await caja(`.mm-obj[data-id="${id}"]`), d = await caja('.mm-obj[data-id="cesta"]');
    await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down(); await p.mouse.move(d.x + d.width / 2, d.y + d.height / 2, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(700); }
  await p.waitForTimeout(800);
  ok('Sin conexión: la misión «Guardar los juguetes» se juega entera', await p.evaluate(() => MM.misiones().hechas['guardar-juguetes'] === 1));
  await p.screenshot({ path: path.join(OUT, 'mision.png') });
  // lo de antes: Pintar (lámina nueva), Heladería, Vestir
  await p.evaluate(() => go('paint', 'n:conejito')); await p.waitForTimeout(1500);
  const pin = await p.evaluate(() => P.tpl === 'n:conejito' && !!P.zn);
  await p.evaluate(() => go('ice', 'libre')); await p.waitForTimeout(600); const hel = await p.evaluate(() => document.querySelectorAll('#iceFlavs .fl').length >= 6);
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500); const ves = await p.evaluate(() => document.querySelectorAll('#dress image, #dress img').length > 5);
  ok('Sin conexión: Pintar (lámina nueva), Heladería y Vestir siguen funcionando', pin && hel && ves, JSON.stringify({ pin, hel, ves }));
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(900);
  const copia = await p.evaluate(() => window.__comp.length && JSON.parse(window.__comp[0].text).local_storage);
  ok('Sin conexión: «Guardar mi progreso» incluye lo nuevo (Contar, habitación, misiones) y lo de antes', copia && ['lv_contar2', 'mm_habitacion2', 'mm_misiones', 'gal', 'stars', 'logros', 'avatar', 'sc_casa', 'mm_hab'].every(k => k in copia), copia && Object.keys(copia).length + ' claves');
  ok('Sin conexión: ninguna petición fallida ni error de JavaScript', !fallos.length && !errs.length, fallos.concat(errs).slice(0, 3).join(' | '));
  await b.close(); srv.kill(); fs.rmSync(SITIO, { recursive: true, force: true });
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · versión ${v1} · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
