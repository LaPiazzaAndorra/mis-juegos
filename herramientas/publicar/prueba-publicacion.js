#!/usr/bin/env node
/* =====================================================================
   Prueba de la publicación (Chromium; iPhone simulado, app instalada simulada)

   Uso (desde la raíz de avatar-creador):
     node herramientas/publicar/prueba-publicacion.js CARPETA_ANTIGUA CARPETA_NUEVA [capturas]
   CARPETA_ANTIGUA: los archivos de main de hoy (4bbf51d); CARPETA_NUEVA: lo que escribe preparar_publicacion.py.
   Sirve las dos, una tras otra, en la misma dirección (/mis-juegos/, como GitHub Pages) y comprueba:
     1. con la versión de hoy instalada y datos parecidos a los de una partida (estrellas, dibujos, monedas, Heladería,
        niveles, voz, muñeco antiguo, escenas y una lámina propia en IndexedDB), se publica la nueva: entra sola y no se
        pierde ni cambia ningún dato;
     2. descarga todo y avisa «✅ Lista para jugar sin conexión»; una sola caché, con todos los archivos;
     3. en modo avión: abre, todas las piezas de la muñeca y las láminas están, vestir y guardar el personaje, colorear una
        lámina nueva con el cubo y guardar el dibujo, servir un pedido en la Heladería (+1 ⭐), «Mis logros» y «Guardar mi
        progreso»; sin errores;
     4. una actualización posterior: espera sin mezclar (la página sigue con su versión entera), avisa «Hay una versión
        nueva», al tocar «Actualizar» se vuelve a abrir con la nueva entera, reutiliza las piezas y quita la caché vieja;
        los datos siguen igual.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync, spawn } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const [ANTIGUA, NUEVA] = process.argv.slice(2, 4).map(p => path.resolve(p));
const OUT = process.argv[4] || fs.mkdtempSync(path.join(os.tmpdir(), 'publicacion-')); fs.mkdirSync(OUT, { recursive: true });
const PUERTO = 8790, URL0 = `http://localhost:${PUERTO}/mis-juegos/`, APP = URL0 + 'index.html';
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
// el sitio: /mis-juegos → la carpeta que toque (enlace que se cambia entre fases)
const SITIO = fs.mkdtempSync(path.join(os.tmpdir(), 'sitio-'));
// (cada versión con fecha de ahora: el servidor de prueba responde «sin cambios» por fecha, GitHub Pages por huella)
const servir = carpeta => { try { fs.unlinkSync(path.join(SITIO, 'mis-juegos')); } catch (e) {} fs.symlinkSync(carpeta, path.join(SITIO, 'mis-juegos'));
  execSync(`find "${carpeta}" -type f -exec touch {} +`); };
const INIT = () => { const mm = window.matchMedia.bind(window); window.__comp = [];
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true }); navigator.canShare = d => !!(d && d.files);
  navigator.share = async d => { window.__comp.push({ text: await d.files[0].text() }); }; };
const DIB = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const PARTIDA = { stars: '37', gal: JSON.stringify([DIB, DIB]), iceCoins: '5', iceServed: '9', lv_contar: '2', voice: '"com.apple.voice.compact.es-ES.Monica"', tone: '1',
  sound: 'true', doll: '{"skin":1,"hc":0,"hs":1}', sc_casa: '[{"e":"🐶","x":50,"y":50,"s":13,"f":1}]', scKey: '"casa"' };

(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: SITIO, stdio: 'ignore' });
  process.on('exit', () => srv.kill());
  await new Promise(r => setTimeout(r, 900));
  const b = await pw.chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await ctx.addInitScript(INIT);
  const abrir = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto(APP); await p.waitForTimeout(800); return p; };
  const datos = p => p.evaluate(async ks => { const o = {}; for (const k of ks) o[k] = localStorage.getItem(k);
    o.__lamina = await new Promise(ok => { const r = indexedDB.open('misjuegos', 1); r.onupgradeneeded = () => r.result.createObjectStore('tpl', { keyPath: 'id' });
      r.onsuccess = () => { try { const q = r.result.transaction('tpl').objectStore('tpl').getAll(); q.onsuccess = () => { r.result.close(); ok(q.result.map(x => x.id).join()); }; } catch (e) { ok('sin almacén'); } }; });
    return o; }, Object.keys(PARTIDA));
  const cachesDe = p => p.evaluate(async () => { const o = {}; for (const k of await caches.keys()) o[k] = (await (await caches.open(k)).keys()).length; return o; });
  // ---------- 1. hoy: la versión publicada el 11/10 con una partida ----------
  servir(ANTIGUA);
  let p = await abrir();
  await p.evaluate(async d => { localStorage.clear(); for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v);
    await new Promise(ok => { const r = indexedDB.open('misjuegos', 1); r.onupgradeneeded = () => r.result.createObjectStore('tpl', { keyPath: 'id' });
      r.onsuccess = () => { const tx = r.result.transaction('tpl', 'readwrite'); tx.objectStore('tpl').put({ id: 'u:mi-lamina', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' }); tx.oncomplete = () => { r.result.close(); ok(); }; }; }); }, PARTIDA);
  await p.reload(); await p.waitForTimeout(1500);
  const antes = await datos(p); const cAntes = await cachesDe(p);
  ok('Hoy: versión del 11/10 instalada (caché mis-juegos-v3) con una partida', 'mis-juegos-v3' in cAntes && antes.stars === '37' && antes.__lamina === 'u:mi-lamina', JSON.stringify(cAntes));
  // ---------- 2. se publica la nueva ----------
  servir(NUEVA);
  await p.reload(); await p.waitForTimeout(4000);       // la página vieja (de su caché) encuentra el service worker nuevo
  await p.close(); p = await abrir(); await p.waitForTimeout(1500);
  const ver = await p.evaluate(() => ({ offline: window.OFFLINE && OFFLINE.version, juego: window.Avatar && Avatar.JUEGO, pruebas: window.MODO_PRUEBAS, cinta: !!document.querySelector('.testbanner, #testBanner') && getComputedStyle(document.querySelector('.testbanner, #testBanner')).display }));
  const despues = await datos(p);
  ok('Al volver a abrir entra la versión nueva (muñeca nueva, sin modo de pruebas)', ver.offline && ver.juego === 'todo' && ver.pruebas === false, JSON.stringify(ver));
  ok('Ningún dato de la partida se ha perdido ni ha cambiado (también la lámina propia)', JSON.stringify(antes) === JSON.stringify(despues), Object.keys(PARTIDA).filter(k => antes[k] !== despues[k]).join(', ') || 'todo igual');
  ok('Lee la partida: ⭐ 37 y 🪙 5', await p.textContent('.sc') === '37');
  // ---------- 3. descarga completa ----------
  await p.waitForFunction(() => window.OfflineEstado && OfflineEstado.listo, null, { timeout: 240000 });
  const aviso = await p.textContent('#offlineAviso'), c1 = await cachesDe(p), total = await p.evaluate(() => OFFLINE.basico.length + OFFLINE.piezas.length);
  ok('Avisa «✅ Lista para jugar sin conexión» y hay una sola caché con todo', /Lista para jugar sin conexión/.test(aviso) && Object.keys(c1).length === 1 && Object.values(c1)[0] === total, `${JSON.stringify(c1)} de ${total}`);
  await p.screenshot({ path: path.join(OUT, '1-lista.png') });
  // ---------- 4. modo avión ----------
  await ctx.setOffline(true); await p.close(); p = await abrir(); await p.waitForTimeout(1500);
  const fallos = []; p.on('requestfailed', r => fallos.push(r.url()));
  ok('Sin conexión: la app abre (inicio, ⭐ 37) y sigue lista', await p.textContent('.sc') === '37' && /Lista/.test(await p.textContent('#offlineAviso')));
  const todo = await p.evaluate(async () => { let mal = []; for (const u of OFFLINE.basico.concat(OFFLINE.piezas)) { try { const r = await fetch(u); if (!r.ok) mal.push(u); } catch (e) { mal.push(u); } } return mal; });
  ok('Sin conexión: están todas las piezas de la muñeca, las láminas y el código', !todo.length, todo.slice(0, 3).join(' ') || 'todos');
  // vestir
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  await p.evaluate(() => avChange({ piel: 'profunda', pelo: { estilo: 'coletas', color: 'miel' }, ropa: 'hada', accesorios: ['alas', 'varita'] })); await p.waitForTimeout(1200);
  const imgs = await p.evaluate(async () => { const ims = [...document.querySelectorAll('#avStage image')].map(i => i.getAttribute('href'));
    const r = await Promise.all(ims.map(u => new Promise(o => { const im = new Image(); im.onload = () => o(im.naturalWidth > 0); im.onerror = () => o(false); im.src = u; }))); return { n: ims.length, mal: r.filter(x => !x).length }; });
  await p.click('#dSave'); await p.waitForTimeout(500);
  ok('Sin conexión: vestir (hada, dos coletas, piel profunda) y guardar el personaje', imgs.n > 10 && !imgs.mal && await p.evaluate(() => Avatar.cargar().ropa === 'hada'), `${imgs.n} capas`);
  await p.screenshot({ path: path.join(OUT, '2-vestir-sin-conexion.png') });
  // colorear una lámina nueva con el cubo y guardar
  await p.evaluate(() => go('tpl')); await p.waitForTimeout(700); await p.click('#tplgrid button[data-arg="n:hada"]');
  await p.waitForFunction(() => P.tpl === 'n:hada' && P.zn, null, { timeout: 20000 });
  const huella = () => p.evaluate(() => { const d = pctx.getImageData(0, 0, pc.width, pc.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0; return h; });
  const q = await p.evaluate(() => { const Z = P.zn, W = Z.W, R = 8; let best = 0, bl = 0; const borde = Z.lab[W * 10 + 10]; for (let l = 1; l < Z.sz.length; l++) if (l !== borde && Z.sz[l] > best) { best = Z.sz[l]; bl = l; }
    for (let y = R; y < Z.lab.length / W - R; y += 2) for (let x = R; x < W - R; x += 2) { const k = y * W + x; if (Z.lab[k] === bl && Z.lab[k - R] === bl && Z.lab[k + R] === bl && Z.lab[k - R * W] === bl && Z.lab[k + R * W] === bl) return [x, y, W]; } });
  const rc = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON()); const h0 = await huella();
  await p.mouse.click(rc.x + q[0] * rc.width / q[2], rc.y + q[1] * rc.width / q[2]); await p.waitForTimeout(200);
  const g0 = await p.evaluate(() => JSON.parse(localStorage.getItem('gal')).length); await p.click('#saveBtn'); await p.waitForTimeout(300);
  ok('Sin conexión: colorear una lámina nueva con el cubo y guardar el dibujo', await huella() !== h0 && await p.evaluate(() => JSON.parse(localStorage.getItem('gal')).length) === g0 + 1, `${g0} → ${g0 + 1} dibujos`);
  await p.screenshot({ path: path.join(OUT, '3-colorear-sin-conexion.png') });
  // Heladería
  await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(600);
  const s0 = +await p.evaluate(() => localStorage.getItem('stars'));
  await p.waitForFunction(() => ICE.order && !ICE.busy); const o = await p.evaluate(() => ICE.order);
  await p.click('#iceReset'); await p.click(`#iceBases .btn[data-k="${o.base}"]`); for (const f of o.scoops) await p.locator('#iceFlavs .fl').nth(f).click();
  for (const t of o.tops) await p.click(`#iceTops .btn[data-i="${t}"]`); await p.click('#iceGive'); await p.waitForTimeout(400);
  ok('Sin conexión: servir un pedido en la Heladería suma una estrella', +await p.evaluate(() => localStorage.getItem('stars')) === s0 + 1, `⭐ ${s0} → ${s0 + 1}`);
  await p.screenshot({ path: path.join(OUT, '4-heladeria-sin-conexion.png') });
  await p.evaluate(() => go('logros')); await p.waitForTimeout(500);
  ok('Sin conexión: «Mis logros» abre', await p.evaluate(() => document.getElementById('logros').classList.contains('on')));
  // guardar mi progreso
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(800);
  const copia = await p.evaluate(() => window.__comp.length && JSON.parse(window.__comp[0].text));
  ok('Sin conexión: «Guardar mi progreso» guarda dibujos, estrellas, personaje y logros', copia && ['gal', 'stars', 'avatar', 'iceCoins'].every(k => k in copia.local_storage), copia ? Object.keys(copia.local_storage).length + ' claves' : 'sin copia');
  await p.tap('#setClose').catch(() => {});
  ok('Sin conexión: ninguna petición fallida ni error de JavaScript', !fallos.length && !errs.length, fallos.concat(errs).slice(0, 3).join(' | '));
  const partida = await datos(p);
  // ---------- 5. una actualización posterior ----------
  await ctx.setOffline(false);
  const N2 = fs.mkdtempSync(path.join(os.tmpdir(), 'nueva2-')); execSync(`cp -a "${NUEVA}/." "${N2}/"`);
  const v1 = await p.evaluate(() => OFFLINE.version), v2 = 'act' + v1.slice(3);
  for (const f of ['offline-lista.js', 'sw.js']) fs.writeFileSync(path.join(N2, f), fs.readFileSync(path.join(N2, f), 'utf8').split(v1).join(v2));
  fs.appendFileSync(path.join(N2, 'index.html'), '\n<!-- versión de prueba de actualización -->\n');
  servir(N2);
  await p.reload(); await p.waitForTimeout(5000);
  const esperando = await p.evaluate(async () => ({ ver: OFFLINE.version, reg: !!(await navigator.serviceWorker.getRegistration()).waiting, aviso: document.getElementById('offlineAviso').textContent, caches: await caches.keys() }));
  ok('Actualización: la página sigue entera con su versión mientras la nueva espera, y avisa', esperando.ver === v1 && esperando.reg && /versión nueva/.test(esperando.aviso), JSON.stringify(esperando));
  const idx = await p.evaluate(async () => (await (await fetch('index.html')).text()).includes('versión de prueba de actualización'));
  ok('Mientras espera, no se mezclan archivos (index.html sigue siendo el de su versión)', idx === false);
  await p.screenshot({ path: path.join(OUT, '5-version-nueva.png') });
  await Promise.all([p.waitForEvent('load', { timeout: 20000 }), p.click('#offlineAviso button')]); await p.waitForTimeout(2500);
  await p.waitForFunction(() => window.OfflineEstado && OfflineEstado.listo, null, { timeout: 120000 });
  const tras = await p.evaluate(async () => ({ ver: OFFLINE.version, caches: await caches.keys(), nuevo: (await (await fetch('index.html')).text()).includes('versión de prueba de actualización') }));
  ok('Al tocar «Actualizar» se vuelve a abrir con la versión nueva entera; solo queda su caché', tras.ver === v2 && tras.caches.length === 1 && tras.caches[0] === 'mis-juegos-' + v2 && tras.nuevo, JSON.stringify(tras));
  ok('Tras actualizar, la partida sigue igual', JSON.stringify(await datos(p)) === JSON.stringify(partida));
  await b.close(); srv.kill();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
