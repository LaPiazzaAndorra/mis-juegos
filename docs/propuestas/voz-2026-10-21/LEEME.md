# Voz del juego · revisión y prueba de voces (21/10/2026)

> **22/10/2026, 07:14 — Investigación cerrada por ahora (decisión de la propietaria).** No se paga por la voz, no se
> buscan más servicios y no se abre ninguna cuenta ni se contrata nada. Los huecos de `muestras/` quedan vacíos.
> Se mantiene la **voz del dispositivo con tono natural** (sin agudizarla) y la opción de **silenciarla con 🔊/🔇**.
> Aplicado en la prueba conjunta (`../prueba-conjunta-2026-10-22/`: tono 1,00, velocidad 0,95; la clave `tone` guardada
> no se toca). El juego y las referencias congeladas no cambian (siguen con su tono anterior hasta que se decida integrar).

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

**Enlace fijo (commit `f56be6c`):** <https://raw.githack.com/LaPiazzaAndorra/mis-juegos/f56be6c20f14ab738e5d76d99c9769c88bde3a5b/docs/propuestas/voz-2026-10-21/index.html>

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

## 6. Muestras de voces más naturales (21/10/2026, 22:21)

La propietaria ha escuchado las voces del iPhone (también con tono natural) y no la convencen. Quiere **comparar tres
muestras** de voces más naturales con las mismas tres frases **antes de elegir proveedor** o preparar todos los audios.
Después se usarían **audios para las frases habituales** y la voz del dispositivo solo para los textos variables.
**No se ha contratado nada ni creado ninguna cuenta.**

**Por qué no hay muestras todavía:** desde el entorno de Claude no se pueden generar. Los modelos abiertos que funcionarían
sin cuenta (Kokoro, Piper) se descargan de Hugging Face o de las versiones de GitHub, que este entorno tiene bloqueados (y
en ese momento tampoco respondían los repositorios de paquetes). No se ha intentado rodear el bloqueo.

### Opciones y qué piden (comprobado el 21/10/2026; condiciones y precios pueden cambiar)

| Opción | ¿Cuenta? | ¿Tarjeta o pago? | Para las muestras (3 frases, unos 110 caracteres) | Uso de los audios en el juego |
| --- | --- | --- | --- | --- |
| **Microsoft Azure AI Speech** (voces neuronales es-ES; herramienta «Audio Content Creation» de Speech Studio, sin programar) | Sí (cuenta de Azure) | La cuenta gratuita pide **tarjeta para verificar la identidad**; límite de gasto 0 $, no cobra si no se quita | **Gratis** (0,5 millones de caracteres al mes) | Según sus condiciones de servicio (revisar antes) |
| **Google Cloud Text-to-Speech** (Chirp 3: HD o Neural2, es-ES) | Sí (Google Cloud) | **Hay que activar la facturación** (tarjeta); 300 US$ de crédito los 90 primeros días | **Gratis** (1 millón de caracteres al mes) | Según sus condiciones de servicio (revisar antes) |
| **Amazon Polly** (Neural o Generative, es-ES) | Sí (AWS) | **Tarjeta obligatoria**; cargo temporal de 1 US$ que se devuelve | **Gratis** (12 primeros meses) | Según sus condiciones de servicio (revisar antes) |
| **ElevenLabs** (voces multilingües muy naturales) | Sí | Plan gratuito: 10 000 créditos al mes (unos 10 minutos); no consta si pide tarjeta | **Gratis** | Plan gratuito: **sin licencia comercial** y con **atribución** («elevenlabs.io») al publicar; plan Starter: 6 US$/mes, con licencia comercial |
| **Mac con una voz «Premium» o «Mejorada»** (orden `say` o Contenido leído, exportando a archivo) | No | No | **Gratis**, si hay un Mac | Licencia de macOS: solo **«contenido propio para uso personal, no comercial»**; no permite publicarlo o redistribuirlo en contextos públicos |
| **Kokoro** (modelo abierto, voces `ef_dora`, `em_alex`, `em_santa`; licencia Apache-2.0), en un ordenador | No | No | **Gratis**, sin internet tras descargar el modelo (unos 170 MB) | Libre (Apache-2.0) |
| **Piper** (modelo abierto), por ejemplo en webs como tts.ai | Según la web (pide correo tras un uso) | No | Gratis con límite diario | El motor es MIT, pero **muchas voces en español son solo para uso personal y no comercial** |

**Importante para cualquier opción:** el repositorio y la versión de pruebas son **públicos**. Los audios que se suban al
repositorio se pueden descargar por cualquiera; las licencias «personal, no comercial» o con atribución (Mac, ElevenLabs
gratuito, Piper) pueden no cubrir eso. Antes de usar audios en el juego hay que elegir una opción cuyas condiciones lo
permitan, o guardarlos fuera del repositorio público. Para **escuchar muestras** no hay problema.

### Propuesta de comparación

Tres muestras de calidad alta y distinto tipo, **sin coste** para estas frases:
1. **Microsoft Azure** — una voz neuronal de España (es-ES).
2. **Google Cloud** — una voz Chirp 3: HD de España (es-ES).
3. **ElevenLabs** — una voz multilingüe en español de España.

Alternativas **sin cuenta**: un **Mac** con una voz premium (para escuchar; con la limitación de licencia de arriba) o
**Kokoro** en un ordenador (libre, algo menos natural que las comerciales). Si se permitiera a este entorno descargar de
Hugging Face, Claude podría generar las de Kokoro y Piper sin ninguna cuenta.

**Cómo generarlas:** con la cuenta de cada servicio, escribir las tres frases (una por archivo), voz femenina cálida de
España, **velocidad y tono normales**, y descargar en MP3 o M4A. Nombres: `a-1.mp3`, `a-2.mp3`, `a-3.mp3` (y `b-…`, `c-…`).
Adjuntarlos en el chat con el nombre del servicio y de la voz: Claude los coloca en la página de comparación.

### Página «Comparar voces»

`muestras/index.html` (con `muestras/muestras.json`): **escucha a ciegas** (Voz A, B, C; el servicio se puede destapar al
final), ▶ 1, ▶ 2, ▶ 3 y ▶ Las tres, orden **1.º, 2.º, 3.º** para copiar y enviar, y la **voz del iPhone** como referencia (como
el juego y con tono natural). Ahora tiene los tres huecos **pendientes**. No es el juego ni toca sus datos; guarda el orden
en el navegador (`voz2:orden`).
**Probado** (`muestras/prueba-muestras.js`, 10/10, con pitidos de prueba que no se guardan en el repositorio).

### Plan mixto, cuando se elija (no hecho)

- **Audios** para lo fijo y frecuente: saludos, ánimos, pistas, retos, colores, números, sabores y frases de los pedidos
  (los pedidos, por trozos o enteros, según cómo suenen las uniones).
- **Voz del dispositivo, con tono natural**, solo para lo variable (frases escritas por un adulto, nombres nuevos).
- Los audios irían en la caché sin conexión del juego (`sw.js`, archivo compartido): funcionan sin internet.
- Se probaría primero en una copia aislada con pocas frases, sin cambiar la voz general ni las referencias aprobadas.
