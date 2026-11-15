# Mi Mundo · cocina y baño: propuesta para hambre, higiene y ganas de ir al baño (D-037, 2.ª entrega) · 16/11/2026

**Solo propuesta, pendiente de aprobación.** Nada de esto está programado ni activo. En la copia de cuidar
(`../prueba-cuidar-2026-11-15/`), las tres necesidades ya están definidas en el catálogo como **pendientes**, así que siguen
inactivas aunque llegue el arte. Se activarán cuando su espacio, sus objetos y su acción estén ilustrados, programados,
probados y aprobados.

## Distribución a escala

- `distribucion-cocina.png`, `distribucion-bano.png`: cada espacio con sus piezas numeradas a tamaño real. La muñeca
  guardada y las piezas ya aprobadas aparecen **de verdad**.
- `plantilla-cocina.png`, `plantilla-bano.png`: plantillas para generar el fondo y los muebles, sin texto (perspectiva del
  suelo, siluetas de la muñeca a tres distancias y las zonas).
- **La misma cámara que el salón** (lienzo de 1536 × 1024, suelo desde y ≈ 520): la muñeca y las piezas aprobadas sirven
  igual, sin reescalar nada.
- **La misma ventana en el centro**, para que el día y la noche funcionen igual en toda la casa.
- `preparar_propuesta.py` genera las cuatro imágenes.

## Cómo se llega: las habitaciones de la casa

Dentro de 🏠, una fila de botones con dibujo para cambiar de habitación: **Salón · Cocina · Baño**. Cada habitación conserva
su distribución, como ya hacen la habitación y el salón (claves `mm_cocina` y `mm_bano`, con el prefijo `mm_`, que van en la
copia de seguridad). La cámara, las flechas y el botón para encontrarla funcionan igual.

## Piezas que se reutilizan (ya aprobadas, sin cambios)

| Pieza | Dónde | Para qué |
| --- | --- | --- |
| Mesa baja redonda | Cocina | La mesa de comer; lo que tiene encima va con ella, como en el salón. |
| Platos, tazas, tetera, galletas | Cocina | Poner la mesa; **las galletas ya son comida** (merendar). |
| Cojines de suelo rosa y lila | Cocina | Asientos (para los peluches; la muñeca, cuando haya postura sentada). |
| Cesta | Cocina y baño | Cesto de la fruta o de la ropa y los juguetes del baño. |
| Osito y conejito | Las dos | De visita: comer con ella; el patito, en la bañera. |
| Estantería y lámpara del salón | Opcional | Si se quiere amueblar más sin piezas nuevas. |

## Ilustraciones nuevas que hacen falta

Todas en el **mismo estilo, cámara y luz que el salón aprobado**: vista de frente y un poco desde arriba, luz cálida desde
la ventana.
- PNG con el fondo transparente, salvo el fondo.
- Interior opaco, sin motitas, sin resplandor y sin sombra en el suelo.
- Cada pieza por separado, entera y apoyada en el suelo, de 800 a 1500 px de alto (el fondo, 1536 × 1024).

### Cocina

| N.º | Archivo | Pieza | Capas y estados | Notas |
| --- | --- | --- | --- | --- |
| 1 | `fondo-cocina.png` | Cocina vacía | una | Pared crema o con azulejos suaves, suelo de madera como el del salón, la ventana grande **en el centro**. |
| 2 | `encimera.png` | Encimera con fregadero y armarios bajos (2,00 × 0,95 m) | una | De frente, con la encimera visible por arriba (ahí va el frutero). |
| 3 | `cocinita.png` | Fogones y horno (0,65 × 0,95 m) | una | Para cocinar más adelante (por ejemplo, galletas en el horno). |
| 4 | `nevera-cerrada.png`, `nevera-abierta.png` | Nevera (0,70 × 1,55 m) | dos | El mismo encuadre; abierta, con leche, fruta y un bocadillo dentro. |
| 5 | `frutero.png` | Frutero con fruta (0,30 m) | una | Sobre la encimera. |
| 6 | `fruta-1.png`, `fruta-2.png`, `fruta-3.png` | Plato con fruta troceada | tres: entera, a medias, terminada | El mismo plato que el aprobado; misma posición en los tres. |
| 7 | `bocadillo-1…3.png` | Plato con bocadillo | tres | Igual. |
| 8 | `cereales-1…3.png` | Cuenco de cereales con leche | tres | Igual. |
| 9 | `leche-1…3.png` | Vaso de leche | tres: lleno, a medias, vacío | Igual. |
| 10 | (Vestir) `delantal` | Delantal infantil (opcional) | capa de ropa sobre los conjuntos | Ropa adecuada para cocinar, gratis; sigue `docs/NORMA_VISUAL_MUNECA.md`. |

### Baño

