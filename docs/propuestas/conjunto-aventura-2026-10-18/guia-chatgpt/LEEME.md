# Guías para completar en ChatGPT el conjunto de aventura (D-027) · 18/10/2026

La imagen aprobada del conjunto **no tiene** todo lo que hace falta para ponerlo sobre nuestra muñeca. **Aquí no se
inventa ni se deforma** la muñeca ni la ropa: se pide en ChatGPT, **una guía cada vez**, y luego se toma solo lo de cada
pieza. Las zonas que fallan están en `../donde-falla-ampliado.png`.

| Guía | Qué se pide | Carpeta |
|---|---|---|
| Rodillas (opción A, elegida por la propietaria) | completar **solo la piel** que las mallas rosas dejan al descubierto bajo el pantalón, en una **copia** de nuestra base | `../piernas/` |
| 1 · Camiseta y chaleco | los mismos, **adaptados al espacio entre nuestros brazos**, con los **hombros completos** y **sin las tiras** de la mochila | `1-camiseta-y-chaleco/` |
| 2 · Mochila | la mochila **completa**: el **cuerpo de detrás** y las **tiras de delante**, por separado | `2-mochila/` |

Orden recomendado: rodillas y 1 (independientes), después 2 (las tiras se ajustan sobre la camiseta y el chaleco nuevos).

En todas: **mismo diseño, bolsillos, botones, costuras y texturas** que la imagen aprobada; nuestra muñeca (cuerpo,
brazos, proporciones, cara) **no cambia**; fondo crema liso, sin texto ni marcos.

Medidas del torso entre nuestros brazos (de nuestra base): `medidas-torso.json`. Guías preparadas con
`preparar_guias.py` (solo lee). `plantilla-nuestra-muneca.png`: nuestra muñeca sin pelo.

## Otras zonas (ya señaladas)

- El lateral de la mochila tapado en la imagen por el brazo y el pelo: se resuelve con la guía 2.
- 87 px sueltos de la camiseta rosa de la base junto al bolsillo izquierdo del pantalón y entre las piernas: se revisarán
  con la camiseta y el chaleco nuevos (guía 1).
- Huecos pequeños junto a las piernas (461 px): con las rodillas completadas.

## Cómo se revisará cada resultado

Con `../integrar/recibir.py` (ver `../integrar/LEEME.md`):

1. Que coincida con nuestro lienzo (se mide la alineación con los ojos y el cuerpo).
2. Se toma **solo** la pieza o la zona pedida, sin nada de cara, pelo ni sombrero de la imagen, y se revisan las uniones.
3. Las capas candidatas actuales se conservan para comparar.
