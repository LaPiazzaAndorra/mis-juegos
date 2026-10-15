# Estado actual y siguiente paso

## Norma visual de la muñeca · 14/10/2026 (D-013)

**Conjunto elegido (15/10, D-016, aprobación visual):**
- base D-014;
- vestido opción B con las axilas completadas;
- pelo «mechones completos» (delante) y pelo B (detrás);
- ojos abiertos v3 color experimental y cerrados V2.1.

Está seleccionado por defecto en el visor (`docs/propuestas/base-aprobada-d013-2026-10-14/visor/`), y las
alternativas se conservan. **Pendiente:** la resolución real de 2000 × 3500, la integración en el juego y las pruebas
en el iPhone/iPad reales. Nada activado.

**Zapatos rosa (15/10, D-017):**
- **Diseño** aprobado; referencia en `docs/propuestas/zapatos-rosa-2026-10-15/`.
- **Capa candidata** extraída (solo el zapato) y colocada sobre los pies de D-016: el izquierdo sin mover y el derecho
  +2 px, sin escala. El pie no asoma.
- Opción «Zapatos rosa (elegidos)» en el visor.
- **Encaje aprobado visualmente** (15/10); los zapatos quedan seleccionados por defecto en el visor y se conserva la
  opción «Descalza». La resolución 2000 × 3500 sigue pendiente; nada activado.

**Corona dorada (15/10, D-018):**
- **Diseño** aprobado; referencia en `docs/propuestas/corona-2026-10-15/`.
- **Capa candidata:** solo la corona, con los huecos transparentes, colocada sin mover ni escalar sobre la muñeca.
- Opción «Corona dorada (elegida)» en el visor.
- **Encaje y conjunto completo aprobados visualmente** (15/10): el visor abre con vestido, zapatos y corona; se
  conserva «Sin corona». La resolución 2000 × 3500 y la integración en el juego siguen pendientes; nada activado.

Acordada y permanente: [`docs/NORMA_VISUAL_MUNECA.md`](NORMA_VISUAL_MUNECA.md). Nenita de unos 5–6
años con la cara de D-012; las piezas se adaptan a ella. **Todavía no hay capas definitivas ni medidas
aprobadas** para la nueva muñeca: la última imagen de cuerpo más compacto es un borrador (no está en
el repositorio). El juego sigue usando las piezas V2.1, que se conservan.

