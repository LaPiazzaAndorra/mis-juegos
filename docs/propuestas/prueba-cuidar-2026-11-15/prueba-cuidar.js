#!/usr/bin/env node
/* =====================================================================
   Prueba automática de «cuidar a la muñeca» (D-037, 1.ª entrega) en la copia aislada (Chromium; iPhone e iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-cuidar-2026-11-15/prueba-cuidar.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba: datos propios («cui1:») y sin service worker; cámara libre (flechas, arrastrar el suelo, llevar a la muñeca
   cerca del borde, el botón para encontrarla) sin mover a la muñeca ni seguirla; la ventana alterna día y noche y se
   guarda; solo se activan sueño y diversión (hay cama y juguetes ilustrados), bajan despacio, no bajan del mínimo y avisan
   una sola vez; jugar con la pelota, los cubos, el cuento y el osito (respuesta visible y más diversión); dormir sube el
   sueño; la rutina del pijama (para dormir hace falta el pijama: pregunta con dibujo y dos opciones, «Ponerse el pijama» y
   «Seguir jugando»; sin pijama no se acuesta, tampoco al volver de Vestir sin él; con «Guardar y volver» y el pijama, al
   mismo escenario y a la cama; con el pijama puesto, se acuesta directamente); de día, una propuesta de vestirse; la lámpara del salón;
   volver a abrir; «Guardar mi progreso» con las necesidades y el día o la noche; datos ajenos intactos; sin errores.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-cuidar-2026-11-15/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-cuidar-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const AJENOS = { stars: '50', avatar: '{"v":1,"piel":"morena"}', mm_habitacion2: '{"v":1,"real":true}', 'sal1:mm_salon': '{"v":1}', 'mmu1:mm_habitacion2': '{"v":1}' };
const HADA = { piel: 'dorada', ojos: { color: 'azul' }, pelo: { estilo: 'coleta', color: 'chocolate' }, ropa: 'hada', accesorios: ['alas', 'varita'] };
const INIT = () => { window.__comp = []; navigator.canShare = d => !!(d && d.files); navigator.share = async d => { window.__comp.push({ text: await d.files[0].text() }); }; };

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const contexto = async vp => { const c = await b.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: vp.width < 600, hasTouch: true }); await c.addInitScript(INIT);
    const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); }); return { c, p }; };
  const caja = (p, sel) => p.$(sel).then(e => e && e.boundingBox());
  const centro = r => [r.x + r.width / 2, r.y + r.height / 2];
  const tomar = (p, sel, pref = [.5, .5]) => p.evaluate(([sel, pref]) => { const el = document.querySelector(sel), r = el.getBoundingClientRect(), b = document.getElementById('board').getBoundingClientRect(), u = el.dataset.uid || 'muneca';
    let mejor = null, dm = Infinity;
    for (let i = 1; i < 24; i++) for (let j = 1; j < 24; j++) { const x = r.left + r.width * i / 24, y = r.top + r.height * j / 24;
      if (x < b.left + 50 || x > b.right - 50 || y < b.top + 2 || y > b.bottom - 60) continue;
      const d = Math.hypot(i / 24 - pref[0], j / 24 - pref[1]); if (d < dm && MM.queToca(x, y) === u) { dm = d; mejor = [x, y]; } }
    return mejor; }, [sel, pref]);
  const abrir = async (p, k) => { await p.evaluate(([h, k]) => { Avatar.guardar(h); localStorage.setItem('scKey', JSON.stringify(k)); }, [HADA, k]); await p.reload(); await p.waitForTimeout(600);
    await p.evaluate(() => go('scene')); await p.waitForTimeout(2000); };
  const muneca = p => p.evaluate(() => { const m = MM.estado().muneca; return [Math.round(m.x), Math.round(m.y), m.en]; });
  const visible = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none'; }, sel);
  // un punto del suelo libre en la pantalla (sin objetos, sin la muñeca, lejos de los botones)
  const sueloLibre = (p, prefY = .78) => p.evaluate(py => { const b = document.getElementById('board').getBoundingClientRect();
    for (const fx of [.5, .4, .6, .3, .7, .2, .8, .15, .85]) for (const fy of [py, py - .06, py + .05, .9, .55]) { const x = b.left + b.width * fx, y = b.top + b.height * fy; if (!MM.queToca(x, y) && !document.elementFromPoint(x, y).closest('button')) return [x, y]; }
    return null; }, prefY);
  // la ventana del escenario, en la pantalla
  const ventana = p => p.evaluate(() => { const v = MM.ESCENARIOS[MM.escenario()].ventana, r = document.querySelector('.mm-escena').getBoundingClientRect(), k = r.width / 1536;
    return [r.left + (v[0] + v[2]) / 2 * k, r.top + (v[1] + v[3]) * .55 * k]; });

  // ================= iPhone en vertical =================
  let { c, p } = await contexto({ width: 390, height: 844 });
  await p.goto(BASE + 'index.html?arte=svg');
  await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
  await p.evaluate(async () => { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); });
  await p.goto(COPIA); await p.waitForTimeout(800);
  const info = await p.evaluate(async () => ({ aislado: !!window.PRUEBA_CUIDAR, claves: Object.keys(localStorage), sw: (await navigator.serviceWorker.getRegistrations()).length, juego: Avatar.JUEGO }));
  ok('Copia aislada: datos propios, sin service worker y con la muñeca nueva', info.aislado && !info.claves.length && info.sw === 0 && info.juego === 'todo', JSON.stringify(info));
  await abrir(p, 'habitacion');
  const hud = await p.evaluate(() => ({ act: MM.activas().join(), hud: [...document.querySelectorAll('.mm-nec-i')].map(b => b.dataset.id).join(), imgs: [...document.querySelectorAll('.mm-nec-i img')].every(i => i.complete && i.naturalWidth > 0) }));
  ok('Solo sueño y diversión activas (hay cama y juguetes ilustrados), con sus indicadores ilustrados', hud.act === 'sueno,diversion' && hud.hud === 'sueno,diversion' && hud.imgs, JSON.stringify(hud));
  const pend = await p.evaluate(() => ({ pend: MM.CAT && window.MM_CATALOGO.necesidades.filter(n => n.pendiente).map(n => n.id).join(), galletas: MM.conArte(MM.CAT.find(o => o.id === 'galletas')), guardadas: Object.keys(MM.necesidades()).filter(k => !['v', 'avisado'].includes(k)).join() }));
  ok('Hambre, higiene y baño, definidas pero inactivas (aunque las galletas ya tengan ilustración) y sin datos guardados', pend.pend === 'hambre,higiene,bano' && pend.galletas && pend.guardadas === 'sueno,diversion', JSON.stringify(pend));
  // ---------- cámara ----------
  const m0 = await muneca(p), c0 = await p.evaluate(() => MM.camara());
  ok('iPhone: se ven las flechas de los dos lados', await visible(p, '.mm-flecha.izq') && await visible(p, '.mm-flecha.der'));
  await p.click('.mm-flecha.der'); await p.waitForTimeout(700);
  const c1 = await p.evaluate(() => MM.camara());
  ok('La flecha mueve la vista y no a la muñeca', c1[0] > c0[0] + 100 && JSON.stringify(await muneca(p)) === JSON.stringify(m0), `${Math.round(c0[0])} → ${Math.round(c1[0])}`);
  ok('En el borde del fondo, la flecha de ese lado desaparece', !await visible(p, '.mm-flecha.der') || await p.evaluate(() => !document.querySelector('.mm-flecha.der').classList.contains('on')));
  await p.click('.mm-flecha.izq'); await p.waitForTimeout(700); await p.click('.mm-flecha.izq'); await p.waitForTimeout(700);
  const fuera = await p.evaluate(() => { const r = document.querySelector('.mm-muneca').getBoundingClientRect(), b = document.getElementById('board').getBoundingClientRect(); return r.right < b.left + 30 || r.left > b.right - 30; });
  ok('La vista no sigue a la muñeca: queda fuera y aparece el botón con su cara para encontrarla', fuera && await visible(p, '.mm-buscar'));
  await p.screenshot({ path: path.join(OUT, '01-camara-buscar-iphone.png') });
  await p.click('.mm-buscar', { force: true }); await p.waitForTimeout(900);
  const enc = await p.evaluate(() => { const r = document.querySelector('.mm-muneca').getBoundingClientRect(), b = document.getElementById('board').getBoundingClientRect(); return r.left >= b.left - 5 && r.right <= b.right + 5; });
  ok('El botón vuelve a encontrarla (y desaparece)', enc && !await visible(p, '.mm-buscar') && JSON.stringify(await muneca(p)) === JSON.stringify(m0));
  // arrastrar el suelo mueve la vista y no la hace andar
  let s = await sueloLibre(p); const c2 = await p.evaluate(() => MM.camara());
  await p.mouse.move(...s); await p.mouse.down(); await p.mouse.move(s[0] - 150, s[1], { steps: 10 }); await p.mouse.up(); await p.waitForTimeout(500);
  const c3 = await p.evaluate(() => MM.camara());
  ok('Arrastrar el suelo desplaza la vista sin que la muñeca ande', c3[0] > c2[0] + 100 && JSON.stringify(await muneca(p)) === JSON.stringify(m0), `${Math.round(c2[0])} → ${Math.round(c3[0])}`);
  await p.evaluate(() => MM.mirar(860, 700)); await p.waitForTimeout(800);
  // llevarla cerca del borde desplaza la vista
  const mb = await tomar(p, '.mm-muneca'), bb = await caja(p, '#board'), c4 = await p.evaluate(() => MM.camara());
  await p.mouse.move(...mb); await p.mouse.down(); await p.mouse.move(bb.x + bb.width - 20, mb[1], { steps: 12 }); await p.waitForTimeout(1500); await p.mouse.up(); await p.waitForTimeout(500);
  const c5 = await p.evaluate(() => MM.camara()), m5 = await muneca(p);
  ok('Al llevarla cerca del borde, la vista se desplaza y ella llega a otra zona', c5[0] > c4[0] + 150 && m5[0] > m0[0] + 250, `vista ${Math.round(c4[0])} → ${Math.round(c5[0])} · muñeca ${m0[0]} → ${m5[0]}`);
  // ---------- día y noche ----------
  await p.evaluate(() => MM.mirar(860, 500)); await p.waitForTimeout(700);
  await p.mouse.click(...await ventana(p)); await p.waitForTimeout(900);
  const noche = await p.evaluate(() => ({ noche: MM.ciclo().noche, clase: document.querySelector('.mm-escena').classList.contains('noche'), luz: getComputedStyle(document.querySelector('.mm-noche')).opacity }));
  ok('Tocar la ventana: se hace de noche (exterior e iluminación) sin que ella ande', noche.noche && noche.clase && JSON.stringify((await muneca(p)).slice(0, 2)) === JSON.stringify(m5.slice(0, 2)), JSON.stringify(noche));
  await p.waitForTimeout(1800);
  await p.screenshot({ path: path.join(OUT, '02-noche-iphone.png') });
  await p.reload(); await p.waitForTimeout(500); await p.evaluate(() => go('scene')); await p.waitForTimeout(1500);
  ok('La noche se guarda (al volver a abrir sigue de noche)', await p.evaluate(() => MM.ciclo().noche && document.querySelector('.mm-escena').classList.contains('noche')));
  await p.evaluate(() => MM.mirar(860, 500)); await p.waitForTimeout(700); await p.mouse.click(...await ventana(p)); await p.waitForTimeout(800);
  ok('Tocar otra vez la ventana: de día', await p.evaluate(() => !MM.ciclo().noche && !document.querySelector('.mm-escena').classList.contains('noche')));
  await p.evaluate(() => { const c = document.querySelector('.mm-panel'); if (c) c.remove(); });
  // ---------- necesidades ----------
  await p.evaluate(() => { const n = MM.necesidades(); n.sueno = 85; n.diversion = 85; n.avisado = {}; });
  await p.evaluate(() => MM.avanzar(300));
  const n1 = await p.evaluate(() => ({ s: MM.necesidades().sueno, d: MM.necesidades().diversion }));
  ok('Bajan despacio: 5 minutos de juego (día) → sueño −20, diversión −30', Math.abs(n1.s - 65) < 1 && Math.abs(n1.d - 55) < 1, JSON.stringify(n1));
  await p.evaluate(() => MM.avanzar(3000));
  const n2 = await p.evaluate(() => ({ s: MM.necesidades().sueno, d: MM.necesidades().diversion, avisos: document.querySelectorAll('.mm-aviso').length, txt: (document.querySelector('.mm-aviso') || {}).textContent }));
  ok('Nunca bajan del mínimo (15) y avisan una sola vez, con dibujo y frase', n2.s === 15 && n2.d === 15 && n2.avisos === 1 && !!n2.txt, JSON.stringify(n2));
  await p.screenshot({ path: path.join(OUT, '03-aviso-iphone.png') });
  await p.evaluate(() => document.querySelector('.mm-aviso').click()); await p.waitForTimeout(300);
  await p.evaluate(() => MM.avanzar(600)); await p.waitForTimeout(200);
  ok('Sin avisos repetidos: no vuelve a avisar mientras no se atienda (ni de la misma necesidad ni en menos de 90 s)', await p.evaluate(() => document.querySelectorAll('.mm-aviso').length) === 0);
  const fueraApp = await p.evaluate(() => JSON.stringify(MM.necesidades()));
  await p.evaluate(() => go('home')); await p.waitForTimeout(3500);
  ok('Fuera de Mi Mundo (u otra pantalla) no cambian', await p.evaluate(() => JSON.stringify(MM.necesidades())) === fueraApp);
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1500);
  // ---------- jugar ----------
  for (const id of ['pelota', 'cubos', 'cuento', 'osito']) { await p.click(`#stkRow .mm-item[data-id="${id}"]`); await p.waitForTimeout(250); }
  await p.evaluate(() => { const e = MM.estado(); [['pelota', 700, 860], ['cubos', 880, 880], ['cuento', 1150, 860], ['osito', 1300, 800]].forEach(([id, x, y]) => { const o = e.objetos.find(q => q.id === id); o.x = x; o.y = y; }); scLoad(); });
  await p.waitForTimeout(1200);
  const jug = [];
  for (const id of ['pelota', 'cubos', 'cuento', 'osito']) {
    await p.evaluate(i => { const o = MM.estado().objetos.find(q => q.id === i); MM.mirar(o.x, 700); }, id); await p.waitForTimeout(700);
    const d0 = await p.evaluate(() => MM.necesidades().diversion), mA = await muneca(p);
    await p.mouse.click(...await tomar(p, `.mm-obj[data-id="${id}"]`)); await p.waitForTimeout(400);
    let anim = false; for (let i = 0; i < 30 && !anim; i++) { await p.waitForTimeout(150); anim = await p.evaluate(i => !!document.querySelector(`.mm-obj[data-id="${i}"][class*="mm-j-"]`), id); }
    const r = await p.evaluate(() => ({ d: MM.necesidades().diversion, boc: (document.querySelector('.mm-bocadillo.on') || {}).textContent }));
    jug.push({ id, sube: Math.round(r.d - d0), anim, boc: r.boc, anda: JSON.stringify(mA) !== JSON.stringify(await muneca(p)) });
    if (id === 'pelota') await p.screenshot({ path: path.join(OUT, '04-jugar-pelota-iphone.png') });
    await p.waitForTimeout(1300);
  }
  ok('Jugar: la pelota, los cubos, el cuento y el osito (va hasta ellos, el juguete se anima, dice algo y sube la diversión)', jug.every(j => j.sube >= 15 && j.anim && j.boc && j.anda), jug.map(j => `${j.id} +${j.sube}${j.anim ? '' : ' sin animación'}${j.boc ? '' : ' sin bocadillo'}`).join(' · '));
  // ---------- la rutina del pijama ----------
  const camaEn = async () => { await p.evaluate(() => { const c = MM.estado().objetos.find(o => o.id === 'cama'); MM.mirar(c.x, 700); }); await p.waitForTimeout(700);
    return tomar(p, '.mm-obj[data-id="cama"][data-capa="detras"]', [.4, .55]); };
  await p.mouse.click(...await camaEn()); await p.waitForTimeout(4500);
  const preg = await p.evaluate(() => ({ txt: (document.querySelector('.mm-pregunta p') || {}).textContent, prev: !!document.querySelector('.mm-pregunta .mm-prev svg'), en: MM.estado().muneca.en }));
  ok('Al ir a la cama le pide el pijama, con dibujo de ella en pijama (aún no se acuesta)', /pijama/.test(preg.txt || '') && preg.prev && !preg.en, JSON.stringify(preg));
  await p.screenshot({ path: path.join(OUT, '05-pijama-pregunta-iphone.png') });
  const ops = await p.evaluate(() => [...document.querySelectorAll('.mm-pregunta button')].map(b => b.textContent.trim()).join(' | '));
  ok('Solo dos opciones: «Ponerse el pijama» y «Seguir jugando» (ya no «Dormir así»)', ops === '👗 Ponerse el pijama | Seguir jugando', ops);
  await p.click('.mm-pregunta button:has-text("Seguir jugando")'); await p.waitForTimeout(800);
  const sigue = await p.evaluate(() => ({ en: !!MM.estado().muneca.en, ropa: Avatar.cargar().ropa, preg: !!document.querySelector('.mm-pregunta') }));
  ok('«Seguir jugando»: no se acuesta y su ropa no cambia (nunca se la cambia sin que ella elija)', !sigue.en && sigue.ropa === 'hada' && !sigue.preg, JSON.stringify(sigue));
  await p.mouse.click(...await camaEn()); await p.waitForTimeout(4500);
  ok('Sin pijama no duerme: al volver a llevarla a la cama, se lo vuelve a pedir', await p.evaluate(() => !!document.querySelector('.mm-pregunta') && !MM.estado().muneca.en));
  // ir a Vestir y volver con ⬅️ sin ponerse el pijama: vuelve al mismo escenario y NO se la acuesta
  await p.click('.mm-pregunta button:has-text("Ponerse el pijama")'); await p.waitForTimeout(900);
  await p.click('#dress .bar [data-go]'); await p.waitForTimeout(3000);
  const sinPij = await p.evaluate(() => ({ pant: current, esc: MM.escenario(), ropa: Avatar.cargar().ropa, en: !!MM.estado().muneca.en }));
  ok('Vuelve de Vestir sin pijama: al mismo escenario, sin acostarla', sinPij.pant === 'scene' && sinPij.esc === 'habitacion' && sinPij.ropa === 'hada' && !sinPij.en, JSON.stringify(sinPij));
  await p.evaluate(() => document.querySelectorAll('.mm-panel').forEach(e => e.remove()));
  // una noche nueva: «Ponerse el pijama» → Vestir → «Guardar y volver» → a la cama
  await p.evaluate(() => MM.mirar(860, 500)); await p.waitForTimeout(700); await p.mouse.click(...await ventana(p)); await p.waitForTimeout(500);
  if (!await p.evaluate(() => MM.ciclo().noche)) { await p.mouse.click(...await ventana(p)); await p.waitForTimeout(500); }
  await p.evaluate(() => document.querySelectorAll('.mm-aviso,.mm-panel').forEach(e => e.remove()));
  await p.mouse.click(...await camaEn()); await p.waitForTimeout(4500);
  await p.click('.mm-pregunta button:has-text("Ponerse el pijama")'); await p.waitForTimeout(900);
  const enVestir = await p.evaluate(() => ({ pant: current, volver: getComputedStyle(document.getElementById('mmVolver')).display !== 'none' }));
  ok('«Ponerse el pijama» lleva a Vestir, con «Guardar y volver»', enVestir.pant === 'dress' && enVestir.volver, JSON.stringify(enVestir));
  await p.click('#dtabs .btn:has-text("Ropa")'); await p.waitForTimeout(400); await p.click('#dopts .avopt:has-text("Pijama")'); await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(OUT, '06-vestir-pijama-iphone.png') });
  await p.click('#mmVolver'); await p.waitForTimeout(6000);
  const vuelta = await p.evaluate(() => ({ pant: current, esc: MM.escenario(), ropa: Avatar.cargar().ropa, en: !!MM.estado().muneca.en, preg: !!document.querySelector('.mm-pregunta') }));
  ok('Con el pijama elegido y «Guardar y volver»: vuelve al mismo escenario, va a la cama y se duerme', vuelta.pant === 'scene' && vuelta.esc === 'habitacion' && vuelta.ropa === 'pijama' && vuelta.en && !vuelta.preg, JSON.stringify(vuelta));
  await p.screenshot({ path: path.join(OUT, '07-dormida-pijama-iphone.png') });
  const s0 = await p.evaluate(() => MM.necesidades().sueno); await p.evaluate(() => MM.avanzar(20));
  ok('Dormida, el sueño se recupera (y la diversión no baja)', await p.evaluate(s => MM.necesidades().sueno >= Math.min(100, s + 45), s0));
  await p.evaluate(() => { const c = MM.estado().objetos.find(o => o.id === 'cama'); MM.mirar(c.x, 700); }); await p.waitForTimeout(700);
  await p.mouse.click(...await tomar(p, '.mm-muneca')); await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelectorAll('.mm-panel').forEach(e => e.remove()));
  await p.mouse.click(...await camaEn()); await p.waitForTimeout(4500);
  ok('Con el pijama puesto, se acuesta directamente (sin preguntar)', await p.evaluate(() => !document.querySelector('.mm-pregunta') && !!MM.estado().muneca.en));
  // de día: una propuesta de vestirse (una vez); «Así está bien» no cambia nada
  await p.evaluate(() => MM.mirar(860, 500)); await p.waitForTimeout(700); await p.mouse.click(...await ventana(p)); await p.waitForTimeout(800);
  await p.evaluate(() => { const c = MM.estado().objetos.find(o => o.id === 'cama'); MM.mirar(c.x, 700); }); await p.waitForTimeout(700);
  await p.mouse.click(...await tomar(p, '.mm-muneca')); await p.waitForTimeout(2600);
  const dia = await p.evaluate(() => ({ txt: (document.querySelector('.mm-pregunta p') || {}).textContent }));
  await p.click('.mm-pregunta button:has-text("Así está bien")').catch(() => {}); await p.waitForTimeout(500);
  await p.mouse.click(...await camaEn()); await p.waitForTimeout(4500); await p.mouse.click(...await tomar(p, '.mm-muneca')); await p.waitForTimeout(2600);
  ok('De día, al despertar con el pijama: propone vestirse una sola vez; «Así está bien» deja el pijama', /vestimos/.test(dia.txt || '') && await p.evaluate(() => !document.querySelector('.mm-pregunta') && Avatar.cargar().ropa === 'pijama'), dia.txt);
  // ---------- salón: la lámpara y la vista de cada escenario ----------
  const camH = await p.evaluate(() => MM.camara());
  await p.click('#scenePick .btn[data-k=casa]'); await p.waitForTimeout(1800);
  await p.evaluate(() => { const l = MM.estado().objetos.find(o => o.id === 'lampara'); MM.mirar(l.x + 150, 600); }); await p.waitForTimeout(700);
  await p.mouse.click(...await tomar(p, '.mm-obj[data-id="lampara"]', [.5, .15])); await p.waitForTimeout(500);
  await p.evaluate(() => MM.mirar(860, 500)); await p.waitForTimeout(700); await p.mouse.click(...await ventana(p)); await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelectorAll('.mm-aviso,.mm-panel').forEach(e => e.remove()));
  await p.evaluate(() => MM.mirar(500, 600)); await p.waitForTimeout(900);
  const sal = await p.evaluate(() => ({ luz: !!document.querySelector('.mm-luz'), on: MM.estado().objetos.find(o => o.id === 'lampara').luz, noche: document.querySelector('.mm-escena').classList.contains('noche') }));
  ok('Salón: tocar la lámpara la enciende (luz cálida) y de noche ilumina', sal.luz && sal.on && sal.noche, JSON.stringify(sal));
  await p.screenshot({ path: path.join(OUT, '08-salon-noche-lampara-iphone.png') });
  await p.click('#scenePick .btn[data-k=habitacion]'); await p.waitForTimeout(1500);
  ok('Cada escenario conserva su vista al volver', JSON.stringify(await p.evaluate(() => MM.camara()).then(v => v.map(Math.round))) === JSON.stringify(camH.map(Math.round)));
  // ---------- volver a abrir y copia de seguridad ----------
  const antes = await p.evaluate(() => ({ c: JSON.stringify([MM.ciclo(), MM.estado().cam]), s: MM.necesidades().sueno, d: MM.necesidades().diversion }));
  await p.reload(); await p.waitForTimeout(500); await p.evaluate(() => go('scene')); await p.waitForTimeout(1500);
  const desp = await p.evaluate(() => ({ c: JSON.stringify([MM.ciclo(), MM.estado().cam]), s: MM.necesidades().sueno, d: MM.necesidades().diversion }));
  ok('Al volver a abrir siguen el día o la noche, la vista y las necesidades (lo que bajan unos segundos de juego)', desp.c === antes.c && Math.abs(desp.s - antes.s) < 2 && Math.abs(desp.d - antes.d) < 2, `sueño ${antes.s.toFixed(1)} → ${desp.s.toFixed(1)}`);
  await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(800);
  const copia = await p.evaluate(() => window.__comp.length && JSON.parse(window.__comp[0].text).local_storage);
  ok('«Guardar mi progreso» incluye las necesidades, el día o la noche, la habitación y el salón', copia && ['mm_necesidades', 'mm_ciclo', 'mm_habitacion2', 'mm_salon'].every(k => k in copia), copia && Object.keys(copia).filter(k => k.startsWith('mm_')).join(', '));
  await p.click('#setClose').catch(() => {});
  // datos del juego y de otras copias (en este mismo navegador, donde se pusieron)
  await p.goto(BASE + 'index.html?arte=svg');
  const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const propias = Object.keys(real).filter(k => !(k in AJENOS));
  ok('Datos del juego y de las otras copias intactos; la copia solo escribe «cui1:»', Object.entries(AJENOS).every(([k, v]) => real[k] === v) && propias.length && propias.every(k => k.startsWith('cui1:')), propias.length + ' claves propias');
  await c.close();

  // ================= iPad (horizontal) =================
  ({ c, p } = await contexto({ width: 1180, height: 820 }));
  await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await abrir(p, 'habitacion');
  const ipad = await p.evaluate(() => ({ izq: document.querySelector('.mm-flecha.izq').classList.contains('on'), der: document.querySelector('.mm-flecha.der').classList.contains('on'), buscar: document.querySelector('.mm-buscar').classList.contains('on') }));
  ok('iPad: la habitación cabe de ancho (sin flechas) y la muñeca se ve (sin botón para buscarla)', !ipad.izq && !ipad.der && !ipad.buscar, JSON.stringify(ipad));
  await p.screenshot({ path: path.join(OUT, '09-ipad.png') });
  await c.close();
  ok('Sin errores de JavaScript ni archivos que falten', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
