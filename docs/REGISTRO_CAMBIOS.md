# Registro de cambios

### 2026-10-18 — D-024 · D-025: lazo en la base de la coleta (candidato) y avisos de compatibilidad en el visor

- **Solicitado por:** la propietaria («… al poner un lazo sobre la coleta cambia a melena. Prepara una colocación del lazo
  en la base de la coleta, como capa independiente, manteniendo el peinado elegido… No cambies de peinado
  silenciosamente…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `0e4da8f`, el de la entrada siguiente).
- **Estado:** lazo con la coleta **candidato** en el visor, **encaje pendiente de revisión**. Nada activado ni publicado.
- **Cambios:**
  - `docs/propuestas/accesorios-2026-10-16/lazo-coleta/` (nueva): `lazo_coleta.py` (el recorte aprobado del lazo con
    `colocar()`: centro (612, 86), ancho 138, giro −32°), `capa-lazo-coleta.png`, `comprobaciones.json` y
    `comparacion-lazo-coleta.png`.
  - Visor: con la coleta, el lazo usa esta capa y se conserva el peinado; con la coleta o las dos coletas, los demás
    accesorios, la corona y los pelos de la melena no se ponen y sale un aviso (ya no se vuelve a la melena sin avisar);
    al cambiar de peinado, lo no compatible se quita avisando. Corregido que las filas «Cinta» y «Dos coletas» se veían
    siempre (`[hidden]`).
  - D-024 (10), D-025 (8), `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los
    `LEEME.md` de accesorios, coleta y visor (27).
- **Resultado:** una sola colocación con y sin cinta: 0 px sobre la piel que se ve, 0 px sobre la cinta, 100 % sobre el
  pelo; capas aprobadas sin cambios. La copia `prueba-juego-d026` no cambia.
- **Datos guardados afectados:** ninguno (el visor no guarda nada). Juego, `sw.js` y `main` sin cambios.
- **Pruebas:** visor en Chromium (pantalla de iPhone simulada): lazo con coleta con y sin cinta, 6 accesorios y corona
  rechazados con aviso, cambios de peinado, color y piel, parpadeo, sin errores ni almacenamiento; a tamaño real, con
  lazo = sin lazo + capa (diferencia ≤ 1). Pruebas anteriores del visor (dos coletas 40/40, gorrito y gorra 20/20).
  `pruebas/prueba-juego.js` 21/21 y `pruebas/prueba-copia.js` 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-18 — `0e4da8f` · D-026: variantes aprobadas; copia aislada nueva prueba-juego-d026 con los tres peinados y los accesorios

- **Solicitado por:** la propietaria («Registra en D-026 mi aprobación visual de las variantes revisadas… Prepara una
  nueva copia aislada del juego con los tres peinados y los accesorios aprobados…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `e9b1305`, el de la entrada siguiente).
- **Estado:** variantes de las dos coletas **aprobadas visualmente** (no probadas una a una en el iPhone). Copia aislada
  nueva preparada y probada en Chromium; **pendiente de probar en el iPhone**. Nada activado ni publicado.
- **Cambios:**
  - `docs/propuestas/prueba-juego-d026/` (nueva): `preparar_prueba.py`, `index.html` (generado), `aislamiento.js`
    (`d026:` / `d026-`), `manifest.json`, `avatar/motor.js` (copia con compatibilidades de adornos),
    `avatar/catalogo-d026.js`, `avatar/arte/piezas.js` y 196 piezas WebP (18,5 MB), `prueba-aislada.js` y `LEEME.md`.
  - D-026, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y el `LEEME.md` del peinado.
- **Resultado:** melena por defecto; 5 peinados y 8 adornos con las compatibilidades del visor (adornos de pelo de uno en
  uno; corona sin diadema, gorrito ni gorra; corona y adornos de pelo solo con la melena; pintacaras con todos).
- **Datos guardados afectados:** ninguno del juego ni de las pruebas congeladas (la copia usa los suyos, `d026:`).
  Juego, `sw.js` y `main` sin cambios.
- **Pruebas:** `prueba-juego-d026/prueba-aislada.js` 20/20 (selección tocando, 104 casos de compatibilidad, 108
  combinaciones, parpadeo con cada peinado y piel, guardar y reabrir, cambios sin guardar, «Mi Mundo», datos ajenos
  intactos, muñeca anterior, sin errores; a tamaño real ≤ 4 en lo opaco). `pruebas/prueba-juego.js` 21/21,
  `pruebas/prueba-copia.js` 45/45 y pruebas congeladas D-016 13/13, D-021 19/19, D-023 18/18. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-18 — `e9b1305` · D-026: dos coletas completas aprobadas; variantes con los colores de pelo y los tonos de piel en el visor

- **Solicitado por:** la propietaria («Apruebo visualmente ambas candidatas con las puntas completas… Prepara ahora sus
  variantes con los cinco colores de pelo y los cuatro tonos de piel…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `ee8e1b4`, el de la entrada siguiente).
- **Estado:** dos coletas completas (con y sin sombrero) **aprobadas visualmente**; variantes de color y piel en el visor,
  aprobación pendiente. Nada activado ni publicado.
- **Cambios:**
  - `coletas2_variantes.py` (nuevo): pelo en los 5 colores (`capas/variantes/`, 20), bordes por tono (`capas/pieles/`,
    30), revisión (`revision-variantes/`) y `comprobaciones-variantes.json`. Corrige en las variantes los restos de la oreja
    de la imagen sobre nuestras orejas y el pelo que faltaba detrás de su borde sin sombrero.
  - Visor: «Dos coletas (aprobadas)»; fila «Dos coletas»: Con sombrero (aprobada, al elegir el peinado) · Sin sombrero
    (aprobada) · Montaje anterior (referencia); las dos completas siguen a la piel y al color de pelo.
  - D-026, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` del peinado
    y del visor.
- **Resultado:** alfa igual en los 5 colores; coleteros y sombrero sin cambios; bordes sin tocar el pelo a más de 5 px de
  la piel; orejas limpias con todos los tonos; sin halos en el nacimiento del pelo; parpadeo bien.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium (iPhone simulado): 40 combinaciones (con/sin sombrero × 4 pieles × 5 colores) con las
  capas correctas y cargadas, parpadeo con cada piel, versión con sombrero al elegir el peinado, montaje anterior solo
  claro/castaño, vuelta a la melena con la corona; sin errores ni almacenamiento; a tamaño real coincide con el montaje
  (≤ 3 en lo opaco). `pruebas/prueba-juego.js` 21/21 y `pruebas/prueba-copia.js` 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `ee8e1b4` · D-026: pelo bajo el sombrero y puntas completas (de ChatGPT); candidatas con y sin sombrero en el visor

- **Solicitado por:** la propietaria («Usa esta imagen como fuente del pelo que faltaba bajo el sombrero y de las puntas…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `daac493`, el de la entrada siguiente).
- **Estado:** dos candidatas (con sombrero y sin sombrero, puntas completas); montaje anterior conservado (por defecto en
  la fila). Revisión pendiente. Nada activado ni publicado.
- **Cambios:**
  - Referencia nueva sin modificar; `completar_pelo.py` (alineación, zona, uniones); `capas/completado/` (pelo con y sin
    sombrero, delante y detrás; antes/después; uniones; comprobaciones).
  - Visor: fila «Dos coletas» (montaje anterior · con sombrero y puntas completas · sin sombrero y puntas completas).
  - D-026, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` del peinado
    y del visor.
- **Resultado:** alineación: cara 0,3 px, coleteros 4,5 px más arriba en la nueva. Uniones con diferencia alta: puntas
  18,6 %, bajo los coleteros 10,7 % (a la vista, continúan). Cara, orejas, cuerpo, vestido, coleteros y sombrero
  nuestros/aprobados; pelo aprobado fuera de la zona idéntico.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium (iPhone simulado): las tres versiones, parpadeo, vuelta a la melena; sin errores ni
  almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo opaco) con y sin sombrero. `pruebas/prueba-juego.js`
  21/21 y `pruebas/prueba-copia.js` 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `daac493` · D-026: dos coletas rizadas con coleteros y sombrero de aventura (peinado aprobado; encaje candidato en el visor)

- **Solicitado por:** la propietaria («Apruebo esta propuesta como peinado nuevo: dos coletas rizadas bajas con coleteros
  verdes y sombrero de aventura…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `e495e39`, el de la entrada siguiente).
- **Estado:** peinado aprobado; **encaje candidato**, pendiente de revisión. Nada activado ni publicado.
- **Cambios:**
  - `docs/propuestas/peinado-coletas-sombrero-2026-10-17/` (nuevo): referencia sin modificar, `coletas_sombrero.py`,
    capas (pelo detrás, pelo delante, coleteros, sombrero), vistas, máscara del pelo oculto, comprobaciones, `LEEME.md` y
    `guia-chatgpt/` (guía y plantilla del pelo que falta).
  - Visor: «Dos coletas con sombrero (candidato)» en la fila «Peinado» (piel clara y castaño; sin accesorio ni corona).
  - D-026 (nueva), `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y el `LEEME.md` del
    visor.
- **Resultado:** cejas y ojos libres (el ala a 11 px de las cejas); nada de la piel ni de las orejas de la imagen; pelo
  oculto bajo el sombrero (91 453 px) marcado; puntas de las coletas cortadas por el borde de la imagen (y = 783),
  señaladas.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium (iPhone simulado): elegir las dos coletas (pasa a piel clara y castaño, sin accesorio ni
  corona), parpadeo, vuelta a la melena con otra piel o la corona, cambio a la coleta y a la melena; sin errores ni
  almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo opaco). `pruebas/prueba-juego.js` 21/21 y
  `pruebas/prueba-copia.js` 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `e495e39` · D-024: gorra aprobada; bordes revisados con los colores de pelo y los tonos de piel (sin defectos)

- **Solicitado por:** la propietaria («Apruebo visualmente la gorra tal como está colocada…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `839d38b`, el de la entrada siguiente).
- **Estado:** encaje de la gorra **aprobado visualmente**; bordes revisados sin defectos (no hace falta corregir: la
  capa no cambia). Con la coleta, más adelante. Nada activado ni publicado.
- **Cambios:**
  - `gorra/revisar_gorra.py` y `gorra/revision/` (nuevos): las 20 combinaciones sobre la melena, detalle de los bordes
    en fondo claro y oscuro, y cifras.
  - Visor: «Gorra rosa del rayo (aprobada)»; «Sin accesorio» por defecto y exclusión con la corona sin cambios.
  - D-024, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de la gorra,
    de los accesorios y del visor.
- **Resultado:** sin halos en el borde de la gorra con ningún color ni tono; solo puntos sueltos de 1 px del contorno
  (41–73 claros y 88–122 oscuros de 1 092), parecidos en todas las combinaciones.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** revisión de las 20 combinaciones; visor en Chromium con la gorra y las 20 combinaciones (sigue puesta,
  sin corona, en la melena), sin errores. `pruebas/prueba-juego.js` 21/21 y `pruebas/prueba-copia.js` 45/45. No
  probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `839d38b` · D-024: gorra rosa del rayo de frente (diseño aprobado) extraída y en el visor como candidata

- **Solicitado por:** la propietaria («Apruebo la gorra rosa de frente con el rayo bordado…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `18c4054`, el de la entrada siguiente).
- **Estado:** diseño aprobado; **encaje candidato, pendiente de revisión**. Nada activado ni publicado.
- **Cambios:**
  - `accesorios-2026-10-16/gorra/` (nuevo): imagen aprobada sin modificar, `gorra.py` (extracción y búsqueda de escala y
    posición), `gorra-recortada.png`, `capa-gorra.png`, `comparacion-gorra.png`, `comprobaciones.json` y `LEEME.md`.
  - Visor: «Gorra rosa del rayo (candidata)» en la fila «Accesorio de pelo»; quita la corona (y los demás accesorios,
    uno cada vez) y la corona la quita; «Sin accesorio» por defecto.
  - D-024, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de los
    accesorios y del visor.
- **Resultado:** ×1,10, centrada, 4 px más abajo: pelo de arriba cubierto al 99,99 %; cejas libres a 6,3 px; ojos y rizos
  de los lados libres. Con la escala de los ojos sin ajustar, la visera tapaba las cejas. Peinado y cabeza sin cambios.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium: la gorra con las 20 combinaciones de piel y pelo, poner y quitar, corona, parpadeo,
  desde la coleta; sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo opaco).
  `pruebas/prueba-juego.js` 21/21 y `pruebas/prueba-copia.js` 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `18c4054` · D-024: gorrito B aprobado; revisado con colores de pelo y tonos de piel (melena) y con la coleta

- **Solicitado por:** la propietaria («Apruebo visualmente el gorrito B, un 8 % más grande, tal como está colocado…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `738d9dc`, el de la entrada siguiente).
- **Estado:** encaje del gorrito B **aprobado visualmente**, opción elegida; A, alternativa anterior. Con la coleta,
  pendiente (necesita otra adaptación). Nada activado ni publicado.
