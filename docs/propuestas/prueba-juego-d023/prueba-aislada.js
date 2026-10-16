#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia aislada D-023 (Chromium con pantalla de iPhone simulada)

   Uso (desde la raíz):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-juego-d023/prueba-aislada.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · datos propios: con datos «del juego» y de las pruebas congeladas D-016 y D-021 sembrados antes, la copia no los
       ve, no los cambia y no los migra; todo lo que escribe va con «d023:» (localStorage) y «d023-» (IndexedDB);
     · sin service worker; sin errores;
     · «Vestir»: pestañas Piel (4), Ojos (4), Pelo (5 colores), Ropa y Adornos (corona y pintacaras);
     · combinaciones: 4 pieles × 5 colores de pelo × pintacaras (sí / no), con los 4 colores de ojos repartidos, y
       4 pieles × 4 colores de ojos: cada una dibuja solo sus capas (con sus cejas a juego y sus bordes);
     · parpadeo con cada piel: los ojos abiertos se ocultan, se ven los cerrados de esa piel y el pintacaras sigue;
     · lo elegido se conserva al guardar y volver a abrir (y también los cambios sin guardar);
     · «Mi Mundo» con el personaje guardado;
     · la muñeca anterior sigue disponible en la copia (?arte=prueba, ?arte=borrador, ?arte=svg);
     · a tamaño real (piel profunda, pelo jengibre, ojos lilas, pintacaras y corona) para compararla con el montaje.
   Las capturas se guardan FUERA del repositorio.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-juego-d023/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-d023-'));
const AV = (piel, color, acc) => JSON.stringify({ v: 1, piel, ojos: { color, forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: acc });
const JUEGO = { stars: '37', avatar: JSON.stringify({ v: 1, piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'melena', color: 'castano' }, ropa: 'vestido', zapatos: null, accesorios: [] }),
  doll: '{"skin":3,"hc":3,"hs":2}', lv_contar: '2', iceCoins: '5', gal: JSON.stringify(['data:image/png;base64,iVBORw0KGgo=']),
  // datos de las pruebas congeladas: tampoco se tocan
  'd016:stars': '12', 'd016:avatar': AV('clara', 'marron', ['corona']), 'd021:stars': '8', 'd021:avatar': AV('clara', 'lila', ['corona', 'pintacaras']) };
