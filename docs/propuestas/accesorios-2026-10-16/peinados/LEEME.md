# Adornos para la coleta y las dos coletas · 18/10/2026 (D-024 (11), aprobados visualmente (12))

Las piezas aprobadas, **solo con escala, posición y giro** (`colocar()` de `../capas/colocar.py`), sin deformar la cabeza
ni el pelo. Cada adorno es una capa independiente de 948 × 1659 (`capas/<adorno>-<peinado>.png`), encima del pelo (y de la
cinta o los coleteros) y, con el sombrero, debajo de él. Con la melena siguen las capas aprobadas; el lazo con la coleta
es el aprobado de `../lazo-coleta/`.

- Recortes: flores, mariposa y lazo, los aprobados (`../capas/*-recortado.png`); diadema y corona, la capa aprobada
  recortada a su caja, con los mismos píxeles (`recortes/`).
- Script: `colocar_peinados.py` (montajes de los peinados en `base_peinados.py`, solo lectura).

| Adorno | Coleta con cinta | Coleta sin cinta | Dos coletas con sombrero | Dos coletas sin sombrero |
|---|---|---|---|---|
| Pasador de flores | sobre el moño, por encima de la cinta (425, 100), 140 px, 10° | lado de la frente (300, 262), 150 px, 30° | coleta izquierda, bajo el coletero (230, 600), 140 px, −20° | lado (274, 278), 168 px, 32° (como la melena) |
| Mariposa lila | sobre el moño (405, 110), 95 px, 10° | lado (300, 300), 115 px, 14° | coleta izquierda (240, 600), 110 px, −10° | lado (288, 295), 122 px, 14° (como la melena) |
| Diadema | **no compatible:** iría justo donde está la cinta | (474, 200), su tamaño | **no compatible:** el sombrero la tapa | (474, 212), su tamaño (como la melena) |
| Corona | encima de la cinta, ×0,9 (469, 80) | (469, 110), su tamaño | **no compatible:** el sombrero la tapa (86 %) | (469, 135), ×0,96 |
| Dos lazos pequeños | — (solo para las dos coletas) | — | uno en cada coletero (240, 545) y (716, 545), 75 px, ±15° | igual |

Comprobado (`comprobaciones.json`): **0 px sobre la piel que se ve y sobre las cejas** en todas; sobre el pelo (o la cinta
o los coleteros que lo sujetan) entre el 67 % y el 100 % (la corona y los adornos de lo alto sobresalen por encima del
pelo, como la corona con la melena); nada tapado por el sombrero. Ninguna pieza ha necesitado otra perspectiva. Fuentes
sin cambios. Hoja de revisión: `comparacion-adornos-peinados.png`.

En el visor, al elegir un adorno se conserva el peinado; lo que no es compatible no se pone y se avisa; si al cambiar de
peinado, de cinta o de sombrero deja de serlo, se quita avisando. **Aprobados visualmente (18/10)**; no probadas una a una
todas las combinaciones en el iPhone; integración en una copia nueva del juego, más adelante. Los gorros,
más adelante. La copia `prueba-juego-d026` no cambia.
