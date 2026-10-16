/* =====================================================================
   Prueba aislada D-021 · juego de piezas «d021»
   ---------------------------------------------------------------------
   El conjunto aprobado de la prueba D-016/D-019 (sin cambios) + los cuatro
   colores de ojos (D-020) + el pintacaras «Estrellas y brillo» (D-021), con
   las capas actuales a 948 × 1659 (la resolución de 2000 × 3500 sigue pendiente).
   Orden de capas (el del visor):
     pelo detrás · base sin ojos · ojos (abiertos / cerrados) · pintacaras ·
     zapatos · vestido · manos · pelo delante · corona
   El pintacaras es un adorno más (se pone y se quita en «Adornos»); va encima
   de los ojos y no cambia al parpadear ni con el color de ojos.
   Mismos identificadores que «premium» (rizos, castano, princesa, corona, marron,
   azul) y nuevos: verde, lila y pintacaras. Se añade a los catálogos del juego
   sin modificarlos.
   ===================================================================== */
(function () {
  'use strict';
  const castano = { id: 'castano', nombre: 'Castaño', c: { light: '#b07a52', base: '#7b4a2d', shade: '#55301b' } };
  const ojos = (id, nombre) => ({ id, nombre, capas: { ojos: 'd021-ojos-{ojos}' } });
  window.AV_MUNECAS = window.AV_MUNECAS || {};
  window.AV_MUNECAS.d021 = {
    version: 1,
    tipo: 'png',
    nombre: 'Muñeca nueva D-021 (prueba: colores de ojos y pintacaras, 948 × 1659)',
    lienzo: { w: 948, h: 1659 },
    anclas: { eje: 479, suelo: 1562, hombroIzq: [380, 700], hombroDer: [578, 700], ojoIzq: [391, 443], ojoDer: [566, 443], ojos: 443 },
    sombra: [205, 28],
    capas: ['peloDetras', 'cuerpo', 'ojos', 'ojosCerrados', 'accCara', 'zapatos', 'ropa', 'manos', 'peloDelante', 'accCabeza'],
    // encuadres (viewBox en px del lienzo de 948 × 1659)
    vistas: {
      full: '0 20 948 1590',
      cabeza: '179 30 600 600',
      ojos: '295 370 367 147',
      cuerpo: '79 560 800 1080',
      pies: '279 1300 400 300',
    },
    piel: [{ id: 'clara', nombre: 'Clara', capas: { cuerpo: 'd021-base', ojosCerrados: 'd021-ojos-cerrados' } }],
    ojos: {
      colores: [ojos('marron', 'Marrones'), ojos('azul', 'Azules'), ojos('verde', 'Verdes'), ojos('lila', 'Lilas')],
      formas: [{ id: 'redondos', nombre: 'Redondos' }],
    },
    pelo: {
      estilos: [{ id: 'rizos', nombre: 'Rizos largos', capas: { peloDetras: 'd021-pelo-detras', peloDelante: 'd021-pelo-delante' } }],
      colores: [castano],
    },
    ropa: [
      { id: 'princesa', nombre: 'Vestido rosa', capas: { ropa: 'd021-vestido', manos: 'd021-manos' } },
      { id: 'camiseta', nombre: 'Camiseta (de la base)', capas: {} },
    ],
    zapatos: [{ id: 'princesa', nombre: 'Zapatos de princesa', capas: { zapatos: 'd021-zapatos' } }],
    accesorios: [
      { id: 'corona', nombre: 'Corona', capas: { accCabeza: 'd021-corona' } },
      { id: 'pintacaras', nombre: 'Estrellas y brillo', capas: { accCara: 'd021-pintacaras' } },
    ],
    // por defecto, como el visor: ojos marrones y sin pintacaras
    defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: ['corona'] },
  };
})();
