# Conjunto de hada · 22/10/2026 (D-029)

> **Diseño aprobado (22/10):** vestido lila y rosa de pétalos con flores bordadas, mangas de farol y lazo con estrella;
> alas irisadas con nervios dorados; varita de estrella dorada con flor y cintas; bailarinas lilas con flor. Referencia
> en `referencias/referencia-hada-aprobada.png` (imagen generada, **sin modificar**, 948 × 1660, SHA-256
> `93cb91fe39843064138d11c01cbf7e913b24903e7af799a16a8c2afb51a0540d`). **El encaje sobre nuestra base queda pendiente:**
> faltan la versión sin pelo y las piezas completas (abajo). Nada activado en el juego; `main`, las partidas y las pruebas congeladas no
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

## Referencia aprobada: lo medido (22/10)

- Mismo lienzo (948 × 1660, una fila más); iris en (391, 441) y (564, 441): escala 1,0173 por los ojos, como otras
  imágenes de ChatGPT. Piernas y pies a 1–3 px de los nuestros (y = 1 350–1 520). Las zapatillas (bailarinas) se ajustan a
  nuestros pies.
- **ChatGPT ha redibujado la melena** (con raya y más volumen arriba): no se usa; va **nuestra melena** (y la coleta y
  las dos coletas). Del diseño solo se tomarán las cuatro piezas.
- **Lo que no se ve entero:** los hombros, las mangas y el escote (los tapa la melena), y las **alas** (el pelo y el cuerpo
  tapan su centro y parte de las de abajo). La **varita** se ve entera salvo el palo bajo los dedos.

## Siguiente: versión sin pelo y piezas completas (`guia-chatgpt/`)

**Adjuntar:** `referencias/referencia-hada-aprobada.png`, `guia-chatgpt/plantilla-sin-pelo.png` y `guia-chatgpt/zonas-hada.png`.

> **1 · Conjunto sin pelo.** Sobre `plantilla-sin-pelo.png` (la misma imagen: mismo lienzo, tamaño, posición y encuadre),
> viste a la muñeca con **exactamente el mismo conjunto de hada de la imagen aprobada**: el mismo vestido (pétalos,
> flores, mangas de farol, lazo con estrella), las mismas alas, la misma varita en su mano derecha (a la izquierda de la
> imagen) y las mismas bailarinas; mismos colores, tamaños y detalles. **Sin pelo**, para que se vean completos el escote,
> los hombros y las mangas. Conserva exactamente su cara, sus ojos, su cuerpo, sus proporciones y su postura; no los
> redibujes. El vestido tapa entera la ropa rosa de la base (magenta en `zonas-hada.png`). Fondo crema liso, sin texto,
> sin sombra en el suelo, sin brillos sueltos y sin marcos.

> **2 · Alas solas.** En el mismo lienzo y en **la misma posición y tamaño** que en la imagen anterior, dibuja **solo las
> alas, enteras** (las cuatro, con su parte central de detrás de la espalda), sin la niña, sin el vestido ni la varita.
> Mismos colores, nervios dorados y brillo. Fondo crema liso, sin texto ni marcos.

> **3 · Varita sola.** En el mismo lienzo y en **la misma posición, tamaño y giro** que en la imagen anterior, dibuja **solo
> la varita, entera** (también el palo que tapaban los dedos), sin la niña ni la mano. Mismos detalles: estrella dorada,
> flor, hojas y cintas. Fondo crema liso.

Las bailarinas y el vestido salen de la imagen 1 (se ven enteros sin pelo). **Al recibirlas, se revisará aquí:**
alineación, que fuera de las piezas coincida con nuestra muñeca, que el vestido tape toda la ropa rosa, que las alas y la
varita coincidan con la imagen 1 y que sean las del diseño aprobado. Después se extraen las cuatro capas: alas detrás de
todo (también del pelo de detrás), vestido y zapatos sobre la base, y la varita con nuestros dedos por delante del palo.
