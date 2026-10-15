# Muñeca premium por capas — estado y procedimiento

> **Nueva decisión visual, 14/10/2026:** la propietaria ha elegido la muñeca de cuerpo entero
> de `docs/propuestas/muneca-elegida-2026-10-14/` (D-012). La tabla de abajo describe las piezas
> V2.1 conservadas, no capas ya realizadas para la nueva referencia. Antes de reemplazar una
> base hay que revisar la identidad, la resolución real, las medidas y las guías. Ningún pelo
> generado durante esta continuación se ha integrado como definitivo.
>
> **Norma visual permanente, 14/10/2026 (D-013):** toda pieza nueva sigue
> [`NORMA_VISUAL_MUNECA.md`](NORMA_VISUAL_MUNECA.md): nenita de unos 5–6 años (cabeza grande, cuerpo
> compacto, brazos y piernas cortitos y redondeados) con la cara de D-012. El pelo y la ropa se adaptan
> a la muñeca. La última imagen de cuerpo más compacto es un borrador: no hay capas ni medidas nuevas aprobadas.
>
> **Base visual aprobada, 14/10/2026 (D-014):** [`propuestas/base-aprobada-d013-2026-10-14/`](propuestas/base-aprobada-d013-2026-10-14/LEEME.md)
> (948 × 1659, sin modificar). Es la apariencia aprobada, **no** una capa de producción: faltan resolución,
> opacidad y bordes limpios, separación de capas y medidas nuevas. Opacidad y bordes ya están resueltos en la
> copia técnica `base-transparencia-corregida.png` (mismo directorio, 948 × 1659, solo alfa corregido).
> Medidas y guía **provisionales** en `medidas/` (pendientes de revisión; no tocan la plantilla V2.1).
> Máscara **propuesta (v2)** de los ojos abiertos y pestañas en `ojos-abiertos/` (v1 conservada), **capa de prueba**
> extraída con ella y **base sin ojos** propuesta en `sin-ojos/` con la comprobación del montaje. **v3:** máscara v3, base
> sin ojos v3 y capas sin corregir y con color experimental (estimado) para comparar. Nada activado.
> **Ojos cerrados de prueba** y parpadeo en `ojos-cerrados/` (deformación de las pestañas reales; no es arte final),
> y variante con `ojos-cerrados-clara.png` (V2.1, sin modificar) reutilizado a escala uniforme (**candidata preferida**).
> **Pelo:** sin capas para D-014; borrador de montaje con el pelo de la referencia D-012 en `pelo-borrador-d012/`.

**Comprobado contra `arte/originales/` y `avatar/catalogo-muneca.js` el 14/10/2026.**
Documentos de referencia, que mandan sobre este resumen: `plantilla/ASSETS.md` (lista de
archivos), `plantilla/PELO.md` (pelo), `plantilla/INSTRUCCIONES.md` (cómo dibujar) y
`plantilla/plantilla.js` (medidas exactas).

## Estado de cada pieza del catálogo premium

| Pieza (archivo en `arte/originales/`) | Estado |
| --- | --- |
| `base-clara.png` | ✅ **V2.1 aprobada** (cuello corto, brazos a 21°, codos y muslo retocados). En la rama desde `b534d9b`. |
| `ojos-marron.png` | ✅ Aprobados, opacidad al 100 %. En la rama desde `7890d1c`. |
| `ojos-cerrados-clara.png` | ✅ Corregidos (solo párpado y pestañas, centrados sobre cada ojo). Parpadeo y dormir probados. |
| `ojos-azul.png` | ✅ Variante automática con la máscara del iris (`arte/mascaras/ojos-iris-mascara.png`); revisada por la propietaria junto con los ojos. |
| `pelo-rizos-detras-castano.png` | ⏳ **Pendiente.** El primer borrador se rechazó (restos de otra figura, cortes rectos, islas, poca resolución) y **no está en el repositorio**. Hay plantillas y validador listos. |
| `pelo-rizos-delante-castano.png` | ⏳ **Pendiente**, igual que el anterior. |

