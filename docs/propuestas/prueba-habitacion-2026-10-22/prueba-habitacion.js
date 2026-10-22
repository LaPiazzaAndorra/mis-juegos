#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia «prueba habitación» (Chromium; iPhone e iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-habitacion-2026-10-22/prueba-habitacion.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba: datos propios («hab1:») y sin service worker; la habitación nueva con el fondo y la cama; tocar la cama la
   acuesta (ojos cerrados, sin alas, mochila ni varita, entre las dos capas de la cama) sin cambiar la muñeca guardada;
   tocarla la levanta (vuelven alas y varita); arrastrarla; arrastrar la cama (cambia de tamaño con la profundidad);
   soltarla en la cama la acuesta; todo se recupera al volver a abrir; catálogo (la cama es única) y desbloqueos (un objeto
   con candado se abre con los logros); las demás escenas siguen con sus pegatinas; las claves de la habitación de hoy
   (mm_hab, sc_habitacion) y los datos del juego y de las otras copias, intactos; iPhone e iPad sin desbordar; sin errores.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-habitacion-2026-10-22/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-habitacion-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const AJENOS = { stars: '50', avatar: '{"v":1,"piel":"morena"}', mm_hab: '{"X":300,"Y":500}', 'com1:avatar': '{"v":1}', 'con1:stars': '6', 'd026:avatar': '{"v":1}' };
