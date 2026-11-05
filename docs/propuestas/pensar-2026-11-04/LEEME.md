# Juegos de pensar: Contar y Memoria más retadores (04/11/2026)

**Copia aislada. No es el juego de Amaia, no está integrada y no cambia nada del juego ni de `main`.**
Rama `juegos-pensar` (creada desde `avatar-creador` `6a91012`). Datos propios con el prefijo `pen1:`.

Pedido de la propietaria (04/11/2026): «Retomamos los juegos de pensar. A Amaia le gustan todos, pero los resuelve
demasiado rápido. […] Prepara una copia aislada con mejoras en Contar y Memoria […] Muéstrame una primera versión
jugable antes de ampliar al resto. Protege las partidas y el funcionamiento sin conexión. No publiques en main todavía
ni modifiques los archivos en los que esté trabajando el otro chat.»

## Fases y estado

| Fecha | Fase | Estado |
| --- | --- | --- |
| 04/11/2026 | Primera versión jugable de Contar y Memoria en copia aislada | Probada en Chromium (52/52); **pendiente de probar en el iPhone** y de la valoración de la propietaria. |
| Al integrar | Pasar Contar y Memoria al juego (`index.html`, generador de publicación, versión de `sw.js`) | Lo coordina la propietaria. |

## De dónde parte

La copia es el **juego publicado** (`main` `031ce07` = la prueba completa `4d950bc`: muñeca nueva, Pintar, Heladería,
logros, voz natural) con **tres archivos nuevos** cargados al final: `pensar.css`, `dibujos.js` y `pensar.js`.
`preparar_copia.py` reutiliza los pasos de la prueba completa y **comprueba** que el resultado es igual a ella salvo la
carpeta, el título y esos tres archivos. No cambia ningún otro archivo del repositorio.

Hoy, en el juego publicado: **Contar** pide de 1 a 10 objetos (emojis) con 3 respuestas; cada acierto da +1 ⭐ y sube
`lv_contar`, y cada fallo lo baja. **Parejas** tiene 3, 6 u 8 parejas de emojis que se eligen a mano (no se guardan).

## Qué cambia en esta copia

En el menú Pensar, «Parejas» pasa a ser **Memoria** (tres juegos) y **Contar** es nuevo. «¿Qué sigue?», «Sombras» y «El
diferente» siguen como hoy.

### Contar: 10 pasos

| Nivel | Qué se pide | Cómo se ve |
| --- | --- | --- |
| 1 | contar hasta 5 | 3 respuestas |
| 2 | contar hasta 10 | 3 respuestas |
| 3 | contar de 9 a 15 | en filas de 5 y grupos de 10 |
| 4 | contar de 12 a 20 | en filas de 5 y grupos de 10 |
| 5 | **sumar** (hasta 6): «Hay 3 fresas. Llegan 2 más. ¿Cuántas hay ahora?» | dos grupos con un «+»; 4 respuestas |
| 6 | **quitar** (hasta 6): «Hay 6 globos. 2 se van volando. ¿Cuántos quedan?» | los que se van se aclaran |
| 7 | **¿cuántos faltan?** (hasta 10): «Queremos 7 estrellas. Hay 4.» | huecos vacíos para los que faltan |
| 8 | sumar y quitar hasta 10 | |
| 9 | ¿cuántos faltan? sin huecos | el número que queremos, en grande |
| 10 | todo mezclado hasta 20 | |

- **Variedad:** 20 dibujos, colocación en filas o «suelta», respuestas cercanas (por ejemplo, 6, 7, 8 y 10, o el número de
  uno de los grupos) para que no se acierte por tamaño. Desde el nivel 3, uno de cada cuatro ejercicios aproximadamente es
  un **repaso** de un nivel anterior (no cuenta para subir ni bajar).
- Se sigue pudiendo **tocar cada dibujo para contarlo** (como hoy) y 🗣️ repite la pregunta.

### Memoria: tres juegos

- **Parejas:** de **3 a 12 parejas** (3, 4, 6, 8, 10 y 12), con botones para elegir el tamaño, como hoy. Al terminar dos
  tableros bien resueltos se pasa al siguiente tamaño.
- **¿Dónde estaba?** (recordar posiciones): se ven unos dibujos en un tablero; cuando quiere, toca **«🙈 ¡Ya me acuerdo!»**,
  se tapan y se le pregunta «¿Dónde estaba el pollito?». 7 niveles: de 2 dibujos en 2 × 2 a 8 dibujos en 4 × 4, con
  1 a 3 preguntas por ronda.
