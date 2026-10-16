# Prueba aislada del juego: cuatro colores de ojos y pintacaras (D-021) · 16/10/2026

Es una **copia nueva** de la versión de pruebas, con **datos propios** (`d021:`), para probar en el iPhone dentro del
juego:

- los **cuatro colores de ojos** (D-020): marrones, azules, verdes y lilas;
- el **pintacaras «Estrellas y brillo»** (D-021), que se pone y se quita.

**No es el juego de Amaia.** No se publica y **no cambia ningún archivo del juego** (ni `main`). La prueba congelada
D-019 (`../prueba-juego-d016/`) **no se toca**: esta copia es aparte, con otro prefijo de datos.

**Abrir en Safari (iPhone/iPad):**
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d021/index.html>

## Qué es

| Archivo | Qué hace |
| --- | --- |
| `preparar_prueba.py` | Genera la copia desde los archivos del juego (desde la raíz: `python3 docs/propuestas/prueba-juego-d021/preparar_prueba.py`). Es el de D-016 con las piezas nuevas y el prefijo `d021`. |
| `index.html` | Copia generada de `index.html` del juego. |
| `aislamiento.js` | **Datos propios** (`d021:` y `d021-`). Se carga antes que nada. |
| `manifest.json` | App propia «PRUEBA D-021» si se añade a la pantalla de inicio. |
| `avatar/motor.js` | Copia del motor que prefiere la muñeca `d021` y usa la sombra del catálogo. |
| `avatar/catalogo-d021.js` | Juego de piezas `d021`: el de D-016 + 4 colores de ojos + el pintacaras. |
| `avatar/arte/piezas.js`, `avatar/arte/d021/*.webp` | Índice de piezas y capas aprobadas a 948 × 1659 (WebP sin pérdida, con huella). |
| `prueba-aislada.js` | Prueba automática (19 comprobaciones). |

Los cambios de la copia respecto a `index.html` son los mismos que en D-016: `aislamiento.js` antes que nada, siempre en
modo de pruebas (cinta «🧪 PRUEBA D-021 · ojos de colores y pintacaras · datos propios»), rutas a los archivos del juego
con `../../../` y **ningún service worker** (necesita conexión).

## Datos propios (aislamiento)

- **localStorage:** la copia ve y guarda sus claves como `d021:<clave>` (`d021:avatar`, `d021:avatar_draft`…).
  No lee, cambia ni migra las claves del juego **ni las de la prueba D-016** (`d016:`).
- **IndexedDB:** `misjuegos` pasa a ser `d021-misjuegos` (y `misjuegos-copias`, `d021-misjuegos-copias`).
- Si el navegador no dejara activar el aislamiento, la copia no se abre y lo dice.
- Empieza vacía; se puede llenar con **⚙️ → 🎲 Cargar datos ficticios**.
- Las copias de seguridad hechas aquí llevan la marca de pruebas y el juego de verdad las rechaza.

## La muñeca en la copia

Orden de capas (el del visor): pelo detrás · base sin ojos · ojos (abiertos del color elegido / cerrados V2.1) ·
**pintacaras** · zapatos · vestido · manos · pelo delante · corona.

| Pieza | Opciones |
| --- | --- |
| Ojos (pestaña 👀 **Ojos**) | **Marrones** (por defecto), **Azules**, **Verdes** y **Lilas**; al parpadear, los cerrados V2.1 con cualquier color |
| Adornos (pestaña 👑 **Adornos**) | **Corona** y **Estrellas y brillo**: cada uno se pone o se quita tocándolo (marcado = puesto). Al empezar, sin pintacaras |
| Ropa | Vestido rosa o Camiseta (la de la base) |
| Piel, pelo y zapatos | Los de D-016 (una sola opción) |

- El pintacaras va encima de los ojos y **no cambia** al parpadear ni con el color de ojos.
- **Lo elegido se conserva al cerrar y abrir:** «💾 Guardar» guarda el personaje (`d021:avatar`), que es el que sale en
  «Mi Mundo»; los cambios sin guardar también se conservan en «Vestir» (`d021:avatar_draft`) y se avisa con «Cambios sin
  guardar».
- La muñeca anterior sigue disponible en la copia con `?arte=borrador`, `?arte=prueba` y `?arte=svg`.

## Probado (Chromium con pantalla de iPhone simulada)

`prueba-aislada.js`: **19/19**.

- Abre con la muñeca `d021`, sin service worker y sin ver las claves del juego ni las de D-016.
- «Vestir» abre con el conjunto aprobado (marrones, sin pintacaras); salen las pestañas Ojos, Ropa y Adornos.
- Pestaña Ojos con los cuatro colores; al tocar uno cambian los ojos. En Adornos, «Estrellas y brillo» se pone y se quita.
- **Combinaciones:** 4 colores × pintacaras (sí / no) × corona (sí / no) = 16, con el vestido; y camiseta + azules +
  pintacaras. Cada una dibuja solo sus capas.
- **Parpadeo** con cada color, con y sin pintacaras: los ojos abiertos se ocultan, se ven los cerrados y el pintacaras
  sigue igual.
- **Al cerrar y abrir:** se recupera lo guardado (lilas + corona + pintacaras) y también los cambios sin guardar
  (verdes, sin pintacaras), sin que cambie lo guardado.
- «Mi Mundo» muestra la muñeca guardada (lilas + pintacaras).
- Las claves y las bases IndexedDB del juego y de D-016 siguen intactas; todo lo escrito por la copia lleva `d021:`.
- La muñeca anterior sigue disponible; sin errores.
- A tamaño real (lilas + corona + pintacaras) coincide con el montaje aprobado + ojos lilas + pintacaras en todo lo
  opaco (diferencia máxima 3, la misma que D-016).
- Sin cambios: `pruebas/prueba-juego.js` 21/21, `pruebas/prueba-copia.js` 45/45 y la prueba congelada D-016 13/13.
- **iPhone real: sin probar todavía.**

## Pendiente

- La prueba de la propietaria en su iPhone.
- La resolución real de 2000 × 3500.
- Pasar el conjunto al juego de verdad (catálogo `premium`, `arte/originales/`, `optimizar.py` y versión de `sw.js`).
