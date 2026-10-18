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
