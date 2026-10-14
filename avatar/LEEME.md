# Creador de avatar · arquitectura

## Archivos

| Archivo | Qué contiene |
|---|---|
| `avatar/catalogo.js` | Todas las piezas: piel, ojos, peinados y conjuntos, cada una como capa independiente. |
| `avatar/motor.js` | Compone las capas, anima el personaje y guarda/recupera el estado. |
| `avatar/avatar.css` | Animaciones: parpadeo, sonrisa, saludo, salto al cambiar de ropa, paso al caminar. |

## Orden de las capas (de atrás hacia delante)

```
hairBack → legs → legwear → shoes → bottom → arms → neck → top → head → hairFront → acc
```

* `arms` son dos grupos (izquierdo y derecho) con su propio origen en el hombro.
  Cada brazo = piel del brazo + manga del conjunto, así la manga se mueve con el brazo al saludar.
* `head` incluye cara, ojos (animables), boca cerrada y boca abierta.

## Estado guardado (localStorage)

```json
avatar = {
  "v": 1,
  "piel": "clara",
  "ojos": { "color": "marron", "forma": "redondos" },
  "pelo": { "estilo": "melena", "color": "castano" },
  "ropa": "vestido",
  "zapatos": null,
  "accesorios": [],
  "guardado": "2026-10-13T10:00:00.000Z"
}
```

* Se guardan **identificadores**, no posiciones de lista: añadir prendas nuevas no estropea
  personajes ya guardados. Si un identificador desaparece, se usa el valor por defecto.
* `avatar_draft` guarda los cambios en curso; `avatar` es el personaje que aparece en «Mi Mundo».
* `mm_hab` guarda la habitación (posición del personaje, día/noche, lámpara).
* No se modifica ninguna clave anterior (`stars`, `gal`, `doll`, `sc_*`, `lv_*`, `iceCoins`…).

## Cómo integrar ilustraciones PNG por capas

Cualquier capa del catálogo puede ser una imagen en lugar de un dibujo vectorial:

```js
hairFront: { img: 'avatar/capas/pelo-melena-frente-{pelo}.png' }
```

`{piel}`, `{pelo}` y `{ojos}` se sustituyen por el color elegido.

### Especificación de los PNG

* **Lienzo común:** 2000 × 3500 px (5 × 400 × 700), fondo transparente, en sRGB.
* **Misma postura y encuadre en todas las capas:** centro del cuerpo en x = 1000 px,
  suelo (planta de los pies) en y = 3275 px.
* **Una imagen por capa** según la lista de arriba. Las piezas de delante y de detrás del
  pelo van separadas (`hairBack` / `hairFront`).
* **Brazos:** una imagen por brazo y por manga, dibujados colgando hacia abajo, con el hombro
  en un punto fijo (ver `hombros` en `catalogo.js`) para que puedan girar al saludar.
* **Cara:** ojos abiertos y ojos cerrados en capas separadas (parpadeo), y al menos dos bocas
  (sonrisa tranquila y sonrisa abierta).
* **Variantes de color:** un archivo por color (`-castano`, `-rubio`…), o una versión en
  escala de grises para teñirla por código, si la ilustración lo permite.
* **Peso:** exportar optimizado (por ejemplo con pngquant); conviene que cada capa ocupe
  menos de 300 KB para que la app funcione bien sin conexión.

## Muñeca ilustrada (capas PNG) · circuito completo

1. Las piezas originales (2000 × 3500, transparentes) se guardan en `arte/originales/`
   siguiendo `plantilla/INSTRUCCIONES.md`.
2. `herramientas/comprobar-capas.html` comprueba que encajan (se abre en cualquier navegador).
3. `python3 herramientas/optimizar.py` genera `avatar/arte/s|m/*.webp` y `avatar/arte/piezas.js`.
4. `avatar/catalogo-muneca.js` dice qué pieza va en cada capa. Una opción solo aparece cuando
   existen todas sus piezas.
5. El juego usa la muñeca **premium** cuando tiene al menos una piel, unos ojos, un peinado y una
   ropa completos; mientras tanto, la provisional (`prueba`). Para revisar: `?arte=borrador`
   (premium con lo que haya), `?arte=prueba`, `?arte=demo` y `?arte=svg` (muñeca vectorial).

Rendimiento en el iPhone: las piezas van recortadas a su contenido, en WebP, en dos tamaños
(30 % y 50 %), y cada pantalla carga el más pequeño que se ve nítido. Las imágenes se
decodifican antes de mostrarse (sin parpadeos) y se guardan sin conexión al primer uso.

En `arte/originales/`, los archivos que empiezan por `prueba-` son **piezas técnicas** (la muñeca
vectorial dividida en capas) y `demo-diario.png` es la demostración de calidad. El arte premium
aprobado (base V2.1 y ojos) usa los nombres del catálogo `premium`. Estado de cada pieza:
`docs/AVATAR_Y_ASSETS.md`.

## Cuando llegue una base nueva (paso a paso)

1. Copiar la base a `arte/originales/base-clara.png` y comprobarla con el comprobador.
2. `python3 herramientas/medir_base.py arte/originales/base-clara.png` → informe;
   con `--escribir` actualiza `plantilla/plantilla.js` (hombros, cintura, rodillas, manos, zonas…).
3. Volver a dibujar las láminas: `herramientas/plantilla.html?modo=guia|silueta|zonas&base=base-clara`
   (captura a 2000 × 3500) → `plantilla/plantilla-*.png`.
4. `python3 herramientas/guias.py` → `plantilla/guias/` (una guía por pieza para dibujar encima).
5. Borradores de variantes: `python3 herramientas/variantes.py piel …` y `… iris … --mascara …`.
6. `python3 herramientas/optimizar.py` → `avatar/arte/`.
7. Revisar en el juego con `index.html?arte=borrador` (muñeca premium aunque falten piezas).
8. Subir la versión de `sw.js` si ha cambiado algún archivo de código.

Los encuadres de las miniaturas de «Vestir» se calculan a partir de `plantilla.js`, y el
comprobador también lee de ahí sus medidas: no hay que tocarlos a mano.
