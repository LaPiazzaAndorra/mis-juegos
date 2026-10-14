#!/usr/bin/env python3
"""
Crea una copia autónoma de herramientas/validar-pelo.html, con la plantilla, la base y
los ojos aprobados dentro del propio archivo, para abrirla en el iPad o el iPhone
sin conexión (desde Archivos, AirDrop o el correo).

  python3 herramientas/validador_autonomo.py salida/validar-pelo.html
"""
import base64, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
if len(sys.argv) < 2:
    sys.exit(__doc__)
html = (RAIZ / 'herramientas' / 'validar-pelo.html').read_text(encoding='utf-8')
pj = (RAIZ / 'plantilla' / 'plantilla.js').read_text(encoding='utf-8')
uri = lambda p: 'data:image/png;base64,' + base64.b64encode((RAIZ / p).read_bytes()).decode()
inc = ('window.AV_INCRUSTADO={' + ','.join(f'{k}:"{uri(p)}"' for k, p in (
    ('base', 'arte/originales/base-clara.png'), ('ojos', 'arte/originales/ojos-marron.png'),
    ('cerr', 'arte/originales/ojos-cerrados-clara.png'))) + '};')
html = html.replace('<script src="../plantilla/plantilla.js"></script>', f'<script>\n{pj}\n{inc}\n</script>')
Path(sys.argv[1]).write_text(html, encoding='utf-8')
print(f'{sys.argv[1]} · {Path(sys.argv[1]).stat().st_size / 1e6:.1f} MB')
