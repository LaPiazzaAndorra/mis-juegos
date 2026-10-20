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

**Prueba aislada en el juego (15/10):** `docs/propuestas/prueba-juego-d016/` (enlace en `docs/VERSION_DE_PRUEBAS.md`).
- Es una copia de la versión de pruebas con el conjunto completo a 948 × 1659: Vestir, Mi Mundo, parpadeo, y la ropa
  (vestido o camiseta) y la corona (sí o no).
- **Datos propios** (`d016:` y `d016-`): no lee, cambia ni migra las partidas. Sin service worker.
- La muñeca anterior sigue disponible.
- Las piezas antiguas no encajan con la base nueva (otro lienzo y otras proporciones).
- Probado en Chromium: 13/13 y el juego, 21/21 y 45/45.
- **Aprobada por la propietaria en su iPhone (D-019)**, sin detallar pasos concretos.
- Referencia estable: commit `22d96e9`, con enlace fijo en `docs/VERSION_DE_PRUEBAS.md`.
- 2000 × 3500 y el paso al juego principal siguen pendientes (no se hacen todavía); nada publicado.

**Ojos de colores (16/10, D-020):**
- Tonos azul, verde y lila de fantasía aprobados.
- Variantes de nuestra capa de ojos con **solo el color de los iris** cambiado (luminosidad y alfa intactos), en
  `…/ojos-colores/`.
- Fila «Color de ojos» en el visor; marrones como opción y parpadeo V2.1.
- **Variantes aprobadas visualmente (16/10)**; los marrones siguen siendo la opción predeterminada.
- En una copia nueva de prueba del juego, con el pintacaras (`prueba-juego-d021/`, D-019 congelada). Pendiente
  2000 × 3500.

**Pintacaras «Estrellas y brillo» (16/10, D-021):**
- **Diseño** aprobado (estrellas rosas, lilas y doradas con puntos de brillo); referencia en `…/pintacaras/`.
- **Capa candidata** independiente con solo los adornos (sin piel), encajada en nuestras mejillas: sin tocar ojos,
  pestañas ni boca y dentro de la piel de la cara; 114 de 121 pecas detectadas quedan libres (7 muy suaves, bajo las
  estrellas).
- Fila «Pintacaras» en el visor: «Sin pintacaras» (por defecto) y «Estrellas y brillo»; probado con los 4 colores de
  ojos y el parpadeo en Chromium (no en un iPhone real).
- **Encaje aprobado visualmente (16/10)**; se conserva la opción de ponerlo y quitarlo.

**Prueba aislada nueva: colores de ojos + pintacaras (16/10, D-021):** `docs/propuestas/prueba-juego-d021/` (enlace
en `docs/VERSION_DE_PRUEBAS.md`).
- Copia de la versión de pruebas con el conjunto de D-019, los 4 colores de ojos (pestaña Ojos) y el pintacaras
  (pestaña Adornos, se pone y se quita).
- **Datos propios** (`d021:` y `d021-`): no lee, cambia ni migra las partidas ni los datos de la prueba D-016.
- Probado en Chromium: 19/19 (16 combinaciones, parpadeo con cada color, lo elegido se conserva al cerrar y abrir,
  Mi Mundo) y el juego, 21/21 y 45/45; D-016 sigue 13/13. **Sin probar todavía en el iPhone.**
- La prueba D-019 sigue congelada; 2000 × 3500 y el paso al juego principal siguen pendientes.

**Colores de pelo (16/10, D-022):**
- Tonos castaño chocolate, rubio miel, castaño oscuro y pelirrojo jengibre aprobados (lámina en `…/pelo-colores/`).
- Variantes de nuestras capas de pelo (delante y detrás) con **solo el color** cambiado: alfa idéntico; la luminosidad,
  el tono y la saturación coinciden con la lámina; el detalle se conserva (correlación 0,94–0,99).
- Fila «Color de pelo» en el visor; **castaño original por defecto**. Probado en Chromium (no en un iPhone real).
- **Variantes aprobadas visualmente (16/10)**; el castaño original sigue por defecto.
- **Cejas a juego, aprobadas visualmente (16/10):** capas aparte en `…/cejas-colores/` que solo cambian el color de las
  cejas de la base (rubio: algo más oscuras que el pelo; jengibre: castaño cobrizo suave). En el visor, «A juego con el
  pelo» por defecto y opción de cejas originales; con el castaño original, las de la base.
