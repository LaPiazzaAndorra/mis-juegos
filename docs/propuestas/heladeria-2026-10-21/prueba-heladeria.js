#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia aislada de la Heladería (Chromium; iPhone y iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/heladeria-2026-10-21/prueba-heladeria.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · datos propios: con datos «del juego» y de las copias pin1/d026 sembrados antes, la copia no los ve, no los cambia
       y solo escribe con «hel1:» / «hel1-»; sin service worker;
     · entrada con dos modos y cambio de modo dentro de la heladería;
     · en iPhone vertical y horizontal y en iPad vertical y horizontal, en los dos modos: todos los botones a la vista, de
       44 px o más, sin solaparse ni desplazar, y el helado entero dentro del mostrador (también con 4 bolas y 3 adornos);
     · pedidos, nivel a nivel (1–6), tocando los botones: el pedido es del tipo del nivel; acierto = +1 ⭐, monedas = bolas
       + adorno, iceServed + 1 (la economía de hoy); sube de nivel tras 3 aciertos; fallar no quita nada ni baja de nivel
       y da una pista concreta; el pedido no cambia a mitad de preparación; memoria: el pedido se tapa, «👀» lo enseña
       otra vez y al fallar se vuelve a ver;
     · juego libre: sin estrellas, monedas ni pedidos servidos; hasta 4 bolas y 3 adornos; «quitar la última» deshace el
       último cambio (también «empezar de nuevo»); «¡A probar!»; foto en «Mis dibujos»; sin espacio no se borra nada;
     · sin errores de JavaScript.
   Las capturas se guardan FUERA del repositorio.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/heladeria-2026-10-21/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-heladeria-'));
const AJENOS = { stars: '37', iceCoins: '5', iceServed: '9', lv_contar: '2', gal: JSON.stringify(['data:image/png;base64,iVBORw0KGgo=']),
  'pin1:stars': '3', 'pin1:gal': '[]', 'd026:stars': '4' };
const DEV = { 'iPhone vertical': [390, 844, true], 'iPhone horizontal': [844, 390, true], 'iPad vertical': [820, 1180, false], 'iPad horizontal': [1180, 820, false] };
const res = []; const ok = (n, c, x = '') => { res.push([!!c, n]); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const errores = [];

async function pagina(b, [w, h, mov], limpiar = true) {
  const c = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: mov, deviceScaleFactor: 2 });
  const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
  await p.goto(COPIA); if (limpiar) { await p.evaluate(() => localStorage.clear()); await p.reload(); } await p.waitForTimeout(300);
  return { c, p };
}
const estado = p => p.evaluate(() => ({ stars: +localStorage.getItem('stars') || 0, coins: +localStorage.getItem('iceCoins') || 0,
  served: +localStorage.getItem('iceServed') || 0, nv: JSON.parse(localStorage.getItem('lv_heladeria') || 'null'),
  gal: JSON.parse(localStorage.getItem('gal') || '[]').length }));
// prepara el helado tocando los botones: base, bolas y adorno
async function preparar(p, o) {
  await p.click('#iceReset');
  await p.click(`#iceBases .btn[data-k="${o.base}"]`);
  for (const f of o.scoops) await p.locator('#iceFlavs .fl').nth(f).click();
  for (const t of o.tops) await p.click(`#iceTops .btn[data-i="${t}"]`);
}
const dice = p => p.evaluate(() => window.__dicho || '');

