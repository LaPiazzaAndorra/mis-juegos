# Coordinación entre ramas: `avatar-creador` (Mi Mundo), `juegos-pensar` (Contar, Memoria…) y `pintar-heladeria`

**05/11/2026 (D-035):** publicado en `main` (`021c67e`, versión `5889ab82ca5d`, por otra sesión desde la rama
`publicacion-2026-11-05`) Contar y Memoria tal como se aprobaron (`juegos-pensar` hasta `f9a2f40`, unido a
`avatar-creador` sin la 2.ª entrega) con `--con-pensar`, y la habitación de Mi Mundo con `--con-mimundo`. La 2.ª entrega de
Pensar (`cf80691`, `3a0b508`) sigue solo en `juegos-pensar`: para publicarla, `--con-pensar` usará su carpeta tal como
esté y la lista `PENSAR` del generador (hoy, los tres archivos de la 1.ª entrega) tendrá que incluir `figuras.js` y
`pensar2.js`.
**07/11/2026 (D-036): publica solo la sesión del avatar y Mi Mundo (`avatar-creador`)**, con la aprobación expresa de la
propietaria; la de `juegos-pensar` prepara los juegos y no publica. Lo que ya está en `main` no se vuelve a publicar.
**Generador único** en `avatar-creador` (`herramientas/publicar/`): el de `publicacion-2026-11-05` (`f1bd6e1`, versión en
Ajustes) con la prueba ampliada; reproduce `main` `021c67e` byte a byte. La rama `publicacion-2026-11-05` queda como
referencia; no se usa para publicar.
**Mi Mundo:** lo publicado es `prueba-mimundo-2026-11-04/mimundo/` (solo la habitación, idéntica a `main`); el salón
(D-034, pendiente de aprobación) está en `prueba-salon-2026-11-07/mimundo/` (habitación + salón; datos `mm_salon`, también
con el prefijo `mm_`). Cuando se apruebe, se publicará con `--con-mimundo docs/propuestas/prueba-salon-2026-11-07/mimundo`.
**Para la 2.ª entrega de Pensar:** `--con-pensar` lleva los archivos de `ARCHIVOS_PENSAR` (`pensar.css`, `dibujos.js`,
`pensar.js`, `figuras.js`, `pensar2.js`) que haya en la carpeta indicada: la de `avatar-creador` tiene solo la 1.ª entrega;
la 2.ª entra cuando se una su carpeta aprobada.

Actualizado el 04/11/2026. Lo publicado es `main` (`031ce07`, D-032): la prueba completa generada con
`herramientas/publicar/preparar_publicacion.py` (rama `avatar-creador`). Las mejoras de Contar y Memoria se hacen en la
rama **`juegos-pensar`** (creada desde `avatar-creador` `6a91012`; copia `docs/propuestas/pensar-2026-11-04/`, datos
`pen1:`, último commit `f9a2f40`); `pintar-heladeria` sigue en `ee5677b` sin cambios nuevos.

**Las dos copias siguen el mismo patrón y no se pisan:** parten de la prueba completa (importan su `preparar_copia.py`),
no cambian ningún archivo del juego ni de otras carpetas y cargan sus archivos propios al final de la página, después de
`logros.js` (Pensar: `pensar.css`, `dibujos.js`, `pensar.js`; Mi Mundo: `mimundo/…`). Pensar no cambia `progreso.js`
(sus claves empiezan por `lv_`); Mi Mundo añade el prefijo `mm_`. Ninguna toca `logros.js`.

## Norma de lectura (D-038, 15/11/2026): igual en las dos ramas

- La norma está en `docs/NORMA_TEXTOS_INFANTILES.md` y también en `CLAUDE.md`.
- La capa común es `docs/propuestas/lectura-2026-11-17/` (`lectura.css` y `lectura.js`). La mantiene `avatar-creador`;
  `juegos-pensar` la copia **sin cambios** en su copia aislada y la carga justo después de `logros.js`, antes de
  `pensar.css`. Si hace falta cambiarla, se acuerda y se cambia en las dos.
- **Cada rama adapta sus frases en su código:** Mi Mundo en `avatar-creador` (hecho en la copia de cuidar), Contar,
  Memoria y los demás juegos de Pensar en `juegos-pensar`. Sin cambiar datos (`lv_*`) ni respuestas.
- Para dejar algo fuera (adultos o técnico), se le pone la clase `adulto`.
- Antes de integrar: `node docs/propuestas/lectura-2026-11-17/prueba-lectura.js URL` en la copia de cada rama.
- **16/11 · estado:** `juegos-pensar` (último commit `bd07038`, 15/11) tiene su **propia** versión en
  `pensar-2026-11-04/lectura.css` y `lectura.js` (pasos breves, altavoz en los mensajes), distinta de la capa común. La
  propietaria ha autorizado a esa sesión a integrar la capa común. Propuesta, para no pisarse:
  - cargar la capa común sin cambios;
  - renombrar lo propio de Pensar (por ejemplo `pensar-lectura.*`), cargado después de la capa común.
- **16/11 · corrección de la capa común** (`lectura.js`: bucle de ajuste de títulos), comunicada a `juegos-pensar` para
  que copie la versión nueva.
- En la publicación: `--con-lectura docs/propuestas/lectura-2026-11-17` (antes de `--con-pensar` y `--con-mimundo`).

