# Peinado nuevo: coleta alta rizada con cinta deportiva lila · 16/10/2026 (D-025)

> **D-025:** la propietaria **aprueba la propuesta como peinado nuevo**. La **melena suelta se conserva** como otra opción
> (y sigue por defecto). **El encaje es candidato**, pendiente de aprobación. Nada activado en el juego; las pruebas
> congeladas, `main` y las partidas no cambian.

| Archivo | Qué es |
| --- | --- |
| `referencias/referencia-coleta-cinta-aprobada.png` | Imagen generada aprobada, **sin modificar** (SHA-256 `8ac66fe3…4a6b`). Solo se toman el pelo y la cinta. |
| `coleta.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/peinado-coleta-2026-10-16/coleta.py`). |
| `capas/pelo-coleta-detras.png` | Pelo de detrás (coleta y rizos de los lados): va detrás de nuestra base. |
| `capas/pelo-coleta-delante.png` | Pelo de delante (lo que cae sobre la cabeza: nacimiento del pelo, sienes): encima de la base. |
| `capas/cinta-coleta.png` | La cinta con su estrella, encima del pelo. |
| `capas/comparacion-coleta.png` | Melena (aprobada), coleta con cinta (candidata) y lo que queda si se quita la cinta. |
| `capas/regiones-de-la-imagen.png` | Cómo se ha separado la imagen (fondo, pelo, piel, cinta, vestido). |
| `capas/comprobaciones.json` | Cifras. |
| `guia-chatgpt/` | Guía para completar en ChatGPT el pelo que falta bajo la cinta. |

## Cómo se ha hecho

1. **Separar la imagen:** semillas claras de cada región (fondo crema; pelo oscuro; piel lisa de la cara y las orejas;
   lila de la cinta; rosa del vestido) y reparto del resto por contraste. Los ojos, las cejas, la nariz y la boca de la
   imagen (encerrados por la piel) y la sombra del cuello no son pelo. La estrella es parte de la cinta.
2. **Solo pelo y cinta:** no se toman la cara, el cuerpo ni el vestido de la imagen. Borde suave de 1 px, sin el color
   del fondo ni de la piel de la imagen (sin halo).
3. **Encaje:** con la escala y la posición de los ojos (centros de los iris: imagen (560, 666) y (798, 669); nuestra
   muñeca (391, 444) y (565, 444); escala 0,731), sin deformar.
4. **Delante / detrás:** lo que cae sobre nuestra cabeza va delante; el resto, detrás de la base.

## Comprobaciones (`capas/comprobaciones.json`)

- El pelo y la cinta cubren nuestra cabeza: donde la coleta deja la frente despejada se ve la piel de nuestra base como
  frente (13 739 px); no queda fondo de la imagen sobre nuestra cabeza salvo los blancos de los ojos de la imagen (que
  no se usan).
- No tapan nuestros ojos (24 px de pelo en el borde de las pestañas, sin efecto visible). La cara, el cuerpo y el
  vestido son los nuestros.
- Fuentes sin cambios. En el visor, sin errores; a tamaño real coincide con el montaje (≤ 3).

## La cinta, para ponerla y quitarla

**Bajo la cinta no hay pelo en la imagen** (37 960 px): si se quita, queda un hueco (ver `capas/comparacion-coleta.png`).
No se inventa aquí: la guía `guia-chatgpt/LEEME.md` explica cómo pedir **el mismo peinado sin la cinta** y cómo se
añadirá solo el pelo de esa zona. Hasta entonces, en el visor la coleta va **siempre con la cinta**.

## En el visor

Fila «Peinado»: **Melena suelta (aprobada)** por defecto · **Coleta rizada con cinta (candidata)**. Por ahora la coleta
es solo con **piel clara y pelo castaño**, y sin accesorio de pelo ni corona (están colocados para la melena); elegir
otra piel, otro color, otro pelo de delante o un accesorio vuelve a la melena. El parpadeo funciona igual.

## Pendiente

- Revisión del encaje (candidato).
- El pelo bajo la cinta (ChatGPT, con la guía) para poder quitarla.
- Después: colores de pelo, tonos de piel (bordes), accesorios y corona con la coleta; copia de prueba del juego; 2000 × 3500.