(async () => {
  const b = await pw.chromium.launch();
  // ---------- 1. datos propios ----------
  {
    const { c, p } = await pagina(b, DEV['iPhone vertical'], false);
    await p.goto(BASE + 'index.html?arte=svg'); await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
    await p.goto(COPIA); await p.waitForTimeout(400);
    const v = await p.evaluate(() => ({ s: localStorage.getItem('stars'), c: localStorage.getItem('iceCoins'), sc: document.querySelector('.sc').textContent, pr: window.PRUEBA_HELADERIA }));
    ok('La copia no ve los datos del juego ni de otras copias', v.s === null && v.c === null && v.sc === '0');
    const sw = await p.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).some(r => r.scope.includes('heladeria')));
    ok('Aislamiento activo (hel1: / hel1-) y sin service worker', v.pr && v.pr.prefijo === 'hel1:' && !sw);
    await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(500);
    const o = await p.evaluate(() => ICE.order); await preparar(p, o); await p.click('#iceGive'); await p.waitForTimeout(300);
    await p.evaluate(() => go('ice', 'libre')); await p.waitForTimeout(400); await p.locator('#iceFlavs .fl').nth(0).click(); await p.click('#icePhoto');
    await p.goto(BASE + 'index.html?arte=svg');
    const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
    ok('Datos del juego y de las otras copias intactos', Object.entries(AJENOS).every(([k, v]) => real[k] === v));
    const nuevas = Object.keys(real).filter(k => !(k in AJENOS));
    ok('Todo lo que escribe la copia lleva «hel1:»', nuevas.length && nuevas.every(k => k.startsWith('hel1:')), nuevas.join(', '));
    await c.close();
  }
  // ---------- 2. entrada y pantallas ----------
  for (const [n, d] of Object.entries(DEV)) {
    const { c, p } = await pagina(b, d);
    if (n === 'iPhone vertical') {
      await p.evaluate(() => go('m-role')); await p.waitForTimeout(300); await p.click('#m-role [data-go="m-ice"]'); await p.waitForTimeout(400);
      const bt = await p.evaluate(() => [...document.querySelectorAll('#m-ice [data-go="ice"]')].map(x => x.dataset.arg).join());
      await p.click('#m-ice [data-arg="libre"]'); await p.waitForTimeout(400);
      const m1 = await p.evaluate(() => ICE.mode); await p.click('#ice .imode[data-m="pedidos"]'); await p.waitForTimeout(300);
      ok('Entrada con «Inventar helados» y «Atender pedidos»; se cambia de modo dentro', bt === 'libre,pedidos' && m1 === 'libre' && await p.evaluate(() => ICE.mode === 'pedidos' && !!ICE.order));
    }
    for (const modo of ['pedidos', 'libre']) {
      await p.evaluate(m => go('ice', m), modo); await p.waitForTimeout(500);
      await p.click('#iceBases .btn[data-k="cono"]');
      for (const f of [0, 1, 3, 4]) await p.locator('#iceFlavs .fl').nth(f).click();
      for (const t of modo === 'libre' ? [0, 2, 3] : [0]) await p.click(`#iceTops .btn[data-i="${t}"]`);
      await p.waitForTimeout(300);
      const m = await p.evaluate(() => {
        const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.top >= 0 && r.right <= innerWidth + .5 && r.bottom <= innerHeight + .5; };
        const ctl = [...document.querySelectorAll('#ice .btn, #ice .fl')].filter(e => e.offsetParent); const R = ctl.map(e => e.getBoundingClientRect());
        let sol = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) sol++; }
        const w = document.querySelector('#iceWrap').getBoundingClientRect(), t = document.querySelector('#iceBuild .itop').getBoundingClientRect(), h = document.querySelector('#iceBuild .ice').getBoundingClientRect();
        const bub = document.querySelector('#iceOrder').getBoundingClientRect();
        return { n: ctl.length, vis: ctl.filter(vis).length, min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))), sol,
          dentro: t.top >= w.top - 1 && h.bottom <= w.bottom + 1 && h.left >= w.left - 1 && h.right <= w.right + 1, bolas: ICE.build.scoops.length, adornos: ICE.build.tops.length,
          scroll: document.documentElement.scrollHeight > innerHeight + 1 || document.documentElement.scrollWidth > innerWidth + 1, pedido: [Math.round(bub.width), Math.round(bub.height)], pedidoVis: vis(document.querySelector('#iceOrder')) };
      });
      ok(`${n} · ${modo}: los ${m.n} botones a la vista, sin solaparse ni desplazar`, m.n === 20 && m.vis === m.n && !m.sol && !m.scroll && m.pedidoVis, `pedido ${m.pedido.join(' × ')}`);
      ok(`${n} · ${modo}: botones de 44 px o más`, m.min >= 44, `mín. ${m.min} px`);
      ok(`${n} · ${modo}: el helado (${m.bolas} bolas, ${m.adornos} adornos) se ve entero en el mostrador`, m.dentro && m.bolas === 4);
      await p.screenshot({ path: path.join(OUT, `heladeria-${modo}-${n.replace(' ', '-').toLowerCase()}.png`) });
    }
    await c.close();
  }
  // ---------- 3. pedidos nivel a nivel ----------
  {
    const { c, p } = await pagina(b, DEV['iPhone vertical']);
    await p.evaluate(() => { const s = window.say; window.say = (t, f) => { window.__dicho = t; return s(t, f); }; });
    const TIPOS = { 0: ['color'], 1: ['cantidad'], 2: ['cantidad'], 3: ['mezcla'], 4: ['memoria'], 5: ['color', 'cantidad', 'mezcla', 'memoria'] };
    let tiposOk = true, ecoOk = true, subeOk = true, detalle = [];
    await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(500);
    for (let L = 0; L < 6; L++) {
      for (let k = 0; k < 3; k++) {
        await p.waitForFunction(() => ICE.order && !ICE.busy);
        const o = await p.evaluate(() => ICE.order), nv0 = await p.evaluate(() => ICE.nv);
        if (nv0.L !== L) { subeOk = false; detalle.push(`nivel ${nv0.L} en vez de ${L}`); }
        if (!TIPOS[L].includes(o.t)) { tiposOk = false; detalle.push(`L${L + 1}: ${o.t}`); }
        if (o.t === 'color' && o.scoops.length !== 1) tiposOk = false;
        if (o.t === 'cantidad' && (new Set(o.scoops).size !== 1 || (L === 1 && o.scoops.length > 2) || (L === 2 && o.scoops.length < 2) || o.scoops.length > 3)) tiposOk = false;
        if (o.t === 'mezcla' && (new Set(o.scoops).size !== 2 || o.scoops.length !== 3)) tiposOk = false;
        const e0 = await estado(p);
        await preparar(p, o); await p.click('#iceGive'); await p.waitForTimeout(200);
        const e1 = await estado(p);
        if (e1.stars !== e0.stars + 1 || e1.coins !== e0.coins + o.scoops.length + (o.tops.length ? 1 : 0) || e1.served !== e0.served + 1) { ecoOk = false; detalle.push(JSON.stringify([o, e0, e1])); }
        await p.evaluate(() => { if (ICE.mode === 'pedidos') iceNew(); });   // sin esperar los 2,4 s
      }
    }
    ok('Cada nivel pide su tipo de reto (colores → contar → dos sabores → memoria → de todo)', tiposOk, detalle.filter(x => x.startsWith('L')).join(' '));
    ok('Acierto = +1 ⭐, monedas = bolas + adorno y iceServed + 1 (la economía de hoy)', ecoOk, detalle.filter(x => x.startsWith('[')).slice(0, 1).join(''));
    ok('Sube de nivel tras 3 aciertos, hasta el 6, y se guarda en «lv_heladeria»', subeOk && (await estado(p)).nv.L === 5);
    // fallos: no quitan nada ni bajan de nivel; pista concreta
    await p.evaluate(() => { localStorage.setItem('lv_heladeria', JSON.stringify({ L: 2, ok: 2 })); go('m-ice'); });
    await p.waitForTimeout(200); await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(500);
    let o = await p.evaluate(() => ICE.order); const e0 = await estado(p);
    await preparar(p, { base: o.base, scoops: o.scoops.slice(0, -1).concat(o.scoops.length === 1 ? [o.scoops[0], o.scoops[0]] : []), tops: o.tops });
    await p.click('#iceGive'); await p.waitForTimeout(200);
    const pista1 = await dice(p), e1 = await estado(p);
    ok('Fallar no quita estrellas ni monedas ni baja de nivel', e1.stars === e0.stars && e1.coins === e0.coins && e1.served === e0.served && e1.nv.L === 2 && e1.nv.ok === 2);
    ok('Pista de cantidad: «Tienes … y yo quiero … ¡Cuéntalas!»', /Tienes .* y yo quiero .*Cuéntalas/.test(pista1), pista1);
    await preparar(p, { base: o.base === 'cono' ? 'vaso' : 'cono', scoops: o.scoops, tops: o.tops }); await p.click('#iceGive'); await p.waitForTimeout(150);
    ok('Pista de base: «Yo quería un …»', /Yo quería un (cucurucho|vasito)/.test(await dice(p)), await dice(p));
    await preparar(p, o); await p.click('#iceGive'); await p.waitForTimeout(200);
    ok('Después de fallar se puede reintentar y acertar', (await estado(p)).stars === e0.stars + 1);
    // tras un acierto, salir y volver enseguida: el pedido nuevo no se cambia a mitad de preparación
    await p.evaluate(() => { localStorage.setItem('lv_heladeria', JSON.stringify({ L: 1, ok: 0 })); go('m-ice'); });
    await p.waitForTimeout(150); await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(400);
    o = await p.evaluate(() => ICE.order); await preparar(p, o); await p.click('#iceGive'); await p.waitForTimeout(150);
    await p.click('#ice .imode[data-m="libre"]'); await p.click('#ice .imode[data-m="pedidos"]'); await p.waitForTimeout(150);
    const nuevo = await p.evaluate(() => JSON.stringify(ICE.order)); await p.waitForTimeout(2700);
    ok('Tras un acierto, cambiar de modo y volver no hace que el pedido cambie a mitad de preparación', await p.evaluate(() => JSON.stringify(ICE.order)) === nuevo);
    // memoria
    await p.evaluate(() => { localStorage.setItem('lv_heladeria', JSON.stringify({ L: 4, ok: 0 })); go('m-ice'); });
    await p.waitForTimeout(200); await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(400);
    o = await p.evaluate(() => ICE.order);
    const visto = await p.evaluate(() => !document.querySelector('#iceOrder').classList.contains('cover'));
    await p.waitForTimeout(5600);
    const tapado = await p.evaluate(() => document.querySelector('#iceOrder').classList.contains('cover'));
    await p.click('#iceLook'); await p.waitForTimeout(150);
    const otraVez = await p.evaluate(() => !document.querySelector('#iceOrder').classList.contains('cover'));
    await p.waitForTimeout(3300);
    const retapa = await p.evaluate(() => document.querySelector('#iceOrder').classList.contains('cover'));
    ok('Memoria: el pedido se ve, se tapa, «👀» lo enseña otra vez y se vuelve a tapar', o.t === 'memoria' && visto && tapado && otraVez && retapa);
    await preparar(p, { base: o.base, scoops: [(o.scoops[0] + 1) % 6].concat(o.scoops.slice(1)), tops: o.tops }); await p.click('#iceGive'); await p.waitForTimeout(150);
    ok('Memoria: al fallar se vuelve a ver el pedido como pista', await p.evaluate(() => !document.querySelector('#iceOrder').classList.contains('cover')));
    await p.screenshot({ path: path.join(OUT, 'heladeria-memoria-pista.png') });
    await c.close();
  }
  // ---------- 4. juego libre ----------
  {
    const { c, p } = await pagina(b, DEV['iPad vertical']);
    await p.evaluate(() => { localStorage.setItem('stars', '10'); localStorage.setItem('iceCoins', '4'); localStorage.setItem('iceServed', '2'); });
    await p.reload(); await p.waitForTimeout(300); await p.evaluate(() => go('ice', 'libre')); await p.waitForTimeout(400);
    const e0 = await estado(p);
    await p.click('#iceBases .btn[data-k="vaso"]'); for (const f of [0, 1, 2, 3, 4]) await p.locator('#iceFlavs .fl').nth(f).click();
    for (const t of [0, 1, 2, 3]) await p.click(`#iceTops .btn[data-i="${t}"]`);
    const b1 = await p.evaluate(() => ICE.build);
    ok('Libre: hasta 4 bolas y 3 adornos', b1.scoops.length === 4 && b1.tops.length === 3);
    await p.click('#iceUndo'); const b2 = await p.evaluate(() => ICE.build);
    ok('«Quitar la última» deshace el último cambio (el último adorno)', b2.tops.length === 2 && b2.scoops.length === 4);
    await p.click('#iceReset'); await p.click('#iceUndo'); const b3 = await p.evaluate(() => ICE.build);
    ok('«Empezar de nuevo» también se puede deshacer', b3.scoops.length === 4 && b3.tops.length === 2 && b3.base === 'vaso');
    await p.click('#iceTaste'); await p.click('#icePhoto'); await p.waitForTimeout(300);
    const e1 = await estado(p);
    ok('Libre: no da estrellas, monedas ni pedidos servidos', e1.stars === e0.stars && e1.coins === e0.coins && e1.served === e0.served);
    ok('Libre: la foto se guarda en «Mis dibujos»', e1.gal === e0.gal + 1);
    const lleno = await p.evaluate(() => { let i = 0; for (const t of [262144, 16384, 1024, 64]) { const s = 'x'.repeat(t); try { for (; i < 2000; i++) localStorage.setItem('relleno' + i, s); } catch (e) {} } return i; });
    const g0 = await p.evaluate(() => localStorage.getItem('gal'));
    await p.click('#icePhoto'); await p.waitForTimeout(200);
    ok('Sin espacio: la foto no borra dibujos antiguos y se avisa', lleno > 0 && await p.evaluate(() => localStorage.getItem('gal')) === g0 && /No cabe/.test(await p.evaluate(() => document.querySelector('#toast').textContent)));
    await p.evaluate(() => { for (let i = 0; i < 2000; i++) localStorage.removeItem('relleno' + i); });
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  const bien = res.filter(r => r[0]).length;
  console.log(`\n${bien === res.length ? '✅' : '❌'} ${bien}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(bien === res.length ? 0 : 1);
})();
