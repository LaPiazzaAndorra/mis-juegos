#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia «Mi Mundo» (Chromium; iPhone e iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-mimundo-2026-11-04/prueba-mimundo.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba: datos propios («mmu1:») y sin service worker; la habitación con el fondo y la cama; el catálogo solo enseña
   objetos con ilustración y la misión no se ofrece mientras falte alguna (no hay dibujos de relleno); acostar y levantar
   (sin alas ni varita mientras duerme; la muñeca guardada no cambia).
   Después, CON ARTE DE PRUEBA (formas de colores que solo existen durante esta prueba y no se guardan en la copia, para
   poder comprobar el código antes de tener las ilustraciones): catálogo con los seis objetos; misión «Guardar los
   juguetes» de principio a fin arrastrando cada juguete a la cesta (progreso, ⭐, registro), sacar los juguetes tocando la
   cesta, guardarlos en juego libre, volver a abrir y que siga igual; «Guardar mi progreso» incluye la habitación y las
   misiones; las demás escenas siguen como hoy; datos del juego y de otras copias intactos; iPhone e iPad; sin errores.
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
const INIT = () => { window.__comp = []; navigator.canShare = d => !!(d && d.files); navigator.share = async d => { window.__comp.push({ text: await d.files[0].text() }); }; };
// arte de prueba: formas de colores en un lienzo (solo durante la prueba)
const ARTE_PRUEBA = () => {
  const forma = (w, h, col, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = col; f(g, w, h); return { f: c.toDataURL(), px: [w, h], base: [w / 2, h], recorte: [0, 0] }; };
  Object.assign(MM_MEDIDAS, {
    cesta: forma(300, 220, '#c98b4a', (g, w, h) => g.fillRect(20, 40, w - 40, h - 40)),
    osito: forma(200, 240, '#a8703e', (g, w, h) => { g.beginPath(); g.arc(w / 2, h * .62, 90, 0, 7); g.fill(); }),
    pelota: forma(200, 200, '#ff6f9e', (g, w, h) => { g.beginPath(); g.arc(w / 2, h / 2, 98, 0, 7); g.fill(); }),
    cubos: forma(220, 180, '#6cc8f5', (g, w, h) => g.fillRect(10, 10, w - 20, h - 10)),
    cuento: forma(220, 160, '#a083ff', (g, w, h) => g.fillRect(10, 30, w - 20, h - 30)),
  });
};

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const c = await b.newContext({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2, hasTouch: true }); await c.addInitScript(INIT);
  const p = await c.newPage();
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await p.goto(BASE + 'index.html?arte=svg');
  await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  await p.goto(COPIA); await p.waitForTimeout(800);
  const info = await p.evaluate(async () => ({ aislado: !!window.PRUEBA_MIMUNDO, claves: Object.keys(localStorage), sw: (await navigator.serviceWorker.getRegistrations()).length, juego: Avatar.JUEGO }));
  ok('Copia aislada: datos propios, sin service worker y con la muñeca nueva', info.aislado && !info.claves.length && info.sw === 0 && info.juego === 'todo', JSON.stringify(info.claves));
  await p.evaluate(h => { Avatar.guardar(h); localStorage.setItem('scKey', '"habitacion"'); }, HADA);
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => go('scene')); await p.waitForTimeout(2200);
  const ini = await p.evaluate(() => ({ fondo: document.querySelector('.mm-fondo').naturalWidth, cama: document.querySelectorAll('.mm-obj').length, pegatinas: getComputedStyle(document.getElementById('stkLayer')).display,
    bandeja: [...document.querySelectorAll('#stkRow .mm-item')].map(x => x.textContent), misiones: getComputedStyle(document.getElementById('mmMisiones')).display }));
  ok('Habitación: fondo, cama en dos capas, sin pegatinas de emoji', ini.fondo === 1536 && ini.cama === 2 && ini.pegatinas === 'none', JSON.stringify(ini));
  ok('Sin ilustraciones de la cesta y los juguetes: el catálogo solo enseña la cama y la misión no se ofrece (sin dibujos de relleno)', ini.bandeja.join() === 'Cama' && ini.misiones === 'none');
  await p.screenshot({ path: path.join(OUT, '1-habitacion.png') });
  // acostar y levantar
  const caja = sel => p.$(sel).then(e => e.boundingBox());
  let r = await caja('.mm-obj[data-capa=detras]'); await p.mouse.click(r.x + r.width * .5, r.y + r.height * .55); await p.waitForTimeout(4200);
  const ac = await p.evaluate(() => ({ en: MM.estado().muneca.en, dormida: document.querySelector('.mm-av svg').classList.contains('sleep'),
    ocultas: [...document.querySelectorAll('.mm-av image')].filter(i => /alas|varita/.test(i.getAttribute('href'))).length, guardada: Avatar.cargar().accesorios.join('+') }));
  ok('Tocar la cama la acuesta: ojos cerrados, sin alas ni varita; la muñeca guardada no cambia', ac.en && ac.dormida && ac.ocultas === 0 && ac.guardada === 'alas+varita', JSON.stringify(ac));
  await p.screenshot({ path: path.join(OUT, '2-acostada.png') });
  r = await caja('.mm-muneca'); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(1200);
  ok('Tocarla la levanta y vuelven las alas y la varita', await p.evaluate(() => !MM.estado().muneca.en && [...document.querySelectorAll('.mm-av image')].filter(i => /alas|varita/.test(i.getAttribute('href'))).length >= 2));
  // ---------- con arte de prueba ----------
  await p.evaluate(ARTE_PRUEBA); await p.evaluate(() => scLoad()); await p.waitForTimeout(800);
  const conArte = await p.evaluate(() => ({ bandeja: [...document.querySelectorAll('#stkRow .mm-item')].map(x => x.textContent), mis: getComputedStyle(document.getElementById('mmMisiones')).display }));
  ok('[arte de prueba] Catálogo con los seis objetos y misiones disponibles', conArte.bandeja.length === 6 && conArte.mis !== 'none', conArte.bandeja.join(' / '));
  await p.click('#mmMisiones'); await p.waitForTimeout(300);
  const panel = await p.evaluate(() => [...document.querySelectorAll('.mm-panel .btn')].map(x => x.textContent));
  await p.click('.mm-panel .mm-mis[data-id="guardar-juguetes"]'); await p.waitForTimeout(800);
  const s0 = await p.evaluate(() => +localStorage.getItem('stars') || 0);
  const empez = await p.evaluate(() => ({ banner: document.querySelector('.mm-mision') && document.querySelector('.mm-mision').textContent, fuera: ['osito', 'pelota', 'cubos', 'cuento'].filter(id => document.querySelector(`.mm-obj[data-id="${id}"]`)).length, cesta: !!document.querySelector('.mm-obj[data-id="cesta"]') }));
  ok('[arte de prueba] «Misiones» → «Guardar los juguetes»: aparecen la cesta y los cuatro juguetes, y el aviso 0 de 4', panel.some(t => /Guardar los juguetes/.test(t)) && empez.fuera === 4 && empez.cesta && /0 de 4/.test(empez.banner), JSON.stringify(empez));
  await p.screenshot({ path: path.join(OUT, '3-mision.png') });
  const arrastrarA = async (id, destino) => { const a = await caja(`.mm-obj[data-id="${id}"]`), d = await caja(`.mm-obj[data-id="${destino}"]`);
    await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down(); await p.mouse.move(d.x + d.width / 2, d.y + d.height / 2, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(700); };
  const pasos = [];
  for (const id of ['osito', 'pelota', 'cubos']) { await arrastrarA(id, 'cesta'); pasos.push(await p.evaluate(() => MM.progreso('guardar-juguetes'))); }
  const medio = await p.evaluate(() => document.querySelector('.mm-mision').textContent);
  ok('[arte de prueba] Cada juguete soltado en la cesta se guarda y cuenta (1, 2, 3 de 4)', pasos.join() === '1,2,3' && /3 de 4/.test(medio), pasos.join());
  await arrastrarA('cuento', 'cesta'); await p.waitForTimeout(800);
  const fin = await p.evaluate(() => ({ banner: !!document.querySelector('.mm-mision'), hechas: MM.misiones().hechas['guardar-juguetes'], activa: MM.misiones().activa, stars: +localStorage.getItem('stars'), toast: document.getElementById('toast').textContent }));
  ok('[arte de prueba] Con el cuarto juguete: misión cumplida, +1 ⭐ y queda anotada', !fin.banner && fin.hechas === 1 && fin.activa === null && fin.stars === s0 + 1 && /Misión cumplida/.test(fin.toast), JSON.stringify(fin));
  await p.screenshot({ path: path.join(OUT, '4-cumplida.png') });
  // tocar la cesta: salen los juguetes; juego libre: guardar uno
  r = await caja('.mm-obj[data-id="cesta"]'); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(600);
  const fuera = await p.evaluate(() => MM.estado().objetos.filter(x => !x.dentro && ['osito', 'pelota', 'cubos', 'cuento'].includes(x.id)).length);
  await arrastrarA('pelota', 'cesta');
  const libre = await p.evaluate(() => MM.estado().objetos.find(x => x.id === 'pelota').dentro === MM.estado().objetos.find(x => x.id === 'cesta').uid);
  ok('[arte de prueba] Tocar la cesta saca los juguetes; en juego libre también se guardan en ella', fuera === 4 && libre, `${fuera} fuera`);
  // mover un objeto del catálogo y quitarlo
  await p.click('#stkRow .mm-item[data-id="osito"]'); await p.waitForTimeout(300);
  const selOsito = await p.evaluate(() => getComputedStyle(document.getElementById('mmQuitar')).display !== 'none');
  await p.click('#mmQuitar'); await p.waitForTimeout(300);
  ok('[arte de prueba] Catálogo: tocar un objeto lo selecciona y 🗑️ lo quita', selOsito && await p.evaluate(() => !MM.estado().objetos.some(x => x.id === 'osito')));
  await p.click('#stkRow .mm-item[data-id="osito"]'); await p.waitForTimeout(300);
  ok('[arte de prueba] Y se vuelve a poner desde el catálogo (gratis)', await p.evaluate(() => MM.estado().objetos.some(x => x.id === 'osito' && !x.dentro)));
  // volver a abrir
  const antes = await p.evaluate(() => JSON.stringify([MM.estado(), MM.misiones()]));
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(ARTE_PRUEBA); await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  ok('[arte de prueba] Al volver a abrir, la habitación y las misiones siguen igual (la pelota, en la cesta)', await p.evaluate(() => JSON.stringify([MM.estado(), MM.misiones()])) === antes &&
    await p.evaluate(() => !document.querySelector('.mm-obj[data-id="pelota"]')));
  // copia de seguridad
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.click('#setBtn'); await p.waitForTimeout(600); await p.click('#bkGuardar'); await p.waitForTimeout(800);
  const copia = await p.evaluate(() => window.__comp.length && JSON.parse(window.__comp[0].text).local_storage);
  ok('«Guardar mi progreso» incluye la habitación y las misiones', copia && 'mm_habitacion2' in copia && 'mm_misiones' in copia, copia ? Object.keys(copia).join(', ') : 'sin copia');
  await p.click('#setClose').catch(() => {});
  // demás escenas
  await p.evaluate(() => go('scene')); await p.waitForTimeout(800); await p.click('#scenePick .btn[data-k=casa]'); await p.waitForTimeout(500);
  const casa = await p.evaluate(() => ({ pegatinas: getComputedStyle(document.getElementById('stkLayer')).display, pestanas: document.querySelectorAll('#stkTabs .btn').length, mm: !!document.querySelector('.mm'), mis: getComputedStyle(document.getElementById('mmMisiones')).display }));
  ok('Las demás escenas siguen como hoy (pegatinas y pestañas; sin botón de misiones)', casa.pegatinas !== 'none' && casa.pestanas === 5 && !casa.mm && casa.mis === 'none', JSON.stringify(casa));
  await p.click('#scenePick .btn[data-k=habitacion]'); await p.waitForTimeout(800);
  // pantallas
  for (const [n, vp] of [['iPhone vertical', [390, 844]], ['iPhone horizontal', [844, 390]], ['iPad vertical', [820, 1180]]]) {
    await p.setViewportSize({ width: vp[0], height: vp[1] }); await p.waitForTimeout(900);
    const m = await p.evaluate(() => { const r = document.getElementById('board').getBoundingClientRect(), e = document.querySelector('.mm-escena').getBoundingClientRect(), mu = document.querySelector('.mm-muneca').getBoundingClientRect();
      return { sin: document.documentElement.scrollWidth <= innerWidth + 1, llena: e.width >= r.width - 1 || e.height >= r.height - 1, muneca: mu.left >= r.left - 5 && mu.right <= r.right + 5 }; });
    ok(`${n}: la habitación llena el marco, sin desbordar y con la muñeca a la vista`, m.sin && m.llena && m.muneca, JSON.stringify(m));
    await p.screenshot({ path: path.join(OUT, `5-${n.replace(' ', '-').toLowerCase()}.png`) });
  }
  // datos ajenos
  await p.goto(BASE + 'index.html?arte=svg');
  const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const propias = Object.keys(real).filter(k => !(k in AJENOS));
  ok('Datos del juego (también mm_hab) y de las otras copias intactos; la copia solo escribe «mmu1:»', Object.entries(AJENOS).every(([k, v]) => real[k] === v) && propias.length && propias.every(k => k.startsWith('mmu1:')), propias.join(', '));
  ok('Sin errores de JavaScript ni archivos que falten', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
