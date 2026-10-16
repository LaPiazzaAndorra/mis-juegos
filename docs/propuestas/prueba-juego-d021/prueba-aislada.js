#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia aislada D-021 (Chromium con pantalla de iPhone simulada)

   Uso (desde la raíz):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-juego-d021/prueba-aislada.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · datos propios: con datos «del juego» Y de la prueba congelada D-016 (D-019) sembrados antes, la copia no los
       ve, no los cambia y no los migra; todo lo que escribe va con «d021:» (localStorage) y «d021-» (IndexedDB);
     · sin service worker; sin errores;
     · «Vestir»: pestañas Ojos (4 colores) y Adornos (corona y pintacaras);
     · combinaciones: 4 colores de ojos × pintacaras (sí / no) × corona (sí / no), y ropa (vestido / camiseta):
       cada una dibuja solo sus capas;
     · parpadeo con cada color y con pintacaras: los ojos abiertos se ocultan, los cerrados se ven y el pintacaras
       sigue visible;
     · lo elegido se conserva al cerrar y abrir: el personaje guardado y también los cambios sin guardar (borrador);
     · «Mi Mundo» con el personaje guardado (color de ojos y pintacaras);
     · la muñeca anterior sigue disponible en la copia (?arte=prueba, ?arte=borrador, ?arte=svg);
     · las capas del juego a tamaño real coinciden con el montaje aprobado + ojos lila + pintacaras.
   Las capturas se guardan FUERA del repositorio.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-juego-d021/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-d021-'));
const JUEGO = { stars: '37', avatar: JSON.stringify({ v: 1, piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'melena', color: 'castano' }, ropa: 'vestido', zapatos: null, accesorios: [] }),
  doll: '{"skin":3,"hc":3,"hs":2}', lv_contar: '2', iceCoins: '5', gal: JSON.stringify(['data:image/png;base64,iVBORw0KGgo=']),
  // datos de la prueba congelada D-016 (D-019): tampoco se tocan
  'd016:stars': '12', 'd016:avatar': JSON.stringify({ v: 1, piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: ['corona'] }) };
