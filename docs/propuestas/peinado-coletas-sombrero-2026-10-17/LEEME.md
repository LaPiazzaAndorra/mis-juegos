# Peinado nuevo: dos coletas rizadas bajas con coleteros verdes y sombrero de aventura · 17/10/2026 (D-026)

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

## En el visor

Fila «Peinado»: **Melena suelta (aprobada)** por defecto · **Coleta rizada (aprobada)** · **Dos coletas con sombrero
(candidato)**. Por ahora, las dos coletas solo van con **piel clara y pelo castaño**, sin accesorio de pelo ni corona
(el sombrero ocupa la cabeza); elegir otra piel, otro color, un accesorio, la corona u otro pelo de delante vuelve a la
melena. El parpadeo funciona igual. Sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo
opaco).

## Pendiente

- Revisión del encaje por la propietaria.
- Pelo bajo el sombrero y puntas de las coletas (ChatGPT, con la guía); después, quitar el sombrero.
- Colores de pelo y tonos de piel; copia de prueba del juego; 2000 × 3500.
