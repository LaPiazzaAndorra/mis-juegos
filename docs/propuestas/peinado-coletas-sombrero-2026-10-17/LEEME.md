# Peinado nuevo: dos coletas rizadas bajas con coleteros verdes y sombrero de aventura · 17/10/2026 (D-026)

> **18/10/2026: las dos coletas completas (con y sin sombrero) están aprobadas visualmente**; sus variantes con los 5 colores
> de pelo y los 4 tonos de piel, **aprobadas visualmente (18/10)** (sin probar una a una en el iPhone); en la copia aislada
> `../prueba-juego-d026/`. Ver «Colores de pelo y tonos de piel».
>
> **D-026:** la propietaria **aprueba la propuesta como peinado nuevo**. Se conservan los peinados anteriores (melena
> suelta, por defecto, y coleta). **El encaje es candidato**, pendiente de revisión. Nada activado en el juego; las
> pruebas congeladas, `main` y las partidas no cambian.

| Archivo | Qué es |
| --- | --- |
| `referencias/referencia-coletas-sombrero-aprobada.png` | Imagen generada aprobada, **sin modificar** (SHA-256 `6f720c3f…6d69cb`). Solo se toman el pelo, los coleteros y el sombrero. |
| `coletas_sombrero.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/peinado-coletas-sombrero-2026-10-17/coletas_sombrero.py`). |
| `capas/pelo-coletas-detras.png` | Pelo de detrás (las dos coletas y los lados): detrás de nuestra base. |
| `capas/pelo-coletas-delante.png` | Pelo de delante (sienes, bajo el ala): encima de la base. |
| `capas/coleteros.png` | Los dos coleteros verdes, encima del pelo. |
| `capas/sombrero-aventura.png` | El sombrero (con su cinta verde, el parche de la hoja y el interior del ala), encima de todo. |
| `capas/comparacion-coletas-sombrero.png` | Melena (aprobada) · dos coletas con sombrero (candidato) · sin el sombrero, lo que falta marcado. |
| `capas/regiones-de-la-imagen.png` | Cómo se ha separado la imagen (fondo, pelo, piel, sombrero, coleteros, vestido). |
| `capas/mascara-pelo-oculto-bajo-el-sombrero.png` | Zona de pelo que esconde el sombrero (blanco). |
| `capas/comprobaciones.json` | Cifras. |
| `guia-chatgpt/` | Guía y plantilla para completar en ChatGPT el pelo que falta. |
| `referencias/referencia-coletas-sin-sombrero-puntas.png` | Propuesta de ChatGPT sin sombrero y con las coletas enteras, **sin modificar** (SHA-256 `011469e7…49ef90`). Solo se toma pelo. |
| `completar_pelo.py` | Pelo bajo el sombrero y puntas (desde la raíz: `python3 docs/propuestas/peinado-coletas-sombrero-2026-10-17/completar_pelo.py`). |
| `capas/completado/pelo-coletas-{con,sin}-sombrero-{detras,delante}.png` | **Candidatas:** pelo con las puntas completas, con sombrero y sin sombrero. |
| `coletas2_variantes.py` | Colores de pelo y tonos de piel (desde la raíz: `python3 docs/propuestas/peinado-coletas-sombrero-2026-10-17/coletas2_variantes.py`). |
| `capas/variantes/pelo-coletas-{con,sin}-sombrero-{detras,delante}-{color}.png` | Pelo de las dos coletas completas en los 5 colores (sin los restos de oreja; ver abajo). |
| `capas/pieles/{dorado,moreno,profundo}/bordes-coletas-{con,sin}-{color}.png` | Capa pequeña de bordes por tono (encima del pelo de delante, debajo de coleteros y sombrero). |
| `revision-variantes/`, `comprobaciones-variantes.json` | Las 40 combinaciones (ojos abiertos y cerrados), detalle a tamaño real de bordes por tono (antes · después · fondo oscuro) y cifras. |
| `capas/completado/antes-despues.png`, `uniones.png`, `comprobaciones.json` | Antes/después, zona nueva en amarillo con las uniones (verde bien · magenta falla) y cifras. |

## Cómo se ha hecho

