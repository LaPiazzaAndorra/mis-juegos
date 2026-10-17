#!/usr/bin/env python3
"""
Revisión del gorrito B (aprobado, D-024) con los cinco colores de pelo (D-022) y los cuatro tonos de piel (D-023) sobre
la melena, y comprobación (sin integrarlo) con la coleta (D-025). No cambia ninguna capa: solo monta las aprobadas en el
orden del visor y mide.

  · Melena: pelo detrás · base · cejas a juego · ojos · zapatos (+bordes) · vestido (+bordes) · manos · pelo delante ·
    bordes del pelo · gorrito B. Se mide, en cada combinación, el pelo de arriba que queda sin cubrir (es el mismo
    pelo con otro color: debe ser igual) y si el borde del gorro deja halos: en una franja de 2 px por fuera del gorro
    (sobre el pelo y la piel) se compara con lo de alrededor.
  · Coleta (con y sin cinta, castaño y piel clara): se monta el gorrito B encima y se marca el pelo de la coleta que
    queda fuera o por encima del gorro, y la cinta tapada o asomando. Solo para señalar qué haría falta adaptar.

Salida (revision-b/): combinaciones-melena.png, detalle-bordes.png, coleta-con-gorrito-b.png y comprobaciones.json.

Uso (desde la raíz): python3 docs/propuestas/accesorios-2026-10-16/gorrito/revisar_b.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; RAIZ = AQUI.parents[3]
sys.path[:0] = [str(RAIZ / 'docs' / 'propuestas' / 'peinado-coleta-2026-10-16')]
import coleta_variantes as CV   # noqa: E402
PT = CV.PT; CP = CV.CP; MK = CV.MK
SAL = AQUI / 'revision-b'; GORRO = AQUI / 'capa-gorrito-b.png'
COLORES = CV.COLORES; PIELES = CV.PIELES; PTD = CV.PTD


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def pelo_melena(k, parte):
    if k == 'castano':
        return PT.abrir(CP.DETRAS if parte == 'detras' else CP.DELANTE)
    return PT.abrir(CP.AQUI / f'pelo-{parte}-{k}.png')


def capas_melena(t, k, f, ojos='ojos'):
    pz = CV.piezas_piel(t); cj = CV.cejas(t, k); claro = t == 'claro'
    c = [pelo_melena(k, 'detras'), pz['base']] + ([cj] if cj is not None else []) + [pz[ojos], f['zapatos']]
    c += ([] if claro else [PT.abrir(PTD / t / 'bordes-zapatos.png')]) + [f['vestido']] + ([] if claro else [PT.abrir(PTD / t / 'bordes-vestido.png')])
    c += [pz['manos'], pelo_melena(k, 'delante')] + ([] if claro else [PT.abrir(PTD / t / f'bordes-pelo-{k}.png')])
    return c


def montar(capas, fondo=(255, 250, 245)):
    x = Image.new('RGBA', (948, 1659), (0, 0, 0, 0))
    for c in capas:
        x.alpha_composite(Image.fromarray(c))
    bg = Image.new('RGBA', x.size, fondo + (255,)); bg.alpha_composite(x)
    return bg.convert('RGB')


if __name__ == '__main__':
    SAL.mkdir(exist_ok=True)
    gorro = PT.abrir(GORRO); fuentes = [GORRO, CP.DETRAS, CP.DELANTE, PT.SIN_OJOS]
    antes = {str(p.relative_to(RAIZ)): sha(p) for p in fuentes}
    f = {k: PT.abrir(PT.SIN_PIEL[k]) for k in PT.SIN_PIEL}
    G = gorro[..., 3] >= 128; YY = np.mgrid[0:1659, 0:948][0]
    # franja de 2 px por fuera del gorro (lo que se ve junto a su borde), sin el fondo
    fuera = nd.binary_dilation(gorro[..., 3] > 0, iterations=2) & ~(gorro[..., 3] > 0)
    anillo = nd.binary_dilation(gorro[..., 3] > 0, iterations=7) & ~nd.binary_dilation(gorro[..., 3] > 0, iterations=3)
    borde_gorro = (gorro[..., 3] > 0) & (gorro[..., 3] < 255)
    lab_rgb = lambda im: MK.lab_de(Image.fromarray(np.dstack([np.array(im), np.full((1659, 948), 255, np.uint8)]))).astype(float)
    info = dict(melena={}, sha256_fuentes=antes)
    vistas = {}
    for t in PIELES:
        for k in COLORES:
            capas = capas_melena(t, k, f)
            al = PT.montar_rgba(capas)[..., 3] > 0
            de = pelo_melena(k, 'delante')[..., 3] > 0; dt = pelo_melena(k, 'detras')[..., 3] > 0
            cols = np.where(G.any(0))[0]
            im = montar(capas + [gorro]); L = lab_rgb(im)[..., 0]; L0 = lab_rgb(montar(capas))[..., 0]
            # borde semitransparente del gorro: ¿más claro u oscuro que el gorro de dentro y que lo de fuera? (halo)
            dentro = nd.binary_erosion(G, iterations=3)
            Lg = nd.gaussian_filter(L * dentro, 4) / np.maximum(nd.gaussian_filter(dentro * 1.0, 4), 1e-6)
            ref_fuera = nd.gaussian_filter(L0 * anillo, 4) / np.maximum(nd.gaussian_filter(anillo * 1.0, 4), 1e-6)
            m = borde_gorro & al
            lo, hi = np.minimum(Lg, ref_fuera), np.maximum(Lg, ref_fuera)
            halo_claro = m & (L > hi + 15); halo_oscuro = m & (L < lo - 15)
            info['melena'][f'{t}-{k}'] = dict(halo_claro_px=int(halo_claro.sum()), halo_oscuro_px=int(halo_oscuro.sum()), borde_px=int(m.sum()))
            vistas[(t, k)] = im
    # una sola vez: el pelo de arriba sin cubrir es el mismo con cualquier color (mismo alfa)
    alfas_iguales = all(bool(((pelo_melena(k, p)[..., 3] > 0) == (pelo_melena('castano', p)[..., 3] > 0)).all()) for k in COLORES for p in ('detras', 'delante'))
    info['alfa_del_pelo_igual_en_los_5_colores'] = alfas_iguales
    info['comprobaciones_b'] = json.loads((AQUI / 'comprobaciones-b.json').read_text(encoding='utf-8'))['b']
    # vista de todas las combinaciones (cabeza)
    caja = (150, 20, 948, 640); esc = 0.38; w, h = round((caja[2] - caja[0]) * esc), round((caja[3] - caja[1]) * esc)
    out = Image.new('RGB', (110 + 5 * (w + 6), 24 + 4 * (h + 6)), 'white'); d = ImageDraw.Draw(out)
    for i, k in enumerate(COLORES):
        d.text((110 + i * (w + 6) + 4, 4), CP.NOMBRES[k], font=MK.F(15), fill=(40, 40, 60))
    for j, t in enumerate(PIELES):
        d.text((4, 24 + j * (h + 6) + h // 2), PT.NOMBRES[t], font=MK.F(15), fill=(40, 40, 60))
        for i, k in enumerate(COLORES):
            out.paste(vistas[(t, k)].crop(caja).resize((w, h), Image.LANCZOS), (110 + i * (w + 6), 24 + j * (h + 6)))
    out.save(SAL / 'combinaciones-melena.png', optimize=True)
    # detalle a tamaño real de los bordes del gorro: lado izquierdo del ala, frente, lado derecho y pompón; fondo claro y oscuro
    ZONAS = [('Ala izquierda', (160, 250, 330, 470)), ('Frente', (330, 270, 640, 400)), ('Ala derecha y pompón', (700, 300, 948, 520))]
    filas = [('claro', 'castano'), ('claro', 'miel'), ('dorado', 'jengibre'), ('moreno', 'oscuro'), ('profundo', 'miel'), ('profundo', 'chocolate')]
    H = max(z[3] - z[1] for _, z in ZONAS); W = 190 + sum((z[2] - z[0]) * 2 + 20 for _, z in ZONAS)
    out = Image.new('RGB', (W, 30 + len(filas) * (H + 8)), 'white'); d = ImageDraw.Draw(out)
    x = 190
    for nz, z in ZONAS:
        d.text((x, 6), nz + ' · fondo claro y oscuro', font=MK.F(14), fill=(40, 40, 60)); x += (z[2] - z[0]) * 2 + 20
    for j, (t, k) in enumerate(filas):
        y = 30 + j * (H + 8); d.text((4, y + H // 2 - 8), f'{PT.NOMBRES[t]} · {CP.NOMBRES[k]}', font=MK.F(13), fill=(40, 40, 60))
        capas = capas_melena(t, k, f) + [gorro]; ims = [vistas[(t, k)], montar(capas, (40, 40, 55))]
        x = 190
        for _, z in ZONAS:
            for im in ims:
                out.paste(im.crop(z), (x, y)); x += z[2] - z[0]
            x += 20
    out.save(SAL / 'detalle-bordes.png', optimize=True)

    # coleta (sin integrar): con y sin cinta, castaño, piel clara; se marca lo que no encaja
    C = CV.CAPAS; ores = {p: PT.abrir(C / 'variantes' / f'orejas-coleta-{p}.png') for p in CV.PARTES}
    pz = CV.piezas_piel('claro'); cinta = PT.abrir(CV.CINTA); tiles = []; info['coleta'] = {}
    for v in ('con', 'sin'):
        dt = PT.abrir(C / 'variantes' / f'pelo-coleta-{v}-detras-castano.png'); de = PT.abrir(C / 'variantes' / f'pelo-coleta-{v}-delante-castano.png')
        base_c = [ores['detras'], dt, pz['base'], pz['ojos'], f['zapatos'], f['vestido'], pz['manos'], ores['delante'], de]
        con_c = base_c + ([cinta] if v == 'con' else [])
        pelo = (dt[..., 3] > 0) | (de[..., 3] > 0)
        moño = pelo & (YY < 300)                                  # la coleta alta y el pelo de arriba
        fuera = moño & ~G
        ci = cinta[..., 3] > 0
        info['coleta'][v] = dict(pelo_de_arriba_px=int(moño.sum()), pelo_de_arriba_fuera_del_gorro_px=int(fuera.sum()),
                                 pelo_por_encima_del_gorro_px=int((fuera & (YY < np.where(G.any(1))[0].min() + 0)).sum()),
                                 cinta_tapada_px=int((ci & G).sum()) if v == 'con' else 0, cinta_asoma_px=int((ci & ~G).sum()) if v == 'con' else 0)
        im = montar(con_c + [gorro])
        mk = np.array(im).copy(); mk[fuera] = [255, 0, 160]
        if v == 'con':
            mk[ci & ~G] = [255, 200, 0]
        tiles += [(f'Coleta {"con" if v == "con" else "sin"} cinta + gorrito B', im), (f'{"con" if v == "con" else "sin"} cinta: magenta, pelo fuera del gorro' + ('; amarillo, cinta que asoma' if v == 'con' else ''), Image.fromarray(mk))]
    vc = (100, 0, 948, 760); w, h = vc[2] - vc[0], vc[3] - vc[1]
    out = Image.new('RGB', (2 * (w + 8), 2 * (h + 30)), 'white'); d = ImageDraw.Draw(out)
    for i, (t_, im) in enumerate(tiles):
        x, y = (i % 2) * (w + 8), (i // 2) * (h + 30)
        out.paste(im.crop(vc), (x, y + 28)); d.text((x + 4, y + 5), t_, font=MK.F(17), fill=(40, 40, 60))
    out.save(SAL / 'coleta-con-gorrito-b.png', optimize=True)
    info['fuentes_sin_cambios'] = antes == {k: sha(RAIZ / k) for k in antes}
    (SAL / 'comprobaciones.json').write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in info.items() if k not in ('sha256_fuentes', 'comprobaciones_b')}, ensure_ascii=False))
