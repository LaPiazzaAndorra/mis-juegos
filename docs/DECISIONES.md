# Registro de decisiones

## D-029 · Conjunto de hada: guía de diseño sobre nuestra base · 22/10/2026
- **Pedido de la propietaria:** «prepara la guía sobre nuestra base para diseñar el conjunto de hada, con vestido, alas,
  varita y zapatos como piezas separadas».
- **Hecho:** guía en `docs/propuestas/hada-2026-10-22/guia-chatgpt/` (plantillas con melena y sin pelo, zonas de cada pieza
  —vestido, alas por detrás, mano de la varita, pies— y lo que no se toca, medidas y dos mensajes para ChatGPT). Cada pieza
  será una capa separada. **Pendiente:** el diseño en ChatGPT y su revisión aquí.
- **22/10/2026 (2): diseño aprobado** por la propietaria («Apruebo este diseño de hada»). Referencia (imagen generada, sin
  modificar, SHA-256 `93cb91fe…540d`): `docs/propuestas/hada-2026-10-22/referencias/referencia-hada-aprobada.png`. **El
  encaje queda pendiente:** se pedirán la versión sin pelo y las piezas completas (vestido, alas, varita y zapatos) para
  montarlas sobre nuestra muñeca original, conservando su cara, cuerpo y postura (mensajes preparados en el `LEEME.md`).
  Medido: mismo lienzo y cuerpo (piernas y pies a 1–3 px); la melena de la imagen está redibujada y no se usa (va la
  nuestra); las alas y los hombros no se ven enteros.
- **22/10/2026 (3):** llegan el **conjunto sin pelo, las alas solas y la varita sola** (sin modificar, en
  `guia-chatgpt/de-chatgpt/`). Extraídos solo el vestido y las bailarinas (del conjunto), las alas y la varita, cada uno
  medido y colocado por separado (`integrar/extraer_hada.py`): conjunto, escala 1,0023; alas, 0,9925 (más saturadas y con
  el contorno más grueso que en el diseño: dos opciones, la del diseño por defecto); varita, 0,318 (venía unas 3 veces más
  grande), con el palo por detrás de nuestra mano (no se copia la mano cerrada de ChatGPT). El brazo bajo las mangas de
  farol (más cortas que la manga de la base) se completa con nuestra piel en una copia de la base. Rosa a la vista 0 px.
  Visor: «Hada (candidato)», con opciones para poner y quitar alas y varita. **Encaje pendiente de aprobación.**
- **22/10/2026 (4):** la propietaria, tras verlo en su iPhone: «El resto del conjunto me gusta; queda pendiente la
  varita». Pide una **capa de mano de agarre** con los dedos cerrados alrededor del palo, conservando la posición de la
  muñeca y del brazo, que solo se use con la varita (sin ella, la mano original), conservando la base aprobada.
  - Candidata (`integrar/agarre/`): la mano cerrada del diseño de ChatGPT, trasladada 6 px a nuestra muñeca, con el tono
    igualado y fundida con nuestro brazo; varita recolocada (giro -1.5°, traslación [10, -10]) para que el palo pase por el
    puño; copias de la base, los brazos y las alas para el modo con varita. La bola del palo queda dentro del puño (en el
    diseño asoma). Guía localizada en `guia-chatgpt/3-agarre/` por si se prefiere dibujarla en ChatGPT. **Pendiente.**
- **22/10/2026 (5): agarre y hada en piel clara aprobados.** La propietaria: «Apruebo el agarre de 78bf1bc tal como está,
  sin alargar el palo ni cambiar la bolita. El conjunto de hada en piel clara queda aprobado visualmente con las alas del
  diseño.» Quedan **aprobados** la mano de agarre y la varita recolocada de `integrar/agarre/` (sin cambios: palo y bolita
  como están) y el conjunto en piel clara (vestido, bailarinas, alas del diseño, varita con mano de agarre). Sin probar en
  el iPhone real como juego. Pide seguir con los cuatro tonos de piel y los cinco colores de pelo, adaptando también la mano
  de agarre y conservando la mano original al quitar la varita.
  - **Variantes candidatas** (`integrar/pieles/`, `hada_pieles.py`): dorado, moreno y profundo con la transformación de
    piel aprobada (D-023) aplicada a la base con los brazos completados, a la mano de agarre y a los dedos; sin varita, las
    manos del tono aprobadas tal cual (mano original). Bordes del vestido y de las bailarinas junto a la piel corregidos
    (≈ 4 800 px por tono) y la piel clara que quedó dentro de las prendas (empeine y escote, 4 095 px) pasada al tono. Pelo:
    los cinco colores con el pelo limpio para la ropa (melena, coleta y dos coletas). Base idéntica a la aprobada fuera de
    los brazos; capas aprobadas sin cambios (SHA-256 comprobados). **Pendientes de aprobación.**
- **22/10/2026 (6): variantes aprobadas visualmente.** La propietaria: «Apruebo visualmente las variantes del hada de 1d9d410, con los cuatro tonos de piel, los cinco colores de pelo y los tres peinados, incluida la mano de agarre. Regístralo sin dar por probadas individualmente las 60 combinaciones en mi iPhone.» Quedan **aprobadas visualmente** las
  variantes de `1d9d410` (`integrar/pieles/`: dorado, moreno y profundo, con la mano de agarre de cada tono y, sin
  varita, la mano original) con los cinco colores de pelo y los tres peinados. **No se dan por probadas una a una las 60
  combinaciones en su iPhone.** Nada activado en el juego.

## D-028 · Pijama: guía de diseño sobre nuestra base · 22/10/2026
- **Pedido de la propietaria:** «Prepara la guía sobre nuestra base aprobada para este pijama, con y sin pelo para ver el
  encaje. Conserva la cara, el cuerpo y la postura. Usaremos el gorrito de dormir que ya tenemos. Primero revisaremos el
  diseño aquí; después extraeremos las prendas.»
- **Decisiones:** el gorrito de dormir es el aprobado (D-024, variante B) y no se rediseña; primero se revisa el diseño y
  solo con él aprobado se extraen las prendas.
- **Hecho:** guía en `docs/propuestas/pijama-2026-10-22/guia-chatgpt/` (plantilla con melena y gorrito, plantilla sin pelo,
  zonas que el pijama tiene que tapar y lo que no se toca, medidas y dos mensajes para ChatGPT). La imagen del pijama no
  llegó con el mensaje: la guía pide adjuntarla a ChatGPT («el pijama de la imagen adjunta»). **Pendiente:** la imagen del
  diseño y su revisión aquí.
- **22/10/2026 (2): diseño aprobado** por la propietaria: «Apruebo el diseño: pijama azul con lunas y estrellas, puños
  rosas y zapatillas crema». Referencia (imagen generada, sin modificar, SHA-256 `96c9e39e…ce4c`):
  `docs/propuestas/pijama-2026-10-22/referencias/referencia-pijama-aprobada.png`. **El encaje sobre nuestra base queda
  pendiente:** antes de extraer las prendas se pide el mismo pijama **sin pelo ni gorrito, con hombros y mangas
  completos** (mensaje preparado en el `LEEME.md` de la carpeta). Medido: mismo lienzo y cuerpo que el nuestro (escala
  1,0115 por los ojos; manos y piernas a 1–5 px); los hombros y las mangas no se ven (los tapa la melena); el gorrito de la
  imagen no se usa (va el B aprobado).
- **22/10/2026 (3):** llega el **pijama sin pelo ni gorrito** (sin modificar, en `guia-chatgpt/de-chatgpt/`). La
  propietaria pide comprobar alineación, diseño y que tape toda la ropa rosa, extraer solo camiseta, pantalón y
  zapatillas conservando nuestra muñeca, y ver el montaje con los tres peinados y el gorrito B antes de aprobar el encaje.
  - Alineado por la silueta (escala 0.9964; fuera del pijama, mediana dE 4.58 en la cara y 5.74 en las manos);
    mismo diseño que la referencia, con hombros y mangas completos.
  - Tres capas (`integrar/capas/`). Donde el pijama era 1–4 px más estrecho que la ropa rosa de la base (esquinas de las
    mangas cortas y costado de una pernera, 1 977 px), se alarga con su propia tela: **rosa a la vista 0 px**. El retoque
    del hombro derecho se nota un poco: a revisar.
  - Montajes sin pelo, melena con gorrito B, coleta y dos coletas (`integrar/montajes-peinados.png`); en el visor,
    «Pijama (candidato)», con la piel clara. **Encaje pendiente de aprobación.**
- **22/10/2026 (4):** la propietaria **aprueba el encaje del pijama de `75e2cb5`** y pide los cuatro tonos de piel,
  conservando las prendas aprobadas y revisando cuello, puños y tobillos (sin halos claros). Después, la ropa de hada.
  - Tonos (`integrar/pieles/`): base del tono aprobada, capa de bordes de las prendas (la piel clara pegada en cuello,
    puños, tobillos y zapatillas pasa a la piel nueva) y bordes del pelo adaptados; pelo para el pijama sin las rendijas
    junto a sus mangas (`integrar/pelo/`). Las 60 combinaciones revisadas en capturas del visor.
  - Encontrado al revisar: el borde de las mangas alargadas tenía 127 píxeles sueltos a cuadros (una línea de puntos
    claros). Copia corregida en `integrar/capas-b/camiseta.png` (solo en esa zona); **la aprobada se conserva** y el visor
    usa la corregida, **a confirmar**. Tonos **candidatos**.
- **22/10/2026 (5):** la propietaria pide **mantener la camiseta con el borde limpio como candidata** y conservar intacta la
  anterior (aprobada); revisará los tonos en el visor antes de aprobar esta fase; **en las comparaciones del pijama, las dos
  coletas sin el sombrero de aventura**. Hecho: fila «Camiseta del pijama» en el visor (borde limpio por defecto, o la
  aprobada), hoja `integrar/capas-b/comparacion-camisetas.png` y hojas de tonos rehechas con las dos coletas sin sombrero.
- **22/10/2026 (6):** la propietaria **aprueba visualmente las variantes revisadas del pijama** (4 tonos × 5 colores × 3
  peinados) **y la copia de la camiseta con el borde limpio** (`integrar/capas-b/camiseta.png`), **sin dar por probadas
  individualmente las 60 combinaciones en su iPhone**. Se conservan las anteriores (la camiseta de `75e2cb5`, intacta y
  elegible en el visor). Siguiente: el conjunto de hada (D-029).

