# Guía 2 · Mochila completa, cuerpo de detrás y tiras de delante (D-027) · 18/10/2026

**Qué falla ahora:** de la mochila solo se ve, en la imagen, un trozo del lateral izquierdo (entre su brazo y su cuerpo);
el resto lo tapan el brazo y el pelo de la niña. Con nuestra muñeca (brazos en otro sitio) y con la coleta o las dos
coletas, se verían huecos. Las tiras sí se ven, pero van sobre la camiseta y el chaleco de la imagen; tienen que ir sobre
los nuevos (guía 1) y sobre nuestros hombros.

Se piden **dos piezas independientes**, para poder quitar la mochila:
1. **el cuerpo de detrás**: la mochila **entera**, sola, de frente (como si se viera a través de la niña), para colocarla
   detrás de nuestra base: asomará por donde corresponda según el peinado y los brazos;
2. **las tiras de delante**: las dos tiras con sus hebillas, sobre los hombros de nuestra muñeca.

## Qué adjuntar

1. `../../referencias/referencia-conjunto-aventura-aprobada.png` (el diseño aprobado).
2. `referencia-mochila.png` (en verde, el cuerpo que se ve; en morado, las tiras).
3. `plantilla-mochila-sobre-nuestra-muneca.png` (dónde va: el cuerpo detrás; las tiras, en los hombros).
4. Para las tiras: la plantilla con la camiseta y el chaleco nuevos (resultado de la guía 1) o, si aún no está,
   `../1-camiseta-y-chaleco/plantilla-nuestra-muneca-entera.png`.

## Mensajes (copiar; uno cada vez)

> **Cuerpo de la mochila.** Dibuja **solo la mochila verde** del diseño aprobado, **entera** (cuerpo, bolsillo lateral
> con su solapa arena, costuras y textura iguales), vista **de frente**, del **mismo tamaño** que en la imagen aprobada,
> sin la niña, sin las tiras de los hombros y sobre fondo crema liso, sin texto ni marcos.

> **Tiras de delante.** Sobre la plantilla de nuestra muñeca (mismo lienzo, tamaño y posición), dibuja **solo las dos
> tiras** de la mochila del diseño aprobado, con sus **hebillas** iguales, bajando por los hombros por encima de la
> camiseta y por debajo del chaleco, como en la imagen aprobada. No cambies la muñeca ni la ropa; fondo crema liso.

## Cómo se revisará

Se toman solo la mochila y las tiras (sin piel, pelo ni ropa de la imagen), cada una como capa independiente; el cuerpo
va detrás de la base y las tiras entre la camiseta y el chaleco. Se comprueba con la melena, la coleta y las dos coletas,
y que sin la mochila no quede nada de ella.

## Recibido

- **20/10/2026 · cuerpo de la mochila, sin tiras** (guía 2a): `de-chatgpt/mochila-cuerpo-chatgpt.png` (1 348 × 1 167,
  fondo transparente, SHA-256 `858432cbb9c3b8402465e5b8346f54e6c4f7b7674a38aea4a5295d9873133cee`), sin modificar.
  Colocado en `../../integrar/mochila-b/` (candidatas A y B). **Las tiras (guía 2b), pendientes.**

## Tiras nuevas sobre la mochila A (20/10/2026, guía 2b)

La propietaria **elige la mochila A** (centrada en el torso) y pide las tiras nuevas sobre los hombros tomándola como
referencia. Preparado con `../preparar_tiras_a.py`:
- `plantilla-tiras-con-mochila-a.png`: nuestra muñeca con el conjunto ajustado (camiseta de `integrar/ropa-c`, pantalón,
  chaleco, calcetines y botas de `integrar/ropa-d`) y la mochila A detrás, **sin pelo** (para que se vean los hombros),
  en nuestro lienzo de 948 × 1659. Es la imagen sobre la que se dibujan las tiras.
- `guia-tiras-sobre-a.png`: detalle de los hombros. En azul, el borde de arriba de la mochila A, detrás de los hombros
  (de donde salen las tiras); en morado, los hombros del chaleco, por donde bajan.

**Cambio respecto a la guía antigua:** nuestro chaleco cubre los hombros hasta la manga, así que unas tiras **por debajo**
del chaleco no se verían. Se piden **por encima del chaleco** (como se lleva una mochila sobre la ropa). Si la propietaria
prefiere otra cosa, se cambia el mensaje antes de enviarlo.

**Adjuntar:** `../../referencias/referencia-conjunto-aventura-aprobada.png`, `plantilla-tiras-con-mochila-a.png` y
`guia-tiras-sobre-a.png`.

> **Tiras de la mochila.** Sobre la plantilla de nuestra muñeca (la misma imagen: mismo lienzo, tamaño, posición y
> encuadre), dibuja **solo las dos tiras** de la mochila verde del diseño aprobado, con sus **hebillas** iguales (mismo
> verde, costuras y textura). Cada tira sale del borde de arriba de la mochila, detrás del hombro (en azul en la guía),
> pasa por encima del hombro y baja **por encima del chaleco**, por la zona morada, hasta la altura del pecho. Las dos
> iguales y simétricas. **No cambies nada más**: ni la muñeca, ni su cara, ni la ropa, ni la mochila; sin pelo, sin
> sombras nuevas, fondo crema liso, sin texto ni marcos.

**Al recibirla:** `python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/recibir.py tiras-a <imagen>` → alinea por
los ojos, toma solo lo nuevo (verde y sus hebillas) en los hombros y el pecho → `integrar/mochila-b/tiras.png`, con
`comprobaciones.json` y `revision.png` (y avisa si ChatGPT ha cambiado algo fuera de las tiras). Probado con una imagen
simulada (la plantilla con las tiras antiguas encima, a 1024 × 1792): recupera el 98 % de las tiras, con 17 px distintos
fuera de ellas.