- **Repite la serie** (secuencias): unos botones con dibujos se iluminan y suenan en orden; luego los repite. 8 niveles:
  de 3 botones y 2 pasos a 6 botones y 7 pasos. 👂 la enseña otra vez.

### Reglas comunes

- **Sin cronómetro:** nada se acaba por tiempo y **la rapidez no cuenta** para nada. En «¿Dónde estaba?» los dibujos se
  ven hasta que ella decide taparlos; en «Repite la serie» la demostración va siempre al mismo ritmo.
- **Sube tras varios aciertos:** un ejercicio cuenta como bien hecho si sale a la primera o con un solo fallo, sin pista.
  Contar, «¿Dónde estaba?» y la serie suben tras **3** bien hechos seguidos en ese nivel; las parejas, tras **2** tableros.
- **Pistas cuando se atasca:**
  - Contar: al primer fallo, «¡Casi!» con una ayuda («Cuenta todos juntos», «Cuenta solo los que quedan», «Cuenta los
    huecos vacíos»…) y esa respuesta se aparta. Al segundo, se cuentan uno a uno en voz alta y brilla la buena.
  - Parejas: tras 3 fallos seguidos, asoma una pareja un momento.
  - «¿Dónde estaba?»: se ve qué había en la casilla tocada; al segundo fallo brilla la buena. «👀 Mirar otra vez» vuelve
    a enseñarlo todo.
  - Serie: al fallar se enseña otra vez; al segundo fallo brilla el siguiente botón.
- **Si se atasca 3 veces seguidas** en un nivel, sigue en el nivel anterior, sin avisos. Lo alcanzado (los puntos de
  arriba) no se pierde.
- **Sin castigos ni pérdida de premios:** los fallos no quitan estrellas ni logros.
- **Estrellas como hoy, sin premios nuevos por respuesta:**
  - Contar: +1 ⭐ por acierto, igual que ahora.
  - «¿Dónde estaba?» y la serie: +1 ⭐ por ronda completa, no por cada respuesta.
  - Parejas: 2, 3 o 5 ⭐ por tablero, como ahora.
  - Subir de nivel solo trae confeti y una frase.
- **Logros sin cambios:** `logros.js` es el mismo; responder no da logros. El reto «Contar» de «Mis logros» sigue igual.
- **Prueba rápida (⏩ «Saltar lo fácil»):**
  - La primera vez que se entra en Contar, «¿Dónde estaba?» o la serie, se ofrece «Prueba rápida» o «Empezar».
  - La prueba pone un ejercicio de cada nivel, de menos a más. Contar prueba los niveles 2, 4, 5, 6, 7 y 9; los otros
    dos juegos, unos tres niveles. Se para al primero que no sale (dos fallos) y se empieza en el último superado.
  - Solo puede **subir** el nivel, nunca bajarlo. Se puede repetir cuando se quiera con el botón.
- **El avance se guarda** y al volver se sigue donde estaba (no se empieza por lo fácil). Arriba se ve el camino de
  niveles: «Nivel 5 de 10 · sumar».
- **Dibujos propios en SVG** con el estilo de las ilustraciones de la app (trazo violeta, colores pastel, caritas), no
  emojis: manzana, fresa, estrella, flor, pez, mariposa, globo, mariquita, pollito, magdalena, corazón, nube, luna, sol,
  helado, seta, caracol, gatito, osito y hoja. Van dentro de los archivos: **no hay nada que descargar** (sirve sin
  conexión cuando se integre; la copia, como todas, no instala service worker).

![Contar en el iPhone](capturas/contar-iphone.png)
![Memoria en el iPhone](capturas/memoria-iphone.png)
![iPhone en horizontal](capturas/iphone-horizontal.png)

## Datos

- Todo va con el prefijo `pen1:` (`aislamiento.js`); sin service worker; manifiesto propio («PRUEBA PENSAR»).
- **Claves nuevas**, todas con el prefijo `lv_`, que «Guardar / Recuperar mi progreso» ya incluye sin cambiar
  `progreso.js`: `lv_contar2`, `lv_parejas`, `lv_donde` y `lv_serie`, con la forma `{v:1, L, max, ok, apuros, prueba}`.
  Si alguna vez llegan con valores raros, se corrigen al leerlas.
