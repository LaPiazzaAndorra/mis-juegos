# Pelo B en hombros y pecho: redistribución delante/detrás · PROPUESTA · 15/10/2026

Es una propuesta: no se activa ni se publica. El pelo B (`../pelo-variante-sin-mechon-*.png`) se conserva sin cambios.

**Problema que ve la propietaria:** sobre el vestido, el pelo de delante parece pegado encima.
- **Causa:** la capa de delante se recortó siguiendo la silueta de la base (la camiseta). Las mangas abullonadas del
  vestido sobresalen de esa silueta, así que los rizos acababan en un corte diagonal y su continuación quedaba detrás.
- **Además:** junto al escote había delante unos trozos de sombra oscura cuyo borde superior es un corte de la imagen
  original (allí estaban el cuello y el jersey de la referencia).

**Método:** solo **redistribuye** el pelo existente entre delante y detrás. No dibuja, no rellena huecos entre rizos y
no mueve, escala ni recolorea ningún píxel.

| Archivo | Qué es |
| --- | --- |
| `redistribuir_pelo.py` | Programa reproducible (desde la raíz). |
| `pelo-delante-redistribuido.png` | **Propuesta A**: capa de delante. |
| `pelo-delante-redistribuido-b.png` | **Propuesta B**: capa de delante. **Recomendada.** |
| `comparacion-antes-despues.png` | Antes, A y B, con el vestido y con la camiseta. |
| `ampliacion-hombros-antes-despues.png` | Cada hombro ×2: antes, A y B. |
| `mapa-redistribucion.png` | A: qué pasa delante (verde), límites de los rizos (amarillo) y dónde falta pelo (rojo). |
| `falta-pelo-ilustrar.png`, `mascara-falta-pelo.png` | A: dónde faltaría pelo por ilustrar. |
| `montaje-vestido-pelo-redistribuido*.png` | Montajes con el vestido (opción B + axilas). |
| `comprobaciones.json` | Cifras. |

## Propuesta A

1. En hombros, pecho y brazos (y 560–1060), el pelo completo (detrás + delante) se divide en **rizos** por sus sombras
   naturales: 119 rizos.
2. Un rizo que ya estaba delante al menos en un 5 % de su parte sobre el cuerpo pasa **entero** delante: 53 rizos,
   36 769 px. El borde sigue el contorno del rizo, no la silueta de la camiseta.
3. Nada pasa detrás.
4. El pelo reconstruido de detrás del cuello sigue detrás, y no se pone pelo delante sobre la cara, las orejas o el
   cuello.

**Resultado:** los rizos del pecho caen con continuidad por delante de las mangas. **Pero** junto al escote siguen las
sombras oscuras con borde cortado; ahí **faltaría pelo por ilustrar** (2 157 px en rojo en `falta-pelo-ilustrar.png`).

## Propuesta B (recomendada)

A, y además los 6 rizos de sombra oscura junto al escote (sobre el vestido) pasan **detrás enteros**, por sus límites
de sombra. También pasan detrás 188 px de restos sueltos de esa zona; en total, 4 604 px del pelo de delante actual.
El rizo de debajo sale ahora por detrás de la manga.

**No hace falta ilustrar nada.**

## Comprobado

- Fuentes sin cambios (SHA-256); capa de detrás sin cambios.
- Los colores del pelo que pasa delante son idénticos a los del pelo existente.
- 0 px de pelo de delante sobre la cara, las orejas o el cuello que se ven.
- La cara, la forma y el volumen de la melena se mantienen: es el mismo pelo, solo cambia el orden de las capas.

## A revisar

- En B, los hombros dejan ver más manga abullonada que antes; es el pelo que ahora va por detrás.
- Con la **camiseta** de la base (sin vestido), B deja un pequeño escalón en el hombro izquierdo. Si se aprueba, la
  capa de delante podría depender de la ropa (una para la camiseta y otra para el vestido).
- Quedan 1 o 2 mechoncitos sueltos pequeños sobre la manga y el cuerpo, visibles solo ampliando.

En el visor: **Pelo → Hombros · propuesta A / B** (con cualquier ropa).

