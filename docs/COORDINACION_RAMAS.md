# Coordinación entre ramas: `avatar-creador` (Mi Mundo) y `pintar-heladeria` (Contar, Memoria…)

Actualizado el 04/11/2026. Lo publicado es `main` (`031ce07`, D-032): la prueba completa generada con
`herramientas/publicar/preparar_publicacion.py` (rama `avatar-creador`). En GitHub, `pintar-heladeria` sigue en `ee5677b`:
las mejoras de Contar y Memoria aún no están subidas.

## Archivos compartidos y quién los toca

| Archivo | Mi Mundo (D-033, `avatar-creador`) | Contar y Memoria (`pintar-heladeria`) |
| --- | --- | --- |
| `index.html` del juego (secciones PENSAR/«Contar», PAREJAS/«Memoria», MI MUNDO) | **No lo modifica.** Mi Mundo va en archivos propios (`mimundo/`) que se cargan con 4 líneas añadidas antes de `offline-lista.js`. | Sus secciones. |
| `logros.js` | **No lo toca.** Las misiones dan ⭐ y se anotan en `mm_misiones`. Si se quiere que den logros, se añadirá una función pública en `logros.js` (por ejemplo `Logros.sumar(id)`), coordinada. | Puede cambiar retos (Contar, Colores). |
| `progreso.js` («Guardar / Recuperar mi progreso») | Añade el prefijo `mm_` a `PREFIJOS` (una línea). | Si añade claves, que las ponga en `CLAVES` o con prefijo; no hace falta tocar la línea de `PREFIJOS`. |
| `herramientas/publicar/` (sw, listas sin conexión) | Opción `--con-mimundo` (las listas salen de las carpetas, no a mano). | Si Contar o Memoria añaden archivos (imágenes, sonidos), se añaden a `COPIAR` o a una carpeta que el generador recorra. |
| Claves de datos | `mm_habitacion2`, `mm_misiones` (no toca `mm_hab`, `sc_*`, `lv_*`). | `lv_*` (niveles), las suyas. |

## Cómo se juntan

1. `pintar-heladeria` genera sus cambios como hasta ahora (generadores que reaplican sustituciones sobre `index.html`).
2. Al preparar una publicación, se parte de la versión aprobada y se aplican, en este orden: Contar y Memoria (sus pasos),
   y después Mi Mundo (`--con-mimundo`). Las 4 líneas de Mi Mundo y la línea de `PREFIJOS` no chocan con sus secciones.
3. Antes de publicar: las pruebas de cada parte (Pintar 188, Heladería 47, logros 37, Mi Mundo 20 + 5 sin conexión, la
   de publicación 17) y el modo avión en el iPhone.

## Reglas comunes

- No se publica en `main` sin la aprobación expresa de la propietaria.
- No se borran ni se reinician datos; las claves nuevas entran en «Guardar / Recuperar mi progreso».
- Todo archivo que el juego carga debe estar en las listas sin conexión (`offline-lista.js`): la prueba de publicación
  comprueba que no falla ninguna petición en modo avión.
