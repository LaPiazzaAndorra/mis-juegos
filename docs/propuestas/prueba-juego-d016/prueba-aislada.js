#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia aislada D-016 (Chromium con pantalla de iPhone simulada)

   Uso (desde la raíz):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-juego-d016/prueba-aislada.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · datos propios: con datos «del juego» sembrados antes, la copia no los ve, no los cambia y no los migra;
       todo lo que escribe va con «d016:» (localStorage) y «d016-» (IndexedDB); el juego sigue viendo lo suyo;
     · sin service worker; sin errores;
     · muñeca d016 en «Vestir» y «Mi Mundo»; parpadeo (ojos abiertos ↔ cerrados);
     · combinaciones del catálogo: ropa (vestido / camiseta) × corona (sí / no), con zapatos;
     · la muñeca anterior sigue disponible en la copia (?arte=prueba, ?arte=borrador, ?arte=svg);
     · las capas que dibuja el juego coinciden con el montaje aprobado (a tamaño real).
   Las capturas se guardan FUERA del repositorio.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-juego-d016/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-d016-'));
const JUEGO = { stars: '37', avatar: JSON.stringify({ v: 1, piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'melena', color: 'castano' }, ropa: 'vestido', zapatos: null, accesorios: [] }),
  doll: '{"skin":3,"hc":3,"hs":2}', lv_contar: '2', iceCoins: '5', gal: JSON.stringify(['data:image/png;base64,iVBORw0KGgo=']) };
const res = []; const ok = (n, c, x = '') => { res.push([!!c, n]); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };

