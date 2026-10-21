# Actividades educativas, logros y desbloqueos · propuesta (21/10/2026, revisada 21:15)

**Solo propuesta: no hay código.** No cambia la economía de estrellas, el guardado, los catálogos ni ningún archivo del
juego o compartido. Las referencias de Pintar (`708c2f2`) y de la Heladería (`7aeb5b7`) siguen congeladas.
Rama `pintar-heladeria`. **La propietaria coordina** cuándo y cómo se hace cualquier cambio en archivos compartidos, en
los catálogos o en el guardado (apartado 7); aquí solo se indica qué haría falta.

**Revisión 21:15 (preferencias de la propietaria):** un **único contador de logros** (retos terminados y tareas
confirmadas), separado de las estrellas; no se reparten tareas entre conversaciones; **ni se retiran piezas del catálogo
ni se cambia `normalizar()`** (no hace falta, apartado 4); cómo **evitar duplicados al guardar y recuperar**
(apartado 6); y una **primera prueba pequeña** con premios provisionales que no bloquea nada aprobado (apartado 8).
La versión anterior está en el historial de Git (commit `bacbc3a`).

## 0. Lo que hay hoy (comprobado en el código)

- **Estrellas** (`stars`, `addStar`): +1 por pedido correcto en la Heladería; +1 al guardar el primer personaje en Vestir;
  Parejas +2/+3/+5 según el tamaño; Contar, ¿Qué sigue?, Sombras y El diferente +1 por acierto (fallar baja un poco el nivel
  `lv_<juego>`, pero **nunca quita estrellas**). Solo se cuentan y se enseñan: **no se gastan ni desbloquean nada**.
- **Monedas** de la Heladería (`iceCoins`): tampoco se gastan.
- **Armario:** en el juego, la muñeca provisional y la vectorial, con todo disponible. La muñeca nueva (D-014 a D-028:
  vestido rosa, zapatos, corona, colores de piel, pelo y ojos, pintacaras, tres peinados, accesorios, conjunto de aventura
  y pijama) está en propuestas, también sin bloqueos.
- **`Avatar.normalizar()`** (`avatar/motor.js`) cambia por el valor por defecto, o quita, solo los identificadores que
  **no están en el catálogo**. Lo que está en el catálogo lo conserva tal cual.

## 1. Principios

1. **Esfuerzo, no acierto:** el logro llega por **terminar** una actividad corta, no por hacerla perfecta.
2. **Nunca se pierde nada:** ni estrellas, ni logros, ni premios desbloqueados, ni por fallar ni por recuperar una copia.
3. **Breve:** cada actividad dura 2–3 minutos (5 rondas) y termina sola con una celebración.
4. **Sin leer:** todo con voz, dibujos y números grandes; los textos son para el adulto.
5. **Sin tienda ni gasto:** los premios se **alcanzan**, no se compran.
6. **Un solo contador de logros, separado de las estrellas** (apartado 2).
7. **Nada aprobado se bloquea:** el armario actual y todo lo aprobado siguen gratis (apartado 4).
8. **Las tareas reales solo cuentan si las confirma un adulto** (apartado 5).

## 2. Estrellas de juego y logros: dos contadores, nada más

| | **Estrellas de juego** ⭐ | **Logros** 🏅 (un solo contador) |
| --- | --- | --- |
| Qué miden | Que juega | Que **practica** y que **ayuda en casa** |
| Cómo se ganan | Como hoy, sin cambios | +1 por **terminar un reto** educativo; +1 por cada **tarea real confirmada** por un adulto |
| Se pierden | Nunca (como hoy) | Nunca |
| Para qué sirven | Solo para verlas (como hoy) | Abren los premios del camino (apartado 4) |
| Dónde se ven | La barra de arriba, como hoy | Junto a las estrellas (🏅 7) y en el álbum «Mis logros» |

- Amaia ve **un solo número** de logros. Por dentro cada logro guarda de dónde viene (reto o tarea) para que el adulto lo
  vea y para evitar duplicados (apartado 6), pero **no hay dos contadores**.
- **Los retos educativos no dan estrellas**, solo logros. Los juegos actuales siguen dando estrellas, sin cambios.
- **Por qué separados:** si los premios dependieran de las estrellas, jugar mucho a la Heladería abriría premios sin
  practicar, y cualquier cambio en la economía de los juegos alteraría los premios.

