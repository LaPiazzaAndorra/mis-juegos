/* COPIA para la prueba conjunta (generada por preparar_copia.py desde progreso.js): solo cambia la lista CLAVES. */
/* =====================================================================
   Mi Mundo de Juegos · Guardar y recuperar el progreso
   ---------------------------------------------------------------------
   Copia completa de los datos del juego en un archivo .json que se
   guarda en Archivos (y desde ahí en iCloud Drive):
     · localStorage: estrellas, galería, personaje, borrador de Vestir,
       habitación, escenas, niveles, heladería, ajustes y muñeco antiguo
     · IndexedDB «misjuegos» / «tpl»: láminas importadas en Pintar

   Mismo formato que herramientas/copia-de-seguridad.html
   («mi-mundo-juegos-respaldo», schema_version 1): los archivos de una
   sirven en la otra.

   Seguridad al recuperar:
     1. se valida el archivo y se enseña qué trae, comparado con lo actual;
     2. tras la confirmación, se guarda una COPIA DE SEGURIDAD de lo actual
        dentro de la app (IndexedDB «misjuegos-copias»); si no se puede
        guardar, no se recupera nada;
     3. se escriben los datos; si algo falla a mitad, se vuelve
        automáticamente a la copia de seguridad;
     4. «Deshacer la última recuperación» vuelve a la copia de seguridad.
   Solo se tocan las claves del juego; las demás no se leen ni se borran.
   ===================================================================== */
