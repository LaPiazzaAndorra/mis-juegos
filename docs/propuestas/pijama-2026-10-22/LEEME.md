# Pijama · 22/10/2026 (D-028)

> **22/10: variantes (4 tonos × 5 colores × 3 peinados) y camiseta con el borde limpio aprobadas visualmente**, sin dar
> por probadas una a una las 60 combinaciones en el iPhone. Se conservan las anteriores.

> **Diseño aprobado (22/10):** pijama azul con lunas y estrellas, puños rosas y zapatillas crema. Referencia en
> `referencias/referencia-pijama-aprobada.png` (imagen generada, **sin modificar**, 948 × 1659, SHA-256
> `96c9e39e216774a85a80e0d382a1fa054e11ff4dc52189aba5f33a88ed68ce4c`). **El encaje sobre nuestra base queda pendiente:**
> antes de extraer las prendas se pide el mismo pijama sin pelo ni gorrito, con hombros y mangas completos (abajo).
> Nada activado en el juego; `main`, las partidas y las pruebas congeladas no cambian.

Con el **gorrito de dormir aprobado** (D-024, variante B: `../accesorios-2026-10-16/gorrito/capa-gorrito-b.png`), que no
se rediseña. Se conservan **la cara, el cuerpo y la postura** de la base aprobada (D-013).

## Guía para ChatGPT (`guia-chatgpt/`)

| Archivo | Qué es |
| --- | --- |
| `plantilla-con-pelo-y-gorrito.png` | Nuestra muñeca aprobada (piel clara, ojos marrones, melena castaña sin los restos del vestido) con el gorrito B, en nuestro lienzo de 948 × 1659: así tiene que quedar el pijama con el pelo. |
| `plantilla-sin-pelo.png` | La misma muñeca sin pelo ni gorrito: se ven el cuello, los hombros y los brazos. |
| `zonas-pijama.png` | En magenta, la ropa de la base (camiseta y mallas rosas, de y = 645 a 1258) que el pijama tiene que tapar entera; en azul, lo que no se toca (cabeza, cuello y manos). |
| `medidas.json`, `preparar_guia.py` | Cifras y programa (desde la raíz: `python3 docs/propuestas/pijama-2026-10-22/guia-chatgpt/preparar_guia.py`). |

**Qué adjuntar:** la imagen del pijama elegido (si la hay), `plantilla-con-pelo-y-gorrito.png`,
`plantilla-sin-pelo.png` y `zonas-pijama.png`.

**Mensajes (copiar; uno cada vez, en la misma conversación):**

> **1 · Con pelo.** Sobre la plantilla `plantilla-con-pelo-y-gorrito.png` (la misma imagen: mismo lienzo, tamaño, posición
> y encuadre), viste a la muñeca con **el pijama de la imagen adjunta**. Conserva **exactamente** su cara, sus ojos, su
> cuerpo, sus proporciones de niña de 5–6 años, su postura (brazos y piernas en el mismo sitio), su melena y el gorrito de
> dormir: no los redibujes. El pijama tiene que tapar entera la ropa rosa de la base (en magenta en `zonas-pijama.png`) y
> dejar a la vista la cara, el cuello y las manos (en azul). Que no cambie el ancho del cuerpo: la ropa se adapta a la
> muñeca, no al revés. Fondo crema liso, sin texto, sin sombra en el suelo y sin marcos.

> **2 · Sin pelo.** Ahora el **mismo pijama**, idéntico, sobre `plantilla-sin-pelo.png` (la muñeca sin pelo ni gorrito),
> para ver el cuello, los hombros y las mangas. Mismas reglas: no cambies la muñeca; fondo crema liso.

**Cómo se revisará aquí:** la imagen se alinea con nuestra muñeca por los ojos y se compara con la plantilla: fuera del
pijama tiene que coincidir (cara, manos, pies, pelo y gorrito); que tape toda la ropa rosa; que no deforme el cuerpo; y
el encaje con el pelo y el gorrito. Si se aprueba el diseño, después se extraen las prendas sobre nuestra base (como con
el conjunto de aventura) y se adaptan a los tonos de piel y colores de pelo aprobados.

