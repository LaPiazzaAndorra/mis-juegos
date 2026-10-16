# Guía para completar en ChatGPT el pelo que hay bajo la cinta (D-025) · 16/10/2026

## Por qué hace falta

La imagen aprobada (`../referencias/referencia-coleta-cinta-aprobada.png`) solo tiene **la cinta** donde va la cinta:
debajo no hay pelo. Si se quita la cinta, queda un hueco con la forma de la cinta (se ve la cabeza y el fondo; ver
`../capas/comparacion-coleta.png`, «Sin la cinta»). **El pelo que falta no se puede recuperar de la imagen** y no se
inventa aquí: se pide a ChatGPT **el mismo peinado sin la cinta**, y se toma de esa imagen solo el pelo de la zona de la
cinta.

## Qué adjuntar en ChatGPT

1. `../referencias/referencia-coleta-cinta-aprobada.png` (la imagen aprobada).
2. `plantilla-zona-bajo-la-cinta.png` (la misma, con la zona de la cinta marcada en rosa).

## Mensaje (copiar)

> Te adjunto una ilustración aprobada de una niña con una coleta alta rizada y una cinta deportiva lila, y la misma
> imagen con la zona de la cinta marcada en rosa. Necesito **exactamente la misma imagen, pero sin la cinta**:
> - Donde estaba la cinta (zona rosa), **pelo completo**, del mismo color, brillo y tipo de rizo: el pelo de la frente y
>   de los lados **sube peinado hacia la coleta**, como el pelo que se ve justo encima y justo debajo de la cinta.
> - **No cambies nada más**: ni la cara, ni la coleta, ni los rizos de los lados, ni el vestido, ni el encuadre, ni el
>   tamaño (1402 × 1122 px), ni la posición. Fondo crema liso.
> - Sin texto, sin marcos y sin ningún otro accesorio.

## Cómo se revisará lo que devuelva

1. Se superpone con la imagen aprobada: fuera de la zona de la cinta debe coincidir (misma cara, coleta y rizos). Si no
   coincide (otro tamaño, otra posición o el peinado cambiado), se pide otra.
2. De la imagen nueva se toma **solo el pelo de la zona de la cinta** (con un margen pequeño para que case con el pelo de
   alrededor) y se añade a las capas de pelo de `../capas/`. La cinta queda como capa aparte, para poner y quitar.
3. Se comprueba en el visor con y sin cinta, y después se aprueba.
