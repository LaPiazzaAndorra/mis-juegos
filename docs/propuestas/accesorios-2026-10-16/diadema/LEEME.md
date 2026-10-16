# Diadema de estrellas de frente · 16/10/2026 (D-024)

> **Diseño de frente y encaje aprobados visualmente** por la propietaria (16/10). En el visor, «Diadema de estrellas
> (aprobada)»; «Sin accesorio» sigue por defecto. La muñeca no cambia.

| Archivo | Qué es |
| --- | --- |
| `referencia-diadema-de-frente-aprobada.png` | Imagen generada en ChatGPT con la guía, **sin modificar** (SHA-256 `1a1a4aee…a786`). Solo se toma la diadema. |
| `diadema.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/accesorios-2026-10-16/diadema/diadema.py`). |
| `diadema-recortada.png` | Solo el arco, las estrellas y las perlas (sin pelo ni piel), al tamaño de la imagen. |
| `capa-diadema.png` | La capa aprobada, en el lienzo de nuestra muñeca (948 × 1659). |
| `comparacion-diadema.png` | Nuestra muñeca sin diadema, con la diadema y con diadema + corona. |
| `comprobaciones.json` | Cifras. |

## Cómo se ha hecho

1. **Arco:** el camino «más dorado» entre sus dos puntas (medidas en la imagen) y una franja fina de 5 px a su
   alrededor, con el camino siempre incluido para que no se corte.
2. **Estrellas y perlas:** solo en las dos zonas donde están (la perla de la izquierda y el grupo de estrellas, perlas y
   bolitas), lo que tiene color de la diadema junto al arco, cerrado y relleno. Los brillos blancos y dorados del pelo de
   la imagen, que pasaban por perlas o por arco, quedan fuera.
3. **Borde** suave de 1 px, quitando el color del pelo de alrededor (sin halo marrón).
4. **Encaje:** la imagen tiene otro encuadre; se pasa a nuestro lienzo **con la escala y la posición de los ojos**
   (centros de los iris: imagen (576, 653) y (832, 653); nuestra muñeca (391, 444) y (565, 444); escala 0,68), sin
   deformar.

## Comprobaciones

- **0 px** sobre la piel que se ve (cara y orejas); **100 %** sobre el pelo.
- Con la **corona**, se solapan (las dos van en lo alto de la cabeza): en el visor, al elegir la diadema se quita la
  corona; se puede volver a poner.
- Fuentes sin cambios (SHA-256). Visor sin errores ni almacenamiento.

## Pendiente

- Cinta deportiva, gorra, sombrero y gorrito: versiones de frente (guía en `../guia-chatgpt/`).