## 3. Actividades breves («Retos del día»)

Un botón nuevo abre **cuatro retos**, cada uno con su dibujo: **Contar**, **Letras**, **Memoria** y **Colores**. Cada reto:
**5 rondas**, voz en cada ronda, dificultad que sube sola y no baja, y al terminar **+1 logro** con confeti, aunque haya
fallado rondas.

**Al equivocarse** (igual en todos): sonido suave y «¡Casi! Prueba otra vez»; al 2.º intento, una pista (la opción buena
brilla o la voz ayuda); al 3.º, se resuelve juntos («Mira, era esta») y se pasa a la siguiente ronda. Nunca se quita nada
ni se repite el reto entero.

| Reto | Nivel 1 | Siguientes niveles | Reutiliza |
| --- | --- | --- | --- |
| **Contar** | Contar 1–5 cosas y tocar el número (con puntos) | 1–10; «pon 3 bolas en el helado»; ¿dónde hay más? | Contar de Pensar y la Heladería |
| **Letras** | Vocales A E I O U: oír y tocar la letra | Letras de **AMAIA**; con qué letra empieza (oso, sol, luna…); su nombre en orden | Nuevo (solo mayúsculas al principio) |
| **Memoria** | Parejas de 3 (6 cartas) | ¿Qué falta? (3 dibujos, se tapa uno); el pedido tapado de la Heladería | Parejas y Heladería |
| **Colores** | Tocar el color que se dice (6 colores) | Claros y oscuros; mezclas (rojo + amarillo = naranja); «pinta el globo de azul» | Paleta y láminas de Pintar |

- **Como mucho 1 logro por reto y día** (4 al día por retos), para que sea breve y no una carrera; se puede seguir jugando
  sin más logros ese día. Decisión de la propietaria.
- Las letras y colores nuevos necesitan voz en castellano (la del juego) y dibujos propios; para empezar, las ilustraciones
  de Pintar.

## 4. Desbloqueos sin bloquear nada aprobado

**Gratis para siempre:** todo lo que hay hoy en Vestir y **todo lo aprobado hasta hoy** para la muñeca nueva (D-014 a
D-028). Solo **contenido nuevo** podría ser premio. Nada que Amaia tenga hoy pasa a estar bloqueado.

**Camino de premios** (en «Mis logros»): una fila de cofres. Al llegar a cada umbral de logros **acumulados** se abre un
cofre y Amaia **elige uno entre dos** premios. Umbrales propuestos: **3, 6, 10, 14, 19…** (3, 3, 4, 4, 5 entre cofres).
Lo abierto no se pierde nunca.

**Cómo se marcaría un premio, sin tocar el catálogo ni `normalizar()`:**
- Las piezas de premio **siguen en el catálogo como cualquier otra**. Así `normalizar()` las conserva en un personaje
  guardado y **no hay que cambiarlo**.
- Qué piezas son premio se dice en una **lista aparte**, un archivo nuevo (p. ej. `premios.js`) con sus identificadores y
  su categoría. El catálogo no necesita ningún campo nuevo.
- Lo único que cambia es **la pantalla de elegir en Vestir**: una pieza que está en esa lista y aún no se ha abierto se ve
  con candado y puntos («te faltan ●●○ logros») y no se puede elegir; al tocarla, la voz dice «¡Se abre con 2 logros
  más!». Si un personaje guardado ya la lleva (p. ej., tras recuperar una copia), **se respeta y se da por abierta**.
- Si el catálogo de una copia no tiene alguna pieza de la lista, simplemente no aparece: la lista no crea ni quita piezas.

## 5. Tareas reales y zona de adultos

**Para Amaia:** en «Mis logros», una fila de tareas con dibujo (recoger los juguetes, lavarse los dientes, poner la mesa…).
Al hacerla, toca **«¡Lo he hecho!»** y la tarea queda **esperando** (reloj de arena), con la voz «¡Bien! Cuando lo vea un
adulto, ganarás un logro». No puede confirmarla ella.

**Zona de adultos** (en ⚙️ Ajustes):
- **Entrada:** mantener pulsado un botón 3 segundos y después un **código de 4 cifras** que elige el adulto la primera vez
  (alternativa: una operación para adultos, «escribe 7 × 8»). Es una barrera para una niña de 5 años, **no una seguridad
  real**: los datos están en el dispositivo.
