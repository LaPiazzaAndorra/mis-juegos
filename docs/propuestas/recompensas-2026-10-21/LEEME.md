# Actividades educativas, logros y desbloqueos · propuesta (21/10/2026)

**Solo propuesta: no hay código.** No cambia la economía de estrellas, el guardado, los catálogos ni ningún archivo del
juego o compartido. Las referencias de Pintar (`708c2f2`) y de la Heladería (`7aeb5b7`) siguen congeladas.
Rama `pintar-heladeria` (Chat 2). El avatar, la ropa y Mi Mundo son del **Chat 1** (`avatar-creador`): todo lo que toque su
catálogo o el guardado se coordina con él a través de la propietaria (apartado 7).

## 0. Lo que hay hoy (comprobado en el código)

- **Estrellas** (`stars`, `addStar`): +1 por pedido correcto en la Heladería; +1 al guardar el primer personaje en Vestir;
  Parejas +2/+3/+5 según el tamaño; Contar, ¿Qué sigue?, Sombras y El diferente +1 por acierto (fallar baja un poco el nivel
  `lv_<juego>`, pero **nunca quita estrellas**). Solo se cuentan y se enseñan: **no se gastan ni desbloquean nada**.
- **Monedas** de la Heladería (`iceCoins`): tampoco se gastan.
- **Armario:** en el juego, la muñeca provisional y la vectorial, con todo disponible; la muñeca nueva (D-014 a D-028:
  vestido rosa, zapatos, corona, colores de piel, pelo y ojos, pintacaras, tres peinados, accesorios, conjunto de aventura
  y pijama) está en propuestas del Chat 1, también sin bloqueos.
- **Atención:** `Avatar.normalizar()` (`avatar/motor.js`) **quita del personaje guardado lo que no está en el catálogo**.
  Por eso un premio **no puede bloquearse sacándolo del catálogo**: el personaje lo perdería. El bloqueo tiene que ser solo
  de la pantalla de elegir (apartado 4).

## 1. Principios

1. **Esfuerzo, no acierto:** el premio llega por **terminar** una actividad corta, no por hacerla perfecta.
2. **Nunca se pierde nada:** ni estrellas, ni logros, ni premios desbloqueados, ni por fallar ni por recuperar una copia.
3. **Breve:** cada actividad dura 2–3 minutos (5 rondas) y termina sola con una celebración.
4. **Sin leer:** todo con voz, dibujos y números grandes; los textos son para el adulto.
5. **Sin tienda ni gasto:** los premios se **alcanzan**, no se compran; así no hay que «ahorrar» ni elegir entre gastar y guardar.
6. **Estrellas de juego y logros educativos, separados** (apartado 2).
7. **Armario actual gratis para siempre** (apartado 4).
8. **Las tareas reales solo cuentan si las confirma un adulto** (apartado 5).

## 2. Dos contadores separados

| | **Estrellas de juego** ⭐ | **Logros educativos** 🏅 |
| --- | --- | --- |
| Qué miden | Que juega (aciertos en juegos, pedidos de la Heladería…) | Que **practica** (actividades terminadas) y que **ayuda** en casa (tareas confirmadas) |
| Cómo se ganan | Como hoy, sin cambios | **Sellos** por terminar una actividad breve; **soles** por tareas reales confirmadas por un adulto |
| Se pierden | Nunca (como hoy) | Nunca |
| Para qué sirven | Solo para verlas (como hoy) | Desbloquean ropa, peinados y adornos **nuevos** |
| Dónde se ven | La barra de arriba, como hoy | Un álbum nuevo, «Mis logros» |
| Datos | `stars` (sin cambios) | Claves nuevas (apartado 6) |

**Por qué separados:** si los premios dependieran de las estrellas, jugar mucho a la Heladería abriría la ropa sin
practicar nada, y cualquier cambio en la economía de los juegos alteraría los premios. Así, los juegos siguen igual y lo
educativo tiene su propio camino.

