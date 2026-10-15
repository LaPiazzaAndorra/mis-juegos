# Arquitectura, datos guardados y compatibilidad

**Comprobado contra el código de `avatar-creador` el 14/10/2026.** Volver a comprobarlo antes de
cambiar nada importante.

## Archivos

| Ruta | Función |
| --- | --- |
| `index.html` | Pantallas, estilos, navegación, pintar, galería, heladería, Vestir, Mi Mundo (habitación incluida), pensar y ajustes. |
| `manifest.json` | Instalación como app (nombre, iconos, orientación). |
| `progreso.js` | «Guardar mi progreso» / «Recuperar mi progreso»: crear, comprobar, compartir y recuperar copias; copia automática previa y deshacer; datos ficticios (solo en la versión de pruebas). |
| `manifest-pruebas.json`, `icon-pruebas-192.png`, `icon-pruebas-512.png` | Identidad de la **versión de pruebas** («PRUEBAS», icono verde). Solo se usan en las direcciones de prueba (`window.MODO_PRUEBAS`, script al principio de `index.html`). |
| `sw.js` | Funcionamiento sin conexión: caché `mis-juegos-vN` (código, lista `FILES`) y caché `mis-juegos-arte` (imágenes del avatar). |
| `avatar/motor.js` | Compone el avatar por capas, lo anima, lo guarda y lo recupera. Elige el juego de piezas. |
| `avatar/catalogo-muneca.js` | Catálogos de la muñeca ilustrada: `premium`, `prueba` y `demo`. Qué pieza va en cada capa. |
| `avatar/catalogo.js` | Muñeca vectorial de reserva (primera prueba). |
| `avatar/avatar.css` | Animaciones del avatar (parpadeo, saludo, salto, paso, ojos cerrados). |
| `avatar/arte/piezas.js`, `avatar/arte/s/`, `avatar/arte/m/` | Generados por `herramientas/optimizar.py`: índice y WebP al 30 % y al 50 %, con huella en el nombre. **No editar a mano.** |
| `arte/originales/` | PNG originales de 2000 × 3500 por capas. Los que empiezan por `prueba-` son piezas técnicas; `demo-diario.png` es la demostración de calidad. |
| `arte/mascaras/` | Máscaras auxiliares (iris); no van al juego. |
| `plantilla/` | `plantilla.js` (medidas de la base, fuente única), láminas y guías por pieza, `ASSETS.md`, `PELO.md`, `INSTRUCCIONES.md`. |
| `herramientas/` | Comprobador de capas, validador de pelo, optimizador, medidor de la base, guías, variantes de color, corrección técnica de transparencia (`corregir_transparencia.py`), copia de seguridad y comprobación de documentación. |
| `pruebas/` | Pruebas automáticas: regresión (`prueba-juego.js`) y copia de seguridad / versión de pruebas (`prueba-copia.js`). |
| `docs/` | Documentación del proyecto; `docs/historico/` guarda versiones anteriores; `docs/capturas/`, capturas de prueba. |
| `.github/` | Plantilla de pull request y comprobación automática de documentación. |

## Qué muñeca se ve (`avatar/motor.js`)

- **Juego normal:** se usa el catálogo `premium` en cuanto tiene al menos una piel, unos ojos, un
  peinado y una ropa con todas sus piezas. Mientras no, se usa `prueba` (la muñeca vectorial
  convertida en capas PNG). Si no hubiera piezas PNG, se usa la muñeca vectorial.
- **Parámetros para revisar** (añadidos a la dirección del juego):
  - `?arte=borrador`: muñeca premium con las piezas que haya, aunque falten otras;
  - `?arte=prueba`: las piezas técnicas;
  - `?arte=demo`: la demostración de calidad;
  - `?arte=svg`: la muñeca vectorial.
- Una opción del catálogo solo aparece si existen todas sus piezas; las que empiezan por `?` son opcionales.

## Datos guardados en `localStorage`

**No borrar ni renombrar sin migración, prueba de ida y vuelta y copia previa.**

