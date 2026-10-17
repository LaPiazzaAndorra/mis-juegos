# Registro de decisiones

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

## D-024 · Segunda colección de accesorios de pelo: diseño aprobado · 16/10/2026
- **Decisión de la propietaria:** «Apruebo los ocho diseños: lazo, pasador de flores, mariposa lila, diadema de estrellas,
  cinta deportiva, gorra, sombrero de aventura y gorrito de dormir». Láminas (imágenes generadas, sin modificar) en
  `docs/propuestas/accesorios-2026-10-16/referencias/`.
- **Estado:** **diseño aprobado** de los ocho; encaje aprobado del lazo, las flores, la mariposa y la diadema; gorrito de frente, diseño y encaje del B aprobados (17/10; A, alternativa anterior; con la coleta, pendiente); gorra de frente, diseño aprobado y encaje candidato (17/10); cinta, gorra y sombrero, pendientes de versión de frente.
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
