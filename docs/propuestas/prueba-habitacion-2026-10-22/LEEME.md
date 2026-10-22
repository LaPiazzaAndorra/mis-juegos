# Prueba de la habitación ilustrada de «Mi Mundo» (D-031) · 22/10/2026

**Copia aislada. No es el juego de Amaia.** Es la prueba completa (D-030, aprobada en general; se conserva sin cambios)
con la **habitación nueva** en el escenario «habitación» de «Mi Mundo». Datos propios con el prefijo **`hab1:`**; sin
service worker (necesita conexión); manifiesto propio («PRUEBA HABITACIÓN»). Las demás escenas (casa, parque, playa…)
siguen como hoy, con sus pegatinas, hasta que tengan su rediseño.

**Abrir en Safari:** <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-habitacion-2026-10-22/index.html>
(el enlace fijo, con el hash del commit, se anota en `docs/REGISTRO_CAMBIOS.md`).

## Piezas recibidas (propuestas, en `recibidas/`, sin modificar)

| Pieza | Revisión | Uso en la copia |
| --- | --- | --- |
| Fondo vacío (1536 × 1024) | Perspectiva frontal con el suelo visto desde arriba; la muñeca encaja a escala con la ventana (al fondo, unos 250 px de alto; delante, unos 420). Sin bordes que limpiar. **Resolución justa** para el iPad (se ve algo blando a pantalla completa). | `arte/fondo-habitacion.webp` (sin cambios). |
| Cama (1312 × 1199, con transparencia) | Bordes limpios, sin halo ni contorno oscuro. **Dos defectos corregidos en una copia:** todo su interior tenía alfa 252–253 (se transparentaba un 1 %): pasa a 255; y 599 motitas sueltas alrededor (1 875 px): quitadas. **La perspectiva (tres cuartos, desde los pies) sí permite acostarla** sin postura nueva: la muñeca, girada −25° y con los ojos cerrados, apoya la cabeza en las almohadas y el embozo la tapa desde el cuello (probado con vestido, hada, aventura y pijama, los cuatro tonos y los tres peinados). **No hace falta una cama más frontal.** | `arte/cama-detras.webp` (la cama entera) y `arte/cama-delante.webp` (solo lo que queda por delante del borde de arriba del embozo y de la manta: la misma imagen recortada, sin dibujar nada). |

Hojas: `revision/escala-muneca-y-cama.jpg`, `revision/capas-cama.jpg`, `revision/acostada-combinaciones.jpg` y
capturas de la copia (`revision/copia-*.jpg`). `preparar_piezas.py` hace las piezas y `arte/comprobaciones.json`
guarda las medidas (las recibidas no cambian: SHA-256 comprobados).

## Cómo se juega en la copia

- La muñeca guardada aparece de pie; se **arrastra** a cualquier sitio del suelo y crece o encoge con la profundidad.
  Tocar el suelo la hace **caminar** hasta allí.
- **Tocar la cama** → va y **se acuesta**; también al **soltarla encima** de la cama. Acostada: ojos cerrados, «Z z z», y
  **se ocultan las alas, la mochila y la varita** (solo en la habitación; la muñeca guardada no cambia). **Tocarla** → se
  levanta junto a la cama y vuelve todo.
- **Catálogo de la habitación** (bandeja de abajo, sin emojis): por ahora, la cama (única). Se puede **mover** (cambia de
  tamaño con la profundidad), **quitar** (🗑️ al seleccionarla) y volver a poner. Los objetos **iniciales son gratis**; los
  nuevos podrán llevar **candado** y abrirse con los **logros** de la copia (comprobado con un objeto de prueba). Nada ya
  aprobado se bloquea.
- Todo se guarda en `mm_habitacion2` (con `hab1:`). Las claves de la habitación de hoy (`mm_hab`, `sc_habitacion`) no se
  tocan.
- Encuadre: en el iPad, la habitación llena el marco; en el iPhone, la cámara sigue a la muñeca (o a su almohada).

## Pruebas (Chromium; iPhone e iPad simulados)

```bash
python3 -m http.server 8765 &
python3 docs/propuestas/prueba-habitacion-2026-10-22/preparar_piezas.py   # piezas (solo si cambian las recibidas)
python3 docs/propuestas/prueba-habitacion-2026-10-22/preparar_copia.py    # la copia (comprueba que es la prueba completa + la habitación)
node docs/propuestas/prueba-habitacion-2026-10-22/prueba-habitacion.js    # 18 comprobaciones
```

Resultado 22/10/2026: **18/18**. **No probado en el iPhone ni en el iPad reales.**

## Lo que necesitamos a continuación (habitación)

Todo en el **mismo estilo y la misma cámara que la cama** (tres cuartos, desde delante y un poco desde arriba, luz cálida
de la ventana), **PNG con transparencia**, el interior **totalmente opaco** (alfa 255) y **sin motitas** alrededor, **sin
sombra en el suelo** (la ponemos aquí), sin texto ni personajes, cada pieza por separado y con su base apoyada en el suelo.

1. **Fondo en más resolución** (el mismo, a 3072 × 2048 si es posible) y, si queremos día y noche, **la ventana de noche**
   (el mismo fondo con el cielo nocturno; solo usaremos la zona de la ventana).
2. **Para sentarla (dos capas, como la cama):**
   - **silla** (va detrás de la muñeca): respaldo ancho y redondeado que asome a los lados de sus hombros;
   - **mesa con mantel largo hasta el suelo** (va delante): el mantel tapa sus piernas.
   Mismo tamaño relativo que la cama (una mesa infantil, más baja que el pie de la cama alto).
3. **Objetos iniciales (gratis):** mesita de noche con lámpara, alfombra (plana sobre el suelo, con la perspectiva del
   suelo), osito de peluche, pelota, cesta de juguetes, puf, planta en maceta y estantería baja con libros.
4. **Objetos para desbloquear con logros (propuesta):** casita de muñecas, caballito balancín, tienda tipi, lámpara de
   estrella, peluche de unicornio y baúl de juguetes. La propietaria decide cuáles y con cuántos logros.

Después, con el mismo sistema: **casa** y **parque**, cada uno con su fondo vacío y su catálogo.

## Pendiente (decide la propietaria)

- Si al acostarla se quitan también la corona, la gorra, el gorrito o el sombrero (hoy se quedan puestos).
- El fondo y la cama son **propuestas**: su aprobación, y la del encaje en la copia.
