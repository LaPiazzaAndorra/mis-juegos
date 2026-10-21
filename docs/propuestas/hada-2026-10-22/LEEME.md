# Conjunto de hada · 22/10/2026 (D-029)

> **Fase de diseño.** Primero se revisa aquí el diseño (una imagen de ChatGPT sobre nuestra base); con él aprobado, se
> piden las piezas por separado y se extraen. Nada activado en el juego; `main`, las partidas y las pruebas congeladas no
> cambian. Se conservan la cara, el cuerpo y la postura de la base aprobada (D-013).

**Cuatro piezas separadas:** vestido, alas, varita y zapatos (cada una, su capa: se podrán poner y quitar por separado).
- **Vestido:** tapa entera la ropa rosa de la base (camiseta y mallas).
- **Alas:** por **detrás** del cuerpo (salen de la espalda y asoman por los lados de los hombros); el pelo cae por delante.
- **Varita:** en la mano derecha de la muñeca (a la izquierda de la imagen), sin cambiar la postura de la mano.
- **Zapatos:** sobre nuestros pies, sin cambiar su tamaño.

## Guía para ChatGPT (`guia-chatgpt/`)

| Archivo | Qué es |
| --- | --- |
| `plantilla-con-pelo.png` | Nuestra muñeca aprobada (piel clara, ojos marrones, melena castaña limpia), en nuestro lienzo de 948 × 1659. |
| `plantilla-sin-pelo.png` | La misma muñeca sin pelo: se ven el cuello, los hombros, la espalda y los brazos. |
| `zonas-hada.png` | Magenta: lo que tapa el vestido; verde: dónde van las alas (detrás); amarillo: la mano de la varita; naranja: los pies; azul: lo que no se toca. |
| `medidas.json`, `preparar_guia.py` | Cifras y programa (desde la raíz: `python3 docs/propuestas/hada-2026-10-22/guia-chatgpt/preparar_guia.py`). |

**Adjuntar:** las tres imágenes (y, si la hay, una imagen de inspiración del conjunto).

**Mensajes (copiar; uno cada vez, en la misma conversación):**

> **1 · Diseño, con pelo.** Sobre la plantilla `plantilla-con-pelo.png` (la misma imagen: mismo lienzo, tamaño, posición y
> encuadre), diseña un **conjunto de hada** para esta niña de 5–6 años, en el estilo de la ilustración y en colores
> pastel: un **vestido**, unas **alas**, una **varita** y unos **zapatos**. Conserva **exactamente** su cara, sus ojos, su
> cuerpo, sus proporciones, su postura (brazos, manos y piernas en el mismo sitio) y su melena: no los redibujes. El vestido
> tapa entera la ropa rosa de la base (magenta en `zonas-hada.png`); las alas van **detrás** del cuerpo, saliendo de la
> espalda (zona verde), y el pelo cae por delante de ellas; la varita, en su mano derecha (amarilla), sin cambiar la
> postura de la mano; los zapatos, sobre sus pies (naranja), sin cambiar su tamaño. Nada de brillos sueltos ni partículas
> alrededor. Fondo crema liso, sin texto, sin sombra en el suelo y sin marcos.

> **2 · Sin pelo.** Ahora el **mismo conjunto**, idéntico, sobre `plantilla-sin-pelo.png` (la muñeca sin pelo), para que
> se vean completos los hombros, el escote, las mangas y el nacimiento de las alas. Mismas reglas; fondo crema liso.

**Cómo se revisará aquí:** alineación con nuestra muñeca; que fuera del conjunto coincida (cara, cuello, manos, pies); que
el vestido tape toda la ropa rosa; que no deforme el cuerpo; el encaje con el pelo (melena, coleta y dos coletas). Con el
diseño aprobado se pedirá, si hace falta, cada pieza sola (sobre todo las alas enteras, que el cuerpo tapa en parte) y se
extraerán como capas separadas.
