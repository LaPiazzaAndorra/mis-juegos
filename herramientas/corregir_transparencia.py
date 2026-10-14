#!/usr/bin/env python3
"""
Mi Mundo de Juegos · Corrección técnica de la transparencia de una base (D-014)

Solo cambia el canal alfa; los colores (RGB), la resolución, la cara, las proporciones y la
postura no se tocan. No redibuja ni regenera nada.

  1. Silueta maciza: píxeles con alfa ≥ 200 (debe ser una sola pieza).
  2. Opacidad del cuerpo normalizada: alfa × 255 / máximo real del interior (percentil 99,5).
  3. Interior (a más de 2 px del contorno): alfa 255.
  4. Restos exteriores: fuera de la silueta, a más de 3 px o con alfa < 4 → alfa 0.
     El borde suave (antialias de 1–2 px) se conserva.

Uso:
  python3 herramientas/corregir_transparencia.py ORIGINAL.png SALIDA.png
      corrige y escribe las comprobaciones
  python3 herramientas/corregir_transparencia.py --comprobar ORIGINAL.png CORREGIDA.png
      vuelve a calcular la corrección y comprueba que CORREGIDA tiene exactamente esos píxeles
  python3 herramientas/corregir_transparencia.py --comparar ORIGINAL.png CORREGIDA.png PREFIJO
      hojas antes/después: fondos claro y oscuro, restos, bordes ×4 y transparencia interior

Requiere Python 3 con Pillow, NumPy y SciPy.
"""
import hashlib, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as nd


def corregir(im):
    a = im[..., 3].astype(float)
    silueta = a >= 200
    if nd.label(silueta)[1] != 1:
        sys.exit('La silueta maciza no es una sola pieza: revisar a mano antes de corregir.')
    fuera = nd.distance_transform_edt(~silueta)
    interior = nd.binary_erosion(silueta, iterations=2)
    tope = np.percentile(a[interior], 99.5)
    b = np.clip(a * 255.0 / tope, 0, 255)
    b[interior] = 255
    restos = (~silueta) & ((fuera > 3) | (a < 4))
    b[restos] = 0
    out = im.copy()
    out[..., 3] = np.round(b).astype(np.uint8)
    return out, dict(tope=tope, interior=interior, restos=restos, silueta=silueta, fuera=fuera)


def huella(im):
    return hashlib.sha256(np.ascontiguousarray(im).tobytes()).hexdigest()


def comprobaciones(im, out, info):
    a0, a1 = im[..., 3].astype(int), out[..., 3].astype(int)
    borde = (a0 > 0) & (a0 < 200) & (a1 > 0)
    print(f'tamaño {im.shape[1]} × {im.shape[0]} (sin cambiar)')
    print('colores RGB idénticos:', bool((out[..., :3] == im[..., :3]).all()))
    print(f'opacidad máxima real del interior: {info["tope"]:.0f}')
    print(f'interior con alfa 255: antes {int((a0[info["interior"]] == 255).sum())}, '
          f'después {int((a1[info["interior"]] == 255).sum())} de {int(info["interior"].sum())}')
    print(f'restos exteriores eliminados: {int((info["restos"] & (a0 > 0)).sum())} '
          f'(alfa máximo {int(a0[info["restos"]].max())})')
    print(f'borde suave conservado: {int(borde.sum())} píxeles, cambio de alfa máx. '
          f'{int(np.abs(a1 - a0)[borde].max())}, medio {np.abs(a1 - a0)[borde].mean():.2f}')
    for r in (1, 2, 3):
        m = (info['fuera'] > r - 1) & (info['fuera'] <= r)
        print(f'  alfa medio a {r} px fuera de la silueta: antes {a0[m].mean():.1f}, después {a1[m].mean():.1f}')
    print('caja del contenido: antes', Image.fromarray(im[..., 3]).getbbox(),
          'después', Image.fromarray(out[..., 3]).getbbox())
    print('huella de píxeles (SHA-256 de RGBA):', huella(out))