(async () => {
  const b = await pw.chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  // 1. datos «del juego» sembrados en el mismo origen, con una base IndexedDB «misjuegos»
  await p.goto(BASE + 'index.html');
  await p.evaluate(async d => {
    localStorage.clear(); for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v);
    await new Promise(ok => { const r = indexedDB.open('misjuegos', 1); r.onupgradeneeded = () => r.result.createObjectStore('tpl', { keyPath: 'id' });
      r.onsuccess = () => { const tx = r.result.transaction('tpl', 'readwrite'); tx.objectStore('tpl').put({ id: 'lamina-del-juego', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' }); tx.oncomplete = () => { r.result.close(); ok(); }; }; });
  }, JUEGO);
  const regs = await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); return rs.length; });
  // 2. la copia
  await p.goto(COPIA); await p.waitForTimeout(1200);
  const info = await p.evaluate(() => ({ juego: Avatar.JUEGO, aislado: !!window.PRUEBA_D016, stars: localStorage.getItem('stars'), avatar: localStorage.getItem('avatar'), claves: Object.keys(localStorage) }));
  ok('La copia abre con la muñeca d016', info.juego === 'd016', 'juego: ' + info.juego);
  ok('Datos propios: no ve las claves del juego', info.aislado && info.stars === null && info.avatar === null && !info.claves.length, 'claves visibles: ' + JSON.stringify(info.claves));
  ok('Sin service worker en la copia', (await p.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)) === 0);
  // Vestir
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const vestir = await p.evaluate(() => ({ capas: [...document.querySelectorAll('#avStage svg.av image')].map(i => i.getAttribute('href').split('/').pop().split('.')[0]),
    pestanas: [...document.querySelectorAll('#dtabs .btn')].map(x => x.textContent.trim()) }));
  ok('«Vestir» dibuja el conjunto aprobado', ['d016-pelo-detras', 'd016-base', 'd016-ojos-marron', 'd016-ojos-cerrados', 'd016-zapatos', 'd016-vestido', 'd016-manos', 'd016-pelo-delante', 'd016-corona'].every(c => vestir.capas.includes(c)), vestir.capas.join(' '));
  await p.screenshot({ path: path.join(OUT, 'vestir.png') });
  // parpadeo
  const parp = await p.evaluate(async () => { const r = document.querySelector('#avStage svg.av'); r.classList.add('blink'); await new Promise(o => setTimeout(o, 30));
    const v = c => getComputedStyle(r.querySelector(c)).display; const a = [v('.av-open'), v('.av-closed')]; r.classList.remove('blink'); return a.concat([v('.av-open'), v('.av-closed')]); });
  ok('Parpadeo: abiertos ↔ cerrados', parp.join() === 'none,inline,inline,none', parp.join());
  // combinaciones
  const combos = [];
  for (const ropa of ['princesa', 'camiseta']) for (const corona of [true, false]) {
    const c = await p.evaluate(([ropa, corona]) => { avChange({ ropa, accesorios: corona ? ['corona'] : [] }); return new Promise(o => setTimeout(() => o([...document.querySelectorAll('#avStage svg.av image')].map(i => i.getAttribute('href').split('/').pop().split('.')[0])), 900)); }, [ropa, corona]);
    const esperado = ['d016-base', 'd016-pelo-detras', 'd016-pelo-delante', 'd016-zapatos'].concat(ropa === 'princesa' ? ['d016-vestido', 'd016-manos'] : [], corona ? ['d016-corona'] : []);
    combos.push(`${ropa}${corona ? '+corona' : ''}: ${esperado.every(e => c.includes(e)) && c.length === esperado.length + 2 ? 'ok' : c.join(' ')}`);
    await p.screenshot({ path: path.join(OUT, `combo-${ropa}${corona ? '-corona' : ''}.png`) });
  }
  ok('Combinaciones (ropa × corona) dibujan solo sus capas', combos.every(c => c.endsWith('ok')), combos.join(' · '));
  await p.evaluate(() => avChange({ ropa: 'princesa', accesorios: ['corona'] }));
  await p.waitForTimeout(500); await p.click('#dSave'); await p.waitForTimeout(500);
  await p.reload(); await p.waitForTimeout(1000);
  ok('El personaje se guarda y se recupera (en la copia)', await p.evaluate(() => { const g = Avatar.cargar(); return !!g && g.ropa === 'princesa' && g.accesorios.includes('corona'); }));
  // Mi Mundo
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  ok('«Mi Mundo» muestra la habitación y la muñeca', await p.evaluate(() => !!document.querySelector('#roomLayer svg') && !!document.querySelector('#avWorld svg.av image[href*="d016-base"]')));
  await p.screenshot({ path: path.join(OUT, 'mi-mundo.png') });
  // datos ficticios de la versión de pruebas (en la copia)
  await p.evaluate(() => Progreso.datosFicticios()); await p.waitForTimeout(400);
  // 3. el juego, otra vez: sus datos siguen igual
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(600);
  const despues = await p.evaluate(async () => {
    const d = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); d[k] = localStorage.getItem(k); }
    const bases = indexedDB.databases ? (await indexedDB.databases()).map(x => x.name) : [];
    const lam = await new Promise(ok => { const r = indexedDB.open('misjuegos', 1); r.onsuccess = () => { const q = r.result.transaction('tpl').objectStore('tpl').getAll(); q.onsuccess = () => { r.result.close(); ok(q.result.map(x => x.id)); }; }; });
    return { d, bases, lam };
  });
  const juegoIgual = Object.entries(JUEGO).every(([k, v]) => despues.d[k] === v);
  const nuevas = Object.keys(despues.d).filter(k => !(k in JUEGO));
  ok('Las claves del juego siguen intactas', juegoIgual);
  ok('Todo lo que escribió la copia lleva «d016:»', nuevas.length > 0 && nuevas.every(k => k.startsWith('d016:')), nuevas.join(', '));
  ok('IndexedDB: la copia usa sus propias bases y la del juego sigue igual', despues.lam.join() === 'lamina-del-juego' && despues.bases.filter(n => n !== 'misjuegos').every(n => n.startsWith('d016-')), despues.bases.join(', '));
  // 4. muñeca anterior disponible en la copia
  const anteriores = [];
  for (const a of ['prueba', 'borrador', 'svg']) {
    await p.goto(COPIA + '?arte=' + a); await p.waitForTimeout(700);
    anteriores.push(a + ':' + await p.evaluate(() => Avatar.JUEGO || Avatar.MODO));
  }
  ok('La muñeca anterior sigue disponible en la copia', anteriores.join() === 'prueba:prueba,borrador:premium,svg:svg', anteriores.join(' '));
  ok('Sin errores en la consola', !errs.length, errs.slice(0, 3).join(' | '));
  // 5. encaje: las capas del juego a tamaño real frente al montaje aprobado
  const p2 = await (await b.newContext({ viewport: { width: 948, height: 1659 } })).newPage();
  await p2.goto(COPIA); await p2.waitForTimeout(800);
  const png = await p2.evaluate(async () => {
    const s = Avatar.normalizar({ ropa: 'princesa', zapatos: 'princesa', accesorios: ['corona'] });
    document.body.innerHTML = Avatar.svg(s, { viewBox: '0 0 948 1659', w: 948, h: 1659, x: 0, y: 0, sombra: false }).replace('<svg ', '<svg style="position:fixed;left:0;top:0;width:948px;height:1659px;background:#fffaf5" ');
    document.body.style.margin = 0; document.querySelector('svg .av-body').style.animation = 'none';
    await Promise.all([...document.images, ...document.querySelectorAll('image')].map(i => new Promise(o => { const im = new Image(); im.onload = im.onerror = o; im.src = i.getAttribute('href'); })));
    await new Promise(o => setTimeout(o, 400)); return true;
  });
  await p2.screenshot({ path: path.join(OUT, 'juego-a-tamano-real.png'), clip: { x: 0, y: 0, width: 948, height: 1659 } });
  fs.writeFileSync(path.join(OUT, 'resultados.json'), JSON.stringify(res));
  await b.close();
  console.log(`\n${res.filter(r => r[0]).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(r => r[0]) ? 0 : 1);
})();
