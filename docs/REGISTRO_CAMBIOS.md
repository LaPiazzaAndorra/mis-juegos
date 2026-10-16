# Registro de cambios

### 2026-10-16 — D-024: diadema de estrellas de frente (diseño aprobado) como candidata en el visor

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
