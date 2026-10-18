#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia aislada D-026 (Chromium con pantalla de iPhone simulada)

   Uso (desde la raíz):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-juego-d026/prueba-aislada.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · datos propios: con datos «del juego» y de las pruebas congeladas D-016, D-021 y D-023 sembrados antes, la copia no
       los ve, no los cambia y no los migra; todo lo que escribe va con «d026:» / «d026-»; sin service worker;
     · «Vestir»: pestañas Piel (4), Ojos (4), Pelo (5 peinados y 5 colores), Ropa y Adornos (8); abre con la melena;
     · tocando de verdad: dos coletas con sombrero (se quita la corona), un adorno de pelo con las coletas (vuelve a la
       melena), la gorra (quita el lazo y la corona), la corona (quita la gorra) y el pintacaras con la coleta;
     · compatibilidades: todas las parejas de adornos con la melena y cada adorno con cada peinado;
     · combinaciones: 5 peinados × 4 pieles × 5 colores (con los ojos repartidos y pintacaras en la mitad), y cada
       adorno sobre la melena: cada una dibuja solo sus capas (orejas, bordes, cejas a juego, cinta, coleteros, sombrero);
     · parpadeo con cada peinado y cada piel;
     · guardar y volver a abrir (y los cambios sin guardar); «Mi Mundo» con lo guardado;
     · la muñeca anterior sigue disponible (?arte=prueba, ?arte=borrador, ?arte=svg); sin errores;
     · a tamaño real (dos coletas sin sombrero, piel profunda, pelirrojo, ojos lilas, pintacaras) para compararla.
   Las capturas se guardan FUERA del repositorio.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-juego-d026/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-d026-'));
const AV = (piel, color, acc) => JSON.stringify({ v: 1, piel, ojos: { color, forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: acc });
const JUEGO = { stars: '37', avatar: JSON.stringify({ v: 1, piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'melena', color: 'castano' }, ropa: 'vestido', zapatos: null, accesorios: [] }),
  doll: '{"skin":3,"hc":3,"hs":2}', lv_contar: '2', iceCoins: '5', gal: JSON.stringify(['data:image/png;base64,iVBORw0KGgo=']),
  'd016:stars': '12', 'd016:avatar': AV('clara', 'marron', ['corona']), 'd021:stars': '8', 'd021:avatar': AV('clara', 'lila', ['corona', 'pintacaras']),
  'd023:stars': '9', 'd023:avatar': AV('profunda', 'lila', ['corona', 'pintacaras']) };
