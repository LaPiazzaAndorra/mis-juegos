# ¿La capa común de lectura bloquea el salón? Diagnóstico (16/11/2026)

Para el Chat 1 (`avatar-creador`). Escrito por el chat de `juegos-pensar` a petición de la propietaria, que dijo (16/11/2026):

> He probado la versión del Chat 1 en mi iPhone. En la habitación las interacciones funcionan, pero en el salón no
> responden. Comprueba si la capa común de lectura puede estar interfiriendo con los eventos táctiles, los botones o las
> capas superpuestas. No modifiques a ciegas el código del salón, que pertenece a la otra rama. Si encuentras la causa,
> documéntala y coordina la corrección con avatar-creador.

**No se ha modificado nada de `avatar-creador`**: todo se probó en una copia temporal de su commit `f3005ce`, fuera del
repositorio.

## Resultado

**En Chromium (iPhone simulado, con toques táctiles reales), la capa común no cambia nada en el salón.** No he podido
reproducir el fallo de la propietaria. No se ha encontrado una causa en la capa. **No se ha podido probar en WebKit** (el
motor del iPhone), porque este entorno no lo tiene instalado.

| Prueba (copia `prueba-cuidar-2026-11-15`, con y sin la capa) | Con la capa | Sin la capa |
| --- | --- | --- |
| Su prueba del salón (`prueba-salon-aqui.js`, con ratón) | 30/31 y 31/31: el «toque tolerante» falla a veces (la taza: «nada» o «cojin-lila») | 31/31 en tres pasadas |
| Solo con `lectura.css` / solo con `lectura.js` | 31/31 / 30/31 (el mismo toque) | — |
| Ese toque tolerante aislado, repetido 14 veces | 14 de 14 | 13 de 13 (en 1 no había punto libre) |
| **Dedo real** (eventos táctiles de CDP), habitación y salón, vertical y horizontal: arrastrar a la muñeca, arrastrar el cojín, sacar algo de la bandeja, botón de misiones | **igual que sin la capa** | igual que con la capa |
| Cambios de clase en la página durante 2 s (por si la capa se disparaba en bucle) | 3–8 (habitación y salón, igual) | — |

Lecturas de esos datos:
- **El fallo intermitente del «toque tolerante»** sale solo dentro de la prueba completa y con la capa, pero aislado no
  falla (14 de 14). Depende de dónde caen las cosas, que se colocan al azar, y del momento. **No basta para culpar a la
  capa**, pero conviene vigilarlo: si vuelve a salir, mirar si algo cambia el tamaño de la escena entre calcular el punto y
  tocar (por ejemplo, el ajuste de títulos de la capa al cambiar una clase).
- **La capa trata igual la habitación y el salón** (pone una clase en `<html>`, mayúsculas y tamaños, y vigila el texto).
  Si interceptara los toques, fallarían las dos escenas, y la propietaria dice que la habitación funciona.
- **Las capas de luz y de noche del salón** (`.mm-noche`, `.mm-cielo`, `.mm-luz`, `.mm-zzz`, `.mm-bocadillo`) tienen
  `pointer-events:none`: en Chromium no se quedan los toques.

## Qué falta para cerrar el diagnóstico (en el iPhone; lo decide la propietaria)

1. **Comparar las dos copias del salón**, en la app de PRUEBAS:
   - `prueba-salon-2026-11-07`, **sin** la capa;
   - `prueba-cuidar-2026-11-15`, **con** la capa.

   Si el salón falla también sin la capa, la capa queda descartada.
2. **Anotar qué no responde exactamente**:
   - tocar un juguete o arrastrarlo;
   - la muñeca;
   - las flechas ◀ ▶;
   - el botón de misiones;
   - la lámpara o la ventana.

   También: si es de día o de noche, en vertical u horizontal, y si se ve algún aviso o bocadillo.

Hipótesis para el Chat 1, **solo para mirar en su código; no se ha cambiado nada**:
- Lo que solo existe en el salón: la lámpara y su luz, más objetos que medir y la merienda.
- La lectura del dibujo de cada objeto con un lienzo (`alfa()`, con `getImageData`). Si en el iPhone falla por memoria,
  el `try` lo trata como opaco: no debería bloquear, pero cambia qué se toca.
- Las capas a pantalla completa con `mix-blend-mode` y `z-index` muy alto. Llevan `pointer-events:none`, que el iPhone
  respeta, pero son lo primero que miraría en WebKit.

## La capa común en `juegos-pensar`

Integrada **sin cambios** (carpeta `docs/propuestas/lectura-2026-11-17/`, idéntica a la de `f3005ce`; lo comprueban
`prueba-pensar.js`, `prueba-pensar2.js`, `prueba-repasar.js` y `prueba-etapas.js`). Se carga justo después de
`logros.js`, como pide su LEEME. Lo propio de Pensar va en `lectura-pensar.css` y `lectura-pensar.js`, al final.

Su prueba (`lectura-2026-11-17/prueba-lectura.js`) espera Mi Mundo (`MM`), que no está en la copia de Pensar: pasa sus 9
primeras comprobaciones y se para en la de Mi Mundo. Su criterio de contraste y de texto cortado está copiado tal cual en
`prueba-lectura.js` de Pensar.

**No ha hecho falta cambiar nada de la capa común.** Sugerencia, si os parece: que su prueba compruebe Mi Mundo solo si
existe (`window.MM`), para poder pasarla también en la copia de Pensar.
