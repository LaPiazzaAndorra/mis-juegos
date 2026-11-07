#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia del salón de Mi Mundo (Chromium; iPad e iPhone simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-salon-2026-11-07/prueba-salon.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba: datos propios («sal1:») y sin service worker; la habitación como la aprobada (fondo, cama, catálogo de seis,
   acostarse, la misión «Guardar los juguetes»); el cambio 🛏️ ↔ 🏠 (salón) conservando la distribución de cada uno; el
   salón con su fondo, lo que hay al empezar y su catálogo ilustrado (15 objetos, todos con su imagen); juego libre: platos
   y tazas desde la bandeja a la mesa (como mucho 6), los cojines de sofá al sofá, sentar un peluche en un cojín, mover la
   mesa y un cojín con lo que tienen encima, separar una cosa arrastrándola y volver a ponerla, quitar la mesa (lo de encima
   queda en el suelo) y volver a ponerla; la misión «Merienda para tres» en el iPad (exactamente 3 platos y 3 tazas: el
   cuarto no cabe en la mesa; +1 ⭐ y anotada); volver a abrir; «Guardar» y «Recuperar mi progreso» con las dos
   distribuciones y las misiones; en el iPhone en vertical, la merienda entera con el dedo, todo en la pantalla y el toque
   tolerante; las demás escenas como hoy; datos del juego y de otras copias intactos; sin errores.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-salon-2026-11-07/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-salon-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const AJENOS = { stars: '50', avatar: '{"v":1,"piel":"morena"}', mm_hab: '{"X":300,"Y":500}', mm_habitacion2: '{"v":1,"real":true}', sc_casa: '[{"e":"🐶","x":50,"y":50,"s":13,"f":1}]',
  'mmu1:mm_habitacion2': '{"v":1}', 'com1:avatar': '{"v":1}' };
