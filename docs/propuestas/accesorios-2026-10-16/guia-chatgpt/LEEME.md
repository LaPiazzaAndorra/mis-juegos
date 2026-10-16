# Guía para adaptar en ChatGPT la diadema, la cinta y los gorros (D-024) · 16/10/2026

## Por qué hace falta

La **diadema de estrellas**, la **cinta deportiva**, la **gorra**, el **sombrero de aventura** y el **gorrito de dormir**
están dibujados **en perspectiva de tres cuartos** (de lado y algo desde arriba): se ve el interior de la diadema y de la
cinta, la visera de la gorra de lado, el ala del sombrero inclinada y el gorrito girado. Nuestra muñeca está **de frente**
y simétrica, así que **no encajan** tal cual: girarlos o deformarlos aquí cambiaría el diseño aprobado y no quedaría
creíble. El lazo, las flores y la mariposa sí encajan (son planos y van de lado, sobre los rizos).

Lo que se pide a ChatGPT es **el mismo diseño aprobado, visto de frente y del tamaño de nuestra cabeza**. Después se
extrae **solo la pieza**, como con la corona y los zapatos: **la cabeza y el peinado no cambian**.

## Qué adjuntar en ChatGPT

1. `plantilla-cabeza-frontal.png`: nuestra muñeca de frente (948 px de ancho), **la cabeza que hay que respetar**.
2. `plantilla-medidas.png`: la misma con las medidas (zona 4: diadema y cinta; zona 5: gorros).
3. La lámina aprobada con el diseño: `../referencias/lamina-cintas-y-gorros-aprobada.png` (cinta, gorra, sombrero y
   gorrito) o `../referencias/lamina-lazo-flores-mariposa-diadema-aprobada.png` (diadema).

Mejor **un accesorio por conversación** (o por imagen).

## Condiciones para todos (copiar al principio del mensaje)

> Te adjunto una muñeca vista de frente (plantilla) y una lámina con un accesorio ya aprobado. Necesito **el mismo
> accesorio, con el mismo diseño, colores, materiales y detalles**, pero **visto de frente**, colocado sobre la cabeza de
> la plantilla.
> - **No cambies la muñeca**: ni la cara, ni la cabeza, ni el tamaño, ni el peinado, ni la posición. La imagen debe tener
>   **exactamente el mismo encuadre y tamaño** que la plantilla (948 px de ancho), con la cabeza en el mismo sitio.
> - El accesorio, **simétrico** respecto al centro de la cara.
> - Sin texto, sin marcos, sin sombras proyectadas en el fondo, con el **fondo crema liso** de la plantilla.
> - Estilo de ilustración igual que la muñeca (suave, infantil, de juguete).

## Un mensaje para cada accesorio (añadir después de las condiciones)

**Diadema de estrellas**
> Ponle la diadema dorada de estrellas de la lámina, **vista de frente**: un arco fino dorado que pasa por encima del pelo
> de sien a sien, a la altura de la zona 4 (por encima del nacimiento del pelo, sin tapar la frente), con las dos
> estrellas (dorada y lila) y las perlas **a un lado del arco**, como en la lámina. Los extremos del arco se meten por
> detrás de los rizos, a la altura de las sienes. Que la diadema sea **más fina** que la corona y que no la toque.

**Cinta deportiva**
> Ponle la cinta deportiva lila de rizo de la lámina, **vista de frente**: una banda ancha y blandita que rodea la cabeza
> por encima de la frente (zona 4), con la estrellita rosa **a un lado**. Sigue la curva de la cabeza; los extremos se
> pierden por detrás de los rizos de los lados. No aplasta el pelo de arriba ni tapa las cejas.

**Gorra deportiva**
> Ponle la gorra rosa de la lámina, **de frente**: la visera hacia delante, centrada, un poco por encima de las cejas
> (sin taparlas), y el rayo crema bordado en el centro de la parte delantera. La gorra tapa **todo el pelo de arriba**
> (zona 5); por debajo de la gorra siguen saliendo los rizos de los lados y de detrás, **sin cambiarlos**.

**Sombrero de aventura**
> Ponle el sombrero de aventura beige con la cinta verde y el parche de la hoja, **de frente**: el ala rodea la cabeza,
> algo inclinada hacia abajo, un poco por encima de las cejas (sin taparlas). Tapa **todo el pelo de arriba** (zona 5) y
> el ala es lo bastante ancha para no dejar pelo asomando por encima; por debajo salen los rizos de los lados y de
> detrás, **sin cambiarlos**.

**Gorrito de dormir**
> Ponle el gorrito de dormir azul de estrellas y lunas con el borde rosa y el pompón crema, **de frente**: el borde rosa
> por encima de la frente (sin tapar las cejas), tapando **todo el pelo de arriba** (zona 5), y la punta caída hacia un
> lado con el pompón, sin tapar la cara. Por debajo salen los rizos de los lados y de detrás, **sin cambiarlos**.

## Cómo se revisa lo que devuelva ChatGPT

1. **El diseño** se aprueba primero (como hasta ahora): que sea el mismo accesorio de la lámina, de frente.
2. Se comprueba que **la cabeza no ha cambiado**: se superpone con nuestra muñeca; si la imagen no coincide (otro
   tamaño, otra posición o la cara distinta), se mide y se pide otra.
3. Se extrae **solo el accesorio** (sin fondo, sin pelo ni piel de la imagen) y se coloca sobre nuestras capas:
   - **diadema y cinta**: lo que pasa por encima del pelo va delante del pelo de delante; los extremos se quedan detrás
     de los rizos (se recortan con el contorno de nuestro pelo, no se dibujan);
   - **gorros**: delante del pelo; los rizos de los lados y de detrás no cambian. Si el gorro no cubre todo el pelo de
     arriba (zona 5), se pide uno más grande: **no se recorta ni se aplasta nuestro peinado**.
4. Encaje, en el visor, con todos los tonos de piel y colores de pelo; después, aprobación.

## Medidas (en el lienzo de 948 × 1659)

| Medida | Valor |
| --- | --- |
| Eje de la cara | x = 479 |
| Arriba del pelo | y ≈ 85 |
| Ancho del pelo | 346 px a y = 150 · 426 px a y = 200 · 505 px a y = 250 · 560 px a y = 300 |
| Nacimiento del pelo en la frente | y ≈ 250 (la frente se ve de x ≈ 430 a 545 a y = 260) |
| Cejas | y ≈ 348–396 |
| Corona (para no tocarla) | x 313–624, y 42–198 |
