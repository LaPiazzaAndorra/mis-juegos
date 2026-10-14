# Estado actual y siguiente paso

**Última actualización:** 14/10/2026 (copia integrada y versión de pruebas) · **Rama:** `avatar-creador` ·
**Último commit funcional:** el de la entrada más reciente de `docs/REGISTRO_CAMBIOS.md` (copia
integrada), probado solo en simulación · **`main`:** `4bbf51d`, sin cambios desde el 11/10/2026.

## Repositorio

- Juego: `LaPiazzaAndorra/mis-juegos` (**público**). No confundir con `la-piazza-gestio`.
- `main` = versión publicada (11/10/2026), commit `4bbf51d`: es el **punto de recuperación**. La etiqueta
  `publicado-2026-10-11` está pendiente: el entorno de Claude no puede subir etiquetas (error 403);
  hay que crearla desde la web (ver `docs/PRUEBAS_Y_RECUPERACION.md`, apartado D).
- `avatar-creador` = desarrollo en curso, **sin publicar**.
- Dirección pública del juego: **por confirmar** con la propietaria.

## Qué hay en `avatar-creador`

- Todo lo de `main`: pintar, láminas e importación, galería, heladería, juegos de pensar, ajustes y
  funcionamiento sin conexión. El código de esas partes no se ha cambiado, pero **la prueba
  automática no las cubre todavía**: hay que revisarlas a mano antes de publicar.
- **Vestir** nuevo: creador de avatar con guardado y edición posterior (`avatar`, `avatar_draft`),
  foto, parpadeo, saludo y salto. Con el arte actual, el juego normal usa la **muñeca provisional**
  (`prueba`) con dos tonos de piel.
- **Mi Mundo:** habitación interactiva con el personaje guardado (caminar, cama, pelota, lámpara,
  día/noche), además de los 6 escenarios anteriores.
- **Muñeca premium en revisión** (`?arte=borrador`): base V2.1 + ojos marrones o azules +
  parpadeo y ojos cerrados.
- **Herramientas:** plantilla y guías, comprobador de capas, validador de pelo, optimizador,
  medidor de la base, variantes de color, copia de seguridad de datos y comprobación de documentación.

## Pruebas hechas (14/10/2026, sobre `b266e52` + este commit)

- `node pruebas/prueba-juego.js`: **21/21 correctas** en Chromium, con tamaño iPad (1180 × 820) e
  iPhone horizontal (852 × 393). Cubre Vestir, guardar y recuperar, Mi Mundo, cama, datos antiguos
  intactos, muñeca vectorial, premium en borrador con parpadeo y copia de seguridad de ida y vuelta.
- `herramientas/verificar_documentacion.py`: probado con commits anteriores (detecta la falta de
  estado y registro, y una caché sin subir de versión en `a6140b2`).
- **No probado todavía:** iPhone y iPad reales, app instalada sin conexión, la herramienta de copia
  en Safari y el workflow de GitHub Actions ejecutándose en un pull request real.

## Copia de seguridad integrada y versión de pruebas

- Amaia juega desde la **app instalada** en el iPhone: sus datos están separados de Safari, así que la
  herramienta `copia-de-seguridad.html` y el marcador **no sirven** para ella.
- **Integrado en la rama** (diseño aprobado el 14/10): «Guardar mi progreso» y «Recuperar mi progreso»
  en ⚙️ Ajustes, con copia automática previa y «Deshacer» (`docs/PRUEBAS_Y_RECUPERACION.md`, C2). Caché `v9`.
- **Versión de pruebas** para el iPhone de la propietaria: otro origen (`raw.githack.com`), otra app
  («PRUEBAS», icono verde), cinta visible, datos ficticios, y el juego normal rechaza sus copias.
  Enlace e instrucciones: `docs/VERSION_DE_PRUEBAS.md`.
- Probado en Chromium simulando la app instalada y la hoja de compartir: `prueba-copia.js` **45/45** y
  `prueba-juego.js` **21/21**.
- **No probado todavía:** en el iPhone real (guardar en iCloud Drive, elegir el archivo, deshacer, sin
  conexión) — lo hará la propietaria con la versión de pruebas. Desde el entorno de Claude no se ha
  podido abrir el enlace de `raw.githack.com` (la red del entorno lo bloquea).
- **Sin publicar:** `main` y la app de Amaia no cambian.

## Muñeca premium

| Pieza | Estado | Siguiente acción |
| --- | --- | --- |
| Base clara V2.1 | ✅ Aprobada (`b534d9b`) | Conservar el archivo editable original fuera del repositorio. |
| Ojos marrones, ojos cerrados (piel clara), ojos azules | ✅ Aprobados (`7890d1c`) | — |
| Pelo rizado castaño (detrás y delante) | ⏳ Esperando el arte nuevo | Crear con `plantilla/PELO.md`; validar con `herramientas/validar-pelo.html`. |
| Vestido rosa, zapatos, corona | ⏳ Pendiente | Después del pelo. |
| Piel morena y ojos cerrados morenos | ⏳ Pendiente | Borradores automáticos posibles. |

## Próximo paso

1. (Después de validar la copia) Recibir las dos capas de pelo nuevas, pasarlas por el validador, montarlas en `?arte=borrador`
   y enseñarlas en iPhone e iPad para su aprobación.
2. Después: vestido rosa, zapatos y corona. Con eso, la muñeca premium pasa a ser la del juego normal.
3. Copia integrada: la propietaria la prueba en la app «PRUEBAS» (`docs/VERSION_DE_PRUEBAS.md`) →
   correcciones si hacen falta → publicar con aprobación → en el iPhone de Amaia, guardar una primera copia.
   Después, el pelo rizado.
4. Configurar la protección de `main` (`docs/PRUEBAS_Y_RECUPERACION.md`, apartado F).
5. Antes de publicar: pull request a `main`, comprobación de documentación verde, copia de los datos
   de Amaia, aprobación de la propietaria y prueba de la app instalada.

## Problemas conocidos

- Hoy **no hay forma de hacer copia** de los datos de la app instalada de Amaia (se resolverá con la copia integrada).
- La galería borra los dibujos más antiguos sin avisar si falta espacio (también en `main`).
- En el iPhone horizontal, el personaje de la habitación se ve pequeño.
- Borde ligeramente dentado al 100 % en los codos de la V2.1 (no se aprecia en el juego).
- `arte/originales/demo-diario.png` es un recorte de la lámina de referencia, solo para `?arte=demo`.

## No modificar sin permiso

`main` y la versión publicada; las claves de datos y la base IndexedDB; el arte original aprobado
(conservar siempre copia); `docs/historico/`.