- **Cambios:**
  - `gorrito/revisar_b.py` y `gorrito/revision-b/` (nuevos): las 20 combinaciones sobre la melena, detalle de los bordes
    (fondo claro y oscuro), la coleta con el gorrito marcada y cifras. No cambia ninguna capa.
  - Visor: «Gorrito de dormir (aprobado)» (el B) y «Gorrito de dormir · A (alternativa anterior)»; «Sin accesorio» por
    defecto; exclusión con la corona sin cambios.
  - D-024, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` del
    gorrito, de los accesorios y del visor.
- **Resultado:** melena: bien con los 5 colores y los 4 tonos (sin halos en el borde del gorro). Coleta: asoman el moño
  (6 787 px por encima del gorro) y rizos a la derecha (18 250 px en total), con y sin cinta: no se fuerza.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium: el gorrito B con las 20 combinaciones de piel y pelo (sigue puesto, sin corona, en la
  melena), poner y quitar, corona, parpadeo, desde la coleta; sin errores ni almacenamiento. `pruebas/prueba-juego.js`
  21/21 y `pruebas/prueba-copia.js` 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `738d9dc` · D-024: gorrito de dormir B, un 8 % más grande (cubre el pelo de arriba, cejas libres), en el visor

- **Solicitado por:** la propietaria («Prepara una variante con el gorrito un 6–9 % más grande…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `8e39fbf`, el de la entrada siguiente).
- **Estado:** dos candidatos (A y B) en el visor; **encaje pendiente de revisión**. Nada activado ni publicado.
- **Cambios:**
  - `gorrito/gorrito_grande.py` (nuevo): búsqueda de escala (×1,06–×1,09) y posición con el mismo recorte;
    `capa-gorrito-b.png`, `comprobaciones-b.json`, `antes-despues-gorrito.png`, `zonas-sin-cubrir-b.png`.
  - Visor: «Gorrito de dormir · A (candidato)» y «Gorrito de dormir · B, 8 % más grande (candidato)»; los dos quitan la
    corona y la corona los quita.
  - D-024, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` del
    gorrito, de los accesorios y del visor.
- **Resultado:** B = ×1,08 y 8 px a la izquierda: pelo de arriba cubierto al 99,9 % (A: 95,9 %); cejas libres, a 14,6 px
  (A: 6,3 px); ojos libres; cabe en el lienzo. Peinado, cabeza y candidato A sin cambios.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium (iPhone simulado) con A y con B: poner y quitar, corona, parpadeo, desde la coleta; sin
  errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo opaco). `pruebas/prueba-juego.js` 21/21
  y `pruebas/prueba-copia.js` 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `8e39fbf` · D-024: gorrito de dormir de frente (diseño aprobado) extraído y en el visor como candidato

- **Solicitado por:** la propietaria («Apruebo el diseño frontal del gorrito de dormir. Extrae únicamente el gorro y el
  pompón…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `a88b0f3`, el de la entrada siguiente).
- **Estado:** diseño aprobado; **encaje candidato, pendiente**. Nada activado ni publicado.
- **Cambios:**
  - `accesorios-2026-10-16/gorrito/` (nuevo): imagen aprobada sin modificar, `gorrito.py`, `gorrito-recortado.png`,
    `capa-gorrito.png`, `comparacion-gorrito.png`, `zonas-sin-cubrir.png`, `comprobaciones.json` y `LEEME.md`.
  - Visor: «Gorrito de dormir (candidato)» en la fila «Accesorio de pelo»; al ponerlo se quita la corona (y los demás
    accesorios, uno cada vez); poner la corona quita el gorrito; «Sin accesorio» por defecto.
  - D-024, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de los
    accesorios y del visor.
- **Resultado:** cejas libres (0 px; a 6 px como mínimo); rizos de los lados conservados (el pompón tapa 1 295 px); pelo
  de arriba cubierto al 95,9 %: **asoma una franja fina arriba a la izquierda** (hasta 22 px) y un mechoncito encima,
  marcados; peinado sin tocar.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium (iPhone simulado): poner y quitar el gorrito, la corona, parpadeo y vuelta a la melena
  desde la coleta, sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo opaco).
  `pruebas/prueba-juego.js` 21/21 y `pruebas/prueba-copia.js` 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `a88b0f3` · D-025: aprobación visual de la coleta con los colores de pelo y los tonos de piel

- **Solicitado por:** la propietaria («Registra en D-025 mi aprobación visual del resultado de la coleta con los colores
  de pelo y tonos de piel revisados…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `199dce1`, el de la entrada siguiente).
- **Estado:** colores de pelo y tonos de piel de la coleta **aprobados visualmente**; se conservan con cinta y sin cinta;
  melena por defecto. **No probado en el iPhone**: las 40 combinaciones no se dan por probadas una a una allí (solo la
  prueba automática del visor en Chromium con iPhone simulado). Nada activado ni publicado.
- **Cambios:** solo documentación: D-025 (7), `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`,
  `HOJA_DE_RUTA.md` y los `LEEME.md` del peinado y del visor. Sin cambios en piezas, visor ni código.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** no aplica (solo documentación); `verificar_documentacion.py --preparado`.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-17 — `199dce1` · D-025: coleta sin cinta aprobada; coleta con y sin cinta en los 5 colores de pelo y los 4 tonos de piel, en el visor

- **Solicitado por:** la propietaria («Apruebo visualmente la coleta sin cinta… Adapta ahora la coleta, con y sin cinta,
  a los cinco colores de pelo y los cuatro tonos de piel…»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `4b13e91`, el de la entrada siguiente).
- **Estado:** coleta sin cinta **aprobada visualmente** (se conservan las dos opciones); colores de pelo y tonos de piel
  de la coleta **en el visor, aprobación pendiente**. Melena por defecto. Nada activado ni publicado.
- **Cambios:**
  - `peinado-coleta-2026-10-16/coleta_variantes.py` (nuevo): orejas de la coleta en capa propia (montaje castaño-claro
    idéntico al aprobado), pelo en los 5 colores (transformación de la melena), orejas de cada tono y capas de bordes
    por tono, versión y color; salidas en `capas/variantes/`, `capas/pieles/`, `revision-variantes/` y
    `comprobaciones-variantes.json`.
  - Visor: «Coleta rizada (aprobada)», «Sin cinta (aprobada)»; la coleta sigue a la piel, el color de pelo, las cejas y
    los ojos (orejas y bordes según la piel); el accesorio de pelo y la corona siguen volviendo a la melena.
  - D-025, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` del
    peinado y del visor.
- **Resultado:** castaño con piel clara igual al aprobado (diferencia máxima 1); alfa igual en todos los colores; los
  bordes no tocan el pelo a más de 5 px de la piel (0 px); orejas, respecto a la cara, como en la piel clara (−22 a −24
  de luminosidad en los cuatro tonos); sin halos en el nacimiento del pelo ni parches en las orejas (revisado a tamaño
  real y ampliado, en fondo claro y oscuro). Capas aprobadas (con y sin cinta) sin cambios.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium (iPhone simulado): 40 combinaciones (con/sin cinta × 4 pieles × 5 colores) con las capas
  correctas y cargadas, parpadeo con cada piel, vuelta a la melena con accesorio o corona, sin errores ni
  almacenamiento; a tamaño real coincide con el montaje en lo opaco (≤ 3). `pruebas/prueba-juego.js` y
  `pruebas/prueba-copia.js`: 21/21 y 45/45. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `4b13e91` · D-025: coleta sin cinta (32 px arriba y en las puntas; uniones limpias) como candidata en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `3acef5b`, el de la entrada siguiente).
- **Estado:** uniones limpias; candidata en el visor; aprobación visual pendiente. Nada activado ni publicado.
- **Cambios:**
  - `sin_cinta.py`: franja de arriba y de las puntas configurable (32 px por defecto); capas candidatas regeneradas en
    `capas/candidata-sin-cinta/` (con `revision-tamano-juego-y-ampliada.png`).
  - Visor: fila «Cinta» con la coleta («Con cinta (aprobada)» por defecto · «Sin cinta (candidata)»).
  - D-025, `ESTADO_ACTUAL.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` del peinado y del visor.
- **Resultado:** uniones que fallan: arriba 3,7 %, puntas 1 %, abajo 0 %; sombra de la cinta 14 px; sin restos lila; piel,
  cara y silueta sin tocar; capas aprobadas sin cambios (con cinta se ve igual).
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** `sin_cinta.py` con 14–50 px; revisión a tamaño de juego y ampliada; visor en Chromium (iPhone simulado)
  con y sin cinta, parpadeo y vuelta a la melena, sin errores; a tamaño real (≤ 3). No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `3acef5b` · D-025: candidata sin cinta con la zona ampliada (abajo limpia; arriba y puntas fallan, marcadas)

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `0b9e1bb`, el de la entrada siguiente).
- **Estado:** candidata preparada; la unión de abajo es limpia, la de arriba y las puntas aún fallan. **No se añade al
  visor.** Nada activado ni publicado.
- **Cambios:**
  - `peinado-coleta-2026-10-16/sin_cinta.py` y `capas/candidata-sin-cinta/` (pelo delante y detrás sin cinta,
    `uniones-candidata.png`, `union-de-arriba-ampliada.png`, `antes-despues.png`, `comprobaciones.json`).
  - D-025, `ESTADO_ACTUAL.md` y el `LEEME.md` del peinado. Capas aprobadas y visor sin cambios.
- **Resultado:** ampliación hasta 20 px abajo y 8 px arriba y en las puntas; falla abajo 0,5 %, arriba 22 %, puntas 19 %;
  piel, frente, cara y silueta sin tocar; 0 px de restos lila; 499 px de sombra de la cinta arriba y en las puntas.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** `sin_cinta.py` (comprobaciones de `comprobaciones.json`); comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `0b9e1bb` · D-025: revisión de las uniones del pelo sin cinta (fallan; marcadas, sin integrar)

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `e93d813`, el de la entrada siguiente).
- **Estado:** la propuesta de pelo sin cinta está alineada, pero con el margen mínimo las uniones fallan; se marcan y
  **no se integran**. Nada activado ni publicado.
- **Cambios:**
  - `peinado-coleta-2026-10-16/referencias/referencia-coleta-sin-cinta.png` (sin modificar), `revisar_uniones.py` y
    `uniones/` (`uniones-marcadas.png`, `uniones.json`).
  - D-025, `ESTADO_ACTUAL.md` y el `LEEME.md` del peinado. Capas aprobadas y visor sin cambios.
- **Resultado:** desplazamiento < 0,3 px; uniones que fallan: abajo 98 %, arriba 32 %, puntas 52 %, 14 px de restos lila.
  Sobre la frente las imágenes coinciden a partir de 15–20 px bajo la cinta.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** `revisar_uniones.py`; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `e93d813` · D-025 actualizada: coleta con cinta aprobada visualmente; melena por defecto

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `cca9f34`, el de la entrada siguiente).
- **Estado:** encaje de la coleta con cinta aprobado visualmente; melena suelta por defecto. Pendientes: quitar la cinta
  y adaptar colores y pieles. Nada activado ni publicado.
- **Cambios:** visor (etiqueta «Coleta rizada con cinta (aprobada)»); D-025, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`,
  `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de propuestas, peinado y visor. Ninguna imagen cambia.
- **Datos guardados afectados:** ninguno. Originales, juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium (melena por defecto; coleta y vuelta a la melena; sin errores); comprobador de
  documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `cca9f34` · D-025: peinado nuevo «coleta rizada con cinta» (aprobado) como candidato en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `8a9eaef`, el de la entrada siguiente).
- **Estado:** peinado aprobado; encaje candidato; falta el pelo bajo la cinta. Nada activado ni publicado.
- **Cambios:**
  - Nueva carpeta `docs/propuestas/peinado-coleta-2026-10-16/`: la referencia (sin modificar), `coleta.py`, `capas/`
    (pelo detrás, pelo delante, cinta, comparación, regiones y `comprobaciones.json`), `guia-chatgpt/` y `LEEME.md`.
  - Visor: fila «Peinado» («Melena suelta (aprobada)» por defecto).
  - D-025 en `DECISIONES.md`; `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los
    `LEEME.md` de propuestas y visor.
- **Resultado:** solo pelo y cinta de la imagen (sin cara, cuerpo ni vestido), escala 0,731 por los ojos; cubren nuestra
  cabeza sin tapar los ojos; bajo la cinta no hay pelo (37 960 px): guía para ChatGPT.
- **Datos guardados afectados:** ninguno. Muñeca, juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** comprobaciones de `comprobaciones.json`; visor en Chromium (iPhone simulado) con la coleta, el parpadeo y
  vuelta a la melena, sin errores ni almacenamiento; a tamaño real (≤ 3). No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `8a9eaef` · D-024 actualizada: diadema aprobada visualmente; etiqueta «aprobada» en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `1d8f22d`, el de la entrada siguiente).