## Referencia aprobada: lo medido (22/10)

- Mismo lienzo que el nuestro (948 × 1659). Los iris están en (391, 443) y (565, 443) (los nuestros, en 391 y 567):
  escala 1,0115 y desplazamiento (−4,5; −5,1), como en las imágenes anteriores de ChatGPT sobre nuestra plantilla.
- El cuerpo coincide con el nuestro donde se ve: manos (y = 1 000: x 196–763 frente a 195–764) y piernas (y = 1 100–1 300:
  a 1–5 px). Las zapatillas son un poco más anchas que nuestros pies (y = 1 500: x 313–647 frente a 334–630).
- **No se puede medir el encaje de los hombros y las mangas:** la melena los tapa. El gorrito lo ha redibujado ChatGPT (más
  grande); se usará **nuestro gorrito B aprobado**, no el de la imagen.

## Siguiente: el mismo pijama sin pelo ni gorrito (`guia-chatgpt/`)

**Adjuntar:** `referencias/referencia-pijama-aprobada.png`, `guia-chatgpt/plantilla-sin-pelo.png` y
`guia-chatgpt/zonas-pijama.png`.

> **Pijama sin pelo.** Sobre la plantilla `plantilla-sin-pelo.png` (la misma imagen: mismo lienzo, tamaño, posición y
> encuadre), viste a la muñeca con **exactamente el mismo pijama de la imagen aprobada**: azul con lunas y estrellas crema,
> cuello y puños rosas, pantalón largo con puños rosas y zapatillas crema con suela rosa; mismos colores, estampado, tamaño
> de las lunas y estrellas, costuras y textura. **Sin pelo y sin gorrito**, para que se vean los hombros y las mangas
> **completos** (sin huecos donde antes estaba el pelo). Conserva exactamente su cara, sus ojos, su cuerpo, sus
> proporciones y su postura: no los redibujes; la ropa se adapta a la muñeca. Tiene que tapar entera la ropa rosa de la
> base (magenta en `zonas-pijama.png`) y dejar a la vista la cara, el cuello y las manos (azul). Fondo crema liso, sin
> texto, sin sombra en el suelo y sin marcos.

**Al recibirla, se revisará aquí:** alineación por los ojos con nuestra plantilla, que fuera del pijama coincida (cara,
cuello, manos), que tape toda la ropa rosa, que no cambie el ancho del cuerpo, que los hombros y las mangas estén
completos y que sea el mismo pijama que la referencia. Con ella aprobada, se extraen las prendas (camiseta, pantalón y
zapatillas por separado) y se prueban con la melena, la coleta, las dos coletas y el gorrito B.

## Imagen sin pelo ni gorrito recibida y prendas extraídas (22/10, candidato)

- Recibida sin modificar: `guia-chatgpt/de-chatgpt/pijama-sin-pelo-chatgpt.png` (948 × 1659, SHA-256 `fba129f44e895c49eadf24185c5aa9d4f184035cd767cff652ff655701f1d7fb`).
- **Alineación** por la silueta (cabeza, cuello y manos): escala 0.9964, desplazamiento
  [2.74, 1.62], sin giro ni deformación. Fuera del pijama coincide con nuestra muñeca (mediana dE
  cara 4.58, manos 5.74). Por los ojos salía un 2 % más grande (los iris se miden a 1 px).
- **Diseño:** el mismo de la referencia (azul con lunas y estrellas, cuello y puños rosas, pantalón largo con puños,
  zapatillas crema con suela rosa); hombros y mangas completos.