## D-027 · Conjunto de aventura: diseño aprobado · 18/10/2026
- **Decisión de la propietaria:** «Apruebo el diseño: camiseta con hoja, chaleco arena, pantalón verde, calcetines, botas
  y mochila». Referencia (generada, sin modificar, SHA-256 `f3e5d5c3…f4fe0`):
  `docs/propuestas/conjunto-aventura-2026-10-18/referencias/referencia-conjunto-aventura-aprobada.png`.
- **Cómo:** piezas sobre nuestra base original, sin cara, piel, cuerpo, pelo ni sombrero de la imagen, conservando las
  proporciones aprobadas. La mochila, independiente y que se pueda quitar, con su parte de detrás separada de las tiras de
  delante. Comprobar que la ropa tapa la camiseta y las mallas rosas de la base, sin modificarla. Primero, el encaje en el
  visor como candidato; si faltan zonas ocultas o alguna pieza exige deformarla, señalar dónde para completarla en ChatGPT.
- **Hecho (`conjunto-aventura-2026-10-18/`):** la imagen está en el mismo lienzo y el cuerpo coincide con el nuestro (ojos
  a 2–6 px, piernas y pies en su sitio): siete capas **sin escalar ni deformar** (mochila detrás de la base, calcetines,
  botas, camiseta, pantalón, tiras, chaleco). En el visor como **candidato** (fila «Ropa»; fila «Mochila» con y sin), con
  piel clara, castaño y melena; las botas sustituyen a los zapatos.
- **Dónde falla (marcado en `donde-falla-ampliado.png`; nada inventado ni deformado):**
  - **rodillas:** el pantalón acaba antes que las mallas rosas de la base: 16 696 px de mallas a la vista (en el torso
    quedan 87 px sueltos). Decidir: piernas de nuestra base sin mallas (ChatGPT) o pantalón algo más largo;
  - **chaleco más ancho que nuestro torso** (a y = 900: 328 px frente a 244 del torso entre nuestros brazos; corregido el 18/10, antes ponía 276): bordes y bolsillos
    bajo nuestros antebrazos (4 594 px) y encima de los brazos (2 865 px); estrecharlo sería deformarlo;
  - **sin la mochila**, falta lo que tapan las tiras en los hombros (8 858 px: se ve la camiseta rosa de la base);
  - parte del **lateral de la mochila** está tapada en la imagen por el brazo y el pelo.
  Guía para ChatGPT: `conjunto-aventura-2026-10-18/guia-chatgpt/`.
- **Defecto encontrado:** el pelo de delante aprobado de la melena lleva 9 trocitos sueltos (1 318 px, restos del bordado
  del vestido) sobre el pecho; con el vestido no se ven. **Copia corregida** sin ellos para este conjunto
  (`capas/pelo-delante-melena-sin-restos.png`); el original no cambia.
- **Estado:** diseño aprobado; **encaje candidato, pendiente de revisión**; no probado en el iPhone.
- **Límites:** solo en propuestas; no se activa en el juego; no cambian `main`, las partidas ni las pruebas congeladas.
- **18/10/2026 (2):** la propietaria elige la **opción A para las rodillas**: una **copia independiente** de la base en la
  que se completa **solo la piel** que las mallas dejan al descubierto bajo el pantalón; la base aprobada no cambia. Pide
  las guías de la ropa **por separado**: (1) camiseta y chaleco adaptados al espacio entre nuestros brazos, con los hombros
  completos y sin tiras; (2) mochila completa, con cuerpo de detrás y tiras independientes; conservando diseño, bolsillos
  y texturas, sin deformar la muñeca. Y dejar la limpieza de los restos del pelo localizada y documentada.
  - Hecho: `conjunto-aventura-2026-10-18/piernas/` (copia exacta de la base, máscara de 26 228 px que cubre las 16 696 px
    de mallas a la vista y unos 25–30 px por dentro del pantalón, versión transparente, imágenes y mensaje para ChatGPT);
    `guia-chatgpt/1-camiseta-y-chaleco/` y `guia-chatgpt/2-mochila/` (plantillas, referencias, medidas del torso y
    mensajes). Corregida la medida del chaleco: a y = 900, 328 px frente a **244** del torso entre los brazos.
  - La limpieza del pelo pasa a `base-aprobada-d013-2026-10-14/pelo-sin-restos/` (`limpiar_restos.py`): la misma
    máscara en los cinco colores, copias limpias de cada uno, originales sin cambios; el conjunto la usa desde allí.
  - Todo sigue como **propuesta**; nada se ha pedido aún a ChatGPT.
- **18/10/2026 (3):** la propietaria pide **retomar el conjunto** y sus guías pendientes (rodillas, camiseta y chaleco a
  medida, mochila independiente); la integración de los adornos en una copia del juego queda para después. Las tres guías
  necesitan **imágenes de ChatGPT** que todavía no hay (no se inventan aquí). Preparado mientras tanto
  `conjunto-aventura-2026-10-18/integrar/recibir.py`: alinea cada imagen con nuestro lienzo (escala uniforme y
  desplazamiento, por los iris), toma solo lo pedido y lo comprueba; probado con imágenes de prueba hechas con nuestras
  capas, fuera del repositorio. **Pendiente:** las tres imágenes de ChatGPT.
- **18/10/2026 (4):** llega la **imagen de ChatGPT para las rodillas** (`piernas/de-chatgpt/`, sin modificar). La
  propietaria pide usarla **solo como fuente del relleno de piel dentro de `mascara-zona.png`**, comprobar la alineación,
  que el pantalón tape todo el rosa restante y que la piel empalme bien, conservando la base original y sin tomar nada
  fuera de la máscara.
  - Alineación por la silueta (la imagen no tiene ojos): escala 1,0004, desplazamiento < 0,4 px. Fuera de la zona, la copia
    es idéntica a la base; la base aprobada no cambia. Tono igualado con nuestra pierna (L −2, b +2).
  - **A (solo la zona):** queda una **línea fina** bajo la rodilla: la sombra del borde de las mallas de nuestra base, justo
    fuera de la zona. **B (zona + 6 px bajo el borde inferior, solo sobre nuestra piel):** la línea casi desaparece. B
    pasa 1 161 px de la zona aprobada: **candidata, pendiente de aprobación**; A se conserva.
  - **El pantalón no tapa todo el rosa:** quedan **104 px en tres trocitos de 2–5 px** (78 del pantalón corto que ChatGPT
    dejó algo más largo, 26 de nuestra base entre las piernas, fuera de la zona). No se inventa piel: se señalan.
  - En el visor, con el conjunto, fila «Rodillas»: base aprobada (mallas) · A · B (por defecto, candidata).
- **19/10/2026 (5):** la propietaria **aprueba B y la ampliación de 6 px**. Pide una **máscara mínima** que incluya los
  104 px rosas y una guía para completar esa piel, conservando el pantalón y la base aprobados, y **revisar las 14
  columnas** donde aún se detectaba la línea.
  - **Las 14 columnas:** 10 están junto al contorno de las piernas (x 350, 441–443, 524–526, 612–614), donde la piel se
    oscurece de forma natural hacia el borde (la medida comparaba 1–3 px bajo la zona con 8–12 px más abajo); 4 (x 445–446
    y 516–517) están **en** el contorno interior, que es una línea dibujada. Ampliado, quedaba además un **escalón suave de
    tono** justo en el borde inferior de B (L ±3–5). Se añade una medida del escalón en el propio borde y, **dentro de la
    franja de 6 px de B**, un paso suave de 3 px hacia nuestra piel: el escalón queda en 4 de 199 columnas (A: 115) y no se
    ve. Fuera de la zona B, nada cambia.
  - **Máscara mínima del rosa** (`piernas/mascara-rosa.png`, `mascara_rosa.py`): los píxeles rosas que el pantalón no tapa
    (111 con el umbral nuevo) más 2 px, solo donde el pantalón no es opaco: **248 px** en cuatro trocitos. Guía en
    `piernas/para-chatgpt/rosa/` (se envía la muñeca con el pantalón puesto). El pantalón, la base aprobada y la copia B
    no cambian.
- **19/10/2026 (6):** llegan dos imágenes de ChatGPT para el rosa (SHA-256 `6cc5ce00…87a2`, 986 × 1 596, y `7e2373c4…4e0c`,
  948 × 1 659); cambian más cosas (ojos, camiseta) y la segunda aún deja ver rosa bajo el pantalón. La propietaria pide
  **corregir los restos dentro de `mascara-rosa.png` copiando piel contigua de cada pierna y fondo en la abertura
  central**, conservando el sombreado y el pantalón, y comprobando que fuera de la máscara todo sigue idéntico. **No se
  usan las imágenes** (no se guardan en el repositorio).
  - Hecho (`piernas/corregir_rosa.py` → `integrar/piernas-b2/`): en la abertura, fondo (transparente, 84 px); en las
    piernas, cada columna toma la piel de la misma columna justo por debajo, reflejada en el borde inferior del trocito
    (unión continua; se conservan el sombreado y el contorno). Rosa a la vista: **de 111 a 1 px**; quedan 66 px rosas
    bajo el borde suave del pantalón (opaco a medias, fuera de la máscara; a tamaño real no se ven). Fuera de la máscara,
    **idéntico** (también con el pantalón puesto). La sombra que había bajo el borde rosa queda ahora justo bajo el
    pantalón. Base B, base aprobada y pantalón sin cambios.
  - Visor: «B + restos rosas corregidos (candidata)». **Pendiente de la revisión de la propietaria.**
- **19/10/2026 (7):** la propietaria revisa el conjunto en el visor en su iPhone (versión de pruebas, raw.githack): **el
  chaleco sigue viéndose ancho y cortado por los brazos; no da por aprobado este encaje.** Es el chaleco de la imagen
  original (más ancho que nuestro torso, D-027 (1)); su arreglo es la guía 1 (camiseta y chaleco a nuestra medida). La
  imagen de ChatGPT de la guía 1 **todavía no ha llegado** a esta sesión, así que no hay montaje nuevo que enseñar.
  - Fila «Rodillas»: en su captura las rodillas ya salen con la piel (B). Comprobado además en Chromium con un iPhone 13
    simulado: al tocar «Conjunto de aventura» aparecen debajo de «Ropa» las filas «Mochila» y «Rodillas» (B marcada); no
    se ha podido comprobar en Safari ni en el iPhone real desde aquí.
