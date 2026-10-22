#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia conjunta: Pintar + Heladería + logros (Chromium; iPhone y iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/prueba-conjunta-2026-10-22/prueba-conjunta.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · referencias conservadas: el código de Pintar y de la Heladería de la copia es el de sus referencias (708c2f2 y
       7aeb5b7), salvo los ajustes documentados (pedidos sin premios y foto de los premios);
     · datos propios («con1:»); el juego y las otras copias, intactos;
     · datos que ya existían (estrellas, dibujos, monedas, pedidos servidos, niveles, voz, tono, personaje, escenas):
       se leen y no se pierden ni se cambian al jugar (solo suman lo que toca);
     · voz con tono natural (1,00) aunque haya un tono agudo guardado, sin tocar la clave «tone»; 🔇 la silencia;
     · Pintar, Heladería y «Mis logros» en iPhone e iPad (vertical y horizontal): todo a la vista, 44 px o más;
     · Pintar: deshacer/rehacer, girar, guardar sin duplicar y sin borrar dibujos, lámina nueva con el cubo;
     · Heladería: pedido correcto = +1 ⭐, monedas y servidos (economía de hoy); foto del juego libre;
     · logros: retos, tarea confirmada con código, cofres a los 3 y 6 logros; premios en la Pintar y la Heladería NUEVAS
       (sabor arcoíris: se sirve, se fotografía, nunca sale en pedidos; color dorado: pinta y cabe en la paleta);
     · copia de seguridad: guarda todo (también logros y nivel de la Heladería); importar dos veces no duplica;
     · sin errores de JavaScript.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const COPIA = BASE + 'docs/propuestas/prueba-conjunta-2026-10-22/index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-conjunta-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const errores = [];
const DEV = { 'iPhone vertical': [390, 844, true], 'iPhone horizontal': [844, 390, true], 'iPad vertical': [820, 1180, false], 'iPad horizontal': [1180, 820, false] };
const AJENOS = { stars: '50', gal: '[]', iceCoins: '1', 'pin1:stars': '3', 'hel1:stars': '4', 'rec1:logros': '{"v":1,"lista":[]}' };
// iPhone instalado simulado + hoja de compartir + voz simulada (para ver tono y velocidad)
const INIT = () => { window.__comp = []; window.__voz = []; const mm = window.matchMedia.bind(window);
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true }); navigator.canShare = d => !!(d && d.files);
  navigator.share = async d => { if (!navigator.userActivation.isActive) throw new DOMException('sin toque', 'NotAllowedError'); window.__comp.push({ text: await d.files[0].text() }); };
  const v = [{ name: 'Mónica', lang: 'es-ES', voiceURI: 'com.apple.voice.compact.es-ES.Monica', localService: true, default: true }];
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => v, cancel() {}, speak(u) { window.__voz.push({ t: u.text, p: u.pitch, r: u.rate }); }, onvoiceschanged: null } });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; }; };
async function pagina(b, d = DEV['iPhone vertical'], limpiar = true) {
  const c = await b.newContext({ viewport: { width: d[0], height: d[1] }, hasTouch: true, isMobile: d[2], deviceScaleFactor: 2 });
  await c.addInitScript(INIT); const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
  await p.goto(COPIA); if (limpiar) { await p.evaluate(() => localStorage.clear()); await p.reload(); } await p.waitForTimeout(400); return { c, p };
}
const LS = (p, ks) => p.evaluate(ks => Object.fromEntries(ks.map(k => [k, localStorage.getItem(k)])), ks);
const total = p => p.evaluate(() => Logros.total());
async function trazo(p, y, x0 = .15, x1 = .85) { const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON());
  await p.mouse.move(r.x + r.width * x0, r.y + r.height * y); await p.mouse.down(); await p.mouse.move(r.x + r.width * x1, r.y + r.height * y, { steps: 8 }); await p.mouse.up(); }