- **Ropa rosa de la base:** el pijama de la imagen era 1–4 px más estrecho en las esquinas de las mangas cortas de la
  camiseta de la base (junto a los hombros) y en el costado de una pernera (donde asomaba también la pierna): 1 977 px.
  Ahí cada prenda se alarga con su propia tela azul y un contorno suavizado (`integrar/mascara-ampliado-*.png`,
  1711 y 2502 px). **Rosa a la vista: 0 px.** En el hombro derecho el retoque
  se nota un poco (textura repetida): a revisar.
- **Capas** (`integrar/capas/`, 948 × 1659): `camiseta.png`, `pantalon.png`, `zapatillas.png`. Nada de su cara, piel, cuerpo
  ni fondo. Las zapatillas son algo más anchas que nuestros pies (los tapan; 81 px del borde del pie asoman por el
  tobillo, bajo el puño del pantalón).
- **Montajes** (`integrar/montajes-peinados.png`; sueltos en `integrar/montaje-1…4.png`): sin pelo, melena con el gorrito B,
  coleta (con cinta) y dos coletas (sin sombrero), con el pelo limpio para la ropa. El gorrito B solo está colocado para
  la melena (con la coleta y las dos coletas sigue pendiente, D-024). `integrar/comparacion-recibida.png`: la imagen
  alineada frente a nuestra muñeca con solo el pijama.
- **Visor:** fila «Ropa», «Pijama (candidato)»; por ahora con la piel clara (los cinco colores de pelo y los tres
  peinados). Programa: `integrar/extraer_pijama.py`. **Encaje pendiente de aprobación.**

## Encaje aprobado (22/10, `75e2cb5`) y tonos de piel (22/10, candidatas)

- **Encaje aprobado** por la propietaria: camiseta, pantalón y zapatillas de `integrar/capas/` (sin cambios).
- **Camiseta con el borde limpio** (`integrar/capas-b/camiseta.png`, `limpiar_borde.py`): al alargar la tela de las mangas
  quedaron 127 píxeles sueltos a cuadros en el contorno (una línea de puntos claros sobre el fondo, el pelo o la piel
  oscura, también con la piel clara). Solo en esa zona alargada se quitan y el borde se rehace suave (1 838 px de alfa; el
  color no cambia). La aprobada se conserva; el visor usa la limpia. **A confirmar por la propietaria.**
- **Tonos de piel** (`integrar/pieles/pijama_pieles.py` → `integrar/pieles/<tono>/`): base del tono aprobada; `bordes-ropa.png`
  (cuello, puños, puños de los tobillos y zapatillas: la piel clara pegada en el borde pasa a la piel nueva, ≈ 1 840 px);
  bordes del pelo aprobados sin lo que cae sobre el pijama.
- **Pelo para el pijama** (`integrar/pelo/pelo_pijama.py`): las copias limpias para la ropa con las rendijas de fondo
  rellenadas también junto a las mangas del pijama (melena 120 px, dos coletas 111 px).
- Hojas: `integrar/pieles/tonos-peinados.png`, `colores-melena.png`, `colores-coleta.png`, `colores-coletas2.png` (4 tonos ×
  5 colores) y `detalles-antes-despues.png` (cuello, puños, tobillos y pelo). Visor: «Pijama (candidato)» con los cuatro
  tonos y los cinco colores. **Tonos candidatos, pendientes de revisión; sin probar en el iPhone real.**

**22/10 (indicaciones de la propietaria):** la camiseta con el borde limpio (`integrar/capas-b/`) **se mantiene como
candidata**; la aprobada de `75e2cb5` (`integrar/capas/camiseta.png`) se conserva **intacta**. En el visor, con el pijama,
fila «Camiseta del pijama» para compararlas (borde limpio, por defecto, o aprobada); hoja
`integrar/capas-b/comparacion-camisetas.png`. La propietaria revisará los tonos en el visor antes de aprobar esta fase.
**En las comparaciones del pijama, las dos coletas se muestran sin el sombrero de aventura** (hojas de `integrar/pieles/`
rehechas así).
