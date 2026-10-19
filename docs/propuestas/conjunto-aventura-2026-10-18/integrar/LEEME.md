# Integrar lo que devuelva ChatGPT (D-027) · 18/10/2026

Preparado **antes** de tener las imágenes, para que integrar cada guía sea rápido y siempre igual. `recibir.py`:

| Guía | Orden | Qué toma | Sale (candidato) |
|---|---|---|---|
| Rodillas (opción A) | `piernas <imagen> [máscara carpeta]` | solo los píxeles de `../piernas/mascara-zona.png`, sobre `../piernas/base-copia.png` | `piernas/base-piernas-sin-mallas.png` |
| 1 · Camiseta y chaleco | `ropa <imagen>` | lo que cambia respecto a nuestra plantilla en el torso, separado en camiseta (crema) y chaleco (arena y ribete) | `ropa/camiseta.png`, `ropa/chaleco.png` |
| 2b · Tiras | `tiras <imagen>` | lo que cambia en los hombros, verde, con sus hebillas | `mochila/tiras.png` |
| 2a · Cuerpo de la mochila | `mochila <imagen> [cx cy ancho giro]` | la pieza sobre el fondo crema; se coloca detrás de la base con `colocar()` (escala, posición y giro) | `mochila/mochila-recortada.png`, `mochila/mochila.png` |

Cada orden escribe también `comprobaciones.json` y `revision.png` en su carpeta.

- **Alineación** (rodillas, camiseta y chaleco, tiras): la imagen se lleva al ancho de nuestro lienzo y se buscan los dos
  iris cerca de los nuestros; con ellos, **escala uniforme y desplazamiento** (sin giro ni estiramiento: nada se deforma).
- **Comprobaciones:** que fuera de lo pedido la imagen coincida con nuestra muñeca (si ChatGPT ha cambiado algo más, se ve
  en `*_px_con_dE_mayor_20`); en las rodillas, que no queden mallas rosas en la zona y cómo es la unión con la piel de
  debajo; en la ropa, si queda camiseta rosa de la base a la vista, si la ropa pisa nuestros antebrazos y si ChatGPT ha
  cambiado nuestros brazos.
- **No cambia** la base aprobada, las capas candidatas actuales ni nada del juego.

**Probado** con imágenes de prueba hechas aquí con nuestras propias capas (otro tamaño, 1 024 px de ancho, y desplazadas,
como las devuelve ChatGPT), fuera del repositorio: la alineación recupera la escala y la posición (iris a 1 px; fuera de
lo pedido, diferencia mediana ΔE 1,0) y las comprobaciones avisan de lo que debe avisar (mallas sin completar, camiseta
rosa bajo las tiras, ropa sobre los brazos). Los parámetros finos de la separación se revisarán con cada imagen real.

**Rodillas, hecho (18/10):** con la imagen de ChatGPT (`../piernas/de-chatgpt/`), A en `piernas/` y B en `piernas-b/`; la
alineación de las rodillas es por la silueta (la plantilla no lleva ojos) y la piel se iguala en tono con la nuestra.
Hoja: `comparacion-rodillas.png` (`comparar_rodillas.py`). Detalles en `../piernas/LEEME.md`.

**Camiseta y chaleco, hecho (19/10):** con la imagen de la guía 1, en `ropa/`; alineados por la silueta del cuerpo (no por
los iris); hoja `comparacion-camiseta-chaleco.png` (`comparar_ropa.py`).

Uso (desde la raíz): `python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/recibir.py <guía> <imagen>`
(para probar sin escribir en el repositorio: `SALIDA_INTEGRAR=/otra/carpeta`).
