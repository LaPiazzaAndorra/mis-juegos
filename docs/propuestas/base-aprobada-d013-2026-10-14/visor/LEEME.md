# Visor aislado de la muñeca · propuesta · 15/10/2026

Página de revisión **aislada**: no es el juego, no se publica y no forma parte de la app. Solo pone una encima de otra
imágenes que ya están en la rama `avatar-creador`; no retoca ninguna.

**Abrir en Safari (iPhone/iPad):**
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/base-aprobada-d013-2026-10-14/visor/index.html>

Capas, de abajo arriba (948 × 1659):

1. Pelo B detrás: `../pelo-borrador-d012/revision-localizada/variante-experimental/pelo-variante-sin-mechon-detras.png`
2. Base sin ojos v3: `../sin-ojos/base-sin-ojos-propuesta-v3.png`
3. Ojos abiertos v3 color experimental: `../ojos-abiertos/capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png`, o bien
   ojos cerrados V2.1: `../ojos-cerrados/capa-ojos-cerrados-prueba-v21.png`
4. *(Opciones de ropa)* vestido original candidato `../../vestido-rosa-2026-10-15/vestido-candidato-original.png`
   u opción B limpia `../../vestido-rosa-2026-10-15/opcion-b/vestido-opcion-b.png`,
   u opción B con axilas completadas `../../vestido-rosa-2026-10-15/opcion-b/vestido-opcion-b-axilas-completadas.png`,
   y antebrazos y manos copiados de la base `../../vestido-rosa-2026-10-15/montaje/brazos-delante-copiados-de-la-base.png`
5. Pelo B delante (o, con la opción «Pelo», las propuestas A / B de
   `../pelo-borrador-d012/revision-localizada/variante-experimental/redistribucion-hombros/`): `../pelo-borrador-d012/revision-localizada/variante-experimental/pelo-variante-sin-mechon-delante.png`

Controles:

- **Ojos:**
  - Parpadear: los ojos se cierran 200 ms y el cambio de capa es instantáneo, como en el juego.
  - Parpadeo automático: cada 2,5–5 s.
  - Mantener cerrados.
- **Ropa:** camiseta de la base, vestido original (prueba), vestido limpio · opción B u opción B + axilas (candidata).
- **Pelo:** pelo B actual, propuesta A / B / C (mechones) en hombros y pecho, C + ChatGPT 1 (prueba) o mechones completos (alternativa).
- **Ver:** entera, cara, ojos, cuello con orejas y vestido. También hay un deslizador de zoom; se puede arrastrar con un dedo y
  pellizcar con dos dentro del visor.
- **Fondo:** claro, oscuro, rosa o cuadros, para ver la transparencia.
- **Capas:** mostrar u ocultar el pelo de detrás, el pelo de delante y los ojos.

**Seguridad de los datos:**
- No usa `localStorage`, `sessionStorage`, IndexedDB ni cookies, no registra ningún service worker y no lee partidas
  ni copias.
- Solo pide la página y sus imágenes (catorce en total).
- `raw.githack.com` es la misma dirección de la versión de pruebas, pero el visor no lee ni escribe nada en ella, y es
  otra dirección distinta del juego de Amaia.

**Probado** en Chromium con pantalla de iPhone simulada (390 × 844), sin errores en la consola:
- carga de las cinco capas, encuadres, parpadeo y ojos cerrados;
- almacenamiento vacío y ningún service worker;
- a tamaño real, el resultado coincide con `montaje-variante-sin-mechon-abiertos.png` en todo lo opaco (diferencia ≤ 2).
  Solo difiere en los bordes semitransparentes exteriores, porque el montaje de Python usa una mezcla de opacidad
  simplificada y el navegador compone de forma estándar.

**Sin probar** en un iPhone o iPad reales.

Si GitHub tarda en refrescar, `raw.githack.com` puede servir la versión anterior unos minutos. Para ver una versión
concreta, se cambia `avatar-creador` por el hash de un commit en el enlace.