def comparar(A, B, pref):
    F = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', s)
    CLARO, OSCURO = (255, 246, 251), (45, 40, 70)

    def sobre(im, c):
        bg = Image.new('RGBA', im.size, c + (255,)); bg.alpha_composite(im); return bg.convert('RGB')

    def restos(im):
        a = np.array(im)[..., 3]; v = np.zeros(a.shape + (3,), np.uint8)
        v[a > 0] = (255, 0, 255); v[a >= 128] = (90, 90, 90); return Image.fromarray(v)

    def transp(im):
        a = np.array(im)[..., 3].astype(int); v = np.clip((255 - a) * 40, 0, 255).astype(np.uint8)
        v[a == 0] = 0; return Image.fromarray(v).convert('RGB')

    W, H = A.size; w, h = W // 2, H // 2
    cols = [('Antes · claro', sobre(A, CLARO)), ('Después · claro', sobre(B, CLARO)),
            ('Antes · oscuro', sobre(A, OSCURO)), ('Después · oscuro', sobre(B, OSCURO)),
            ('Antes · restos (magenta)', restos(A)), ('Después · restos (magenta)', restos(B))]
    g = Image.new('RGB', (w * 6 + 70, h + 70), (255, 255, 255)); d = ImageDraw.Draw(g)
    for i, (t, im) in enumerate(cols):
        g.paste(im.resize((w, h), Image.LANCZOS), (10 + i * (w + 10), 60)); d.text((10 + i * (w + 10), 18), t, font=F(20), fill=(40, 40, 60))
    g.save(pref + '-1-general.png')
    zonas = [('oreja izq.', (232, 400, 312, 500)), ('mano der.', (700, 960, 800, 1090)), ('axila izq.', (270, 780, 350, 880)),
             ('pie izq.', (330, 1440, 450, 1545)), ('entre piernas', (430, 1180, 520, 1290)), ('coronilla', (400, 165, 560, 225))]
    filas = [(t, [c.resize((c.width * 4, c.height * 4), Image.NEAREST) for c in
                  (sobre(A, CLARO).crop(z), sobre(B, CLARO).crop(z), sobre(A, OSCURO).crop(z), sobre(B, OSCURO).crop(z))]) for t, z in zonas]
    cw = max(c.width for _, cs in filas for c in cs); ch = max(c.height for _, cs in filas for c in cs)
    g = Image.new('RGB', (4 * (cw + 10) + 170, len(filas) * (ch + 10) + 60), (255, 255, 255)); d = ImageDraw.Draw(g)
    for j, t in enumerate(['Antes · claro', 'Después · claro', 'Antes · oscuro', 'Después · oscuro']):
        d.text((170 + j * (cw + 10), 18), t, font=F(22), fill=(40, 40, 60))
    for i, (t, cs) in enumerate(filas):
        y = 55 + i * (ch + 10); d.text((10, y + ch // 2 - 12), t, font=F(20), fill=(40, 40, 60))
        for j, c in enumerate(cs): g.paste(c, (170 + j * (cw + 10), y))
    g.save(pref + '-2-bordes-x4.png')
    g = Image.new('RGB', (2 * w + 30, h + 70), (255, 255, 255)); d = ImageDraw.Draw(g)
    for i, (t, im) in enumerate([('Antes: fondo a través del cuerpo (×40)', transp(A)), ('Después (×40)', transp(B))]):
        g.paste(im.resize((w, h), Image.NEAREST), (10 + i * (w + 10), 60)); d.text((10 + i * (w + 10), 18), t, font=F(19), fill=(40, 40, 60))
    g.save(pref + '-3-transparencia-interior.png')


if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) == 2:
        im = np.array(Image.open(args[0]).convert('RGBA'))
        out, info = corregir(im)
        Image.fromarray(out, 'RGBA').save(args[1], optimize=True)
        comprobaciones(im, out, info)
    elif len(args) == 3 and args[0] == '--comprobar':
        im = np.array(Image.open(args[1]).convert('RGBA'))
        esperado, _ = corregir(im)
        real = np.array(Image.open(args[2]).convert('RGBA'))
        iguales = real.shape == esperado.shape and (real == esperado).all()
        print('✅ La copia corregida coincide píxel a píxel con la corrección del original' if iguales
              else '❌ La copia corregida NO coincide con la corrección del original')
        print('huella de píxeles:', huella(real))
        sys.exit(0 if iguales else 1)
    elif len(args) == 4 and args[0] == '--comparar':
        comparar(Image.open(args[1]).convert('RGBA'), Image.open(args[2]).convert('RGBA'), args[3])
    else:
        sys.exit(__doc__)
