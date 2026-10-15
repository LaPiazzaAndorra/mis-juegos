# Ojos abiertos y pestañas · máscara PROPUESTA · 15/10/2026

Delimitación de los ojos abiertos con su línea del párpado y sus pestañas (de arriba y de abajo)
sobre la copia técnica `../base-transparencia-corregida.png` (948 × 1659). **Es solo una propuesta
para revisar:** no se ha extraído ninguna capa ni se ha borrado nada de la base; los píxeles y la
posición de los ojos no cambian. Pendiente de la aprobación visual de la propietaria.

| Archivo | Qué es |
| --- | --- |
| `mascara.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-abiertos/mascara.py`). Usa los centros de los iris de `../medidas/`. |
| `mascara-ojos-propuesta.png` | Máscara en grises, 948 × 1659: 255 = dentro, 0 = fuera, intermedios = bordes suaves de las pestañas. |
| `vista-mascara-sobre-base.png` | La máscara en magenta y su contorno en verde sobre la base. |
| `vista-mascara-ampliada.png` | Cada ojo ×4: base, contorno, y vista previa de lo que se extraería sobre fondo claro y oscuro. |

## Qué entra y qué no

- **Dentro:** blanco del ojo (también la sombra del párpado y el lagrimal), iris con sus brillos,
  línea del párpado superior, pestañas de arriba y las finas de abajo, con borde suave.
- **Fuera:** piel, cejas y el **pliegue del párpado** (arco marrón por encima del lado del lagrimal:
  es piel, no pestaña; se quita con una regla explícita en `mascara.py`).

## Datos

14 928 píxeles (13 201 opacos y 1 727 de borde suave); caja x 308–651, y 392–480.

## Puntos a revisar antes de extraer

1. **Pliegue del párpado fuera:** si se prefiere que vaya con el ojo, se quita la regla.
2. **Final de las pestañas en el lado del lagrimal:** la regla del pliegue deja un corte algo recto
   en el extremo de la línea de pestañas (arriba, junto al lagrimal).
3. **Bordes de las pestañas mezclados con piel:** en la ilustración original las puntas finas están
   pintadas sobre la piel; sobre fondo oscuro se ve un leve halo color piel. Sobre la base, en su
   sitio, no se nota. Para el parpadeo hará falta, además, rellenar de piel la zona de los ojos de la
   base (paso aparte, con su propia revisión).
4. Unos pocos píxeles oscuros sueltos en el lagrimal del ojo derecho (vista previa clara).
