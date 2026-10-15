# Corona dorada · 15/10/2026

| Archivo | Qué es | Estado |
| --- | --- | --- |
| `referencia-muneca-con-corona.png` | Imagen generada de la muñeca con corona (948 × 1659), conservada **sin modificar**; SHA-256 `fb822741d92d4fd954fb884f0ae58bf5fa2facf0315cbd69b59f7e46e9b6bdc9`. | **Referencia del diseño aprobado (D-018).** No sustituye a la base ni al conjunto. |
| `montaje/corona.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/corona-2026-10-15/montaje/corona.py`). | — |
| `montaje/corona-candidata.png` | La corona sola, capa independiente (948 × 1659), con los huecos entre adornos transparentes. | Candidata; **encaje pendiente de revisión**. |
| `montaje/montaje-corona*.png`, `montaje/encaje-corona.png`, `montaje/vista-muneca-con-corona.png` | Montajes y vistas (referencia, antes, después y corona sola sobre tres fondos). | Para revisar. |
| `montaje/comprobaciones.json` | Cifras. | — |

## Diseño aprobado (D-018)

Corona dorada con perlitas y corazón rosa.

## Extracción

- **Solo la corona:** oro, perlas y piedras rosas se separan por color. El pelo marrón de la imagen generada no entra;
  se recuperan las sombras de las perlas y los perfiles del oro.
- **Huecos:** los huecos entre los adornos quedan **transparentes** (4 065 px dentro del contorno de la corona) y por
  ellos se ve nuestro pelo.
- **Bordes:** conservan el alfa original.

## Colocación sobre nuestra muñeca (D-016 + zapatos D-017)

- **Sin mover ni escalar:** la cabeza de la imagen generada coincide con la nuestra, y la diadema apoya por completo
  sobre nuestro pelo.
- **Orden:** la corona va encima de todas las capas.
- **Comprobado:** la cara, los rizos y el conjunto aprobado no cambian fuera de la corona.

## A revisar

- Junto a dos perlas quedan uno o dos hilitos tenues del pelo de la imagen generada (364 px con tono de pelo, la
  mayoría sombras del oro); se ven solo ampliando.
- La resolución real de 2000 × 3500 sigue pendiente.

En el visor: **Corona → Corona dorada (prueba)** y **Ver → Corona**. Por defecto, la muñeca va sin corona.

**Probado:** comprobaciones automáticas y revisión visual en el ordenador; el visor, en Chromium con pantalla de iPhone
simulada (sin errores ni almacenamiento; coincide con el montaje en lo opaco). Sin probar en el iPhone/iPad reales.
