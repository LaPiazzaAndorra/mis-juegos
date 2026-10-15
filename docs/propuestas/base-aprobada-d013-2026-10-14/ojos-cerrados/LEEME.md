# Ojos cerrados de prueba y parpadeo (base D-014) · PROPUESTA · 15/10/2026

Candidata de ojos abiertos para esta prueba: `../ojos-abiertos/capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png`
(las demás alternativas se conservan). Todo se monta sobre `../sin-ojos/base-sin-ojos-propuesta-v3.png`,
que **no se retoca más**. Nada activado ni publicado.

| Archivo | Qué es |
| --- | --- |
| `cerrados.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-cerrados/cerrados.py`). |
| `capa-ojos-cerrados-prueba.png` | Capa de ojos cerrados, 948 × 1659, en su sitio. |
| `zona-que-tapan.png` | Lo que tiene que quedar tapado: parche del relleno, pliegue y raíces (18 573 px). |
| `estado-abiertos.png`, `estado-cerrados.png` | Base sin ojos + una sola capa. |
| `vista-estados.png` | Original, abiertos y cerrados a ~480 px, ~220 px y cara ×2. |
| `vista-cobertura.png` | Cerrados con el contorno de la zona que deben tapar (azul). |
| `parpadeo-tamano-juego.gif`, `parpadeo-cara.gif` | Parpadeo: abiertos 1,2 s · cerrados 0,2 s · abiertos 1 s · cerrados 0,2 s · abiertos. |
| `comprobaciones.json` | Cifras. |

## Cómo está hecha la capa cerrada

1. **Párpado:** piel opaca sobre toda la zona que hay que tapar (más 3 px) y rampa de 7 px hacia la piel. Su
   color se interpola (Laplace) desde la piel **original** de alrededor. **Tapa el 100 %** del parche, el
   pliegue y las raíces (18 573 de 18 573 px).
2. **Línea de pestañas cerrada:** la línea del párpado y las pestañas de arriba de la capa abierta, **en espejo**
   respecto a la línea del párpado, colocadas en una curva de sonrisa más alta hacia el rabillo; línea entera,
   pestañas al 60 % y desvanecidas en los extremos. Es una deformación de las pestañas reales (mismo estilo),
   **no un dibujo nuevo**.
3. Cejas, nariz, boca y proporciones no cambian: los cambios están en la caja x 298–662, y 378–495 (21 px de
   puntas de pestaña quedan algo por debajo de la zona).

## Parpadeo

Al cerrar, la capa abierta se **oculta por completo** y se muestra la cerrada: cambio instantáneo, sin mezcla
de opacidad (el juego ya lo hace así, con `display: none` durante 200 ms). Nunca se ven los parches.

## Valoración honesta

- **A tamaño de juego** el parpadeo se lee bien y la piel del párpado se integra.
- **Ampliado no queda del todo natural:** la línea cerrada es fina y entrecortada en la mitad del lagrimal,
  las pestañas cerradas se ven algo despeinadas y el párpado es completamente liso (sin volumen ni pliegue).
  Para unos ojos cerrados de calidad final hará falta un dibujo a mano (o un retoque artístico de esta capa).
