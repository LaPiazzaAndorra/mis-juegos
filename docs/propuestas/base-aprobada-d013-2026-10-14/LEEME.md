# Base visual aprobada conforme a D-013 · 14/10/2026

La propietaria aprueba esta imagen como **base visual** de la muñeca nueva, conforme a
[`NORMA_VISUAL_MUNECA.md`](../../NORMA_VISUAL_MUNECA.md) (D-013). Decisión: D-014.

## Dos versiones: no confundirlas

| Archivo | Qué es | SHA-256 del archivo |
| --- | --- | --- |
| `base-aprobada.png` | **Original aprobado (D-014), intacto.** Referencia de la apariencia. | `f9c143fc56fcc48d231286b72f94b8ee90bd94c669a9d1568a9d5616f4e179a6` |
| `base-transparencia-corregida.png` | **Copia técnica** con solo el canal alfa corregido. 948 × 1659, no es arte de 2000 × 3500 ni una pieza del juego. | `42a82a4960829b985bd17f30767f332953554dddb2a160c58c59eed7a3634a85` |

La copia técnica se revisó visualmente con la propietaria antes de guardarla (comparación en
`docs/capturas/2026-10-14-base-transparencia/`). **Ninguna de las dos está en `arte/originales/` ni en el catálogo.**

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

## Copia técnica con la transparencia corregida

Hecha con `herramientas/corregir_transparencia.py` (procesamiento de imagen; no se redibuja ni
regenera nada). **Solo cambia el canal alfa:** colores RGB idénticos píxel a píxel, misma
resolución, misma cara, proporciones y postura.

- Interior (a más de 2 px del contorno): de alfa 247–254 a **255** (392 915 píxeles).
- **12 654 restos exteriores** casi invisibles eliminados (alfa máximo 7): fuera de la silueta a
  más de 3 px, o con alfa < 4. Contenido: de la caja (0, 19, 936, 1651) a (170, 171, 788, 1540).
- **Borde suave conservado:** 10 618 píxeles de antialias, cambio de alfa máximo 1 (medio 0,24).
- Queda sin tocar el trazo más claro y marrón del contorno que se ve sobre fondo oscuro: es parte
  de la ilustración, no un resto.
- Detalle completo en `COMPROBACIONES.txt`. Huella de píxeles (SHA-256 del RGBA):
  `953320c17bc09db0f25066657468c2717799f819ca114edf6ee5f9762da3dd19`.

**Reproducir y comprobar:**

```bash
python3 herramientas/corregir_transparencia.py --comprobar \
  docs/propuestas/base-aprobada-d013-2026-10-14/base-aprobada.png \
  docs/propuestas/base-aprobada-d013-2026-10-14/base-transparencia-corregida.png
# → ✅ La copia corregida coincide píxel a píxel con la corrección del original
```

(Se comparan píxeles, no el archivo: otra versión de Pillow puede comprimir el PNG de otra forma.)

## Pendiente antes de usarla en el juego

- **Resolución:** 948 × 1659, no 2000 × 3500. Ampliarla no da detalle real.
- ~~Opacidad del interior~~ y ~~restos exteriores~~: resueltos en la copia técnica (el original
  sigue teniendo alfa 247–254 y unos 16 500 píxeles casi invisibles, como referencia).
- **Capas:** cuerpo, ojos abiertos y cerrados y ropa no están separados (camiseta y mallas forman
  parte de la imagen).
- Con una base nueva válida: medirla y rehacer plantilla y guías; las medidas de la V2.1 no se
  trasladan a ciegas.

Esta imagen **no** sustituye a ninguna pieza del juego, no está en `arte/originales/` ni en el
catálogo. Se conservan la V2.1 (en el juego) y la referencia de D-012.
