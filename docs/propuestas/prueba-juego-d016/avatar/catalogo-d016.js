/* =====================================================================
   Prueba aislada D-016 · juego de piezas «d016»
   ---------------------------------------------------------------------
   Conjunto aprobado (D-016 + D-017 + D-018) sobre la base D-014, con las
   capas actuales a 948 × 1659 (la resolución de 2000 × 3500 sigue pendiente).
   Mismo orden de capas que el visor:
     pelo detrás · base sin ojos · ojos (abiertos / cerrados) · zapatos ·
     vestido · manos (copiadas de la base) · pelo delante · corona
   Usa los mismos identificadores que «premium» (rizos, castano, princesa,
   corona), así un personaje guardado sirve para las dos muñecas.
   Se añade a los catálogos del juego sin modificarlos.
   ===================================================================== */
(function () {
  'use strict';
  const castano = { id: 'castano', nombre: 'Castaño', c: { light: '#b07a52', base: '#7b4a2d', shade: '#55301b' } };
  window.AV_MUNECAS = window.AV_MUNECAS || {};
  window.AV_MUNECAS.d016 = {
    version: 1,
    tipo: 'png',
    nombre: 'Muñeca nueva D-016 (prueba, 948 × 1659)',
    lienzo: { w: 948, h: 1659 },
    anclas: { eje: 479, suelo: 1562, hombroIzq: [380, 700], hombroDer: [578, 700], ojoIzq: [391, 443], ojoDer: [566, 443], ojos: 443 },
    sombra: [205, 28],
    capas: ['peloDetras', 'cuerpo', 'ojos', 'ojosCerrados', 'zapatos', 'ropa', 'manos', 'peloDelante', 'accCabeza'],
    // encuadres (viewBox en px del lienzo de 948 × 1659)
    vistas: {
      full: '0 20 948 1590',
      cabeza: '179 30 600 600',
      ojos: '295 370 367 147',
      cuerpo: '79 560 800 1080',
      pies: '279 1300 400 300',
    },
    piel: [{ id: 'clara', nombre: 'Clara', capas: { cuerpo: 'd016-base', ojosCerrados: 'd016-ojos-cerrados' } }],
    ojos: {
      colores: [{ id: 'marron', nombre: 'Marrones', capas: { ojos: 'd016-ojos-{ojos}' } }],
      formas: [{ id: 'redondos', nombre: 'Redondos' }],
    },
    pelo: {
      estilos: [{ id: 'rizos', nombre: 'Rizos largos', capas: { peloDetras: 'd016-pelo-detras', peloDelante: 'd016-pelo-delante' } }],
      colores: [castano],
    },
    ropa: [
      { id: 'princesa', nombre: 'Vestido rosa', capas: { ropa: 'd016-vestido', manos: 'd016-manos' } },
      { id: 'camiseta', nombre: 'Camiseta (de la base)', capas: {} },
    ],
    zapatos: [{ id: 'princesa', nombre: 'Zapatos de princesa', capas: { zapatos: 'd016-zapatos' } }],
    accesorios: [{ id: 'corona', nombre: 'Corona', capas: { accCabeza: 'd016-corona' } }],
    defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: ['corona'] },
  };
})();