- **19/10/2026 (8):** la propietaria **aprueba B2** («B + restos rosas corregidos», `integrar/piernas-b2/`, commit
  `09904fe`): queda **por defecto con el conjunto de aventura**; B y A se conservan como opciones. **La aprobación es solo
  de las rodillas**: el encaje de la camiseta y el chaleco sigue sin aprobar (pendiente de la imagen de la guía 1). La base
  aprobada no cambia: B2 es una copia que solo se usa con este conjunto.
- **19/10/2026 (9):** llega la **imagen de ChatGPT de la guía 1** (camiseta y chaleco a nuestra medida,
  `guia-chatgpt/1-camiseta-y-chaleco/de-chatgpt/`, sin modificar). La propietaria pide revisar el encaje y extraer **solo
  la camiseta y el chaleco**, conservando nuestra muñeca original.
  - Alineada por la silueta del cuerpo (escala 0,999, < 1 px); solo se toman la camiseta y el chaleco
    (`integrar/ropa/`). El chaleco queda **entre nuestros brazos**, con los hombros completos y sin tiras. Rosa de la base a
    la vista, sin mochila: 205 px sin pelo / 65 con la melena (antes 9 689 / 5 415).
  - Queda: un **filo rosa de 1–3 px en el borde exterior de las mangas** (la manga nueva es algo más estrecha que la de la
    base) y una **rayita en la cadera izquierda** (39 px, del pantalón original). Con la mochila, las tiras de la imagen
    original no encajan con este chaleco (guía 2 pendiente).
  - Visor: fila «Camiseta y chaleco» con el conjunto: «A nuestra medida (guía 1, candidata)», por defecto, y «De la
    imagen aprobada (anterior)». **Candidata, pendiente de revisión.**
- **19/10/2026 (10):** la propietaria pide una candidata que cubra el **filo rosa de las mangas con tela crema
  contigua** (conservando costuras y bordes suaves) y revisar **por separado los 39 px de la cadera** (qué debería verse
  antes de rellenar), con máscaras mínimas y conservando los originales; y probar la fila nueva en pantalla móvil.
  - **Cadera:** es el **contorno de nuestra cadera** (con el rosa de las mallas de la base) que sale 1–4 px por fuera del
    lateral del pantalón, en y ≈ 981–1004, justo encima de su bolsillo; en la imagen aprobada esa zona quedaba junto a la
    mochila. **Debería verse el lateral del pantalón verde** (la ropa tapa el cuerpo).
  - Hecho (`integrar/retocar_bordes.py` → `integrar/ropa-b/`, copias): máscaras `mascara-mangas.png` (389 px: el rosa que
    se ve en las mangas + 1 px) y `mascara-cadera.png` (87 px). Cada fila se rellena con la **misma fila de la tela,
    desplazada hacia fuera** lo que mide el filo (borde suave y costuras de la fila llegan al nuevo borde), cubriendo al
    menos lo que cubría la base; bajo el dobladillo de la manga derecha solo se cierra el borde suave donde ya había tela
    (alargar la manga dejaba dientes). La camiseta y el pantalón **cambian solo dentro de sus máscaras**; los originales
    no cambian.
  - Rosa a la vista sin mochila: **mangas 154 → 0 px, cadera 39 → 0 px; total 205 → 12** (quedan 4 px en la cintura
    derecha, entre el chaleco y el pantalón, y 8 px en la abertura entre las piernas, fuera de lo pedido).
  - Visor: «A nuestra medida + filos de mangas y cadera (candidata)», por defecto; se conservan «A nuestra medida (guía 1,
    sin retocar)» y «De la imagen aprobada (anterior)». Probada la fila en un iPhone 13 simulado (aparece al tocar el
    conjunto, los tres botones caben y cambian las capas correctas); no en el iPhone real.
- **19/10/2026 (11):** la propietaria pide corregir también **los 12 px restantes** con máscaras mínimas (tela contigua en la
  cintura; transparencia en la abertura solo donde corresponda al fondo), conservando los originales, dejar **«Sin
  mochila» por defecto** mientras faltan las tiras nuevas y enseñarle **el conjunto limpio para aprobarlo**.
  - Hecho (`integrar/limpiar_ultimos.py`, copias): **cintura derecha** (16 px): el contorno de nuestra cintura salía 1–2 px
    fuera de la camiseta, bajo el chaleco: se cubre con la camiseta estirada en la misma fila (`integrar/ropa-c/`);
    **abertura entre las perneras** (35 px): la parte alta del hueco del pantalón, unida al fondo que ya había debajo:
    transparente solo en los píxeles rosas de la base dentro de la abertura (`integrar/piernas-b2c/`). Las capas cambian
    solo dentro de sus máscaras; B2, la camiseta de `ropa-b` y los originales no cambian.
  - **Rosa de la base a la vista: 0 px.** Hoja `integrar/conjunto-limpio.png` (con la melena y sin pelo, sin mochila).
  - Visor, con el conjunto: «Sin mochila» por defecto («Con mochila» avisa de que lleva las tiras de la imagen original);
    «A nuestra medida, sin restos rosas (candidata)» y «B2 + abertura limpia (candidata)» por defecto. **Pendiente de la
    aprobación de la propietaria.**
- **19/10/2026 (12):** la propietaria **no aprueba todavía el conjunto**: se ven cortes y huecos del pantalón en la cintura y
  las caderas, bajo el chaleco. Pide revisar cada unión pierna–calcetín–bota (posición, escala y recorte sobre nuestra base,
  no solo el rosa), correcciones en copias y el antes y después sin pelo. La mochila, para después.
  - Encontrado y corregido (`integrar/ajustar_pantalon_y_pies.py`, copias en `integrar/ropa-d/`):
    **cadera izquierda y bolsillo:** al separar la imagen, la zona de la mochila se quedó con el lateral del pantalón; se
    toman de nuevo de la imagen aprobada (810 px reales). **Cintura:** el chaleco de la imagen tapaba las esquinas de
    arriba del pantalón y el nuevo, más estrecho, las dejaba ver cortadas (362 px de hueco): se completan con la tela del
    propio pantalón de debajo, reflejada por columnas y saltando su franja de arriba (que traía pespuntes del chaleco),
    con el canto de fuera suavizado. **Chaleco:** su canto de abajo traía un halo claro del fondo (una raya sobre el
    pantalón): mismo alfa, color del píxel opaco más cercano (395 px). **Calcetines:** nuestras piernas son 2–6 px más
    anchas por dentro: cada calcetín se ajusta fila a fila a nuestra pierna (+1 px) con un cambio de escala horizontal
    suave (≤ 8 % y ≤ 11 %), sin estirar sus bordes (eso dejaba una franja borrosa): pierna asomando de 171 a 0 px.
    **Botas:** ya tapaban del todo nuestros pies y la caña la pierna; se quita el trozo de sombra del suelo que la bota
    derecha llevaba pegado (626 px).
  - Visor: «Ajustada: cintura, caderas, calcetines y botas (candidata)», por defecto; se conservan las anteriores.
    Hoja `integrar/ropa-d/antes-despues.png` (sin pelo). **Conjunto pendiente de aprobación; mochila aparcada.**
- **20/10/2026 (13):** llega de ChatGPT el **cuerpo completo de la mochila, sin tiras** (fondo transparente; guardado sin
  cambios en `guia-chatgpt/2-mochila/de-chatgpt/`). La propietaria pide colocarlo detrás de nuestra muñeca ajustando solo
  escala y posición, sin deformarlo ni cambiar el conjunto de `f857193`; verlo con la melena, la coleta y las dos coletas;
  comprobar que al quitarlo no queda nada, y añadirlo al visor como candidato. Las tiras nuevas, después; no usar las
  antiguas para dar el montaje por terminado.
  - Hecho (`integrar/colocar_mochila.py` → `integrar/mochila-b/`): misma escala en los dos ejes, **0,38** (la de la
    imagen aprobada, medida por el bolsillo lateral), sin giro; fondo en y ≈ 1 000. En la copia, interior de alfa 253 → 255
    y fuera unas motas casi invisibles (alfa 1–49) del fondo. **Dos candidatas de posición:** **A** centrada en nuestro
    torso (de frente casi no se ve: asoma entre los brazos y el cuerpo y, sin pelo que la tape, por encima de los hombros) y
    **B** como en la imagen aprobada (corrida hacia su derecha; se ve el bolsillo junto al brazo y, con la coleta o sin pelo,
    la parte de arriba sobre el hombro). Va detrás de todo, también del pelo de detrás (melena y coletas caen por delante).
  - Al quitarla, **idéntico píxel a píxel** con los tres peinados (con la melena, igual que en `f857193`).
  - Visor: fila «Mochila» con «Cuerpo nuevo centrado, sin tiras (candidata A)», «… como en la imagen aprobada, sin tiras
    (candidata B)», la anterior y «Sin mochila» (por defecto). El conjunto se ve ya con la **melena, la coleta y las dos
    coletas** (piel clara y castaño; con la melena, sus mechones limpios).
  - Visto al revisarlo (anterior a esta tarea, no tocado): con la coleta, un trocito suelto (≈ 74 px) de su pelo de detrás
    junto al cuello; con las dos coletas, restos rosas del vestido entre los rizos y las mangas (con el vestido los tapaban
    sus mangas). Se pueden limpiar como el pelo de la melena (`pelo-sin-restos/`) cuando la propietaria lo pida.
- **20/10/2026 (14):** la propietaria **elige la mochila A** (centrada en el torso), por defecto con el conjunto; **B se
  conserva** como alternativa en el visor. Pide seguir con **las tiras nuevas sobre los hombros tomando A como referencia**,
  y copias limpias del pelo para el conjunto (el fragmento junto al cuello de la coleta y los restos rosas de las dos
  coletas), conservando los rizos y los originales, con el antes y después.
  - Tiras: guía 2b preparada sobre A (`guia-chatgpt/2-mochila/plantilla-tiras-con-mochila-a.png`, `guia-tiras-sobre-a.png`
    y mensaje en su `LEEME.md`). Como nuestro chaleco cubre los hombros hasta la manga, se piden **por encima del chaleco**
    (por debajo no se verían). Recepción: `integrar/recibir.py tiras-a`. Falta hacerla en ChatGPT.
  - Pelo (`base-aprobada-d013-2026-10-14/pelo-sin-restos/limpiar_coletas.py`, copias en esa carpeta, cinco colores): coleta,
    2 trozos sueltos que no eran pelo (89 px junto al cuello y 229 px tapados detrás); dos coletas, 2 608 px de rosa del
    vestido entre los rizos (el canto, con el color del pelo de al lado; los huecos al fondo, transparentes). Con el conjunto,
    el visor usa las copias; con el vestido, los originales. **Candidato, pendiente de revisión.**
