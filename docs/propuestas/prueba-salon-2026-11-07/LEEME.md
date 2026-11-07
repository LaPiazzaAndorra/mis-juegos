# Copia aislada · el salón de Mi Mundo (D-034) · 07/11/2026

**Pendiente de la prueba y la aprobación de la propietaria. No publicada.** No es el juego de Amaia: datos propios con
el prefijo `sal1:` (no lee ni cambia las partidas, ni las de otras copias) y sin service worker.

Enlace de prueba (siempre lo último de la rama):
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/avatar-creador/docs/propuestas/prueba-salon-2026-11-07/index.html>

## Qué tiene

Lo publicado en `main` (la prueba completa con Contar y Memoria de la 1.ª entrega) + **Mi Mundo con dos escenarios**:

- **🛏️ Habitación** (aprobada, D-033): igual que la publicada (fondo, cama, cesta, juguetes y la misión «Guardar los
  juguetes»).
- **🏠 Salón** (nuevo, en la escena «casa»): fondo, sofá, mesa, estantería, lámpara, alfombra y dos cojines de suelo al
  empezar; catálogo ilustrado de 15 objetos (los 14 recibidos y el osito aprobado).
- **Cambiar de escena** con 🛏️ y 🏠: cada uno conserva su distribución (claves `mm_habitacion2` y `mm_salon`).
- **Juego libre:** tocar un objeto de la bandeja lo pone (platos, tazas, tetera y galletas van a un sitio libre de la
  mesa; los cojines de sofá, al sofá; como mucho 6 platos y 6 tazas); arrastrar para mover; 🗑️ para quitar.
- **Cosas encima de los muebles:** soltadas encima de la mesa, del sofá o de un cojín de suelo, van a su sitio libre (la
  merienda a la mesa; el osito y el conejito sentados en el sofá o en un cojín; los cojines de sofá al sofá). **Al mover la
  mesa, el sofá o un cojín, lo que tienen encima va con ellos.** Al arrastrar una cosa se separa del mueble. Si se quita un
  mueble, lo que tenía encima queda en el suelo.
- **Misión «Merienda para tres»** (opcional, 🎯): se prepara la mesa (la mesa y los dos cojines a su sitio; la merienda en
  el suelo, delante; los invitados esperando detrás), y hay que poner **exactamente 3 platos y 3 tazas** (la mesa tiene tres
  sitios de cada: un cuarto plato no cabe), la tetera y las galletas, y sentar al osito y al conejito (10 pasos). Al
  terminar: celebración y **1 ⭐**, como siempre, anotada en las misiones; los logros no cambian.
- **Toque:** se coge lo que se toca de verdad (el dibujo, no los márgenes transparentes de su imagen); las cosas pequeñas
  se cogen aunque el dedo caiga a menos de 26 px de su dibujo (iPhone). En el iPhone en vertical, durante la merienda la
  cámara se abre lo justo para que todo quepa en la pantalla.
- **Copia de seguridad:** «Guardar / Recuperar mi progreso» incluye `mm_salon` (prefijo `mm_`, como la habitación).

## Archivos

| Archivo | Qué es |
| --- | --- |
| `recibidas/` | Las 14 imágenes del salón tal como llegaron (sin modificar; su huella, en `mimundo/arte/comprobaciones.json`). |
| `preparar_piezas.py` | Limpia el salón (con las funciones de la habitación) y copia tal cual las piezas de la habitación → `mimundo/arte/`. |
| `mimundo/` | Mi Mundo de esta copia: `mimundo.js` (motor con varios escenarios), `mimundo.css`, `catalogo-mimundo.js` (escenarios, objetos y misiones), `arte/` (23 piezas, `medidas.js`). Es la carpeta que se publicaría con `--con-mimundo` **cuando se apruebe**. |
| `preparar_copia.py` | Genera `index.html`, `progreso.js` y `logros.js` desde la prueba completa (como la publicación). |
| `aislamiento.js`, `manifest.json` | Datos propios `sal1:`, «PRUEBA SALÓN». |
| `prueba-salon.js` | Prueba automática (31 comprobaciones; iPad e iPhone simulados). |
| `prueba-sin-conexion.js` | Genera en una carpeta temporal la versión publicable con el salón (sin publicar) y la prueba en modo avión (8). |

## Cambios del motor respecto a la habitación publicada

Varios escenarios (cada uno con su fondo, su suelo, su catálogo, sus misiones y su clave), cosas encima de muebles (que
los acompañan), escala por ancho real (`anchoM`), la alfombra siempre debajo (`plano`), misión de tipo «poner», «vista» de
la cámara en pantallas estrechas y el toque sobre el dibujo. La habitación se juega igual (sus comprobaciones pasan aquí y
en su copia).

## Pendiente

- La prueba de la propietaria en el iPhone (versión de pruebas) y su aprobación. **No probado en un iPhone ni en un iPad
  reales**, solo en Chromium.
- La muñeca no se sienta (necesita una postura sentada; los que se sientan son los peluches). Los desbloqueables se
  propondrán aparte. Después, el parque.
- El osito es uno en cada escenario (cada escenario guarda lo suyo).
