# ¿La capa común de lectura bloquea el salón? (16/11/2026)

Nota del chat de `juegos-pensar` para la propietaria y el Chat 1 (`avatar-creador`). Pedido de la propietaria (16/11):

> He probado la versión del Chat 1 en mi iPhone. En la habitación las interacciones funcionan, pero en el salón no
> responden. Comprueba si la capa común de lectura puede estar interfiriendo con los eventos táctiles, los botones o las
> capas superpuestas. No modifiques a ciegas el código del salón, que pertenece a la otra rama. Si encuentras la causa,
> documéntala y coordina la corrección con avatar-creador.

**No se ha modificado nada de `avatar-creador`.**

## Conclusión (coincide con la del Chat 1, commit `4dd3a80`)

- **La capa común no bloquea los toques.** Comprobado aquí en Chromium, con toques táctiles reales en la habitación y el
  salón, vertical y horizontal: el resultado es igual con la capa y sin ella. El Chat 1 lo confirmó también en WebKit, el
  motor del iPhone, que este entorno no tiene.
- **La causa del salón estaba en el motor de Mi Mundo**, según el diagnóstico del Chat 1 en `4dd3a80`:
  - un bloqueo de 1,2–8 s tras cada juego;
  - muebles del salón sin acción;
  - la alfombra tapando el suelo.

  El Chat 1 lo corrigió en su copia de «cuidar». La prueba en el iPhone queda pendiente de la propietaria.
- **La capa de `f3005ce` sí tenía un bucle.** En las pantallas con título, el ajuste de títulos se volvía a llamar a sí
  mismo: unos **60 cambios por segundo** sin parar.
  - No bloqueaba los toques, pero gastaba batería y fluidez.
  - Aquí no lo vi al principio porque lo medí en Mi Mundo, sin título a la vista.
  - Medido después en Pensar: **120 cambios en 2 s** en Contar, ¿Quién es? y Dibujos por partes.
  - El Chat 1 lo corrigió en `4dd3a80`. Con su versión, **0 cambios en 2 s**.

## Qué se probó aquí (en una copia temporal de `f3005ce`, fuera del repositorio)

| Prueba (copia `prueba-cuidar-2026-11-15`) | Con la capa | Sin la capa |
| --- | --- | --- |
| Su prueba del salón (`prueba-salon-aqui.js`, con ratón) | 30/31 o 31/31 (el «toque tolerante» de una taza falla a veces) | 31/31 en tres pasadas |
| Ese toque tolerante aislado, 14 veces | 14 de 14 | 13 de 13 |
| Dedo real (CDP), habitación y salón, vertical y horizontal: muñeca, cojín, bandeja, misiones | igual que sin la capa | igual que con la capa |
| Capas de luz y noche del salón | todas con `pointer-events:none` | — |

## Qué cambia en `juegos-pensar`

- La capa común es ahora la de **`4dd3a80`**, sin cambios: carpeta `docs/propuestas/lectura-2026-11-17/`, idéntica a la
  de `avatar-creador`; lo comprueban las pruebas. Sustituye a la de `f3005ce`, que llevaba el bucle.
- **`prueba-lectura.js` de Pensar comprueba que no hay bucles:** con la pantalla quieta, 0 cambios en 2 s.
- La prueba propia de la capa (`lectura-2026-11-17/prueba-lectura.js`) espera Mi Mundo (`MM`), que no está en la copia
  de Pensar: pasa sus primeras comprobaciones y se para en la de Mi Mundo. Su criterio de contraste y de texto cortado
  está copiado tal cual en la prueba de Pensar. Sugerencia para el Chat 1: comprobar Mi Mundo solo si existe
  (`window.MM`).