**Las actividades educativas no dan estrellas** (dan sellos). Los juegos de Pensar actuales siguen dando estrellas, sin cambios.

## 3. Actividades breves («Retos del día»)

Un botón nuevo en el inicio o en «Pensar» abre **cuatro retos**, cada uno con su dibujo: **Contar**, **Letras**,
**Memoria** y **Colores**. Cada reto: **5 rondas**, voz en cada ronda, dificultad que sube sola y no baja, y al terminar
**un sello** de ese reto con confeti, aunque haya fallado rondas.

**Al equivocarse** (igual en todos): sonido suave y «¡Casi! Prueba otra vez»; al 2.º intento, una pista (la opción buena
brilla o la voz da una ayuda); al 3.º, se resuelve juntos («Mira, era esta») y se pasa a la siguiente ronda. Nunca se
quita nada ni se repite la ronda entera.

| Reto | Nivel 1 | Siguientes niveles | Reutiliza |
| --- | --- | --- | --- |
| **Contar** | Contar 1–5 cosas y tocar el número (con puntos) | 1–10; «pon 3 bolas en el helado»; ¿dónde hay más? | Contar de Pensar y la Heladería |
| **Letras** | Vocales A E I O U: oír y tocar la letra | Letras de **AMAIA**; con qué letra empieza (oso, sol, luna…); su nombre en orden | Nuevo (solo mayúsculas al principio) |
| **Memoria** | Parejas de 3 (6 cartas) | ¿Qué falta? (3 dibujos, se tapa uno); el pedido tapado de la Heladería | Parejas y Heladería |
| **Colores** | Tocar el color que se dice (6 colores) | Colores claros/oscuros; mezclas (rojo + amarillo = naranja) en Pintar; «pinta el globo de azul» | Paleta y láminas de Pintar |

- **Límite de esfuerzo diario** (para que sea breve y no una carrera): como mucho **1 sello por reto y día** (4 al día); se
  puede seguir jugando, pero sin más sellos ese día. Decisión de la propietaria.
- Las letras y colores nuevos necesitan voz en castellano (la del juego) y **dibujos propios**, no emojis, si se quiere
  mantener la norma de arte; para empezar se pueden usar las ilustraciones de Pintar.

## 4. Desbloqueos

**Armario inicial gratis:** todo lo que hay hoy en Vestir y **todo lo aprobado hasta hoy para la muñeca nueva** (D-014 a
D-028) queda gratis **para siempre**. Solo las piezas **nuevas a partir de ahora** podrían ser premios (lista a decidir con
el Chat 1). Nada que Amaia tenga hoy pasa a estar bloqueado.

**Camino de premios** (en «Mis logros»): una fila de cofres. Cada **3 logros** (sellos o soles), un cofre se abre y Amaia
**elige uno entre dos** premios (ropa, peinado o adorno nuevos). Los umbrales son una **propuesta**: 3, 3, 4, 4, 5… (más
espaciados a medida que avanza). Lo desbloqueado no se pierde nunca.

**En Vestir** (pantalla del Chat 1): las piezas de premio aún no abiertas se ven **con un candado y puntos** («te faltan ●●○»
logros), no se ocultan; al tocarlas, la voz dice «¡Se abre con 2 logros más!» y ofrece ir a «Retos del día».

**Reglas de datos importantes:**
- El bloqueo es **solo de la pantalla de elegir**. El catálogo no se toca para bloquear y `Avatar.normalizar()` **no debe
  quitar** una pieza de premio de un personaje guardado.
- Si un personaje guardado (o una copia recuperada) lleva una pieza que aún no está desbloqueada, **se respeta** y se
  marca como desbloqueada: nunca se le quita nada puesto.

## 5. Tareas reales y zona de adultos

**Para Amaia:** en «Mis logros», una fila de tareas con dibujo (recoger los juguetes, lavarse los dientes, poner la mesa…).
Al hacerla, toca **«¡Lo he hecho!»** y la tarea queda **esperando** (reloj de arena), con la voz «¡Bien! Cuando lo vea un
adulto, ganarás un sol». No puede confirmarla ella.

