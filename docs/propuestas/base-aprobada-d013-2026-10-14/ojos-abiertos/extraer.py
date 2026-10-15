#!/usr/bin/env python3
"""
Extrae los ojos abiertos de la base D-014 como CAPA DE PRUEBA, con la máscara v2.

  capa = colores originales de la base (sin cambiar) + opacidad = máscara v2 × opacidad de la base
  · mismo lienzo (948 × 1659) y misma posición: se coloca en (0, 0) encima de la base;
  · fuera de la máscara, píxeles totalmente transparentes (RGBA 0, 0, 0, 0);
  · no corrige colores de bordes ni modifica la base.

Uso (desde la raíz):  python3 docs/propuestas/base-aprobada-d013-2026-10-14/ojos-abiertos/extraer.py
  → capa-ojos-abiertos-prueba.png y comprobaciones-capa.json
"""
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image

AQUI = Path(__file__).resolve().parent
BASE = AQUI.parent / 'base-transparencia-corregida.png'


def extraer(base_rgba, m):
    capa = base_rgba.copy()
    capa[..., 3] = np.round(base_rgba[..., 3].astype(float) * m / 255).astype(np.uint8)
    capa[m == 0] = 0
    return capa


if __name__ == '__main__':
    A = np.array(Image.open(BASE).convert('RGBA'))
    m = np.array(Image.open(AQUI / 'mascara-ojos-propuesta-v2.png'))
    capa = extraer(A, m)
    Image.fromarray(capa, 'RGBA').save(AQUI / 'capa-ojos-abiertos-prueba.png', optimize=True)
    dentro = m > 0
    comp = dict(
        tamaño=[capa.shape[1], capa.shape[0]], mascara='mascara-ojos-propuesta-v2.png',
        colores_identicos_a_la_base=bool((capa[..., :3][dentro] == A[..., :3][dentro]).all()),
        opacidad_igual_a_la_mascara=bool((capa[..., 3] == m).all()),
        pixeles_visibles=int((capa[..., 3] > 0).sum()), opacos=int((capa[..., 3] == 255).sum()),
        caja=list(Image.fromarray(capa[..., 3]).getbbox()),
        sha256_archivo=hashlib.sha256((AQUI / 'capa-ojos-abiertos-prueba.png').read_bytes()).hexdigest())
    (AQUI / 'comprobaciones-capa.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(comp, ensure_ascii=False))
