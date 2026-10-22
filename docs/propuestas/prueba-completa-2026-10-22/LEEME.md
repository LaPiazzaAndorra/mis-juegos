# Prueba completa: muñeca nueva con sus conjuntos y adornos + Pintar, Heladería y logros (22/10/2026)

**Copia aislada. No es el juego de Amaia, no está integrada y no cambia nada del juego.** Reúne en una sola versión de
prueba los dos trabajos: la muñeca nueva con todo lo aprobado (rama `avatar-creador`) y la prueba conjunta de Pintar,
Heladería y logros (`461c4f2`, rama `pintar-heladeria`, unida a `avatar-creador` sin cambios).

Datos propios con el prefijo **`com1:`** (no lee ni escribe los del juego ni los de las otras copias: `con1:`, `d026:`,
`pin1:`, `hel1:`, `rec1:`…). Sin service worker (necesita conexión). Manifiesto propio («PRUEBA COMPLETA»).

**Abrir en Safari:** <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-completa-2026-10-22/index.html>
(el enlace fijo, con el hash del commit de esta copia, se anota en `docs/REGISTRO_CAMBIOS.md`).

## Qué junta

| Parte | De dónde sale | Estado |
| --- | --- | --- |
| Pintar, Heladería, logros, voz natural | prueba conjunta `461c4f2` (`../prueba-conjunta-2026-10-22/`) | **Los mismos pasos**: `preparar_copia.py` importa las funciones de su generador y reaplica los de Pintar (`708c2f2`), Heladería (`7aeb5b7`) y logros (`192e9b9`) y los ajustes 2, 4 y 5; comprueba que con la carpeta de la prueba conjunta sale exactamente su `index.html`. `logros.js` es una copia sin cambios. |
| Muñeca | catálogo «todo» de esta carpeta | Piel (4), ojos (4), pelo (5 colores), peinados (melena, coleta con y sin cinta, dos coletas con y sin sombrero); ropa: vestido rosa con sus zapatos, camiseta, **conjunto de aventura** (D-027, con su mochila A y tiras nuevas, o sin ella), **pijama** (D-028, camiseta con el borde limpio) y **hada** (D-029, alas del diseño y varita con mano de agarre; sin varita, la mano original); adornos (D-024, D-021): corona, lazo, flores, mariposa, diadema, gorrito, gorra, dos lazos pequeños y pintacaras. |

## Cómo se ha hecho la muñeca (sin dibujar nada nuevo)

- `capas-del-visor.js` abre el visor aprobado (`base-aprobada-d013-2026-10-14/visor/`) y anota, para cada ropa (y sus
  variantes con o sin mochila, alas o varita) × peinado × piel × color de pelo (900 combinaciones), las capas que se ven,
  en su orden; y, para cada adorno con cada peinado (con y sin corona), lo que se queda y sus capas: `capas-del-visor.json`.
- `preparar_copia.py` convierte esas capas en **recetas** del catálogo y en piezas WebP sin pérdida recortadas a su
  contenido (`avatar/arte/todo/`); el motor de la copia dibuja la receta y añade los ojos, los párpados, el pintacaras y los
  adornos con la colocación de cada peinado. Las capas aprobadas no se tocan.

## «Vestir» en esta copia

- Al elegir el **conjunto de aventura** se pone su mochila; al elegir el **hada**, sus alas y su varita. Se quitan y se
  ponen en «Adornos» (sin la varita vuelve la mano original).
- «Adornos» solo ofrece los que van con el peinado y la ropa elegidos (como en el visor; **no se cambia de peinado
  solo**): con la coleta con cinta no hay diadema; con las dos coletas con sombrero, ni diadema ni corona; los gorros, solo
  con la melena; los dos lazos pequeños, solo con las dos coletas. Si al cambiar de peinado un adorno deja de ir, se quita
  avisando («Se ha quitado: …»). La corona no va con la diadema, el gorrito ni la gorra (queda lo último elegido).

## Pruebas (Chromium; iPhone e iPad simulados)

```bash
python3 -m http.server 8765 & python3 -m http.server 8766 &
node docs/propuestas/prueba-completa-2026-10-22/capas-del-visor.js      # solo si cambia el visor (usa el 8766)
python3 docs/propuestas/prueba-completa-2026-10-22/preparar_copia.py    # regenera la copia
node docs/propuestas/prueba-completa-2026-10-22/prueba-completa.js      # muñeca + Pintar, Heladería y logros
```

Resultado 22/10/2026: **23/23** de la muñeca (900 recetas y 160 casos de adornos iguales al visor; 539 piezas que cargan;
8 combinaciones a tamaño real, diferencia máxima 4 por redondeo; «Vestir» de verdad, parpadeo, guardar y reabrir,
«Mi Mundo», datos ajenos intactos, iPhone horizontal e iPad) y **37/37** de Pintar, Heladería y logros (la prueba de la
copia conjunta, sin cambiar ninguna comprobación, sobre esta copia y su prefijo `com1:`).

**No probado:** en un iPhone o iPad reales, con la app instalada ni sin conexión; las voces reales del iPhone.

## Cómo probarla en el iPhone

Abrir el enlace en Safari, «Compartir → Añadir a pantalla de inicio» (sale como «PRUEBA COMPLETA»), y recorrer:
«Vestir» (pieles, ojos, colores y peinados; vestido, camiseta, aventura con y sin mochila, pijama con el gorrito, hada con
y sin alas y varita; adornos con cada peinado), guardar y ver la muñeca en «Mi Mundo»; pintar y guardar; abrir una
lámina nueva; servir pedidos y jugar libre; en 🏅 «Mis logros», hacer los retos, marcar una tarea y confirmarla en
👪 «Adultos» (código de 4 cifras propio de esta copia), abrir el cofre y elegir un premio; escuchar la voz y silenciarla
con 🔇; «Guardar mi progreso».

## Pendiente (decide la propietaria)

La prueba en su iPhone; la resolución de 2000 × 3500; umbrales y premios definitivos de los logros; la integración en el
juego de verdad (catálogo `premium`, `arte/originales/`, `optimizar.py` y versión de `sw.js`).
