# Conjunto de aventura con los tonos de piel y colores de pelo aprobados · 21/10/2026 (D-027, candidatas)

El conjunto aprobado (prendas ajustadas de `f857193`, rodillas B2c), la mochila A y sus tiras aprobadas **no cambian**.
Para los tonos dorado, moreno y profundo (D-023) se añaden capas propias, hechas con la misma transformación aprobada de
`../../../base-aprobada-d013-2026-10-14/piel-tonos/piel_tonos.py` (`conjunto_pieles.py`, reproducible):

| Archivo (por tono) | Qué es |
| --- | --- |
| `base-piernas-sin-mallas.png` | La base del tono aprobada y, solo en las rodillas (27 736 px, donde B2c difiere de la base), la base B2c con la misma transformación. Fuera de las rodillas, idéntica a la aprobada. |
| `bordes-ropa.png`, `bordes-tiras.png` | Los bordes de la ropa y de las tiras junto a la piel llevaban piel clara pegada (filos de las mangas, bajo del pantalón, puño de los calcetines, borde del chaleco, cuello de la camiseta; en las tiras, algunos píxeles de piel junto al cuello). Solo la parte de piel de cada píxel pasa a la piel nueva; el contorno de las prendas no cambia. Van encima de la ropa (y de las tiras). ≈ 2 950 y ≈ 310 px. |
| `bordes-pelo-<color>.png`, `bordes-coleta-<con\|sin>-<color>.png`, `bordes-coletas-<con\|sin>-<color>.png` | Las capas de bordes aprobadas de cada peinado y tono (hechas con el vestido), sin lo que ahora cae sobre la ropa del conjunto ni donde el pelo limpiado para el conjunto ya no está o se ha rellenado. |

Pelo para el conjunto (en los cuatro tonos): `../../../base-aprobada-d013-2026-10-14/pelo-sin-restos/conjunto/`
(sin el rosa del vestido en el canto de los rizos de la melena y sin las rendijas de fondo entre los rizos y el brazo;
ver su `LEEME.md`).

**Revisado** (capturas del visor de las 60 combinaciones: 4 tonos × 5 colores × melena, coleta y dos coletas, con la
mochila A y las tiras): rodillas, brazos y bordes de las mangas, chaleco, cuello, calcetines y pelo, con un detector de
restos del tono claro (píxeles junto a la piel que no cambian con el tono y se parecen a la piel clara) y a la vista.
Lo que marca el detector y no se ha tocado: brillos del pelo rubio miel y pelirrojo parecidos a la piel clara (son su
color aprobado), el borde de la cinta y de las orejas de la coleta (de su trabajo aprobado) y sombras naturales del
brazo.

Hojas: `tonos-peinados.png` (4 tonos × 3 peinados), `colores-melena.png`, `colores-coleta.png`, `colores-coletas2.png`
(4 tonos × 5 colores) y `detalles-antes-despues.png` (claro, profundo antes y después: rodillas, mangas y brazos, chaleco,
cuello, calcetines y pelo junto al brazo). En el visor, con el conjunto se pueden elegir los cuatro tonos y los cinco
colores; con un tono que no es el claro, solo la versión aprobada del conjunto (prendas ajustadas, rodillas B2c, mochila A
o B). **Candidatas, pendientes de revisión; sin probar en el iPhone real.**

Uso (desde la raíz): `python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/pieles/conjunto_pieles.py`
(después de `base-aprobada-d013-2026-10-14/pelo-sin-restos/limpiar_conjunto.py`).
