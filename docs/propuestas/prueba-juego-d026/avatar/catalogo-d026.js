/* =====================================================================
   Prueba aislada D-026 · juego de piezas «d026»
   ---------------------------------------------------------------------
   El conjunto de la prueba D-023 (4 tonos de piel, 5 colores de pelo con cejas
   a juego, 4 colores de ojos, pintacaras, vestido, zapatos y corona) + los tres
   peinados aprobados y los accesorios de pelo aprobados, con las capas actuales
   a 948 × 1659 (la resolución de 2000 × 3500 sigue pendiente):
     · Peinados (pestaña Pelo): melena suelta (por defecto), coleta con cinta,
       coleta sin cinta (D-025), dos coletas con sombrero y sin sombrero (D-026);
       todos en los 5 colores y los 4 tonos (orejas y bordes de cada tono).
     · Adornos: corona, lazo de satén, pasador de flores, mariposa lila,
       diadema de estrellas, gorrito de dormir (B), gorra rosa (D-024) y
       pintacaras «Estrellas y brillo» (D-021).
   Compatibilidades (las del visor), aplicadas por el motor de la copia:
     · los adornos de pelo (lazo, flores, mariposa, diadema, gorrito, gorra) van
       de uno en uno («grupo»); al poner otro, se quita el anterior;
     · la corona no va con la diadema, el gorrito ni la gorra («excluye»): queda
       lo último que se ha elegido;
     · la corona y los adornos de pelo están colocados para la melena
       («estilos»): con otro peinado se quitan, y elegirlos con otro peinado
       vuelve a la melena; el pintacaras va con todos.
   Orden de capas (el del visor):
     orejas de detrás · pelo detrás · base · cejas · ojos (abiertos / cerrados) ·
     pintacaras · zapatos · bordes · vestido · bordes · manos · orejas de delante ·
     pelo delante · bordes del pelo · cinta o coleteros · sombrero · adorno de
     pelo · corona
   {piel}, {pelo} y {ojos} se sustituyen por la elección; «?» = pieza opcional
   (la piel clara no lleva bordes; con el castaño se ven las cejas de la base).
   Se añade a los catálogos del juego sin modificarlos.
   ===================================================================== */
(function () {
  'use strict';
  const pelo = (id, nombre, light, base, shade) => ({ id, nombre, c: { light, base, shade } });
  const ojos = (id, nombre) => ({ id, nombre, capas: { ojos: 'd026-ojos-{ojos}-{piel}' } });
  const piel = (id, nombre) => ({ id, nombre, capas: {
    cuerpo: 'd026-base-{piel}', ojosCerrados: 'd026-cerrados-{piel}', cejas: '?d026-cejas-{pelo}-{piel}', bordesPelo: '?d026-bordes-pelo-{pelo}-{piel}' } });
  const coleta = (id, nombre, v) => ({ id, nombre, capas: Object.assign({
    orejaDetras: 'd026-orejas-coleta-detras-{piel}', peloDetras: `d026-coleta-${v}-detras-{pelo}`,
    orejaDelante: 'd026-orejas-coleta-delante-{piel}', peloDelante: `d026-coleta-${v}-delante-{pelo}`,
    bordesPelo: `?d026-bordes-coleta-${v}-{pelo}-{piel}` }, v === 'con' ? { peloAdorno: 'd026-cinta-coleta' } : {}) });
  const coletas = (id, nombre, v) => ({ id, nombre, capas: Object.assign({
    peloDetras: `d026-coletas-${v}-detras-{pelo}`, peloDelante: `d026-coletas-${v}-delante-{pelo}`,
    bordesPelo: `?d026-bordes-coletas-${v}-{pelo}-{piel}`, peloAdorno: 'd026-coleteros' }, v === 'con' ? { sombrero: 'd026-sombrero' } : {}) });
  const MELENA = ['rizos'];
  const adornoPelo = (id, nombre) => ({ id, nombre, grupo: 'pelo', estilos: MELENA, capas: { accPelo: 'd026-' + id } });
  window.AV_MUNECAS = window.AV_MUNECAS || {};
  window.AV_MUNECAS.d026 = {
    version: 1,
    tipo: 'png',
    nombre: 'Muñeca nueva D-026 (prueba: peinados y accesorios, 948 × 1659)',
    lienzo: { w: 948, h: 1659 },
    anclas: { eje: 479, suelo: 1562, hombroIzq: [380, 700], hombroDer: [578, 700], ojoIzq: [391, 443], ojoDer: [566, 443], ojos: 443 },
    sombra: [205, 28],
    capas: ['orejaDetras', 'peloDetras', 'cuerpo', 'cejas', 'ojos', 'ojosCerrados', 'accCara', 'zapatos', 'bordesZapatos', 'ropa', 'bordesVestido',
      'manos', 'orejaDelante', 'peloDelante', 'bordesPelo', 'peloAdorno', 'sombrero', 'accPelo', 'accCabeza'],
    vistas: {
      full: '0 20 948 1590',
      cabeza: '149 20 660 660',
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
      estilos: [
        { id: 'rizos', nombre: 'Melena suelta', capas: { peloDetras: 'd026-pelo-detras-{pelo}', peloDelante: 'd026-pelo-delante-{pelo}' } },
        coleta('coleta', 'Coleta con cinta', 'con'),
        coleta('coleta-sin-cinta', 'Coleta sin cinta', 'sin'),
        coletas('coletas', 'Dos coletas con sombrero', 'con'),
        coletas('coletas-sin-sombrero', 'Dos coletas sin sombrero', 'sin'),
      ],
      colores: [
        pelo('castano', 'Castaño', '#aa6038', '#6b2f14', '#3c1405'),
        pelo('chocolate', 'Castaño chocolate', '#996344', '#592d14', '#2b1106'),
        pelo('miel', 'Rubio miel', '#e4aa6f', '#b3692e', '#783507'),
        pelo('oscuro', 'Castaño oscuro', '#7a4e37', '#412011', '#1c0b06'),
        pelo('jengibre', 'Pelirrojo jengibre', '#e07d44', '#a63c0e', '#691904'),
      ],
    },
    ropa: [
      { id: 'princesa', nombre: 'Vestido rosa', capas: { ropa: 'd026-vestido', manos: 'd026-manos-{piel}', bordesVestido: '?d026-bordes-vestido-{piel}' } },
      { id: 'camiseta', nombre: 'Camiseta (de la base)', capas: {} },
    ],
    zapatos: [{ id: 'princesa', nombre: 'Zapatos de princesa', capas: { zapatos: 'd026-zapatos', bordesZapatos: '?d026-bordes-zapatos-{piel}' } }],
    accesorios: [
      { id: 'corona', nombre: 'Corona', estilos: MELENA, excluye: ['diadema', 'gorrito', 'gorra'], capas: { accCabeza: 'd026-corona' } },
      adornoPelo('lazo', 'Lazo de satén'),
      adornoPelo('flores', 'Pasador de flores'),
      adornoPelo('mariposa', 'Mariposa lila'),
      adornoPelo('diadema', 'Diadema de estrellas'),
      adornoPelo('gorrito', 'Gorrito de dormir'),
      adornoPelo('gorra', 'Gorra rosa'),
      { id: 'pintacaras', nombre: 'Estrellas y brillo', capas: { accCara: 'd026-pintacaras' } },
    ],
    defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: ['corona'] },
  };
})();
