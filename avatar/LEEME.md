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
