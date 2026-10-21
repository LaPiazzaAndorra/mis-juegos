# Voz del juego · revisión y prueba de voces (21/10/2026)

Pedido de la propietaria (22:07): la voz suena muy robótica; se busca una voz en español **más natural, cálida y fluida**,
de calidad parecida a Siri, **sin imitarla ni forzar una voz infantil**. Rama `pintar-heladeria`. **Solo revisión y una
página de prueba aparte**: no cambia la voz del juego, ni sus datos, ni las referencias aprobadas (Pintar `708c2f2`,
Heladería `7aeb5b7`), ni contrata ningún servicio.

**Enlace fijo de la página de prueba (Safari):** se anota en el apartado 3, en el commit siguiente (el hash de un commit
no puede ir dentro de él).

## 1. Cómo habla hoy el juego (comprobado en `index.html`)

- Usa la **síntesis de voz del navegador** (Web Speech API, `speechSynthesis`): las voces son **las del propio iPhone**,
  sin internet y sin coste. Nada de audios grabados.
- Elige sola una voz en español (`bestVoice`): descarta las de efectos (Abuela, Burbujas…) y prefiere las que se llaman
  premium/mejorada/Siri y Mónica, Paulina, Marisol… En ⚙️ Ajustes se puede elegir otra voz (`voice`) y un tono (`tone`).
- **Tono por defecto «🧒»: tono 1,45 y velocidad 0,95** (los otros: «🙂» 1,10 y «🐭» 1,80). Subir el tono un 45 % hace que
  **cualquier voz suene aguda, «de dibujos» y más artificial**: es una causa importante del efecto robótico y va contra
  «no forzar una voz infantil».
- Cada frase corta la anterior (`cancel()` + `speak()`).

## 2. Qué voces puede usar una web en el iPhone (comprobado en fuentes de Apple y WebKit)

- En los foros de desarrolladores de Apple, un ingeniero de Apple indica que con la Web Speech API **solo están disponibles
  las voces preinstaladas**; las que se descargan en Ajustes (mejoradas, premium) **no**. Usuarios informan de que en iOS 17
  llegaron a verse algunas de calidad alta y en iOS 18 desaparecieron.
- Hay un fallo abierto en WebKit (Safari 18, sin resolver a mayo de 2025) que lo describe así: `getVoices()` solo da un
  conjunto fijo de voces preinstaladas, «robóticas y de baja calidad».
- No se ha encontrado ninguna fuente que diga que las **voces de Siri** estén disponibles para las webs.
- Esto puede haber cambiado en la versión de iOS de la propietaria: **por eso la prueba se hace en su iPhone**.

