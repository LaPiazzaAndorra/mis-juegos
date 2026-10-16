# Accesorios de pelo, segunda colección · 16/10/2026 (D-024)

> **D-024:** la propietaria **aprueba el diseño** de los ocho accesorios: lazo, pasador de flores, mariposa lila, diadema
> de estrellas, cinta deportiva, gorra, sombrero de aventura y gorrito de dormir. **El encaje está pendiente.** Nada
> activado en el juego; las pruebas congeladas, `main` y las partidas no cambian.
>
> **16/10/2026 (2):** el **lazo, el pasador de flores y la mariposa están aprobados visualmente tal como están colocados**.
> En el visor, «Sin accesorio» sigue por defecto. Pendientes: diadema, cinta y gorros (versión de frente).

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

## Pendiente

- La versión de frente de la diadema, la cinta y los gorros (ChatGPT, con la guía) y su encaje.
- Después: copia nueva de prueba del juego; 2000 × 3500.
