#!/usr/bin/env python3
"""
Pintacaras «Estrellas y brillo» (D-021): capa transparente INDEPENDIENTE con solo los adornos de las mejillas
(estrellas rosas, lilas y doradas y pequeños puntos de brillo), encajada en NUESTRA cara a 948 × 1659.

De la referencia aprobada (referencia-pintacaras-aprobada.png, imagen generada, sin modificar) solo se toman los
píxeles de los adornos; la piel, las pecas, los ojos y las pestañas de la referencia NO se toman:
  · fondo de piel estimado con una mediana grande (41 px) en cada mejilla; un píxel es adorno solo si se separa
    claramente de esa piel (ΔE Lab);
  · estrellas: manchas grandes y compactas (≥ 90 px) rellenas por dentro (su brillo y su relieve son de la estrella);
  · puntos de brillo: manchas pequeñas MÁS CLARAS que la piel. Las manchas pequeñas más oscuras son pecas y no se
    toman; tampoco nada que toque el borde del recorte (pestañas, oreja, ojo);
  · transparencia: estrellas opacas (el borde suave sale del reescalado); cada punto de brillo lleva el color de su
    centro y una alfa proporcional a lo que se separa de la piel (así no arrastra color de piel).
Encaje: cada mejilla se coloca respecto a SU ojo (centros de iris medidos: referencia (316, 690) y (636, 691);
nuestra cara (391, 444) y (565, 444)) con la escala de los iris (≈ 0,52) y el desplazamiento de ENCAJE (medido para
que caigan dentro de nuestras mejillas). La cara original no se toca: la capa va encima, como el resto de piezas.

Comprobaciones (comprobaciones.json): sin solape con ojos abiertos (todas sus variantes de color) ni cerrados, ni con
las pestañas, ni con la boca, ni con las pecas; todo dentro de la piel de la cara; fuentes sin cambios.

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/pintacaras/pintacaras.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageCms, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; BASE = AQUI.parent; RAIZ = BASE.parents[2]
sys.path[:0] = [str(BASE / 'ojos-abiertos')]
import mascara as MK   # noqa: E402

REF = AQUI / 'referencia-pintacaras-aprobada.png'
SIN_OJOS = BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'
ABIERTOS = BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png'
CERRADOS = BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png'
COLORES = [BASE / 'ojos-colores' / f'capa-ojos-abiertos-{k}.png' for k in ('azul', 'verde', 'lila')]
PELO_DELANTE = (BASE / 'pelo-borrador-d012' / 'revision-localizada' / 'variante-experimental' / 'redistribucion-hombros'
                / 'mechones-completos-chatgpt' / 'pelo-delante-mechones-completos.png')
MONTAJE = RAIZ / 'docs' / 'propuestas' / 'corona-2026-10-15' / 'montaje' / 'montaje-corona.png'
SALIDA = AQUI / 'capa-pintacaras-estrellas.png'

# mejillas de la referencia: recorte, ojo de referencia y ojo nuestro
MEJILLAS = {'izquierda': dict(caja=(170, 725, 340, 860), ojo_ref=(316, 690), ojo=(391, 444)),
            'derecha': dict(caja=(630, 725, 800, 860), ojo_ref=(636, 691), ojo=(565, 444))}
ESCALA = 0.52                     # radio de iris: 31 px (nuestro) / ≈ 60 px (referencia)
ENCAJE = {'izquierda': (-3, 7), 'derecha': (3, 8)}  # ajuste fino (px, en nuestra cara): hacia abajo y hacia fuera,
                                                    # el mínimo para no tocar la capa de ojos ni salir de la piel
UMBRAL = 14.0                     # ΔE mínimo para separar un adorno de la piel


def lab_a_rgb(lab):
    q = np.round(lab).astype(int); q[..., 0] = np.clip(q[..., 0], 0, 255); q[..., 1:] = np.clip(q[..., 1:], -128, 127) & 255
    t = ImageCms.buildTransform(ImageCms.createProfile('LAB'), ImageCms.createProfile('sRGB'), 'LAB', 'RGB')
    return np.array(ImageCms.applyTransform(Image.fromarray(q.astype(np.uint8), 'LAB'), t))


def adornos(lab, caja):
    """Adornos de una mejilla de la referencia, a su tamaño: RGBA (alfa sin premultiplicar) + datos."""
    x0, y0, x1, y1 = caja; c = lab[y0:y1, x0:x1]
    piel = np.stack([nd.median_filter(c[..., i], size=41) for i in range(3)], -1)
    d = c - piel; dE = np.sqrt((d ** 2).sum(-1)); dL = d[..., 0]
    et, n = nd.label(dE > UMBRAL); h, w = dE.shape
    borde = np.zeros((h, w), bool); borde[:14] = borde[-2:] = True; borde[:, :2] = borde[:, -2:] = True
    estrellas = np.zeros((h, w), bool); puntos = []; pecas = 0
    for i, sl in enumerate(nd.find_objects(et), 1):
        m = et[sl] == i; a = int(m.sum()); full = et == i
        if (full & borde).any():
            continue                                  # pestañas, ojo, oreja: tocan el borde del recorte
        if a >= 90:
            estrellas |= full
        elif a >= 3:
            if dL[full].mean() > 8:
                puntos.append(full)
            else:
                pecas += 1                            # más oscuro que la piel: peca (no se toma)
    # estrellas: unir sus partes (relieve oscuro incluido) y rellenar por dentro
    cerca = nd.binary_dilation(estrellas, iterations=3)
    for i in range(1, n + 1):
        full = et == i
        if not (full & borde).any() and (full & cerca).any() and not (full & estrellas).all():
            estrellas |= full
    estrellas = nd.binary_fill_holes(nd.binary_closing(estrellas, iterations=1))
    se, ns = nd.label(estrellas)
    rgb = lab_a_rgb(c); alfa = np.zeros((h, w)); col = np.zeros((h, w, 3))
    alfa[estrellas] = 1; col[estrellas] = rgb[estrellas]
    usados = 0
    for full in puntos:
        if (nd.binary_dilation(full, iterations=2) & estrellas).any():
            continue                                  # brillo de una estrella: ya va con ella
        zona = nd.binary_dilation(full, iterations=2) & ~estrellas
        ys, xs = np.where(full); k = np.argmax(dE[ys, xs]); pico = dE[ys[k], xs[k]]
        a = np.clip((dE - 6) / max(pico - 6, 1), 0, 1) * zona
        nuevo = a > alfa
        alfa[nuevo] = a[nuevo]; col[nuevo] = rgb[ys[k], xs[k]]
        usados += 1
    im = np.dstack([col, alfa * 255]).round().clip(0, 255).astype(np.uint8)
    tonos = []
    for i in range(1, ns + 1):
        s = se == i; L, A, B = (c[s][:, j].mean() for j in range(3))
        tonos.append(dict(px=int(s.sum()), tono=round(float(np.degrees(np.arctan2(B, A))), 1),
                          croma=round(float(np.hypot(A, B)), 1), L=round(float(L), 1)))
    return im, dict(estrellas=ns, puntos_de_brillo=usados, pecas_descartadas=pecas, tonos_estrellas=tonos,
                    dE_minimo_frente_a_piel=round(float(dE[alfa > 0.5].min()), 1))


def reescalar(im, s):
    """Reescalado con alfa premultiplicada (sin halos)."""
    a = im[..., 3:].astype(float) / 255; pre = np.dstack([im[..., :3] * a, a * 255])
    h, w = im.shape[:2]; W, H = max(1, round(w * s)), max(1, round(h * s))
    canales = [np.array(Image.fromarray(pre[..., i].astype(np.float32), 'F').resize((W, H), Image.LANCZOS)) for i in range(4)]
    A = np.clip(canales[3], 0, 255); rgb = np.stack(canales[:3], -1) / np.maximum(A[..., None] / 255, 1e-6)
    out = np.dstack([np.clip(rgb, 0, 255), A]).round().astype(np.uint8); out[A < 1] = 0
    return out


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def zonas_de_la_cara():
    """Zonas que deben quedar libres y piel de la cara (en nuestra muñeca)."""
    base = np.array(Image.open(SIN_OJOS).convert('RGBA')).astype(float)
    ojos = np.zeros(base.shape[:2], bool)
    for p in [ABIERTOS, CERRADOS] + COLORES:
        ojos |= np.array(Image.open(p).convert('RGBA'))[..., 3] > 0
    lab = MK.lab_de(Image.fromarray(base.astype(np.uint8))).astype(float)
    piel_med = np.stack([nd.median_filter(lab[..., i], size=31) for i in range(3)], -1)
    d = lab - piel_med; dE = np.sqrt((d ** 2).sum(-1))
    YY, XX = np.mgrid[0:base.shape[0], 0:base.shape[1]]
    cara = (YY > 380) & (YY < 620) & (XX > 260) & (XX < 700)
    # pestañas (también las de abajo, que están en la base): trazos oscuros alrededor de los ojos
    cerca_ojos = nd.binary_dilation(ojos, iterations=14)
    pestanas = cerca_ojos & (lab[..., 0] < 150) & (base[..., 3] > 0)
    # boca: labios (rojizos, más saturados que la piel) en el eje de la cara, debajo de la nariz
    C = np.hypot(lab[..., 1], lab[..., 2]); a_ = lab[..., 1]
    boca = cara & (YY > 495) & (YY < 575) & (np.abs(XX - 479) < 75) & (a_ > piel_med[..., 1] + 6) & (C > 28)
    et, n = nd.label(boca)
    if n:
        s = nd.sum(boca, et, range(1, n + 1)); boca = et == (np.argmax(s) + 1)
        boca = nd.binary_fill_holes(nd.binary_dilation(boca, iterations=3))
    # pecas: puntitos más oscuros que la piel, pequeños
    osc = cara & (d[..., 0] < -5) & (dE > 6) & ~nd.binary_dilation(ojos | pestanas, iterations=2) & ~boca
    et, n = nd.label(osc); s = nd.sum(osc, et, range(1, n + 1)); pecas = np.isin(et, 1 + np.where((s >= 2) & (s <= 40))[0])
    # piel visible de la cara: piel de la base, sin el pelo de delante, lejos de su borde
    pelo = np.array(Image.open(PELO_DELANTE).convert('RGBA'))[..., 3] > 0
    tono = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    piel = cara & (base[..., 3] > 250) & (tono > 25) & (tono < 75) & (lab[..., 0] > 150) & ~pelo
    piel = nd.binary_opening(piel, iterations=2)
    et, n = nd.label(piel); s = nd.sum(piel, et, range(1, n + 1)); piel = et == (np.argmax(s) + 1)
    piel = nd.binary_fill_holes(piel) & ~ojos
    return dict(ojos=ojos, pestanas=pestanas, boca=boca, pecas=pecas, piel=piel)


if __name__ == '__main__':
    fuentes = [REF, SIN_OJOS, ABIERTOS, CERRADOS, PELO_DELANTE, MONTAJE] + COLORES
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    ref = Image.open(REF).convert('RGBA'); lab = MK.lab_de(ref).astype(float)
    W, H = 948, 1659; capa = np.zeros((H, W, 4), np.uint8); info = {}
    for nombre, m in MEJILLAS.items():
        im, i = adornos(lab, m['caja'])
        x0, y0 = m['caja'][:2]; ex, ey = m['ojo_ref']; ox, oy = m['ojo']; dx, dy = ENCAJE[nombre]
        pequena = reescalar(im, ESCALA)
        px, py = round(ox + (x0 - ex) * ESCALA + dx), round(oy + (y0 - ey) * ESCALA + dy)
        h, w = pequena.shape[:2]
        zona = capa[py:py + h, px:px + w]; nueva = pequena[..., 3] > zona[..., 3]; zona[nueva] = pequena[nueva]
        info[nombre] = dict(**i, posicion=[px, py], tamano=[w, h])
    # puntos de brillo que caen encima de una peca: se mueven hasta 3 px a un sitio libre (las pecas se ven siempre);
    # si no hay sitio, ese punto no se pone. Las estrellas no se mueven.
    z = zonas_de_la_cara(); pecas = nd.binary_dilation(z['pecas'], iterations=1); libre_de = pecas | nd.binary_dilation(z['ojos'], iterations=3)
    et, n = nd.label(capa[..., 3] > 0); movidos = quitados = 0; estrellas_sobre_pecas = 0
    for i, sl in enumerate(nd.find_objects(et), 1):
        m = et == i
        if not (m & pecas).any():
            continue
        if m.sum() > 40:
            estrellas_sobre_pecas += int((m & pecas).sum()); continue
        pieza = capa * m[..., None]; capa[m] = 0; ocupado = (capa[..., 3] > 0) | libre_de
        opciones = sorted(((abs(dx) + abs(dy), dx, dy) for dx in range(-3, 4) for dy in range(-3, 4)))
        for _, dx, dy in opciones:
            mm = np.roll(m, (dy, dx), (0, 1))
            if not (mm & ocupado).any() and not (nd.binary_dilation(mm) & (capa[..., 3] > 0)).any():
                capa[mm] = np.roll(pieza, (dy, dx), (0, 1))[mm]; movidos += 1; break
        else:
            quitados += 1
    info['puntos_movidos_por_las_pecas'] = movidos; info['puntos_quitados_por_las_pecas'] = quitados
    Image.fromarray(capa, 'RGBA').save(SALIDA, optimize=True)
    hay = capa[..., 3] > 0
    libre = lambda k, r=0: int((hay & (nd.binary_dilation(z[k], iterations=r) if r else z[k])).sum())
    comp = dict(
        metodo='solo píxeles de los adornos de la referencia (estrellas y puntos de brillo más claros que la piel); '
               'pecas, piel, ojos y pestañas de la referencia no se toman; reescalado con alfa premultiplicada',
        escala=ESCALA, encaje_px=ENCAJE, mejillas=info,
        px_con_adorno=int(hay.sum()),
        solape_ojos_todas_las_variantes_px=libre('ojos', 3), solape_pestanas_px=libre('pestanas', 2),
        solape_boca_px=libre('boca', 6), solape_pecas_px=libre('pecas'), estrellas_junto_a_pecas_px=estrellas_sobre_pecas,
        pecas_detectadas=int(nd.label(z['pecas'])[1]), pecas_tocadas=len(set(nd.label(z['pecas'])[0][hay & z['pecas']])), pecas_detectadas_en_nuestra_cara_px=int(z['pecas'].sum()),
        fuera_de_la_piel_de_la_cara_px=int((hay & ~nd.binary_erosion(z['piel'], iterations=3)).sum()),
        sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # vistas: montaje del conjunto con y sin pintacaras (cara ×2), y zonas comprobadas
    mont = Image.open(MONTAJE).convert('RGBA'); con = mont.copy(); con.alpha_composite(Image.fromarray(capa, 'RGBA'))
    caja = (290, 390, 670, 590); filas = []
    for t, im in (('Sin pintacaras', mont), ('Estrellas y brillo (encaje en revisión)', con)):
        bg = Image.new('RGBA', im.size, (255, 250, 245, 255)); bg.alpha_composite(im)
        filas.append((t, bg.convert('RGB').crop(caja).resize(((caja[2] - caja[0]) * 2, (caja[3] - caja[1]) * 2), Image.LANCZOS)))
    w, h = filas[0][1].size; out = Image.new('RGB', (w, 2 * (h + 30)), 'white'); dr = ImageDraw.Draw(out)
    for i, (t, im) in enumerate(filas):
        out.paste(im, (0, i * (h + 30) + 26)); dr.text((6, i * (h + 30) + 4), t + ' · ×2', font=MK.F(18), fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-pintacaras.png', optimize=True)
    bg = Image.new('RGBA', con.size, (255, 250, 245, 255)); bg.alpha_composite(con); v = np.array(bg.convert('RGB')).astype(float)
    for k, colr in (('piel', (120, 200, 120)), ('pecas', (40, 90, 230)), ('boca', (230, 60, 60)), ('pestanas', (250, 160, 0)), ('ojos', (160, 60, 200))):
        mk = nd.binary_dilation(z[k], iterations=1) ^ z[k] if k == 'piel' else z[k]
        v[mk] = v[mk] * 0.4 + np.array(colr) * 0.6
    Image.fromarray(v.astype(np.uint8)).crop(caja).resize(((caja[2] - caja[0]) * 2, (caja[3] - caja[1]) * 2), Image.NEAREST).save(AQUI / 'zonas-comprobadas.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
