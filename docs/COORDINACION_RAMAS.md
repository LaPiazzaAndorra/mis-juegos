# Coordinación entre ramas: `avatar-creador` (Mi Mundo), `juegos-pensar` (Contar, Memoria…) y `pintar-heladeria`

Actualizado el 04/11/2026. Lo publicado es `main` (`031ce07`, D-032): la prueba completa generada con
`herramientas/publicar/preparar_publicacion.py` (rama `avatar-creador`). Las mejoras de Contar y Memoria se hacen en la
rama **`juegos-pensar`** (creada desde `avatar-creador` `6a91012`; copia `docs/propuestas/pensar-2026-11-04/`, datos
`pen1:`, último commit `f9a2f40`); `pintar-heladeria` sigue en `ee5677b` sin cambios nuevos.

**Las dos copias siguen el mismo patrón y no se pisan:** parten de la prueba completa (importan su `preparar_copia.py`),
no cambian ningún archivo del juego ni de otras carpetas y cargan sus archivos propios al final de la página, después de
`logros.js` (Pensar: `pensar.css`, `dibujos.js`, `pensar.js`; Mi Mundo: `mimundo/…`). Pensar no cambia `progreso.js`
(sus claves empiezan por `lv_`); Mi Mundo añade el prefijo `mm_`. Ninguna toca `logros.js`.

**05/11/2026 (D-035):** publicada en `main` la versión con Contar y Memoria (1.ª entrega, `f9a2f40`) y la habitación de
Mi Mundo, desde la rama **`publicacion-2026-11-05`** (`avatar-creador` `b6f2515` + `f9a2f40` + opción `--con-pensar` del
generador, versión visible en Ajustes y `prueba-actualizacion.js`). Esa rama hay que unirla a `avatar-creador` (y
`juegos-pensar` puede unirla o seguir aparte): solo pueden chocar los `docs/*.md`.

## Archivos compartidos y quién los toca

| Archivo | Mi Mundo (D-033/D-034, `avatar-creador`) | Contar y Memoria (`juegos-pensar`) |
| --- | --- | --- |
| `index.html` del juego (secciones PENSAR/«Contar», PAREJAS/«Memoria», MI MUNDO) | **No lo modifica.** Mi Mundo va en archivos propios (`mimundo/`) que se cargan con 4 líneas añadidas antes de `offline-lista.js`. | Sus secciones. |
| `logros.js` | **No lo toca.** Las misiones dan ⭐ y se anotan en `mm_misiones`. Si se quiere que den logros, se añadirá una función pública en `logros.js` (por ejemplo `Logros.sumar(id)`), coordinada. | Puede cambiar retos (Contar, Colores). |
| `progreso.js` («Guardar / Recuperar mi progreso») | Añade el prefijo `mm_` a `PREFIJOS` (una línea). | Si añade claves, que las ponga en `CLAVES` o con prefijo; no hace falta tocar la línea de `PREFIJOS`. |
| `herramientas/publicar/` (sw, listas sin conexión) | Opción `--con-mimundo` (las listas salen de las carpetas, no a mano). | Si Contar o Memoria añaden archivos (imágenes, sonidos), se añaden a `COPIAR` o a una carpeta que el generador recorra. |
| Claves de datos | `mm_habitacion2`, `mm_misiones` (no toca `mm_hab`, `sc_*`, `lv_*`). | `lv_*` (niveles), las suyas. |

## Cómo se juntan

1. Cada rama genera su copia como hasta ahora; ninguna modifica los archivos de la otra.
2. Al preparar una publicación, se parte de la versión aprobada y se añaden los archivos de cada parte al final de la
   página (primero Pensar, después Mi Mundo, `--con-mimundo`), y sus archivos a las listas sin conexión. Se recomienda
   que Pensar añada una opción igual (`--con-pensar`) al generador, que recorra su carpeta como hace Mi Mundo.
3. Antes de unir las ramas, solo `docs/*.md` (registro, estado, decisiones…) pueden chocar: se juntan a mano, sin borrar
   entradas de ninguna.
4. Antes de publicar: las pruebas de cada parte (Pintar 188, Heladería 47, logros 37, Pensar 52, Mi Mundo 22 + 7 sin
   conexión, la de publicación 17) y el modo avión en el iPhone.

## Reglas comunes

- No se publica en `main` sin la aprobación expresa de la propietaria.
- No se borran ni se reinician datos; las claves nuevas entran en «Guardar / Recuperar mi progreso».
- Todo archivo que el juego carga debe estar en las listas sin conexión (`offline-lista.js`): la prueba de publicación
  comprueba que no falla ninguna petición en modo avión.
