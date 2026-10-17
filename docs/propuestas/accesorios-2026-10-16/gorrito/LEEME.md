# Gorrito de dormir de frente (D-024) · 17/10/2026

> **Diseño frontal aprobado** por la propietaria (17/10). **Encaje candidato, pendiente de revisión.** Hay dos
> candidatos: **A** (con la escala de los ojos) y **B** (un 8 % más grande, ver abajo). Nada activado en
> el juego; `main`, las partidas y las pruebas congeladas no cambian. La muñeca y el peinado **no se tocan**.

| Archivo | Qué es |
| --- | --- |
| `referencia-gorrito-de-frente-aprobado.png` | Imagen generada aprobada, **sin modificar** (SHA-256 `9396a81b…2fad`). Solo se toman el gorro y el pompón. |
| `gorrito.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/accesorios-2026-10-16/gorrito/gorrito.py`). |
| `gorrito-recortado.png` | El gorro y el pompón recortados, al tamaño de la imagen. |
| `capa-gorrito.png` | La capa (948 × 1659) sobre nuestra muñeca: encima del pelo de delante, como los demás accesorios. |
| `comparacion-gorrito.png` | Melena con corona · con el gorrito · cobertura marcada · la imagen aprobada a la misma escala. |
| `zonas-sin-cubrir.png` | Ampliado ×2: dónde asoma el pelo de arriba (en magenta). |
| `comprobaciones.json` | Cifras (A). |
| `gorrito_grande.py` | Variante B (desde la raíz: `python3 docs/propuestas/accesorios-2026-10-16/gorrito/gorrito_grande.py`). |
| `capa-gorrito-b.png` | Candidato B: el mismo recorte, ×1,08 y 8 px a la izquierda. |
| `antes-despues-gorrito.png`, `zonas-sin-cubrir-b.png` | A y B montados y con la cobertura marcada (magenta: pelo sin cubrir; rojo: cejas); y ampliado ×2 arriba a la izquierda. |
| `comprobaciones-b.json` | Cifras de B, de A medidas igual y de todas las pruebas válidas. |

## Cómo se ha hecho

1. **Gorro:** semillas de tela azul y de ala rosa; fondo, piel y pelo como semillas contrarias; reparto por contraste.
   Las estrellas y lunas, encerradas por la tela, son parte del gorro.
2. **Pompón** (crema sobre fondo crema): lo que se distingue del fondo en su círculo, sin el pelo que asoma detrás.
3. **Borde de abajo del ala:** en la imagen, algunos mechones caen en diagonal por delante del ala y la dejaban con
   muescas en escalera, motas marrones y huequecitos. En los dos lados, el borde pasa por una curva suave por las esquinas
   de fuera de los escalones, y lo que faltaba se rellena con la textura rosa del ala de justo encima. En el centro, sobre
   la frente, el borde es el de la imagen.
4. **Sin pelo ni piel de la imagen:** borde suave de 1 px, quitando el color del fondo, la piel o el pelo de alrededor.
5. **Encaje:** con la escala y la posición de los ojos (iris medidos con círculos: imagen (576, 622) y (827, 622);
   nuestra muñeca (391, 444) y (565, 444); escala 0,693), sin deformar ni el gorro ni la cabeza.

## Comprobaciones (`comprobaciones.json`)

- **Cejas libres:** el gorro no toca las cejas (0 px); el borde del ala queda a 6 px de ellas como mínimo, como en la
  imagen aprobada.
