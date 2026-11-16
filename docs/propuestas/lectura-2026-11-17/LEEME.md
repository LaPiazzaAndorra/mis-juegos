# Capa común de lectura (D-038) · 15/11/2026

(El nombre de la carpeta lleva «11-17» por un error de fecha; se deja así porque esa ruta ya se ha compartido con `juegos-pensar`.)

La norma está en [`docs/NORMA_TEXTOS_INFANTILES.md`](../../NORMA_TEXTOS_INFANTILES.md). Esta carpeta es su aplicación
**común a todas las ramas**. **No está publicada.** Se prueba en la copia de cuidar a la muñeca, que la carga:
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-cuidar-2026-11-15/index.html>

| Archivo | Qué es |
| --- | --- |
| `lectura.css` | MAYÚSCULAS (también en los botones), tamaños mínimos de 16 px, contraste, títulos sin «…», fichas de Vestir y retos de «Mis logros» sin cortar. Fuera: la zona de adultos y lo técnico. |
| `lectura.js` | Activa la capa; frases más breves del juego base (tabla `TEXTOS`, por coincidencia exacta); mensajes con voz (sin emojis), salvo los de adultos; títulos de las barras que no caben → solo su icono (o dos líneas si no tienen icono). No guarda nada. |
| `prueba-lectura.js` | 16 comprobaciones sobre una copia que la carga (ver la norma, apartado 4). |

**Cómo se carga** (igual en todas las ramas), justo después de `logros.js`:

```html
<link rel="stylesheet" href="docs/propuestas/lectura-2026-11-17/lectura.css">
<script src="docs/propuestas/lectura-2026-11-17/lectura.js"></script>
```

En la publicación se carga con la opción `--con-lectura docs/propuestas/lectura-2026-11-17` de
`herramientas/publicar/preparar_publicacion.py`, que la pone en ese orden y en lo básico para jugar sin conexión. Sin esa
opción, el resultado es el de siempre: comprobado que sigue reproduciendo `main` `021c67e` byte a byte.

**16/11 · corrección compartida (`lectura.js`):** el ajuste de los títulos de las barras se volvía a llamar a sí mismo
(cambiaba la clase del título, eso lo despertaba otra vez…): en las pantallas con título eran unos 120 cambios por segundo
sin parar. Ahora solo se ajusta al cambiar de pantalla o al aparecer contenido nuevo fuera de los títulos, y solo cambia la
clase si hace falta. Comprobado: 0 cambios en «Mis logros» y los títulos siguen ajustados. La capa no bloquea los toques del
salón: mismo resultado con ella y sin ella (prueba táctil y WebKit). Comunicado a `juegos-pensar`.

**16/11 · `prueba-lectura.js`** (solo la prueba; `lectura.css` y `lectura.js` no cambian): las pantallas se recorren como
las abre la niña, con los botones de los menús y su dato (`obs(sombras)`, `ice(pedidos)`…). Antes abría a la fuerza
pantallas internas que necesitan un dato y, con los juegos nuevos de Pensar, daba errores falsos. Comunicado a
`juegos-pensar`.