**Base visual aprobada (D-014):** [`docs/propuestas/base-aprobada-d013-2026-10-14/`](propuestas/base-aprobada-d013-2026-10-14/LEEME.md),
948 × 1659 con transparencia. Pendiente: 2000 × 3500 reales, opacidad al 100 % (ahora alfa 240–254),
limpiar halos y bordes, separar capas, medir y rehacer guías. No sustituye a las piezas del juego.
**Actualización:** ya hay una **copia técnica con la transparencia corregida** junto al original
(interior a alfa 255, restos exteriores fuera, borde suave y colores intactos, revisada visualmente).
Pendiente: resolución real, separación de capas, medidas y guías.
**Medidas provisionales** (948 × 1659) y guía en `docs/propuestas/base-aprobada-d013-2026-10-14/medidas/`,
con las automáticas y las estimadas diferenciadas: **pendientes de la revisión visual de la propietaria**.
No sustituyen a `plantilla/plantilla.js` (V2.1). Hombros, codos, rodillas y cintura anatómica son estimaciones
sin validar; el bajo de la camiseta se distingue de la cintura.
**Ojos abiertos:** máscara **propuesta, versión 2** en `docs/propuestas/base-aprobada-d013-2026-10-14/ojos-abiertos/`
(pliegue del párpado fuera, sin piel entre pestañas, corte junto al lagrimal suavizado, trazo del
lagrimal derecho conservado). Pendiente de revisión: no se ha extraído ni borrado nada de la base.
Los bordes mezclados con piel (1 077 píxeles) solo se resolverían cambiando colores: no hecho.
**Capa de prueba de los ojos** extraída con la v2 y **base sin ojos (propuesta)** en `…/sin-ojos/`: el
relleno solo cambia la zona de los ojos. Comprobación del montaje: con la capa v2 **no** sale idéntico
(4 024 px: puntas de pestañas más claras y falta el borde rosado del párpado inferior); con opacidad
completa en la zona (referencia B) sale idéntico. Pendiente de decisión. Nada activado.
**v3 (15/10):** máscara v3 (borde rosado, lagrimal y pestañas recuperadas), base sin ojos v3 y dos capas: sin
corregir (montaje con puntas de pestañas más claras) y **color experimental** en 2 800 píxeles de borde (color
estimado, no recuperado; montaje casi idéntico, máx. 51). Quedan el pliegue y pequeños mechones de pestaña
sobre él; el relleno liso se nota al quitar los ojos. Para elegir montaje. Nada activado.
**Parpadeo de prueba (15/10):** candidata abierta = v3 color experimental; **ojos cerrados de prueba** en
`…/ojos-cerrados/` (párpado de piel que tapa el 100 % del parche, pliegue y raíces + pestañas reales en
espejo). Cambio instantáneo de capa. A tamaño de juego funciona; **ampliado no es del todo natural** (línea
cerrada fina y entrecortada, párpado liso): para la versión final hará falta dibujo o retoque a mano.
**Variante con los ojos cerrados V2.1 reutilizados** (escala uniforme 0,36, sin deformar; V2.1 intacta): tapa
el 100 % y encaja mejor; sus pestañas son más finas que las de los ojos abiertos nuevos. Sigue siendo prueba.
**Ojos cerrados V2.1 = candidata preferida** (sin retocar; pendiente de la aprobación final del conjunto).
**Pelo:** no hay capas de pelo para D-014. **Borrador de montaje** en `…/pelo-borrador-d012/` con el pelo recortado
de la referencia D-012 (escala uniforme 1,093, sin deformar): sirve para ver el conjunto, no como pieza (huecos
junto al cuello, restos de la referencia, ampliación del 9 %). Se conserva como referencia del encaje.
**Revisión localizada del pelo (15/10, borrador)** en `…/pelo-borrador-d012/revision-localizada/`: limpieza por zonas
(restos de cara, orejas, cejas, cuello y manga de la referencia; la capa de delante ya no pinta orejas ni cuello ajenos
encima de la base), huecos junto al cuello y bajo las orejas **reconstruidos** con mechones copiados de la propia melena
(marcados, no son del original) y punta del mechón del brazo afilada. Sin reescalar ni tocar la base. **Pendiente
(trabajar a mano):** el interior de los rizos que caían sobre la manga, sobre los dos brazos (`zonas-pendientes.png`).
Probado solo con comprobaciones automáticas y revisión visual en el ordenador; nada activado ni publicado.
**Variante experimental (15/10)** en `…/revision-localizada/variante-experimental/`: **A** corrige solo el filo rosado de
los rizos en las zonas rojas (máscara explícita de color; alfa idéntico; los huecos no se rellenan) y **B** es A sin el
mechón suelto del brazo (sin recortar rizos ni inventar uniones). La revisión se conserva. Propuesta: nada activado.
**Elegida la variante B (15/10)** como candidata preferida del borrador de pelo; A, la revisión y el montaje anterior se
conservan. Sigue siendo borrador: pendiente la aprobación final del conjunto y las capas de pelo dibujadas. Nada activado.
**Visor aislado (15/10)** en `…/base-aprobada-d013-2026-10-14/visor/` (base nueva, pelo B, ojos abiertos v3 color
experimental y cerrados V2.1, parpadeo, encuadres de la cara, zoom y fondos). Sin almacenamiento ni service worker; no lee
partidas. Probado en Chromium con pantalla de iPhone simulada; falta revisarlo en el iPhone/iPad reales.
**Vestido rosa (15/10, D-015):** el **diseño** está aprobado, con el largo y el ancho de la muñeca vestida de referencia
(`docs/propuestas/vestido-rosa-2026-10-15/`, imagen generada que no sustituye a la base). **Capa candidata recibida**
(sin modificar) y **prueba de encaje** en `…/montaje/`, colocada tal cual con las manos y el pelo delante. Cuello,
mangas, cintura y bajo, bien. **Falla:** asoma la camiseta en las axilas (731 px), la capa está cortada en los hombros
donde la referencia tenía pelo, y hay 241 manchitas sueltas. No se ha recortado ni deformado nada. Opción «Vestido rosa
(prueba)» en el visor. Sin aprobación técnica; nada activado.
**Opción B del vestido (15/10, propuesta)** en `…/vestido-rosa-2026-10-15/opcion-b/`. Es una copia limpia: sin
puntos sueltos, con el cuerpo y el forro opaco (alfa 255) y los bordes y el tul conservados. Colores idénticos y base
intacta. Solo falta tela en las **axilas**: hay una máscara exacta y un paquete para completarlas con ChatGPT, con un
programa que integra solo la zona marcada. **Corrección:** en los hombros no falta tela; el corte es el borde del pelo
de delante. Opción «Vestido limpio · opción B» en el visor. Nada activado.
**Axilas, intento 1 con ChatGPT (15/10): no encaja.** La alineación es exacta, pero 381 de los 1 207 px de la zona son
blanco del fondo: ChatGPT no ensanchó el cuerpo del vestido junto al lazo. No hay candidata ni opción nueva en el visor.
`integrar_relleno.py` detecta ahora estos fallos.
**Axilas completadas por edición de píxeles (15/10, candidata):** `opcion-b/vestido-opcion-b-axilas-completadas.png`.
Tiene textura copiada de la tela contigua y una transición suave. Solo cambian los 1 207 px de la máscara; no queda
blanco ni camiseta visible. Opción «Opción B + axilas (candidata)» en el visor. **Pendiente de aprobación**; nada
activado.
**Pelo B en hombros y pecho (15/10, propuesta):** en `…/variante-experimental/redistribucion-hombros/`. Solo
redistribuye el pelo existente entre delante y detrás, por rizos enteros y no por la silueta de la camiseta. **A** pone
delante 53 rizos que ya asomaban; junto al escote faltaría pelo por ilustrar. **B (recomendada)** = A, con las 6
sombras de corte junto al escote detrás; no hace falta ilustrar nada. Opción «Pelo» en el visor. Pendiente de
aprobación; nada activado.
**Propuesta C (15/10):** la propietaria no aprueba B, porque deja una muesca alrededor de cada manga. C pone delante un
mechón continuo por hombro: rizos enteros del pelo existente, desde la melena hasta el pecho. La manga queda tapada en
parte: la izquierda pasa del 43 % al 62 % y la derecha, del 29 % al 44 %. En lo alto de cada manga falta pelo original
(916 px, donde había pelo reconstruido); está marcado y con paquete para ChatGPT. Opción «Hombros · C (mechones)» en el
visor. Pendiente; nada activado.
**Relleno 1 de ChatGPT para los mechones (15/10): no encaja todavía.** La alineación es correcta, pero ChatGPT redibujó
el pelo de los hombros. Integrar solo la máscara deja dos parches con costura, y la máscara se queda corta (2 585 px de
pelo de ChatGPT fuera, marcados). No se ha ampliado. Opción «C + ChatGPT 1 (prueba)» en el visor.
**Alternativa con los mechones completos de ChatGPT (15/10, pendiente de revisión):** en
`…/redistribucion-hombros/mechones-completos-chatgpt/`. Toma el mechón entero de cada hombro de la imagen de ChatGPT,
unido a C por sombras entre rizos (diferencia media en la costura: 5). Solo pelo; silueta exterior, cara, cabeza,
cuerpo y vestido intactos. C se conserva. Opción «Mechones completos (alternativa)» en el visor. Nada activado.