- **Estado:** encaje de la diadema aprobado visualmente. Nada activado ni publicado.
- **Cambios:** visor (etiqueta «Diadema de estrellas (aprobada)»; sin otros cambios de comportamiento); D-024,
  `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de propuestas,
  accesorios, diadema y visor. Ninguna imagen cambia.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** visor en Chromium (por defecto «Sin accesorio»; la diadema quita la corona y se puede volver a poner; sin
  errores); comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `1d8f22d` · D-024: diadema de estrellas de frente (diseño aprobado) como candidata en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `6762ab8`, el de la entrada siguiente).
- **Estado:** diseño de frente aprobado; encaje de la capa extraída pendiente de revisión. Nada activado ni publicado.
- **Cambios:**
  - Nueva carpeta `docs/propuestas/accesorios-2026-10-16/diadema/`: la imagen aprobada (sin modificar), `diadema.py`,
    el recorte, la capa candidata, la comparación, `comprobaciones.json` y `LEEME.md`.
  - Visor: «Diadema de estrellas (candidata)» en «Accesorio de pelo»; al elegirla se quita la corona.
  - D-024, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de
    propuestas, accesorios y visor.
- **Resultado:** solo arco, estrellas y perlas (sin pelo ni piel de la imagen); escala 0,68 por los ojos; 0 px sobre la
  piel visible, 100 % sobre el pelo; se solapa con la corona.
- **Datos guardados afectados:** ninguno. Muñeca, juego, `sw.js`, `main`, partidas y pruebas congeladas sin cambios.
- **Pruebas:** comprobaciones de `comprobaciones.json`; visor en Chromium (iPhone simulado) sin errores ni almacenamiento.
  No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `6762ab8` · D-024 actualizada: lazo, flores y mariposa aprobados visualmente; «Sin accesorio» por defecto

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `1b61877`, el de la entrada siguiente).
- **Estado:** encaje del lazo, el pasador de flores y la mariposa aprobado visualmente tal como están colocados; «Sin
  accesorio» por defecto en el visor. Diadema, cinta y gorros, pendientes. Nada activado ni publicado.
- **Cambios:** solo documentación (D-024, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`,
  `HOJA_DE_RUTA.md` y los `LEEME.md` de propuestas, accesorios y visor). Ninguna imagen ni el visor cambian.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y las pruebas congeladas sin cambios.
- **Pruebas:** comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `1b61877` · D-024: segunda colección de accesorios de pelo (diseño aprobado); lazo, flores y mariposa en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `03c4fed`, el de la entrada siguiente).
- **Estado:** diseño de los ocho aprobado; encaje pendiente. Nada activado ni publicado.
- **Cambios:**
  - Nueva carpeta `docs/propuestas/accesorios-2026-10-16/`: las dos láminas (sin modificar), `capas/` (`extraer.py`,
    `colocar.py`, recortes, capas del lazo, las flores y la mariposa, comparación y `comprobaciones.json`),
    `guia-chatgpt/` (guía y plantillas para pedir de frente la diadema, la cinta y los gorros) y `LEEME.md`.
  - Visor: fila «Accesorio de pelo» («Sin accesorio» por defecto).
  - D-024 en `DECISIONES.md`; `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los
    `LEEME.md` de propuestas y visor.
- **Resultado:** lazo, flores y mariposa sin fondo, marco, texto ni sombra; 0 px sobre la piel visible y sobre la corona;
  ≥ 99,9 % sobre el pelo. Diadema, cinta y gorros en perspectiva de tres cuartos: no encajan de frente (guía preparada).
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y las pruebas congeladas sin cambios.
- **Pruebas:** comprobaciones de `comprobaciones.json`; visor en Chromium (iPhone simulado) con cada accesorio, con y sin
  corona, con otra piel y otro color de pelo y quitándolo; sin errores ni almacenamiento; a tamaño real (≤ 3). No probado
  en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `03c4fed` · D-023: tonos de piel aprobados; copia aislada nueva con piel, pelo, cejas, ojos y pintacaras

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `d600d4c`, el de la entrada siguiente).
- **Estado:** tonos de piel aprobados visualmente. Copia nueva preparada para el iPhone, **sin probar todavía en el
  iPhone**. Nada publicado.
- **Cambios:**
  - Nueva carpeta `docs/propuestas/prueba-juego-d023/`: generador (`preparar_prueba.py`, el de D-021 con todas las
    piezas y el prefijo `d023`), copia generada de `index.html` y del motor, `aislamiento.js` (`d023:` / `d023-`),
    `manifest.json` («PRUEBA D-023»), catálogo `d023` (4 pieles, 5 colores de pelo con cejas a juego, 4 de ojos, corona y
    pintacaras, y capas de bordes por piel), 79 piezas WebP, `prueba-aislada.js` (18 comprobaciones) y `LEEME.md`.
  - D-023 actualizada; `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `ARQUITECTURA_Y_DATOS.md`, `VERSION_DE_PRUEBAS.md`,
    `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de propuestas y piel.
  - Las pruebas congeladas (`prueba-juego-d016/` y `prueba-juego-d021/`) no cambian.
- **Datos guardados afectados:** ninguno. La copia nueva solo escribe con `d023:` y `d023-`; ni las partidas ni los datos
  de D-016 y D-021 se leen, cambian o migran. Juego, `sw.js` y `main` sin cambios.
- **Pruebas:** `prueba-juego-d023/prueba-aislada.js` 18/18 (56 combinaciones, parpadeo con cada piel, guardar y volver a
  abrir, borrador, Mi Mundo, aislamiento, sin errores); a tamaño real frente al montaje: diferencia máxima 5 (39 px en
  las puntas de las cejas). `pruebas/prueba-juego.js` 21/21, `pruebas/prueba-copia.js` 45/45, D-016 13/13, D-021 19/19.
  No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `d600d4c` · D-023: corrección 2 del profundo — bordes de piel con cada color de pelo y cuello del vestido

- **Solicitado por:** la propietaria (piel profunda y pelo pelirrojo: siguen los bordes claros).
- **Rama y commit:** `avatar-creador`, este commit (sobre `d31d715`, el de la entrada siguiente).
- **Estado:** corrección hecha; los tres tonos siguen pendientes de revisión. Nada activado ni publicado.
- **Cambios:**
  - `piel-tonos/piel_tonos.py`: los bordes de los **dos pelos** junto a la piel que se ve de verdad (no solo el nacimiento
    del pelo de delante) se separan en parte de piel → piel nueva y parte de pelo → pelo de alrededor en su color aprobado,
    con cada color de pelo; también los píxeles casi transparentes. El filo del cuello del vestido, igual (con el color
    del vestido de justo dentro).
  - Piezas `bordes-pelo-*.png` y `bordes-vestido.png` regeneradas (mismos nombres) en los tres tonos; `comprobaciones.json`.
  - Nuevo `piel-tonos/correccion-profundo/2-bordes-pelo/` (antes / después).
  - D-023, `ESTADO_ACTUAL.md` y `piel-tonos/LEEME.md`.
- **Resultado:** restos de piel clara junto a la piel (profundo): castaño 178 → 60, chocolate 223 → 78, oscuro 97 → 6;
  con pelirrojo quedan 86 px que son mechones de su color. Pelo tocado a más de 12 px de la piel: 0 px con los 5 colores;
  colores de pelo, blancos e iris sin cambios; alfa idéntico.
- **Datos guardados afectados:** ninguno. Originales aprobados, juego, `sw.js`, `main`, partidas y las pruebas D-016 y
  D-021 sin cambios.
- **Pruebas:** antes/después con los 5 colores de pelo y la misma piel profunda, fondo claro y oscuro; visor en Chromium
  sin errores ni almacenamiento. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `d31d715` · D-023: corrección localizada del tono profundo (nacimiento del pelo, lagrimal, contorno del ojo, rojo)

- **Solicitado por:** la propietaria (revisión en su iPhone: no aprueba todavía el profundo).
- **Rama y commit:** `avatar-creador`, este commit (sobre `80d6e2e`, el de la entrada siguiente).
- **Estado:** corrección hecha; los tres tonos siguen pendientes de revisión. Nada activado ni publicado.
- **Cambios:**
  - `piel-tonos/piel_tonos.py`: lo rojizo se conserva en la proporción medida en la lámina (0,75 / 0,67 / 0,42); lagrimal
    tratado como piel; brillos del contorno del ojo suavizados (franja de 7 px); nacimiento del pelo separando la parte de
    piel y la de pelo (pelo de alrededor, en su color aprobado), solo del lado de la cara; franja de cuero cabelludo del
    borde de la cabeza cubierta con el pelo de detrás.
  - Piezas regeneradas en `piel-tonos/dorado|moreno|profundo/` (mismos nombres) y `comprobaciones.json`.
  - Nuevo `piel-tonos/correccion-profundo/` con el antes y el después.
  - D-023 actualizada; `ESTADO_ACTUAL.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de piel y visor.
- **Resultado:** blancos cambiados fuera del lagrimal 0 px (los 236 px rosados del lagrimal, sí); pelo tocado a más de
  12 px del borde 0 px (con los 5 colores); alfa idéntico; ropa de la base igual; fuentes sin cambios.
- **Datos guardados afectados:** ninguno. Originales aprobados, juego, `sw.js`, `main`, partidas y las pruebas D-016 y
  D-021 sin cambios.
- **Pruebas:** comprobaciones de `comprobaciones.json`; antes/después con castaño, rubio miel y pelirrojo, ojos abiertos y
  cerrados, fondo claro y oscuro; visor en Chromium sin errores ni almacenamiento y a tamaño real (≤ 3). No probado en
  un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `80d6e2e` · D-023: tonos de piel dorado, moreno y profundo en el visor (capas pendientes de revisión)

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `7aab673`, el de la entrada siguiente).
- **Estado:** referencia aprobada; capas para revisar en el visor; claro original por defecto. Nada activado ni publicado.
- **Cambios:**
  - `base-aprobada-d013-2026-10-14/piel-tonos/`: la lámina (sin modificar), `piel_tonos.py`, las piezas de cada tono
    (`dorado/`, `moreno/`, `profundo/`: base, ojos abiertos ×4 y cerrados, manos, cejas a juego ×4 y capas de bordes),
    comparaciones, `comprobaciones.json` y `LEEME.md`.
  - `cejas-colores/cejas_colores.py`: pasos separados en funciones para reutilizarlos (las capas salen idénticas).
  - Visor: fila «Piel» y capas de bordes.
  - D-023 en `DECISIONES.md`; `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los
    `LEEME.md` de cejas y visor.
- **Resultado:** solo cambia la piel (alfa idéntico; ropa de la base, iris, blancos y pestañas sin cambios); luminosidad
  como la lámina (manteniendo la diferencia de nuestra piel con su claro); detalle conservado (0,89–0,99); sin parches en
  los bordes de los ojos, los párpados cerrados, el nacimiento del pelo, el cuello ni los pies.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y las pruebas D-016 y D-021 sin cambios.
- **Pruebas:** SHA-256 de las fuentes; comprobaciones de `comprobaciones.json`; visor en Chromium (iPhone simulado) con
  los 4 tonos, colores de ojos y pelo, cejas, camiseta, descalza, otro pelo y parpadeo, sin errores ni almacenamiento, y
  a tamaño real frente al montaje (≤ 3). No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `7aab673` · D-022: cejas a juego aprobadas y por defecto en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `fe701ba`, el de la entrada siguiente).
- **Estado:** cejas de los cuatro tonos aprobadas visualmente; «A juego con el pelo» por defecto en el visor, con la
  opción de las cejas originales. Nada activado ni publicado.
- **Cambios:** visor (botones y valor por defecto de la fila «Cejas»); D-022, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`,
  `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de cejas, pelo y visor. Ninguna imagen cambia.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y las pruebas D-016 y D-021 sin cambios.
- **Pruebas:** visor en Chromium (iPhone simulado): por defecto «A juego»; con el castaño, las de la base; con cada
  tono, su capa; «Originales» las quita; parpadeo igual; sin errores ni almacenamiento. Comprobador de documentación.
  No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `fe701ba` · D-022 actualizada: colores de pelo aprobados; propuesta de cejas a juego en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `28432c8`, el de la entrada siguiente).
- **Estado:** las cuatro variantes de pelo, aprobadas visualmente (castaño original por defecto). Cejas a juego:
  propuesta para revisar en el visor. Nada activado ni publicado.
- **Cambios:**
  - `base-aprobada-d013-2026-10-14/cejas-colores/`: `cejas_colores.py`, 4 capas de cejas, comparación,
    `comprobaciones.json` y `LEEME.md`. La base no cambia.
  - `pelo-colores/colores_pelo.py`: su transformación de color se separa en una función para reutilizarla en las cejas
    (las capas de pelo salen idénticas, byte a byte).
  - Visor: fila «Cejas» («De la base» por defecto · «A juego con el pelo (propuesta)»).
  - D-022 actualizada; `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md`
    de los colores de pelo y del visor.
- **Resultado:** solo cambia el color de las cejas; fuera de ellas, la cara queda igual (diferencia 0); detalle
  conservado (correlación ≥ 0,999). Rubio: cejas más oscuras que el pelo; jengibre: castaño cobrizo suave.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y las pruebas D-016 y D-021 sin cambios.
- **Pruebas:** SHA-256 de las fuentes; visor en Chromium (iPhone simulado) con los 5 colores de pelo, con y sin cejas a
  juego, parpadeo y cambio de pelo de delante, sin errores ni almacenamiento, y a tamaño real frente al montaje (≤ 3).
  No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `28432c8` · D-022: pelo castaño chocolate, rubio miel, castaño oscuro y pelirrojo jengibre en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `ea141e3`, el de la entrada siguiente).
- **Estado:** tonos aprobados; variantes para revisar en el visor; castaño original por defecto. Nada activado ni
  publicado.
- **Cambios:**
  - `base-aprobada-d013-2026-10-14/pelo-colores/`: la lámina (sin modificar), `colores_pelo.py`, 8 capas (delante y
    detrás × 4 tonos), comparaciones, zonas medidas, `comprobaciones.json` y `LEEME.md`.
  - Visor: fila «Color de pelo».
  - D-022 en `DECISIONES.md`; `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y el
    `LEEME.md` del visor.
