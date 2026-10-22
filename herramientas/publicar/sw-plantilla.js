/* Mi Mundo de Juegos · service worker (generado por herramientas/publicar/preparar_publicacion.py; no editar a mano)
   · Cada versión tiene su propia caché («mis-juegos-<versión>»): nunca se mezclan archivos de dos versiones.
   · Al instalarse guarda todo lo básico para jugar (página, código, láminas…); si falla un archivo, la instalación no
     termina y sigue la versión anterior entera. Las piezas de la muñeca las descarga la propia página (con progreso),
     reutilizando las que ya tenía la versión anterior (sus nombres llevan huella: si no cambian, son las mismas).
   · Una versión nueva espera a que se cierre la app (o a que se toque «Actualizar»); solo la primera vez, si venía de la
     versión antigua del juego (sin esta caché por versiones), entra directamente.
   · No toca nunca los datos guardados (localStorage, IndexedDB). */
__LISTA__
const C = 'mis-juegos-' + OFFLINE.version;
const abs = u => new URL(u, self.registration.scope).href;
self.addEventListener('install', e => e.waitUntil((async () => {
  const c = await caches.open(C), viejas = (await caches.keys()).filter(k => k.startsWith('mis-juegos-') && k !== C);
  // piezas con huella: se copian de la versión anterior si ya estaban
  for (const k of viejas) {
    const v = await caches.open(k);
    for (const u of OFFLINE.piezas) { const r = await v.match(abs(u)); if (r && !(await c.match(abs(u)))) await c.put(abs(u), r); }
  }
  // lo básico, todo o nada
  const falta = [];
  for (let i = 0; i < OFFLINE.basico.length; i += 8) {
    await Promise.all(OFFLINE.basico.slice(i, i + 8).map(async u => {
      const r = await fetch(abs(u), { cache: 'reload' });
      if (!r.ok) falta.push(u); else await c.put(abs(u), r);
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
  e.respondWith((async () => {
    const c = await caches.open(C);
    if (q.mode === 'navigate') return (await c.match(abs('index.html'))) || fetch(q);
    return (await c.match(q, { ignoreSearch: true })) || fetch(q);
  })());
});
