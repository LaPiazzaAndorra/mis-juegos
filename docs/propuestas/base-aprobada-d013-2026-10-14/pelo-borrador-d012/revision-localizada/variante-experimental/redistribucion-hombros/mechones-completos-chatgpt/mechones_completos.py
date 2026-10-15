#!/usr/bin/env python3
"""
ALTERNATIVA (pendiente de revisión) a la propuesta C: el mechón COMPLETO de cada hombro tomado de la imagen de
ChatGPT (../para-chatgpt-mechones/resultado-chatgpt-mechones-1.png, sin modificar), unido a C en las sombras
naturales entre rizos. C (../pelo-delante-mechones-c.png) no se modifica: la alternativa es otra capa de delante.

  1. Zona de cada hombro: la tela del hombro y la manga (vestido opaco, y < 800, dentro de dos cajas) y una franja de
     hasta 45 px de pelo alrededor. No entra la cara, ni el pelo de la cabeza (y < 575), ni nada fuera de la silueta
     de la melena: solo se cambia pelo que ya había (por pelo) o tela (por pelo).
  2. Unión: dentro de la franja, la costura entre «pelo de ChatGPT» y «pelo de C» se busca por cuencas (watershed)
     sobre un coste = diferencia de color entre ambas imágenes + luminosidad. Así pasa por sombras oscuras en las que
     las dos imágenes coinciden. 3 px de fundido de color a lo largo de la costura.
  3. Solo pelo: de ChatGPT se toman únicamente los píxeles de pelo (tono > 40° con croma > 10, u oscuros L < 50).
     Sobre la tela, donde ChatGPT no tiene pelo, se ve el vestido. No se incorpora piel ni tela de la imagen generada.
  4. Comprobaciones: costura (diferencia media en la unión), fuera de la zona idéntico a C, silueta exterior de la
     melena igual, cara sin pelo encima, sin píxeles de tono piel o tela tomados.

Uso (desde la raíz):
  python3 docs/propuestas/base-aprobada-d013-2026-10-14/pelo-borrador-d012/revision-localizada/variante-experimental/redistribucion-hombros/mechones-completos-chatgpt/mechones_completos.py
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd
from skimage.segmentation import watershed

AQUI = Path(__file__).resolve().parent; RH = AQUI.parent
sys.path[:0] = [str(RH)]
import mechones_hombros as MH   # noqa: E402

RP = MH.RP; MV = RP.MV; R = RP.R; H, W, YY, XX = RP.H, RP.W, RP.YY, RP.XX
CAJAS = [(240, 575, 420, 880), (540, 575, 740, 880)]
FRANJA = 45
FUNDIDO = 3.0
EDITADA = RH / 'para-chatgpt-mechones' / 'resultado-chatgpt-mechones-1.png'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


if __name__ == '__main__':
    rutas = dict(editada=EDITADA, c=RH / 'pelo-delante-mechones-c.png', pelo_detras=RP.VAR / 'pelo-variante-sin-mechon-detras.png',
                 vestido=RP.VES / 'opcion-b' / 'vestido-opcion-b-axilas-completadas.png', base=MV.BASE / 'base-transparencia-corregida.png',
                 sin_ojos=MV.BASE / 'sin-ojos' / 'base-sin-ojos-propuesta-v3.png',
                 abiertos=MV.BASE / 'ojos-abiertos' / 'capa-ojos-abiertos-prueba-v3-color-EXPERIMENTAL.png',
                 cerrados=MV.BASE / 'ojos-cerrados' / 'capa-ojos-cerrados-prueba-v21.png', brazos=RP.VES / 'montaje' / 'brazos-delante-copiados-de-la-base.png')
    antes = {k: sha(p) for k, p in rutas.items()}
    x0, y0, x1, y1 = MH.RECORTE; w, h = x1 - x0, y1 - y0
    ed = np.zeros((H, W, 3), np.uint8); ed[y0:y1, x0:x1] = np.array(Image.open(EDITADA).convert('RGB').resize((w, h), Image.LANCZOS))
    dc, det, ves, base, sin, ab, ce, br = (MV.abrir(rutas[k]) for k in ('c', 'pelo_detras', 'vestido', 'base', 'sin_ojos', 'abiertos', 'cerrados', 'brazos'))
    mc = MV.montar([det, sin, ab, ves, br, dc]); mcr = np.array(R.MP.blanco(mc)).astype(float)
    lab = R.lab_rgba(np.dstack([ed, np.full((H, W), 255, np.uint8)])); L = lab[..., 0]
    hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1])); C = np.hypot(lab[..., 1], lab[..., 2])
    pelo_ed = ((hue > 40) & (C > 10)) | (L < 50)
    Z = R.zonas(base[..., 3]); cara = nd.binary_dilation(Z['cara_baja'], iterations=4)
    pelo_c = R.MP.comp(det, dc)[..., 3] > 100
    caja = np.zeros((H, W), bool)
    for a, b, c, d in CAJAS:
        caja[b:d, a:c] = True
    tela = (ves[..., 3] > 200) & caja & (YY < 800)
    franja = nd.binary_dilation(tela, iterations=FRANJA) & ~tela & caja & pelo_c & ~cara
    coste = nd.gaussian_filter(np.abs(ed.astype(float) - mcr).max(-1) + np.minimum(L, 100), 1.0)
    borde = (nd.binary_dilation(tela, iterations=FRANJA + 1) & ~nd.binary_dilation(tela, iterations=FRANJA)) | (~caja & nd.binary_dilation(caja, iterations=1))
    mk = np.zeros((H, W), int); mk[tela] = 1; mk[borde & ~tela] = 2
    lbl = watershed(coste.max() - coste, mk, mask=tela | franja | borde)
    lado = lbl == 1
    toma = lado & pelo_ed & ~cara
    toma = nd.binary_opening(toma, np.ones((2, 2)))
    lb, n = nd.label(toma); sz = nd.sum(toma, lb, range(1, n + 1)); toma = np.isin(lb, 1 + np.flatnonzero(sz > 40))
    costura = lado & nd.binary_dilation(lbl == 2, iterations=1) & franja
    nueva = dc.copy()
    nueva[lado & ~toma & tela] = 0                                   # sobre la tela, donde ChatGPT no tiene pelo: vestido
    peso = np.clip(nd.distance_transform_edt(lado) / FUNDIDO, 0, 1)
    pelo_mc = (mc[..., 3] > 0) & ~tela
    col = ed.astype(float) * peso[..., None] + mcr * (1 - peso[..., None])
    col = np.where(pelo_mc[..., None], col, ed.astype(float))
    nueva[toma, :3] = np.round(col[toma]).astype(np.uint8); nueva[toma, 3] = 255
    Image.fromarray(nueva, 'RGBA').save(AQUI / 'pelo-delante-mechones-completos.png', optimize=True)
    zona = lado & (tela | franja)
    Image.fromarray((zona * 255).astype(np.uint8), 'L').save(AQUI / 'zona-tomada-de-chatgpt.png', optimize=True)
    mn = MV.montar([det, sin, ab, ves, br, nueva])
    Image.fromarray(mn, 'RGBA').save(AQUI / 'montaje-mechones-completos.png', optimize=True)
    Image.fromarray(MV.montar([det, sin, ce, ves, br, nueva]), 'RGBA').save(AQUI / 'montaje-mechones-completos-cerrados.png', optimize=True)

    # --- comprobaciones ------------------------------------------------------------------------------------
    piel_tela = toma & tela & ~(((hue > 40) & (C > 10)) | (L < 50))
    cara_op = Z['cara_baja'] & (base[..., 3] == 255) & ~(ves[..., 3] > 200)
    fuera = ~zona
    silueta_c = mc[..., 3] > 0; silueta_n = mn[..., 3] > 0
    dif_costura = np.abs(np.array(R.MP.blanco(mn)).astype(float) - mcr).max(-1)
    comp = dict(fuentes_sin_cambios=None, sha256_fuentes=antes, px_tomados_de_chatgpt=int(toma.sum()),
                px_de_tela_que_ahora_tapa_el_pelo=int((toma & tela & ~(dc[..., 3] > 128)).sum()),
                px_de_pelo_de_c_que_ahora_es_vestido=int((lado & ~toma & tela & (dc[..., 3] > 128)).sum()),
                costura=dict(px=int(costura.sum()), diferencia_media_chatgpt_vs_c=round(float(np.abs(ed.astype(float) - mcr).max(-1)[costura].mean()), 1),
                             luminosidad_media=round(float(L[costura].mean()), 1)),
                fuera_de_la_zona_identico_a_c=bool((nueva == dc)[fuera].all()),
                silueta_exterior_igual=bool((silueta_c == silueta_n).all()),
                pelo_sobre_cara_orejas_cuello_px=int(((nueva[..., 3] > 0) & cara_op & ~(dc[..., 3] > 0)).sum()),
                px_tomados_que_no_son_pelo=int(piel_tela.sum()), capa_de_detras='sin cambios', propuesta_c='sin cambios')
    comp['fuentes_sin_cambios'] = antes == {k: sha(p) for k, p in rutas.items()}

    # --- vistas ----------------------------------------------------------------------------------------------
    F = R.MK.F
    a_ = np.array(R.MP.blanco(mc)); b_ = np.array(R.MP.blanco(mn)); c_ = b_.copy()
    c_[costura] = (0, 230, 0); zb = zona & ~nd.binary_erosion(zona); c_[zb & ~costura] = (0, 160, 255)
    filas = []
    for t, cz in (('Hombro izquierdo', (230, 560, 440, 880)), ('Hombro derecho', (520, 560, 750, 880))):
        ims = [Image.fromarray(x[cz[1]:cz[3], cz[0]:cz[2]]).resize(((cz[2] - cz[0]) * 2, (cz[3] - cz[1]) * 2), Image.LANCZOS) for x in (a_, ed, b_, c_)]
        f = Image.new('RGB', (4 * (ims[0].width + 10), ims[0].height + 26), 'white'); d = ImageDraw.Draw(f)
        for j, (tt, im) in enumerate(zip((f'{t} · antes (C) ×2', 'imagen de ChatGPT', 'alternativa ×2', 'verde: costura · azul: límite de la zona'), ims)):
            f.paste(im, (j * (im.width + 10), 24)); d.text((j * (im.width + 10) + 2, 4), tt, font=F(15), fill=(40, 40, 60))
        filas.append(f)
    out = Image.new('RGB', (max(f.width for f in filas), sum(f.height + 8 for f in filas)), 'white'); y = 0
    for f in filas:
        out.paste(f, (0, y)); y += f.height + 8
    out.save(AQUI / 'antes-despues-hombros.png', optimize=True)
    caja_v = (150, 480, 800, 1080)
    pan = [('Antes · propuesta C', R.MP.blanco(mc)), ('Alternativa · mechones completos', R.MP.blanco(mn))]
    fr = Image.new('RGB', (2 * 660, 630), 'white'); d = ImageDraw.Draw(fr)
    for i, (t, p) in enumerate(pan):
        fr.paste(p.crop(caja_v), (i * 660, 28)); d.text((i * 660 + 4, 6), t, font=F(18), fill=(40, 40, 60))
    fr.save(AQUI / 'antes-despues.png', optimize=True)
    (AQUI / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: v for k, v in comp.items() if k != 'sha256_fuentes'}, ensure_ascii=False))