- **Resultado:** solo cambia el color de nuestras capas (alfa idéntico); luminosidad, tono y saturación como la lámina;
  detalle conservado (correlación 0,94–0,99).
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y las pruebas D-016 y D-021 sin cambios.
- **Pruebas:** SHA-256 de las fuentes; comprobaciones de alfa y detalle; visor en Chromium (iPhone simulado) con los 5
  colores, combinado con ojos, pintacaras y parpadeo, sin errores ni almacenamiento, y a tamaño real frente al montaje
  (≤ 3). No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `ea141e3` · D-021: encaje del pintacaras aprobado; copia aislada nueva con 4 colores de ojos y pintacaras

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `52c14a2`, el de la entrada siguiente).
- **Estado:** pintacaras aprobado visualmente sobre la muñeca (se pone y se quita). Copia nueva preparada para el
  iPhone, **sin probar todavía en el iPhone**. Nada publicado.
- **Cambios:**
  - Nueva carpeta `docs/propuestas/prueba-juego-d021/`: generador (`preparar_prueba.py`, el de D-016 con las piezas
    nuevas y el prefijo `d021`), copia generada de `index.html` y del motor, `aislamiento.js` (`d021:` / `d021-`),
    `manifest.json` («PRUEBA D-021»), catálogo `d021` (4 colores de ojos; adorno «Estrellas y brillo» en la capa
    `accCara`), piezas WebP, `prueba-aislada.js` (19 comprobaciones) y `LEEME.md`.
  - Visor: botón «Estrellas y brillo (aprobado)»; «Sin pintacaras» sigue por defecto.
  - D-021 actualizada; `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `ARQUITECTURA_Y_DATOS.md`, `VERSION_DE_PRUEBAS.md`,
    `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y los `LEEME.md` de propuestas, pintacaras y visor.
  - La prueba congelada D-019 (`prueba-juego-d016/`) no cambia.
- **Datos guardados afectados:** ninguno. La copia nueva solo escribe con `d021:` y `d021-`; ni las partidas ni los
  datos de D-016 se leen, cambian o migran. Juego, `sw.js` y `main` sin cambios.
- **Pruebas:** `prueba-juego-d021/prueba-aislada.js` 19/19 (16 combinaciones de color × pintacaras × corona, parpadeo con
  cada color, guardado y borrador al cerrar y abrir, Mi Mundo, aislamiento, sin errores); a tamaño real frente al
  montaje + ojos lilas + pintacaras: diferencia máxima 3 en lo opaco. `pruebas/prueba-juego.js` 21/21,
  `pruebas/prueba-copia.js` 45/45, prueba D-016 13/13, visor sin errores. No probado en un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `52c14a2` · D-021: pintacaras «Estrellas y brillo» (capa aparte) y opción en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `d900aa5`, el de la entrada siguiente).
- **Estado:** diseño aprobado; **encaje pendiente de revisión**. Nada activado ni publicado.
- **Cambios:**
  - `base-aprobada-d013-2026-10-14/pintacaras/`: la referencia (sin modificar), `pintacaras.py`, la capa
    `capa-pintacaras-estrellas.png`, `comparacion-pintacaras.png`, `zonas-comprobadas.png`, `comprobaciones.json` y
    `LEEME.md`.
  - Visor: fila «Pintacaras» («Sin pintacaras» por defecto · «Estrellas y brillo») y encuadre «Mejillas»; corregido el
    atributo `class` mal cerrado de dos capas (sin cambio visible).
  - D-021 en `DECISIONES.md`; `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`, `HOJA_DE_RUTA.md` y el
    `LEEME.md` del visor.
- **Resultado:** solo adornos (2 estrellas grandes rosa y lila, 2 doradas pequeñas y puntos de brillo por mejilla),
  escala 0,52 respecto a los ojos. Solape con ojos (4 colores y cerrados), pestañas y boca: 0 px; fuera de la piel: 0 px;
  114 de 121 pecas libres (7 muy suaves bajo las estrellas).
- **Datos guardados afectados:** ninguno. Juego, catálogo, `sw.js`, `main`, partidas y la prueba D-019 sin cambios.
- **Pruebas:** SHA-256 de las fuentes; comprobaciones de zonas; visor en Chromium (iPhone simulado) con los 4 colores,
  parpadeo y «Mantener cerrados», sin errores ni almacenamiento, y a tamaño real frente al montaje (≤ 2). No probado en
  un iPhone real.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `d900aa5` · D-020 actualizada: variantes de ojos aprobadas visualmente; marrones por defecto

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `9cccd3d`, el de la entrada siguiente).
- **Estado:** variantes azul, verde y lila aprobadas visualmente; marrones como opción predeterminada (el visor ya abría
  con ellos). Integración en una copia nueva; D-019 congelada.
- **Cambios:** solo documentación (D-020, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `MANUAL_PROYECTO.md`,
  `HOJA_DE_RUTA.md` y los `LEEME.md` de los ojos y del visor). Ninguna imagen ni el visor cambian.
- **Datos guardados afectados:** ninguno. Juego, `sw.js`, `main`, partidas y la prueba D-019 sin cambios.
- **Pruebas:** comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `9cccd3d` · Manual del proyecto y hoja de ruta al día; norma de mantenerlos en cada paso

- **Solicitado por:** la propietaria («acuérdate de ir subiendo las cosas al manual»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `f5689b3`, el de la entrada siguiente).
- **Estado:** solo documentación.
- **Cambios:**
  - `docs/MANUAL_PROYECTO.md`: nuevo apartado «La muñeca nueva: dónde estamos» (D-012 a D-020, enlaces del visor y de la
    prueba D-019, y cómo se trabaja con el arte); fila de Ajustes corregida (caché `v9` y copia en el juego).
  - `docs/HOJA_DE_RUTA.md`: muñeca nueva, ojos de colores y pintacaras.
  - `CLAUDE.md`: norma de actualizar el manual y la hoja de ruta en cada paso relevante.
  - `README.md` y `ESTADO_ACTUAL.md`.
- **Datos guardados afectados:** ninguno. Código, juego, `sw.js`, `main` y la prueba D-019 sin cambios.
- **Pruebas:** comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-16 — `f5689b3` · D-020: ojos azul, verde y lila de fantasía (solo iris) y opción en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `5208abc`, el de la entrada siguiente).
- **Estado:** tonos aprobados; variantes para revisar en el visor. Nada activado ni publicado.
- **Cambios:**
  - `base-aprobada-d013-2026-10-14/ojos-colores/`: la referencia (sin modificar), `colores_ojos.py`, las tres capas,
    la comparación, `comprobaciones.json` y `LEEME.md`.
  - Fila «Color de ojos» en el visor.
  - D-020 en `DECISIONES.md`.
  - Documentación: `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
  - La prueba D-019 no cambia.
- **Resultado:**
  - Solo cambia el color de los iris: unos 4 650 px por variante.
  - Fuera de los iris, idéntico; alfa idéntico; luminosidad igual (< 0,3 de media, redondeo).
  - Tonos medidos en la referencia: azul −98°, verde 114° y lila −36°.
- **Datos guardados afectados:** ninguno. Juego, catálogo, `sw.js`, `main`, partidas y la prueba D-019 sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes y comparación píxel a píxel fuera de los iris.
  - Revisión ×2.
  - Visor en Chromium con pantalla de iPhone simulada: los tres colores y el parpadeo; sin errores ni almacenamiento.
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `5208abc` · D-019: prueba aislada D-016 aprobada en el iPhone; referencia estable

- **Solicitado por:** la propietaria («He probado la copia D-016 en mi iPhone y el resultado me parece perfecto»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `22d96e9`, el de la entrada siguiente).
- **Estado:** aprobación registrada (D-019) sin dar por comprobados pasos concretos no confirmados.
- **Referencia estable:** commit `22d96e9`, con este enlace fijo: <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/22d96e912412942abdb4733cff314250fd901f4a/docs/propuestas/prueba-juego-d016/index.html>. La etiqueta `prueba-d016-aprobada` no se pudo
  subir (el entorno solo permite subir ramas).
- **Cambios:** solo documentación (`DECISIONES.md`, `ESTADO_ACTUAL.md`, `VERSION_DE_PRUEBAS.md`, `propuestas/LEEME.md`
  y el `LEEME.md` de la prueba). La copia no cambia.
- **Datos guardados afectados:** ninguno. El juego principal, `main` y las partidas sin cambios; no se pasa nada al
  juego principal.
- **Pruebas:** comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `22d96e9` · Prueba aislada del juego con el conjunto aprobado (D-016 + D-017 + D-018)

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `7e43c17`, el de la entrada siguiente).
- **Estado:** copia de pruebas para el iPhone; no publicada; el juego no cambia.
- **Cambios:**
  - `docs/propuestas/prueba-juego-d016/`:
    - `preparar_prueba.py` genera la copia de `index.html`, el motor y el índice de piezas;
    - `aislamiento.js` (datos propios), `avatar/catalogo-d016.js`, `manifest.json`;
    - las capas aprobadas en WebP;
    - `prueba-aislada.js` y `LEEME.md`.
  - Documentación: `VERSION_DE_PRUEBAS.md`, `ARQUITECTURA_Y_DATOS.md`, `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md` y
    `propuestas/LEEME.md`.
- **Resultado:**
  - Muñeca `d016` en «Vestir» y «Mi Mundo», con parpadeo. Combinaciones: ropa (vestido / camiseta) × corona.
  - A tamaño real coincide con el montaje aprobado (≤ 3).
  - Datos propios: `d016:` en localStorage y `d016-` en IndexedDB; sin service worker.
  - La muñeca anterior sigue disponible.
  - Las piezas antiguas no encajan: silueta de la base V2.1 al 68 % y de la técnica al 57 %.
- **Datos guardados afectados:** ninguno. No se leen, cambian ni migran las partidas. Juego, catálogo, `sw.js`, `main`
  y el guardado del juego sin cambios.
- **Pruebas:**
  - `prueba-aislada.js`: 13/13.
  - `pruebas/prueba-juego.js`: 21/21.
  - `pruebas/prueba-copia.js`: 45/45.
  - Comprobador de documentación.
  - Sin probar en el iPhone/iPad reales ni en Safari.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit (solo quita la carpeta de la prueba y la documentación).

### 2026-10-15 — `7e43c17` · D-018 actualizada: corona y conjunto completo aprobados visualmente

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `17f4473`, el de la entrada siguiente).
- **Estado:** el encaje de la corona y el conjunto completo están aprobados visualmente. La resolución 2000 × 3500 y la
  integración siguen pendientes. Nada activado ni publicado.
- **Cambios:**
  - D-018 actualizada.
  - El visor abre con «Corona dorada (elegida)»; se conserva «Sin corona».
  - Documentación: `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md` y los `LEEME.md` de la corona, del visor y de `propuestas/`.
  - Ninguna imagen cambia.
- **Datos guardados afectados:** ninguno. Juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - Visor en Chromium con pantalla de iPhone simulada: abre con el conjunto completo; sin errores ni almacenamiento;
    coincide con `montaje-corona.png` en lo opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `17f4473` · D-018: corona dorada (diseño aprobado) y capa candidata en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `883ff8c`, el de la entrada siguiente).
- **Estado:** diseño aprobado; el encaje está pendiente de revisión. Nada activado ni publicado.
- **Cambios:**
  - `docs/propuestas/corona-2026-10-15/`: la referencia, sin modificar, y `montaje/corona.py`, que genera la capa de la
    corona, los montajes, las vistas y `comprobaciones.json`.
  - Visor: opción «Corona» y encuadre «Corona».
  - D-018 en `DECISIONES.md`.
  - Documentación: `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md` y los `LEEME.md` correspondientes.
- **Resultado:**
  - Solo la corona (17 828 px), con 4 065 px de huecos transparentes entre los adornos.
  - Sin mover ni escalar; la diadema apoya por completo sobre nuestro pelo.
  - La muñeca no cambia fuera de la corona.
- **Datos guardados afectados:** ninguno. Base, conjunto, juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes y comprobaciones del JSON.
  - Revisión ×2 sobre fondo claro, oscuro y a cuadros.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores ni almacenamiento; coincide con el montaje en lo
    opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `883ff8c` · D-017 actualizada: zapatos aprobados visualmente y por defecto en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `69585cd`, el de la entrada siguiente).
- **Estado:** encaje aprobado visualmente. La resolución 2000 × 3500 sigue pendiente. Nada activado ni publicado.
- **Cambios:**
  - D-017 actualizada.
  - El visor abre con «Zapatos rosa (elegidos)»; se conserva «Descalza (D-016)».
  - Documentación: `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md` y los `LEEME.md` de los zapatos, del visor y de
    `propuestas/`.
  - Ninguna imagen cambia.
- **Datos guardados afectados:** ninguno. Juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - Visor en Chromium con pantalla de iPhone simulada: abre con los zapatos; sin errores ni almacenamiento; coincide
    con `montaje-zapatos.png` en lo opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `69585cd` · D-017: zapatos rosa (diseño aprobado) y capa candidata en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `77c8368`, el de la entrada siguiente).
- **Estado:** diseño aprobado; el encaje está pendiente de aprobación. Nada activado ni publicado.
- **Cambios:**
  - `docs/propuestas/zapatos-rosa-2026-10-15/`: la referencia, sin modificar, y `montaje/zapatos.py`, que genera los
    zapatos sin ajustar, la capa colocada, los montajes, las vistas y `comprobaciones.json`.
  - Visor: opción «Zapatos» y encuadre «Pies»; la escena tiene ahora un alto fijo.
  - D-017 en `DECISIONES.md`.
  - Documentación: `ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md` y los `LEEME.md` correspondientes.
- **Resultado:**
  - Solo el zapato, sin piel de la imagen generada.
  - Izquierdo (0, 0) y derecho (+2, 0), sin escala: 0 px de pie fuera del zapato.
  - La muñeca no cambia fuera de los zapatos.
- **Datos guardados afectados:** ninguno. Base, conjunto D-016, juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes y comprobaciones del JSON.
  - Revisión ×2.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores ni almacenamiento; coincide con el montaje en lo
    opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `77c8368` · D-016: conjunto con vestido rosa elegido y por defecto en el visor

- **Solicitado por:** la propietaria (aprobación visual de la opción B + axilas y del pelo «mechones completos»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `50be4a9`, el de la entrada siguiente).
- **Estado:** aprobación visual registrada. La resolución 2000 × 3500 sigue pendiente. Nada activado ni publicado.
- **Cambios:**
  - D-016 en `DECISIONES.md`.
  - El visor abre por defecto con el conjunto elegido; las demás opciones se conservan.
  - Notas en los `LEEME.md` de la opción B, de los mechones completos, del visor y de `propuestas/`.
  - Documentación: `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
  - Ninguna imagen cambia.
