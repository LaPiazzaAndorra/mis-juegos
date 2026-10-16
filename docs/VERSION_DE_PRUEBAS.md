# Versión de pruebas en el iPhone (sin tocar la app de Amaia)

**Enlace de la versión de pruebas:**

**https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/index.html**

Es la rama `avatar-creador` (sin publicar) servida desde **otra dirección web** (`raw.githack.com`),
un servicio gratuito que muestra los archivos públicos de GitHub como una web. Se actualiza sola unos
minutos después de cada subida a la rama.

**Prueba aislada nueva: piel, pelo, cejas, ojos y pintacaras (D-023), 16/10/2026:**
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d023/index.html>
— copia aparte con datos propios (claves `d023:`). No toca los datos de esta versión de pruebas, ni los de las pruebas
D-016 y D-021, ni los de Amaia. Detalles en [`docs/propuestas/prueba-juego-d023/LEEME.md`](propuestas/prueba-juego-d023/LEEME.md).
Sin probar todavía en el iPhone.

**Prueba aislada nueva: cuatro colores de ojos y pintacaras (D-021), 16/10/2026:**
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d021/index.html>
— copia aparte con datos propios (claves `d021:`). No toca los datos de esta versión de pruebas, ni los de la prueba
D-016, ni los de Amaia. Detalles en [`docs/propuestas/prueba-juego-d021/LEEME.md`](propuestas/prueba-juego-d021/LEEME.md).
Sin probar todavía en el iPhone.

**Prueba aislada de la muñeca nueva (D-016 + zapatos + corona), 15/10/2026:**
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-juego-d016/index.html>
— copia aparte con datos propios (claves `d016:`). No toca ni los datos de esta versión de pruebas ni los de Amaia.
Detalles en [`docs/propuestas/prueba-juego-d016/LEEME.md`](propuestas/prueba-juego-d016/LEEME.md).
**Aprobada por la propietaria en su iPhone (D-019).** Versión de referencia fija (commit `22d96e9`): <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/22d96e912412942abdb4733cff314250fd901f4a/docs/propuestas/prueba-juego-d016/index.html>.

## Por qué no afecta a la app de Amaia

- **Otro origen web.** El navegador guarda los datos (estrellas, dibujos, personaje, láminas…) por
  origen. `raw.githack.com` no es la dirección del juego de Amaia, así que no puede leer ni cambiar
  sus datos, ni la app de Amaia puede leer los de pruebas. Además, en iOS cada app de la pantalla de
  inicio tiene su propio almacenamiento.
- **Otra app en la pantalla de inicio**, con otro nombre («PRUEBAS») y otro icono (verde con la palabra
  PRUEBAS). La app de Amaia **no se sustituye ni se toca**.
- **Se nota que es de pruebas:** cinta «🧪 VERSIÓN DE PRUEBAS · datos ficticios» abajo, y en ⚙️ Ajustes un
  recuadro naranja con la dirección.
- **Las copias se distinguen:** se llaman `PRUEBAS-Mi-Mundo-progreso-AAAA-MM-DD.json` y llevan una
  marca interna. **El juego de verdad rechaza las copias de pruebas**, así que no se pueden recuperar
  por error en la app de Amaia.
- El modo de pruebas solo se activa en `raw.githack.com` / `rawcdn.githack.com` (y en `localhost` con
  `?pruebas`, para las pruebas automáticas). En la dirección del juego de Amaia no aparece nunca.

Ten en cuenta que `raw.githack.com` es un servicio externo que comparten otros proyectos: sirve para
probar con datos ficticios, pero **no es la dirección para que Amaia juegue**.

## Instalar (en el iPhone, unos 2 minutos)

1. **Abre el enlace en Safari** (no en Chrome: solo Safari instala apps en iOS).
2. Comprueba que se ve la cinta «🧪 VERSIÓN DE PRUEBAS» abajo. Si no se ve, **no sigas**.
3. Botón **Compartir** (cuadrado con flecha) → **Añadir a pantalla de inicio**. El nombre propuesto debe
   ser «PRUEBAS» y el icono, verde con la palabra PRUEBAS → **Añadir**.
4. Cierra Safari y **abre la app «PRUEBAS» desde su icono**. Todas las pruebas se hacen desde ahí.

## Probar (con datos ficticios)

Anota el resultado de cada paso (✅ / ❌ y qué se ve). Cuantas más capturas, mejor.

1. **Datos ficticios:** ⚙️ → recuadro «🧪 Versión de pruebas» → **🎲 Cargar datos ficticios** → Aceptar.
   La app se recarga con ⭐ 123, 3 dibujos en la galería, una lámina importada, 42 monedas y un personaje.
2. **Guardar en iCloud Drive:** ⚙️ → **💾 Guardar mi progreso**. Se abre la hoja de compartir →
   **Guardar en Archivos** → **iCloud Drive** (si quieres, en una carpeta «Pruebas Mi Mundo») → **Guardar**.
   - ¿Se abrió la hoja al **primer** toque? (Si sale «Vuelve a tocar…», tocar otra vez y anotarlo).
   - Abre la app **Archivos** → iCloud Drive: debe estar `PRUEBAS-Mi-Mundo-progreso-….json`.
3. **Cambiar algo:** juega un poco para que cambien las estrellas (por ejemplo, un juego de Pensar) o
   borra un dibujo de la galería. Apunta cuántas estrellas hay.
4. **Recuperar desde iCloud Drive:** ⚙️ → **📂 Recuperar mi progreso** → elige el archivo en iCloud Drive.
   - ¿El archivo se puede seleccionar (no aparece en gris)?
   - Aparece la tabla «En la copia / Ahora»: ⭐ 123 en la copia y lo que hay ahora.
   - Prueba primero **Cancelar** (no debe cambiar nada) y luego repítelo con **♻️ Recuperar**.
   - Tras recargar: ⭐ 123 y los 3 dibujos de nuevo.
5. **Deshacer:** ⚙️ → **↩️ Deshacer la última recuperación** → Aceptar. Debe volver a como estaba en el
   paso 3 (las estrellas que apuntaste).
6. **Sin conexión:** cierra la app del todo, activa el modo avión, ábrela desde el icono: debe abrir y
   los botones de copia deben funcionar (guardar puede ofrecer menos destinos sin red).
7. **Comprobar que la app de Amaia sigue igual:** abre su app «Mis Juegos» de siempre y mira que sus
   estrellas y dibujos son los de siempre. **No pulses en ella** «Recuperar mi progreso» (de hecho, la
   versión publicada todavía no tiene esos botones).

Mándame los resultados (y las capturas si algo sale raro). Con eso se da por validado o se corrige.

## Quitar la versión de pruebas

Mantén pulsado el icono «PRUEBAS» → **Eliminar app** (o «Eliminar de la pantalla de inicio» y luego
borrar sus datos desde Ajustes → Safari → Avanzado → Datos de sitios web → `raw.githack.com`).
Esto no afecta a la app de Amaia. Los archivos `PRUEBAS-…json` de iCloud Drive se pueden borrar.

## Si el enlace no abre

`raw.githack.com` es un servicio externo. Si no funciona, alternativas con otro origen (las prepara
Claude cuando la propietaria lo decida): GitHub Pages en **otra organización** de GitHub (por ejemplo
`mimundo-pruebas.github.io`; la dirección `lapiazzaandorra.github.io` **no** sirve porque sería el mismo
origen que el juego publicado si está allí), Netlify o Cloudflare Pages (cuenta gratuita).