**Zona de adultos** (en ⚙️ Ajustes):
- **Entrada:** mantener pulsado un botón 3 segundos y después un **código de 4 cifras** que elige el adulto la primera
  vez. Alternativa sin código: una operación para adultos («escribe 7 × 8»). En los dos casos es una barrera para una niña
  de 5 años, **no una seguridad real** (los datos están en el dispositivo).
- **Confirmar tareas:** cada tarea pendiente con su fecha → «✅ Confirmar» (da un **sol** y Amaia lo ve con una celebración
  la próxima vez) o «Todavía no» (vuelve a su lista sin castigo ni aviso negativo). Nada caduca.
- **Gestionar tareas:** añadir, cambiar el dibujo o el nombre, quitar (las ya confirmadas se conservan en el historial).
- **Ver el progreso:** sellos por reto, soles, premios abiertos y el historial de los últimos días.
- **Ajustes:** límite diario de sellos, si las tareas cuentan para los premios (sí/no) y nivel de cada reto.
- **No hay** botón para quitar logros, estrellas ni premios.
- «Guardar mi progreso» sigue en Ajustes, como hoy, y guarda también todo esto (apartado 6).

## 6. Datos que se necesitarían (propuesta, no hecho)

Todas **claves nuevas**; ninguna clave actual cambia, se renombra ni se migra (`stars` incluida).

| Clave | Contenido | En la copia de seguridad |
| --- | --- | --- |
| `logros` | `{v:1, sellos:{contar,letras,memoria,colores}, soles, hoy:{fecha, retos:[…]}, historial:[{fecha, tipo, reto, rondas, aciertos}]}` (historial limitado a ~100) | **Hay que añadirla** a `CLAVES` de `progreso.js` |
| `premios` | `{v:1, abiertos:[{id, categoria, fecha, via}], cofre}` (identificadores del catálogo del Chat 1) | **Hay que añadirla** |
| `tareas` | `{v:1, lista:[{id, dibujo, nombre}], pendientes:[{id, tarea, fecha}], confirmadas:[{id, tarea, fecha, confirmada}]}` | **Hay que añadirla** |
| `adultos` | `{v:1, codigo: huella del código, ajustes:{limite, tareasCuentan}}` | A decidir: si va en la copia, al recuperar se recupera el código |
| `lv_letras`, `lv_colores`, `lv_memoria_reto` | Nivel de cada reto (`lv_contar` ya existe y se puede reutilizar) | Sí, por el prefijo `lv_` (sin cambiar nada) |

**Recuperar una copia:** hoy recuperar **añade y sustituye, pero no borra** (comprobado con la Heladería). Para estas claves
convendría **unir** en lugar de sustituir (por ejemplo, la unión de premios abiertos y el máximo de sellos), para que
recuperar una copia antigua no «quite» premios. Eso es un cambio en `progreso.js` (archivo compartido).

## 7. Cambios en archivos compartidos o del Chat 1 (para coordinar; no hechos)