- **20/10/2026 (15) · corrección del estado:** la propietaria **aprobó visualmente el conjunto sin mochila de `f857193`**
  (camiseta de `integrar/ropa-c/`, pantalón, chaleco, calcetines y botas de `integrar/ropa-d/`, rodillas B2c); lo dijo al
  pedir la mochila («sin … cambiar el conjunto aprobado de f857193») y no se registró entonces: se corrige aquí. **Esa
  aprobación se mantiene.** Confirma también las **tiras por encima del chaleco**. Quedan pendientes: **las tiras nuevas**
  (guía 2b sobre la mochila A) y **la revisión del pelo limpio** de la coleta y las dos coletas. Sin probar en el iPhone real.
- **20/10/2026 (16):** llega de ChatGPT la imagen de las **tiras sobre la mochila A** (guardada sin cambios). La
  propietaria pide extraer **solo las dos tiras y sus hebillas** con `recibir.py tiras-a`, conservando nuestra muñeca y el
  conjunto aprobado; comprobar que conectan con la mochila A; revisar los tres peinados; que al quitar la mochila
  desaparezcan también las tiras, y enseñarlo como candidato.
  - ChatGPT redibujó la muñeca y el chaleco (escala 1,0115 por los ojos; contornos a 1–5 px; ribete de las solapas algo
    movido), así que la primera extracción (todo lo nuevo y verde) tomaba también su chaleco. `tiras-a` se rehace: por
    cada lado, el tramo de arriba y el de abajo (apertura más ancha que el ribete), una banda fila a fila con el ancho de la
    tira, **la hebilla entera** (la caja de su marco dorado, con esquinas redondeadas) y la punta, que se estrecha y pasa
    por detrás del chaleco. Resultado: 15 065 px; nada de la muñeca ni del chaleco de ChatGPT.
  - Conexión con A: arriba, las tiras tapan la franja de la mochila que asomaba sobre los hombros (salen de ella).
  - Visor: «A (elegida) con las tiras nuevas (candidatas)», por defecto, y «A sin tiras». Las tiras van encima del chaleco
    y debajo de los brazos y del pelo de delante; solo con la mochila A. Al quitar la mochila, idéntico píxel a píxel
    (los tres peinados). **Candidatas, pendientes de aprobación.**
- **21/10/2026 (17):** la propietaria **aprueba las tiras nuevas con la mochila A** y pide conservar esa combinación por
  defecto con el conjunto (en el visor, «A con las tiras nuevas (aprobada)»; «A sin tiras», B, la anterior y «Sin mochila»
  se conservan como opciones). Sigue pendiente la revisión del pelo limpio de la coleta y las dos coletas. **Siguiente:**
  adaptar el conjunto a los tonos de piel y colores de pelo aprobados (hoy, solo piel clara y castaño). Sin probar en el
  iPhone real.
- **21/10/2026 (18):** la propietaria pide el conjunto con **los 4 tonos de piel y los 5 colores de pelo aprobados**, con
  melena, coleta y dos coletas, conservando el conjunto, la mochila A y las tiras; revisar en especial rodillas, brazos y
  bordes de mangas, calcetines y pelo (halos o restos del tono anterior); añadirlo al visor como candidatas y enseñar las
  comparaciones, también del pelo limpio pendiente.
  - Hecho (`integrar/pieles/conjunto_pieles.py`, con la transformación aprobada de `piel_tonos`): por tono, la **base B2c**
    (la del tono aprobada y, solo en las rodillas, B2c transformada), **bordes de la ropa y de las tiras** (solo la parte de
    piel clara de sus bordes pasa a la piel nueva; el contorno no cambia) y copias de los **bordes del pelo** aprobados sin
    lo que cae sobre la ropa del conjunto o sobre el pelo limpiado.
  - Pelo (`pelo-sin-restos/limpiar_conjunto.py` → `pelo-sin-restos/conjunto/`): melena sin el **rosa del vestido** en el
    canto de los rizos (con el vestido largo no se veía) y **rendijas de puntos claros** entre los rizos y el brazo
    rellenadas con pelo (dos coletas y melena).
  - Visor: con el conjunto, los cuatro tonos y los cinco colores con los tres peinados; con un tono que no es el claro, solo
    la versión aprobada (prendas ajustadas, rodillas B2c, mochila A o B). Revisadas las 60 combinaciones en capturas.
    **Candidatas, pendientes de revisión** (también el pelo limpio). Sin probar en el iPhone real.
- **22/10/2026 (19):** la propietaria **aprueba visualmente las variantes revisadas del conjunto** (4 tonos de piel × 5
  colores de pelo, con melena, coleta y dos coletas; mochila A con las tiras) **y el pelo limpio** (coleta, dos coletas y
  melena para el conjunto), **sin dar por probadas individualmente las 60 combinaciones en su iPhone**. Se conservan las
  versiones anteriores (prendas, rodillas, mochilas y pelo sin limpiar siguen en el visor y en sus carpetas). Siguiente:
  el **pijama** y después la **ropa de hada** (todavía sin diseño ni referencia en el proyecto).

## D-026 · Peinado nuevo: dos coletas rizadas bajas con coleteros verdes y sombrero de aventura · 17/10/2026
- **Decisión de la propietaria:** «Apruebo esta propuesta como peinado nuevo: dos coletas rizadas bajas con coleteros
  verdes y sombrero de aventura». Referencia (generada, sin modificar):
  `docs/propuestas/peinado-coletas-sombrero-2026-10-17/referencias/referencia-coletas-sombrero-aprobada.png`.
- **Cómo:** capas de pelo de delante, pelo de detrás, coleteros y sombrero sobre nuestra base original, sin tomar la cara,
  las orejas, la piel, el cuerpo ni el vestido de la imagen. Se conservan los peinados anteriores. Primero, el encaje en el
  visor con piel clara y pelo castaño, como candidato. El sombrero debe poder quitarse más adelante: se identifica el pelo
  oculto que habrá que completar en ChatGPT, sin inventarlo en la extracción.
- **Hecho (`peinado-coletas-sombrero-2026-10-17/`):** cuatro capas encajadas con la escala de los ojos, sin deformar.
  Cejas y ojos libres (el ala a 11 px de las cejas); nada de la piel ni de las orejas de la imagen.
  - **Pelo oculto bajo el sombrero** (lo alto de la cabeza, frente, sienes y bajo el ala): marcado; guía y plantilla para
    ChatGPT en `guia-chatgpt/`.
  - **Defecto señalado:** la imagen termina a media altura de las coletas; sus puntas quedan cortadas en línea recta
    (también en la guía). Entre las coletas y el cuello se ve el fondo (natural; se deja así salvo que se pida).
  - En el visor: «Dos coletas con sombrero (candidato)», solo con piel clara y pelo castaño, sin accesorio ni corona.
- **Estado (18/10):** peinado, dos coletas completas (con y sin sombrero) y sus variantes de color de pelo y tono de piel **aprobados visualmente**; en la copia aislada `prueba-juego-d026`, pendiente de probar en el iPhone. Melena por defecto.
- **Límites:** solo en propuestas; no se activa en el juego; no cambian `main`, las partidas ni las pruebas congeladas.
- **17/10/2026 (2):** llega la **propuesta de ChatGPT sin sombrero y con las coletas enteras**
  (`referencias/referencia-coletas-sin-sombrero-puntas.png`, sin modificar). La propietaria pide usarla como fuente del
  pelo bajo el sombrero y de las puntas, midiendo la alineación antes, tomando solo lo necesario con uniones naturales y
  conservando cara, orejas, cuerpo, vestido, coleteros y el pelo aprobado que pueda mantenerse; puntas completas con y
  sin sombrero, como candidatas en el visor, conservando el montaje anterior.
  - Hecho (`completar_pelo.py`, `capas/completado/`): otro encuadre (escala 0,833); con la escala de los ojos la cara
    coincide (0,3 px) y los coleteros quedan 4,5 px más arriba. Se toman solo las puntas (bajo el corte, con 60 px de
    franja) y, sin sombrero, el pelo por encima de los coleteros. Nuestra cara y orejas no cambian; fuera de la zona, el
    pelo aprobado es idéntico.
  - Uniones: puntas 18,6 % con diferencia alta, bajo los coleteros 10,7 % (por el desfase de 4,5 px); a la vista, ampliado,
    los rizos continúan sin cortes. Marcado en `capas/completado/uniones.png`.
  - En el visor, fila «Dos coletas»: montaje anterior (por defecto) · con sombrero y puntas completas · sin sombrero y
    puntas completas (**candidatas**). Nada activado en el juego.
- **18/10/2026 (3):** la propietaria **aprueba visualmente las dos candidatas con las puntas completas**, con sombrero y
  sin sombrero (`capas/completado/`, commit `ee8e1b4`). Al elegir el peinado queda seleccionada **la versión completa con
  sombrero**; se conservan la opción sin sombrero y el montaje anterior (puntas cortadas) como referencia. Pide las
  variantes con los 5 colores de pelo y los 4 tonos de piel, con los coleteros verdes, las cejas a juego y nuestra cara y
  orejas, revisando bordes y parpadeo, primero en el visor.
  - Hecho (`coletas2_variantes.py`, `capas/variantes/`, `capas/pieles/`, `revision-variantes/`): el color de pelo con la
    transformación de la melena (alfa igual); coleteros y sombrero sin cambios; base, ojos, manos y cejas a juego de cada
    tono; y una capa pequeña de bordes por tono, versión y color (franja de 5 px junto a la piel; no toca el pelo más
    allá: 0 px).
  - **Defectos encontrados y corregidos en las variantes:** la capa de pelo aprobada tenía encima de nuestras orejas
    restos de la oreja de la imagen generada (con piel clara no se notaban; con piel oscura salían claros): se quitan y
    se ve nuestra oreja. Sin sombrero, faltaba pelo de detrás justo detrás del borde suave de nuestras orejas (se veía una
    línea clara): se rellena con el pelo de al lado. Por eso el castaño con piel clara cambia ligeramente respecto a las
    capas aprobadas, solo en las orejas (que ahora son exactamente las nuestras).
  - En el visor: «Dos coletas (aprobadas)»; fila «Dos coletas»: Con sombrero (aprobada, por defecto) · Sin sombrero
    (aprobada) · Montaje anterior (referencia, solo piel clara y castaño). **Aprobación visual de las variantes, pendiente.**
