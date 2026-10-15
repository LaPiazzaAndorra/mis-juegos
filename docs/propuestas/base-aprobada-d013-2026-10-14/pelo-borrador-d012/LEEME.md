# Pelo castaño de D-012 sobre la base D-014 · BORRADOR de montaje · 15/10/2026

**No hay todavía capas de pelo que encajen con esta base.** Este montaje es un **borrador de revisión**: recorta
el pelo de la referencia elegida en D-012 (`../../muneca-elegida-2026-10-14/referencia-aprobada.png`, sin
modificar) y lo coloca sobre la base para ver el conjunto con ojos abiertos, cerrados y parpadeo. **No es una
capa de producción ni se activa.**

Piezas usadas: base sin ojos v3, ojos abiertos v3 color experimental (candidata), ojos cerrados V2.1
reutilizados (candidata preferida, sin retocar).

| Archivo | Qué es |
| --- | --- |
| `montaje_pelo.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/montaje_pelo.py`). |
| `mascara-pelo-en-referencia.png` | Qué píxeles de la referencia se han tomado como pelo. |
| `pelo-borrador-detras.png`, `pelo-borrador-delante.png` | El pelo colocado (948 × 1659): todo detrás de la base y la parte que va delante. |
| `montaje-abiertos.png`, `montaje-cerrados.png` | Conjunto montado. |
| `vista-montaje-pelo.png` | Referencia, abiertos y cerrados a ~480 y ~220 px; caras ×1,5. |
| `vista-pelo-solo-oscuro.png` | El pelo solo, sobre fondo oscuro (se ven sus huecos y restos). |
| `parpadeo-pelo-tamano-juego.gif`, `parpadeo-pelo-cara.gif` | Parpadeo con pelo (cambio instantáneo de capa). |
| `comprobaciones.json` | Cifras. |

## Cómo se ha colocado

- **Escala uniforme 1,0934** (misma en horizontal y vertical) y traslado: la distancia entre ojos de la referencia
  (160 px) pasa a la de la base (175 px) y el punto medio entre ojos coincide. **Sin giro, sin estirar la melena
  y sin deformar la cara**: la cara, las orejas, los ojos y las cejas de la base no se tocan (comprobado: donde no
  hay pelo delante, la base queda idéntica).
- El pelo va **detrás** de la base y **delante** solo donde cae sobre ella (coronilla, frente y laterales), salvo
  en la zona de los ojos y 30 px alrededor (rampa de 12 px), para no traer las pestañas de la referencia.

## Lo que todavía no encaja (por eso es borrador)

1. **Huecos claros** junto al cuello y debajo de las orejas: en la referencia ahí había jersey y cuello, no pelo,
   y la base nueva es más estrecha; nada los rellena.
2. La capa de pelo **trae restos** de la referencia (orejas, contorno de la cara, cuello): quedan ocultos detrás
   de la base en este montaje, pero impiden usarla como capa suelta (`vista-pelo-solo-oscuro.png`).
3. **Ampliación del 9,3 %:** el pelo es de la imagen de 948 × 1659 algo ampliada; no es detalle nativo.
4. **Separación delante/detrás aproximada:** no está pensada para la ropa ni para el movimiento de la cabeza.
5. Algún mechón cae por delante del brazo con un corte poco natural.

Para la versión de producción hacen falta dos capas de pelo dibujadas (detrás y delante) sobre las guías de esta
base, a la resolución final, siguiendo `plantilla/PELO.md` adaptado a D-014.
