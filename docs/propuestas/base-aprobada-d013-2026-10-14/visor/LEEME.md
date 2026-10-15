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
