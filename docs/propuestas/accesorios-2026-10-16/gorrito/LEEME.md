# Gorrito de dormir de frente (D-024) · 17/10/2026

> **Diseño frontal aprobado** por la propietaria (17/10). **Encaje candidato, pendiente de revisión.** Nada activado en
> el juego; `main`, las partidas y las pruebas congeladas no cambian. La muñeca y el peinado **no se tocan**.

| Archivo | Qué es |
| --- | --- |
| `referencia-gorrito-de-frente-aprobado.png` | Imagen generada aprobada, **sin modificar** (SHA-256 `9396a81b…2fad`). Solo se toman el gorro y el pompón. |
| `gorrito.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/accesorios-2026-10-16/gorrito/gorrito.py`). |
| `gorrito-recortado.png` | El gorro y el pompón recortados, al tamaño de la imagen. |
| `capa-gorrito.png` | La capa (948 × 1659) sobre nuestra muñeca: encima del pelo de delante, como los demás accesorios. |
| `comparacion-gorrito.png` | Melena con corona · con el gorrito · cobertura marcada · la imagen aprobada a la misma escala. |
| `zonas-sin-cubrir.png` | Ampliado ×2: dónde asoma el pelo de arriba (en magenta). |
| `comprobaciones.json` | Cifras. |

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

## En el visor

Fila «Accesorio de pelo»: **Gorrito de dormir (candidato)**. «Sin accesorio» sigue por defecto y lo quita. Al ponerlo se
quitan la corona y los demás accesorios de cabeza (va uno cada vez); si después se pone la corona, se quita el gorrito.
Está colocado para la melena: con la coleta, elegirlo vuelve a la melena (como los demás accesorios). Sin errores ni
almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo opaco).

## Pendiente

- Decidir qué hacer con el pelo que asoma arriba a la izquierda, y revisar el encaje.
- Colores de pelo y tonos de piel con el gorrito; la coleta con el gorrito; copia de prueba del juego; 2000 × 3500.
