# Prueba CONJUNTA · juegos de Pensar + Mi Mundo + norma de lectura · 16/11/2026

**Una sola prueba con las dos partes, pedida por la propietaria antes de publicar. No está publicada ni integrada de forma
definitiva.** Está en la rama aparte **`prueba-conjunta-2026-11-16`**:
- es `avatar-creador` (`4dd3a80`) con `juegos-pensar` (`bcb9f4d`) unida, sin conflictos;
- `avatar-creador` y `juegos-pensar` no cambian;
- datos propios `cnj1:`; no es el juego de Amaia.

Enlace (siempre lo último de la rama):
<https://raw.githack.com/LaPiazzaAndorra/mis-juegos/prueba-conjunta-2026-11-16/docs/propuestas/prueba-conjunta-2026-11-16/index.html>

## Qué carga, y en qué orden

1. El juego publicado (la prueba completa, con sus logros; `progreso.js` + el prefijo `mm_`).
2. **La capa común de lectura, una sola vez** (`../lectura-2026-11-17/`, la de `4dd3a80`, idéntica en las dos ramas), justo
   después de `logros.js`.
3. **Los juegos de Pensar** (`../pensar-2026-11-04/`, de `juegos-pensar` `bcb9f4d`), en su orden: Contar, Memoria, ¿Qué
   sigue?, Sombras, El diferente, Unir puntos, Repasar, Dibujos por partes, ¿Quién es? y Retos.
4. **Mi Mundo** (`../prueba-cuidar-2026-11-15/mimundo/`): habitación, salón y cuidar a la muñeca, sin copiarlo.
5. **Los ajustes propios de Pensar para la lectura**, por separado y los últimos (`lectura-pensar.css`, `lectura-pensar.js`).

La versión publicable se genera igual: `preparar_publicacion.py --con-lectura … --con-pensar … --con-mimundo …`. En esta
rama, `ARCHIVOS_PENSAR` incluye los 12 archivos de los juegos de Pensar y `lectura-pensar.*` va al final.

## Pruebas (Chromium; iPhone simulado; y WebKit, el motor de Safari)

| Prueba | Sobre esta copia | Resultado |
| --- | --- | --- |
| `prueba-conjunta.js` (nueva): carga, Contar y Parejas con el dedo, salón (tocar y arrastrar), habitación | sí | 9/9 |
| `../lectura-2026-11-17/prueba-lectura.js URL`: MAYÚSCULAS, nada cortado, 16 px, contraste, en 3 iPhone | sí | 16/16 |
| `../prueba-cuidar-2026-11-15/prueba-tactil.js` (`COPIA_URL=`): toques y arrastres reales en el salón y la habitación | sí | 14/14 |
| `../prueba-cuidar-2026-11-15/prueba-webkit.js` (`COPIA_URL=`): el salón en WebKit | sí | todo responde |
| Pruebas de Mi Mundo (cuidar 35, salón 31), con la carpeta y el prefijo de esta copia | sí | 35/35 y 31/31 |
| Pruebas de Pensar (pensar, pensar2, etapas, quién, repasar, retos y su lectura), con la carpeta y el prefijo de esta copia | sí | todo lo de los juegos, bien (ver nota) |
| `prueba-sin-conexion.js` (nueva): la versión publicable conjunta en modo avión | versión publicable | 11/11 |

**Nota:**
- Las pruebas de Pensar comprueban también que su rama no cambia nada fuera de su carpeta y que la carpeta de la capa común
  es idéntica a la de `4dd3a80`.
- En la rama conjunta eso no puede cumplirse:
  - aquí está Mi Mundo;
  - la prueba común `prueba-lectura.js` ahora recorre las pantallas por los botones de los menús, con su dato (antes abría a
    la fuerza pantallas internas que necesitan un dato, y daba errores falsos);
  - `lectura.css` y `lectura.js` siguen idénticos.
- Esas dos comprobaciones fallan aquí a propósito; todo lo demás pasa:
  - pensar 51/53;
  - pensar2 34/36;
  - etapas 38/40;
  - quién 22/22;
  - repasar 27/29;
  - retos 67/68;
  - su lectura 37/37.
- **Pendiente:** la prueba de la propietaria en su iPhone.