## Publicado (16/11/2026, D-039)

- `main` = `bd8dcbb`, versión `08d0743115d0`: la prueba conjunta aprobada, integrada en `avatar-creador` (`00a1f7a`).
  Incluye la capa común de lectura, `juegos-pensar` `bcb9f4d` y Mi Mundo de la copia de cuidar.
- **A partir de aquí:** lo nuevo de `juegos-pensar` se une a `avatar-creador` cuando la propietaria lo apruebe, y se
  publica desde aquí (D-036).
- La rama `prueba-conjunta-2026-11-16` queda como referencia.
- **16/11, D-040 (preparado, sin publicar):** versión `386dd1333d57`: los mismos archivos de Pensar (`bcb9f4d`) y de Mi Mundo; solo
  cambia la publicación (cada archivo se comprueba con su huella). Al Chat 2 se le ha pedido confirmar que `bcb9f4d` es su
  última entrega y los archivos exactos.

## Prueba conjunta (16/11/2026, sin publicar)

- `juegos-pensar` (`1821923`/`bcb9f4d`) ya carga la capa común de `4dd3a80` sin cambios (después de `logros.js`). Sus
  ajustes propios son `pensar-2026-11-04/lectura-pensar.css` y `lectura-pensar.js`, cargados después de sus juegos (nota en
  `pensar-2026-11-04/SALON_Y_LECTURA.md`).
- **Rama aparte `prueba-conjunta-2026-11-16`:** `avatar-creador` (`4dd3a80`) + `juegos-pensar` (`bcb9f4d`), unidas sin
  conflictos. Tiene una sola copia de la capa común (la misma ruta en las dos ramas) y los ajustes de Pensar por separado.
  Copia `docs/propuestas/prueba-conjunta-2026-11-16/`. Ni `avatar-creador` ni `juegos-pensar` cambian.
- **Cambios solo en esa rama:**
  - el generador incluye en `--con-pensar` los 12 archivos de los juegos de Pensar y `lectura-pensar.*` al final;
  - la prueba común `prueba-lectura.js` recorre las pantallas por los botones de los menús (antes abría a la fuerza
    pantallas internas y daba errores falsos). Comunicado a `juegos-pensar`.
- **En esa rama, el generador ya no reproduce `main`** con los argumentos de D-036: la carpeta de Pensar es la nueva. Para
  reproducir `main`, usar `avatar-creador`.
- **Integración definitiva y publicación:** solo con la autorización de la propietaria, después de su prueba.

## Archivos compartidos y quién los toca

| Archivo | Mi Mundo (D-033/D-034, `avatar-creador`) | Contar y Memoria (`juegos-pensar`) |
| --- | --- | --- |
| `index.html` del juego (secciones PENSAR/«Contar», PAREJAS/«Memoria», MI MUNDO) | **No lo modifica.** Mi Mundo va en archivos propios (`mimundo/`) que se cargan con 4 líneas añadidas antes de `offline-lista.js`. | Sus secciones. |
| `logros.js` | **No lo toca.** Las misiones dan ⭐ y se anotan en `mm_misiones`. Si se quiere que den logros, se añadirá una función pública en `logros.js` (por ejemplo `Logros.sumar(id)`), coordinada. | Puede cambiar retos (Contar, Colores). |
| `progreso.js` («Guardar / Recuperar mi progreso») | Añade el prefijo `mm_` a `PREFIJOS` (una línea). | Si añade claves, que las ponga en `CLAVES` o con prefijo; no hace falta tocar la línea de `PREFIJOS`. |
| `herramientas/publicar/` (sw, listas sin conexión) | Opción `--con-mimundo` (las listas salen de las carpetas, no a mano). | Si Contar o Memoria añaden archivos (imágenes, sonidos), se añaden a `COPIAR` o a una carpeta que el generador recorra. |
| Claves de datos | `mm_habitacion2`, `mm_misiones`; en las copias, `mm_salon`, `mm_necesidades` y `mm_ciclo` (D-037). No toca `mm_hab`, `sc_*`, `lv_*`. | `lv_*` (niveles), las suyas. |

## Cómo se juntan

1. Cada rama genera su copia como hasta ahora; ninguna modifica los archivos de la otra.
2. Al preparar una publicación, se parte de la versión aprobada y se añaden los archivos de cada parte al final de la
   página (primero Pensar, después Mi Mundo, `--con-mimundo`), y sus archivos a las listas sin conexión. Se recomienda
   que Pensar añada una opción igual (`--con-pensar`) al generador, que recorra su carpeta como hace Mi Mundo.
3. Antes de unir las ramas, solo `docs/*.md` (registro, estado, decisiones…) pueden chocar: se juntan a mano, sin borrar
   entradas de ninguna.
4. Antes de publicar: las pruebas de cada parte (Pintar 188, Heladería 47, logros 37, Pensar 52, Mi Mundo 22 + 7 sin
   conexión, el salón 31 + 8 sin conexión, la de publicación 23 y la de actualización) y el modo avión en el iPhone.

## Reglas comunes

- No se publica en `main` sin la aprobación expresa de la propietaria.
- No se borran ni se reinician datos; las claves nuevas entran en «Guardar / Recuperar mi progreso».
- Todo archivo que el juego carga debe estar en las listas sin conexión (`offline-lista.js`): la prueba de publicación
  comprueba que no falla ninguna petición en modo avión.