const PIELES = ['clara', 'dorada', 'morena', 'profunda'], PELOS = ['castano', 'chocolate', 'miel', 'oscuro', 'jengibre'], OJOS = ['marron', 'azul', 'verde', 'lila'];
const res = []; const ok = (n, c, x = '') => { res.push([!!c, n]); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const capasDe = sel => `[...document.querySelectorAll('${sel} svg.av image')].map(i => i.getAttribute('href').split('/').pop().split('.')[0])`;
const esperadas = (piel, pelo, ojos, pinta, corona, ropa = 'princesa') => ['d023-pelo-detras-' + pelo, 'd023-base-' + piel, `d023-ojos-${ojos}-${piel}`, 'd023-cerrados-' + piel,
  'd023-zapatos', 'd023-pelo-delante-' + pelo].concat(pelo !== 'castano' ? [`d023-cejas-${pelo}-${piel}`] : [], piel !== 'clara' ? [`d023-bordes-pelo-${pelo}-${piel}`, 'd023-bordes-zapatos-' + piel] : [],
  ropa === 'princesa' ? ['d023-vestido', 'd023-manos-' + piel].concat(piel !== 'clara' ? ['d023-bordes-vestido-' + piel] : []) : [], pinta ? ['d023-pintacaras'] : [], corona ? ['d023-corona'] : []);

(async () => {
  const b = await pw.chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  // 1. datos «del juego» y de D-016 / D-021 en el mismo origen, con sus bases IndexedDB
  await p.goto(BASE + 'index.html');
  await p.evaluate(async d => {
    localStorage.clear(); for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v);
    const sembrar = (bd, id) => new Promise(ok => { const r = indexedDB.open(bd, 1); r.onupgradeneeded = () => r.result.createObjectStore('tpl', { keyPath: 'id' });
      r.onsuccess = () => { const tx = r.result.transaction('tpl', 'readwrite'); tx.objectStore('tpl').put({ id, url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' }); tx.oncomplete = () => { r.result.close(); ok(); }; }; });
    await sembrar('misjuegos', 'lamina-del-juego'); await sembrar('d016-misjuegos', 'lamina-de-d016'); await sembrar('d021-misjuegos', 'lamina-de-d021');
  }, JUEGO);
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  // 2. la copia
  await p.goto(COPIA); await p.waitForTimeout(1200);
  const info = await p.evaluate(() => ({ juego: Avatar.JUEGO, aislado: !!window.PRUEBA_D023, claves: Object.keys(localStorage), stars: localStorage.getItem('stars'),
    piel: Avatar.CAT.piel.map(o => o.id), ojos: Avatar.CAT.ojos.colores.map(o => o.id), pelo: Avatar.CAT.pelo.colores.map(o => o.id), acc: Avatar.CAT.accesorios.map(o => o.id) }));
  ok('La copia abre con la muñeca d023', info.juego === 'd023', 'juego: ' + info.juego);
  ok('Datos propios: no ve las claves del juego ni las de D-016 / D-021', info.aislado && info.stars === null && !info.claves.length, 'claves visibles: ' + JSON.stringify(info.claves));
  ok('Sin service worker en la copia', (await p.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)) === 0);
  ok('Catálogo: 4 pieles, 5 colores de pelo, 4 de ojos, corona y pintacaras', info.piel.join() === PIELES.join() && info.pelo.join() === PELOS.join() && info.ojos.join() === OJOS.join() && info.acc.join() === 'corona,pintacaras',
    [info.piel, info.pelo, info.ojos, info.acc].map(x => x.join('/')).join(' · '));
  // Vestir
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const vestir = await p.evaluate(`({ capas: ${capasDe('#avStage')}, pestanas: [...document.querySelectorAll('#dtabs .btn')].map(x => x.textContent.trim()) })`);
  const def = esperadas('clara', 'castano', 'marron', false, true);
  ok('«Vestir» abre con el conjunto aprobado (piel clara, castaño, marrones, sin pintacaras)', def.every(c => vestir.capas.includes(c)) && vestir.capas.length === def.length, vestir.capas.join(' '));
  ok('Pestañas Piel, Ojos, Pelo, Ropa y Adornos', ['Piel', 'Ojos', 'Pelo', 'Ropa', 'Adornos'].every(t => vestir.pestanas.some(x => x.includes(t))), vestir.pestanas.join(' · '));
  // tocar de verdad: pestaña Piel → «Profundo», pestaña Pelo → color jengibre (muestra), pestaña Ojos → «Lilas», Adornos → «Estrellas y brillo»
  const pest = t => p.evaluate(t => [...document.querySelectorAll('#dtabs .btn')].find(x => x.textContent.includes(t)).click(), t).then(() => p.waitForTimeout(500));
  await pest('Piel'); const opPiel = await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].map(x => x.textContent.trim()));
  await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].find(x => x.textContent.includes('Profundo')).click()); await p.waitForTimeout(900);
  await pest('Pelo'); const muestras = await p.evaluate(() => [...document.querySelectorAll('#dopts .swatch')].map(x => x.getAttribute('aria-label')));
  await p.evaluate(() => [...document.querySelectorAll('#dopts .swatch')].find(x => x.getAttribute('aria-label') === 'Pelirrojo jengibre').click()); await p.waitForTimeout(900);
  await pest('Ojos'); await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].find(x => x.textContent.includes('Lilas')).click()); await p.waitForTimeout(900);
  await pest('Adornos'); await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].find(x => x.textContent.includes('Estrellas y brillo')).click()); await p.waitForTimeout(1200);
  const tocado = await p.evaluate(capasDe('#avStage'));
  const espT = esperadas('profunda', 'jengibre', 'lila', true, true);
  ok('Tocando las pestañas: piel profunda + pelirrojo + lilas + pintacaras', espT.every(c => tocado.includes(c)) && tocado.length === espT.length,
    `piel: ${opPiel.join('/')} · pelo: ${muestras.join('/')} · ${tocado.length} capas`);
  await p.screenshot({ path: path.join(OUT, 'vestir-profunda-jengibre.png') });
  // combinaciones
  const fallos = []; let n = 0;
  for (const piel of PIELES) for (const [i, pelo] of PELOS.entries()) for (const pinta of [true, false]) {
    const ojos = OJOS[(i + PIELES.indexOf(piel) + (pinta ? 1 : 0)) % 4];
    const c = await p.evaluate(([piel, pelo, ojos, acc, sel]) => { avChange({ piel, pelo: { color: pelo }, ojos: { color: ojos }, ropa: 'princesa', accesorios: acc }); return new Promise(o => setTimeout(() => o(eval(sel)), 700)); },
      [piel, pelo, ojos, ['corona'].concat(pinta ? ['pintacaras'] : []), capasDe('#avStage')]);
    const e = esperadas(piel, pelo, ojos, pinta, true); n++;
    if (!(e.every(x => c.includes(x)) && c.length === e.length)) fallos.push(`${piel}/${pelo}/${ojos}${pinta ? '/pintacaras' : ''}: ${c.join(' ')}`);
  }
  for (const piel of PIELES) for (const ojos of OJOS) {
    const c = await p.evaluate(([piel, ojos, sel]) => { avChange({ piel, pelo: { color: 'miel' }, ojos: { color: ojos }, accesorios: [] }); return new Promise(o => setTimeout(() => o(eval(sel)), 700)); }, [piel, ojos, capasDe('#avStage')]);
    const e = esperadas(piel, 'miel', ojos, false, false); n++;
    if (!(e.every(x => c.includes(x)) && c.length === e.length)) fallos.push(`${piel}/miel/${ojos}: ${c.join(' ')}`);
  }
  ok('Combinaciones (piel × pelo × pintacaras, y piel × ojos) dibujan solo sus capas', !fallos.length, fallos.slice(0, 2).join(' | ') || n + ' combinaciones');
  // camiseta: sin vestido, sin manos ni bordes del vestido
  const cam = await p.evaluate(sel => { avChange({ piel: 'morena', pelo: { color: 'oscuro' }, ojos: { color: 'verde' }, ropa: 'camiseta', accesorios: ['pintacaras'] }); return new Promise(o => setTimeout(() => o(eval(sel)), 800)); }, capasDe('#avStage'));
  const eCam = esperadas('morena', 'oscuro', 'verde', true, false, 'camiseta');
  ok('Con la camiseta: sin vestido, manos ni bordes del vestido', eCam.every(x => cam.includes(x)) && cam.length === eCam.length, cam.join(' '));
  // parpadeo con cada piel
  const parp = [];
  for (const piel of PIELES) {
    await p.evaluate(piel => avChange({ piel, pelo: { color: 'jengibre' }, ojos: { color: 'azul' }, ropa: 'princesa', accesorios: ['corona', 'pintacaras'] }), piel); await p.waitForTimeout(800);
    const v = await p.evaluate(async () => {
      const r = document.querySelector('#avStage svg.av'), d = el => el ? getComputedStyle(el).display : 'falta';
      const cerr = r.querySelector('.av-closed image'), pinta = () => d([...r.querySelectorAll('image')].find(i => i.getAttribute('href').includes('d023-pintacaras')));
      r.classList.add('blink'); await new Promise(o => setTimeout(o, 30));
      const a = [d(r.querySelector('.av-open')), d(r.querySelector('.av-closed')), pinta()]; r.classList.remove('blink');
      return { a: a.concat([d(r.querySelector('.av-open')), d(r.querySelector('.av-closed')), pinta()]), cerr: cerr.getAttribute('href').split('/').pop().split('.')[0] };
    });
    parp.push(`${piel}: ${v.a.join() === 'none,inline,inline,inline,none,inline' && v.cerr === 'd023-cerrados-' + piel ? 'ok' : v.a.join() + ' ' + v.cerr}`);
    if (piel === 'profunda') await p.screenshot({ path: path.join(OUT, 'parpadeo-profunda.png') });
  }
  ok('Parpadeo con cada piel (ojos cerrados de su tono; pintacaras igual)', parp.every(x => x.endsWith('ok')), parp.join(' · '));
  // guardar y volver a abrir
  await p.evaluate(() => avChange({ piel: 'profunda', pelo: { color: 'jengibre' }, ojos: { color: 'lila' }, ropa: 'princesa', accesorios: ['corona', 'pintacaras'] }));
  await p.waitForTimeout(500); await p.click('#dSave'); await p.waitForTimeout(500);
  await p.reload(); await p.waitForTimeout(1000);
  const g = await p.evaluate(() => { const g = Avatar.cargar(), d = Avatar.borrador(); const k = x => [x.piel, x.pelo.color, x.ojos.color, x.ropa, x.accesorios.join('+')].join(' '); return { g: g && k(g), d: k(d) }; });
  ok('Guardado: profunda · jengibre · lila · vestido · corona+pintacaras se recupera al volver a abrir', g.g === 'profunda jengibre lila princesa corona+pintacaras' && g.d === g.g, JSON.stringify(g));
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1200);
  await p.evaluate(() => avChange({ piel: 'dorada', pelo: { color: 'miel' }, ojos: { color: 'verde' }, accesorios: ['corona'] })); await p.waitForTimeout(400);
  await p.reload(); await p.waitForTimeout(1000);
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const borr = await p.evaluate(sel => ({ g: [Avatar.cargar().piel, Avatar.cargar().pelo.color, Avatar.cargar().ojos.color].join(' '), capas: eval(sel), aviso: document.getElementById('avSaved').textContent }), capasDe('#avStage'));
  const eB = esperadas('dorada', 'miel', 'verde', false, true);
  ok('Cambios sin guardar (dorada · miel · verdes) siguen en «Vestir» al volver a abrir; lo guardado no cambia',
    eB.every(x => borr.capas.includes(x)) && borr.capas.length === eB.length && borr.g === 'profunda jengibre lila' && /sin guardar/i.test(borr.aviso), `${borr.g} · ${borr.aviso}`);
  // Mi Mundo con lo guardado
  await p.evaluate(() => avChange({ piel: 'profunda', pelo: { color: 'jengibre' }, ojos: { color: 'lila' }, accesorios: ['corona', 'pintacaras'] })); await p.waitForTimeout(400);
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  const mundo = await p.evaluate(capasDe('#avWorld'));
  ok('«Mi Mundo» muestra la muñeca guardada', await p.evaluate(() => !!document.querySelector('#roomLayer svg')) && espT.every(c => mundo.includes(c)), mundo.length + ' capas');
  await p.screenshot({ path: path.join(OUT, 'mi-mundo.png') });
  await p.evaluate(() => Progreso.datosFicticios()); await p.waitForTimeout(400);
  // 3. el juego y las pruebas congeladas: sus datos siguen igual
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(600);
  const despues = await p.evaluate(async () => {
    const d = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); d[k] = localStorage.getItem(k); }
    const bases = indexedDB.databases ? (await indexedDB.databases()).map(x => x.name) : [];
    const lam = bd => new Promise(ok => { const r = indexedDB.open(bd, 1); r.onsuccess = () => { const q = r.result.transaction('tpl').objectStore('tpl').getAll(); q.onsuccess = () => { r.result.close(); ok(q.result.map(x => x.id).join()); }; }; });
    return { d, bases, lam: [await lam('misjuegos'), await lam('d016-misjuegos'), await lam('d021-misjuegos')] };
  });
  const nuevas = Object.keys(despues.d).filter(k => !(k in JUEGO));
  ok('Las claves del juego y las de D-016 / D-021 siguen intactas', Object.entries(JUEGO).every(([k, v]) => despues.d[k] === v));
  ok('Todo lo que escribió la copia lleva «d023:»', nuevas.length > 0 && nuevas.every(k => k.startsWith('d023:')), nuevas.join(', '));
  ok('IndexedDB: la copia usa sus propias bases; las del juego y de las pruebas congeladas siguen igual',
    despues.lam.join('|') === 'lamina-del-juego|lamina-de-d016|lamina-de-d021' && despues.bases.filter(n => !['misjuegos', 'd016-misjuegos', 'd021-misjuegos'].includes(n)).every(n => n.startsWith('d023-')), despues.bases.join(', '));
  // 4. muñeca anterior disponible en la copia
  const anteriores = [];
  for (const a of ['prueba', 'borrador', 'svg']) { await p.goto(COPIA + '?arte=' + a); await p.waitForTimeout(700); anteriores.push(a + ':' + await p.evaluate(() => Avatar.JUEGO || Avatar.MODO)); }
  ok('La muñeca anterior sigue disponible en la copia', anteriores.join() === 'prueba:prueba,borrador:premium,svg:svg', anteriores.join(' '));
  ok('Sin errores en la consola', !errs.length, errs.slice(0, 3).join(' | '));
  // 5. a tamaño real
  const p2 = await (await b.newContext({ viewport: { width: 948, height: 1659 } })).newPage();
  await p2.goto(COPIA); await p2.waitForTimeout(800);
  await p2.evaluate(async () => {
    const s = Avatar.normalizar({ piel: 'profunda', pelo: { estilo: 'rizos', color: 'jengibre' }, ropa: 'princesa', zapatos: 'princesa', ojos: { color: 'lila' }, accesorios: ['corona', 'pintacaras'] });
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
