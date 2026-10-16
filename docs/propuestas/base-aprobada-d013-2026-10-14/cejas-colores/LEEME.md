# Cejas que acompañan cada color de pelo · 16/10/2026 (D-022)

> **Aprobadas visualmente por la propietaria (16/10)** para los cuatro tonos. En el visor, fila «Cejas»: **«A juego con
> el pelo (elegidas)» por defecto** · «Originales de la base (castañas)». Con el castaño original se ven siempre las de
> la base. Nada activado en el juego; las pruebas congeladas no cambian.

Cambia **solo el color** de las cejas de nuestra base (`../sin-ojos/base-sin-ojos-propuesta-v3.png`, que **no se
modifica**). La forma, los pelitos, el borde suave y la expresión son los de la base. Cada propuesta es una **capa
aparte**, encima de la base (y debajo de los ojos y del pelo de delante), que solo tiene píxeles en las cejas.

| Archivo | Qué es |
| --- | --- |
| `cejas_colores.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/cejas-colores/cejas_colores.py`). |
| `cejas-{chocolate,miel,oscuro,jengibre}.png` | Las capas (948 × 1659). El castaño original no lleva capa. |
| `comparacion-cejas.png` | Arriba, cada color de pelo con las cejas de la base; abajo, con la propuesta. |
| `comprobaciones.json` | Cifras. |

## Cómo se ha hecho

1. **Cejas:** los dos trazos más oscuros que la piel encima de los ojos (2 984 px). No se tocan los pliegues de los
   párpados ni las capas de ojos (solape 0 px).
2. **Cobertura:** para cada píxel, cuánto tiene de ceja y cuánto de piel. Se separa el color de la ceja, se cambia y se
   vuelve a mezclar con la **misma** cobertura: así se conservan la forma, los pelitos y el borde suave.
3. **Color nuevo:**
   - **castaño chocolate y castaño oscuro:** la misma transformación que su pelo;
   - **rubio miel:** la del pelo, pero **algo más oscura que el pelo** (luminosidad × 0,70 y saturación × 0,80);
   - **pelirrojo jengibre:** **castaño cobrizo suave** (la del pelo, con luminosidad × 0,80, saturación × 0,62 y el
     tono 4° hacia el marrón).
4. La capa guarda solo la diferencia, con la transparencia mínima que da exactamente ese color encima de la base.

## Comprobaciones (`comprobaciones.json`)

| Pelo | Ceja (centro): luminosidad · tono · saturación | Pelo: luminosidad media |
| --- | --- | --- |
| Castaño (base, sin capa) | 107 · 51° · 50 | 73 |
| Castaño chocolate | 99 · 53° · 43 | 64 |
| Rubio miel | 122 · 59° · 49 (**más oscura que el pelo**) | 135 |
| Castaño oscuro | 82 · 52° · 36 | 45 |
| Pelirrojo jengibre | 115 · 47° · 49 (cobrizo, **menos saturada que el pelo**, 57) | 107 |

- Fuera de las cejas, la cara queda **exactamente igual** (diferencia 0); en las cejas, el resultado es el calculado
  (error 0).
- Detalle de las cejas conservado: correlación 0,999–1,000.
- Las cejas de la base siempre son más claras que el pelo (también en el castaño original); la propuesta mantiene esa
  relación salvo en el rubio, donde, como se pidió, quedan algo más oscuras que el pelo.
- Fuentes sin cambios (SHA-256). En el visor, a tamaño real coincide con el montaje en lo opaco (≤ 3).

**16/10/2026 · D-023:** `cejas_colores.py` separa sus pasos en funciones (`preparar`, `color_cejas`, `capa_sobre`) para que
`../piel-tonos/piel_tonos.py` recalcule las cejas sobre cada tono de piel. Las capas de esta carpeta salen idénticas.
