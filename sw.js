// Mi Mundo de Juegos · funciona sin conexión.
// Las piezas de la muñeca (avatar/arte/…) se guardan al primer uso; sus nombres
// llevan una huella del contenido, así nunca se muestra una versión antigua.
importScripts('avatar/arte/piezas.js');
// Subir la versión cada vez que cambie un archivo de FILES (no hace falta para el arte: lleva huella).
const C='mis-juegos-v7',ARTE='mis-juegos-arte';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./avatar/avatar.css','./avatar/catalogo.js','./avatar/catalogo-muneca.js',
  './avatar/motor.js','./avatar/arte/piezas.js','./plantilla/plantilla.js'];
const PIEZAS=Object.values((self.AV_PIEZAS||{}).piezas||{}).flatMap(p=>Object.values(p.v).map(u=>'./'+u));
self.addEventListener('install',e=>{e.waitUntil(Promise.all([caches.open(C).then(c=>c.addAll(FILES)),
  caches.open(ARTE).then(c=>c.addAll(PIEZAS.filter(u=>u.includes('/s/'))).catch(()=>{}))]));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!==ARTE).map(k=>caches.delete(k)))),
  caches.open(ARTE).then(c=>c.keys().then(rs=>Promise.all(rs.filter(r=>!PIEZAS.some(u=>r.url.endsWith(u.slice(1)))).map(r=>c.delete(r)))))]));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.pathname.includes('/avatar/arte/')&&u.pathname.endsWith('.webp')){
    e.respondWith(caches.open(ARTE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res}))));return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))));
});
