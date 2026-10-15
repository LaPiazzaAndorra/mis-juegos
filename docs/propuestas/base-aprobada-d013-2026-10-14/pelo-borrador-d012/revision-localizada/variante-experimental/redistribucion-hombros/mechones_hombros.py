#!/usr/bin/env python3
"""
PROPUESTA C · pelo B: un mechón continuo por delante de cada hombro, desde la melena de arriba hasta los rizos del
pecho, que tapa la manga en parte.

Parte de la propuesta B (pelo-delante-redistribuido-b.png, sin cambios). Añade delante, ENTEROS, los rizos del pelo
existente (pelo B detrás + delante, mismas imágenes) que forman una cadena continua sobre cada hombro. Los rizos se
separan por sus sombras naturales (los mismos límites que en redistribuir_pelo.py, aquí en y 480–1060), así que el
borde del mechón sigue la curva del pelo y no el contorno de la ropa.

Cadena elegida (un punto por rizo, de arriba abajo), revisada a mano sobre la imagen:
  · izquierda: melena superior (277, 551) → hombro (322, 614) → manga (332, 673 · 332, 721 · 337, 748)
               → bajo de la manga (355, 782) → pecho (340, 807 · 325, 861)
  · derecha:   melena superior (676, 590 · 634, 613) → manga (670, 671 · 680, 701 · 702, 756)
               → pecho (641, 798 · 685, 808 · 694, 869)
No se dibuja, mueve, escala ni recolorea nada. Excepciones: el pelo RECONSTRUIDO (copiado al rehacer el cuello, que no
es pelo original) no pasa delante, y tampoco el pelo que caería sobre la cara, las orejas o el cuello visibles.
Donde el mechón queda sin pelo original sobre el vestido (allí había pelo reconstruido), la zona se marca para
ilustrarla con ChatGPT (falta-pelo-mechones.png, mascara-falta-pelo-mechones.png y para-chatgpt-mechones/).

Uso (desde la raíz):
  python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/revision-localizada/variante-experimental/redistribucion-hombros/mechones_hombros.py
"""
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
import redistribuir_pelo as RP

AQUI = RP.AQUI; MV = RP.MV; R = RP.R; H, W, YY, XX = RP.H, RP.W, RP.YY, RP.XX
CADENA = {'izquierdo': [(277, 551), (322, 614), (332, 673), (332, 721), (337, 748), (355, 782), (340, 807), (325, 861)],
          'derecho': [(676, 590), (634, 613), (670, 671), (680, 701), (702, 756), (641, 798), (685, 808), (694, 869)]}