## Actualización de la propietaria · 14/10/2026, 23:36 (Andorra)

**Nueva referencia visual de la muñeca elegida.** Véase
[`docs/propuestas/muneca-elegida-2026-10-14/`](propuestas/muneca-elegida-2026-10-14/LEEME.md).
La propietaria prefiere la nueva carita, ojos un poco más separados y el pelo de la
referencia de cuerpo entero. D-012 actualiza la dirección artística: la V2.1 y sus piezas
se conservan, pero no se debe insistir en adaptar a ella los montajes de pelo rechazados.
La nueva referencia es de 948 × 1659, con fondo: **no hay capas nuevas de producción ni
muñeca nueva integrada**. Primero hay que conservar su identidad, resolver la resolución
y validar las piezas antes de cambiar la base, sus medidas o el catálogo.

La propietaria comunica que la recuperación funcionó en su iPhone. Es una prueba comunicada
por ella; no se ha repetido aquí ni se han confirmado por separado todos los pasos (deshacer,
modo sin conexión, etc.). Los apartados antiguos que la marcan pendiente no reflejan ese
resultado parcial. La sincronización entre dispositivos no es prioritaria: pueden tener
personajes y progresos distintos.

**Esta actualización solo conserva una referencia y documenta decisiones.** Código, caché,
datos guardados y `main` sin cambios. Las pruebas 21/21 y 45/45 de abajo son resultados
históricos, no pruebas ejecutadas en esta sesión. Ojos verdes: mencionados por la propietaria,
pero no encontrados en los originales ni en el catálogo premium de `2dc61c7`; no se dan por
perdidos ni se rehacen sin localizar antes su fuente.

