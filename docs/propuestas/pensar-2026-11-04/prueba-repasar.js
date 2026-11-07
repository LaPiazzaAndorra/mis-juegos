#!/usr/bin/env node
/* =====================================================================
   Prueba automática de «Repasar dibujos» (3.ª entrega de Pensar; Chromium, iPhone e iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/pensar-2026-11-04/prueba-repasar.js [http://localhost:8765/] [carpeta-capturas]
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const CARP = 'docs/propuestas/pensar-2026-11-04/', COPIA = BASE + CARP + 'index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-repasar-')); fs.mkdirSync(OUT, { recursive: true });
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
const estado = p => p.evaluate(() => ({ k: REPASAR.rp.k, prog: Math.round(REPASAR.rp.prog), L: REPASAR.rp.tr[REPASAR.rp.k] ? Math.round(REPASAR.rp.tr[REPASAR.rp.k].L) : 0, hecho: REPASAR.rp.hecho }));
// puntos de pantalla a lo largo del trazo actual, desde «a» hasta «b» (fracciones), desplazados «off» px hacia fuera
const camino = (p, a, b, off = 0, n = 50) => p.evaluate(([a, b, off, n]) => {
  const T = REPASAR.rp.tr[REPASAR.rp.k], g = document.querySelector('#rpSvg'), M = g.getScreenCTM(), out = [];
  for (let i = 0; i <= n; i++) { const s = T.L * (a + (b - a) * i / n), q = T.guia.getPointAtLength(s), q2 = T.guia.getPointAtLength(Math.min(T.L, s + 3));
    const pt = g.createSVGPoint(); pt.x = q.x; pt.y = q.y; const r = pt.matrixTransform(M); const tx = q2.x - q.x, ty = q2.y - q.y, m = Math.hypot(tx, ty) || 1;
    out.push([r.x + ty / m * off, r.y - tx / m * off]); } return out; }, [a, b, off, n]);
async function arrastrar(p, pts) { await p.mouse.move(...pts[0]); await p.mouse.down(); for (const q of pts.slice(1)) await p.mouse.move(...q, { steps: 2 }); await p.mouse.up(); await p.waitForTimeout(80); }
async function repasarTodo(p, off = 0) { const n = await p.evaluate(() => REPASAR.rp.tr.length); for (let t = 0; t < n; t++) await arrastrar(p, await camino(p, 0, 1, off)); await p.waitForTimeout(700); }

(async () => {
  {
    const git = c => execSync(c, { cwd: RAIZ }).toString().trim();
    execSync('python3 ' + CARP + 'preparar_copia.py', { cwd: RAIZ });
    const h = fs.readFileSync(path.join(RAIZ, CARP, 'index.html'), 'utf8');
    ok('La copia carga repasar.js después de los demás archivos de Pensar', /pensar2\.js"><\/script>\n<script src="docs\/propuestas\/pensar-2026-11-04\/repasar\.js"><\/script>/.test(h));
    const fuera = git(`git status --porcelain -- . ':!${CARP}'`) + git(`git diff --stat 6a91012 -- . ':!${CARP}'`);
    ok('Fuera de su carpeta no cambia nada (ni main, ni el juego, ni Pintar, ni los archivos de avatar-creador)', fuera === '', fuera.slice(0, 200));
  }
  const b = await pw.chromium.launch();
  // ---------- 1. entrada, voz y niveles ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('m-paint')); await p.waitForTimeout(300);
    const mp = await p.$$eval('#m-paint .big', x => x.map(e => e.lastChild.textContent.trim()));
    ok('Menú Pintar: … Unir puntos y Repasar', mp.join('|') === 'Hoja en blanco|Colorear dibujos|Mis dibujos|Unir puntos|Repasar', mp.join('|'));
    await p.click('#m-paint [data-go="repasar"]'); await p.waitForTimeout(700);
    const ini = await p.evaluate(() => ({ voz: window.__voz.join(' '), demo: document.querySelector('#rpSvg .rpDemo').classList.contains('on'), marca: !!document.querySelector('#rpSvg .rpMarca'),
      flechas: document.querySelectorAll('#rpSvg .rpFlechas path').length, chips: document.querySelectorAll('#rpChips .pnChip svg').length, emoji: /\p{Extended_Pictographic}/u.test(document.querySelector('#rpChips').textContent + document.querySelector('#rpSvg').textContent) }));
    ok('Sin leer: lo dice en voz alta, un punto que brilla enseña el principio y un punto naranja recorre el camino; flechas de dirección', /Pon el dedo en el punto que brilla/.test(ini.voz) && ini.demo && ini.marca && ini.flechas >= 2, JSON.stringify(ini));
    ok('Seis niveles con iconos dibujados (líneas, curvas, formas, dibujos, difíciles, varios trazos), sin emojis', ini.chips === 6 && !ini.emoji && await p.evaluate(() => REPASAR.NIVELES.map(n => n.items.length).join()) === '4,4,6,6,7,6');
    await c.close();
  }
  // ---------- 2. los 33 recorridos, con el dedo algo desviado ----------
  {
    const { c, p } = await pagina(b); await p.evaluate(() => go('repasar')); await p.waitForTimeout(400);
    const ids = await p.evaluate(() => Object.keys(REPASAR.TODOS)), mal = [], s0 = await p.evaluate(() => stars);
    for (const id of ids) { await p.evaluate(id => REPASAR.empezarRp(id), id); await p.waitForTimeout(120); await repasarTodo(p, 22);
      const e = await p.evaluate(() => ({ hecho: REPASAR.rp.hecho, arte: document.querySelectorAll('#rpSvg .puArte path').length, fin: !document.querySelector('#rpFin').hidden })); if (!e.hecho || !e.arte || !e.fin) mal.push(id); }
    ok(`Los ${ids.length} recorridos se completan con el dedo a 22 px del centro del camino; al final, el dibujo entero y «¡A pintar!»`, !mal.length && ids.length === 33, mal.join());
    ok('Cada dibujo terminado da +1 ⭐ (como un acierto; nada más)', await p.evaluate(() => stars) === s0 + ids.length);
    await p.screenshot({ path: path.join(OUT, 'terminado.png') });
    await c.close();
  }
  // ---------- 3. tolerancia, atajos, salirse y seguir ----------
  {
    const { c, p } = await pagina(b); await p.evaluate(() => go('repasar')); await p.waitForTimeout(400);
    await p.evaluate(() => REPASAR.empezarRp('forma-sol')); await p.waitForTimeout(300);
    await arrastrar(p, await camino(p, 0, .3, 75));
    ok('Muy lejos del camino (75 px) no avanza', (await estado(p)).prog === 0);
    await arrastrar(p, await camino(p, .85, 1, 0));
    ok('No hay atajos: empezar cerca del final no cuenta', (await estado(p)).prog === 0);
    await arrastrar(p, await camino(p, 0, .45, 30));
    const e1 = await estado(p);
    ok('Con el dedo a 30 px del centro avanza (tolerancia generosa)', e1.prog > e1.L * .4, JSON.stringify(e1));
    const vz = await p.evaluate(() => window.__voz.length);
    const lejos = await camino(p, .45, .45, 0, 1); await p.mouse.move(...lejos[0]); await p.mouse.down(); await p.mouse.move(lejos[0][0] + 160, lejos[0][1] + 160, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(300);
    const e2 = await estado(p), v2 = await p.evaluate(() => window.__voz.slice(-2).join(' '));
    ok('Salirse no reinicia: el avance se queda y dice «Vuelve al camino…»', e2.prog === e1.prog && /Vuelve al camino/.test(v2) && await p.evaluate(() => window.__voz.length) > vz, v2);
    await p.waitForTimeout(2600); await p.mouse.click(30, 300); await p.waitForTimeout(300);
    const e3 = await p.evaluate(() => ({ demo: document.querySelector('#rpSvg .rpDemo').classList.contains('on'), voz: window.__voz.at(-1), apuros: REPASAR.rp.apuros }));
    ok('Otra vez fuera: pista «¡Por aquí!» con el punto que recorre el camino desde donde iba', e3.demo && /Por aquí/.test(e3.voz) && e3.apuros >= 1, JSON.stringify(e3));
    await arrastrar(p, await camino(p, e1.prog / e1.L, 1, 15));
    ok('Al levantar el dedo y volver a ponerlo donde iba, sigue y termina', (await estado(p)).hecho);
    // varios trazos
    await p.evaluate(() => REPASAR.empezarRp('var-gatito')); await p.waitForTimeout(300);
    const n = await p.evaluate(() => REPASAR.rp.tr.length); await arrastrar(p, await camino(p, 0, 1, 10));
    const e4 = await p.evaluate(() => ({ k: REPASAR.rp.k, espera: document.querySelectorAll('#rpSvg .rpGuia.espera').length, voz: window.__voz.at(-1) }));
    ok('Varios trazos: al terminar el contorno se enciende el siguiente («Ahora este otro»)', n === 3 && e4.k === 1 && e4.espera === 1 && /este otro/.test(e4.voz), JSON.stringify(e4));
    await c.close();
  }
  // ---------- 4. niveles, avance guardado, Pintar, copia de seguridad, logros ----------
  {
    const { c, p } = await pagina(b); await p.evaluate(() => go('repasar')); await p.waitForTimeout(400);
    const l0 = await p.evaluate(() => Logros.total());
    for (let i = 0; i < 2; i++) { await repasarTodo(p, 8); await p.click('#rpOtro'); await p.waitForTimeout(400); }
    ok('Dos dibujos sin atascos: sube al nivel 2 (curvas) y se guarda', await p.evaluate(() => REPASAR.nvRp.get().L) === 1 && JSON.parse(await p.evaluate(() => localStorage.getItem('lv_repasar'))).L === 1);
    ok('Repasar no da logros (las reglas de logros no cambian)', await p.evaluate(() => Logros.total()) === l0);
    await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => go('repasar')); await p.waitForTimeout(400);
    ok('Al volver a abrir sigue en su nivel', await p.evaluate(() => REPASAR.NIVELES[REPASAR.nvRp.get().L].items.some(i => i.id === REPASAR.rp.it.id)) && await p.evaluate(() => REPASAR.nvRp.get().L) === 1);
    await p.evaluate(() => REPASAR.empezarRp('forma-sol')); await repasarTodo(p, 5);
    await p.click('#rpPintar'); await p.waitForTimeout(1200);
    const enP = await p.evaluate(() => ({ tpl: P.tpl, tool: P.tool, atras: document.querySelector('#paint .ptools [data-go]').dataset.go }));
    ok('«¡A pintar!» abre el dibujo en Pintar con el cubo; la flecha vuelve a Repasar', enP.tpl === 'rp:forma-sol' && enP.tool === 'fill' && enP.atras === 'repasar', JSON.stringify(enP));
    const g0 = await p.evaluate(() => JSON.parse(localStorage.getItem('gal') || '[]').length);
    const r = await p.evaluate(() => document.querySelector('#pc').getBoundingClientRect().toJSON()); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(150);
    await p.click('#saveBtn'); await p.waitForTimeout(300);
    ok('Se pinta con el cubo y se guarda en «Mis dibujos» (el guardado de Pintar)', await p.evaluate(() => JSON.parse(localStorage.getItem('gal') || '[]').length) === g0 + 1);
    await p.click('#paint .ptools [data-go]'); await p.waitForTimeout(400);
    ok('La flecha vuelve a Repasar; abierto desde su menú, Pintar sigue volviendo a su menú', await p.evaluate(() => current) === 'repasar' &&
      (await p.evaluate(() => go('paint', 'free')), await p.waitForTimeout(300), await p.evaluate(() => document.querySelector('#paint .ptools [data-go]').dataset.go)) === 'm-paint');
    // contornos cerrados: el cubo dentro de la forma principal (o de los dibujos de los extremos) no se sale
    const cerr = await p.evaluate(async () => {
      const fallan = [], NS = 'http://www.w3.org/2000/svg', sv = document.createElementNS(NS, 'svg'); document.body.appendChild(sv);
      for (const [id, it] of Object.entries(REPASAR.TODOS)) {
        go('paint', 'rp:' + id); await new Promise(r => setTimeout(r, 200));
        const cerrado = /z\s*$/i.test(it.t[0].trim()) || /Z$/.test(it.t[0]);
        const fuente = cerrado ? { d: it.t[0], m: new DOMMatrix() } : { d: FIGURAS[it.deco[0].id].c, m: new DOMMatrix([it.deco[0].s, 0, 0, it.deco[0].s, it.deco[0].tx, it.deco[0].ty]) };
        const pa = document.createElementNS(NS, 'path'); pa.setAttribute('d', fuente.d); sv.appendChild(pa);
        const s = Math.min(pc.width, pc.height) / 1000, ox = (pc.width - 1000 * s) / 2, oy = (pc.height - 1000 * s) / 2; let hecho = false;
        for (let y = 60; y < 960 && !hecho; y += 23) for (let x = 60; x < 960 && !hecho; x += 23) {
          const pt = sv.createSVGPoint(); pt.x = x; pt.y = y; if (!pa.isPointInFill(pt) || pa.isPointInStroke(pt)) continue;
          const q = fuente.m.transformPoint(new DOMPoint(x, y)), X = Math.round(ox + q.x * s), Y = Math.round(oy + q.y * s);
          if (octx.getImageData(X, Y, 1, 1).data[3] > 110) continue; if (floodFill(X, Y, '#e0b030')) hecho = true; }
        const d = pctx.getImageData(0, 0, pc.width, pc.height).data, W = pc.width; let fuera = 0;
        for (const [x, y] of [[2, 2], [W - 3, 2], [2, pc.height - 3], [W - 3, pc.height - 3]]) { const j = (y * W + x) * 4; if (d[j] !== 255 || d[j + 1] !== 255) fuera++; }
        if (!hecho || fuera) fallan.push(id + (hecho ? ':se sale' : ':no pinta')); pa.remove(); P.dirty = false;
      } return fallan; });
    ok('Los 33 dibujos para pintar tienen contornos cerrados: el cubo pinta dentro y no se sale', !cerr.length, cerr.join());
    // copia de seguridad
    await p.evaluate(() => go('home')); await p.waitForTimeout(300); await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(600); await p.tap('#setClose');
    const copia = JSON.parse((await p.evaluate(() => window.__comp))[0].text); fs.writeFileSync(path.join(OUT, 'copia.json'), JSON.stringify(copia));
    ok('«Guardar mi progreso» incluye el avance de Repasar (lv_repasar) y el dibujo guardado', 'lv_repasar' in copia.local_storage && JSON.parse(copia.local_storage.gal).length === g0 + 1);
    await p.evaluate(() => REPASAR.nvRp.elegir(0));
    const importar = async () => { await p.evaluate(() => go('home')); await p.waitForTimeout(200); await p.tap('#setBtn'); await p.waitForTimeout(500);
      const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.tap('#bkRecuperar')]); await fc.setFiles(path.join(OUT, 'copia.json')); await p.waitForTimeout(500); await p.tap('#bkConfirmar'); await p.waitForTimeout(2700); };
    await importar(); const a1 = await p.evaluate(() => [localStorage.getItem('lv_repasar'), localStorage.getItem('gal').length, localStorage.getItem('stars')]); await importar();
    const a2 = await p.evaluate(() => [localStorage.getItem('lv_repasar'), localStorage.getItem('gal').length, localStorage.getItem('stars')]);
    ok('«Recuperar mi progreso» devuelve el nivel de Repasar y los dibujos; dos veces no cambia nada', JSON.parse(a1[0]).L === 1 && JSON.stringify(a1) === JSON.stringify(a2));
    await c.close();
  }
  // ---------- 5. pantallas ----------
  for (const [n, d] of Object.entries(DEV)) {
    const { c, p } = await pagina(b, d); await p.evaluate(() => { REPASAR.nvRp.elegir(5); go('repasar'); }); await p.waitForTimeout(700);
    const m = await p.evaluate(() => { const els = [...document.querySelectorAll('#repasar .bar .btn, #rpChips .pnChip, #rpSvg')].filter(e => e.offsetParent), R = els.map(e => e.getBoundingClientRect());
      let sol = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) sol++; }
      return { min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))), dentro: R.every(r => r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), sol,
        lado: Math.round(document.querySelector('#rpSvg').getBoundingClientRect().width), ancho: document.documentElement.scrollWidth <= innerWidth + 1 }; });
    await repasarTodo(p, 10); const fin = await p.evaluate(() => { const r = [...document.querySelectorAll('#rpFin .btn')].map(e => e.getBoundingClientRect()); return r.every(q => q.bottom <= innerHeight + 1 && q.right <= innerWidth + 1 && q.height >= 44); });
    await p.screenshot({ path: path.join(OUT, `repasar-${n.replace(' ', '-').toLowerCase()}.png`) });
    ok(`${n}: Repasar a la vista (dibujo de ${m.lado} px), sin solaparse, botones de 44 px o más; «¡A pintar!» a la vista`, m.dentro && !m.sol && m.min >= 44 && m.ancho && m.lado >= 280 && fin, JSON.stringify(m));
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
