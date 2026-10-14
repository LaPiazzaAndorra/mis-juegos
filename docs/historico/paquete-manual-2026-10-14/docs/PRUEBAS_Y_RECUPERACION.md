# Pruebas, protección de datos y recuperación

## A. Pruebas mínimas en cada cambio de código

Marcar cada casilla y anotar dispositivo, navegador, rama y commit. Una captura bonita **no sustituye** estas pruebas.

- [ ] Navegación: inicio → pintar / jugar a ser / pensar → volver. Diseño sin cortes en iPhone vertical.
- [ ] Pintar: hoja nueva, pincel, cubo, borrar/deshacer, guardar; recargar; abrir dibujo desde galería.
- [ ] Plantillas: colorear zonas de láminas conocidas, importar una lámina, recargar y comprobar que persiste, eliminar solo con confirmación.
- [ ] Vestir: cambiar piel, ojos, pelo, ropa y accesorios disponibles; guardar, salir, volver y editar sin perder la elección.
- [ ] Avatar: ojos abiertos, parpadeo, ojos cerrados, dormir y despertar; sin párpados atascados.
- [ ] Mi Mundo: avatar guardado, caminar, cama, noche/día y lámpara; iPhone horizontal sin truncar suelo, iPad vertical/horizontal.
- [ ] Heladería: completar un pedido, monedas y estrellas persistentes después de recargar.
- [ ] Pensar: Parejas, Contar, ¿Qué sigue?, Sombras y El diferente; dificultad y estrellas persistentes.
- [ ] Ajustes: sonido y voz conservados.
- [ ] Offline: versión instalada abre sin red y utiliza piezas de avatar recién publicadas (sin mostrar arte obsoleto).
- [ ] Datos existentes: repetir pruebas con un navegador de prueba que contenga progreso antiguo y comprobar que no se borra.
- [ ] Probar en iPhone real y en iPad real cuando sea posible. Si solo hay emulador, anotarlo.
- [ ] Actualizar `docs/ESTADO_ACTUAL.md`, `docs/REGISTRO_CAMBIOS.md` y otras fichas afectadas.

## B. Datos que NO guarda GitHub

Los dibujos de la galería (`gal`), estrellas (`stars`), personaje (`avatar`), configuraciones, monedas, niveles, escenas y láminas importadas (`IndexedDB`) suelen vivir en **el Safari/navegador donde se juega**. Cambiar de navegador, borrar datos del sitio, desinstalar la app o cambiar de URL puede hacerlos inaccesibles. Una copia del código en GitHub **no los recupera**.

## C. Sistema de respaldo recomendado

**Prioridad alta pendiente de validar en la rama actual:** diseñar una función dentro del juego «Exportar mis progresos» / «Importar mis progresos», con confirmación, para `localStorage` y `IndexedDB`, incluyendo un esquema versionado. No dar esta función por disponible hasta probarla.

Formato de exportación propuesto (NO sustituye código existente hasta aprobar migración):

```json
{
  "format": "mi-mundo-juegos-respaldo",
  "schema_version": 1,
  "exported_at": "AAAA-MM-DDTHH:mm:ssZ",
  "app_version": "SHA_DE_COMMIT",
  "local_storage": { "stars": 0 },
  "indexeddb": { "misjuegos": { "tpl": [] } }
}
```

Requisitos: no exponer datos en repositorios públicos; límites de tamaño y validación antes de importar; previsualización del contenido; no sobrescribir automáticamente; opción de restaurar a prueba y deshacer; incluir fotos/dibujos y plantillas, no solo contadores.

Hasta que esto exista: **no borrar datos de Safari ni reinstalar la PWA del dispositivo principal para probar**. Hacer las pruebas destructivas solo en otro dispositivo, navegador o perfil de pruebas. Guardar copias exportadas si ya existe una función probada en la versión remota; verificar qué incluye exactamente.

## D. Recuperación del código

1. Anotar último commit estable aprobado (`docs/ESTADO_ACTUAL.md`).
2. Antes de revertir: copiar datos del navegador y guardar el estado de la rama actual.
3. Desde GitHub, localizar el commit sano y revisar el diff; crear nueva rama de recuperación, **no hacer force push a `main`**.
4. Volver al commit seguro mediante revert/redeploy revisado; probar caché y datos locales.
5. Registrar incidente, origen y corrección en `REGISTRO_CAMBIOS.md`.

## E. Pruebas que no hay que confundir

- «Abre en el emulador» ≠ «funciona en la PWA instalada».
- «Guarda estrellas» ≠ «exporta todos los datos».
- «Lo he subido a una rama» ≠ «está publicado para Amaia».
- «La imagen mide 2000 × 3500» ≠ «tiene detalle nativo a esa resolución».
