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
catálogo:** no hay dibujos de relleno.

## Ilustraciones de los objetos (04/11/2026)

La propietaria envió las cinco (cesta, osito, pelota, cubos y cuento) como **imágenes fuente** con un resplandor alrededor.
Se guardan **sin modificar** en `recibidas/` (SHA-256 en `mimundo/arte/comprobaciones.json`); se trabaja en copias
(`preparar_piezas.py`, función `limpiar_objeto`).

- **Qué era el resplandor:** píxeles casi invisibles (alfa 1–3) de color naranja, rojo o blanco, a 3–500 px de cada
  objeto, que sobre fondos oscuros forman un halo; además, motitas sueltas y el interior con alfa 252–253 (como la cama).
- **Qué se ha hecho:** interior opaco; fuera las motitas; fuera todo lo de alfa menor de 12 o a más de 6 px del cuerpo del
  objeto (12 px en el osito, para conservar su pelo). **Ningún píxel cambia de color**; contornos, pelo y texturas,
  intactos. Revisado sobre fondo oscuro, claro y el color del suelo: `revision/bordes-antes-despues.jpg` y
  `revision/objetos-sobre-fondos.jpg`. **Ningún recorte ha dado problemas.**

| Pieza | Resplandor quitado (px) | Motitas quitadas | Borde conservado (px) | Radio del borde |
| --- | --- | --- | --- | --- |
| cesta | 8 622 | 1095 (4 022 px) | 3 918 | 6 px |
| osito | 18 724 | 1483 (3 810 px) | 14 290 | 12 px |
| pelota | 5 739 | 451 (880 px) | 3 125 | 6 px |
| cubos | 6 588 | 203 (555 px) | 3 794 | 6 px |
| cuento | 7 083 | 451 (1 038 px) | 4 471 | 6 px |

- **Escala** (respecto a la muñeca, 1,10 m, y la cama; misma escala en ancho y alto, sin deformar): cesta 40 cm, osito
  34 cm, pelota 26 cm, cubos 24 cm, cuento 20 cm (los juguetes, algo generosos para tocarlos bien en el iPhone).
- **En el iPhone:** durante la misión, la cámara mira a la cesta y los juguetes, que aparecen juntos junto a ella (en
  vertical miden 47–79 px en la pantalla); **toque tolerante**: un toque a menos de 26 px de un juguete o la cesta cuenta
  (aunque caiga sobre la zona transparente de la cama o sobre la muñeca), y soltar un juguete cerca de la cesta también.
- Montaje: `revision/mision-lista-ipad.jpg`, `revision/mision-lista-iphone.jpg`, `revision/mision-cumplida-ipad.jpg`.

## Misiones siguientes (ilustraciones que harán falta)

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
node docs/propuestas/prueba-mimundo-2026-11-04/prueba-mimundo.js          # 22 comprobaciones
node docs/propuestas/prueba-mimundo-2026-11-04/prueba-sin-conexion.js     # 7 comprobaciones, en modo avión
```

Resultado 04/11/2026, con las ilustraciones definitivas: **22/22** (también la misión entera en el iPad y en el iPhone en
vertical, toque tolerante, volver a abrir, «Guardar» y «Recuperar mi progreso») y **7/7** sin conexión (también las ocho
ilustraciones y la misión entera en modo avión). **No probado en el iPhone ni en el iPad reales.**

## Coordinación con `pintar-heladeria`

Ver `docs/COORDINACION_RAMAS.md`.
