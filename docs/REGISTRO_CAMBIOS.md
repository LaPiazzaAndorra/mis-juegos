# Registro de cambios

### 2026-10-14 — D-014: base visual de la muñeca nueva aprobada

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
