#!/usr/bin/env node
/* =====================================================================
   El salón de Mi Mundo sin conexión (requisito): genera la versión publicable como la próxima (Contar y Memoria + Mi Mundo
   con la habitación y el salón, --con-pensar y --con-mimundo de esta carpeta) en una carpeta temporal, SIN publicar nada,
   la sirve como GitHub Pages (/mis-juegos/) y comprueba, en un iPhone simulado:
     · descarga todo y avisa «✅ Lista para jugar sin conexión» (Mi Mundo, con el arte del salón, va en lo básico);
     · en modo avión: están las 23 ilustraciones; la habitación abre con su fondo y su cama; el salón (🏠) abre con su
       fondo y su catálogo; la misión «Merienda para tres» se juega entera; volver a la habitación la conserva;
     · «Guardar mi progreso» incluye la habitación, el salón y las misiones; ninguna petición fallida ni error.
   Uso (desde la raíz): node docs/propuestas/prueba-salon-2026-11-07/prueba-sin-conexion.js [capturas]
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync, spawn } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'salon-sin-conexion-')); fs.mkdirSync(OUT, { recursive: true });
const SITIO = fs.mkdtempSync(path.join(os.tmpdir(), 'sitio-salon-')), PUERTO = 8796, APP = `http://localhost:${PUERTO}/mis-juegos/index.html`;
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const INIT = () => { window.__comp = []; navigator.canShare = d => !!(d && d.files); navigator.share = async d => { window.__comp.push({ text: await d.files[0].text() }); };
  const mm = window.matchMedia.bind(window); window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q); };

(async () => {
  execSync(`python3 herramientas/publicar/preparar_publicacion.py "${SITIO}/mis-juegos" --sin-git --con-pensar docs/propuestas/pensar-2026-11-04 --con-mimundo docs/propuestas/prueba-salon-2026-11-07/mimundo`, { cwd: RAIZ, stdio: 'ignore' });
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: SITIO, stdio: 'ignore' }); process.on('exit', () => srv.kill());
  await new Promise(r => setTimeout(r, 900));
  const b = await pw.chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await ctx.addInitScript(INIT);
  const abrir = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.goto(APP); await p.waitForTimeout(900); return p; };
  let p = await abrir();
  await p.evaluate(() => { localStorage.clear(); Avatar.guardar({ piel: 'morena', ojos: { color: 'verde' }, pelo: { estilo: 'rizos', color: 'miel' }, ropa: 'aventura', accesorios: ['mochila'] }); localStorage.setItem('scKey', '"habitacion"'); });
  await p.reload(); await p.waitForTimeout(1500);
  await p.waitForFunction(() => window.OfflineEstado && OfflineEstado.listo, null, { timeout: 240000 });
  const mmEnLista = await p.evaluate(() => OFFLINE.basico.filter(u => /mimundo/.test(u)).length);
  ok('Descarga todo y avisa «Lista para jugar sin conexión»; Mi Mundo va en lo básico', /Lista/.test(await p.textContent('#offlineAviso')) && mmEnLista >= 27, `${mmEnLista} archivos de Mi Mundo`);
  await ctx.setOffline(true); await p.close(); p = await abrir();
  const fallos = []; p.on('requestfailed', r => fallos.push(r.url()));
  const arte = await p.evaluate(async () => { const us = OFFLINE.basico.filter(u => /mimundo\/arte\/.*\.webp$/.test(u)), mal = []; for (const u of us) { try { if (!(await fetch(u)).ok) mal.push(u); } catch (e) { mal.push(u); } } return { n: us.length, mal }; });
  ok('Sin conexión: están las 23 ilustraciones de Mi Mundo (habitación y salón)', arte.n === 23 && !arte.mal.length, `${arte.n} imágenes`);
  await p.evaluate(() => go('scene')); await p.waitForTimeout(2500);
  const hab = await p.evaluate(() => ({ fondo: (document.querySelector('.mm-fondo') || {}).naturalWidth, cama: document.querySelectorAll('.mm-obj[data-id=cama]').length, esc: MM.escenario() }));
  ok('Sin conexión: la habitación abre con su fondo y su cama', hab.fondo === 1536 && hab.cama === 2 && hab.esc === 'habitacion', JSON.stringify(hab));
  const habAntes = await p.evaluate(() => JSON.stringify(MM.estado()));
  await p.click('#scenePick .btn[data-k=casa]'); await p.waitForTimeout(2500);
  const sal = await p.evaluate(async () => { const ims = [...document.querySelectorAll('.mm-obj, #stkRow .mm-item img')]; await Promise.all(ims.map(i => i.decode().catch(() => {})));
    return { esc: MM.escenario(), fondo: document.querySelector('.mm-fondo').src.split('/').pop(), dibujadas: ims.filter(i => i.naturalWidth > 0).length, total: ims.length }; });
  ok('Sin conexión: el salón abre con su fondo, sus muebles y su catálogo ilustrado', sal.esc === 'salon' && sal.fondo === 'fondo-salon.webp' && sal.total >= 22 && sal.dibujadas === sal.total, JSON.stringify(sal));
  await p.click('#mmMisiones'); await p.waitForTimeout(300); await p.click('.mm-panel .mm-mis[data-id="merienda"]'); await p.waitForTimeout(900);
  const tomar = (sel, pref = [.5, .5]) => p.evaluate(([sel, pref]) => { const el = document.querySelector(sel), r = el.getBoundingClientRect(), u = el.dataset.uid; let mejor = null, dm = Infinity;
    for (let i = 1; i < 24; i++) for (let j = 1; j < 24; j++) { const x = r.left + r.width * i / 24, y = r.top + r.height * j / 24, d = Math.hypot(i / 24 - pref[0], j / 24 - pref[1]); if (d < dm && MM.queToca(x, y) === u) { dm = d; mejor = [x, y]; } }
    return mejor; }, [sel, pref]);
  const arrastrar = async (a, d) => { await p.mouse.move(a[0], a[1]); await p.mouse.down(); await p.mouse.move(d[0], d[1], { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(700); };
  const encima = async (id, f) => { const r = await p.$(`.mm-obj[data-id="${id}"]`).then(e => e.boundingBox()); return [r.x + r.width / 2, r.y + r.height * f]; };
  for (const id of ['plato', 'taza', 'plato', 'taza', 'plato', 'taza', 'tetera', 'galletas']) {
    const uid = await p.evaluate(i => MM.estado().objetos.find(x => x.id === i && !x.sobre).uid, id);
    await arrastrar(await tomar(`.mm-obj[data-uid="${uid}"]`), await encima('mesa', .2)); }
  await arrastrar(await tomar('.mm-obj[data-id="osito"]'), await encima('cojin-rosa', .35));
  await arrastrar(await tomar('.mm-obj[data-id="conejito"]'), await encima('cojin-lila', .35)); await p.waitForTimeout(900);
  ok('Sin conexión: la misión «Merienda para tres» se juega entera', await p.evaluate(() => MM.misiones().hechas.merienda === 1 && !MM.misiones().activa));
  await p.screenshot({ path: path.join(OUT, 'merienda-sin-conexion.png') });
  await p.click('#scenePick .btn[data-k=habitacion]'); await p.waitForTimeout(1500);
  ok('Sin conexión: al volver a la habitación sigue igual', await p.evaluate(() => JSON.stringify(MM.estado())) === habAntes);
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(800);
  const copia = await p.evaluate(() => window.__comp.length && JSON.parse(window.__comp[0].text).local_storage);
  const localStorage_ = await p.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]))), mmGuardadas = Object.keys(localStorage_).filter(k => k.startsWith('mm_')).sort();
  ok('Sin conexión: «Guardar mi progreso» incluye todo lo de Mi Mundo (el salón y las misiones; la habitación, si se ha cambiado)', copia && ['mm_salon', 'mm_misiones'].every(k => mmGuardadas.includes(k)) && mmGuardadas.every(k => copia[k] === localStorage_[k]), mmGuardadas.join(', '));
  ok('Sin conexión: ninguna petición fallida ni error de JavaScript', !fallos.length && !errs.length, fallos.concat(errs).slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