| Clave | Contenido | Desde |
| --- | --- | --- |
| `stars` | Contador de estrellas. | `main` |
| `gal` | Galería: dibujos y fotos en `data:` (puede ocupar mucho). | `main` |
| `sound`, `voice`, `tone` | Sonido, voz elegida y tono. | `main` |
| `iceServed`, `iceCoins` | Heladería: helados servidos y monedas. | `main` |
| `scKey`, `sc_<escenario>` | Escenario elegido y pegatinas colocadas en cada uno. | `main` |
| `lv_<juego>` | Nivel de cada juego de pensar. | `main` |
| `doll` | Muñeco antiguo de «Vestir». En la rama ya no se escribe; solo se lee una vez para dar al avatar nuevo el mismo tono de piel y color de pelo. **No borrar.** | `main` |
| `avatar` | Personaje guardado (el de «Mi Mundo»): `{v, piel, ojos, pelo, ropa, zapatos, accesorios, guardado}`, con identificadores del catálogo. | `avatar-creador` |
| `avatar_draft` | Cambios en curso de «Vestir». | `avatar-creador` |
| `mm_hab` | Habitación: posición del personaje, noche y lámpara. | `avatar-creador` |

**IndexedDB:** base `misjuegos`, versión 1, almacén `tpl` (`{id, url}`) con las láminas importadas en «Pintar».

**Con la copia integrada** (en `avatar-creador`, sin publicar): clave nueva `bk_ultima` (fecha de la
última copia, solo informativa; no va en las copias) y base nueva `misjuegos-copias` (almacén `copias`,
entrada `antes-de-recuperar`) con la copia automática de los datos anteriores a la última recuperación.
No cambian ni borran ninguna clave existente. Formato del archivo: el de
`docs/PRUEBAS_Y_RECUPERACION.md` (apartado C); las copias hechas en la versión de pruebas llevan además
`"version_pruebas": true` y el juego normal las rechaza.

**Prueba aislada D-016** (`docs/propuestas/prueba-juego-d016/`, sin publicar): sus claves llevan el prefijo `d016:` en
`localStorage` y sus bases, `d016-` en IndexedDB (`aislamiento.js`). No lee, cambia ni migra ninguna clave del juego,
y el código y el guardado del juego no cambian.

**App instalada en iOS:** sus datos están separados de los de Safari, aunque la dirección sea la misma.

## Reglas de persistencia

- Los identificadores de piel, ojos, peinado, color de pelo, ropa, zapatos y accesorios no se
  cambian. Si fuera inevitable, se hace una tabla de equivalencias. `Avatar.normalizar()` sustituye
  los identificadores desconocidos por los valores por defecto.
- Probar cada actualización con datos antiguos precargados (`pruebas/prueba-juego.js` lo hace).
- Los datos dependen del navegador y de la dirección del sitio: otra dirección, otro navegador, el
  modo privado o «Borrar datos de sitios web» los dejan inaccesibles.
- Restaurar código con Git **no** restaura datos del navegador.

## Caché y publicación

- Si cambia cualquier archivo de la lista `FILES` de `sw.js`, hay que subir la versión
  `const C='mis-juegos-vN'` (lo comprueba `herramientas/verificar_documentacion.py`).
- El arte del avatar lleva una huella en el nombre del archivo y se guarda en su propia caché,
  así que no necesita subir la versión.
- Dirección pública del juego: **por confirmar** (seguramente GitHub Pages desde `main`; desde este
  entorno no se pudo comprobar).

## Ejecución local

```bash
python3 -m http.server 8765          # desde la raíz del repositorio
# abrir http://localhost:8765/  (y http://localhost:8765/index.html?arte=borrador)
```

Abriendo `index.html` directamente como archivo, algunas funciones (caché, imágenes) no van.

## Riesgos conocidos

1. **La galería borra dibujos antiguos sin avisar si no hay espacio** (`addToGallery` en
   `index.html`: quita los más antiguos hasta que cabe el nuevo y muestra «¡Guardado!»). Ocurre
   también en `main`. Pendiente de corregir, con aprobación.
2. Sin probar todavía en un iPhone o iPad reales ni con la app instalada sin conexión: las pruebas
   se han hecho en Chromium con tamaños de pantalla simulados.
3. Una caché antigua puede mostrar archivos viejos si alguien olvida subir la versión de `sw.js`.
4. En el iPhone en horizontal, la habitación se ve entera pero el personaje queda pequeño.
5. Arte con poca resolución, transparencia sucia o desalineado (lo detectan el comprobador y el validador).
6. Cambios subidos a `main` desde la web de GitHub («Add files via upload») se saltan las
   comprobaciones mientras `main` no esté protegida.
