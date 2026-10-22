# Mi Mundo · primera habitación ilustrada para jugar con la muñeca (propuesta, 22/10/2026)

**Solo propuesta.** Nada de esto está en el juego ni en una copia todavía. Pedido de la propietaria: «Seguimos con Mi
Mundo: prepara una primera habitación para jugar con la muñeca guardada, moverla y mover algunos objetos. Quiero poder
acostarla en la cama y sentarla en una silla. Primero enséñame una propuesta de distribución y las ilustraciones que
necesitamos. Mantengamos el estilo de nuestra muñeca; podemos generar aquí los dibujos. Trabaja sobre una nueva copia
aislada, conservando la prueba completa y las partidas. No cambies main. Los peinados nuevos quedan para después.»

## Hoy

La habitación de «Mi Mundo» es un dibujo plano (SVG, 1000 × 620): cama, ventana de día y noche, lámpara, alfombra y pelota;
la muñeca camina al tocar el suelo y, al tocar la cama, «duerme» (se ve solo su cabeza en la almohada). Los demás objetos
son pegatinas de emoji. Capturas: `antes.png`.

## Propuesta

`distribucion.png` (la habitación, 2000 × 1240, con la muñeca guardada a escala) · `estados.png` (acostada y sentada) ·
`plantilla-escala.png` (zonas y silueta de la muñeca, para generar los dibujos) · `preparar_propuesta.py` (las genera).

**Acostarla y sentarla sin dibujar posturas nuevas de la muñeca.** La muñeca está dibujada de pie (D-006); una postura
tumbada o sentada obligaría a rehacer cada ropa, peinado y tono. En su lugar, cada mueble va en **dos capas** y la muñeca
entre ellas, como hoy en la cama:
- **Acostada:** cama vista desde los pies. Detrás, el cabecero, el colchón y la almohada; delante, el edredón, que llega
  hasta el suelo. La muñeca, con los ojos cerrados, se coloca con la cabeza en la almohada y el edredón la tapa desde el
  cuello.
- **Sentada:** silla detrás de la muñeca y, delante, una mesa con **mantel largo hasta el suelo**. La muñeca se coloca más
  baja (la cadera a la altura del asiento) y el mantel tapa las piernas. Mesa y silla van juntas.
- Así vale para toda la ropa, peinados, tonos y adornos aprobados. **A decidir:** ocultar las alas, la mochila y la varita
  mientras está acostada o sentada (asomarían por detrás de la almohada o de la silla) y que vuelvan al levantarse.

**Cómo se juega (en la copia nueva):**
- Arrastrar la muñeca para moverla. Soltarla en la cama → se acuesta (ojos cerrados, «Z z z»); soltarla en la silla → se
  sienta. Tocarla → se levanta y saluda. Tocar el suelo → camina hasta allí (como hoy).
- Arrastrar los objetos que se mueven: osito, pelota, cesta de juguetes, puf, planta y el conjunto mesa y silla.
- Ventana: día y noche; lámpara: encender y apagar (como hoy).
- Las posiciones se guardan en la copia (clave nueva); la habitación de hoy y sus claves (`mm_hab`, `sc_habitacion`) no se
  tocan. Las demás escenas de «Mi Mundo» y las pegatinas siguen como están.

## Ilustraciones que necesitamos (15)

Todas en el **estilo de nuestra muñeca** (ilustración infantil suave y pastel, contornos finos, luz suave desde arriba a la
izquierda), **vista de frente** con el suelo un poco desde arriba, a la escala de la silueta de `plantilla-escala.png`
(la muñeca mide unos 620 px de alto de pie en el lienzo de 2000 × 1240). Cada pieza, después, **por separado** y sobre
fondo liso, para recortarla.

| N.º | Pieza | Capa | Notas |
| --- | --- | --- | --- |
| 1 | Pared y suelo | fondo | Pared lila clara con papel de corazones suaves, zócalo rosa, suelo de madera clara. Sin muebles. |
| 2 | Ventana | fondo, se toca | Con cortinas rosas; cielo de **día** y de **noche** en dos versiones (mismo marco). |
| 3 | Cuadro | fondo | Un arcoíris o una estrella, marco dorado suave. |
| 4 | Estantería con libros | fondo | Baldas en la pared con libros de colores y una planta pequeña. |
| 5 | Cama · detrás | detrás de la muñeca | Cabecero lila con corazón, colchón y **almohada blanca grande** donde va su cabeza. Cama vista **desde los pies**. |
| 6 | Cama · delante | delante de la muñeca | **Edredón rosa con corazones** que cae **hasta el suelo** por delante, con el embozo blanco arriba. |
| 7 | Mesita de noche con lámpara | se toca | Lámpara de pantalla amarilla (encendida o apagada: el brillo se pone aparte). |
| 8 | Alfombra | suelo | Redonda u ovalada, verde menta. |
| 9 | Silla | detrás de la muñeca | Respaldo ancho y redondeado que asome a los lados de sus hombros al sentarse. |
| 10 | Mesa con mantel largo | delante de la muñeca | Mantel que cae **hasta el suelo** por delante (tapa sus piernas); se mueve con la silla. |
| 11 | Osito de peluche | se mueve | Sentado, mirando al frente. |
| 12 | Pelota | se mueve | Rosa con rayas blancas. |
| 13 | Cesta de juguetes | se mueve | Con algún juguete asomando. |
| 14 | Puf | se mueve | Redondo, azul claro. |
| 15 | Planta | se mueve | Maceta con hojas. |

## Cómo generarlas (como con la ropa)

1. **Diseño de la habitación entera** en una imagen sobre `plantilla-escala.png` (mensaje de abajo). Se revisa aquí
   (escala con la muñeca, perspectiva, estilo) y lo aprueba la propietaria.
2. **Piezas por separado** (fondo liso), con el diseño aprobado como referencia: se recortan aquí, se comprueban la escala y
   el encaje con la muñeca real y se montan en la copia nueva.

Mensaje para ChatGPT (paso 1, adjuntando `plantilla-escala.png` y una imagen de nuestra muñeca):

> Dibuja la habitación infantil de esta plantilla, en el mismo estilo que la muñeca adjunta (ilustración infantil suave y
> pastel, contornos finos, luz suave desde arriba a la izquierda), vista de frente con el suelo un poco desde arriba, del
> mismo tamaño que la plantilla (2000 × 1240). Respeta la posición y el tamaño de cada zona numerada y la escala de la
> silueta de la muñeca: 1 pared lila clara con corazones suaves, zócalo rosa y suelo de madera clara; 2 ventana con
> cortinas rosas y cielo de día; 3 cuadro con un arcoíris; 4 estantería con libros; 5 cama vista desde los pies, con
> cabecero lila con un corazón y almohada blanca grande; 6 edredón rosa con corazones que cae hasta el suelo por delante;
> 7 mesita de noche con lámpara amarilla; 8 alfombra ovalada verde menta; 9 silla de respaldo ancho y redondeado;
> 10 mesa pequeña con mantel largo hasta el suelo; 11 osito de peluche; 12 pelota rosa con rayas blancas; 13 cesta de
> juguetes; 14 puf azul claro; 15 planta en maceta. **No dibujes a la muñeca ni ninguna persona**: las siluetas grises solo
> marcan la escala. Sin texto ni números.

## Después (cuando se aprueben el diseño y las piezas)

Copia aislada **nueva** a partir de la prueba completa (que se conserva), con datos propios y la habitación nueva en
«Mi Mundo»; prueba automática; enlace para el iPhone. `main`, las partidas y la prueba completa no cambian. Los peinados
nuevos, más adelante.
