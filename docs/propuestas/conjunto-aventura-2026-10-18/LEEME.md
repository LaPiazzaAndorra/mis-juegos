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
   sobre el pecho, que con el vestido no se ven; con este conjunto, sí. Limpieza localizada y reutilizable, con copias
   limpias de los cinco colores: `base-aprobada-d013-2026-10-14/pelo-sin-restos/` (el original no cambia).

## Comprobaciones (`comprobaciones.json`, `donde-falla-ampliado.png`)

- Camiseta y mallas rosas de la base: **tapadas en el torso** (quedan 87 px sueltos de 151 444); **a la vista en las
  rodillas: 16 696 px** (el pantalón es más corto que las mallas).
- **El chaleco es más ancho que nuestro torso** (los brazos de la imagen están más separados): sus bordes y bolsillos
  quedan debajo de nuestros antebrazos (4 594 px) y encima de los brazos (2 865 px).
- **Sin la mochila**, falta lo que tapan las tiras en los hombros (8 858 px): se ve la camiseta rosa de la base.
- Parte del lateral de la mochila está tapada en la imagen por el brazo y el pelo (con la melena casi no se nota).
- Fuentes sin cambios (sha256).

Qué pedir en ChatGPT para completarlo (18/10, por separado): `guia-chatgpt/LEEME.md`:
- **rodillas, opción A** (elegida): copia de la base con la zona a completar, máscara y referencia en `piernas/`;
- **1 · camiseta y chaleco** adaptados al espacio entre nuestros brazos, hombros completos, sin tiras;
- **2 · mochila** completa: cuerpo de detrás y tiras de delante, independientes.

## En el visor

Fila «Ropa»: **Conjunto de aventura (candidato)**; fila «Mochila»: cuerpo nuevo A (centrado) · cuerpo nuevo B (como en
la imagen aprobada) · mochila anterior · Sin mochila (por defecto). Por ahora con piel clara y pelo castaño, con la melena,
la coleta o las dos coletas (desde el 20/10; al elegirlo se pasa a esa piel y ese color avisando; con él puesto, lo demás
no se cambia sin avisar). Las botas sustituyen a los zapatos.

## Pendiente

- Revisión del encaje por la propietaria (rodillas: opción A elegida, 18/10).
- Rodillas: **integradas** (18/10) desde la imagen de ChatGPT; **B aprobada** (19/10); restos rosas corregidos con piel contigua: **B2 aprobada** (19/10, `integrar/piernas-b2/`), por defecto con el conjunto.
- Camiseta y chaleco (guía 1): **integrados** (19/10) en `integrar/ropa/`, con los filos de mangas y cadera retocados en `integrar/ropa-b/` y los últimos restos en `integrar/ropa-c/` y `integrar/piernas-b2c/`: **conjunto limpio** (0 px de rosa; `integrar/conjunto-limpio.png`), candidato; sin mochila por defecto. **No aprobado (19/10):** pantalón ajustado en cintura y caderas, chaleco sin halo, calcetines al ancho de nuestras piernas y botas sin sombra en `integrar/ropa-d/` (`integrar/ajustar_pantalon_y_pies.py`; antes y después sin pelo: `integrar/ropa-d/antes-despues.png`): **conjunto sin mochila aprobado visualmente** (20/10, `f857193`).
- Mochila: **cuerpo recibido** (20/10, sin tiras; `guia-chatgpt/2-mochila/de-chatgpt/`) y colocado detrás de la muñeca en
  `integrar/mochila-b/` (`integrar/colocar_mochila.py`): candidatas A (centrada) y B (como en la imagen aprobada), con la
  melena, la coleta y las dos coletas (`integrar/mochila-b/montajes-peinados.png`). **A elegida** (20/10; B, alternativa).
  **Tiras nuevas** (guía 2b sobre A, por encima del chaleco): recibidas e integradas el 20/10 con
  `integrar/recibir.py tiras-a` → `integrar/mochila-b/tiras.png` (solo las tiras y sus hebillas), **aprobadas con la mochila A** (21/10), por defecto con el conjunto.
- Tonos de piel y colores de pelo (21/10): `integrar/pieles/` (ver su `LEEME.md`), aprobadas visualmente por la propietaria (22/10), sin dar por probadas una a una las 60 combinaciones en su iPhone; también el pelo limpio. Tiras **por encima del chaleco: confirmado** por la propietaria (20/10). Las antiguas no dan el montaje por terminado.
- Pelo para el conjunto: coleta y dos coletas sin restos (copias en `../base-aprobada-d013-2026-10-14/pelo-sin-restos/`,
  candidato).
- Después: colores de pelo, tonos de piel y peinados; copia de prueba del juego; 2000 × 3500.
