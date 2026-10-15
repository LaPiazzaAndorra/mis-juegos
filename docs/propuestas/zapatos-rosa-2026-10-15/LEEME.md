# Zapatos rosa · 15/10/2026

| Archivo | Qué es | Estado |
| --- | --- | --- |
| `referencia-muneca-con-zapatos.png` | Imagen generada de la muñeca con zapatos (948 × 1659), conservada **sin modificar**; SHA-256 `5b491087307c0a75222380769619d3662f225701f86d76b70550f3f825336501`. | **Referencia del diseño aprobado (D-017).** No sustituye a la base ni a su cara. |
| `montaje/zapatos.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/zapatos-rosa-2026-10-15/montaje/zapatos.py`). | — |
| `montaje/zapato-izquierdo-candidato-sin-ajustar.png`, `montaje/zapato-derecho-candidato-sin-ajustar.png` | Cada zapato extraído, en su posición original. | Candidatas de capa. |
| `montaje/zapatos-candidatos.png` | Los dos zapatos ya colocados sobre los pies de D-016. | Candidata; **encaje pendiente de aprobación**. |
| `montaje/montaje-zapatos*.png`, `montaje/encaje-zapatos.png`, `montaje/vista-muneca-con-zapatos.png` | Montajes y vistas de encaje. | Para revisar. |
| `montaje/comprobaciones.json` | Cifras. | — |

## Diseño aprobado (D-017)

Rosa satinado, punta redonda, tira con hebilla y lazo con corazón dorado.

## Extracción

- Solo el zapato: pala, tira, hebilla, lazo, corazón y suela.
- Se quitan la pierna y el empeine de la imagen generada. Por la abertura del zapato se ve el empeine de **nuestra**
  base.
- Los bordes conservan el alfa original. No se toma nada fuera de la zona de los pies (comprobado).

## Encaje sobre los pies de D-016

- Solo traslado, **sin escala**:
  - **izquierdo:** sin cambio;
  - **derecho:** +2 px en horizontal. Sin ajustar, el pie asomaba 24 px por el borde exterior; ajustado, 0 px.
- Ningún píxel del pie de la base queda fuera del contorno de los zapatos.
- La muñeca no cambia fuera de los zapatos (comprobado). La cara, el cuerpo, el vestido y el pelo no se tocan.
- **Orden de capas:** pelo detrás · base · ojos · zapatos · vestido · brazos · pelo delante.
- A revisar:
  - el borde superior de la tira y de la abertura conserva el antialias de la imagen generada; ampliando, se ve algo
    dentado en 1–2 px;
  - la resolución real de 2000 × 3500 sigue pendiente.

En el visor: **Zapatos → Zapatos rosa (prueba)** y **Ver → Pies**. Por defecto, la muñeca sigue descalza (D-016).

**Probado:** comprobaciones automáticas y revisión visual en el ordenador; el visor, en Chromium con pantalla de iPhone
simulada (sin errores ni almacenamiento; coincide con el montaje en lo opaco). Sin probar en el iPhone/iPad reales.
