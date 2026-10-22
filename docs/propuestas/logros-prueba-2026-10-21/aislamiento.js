/* =====================================================================
   Prueba aislada de logros (21/10/2026) · datos propios
   ---------------------------------------------------------------------
   Se carga ANTES que el resto del juego. A partir de aquí, la copia solo ve
   sus propios datos:
     · localStorage: cada clave se guarda como «rec1:<clave>». Las claves del
       juego (stars, gal, avatar, doll…) no se leen, no se cambian y no se migran.
     · IndexedDB: «misjuegos» pasa a ser «rec1-misjuegos» (y lo mismo con
       cualquier otra base).
   El juego no cambia: esto solo existe en esta copia.
   Si el navegador no deja sustituir el almacenamiento, la copia se detiene.
   ===================================================================== */
(function () {
  'use strict';
  const PREFIJO = 'rec1:', PREFIJO_BD = 'rec1-';
  try {
    const real = window.localStorage, idb = window.indexedDB;
    const propias = () => {
      const ks = [];
      for (let i = 0; i < real.length; i++) { const k = real.key(i); if (k != null && k.startsWith(PREFIJO)) ks.push(k.slice(PREFIJO.length)); }
      return ks;
    };
    const api = {
      getItem: k => real.getItem(PREFIJO + k),
      setItem: (k, v) => real.setItem(PREFIJO + k, String(v)),
      removeItem: k => real.removeItem(PREFIJO + k),
      clear: () => propias().forEach(k => real.removeItem(PREFIJO + k)),
      key: i => { const ks = propias(); return i >= 0 && i < ks.length ? ks[i] : null; },
      get length() { return propias().length; },
      __aislado: PREFIJO,
    };
    const almacen = new Proxy(api, {
      get: (o, p) => (p in o ? o[p] : typeof p === 'string' ? real.getItem(PREFIJO + p) : undefined),
      set: (o, p, v) => { if (p in o) return false; real.setItem(PREFIJO + p, String(v)); return true; },
      has: (o, p) => p in o || (typeof p === 'string' && real.getItem(PREFIJO + p) != null),
      deleteProperty: (o, p) => { real.removeItem(PREFIJO + p); return true; },
      ownKeys: () => propias(),
      getOwnPropertyDescriptor: (o, p) => (typeof p === 'string' && real.getItem(PREFIJO + p) != null
        ? { value: real.getItem(PREFIJO + p), writable: true, enumerable: true, configurable: true } : undefined),
    });
    const bd = {
      open: (n, v) => (v === undefined ? idb.open(PREFIJO_BD + n) : idb.open(PREFIJO_BD + n, v)),
      deleteDatabase: n => idb.deleteDatabase(PREFIJO_BD + n),
      cmp: (a, b) => idb.cmp(a, b),
      databases: () => (idb.databases ? idb.databases() : Promise.resolve([]))
        .then(l => l.filter(d => d.name.startsWith(PREFIJO_BD)).map(d => Object.assign({}, d, { name: d.name.slice(PREFIJO_BD.length) }))),
      __aislado: PREFIJO_BD,
    };
    Object.defineProperty(window, 'localStorage', { value: almacen, configurable: true, enumerable: true });
    Object.defineProperty(window, 'indexedDB', { value: bd, configurable: true, enumerable: true });
    // comprobación: si no ha funcionado, no se sigue
    if (window.localStorage.__aislado !== PREFIJO || window.indexedDB.__aislado !== PREFIJO_BD) throw new Error('sin aislamiento');
    window.PRUEBA_LOGROS = { prefijo: PREFIJO, prefijoBD: PREFIJO_BD };
  } catch (e) {
    window.PRUEBA_LOGROS = null;
    document.addEventListener('DOMContentLoaded', () => {
      document.body.innerHTML = '<p style="font:20px sans-serif;padding:30px;color:#a33">Esta prueba no ha podido separar sus datos ' +
        'en este navegador, así que no se abre (para no tocar otros datos).</p>';
    });
    throw e;   // detiene el resto de scripts de la copia
  }
})();
