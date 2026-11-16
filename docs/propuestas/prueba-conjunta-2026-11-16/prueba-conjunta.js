#!/usr/bin/env node
/* =====================================================================
   Prueba de la COPIA CONJUNTA (16/11/2026): juegos de Pensar + Mi Mundo + norma de lectura, juntos, con toques de
   dedo de verdad (eventos táctiles de Chromium por CDP) en un iPhone simulado.

   Uso (desde la raíz):  python3 -m http.server 8765 &   node docs/propuestas/prueba-conjunta-2026-11-16/prueba-conjunta.js

   Comprueba: la capa común de lectura se carga UNA sola vez, antes que los juegos, y los ajustes propios de Pensar
   (lectura-pensar.*) al final; Contar (tocar la respuesta: +1 ⭐) y Parejas (tocar una carta) con el dedo; el salón de Mi
   Mundo (tocar el sofá: responde; arrastrar la mesa: se mueve con lo que tiene encima) y la habitación (tocar la cama: pide
   el pijama); MAYÚSCULAS en los dos lados; sin errores.
   El resto, con sus propias pruebas apuntando a esta copia: lectura-2026-11-17/prueba-lectura.js (URL de esta copia),
   prueba-cuidar-2026-11-15/prueba-tactil.js y prueba-webkit.js (COPIA_URL=…), y las de Pensar y Mi Mundo (ver LEEME.md).
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const URL = 'http://localhost:8765/docs/propuestas/prueba-conjunta-2026-11-16/index.html';
const OUT = process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-conjunta-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const HADA = { piel: 'dorada', ojos: { color: 'azul' }, pelo: { estilo: 'coleta', color: 'chocolate' }, ropa: 'hada', accesorios: ['alas', 'varita'] };

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }); const p = await c.newPage();
  p.on('pageerror', e => errs.push(e.message));
  const cdp = await c.newCDPSession(p);
  const toque = (tipo, x, y) => cdp.send('Input.dispatchTouchEvent', { type: tipo, touchPoints: tipo === 'touchEnd' ? [] : [{ x, y, id: 1, radiusX: 8, radiusY: 8 }] });
  const tocar = async (q, ms = 500) => { await toque('touchStart', q[0], q[1]); await p.waitForTimeout(70); await toque('touchEnd'); await p.waitForTimeout(ms); };
  const arrastrar = async (a, d) => { await toque('touchStart', a[0], a[1]); for (let i = 1; i <= 14; i++) { await toque('touchMove', a[0] + (d[0] - a[0]) * i / 14, a[1] + (d[1] - a[1]) * i / 14); await p.waitForTimeout(16); } await toque('touchEnd'); await p.waitForTimeout(700); };
  const centro = sel => p.$(sel).then(e => e.boundingBox()).then(r => [r.x + r.width / 2, r.y + r.height / 2]);
  const punto = sel => p.evaluate(s => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(), bd = document.getElementById('board').getBoundingClientRect(), u = el.dataset.uid;
    let m = null, dm = 1e9; for (let i = 1; i < 30; i++) for (let j = 1; j < 30; j++) { const x = r.left + r.width * i / 30, y = r.top + r.height * j / 30;
      if (x < bd.left + 64 || x > bd.right - 64 || y < bd.top + 64 || y > bd.bottom - 12) continue; const d = Math.hypot(i / 30 - .5, j / 30 - .5); if (d < dm && MM.queToca(x, y) === u) { dm = d; m = [x, y]; } } return m; }, sel);

  await p.goto(URL); await p.evaluate(h => { localStorage.clear(); Avatar.guardar(h); localStorage.setItem('scKey', '"casa"'); }, HADA); await p.reload(); await p.waitForTimeout(900);
  // ---------- carga ----------
  const carga = await p.evaluate(() => { const s = [...document.querySelectorAll('script[src],link[rel=stylesheet]')].map(e => e.getAttribute('src') || e.getAttribute('href'));
    const i = f => s.findIndex(x => x.endsWith(f)); return { comun: s.filter(x => /lectura-2026-11-17\/lectura\.js$/.test(x)).length, comunCss: s.filter(x => /lectura-2026-11-17\/lectura\.css$/.test(x)).length,
      orden: i('logros.js') < i('lectura-2026-11-17/lectura.js') && i('lectura-2026-11-17/lectura.js') < i('pensar.js') && i('retos.js') < i('lectura-pensar.js') && i('mimundo/mimundo.js') < i('lectura-pensar.js'),
      pensar: !!window.PENSAR, mm: !!window.MM, lectura: document.documentElement.classList.contains('lectura'), propio: !!window.LecturaPensar, aislado: !!window.PRUEBA_CONJUNTA }; });
  ok('Una sola capa común (antes de los juegos) y los ajustes de Pensar al final; Pensar y Mi Mundo cargados; datos propios', carga.comun === 1 && carga.comunCss === 1 && carga.orden && carga.pensar && carga.mm && carga.lectura && carga.propio && carga.aislado, JSON.stringify(carga));
  // ---------- Pensar con el dedo ----------
  await p.evaluate(() => go('m-think')); await p.waitForTimeout(800);
  ok('Menú de Pensar en MAYÚSCULAS', await p.evaluate(() => { const t = [...document.querySelectorAll('#m-think .big')].map(b => b.innerText).join(' '); return /CONTAR/.test(t) && /MEMORIA/.test(t) && !/[a-zñ]/.test(t); }));
  await tocar(await centro('#m-think .big[data-go="contar"]'), 1000);
  if (await p.isVisible('#contar .pnNo')) { await tocar(await centro('#contar .pnNo'), 700); }
  await p.waitForFunction(() => PENSAR.ct.item && !PENSAR.ct.ocupado && document.querySelectorAll('#ctOpts .pnOpt').length >= 3, null, { timeout: 15000 });
  const s0 = await p.evaluate(() => stars), resp = await p.evaluate(() => String(PENSAR.ct.item.resp));
  const opt = await p.evaluate(r => { const o = [...document.querySelectorAll('#ctOpts .pnOpt')].find(b => b.textContent.trim() === r); const q = o.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; }, resp);
  await tocar(opt, 1500);
  ok('Contar con el dedo: tocar la respuesta correcta suma +1 ⭐ (las respuestas no cambian)', await p.evaluate(() => stars) === s0 + 1, `respuesta ${resp}`);
  await p.screenshot({ path: path.join(OUT, '1-contar.png') });
  await p.evaluate(() => go('parejas')); await p.waitForTimeout(1300);
  const antes = await p.evaluate(() => document.querySelector('#pjGrid .pnCard').className);
  await tocar(await centro('#pjGrid .pnCard'), 600);
  ok('Parejas con el dedo: la carta tocada se da la vuelta', await p.evaluate(a => document.querySelector('#pjGrid .pnCard').className !== a, antes));
  // ---------- Mi Mundo con el dedo ----------
  await p.evaluate(() => go('scene')); await p.waitForTimeout(2000);
  ok('Mi Mundo: el salón (🏠), con textos en MAYÚSCULAS', await p.evaluate(() => MM.escenario() === 'salon' && getComputedStyle(document.querySelector('#stkRow .mm-item span')).textTransform === 'uppercase'));
  await p.evaluate(() => { const o = MM.estado().objetos.find(q => q.id === 'sofa'); MM.mirar(o.x, 500, true); }); await p.waitForTimeout(500);
  await tocar(await punto('.mm-obj[data-id="sofa"][data-capa="detras"]'), 300);
  let r = null; for (let k = 0; k < 40 && !r; k++) { await p.waitForTimeout(150); r = await p.evaluate(() => document.querySelector('.mm-obj[data-id="sofa"][class*="mm-j-"]') && (document.querySelector('.mm-bocadillo.on') || {}).textContent); }
  ok('Salón: tocar el sofá → responde', !!r, r || 'nada');
  await p.evaluate(() => { const t = document.querySelector('#stkRow .mm-item[data-id="plato"]'); t.scrollIntoView({ inline: 'center' }); }); await p.waitForTimeout(500);
  await tocar(await centro('#stkRow .mm-item[data-id="plato"]'));
  await p.evaluate(() => { const o = MM.estado().objetos.find(q => q.id === 'mesa'); MM.mirar(o.x, 600, true); document.querySelectorAll('.mm-panel').forEach(e => e.remove()); }); await p.waitForTimeout(500);
  const m0 = await p.evaluate(() => { const e = MM.estado(), m = e.objetos.find(o => o.id === 'mesa'); return [m.x, e.objetos.filter(o => o.sobre === m.uid).length]; });
  const q = await p.evaluate(() => { const el = document.querySelector('.mm-obj[data-id="mesa"][data-capa="detras"]'), r = el.getBoundingClientRect(), u = el.dataset.uid; for (const fy of [.85, .75, .65]) for (const fx of [.3, .7, .5, .2, .8]) { const x = r.left + r.width * fx, y = r.top + r.height * fy; if (MM.queToca(x, y) === u) return [x, y]; } return null; });
  await arrastrar(q, [q[0] + 60, q[1] + 10]);
  const m1 = await p.evaluate(() => { const e = MM.estado(), m = e.objetos.find(o => o.id === 'mesa'); return [m.x, e.objetos.filter(o => o.sobre === m.uid).length]; });
  ok('Salón: arrastrar la mesa con el dedo la mueve con lo que tiene encima', m1[0] !== m0[0] && m1[1] === m0[1] && m0[1] >= 1, `${Math.round(m0[0])} → ${Math.round(m1[0])}, ${m1[1]} encima`);
  await p.screenshot({ path: path.join(OUT, '2-salon.png') });
  await p.evaluate(() => document.querySelectorAll('.mm-panel').forEach(e => e.remove()));
  await tocar(await centro('#scenePick .btn[data-k=habitacion]'), 1800);
  await p.evaluate(() => { const o = MM.estado().objetos.find(q => q.id === 'cama'); MM.mirar(o.x, 600, true); }); await p.waitForTimeout(500);
  await tocar(await punto('.mm-obj[data-id="cama"][data-capa="detras"]'), 4500);
  ok('Habitación: tocar la cama → «PONME EL PIJAMA»', await p.evaluate(() => ((document.querySelector('.mm-pregunta p') || {}).innerText || '') === 'PONME EL PIJAMA'));
  await p.screenshot({ path: path.join(OUT, '3-habitacion.png') });
  ok('Sin errores de JavaScript', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