| Archivo | Dueño | Cambio propuesto | Por qué |
| --- | --- | --- | --- |
| `avatar/catalogo-muneca.js` (y los catálogos de las copias) | Chat 1 | Añadir a las piezas **nuevas** de premio un campo opcional, p. ej. `premio: true` (o una lista aparte de identificadores en un archivo nuevo `premios.js`, que no toca el catálogo) | Saber qué piezas son premio; el armario actual no lleva marca |
| `avatar/motor.js` | Chat 1 | Que `normalizar()` **no quite** piezas de premio de un personaje guardado; exponer `Avatar.esPremio(id)` si se usa el campo | No perder nunca lo puesto |
| `index.html` (Vestir: `dOpts`) | Chat 1 | Candado y puntos en las piezas de premio no abiertas; al tocar, voz y enlace a «Retos del día» | Desbloqueo visible y comprensible |
| `index.html` (inicio, Pensar, Ajustes) | Chat 2 | Botón «Retos del día», álbum «Mis logros», zona de adultos | Lo nuevo de esta propuesta |
| `progreso.js` | Compartido | Añadir `logros`, `premios`, `tareas` (y quizá `adultos`) a `CLAVES`; unir en vez de sustituir al recuperar esas claves; contarlas en el resumen | Que la copia de seguridad las guarde y no se pierdan premios |
| `sw.js` | Compartido | Subir la versión de la caché al integrar | Obligatorio al cambiar archivos en caché |
| `docs/ARQUITECTURA_Y_DATOS.md`, `docs/DECISIONES.md`, `docs/HOJA_DE_RUTA.md`, `docs/MANUAL_PROYECTO.md`, `docs/ESTADO_ACTUAL.md`, `docs/REGISTRO_CAMBIOS.md` | Compartidos | Claves nuevas, decisión de recompensas, fila «Premios» de la hoja de ruta | Protocolo del proyecto, al integrar |

**Mensaje para el Chat 1** (para trasladarlo):

> Desde el Chat 2 (Pintar y Heladería, rama `pintar-heladeria`) se ha preparado una **propuesta** de recompensas, sin
> código: `docs/propuestas/recompensas-2026-10-21/LEEME.md`. Afecta a vuestros archivos solo si la propietaria la aprueba:
> 1. El armario actual y todo lo aprobado hasta hoy (D-014 a D-028) quedaría **gratis**; solo las piezas nuevas a partir
>    de ahora podrían ser premio. ¿Qué piezas próximas encajarían como premio?
> 2. Para marcar premios: campo opcional `premio: true` en el catálogo, o una lista aparte de identificadores en un archivo
>    nuevo `premios.js` que no toca el catálogo. ¿Cuál preferís?
> 3. **Importante:** `Avatar.normalizar()` quita lo que no está en el catálogo; las piezas de premio deben seguir en el
>    catálogo y `normalizar()` no debe quitarlas de un personaje guardado aunque no estén desbloqueadas.
> 4. En Vestir (`dOpts`), las piezas de premio no abiertas se verían con candado y puntos; el estado de desbloqueo lo leería
>    Vestir de una clave nueva `premios`. ¿Os encaja hacerlo vosotros cuando toque?
> Nada de esto se hará hasta que la propietaria lo apruebe y coordine el orden.

## 8. Plan por fases (cuando se apruebe)

1. **Decisiones** de la propietaria (apartado 9).
2. **Copia aislada `rec1:`** con los cuatro retos, los sellos y el álbum «Mis logros», con premios **de muestra** que no
   tocan el catálogo (p. ej., pegatinas de Mi Mundo o marcos de dibujo). Sin zona de adultos.
3. **Zona de adultos y tareas** en la misma copia.
4. **Con el Chat 1:** marcar las piezas de premio y el candado en Vestir; cambios de `progreso.js`; prueba de copia de
   seguridad (guardar, recuperar, deshacer, copia antigua) como la de la Heladería.
5. Prueba en el iPhone (versión de pruebas) → aprobación → integración en el juego.

## 9. Decisiones pendientes de la propietaria

1. ¿Umbrales del camino: 3, 3, 4, 4, 5…? ¿Elegir entre dos premios en cada cofre?
2. ¿Límite de 1 sello por reto y día?
3. ¿Las tareas reales cuentan para los mismos premios que los retos, o tienen premios propios?
4. ¿Código de 4 cifras o una operación para adultos? ¿El código va en la copia de seguridad?
5. ¿Qué es exactamente «armario actual» gratis? Propuesta: todo lo que hay hoy en el juego y todo lo aprobado hasta hoy
   para la muñeca nueva (D-014 a D-028).
6. ¿Qué premios hay al principio, mientras el Chat 1 prepara piezas nuevas (pegatinas de Mi Mundo, marcos, láminas)?
7. ¿Las monedas de la Heladería deben servir para algo? (Hoy no; esta propuesta no las usa.)