- **18/10/2026 (4):** la propietaria **aprueba visualmente las variantes revisadas** (colores de pelo y tonos de piel de
  las dos coletas completas, commit `e9b1305`). La aprobación es **visual** (imágenes de revisión y visor): las 40
  combinaciones **no se han probado una a una en su iPhone** (solo la prueba automática en Chromium con iPhone simulado).
  Pide una **copia aislada nueva del juego** con los tres peinados y los accesorios aprobados, respetando sus
  compatibilidades; la melena, predeterminada. Hecha: `docs/propuestas/prueba-juego-d026/` (datos propios `d026:`,
  20/20 en Chromium; **pendiente de probar en el iPhone**). `main`, partidas y pruebas congeladas sin cambios.
- **18/10/2026 (5):** adornos para las dos coletas, candidatos (D-024 (11)): flores, mariposa y dos lazos pequeños en los
  coleteros, con y sin sombrero; diadema y corona solo sin sombrero (con él, el sombrero las tapa). Las dos coletas no
  cambian.
- **18/10/2026 (6):** adornos con las dos coletas **aprobados visualmente** (D-024 (12)); no probadas una a una todas las
  combinaciones en el iPhone.

## D-025 · Peinado nuevo: coleta alta rizada con cinta deportiva lila · 16/10/2026
- **Decisión de la propietaria:** «Apruebo esta propuesta como peinado nuevo: coleta alta rizada con cinta deportiva
  lila. La melena suelta se conserva como otra opción». Referencia (generada, sin modificar):
  `docs/propuestas/peinado-coleta-2026-10-16/referencias/referencia-coleta-cinta-aprobada.png`.
- **Cómo:** separar el pelo de delante, el de detrás y la cinta, para poder ponerla y quitarla; bajo la cinta debe haber
  pelo completo (si la imagen no lo permite, guía para completarlo en ChatGPT). Adaptar las piezas a nuestra base, sin
  sustituir la cara, el cuerpo ni el vestido.
- **Estado (17/10):** peinado, encaje con cinta, pelo sin cinta y **colores de pelo y tonos de piel aprobados
  visualmente** (ver (6) y (7)); no probado en el iPhone (ni cada una de las 40 combinaciones por separado). Historia: bajo la cinta no había pelo en la imagen; se
  completó con la guía de `peinado-coleta-2026-10-16/guia-chatgpt/`.
- **Límites:** solo en propuestas; no se activa en el juego; no cambian `main`, las partidas ni las pruebas congeladas.
- **16/10/2026 (2):** la propietaria **aprueba visualmente la coleta con cinta sobre nuestra muñeca** (`capas/`, commit
  `cca9f34`). **La melena suelta sigue siendo la opción predeterminada.** Siguen pendientes: quitar la cinta (pelo bajo
  la cinta, guía para ChatGPT) y adaptar la coleta a los colores de pelo y a los tonos de piel. Originales, `main`,
  partidas y pruebas congeladas sin cambios.
- **16/10/2026 (3):** llega la **propuesta de pelo sin la cinta** (generada en ChatGPT con la guía,
  `referencias/referencia-coleta-sin-cinta.png`, sin modificar). Alineación comprobada (desplazamiento < 0,3 px; cara y
  fondo iguales). Se toma solo el pelo de la zona de la cinta con un margen mínimo (3 px) y se **revisan las uniones
  antes de integrarlo**: **fallan** (la de abajo, sobre la frente, en el 98 %; la de arriba en el 32 %; las puntas en el
  52 %; quedan 14 px de restos lila). **Marcadas** en `uniones/uniones-marcadas.png`; **no se integra** ni se añade al
  visor la opción de quitar la cinta. Capas aprobadas sin cambios.
- **16/10/2026 (4):** la propietaria pide **ampliar lo mínimo** la zona (unos 15–20 px por abajo y solo lo necesario en las
  puntas y arriba) en una **copia candidata**, siguiendo las curvas del pelo, sin tocar piel, frente, cara ni silueta.
  Hecho (`capas/candidata-sin-cinta/`): **la unión de abajo queda limpia** (falla 0,5 %), sin restos lila y sin tocar
  piel ni silueta; **todavía fallan la de arriba (22 %) y las puntas (19 %)**: queda una franja algo más oscura (la sombra
  de la cinta) justo fuera de los 8 px permitidos arriba. **Marcado; no se añade al visor**, a la espera de decidir si se
  amplía más arriba y en las puntas. La coleta con cinta aprobada no cambia.
- **16/10/2026 (5):** la propietaria da margen para ampliar arriba y en las puntas lo necesario, dentro del pelo, sin
  tocar piel, cara, silueta ni la coleta con cinta aprobada. Probado 14, 18, 22, 26, 32, 40 y 50 px: **con 32 px las
  uniones quedan limpias** (arriba 3,7 %, puntas 1 %, abajo 0 %; sombra de la cinta 14 px; sin restos lila; piel y
  silueta sin tocar). Revisado a tamaño de juego y ampliado, en fondo claro y oscuro. **En el visor como candidata**
  («Cinta: Con cinta (aprobada) · Sin cinta (candidata)»); **aprobación visual pendiente**.
- **16/10/2026 (6):** la propietaria **aprueba visualmente la coleta sin cinta** (`capas/candidata-sin-cinta/`, commit
  `4b13e91`) y pide **conservar las dos opciones** (con cinta y sin cinta) y adaptar ahora la coleta, con y sin cinta, a
  los **cinco colores de pelo** y los **cuatro tonos de piel**, con las cejas a juego, revisando el nacimiento del pelo,
  las sienes, las orejas, el cuello y el parpadeo, y añadirlo **primero al visor**. **La melena sigue siendo la opción
  predeterminada.** Hecho (`coleta_variantes.py`, `capas/variantes/`, `capas/pieles/`):
  - las **orejas** de la coleta (que son las de la imagen aprobada y estaban dentro del pelo) pasan a una capa propia
    debajo de su pelo; con piel clara y pelo castaño el montaje es **el aprobado** (diferencia máxima 1 de 255);
  - **color de pelo:** la misma transformación de cada color que la melena, solo en el pelo (las orejas no cambian);
  - **tono de piel:** las orejas con la transformación aprobada de la piel (en su luminosidad, la media con la que
    conserva el contraste relativo, para que sus sombras y su línea dibujada no se vuelvan negras); y una capa pequeña
    de bordes por tono, versión y color en el nacimiento del pelo, las sienes, junto a las orejas y el cuello (franja de
    ≤ 5 px; no toca el pelo más allá) y en la franja del cuero cabelludo;
  - cejas a juego, ojos (abiertos y cerrados), base y manos: las aprobadas de cada tono.
  En el visor: «Peinado: Melena suelta (aprobada) · Coleta rizada (aprobada)» y «Cinta: Con cinta (aprobada) · Sin
  cinta (aprobada)»; con la coleta se pueden elegir la piel, el color de pelo, las cejas y los ojos (el accesorio de pelo
  y la corona vuelven a la melena). **Aprobación visual de las combinaciones, pendiente.** Capas aprobadas, `main`,
  partidas y pruebas congeladas sin cambios.
- **17/10/2026 (7):** la propietaria **aprueba visualmente el resultado de la coleta con los colores de pelo y los
  tonos de piel revisados** (commit `199dce1`: orejas en capa propia, colores de pelo, orejas de cada tono y capas de
  bordes; revisión en `revision-variantes/` y en el visor). Se conservan **las dos opciones, con cinta y sin cinta**, y
  **la melena suelta sigue siendo la predeterminada**. La aprobación es **visual** (imágenes de revisión y visor): las
  40 combinaciones **no se han probado una a una en su iPhone**; lo comprobado de las 40 es la prueba automática del
  visor en Chromium con pantalla de iPhone simulada. Pendiente: copia de prueba del juego y prueba en el iPhone.
  `main`, partidas y pruebas congeladas sin cambios.
- **18/10/2026 (8):** con la coleta (con y sin cinta) el **lazo** va ahora en la **base de la coleta** (candidato, ver
  D-024 (10)) y el peinado se conserva; los accesorios que todavía no son compatibles con la coleta se avisan y no se
  ponen, en lugar de volver a la melena. La coleta no cambia.
- **18/10/2026 (9):** la propietaria **aprueba visualmente el lazo con la coleta, con y sin cinta** (D-024 (11)). Con la
  coleta hay ahora candidatos de flores, mariposa, corona y, sin cinta, diadema (D-024 (11)); la diadema no va con la
  cinta. La coleta no cambia.
- **18/10/2026 (10):** adornos con la coleta **aprobados visualmente** (D-024 (12)); no probadas una a una todas las
  combinaciones en el iPhone.

## D-024 · Segunda colección de accesorios de pelo: diseño aprobado · 16/10/2026
- **Decisión de la propietaria:** «Apruebo los ocho diseños: lazo, pasador de flores, mariposa lila, diadema de estrellas,
  cinta deportiva, gorra, sombrero de aventura y gorrito de dormir». Láminas (imágenes generadas, sin modificar) en
  `docs/propuestas/accesorios-2026-10-16/referencias/`.