- **Datos guardados afectados:** ninguno. Juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - Visor en Chromium con pantalla de iPhone simulada: abre con el vestido elegido, los brazos y los mechones
    completos; sin errores ni almacenamiento; coincide con el montaje en lo opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `50be4a9` · Pelo B: alternativa con los mechones completos de los hombros tomados de ChatGPT

- **Solicitado por:** la propietaria (los parches pequeños cortaban rizos dibujados de otra forma).
- **Rama y commit:** `avatar-creador`, este commit (sobre `b9cad69`, el de la entrada siguiente).
- **Estado:** alternativa pendiente de revisión; C intacta; nada activado ni publicado.
- **Cambios:**
  - `redistribucion-hombros/mechones-completos-chatgpt/mechones_completos.py` → capa de delante, zona tomada,
    montajes, antes/después, `comprobaciones.json` y `LEEME.md`.
  - Opción «Mechones completos (alternativa)» en el visor.
  - Documentación: `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
- **Resultado:**
  - 44 887 px de pelo de ChatGPT.
  - Costura por sombras entre rizos (luminosidad 30; diferencia con C, 5) con 3 px de fundido.
  - Fuera de la zona idéntica a C; silueta exterior igual; 0 px sobre la cara; 0 px de piel o tela tomados.
- **Datos guardados afectados:** ninguno. C, pelo B, vestido, base, ojos, juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes y comprobaciones del JSON.
  - Revisión ×2 de los hombros.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores ni almacenamiento; coincide con el montaje en lo
    opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `b9cad69` · Pelo B: relleno 1 de ChatGPT de los mechones integrado en una copia (no encaja todavía)

- **Solicitado por:** la propietaria (integrar solo las zonas de la máscara; señalar si se queda corta).
- **Rama y commit:** `avatar-creador`, este commit (sobre `ef587b8`, el de la entrada siguiente).
- **Estado:** prueba; no aprobada; nada activado ni publicado.
- **Cambios:**
  - `para-chatgpt-mechones/resultado-chatgpt-mechones-1.png` (sin modificar) e `integrar_mechones.py`.
  - `pelo-delante-mechones-c-chatgpt-1.png`, `revision-mechones-chatgpt-1.png` / `.json` y
    `mascara-mechones-chatgpt-1-fuera-de-la-mascara.png`.
  - Opción «C + ChatGPT 1 (prueba)» en el visor.
  - Documentación: `LEEME.md` de la propuesta y del visor, y `ESTADO_ACTUAL.md`.
- **Resultado:**
  - Alineación correcta (0, 0).
  - Las uniones no siguen el rizo (diferencia de color 98 y 91 en el borde): quedan parches con costura.
  - La máscara se queda corta: 2 585 px de pelo de ChatGPT fuera de ella, en 5 zonas; marcados, sin ampliar.
- **Datos guardados afectados:** ninguno. C, pelo B, vestido, base, ojos, juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - Copia idéntica fuera de la máscara.
  - Alineación global y local.
  - Diferencia de color en las uniones.
  - Revisión ×3.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores ni almacenamiento.
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `ef587b8` · Pelo B: propuesta C, mechones continuos por delante de cada hombro

- **Solicitado por:** la propietaria (B no aprobada: deja una muesca alrededor de cada manga).
- **Rama y commit:** `avatar-creador`, este commit (sobre `4979496`, el de la entrada siguiente).
- **Estado:** propuesta; nada activado ni publicado.
- **Cambios:**
  - `redistribucion-hombros/mechones_hombros.py` → capa de delante C, montajes, comparación, ampliaciones, mapa,
    máscara de falta pelo, `para-chatgpt-mechones/` y `comprobaciones-mechones.json`.
  - Opción «Hombros · C (mechones)» en el visor.
  - Documentación: `LEEME.md` de la propuesta y del visor, `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
- **Resultado:**
  - Cadena de 8 rizos enteros por lado, desde la melena hasta el pecho; 16 316 px pasan delante.
  - Mangas tapadas: la izquierda pasa del 43 % al 62 % y la derecha, del 29 % al 44 %.
  - Falta pelo original en lo alto de cada manga (916 px, pelo reconstruido): marcado para ChatGPT.
- **Datos guardados afectados:** ninguno. Pelo B, propuesta B, vestido, base, ojos, juego, catálogo, `sw.js` y `main`
  sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes y propuesta B intacta.
  - Colores idénticos; 0 px de pelo reconstruido delante y 0 px sobre la cara.
  - Revisión ×2 y ×4.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores ni almacenamiento; coincide con el montaje en lo
    opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `4979496` · Pelo B: redistribución delante/detrás en hombros y pecho (propuestas A y B)

- **Solicitado por:** la propietaria («el pelo parece pegado encima del vestido»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `afbfc71`, el de la entrada siguiente).
- **Estado:** propuesta, pendiente de aprobación; nada activado ni publicado.
- **Cambios:**
  - `…/variante-experimental/redistribucion-hombros/redistribuir_pelo.py` → capas de delante A y B, montajes,
    comparación, ampliaciones, mapa, máscara de falta pelo (A), `comprobaciones.json` y `LEEME.md`.
  - Opción «Pelo» en el visor.
  - Documentación: `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
- **Resultado:**
  - Los rizos se separan por sus sombras: 119 en la zona.
  - A: 53 rizos pasan enteros delante (36 769 px); falta pelo junto al escote (2 157 px).
  - B: A, y además 6 rizos de sombra de corte junto al escote pasan detrás (4 604 px); no falta pelo.
  - Colores idénticos; capa de detrás sin cambios; 0 px sobre la cara.
- **Datos guardados afectados:** ninguno. Pelo B, vestido, base, ojos, juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes y comprobaciones del JSON.
  - Revisión ×2 de los hombros con el vestido y con la camiseta.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores ni almacenamiento; coincide con el montaje en lo
    opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `afbfc71` · Vestido rosa: axilas completadas por edición de píxeles (candidata)

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `8e9f71e`, el de la entrada siguiente).
- **Estado:** candidata en el visor, **pendiente de aprobación**; nada activado ni publicado.
- **Cambios:**
  - `opcion-b/completar_axilas.py` → `vestido-opcion-b-axilas-completadas.png`, montajes, comparación, vista y
    `comprobaciones-axilas-completadas.json`.
  - Opción «Opción B + axilas (candidata)» en el visor.
  - Documentación: `LEEME.md` de la opción B y del visor, D-015, `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
- **Resultado:**
  - Textura copiada de la tela contigua: (+19, −2) en la izquierda y (−41, +4) en la derecha. Transición armónica.
  - Tela opaca, con 1 px de borde suave hacia fuera.
  - Fuera de la máscara, idéntica a la opción B; 0 px de blanco y 0 px de camiseta visible (> 10 %).
- **Datos guardados afectados:** ninguno. Base, opción B, original, juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes.
  - Comparación píxel a píxel fuera de la máscara.
  - Recuento de blanco y de camiseta visible.
  - Revisión ×3 sobre fondo oscuro, claro y sobre la muñeca.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores ni almacenamiento; coincide con el montaje en lo
    opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `8e9f71e` · Vestido rosa: primer relleno de las axilas con ChatGPT (no encaja)

- **Solicitado por:** la propietaria (integrar solo la zona de la máscara si encaja).
- **Rama y commit:** `avatar-creador`, este commit (sobre `d1c6ac8`, el de la entrada siguiente).
- **Estado:** **no encaja**: no se integra ni se añade al visor. Nada activado ni publicado.
- **Cambios:**
  - `opcion-b/para-chatgpt/resultado-chatgpt-axilas-1.png` (imagen de ChatGPT, sin modificar).
  - `revision-axilas-chatgpt.png` y `.json`.
  - `integrar_relleno.py` comprueba la alineación y el blanco del fondo en la zona; si algo falla, no escribe la
    candidata.
  - Documentación: `LEEME.md` de la opción B, D-015 y `ESTADO_ACTUAL.md`.
- **Resultado:**
  - Alineación exacta (0, 0; correlación 0,980).
  - 381 de 1 207 px de la zona son blanco del fondo: falta tela junto al cuerpo a la altura del lazo.
  - El vestido opción B, la base y todo lo demás quedan igual.
- **Datos guardados afectados:** ninguno. Juego, catálogo, visor, `sw.js` y `main` sin cambios.
- **Pruebas:** alineación por correlación de bordes (global y por axila), recuento de blanco en la zona, revisión visual
  ×2,5 y comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `d1c6ac8` · Vestido rosa: opción B (copia limpia), máscara de las axilas y paquete para ChatGPT

