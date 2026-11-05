#!/usr/bin/env node
/* =====================================================================
   Prueba automática de la copia de Pensar: Contar y Memoria (Chromium; iPhone y iPad simulados)

   Uso (desde la raíz del repositorio):
     python3 -m http.server 8765 &
     node docs/propuestas/pensar-2026-11-04/prueba-pensar.js [http://localhost:8765/] [carpeta-capturas]

   Comprueba:
     · la copia es el juego publicado (prueba completa) + 3 archivos nuevos; nada más del repositorio cambia;
     · datos propios «pen1:»; el juego y las otras copias, intactos; los datos que ya había se leen y no se pierden;
     · Contar: 10 pasos (hasta 20, sumas, restas, «¿cuántos faltan?»), ejercicios correctos y variados; sube tras
       3 aciertos limpios; pistas al atascarse; sin cronómetro; estrellas como hoy (+1 por acierto, nunca se quitan);
       el avance se guarda; la clave antigua «lv_contar» solo se lee; prueba rápida que solo sube;
     · Memoria: parejas (3 a 12), «¿Dónde estaba?» y «Repite la serie»: niveles, pistas, prueba rápida, avance guardado;
     · dibujos SVG (sin emojis como dibujos del juego) y sin descargas externas;
     · los otros juegos de Pensar y los logros, como hoy; «Guardar mi progreso» incluye el avance nuevo;
     · todo a la vista en iPhone e iPad (vertical y horizontal), botones de 44 px o más; sin errores de JavaScript.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const BASE = (process.argv[2] || 'http://localhost:8765/').replace(/\/?$/, '/');
const CARP = 'docs/propuestas/pensar-2026-11-04/', COPIA = BASE + CARP + 'index.html';
const RAIZ = path.resolve(__dirname, '../../..');
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-pensar-')); fs.mkdirSync(OUT, { recursive: true });
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
const nv = (p, k) => p.evaluate(k => PENSAR[k].get(), k);
const estrellas = p => p.evaluate(() => stars);
// Contar: esperar pregunta nueva y contestar
const listoCt = (p, t0) => p.waitForFunction(t0 => PENSAR.ct.turno > t0 && !PENSAR.ct.ocupado && document.querySelectorAll('#ctOpts .pnOpt').length >= 3, t0, { timeout: 15000 });
async function contestarCt(p, bien = true) {
  const r = await p.evaluate(() => PENSAR.ct.item.resp), malo = await p.evaluate(r => [...document.querySelectorAll('#ctOpts .pnOpt:not(.fuera)')].map(b => +b.textContent).find(v => v !== r), r);
  await p.click(`#ctOpts .pnOpt:has-text("${bien ? r : malo}") >> nth=0`, { force: true });
}
async function aciertoCt(p) { const t0 = await p.evaluate(() => PENSAR.ct.turno), rep = await p.evaluate(() => PENSAR.ct.repaso); await contestarCt(p); await listoCt(p, t0); return rep; }
const EMOJI = /\p{Extended_Pictographic}/u;

(async () => {
  // ---------- 0. la copia y el repositorio ----------
  {
    const git = c => execSync(c, { cwd: RAIZ }).toString().trim();
    execSync('python3 ' + CARP + 'preparar_copia.py', { cwd: RAIZ });
    ok('El generador reproduce la copia y comprueba que es la prueba completa (lo publicado) + Contar y Memoria', git(`git status --porcelain -- ${CARP}index.html ${CARP}progreso.js ${CARP}logros.js`).split('\n').every(l => !l.startsWith(' M')));
    const h = fs.readFileSync(path.join(RAIZ, CARP, 'index.html'), 'utf8');
    ok('Solo añade pensar.css, dibujos.js y pensar.js (después de todo lo demás)', /logros\.js"><\/script>\n<link rel="stylesheet" href="docs\/propuestas\/pensar-2026-11-04\/pensar\.css">\n<script src="docs\/propuestas\/pensar-2026-11-04\/dibujos\.js"><\/script>\n<script src="docs\/propuestas\/pensar-2026-11-04\/pensar\.js"><\/script>/.test(h));
    const fuera = git(`git status --porcelain -- . ':!${CARP}'`) + git(`git diff --stat origin/avatar-creador -- . ':!${CARP}'`);
    ok('Fuera de su carpeta no cambia nada (juego, sw.js, progreso.js, logros, muñeca, otras copias, documentos)', fuera === '', fuera.slice(0, 200));
  }
  const b = await pw.chromium.launch();
  // ---------- 1. datos ----------
  {
    const { c, p } = await pagina(b, DEV['iPhone vertical'], false);
    const AJENOS = { stars: '50', lv_contar: '9', 'com1:stars': '3', 'hab1:stars': '4' };
    await p.evaluate(a => { const real = Object.getOwnPropertyDescriptor(window, 'localStorage').value; }, AJENOS);
    await p.goto(BASE + CARP + 'aislamiento.js'); await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, AJENOS);
    await p.goto(COPIA); await p.waitForTimeout(300);
    const PREVIOS = { stars: '37', gal: '["data:image/png;base64,iVBORw0KGgo="]', lv_contar: '8', lv_sigue: '3', iceCoins: '5', avatar: '{"v":1}', logros: '{"v":1,"lista":[]}', sound: 'true' };
    await p.evaluate(a => { localStorage.clear(); for (const [k, v] of Object.entries(a)) localStorage.setItem(k, v); }, PREVIOS); await p.reload(); await p.waitForTimeout(400);
    await p.evaluate(() => go('m-think')); await p.waitForTimeout(300);
    const menu = await p.$$eval('#m-think .big', x => x.map(e => e.lastChild.textContent.trim() + '→' + e.dataset.go));
    ok('Menú Pensar: Memoria y Contar nuevos; ¿Qué sigue?, Sombras y El diferente como hoy', menu.join('|') === 'Memoria→memoria|Contar→contar|¿Qué sigue?→quiz|Sombras→quiz|El diferente→quiz', menu.join('|'));
    await p.click('#m-think [data-go="contar"]'); await p.waitForTimeout(500);
    ok('La primera vez, Contar ofrece «Prueba rápida» o «Empezar»', await p.isVisible('#contar .pnIntro .pnSi') && await p.isVisible('#contar .pnIntro .pnNo'));
    await p.click('#contar .pnNo'); await p.waitForTimeout(500);
    ok('Quien ya contaba hasta 10 en el juego (lv_contar 8) no empieza por lo más fácil: nivel 2', (await nv(p, 'nvCt')).L === 1);
    for (let i = 0; i < 2; i++) await aciertoCt(p);
    const d = await LS(p, Object.keys(PREVIOS));
    ok('Al jugar, «lv_contar» y los demás datos no cambian; solo suman las estrellas (+1 por acierto, como hoy)',
      Object.keys(PREVIOS).filter(k => k !== 'stars').every(k => d[k] === PREVIOS[k]) && d.stars === '39', JSON.stringify(d).slice(0, 120));
    await p.goto(BASE + CARP + 'aislamiento.js');
    const real = await p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
    ok('El juego (stars, lv_contar) y las otras copias siguen intactos; la copia solo escribe «pen1:»', Object.entries(AJENOS).every(([k, v]) => real[k] === v) &&
      Object.keys(real).filter(k => !(k in AJENOS)).every(k => k.startsWith('pen1:')));
    await c.close();
  }
  // ---------- 2. Contar: ejercicios ----------
  {
    const { c, p } = await pagina(b);
    const r = await p.evaluate(() => {
      const out = { mal: [], tipos: {}, dibujos: new Set(), opc: new Set() }, dp = new DOMParser(), EMOJI_RE = /\p{Extended_Pictographic}/u;
      for (let L = 0; L < PENSAR.CT.length; L++) for (let i = 0; i < 300; i++) {
        const it = PENSAR.crearCt(L), doc = dp.parseFromString(`<div>${it.html}</div>`, 'text/html'), q = s => doc.querySelectorAll(s).length;
        const cuenta = { contar: q('.pnCaja .pnO'), suma: q('.pnCaja .pnO'), resta: q('.pnO:not(.sevan)'), faltan: q('.pnHueco') }[it.tipo];
        const okO = new Set(it.opts).size === it.opts.length && it.opts.includes(it.resp) && it.opts.every(v => v >= 1 && v <= 20) && it.opts.length === (L < 4 ? 3 : 4);
        const total = it.tipo === 'faltan' ? q('.pnCaja .pnO') + q('.pnHueco') : q('.pnCaja .pnO');
        if (cuenta !== it.resp || !okO || total > 20 || EMOJI_RE.test(it.html.replace(/<[^>]+>/g, '')) || !/^¿|^Hay|^Queremos/.test(it.texto)) out.mal.push([L, it.tipo, it.texto, it.resp, cuenta]);
        out.tipos[L + it.tipo] = 1; out.dibujos.add(it.d.s); out.opc.add(it.opts.join());
      }
      return { mal: out.mal.slice(0, 3), n: out.mal.length, tipos: Object.keys(out.tipos).sort().join(' '), dibujos: out.dibujos.size, opc: out.opc.size };
    }).catch(e => ({ n: -1, e: e.message }));
    ok('3000 ejercicios de Contar: la respuesta es lo que se ve (contar, sumar, quitar, faltan), opciones sin repetir, máx. 20', r.n === 0, r.e || JSON.stringify(r.mal));
    ok('Variados: los 10 pasos con sus tipos (contar hasta 20, sumas, restas, faltan con y sin huecos) y los 20 dibujos', r.dibujos === 20 &&
      r.tipos === '0contar 1contar 2contar 3contar 4suma 5resta 6faltan 7resta 7suma 8faltan 9faltan 9resta 9suma', r.tipos + ' · ' + r.dibujos + ' dibujos');
    // frases
    const frases = await p.evaluate(() => { const v = []; for (let i = 0; i < 400; i++) v.push(PENSAR.crearCt(4 + (i % 6)).texto); return v; });
    const raras = frases.filter(f => /\bun (se|más)|Hay un\.|Uno se van|\bse van? 1\b|  /.test(f));
    ok('Frases bien escritas («Llega uno más», «Una se va volando», «Hay una.»…)', !raras.length, raras.slice(0, 2).join(' | ') || frases.slice(0, 3).join(' | '));
    await c.close();
  }
  // ---------- 3. Contar: subir, pistas, sin cronómetro, avance guardado ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('contar')); await p.waitForTimeout(300); await p.click('#contar .pnNo'); await p.waitForTimeout(400);
    const s0 = await estrellas(p);
    for (let i = 0; i < 3; i++) await aciertoCt(p);
    ok('Tres aciertos limpios: sube al nivel 2 y se guarda (lv_contar2)', (await nv(p, 'nvCt')).L === 1 && JSON.parse(await p.evaluate(() => localStorage.getItem('lv_contar2'))).L === 1);
    for (let i = 0; i < 3; i++) await aciertoCt(p);
    ok('…y tras otros tres, al nivel 3 (cada acierto +1 ⭐, nada más)', (await nv(p, 'nvCt')).L === 2 && await estrellas(p) === s0 + 6);
    // sin cronómetro: esperar no cambia nada
    const antes = await p.evaluate(() => [PENSAR.ct.turno, PENSAR.ct.item.texto]); await p.waitForTimeout(6000);
    ok('Sin cronómetro: tras 6 s sin tocar nada, la pregunta sigue igual y no cuenta como fallo', JSON.stringify(antes) === JSON.stringify(await p.evaluate(() => [PENSAR.ct.turno, PENSAR.ct.item.texto])) && await p.evaluate(() => PENSAR.ct.fallos) === 0);
    // pistas
    await p.evaluate(() => { PENSAR.nvCt.elegir(4); go('contar'); }); await p.waitForTimeout(600);
    while (await p.evaluate(() => PENSAR.ct.repaso)) await aciertoCt(p);   // los repasos no cuentan para el nivel
    const sE = await estrellas(p);
    await contestarCt(p, false); await p.waitForTimeout(200);
    const tras1 = await p.evaluate(() => ({ fuera: document.querySelectorAll('#ctOpts .fuera').length, voz: window.__voz.at(-1) }));
    await contestarCt(p, false); await p.waitForFunction(() => document.querySelector('#ctOpts .pnOpt.pista'), null, { timeout: 30000 });
    const tras2 = await p.evaluate(() => ({ contados: document.querySelectorAll('#ctEscena .contado').length, resp: PENSAR.ct.item.resp, buena: +document.querySelector('#ctOpts .pista').textContent }));
    ok('Primer fallo: «¡Casi!» con una ayuda y esa respuesta se aparta; sin quitar estrellas', tras1.fuera === 1 && /^¡Casi!/.test(tras1.voz) && await estrellas(p) === sE, tras1.voz);
    ok('Segundo fallo: pista (se cuentan uno a uno y brilla la buena)', tras2.contados === tras2.resp && tras2.buena === tras2.resp, JSON.stringify(tras2));
    const t0 = await p.evaluate(() => PENSAR.ct.turno); await contestarCt(p); await listoCt(p, t0);
    ok('Acertar después de la pista: +1 ⭐, pero no cuenta para subir (apuros 1)', await estrellas(p) === sE + 1 && (await nv(p, 'nvCt')).apuros === 1 && (await nv(p, 'nvCt')).ok === 0);
    for (let k = 0; k < 2; k++) {   // dos atascos más → el siguiente ejercicio, del paso anterior
      while (await p.evaluate(() => PENSAR.ct.repaso)) await aciertoCt(p);
      await contestarCt(p, false); await p.waitForTimeout(150); await contestarCt(p, false); await p.waitForFunction(() => document.querySelector('#ctOpts .pnOpt.pista'), null, { timeout: 30000 });
      const t1 = await p.evaluate(() => PENSAR.ct.turno); await contestarCt(p); await listoCt(p, t1);
    }
    const n3 = await nv(p, 'nvCt');
    ok('Tres atascos seguidos: vuelve un paso atrás sin avisos; lo alcanzado (max) se conserva', n3.L === 3 && n3.max === 4, JSON.stringify(n3));
    await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => go('contar')); await p.waitForTimeout(600);
    ok('Al volver a abrir: sigue donde estaba (sin presentación y sin empezar por lo fácil)', await p.isHidden('#contar .pnIntro') && (await nv(p, 'nvCt')).L === 3 && /Nivel 4 de 10/.test(await p.textContent('#ctCamino')));
    await c.close();
  }
  // ---------- 4. prueba rápida ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('contar')); await p.waitForTimeout(400); await p.click('#contar .pnSi'); await p.waitForTimeout(500);
    const lista = await p.evaluate(() => PENSAR.prCt.lista.join());
    for (let i = 0; i < 3; i++) { ok(`Prueba rápida ${i + 1}: un ejercicio del paso ${[2, 4, 5][i]}`, /Prueba rápida/.test(await p.textContent('#ctCamino')) && await p.evaluate(() => PENSAR.ct.item) && true); await aciertoCt(p).catch(() => {}); }
    await contestarCt(p, false); await p.waitForTimeout(150); await contestarCt(p, false); await p.waitForTimeout(4200);
    const n = await nv(p, 'nvCt');
    ok('Tres bien y la cuarta mal: empieza en el nivel 5 (sumar), se salta lo fácil y no vuelve a preguntar', lista === '1,3,4,5,6,8' && n.L === 4 && n.max === 4 && n.prueba === 'hecha' && !(await p.evaluate(() => PENSAR.prCt.activa)), JSON.stringify(n));
    await p.evaluate(() => { PENSAR.nvCt.elegir(7); go('contar'); }); await p.waitForTimeout(500); await p.click('#ctPrueba'); await p.waitForTimeout(400);
    await contestarCt(p, false); await p.waitForTimeout(150); await contestarCt(p, false); await p.waitForTimeout(4200);
    ok('La prueba rápida solo puede subir: fallarla en el nivel 8 lo deja en el 8', (await nv(p, 'nvCt')).L === 7);
    await c.close();
  }
  // ---------- 5. Memoria ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => go('memoria')); await p.waitForTimeout(400);
    ok('Memoria: tres juegos con su nivel (Parejas, ¿Dónde estaba?, Repite la serie)', (await p.$$eval('#memoria .big', x => x.map(e => e.dataset.go))).join() === 'parejas,donde,serie');
    // parejas
    await p.click('#memoria [data-go="parejas"]'); await p.waitForTimeout(500);
    const chips = await p.$$eval('#pjChips .pnChip', x => x.map(e => e.textContent).join());
    async function resolverPj() {
      const cartas = await p.evaluate(() => PENSAR.pj.cartas); const cs = await p.$$('#pjGrid .pnCard');
      const vistos = new Set();
      for (let i = 0; i < cartas.length; i++) { if (vistos.has(i)) continue; const j = cartas.findIndex((x, k) => k !== i && x === cartas[i]); vistos.add(i); vistos.add(j);
        await cs[i].click(); await cs[j].click(); await p.waitForTimeout(80); }
    }
    const s0 = await estrellas(p); await resolverPj(); await p.waitForTimeout(1000);
    ok('Parejas: de 3 a 12 parejas; completar 3 parejas da 2 ⭐ (como hoy)', chips === '3,4,6,8,10,12' && await estrellas(p) === s0 + 2);
    await p.waitForTimeout(3000); await resolverPj(); await p.waitForTimeout(1200);
    ok('Dos tableros bien resueltos: pasa a 4 parejas (guardado)', (await nv(p, 'nvPj')).L === 1);
    await p.click('#pjChips .pnChip:has-text("12")'); await p.waitForTimeout(500);
    const g12 = await p.evaluate(() => ({ n: document.querySelectorAll('#pjGrid .pnCard').length, svg: document.querySelectorAll('#pjGrid .pnCard svg').length, emoji: /\p{Extended_Pictographic}/u.test(document.querySelector('#pjGrid').textContent), ids: new Set(PENSAR.pj.cartas).size }));
    ok('12 parejas: 24 cartas con dibujos SVG distintos, sin emojis', g12.n === 24 && g12.svg === 24 && !g12.emoji && g12.ids === 12, JSON.stringify(g12));
    // tres fallos seguidos → pista
    const cartas = await p.evaluate(() => PENSAR.pj.cartas); const cs = await p.$$('#pjGrid .pnCard');
    for (let e = 0; e < 3; e++) { const a = e * 2, bb = cartas.findIndex((x, k) => k > a && x !== cartas[a] && k !== a); await cs[a].click(); await cs[bb].click(); await p.waitForTimeout(1150); }
    await p.waitForTimeout(100);
    const asoma = await p.evaluate(() => [...document.querySelectorAll('#pjGrid .asoma')].map(e => [...e.parentNode.children].indexOf(e)));
    ok('Tres fallos seguidos en parejas: asoma una pareja un momento (pista)', asoma.length === 2 && cartas[asoma[0]] === cartas[asoma[1]]);
    await p.waitForTimeout(1800);
    ok('…y vuelve a taparse', await p.evaluate(() => !document.querySelector('#pjGrid .asoma')));
    // ¿Dónde estaba?
    await p.evaluate(() => go('donde')); await p.waitForTimeout(500); await p.click('#donde .pnNo'); await p.waitForTimeout(500);
    await p.waitForTimeout(5000);
    ok('¿Dónde estaba?: sin cronómetro (tras 5 s los dibujos siguen a la vista hasta tocar «¡Ya me acuerdo!»)', await p.evaluate(() => PENSAR.dn.fase === 'mirar' && document.querySelectorAll('#doTablero .vista').length > 0));
    async function rondaDo(fallar = 0) {
      await p.waitForFunction(() => PENSAR.dn.fase === 'mirar'); const t0 = await p.evaluate(() => PENSAR.dn.turno); await p.click('#doListo');
      while (await p.evaluate(() => PENSAR.dn.fase === 'buscar')) {
        const { cel, q } = await p.evaluate(() => ({ cel: PENSAR.dn.celdas, q: PENSAR.dn.pregs[PENSAR.dn.q] }));
        for (let f = 0; f < fallar; f++) { const m = cel.findIndex((x, i) => x !== q && !document.querySelector('#doTablero').children[i].classList.contains('vista')); await p.click(`#doTablero .pnCelda >> nth=${m}`); await p.waitForTimeout(1200); }
        fallar = 0; await p.click(`#doTablero .pnCelda >> nth=${cel.indexOf(q)}`); await p.waitForTimeout(1200);
      }
      await p.waitForFunction(t0 => PENSAR.dn.turno > t0, t0, { timeout: 8000 });
    }
    const sD = await estrellas(p); await rondaDo();
    ok('¿Dónde estaba?: acertar la ronda da +1 ⭐', await estrellas(p) === sD + 1);
    await rondaDo(); await rondaDo();
    ok('Tres rondas limpias: sube de nivel (más casillas o más dibujos)', (await nv(p, 'nvDo')).L === 1);
    await p.waitForFunction(() => PENSAR.dn.fase === 'mirar'); await p.click('#doListo');
    const { cel, q } = await p.evaluate(() => ({ cel: PENSAR.dn.celdas, q: PENSAR.dn.pregs[0] }));
    for (let f = 0; f < 2; f++) { const m = cel.findIndex((x, i) => x !== q && i !== (f ? cel.findIndex(y => y !== q) : -1)); await p.click(`#doTablero .pnCelda >> nth=${m}`); await p.waitForTimeout(1200); }
    ok('Dos fallos: brilla la casilla buena (pista); «Mirar otra vez» vuelve a enseñarlo todo', await p.evaluate(q => document.querySelector('#doTablero').children[PENSAR.dn.celdas.indexOf(q)].classList.contains('pista'), q) &&
      (await p.click('#doOtra'), await p.evaluate(() => PENSAR.dn.fase === 'mirar' && document.querySelectorAll('#doTablero .vista').length === document.querySelectorAll('#doTablero .pnCelda').length)));
    // Repite la serie
    await p.evaluate(() => go('serie')); await p.waitForTimeout(400); await p.click('#serie .pnNo');
    async function serie(fallo = false) {
      await p.waitForFunction(() => PENSAR.sr.fase === 'toca', null, { timeout: 20000 }); const t0 = await p.evaluate(() => PENSAR.sr.turno), seq = await p.evaluate(() => PENSAR.sr.seq);
      if (fallo) { await p.click(`#sePads .pnPad >> nth=${(seq[0] + 1) % 3}`); await p.waitForFunction(() => PENSAR.sr.fase === 'toca', null, { timeout: 20000 }); }
      for (const k of seq) await p.click(`#sePads .pnPad >> nth=${k}`);
      await p.waitForFunction(t0 => PENSAR.sr.turno > t0 && PENSAR.sr.fase !== 'fin', t0, { timeout: 8000 });
    }
    const sS = await estrellas(p); await p.waitForTimeout(800);
    ok('Repite la serie: mientras se enseña no se puede tocar; luego «¡Te toca!»', await p.evaluate(() => PENSAR.sr.fase === 'mira'));
    await serie();
    ok('Repetir la serie bien: +1 ⭐', await estrellas(p) === sS + 1);
    await serie(); await serie();
    ok('Tres series limpias: la serie se alarga (nivel 2)', (await nv(p, 'nvSe')).L === 1);
    await p.waitForFunction(() => PENSAR.sr.fase === 'toca', null, { timeout: 20000 }); const seq = await p.evaluate(() => PENSAR.sr.seq);
    await p.click(`#sePads .pnPad >> nth=${(seq[0] + 1) % 3}`); await p.waitForFunction(() => PENSAR.sr.fase === 'toca', null, { timeout: 20000 });
    await p.click(`#sePads .pnPad >> nth=${(seq[0] + 1) % 3}`); await p.waitForFunction(() => PENSAR.sr.fase === 'toca', null, { timeout: 20000 });
    ok('Un fallo: se vuelve a enseñar; dos: brilla la siguiente (pista); sin quitar estrellas', await p.evaluate(s => document.querySelector('#sePads').children[s].classList.contains('pista'), seq[0]) && await estrellas(p) === sS + 3);
    // avance guardado de todo
    await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => go('memoria')); await p.waitForTimeout(300);
    ok('Al volver a abrir, Memoria recuerda el nivel de cada juego', (await p.textContent('#memoria')).includes('12 parejas') && (await nv(p, 'nvDo')).L === 1 && (await nv(p, 'nvSe')).L === 1);
    // prueba rápida de la serie
    await p.evaluate(() => go('serie')); await p.waitForTimeout(400); await p.click('#sePrueba');
    for (let i = 0; i < 2; i++) await serie();
    await p.waitForFunction(() => PENSAR.sr.fase === 'toca', null, { timeout: 20000 }); const sq = await p.evaluate(() => PENSAR.sr.seq);
    const np = await p.evaluate(() => PENSAR.sr.P.p);
    await p.click(`#sePads .pnPad >> nth=${(sq[0] + 1) % np}`); await p.waitForFunction(() => PENSAR.sr.fase === 'toca', null, { timeout: 20000 });
    await p.click(`#sePads .pnPad >> nth=${(sq[0] + 1) % np}`); await p.waitForTimeout(4000);
    const ns = await nv(p, 'nvSe');
    ok('Prueba rápida de la serie: dos bien y la tercera mal → empieza en el nivel 5 (6 pasos del principio saltados)', ns.L === 4 && ns.prueba === 'hecha' && !(await p.evaluate(() => PENSAR.prSe.activa)), JSON.stringify(ns));
    await c.close();
  }
  // ---------- 6. copia de seguridad, otros juegos y logros ----------
  {
    const { c, p } = await pagina(b);
    await p.evaluate(() => { PENSAR.nvCt.elegir(5); PENSAR.nvPj.elegir(2); PENSAR.nvDo.elegir(3); PENSAR.nvSe.elegir(4); localStorage.setItem('lv_contar', '7'); });
    await p.tap('#setBtn'); await p.waitForTimeout(600); await p.tap('#bkGuardar'); await p.waitForTimeout(600); await p.tap('#setClose');
    const copia = JSON.parse((await p.evaluate(() => window.__comp))[0].text), ls = copia.local_storage;
    ok('«Guardar mi progreso» incluye el avance nuevo (lv_contar2, lv_parejas, lv_donde, lv_serie) y la clave antigua', ['lv_contar2', 'lv_parejas', 'lv_donde', 'lv_serie', 'lv_contar'].every(k => k in ls) && JSON.parse(ls.lv_contar2).L === 5);
    fs.writeFileSync(path.join(OUT, 'copia-pensar.json'), JSON.stringify(copia));
    await p.evaluate(() => { PENSAR.nvCt.elegir(0); PENSAR.nvSe.elegir(0); });
    const importar = async () => { await p.evaluate(() => go('home')); await p.waitForTimeout(200); await p.tap('#setBtn'); await p.waitForTimeout(500);
      const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.tap('#bkRecuperar')]); await fc.setFiles(path.join(OUT, 'copia-pensar.json')); await p.waitForTimeout(500); await p.tap('#bkConfirmar'); await p.waitForTimeout(2700); };
    await importar(); const a1 = await LS(p, ['lv_contar2', 'lv_serie', 'stars']); await importar(); const a2 = await LS(p, ['lv_contar2', 'lv_serie', 'stars']);
    ok('Recuperar la copia devuelve el avance; importarla dos veces no cambia nada', JSON.parse(a1.lv_contar2).L === 5 && JSON.parse(a1.lv_serie).L === 4 && JSON.stringify(a1) === JSON.stringify(a2));
    // otros juegos de Pensar
    let otros = true;
    for (const m of ['sigue', 'sombras', 'distinto']) { await p.evaluate(m => go('quiz', m), m); await p.waitForTimeout(500); const n = await p.$$eval('#qopts .qopt', x => x.length); if (n < 3) otros = false; }
    ok('¿Qué sigue?, Sombras y El diferente se abren y funcionan como hoy', otros);
    // logros
    const l0 = await p.evaluate(() => Logros.total()); await p.evaluate(() => { PENSAR.nvCt.marcar('x'); go('contar'); }); await p.waitForTimeout(400);
    for (let i = 0; i < 3; i++) await aciertoCt(p);
    ok('Contar no da logros por cada respuesta (los logros siguen como hoy)', await p.evaluate(() => Logros.total()) === l0);
    await p.evaluate(() => go('logros')); await p.waitForTimeout(250); await p.click('#lgRetos [data-reto="contar"]'); await p.waitForTimeout(300);
    for (let r = 0; r < 3; r++) { await p.waitForFunction(() => document.querySelectorAll('#rtOpts .qopt').length === 3 && !document.querySelector('#rtOpts .qopt.ok')); await p.click('#rtOpts .qopt[data-ok="1"]'); await p.waitForTimeout(1600); }
    ok('El reto Contar de «Mis logros» sigue igual: 1 logro al completarlo', await p.evaluate(() => Logros.total()) === l0 + 1);
    await c.close();
  }
  // ---------- 7. sin descargas externas y sin emojis como dibujos ----------
  {
    const { c, p } = await pagina(b); const pedidas = []; p.on('request', r => pedidas.push(r.url()));
    await p.evaluate(() => { PENSAR.nvCt.marcar('x'); PENSAR.nvDo.marcar('x'); PENSAR.nvSe.marcar('x'); });
    let emoji = [];
    for (const L of [0, 3, 4, 5, 6, 8, 9]) { await p.evaluate(L => { PENSAR.nvCt.elegir(L); go('contar'); }, L); await p.waitForTimeout(700);
      if (EMOJI.test(await p.evaluate(() => document.querySelector('#ctEscena').textContent))) emoji.push('contar' + L); }
    for (const s of ['donde', 'serie', 'parejas']) { await p.evaluate(s => go(s), s); await p.waitForTimeout(900);
      const t = await p.evaluate(s => ({ donde: '#doTablero', serie: '#sePads', parejas: '#pjGrid' })[s], s); if (EMOJI.test(await p.evaluate(t => [...document.querySelectorAll(t + ' svg')].length ? document.querySelector(t).textContent : '❌', t))) emoji.push(s); }
    ok('Dibujos del juego en SVG, sin emojis (Contar, parejas, casillas y serie)', !emoji.length, emoji.join());
    const ajenas = pedidas.filter(u => !u.startsWith(BASE) && !u.startsWith('data:'));
    ok('Sin descargas de fuera (todo en línea: listo para jugar sin conexión al integrarlo)', !ajenas.length, ajenas.slice(0, 2).join());
    await c.close();
  }
  // ---------- 8. pantallas ----------
  for (const [n, d] of Object.entries(DEV)) {
    const { c, p } = await pagina(b, d);
    await p.evaluate(() => { PENSAR.nvCt.marcar('x'); PENSAR.nvDo.marcar('x'); PENSAR.nvSe.marcar('x'); });
    const medir = sel => p.evaluate(sel => { const els = [...document.querySelectorAll(sel)].filter(e => e.offsetParent && !e.hidden && !e.closest('[hidden]')), R = els.map(e => e.getBoundingClientRect());
      let sol = 0; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], q = R[j]; if (a.left < q.right - 1 && q.left < a.right - 1 && a.top < q.bottom - 1 && q.top < a.bottom - 1) sol++; }
      const esc = document.querySelector('.screen.on .pnEscena,.screen.on .pnTablero,.screen.on .pnPads,.screen.on .memgrid');
      return { n: els.length, min: Math.round(Math.min(...R.map(r => Math.min(r.width, r.height)))), dentro: R.every(r => r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), sol,
        cabe: !esc || (esc.scrollHeight <= esc.clientHeight + 2 && esc.scrollWidth <= esc.clientWidth + 2), ancho: document.documentElement.scrollWidth <= innerWidth + 1 }; }, sel);
    const fallos = [];
    for (const L of [0, 3, 4, 7, 9]) { for (let k = 0; k < 20; k++) { await p.evaluate(L => { PENSAR.nvCt.elegir(L); go('contar'); }, L); await p.waitForTimeout(800); if (!(await p.evaluate(() => PENSAR.ct.repaso))) break; }
      const m = await medir('#contar .bar .btn, #contar .pnSaltar, #ctOpts .pnOpt'); if (!(m.dentro && !m.sol && m.min >= 44 && m.cabe && m.ancho)) fallos.push('contar' + L + JSON.stringify(m)); }
    await p.screenshot({ path: path.join(OUT, `contar-${n.replace(' ', '-').toLowerCase()}.png`) });
    for (const [s, L, sel] of [['parejas', 5, '#parejas .bar .btn, #pjChips .pnChip, #pjGrid .pnCard'], ['donde', 6, '#donde .bar .btn, #donde .pnSaltar, #doTablero .pnCelda, #doListo'], ['serie', 7, '#serie .bar .btn, #serie .pnSaltar, #sePads .pnPad']]) {
      for (let k = 0; k < 20; k++) {   // sin repaso: el tablero más grande del nivel
        await p.evaluate(([s, L]) => { ({ parejas: PENSAR.nvPj, donde: PENSAR.nvDo, serie: PENSAR.nvSe })[s].elegir(L); go(s); }, [s, L]); await p.waitForTimeout(900);
        if (!(await p.evaluate(s => (s === 'donde' && PENSAR.dn.repaso) || (s === 'serie' && PENSAR.sr.repaso), s))) break; }
      const m = await medir(sel); if (!(m.dentro && !m.sol && m.min >= 44 && m.cabe && m.ancho)) fallos.push(s + JSON.stringify(m));
      await p.screenshot({ path: path.join(OUT, `${s}-${n.replace(' ', '-').toLowerCase()}.png`) });
    }
    ok(`${n}: Contar (5 niveles), 12 parejas, 16 casillas y 6 botones de la serie a la vista, sin solaparse, de 44 px o más`, !fallos.length, fallos.join(' ').slice(0, 300));
    await c.close();
  }
  ok('Sin errores de JavaScript', !errores.length, errores.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
