# Pintar, Heladería y recompensas · revisión y primera mejora (21/10/2026)

Trabajo **separado del avatar**: rama local `pintar-heladeria`, creada desde `avatar-creador` (`884a775`). No cambia
`main`, ningún archivo del juego, las propuestas del avatar ni las copias congeladas (`prueba-juego-d016/d021/d023/d026`).
**Nada publicado.** Todo lo nuevo está en esta carpeta.

## 1. Pintar: revisión del juego actual

Medido en Chromium con pantallas simuladas (iPhone 390 × 844 y 844 × 390; iPad 820 × 1180 y 1180 × 820). **No probado
en un iPhone ni un iPad reales.**

| # | Problema | Dónde | Gravedad |
| --- | --- | --- | --- |
| 1 | **Girar el dispositivo encoge el dibujo** y borra «deshacer». Al girar y volver, la casa de prueba queda diminuta (tinta: 145 602 → 3 521 px) y `P.undo` pasa de 6 a 0. | `layoutCanvas` reescala la imagen al nuevo tamaño | Alta: Amaia pierde su dibujo sin hacer nada mal |
| 2 | **iPhone vertical:** ↩️, 🗑️ y 💾 quedan fuera de la pantalla y solo se ven 3 de 15 colores; hay que desplazar barras sin barra visible. | barras `.bar` con desplazamiento oculto | Alta para jugar sola |
| 3 | **iPhone horizontal:** el papel mide solo 232 px de alto; 11 de 15 colores. | barras arriba y abajo | Media |
| 4 | **Deshacer solo 6 pasos** y no hay **rehacer**. | `pushUndo` | Media |
| 5 | **🗑️ borra todo al primer toque**, junto a ↩️. Se puede deshacer, pero no después de girar (punto 1). | `clearBtn` | Media |
| 6 | **Si «Mis dibujos» se llena, se borran los más antiguos sin avisar** y sale «¡Guardado!» (riesgo ya documentado). | `addToGallery` | Alta |
| 7 | **Cada salida con cambios crea una entrada nueva**, y cada 💾 otra: duplicados que llenan antes la galería (y alimentan el punto 6). | `onLeave.paint`, `savePaint` | Media |
| 8 | Color elegido poco visible (se agranda y tapa a los vecinos); el blanco casi no se distingue; sin nombre de color. | `.sw` | Baja-media |
| 9 | El cubo sin efecto (pintar del mismo color) gasta un paso de deshacer. | `pointerdown` | Baja |

Lo que ya funcionaba bien y se conserva tal cual: pincel, arcoíris, cubo con tolerancia y sin halos, pegatinas, goma,
19 láminas, láminas importadas (IndexedDB `misjuegos`), galería y edición desde la galería, voz y sonidos.

## 2. Primera mejora (copia aislada)

`index.html` de esta carpeta, generado por `preparar_copia.py` desde el `index.html` del juego (cada cambio comprueba
el texto original). Cambia solo la pantalla de Pintar y `addToGallery`:

- **Todo a la vista sin desplazar.** iPhone vertical: dos filas de botones (52 px) y colores en dos filas de 8 (44 px).
  iPhone horizontal: herramientas a la izquierda y colores a la derecha; el papel pasa de 824 × 232 a 570 × 352.
  iPad: una fila de botones arriba y los colores en una fila (horizontal) o dos (vertical). Mismos botones, iconos, colores y estilo pastel.
- **Colores:** ✓ en el elegido (blanco o tinta según el color, para que se vea siempre), borde al blanco, nombre dicho en
  voz alta («rojo», «lila»…) y un puntito con el color en el pincel. Las herramientas también dicen su nombre.
- **Deshacer y rehacer (↪️):** hasta 20 pasos según la memoria del aparato (6 como mínimo, ≈ 90 MB como máximo); los
  botones se apagan cuando no hay nada que deshacer o rehacer.
- **Girar ya no cambia el dibujo:** el papel se crea al entrar y al girar solo se recoloca (se ve más pequeño en
  horizontal si se empezó en vertical, pero intacto y con todos sus pasos de deshacer).
- **🗑️ pide un segundo toque** (se pone roja y dice «¿Borrar todo? Toca otra vez la papelera»; el aviso caduca a los
  3,5 s) y se puede deshacer.