- Pendientes: una copia nueva de prueba del juego con los colores de pelo y las cejas, y 2000 × 3500.

**Tonos de piel (16/10, D-023):**
- Lámina de referencia aprobada: claro (original), dorado, moreno y profundo (en `…/piel-tonos/`).
- Variantes de nuestras piezas con **solo la piel** cambiada (base, ojos abiertos de los 4 colores y cerrados, manos,
  cejas a juego) y capas pequeñas de «bordes» para el pelo de delante, el cuello del vestido y los zapatos, que traían
  piel clara pegada. Alfa idéntico; ropa, pelo, iris, blancos y pestañas sin cambios.
- Fila «Piel» en el visor; **claro original por defecto**. Probado en Chromium (no en un iPhone real).
- **Profundo no aprobado todavía (16/10, revisión en el iPhone):** corregidos de forma localizada los restos claros del
  nacimiento del pelo (con cada color de pelo), del contorno del ojo y del lagrimal, y el exceso de rojo (medido en la
  lámina). Blancos, iris, colores de pelo y originales sin cambios. Antes y después en `…/piel-tonos/correccion-profundo/`.
  Corrección 2 (bordes claros con pelirrojo): bordes de los dos pelos junto a toda la piel visible (sienes, orejas,
  mandíbula, cuello) y filo del cuello del vestido, con los 5 colores de pelo sin cambiarlos; en `correccion-profundo/2-bordes-pelo/`.
- **Pendiente:** revisión de las capas (los tres tonos); las cejas quedan más claras que la piel en los tonos oscuros (a
  revisar); copia nueva de prueba del juego; 2000 × 3500.

**Prueba aislada nueva: piel, pelo, cejas, ojos y pintacaras (16/10, D-023):** `docs/propuestas/prueba-juego-d023/`
(enlace en `docs/VERSION_DE_PRUEBAS.md`).
- Tonos de piel **aprobados visualmente** (16/10) y llevados a una copia de la versión de pruebas con las 4 pieles, los
  5 colores de pelo con cejas a juego, los 4 colores de ojos y el pintacaras (pestañas Piel, Ojos, Pelo, Ropa, Adornos).
- **Datos propios** (`d023:` y `d023-`): no lee, cambia ni migra las partidas ni los datos de D-016 y D-021.
- Probado en Chromium: 18/18 (56 combinaciones, parpadeo con cada piel, guardar y volver a abrir, Mi Mundo) y el juego,
  21/21 y 45/45; D-016 13/13 y D-021 19/19. **Sin probar todavía en el iPhone.**

**Accesorios de pelo, segunda colección (16/10, D-024):**
- **Diseño aprobado** de los ocho (lazo, pasador de flores, mariposa lila, diadema de estrellas, cinta deportiva, gorra,
  sombrero de aventura y gorrito de dormir); láminas en `docs/propuestas/accesorios-2026-10-16/referencias/`.
- **Lazo, flores y mariposa:** capas independientes sobre los rizos (sin fondo, marco, texto ni sombra), sin tocar la
  cara ni la corona; fila «Accesorio de pelo» en el visor («Sin accesorio» por defecto). **Encaje aprobado visualmente (16/10).**
- **Diadema, cinta y gorros:** en perspectiva de tres cuartos, no encajan de frente; guía para ChatGPT en
  `…/guia-chatgpt/`.
- **Diadema de frente (16/10):** diseño aprobado; capa extraída (solo arco, estrellas y perlas) en `…/diadema/` y en el
  visor; **encaje aprobado visualmente (16/10)**.
- **Gorrito de dormir de frente (17/10):** diseño aprobado; gorro y pompón extraídos (`…/gorrito/`) y colocados sobre la
  melena; en el visor como candidato (quita la corona). Cejas libres y rizos de los lados conservados; **cubre el 95,9 %
  del pelo de arriba: asoma una franja fina de rizos arriba a la izquierda** (marcada; peinado sin tocar). **Encaje
  pendiente.** Cinta, gorra y sombrero, pendientes de versión de frente.
