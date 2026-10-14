# Arte premium de la muñeca — especificación viva

**Estado visual comunicado:** base V2.1 aprobada, ojos aceptados, pelo rizado por reconstruir. Verificar nombres, geometría y catálogo actuales antes de exportar.

## Reglas generales de exportación

- Cada PNG original: **2000 × 3500 px, sRGB, fondo transparente, lienzo completo sin recortar**.
- Todas las capas tienen exactamente el mismo sistema de coordenadas y parten de la **base V2.1 y sus guías oficiales del repositorio**, no de una captura ni de un recorte.
- No ampliar imágenes pequeñas hasta tamaño nominal simulando resolución. Dibujar/generar el detalle al tamaño de origen necesario.
- Píxeles del cuerpo/cabello sólidos con **opacidad del 100 %**; solo suavizado en contornos y sombras intencionales. Evitar halos, escalones, recortes rectos e islas.
- Iluminación, volumen, tonalidades y sombras consistentes entre cuerpo, pelo, ojos y ropa.
- Las piezas que se solapan deben prolongarse debajo de las otras para evitar huecos al animar.
- **Nunca marcar como aprobado un recurso solo porque un validador automático pase**; también requiere inspección visual en fondo claro y oscuro.

## Capas de cabello solicitadas actualmente

| Archivo final | Contenido exclusivo |
| --- | --- |
| `pelo-rizos-detras-castano.png` | Melena larga rizada detrás de la cabeza y espalda; rellenar incluso la parte oculta para que la cabeza no deje huecos al moverse. **Sin piel, orejas ni cuerpo.** |
| `pelo-rizos-delante-castano.png` | Raíz, flequillo y mechones delanteros sobre frente/hombros; **sin piel, ojos, orejas, pestañas ni cara**. No invadir margen de ojos/pestañas. |

Tomar los límites exactos de `plantilla/guias/guia-pelo.png` si esa ruta existe en la rama actual: **nombre real usado por Claude según capturas: `plantilla/guias/guia-pelo.png`**. Las guías de detalle mencionadas en capturas son `plantilla-pelo-detras.png` y `plantilla-pelo-delante.png`; confirmar ubicación antes de trabajar.

### Medidas orientativas reportadas por Claude (verificar con la versión actual)

- Lienzo: 2000 × 3500.
- Línea de ojos: alrededor de `y=1040`; el cabello NO debe tocar el espacio de pestañas.
- Nacimiento del cabello delantero: franja aproximada `y=525–685`, transición suave, sin borde cortado.
- Puntas de rizos: altura aproximada `y=2000–2350`, con extremos irregulares.
- Pelo trasero: prolongación interior bajo la parte alta de la cabeza para que el balanceo no descubra huecos.
- Guía de exclusión: cara, pestañas, nariz y boca; usar los márgenes dibujados por Claude en la guía actual.

**Estas coordenadas orientan: las plantillas originales aprobadas de la rama son la autoridad.**

## Arte existente y aprobado en imágenes enviadas

- Base clara premium V2.1, corregidos codos y muslo, medidas aprobadas.
- Ojos marrones ilustrados; pestañas y brillos, ojos cerrados corregidos para parpadeo/dormir.
- Alternativas azul/verde derivadas con máscara del iris, sin sustituir ojos por emojis.
- Primera composición del pelo: estilo de rizos largos aprobado estéticamente, **archivos de borrador técnicamente rechazados** por restos de otras figuras y poca nitidez.

## Pipeline de incorporación

1. Conservar PNG fuente original y, si existe, su archivo editable (capas de Procreate/PSD) con copia de seguridad.
2. Comprobar PNG, tamaño y fondos en las herramientas actualizadas del repo.
3. Montar en el **validador de pelo** y revisar zoom 100 %, móviles y tabletas (vertical/horizontal).
4. Pedir confirmación explícita a la propietaria; no usar mensajes de aprobación de otros recursos.
5. Colocar los PNG originales con sus nombres exactos en `arte/originales/`.
6. Optimizar WebP/registrar en `avatar/arte/piezas.js` y catálogo **solo con el procedimiento actual de la rama**.
7. Reprobar piel, ojos, pelo, ropa, guardar/editar, parpadeo, dormir y «Mi Mundo».
8. Registrar el commit y actualizar `ESTADO_ACTUAL.md` y `REGISTRO_CAMBIOS.md`.

## Prioridad posterior

Vestido rosa ilustrado por capas, zapatos, corona, nuevos peinados y colores; después, guardar diferentes looks para usar en los escenarios. **No añadir una capa decorativa que impida cambiar el pelo o la ropa.**