- **Solicitado por:** la propietaria (opción B; sin opción C; axilas con la herramienta de imagen de ChatGPT).
- **Rama y commit:** `avatar-creador`, este commit (sobre `f76b76a`, el de la entrada siguiente).
- **Estado:** propuesta; nada activado ni publicado. Base, original del vestido y referencia sin modificar.
- **Cambios:**
  - `opcion-b/vestido_opcion_b.py` → `vestido-opcion-b.png` (solo alfa), montajes, comparaciones, detalle de bordes y
    tul, puntos quitados, `mascara-falta-tela.png`, ampliaciones de axilas y hombros y `comprobaciones.json`.
  - `opcion-b/para-chatgpt/`: recorte 2:3, máscara, guía e `integrar_relleno.py`.
  - Opción «Vestido limpio · opción B» en el visor.
  - En `montaje/` se corrige el diagnóstico de los hombros (texto de `donde-falla.png` y `comprobaciones.json`).
  - Documentación: D-015, `LEEME.md` del vestido, de la opción B y del visor, `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
- **Resultado:**
  - Quitados 241 puntos sueltos (519 px) y la neblina de alfa < 4.
  - Interior opaco: 407 007 px con alfa 255 (antes, 94). Bordes y tul: como mucho +1 de alfa. Colores idénticos.
  - La camiseta solo se vería en las axilas (730 px); la máscara de las axilas tiene 1 207 px.
  - En los hombros no falta tela: el corte es el borde del pelo de delante.
- **Datos guardados afectados:** ninguno. Juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes.
  - Colores idénticos y alfa del tul conservado.
  - Integración con un relleno simulado: 0 px cambiados fuera de la máscara.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores ni almacenamiento; coincide con el montaje en lo
    opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `f76b76a` · Vestido rosa: prueba de encaje de la capa candidata y opción en el visor

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `9d25114`, el de la entrada siguiente).
- **Estado:** prueba. Diseño aprobado (D-015); **capa sin aprobación técnica**. Nada activado ni publicado.
- **Cambios:**
  - `vestido-rosa-2026-10-15/vestido-candidato-original.png` (sin modificar).
  - `montaje/montaje_vestido.py` → antebrazos y manos copiados de la base, montajes abiertos y cerrados, vistas,
    `donde-falla.png`, GIF y `comprobaciones.json`.
  - Opción «Vestido rosa (prueba)» y encuadre «Vestido» en el visor.
  - Documentación: `LEEME.md` del vestido y del visor, D-015, `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
- **Resultado:**
  - Colocado tal cual. Cuello, mangas, cintura y bajo bien; no asoman las mallas; manos y pelo de delante por delante.
  - Fallan: la camiseta asoma en las axilas (731 px); la capa está cortada en los hombros donde la referencia tenía pelo
    (filo claro punteado y sombra con borde recto); hay 241 manchitas sueltas (519 px). El alfa es ≈ 253.
  - No se ha recortado ni deformado nada.
- **Datos guardados afectados:** ninguno. Base, ojos, pelo, juego, catálogo, `sw.js` y `main` sin cambios.
- **Pruebas:**
  - SHA-256 de todas las fuentes antes y después.
  - Cálculo de la ropa de la base que queda visible.
  - Revisión visual por zonas sobre fondo claro y oscuro.
  - Visor en Chromium con pantalla de iPhone simulada: sin errores, sin almacenamiento ni service worker; coincide con
    el montaje en lo opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `9d25114` · Vestido rosa de princesa: diseño aprobado (D-015) y referencia guardada

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `a884208`, el de la entrada siguiente).
- **Estado:** el **diseño** está aprobado (D-015). La capa del vestido solo **no ha llegado**: el montaje de prueba y la
  opción en el visor quedan pendientes de recibirla.
- **Cambios:** `docs/propuestas/vestido-rosa-2026-10-15/` con `referencia-muneca-vestida.png` (sin modificar) y
  `LEEME.md`; D-015 en `DECISIONES.md`; `propuestas/LEEME.md`, `ESTADO_ACTUAL.md` y `AVATAR_Y_ASSETS.md`.
- **Datos guardados afectados:** ninguno. Base, ojos, pelo, visor, juego, catálogo y `main` sin cambios.
- **Pruebas:** SHA-256 de la referencia y comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `a884208` · Visor aislado de la muñeca (base D-014, pelo B, parpadeo)

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `0e22146`, el de la entrada siguiente).
- **Estado:** propuesta de revisión; no es el juego ni se publica.
- **Cambios:** `docs/propuestas/base-aprobada-d013-2026-10-14/visor/index.html` y su `LEEME.md`. Página aislada que
  apila las imágenes existentes (pelo B detrás, base sin ojos v3, ojos abiertos v3 color experimental / cerrados V2.1,
  pelo B delante) con parpadeo, encuadres de la cara, zoom, fondos y capas. Ninguna imagen cambia.
- **Datos guardados afectados:** ninguno. No usa almacenamiento ni cookies, no registra service worker y no lee
  partidas. `sw.js`, juego y catálogo sin cambios.
- **Pruebas:**
  - Chromium con pantalla de iPhone simulada: sin errores en la consola; solo pide la página y las cinco imágenes;
    almacenamiento vacío y ningún service worker.
  - El parpadeo cambia de capa y vuelve a los 200 ms.
  - A tamaño real coincide con `montaje-variante-sin-mechon-abiertos.png` en lo opaco (≤ 2).
  - Comprobador de documentación.
  - Falta probarlo en el iPhone/iPad reales.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `0e22146` · Pelo D-012 sobre D-014: elegida la variante B

- **Solicitado por:** la propietaria («La b»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `450c13c`, el de la entrada siguiente).
- **Estado:** B (bordes rosados corregidos y sin el mechón suelto) pasa a ser la candidata preferida del borrador de pelo.
  No es la aprobación final del conjunto; nada activado ni publicado.
- **Cambios:** solo documentación (`ESTADO_ACTUAL.md`, `AVATAR_Y_ASSETS.md`, `LEEME.md` de la variante). Ninguna imagen cambia.
- **Datos guardados afectados:** ninguno.
- **Pruebas:** comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `450c13c` · Pelo D-012 sobre D-014: variante experimental de bordes rosados y sin mechón suelto

- **Solicitado por:** la propietaria (la revisión localizada se conserva como punto de partida; no rellenar los huecos).
- **Rama y commit:** `avatar-creador`, este commit (sobre `c20261d`, el de la entrada siguiente).
- **Estado:** propuesta experimental; nada activado ni publicado.
- **Cambios:** `revision-localizada/variante-experimental/variante.py` → capas A (bordes corregidos) y B (A sin el
  mechón suelto), máscaras del cambio de color y del mechón, comparaciones sobre fondo claro, oscuro y sobre la muñeca,
  vista de máscaras, vista del conjunto, montajes, `comprobaciones.json` y `LEEME.md`.
- **Resultado:** A cambia el color de 5 752 píxeles de borde en las zonas rojas (alfa idéntico): el filo coral pasa a
  castaño; el borde más externo conserva algo de tono cálido. B quita solo el mechón (2 454 px); el borde del rizo
  vecino se conserva.
- **Datos guardados afectados:** ninguno. Revisión, cuello reconstruido, resto de la melena, base, ojos, catálogo,
  juego y `main` sin cambios.
- **Pruebas:** SHA-256 de las fuentes; alfa idéntico en A; color solo dentro de la máscara y de las zonas rojas; B solo
  cambia el mechón; montaje igual fuera de los cambios; revisión visual ×2 sobre tres fondos; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `c20261d` · Pelo D-012 sobre D-014: revisión localizada (borrador)

- **Solicitado por:** la propietaria (el montaje anterior se conserva como referencia del encaje; ojos sin retocar).
- **Rama y commit:** `avatar-creador`, este commit (sobre `c9852fd`, el de la entrada siguiente).
- **Estado:** borrador; nada activado ni publicado. Sin reescalar la melena ni cambiar la base.
- **Cambios:** `pelo-borrador-d012/revision-localizada/revision_pelo.py` → `pelo-revisado-detras.png`,
  `pelo-revisado-delante.png`, montajes abiertos y cerrados, `vista-capas-oscuro.png` (antes/después de cada capa),
  vistas grandes de cada capa sobre fondo oscuro, `vista-montaje-revisado.png`, `vista-mechon-brazo.png`,
  `zonas-revisadas.png`, `mascara-zonas-reconstruidas.png`, `zonas-pendientes.png`, dos GIF de parpadeo,
  `comprobaciones.json` y `LEEME.md`. El borrador anterior no se modifica.
- **Resultado:**
  - Limpieza por zonas, solo de opacidad. Se han quitado de la referencia: la cara, las orejas, las pestañas y el cuello
    que había detrás de la cabeza, la franja del contorno, los trazos finos de sus cejas y la manga rosa entre los rizos.
  - La capa de delante del borrador anterior pintaba orejas, contorno de cara y cuello de la referencia encima de la
    base; ya no.
  - Huecos junto al cuello y bajo las orejas: reconstruidos con 78 trozos pequeños copiados de la propia melena
    (traslado sin escala ni giro), detrás del pelo y con sombra junto a la cabeza. Están marcados como reconstruidos.
  - El mechón del brazo acaba en punta.
  - Pendiente: el interior de los rizos sobre los dos brazos (deja ver el brazo y conserva un filo rojizo).
- **Datos guardados afectados:** ninguno. Base, referencia, borrador anterior, catálogo, `plantilla/`, juego y `main`
  sin cambios.
- **Pruebas:**
  - SHA-256 de las fuentes antes y después.
  - Cara, orejas y cuello de la base sin nada encima.
  - Colores del pelo sin cambiar (solo opacidad).
  - Revisión visual a ~600/220 px, ×1,5, ×2 y capas sobre fondo oscuro.
  - Comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `c9852fd` · Base D-014: borrador de montaje con el pelo de D-012

- **Solicitado por:** la propietaria (ojos cerrados V2.1 como candidata preferida, sin retocar).
- **Rama y commit:** `avatar-creador`, este commit (sobre `46d21a7`, el de la entrada siguiente).
- **Estado:** borrador de revisión; no hay capas de pelo para esta base. Nada activado ni publicado.
- **Cambios:** `pelo-borrador-d012/montaje_pelo.py` → máscara del pelo en la referencia, pelo colocado (detrás y
  delante), montajes abiertos y cerrados, vistas, dos GIF de parpadeo, `comprobaciones.json`, `LEEME.md`.
- **Resultado:** escala uniforme 1,0934 alineada por los ojos, sin deformar; la base queda idéntica donde no hay pelo
  delante. Defectos: huecos junto al cuello y bajo las orejas, restos de la referencia en la capa (ocultos en el
  montaje), ampliación del 9 %, separación delante/detrás aproximada.
- **Datos guardados afectados:** ninguno. Referencia D-012, base, catálogo, `plantilla/`, juego y `main` sin cambios.
- **Pruebas:** SHA-256 de la referencia antes y después; comprobación de la base intacta; revisión visual a ~480/220 px
  y ×1,5, y del pelo solo; animaciones; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `46d21a7` · Base D-014: variante de ojos cerrados con la ilustración V2.1 reutilizada

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `0c0a9fa`, el de la entrada siguiente).
- **Estado:** prueba; nada activado ni publicado.
- **Cambios:** `ojos-cerrados/cerrados_v21.py` → `capa-ojos-cerrados-prueba-v21.png` (párpado de cobertura +
  cada ojo cerrado V2.1 a escala uniforme 0,361/0,366, colocado por el centro de la abertura), estado cerrado,
  vistas, cobertura, dos GIF de parpadeo y `comprobaciones-v21.json`. `arte/originales/ojos-cerrados-clara.png`
  y el prototipo anterior, sin cambios.
- **Resultado:** tapa el 100 % (18 573 px); encaja mejor que la prueba anterior; pestañas más finas que las de
  los ojos abiertos nuevos y párpado liso.
- **Datos guardados afectados:** ninguno. Catálogo, `plantilla/`, juego, carita y originales sin cambios.
- **Pruebas:** SHA-256 de la fuente antes y después, cobertura, revisión visual a ~480/220 px y ×2, animaciones;
  comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `0c0a9fa` · Base D-014: ojos cerrados de prueba y parpadeo

- **Solicitado por:** la propietaria (candidata abierta: v3 color experimental).
- **Rama y commit:** `avatar-creador`, este commit (sobre `d0c19a6`, el de la entrada siguiente).
- **Estado:** prueba; nada activado ni publicado. La base sin ojos no se retoca.
- **Cambios:** `ojos-cerrados/cerrados.py` → `capa-ojos-cerrados-prueba.png` (párpado de piel interpolada desde
  la piel original + línea de pestañas superiores en espejo, acortadas), `zona-que-tapan.png`, estados abiertos
  y cerrados, `vista-estados.png`, `vista-cobertura.png`, dos GIF de parpadeo, `comprobaciones.json`, `LEEME.md`.
- **Resultado:** tapa el 100 % del parche, el pliegue y las raíces (18 573 px); cambio instantáneo de capa sin
  mezcla de opacidad. A tamaño de juego se lee bien; ampliado no es del todo natural (línea fina y entrecortada,
  párpado liso): se avisa antes de seguir.
