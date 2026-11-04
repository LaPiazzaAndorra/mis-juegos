#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia «Mi Mundo» (Chromium; iPhone e iPad simulados), con las ilustraciones definitivas

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-mimundo-2026-11-04/prueba-mimundo.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba: datos propios («mmu1:») y sin service worker; la habitación con el fondo, la cama y el catálogo ilustrado
   (seis objetos, todos con su imagen); acostar y levantar (sin alas ni varita mientras duerme; la muñeca guardada no
   cambia); en el iPad, la misión «Guardar los juguetes» de principio a fin (⭐ y registro), sacar los juguetes tocando la
   cesta, guardarlos en juego libre, quitar y volver a poner; volver a abrir; «Guardar» y «Recuperar mi progreso» con la
   habitación y las misiones; en el iPhone en vertical, la misión entera con los juguetes y la cesta en la pantalla y de buen
   tamaño, y el toque tolerante; las demás escenas como hoy; datos del juego y de otras copias intactos; sin errores.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-mimundo-2026-11-04/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-mimundo-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const AJENOS = { stars: '50', avatar: '{"v":1,"piel":"morena"}', mm_hab: '{"X":300,"Y":500}', 'hab1:mm_habitacion2': '{"v":1}', 'com1:avatar': '{"v":1}', 'con1:stars': '6' };
