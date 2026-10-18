# Accesorios de pelo, segunda colección · 16/10/2026 (D-024)

> **D-024:** la propietaria **aprueba el diseño** de los ocho accesorios: lazo, pasador de flores, mariposa lila, diadema
> de estrellas, cinta deportiva, gorra, sombrero de aventura y gorrito de dormir. **El encaje está pendiente.** Nada
> activado en el juego; las pruebas congeladas, `main` y las partidas no cambian.
>
> **16/10/2026 (2):** el **lazo, el pasador de flores y la mariposa están aprobados visualmente tal como están colocados**.
> En el visor, «Sin accesorio» sigue por defecto. Pendientes: diadema, cinta y gorros (versión de frente).
>
> **16/10/2026 (3):** **diadema de frente aprobada** (diseño); capa extraída en `diadema/` y en el visor como candidata,
> **encaje pendiente de revisión** (ver `diadema/LEEME.md`). Pendientes: cinta y gorros.
>
> **16/10/2026 (4):** **encaje de la diadema aprobado visualmente.** Pendientes: cinta, gorra, sombrero y gorrito.
>
> **17/10/2026 (5):** **diseño frontal del gorrito de dormir aprobado**; gorro y pompón en `gorrito/` y en el visor como
> candidato. **Encaje pendiente:** asoma una franja fina de pelo arriba a la izquierda (ver `gorrito/LEEME.md`).
>
> **17/10/2026 (6):** **gorrito B**, un 8 % más grande: cubre el pelo de arriba con las cejas libres; los dos candidatos
> en el visor; encaje pendiente.
>
> **17/10/2026 (7):** **encaje del gorrito B aprobado visualmente** (opción elegida; el A, alternativa anterior); bien con
> los 5 colores de pelo y los 4 tonos de piel sobre la melena; con la coleta necesita otra adaptación.
>
> **17/10/2026 (8):** **diseño frontal de la gorra aprobado**; gorra extraída en `gorra/` y en el visor como candidata
> (×1,10, centrada; cubre el pelo de arriba, cejas libres). **Encaje pendiente** (ver `gorra/LEEME.md`).
>
> **17/10/2026 (9):** **encaje de la gorra aprobado visualmente**; bordes revisados con los 5 colores de pelo y los 4
> tonos de piel, sin defectos.
>
> **18/10/2026 (10):** **lazo en la base de la coleta** (`lazo-coleta/`), candidato: el mismo lazo aprobado, solo
> escalado, colocado y girado; con y sin cinta. Encaje pendiente de revisión.
>
> **18/10/2026 (11):** **lazo con la coleta aprobado visualmente** (con y sin cinta). Flores, mariposa, diadema, corona y
> dos lazos pequeños para la coleta y las dos coletas: candidatos en `peinados/` (ver `peinados/LEEME.md`).

## Referencias (`referencias/`, sin modificar)

| Archivo | Qué es |
| --- | --- |
| `lamina-lazo-flores-mariposa-diadema-aprobada.png` | Lámina generada: lazo de satén, pasador de flores, mariposa lila y diadema de estrellas (SHA-256 `faec8d02…75b9`). |
| `lamina-cintas-y-gorros-aprobada.png` | Lámina generada: cinta deportiva, gorra deportiva, sombrero de aventura y gorrito de dormir (SHA-256 `e38ee2d6…6d25`). |

## Primera prueba: lazo, flores y mariposa (`capas/`)

Cada uno es una **capa transparente independiente** (948 × 1659, el lienzo de la muñeca), **encima del pelo** y **debajo
de la corona**, sobre los **rizos originales** (el peinado y la cabeza no cambian).

| Archivo | Qué es |
| --- | --- |
| `extraer.py` | Saca de la lámina solo el objeto, sin fondo, marco, texto ni sombra. |
| `lazo-recortado.png`, `flores-recortado.png`, `mariposa-recortado.png` | Los objetos recortados, a su tamaño de la lámina. |
| `colocar.py` | Los escala y gira (sin deformar) y los coloca en los rizos. |
| `capa-lazo.png`, `capa-flores.png`, `capa-mariposa.png` | Las capas para el visor. |
| `comparacion-accesorios.png` | La cabeza con cada uno, con y sin corona. |
| `comprobaciones.json` | Cifras. |

