# Ojos de colores: azul, verde y lila de fantasía · PROPUESTA · 16/10/2026

Los **tonos** de esta referencia están aprobados (D-020). Son variantes de **nuestra** capa original de ojos abiertos
(`../ojos-abiertos/capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png`, que no se modifica), en las que **solo
cambia el color de los iris**. Por ahora solo están en el visor, para revisarlas.

| Archivo | Qué es |
| --- | --- |
| `referencia-tonos-aprobados.png` | Comparación generada con los tres tonos, conservada **sin modificar**. Solo se **mide** su tono; no se toma ningún píxel. |
| `colores_ojos.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-colores/colores_ojos.py`). |
| `capa-ojos-abiertos-azul.png`, `-verde.png`, `-lila.png` | Las variantes (948 × 1659, mismo lienzo y posición que la original). |
| `comparacion-colores.png` | Los cuatro colores sobre la muñeca (ojos ×2). |
| `comprobaciones.json` | Cifras. |

## Cómo se ha hecho

1. **Tono aprobado:** se mide en los iris de la referencia (en Lab). Se toma el tono y la saturación medianos:
   - azul: tono −98°, saturación 21;
   - verde: tono 114°, saturación 27;
   - lila: tono −36°, saturación 21.
2. **Zona:** solo dentro de los iris de nuestra capa, un círculo de radio 31 px alrededor de cada ojo con borde suave, y
   solo en los píxeles de tono marrón.
3. **Recoloreado:**
   - tono nuevo = tono aprobado + la mitad de la variación original (conserva las vetas);
   - saturación proporcional a la original;
   - la **luminosidad de cada píxel no cambia**: textura, sombreado, aro oscuro, pupilas y brillos son los mismos.
4. No cambian ni el blanco del ojo, ni las pestañas, ni la piel, ni los brillos (no tienen color), ni el **canal alfa**:
   la posición y la transparencia son las mismas.

## Comprobado

- Fuera de los iris, cada variante es **idéntica** a la original. El alfa es idéntico.
- Unos 4 650 px cambiados por variante; la luminosidad cambia de media menos de 0,3 (redondeo).
- Original y referencia sin modificar (SHA-256).
- Los **marrones** siguen como opción.
- El **parpadeo** reutiliza los ojos cerrados V2.1 aprobados: en el visor, al parpadear se cambia a la misma capa de
  ojos cerrados con cualquier color (comprobado con los tres).

En el visor: fila **«Color de ojos»** (Marrones · Azules · Verdes · Lilas).

**Probado:** comprobaciones automáticas y revisión visual en el ordenador; el visor, en Chromium con pantalla de iPhone
simulada (sin errores ni almacenamiento). Sin probar en el iPhone/iPad reales.

## Pendiente

- La revisión de los tonos sobre la muñeca, en el visor.
- Llevarlos a una **nueva** copia de prueba del juego, si se aprueban. La prueba D-019 (`../../prueba-juego-d016/`)
  sigue congelada.
- La resolución 2000 × 3500.
- El **pintacaras** de estrellas y brillo: siguiente paso, todavía sin implementar.
