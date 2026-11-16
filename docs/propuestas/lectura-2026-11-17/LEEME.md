# Capa común de lectura (D-038) · 17/11/2026

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
