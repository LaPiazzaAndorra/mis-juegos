# Mi Mundo de Juegos — documentación del proyecto

Juego infantil web instalable para iPhone/iPad, desarrollado para la experiencia creativa de Amaia. **La referencia permanente del proyecto es este repositorio, no el historial de conversación de una IA.**

> **Al entrar al proyecto, tanto personas como asistentes:** leer primero `CLAUDE.md`, `docs/ESTADO_ACTUAL.md` y `docs/MANUAL_PROYECTO.md`; revisar después el código real en la rama correspondiente. Si la documentación y el código difieren, **no asumir que la documentación está actualizada**: investigar y corregir ambas cosas antes de modificar.

## Índice de documentación

| Archivo | Para qué sirve |
| --- | --- |
| [`CLAUDE.md`](CLAUDE.md) | Reglas obligatorias para cualquier asistente que programe el juego. |
| [`docs/MANUAL_PROYECTO.md`](docs/MANUAL_PROYECTO.md) | Visión general, estructura, funciones, criterios de diseño. |
| [`docs/ESTADO_ACTUAL.md`](docs/ESTADO_ACTUAL.md) | Qué funciona, qué está pendiente y cuál es el próximo paso. |
| [`docs/ARQUITECTURA_Y_DATOS.md`](docs/ARQUITECTURA_Y_DATOS.md) | Archivos, módulos, guardado local, offline, compatibilidad. |
| [`docs/AVATAR_Y_ASSETS.md`](docs/AVATAR_Y_ASSETS.md) | Especificaciones del avatar ilustrado y gráficos por capas. |
| [`docs/PRUEBAS_Y_RECUPERACION.md`](docs/PRUEBAS_Y_RECUPERACION.md) | Pruebas antes de publicar, copias y recuperación. |
| [`docs/REGISTRO_CAMBIOS.md`](docs/REGISTRO_CAMBIOS.md) | Registro cronológico de cambios, con plantilla reutilizable. |
| [`docs/DECISIONES.md`](docs/DECISIONES.md) | Decisiones aprobadas y razones; no repetir debates. |
| [`docs/HOJA_DE_RUTA.md`](docs/HOJA_DE_RUTA.md) | Mejoras previstas, NO confundir con funciones ya disponibles. |

## Política de cambios

1. Antes de programar: abrir este índice, el estado actual y las decisiones; comparar con la versión real del repositorio.
2. Crear una rama de trabajo; **no tocar `main` sin autorización explícita**.
3. Hacer cambios pequeños y verificables; proteger las claves de almacenamiento existentes y probar en móvil y tableta.
4. **En el mismo commit** que modifica el código, actualizar `docs/ESTADO_ACTUAL.md` y añadir entrada en `docs/REGISTRO_CAMBIOS.md`. Si hay cambio de arquitectura, arte o experiencia, actualizar también su documento.
5. Adjuntar capturas, resultados de prueba y hash del commit; anotar qué queda pendiente.
6. No fusionar a `main` ni publicar sin aprobación.

**IMPORTANTE:** Git conserva código, imágenes y documentación que se hayan subido al repositorio, pero **no** respalda automáticamente estrellas, dibujos o personajes guardados en el navegador. Ver `docs/PRUEBAS_Y_RECUPERACION.md`.

**Privacidad:** evitar datos personales, fotos reales de menores, credenciales o archivos privados: si el repositorio sigue siendo público, toda la documentación e imágenes subidas podrían quedar visibles para cualquiera.
