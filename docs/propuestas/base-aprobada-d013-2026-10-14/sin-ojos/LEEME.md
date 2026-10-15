# Base sin ojos (propuesta) y comprobación real del montaje · 15/10/2026

Copia independiente de `../base-transparencia-corregida.png` (que **no se toca**) con la zona de los ojos
rellenada de piel, y montaje de la capa de prueba de los ojos encima. Propuesta para revisar: no se activa
nada ni se corrigen colores de bordes.

| Archivo | Qué es |
| --- | --- |
| `relleno.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/sin-ojos/relleno.py`). |
| `base-sin-ojos-propuesta.png` | Base 948 × 1659 sin ojos. Solo cambian los píxeles de la zona de relleno. |
| `zona-relleno.png` | Zona rellenada (blanco = cambiado). |
| `capa-referencia-B.png` | Referencia del montaje B (ver abajo). No es una pieza propuesta. |
| `vista-tamano-juego.png`, `vista-ampliada.png` | Original, base sin ojos, montaje A y montaje B, a tamaño de juego y ×3; zona y mapa de diferencias. |
| `comprobaciones.json` | Cifras. |

## Cómo se ha hecho

- **Zona de relleno (15 976 px, caja x 307–653, y 393–484):** la capa de ojos (máscara v2) y 2 px alrededor,
  más los restos del dibujo de los ojos que la capa no lleva (puntas y trozos de pestañas pegados a ella) y el
  borde claro del párpado y del lagrimal. **Fuera de esa zona no cambia ningún píxel** (comprobado): cara,
  cejas, nariz, boca, pecas, pliegue del párpado y proporciones quedan idénticos.
- **Relleno:** interpolación armónica (Laplace) desde la piel que rodea la zona, ignorando trazos oscuros y
  brillos. Continúa el color y el degradado; es liso (no inventa textura ni pecas). No se regenera nada.

## Comprobación del montaje (lo importante)

- **Montaje A = capa de prueba v2 sobre la base sin ojos:** **no es idéntico** al original:
  4 024 píxeles distintos (2 358 con diferencia > 24; máximo 135). Faltan o se aclaran:
  1. las **puntas finas de las pestañas** (en la v2 tienen opacidad parcial y su color ya trae piel mezclada:
     sobre el relleno quedan más claras);
  2. el **borde rosado del párpado inferior y del lagrimal**, que la v2 dejaba fuera de la capa y el relleno
     ha retirado de la base.
  A tamaño de juego se nota poco, pero se ve: el borde inferior del ojo queda más plano.
- **Montaje B (referencia) = los mismos colores originales con opacidad completa en toda la zona de relleno:**
  **idéntico** al original (0 píxeles distintos). Demuestra que el relleno y la posición son correctos y que
  lo que falta en A es solo de la máscara. Como capa suelta, B lleva piel alrededor de los ojos (no es limpia).

## Qué haría falta para que la capa sea limpia y el montaje exacto

- **Solo con la máscara (sin cambiar colores):** añadir a la capa el borde rosado del párpado inferior y del
  lagrimal (que sí es del ojo) y los restos de pestañas que ahora solo están en la zona de relleno. Eso acerca
  A a B en esa parte.
- **Cambiando colores (no hecho, necesita aprobación):** las puntas semitransparentes de las pestañas solo
  pueden quedar exactas y sin halo si se recalcula su color propio (quitar la piel mezclada). Sin eso, o se
  aclaran (A) o llevan piel alrededor (B).

## Otros puntos de la base sin ojos

- Se conservan el **pliegue del párpado** y, sobre él, unos pocos **trozos de raíz de pestaña** que cruzan
  el pliegue (no se han podido separar sin borrar el pliegue).
- El relleno es una superficie lisa: con los ojos encima no se ve; para el **parpadeo**, la capa de ojos
  cerrados tendrá que cubrir esa zona.
