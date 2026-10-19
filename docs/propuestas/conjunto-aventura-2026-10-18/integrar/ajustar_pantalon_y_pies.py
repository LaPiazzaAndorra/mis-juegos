#!/usr/bin/env python3
"""
Encaje del pantalón en cintura y caderas, y de cada unión pierna–calcetín–bota (D-027, candidato), en COPIAS
(integrar/ropa-d/); los originales y las copias anteriores no cambian. Se parte de la versión limpia (ropa-b, ropa-c,
piernas-b2c).

Qué se encontró (sobre nuestra base, sin pelo):
1. Cadera izquierda y esquina del bolsillo: al separar la imagen, la zona de la mochila (x < 338) se quedó con el lateral
   izquierdo del pantalón (su borde real está en x ≈ 322–330, junto a la mochila) y con la esquina de arriba del bolsillo.
   Se vuelven a tomar DE LA IMAGEN APROBADA, con la zona de la mochila acotada a x < 322 (el borde que se ve en la imagen):
   686 px reales del pantalón; nada inventado, y lo que ya había no cambia.
2. Cintura: en la imagen aprobada el chaleco tapaba las esquinas de arriba del pantalón; con el chaleco nuevo (más
   estrecho) se ven sus cortes (a la derecha se veía la camiseta entre el chaleco y el pantalón; a la izquierda, picos
   bajo el borde del chaleco). Se completa SOLO lo que se ve (no bajo el chaleco ni sobre los brazos), hasta el contorno
   del cuerpo y, abajo, hasta el ancho del pantalón en la cadera, con su propia tela de justo debajo, reflejada en cada
   columna (unión continua; la costura lateral, en su columna).
3. Calcetines: nuestras piernas son 2–6 px más anchas por dentro que las de la imagen, y la pierna asomaba por el lado del
   calcetín. Cada calcetín se ajusta fila a fila al ancho de nuestra pierna (+1 px por lado) con un cambio de escala
   horizontal suave (como mucho un 6 %), sin estirar sus bordes (estirarlos dejaba una franja borrosa).
4. Botas: la bota derecha llevaba pegado, por su lado de dentro, un trozo de la sombra del suelo de la imagen (cortado,
   flotando entre las dos botas). Se quita; la bota no cambia.

Uso (desde la raíz): python3 docs/propuestas/conjunto-aventura-2026-10-18/integrar/ajustar_pantalon_y_pies.py
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

AQUI = Path(__file__).resolve().parent; sys.path.insert(0, str(AQUI))
import retocar_bordes as RB   # noqa: E402
PT, A, CJ = RB.PT, RB.A, RB.CJ; H, W = RB.H, RB.W; YY, XX = RB.YY, RB.XX
CREMA = (253, 250, 245); SAL = AQUI / 'ropa-d'
BASE = AQUI / 'piernas-b2c' / 'base-piernas-sin-mallas.png'


def tramos(m):
    x = np.flatnonzero(m)
    if not len(x):
        return []
    c = np.flatnonzero(np.diff(x) > 1)
    return list(zip(np.r_[x[0], x[c + 1]].tolist(), np.r_[x[c], x[-1]].tolist()))


def capas(pan, cal, bot, cam=None, cha=None):
    cam = PT.abrir(AQUI / 'ropa-c' / 'camiseta.png') if cam is None else cam
    return [PT.abrir(BASE), PT.abrir(PT.OJOS['marron']), cal, bot, cam, pan, (PT.abrir(AQUI / 'ropa' / 'chaleco.png') if cha is None else cha), PT.abrir(PT.MANOS)]


def montar(lista):
    f = Image.new('RGBA', (W, H), CREMA + (255,))
    for c in lista:
        f.alpha_composite(Image.fromarray(c, 'RGBA'))
    return np.array(f.convert('RGB'))


if __name__ == '__main__':
    base = PT.abrir(BASE); pan0 = PT.abrir(AQUI / 'ropa-b' / 'pantalon.png')
    cal0 = PT.abrir(CJ / 'capas' / 'calcetines.png'); bot0 = PT.abrir(CJ / 'capas' / 'botas.png')
    cha = PT.abrir(AQUI / 'ropa' / 'chaleco.png'); man = PT.abrir(PT.MANOS)
    # 1. esquina del bolsillo, de la imagen aprobada (zona de la mochila acotada)
    rgb = np.array(Image.open(A.REF).convert('RGB')); lab = PT.lab_de(np.dstack([rgb, np.full(rgb.shape[:2], 255, np.uint8)])).astype(float)
    zonas = A.MOCHILA_ZONAS; A.MOCHILA_ZONAS = [(195, 780, 322, 1002)]
    reg, _ = A.regiones(lab); A.MOCHILA_ZONAS = zonas
    p2 = A.CO.suave(reg == A.PANTALON, rgb, reg != A.PANTALON)
    porig = PT.abrir(CJ / 'capas' / 'pantalon.png')
    bolsillo = (p2[..., 3] > porig[..., 3]) & (XX < 345) & (YY > 940) & (YY < 1015)   # lo que gana el pantalón en la cadera izquierda
    pan = pan0.copy(); pan[bolsillo] = p2[bolsillo]
    # 2. cintura: contorno que tiene que cubrir el pantalón (torso de la base hasta y = 950; luego, hasta su ancho en la cadera)
    Y0, Y1, Y2 = 880, 950, 972
    izq, der = {}, {}
    for y in range(Y0, Y2 + 1):
        t = [s for s in tramos(base[y, :, 3] > 128) if s[1] - s[0] > 150]
        if t:
            izq[y], der[y] = t[0][0] - 1, t[0][1] + 1
    pz, pd = min(np.flatnonzero(pan0[Y2 + 3, :, 3] > 200)), max(np.flatnonzero(pan0[Y2 + 3, :, 3] > 200))
    for y in range(Y1, Y2 + 1):
        f = (y - Y1) / (Y2 - Y1); izq[y] = round(izq[y] * (1 - f) + pz * f); der[y] = round(der[y] * (1 - f) + pd * f)
    dentro = np.zeros((H, W), bool)
    for y in izq:
        dentro[y, izq[y]:der[y] + 1] = True
    cubierto = (pan[..., 3] > 200) | (cha[..., 3] > 200) | (man[..., 3] > 128)
    brazo = np.zeros((H, W), bool)               # los brazos de la base (tramos de los lados), que van delante
    for y in izq:
        for s in tramos(base[y, :, 3] > 128):
            if s[1] - s[0] <= 150:
                brazo[y, s[0]:s[1] + 1] = True
    cintura = dentro & ~cubierto & ~brazo
    cintura = nd.binary_opening(cintura, iterations=1) | (cintura & nd.binary_dilation(cubierto, iterations=1))
    # tela: en cada columna, la del pantalón de justo debajo, reflejada en el borde de abajo del hueco
    tela = pan.copy()
    SALTO = 8
    for x in np.unique(np.where(cintura)[1]):
        ys = np.where(cintura[:, x])[0]; yb = ys.max()
        for y in ys:
            src = 2 * yb + 1 + SALTO - y   # se salta la franja superior (restos de pespunte del chaleco)
            if src < H and pan[src, x, 3] > 0:
                tela[y, x] = pan[src, x]
            else:
                cintura[y, x] = False
    pan = np.where(cintura[..., None], tela, pan).astype(np.uint8)
    # borde de fuera del relleno suavizado (sin escalones): medio transparente donde toca el fondo
    fuera = (pan[..., 3] == 0) & ~cubierto & ~brazo & ~(base[..., 3] > 128)
    canto = cintura & nd.binary_dilation(fuera, iterations=1)
    pan[canto, 3] = 150
    # 2b. chaleco: el canto semitransparente de abajo trae un halo claro (del fondo de la imagen generada) que se ve
    #     como una raya clara sobre el pantalón; se le da el color del píxel opaco más cercano, sin cambiar su alfa
    chal = cha.copy(); lc = PT.lab_de(cha)
    opaco = cha[..., 3] == 255
    d, (iy, ix) = nd.distance_transform_edt(~opaco, return_indices=True)
    halo = (cha[..., 3] > 0) & ~opaco & (d <= 3) & (YY > 900) & (lc[..., 0] > lc[iy, ix, 0] + 4)
    chal[halo, :3] = cha[iy[halo], ix[halo], :3]
    # 3. calcetines: cada uno se ajusta, fila a fila, al ancho de NUESTRA pierna (sin estirar sus bordes): se lleva su
    #    tramo [S0, S1] al tramo [min(S0, pierna-1), max(S1, pierna+1)] con un cambio de escala suave de una fila a otra
    #    (los canalés siguen rectos y continuos); la parte de arriba (borde del puño) y la de abajo (dentro de la bota) usan
    #    el ajuste de la fila completa más cercana. Solo cambian el calcetín y su borde; la pierna y la bota, no.
    cal = cal0.copy(); prem = cal0[..., :3].astype(float) * cal0[..., 3:] / 255.; alf = cal0[..., 3].astype(float)
    escalas = {}
    for lo, hi in ((300, 480), (480, 660)):
        filas = {}
        for y in range(1290, 1360):
            pi = [s for s in tramos(base[y, lo:hi, 3] > 128) if s[1] - s[0] > 40]
            cs = tramos(cal0[y, lo:hi, 3] > 128)
            if pi and cs and (max(c[1] for c in cs) - min(c[0] for c in cs)) >= 0.9 * (pi[0][1] - pi[0][0]) and len(cs) == 1:
                (a, b), (c0, c1) = pi[0], cs[0]
                filas[y] = (c0, c1, min(c0, a - 1), max(c1, b + 1))
        ys = sorted(filas); y0, y1 = ys[0], ys[-1]
        tabla = np.array([filas[min(max(y, y0), y1)] if min(max(y, y0), y1) in filas else filas[min(ys, key=lambda k: abs(k - y))]
                          for y in range(1290, 1360)], float)
        tabla = nd.gaussian_filter1d(tabla, 2.5, axis=0, mode='nearest')
        for k, y in enumerate(range(1290, 1360)):
            S0, S1, T0, T1 = tabla[k]
            xs = np.arange(int(T0) - 3, int(np.ceil(T1)) + 4)
            src = S0 + (xs - T0) * (S1 - S0) / (T1 - T0)
            for ch in range(3):
                cal[y, xs + lo, ch] = 0
            pa = np.interp(src, np.arange(hi - lo), alf[y, lo:hi])
            pc = [np.interp(src, np.arange(hi - lo), prem[y, lo:hi, ch]) for ch in range(3)]
            cal[y, xs + lo, 3] = np.clip(np.round(pa), 0, 255)
            for ch in range(3):
                cal[y, xs + lo, ch] = np.clip(np.round(np.where(pa > 0, pc[ch] * 255 / np.maximum(pa, 1e-6), 0)), 0, 255)
        # dentro de la bota (debajo de la última fila completa) no puede abrirse ningún hueco: se queda lo más opaco
        aba = np.zeros((H, W), bool); aba[y1 + 1:1360, lo:hi] = True
        cal = np.where((aba & (cal0[..., 3] > cal[..., 3]))[..., None], cal0, cal)
        k0, k1 = y0 - 1290, y1 - 1290 + 1
        escalas['izquierda' if lo == 300 else 'derecha'] = round(float(((tabla[k0:k1, 3] - tabla[k0:k1, 2]) / (tabla[k0:k1, 1] - tabla[k0:k1, 0])).max()), 3)
    calce = (cal != cal0).any(-1)
    # 4. botas: sin el trozo suelto de sombra del suelo entre las dos botas
    lb = PT.lab_de(bot0).astype(float)   # (L de 0 a 255) la sombra es clara y poco saturada (L≈212, b≈12); la bota, L≈160, b≈35
    zona = (bot0[..., 3] > 0) & (YY > 1485) & (YY < 1550) & (XX > 455) & (XX < 535)
    sombra = zona & (lb[..., 0] > 185) & (lb[..., 2] < 20)
    sombra = nd.binary_dilation(sombra, iterations=2) & zona & (lb[..., 0] > 140) & (lb[..., 2] < 26)
    sombra |= nd.binary_dilation(sombra, iterations=1) & zona & (bot0[..., 3] < 200)   # su canto suave
    bot = bot0.copy(); bot[sombra] = 0
    SAL.mkdir(exist_ok=True)
    for n, c in (('pantalon.png', pan), ('calcetines.png', cal), ('botas.png', bot), ('chaleco.png', chal)):
        Image.fromarray(c, 'RGBA').save(SAL / n, optimize=True)
    masc = dict(cadera=bolsillo, cintura=cintura, halo_chaleco=halo, calcetines=calce, sombra=sombra)
    for n, m in masc.items():
        Image.fromarray(np.where(m, 255, 0).astype(np.uint8)).save(SAL / f'mascara-{n}.png', optimize=True)
    # comprobaciones
    def caja(m):
        ys, xs = np.where(m); return [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())] if len(xs) else None
    pierna_fuera = lambda c: int(sum(((base[y, :, 3] > 128) & (c[y, :, 3] < 128) & (bot0[y, :, 3] < 128)).sum() for y in range(1311, 1360)))   # (desde la 1311, el puño ya es recto)
    hueco_cintura = lambda p: int((dentro & ~((p[..., 3] > 200) | (cha[..., 3] > 200) | (man[..., 3] > 128)) & ~brazo).sum())
    comp = dict(cadera_izquierda_y_bolsillo=dict(px=int(bolsillo.sum()), caja=caja(bolsillo), de_la_imagen_aprobada=True),
                cintura=dict(px=int(cintura.sum()), caja=caja(cintura), hueco_antes_px=hueco_cintura(pan0), hueco_despues_px=hueco_cintura(pan)),
                calcetines=dict(px=int(calce.sum()), caja=caja(calce), escala_horizontal_max=escalas, pierna_al_lado_del_calcetin_antes_px=pierna_fuera(cal0), despues_px=pierna_fuera(cal)),
                chaleco=dict(halo_px=int(halo.sum()), caja=caja(halo), alfa_igual=bool((chal[..., 3] == cha[..., 3]).all())),
                botas=dict(sombra_quitada_px=int(sombra.sum()), caja=caja(sombra)),
                cambios_solo_en_las_mascaras=bool((pan[~(bolsillo | cintura)] == pan0[~(bolsillo | cintura)]).all() and (cal[~calce] == cal0[~calce]).all() and (bot[~sombra] == bot0[~sombra]).all() and (chal[~halo] == cha[~halo]).all()))
    (SAL / 'comprobaciones.json').write_text(json.dumps(comp, ensure_ascii=False, indent=1), encoding='utf-8')
    antes, despues = montar(capas(pan0, cal0, bot0)), montar(capas(pan, cal, bot, cha=chal))
    Image.fromarray(despues).save(SAL / 'montaje-sin-pelo.png', optimize=True)
    F = PT.MK.F(18); hojas = []
    for t, c, esc in (('Cintura y caderas', (300, 860, 670, 1080), 2), ('Piernas, calcetines y botas', (300, 1260, 670, 1560), 2)):
        w, h = (c[2] - c[0]) * esc, (c[3] - c[1]) * esc; o = Image.new('RGB', (2 * w + 16, h + 34), 'white'); d = ImageDraw.Draw(o)
        for i, (im, n) in enumerate(((antes, 'antes'), (despues, 'después'))):
            o.paste(Image.fromarray(im).crop(c).resize((w, h), Image.LANCZOS), (i * (w + 16), 34)); d.text((i * (w + 16) + 6, 8), f'{t} · {n}', font=F, fill=(40, 40, 60))
        hojas.append(o)
    ent = (60, 560, 900, 1600); w, h = (ent[2] - ent[0]) // 2 * 2 // 2, (ent[3] - ent[1]) // 2
    o = Image.new('RGB', (2 * w + 16, h + 34), 'white'); d = ImageDraw.Draw(o)
    for i, (im, n) in enumerate(((antes, 'antes'), (despues, 'después'))):
        o.paste(Image.fromarray(im).crop(ent).resize((w, h), Image.LANCZOS), (i * (w + 16), 34)); d.text((i * (w + 16) + 6, 8), f'Entero, sin pelo · {n}', font=F, fill=(40, 40, 60))
    hojas.append(o)
    out = Image.new('RGB', (max(x.width for x in hojas), sum(x.height + 14 for x in hojas)), 'white'); y = 0
    for x in hojas:
        out.paste(x, (0, y)); y += x.height + 14
    out.save(SAL / 'antes-despues.png', optimize=True)
    print(json.dumps(comp, ensure_ascii=False))
