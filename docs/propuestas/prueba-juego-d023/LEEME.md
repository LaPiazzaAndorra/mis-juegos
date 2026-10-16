# Prueba aislada del juego: piel, pelo, cejas, ojos y pintacaras (D-023) · 16/10/2026

Es una **copia nueva** de la versión de pruebas, con **datos propios** (`d023:`), para probar en el iPhone dentro del
juego toda la personalización aprobada de la muñeca nueva:

- **piel:** claro (original), dorado, moreno y profundo (D-023);
- **pelo:** castaño (original), castaño chocolate, rubio miel, castaño oscuro y pelirrojo jengibre, con sus **cejas a
  juego** (D-022);
- **ojos:** marrones, azules, verdes y lilas (D-020);
- **pintacaras** «Estrellas y brillo», que se pone y se quita (D-021);
- y el conjunto de D-016/D-019: vestido (o camiseta), zapatos y corona.

**No es el juego de Amaia.** No se publica y **no cambia ningún archivo del juego** (ni `main`). Las pruebas congeladas
(`../prueba-juego-d016/`, D-019, y `../prueba-juego-d021/`) **no se tocan**: esta copia es aparte, con otro prefijo de
datos.

**Abrir en Safari (iPhone/iPad):**
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d023/index.html>

## Qué es

| Archivo | Qué hace |
| --- | --- |
| `preparar_prueba.py` | Genera la copia desde los archivos del juego y las piezas aprobadas (desde la raíz: `python3 docs/propuestas/prueba-juego-d023/preparar_prueba.py`). |
| `index.html` | Copia generada de `index.html` del juego. |
| `aislamiento.js` | **Datos propios** (`d023:` y `d023-`). Se carga antes que nada. |
| `manifest.json` | App propia «PRUEBA D-023» si se añade a la pantalla de inicio. |
| `avatar/motor.js` | Copia del motor que prefiere la muñeca `d023` y usa la sombra del catálogo. |
| `avatar/catalogo-d023.js` | Juego de piezas `d023`. |
| `avatar/arte/piezas.js`, `avatar/arte/d023/*.webp` | Índice y 79 piezas aprobadas a 948 × 1659 (WebP sin pérdida, con huella; 8,1 MB). |
| `prueba-aislada.js` | Prueba automática (18 comprobaciones). |

Los cambios de la copia respecto a `index.html` son los mismos que en D-016 y D-021: `aislamiento.js` antes que nada,
siempre en modo de pruebas (cinta «🧪 PRUEBA D-023 · piel, pelo, cejas, ojos y pintacaras · datos propios»), rutas a los
archivos del juego con `../../../` y **ningún service worker** (necesita conexión).

## Datos propios (aislamiento)

- **localStorage:** la copia ve y guarda sus claves como `d023:<clave>`. No lee, cambia ni migra las claves del juego ni
  las de las pruebas D-016 (`d016:`) y D-021 (`d021:`).
- **IndexedDB:** `misjuegos` pasa a ser `d023-misjuegos` (y `misjuegos-copias`, `d023-misjuegos-copias`).
- Si el navegador no dejara activar el aislamiento, la copia no se abre y lo dice.
- Empieza vacía; se puede llenar con **⚙️ → 🎲 Cargar datos ficticios**. Las copias de seguridad hechas aquí llevan la
  marca de pruebas y el juego de verdad las rechaza.

## La muñeca en la copia

Orden de capas (el del visor): pelo detrás · base · cejas a juego · ojos (abiertos / cerrados) · pintacaras · zapatos ·
bordes de los zapatos · vestido · bordes del vestido · manos · pelo delante · bordes del pelo · corona.

| Pestaña de «Vestir» | Opciones |
| --- | --- |
| 🖐️ **Piel** | Claro (por defecto), Dorado, Moreno, Profundo |
| 👀 **Ojos** | Marrones (por defecto), Azules, Verdes, Lilas |
| 💇‍♀️ **Pelo** | Muestras de color: Castaño (por defecto), Castaño chocolate, Rubio miel, Castaño oscuro, Pelirrojo jengibre |
| 👗 **Ropa** | Vestido rosa o Camiseta (la de la base) |
| 👑 **Adornos** | Corona y Estrellas y brillo: cada uno se pone o se quita tocándolo (marcado = puesto) |

- Cada piel trae sus propias piezas: base, ojos (de los cuatro colores), párpados cerrados, manos, cejas a juego y las
  capas de bordes (la piel clara no lleva bordes).
- **Cejas a juego** con el color de pelo, siempre (como en el visor por defecto); con el castaño, las de la base.
- **Lo elegido se conserva al guardar y volver a abrir:** «💾 Guardar» guarda el personaje (`d023:avatar`), que es el de
  «Mi Mundo»; los cambios sin guardar también se conservan en «Vestir» (`d023:avatar_draft`) y se avisa con «Cambios
  sin guardar».
- La muñeca anterior sigue disponible en la copia con `?arte=borrador`, `?arte=prueba` y `?arte=svg`.

## Probado (Chromium con pantalla de iPhone simulada)

`prueba-aislada.js`: **18/18**.

- Abre con la muñeca `d023`, sin service worker y sin ver las claves del juego ni las de D-016 / D-021.
- «Vestir» abre con el conjunto aprobado; salen las pestañas Piel, Ojos, Pelo, Ropa y Adornos.
- Tocando las pestañas de verdad: Profundo + Pelirrojo jengibre + Lilas + Estrellas y brillo.
- **56 combinaciones:** 4 pieles × 5 colores de pelo × pintacaras (sí / no), con los 4 colores de ojos repartidos, y
  4 pieles × 4 colores de ojos. Cada una dibuja solo sus capas (cejas a juego y bordes de su piel incluidos). También la
  camiseta (sin vestido, manos ni bordes del vestido).
- **Parpadeo** con cada piel: se ocultan los ojos abiertos, se ven los cerrados de esa piel y el pintacaras sigue.
- **Guardar y volver a abrir:** se recupera lo guardado (profundo · jengibre · lilas · vestido · corona + pintacaras) y
  también los cambios sin guardar, sin que cambie lo guardado.
- «Mi Mundo» muestra la muñeca guardada.
- Las claves y las bases IndexedDB del juego y de las pruebas congeladas siguen intactas; todo lo escrito lleva `d023:`.
- La muñeca anterior sigue disponible; sin errores.
- A tamaño real (profundo · jengibre · lilas · pintacaras · corona) coincide con el montaje de las piezas aprobadas en lo
  opaco (diferencia máxima 5, solo en 39 px de las puntas de las cejas, por redondeo de capas transparentes).
- Sin cambios: `pruebas/prueba-juego.js` 21/21, `pruebas/prueba-copia.js` 45/45 y las pruebas congeladas D-016 13/13 y
  D-021 19/19.
- **iPhone real: sin probar todavía.**

## Pendiente

- La prueba de la propietaria en su iPhone.
- La resolución real de 2000 × 3500.
- Pasar el conjunto al juego de verdad (catálogo `premium`, `arte/originales/`, `optimizar.py` y versión de `sw.js`).