const HADA = { piel: 'dorada', ojos: { color: 'azul' }, pelo: { estilo: 'coleta', color: 'chocolate' }, ropa: 'hada', accesorios: ['alas', 'varita'] };
const JUGUETES = ['osito', 'pelota', 'cubos', 'cuento'];
const SALON = 'Sofá,Mesa,Estantería,Lámpara,Alfombra,Cojín rosa,Cojín lila,Cojín corazón,Cojín estrella,Plato,Taza,Tetera,Galletas,Conejito,Osito';
const INIT = () => { window.__comp = []; navigator.canShare = d => !!(d && d.files); navigator.share = async d => { window.__comp.push({ text: await d.files[0].text() }); }; };

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const contexto = async (vp, dsf = 2) => { const c = await b.newContext({ viewport: vp, deviceScaleFactor: dsf, isMobile: vp.width < 600, hasTouch: true }); await c.addInitScript(INIT);
    const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); }); return { c, p }; };
  const caja = (p, sel) => p.$(sel).then(e => e && e.boundingBox());
  const arrastrar = async (p, a, d) => { await p.mouse.move(a[0], a[1]); await p.mouse.down(); await p.mouse.move(d[0], d[1], { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(700); };
  const centro = r => [r.x + r.width / 2, r.y + r.height / 2];
  // un punto de la pantalla donde tocar coge ese objeto (sobre su dibujo y sin otro encima), lo más cerca posible de la
  // posición preferida (fracciones de su caja); así se toca como lo haría un dedo
  const tomar = (p, sel, pref = [.5, .5]) => p.evaluate(([sel, pref]) => { const el = document.querySelector(sel), r = el.getBoundingClientRect(), b = document.getElementById('board').getBoundingClientRect(), u = el.dataset.uid || 'muneca';
    let mejor = null, dm = Infinity;
    for (let i = 1; i < 24; i++) for (let j = 1; j < 24; j++) { const x = r.left + r.width * i / 24, y = r.top + r.height * j / 24;
      if (x < b.left + 2 || x > b.right - 2 || y < b.top + 2 || y > b.bottom - 2) continue;
      const d = Math.hypot(i / 24 - pref[0], j / 24 - pref[1]); if (d < dm && MM.queToca(x, y) === u) { dm = d; mejor = [x, y]; } }
    return mejor; }, [sel, pref]);
  // un objeto por su uid (o el primero con ese id que esté en el suelo)
  const selDe = async (p, id) => { const uid = await p.evaluate(i => { const o = MM.estado().objetos.find(x => x.id === i && !x.sobre && !x.dentro); return o && o.uid; }, id);
    return `.mm-obj[data-uid="${uid}"][data-capa="detras"]`; };
  // soltar en el tablero de la mesa (su tercio de arriba) o en el centro de arriba de un cojín
  const aLaMesa = async p => { const r = await caja(p, '.mm-obj[data-id="mesa"]'); return [r.x + r.width / 2, r.y + r.height * .2]; };
  const aEncima = async (p, id) => { const r = await caja(p, `.mm-obj[data-id="${id}"]`); return [r.x + r.width / 2, r.y + r.height * .35]; };
  const ponerEnMesa = async (p, id) => arrastrar(p, await tomar(p, await selDe(p, id)), await aLaMesa(p));
  const enMesa = p => p.evaluate(() => { const e = MM.estado(), m = e.objetos.find(x => x.id === 'mesa'); return e.objetos.filter(x => m && x.sobre === m.uid).map(x => x.id).sort().join(','); });
  const abrir = async (p, k) => { await p.evaluate(([h, k]) => { Avatar.guardar(h); localStorage.setItem('scKey', JSON.stringify(k)); }, [HADA, k]); await p.reload(); await p.waitForTimeout(600);
    await p.evaluate(() => go('scene')); await p.waitForTimeout(2200); };
  const escena = async (p, k) => { await p.click(`#scenePick .btn[data-k=${k}]`); await p.waitForTimeout(1800); };
  const empezar = async (p, id) => { await p.click('#mmMisiones'); await p.waitForTimeout(300); await p.click(`.mm-panel .mm-mis[data-id="${id}"]`); await p.waitForTimeout(900); };
  const estado = p => p.evaluate(() => JSON.stringify(MM.estado()));
  const imagenes = p => p.evaluate(async () => { const ims = [...document.querySelectorAll('#stkRow .mm-item img')]; await Promise.all(ims.map(i => i.decode().catch(() => {})));
    return { bandeja: [...document.querySelectorAll('#stkRow .mm-item')].map(x => x.textContent).join(), imagenes: ims.filter(i => i.naturalWidth > 0).length,
      fondo: document.querySelector('.mm-fondo').naturalWidth, fondoSrc: document.querySelector('.mm-fondo').src.split('/').pop(), pegatinas: getComputedStyle(document.getElementById('stkLayer')).display }; });

  // ================= iPad =================
  let { c, p } = await contexto({ width: 1180, height: 820 });
  await p.goto(BASE + 'index.html?arte=svg');
  await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  await p.goto(COPIA); await p.waitForTimeout(800);
  const info = await p.evaluate(async () => ({ aislado: !!window.PRUEBA_SALON, claves: Object.keys(localStorage), sw: (await navigator.serviceWorker.getRegistrations()).length, juego: Avatar.JUEGO, pensar: !!window.PENSAR }));
  ok('Copia aislada: datos propios, sin service worker, con la muñeca nueva y Contar y Memoria (como lo publicado)', info.aislado && !info.claves.length && info.sw === 0 && info.juego === 'todo' && info.pensar, JSON.stringify(info));
  // ---------- habitación (aprobada) ----------
  await abrir(p, 'habitacion');
  let im = await imagenes(p);
  ok('Habitación: su fondo y su catálogo de seis, con imagen', im.fondoSrc === 'fondo.webp' && im.bandeja === 'Cama,Cesta de juguetes,Osito,Pelota,Cubos de colores,Libro de cuentos' && im.imagenes === 6 && im.pegatinas === 'none', im.bandeja);
  let r = await caja(p, '.mm-obj[data-id=cama][data-capa=detras]'); await p.mouse.click(r.x + r.width * .5, r.y + r.height * .55); await p.waitForTimeout(4200);
  const ac = await p.evaluate(() => ({ en: !!MM.estado().muneca.en, ocultas: [...document.querySelectorAll('.mm-av image')].filter(i => /alas|varita/.test(i.getAttribute('href'))).length, guardada: Avatar.cargar().accesorios.join('+') }));
  ok('Habitación: tocar la cama la acuesta, sin alas ni varita a la vista (la muñeca guardada no cambia)', ac.en && ac.ocultas === 0 && ac.guardada === 'alas+varita', JSON.stringify(ac));
  r = await caja(p, '.mm-muneca'); await p.mouse.click(...centro(r)); await p.waitForTimeout(1000);
  const s0 = await p.evaluate(() => +localStorage.getItem('stars') || 0);
  await empezar(p, 'guardar-juguetes');
  for (const id of JUGUETES) await arrastrar(p, await tomar(p, `.mm-obj[data-id="${id}"]`), await tomar(p, '.mm-obj[data-id="cesta"]'));
  await p.waitForTimeout(800);
  ok('Habitación: la misión «Guardar los juguetes» entera (+1 ⭐, anotada)', await p.evaluate(s => MM.misiones().hechas['guardar-juguetes'] === 1 && +localStorage.getItem('stars') === s + 1, s0));
  await p.mouse.click(...await tomar(p, '.mm-obj[data-id="cesta"]')); await p.waitForTimeout(600);   // saca los juguetes
  await arrastrar(p, await tomar(p, '.mm-obj[data-id="cesta"]'), [300, 650]);                                // y mueve la cesta
  const habAntes = await estado(p);
  await p.screenshot({ path: path.join(OUT, '01-habitacion.png') });
  // ---------- salón ----------
  await escena(p, 'casa');
  im = await imagenes(p);
  const ini = await p.evaluate(() => ({ esc: MM.escenario(), objs: MM.estado().objetos.map(o => o.id).join(), mis: getComputedStyle(document.getElementById('mmMisiones')).display, pestanas: getComputedStyle(document.getElementById('stkTabs')).display }));
  ok('🏠 Salón: su fondo, lo de empezar (sofá, mesa, estantería, lámpara, alfombra y dos cojines) y el botón de misiones', im.fondoSrc === 'fondo-salon.webp' && im.fondo === 1536 && ini.esc === 'salon' &&
    ini.objs === 'alfombra,sofa,estanteria,lampara,mesa,cojin-rosa,cojin-lila' && ini.mis !== 'none' && ini.pestanas === 'none' && im.pegatinas === 'none', JSON.stringify(ini));
  ok('🏠 Salón: catálogo ilustrado propio (15 objetos, todos con su imagen)', im.bandeja === SALON && im.imagenes === 15, im.bandeja);
  await p.screenshot({ path: path.join(OUT, '02-salon.png') });
  // la distribución de cada escenario se conserva al cambiar
  await arrastrar(p, await tomar(p, '.mm-obj[data-id="lampara"]'), [1050, 470]);
  const salonAntes = await estado(p);
  await escena(p, 'habitacion'); const hab2 = await estado(p); await escena(p, 'casa'); const sal2 = await estado(p);
  ok('Cambiar 🛏️ ↔ 🏠 conserva la distribución de cada uno (la cesta movida, la lámpara movida)', hab2 === habAntes && sal2 === salonAntes && JSON.parse(hab2).objetos.length === 6);
  // juego libre: platos y tazas a la mesa desde la bandeja
  for (let i = 0; i < 4; i++) { await p.click('#stkRow .mm-item[data-id="plato"]'); await p.waitForTimeout(250); }
  await p.click('#stkRow .mm-item[data-id="taza"]'); await p.waitForTimeout(250); await p.click('#stkRow .mm-item[data-id="tetera"]'); await p.waitForTimeout(250);
  const libre = await p.evaluate(() => { const e = MM.estado(), m = e.objetos.find(x => x.id === 'mesa'); return { mesa: e.objetos.filter(x => x.sobre === m.uid).map(x => x.id).sort().join(), suelo: e.objetos.filter(x => x.id === 'plato' && !x.sobre).length }; });
  ok('Bandeja: platos, taza y tetera van a su sitio de la mesa; el cuarto plato no cabe y queda en el suelo', libre.mesa === 'plato,plato,plato,taza,tetera' && libre.suelo === 1, JSON.stringify(libre));
  await p.click('#stkRow .mm-item[data-id="plato"]'); await p.waitForTimeout(200); await p.click('#stkRow .mm-item[data-id="plato"]'); await p.waitForTimeout(200);
  await p.click('#stkRow .mm-item[data-id="plato"]'); await p.waitForTimeout(300);
  ok('Como mucho 6 platos', await p.evaluate(() => MM.estado().objetos.filter(x => x.id === 'plato').length) === 6 && /ya hay 6/.test(await p.textContent('#toast')));
  // cojines de sofá al sofá; el conejito, sentado en un cojín
  await p.click('#stkRow .mm-item[data-id="cojin-corazon"]'); await p.waitForTimeout(250); await p.click('#stkRow .mm-item[data-id="cojin-estrella"]'); await p.waitForTimeout(250);
  await p.click('#stkRow .mm-item[data-id="conejito"]'); await p.waitForTimeout(300);
  await arrastrar(p, await tomar(p, '.mm-obj[data-id="conejito"]'), await aEncima(p, 'cojin-lila'));
  const sent = await p.evaluate(() => { const e = MM.estado(), u = id => e.objetos.find(x => x.id === id); return { sofa: ['cojin-corazon', 'cojin-estrella'].every(i => u(i).sobre === u('sofa').uid), conejito: u('conejito').sobre === u('cojin-lila').uid }; });
  ok('Los cojines de sofá van al sofá y el conejito se sienta en el cojín lila', sent.sofa && sent.conejito, JSON.stringify(sent));
  // mover la mesa: lo de encima va con ella (y en la pantalla)
  const rel = () => p.evaluate(() => { const e = MM.estado(), m = e.objetos.find(x => x.id === 'mesa'), me = document.querySelector('.mm-obj[data-id="mesa"]').getBoundingClientRect();
    return { m: [m.x, m.y], hijos: e.objetos.filter(x => x.sobre === m.uid).map(x => { const r = document.querySelector(`.mm-obj[data-uid="${x.uid}"]`).getBoundingClientRect();
      return [x.uid, Math.round(x.x - m.x), Math.round(x.y - m.y), Math.round(r.left - me.left), Math.round(r.top - me.top)]; }) }; });
  const m0 = await rel(); let q = await tomar(p, '.mm-obj[data-id="mesa"]', [.5, .8]);
  await arrastrar(p, q, [q[0] - 120, q[1]]);
  const m1 = await rel();
  ok('Al mover la mesa, lo que tiene encima va con ella (mismo sitio en el tablero)', Math.abs(m1.m[0] - m0.m[0]) > 100 && m1.hijos.length === 5 && JSON.stringify(m1.hijos) === JSON.stringify(m0.hijos), `${Math.round(m0.m[0])} → ${Math.round(m1.m[0])}`);
  const c0 = await p.evaluate(() => { const e = MM.estado(); return e.objetos.find(x => x.id === 'conejito').x; });
  q = await tomar(p, '.mm-obj[data-id="cojin-lila"]', [.5, .85]); await arrastrar(p, q, [q[0] + 90, q[1]]);
  ok('Al mover el cojín, el conejito sentado va con él', await p.evaluate(c => { const e = MM.estado(), u = id => e.objetos.find(x => x.id === id); return u('conejito').sobre === u('cojin-lila').uid && u('conejito').x - c > 30; }, c0));
  await p.screenshot({ path: path.join(OUT, '03-salon-juego-libre.png') });
  // separar una taza de la mesa arrastrándola y volver a ponerla
  const tz = await p.evaluate(() => MM.estado().objetos.find(x => x.id === 'taza').uid);
  q = await tomar(p, `.mm-obj[data-uid="${tz}"]`); await arrastrar(p, q, [q[0] + 60, q[1] + 260]);
  const fuera = await p.evaluate(u => !MM.estado().objetos.find(x => x.uid === u).sobre, tz);
  await arrastrar(p, await tomar(p, `.mm-obj[data-uid="${tz}"]`), await aLaMesa(p));
  ok('Una taza se separa de la mesa al arrastrarla y vuelve a su sitio al soltarla encima', fuera && await p.evaluate(u => { const e = MM.estado(); return e.objetos.find(x => x.uid === u).sobre === e.objetos.find(x => x.id === 'mesa').uid; }, tz));
  // quitar la mesa: lo de encima queda en el suelo; volver a ponerla
  q = await tomar(p, '.mm-obj[data-id="mesa"]', [.5, .8]); await p.mouse.click(...q); await p.waitForTimeout(300); await p.click('#mmQuitar'); await p.waitForTimeout(400);
  const sinMesa = await p.evaluate(() => { const e = MM.estado(); return { mesa: e.objetos.some(x => x.id === 'mesa'), encima: e.objetos.filter(x => x.sobre && /plato|taza|tetera/.test(x.id)).length, suelo: e.objetos.filter(x => /plato|taza|tetera/.test(x.id)).length }; });
  await p.click('#stkRow .mm-item[data-id="mesa"]'); await p.waitForTimeout(400);
  ok('Quitar la mesa (🗑️) deja en el suelo lo que tenía encima; se vuelve a poner desde la bandeja', !sinMesa.mesa && sinMesa.encima === 0 && sinMesa.suelo === 8 && await p.evaluate(() => MM.estado().objetos.some(x => x.id === 'mesa')), JSON.stringify(sinMesa));
  // ---------- la merienda (iPad) ----------
  const s1 = await p.evaluate(() => +localStorage.getItem('stars') || 0);
  await empezar(p, 'merienda');
  const mi = await p.evaluate(() => { const e = MM.estado(); return { banner: (document.querySelector('.mm-mision') || {}).textContent, mesa: e.objetos.filter(x => x.sobre).length,
    platos: e.objetos.filter(x => x.id === 'plato').length, tazas: e.objetos.filter(x => x.id === 'taza').length, invitados: ['osito', 'conejito'].every(i => e.objetos.some(x => x.id === i && !x.sobre)) }; });
  ok('iPad · «Merienda para tres»: la mesa vacía, la merienda en el suelo, los invitados esperando; 0 de 10', mi.mesa <= 2 && mi.invitados && /0 de 10/.test(mi.banner) && mi.platos >= 3 && mi.tazas >= 3, JSON.stringify(mi));
  await p.screenshot({ path: path.join(OUT, '04-merienda-lista-ipad.png') });
  const pasos = [];
  for (const id of ['plato', 'plato', 'plato', 'taza', 'taza', 'taza', 'tetera']) { await ponerEnMesa(p, id); pasos.push(await p.evaluate(() => MM.progreso('merienda'))); }
  ok('iPad · cada plato, taza y la tetera soltados en la mesa van a su sitio y cuentan (1…7)', pasos.join() === '1,2,3,4,5,6,7', pasos.join());
  // un cuarto plato no cabe en la mesa (exactamente tres)
  await p.click('#stkRow .mm-item[data-id="plato"]'); await p.waitForTimeout(300);
  const cuarto = await p.evaluate(() => { const e = MM.estado(), m = e.objetos.find(x => x.id === 'mesa'); return { mesa: e.objetos.filter(x => x.id === 'plato' && x.sobre === m.uid).length, p: MM.progreso('merienda') }; });
  if (await p.$('#mmQuitar:visible')) { await p.click('#mmQuitar'); await p.waitForTimeout(300); }
  ok('iPad · exactamente tres platos: un plato más no cabe en la mesa', cuarto.mesa === 3 && cuarto.p === 7, JSON.stringify(cuarto));
  await ponerEnMesa(p, 'galletas');
  await arrastrar(p, await tomar(p, '.mm-obj[data-id="osito"]'), await aEncima(p, 'cojin-rosa'));
  ok('iPad · las galletas a la mesa y el osito sentado: 9 de 10', await p.evaluate(() => MM.progreso('merienda')) === 9 && /9 de 10/.test(await p.textContent('.mm-mision')));
  await p.screenshot({ path: path.join(OUT, '05-merienda-en-curso-ipad.png') });
  await arrastrar(p, await tomar(p, '.mm-obj[data-id="conejito"]'), await aEncima(p, 'cojin-lila')); await p.waitForTimeout(800);
  const finM = await p.evaluate(() => ({ banner: !!document.querySelector('.mm-mision'), hechas: MM.misiones().hechas.merienda, stars: +localStorage.getItem('stars'), toast: document.getElementById('toast').textContent }));
  ok('iPad · con el conejito sentado: ¡merienda lista!, +1 ⭐ (las reglas de siempre) y anotada', !finM.banner && finM.hechas === 1 && finM.stars === s1 + 1 && /Misión cumplida/.test(finM.toast), JSON.stringify(finM));
  await p.screenshot({ path: path.join(OUT, '06-merienda-cumplida-ipad.png') });
  // volver a abrir
  const antes = await p.evaluate(() => JSON.stringify([localStorage.getItem('mm_habitacion2'), localStorage.getItem('mm_salon'), localStorage.getItem('mm_misiones')]));
  const salonVisto = await estado(p);
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => go('scene')); await p.waitForTimeout(2000);
  const reab = await estado(p); await escena(p, 'habitacion'); const reabH = await estado(p);
  ok('Al volver a abrir, el salón (con la merienda puesta), la habitación y las misiones siguen igual', reab === salonVisto && reabH === habAntes &&
    await p.evaluate(() => JSON.stringify([localStorage.getItem('mm_habitacion2'), localStorage.getItem('mm_salon'), localStorage.getItem('mm_misiones')])) === antes);
  // guardar y recuperar el progreso
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.click('#setBtn'); await p.waitForTimeout(600); await p.click('#bkGuardar'); await p.waitForTimeout(800);
  const copia = await p.evaluate(() => window.__comp.length && JSON.parse(window.__comp[0].text));
  ok('«Guardar mi progreso» incluye la habitación, el salón y las misiones', copia && ['mm_habitacion2', 'mm_salon', 'mm_misiones'].every(k => k in copia.local_storage));
  const fich = path.join(OUT, 'copia-salon.json'); fs.writeFileSync(fich, JSON.stringify(copia));
  await p.click('#setClose').catch(() => {});
  await p.evaluate(() => { localStorage.removeItem('mm_salon'); localStorage.setItem('mm_misiones', '{"v":1,"activa":null,"hechas":{}}'); });   // se pierde algo
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.click('#setBtn'); await p.waitForTimeout(500);
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#bkRecuperar')]); await fc.setFiles(fich); await p.waitForTimeout(600); await p.click('#bkConfirmar'); await p.waitForTimeout(3000);
  ok('«Recuperar mi progreso» devuelve el salón, la habitación y las misiones', await p.evaluate(() => JSON.stringify([localStorage.getItem('mm_habitacion2'), localStorage.getItem('mm_salon'), localStorage.getItem('mm_misiones')])) === antes);
  // demás escenas
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1200); await p.click('#scenePick .btn[data-k=parque]'); await p.waitForTimeout(500);
  const parque = await p.evaluate(() => ({ pegatinas: getComputedStyle(document.getElementById('stkLayer')).display, pestanas: document.querySelectorAll('#stkTabs .btn').length, mm: !!document.querySelector('.mm'), mis: getComputedStyle(document.getElementById('mmMisiones')).display }));
  ok('Las demás escenas siguen como hoy (pegatinas y pestañas; sin botón de misiones)', parque.pegatinas !== 'none' && parque.pestanas === 5 && !parque.mm && parque.mis === 'none', JSON.stringify(parque));
  // datos ajenos (en este mismo navegador, donde se pusieron)
  await p.goto(BASE + 'index.html?arte=svg');
  const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const propias = Object.keys(real).filter(k => !(k in AJENOS));
  ok('Datos del juego (también mm_habitacion2 y las pegatinas de la casa) y de otras copias intactos; la copia solo escribe «sal1:»', Object.entries(AJENOS).every(([k, v]) => real[k] === v) && propias.length && propias.every(k => k.startsWith('sal1:')), propias.slice(0, 4).join(', '));
  await c.close();

  // ================= iPhone en vertical =================
  ({ c, p } = await contexto({ width: 390, height: 844 }));
  await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await abrir(p, 'casa'); await empezar(p, 'merienda'); await p.waitForTimeout(700);
  const vis = await p.evaluate(() => { const b = document.getElementById('board').getBoundingClientRect();
    return [...document.querySelectorAll('.mm-obj[data-capa="detras"]')].filter(e => /plato|taza|tetera|galletas|osito|conejito|mesa|cojin-rosa|cojin-lila/.test(e.dataset.id)).map(e => { const r = e.getBoundingClientRect();
      return { id: e.dataset.id, dentro: r.left >= b.left - 1 && r.right <= b.right + 1 && r.top >= b.top - 1 && r.bottom <= b.bottom + 1, min: Math.round(Math.min(r.width, r.height)) }; }); });
  ok('iPhone vertical · al empezar la merienda, la mesa, los cojines, los invitados y las ocho cosas caben en la pantalla', vis.length === 13 && vis.every(v => v.dentro), vis.filter(v => !v.dentro).map(v => v.id).join(', ') || `${vis.length} a la vista`);
  ok('iPhone vertical · las cosas más pequeñas (las tazas) miden 18 px o más; con el toque tolerante, 70 px', vis.every(v => v.min >= 18), vis.map(v => `${v.id} ${v.min}`).join(' · '));
  await p.screenshot({ path: path.join(OUT, '07-merienda-lista-iphone.png') });
  // toque tolerante: a 18 px de una taza, por un lado libre
  const tUid = await p.evaluate(() => MM.estado().objetos.find(x => x.id === 'taza').uid);
  // a 18 px del DIBUJO de la taza (no de la caja de su imagen, que tiene márgenes transparentes)
  const punto18 = await p.evaluate(u => { const el = document.querySelector(`.mm-obj[data-uid="${u}"]`), rc = el.getBoundingClientRect();
    const cv = document.createElement('canvas'); cv.width = el.naturalWidth; cv.height = el.naturalHeight; const cx = cv.getContext('2d'); cx.drawImage(el, 0, 0);
    const d = cx.getImageData(0, 0, cv.width, cv.height).data; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < cv.height; y += 2) for (let x = 0; x < cv.width; x += 2) if (d[(y * cv.width + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const s = rc.width / cv.width, r = { left: rc.left + x0 * s, right: rc.left + x1 * s, top: rc.top + y0 * s, bottom: rc.top + y1 * s }; r.width = r.right - r.left; r.height = r.bottom - r.top;
    const otros = [...document.querySelectorAll('.mm-obj[data-capa="detras"]')].filter(e => e.dataset.uid !== u && /plato|taza|tetera|galletas|osito|conejito/.test(e.dataset.id)).map(e => e.getBoundingClientRect());
    const libre = (x, y) => otros.every(o => Math.hypot(Math.max(o.left - x, 0, x - o.right), Math.max(o.top - y, 0, y - o.bottom)) > 30);
    return [[r.left + r.width / 2, r.top - 18], [r.left - 18, r.top + r.height / 2], [r.right + 18, r.top + r.height / 2]].find(([x, y]) => libre(x, y)); }, tUid);
  if (punto18) { await p.mouse.click(punto18[0], punto18[1]); await p.waitForTimeout(400); }
  const elegido = await p.evaluate(() => (document.querySelector('.mm-obj.sel') || {}).dataset);
  ok('iPhone vertical · un toque a 18 px de una taza la selecciona (toque tolerante)', !!punto18 && elegido && elegido.uid === tUid, elegido ? elegido.id : 'nada');
  const pasosI = [];
  for (const id of ['plato', 'taza', 'plato', 'taza', 'plato', 'taza', 'tetera', 'galletas']) { await ponerEnMesa(p, id); pasosI.push(await p.evaluate(() => MM.progreso('merienda'))); }
  await arrastrar(p, await tomar(p, '.mm-obj[data-id="osito"]'), await aEncima(p, 'cojin-rosa')); pasosI.push(await p.evaluate(() => MM.progreso('merienda')));
  await p.screenshot({ path: path.join(OUT, '08-merienda-en-curso-iphone.png') });
  await arrastrar(p, await tomar(p, '.mm-obj[data-id="conejito"]'), await aEncima(p, 'cojin-lila')); await p.waitForTimeout(900);
  ok('iPhone vertical · la merienda entera arrastrando con el dedo', pasosI.join() === '1,2,3,4,5,6,7,8,9' && await p.evaluate(() => MM.misiones().hechas.merienda === 1), pasosI.join());
  await p.screenshot({ path: path.join(OUT, '09-merienda-cumplida-iphone.png') });
  for (const [n, vp] of [['iPhone horizontal', [844, 390]], ['iPad vertical', [820, 1180]]]) {
    await p.setViewportSize({ width: vp[0], height: vp[1] }); await p.waitForTimeout(900);
    const m = await p.evaluate(() => { const r = document.getElementById('board').getBoundingClientRect(), e = document.querySelector('.mm-escena').getBoundingClientRect(), mu = document.querySelector('.mm-muneca').getBoundingClientRect();
      return { sin: document.documentElement.scrollWidth <= innerWidth + 1, llena: e.width >= r.width - 1 || e.height >= r.height - 1, muneca: mu.left >= r.left - 5 && mu.right <= r.right + 5 }; });
    ok(`${n}: el salón llena el marco, sin desbordar y con la muñeca a la vista`, m.sin && m.llena && m.muneca, JSON.stringify(m));
  }
  ok('Sin errores de JavaScript ni archivos que falten', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
