#!/usr/bin/env python3
"""
Láminas candidatas (21/10/2026): heladería, gatito, hada, unicornio, perrito, conejito, princesa, helado, mariposa, osito explorador, hada jardinera y sirena. Convierte las imágenes de la propietaria (originales/, sin
modificar) en láminas del juego y las comprueba.

  · <id>.png: solo el contorno, color de tinta del juego (#2b2233) y fondo transparente; misma proporción y tamaño
    (1024 × 1536, sin recortar ni deformar). La opacidad sale del gris del original (bordes suaves conservados).
  · comprobaciones.json y revision-zonas.png: zonas de relleno simuladas como en el juego (contorno = opacidad > 110)
    a los tamaños de papel del iPhone y del iPad, en vertical y en horizontal:
      - fugas: ¿alguna zona grande del original se une con otra al reducir la lámina? (el relleno atravesaría el contorno)
      - zonas diminutas (menos de 14 × 14 px de pantalla): en el juego se pintan con su zona grande o en grupo
        (ver el LEEME, apartado de láminas).

Uso (desde la raíz): python3 docs/propuestas/pintar-2026-10-21/laminas/preparar_laminas.py
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent
LAMINAS = {'heladeria': 'Heladería', 'gatito': 'Gatito', 'hada': 'Hada', 'unicornio': 'Unicornio', 'perrito': 'Perrito', 'conejito': 'Conejito', 'princesa': 'Princesa', 'helado': 'Helado', 'mariposa': 'Mariposa', 'explorador': 'Osito explorador', 'hada-jardin': 'Hada jardinera', 'sirena': 'Sirena'}
TINTA = (0x2b, 0x22, 0x33)
# papel en el juego (píxeles de pantalla CSS) y DPR=2, medidos en la copia: iPhone vertical / horizontal, iPad
PANTALLAS = {'iPhone vertical': 518, 'iPhone horizontal': 352, 'iPad vertical': 942, 'iPad horizontal': 640}
DPR = 2
GRANDE = 0.003          # zona «grande» del original: ≥ 0,3 % del papel


def opacidad(L):
    return (np.clip((235.0 - L) / 135.0, 0, 1) * 255).round().astype(np.uint8)


def reforzar_finas(alfa):
    """Las líneas muy finas (1–2 px) se aclaran al reducir la lámina y el cubo las atravesaría: solo esas se
    engrosan 1 px; los tramos desvanecidos (uniones en gris) se
    vuelven tinta llena. Las demás líneas quedan idénticas."""
    b = alfa > 110
    gruesa = nd.binary_opening(b, structure=np.ones((3, 3), bool))
    fina = b & ~gruesa
    zona = nd.binary_dilation(fina, structure=np.ones((3, 3), bool))
    ref = nd.maximum_filter(alfa, size=3)
    out = alfa.copy(); out[zona] = np.maximum(alfa[zona], ref[zona])
    # tramos desvanecidos (gris claro sin tinta fuerte alrededor, típicos en las uniones): tinta llena y 1 px más
    desv = (alfa > 60) & (nd.maximum_filter(alfa, size=3) < 230)
    out[desv] = 255
    alrededor = nd.binary_dilation(desv, structure=np.ones((3, 3), bool)) & ~desv
    out[alrededor] = np.maximum(out[alrededor], 200)
    return out


def zonas(alfa):
    libre = alfa <= 110
    lab, n = nd.label(libre)
    tam = np.bincount(lab.ravel(), minlength=n + 1); tam[0] = 0
    return lab, n, tam


def analizar(nombre, alfa):
    H0, W0 = alfa.shape
    lab0, n0, tam0 = zonas(alfa)
    grandes0 = [i for i in range(1, n0 + 1) if tam0[i] >= GRANDE * W0 * H0]
    res = {'zonas_original': int(n0), 'zonas_grandes': len(grandes0), 'pantallas': {}}
    for pant, alto_css in PANTALLAS.items():
        H = alto_css * DPR; W = round(H * W0 / H0)
        a = np.array(Image.fromarray(alfa).resize((W, H), Image.BILINEAR))
        lab, n, tam = zonas(a)
        # fugas: zonas del tamaño de pantalla que contienen ≥ 2 zonas grandes del original (cada una con ≥ 20 % de sí)
        l0 = np.array(Image.fromarray(lab0.astype(np.int32)).resize((W, H), Image.NEAREST))
        fugas = []
        for g in range(1, n + 1):
            if tam[g] < GRANDE * W * H:
                continue
            m = lab == g
            ids, cnt = np.unique(l0[m], return_counts=True)
            sel = [int(i) for i, c in zip(ids, cnt) if i in grandes0 and c >= .2 * tam0[i] * (W * H) / (W0 * H0)]
            if len(sel) > 1:
                fugas.append(sel)
        tiny = int(((tam > 0) & (tam < 196 * DPR * DPR)).sum())
        res['pantallas'][pant] = {'papel_css': [round(W / DPR), alto_css], 'zonas': int(n), 'diminutas_menos_14px': tiny,
                                  'fugas': fugas}
    return res, lab0, tam0


def main():
    fuente = None
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',):
        try: fuente = ImageFont.truetype(f, 34)
        except OSError: pass
    informe, mapas = {}, []
    rng = np.random.default_rng(7)
    for ident, titulo in LAMINAS.items():
        im = Image.open(AQUI / 'originales' / f'{ident}.png').convert('L')
        L = np.array(im).astype(float)
        alfa = opacidad(L); alfa[alfa < 12] = 0
        alfa = reforzar_finas(alfa)
        # marco fino de tinta (4 px): cierra las líneas que se desvanecen al llegar al borde de la imagen
        alfa[:4, :] = 255; alfa[-4:, :] = 255; alfa[:, :4] = 255; alfa[:, -4:] = 255
        rgba = np.zeros(alfa.shape + (4,), np.uint8); rgba[..., :3] = TINTA; rgba[..., 3] = alfa
        Image.fromarray(rgba, 'RGBA').save(AQUI / f'{ident}.png', optimize=True)
        res, lab0, tam0 = analizar(ident, alfa)
        res['tamano'] = list(im.size); informe[ident] = res
        # mapa: cada zona de un color; diminutas (a tamaño de iPhone vertical) en rojo
        esc = (PANTALLAS['iPhone vertical'] * DPR / im.size[1]) ** 2
        pal = rng.integers(140, 245, (lab0.max() + 1, 3)).astype(np.uint8)
        pal[(tam0 * esc < 196 * DPR * DPR) & (tam0 > 0)] = (235, 40, 60)
        m = pal[lab0]; m[alfa > 110] = TINTA
        mi = Image.fromarray(m).resize((512, 768), Image.NEAREST)
        d = ImageDraw.Draw(mi); d.rectangle((0, 0, 512, 48), fill=(255, 246, 251)); d.text((10, 6), titulo, fill=TINTA, font=fuente)
        mapas.append(mi)
    hoja = Image.new('RGB', (len(mapas) * 532 + 20, 788), (255, 246, 251))
    for i, m in enumerate(mapas):
        hoja.paste(m, (20 + i * 532, 10))
    hoja.save(AQUI / 'revision-zonas.png', optimize=True)
    (AQUI / 'comprobaciones.json').write_text(json.dumps(informe, ensure_ascii=False, indent=1), encoding='utf-8')
    for k, v in informe.items():
        print(k, v['zonas_grandes'], 'grandes ·', {p: (x['diminutas_menos_14px'], len(x['fugas'])) for p, x in v['pantallas'].items()})


if __name__ == '__main__':
    main()
