# Pelo rizado castaño · especificación de las dos capas

Diseño aprobado: la melena de rizos castaños del primer borrador (volumen, raya al lado,
rizos largos hasta media espalda). Los PNG de ese borrador **no** se usan: hay que crear las
capas de nuevo siguiendo esta especificación.

## Archivos

| Archivo | Va en el juego | Plantilla para dibujar encima |
|---|---|---|
| `pelo-rizos-detras-castano.png` | detrás de la base | `guias/plantilla-pelo-detras.png` |
| `pelo-rizos-delante-castano.png` | delante de la base y de los ojos | `guias/plantilla-pelo-delante.png` |

Orden en el juego: **pelo detrás → base → ojos → pelo delante**.

## Requisitos comunes

* **PNG RGBA de 2000 × 3500 px**, lienzo completo sin recortar, sRGB.
* **Transparencia auténtica:** todo lo que no es pelo, alfa 0. Nada de fondos blancos, verdes
  ni grises por debajo.
* **Opacidad de la capa al 100 %** (el pelo macizo con alfa 255; solo los bordes de los
  mechones son semitransparentes).
* **Solo pelo:** sin piel, orejas, pestañas, ropa ni restos de otra figura.
* **Detalle original:** dibujado o generado a esta resolución, no ampliado desde una imagen
  pequeña. La masa de rizos debe tener ~1300 × 1800 px de detalle real. (El validador lo mide:
  pelo nítido ≈ 8–10; ampliado ×2 ≈ 4; el primer borrador daba 0,8–1,3.)
* **Bordes limpios:** sin escalones, sin islas de pelo sueltas fuera de la silueta, sin halos.
* **Nunca en línea recta:** ni el nacimiento del pelo, ni las puntas, ni donde el pelo pasa
  junto a hombros y brazos. Los mechones terminan en puntas.

## Pelo de detrás

* Toda la masa de rizos que cae por detrás de la cabeza, los hombros y la espalda.
* **Relleno por dentro de la cabeza** al menos 80 px desde el contorno (zona rayada): así no
  aparecen huecos cuando la cabeza se balancea.
* **Puntas entre y ≈ 2000 y 2350**, irregulares, cada rizo con su punta.
* Dentro de la zona x 100–1900, y 150–2700.

## Pelo de delante

* Flequillo, raya y mechones que caen por delante de la frente, las mejillas y los hombros.
* **Tapa la parte alta de la cabeza** (zona rayada, hasta y ≈ 525).
* **Nacimiento del pelo** entre y ≈ 525 y 685 en el centro (las dos líneas marrones), con una
  transición suave de 20–40 px: mechones finos que se funden con la frente, no un corte.
* **Zona prohibida (rojo):** ojos y pestañas con un margen de 30 px, nariz y boca. Las
  pestañas de los ojos aprobados llegan arriba hasta y ≈ 925 y a los lados hasta x ≈ 634 y 1366.
* **Orejas:** pueden quedar tapadas por los rizos; no se dibujan orejas en esta capa.
* **Hombros y brazos (azul):** los mechones pueden caer por delante, pero terminan en puntas;
  no se recortan siguiendo el brazo.
* Dentro de la zona x 150–1850, y 150–2500.

## Cómo validar antes de enviar

1. Abrir `herramientas/validar-pelo.html` (o la copia autónoma `validar-pelo.html` en el iPad).
2. Elegir los dos PNG. Se montan sobre la base V2.1 y los ojos marrones aprobados.
3. La revisión automática debe decir **«✅ El pelo está listo para aprobar»**.
4. Mirar también las ampliaciones al 100 % (nacimiento, ojos, orejas, hombros y puntas)
   en fondo claro y oscuro, y la vista de tamaño iPhone. Con «Ojos cerrados» se comprueba
   el parpadeo.

El primer borrador da 8 errores en esta revisión (restos de piel, islas, cortes rectos, baja
resolución, invasión de pestañas y cabeza sin tapar), que corresponden a los seis defectos
encontrados.

## Integración

El juego ya espera estos dos nombres (`avatar/catalogo-muneca.js`, peinado «Rizos largos»,
color «Castaño»). Al recibirlos: comprobador → optimizador → prueba con `?arte=borrador` en
«Vestir» y «Mi Mundo», iPhone e iPad.
