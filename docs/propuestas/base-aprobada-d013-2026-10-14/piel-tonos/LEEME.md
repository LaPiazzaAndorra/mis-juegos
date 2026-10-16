# Tonos de piel: claro (original), dorado, moreno y profundo · 16/10/2026 (D-023)

> **D-023:** la **lámina de referencia** está aprobada por la propietaria. **Las capas quedan pendientes de revisión.**
> Solo están en el visor (fila «Piel», con el **claro original por defecto**). Nada activado en el juego; las pruebas
> congeladas, `main` y las partidas no cambian.
>
> **16/10/2026 (2):** la propietaria **no aprueba todavía el profundo** (en el iPhone: restos claros en el nacimiento
> del pelo —también con el pelo pelirrojo— y en el contorno del ojo junto al lagrimal; piel, orejas y labios demasiado
> rojizos). Hecha una **corrección localizada** (abajo, «Corrección del 16/10»), con el antes y el después en
> `correccion-profundo/`. Se aplica con el mismo programa a los tres tonos; dorado y moreno siguen pendientes de revisión.

Son variantes de **nuestras piezas originales** (que no se modifican) en las que **solo cambia el color de la piel**. No
se extrae la muñeca de la lámina ni cambian sus facciones.

| Archivo | Qué es |
| --- | --- |
| `referencia-tonos-piel-aprobados.png` | Lámina generada, conservada **sin modificar** (SHA-256 `56e34450…d697`). Solo se **mide** el tono. |
| `piel_tonos.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/piel-tonos/piel_tonos.py`). |
| `dorado/`, `moreno/`, `profundo/` | Las piezas de cada tono (948 × 1659, mismo lienzo y posición que las originales; ver abajo). |
| `comparacion-piel-entera.png`, `comparacion-piel-cara.png`, `comparacion-piel-parpadeo.png` | Los cuatro tonos sobre el conjunto aprobado (entera, cara y ojos cerrados). |
| `comprobaciones.json` | Cifras. |
| `correccion-profundo/antes-despues-*.png` | Antes y después de la corrección del 16/10 (profundo): nacimiento del pelo, ojos, lagrimal y cara. |
| `correccion-profundo/2-bordes-pelo/*.png` | Antes y después de la corrección 2 (bordes con cada color de pelo): sienes y orejas, mandíbula, cuello, frente (5 colores, fondo claro y oscuro), cuello del vestido, ojos y cara. |

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
     conserva, girada con el tono y en la proporción medida en la lámina (dorado 0,75, moreno 0,67, profundo 0,42);
   - si un color no cabe en la pantalla, se le baja un poco la saturación (no se recorta).
3. **Mezclas de piel con otra cosa** (borde de la ropa, de las pestañas, del blanco del ojo, nacimiento del pelo,
   cejas): solo cambia la parte de piel que lleva cada píxel. Así no quedan parches ni halos del tono anterior.
4. **El canal alfa no cambia** en ninguna pieza.

## Corrección del 16/10 (tras la revisión en el iPhone)

| Problema | Causa (en las capas reales) | Corrección |
| --- | --- | --- |
| Piel, orejas y labios rojizos | Se conservaba demasiada diferencia de color en lo rojizo (rubor, orejas, labios). | Se **mide en la lámina** cuánto se conserva en cada tono, en los mismos sitios: dorado 0,75, moreno 0,67, **profundo 0,42**. |
| Restos claros junto al lagrimal | El rosa pálido del lagrimal (capa de ojos abiertos) se tomaba por blanco y no cambiaba. | En el extremo de cada ojo hacia la nariz (14 px), lo que tiene algo de color es piel. **Los blancos y los iris no cambian** (0 px de blanco cambiados fuera del lagrimal; 236 px rosados del lagrimal sí). |
| Borde claro en el contorno del ojo | El borde del párpado inferior es un brillo más claro que la piel y se conservaba igual de claro. | Corrección **localizada** en una franja de 7 px alrededor de la abertura (base y capas de ojos): lo más claro que la piel se suaviza en proporción al oscurecimiento ((L_tono/L_claro)²: profundo 0,37). |
| Nacimiento del pelo claro (y con pelirrojo/rubio) | Los píxeles del borde del pelo de delante mezclan pelo y piel clara; antes se trataba igual con todos los colores de pelo. | Para cada píxel: parte de piel (por su color entre el pelo de alrededor y la piel de debajo) → piel nueva; parte de pelo → **el pelo de alrededor en su color aprobado** (de cada color de pelo). Solo del lado de la cara. El pelo no cambia a más de 12 px de su borde (0 px). |
| Línea oscura en las sienes (aparecía al corregir) | Franja estrecha del cuero cabelludo de la base que asoma en el borde de la cabeza. | Se cubre con el color del pelo de detrás de alrededor, en la capa de bordes de cada color de pelo. |

**Corrección 2 (16/10, bordes con cada color de pelo):** con piel profunda y pelo pelirrojo seguían viéndose bordes
claros. Causa: la corrección del pelo solo miraba el nacimiento del pelo de delante (y se paraba a 10 px del contorno de
la cabeza), así que quedaban los bordes junto a las orejas, la mandíbula y el cuello, y el borde del **pelo de detrás**.
Ahora:
- se marca la **piel que se ve de verdad** en el montaje (sin pelo de delante, vestido ni zapatos encima);
- en los **dos pelos**, los píxeles a menos de 12 px de esa piel (también los casi transparentes) se separan en parte de
  piel → piel nueva y parte de pelo → el pelo de alrededor **en su color aprobado** (con cada uno de los 5 colores, con el
  mismo tono de piel). Los colores de pelo no cambian ni se oscurecen: el pelo a más de 12 px de la piel no se toca (0 px);
- el **cuello del vestido** tenía un filo de 2–3 px con piel clara pegada (se veía como una línea clara sobre la piel
  oscura): se corrige igual, con el color del vestido de justo dentro.
- Comprobación automática de «restos de piel clara» (píxeles junto a la piel que siguen con el color de la piel clara
  original), con piel profunda: castaño 178 → 60, chocolate 223 → 78, oscuro 97 → 6, pelirrojo 88 → 86. Los 86 del
  pelirrojo (y los del rubio miel) son mechones de su color aprobado, que se parece al de la piel clara: no son restos.
- Antes (la versión revisada en el iPhone) y después en `correccion-profundo/2-bordes-pelo/`.

Revisado (antes / después, `correccion-profundo/`): nacimiento del pelo con castaño, rubio miel y pelirrojo jengibre
sobre fondo claro y oscuro; ojos abiertos (verdes, azules, marrones) y cerrados; lagrimales ampliados; cara completa.

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
