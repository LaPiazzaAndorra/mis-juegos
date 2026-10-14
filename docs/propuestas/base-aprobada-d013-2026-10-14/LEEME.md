# Base visual aprobada conforme a D-013 · 14/10/2026

La propietaria aprueba esta imagen como **base visual** de la muñeca nueva, conforme a
[`NORMA_VISUAL_MUNECA.md`](../../NORMA_VISUAL_MUNECA.md) (D-013). Decisión: D-014.

## Archivo conservado (sin modificar)

- `base-aprobada.png`: copia exacta del archivo recibido en la conversación con Claude.
- **948 × 1659 px**, PNG RGBA, fondo transparente.
- SHA-256: `f9c143fc56fcc48d231286b72f94b8ee90bd94c669a9d1568a9d5616f4e179a6`.
- Procede de ChatGPT. No se ha podido comprobar que sea byte a byte el archivo descargado allí
  (el enlace compartido no es accesible desde el entorno de Claude); este hash identifica la
  versión recibida y aprobada.

## Qué muestra

Muñeca sin pelo, con camiseta y mallas rosas y descalza: cabeza grande, cuello corto, hombros
estrechos, torso compacto y brazos y piernas cortitos y redondeados; ojos marrones grandes algo
separados, sonrisa, nariz pequeña, pecas y mejillas redondas. La ropa rosa es provisional.

## Revisión con la lista de D-013

- [x] Nenita de unos 5–6 años, sin rasgos adolescentes ni adultos.
- [x] Cara de D-012 (ojos grandes algo separados, sonrisa, nariz pequeña, pecas, mejillas).
- [ ] Requisitos técnicos de producción: **pendientes** (abajo).

## Pendiente antes de usarla en el juego (medido sobre este archivo)

- **Resolución:** 948 × 1659, no 2000 × 3500. Ampliarla no da detalle real.
- **Opacidad:** el cuerpo no es macizo: casi todo tiene alfa 240–254 (solo 1 630 píxeles con
  alfa 255), así que se transparentaría ligeramente sobre un fondo.
- **Bordes:** unos 16 500 píxeles casi invisibles (alfa 1–15) y contenido que llega al borde
  izquierdo del lienzo (x = 0): hay que limpiar halos y restos.
- **Capas:** cuerpo, ojos abiertos y cerrados y ropa no están separados (camiseta y mallas forman
  parte de la imagen).
- Con una base nueva válida: medirla y rehacer plantilla y guías; las medidas de la V2.1 no se
  trasladan a ciegas.

Esta imagen **no** sustituye a ninguna pieza del juego, no está en `arte/originales/` ni en el
catálogo. Se conservan la V2.1 (en el juego) y la referencia de D-012.
