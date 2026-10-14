# Manual maestro — Mi Mundo de Juegos

**Edición inicial:** 14/10/2026. **Propósito:** asegurar continuidad del proyecto entre dispositivos, conversaciones y asistentes de IA.

## 1. Objetivo

Juego infantil creativo e interactivo en castellano, con una experiencia visual ilustrada y actual, preferentemente utilizable desde iPhone e iPad. Debe resultar divertido y fácil de tocar para una niña pequeña. Priorizar interacción real, calidad de ilustración y guardado seguro frente a pantallas decorativas.

## 2. Identidad y requisitos no negociables

- Conservar el diseño de menús aprobado: colores pastel, arcoíris, botones grandes e ilustraciones coherentes.
- No usar emojis del sistema para reemplazar a la muñeca y las mascotas finales. Algunos juegos de pensar todavía usan emojis: distinguir **estado actual** de **objetivo de rediseño**.
- Calidad de ilustración alta, expresiones amables, pequeños movimientos y retroalimentación positiva, sin publicidad ni trampas de compra.
- Cambios graduales: comprobar que cada funcionalidad sigue disponible antes de publicar.
- Mantener estrellas, dibujos, láminas importadas, avatar, escenas, niveles, monedas y ajustes existentes; cuando cambie el formato, definir una migración.
- El progreso pertenece al dispositivo/perfil del navegador hasta que se implemente sincronización o exportación completa validada.

## 3. Módulos del juego (verificados en instantánea de código del 13/10)

| Apartado | Lo existente en la copia auditada | Meta futura (si aplica) |
| --- | --- | --- |
| **Pintar** | Hoja en blanco, herramientas de pincel/cubo/sellos, deshacer, plantillas coloreables, importación de láminas y galería. | Más láminas originales detalladas, con zonas de relleno reales; nuevos conjuntos temáticos. |
| **Jugar a ser — Heladería** | Crear helados según pedidos; monedas y estrellas. | Más interacciones y personajes ilustrados. |
| **Jugar a ser — Vestir** | Avatar por capas, guardado de personaje y foto; desarrollo premium en rama. | Pelo, ojos, piel, prendas, zapatos y accesorios intercambiables de alta calidad; múltiples personajes/looks. |
| **Jugar a ser — Mi Mundo** | Habitación con avatar, cama, lámpara y ventana; escenarios y pegatinas arrastrables. | Más escenarios y actividades con la muñeca guardada, mascotas y pequeños relatos. |
| **Pensar** | Parejas, Contar, ¿Qué sigue?, Sombras y El diferente; dificultad progresiva y premios. | Sustituir gradualmente las figuras emoji por arte propio cuando esté preparado. |
| **Configuración** | Sonidos, voz, contador de estrellas, app instalable en móvil. | Opciones de accesibilidad y respaldo/exportación completo. |

**Importante:** la tabla es una auditoría de una copia antigua. Claude ha desarrollado después funcionalidades del avatar y un validador de pelo; consultar `docs/ESTADO_ACTUAL.md` y contrastar con la rama remota antes de dar una función por publicada.

## 4. Arquitectura en pocas palabras

Juego web instalable (PWA): `index.html` contiene interfaz y gran parte de la lógica; los módulos de `avatar/` componen la muñeca; `manifest.json` configura la instalación; `sw.js` permite la caché sin conexión. El contenido de las piezas se genera desde `arte/originales/` mediante utilidades de `herramientas/`, y el catálogo las referencia sin cambiar la interfaz pública del avatar.

Sin servidor de usuarios ni sincronización entre móviles confirmados. El navegador guarda progreso en `localStorage` y algunas láminas en `IndexedDB`.

## 5. Cómo añadir una funcionalidad

1. Registrar una idea en `docs/HOJA_DE_RUTA.md` con estado **Propuesta** y criterios de éxito.
2. Identificar datos existentes, rutas, módulos y compatibilidad; escribir qué no puede romperse.
3. Trabajar en una rama. La `main` es la versión que se protege.
4. Implementar solo la parte acordada, con recursos finales por capas si hay interacción.
5. Comprobar manualmente el flujo entero y la persistencia tras recarga; añadir pruebas reproducibles cuando sea viable.
6. Mostrar la prueba a la propietaria y obtener aprobación antes de activar por defecto.
7. Actualizar estado y changelog **en el mismo commit**.
8. Solo después de aprobar: revisión y publicación controlada; probar PWA instalada y caché.

## 6. Quién decide qué

- **Propietaria del proyecto:** decide estética, funcionalidades, aceptación visual y publicación.
- **Claude/agente de código:** implementa, prueba, conserva compatibilidad, documenta y señala límites.
- **Asistente de diseño/ilustración:** prepara recursos de alta resolución; no declara final una capa que aún no pasó validación.

## 7. Regla antiextravío

En una conversación nueva no basta con decir «continúa». Pedir expresamente: «Abre `CLAUDE.md` y la carpeta `docs/` del repositorio `LaPiazzaAndorra/mis-juegos`, confirma último commit y resume el estado antes de cambiar archivos». Esta frase no otorga permisos GitHub por sí sola.
