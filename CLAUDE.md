# Instrucciones permanentes para Claude, ChatGPT o cualquier asistente de código

Protocolo obligatorio del proyecto **Mi Mundo de Juegos**. No sustituye las instrucciones de la
propietaria ni el código real: si algo de aquí contradice el código, manda el código y hay que
corregir la documentación.

## 1. Antes de trabajar (en cada sesión, siempre)

1. Confirmar el repositorio: **`LaPiazzaAndorra/mis-juegos`**. Nunca tocar `LaPiazzaAndorra/la-piazza-gestio` para tareas del juego.
2. Comprobar el estado real (no fiarse de la memoria de una conversación):
   ```bash
   git fetch origin
   git status -sb
   git log --oneline -8 origin/avatar-creador
   git ls-remote origin            # ramas y commits que hay de verdad en GitHub
   ```
   No afirmar que se tiene permiso de escritura hasta haberlo probado con un `git push`.
3. Leer enteros: `README.md`, `docs/ESTADO_ACTUAL.md`, `docs/DECISIONES.md`, las últimas
   entradas de `docs/REGISTRO_CAMBIOS.md` y el documento técnico de la tarea
   (`docs/ARQUITECTURA_Y_DATOS.md`, `docs/AVATAR_Y_ASSETS.md`, `plantilla/PELO.md`…); para la muñeca,
   siempre [`docs/NORMA_VISUAL_MUNECA.md`](docs/NORMA_VISUAL_MUNECA.md).
4. Comparar la documentación con el código y con los últimos commits; si no coinciden, decirlo y corregirlo.
5. Antes de cambiar nada, resumir a la propietaria: último commit real, estado, objetivo, riesgos,
   pruebas previstas y archivos que se van a tocar.
6. **`main` no se toca** sin aprobación expresa de la propietaria. Se trabaja en una rama
   (la del avatar es `avatar-creador`). No abrir pull requests si no se piden.

## 2. Durante cada cambio

- No quitar ni romper funciones existentes: pintar, plantillas e importación de láminas, galería,
  heladería, Vestir, Mi Mundo, juegos de pensar, ajustes, sonido, voz, estrellas y progreso.
- No borrar, renombrar ni reiniciar claves de `localStorage` ni la base IndexedDB `misjuegos`
  (lista en `docs/ARQUITECTURA_Y_DATOS.md`) sin una migración probada y una copia previa.
- Mantener los identificadores del catálogo del avatar (los personajes guardados los usan).
- **Toda pieza o imagen de la muñeca sigue `docs/NORMA_VISUAL_MUNECA.md` (D-013):** nenita de unos
  5–6 años con la cara elegida en D-012; las piezas se adaptan a ella, nunca se deforma su cara.
  Esa dirección no se vuelve a debatir; cada resultado nuevo sí se revisa con su lista.
- Mantener el diseño pastel aprobado, los textos en castellano y una interacción táctil infantil.
  Nada de emojis como arte definitivo de la muñeca o de las mascotas.
- **Un borrador de arte no es un recurso definitivo**: pasa el comprobador o validador y la
  aprobación visual de la propietaria antes de entrar en `arte/originales/`.
- Si cambia un archivo que `sw.js` guarda en caché (su lista `FILES`), **subir la versión**
  `const C='mis-juegos-vN'`; si no, los dispositivos seguirán mostrando la versión antigua.
- Las capturas y archivos de prueba se guardan **fuera del repositorio** (o en `docs/capturas/`
  como evidencia, nunca en la raíz).
- No subir datos personales, fotos reales de menores, tokens ni copias de seguridad de datos.

## 3. Pruebas

```bash
python3 -m http.server 8765 &                 # desde la raíz del repositorio
node pruebas/prueba-juego.js                  # 21 comprobaciones: Vestir, Mi Mundo, datos, copia de seguridad…
node pruebas/prueba-copia.js                  # 45 comprobaciones: Guardar/Recuperar mi progreso y versión de pruebas
```

Además, según la tarea: `herramientas/comprobar-capas.html` y `herramientas/validar-pelo.html`
para el arte, y revisión en iPhone/iPad reales cuando sea posible. **Si una prueba no se ha
podido hacer (por ejemplo, en un iPad real o con la app instalada sin conexión), decirlo.**

**Amaia juega desde la app instalada en la pantalla de inicio del iPhone, no desde Safari.** En iOS,
la app instalada tiene sus datos **separados** de Safari: nada que se abra en Safari (marcadores,
`herramientas/copia-de-seguridad.html`) puede leer ni escribir sus estrellas, dibujos o personaje.
Por eso, todo lo que toque datos tiene que funcionar **dentro del juego** y probarse **en la app
instalada**. El entorno de Claude solo puede simularla en Chromium (`display-mode: standalone` y
hoja de compartir simulada, `node pruebas/prueba-copia.js`): eso no sustituye la prueba en el
iPhone real y hay que decirlo en el informe.

**Las pruebas en el iPhone se hacen SIEMPRE en la versión de pruebas** (`docs/VERSION_DE_PRUEBAS.md`):
otro origen web (`raw.githack.com`), otra app en la pantalla de inicio («PRUEBAS») y datos ficticios.
Nunca en la app de Amaia. No quitar las protecciones: el modo de pruebas solo se activa en las
direcciones de prueba y el juego de verdad rechaza las copias marcadas `version_pruebas`.

Las propuestas todavía no aprobadas se guardan como parche en `docs/propuestas/` (no se activan en
el juego hasta que la propietaria las apruebe).

## 4. Antes de cada commit (obligatorio)

1. Actualizar **en el mismo commit**:
   - `docs/ESTADO_ACTUAL.md`: qué funciona, qué se ha probado, qué falta, problemas y fecha.
   - `docs/REGISTRO_CAMBIOS.md`: una entrada nueva `### AAAA-MM-DD — título` con la plantilla del final.
   - Si corresponde: `docs/ARQUITECTURA_Y_DATOS.md`, `docs/AVATAR_Y_ASSETS.md`, `docs/DECISIONES.md`, `docs/HOJA_DE_RUTA.md`.
   - **El manual (`docs/MANUAL_PROYECTO.md`) y la hoja de ruta se mantienen al día en cada paso relevante** (aprobación,
     prueba, pieza nueva, enlace nuevo): la propietaria lo pidió expresamente el 16/10/2026.
2. Comprobar: `python3 herramientas/verificar_documentacion.py --preparado` (tras `git add`).
3. Revisar el `git diff --cached` entero.
4. El hash de un commit no puede escribirse dentro de ese mismo commit: en la entrada del registro
   se pone «este commit» y el hash se completa en la entrada siguiente (o se consulta con
   `git log -- docs/REGISTRO_CAMBIOS.md`).
5. Después del `git push`, comprobar el commit remoto con `git ls-remote origin` antes de decir que está subido.

## 5. Informe al terminar cada tarea

1) Qué ha cambiado; 2) rama y hash del commit (comprobado en GitHub); 3) pruebas hechas y
resultados; 4) documentación actualizada; 5) qué queda pendiente; 6) si afecta a datos
guardados; 7) confirmación de que `main` sigue intacta; 8) cómo revertir.

**Si faltan permisos de GitHub:** preparar un ZIP o parche y decirlo claramente. Nunca decir que algo
está en GitHub sin haberlo comprobado.
