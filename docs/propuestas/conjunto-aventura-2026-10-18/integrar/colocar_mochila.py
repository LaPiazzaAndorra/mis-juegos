#!/usr/bin/env python3
"""
Cuerpo de la mochila (guía 2a, D-027, candidato): la imagen de ChatGPT (fondo transparente, sin tiras) colocada DETRÁS de
nuestra muñeca, en una capa independiente (integrar/mochila-b/). La imagen recibida se guarda sin cambios en
guia-chatgpt/2-mochila/de-chatgpt/; la base, la ropa ajustada de f857193 y la mochila y las tiras antiguas no cambian.

Solo se ajustan escala y posición (la misma escala en los dos ejes, sin giro ni deformación):
- escala: la de la imagen aprobada. Allí el bolsillo lateral (solapa arena + bolsillo verde) mide ≈ 130 px de alto
  (y ≈ 818–950) y el fondo de la mochila llega a y ≈ 1 000; en la imagen recibida, el bolsillo mide 322 px → 0,38
  (≈ 406 × 349 px en el lienzo);
- posición, dos candidatas, con el fondo en y ≈ 1 000 como en la imagen aprobada:
  A «centrada»: en el eje de nuestro torso (x ≈ 478); de frente casi toda queda tapada: asoma entre los brazos y el
  cuerpo y, sin pelo que la tape, una franja sobre los hombros;
  B «lateral»: como en la imagen aprobada (allí la niña está algo girada y la mochila asoma por su derecha, con el
  bolsillo junto al brazo): corrida hasta que su borde queda en x ≈ 198, como en la imagen.
Limpieza de la imagen recibida (en la copia): el interior venía con alfa 253 (casi opaco) → 255; y había ≈ 1 100 motas
casi invisibles (alfa 1–49) sueltas por el fondo → fuera; se conserva el canto suave pegado a la mochila.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/colocar_mochila.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent
ORIGINAL = CJ / 'guia-chatgpt' / '2-mochila' / 'de-chatgpt' / 'mochila-cuerpo-chatgpt.png'
SAL = AQUI / 'mochila-b'
sys.path.insert(0, str(CJ.parent / 'accesorios-2026-10-16' / 'capas')); import colocar as CL   # noqa: E402

ESCALA, FONDO_Y = 0.38, 1000
COLOCACIONES = {'centrada': 478,     # A: en el eje de nuestro torso (de frente, simétrica)
                'lateral': 400}      # B: como en la imagen aprobada, corrida hacia su derecha (su borde, en x ≈ 198)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    antes = sha(ORIGINAL)
    im = np.array(Image.open(ORIGINAL).convert('RGBA'))
    a = im[..., 3].astype(int)
    solida = a >= 200
    et, n = nd.label(solida); tam = nd.sum(solida, et, range(1, n + 1)); cuerpo = et == 1 + int(np.argmax(tam))
    cuerpo = nd.binary_fill_holes(cuerpo)
    canto = nd.binary_dilation(cuerpo, iterations=4) & (a > 0)          # el canto suave pegado a la mochila
    limpia = im.copy(); limpia[~canto] = 0
    limpia[cuerpo & (a >= 250), 3] = 255
    ys, xs = np.where(limpia[..., 3] > 0); rec = limpia[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    SAL.mkdir(exist_ok=True)
    Image.fromarray(rec, 'RGBA').save(SAL / 'mochila-recortada.png', optimize=True)
    ancho = rec.shape[1] * ESCALA; alto = rec.shape[0] * ESCALA
    coloc = {}
    for nombre, cx in COLOCACIONES.items():
        capa = CL.colocar(SAL / 'mochila-recortada.png', (cx, FONDO_Y - alto / 2), ancho, 0)
        Image.fromarray(capa, 'RGBA').save(SAL / f'mochila-cuerpo-{nombre}.png', optimize=True)
        yy, xx = np.where(capa[..., 3] > 0)
        coloc[nombre] = dict(centro_x=cx, fondo_y=FONDO_Y, caja_en_el_lienzo=[int(xx.min()), int(yy.min()), int(xx.max()), int(yy.max())],
                             px=int((capa[..., 3] > 0).sum()))
    comp = dict(original=str(ORIGINAL.relative_to(CJ)), sha256_original=antes, original_sin_cambios=sha(ORIGINAL) == antes,
                recibido=[int(im.shape[1]), int(im.shape[0])], recorte=[int(rec.shape[1]), int(rec.shape[0])],
                motas_quitadas_px=int(((a > 0) & ~canto).sum()), alfa_interior_a_255_px=int((cuerpo & (a >= 250) & (a < 255)).sum()),
                escala=ESCALA, giro=0, misma_escala_en_los_dos_ejes=True, tamano_en_el_lienzo=[round(ancho), round(alto)], colocaciones=coloc)
    (SAL / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
