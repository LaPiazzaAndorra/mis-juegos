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
