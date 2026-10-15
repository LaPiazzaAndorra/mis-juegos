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

## Variante V2.1 reutilizada (`cerrados_v21.py`) · 15/10/2026

Archivos: `capa-ojos-cerrados-prueba-v21.png`, `estado-cerrados-v21.png`, `vista-estados-v21.png`,
`vista-cobertura-v21.png`, `parpadeo-v21-tamano-juego.gif`, `parpadeo-v21-cara.gif`, `comprobaciones-v21.json`.

- Fuente: `arte/originales/ojos-cerrados-clara.png` (V2.1 aprobada), **sin modificar** (SHA-256
  `c0d93161…87e5`, comprobado antes y después). El prototipo anterior se conserva.
- Mismo párpado de cobertura (sin las pestañas en espejo) y, encima, cada ojo cerrado V2.1 separado y
  colocado con **escala uniforme** (0,361 izquierdo, 0,366 derecho: solo reducción), sin giro ni
  deformación: la escala sale del ancho de la abertura del ojo nuevo respecto al ojo abierto V2.1, y el
  centro de la abertura V2.1 cae en el de la nueva. Curva, proporciones y detalle se conservan.
- **Tapa el 100 %** del parche, el pliegue y las raíces (18 573 de 18 573 px). Cambios solo en x 298–662,
  y 378–495.
- **Valoración:** encaja **bastante mejor** que la prueba anterior: líneas limpias y curvas, se lee bien a
  tamaño de juego y ampliado. Diferencias que se notan: sus pestañas son más finas y menos abundantes que
  las de los ojos abiertos nuevos (estilo V2.1), y el párpado sigue siendo liso. Sigue siendo una prueba.

## Valoración honesta (prueba anterior, `cerrados.py`)

- **A tamaño de juego** el parpadeo se lee bien y la piel del párpado se integra.
- **Ampliado no queda del todo natural:** la línea cerrada es fina y entrecortada en la mitad del lagrimal,
  las pestañas cerradas se ven algo despeinadas y el párpado es completamente liso (sin volumen ni pliegue).
  Para unos ojos cerrados de calidad final hará falta un dibujo a mano (o un retoque artístico de esta capa).
