# Registro de cambios (changelog)

**Norma:** cada cambio de código/arte va acompañado, en el mismo commit, de una entrada aquí y de la actualización de `ESTADO_ACTUAL.md`. No incluir historial inventado: distinguir commits comprobados de informes por captura.

## 2026-10-14 — Preparación de documentación permanente (paquete pendiente de subir)

- **Tipo:** documentación de continuidad, no cambios funcionales.
- **Qué:** índice, protocolo de IA, manual, estado, arquitectura/datos, especificación de avatar, pruebas/respaldo, decisiones y hoja de ruta.
- **Rama/commit remoto:** por determinar cuando se suba realmente.
- **Fuente inicial:** snapshot Git bundle en `8cef5dc` + capturas de Claude hasta el 14/10/2026.
- **Pruebas:** sintaxis y enlaces internos de documentación; comprobar en rama actual antes de aplicar.
- **Publicación:** PENDIENTE. No está en `main` ni se afirma subida a GitHub.

## Hitos anteriores (referencias)

| Fecha aprox. | Commit | Situación |
| --- | --- | --- |
| 2026-10-11 | `4bbf51d` | Último commit de `main` en el bundle suministrado; requiere comprobación remota reciente. |
| 2026-10-13 | `8cef5dc` | Copia local auditada: plantilla y circuito de capas PNG, rama `avatar-creador`. |
| 2026-10-14 (según captura) | `b266e52` | Claude informa validador y plantillas de pelo en `avatar-creador`; NO confirmado por lectura remota en este paquete. |

## PLANTILLA OBLIGATORIA — copiar por cada tarea

### AAAA-MM-DD — Título claro

- **Solicitud aprobada por:** ___
- **Rama y commit:** ___
- **Estado:** en prueba / aprobado / integrado / publicado / revertido.
- **Cambios exactos:** ___
- **Archivos añadidos/modificados:** ___
- **Datos persistentes afectados (claves/migraciones):** ___
- **Pruebas ejecutadas y evidencia:** ___
- **Dispositivos y navegadores:** ___
- **Riesgos conocidos / pendiente:** ___
- **¿`main` intacta?:** sí/no y comprobación ___
- **Plan de reversión:** ___
