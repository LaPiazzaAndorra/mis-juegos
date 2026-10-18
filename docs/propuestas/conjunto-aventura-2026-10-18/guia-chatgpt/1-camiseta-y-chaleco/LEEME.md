# Guía 1 · Camiseta y chaleco a nuestra medida (D-027) · 18/10/2026

**Qué falla ahora:** el chaleco de la imagen es más ancho que el torso de nuestra muñeca (sus brazos están más
separados): a y = 900 el chaleco va de x 318 a 646 (**328 px**) y el torso entre nuestros brazos de x 357 a 600 (**244 px**).
Sus bordes y bolsillos quedan bajo nuestros antebrazos o encima de ellos. Además, las **tiras de la mochila** tapan los
hombros de la camiseta y del chaleco: sin la mochila no hay imagen debajo. **No se estrecha ni se deforma aquí**: se pide
en ChatGPT.

## Medidas (de nuestra base, `../medidas-torso.json`)

| y | torso entre los brazos (x) | ancho | chaleco actual (x) |
|---|---|---|---|
| 820 | 377 – 580 | 204 | 347 – 620 |
| 860 | 372 – 585 | 214 | 333 – 638 |
| 900 | 357 – 600 | 244 | 318 – 646 |
| 940 | 344 – 613 | 270 | 315 – 657 |
| 960 | 337 – 619 | 283 | 363 – 633 |

Por encima de y ≈ 815 los brazos van pegados al cuerpo (bajo las mangas). Lo que tiene que **verse** (bolsillos, botones,
ribete, delanteros) va dentro del espacio verde; los costados del chaleco pueden seguir **por detrás** de los brazos.

## Qué adjuntar

1. `../../referencias/referencia-conjunto-aventura-aprobada.png` (el diseño aprobado).
2. `referencia-camiseta-y-chaleco.png` (la camiseta y el chaleco, con las tiras marcadas en morado).
3. `plantilla-nuestra-muneca-entera.png` (nuestra muñeca, con nuestras proporciones; no se cambia).
4. `plantilla-espacio-entre-brazos.png` (en verde, el espacio del torso entre los brazos; en naranja, por dónde sobra el
   chaleco actual).

## Mensaje (copiar)

> Te adjunto un diseño aprobado (camiseta crema con una hoja bordada y chaleco arena con ribete verde, bolsillos con
> solapa y botones) y la plantilla de nuestra muñeca. Dibuja **la misma camiseta y el mismo chaleco**, con **el mismo
> diseño, colores, bolsillos, botones, costuras y textura de tela**, puestos sobre **la muñeca de la plantilla, en el mismo
> lienzo, tamaño y posición**:
> - **sin la mochila ni sus tiras**: los hombros de la camiseta y del chaleco, completos;
> - el chaleco **a la medida de su torso**: los delanteros, los bolsillos y los botones **entre sus brazos** (la zona verde
>   de la plantilla), sin tapar los brazos; por los lados puede seguir por detrás de los brazos;
> - las mangas de la camiseta tapando del todo las mangas rosas de la plantilla.
> No cambies el cuerpo, los brazos, las manos ni la cara de la muñeca; sin pantalón nuevo (deja el que hay), sin sombrero,
> sin pelo, fondo crema liso, sin texto ni marcos.

## Cómo se revisará

Alineación con la plantilla; se toman solo la camiseta y el chaleco (sin piel ni brazos de la imagen); se comprueba que
tapen la camiseta rosa de la base, que no pisen nuestros brazos y que los bolsillos y texturas sean los aprobados.
