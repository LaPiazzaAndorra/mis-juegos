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