- **Guardar sin perder ni duplicar**, con el mismo formato de `gal` (lista de imágenes):
  - cada dibujo tiene **su** entrada; volver a pulsar 💾 o salir con cambios la **actualiza**; sin cambios, «Ya está guardado ✓»;
  - un dibujo abierto desde «Mis dibujos» se guarda como **copia nueva**: el original no se toca;
  - **si no cabe, no se borra nada**: aviso «No cabe más en Mis dibujos · Pide ayuda a un adulto · Tu dibujo sigue aquí».
    Se aplica también a la foto de Vestir, que usa la misma función.

**Datos propios:** `aislamiento.js` (el de D-026 con el prefijo cambiado): `pin1:` en `localStorage` y `pin1-` en
IndexedDB. No lee, cambia ni migra las claves del juego ni las de otras copias. Sin service worker (necesita conexión).
App propia «PRUEBA PINTAR» si se añade a la pantalla de inicio.

### Antes y después

`capturas/antes-despues-iphone.png`, `capturas/antes-despues-ipad.png` y `capturas/antes-despues-girar.png`.

### Probado (Chromium, pantallas simuladas)

- `prueba-pintar.js`: **34/34** (datos propios; las 28 herramientas, grosores y colores a la vista y sin solaparse en las
  cuatro pantallas, de 44 px o más; deshacer 9 y rehacer 9; girar conserva dibujo y deshacer; cubo sin efecto; 🗑️ con
  dos toques; guardar sin duplicar; editar crea copia; sin espacio no se borra nada; láminas; sin errores).
- El juego sigue igual: `pruebas/prueba-juego.js` 21/21 y `pruebas/prueba-copia.js` 45/45.
- **Sin probar:** iPhone/iPad reales, la app instalada, voces de iOS, dedos de verdad (palma apoyada, dos dedos).

### Cómo probarla

En el ordenador: desde la raíz, `python3 -m http.server 8765` y abrir
`http://localhost:8765/docs/propuestas/pintar-2026-10-21/index.html` (con el modo móvil del navegador).
Prueba automática: `node docs/propuestas/pintar-2026-10-21/prueba-pintar.js`.

En el iPhone (cuando la rama esté en GitHub; **todavía no está subida**):
`https://raw.githack.com/LaPiazzaAndorra/mis-juegos/pintar-heladeria/docs/propuestas/pintar-2026-10-21/index.html`
→ comprobar la cinta «PRUEBA PINTAR» → Pintar → Hoja en blanco, y:
1. Pintar con varios colores: ¿se ven todos los botones y colores sin desplazar? ¿Dice el nombre del color?
2. Tres trazos → ↩️ ↩️ → ↪️: vuelve uno.
3. Girar el iPhone y volver: el dibujo sigue igual y ↩️ funciona.
4. 🗑️ una vez (no borra) → otra vez (borra) → ↩️ (vuelve).
5. 💾, seguir pintando, 💾 otra vez, salir: en «Mis dibujos» hay **un** dibujo, el último.
6. Abrir ese dibujo → ✏️ → pintar → 💾: hay dos, y el primero no ha cambiado.
7. Lo mismo en el iPad, en vertical y en horizontal.

### Siguientes mejoras posibles de Pintar (no hechas)

Pedir confirmación también al borrar un dibujo de la galería con un gesto más claro; deshacer tras salir y volver;
ver «Mis dibujos» ordenados con el último arriba y una marca «nuevo»; láminas originales más elaboradas (hoja de ruta).

## 3. Heladería: revisión y propuesta (sin hacer)

**Hoy:** un animal pide un helado (dibujo + voz); se elige cucurucho o vasito, hasta 3 bolas de 6 sabores y un adorno
de 5; ✅ ¡Toma! comprueba. Acierto: +1 ⭐, monedas (`iceCoins`) por bolas y adorno, `iceServed` sube y la dificultad crece
(de 1 a 3 bolas; adornos desde el 3.º pedido). Fallo: el animal dice qué falta, sin quitar nada. Las monedas **no se
gastan en nada**. Detalles: los animales y adornos son emojis; en el iPhone horizontal la barra de elegir ocupa mucho.

