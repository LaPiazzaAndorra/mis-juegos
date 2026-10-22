#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la primera prueba de logros (Chromium; iPhone y iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/logros-prueba-2026-10-21/prueba-logros.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · datos propios («rec1:»); no ve ni cambia las claves del juego ni de otras copias; sin service worker;
     · nada aprobado bloqueado: Vestir ofrece exactamente lo mismo que el juego y sin marcas de premio; Pintar y la
       Heladería tienen todo lo de siempre; los premios están ocultos hasta abrirlos y los pedidos nunca los usan;
     · el recorrido tocando: reto Contar con fallos (pista al 2.º, se resuelve al 3.º) → 1 logro; repetir el mismo día no
       suma; Colores → 2; «¡Lo he hecho!» → espera; zona de adultos con código de 4 cifras → confirmar → 3 (dos toques
       seguidos cuentan una vez; «Todavía no» no suma) → el cofre 1 se abre → elegir premio → aparece en Pintar con 🎁;
       cofres 2 y 3 a los 6 y 10 logros (otros días), uno detrás de otro;
     · zona de adultos: código incorrecto, códigos que no coinciden, «¿Has olvidado el código?»;
     · copia de seguridad (recuperación de hoy, sin unión): guarda logros, tareas y premios (no el código); importar la
       misma copia dos veces no duplica; una copia anterior vuelve a ese momento y «Deshacer» lo devuelve; un archivo
       con logros repetidos cuenta cada uno una vez;
     · pantallas en iPhone y iPad (vertical y horizontal): botones de 44 px o más, sin desbordar a lo ancho;
     · sin errores de JavaScript.
   Las capturas se guardan FUERA del repositorio.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/logros-prueba-2026-10-21/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-logros-')); fs.mkdirSync(OUT, { recursive: true });
const AJENOS = { stars: '37', iceCoins: '5', gal: '[]', lv_contar: '2', 'hel1:stars': '3', 'pin1:stars': '4', 'd026:stars': '6' };
const DEV = { 'iPhone vertical': [390, 844, true], 'iPhone horizontal': [844, 390, true], 'iPad vertical': [820, 1180, false], 'iPad horizontal': [1180, 820, false] };
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const errores = [];
const INIT = () => { window.__comp = []; const mm = window.matchMedia.bind(window);
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true }); navigator.canShare = d => !!(d && d.files);
  navigator.share = async d => { if (!navigator.userActivation.isActive) throw new DOMException('sin toque', 'NotAllowedError'); window.__comp.push({ name: d.files[0].name, text: await d.files[0].text() }); }; };

async function pagina(b, [w, h, mov] = DEV['iPhone vertical']) {
  const c = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: mov, deviceScaleFactor: 2 });
  await c.addInitScript(INIT);
  const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
  await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  await p.evaluate(() => { const o = speechSynthesis.speak.bind(speechSynthesis); window.__dicho = []; speechSynthesis.speak = u => { window.__dicho.push(u.text); }; });
  return { c, p };
}
const dicho = p => p.evaluate(() => (window.__dicho || []).slice(-1)[0] || '');
const total = p => p.evaluate(() => Logros.total());
async function reto(p, cual, fallos = 0) {   // hace un reto tocando: «fallos» errores en la 1.ª ronda
  await p.evaluate(() => go('logros')); await p.waitForTimeout(300);
  await p.click(`#lgRetos [data-reto="${cual}"]`); await p.waitForTimeout(400);
  const info = { pista: false, resuelto: false, color: true };
  for (let r = 0; r < 3; r++) {
    await p.waitForFunction(() => document.querySelectorAll('#rtOpts .qopt').length === 3 && !document.querySelector('#rtOpts .qopt.ok'));
    if (cual === 'colores') { await p.waitForTimeout(450); const v = await dicho(p), bueno = await p.getAttribute('#rtOpts .qopt[data-ok="1"]', 'aria-label'); if (!v.includes(bueno)) info.color = false; }
    if (r === 0) for (let f = 0; f < fallos; f++) {
      await p.click('#rtOpts .qopt:not([data-ok="1"]) >> nth=0'); await p.waitForTimeout(120);
      if (f === 1) info.pista = await p.evaluate(() => document.querySelector('#rtOpts .qopt[data-ok="1"]').classList.contains('pista'));
    }
    if (r === 0 && fallos >= 3) { info.resuelto = await p.evaluate(() => document.querySelector('#rtOpts .qopt[data-ok="1"]').classList.contains('ok')); await p.waitForTimeout(2200); continue; }
    await p.click('#rtOpts .qopt[data-ok="1"]'); await p.waitForTimeout(1650);
  }
  await p.waitForSelector('#rtVolver'); info.texto = await p.textContent('#rtPrompt'); return info;
}
async function zonaAdultos(p, codigo, crear) {
  await p.evaluate(() => go('logros')); await p.waitForTimeout(200); await p.click('#lgAdultos'); await p.waitForTimeout(200);
  const teclas = async c => { for (const k of c) await p.click(`#adBox .adk[data-k="${k}"]`); };
  if (crear) { await teclas(codigo); await teclas(codigo); } else await teclas(codigo);
  await p.waitForTimeout(150);
}
async function abrirCofre(p, n, eleccion) {
  await p.evaluate(() => go('logros')); await p.waitForTimeout(300);
  await p.click(`#lgCamino .cofre[data-n="${n}"]`, { force: true }); await p.waitForSelector('#cfBox .cfpremio', { timeout: 4000 });
  await p.click(`#cfBox .cfpremio[data-id="${eleccion}"]`); await p.waitForTimeout(300);
}

