#!/usr/bin/env python3
"""
Axilas del vestido opción B completadas por EDICIÓN DE PÍXELES (sin regenerar la ilustración), en una COPIA.

Solo cambian los píxeles de mascara-falta-tela.png (las dos zonas de las axilas). Fuera de la máscara, la copia es
idéntica a vestido-opcion-b.png (comprobado píxel a píxel).

  1. Textura: cada zona se rellena con tela COPIADA de la tela contigua del propio vestido, con un traslado puro
     (sin escala ni giro): se busca el desplazamiento casi horizontal (|dy| ≤ 4 px), hacia el centro del cuerpo, cuyo
     origen es tela opaca fuera de la máscara y que mejor continúa la tela de alrededor, evitando bordados y brillos.
  2. Transición suave: la diferencia de color entre la tela copiada y la tela real en el contorno de la zona se
     reparte por dentro de la zona de forma suave (interpolación armónica), así no queda costura.
  3. Opacidad: la tela nueva es opaca (alfa 255); solo en el borde exterior (el que da al brazo o al fondo, nunca sobre
     la camiseta) se deja 1 px de borde suave.

Comprobaciones: nada cambia fuera de la máscara, no queda fondo blanco en la zona y la camiseta de la base ya no se ve.

Uso (desde la raíz): python3 docs/propuestas/vestido-rosa-2026-10-15/opcion-b/completar_axilas.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; VES = AQUI.parent
sys.path[:0] = [str(VES / 'montaje')]
import montaje_vestido as MV   # noqa: E402

R = MV.R; H, W, YY, XX = MV.H, MV.W, MV.YY, MV.XX
CLARO, OSCURO = MV.CLARO, MV.OSCURO
EJE = 479


def armonica(fijo, valores, zona, iteraciones=3000):
    """Interpolación armónica dentro de `zona`: los píxeles `fijo` mantienen `valores`; el resto se suaviza (bordes
    libres sin condición, como Neumann)."""
    ys, xs = np.nonzero(zona | fijo); y0, y1, x0, x1 = ys.min() - 1, ys.max() + 2, xs.min() - 1, xs.max() + 2
    z = zona[y0:y1, x0:x1]; f = fijo[y0:y1, x0:x1]; v = valores[y0:y1, x0:x1].astype(float).copy()
    activo = z | f; u = np.where(f[..., None], v, 0.0)
    k = np.array([[0, 1, 0], [1, 0, 1], [0, 1, 0]], float)
    n = nd.convolve(activo.astype(float), k, mode='constant')
    for _ in range(iteraciones):
        s = np.stack([nd.convolve(u[..., c] * activo, k, mode='constant') for c in range(u.shape[-1])], -1)
        nuevo = s / np.maximum(n, 1)[..., None]
        u = np.where(f[..., None], v, np.where(z[..., None], nuevo, 0.0))
    out = np.zeros_like(valores, dtype=float); out[y0:y1, x0:x1] = u
    return out


def completar(vb, mascara):
    rgb = vb[..., :3].astype(float); a = vb[..., 3]
    tela = (a == 255) & ~mascara
    lum = rgb.mean(-1); grad = np.hypot(*np.gradient(nd.gaussian_filter(lum, 1.0)))
    salida = vb.copy(); info = []
    lb, n = nd.label(mascara)
    for i in range(1, n + 1):
        z = lb == i; ys, xs = np.nonzero(z)
        anillo = nd.binary_dilation(z, iterations=3) & ~z & tela; ay, ax = np.nonzero(anillo)
        dentro = 1 if xs.mean() < EJE else -1                                    # hacia el centro del cuerpo
        ancho = xs.max() - xs.min() + 1; mejor = None
        for dy in range(-4, 5):
            for d in range(4, ancho + 40):
                dx = dentro * d; sy, sx = ys + dy, xs + dx
                if not tela[sy, sx].all():
                    continue
                err = np.abs(rgb[ay, ax] - rgb[ay + dy, ax + dx]).mean() if ay.size else 0
                err += 0.5 * max(0.0, grad[sy, sx].mean() - grad[ay, ax].mean())    # evita bordados y brillos
                if mejor is None or err < mejor[0]:
                    mejor = (err, dx, dy)
        e, dx, dy = mejor
        copia = np.zeros_like(rgb); copia[ys, xs] = rgb[ys + dy, xs + dx]
        # transición: diferencia en el contorno con tela real, repartida por dentro
        fijo = nd.binary_dilation(z, iterations=1) & ~z & tela
        dif = np.zeros_like(rgb); fy, fx = np.nonzero(fijo); dif[fy, fx] = rgb[fy, fx] - rgb[fy + dy, fx + dx]
        corr = armonica(fijo, dif, z)
        nuevo = np.clip(copia + corr, 0, 255)
        salida[ys, xs, :3] = np.round(nuevo[ys, xs]).astype(np.uint8); salida[ys, xs, 3] = 255
        info.append(dict(zona=i, px=int(z.sum()), caja=[int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
                         origen_desplazado=[int(dx), int(dy)], error_de_continuidad=round(float(e), 1)))
    return salida, info


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    rutas = dict(opcion_b=AQUI / 'vestido-opcion-b.png', mascara=AQUI / 'mascara-falta-tela.png',
                 original=VES / 'vestido-candidato-original.png', base=MV.BASE / 'base-transparencia-corregida.png',
                 sin_ojos=MV.BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
                 abiertos=MV.BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
                 cerrados=MV.BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png',
                 pelo_detras=MV.VAR / 'pelo-variante-sin-mechon-detras.png', pelo_delante=MV.VAR / 'pelo-variante-sin-mechon-delante.png',
                 brazos=VES / 'montaje' / 'brazos-delante-copiados-de-la-base.png')
    antes = {k: sha(p) for k, p in rutas.items()}
    vb = MV.abrir(rutas['opcion_b']); mascara = np.array(Image.open(rutas['mascara'])) > 0
    base, sin, ab, ce, det, dela, brazos = (MV.abrir(rutas[k]) for k in ('base', 'sin_ojos', 'abiertos', 'cerrados', 'pelo_detras', 'pelo_delante', 'brazos'))
    vc, info = completar(vb, mascara)
    # 1 px de borde suave solo hacia fuera (brazo o fondo), nunca donde debajo está la camiseta de la base
    ropa = MV.ropa_de_la_base(base)
    exterior = mascara & nd.binary_dilation((vb[..., 3] < 128) & ~mascara, iterations=1) & ~ropa
    vc[exterior, 3] = 200
    Image.fromarray(vc, 'RGBA').save(AQUI / 'vestido-opcion-b-axilas-completadas.png', optimize=True)
    estados = {'abiertos': MV.montar([det, sin, ab, vc, brazos, dela]), 'cerrados': MV.montar([det, sin, ce, vc, brazos, dela])}
    for k, v in estados.items():
        Image.fromarray(v, 'RGBA').save(AQUI / f'montaje-axilas-completadas-{k}.png', optimize=True)
    antes_m = MV.montar([det, sin, ab, vb, brazos, dela])

    # --- comprobaciones ---------------------------------------------------------------------------------------
    fuera_igual = bool((vc == vb)[~mascara].all())
    lab = R.lab_rgba(vc); L = lab[..., 0]; C = np.hypot(lab[..., 1], lab[..., 2])
    blanco = mascara & (L > 230) & (C < 12)
    af = lambda c: c[..., 3] / 255
    vis = af(base) * (1 - af(vc)) * (1 - af(brazos)) * (1 - af(dela))
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes, metodo='copia de textura contigua + transición armónica (edición de píxeles)',
                zonas=info, fuera_de_la_mascara_identico=fuera_igual, cambiados_px=int(((vc != vb).any(-1)).sum()), mascara_px=int(mascara.sum()),
                blanco_del_fondo_en_la_zona_px=int(blanco.sum()), borde_suave_exterior_px=int(exterior.sum()),
                camiseta_visible_mas_10_por_ciento_px=int((ropa & (vis > 0.10)).sum()),
                camiseta_visible_1_a_10_por_ciento_px=int((ropa & (vis > 0.01) & (vis <= 0.10)).sum()),
                camiseta_visible_en_las_axilas_mas_1_por_ciento_px=int((ropa & (vis > 0.01) & nd.binary_dilation(mascara, iterations=8)).sum()))
    comp['fuentes_sin_cambios'] = antes == {k: sha(p) for k, p in rutas.items()}

    # --- vistas -----------------------------------------------------------------------------------------------
    F = R.MK.F
    def zoom(img, caja, k=3):
        return img.crop(caja).resize(((caja[2] - caja[0]) * k, (caja[3] - caja[1]) * k), Image.NEAREST)
    filas = []
    for t, caja in (('Axila izquierda', (335, 740, 425, 850)), ('Axila derecha', (550, 740, 640, 850))):
        borde = mascara & ~nd.binary_erosion(mascara)
        con_m = np.array(R.MP.blanco(vc, OSCURO)); con_m[borde] = (0, 200, 255)
        ps = [('Opción B · vestido solo', zoom(R.MP.blanco(vb, OSCURO), caja)), ('Completada · vestido solo', zoom(R.MP.blanco(vc, OSCURO), caja)),
              ('Completada · azul: borde de la zona', zoom(Image.fromarray(con_m), caja)),
              ('Antes · sobre la muñeca', zoom(R.MP.blanco(antes_m), caja)), ('Completada · sobre la muñeca', zoom(R.MP.blanco(estados['abiertos']), caja)),
              ('Completada · fondo claro', zoom(R.MP.blanco(vc, CLARO), caja))]
        f = Image.new('RGB', (6 * (ps[0][1].width + 8), ps[0][1].height + 24), 'white'); d = ImageDraw.Draw(f)
        for j, (tt, p) in enumerate(ps):
            f.paste(p, (j * (p.width + 8), 22)); d.text((j * (p.width + 8) + 2, 4), f'{t} · {tt}' if j == 0 else tt, font=F(13), fill=(40, 40, 60))
        filas.append(f)
    out = Image.new('RGB', (filas[0].width, 34 + sum(f.height + 8 for f in filas)), 'white')
    ImageDraw.Draw(out).text((4, 8), f'Axilas ×3 · textura copiada de la tela contigua · blanco en la zona: {comp["blanco_del_fondo_en_la_zona_px"]} px · '
                                     f'camiseta visible (>10 %): {comp["camiseta_visible_mas_10_por_ciento_px"]} px', font=F(16), fill=(40, 40, 60))
    y = 34
    for f in filas:
        out.paste(f, (0, y)); y += f.height + 8
    out.save(AQUI / 'comparacion-axilas-completadas.png', optimize=True)
    pan = [('Opción B', R.MP.blanco(antes_m)), ('Axilas completadas', R.MP.blanco(estados['abiertos'])), ('Axilas completadas · cerrados', R.MP.blanco(estados['cerrados']))]
    ps = [p.crop((20, 20, 928, 1640)).resize((358, 640), Image.LANCZOS) for _, p in pan]
    fr = Image.new('RGB', (3 * 368, 668), 'white'); d = ImageDraw.Draw(fr)
    for i, ((t, _), p) in enumerate(zip(pan, ps)):
        fr.paste(p, (i * 368, 26)); d.text((i * 368 + 2, 6), t, font=F(14), fill=(90, 80, 110))
    fr.save(AQUI / 'vista-axilas-completadas.png', optimize=True)
    (AQUI / 'comprobaciones-axilas-completadas.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
