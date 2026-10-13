# Cómo crear las piezas de la muñeca

> La lista exacta de archivos de la primera versión premium está en **`ASSETS.md`**.

Guía para la **prueba de integración artística**: una muñeca base, un peinado y un vestido.
Estilo: la lámina de referencia («Mi Avatar Mágico»): muñequita de rizos, ojos grandes,
ropa elaborada, acabado de animación infantil y colores pastel.

---

## 1. Archivos de la plantilla

| Archivo | Para qué sirve |
|---|---|
| `plantilla-guia.png` | Lámina con cuadrícula, silueta, anclas y medidas. Para tenerla a la vista. |
| `plantilla-silueta.png` | Capa **transparente** con la silueta y las líneas. Se coloca en Procreate/Photoshop como capa de referencia. |
| `plantilla-zonas.png` | Hasta dónde puede llegar cada tipo de pieza. |
| `plantilla.js` | Las mismas medidas en datos (las usan el comprobador y el juego). |

### Medidas fijas (lienzo 2000 × 3500 px)

| Referencia | Posición |
|---|---|
| Eje central | x = 1000 |
| **Suelo (planta de los pies, descalza)** | **y = 3275** |
| Coronilla (cráneo, sin pelo) | y ≈ 460 |
| **Línea de ojos** | **y = 1040** (ojos en x ≈ 785 y 1215) |
| Boca | y ≈ 1290 |
| Barbilla | y ≈ 1480 |
| Hombros | (780, 1690) y (1220, 1690) |
| Codos | (714, 1957) y (1286, 1957) |
| Muñecas | (650, 2214) y (1350, 2214) |
| Cintura | y = 2150 |
| Cadera | y = 2260 |
| Rodillas | (922, 2700) y (1078, 2700) |
| Tobillos | (922, 3140) y (1078, 3140) |

**Postura:** de pie y de frente, con el peso en las dos piernas. Los brazos relajados y
separados del cuerpo unos 14°, con las palmas hacia las piernas. Los pies algo separados
y un poco abiertos. Expresión: sonrisa tranquila con los ojos abiertos.

> **Lo imprescindible:** el eje, el suelo y la línea de ojos deben coincidir.
> La silueta marca proporciones orientativas. Cuando aprobemos la muñeca base,
> **la propia base pasa a ser la plantilla**: mediré sus hombros, cintura y rodillas
> y actualizaré `plantilla.js`. Todas las piezas posteriores se dibujan encima de esa base.

---

## 2. Reglas para todas las piezas

1. **Lienzo completo de 2000 × 3500 px**, sin recortar ni cambiar el tamaño al exportar.
2. **Fondo transparente** (PNG de 32 bits), espacio de color **sRGB**.
3. **Nada se mueve**: cada pieza se dibuja en su sitio, encima de la base, en el mismo lienzo.
4. **Luz desde arriba a la izquierda** en todas las piezas, y los mismos tonos de línea.
5. **Sin sombras proyectadas fuera de la pieza** (ni en el suelo ni en el fondo). La sombra del
   suelo la pone el juego.
6. **Bordes limpios:** sin halo blanco ni restos del fondo entre los rizos.
7. **Lo que queda tapado también se dibuja** (ver cada pieza): así cualquier peinado encaja
   con cualquier vestido.
8. **Solapes:** la ropa entra 10–20 px por debajo del pelo y de los brazos, para que no queden
   rendijas.

### Nombres de archivo

```
base-clara.png
pelo-rizos-detras-castano.png
pelo-rizos-delante-castano.png
ropa-princesa.png
```

Más adelante: `base-morena.png`, `pelo-mono-alto-…`, `ropa-diario.png`, `zapatos-…`,
`acc-corona.png`… (minúsculas, sin espacios ni tildes; usar `-` entre palabras).

---

## 3. Paso a paso con vuestra herramienta de imágenes (opción B)

### Paso 1 · Generar la muñeca completa en la postura de la plantilla

Pedid **una sola imagen** de la muñeca vestida de princesa, de cuerpo entero, sobre
**fondo liso**. Texto orientativo:

> Ilustración original de una niña muñeca de estilo animación infantil, de cuerpo entero,
> **de pie y de frente, simétrica**, con los **brazos relajados y ligeramente separados del
> cuerpo** y las palmas hacia las piernas, **pies algo separados**, sonrisa tranquila y
> ojos abiertos mirando al frente. Pelo largo castaño con **rizos voluminosos**, ojos
> grandes marrones, piel clara. Vestido de princesa rosa pastel con volantes de encaje,
> mangas abullonadas, lazo en la cintura con un corazón dorado y zapatos rosas con lazos.
> **Fondo liso de un solo color verde #00B140, sin sombras en el suelo**, luz suave desde
> arriba a la izquierda. Formato vertical 4:7.

