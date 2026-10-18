# Conjunto de aventura · 18/10/2026 (D-027)

> **D-027:** la propietaria **aprueba el diseño** del conjunto de aventura: camiseta con hoja, chaleco arena, pantalón verde,
> calcetines, botas y mochila (imagen generada, `referencias/referencia-conjunto-aventura-aprobada.png`, sin modificar,
> SHA-256 `f3e5d5c3…f4fe0`). Piezas sobre nuestra base original, sin cara, piel, cuerpo, pelo ni sombrero de la imagen.
> **Encaje candidato en el visor, pendiente de revisión.** Nada activado en el juego; `main`, las partidas y las pruebas
> congeladas no cambian.

## Cómo se ha hecho (`conjunto_aventura.py`)

1. **Regiones de la imagen** (`capas/regiones-de-la-imagen.png`): semillas de cada pieza por color y zona y reparto del
   resto por contraste (watershed). La piel, el pelo y el sombrero (con los coleteros) se quedan fuera.
2. **Encaje:** la imagen está en el mismo lienzo que nuestra base (948 × 1659) y el cuerpo coincide (ojos a 2–6 px, piernas
   y pies en su sitio): se coloca **sin escalar ni deformar**.
3. **Capas** (`capas/`), de abajo arriba: `mochila.png` (cuerpo, detrás de la base) · base · `calcetines.png` ·
   `botas.png` · `camiseta.png` · `pantalon.png` · `tiras.png` (de la mochila, independientes) · `chaleco.png` · nuestros
   brazos · pelo de delante. Borde suave de 1 px sin el color de al lado.
4. **La mochila se puede quitar:** cuerpo (detrás) y tiras (delante) son capas separadas.
5. **Pelo de delante de la melena:** la capa aprobada lleva **9 trocitos sueltos** (1 318 px, restos del bordado del vestido)
   sobre el pecho, que con el vestido no se ven; con este conjunto, sí. Copia corregida sin ellos:
   `capas/pelo-delante-melena-sin-restos.png` (el original no cambia).

## Comprobaciones (`comprobaciones.json`, `donde-falla-ampliado.png`)

- Camiseta y mallas rosas de la base: **tapadas en el torso** (quedan 87 px sueltos de 151 444); **a la vista en las
  rodillas: 16 696 px** (el pantalón es más corto que las mallas).
- **El chaleco es más ancho que nuestro torso** (los brazos de la imagen están más separados): sus bordes y bolsillos
  quedan debajo de nuestros antebrazos (4 594 px) y encima de los brazos (2 865 px).
- **Sin la mochila**, falta lo que tapan las tiras en los hombros (8 858 px): se ve la camiseta rosa de la base.
- Parte del lateral de la mochila está tapada en la imagen por el brazo y el pelo (con la melena casi no se nota).
- Fuentes sin cambios (sha256).

Qué pedir en ChatGPT para completarlo: `guia-chatgpt/LEEME.md`.

## En el visor

Fila «Ropa»: **Conjunto de aventura (candidato)**; fila «Mochila»: Con mochila (candidata) · Sin mochila. Por ahora con
piel clara, pelo castaño y melena (al elegirlo se pasa a esa combinación avisando; con él puesto, lo demás no se cambia
sin avisar). Las botas sustituyen a los zapatos.

## Pendiente

- Revisión del encaje por la propietaria y decidir las rodillas (piernas sin mallas o pantalón más largo).
- Completar en ChatGPT: chaleco a nuestra medida, hombros sin la mochila y mochila entera.
- Después: colores de pelo, tonos de piel y peinados; copia de prueba del juego; 2000 × 3500.
