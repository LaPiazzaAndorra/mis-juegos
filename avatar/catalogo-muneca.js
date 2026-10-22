/* =====================================================================
   Mi Mundo de Juegos · Catálogos de la muñeca ilustrada (capas PNG/WebP)
   ---------------------------------------------------------------------
   Hay tres juegos de piezas. El juego usa el primero que tenga su base:

     premium  → la muñeca definitiva (arte original, ver plantilla/ASSETS.md)
     prueba   → piezas técnicas provisionales (muñeca vectorial en capas)
     demo     → solo con ?arte=demo: ilustración de la lámina de referencia
                recortada en una sola pieza, para comprobar la calidad visual

   Cada opción indica qué pieza va en cada capa. Las piezas se nombran
   como sus archivos en arte/originales/ (sin «.png»); {piel}, {pelo} y
   {ojos} se sustituyen por la elección. Una pieza que empieza por «?» es
   opcional: si falta, la opción aparece igual.
   Una opción solo aparece cuando existen todas sus piezas obligatorias.
   ===================================================================== */
(function () {
  'use strict';
  const P = self.AV_PLANTILLA;
  function vistas(A) {
    const r = n => Math.round(n), vb = (x, y, w, h) => [x, y, w, h].map(r).join(' ');
    const cab = A.barbilla[1] - A.coronilla[1], ojoW = A.ojoDer[0] - A.ojoIzq[0];
    return {
      full: vb(100, A.coronilla[1] - 200, 1800, A.suelo + 70 - (A.coronilla[1] - 200)),
      cabeza: vb(A.eje - cab * .62, A.coronilla[1] - cab * .2, cab * 1.24, cab * 1.24),
      ojos: vb(A.ojoIzq[0] - ojoW * .55, A.ojos - ojoW * .42, ojoW * 2.1, ojoW * .84),
      cuerpo: vb(A.eje - 700, A.hombroIzq[1] - 240, 1400, A.suelo + 70 - (A.hombroIzq[1] - 240)),
      pies: vb(A.eje - 400, A.tobilloIzq[1] - 200, 800, A.suelo + 70 - (A.tobilloIzq[1] - 200)),
    };
  }
  const comun = {
    version: 1,
    tipo: 'png',
    lienzo: P.lienzo,
    anclas: P.anclas,
    // Orden de dibujo, de atrás hacia delante
    capas: ['peloDetras', 'cuerpo', 'ojos', 'ojosCerrados', 'boca', 'bocaAbierta', 'calcetines', 'zapatos', 'ropaAbajo', 'ropa',
      'brazoIzq', 'mangaIzq', 'brazoDer', 'mangaDer', 'peloDelante', 'accCabeza', 'accMano'],
    // Encuadres (viewBox en px del lienzo)
    // Calculados a partir de la plantilla: se adaptan solos cuando cambian las medidas de la base.
    vistas: vistas(P.anclas),
  };
  const castano = { id: 'castano', nombre: 'Castaño', c: { light: '#b07a52', base: '#7b4a2d', shade: '#55301b' } };

  window.AV_MUNECAS = {
    /* ---------- muñeca definitiva ---------- */
    premium: Object.assign({}, comun, {
      nombre: 'Muñeca premium',
      piel: [
        { id: 'clara', nombre: 'Clara', capas: { cuerpo: 'base-{piel}', ojosCerrados: '?ojos-cerrados-{piel}' } },
        { id: 'morena', nombre: 'Morena', capas: { cuerpo: 'base-{piel}', ojosCerrados: '?ojos-cerrados-{piel}' } },
      ],
      ojos: {
        colores: [
          { id: 'marron', nombre: 'Marrones', capas: { ojos: 'ojos-{ojos}' } },
          { id: 'azul', nombre: 'Azules', capas: { ojos: 'ojos-{ojos}' } },
        ],
        formas: [{ id: 'redondos', nombre: 'Redondos' }],
      },
      pelo: {
        estilos: [{ id: 'rizos', nombre: 'Rizos largos', capas: { peloDetras: 'pelo-rizos-detras-{pelo}', peloDelante: 'pelo-rizos-delante-{pelo}' } }],
        colores: [castano],
      },
      ropa: [{ id: 'princesa', nombre: 'Vestido rosa', capas: { ropa: 'ropa-princesa' } }],
      zapatos: [{ id: 'princesa', nombre: 'Zapatos de princesa', capas: { zapatos: 'zapatos-princesa' } }],
      accesorios: [{ id: 'corona', nombre: 'Corona', capas: { accCabeza: 'acc-corona' } }],
      defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: 'princesa', accesorios: ['corona'] },
    }),

    /* ---------- piezas técnicas provisionales ---------- */
    prueba: Object.assign({}, comun, {
      nombre: 'Piezas técnicas de prueba',
      piel: [
        { id: 'clara', nombre: 'Clara', capas: { cuerpo: 'prueba-base-{piel}' } },
        { id: 'morena', nombre: 'Morena', capas: { cuerpo: 'prueba-base-{piel}' } },
      ],
      ojos: { colores: [{ id: 'marron', nombre: 'Marrones', capas: {} }], formas: [{ id: 'redondos', nombre: 'Redondos' }] },
      pelo: {
        estilos: [{ id: 'melena', nombre: 'Melena', capas: { peloDetras: 'prueba-pelo-melena-detras-{pelo}', peloDelante: 'prueba-pelo-melena-delante-{pelo}' } }],
        colores: [castano],
      },
      ropa: [{ id: 'vestido', nombre: 'Vestido de flores', capas: { ropa: 'prueba-ropa-vestido-flores' } }],
      zapatos: [],
      accesorios: [],
      defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'melena', color: 'castano' }, ropa: 'vestido', zapatos: null, accesorios: [] },
    }),

    /* ---------- demostración de calidad (una sola pieza, sin capas) ---------- */
    demo: Object.assign({}, comun, {
      nombre: 'Demostración con la lámina de referencia',
      piel: [{ id: 'clara', nombre: 'Clara', capas: { cuerpo: 'demo-diario' } }],
      ojos: { colores: [{ id: 'marron', nombre: 'Marrones', capas: {} }], formas: [{ id: 'redondos', nombre: 'Redondos' }] },
      pelo: { estilos: [{ id: 'incluido', nombre: 'Incluido', capas: {} }], colores: [castano] },
      ropa: [{ id: 'diario', nombre: 'Diario', capas: {} }],
      zapatos: [],
      accesorios: [],
      defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'incluido', color: 'castano' }, ropa: 'diario', zapatos: null, accesorios: [] },
    }),
  };
})();
