#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia aislada de Pintar (Chromium; iPhone y iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/pintar-2026-10-21/prueba-pintar.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · datos propios: con datos «del juego» y de las copias d016/d021/d023/d026 sembrados antes, la copia no los ve,
       no los cambia y solo escribe con «pin1:» / «pin1-»; sin service worker;
     · en iPhone vertical y horizontal y en iPad vertical y horizontal: todas las herramientas, los 15 colores y los
       3 grosores a la vista (sin desplazar), botones de 44 px o más y sin solaparse;
     · deshacer y rehacer (más de 6 pasos; un trazo nuevo borra lo que se podía rehacer);
     · girar: el dibujo se conserva tal cual y deshacer sigue funcionando;
     · el cubo sin efecto no gasta un paso de deshacer;
     · 🗑️ necesita dos toques y se puede deshacer;
     · guardar: una entrada por dibujo, actualizar sin duplicar, salir sin duplicar, editar desde la galería crea copia
       nueva sin tocar el original, y sin espacio no se borra ningún dibujo;
     · las láminas para colorear siguen funcionando (cubo dentro de una zona);
     · láminas nuevas (heladería, gatito, hada, unicornio, perrito, conejito, princesa, helado, mariposa, osito explorador, hada jardinera, sirena), en las cuatro pantallas: primeras de la lista y las 19 anteriores
       conservadas; enteras y sin deformar; el cubo no atraviesa el contorno (cada zona grande, una a una); las zonas
       diminutas se pintan con su zona o en grupo;
     · recorrido real tocando la miniatura (con decode() de Safari simulado «sin respuesta»): abre, dibuja y pinta; si la
       imagen no carga, aviso y vuelta a la lista; si tarda, aviso «Abriendo la lámina…»; con el lienzo bloqueado, aviso al
       pintar; tocar sobre una línea pinta la zona más cercana; sin errores de JavaScript.
   Las capturas se guardan FUERA del repositorio.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/pintar-2026-10-21/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-pintar-'));
const AJENOS = { stars: '37', gal: JSON.stringify(['data:image/png;base64,iVBORw0KGgo=']), iceCoins: '5', lv_contar: '2',
  'd016:stars': '12', 'd021:stars': '8', 'd023:stars': '9', 'd026:stars': '4', 'd026:gal': '[]' };
