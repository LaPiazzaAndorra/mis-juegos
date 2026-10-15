# Registro de cambios

### 2026-10-15 — Pelo D-012 sobre D-014: variante experimental de bordes rosados y sin mechón suelto

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
