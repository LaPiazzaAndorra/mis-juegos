# Norma de textos para la niña (D-038) · 17/11/2026

**Amaia está aprendiendo a leer.** Pedido de la propietaria (17/11/2026):

> Todos sus textos en MAYÚSCULAS, conservando tildes y Ñ. Letra de imprenta clara, grande y con buen contraste. Frases
> breves, vocabulario sencillo y una instrucción cada vez. Botones con acciones concretas: «JUGAR», «PINTAR», «GUARDAR»,
> «VOLVER». Acompañar las instrucciones con ilustraciones y voz cuando esté disponible, sin exigir que lea para poder
> jugar. Evitar párrafos largos, abreviaturas y texto encima de fondos recargados. Comprobar que los textos caben en el
> iPhone sin cortarse ni reducir la letra. Ejemplos: «BUSCA EL NÚMERO 8», «GUARDA LOS JUGUETES», «TENGO SUEÑO», «PONME EL
> PIJAMA». Aplica esta norma a los juegos y a Mi Mundo, incluidos avisos, pistas y diálogos. Los textos técnicos y la zona
> de adultos pueden mantener su formato habitual. No cambies datos guardados ni respuestas de los ejercicios al adaptar su
> presentación. Coordinad esta norma para que quede igual al integrar ambas ramas.

**Vale para todas las ramas** (`avatar-creador`, `juegos-pensar` y las que vengan) y para todo lo nuevo. Es como
`NORMA_VISUAL_MUNECA.md`: no se vuelve a debatir; cada texto nuevo se revisa con su lista.

## 1. Cómo se escribe

| Regla | Sí | No |
| --- | --- | --- |
| Frase breve, una instrucción cada vez | «PON UN PLATO» | «Pon tres platos, tres tazas, la tetera y las galletas» |
| Vocabulario sencillo, en presente | «GUARDA LOS JUGUETES» | «¿Procedemos a recoger…?» |
| La muñeca habla en primera persona | «TENGO SUEÑO», «PONME EL PIJAMA» | «La muñeca tiene sueño» |
| Botones: un verbo con la acción | «JUGAR», «PINTAR», «GUARDAR», «VOLVER», «PONER EL PIJAMA», «SEGUIR JUGANDO» | «Aceptar», «Así está bien», «OK» |
| Sin abreviaturas ni signos raros | «NIVEL 1» | «Niv.», «n.º», «x3» |
| Números como cifras | «BUSCA EL NÚMERO 8» | «Busca el número ocho» |
| Sin párrafos | una o dos líneas como mucho | varias frases seguidas |

- **Se escribe normal en el código** (con minúsculas, tildes y Ñ). Las MAYÚSCULAS las pone la capa de lectura al
  mostrarlo, así la voz lee bien la frase y los datos no cambian.
- **No hace falta leer para jugar.** Toda instrucción va con:
  - **un dibujo** (la pieza ilustrada: la cama en «TENGO SUEÑO», el plato en «PON UN PLATO»);
  - **la voz**, cuando el sonido está activado.

  Los mensajes (`toast`) se dicen solos, sin los emojis.
- **La voz puede decir algo más largo** que el texto (por ejemplo, el cuento), pero lo escrito es siempre breve.

## 2. Cómo se ve (capa común de lectura)

`docs/propuestas/lectura-2026-11-17/` (`lectura.css` y `lectura.js`) se carga **igual en todas las ramas**: en las copias
de prueba y en la publicación (`preparar_publicacion.py --con-lectura`), **justo después de `logros.js`** y antes de Contar
y Memoria y de Mi Mundo. La capa hace esto:
- **MAYÚSCULAS** en todo el texto de la niña (también en los botones), con tildes y Ñ. Usa `text-transform`, que respeta el
  castellano (`lang="es"`).
- **Letra** de imprenta redonda del juego (SF Pro Rounded en el iPhone), gruesa; **ningún texto de la niña por debajo de
  16 px**.
- **Contraste** de 4,5:1 o más sobre su fondo; los textos van sobre fondos lisos (bocadillos, botones, tarjetas), nunca
  directamente sobre un dibujo.
- **Nada cortado:**
  - nunca «…»;
  - los títulos de las barras que no caben quedan solo con su icono, y el nombre sigue disponible para la voz;
  - los que no tienen icono pasan a dos líneas;
  - la letra no se reduce para que quepa.
- **Frases más breves** del juego base, por coincidencia exacta (tabla `TEXTOS` de `lectura.js`). Los módulos (Contar y
  Memoria, Mi Mundo…) escriben ya sus frases según la norma en su propio código. Si hace falta, pueden añadir las suyas
  con `Lectura.textos({ 'original': 'NUEVO' })`.
- **No toca** datos guardados, identificadores ni respuestas: solo cambia lo que se ve y se oye. Su código no usa
  `localStorage`, `store` ni IndexedDB.

## 3. Qué queda fuera (formato habitual)

- **La zona de adultos:**
  - Ajustes (`#settings`);
  - «Guardar / Recuperar mi progreso» (`#bkModal` y sus mensajes);
  - la puerta de adultos (`#adModal`).
- **Lo técnico:**
  - el aviso de descarga sin conexión (`#offlineAviso`);
  - la cinta de pruebas (`#pruebasCinta`);
  - los errores (`⚠️ …`);
  - la versión;
  - los campos donde se escribe.
- **Cualquier elemento con la clase `adulto`.** Es la forma de dejar fuera algo nuevo, sin tocar la capa.

## 4. Lista para revisar cada pantalla o texto nuevo

1. ¿Una sola instrucción, breve, con un verbo? ¿La muñeca habla en primera persona?
2. ¿Va con su dibujo y con voz?
3. ¿Se ve en MAYÚSCULAS con tildes y Ñ? (`innerText` lo muestra así).
4. ¿Cabe entero en el iPhone pequeño (375 × 667), el normal (390 × 844) y el grande (430 × 932), sin «…» y sin bajar de 16 px?
5. ¿Contraste de 4,5:1 o más? ¿Fondo liso detrás del texto?
6. ¿Los datos y las respuestas siguen iguales?

`node docs/propuestas/lectura-2026-11-17/prueba-lectura.js [URL de la copia]` comprueba todo esto en todas las pantallas
de una copia y en los avisos, las misiones, los diálogos y los mensajes. **Tiene que pasar antes de publicar.**

## 5. Reparto entre ramas

| Parte | Quién adapta sus frases | Dónde |
| --- | --- | --- |
| Capa común (MAYÚSCULAS, letra, contraste, títulos, voz de los mensajes) | `avatar-creador` | `docs/propuestas/lectura-2026-11-17/` (la otra rama la copia **sin cambios**; si hace falta cambiarla, se acuerda y se cambia en las dos) |
| Juego base: inicio, Pintar, Heladería, Vestir, logros, mensajes | `avatar-creador` | tabla `TEXTOS` de `lectura.js` |
| Mi Mundo (avisos, misiones, diálogos, catálogo) | `avatar-creador` | en su código y su catálogo (`prueba-cuidar-2026-11-15/mimundo/`) |
| Contar, Memoria y los demás juegos de Pensar (pistas, niveles, retos) | `juegos-pensar` | en su propio código, con esta norma |