- **Rizos de los lados:** se conservan; el pompón cuelga a la derecha y tapa solo 1 295 px de rizos (de 261 464).
- **Pelo de arriba:** el gorro cubre el **95,9 %**. **No cubre del todo:**
  - **arriba a la izquierda** asoma una franja fina de rizos por fuera del gorro, de la sien a lo alto de la cabeza
    (x 181–342, y 136–359; 3 201 px), de hasta 22 px de grosor (el 95 %, ≤ 15 px);
  - un mechoncito encima, a la izquierda de la punta (x 352–434, y 87–132; 527 px);
  - y restos de 1–3 px junto a los extremos del ala (≤ 200 px).
  Marcado en `zonas-sin-cubrir.png`. **El peinado no se ha tocado.** Nuestra melena es más ancha arriba a la izquierda
  que la de la imagen. Opciones posibles, **pendientes de decidir:** un gorro algo más grande (probado sin guardar: un
  6 % más grande deja 623 px; un 9 %, 131 px; el borde del ala bajaría de 7 a 11 px en el centro y habría que revisar las
  cejas), o recortar esos rizos del peinado (no hecho), o dejarlo así.
- La frente que tapa el ala es la de nuestra base (como en la imagen aprobada). Fuentes sin cambios.

## Variante B: un 8 % más grande (17/10, `gorrito_grande.py`)

La propietaria pide probar el gorrito **un 6–9 % más grande**, ajustando su posición para cubrir el pelo de arriba y
dejar las cejas libres, **sin recortar ni deformar el peinado**.

- **Búsqueda:** el mismo recorte, solo escalado (×1,06 a ×1,09, de 0,005 en 0,005) y desplazado (−16 a +16 px en
  horizontal; −24 a +12 px en vertical): 2 261 pruebas (723 cumplen las condiciones y 293 de ellas cubren el pelo). Condiciones: no toca las cejas y queda al menos a 6 px de ellas,
  no tapa los ojos y cabe entero en el lienzo (con ×1,09 sin mover, el pompón se salía por la derecha y se cortaba).
- **Elección:** muchas posiciones cubren el pelo de arriba (≤ 150 px sin cubrir, solo restos de 1–2 px). La que más
  cubría subía el ala hasta 23 px por encima de las cejas (mucha frente a la vista); se elige la que deja **el ala lo más
  baja posible**, es decir, más parecida al A: **×1,08 y 8 px a la izquierda, sin subir ni bajar** (escala final 0,749).
- **Resultado (B / A):**

  | | A | B |
  | --- | --- | --- |
  | Pelo de arriba cubierto | 95,9 % (4 403 px sin cubrir; franja de hasta 22 px arriba a la izquierda) | **99,9 %** (146 px: restos de 1–5 px junto al extremo derecho del ala) |
  | Cejas | libres, a 6,3 px | **libres, a 14,6 px** |
  | Borde de abajo del ala (mediana) | y = 359 | y = 353 (unos 6 px más arriba; en el centro, sobre la frente) |
  | Rizos de los lados tapados (pompón) | 1 295 px | 427 px |
  | Ojos | libres | libres |

- **Lo que cambia:** para cubrir el pelo, el ala no puede quedar tan cerca de las cejas como en el A: la posición más
  baja que cubre deja 14,6 px (en ninguna de las pruebas que cubren queda más cerca). Se ve algo más de frente bajo el
  ala. El pompón queda a 5 px del borde derecho del lienzo.
- **Peinado y cabeza sin cambios;** el A (`capa-gorrito.png`) se conserva igual. Queda, en los dos, una línea clara muy
  fina en el borde izquierdo del ala, solo visible ampliada.

## En el visor

Fila «Accesorio de pelo»: **Gorrito de dormir · A (candidato)** y **Gorrito de dormir · B, 8 % más grande
(candidato)**. «Sin accesorio» sigue por defecto y lo quita (cualquiera de los dos). Al ponerlo se
quitan la corona y los demás accesorios de cabeza (va uno cada vez); si después se pone la corona, se quita el gorrito.
Está colocado para la melena: con la coleta, elegirlo vuelve a la melena (como los demás accesorios). Sin errores ni
almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo opaco).

## Pendiente

- Revisar el encaje y elegir entre A y B.
- Colores de pelo y tonos de piel con el gorrito; la coleta con el gorrito; copia de prueba del juego; 2000 × 3500.
