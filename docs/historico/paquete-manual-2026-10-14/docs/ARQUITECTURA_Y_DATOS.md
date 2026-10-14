# Arquitectura, persistencia y compatibilidad

**Fuente:** inspección de copia del repositorio en `avatar-creador`, commit `8cef5dc` (13/10/2026). Verificar siempre contra la rama actual antes de cambiar nada.

## Estructura conocida

| Ruta | Función |
| --- | --- |
| `index.html` | Pantallas, estilos, navegación, pintar, galería, heladería, Mi Mundo y pensar. |
| `manifest.json` | PWA, iconos, orientación e instalación. |
| `sw.js` | Service worker y estrategias de caché. |
| `avatar/catalogo.js` | Avatar vectorial alternativo. |
| `avatar/catalogo-muneca.js` | Catálogo de piezas ilustradas y orden de dibujo. |
| `avatar/motor.js` | Composición del avatar, animación, guardado y recuperación. |
| `avatar/avatar.css` | Estilos del avatar y animaciones. |
| `arte/originales/` | PNG fuente por capas del personaje; algunos son recursos técnicos. |
| `avatar/arte/piezas.js` y `avatar/arte/{s,m}/` | Índice y WebP optimizados generados. |
| `plantilla/` | Coordenadas y guías del avatar; documentación de dibujo. |
| `herramientas/` | Comprobadores, optimizador y pruebas de piezas. |
| `docs/` | Manual vivo del proyecto (nuevo). |

## Datos del juego en `localStorage`

Claves comprobadas en la copia auditada. **No borrar ni renombrar sin plan de migración, pruebas de ida/vuelta y copia previa.**

| Clave | Información |
| --- | --- |
| `stars` | Contador de estrellas. |
| `gal` | Galería de dibujos y fotografías generadas. Puede consumir mucho espacio. |
| `sound`, `voice`, `tone` | Sonido y voz. |
| `iceServed`, `iceCoins` | Progreso de heladería. |
| `scKey`, `sc_<escenario>` | Escenario seleccionado y objetos colocados por escenario. |
| `mm_hab` | Habitación del avatar: posición, noche y lámpara. |
| `lv_<juego>` | Nivel de los juegos de pensar. |
| `avatar` | Avatar guardado, visible en «Mi Mundo». |
| `avatar_draft` | Estado editable provisional en «Vestir». |

**Otros formatos:** existían en versiones previas claves como `doll`; evitar eliminarlas a ciegas aunque no se lean en la versión auditada. Consultar historial antes de planificar migración.

**IndexedDB:** base `misjuegos`, almacén `tpl` con `id` y `url` para láminas importadas. No está incluida automáticamente en un respaldo solo de `localStorage`.

## Reglas de persistencia

- No cambiar IDs de ropa, peinados, ojos o escenarios si ya se han guardado con ellos; crear mapeo de IDs antiguos a nuevos si fuera inevitable.
- No borrar datos por falta de espacio sin aviso, copia o autorización: el código antiguo puede reducir el número de dibujos guardados cuando falla una escritura.
- Probar actualizar la app con datos precargados reales/imitados, sin perderlos.
- Abrir desde otra URL, dominio, navegador, dispositivo o modo privado puede hacer que los datos locales no estén disponibles.
- Nunca confundir **restaurar código con Git** con **restaurar datos personales guardados en Safari**.

## Caché y publicación

La copia auditada usa `sw.js` con cachés `mis-juegos-v5` y `mis-juegos-arte`, y recursos de avatar optimizados. La versión de caché puede haber cambiado. En actualizaciones de código, verificar invalidación de archivos, cachés obsoletas y navegación offline.

## Ejecución y comprobación

Desde la raíz del repositorio, servir archivos con un servidor HTTP local y abrir desde navegador (algunas funciones/cachés no sirven abriendo `file://`). Por ejemplo:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. Para probar en iPhone/iPad usar una dirección HTTPS de prueba adecuada o una URL de la misma red si está disponible; **no publicar ni cambiar `main` para probar**.

## Riesgos que requieren atención especial

1. Espacio de `localStorage` y errores silenciosos de guardado.
2. Cache del service worker mostrando recursos anteriores.
3. Modos horizontal/vertical cortando escenario o avatar.
4. PNG con poca resolución, transparencia residual o capas desalineadas.
5. Mezcla de ramas, subidas manuales y fuentes más recientes fuera de Git.
