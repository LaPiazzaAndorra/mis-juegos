# Registro de decisiones

## D-014 · Base visual de la muñeca nueva aprobada conforme a D-013 · 14/10/2026
- **Decisión de la propietaria:** aprueba como base visual la imagen conservada sin modificar en
  `docs/propuestas/base-aprobada-d013-2026-10-14/base-aprobada.png` (948 × 1659, SHA-256 `f9c143fc…79a6`).
- **Alcance:** aprobación de la apariencia (proporciones de D-013 y cara de D-012). La ropa rosa es provisional.
- **Pendiente:** resolución real de 2000 × 3500, opacidad al 100 % y bordes limpios, separación de
  capas (cuerpo, ojos abiertos y cerrados, ropa), medidas y guías nuevas.
- **Límites:** no sustituye a las piezas del juego ni se publica; se conservan la V2.1 y la referencia de D-012.
- **14/10/2026:** la propietaria revisa y acepta guardar una **copia técnica** con solo la transparencia
  corregida (`base-transparencia-corregida.png`, reproducible con `herramientas/corregir_transparencia.py`).
  El original se conserva intacto; la copia no es arte de 2000 × 3500 ni una pieza definitiva.

## D-013 · Norma visual permanente: nenita de unos 5–6 años con la cara de D-012 · 14/10/2026
- **Decisión de la propietaria:** la muñeca tiene aspecto de nenita de unos 5–6 años (orientación
  artística): cabeza grande, cuello corto, hombros estrechos, torso compacto y brazos y piernas
  cortitos y redondeados. Nada de proporciones adolescentes, piernas estilizadas ni cintura o
  caderas de adulta.
- **Cara:** se conserva la identidad de D-012 (ojos grandes algo separados, sonrisa, nariz pequeña,
  pecas, mejillas redondeadas). El pelo y la ropa se adaptan a la muñeca; nunca se deforma su cara.
- **Permanente:** no se vuelve a debatir con cada pieza; cada resultado nuevo sí se revisa
  visualmente con la lista de [`NORMA_VISUAL_MUNECA.md`](NORMA_VISUAL_MUNECA.md).
- **Límites:** la última imagen de cuerpo más compacto es un borrador (no está en el repositorio);
  no hay capas definitivas nuevas ni medidas aprobadas. Se conservan la V2.1 (D-007) y la
  referencia de D-012. Sin cambios de código, catálogo, datos ni `main`.

## D-012 · Nueva referencia visual de muñeca elegida · 14/10/2026
- **Decisión de la propietaria:** «Sí esta me encanta» sobre la propuesta de cuerpo entero
  conservada en `docs/propuestas/muneca-elegida-2026-10-14/referencia-aprobada.png`.
  Se prefieren su carita, los ojos algo más separados y los rizos castaños de esa referencia.
- **Actualiza D-007 y D-010 como dirección artística futura:** la V2.1 sigue intacta en el juego;
  no se sustituye hasta preparar y aprobar una nueva base con sus capas y medidas.
- **Límites:** aprobación estética de una referencia, no aprobación de capas todavía inexistentes
  ni de publicación. La ropa de la propuesta es provisional. No se cambia `main`, ningún dato
  guardado ni los identificadores del catálogo con esta decisión.
- **Resolución:** la referencia tiene 948 × 1659 px; no cumple los requisitos de producción.
- **Datos:** la propietaria comunica recuperación funcional en iPhone. Se permiten partidas
  distintas entre dispositivos; sincronizar no es prioritario.

**Regla:** cada decisión importante tiene su sección con fecha. Una decisión aprobada no se cambia en
silencio: se añade otra nueva que explica el motivo y a cuál sustituye.

## D-001 · Documentación versionada en GitHub · 14/10/2026
- **Decisión:** la documentación del proyecto y el registro de cada cambio viven junto al código; el
  estado y el registro se actualizan en el mismo commit que el cambio.
- **Motivo:** un asistente puede perder el contexto de una conversación; Git conserva el historial.
- **Límite:** Git no guarda los datos del navegador de Amaia (ver D-009).

