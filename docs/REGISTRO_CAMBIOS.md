# Registro de cambios

**Norma:** cada cambio de código o arte va acompañado, en el mismo commit, de una entrada aquí
(`### AAAA-MM-DD — título`) y de la actualización de `docs/ESTADO_ACTUAL.md`. Lo comprueba
`herramientas/verificar_documentacion.py`. Las entradas más nuevas van arriba. El hash de un commit no
puede ir dentro de él mismo: se escribe «este commit» y se completa en la entrada siguiente.

### 2026-10-14 — Documentación permanente, copia de seguridad y prueba automática

- **Solicitado por:** la propietaria (paquete «Manual para GitHub»).
- **Rama y commit:** `avatar-creador`, este commit (sobre `b266e52`).
- **Estado:** en la rama, sin publicar.
- **Cambios:**
  - Documentación del paquete incorporada y corregida contra el código: módulos de `main` frente a
    la rama, caché `v8`, `doll` solo se lee, nombres reales de las guías del pelo, estado de cada pieza
    y criterio de activación de la muñeca premium. Dos riesgos nuevos documentados: la galería borra
    dibujos al faltar espacio y la dirección pública está por confirmar.
  - El paquete original se guarda sin cambios en `docs/historico/paquete-manual-2026-10-14/`.
  - Nuevos: `herramientas/copia-de-seguridad.html` (copiar y restaurar datos, con marcador para
    Safari) y `pruebas/prueba-juego.js` (21 comprobaciones).
  - Comprobación de documentación ampliada: entrada fechada obligatoria y versión de la caché.
    Workflow `.github/workflows/verificar-documentacion.yml` y plantilla de pull request.
  - Las capturas que se colaron en la raíz en `8cef5dc` se mueven a `docs/capturas/2026-10-13/`.
  - Etiqueta `publicado-2026-10-11` en `4bbf51d` (versión publicada de `main`).
- **Archivos:** `CLAUDE.md`, `README.md`, `docs/*.md`, `docs/historico/`, `docs/capturas/`, `.github/`,
  `herramientas/copia-de-seguridad.html`, `herramientas/verificar_documentacion.py`,
  `pruebas/prueba-juego.js`, `.gitignore`.
- **Datos guardados afectados:** ninguno (el juego no cambia; la copia de seguridad solo lee y,
  al restaurar, escribe las claves del archivo tras confirmación y copia previa).
- **Pruebas:** `node pruebas/prueba-juego.js` 21/21 en Chromium (iPad 1180 × 820 e iPhone
  852 × 393); copia de seguridad de ida y vuelta, incluido el marcador; comprobador de documentación
  con 4 rangos de commits; enlaces Markdown revisados.
- **Pendiente:** probar en iPhone y iPad reales; ver correr el workflow en un pull request; proteger `main`.
- **¿`main` intacta?:** sí (`4bbf51d`, comprobado con `git ls-remote`).
- **Cómo revertir:** `git revert` de este commit (solo documentación y herramientas).

### 2026-10-14 — `b266e52` · Plantillas y vista de validación para el pelo rizado castaño
Plantillas `plantilla/guias/plantilla-pelo-detras.png` y `…-delante.png` (`guias_pelo.py`),
validador `herramientas/validar-pelo.html` (más versión autónoma), `plantilla/PELO.md`. El pelo del
primer borrador **no** se incluye. Probado con el borrador (8 errores detectados) y con la calibración de nitidez.

### 2026-10-13 — `7890d1c` · Ojos premium: marrones, azules y ojos cerrados alineados
`ojos-marron.png` al 100 % de opacidad, `ojos-cerrados-clara.png` corregido, `ojos-azul.png`
automático con máscara del iris; `variantes.py cerrados`; el comprobador compara ojos cerrados y
abiertos. Caché v8. Probado en «Vestir» y «Mi Mundo» (iPhone e iPad simulados).

### 2026-10-13 — `1c0dd5d` · Ojos premium: parpadeo, máscara del iris automática y correcciones
Los ojos abiertos se ocultan al parpadear o dormir; arreglado un fallo por el que se quedaba con los
ojos cerrados al redibujar; la expresión «feliz» ya no oculta los ojos; `variantes.py mascara`.

### 2026-10-13 — `b534d9b` · Plantilla definitiva con la base premium V2.1 aprobada
`arte/originales/base-clara.png` V2.1; `plantilla.js` v2 con sus medidas; láminas y guías por pieza
regeneradas. Caché v7.

### 2026-10-13 — `7ec5bfb` · Herramientas para crear las capas de la muñeca premium
`medir_base.py`, `guias.py`, `variantes.py` (piel e iris); aviso de opacidad en el comprobador;
`?arte=borrador`; encuadres calculados desde la plantilla. Caché v6.

### 2026-10-13 — `40c77f0` · Mi Mundo: habitación completa en pantallas muy apaisadas
En el iPhone horizontal la habitación se recortaba; ahora se ve entera.

### 2026-10-13 — `a6140b2` · Usar la muñeca premium solo cuando tenga base, ojos, pelo y ropa
Cambió `avatar/motor.js` **sin subir la versión de la caché** (corregido después por `7ec5bfb`, v6).

### 2026-10-13 — `4de36fb` · Preparar la muñeca premium y demostración de calidad
Catálogos `premium` / `prueba` / `demo`; piezas técnicas renombradas con `prueba-`; zapatos y
accesorios como capas; pestañas «Zapatos» y «Adornos»; `plantilla/ASSETS.md`.

### 2026-10-13 — `8cef5dc` · Plantilla de la muñeca y circuito de capas PNG
Plantilla 2000 × 3500, comprobador de capas, optimizador WebP, motor con capas PNG. **Incluyó por
error capturas de prueba en la raíz** (movidas a `docs/capturas/2026-10-13/` el 14/10).

### 2026-10-13 — `53f8e32` · Prueba del nuevo creador de avatar y habitación en Mi Mundo
Nuevo «Vestir» (muñeca vectorial por capas, guardado `avatar` y `avatar_draft`) y habitación
interactiva (`mm_hab`). Caché v4.

### 2026-10-10 / 11 — `2e49312` … `4bbf51d` · Versión publicada en `main`
Subidas desde la web de GitHub («Add files via upload»): juego completo, estilo pastel «fase 1»
(`e9560b7`), caché v3 (`4bbf51d`). Etiqueta `publicado-2026-10-11`.

## Plantilla obligatoria (copiar para cada tarea)

```
### AAAA-MM-DD — Título claro

- **Solicitado por:** ___
- **Rama y commit:** ___
- **Estado:** en prueba / aprobado / integrado / publicado / revertido
- **Cambios:** ___
- **Archivos:** ___
- **Datos guardados afectados (claves, migraciones):** ___
- **Pruebas y evidencia (dispositivos y navegadores):** ___
- **Riesgos conocidos y pendiente:** ___
- **¿`main` intacta?:** sí / no, y cómo se ha comprobado
- **Cómo revertir:** ___
```
