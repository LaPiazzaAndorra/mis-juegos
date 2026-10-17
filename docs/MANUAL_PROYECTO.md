# Manual del proyecto — Mi Mundo de Juegos

**Revisado:** 16/10/2026 contra el código de `main` (`4bbf51d`) y de `avatar-creador` (commit `f5689b3`).
**Se actualiza en cada paso relevante** (aprobaciones, pruebas, piezas nuevas): es la guía para seguir el proyecto.
**Propósito:** que el proyecto pueda continuar desde cualquier dispositivo, conversación o asistente.

## 1. Objetivo

Juego infantil creativo e interactivo, en castellano, pensado para iPhone y iPad y fácil de tocar
para una niña pequeña. Prioridades: interacción real, ilustración de calidad y guardado seguro de lo
que crea Amaia, por delante de pantallas solo decorativas.

## 2. Requisitos que no se negocian

- Conservar el diseño de menús aprobado: colores pastel, arcoíris, botones grandes e ilustraciones propias.
- La muñeca y las mascotas definitivas son ilustraciones propias, nunca emojis del sistema. Los
  juegos de pensar y las pegatinas de «Mi Mundo» todavía usan emojis: es el **estado actual**, y
  sustituirlos es un **objetivo futuro**.
- Ilustración de calidad, expresiones amables, pequeñas animaciones y refuerzo positivo; sin
  publicidad ni compras.
- Cambios graduales: comprobar que todo lo anterior sigue funcionando antes de publicar.
- No perder nunca estrellas, dibujos, láminas importadas, personaje, escenas, niveles, monedas ni
  ajustes. Si cambia un formato, se hace una migración probada.
- Los datos pertenecen al navegador del dispositivo. No hay sincronización entre dispositivos.
  Amaia juega desde la **app instalada** en el iPhone, cuyos datos iOS guarda aparte de Safari: la
  herramienta `herramientas/copia-de-seguridad.html` y su marcador **no llegan** a esos datos.
  La copia útil para Amaia es la de los botones «Guardar mi progreso» / «Recuperar mi progreso»
  dentro del juego (en ⚙️ Ajustes; integrados en `avatar-creador`, sin publicar todavía).
- Las pruebas en el iPhone se hacen en la **versión de pruebas** (otro origen, otra app «PRUEBAS» y
  datos ficticios): `docs/VERSION_DE_PRUEBAS.md`. Nunca en la app de Amaia.

## 3. Módulos del juego

| Apartado | Publicado en `main` (`4bbf51d`) | Además en `avatar-creador` (sin publicar) |
| --- | --- | --- |
| **Pintar** | Hoja en blanco (pincel, cubo, sellos, deshacer, borrar), láminas para colorear, importar láminas propias y galería «Mis dibujos». | Sin cambios. |
| **Heladería** | Pedidos de helados, monedas y estrellas. | Sin cambios. |
| **Vestir** | Muñeco sencillo (formas y emojis) guardado en la clave `doll`; foto a la galería. | Nuevo creador de avatar: muñeca vectorial de reserva y motor de muñeca ilustrada por capas PNG (premium, en desarrollo). Guardar y editar después (claves `avatar` y `avatar_draft`), parpadeo, saludo, salto con destellos y foto. |
| **Mi Mundo** | 6 escenarios (casa, parque, playa, mar, castillo, espacio) con pegatinas arrastrables. | Nueva **habitación** interactiva (escenario inicial) con el personaje guardado: caminar, dormir en la cama, pelota, lámpara y día/noche. |
| **Pensar** | Parejas, Contar, ¿Qué sigue?, Sombras y El diferente, con dificultad adaptable y estrellas. | Sin cambios. |
| **Ajustes** | Sonido, voz y tono; app instalable y con funcionamiento sin conexión (caché `mis-juegos-v3`). | «Guardar / Recuperar mi progreso» (copia dentro del juego); caché `mis-juegos-v9` y caché aparte para el arte del avatar. |

El estado detallado (lo probado y lo pendiente) está en `docs/ESTADO_ACTUAL.md`.

## 3 bis. La muñeca nueva: dónde estamos (16/10/2026)

