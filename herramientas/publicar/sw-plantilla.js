/* Mi Mundo de Juegos · service worker (generado por herramientas/publicar/preparar_publicacion.py; no editar a mano)
   · Cada versión tiene su propia caché («mis-juegos-<versión>»): nunca se mezclan archivos de dos versiones.
   · Al instalarse guarda todo lo básico para jugar (página, código, láminas…); si falla un archivo, la instalación no
     termina y sigue la versión anterior entera. Cada archivo se comprueba con su huella (no vale una copia vieja). Las piezas de la muñeca las descarga la propia página (con progreso),
     reutilizando las que ya tenía la versión anterior (sus nombres llevan huella: si no cambian, son las mismas).
   · Una versión nueva espera a que se cierre la app (o a que se toque «Actualizar»); solo la primera vez, si venía de la
     versión antigua del juego (sin esta caché por versiones), entra directamente.
   · No toca nunca los datos guardados (localStorage, IndexedDB). */
__LISTA__
const C = 'mis-juegos-' + OFFLINE.version;
const abs = u => new URL(u, self.registration.scope).href;
// huella (los 16 primeros caracteres del SHA-256) de unos bytes; sin crypto.subtle no se puede comprobar
const huella = async b => self.crypto && crypto.subtle ? [...new Uint8Array(await crypto.subtle.digest('SHA-256', b))].slice(0, 8).map(x => x.toString(16).padStart(2, '0')).join('') : null;
const bueno = async (u, b) => {
  if (u === 'offline-lista.js') return new TextDecoder().decode(b).includes('"' + OFFLINE.version + '"');
  const H = (OFFLINE.huellas || {})[u], h = H && await huella(b);
  return !H || h === null || h === H;
};
// descarga un archivo de ESTA versión: con «?v=<versión>» (otra dirección: ninguna copia vieja guardada por el camino, ni
// de la red de GitHub ni de Safari) y comprobando su huella; si no coincide, una segunda vez con una dirección única
async function traer(u) {
  for (const extra of ['v=' + OFFLINE.version, 'v=' + OFFLINE.version + '&r=' + Date.now()]) {
    try {
      const r = await fetch(abs(u) + (u.includes('?') ? '&' : '?') + extra, { cache: 'reload' });
      if (!r.ok) continue;
      const b = await r.arrayBuffer();
      if (await bueno(u, b)) return new Response(b, { status: 200, headers: r.headers });
    } catch (e) {}
  }
  return null;
}
self.addEventListener('install', e => e.waitUntil((async () => {
  const c = await caches.open(C), viejas = (await caches.keys()).filter(k => k.startsWith('mis-juegos-') && k !== C);
  // piezas con huella: se copian de la versión anterior si ya estaban
  for (const k of viejas) {
    const v = await caches.open(k);
    for (const u of OFFLINE.piezas) { const r = await v.match(abs(u)); if (r && !(await c.match(abs(u)))) await c.put(abs(u), r); }
  }
  // lo básico, todo o nada, y cada archivo comprobado con su huella
  const falta = [];
  for (let i = 0; i < OFFLINE.basico.length; i += 8) {
    await Promise.all(OFFLINE.basico.slice(i, i + 8).map(async u => {
      const r = await traer(u);
      if (!r) falta.push(u); else await c.put(abs(u), r);
    }));
  }
  if (falta.length) { await caches.delete(C); throw new Error('faltan ' + falta.join(', ')); }
  // venía de la versión antigua del juego (caché «mis-juegos-v1…v3»): entra ya
  if (viejas.some(k => /^mis-juegos-v\d+$/.test(k))) self.skipWaiting();
})()));
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('mis-juegos-') && k !== C) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('message', e => { if (e.data === 'actualizar') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const q = e.request; if (q.method !== 'GET' || !q.url.startsWith(self.registration.scope)) return;
  if (/[?&]r=\d/.test(q.url)) return;   // «?v=…&r=…»: offline.js vuelve a descargar un archivo comprobado → a la red, no a la caché
  e.respondWith((async () => {
    const c = await caches.open(C);
    if (q.mode === 'navigate') return (await c.match(abs('index.html'))) || fetch(q);
    return (await c.match(q, { ignoreSearch: true })) || fetch(q);
  })());
});
