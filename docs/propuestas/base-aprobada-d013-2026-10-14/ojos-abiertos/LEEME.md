# Ojos abiertos y pestañas · máscara PROPUESTA (versión 2) · 15/10/2026

Delimitación de los ojos abiertos con la línea del párpado y las pestañas sobre la copia técnica
`../base-transparencia-corregida.png` (948 × 1659). **Sigue siendo una propuesta:** no se ha extraído
ninguna capa ni se ha tocado la base; el iris, los blancos, los brillos, la forma, el tamaño y la
posición de los ojos no cambian. Pendiente de la aprobación visual de la propietaria.

| Archivo | Qué es |
| --- | --- |
| `mascara.py` | Programa reproducible de la v2 (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-abiertos/mascara.py`). |
| `mascara-ojos-propuesta-v2.png` | **Máscara actual** en grises, 948 × 1659 (255 = dentro, 0 = fuera, intermedios = bordes suaves). |
| `vista-v2-ampliada.png` | Cada ojo ×4: base, contorno, capa sobre fondo claro, sobre fondo oscuro, sobre la base, y la v1 sobre oscuro para comparar. |
| `vista-v2-tamano-juego.png` | Muñeca a ~480 px («Vestir» en iPhone) y ~220 px («Mi Mundo»): base, ojos sobre claro, sobre oscuro y sobre la base. |
| `vista-v2-sobre-base.png` | La máscara (magenta) y su contorno (verde) sobre la base entera. |
| `comprobaciones-v2.json` | Cifras de la v2 (abajo). |
| `*-v1.png` | Versión 1, conservada (su programa está en el commit `73ca84d`). |

## Cambios de la v2 (pedidos por la propietaria)

- **Pliegue del párpado: fuera** (se mantiene la decisión). Ahora también el tramo central del arco,
  distinguido de las pestañas por la dirección del trazo (el pliegue va paralelo al contorno del ojo).
- **Piel entre las pestañas de arriba: fuera.** La opacidad de las pestañas se calcula por lo oscuras
  que son respecto a la piel o la sombra que tienen alrededor: los trazos finos se conservan y la piel
  entre ellos queda a 0.
- **Corte recto junto al lagrimal: suavizado** con una rampa de 3 px junto a lo quitado; la línea del
  párpado y la masa negra del párpado son siempre opacas, así que no se recortan.
- **Píxeles oscuros del lagrimal derecho:** eran parte del dibujo (el trazo fino del párpado pegado al
  blanco, L 37–47) que la v1 cogía a trozos: **se conservan** y ahora la línea entera va en la capa.
  Residuos de la selección eliminados: 3 + 2 píxeles casi invisibles. Quedan 3 grupos de 1–2 píxeles
  (opacidad 1–4 %) que son prolongación de puntas de pestañas: se conservan.

## Cifras (comprobaciones-v2.json)

- 13 038 píxeles (11 948 opacos, 1 090 de borde suave); v1: 14 928.
- Abertura del ojo (iris, blancos y brillos): 8 672 píxeles, opaca al 100 % en la v1 y en la v2
  (comprobado: no cambia).
- Respecto a la v1: 2 003 píxeles quitados (piel entre pestañas, pliegue, residuos) y 113 añadidos
  (trazo del párpado del lagrimal y bordes).
- La capa colocada sobre la base reproduce la base exactamente (diferencia máxima 0): mismos
  píxeles y misma posición.

## Bordes mezclados con piel: qué se arregla con la máscara y qué no

**Con la máscara (hecho en la v2):** qué píxeles entran (sin piel entre pestañas, sin pliegue, sin
residuos), cuánta opacidad tiene cada uno (puntas finas semitransparentes) y la suavidad de los cortes.

**Solo cambiando colores (NO hecho; necesita aprobación):** 1 077 píxeles de borde (puntas de las
pestañas y contorno del párpado) tienen ya, en la ilustración, el color mezclado con la piel. Sobre la
piel de la base, en su sitio, no se nota; pero sobre otro fondo (o sobre **otro tono de piel**, si la
muñeca tiene variantes de piel) se ve un halo claro de piel alrededor de las pestañas. Quitarlo
exigiría «descontaminar» el color de esos píxeles (calcular el color propio de la pestaña restando la
piel según su opacidad), es decir, **modificar sus colores RGB**.