**15/10/2026:** se añade la opción del vestido. Probada igual: sin errores, almacenamiento vacío y, a tamaño real,
coincide con `montaje-vestido-abiertos.png` en lo opaco (≤ 2).
**15/10/2026 (2):** se añade la opción B. Sin errores y sin almacenamiento; coincide con `montaje-opcion-b-abiertos.png`
en lo opaco (≤ 2).
**15/10/2026 (3):** se añade «Opción B + axilas (candidata)». Sin errores y sin almacenamiento; coincide con
`montaje-axilas-completadas-abiertos.png` en lo opaco (≤ 2).
**15/10/2026 (4):** se añaden las propuestas A y B del pelo en los hombros. Sin errores; coincide con
`montaje-vestido-pelo-redistribuido-b.png` en lo opaco (≤ 2).
**15/10/2026 (5):** se añade «Hombros · C (mechones)». Sin errores; coincide con `montaje-vestido-mechones-c.png`
en lo opaco (≤ 2).
**15/10/2026 (6):** se añade «C + ChatGPT 1 (prueba)». Sin errores ni almacenamiento.
**15/10/2026 (7):** se añade «Mechones completos (alternativa)». Sin errores; coincide con
`montaje-mechones-completos.png` en lo opaco (≤ 2).
**15/10/2026 (8) · D-016:** el visor abre por defecto con el conjunto elegido: vestido «Opción B + axilas (elegida)» y
pelo «Mechones completos (elegido)». Las demás opciones siguen disponibles. Probado: sin errores ni almacenamiento;
coincide con `montaje-mechones-completos.png` en lo opaco (≤ 2).
**15/10/2026 (9) · D-017:** opción «Zapatos» (descalza por defecto o zapatos rosa en prueba) y encuadre «Pies». La
escena tiene ahora un alto fijo (60 % de la pantalla) para que no se encoja en el iPhone con tantos botones. Probado:
sin errores ni almacenamiento; coincide con `montaje-zapatos.png` en lo opaco (≤ 2).
**15/10/2026 (10) · D-017:** el visor abre con los zapatos rosa («Zapatos rosa (elegidos)»); «Descalza (D-016)» se
conserva. Coincide con `montaje-zapatos.png` en lo opaco (≤ 2).
**15/10/2026 (11) · D-018:** opción «Corona» (sin corona por defecto, o corona dorada en prueba, encima de todo) y
encuadre «Corona». Sin errores ni almacenamiento; coincide con `montaje-corona.png` en lo opaco (≤ 2).
**15/10/2026 (12) · D-018:** el visor abre con el conjunto completo aprobado (vestido, zapatos y corona «elegida»); se
conserva «Sin corona». Coincide con `montaje-corona.png` en lo opaco (≤ 2).
**16/10/2026 · D-020:** fila «Color de ojos» (Marrones · Azules · Verdes · Lilas). Solo cambia la imagen de los ojos
abiertos; el parpadeo usa los cerrados V2.1 con cualquier color. Sin errores ni almacenamiento.
**16/10/2026 (2) · D-020:** las tres variantes están aprobadas visualmente; el visor sigue abriendo con los **marrones**.
**16/10/2026 (3) · D-021:** fila «Pintacaras» («Sin pintacaras» por defecto · «Estrellas y brillo», encaje en
revisión) y encuadre «Mejillas». La capa va encima de los ojos y no cambia con el color ni con el parpadeo. Probado con
los 4 colores, «Parpadear» y «Mantener cerrados»: sin errores ni almacenamiento; a tamaño real coincide con
`montaje-corona.png` + la capa en lo opaco (≤ 2). Corregido además el atributo `class` mal cerrado de las capas del
vestido y de las manos (sin cambio visible).
**16/10/2026 (4) · D-021:** encaje del pintacaras aprobado visualmente; el botón pasa a «Estrellas y brillo (aprobado)» y
«Sin pintacaras» sigue por defecto.
**16/10/2026 (5) · D-022:** fila «Color de pelo» (Castaño original por defecto · Castaño chocolate · Rubio miel ·
Castaño oscuro · Pelirrojo jengibre). Cambia las imágenes del pelo elegido, delante y detrás («mechones completos» y
pelo B); con otra propuesta de pelo de delante vuelve al castaño. Probado con los colores de ojos, el pintacaras y el
parpadeo: sin errores ni almacenamiento; a tamaño real coincide con el montaje de cada color en lo opaco (≤ 3).
**16/10/2026 (6) · D-022:** las cuatro variantes de pelo están aprobadas visualmente; el castaño original sigue por
defecto. Fila «Cejas» (propuesta): «De la base (castañas)» por defecto o «A juego con el pelo», que pone encima de la
base la capa de cejas del color de pelo elegido (con el castaño, las de la base). Sin errores ni almacenamiento; a
tamaño real coincide con el montaje en lo opaco (≤ 3).
**16/10/2026 (7) · D-022:** cejas a juego aprobadas visualmente. El visor abre con «A juego con el pelo (elegidas)» y
conserva «Originales de la base (castañas)»; con el castaño original se ven las de la base. Sin errores ni
almacenamiento.
**16/10/2026 (8) · D-023:** fila «Piel» (Claro (original) por defecto · Dorado · Moreno · Profundo). Cambia la base, los
ojos abiertos (del color elegido) y cerrados, las manos, las cejas a juego y tres capas pequeñas de «bordes» (pelo de
delante, cuello del vestido y zapatos), que solo se ven si se ve la capa a la que acompañan. Probado con los colores de
ojos y de pelo, cejas, camiseta, descalza, otro pelo de delante y parpadeo: sin errores ni almacenamiento; a tamaño real
coincide con el montaje en lo opaco (≤ 3).
**16/10/2026 (9) · D-023:** el visor no cambia; se han regenerado las piezas de los tonos de piel (corrección
localizada del profundo, aplicada también a dorado y moreno). Sin errores; a tamaño real coincide con el montaje (≤ 3).
**16/10/2026 (10) · D-024:** fila «Accesorio de pelo» («Sin accesorio» por defecto · Lazo de satén · Pasador de flores ·
Mariposa lila), encaje en revisión. Uno cada vez, encima del pelo y debajo de la corona (que sigue en su fila). Probado
con y sin corona y con otra piel y otro color de pelo: sin errores ni almacenamiento; a tamaño real coincide con el
montaje en lo opaco (≤ 3).
**16/10/2026 (11) · D-024:** lazo, pasador de flores y mariposa aprobados visualmente tal como están colocados; el visor
sigue abriendo con «Sin accesorio». No cambia el visor.
**16/10/2026 (12) · D-024:** «Diadema de estrellas (candidata)» en la fila «Accesorio de pelo» (encaje pendiente de
revisión). Al elegirla se quita la corona (van en el mismo sitio); se puede volver a poner. Sin errores ni almacenamiento.
**16/10/2026 (13) · D-024:** diadema aprobada visualmente: el botón pasa a «Diadema de estrellas (aprobada)». «Sin
accesorio» sigue por defecto y al elegir la diadema se sigue quitando la corona (se puede volver a poner).
**16/10/2026 (14) · D-025:** fila «Peinado» («Melena suelta (aprobada)» por defecto · «Coleta rizada con cinta
(candidata)»). La coleta cambia las capas de pelo (detrás, delante y cinta) y, por ahora, solo va con piel clara, pelo
castaño, sin accesorio ni corona; elegir otra cosa vuelve a la melena. Sin errores ni almacenamiento; a tamaño real
coincide con el montaje (≤ 3).
**16/10/2026 (15) · D-025:** coleta con cinta aprobada visualmente: el botón pasa a «Coleta rizada con cinta (aprobada)».
La melena suelta sigue por defecto; el resto del comportamiento no cambia.
**16/10/2026 (16) · D-025:** con la coleta, fila «Cinta» («Con cinta (aprobada)» por defecto · «Sin cinta (candidata)»).
Sin cinta se usan las capas candidatas con el pelo completo bajo la cinta; con la cinta, las aprobadas (igual que antes).
Sin errores; a tamaño real coincide con el montaje en los dos casos (≤ 3).
**16/10/2026 (17) · D-025:** coleta sin cinta aprobada visualmente («Sin cinta (aprobada)»; el botón del peinado pasa a
«Coleta rizada (aprobada)»). La coleta, con y sin cinta, sigue ahora a la **piel** y al **color de pelo** (y a las cejas
y los ojos): pelo del color elegido sin las orejas, orejas en su capa (debajo de su pelo, del tono de la piel) y, con otra
piel, la capa de bordes de la coleta (encima del pelo de delante, debajo de la cinta). El accesorio de pelo, la corona y
los otros pelos de delante siguen volviendo a la melena. Melena por defecto. Probado en Chromium (pantalla de iPhone
simulada): las 40 combinaciones (con y sin cinta × 4 pieles × 5 colores) con las capas correctas y todas cargadas, el
parpadeo con cada piel, sin errores ni almacenamiento; a tamaño real coincide con el montaje en lo opaco (≤ 3).
**17/10/2026 (18) · D-025:** colores de pelo y tonos de piel de la coleta aprobados visualmente. El visor no cambia
(melena por defecto; con y sin cinta). Sin probar en el iPhone.
**17/10/2026 (19) · D-024:** «Gorrito de dormir (candidato)» en la fila «Accesorio de pelo» (encaje pendiente). Al ponerlo
se quitan la corona y los demás accesorios de cabeza; poner la corona quita el gorrito; «Sin accesorio» sigue por defecto.
Con la coleta, elegirlo vuelve a la melena. Sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2).
**17/10/2026 (20) · D-024:** dos candidatos del gorrito: «Gorrito de dormir · A (candidato)» (el anterior) y «Gorrito de
dormir · B, 8 % más grande (candidato)». Los dos quitan la corona al ponerlos y la corona los quita; «Sin accesorio» por
defecto. Sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2).
**17/10/2026 (21) · D-024:** gorrito B aprobado: «Gorrito de dormir (aprobado)»; el A pasa a «Gorrito de dormir · A
(alternativa anterior)». «Sin accesorio» por defecto; los dos siguen quitando la corona y la corona los quita. Probado
con las 20 combinaciones de piel y pelo sobre la melena. Con la coleta, elegirlo sigue volviendo a la melena (no encaja
todavía).
**17/10/2026 (22) · D-024:** «Gorra rosa del rayo (candidata)» en la fila «Accesorio de pelo» (encaje pendiente). Al
ponerla se quitan la corona y los demás accesorios de cabeza; poner la corona la quita; «Sin accesorio» por defecto. Con
la coleta, elegirla vuelve a la melena. Sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2).
**17/10/2026 (23) · D-024:** gorra aprobada: el botón pasa a «Gorra rosa del rayo (aprobada)». «Sin accesorio» por
defecto y la exclusión con la corona, igual.
**17/10/2026 (24) · D-026:** fila «Peinado»: «Dos coletas con sombrero (candidato)» (pelo detrás, pelo delante, coleteros
y sombrero). Por ahora solo con piel clara y pelo castaño, sin accesorio ni corona; elegir otra piel, otro color, un
accesorio, la corona u otro pelo de delante vuelve a la melena (por defecto). Sin errores ni almacenamiento; a tamaño real
coincide con el montaje (≤ 2).
**17/10/2026 (25) · D-026:** con las dos coletas, fila «Dos coletas»: «Con sombrero, puntas cortadas (montaje anterior)»
por defecto · «Con sombrero y puntas completas (candidata)» · «Sin sombrero y puntas completas (candidata)». Sin errores
ni almacenamiento; a tamaño real coincide con el montaje (≤ 2) en las dos candidatas.
**18/10/2026 (26) · D-026:** «Dos coletas (aprobadas)». Fila «Dos coletas»: «Con sombrero (aprobada)», seleccionada al
elegir el peinado · «Sin sombrero (aprobada)» · «Montaje anterior, puntas cortadas (referencia)» (solo piel clara y
castaño). Las dos completas siguen a la piel, al color de pelo, a las cejas y a los ojos (capa de bordes por tono, debajo
de coleteros y sombrero). Probadas las 40 combinaciones y el parpadeo; sin errores; a tamaño real coincide (≤ 3).
**18/10/2026 (27) · D-024 · D-025:** con la coleta (con y sin cinta), «Lazo de satén (con la coleta: en su base,
candidato)» pone el lazo en la base de la coleta (`accesorios-2026-10-16/lazo-coleta/`) y **se conserva el peinado**;
con la melena, el lazo sigue en su sitio. Ya **no se vuelve a la melena sin avisar**: con la coleta o las dos coletas,
los demás accesorios de pelo, la corona y las opciones del pelo de la melena no se ponen y sale un aviso abajo; al
elegir un peinado con algo que no es compatible, se quita avisando. Corregido también que las filas «Cinta» y «Dos
coletas» se veían con cualquier peinado. Sin errores ni almacenamiento; a tamaño real, con lazo = sin lazo + la capa
(≤ 1).
**18/10/2026 (28) · D-027:** fila «Ropa»: «Conjunto de aventura (candidato)» (camiseta, chaleco, pantalón, calcetines,
botas y mochila) y, con él, fila «Mochila»: «Con mochila (candidata)» · «Sin mochila (faltan los hombros, ver guía)». Por
ahora con piel clara, pelo castaño y melena: al elegirlo se pasa a esa combinación avisando, y con él puesto otra piel,
otro color, otro peinado u otro pelo de delante no se aplican y se avisa. Las botas sustituyen a los zapatos rosa (que
vuelven con otra ropa). Con este conjunto, la melena usa una copia de su pelo de delante sin 9 trocitos sueltos del
vestido. Sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 4 en lo opaco).
**18/10/2026 (29) · D-024 · D-025 · D-026:** lazo con la coleta aprobado: «Lazo de satén (con la coleta: en su base,
aprobado)». Candidatos con la coleta y las dos coletas: el pasador de flores, la mariposa, la diadema y la corona usan la
colocación de cada peinado (`accesorios-2026-10-16/peinados/`), y hay un botón nuevo «Dos lazos pequeños en los coleteros
(dos coletas, candidatos)». No compatibles (no se ponen y se avisa, con el motivo): la diadema con la coleta con cinta; la
diadema y la corona con las dos coletas con sombrero; los dos lazos pequeños con la melena y la coleta; los gorros con la
coleta y las dos coletas. Si al cambiar de peinado, de cinta o de sombrero un adorno deja de ser compatible, se quita
avisando. Probados los 45 casos (5 peinados × 9 adornos); sin errores ni almacenamiento; a tamaño real, con adorno = sin
adorno + la capa (≤ 2).
**18/10/2026 (30) · D-027:** con el conjunto de aventura, el pelo de delante limpio sale ahora de
`pelo-sin-restos/pelo-delante-castano-sin-restos.png` (mismos píxeles que antes). Nada más cambia.
**18/10/2026 (31) · D-024:** colocaciones con la coleta y las dos coletas aprobadas visualmente: el botón pasa a «Dos
lazos pequeños en los coleteros (dos coletas, aprobados)». Incompatibilidades y avisos, igual; no se cambia de peinado
automáticamente.
**18/10/2026 (32) · D-027:** con el conjunto de aventura, fila «Rodillas»: «Base aprobada (mallas)» · «Piel completada · A
(solo la zona)» · «Piel completada · B (+6 px bajo el borde, candidata)», por defecto. Cambia solo la imagen de la base
mientras se lleva el conjunto (la aprobada vuelve al quitarlo). A tamaño real coincide con el montaje (≤ 4).
**19/10/2026 (33) · D-027:** rodillas B aprobadas: «Piel completada · B (+6 px bajo el borde, aprobada)», por defecto con el
conjunto; la imagen de B se ha regenerado con el paso suave de 3 px.
**19/10/2026 (34) · D-027:** fila «Rodillas»: nueva opción «B + restos rosas corregidos (candidata)»; B sigue por defecto.
**19/10/2026 (35) · D-027:** rodillas B2 aprobadas: «B + restos rosas corregidos (aprobada)», por defecto con el conjunto;
B y A se conservan.
**19/10/2026 (36) · D-027:** con el conjunto, fila «Camiseta y chaleco»: «A nuestra medida (guía 1, candidata)», por
defecto, y «De la imagen aprobada (anterior)». «Sin mochila» ya no avisa de los hombros (con la camiseta nueva están
completos). A tamaño real coincide con el montaje (≤ 3).
**19/10/2026 (37) · D-027:** fila «Camiseta y chaleco»: «A nuestra medida + filos de mangas y cadera (candidata)», por
defecto (camiseta y pantalón de `integrar/ropa-b/`), «A nuestra medida (guía 1, sin retocar)» y «De la imagen aprobada
(anterior)». Probada en un iPhone 13 simulado (tocando); a tamaño real coincide con el montaje (≤ 3).
**19/10/2026 (38) · D-027:** con el conjunto, por defecto: «Sin mochila» («Con mochila» avisa de que lleva las tiras de la
imagen original; nuevas pendientes), «A nuestra medida, sin restos rosas (candidata)» (camiseta de `integrar/ropa-c/`) y
«B2 + abertura limpia (candidata)» (`integrar/piernas-b2c/`). B2 aprobada se conserva como opción. A tamaño real coincide
con el montaje (≤ 3); comprobado también en un iPhone 13 simulado.
**19/10/2026 (39) · D-027:** fila «Camiseta y chaleco»: «Ajustada: cintura, caderas, calcetines y botas (candidata)», por
defecto (pantalón, chaleco, calcetines y botas de `integrar/ropa-d/`, camiseta de `integrar/ropa-c/`); «A nuestra medida,
sin restos rosas» pasa a «(anterior)». Probadas las cuatro opciones en un iPhone 13 simulado; a tamaño real, sin pelo,
coincide con el montaje (≤ 3).
**20/10/2026 (40) · D-027:** fila «Mochila»: «Cuerpo nuevo centrado, sin tiras (candidata A)», «Cuerpo nuevo como en la
imagen aprobada, sin tiras (candidata B)» (`integrar/mochila-b/`, detrás de todas las capas, también del pelo de detrás),
«Mochila anterior (con las tiras de la imagen original)» y «Sin mochila» (por defecto). Con el conjunto se pueden elegir ya
la melena, la coleta y las dos coletas (piel clara y castaño). Al quitar la mochila, idéntico píxel a píxel; con la melena,
igual que en `f857193`. Probado en escritorio a tamaño real y en un iPhone 13 simulado (tocando).
**20/10/2026 (41) · D-027:** con el conjunto, **mochila A por defecto** («Cuerpo nuevo centrado, sin tiras (A,
elegida)»); B, la anterior y «Sin mochila» se conservan. Con el conjunto, el pelo de detrás de la coleta (con y sin cinta)
y de las dos coletas (con y sin sombrero) usa las copias sin restos de `../pelo-sin-restos/`; sin él, los originales.
**20/10/2026 (42) · D-027:** el botón «Ajustada: cintura, caderas, calcetines y botas» pasa a «(aprobada)»: la
propietaria aprobó visualmente el conjunto sin mochila de `f857193`. Nada más cambia.
**20/10/2026 (43) · D-027:** fila «Mochila»: «A (elegida) con las tiras nuevas (candidatas)», por defecto con el
conjunto (capa `c-av-tiras2`, `integrar/mochila-b/tiras.png`, encima del chaleco y debajo de los brazos y del pelo de
delante), y «A sin tiras»; B, la anterior y «Sin mochila» se conservan. Las tiras solo van con la mochila A: al quitarla
desaparecen (idéntico píxel a píxel con los tres peinados).
**21/10/2026 (44) · D-027:** el botón por defecto de la fila «Mochila» pasa a «A con las tiras nuevas (aprobada)». Nada
más cambia.
**21/10/2026 (45) · D-027:** con el conjunto se pueden elegir los **cuatro tonos de piel** y los **cinco colores de pelo**,
con la melena, la coleta y las dos coletas (candidatas): base B2c del tono, capas `c-av-bordes-ropa` (encima de la ropa) y
`c-av-bordes-tiras` (encima de las tiras), bordes del pelo para el conjunto (`integrar/pieles/<tono>/`) y pelo limpio de
`pelo-sin-restos/conjunto/`. Con un tono que no es el claro, solo la versión aprobada (prendas ajustadas, rodillas B2c,
mochila A o B): las otras opciones avisan. Fuera del conjunto, todo como antes (originales y bordes aprobados).
**22/10/2026 (46) · D-028:** fila «Ropa»: «Pijama (candidato)»: capas `c-pij-zapatillas`, `c-pij-pantalon` y
`c-pij-camiseta` (`pijama-2026-10-22/integrar/capas/`) sobre la base original, sin los brazos de delante del vestido;
pelo limpio para la ropa (como el conjunto); por ahora solo con la piel clara (otro tono avisa). A tamaño real coincide con
los montajes (≤ 3).
**22/10/2026 (47) · D-028:** el pijama con los **cuatro tonos de piel** (candidatos): capa `c-pij-bordes`
(`pijama-2026-10-22/integrar/pieles/<tono>/bordes-ropa.png`), bordes del pelo de esa carpeta y pelo de detrás de
`pijama-2026-10-22/integrar/pelo/`; la camiseta es la del borde limpio (`integrar/capas-b/`). Ya no avisa al elegir otro tono.
**22/10/2026 (48) · D-028:** con el pijama, fila «Camiseta del pijama»: «Borde de las mangas limpio (candidata)», por
defecto (`integrar/capas-b/`), y «Aprobada (75e2cb5)» (`integrar/capas/`, sin cambios). (Con la aprobada, la capa de
bordes de los tonos es la calculada para la del borde limpio: difieren solo en ese borde.)
**22/10/2026 (49) · D-028:** «Pijama (aprobado)»; en «Camiseta del pijama», «Borde de las mangas limpio (aprobada)» (por
defecto) y «Anterior (75e2cb5)». Nada más cambia.
**22/10/2026 (50) · D-029:** fila «Ropa»: «Hada (candidato)» (piel clara): capas `c-hada-alas` / `c-hada-alas-solas` (detrás
de todo), `c-hada-bailarinas`, `c-hada-vestido`, `c-hada-varita` y `c-hada-dedos` (`hada-2026-10-22/integrar/capas/`), con la
base `hada-2026-10-22/integrar/base-hada.png` y el pelo limpio para la ropa. Fila «Hada»: alas del diseño (por defecto),
alas solas o sin alas; con o sin varita. Otro tono avisa. A tamaño real coincide con los montajes (≤ 3).
