/* Mi Mundo de Juegos · jugar sin conexión (generado junto a sw.js; no editar a mano en main)
   Registra el service worker y descarga las piezas de la muñeca a la caché de esta versión. En el inicio, un aviso
   pequeño dice cómo va: «Descargando para jugar sin conexión… 40 %» → «✅ Lista para jugar sin conexión». No toca los
   datos guardados. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http') || !window.caches) return;
  const C = 'mis-juegos-' + OFFLINE.version, todos = OFFLINE.basico.concat(OFFLINE.piezas);
  const aviso = document.createElement('div'); aviso.id = 'offlineAviso';
  aviso.style.cssText = 'position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:50;' +
    'background:#fff;border-radius:999px;padding:8px 16px;font:700 15px system-ui,sans-serif;color:#5a4a6a;box-shadow:0 3px 12px rgba(0,0,0,.15);' +
    'display:none;align-items:center;gap:10px;white-space:nowrap';
  document.body.appendChild(aviso);
  const enInicio = () => { const h = document.getElementById('home'); return !h || h.classList.contains('on'); };
  let texto = '', boton = null;
  function poner(t, b) {
    texto = t; boton = b || null;
    aviso.innerHTML = ''; const s = document.createElement('span'); s.textContent = t; aviso.appendChild(s);
    if (b) { const x = document.createElement('button'); x.textContent = b.texto; x.className = 'btn'; x.style.cssText = 'font:800 15px system-ui;padding:6px 12px;min-height:40px'; x.onclick = b.accion; aviso.appendChild(x); }
    mostrar();
  }
  function mostrar() { aviso.style.display = texto && enInicio() ? 'flex' : 'none'; }
  new MutationObserver(mostrar).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  window.OfflineEstado = { version: OFFLINE.version, listo: false, texto: () => texto };

  async function contar(c) {
    let n = 0; for (const u of todos) if (await c.match(new URL(u, location.href).href)) n++;
    return n;
  }
  let descargando = false;
  async function descargar() {
    if (descargando) return; descargando = true;
    try {
      const c = await caches.open(C); let n = await contar(c);
      const falta = []; for (const u of todos) if (!(await c.match(new URL(u, location.href).href))) falta.push(u);
      const pct = () => Math.floor(100 * n / todos.length);
      if (falta.length) poner(`⬇️ Descargando para jugar sin conexión… ${pct()} %`);
      for (let i = 0; i < falta.length; i += 6) {
        if (!navigator.onLine) break;
        await Promise.all(falta.slice(i, i + 6).map(async u => {
          try { const r = await fetch(u, { cache: 'reload' }); if (r.ok) { await c.put(new URL(u, location.href).href, r); n++; } } catch (e) {}
        }));
        poner(`⬇️ Descargando para jugar sin conexión… ${pct()} %`);
      }
      n = await contar(c);
      if (n === todos.length) { window.OfflineEstado.listo = true; poner('✅ Lista para jugar sin conexión'); }
      else poner(navigator.onLine ? `⚠️ Falta descargar un poco (${pct()} %): vuelve a abrir con internet` : `📴 Sin conexión: falta descargar (${pct()} %)`);
    } finally { descargando = false; }
  }
  addEventListener('online', () => descargar());
  navigator.serviceWorker.register('sw.js').then(reg => {
    const nueva = () => {
      if (!reg.waiting || !navigator.serviceWorker.controller) return;
      poner('✨ Hay una versión nueva', { texto: 'Actualizar', accion: () => { aviso.querySelector('button').disabled = true; reg.waiting.postMessage('actualizar'); } });
    };
    reg.addEventListener('updatefound', () => { const w = reg.installing; if (w) w.addEventListener('statechange', () => { if (w.state === 'installed') nueva(); }); });
    nueva();
  }).catch(() => {});
  // cuando cambia la versión que controla la página (al tocar «Actualizar»), se vuelve a abrir para no mezclar archivos
  let habia = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (habia) location.reload(); habia = true; descargar(); });
  // solo se descarga en la caché de ESTA versión cuando la controla su propio service worker
  navigator.serviceWorker.ready.then(async () => {
    if (!navigator.serviceWorker.controller) return;
    if ((await caches.keys()).includes(C)) descargar();
    else poner('⬇️ Preparando para jugar sin conexión…');
  });
})();
