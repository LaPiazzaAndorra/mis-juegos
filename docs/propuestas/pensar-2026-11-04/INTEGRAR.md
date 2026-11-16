# Nota para integrar Pensar (para el Chat 1, el de `avatar-creador`)

Desde el 07/11/2026, **solo el chat de `avatar-creador` reúne y publica**. Este chat desarrolla los juegos en
`juegos-pensar` y no toca `main`, el generador de publicación ni los archivos de `avatar-creador`. Esta nota dice qué hay
que llevar al juego **cuando la propietaria lo apruebe**: hasta entonces, nada.

## Una sola versión de prueba (16/11/2026): todas las entregas con la norma D-038 y la capa común

Desde el 16/11, **hay una única versión que vale**: la que reúne **todas las entregas con la norma D-038**
(`docs/NORMA_TEXTOS_INFANTILES.md` de `avatar-creador`) y **la capa común de lectura** de `avatar-creador` **`4dd3a80`** (la que corrige el bucle de títulos de `f3005ce`), integrada
sin cambios. Su commit está en la tabla de abajo («versión única»), y su enlace fijo, en `LEEME.md`. Los commits anteriores
quedan solo como historia; **no se integran por separado**.

| Entrega | Qué es | Estado (15/11) |
| --- | --- | --- |
| 1.ª · Contar y Memoria | Contar (10 niveles), Parejas, ¿Dónde estaba?, Repite la serie | **Publicada** en `main` `021c67e` (D-035). La versión única le añade la norma de lectura: **al integrarla, cambia lo publicado** (solo textos y tamaños; los datos, iguales). |
| 2.ª · ¿Qué sigue?, Sombras, El diferente, Unir puntos | | Probada el 15/11: se ve bien, pero demasiado básica; **no aprobada**. |
| 3.ª · Repasar | | Probada el 15/11: se ve bien, pero demasiado básica; **no aprobada**. |
| 4.ª · Dibujos por partes y ¿Quién es? | | Funciona, pero sigue siendo fácil; **no aprobada**. |
| 5.ª · Retos (Detective, Dos reglas, ¿Qué cambió?) | Niveles avanzados | **Pendiente de probarlos con Amaia**. |
| **Versión única** · todas + D-038 + capa común | | **Commit `1821923`** (capa común de `4dd3a80`); el enlace, en `LEEME.md` («Versión única con la capa común»). **Pendiente de la prueba en el iPhone.** No publicar. Sustituye a `d0c9df5`. |

Cuando la propietaria apruebe, se puede integrar **todo** o **solo lo aprobado** (ver «Si solo se aprueba una parte»).

## Archivos del juego (todos de la versión única; nunca mezclar commits)

**Antes de todo, justo después de `logros.js`: la capa común** `docs/propuestas/lectura-2026-11-17/` (`lectura.css` y
`lectura.js`), igual que en vuestra rama. En la publicación, con `--con-lectura docs/propuestas/lectura-2026-11-17`. En
`juegos-pensar` es **idéntica** a la de `4dd3a80` (lo comprueban las pruebas). Si cambia en vuestra rama, se vuelve a traer igual.

Después, en la carpeta `docs/propuestas/pensar-2026-11-04/`, en este orden y antes de Mi Mundo:

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
| 13 | `lectura-pensar.css` | lo **propio de Pensar** en la norma: mensajes grandes con altavoz, tamaños que la capa común no cubre, menús de Pensar y Pintar en horizontal, ajustes del iPhone pequeño |
| 14 | `lectura-pensar.js` | lo **propio de Pensar**: mensajes en pasos y voz al tocar mensajes (como el 🗣️) y títulos |

- **La capa común va la primera** (después de `logros.js`). **`lectura-pensar.css` y `lectura-pensar.js` van los
  últimos**, porque ajustan lo que dejan los demás.
