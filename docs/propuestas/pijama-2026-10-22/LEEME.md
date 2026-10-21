# Pijama · 22/10/2026 (D-028)

> **Fase de diseño.** Primero se revisa aquí el diseño (una imagen de ChatGPT sobre nuestra base); solo después de
> aprobarlo se extraen las prendas. Nada activado en el juego; `main`, las partidas y las pruebas congeladas no cambian.

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
