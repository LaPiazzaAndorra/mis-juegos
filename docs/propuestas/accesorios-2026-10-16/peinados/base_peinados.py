"""Montajes de los peinados (coleta con y sin cinta, dos coletas con y sin sombrero) con piel clara y castaño, para colocar
los adornos. Solo lee las capas aprobadas."""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

AQUI = Path(__file__).resolve().parent; P = AQUI.parents[1]
sys.path[:0] = [str(AQUI.parent / 'capas'), str(P / 'peinado-coleta-2026-10-16')]
import colocar as CL            # noqa: E402
import coleta_variantes as CV   # noqa: E402
PT = CV.PT
CS2 = P / 'peinado-coletas-sombrero-2026-10-17' / 'capas'
VERSIONES = ['coleta-con', 'coleta-sin', 'coletas2-con', 'coletas2-sin']
NOMBRE = {'coleta-con': 'Coleta con cinta', 'coleta-sin': 'Coleta sin cinta', 'coletas2-con': 'Dos coletas con sombrero',
          'coletas2-sin': 'Dos coletas sin sombrero'}


def capas_peinado(v, k='castano'):
    """(capas de debajo, capas de encima del peinado) con piel clara: el adorno va entre las dos (encima del pelo y de la
    cinta o los coleteros; el sombrero, encima del adorno)."""
    pz = CV.piezas_piel('claro'); cj = CV.cejas('claro', k)
    cuerpo = [pz['base']] + ([cj] if cj is not None else []) + [pz['ojos'], PT.abrir(PT.SIN_PIEL['vestido']), pz['manos']]
    p, w = v.split('-')
    if p == 'coleta':
        cs = [PT.abrir(CV.VAR / 'orejas-coleta-detras.png'), PT.abrir(CV.VAR / f'pelo-coleta-{w}-detras-{k}.png')] + cuerpo
        cs += [PT.abrir(CV.VAR / 'orejas-coleta-delante.png'), PT.abrir(CV.VAR / f'pelo-coleta-{w}-delante-{k}.png')]
        return cs + ([PT.abrir(CV.CINTA)] if w == 'con' else []), []
    cs = [PT.abrir(CS2 / 'variantes' / f'pelo-coletas-{w}-sombrero-detras-{k}.png')] + cuerpo
    cs += [PT.abrir(CS2 / 'variantes' / f'pelo-coletas-{w}-sombrero-delante-{k}.png'), PT.abrir(CS2 / 'coleteros.png')]
    return cs, ([PT.abrir(CS2 / 'sombrero-aventura.png')] if w == 'con' else [])


def montar(v, adornos=(), k='castano'):
    debajo, encima = capas_peinado(v, k)
    return PT.montar(debajo + list(adornos) + encima)
