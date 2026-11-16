# Copia aislada · Mi Mundo: cuidar a la muñeca (D-037, 1.ª entrega) · 15/11/2026

**Pendiente de la prueba y la aprobación de la propietaria. No publicada.** No es el juego de Amaia: datos propios con el
prefijo `cui1:` (no lee ni cambia las partidas, ni las de otras copias) y sin service worker.

Enlace de prueba (siempre lo último de la rama):
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-cuidar-2026-11-15/index.html>

Parte de la copia del salón (`../prueba-salon-2026-11-07/`, D-034): lo publicado con Contar y Memoria + Mi Mundo con la
habitación y el salón, y añade lo siguiente.

**Norma de lectura (D-038, 15/11):** esta copia carga la capa común `../lectura-2026-11-17/` y sus textos de Mi Mundo
siguen `docs/NORMA_TEXTOS_INFANTILES.md`:
- MAYÚSCULAS, frases breves en primera persona («TENGO SUEÑO», «PONME EL PIJAMA») y botones con verbo («PONER EL
  PIJAMA», «SEGUIR JUGANDO»);
- las misiones dan **una instrucción cada vez** («GUARDA EL OSITO», «PON UN PLATO»), con el dibujo de esa pieza y su voz.

**16/11 · el salón responde en el iPhone** (prueba real en `f3005ce`: en el salón no respondía nada):
- **El último toque gana:** antes, tras cada juego, durante 1,2 a 8 s no respondía a nada.
- **Cada mueble y objeto del salón responde:**
  - el sofá («¡QUÉ BLANDITO!», descansa: algo de sueño);
  - los cojines y la estantería (diversión);
  - la mesa («¿PONEMOS LA MESA?» y el panel de la merienda);
  - la lámpara (se enciende o se apaga y lo dice);
  - los platos, las tazas, la tetera y las galletas.
- **La alfombra se toca como el suelo:** la muñeca va allí. Se sigue arrastrando para moverla; al soltarla queda
  seleccionada para poder quitarla.
- **Pruebas:**
  - `prueba-tactil.js`: toques y arrastres con el dedo de verdad, con la capa de lectura y sin ella, con el mismo resultado;
  - `prueba-webkit.js`: el motor de Safari; requiere WebKitGTK, ver su cabecera.

## Qué tiene esta entrega

### 1. Cámara independiente
- **Flechas ◀ ▶** a los lados: mueven la vista; solo se ven si hay más habitación hacia ese lado (en el iPad en horizontal
  cabe entera y no salen).
- La vista **no sigue a la muñeca** y moverla no la mueve a ella.
- **Arrastrar el suelo** también desplaza la vista (tocarlo sin arrastrar sigue haciendo que ella ande).
- **Llevar a la muñeca o un objeto cerca del borde** y dejar el dedo allí un momento (0,4 s) desplaza la vista para llegar a
  otra zona; al pasar por el borde o soltar algo junto a él, la vista no se mueve.
- Si la muñeca queda fuera de la pantalla aparece **un botón redondo con su cara** (abajo a la derecha): la vuelve a encontrar.
- Cada escenario recuerda su vista. Al empezar una misión, la vista va a la misión.

### 2. Día y noche
- **Tocar la ventana** alterna día y noche (en la habitación y en el salón), y se guarda (`mm_ciclo`).
- De noche: luz azulada en la escena y cielo oscuro en la ventana; **la lámpara del salón** se enciende o se apaga
  tocándola y da una luz cálida. **Provisional:** es un efecto de luz sobre el arte de día (ver «Arte que falta»).

### 3 y 4. Necesidades e interacciones
Solo se activan las que tienen **un objeto ilustrado y una acción** para atenderlas: **sueño** (la cama) y **diversión**
(pelota, cubos, cuento, osito, conejito).

- **Indicadores** pequeños arriba a la izquierda, con el dibujo del objeto que las atiende (la cama, la pelota). Tocarlos:
  ella dice cómo está.
- **Bajan despacio y solo mientras se juega en Mi Mundo** (con la app cerrada o en otra pantalla, no cambian):
  - diversión, 0,1 por segundo (unos 8 minutos de 85 a 35);
  - sueño, 0,067 por segundo (unos 12 minutos), el doble de noche.
  - Nunca bajan de 15.
  - Durante una misión esperan (la misión se juega como siempre).
- **Avisos breves**: el dibujo, una frase y la voz.
  - Una sola vez cuando bajan de 35, y no vuelven a avisar hasta que suben de 60.
  - Como mucho un aviso cada 90 segundos.
  - Tocar el aviso lleva la vista al objeto.
  - Sin enfermedades, castigos ni pérdida de premios.
- **Dormir** en la cama: el sueño sube (de 15 a 100 en unos 35 s) y la diversión no baja. Al despertar: «¡He dormido genial!».
- **Jugar** (tocar el juguete): ella va hasta él y responde sin posturas nuevas. Lo que dice sale también escrito en un
  bocadillo, por si el sonido está apagado.

