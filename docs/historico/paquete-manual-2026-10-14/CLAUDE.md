# Instrucciones permanentes para Claude / ChatGPT / cualquier agente de código

**Este archivo es vinculante como protocolo del proyecto, pero NO sustituye las instrucciones del propietario ni el código real.**

## Antes de trabajar (obligatorio en cada sesión)

1. Confirmar repositorio exacto: `LaPiazzaAndorra/mis-juegos`. **Nunca modificar `LaPiazzaAndorra/la-piazza-gestio`** para tareas del juego.
2. Ejecutar/verificar `git status`, rama actual, remoto, último commit, cambios pendientes y permisos efectivos de lectura/escritura. No afirmar acceso de escritura hasta probarlo.
3. Leer íntegros `README.md`, `docs/ESTADO_ACTUAL.md`, `docs/DECISIONES.md`, `docs/REGISTRO_CAMBIOS.md` y el documento técnico pertinente.
4. Comparar la documentación con el código, el historial y los recursos de la rama actual; resolver discrepancias. La descripción de estado puede estar anticuada.
5. Resumir: último commit real, estado, objetivo, riesgos, pruebas y archivos que se van a tocar.
6. No actuar sobre `main` sin aprobación expresa; trabajar en rama separada (actualmente se ha usado `avatar-creador` para el avatar).

## Durante cada cambio

- **No reemplazar ni borrar funcionalidades preexistentes**: pintar, plantillas importadas, galería, heladería, vestir, Mi Mundo, pensar, configuración, audio, estrellas y progreso.
- No borrar, renombrar o resetear sin migración comprobada las claves existentes de `localStorage` ni la base `IndexedDB` usada para láminas.
- Conservar identificadores de piezas del catálogo; garantizar compatibilidad de los personajes guardados.
- Mantener el diseño pastel aprobado, textos en castellano e interacción infantil táctil accesible, sin depender de emojis como arte definitivo de personajes.
- Avatar premium: dos capas de pelo, ojos abiertos/cerrados, proporciones aprobadas, transparencia real; **un borrador no es un recurso definitivo**.
- Ejecutar pruebas pertinentes sobre iPhone, iPad, vertical/horizontal, guardado, recuperación, navegación, modo offline y caché cuando corresponda. Si no se ejecutan, declararlo.
- Generar previsualizaciones para aprobación del usuario antes de activar recursos definitivos.
- No mezclar prototipos/sesiones de prueba con datos reales.

## Antes de realizar un commit (obligatorio)

- Actualizar en la **misma rama y el mismo commit**:
  - `docs/ESTADO_ACTUAL.md`: actualizado, probado, pendiente, problemas y fecha.
  - `docs/REGISTRO_CAMBIOS.md`: una entrada con fecha, rama/commit, archivos, pruebas, riesgos y estado de publicación.
  - Si corresponde: `docs/AVATAR_Y_ASSETS.md`, `docs/ARQUITECTURA_Y_DATOS.md`, `docs/DECISIONES.md` o `docs/HOJA_DE_RUTA.md`.
- Ejecutar la comprobación de documentación (`python3 herramientas/verificar_documentacion.py BASE_SHA HEAD_SHA`) si existe y el diff tiene cambios funcionales.
- Revisar `git diff` completo antes de crear commit; no subir imágenes personales, información sensible, tokens ni datos infantiles.
- No afirmar que algo está publicado sin comprobar el commit remoto.

## Informe de entrega de CADA tarea

Indicar: 1) qué cambió; 2) rama y hash del commit; 3) pruebas ejecutadas y resultados; 4) estado del manual y changelog; 5) qué sigue pendiente; 6) si afecta a datos guardados; 7) si `main` permanece intacta; 8) cómo revertir.

**Si faltan permisos:** preparar parche/ZIP y decirlo claramente; nunca fingir que se ha subido a GitHub.
