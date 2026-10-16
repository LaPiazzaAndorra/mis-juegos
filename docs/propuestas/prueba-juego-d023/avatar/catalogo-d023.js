/* =====================================================================
   Prueba aislada D-023 · juego de piezas «d023»
   ---------------------------------------------------------------------
   El conjunto de la prueba D-016/D-019 + los cuatro tonos de piel (D-023) +
   los cinco colores de pelo con sus cejas a juego (D-022) + los cuatro colores
   de ojos (D-020) + el pintacaras «Estrellas y brillo» (D-021), con las capas
   actuales a 948 × 1659 (la resolución de 2000 × 3500 sigue pendiente).
   Orden de capas (el del visor):
     pelo detrás · base sin ojos · cejas a juego · ojos (abiertos / cerrados) ·
     pintacaras · zapatos · bordes de los zapatos · vestido · bordes del vestido ·
     manos · pelo delante · bordes del pelo · corona
   {piel}, {pelo} y {ojos} se sustituyen por la elección. Las piezas con «?»
   delante son opcionales: la piel clara no lleva capas de bordes y con el
   castaño se ven las cejas de la base (sin capa).
   Por defecto: piel clara, pelo castaño, ojos marrones y sin pintacaras.
   Se añade a los catálogos del juego sin modificarlos.
   ===================================================================== */
(function () {
  'use strict';
  // muestras de color (claro, medio, sombra) medidas en cada capa de pelo aprobada
  const pelo = (id, nombre, light, base, shade) => ({ id, nombre, c: { light, base, shade } });
  const ojos = (id, nombre) => ({ id, nombre, capas: { ojos: 'd023-ojos-{ojos}-{piel}' } });
  const piel = (id, nombre) => ({ id, nombre, capas: {
    cuerpo: 'd023-base-{piel}', ojosCerrados: 'd023-cerrados-{piel}', cejas: '?d023-cejas-{pelo}-{piel}', bordesPelo: '?d023-bordes-pelo-{pelo}-{piel}' } });
  window.AV_MUNECAS = window.AV_MUNECAS || {};
  window.AV_MUNECAS.d023 = {
    version: 1,
    tipo: 'png',
    nombre: 'Muñeca nueva D-023 (prueba: piel, pelo, cejas, ojos y pintacaras, 948 × 1659)',
    lienzo: { w: 948, h: 1659 },
    anclas: { eje: 479, suelo: 1562, hombroIzq: [380, 700], hombroDer: [578, 700], ojoIzq: [391, 443], ojoDer: [566, 443], ojos: 443 },
    sombra: [205, 28],
    capas: ['peloDetras', 'cuerpo', 'cejas', 'ojos', 'ojosCerrados', 'accCara', 'zapatos', 'bordesZapatos', 'ropa', 'bordesVestido',
      'manos', 'peloDelante', 'bordesPelo', 'accCabeza'],
    // encuadres (viewBox en px del lienzo de 948 × 1659)
    vistas: {
      full: '0 20 948 1590',
      cabeza: '179 30 600 600',
      ojos: '295 370 367 147',
      cuerpo: '79 560 800 1080',
      pies: '279 1300 400 300',
    },
    piel: [piel('clara', 'Claro'), piel('dorada', 'Dorado'), piel('morena', 'Moreno'), piel('profunda', 'Profundo')],
    ojos: {
      colores: [ojos('marron', 'Marrones'), ojos('azul', 'Azules'), ojos('verde', 'Verdes'), ojos('lila', 'Lilas')],
      formas: [{ id: 'redondos', nombre: 'Redondos' }],
    },
    pelo: {
      estilos: [{ id: 'rizos', nombre: 'Rizos largos', capas: { peloDetras: 'd023-pelo-detras-{pelo}', peloDelante: 'd023-pelo-delante-{pelo}' } }],
      colores: [
        pelo('castano', 'Castaño', '#aa6038', '#6b2f14', '#3c1405'),
        pelo('chocolate', 'Castaño chocolate', '#996344', '#592d14', '#2b1106'),
        pelo('miel', 'Rubio miel', '#e4aa6f', '#b3692e', '#783507'),
        pelo('oscuro', 'Castaño oscuro', '#7a4e37', '#412011', '#1c0b06'),
        pelo('jengibre', 'Pelirrojo jengibre', '#e07d44', '#a63c0e', '#691904'),
      ],
    },
    ropa: [
      { id: 'princesa', nombre: 'Vestido rosa', capas: { ropa: 'd023-vestido', manos: 'd023-manos-{piel}', bordesVestido: '?d023-bordes-vestido-{piel}' } },
      { id: 'camiseta', nombre: 'Camiseta (de la base)', capas: {} },
    ],
    zapatos: [{ id: 'princesa', nombre: 'Zapatos de princesa', capas: { zapatos: 'd023-zapatos', bordesZapatos: '?d023-bordes-zapatos-{piel}' } }],
    accesorios: [
      { id: 'corona', nombre: 'Corona', capas: { accCabeza: 'd023-corona' } },
      { id: 'pintacaras', nombre: 'Estrellas y brillo', capas: { accCara: 'd023-pintacaras' } },
    ],
    defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: ['corona'] },
  };
})();
