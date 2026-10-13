/* =====================================================================
   Mi Mundo de Juegos · Catálogo de la muñeca ilustrada (capas PNG/WebP)
   ---------------------------------------------------------------------
   Cada opción indica qué pieza va en cada capa. Las piezas se nombran
   como sus archivos en arte/originales/ (sin «.png»); {piel}, {pelo} y
   {ojos} se sustituyen por el color elegido.

   Una opción solo aparece en el juego cuando todas sus piezas existen,
   así se puede ir añadiendo arte poco a poco sin romper nada.
   ===================================================================== */
(function () {
  'use strict';
  const P = self.AV_PLANTILLA;
  window.AV_CAT_MUNECA = {
    version: 1,
    tipo: 'png',
    lienzo: P.lienzo,
    anclas: P.anclas,
    // Orden de dibujo, de atrás hacia delante
    capas: ['peloDetras', 'cuerpo', 'ojos', 'ojosCerrados', 'boca', 'bocaAbierta', 'calcetines', 'zapatos', 'ropaAbajo', 'ropa',
      'brazoIzq', 'mangaIzq', 'brazoDer', 'mangaDer', 'peloDelante', 'accCabeza', 'accMano'],
    // Encuadres (viewBox en px del lienzo)
    vistas: { full: '100 330 1800 3030', cabeza: '380 260 1240 1240', ojos: '560 880 880 360', cuerpo: '300 1450 1400 1950', pies: '600 2700 800 650' },
    piel: [
      { id: 'clara', nombre: 'Clara', capas: { cuerpo: 'base-{piel}' } },
      { id: 'morena', nombre: 'Morena', capas: { cuerpo: 'base-{piel}' } },
    ],
    ojos: {
      colores: [{ id: 'marron', nombre: 'Marrones', capas: {} }],
      formas: [{ id: 'redondos', nombre: 'Redondos' }],
    },
    pelo: {
      estilos: [
        { id: 'rizos', nombre: 'Rizos largos', capas: { peloDetras: 'pelo-rizos-detras-{pelo}', peloDelante: 'pelo-rizos-delante-{pelo}' } },
        { id: 'melena', nombre: 'Melena (prueba técnica)', capas: { peloDetras: 'pelo-melena-detras-{pelo}', peloDelante: 'pelo-melena-delante-{pelo}' } },
      ],
      colores: [
        { id: 'castano', nombre: 'Castaño', c: { light: '#b07a52', base: '#7b4a2d', shade: '#55301b' } },
        { id: 'rubio', nombre: 'Rubio', c: { light: '#ffe6a6', base: '#f2c46d', shade: '#d39a3e' } },
      ],
    },
    ropa: [
      { id: 'princesa', nombre: 'Princesa', capas: { ropa: 'ropa-princesa' } },
      { id: 'diario', nombre: 'Diario', capas: { ropa: 'ropa-diario' } },
      { id: 'exploradora', nombre: 'Exploradora', capas: { ropa: 'ropa-exploradora' } },
      { id: 'vestido', nombre: 'Vestido (prueba técnica)', capas: { ropa: 'ropa-vestido-flores' } },
    ],
    accesorios: [],
    defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'rizos', color: 'castano' }, ropa: 'princesa', zapatos: null, accesorios: [] },
  };
})();