- **Siempre todos del mismo commit**: los archivos usan lo que exportan los anteriores en ese commit.
- **Lo demás de la carpeta no va al juego**: `index.html`, `aislamiento.js`, `manifest.json`, `progreso.js`,
  `logros.js`, `preparar_copia.py`, `simular_publicacion.py`, las pruebas `prueba-*.js`, `capturas/`, `LEEME.md` y esta
  nota.

### Si solo se aprueba una parte

- **Solo Contar y Memoria** (lo publicado) **con la norma**: la capa común + `pensar.css`, `dibujos.js`, `pensar.js`,
  `lectura-pensar.css` y `lectura-pensar.js`. Lo propio de Pensar funciona solo: lo que no encuentra en la página, no lo
  toca.
- Para añadir el resto, se suma cada archivo en el orden de la tabla. `repasar.js` necesita `figuras.js` y `pensar2.js`;
  `etapas.js` y `quien.js` necesitan `pensar2.js`; `retos.js` necesita `etapas.css`.

## Cómo hacerlo con el generador de `avatar-creador`

`preparar_publicacion.py` (en `avatar-creador`) tiene `--con-pensar CARPETA` con la lista fija
`PENSAR = ['pensar.css', 'dibujos.js', 'pensar.js']`. Al aprobar:

1. Unir `juegos-pensar` hasta el commit de la versión única. Solo cambia la carpeta `docs/propuestas/pensar-2026-11-04/`.
2. Ampliar la lista del generador con los archivos aprobados, en el orden de la tabla. Con todo:
   `['pensar.css', 'dibujos.js', 'pensar.js', 'figuras.js', 'pensar2.js', 'repasar.js', 'etapas.css', 'ilustraciones.js',
   'etapas.js', 'quien.js', 'retos.css', 'retos.js', 'lectura-pensar.css', 'lectura-pensar.js']`, con `--con-lectura`
   para la capa común.
   - Los `.css` van como hoja de estilos (`<link rel="stylesheet">`) y los `.js` como script.
   - Todos van en la página y en lo básico sin conexión.
   - `simular_publicacion.py` de esta carpeta enseña cómo hacerlo sin tocar el generador.
3. Generar y comprobar con sus pruebas de publicación. La versión (huella) cambia sola y la caché sin conexión se renueva.

`simular_publicacion.py` + `prueba-sin-conexion.js` de esta carpeta hacen lo mismo en una carpeta temporal, para
comprobar antes el modo avión (13/13 con todo, también la capa común).

## Norma D-038: qué toca

- **La capa común** (`lectura-2026-11-17`, sin cambios) pone:
  - las MAYÚSCULAS en todo el juego, también en los botones y en el menú Pintar, menos en la zona de adultos;
  - 16 px o más;
  - el contraste;
  - los títulos sin «…».

  Ya no queda ninguna decisión pendiente sobre el menú Pintar.
- **`lectura-pensar.*`** solo añade lo de Pensar:
  - los mensajes en pasos, con altavoz (tocarlos hace lo mismo que el 🗣️, que en los iPhone de 400 px o menos sale de la
    barra para que quepa el título);
  - las palabras bajo las pistas de ¿Quién es?;
  - los tamaños de `.pnCamino` y `.pnSaltar`;
  - los menús de Pensar y Pintar en horizontal (6 o 7 botones);
  - el iPhone pequeño (375 × 667).
- **Textos de Pensar según D-038:**
  - botones con verbo: «PINTAR», «HACER OTRO», «JUGAR OTRO», «ESCONDER», «ELEGIR», «HACER LA PRUEBA»;
  - la etiqueta de nivel en dos líneas, sin «·»;
  - los números en cifra («¡SOLO QUEDA 1!»).
- **Contraste:** medido con el mismo criterio que la prueba común. Ningún texto de Pensar baja de 4,5:1.
- **No toca ningún dato, nivel, respuesta ni recompensa.**
- **El salón:** ver `SALON_Y_LECTURA.md`. La capa no bloqueaba los toques. La causa estaba en el motor de Mi Mundo y el
  bucle de títulos de `f3005ce`; las dos cosas están corregidas en `4dd3a80`.

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