const HADA = { piel: 'dorada', ojos: { color: 'azul' }, pelo: { estilo: 'coleta', color: 'chocolate' }, ropa: 'hada', accesorios: ['alas', 'varita'] };
const JUGUETES = ['osito', 'pelota', 'cubos', 'cuento'];
const INIT = () => { window.__comp = []; navigator.canShare = d => !!(d && d.files); navigator.share = async d => { window.__comp.push({ text: await d.files[0].text() }); }; };

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const contexto = async vp => { const c = await b.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: vp.width < 600, hasTouch: true }); await c.addInitScript(INIT);
    const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); }); return { c, p }; };
  const caja = (p, sel) => p.$(sel).then(e => e && e.boundingBox());
  const arrastrarA = async (p, id, destino) => { const a = await caja(p, `.mm-obj[data-id="${id}"]`), d = await caja(p, `.mm-obj[data-id="${destino}"]`);
    await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down(); await p.mouse.move(d.x + d.width / 2, d.y + d.height / 2, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(700); };
  const abrirHabitacion = async p => { await p.evaluate(h => { Avatar.guardar(h); localStorage.setItem('scKey', '"habitacion"'); }, HADA); await p.reload(); await p.waitForTimeout(600);
    await p.evaluate(() => go('scene')); await p.waitForTimeout(2200); };
  const empezar = async p => { await p.click('#mmMisiones'); await p.waitForTimeout(300); await p.click('.mm-panel .mm-mis[data-id="guardar-juguetes"]'); await p.waitForTimeout(900); };

  // ================= iPad =================
  let { c, p } = await contexto({ width: 1180, height: 820 });
  await p.goto(BASE + 'index.html?arte=svg');
  await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  await p.goto(COPIA); await p.waitForTimeout(800);
  const info = await p.evaluate(async () => ({ aislado: !!window.PRUEBA_MIMUNDO, claves: Object.keys(localStorage), sw: (await navigator.serviceWorker.getRegistrations()).length, juego: Avatar.JUEGO }));
  ok('Copia aislada: datos propios, sin service worker y con la muñeca nueva', info.aislado && !info.claves.length && info.sw === 0 && info.juego === 'todo', JSON.stringify(info.claves));
  await abrirHabitacion(p);
  const ini = await p.evaluate(async () => { const ims = [...document.querySelectorAll('#stkRow .mm-item img')]; await Promise.all(ims.map(i => i.decode().catch(() => {})));
    return { fondo: document.querySelector('.mm-fondo').naturalWidth, cama: document.querySelectorAll('.mm-obj').length, pegatinas: getComputedStyle(document.getElementById('stkLayer')).display,
      bandeja: [...document.querySelectorAll('#stkRow .mm-item')].map(x => x.textContent), imagenes: ims.filter(i => i.naturalWidth > 0).length, misiones: getComputedStyle(document.getElementById('mmMisiones')).display }; });
  ok('Habitación: fondo, cama en dos capas y sin pegatinas de emoji', ini.fondo === 1536 && ini.cama === 2 && ini.pegatinas === 'none');
  ok('Catálogo ilustrado: los seis objetos con su imagen y la misión disponible', ini.bandeja.join() === 'Cama,Cesta de juguetes,Osito,Pelota,Cubos de colores,Libro de cuentos' && ini.imagenes === 6 && ini.misiones !== 'none', ini.bandeja.join(' / '));
  // acostar y levantar
  let r = await caja(p, '.mm-obj[data-capa=detras]'); await p.mouse.click(r.x + r.width * .5, r.y + r.height * .55); await p.waitForTimeout(4200);
  const ac = await p.evaluate(() => ({ en: MM.estado().muneca.en, dormida: document.querySelector('.mm-av svg').classList.contains('sleep'),
    ocultas: [...document.querySelectorAll('.mm-av image')].filter(i => /alas|varita/.test(i.getAttribute('href'))).length, guardada: Avatar.cargar().accesorios.join('+') }));
  ok('Tocar la cama la acuesta: ojos cerrados, sin alas ni varita; la muñeca guardada no cambia', ac.en && ac.dormida && ac.ocultas === 0 && ac.guardada === 'alas+varita', JSON.stringify(ac));
  r = await caja(p, '.mm-muneca'); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(1200);
  ok('Tocarla la levanta y vuelven las alas y la varita', await p.evaluate(() => !MM.estado().muneca.en && [...document.querySelectorAll('.mm-av image')].filter(i => /alas|varita/.test(i.getAttribute('href'))).length >= 2));
  // misión en el iPad
  const s0 = await p.evaluate(() => +localStorage.getItem('stars') || 0);
  await empezar(p);
  const empez = await p.evaluate(ids => ({ banner: (document.querySelector('.mm-mision') || {}).textContent, fuera: ids.filter(id => document.querySelector(`.mm-obj[data-id="${id}"]`)).length, cesta: !!document.querySelector('.mm-obj[data-id="cesta"]') }), JUGUETES);
  ok('iPad · «Misiones» → «Guardar los juguetes»: la cesta y los cuatro juguetes en el suelo, aviso 0 de 4', empez.fuera === 4 && empez.cesta && /0 de 4/.test(empez.banner), JSON.stringify(empez));
  await p.screenshot({ path: path.join(OUT, 'mision-lista-ipad.png') });
  const pasos = [];
  for (const id of JUGUETES.slice(0, 3)) { await arrastrarA(p, id, 'cesta'); pasos.push(await p.evaluate(() => MM.progreso('guardar-juguetes'))); }
  ok('iPad · cada juguete soltado en la cesta se guarda y cuenta (1, 2, 3 de 4)', pasos.join() === '1,2,3' && /3 de 4/.test(await p.textContent('.mm-mision')), pasos.join());
  await p.screenshot({ path: path.join(OUT, 'mision-en-curso-ipad.png') });
  await arrastrarA(p, 'cuento', 'cesta'); await p.waitForTimeout(800);
  const fin = await p.evaluate(() => ({ banner: !!document.querySelector('.mm-mision'), hechas: MM.misiones().hechas['guardar-juguetes'], activa: MM.misiones().activa, stars: +localStorage.getItem('stars'), toast: document.getElementById('toast').textContent }));
  ok('iPad · con el cuarto: misión cumplida, +1 ⭐ (las reglas de siempre) y queda anotada', !fin.banner && fin.hechas === 1 && fin.activa === null && fin.stars === s0 + 1 && /Misión cumplida/.test(fin.toast), JSON.stringify(fin));
  await p.screenshot({ path: path.join(OUT, 'mision-cumplida-ipad.png') });
  // recuperar los juguetes y juego libre
  r = await caja(p, '.mm-obj[data-id="cesta"]'); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(600);
  const fuera = await p.evaluate(ids => ids.filter(id => document.querySelector(`.mm-obj[data-id="${id}"]`)).length, JUGUETES);
  await arrastrarA(p, 'pelota', 'cesta');
  const libre = await p.evaluate(() => { const o = MM.estado().objetos; return o.find(x => x.id === 'pelota').dentro === o.find(x => x.id === 'cesta').uid; });
  ok('Tocar la cesta saca los cuatro juguetes; en juego libre se vuelven a guardar', fuera === 4 && libre, `${fuera} fuera`);
  await p.click('#stkRow .mm-item[data-id="pelota"]'); await p.waitForTimeout(400);
  ok('Desde el catálogo también se recupera un juguete guardado en la cesta', await p.evaluate(() => !MM.estado().objetos.find(x => x.id === 'pelota').dentro && !!document.querySelector('.mm-obj[data-id="pelota"]')));
  await p.click('#stkRow .mm-item[data-id="osito"]'); await p.waitForTimeout(300); const selOsito = await p.evaluate(() => getComputedStyle(document.getElementById('mmQuitar')).display !== 'none');
  await p.click('#mmQuitar'); await p.waitForTimeout(300); const quitado = await p.evaluate(() => !MM.estado().objetos.some(x => x.id === 'osito'));
  await p.click('#stkRow .mm-item[data-id="osito"]'); await p.waitForTimeout(300);
  ok('Catálogo: seleccionar, quitar con 🗑️ y volver a poner (gratis)', selOsito && quitado && await p.evaluate(() => MM.estado().objetos.some(x => x.id === 'osito' && !x.dentro)));
  // volver a abrir
  await arrastrarA(p, 'cubos', 'cesta');
  const antes = await p.evaluate(() => JSON.stringify([MM.estado(), MM.misiones()]));
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  ok('Al volver a abrir, la habitación y las misiones siguen igual (los cubos, en la cesta)', await p.evaluate(() => JSON.stringify([MM.estado(), MM.misiones()])) === antes && await p.evaluate(() => !document.querySelector('.mm-obj[data-id="cubos"]')));
  // guardar y recuperar el progreso
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.click('#setBtn'); await p.waitForTimeout(600); await p.click('#bkGuardar'); await p.waitForTimeout(800);
  const copia = await p.evaluate(() => window.__comp.length && JSON.parse(window.__comp[0].text));
  ok('«Guardar mi progreso» incluye la habitación y las misiones', copia && 'mm_habitacion2' in copia.local_storage && 'mm_misiones' in copia.local_storage);
  const fich = path.join(OUT, 'copia-mimundo.json'); fs.writeFileSync(fich, JSON.stringify(copia));
  await p.click('#setClose').catch(() => {});
  await p.evaluate(() => { go('scene'); }); await p.waitForTimeout(1500);
  r = await caja(p, '.mm-obj[data-id="cesta"]'); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(500);   // se cambia algo
  const cambiado = await p.evaluate(() => JSON.stringify([MM.estado(), MM.misiones()])) !== antes;
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.click('#setBtn'); await p.waitForTimeout(500);
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#bkRecuperar')]); await fc.setFiles(fich); await p.waitForTimeout(600); await p.click('#bkConfirmar'); await p.waitForTimeout(3000);
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  ok('«Recuperar mi progreso» devuelve la habitación y las misiones guardadas', cambiado && await p.evaluate(() => JSON.stringify([MM.estado(), MM.misiones()])) === antes);
  // demás escenas
  await p.click('#scenePick .btn[data-k=casa]'); await p.waitForTimeout(500);
  const casa = await p.evaluate(() => ({ pegatinas: getComputedStyle(document.getElementById('stkLayer')).display, pestanas: document.querySelectorAll('#stkTabs .btn').length, mm: !!document.querySelector('.mm'), mis: getComputedStyle(document.getElementById('mmMisiones')).display }));
  ok('Las demás escenas siguen como hoy (pegatinas y pestañas; sin botón de misiones)', casa.pegatinas !== 'none' && casa.pestanas === 5 && !casa.mm && casa.mis === 'none', JSON.stringify(casa));
  // datos ajenos (en este mismo navegador, donde se pusieron)
  await p.goto(BASE + 'index.html?arte=svg');
  const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const propias = Object.keys(real).filter(k => !(k in AJENOS));
  ok('Datos del juego (también mm_hab) y de las otras copias intactos; la copia solo escribe «mmu1:»', Object.entries(AJENOS).every(([k, v]) => real[k] === v) && propias.length && propias.every(k => k.startsWith('mmu1:')), propias.join(', '));
  await c.close();

  // ================= iPhone en vertical =================
  ({ c, p } = await contexto({ width: 390, height: 844 }));
  await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await abrirHabitacion(p); await empezar(p); await p.waitForTimeout(700);
  const vis = await p.evaluate(ids => { const b = document.getElementById('board').getBoundingClientRect();
    return ids.concat('cesta').map(id => { const r = document.querySelector(`.mm-obj[data-id="${id}"]`).getBoundingClientRect();
      return { id, dentro: r.left >= b.left - 1 && r.right <= b.right + 1 && r.top >= b.top - 1 && r.bottom <= b.bottom + 1, min: Math.round(Math.min(r.width, r.height)) }; }); }, JUGUETES);
  ok('iPhone vertical · al empezar, la cesta y los cuatro juguetes caben en la pantalla y miden 40 px o más', vis.every(v => v.dentro && v.min >= 40), vis.map(v => `${v.id} ${v.min}px${v.dentro ? '' : ' (fuera)'}`).join(' · '));
  await p.screenshot({ path: path.join(OUT, 'mision-lista-iphone.png') });
  // toque tolerante: 18 px a la izquierda del osito
  // se toca a 18 px del osito, por un lado donde no haya otro juguete ni la cesta (los sitios son al azar)
  const punto18 = await p.evaluate(() => { const r = document.querySelector('.mm-obj[data-id="osito"]').getBoundingClientRect();
    const otros = [...document.querySelectorAll('.mm-obj[data-capa="detras"]')].filter(e => e.dataset.id !== 'osito' && e.dataset.id !== 'cama').map(e => e.getBoundingClientRect());
    const libre = (x, y) => otros.every(o => Math.hypot(Math.max(o.left - x, 0, x - o.right), Math.max(o.top - y, 0, y - o.bottom)) > 30);
    return [[r.left - 18, r.top + r.height / 2], [r.right + 18, r.top + r.height / 2], [r.left + r.width / 2, r.bottom + 18], [r.left + r.width / 2, r.top - 18]].find(([x, y]) => libre(x, y)); });
  await p.mouse.click(punto18[0], punto18[1]); await p.waitForTimeout(400);
  const elegido = await p.evaluate(() => (document.querySelector('.mm-obj.sel') || {}).dataset);
  ok('iPhone vertical · un toque a 18 px del osito lo selecciona (toque tolerante)', elegido && elegido.id === 'osito', elegido ? elegido.id : 'nada');
  const pasosI = []; for (const id of JUGUETES) { await arrastrarA(p, id, 'cesta'); pasosI.push(await p.evaluate(() => MM.progreso('guardar-juguetes'))); }
  await p.waitForTimeout(800);
  ok('iPhone vertical · la misión entera arrastrando con el dedo', pasosI.slice(0, 3).join() === '1,2,3' && await p.evaluate(() => MM.misiones().hechas['guardar-juguetes'] === 1), pasosI.join());
  await p.screenshot({ path: path.join(OUT, 'mision-cumplida-iphone.png') });
  for (const [n, vp] of [['iPhone horizontal', [844, 390]], ['iPad vertical', [820, 1180]]]) {
    await p.setViewportSize({ width: vp[0], height: vp[1] }); await p.waitForTimeout(900);
    const m = await p.evaluate(() => { const r = document.getElementById('board').getBoundingClientRect(), e = document.querySelector('.mm-escena').getBoundingClientRect(), mu = document.querySelector('.mm-muneca').getBoundingClientRect();
      return { sin: document.documentElement.scrollWidth <= innerWidth + 1, llena: e.width >= r.width - 1 || e.height >= r.height - 1, muneca: mu.left >= r.left - 5 && mu.right <= r.right + 5 }; });
    ok(`${n}: la habitación llena el marco, sin desbordar y con la muñeca a la vista`, m.sin && m.llena && m.muneca, JSON.stringify(m));
  }
  ok('Sin errores de JavaScript ni archivos que falten', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