* Fondo verde: es el color que más se separa del rosa, el castaño y la piel.
* Si la herramienta lo permite, pedid el máximo de resolución.
* Repetid hasta tener una imagen **de frente y simétrica**. Es la imagen más importante:
  de ella saldrán las tres piezas.

### Paso 2 · Encajarla en la plantilla (Procreate, Photoshop o Photopea)

1. Lienzo nuevo de **2000 × 3500 px**, 300 ppp, sRGB.
2. Importad `plantilla-silueta.png` como capa de arriba, al 40–60 % de opacidad, y bloqueadla.
3. Importad la imagen generada por debajo. Escaladla (sin deformar) y movedla hasta que:
   **planta de los pies → línea del suelo · ojos → línea de ojos · centro del cuerpo → eje**.
4. Quitad el fondo verde (selección por color + refinar borde, o «Eliminar fondo»).
   Revisad bien entre los rizos.

### Paso 3 · Separar las tres piezas

Duplicad la capa tres veces y en cada copia dejad solo una parte:

**a) Muñeca base (`base-clara.png`)**
* Cuerpo completo: cabeza, cara, boca, orejas, cuello, brazos, manos, piernas y pies descalzos.
* **Los ojos van aparte** (`ojos-marron.png`, `ojos-azul.png`, `ojos-cerrados-…`): en la base,
  piel lisa donde van los ojos; las cejas sí se quedan en la base. Lista completa en `ASSETS.md`.
* El torso, con un **maillot o ropa interior sencilla** (blanco o rosa muy claro) ajustado al cuerpo.
* **Hay que pintar lo que tapaban el pelo y el vestido:** la parte alta de la cabeza (cráneo
  liso, con el nacimiento del pelo suave), las orejas, los hombros, los brazos completos y
  las piernas hasta la cadera.
* Sin pelo. Sin zapatos.

**b) Peinado de rizos: dos capas**
* `pelo-rizos-detras-castano.png`: todo el pelo que queda **por detrás** de la cabeza y del
  cuerpo (la masa de rizos de la espalda y los lados). Completad la zona que tapaba la cabeza.
* `pelo-rizos-delante-castano.png`: lo que queda **por delante**: flequillo, rizos que caen
  sobre la frente, los hombros o el pecho. **Sin piel** dentro de esta capa.
* El pelo debe **tapar la coronilla** de la base.

**c) Vestido de princesa (`ropa-princesa.png`)**
* Vestido completo con mangas y lazo, y también los zapatos para esta primera prueba
  (más adelante irán aparte).
* Pintad también lo que tapaba el pelo (los hombros y la espalda del vestido).
* Sin piel: brazos, cuello y piernas pertenecen a la base.

### Paso 4 · Exportar

Exportad **cada capa por separado como PNG**, con el lienzo completo de 2000 × 3500 y fondo
transparente, ocultando la capa de la plantilla. En Procreate: *Compartir → PNG* con solo esa
capa visible. En Photoshop: *Exportar → Capas a archivos*, sin «recortar».

### Paso 5 · Comprobar

Abrid `herramientas/comprobar-capas.html` (en el iPhone, el iPad o el ordenador) y elegid los
4 PNG. La página comprueba:

* tamaño exacto, fondo transparente y bordes sin halo blanco;
* que cada pieza esté dentro de su zona;
* base: pies en el suelo, cuerpo centrado y coronilla en su sitio;
* vestido: centrado con la base, hombros alineados y torso cubierto (en rojo, lo que se vea del cuerpo);
* pelo: centrado sobre la cabeza y cubriendo la coronilla.

Tiene que salir **«✅ Todas las capas encajan»**. Después me enviáis los PNG y yo los optimizo
e integro en el juego.

---

## 4. Para las animaciones (siguiente fase, no hace falta en esta prueba)

Cuando la base esté aprobada, añadiremos sobre esa misma base:

* `ojos-cerrados-clara.png`: párpados cerrados (parpadeo y dormir).
* `boca-abierta-clara.png`: sonrisa abierta (alegría, saludo).
* `brazo-izq-clara.png`, `brazo-der-clara.png`: brazos separados del cuerpo (saludar).
* `ropa-princesa-manga-izq.png` y `ropa-princesa-manga-der.png`: las mangas siguen a los brazos.
