#!/usr/bin/env python3
"""
Montaje v3 de los ojos de la base D-014 (PROPUESTA): base sin ojos, dos variantes de capa y comparación.

  1. Máscara v3 (../ojos-abiertos/mascara_v3.py).
  2. Base sin ojos v3: copia de la base con la zona de los ojos (la de relleno.py, que se lleva también los
     restos de pestañas, más 2 px alrededor de la v3) rellenada de piel. Fuera de la zona, nada cambia.
  3. Capa v3 SIN CORREGIR: colores originales + opacidad = máscara v3.
  4. Capa v3 CON COLOR EXPERIMENTAL: igual, salvo en los bordes mezclados con piel (píxeles de la zona que
     no son opacos ni de la abertura del ojo). Allí se ESTIMA el color propio de la pestaña y su opacidad:
       · color propio de referencia F0 = el del trazo opaco oscuro más cercano (pestaña o párpado);
       · piel de debajo B = la base sin ojos;
       · opacidad a = proyección del color observado C sobre la recta B→F0 (descartada si < 0,03);
       · color F = (C − (1 − a)·B) / a, recortado a 0–255.
     Es una ESTIMACIÓN: el color real de la pestaña bajo la piel mezclada no se puede recuperar con certeza.
     Iris, blancos, brillos y todos los píxeles opacos quedan idénticos (comprobado).
  5. Montajes sobre la base sin ojos, comparados con el original; restos que quedan en la base.

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/sin-ojos/montaje_v3.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; PROP = AQUI.parent; OJOS = PROP / 'ojos-abiertos'
sys.path.insert(0, str(OJOS)); sys.path.insert(0, str(AQUI))
import mascara as MK          # noqa: E402
import mascara_v3 as M3       # noqa: E402
import relleno as RL          # noqa: E402

OSCURO = (45, 40, 70)


def color_experimental(A, m3, AB, Z3, sin, lab):
    C = A[..., :3].astype(float); B = sin[..., :3].astype(float); a = m3.astype(float) / 255
    borde = Z3 & (m3 < 255) & ~AB
    nucleo = (m3 == 255) & ~AB & (lab[..., 0] < 90)
    _, (iy, ix) = nd.distance_transform_edt(~nucleo, return_indices=True)
    F0 = C[iy, ix]; v = F0 - B
    a2 = np.clip(((C - B) * v).sum(-1) / np.maximum((v * v).sum(-1), 1), 0, 1)
    a2 = np.where(borde, np.where(a2 < 0.03, 0, a2), a); borde &= a2 > 0
    Fe = (C - (1 - a2[..., None]) * B) / np.maximum(a2[..., None], 1e-6)
    recorte = borde & ((Fe < -0.5) | (Fe > 255.5)).any(-1)
    capa = A.copy(); capa[..., 3] = (a2 * 255).round().astype(np.uint8); capa[capa[..., 3] == 0] = 0
    capa[borde, :3] = np.round(np.clip(Fe[borde], 0, 255)).astype(np.uint8)
    return capa, borde, recorte


def sobre(capa, color):
    i = Image.fromarray(capa, 'RGBA'); bg = Image.new('RGBA', i.size, color + (255,)); bg.alpha_composite(i); return bg.convert('RGB')


def mapa_dif(r, A):
    d = np.abs(r[..., :3].astype(int) - A[..., :3].astype(int)).max(-1)
    m = np.full(A.shape[:2] + (3,), 255, np.uint8); m[d > 0] = (255, 200, 120); m[d > 8] = (255, 120, 0); m[d > 24] = (200, 0, 60)
    return Image.fromarray(m), dict(pixeles_distintos=int((d > 0).sum()), mas_de_8=int((d > 8).sum()), mas_de_24=int((d > 24).sum()), maximo=int(d.max()))


def hoja(filas_img, titulos, box, z, cols, salida):
    tr = [p.crop(box).resize(((box[2] - box[0]) * z, (box[3] - box[1]) * z), Image.NEAREST) for p in filas_img]
    w, h = tr[0].size; filas = (len(tr) + cols - 1) // cols
    out = Image.new('RGB', (cols * (w + 10), filas * (h + 34)), 'white'); d = ImageDraw.Draw(out)
    for i, (t, p) in enumerate(zip(titulos, tr)):
        x, y = (i % cols) * (w + 10), (i // cols) * (h + 34)
        d.text((x + 4, y + 6), t, font=MK.F(20), fill=(40, 40, 60)); out.paste(p, (x, y + 30))
    out.save(salida, optimize=True)


if __name__ == '__main__':
    im = Image.open(PROP / 'base-transparencia-corregida.png').convert('RGBA'); A = np.array(im)
    m3, m2, AB, PL, rosado, extra = M3.mascara_v3(im)
    assert (m3 == np.array(Image.open(OJOS / 'mascara-ojos-propuesta-v3.png'))).all(), 'la v3 no coincide'
    Z, lab, pieles = RL.zona_relleno(im, m2, AB, PL)
    Z3 = Z | nd.binary_dilation(m3 > 0, iterations=2)
    sin = RL.rellenar(A, Z3, lab, pieles)
    capa = A.copy(); capa[..., 3] = m3; capa[m3 == 0] = 0
    capac, borde, recorte = color_experimental(A, m3, AB, Z3, sin, lab)
    recA, recC = RL.componer(capa, sin), RL.componer(capac, sin)
    # restos en la base sin ojos: alrededor del pliegue (fuera de la zona), trazos oscuros que no van paralelos
    L = lab[..., 0]; YY, XX = np.mgrid[0:A.shape[0], 0:A.shape[1]]
    gy, gx = np.gradient(nd.gaussian_filter(L, 1.0)); Jxx, Jyy, Jxy = (nd.gaussian_filter(v, 1.5) for v in (gx * gx, gy * gy, gx * gy))
    raices = np.zeros(A.shape[:2], bool); pliegue_base = np.zeros(A.shape[:2], bool)
    for (cx, cy), piel in zip(MK.OJOS, pieles):
        cx, cy = int(cx), int(cy); dL = piel[0] - L
        paralelo = np.abs(np.cos(0.5 * np.arctan2(2 * Jxy, Jxx - Jyy) - np.arctan2(YY - cy, (XX - cx) * 0.6))) > 0.85
        cerca = nd.binary_dilation(PL, iterations=3) & ~Z3 & (np.abs(XX - cx) < 115) & (np.abs(YY - cy) < 70)
        raices |= cerca & (dL > 45) & ~paralelo; pliegue_base |= cerca & (dL > 20) & paralelo
    # guardar
    Image.fromarray(sin, 'RGBA').save(AQUI / 'base-sin-ojos-propuesta-v3.png', optimize=True)
    Image.fromarray((Z3 * 255).astype(np.uint8), 'L').save(AQUI / 'zona-relleno-v3.png', optimize=True)
    Image.fromarray(capa, 'RGBA').save(OJOS / 'capa-ojos-abiertos-prueba-v3.png', optimize=True)
    Image.fromarray(capac, 'RGBA').save(OJOS / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png', optimize=True)
    marca = np.zeros(A.shape[:2], np.uint8); marca[borde] = 255; marca[recorte] = 128
    Image.fromarray(marca, 'L').save(OJOS / 'pixeles-color-estimado-v3.png', optimize=True)
    # vistas
    blanco = lambda x: sobre(x, (255, 255, 255))
    mA, eA = mapa_dif(recA, A); mC, eC = mapa_dif(recC, A)
    marcas = np.array(blanco(A)).copy(); marcas[borde] = (0, 170, 255); marcas[recorte] = (255, 0, 160)
    box = (290, 370, 670, 500)
    hoja([blanco(A), blanco(sin), blanco(recA), blanco(recC), sobre(capa, OSCURO), sobre(capac, OSCURO), mA, mC, Image.fromarray(marcas)],
         ['Original', 'Base sin ojos v3', 'Montaje v3 sin corregir', 'Montaje v3 color experimental', 'Capa v3 sin corregir · oscuro',
          'Capa v3 color experimental · oscuro', 'Diferencias sin corregir (naranja >8, rojo >24)', 'Diferencias color experimental',
          'Píxeles con color estimado (azul; rosa = recortado)'], box, 3, 2, AQUI / 'vista-v3-ampliada.png')
    caja = (150, 160, 810, 1550); paneles = [('Original', blanco(A)), ('Sin ojos', blanco(sin)), ('v3 sin corregir', blanco(recA)), ('v3 color exp.', blanco(recC))]
    bloques = []
    for alto in (480, 220):
        ps = [p.crop(caja) for _, p in paneles]; ps = [p.resize((round(p.width * alto / p.height), alto), Image.LANCZOS) for p in ps]
        blo = Image.new('RGB', (max(sum(p.width + 12 for p in ps), 560), alto + 56), 'white'); d = ImageDraw.Draw(blo); x = 0
        d.text((2, 2), f'Muñeca de {alto} px de alto (aprox. {"«Vestir» en iPhone" if alto > 300 else "«Mi Mundo»"})', font=MK.F(16), fill=(40, 40, 60))
        for (t, _), p in zip(paneles, ps):
            blo.paste(p, (x, 52)); d.text((x + 2, 28), t, font=MK.F(13 if alto < 300 else 15), fill=(90, 80, 110)); x += p.width + 12
        bloques.append(blo)
    cara = [p.crop((300, 340, 660, 640)) for _, p in paneles]; cara = [c.resize((c.width * 2 // 3, c.height * 2 // 3), Image.LANCZOS) for c in cara]
    blo = Image.new('RGB', (sum(c.width + 12 for c in cara), cara[0].height + 56), 'white'); d = ImageDraw.Draw(blo); x = 0
    d.text((2, 2), 'Cara a tamaño de «Vestir» en iPad (aprox.)', font=MK.F(16), fill=(40, 40, 60))
    for (t, _), c in zip(paneles, cara):
        blo.paste(c, (x, 52)); d.text((x + 2, 28), t, font=MK.F(15), fill=(90, 80, 110)); x += c.width + 12
    bloques.append(blo)
    out = Image.new('RGB', (max(b.width for b in bloques), sum(b.height + 10 for b in bloques)), 'white'); y = 0
    for b in bloques:
        out.paste(b, (0, y)); y += b.height + 10
    out.save(AQUI / 'vista-v3-tamano-juego.png', optimize=True)
    zona = np.array(blanco(sin)).copy(); bz = Z3 ^ nd.binary_erosion(Z3); zona[bz] = (0, 160, 255)
    rest = np.array(blanco(sin)).copy(); rest[pliegue_base] = (255, 200, 0); rest[raices] = (230, 0, 90)
    hoja([blanco(sin), Image.fromarray(zona), Image.fromarray(rest)],
         ['Base sin ojos v3 (relleno por separado)', 'Zona rellenada (contorno azul)', 'Lo que queda: pliegue (amarillo) y raíces de pestaña (rojo)'],
         box, 3, 1, AQUI / 'vista-v3-relleno-y-restos.png')
    hoja([blanco(A), blanco(sin), Image.fromarray(rest)], ['Original · ojo izq. (arriba)', 'Sin ojos v3', 'Restos marcados'],
         (330, 380, 450, 420), 6, 1, AQUI / 'vista-v3-raices-izq.png')
    hoja([blanco(A), blanco(sin), Image.fromarray(rest)], ['Original · ojo der. (arriba)', 'Sin ojos v3', 'Restos marcados'],
         (510, 380, 630, 420), 6, 1, AQUI / 'vista-v3-raices-der.png')
    cambiado = (sin != A).any(-1); a_dentro = m3 == 255
    comp = dict(
        mascara_v3=dict(pixeles=int((m3 > 0).sum()), opacos=int((m3 == 255).sum()), añadidos_sobre_v2=int(((m2 == 0) & (m3 > 0)).sum()),
                        borde_rosado_y_lagrimal=int((rosado & (m2 < 255)).sum()), pestañas_recuperadas=int(extra.sum())),
        base_sin_ojos_v3=dict(zona_px=int(Z3.sum()), cambiados=int(cambiado.sum()), cambiados_fuera_de_la_zona=int((cambiado & ~Z3).sum()),
                              raices_de_pestaña_que_quedan_px=int(raices.sum()), pliegue_conservado_px=int(pliegue_base.sum()),
                              sha256=hashlib.sha256((AQUI / 'base-sin-ojos-propuesta-v3.png').read_bytes()).hexdigest()),
        capa_color_experimental=dict(pixeles_con_color_estimado=int(borde.sum()), de_ellos_recortados=int(recorte.sum()),
                                     opacos_identicos=bool((capac[a_dentro] == A[a_dentro]).all()), abertura_identica=bool((capac[AB] == A[AB]).all())),
        montaje_v3_sin_corregir=eA, montaje_v3_color_experimental=eC)
    (AQUI / 'comprobaciones-v3.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