RECORTE = (209, 440, 749, 1250)                                  # 540 × 810 = 2:3, para ChatGPT
TAM_CHATGPT = (1024, 1536)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    rutas = dict(pelo_detras=RP.VAR / 'pelo-variante-sin-mechon-detras.png', pelo_delante=RP.VAR / 'pelo-variante-sin-mechon-delante.png',
                 propuesta_b=AQUI / 'pelo-delante-redistribuido-b.png', reconstruido=RP.REV / 'mascara-zonas-reconstruidas.png',
                 base=MV.BASE / 'base-transparencia-corregida.png', sin_ojos=MV.BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
                 abiertos=MV.BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
                 cerrados=MV.BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png',
                 vestido=RP.VES / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png', brazos=RP.VES / 'montaje' / 'brazos-delante-copiados-de-la-base.png')
    antes = {k: sha(p) for k, p in rutas.items()}
    det, dela, db, base, sin, ab, ce, ves, brazos = (MV.abrir(rutas[k]) for k in
        ('pelo_detras', 'pelo_delante', 'propuesta_b', 'base', 'sin_ojos', 'abiertos', 'cerrados', 'vestido', 'brazos'))
    reco = nd.binary_dilation(np.array(Image.open(rutas['reconstruido'])) > 0, iterations=1)
    full = R.MP.comp(det, dela)
    zona = (XX >= 150) & (XX < 800) & (YY >= 480) & (YY < 1060)
    reg, pelo = RP.rizos(full, zona)
    Z = R.zonas(base[..., 3]); cara = nd.binary_dilation(Z['cara_baja'], iterations=6) & ~(ves[..., 3] > 200)
    mech = np.zeros((H, W), bool); rizos_info = {}
    for lado, pts in CADENA.items():
        rizos_info[lado] = []
        for x, y in pts:
            i = int(reg[y, x]); r = reg == i; mech |= r
            rizos_info[lado].append(dict(punto=[x, y], rizo=i, px=int(r.sum()), reconstruido_pct=round(float(reco[r].mean()) * 100)))
    en_b = db[..., 3] > 0
    pasa = mech & (full[..., 3] > 0) & ~reco & ~cara & ~en_b
    dc = db.copy(); dc[pasa] = full[pasa]
    Image.fromarray(dc, 'RGBA').save(AQUI / 'pelo-delante-mechones-c.png', optimize=True)
    falta = mech & reco & (ves[..., 3] > 200) & ~cara & ~en_b
    falta = nd.binary_opening(falta, np.ones((2, 2)))
    lb, n = nd.label(falta); sz = nd.sum(falta, lb, range(1, n + 1)); falta = np.isin(lb, 1 + np.flatnonzero(sz >= 20))
    Image.fromarray((falta * 255).astype(np.uint8), 'L').save(AQUI / 'mascara-falta-pelo-mechones.png', optimize=True)

    mb, mc = MV.montar([det, sin, ab, ves, brazos, db]), MV.montar([det, sin, ab, ves, brazos, dc])
    m0 = MV.montar([det, sin, ab, ves, brazos, dela])
    Image.fromarray(mc, 'RGBA').save(AQUI / 'montaje-vestido-mechones-c.png', optimize=True)
    Image.fromarray(MV.montar([det, sin, ce, ves, brazos, dc]), 'RGBA').save(AQUI / 'montaje-vestido-mechones-c-cerrados.png', optimize=True)
    F = R.MK.F
    # comparación: antes · B · C, entera y por hombros ×2
    pan = [('Antes (pelo B)', R.MP.blanco(m0)), ('Propuesta B', R.MP.blanco(mb)), ('Propuesta C · mechones', R.MP.blanco(mc))]
    caja = (150, 480, 800, 1080); ps = [p.crop(caja) for _, p in pan]
    fr = Image.new('RGB', (3 * 660, 630), 'white'); d = ImageDraw.Draw(fr)
    for i, ((t, _), p) in enumerate(zip(pan, ps)):
        fr.paste(p, (i * 660, 28)); d.text((i * 660 + 4, 6), t, font=F(18), fill=(40, 40, 60))
    fr.save(AQUI / 'comparacion-mechones.png', optimize=True)
    filas = []
    for t, cz in (('Hombro izquierdo', (220, 520, 440, 900)), ('Hombro derecho', (510, 520, 730, 900))):
        im = [p.crop(cz).resize(((cz[2] - cz[0]) * 2, (cz[3] - cz[1]) * 2), Image.LANCZOS) for _, p in pan]
        f = Image.new('RGB', (3 * im[0].width + 20, im[0].height + 26), 'white'); dd = ImageDraw.Draw(f)
        for j, ((tt, _), p) in enumerate(zip(pan, im)):
            f.paste(p, (j * (p.width + 10), 24)); dd.text((j * (p.width + 10) + 2, 4), f'{t} · {tt} ×2', font=F(15), fill=(40, 40, 60))
        filas.append(f)
    out = Image.new('RGB', (filas[0].width, sum(f.height + 8 for f in filas)), 'white'); y = 0
    for f in filas:
        out.paste(f, (0, y)); y += f.height + 8
    out.save(AQUI / 'ampliacion-mechones.png', optimize=True)
    # mapa: mechón (verde), puntos de la cadena, falta pelo (rojo)
    o = np.array(R.MP.blanco(mc)).astype(float)
    e = (mech & (full[..., 3] > 0) & ~cara) & ~nd.binary_erosion(mech & (full[..., 3] > 0) & ~cara, iterations=2); o[e] = (0, 220, 0)
    o[falta] = o[falta] * 0.2 + np.array([230, 20, 20]) * 0.8
    im = Image.fromarray(o.astype(np.uint8)); dm = ImageDraw.Draw(im)
    for pts in CADENA.values():
        dm.line(pts, fill=(255, 220, 0), width=3)
        for x, y in pts:
            dm.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(255, 220, 0))
    dm.rectangle((154, 484, 620, 560), fill=(255, 255, 255))
    for i, (col, t) in enumerate((((0, 220, 0), 'contorno del mechón (rizos enteros que pasan delante)'), ((255, 220, 0), 'cadena de rizos, de arriba abajo'),
                                  ((230, 20, 20), 'falta pelo original: ilustrar con ChatGPT'))):
        dm.rectangle((160, 490 + 24 * i, 176, 506 + 24 * i), fill=col); dm.text((182, 490 + 24 * i), t, font=F(15), fill=(40, 40, 60))
    im.crop(caja).save(AQUI / 'mapa-mechones.png', optimize=True)
    zz = []
    for cz in ((280, 560, 400, 680), (560, 560, 680, 680)):
        a = np.array(R.MP.blanco(mc)); b = a.copy(); b[falta] = (230, 20, 20)
        zz.append(Image.fromarray(np.hstack([a[cz[1]:cz[3], cz[0]:cz[2]], b[cz[1]:cz[3], cz[0]:cz[2]]])).resize((960, 480), Image.NEAREST))
    fz = Image.new('RGB', (960, 2 * 510), 'white'); dz = ImageDraw.Draw(fz)
    for i, (t, z) in enumerate(zip(('Hombro izquierdo ×4', 'Hombro derecho ×4'), zz)):
        dz.text((4, i * 510 + 6), t + ' · rojo: falta pelo original (ilustrar con ChatGPT)', font=F(16), fill=(40, 40, 60)); fz.paste(z, (0, i * 510 + 28))
    fz.save(AQUI / 'falta-pelo-mechones.png', optimize=True)
    # paquete para ChatGPT: montaje recortado 2:3, máscara y guía
    P = AQUI / 'para-chatgpt-mechones'; P.mkdir(exist_ok=True)
    rec = R.MP.blanco(mc).crop(RECORTE).resize(TAM_CHATGPT, Image.LANCZOS); rec.save(P / 'recorte-para-chatgpt.png', optimize=True)
    mr = Image.fromarray((falta * 255).astype(np.uint8), 'L').crop(RECORTE).resize(TAM_CHATGPT, Image.NEAREST); mr.save(P / 'mascara-recorte.png', optimize=True)
    g = np.array(rec).astype(float); mm = np.array(mr) > 0; g[mm] = g[mm] * 0.3 + np.array([0, 210, 255]) * 0.7
    gi = Image.fromarray(g.astype(np.uint8)); ImageDraw.Draw(gi).text((14, 14), 'Azul: completar el mechón de pelo que cae por delante del hombro. Nada más cambia.', font=F(26), fill=(0, 80, 200))
    gi.save(P / 'guia-donde-ilustrar.png', optimize=True)

    cara_op = Z['cara_baja'] & (base[..., 3] == 255) & ~(ves[..., 3] > 200)
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes, cadena=rizos_info, px_que_pasan_delante=int(pasa.sum()),
                propuesta_b_intacta=bool((dc[en_b] == db[en_b]).all()), colores_identicos_al_pelo_existente=bool((dc[pasa] == full[pasa]).all()),
                pelo_reconstruido_delante_px=int(((dc[..., 3] > 0) & reco & ~en_b).sum()),
                pelo_delante_sobre_cara_orejas_cuello_visibles_px=int(((dc[..., 3] > 0) & cara_op & ~en_b).sum()),
                manga_izquierda_tapada_pct=None, manga_derecha_tapada_pct=None, falta_pelo_px=int(falta.sum()), capa_de_detras='sin cambios')
    mangas = (ves[..., 3] > 200) & (YY >= 610) & (YY < 800) & (((XX >= 255) & (XX < 395)) | ((XX >= 575) & (XX < 720)))
    for lado, cond in (('izquierda', XX < 479), ('derecha', XX >= 479)):
        mm_ = mangas & cond
        comp[f'manga_{lado}_tapada_pct'] = dict(antes_b=round(float((db[..., 3] > 128)[mm_].mean()) * 100), c=round(float((dc[..., 3] > 128)[mm_].mean()) * 100))
    comp['fuentes_sin_cambios'] = antes == {k: sha(p) for k, p in rutas.items()}
    (AQUI / 'comprobaciones-mechones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k not in ('sha256_fuentes', 'cadena')}, ensure_ascii=False))
