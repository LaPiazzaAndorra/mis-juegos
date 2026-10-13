/* =====================================================================
   Mi Mundo de Juegos · Plantilla de la muñeca (fuente única de medidas)
   Lienzo 2000 × 3500 px. Origen arriba a la izquierda, en píxeles.
   Lo usan: el comprobador de capas, el optimizador y el catálogo.
   ===================================================================== */
self.AV_PLANTILLA = {
  version: 1,
  lienzo: { w: 2000, h: 3500 },
  postura: 'De pie, de frente, peso en las dos piernas, brazos relajados y separados del cuerpo unos 14°, palmas hacia las piernas, pies algo separados y un poco abiertos.',
  anclas: {
    eje: 1000,             // línea central vertical del cuerpo
    suelo: 3275,           // planta de los pies (sin zapatos)
    coronilla: [1000, 460], // parte alta del cráneo, sin pelo
    cabeza: [1000, 970],    // centro de la cara
    ojos: 1040, ojoIzq: [785, 1040], ojoDer: [1215, 1040],
    boca: [1000, 1290],
    barbilla: [1000, 1480],
    hombroIzq: [780, 1690], hombroDer: [1220, 1690],
    codoIzq: [714, 1957], codoDer: [1286, 1957],
    munecaIzq: [650, 2214], munecaDer: [1350, 2214],
    manoIzq: [630, 2300], manoDer: [1370, 2300],
    cintura: 2150, cinturaIzq: 830, cinturaDer: 1170,
    cadera: 2260,
    rodillaIzq: [922, 2700], rodillaDer: [1078, 2700],
    tobilloIzq: [922, 3140], tobilloDer: [1078, 3140],
    pieIzq: [922, 3275], pieDer: [1078, 3275],
  },
  // Rectángulo donde puede haber dibujo en cada tipo de pieza [x0, y0, x1, y1]
  zonas: {
    base:          { r: [380, 380, 1620, 3340], color: '#a083ff', nombre: 'Muñeca base' },
    'pelo-detras': { r: [100, 150, 1900, 2700], color: '#c98b55', nombre: 'Pelo (detrás)' },
    'pelo-delante':{ r: [150, 150, 1850, 2500], color: '#ff8f5a', nombre: 'Pelo (delante)' },
    ojos:          { r: [560, 880, 1440, 1220], color: '#3d8ee0', nombre: 'Ojos' },
    ropa:          { r: [300, 1450, 1700, 3300], color: '#ff6fae', nombre: 'Ropa' },
    zapatos:       { r: [700, 2950, 1300, 3340], color: '#3fb4ea', nombre: 'Zapatos' },
    acc:           { r: [0, 0, 2000, 3500], color: '#5fd39b', nombre: 'Accesorios' },
  },
  // Márgenes de error para el comprobador (px en el lienzo de 2000 × 3500)
  tolerancia: { aviso: 8, error: 20 },
};
