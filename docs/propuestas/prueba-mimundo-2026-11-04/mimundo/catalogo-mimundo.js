/* =====================================================================
   Mi Mundo · catálogo de la habitación y misiones (datos)
   ---------------------------------------------------------------------
   Cada objeto: id, nombre, alto real en metros (la muñeca mide 1,10 m) o
   escala fija, y su arte (arte/<id>.webp, con su tamaño y su punto de apoyo
   medidos por preparar_piezas.py en arte/medidas.js). Un objeto SIN arte no
   aparece en la bandeja ni en las misiones: no se sustituye por dibujos.
     · altoM: alto en la imagen, en metros (los juguetes, algo generosos para
       poder tocarlos bien en el iPhone; nunca se deforman: misma escala en
       ancho y alto)
     · unico: solo uno en la habitación
     · contenedor: se pueden guardar cosas dentro (soltándolas encima)
     · guardable: se puede guardar en un contenedor
     · acostar: ancla para acostar a la muñeca (cama)
     · gratis (por defecto) o desbloqueo: { logros: n }
   Misiones (opcionales): necesitan que TODOS sus objetos tengan arte y sean
   gratis. Tipos de objetivo: «meter» (guardar cosas en un contenedor); más
   adelante, «encontrar» (pistas) y «poner» (preparar una merienda).
   ===================================================================== */
window.MM_CATALOGO = {
  objetos: [
    { id: 'cama', nombre: 'Cama', unico: true, inicial: { x: 416, y: 979 }, escala: 0.62, yRef: 979,
      capas: { detras: 'cama-detras', delante: 'cama-delante' }, acostar: { cx: 385, cy: 525, giro: -25, alto: 560 } },
    { id: 'cesta', nombre: 'Cesta de juguetes', unico: true, contenedor: true, altoM: 0.40, capas: { detras: 'cesta' } },
    { id: 'osito', nombre: 'Osito', unico: true, guardable: true, altoM: 0.34, capas: { detras: 'osito' } },
    { id: 'pelota', nombre: 'Pelota', unico: true, guardable: true, altoM: 0.26, capas: { detras: 'pelota' } },
    { id: 'cubos', nombre: 'Cubos de colores', unico: true, guardable: true, altoM: 0.24, capas: { detras: 'cubos' } },
    { id: 'cuento', nombre: 'Libro de cuentos', unico: true, guardable: true, altoM: 0.20, capas: { detras: 'cuento' } },
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
  ],
};
