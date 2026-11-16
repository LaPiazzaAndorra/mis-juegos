#!/usr/bin/env node
/* =====================================================================
   Prueba automática de «Dibujos por partes» (4.ª entrega de Pensar, ejemplos; Chromium, iPhone e iPad simulados)
   Unir puntos y Repasar por etapas con el búho, la furgoneta y el unicornio; seguir donde se dejó; pintar y guardar;
   copia de seguridad.

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/pensar-2026-11-04/prueba-etapas.js [http://localhost:8765/] [carpeta-capturas]
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const CARP = 'docs/propuestas/pensar-2026-11-04/', COPIA = BASE + CARP + 'index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-etapas-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const errores = [];
const DEV = { 'iPhone vertical': [390, 844, true], 'iPhone horizontal': [844, 390, true], 'iPad vertical': [820, 1180, false], 'iPad horizontal': [1180, 820, false] };
const INIT = () => { window.__comp = []; window.__voz = []; const mm = window.matchMedia.bind(window);
  window.matchMedia = q => /standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q);
  Object.defineProperty(navigator, 'standalone', { value: true }); navigator.canShare = d => !!(d && d.files);
  navigator.share = async d => { if (!navigator.userActivation.isActive) throw new DOMException('sin toque', 'NotAllowedError'); window.__comp.push({ text: await d.files[0].text() }); };
  const v = [{ name: 'Mónica', lang: 'es-ES', voiceURI: 'monica', localService: true, default: true }];
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => v, cancel() {}, speak(u) { window.__voz.push(u.text); }, onvoiceschanged: null } });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; }; };
async function pagina(b, d = DEV['iPhone vertical']) {
  const c = await b.newContext({ viewport: { width: d[0], height: d[1] }, hasTouch: true, isMobile: d[2], deviceScaleFactor: 2 });
  await c.addInitScript(INIT); const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message)); p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await p.goto(COPIA); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400); return { c, p };
}
const E = p => p.evaluate(() => { const e = ETAPAS.et; return { e: e.e, j: e.j, i: e.i, prog: Math.round(e.prog), hecho: e.hecho, sig: ETAPAS.numSig(), total: e.total }; });
// pantalla ← coordenadas del dibujo
const aPant = (p, pts) => p.evaluate(pts => { const g = document.querySelector('#etSvg'), M = g.getScreenCTM(); return pts.map(q => { const pt = g.createSVGPoint(); pt.x = q[0]; pt.y = q[1]; const r = pt.matrixTransform(M); return [r.x, r.y]; }); }, pts);
async function tocarSig(p) { const q = await p.evaluate(() => { const t = ETAPAS.actual(); return t ? t.pts[ETAPAS.et.i] : null; }); if (!q) { await p.waitForTimeout(200); return; } const [s] = await aPant(p, [q]); await p.mouse.click(...s); }
async function unirHasta(p, cond) { for (let n = 0; n < 200; n++) { if (await p.evaluate(cond)) return true; if (await p.evaluate(() => ETAPAS.et.hecho)) return false;
  if (await p.evaluate(() => ETAPAS.et.ocupado)) { await p.waitForTimeout(150); continue; } await tocarSig(p); await p.waitForTimeout(40); } return false; }
// repasar: puntos de pantalla a lo largo del trazo actual (desplazados «off» px)
const camino = (p, a, b, off = 0, n = 40) => p.evaluate(([a, b, off, n]) => {
  const et = ETAPAS.et, T = et.rtr[et.j], g = document.querySelector('#etSvg'), M = g.getScreenCTM(), out = [];
  for (let i = 0; i <= n; i++) { const s = T.L * (a + (b - a) * i / n), q = T.guia.getPointAtLength(s), q2 = T.guia.getPointAtLength(Math.min(T.L, s + 3));
    const pt = g.createSVGPoint(); pt.x = q.x; pt.y = q.y; const r = pt.matrixTransform(M); const tx = q2.x - q.x, ty = q2.y - q.y, m = Math.hypot(tx, ty) || 1;
    out.push([r.x + ty / m * off, r.y - tx / m * off]); } return out; }, [a, b, off, n]);
async function arrastrar(p, pts) { await p.mouse.move(...pts[0]); await p.mouse.down(); for (const q of pts.slice(1)) await p.mouse.move(...q, { steps: 2 }); await p.mouse.up(); await p.waitForTimeout(60); }
async function repasarTodo(p, off = 0) { for (let n = 0; n < 60; n++) { const s = await p.evaluate(() => ({ h: ETAPAS.et.hecho, o: ETAPAS.et.ocupado }));
  if (s.h) break; if (s.o) { await p.waitForTimeout(200); continue; } await arrastrar(p, await camino(p, 0, 1, off)); } await p.waitForTimeout(700); }

(async () => {
  {
    const git = c => execSync(c, { cwd: RAIZ }).toString().trim();
    execSync('python3 ' + CARP + 'preparar_copia.py', { cwd: RAIZ });
    const h = fs.readFileSync(path.join(RAIZ, CARP, 'index.html'), 'utf8');
    ok('La copia carga etapas.css, ilustraciones.js y etapas.js después de Repasar', /repasar\.js"><\/script>\n<link rel="stylesheet" href="docs\/propuestas\/pensar-2026-11-04\/etapas\.css">\n<script src="docs\/propuestas\/pensar-2026-11-04\/ilustraciones\.js"><\/script>\n<script src="docs\/propuestas\/pensar-2026-11-04\/etapas\.js"><\/script>/.test(h));
    const fuera = git(`git status --porcelain -- . ':!${CARP}' ':!docs/propuestas/lectura-2026-11-17/'`);
    ok('Fuera de su carpeta (y de la capa común de lectura) no cambia nada (ni main, ni el juego, ni Pintar, ni los archivos de avatar-creador)', fuera === '', fuera.slice(0, 200));
    ok('La capa común de lectura (lectura-2026-11-17) es idéntica a la de avatar-creador 4dd3a80', git('git diff --stat 4dd3a80 -- docs/propuestas/lectura-2026-11-17/') === '' && git('git status --porcelain -- docs/propuestas/lectura-2026-11-17/').split('\n').every(l => !l || /^[AM] /.test(l)));
  }
  const b = await pw.chromium.launch();
  // ---------- 1. menú y elegir dibujo ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('m-paint')); await p.waitForTimeout(300);
    const mp = await p.$$eval('#m-paint .big', x => x.map(e => e.lastChild.textContent.trim()));
    ok('Menú Pintar: lo de antes igual y, al final, «Dibujos por partes»', mp.join('|').replace('COLOREAR', 'Colorear dibujos') === 'Hoja en blanco|Colorear dibujos|Mis dibujos|Unir puntos|Repasar|Dibujos por partes', mp.join('|'));
    await p.click('#m-paint [data-go="grandes"]'); await p.waitForTimeout(500);
    const gr = await p.evaluate(() => ({ cartas: document.querySelectorAll('.grCarta').length, botones: document.querySelectorAll('.grCarta .grModo').length,
      misterio: document.querySelectorAll('.grCarta .grMisterio').length, emoji: /\p{Extended_Pictographic}/u.test(document.querySelector('#grLista').textContent), voz: window.__voz.join(' ') }));
    ok('Tres dibujos, cada uno con dos maneras (unir puntos y repasar); sin terminar se ven en misterio (solo la primera parte y «?»); sin emojis', gr.cartas === 3 && gr.botones === 6 && gr.misterio === 3 && !gr.emoji && /Elige un dibujo/.test(gr.voz), JSON.stringify(gr));
    await p.screenshot({ path: path.join(OUT, 'elegir.png') });
    const datos = await p.evaluate(() => Object.values(ILUSTRACIONES).map(il => ({ etapas: il.etapas.length, trazos: il.etapas.reduce((a, e) => a + e.t.length, 0), extra: il.extra.length })));
    ok('Ilustraciones completas: 5 o 6 partes, 7 trazos o más y detalles interiores en cada una', datos.every(d => d.etapas >= 5 && d.trazos >= 7 && d.extra >= 10), JSON.stringify(datos));
    await c.close();
  }
  // ---------- 2. Unir puntos por etapas (búho, 45 puntos) ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => { localStorage.setItem('lv_etapas', JSON.stringify({ v: 1, nivel: 1 })); go('etapa', 'buho:pu'); }); await p.waitForTimeout(700);
    const s0 = await p.evaluate(() => ({ total: ETAPAS.et.total, vis: document.querySelectorAll('#etSvg .puPunto').length, primera: ETAPAS.jugables(0).reduce((a, t) => a + t.pts.length, 0),
      sig: document.querySelectorAll('#etSvg .puPunto.sig').length, pasos: [...document.querySelectorAll('.etPaso')].map(x => x.className.replace('etPaso', '').trim() || '-').join(','), voz: window.__voz.join(' ') }));
    ok(`Con 45 puntos: ${s0.total} en total, pero en pantalla solo los de la primera parte (${s0.vis}); no se amontonan`, s0.total >= 40 && s0.total <= 50 && s0.vis === s0.primera && s0.vis < 20, JSON.stringify(s0));
    ok('Con 45, el siguiente punto no brilla (ayuda a petición); la tira enseña la parte de ahora y las que faltan', s0.sig === 0 && s0.pasos === 'ahora,-,-,-,-' && /Empieza en el uno/.test(s0.voz), JSON.stringify(s0));
    // separación de puntos y números
    const sep = await p.evaluate(() => { const u = 1080 / document.querySelector('#etSvg').getBoundingClientRect().width; let min = 1e9;
      ETAPAS.jugables(0).forEach(t => t.pts.forEach((a, i) => t.pts.forEach((q, j) => { if (j > i) min = Math.min(min, Math.hypot(a[0] - q[0], a[1] - q[1]) / u); }))); return Math.round(min); });
    ok('Puntos separados al menos 20 px en el iPhone (cómodos para el dedo)', sep >= 20, sep + ' px');
    await p.click('#etPista'); await p.waitForTimeout(200);
    ok('💡 Pista: el siguiente brilla un rato y lo dice', await p.evaluate(() => document.querySelectorAll('#etSvg .puPunto.sig').length === 1 && /Busca el 1/.test(window.__voz.at(-1))));
    await tocarSig(p); await p.waitForTimeout(100);
    // tocar otro número: dice cuál es
    const otro = await p.evaluate(() => { const t = ETAPAS.actual(); return t.pts[t.pts.length - 2]; }); const [so] = await aPant(p, [otro]); await p.mouse.click(...so); await p.waitForTimeout(100);
    const v1 = await p.evaluate(() => window.__voz.at(-1)), e1 = await E(p);
    ok('Tocar otro número no castiga: «Ese es el N. Busca el 2.» y no avanza ni se pierde nada', /^Ese es el \d+\. Busca el 2\./.test(v1) && e1.i === 1, v1);
    const esq = await p.evaluate(() => { const r = document.querySelector('#etSvg').getBoundingClientRect(); return [r.right - 14, r.bottom - 14]; });
    for (let k = 0; k < 2; k++) { await p.mouse.click(...esq); await p.waitForTimeout(80); }
    ok('Tres toques fuera: el siguiente se ilumina solo', await p.evaluate(() => document.querySelectorAll('#etSvg .puPunto.sig').length) === 1);
    await unirHasta(p, () => ETAPAS.et.e === 1); await p.waitForTimeout(1500);
    const s1 = await p.evaluate(() => ({ pasos: [...document.querySelectorAll('.etPaso')].map(x => x.className.replace('etPaso', '').trim() || '-').join(','), hecho: document.querySelectorAll('#etSvg .etHecho path').length,
      vis: document.querySelectorAll('#etSvg .puPunto').length, nums: [...document.querySelectorAll('#etSvg .puNum')].map(x => +x.textContent), voz: window.__voz.slice(-3).join(' ') }));
    const prim = await p.evaluate(() => ETAPAS.jugables(0)[0].pts.length);
    ok('Parte terminada: queda dibujada en limpio, la tira la marca hecha y salen los puntos de la siguiente, con la numeración seguida', s1.pasos === 'hecho,ahora,-,-,-' && s1.hecho >= 1 && s1.nums[0] === prim + 1 && /Ya está el cuerpo/.test(s1.voz), JSON.stringify(s1));
    await p.screenshot({ path: path.join(OUT, 'puntos-etapa2.png') });
    await tocarSig(p); await tocarSig(p); await p.waitForTimeout(100); const antes = await E(p), pts = await p.evaluate(() => JSON.stringify(ETAPAS.et.trs.map(t => t.pts)));
    await p.evaluate(() => go('m-paint')); await p.waitForTimeout(300); await p.evaluate(() => go('grandes')); await p.waitForTimeout(300);
    ok('Al salir a medias queda marcado «a medias» en su carta', await p.evaluate(() => document.querySelectorAll('.grCarta')[0].querySelector('[data-m="pu"] .grSigue') !== null));
    await p.reload(); await p.waitForTimeout(500); await p.evaluate(() => go('etapa', 'buho:pu')); await p.waitForTimeout(600);
    const desp = await E(p);
    ok('Cerrar y volver a abrir: sigue en la misma parte y número, con los mismos puntos («¡Seguimos donde lo dejaste!»)', desp.e === antes.e && desp.j === antes.j && desp.i === antes.i && desp.sig === antes.sig &&
      await p.evaluate(() => JSON.stringify(ETAPAS.et.trs.map(t => t.pts))) === pts && /Seguimos donde lo dejaste/.test(await p.evaluate(() => window.__voz.join(' '))), JSON.stringify([antes, desp]));
    // cambiar de nivel a medias no borra nada
    await p.click('#etOpc .pnChip >> nth=2'); await p.waitForTimeout(200);
    ok('Elegir 60 a medias no borra lo hecho: se aplica al próximo dibujo', JSON.stringify(await E(p)) === JSON.stringify(desp) && await p.evaluate(() => ETAPAS.leer().nivel) === 2);
    await p.evaluate(() => { const o = ETAPAS.leer(); o.nivel = 1; localStorage.setItem('lv_etapas', JSON.stringify(o)); });
    const st0 = await p.evaluate(() => stars), l0 = await p.evaluate(() => Logros.total());
    await unirHasta(p, () => false); await p.waitForTimeout(1500);
    const fin = await p.evaluate(() => ({ hecho: ETAPAS.et.hecho, arte: document.querySelectorAll('#etSvg .puArte path').length, n: Object.values(ILUSTRACIONES.buho.etapas).reduce((a, e) => a + e.t.length, 0) + ILUSTRACIONES.buho.extra.length,
      fin: !document.querySelector('#etFin').hidden, o: ETAPAS.leer(), voz: window.__voz.slice(-2).join(' '), pasos: document.querySelectorAll('.etPaso.hecho').length }));
    ok('Dibujo terminado: aparece entero con sus detalles, «¡Es un búho…!» y «Pintar»', fin.hecho && fin.arte === fin.n && fin.fin && /búho/.test(fin.voz) && fin.pasos === 5, JSON.stringify({ ...fin, o: 0 }));
    ok('+1 ⭐ como cualquier dibujo terminado; sin logros nuevos', await p.evaluate(() => stars) === st0 + 1 && await p.evaluate(() => Logros.total()) === l0);
    ok('Se guarda como terminado, se borra lo «a medias» y, con pocas ayudas, el próximo tendrá 60 puntos', fin.o.hechos['buho:pu'] === 1 && !fin.o.curso['buho:pu'] && fin.o.nivel === 2, JSON.stringify(fin.o));
    await p.screenshot({ path: path.join(OUT, 'puntos-fin.png') });
    // pintar
    await p.click('#etPintar'); await p.waitForTimeout(1200);
    const enP = await p.evaluate(() => ({ tpl: P.tpl, tool: P.tool, atras: document.querySelector('#paint .ptools [data-go]').dataset.go, oculto: !Object.keys(TPL).some(k => k.startsWith('gd:')) }));
    ok('«Pintar» abre el dibujo en Pintar con el cubo; no sale en «Colorear dibujos»; la flecha vuelve a «Dibujos por partes»', enP.tpl === 'gd:buho' && enP.tool === 'fill' && enP.atras === 'grandes' && enP.oculto, JSON.stringify(enP));
    const g0 = await p.evaluate(() => JSON.parse(localStorage.getItem('gal') || '[]').length);
    const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON()); await p.mouse.click(r.x + r.width * .43, r.y + r.height * .55); await p.waitForTimeout(150);
    await p.click('#saveBtn'); await p.waitForTimeout(300);
    ok('Se pinta con el cubo y se guarda en «Mis dibujos»', await p.evaluate(() => JSON.parse(localStorage.getItem('gal') || '[]').length) === g0 + 1);
    await p.screenshot({ path: path.join(OUT, 'pintar-buho.png') });
    // zonas cerradas: cuántas zonas distintas se pueden pintar (sin salirse del dibujo)
    const zonas = await p.evaluate(async () => { const r = {};
      for (const id of Object.keys(ILUSTRACIONES)) { go('paint', 'gd:' + id); await new Promise(z => setTimeout(z, 250));
        const W = pc.width, H = pc.height, s = Math.min(W, H) / 1000, ox = (W - 1000 * s) / 2, oy = (H - 1000 * s) / 2; let n = 0, malas = 0;
        for (let y = 40; y < 1000; y += 30) for (let x = 20; x < 1000; x += 30) { const X = Math.round(ox + x * s), Y = Math.round(oy + y * s);
          if (octx.getImageData(X, Y, 1, 1).data[3] > 60) continue; const d = pctx.getImageData(X, Y, 1, 1).data; if (d[0] !== 255 || d[1] !== 255 || d[2] !== 255) continue;
          floodFill(X, Y, n % 2 ? '#e0b030' : '#30a0e0'); n++; }
        const d = pctx.getImageData(0, 0, W, H).data; for (const [x, y] of [[2, 2], [W - 3, H - 3]]) { const j = (y * W + x) * 4; if (d[j + 2] === 48 || d[j] === 48) malas++; }
        r[id] = n; P.dirty = false; } return r; });
    ok('Muchas zonas cerradas para colorear en cada dibujo (12 o más)', Object.values(zonas).every(n => n >= 12), JSON.stringify(zonas));
    await c.close();
  }
  // ---------- 3. Repasar por etapas (furgoneta) y seguir donde se dejó ----------
  {
    const { c, p } = await pagina(b); await p.evaluate(() => go('etapa', 'furgoneta:rp')); await p.waitForTimeout(700);
    const r0 = await p.evaluate(() => ({ guias: document.querySelectorAll('#etSvg .rpGuia').length, marca: !!document.querySelector('#etSvg .rpMarca'), flechas: document.querySelectorAll('#etSvg .rpFlechas path').length, chips: document.querySelectorAll('#etOpc .pnChip').length }));
    ok('Repasar: solo los caminos de la parte de ahora, punto que brilla, flechas; sin elegir puntos', r0.guias === 1 && r0.marca && r0.flechas >= 3 && r0.chips === 0, JSON.stringify(r0));
    await arrastrar(p, await camino(p, 0, .5, 28)); const a = await E(p);
    const L = await p.evaluate(() => ETAPAS.et.rtr[0].L);
    ok('Tolerancia de Repasar: con el dedo a 28 px del centro avanza', a.prog > L * .4, JSON.stringify(a));
    await p.waitForTimeout(2600); const fz = await p.evaluate(() => { const r = document.querySelector('#etSvg').getBoundingClientRect(); return [r.left + 20, r.top + 20]; });
    await p.mouse.move(...fz); await p.mouse.down(); await p.mouse.move(fz[0] + 30, fz[1] + 10, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(200);
    ok('Salirse no borra nada («Vuelve al camino»)', (await E(p)).prog === a.prog && /Vuelve al camino/.test(await p.evaluate(() => window.__voz.at(-1))));
    await p.evaluate(() => go('m-paint')); await p.waitForTimeout(200); await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => go('etapa', 'furgoneta:rp')); await p.waitForTimeout(600);
    const b1 = await E(p);
    ok('Cerrar a medio trazo y volver: sigue desde el mismo sitio del camino', b1.e === 0 && b1.j === 0 && Math.abs(b1.prog - a.prog) <= 2, JSON.stringify([a, b1]));
    await arrastrar(p, await camino(p, b1.prog / L, 1, 10)); await p.waitForTimeout(1600);
    const b2 = await p.evaluate(() => ({ e: ETAPAS.et.e, guias: document.querySelectorAll('#etSvg .rpGuia').length, espera: document.querySelectorAll('#etSvg .rpGuia.espera').length, hecho: document.querySelectorAll('#etSvg .etHecho path').length }));
    ok('Parte hecha: queda en limpio y salen los caminos de la siguiente (las dos ruedas, una tras otra)', b2.e === 1 && b2.guias === 2 && b2.espera === 1 && b2.hecho === 1, JSON.stringify(b2));
    await arrastrar(p, await camino(p, 0, 1, 12));
    ok('Varios trazos en una parte: al acabar uno, el de al lado sigue marcado como hecho y se enciende el otro', await p.evaluate(() => ETAPAS.et.j === 1 && document.querySelectorAll('#etSvg .rpGuia.hecho').length === 1 && document.querySelectorAll('#etSvg .rpGuia.espera').length === 0));
    const st0 = await p.evaluate(() => stars);
    await repasarTodo(p, 14);
    ok('Todas las partes con el dedo algo desviado: dibujo entero, +1 ⭐ y «Pintar»', await p.evaluate(() => ETAPAS.et.hecho && !document.querySelector('#etFin').hidden) && await p.evaluate(() => stars) === st0 + 1);
    await p.screenshot({ path: path.join(OUT, 'repasar-fin.png') });
    // los otros dos dibujos, de principio a fin
    const otros = [];
    for (const k of ['buho:rp', 'unicornio:rp', 'unicornio:pu', 'furgoneta:pu']) { await p.evaluate(k => go('etapa', k), k); await p.waitForTimeout(500);
      if (k.endsWith(':rp')) await repasarTodo(p, 12); else { await unirHasta(p, () => false); await p.waitForTimeout(900); }
      otros.push(k + ':' + await p.evaluate(() => ETAPAS.et.hecho)); }
    ok('Búho y unicornio repasados; unicornio y furgoneta unidos, de principio a fin', otros.every(x => x.endsWith('true')), otros.join());
    await p.evaluate(() => go('grandes')); await p.waitForTimeout(300);
    ok('Terminados: sus cartas muestran el dibujo entero y la marca de hecho', await p.evaluate(() => document.querySelectorAll('.grMisterio').length === 0 && document.querySelectorAll('.grHecho').length === 5));
    // copia de seguridad
    await p.evaluate(() => go('etapa', 'buho:pu')); await p.waitForTimeout(400); await tocarSig(p); await tocarSig(p); await tocarSig(p); await p.waitForTimeout(100);
    const guard = await p.evaluate(() => localStorage.getItem('lv_etapas'));
    await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(600); await p.tap('#setClose');
    const copia = JSON.parse((await p.evaluate(() => window.__comp))[0].text); fs.writeFileSync(path.join(OUT, 'copia.json'), JSON.stringify(copia));
    ok('«Guardar mi progreso» incluye lo de «Dibujos por partes» (lv_etapas), también lo que está a medias', copia.local_storage.lv_etapas === guard);
    await p.evaluate(() => localStorage.setItem('lv_etapas', '{"v":1}'));
    const importar = async () => { await p.evaluate(() => go('home')); await p.waitForTimeout(200); await p.tap('#setBtn'); await p.waitForTimeout(500);
      const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.tap('#bkRecuperar')]); await fc.setFiles(path.join(OUT, 'copia.json')); await p.waitForTimeout(500); await p.tap('#bkConfirmar'); await p.waitForTimeout(2700); };
    await importar(); const a1 = await p.evaluate(() => [localStorage.getItem('lv_etapas'), localStorage.getItem('stars')]); await importar();
    const a2 = await p.evaluate(() => [localStorage.getItem('lv_etapas'), localStorage.getItem('stars')]);
    ok('«Recuperar mi progreso» lo devuelve tal cual (terminados y a medias); dos veces no cambia nada', a1[0] === guard && JSON.stringify(a1) === JSON.stringify(a2));
    await p.evaluate(() => go('etapa', 'buho:pu')); await p.waitForTimeout(500);
    ok('Tras recuperar, el búho sigue a medias donde estaba', (await E(p)).i === 3);
    // datos raros: no rompe
    await p.evaluate(() => go('home')); await p.evaluate(() => localStorage.setItem('lv_etapas', '{"v":1,"nivel":"x","curso":{"buho:pu":{"pts":"mal"},"zzz:pu":{}},"hechos":5}')); await p.evaluate(() => go('etapa', 'buho:pu')); await p.waitForTimeout(500);
    ok('Datos guardados estropeados: empieza de nuevo sin errores', (await E(p)).sig === 1);
    await c.close();
  }
  // ---------- 4. pantallas ----------
  for (const [n, d] of Object.entries(DEV)) {
    const { c, p } = await pagina(b, d); await p.evaluate(() => go('etapa', 'furgoneta:pu')); await p.waitForTimeout(700);
    const m = await p.evaluate(() => { const els = [...document.querySelectorAll('#etapa .bar .btn, #etOpc .pnChip, .etPaso, #etSvg')].filter(e => e.offsetParent), R = els.map(e => e.getBoundingClientRect());
      let sol = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) sol++; }
      return { min: Math.round(Math.min(...[...document.querySelectorAll('#etapa .bar .btn, #etOpc .pnChip')].filter(e => e.offsetParent).map(e => { const r = e.getBoundingClientRect(); return Math.min(r.width, r.height); }))),
        dentro: R.every(r => r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), sol, lado: Math.round(document.querySelector('#etSvg').getBoundingClientRect().width), ancho: document.documentElement.scrollWidth <= innerWidth + 1 }; });
    await p.screenshot({ path: path.join(OUT, `etapas-${n.replace(' ', '-').toLowerCase()}.png`) });
    await p.evaluate(() => go('grandes')); await p.waitForTimeout(400);
    const gl = await p.evaluate(() => { const R = [...document.querySelectorAll('.grModo')].map(e => e.getBoundingClientRect()); return R.every(r => r.right <= innerWidth + 1 && r.width >= 44); });
    await p.screenshot({ path: path.join(OUT, `elegir-${n.replace(' ', '-').toLowerCase()}.png`) });
    ok(`${n}: dibujo de ${m.lado} px, tira de partes, botones de 44 px o más, sin solaparse ni salirse`, m.dentro && !m.sol && m.min >= 44 && m.ancho && m.lado >= 280 && gl, JSON.stringify(m));
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
