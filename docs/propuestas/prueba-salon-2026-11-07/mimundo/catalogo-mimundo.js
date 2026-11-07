/* =====================================================================
   Mi Mundo · escenarios, catálogo y misiones (datos)
   ---------------------------------------------------------------------
   Escenarios: la habitación (D-033, aprobada en general) y el salón (D-034).
   «escena»: la escena del juego que ocupan (🛏️ habitación, 🏠 casa); «bg»: el color de los bordes;
   «sitioNuevo»: dónde aparece lo que se pone desde la bandeja; «saludo»: lo que dice la muñeca al tocarla.
   Cada uno con su fondo, la profundidad de su suelo (dónde mide la muñeca
   250 px), su zona de suelo, sus objetos del catálogo, sus misiones, lo que
   hay al empezar y su clave de datos.
   Cada objeto: id, nombre y su tamaño real para la escala, sin deformar
   (altoM o anchoM en metros; la muñeca mide 1,10 m) o una escala fija (la
   cama); su arte (arte/<id>.webp, con tamaño, recorte y punto de apoyo en
   arte/medidas.js). Un objeto SIN arte no aparece: no hay dibujos de relleno.
     · unico: solo uno; max: cuántos como mucho
     · contenedor / guardable: guardar cosas dentro (la cesta)
     · acostar: ancla para acostar a la muñeca (la cama)
     · plano: va siempre debajo de todo (la alfombra)
     · encima: sitios donde se ponen otras cosas, en píxeles de la imagen
       recibida, por tipo: «mesa» (la merienda), «peluche» (sentados),
       «cojin» (cojines de sofá). Lo que está encima se mueve con el mueble.
     · va: qué sitio busca al soltarlo encima de un mueble («mesa»,
       «peluche», «cojin»)
     · gratis (por defecto) o desbloqueo: { logros: n } (se propondrán aparte)
   Misiones: solo se ofrecen si todos sus objetos tienen arte y son gratis.
   Tipos: «meter» (guardar en un contenedor) y «poner» (cosas encima de un
   mueble y peluches sentados); más adelante, «encontrar» (pistas, parque).
   ===================================================================== */
/* Copia del salón (D-034, 07/11/2026): habitación (aprobada) + salón (pendiente de la prueba y la aprobación de la
   propietaria). En el juego, el salón ocupa la escena 🏠 «casa» de Mi Mundo. */
