# Medidas provisionales de la base D-014 · 14/10/2026

Medidas de la **copia técnica** `../base-transparencia-corregida.png` a su resolución nativa
(**948 × 1659**), para preparar las capas. **Provisionales:** no sustituyen a
`plantilla/plantilla.js` ni a las guías V2.1 que usa el juego, y no resuelven la resolución final
(cuando exista la base de 2000 × 3500 habrá que volver a medir).

| Archivo | Qué es |
| --- | --- |
| `medir.py` | Programa reproducible: `python3 docs/propuestas/base-aprobada-d013-2026-10-14/medidas/medir.py` (desde la raíz). Solo lee la imagen. |
| `medidas-provisionales.json` | Todas las medidas, cada una con `tipo` (automática / estimada) y `metodo`. |
| `guia-provisional.png` | Capa transparente de 948 × 1659 con la guía, para ponerla encima de la base. |
| `guia-sobre-base.png`, `guia-ampliaciones.png` | Vistas para revisar la alineación (base aclarada + guía; ampliaciones ×3). |

**Leyenda:** azul y línea continua / punto relleno = **detectada automáticamente**; naranja y línea
discontinua / círculo hueco = **estimada** (regla en `metodo`, revisar a ojo); rojo = eje central.

## Resultado (píxeles del lienzo de 948 × 1659)

| Medida | Valor | Tipo |
| --- | --- | --- |
| Eje central | x = 479 (el lienzo está centrado en 474: la figura está 5 px a la derecha) | automática |
| Coronilla / barbilla / suelo | y = 174 / 601 / 1538 | automática |
| Centros de los ojos (iris) | (391, 443) y (566, 443), radio del iris 31; separación 175 | automática |
| Cuello más estrecho | y = 613, x 431–524 | automática |
| Hombros (esquina del contorno) | (329, 692) y (629, 695) | automática |
| Axilas | y = 810 | automática |
| Cadera | y = 1026, x 331–626 | automática |
| Entrepierna | y = 1035 | automática |
| Tobillos | y = 1399, x 389,5 y 574,5 | automática |
| Puntas de las manos | (201, 1083) y (758,5, 1085) | automática |
| Hombros (estimación, sin validar) | (351,5, 751) y (605,5, 752,5) | estimada |
| Codos (estimación, sin validar) | (295,5, 897) y (660,5, 899) | estimada |
| Centro de las manos | (209, 1043) y (751, 1045) | estimada |
| Bajo de la camiseta (prenda) | y = 988 | automática |
| Cintura anatómica (sin validar) | y = 945 (60 % de axilas a entrepierna; no se ve: la tapa la camiseta) | estimada |
| Rodillas (estimación, sin validar) | y = 1217, x 401,5 y 559 | estimada |

**Hombros, codos, rodillas y cintura anatómica son estimaciones sin validar** (`validada: false`):
se comprobarán al separar o animar las piezas. No son articulaciones validadas. El bajo de la
camiseta es un rasgo de la ropa, no la cintura.

Proporción: altura 1364 px, cabeza 427 px → **3,19 cabezas de alto** (nenita, D-013).
