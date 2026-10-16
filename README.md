# Mi Mundo de Juegos

Juego infantil web, instalable en iPhone y iPad, creado para Amaia: pintar, jugar a ser
(heladería, vestir y «Mi Mundo») y pensar (parejas, contar, ¿qué sigue?, sombras y el diferente).

**La referencia permanente del proyecto es este repositorio, no la memoria de una conversación con
una IA.** Personas y asistentes: leed primero `CLAUDE.md` y `docs/ESTADO_ACTUAL.md`, y comprobad
después el código real de la rama. Si documentación y código no coinciden, manda el código y hay que
corregir la documentación.

## Para continuar en una conversación nueva

Pide literalmente: *«Abre `CLAUDE.md` y la carpeta `docs/` del repositorio `LaPiazzaAndorra/mis-juegos`
(rama `avatar-creador`), confirma el último commit real y resume el estado antes de cambiar nada.»*
(Esta frase no da permisos de GitHub por sí sola: el asistente debe tener acceso al repositorio.)

## Ramas

| Rama | Contenido |
| --- | --- |
| `main` | Versión publicada del juego (commit `4bbf51d`, 11/10/2026). Protegida: no se cambia sin aprobación. |
| `avatar-creador` | Desarrollo del nuevo creador de avatar, la habitación de «Mi Mundo», la muñeca nueva (en propuestas: visor y prueba aislada, ver `docs/MANUAL_PROYECTO.md`), las herramientas y esta documentación. |

## Documentación

| Archivo | Para qué sirve |
| --- | --- |
| [`CLAUDE.md`](CLAUDE.md) | Reglas obligatorias para cualquier asistente que programe el juego. |
| [`docs/ESTADO_ACTUAL.md`](docs/ESTADO_ACTUAL.md) | Qué funciona, qué está probado, qué falta y el próximo paso. |
| [`docs/MANUAL_PROYECTO.md`](docs/MANUAL_PROYECTO.md) | Objetivo, módulos del juego, criterios de diseño y cómo añadir funciones. |
| [`docs/ARQUITECTURA_Y_DATOS.md`](docs/ARQUITECTURA_Y_DATOS.md) | Archivos, módulos, datos guardados, caché sin conexión y riesgos. |
| [`docs/AVATAR_Y_ASSETS.md`](docs/AVATAR_Y_ASSETS.md) | Muñeca premium por capas: estado de cada pieza y cómo se incorporan. |
| [`docs/VERSION_DE_PRUEBAS.md`](docs/VERSION_DE_PRUEBAS.md) | Enlace e instrucciones de la versión de pruebas para el iPhone (otro origen, datos ficticios). |
| [`docs/PRUEBAS_Y_RECUPERACION.md`](docs/PRUEBAS_Y_RECUPERACION.md) | Pruebas, copias de seguridad de los datos, recuperación y protección de `main`. |
| [`docs/REGISTRO_CAMBIOS.md`](docs/REGISTRO_CAMBIOS.md) | Historial de cambios comprobado contra Git, con plantilla obligatoria. |
| [`docs/DECISIONES.md`](docs/DECISIONES.md) | Decisiones aprobadas y por qué: no repetir debates. |
| [`docs/NORMA_VISUAL_MUNECA.md`](docs/NORMA_VISUAL_MUNECA.md) | Norma visual permanente de la muñeca (D-013) y lista de revisión de cada pieza. |
| [`docs/HOJA_DE_RUTA.md`](docs/HOJA_DE_RUTA.md) | Ideas y mejoras futuras (no son funciones ya disponibles). |
| [`plantilla/`](plantilla/) | Plantilla de la muñeca, guías por pieza, `ASSETS.md`, `PELO.md` e `INSTRUCCIONES.md`. |
| [`avatar/LEEME.md`](avatar/LEEME.md) | Funcionamiento técnico del motor del avatar. |
| [`docs/historico/`](docs/historico/) | Versiones anteriores de documentos, sin modificar. |

## Herramientas

| Herramienta | Uso |
| --- | --- |
| `herramientas/copia-de-seguridad.html` | Copiar y restaurar los datos del juego **en un navegador** (no llega a los datos de la app instalada en iOS). |
| `herramientas/comprobar-capas.html` | Comprobar que las capas de arte encajan con la plantilla. |
| `herramientas/validar-pelo.html` | Validar las dos capas de pelo sobre la muñeca. |
| `herramientas/optimizar.py` | Convertir el arte original en las imágenes ligeras del juego. |
| `pruebas/prueba-juego.js` | Prueba automática de regresión en navegador. |
| `herramientas/verificar_documentacion.py` | Comprueba que cada cambio llega con su documentación (también en cada PR). |

## Importante

- **Git guarda el código, el arte y la documentación, pero no las estrellas, los dibujos ni el
  personaje de Amaia**, que viven en el navegador del iPad o del iPhone. Para eso está la copia de
  seguridad (ver `docs/PRUEBAS_Y_RECUPERACION.md`); en la app instalada del iPhone se hace
  desde dentro del juego, con «Guardar mi progreso» (en la rama, sin publicar todavía).
- **El repositorio es público:** todo lo que se sube puede verlo cualquiera. Nada de datos personales,
  fotos reales de menores, contraseñas ni copias de seguridad de datos.
