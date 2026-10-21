# Heladería · revisión y primera versión nueva en copia aislada (21/10/2026)

Rama `pintar-heladeria` (la misma que Pintar). **No es el juego de Amaia y no está publicado.** No cambia `main`,
`avatar-creador`, ningún archivo del juego, las propuestas del avatar, las copias congeladas ni la copia de Pintar
(`../pintar-2026-10-21/`, versión de referencia `708c2f2`). Todo lo nuevo está en esta carpeta.

**Enlace para probarla (Safari):** el fijo de este commit está en el apartado 5.

## Fases y estado

| Fecha | Fase | Estado |
| --- | --- | --- |
| 21/10/2026 | Revisión y primera versión nueva en esta copia aislada (`hel1:`) | Hecho, commit `ef9a583`. |
| 21/10/2026, 20:38 | **Aprobación general de la propietaria** tras probarla en su iPhone: «la Heladería me parece bien» | Aprobación **general**. **No** se dan por comprobados en el iPhone todos los casos de la prueba (cada nivel, cada pista, memoria, «quitar la última», foto, aviso sin espacio, giro, iPad). |
| 21/10/2026 | **Copia de seguridad comprobada** con los datos de la Heladería y el nivel nuevo (apartado 4 bis) | Hecho en Chromium (19/19); **sin probar en el iPhone real**. |
| 21/10/2026 | Corrección menor encontrada al comprobarlo: error de JavaScript si se cambia de modo antes de que el animal hable (0,4 s). La voz solo habla si el pedido sigue en pantalla | Hecho. Es el único cambio de código respecto a la versión aprobada `ef9a583`. |
| 21/10/2026 | **Versión de referencia estable de la Heladería:** la de este commit (el siguiente a `ef9a583`; el hash se anota en la entrada siguiente). **No se integra todavía en el juego principal** | Hecho. La copia queda congelada hasta que se decida integrarla. |
| — | Recompensas | **Pendientes de diseñar.** |

## 1. La Heladería de hoy (revisión)

Medido en Chromium con pantallas simuladas (iPhone 390 × 844 y 844 × 390; iPad 820 × 1180 y 1180 × 820). **No probado
en un iPhone ni un iPad reales.**

**Cómo funciona:** un animal (emoji) pide un helado con un dibujo y con voz; se elige cucurucho o vasito, hasta 3 bolas
de 6 sabores y un adorno de 5; «✅ ¡Toma!» comprueba. Acierto: +1 ⭐, monedas `iceCoins` (bolas + adorno), `iceServed`
+ 1, y la dificultad sube con `iceServed` (de 1 a 3 bolas; adornos desde el 3.er pedido). Fallo: el animal dice qué
falta, sin quitar nada. Las monedas no se gastan en nada.

| # | Problema | Dónde | Gravedad |
| --- | --- | --- | --- |
| 1 | **iPhone horizontal: no se puede jugar bien.** El mostrador empieza fuera de la pantalla (−72 px), el animal tapa el título, hay que desplazar y «¡Toma!» queda cortado. | `.ice-main` / `.ice-pick` | Alta |
| 2 | Solo hay pedidos: **no hay juego libre** para inventar helados. | — | Alta para el objetivo |
| 3 | Los pedidos no ejercitan contar ni memoria: siempre se ve el dibujo completo y no hay número. | `iceNew` | Media |
| 4 | Mostrador de tamaño fijo (200 × 300): pequeño en el iPad; el pedido, 121 px de ancho. | `.counter` | Media |
| 5 | «🔄» borra todo el helado; no hay «quitar la última». | `iceReset` | Media |
| 6 | Si «Mis dibujos» se llena, se borran dibujos antiguos sin avisar (afecta a cualquier foto que se guarde). | `addToGallery` | Alta (ya documentado) |

Se conserva: los 6 sabores, los 5 adornos, cucurucho y vasito, los animales, la voz, los sonidos, las pistas al fallar y
la economía (ver abajo).

## 2. Lo que cambia en la copia

`index.html` de esta carpeta, generado por `preparar_copia.py` desde el `index.html` del juego (cada cambio comprueba el
texto original). Cambia la Heladería, su entrada y `addToGallery`:

- **Entrada con dos modos** («Jugar a ser» → Heladería): «Inventar helados» y «Atender pedidos». Dentro, los botones
  🎨 / 🛎️ de arriba cambian de modo.
- **Todo a la vista sin desplazar** en el iPhone (vertical y horizontal) y en el iPad; en el iPhone horizontal, elegir va a
  la derecha. El helado se ajusta al espacio y cabe entero con 4 bolas y 3 adornos. Botones de 44 px o más.
- **Contador de bolas** en el mostrador (círculo lila con el número) para ayudar a contar.
- **«↩️ Quitar la última»** deshace el último cambio (base, bola o adorno), también «🔄 empezar de nuevo».

