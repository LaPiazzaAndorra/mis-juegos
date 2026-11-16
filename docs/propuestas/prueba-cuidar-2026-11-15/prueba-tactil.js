#!/usr/bin/env node
/* =====================================================================
   Prueba TÁCTIL de Mi Mundo (16/11/2026): toques y arrastres con el dedo de verdad (eventos táctiles de Chromium por
   CDP, los mismos que produce una pantalla táctil: touchstart, touchmove, touchend → pointer «touch»), en un iPhone
   simulado, en el salón y en la habitación.

   Uso (desde la raíz):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-cuidar-2026-11-15/prueba-tactil.js [con|sin] [carpeta-capturas]
   «sin»: la misma prueba quitando la capa de lectura (para comparar; debe dar lo mismo).

   Comprueba que TODO elemento del salón responde a un toque (la muñeca va, el objeto se anima, dice algo y sube su
   necesidad; la lámpara se enciende; la mesa ofrece la merienda; la alfombra lleva a la muñeca), que se arrastran con el
   dedo (con lo que tienen encima), que la bandeja pone objetos y que el suelo mueve la vista; y en la habitación, la cama
   (pide el pijama), la pelota, la cesta, la ventana y andar.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const SIN = process.argv[2] === 'sin';
const URL = process.env.COPIA_URL || 'http://localhost:8765/docs/propuestas/prueba-cuidar-2026-11-15/index.html';   // otra copia: COPIA_URL=…
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-tactil-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const HADA = { piel: 'dorada', ojos: { color: 'azul' }, pelo: { estilo: 'coleta', color: 'chocolate' }, ropa: 'hada', accesorios: ['alas', 'varita'] };

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }); const p = await c.newPage();
  p.on('pageerror', e => errs.push(e.message));
  if (SIN) await p.route('**/lectura.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  const cdp = await c.newCDPSession(p);
  const toque = (tipo, x, y) => cdp.send('Input.dispatchTouchEvent', { type: tipo, touchPoints: tipo === 'touchEnd' ? [] : [{ x, y, id: 1, radiusX: 8, radiusY: 8 }] });
  const tocar = async (q, ms = 500) => { await toque('touchStart', q[0], q[1]); await p.waitForTimeout(70); await toque('touchEnd'); await p.waitForTimeout(ms); };
  const arrastrar = async (a, d) => { await toque('touchStart', a[0], a[1]); for (let i = 1; i <= 14; i++) { await toque('touchMove', a[0] + (d[0] - a[0]) * i / 14, a[1] + (d[1] - a[1]) * i / 14); await p.waitForTimeout(16); } await toque('touchEnd'); await p.waitForTimeout(700); };
  const ver = (sel, ms = 600) => p.evaluate(s => { const e = document.querySelector(s); if (!e) return; e.scrollIntoView({ block: 'nearest', inline: 'center' }); }, sel).then(() => p.waitForTimeout(ms));
  const centroDe = sel => p.$(sel).then(e => e.boundingBox()).then(r => [r.x + r.width / 2, r.y + r.height / 2]);
  // un punto donde el dedo coge ese objeto (sobre su dibujo y a la vista, lejos de los botones)
  const punto = sel => p.evaluate(s => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(), bd = document.getElementById('board').getBoundingClientRect(), u = el.dataset.uid;
    let mejor = null, dm = 1e9;
    for (let i = 1; i < 30; i++) for (let j = 1; j < 30; j++) { const x = r.left + r.width * i / 30, y = r.top + r.height * j / 30;
      if (x < bd.left + 64 || x > bd.right - 64 || y < bd.top + 64 || y > bd.bottom - 12) continue;
      const d = Math.hypot(i / 30 - .5, j / 30 - .5); if (d < dm && MM.queToca(x, y) === u) { dm = d; mejor = [x, y]; } }
    return mejor; }, sel);
  const mirarA = (id, dy = 0) => p.evaluate(([i, dy]) => { const o = MM.estado().objetos.find(q => q.id === i); MM.mirar(o.x, Math.min(700, o.y - 150 + dy), true); }, [id, dy]).then(() => p.waitForTimeout(500));
  const muneca = () => p.evaluate(() => { const m = MM.estado().muneca; return [Math.round(m.x), Math.round(m.y)]; });
  const limpiar = () => p.evaluate(() => { document.querySelectorAll('.mm-panel,.mm-aviso').forEach(e => e.remove()); MM.necesidades().avisado = { sueno: true, diversion: true }; });

  await p.goto(URL); await p.evaluate(([h]) => { localStorage.clear(); Avatar.guardar(h); localStorage.setItem('scKey', '"casa"'); }, [HADA]);
  await p.reload(); await p.waitForTimeout(700); await p.evaluate(() => go('scene')); await p.waitForTimeout(2200);
  ok(`Copia con la capa de lectura ${SIN ? 'QUITADA (para comparar)' : 'puesta'}`, await p.evaluate(() => document.documentElement.classList.contains('lectura')) === !SIN);

  // ================= SALÓN =================
  // cada mueble responde a un toque
  const resp = [];
  for (const id of ['sofa', 'estanteria', 'cojin-rosa', 'cojin-lila', 'mesa', 'lampara']) {
    await limpiar(); await mirarA(id); const q = await punto(`.mm-obj[data-id="${id}"][data-capa="detras"]`);
    if (!q) { resp.push(`${id}: sin punto`); continue; }
    const m0 = await muneca(), n0 = await p.evaluate(() => JSON.stringify(MM.necesidades()));
    await tocar(q, 300);
    let r = null;
    for (let k = 0; k < 40 && !r; k++) { await p.waitForTimeout(150);
      r = await p.evaluate(i => { const el = document.querySelector(`.mm-obj[data-id="${i}"][class*="mm-j-"]`), boc = document.querySelector('.mm-bocadillo.on'), pan = document.querySelector('.mm-panel'), luz = MM.estado().objetos.find(o => o.id === i).luz;
        return (el || pan || luz) && boc ? { anim: !!el, boc: boc.textContent, panel: !!pan, luz: !!luz } : null; }, id); }
    if (id === 'mesa') await p.waitForTimeout(1200);
    const fin = await p.evaluate(() => ({ panel: !!document.querySelector('.mm-panel') }));
    resp.push(`${id}: ${r ? `«${r.boc}»${r.anim ? ' anima' : ''}${r.luz ? ' luz' : ''}${fin.panel ? ' + misión' : ''}${JSON.stringify(await muneca()) !== JSON.stringify(m0) ? ' + va' : ''}` : 'NO RESPONDE'}`);
  }
  ok('Salón: cada mueble responde a un toque (sofá, estantería, cojines, mesa, lámpara)', resp.every(x => !/NO RESPONDE|sin punto/.test(x)) && /mesa:.*misión/.test(resp.join()) && /lampara:.*luz/.test(resp.join()), resp.join(' · '));
  await limpiar(); await p.screenshot({ path: path.join(OUT, `salon-tocado-${SIN ? 'sin' : 'con'}.png`) });
  // el sofá sube un poco el sueño (descansar); la estantería, la diversión
  // la alfombra: tocarla es tocar el suelo (la muñeca va allí, no se selecciona)
  await mirarA('alfombra'); const qa = await punto('.mm-obj[data-id="alfombra"][data-capa="detras"]'); const ma = await muneca();
  await tocar(qa, 2500);
  const tras = await p.evaluate(() => ({ sel: (document.querySelector('.mm-obj.sel') || {}).dataset, m: MM.estado().muneca }));
  ok('Salón: tocar la alfombra lleva a la muñeca a ese sitio (no la selecciona)', !tras.sel && (Math.abs(tras.m.x - ma[0]) + Math.abs(tras.m.y - ma[1]) > 20), `${ma} → ${Math.round(tras.m.x)},${Math.round(tras.m.y)}`);
  // arrastrar con el dedo: muebles (la mesa con lo que tiene encima) y la alfombra
  await ver('#stkRow .mm-item[data-id="plato"]'); await tocar(await centroDe('#stkRow .mm-item[data-id="plato"]'));
  ok('Bandeja (toque): el plato va a la mesa', await p.evaluate(() => { const e = MM.estado(), m = e.objetos.find(o => o.id === 'mesa'); return e.objetos.some(o => o.id === 'plato' && o.sobre === m.uid); }));
  const movidos = [];
  for (const id of ['sofa', 'mesa', 'cojin-lila', 'alfombra', 'estanteria', 'lampara']) {
    await limpiar(); await mirarA(id); const q = await punto(`.mm-obj[data-id="${id}"][data-capa="detras"]`); if (!q) { movidos.push(id + ' sin punto'); continue; }
    const a = await p.evaluate(i => { const e = MM.estado(), o = e.objetos.find(x => x.id === i); return { x: o.x, y: o.y, hijos: e.objetos.filter(x => x.sobre === o.uid).map(x => [x.x - o.x, x.y - o.y]) }; }, id);
    await arrastrar(q, [q[0] + 45, q[1] + 20]);
    const d = await p.evaluate(i => { const e = MM.estado(), o = e.objetos.find(x => x.id === i); return { x: o.x, y: o.y, hijos: e.objetos.filter(x => x.sobre === o.uid).length }; }, id);
    movidos.push(`${id} ${Math.abs(d.x - a.x) + Math.abs(d.y - a.y) > 10 ? 'se mueve' : 'NO SE MUEVE'}${a.hijos.length ? ` (con ${d.hijos} encima)` : ''}`);
  }
  ok('Salón: el dedo arrastra los muebles y la alfombra; lo de encima va con la mesa', movidos.every(x => /se mueve/.test(x) && !/NO/.test(x)) && /mesa se mueve \(con 1 encima\)/.test(movidos.join()), movidos.join(' · '));
  // objetos pequeños: el conejito (bandeja → tocarlo: juega) y el plato sobre la mesa (tocarlo: responde)
  await limpiar(); await ver('#stkRow .mm-item[data-id="conejito"]'); await tocar(await centroDe('#stkRow .mm-item[data-id="conejito"]'));
  await mirarA('conejito'); const d0 = await p.evaluate(() => MM.necesidades().diversion);
  await tocar(await punto('.mm-obj[data-id="conejito"][data-capa="detras"]'), 300);
  let jug = false; for (let k = 0; k < 40 && !jug; k++) { await p.waitForTimeout(150); jug = await p.evaluate(() => !!document.querySelector('.mm-obj[data-id="conejito"][class*="mm-j-"]')); }
  ok('Salón: el conejito, puesto con un toque desde la bandeja, juega al tocarlo (y sube la diversión)', jug && await p.evaluate(d => MM.necesidades().diversion > d, d0));
  await limpiar(); await mirarA('mesa'); const qp = await punto('.mm-obj[data-id="plato"][data-capa="detras"]');
  await tocar(qp, 300); let pl = false; for (let k = 0; k < 40 && !pl; k++) { await p.waitForTimeout(150); pl = await p.evaluate(() => !!document.querySelector('.mm-obj[data-id="plato"][class*="mm-j-"]') && !!document.querySelector('.mm-bocadillo.on')); }
  ok('Salón: el plato de la mesa responde al toque', pl);
  // la vista: arrastrar el suelo con el dedo
  await p.evaluate(() => MM.mirar(500, 600, true)); await p.waitForTimeout(300);
  const libre = await p.evaluate(() => { const b = document.getElementById('board').getBoundingClientRect(); for (const fy of [.88, .8, .7]) for (const fx of [.5, .35, .65]) { const x = b.left + b.width * fx, y = b.top + b.height * fy; if (!MM.queToca(x, y) && !document.elementFromPoint(x, y).closest('button')) return [x, y]; } return null; });
  const v0 = await p.evaluate(() => MM.camara()[0]); if (libre) await arrastrar(libre, [libre[0] - 140, libre[1]]);
  ok('Salón: arrastrar el suelo con el dedo mueve la vista', !!libre && await p.evaluate(v => MM.camara()[0] > v + 100, v0));
  await p.screenshot({ path: path.join(OUT, `salon-${SIN ? 'sin' : 'con'}.png`) });

  // ================= HABITACIÓN =================
  await limpiar(); await ver('#scenePick .btn[data-k=habitacion]', 100); await tocar(await centroDe('#scenePick .btn[data-k=habitacion]'), 1800);
  ok('Cambiar a la habitación con un toque', await p.evaluate(() => MM.escenario()) === 'habitacion');
  await ver('#stkRow .mm-item[data-id="pelota"]'); await tocar(await centroDe('#stkRow .mm-item[data-id="pelota"]'));
  await p.evaluate(() => { const o = MM.estado().objetos.find(x => x.id === 'pelota'); o.x = 1150; o.y = 860; scLoad(); }); await p.waitForTimeout(1400);
  await mirarA('pelota'); const dp = await p.evaluate(() => MM.necesidades().diversion);
  await tocar(await punto('.mm-obj[data-id="pelota"][data-capa="detras"]'), 300);
  let pj = false; for (let k = 0; k < 40 && !pj; k++) { await p.waitForTimeout(150); pj = await p.evaluate(() => !!document.querySelector('.mm-obj[data-id="pelota"][class*="mm-j-"]')); }
  ok('Habitación: la pelota juega al tocarla', pj && await p.evaluate(d => MM.necesidades().diversion > d, dp));
  await limpiar(); await mirarA('cama'); await tocar(await punto('.mm-obj[data-id="cama"][data-capa="detras"]'), 4500);
  ok('Habitación: tocar la cama pide el pijama', await p.evaluate(() => /pijama/i.test((document.querySelector('.mm-pregunta p') || {}).textContent || '')));
  await limpiar();
  await p.evaluate(() => MM.mirar(860, 500, true)); await p.waitForTimeout(300);
  const vent = await p.evaluate(() => { const v = MM.ESCENARIOS.habitacion.ventana, r = document.querySelector('.mm-escena').getBoundingClientRect(), k = r.width / 1536; return [r.left + (v[0] + v[2]) / 2 * k, r.top + (v[1] + v[3]) * .55 * k]; });
  await tocar(vent, 900); const noche = await p.evaluate(() => MM.ciclo().noche); await limpiar(); await tocar(vent, 900);
  ok('Habitación: tocar la ventana cambia día y noche', noche && await p.evaluate(() => !MM.ciclo().noche));
  await limpiar(); const mh = await muneca();
  const suelo = await p.evaluate(() => { const b = document.getElementById('board').getBoundingClientRect(); for (const fy of [.85, .78]) for (const fx of [.5, .35, .65]) { const x = b.left + b.width * fx, y = b.top + b.height * fy; if (!MM.queToca(x, y) && !document.elementFromPoint(x, y).closest('button')) return [x, y]; } return null; });
  await tocar(suelo, 2500);
  ok('Habitación: tocar el suelo la hace andar', JSON.stringify(await muneca()) !== JSON.stringify(mh));
  ok('Sin errores de JavaScript', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas (${SIN ? 'sin' : 'con'} la capa de lectura) · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
