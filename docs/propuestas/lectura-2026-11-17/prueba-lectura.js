#!/usr/bin/env node
/* =====================================================================
   Prueba de la norma de lectura (D-038) sobre una copia que la carga (por defecto, la de cuidar a la muñeca)

   Uso (desde la raíz):
     python3 -m http.server 8765 &
     node docs/propuestas/lectura-2026-11-17/prueba-lectura.js [URL de la copia] [carpeta-capturas]

   Las pantallas se recorren como las abre la niña: con los botones de los menús y su dato (16/11).
   Comprueba: la capa está activa; los textos de la niña se ven en MAYÚSCULAS con tildes y Ñ (inicio, menús, Vestir, Mi
   Mundo, avisos, mensajes); los de adultos y los técnicos, no (Ajustes, mensajes de la copia de seguridad, cinta de
   pruebas); las frases simplificadas; la voz de los mensajes; NINGÚN texto de la niña cortado, con «…», fuera de la
   pantalla o por debajo de 16 px en todas las pantallas y en los avisos, misiones, diálogos y mensajes, en tres iPhone
   (375 × 667, 390 × 844, 430 × 932); el contraste (4,5:1 o más sobre su fondo liso); las respuestas no cambian (Contar
   suma su estrella) y la capa no guarda nada; sin errores.
   ===================================================================== */
const path = require('path'), os = require('os'), fs = require('fs');
const { execSync } = require('child_process');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const URL = process.argv[2] || 'http://localhost:8765/docs/propuestas/prueba-cuidar-2026-11-15/index.html';
const OUT = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'prueba-lectura-')); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, x = '') => { res.push(!!c); console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' · ' + x : '')); };
const HADA = { piel: 'dorada', ojos: { color: 'azul' }, pelo: { estilo: 'coleta', color: 'chocolate' }, ropa: 'hada', accesorios: ['alas', 'varita'] };
const INIT = () => { window.__voz = []; };

// textos de la niña visibles dentro de «raiz»: cortados, con «…», fuera de la pantalla o de menos de 16 px; y contraste
function revisar(raiz) {
  const out = [], W = innerWidth, FUERA = '#settings,#bkModal,#adModal,#offlineAviso,#pruebasCinta,svg,.adulto';
  const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a] = m.map(Number); if (a === 0) return null;
    const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  for (const base of document.querySelectorAll(raiz)) {
    const w = document.createTreeWalker(base, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const n = w.currentNode, t = n.nodeValue.trim(); if (!/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(t)) continue;
      const el = n.parentElement; if (!el || !el.getClientRects().length || el.closest(FUERA)) continue; const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || +s.opacity === 0) continue;
      let vis = true; for (let a = el; a; a = a.parentElement) { const sa = getComputedStyle(a); if (sa.display === 'none' || +sa.opacity === 0 || sa.visibility === 'hidden') { vis = false; break; } } if (!vis) continue;
      const rg = document.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()]; if (!rs.length) continue;
      let corta = false, desplaza = false, fondo = null;
      for (let a = el; a && a !== document.documentElement; a = a.parentElement) { const sa = getComputedStyle(a), ra = a.getBoundingClientRect();
        if (fondo === null) { if (sa.backgroundImage !== 'none') fondo = false; else { const l = lum(sa.backgroundColor); if (l !== null && +sa.backgroundColor.split(',')[3] !== 0 && !/,\s*0?\.\d+\)$/.test(sa.backgroundColor)) fondo = l; } }
        if (/auto|scroll/.test(sa.overflowX + sa.overflowY)) { desplaza = true; continue; }
        if (sa.textOverflow === 'ellipsis' && a.scrollWidth > a.clientWidth + 1) corta = true;
        if (!desplaza && /hidden|clip/.test(sa.overflowX + sa.overflowY) && rs.some(r => r.left < ra.left - 1 || r.right > ra.right + 1 || r.top < ra.top - 2 || r.bottom > ra.bottom + 2)) corta = true; }
      const fuera = !desplaza && rs.some(r => r.right > W + 1 || r.left < -1), fsz = parseFloat(s.fontSize);
      const lt = lum(s.color), contraste = typeof fondo === 'number' && lt !== null ? (Math.max(lt, fondo) + .05) / (Math.min(lt, fondo) + .05) : null;
      const malo = [corta && 'cortado', fuera && 'fuera', fsz < 16 && fsz + 'px', contraste !== null && contraste < 4.5 && 'contraste ' + contraste.toFixed(1)].filter(Boolean);
      if (malo.length) out.push(`${t.slice(0, 32)} (${malo.join(', ')})`); }
  }
  return [...new Set(out)];
}