Fuentes: [Apple Developer Forums · Web Speech Synthesis API: not all voices installed listed](https://developer.apple.com/forums/thread/723503),
[WebKit Bugzilla 290497](https://bugs.webkit.org/show_bug.cgi?id=290497).

## 3. Página de prueba de voces

`index.html` de esta carpeta. **No es el juego**: no carga sus archivos, no lee ni cambia sus datos y no cambia su voz. Solo
guarda las favoritas en ese navegador (clave `voz1:favoritas`).

- Las **tres frases** pedidas (y una cuarta opcional que se puede escribir).
- **Todas las voces en español** que el iPhone da al navegador, de mejor a peor: «Calidad alta» (Premium, Mejorada, Siri),
  «Estándar y básicas»; las de efectos, ocultas (se pueden ver). Etiquetas: calidad, España o América, si necesita
  internet, la predeterminada; y el identificador técnico, si se quiere.
- En cada voz: **▶ 1, ▶ 2, ▶ 3, ▶ Las tres** y ✏️ (la frase escrita); **⭐** para marcarla.
- **Velocidad y tono** para todas (por defecto, **naturales: 1,00 y 1,00**) y **«🎮 Así suena ahora el juego»**, para
  comparar con la voz y el tono de hoy (1,45 · 0,95).
- **«⭐ Tus favoritas»** con un botón para **copiar** la elección (voz, velocidad y tono) y pegarla en el chat.
- Dice cuántas voces de calidad alta hay; si no hay ninguna, lo dice claramente.

**Probado** (`prueba-voz.js`, 14/14, en Chromium con una lista **simulada** de voces como la de un iPhone): ordena y
etiqueta, oculta las de efectos, habla con la voz, velocidad y tono elegidos, compara con el juego (misma regla que
`bestVoice`), guarda y copia las favoritas, avisa si no hay voces o ninguna de calidad alta, no toca los datos del juego,
sin desbordar y sin errores. **Cómo suenan solo se puede saber en el iPhone.**

**Enlace fijo:** ENLACE_PENDIENTE

**Cómo probarla (en el iPhone):**
1. Abrir el enlace en **Safari** (sin modo silencio y con volumen).
2. Mirar la cuenta de «Voces encontradas» (¿hay alguna de calidad alta?).
3. Escuchar «▶ Las tres» en varias voces con **velocidad y tono naturales**; probar a bajar un poco la velocidad (0,90–0,95).
4. Tocar «🎮 Así suena ahora el juego» para comparar.
5. Marcar ⭐ las que gusten → «📋 Copiar para enviarlo» → pegarlo en el chat.
6. Opcional: descargar en Ajustes → Accesibilidad → Contenido leído → Voces → Español una voz «mejorada» o «premium»,
   volver a abrir la página y ver si aparece (según Apple, no debería).

## 4. Si las voces del iPhone no dan la calidad: audios preparados

**Qué es:** generar **una vez** archivos de audio (por ejemplo, AAC o MP3, una frase por archivo) con una voz neuronal de
alta calidad o grabando a una persona, guardarlos con el juego y reproducirlos en lugar de la síntesis del iPhone.

**Conexión y funcionamiento sin internet**
- La conexión solo hace falta **al preparar los audios** (en el ordenador del desarrollo), no en el iPhone de Amaia.
- En el juego, los audios se guardarían en la caché sin conexión (lista de `sw.js`): **funcionan sin internet** después de
  la primera carga, como el resto del juego.
- **Nunca** se pondría una clave de un servicio en el juego ni en el repositorio (**es público**): la generación se hace
  aparte y solo se suben los audios.

**Coste** (precios publicados, comprobados el 21/10/2026; pueden cambiar):

| Servicio | Voz | Gratis al mes | Después |
| --- | --- | --- | --- |
| Google Cloud Text-to-Speech | Neural2 | 1 millón de caracteres | 16 US$ por millón |
| Google Cloud Text-to-Speech | Chirp 3: HD | 1 millón de caracteres | 30 US$ por millón |
| Amazon Polly | Neural | 1 millón de caracteres (12 primeros meses) | 16 US$ por millón |
| Amazon Polly | Generative | 100 000 caracteres (12 primeros meses) | 30 US$ por millón |
| Microsoft Azure AI Speech | Neural | 0,5 millones de caracteres | (precio no comprobado) |

**Estimación para este juego:** las frases fijas son pocas (unas 100: saludos, ánimos, pistas, retos); lo que más ocupa son
las **frases que se combinan**, sobre todo los pedidos de la Heladería (unas 1 000 combinaciones de base, sabores y adorno,
de unos 75 caracteres). En total, del orden de **100 000–150 000 caracteres**: **dentro de la cuota gratuita** de esos
servicios; incluso pagando, **unos pocos dólares una sola vez**. Habría que abrir una cuenta con tarjeta (es **contratar un
servicio**: no se ha hecho) y revisar sus condiciones de uso de los audios.

**Tamaño:** ~1 100 audios de ~3 s a 24–32 kbps ≈ **10–15 MB** en la caché del iPhone. Alternativa: componer los pedidos con
trozos («Quiero un cucurucho» + «con dos bolas» + «de fresa»…), unos 80 audios (< 1 MB), pero **se notan las uniones**.

**Otros puntos**
- Cada frase nueva del juego obliga a **generar su audio**; si falta alguno, habría que usar la voz del iPhone (y se notaría
  el cambio de voz).
- Los textos que cambian (números, nombres, frases escritas por un adulto) son lo más difícil.
- Opción **sin servicios**: **grabar a una persona** (la propietaria u otra) con un guion; es la voz más cálida y gratuita,
  pero lleva tiempo grabar y repetir cuando cambian las frases.
- Opción **mixta** (recomendable si se hace): audios preparados para lo fijo y lo más frecuente (saludos, ánimos, pistas,
  retos, colores, números) y la voz del iPhone solo para lo que no tenga audio.

## 5. Siguientes pasos propuestos (nada hecho)

1. La propietaria escucha las voces en su iPhone y envía sus favoritas.
2. Si hay una buena: proponer en el juego **tono natural por defecto (1,00)** y esa voz preferida, sin cambiar los datos
   guardados (la elección en Ajustes se respeta). Requiere aprobación: cambia la voz general.
3. Si no hay ninguna buena: decidir entre audios preparados (servicio o grabación), mixto o esperar. Se prepararía antes
   una prueba aislada con unas pocas frases grabadas o generadas para escucharlas.
