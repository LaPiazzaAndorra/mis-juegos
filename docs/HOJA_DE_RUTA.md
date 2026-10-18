# Hoja de ruta — ideas y desarrollos futuros

**Esta página NO significa que las funciones estén hechas.** Una idea está en «Propuesta» hasta que
haya commit, pruebas y aprobación. El estado real está en `docs/ESTADO_ACTUAL.md`.

| Prioridad | Área | Idea | Estado | Criterio de aceptación |
| --- | --- | --- | --- | --- |
| Alta | Vestir | Muñeca nueva D-013/D-014 con pelo, vestido, zapatos y corona | **Conjunto aprobado visualmente (D-016–D-018) y probado en el iPhone en una copia aislada (D-019).** Falta la resolución 2000 × 3500 y pasarlo al juego principal. | Capas a 2000 × 3500, catálogo del juego, pruebas y aprobación para activarla. |
| Alta | Vestir | Ojos azul, verde y lila de fantasía | **Variantes aprobadas visualmente** (D-020); marrones por defecto; en la copia nueva `prueba-juego-d021` | Prueba en el iPhone → aprobación → juego principal. |
| Alta | Vestir | Pelo castaño chocolate, rubio miel, castaño oscuro y pelirrojo jengibre | **Variantes y cejas a juego aprobadas visualmente** (D-022); castaño por defecto; en la copia nueva `prueba-juego-d023` | Prueba en el iPhone → aprobación → juego principal. |
| Alta | Vestir | Conjunto de aventura: camiseta con hoja, chaleco arena, pantalón verde, calcetines, botas y mochila | **Diseño aprobado** (D-027); encaje candidato en el visor (piel clara, castaño, melena), con la mochila separable; **faltan zonas** (rodillas: mallas a la vista; chaleco más ancho que nuestro torso; hombros bajo las tiras; lateral de la mochila) | Rodillas: opción A elegida (copia de la base; máscara lista) → hacer en ChatGPT las guías de rodillas, camiseta y chaleco, y mochila → integrar con `integrar/recibir.py` (preparado) → colores, pieles y peinados → copia de prueba → iPhone. |
| Alta | Vestir | Peinado nuevo: dos coletas rizadas con coleteros y sombrero de aventura | **Peinado, dos coletas completas y sus colores y pieles aprobados** (D-026); en la copia `prueba-juego-d026` | Prueba en el iPhone → colores y pieles → copia de prueba → iPhone. |
| Alta | Vestir | Peinado nuevo: coleta alta rizada con cinta deportiva | **Peinado, encaje, coleta sin cinta y colores de pelo y tonos de piel aprobados visualmente** (D-025); con y sin cinta; melena por defecto; sin probar en el iPhone | Copia de prueba del juego → prueba en el iPhone → aprobación → juego principal. |
| Media | Vestir | Accesorios de pelo: lazo, flores, mariposa, diadema, cinta, gorra, sombrero y gorrito | **Diseño aprobado** (D-024); lazo, flores y mariposa **aprobados visualmente** en el visor; diadema **aprobada visualmente**; gorrito de frente: **B aprobado** (también con colores de pelo y pieles); con la coleta, pendiente; **lazo en la base de la coleta: aprobado** (18/10); flores, mariposa, diadema, corona y dos lazos pequeños para la coleta y las dos coletas: **aprobados visualmente** (18/10; el visor avisa de lo que no es compatible y conserva el peinado); gorra de frente: **aprobada** (también con colores de pelo y pieles); cinta y sombrero, pendientes de versión de frente | Copia nueva del juego con los adornos de la coleta y las dos coletas (más adelante) → adaptar gorrito y gorra a los peinados → versión de frente y encaje de cinta y sombrero → copia nueva de prueba del juego → prueba en el iPhone → aprobación. |
| Media | Vestir | Pintacaras suave de estrellas y brillo | **Diseño y encaje aprobados visualmente** (D-021); en la copia nueva `prueba-juego-d021` | Prueba en el iPhone → aprobación → 2000 × 3500 y juego principal. |
| Alta | Datos | Copia de seguridad de todos los datos | Botones «Guardar / Recuperar mi progreso» aprobados e integrados en `avatar-creador`; versión de pruebas preparada (`docs/VERSION_DE_PRUEBAS.md`). | Prueba de la propietaria en la app «PRUEBAS» del iPhone → publicar con aprobación → primera copia real de Amaia. |
| Alta | Datos | La galería no debe borrar dibujos sin avisar cuando falta espacio | Propuesta | Aviso claro y opción de hacer copia antes de liberar espacio; nada se borra sin permiso. |
| Alta | Publicación | Proteger `main` y exigir «Documentación sincronizada» | Comprobación configurada; falta la regla de protección | Ver `docs/PRUEBAS_Y_RECUPERACION.md`, apartado F. |
| Alta | Vestir | Piel dorada, morena y profunda (con párpados cerrados y bordes) | **Tonos aprobados visualmente** (D-023); en la copia nueva `prueba-juego-d023` con pelo, cejas, ojos y pintacaras | Prueba en el iPhone → aprobación → 2000 × 3500 y juego principal. |
| Media | Vestir | Más peinados, colores, ojos, ropa y varios looks | Propuesta | Arte original con el mismo sistema de capas; varios personajes guardados. |
| Media | Mi Mundo | Llevar el personaje a los demás escenarios y más objetos interactivos | Propuesta | Personaje guardado que camina, juega y reacciona, sin emojis de personaje. |
| Media | Mi Mundo | Más espacio para el personaje en el iPhone horizontal | Propuesta | Bandeja de pegatinas plegable; personaje bien visible. |
| Media | Mascotas | Crear, nombrar y cuidar una mascota ilustrada | Propuesta | Elegir aspecto; comer, dormir, bañarse, mimos y expresiones animadas; se guarda. |
| Media | Movimiento | Gincana o carrera infantil | Propuesta | Obstáculos sencillos, dificultad progresiva y controles fáciles. |
| Media | Pintar | Láminas originales más elaboradas | Propuesta | Zonas rellenables con un toque, bordes limpios, deshacer y guardar. |
| Media | Pensar | Sustituir los emojis por ilustraciones propias | Propuesta | Arte uniforme sin perder la mecánica ni el progreso. |
| Media | Historias | Juegos de imaginación e historias | Propuesta | Por definir con la propietaria. |
| Media | Premios | Nuevos premios y recompensas | Propuesta | Conectados con las estrellas existentes, sin perderlas. |
| Baja | Accesibilidad | Botones y sonidos mejorados | Propuesta | Probado en distintos tamaños y con voces en castellano. |

## Plantilla para una idea nueva

**Título:** ___ · **Origen:** ___ · **Estado:** propuesta / diseño / desarrollo / prueba / aprobado / publicado · **Requisitos:** ___ · **Depende de:** ___ · **No romper:** ___ · **Pruebas de aceptación:** ___
