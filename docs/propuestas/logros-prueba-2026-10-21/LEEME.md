# Primera prueba de logros · copia aislada (21/10/2026)

Prueba pequeña de la propuesta `../recompensas-2026-10-21/LEEME.md`, pedida por la propietaria el 21/10 a las 21:21, para
ver si Amaia entiende el recorrido: **completar un reto, confirmar una tarea y abrir el primer cofre**.
Rama `pintar-heladeria`. **No es el juego de Amaia y no está publicada.** No cambia `main`, `avatar-creador`, ningún
archivo del juego (`progreso.js` incluido), Vestir, los catálogos ni las referencias congeladas de Pintar (`708c2f2`) y la
Heladería (`7aeb5b7`). Todo lo nuevo está en esta carpeta.

**Enlace fijo (Safari):** se anota en `../recompensas-2026-10-21/LEEME.md` (el hash de un commit no puede ir dentro de él).

## Qué hay

- **Inicio:** contador **🏅** junto a las estrellas y botón **«Retos y logros»**.
- **Mis logros:** tres **cofres** (3, 6 y 10 logros, con puntos de progreso), los dos **retos**, las dos **tareas** de
  ejemplo y la lista de **premios de prueba** abiertos. Botón 👪 para la zona de adultos.
- **Retos:** **Contar** (1–5 cosas, se pueden tocar para contar) y **Colores** («¿Cuál es el azul?»), **3 rondas** cada
  uno. Al fallar: «¡Casi! Prueba otra vez»; al 2.º fallo brilla la buena; al 3.º se resuelve («Mira, era este») y se sigue.
  Al terminar, **+1 logro** aunque haya fallado. **Cada reto da un logro una vez al día**: se puede repetir y celebra, pero
  dice «Hoy ya tienes el logro de este reto». No hay otro límite diario.
- **Tareas de ejemplo:** «Recoger los juguetes» y «Lavarse los dientes». «¡Lo he hecho!» deja la tarea **esperando a un
  adulto** (⏳); no suma hasta que se confirma. Cuando se confirma, Amaia lo celebra al volver a «Mis logros».
- **Zona de adultos** (👪 en «Mis logros» y en ⚙️ Ajustes): **código de 4 cifras** (la primera vez se elige y se repite);
  «¿Has olvidado el código?» pide una multiplicación y deja poner otro. Dentro: **✅ Confirmar** (+1 logro; **cada
  confirmación cuenta una sola vez**, aunque se toque dos veces) o **Todavía no** (quita el aviso, sin castigo), la lista de
  logros con su origen y fecha, y los premios abiertos. Es una barrera para una niña de 5 años, **no una seguridad real**.
- **Cofres:** al llegar a 3, 6 y 10 logros, uno detrás de otro. Se abre, Amaia **elige 1 de 2 premios** y queda abierto.
- **Un único contador de logros**, separado de las estrellas: los retos **no dan estrellas** y las estrellas no cambian.

## Premios provisionales (claramente identificados)

Todos son **contenido nuevo**, solo para esta prueba (identificadores `prov-…`). Lo que ya existe en Pintar y la Heladería
sigue igual y libre. En el juego aparecen con **borde naranja discontinuo y 🎁**; en el cofre, con la etiqueta
«🎁 premio de prueba»; en «Mis logros», bajo «Premios de prueba (provisionales)».

| Cofre | Opción A | Opción B |
| --- | --- | --- |
| 1 (3 logros) | Sellos mágicos para Pintar (🦄 🧚 💖 🌟) | Sabor arcoíris en la Heladería |
| 2 (6 logros) | Color dorado para Pintar | Caramelos de adorno en la Heladería (🍬) |
| 3 (10 logros) | Sellos del mar para Pintar (🐬 🐚 🐙 🦀) | Sabor chicle en la Heladería |

Los pedidos de la Heladería **nunca** piden un premio (solo los 6 sabores y 5 adornos de siempre). En esta copia, Pintar
y la Heladería son **las del juego** (no las versiones de referencia), con los premios añadidos.

**Nada aprobado se bloquea:** Vestir ofrece exactamente lo mismo que el juego, sin candados ni marcas; el catálogo y
`normalizar()` no cambian.

## Datos

- **Datos propios** con `aislamiento.js`: prefijo `rec1:` en `localStorage` y `rec1-` en IndexedDB. No lee, cambia ni migra
  las claves del juego ni las de otras copias. Sin service worker (necesita conexión). App «PRUEBA LOGROS».
