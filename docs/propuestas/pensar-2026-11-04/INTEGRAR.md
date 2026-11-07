# Nota para integrar Pensar (para el chat de `avatar-creador`)

Desde el 07/11/2026, **solo el chat de `avatar-creador` reúne y publica**. Este chat desarrolla los juegos en
`juegos-pensar` y no toca `main`, el generador de publicación ni los archivos de `avatar-creador`. Esta nota dice qué hay
que llevar al juego **cuando la propietaria apruebe cada entrega**: hasta entonces, nada.

## Qué está publicado y qué no

| Entrega | Commit de `juegos-pensar` | Estado (07/11) |
| --- | --- | --- |
| 1.ª · Contar y Memoria | `5390dfc` (+ enlace `f9a2f40`) | **Publicada** en `main` `021c67e` (D-035). Ya unida a `avatar-creador` (`1884198`). |
| 2.ª · ¿Qué sigue?, Sombras y El diferente progresivos + Unir puntos | `cf80691` (+ enlace `3a0b508`) | **Pendiente de la prueba de la propietaria.** No publicar. |
| 3.ª · Repasar dibujos | `9ca48f1` (+ enlace en el commit siguiente; los archivos del juego son los de `9ca48f1`) | **Pendiente de la prueba de la propietaria.** No publicar. |

## Archivos del juego (solo estos; todo en `docs/propuestas/pensar-2026-11-04/`)

Entre `cf80691` y `9ca48f1` solo cambian `pensar.css` (estilos de Repasar añadidos al final) y el nuevo `repasar.js`.

En el orden en que se cargan, después de `logros.js` y antes de Mi Mundo:

| Archivo | Para qué | 1.ª | 2.ª | 3.ª |
| --- | --- | --- | --- | --- |
| `pensar.css` | estilos de todos los juegos de Pensar | ✔ (versión `5390dfc`) | cambia | cambia (+ estilos de Repasar al final) |
| `dibujos.js` | los 20 dibujos SVG | ✔ | cambia (partes marcadas `data-p`, mofletes `#ff9ac5`) | igual que la 2.ª |
| `pensar.js` | Contar y Memoria | ✔ | cambia (comparte `PENSAR_UTIL`) | igual que la 2.ª |
| `figuras.js` | figuras de Unir puntos (contornos cerrados) | — | **nuevo** | igual que la 2.ª (Repasar también la usa) |
| `pensar2.js` | ¿Qué sigue?, Sombras, El diferente y Unir puntos | — | **nuevo** | igual que la 2.ª |
| `repasar.js` | Repasar dibujos | — | — | **nuevo** (necesita `figuras.js` y `pensar2.js` antes) |

**Lo demás de la carpeta no va al juego**: `index.html`, `aislamiento.js`, `manifest.json`, `progreso.js`, `logros.js`,
`preparar_copia.py`, `simular_publicacion.py`, las pruebas `prueba-*.js`, `capturas/`, `LEEME.md` y esta nota.

Siempre los **seis (o tres) archivos del mismo commit**: no se mezclan versiones, porque `pensar2.js` y `repasar.js`
usan lo que exportan `pensar.js` y `dibujos.js` en ese commit.

## Cómo hacerlo con el generador de `avatar-creador`

`preparar_publicacion.py` (en `avatar-creador`) ya tiene `--con-pensar CARPETA` con la lista fija
`PENSAR = ['pensar.css', 'dibujos.js', 'pensar.js']`. Al aprobar una entrega:

1. Unir `juegos-pensar` hasta el commit aprobado. Solo cambia la carpeta `docs/propuestas/pensar-2026-11-04/`, salvo
   los documentos.
2. En el generador, ampliar la lista:
   - con la 2.ª: `['pensar.css', 'dibujos.js', 'pensar.js', 'figuras.js', 'pensar2.js']`;
   - con la 3.ª: `[…, 'pensar2.js', 'repasar.js']`.
   Todos van en la página y en lo básico sin conexión, en ese orden.
3. Generar y comprobar con sus pruebas de publicación; la versión (huella) cambia sola y la caché sin conexión se
   renueva.

`simular_publicacion.py` + `prueba-sin-conexion.js` de esta carpeta hacen lo mismo en una carpeta temporal, para
comprobar antes el modo avión (10/10 con las tres entregas).

## Datos (nada que migrar)

- **Claves nuevas,** todas con el prefijo `lv_`, que «Guardar / Recuperar mi progreso» ya incluye, así que no hace falta
  cambiar `progreso.js`:
  - 1.ª: `lv_contar2`, `lv_parejas`, `lv_donde`, `lv_serie`;
  - 2.ª: `lv_sigue2`, `lv_sombras2`, `lv_distinto2`, `lv_puntos`;
  - 3.ª: `lv_repasar`.
- **Solo se leen** las antiguas `lv_contar`, `lv_sigue`, `lv_sombras` y `lv_distinto`, para no empezar por lo fácil.
- **Ninguna clave se borra ni se cambia.** Los dibujos de Unir puntos y Repasar se guardan con el «Guardar» de Pintar
  (`gal`).
- **Pintar no cambia:** las figuras se registran como plantillas no enumerables (`TPL['pz:…']` y `TPL['rp:…']`), que
  no salen en «Colorear dibujos».
- La flecha de Pintar vuelve a Unir puntos o a Repasar solo cuando el dibujo viene de ahí.

## Puntos de contacto con lo de `avatar-creador`

- Las pantallas nuevas se añaden antes de `#logros`.
- Los botones nuevos van al final del menú Pintar (`#m-paint .menu`).
- Pensar cambia los botones de `#m-think`.
- No tocan Mi Mundo, Vestir, la muñeca, logros ni `progreso.js`.
- Envuelven `onShow.paint` (sin cambiar lo que hace con las demás láminas).
