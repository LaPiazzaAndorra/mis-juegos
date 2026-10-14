# Muñeca premium por capas — estado y procedimiento

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