**Probado:** comprobaciones automáticas y revisión visual en el ordenador; el visor, en Chromium con pantalla de iPhone
simulada (sin errores ni almacenamiento; coincide con el montaje en lo opaco). Sin probar en el iPhone/iPad reales.

## Propuesta C · mechones continuos por delante de cada hombro (15/10)

La propietaria no aprueba B, porque aún deja una muesca alrededor de cada manga, y pide uno o dos mechones continuos
por delante de cada hombro.

Programa: `mechones_hombros.py`. Escribe `pelo-delante-mechones-c.png`, montajes abiertos y cerrados,
`comparacion-mechones.png` (antes, B y C), `ampliacion-mechones.png` (cada hombro ×2), `mapa-mechones.png`,
`falta-pelo-mechones.png`, `mascara-falta-pelo-mechones.png`, `para-chatgpt-mechones/` y
`comprobaciones-mechones.json`.

- Parte de B, sin cambios, y pasa delante **enteros** los rizos del pelo existente que forman una cadena continua sobre
  cada hombro. Van de la melena de arriba a los rizos del pecho: 8 rizos por lado, elegidos a mano sobre la imagen; los
  puntos están en el programa.
- El borde sigue los límites de sombra de los rizos, no el contorno de la ropa. No se dibuja, mueve, escala ni
  recolorea nada; la capa de detrás, la cara y el vestido no cambian.
- Pasan delante 16 316 px. La manga queda tapada en parte: la izquierda pasa del 43 % al 62 % y la derecha, del 29 % al
  44 %.
- **Falta pelo original:** en lo alto de cada manga, el mechón pasaría por zonas de pelo **reconstruido** al rehacer
  el cuello (copias de textura, no pelo original), que no se ponen delante. Ahí el borde del mechón sigue siendo
  irregular.
  - Se marca para ilustrarlo con ChatGPT: 916 px, en rojo en `falta-pelo-mechones.png`.
  - `para-chatgpt-mechones/` tiene el montaje recortado 2:3 (1024 × 1536), la máscara y una guía.
  - Texto sugerido: «Completa solo la zona azul con el mismo pelo castaño rizado que cae por delante del hombro,
    continuando la curva del mechón de arriba abajo. No cambies nada más: ni la cara, ni el vestido, ni el resto del
    pelo, ni el encuadre.»

En el visor: **Pelo → Hombros · C (mechones)**.

### Relleno 1 de ChatGPT para los mechones (15/10) · **no encaja todavía**

- La imagen se conserva sin modificar en `para-chatgpt-mechones/resultado-chatgpt-mechones-1.png` (1024 × 1536).
- `para-chatgpt-mechones/integrar_mechones.py` integra **solo** las dos zonas de la máscara en una copia de C:
  `pelo-delante-mechones-c-chatgpt-1.png`. Fuera de la máscara, la copia es idéntica a C.
- Revisión: `revision-mechones-chatgpt-1.png` y `.json`.
- **Alineación:** correcta, sin desplazamiento (correlación global 0,876; la mejor también en (0, 0) en cada zona).
- **Uniones: no siguen el rizo.** ChatGPT ha **redibujado todo el pelo de los hombros** con otra disposición. En el
  borde de cada zona, la diferencia de color con C es muy grande (98 y 91 de media). Al tomar solo la máscara quedan
  dos parches sueltos:
  - izquierda: una mancha oscura de borde duro;
  - derecha: una franja clara con costura.
- **La máscara se queda corta:** el mechón de ChatGPT tapa la parte alta y exterior de cada manga, mucho más allá de
  la máscara (2 585 px más). Las cinco zonas están marcadas en naranja en la revisión y en
  `mascara-mechones-chatgpt-1-fuera-de-la-mascara.png`. **No se ha ampliado** la máscara.
- Ampliarla solo con el pelo detectado da fragmentos, porque el pelo de ChatGPT tampoco continúa los rizos de C. Para
  encajar habría que tomar de ChatGPT el mechón completo, desde la melena hasta el codo, y unirlo a C por debajo.
  Queda pendiente de decisión.

En el visor: **Pelo → C + ChatGPT 1 (prueba)**, solo para revisarlo.