const PIELES = ['clara', 'dorada', 'morena', 'profunda'], PELOS = ['castano', 'chocolate', 'miel', 'oscuro', 'jengibre'], OJOS = ['marron', 'azul', 'verde', 'lila'];
const ESTILOS = ['rizos', 'coleta', 'coleta-sin-cinta', 'coletas', 'coletas-sin-sombrero'];
const ACC = ['corona', 'lazo', 'flores', 'mariposa', 'diadema', 'gorrito', 'gorra', 'pintacaras'], PELO_ACC = ['lazo', 'flores', 'mariposa', 'diadema', 'gorrito', 'gorra'];
const res = []; const ok = (n, c, x = '') => { res.push([!!c, n]); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const capasDe = sel => `[...document.querySelectorAll('${sel} svg.av image')].map(i => i.getAttribute('href').split('/').pop().split('.')[0])`;
// las capas que debe dibujar cada elección
function esperadas(piel, pelo, ojos, estilo, acc, ropa = 'princesa') {
  const c = [`d026-base-${piel}`, `d026-ojos-${ojos}-${piel}`, `d026-cerrados-${piel}`, 'd026-zapatos'], osc = piel !== 'clara';
  if (pelo !== 'castano') c.push(`d026-cejas-${pelo}-${piel}`);
  if (osc) c.push(`d026-bordes-zapatos-${piel}`);
  if (ropa === 'princesa') c.push('d026-vestido', `d026-manos-${piel}`, ...(osc ? [`d026-bordes-vestido-${piel}`] : []));
  if (estilo === 'rizos') c.push(`d026-pelo-detras-${pelo}`, `d026-pelo-delante-${pelo}`, ...(osc ? [`d026-bordes-pelo-${pelo}-${piel}`] : []));
  else if (estilo.startsWith('coletas')) {
    const v = estilo === 'coletas' ? 'con' : 'sin';
    c.push(`d026-coletas-${v}-detras-${pelo}`, `d026-coletas-${v}-delante-${pelo}`, 'd026-coleteros', ...(osc ? [`d026-bordes-coletas-${v}-${pelo}-${piel}`] : []), ...(v === 'con' ? ['d026-sombrero'] : []));
  } else {
    const v = estilo === 'coleta' ? 'con' : 'sin';
    c.push(`d026-orejas-coleta-detras-${piel}`, `d026-orejas-coleta-delante-${piel}`, `d026-coleta-${v}-detras-${pelo}`, `d026-coleta-${v}-delante-${pelo}`,
      ...(osc ? [`d026-bordes-coleta-${v}-${pelo}-${piel}`] : []), ...(v === 'con' ? ['d026-cinta-coleta'] : []));
  }
  acc.forEach(a => c.push('d026-' + a));
  return c;
}
const igual = (c, e) => e.every(x => c.includes(x)) && c.length === e.length;
// lo que deben dejar las compatibilidades (independiente del motor): de atrás hacia delante, sin repetir ni chocar
function reglas(lista, estilo) {
  const grupo = a => PELO_ACC.includes(a), solo = a => a !== 'pintacaras';
  const choca = (a, b) => (grupo(a) && grupo(b)) || (a === 'corona' && ['diadema', 'gorrito', 'gorra'].includes(b)) || (b === 'corona' && ['diadema', 'gorrito', 'gorra'].includes(a));
  const q = [];
  for (let i = lista.length - 1; i >= 0; i--) { const a = lista[i]; if (solo(a) && estilo !== 'rizos') continue; if (q.includes(a) || q.some(b => choca(a, b))) continue; q.unshift(a); }
  return q;
}

(async () => {
  const b = await pw.chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  // 1. datos «del juego» y de las pruebas congeladas en el mismo origen, con sus bases IndexedDB
  await p.goto(BASE + 'index.html');
  await p.evaluate(async d => {
    localStorage.clear(); for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v);
    const sembrar = (bd, id) => new Promise(ok => { const r = indexedDB.open(bd, 1); r.onupgradeneeded = () => r.result.createObjectStore('tpl', { keyPath: 'id' });
      r.onsuccess = () => { const tx = r.result.transaction('tpl', 'readwrite'); tx.objectStore('tpl').put({ id, url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' }); tx.oncomplete = () => { r.result.close(); ok(); }; }; });
    for (const [bd, id] of [['misjuegos', 'lamina-del-juego'], ['d016-misjuegos', 'lamina-de-d016'], ['d021-misjuegos', 'lamina-de-d021'], ['d023-misjuegos', 'lamina-de-d023']]) await sembrar(bd, id);
  }, JUEGO);
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  // 2. la copia
  await p.goto(COPIA); await p.waitForTimeout(1500);
  const info = await p.evaluate(() => ({ juego: Avatar.JUEGO, aislado: !!window.PRUEBA_D026, claves: Object.keys(localStorage), stars: localStorage.getItem('stars'),
    piel: Avatar.CAT.piel.map(o => o.id), ojos: Avatar.CAT.ojos.colores.map(o => o.id), pelo: Avatar.CAT.pelo.colores.map(o => o.id),
    estilos: Avatar.CAT.pelo.estilos.map(o => o.id), acc: Avatar.CAT.accesorios.map(o => o.id) }));
  ok('La copia abre con la muñeca d026', info.juego === 'd026', 'juego: ' + info.juego);
  ok('Datos propios: no ve las claves del juego ni las de las pruebas congeladas', info.aislado && info.stars === null && !info.claves.length, 'claves visibles: ' + JSON.stringify(info.claves));
  ok('Sin service worker en la copia', (await p.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)) === 0);
  ok('Catálogo: 4 pieles, 5 colores, 4 ojos, 5 peinados y 8 adornos', info.piel.join() === PIELES.join() && info.pelo.join() === PELOS.join() && info.ojos.join() === OJOS.join()
    && info.estilos.join() === ESTILOS.join() && info.acc.join() === ACC.join(), [info.estilos, info.acc].map(x => x.join('/')).join(' · '));
  // Vestir
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const vestir = await p.evaluate(`({ capas: ${capasDe('#avStage')}, pestanas: [...document.querySelectorAll('#dtabs .btn')].map(x => x.textContent.trim()), estilo: avSt.pelo.estilo })`);
  ok('«Vestir» abre con la melena (piel clara, castaño, marrones, corona)', vestir.estilo === 'rizos' && igual(vestir.capas, esperadas('clara', 'castano', 'marron', 'rizos', ['corona'])), vestir.capas.join(' '));
  ok('Pestañas Piel, Ojos, Pelo, Ropa y Adornos', ['Piel', 'Ojos', 'Pelo', 'Ropa', 'Adornos'].every(t => vestir.pestanas.some(x => x.includes(t))), vestir.pestanas.join(' · '));
  const pest = t => p.evaluate(t => [...document.querySelectorAll('#dtabs .btn')].find(x => x.textContent.includes(t)).click(), t).then(() => p.waitForTimeout(500));
  const tocar = t => p.evaluate(t => { const b = [...document.querySelectorAll('#dopts .avopt')].find(x => x.textContent.trim().endsWith(t)); b.click(); return !!b; }, t).then(() => p.waitForTimeout(900));
  const estado = () => p.evaluate(() => avSt.pelo.estilo + ' | ' + avSt.accesorios.join('+'));
  await pest('Pelo'); const peinados = await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].map(x => x.textContent.trim()));
  const pasos = [];
  await tocar('Dos coletas con sombrero'); pasos.push(['dos coletas con sombrero → sin corona', await estado(), 'coletas | ']);
  await pest('Adornos'); const adornos = await p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].map(x => x.textContent.trim()));
  await tocar('Lazo de satén'); pasos.push(['lazo con las coletas → vuelve a la melena', await estado(), 'rizos | lazo']);
  await tocar('Corona'); pasos.push(['corona con el lazo → los dos', await estado(), 'rizos | lazo+corona']);
  await tocar('Gorra rosa'); pasos.push(['gorra → quita lazo y corona', await estado(), 'rizos | gorra']);
  await tocar('Corona'); pasos.push(['corona → quita la gorra', await estado(), 'rizos | corona']);
  await tocar('Diadema de estrellas'); pasos.push(['diadema → quita la corona', await estado(), 'rizos | diadema']);
  await tocar('Diadema de estrellas'); pasos.push(['diadema otra vez → se quita', await estado(), 'rizos | ']);
  await pest('Pelo'); await tocar('Coleta sin cinta'); await pest('Adornos'); await tocar('Estrellas y brillo'); pasos.push(['pintacaras con la coleta → se queda la coleta', await estado(), 'coleta-sin-cinta | pintacaras']);
  ok('Tocando: peinados y adornos con sus compatibilidades', pasos.every(x => x[1] === x[2]), pasos.map(x => x[0] + (x[1] === x[2] ? ' ✓' : ` ✗ (${x[1]})`)).join(' · '));
  ok('Pestaña Pelo: 5 peinados; Adornos: 8', peinados.length === 5 && adornos.length === 8, peinados.join(' / ') + ' · ' + adornos.join(' / '));
  await p.screenshot({ path: path.join(OUT, 'vestir-coleta-pintacaras.png') });
  // compatibilidades: todas las parejas con la melena, y cada adorno con cada peinado
  const compat = await p.evaluate(([A, E]) => {
    const r = {};
    for (const a of A) for (const b of A) r[`rizos:${a},${b}`] = Avatar.normalizar({ pelo: { estilo: 'rizos' }, accesorios: [a, b] }).accesorios.join('+');
    for (const e of E) for (const a of A) r[`${e}:${a}`] = Avatar.normalizar({ pelo: { estilo: e }, accesorios: [a] }).accesorios.join('+');
    return r;
  }, [ACC, ESTILOS]);
  const malC = Object.entries(compat).filter(([k, v]) => { const [e, l] = k.split(':'); return v !== reglas(l.split(','), e).join('+'); });
  ok('Compatibilidades: 64 parejas con la melena y 40 adorno × peinado', !malC.length, malC.slice(0, 3).map(x => x.join(' = ')).join(' | ') || Object.keys(compat).length + ' casos');
  // combinaciones
  const fallos = []; let n = 0;
  for (const [ie, estilo] of ESTILOS.entries()) for (const [ip, piel] of PIELES.entries()) for (const [ic, pelo] of PELOS.entries()) {
    const ojos = OJOS[(ie + ip + ic) % 4], acc = (ie + ip + ic) % 2 ? ['pintacaras'] : [];
    const c = await p.evaluate(([piel, pelo, ojos, estilo, acc, sel]) => { avChange({ piel, pelo: { estilo, color: pelo }, ojos: { color: ojos }, ropa: 'princesa', accesorios: acc }); return new Promise(o => setTimeout(() => o(eval(sel)), 450)); },
      [piel, pelo, ojos, estilo, acc, capasDe('#avStage')]);
    const e = esperadas(piel, pelo, ojos, estilo, acc); n++;
    if (!igual(c, e)) fallos.push(`${estilo}/${piel}/${pelo}/${ojos}: falta ${e.filter(x => !c.includes(x))} sobra ${c.filter(x => !e.includes(x))}`);
  }
  for (const a of ACC) {
    const c = await p.evaluate(([a, sel]) => { avChange({ piel: 'morena', pelo: { estilo: 'rizos', color: 'miel' }, ojos: { color: 'verde' }, accesorios: [a] }); return new Promise(o => setTimeout(() => o(eval(sel)), 450)); }, [a, capasDe('#avStage')]);
    const e = esperadas('morena', 'miel', 'verde', 'rizos', [a]); n++;
    if (!igual(c, e)) fallos.push(`adorno ${a}: ${c.join(' ')}`);
  }
  ok('Combinaciones (5 peinados × 4 pieles × 5 colores, y cada adorno) dibujan solo sus capas', !fallos.length, fallos.slice(0, 2).join(' | ') || n + ' combinaciones');
  const cam = await p.evaluate(sel => { avChange({ piel: 'profunda', pelo: { estilo: 'coletas', color: 'oscuro' }, ojos: { color: 'azul' }, ropa: 'camiseta', accesorios: [] }); return new Promise(o => setTimeout(() => o(eval(sel)), 700)); }, capasDe('#avStage'));
  ok('Con la camiseta (dos coletas con sombrero, profunda): sin vestido, manos ni sus bordes', igual(cam, esperadas('profunda', 'oscuro', 'azul', 'coletas', [], 'camiseta')), cam.length + ' capas');
  // parpadeo con cada peinado y cada piel
  const parp = [];
  for (const estilo of ESTILOS) for (const piel of PIELES) {
    await p.evaluate(([piel, estilo]) => avChange({ piel, pelo: { estilo, color: 'jengibre' }, ojos: { color: 'azul' }, ropa: 'princesa', accesorios: ['pintacaras'] }), [piel, estilo]); await p.waitForTimeout(500);
    const v = await p.evaluate(async () => {
      const r = document.querySelector('#avStage svg.av'), d = el => el ? getComputedStyle(el).display : 'falta';
      const cerr = r.querySelector('.av-closed image');
      r.classList.add('blink'); await new Promise(o => setTimeout(o, 30));
      const a = [d(r.querySelector('.av-open')), d(r.querySelector('.av-closed'))]; r.classList.remove('blink');
      return { a: a.concat([d(r.querySelector('.av-open')), d(r.querySelector('.av-closed'))]).join(), cerr: cerr.getAttribute('href').split('/').pop().split('.')[0] };
    });
    if (!(v.a === 'none,inline,inline,none' && v.cerr === 'd026-cerrados-' + piel)) parp.push(`${estilo}/${piel}: ${v.a} ${v.cerr}`);
    if (estilo === 'coletas' && piel === 'profunda') await p.screenshot({ path: path.join(OUT, 'parpadeo-coletas-profunda.png') });
  }
  ok('Parpadeo con cada peinado y cada piel (ojos cerrados de su tono)', !parp.length, parp.slice(0, 3).join(' · ') || '20 casos');
  // guardar y volver a abrir
  await p.evaluate(() => avChange({ piel: 'profunda', pelo: { estilo: 'coletas-sin-sombrero', color: 'jengibre' }, ojos: { color: 'lila' }, ropa: 'princesa', accesorios: ['pintacaras'] }));
  await p.waitForTimeout(500); await p.click('#dSave'); await p.waitForTimeout(500);
  await p.reload(); await p.waitForTimeout(1200);
  const k = 'x => [x.piel, x.pelo.estilo, x.pelo.color, x.ojos.color, x.ropa, x.accesorios.join("+")].join(" ")';
  const g = await p.evaluate(k => { const f = eval(k), g = Avatar.cargar(), d = Avatar.borrador(); return { g: g && f(g), d: f(d) }; }, k);
  const G = 'profunda coletas-sin-sombrero jengibre lila princesa pintacaras';
  ok('Guardado (dos coletas sin sombrero · profunda · pelirrojo · lilas · pintacaras) se recupera al volver a abrir', g.g === G && g.d === G, JSON.stringify(g));
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1200);
  await p.evaluate(() => avChange({ piel: 'dorada', pelo: { estilo: 'coleta', color: 'miel' }, ojos: { color: 'verde' }, accesorios: [] })); await p.waitForTimeout(400);
  await p.reload(); await p.waitForTimeout(1200);
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const borr = await p.evaluate(([k, sel]) => ({ g: eval(k)(Avatar.cargar()), capas: eval(sel), aviso: document.getElementById('avSaved').textContent }), [k, capasDe('#avStage')]);
  ok('Cambios sin guardar (coleta con cinta · dorada · miel) siguen en «Vestir» al volver a abrir; lo guardado no cambia',
    igual(borr.capas, esperadas('dorada', 'miel', 'verde', 'coleta', [])) && borr.g === G && /sin guardar/i.test(borr.aviso), `${borr.g} · ${borr.aviso}`);
  // Mi Mundo con lo guardado
  await p.evaluate(() => avChange({ piel: 'profunda', pelo: { estilo: 'coletas-sin-sombrero', color: 'jengibre' }, ojos: { color: 'lila' }, accesorios: ['pintacaras'] })); await p.waitForTimeout(400);
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  const mundo = await p.evaluate(capasDe('#avWorld'));
  ok('«Mi Mundo» muestra la muñeca guardada', await p.evaluate(() => !!document.querySelector('#roomLayer svg')) && esperadas('profunda', 'jengibre', 'lila', 'coletas-sin-sombrero', ['pintacaras']).every(c => mundo.includes(c)), mundo.length + ' capas');
  await p.screenshot({ path: path.join(OUT, 'mi-mundo.png') });
  await p.evaluate(() => Progreso.datosFicticios()); await p.waitForTimeout(400);
  // 3. el juego y las pruebas congeladas: sus datos siguen igual
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(600);
  const despues = await p.evaluate(async () => {
    const d = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); d[k] = localStorage.getItem(k); }
    const bases = indexedDB.databases ? (await indexedDB.databases()).map(x => x.name) : [];
    const lam = bd => new Promise(ok => { const r = indexedDB.open(bd, 1); r.onsuccess = () => { const q = r.result.transaction('tpl').objectStore('tpl').getAll(); q.onsuccess = () => { r.result.close(); ok(q.result.map(x => x.id).join()); }; }; });
    return { d, bases, lam: [await lam('misjuegos'), await lam('d016-misjuegos'), await lam('d021-misjuegos'), await lam('d023-misjuegos')] };
  });
  const nuevas = Object.keys(despues.d).filter(k => !(k in JUEGO));
  ok('Las claves del juego y las de D-016 / D-021 / D-023 siguen intactas', Object.entries(JUEGO).every(([k, v]) => despues.d[k] === v));
  ok('Todo lo que escribió la copia lleva «d026:»', nuevas.length > 0 && nuevas.every(k => k.startsWith('d026:')), nuevas.join(', '));
  const viejas = ['misjuegos', 'd016-misjuegos', 'd021-misjuegos', 'd023-misjuegos'];
  ok('IndexedDB: la copia usa sus propias bases; las del juego y de las pruebas congeladas siguen igual',
    despues.lam.join('|') === 'lamina-del-juego|lamina-de-d016|lamina-de-d021|lamina-de-d023' && despues.bases.filter(n => !viejas.includes(n)).every(n => n.startsWith('d026-')), despues.bases.join(', '));
  // 4. muñeca anterior disponible en la copia
  const anteriores = [];
  for (const a of ['prueba', 'borrador', 'svg']) { await p.goto(COPIA + '?arte=' + a); await p.waitForTimeout(700); anteriores.push(a + ':' + await p.evaluate(() => Avatar.JUEGO || Avatar.MODO)); }
  ok('La muñeca anterior sigue disponible en la copia', anteriores.join() === 'prueba:prueba,borrador:premium,svg:svg', anteriores.join(' '));
  ok('Sin errores en la consola', !errs.length, errs.slice(0, 3).join(' | '));
  // 5. a tamaño real
  const p2 = await (await b.newContext({ viewport: { width: 948, height: 1659 } })).newPage();
  await p2.goto(COPIA); await p2.waitForTimeout(800);
  await p2.evaluate(async () => {
    const s = Avatar.normalizar({ piel: 'profunda', pelo: { estilo: 'coletas-sin-sombrero', color: 'jengibre' }, ropa: 'princesa', zapatos: 'princesa', ojos: { color: 'lila' }, accesorios: ['pintacaras'] });
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
