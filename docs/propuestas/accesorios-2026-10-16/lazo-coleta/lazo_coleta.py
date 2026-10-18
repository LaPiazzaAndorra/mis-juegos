#!/usr/bin/env python3
"""
Lazo en la base de la coleta (D-024 · D-025, candidato pendiente de revisión).

Con la melena, el lazo aprobado va en los rizos del lado de la cabeza (capas/capa-lazo.png); con la coleta se coloca
en la base de la coleta, donde se recoge el pelo, en una capa transparente INDEPENDIENTE de 948 × 1659. Es el mismo
recorte aprobado (capas/lazo-recortado.png) con colocar() de capas/colocar.py: solo cambian la escala, la posición y
el giro (sin deformar ni retocar el dibujo). Va encima del pelo de delante y de la cinta, y debajo de la corona.

Una sola colocación vale para la coleta con cinta y sin cinta: la base de la coleta está por encima de la cinta.
Comprobaciones: no toca la piel que se ve (cara, orejas), queda sobre el pelo de la coleta en las dos versiones, y
cuánto pisa la cinta. Las capas de la coleta, la cinta y el recorte no cambian (sha256 antes y después).

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/lazo-coleta/lazo_coleta.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[3]; P = RAIZ / 'docs' / 'propuestas'
ACC = AQUI.parent / 'capas'
sys.path[:0] = [str(ACC), str(P / 'peinado-coleta-2026-10-16')]
import colocar as CL            # noqa: E402  (la misma colocación que el lazo de la melena)
import coleta_variantes as CV   # noqa: E402  (capas aprobadas de la coleta y piezas de cada tono)
PT = CV.PT

RECORTE = ACC / 'lazo-recortado.png'
ENCAJE = dict(centro=(612, 86), ancho=138, giro=-32)   # el de la melena: centro (642, 263), ancho 138, giro -18
SALIDA = AQUI / 'capa-lazo-coleta.png'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def coleta(v, k, t='claro'):
    pz = CV.piezas_piel(t); pd = CV.PIELES_DIR / t
    o = (lambda n: PT.abrir(CV.VAR / n)) if t == 'claro' else (lambda n: PT.abrir(pd / n))
    cs = [o('orejas-coleta-detras.png'), PT.abrir(CV.VAR / f'pelo-coleta-{v}-detras-{k}.png'), pz['base']]
    cj = CV.cejas(t, k)
    cs += ([cj] if cj is not None else []) + [pz['ojos'], PT.abrir(PT.SIN_PIEL['vestido']), pz['manos'], o('orejas-coleta-delante.png'),
                                             PT.abrir(CV.VAR / f'pelo-coleta-{v}-delante-{k}.png')]
    if t != 'claro':
        cs.append(PT.abrir(pd / f'bordes-coleta-{v}-{k}.png'))
    if v == 'con':
        cs.append(PT.abrir(CV.CINTA))
    return cs


if __name__ == '__main__':
    fuentes = [RECORTE, CV.CINTA, PT.SIN_OJOS] + [CV.VAR / f'pelo-coleta-{v}-{p}-castano.png' for v in ('con', 'sin') for p in CV.PARTES]
    fuentes += [CV.VAR / f'orejas-coleta-{p}.png' for p in CV.PARTES]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    lazo = CL.colocar(RECORTE, **ENCAJE); hay = lazo[..., 3] > 0
    Image.fromarray(lazo, 'RGBA').save(SALIDA, optimize=True)
    base = PT.abrir(PT.SIN_OJOS); wb, _ = PT.peso_base(base, PT.lab_de(base))
    orejas = (PT.abrir(CV.VAR / 'orejas-coleta-detras.png')[..., 3] > 0) | (PT.abrir(CV.VAR / 'orejas-coleta-delante.png')[..., 3] > 0)
    cinta = PT.abrir(CV.CINTA)[..., 3] > 0
    ys, xs = np.where(hay); info = dict(**ENCAJE, caja=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], px=int(hay.sum()))
    for v in ('con', 'sin'):
        de = PT.abrir(CV.VAR / f'pelo-coleta-{v}-delante-castano.png'); dt = PT.abrir(CV.VAR / f'pelo-coleta-{v}-detras-castano.png')
        piel = (((wb > 0) & (base[..., 3] > 0)) | orejas) & (de[..., 3] < 128)
        pelo = (de[..., 3] > 0) | (dt[..., 3] > 0)
        info[f'coleta_{v}_cinta'] = dict(solape_piel_visible_px=int((hay & piel).sum()), sobre_el_pelo=round(float((hay & pelo).sum() / hay.sum()), 3),
                                         **({'solape_cinta_px': int((hay & cinta).sum())} if v == 'con' else {}))
    comp = dict(metodo='recorte aprobado del lazo (capas/lazo-recortado.png) con colocar(): solo escala, posición y giro; '
                       'encima del pelo de delante y de la cinta, debajo de la corona', lazo=info,
                encaje_melena=CL.ENCAJE['lazo'], sha256_fuentes=antes)
    comp['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # comparación: con y sin cinta, sin y con lazo (castaño, piel clara) y el lazo con los cinco colores y tonos
    caja = (300, 0, 860, 600); F = PT.MK.F(15)
    def vista(cs, esc=2):
        return PT.montar(cs).crop(caja).resize(((caja[2] - caja[0]) // esc, (caja[3] - caja[1]) // esc), Image.LANCZOS)
    fila1 = [(f'Coleta {v} cinta' + (' + lazo' if l else ''), vista(coleta(v, 'castano') + ([lazo] if l else []))) for v in ('con', 'sin') for l in (False, True)]
    pares = list(zip(CV.COLORES, CV.PIELES + ['claro']))
    fila2 = [(f'{k} · {t} · {v}', vista(coleta(v, k, t) + [lazo], 3)) for (k, t), v in zip(pares, ['con', 'sin', 'con', 'sin', 'con'])]
    w, h = fila1[0][1].size; w2, h2 = fila2[0][1].size
    out = Image.new('RGB', (max(4 * (w + 8), 5 * (w2 + 8)), h + h2 + 60), 'white'); d = ImageDraw.Draw(out)
    for i, (n, im) in enumerate(fila1):
        out.paste(im, (i * (w + 8), 24)); d.text((i * (w + 8) + 4, 4), n, font=F, fill=(40, 40, 60))
    for i, (n, im) in enumerate(fila2):
        out.paste(im, (i * (w2 + 8), h + 56)); d.text((i * (w2 + 8) + 4, h + 34), n, font=F, fill=(40, 40, 60))
    out.save(AQUI / 'comparacion-lazo-coleta.png', optimize=True)
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
