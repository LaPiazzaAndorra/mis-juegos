#!/usr/bin/env python3
"""
Variante de PRUEBA de ojos cerrados: reutiliza la ilustración aprobada de la V2.1
(arte/originales/ojos-cerrados-clara.png, que NO se modifica) sobre el párpado de cobertura de la base D-014.

  · Párpado: el mismo de la prueba anterior (cerrados.py): piel interpolada desde la piel original que tapa
    el parche, el pliegue y las raíces; aquí SIN la línea de pestañas en espejo.
  · Cada ojo cerrado de la V2.1 se separa (mitad izquierda / derecha del lienzo) y se coloca con una
    transformación de semejanza: misma escala en horizontal y vertical (sin estirar), sin giro ni deformación.
      escala = ancho de la abertura del ojo nuevo / ancho de la abertura del ojo abierto V2.1 (ojos-marron.png)
      posición: el centro de la abertura V2.1 cae en el centro de la abertura nueva
    Así la línea cerrada guarda con el ojo nuevo la misma relación que tenía con el ojo V2.1 aprobado.
  · Reducción con alfa premultiplicado (sin halos). Solo se reduce (escala < 1): no se inventa detalle.

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-cerrados/cerrados_v21.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; PROP = AQUI.parent; RAIZ = PROP.parents[2]
sys.path[:0] = [str(AQUI), str(PROP / 'ojos-abiertos'), str(PROP / 'sin-ojos')]
import mascara as MK          # noqa: E402
import mascara_v3 as M3       # noqa: E402
import cerrados as C1         # noqa: E402  (párpado, composición y vistas de la prueba anterior)

V21_CERRADOS = RAIZ / 'arte' / 'originales' / 'ojos-cerrados-clara.png'
V21_ABIERTOS = RAIZ / 'arte' / 'originales' / 'ojos-marron.png'


def cajas_abertura_v21():
    a = np.array(Image.open(V21_ABIERTOS).convert('RGBA')).astype(float); L = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    m = nd.binary_opening((a[..., 3] > 200) & (L > 60), np.ones((3, 3))); lb, n = nd.label(m); sz = nd.sum(m, lb, range(1, n + 1))
    cajas = []
    for i in np.argsort(sz)[-2:]:
        ys, xs = np.nonzero(lb == i + 1); cajas.append((xs.min(), xs.max(), ys.min(), ys.max()))
    return sorted(cajas)                                   # [izquierdo, derecho]


def cajas_abertura_nueva(AB):
    lb, n = nd.label(AB); cajas = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lb == i); cajas.append((xs.min(), xs.max(), ys.min(), ys.max()))
    return sorted(cajas)


def colocar(dest, fuente, x0f, y0f, escala, xc_f, yc_f, xc_n, yc_n):
    """Pega `fuente` (recorte RGBA cuyo origen es (x0f, y0f) en el lienzo V2.1) escalado de forma uniforme,
    de modo que el punto (xc_f, yc_f) de la V2.1 caiga en (xc_n, yc_n) del lienzo nuevo."""
    f = fuente.astype(float); a = f[..., 3:] / 255; pre = np.concatenate([f[..., :3] * a, f[..., 3:]], -1)
    w, h = round(pre.shape[1] * escala), round(pre.shape[0] * escala)
    canales = [np.array(Image.fromarray(pre[..., c].astype(np.float32), 'F').resize((w, h), Image.LANCZOS)) for c in range(4)]
    pre = np.clip(np.stack(canales, -1), 0, 255); al = pre[..., 3:] / 255
    rgb = np.where(al > 0, pre[..., :3] / np.maximum(al, 1e-6), 0)
    ox = round(xc_n + (x0f - xc_f) * escala); oy = round(yc_n + (y0f - yc_f) * escala)
    reg = dest[oy:oy + h, ox:ox + w].astype(float); ad = reg[..., 3:] / 255
    out_a = al + ad * (1 - al)
    reg[..., :3] = np.where(out_a > 0, (rgb * al + reg[..., :3] * ad * (1 - al)) / np.maximum(out_a, 1e-6), 0)
    reg[..., 3:] = out_a * 255
    dest[oy:oy + h, ox:ox + w] = np.round(np.clip(reg, 0, 255)).astype(np.uint8)
    return dict(escala=round(escala, 4), origen=[ox, oy], tamaño=[w, h])


if __name__ == '__main__':
    im = Image.open(PROP / 'base-transparencia-corregida.png').convert('RGBA'); A = np.array(im)
    sha_v21 = hashlib.sha256(V21_CERRADOS.read_bytes()).hexdigest()
    m3, m2, AB, PL, _, _ = M3.mascara_v3(im); lab = MK.lab_de(im)
    sin = np.array(Image.open(PROP / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png'))
    Z3 = np.array(Image.open(PROP / 'sin-ojos' / 'zona-relleno-v3.png')) > 0
    abierta = np.array(Image.open(PROP / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png'))
    parpado, tapar, _ = C1.capa_cerrada(A, AB, PL, Z3, np.zeros_like(abierta), lab)    # solo el párpado
    capa = parpado.copy()
    V = np.array(Image.open(V21_CERRADOS).convert('RGBA'))
    viejas, nuevas = cajas_abertura_v21(), cajas_abertura_nueva(AB)
    colocados = []
    for lado, (cv, cn) in enumerate(zip(viejas, nuevas)):
        mitad = np.zeros(V.shape[:2], bool)
        if lado == 0:
            mitad[:, :1000] = True
        else:
            mitad[:, 1000:] = True
        ys, xs = np.nonzero((V[..., 3] > 0) & mitad); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        recorte = V[y0:y1, x0:x1].copy(); recorte[~mitad[y0:y1, x0:x1]] = 0
        escala = (cn[1] - cn[0] + 1) / (cv[1] - cv[0] + 1)
        colocados.append(colocar(capa, recorte, x0, y0, escala, (cv[0] + cv[1]) / 2, (cv[2] + cv[3]) / 2, (cn[0] + cn[1]) / 2, (cn[2] + cn[3]) / 2))
    capa[capa[..., 3] == 0] = 0
    Image.fromarray(capa, 'RGBA').save(AQUI / 'capa-ojos-cerrados-prueba-v21.png', optimize=True)
    abiertos, cerrados = C1.componer(sin, abierta), C1.componer(sin, capa)
    proto = C1.componer(sin, np.array(Image.open(AQUI / 'capa-ojos-cerrados-prueba.png')))
    Image.fromarray(cerrados, 'RGBA').save(AQUI / 'estado-cerrados-v21.png', optimize=True)
    # vistas: original · abiertos · cerrados V2.1 · cerrados prueba anterior
    blanco = C1.blanco; caja = (150, 160, 810, 1550); cara = (270, 330, 690, 560)
    est = [('Original', blanco(A)), ('Abiertos', blanco(abiertos)), ('Cerrados V2.1 reutilizados', blanco(cerrados)), ('Cerrados prueba anterior', blanco(proto))]
    filas = []
    for alto in (480, 220):
        ps = [p.crop(caja).resize((round(660 * alto / 1390), alto), Image.LANCZOS) for _, p in est]
        f = Image.new('RGB', (max(sum(p.width + 12 for p in ps), 560), alto + 56), 'white'); d = ImageDraw.Draw(f); x = 0
        d.text((2, 2), f'Muñeca de {alto} px de alto (aprox. {"«Vestir» en iPhone" if alto > 300 else "«Mi Mundo»"})', font=MK.F(16), fill=(40, 40, 60))
        for (t, _), p in zip(est, ps):
            corto = {'Cerrados V2.1 reutilizados': 'V2.1', 'Cerrados prueba anterior': 'Anterior'}.get(t, t) if alto < 300 else t
            f.paste(p, (x, 52)); d.text((x + 2, 28), corto, font=MK.F(13 if alto < 300 else 15), fill=(90, 80, 110)); x += p.width + 12
        filas.append(f)
    cs = [p.crop(cara).resize(((cara[2] - cara[0]) * 2, (cara[3] - cara[1]) * 2), Image.LANCZOS) for _, p in est]
    f = Image.new('RGB', (cs[0].width * 2 + 10, (cs[0].height + 34) * 2), 'white'); d = ImageDraw.Draw(f)
    for i, ((t, _), c) in enumerate(zip(est, cs)):
        x, y = (i % 2) * (c.width + 10), (i // 2) * (c.height + 34)
        d.text((x + 4, y + 6), t + ' · cara ×2', font=MK.F(20), fill=(40, 40, 60)); f.paste(c, (x, y + 30))
    filas.append(f)
    out = Image.new('RGB', (max(r.width for r in filas), sum(r.height + 10 for r in filas)), 'white'); y = 0
    for r in filas:
        out.paste(r, (0, y)); y += r.height + 10
    out.save(AQUI / 'vista-estados-v21.png', optimize=True)
    marca = np.array(blanco(cerrados)).copy(); bz = tapar ^ nd.binary_erosion(tapar); marca[bz] = (0, 160, 255)
    Image.fromarray(marca).crop(cara).resize(((cara[2] - cara[0]) * 2, (cara[3] - cara[1]) * 2), Image.NEAREST).save(AQUI / 'vista-cobertura-v21.png', optimize=True)
    for nombre, recorte, esc in (('parpadeo-v21-tamano-juego.gif', caja, 480 / 1390), ('parpadeo-v21-cara.gif', cara, 1.5)):
        ab = blanco(abiertos).crop(recorte); ce = blanco(cerrados).crop(recorte)
        tam = (round(ab.width * esc), round(ab.height * esc)); ab, ce = ab.resize(tam, Image.LANCZOS), ce.resize(tam, Image.LANCZOS)
        ab.save(AQUI / nombre, save_all=True, append_images=[ce, ab, ce, ab], duration=[1200, 200, 1000, 200, 600], loop=0, optimize=True)
    cub = capa[..., 3] == 255
    comp = dict(fuente='arte/originales/ojos-cerrados-clara.png', sha256_fuente=sha_v21,
                fuente_sin_cambios=hashlib.sha256(V21_CERRADOS.read_bytes()).hexdigest() == sha_v21,
                ojos_colocados=colocados, escala_uniforme=True,
                zona_que_deben_tapar_px=int(tapar.sum()), tapada_por_completo_px=int((tapar & cub).sum()),
                caja_de_cambios=list(Image.fromarray(((cerrados != A).any(-1)).astype(np.uint8) * 255).getbbox()))
    (AQUI / 'comprobaciones-v21.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