(async () => {
  const b = await pw.chromium.launch();
  // ---------- 1. datos propios ----------
  {
    const { c, p } = await pagina(b);
    await p.goto(BASE + 'index.html?arte=svg'); await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
    await p.goto(COPIA); await p.waitForTimeout(400);
    ok('La copia no ve los datos del juego ni de otras copias', await p.evaluate(() => localStorage.getItem('stars') === null && document.querySelector('.sc').textContent === '0'));
    const sw = await p.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).some(r => r.scope.includes('logros')));
    ok('Aislamiento activo (rec1: / rec1-) y sin service worker', await p.evaluate(() => window.PRUEBA_LOGROS && window.PRUEBA_LOGROS.prefijo === 'rec1:') && !sw);
    await p.evaluate(() => { const o = speechSynthesis.speak.bind(speechSynthesis); window.__dicho = []; speechSynthesis.speak = u => { window.__dicho.push(u.text); }; });
    await reto(p, 'contar'); await p.goto(BASE + 'index.html?arte=svg');
    const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
    ok('Datos del juego y de otras copias intactos', Object.entries(AJENOS).every(([k, v]) => real[k] === v));
    const nuevas = Object.keys(real).filter(k => !(k in AJENOS));
    ok('Todo lo que escribe la copia lleva «rec1:»', nuevas.length && nuevas.every(k => k.startsWith('rec1:')), nuevas.join(', '));
    await c.close();
  }
  // ---------- 2. nada aprobado bloqueado ----------
  {
    const opciones = async (p, url) => { await p.goto(url); await p.waitForTimeout(400); await p.evaluate(() => go('dress')); await p.waitForTimeout(500);
      const tabs = await p.$$eval('#dtabs .btn', bs => bs.length), out = [];
      for (let i = 0; i < tabs; i++) { await p.click(`#dtabs .btn >> nth=${i}`); await p.waitForTimeout(150);
        out.push(await p.$$eval('#dopts button', bs => bs.map(b => (b.textContent || '').trim() + '|' + b.disabled).join(','))); }
      return { out, premio: await p.$$eval('#dress .premio, #dress [data-premio]', x => x.length) }; };
    const { c, p } = await pagina(b);
    const juego = await opciones(p, BASE + 'index.html?pruebas'), copia = await opciones(p, COPIA);
    ok('Vestir: exactamente las mismas opciones que el juego, todas elegibles y sin marcas de premio', JSON.stringify(juego.out) === JSON.stringify(copia.out) && !copia.premio && !copia.out.join().includes('|true'), `${copia.out.map(x => x.split(',').length).join('/')} opciones por pestaña`);
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(300);
    const pin = await p.evaluate(() => ({ sw: [...document.querySelectorAll('#colors .sw:not(.premio)')].length, st: [...document.querySelectorAll('#stamps .stp:not(.premio)')].length,
      ocultos: [...document.querySelectorAll('[data-premio]')].every(b => b.hidden) }));
    ok('Pintar: los 15 colores y 18 sellos de siempre; los premios, ocultos', pin.sw === 15 && pin.st === 18 && pin.ocultos);
    await p.evaluate(() => go('ice')); await p.waitForTimeout(300);
    const hel = await p.evaluate(() => { let mal = 0; for (let i = 0; i < 400; i++) { iceNew(); if (ICE.order.scoops.some(f => f >= 6) || (ICE.order.top != null && ICE.order.top >= 5)) mal++; }
      return { fl: [...document.querySelectorAll('#iceFlavs .fl:not(.premio)')].length, tp: [...document.querySelectorAll('#iceTops .btn:not(.premio)')].length, mal }; });
    ok('Heladería: los 6 sabores y 5 adornos de siempre; 400 pedidos sin premios', hel.fl === 6 && hel.tp === 5 && hel.mal === 0);
    await c.close();
  }
  // ---------- 3. recorrido completo tocando ----------
  let copiaGuardada = null;
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => { window.__hoy = '2026-10-21'; });
    const r1 = await reto(p, 'contar', 3);
    ok('Reto Contar: al 2.º fallo brilla la buena; al 3.º se resuelve y se sigue', r1.pista && r1.resuelto);
    ok('Terminar el reto (aun con fallos) da 1 logro', await total(p) === 1 && /Has ganado un logro/.test(r1.texto));
    await p.screenshot({ path: path.join(OUT, 'logros-fin-reto.png') });
    const r2 = await reto(p, 'contar');
    ok('Repetir el mismo reto el mismo día: se juega, pero no suma', await total(p) === 1 && /Hoy ya tienes el logro/.test(r2.texto));
    const r3 = await reto(p, 'colores');
    ok('Reto Colores: la voz pide el color bueno; +1 logro (2)', r3.color && await total(p) === 2);
    await p.evaluate(() => go('logros')); await p.waitForTimeout(300);
    ok('«✓ Hoy» en los dos retos', await p.$$eval('#lgRetos .hoy', x => x.every(e => !e.hidden)));
    await p.click('#lgTareas .thecho[data-t="juguetes"]'); await p.waitForTimeout(200);
    ok('«¡Lo he hecho!» deja la tarea esperando a un adulto, sin sumar', await p.isVisible('#lgTareas .espera') && await total(p) === 2 && !(await p.$('#lgTareas .thecho[data-t="juguetes"]')));
    await p.click('#lgTareas .thecho[data-t="dientes"]'); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(OUT, 'logros-esperando.png') });
    // zona de adultos: códigos que no coinciden, luego bien
    await p.click('#lgAdultos'); await p.waitForTimeout(200);
    for (const k of '1357') await p.click(`#adBox .adk[data-k="${k}"]`);
    for (const k of '1358') await p.click(`#adBox .adk[data-k="${k}"]`);
    const noCoinciden = /No coinciden/.test(await p.textContent('#adBox'));
    for (const k of '13571357') await p.click(`#adBox .adk[data-k="${k}"]`);
    ok('Código de 4 cifras: hay que repetirlo; si no coincide, se vuelve a empezar', noCoinciden && /Zona de adultos/.test(await p.textContent('#adBox')));
    await p.screenshot({ path: path.join(OUT, 'adultos-zona.png') });
    const juguetes = await p.evaluate(() => Logros.leerAvisos().find(a => a.tarea === 'juguetes').id);
    await p.evaluate(id => { const bt = document.querySelector(`#adBox .adconf[data-id="${id}"]`); bt.click(); bt.click(); }, juguetes); await p.waitForTimeout(150);
    ok('Confirmar (dos toques seguidos) cuenta una sola vez: 3 logros', await total(p) === 3);
    const dientes = await p.evaluate(() => Logros.leerAvisos().find(a => a.tarea === 'dientes').id);
    await p.click(`#adBox .adno[data-id="${dientes}"]`); await p.waitForTimeout(150);
    ok('«Todavía no» quita el aviso sin sumar ni castigar', await total(p) === 3 && await p.evaluate(() => Logros.leerAvisos().length === 0));
    await p.click('#adSalir'); await p.waitForTimeout(700);
    ok('Al volver, Amaia ve la celebración de la tarea confirmada', /adulto ha visto/.test((await p.evaluate(() => window.__dicho)).join(' ')));
    ok('El cofre 1 está listo («¡Ábrelo!»)', await p.isVisible('#lgCamino .cofre.listo[data-n="1"]'));
    await p.screenshot({ path: path.join(OUT, 'logros-cofre-listo.png') });
    await p.click('#lgCamino .cofre[data-n="1"]', { force: true }); await p.waitForSelector('#cfBox .cfpremio');
    await p.screenshot({ path: path.join(OUT, 'cofre-elegir.png') });
    ok('El cofre ofrece dos premios marcados «premio de prueba»', await p.$$eval('#cfBox .cfprov', x => x.length) === 2);
    await p.click('#cfBox .cfpremio[data-id="prov-sellos-magia"]'); await p.waitForTimeout(300);
    ok('Elegir: el cofre queda abierto con su premio', await p.isVisible('#lgCamino .cofre.abierto[data-n="1"]') && (await p.evaluate(() => Logros.abiertos())).join() === 'prov-sellos-magia');
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(300); await p.click('[data-tool="stamp"]');
    const sell = await p.evaluate(() => [...document.querySelectorAll('#stamps .stp.premio')].filter(b => !b.hidden && b.offsetParent).length);
    ok('Los «Sellos mágicos» aparecen en Pintar, marcados con 🎁; los demás premios siguen ocultos', sell === 4 && await p.evaluate(() => [...document.querySelectorAll('[data-premio]:not([data-premio="prov-sellos-magia"])')].every(b => b.hidden)));
    await p.screenshot({ path: path.join(OUT, 'pintar-sellos-premio.png') });
    // guardar la copia ahora (3 logros, 1 cofre)
    await p.evaluate(() => go('home')); await p.waitForTimeout(200); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(600);
    copiaGuardada = (await p.evaluate(() => window.__comp))[0]; await p.tap('#setClose'); await p.waitForTimeout(200);
    // cofres 2 y 3 (otros días)
    await p.evaluate(() => { window.__hoy = '2026-10-22'; }); await reto(p, 'contar'); await reto(p, 'colores');
    await p.evaluate(() => go('logros')); await p.waitForTimeout(200); await p.click('#lgTareas .thecho[data-t="dientes"]');
    await zonaAdultos(p, '1357'); const d2 = await p.evaluate(() => Logros.leerAvisos()[0].id); await p.click(`#adBox .adconf[data-id="${d2}"]`); await p.click('#adSalir');
    ok('Otro día los retos vuelven a dar logro: 6', await total(p) === 6);
    await abrirCofre(p, 2, 'prov-caramelos');
    await p.evaluate(() => { window.__hoy = '2026-10-23'; }); await reto(p, 'contar'); await reto(p, 'colores');
    await p.evaluate(() => go('logros')); await p.waitForTimeout(200);
    ok('Con 8 logros el cofre 3 aún no se abre (faltan 2)', !(await p.isVisible('#lgCamino .cofre.listo[data-n="3"]')));
    await p.evaluate(() => { window.__hoy = '2026-10-24'; }); await reto(p, 'contar'); await reto(p, 'colores');
    await abrirCofre(p, 3, 'prov-sabor-chicle');
    ok('Cofres a los 3, 6 y 10 logros, abiertos uno a uno', await total(p) === 10 && (await p.evaluate(() => Logros.leerCofres().map(c => c.n).join())) === '1,2,3');
    await p.evaluate(() => go('ice')); await p.waitForTimeout(300);
    ok('En la Heladería aparecen el adorno y el sabor elegidos, con 🎁', await p.evaluate(() => [...document.querySelectorAll('#ice [data-premio]')].filter(b => !b.hidden).length === 2));
    await p.screenshot({ path: path.join(OUT, 'heladeria-premios.png') });
    // código incorrecto y olvido
    await p.evaluate(() => go('logros')); await p.click('#lgAdultos'); for (const k of '0000') await p.click(`#adBox .adk[data-k="${k}"]`);
    const malCod = /Código incorrecto/.test(await p.textContent('#adBox'));
    await p.click('#adOlvido'); const [a, bb] = (await p.textContent('#adBox')).match(/(\d) × (\d)/).slice(1).map(Number);
    for (const k of String(a * bb)) await p.click(`#adBox .adk[data-k="${k}"]`);
    for (const k of '24682468') await p.click(`#adBox .adk[data-k="${k}"]`);
    ok('Código incorrecto no entra; «¿Has olvidado el código?» pide una multiplicación y deja poner otro', malCod && /Zona de adultos/.test(await p.textContent('#adBox')));
    await p.click('#adSalir');
    // ---------- 4. copia de seguridad ----------
    const cg = JSON.parse(copiaGuardada.text);
    ok('La copia guarda logros, tareas y premios (no el código de adultos)', !!cg.local_storage.logros && !!cg.local_storage.premios && 'tareas' in cg.local_storage && !('adultos' in cg.local_storage) && JSON.parse(cg.local_storage.logros).lista.length === 3);
    fs.writeFileSync(path.join(OUT, 'copia-logros.json'), copiaGuardada.text);
    const importar = async archivo => { await p.evaluate(() => go('home')); await p.waitForTimeout(200); await p.tap('#setBtn'); await p.waitForTimeout(500);
      const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.tap('#bkRecuperar')]); await fc.setFiles(archivo); await p.waitForTimeout(500);
      await p.tap('#bkConfirmar'); await p.waitForTimeout(2700); };
    await importar(path.join(OUT, 'copia-logros.json')); const t0 = await total(p);
    ok('Recuperar una copia anterior vuelve a ese momento: 3 logros y 1 cofre (regla de hoy; la unión queda pendiente)', t0 === 3 && (await p.evaluate(() => Logros.abiertos())).join() === 'prov-sellos-magia');
    ok('El código de adultos se conserva al recuperar', await p.evaluate(() => Logros.huella('2468') === JSON.parse(localStorage.getItem('adultos')).codigo));
    await p.evaluate(() => go('home')); await p.waitForTimeout(200); await p.tap('#setBtn'); await p.waitForTimeout(500); p.once('dialog', d => d.accept()); await p.tap('#bkDeshacer'); await p.waitForTimeout(2700);
    ok('«Deshacer la última recuperación» devuelve los 10 logros y los 3 cofres', await total(p) === 10 && await p.evaluate(() => Logros.leerCofres().length) === 3);
    await importar(path.join(OUT, 'copia-logros.json')); const t1 = await total(p), c1 = await p.evaluate(() => Logros.leerCofres().length);
    await importar(path.join(OUT, 'copia-logros.json')); const t2 = await total(p), c2 = await p.evaluate(() => Logros.leerCofres().length);
    ok('Importar la misma copia dos veces no duplica (3 logros y 1 cofre las dos veces)', t1 === 3 && t2 === 3 && c1 === 1 && c2 === 1);
    const rep = JSON.parse(copiaGuardada.text), l = JSON.parse(rep.local_storage.logros); l.lista = l.lista.concat(l.lista, l.lista);
    const pr = JSON.parse(rep.local_storage.premios); pr.cofres = pr.cofres.concat(pr.cofres); rep.local_storage.logros = JSON.stringify(l); rep.local_storage.premios = JSON.stringify(pr);
    fs.writeFileSync(path.join(OUT, 'copia-repetida.json'), JSON.stringify(rep)); await importar(path.join(OUT, 'copia-repetida.json'));
    ok('Un archivo con logros y cofres repetidos cuenta cada uno una vez', await total(p) === 3 && await p.evaluate(() => Logros.leerCofres().length) === 1);
    await c.close();
  }
  // ---------- 5. pantallas ----------
  for (const [n, d] of Object.entries(DEV)) {
    const { c, p } = await pagina(b, d);
    const medir = sel => p.evaluate(sel => { const els = [...document.querySelectorAll(sel)].filter(e => e.offsetParent && !e.hidden), R = els.map(e => e.getBoundingClientRect());
      return { n: els.length, min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))), ancho: document.documentElement.scrollWidth <= innerWidth + 1 && R.every(r => r.left >= -1 && r.right <= innerWidth + 1) }; }, sel);
    await p.evaluate(() => { const l = []; for (let i = 0; i < 3; i++) l.push({ id: 'r:2026-10-0' + (i + 1) + ':contar', tipo: 'reto', que: 'contar', fecha: new Date().toISOString(), visto: true }); localStorage.setItem('logros', JSON.stringify({ v: 1, lista: l })); });
    await p.evaluate(() => go('logros')); await p.waitForTimeout(400);
    const m1 = await medir('#logros .btn, #logros .cofre, #logros .big');
    await p.screenshot({ path: path.join(OUT, `logros-${n.replace(' ', '-').toLowerCase()}.png`) });
    await p.click('#lgRetos [data-reto="colores"]'); await p.waitForTimeout(400);
    const m2 = await medir('#reto .btn, #reto .qopt');
    await p.evaluate(() => go('logros')); await p.waitForTimeout(200); await p.click('#lgCamino .cofre[data-n="1"]', { force: true }); await p.waitForSelector('#cfBox .cfpremio');
    const m3 = await medir('#cofreModal button'); await p.click('#cfCerrar');
    await p.click('#lgAdultos'); await p.waitForTimeout(200); const m4 = await medir('#adModal button');
    ok(`${n}: Mis logros, reto, cofre y adultos a la vista, botones de 44 px o más, sin desbordar`, [m1, m2, m3, m4].every(m => m.n && m.min >= 44 && m.ancho), [m1, m2, m3, m4].map(m => m.min).join('/') + ' px');
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
