# Peinado nuevo: coleta alta rizada con cinta deportiva lila · 16/10/2026 (D-025)

> **D-025:** la propietaria **aprueba la propuesta como peinado nuevo**. La **melena suelta se conserva** como otra opción
> (y sigue por defecto). **El encaje es candidato**, pendiente de aprobación. Nada activado en el juego; las pruebas
> congeladas, `main` y las partidas no cambian.
>
> **16/10/2026 (2): encaje de la coleta con cinta aprobado visualmente.** La melena suelta sigue por defecto.
>
> **16/10/2026 (6): coleta sin cinta aprobada visualmente**; se conservan las dos opciones. La coleta, con y sin cinta,
> en los **5 colores de pelo** y los **4 tonos de piel**, en el visor (ver «Colores de pelo y tonos de piel»):
> **aprobación pendiente**.

| Archivo | Qué es |
| --- | --- |
| `referencias/referencia-coleta-cinta-aprobada.png` | Imagen generada aprobada, **sin modificar** (SHA-256 `8ac66fe3…4a6b`). Solo se toman el pelo y la cinta. |
| `coleta.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/peinado-coleta-2026-10-16/coleta.py`). |
| `capas/pelo-coleta-detras.png` | Pelo de detrás (coleta y rizos de los lados): va detrás de nuestra base. |
| `capas/pelo-coleta-delante.png` | Pelo de delante (lo que cae sobre la cabeza: nacimiento del pelo, sienes): encima de la base. |
| `capas/cinta-coleta.png` | La cinta con su estrella, encima del pelo. |
| `capas/comparacion-coleta.png` | Melena (aprobada), coleta con cinta (candidata) y lo que queda si se quita la cinta. |
| `capas/regiones-de-la-imagen.png` | Cómo se ha separado la imagen (fondo, pelo, piel, cinta, vestido). |
| `capas/comprobaciones.json` | Cifras. |
| `guia-chatgpt/` | Guía para completar en ChatGPT el pelo que falta bajo la cinta. |
| `referencias/referencia-coleta-sin-cinta.png` | Propuesta de pelo sin la cinta (generada en ChatGPT con la guía), **sin modificar** (SHA-256 `3f8dff3a…8dd1`). |
| `revisar_uniones.py` | Revisión de las uniones (desde la raíz: `python3 docs/propuestas/peinado-coleta-2026-10-16/revisar_uniones.py`). |
| `uniones/uniones-marcadas.png`, `uniones/uniones.json` | Las uniones marcadas (verde bien · magenta falla · lila restos) y sus cifras. |
| `sin_cinta.py`, `capas/candidata-sin-cinta/` | Pelo sin cinta (**aprobado**; la carpeta conserva su nombre). |
| `coleta_variantes.py` | Colores de pelo y tonos de piel (desde la raíz: `python3 docs/propuestas/peinado-coleta-2026-10-16/coleta_variantes.py`). |
| `capas/variantes/pelo-coleta-{con,sin}-{detras,delante}-{color}.png` | Pelo de la coleta **sin las orejas**, con y sin cinta, en los 5 colores (el castaño es el aprobado sin las orejas). |
| `capas/variantes/orejas-coleta-{detras,delante}.png` | Las orejas de la coleta (piel clara), cada una debajo de su pelo. |
| `capas/pieles/{dorado,moreno,profundo}/orejas-coleta-*.png`, `bordes-coleta-{con,sin}-{color}.png` | Orejas de cada tono y capa pequeña de bordes (encima del pelo de delante, debajo de la cinta). |
| `revision-variantes/` | Las 40 combinaciones (ojos abiertos y cerrados) y el detalle a tamaño real del nacimiento del pelo, las orejas y el cuello (antes · después · fondo oscuro). |
| `comprobaciones-variantes.json` | Cifras. |

## Cómo se ha hecho

1. **Separar la imagen:** semillas claras de cada región (fondo crema; pelo oscuro; piel lisa de la cara y las orejas;
   lila de la cinta; rosa del vestido) y reparto del resto por contraste. Los ojos, las cejas, la nariz y la boca de la
   imagen (encerrados por la piel) y la sombra del cuello no son pelo. La estrella es parte de la cinta.
2. **Solo pelo y cinta:** no se toman la cara, el cuerpo ni el vestido de la imagen. Borde suave de 1 px, sin el color
   del fondo ni de la piel de la imagen (sin halo).
3. **Encaje:** con la escala y la posición de los ojos (centros de los iris: imagen (560, 666) y (798, 669); nuestra
   muñeca (391, 444) y (565, 444); escala 0,731), sin deformar.