**Inventar helados (juego libre):** cucurucho o vasito, **hasta 4 bolas y 3 adornos**, «😋 ¡A probar!» (el animal lo
saborea y dice qué lleva) y «📸» guarda una foto del helado en «Mis dibujos». **No da estrellas, monedas ni cuenta como
pedido**, para que sea juego libre de verdad.

**Atender pedidos (retos cortos por niveles):**

| Nivel | Reto | Cómo se pide |
| --- | --- | --- |
| 1 | **Colores** | 1 bola, nombrada por su color: «una bola rosa». Dibujo del helado. |
| 2 | **Contar** | 1–2 bolas iguales: número grande, una bola y puntos para contar. |
| 3 | **Contar** | 2–3 bolas iguales y, a veces, un adorno. |
| 4 | **Dos sabores** | «Dos de fresa y una de limón»: 2 × bola + 1 × bola. |
| 5 | **Memoria** | El helado se ve unos 4–5 s y se tapa (🤔). «👀» o tocar al animal lo enseña otra vez, sin castigo. |
| 6 | **De todo** | Cualquiera de los anteriores, con adornos. |

- **Sube de nivel tras 3 aciertos** en el nivel (●●○ debajo del pedido); **nunca baja**.
- **Fallar no quita nada.** El animal da una pista concreta y se reintenta: «Yo quería un cucurucho», «Tienes dos bolas y
  yo quiero tres. ¡Cuéntalas!» (el contador late), «Yo quería una bola rosa», «Me falta una bola de fresa y sobra menta»,
  «Me falta una cereza encima»; en memoria, además, el pedido se vuelve a ver un momento.
- Al poner bolas, la voz dice el número en los retos de contar, el color en los de colores y el sabor en los demás.

Capturas: `capturas/antes-despues-iphone.png`, `capturas/antes-despues-ipad.png` y `capturas/retos-por-nivel.png`.

## 3. Datos y economía

- **Economía sin cambios** (las recompensas siguen **pendientes de diseñar**): pedido correcto = **+1 ⭐** (`addStar`),
  **monedas = bolas + adorno** (`iceCoins`), **`iceServed` + 1**, confeti cada 5 pedidos (y al subir de nivel). El juego
  libre no da nada.
- **Clave nueva: `lv_heladeria`** = `{"L": 0–5, "ok": 0–2}` (nivel y aciertos en él). Sigue el patrón `lv_<juego>` de los
  juegos de Pensar, así que **entraría en «Guardar mi progreso» sin cambiar `progreso.js`**. Si falta o está dañada, se
  empieza en el nivel 1. **No cambia ni migra** `stars`, `iceServed`, `iceCoins` ni ninguna otra clave.
- **`addToGallery` seguro** (el mismo de la copia de Pintar): si no cabe, no se borra ningún dibujo antiguo y se avisa.
- **Datos propios de la copia:** `aislamiento.js` con el prefijo `hel1:` en `localStorage` y `hel1-` en IndexedDB. No lee,
  cambia ni migra las claves del juego ni las de otras copias (`pin1:`, `d0xx:`). Sin service worker (necesita conexión).
  App propia «PRUEBA HELADERÍA» si se añade a la pantalla de inicio.
- En esta copia, **Pintar es el del juego**, no el mejorado: la versión de referencia de Pintar es la de `../pintar-2026-10-21/`.

## 4. Probado

Chromium con pantallas simuladas; **sin probar en un iPhone ni un iPad reales**.

- `prueba-heladeria.js`: **46/46**, dos veces seguidas:
  - datos propios (no ve ni cambia las claves del juego ni de otras copias; solo escribe `hel1:`; sin service worker);
  - entrada con los dos modos y cambio de modo dentro;
  - en las 4 pantallas y en los 2 modos: los 20 botones a la vista, de 44 px o más, sin solaparse ni desplazar, y el
    helado entero con 4 bolas y 3 adornos;
  - pedidos nivel a nivel tocando los botones (18 pedidos): cada nivel pide su tipo de reto; cada acierto = +1 ⭐,
    monedas = bolas + adorno e `iceServed` + 1; sube de nivel tras 3 aciertos hasta el 6;
  - fallar no quita nada ni baja de nivel; pistas de cantidad y de base; se reintenta y se acierta; el pedido no cambia a
    mitad de preparación al cambiar de modo y volver (fallo encontrado y corregido durante la prueba);
  - memoria: se ve, se tapa, «👀» lo enseña y se vuelve a tapar; al fallar se vuelve a ver;
  - juego libre: 4 bolas y 3 adornos como máximo, «quitar la última» y deshacer «empezar de nuevo», sin estrellas ni
    monedas, foto en «Mis dibujos» y, sin espacio, no se borra nada;
  - sin errores de JavaScript.
