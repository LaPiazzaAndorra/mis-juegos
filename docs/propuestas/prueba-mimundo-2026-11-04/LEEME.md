# Mi Mundo jugable: habitación, catálogo ilustrado y misiones (D-033) · 04/11/2026

**Copia aislada. No es el juego de Amaia y no se publica.** Es lo publicado en `main` (la prueba completa, D-032) con
**Mi Mundo jugable** en el escenario «habitación». Datos propios con el prefijo **`mmu1:`**; sin service worker (la copia
necesita conexión; el juego sin conexión se comprueba aparte, abajo). Las demás escenas siguen como hoy.

**Abrir en Safari:** <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-mimundo-2026-11-04/index.html>
(el enlace fijo, con el hash del commit, en `docs/REGISTRO_CAMBIOS.md`).

## Qué hay

- **Habitación** con el fondo y la cama de la prueba de la habitación (D-031, propuestos; las imágenes recibidas, sin
  modificar, en `recibidas/`).
- **La muñeca guardada:** se arrastra o camina (tocar el suelo); en la cama se acuesta (tocar la cama o soltarla encima),
  con los ojos cerrados y sin alas, mochila ni varita a la vista (vuelven al levantarla; lo guardado no cambia).
- **Catálogo ilustrado** en la bandeja de abajo (sin emojis): tocar un objeto lo pone en la habitación; se arrastra (cambia
  de tamaño con la profundidad), 🗑️ lo quita. Los **juguetes se guardan** soltándolos en la cesta y **se sacan** tocándola.
  Los objetos son gratis; el candado por logros está preparado para los futuros desbloqueables.
- **Misiones opcionales** (botón 🎯, solo en la habitación): «**Guardar los juguetes**»: aparecen la cesta y cuatro
  juguetes por el suelo, lejos de la muñeca; cada juguete soltado en la cesta cuenta (aviso «1 de 4» con puntos), y al
  terminar hay celebración y **1 ⭐**, y queda anotada. Se puede dejar con ✖ y repetir. Estructura preparada para otros
  tipos de objetivo: **encontrar** (pistas) y **poner** (merienda para tres).
- **Datos:** `mm_habitacion2` (habitación) y `mm_misiones` (misiones); entran en «Guardar / Recuperar mi progreso»
  (prefijo `mm_`). No se tocan `mm_hab` ni `sc_habitacion`.

**Una misión solo se ofrece cuando todos sus objetos tienen ilustración, y un objeto sin ilustración no sale en el
catálogo:** no hay dibujos de relleno. Hoy solo está ilustrada la cama, así que en la copia se ve la habitación con la cama
y la misión aún no aparece.

## Ilustraciones que necesitamos (para la misión «Guardar los juguetes»)

Cinco piezas, cada una **por separado**, en **el mismo estilo, cámara y luz que la cama** (tres cuartos, desde delante y un
poco desde arriba, luz cálida de la ventana), **PNG con el fondo transparente**, el interior **totalmente opaco**, **sin
motitas** alrededor, **sin sombra en el suelo** (se pone aquí), sin texto ni personajes, con la base apoyada en el suelo y
de buen tamaño (unos 800–1200 px de alto). Se guardan tal cual en `recibidas/` con estos nombres:

| Archivo | Pieza | Tamaño real (para la escala) |
| --- | --- | --- |
| `recibidas/cesta.png` | **Cesta de juguetes** de mimbre claro, abierta por arriba, vacía, con un lazo rosa | 40 cm de alto |
| `recibidas/osito.png` | **Osito de peluche** sentado, mirando al frente | 32 cm |
| `recibidas/pelota.png` | **Pelota** rosa con rayas blancas | 24 cm |
| `recibidas/cubos.png` | **Cubos de colores** apilados (tres o cuatro, colores pastel) | 20 cm |
| `recibidas/cuento.png` | **Libro de cuentos** cerrado, tumbado en el suelo, tapa con una estrella | 18 cm |

Mensaje para generarlas (adjuntando la cama aprobada como referencia de estilo):

> Dibuja, en el mismo estilo, cámara y luz que esta cama, [la pieza]. Vista de tres cuartos, desde delante y un poco desde
> arriba, luz cálida desde la izquierda. Fondo transparente (PNG), sin sombra en el suelo, sin texto ni personajes, la
> pieza sola y entera, apoyada en el suelo.

Con ellas: `python3 docs/propuestas/prueba-mimundo-2026-11-04/preparar_piezas.py` las comprueba (transparencia, interior
opaco, motitas), las recorta y mide su punto de apoyo; la misión aparece sola en la copia.

Para las misiones siguientes (más adelante): **encontrar con pistas** usará estos objetos y muebles donde esconderlos
(baúl, cojines, cortina…); **merienda para tres**: mesa infantil, tres sillas o cojines, tres platos, tres tazas, tetera,
galletas y dos peluches invitados.

## Sin conexión (requisito)

`herramientas/publicar/preparar_publicacion.py --con-mimundo docs/propuestas/prueba-mimundo-2026-11-04/mimundo` genera la
versión publicable **con Mi Mundo** (sin la opción, el resultado es exactamente lo publicado en `main`). Mi Mundo va en lo
básico que guarda el service worker.

## Pruebas (Chromium; iPhone e iPad simulados)

```bash
python3 -m http.server 8765 &
python3 docs/propuestas/prueba-mimundo-2026-11-04/preparar_piezas.py      # piezas (cuando lleguen ilustraciones)
python3 docs/propuestas/prueba-mimundo-2026-11-04/preparar_copia.py       # la copia (comprueba que es lo publicado + Mi Mundo)
node docs/propuestas/prueba-mimundo-2026-11-04/prueba-mimundo.js          # 20 comprobaciones
node docs/propuestas/prueba-mimundo-2026-11-04/prueba-sin-conexion.js     # 5 comprobaciones, en modo avión
```

Resultado 04/11/2026: **20/20** y **5/5**. La misión se ha comprobado con **arte de prueba** (formas de colores que solo
existen mientras corre la prueba; no están en la copia). **No probado en el iPhone ni en el iPad reales.**

## Coordinación con `pintar-heladeria`

Ver `docs/COORDINACION_RAMAS.md`.
