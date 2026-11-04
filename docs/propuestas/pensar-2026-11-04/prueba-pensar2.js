#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la 2.ª entrega de Pensar: ¿Qué sigue?, Sombras, El diferente y Unir puntos (Chromium)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/pensar-2026-11-04/prueba-pensar2.js [http://localhost:8765/] [carpeta-capturas]
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const CARP = 'docs/propuestas/pensar-2026-11-04/', COPIA = BASE + CARP + 'index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-pensar2-')); fs.mkdirSync(OUT, { recursive: true });
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
async function pagina(b, d = DEV['iPhone vertical'], limpiar = true) {
  const c = await b.newContext({ viewport: { width: d[0], height: d[1] }, hasTouch: true, isMobile: d[2], deviceScaleFactor: 2 });
  await c.addInitScript(INIT); const p = await c.newPage(); p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await p.goto(COPIA); if (limpiar) { await p.evaluate(() => localStorage.clear()); await p.reload(); } await p.waitForTimeout(400); return { c, p };
}
const LS = (p, ks) => p.evaluate(ks => Object.fromEntries(ks.map(k => [k, localStorage.getItem(k)])), ks);
const nv = (p, m) => p.evaluate(m => PENSAR2.JUEGOS[m].nv.get(), m);
const estrellas = p => p.evaluate(() => stars);
const JUEGOS = ['sigue', 'sombras', 'distinto'];
async function abrirOb(p, m, L) { for (let k = 0; k < 30; k++) { await p.evaluate(([m, L]) => { const j = PENSAR2.JUEGOS[m]; j.nv.marcar('x'); if (L !== undefined) j.nv.elegir(L); go('obs', m); }, [m, L]); await p.waitForTimeout(350); if (!(await p.evaluate(() => PENSAR2.ob.repaso))) return; } }
const boton = (p, bien) => p.evaluate(bien => { const bs = [...document.querySelectorAll('#obEscena .pnOpt, #obOpts .pnOpt')].filter(b => !b.classList.contains('fuera'));
  const i = bs.findIndex(b => PENSAR2.ob.item.opts[+b.dataset.i].ok === bien); return i < 0 ? -1 : +bs[i].dataset.i; }, bien);
async function contestar(p, bien = true) { const i = await boton(p, bien); await p.click(`#obs .pnOpt[data-i="${i}"]`, { force: true }); }
async function acierto(p) { const t0 = await p.evaluate(() => PENSAR2.ob.turno); await contestar(p); await p.waitForFunction(t0 => PENSAR2.ob.turno > t0 && !PENSAR2.ob.ocupado, t0, { timeout: 15000 }); await p.waitForTimeout(150); }
const EMOJI = /\p{Extended_Pictographic}/u;