| N.º | Archivo | Pieza | Capas y estados | Notas |
| --- | --- | --- | --- | --- |
| 1 | `fondo-bano.png` | Baño vacío | una | Azulejos pastel, suelo claro, la ventana en el centro. |
| 2 | `banera-detras.png`, `banera-delante.png` | Bañera con patas (1,50 × 0,60 m) | dos, **como la cama** | «Delante», el borde de la bañera, para que la muñeca se vea dentro. |
| 3 | `lavabo.png` | Lavabo con pedestal, espejo y un escalón infantil (0,65 × 1,45 m) | una | Espejo con brillo suave, sin reflejo dibujado. |
| 4 | `inodoro.png` | Inodoro infantil (0,45 × 0,50 m) | una | Sencillo y amable. |
| 5 | `cortina-abierta.png`, `cortina-cerrada.png` | Cortina del rincón del inodoro (0,90 × 1,60 m) | dos | Se cierra mientras va al baño: **no hace falta ninguna postura**. |
| 6 | `toallero.png` | Toallero con toalla (0,50 × 0,90 m) | una | |
| 7 | `jabon.png` | Jabón (0,08 m) | una | Sobre el lavabo. |
| 8 | `cepillo.png` | Cepillo de dientes en su vaso | una | Más adelante: lavarse los dientes. |
| 9 | `patito.png` | Patito de goma (0,14 m) | una | Juguete del baño: diversión. |
| 10 | `alfombrilla.png` | Alfombrilla (1,00 m) | una | Plana, con la perspectiva del suelo. |
| 11 | `espuma.png` | Espuma | una | Encima del agua, al bañarse. |

### Posturas nuevas de nuestra muñeca

Siempre con la cara de D-012 y sus capas de ropa y peinado (`docs/NORMA_VISUAL_MUNECA.md`). No se deforma la muñeca para
simularlas.

| Postura | Para | ¿Imprescindible? |
| --- | --- | --- |
| **Sentada de frente** (en un cojín o una silla) | Comer en la mesa, merendar con los peluches | Para comer «de verdad»; sin ella, ver «Primera versión posible». |
| **Comiendo** (sentada, una mano a la boca) | Hambre | Recomendable. |
| **En la bañera** (sentada dentro: cabeza, hombros y brazos fuera del agua, con espuma) | Higiene: bañarse | **Sí** (sin ella no hay baño). |
| **Lavándose las manos** (de frente, manos juntas con espuma) | Higiene: lavarse | **Sí**. |
| **Lavándose los dientes** (cepillo en la mano, junto a la boca) | Higiene (más adelante) | Más adelante. |

## Cómo se atendería cada necesidad (cuando esté todo)

| Necesidad | Espacio | Qué hace la niña | Qué se ve | Sube | Primera versión posible sin postura nueva |
| --- | --- | --- | --- | --- | --- |
| **Hambre** | Cocina | Saca comida de la nevera o el frutero, la pone en la mesa y la toca | La muñeca va a la mesa; la comida pasa por sus tres estados («¡Ñam!») | +30 por plato, +15 la leche | **Sí:** de pie junto a la mesa, la comida va menguando (sus tres estados). Con la postura sentada, después. |
| **Higiene** | Baño | Toca el lavabo (lavarse las manos) o la bañera (bañarse) | Espuma y agua; en la bañera, con el patito | +40 lavarse, +70 bañarse | **No:** hacen falta las posturas «lavándose las manos» y «en la bañera». |
| **Ganas de ir al baño** | Baño | Toca el inodoro | Va al rincón, **se cierra la cortina**, suena la cisterna, se abre: «¡Ya está!» | +100 | **Sí:** con la cortina no hace falta ninguna postura. |

Reglas (las mismas de sueño y diversión, D-037):
- Bajan despacio y solo mientras se juega en Mi Mundo; nunca de 15.
- Avisos breves con dibujo y voz, una vez al bajar; ningún castigo ni pérdida de premios.
- **Las ganas de ir al baño bajarían más despacio** que las demás, y su aviso sería amable («Necesito ir al baño»), nunca un
  «accidente».
- **Ropa:** la ropa no se cambia nunca sin que ella elija. Con el delantal, al cocinar se propondría una vez, como el pijama
  para dormir. Para bañarse no hace falta cambiarse en Vestir: la postura «en la bañera» ya lleva solo hombros y espuma.

## Orden propuesto

1. Aprobar esta propuesta (distribución, piezas y posturas).
2. Generar las ilustraciones (la tabla de arriba): primero la **cocina** y el **rincón del inodoro**, que pueden funcionar sin
   posturas nuevas; después las **posturas** de lavarse y de la bañera.
3. Montarlo en la copia aislada:
   - habitaciones de la casa;
   - **hambre** con la comida en tres estados;
   - **ganas de ir al baño** con la cortina;
   - **higiene** cuando lleguen sus posturas.

   Cada necesidad se activa solo cuando su acción funciona.
4. Probar en el iPhone, guardar y reabrir, la copia de seguridad y sin conexión.

Mensaje para generar cada pieza (adjuntando el fondo del salón y el osito como referencia de estilo):

> Dibuja, en el mismo estilo, cámara y luz que este salón y este osito, [la pieza]. Vista de frente y un poco desde arriba,
> luz cálida desde la ventana. Fondo transparente (PNG), sin sombra en el suelo, sin resplandor alrededor, sin texto ni
> personajes, la pieza sola y entera, apoyada en el suelo.