Todo esto está en `avatar-creador`, **en propuestas** (`docs/propuestas/`): **no está en el juego de Amaia** ni en `main`.
El juego sigue usando la muñeca anterior (V2.1). Las decisiones completas están en `docs/DECISIONES.md`.

| Paso | Decisión | Estado |
| --- | --- | --- |
| Norma visual: nenita de 5–6 años con la cara elegida | D-012, D-013 | Permanente (`docs/NORMA_VISUAL_MUNECA.md`). |
| Base nueva aprobada (948 × 1659) | D-014 | Aprobada; copia con la transparencia corregida. |
| Ojos abiertos v3 (color experimental) y ojos cerrados V2.1 para el parpadeo | — | Candidatas en uso en el visor y en la prueba. |
| Pelo B, con «mechones completos» delante de los hombros | D-016 | Aprobado visualmente. |
| Vestido rosa de princesa (opción B, con las axilas completadas) | D-015, D-016 | Diseño y conjunto aprobados visualmente. |
| Zapatos rosa | D-017 | Diseño y encaje aprobados visualmente. |
| Corona dorada | D-018 | Diseño, encaje y conjunto completo aprobados visualmente. |
| **Prueba aislada del juego en el iPhone** (`docs/propuestas/prueba-juego-d016/`) | D-019 | **Aprobada por la propietaria en su iPhone.** Congelada como referencia (commit `22d96e9`). |
| Ojos azul, verde y lila de fantasía (solo cambia el color de los iris) | D-020 | **Variantes aprobadas visualmente**; marrones por defecto; integración en una copia nueva del juego. |
| Pintacaras «Estrellas y brillo» (capa aparte, solo los adornos) | D-021 | **Diseño y encaje aprobados visualmente**; se pone y se quita («Sin pintacaras» por defecto en el visor). |
| Pelo castaño chocolate, rubio miel, castaño oscuro y pelirrojo jengibre (solo cambia el color de nuestras capas) | D-022 | **Variantes aprobadas visualmente**; castaño original por defecto. Cejas a juego **aprobadas visualmente** (por defecto en el visor; se conservan las originales). |
| Piel claro (original), dorado, moreno y profundo (solo cambia la piel de nuestras piezas) | D-023 | **Tonos aprobados visualmente** (tras corregir el profundo); claro por defecto. |
| Peinado nuevo: coleta alta rizada con cinta deportiva lila (la melena suelta se conserva) | D-025 | **Peinado, encaje con cinta y coleta sin cinta aprobados visualmente** (se conservan las dos); melena por defecto; con y sin cinta en los 5 colores de pelo y los 4 tonos de piel, con cejas a juego, **aprobados visualmente** (17/10) en el visor; sin probar en el iPhone. |
| Accesorios de pelo (segunda colección: lazo, flores, mariposa, diadema, cinta, gorra, sombrero, gorrito) | D-024 | **Diseño aprobado**; lazo, flores y mariposa **aprobados visualmente** en el visor («Sin accesorio» por defecto); diadema **aprobada visualmente** en el visor; gorrito de dormir de frente: **diseño aprobado**, dos candidatos de encaje en el visor (A: asoma pelo arriba a la izquierda; B, 8 % más grande: cubre el pelo, cejas libres), pendientes de revisión; cinta, gorra y sombrero: guía para pedirlos de frente en ChatGPT. |
| **Prueba aislada nueva: piel, pelo, cejas, ojos y pintacaras** (`docs/propuestas/prueba-juego-d023/`) | D-023 | Preparada y probada en Chromium (18/18); **pendiente de probar en el iPhone**. Datos propios (`d023:`). |
| **Prueba aislada nueva: 4 colores de ojos + pintacaras** (`docs/propuestas/prueba-juego-d021/`) | D-021 | Preparada y probada en Chromium (19/19); **pendiente de probar en el iPhone**. Datos propios (`d021:`). |

**Siempre pendiente** hasta que se diga lo contrario:
- la resolución real de 2000 × 3500;
- pasar la muñeca nueva al juego principal (catálogo, `arte/originales/`, `optimizar.py`, versión de `sw.js`);
- variantes de la base (piel, peinados, ropa).

### Dónde revisar