- El juego sigue igual: `pruebas/prueba-juego.js` 21/21 y `pruebas/prueba-copia.js` 45/45.
- La copia de Pintar no ha cambiado desde `708c2f2` (solo su `LEEME.md`).
- **Sin probar:** iPhone/iPad reales (salvo la aprobación general de la propietaria), voces de iOS, dedos de verdad, la
  app instalada sin conexión.

## 4 bis. «Guardar / Recuperar mi progreso» con los datos de la Heladería (21/10/2026)

`prueba-progreso-heladeria.js`: **19/19**, dos veces seguidas. Igual que `pruebas/prueba-copia.js`, simula la app instalada
en el iPhone y su hoja de compartir; **no sustituye la prueba en el iPhone real**. `progreso.js` **no se ha cambiado**.

En la copia de la Heladería, jugando de verdad (4 pedidos y una foto del juego libre):
- **Guardar** exporta tal cual `stars`, `iceCoins`, `iceServed`, **`lv_heladeria`** (`{"L":1,"ok":1}`) y la foto en `gal`.
  El archivo es de pruebas (`PRUEBAS-…json`, marca `version_pruebas`); el resumen cuenta el nivel.
- Tras seguir jugando (sube al nivel 3, más estrellas, se borra la foto), **Recuperar** enseña la comparación; cancelar no
  cambia nada; al confirmar vuelven **exactamente** los datos de la copia, y la Heladería abre en «Nivel 2 · Contar ●○○»
  con las monedas de la copia.
- **Deshacer la última recuperación** vuelve al estado de antes, nivel incluido.
- Una copia **antigua sin `lv_heladeria`** recupera lo que trae y **no borra** el nivel actual: «Recuperar» escribe las
  claves de la copia, pero no quita las que la copia no tiene (así funciona hoy para todas las claves).
- Una copia con `lv_heladeria` **dañado** se rechaza («El archivo está dañado») sin cambiar nada; con valores **fuera de
  rango** (`{"L":99,"ok":-4}`) se acepta y la Heladería abre en el nivel 6 y se puede jugar.
- Las claves del juego y de otras copias no se tocan; la copia de seguridad interna va en `hel1-misjuegos-copias`.

En el **juego principal** (sin cambios): recupera una copia normal con `lv_heladeria` y los datos de la Heladería, la vuelve
a exportar al guardar, y **rechaza** la copia hecha en la versión de pruebas.

**Para cuando se integre:** no hace falta tocar `progreso.js`; `lv_heladeria` entra por el prefijo `lv_`. Si se quisiera que
recuperar una copia antigua devolviera la Heladería al nivel 1, habría que cambiar `progreso.js` (archivo compartido).

## 5. Cómo probarla

**En el iPhone (Safari), enlace fijo de este commit:** se indica en la respuesta de la entrega y en la siguiente entrada
de fases de `../pintar-2026-10-21/LEEME.md` (el hash de un commit no puede escribirse dentro de él). Enlace de la rama
(se actualiza con cada subida):
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/pintar-heladeria/docs/propuestas/heladeria-2026-10-21/index.html>

Comprobar la cinta «🧪 PRUEBA HELADERÍA · datos propios» → «Jugar a ser» → «Heladería», y:
1. **Inventar helados:** poner base, 4 bolas y adornos; «↩️» quita lo último; «🔄» y luego «↩️» lo recupera; «😋»; «📸» y
   mirar en «Pintar → Mis dibujos». Las estrellas de arriba no cambian.
2. **Atender pedidos:** nivel 1 (colores), servir 3 pedidos → sube a «Contar»; fallar a propósito (una bola de menos) y
   escuchar la pista; reintentar.
3. Seguir hasta **memoria** (nivel 5): mirar, esperar a que se tape, «👀», servir.
4. Girar el iPhone en cada pantalla: todo a la vista y el helado entero.
5. Lo mismo en el iPad, vertical y horizontal.

En el ordenador: desde la raíz, `python3 -m http.server 8765` y abrir
`http://localhost:8765/docs/propuestas/heladeria-2026-10-21/index.html`; prueba automática:
`node docs/propuestas/heladeria-2026-10-21/prueba-heladeria.js`.

## 6. Pendiente y para decidir

- Aprobación **general** recibida (21/10). Quedan por comprobar en el iPhone los casos concretos de la prueba (apartado 5).
- Los clientes y adornos siguen siendo **emojis** (como en el juego); ilustrarlos sería otra tarea.
- ¿Elegir el nivel a mano (por ejemplo, un adulto), además de subir solo? Hoy sube solo y no baja.
- ¿Usar las monedas para algo? Forma parte del diseño de recompensas, **pendiente**.
- Integración en el juego: tocaría `index.html` y `sw.js` (versión de la caché) y los documentos generales; se coordinará
  con el chat del avatar antes de hacerlo.