**Última actualización:** 15/10/2026 (máscara propuesta de los ojos de la base D-014) · **Rama:** `avatar-creador` ·
**Último commit funcional:** el de la entrada más reciente de `docs/REGISTRO_CAMBIOS.md` (copia
integrada), probado solo en simulación · **`main`:** `4bbf51d`, sin cambios desde el 11/10/2026.

## Repositorio

- Juego: `LaPiazzaAndorra/mis-juegos` (**público**). No confundir con `la-piazza-gestio`.
- `main` = versión publicada (11/10/2026), commit `4bbf51d`: es el **punto de recuperación**. La etiqueta
  `publicado-2026-10-11` está pendiente: el entorno de Claude no puede subir etiquetas (error 403);
  hay que crearla desde la web (ver `docs/PRUEBAS_Y_RECUPERACION.md`, apartado D).
- `avatar-creador` = desarrollo en curso, **sin publicar**.
- Dirección pública del juego: **por confirmar** con la propietaria.

## Qué hay en `avatar-creador`

- Todo lo de `main`: pintar, láminas e importación, galería, heladería, juegos de pensar, ajustes y
  funcionamiento sin conexión. El código de esas partes no se ha cambiado, pero **la prueba
  automática no las cubre todavía**: hay que revisarlas a mano antes de publicar.
- **Vestir** nuevo: creador de avatar con guardado y edición posterior (`avatar`, `avatar_draft`),
  foto, parpadeo, saludo y salto. Con el arte actual, el juego normal usa la **muñeca provisional**
  (`prueba`) con dos tonos de piel.
- **Mi Mundo:** habitación interactiva con el personaje guardado (caminar, cama, pelota, lámpara,
  día/noche), además de los 6 escenarios anteriores.
- **Muñeca premium en revisión** (`?arte=borrador`): base V2.1 + ojos marrones o azules +
  parpadeo y ojos cerrados.
- **Herramientas:** plantilla y guías, comprobador de capas, validador de pelo, optimizador,
  medidor de la base, variantes de color, copia de seguridad de datos y comprobación de documentación.

## Pruebas hechas (14/10/2026, sobre `b266e52` + este commit)

- `node pruebas/prueba-juego.js`: **21/21 correctas** en Chromium, con tamaño iPad (1180 × 820) e
  iPhone horizontal (852 × 393). Cubre Vestir, guardar y recuperar, Mi Mundo, cama, datos antiguos
  intactos, muñeca vectorial, premium en borrador con parpadeo y copia de seguridad de ida y vuelta.
- `herramientas/verificar_documentacion.py`: probado con commits anteriores (detecta la falta de
  estado y registro, y una caché sin subir de versión en `a6140b2`).
- **No probado todavía:** iPhone y iPad reales, app instalada sin conexión, la herramienta de copia
  en Safari y el workflow de GitHub Actions ejecutándose en un pull request real.