- **Gorrito B, un 8 % más grande (17/10):** el mismo gorro ×1,08 y 8 px a la izquierda: cubre el 99,9 % del pelo de arriba
  con las cejas libres (a 14,6 px; el ala queda unos 6 px más alta que en el A). **Encaje aprobado visualmente (17/10):
  opción elegida**; el A queda como alternativa anterior. Revisado con los 5 colores de pelo y los 4 tonos de piel sobre
  la melena: sin halos. **Con la coleta no encaja** (asoman el moño y rizos; necesita otra adaptación).
- **Gorra rosa del rayo de frente (17/10):** diseño aprobado; solo la gorra extraída (`…/gorra/`), ×1,10 y centrada:
  cubre el pelo de arriba (99,99 %) con las cejas libres (a 6,3 px). **Encaje aprobado visualmente (17/10)**; bordes
  revisados con los 5 colores de pelo y los 4 tonos de piel: sin defectos. Con la coleta, más adelante. Cinta deportiva y sombrero, pendientes de versión de frente.
- **Lazo con la coleta, en su base (18/10, candidato):** el lazo aprobado, solo escalado, colocado y girado
  (`…/lazo-coleta/`), en la base de la coleta; vale con y sin cinta (0 px sobre la piel, 100 % sobre el pelo). En el
  visor, con la coleta el lazo **mantiene el peinado**; los demás accesorios y la corona, con la coleta o las dos
  coletas, **no se ponen y se avisa** (ya no se vuelve a la melena sin avisar). **Encaje pendiente de revisión**; la
  copia `prueba-juego-d026` no cambia.
- **Lazo con la coleta aprobado visualmente (18/10)**, con y sin cinta.
- **Adornos para la coleta y las dos coletas (18/10, candidatos):** flores, mariposa, diadema, corona y dos lazos pequeños
  en los coleteros, con las piezas aprobadas recolocadas (`…/peinados/`); 0 px sobre la piel y las cejas. No compatibles:
  diadema con la coleta con cinta; diadema y corona con las dos coletas con sombrero. En el visor, el peinado se conserva
  y lo que no es compatible se avisa. **Aprobados visualmente (18/10)**; no probadas una a una todas las combinaciones
  en el iPhone; integración en una copia nueva del juego, más adelante. Los gorros, más adelante.

**Conjunto de aventura (18/10, D-027):**
- **Diseño aprobado** (camiseta con hoja, chaleco arena, pantalón verde, calcetines, botas y mochila); referencia en
  `docs/propuestas/conjunto-aventura-2026-10-18/referencias/`.
- Siete capas sobre nuestra base, sin escalar ni deformar (mochila detrás y tiras aparte, para poder quitarla); en el
  visor como **candidato** (piel clara, castaño y melena). **Encaje pendiente de revisión.**
- **Faltan zonas** (marcadas; guía para ChatGPT): mallas rosas a la vista en las rodillas; chaleco más ancho que nuestro
  torso (bordes y bolsillos bajo nuestros brazos); hombros bajo las tiras (sin mochila); lateral de la mochila.
- El pelo de delante aprobado de la melena tenía 9 trocitos sueltos sobre el pecho: limpieza localizada y reutilizable,
  con copias de los cinco colores, en `base-aprobada-d013-2026-10-14/pelo-sin-restos/`.
- **18/10:** rodillas por la **opción A** (copia de la base con solo la piel a completar: máscara y referencia en
  `…/piernas/`) y guías separadas para ChatGPT: **1** camiseta y chaleco a nuestra medida, sin tiras; **2** mochila
  completa (cuerpo y tiras). Pendiente de hacerlas en ChatGPT.
- **Integración preparada (18/10):** `…/integrar/recibir.py` alinea cada imagen de ChatGPT con nuestro lienzo (sin
  deformar), toma solo lo pedido y lo comprueba; probado con imágenes de prueba.
- **Rodillas integradas (18/10, candidatas):** con la imagen de ChatGPT, solo dentro de la zona: A (zona tal cual; queda una
  línea fina, la sombra de las mallas de nuestra base) y B (+6 px bajo el borde: sin línea; pendiente de aprobación).
  Quedan **104 px de rosa** bajo el pantalón en tres trocitos de 2–5 px. La base aprobada no cambia. En el visor, fila
  «Rodillas». **Faltan** las imágenes de la camiseta y el chaleco y de la mochila.