window.MM_CATALOGO = {
  escenarios: {
    habitacion: { nombre: 'Habitación', escena: 'habitacion', fondo: 'fondo', suelo0: 560, suelo: { x0: 90, x1: 1450, y0: 585, y1: 1005 }, clave: 'mm_habitacion2',
      bg: 'linear-gradient(#f6dcd0 0 55%,#d9924f 55%)', sitioNuevo: [760, 820], saludo: '¡Qué bonita es mi habitación!',
      muneca: [1000, 860], objetos: ['cama', 'cesta', 'osito', 'pelota', 'cubos', 'cuento'], misiones: ['guardar-juguetes'],
      inicial: [{ id: 'cama', x: 416, y: 979 }] },
    salon: { nombre: 'Salón', escena: 'casa', fondo: 'fondo-salon', suelo0: 520, suelo: { x0: 90, x1: 1450, y0: 545, y1: 1005 }, clave: 'mm_salon',
      bg: 'linear-gradient(#fbc89b 0 50%,#d9894a 50%)', sitioNuevo: [1050, 900], saludo: '¡Qué bonito es el salón!',
      muneca: [1150, 800], objetos: ['sofa', 'mesa', 'estanteria', 'lampara', 'alfombra', 'cojin-rosa', 'cojin-lila', 'cojin-corazon', 'cojin-estrella',
        'plato', 'taza', 'tetera', 'galletas', 'conejito', 'osito'], misiones: ['merienda'],
      inicial: [{ id: 'alfombra', x: 805, y: 965 }, { id: 'sofa', x: 520, y: 640 }, { id: 'estanteria', x: 1300, y: 615 }, { id: 'lampara', x: 140, y: 650 },
        { id: 'mesa', x: 800, y: 860 }, { id: 'cojin-rosa', x: 575, y: 950 }, { id: 'cojin-lila', x: 1040, y: 950 }] },
  },
  objetos: [
    // ---------------- habitación ----------------
    { id: 'cama', nombre: 'Cama', unico: true, escala: 0.62, yRef: 979,
      capas: { detras: 'cama-detras', delante: 'cama-delante' }, acostar: { cx: 385, cy: 525, giro: -25, alto: 560 } },
    { id: 'cesta', nombre: 'Cesta de juguetes', unico: true, contenedor: true, altoM: 0.40, capas: { detras: 'cesta' } },
    { id: 'osito', nombre: 'Osito', unico: true, guardable: true, va: 'peluche', altoM: 0.34, capas: { detras: 'osito' } },
    { id: 'pelota', nombre: 'Pelota', unico: true, guardable: true, altoM: 0.26, capas: { detras: 'pelota' } },
    { id: 'cubos', nombre: 'Cubos de colores', unico: true, guardable: true, altoM: 0.24, capas: { detras: 'cubos' } },
    { id: 'cuento', nombre: 'Libro de cuentos', unico: true, guardable: true, altoM: 0.20, capas: { detras: 'cuento' } },
    // ---------------- salón ----------------
    { id: 'sofa', nombre: 'Sofá', unico: true, anchoM: 1.90, capas: { detras: 'sofa' },
      encima: { peluche: [[430, 545], [887, 545], [1345, 545]], cojin: [[300, 520], [1475, 520]] } },
    { id: 'mesa', nombre: 'Mesa', unico: true, anchoM: 0.85, capas: { detras: 'mesa' },
      // el tablero (elipse de centro 753,318 y radios 560 × 190); 3 platos delante, 3 tazas, la tetera y las galletas
      encima: { mesa: { plato: [[409, 390], [753, 436], [1097, 390]], taza: [[316, 286], [1190, 286], [809, 352]], tetera: [[613, 262]], galletas: [[932, 266]] } } },
    { id: 'estanteria', nombre: 'Estantería', unico: true, altoM: 1.00, capas: { detras: 'estanteria' } },
    { id: 'lampara', nombre: 'Lámpara', unico: true, altoM: 1.50, capas: { detras: 'lampara' } },
    { id: 'alfombra', nombre: 'Alfombra', unico: true, plano: true, anchoM: 2.00, capas: { detras: 'alfombra' } },
    { id: 'cojin-rosa', nombre: 'Cojín rosa', unico: true, anchoM: 0.50, capas: { detras: 'cojin-rosa' }, encima: { peluche: [[767, 440]] } },
    { id: 'cojin-lila', nombre: 'Cojín lila', unico: true, anchoM: 0.50, capas: { detras: 'cojin-lila' }, encima: { peluche: [[755, 460]] } },
    { id: 'cojin-corazon', nombre: 'Cojín corazón', unico: true, va: 'cojin', anchoM: 0.42, capas: { detras: 'cojin-corazon' } },
    { id: 'cojin-estrella', nombre: 'Cojín estrella', unico: true, va: 'cojin', anchoM: 0.42, capas: { detras: 'cojin-estrella' } },
    { id: 'plato', nombre: 'Plato', max: 6, va: 'mesa', anchoM: 0.22, capas: { detras: 'plato' } },
    { id: 'taza', nombre: 'Taza', max: 6, va: 'mesa', anchoM: 0.16, capas: { detras: 'taza' } },
    { id: 'tetera', nombre: 'Tetera', unico: true, va: 'mesa', anchoM: 0.26, capas: { detras: 'tetera' } },
    { id: 'galletas', nombre: 'Galletas', unico: true, va: 'mesa', anchoM: 0.24, capas: { detras: 'galletas' } },
    { id: 'conejito', nombre: 'Conejito', unico: true, va: 'peluche', altoM: 0.36, capas: { detras: 'conejito' } },
  ],
  misiones: [
    { id: 'guardar-juguetes', titulo: 'Guardar los juguetes',
      inicio: '¡Hay juguetes por el suelo! ¿Los guardamos en la cesta?',
      objetivo: { tipo: 'meter', contenedor: 'cesta', objetos: ['osito', 'pelota', 'cubos', 'cuento'] },
      // dónde aparecen los juguetes y la cesta: juntos, en el suelo libre a la derecha de la cama, para que en el iPhone
      // en vertical quepan en la pantalla (la cámara mira a «foco» durante la misión); la muñeca se aparta a «sitioMuneca»
      sitios: [[1100, 1000], [1180, 800], [1240, 960], [1380, 990], [1120, 870], [1440, 880], [1300, 1005]], sitioContenedor: [1330, 760],
      foco: [1260, 880], sitioMuneca: [990, 955],
      bien: ['¡Muy bien!', '¡Genial!', '¡A la cesta!', '¡Así se hace!'],
      fin: '¡Todo recogido! ¡Qué habitación tan ordenada!', premio: { estrellas: 1 } },
    { id: 'merienda', titulo: 'Merienda para tres',
      inicio: '¡Vamos a preparar la merienda para tres! Pon tres platos, tres tazas, la tetera y las galletas en la mesa, y sienta al osito y al conejito.',
      // exactamente 3 platos y 3 tazas (la mesa tiene 3 sitios de cada), la tetera y las galletas; dos invitados sentados
      objetivo: { tipo: 'poner', mueble: 'mesa', cosas: { plato: 3, taza: 3, tetera: 1, galletas: 1 }, sentar: ['osito', 'conejito'], asientos: ['cojin-rosa', 'cojin-lila', 'sofa'] },
      // al empezar se prepara la mesa: la mesa y los dos cojines de suelo van a su sitio (con lo que tengan encima no: todo
      // lo de la merienda baja al suelo, delante, y los invitados esperan detrás, a los lados); la muñeca, detrás de la mesa.
      // Todo cabe en el iPhone en vertical: la cámara mira a «foco» y, en pantallas estrechas, se abre hasta ver «vista»
      // (de x0 a x1) entera
      sitios: [[565, 1003], [683, 1003], [801, 1003], [919, 1003], [1037, 1003], [732, 962], [818, 962], [904, 962]],
      sitiosInvitados: [[560, 770], [1095, 770]], sitioMueble: [800, 860], sitiosAsientos: [[575, 950], [1040, 950]],
      foco: [830, 800], vista: [480, 1180], sitioMuneca: [830, 700],
      bien: ['¡Muy bien!', '¡Qué bonito!', '¡Perfecto!', '¡Eso es!'],
      fin: '¡La merienda está lista! ¡A merendar!', premio: { estrellas: 1 } },
  ],
};
