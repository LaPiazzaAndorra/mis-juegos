# Mechones completos de los hombros tomados de ChatGPT · 15/10/2026

> **ELEGIDO (D-016, aprobación visual):** junto con el vestido opción B + axilas. La resolución 2000 × 3500 sigue
> pendiente; no se activa en el juego.

Esta alternativa no sustituye a la propuesta C (`../pelo-delante-mechones-c.png`), que se conserva intacta. No se
activa ni se publica.

**Fuente:** `../para-chatgpt-mechones/resultado-chatgpt-mechones-1.png` (imagen de ChatGPT, sin modificar).

| Archivo | Qué es |
| --- | --- |
| `mechones_completos.py` | Programa reproducible (desde la raíz). |
| `pelo-delante-mechones-completos.png` | Capa de delante de la alternativa. |
| `zona-tomada-de-chatgpt.png` | Dónde se ha tomado pelo de ChatGPT. |
| `antes-despues.png`, `antes-despues-hombros.png` | C frente a la alternativa; hombros ×2 con la costura (verde). |
| `montaje-mechones-completos*.png` | Montajes con ojos abiertos y cerrados. |
| `comprobaciones.json` | Cifras. |

## Método

1. **Zona de cada hombro:** la tela del hombro y de la manga, más una franja de hasta 45 px de pelo alrededor. No entra
   la cara, ni el pelo de la cabeza (y < 575), ni nada fuera de la silueta de la melena.
2. **Unión con C:** la costura se busca por cuencas, con un coste = diferencia de color entre ChatGPT y C +
   luminosidad. Así pasa por **sombras oscuras entre rizos** donde las dos imágenes coinciden (luminosidad media 30,
   diferencia media 5). Además hay 3 px de fundido de color a lo largo de la costura.
3. **Solo pelo:** de ChatGPT solo se toman píxeles de pelo; sobre la tela, donde ChatGPT no tiene pelo, se ve nuestro
   vestido. No se incorpora piel ni tela generada (0 px).

## Resultado

- Se toman 44 887 px de pelo de ChatGPT. El pelo tapa ahora 8 084 px más de manga. Solo 142 px de pelo de C pasan a
  ser vestido.
- Comprobado:
  - fuera de la zona, la capa es **idéntica a C**;
  - **la silueta exterior de la melena es igual**;
  - 0 px de pelo nuevo sobre la cara, las orejas o el cuello;
  - la capa de detrás, el vestido, la base y los ojos no cambian.
- A revisar:
  - las mangas quedan bastante tapadas por fuera, como en la imagen de ChatGPT;
  - quedan 1 o 2 puntitos claros entre el pelo y la manga, visibles solo ampliando.

En el visor: **Pelo → Mechones completos (alternativa)**.

**Probado:** comprobaciones automáticas y revisión visual en el ordenador; el visor, en Chromium con pantalla de iPhone
simulada (sin errores ni almacenamiento; coincide con el montaje en lo opaco). Sin probar en el iPhone/iPad reales.
