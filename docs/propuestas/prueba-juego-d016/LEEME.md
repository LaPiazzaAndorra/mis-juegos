# Prueba aislada del juego con la muñeca nueva (D-016 + D-017 + D-018) · 15/10/2026

> **D-019 · aprobada por la propietaria en su iPhone** («el resultado me parece perfecto»). **Referencia estable:** commit
> `22d96e9`, con este enlace fijo: <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/22d96e912412942abdb4733cff314250fd901f4a/docs/propuestas/prueba-juego-d016/index.html>.
>
> - No se dan por comprobados pasos concretos que no confirmó (véase D-019).
> - Esta carpeta no se modifica más; cualquier cambio irá en otra copia.
> - La resolución 2000 × 3500 sigue pendiente; no pasa todavía al juego principal.

Es una **copia de la versión de pruebas**, con datos propios, para probar en el iPhone el conjunto aprobado dentro del
juego. **No es el juego de Amaia**, no se publica y **no cambia ningún archivo del juego** (ni `main`).

**Abrir en Safari (iPhone/iPad):**
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d016/index.html>

## Qué es

| Archivo | Qué hace |
| --- | --- |
| `preparar_prueba.py` | Genera la copia desde los archivos del juego (desde la raíz: `python3 docs/propuestas/prueba-juego-d016/preparar_prueba.py`). Cada cambio se comprueba al generarla. |
| `index.html` | Copia generada de `index.html` del juego. |
| `aislamiento.js` | **Datos propios.** Se carga antes que nada. |
| `manifest.json` | App propia «PRUEBA D-016» si se añade a la pantalla de inicio. |
| `avatar/motor.js` | Copia del motor que prefiere la muñeca `d016` y usa la sombra del catálogo. |
| `avatar/catalogo-d016.js` | Juego de piezas `d016`, con los mismos identificadores que `premium`. |
| `avatar/arte/piezas.js`, `avatar/arte/d016/*.webp` | Índice de piezas y capas aprobadas a 948 × 1659 (WebP sin pérdida, con huella). |
| `prueba-aislada.js` | Prueba automática (13 comprobaciones). |

Los demás archivos (`progreso.js`, `avatar/catalogo.js`, `avatar/catalogo-muneca.js`, `avatar/avatar.css`,
`plantilla/plantilla.js`, iconos y piezas antiguas) se cargan **tal cual** del juego (`../../../`).

### Cambios de la copia respecto a `index.html`

1. `aislamiento.js` antes que nada.
2. Siempre en modo de pruebas: cinta «🧪 PRUEBA D-016 · muñeca nueva · datos propios», nombre «PRUEBA D-016» e icono
   verde de pruebas.
3. Rutas a los archivos del juego con `../../../`.
4. **No registra ningún service worker.** Necesita conexión.

## Datos propios (aislamiento)

- **localStorage:** la copia ve y guarda sus claves como `d016:<clave>` (`d016:stars`, `d016:avatar`…).
  - Las claves del juego (`stars`, `gal`, `avatar`, `doll`, `sc_*`, `lv_*`…) **no se leen, no se cambian y no se
    migran**.
  - La copia empieza vacía y se puede llenar con **⚙️ → 🎲 Cargar datos ficticios**.
- **IndexedDB:** `misjuegos` pasa a ser `d016-misjuegos`, y `misjuegos-copias` pasa a ser `d016-misjuegos-copias`.
- **Si el navegador no dejara activar el aislamiento,** la copia no se abre y lo dice.
- **El guardado del juego no cambia:** el aislamiento solo existe dentro de la copia.
- Además, `raw.githack.com` es otro origen que la app de Amaia y, en iOS, cada app de la pantalla de inicio tiene su
  propio almacenamiento.
- **Copias de seguridad:** las que se hagan aquí llevan la marca de pruebas y el juego de verdad las rechaza.

## La muñeca en el juego

- Juego de piezas `d016`, con el mismo orden de capas y encaje que el visor:
  pelo detrás · base sin ojos · ojos (abiertos v3 / cerrados V2.1) · zapatos · vestido · manos · pelo delante · corona.
