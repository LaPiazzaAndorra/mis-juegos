# Tonos de piel: claro (original), dorado, moreno y profundo · 16/10/2026 (D-023)

> **D-023:** la **lámina de referencia** está aprobada por la propietaria. **Las capas quedan pendientes de revisión.**
> Solo están en el visor (fila «Piel», con el **claro original por defecto**). Nada activado en el juego; las pruebas
> congeladas, `main` y las partidas no cambian.

Son variantes de **nuestras piezas originales** (que no se modifican) en las que **solo cambia el color de la piel**. No
se extrae la muñeca de la lámina ni cambian sus facciones.

| Archivo | Qué es |
| --- | --- |
| `referencia-tonos-piel-aprobados.png` | Lámina generada, conservada **sin modificar** (SHA-256 `56e34450…d697`). Solo se **mide** el tono. |
| `piel_tonos.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/piel-tonos/piel_tonos.py`). |
| `dorado/`, `moreno/`, `profundo/` | Las piezas de cada tono (948 × 1659, mismo lienzo y posición que las originales; ver abajo). |
| `comparacion-piel-entera.png`, `comparacion-piel-cara.png`, `comparacion-piel-parpadeo.png` | Los cuatro tonos sobre el conjunto aprobado (entera, cara y ojos cerrados). |
| `comprobaciones.json` | Cifras. |

Piezas de cada carpeta:

| Pieza | Qué cambia |
| --- | --- |
| `base-sin-ojos.png` | La piel de la cara, las orejas, el cuello, los brazos, las manos, las piernas y los pies (con labios, rubor, nariz y pecas). **No** la camiseta ni las mallas de la base. En las cejas solo cambia la piel de debajo: la ceja es la misma. |
| `ojos-abiertos-{marron,azul,verde,lila}.png` | Solo la piel de los párpados y del borde del ojo. **No** los iris, los blancos (con su sombreado) ni las pestañas. |
| `ojos-cerrados.png` | La piel de los párpados cerrados; las pestañas no cambian. |
| `manos-delante.png` | Las manos que van delante del vestido (son píxeles de la base: el mismo cambio). |
| `cejas-{chocolate,miel,oscuro,jengibre}.png` | Las cejas a juego con el pelo (D-022), recalculadas sobre la piel nueva: mismo color de ceja, sin piel clara alrededor. |
| `bordes-pelo-{castano,chocolate,miel,oscuro,jengibre}.png`, `bordes-vestido.png`, `bordes-zapatos.png` | Capas pequeñas de **bordes**: el pelo de delante (en el nacimiento del pelo y donde pasa sobre la piel), el cuello del vestido y el borde de los zapatos traían piel clara «pegada» en su borde. Estas capas, encima de cada una, ponen solo esos píxeles con la piel nueva. Las capas de pelo, vestido y zapatos **no cambian**. |

**No cambian** (no tienen piel): pelo, vestido, zapatos, corona y pintacaras.

## Cómo se ha hecho

1. **Tono aprobado:** la piel de la cara, las orejas y el cuello se marca en el recuadro «Claro (original)» (donde se
   distingue bien del pelo) y se mide en esos mismos sitios de los cuatro recuadros (la muñeca está en la misma
   posición): unos 48 000 píxeles por tono.
2. **Una transformación por tono (en Lab), la misma para todas las piezas:**
   - **luminosidad:** se desplaza a la del tono y se escala con su dispersión, así se conservan las sombras y el
     volumen;
   - **color:** el color medio pasa al del tono; la variación de cada píxel (rubor, labios, pecas, nariz, orejas) se
     conserva, girada con el tono y proporcional a la luminosidad nueva (en una piel más oscura la misma diferencia se
     ve más fuerte; así no se enrojecen);
   - si un color no cabe en la pantalla, se le baja un poco la saturación (no se recorta).
3. **Mezclas de piel con otra cosa** (borde de la ropa, de las pestañas, del blanco del ojo, nacimiento del pelo,
   cejas): solo cambia la parte de piel que lleva cada píxel. Así no quedan parches ni halos del tono anterior.
4. **El canal alfa no cambia** en ninguna pieza.

## Comprobaciones (`comprobaciones.json`)

| Tono | Lámina: luminosidad media (claro → tono) | Nuestra frente (original → tono) | Detalle de la piel conservado |
| --- | --- | --- | --- |
| Dorado | 211 → 187 | 219 → 195 | 0,988 |
| Moreno | 211 → 169 | 219 → 178 | 0,965 |
| Profundo | 211 → 129 | 219 → 138 | 0,889 |

- Nuestra piel original es unos 8 puntos más clara que la de la lámina; las variantes mantienen esa misma diferencia.
- «Detalle conservado»: correlación del detalle fino de la luminosidad (textura, pecas) entre el original y la variante.
  En el profundo es algo menor porque, al oscurecer, hay menos niveles de luz para el mismo detalle.
- En todos los tonos: alfa idéntico; la ropa de la base, los iris, los blancos (fuera de su borde) y las pestañas sin
  cambios; las manos, iguales que la base.
- Bordes de los ojos: la diferencia de luz entre la piel de la capa de ojos y la de la base de alrededor es la misma
  que en el original (no hay parche); en los párpados cerrados, prácticamente igual (≤ 1).
- Fuentes sin cambios (SHA-256). En el visor, a tamaño real coincide con el montaje en lo opaco (≤ 3).

## A revisar

- El encaje de los tres tonos, el parpadeo y los bordes (ojos, nacimiento del pelo, cuello, manos, pies).
- Las **cejas** (de la base o a juego) son más claras que la piel en el moreno y, sobre todo, en el profundo; no se han
  cambiado (están aprobadas). Si se quiere, se decidirá aparte.
- Con las propuestas antiguas de pelo de delante (A, B, C…) no hay capa de bordes: el visor la oculta.
- Después: una copia nueva de prueba del juego; la resolución 2000 × 3500.
