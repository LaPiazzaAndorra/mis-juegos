# Colores de pelo: castaño chocolate, rubio miel, castaño oscuro y pelirrojo jengibre · 16/10/2026 (D-022)

> **D-022:** la propietaria aprueba los **tonos** de esta lámina (la comparación anterior queda descartada). Son
> variantes de **nuestras** capas de pelo aprobadas, delante y detrás, en las que **solo cambia el color**. Por ahora
> solo están en el visor, para revisarlas; nada activado en el juego. **El castaño original sigue siendo la opción
> predeterminada.**

| Archivo | Qué es |
| --- | --- |
| `referencia-tonos-pelo-aprobados.png` | Lámina generada con los cuatro tonos, conservada **sin modificar** (SHA-256 `649580bd…60e9`). Solo se **mide** su tono; no se toma ningún píxel. |
| `colores_pelo.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-colores/colores_pelo.py`). |
| `pelo-detras-{chocolate,miel,oscuro,jengibre}.png` | Variantes de la capa de detrás (`pelo-variante-sin-mechon-detras.png`). |
| `pelo-delante-{chocolate,miel,oscuro,jengibre}.png` | Variantes de la capa de delante («mechones completos»). |
| `comparacion-pelo-entera.png`, `comparacion-pelo-cabeza.png` | Los cinco colores sobre el conjunto aprobado. |
| `zonas-medidas-en-la-lamina.png` | En verde, las zonas de la lámina donde se ha medido el tono (solo pelo, sin el fondo). |
| `comprobaciones.json` | Cifras. |

Todas a 948 × 1659, en el mismo lienzo y la misma posición que las originales (que no cambian).

## Cómo se ha hecho

1. **Tono aprobado:** se mide en la lámina, en cada recuadro, en zonas que son solo pelo (los lados, debajo de las
   orejas, y lo alto de la cabeza), quitando el fondo: unos 73 000–78 000 píxeles por tono.
2. **Una sola transformación por tono, igual para delante y detrás** (calculada con las dos capas juntas), para que
   casen entre sí.
3. **Luminosidad:** se reparte como en la lámina (igualación de percentiles). Es una función creciente: lo que era más
   oscuro sigue más oscuro y lo más claro, más claro, así se conservan los rizos, las sombras y los brillos.
4. **Tono y saturación:** en cada nivel de luminosidad, los de la lámina; se conserva la variación de cada píxel (vetas
   y reflejos).
5. **El canal alfa no cambia:** ni la forma, ni la posición, ni la transparencia, ni el encaje.

## Comprobaciones (`comprobaciones.json`)

| Tono | Luminosidad (percentiles 5–25–50–75–95) lámina → variante | Tono (°) lámina → variante | Saturación lámina → variante | Detalle conservado (detrás / delante) |
| --- | --- | --- | --- | --- |
| Castaño (original) | — / 18–44–73–108–176 | — / 50,0 | — / 37,6 | — |
| Castaño chocolate | 11–35–64–101–179 → 10–35–64–100–180 | 51,7 → 51,6 | 28,8 → 29,1 | 0,991 / 0,995 |
| Rubio miel | 56–98–135–173–222 → 54–99–135–172–221 | 59,2 → 59,4 | 47,4 → 47,9 | 0,943 / 0,953 |
| Castaño oscuro | 5–19–44–78–164 → 5–20–45–77–164 | 49,4 → 48,8 | 21,2 → 21,3 | 0,982 / 0,979 |
| Pelirrojo jengibre | 38–74–106–143–205 → 38–74–107–142–204 | 49,1 → 49,1 | 58,7 → 57,4 | 0,976 / 0,982 |

- «Detalle conservado»: correlación del detalle fino de la luminosidad (rizos, sombras y brillos) entre el original y la
  variante; 1 sería idéntico.
- Alfa idéntico y píxeles transparentes iguales en las 8 capas. Fuentes sin cambios (SHA-256).
- En el visor: a tamaño real coincide con el montaje de cada color en lo opaco (diferencia ≤ 3).

## A revisar

- Las **cejas** son de la base y siguen castañas con todos los colores (con el rubio miel se nota más). No se han
  cambiado; si se quiere, se decidirá aparte.
- La revisión de las variantes en el visor; después, una copia nueva de prueba del juego (las pruebas congeladas no se
  tocan); la resolución 2000 × 3500.
