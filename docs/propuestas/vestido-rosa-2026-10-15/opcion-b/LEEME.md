# Vestido rosa · opción B (copia limpia) · PROPUESTA · 15/10/2026

Copia técnica de la capa candidata (`../vestido-candidato-original.png`, que **no se modifica**). Es una propuesta: no
se activa en el juego ni se publica. **La base no se toca**, porque no se aplica la opción C. Se conservan el diseño,
los bordados, el largo y el ancho aprobados (D-015): **solo cambia el canal alfa**; los colores son idénticos (comprobado).

| Archivo | Qué es |
| --- | --- |
| `vestido_opcion_b.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/vestido-rosa-2026-10-15/opcion-b/vestido_opcion_b.py`). |
| `vestido-opcion-b.png` | **La copia limpia** (948 × 1659). |
| `montaje-opcion-b-abiertos.png`, `-cerrados.png` | Montaje sobre la base D-014 (mismo orden de capas que `../montaje/`). |
| `comparacion-opcion-b.png` | Original y opción B sobre fondo claro, oscuro y sobre la muñeca. |
| `detalle-bordes-y-tul.png` | Bajo de tul, borde de la falda y manga ×3: los bordes suaves y el tul se conservan. |
| `puntos-sueltos-quitados.png` | Dónde estaban los puntos sueltos. |
| `mascara-falta-tela.png` | **Máscara exacta de dónde falta tela** (blanco). |
| `ampliacion-axilas.png`, `ampliacion-hombros.png` | Ampliaciones ×3 del montaje. |
| `para-chatgpt/` | Paquete para completar las axilas con la herramienta de imagen de ChatGPT (ver abajo). |
| `comprobaciones.json` | Cifras. |

## Qué hace

1. **Puntos sueltos:** quita los 241 trozos (519 px) que no están unidos al vestido y la neblina casi invisible de
   alfa < 4 (12 894 px).
2. **Opacidad del cuerpo y del forro:** el vestido venía con alfa ≈ 253. Se normaliza (× 255 / 254, el máximo real del
   interior) y el interior macizo queda a 255. Ahora hay 407 007 píxeles opacos; antes había 94.
3. **Bordes suaves y tul:** lo que tenía alfa < 245 (17 747 px de bordes y del tul del bajo) solo sube por la
   normalización, como mucho +1. La transparencia intencionada del tul se conserva.

Resultado sobre la muñeca: la camiseta ya no se transparenta en el cuerpo del vestido. Se seguiría viendo solo en las
**axilas** (730 px) y, de forma tenue, en 211 px de borde suave.

## Dónde falta tela

- **Axilas:** sí falta tela. Entre la manga y el cuerpo hay un hueco de la capa (alfa 0–5) por el que se ve la
  camiseta de la base. `mascara-falta-tela.png` marca exactamente esos píxeles (1 207 px en dos zonas):
  - la ropa de la base que se vería, más 4 px hacia el hueco del vestido para que el relleno empalme;
  - nunca sobre tela que ya existe opaca.
- **Hombros: no falta tela (corrección del informe anterior).** La capa está entera ahí. El corte en diagonal, el filo
  claro punteado y la sombra con borde recto junto al cuello son el **borde del pelo de delante (pelo B)**:
  - ese pelo se recortó por la línea del hombro de la camiseta de la base;
  - la manga abullonada del vestido sobresale de esa línea.
  - `ampliacion-hombros.png` lo enseña (vestido solo entero; borde del pelo en naranja).
  - Arreglarlo es tarea del pelo, no del vestido: no se ha tocado.

## Completar las axilas con ChatGPT (`para-chatgpt/`)

1. Abre la herramienta de imagen de ChatGPT y sube `recorte-para-chatgpt.png`. Es un recorte del vestido, de 1024 × 1536
   (2:3, el formato vertical de ChatGPT).
2. Marca con el pincel de selección las zonas azules de `guia-donde-rellenar.png`. `mascara-recorte.png` es la misma
   máscara en blanco y `recorte-zona-transparente.png` es el recorte con esa zona transparente.
3. Texto sugerido:
   > Rellena solo la zona seleccionada, debajo de cada manga, entre la manga y el cuerpo del vestido, con la misma tela
   > rosa del cuerpo del vestido, siguiendo sus pliegues y su textura. No cambies nada más: ni el bordado, ni el lazo,
   > ni las mangas, ni el tamaño ni el encuadre. No añadas piel, brazos ni fondo.
4. Descarga el resultado, guárdalo fuera del repositorio y ejecuta:
   `python3 docs/propuestas/vestido-rosa-2026-10-15/opcion-b/para-chatgpt/integrar_relleno.py RESULTADO.png`
   - El programa toma de la imagen editada **solo** los píxeles de la máscara (tela opaca, con 1 px de fundido). El
     resto del vestido queda exactamente igual, aunque ChatGPT haya cambiado algo más.
   - Avisa de cuánto cambió ChatGPT fuera de la zona.
   - Escribe `vestido-opcion-b-axilas-candidata.png` y `revision-axilas-chatgpt.png` para revisarlos.
   - Si ChatGPT devuelve otro encuadre que no sea 2:3, no lo integra.
   - Probado con un relleno simulado: 0 píxeles cambiados fuera de la máscara.

En el visor (`../../base-aprobada-d013-2026-10-14/visor/`): **Ropa → Vestido limpio · opción B**.

**Probado:** comprobaciones automáticas y revisión visual en el ordenador; el visor, en Chromium con pantalla de iPhone
simulada. No se ha probado en el iPhone/iPad reales.