- A tamaño real coincide con el montaje aprobado (`corona-2026-10-15/montaje/montaje-corona.png`) en todo lo opaco
  (diferencia máxima 3).
- **Parpadeo:** el del juego (cambio instantáneo de capa, 200 ms).

### Combinaciones compatibles

| Pieza | Opciones en la copia |
| --- | --- |
| Piel | Clara (base D-014) |
| Ojos | Marrones (v3; cerrados V2.1 al parpadear) |
| Pelo | Rizos largos castaños («mechones completos» + pelo B detrás) |
| Ropa | **Vestido rosa** (con las manos delante) o **Camiseta** (la de la base) |
| Zapatos | Zapatos de princesa (el juego no tiene opción «descalza» cuando hay zapatos) |
| Adornos | Corona: sí / no |

Comprobadas las cuatro combinaciones ropa × corona: cada una dibuja solo sus capas. En «Vestir» solo salen las
pestañas con más de una opción, **Ropa** y **Adornos**.

**A revisar en el iPhone:** con la **camiseta**, el pelo de delante «mechones completos» (pensado para el vestido)
tapa más el hombro.

### Piezas antiguas que aún no encajan con la base nueva

Todas están en el lienzo de 2000 × 3500 con las proporciones de la muñeca anterior. Escalada al mismo alto, la silueta
de `base-clara` (V2.1) coincide solo en un 68 % con la base D-014, y la de `prueba-base-clara`, en un 57 %:

| Pieza antigua | Encaja en la base nueva | Motivo |
| --- | --- | --- |
| `base-clara` (premium V2.1) | No | Otra base (proporciones anteriores a D-013). |
| `ojos-marron`, `ojos-azul`, `ojos-cerrados-clara` (V2.1) | No | Dibujados para la cara V2.1. Los cerrados V2.1 sí se usan, recolocados sobre D-014 (variante V2.1). |
| `prueba-base-clara`, `prueba-base-morena` | No | Muñeca técnica anterior. |
| `prueba-pelo-melena-*-castano` | No | Melena para la muñeca técnica. |
| `prueba-ropa-vestido-flores` | No | Vestido para la muñeca técnica. |
| `demo-diario` | No | Demostración de una sola pieza. |

**No existen todavía para la base nueva:** piel morena, ojos azules, otros colores de pelo, otros peinados y otra ropa.

### La muñeca anterior sigue disponible

- **En el juego:** sin cambios.
- **En la copia,** con los parámetros de siempre:
  - `?arte=borrador`: premium V2.1;
  - `?arte=prueba`: muñeca técnica;
  - `?arte=svg`: muñeca vectorial.

## Probado (Chromium con pantalla de iPhone simulada)

- `prueba-aislada.js`: **13/13**. Comprueba:
  - la muñeca d016 y que la copia no ve las claves del juego;
  - sin service worker;
  - «Vestir» con el conjunto, parpadeo y combinaciones;
  - guardar y recuperar dentro de la copia;
  - «Mi Mundo»;
  - las claves y la base IndexedDB del juego intactas, y todo lo escrito por la copia con prefijo;
  - la muñeca anterior disponible;
  - sin errores.
- Pruebas del juego sin cambios: `pruebas/prueba-juego.js` **21/21** y `pruebas/prueba-copia.js` **45/45**.
- **iPhone:** la propietaria la probó y la aprobó (D-019), sin detallar pasos. **Sin confirmar:** pasos concretos en
  Safari, el aislamiento en Safari y el iPad.
  - El aislamiento usa una técnica estándar (sustituir `localStorage` e `indexedDB` en la página).
  - Si Safari no lo permitiera, la copia no se abriría y lo diría.

## Pendiente

- La resolución real de 2000 × 3500.
- Pasar el conjunto al juego de verdad: catálogo `premium`, `arte/originales/`, `optimizar.py` y versión de `sw.js`.
- Variantes para la base nueva (piel, ojos, pelo, ropa).
- Comprobar, si se quiere, pasos concretos en el iPhone (D-019 no los detalla).