**Propuesta: dos modos en la entrada de la Heladería**
- **Juego libre «Inventa helados»:** sin pedidos ni comprobación. Hasta 4 bolas, adornos, salsa; botones «probar»
  (el animal reacciona) y «foto» a «Mis dibujos» (con el guardado seguro de arriba). No da estrellas, para que sea libre.
- **Pedidos:** como ahora, más retos cortos por niveles:
  - **cantidades:** «quiero **tres** bolas» (con el número y puntos), «dos de fresa y una de limón»;
  - **memoria:** el pedido se ve unos segundos y se tapa (el animal lo repite si se toca); empieza con 1 bola;
  - **colores:** los sabores se nombran por color al principio («una bola rosa»);
  - fallo = pista y reintento, nunca se pierde nada; acierto = ⭐ como ahora.
- Datos: se mantienen `iceServed` e `iceCoins`; el modo y el nivel irían en una clave nueva (`ice_nivel`), sin tocar
  las existentes. **Pendiente de tu aprobación** antes de programarlo.

## 4. Estrellas y recompensas: cómo funcionan hoy y propuesta (sin cambiar nada)

**Hoy** (`stars` en `localStorage`, `addStar`): +1 por pedido correcto de la Heladería; +1 al guardar el primer personaje
en Vestir; Parejas +2 / +3 / +5 según el nivel; Contar, ¿Qué sigue?, Sombras y El diferente +1 por acierto (fallar baja
un poco el nivel, `lv_<juego>`, pero no quita estrellas). Las estrellas solo se cuentan y se enseñan: **no se gastan ni
desbloquean nada**. Van en la copia de seguridad.

**Propuesta**
- **Actividades breves (2–3 minutos, 5 rondas):** Letras (encontrar la letra inicial: «¿con qué letra empieza oso?»; su
  nombre), Contar (ya existe), Memoria (Parejas o el pedido tapado de la Heladería) y Colores (toca el color que se dice).
  Reintentos ilimitados; fallar nunca resta.
- **Desbloqueo por metas, sin gastar** (recomendado): al **alcanzar** 10, 25, 50… estrellas ganadas se abre una prenda o
  peinado nuevo, que ya no se pierde. Así las estrellas nunca bajan y no hay que «ahorrar». Alternativa: «tienda» que
  gasta estrellas (más economía; no la recomiendo a los 5 años). **Armario inicial gratis:** todo lo que hay hoy.
- **Tareas reales** («he recogido los juguetes»): las propone un adulto y solo se confirman con un **control de adulto**
  (por ejemplo, mantener pulsado 3 s y un código que pone el adulto en Ajustes).
- **Datos (solo propuesta):** claves nuevas `premios` (lo desbloqueado, por identificador del catálogo) y
  `estrellas_ganadas` (total histórico, para las metas, empezando por el valor actual de `stars`). No se cambia `stars`.
  Con migración probada y en la copia de seguridad antes de activarlo.
- **Depende del avatar:** qué ropa y peinados son «extra» se decide en el catálogo de la muñeca, que lleva el otro chat.

## 5. Gincana o carrera: qué consta

Solo **una línea de la hoja de ruta** (`docs/HOJA_DE_RUTA.md`): «Media · Movimiento · Gincana o carrera infantil ·
Propuesta · Obstáculos sencillos, dificultad progresiva y controles fáciles». La misma idea estaba en el paquete
histórico del 14/10 (`docs/historico/…/HOJA_DE_RUTA.md`: «Carrera/gincana infantil… sin controles complejos»). **No hay
decisión, diseño, código ni arte**: no hay nada acordado más allá de que es una idea de prioridad media.

## 6. Archivos compartidos con el chat del avatar

Este trabajo **no ha cambiado** ninguno. Para integrar después habría que tocar (se avisará antes):
`index.html` (Pintar, Heladería, estrellas), `sw.js` (versión de la caché), y los documentos comunes
`docs/ESTADO_ACTUAL.md`, `docs/REGISTRO_CAMBIOS.md`, `docs/HOJA_DE_RUTA.md`, `docs/MANUAL_PROYECTO.md`,
`docs/DECISIONES.md`, `docs/ARQUITECTURA_Y_DATOS.md`, `docs/VERSION_DE_PRUEBAS.md` y `docs/propuestas/LEEME.md`. Para
las recompensas, además, `avatar/catalogo-*.js` y `avatar/motor.js`, que son del avatar.
