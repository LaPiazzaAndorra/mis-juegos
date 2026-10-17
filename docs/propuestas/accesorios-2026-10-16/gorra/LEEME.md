# Gorra rosa de frente con el rayo bordado (D-024) · 17/10/2026

> **Diseño frontal aprobado** por la propietaria (17/10). **Encaje aprobado visualmente (17/10).** Bordes revisados
> con los 5 colores de pelo y los 4 tonos de piel: sin defectos. Nada activado en
> el juego; `main`, las partidas y las pruebas congeladas no cambian. La muñeca y el peinado **no se tocan**.

| Archivo | Qué es |
| --- | --- |
| `referencia-gorra-de-frente-aprobada.png` | Imagen generada aprobada, **sin modificar** (SHA-256 `09743e9d…81c0a`). Solo se toma la gorra. |
| `gorra.py` | Programa reproducible (desde la raíz: `python3 docs/propuestas/accesorios-2026-10-16/gorra/gorra.py`). |
| `gorra-recortada.png` | La gorra recortada (copa, visera, botón, rayo y la pestaña lila del lateral), al tamaño de la imagen. |
| `capa-gorra.png` | La capa (948 × 1659) sobre nuestra muñeca, encima del pelo de delante (como los demás accesorios). |
| `comparacion-gorra.png` | Melena con corona · con la gorra · cobertura marcada (azul gorra, magenta pelo sin cubrir, rojo cejas) · la imagen aprobada a la misma escala. |
| `comprobaciones.json` | Cifras. |
| `revisar_gorra.py`, `revision/` | Revisión de los bordes con los 5 colores de pelo y los 4 tonos de piel sobre la melena (vistas y cifras). |

## Cómo se ha hecho

1. **Solo la gorra:** semillas del rosa de la gorra y del lila de la pestaña; fondo, piel y pelo como semillas
   contrarias; reparto por contraste. El rayo y las costuras son parte de la gorra. Borde suave de 1 px sin el color de
   alrededor (sin halo). El borde de la visera sale liso (en la imagen no había mechones por delante).
2. **Encaje:** se parte de la escala de los ojos (iris medidos: imagen (582, 623) y (828, 621); nuestra muñeca (391, 444) y
   (565, 444)). Así, sin mover, **la visera tapaba las cejas** (145 px): nuestra melena tiene más volumen arriba que la
   muñeca de la imagen. Se busca la escala (×0,94 a ×1,14) y el desplazamiento, **solo escalando y moviendo la gorra**.
   - «Pelo de arriba»: una **zona fija**, todo el pelo por encima de y = 300 (lo alto de la cabeza hasta las sienes).
     Medido como con el gorrito (el pelo por encima del borde de la gorra), subir la gorra parecía cubrir mejor, porque
     menos pelo quedaba «por encima».
   - Condiciones: cejas libres (al menos 6 px), ojos libres, la gorra entera en el lienzo y **centrada en la cara** (el
     rayo en el eje, ±6 px). Sin centrarla, lo que más cubría era ×1,14 desplazada 28 px a la izquierda y pegada al borde
     de arriba del lienzo; se descartó.
   - Elegida: **×1,10 (escala final 0,778), centrada (0 px) y 4 px más abajo**. Es también la posición más parecida a la
     imagen aprobada: la visera justo por encima de las cejas.

## Comprobaciones (`comprobaciones.json`)

- **Pelo de arriba cubierto: 99,99 %** (9 px sin cubrir de 76 992, restos de 1–4 px).
- **Cejas libres:** a 6,3 px de la visera, como en la imagen aprobada. Ojos libres.
- **Rizos de los lados:** se conservan (la gorra no tapa ninguno por debajo de su borde); por debajo de la visera, a los
  lados, se ve el pelo de las sienes, como en la imagen.
- La frente que tapa la visera es la de nuestra base. Fuentes sin cambios. Bordes revisados ampliados en fondo claro y
  oscuro, sin halos.

## Revisión de los bordes (17/10, `revisar_gorra.py`, `revision/`)

Con el encaje aprobado (la capa no cambia), las 20 combinaciones de piel y color de pelo sobre la melena
(`combinaciones-melena.png`) y el detalle a tamaño real del lado izquierdo con la visera, la visera sobre la frente y el
lado derecho con la pestaña lila, en fondo claro y oscuro (`detalle-bordes.png`). **Sin defectos:** no hay halo claro ni
oscuro en el borde. En el borde semitransparente (1 092 px) solo aparecen puntos sueltos de 1 px más claros (41–73) o
más oscuros (88–122) que lo de alrededor, en número parecido en todas las combinaciones: son del propio contorno de la
gorra y no se ven ni ampliados. **No se corrige nada.**

## En el visor

Fila «Accesorio de pelo»: **Gorra rosa del rayo (aprobada)**. «Sin accesorio» sigue por defecto y la quita. Al ponerla
se quitan la corona y los demás accesorios de cabeza (va uno cada vez); si después se pone la corona, se quita la gorra.
Está colocada para la melena: con la coleta, elegirla vuelve a la melena. Probado con las 20 combinaciones de piel y
pelo; sin errores ni almacenamiento; a tamaño real coincide con el montaje (≤ 2 en lo opaco).

## Pendiente

- La adaptación a la coleta (más adelante); copia de prueba del juego; 2000 × 3500.