4. **Delante / detrás:** lo que cae sobre nuestra cabeza va delante; el resto, detrás de la base.

## Comprobaciones (`capas/comprobaciones.json`)

- El pelo y la cinta cubren nuestra cabeza: donde la coleta deja la frente despejada se ve la piel de nuestra base como
  frente (13 739 px); no queda fondo de la imagen sobre nuestra cabeza salvo los blancos de los ojos de la imagen (que
  no se usan).
- No tapan nuestros ojos (24 px de pelo en el borde de las pestañas, sin efecto visible). La cara, el cuerpo y el
  vestido son los nuestros.
- Fuentes sin cambios. En el visor, sin errores; a tamaño real coincide con el montaje (≤ 3).

## La cinta, para ponerla y quitarla

**Bajo la cinta no hay pelo en la imagen** (37 960 px): si se quita, queda un hueco (ver `capas/comparacion-coleta.png`).
No se inventa aquí: la guía `guia-chatgpt/LEEME.md` explica cómo pedir **el mismo peinado sin la cinta** y cómo se
añadirá solo el pelo de esa zona. Hasta entonces, en el visor la coleta va **siempre con la cinta**.

## Revisión de las uniones del pelo sin cinta (16/10)

- **Alineación:** la imagen sin cinta coincide con la aprobada (mismo tamaño; desplazamiento < 0,3 px; la cara y el fondo
  son iguales). Bajo la cinta tiene pelo completo (99 %).
- **Prueba:** solo el pelo de la zona de la cinta, con un margen mínimo de 3 px de transición, sobre la imagen aprobada
  (no se sustituye la cara ni el peinado completo).
- **Resultado: las uniones fallan** (los mechones no continúan; diferencia media local > 30):

  | Unión | Falla | Diferencia mediana |
  | --- | --- | --- |
  | Arriba (hacia la coleta) | 32 % (tramos sueltos) | 22 |
  | Abajo (sobre la frente) | **98 %** (una línea seguida) | 61 |
  | Puntas de la cinta | 52 % | 30 |
  | Restos lila del borde de la cinta | 14 px | — |

- **Por qué:** junto a la cinta, la imagen nueva dibuja los mechones de otra forma (en la aprobada están la sombra de la
  cinta y los mechones que se meten por debajo). Sobre la frente, las dos imágenes vuelven a coincidir **a partir de
  15–20 px por debajo de la cinta** (diferencia mediana 14 → 9 → 6).
- **No se integra** ni se añade al visor la opción de quitar la cinta. Para seguir haría falta **ampliar la zona** (sobre
  todo por abajo, unos 15–20 px de la imagen ≈ 11–15 px en nuestra muñeca, y algo en las puntas y en los tramos de
  arriba): **pendiente de la decisión de la propietaria**.

## Candidata con la zona ampliada (16/10, `capas/candidata-sin-cinta/`, `sin_cinta.py`)

- **Zona:** la cinta (con su borde suave lila) y una franja permitida de hasta **20 px por abajo** y **8 px arriba y en
  las puntas**. Dentro de la franja, la unión se busca donde las dos imágenes se parecen y por los huecos oscuros entre
  mechones (watershed), con 2 px de transición. Se incluyen también, dentro de la franja, la sombra de la cinta y los
  huequecitos de fondo que dejaba junto al pelo; los huecos diminutos entre rizos se rellenan con el pelo de alrededor.
- **No se toca:** la piel, la frente ni la cara (0 px), ni la silueta exterior del peinado (0 px); el pelo aprobado fuera
  de la zona queda igual. Las capas aprobadas con cinta no cambian (con la cinta puesta se usan ellas, así se ve igual).
- **Resultado:**

  | Unión | Falla | Ampliación usada |
  | --- | --- | --- |
  | Abajo (sobre la frente) | **0,5 %: limpia** | hasta 20 px |
  | Arriba (hacia la coleta) | **22 %** | hasta 8 px (el máximo) |
  | Puntas | **19 %** | hasta 8 px (el máximo) |

  Restos lila: 0 px. Sombra de la cinta que queda junto a la zona: 499 px, **arriba y en las puntas**.
- **Dónde falla** (`uniones-candidata.png`, en azul y magenta; `union-de-arriba-ampliada.png`, sin marcas): a lo largo del
  borde de arriba de la cinta queda una franja algo más oscura (la sombra de la cinta en la imagen aprobada) justo fuera
  de los 8 px; y en las dos puntas, cortes cortos donde los mechones no siguen.
