# Rodillas: copia de la base con la piel completada (D-027, opción A) · 18/10/2026

La propietaria elige la **opción A**: una **copia independiente** de nuestra base en la que se completa **únicamente la
piel** que las mallas rosas dejan al descubierto bajo el pantalón de aventura. **La base aprobada no cambia**
(`base-aprobada-d013-2026-10-14/sin-ojos/base-sin-ojos-propuesta-v3.png`, SHA-256 `dd6bda4a…4d2f`); esta copia solo se
usaría con la ropa que la necesite.

## La zona (`preparar_piernas.py`)

- **Qué entra:** las mallas rosas de la base por debajo de y = 1 135 (unos 25–30 px por **dentro** del pantalón, para que
  bajo su borde ya haya piel) hasta el borde de las mallas en la rodilla, más 3 px hacia la piel de debajo, para que la
  unión quede limpia. **26 228 px** (caja x 342–616, y 1 135–1 261): 17 839 se verán con el pantalón y 8 389 quedan debajo.
- Cubre **todas** las mallas que se ven bajo el pantalón (16 696 px; 0 fuera de la zona).
- Nada más de la muñeca entra en la zona.

## Archivos

| Archivo | Para qué |
|---|---|
| `base-copia.png` | copia exacta (mismos bytes) de la base aprobada: la que se completa |
| `mascara-zona.png` | la zona en blanco sobre negro: después se toman **solo** esos píxeles |
| `mascara-zona-transparente.png` | la copia con la zona transparente (para editores que rellenan lo transparente) |
| `para-chatgpt/base-a-completar.png` | la copia sobre fondo crema (sin transparencias), para adjuntar |
| `para-chatgpt/zona-marcada.png` | la misma con la zona en magenta, para adjuntar |
| `para-chatgpt/referencia-piel-piernas.png` | nuestra piel bajo la rodilla (tono y textura) y cómo asoman las mallas con el pantalón |

## Qué hacer en ChatGPT

Adjuntar `base-a-completar.png`, `zona-marcada.png` y `referencia-piel-piernas.png`. Si el editor de ChatGPT permite
seleccionar una zona, seleccionar solo la zona magenta.

> Te adjunto una muñeca ilustrada (imagen 1), la misma con una zona marcada en magenta (imagen 2) y una referencia de su
> piel (imagen 3). Necesito **la imagen 1 exactamente igual**, con el mismo encuadre, tamaño y estilo, cambiando **solo la
> zona magenta**: ahí las piernas llevan unas mallas rosas; dibuja en su lugar **las piernas sin mallas**, con **la misma
> piel** (tono, luz, suavidad y pequeñas sombras) que la muñeca tiene bajo las rodillas, y **la misma forma y el mismo
> contorno** de las piernas (muslos y rodillas de una niña de 5–6 años). No cambies nada fuera de la zona: ni la camiseta,
> ni la cara, ni los brazos, ni los pies; fondo crema liso, sin texto ni marcos.

## Cómo se revisará

1. Alineación con la copia (ojos y silueta): fuera de la zona, la imagen tiene que coincidir.
2. Se toman **solo** los píxeles de `mascara-zona.png` y se revisa la unión con la piel de debajo de la rodilla y el
   contorno.
3. El resultado sería `base-piernas-sin-mallas.png` (copia nueva) y, después, sus tonos de piel con la transformación
   aprobada (D-023). La base aprobada y las partidas no cambian.

## Resultado de ChatGPT (18/10)

Imagen recibida (generada, sin modificar): `de-chatgpt/piernas-sin-mallas-chatgpt.png` (948 × 1 660, SHA-256
`151ce6a6…9fff`). Se usa **solo como fuente del relleno de piel dentro de la zona**. Integrada con
`../integrar/recibir.py piernas` (ver `../integrar/LEEME.md`):

- **Alineación:** la imagen no tiene ojos (como la plantilla), así que se alinea por la silueta y un ajuste fino:
  escala 1,0004 y desplazamiento (−0,2; −0,35) px; dentro de la silueta, diferencia mediana ΔE 2,2 (ChatGPT ha repintado
  algo toda la muñeca; **fuera de la zona no se toma nada**: la copia es idéntica a la base fuera de ella).
- **Tono:** su piel es un poco más clara que la nuestra; se mide en la pierna de debajo de la zona y se corrige con ese
  desplazamiento (L −2, b +2 en Lab de 8 bits). No se pinta nada nuevo.
- **Contorno:** la pierna sin mallas es un poco más fina; dentro de la zona, donde la imagen tiene fondo, la copia queda
  transparente (204 px); en el contorno se sustituye del todo, sin restos del borde de las mallas.
- **Unión con la rodilla:** con la zona tal cual (**A**), queda **una línea fina más oscura bajo la rodilla**: es la sombra
  del borde de las mallas en **nuestra** base, justo fuera de la zona (141 de 199 columnas, L −7,9 de mediana). Con la
  variante **B** (`mascara-zona-b.png`: la misma zona + **6 px por debajo del borde inferior**, solo sobre nuestra piel,
  `mascara_b.py`) la línea casi desaparece (14 columnas, L −3,7). **B queda como candidata y necesita tu aprobación**
  porque toma 1 161 px más allá de la zona aprobada.
- **Rosa que asoma bajo el pantalón:** **104 px en tres trocitos de 2–5 px** junto al borde del pantalón (16 722 antes):
  78 son del pantalón corto rosa que ChatGPT dejó un poco más largo que nuestro pantalón (borde exterior de la pierna
  izquierda y borde interior de la derecha) y 26 son de nuestra base, entre las piernas, fuera de la zona. **No se
  tapan del todo:** no se inventa piel para ellos. Marcados en azul en `../integrar/comparacion-rodillas.png`.
  Para quitarlos: una segunda imagen de ChatGPT sin nada rosa en la zona, o ajustar la camiseta y el pantalón (guía 1).

Resultado: `../integrar/piernas/` (A) y `../integrar/piernas-b/` (B), cada uno con `base-piernas-sin-mallas.png`,
`comprobaciones.json` y `revision.png`. **La base aprobada no cambia.**

## B aprobada y rosa que asoma (19/10)

- La propietaria **aprueba B** (zona + 6 px bajo el borde). Revisadas las 14 columnas en que la medida marcaba línea: son
  el sombreado natural junto al contorno (10) y el propio contorno interior (4); ampliado se veía además un escalón suave
  de tono en el borde de B. Se integra B con un **paso suave de 3 px dentro de su franja** (`recibir.py … piernas-b 3`):
  escalón en 4 de 199 columnas; fuera de la zona, nada cambia.
- **Rosa que asoma:** máscara mínima `mascara-rosa.png` (248 px, `mascara_rosa.py`) y guía en `para-chatgpt/rosa/LEEME.md`.

## Restos rosas corregidos con piel contigua (19/10, candidato B2)

Por decisión de la propietaria, sin imágenes nuevas (las dos que llegaron de ChatGPT cambiaban más cosas): dentro de
`mascara-rosa.png`, `corregir_rosa.py` pone fondo en la abertura central y, en las piernas, la piel de la misma columna
justo por debajo, reflejada en el borde inferior de cada trocito. Rosa a la vista de 111 a 1 px; fuera de la máscara,
idéntico. Resultado y detalle antes/después en `../integrar/piernas-b2/` (`antes-despues.png`).