- Claves nuevas (en la copia, con `rec1:`):
  - `logros` = `{v:1, lista:[{id, tipo, que, fecha, dia, visto}]}`; `id`: `r:<día>:<reto>` o `t:<id del aviso>`;
  - `tareas` = `{v:1, avisos:[{id, tarea, fecha}]}` (las dos tareas de ejemplo están en el código);
  - `premios` = `{v:1, cofres:[{n, elegido, fecha}]}`;
  - `adultos` = `{codigo: huella del código}`.
- **Sin duplicados:** el total de logros se **calcula** contando entradas con `id` distinto; al leer se quitan repetidos
  (logros por `id`, cofres por número, avisos ya confirmados). Ningún contador se guarda como número suelto.
- **Copia de seguridad:** para que «Guardar mi progreso» incluya estas claves, la copia carga **su propia copia de
  `progreso.js`**, generada desde la del juego, en la que **solo** se añaden `logros`, `tareas` y `premios` a la lista de
  claves. **La recuperación es la de hoy** (sustituye cada clave por la de la copia y no borra las que no trae); la unión de
  historiales queda pendiente. `adultos` (el código) **no** va en la copia, así que recuperar no cambia el código.
  El `progreso.js` del juego **no se toca**.

## Probado

`prueba-logros.js`: **37/37**, dos veces seguidas (Chromium con iPhone e iPad simulados; **sin probar en el iPhone real**):
- datos propios y nada del juego tocado;
- Vestir con las mismas opciones que el juego y sin marcas; Pintar con sus 15 colores y 18 sellos, la Heladería con sus 6
  sabores y 5 adornos, y los premios ocultos hasta abrirlos; 400 pedidos sin premios;
- el recorrido tocando: Contar con 3 fallos (pista y resolución) → 1 logro; repetirlo el mismo día no suma; Colores (la
  voz pide el color bueno) → 2; «¡Lo he hecho!» espera sin sumar; código que no coincide y después bien; confirmar con dos
  toques seguidos → 3 (una vez); «Todavía no» no suma; celebración al volver; cofre 1 listo → dos premios de prueba →
  «Sellos mágicos» en Pintar con 🎁; otros días: 6 → cofre 2; con 8 el cofre 3 aún no; 10 → cofre 3;
- código incorrecto y «¿Has olvidado el código?»;
- copia de seguridad: guarda logros, tareas y premios (no el código); recuperar una copia anterior vuelve a ese momento
  (3 logros y 1 cofre); «Deshacer» devuelve los 10 logros y los 3 cofres; **importar la misma copia dos veces no duplica**;
  un archivo con logros y cofres repetidos cuenta cada uno una vez; el código se conserva;
- «Mis logros», reto, cofre y zona de adultos en iPhone e iPad (vertical y horizontal): botones de 44 px o más, sin
  desbordar a lo ancho;
- sin errores de JavaScript.
- El juego sigue igual: `pruebas/prueba-juego.js` 21/21 y `pruebas/prueba-copia.js` 45/45.

Capturas: `capturas/recorrido-iphone.png` (tareas esperando, zona de adultos, cofre listo, elegir premio, sellos en
Pintar, premios en la Heladería).

## Cómo probarla en el iPhone (unos 5 minutos)

1. Abrir el enlace en Safari y comprobar la cinta «🧪 PRUEBA LOGROS · datos propios».
2. **Inicio → «Retos y logros» → Contar**: hacer las 3 rondas (fallar alguna a propósito): «¡Has ganado un logro!», 🏅 1.
3. **Colores**: 🏅 2. Repetir Contar: dice que hoy ya tiene el logro y el contador sigue en 2.
4. **«¡Lo he hecho!»** en «Recoger los juguetes»: queda «⏳ Esperando a un adulto».
5. **👪** → elegir un código de 4 cifras y repetirlo → **✅ Confirmar** → **✅ Listo**: celebración y 🏅 3.
6. **Cofre 1 → «¡Ábrelo!»** → elegir un premio. Buscarlo en Pintar (sellos, con 🎁) o en la Heladería (sabor, con 🎁).
7. Lo que más interesa: **¿lo entiende Amaia?** (qué toca sin ayuda, qué no entiende, si el cofre le motiva).

Para volver a empezar: Ajustes de Safari → Avanzado → Datos de sitios web → borrar `raw.githack.com` (borra también los
datos de las otras pruebas en esa dirección, nunca los de la app de Amaia).

## Pendiente

- Prueba en el iPhone y valoración con Amaia.
- Decisiones de la propuesta: umbrales definitivos, premios reales, Letras y Memoria, unión al recuperar (cambio en
  `progreso.js`, archivo compartido), dónde va el botón de los retos en el juego.
