#!/usr/bin/env python3
"""
Pelo para el conjunto de aventura con todos los tonos de piel (D-027, 21/10/2026) · copias en conjunto/.

Con la piel oscura se ven dos cosas que con la piel clara y el vestido apenas se notaban:
1. Restos ROSAS del vestido en el canto de los rizos de la MELENA (pelo de delante y de detrás), junto a los brazos, las
   manos y la cintura: con el vestido largo quedaban encima de su falda. Se limpian como los de las dos coletas
   (limpiar_coletas.rosa y limpiar_coletas.limpiar_rosa), ahora por debajo de los hombros (y > 600) en toda la anchura.
2. Rendijas de 1–2 px de FONDO entre los rizos y el borde del brazo (se ven como una línea de puntos claros, sobre todo
   con la piel profunda): el pelo de detrás se recortó con un borde a cuadros junto al brazo. Se rellenan, en el pelo
   de detrás, con el pelo más cercano (opaco): solo los huecos de menos de 60 px a 2 px o menos del pelo y del cuerpo
   (base o ropa del conjunto), y los agujeritos del propio pelo que se cierran con 2 px (pelo a los dos lados) a 8 px o
   menos del cuerpo, por debajo de y = 560.
Se parte de las copias ya limpias (pelo-delante-<color>-sin-restos, pelo-coleta-…-sin-restos, pelo-coletas-…-sin-restos)
y, para el pelo de detrás de la melena, de los originales aprobados. Nada de eso cambia; se escriben copias nuevas en
conjunto/ (cinco colores; mismas máscaras en todos) y sus máscaras (rosa-melena-<parte>.png, rendijas-<peinado>.png).

Uso (desde la raíz): python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-sin-restos/limpiar_conjunto.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; sys.path.insert(0, str(AQUI)); import limpiar_coletas as LC   # noqa: E402
PT, B, P, RAIZ, COLORES = LC.PT, LC.B, LC.P, LC.RAIZ, LC.COLORES
SAL = AQUI / 'conjunto'
I = P / 'conjunto-aventura-2026-10-18' / 'integrar'
CUERPO = [I / 'piernas-b2c' / 'base-piernas-sin-mallas.png', I / 'ropa-c' / 'camiseta.png', I / 'ropa-d' / 'pantalon.png', I / 'ropa-d' / 'chaleco.png', I / 'mochila-b' / 'tiras.png']
DETRAS_MELENA = {'castano': B / 'pelo-borrador-d012' / 'revision-localizada' / 'variante-experimental' / 'pelo-variante-sin-mechon-detras.png',
                 **{c: B / 'pelo-colores' / f'pelo-detras-{c}.png' for c in COLORES if c != 'castano'}}
DELANTE_COLETA = LC.COLETA / 'pelo-coleta-{v}-delante-castano.png'
DELANTE_COLETAS = LC.COLETAS / 'pelo-coletas-{v}-sombrero-delante-castano.png'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def rosa_melena(capa):
    L = PT.lab_de(capa).astype(float); C = np.hypot(L[..., 1], L[..., 2]); YY = np.mgrid[:capa.shape[0], :capa.shape[1]][0]
    rosado = (L[..., 1] > 1.05 * L[..., 2]) & (C > 10) & (L[..., 0] > 60)
    salmon = (L[..., 1] > 0.9 * L[..., 2]) & (C > 12) & (L[..., 0] > 130)
    return (capa[..., 3] > 0) & (rosado | salmon) & (YY > 600)


def rendijas(detras, delante, cuerpo):
    """Huecos pequeños de fondo entre el pelo y el cuerpo (por debajo de la barbilla)."""
    pelo = (detras[..., 3] > 128) | (delante[..., 3] > 128); YY = np.mgrid[:pelo.shape[0], :pelo.shape[1]][0]
    g = ~pelo & ~cuerpo & nd.binary_dilation(pelo, iterations=2) & nd.binary_dilation(cuerpo, iterations=2) & (YY > 560)
    # y los agujeritos a cuadros del propio pelo junto al corte del brazo (pelo a los dos lados)
    g |= nd.binary_closing(pelo | cuerpo, iterations=2) & ~pelo & ~cuerpo & nd.binary_dilation(cuerpo, iterations=8) & nd.binary_dilation(pelo, iterations=1) & (YY > 560)
    et, n = nd.label(g); tam = nd.sum(g, et, range(1, n + 1))
    return np.isin(et, [i + 1 for i in range(n) if tam[i] < 60])


def rellenar(detras, m):
    op = detras[..., 3] == 255
    _, (iy, ix) = nd.distance_transform_edt(~op, return_indices=True)
    o = detras.copy(); o[m, :3] = detras[iy[m], ix[m], :3]; o[m, 3] = 255
    return o


def guardar_mascara(m, nombre):
    Image.fromarray(np.where(m, 255, 0).astype(np.uint8)).save(SAL / nombre, optimize=True)


if __name__ == '__main__':
    SAL.mkdir(exist_ok=True)
    fuentes = [AQUI / f'pelo-delante-{c}-sin-restos.png' for c in COLORES] + list(DETRAS_MELENA.values()) + \
              [AQUI / f'pelo-coleta-{v}-detras-{c}-sin-restos.png' for v in ('con', 'sin') for c in COLORES] + \
              [AQUI / f'pelo-coletas-{v}-sombrero-detras-{c}-sin-restos.png' for v in ('con', 'sin') for c in COLORES]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    cuerpo = np.zeros((1659, 948), bool)
    for r in CUERPO:
        cuerpo |= PT.abrir(r)[..., 3] > 128
    comp = {}
    # 1. melena: rosa en los dos pelos y rendijas en el de detrás
    de0, dt0 = PT.abrir(AQUI / 'pelo-delante-castano-sin-restos.png'), PT.abrir(DETRAS_MELENA['castano'])
    md, mt = rosa_melena(de0), rosa_melena(dt0)
    guardar_mascara(md, 'rosa-melena-delante.png'); guardar_mascara(mt, 'rosa-melena-detras.png')
    for c in COLORES:
        de = PT.abrir(AQUI / f'pelo-delante-{c}-sin-restos.png'); dt = PT.abrir(DETRAS_MELENA[c])
        assert (de[..., 3] == de0[..., 3]).all() and (dt[..., 3] == dt0[..., 3]).all(), c
        de2, cd, hd = LC.limpiar_rosa(de, md); dt2, ct, ht = LC.limpiar_rosa(dt, mt)
        r = rendijas(dt2, de2, cuerpo); dt3 = rellenar(dt2, r)
        if c == 'castano':
            guardar_mascara(r, 'rendijas-melena.png')
        Image.fromarray(de2).save(SAL / f'pelo-delante-{c}.png', optimize=True); Image.fromarray(dt3).save(SAL / f'pelo-detras-{c}.png', optimize=True)
        comp[f'melena-{c}'] = dict(rosa_delante=dict(px=int(md.sum()), canto=int(cd.sum()), transparente=int(hd.sum())),
                                   rosa_detras=dict(px=int(mt.sum()), canto=int(ct.sum()), transparente=int(ht.sum())), rendijas_px=int(r.sum()))
    # 2. coleta y dos coletas: rendijas en el pelo de detrás (las copias sin restos ya están limpias de rosa)
    for nombre, patron, delante in (('coleta', 'pelo-coleta-{v}-detras-{c}', DELANTE_COLETA), ('coletas', 'pelo-coletas-{v}-sombrero-detras-{c}', DELANTE_COLETAS)):
        for v in ('con', 'sin'):
            dl = PT.abrir(str(delante).format(v=v))
            for c in COLORES:
                dt = PT.abrir(AQUI / (patron.format(v=v, c=c) + '-sin-restos.png'))
                r = rendijas(dt, dl, cuerpo); o = rellenar(dt, r)
                if c == 'castano':
                    guardar_mascara(r, f'rendijas-{nombre}-{v}.png')
                Image.fromarray(o).save(SAL / (patron.format(v=v, c=c) + '.png'), optimize=True)
                comp[f'{nombre}-{v}-{c}'] = dict(rendijas_px=int(r.sum()), fuera_igual=bool((o[~r] == dt[~r]).all()))
    comp['originales_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    comp['sha256_originales'] = antes
    (SAL / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k.endswith('castano') or k == 'originales_sin_cambios'}, ensure_ascii=False))
