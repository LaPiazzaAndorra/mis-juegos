# Variante EXPERIMENTAL · bordes rosados y mechón suelto · 15/10/2026

> **15/10/2026: la propietaria elige la variante B** (bordes corregidos y sin el mechón suelto) como candidata preferida
> del borrador de pelo. A se conserva. No es aprobación final ni se activa.

Es una **propuesta**: no se activa ni se publica. Parte de la revisión localizada (`../`), que se conserva sin cambios
como punto de partida. No se rellenan los huecos de los rizos (pueden dejar ver el brazo o la ropa). No se toca el
cuello reconstruido, el resto de la melena, la base ni los ojos (comprobado con SHA-256 y con el montaje).

| Archivo | Qué es |
| --- | --- |
| `variante.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/revision-localizada/variante-experimental/variante.py`). |
| `pelo-variante-bordes-detras/delante.png` | **A**: bordes rosados corregidos. |
| `pelo-variante-sin-mechon-detras/delante.png` | **B**: A sin el mechón suelto. |
| `mascara-cambio-de-color.png` | Máscara explícita del cambio de color de A (gris = cuánto cambia). |
| `mascara-mechon-quitado.png` | Píxeles quitados en B. |
| `comparacion-bordes.png` | Las dos zonas rojas antes/después sobre fondo claro, oscuro y sobre la muñeca (×2). |
| `comparacion-mechon.png` | El mechón con/sin, sobre los mismos tres fondos (×2). |
| `vista-mascaras.png` | Dónde actúan las máscaras. |
| `vista-conjunto.png` | Revisión, A y B enteras (el resto no cambia). |
| `montaje-variante-*.png` | Conjunto montado (abiertos; B también cerrados). |
| `comprobaciones.json` | Cifras y comprobaciones. |

## A · Bordes rosados

- Solo dentro de las dos zonas rojas de `../zonas-pendientes.png`, a ≤ 6 px del borde transparente, y solo en los
  píxeles más rojizos que el pelo limpio de alrededor (peso según la diferencia de tono, de 0 a 1).
- Color nuevo = color medio del pelo limpio cercano + la mitad de la diferencia de luminosidad del píxel, mezclado
  según el peso. **El alfa no cambia en ningún píxel**: posición, forma y transparencia de los rizos iguales.
- 5 752 píxeles con cambio de color (medio 7 por canal; máximo 107 en el filo más rosado).
- Resultado: el filo coral de los huecos pasa a castaño. El borde más externo, semitransparente, conserva algo de
  tono cálido; se nota sobre todo sobre fondo oscuro.

## B · Sin el mechón suelto

- Se quitan solo los 2 454 píxeles del mechón (oscuro) dentro de su zona. El borde claro del rizo vecino que entraba
  en esa zona (87 px) se conserva: queda un pequeño saliente que es del rizo, no del mechón.
- No se recorta ningún rizo ni se inventa una unión.

**Probado:** comprobaciones automáticas y revisión visual en el ordenador; no en el juego ni en un iPhone.