(function () {
  'use strict';
  const FORMATO = 'mi-mundo-juegos-respaldo', VERSION = 1;
  const CLAVES = ['stars', 'gal', 'sound', 'voice', 'tone', 'iceServed', 'iceCoins', 'scKey', 'mm_hab', 'avatar', 'avatar_draft', 'doll',
    'logros', 'tareas', 'premios'];   // COPIA de la prueba conjunta: solo se añaden estas tres claves
  const PREFIJOS = ['sc_', 'lv_'];
  const ULTIMA = 'bk_ultima';            // fecha de la última copia guardada (clave nueva, solo informativa)
  const PRUEBAS = !!window.MODO_PRUEBAS;  // versión de pruebas (otro origen, datos ficticios)
  const esDelJuego = k => CLAVES.includes(k) || PREFIJOS.some(p => k.startsWith(p));

  /* ---------- IndexedDB ---------- */
  function abrir(nombre, crear) {
    return new Promise((ok, ko) => {
      let r; try { r = indexedDB.open(nombre, 1); } catch (e) { return ko(e); }
      r.onupgradeneeded = () => crear(r.result);
      r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); r.onblocked = () => ko(new Error('Base de datos bloqueada'));
    });
  }
  const abrirLaminas = () => abrir('misjuegos', db => { if (!db.objectStoreNames.contains('tpl')) db.createObjectStore('tpl', { keyPath: 'id' }); });
  const abrirCopias = () => abrir('misjuegos-copias', db => db.createObjectStore('copias'));
  async function leerLaminas() {
    try {
      const db = await abrirLaminas();
      return await new Promise(ok => { const q = db.transaction('tpl').objectStore('tpl').getAll(); q.onsuccess = () => { db.close(); ok(q.result || []); }; q.onerror = () => { db.close(); ok([]); }; });
    } catch (e) { return []; }
  }
  async function escribirLaminas(lista, reemplazar) {
    const db = await abrirLaminas();
    await new Promise((ok, ko) => {
      const tx = db.transaction('tpl', 'readwrite'), st = tx.objectStore('tpl');
      if (reemplazar) st.clear();
      lista.forEach(t => st.put(t));
      tx.oncomplete = () => { db.close(); ok(); }; tx.onerror = () => { db.close(); ko(tx.error); }; tx.onabort = () => { db.close(); ko(tx.error || new Error('Escritura cancelada')); };
    });
  }
  async function copiaInterna(accion, valor) {
    const db = await abrirCopias();
    return new Promise((ok, ko) => {
      const tx = db.transaction('copias', accion === 'leer' ? 'readonly' : 'readwrite'), st = tx.objectStore('copias');
      const q = accion === 'leer' ? st.get('antes-de-recuperar') : st.put(valor, 'antes-de-recuperar');
      tx.oncomplete = () => { db.close(); ok(q.result); }; tx.onerror = () => { db.close(); ko(tx.error); };
    });
  }

  /* ---------- crear y comprobar copias ---------- */
  async function crear() {
    const ls = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (esDelJuego(k)) ls[k] = localStorage.getItem(k); }
    let version = '';
    try { version = (await caches.keys()).filter(n => /^mis-juegos-v\d+$/.test(n)).join(','); } catch (e) {}
    return { format: FORMATO, schema_version: VERSION, exported_at: new Date().toISOString(), app_version: version, origen: location.origin,
      ...(PRUEBAS ? { version_pruebas: true } : {}),
      local_storage: ls, indexeddb: { misjuegos: { tpl: await leerLaminas() } } };
  }
  function validar(c) {
    if (!c || c.format !== FORMATO) throw new Error('Este archivo no es una copia de Mi Mundo de Juegos.');
    if (!(c.schema_version >= 1 && c.schema_version <= VERSION)) throw new Error('Esta copia es de una versión más nueva del juego. Actualiza la app antes de recuperarla.');
    if (c.version_pruebas && !PRUEBAS) throw new Error('Esta copia es de la versión de PRUEBAS (datos ficticios): no se puede recuperar en el juego de verdad.');
    if (!c.local_storage || typeof c.local_storage !== 'object') throw new Error('El archivo está dañado.');
    for (const [k, v] of Object.entries(c.local_storage)) {
      if (typeof v !== 'string') throw new Error('El archivo está dañado.');
      if (esDelJuego(k) && k !== 'scKey' && k !== 'voice') try { JSON.parse(v); } catch (e) { throw new Error('El archivo está dañado.'); }   // cada dato debe poder leerse
    }
    const tpl = ((c.indexeddb || {}).misjuegos || {}).tpl || [];
    if (!Array.isArray(tpl) || tpl.some(t => !t || t.id == null)) throw new Error('Las láminas del archivo están dañadas.');
    return c;
  }
  function resumen(c) {
    const ls = c.local_storage || {}, j = k => { try { return JSON.parse(ls[k]); } catch (e) { return null; } };
    const gal = j('gal') || [], av = j('avatar');
    return {
      estrellas: +j('stars') || 0, dibujos: gal.length, personaje: !!av,
      escenas: Object.keys(ls).filter(k => k.startsWith('sc_') && (j(k) || []).length).length,
      niveles: Object.keys(ls).filter(k => k.startsWith('lv_')).length, monedas: +j('iceCoins') || 0,
      laminas: (((c.indexeddb || {}).misjuegos || {}).tpl || []).length, kb: Math.max(1, Math.round(JSON.stringify(c).length / 1024)),
      fecha: c.exported_at,
    };
  }

  /* ---------- guardar en Archivos ---------- */
  const nombreArchivo = c => (c.version_pruebas ? 'PRUEBAS-' : '') + 'Mi-Mundo-progreso-' + c.exported_at.slice(0, 10) + '.json';
  // Safari solo deja abrir la hoja de compartir justo después de un toque: por eso la copia se
  // PREPARA antes (al abrir los ajustes) y al tocar el botón se comparte sin esperar a nada.
  async function preparar() {
    const c = await crear(), texto = JSON.stringify(c);
    return { copia: c, texto, archivo: new File([texto], nombreArchivo(c), { type: 'application/json' }) };
  }
  // En el iPhone (app instalada) se abre la hoja de compartir → «Guardar en Archivos» (iCloud Drive).
  // Si el dispositivo no permite compartir archivos, se descarga.
  async function entregar(pr) {
    if (navigator.canShare && navigator.canShare({ files: [pr.archivo] })) {
      try { await navigator.share({ files: [pr.archivo], title: 'Progreso de Mi Mundo de Juegos' }); return 'compartido'; }
      catch (e) {
        if (e && e.name === 'AbortError') return 'cancelado';
        if (e && e.name === 'NotAllowedError') return 'otra-vez';    // se perdió el permiso del toque: volver a tocar
      }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([pr.texto], { type: 'application/json' })); a.download = pr.archivo.name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
    return 'descargado';
  }
  async function guardar(pr) {
    pr = pr || await preparar();
    const r = await entregar(pr);
    if (r === 'compartido' || r === 'descargado') try { localStorage.setItem(ULTIMA, pr.copia.exported_at); } catch (e) {}
    return { resultado: r, resumen: resumen(pr.copia) };
  }

  /* ---------- recuperar ---------- */
  async function aplicar(c) {
    const ls = c.local_storage, tpl = ((c.indexeddb || {}).misjuegos || {}).tpl;
    for (const [k, v] of Object.entries(ls)) if (esDelJuego(k)) localStorage.setItem(k, v);   // lanza si no hay espacio
    if (tpl && tpl.length) await escribirLaminas(tpl, false);
  }
  async function recuperar(c) {
    validar(c);
    const antes = await crear();
    try { await copiaInterna('guardar', antes); }
    catch (e) { throw new Error('No se ha podido guardar una copia de seguridad de los datos actuales, así que no se ha recuperado nada.'); }
    try { await aplicar(c); }
    catch (e) {
      await volverA(antes);
      throw new Error('No se ha podido recuperar la copia (¿falta espacio?). Tus datos de antes siguen igual.');
    }
    return resumen(c);
  }
  // Vuelve exactamente a una copia: las claves del juego que no estaban se quitan y las láminas se reponen.
  async function volverA(c) {
    const ls = c.local_storage;
    for (let i = localStorage.length - 1; i >= 0; i--) { const k = localStorage.key(i); if (esDelJuego(k) && !(k in ls)) localStorage.removeItem(k); }
    for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, v);
    await escribirLaminas(((c.indexeddb || {}).misjuegos || {}).tpl || [], true);
  }
  async function deshacer() {
    const c = await copiaInterna('leer');
    if (!c) throw new Error('No hay ninguna recuperación que deshacer.');
    await volverA(c);
    return resumen(c);
  }
  /* ---------- solo en la versión de pruebas: datos ficticios ---------- */
  function dibujo(fondo, cosas) {
    const cv = document.createElement('canvas'); cv.width = 320; cv.height = 240; const x = cv.getContext('2d');
    x.fillStyle = fondo; x.fillRect(0, 0, 320, 240);
    cosas.forEach(([c, X, Y, r]) => { x.fillStyle = c; x.beginPath(); x.arc(X, Y, r, 0, 7); x.fill(); });
    return cv.toDataURL('image/png');
  }
  async function datosFicticios() {
    if (!PRUEBAS) throw new Error('Solo en la versión de pruebas.');
    const gal = [dibujo('#fff3c4', [['#ff8fbf', 90, 120, 50], ['#6cc8f5', 220, 110, 40]]), dibujo('#d6f0ff', [['#ffd46b', 160, 70, 45], ['#5fd39b', 160, 200, 60]]),
      dibujo('#ffe3d1', [['#a083ff', 80, 80, 30], ['#ff6f7d', 240, 170, 55], ['#ffd46b', 150, 140, 20]])];
    const lamina = dibujo('#ffffff', [['#232323', 160, 120, 90], ['#ffffff', 160, 120, 84], ['#232323', 160, 120, 40], ['#ffffff', 160, 120, 35]]);
    const ls = { stars: '123', gal: JSON.stringify(gal), iceCoins: '42', iceServed: '17', lv_contar: '3', lv_sombras: '2',
      sc_casa: JSON.stringify([{ e: '🐶', x: 40, y: 60, s: 14, f: 1 }, { e: '🌷', x: 70, y: 70, s: 12, f: 1 }]), scKey: '"casa"',
      avatar: JSON.stringify({ v: 1, piel: 'clara', ojos: { color: 'azul', forma: 'redondos' }, pelo: { estilo: 'melena', color: 'castano' }, ropa: 'vestido', zapatos: null, accesorios: [], guardado: new Date().toISOString() }) };
    return recuperar({ format: FORMATO, schema_version: VERSION, exported_at: new Date().toISOString(), version_pruebas: true, origen: 'datos-ficticios',
      local_storage: ls, indexeddb: { misjuegos: { tpl: [{ id: 'u:ficticia', url: lamina }] } } });
  }

  async function hayDeshacer() { try { return !!(await copiaInterna('leer')); } catch (e) { return false; } }
  function ultima() { try { return localStorage.getItem(ULTIMA); } catch (e) { return null; } }
  const instalada = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

  window.Progreso = { FORMATO, VERSION, crear, validar, resumen, PRUEBAS, preparar, guardar, recuperar, deshacer, hayDeshacer, ultima, instalada, entregar, datosFicticios };
})();