(async () => {
  // ---------- 0. la copia y el repositorio ----------
  {
    const git = c => execSync(c, { cwd: RAIZ }).toString().trim();
    execSync('python3 ' + CARP + 'preparar_copia.py', { cwd: RAIZ });
    const h = fs.readFileSync(path.join(RAIZ, CARP, 'index.html'), 'utf8');
    ok('La copia sigue siendo la prueba completa (lo publicado) + los archivos de Pensar, cargados al final', /pensar\.js"><\/script>\n<script src="docs\/propuestas\/pensar-2026-11-04\/figuras\.js"><\/script>\n<script src="docs\/propuestas\/pensar-2026-11-04\/pensar2\.js"><\/script>/.test(h));
    const fuera = git(`git status --porcelain -- . ':!${CARP}'`) + git(`git diff --stat 6a91012 -- . ':!${CARP}'`);
    ok('Fuera de su carpeta no cambia nada (juego, sw.js, progreso.js, logros, Pintar, muñeca, Mi Mundo, otras copias)', fuera === '', fuera.slice(0, 200));
  }
  const b = await pw.chromium.launch();
  // ---------- 1. menús, datos y avance ----------
  {
    const { c, p } = await pagina(b, DEV['iPhone vertical'], false);
    const PREVIOS = { stars: '20', lv_sigue: '8', lv_sombras: '2', lv_distinto: '7', gal: '[]', avatar: '{"v":1}', logros: '{"v":1,"lista":[]}' };
    await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, PREVIOS); await p.reload(); await p.waitForTimeout(400);
    const menu = await p.$$eval('#m-think .big', x => x.map(e => e.lastChild.textContent.trim() + '→' + e.dataset.go + (e.dataset.arg ? ':' + e.dataset.arg : '')));
    ok('Menú Pensar: Memoria, Contar y los tres juegos nuevos', menu.join('|') === 'Memoria→memoria|Contar→contar|¿Qué sigue?→obs:sigue|Sombras→obs:sombras|El diferente→obs:distinto', menu.join('|'));
    const mp = await p.$$eval('#m-paint .big', x => x.map(e => e.lastChild.textContent.trim()));
    ok('Menú Pintar: Hoja en blanco, Colorear dibujos, Mis dibujos y Unir puntos', mp.join('|') === 'Hoja en blanco|Colorear dibujos|Mis dibujos|Unir puntos', mp.join('|'));
    await p.click('#m-think [data-arg="sigue"]', { force: true }).catch(() => p.evaluate(() => go('obs', 'sigue'))); await p.waitForTimeout(500);
    ok('La primera vez ofrece «Prueba rápida» o «Empezar» y lo dice en voz alta', await p.isVisible('#obs .pnIntro .pnSi') && /Saltamos/.test((await p.evaluate(() => window.__voz)).join(' ')));
    await p.click('#obs .pnNo'); await p.waitForTimeout(500);
    ok('Quien ya iba avanzado en el juego (lv_sigue 8) no empieza por lo más fácil; lv_sombras 2, sí', (await nv(p, 'sigue')).L === 1 && (await nv(p, 'sombras')).L === 0);
    for (let i = 0; i < 2; i++) await acierto(p);
    const d = await LS(p, Object.keys(PREVIOS));
    ok('Las claves antiguas y los demás datos no cambian; las estrellas solo suman (+1 por acierto, como hoy)', Object.keys(PREVIOS).filter(k => k !== 'stars').every(k => d[k] === PREVIOS[k]) && d.stars === '22');
    await c.close();
  }
  // ---------- 2. ejercicios generados ----------
  {
    const { c, p } = await pagina(b);
    const r = await p.evaluate(() => {
      const mal = [], vistos = {}, EM = /\p{Extended_Pictographic}/u;
      for (const m of ['sigue', 'sombras', 'distinto']) { const J = PENSAR2.JUEGOS[m];
        for (let L = 0; L < J.niveles.length; L++) for (let i = 0; i < 250; i++) {
          const it = J.crear(L), buenas = it.opts.filter(o => o.ok).length, htmls = it.opts.map(o => o.html);
          const distintas = m === 'distinto' ? new Set(htmls).size >= 2 : new Set(htmls).size === htmls.length;
          const texto = htmls.join('').replace(/<[^>]+>/g, '');
          if (buenas !== 1 || !distintas || it.opts.length < 3 || EM.test(texto) || EM.test((it.html || '').replace(/<[^>]+>/g, ''))) mal.push([m, L, buenas, it.opts.length]);
          if (m !== 'distinto') it.opts.filter(o => !o.ok).forEach(o => { if (!it.pista1(o)) mal.push([m, L, 'sin pista']); });
          const k = m + L; vistos[k] = vistos[k] || new Set(); vistos[k].add(it.opts.map(o => o.html).join());
        } }
      return { mal: mal.slice(0, 3), n: mal.length, variedad: Math.min(...Object.values(vistos).map(s => s.size)) };
    });
    ok('4 500 ejercicios (3 juegos, todos los niveles): siempre una sola respuesta buena, opciones distintas y sin emojis', r.n === 0, JSON.stringify(r.mal));
    ok('Variados: cada nivel da muchos ejercicios distintos', r.variedad > 30, 'mín. ' + r.variedad + ' de 250');
    const reglas = await p.evaluate(() => {
      const { crearSigue: S, crearSombras: B, crearDistinto: D } = PENSAR2, f = [];
      const uno = (g, L, test, n = 100) => { for (let i = 0; i < n; i++) if (!test(g(L))) { f.push(g.name + L); return; } };
      const resp = it => it.opts.find(o => o.ok).it, otros = it => it.opts.filter(o => !o.ok).map(o => o.it);
      uno(S, 2, it => otros(it).some(o => o.col !== resp(it).col));                        // colores
      uno(S, 3, it => otros(it).some(o => o.tam !== resp(it).tam));                        // tamaño
      uno(S, 4, it => otros(it).some(o => o.esp !== resp(it).esp || o.giro !== resp(it).giro));   // orientación
      uno(S, 5, it => /pnHuecoQ/.test(it.html) && it.opts.length === 4);
      uno(S, 6, it => { const i = it.html.indexOf('pnHuecoQ'); return i > 0 && it.html.indexOf('pnFig', i) > 0; });   // hueco en medio
      uno(B, 2, it => otros(it).every(o => o.id === resp(it).id));                          // misma figura, otra orientación
      uno(B, 3, it => otros(it).some(o => o.sin.length || resp(it).sin.length));           // le falta una parte
      uno(D, 4, it => { const g = it.opts.filter(o => !o.ok).map(o => DIBUJOS[o.it.id].grupo); return new Set(g).size === 1 && DIBUJOS[resp(it).id].grupo !== g[0]; });
      uno(D, 5, it => resp(it).sin.length === 1 && otros(it).every(o => !o.sin.length));
      uno(D, 6, it => new Set(it.opts.map(o => o.it.id)).size === it.opts.length && otros(it).every(o => o.col === otros(it)[0].col) && resp(it).col !== otros(it)[0].col);
      uno(D, 7, it => otros(it).every(o => o.m === otros(it)[0].m) && resp(it).m !== otros(it)[0].m);
      return f;
    });
    ok('Las reglas son las de cada nivel (color, tamaño, orientación, hueco en medio, partes que faltan, «qué son», detalle, con trampa, contar)', !reglas.length, reglas.join());
    await c.close();
  }
  // ---------- 3. jugar: subir, pistas, sin cronómetro, prueba rápida, avance ----------
  {
    const { c, p } = await pagina(b);
    for (const m of JUEGOS) {
      await abrirOb(p, m, 0); const s0 = await estrellas(p);
      for (let i = 0; i < 3; i++) { while (await p.evaluate(() => PENSAR2.ob.repaso)) await acierto(p); await acierto(p); }
      ok(`${m}: tres aciertos limpios suben al nivel 2 (+1 ⭐ cada uno)`, (await nv(p, m)).L >= 1 && await estrellas(p) >= s0 + 3);
      await abrirOb(p, m, 3); const sE = await estrellas(p);
      await contestar(p, false); await p.waitForTimeout(200); const v1 = await p.evaluate(() => window.__voz.at(-1));
      await contestar(p, false); await p.waitForTimeout(200);
      const pista = await p.evaluate(() => !!document.querySelector('#obs .pnOpt.pista'));
      ok(`${m}: primer fallo, «¡Casi! Fíjate en…»; segundo, brilla la buena; sin quitar estrellas`, /^¡Casi! (Fíjate|Mira|Piensa|Cuenta)/.test(v1) && pista && await estrellas(p) === sE, v1);
    }
    const antes = await p.evaluate(() => [PENSAR2.ob.turno, document.querySelector('#obTexto').textContent]); await p.waitForTimeout(6000);
    ok('Sin cronómetro: 6 s sin tocar nada no cambian la pregunta', JSON.stringify(antes) === JSON.stringify(await p.evaluate(() => [PENSAR2.ob.turno, document.querySelector('#obTexto').textContent])));
    // prueba rápida en Sombras: dos bien y la tercera mal
    await p.evaluate(() => { PENSAR2.JUEGOS.sombras.nv.elegir(0); go('obs', 'sombras'); }); await p.waitForTimeout(400); await p.click('#obPrueba');
    await p.waitForTimeout(400); const lista = await p.evaluate(() => PENSAR2.JUEGOS.sombras.pr.lista.join());
    for (let i = 0; i < 2; i++) await acierto(p);
    await contestar(p, false); await p.waitForTimeout(150); await contestar(p, false); await p.waitForTimeout(4200);
    const ns = await nv(p, 'sombras');
    ok('Prueba rápida (Sombras): dos bien y la tercera mal → empieza en el nivel 3; solo sube', lista === '1,2,3,5' && ns.L === 2 && !(await p.evaluate(() => PENSAR2.JUEGOS.sombras.pr.activa)), JSON.stringify(ns));
    await p.reload(); await p.waitForTimeout(400);
    ok('Al volver a abrir, cada juego sigue en su nivel', (await nv(p, 'sombras')).L === 2 && (await nv(p, 'sigue')).L === 3 && (await nv(p, 'distinto')).L === 3);
    // logros y copia de seguridad
    const l0 = await p.evaluate(() => Logros.total()); await abrirOb(p, 'distinto', 0); await acierto(p); await acierto(p);
    ok('Responder no da logros (las reglas de logros no cambian)', await p.evaluate(() => Logros.total()) === l0);
    await p.evaluate(() => { PENSAR2.nvPu.elegir(2); go('home'); }); await p.waitForTimeout(300);
    await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(600); await p.tap('#setClose');
    const ls = JSON.parse((await p.evaluate(() => window.__comp))[0].text).local_storage;
    ok('«Guardar mi progreso» incluye el avance nuevo (lv_sigue2, lv_sombras2, lv_distinto2, lv_puntos)', ['lv_sigue2', 'lv_sombras2', 'lv_distinto2', 'lv_puntos'].every(k => k in ls) && JSON.parse(ls.lv_puntos).L === 2);
    await c.close();
  }
  // ---------- 4. Unir puntos ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('m-paint')); await p.waitForTimeout(300); await p.click('#m-paint [data-go="puntos"]'); await p.waitForTimeout(600);
    const ini = await p.evaluate(() => ({ voz: window.__voz.join(' '), sig: document.querySelectorAll('#puSvg .puPunto.sig').length, chips: [...document.querySelectorAll('#puChips .pnChip')].map(b => b.textContent).join(), fin: document.querySelector('#puFin').hidden }));
    ok('Unir puntos: lo explica en voz alta, brilla el siguiente punto; niveles de 6 a 26 puntos', /Une los puntos/.test(ini.voz) && ini.sig === 1 && ini.chips === '6,9,12,16,20,26' && ini.fin, JSON.stringify(ini));
    const pant = (i) => p.evaluate(i => { const g = document.querySelector('#puSvg'), pt = g.createSVGPoint(); [pt.x, pt.y] = PENSAR2.pu.pts[i]; const q = pt.matrixTransform(g.getScreenCTM()); return [q.x, q.y]; }, i);
    const r0 = await p.evaluate(() => document.querySelector('#puSvg').getBoundingClientRect().toJSON());
    await p.mouse.click(r0.x + 8, r0.y + 8); await p.waitForTimeout(100); await p.mouse.click(r0.x + 10, r0.y + 12); await p.waitForTimeout(100);
    ok('Tocar lejos no castiga: no avanza, dice «Busca el 2…» y al segundo toque sale una guía', await p.evaluate(() => PENSAR2.pu.sig) === 1 && await p.evaluate(() => document.querySelector('#puGuia').classList.contains('on')) && /Busca el 2/.test(await p.evaluate(() => window.__voz.at(-1))));
    // arrastrar el dedo del 1 al 2 y al 3
    const a1 = await pant(0), a2 = await pant(1), a3 = await pant(2);
    await p.mouse.move(...a1); await p.mouse.down(); await p.mouse.move(...a2, { steps: 8 }); await p.mouse.move(...a3, { steps: 8 }); await p.mouse.up();
    ok('También se puede arrastrar el dedo de punto a punto', await p.evaluate(() => PENSAR2.pu.sig) === 3);
    const s0 = await estrellas(p), n = await p.evaluate(() => PENSAR2.pu.pts.length);
    for (let i = 3; i < n; i++) { const q = await pant(i); await p.mouse.click(q[0] + 9, q[1] - 9); }   // con un poco de margen: tolerancia
    await p.waitForTimeout(1200);
    const fin = await p.evaluate(() => ({ arte: document.querySelectorAll('#puSvg .puArte path').length, fin: !document.querySelector('#puFin').hidden, voz: window.__voz.at(-1), fig: PENSAR2.pu.fig }));
    ok('Al unir el último aparece el dibujo, dice qué es y +1 ⭐ (como hoy por acierto)', fin.arte > 1 && fin.fin && /^¡Es /.test(fin.voz) && await estrellas(p) === s0 + 1, fin.voz);
    await p.screenshot({ path: path.join(OUT, 'puntos-fin.png') });
    // pintar en Pintar: cubo dentro sin salirse, guardar en Mis dibujos y volver a Unir puntos
    await p.click('#puPintar'); await p.waitForTimeout(1200);
    const enPintar = await p.evaluate(() => ({ tpl: P.tpl, tool: P.tool, atras: document.querySelector('#paint .ptools [data-go]').dataset.go }));
    ok('«¡A pintar!» abre el dibujo en Pintar con el cubo; la flecha vuelve a Unir puntos', /^pz:/.test(enPintar.tpl) && enPintar.tool === 'fill' && enPintar.atras === 'puntos', JSON.stringify(enPintar));
    const g0 = await p.evaluate(() => (JSON.parse(localStorage.getItem('gal') || '[]')).length);
    await p.click('#colors .sw >> nth=2'); await p.click('#saveBtn').catch(() => {});
    await p.click('#saveBtn'); await p.waitForTimeout(300);
    ok('Se guarda en «Mis dibujos» (el guardado de Pintar de siempre)', await p.evaluate(() => (JSON.parse(localStorage.getItem('gal') || '[]')).length) === g0 + 1);
    await p.click('#paint .ptools [data-go]'); await p.waitForTimeout(500);
    ok('La flecha de Pintar vuelve a Unir puntos; desde el menú, Pintar vuelve a su menú', await p.evaluate(() => current) === 'puntos' &&
      (await p.evaluate(() => go('paint', 'free')), await p.waitForTimeout(400), await p.evaluate(() => document.querySelector('#paint .ptools [data-go]').dataset.go)) === 'm-paint');
    // contornos cerrados: el cubo dentro de cada figura no se sale
    const cerr = await p.evaluate(async () => {
      const fallan = [], NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); document.body.appendChild(svg);
      for (const k of Object.keys(FIGURAS)) {
        go('paint', 'pz:' + k); await new Promise(r => setTimeout(r, 250));
        const pa = document.createElementNS(NS, 'path'); pa.setAttribute('d', FIGURAS[k].c); svg.appendChild(pa);
        const s = Math.min(pc.width, pc.height) / 1000, ox = (pc.width - 1000 * s) / 2, oy = (pc.height - 1000 * s) / 2; let hecho = false;
        for (let y = 150; y < 950 && !hecho; y += 37) for (let x = 150; x < 950 && !hecho; x += 37) {
          const pt = svg.createSVGPoint(); pt.x = x; pt.y = y; if (!pa.isPointInFill(pt) || pa.isPointInStroke(pt)) continue;
          const X = Math.round(ox + x * s), Y = Math.round(oy + y * s); if (octx.getImageData(X, Y, 1, 1).data[3] > 110) continue;
          P.color = '#e0b030'; if (floodFill(X, Y, '#e0b030')) hecho = true; }
        const d = pctx.getImageData(0, 0, pc.width, pc.height).data, W = pc.width; let fuera = 0, total = 0;
        for (const [x, y] of [[2, 2], [W - 3, 2], [2, pc.height - 3], [W - 3, pc.height - 3]]) { const j = (y * W + x) * 4; total++; if (d[j] !== 255 || d[j + 1] !== 255) fuera++; }
        if (!hecho || fuera) fallan.push(k + (hecho ? ':se sale' : ':no pinta'));
        pa.remove(); P.dirty = false;
      }
      return fallan;
    });
    ok('Los 20 contornos están cerrados: el cubo pinta dentro y no se sale', !cerr.length, cerr.join());
    // puntos separados y números legibles en el iPhone, en todas las figuras y niveles
    await p.evaluate(() => go('puntos')); await p.waitForTimeout(400);
    const sep = await p.evaluate(async () => {
      const malos = []; for (let L = 0; L < FIGURAS_NIVELES.length; L++) for (const f of FIGURAS_NIVELES[L].f) {
        PENSAR2.nvPu.elegir(L); PENSAR2.empezarPu(f); await new Promise(r => requestAnimationFrame(r));
        const R = [...document.querySelectorAll('#puSvg .puBola')].map(e => e.getBoundingClientRect()), C = R.map(r => [r.x + r.width / 2, r.y + r.height / 2]);
        let min = 1e9; for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) min = Math.min(min, Math.hypot(C[i][0] - C[j][0], C[i][1] - C[j][1]));
        const fs = parseFloat(getComputedStyle(document.querySelector('#puSvg .puNum')).fontSize) * document.querySelector('#puSvg').getBoundingClientRect().width / 1080;
        if (min < 18 || fs < 13) malos.push(`${f}${FIGURAS_NIVELES[L].n}:${Math.round(min)}px`);
      } return malos; });
    ok('iPhone: en todas las figuras los puntos están a 18 px o más y los números miden 13 px o más', !sep.length, sep.join(' '));
    await c.close();
  }
  // ---------- 5. pantallas ----------
  for (const [n, d] of Object.entries(DEV)) {
    const { c, p } = await pagina(b, d); const fallos = [];
    const medir = sel => p.evaluate(sel => { const els = [...document.querySelectorAll(sel)].filter(e => e.offsetParent && !e.hidden && !e.closest('[hidden]')), R = els.map(e => e.getBoundingClientRect());
      let sol = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) sol++; }
      const esc = document.querySelector('.screen.on .pnEscena,.screen.on .pnTablero2');
      return { n: els.length, min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))), dentro: R.every(r => r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), sol,
        cabe: !esc || (esc.scrollHeight <= esc.clientHeight + 2 && esc.scrollWidth <= esc.clientWidth + 2), ancho: document.documentElement.scrollWidth <= innerWidth + 1 }; }, sel);
    for (const m of JUEGOS) { const nl = await p.evaluate(m => PENSAR2.JUEGOS[m].niveles.length, m);
      for (const L of [0, nl - 2, nl - 1]) { await abrirOb(p, m, L); await p.waitForTimeout(200);
        const r = await medir('#obs .bar .btn, #obs .pnSaltar, #obs .pnOpt'); if (!(r.dentro && !r.sol && r.min >= 44 && r.cabe && r.ancho)) fallos.push(m + L + JSON.stringify(r)); }
      await p.screenshot({ path: path.join(OUT, `${m}-${n.replace(' ', '-').toLowerCase()}.png`) }); }
    await p.evaluate(() => { PENSAR2.nvPu.elegir(5); go('puntos'); }); await p.waitForTimeout(600);
    const r = await medir('#puntos .bar .btn, #puChips .pnChip, #puSvg');
    if (!(r.dentro && !r.sol && r.min >= 44 && r.ancho)) fallos.push('puntos' + JSON.stringify(r));
    const sepD = await p.evaluate(async () => { let peor = 1e9; for (const f of FIGURAS_NIVELES[5].f) { PENSAR2.empezarPu(f); await new Promise(r => requestAnimationFrame(r));
      const C = [...document.querySelectorAll('#puSvg .puBola')].map(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
      for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) peor = Math.min(peor, Math.hypot(C[i][0] - C[j][0], C[i][1] - C[j][1])); } return Math.round(peor); });
    if (sepD < 18) fallos.push('puntos juntos ' + sepD + 'px');
    await p.screenshot({ path: path.join(OUT, `puntos-${n.replace(' ', '-').toLowerCase()}.png`) });
    ok(`${n}: ¿Qué sigue?, Sombras, El diferente y Unir puntos a la vista, sin solaparse, botones de 44 px o más`, !fallos.length, fallos.join(' ').slice(0, 300));
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