| Juguete | Qué hace ella | Diversión |
| --- | --- | --- |
| Pelota | Salta tres veces y la pelota bota | +25 |
| Cubos | Sonríe con destellos y los cubos se mueven | +20 |
| Cuento | Sonríe y cuenta el principio de una historia mientras el cuento late | +20 |
| Osito o conejito | Saluda y el peluche da un saltito | +15 |

- **Misiones**: al completarlas, +30 de diversión.

### 5. Rutina del pijama (y la ropa de día) · ajustada el 15/11 a lo pedido
- **Para dormir hace falta el pijama.**
  - **Si ya lo lleva**, al llevarla a la cama (tocar la cama o soltarla encima) se acuesta directamente.
  - **Si no**, se le pide «Para dormir, ¿nos ponemos el pijama?», con un dibujo de ella misma en pijama (solo para
    enseñarlo), y dos opciones:
    - **«👗 Ponerse el pijama»**: lleva a **Vestir**, donde el botón flotante **«✅ Guardar y volver»** la devuelve **al mismo
      escenario**; si vuelve **con el pijama**, va a la cama y se duerme.
    - **«Seguir jugando»**: no se acuesta y sigue jugando.
  - Ya no existe «Dormir así».
  - **Si vuelve de Vestir sin el pijama** (también con ⬅️), vuelve al mismo escenario pero **no se la acuesta**: «Para dormir
    me pondré el pijama».
  - La pregunta solo sale cuando se la lleva a la cama sin pijama (nunca por sí sola).
- **Nunca se le cambia la ropa sin que ella elija.**
- **De día**, si lleva el pijama, propone una vez «¿Nos vestimos para jugar?», enseñando un vestido. Responde «👗 Elegir la
  ropa» (Vestir y volver) o «Así está bien».
- Toda la ropa de Vestir es gratis (el pijama también).
- **Conjunto de aventura**: queda para el parque. Todavía no hay ninguna actividad de «salir de aventura» a la que
  asociarlo.

## Pendiente (no se activa todavía)

Hambre, higiene y ganas de ir al baño ya están **definidas en el catálogo como pendientes**: no se activan aunque llegue el
arte (por ejemplo, las galletas ya tienen ilustración), ni guardan datos, hasta que su espacio y su acción estén
programados y aprobados. Propuesta de la cocina y el baño, con las ilustraciones necesarias y las piezas reutilizadas:
[`../mimundo-cocina-bano-2026-11-16/`](../mimundo-cocina-bano-2026-11-16/LEEME.md).

## Arte que falta para que las acciones se vean de verdad (sin deformar a la muñeca)

**Posturas nuevas de nuestra muñeca**, con la misma cara y las mismas capas de ropa y peinado (`docs/NORMA_VISUAL_MUNECA.md`):
- **Sentada de frente** (en el sofá, en un cojín o en una silla): para leer, merendar y descansar.
- **Sentada leyendo**, con el cuento abierto en las manos.
- **Abrazando** (brazos delante), para el osito y el conejito.
- **Con la pelota en las manos** (o lanzándola).
- **Comiendo** (sentada, con la mano a la boca), para la merienda.
- **Lavándose** las manos o la cara, y en la bañera (solo cabeza y hombros, con espuma), para la higiene.

**Escenarios y objetos:**
- **Fondos de noche** de la habitación y del salón (el mismo dibujo, con la ventana de noche y la luz apagada), para
  sustituir el efecto provisional.
- **Lámpara encendida** (pantalla iluminada).
- **Cuento abierto**.
- **La cocina** (con su mesa y comida) y **el baño** (bañera, lavabo, inodoro infantil, toalla, jabón), cada uno con su
  lista de piezas, como se hizo con el salón.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `mimundo/mimundo.js` | Motor de Mi Mundo (el del salón + cámara, día y noche, necesidades, juegos y rutinas). |
| `mimundo/mimundo.css` | Estilos (los del salón + lo nuevo). |
| `mimundo/catalogo-mimundo.js` | Escenarios (con su ventana), objetos (con su juego, la lámpara con su luz), necesidades, pendientes y misiones. |
| `mimundo/arte/` | Copia exacta del arte del salón (23 piezas y medidas.js), sin cambios. |
| `preparar_copia.py` | Genera `index.html`, `progreso.js` y `logros.js` y copia el arte. |
| `aislamiento.js`, `manifest.json` | Datos propios `cui1:`, «PRUEBA CUIDAR». |
| `prueba-cuidar.js` | Prueba de esta entrega (35 comprobaciones; iPhone e iPad simulados). |
| `prueba-salon-aqui.js` | La prueba del salón aplicada a esta copia: lo anterior sigue igual (31). |
| `prueba-tactil.js` | Toques y arrastres táctiles de verdad en el salón y la habitación (14), con la capa de lectura o sin ella. |
| `prueba-webkit.js` | El salón en WebKit (motor de Safari) por WebDriver: cada mueble se mueve y responde. |
| `prueba-sin-conexion.js` | Versión publicable con esta carpeta en una carpeta temporal (sin publicar), en modo avión (9). |

Datos nuevos: `mm_necesidades` y `mm_ciclo` (y `cam` dentro de `mm_habitacion2` y `mm_salon`). Todos con el prefijo `mm_`:
van en «Guardar / Recuperar mi progreso».
