# Muñeca premium · archivos para la primera integración real

Primera versión bonita del avatar: **1 muñeca base · 2 tonos de piel · 2 colores de ojos ·
1 peinado (detrás y delante) · 1 vestido · 1 par de zapatos · 1 accesorio**.

En cuanto estos archivos estén en `arte/originales/` y pasen el comprobador, el juego usa la
muñeca premium en lugar de la provisional, sin tocar el código (`herramientas/optimizar.py`
y listo).

## Proporciones acordadas para la base definitiva

* Cabeza grande, mejillas sonrosadas y acabado de ilustración infantil premium (como la base v1).
* **Cuello algo más corto** que en la v1 (allí medía unos 260 px de la barbilla a los hombros).
* **Brazos más cerca del cuerpo: 18–20°**, medidos del hombro a la punta de los dedos
  (la v1 tenía unos 31°).
* Ojos: piel lisa donde van, sin óvalos ni restos de pestañas; centros en x ≈ 785 y 1215, y ≈ 1040.
* Opacidad de la capa al 100 %.

## Reglas comunes a TODOS los archivos

| | |
|---|---|
| Formato | **PNG** de 32 bits (RGBA, 8 bits por canal), **sRGB** |
| Tamaño | **2000 × 3500 px exactos** |
| Lienzo | **Completo, sin recortar.** Cada pieza en su sitio dentro del lienzo; el optimizador la recorta después y guarda su posición |
| Transparencia | **Sí, obligatoria.** Todo lo que no es la pieza, transparente (sin fondo, sin sombra en el suelo) |
| Plantilla | **Sí.** Eje x = 1000, suelo y = 3275, línea de ojos y = 1040 (ver `plantilla-guia.png`) |
| Encaje | Todas las piezas dibujadas **sobre la misma muñeca base**, sin moverla ni escalarla entre una y otra |
| Luz | Desde arriba a la izquierda, igual en todas las piezas |
| Bordes | Antialias limpio, sin halo blanco ni restos de fondo (verde) entre los rizos |
| Resolución de origen | La muñeca debe medir **al menos 1500 px de alto** en la imagen original antes de escalarla a la plantilla (ideal: 2900 px). Por debajo de eso se verá algo borrosa en el iPad |

## Los 11 archivos

| # | Archivo | Qué contiene | Zona (x, y en px) | ¿Completar lo que queda tapado? |
|---|---|---|---|---|
| 1 | `base-clara.png` | Muñeca descalza, piel clara: cabeza, cara **sin ojos** (piel lisa donde van los ojos; sí cejas, nariz, boca sonriente y mejillas), orejas, cuello, brazos y manos, torso con **maillot sencillo** (blanco o rosa muy claro), piernas y pies. **Sin pelo** | 380–1620, 380–3340 | **Sí, todo el cuerpo completo**: cráneo liso con nacimiento del pelo suave, orejas, hombros, brazos enteros, torso y piernas hasta la cadera, aunque luego los tape la ropa o el pelo |
| 2 | `base-morena.png` | La **misma** base con piel morena (mismo dibujo, solo cambia el color de la piel). **Puedo preparar el borrador automáticamente** a partir de la clara | igual que la 1 | Sí, igual que la 1 |
| 3 | `ojos-marron.png` | Los **dos ojos abiertos** completos: blanco, iris marrón, pupila, brillos, línea del párpado y pestañas | 560–1440, 880–1220 | No. Solo los ojos, encajados en la cara de la base |
| 4 | `ojos-azul.png` | Idéntico al 3, con el iris azul (mismos brillos y pestañas, misma posición). **Borrador automático** a partir del 3 y de la máscara del iris | igual que la 3 | No |
| 5 | `ojos-cerrados-clara.png` | Párpados **cerrados** en piel clara, con la línea de pestañas. Debe tapar por completo los ojos abiertos | igual que la 3 | No, pero debe tapar todo el ojo abierto |
| 6 | `ojos-cerrados-morena.png` | Igual que el 5 en piel morena. **Borrador automático** a partir del 5 | igual que la 3 | No, igual que la 5 |
| 7 | `pelo-rizos-detras-castano.png` | Toda la masa de rizos que queda **por detrás** de la cabeza y del cuerpo (espalda y lados) | 100–1900, 150–2700 | **Sí**: pintar también la zona que tapa la cabeza (al menos 80 px hacia dentro), para que no queden huecos |
| 8 | `pelo-rizos-delante-castano.png` | Lo que queda **por delante**: flequillo, rizos sobre la frente, la cara, los hombros o el pecho. **Sin piel** | 150–1850, 150–2500 | Tapar siempre la coronilla de la base (nacimiento del pelo) |
| 9 | `ropa-princesa.png` | Vestido de princesa completo con mangas y lazo. **Sin zapatos y sin piel** | 300–1700, 1450–3300 | **Sí**: hombros y espalda del vestido bajo el pelo de delante, y la parte del cuerpo bajo los brazos |
| 10 | `zapatos-princesa.png` | El par de zapatos, con los calcetines si los lleva | 700–1300, 2950–3340 | **Sí**: el zapato entero, aunque el vestido tape la parte de arriba. Suela en y = 3275 o un poco por debajo |
| 11 | `acc-corona.png` | Corona apoyada sobre el pelo de delante | 300–1700, 150–900 (recomendado) | No. Sin pelo dentro de la capa |

