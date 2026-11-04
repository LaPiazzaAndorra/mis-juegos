# Mi Mundo · el salón: propuesta visual y piezas necesarias (D-034) · 04/11/2026

**Solo propuesta.** Nada está programado todavía: primero se aprueban la distribución y las piezas, se generan las
ilustraciones y después se monta en una copia aislada (como la habitación, `../prueba-mimundo-2026-11-04/`), con el
mismo motor, el catálogo, guardar en la copia de seguridad y el juego sin conexión. Después vendrá el parque.

## Distribución a escala

- `distribucion-salon.png`: el salón con cada pieza numerada a su tamaño real y, **de verdad**, la muñeca guardada, el
  osito y la cesta ya aprobados.
- `merienda-en-la-mesa.png`: la mesa de cerca, con los sitios de la merienda para tres.
- `plantilla-salon.png`: perspectiva del suelo, siluetas de la muñeca a tres distancias y las zonas, para generar el fondo
  y los muebles.

**Misma cámara que la habitación aprobada** (lienzo de 1536 × 1024, suelo desde y ≈ 560; la muñeca, de 1,10 m, mide
unos 250 px al fondo y 420 delante): así la muñeca, el osito, la cesta y los juguetes valen igual en el salón y el motor
es el mismo. `preparar_propuesta.py` hace las tres imágenes.

| N.º | Pieza | Tamaño real | En el juego |
| --- | --- | --- | --- |
| 1 | Fondo del salón, vacío | 1536 × 1024 | fondo |
| 2 | Sofá de tres plazas | 1,90 × 0,85 m | se mueve; los peluches y los cojines de sofá se pueden poner en el asiento |
| 3 | Estantería baja con libros y juguetes | 0,95 × 1,00 m | se mueve |
| 4 | Lámpara de pie | 0,40 × 1,50 m | se mueve |
| 5 | Alfombra redonda | 2,00 m de ancho, plana | se mueve (siempre debajo de todo) |
| 6 | Mesa baja redonda | 0,80 m, 0,45 de alto | se mueve; lleva cosas encima (con lo que tenga) |
| 7 · 8 | Cojines de suelo rosa y lila | 0,48 × 0,22 m | se mueven; asiento de los invitados |
| 9 | Cojines de sofá (dos: uno con corazón, otro con estrella) | 0,40 × 0,35 m | se ponen en el sofá |
| 10 | Plato (se usa tres veces) | 0,20 m | sobre la mesa |
| 11 | Taza con platillo (tres veces) | 0,12 m | sobre la mesa |
| 12 | Tetera | 0,22 m | sobre la mesa |
| 13 | Plato de galletas | 0,22 m | sobre la mesa |
| 14 | Conejito de peluche (invitado) | 0,34 m, sentado | se mueve; se sienta en un cojín o en el sofá |

El osito (invitado) y la cesta son los de la habitación. Todos estos objetos serían **gratis**; los desbloqueables se
propondrán aparte. El juego libre (poner, mover, quitar, guardar) no necesita hacer la misión.

## Imágenes que necesitamos generar (14) y sus capas

Todas en el **mismo estilo, cámara y luz que la habitación aprobada** (vista de frente y un poco desde arriba, luz cálida
de la ventana), **PNG con el fondo transparente** salvo el fondo, interior totalmente opaco, **sin motitas ni resplandor**,
**sin sombra en el suelo** (se pone aquí), sin texto ni personajes, cada pieza **por separado**, entera y apoyada en el
suelo, de buen tamaño (800–1500 px de alto; el fondo, 1536 × 1024 o el doble).

