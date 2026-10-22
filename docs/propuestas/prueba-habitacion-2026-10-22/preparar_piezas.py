#!/usr/bin/env python3
"""
Habitación de Mi Mundo (D-031) · piezas para la copia aislada, a partir de las propuestas recibidas (recibidas/, sin
modificar): fondo vacío (1536 × 1024) y cama (1312 × 1199, con transparencia).

Comprobado en la cama: bordes limpios (sin halo ni contorno oscuro), pero
  · todo su interior tiene alfa 252–253 (casi opaco, se transparentaba un 1 %): pasa a 255 donde el alfa es ≥ 240;
  · 599 motitas sueltas alrededor (1 875 px): se quitan (se conserva solo la cama).
Capas (mismo lienzo que la cama):
  · arte/cama-detras.webp  la cama entera (cabecero, almohadas, colchón, edredón, pie): va detrás de la muñeca;
  · arte/cama-delante.webp solo lo que queda por delante del borde de arriba del embozo y de la manta (línea EMBOZO, trazada
    sobre la imagen): tapa a la muñeca acostada desde el cuello. Nada se dibuja ni se inventa: es la misma cama recortada.
  · arte/fondo-habitacion.webp el fondo, sin cambios (WebP de alta calidad).
Ancla para acostarla (en píxeles de la cama): cabeza en las almohadas, centro de la muñeca en ACOSTADA, girada -25°.

Uso (desde la raíz): python3 docs/propuestas/prueba-habitacion-2026-10-22/preparar_piezas.py
"""
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent
EMBOZO = [(40, 452), (130, 468), (200, 488), (300, 483), (400, 479), (460, 475), (530, 469), (600, 456), (700, 447), (760, 441),
          (820, 443), (900, 449), (1000, 463), (1100, 490), (1180, 520), (1312, 540)]
ACOSTADA = dict(cx=385, cy=525, giro=-25, alto=560)      # la muñeca: centro, giro y alto visible (de 1500) en px de la cama


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    rc, rf = AQUI / 'recibidas' / 'cama-propuesta.png', AQUI / 'recibidas' / 'fondo-habitacion-propuesta.png'
    antes = {p.name: sha(p) for p in (rc, rf)}
    c = np.array(Image.open(rc).convert('RGBA')); a = c[..., 3].astype(int)
    casi = int(((a >= 240) & (a < 255)).sum()); c[..., 3] = np.where(a >= 240, 255, a)
    m = a > 0; lab, n = nd.label(m); tam = nd.sum(m, lab, range(1, n + 1)); cama_id = int(np.argmax(tam)) + 1
    sueltas = (lab != cama_id) & (lab > 0); c[sueltas, 3] = 0
    cama = Image.fromarray(c.astype(np.uint8)); W, H = cama.size
    linea = Image.new('L', (W, H), 0); ImageDraw.Draw(linea).polygon(EMBOZO + [(W, H), (0, H)], fill=255)
    linea = np.array(linea.filter(ImageFilter.GaussianBlur(1.2))).astype(float) / 255
    delante = c.copy(); delante[..., 3] = (c[..., 3] * linea).astype(np.uint8)
    (AQUI / 'arte').mkdir(exist_ok=True)
    cama.save(AQUI / 'arte' / 'cama-detras.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    Image.fromarray(delante).save(AQUI / 'arte' / 'cama-delante.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    Image.open(rf).convert('RGB').save(AQUI / 'arte' / 'fondo-habitacion.webp', 'WEBP', quality=92, method=6)
    comp = dict(cama=dict(tam=[W, H], alfa_casi_opaco_corregido_px=casi, motitas_quitadas=int(n - 1), motitas_px=int(sueltas.sum()),
                          delante_px=int((delante[..., 3] > 0).sum())),
                fondo=dict(tam=list(Image.open(rf).size)), acostada=ACOSTADA, embozo=EMBOZO,
                kb={p.name: round(p.stat().st_size / 1024, 1) for p in sorted((AQUI / 'arte').glob('*.webp'))},
                recibidas_sin_cambios=antes == {p.name: sha(p) for p in (rc, rf)}, sha256_recibidas=antes)
    (AQUI / 'arte' / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k in ('cama', 'kb', 'recibidas_sin_cambios')}, ensure_ascii=False))