- **Visor** (en Safari): <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/base-aprobada-d013-2026-10-14/visor/index.html>.
  Muestra el conjunto elegido por defecto y deja cambiar ropa, zapatos, corona, accesorio de pelo, peinado, pelo, color de pelo, cejas, piel, color de ojos y pintacaras, y probar el
  parpadeo y los encuadres.
- **Prueba del juego aprobada (D-019, fija):** <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/22d96e912412942abdb4733cff314250fd901f4a/docs/propuestas/prueba-juego-d016/index.html>.
  Tiene datos propios (`d016:`) y no toca las partidas.
- **Prueba nueva con los colores de ojos y el pintacaras (D-021):** <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d021/index.html>.
  Datos propios (`d021:`), aparte de las partidas y de la prueba D-019.
- **Prueba nueva con piel, pelo, cejas, ojos y pintacaras (D-023):** <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d023/index.html>.
  Datos propios (`d023:`), aparte de las partidas y de las pruebas D-016 y D-021.

### Cómo se trabaja con el arte (lo aprendido)

1. **Diseño y encaje se aprueban por separado.** Una imagen generada sirve como **referencia del diseño**; la pieza se
   aprueba después, sobre nuestra muñeca.
2. **Nunca se regenera ni se deforma la muñeca:** de una imagen generada se extrae solo la pieza (zapato, corona,
   mechón…) y se coloca sin escalar si es posible. Cualquier ajuste se documenta.
3. **Originales intactos:** cada imagen recibida se guarda tal cual, y cada cambio va en una copia con su programa
   reproducible y su `comprobaciones.json`.
4. **Retoques con ChatGPT:** se le da un recorte 2:3 con una máscara. Solo se integra la zona marcada, tras comprobar
   la alineación y que no queda fondo blanco. Si ChatGPT redibuja la zona de otra forma, se toma la pieza completa y se
   une por sombras naturales.
5. **Primero el visor, después el juego.** Las pruebas del juego van en **copias aisladas** con datos propios. Una
   prueba aprobada queda congelada, y cualquier cambio va en otra copia.
6. **Se registra solo lo que la propietaria confirma** (por ejemplo, D-019 no da por comprobados pasos que no detalló).

## 4. Arquitectura en pocas palabras

Aplicación web instalable (PWA) sin servidor propio: `index.html` contiene la interfaz y casi toda
la lógica; `avatar/` compone la muñeca; `manifest.json` la hace instalable y `sw.js` la deja
funcionar sin conexión. El arte original de la muñeca está en `arte/originales/` y
`herramientas/optimizar.py` lo convierte en las imágenes del juego (`avatar/arte/`). Los datos se
guardan en `localStorage` y las láminas importadas en IndexedDB. Detalle completo en
`docs/ARQUITECTURA_Y_DATOS.md`.

## 5. Cómo añadir una función

1. Anotarla en `docs/HOJA_DE_RUTA.md` como **Propuesta**, con criterios de aceptación.
2. Identificar los datos, archivos y funciones afectados, y escribir qué no puede romperse.
3. Trabajar en una rama; `main` solo cambia con aprobación.
4. Implementar solo lo acordado; si hay arte, por capas y validado.
5. Probar el flujo entero, incluida la persistencia tras recargar (`node pruebas/prueba-juego.js` más
   pruebas manuales en iPhone y iPad).
6. Enseñar el resultado a la propietaria y obtener su aprobación antes de activarlo por defecto.
7. Actualizar `docs/ESTADO_ACTUAL.md` y `docs/REGISTRO_CAMBIOS.md` **en el mismo commit**.
8. Solo con aprobación: pull request a `main`, comprobación de documentación, copia de seguridad de
   los datos de Amaia y prueba de la app instalada tras publicar.

## 6. Quién decide qué

- **Propietaria del proyecto:** estética, funciones, aceptación visual y publicación.
- **Asistente de código:** implementa, prueba, mantiene la compatibilidad, documenta y avisa de los límites.
- **Ilustración:** prepara el arte en alta resolución con las plantillas; una capa no es definitiva
  hasta pasar el validador y la aprobación visual.

## 7. Regla para no perder el hilo

En una conversación nueva no basta con decir «continúa». Hay que pedir: *«Abre `CLAUDE.md` y la
carpeta `docs/` de `LaPiazzaAndorra/mis-juegos`, confirma el último commit real y resume el estado
antes de cambiar archivos.»*