const COLORES = ['marron', 'azul', 'verde', 'lila'];
const res = []; const ok = (n, c, x = '') => { res.push([!!c, n]); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const capasDe = sel => `[...document.querySelectorAll('${sel} svg.av image')].map(i => i.getAttribute('href').split('/').pop().split('.')[0])`;

(async () => {
  const b = await pw.chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  // 1. datos «del juego» y de D-016 en el mismo origen, con las bases IndexedDB «misjuegos» y «d016-misjuegos»
  await p.goto(BASE + 'index.html');
  await p.evaluate(async d => {
    localStorage.clear(); for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v);
    const sembrar = (bd, id) => new Promise(ok => { const r = indexedDB.open(bd, 1); r.onupgradeneeded = () => r.result.createObjectStore('tpl', { keyPath: 'id' });
      r.onsuccess = () => { const tx = r.result.transaction('tpl', 'readwrite'); tx.objectStore('tpl').put({ id, url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' }); tx.oncomplete = () => { r.result.close(); ok(); }; }; });
    await sembrar('misjuegos', 'lamina-del-juego'); await sembrar('d016-misjuegos', 'lamina-de-d016');
  }, JUEGO);
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  // 2. la copia
  await p.goto(COPIA); await p.waitForTimeout(1200);
  const info = await p.evaluate(() => ({ juego: Avatar.JUEGO, aislado: !!window.PRUEBA_D021, stars: localStorage.getItem('stars'), avatar: localStorage.getItem('avatar'), claves: Object.keys(localStorage),
    ojos: Avatar.CAT.ojos.colores.map(o => o.id), acc: Avatar.CAT.accesorios.map(o => o.id) }));
  ok('La copia abre con la muñeca d021', info.juego === 'd021', 'juego: ' + info.juego);
  ok('Datos propios: no ve las claves del juego ni las de D-016', info.aislado && info.stars === null && info.avatar === null && !info.claves.length, 'claves visibles: ' + JSON.stringify(info.claves));
  ok('Sin service worker en la copia', (await p.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)) === 0);
  ok('Catálogo: 4 colores de ojos y adornos corona + pintacaras', info.ojos.join() === COLORES.join() && info.acc.join() === 'corona,pintacaras', info.ojos.join() + ' · ' + info.acc.join());
  // Vestir
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const vestir = await p.evaluate(`({ capas: ${capasDe('#avStage')}, pestanas: [...document.querySelectorAll('#dtabs .btn')].map(x => x.textContent.trim()) })`);
  ok('«Vestir» abre con el conjunto aprobado (marrones, sin pintacaras)', ['d021-pelo-detras', 'd021-base', 'd021-ojos-marron', 'd021-ojos-cerrados', 'd021-zapatos', 'd021-vestido', 'd021-manos', 'd021-pelo-delante', 'd021-corona'].every(c => vestir.capas.includes(c)) && !vestir.capas.includes('d021-pintacaras'), vestir.capas.join(' '));
  ok('Pestañas Ojos y Adornos visibles', ['Ojos', 'Adornos'].every(t => vestir.pestanas.some(x => x.includes(t))), vestir.pestanas.join(' · '));
  // pestaña Ojos: 4 opciones, y tocar una cambia los ojos
  await p.evaluate(() => [...document.querySelectorAll('#dtabs .btn')].find(x => x.textContent.includes('Ojos')).click()); await p.waitForTimeout(600);
  const opOjos = await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].map(x => x.textContent.trim()));
  await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].find(x => x.textContent.includes('Verdes')).click()); await p.waitForTimeout(1000);
  await p.screenshot({ path: path.join(OUT, 'vestir-ojos.png') });
  const trasTocar = await p.evaluate(capasDe('#avStage'));
  ok('Pestaña Ojos: Marrones, Azules, Verdes y Lilas; al tocar «Verdes» cambian los ojos', opOjos.join() === 'Marrones,Azules,Verdes,Lilas' && trasTocar.includes('d021-ojos-verde'), opOjos.join());
  // pestaña Adornos: tocar «Estrellas y brillo» lo pone y otra vez lo quita
  await p.evaluate(() => [...document.querySelectorAll('#dtabs .btn')].find(x => x.textContent.includes('Adornos')).click()); await p.waitForTimeout(600);
  const tocarPinta = async () => { await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].find(x => x.textContent.includes('Estrellas y brillo')).click()); await p.waitForTimeout(1000); return p.evaluate(capasDe('#avStage')); };
  const on1 = await tocarPinta(); await p.screenshot({ path: path.join(OUT, 'vestir-pintacaras.png') }); const off1 = await tocarPinta();
  ok('Adornos: «Estrellas y brillo» se pone y se quita', on1.includes('d021-pintacaras') && !off1.includes('d021-pintacaras'));
  // combinaciones
  const combos = [], parpadeos = [];
  for (const color of COLORES) for (const pinta of [true, false]) for (const corona of [true, false]) {
    const acc = (corona ? ['corona'] : []).concat(pinta ? ['pintacaras'] : []);
    const c = await p.evaluate(([color, acc, sel]) => { avChange({ ropa: 'princesa', ojos: { color }, accesorios: acc }); return new Promise(o => setTimeout(() => o(eval(sel)), 900)); }, [color, acc, capasDe('#avStage')]);
    const esperado = ['d021-pelo-detras', 'd021-base', `d021-ojos-${color}`, 'd021-ojos-cerrados', 'd021-zapatos', 'd021-vestido', 'd021-manos', 'd021-pelo-delante'].concat(pinta ? ['d021-pintacaras'] : [], corona ? ['d021-corona'] : []);
    combos.push(`${color}${pinta ? '+pintacaras' : ''}${corona ? '+corona' : ''}: ${esperado.every(e => c.includes(e)) && c.length === esperado.length ? 'ok' : c.join(' ')}`);
    if (corona) {
      // parpadeo: abiertos ocultos, cerrados visibles y el pintacaras igual
      const v = await p.evaluate(async () => {
        const r = document.querySelector('#avStage svg.av'), d = el => el ? getComputedStyle(el).display : 'falta';
        const pinta = () => d([...r.querySelectorAll('image')].find(i => i.getAttribute('href').includes('d021-pintacaras')));
        r.classList.add('blink'); await new Promise(o => setTimeout(o, 30));
        const a = [d(r.querySelector('.av-open')), d(r.querySelector('.av-closed')), pinta()]; r.classList.remove('blink');
        return a.concat([d(r.querySelector('.av-open')), d(r.querySelector('.av-closed')), pinta()]);
      });
      const bien = v.slice(0, 2).join() === 'none,inline' && v.slice(3, 5).join() === 'inline,none' && (pinta ? v[2] === 'inline' && v[5] === 'inline' : v[2] === 'falta');
      parpadeos.push(`${color}${pinta ? '+pintacaras' : ''}: ${bien ? 'ok' : v.join()}`);
      if (pinta) await p.screenshot({ path: path.join(OUT, `combo-${color}-pintacaras.png`) });
    }
  }
  ok('Combinaciones (4 colores × pintacaras × corona) dibujan solo sus capas', combos.every(c => c.endsWith('ok')), combos.filter(c => !c.endsWith('ok')).join(' · ') || combos.length + ' combinaciones');
  ok('Parpadeo con cada color, con y sin pintacaras', parpadeos.every(c => c.endsWith('ok')), parpadeos.join(' · '));
  const cam = await p.evaluate(sel => { avChange({ ropa: 'camiseta', ojos: { color: 'azul' }, accesorios: ['pintacaras'] }); return new Promise(o => setTimeout(() => o(eval(sel)), 900)); }, capasDe('#avStage'));
  ok('Con la camiseta también: ojos azules + pintacaras', cam.includes('d021-ojos-azul') && cam.includes('d021-pintacaras') && !cam.includes('d021-vestido'), cam.join(' '));
  // lo elegido se conserva al cerrar y abrir
  await p.evaluate(() => avChange({ ropa: 'princesa', ojos: { color: 'lila' }, accesorios: ['corona', 'pintacaras'] }));
  await p.waitForTimeout(500); await p.click('#dSave'); await p.waitForTimeout(500);
  await p.reload(); await p.waitForTimeout(1000);
  const guardado = await p.evaluate(() => { const g = Avatar.cargar(), d = Avatar.borrador(); return { g: g && [g.ojos.color, g.accesorios.join('+')].join(' '), d: [d.ojos.color, d.accesorios.join('+')].join(' ') }; });
  ok('Guardado: ojos lila + corona + pintacaras se recuperan al volver a abrir', guardado.g === 'lila corona+pintacaras' && guardado.d === 'lila corona+pintacaras', JSON.stringify(guardado));
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1200);
  await p.evaluate(() => avChange({ ojos: { color: 'verde' }, accesorios: ['corona'] })); await p.waitForTimeout(400);
  await p.reload(); await p.waitForTimeout(1000);
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const borr = await p.evaluate(sel => ({ g: [Avatar.cargar().ojos.color, Avatar.cargar().accesorios.join('+')].join(' '), capas: eval(sel), aviso: document.getElementById('avSaved').textContent }), capasDe('#avStage'));
  ok('Cambios sin guardar (verdes, sin pintacaras) siguen en «Vestir» al volver a abrir; lo guardado no cambia', borr.capas.includes('d021-ojos-verde') && !borr.capas.includes('d021-pintacaras') && borr.g === 'lila corona+pintacaras' && /sin guardar/i.test(borr.aviso), `${borr.g} · ${borr.aviso}`);
  // vuelve a lo guardado para Mi Mundo
  await p.evaluate(() => avChange({ ojos: { color: 'lila' }, accesorios: ['corona', 'pintacaras'] })); await p.waitForTimeout(400);
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  const mundo = await p.evaluate(capasDe('#avWorld'));
  ok('«Mi Mundo» muestra la muñeca guardada (ojos lila + pintacaras)', await p.evaluate(() => !!document.querySelector('#roomLayer svg')) && mundo.includes('d021-ojos-lila') && mundo.includes('d021-pintacaras'), mundo.join(' '));
  await p.screenshot({ path: path.join(OUT, 'mi-mundo.png') });
  await p.evaluate(() => Progreso.datosFicticios()); await p.waitForTimeout(400);
  // 3. el juego y D-016, otra vez: sus datos siguen igual
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(600);
  const despues = await p.evaluate(async () => {
    const d = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); d[k] = localStorage.getItem(k); }
    const bases = indexedDB.databases ? (await indexedDB.databases()).map(x => x.name) : [];
    const lam = bd => new Promise(ok => { const r = indexedDB.open(bd, 1); r.onsuccess = () => { const q = r.result.transaction('tpl').objectStore('tpl').getAll(); q.onsuccess = () => { r.result.close(); ok(q.result.map(x => x.id).join()); }; }; });
    return { d, bases, lam: [await lam('misjuegos'), await lam('d016-misjuegos')] };
  });
  const nuevas = Object.keys(despues.d).filter(k => !(k in JUEGO));
  ok('Las claves del juego y las de D-016 siguen intactas', Object.entries(JUEGO).every(([k, v]) => despues.d[k] === v));
  ok('Todo lo que escribió la copia lleva «d021:»', nuevas.length > 0 && nuevas.every(k => k.startsWith('d021:')), nuevas.join(', '));
  ok('IndexedDB: la copia usa sus propias bases; las del juego y de D-016 siguen igual', despues.lam.join('|') === 'lamina-del-juego|lamina-de-d016' && despues.bases.filter(n => n !== 'misjuegos' && !n.startsWith('d016-')).every(n => n.startsWith('d021-')), despues.bases.join(', '));
  // 4. muñeca anterior disponible en la copia
  const anteriores = [];
  for (const a of ['prueba', 'borrador', 'svg']) { await p.goto(COPIA + '?arte=' + a); await p.waitForTimeout(700); anteriores.push(a + ':' + await p.evaluate(() => Avatar.JUEGO || Avatar.MODO)); }
  ok('La muñeca anterior sigue disponible en la copia', anteriores.join() === 'prueba:prueba,borrador:premium,svg:svg', anteriores.join(' '));
  ok('Sin errores en la consola', !errs.length, errs.slice(0, 3).join(' | '));
  // 5. encaje: las capas del juego a tamaño real (ojos lila + pintacaras), para comparar con el montaje
  const p2 = await (await b.newContext({ viewport: { width: 948, height: 1659 } })).newPage();
  await p2.goto(COPIA); await p2.waitForTimeout(800);
  await p2.evaluate(async () => {
    const s = Avatar.normalizar({ ropa: 'princesa', zapatos: 'princesa', ojos: { color: 'lila' }, accesorios: ['corona', 'pintacaras'] });
    document.body.innerHTML = Avatar.svg(s, { viewBox: '0 0 948 1659', w: 948, h: 1659, x: 0, y: 0, sombra: false }).replace('<svg ', '<svg style="position:fixed;left:0;top:0;width:948px;height:1659px;background:#fffaf5" ');
    document.body.style.margin = 0; document.querySelector('svg .av-body').style.animation = 'none';
    await Promise.all([...document.querySelectorAll('image')].map(i => new Promise(o => { const im = new Image(); im.onload = im.onerror = o; im.src = i.getAttribute('href'); })));
    await new Promise(o => setTimeout(o, 400));
  });
  await p2.screenshot({ path: path.join(OUT, 'juego-a-tamano-real.png'), clip: { x: 0, y: 0, width: 948, height: 1659 } });
  fs.writeFileSync(path.join(OUT, 'resultados.json'), JSON.stringify(res));
  await b.close();
  console.log(`\n${res.filter(r => r[0]).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(r => r[0]) ? 0 : 1);
})();