## D-002 · `main` protegida · 14/10/2026
- **Decisión:** se desarrolla en ramas; `main` no se modifica ni se fusiona sin aprobación explícita.
- **Motivo:** que una prueba nunca sustituya al juego que usa Amaia.

## D-003 · Estética aprobada · 11/10/2026
- **Decisión:** se conservan los menús pastel con arcoíris, los botones grandes y las ilustraciones
  propias de la «fase 1» (commit `e9560b7`).
- **Motivo:** el diseño gusta; no se rediseña para meter funciones.

## D-004 · Avatar por capas, guardable y usable en «Mi Mundo» · 13/10/2026
- **Decisión:** piel, ojos, pelo, ropa, zapatos y accesorios intercambiables; el personaje se guarda,
  se edita después y aparece en «Mi Mundo».
- **Motivo:** la ilustración tiene que ser interactiva, no una imagen plana.

## D-005 · Datos de usuario preservados · 13/10/2026
- **Decisión:** al actualizar la app se mantienen estrellas, dibujos, escenas, niveles, monedas, ajustes
  y láminas. El avatar nuevo usa claves nuevas (`avatar`, `avatar_draft`, `mm_hab`) y no modifica
  `doll` ni ninguna anterior.
- **Consecuencia:** pruebas con datos antiguos y migraciones probadas si cambia un formato.

## D-006 · Arte de la muñeca: PNG por capas sobre una postura fija (opción B) · 13/10/2026
- **Decisión:** la calidad de ilustración de referencia no se puede conseguir con SVG dibujado en
  código. Se usan PNG transparentes de 2000 × 3500 sobre una postura base, ilustrados por la
  propietaria con su herramienta de imágenes, más comprobador, optimizador (WebP al 30 y al 50 %) y
  plantilla.
- **Descartado:** muñeco vectorial como versión final (queda solo de reserva) y personajes completos
  sin capas (no permiten combinar piezas ni animar).

## D-007 · Base premium V2.1 aprobada · 13/10/2026
- **Decisión:** `arte/originales/base-clara.png` V2.1 (cuello más corto, brazos a 21°, codos y muslo
  retocados) es la base. `plantilla/plantilla.js` (versión 2) toma sus medidas.

## D-008 · La muñeca premium solo se activa completa · 13/10/2026
- **Decisión:** el juego usa la muñeca premium cuando tiene al menos una piel, unos ojos, un peinado y
  una ropa completos. Mientras tanto se usa la provisional; `?arte=borrador` permite revisar.
- **Motivo:** que Amaia nunca vea una muñeca calva o sin ojos.

## D-009 · Copias de seguridad de los datos con una herramienta aparte · 14/10/2026
- **Decisión:** `herramientas/copia-de-seguridad.html` (y su marcador) copia y restaura los datos sin
  modificar el juego. Antes de restaurar siempre descarga una copia de lo actual.
- **Pendiente:** un botón dentro del juego, solo con aprobación.

## D-011 · Copia de seguridad dentro del juego y versión de pruebas aparte · 14/10/2026
- **Decisión:** botones «Guardar mi progreso» / «Recuperar mi progreso» en ⚙️ Ajustes (diseño aprobado
  por la propietaria). Las pruebas en el iPhone se hacen en una versión de pruebas con **otro origen
  web** (`raw.githack.com`), instalada como otra app («PRUEBAS») y con datos ficticios.
- **Motivo:** Amaia juega en la app instalada, cuyos datos iOS separa de Safari (D-009 no llega a ellos),
  y su progreso no se puede arriesgar en pruebas.

## D-010 · Pelo: el diseño se conserva y los archivos del borrador no se usan · 14/10/2026
- **Decisión:** se mantiene el diseño de rizos castaños largos. Los PNG del primer borrador quedan
  rechazados (restos de otra figura, cortes rectos, islas, poca resolución) y se crean de nuevo con
  `plantilla/PELO.md` y `herramientas/validar-pelo.html`.