- **16/10 (2): ampliación arriba y en las puntas.** Probado 14, 18, 22, 26, 32, 40 y 50 px (`sin_cinta.py <px>`):

  | Arriba / puntas | Arriba | Puntas | Abajo | Sombra de la cinta |
  | --- | --- | --- | --- | --- |
  | 14 px | 13 % | 1,3 % | 0 % | 255 px |
  | 26 px | 9 % | 1,1 % | 0 % | 84 px |
  | **32 px (elegido)** | **3,7 %** | **1 %** | **0 %** | **14 px** |
  | 40–50 px | 6–8 % | 1 % | 0 % | 5 px |

  Con **32 px** la unión de arriba pasa por límites naturales entre rizos (en la base del moño) y la sombra de la cinta
  desaparece; ampliar más no mejora. **Piel, cara y silueta sin tocar (0 px)**, sin restos lila, y el pelo aprobado fuera
  de la zona igual. Revisado a tamaño de juego y ampliado, en fondo claro y oscuro
  (`revision-tamano-juego-y-ampliada.png`).
- **En el visor:** con la coleta aparece la fila «Cinta» (**Con cinta (aprobada)** por defecto · **Sin cinta
  (aprobada)**, aprobada visualmente el 16/10).

## Colores de pelo y tonos de piel (16/10, `coleta_variantes.py`)

- **Orejas:** las orejas que se ven con la coleta son las de la imagen aprobada y estaban **dentro** de las capas de pelo:
  con otro color de pelo se teñían como pelo y con otra piel se quedaban claras. Se separan del pelo (semillas de piel y
  de mechones, reparto por contraste; la línea oscura del contorno va con el pelo) y pasan a **una capa propia debajo de
  su pelo**, con el alfa que hace que el montaje sea el mismo: con piel clara y pelo castaño, **idéntico al aprobado**
  (diferencia máxima 1 de 255, sobre fondo claro, oscuro y verde). Son las mismas con y sin cinta.
- **Color de pelo:** la transformación aprobada de cada color de la melena (D-022), aplicada solo al pelo. Alfa igual.
- **Tono de piel:** las orejas, con la transformación aprobada de la piel (D-023). Ajuste: la oreja de la imagen tiene
  sombras y una línea dibujada más oscuras que nuestra piel y la transformación (que suma las diferencias de luminosidad)
  las volvía casi negras en la piel profunda; en las orejas la luminosidad es la **media** entre la aprobada y la que
  conserva el contraste relativo. Así la oreja queda, respecto a la cara, como en la piel clara (unos 25 niveles más
  oscura en los cuatro tonos). Además, una **capa pequeña de bordes** por tono, versión y color: en el borde del pelo
  junto a la piel que se ve (nacimiento del pelo, sienes, junto a las orejas, cuello), una franja de **5 px como
  máximo** (el borde de la coleta es estrecho; con 12 px, como en la melena, se emborronaban las puntas de los
  mechones): la parte de piel clara pegada pasa a la piel nueva y la de pelo al pelo de alrededor; y la franja del cuero
  cabelludo en el borde de la cabeza se cubre con el pelo de detrás. No toca el pelo más allá (0 px).
- **Cejas, ojos, base y manos:** las aprobadas de cada tono (con las cejas a juego del color de pelo).
- **Revisado** (`revision-variantes/`): las 40 combinaciones con los ojos abiertos y cerrados, y el detalle a tamaño real
  (antes · después · fondo oscuro) del nacimiento del pelo y las sienes, las dos orejas y el cuello, para los 5 colores
  en cada tono. Sin halos claros en el nacimiento del pelo ni parches en las orejas; las cejas a juego; el parpadeo,
  bien con cada piel. Queda, solo muy ampliado, la línea fina del contorno de la oreja (como en la piel clara).

## En el visor


Fila «Peinado»: **Melena suelta (aprobada)** por defecto · **Coleta rizada (aprobada)**; con la coleta, fila «Cinta»
(**Con cinta (aprobada)** por defecto · **Sin cinta (aprobada)**). Con la coleta se pueden elegir la **piel**, el
**color de pelo**, las **cejas** y los **ojos**; el accesorio de pelo y la corona (colocados para la melena) y los
otros pelos de delante vuelven a la melena. El parpadeo funciona igual.

## Pendiente

- Aprobación visual de los colores de pelo y los tonos de piel con la coleta.
- Después: accesorios y corona con la coleta; copia de prueba del juego; 2000 × 3500.