- La clave antigua **`lv_contar` no se cambia ni se borra**: solo se lee la primera vez. Quien ya contaba hasta 9 o 10 en
  el juego (`lv_contar` ≥ 6) empieza en el nivel 2.
- Ninguna otra clave cambia: estrellas (solo suman), dibujos, Heladería, personaje, escenas, logros, voz y sonido.

## Pruebas (Chromium; iPhone e iPad simulados, app instalada y hoja de compartir simuladas)

```bash
python3 -m http.server 8765 &
python3 docs/propuestas/pensar-2026-11-04/preparar_copia.py      # regenera index.html, progreso.js y logros.js
node docs/propuestas/pensar-2026-11-04/prueba-pensar.js          # 52 comprobaciones
```

Resultado 04/11/2026: **52/52**. Comprueba:
- **La copia:** es la prueba completa más tres archivos; fuera de su carpeta no cambia nada.
- **Datos:** datos propios; los que ya había no cambian y el juego y las otras copias quedan intactos.
- **Contar:** 3000 ejercicios generados, con la respuesta igual a lo que se ve, opciones sin repetir y frases bien
  escritas. Sube tras 3 aciertos, sin cronómetro, con las dos pistas, retrocede tras 3 atascos sin perder lo alcanzado y
  recuerda el nivel al volver. La prueba rápida sube de nivel y nunca baja.
- **Memoria:**
  - Parejas: de 3 a 12, sube de tamaño y da la pista.
  - «¿Dónde estaba?»: no se tapa sola, da +1 ⭐ por ronda, sube de nivel, da la pista y deja mirar otra vez.
  - Serie: demostración, +1 ⭐ por serie, sube de nivel, pistas y prueba rápida.
  - Los tres recuerdan el nivel al volver.
- **Copia de seguridad:** guarda y recupera el avance nuevo; importarla dos veces no cambia nada.
- **El resto, como hoy:** «¿Qué sigue?», «Sombras» y «El diferente» funcionan; el reto de logros no cambia y Contar no
  da logros.
- **Sin emojis ni descargas externas.**
- **Pantallas:** todo a la vista en iPhone e iPad, vertical y horizontal, con botones de 44 px o más y sin solaparse.
- **Sin errores de JavaScript.**

Además, sin cambios y correctas: `pruebas/prueba-juego.js` 21/21, `pruebas/prueba-copia.js` 45/45 y la prueba
completa (`prueba-completa.js`) 23/23 + 37/37.

**No probado:** en un iPhone o iPad reales, con la app instalada, ni sin conexión. La voz real del iPhone tampoco (en
Chromium está simulada).

## Cómo probarla en el iPhone

1. Abrir el enlace fijo en Safari (abajo) y, si se quiere, «Compartir → Añadir a pantalla de inicio» (sale como
   «PRUEBA PENSAR»). Tiene sus propios datos, separados de los de Amaia.
2. **Pensar → Contar** → «Prueba rápida» (o «Empezar»). Probar a fallar dos veces para ver la pista.
3. **Pensar → Memoria** → Parejas (elegir 10 o 12), «¿Dónde estaba?» y «Repite la serie».
4. Salir y volver a entrar: cada juego debe seguir en su nivel.

Enlace fijo (commit `5390dfc`): <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/5390dfc72baa906c6dacd8a147432bd473e20df5/docs/propuestas/pensar-2026-11-04/index.html>

## Pendiente (decide la propietaria)

- La valoración en el iPhone con Amaia: si los saltos de nivel y las pistas van bien, o hay que ajustar cuántos aciertos
  hacen falta para subir (3, o 2 en las parejas).
- Si se mantiene +1 ⭐ por acierto en Contar, como hoy.
- Ampliar después a «¿Qué sigue?», «Sombras» y «El diferente».
- La integración en el juego, que coordina la propietaria. Habría que cambiar `index.html` con estos tres archivos, el
  generador de publicación (que está en la rama del otro chat) y la versión de `sw.js` para la caché sin conexión.
  `ESTADO_ACTUAL.md`, `REGISTRO_CAMBIOS.md`, `MANUAL_PROYECTO.md` y `HOJA_DE_RUTA.md` son documentos compartidos con el
  otro chat: esta fase queda documentada aquí y se pasará a ellos al integrar.