- **Datos guardados afectados:** ninguno. Catálogo, `plantilla/`, juego y originales sin cambios.
- **Pruebas:** comprobaciones del JSON, coincidencia con el prototipo revisado, revisión visual a ~480/220 px y ×2,
  animaciones; hashes de la base sin cambios; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `d0c19a6` · Ojos de la base D-014: máscara v3, variante de color experimental y montaje v3

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `6396e20`, el de la entrada siguiente).
- **Estado:** propuesta para elegir montaje; nada activado ni publicado.
- **Cambios:**
  - `ojos-abiertos/mascara_v3.py` → `mascara-ojos-propuesta-v3.png` (v2 + borde rosado del párpado y lagrimal
    + pestañas que faltaban; solo máscara).
  - `sin-ojos/montaje_v3.py` → `base-sin-ojos-propuesta-v3.png`, `zona-relleno-v3.png`, capas
    `capa-ojos-abiertos-prueba-v3.png` (sin corregir) y `capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png`
    (color y opacidad ESTIMADOS en 2 800 píxeles de borde, marcados en `pixeles-color-estimado-v3.png`),
    vistas ampliadas, a tamaño de juego, del relleno y de los restos, y `comprobaciones-v3.json`.
  - Se conservan la extracción sin corregir (v2 y v3), las máscaras v1–v3, la base sin ojos v2 y la base
    aprobada sin cambios.
- **Resultados:** montaje v3 sin corregir 3 810 px distintos (máx. 135); con color experimental 3 092 px pero solo
  106 > 24 (máx. 51). Iris, blancos, brillos y píxeles opacos idénticos en ambas capas. Quedan el pliegue y
  pequeños mechones de pestaña sobre él; el relleno liso se nota sin ojos.
- **Datos guardados afectados:** ninguno. Catálogo, `plantilla/`, juego y originales aprobados sin cambios.
- **Pruebas:** comprobaciones del JSON; coincidencia con el prototipo revisado; revisión visual ×3, ×6 y a tamaño
  de juego; hashes de la base sin cambios; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `6396e20` · Base D-014: capa de prueba de los ojos, base sin ojos y comprobación del montaje

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `1640c7b`, el de la entrada siguiente).
- **Estado:** propuesta en revisión; nada activado ni publicado.
- **Cambios:**
  - `ojos-abiertos/extraer.py` → `capa-ojos-abiertos-prueba.png` (colores originales, opacidad = máscara v2,
    948 × 1659 en su sitio) y `comprobaciones-capa.json`. `mascara.py` expone la zona del pliegue (sus
    salidas no cambian). Máscaras v1 y v2 conservadas.
  - `sin-ojos/`: `relleno.py`, `base-sin-ojos-propuesta.png` (copia; relleno armónico de piel solo en la zona
    de los ojos, 15 976 px; 0 píxeles cambiados fuera), `zona-relleno.png`, `capa-referencia-B.png`,
    vistas a tamaño de juego y ×3, `comprobaciones.json`, `LEEME.md`.
- **Resultado del montaje:** A (capa v2 sobre la base sin ojos) difiere del original en 4 024 px (puntas de
  pestañas más claras, falta el borde rosado del párpado inferior y del lagrimal); B (mismos colores con
  opacidad completa en la zona) es idéntico. Lo que falta en A es de la máscara; las puntas exactas y sin
  halo exigirían cambiar colores (no hecho).
- **Datos guardados afectados:** ninguno. Base original, catálogo, `plantilla/` y juego sin cambios.
- **Pruebas:** comprobaciones de la capa (colores idénticos, opacidad = máscara), de la base sin ojos (cambios
  solo en la zona) y del montaje (A y B); revisión visual a tamaño de juego y ×3; hashes de la base sin
  cambios; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-15 — `1640c7b` · Ojos abiertos de la base D-014: máscara propuesta, versión 2

- **Solicitado por:** la propietaria (correcciones a la v1 antes de extraer).
- **Rama y commit:** `avatar-creador`, este commit (sobre `73ca84d`, el de la entrada siguiente).
- **Estado:** propuesta en revisión; nada extraído, base sin tocar.
- **Cambios:** `ojos-abiertos/mascara.py` v2 → `mascara-ojos-propuesta-v2.png`, `vista-v2-ampliada.png`,
  `vista-v2-tamano-juego.png`, `vista-v2-sobre-base.png`, `comprobaciones-v2.json`; los archivos de la v1
  se conservan con el sufijo `-v1`. Pliegue fuera (también el tramo central), piel entre pestañas fuera
  (opacidad por luminancia), rampa de 3 px junto al lagrimal sin recortar el párpado, trazo del párpado
  del lagrimal derecho conservado y residuos de selección eliminados (5 píxeles).
- **Resultado:** 13 038 píxeles (v1: 14 928); abertura (iris, blancos, brillos, 8 672 px) idéntica y
  opaca; la capa sobre la base reproduce la base (diferencia 0). Bordes mezclados con piel: 1 077 px,
  solo resolubles cambiando colores (no hecho).
- **Datos guardados afectados:** ninguno. Sin cambios en la base, catálogo, `plantilla/` ni juego.
- **Pruebas:** revisión visual ×4 y a tamaño de juego (fondos claro, oscuro y base); comprobaciones del JSON;
  la máscara del programa coincide con la revisada; hashes de la base sin cambios; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit (la v1 vuelve a sus nombres).

### 2026-10-15 — `73ca84d` · Base D-014: máscara propuesta de los ojos abiertos; guía con estimaciones sin validar

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `85d6805`, el de la entrada siguiente).
- **Estado:** propuesta en revisión (guardada para no perder el trabajo); nada extraído.
- **Cambios:**
  - `medidas/`: «bajo de camiseta» (prenda, automática) separado de la «cintura anatómica» (estimada,
    y = 945); hombros, codos, rodillas y cintura anatómica marcados `validada: false`, pendientes de
    comprobar al separar o animar. Guía y vistas regeneradas. La base no se mueve ni deforma.
  - `ojos-abiertos/`: `mascara.py` (reproducible), `mascara-ojos-propuesta.png` (948 × 1659, grises),
    vistas sobre la base y ampliadas, `LEEME.md` con los puntos a revisar (pliegue fuera, final de
    pestañas junto al lagrimal, halo de piel en puntas, píxeles sueltos).
- **Datos guardados afectados:** ninguno. Sin cambios en la base, `plantilla/`, catálogo ni juego.
- **Pruebas:** revisión visual (×4, fondos claro y oscuro); la máscara del programa coincide con la
  revisada; hashes de las dos bases sin cambios; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-14 — `85d6805` · Medidas y guía provisionales de la base D-014

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `931f02f`, el de la entrada siguiente).
- **Estado:** en revisión visual de la propietaria (guardado para no perder el trabajo).
- **Cambios:** `docs/propuestas/base-aprobada-d013-2026-10-14/medidas/` con `medir.py` (reproducible,
  solo lee la imagen), `medidas-provisionales.json`, `guia-provisional.png` (capa transparente
  948 × 1659), vistas `guia-sobre-base.png` y `guia-ampliaciones.png` y `LEEME.md`.
  Automáticas: eje (x 479), coronilla, barbilla, ojos (iris), cuello, hombros, axilas, cadera,
  entrepierna, tobillos, suelo y puntas de las manos. Estimadas: articulación de hombros, codos,
  centro de las manos, cintura y rodillas. 3,19 cabezas de alto.
- **Datos guardados afectados:** ninguno. Sin cambios en `plantilla/plantilla.js`, guías V2.1,
  catálogo, imágenes de la base ni juego.
- **Pruebas:** revisión visual de la guía sobre la base y ampliaciones ×3; hashes de las dos bases
  sin cambios; comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-14 — `931f02f` · Copia técnica de la base D-014 con la transparencia corregida

- **Solicitado por:** la propietaria, tras revisar la comparación antes/después.
- **Rama y commit:** `avatar-creador`, este commit (sobre `bc96825`, el de la entrada siguiente).
- **Estado:** copia técnica guardada; no es pieza definitiva. Sin publicar.
- **Cambios:** `docs/propuestas/base-aprobada-d013-2026-10-14/base-transparencia-corregida.png`
  (SHA-256 `42a82a49…4a85`, el mismo archivo revisado), `COMPROBACIONES.txt` y `LEEME.md` con las dos
  versiones diferenciadas; programa `herramientas/corregir_transparencia.py` (corregir, `--comprobar`,
  `--comparar`); comparación en `docs/capturas/2026-10-14-base-transparencia/`. El original
  `base-aprobada.png` no cambia (`f9c143fc…79a6`).
- **Resultado:** solo canal alfa; RGB idéntico; interior a 255 (392 915 px); 12 654 restos (alfa ≤ 7)
  eliminados; borde suave de 10 618 px con cambio máximo de 1; 948 × 1659 sin ampliar.
- **Archivos:** los anteriores, más estado, decisiones (D-014), assets, arquitectura e índice de propuestas.
- **Datos guardados afectados:** ninguno. Sin cambios en el juego, el catálogo, `arte/originales/` ni la caché.
- **Pruebas:** `--comprobar` (coincidencia píxel a píxel), SHA-256 del original y de la copia
  (también descargados de GitHub tras subir); comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit; el original no se ve afectado.

### 2026-10-14 — `bc96825` · D-014: base visual de la muñeca nueva aprobada

- **Solicitado por:** la propietaria («base visual aprobada conforme a D-013»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `0714cae`, el de la entrada siguiente).
- **Estado:** apariencia aprobada; resolución y capas pendientes. Sin publicar.
- **Cambios:** se conserva sin modificar `docs/propuestas/base-aprobada-d013-2026-10-14/base-aprobada.png`
  (948 × 1659, RGBA, SHA-256 `f9c143fc56fcc48d231286b72f94b8ee90bd94c669a9d1568a9d5616f4e179a6`) con su
  `LEEME.md`; D-014; avisos en estado, assets, norma visual e índice de propuestas.
- **Revisión técnica del archivo:** cumple D-013 en apariencia; opacidad del cuerpo 240–254 (no 100 %),
  ~16 500 píxeles casi invisibles y contenido en el borde izquierdo; capas sin separar.
- **Datos guardados afectados:** ninguno. Sin cambios de código, caché, catálogo ni `arte/originales/`.
- **Pruebas:** dimensiones, canal alfa y SHA-256 (también tras la subida); comprobador de documentación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit.

### 2026-10-14 — `0714cae` · D-013: norma visual permanente de la muñeca

- **Solicitado por:** la propietaria.
- **Rama y commit:** `avatar-creador`, este commit (sobre `6e4aa8c`, el de la entrada siguiente).
- **Estado:** decisión acordada; solo documentación.
- **Cambios:** nuevo `docs/NORMA_VISUAL_MUNECA.md` (proporciones de nenita de unos 5–6 años, cara
  de D-012, las piezas se adaptan a la muñeca, lista de revisión); D-013 en decisiones; enlace y
  norma en `CLAUDE.md`; avisos en estado y assets. Se conservan la V2.1 y la referencia de D-012.
- **Archivos:** `docs/NORMA_VISUAL_MUNECA.md`, `CLAUDE.md`, `README.md`, `docs/DECISIONES.md`,
  `docs/ESTADO_ACTUAL.md`, `docs/AVATAR_Y_ASSETS.md`, `docs/REGISTRO_CAMBIOS.md`.
- **Datos guardados afectados:** ninguno. Sin cambios de código, caché, catálogo ni imágenes.
- **Pruebas:** comprobador de documentación; revisión del diff. El borrador de cuerpo más compacto
  no se ha incorporado (no está en el repositorio).
- **Pendiente:** capas y medidas de la nueva muñeca, revisadas con la norma.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit (solo documentación).

### 2026-10-14 — `6e4aa8c` · Nueva referencia visual de la muñeca elegida por la propietaria

- **Solicitado por:** la propietaria, tras revisar propuestas: «Sí esta me encanta».
- **Rama y commit:** `avatar-creador`, este commit (sobre `2dc61c7`). Preparado en ChatGPT como
  commit local `ad48898`, que **nunca se subió** (no existe en GitHub); Claude lo incorporó desde el
  parche del paquete «AMAIA_REFERENCIA_Y_CONTINUACION_CLAUDE» tras `git apply --check` (sin
  conflictos, 0 líneas borradas) y comprobar el SHA-256 de la imagen.
- **Estado:** referencia estética aprobada; capas e integración pendientes.
- **Cambios:** se conserva sin modificar el PNG de cuerpo entero de 948 × 1659; D-012 registra
  la carita, ojos algo más separados, pelo y proporciones elegidos. Se documentan los montajes
  rechazados, la limitación de resolución y la necesidad de nuevas medidas si cambia la base.
  Se anota el resultado de recuperación en iPhone comunicado por la propietaria y la ausencia
  de prioridad de sincronización. Ojos verdes mencionados, no localizados en esta rama.
- **Archivos:** `docs/propuestas/muneca-elegida-2026-10-14/`, estado, decisiones, avatar y registro.
- **Datos guardados afectados:** ninguno; no se modifica código ni arte del catálogo.
- **Pruebas:** dimensiones y SHA-256 de la referencia; revisión del diff y comprobador de
  documentación. Las suites de navegador no se repiten para este cambio documental.
- **Pendiente:** transparencia, identidad del montaje, capas, resolución, animaciones y revisión.
- **¿`main` intacta?:** sí, `4bbf51d` comprobado con `git ls-remote` antes del cambio.
- **Cómo revertir:** revertir este commit documental; la V2.1 no se ha sustituido.

