# Pintacaras «Estrellas y brillo» · 16/10/2026 (D-021)

> **D-021:** el **diseño** está aprobado por la propietaria (estrellas rosas, lilas y doradas con pequeños puntos de
> brillo). **El encaje en nuestra cara queda pendiente de revisión.** Solo está en el visor; nada activado en el juego.
> La prueba congelada D-019 no cambia.

Capa transparente **independiente** con **solo los adornos** de las mejillas. No lleva piel ni sustituye la cara
original: va encima de la base y de los ojos, como el resto de piezas, y se puede quitar.

| Archivo | Qué es |
| --- | --- |
| `referencia-pintacaras-aprobada.png` | Imagen generada con el diseño aprobado, conservada **sin modificar** (SHA-256 `526921fd…76a9`). |
| `pintacaras.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/pintacaras/pintacaras.py`). |
| `capa-pintacaras-estrellas.png` | La capa candidata (948 × 1659, mismo lienzo que las demás piezas). |
| `comparacion-pintacaras.png` | La cara sin y con pintacaras (×2). |
| `zonas-comprobadas.png` | Zonas que se han comprobado: ojos (morado), pestañas (naranja), boca (rojo), pecas (azul) y borde de la piel de la cara (verde). |
| `comprobaciones.json` | Cifras. |

## Cómo se ha hecho

1. **Solo los adornos de la referencia.** En cada mejilla se estima la piel (mediana de 41 px) y solo se toma lo que se
   separa claramente de ella:
   - **estrellas** (manchas grandes y compactas), rellenas por dentro: su brillo y su relieve son de la estrella;
   - **puntos de brillo**: manchas pequeñas **más claras** que la piel, con el color de su centro y una transparencia
     proporcional (así no arrastran color de piel);
   - **no se toman** las manchas pequeñas más oscuras (las **pecas** de la referencia), ni nada que toque el borde
     del recorte (pestañas, ojo, oreja).
   - Resultado por mejilla: una estrella rosa y una lila (las grandes), dos doradas más pequeñas y 27 puntos de brillo.
2. **Encaje en nuestra cara.** Cada mejilla se coloca respecto a **su** ojo (centros de los iris medidos: referencia
   (316, 690) y (636, 691); nuestra cara (391, 444) y (565, 444)), a la escala de los iris (0,52; reescalado con alfa
   premultiplicada, sin halos). Ajuste fino: **izquierda −3, +7 px; derecha +3, +8 px** (un poco hacia abajo y hacia
   fuera, lo mínimo para no tocar la capa de ojos y quedarse dentro de la piel).
3. **Pecas.** 10 puntos de brillo que caían encima de una peca se han movido 1–3 px a un sitio libre, y 4 que no tenían
   sitio no se ponen. Las estrellas no se mueven.

## Comprobaciones (`comprobaciones.json`)

- Solape con los ojos (abiertos de los 4 colores y cerrados, con 3 px de margen): **0 px**.
- Solape con las pestañas (también las de abajo): **0 px**. Con la boca (6 px de margen): **0 px**.
- Fuera de la piel de la cara (con 3 px de margen al borde): **0 px**.
- Pecas: de 121 pecas detectadas en nuestra cara, **114 quedan libres**; 7 puntitos muy suaves de la parte de fuera de
  las mejillas (16 px en total) quedan bajo las estrellas. Las pecas visibles de la nariz y del centro de las mejillas
  quedan todas libres.
- Fuentes (referencia, base, ojos, pelo y montaje) **sin cambios** (SHA-256).
- En el visor: con los 4 colores de ojos y el parpadeo (y «Mantener cerrados») la capa sigue visible y los ojos
  cambian igual; sin errores ni almacenamiento; a tamaño real coincide con el montaje + capa en lo opaco (≤ 2).

## Pendiente

- **Revisión del encaje** por la propietaria (posición, tamaño y cantidad de brillos).
- Resolución 2000 × 3500; integración en una copia nueva de prueba del juego (D-019 sigue congelada); el juego
  principal no cambia.