Opcional (recomendado para comparar): `referencia-completa.png`, la muñeca entera montada
y sin separar, en el mismo lienzo.

### Archivo auxiliar (no va al juego)

| Archivo | Contenido | Dónde |
|---|---|---|
| `ojos-iris-mascara.png` | Dos círculos **blancos y opacos** exactamente sobre los dos iris de `ojos-marron.png` (mismo lienzo 2000 × 3500, el resto transparente). Se hace en un minuto en una capa nueva | `arte/mascaras/` |

## Lo que hay que pintar y lo que puedo preparar yo

* **Pintar (8):** base clara, ojos marrones, ojos cerrados (piel clara), pelo detrás, pelo
  delante, vestido rosa, zapatos y corona, más la máscara del iris.
* **Borradores automáticos (3):** `base-morena.png`, `ojos-cerrados-morena.png` y `ojos-azul.png`,
  con `herramientas/variantes.py`. Conservan el sombreado, el rubor, los labios, las vetas del iris
  y los brillos. Se revisan a ojo y, si hace falta, se retocan antes de aprobarlos.

## Orden en el que el juego las apila (de atrás hacia delante)

```
pelo detrás → base → ojos → ojos cerrados (solo al parpadear o dormir) → zapatos → vestido → pelo delante → corona
```

## Lo que el juego hace con ellas

* **Vestir:** pestañas Piel (2), Ojos (2) y Adornos (corona sí/no). Las pestañas con una sola
  opción no se muestran hasta que haya más.
* **Animaciones:** parpadeo y dormir (ojos cerrados), salto con destellos al cambiar algo,
  balanceo suave en reposo y paso al caminar en «Mi Mundo».
* **Guardar y editar después:** igual que ahora (clave `avatar`).
* **Mi Mundo:** la misma muñeca, en la habitación y dormida en la cama.

## Siguiente fase (no hace falta para la primera integración)

| Archivo | Para qué |
|---|---|
| `boca-abierta-clara.png`, `boca-abierta-morena.png` | Sonrisa abierta al saludar y al alegrarse |
| `brazo-izq-clara.png`, `brazo-der-clara.png` (y morena) | Saludar con la mano (la base pasa a ir sin brazos) |
| `ropa-princesa-manga-izq.png`, `ropa-princesa-manga-der.png` | Mangas que siguen a los brazos |
| Más peinados, colores, ropa, zapatos y accesorios | Mismas reglas que arriba |