> **14/10/2026:** revisión repetida a petición de la propietaria. No ha llegado ninguna capa corregida; el primer
> borrador (que conserva la propietaria en su ZIP «AMAIA_RIZOS_CASTANOS_PRIMERA_PRUEBA», fuera del repositorio
> público) sigue dando 8 errores. Se ha preparado el paquete «PELO_RIZOS_CASTANOS_PARA_ILUSTRAR.zip» (especificación,
> plantillas, base y ojos aprobados, validador sin conexión e informe del borrador). No se generan rizos por código.
| `ropa-princesa.png` (vestido rosa) | ⏳ Pendiente; después del pelo. |
| `zapatos-princesa.png` | ⏳ Pendiente. |
| `acc-corona.png` | ⏳ Pendiente. |
| `base-morena.png`, `ojos-cerrados-morena.png` | ⏳ Pendientes. Se pueden preparar borradores automáticos con `herramientas/variantes.py piel` y `… cerrados`. |

Mientras falten el pelo y la ropa, el juego normal sigue con la muñeca provisional (`prueba`).
Con `?arte=borrador` se ve la base premium con los ojos.

## Medidas clave (plantilla v2, tomadas de la base V2.1)

Lienzo 2000 × 3500 px · eje x = 999 · suelo y = 3275 · línea de ojos y = 1040 (ojos en x ≈ 785 y
1215) · barbilla y = 1430 · hombros y = 1684 · cintura y = 1896 · cadera y = 2299 · brazos a 21°.
Pelo: nacimiento entre y ≈ 525 y 685 y puntas entre y ≈ 2000 y 2350; zona prohibida de ojos y
pestañas con 30 px de margen. **La autoridad es `plantilla/plantilla.js` y las guías de
`plantilla/guias/`** (`guia-*.png` por pieza y `plantilla-pelo-detras.png` /
`plantilla-pelo-delante.png` para el pelo).

## Reglas de exportación del arte

- PNG RGBA de **2000 × 3500**, sRGB, fondo transparente, **lienzo completo sin recortar**.
- Todas las capas se dibujan sobre la base V2.1 y con sus guías, no sobre capturas ni recortes.
- Detalle original a esa resolución: no ampliar imágenes pequeñas (el validador mide la nitidez).
- Opacidad del 100 % en el interior; solo los bordes semitransparentes. Sin halos, escalones,
  cortes rectos ni islas.
- Las capas que se solapan se prolongan por debajo de las otras, para que no salgan huecos al animarse.
- **Que pase el validador no basta:** también hay que revisarlo a ojo en fondo claro y oscuro, al 100 %.

## Cómo se incorpora una pieza

1. Guardar el PNG original y, si existe, el archivo editable (Procreate o PSD) fuera del repositorio,
   con copia.
2. Pasarlo por `herramientas/comprobar-capas.html` (y por `validar-pelo.html` si es pelo).
3. Enseñarlo montado sobre la muñeca en iPhone e iPad (`?arte=borrador`) y obtener la aprobación
   explícita de la propietaria.
4. Copiarlo con su nombre exacto a `arte/originales/`.
5. `python3 herramientas/optimizar.py` (actualiza `avatar/arte/`) y subir la versión de `sw.js` si
   ha cambiado algún archivo de código.
6. `node pruebas/prueba-juego.js` y pruebas visuales: piel, ojos, pelo, ropa, guardar y editar,
   parpadeo, dormir y «Mi Mundo».
7. Actualizar este documento, `docs/ESTADO_ACTUAL.md` y `docs/REGISTRO_CAMBIOS.md` en el mismo commit.

Si la base cambiara: `herramientas/medir_base.py --escribir`, regenerar las láminas
(`herramientas/plantilla.html`) y las guías (`guias.py`, `guias_pelo.py`). Los pasos están en
`avatar/LEEME.md`.

## Después

Vestido rosa, zapatos y corona; después piel morena, más peinados, colores y ropa, y varios looks
guardados para usar en los escenarios. Ninguna capa decorativa debe impedir cambiar el pelo o la ropa.