| Archivo | Pieza | Capas | Notas para que encaje |
| --- | --- | --- | --- |
| `fondo-salon.png` | Salón vacío: pared (papel suave crema o verde menta), zócalo, suelo de madera como el de la habitación, ventana grande con cortinas | una | Sin muebles. La línea del suelo a la misma altura que en la habitación. |
| `sofa.png` | Sofá de tres plazas rosa empolvado | **una** | De frente, con el **asiento bien visible** (ahí se ponen peluches y cojines). |
| `estanteria.png` | Estantería baja de madera clara con libros, un juguete y una planta | una | De frente. |
| `lampara-pie.png` | Lámpara de pie con pantalla de tela | una | |
| `alfombra-salon.png` | Alfombra redonda tejida, pastel | una | Plana, **con la perspectiva del suelo** (una elipse ancha). |
| `mesa-merienda.png` | Mesa baja redonda de madera clara, **vacía** | una | El **tablero visto desde arriba** lo bastante para colocar 3 platos y 3 tazas (ver `merienda-en-la-mesa.png`). |
| `cojin-suelo-rosa.png`, `cojin-suelo-lila.png` | Cojines redondos de suelo (pufs) | una cada uno | Vacíos, con la parte de arriba visible (ahí se sientan los peluches). |
| `cojin-sofa-corazon.png`, `cojin-sofa-estrella.png` | Cojines de sofá cuadrados | una cada uno | De frente, algo inclinados, como apoyados. |
| `plato.png` | Plato de postre, vacío | una | Visto como sobre la mesa (un poco desde arriba). |
| `taza.png` | Taza con platillo | una | Igual. |
| `tetera.png` | Tetera | una | Igual. |
| `galletas.png` | Plato con galletas | una | Igual. |
| `conejito.png` | Conejito de peluche **sentado**, mirando al frente | una | Mismo estilo y tamaño relativo que el osito aprobado. |

Mensaje para generarlas (adjuntando el fondo de la habitación y el osito como referencia de estilo):

> Dibuja, en el mismo estilo, cámara y luz que esta habitación y este osito, [la pieza]. Vista de frente y un poco desde
> arriba, luz cálida desde la izquierda. Fondo transparente (PNG), sin sombra en el suelo, sin resplandor alrededor, sin
> texto ni personajes, la pieza sola y entera, apoyada en el suelo.

Con ellas, aquí: comprobación de bordes sobre fondos claro y oscuro (sin resplandor ni motitas), escala respecto a la
muñeca, recorte, medida del **asiento** del sofá y los cojines y del **tablero** de la mesa, y montaje.

## Misión «Preparar la merienda para tres» (opcional)

1. Poner **tres platos y tres tazas** en la mesa: al soltarlos encima, cada uno va a su sitio.
2. Poner la **tetera** y las **galletas** en el centro.
3. **Sentar a los invitados:** el osito y el conejito, soltados en los cojines junto a la mesa.
4. Con la muñeca junto a la mesa: «¡A merendar!», celebración y la recompensa de siempre (1 ⭐), anotada en las misiones.

Todos sus objetos, **gratis**. Tipo de objetivo «poner» (preparado en el motor de la habitación). La misión saca lo que
falte; los platos, tazas y cosas de la mesa se pueden recoger después y la mesa vuelve a quedar libre.

## Posturas e interacciones que hay que resolver (sin esconderlas con muebles)

- **Sentar a la muñeca** (en el sofá, en un cojín o en una silla): nuestra muñeca está dibujada **de pie**. Sentarla de
  verdad necesita una **postura sentada** dibujada para su cuerpo y, encima, la ropa, los peinados y los tonos aprobados
  (como se hizo con la mano de la varita). **No** se propone ningún mueble para tapar las piernas. Mientras tanto, en el
  salón la muñeca está **de pie**: junto a la mesa, sirve la merienda; los que se sientan son los peluches, que ya están
  dibujados sentados. Si se quiere la postura sentada, es una tarea aparte (decide la propietaria).
- **Llevar objetos** (en el parque, y también para servir aquí): hace falta una **mano que sujeta**, como la mano de agarre
  de la varita, para cada tono de piel, y la colocación de cada objeto en la mano. Para el salón **no hace falta**: los
  objetos se arrastran con el dedo. Se resolverá al preparar el parque.
- **Cosas encima de muebles** (merienda en la mesa, peluches y cojines en el sofá): es del programa (medir el tablero y
  el asiento en las imágenes); no hace falta dibujar nada más.

## Después: el parque

Zona de pícnic, banco, árboles y juguetes de exterior; la muñeca se mueve y lleva objetos (necesita la mano que sujeta,
arriba); después, una misión de buscar objetos con pistas. Se preparará su distribución a escala y su lista de piezas
cuando el salón esté montado.
