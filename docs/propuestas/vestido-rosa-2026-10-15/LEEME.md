# Vestido rosa de princesa · 15/10/2026

## Archivos

| Archivo | Qué es | Estado |
| --- | --- | --- |
| `referencia-muneca-vestida.png` | Muñeca vestida generada (948 × 1660, RGBA). Se conserva **sin modificar**; SHA-256 `6932d7bf638158f080c3688ae0fdf946e4b87ff28afdde81e13f850b4d3159e8`. | **Referencia del diseño aprobado** (D-015). No es una capa ni sustituye a la base D-014 ni a su cara. |
| `vestido-candidato-original.png` | Vestido solo, **candidata de capa** (948 × 1659, mismo lienzo que la base). Se conserva **sin modificar**; SHA-256 `5c0a062f95031e6b6b97a1b4062d3e445e9668b9659466233f2a5692b614106c`. | Prueba de encaje hecha (`montaje/`); **sin aprobación técnica**. |
| `montaje/` | Montaje de prueba sobre la base D-014 y comprobaciones. | Prueba; véase abajo. |

## Qué está aprobado y qué no (D-015)

- **Aprobado (diseño):** el diseño del vestido rosa de princesa y el largo y el ancho que se ven en
  `referencia-muneca-vestida.png`.
- **Sin aprobar (técnica):**
  - la capa del vestido, su encaje sobre la base D-014, sus bordes y su transparencia;
  - la resolución real de 2000 × 3500.
- **La referencia es una imagen generada:** su cara, su cuerpo y su pelo **no** sustituyen a la base aprobada, a su
  carita, a los ojos actuales ni al pelo B.

## Revisión técnica de la referencia (no se corrige, solo se anota)

- Mide 948 × 1660: un píxel más alta que la base D-014.
- Ningún píxel es del todo opaco (la mayoría tienen alfa 252–253), igual que le pasaba al original de la base.
- Tiene halos rojizos alrededor de los rizos y del vestido.
- La cara está en el mismo sitio que en la base, pero no es idéntica píxel a píxel (diferencia media ≈ 17 en la zona
  de la cara). Por eso no se usa como base.

## Prueba de encaje (15/10) · `montaje/`

Programa: `montaje/montaje_vestido.py`. El vestido se coloca **tal cual**, en el mismo lienzo que la base: sin moverlo,
escalarlo, recortarlo ni deformarlo. La cara, el cuerpo y el pelo no se regeneran.

Capas, de abajo arriba:

1. Pelo B detrás.
2. Base sin ojos v3.
3. Ojos (abiertos v3 color experimental / cerrados V2.1).
4. **Vestido**.
5. **Antebrazos y manos copiados de la base sin cambios** (`brazos-delante-copiados-de-la-base.png`, y ≥ 840). Así las
   manos quedan delante de la falda, como en la referencia; no se dibuja nada.
6. Pelo B delante.

| Zona | Resultado |
| --- | --- |
| Cuello | Bien: el escote tapa el cuello de la camiseta. |
| Mangas | Tapan las mangas de la camiseta. |
| Cintura | Bien. |
| Bajo | Bien: no asoman las mallas (0 px) y las piernas se ven por debajo. |
| Manos | Quedan por delante de la falda. |
| Pelo de delante | Queda por delante del vestido. |
| **Axilas** | **Falla**: asoma la camiseta de la base, 731 px entre la manga y el cuerpo, a los dos lados (rojo en `donde-falla.png`). |
| **Hombros** | **Falla**: la capa está **cortada en diagonal** donde la referencia tenía pelo delante. El corte coincide con el pelo de delante, pero deja un **filo claro punteado** y, junto al cuello, se ve sombra de pelo con un borde recto (naranja). |
| **Manchitas** | **Falla**: 241 trozos sueltos (519 px) del halo de la imagen generada fuera del vestido, también sobre el pelo (magenta). |
| Transparencia | Casi ningún píxel del vestido es del todo opaco (alfa ≈ 253). La ropa de la base se transparenta un 1–2 % (1 571 px entre el 1 y el 10 %); no se aprecia a simple vista. |

**No se ha recortado ni deformado nada:** estos fallos se enseñan antes de decidir cómo arreglarlos. Las posibles
soluciones son tres: que la ilustradora complete los hombros y las axilas de la capa, limpiar las manchitas y el alfa
de una copia de trabajo, o una máscara de la camiseta de la base solo en las axilas.

Vistas:

- `vista-montaje-vestido.png`: referencia, antes, prueba con ojos abiertos y con ojos cerrados.
- `vista-zonas.png`: cuello, mangas y axilas, cintura, mano y bajo; antes y después, sobre fondo claro y oscuro.
- `donde-falla.png`.
- Dos GIF de parpadeo.
- `comprobaciones.json`.

En el visor (`../base-aprobada-d013-2026-10-14/visor/`): **Ropa → Vestido rosa (prueba)**.

## Pendiente

1. Que la propietaria decida cómo resolver las axilas, los hombros y las manchitas.
2. Aprobación técnica de la capa (aparte de la del diseño).
3. Resolución real de 2000 × 3500.

No se activa en el juego ni se publica.
