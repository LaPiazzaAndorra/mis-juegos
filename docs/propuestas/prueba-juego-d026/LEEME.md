# Prueba aislada del juego: tres peinados y accesorios aprobados (D-026) · 18/10/2026

Es una **copia nueva** de la versión de pruebas, con **datos propios** (`d026:`), para probar en el iPhone, dentro del
juego, los peinados y los accesorios aprobados de la muñeca nueva, además de lo de la prueba D-023:

- **peinados** (pestaña Pelo): **melena suelta** (por defecto), coleta con cinta y sin cinta (D-025), y dos coletas con
  sombrero y sin sombrero (D-026); todos en los 5 colores de pelo y los 4 tonos de piel;
- **adornos**: corona, lazo de satén, pasador de flores, mariposa lila, diadema de estrellas, gorrito de dormir (el B, el
  elegido), gorra rosa (D-024) y pintacaras «Estrellas y brillo» (D-021);
- y lo de D-023: piel, colores de pelo con cejas a juego, colores de ojos, vestido (o camiseta) y zapatos.

**No es el juego de Amaia.** No se publica y **no cambia ningún archivo del juego** (ni `main`). Las pruebas congeladas
(`../prueba-juego-d016/`, `../prueba-juego-d021/` y `../prueba-juego-d023/`) **no se tocan**.

**Abrir en Safari (iPhone/iPad):**
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d026/index.html>

## Qué es

| Archivo | Qué hace |
| --- | --- |
| `preparar_prueba.py` | Genera la copia desde los archivos del juego y las piezas aprobadas (desde la raíz: `python3 docs/propuestas/prueba-juego-d026/preparar_prueba.py`). |
| `index.html` | Copia generada de `index.html` del juego. |
| `aislamiento.js` | **Datos propios** (`d026:` y `d026-`). Se carga antes que nada. |
| `manifest.json` | App propia «PRUEBA D-026» si se añade a la pantalla de inicio. |
| `avatar/motor.js` | Copia del motor: prefiere la muñeca `d026`, usa la sombra del catálogo y aplica las compatibilidades de los adornos. |
| `avatar/catalogo-d026.js` | Juego de piezas `d026` (peinados, adornos y sus compatibilidades). |
| `avatar/arte/piezas.js`, `avatar/arte/d026/*.webp` | Índice y 196 piezas aprobadas a 948 × 1659 (WebP sin pérdida, con huella; 18,5 MB). |
| `prueba-aislada.js` | Prueba automática (20 comprobaciones). |

Cambios de la copia respecto a `index.html`: los mismos que en D-023 (`aislamiento.js` antes que nada, siempre en modo
de pruebas con la cinta «🧪 PRUEBA D-026 · peinados y accesorios · datos propios», rutas al juego con `../../../` y
**ningún service worker**: necesita conexión) y uno más: en «Adornos», un adorno colocado para la melena elegido con otro
peinado vuelve a la melena (como en el visor).

## Compatibilidades (las del visor)

- Los adornos de pelo (lazo, flores, mariposa, diadema, gorrito, gorra) van **de uno en uno**: al poner otro, se quita.
- La **corona** no va con la diadema, el gorrito ni la gorra (queda lo último que se ha elegido); sí con el lazo, las
  flores o la mariposa.
- La corona y los adornos de pelo están colocados para la **melena**: al elegir la coleta o las dos coletas se quitan, y
  elegirlos con otro peinado vuelve a la melena. El **pintacaras** va con todos.

## La muñeca en la copia

Orden de capas (el del visor): orejas de detrás · pelo detrás · base · cejas · ojos (abiertos / cerrados) · pintacaras ·
zapatos · bordes · vestido · bordes · manos · orejas de delante · pelo delante · bordes del pelo · cinta o coleteros ·
sombrero · adorno de pelo · corona. Cada peinado trae sus propias capas de bordes por tono (la piel clara no lleva) y,
la coleta, sus orejas de cada tono. **Lo elegido se conserva al guardar y volver a abrir** (`d026:avatar`, el de
«Mi Mundo»); los cambios sin guardar también (`d026:avatar_draft`). La muñeca anterior sigue disponible con
`?arte=borrador`, `?arte=prueba` y `?arte=svg`.

## Probado (Chromium con pantalla de iPhone simulada)

`prueba-aislada.js`: **20/20**.

- Abre con la muñeca `d026`, sin service worker y sin ver las claves del juego ni las de D-016 / D-021 / D-023.
- «Vestir» abre con la **melena** (piel clara, castaño, marrones, corona); 5 peinados y 8 adornos.
- **Tocando de verdad:** dos coletas con sombrero (se quita la corona) → lazo (vuelve a la melena) → corona (los dos) →
  gorra (quita lazo y corona) → corona (quita la gorra) → diadema (quita la corona) → diadema otra vez (se quita) →
  coleta sin cinta + pintacaras (se queda la coleta).
- **Compatibilidades:** las 64 parejas de adornos con la melena y los 40 casos adorno × peinado.
- **108 combinaciones:** 5 peinados × 4 pieles × 5 colores (con los ojos repartidos y pintacaras en la mitad) y cada adorno
  sobre la melena: cada una dibuja solo sus capas. También la camiseta.
- **Parpadeo** con cada peinado y cada piel (20 casos): se ocultan los ojos abiertos y se ven los cerrados de esa piel.
- **Guardar y volver a abrir:** se recupera lo guardado (dos coletas sin sombrero · profunda · pelirrojo · lilas ·
  pintacaras) y también los cambios sin guardar (coleta con cinta · dorada · miel), sin que cambie lo guardado.
- «Mi Mundo» muestra la muñeca guardada. Datos del juego y de las pruebas congeladas intactos; todo lo escrito lleva `d026:`.
- A tamaño real (dos coletas sin sombrero · profunda · pelirrojo · lilas · pintacaras) coincide con el montaje de las
  piezas aprobadas en lo opaco (diferencia máxima 4, en 8 px, por redondeo de capas transparentes).
- Sin cambios: `pruebas/prueba-juego.js` 21/21, `pruebas/prueba-copia.js` 45/45 y las pruebas congeladas D-016 13/13,
  D-021 19/19 y D-023 18/18.
- **iPhone real: sin probar todavía.**

## Pendiente

- La prueba de la propietaria en su iPhone.
- La resolución real de 2000 × 3500.
- Pasar el conjunto al juego de verdad (catálogo `premium`, `arte/originales/`, `optimizar.py` y versión de `sw.js`).
