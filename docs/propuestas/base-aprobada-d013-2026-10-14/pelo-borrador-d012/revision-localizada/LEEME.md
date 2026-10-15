# Pelo de D-012 sobre la base D-014 · revisión LOCALIZADA · BORRADOR · 15/10/2026

Sigue siendo un **borrador**: no es una capa de producción, no se activa y no se publica. El montaje anterior
(`../`) se conserva sin cambios como referencia del encaje. Los ojos no se han retocado (abiertos v3 color
experimental; cerrados V2.1, candidata preferida).

Punto de partida: el pelo **ya colocado** del borrador anterior (`../pelo-borrador-detras.png`, escala uniforme 1,0934).
**No se vuelve a escalar** la melena y **no se cambia la base**. Todo se hace con **máscaras por zonas** (coordenadas
fijas de la base, 948 × 1659); no hay ningún filtro de color aplicado a toda la melena, así que los brillos se conservan.
La limpieza solo baja la opacidad: no cambia el color de ningún píxel del pelo (comprobado).

| Archivo | Qué es |
| --- | --- |
| `revision_pelo.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/revision-localizada/revision_pelo.py`). |
| `pelo-revisado-detras.png`, `pelo-revisado-delante.png` | Las dos capas revisadas (948 × 1659). |
| `vista-capas-oscuro.png` | Cada capa aislada sobre fondo oscuro, antes y después. |
| `vista-capa-detras-oscuro.png`, `vista-capa-delante-oscuro.png` | Las capas revisadas, grandes, sobre fondo oscuro. |
| `montaje-revisado-abiertos.png`, `montaje-revisado-cerrados.png` | Conjunto montado. |
| `vista-montaje-revisado.png` | Antes / revisado (abiertos y cerrados) a ~600 y ~220 px; cuello y orejas ×1,5. |
| `vista-mechon-brazo.png` | El mechón del brazo, antes y después (×2). |
| `zonas-revisadas.png` | Dónde se ha limpiado (magenta), **reconstruido** (verde) y afilado (azul). |
| `mascara-zonas-reconstruidas.png` | Máscara exacta de lo reconstruido que se ve en el montaje. |
| `zonas-pendientes.png` | Lo que este método no resuelve con calidad (en rojo). |
| `parpadeo-revisado-tamano-juego.gif`, `parpadeo-revisado-cara.gif` | Parpadeo con el pelo revisado. |
| `comprobaciones.json` | Cifras y comprobaciones; cada trozo reconstruido con su origen. |

## 1. Limpieza por zonas

- **Detrás de la cabeza:** donde la cara, las orejas y el cuello de la base son opacos (óvalo de la cara y todo por
  debajo de y = 430), la capa de detrás queda vacía. Allí estaban la cara, las orejas, las pestañas y el cuello de la
  referencia.
- **Franja del contorno:** franja de 8 px por fuera de la mandíbula, la mitad baja de las orejas y el cuello. Allí solo
  quedaban bordes de piel de la referencia; se vacía y se reconstruye (apartado 2).
- **Cejas:** dos óvalos sobre las cejas de la base. Se quitan los trazos finos de las cejas de la referencia; el pelo
  grueso de las sienes se queda.
- **Capa de delante:** el borrador anterior pintaba las orejas, el contorno de la cara y el cuello de la referencia
  **encima** de la base. Ahora no hay pelo delante en la cara por debajo de las cejas, ni en las orejas ni en el cuello
  (la referencia lleva las orejas despejadas). El pelo de la frente y de las sienes se queda como estaba.
- **Jersey:** en los rizos de abajo (y ≥ 650) se quitan solo los píxeles rosas de la manga de la referencia.

## 2. Huecos junto al cuello y bajo las orejas · RECONSTRUIDOS

Son zonas **reconstruidas**, no extraídas del original (verde en `zonas-revisadas.png`, máscara en
`mascara-zonas-reconstruidas.png`).

- Cada hueco se divide en trozos pequeños, unos 900 px cada uno (78 trozos, contando la franja del contorno).
- Cada trozo se rellena con un mechón **copiado de la propia melena**, del mismo lado de la cara, con traslado puro:
  sin escala, sin giro y sin deformar.
- El mechón elegido es el que mejor continúa el pelo de alrededor, evitando los brillos.
- Va **detrás** del pelo existente y lleva una sombra suave junto a la cabeza, porque es pelo que queda detrás del cuello.
- Cada trozo y su desplazamiento de origen están en `comprobaciones.json`.

## 3. Mechón del brazo

- Se elige con una zona fija y, a lo largo de su eje, la anchura se reduce de forma suave desde un tercio de su
  longitud hasta acabar en punta: ya no termina en un corte recto.
- Solo baja la opacidad.
- Sigue siendo un mechón suelto delante de la camiseta. Si se quiere unir a los rizos, habrá que dibujarlo.

## Pendiente (trabajar a mano) · `zonas-pendientes.png`

- **Interior de los rizos sobre los dos brazos.** En la referencia esos rizos caían sobre la manga larga rosa.
  - Al quitar la manga, los huecos de los rizos dejan ver el brazo y conservan un filo rojizo.
  - Copiar mechones no basta: hay que redibujar el interior de esos rizos.
- Para la versión de producción siguen haciendo falta dos capas de pelo dibujadas sobre las guías de esta base, a
  la resolución final, siguiendo `plantilla/PELO.md` adaptado a D-014.

**Probado:** comprobaciones automáticas (`comprobaciones.json`) y revisión visual en el ordenador. No se ha probado en
el juego ni en un iPhone, porque nada se ha activado.