- **Estado:** **diseño aprobado** de los ocho; encaje aprobado del lazo, las flores, la mariposa y la diadema; lazo con la coleta, en su base: aprobado (18/10); flores, mariposa, diadema, corona y dos lazos pequeños con la coleta y las dos coletas: aprobados visualmente (18/10; no probados uno a uno en el iPhone); gorrito de frente, diseño y encaje del B aprobados (17/10; A, alternativa anterior; con la coleta, pendiente); gorra de frente, diseño y encaje aprobados (17/10; con la coleta, pendiente); cinta, gorra y sombrero, pendientes de versión de frente.
- **Cómo:**
  - Primero el lazo, las flores y la mariposa, cada uno como capa transparente independiente sobre los rizos originales,
    sin fondos, marcos ni textos; en el visor para revisarlos. Hecho (`accesorios-2026-10-16/capas/`).
  - Diadema, cinta y gorros: comprobar la perspectiva; si no encajan, preparar una guía para adaptarlos en ChatGPT sin
    deformar la cabeza ni el peinado. Comprobado: están en perspectiva de tres cuartos y no encajan de frente; guía en
    `accesorios-2026-10-16/guia-chatgpt/`.
  - Se conserva la corona y se puede quitar el accesorio elegido.
- **Límites:** solo en propuestas; no se activa en el juego; no cambian `main`, las partidas ni las pruebas congeladas.
- **16/10/2026 (2):** la propietaria **aprueba visualmente el lazo, el pasador de flores y la mariposa tal como están
  colocados** (`accesorios-2026-10-16/capas/capa-*.png`, commit `1b61877`). En el visor, **«Sin accesorio» sigue por
  defecto**. Siguen pendientes la versión de frente de la diadema, la cinta y los gorros (guía para ChatGPT), su
  encaje, una copia nueva de prueba del juego y 2000 × 3500.
- **16/10/2026 (3):** la propietaria **aprueba la diadema de frente, con las estrellas a un lado** (imagen generada en
  ChatGPT con la guía, `accesorios-2026-10-16/diadema/referencia-diadema-de-frente-aprobada.png`, sin modificar).
  - Extraídos solo el arco, las estrellas y las perlas, sin pelo ni piel de esa imagen; colocada sobre nuestra muñeca con
    la escala de los ojos (`diadema/capa-diadema.png`). La muñeca no cambia.
  - En el visor como **candidata**; **el encaje queda pendiente de revisión**. Diadema y corona se solapan: al elegir la
    diadema se quita la corona (se puede volver a poner).
  - Siguen pendientes la cinta, la gorra, el sombrero y el gorrito (versión de frente).
- **16/10/2026 (4):** la propietaria **aprueba visualmente la diadema tal como está colocada** (`diadema/capa-diadema.png`,
  commit `1d8f22d`). En el visor pasa a «Diadema de estrellas (aprobada)»; «Sin accesorio» sigue por defecto y se
  mantiene el comportamiento con la corona (al elegir la diadema se quita la corona; se puede volver a poner).
- **17/10/2026 (5):** la propietaria **aprueba el diseño frontal del gorrito de dormir** (imagen generada,
  `accesorios-2026-10-16/gorrito/referencia-gorrito-de-frente-aprobado.png`, sin modificar). Pide extraer solo el gorro y
  el pompón (sin pelo ni piel de la imagen) y colocarlo sobre nuestra muñeca con la melena suelta: que cubra el pelo de
  arriba sin deformar la cabeza, deje libres las cejas y conserve los rizos de los lados; si no cubre bien, señalar dónde
  antes de tocar el peinado. Al ponerlo se quitan la corona y los demás accesorios de cabeza.
  - Hecho (`gorrito/`): capa con la escala de los ojos, sin deformar. Cejas libres (0 px; a 6 px como mínimo), rizos de
    los lados conservados. **Cubre el 95,9 % del pelo de arriba: asoma una franja fina de rizos arriba a la izquierda**
    (hasta 22 px) y un mechoncito encima. Marcado en `gorrito/zonas-sin-cubrir.png`; **el peinado no se ha tocado**.
  - En el visor como **candidato** («Gorrito de dormir (candidato)»); «Sin accesorio» por defecto.
  - **Diseño aprobado; el encaje queda pendiente** (y qué hacer con el pelo que asoma).
- **17/10/2026 (6):** la propietaria pide una **variante con el gorrito un 6–9 % más grande**, ajustando su posición para
  cubrir el pelo de arriba y dejar las cejas libres, sin recortar ni deformar el peinado; conservar el candidato
  anterior y añadir la alternativa al visor, con la misma exclusión entre gorrito y corona.
  - Hecho (`gorrito/gorrito_grande.py`, `capa-gorrito-b.png`): **B = ×1,08 y 8 px a la izquierda**. Cubre el **99,9 %**
    del pelo de arriba (restos de 1–5 px junto al extremo derecho del ala); **cejas libres, a 14,6 px** (A: 6,3 px): el
    ala no puede quedar más cerca de las cejas si cubre el pelo. Peinado y cabeza sin cambios; A conservado.
  - En el visor: «Gorrito de dormir · A (candidato)» y «Gorrito de dormir · B, 8 % más grande (candidato)»; los dos
    quitan la corona y la corona los quita. **El encaje sigue pendiente de la revisión de la propietaria.**
- **17/10/2026 (7):** la propietaria **aprueba visualmente el gorrito B (un 8 % más grande) tal como está colocado**
  (`gorrito/capa-gorrito-b.png`, commit `738d9dc`): **opción elegida**; el A (`capa-gorrito.png`) queda como alternativa
  anterior. «Sin accesorio» sigue por defecto y se mantiene la exclusión con la corona.
  - Revisado con los 5 colores de pelo y los 4 tonos de piel sobre la melena (`gorrito/revision-b/`): cubre igual con
    todos (el pelo tiene la misma forma en los 5 colores) y el borde del gorro no deja halos con ningún color ni tono,
    en fondo claro y oscuro.
  - **Con la coleta no encaja todavía** (no se fuerza): el moño de la coleta asoma por encima del gorro (6 787 px) y sus rizos salen por la derecha, junto a la cola
  (en total 18 250 px de pelo de arriba fuera del gorro, con y sin cinta); la cinta queda tapada. **Necesita otra
    adaptación** (por ejemplo, un pelo de la coleta bajo el gorro o un gorro colocado para la coleta); con la coleta,
    elegir el gorrito sigue volviendo a la melena.
- **17/10/2026 (8):** la propietaria **aprueba el diseño frontal de la gorra rosa con el rayo bordado** (imagen generada,
  `accesorios-2026-10-16/gorra/referencia-gorra-de-frente-aprobada.png`, sin modificar). Pide extraer solo la gorra, sin
  pelo ni piel, y encajarla sobre nuestra muñeca con melena suelta, ajustando escala y posición para cubrir el pelo de
  arriba con las cejas libres, sin deformar la cabeza ni recortar los rizos; candidata en el visor, que se pueda quitar
  y que excluya la corona y los demás accesorios de cabeza.
  - Hecho (`gorra/`): solo la gorra (con su pestaña lila). Con la escala de los ojos la visera tapaba las cejas; se
    busca escala y posición: **×1,10, centrada y 4 px más abajo**. Cubre el **99,99 %** del pelo de arriba (zona fija:
    por encima de y = 300), **cejas libres a 6,3 px** (como en la imagen), ojos y rizos de los lados libres. Peinado y
    cabeza sin cambios.
  - En el visor como **candidata** («Gorra rosa del rayo (candidata)»); quita la corona y la corona la quita.
  - **Diseño aprobado; el encaje queda pendiente de revisión.**
- **17/10/2026 (9):** la propietaria **aprueba visualmente la gorra tal como está colocada** (`gorra/capa-gorra.png`,
  commit `839d38b`) y pide revisar sus bordes con los 5 colores de pelo y los 4 tonos de piel, conservando el encaje.
  - Revisado (`gorra/revision/`): en las 20 combinaciones, sobre fondo claro y oscuro, **sin defectos**: no hay halo
    claro ni oscuro en el borde de la visera, de los lados ni de la pestaña lila; solo puntos sueltos de 1 px del propio
    contorno de la gorra (41–73 más claros y 88–122 más oscuros de 1 092 px de borde, en número parecido en todas), que
    no se ven ni ampliados. **No hace falta corregir; la capa no cambia.**
  - En el visor pasa a «Gorra rosa del rayo (aprobada)»; «Sin accesorio» por defecto y la exclusión con la corona,
    igual. La adaptación a la coleta queda para más adelante.
- **18/10/2026 (10):** en la copia `prueba-juego-d026`, al poner el lazo con la coleta el juego cambiaba a la melena. La
  propietaria pide **colocar el lazo en la base de la coleta, como capa independiente, manteniendo el peinado**,
  reutilizando el lazo aprobado y ajustando solo escala, posición y giro; y **no cambiar de peinado sin avisar**: si otro
  accesorio no es compatible todavía, indicarlo y conservar la elección. Primero en el visor, con y sin cinta.
  - Hecho (`accesorios-2026-10-16/lazo-coleta/`): el mismo recorte aprobado (`capas/lazo-recortado.png`) con
    `colocar()`: **centro (612, 86), ancho 138 px (el de la melena), giro −32°** (melena: (642, 263), −18°). Una sola
    colocación vale **con y sin cinta** (la base de la coleta queda por encima de la cinta: 0 px de solape). 0 px sobre
    la piel que se ve, **100 % sobre el pelo** en las dos versiones; capas de la coleta y recorte sin cambios.
  - Visor: con la coleta, «Lazo de satén» pone esta capa y **se conserva la coleta** (con la melena, el lazo sigue en
    su sitio aprobado). Los demás accesorios de pelo y la corona, con la coleta o con las dos coletas, **no se ponen y
    sale un aviso** («… todavía no es compatible con la coleta: no se ha puesto y se conserva el peinado»); al cambiar
    a un peinado con algo que no es compatible, se quita **avisando**. Ya no se vuelve a la melena sin avisar.
  - **Candidato: el encaje queda pendiente de la revisión de la propietaria.** La copia `prueba-juego-d026` **no
    cambia** (sigue volviendo a la melena); una copia nueva, cuando se apruebe.