## Copia de seguridad integrada y versión de pruebas

- Amaia juega desde la **app instalada** en el iPhone: sus datos están separados de Safari, así que la
  herramienta `copia-de-seguridad.html` y el marcador **no sirven** para ella.
- **Integrado en la rama** (diseño aprobado el 14/10): «Guardar mi progreso» y «Recuperar mi progreso»
  en ⚙️ Ajustes, con copia automática previa y «Deshacer» (`docs/PRUEBAS_Y_RECUPERACION.md`, C2). Caché `v9`.
- **Versión de pruebas** para el iPhone de la propietaria: otro origen (`raw.githack.com`), otra app
  («PRUEBAS», icono verde), cinta visible, datos ficticios, y el juego normal rechaza sus copias.
  Enlace e instrucciones: `docs/VERSION_DE_PRUEBAS.md`.
- Probado en Chromium simulando la app instalada y la hoja de compartir: `prueba-copia.js` **45/45** y
  `prueba-juego.js` **21/21**.
- **No probado todavía:** en el iPhone real (guardar en iCloud Drive, elegir el archivo, deshacer, sin
  conexión) — lo hará la propietaria con la versión de pruebas. Desde el entorno de Claude no se ha
  podido abrir el enlace de `raw.githack.com` (la red del entorno lo bloquea).
- **Sin publicar:** `main` y la app de Amaia no cambian.

## Muñeca premium

| Pieza | Estado | Siguiente acción |
| --- | --- | --- |
| Base clara V2.1 | ✅ Aprobada (`b534d9b`) | Conservar el archivo editable original fuera del repositorio. |
| Ojos marrones, ojos cerrados (piel clara), ojos azules | ✅ Aprobados (`7890d1c`) | — |
| Pelo rizado castaño (detrás y delante) | ⏳ Esperando el arte nuevo. Revisado de nuevo el 14/10: la única versión recibida sigue siendo el primer borrador (8 errores en el validador) | Recibir `pelo-rizos-detras-castano.png` y `pelo-rizos-delante-castano.png` (paquete «PELO_RIZOS_CASTANOS_PARA_ILUSTRAR» entregado a la propietaria); validar y enseñar en «Vestir» y «Mi Mundo». |
| Vestido rosa, zapatos, corona | ⏳ Pendiente | Después del pelo. |
| Piel morena y ojos cerrados morenos | ⏳ Pendiente | Borradores automáticos posibles. |

## Próximo paso

1. (Después de validar la copia) Recibir las dos capas de pelo nuevas, pasarlas por el validador, montarlas en `?arte=borrador`
   y enseñarlas en iPhone e iPad para su aprobación.
2. Después: vestido rosa, zapatos y corona. Con eso, la muñeca premium pasa a ser la del juego normal.
3. Copia integrada: la propietaria la prueba en la app «PRUEBAS» (`docs/VERSION_DE_PRUEBAS.md`) →
   correcciones si hacen falta → publicar con aprobación → en el iPhone de Amaia, guardar una primera copia.
   Después, el pelo rizado.
4. Configurar la protección de `main` (`docs/PRUEBAS_Y_RECUPERACION.md`, apartado F).
5. Antes de publicar: pull request a `main`, comprobación de documentación verde, copia de los datos
   de Amaia, aprobación de la propietaria y prueba de la app instalada.

## Problemas conocidos

- Hoy **no hay forma de hacer copia** de los datos de la app instalada de Amaia (se resolverá con la copia integrada).
- La galería borra los dibujos más antiguos sin avisar si falta espacio (también en `main`).
- En el iPhone horizontal, el personaje de la habitación se ve pequeño.
- Borde ligeramente dentado al 100 % en los codos de la V2.1 (no se aprecia en el juego).
- `arte/originales/demo-diario.png` es un recorte de la lámina de referencia, solo para `?arte=demo`.

## No modificar sin permiso

`main` y la versión publicada; las claves de datos y la base IndexedDB; el arte original aprobado
(conservar siempre copia); `docs/historico/`.
