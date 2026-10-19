# Guía · piel donde aún asoma el rosa bajo el pantalón (D-027) · 19/10/2026

Con las rodillas **B** (aprobadas), quedan **111 px de rosa** a la vista bajo el pantalón de aventura, en cuatro trocitos de
2–5 px (con un umbral algo más amplio que el de antes, que contaba 104): el pantalón corto rosa de la primera imagen de
ChatGPT acaba un poco más abajo que nuestro pantalón en el borde exterior de la pierna izquierda y en el interior de la
derecha, y entre las piernas asoma el rosa de nuestra base por la abertura del pantalón.

**Máscara mínima** (`../../mascara-rosa.png`, `../../mascara_rosa.py`): esos píxeles más 2 px alrededor, **solo donde el
pantalón no los tapa**: **248 px** en cuatro trozos (centros aproximados (488, 1107), (505, 1167), (359, 1168) y
(460, 1169)). Nada del pantalón, de la base aprobada ni del resto de la copia entra en ella.

## Qué adjuntar en ChatGPT

1. `con-pantalon-a-completar.png`: la muñeca con las rodillas B, los calcetines, las botas y el pantalón verde puestos.
2. `zona-rosa-marcada.png`: la misma con los trocitos en magenta.
3. `zonas-rosa-ampliadas.png`: cada trocito ampliado ×4 (a la izquierda, como está; a la derecha, marcado).

## Mensaje (copiar)

> Te adjunto una muñeca ilustrada con un pantalón corto verde (imagen 1), la misma con unas zonas pequeñas marcadas en
> magenta (imagen 2) y esas zonas ampliadas (imagen 3). Bajo el pantalón verde asoma un poco de rosa (son unas mallas que
> no deben verse). Necesito **la imagen 1 exactamente igual**, con el mismo encuadre, tamaño y estilo, cambiando **solo las
> zonas magenta**: pon ahí **la piel de los muslos** de la muñeca, con el mismo tono, luz y suavidad que la piel de sus
> rodillas, como si el rosa no existiera; entre las piernas, la piel (o la sombra) que se vería por la abertura del
> pantalón. No cambies nada más: ni el pantalón, ni las piernas, ni los calcetines, ni las botas; fondo crema liso, sin
> texto ni marcos.

## Cómo se integrará

`python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/recibir.py piernas <imagen> \
  docs/propuestas/conjunto-aventura-2026-10-18/piernas/mascara-rosa.png piernas-b2 0 \
  docs/propuestas/conjunto-aventura-2026-10-18/integrar/piernas-b/base-piernas-sin-mallas.png \
  docs/propuestas/conjunto-aventura-2026-10-18/piernas/para-chatgpt/rosa/con-pantalon-a-completar.png`

Se alinea por la silueta con la imagen enviada, se toma **solo** la máscara sobre la copia B (con el tono igualado con
nuestra piel) y se comprueba que no quede rosa a la vista y que fuera de la máscara nada cambie. Probado con la propia
imagen enviada (alineación exacta). La base aprobada, el pantalón y la copia B no cambian hasta que se apruebe.
