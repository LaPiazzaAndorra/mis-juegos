# Pelo de delante de la melena sin los restos del bordado · 18/10/2026 (D-027)

**Encontrado con el conjunto de aventura:** el pelo de delante aprobado de la melena («mechones completos») lleva **9
trocitos sueltos (1 318 px)** sobre el pecho (caja x 408–574, y 657–795): restos del bordado del vestido de la imagen de la
que salió. Con el vestido rosa no se ven; con otra ropa, sí (manchitas rosas sobre el pecho).

**Limpieza localizada y reutilizable** (`limpiar_restos.py`):
- Solo se quitan los trozos **separados del pelo** (de menos de 2 000 px; el pelo son tres trozos de más de 40 000) con el
  centro dentro de la zona del pecho (x 380–640, y 620–1 000). Nada más del pelo cambia.
- La máscara es **la misma en los cinco colores** (D-022, mismo alfa): `restos-quitados.png`.
- Copias limpias: `pelo-delante-<color>-sin-restos.png` (castaño, chocolate, miel, oscuro y jengibre). **Los originales
  no cambian** (sha256 en `comprobaciones.json`).
- Las capas de bordes de cada tono de piel (`../piel-tonos/<tono>/bordes-pelo-*.png`) no tocan estos trocitos: siguen
  valiendo.

**Cómo reutilizarla con otro conjunto:** usar la copia limpia del color elegido en lugar del pelo de delante aprobado
(con el vestido rosa da igual una u otra), o, desde otro script, `import limpiar_restos as LR` y
`LR.sin_restos(capa)`. Hoy la usa el conjunto de aventura (visor, castaño).

Uso (desde la raíz): `python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-sin-restos/limpiar_restos.py`

## Coleta y dos coletas: pelo de detrás sin restos · 20/10/2026 (D-027)

**Encontrado con el conjunto de aventura** (sus mangas son más estrechas que las del vestido, que los tapaba):
- **Coleta** (con y sin cinta): dos trocitos sueltos que no son pelo (color de piel y del vestido): uno **junto al
  cuello**, a la izquierda (89 px, x 403–413, y 629–644: el que se veía) y otro detrás del cuello (229 px, tapado). Se
  quitan los trozos sueltos de menos de 3 000 px con el centro por debajo de y = 600; las puntas de rizos sueltas junto a
  las orejas se conservan.
- **Dos coletas** (con y sin sombrero): **restos rosas del vestido** entre los rizos, junto a los hombros y los brazos
  (2 608 px). Se reconocen por el color (rosa: en Lab a > 1,05·b; rosa claro: a > 0,9·b y L > 130; el pelo castaño tiene
  a ≈ 0,5–0,75·b) en los lados del cuerpo. El canto que toca pelo toma el color del pelo más cercano (sin recortar los
  rizos; también los huecos cerrados por el pelo); los huecos que dan al fondo pasan a transparentes.

`limpiar_coletas.py` → copias `pelo-coleta-<con|sin>-detras-<color>-sin-restos.png` y
`pelo-coletas-<con|sin>-sombrero-detras-<color>-sin-restos.png` (cinco colores; misma máscara en todos, mismo alfa),
máscaras `restos-coleta.png` y `restos-coletas-<con|sin>.png`, `comprobaciones-coletas.json` y
`antes-despues-coletas.png`. **Los originales no cambian** (sha256); fuera de las máscaras, las copias son idénticas. El pelo
de delante de los dos peinados no lleva restos. Con el conjunto, el visor usa estas copias; con el vestido, los originales.

Uso (desde la raíz): `python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-sin-restos/limpiar_coletas.py`
