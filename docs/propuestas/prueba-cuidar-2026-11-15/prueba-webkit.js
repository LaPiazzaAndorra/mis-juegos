#!/usr/bin/env node
/* =====================================================================
   El salón en WebKit, el motor de Safari (16/11/2026): WebKitGTK controlado por WebDriver, con el tamaño de un iPhone
   (no es Safari del iPhone, pero es su mismo motor: detección de toques, lienzos, capas). Arrastra con el «dedo»
   (puntero; WebKitGTK no admite puntero táctil por WebDriver y usa el del ratón) y toca cada mueble: debe moverse y
   responder (animación y bocadillo, luz o el panel de la merienda).

   Requisitos (una vez):  apt-get install -y webkit2gtk-driver xvfb
                          Xvfb :99 &   DISPLAY=:99 WebKitWebDriver --port=4444 &
                          python3 -m http.server 8765 &   (desde la raíz)
   Uso:  node docs/propuestas/prueba-cuidar-2026-11-15/prueba-webkit.js [con|sin]   («sin»: desactiva los estilos de la capa de lectura)
   ===================================================================== */
const WD = 'http://localhost:4444';
const rq = async (m, u, b) => { const r = await fetch(WD + u, { method: m, headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const j = await r.json(); if (j.value && j.value.error) throw new Error(u + ': ' + j.value.error + ' ' + j.value.message); return j.value; };
const SIN = process.argv[2] === 'sin', TIPO = process.argv[3] || 'touch';
(async () => {
  const s = await rq('POST', '/session', { capabilities: { alwaysMatch: { 'webkitgtk:browserOptions': { binary: '/usr/lib/x86_64-linux-gnu/webkit2gtk-4.1/MiniBrowser', args: ['--automation'] } } } });
  const id = s.sessionId, S = '/session/' + id;
  const ev = (f, ...a) => rq('POST', S + '/execute/sync', { script: `return (${f}).apply(null, arguments)`, args: a });
  const evA = (f, ...a) => rq('POST', S + '/execute/async', { script: `const cb = arguments[arguments.length - 1]; Promise.resolve((${f}).apply(null, [...arguments].slice(0, -1))).then(cb, e => cb('ERR ' + e))`, args: a });
  try {
    await rq('POST', S + '/window/rect', { width: 390, height: 844 });
    await rq('POST', S + '/url', { url: process.env.COPIA_URL || 'http://localhost:8765/docs/propuestas/prueba-cuidar-2026-11-15/index.html' });   // otra copia: COPIA_URL=…
    await new Promise(r => setTimeout(r, 1500));
    console.log('motor:', await ev(() => navigator.userAgent.match(/AppleWebKit\/[\d.]+.*?(Version\/[\d.]+)?/)[0]), '· tamaño', await ev(() => innerWidth + '×' + innerHeight));
    if (SIN) { await ev(() => { document.documentElement.classList.remove('lectura'); }); }
    await ev(() => { localStorage.clear(); Avatar.guardar({ piel: 'dorada', ojos: { color: 'azul' }, pelo: { estilo: 'coleta', color: 'chocolate' }, ropa: 'hada', accesorios: ['alas', 'varita'] }); localStorage.setItem('scKey', '"casa"'); });
    await rq('POST', S + '/refresh', {}); await new Promise(r => setTimeout(r, 1500));
    await ev(() => go('scene')); await new Promise(r => setTimeout(r, 2500));
    const accion = async acts => rq('POST', S + '/actions', { actions: [{ type: 'pointer', id: 'p1', parameters: { pointerType: TIPO }, actions: acts }] });
    const tocar = (x, y) => accion([{ type: 'pointerMove', duration: 0, x: Math.round(x), y: Math.round(y) }, { type: 'pointerDown', button: 0 }, { type: 'pause', duration: 60 }, { type: 'pointerUp', button: 0 }]);
    const arrastrar = (a, d) => accion([{ type: 'pointerMove', duration: 0, x: Math.round(a[0]), y: Math.round(a[1]) }, { type: 'pointerDown', button: 0 }, { type: 'pointerMove', duration: 300, x: Math.round(d[0]), y: Math.round(d[1]) }, { type: 'pointerUp', button: 0 }]);
    // lo que registra el juego
    await ev(() => { window.__ev = []; ['pointerdown', 'pointerup', 'touchstart'].forEach(t => addEventListener(t, e => window.__ev.push(t + ':' + (e.pointerType || '') + ':' + (e.target.className || e.target.tagName)), true)); });
    const res = {};
    for (const oid of ['mesa', 'sofa', 'estanteria', 'cojin-rosa', 'lampara', 'cojin-lila']) {
      await ev(i => { const o = MM.estado().objetos.find(q => q.id === i); MM.mirar(o.x, Math.min(700, o.y - 120), true); }, oid); await new Promise(r => setTimeout(r, 500));
      const q = await ev(i => { const el = document.querySelector(`.mm-obj[data-id="${i}"][data-capa="detras"]`); const r = el.getBoundingClientRect(), bd = document.getElementById('board').getBoundingClientRect();
        for (let a = 0; a < 900; a++) { const x = r.left + r.width * (.1 + .8 * ((a * 37) % 100) / 100), y = r.top + r.height * (.1 + .8 * ((a * 61) % 100) / 100); if (x < bd.left + 52 || x > bd.right - 52 || y < bd.top + 56 || y > bd.bottom - 6) continue; if (MM.queToca(x, y) === el.dataset.uid) return [x, y]; } return null; }, oid);
      if (!q) { res[oid] = 'sin punto'; continue; }
      await ev(() => document.querySelectorAll('.mm-panel').forEach(e => e.remove())); await new Promise(r => setTimeout(r, 1000)); await ev(() => document.querySelectorAll('.mm-panel').forEach(e => e.remove()));
      const p0 = await ev(i => JSON.stringify(MM.estado().objetos.find(o => o.id === i)), oid);
      await ev(() => { window.__ev = []; });
      await arrastrar(q, [q[0] + 50, q[1] + 25]); await new Promise(r => setTimeout(r, 600));
      const p1 = await ev(i => JSON.stringify(MM.estado().objetos.find(o => o.id === i)), oid);
      await tocar(q[0] + 50, q[1] + 25); await new Promise(r => setTimeout(r, 600));
      // un toque: ¿responde? (animación + bocadillo, luz o panel)
      await ev(() => document.querySelectorAll('.mm-panel').forEach(e => e.remove()));
      const q2 = await ev(i => { const el = document.querySelector(`.mm-obj[data-id="${i}"][data-capa="detras"]`); const r = el.getBoundingClientRect(), bd = document.getElementById('board').getBoundingClientRect();
        for (let a = 0; a < 900; a++) { const x = r.left + r.width * (.1 + .8 * ((a * 37) % 100) / 100), y = r.top + r.height * (.1 + .8 * ((a * 61) % 100) / 100); if (x < bd.left + 52 || x > bd.right - 52 || y < bd.top + 56 || y > bd.bottom - 6) continue; if (MM.queToca(x, y) === el.dataset.uid) return [x, y]; } return null; }, oid);
      const luz0 = await ev(i => !!MM.estado().objetos.find(o => o.id === i).luz, oid); if (!q2) { res[oid] = 'sin punto'; continue; } await tocar(q2[0], q2[1]); let respuesta = null;
      for (let k = 0; k < 30 && !respuesta; k++) { await new Promise(r => setTimeout(r, 200)); respuesta = await ev((i, l0) => { const el = document.querySelector(`.mm-obj[data-id="${i}"][class*="mm-j-"]`), b = document.querySelector('.mm-bocadillo.on'); return b && (el || !!MM.estado().objetos.find(o => o.id === i).luz !== l0 || document.querySelector('.mm-panel')) ? b.textContent : null; }, oid, luz0); }
      res[oid] = { responde: respuesta, movido: p0 !== p1, sel: await ev(() => { const s = document.querySelector('.mm-obj.sel'); return s && s.dataset.id; }), eventos: (await ev(() => window.__ev.slice(0, 2))).join(' ') };
    }
    console.log(SIN ? 'SIN capa' : 'CON capa', TIPO, JSON.stringify(res, null, 1));
    const bien = Object.values(res).every(v => typeof v === 'object' && v.responde && v.movido);
    console.log(bien ? '✅ En WebKit, todos los muebles del salón se mueven con el dedo y responden al tocarlos' : '❌ Algún mueble no se mueve o no responde (ver arriba)');
    process.exitCode = bien ? 0 : 1;
    console.log('errores:', await ev(() => (window.__errores || []).join(' | ')));
  } catch (e) { console.log('ERROR', e.message); }
  await rq('DELETE', S);
})();