const HADA = { piel: 'morena', ojos: { color: 'verde' }, pelo: { estilo: 'rizos', color: 'miel' }, ropa: 'hada', accesorios: ['alas', 'varita', 'corona'] };

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const c = await b.newContext({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2, hasTouch: true }); const p = await c.newPage();
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await p.goto(BASE + 'index.html?arte=svg');
  await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  await p.goto(COPIA); await p.waitForTimeout(800);
  const info = await p.evaluate(async () => ({ aislado: !!window.PRUEBA_HABITACION, claves: Object.keys(localStorage), sw: (await navigator.serviceWorker.getRegistrations()).length, juego: Avatar.JUEGO }));
  ok('Copia aislada: datos propios, sin service worker y con la muñeca nueva', info.aislado && !info.claves.length && info.sw === 0 && info.juego === 'todo', JSON.stringify(info.claves));
  await p.evaluate(h => { Avatar.guardar(h); localStorage.setItem('scKey', '"habitacion"'); }, HADA);
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => go('scene')); await p.waitForTimeout(2200);
  const ini = await p.evaluate(() => ({ fondo: !!document.querySelector('.hab2-fondo') && document.querySelector('.hab2-fondo').naturalWidth, cama: document.querySelectorAll('.hab2-obj').length,
    pegatinas: getComputedStyle(document.getElementById('stkLayer')).display, bandeja: [...document.querySelectorAll('#stkRow .hab2-item')].map(x => x.textContent) }));
  ok('Habitación nueva: fondo (1536 px), cama en dos capas, sin pegatinas y con su catálogo', ini.fondo === 1536 && ini.cama === 2 && ini.pegatinas === 'none' && ini.bandeja.join() === 'Cama', JSON.stringify(ini));
  await p.screenshot({ path: path.join(OUT, '1-de-pie.png') });
  const visibles = () => p.evaluate(() => [...document.querySelectorAll('.hab2-av image')].map(i => i.getAttribute('href')).filter(h => /alas|varita|mochila/.test(h)).length);
  const estado = () => p.evaluate(() => JSON.parse(localStorage.getItem('mm_habitacion2')));
  const caja = sel => p.$(sel).then(e => e.boundingBox());
  // tocar la cama → camina y se acuesta
  let r = await caja('.hab2-obj[data-capa=detras]'); await p.mouse.click(r.x + r.width * .5, r.y + r.height * .55); await p.waitForTimeout(4200);
  const ac = await p.evaluate(() => { const m = document.querySelector('.hab2-muneca'), z = el => +getComputedStyle(el).zIndex;
    return { dormida: document.querySelector('.hab2-av svg').classList.contains('sleep'), entre: z(document.querySelector('[data-capa=detras]')) < z(m) && z(m) < z(document.querySelector('[data-capa=delante]')),
      giro: m.style.transform, guardada: Avatar.cargar().accesorios.join('+') }; });
  const vis1 = await visibles(), e1 = await estado();
  ok('Tocar la cama: va y se acuesta (ojos cerrados, entre la cama y el embozo, girada)', e1.muneca.en === 'o0' && ac.dormida && ac.entre && /rotate\(-25deg\)/.test(ac.giro), JSON.stringify(ac));
  ok('Acostada: sin alas ni varita a la vista; la muñeca guardada no cambia', vis1 === 0 && ac.guardada === 'alas+varita+corona', `${vis1} capas · ${ac.guardada}`);
  await p.screenshot({ path: path.join(OUT, '2-acostada.png') });
  r = await caja('.hab2-muneca'); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(1200);
  const e2 = await estado(), vis2 = await visibles();
  ok('Tocarla la levanta y vuelven las alas y la varita', e2.muneca.en === null && vis2 >= 2 && !(await p.evaluate(() => document.querySelector('.hab2-av svg').classList.contains('sleep'))), `${vis2} capas`);
  // arrastrar la muñeca
  r = await caja('.hab2-muneca'); const x0 = e2.muneca.x;
  await p.mouse.move(r.x + r.width / 2, r.y + r.height * .6); await p.mouse.down(); await p.mouse.move(r.x + r.width / 2 + 160, r.y + r.height * .6 - 40, { steps: 10 }); await p.mouse.up(); await p.waitForTimeout(400);
  const e3 = await estado(); ok('Arrastrar la muñeca la mueve', e3.muneca.x > x0 + 60 && e3.muneca.en === null, `${Math.round(x0)} → ${Math.round(e3.muneca.x)}`);
  // arrastrar la cama hacia el fondo: se hace más pequeña
  r = await caja('.hab2-obj[data-capa=detras]'); const w0 = r.width;
  await p.mouse.move(r.x + r.width * .6, r.y + r.height * .7); await p.mouse.down(); await p.mouse.move(r.x + r.width * .6 + 100, r.y + r.height * .7 - 80, { steps: 10 }); await p.mouse.up(); await p.waitForTimeout(600);
  const r2 = await caja('.hab2-obj[data-capa=detras]'), e4 = await estado();
  ok('Arrastrar la cama la mueve y cambia de tamaño con la profundidad', e4.objetos[0].y < 979 - 20 && r2.width < w0, `${Math.round(w0)} → ${Math.round(r2.width)} px`);
  // soltar la muñeca encima de la cama
  r = await caja('.hab2-muneca');
  await p.mouse.move(r.x + r.width / 2, r.y + r.height * .6); await p.mouse.down(); await p.mouse.move(r2.x + r2.width * .45, r2.y + r2.height * .5, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(800);
  ok('Soltarla encima de la cama la acuesta', (await estado()).muneca.en === 'o0');
  // volver a abrir
  const antes = JSON.stringify(await estado()); await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => go('scene')); await p.waitForTimeout(2000);
  ok('Al volver a abrir, la cama y la muñeca acostada siguen donde estaban (con los ojos cerrados)', JSON.stringify(await estado()) === antes && await p.evaluate(() => document.querySelector('.hab2-muneca').classList.contains('acostada') && document.querySelector('.hab2-av svg.av').classList.contains('sleep')));
  await p.screenshot({ path: path.join(OUT, '3-vuelta.png') });
  // catálogo: la cama es única; desbloqueo con logros (objeto de prueba con candado, solo en esta comprobación)
  await p.click('#stkRow .hab2-item[data-id=cama]'); await p.waitForTimeout(300);
  const unico = await p.evaluate(() => ({ n: JSON.parse(localStorage.getItem('mm_habitacion2')).objetos.length, toast: document.getElementById('toast').textContent }));
  ok('Catálogo: la cama no se repite (aviso «ya está en la habitación»)', unico.n === 1 && /ya está/.test(unico.toast), unico.toast);
  const bloq = await p.evaluate(async () => {
    HAB_CATALOGO.push(Object.assign({}, HAB_CATALOGO[0], { id: 'cama-premio', nombre: 'Cama premio', unico: true, inicial: null, desbloqueo: { logros: 3 } }));
    const real = Logros.total; Logros.total = () => 1; scLoad(); await new Promise(o => setTimeout(o, 400));
    const b = document.querySelector('#stkRow [data-id=cama-premio]'); const conCandado = b.classList.contains('bloq'); b.click(); await new Promise(o => setTimeout(o, 200));
    const n1 = JSON.parse(localStorage.getItem('mm_habitacion2')).objetos.length, aviso = document.getElementById('toast').textContent;
    Logros.total = () => 3; scLoad(); await new Promise(o => setTimeout(o, 400));
    const b2 = document.querySelector('#stkRow [data-id=cama-premio]'); const libre = !b2.classList.contains('bloq'); b2.click(); await new Promise(o => setTimeout(o, 200));
    const n2 = JSON.parse(localStorage.getItem('mm_habitacion2')).objetos.length;
    document.getElementById('hab2Quitar').click(); HAB_CATALOGO.pop(); Logros.total = real; scLoad(); await new Promise(o => setTimeout(o, 300));
    return { conCandado, n1, aviso, libre, n2, n3: JSON.parse(localStorage.getItem('mm_habitacion2')).objetos.length };
  });
  ok('Desbloqueos: con candado no se coloca y avisa; con los logros se coloca y se puede quitar', bloq.conCandado && bloq.n1 === 1 && /🔒/.test(bloq.aviso) && bloq.libre && bloq.n2 === 2 && bloq.n3 === 1, JSON.stringify(bloq));
  // las demás escenas, como hoy
  await p.click('#scenePick .btn[data-k=casa]'); await p.waitForTimeout(500);
  const casa = await p.evaluate(() => ({ pegatinas: getComputedStyle(document.getElementById('stkLayer')).display, pestanas: document.querySelectorAll('#stkTabs .btn').length, hab2: !!document.querySelector('.hab2') }));
  ok('Las demás escenas siguen como hoy (pegatinas y sus pestañas)', casa.pegatinas !== 'none' && casa.pestanas === 5 && !casa.hab2, JSON.stringify(casa));
  await p.click('#scenePick .btn[data-k=habitacion]'); await p.waitForTimeout(800);
  await p.waitForTimeout(600);
  ok('Y al volver a la habitación, sigue la nueva (acostada, con los ojos cerrados)', await p.evaluate(() => !!document.querySelector('.hab2') && getComputedStyle(document.getElementById('stkTabs')).display === 'none' && document.querySelector('.hab2-av svg.av').classList.contains('sleep')));
  // pantallas
  for (const [n, vp] of [['iPhone vertical', [390, 844]], ['iPhone horizontal', [844, 390]], ['iPad vertical', [820, 1180]]]) {
    await p.setViewportSize({ width: vp[0], height: vp[1] }); await p.waitForTimeout(900);
    const m = await p.evaluate(() => { const r = document.getElementById('board').getBoundingClientRect(), e = document.querySelector('.hab2-escena').getBoundingClientRect(), mu = document.querySelector('.hab2-muneca').getBoundingClientRect();
      return { sin: document.documentElement.scrollWidth <= innerWidth + 1, llena: e.width >= r.width - 1 || e.height >= r.height - 1, munecaVisible: mu.left >= r.left - 5 && mu.right <= r.right + 5 }; });
    ok(`${n}: la habitación llena el marco, sin desbordar y con la muñeca a la vista`, m.sin && m.llena && m.munecaVisible, JSON.stringify(m));
    await p.screenshot({ path: path.join(OUT, `4-${n.replace(' ', '-').toLowerCase()}.png`) });
  }
  // datos ajenos intactos
  await p.goto(BASE + 'index.html?arte=svg');
  const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const propias = Object.keys(real).filter(k => !(k in AJENOS));
  ok('Datos del juego (también mm_hab) y de las otras copias intactos; la copia solo escribe «hab1:»', Object.entries(AJENOS).every(([k, v]) => real[k] === v) && propias.length && propias.every(k => k.startsWith('hab1:')) && !('hab1:mm_hab' in real), propias.join(', '));
  ok('Sin errores de JavaScript ni archivos que falten', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