**Norma:** cada cambio de código o arte va acompañado, en el mismo commit, de una entrada aquí
(`### AAAA-MM-DD — título`) y de la actualización de `docs/ESTADO_ACTUAL.md`. Lo comprueba
`herramientas/verificar_documentacion.py`. Las entradas más nuevas van arriba. El hash de un commit no
puede ir dentro de él mismo: se escribe «este commit» y se completa en la entrada siguiente.

### 2026-10-14 — Pelo rizado: revisión repetida, sigue pendiente del arte nuevo

- **Solicitado por:** la propietaria (retomar la muñeca premium con el pelo rizado castaño).
- **Rama y commit:** `avatar-creador`, este commit (sobre `82cf814`).
- **Estado:** en espera del arte.
- **Cambios:** solo documentación (estado y `AVATAR_Y_ASSETS.md`). No hay capas de pelo nuevas: la
  única versión recibida es el primer borrador, que vuelve a dar 8 errores en `validar-pelo.html`
  (cortes rectos, nitidez 0,8 / 1,3, restos de piel, 16 islas, tapa pestañas, cabeza sin tapar, relleno
  interior). Preparado fuera del repositorio el paquete «PELO_RIZOS_CASTANOS_PARA_ILUSTRAR.zip».
- **Datos guardados afectados:** ninguno. La muñeca premium no se activa.
- **Pruebas:** validador en Chromium con el borrador.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit (solo documentación).

### 2026-10-14 — `82cf814` · Copia integrada en el juego y versión de pruebas para el iPhone

- **Solicitado por:** la propietaria (aprueba el diseño de los botones; pide una versión de pruebas con
  otro origen y datos separados para probar en su iPhone sin arriesgar el progreso de Amaia).
- **Rama y commit:** `avatar-creador`, este commit (sobre `fabee28`, el de la entrada siguiente).
- **Estado:** en prueba (sin publicar).
- **Cambios:**
  - Integrada la propuesta de `fabee28`: `progreso.js`, botones en ⚙️ Ajustes, `pruebas/prueba-copia.js`.
    Se quita el parche de `docs/propuestas/`.
  - Versión de pruebas: script al principio de `index.html` (`window.MODO_PRUEBAS`, solo en
    `raw.githack.com` / `rawcdn.githack.com` y `localhost?pruebas`) que cambia manifiesto, nombre e
    icono; `manifest-pruebas.json`, `icon-pruebas-192.png`, `icon-pruebas-512.png`; cinta «VERSIÓN DE
    PRUEBAS»; «Cargar datos ficticios» en Ajustes; copias `PRUEBAS-…json` con `version_pruebas`, que el
    juego normal rechaza.
  - Caché `v9` (nuevos archivos en `FILES`).
  - Documentos: nuevo `docs/VERSION_DE_PRUEBAS.md`; `CLAUDE.md`, manual, `README.md`, estado,
    arquitectura, decisiones (D-011), hoja de ruta y recuperación (C2).
- **Archivos:** `index.html`, `progreso.js`, `sw.js`, `manifest-pruebas.json`, `icon-pruebas-*.png`,
  `pruebas/prueba-copia.js`, `docs/…`, `docs/capturas/2026-10-14-copia/` (2 capturas nuevas).
- **Datos guardados afectados:** ninguna clave existente cambia. Nuevas: `bk_ultima` y la base
  `misjuegos-copias`. Los datos ficticios solo pueden cargarse en la versión de pruebas.
- **Pruebas:** Chromium con app instalada y hoja de compartir simuladas: `prueba-copia.js` 45/45
  (incluye identidad de la versión de pruebas, datos ficticios, copias marcadas y rechazo en el juego
  normal) y `prueba-juego.js` 21/21. **No probado en el iPhone real**, y el enlace `raw.githack.com`
  no se ha podido abrir desde el entorno de Claude (red bloqueada).
- **Pendiente:** prueba de la propietaria en la app «PRUEBAS»; después, publicar con aprobación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit; los datos nuevos (`bk_ultima`, `misjuegos-copias`)
  no molestan a versiones anteriores.

### 2026-10-14 — `fabee28` · Propuesta: «Guardar mi progreso» y «Recuperar mi progreso» dentro del juego

- **Solicitado por:** la propietaria (Amaia juega desde la app instalada en el iPhone).
- **Rama y commit:** `avatar-creador`, este commit (sobre `99adb29`).
- **Estado:** en prueba. **El juego no cambia**: el código va como parche en
  `docs/propuestas/copia-integrada.patch` (nuevo `progreso.js`, botones en ⚙️ Ajustes, `pruebas/prueba-copia.js`, caché `v9`) hasta que la propietaria lo apruebe.
- **Cambios:** parche y capturas (`docs/capturas/2026-10-14-copia/`). Documentación corregida: la
  herramienta en Safari y su marcador no llegan a los datos de la app instalada en iOS (`CLAUDE.md`,
  manual, `README.md`, apartados C y C2 de recuperación, arquitectura, hoja de ruta y estado).
- **Datos guardados afectados:** ninguno ahora. Con el parche: clave nueva `bk_ultima` y base nueva
  `misjuegos-copias`; ninguna clave existente cambia.
- **Pruebas:** Chromium con la app instalada y la hoja de compartir simuladas (iPhone 390 × 844, iPhone
  horizontal 852 × 393, iPhone SE 320 × 568, iPad 1180 × 820): `prueba-copia.js` 31/31 (guardar,
  cancelar, recuperar con vista previa, copia automática, deshacer, fallo por falta de espacio,
  archivos no válidos, compatibilidad con la herramienta en los dos sentidos) y `prueba-juego.js` 21/21
  con el parche. El parche se aplica limpio sobre `99adb29` (`git apply --check`).
- **Riesgos y pendiente:** sin probar en un iPhone real con la app instalada; falta la aprobación.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit (solo documentación, parche y capturas).

### 2026-10-14 — Corrección: la etiqueta de la versión publicada queda pendiente

- **Rama y commit:** `avatar-creador`, este commit (sobre `49e062e`, que es el commit de la entrada siguiente).
- **Cambios:** la entrada anterior decía que se había creado la etiqueta `publicado-2026-10-11`, pero GitHub rechazó subirla (403). Corregidos el estado, el registro y el apartado D de recuperación, con instrucciones para crearla desde la web.
- **Pruebas:** `git ls-remote --tags origin` (sin etiquetas). Solo documentación. También se aclara en `ESTADO_ACTUAL.md` que pintar, heladería y pensar no están cubiertos por la prueba automática.
- **¿`main` intacta?:** sí (`4bbf51d`).

### 2026-10-14 — Documentación permanente, copia de seguridad y prueba automática

- **Solicitado por:** la propietaria (paquete «Manual para GitHub»).
- **Rama y commit:** `avatar-creador`, `49e062e` (sobre `b266e52`).
- **Estado:** en la rama, sin publicar.
- **Cambios:**
  - Documentación del paquete incorporada y corregida contra el código: módulos de `main` frente a
    la rama, caché `v8`, `doll` solo se lee, nombres reales de las guías del pelo, estado de cada pieza
    y criterio de activación de la muñeca premium. Dos riesgos nuevos documentados: la galería borra
    dibujos al faltar espacio y la dirección pública está por confirmar.
  - El paquete original se guarda sin cambios en `docs/historico/paquete-manual-2026-10-14/`.
  - Nuevos: `herramientas/copia-de-seguridad.html` (copiar y restaurar datos, con marcador para
    Safari) y `pruebas/prueba-juego.js` (21 comprobaciones).
  - Comprobación de documentación ampliada: entrada fechada obligatoria y versión de la caché.
    Workflow `.github/workflows/verificar-documentacion.yml` y plantilla de pull request.
  - Las capturas que se colaron en la raíz en `8cef5dc` se mueven a `docs/capturas/2026-10-13/`.
  - Punto de recuperación anotado: `4bbf51d` (versión publicada de `main`). La etiqueta
    `publicado-2026-10-11` no se pudo subir (GitHub devuelve 403 al entorno de Claude): pendiente de crearla desde la web.
- **Archivos:** `CLAUDE.md`, `README.md`, `docs/*.md`, `docs/historico/`, `docs/capturas/`, `.github/`,
  `herramientas/copia-de-seguridad.html`, `herramientas/verificar_documentacion.py`,
  `pruebas/prueba-juego.js`, `.gitignore`.
- **Datos guardados afectados:** ninguno (el juego no cambia; la copia de seguridad solo lee y,
  al restaurar, escribe las claves del archivo tras confirmación y copia previa).
- **Pruebas:** `node pruebas/prueba-juego.js` 21/21 en Chromium (iPad 1180 × 820 e iPhone
  852 × 393); copia de seguridad de ida y vuelta, incluido el marcador; comprobador de documentación
  con 4 rangos de commits; enlaces Markdown revisados.
- **Pendiente:** probar en iPhone y iPad reales; ver correr el workflow en un pull request; proteger `main`.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit (solo documentación y herramientas).

### 2026-10-14 — `b266e52` · Plantillas y vista de validación para el pelo rizado castaño
Plantillas `plantilla/guias/plantilla-pelo-detras.png` y `…-delante.png` (`guias_pelo.py`),
validador `herramientas/validar-pelo.html` (más versión autónoma), `plantilla/PELO.md`. El pelo del
primer borrador **no** se incluye. Probado con el borrador (8 errores detectados) y con la calibración de nitidez.

### 2026-10-13 — `7890d1c` · Ojos premium: marrones, azules y ojos cerrados alineados
`ojos-marron.png` al 100 % de opacidad, `ojos-cerrados-clara.png` corregido, `ojos-azul.png`
automático con máscara del iris; `variantes.py cerrados`; el comprobador compara ojos cerrados y
abiertos. Caché v8. Probado en «Vestir» y «Mi Mundo» (iPhone e iPad simulados).

### 2026-10-13 — `1c0dd5d` · Ojos premium: parpadeo, máscara del iris automática y correcciones
Los ojos abiertos se ocultan al parpadear o dormir; arreglado un fallo por el que se quedaba con los
ojos cerrados al redibujar; la expresión «feliz» ya no oculta los ojos; `variantes.py mascara`.

### 2026-10-13 — `b534d9b` · Plantilla definitiva con la base premium V2.1 aprobada
`arte/originales/base-clara.png` V2.1; `plantilla.js` v2 con sus medidas; láminas y guías por pieza
regeneradas. Caché v7.

### 2026-10-13 — `7ec5bfb` · Herramientas para crear las capas de la muñeca premium
`medir_base.py`, `guias.py`, `variantes.py` (piel e iris); aviso de opacidad en el comprobador;
`?arte=borrador`; encuadres calculados desde la plantilla. Caché v6.

### 2026-10-13 — `40c77f0` · Mi Mundo: habitación completa en pantallas muy apaisadas
En el iPhone horizontal la habitación se recortaba; ahora se ve entera.

### 2026-10-13 — `a6140b2` · Usar la muñeca premium solo cuando tenga base, ojos, pelo y ropa
Cambió `avatar/motor.js` **sin subir la versión de la caché** (corregido después por `7ec5bfb`, v6).

### 2026-10-13 — `4de36fb` · Preparar la muñeca premium y demostración de calidad
Catálogos `premium` / `prueba` / `demo`; piezas técnicas renombradas con `prueba-`; zapatos y
accesorios como capas; pestañas «Zapatos» y «Adornos»; `plantilla/ASSETS.md`.

### 2026-10-13 — `8cef5dc` · Plantilla de la muñeca y circuito de capas PNG
Plantilla 2000 × 3500, comprobador de capas, optimizador WebP, motor con capas PNG. **Incluyó por
error capturas de prueba en la raíz** (movidas a `docs/capturas/2026-10-13/` el 14/10).

### 2026-10-13 — `53f8e32` · Prueba del nuevo creador de avatar y habitación en Mi Mundo
Nuevo «Vestir» (muñeca vectorial por capas, guardado `avatar` y `avatar_draft`) y habitación
interactiva (`mm_hab`). Caché v4.

### 2026-10-10 / 11 — `2e49312` … `4bbf51d` · Versión publicada en `main`
Subidas desde la web de GitHub («Add files via upload»): juego completo, estilo pastel «fase 1»
(`e9560b7`), caché v3 (`4bbf51d`). Punto de recuperación de la versión publicada.

## Plantilla obligatoria (copiar para cada tarea)

```
### AAAA-MM-DD — Título claro

- **Solicitado por:** ___
- **Rama y commit:** ___
- **Estado:** en prueba / aprobado / integrado / publicado / revertido
- **Cambios:** ___
- **Archivos:** ___
- **Datos guardados afectados (claves, migraciones):** ___
- **Pruebas y evidencia (dispositivos y navegadores):** ___
- **Riesgos conocidos y pendiente:** ___
- **¿`main` intacta?:** sí / no, y cómo se ha comprobado
- **Cómo revertir:** ___
```