**Cómo se ha extraído:** el objeto tiene un contorno nítido y la sombra se difumina sin bordes: se toman los bordes
fuertes, se cierran y se rellena lo que encierran (también el pétalo crema y los brillos). Un único hueco de fondo
encerrado (en la mariposa, entre la antena izquierda y el ala) se quita por su posición, porque su crema con sombra es
casi igual al pétalo crema. Borde suave de 1 px, quitando el crema del fondo (sin halo).

**Encaje (aprobado visualmente el 16/10):**

| Accesorio | Dónde | Tamaño | Giro |
| --- | --- | --- | --- |
| Lazo de satén | Rizos del lado derecho de la imagen, encima de la sien (centro 642, 263) | 138 px de ancho | −18° |
| Pasador de flores | Rizos del lado izquierdo, siguiendo el nacimiento del pelo (centro 274, 278) | 168 px | +32° |
| Mariposa lila | Rizos del lado izquierdo (centro 288, 295) | 122 px | +14° |

Comprobado (`comprobaciones.json`): **0 px** sobre la piel que se ve (cara y orejas), **0 px** sobre la corona (se pueden
llevar a la vez) y **100 %** sobre el pelo (la mariposa, 99,9 %). Fuentes sin cambios.

En el visor: fila «Accesorio de pelo» (**Sin accesorio** por defecto · Lazo de satén · Pasador de flores · Mariposa lila).
Se lleva uno cada vez y se puede quitar; la corona sigue en su fila.

## Diadema, cinta y gorros: perspectiva (`guia-chatgpt/`)

Están dibujados **en perspectiva de tres cuartos** (de lado y algo desde arriba: se ve el interior de la diadema y de la
cinta, la visera de lado, el ala inclinada); la muñeca está **de frente**. **No encajan** sin redibujarlos: girarlos o
deformarlos aquí cambiaría el diseño. Se ha preparado una guía para pedirlos **de frente** en ChatGPT, sin deformar la
cabeza ni el peinado: `guia-chatgpt/LEEME.md`, con la plantilla de la cabeza (`plantilla-cabeza-frontal.png`) y las
medidas (`plantilla-medidas.png`).

## Lazo en la base de la coleta (`lazo-coleta/`, 18/10, candidato)

Con la coleta (D-025), el lazo no puede ir donde va con la melena (allí no hay rizos sueltos). `lazo_coleta.py` usa el
**mismo recorte aprobado** (`capas/lazo-recortado.png`) con `colocar()` de `capas/colocar.py`: solo escala, posición y
giro, sin retocar el dibujo.

| Pieza | Dónde | Ancho | Giro |
|---|---|---|---|
| Lazo con la coleta (`capa-lazo-coleta.png`) | Base de la coleta, donde se recoge el pelo (centro 612, 86) | 138 px (como con la melena) | −32° |

Comprobado (`comprobaciones.json`): **una sola colocación vale con cinta y sin cinta** (0 px sobre la cinta), **0 px**
sobre la piel que se ve y **100 %** sobre el pelo de la coleta en las dos versiones; capas de la coleta, cinta y recorte
sin cambios. `comparacion-lazo-coleta.png`: con y sin cinta, sin y con lazo, y con colores de pelo y tonos de piel.

En el visor, con la coleta, «Lazo de satén» pone esta capa y **se conserva la coleta**; con la melena, el lazo sigue en
su sitio aprobado. Los accesorios que todavía no son compatibles con un peinado **no se ponen y se avisa**. La copia
`prueba-juego-d026` no cambia. **Encaje aprobado visualmente (18/10).**

## Pendiente

- La versión de frente de la cinta y los gorros (ChatGPT, con la guía) y su encaje.
- Revisión de los adornos con la coleta y las dos coletas (`peinados/`); después, los gorros con esos peinados.
- Después: copia nueva de prueba del juego; 2000 × 3500.