- **19/10: B aprobada** (con un paso suave de 3 px dentro de su franja: sin escalón de tono). Para el rosa que asoma,
  máscara mínima (248 px) y guía para ChatGPT en `…/piernas/para-chatgpt/rosa/`.
- **19/10: restos rosas corregidos (candidato B2)** dentro de esa máscara, con nuestra propia piel de justo debajo y fondo en
  la abertura (sin usar las imágenes de ChatGPT, que cambiaban más cosas): rosa a la vista de 111 a 1 px; fuera de la
  máscara, idéntico. En el visor, «B + restos rosas corregidos (candidata)».
- **19/10: rodillas B2 aprobadas** (solo las rodillas), por defecto con el conjunto en el visor.
- **19/10: encaje del chaleco NO aprobado** (revisado por la propietaria en su iPhone): sigue ancho y cortado por los
  brazos.
- **19/10: camiseta y chaleco a nuestra medida (guía 1), candidatos:** extraídos de la imagen de ChatGPT, entre nuestros
  brazos y sin tiras; rosa a la vista de 9 689 a 205 px (sin pelo). Quedan un filo rosa en las mangas y una rayita en la
  cadera izquierda (del pantalón). En el visor, fila «Camiseta y chaleco». **Pendientes de revisión;** falta la guía 2.
- **19/10: filos retocados (candidata):** mangas con tela crema contigua y lateral del pantalón en la cadera, con máscaras
  mínimas y en copias (`…/integrar/ropa-b/`): rosa a la vista de 205 a 12 px. Por defecto en el visor.
- **19/10: conjunto limpio (candidato):** los últimos 12 px corregidos (cintura con la camiseta; abertura transparente,
  unida al fondo): **0 px de rosa a la vista**. En el visor, por defecto y **sin mochila** (las tiras nuevas, pendientes).
  Hoja `…/integrar/conjunto-limpio.png`. **Pendiente de aprobación.**
- **19/10: conjunto NO aprobado todavía** (cortes y huecos del pantalón bajo el chaleco). **Candidata ajustada**
  (`…/integrar/ropa-d/`): cadera izquierda y bolsillo recuperados de la imagen, cintura completada con la tela del propio
  pantalón, sin el halo claro del chaleco, calcetines al ancho de nuestras piernas y botas sin el trozo de sombra. En el
  visor, por defecto; antes y después sin pelo en `…/integrar/ropa-d/antes-despues.png`. La mochila, para después.
- **20/10: cuerpo nuevo de la mochila (de ChatGPT, sin tiras), candidatas A y B** (`…/integrar/mochila-b/`): misma
  escala que en la imagen aprobada (0,38), sin deformar; A centrada en nuestro torso (apenas asoma), B como en la imagen
  aprobada (se ve el bolsillo junto al brazo). Vistas con la melena, la coleta y las dos coletas (`montajes-peinados.png`);
  al quitarla, idéntico. En el visor, fila «Mochila» («Sin mochila» por defecto); el conjunto admite ya los tres peinados.
  **Pendientes:** elegir A o B y las tiras nuevas. Restos anteriores vistos con el conjunto: un trocito junto al cuello con
  la coleta y rosa entre rizos y mangas con las dos coletas (sin tocar).

**Peinado nuevo: dos coletas rizadas con sombrero de aventura (17/10, D-026):**
- Propuesta aprobada como peinado nuevo; se conservan la melena (por defecto) y la coleta.
- Pelo de delante, pelo de detrás, coleteros y sombrero separados de la imagen y encajados en nuestra base con la escala
  de los ojos (sin cara, orejas, piel, cuerpo ni vestido de la imagen); en el visor como **candidato** (piel clara y
  castaño). Cejas y ojos libres. **Encaje pendiente de revisión.**