- **18/10/2026 (11):** la propietaria **aprueba visualmente el lazo con la coleta, con y sin cinta**
  (`lazo-coleta/capa-lazo-coleta.png`, commit `8f924e8`). Pide colocar ahora el pasador de flores, la mariposa, la
  diadema y la corona para la coleta y las dos coletas, y probar en las dos coletas dos lazos pequeños sobre los
  coleteros: las piezas aprobadas, solo con escala, posición y giro, sin deformar la cabeza ni el pelo; cada adorno
  independiente y conservando el peinado; candidatas en el visor; si alguna pieza pide otra perspectiva o la tapan la
  cinta o el sombrero, señalarlo sin forzarla. Los gorros, más adelante.
  - Hecho (`accesorios-2026-10-16/peinados/`, `colocar_peinados.py`): 15 capas candidatas, todas con **0 px sobre la
    piel que se ve y sobre las cejas**:
    - coleta con cinta: flores y mariposa en lo alto, sobre el moño, por encima de la cinta; corona encima de la cinta
      (×0,9);
    - coleta sin cinta: flores y mariposa en el lado de la frente (como con la melena); diadema y corona;
    - dos coletas con sombrero: flores y mariposa en la coleta izquierda, bajo el coletero; dos lazos pequeños;
    - dos coletas sin sombrero: flores y mariposa en el lado (como con la melena); diadema, corona y dos lazos pequeños.
  - Los **dos lazos pequeños**: el lazo aprobado a 75 px de ancho, uno en cada coletero (giro ±15°), por fuera de la
    cara; una sola capa.
  - **Incompatibles, sin forzar:** la **diadema con la coleta con cinta** (iría justo donde está la cinta) y la
    **diadema y la corona con las dos coletas con sombrero** (el sombrero las tapa; la corona, en un 86 %). Ninguna
    pieza ha necesitado otra perspectiva.
  - Diadema y corona: la capa aprobada recortada a su caja (mismos píxeles) y recolocada; flores, mariposa y lazo: sus
    recortes aprobados. Comprobaciones en `peinados/comprobaciones.json`; hoja `comparacion-adornos-peinados.png`.
  - Visor: cada adorno con la colocación de su peinado; lo que no es compatible no se pone y se avisa, y si al cambiar
    de peinado, de cinta o de sombrero deja de serlo, se quita avisando. **Candidatas, pendientes de revisión.** La
    copia `prueba-juego-d026` no cambia.
- **18/10/2026 (12):** la propietaria **aprueba visualmente las colocaciones revisadas** de los adornos con la coleta y
  las dos coletas (`peinados/capas/`, commit `06fdca5`): flores, mariposa, diadema, corona y los dos lazos pequeños en los
  coleteros, tal como están. **No se dan por comprobadas una a una todas las combinaciones en su iPhone** (lo comprobado
  son los 45 casos de la prueba del visor en Chromium con iPhone simulado). Se conservan las incompatibilidades (diadema
  con la cinta; diadema y corona con el sombrero; gorros con la coleta y las dos coletas) y los avisos, **sin cambiar de
  peinado automáticamente**. La integración en una copia nueva del juego queda para más adelante.

## D-023 · Tonos de piel claro (original), dorado, moreno y profundo: referencia aprobada · 16/10/2026
- **Decisión de la propietaria:** aprueba como referencia la lámina
  `docs/propuestas/base-aprobada-d013-2026-10-14/piel-tonos/referencia-tonos-piel-aprobados.png` (imagen generada,
  conservada sin modificar, SHA-256 `56e34450…d697`).
- **Cómo:** variantes de **nuestras piezas originales**, sin extraer la muñeca de la lámina ni cambiar sus facciones.
  - Toda la piel visible: cara, orejas, cuello, brazos, manos, piernas, pies y párpados cerrados; también los bordes de
    los ojos y las capas superpuestas, para que no queden parches del tono anterior.
  - Se conservan pecas, textura, volumen y expresión.
  - No cambian el pelo, la ropa, los adornos, los iris, los blancos ni las pestañas.
  - **El claro original sigue siendo la opción predeterminada.**
- **Estado:** la **referencia está aprobada**; **las capas quedan pendientes de revisión** (en el visor, con el
  parpadeo).
- **Límites:** no se activa en el juego, no se publica y no cambian `main`, las partidas ni las pruebas congeladas.
- **Pendiente:** revisión de las capas; copia nueva de prueba del juego; 2000 × 3500.
- **16/10/2026 (2):** la propietaria **no aprueba todavía el tono profundo**: en el iPhone ve restos claros en el
  nacimiento del pelo (también con el pelo pelirrojo) y en el contorno del ojo junto al lagrimal, y la piel, las orejas
  y los labios demasiado rojizos.
  - Pide una corrección localizada, sin oscurecer los blancos ni cambiar los iris, sin cambiar ni oscurecer los colores
    de pelo aprobados, comprobada con ojos abiertos y cerrados, pelo rubio y castaño y fondo claro y oscuro, y con el
    antes y el después. Hecha (`piel-tonos/LEEME.md`, «Corrección del 16/10»; imágenes en `piel-tonos/correccion-profundo/`).
  - El profundo y los demás tonos siguen **pendientes de revisión**; los originales aprobados no cambian.
- **16/10/2026 (3):** con piel profunda y pelo pelirrojo siguen apareciendo bordes claros. La propietaria pide revisar la
  corrección de la piel que se mezcla con los bordes de cada color de pelo, con el mismo tono de piel, sin cambiar ni
  oscurecer los colores de pelo aprobados. Hecho (corrección 2, `piel-tonos/LEEME.md`): los dos pelos y el cuello del
  vestido, junto a la piel que se ve. Sigue **pendiente de revisión**.
- **16/10/2026 (4):** la propietaria **aprueba visualmente los tonos de piel actuales** (claro, dorado, moreno y profundo,
  con las correcciones del 16/10; commit `d600d4c`). El claro original sigue siendo la opción predeterminada.
  - Pide una **copia aislada nueva** del juego con piel, colores de pelo, cejas a juego, ojos y pintacaras:
    `docs/propuestas/prueba-juego-d023/` (datos propios `d023:`), para probarla en el iPhone. **Sin probar todavía en
    el iPhone.**
  - Las pruebas congeladas (D-016/D-019 y D-021), `main` y las partidas de Amaia no cambian. Siguen pendientes
    2000 × 3500 y el paso al juego principal.

## D-022 · Tonos de pelo castaño chocolate, rubio miel, castaño oscuro y pelirrojo jengibre aprobados · 16/10/2026
- **Decisión de la propietaria:** aprueba los tonos de la segunda lámina,
  `docs/propuestas/base-aprobada-d013-2026-10-14/pelo-colores/referencia-tonos-pelo-aprobados.png` (imagen generada,
  conservada sin modificar, SHA-256 `649580bd…60e9`). **La comparación anterior queda descartada** (no está en el
  repositorio).
- **Cómo:** variantes que **solo recolorean nuestras capas de pelo aprobadas**, delante («mechones completos») y detrás
  (pelo B).
  - No se extrae el pelo de la lámina ni cambian su forma, posición, transparencia o encaje (alfa idéntico).
  - Se conservan el detalle de los rizos, las sombras y los brillos.
  - **El castaño original sigue siendo la opción predeterminada.**
- **Estado:** primero, en el visor para revisarlas; después, la integración en otra copia de prueba del juego.
- **Límites:** no se activa en el juego, no se publica y no cambian `main`, las partidas ni las pruebas congeladas.
- **Pendiente:** la revisión de las variantes (y de las cejas, que son de la base y siguen castañas); la copia de
  prueba; 2000 × 3500.
- **16/10/2026 (2):** la propietaria **aprueba visualmente las cuatro variantes** en el visor. **El castaño original
  sigue siendo la opción predeterminada.**
  - Pide una **propuesta de cejas** que acompañen cada tono, cambiando solo su color y conservando forma, detalle y
    expresión: para el rubio, algo más oscuras que el pelo; para el jengibre, castaño cobrizo suave. Preparada en
    `docs/propuestas/base-aprobada-d013-2026-10-14/cejas-colores/` (capas aparte, la base no cambia) y en el visor;
    **sin aprobar todavía**.
  - Siguen pendientes la copia de prueba del juego con los colores de pelo y 2000 × 3500. No cambian `main`, las
    partidas ni las pruebas congeladas.
- **16/10/2026 (3):** la propietaria **aprueba visualmente las cejas de los cuatro tonos** (`cejas-colores/`).
  - En el visor, **«A juego con el pelo» queda seleccionado por defecto**; se conserva la opción de usar las cejas
    originales de la base.
  - Con el castaño original se siguen viendo las cejas de la base (no lleva capa).
  - Siguen pendientes la copia de prueba del juego y 2000 × 3500; no cambian `main`, las partidas ni las pruebas
    congeladas.

## D-021 · Pintacaras «Estrellas y brillo»: diseño aprobado · 16/10/2026
- **Decisión de la propietaria:** «Apruebo la decoración de las mejillas: estrellas rosas, lilas y doradas con pequeños
  puntos de brillo». Referencia: `docs/propuestas/base-aprobada-d013-2026-10-14/pintacaras/referencia-pintacaras-aprobada.png`
  (imagen generada, conservada sin modificar, SHA-256 `526921fd…76a9`).
- **Cómo:** capa transparente **independiente** con **solo los adornos** (sin piel); no sustituye la cara original.
  - Encajada en nuestras mejillas, conservando las pecas y dejando libres ojos, pestañas y boca.
  - En el visor, opciones «Sin pintacaras» (por defecto) y «Estrellas y brillo», compatibles con todos los colores de
    ojos y con el parpadeo.
- **Estado:** el **diseño** está aprobado; **el encaje queda pendiente de revisión**.
- **Límites:** no se activa en el juego ni se publica; la prueba D-019 sigue congelada; no cambian `main` ni las partidas.
- **Pendiente:** revisión del encaje, resolución 2000 × 3500 e integración en una copia nueva de prueba del juego.
- **16/10/2026 (2):** la propietaria **aprueba visualmente el pintacaras sobre nuestra muñeca** (el encaje de
  `capa-pintacaras-estrellas.png`). Se conserva la opción de ponerlo y quitarlo («Sin pintacaras» sigue por defecto en
  el visor).
  - Pide una **copia aislada nueva** del juego con los cuatro colores de ojos y el pintacaras:
    `docs/propuestas/prueba-juego-d021/` (datos propios `d021:`), para probarla en el iPhone. **Sin probar todavía en
    el iPhone.**
  - La prueba D-019 sigue congelada; no cambian `main` ni las partidas. Siguen pendientes 2000 × 3500 y el paso al
    juego principal.

## D-020 · Tonos de ojos azul, verde y lila de fantasía aprobados · 16/10/2026
- **Decisión de la propietaria:** aprueba los tonos azul, verde y lila de fantasía de la referencia
  `docs/propuestas/base-aprobada-d013-2026-10-14/ojos-colores/referencia-tonos-aprobados.png` (imagen generada,
  conservada sin modificar, SHA-256 `378c5e4b…0f43`).
