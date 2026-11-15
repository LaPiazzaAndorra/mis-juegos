# Nota para integrar Pensar (para el Chat 1, el de `avatar-creador`)

Desde el 07/11/2026, **solo el chat de `avatar-creador` reúne y publica**. Este chat desarrolla los juegos en
`juegos-pensar` y no toca `main`, el generador de publicación ni los archivos de `avatar-creador`. Esta nota dice qué hay
que llevar al juego **cuando la propietaria lo apruebe**: hasta entonces, nada.

## Una sola versión de prueba (15/11/2026): todas las entregas con la norma de lectura

Desde el 15/11 (17:25), **hay una única versión que vale**: la que reúne **todas las entregas con la norma de lectura de
Amaia**. Su commit está en la tabla de abajo («versión única»), y su enlace fijo, en `LEEME.md`. Los commits anteriores
quedan solo como historia; **no se integran por separado**.

| Entrega | Qué es | Estado (15/11) |
| --- | --- | --- |
| 1.ª · Contar y Memoria | Contar (10 niveles), Parejas, ¿Dónde estaba?, Repite la serie | **Publicada** en `main` `021c67e` (D-035). La versión única le añade la norma de lectura: **al integrarla, cambia lo publicado** (solo textos y tamaños; los datos, iguales). |
| 2.ª · ¿Qué sigue?, Sombras, El diferente, Unir puntos | | Probada el 15/11: se ve bien, pero demasiado básica; **no aprobada**. |
| 3.ª · Repasar | | Probada el 15/11: se ve bien, pero demasiado básica; **no aprobada**. |
| 4.ª · Dibujos por partes y ¿Quién es? | | Funciona, pero sigue siendo fácil; **no aprobada**. |
| 5.ª · Retos (Detective, Dos reglas, ¿Qué cambió?) | Niveles avanzados | **Pendiente de probarlos con Amaia**. |
| **Versión única** · todas + norma de lectura | | El commit de la norma en todas las entregas: lo da `git log -1 --format=%h -- docs/propuestas/pensar-2026-11-04/lectura.js`; el enlace, en `LEEME.md`. **Pendiente de la prueba en el iPhone.** No publicar. |

Cuando la propietaria apruebe, se puede integrar **todo** o **solo lo aprobado** (ver «Si solo se aprueba una parte»).

## Archivos del juego (todos de la versión única; nunca mezclar commits)

En la carpeta `docs/propuestas/pensar-2026-11-04/`, en este orden, después de `logros.js` y antes de Mi Mundo:

| # | Archivo | Para qué |
| --- | --- | --- |
| 1 | `pensar.css` | estilos de todos los juegos de Pensar |
| 2 | `dibujos.js` | los 20 dibujos SVG |
| 3 | `pensar.js` | Contar y Memoria (+ utilidades comunes `PENSAR_UTIL`) |
| 4 | `figuras.js` | figuras de Unir puntos y Repasar |
| 5 | `pensar2.js` | ¿Qué sigue?, Sombras, El diferente y Unir puntos |
| 6 | `repasar.js` | Repasar |
| 7 | `etapas.css` | estilos de Dibujos por partes y ¿Quién es? |
| 8 | `ilustraciones.js` | los tres dibujos por partes |
| 9 | `etapas.js` | Dibujos por partes (menú Pintar) |
| 10 | `quien.js` | ¿Quién es? (menú Pensar) |
| 11 | `retos.css` | estilos de los Retos |
| 12 | `retos.js` | Retos (menú Pensar) |
| 13 | `lectura.css` | **norma de lectura**: mayúsculas, letra grande, títulos en dos líneas, menús en horizontal |
| 14 | `lectura.js` | **norma de lectura**: mensajes en pasos y voz al tocar mensajes y títulos |

- **`lectura.css` y `lectura.js` van los últimos**, porque ajustan lo que dejan los demás.
- **Siempre todos del mismo commit**: los archivos usan lo que exportan los anteriores en ese commit.
- **Lo demás de la carpeta no va al juego**: `index.html`, `aislamiento.js`, `manifest.json`, `progreso.js`,
  `logros.js`, `preparar_copia.py`, `simular_publicacion.py`, las pruebas `prueba-*.js`, `capturas/`, `LEEME.md` y esta
  nota.

### Si solo se aprueba una parte

- **Solo Contar y Memoria** (lo publicado) **con la norma de lectura**: `pensar.css`, `dibujos.js`, `pensar.js`,
  `lectura.css` y `lectura.js`. La norma funciona sola: lo que no encuentra en la página, no lo toca.