const res = []; const ok = (n, c, x = '') => { res.push([!!c, n]); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const DEV = { 'iPhone vertical': [390, 844, true], 'iPhone horizontal': [844, 390, true], 'iPad vertical': [820, 1180, false], 'iPad horizontal': [1180, 820, false] };

async function trazo(p, y, x0 = .15, x1 = .85) {
  const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
  await p.mouse.move(r.x + r.width * x0, r.y + r.height * y); await p.mouse.down();
  await p.mouse.move(r.x + r.width * x1, r.y + r.height * y, { steps: 10 }); await p.mouse.up();
}
const huella = p => p.evaluate(() => { const d = document.querySelector('#pc').getContext('2d').getImageData(0, 0, pc.width, pc.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0; return h; });
const blanca = p => p.evaluate(() => { const d = document.querySelector('#pc').getContext('2d').getImageData(0, 0, pc.width, pc.height).data; for (let i = 0; i < d.length; i += 4) if (d[i] < 250 || d[i + 1] < 250 || d[i + 2] < 250) return false; return true; });
const gal = p => p.evaluate(() => JSON.parse(localStorage.getItem('gal') || '[]'));

(async () => {
  const b = await pw.chromium.launch(); const errores = [];
  // ---------- 1. datos propios ----------
  {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
    await p.goto(BASE + 'index.html?arte=svg'); await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
    await p.goto(COPIA); await p.waitForTimeout(500);
    const vista = await p.evaluate(() => ({ stars: localStorage.getItem('stars'), gal: localStorage.getItem('gal'), sc: document.querySelector('.sc').textContent, pr: window.PRUEBA_PINTAR }));
    vista.sw = await p.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).some(r => r.scope.includes('pintar-2026-10-21')));
    ok('La copia no ve los datos del juego ni de las otras copias', vista.stars === null && vista.gal === null && vista.sc === '0');
    ok('Aislamiento activo (pin1: / pin1-) y la copia no registra service worker', vista.pr && vista.pr.prefijo === 'pin1:' && !vista.sw);
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(400); await trazo(p, .5);
    await p.click('#saveBtn'); await p.waitForTimeout(300);
    await p.goto(BASE + 'index.html?arte=svg');
    const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
    const intactos = Object.entries(AJENOS).every(([k, v]) => real[k] === v);
    const nuevas = Object.keys(real).filter(k => !(k in AJENOS));
    ok('Datos del juego y de las otras copias intactos', intactos);
    ok('Todo lo que escribe la copia lleva «pin1:»', nuevas.length > 0 && nuevas.every(k => k.startsWith('pin1:')), nuevas.join(', '));
    const bds = await p.evaluate(async () => (indexedDB.databases ? (await indexedDB.databases()).map(d => d.name) : []));
    ok('IndexedDB: la copia abre su propia base (pin1-misjuegos)', bds.includes('pin1-misjuegos'), bds.join(', ') || '(sin bases)');
    await c.close();
  }
  // ---------- 2. todo a la vista en cada pantalla ----------
  for (const [n, [w, h, mov]] of Object.entries(DEV)) {
    const c = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: mov, deviceScaleFactor: 2 });
    const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
    await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(500);
    const m = await p.evaluate(() => {
      const els = [...document.querySelectorAll('#paint .ptop .btn, #sizes .sz, #colors .sw')];
      const R = els.map(e => e.getBoundingClientRect());
      const dentro = R.every(r => r.left >= 0 && r.top >= 0 && r.right <= innerWidth + .5 && r.bottom <= innerHeight + .5 && r.width > 0);
      const min = Math.min(...R.map(r => Math.min(r.width, r.height)));
      let solapan = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) solapan++; }
      const cv = document.querySelector('#cv').getBoundingClientRect();
      const tapa = R.some(r => r.left < cv.right - 1 && cv.left < r.right - 1 && r.top < cv.bottom - 1 && cv.top < r.bottom - 1);
      return { n: els.length, dentro, min: Math.round(min), solapan, tapa, cv: [Math.round(cv.width), Math.round(cv.height)], scroll: document.documentElement.scrollWidth > innerWidth };
    });
    ok(`${n}: las ${m.n} herramientas, grosores y colores a la vista, sin solaparse ni tapar el papel`, m.n === 28 && m.dentro && !m.solapan && !m.tapa && !m.scroll, `mín. ${m.min} px · papel ${m.cv.join(' × ')}`);
    ok(`${n}: botones de 44 px o más`, m.min >= 44);
    await p.screenshot({ path: path.join(OUT, `despues-${n.replace(' ', '-').toLowerCase()}.png`) });
    await c.close();
  }
  // ---------- 3. deshacer / rehacer, girar, cubo, borrar ----------
  {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
    await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(500);
    const h = [await huella(p)];
    for (let i = 0; i < 9; i++) { await trazo(p, .1 + i * .09); h.push(await huella(p)); }
    let bien = true; for (let i = 8; i >= 0; i--) { await p.click('#undoBtn'); if (await huella(p) !== h[i]) bien = false; }
    ok('Deshacer 9 pasos seguidos (antes solo 6) vuelve exactamente a cada estado', bien);
    bien = true; for (let i = 1; i <= 9; i++) { await p.click('#redoBtn'); if (await huella(p) !== h[i]) bien = false; }
    ok('Rehacer recupera cada paso deshecho', bien);
    await p.click('#undoBtn'); await p.click('#undoBtn'); await trazo(p, .95);
    const st = await p.evaluate(() => ({ r: P.redo.length, off: document.querySelector('#redoBtn').classList.contains('off') }));
    ok('Un trazo nuevo vacía «rehacer» y el botón se ve apagado', st.r === 0 && st.off);
    const antes = await huella(p), nu = await p.evaluate(() => P.undo.length);
    await p.setViewportSize({ width: 844, height: 390 }); await p.waitForTimeout(400);
    const g1 = await huella(p), nu1 = await p.evaluate(() => P.undo.length);
    await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(400);
    ok('Girar el móvil (y volver) conserva el dibujo tal cual, sin encogerlo', g1 === antes && await huella(p) === antes);
    ok('Girar no borra los pasos de deshacer', nu1 === nu && await p.evaluate(() => P.undo.length) === nu);
    await p.click('#undoBtn'); ok('Deshacer funciona después de girar', await huella(p) !== antes);
    // cubo sin efecto: pintar de blanco sobre blanco
    await p.evaluate(() => { document.querySelector('[data-tool=fill]').click(); document.querySelectorAll('#colors .sw')[14].click(); });
    const u0 = await p.evaluate(() => P.undo.length);
    const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
    await p.mouse.click(r.x + 5, r.y + 5);
    ok('El cubo sin efecto no gasta un paso de deshacer', await p.evaluate(() => P.undo.length) === u0);
    // borrar todo
    const d0 = await huella(p);
    await p.click('#clearBtn'); const tras1 = await huella(p);
    await p.click('#clearBtn'); const vacia = await blanca(p);
    ok('🗑️: el primer toque no borra; el segundo sí', tras1 === d0 && vacia);
    await p.click('#undoBtn'); ok('Se puede deshacer «borrar todo»', await huella(p) === d0);
    await p.click('#clearBtn'); await p.waitForTimeout(3800); await p.click('#clearBtn');
    ok('Si se espera, el aviso de 🗑️ caduca y un toque suelto no borra', await huella(p) === d0);
    await c.close();
  }
  // ---------- 4. guardar sin duplicar ni perder dibujos ----------
  {
    const c = await b.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, deviceScaleFactor: 1 });
    const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
    await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(400);
    await trazo(p, .3); await p.click('#saveBtn'); await p.waitForTimeout(200);
    let g = await gal(p); ok('Guardar crea una entrada en «Mis dibujos»', g.length === 1);
    await p.click('#saveBtn'); await p.click('#saveBtn'); g = await gal(p);
    ok('Volver a pulsar 💾 sin cambios no duplica', g.length === 1);
    const v1 = g[0]; await trazo(p, .6); await p.click('#saveBtn'); g = await gal(p);
    ok('Guardar después de seguir pintando actualiza el mismo dibujo', g.length === 1 && g[0] !== v1);
    await trazo(p, .7); await p.evaluate(() => go('m-paint')); await p.waitForTimeout(300); g = await gal(p);
    ok('Al salir con cambios se guardan en su entrada, sin duplicar', g.length === 1);
    // un segundo dibujo
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(400); await trazo(p, .4); await p.click('#saveBtn'); g = await gal(p);
    ok('Un dibujo nuevo tiene su propia entrada', g.length === 2);
    const original = g[1];
    // editar el primero desde la galería
    await p.evaluate(() => go('gallery')); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelectorAll('#galgrid button')[1].click()); await p.click('#vEdit'); await p.waitForTimeout(600);
    await trazo(p, .85); await p.click('#saveBtn'); g = await gal(p);
    ok('Editar un dibujo de la galería guarda una copia nueva y no toca el original', g.length === 3 && g.includes(original));
    // sin espacio
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(400); await trazo(p, .5);
    const antes = await gal(p);
    const lleno = await p.evaluate(() => { let i = 0; for (const t of [262144, 16384, 1024, 64]) { const s = 'x'.repeat(t); try { for (; i < 2000; i++) localStorage.setItem('relleno' + i, s); } catch (e) {} } return i; });
    await p.click('#saveBtn'); await p.waitForTimeout(200);
    const tras = await gal(p), aviso = await p.evaluate(() => document.querySelector('#toast').textContent);
    ok('Sin espacio: no se borra ningún dibujo y se avisa', lleno > 0 && tras.length === antes.length && tras.every((u, i) => u === antes[i]) && /No cabe/.test(aviso), `relleno hasta ${lleno}`);
    ok('Sin espacio: el dibujo sigue en pantalla para guardarlo después', await p.evaluate(() => P.dirty) && !(await blanca(p)));
    await p.evaluate(() => { for (let i = 0; i < 2000; i++) localStorage.removeItem('relleno' + i); });
    await p.click('#saveBtn'); ok('Al liberar espacio se guarda normalmente', (await gal(p)).length === antes.length + 1);
    // lámina para colorear
    await p.evaluate(() => go('paint', 'flor')); await p.waitForTimeout(500);
    const t = await p.evaluate(() => ({ tool: P.tool, tpl: P.tpl })); const h0 = await huella(p);
    const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
    await p.mouse.click(r.x + r.width * .5, r.y + r.height * .33);
    ok('Láminas: abren con el cubo y pintan dentro de una zona', t.tool === 'fill' && t.tpl === 'flor' && await huella(p) !== h0);
    await p.screenshot({ path: path.join(OUT, 'despues-lamina-ipad.png') });
    await c.close();
  }
  // ---------- 5. láminas nuevas candidatas ----------
  for (const [n, [w, h, mov]] of Object.entries(DEV)) {
    const c = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: mov, deviceScaleFactor: 2 });
    const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
    await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
    if (n === 'iPhone vertical') {
      await p.evaluate(() => go('tpl')); await p.waitForTimeout(600);
      const l = await p.evaluate(() => [...document.querySelectorAll('#tplgrid button')].map(b => b.dataset.arg || 'añadir'));
      ok('Lista de láminas: «Añadir», las 12 nuevas primero y las 19 anteriores conservadas', l[0] === 'añadir' && l.slice(1, 13).join() === ['heladeria', 'gatito', 'hada', 'unicornio', 'perrito', 'conejito', 'princesa', 'helado', 'mariposa', 'explorador', 'hada-jardin', 'sirena'].map(x => 'n:' + x).join() && l.filter(x => x && !x.startsWith('n:') && x !== 'añadir').length === 19);
    }
    for (const L of ['heladeria', 'gatito', 'hada', 'unicornio', 'perrito', 'conejito', 'princesa', 'helado', 'mariposa', 'explorador', 'hada-jardin', 'sirena']) {
      await p.evaluate(L => { P.zn = null; go('paint', 'n:' + L); }, L); await p.waitForFunction(() => P.zn, null, { timeout: 10000 });
      const m = await p.evaluate(() => {
        const im = LN[P.tpl], cv = document.querySelector('#cv').getBoundingClientRect(), pw = document.querySelector('#pwrap').getBoundingClientRect();
        const ar = im.naturalWidth / im.naturalHeight, arc = pc.width / pc.height;
        const Z = P.zn, N = Z.lab.length, W = Z.W, big = [];
        for (let l = 1; l < Z.sz.length; l++) if (!Z.tiny(l)) big.push(l);
        const first = new Int32Array(Z.sz.length).fill(-1); for (let k = 0; k < N; k++) if (first[Z.lab[k]] < 0) first[Z.lab[k]] = k;
        // fugas: cada zona grande, en un papel en blanco
        let fugas = 0, hijasMal = 0;
        for (const l of big) {
          pctx.fillStyle = '#fff'; pctx.fillRect(0, 0, pc.width, pc.height);
          const k = first[l]; floodFill(k % W, (k / W) | 0, '#ff0000');
          const d = pctx.getImageData(0, 0, pc.width, pc.height).data;
          for (let q = 0; q < N; q++) { const m = Z.lab[q]; if (!m || m === l) continue; const rojo = d[q * 4] > 200 && d[q * 4 + 1] < 60;
            if (!rojo) { if (Z.tiny(m) && Z.padre[Z.grupoDe[m]] === l) hijasMal++; continue; }
            if (!Z.tiny(m)) fugas++; else if (Z.padre[Z.grupoDe[m]] !== l) fugas++; }
        }
        // un toque en una diminuta pinta todo su grupo
        const tam = {}; for (let l = 1; l < Z.sz.length; l++) if (Z.tiny(l)) tam[Z.grupoDe[l]] = (tam[Z.grupoDe[l]] || 0) + 1;
        const gg = +Object.keys(tam).sort((a, b) => tam[b] - tam[a])[0]; let grupoOk = true;
        { pctx.fillStyle = '#fff'; pctx.fillRect(0, 0, pc.width, pc.height); let l0 = 0; for (let l = 1; l < Z.sz.length; l++) if (Z.tiny(l) && Z.grupoDe[l] === gg) { l0 = l; break; }
          const k = first[l0]; floodFill(k % W, (k / W) | 0, '#ff0000'); const d = pctx.getImageData(0, 0, pc.width, pc.height).data;
          for (let l = 1; l < Z.sz.length; l++) if (Z.tiny(l) && Z.grupoDe[l] === gg) { const q = first[l]; if (!(d[q * 4] > 200 && d[q * 4 + 1] < 60)) grupoOk = false; } }
        // zonas que exigen un toque preciso: diminutas sin zona grande y solas en su grupo
        let sueltas = 0, area = 0, libre = 0; for (let l = 1; l < Z.sz.length; l++) { libre += Z.sz[l]; if (Z.tiny(l) && !Z.padre[Z.grupoDe[l]] && tam[Z.grupoDe[l]] === 1) { sueltas++; area += Z.sz[l]; } }
        pctx.fillStyle = '#fff'; pctx.fillRect(0, 0, pc.width, pc.height);
        return { def: Math.abs(arc / ar - 1), dentro: cv.left >= pw.left - 1 && cv.right <= pw.right + 1 && cv.top >= pw.top - 1 && cv.bottom <= pw.bottom + 1,
          grandes: big.length, fugas, hijasMal, grupo: tam[gg], grupoOk, sueltas, pctSueltas: (100 * area / libre).toFixed(2), css: [Math.round(cv.width), Math.round(cv.height)] };
      });
      ok(`${n} · ${L}: entera y sin deformar (papel ${m.css.join(' × ')})`, m.dentro && m.def < .006, `diferencia de proporción ${(m.def * 100).toFixed(2)} %`);
      ok(`${n} · ${L}: el cubo no atraviesa el contorno (${m.grandes} zonas grandes probadas una a una)`, m.fugas === 0, `píxeles fuera de su zona: ${m.fugas}`);
      ok(`${n} · ${L}: al pintar una zona se pintan sus diminutas, y un toque pinta un grupo entero`, m.hijasMal === 0 && m.grupoOk, `grupo mayor: ${m.grupo} diminutas · sueltas: ${m.sueltas} (${m.pctSueltas} % del área)`);
    }
    await c.close();
  }
  // ---------- 6. recorrido real: tocar la miniatura → cargar → abrir → pintar (y fallos con aviso) ----------
  {
    const abrir = async (p, id) => {
      await p.evaluate(() => go('tpl')); await p.waitForSelector(`#tplgrid button[data-arg="${id}"]`);
      await p.click(`#tplgrid button[data-arg="${id}"]`);
    };
    const pinta = async p => { const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
      await p.evaluate(() => document.querySelectorAll('#colors .sw')[0].click());
      const antes = await p.evaluate(() => { const d = pctx.getImageData(0, 0, pc.width, pc.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] < 120) n++; return n; });
      // toca el centro de la zona grande más grande que no sea el fondo
      const q = await p.evaluate(() => { const Z = P.zn; if (!Z) return null; let best = 0, bl = 0; const borde = Z.lab[Z.W * 10 + 10];
        for (let l = 1; l < Z.sz.length; l++) if (l !== borde && Z.sz[l] > best) { best = Z.sz[l]; bl = l; }
        // un punto bien dentro de la zona (a 8 px o más de cualquier borde), no el primero pegado a la línea
        const W = Z.W, H = Z.lab.length / W, R = 8;
        for (let y = R; y < H - R; y += 2) for (let x = R; x < W - R; x += 2) { const k = y * W + x; if (Z.lab[k] !== bl) continue;
          if (Z.lab[k - R] === bl && Z.lab[k + R] === bl && Z.lab[k - R * W] === bl && Z.lab[k + R * W] === bl) return [x, y, pc.width]; }
        for (let k = 0; k < Z.lab.length; k++) if (Z.lab[k] === bl) return [k % W, (k / W) | 0, pc.width]; });
      if (!q) return 0; await p.mouse.click(r.x + q[0] * r.width / q[2], r.y + q[1] * r.width / q[2]); await p.waitForTimeout(150);
      const desp = await p.evaluate(() => { const d = pctx.getImageData(0, 0, pc.width, pc.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] < 120) n++; return n; });
      return desp - antes; };
    // a) todas las láminas, tocando de verdad, con decode() de Safari simulado como «nunca termina»
    for (const [n, [w, h, mov]] of Object.entries(DEV)) {
      const c = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: mov, deviceScaleFactor: 2 });
      await c.addInitScript(() => { HTMLImageElement.prototype.decode = () => new Promise(() => {}); });
      const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
      await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
      const ids = n === 'iPhone vertical' ? await p.evaluate(() => Object.keys(LN)) : ['n:heladeria', 'n:perrito'];
      const mal = [];
      for (const id of ids) {
        await abrir(p, id);
        try { await p.waitForFunction(id => current === 'paint' && P.tpl === id && P.zn, id, { timeout: 8000 }); } catch (e) { mal.push(id + ' no abre'); continue; }
        const lineas = await p.evaluate(() => { const d = octx.getImageData(0, 0, oc.width, oc.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 110) n++; return n / (oc.width * oc.height); });
        if (lineas < .02) { mal.push(id + ' sin dibujo'); continue; }
        if ((await pinta(p)) < 500) mal.push(id + ' no pinta');
      }
      ok(`${n}: tocar la miniatura abre la lámina con su dibujo y se puede pintar (${ids.length}), aunque decode() no responda`, !mal.length, mal.join(', '));
      if (n === 'iPhone vertical') await p.screenshot({ path: path.join(OUT, 'recorrido-iphone.png') });
      await c.close();
    }
    // b) la imagen no existe (404): aviso y vuelta a la lista, sin errores
    {
      const c = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
      const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto(COPIA); await p.waitForTimeout(300);
      await p.route('**/laminas/gatito.png', r => r.fulfill({ status: 404, body: 'no' }));
      await p.evaluate(() => { for (const k in LNB) delete LNB[k]; });
      await abrir(p, 'n:gatito'); await p.waitForTimeout(800);
      const st = await p.evaluate(() => ({ cur: current, toast: document.querySelector('#toast').textContent, on: document.querySelector('#toast').classList.contains('on') }));
      ok('Si la imagen no carga (404): aviso en pantalla y vuelve a la lista', st.cur === 'tpl' && /No se ha podido abrir/.test(st.toast) && st.on && !errs.length, st.toast.replace(/\n/g, ' '));
      await p.unroute('**/laminas/gatito.png');
      await abrir(p, 'n:gatito'); let reabre = true; try { await p.waitForFunction(() => P.tpl === 'n:gatito' && P.zn, null, { timeout: 8000 }); } catch (e) { reabre = false; }
      ok('Al volver a tocarla con conexión, se abre', reabre);
      // c) imagen lenta: «Abriendo la lámina…» y después se abre
      await p.route('**/laminas/hada.png', async r => { await new Promise(s => setTimeout(s, 1500)); await r.continue(); });
      await p.evaluate(() => { for (const k in LNB) delete LNB[k]; });
      await abrir(p, 'n:hada'); await p.waitForTimeout(900);
      const aviso = await p.evaluate(() => document.querySelector('#toast').textContent);
      let abre = true; try { await p.waitForFunction(() => P.tpl === 'n:hada' && P.zn, null, { timeout: 8000 }); } catch (e) { abre = false; }
      ok('Si tarda: aviso «Abriendo la lámina…» y después se abre', /Abriendo/.test(aviso) && abre);
      // e) el dedo cae justo sobre una línea: pinta la zona más cercana
      const q = await p.evaluate(() => { const Z = P.zn, W = Z.W, o = octx.getImageData(0, 0, W, oc.height).data;
        for (let y = 40; y < oc.height - 40; y += 3) for (let x = 40; x < W - 40; x += 3) { const k = y * W + x;
          if (o[k * 4 + 3] > 200 && Z.lab[k + 3] && !Z.tiny(Z.lab[k + 3])) return [x, y, W]; } });
      const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
      const u0 = await p.evaluate(() => P.undo.length);
      await p.mouse.click(r.x + (q[0] + .5) * r.width / q[2], r.y + (q[1] + .5) * r.width / q[2]); await p.waitForTimeout(150);
      ok('Tocar justo encima de una línea pinta la zona más cercana (no un toque sin respuesta)', await p.evaluate(() => P.undo.length) === u0 + 1);
      await c.close();
    }
    // d) lienzo bloqueado para leer (como haría Safari con una imagen de otro origen): abre igual y avisa al pintar
    {
      const c = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
      await c.addInitScript(() => { const g = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function (...a) { if (this.canvas.id === 'oc' && window.__bloquear) throw new DOMException('The operation is insecure.', 'SecurityError'); return g.apply(this, a); }; });
      const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto(COPIA); await p.waitForTimeout(300); await p.evaluate(() => { window.__bloquear = true; });
      await abrir(p, 'n:conejito'); await p.waitForTimeout(1200);
      const st = await p.evaluate(() => ({ cur: current, tpl: P.tpl, zn: P.zn }));
      const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
      await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(200);
      const msg = await p.evaluate(() => document.querySelector('#toast').textContent);
      ok('Lienzo bloqueado: la lámina se abre igual y al pintar sale un aviso (no un toque sin respuesta)', st.cur === 'paint' && st.tpl === 'n:conejito' && /No se ha podido pintar/.test(msg) && !errs.length, msg.replace(/\n/g, ' '));
      await c.close();
    }
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  const bien = res.filter(r => r[0]).length;
  console.log(`\n${bien === res.length ? '✅' : '❌'} ${bien}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(bien === res.length ? 0 : 1);
})();