- **Pelo bajo el sombrero y puntas completas (17/10):** tomados de la propuesta de ChatGPT (otro encuadre; alineación
  medida: cara 0,3 px, coleteros 4,5 px). Dos candidatas en el visor (con y sin sombrero, puntas completas); se conserva
  el montaje anterior. Uniones revisadas: a la vista continúan; con diferencia alta en el 18,6 % de la de las puntas
  (marcado). **Aprobadas visualmente (18/10)**; con sombrero, por defecto al elegir el peinado.
- **Colores de pelo y tonos de piel (18/10):** las dos coletas completas en los 5 colores de pelo y los 4 tonos de piel,
  con coleteros verdes, cejas a juego y nuestra cara y orejas, en el visor. Corregidos en las variantes restos de la
  oreja de la imagen sobre nuestras orejas y una línea clara junto a ellas sin sombrero. **Aprobadas visualmente (18/10)**;
  las 40 combinaciones no se han probado una a una en el iPhone.

**Prueba aislada nueva D-026 (18/10):** `docs/propuestas/prueba-juego-d026/` con los tres peinados (melena por defecto,
coleta con y sin cinta, dos coletas con y sin sombrero) y los accesorios aprobados (corona, lazo, flores, mariposa,
diadema, gorrito B, gorra, pintacaras) con sus compatibilidades del visor; datos propios `d026:`. Probada en Chromium
(20/20: selección, compatibilidades, 108 combinaciones, parpadeo, guardar y reabrir, «Mi Mundo», datos ajenos intactos).
**Pendiente de probar en el iPhone.**

**Peinado nuevo: coleta rizada con cinta (16/10, D-025):**
- Propuesta aprobada como peinado nuevo; la melena suelta se conserva (por defecto).
- Pelo de delante, pelo de detrás y cinta separados de la imagen y encajados en nuestra base con la escala de los ojos
  (sin tomar cara, cuerpo ni vestido); fila «Peinado» en el visor. **Encaje aprobado visualmente (16/10).**
- Bajo la cinta no hay pelo en la imagen: guía para completarlo en ChatGPT (`…/peinado-coleta-2026-10-16/guia-chatgpt/`).
  Ya completado con la propuesta de ChatGPT (abajo).
- **Pelo sin cinta (16/10):** propuesta de ChatGPT alineada; con margen mínimo **las uniones fallan** (abajo 98 %,
  arriba 32 %, puntas 52 %); marcadas en `…/peinado-coleta-2026-10-16/uniones/`. No integrado; pendiente decidir si se
  amplía la zona (unos 15–20 px por abajo).
- **Candidata con la zona ampliada (16/10):** la unión de abajo queda limpia (0,5 %); arriba (22 %) y en las puntas (19 %)
  todavía quedaba la sombra de la cinta. Con 32 px arriba y en las puntas **las uniones quedan limpias** (3,7 % / 1 % /
  0 %), sin tocar piel, cara ni silueta. **Aprobada visualmente (16/10)**; se conservan las dos opciones (fila «Cinta»).
- **Colores de pelo y tonos de piel (16/10):** la coleta, con y sin cinta, en los 5 colores de pelo y los 4 tonos de piel,
  con las cejas a juego, en el visor (`…/peinado-coleta-2026-10-16/coleta_variantes.py`): las orejas de la coleta van en
  una capa propia (con piel clara y castaño, idéntico al aprobado) y toman el tono de la piel; el pelo cambia de color
  con la transformación de la melena; con otra piel, una capa pequeña de bordes limpia el nacimiento del pelo, las
  sienes, junto a las orejas y el cuello. Revisado: las 40 combinaciones, el parpadeo con cada piel y fondos claro y
  oscuro (`…/revision-variantes/`). **Aprobado visualmente (17/10)**; se conservan con cinta y sin cinta; melena por
  defecto. Las 40 combinaciones solo se han comprobado en Chromium (iPhone simulado), **no una a una en el iPhone**.

**Manual al día (16/10):** `docs/MANUAL_PROYECTO.md` resume ahora el estado de la muñeca nueva, los enlaces de
revisión y la forma de trabajar con el arte. Se actualiza en cada paso relevante (norma añadida a `CLAUDE.md`).

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

**Última actualización:** 20/10/2026 (D-027: cuerpo nuevo de la mochila, candidatas A y B, sin tiras; conjunto sin aprobar) · **Rama:** `avatar-creador` ·
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