- Para añadir el resto, se suma cada archivo en el orden de la tabla. `repasar.js` necesita `figuras.js` y `pensar2.js`;
  `etapas.js` y `quien.js` necesitan `pensar2.js`; `retos.js` necesita `etapas.css`.

## Cómo hacerlo con el generador de `avatar-creador`

`preparar_publicacion.py` (en `avatar-creador`) tiene `--con-pensar CARPETA` con la lista fija
`PENSAR = ['pensar.css', 'dibujos.js', 'pensar.js']`. Al aprobar:

1. Unir `juegos-pensar` hasta el commit de la versión única. Solo cambia la carpeta `docs/propuestas/pensar-2026-11-04/`.
2. Ampliar la lista del generador con los archivos aprobados, en el orden de la tabla. Con todo:
   `['pensar.css', 'dibujos.js', 'pensar.js', 'figuras.js', 'pensar2.js', 'repasar.js', 'etapas.css', 'ilustraciones.js',
   'etapas.js', 'quien.js', 'retos.css', 'retos.js', 'lectura.css', 'lectura.js']`.
   - Los `.css` van como hoja de estilos (`<link rel="stylesheet">`) y los `.js` como script.
   - Todos van en la página y en lo básico sin conexión.
   - `simular_publicacion.py` de esta carpeta enseña cómo hacerlo sin tocar el generador.
3. Generar y comprobar con sus pruebas de publicación. La versión (huella) cambia sola y la caché sin conexión se renueva.

`simular_publicacion.py` + `prueba-sin-conexion.js` de esta carpeta hacen lo mismo en una carpeta temporal, para
comprobar antes el modo avión (13/13 con todo).

## Norma de lectura de Amaia: qué toca

- **Toca todas las pantallas de Pensar** (`section.pn`, el menú Memoria y el menú Pensar) y **solo los tres botones de
  Pensar del menú Pintar** (Unir puntos, Repasar, Dibujos por partes).
- **Decisión pendiente:** el resto del menú Pintar («Pintar», «Hoja en blanco», «Colorear dibujos», «Mis dibujos») es del
  juego base y sigue en minúsculas. Si la propietaria quiere todo el menú igual, basta con añadir `#m-paint .big` y
  `#m-paint .bar .title` a la primera regla de `lectura.css`.
- **Cómo se hace:**
  - Las mayúsculas, con `text-transform` en `lectura.css`. El texto sigue en minúsculas normales por dentro, para que la
    voz del iPhone lo lea bien.
  - Los Retos ya escriben sus textos en mayúsculas.
- **No toca ningún dato, nivel ni recompensa.**

## Datos (nada que migrar)

- **Claves nuevas.** Todas llevan el prefijo `lv_`, que «Guardar / Recuperar mi progreso» ya incluye, así que no hace falta
  cambiar `progreso.js`:
  - `lv_contar2`, `lv_parejas`, `lv_donde`, `lv_serie`;
  - `lv_sigue2`, `lv_sombras2`, `lv_distinto2`, `lv_puntos`;
  - `lv_repasar`;
  - `lv_etapas` (incluye lo que está a medias) y `lv_quien`;
  - `lv_retos`.
- **Solo se leen** las antiguas `lv_contar`, `lv_sigue`, `lv_sombras` y `lv_distinto`, para no empezar por lo fácil.
- **Ninguna clave se borra ni se cambia.**
- Los dibujos de Unir puntos, Repasar y Dibujos por partes se guardan con el «Guardar» de Pintar (`gal`).
- **Pintar no cambia:** las figuras se registran como plantillas no enumerables (`TPL['pz:…']`, `TPL['rp:…']` y
  `TPL['gd:…']`), que no salen en «Colorear dibujos».
- La flecha de Pintar vuelve a Unir puntos, a Repasar o a Dibujos por partes solo cuando el dibujo viene de ahí.
- **Recompensas sin cambios:** +1 ⭐ por acierto o dibujo terminado, como siempre, y ningún logro nuevo.

## Puntos de contacto con lo de `avatar-creador`

- Las pantallas nuevas se añaden antes de `#logros`.
- Los botones nuevos van al final del menú Pintar (`#m-paint .menu`).
- Pensar cambia los botones de `#m-think` y añade «¿Quién es?» y «Retos» al final. En horizontal, el menú Pensar se
  coloca en 4 columnas para que se vean los 7 juegos.
- No tocan Mi Mundo, Vestir, la muñeca, logros ni `progreso.js`.
- Envuelven `onShow.paint` (sin cambiar lo que hace con las demás láminas).
