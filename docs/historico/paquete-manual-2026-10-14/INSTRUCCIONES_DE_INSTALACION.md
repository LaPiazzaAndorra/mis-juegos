# Cómo integrar este paquete sin perder trabajo de Claude

**ATENCIÓN:** este ZIP NO se ha subido automáticamente a GitHub y puede haber documentación/código nuevos en la rama actual. NO sustituir archivos existentes de manera masiva.

1. Claude abre `LaPiazzaAndorra/mis-juegos` y comprueba el remoto, ramas, estado y el último commit REAL de `avatar-creador`. Confirma que no está tocando `la-piazza-gestio`.
2. Compara este paquete con cualquier README, CLAUDE.md, `docs/` o `.github/` que ya existan. Si hay archivos equivalentes, **fusiona** contenidos; no sobrescribe versiones recientes.
3. Compara las afirmaciones de `docs/ESTADO_ACTUAL.md` con el código y los últimos commits; actualiza el documento con lo verdaderamente implementado y con las capturas nuevas, especialmente el estado de pelo/validador.
4. Aplica en `avatar-creador` los archivos de documentación. No modificar la lógica del juego, recursos premium ni `main` por incorporar el manual.
5. Verifica enlaces Markdown y comprueba sintaxis del script de documentación; valida el nuevo workflow si decides incorporarlo.
6. Crea commit exclusivo de documentación, registra hash remoto real y comunícalo junto a una lista de archivos creados. No fusionar sin autorización.
7. Después, **cada cambio funcional** actualizará `docs/ESTADO_ACTUAL.md` y `docs/REGISTRO_CAMBIOS.md` en el mismo commit. Se recomienda proteger `main` para exigir PR y comprobación `Documentacion sincronizada` como estado obligatorio.
8. **La Action controla PR, no actualiza documentos por sí misma**; el programador debe escribir el contenido. Los cambios directos por la web pueden eludir el requisito si no hay protección de rama.
9. GitHub no guarda los progresos del Safari. Implementar y verificar exportación/importación de datos antes de dar por resuelta esa parte.

**Nota técnica:** esta documentación se preparó revisando una copia local del commit `8cef5dc` y capturas de Claude más recientes. El repo remoto no estaba accesible desde esta sesión; Claude debe confirmar lo que hay en GitHub.
