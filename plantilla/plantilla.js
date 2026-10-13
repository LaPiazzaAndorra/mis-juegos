/* =====================================================================
   Mi Mundo de Juegos · Plantilla de la muñeca (fuente única de medidas)
   Lienzo 2000 × 3500 px. Origen arriba a la izquierda, en píxeles.
   Lo usan: el comprobador de capas, el optimizador y el catálogo.
   ===================================================================== */
self.AV_PLANTILLA = {
  version: 2,
  lienzo: { w: 2000, h: 3500 },
  postura: 'De pie, de frente, peso en las dos piernas, brazos relajados y separados del cuerpo unos 21°, palmas hacia las piernas, pies algo separados y un poco abiertos.',
  anclas: {
    eje: 999,             // línea central vertical del cuerpo
    suelo: 3275,           // planta de los pies (sin zapatos)
    coronilla: [987, 460], // parte alta del cráneo, sin pelo
    cabeza: [1000, 970],    // centro de la cara
    ojos: 1040, ojoIzq: [785, 1040], ojoDer: [1215, 1040],
    boca: [1000, 1290],
    barbilla: [980, 1430],
    hombroIzq: [747, 1684], hombroDer: [1254, 1684],
    codoIzq: [624, 2002], codoDer: [1376, 2001],
    munecaIzq: [527, 2253], munecaDer: [1472, 2252],
    manoIzq: [491, 2346], manoDer: [1508, 2344],
    cintura: 1896, cinturaIzq: 846, cinturaDer: 1160,
    cadera: 2299,
    rodillaIzq: [887, 2545], rodillaDer: [1109, 2562],
    tobilloIzq: [850, 3044], tobilloDer: [1145, 3039],
    pieIzq: [850, 3275], pieDer: [1145, 3275],
  },
  // Rectángulo donde puede haber dibujo en cada tipo de pieza [x0, y0, x1, y1]
  zonas: {
    base:          { r: [451, 420, 1548, 3335], color: '#a083ff', nombre: 'Muñeca base' },
    'pelo-detras': { r: [100, 150, 1900, 2700], color: '#c98b55', nombre: 'Pelo (detrás)' },
    'pelo-delante':{ r: [150, 150, 1850, 2500], color: '#ff8f5a', nombre: 'Pelo (delante)' },
    ojos:          { r: [560, 880, 1440, 1220], color: '#3d8ee0', nombre: 'Ojos' },
    ropa:          { r: [411, 1400, 1588, 3305], color: '#ff6fae', nombre: 'Ropa' },
    zapatos:       { r: [590, 2784, 1405, 3340], color: '#3fb4ea', nombre: 'Zapatos' },
    acc:           { r: [0, 0, 2000, 3500], color: '#5fd39b', nombre: 'Accesorios' },
  },
  // Medidas tomadas de la base con herramientas/medir_base.py
  // Márgenes de error para el comprobador (px en el lienzo de 2000 × 3500)
  tolerancia: { aviso: 8, error: 20 },
};
