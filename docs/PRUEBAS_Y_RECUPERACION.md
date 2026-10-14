# Pruebas, copias de seguridad y recuperación

## A. Pruebas en cada cambio

**Automática** (desde la raíz del repositorio):

```bash
python3 -m http.server 8765 &
node pruebas/prueba-juego.js        # termina con «✅ 21/21 comprobaciones correctas»
```

Comprueba en tamaño iPad (1180 × 820) e iPhone horizontal (852 × 393): que el juego abre,
«Vestir» (guardar y recuperar tras recargar), «Mi Mundo» (habitación, personaje, cama), que los
datos antiguos simulados no se pierden, la muñeca vectorial, la muñeca premium en borrador con
parpadeo y la copia de seguridad (copiar, borrar, restaurar). Necesita Node y Playwright con
Chromium.

**Manual** (marcar y anotar dispositivo, navegador, rama y commit; una captura bonita no sustituye las pruebas):

- [ ] Navegación: inicio → pintar / jugar a ser / pensar → volver, sin cortes en iPhone vertical.
- [ ] Pintar: hoja nueva, pincel, cubo, deshacer, borrar, guardar; recargar; abrir el dibujo desde la galería.
- [ ] Láminas: colorear, importar una lámina propia, recargar y ver que sigue; borrar solo con confirmación.
- [ ] Vestir: cambiar todo lo disponible, guardar, salir, volver y editar sin perder nada.
- [ ] Avatar: ojos abiertos, parpadeo, dormir y despertar sin que se quede con los ojos cerrados.
- [ ] Mi Mundo: caminar, cama, día/noche, lámpara, pelota; iPhone horizontal y vertical, iPad vertical y horizontal.
- [ ] Heladería: completar un pedido; monedas y estrellas tras recargar.
- [ ] Pensar: los cinco juegos; nivel y estrellas tras recargar.
- [ ] Ajustes: sonido y voz se conservan.
- [ ] Sin conexión: la app instalada abre sin red y muestra la versión nueva (no la anterior).
- [ ] Datos existentes: probar con un navegador que tenga progreso antiguo y comprobar que no se pierde.
- [ ] En un iPhone y un iPad reales cuando sea posible; si solo se ha simulado, anotarlo.
- [ ] Actualizar `docs/ESTADO_ACTUAL.md` y `docs/REGISTRO_CAMBIOS.md`.

## B. Lo que GitHub NO guarda

Las estrellas (`stars`), los dibujos (`gal`), el personaje (`avatar`), las escenas, los niveles, las
monedas, los ajustes y las láminas importadas (IndexedDB `misjuegos`) viven **en el navegador del
dispositivo donde se juega**. Desinstalar la app, «Borrar historial y datos», cambiar de navegador o
de dirección puede hacerlos inaccesibles, y Git no los recupera.

## C. Copia de seguridad de los datos de Amaia

> **Importante (14/10/2026):** Amaia juega desde la **app instalada** en el iPhone. iOS guarda los
> datos de la app instalada **aparte** de los de Safari, aunque la dirección sea la misma. Por eso la
> herramienta de abajo y su marcador, abiertos en Safari, **no ven ni pueden restaurar** el progreso de
> la app instalada. Para la app instalada hace falta la copia **dentro del juego** (apartado C2).
> La herramienta sigue sirviendo para un navegador normal (ordenador, Safari) y sus archivos son
> compatibles con los de la copia integrada.

Herramienta: **`herramientas/copia-de-seguridad.html`** (no modifica el juego).

- **Qué guarda:** todas las claves del juego (`stars`, `gal`, `sound`, `voice`, `tone`,
  `iceServed`, `iceCoins`, `scKey`, `sc_*`, `lv_*`, `mm_hab`, `avatar`, `avatar_draft`, `doll`) y
  las láminas importadas de IndexedDB. Las claves de otras aplicaciones del mismo sitio no se copian.
- **Formato del archivo:** `{"format":"mi-mundo-juegos-respaldo","schema_version":1,"exported_at":…,"origen":…,"local_storage":{…},"indexeddb":{"misjuegos":{"tpl":[…]}}}`.
- **Restaurar:** enseña qué hay en el archivo comparado con lo que hay ahora y pide confirmación.
  **Antes de restaurar descarga una copia de lo actual.** Solo sustituye lo que viene en el archivo
  (lo demás no se toca) y las láminas se añaden o actualizan.
- **Probado:** de principio a fin en Chromium (copiar, borrar todo, restaurar y comprobar que el
  juego lee las estrellas). **Falta probarlo en el iPad y el iPhone reales.**

**Dónde abrirla (solo para datos de un navegador, no de la app instalada).** Los datos son de un sitio web concreto, así que la herramienta tiene que abrirse
desde **el mismo sitio** que el juego. Por ejemplo, si el juego está en
`https://lapiazzaandorra.github.io/mis-juegos/`, la herramienta estará en
`https://lapiazzaandorra.github.io/mis-juegos/herramientas/copia-de-seguridad.html` cuando se
publique. Hasta entonces, se usa el **marcador**:

1. En Safari, añadir cualquier página a Favoritos.
2. Abrir `copia-de-seguridad.html` (desde un ordenador vale), copiar el texto del cuadro
   «Marcador» y ponerlo como dirección de ese favorito.
3. Abrir el juego en el iPad o iPhone de Amaia y tocar el favorito: descarga
   `mi-mundo-copia-AAAA-MM-DD-HH-MM.json`. Solo lee: no cambia nada.