- **Cómo:** variantes de **nuestra** capa original de ojos abiertos, cambiando **solo el color de los iris**. No se
  extraen los ojos de la comparación.
  - Se conservan la textura, el sombreado, las pupilas, los brillos, el blanco, las pestañas, la posición y la
    transparencia.
  - Los marrones siguen como opción.
  - El parpadeo reutiliza los ojos cerrados V2.1 aprobados.
- **Estado:** primero, en el visor para revisarlos sobre la muñeca. La prueba D-019 sigue congelada; cualquier prueba
  nueva del juego irá en otra copia.
- **Pendiente:**
  - la revisión de las variantes;
  - la resolución 2000 × 3500;
  - el pintacaras de estrellas y brillo (siguiente paso, sin implementar; después, D-021).
- **Límites:** no se activa en el juego, no se publica y no cambian `main` ni las partidas.
- **16/10/2026 (2):** la propietaria **aprueba visualmente las tres variantes** en el visor (`capa-ojos-abiertos-azul.png`,
  `-verde.png` y `-lila.png`).
  - **Los marrones siguen siendo la opción predeterminada.**
  - La prueba D-019 sigue congelada; la integración de los colores irá en una **copia nueva** de prueba del juego.
  - Siguen pendientes la resolución 2000 × 3500 y el paso al juego principal.

## D-019 · Prueba aislada D-016 aprobada en el iPhone · 15/10/2026
- **Decisión de la propietaria:** «He probado la copia D-016 en mi iPhone y el resultado me parece perfecto». Aprueba la
  prueba aislada del juego con el conjunto completo (D-016 + D-017 + D-018) a 948 × 1659.
- **Lo que confirma expresamente:** que la ha probado en su iPhone y que el resultado le parece perfecto.
- **Lo que NO ha confirmado expresamente** (no se da por comprobado):
  - con qué navegador o modo la abrió (Safari o la app añadida a la pantalla de inicio);
  - pantallas o pasos concretos («Vestir», «Mi Mundo», parpadeo, guardar y recuperar, datos ficticios, copias de
    seguridad, cada combinación);
  - que el aislamiento de datos funcione en Safari;
  - el funcionamiento sin conexión (la copia no lo tiene);
  - el iPad.
- **Referencia estable:** commit `22d96e9` (`docs/propuestas/prueba-juego-d016/`), la versión que estaba en la rama
  cuando la propietaria la probó.
  - Enlace fijo: <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/22d96e912412942abdb4733cff314250fd901f4a/docs/propuestas/prueba-juego-d016/index.html>.
  - La etiqueta de Git `prueba-d016-aprobada` no se ha podido subir desde este entorno (solo se pueden subir ramas);
    si se quiere, se puede crear desde la web de GitHub sobre ese commit.
  - La carpeta no debe cambiar; cualquier cambio irá en otra copia.
- **Pendiente:**
  - la resolución real de 2000 × 3500;
  - pasar el conjunto al juego principal (no se hace todavía).
- **Límites:** no se publica; no cambian `main`, el juego ni las partidas.

## D-018 · Diseño de la corona dorada aprobado (solo diseño) · 15/10/2026
- **Decisión de la propietaria:** aprueba el **diseño** de la corona dorada con perlitas y corazón rosa.
- **Referencia:** `docs/propuestas/corona-2026-10-15/referencia-muneca-con-corona.png`, imagen generada conservada sin
  modificar (SHA-256 `fb822741…bdc9`). No sustituye a la base, a su cara ni al conjunto D-016/D-017.
- **Capa candidata:** `…/montaje/corona-candidata.png` (SHA-256 `c6072538…952f`). Solo la corona, con los huecos
  transparentes, sin mover ni escalar y encima de todas las capas.
- **Pendiente:**
  - la revisión del **encaje**, aparte de la aprobación del diseño;
  - la resolución real de 2000 × 3500;
  - la integración en el juego.
- **Límites:** opción de prueba en el visor; no se activa en el juego, no se publica y no cambian `main` ni los datos
  guardados.
- **15/10/2026 (2):** la propietaria **aprueba visualmente el encaje** de la corona sobre la muñeca, sin mover ni
  escalar, y **el conjunto completo**:
  - base D-014, pelo «mechones completos» y pelo B detrás, ojos v3 / V2.1 (D-016);
  - vestido opción B + axilas (D-016);
  - zapatos rosa (D-017);
  - corona dorada (D-018).

  La corona queda seleccionada por defecto en el visor y se conserva la opción «Sin corona». **Sigue pendiente:** la
  resolución real de 2000 × 3500 y la integración en el juego. No se activa nada.

## D-017 · Diseño de los zapatos rosa aprobado (solo diseño) · 15/10/2026
- **Decisión de la propietaria:** aprueba el **diseño** de los zapatos: rosa satinado, punta redonda, tira y lazo con
  corazón dorado.
- **Referencia:** `docs/propuestas/zapatos-rosa-2026-10-15/referencia-muneca-con-zapatos.png`, imagen generada
  conservada sin modificar (SHA-256 `5b491087…6501`). No sustituye a la base, a su cara ni al conjunto D-016.
- **Capa candidata:** `…/montaje/zapatos-candidatos.png` (SHA-256 `aebe594c…a96f`). Zapato izquierdo sin mover y
  derecho +2 px en horizontal, sin escala.
- **Pendiente:**
  - la aprobación del **encaje**, que es aparte de la del diseño;
  - la resolución real de 2000 × 3500;
  - la integración en el juego.
- **Límites:** opción de prueba en el visor; no se activa en el juego, no se publica y no cambian `main` ni los datos
  guardados.
- **15/10/2026 (2):** la propietaria **aprueba visualmente** los zapatos sobre la muñeca, con la colocación de
  `zapatos-candidatos.png` (izquierdo sin mover, derecho +2 px, sin escala).
  - Quedan seleccionados por defecto en el visor junto al conjunto D-016; se conserva la opción «Descalza».
  - **Sigue pendiente:** la resolución real de 2000 × 3500 y la integración en el juego. No se activa nada.

## D-016 · Conjunto con vestido rosa elegido (aprobación visual) · 15/10/2026
- **Decisión de la propietaria:** aprueba **visualmente** este conjunto sobre la base D-014:
  - **Vestido:** opción B con las axilas completadas,
    `docs/propuestas/vestido-rosa-2026-10-15/opcion-b/vestido-opcion-b-axilas-completadas.png` (SHA-256 `705a6e44…0219`).
  - **Pelo de delante:** «mechones completos»,
    `…/redistribucion-hombros/mechones-completos-chatgpt/pelo-delante-mechones-completos.png` (SHA-256 `75981ade…2c05`).
  - **Pelo de detrás:** pelo B sin mechón, `…/variante-experimental/pelo-variante-sin-mechon-detras.png` (SHA-256 `40950160…f3fb`).
  - **Ojos:** abiertos v3 color experimental y cerrados V2.1.
  - **Montaje:** base sin ojos v3, con los antebrazos y las manos de la base delante de la falda.
- **Visor:** este conjunto queda seleccionado por defecto en `docs/propuestas/base-aprobada-d013-2026-10-14/visor/`.
- **Se conservan** todas las alternativas anteriores: vestido original y opción B sin axilas; pelo B y propuestas A, B
  y C; prueba C + ChatGPT 1.
- **Pendiente:** la resolución real de **2000 × 3500**. Hoy todo está a 948 × 1659, y parte del pelo y del vestido
  sale de imágenes generadas. También están pendientes la integración en el juego (capas, catálogo, `sw.js`) y las
  pruebas en el iPhone/iPad reales.
- **Límites:** es una aprobación visual de propuestas. No se activa en el juego, no se publica y no cambian `main` ni
  los datos guardados.

## D-015 · Diseño del vestido rosa de princesa aprobado (solo diseño) · 15/10/2026
- **Decisión de la propietaria:** aprueba el **diseño** del vestido rosa de princesa de la muñeca nueva y el **largo y
  ancho** que se ven en la muñeca vestida, conservada sin modificar en
  `docs/propuestas/vestido-rosa-2026-10-15/referencia-muneca-vestida.png` (948 × 1660, SHA-256 `6932d7bf…59e8`).
- **Alcance:**
  - Es una aprobación de **diseño**, no de la capa.
  - La imagen es una referencia generada: no sustituye a la base D-014, a su carita, a los ojos actuales ni al pelo B.
- **Pendiente (aprobación técnica, aparte):**
  - capa del vestido solo, que es candidata y aún no ha llegado;
  - encaje sobre la base: cuello, mangas, cintura y bajo, sin que asomen la camiseta ni las mallas, y con las manos y
    el pelo de delante por delante;
  - bordes y transparencia;
  - resolución real de 2000 × 3500.
- **15/10/2026:** llega la candidata de capa (`vestido-candidato-original.png`, sin modificar). La prueba de encaje
  (`montaje/`) **no es la aprobación técnica**: fallan las axilas, los hombros (capa cortada por el pelo de la
  referencia) y hay manchitas sueltas. Está pendiente de decisión.
- **15/10/2026 (2):** la propietaria elige la **opción B**: una copia limpia (sin puntos sueltos, cuerpo y forro opacos,
  bordes suaves y tul conservados) y completar las **axilas** con la herramienta de imagen de ChatGPT, sin ilustradora.
  **No se aplica la opción C**: la base no se toca. Corrección del diagnóstico: en los hombros **no falta tela**; el
  corte es el borde del pelo de delante (pelo B). La copia B es una propuesta, no la aprobación técnica.
- **15/10/2026 (3):** primer relleno de las axilas con ChatGPT: alineado, pero **no encaja**, porque deja fondo blanco
  en 381 px de la zona. No se integra; se conserva como registro.
- **15/10/2026 (4):** la propietaria pide completar las axilas por **edición de píxeles** (textura copiada de la tela
  contigua, con transición suave), en una copia. Hecho: `opcion-b/vestido-opcion-b-axilas-completadas.png`. Fuera de
  la máscara es idéntica, sin blanco y sin camiseta visible. Es una **candidata**, en el visor; **pendiente de su
  aprobación**.
- **Límites:** sin activar en el juego, sin publicar, sin cambios en `main` ni en los datos guardados.

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