const huella = p => p.evaluate(() => { const d = pctx.getImageData(0, 0, pc.width, pc.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0; return h; });
async function reto(p, cual) { await p.evaluate(() => go('logros')); await p.waitForTimeout(250); await p.click(`#lgRetos [data-reto="${cual}"]`); await p.waitForTimeout(300);
  for (let r = 0; r < 3; r++) { await p.waitForFunction(() => document.querySelectorAll('#rtOpts .qopt').length === 3 && !document.querySelector('#rtOpts .qopt.ok')); await p.click('#rtOpts .qopt[data-ok="1"]'); await p.waitForTimeout(1600); }
  await p.waitForSelector('#rtVolver'); }
async function servir(p, n) { await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(400);
  for (let i = 0; i < n; i++) { await p.waitForFunction(() => ICE.order && !ICE.busy); const o = await p.evaluate(() => ICE.order);
    await p.click('#iceReset'); await p.click(`#iceBases .btn[data-k="${o.base}"]`); for (const f of o.scoops) await p.locator('#iceFlavs .fl').nth(f).click();
    for (const t of o.tops) await p.click(`#iceTops .btn[data-i="${t}"]`); await p.click('#iceGive'); await p.waitForTimeout(150); await p.evaluate(() => iceNew()); } }

(async () => {
  // ---------- 0. referencias conservadas (comparación de código) ----------
  {
    const leer = f => fs.readFileSync(path.join(RAIZ, 'docs/propuestas', f), 'utf8');
    const corte = (t, a, z) => { const i = t.indexOf(a), j = t.indexOf(z, i + a.length); return i >= 0 && j > i ? t.slice(i, j) : null; };
    const con = leer('prueba-conjunta-2026-10-22/index.html'), pin = leer('pintar-2026-10-21/index.html'), hel = leer('heladeria-2026-10-21/index.html');
    const P0 = '/* ================= PINTAR ================= */';
    const pinRef = corte(pin, P0, '/* ================= HELADERÍA'), pinCon = corte(con, P0, '/* ================= HELADERÍA');
    ok('Pintar: el código es idéntico al de su referencia (708c2f2)', pinRef && pinRef === pinCon, `${pinRef && pinRef.length} caracteres`);
    const cssP = t => corte(t, '/* ---------- Pintar · copia de prueba', '</style>'), htmlP = t => corte(t, '<section class="screen" id="paint">', '</section>');
    ok('Pintar: estilos y pantalla idénticos a la referencia', cssP(pin) === cssP(con) && htmlP(pin) === htmlP(con));
    const H0 = '/* ================= HELADERÍA (copia 21/10', H1 = '/* ================= VESTIR';
    let helRef = corte(hel, H0, H1); const helCon = corte(con, H0, H1);
    helRef = helRef.replace("{e:'🍫',n:'chocolate'}];", "{e:'🍫',n:'chocolate'}];\nconst NB_FLAV_BASE=FLAV.length,NB_TOPS_BASE=TOPS.length;   /* prueba conjunta: los pedidos no usan los premios */")
      .split('rnd(FLAV.length)').join('rnd(NB_FLAV_BASE)').split('rnd(TOPS.length)').join('rnd(NB_TOPS_BASE)').replace('x.fillStyle=FLAV[f].c', 'x.fillStyle=FLAV[f].foto||FLAV[f].c');
    ok('Heladería: el código es el de su referencia (7aeb5b7) salvo los dos ajustes documentados', helRef === helCon, `${helCon && helCon.length} caracteres`);
    const cssH = t => corte(t, '/* ---------- Heladería · copia de prueba', '</style>'), htmlH = t => corte(t, '<section class="screen" id="ice">', '</section>');
    ok('Heladería: estilos y pantalla idénticos a la referencia', cssH(hel) === cssH(con) && htmlH(hel) === htmlH(con));
    const git = c => execSync(c, { cwd: RAIZ }).toString().trim();
    ok('Las carpetas de referencia no han cambiado (salvo sus LEEME)', git("git diff --stat 708c2f2 -- docs/propuestas/pintar-2026-10-21 ':!docs/propuestas/pintar-2026-10-21/LEEME.md'") === '' &&
      git("git diff --stat 7aeb5b7 -- docs/propuestas/heladeria-2026-10-21 ':!docs/propuestas/heladeria-2026-10-21/LEEME.md'") === '' && git('git status --porcelain -- docs/propuestas/pintar-2026-10-21 docs/propuestas/heladeria-2026-10-21 index.html progreso.js sw.js avatar') === '');
  }
  const b = await pw.chromium.launch();
  // ---------- 1. datos propios y datos que ya existían ----------
  {
    const { c, p } = await pagina(b, DEV['iPhone vertical'], false);
    await p.goto(BASE + 'index.html?arte=svg'); await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
    await p.goto(COPIA); await p.waitForTimeout(300);
    const dib = await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 40; c.height = 30; const x = c.getContext('2d'); x.fillStyle = '#ff8fbf'; x.fillRect(0, 0, 40, 30); return c.toDataURL('image/png'); });
    const PREVIOS = { stars: '37', gal: JSON.stringify([dib, dib]), iceServed: '9', iceCoins: '5', lv_contar: '2', lv_heladeria: '{"L":1,"ok":2}', tone: '1', voice: 'com.apple.voice.compact.es-ES.Monica',
      sound: 'true', doll: '{"skin":3,"hc":3,"hs":2}', sc_casa: '[{"e":"🐶","x":50,"y":50,"s":13,"f":1}]', scKey: '"casa"', avatar: '{"v":1,"piel":"clara","ropa":"vestido"}' };
    await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, PREVIOS); await p.reload(); await p.waitForTimeout(500);
    ok('Lee los datos que ya había: ⭐ 37, 2 dibujos, 🪙 5 y nivel 2 de la Heladería', await p.textContent('.sc') === '37' && await p.evaluate(() => { go('gallery'); return true; }) &&
      (await p.waitForTimeout(300), await p.$$eval('#galgrid button', x => x.length)) === 2 && await p.evaluate(() => (go('ice', 'pedidos'), true)) &&
      (await p.waitForTimeout(500), await p.textContent('#coins')) === '5' && /^Nivel 2/.test(await p.textContent('#iceLv')));
    // jugar un poco de todo
    await servir(p, 1); await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(400); await trazo(p, .4); await p.click('#saveBtn'); await p.waitForTimeout(200);
    await reto(p, 'contar');
    const d = await LS(p, Object.keys(PREVIOS));
    const iguales = ['lv_contar', 'tone', 'voice', 'sound', 'doll', 'sc_casa', 'scKey', 'avatar'].filter(k => d[k] !== PREVIOS[k]);
    ok('Al jugar, los datos que no tocan no cambian (voz, tono, personaje, escenas, niveles de Pensar…)', !iguales.length, iguales.join(', '));
    ok('Y los que sí tocan solo suman: ⭐ 38, 🪙 +bolas, 10 servidos, 3 dibujos (los 2 de antes intactos)', d.stars === '38' && +d.iceCoins > 5 && d.iceServed === '10' &&
      JSON.parse(d.gal).length === 3 && JSON.parse(d.gal).slice(1).every(u => u === dib));
    ok('El reto da logros, no estrellas (⭐ sigue en 38, 🏅 1)', d.stars === '38' && await total(p) === 1);
    await p.goto(BASE + 'index.html?arte=svg');
    const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
    ok('El juego y las otras copias (pin1, hel1, rec1) siguen intactos; la copia solo escribe «con1:»', Object.entries(AJENOS).every(([k, v]) => real[k] === v) &&
      Object.keys(real).filter(k => !(k in AJENOS)).every(k => k.startsWith('con1:')));
    await c.close();
  }
  // ---------- 2. voz natural y silencio ----------
  {
    const { c, p } = await pagina(b); await p.evaluate(() => { localStorage.setItem('tone', '2'); }); await p.reload(); await p.waitForTimeout(400);
    await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(800);
    const v = await p.evaluate(() => window.__voz);
    ok('Voz con tono natural (1,00) y velocidad 0,95 aunque haya guardado un tono agudo', v.length && v.every(x => x.p === 1 && x.r === .95), `${v.length} frases`);
    await p.evaluate(() => go('home')); await p.tap('#setBtn'); await p.waitForTimeout(400);
    const tonos = await p.$$eval('#toneRow button', x => x.map(e => e.textContent)); await p.tap('#toneRow button'); await p.waitForTimeout(100);
    ok('Ajustes: solo «🙂 Natural»; tocarlo no cambia la clave «tone»', tonos.join() === '🙂 Natural' && await p.evaluate(() => localStorage.getItem('tone')) === '2');
    await p.tap('#setClose'); await p.tap('#soundBtn'); const n0 = await p.evaluate(() => window.__voz.length);
    await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(800);
    ok('🔇 silencia la voz', await p.evaluate(() => window.__voz.length) === n0 && await p.evaluate(() => localStorage.getItem('sound')) === 'false');
    await p.evaluate(() => go('home')); await p.tap('#soundBtn'); await p.evaluate(() => go('ice', 'libre')); await p.waitForTimeout(800);
    ok('🔊 la vuelve a activar', await p.evaluate(() => window.__voz.length) > n0);
    await c.close();
  }
  // ---------- 3. pantallas ----------
  for (const [n, d] of Object.entries(DEV)) {
    const { c, p } = await pagina(b, d);
    const medir = sel => p.evaluate(sel => { const els = [...document.querySelectorAll(sel)].filter(e => e.offsetParent && !e.hidden), R = els.map(e => e.getBoundingClientRect());
      let sol = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) sol++; }
      return { n: els.length, min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))), dentro: R.every(r => r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), sol }; }, sel);
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(500); const m1 = await medir('#paint .ptop .btn, #sizes .sz, #colors .sw');
    await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(500); const m2 = await medir('#ice .btn, #ice .fl');
    await p.evaluate(() => go('ice', 'libre')); await p.waitForTimeout(400); const m3 = await medir('#ice .btn, #ice .fl');
    ok(`${n}: Pintar (28) y Heladería (20 + 20) a la vista, de 44 px o más, sin solaparse`, m1.n === 28 && m2.n === 20 && m3.n === 20 && [m1, m2, m3].every(m => m.dentro && !m.sol && m.min >= 44), [m1, m2, m3].map(m => m.min).join('/') + ' px');
    await p.screenshot({ path: path.join(OUT, `heladeria-${n.replace(' ', '-').toLowerCase()}.png`) });
    await c.close();
  }
  // ---------- 4. Pintar, Heladería, logros y premios ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(400);
    const h0 = await huella(p); await trazo(p, .3); const h1 = await huella(p); await trazo(p, .6);
    await p.click('#undoBtn'); const u = await huella(p); await p.click('#redoBtn'); const r = await huella(p);
    await p.setViewportSize({ width: 844, height: 390 }); await p.waitForTimeout(300); await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300);
    ok('Pintar: deshacer, rehacer y girar sin perder el dibujo', u === h1 && r !== h1 && r !== h0 && await huella(p) === r);
    await p.click('#saveBtn'); await p.click('#saveBtn'); await trazo(p, .8); await p.evaluate(() => go('m-paint')); await p.waitForTimeout(300);
    ok('Pintar: guardar dos veces y salir deja un solo dibujo', await p.evaluate(() => JSON.parse(localStorage.getItem('gal')).length) === 1);
    await p.evaluate(() => go('tpl')); await p.waitForTimeout(600); await p.click('#tplgrid button[data-arg="n:conejito"]');
    await p.waitForFunction(() => P.tpl === 'n:conejito' && P.zn, null, { timeout: 15000 });
    const q = await p.evaluate(() => { const Z = P.zn, W = Z.W, R = 8; let best = 0, bl = 0; const borde = Z.lab[W * 10 + 10]; for (let l = 1; l < Z.sz.length; l++) if (l !== borde && Z.sz[l] > best) { best = Z.sz[l]; bl = l; }
      for (let y = R; y < Z.lab.length / W - R; y += 2) for (let x = R; x < W - R; x += 2) { const k = y * W + x; if (Z.lab[k] === bl && Z.lab[k - R] === bl && Z.lab[k + R] === bl && Z.lab[k - R * W] === bl && Z.lab[k + R * W] === bl) return [x, y, W]; } });
    const rc = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON()); const hl = await huella(p);
    await p.mouse.click(rc.x + q[0] * rc.width / q[2], rc.y + q[1] * rc.width / q[2]); await p.waitForTimeout(150);
    ok('Pintar: las láminas nuevas se abren al tocarlas y se pintan con el cubo', await huella(p) !== hl);
    // Heladería: economía de hoy
    const e0 = await LS(p, ['stars', 'iceCoins', 'iceServed']); await servir(p, 1); const e1 = await LS(p, ['stars', 'iceCoins', 'iceServed']);
    ok('Heladería: pedido correcto = +1 ⭐, monedas y +1 servido', +e1.stars === (+e0.stars || 0) + 1 && +e1.iceCoins > (+e0.iceCoins || 0) && +e1.iceServed === (+e0.iceServed || 0) + 1);
    // logros: 2 retos + tarea → cofre 1 → sabor arcoíris
    await p.evaluate(() => { window.__hoy = '2026-10-22'; }); await reto(p, 'contar'); await reto(p, 'colores');
    await p.evaluate(() => go('logros')); await p.waitForTimeout(200); await p.click('#lgTareas .thecho[data-t="juguetes"]');
    await p.click('#lgAdultos'); for (const k of '24682468') await p.click(`#adBox .adk[data-k="${k}"]`);
    const av = await p.evaluate(() => Logros.leerAvisos()[0].id); await p.click(`#adBox .adconf[data-id="${av}"]`); await p.click('#adSalir'); await p.waitForTimeout(500);
    ok('Logros: 2 retos + 1 tarea confirmada = 3 y el cofre 1 listo', await total(p) === 3 && await p.isVisible('#lgCamino .cofre.listo[data-n="1"]'));
    await p.click('#lgCamino .cofre[data-n="1"]', { force: true }); await p.waitForSelector('#cfBox .cfpremio'); await p.click('#cfBox .cfpremio[data-id="prov-sabor-arcoiris"]'); await p.waitForTimeout(300);
    await p.evaluate(() => go('ice', 'libre')); await p.waitForTimeout(400);
    const vis = await p.evaluate(() => [...document.querySelectorAll('#ice [data-premio]')].filter(b => !b.hidden).map(b => b.dataset.premio));
    await p.click('#iceBases .btn[data-k="cono"]'); for (let i = 0; i < 4; i++) await p.click('#iceFlavs .fl[data-premio="prov-sabor-arcoiris"]');
    await p.click('#iceFlavs .fl[data-premio="prov-sabor-arcoiris"]');
    const bl = await p.evaluate(() => ICE.build.scoops.length); await p.click('#iceUndo'); const bl2 = await p.evaluate(() => ICE.build.scoops.length);
    const g0 = await p.evaluate(() => JSON.parse(localStorage.getItem('gal')).length); await p.click('#icePhoto'); await p.waitForTimeout(200);
    ok('Premio «sabor arcoíris» en la Heladería nueva: hasta 4 bolas, «quitar la última» y foto', vis.join() === 'prov-sabor-arcoiris' && bl === 4 && bl2 === 3 && await p.evaluate(() => JSON.parse(localStorage.getItem('gal')).length) === g0 + 1);
    await p.screenshot({ path: path.join(OUT, 'heladeria-sabor-premio.png') });
    await p.evaluate(() => go('ice', 'pedidos')); await p.waitForTimeout(300);
    ok('Los pedidos nunca piden un premio (400 pedidos en todos los niveles)', await p.evaluate(() => { let mal = 0; for (let L = 0; L < 6; L++) { ICE.nv.L = L; for (let i = 0; i < 70; i++) { const o = crearPedido(); if (o.scoops.some(f => f >= 6) || o.tops.some(t => t >= 5)) mal++; } } return mal; }) === 0);
    // cofre 2 → color dorado
    for (const [dia, ret] of [['2026-10-23', ['contar', 'colores']], ['2026-10-24', ['contar']]]) { await p.evaluate(d => { window.__hoy = d; }, dia); for (const r of ret) await reto(p, r); }
    await p.evaluate(() => go('logros')); await p.waitForTimeout(300); await p.click('#lgCamino .cofre[data-n="2"]', { force: true }); await p.waitForSelector('#cfBox .cfpremio');
    await p.click('#cfBox .cfpremio[data-id="prov-color-dorado"]'); await p.waitForTimeout(300);
    for (const [n, d] of Object.entries(DEV)) {
      await p.setViewportSize({ width: d[0], height: d[1] }); await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(400);
      const m = await p.evaluate(() => { const els = [...document.querySelectorAll('#paint .ptop .btn, #sizes .sz, #colors .sw')].filter(e => !e.hidden), R = els.map(e => e.getBoundingClientRect());
        return { n: els.length, dentro: R.every(r => r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))) }; });
      ok(`${n}: con el color dorado, los 16 colores y todo lo demás siguen a la vista`, m.n === 29 && m.dentro && m.min >= 44, `mín. ${m.min} px`);
    }
    await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => go('paint', 'free')); await p.waitForTimeout(400);
    await p.click('#colors .sw[data-premio="prov-color-dorado"]'); await trazo(p, .5);
    ok('Premio «color dorado» en la Pintar nueva: se elige (✓) y pinta en dorado', await p.evaluate(() => document.querySelector('#colors .sw.premio').classList.contains('sel') && P.color === '#e0b030') &&
      await p.evaluate(() => { const d = pctx.getImageData(0, 0, pc.width, pc.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - 0xe0) < 6 && Math.abs(d[i + 1] - 0xb0) < 6 && Math.abs(d[i + 2] - 0x30) < 6) n++; return n; }) > 500);
    await p.screenshot({ path: path.join(OUT, 'pintar-color-premio.png') });
    // ---------- 5. copia de seguridad ----------
    await p.evaluate(() => go('home')); await p.waitForTimeout(200); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(600); await p.tap('#setClose');
    const copia = JSON.parse((await p.evaluate(() => window.__comp))[0].text), ls = copia.local_storage;
    ok('«Guardar mi progreso» guarda dibujos, estrellas, Heladería (con su nivel), logros y premios', ['gal', 'stars', 'iceCoins', 'iceServed', 'lv_heladeria', 'logros', 'premios', 'tareas'].every(k => k in ls) && JSON.parse(ls.logros).lista.length === 6);
    fs.writeFileSync(path.join(OUT, 'copia-conjunta.json'), JSON.stringify(copia));
    const importar = async () => { await p.evaluate(() => go('home')); await p.waitForTimeout(200); await p.tap('#setBtn'); await p.waitForTimeout(500);
      const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.tap('#bkRecuperar')]); await fc.setFiles(path.join(OUT, 'copia-conjunta.json')); await p.waitForTimeout(500); await p.tap('#bkConfirmar'); await p.waitForTimeout(2700); };
    const antes = await LS(p, ['gal', 'stars', 'logros', 'premios']); await importar(); await importar();
    const despues = await LS(p, ['gal', 'stars', 'logros', 'premios']);
    ok('Importar la copia dos veces no duplica nada (dibujos, estrellas, logros, cofres)', ['gal', 'stars', 'logros', 'premios'].every(k => antes[k] === despues[k]) && await total(p) === 6 && await p.evaluate(() => Logros.leerCofres().length) === 2);
    await c.close();
  }
  // ---------- 6. Mis logros a la vista ----------
  for (const [n, d] of Object.entries(DEV)) {
    const { c, p } = await pagina(b, d); await p.evaluate(() => go('logros')); await p.waitForTimeout(400);
    const m = await p.evaluate(() => { const R = [...document.querySelectorAll('#logros .btn, #logros .cofre')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect());
      return R.every(r => r.left >= -1 && r.right <= innerWidth + 1) && Math.min(...R.map(r => Math.min(r.width, r.height))) >= 44 && document.documentElement.scrollWidth <= innerWidth + 1; });
    ok(`${n}: «Mis logros» sin desbordar y con botones de 44 px o más`, m); await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