1. **Separar la imagen:** semillas de fondo, pelo, piel (cara y orejas), sombrero (tela beige, cinta y parche verdes; el
   interior del ala también), coleteros (verde, a la altura de las coletas) y vestido, y reparto del resto por contraste.
   - Ojos, nariz y boca de la imagen (encerrados por la piel) y sus **cejas** no son pelo: se usan los de nuestra base. En
     la imagen las cejas se juntan con el pelo de las sienes; se separan como el pelo que, en su columna, tiene piel justo
     encima y justo debajo. Las colas que se juntan con el pelo se quedan con el pelo: así tapan el borde de nuestra base
     en las sienes.
   - Trocitos sueltos del color del sombrero en la cara (brillos de los ojos) son piel; los que asoman entre los mechones
     (el interior del ala) siguen siendo del sombrero. Motitas de pelo sueltas (< 300 px) se quitan.
2. **Solo pelo, coleteros y sombrero:** no se toman la cara, las orejas, la piel, el cuerpo ni el vestido de la imagen.
   Borde suave de 1 px sin el color de alrededor.
3. **Encaje:** con la escala y la posición de los ojos (iris: imagen (578, 628) y (831, 627); nuestra muñeca (391, 444) y
   (565, 444); escala 0,688), sin deformar.
4. **Delante / detrás:** lo que cae sobre nuestra cabeza va delante (sin tocar nuestros ojos); el resto, detrás.

## Comprobaciones (`capas/comprobaciones.json`)

- **Cejas libres:** el ala queda a 11 px de nuestras cejas (no las toca). **Ojos libres** (0 px), abiertos y cerrados.
- **Cabeza cubierta** por el sombrero y el pelo de delante: 98,8 %; lo demás es frente bajo el ala.
- Nada de la piel ni de las orejas de la imagen (0 px): las orejas son las de nuestra base. Fuentes sin cambios.
- **Defectos a la vista, señalados:**
  - **Las coletas quedan cortadas** en línea recta a la altura de y = 783: la imagen termina ahí (sus puntas no están).
  - Entre las coletas y el cuello se ve el fondo (13 410 px): en la imagen ahí estaba su cuello, más ancho que el nuestro.
    Parece aire entre el pelo y el cuello; se deja así salvo que se pida otra cosa.
  - Muy ampliado, en las sienes quedan restos de la cola de las cejas de la imagen pegados al pelo (a tamaño de juego no
    se notan).

## El sombrero, para quitarlo más adelante

Bajo el sombrero la imagen **no tiene pelo** (91 453 px de nuestro lienzo: lo alto de la cabeza, la frente, las sienes y
debajo del ala por los lados). Marcado en magenta en `capas/comparacion-coletas-sombrero.png` y en
`guia-chatgpt/plantilla-pelo-que-falta.png`. **No se inventa aquí:** `guia-chatgpt/LEEME.md` explica cómo pedir el mismo
peinado sin el sombrero (y con las coletas enteras). Hasta entonces, las dos coletas van **siempre con el sombrero**.

## Pelo bajo el sombrero y puntas completas (17/10, `completar_pelo.py`, candidatas)

La propuesta de ChatGPT (sin sombrero, con las coletas enteras) tiene **otro encuadre** (otra escala y posición).
- **Alineación medida antes de integrar:** se pasa a nuestro lienzo con la escala de los ojos (iris (506, 483) y (715, 482);
  escala 0,833, frente a 0,688 de la aprobada). Comparada con la aprobada en nuestro lienzo: **la cara coincide** (0,3 px);
  **los coleteros están unos 4,5 px más arriba** en la nueva (las coletas arrancan algo más alto).
- **Solo pelo, solo donde hace falta:**
  - **puntas:** por debajo de donde la aprobada corta las coletas (y = 783), y una franja de hasta 60 px por encima para
    buscar la unión; los rizos de la nueva que salen de la silueta justo encima del corte y siguen hasta las puntas se toman
    enteros (si no, quedaban cortados en recto);
  - **sin sombrero:** todo el pelo por encima de los coleteros (lo que tapaba el sombrero y el pelo de debajo del ala, que
    en la nueva sigue al de arriba), con la unión justo debajo de los coleteros, que la tapan.
  - La unión se busca (watershed) donde las dos imágenes se parecen y por los huecos oscuros entre rizos; 2 px de
    transición. **Fuera de la zona, el pelo aprobado no cambia** (comprobado píxel a píxel).