**Rutina recomendada:**

- Hacer copia **antes de cada publicación** y, como costumbre, una vez por semana.
- Guardar el archivo en Archivos o iCloud y conservar las 3 últimas.
- **Nunca subir copias de datos al repositorio**, que es público.
- Las pruebas que borran datos se hacen solo en otro navegador o dispositivo, nunca en el de Amaia.

## C2. Copia integrada en el juego: «Guardar mi progreso» y «Recuperar mi progreso»

**Estado:** propuesta preparada y probada en simulación, **no integrada** (espera la aprobación de la
propietaria). Código completo en `docs/propuestas/copia-integrada.patch`; capturas en
`docs/capturas/2026-10-14-copia/`.

- **Dónde:** en ⚙️ Ajustes (zona de adultos), sección «💾 Copia de seguridad».
- **Guardar mi progreso:** crea `Mi-Mundo-progreso-AAAA-MM-DD.json` con todas las claves del juego y
  las láminas importadas (mismo formato que la herramienta) y abre la hoja de compartir de iOS →
  **«Guardar en Archivos»** → iCloud Drive. Si el dispositivo no permite compartir, se descarga.
  La copia se prepara al abrir los ajustes, para que la hoja se abra al primer toque (Safari solo
  permite abrirla justo después de tocar).
- **Recuperar mi progreso:** abre Archivos, comprueba el archivo (rechaza archivos de otro tipo,
  dañados o de una versión más nueva) y enseña una tabla «En la copia / Ahora» antes de confirmar.
- **Antes de recuperar** guarda automáticamente lo actual dentro de la app (IndexedDB
  `misjuegos-copias`); si no puede guardarlo, no recupera nada. Si algo falla a mitad (por ejemplo,
  falta de espacio), vuelve solo a como estaba. Después aparece «↩️ Deshacer la última recuperación».
- Solo toca claves del juego; las láminas que ya había se conservan.

**Cómo aplicarla, cuando se apruebe:** `git apply docs/propuestas/copia-integrada.patch` en
`avatar-creador` (sube la caché a `v9`), `node pruebas/prueba-copia.js` y `node pruebas/prueba-juego.js`.

**Prueba obligatoria en la app instalada del iPhone** (no se puede hacer desde el entorno de Claude),
**nunca primero en el iPhone de Amaia**: instalar la versión de prueba en otro iPhone (o en otro perfil
o dirección, para no mezclar datos) desde «Compartir → Añadir a pantalla de inicio», abrirla desde el
icono y comprobar: guardar → «Guardar en Archivos» → el archivo aparece en iCloud Drive; jugar un poco;
recuperar → la tabla es correcta → los datos vuelven; «Deshacer»; sin conexión, la app abre y los
botones funcionan. Cuando todo pase, en el iPhone de Amaia lo primero será **guardar** (no recuperar).

## D. Recuperar el código

1. Mirar el último commit estable aprobado en `docs/ESTADO_ACTUAL.md`. La versión publicada el
   11/10/2026 es el commit `4bbf51d` de `main`. Para marcarla con una etiqueta permanente (el entorno
   de Claude no puede crear etiquetas): GitHub → **Releases → Draft a new release → Choose a tag** →
   escribir `publicado-2026-10-11` → **Target: main** → publicar. Cada publicación futura debería
   llevar su etiqueta `publicado-AAAA-MM-DD`.
2. Antes de revertir: hacer copia de los datos del juego (apartado C) y anotar el estado de la rama.
3. Crear una rama de recuperación desde el commit sano: `git switch -c recuperacion <commit>`.
   **Nunca `git push --force` a `main`.**
4. Volver atrás con `git revert` y un pull request revisado; probar caché y datos.
5. Anotar el incidente, su causa y la corrección en `docs/REGISTRO_CAMBIOS.md`.

## E. No confundir

- «Abre en el simulador» ≠ «funciona en la app instalada».
- «Guarda estrellas» ≠ «hay copia de seguridad de todo».
- «Está en una rama» ≠ «está publicado para Amaia».
- «La imagen mide 2000 × 3500» ≠ «tiene detalle real a esa resolución».

## F. Exigir la comprobación de documentación en `main`

La comprobación ya está configurada: `.github/workflows/verificar-documentacion.yml` se ejecuta en
cada pull request, con el nombre **«Documentación sincronizada»**. **Para que sea obligatoria** falta
(lo hace una persona con permisos de administración del repositorio):

1. Que la comprobación haya corrido al menos una vez: abrir un pull request (puede ser en borrador)
   desde `avatar-creador` hacia `main`. Así aparece en la lista de comprobaciones. No hace falta fusionarlo.
2. GitHub → repositorio → **Settings → Branches → Add branch protection rule** (o **Rules → Rulesets**),
   con el patrón `main`:
   - **Require a pull request before merging** (opcional: 1 aprobación).
   - **Require status checks to pass** → buscar y marcar **«Documentación sincronizada»**;
     marcar también «Require branches to be up to date».
   - **Do not allow bypassing the above settings** / «Include administrators»: sin esto, la propietaria
     y las apps con permisos podrían seguir subiendo directamente.
   - Dejar sin marcar «Allow force pushes» y «Allow deletions».
3. A partir de entonces, «Add files via upload» directamente en `main` quedará bloqueado: los
   cambios tendrán que llegar por pull request.

La comprobación revisa que estén actualizados el estado y el registro de cambios, y la versión de la
caché. **No escribe la documentación ni sustituye las pruebas** ni la aprobación de la propietaria.