(async () => {
  const b = await pw.chromium.launch(); const errs = [];
  const nueva = async vp => { const c = await b.newContext({ viewport: { width: vp[0], height: vp[1] }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); await c.addInitScript(INIT);
    const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); return { c, p }; };
  const preparar = async (p, k = 'habitacion') => { await p.goto(URL); await p.evaluate(([h, k]) => { localStorage.clear(); Avatar.guardar(h); localStorage.setItem('scKey', JSON.stringify(k)); }, [HADA, k]); await p.reload(); await p.waitForTimeout(800); };
  const ver = (p, sel) => p.evaluate(s => [...document.querySelectorAll(s)].filter(e => e.getClientRects().length).map(e => e.innerText).join(' ¦ '), sel);

  // ---------- mayúsculas, tildes y Ñ; zona de adultos ----------
  let { c, p } = await nueva([390, 844]);
  // la capa no guarda nada: ni en su código, ni en la práctica (los mismos datos con la capa y sin ella)
  const codigo = fs.readFileSync(path.join(__dirname, 'lectura.js'), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  const datos = async (sin) => { await p.goto(URL); await p.evaluate(() => localStorage.clear());
    if (sin) await p.route('**/lectura.js', r => r.fulfill({ body: '' })); else await p.unroute('**/lectura.js').catch(() => {});
    await p.reload(); await p.waitForTimeout(1200); await p.evaluate(() => { go('dress'); }); await p.waitForTimeout(800); await p.evaluate(() => { go('home'); }); await p.waitForTimeout(300);
    return p.evaluate(() => JSON.stringify(Object.keys(localStorage).sort().map(k => [k, k === 'avatar_draft' ? '' : localStorage.getItem(k)]))); };
  const sinCapa = await datos(true), conCapa = await datos(false);
  ok('La capa está activa y no guarda nada (su código no usa localStorage, store ni IndexedDB; los mismos datos con ella y sin ella)',
    await p.evaluate(() => document.documentElement.classList.contains('lectura')) && !/localStorage|store\.|indexedDB/.test(codigo) && sinCapa === conCapa, `${JSON.parse(conCapa).length} claves`);
  await preparar(p);
  const inicio = await ver(p, '#home .big');
  ok('Inicio en MAYÚSCULAS', /PINTAR/.test(inicio) && /JUGAR A SER/.test(inicio) && /MIS LOGROS/.test(inicio) && !/[a-zñ]/.test(inicio), inicio);
  await p.evaluate(() => go('m-role')); await p.waitForTimeout(800);
  const rol = await ver(p, '#m-role .big');
  ok('Tildes conservadas en mayúsculas (HELADERÍA)', /HELADERÍA/.test(rol), rol);
  await p.evaluate(() => go('m-paint')); await p.waitForTimeout(800);
  ok('Frases más breves: «Colorear dibujos» → «COLOREAR»', /COLOREAR/.test(await ver(p, '#m-paint .big')) && !/DIBUJOS COLOREAR|COLOREAR DIBUJOS/.test(await ver(p, '#m-paint .big')));
  await p.evaluate(() => go('dress')); await p.waitForTimeout(1200);
  const vestir = await ver(p, '#dtabs .btn');
  ok('Botones de Vestir en MAYÚSCULAS', /PIEL/.test(vestir) && /ROPA/.test(vestir) && !/[a-zñ]/.test(vestir), vestir);
  // mensaje simplificado, con Ñ y con voz (sin emojis)
  await p.evaluate(() => { window.__voz = []; window.say = t => window.__voz.push(t); toast('Crea y guarda tu personaje en «Vestir» 👗'); }); await p.waitForTimeout(400);
  const ms = await p.evaluate(() => ({ t: document.getElementById('toast').innerText.replace(/\s+/g, ' '), v: window.__voz.join(' | ') }));
  ok('Mensaje breve, en MAYÚSCULAS con Ñ y también con voz', ms.t === 'PRIMERO, VISTE A TU MUÑECA 👗' && /primero, viste a tu muñeca/.test(ms.v) && !/👗/.test(ms.v), JSON.stringify(ms));
  await p.evaluate(() => { window.__voz = []; toast('¡Copia guardada! 📁'); }); await p.waitForTimeout(400);
  const ad = await p.evaluate(() => ({ t: document.getElementById('toast').innerText.replace(/\s+/g, ' '), v: window.__voz.length }));
  ok('Mensaje de adultos (copia de seguridad): sin cambios, sin mayúsculas ni voz', ad.t === '¡Copia guardada! 📁' && ad.v === 0, JSON.stringify(ad));
  await p.evaluate(() => go('home')); await p.waitForTimeout(400); await p.tap('#setBtn'); await p.waitForTimeout(600);
  const aj = await p.evaluate(() => document.getElementById('settings').innerText);
  ok('Ajustes (zona de adultos) con su formato habitual', /Voces del dispositivo/.test(aj), aj.slice(0, 60).replace(/\s+/g, ' '));
  await p.tap('#setClose').catch(() => {});
  ok('La cinta de pruebas (técnica) sin cambios', await p.evaluate(() => /datos propios/.test(document.getElementById('pruebasCinta').innerText)));
  // Mi Mundo: aviso «TENGO SUEÑO» con su dibujo, y la pregunta «PONME EL PIJAMA»
  await p.evaluate(() => go('scene')); await p.waitForTimeout(1800);
  await p.evaluate(() => { MM.necesidades().sueno = 20; MM.necesidades().avisado = {}; MM.avanzar(1); }); await p.waitForTimeout(500);
  const av = await p.evaluate(() => { const a = document.querySelector('.mm-aviso'); return a && { t: a.innerText.trim(), img: !!a.querySelector('img').naturalWidth }; });
  ok('Aviso de Mi Mundo: «TENGO SUEÑO», con su dibujo', av && av.t === 'TENGO SUEÑO' && av.img, JSON.stringify(av));
  await p.screenshot({ path: path.join(OUT, '1-aviso.png') });
  await p.evaluate(() => document.querySelectorAll('.mm-aviso').forEach(e => e.remove()));
  await p.evaluate(() => { const c = MM.estado().objetos.find(o => o.id === 'cama'); MM.mirar(c.x, 700); }); await p.waitForTimeout(800);
  const cama = await p.$('.mm-obj[data-id=cama][data-capa=detras]').then(e => e.boundingBox()); await p.mouse.click(cama.x + cama.width * .4, cama.y + cama.height * .55); await p.waitForTimeout(4500);
  const pr = await p.evaluate(() => ({ t: (document.querySelector('.mm-pregunta p') || {}).innerText, b: [...document.querySelectorAll('.mm-pregunta button')].map(x => x.innerText.trim()).join(' | ') }));
  ok('Diálogo del pijama: «PONME EL PIJAMA» y botones con acciones concretas', pr.t === 'PONME EL PIJAMA' && pr.b === '👗 PONER EL PIJAMA | ▶️ SEGUIR JUGANDO', JSON.stringify(pr));
  await p.screenshot({ path: path.join(OUT, '2-pijama.png') });
  await c.close();

  // ---------- nada cortado, letra de 16 px o más y buen contraste, en tres iPhone ----------
  for (const vp of [[375, 667], [390, 844], [430, 932]]) {
    ({ c, p } = await nueva(vp)); await preparar(p);
    const mal = [];
    // las pantallas, como las abre la niña: cada botón de los menús con su dato (p. ej. obs(sombras), ice(pedidos));
    // las pantallas internas que necesitan un dato no se abren a la fuerza (16/11: abrirlas así daba errores falsos)
    const destinos = await p.evaluate(() => { const v = new Map([['home', undefined]]); document.querySelectorAll('[data-go]').forEach(b => { const k = b.dataset.go + '|' + (b.dataset.arg || ''); if (!v.has(k) && document.getElementById(b.dataset.go)) v.set(k, [b.dataset.go, b.dataset.arg]); }); return [...v.values()].filter(Boolean).concat([['home']]); });
    for (const [id, arg] of destinos) {
      await p.evaluate(([i, a]) => go(i, a), [id, arg]); await p.waitForTimeout(1100); (await p.evaluate(revisar, `#${id}`)).forEach(m => mal.push(`${id}${arg ? '(' + arg + ')' : ''}: ${m}`)); }
    // lo que aparece al jugar: misiones (con su instrucción), avisos, diálogos, panel de misiones y mensajes
    await p.evaluate(() => go('scene')); await p.waitForTimeout(1500);
    const estados = [
      ['misión «Guarda los juguetes»', () => MM.empezar('guardar-juguetes')],
      ['panel de misiones', () => { MM.dejar(); document.getElementById('mmMisiones').click(); }],
      ['aviso', () => { document.querySelectorAll('.mm-panel').forEach(e => e.remove()); MM.necesidades().diversion = 20; MM.necesidades().avisado = {}; MM.avanzar(1); }],
      ['mensaje', () => toast('No cabe más en Mis dibujos 😢\nPide ayuda a un adulto.')],
    ];
    for (const [n, f] of estados) { await p.evaluate(f); await p.waitForTimeout(900); (await p.evaluate(revisar, '#scene, #toast')).forEach(m => mal.push(`${n}: ${m}`)); }
    await p.click('#scenePick .btn[data-k=casa]'); await p.waitForTimeout(1500);
    await p.evaluate(() => MM.empezar('merienda')); await p.waitForTimeout(1000); (await p.evaluate(revisar, '#scene')).forEach(m => mal.push(`misión «Prepara la merienda»: ${m}`));
    if (vp[0] === 375) await p.screenshot({ path: path.join(OUT, '3-merienda-iphone-pequeno.png') });
    ok(`iPhone ${vp.join(' × ')}: ningún texto de la niña cortado, con «…», fuera de la pantalla, de menos de 16 px ni con poco contraste`, !mal.length, mal.slice(0, 6).join(' · ') || 'todo bien');
    await c.close();
  }

  // ---------- las respuestas no cambian ----------
  ({ c, p } = await nueva([390, 844])); await preparar(p);
  if (await p.evaluate(() => !!window.PENSAR)) {
    await p.evaluate(() => go('contar')); await p.waitForTimeout(900);
    if (await p.isVisible('#contar .pnNo')) { await p.click('#contar .pnNo'); await p.waitForTimeout(600); }
    await p.waitForFunction(() => PENSAR.ct.item && !PENSAR.ct.ocupado && document.querySelectorAll('#ctOpts .pnOpt').length >= 3, null, { timeout: 15000 });
    const s0 = await p.evaluate(() => stars), resp = await p.evaluate(() => PENSAR.ct.item.resp);
    await p.click(`#ctOpts .pnOpt:has-text("${resp}") >> nth=0`, { force: true }); await p.waitForTimeout(1500);
    ok('Las respuestas no cambian: Contar acepta la correcta y suma su estrella', await p.evaluate(() => stars) === s0 + 1, `respuesta ${resp}`);
  }
  await c.close();
  ok('Sin errores de JavaScript', !errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(`\n${res.every(Boolean) ? '✅' : '❌'} ${res.filter(Boolean).length}/${res.length} comprobaciones correctas · capturas en ${OUT}`);
  process.exit(res.every(Boolean) ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