- **Confirmar tareas:** cada aviso «lo he hecho» con su fecha → «✅ Confirmar» (+1 logro; Amaia lo celebra la próxima vez)
  o «Todavía no» (vuelve a su lista, sin castigo ni aviso negativo). Nada caduca.
- **Gestionar tareas:** añadir, cambiar el dibujo o el nombre, quitar (lo ya confirmado se conserva en el historial).
- **Ver el progreso:** logros (con su origen: qué reto o qué tarea, y cuándo), premios abiertos.
- **Ajustes:** límite diario de logros por retos y nivel de cada reto.
- **No hay** botón para quitar logros, estrellas ni premios.

## 6. Datos y cómo evitar duplicados al guardar y recuperar

**Idea central: cada logro y cada premio es una entrada con un identificador único, y los totales se calculan contando
entradas, no se guardan como número.** Así, guardar dos veces, recuperar la misma copia dos veces o unir dos copias no
puede contar nada dos veces.

| Clave nueva | Contenido | Identificador único |
| --- | --- | --- |
| `logros` | `{v:1, lista:[{id, tipo:'reto'│'tarea', que, fecha}]}` | Reto: `r:<fecha>:<reto>` (p. ej. `r:2026-10-21:contar`): como hay 1 por reto y día, terminar el mismo reto otra vez ese día no crea otro. Tarea: `t:<id del aviso>`. |
| `tareas` | `{v:1, lista:[{id, dibujo, nombre}], avisos:[{id, tarea, fecha}]}` | Cada aviso «lo he hecho» tiene un `id` aleatorio al crearse; al confirmarlo pasa a `logros` como `t:<id>` y sale de `avisos`. |
| `premios` | `{v:1, cofres:[{n, elegido, fecha}]}` | El número de cofre `n` (1, 2, 3…): cada cofre se abre una sola vez. |
| `adultos` | `{v:1, codigo: huella del código, limite}` | — (a decidir si va en la copia de seguridad) |
| `lv_letras`, `lv_colores`, `lv_reto_memoria` | Nivel de cada reto (`lv_contar` ya existe) | — (entran en la copia por el prefijo `lv_`, sin cambiar nada) |

Ninguna clave actual cambia, se renombra ni se migra (`stars` incluida).

**Al guardar y al jugar (dentro del juego):**
- Antes de añadir un logro se mira si su `id` ya existe; si existe, no se añade (tocar dos veces «Confirmar» o terminar dos
  veces el mismo reto el mismo día no duplica).
- Al leer las claves se limpian duplicados por `id` (por si un archivo viejo o editado los trajera).
- El total de logros es `lista.length` después de limpiar; los cofres a los que se tiene derecho se calculan con ese
  total y los umbrales.

**Al recuperar una copia («Recuperar mi progreso»):**
- Hoy `progreso.js` **sustituye** cada clave por la de la copia (y no borra las que la copia no trae). Con estas claves,
  sustituir **no duplica** nada, pero recuperar una copia antigua **devolvería a ese momento**: se «perderían» los logros
  ganados después, como pasa hoy con las estrellas (y «Deshacer» los devuelve).
- **Recomendado:** para `logros`, `tareas` y `premios`, **unir** en lugar de sustituir: unión de logros por `id`; avisos
  pendientes por `id`, quitando los que ya están confirmados en `logros`; cofres por número `n` (si un mismo cofre aparece
  con dos elecciones distintas, se quedan las dos piezas abiertas y el cofre cuenta una vez). Recuperar la misma copia
  una o diez veces da el mismo resultado, y nunca se pierde un logro.
- Ese cambio es en `progreso.js` (archivo compartido, apartado 7). Sin él, la propuesta funciona igual, con la regla de
  hoy (sustituir).

## 7. Cambios que harían falta en archivos compartidos (para que la propietaria coordine; no hechos)

