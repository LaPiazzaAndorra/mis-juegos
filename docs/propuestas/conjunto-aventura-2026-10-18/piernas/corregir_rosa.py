#!/usr/bin/env python3
"""
Corrección de los restos rosas bajo el pantalón (D-027, rodillas B), SOLO dentro de `mascara-rosa.png`, sin imágenes
nuevas: se copia nuestra propia piel contigua (decisión de la propietaria, 19/10).

  · En cada pierna: cada columna del trocito toma la piel de la MISMA columna justo por debajo de él, reflejada en su
    borde inferior (el píxel de más abajo del trocito toma el de justo debajo; el siguiente, el de 2 px más abajo…): la
    unión con la piel de debajo es continua y se conservan el sombreado de lado a lado y el contorno de la pierna en esa
    columna.
  · En la abertura central (entre las dos perneras del pantalón, por encima del borde): fondo (transparente).

Parte de la base B aprobada (`../integrar/piernas-b/base-piernas-sin-mallas.png`); el pantalón no cambia; fuera de la
máscara, la imagen sigue idéntica (se comprueba píxel a píxel).
Salida: `../integrar/piernas-b2/` (base-piernas-sin-mallas.png, comprobaciones.json, antes-despues.png).

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/piernas/corregir_rosa.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; CJ = AQUI.parent; sys.path.insert(0, str(CJ))
import conjunto_aventura as A   # noqa: E402
PT = A.PT; CREMA = (253, 250, 245)
BASE_B = CJ / 'integrar' / 'piernas-b' / 'base-piernas-sin-mallas.png'; SAL = CJ / 'integrar' / 'piernas-b2'
Y_ABERTURA = 1140          # un trocito por encima de esta altura está en la abertura entre las perneras, no en una pierna


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def montar(capas):
    f = Image.new('RGBA', (948, 1659), CREMA + (255,))
    for c in capas:
        f.alpha_composite(Image.fromarray(c, 'RGBA'))
    return np.array(f.convert('RGB'))


if __name__ == '__main__':
    antes_sha = {k: sha(p) for k, p in dict(base_b=BASE_B, base_aprobada=PT.SIN_OJOS, pantalon=CJ / 'capas' / 'pantalon.png').items()}
    b = PT.abrir(BASE_B); zona = np.array(Image.open(AQUI / 'mascara-rosa.png')) > 127
    nueva = b.copy(); et, n = nd.label(zona, structure=np.ones((3, 3))); partes = []
    for i in range(1, n + 1):
        m = et == i; ys, xs = np.where(m)
        if ys.mean() < Y_ABERTURA:
            nueva[m] = 0; tipo = 'abertura: fondo'
        else:
            for x in np.unique(xs):
                col = np.where(m[:, x])[0]; yb = col.max()
                for y in col:
                    nueva[y, x] = b[2 * yb + 1 - y, x]     # reflejo en el borde inferior: la piel de justo debajo, misma columna
            tipo = 'pierna: piel contigua de debajo'
        partes.append(dict(centro=[int(xs.mean()), int(ys.mean())], px=int(m.sum()), tipo=tipo))
    SAL.mkdir(exist_ok=True); Image.fromarray(nueva, 'RGBA').save(SAL / 'base-piernas-sin-mallas.png', optimize=True)
    pant = PT.abrir(CJ / 'capas' / 'pantalon.png'); YY = np.mgrid[0:1659, 0:948][0]
    def rosa_visto(x):
        l = PT.lab_de(x); return (x[..., 3] > 128) & (l[..., 1] > 15) & (l[..., 2] < 14) & (YY > 1095) & (pant[..., 3] <= 128)
    otras = [PT.abrir(CJ / 'capas' / f'{k}.png') for k in ('calcetines', 'botas', 'pantalon')]
    va, vd = montar([b] + otras), montar([nueva] + otras)
    comp = dict(partes=partes, mascara_px=int(zona.sum()), rosa_a_la_vista_antes_px=int(rosa_visto(b).sum()),
                rosa_a_la_vista_despues_px=int(rosa_visto(nueva).sum()),
                rosa_bajo_el_borde_suave_del_pantalon_px=int(((lambda l: (nueva[..., 3] > 128) & (l[..., 1] > 15) & (l[..., 2] < 14))(PT.lab_de(nueva)) & (pant[..., 3] > 128) & (pant[..., 3] < 250) & (YY > 1095)).sum()),
                fuera_de_la_mascara_identico=bool((nueva[~zona] == b[~zona]).all()),
                con_el_pantalon_fuera_de_la_mascara_identico=bool((va[~zona] == vd[~zona]).all()),
                fuentes_sin_cambios=antes_sha == {k: sha(p) for k, p in dict(base_b=BASE_B, base_aprobada=PT.SIN_OJOS, pantalon=CJ / 'capas' / 'pantalon.png').items()})
    (SAL / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    # antes y después: cada trocito ampliado ×5, con el pantalón puesto (y la máscara en magenta como guía)
    F = PT.MK.F(15); w = 34; esc = 5; filas = []
    borde = nd.binary_dilation(zona, iterations=1) & ~zona
    for p in partes:
        cx, cy = p['centro']; caja = (cx - w, cy - w // 2 - 6, cx + w, cy + w // 2 + 6)
        g = va.copy(); g[borde] = (230, 0, 140)
        ims = [Image.fromarray(x).crop(caja).resize(((caja[2] - caja[0]) * esc, (caja[3] - caja[1]) * esc), Image.NEAREST) for x in (va, g, vd)]
        filas.append((p, ims))
    W1, H1 = filas[0][1][0].size; out = Image.new('RGB', (3 * (W1 + 10), len(filas) * (H1 + 30) + 10), 'white'); d = ImageDraw.Draw(out)
    for j, (p, ims) in enumerate(filas):
        y = j * (H1 + 30) + 10
        d.text((4, y), f'({p["centro"][0]}, {p["centro"][1]}) · {p["tipo"]}', font=F, fill=(40, 40, 60))
        for i, (im, t) in enumerate(zip(ims, ['antes', 'máscara', 'después'])):
            out.paste(im, (i * (W1 + 10), y + 18)); d.text((i * (W1 + 10) + W1 - 70, y), t, font=F, fill=(120, 40, 90))
    out.save(SAL / 'antes-despues.png', optimize=True)
    print(json.dumps(comp, ensure_ascii=False))