- **Se conservan nuestra cara, orejas, cuerpo, vestido, coleteros y sombrero:** el pelo nuevo no va encima de nuestra base
  salvo donde ya la tapaban el sombrero o el pelo aprobado (se quitaron 7 543 px de pelo nuevo que caían sobre nuestra cara
  y nuestras orejas).
- **Uniones:** las puntas, **18,6 % de la costura con diferencia alta** (114 de 613 px) y la de debajo de los coleteros sin
  sombrero, 10,7 % (16 de 150 px). Es por el desfase de 4,5 px de las coletas entre las dos imágenes. **Revisado a la vista,
  ampliado:** los rizos continúan sin cortes ni escalones (`antes-despues.png`; `uniones.png` marca dónde). Si se ve algún
  salto en el iPhone, lo siguiente sería subir la unión de las puntas (más franja) antes de cambiar otra cosa.
- Las puntas completas están en las dos candidatas, con sombrero y sin sombrero. El montaje anterior se conserva.

## Colores de pelo y tonos de piel (18/10, `coletas2_variantes.py`)

- **Color de pelo:** la transformación aprobada de cada color de la melena (D-022), aplicada solo al pelo (alfa igual en
  los 5 colores). **Coleteros verdes y sombrero, sin cambios.** Cejas a juego del color de pelo.
- **Tono de piel:** las piezas aprobadas de cada tono (base, ojos abiertos y cerrados, manos, cejas a juego) y una capa
  pequeña de bordes por tono, versión y color: en el borde del pelo junto a la piel que se ve (frente, sienes, junto a las
  orejas, cuello), la parte de piel clara pegada pasa a la piel nueva y la de pelo al pelo de alrededor (5 px como máximo;
  0 px de pelo tocado más allá); la franja del cuero cabelludo se cubre con el pelo de detrás.
- **Defectos encontrados al revisar con piel oscura, corregidos en las variantes:**
  - encima de nuestra oreja derecha (y un poco de la izquierda) la capa de pelo aprobada tenía **restos del interior de la
    oreja de la imagen generada** (salían claros con piel profunda y teñidos con otros colores de pelo). En el diseño las
    orejas van delante del pelo: se quita el pelo encima de nuestras orejas (sin su borde suave) y se ve nuestra oreja;
  - **sin sombrero**, faltaba pelo de detrás justo detrás del borde suave de nuestras orejas (se veía el fondo: una línea
    clara con pieles oscuras): se rellena con el pelo de detrás de al lado (solo se ve a través de ese borde).
  Por eso, con piel clara y castaño, las variantes difieren de las capas aprobadas **solo en las orejas** (ahora son
  exactamente las nuestras). Las capas aprobadas no cambian.
- **Revisado** (`revision-variantes/`): las 40 combinaciones con los ojos abiertos y cerrados, y el detalle a tamaño real
  de frente y sienes, orejas con coleteros y cuello para los 5 colores en cada tono, en fondo claro y oscuro: sin halos en
  el nacimiento del pelo ni parches en las orejas; parpadeo bien con cada piel.

## En el visor

Fila «Peinado»: **Melena suelta (aprobada)** por defecto · **Coleta rizada (aprobada)** · **Dos coletas con sombrero
(candidato)**. Por ahora, las dos coletas solo van con **piel clara y pelo castaño**, sin accesorio de pelo ni corona
(el sombrero ocupa la cabeza); elegir otra piel, otro color, un accesorio, la corona u otro pelo de delante vuelve a la
melena. El parpadeo funciona igual. Sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo
opaco). Con las dos coletas aparece la fila «Dos coletas»: **Con sombrero (aprobada)**, seleccionada al elegir el peinado ·
**Sin sombrero (aprobada)** · **Montaje anterior, puntas cortadas (referencia)** (solo piel clara y castaño; otra piel u
otro color pasan a la versión con sombrero). Las dos completas siguen a la piel, al color de pelo, a las cejas y a los
ojos.

## Pendiente

- Revisión del encaje por la propietaria.
- La prueba en el iPhone (copia `../prueba-juego-d026/`).
- Colores de pelo y tonos de piel; copia de prueba del juego; 2000 × 3500.