| Archivo | Cambio propuesto | ¿Imprescindible? |
| --- | --- | --- |
| `index.html` (inicio o Pensar, Ajustes) | Botón «Retos del día», álbum «Mis logros», contador 🏅, zona de adultos | Sí, para la función |
| `index.html` (Vestir: `dOpts`) | Candado y puntos en las piezas de la lista de premios aún no abiertas | Solo cuando haya premios de ropa o peinados |
| `premios.js` (nuevo) | Lista de identificadores de piezas de premio y su categoría | Solo cuando haya premios de ropa o peinados |
| `avatar/catalogo-muneca.js` y catálogos | **Ninguno** para bloquear. Solo añadir las piezas nuevas como cualquier otra, cuando existan | No |
| `avatar/motor.js` (`normalizar()`) | **Ninguno** (las piezas de premio siguen en el catálogo) | No |
| `progreso.js` | Añadir `logros`, `tareas`, `premios` (y quizá `adultos`) a `CLAVES`; unir en vez de sustituir al recuperar esas tres; contar los logros en el resumen | Añadir a `CLAVES`, sí (si no, la copia de seguridad no las guarda); unir, recomendado |
| `sw.js` | Subir la versión de la caché al integrar | Sí, al integrar |
| `docs/ARQUITECTURA_Y_DATOS.md`, `docs/DECISIONES.md`, `docs/HOJA_DE_RUTA.md`, `docs/MANUAL_PROYECTO.md`, `docs/ESTADO_ACTUAL.md`, `docs/REGISTRO_CAMBIOS.md` | Claves nuevas, decisión de recompensas, fila «Premios» de la hoja de ruta | Sí, al integrar (protocolo del proyecto) |

## 8. Primera prueba pequeña (cuando se apruebe)

**Objetivo:** probar en el iPhone el contador de logros, el camino de cofres, las tareas confirmadas por un adulto y la
copia de seguridad sin duplicados, **sin tocar Vestir, el catálogo ni nada aprobado**.

- **Copia aislada nueva** `docs/propuestas/recompensas-prueba/` con datos propios `rec1:`, generada desde el `index.html`
  del juego como las de Pintar y Heladería. Las referencias congeladas de Pintar y Heladería **no se tocan**.
- **Dos retos:** **Contar** y **Colores** (los que más reutilizan lo que ya existe). Letras y Memoria, después.
- **Tareas:** dos fijas (recoger los juguetes, lavarse los dientes) y la zona de adultos con mantener pulsado + código.
- **Contador 🏅 y «Mis logros»** con **tres cofres** (3, 6 y 10 logros).
- **Premios provisionales**, todos **contenido nuevo** de Pintar y la Heladería, nada del armario:
  1. **Sellos nuevos para Pintar** (unicornio, arcoíris, corazón brillante…).
  2. **Un color especial para Pintar** (dorado o purpurina).
  3. **Un sabor y un adorno nuevos en la Heladería** (sabor arcoíris, fideos de colores).
  Lo que ya existe en Pintar y la Heladería sigue igual y libre; los premios solo **añaden**.
- **Prueba automática** (como las de Pintar y Heladería):
  - datos propios y nada del juego tocado; Vestir, catálogo y todo lo aprobado, sin candados;
  - fallar no quita nada; 1 logro por reto y día; tocar dos veces «Confirmar» da un solo logro;
  - guardar y recuperar la misma copia dos veces: el mismo número de logros; recuperar una copia antigua: con la regla de
    hoy, vuelve a ese momento y «Deshacer» lo devuelve (en la copia se probaría también la unión, sin tocar el
    `progreso.js` del juego);
  - los cofres se abren a los umbrales y cada uno una sola vez; lo abierto se conserva al recuperar.
- **Después:** prueba en el iPhone → decisiones → Letras y Memoria → premios de ropa y peinados cuando haya piezas nuevas,
  coordinado por la propietaria.

## 9. Decisiones pendientes de la propietaria

1. ¿Umbrales 3, 6, 10, 14, 19…? ¿Elegir entre dos premios en cada cofre?
2. ¿Como mucho 1 logro por reto y día? ¿Límite también para las tareas?
3. ¿Código de 4 cifras o una operación para adultos? ¿El código va en la copia de seguridad?
4. ¿Unir en vez de sustituir al recuperar (cambio en `progreso.js`)?
5. ¿Premios provisionales de la primera prueba: sellos y color de Pintar, sabor y adorno de la Heladería?
6. ¿Qué contenido nuevo será premio más adelante (ropa, peinados, pegatinas, láminas)?
7. ¿Las monedas de la Heladería deben servir para algo? (Hoy no; esta propuesta no las usa.)
