#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia completa: muñeca nueva (conjuntos y adornos aprobados) + Pintar, Heladería y logros
   (Chromium; iPhone e iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-completa-2026-10-22/prueba-completa.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · la muñeca: abre con el juego «todo», sin service worker y con datos propios («com1:»); las 900 recetas
       (9 ropas y variantes × 5 peinados × 4 pieles × 5 colores) dibujan exactamente las capas del visor aprobado, en su
       orden; los 160 casos de adornos (cada adorno, con y sin corona, con cada peinado, piel clara y dorada) quedan como
       en el visor y con sus mismas capas; todas las piezas cargan; a tamaño real coinciden píxel a píxel con las capas
       aprobadas; «Vestir» de verdad (ropa con sus adornos, quitar la varita vuelve la mano original, adornos según el
       peinado, avisos), parpadeo, guardar y volver a abrir, «Mi Mundo»;
     · Pintar, Heladería y logros: la prueba de la copia conjunta (../prueba-conjunta-2026-10-22/prueba-conjunta.js) sin
       cambiar ninguna comprobación, solo apuntando a esta copia y a su prefijo «com1:» (y con «con1:» y «d026:» entre los
       datos ajenos que no se pueden tocar);
     · los datos del juego y de las otras copias, intactos; sin errores de JavaScript.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync, spawnSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const CARPETA = 'docs/propuestas/prueba-completa-2026-10-22/';
const COPIA = BASE + CARPETA + 'index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-completa-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const V = JSON.parse(fs.readFileSync(path.join(__dirname, 'capas-del-visor.json'), 'utf8'));
const ADORNO = { 'gorrito-b': 'gorrito' };
const AJENOS = { stars: '50', gal: '[]', avatar: '{"v":1,"piel":"morena"}', 'con1:stars': '6', 'd026:avatar': '{"v":1}', 'pin1:stars': '3' };
// estado del juego para una clave del visor (ropa|peinado|piel|pelo)
const ROPA = { vestido: ['princesa', []], camiseta: ['camiseta', []], aventura: ['aventura', ['mochila']], 'aventura-sin-mochila': ['aventura', []],
  pijama: ['pijama', []], hada: ['hada', ['alas', 'varita']], 'hada-sin-alas': ['hada', ['varita']], 'hada-sin-varita': ['hada', ['alas']], 'hada-sin-nada': ['hada', []] };

(async () => {
  const b = await pw.chromium.launch();
  const errs = [];
  const nueva = async (vp = { width: 390, height: 844 }) => {
    const c = await b.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: vp.width < 900, hasTouch: true }); const p = await c.newPage();
    p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
    return { c, p };
  };
  // ---------- 1. datos ajenos en el mismo origen; la copia abre con la muñeca «todo» ----------
  const { c, p } = await nueva();
  await p.goto(BASE + 'index.html?arte=svg');
  await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
  // el juego registra su service worker en este origen: se quita para ver si la copia registra alguno
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  await p.goto(COPIA); await p.waitForTimeout(1200);
  const info = await p.evaluate(async () => ({ juego: Avatar.JUEGO, aislado: !!window.PRUEBA_COMPLETA, claves: Object.keys(localStorage),
    sw: (await navigator.serviceWorker.getRegistrations()).length, cinta: document.body.textContent.includes('PRUEBA COMPLETA · datos propios'),
    ropa: Avatar.CAT.ropa.map(o => o.id), acc: Avatar.CAT.accesorios.map(o => o.id), est: Avatar.CAT.pelo.estilos.map(o => o.id),
    piel: Avatar.CAT.piel.length, pelo: Avatar.CAT.pelo.colores.length, ojos: Avatar.CAT.ojos.colores.length }));
  ok('La copia abre con la muñeca «todo», su cinta y sin service worker', info.juego === 'todo' && info.cinta && info.sw === 0, info.juego);
  ok('Datos propios: no ve las claves del juego ni las de las otras copias', info.aislado && !info.claves.length, JSON.stringify(info.claves));
  ok('Catálogo: 4 pieles, 5 colores, 4 ojos, 5 peinados, 5 ropas y 12 adornos', info.piel === 4 && info.pelo === 5 && info.ojos === 4 && info.est.length === 5 &&
    info.ropa.join() === 'princesa,camiseta,aventura,pijama,hada' && info.acc.length === 12, info.acc.join('/'));
  // ---------- 2. las 900 recetas = el visor ----------
  const casos = Object.entries(V.combos).map(([k, capas]) => { const [r, e, piel, pelo] = k.split('|');
    return { k, st: { piel, ojos: { color: 'marron' }, pelo: { estilo: e, color: pelo }, ropa: ROPA[r][0], accesorios: ROPA[r][1] },
      visor: capas.map(x => x.split('=')[1]) }; });
  const mal = await p.evaluate(casos => casos.filter(x => { const n = Avatar.normalizar(x.st);
    const f = Avatar.piezasDe(n).filter(c => c.k !== 'ojosCerrados').map(c => c.p.fuente || '');
    return JSON.stringify(f) !== JSON.stringify(x.visor) || JSON.stringify(n.accesorios) !== JSON.stringify(x.st.accesorios); }).map(x => x.k), casos);
  ok('900 recetas (ropa × peinado × piel × color): las mismas capas que el visor aprobado, en el mismo orden', !mal.length, mal.slice(0, 4).join(' · ') || '900/900');
  // ---------- 3. adornos = el visor ----------
  const casosA = Object.entries(V.adornos).map(([k, v]) => { const [e, piel, cor, a] = k.split('|');
    const pedido = (cor === 'si' ? ['corona'] : []).concat(a === 'ninguno' ? [] : [ADORNO[a] || a]);
    const puesto = (v.puesto.corona ? ['corona'] : []).concat(v.puesto.acc === 'ninguno' ? [] : [ADORNO[v.puesto.acc] || v.puesto.acc]);
    return { k, st: { piel, ojos: { color: 'marron' }, pelo: { estilo: e, color: 'castano' }, ropa: 'princesa', accesorios: pedido }, puesto, visor: v.capas.map(x => x.split('=')[1]) }; });
  const malA = await p.evaluate(casos => casos.filter(x => { const n = Avatar.normalizar(x.st);
    const f = Avatar.piezasDe(n).filter(c => c.k !== 'ojosCerrados').map(c => c.p.fuente);
    return JSON.stringify(f) !== JSON.stringify(x.visor) || JSON.stringify([...n.accesorios].sort()) !== JSON.stringify([...x.puesto].sort()); }).map(x => x.k), casosA);
  ok('160 casos de adornos (con y sin corona, cada peinado, piel clara y dorada): lo que se queda y sus capas, como en el visor', !malA.length, malA.slice(0, 4).join(' · ') || '160/160');
  const ext = await p.evaluate(() => Avatar.piezasDe({ piel: 'dorada', ojos: { color: 'lila' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', accesorios: ['pintacaras'] })
    .filter(c => c.k !== 'ojosCerrados').map(c => c.p.fuente));
  ok('Ojos lilas y pintacaras: como en el visor', JSON.stringify(ext) === JSON.stringify(V.extra['vestido|rizos|dorada|castano|lila|pintacaras'].map(x => x.split('=')[1])));
  // ---------- 4. todas las piezas cargan ----------
  const carga = await p.evaluate(async () => { const us = [...new Set(Object.entries(AV_PIEZAS.piezas).filter(([n]) => n.startsWith('todo-')).map(([, x]) => x.v.m))];
    const r = await Promise.all(us.map(u => new Promise(o => { const im = new Image(); im.onload = () => o(im.naturalWidth > 0); im.onerror = () => o(false); im.src = u; })));
    return { n: us.length, fallos: r.filter(x => !x).length }; });
  ok('Todas las piezas de la muñeca cargan', carga.n > 300 && !carga.fallos, `${carga.n} archivos, ${carga.fallos} fallos`);
  // ---------- 5. a tamaño real: piezas = capas aprobadas, píxel a píxel ----------
  const MUESTRA = ['hada|rizos|profunda|jengibre', 'hada-sin-varita|coleta|dorada|miel', 'hada-sin-alas|coletas-sin-sombrero|morena|oscuro', 'aventura|coletas|profunda|chocolate',
    'aventura-sin-mochila|rizos|clara|castano', 'pijama|coleta-sin-cinta|morena|jengibre', 'vestido|coletas|dorada|miel', 'camiseta|rizos|profunda|castano'];
  const px = await p.evaluate(async ([casos, M]) => {
    const carga = u => new Promise((o, k) => { const im = new Image(); im.onload = () => o(im); im.onerror = k; im.src = u; });
    const lienzo = () => { const c = document.createElement('canvas'); c.width = 948; c.height = 1659; return c; };
    const out = [];
    for (const k of M) { const x = casos.find(c => c.k === k), ps = Avatar.piezasDe(x.st).filter(c => c.k !== 'ojosCerrados');
      const a = lienzo(), b = lienzo(), ga = a.getContext('2d'), gb = b.getContext('2d');
      for (const c of ps) { ga.drawImage(await carga(c.p.v.m), c.p.x, c.p.y, c.p.w, c.p.h); gb.drawImage(await carga(c.p.fuente), 0, 0); }
      const da = ga.getImageData(0, 0, 948, 1659).data, db = gb.getImageData(0, 0, 948, 1659).data; let m = 0, n = 0;
      for (let i = 0; i < da.length; i += 4) if (da[i + 3] === 255 && db[i + 3] === 255) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); if (d > m) m = d; if (d > 2) n++; }
      out.push([k, m, n]); }
    return out; }, [casos, MUESTRA]);
  ok('A tamaño real, 8 combinaciones (hada, aventura, pijama, vestido, camiseta) coinciden con las capas aprobadas', px.every(([, m]) => m <= 4), px.map(([k, m]) => k.split('|')[0] + ' ' + m).join(' · '));
  // ---------- 6. «Vestir» de verdad ----------
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1500);
  const pest = t => p.evaluate(t => [...document.querySelectorAll('#dtabs .btn')].find(x => x.textContent.includes(t)).click(), t).then(() => p.waitForTimeout(400));
  const tocar = t => p.evaluate(t => { const b = [...document.querySelectorAll('#dopts .avopt')].find(x => x.textContent.trim().endsWith(t)); if (b) b.click(); return !!b; }, t).then(r => p.waitForTimeout(700).then(() => r));
  const opciones = () => p.evaluate(() => [...document.querySelectorAll('#dopts .avopt')].map(x => x.textContent.trim()));
  const st = () => p.evaluate(() => ({ ropa: avSt.ropa, acc: avSt.accesorios.join('+'), estilo: avSt.pelo.estilo, toast: document.getElementById('toast').textContent,
    manos: (Avatar.piezasDe(avSt).find(c => c.k === 'brazos') || {}).p }));
  const v0 = await st();
  ok('«Vestir» abre con la melena, el vestido rosa y la corona', v0.ropa === 'princesa' && v0.acc === 'corona' && v0.estilo === 'rizos');
  await pest('Ropa'); const ropas = await opciones(); await tocar('Hada'); const h1 = await st();
  ok('Ropa: vestido, camiseta, aventura, pijama y hada; el hada se pone con sus alas y su varita (mano de agarre)', ropas.length === 5 && h1.ropa === 'hada' && h1.acc === 'corona+alas+varita' &&
    /agarre/.test(h1.manos && h1.manos.fuente), ropas.join(' / '));
  await pest('Adornos'); const accH = await opciones(); await tocar('Varita'); const h2 = await st();
  ok('Adornos con el hada: alas y varita; sin varita vuelve la mano original', accH.some(t => t.endsWith('Varita')) && accH.some(t => t.endsWith('Alas de hada')) && h2.acc === 'corona+alas' &&
    h2.manos && /brazos-delante-copiados-de-la-base/.test(h2.manos.fuente), h2.manos && h2.manos.fuente);
  await p.screenshot({ path: path.join(OUT, 'vestir-hada-sin-varita.png') });
  await pest('Pelo'); await tocar('Dos coletas con sombrero'); const h3 = await st();
  ok('Dos coletas con sombrero: la corona se quita avisando y no se cambia de peinado', h3.estilo === 'coletas' && h3.acc === 'alas' && /Se ha quitado: Corona/.test(h3.toast), h3.toast);
  await pest('Adornos'); const accC = (await opciones()).map(t => t.replace(/^\W+/, ''));
  ok('Adornos con las dos coletas con sombrero: solo los que van (flores, mariposa, dos lazos pequeños, pintacaras, alas, varita)',
    ['Pasador de flores', 'Mariposa lila', 'Dos lazos pequeños', 'Estrellas y brillo', 'Alas de hada', 'Varita'].every(t => accC.some(x => x.endsWith(t))) && accC.length === 6, accC.join(' / '));
  await pest('Ropa'); await tocar('Conjunto de aventura'); const a1 = await st();
  ok('Aventura: se pone su mochila; las alas se van con el hada', a1.ropa === 'aventura' && a1.acc === 'mochila', a1.acc);
  await p.screenshot({ path: path.join(OUT, 'vestir-aventura.png') });
  await pest('Ropa'); await tocar('Pijama'); await pest('Pelo'); await tocar('Melena suelta'); await pest('Adornos'); await tocar('Gorrito de dormir'); const pj = await st();
  ok('Pijama con la melena y el gorrito de dormir', pj.ropa === 'pijama' && pj.estilo === 'rizos' && pj.acc === 'gorrito');
  await p.screenshot({ path: path.join(OUT, 'vestir-pijama-gorrito.png') });
  // parpadeo con cada ropa
  const parp = await p.evaluate(async () => { const malos = [];
    for (const r of ['princesa', 'camiseta', 'aventura', 'pijama', 'hada']) for (const piel of ['clara', 'profunda']) {
      avChange({ ropa: r, piel, accesorios: [] }); await new Promise(o => setTimeout(o, 450));
      const s = document.querySelector('#avStage svg.av'), d = el => el ? getComputedStyle(el).display : 'falta';
      s.classList.add('blink'); await new Promise(o => setTimeout(o, 30)); const a = [d(s.querySelector('.av-open')), d(s.querySelector('.av-closed'))]; s.classList.remove('blink');
      if (a[0] !== 'none' || a[1] === 'none' || a[1] === 'falta') malos.push(r + '/' + piel); }
    return malos; });
  ok('Parpadeo con cada ropa (piel clara y profunda)', !parp.length, parp.join(' '));
  // guardar y volver a abrir; Mi Mundo
  await p.evaluate(() => avChange({ piel: 'morena', pelo: { estilo: 'coleta', color: 'miel' }, ojos: { color: 'verde' }, ropa: 'hada', accesorios: ['alas', 'varita', 'flores'] }));
  await p.waitForTimeout(500); await p.click('#dSave'); await p.waitForTimeout(500); await p.reload(); await p.waitForTimeout(1200);
  const g = await p.evaluate(() => { const x = Avatar.cargar(); return x && [x.piel, x.pelo.estilo, x.pelo.color, x.ojos.color, x.ropa, x.accesorios.join('+')].join(' '); });
  ok('Guardado (hada con alas, varita y flores · coleta · morena · miel · verdes) se recupera al volver a abrir', g === 'morena coleta miel verde hada alas+varita+flores', g);
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  const mundo = await p.evaluate(() => [...document.querySelectorAll('#avWorld image')].map(i => i.getAttribute('href')));
  ok('«Mi Mundo» muestra la muñeca guardada (con la mano de agarre)', mundo.some(u => /mano-agarre/.test(u)) && mundo.some(u => /pein-flores-coleta-con|flores-coleta-con/.test(u)), mundo.length + ' capas');
  await p.screenshot({ path: path.join(OUT, 'mi-mundo.png') });
  // datos ajenos intactos
  await p.goto(BASE + 'index.html?arte=svg');
  const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const propias = Object.keys(real).filter(k => !(k in AJENOS));
  ok('Datos del juego y de las otras copias intactos; la copia solo escribe «com1:»', Object.entries(AJENOS).every(([k, v]) => real[k] === v) && propias.length && propias.every(k => k.startsWith('com1:')), propias.join(', '));
  await c.close();
  // ---------- 7. iPad: «Vestir» a la vista ----------
  for (const [n, vp] of [['iPhone horizontal', { width: 844, height: 390 }], ['iPad vertical', { width: 820, height: 1180 }]]) {
    const { c: c2, p: p2 } = await nueva(vp); await p2.goto(COPIA); await p2.evaluate(() => { localStorage.clear(); go('dress'); }); await p2.waitForTimeout(1500);
    const m = await p2.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && !!document.querySelector('#avStage svg.av'));
    ok(`${n}: «Vestir» se ve sin desbordar`, m); await p2.screenshot({ path: path.join(OUT, `vestir-${n.replace(' ', '-').toLowerCase()}.png`) }); await c2.close();
  }
  ok('Muñeca: sin errores de JavaScript ni archivos que falten', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  // ---------- 8. Pintar, Heladería y logros: la prueba de la copia conjunta, apuntando a esta copia ----------
  let src = fs.readFileSync(path.join(RAIZ, 'docs/propuestas/prueba-conjunta-2026-10-22/prueba-conjunta.js'), 'utf8');
  const cambia = (a, z, n = 1) => { const k = src.split(a).length - 1; if (k !== n) throw new Error(`esperado ${n} y encontrado ${k}: ${a}`); src = src.split(a).join(z); };
  cambia("BASE + 'docs/propuestas/prueba-conjunta-2026-10-22/index.html'", "BASE + 'docs/propuestas/prueba-completa-2026-10-22/index.html'");
  cambia("leer('prueba-conjunta-2026-10-22/index.html')", "leer('prueba-completa-2026-10-22/index.html')");
  cambia("path.resolve(__dirname, '../../..')", JSON.stringify(RAIZ));
  cambia("'rec1:logros': '{\"v\":1,\"lista\":[]}' };", "'rec1:logros': '{\"v\":1,\"lista\":[]}', 'con1:stars': '6', 'd026:avatar': '{\"v\":1}' };");
  cambia("k.startsWith('con1:')", "k.startsWith('com1:')");
  cambia("la copia solo escribe «con1:»", "la copia solo escribe «com1:»");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-completa-pin-')), js = path.join(tmp, 'prueba-pintar-heladeria-logros.js');
  fs.writeFileSync(js, src);
  console.log('\n  — Pintar, Heladería y logros (prueba de la copia conjunta, sobre esta copia) —');
  const r = spawnSync('node', [js, BASE, path.join(OUT, 'pintar-heladeria-logros')], { encoding: 'utf8' });
  process.stdout.write(r.stdout.split('\n').filter(l => /✅|❌/.test(l) && !/comprobaciones correctas/.test(l)).map(l => l.replace(/^  /, '    ')).join('\n') + '\n');
  const fin = (r.stdout.match(/(\d+)\/(\d+) comprobaciones correctas/) || []);
  ok('Pintar, Heladería y logros: las comprobaciones de la prueba conjunta, todas correctas en esta copia', r.status === 0 && fin[1] === fin[2], fin[0] || (r.stderr || '').slice(0, 300));
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas (más ${fin[1] || '?'} de Pintar, Heladería y logros) · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
