/* =====================================================================
   Dibujos para Contar y Memoria (copia aislada de Pensar, 04/11/2026)
   Mismo estilo que las ilustraciones de la app (ILL en index.html): trazo INK de 4, colores pastel,
   caritas y brillos. SVG en línea: no hay archivos que descargar (sirve igual sin conexión).
   Cada dibujo: s = singular, p = plural, g = género (para las frases), ir = qué le pasa en las restas.
   ===================================================================== */
(function () {
  'use strict';
  const V = b => svg(b, '0 0 100 100');
  const ojos = (x, y, k = 1) => `<circle cx="${x - 7 * k}" cy="${y}" r="${2.8 * k}" fill="${INK}"/><circle cx="${x + 7 * k}" cy="${y}" r="${2.8 * k}" fill="${INK}"/>`;
  const boca = (x, y, k = 1) => `<path d="M${x - 4 * k} ${y}q${4 * k} ${4 * k} ${8 * k} 0" fill="none" stroke="${INK}" stroke-width="${2.6 * k}" stroke-linecap="round"/>`;
  const mof = (x, y, k = 1) => `<circle cx="${x - 13 * k}" cy="${y + 5 * k}" r="${3.6 * k}" fill="#ff8fbf" opacity=".55"/><circle cx="${x + 13 * k}" cy="${y + 5 * k}" r="${3.6 * k}" fill="#ff8fbf" opacity=".55"/>`;
  const cara = (x, y, k = 1) => ojos(x, y, k) + boca(x, y + 6 * k, k) + mof(x, y, k);
  const C = (cx, cy, r, f) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${S}/>`;

  const D = {
    manzana: { s: 'manzana', p: 'manzanas', g: 'f', ir: 'comer', c: '#ff6f7d', svg: V(
      `<path d="M50 30q-1-11 7-17" fill="none" ${S}/><path d="M56 22c6-9 17-9 22-5-5 8-15 10-22 5z" fill="#5fd39b" ${S}/>
       <path d="M50 30c-9-8-34-6-35 16-1 24 17 42 27 42 4 0 6-2 8-2s4 2 8 2c10 0 28-18 27-42-1-22-26-24-35-16z" fill="#ff6f7d" ${S}/>
       <path d="M27 46q2-9 10-11" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`) },
    fresa: { s: 'fresa', p: 'fresas', g: 'f', ir: 'comer', c: '#ff6f7d', svg: V(
      `<path d="M50 92C28 80 13 58 20 41c5-11 19-12 30-6 11-6 25-5 30 6 7 17-8 39-30 51z" fill="#ff6f7d" ${S}/>
       ${[[36, 50], [50, 46], [64, 50], [42, 62], [58, 62], [50, 76]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="3.4" fill="#fff3a8"/>`).join('')}
       <path d="M30 36l10-15 10 10 10-10 10 15-11 1-9 7-9-7z" fill="#5fd39b" ${S}/>`) },
    estrella: { s: 'estrella', p: 'estrellas', g: 'f', ir: 'esconder', c: '#ffd46b', svg: V(
      `<path d="${starP(50, 54, 44, 21)}" fill="#ffd46b" ${S}/>${cara(50, 56, .8)}`) },
    flor: { s: 'flor', p: 'flores', g: 'f', ir: 'esconder', c: '#ffb3d1', svg: V(
      [0, 72, 144, 216, 288].map(a => { const r = a * Math.PI / 180; return C((50 + 23 * Math.sin(r)).toFixed(1), (50 - 23 * Math.cos(r)).toFixed(1), 17, '#ffb3d1'); }).join('') +
      C(50, 50, 15, '#ffd46b') + cara(50, 48, .45)) },
    pez: { s: 'pez', p: 'peces', g: 'm', ir: 'nadar', c: '#6cc8f5', svg: V(
      `<path d="M76 50l17-15v30z" fill="#6cc8f5" ${S}/><path d="M10 50c14-24 50-26 66 0-16 26-52 24-66 0z" fill="#6cc8f5" ${S}/>
       <path d="M40 32q8-12 20-6" fill="#a7e2fb" ${S}/><path d="M46 44q6 6 0 12" fill="none" ${S}/>
       <circle cx="28" cy="46" r="3.4" fill="${INK}"/><path d="M20 56q4 3 8 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`) },
    mariposa: { s: 'mariposa', p: 'mariposas', g: 'f', ir: 'volar', c: '#c9b6ff', svg: V(
      `<path d="M50 48C38 18 10 18 12 38c1 13 18 16 38 10z" fill="#c9b6ff" ${S}/><path d="M50 48C62 18 90 18 88 38c-1 13-18 16-38 10z" fill="#c9b6ff" ${S}/>
       <path d="M50 52C34 56 20 66 26 78c6 10 20 4 24-26z" fill="#ffb3d1" ${S}/><path d="M50 52C66 56 80 66 74 78c-6 10-20 4-24-26z" fill="#ffb3d1" ${S}/>
       <rect x="45" y="30" width="10" height="46" rx="5" fill="${INK}"/><path d="M47 31q-6-12-12-14M53 31q6-12 12-14" fill="none" ${S}/>
       <circle cx="27" cy="36" r="5" fill="#fff" opacity=".8"/><circle cx="73" cy="36" r="5" fill="#fff" opacity=".8"/>`) },
    globo: { s: 'globo', p: 'globos', g: 'm', ir: 'volar', c: '#ff8fbf', svg: V(
      `<path d="M50 76q-6 10 2 22" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
       <path d="M50 8c-17 0-28 13-28 30 0 20 16 36 28 38 12-2 28-18 28-38 0-17-11-30-28-30z" fill="#ff8fbf" ${S}/>
       <path d="M45 76h10l-5 7z" fill="#ff8fbf" ${S}/><path d="M34 30q4-11 13-13" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/>`) },
    mariquita: { s: 'mariquita', p: 'mariquitas', g: 'f', ir: 'volar', c: '#ff6f7d', svg: V(
      `<path d="M30 30a20 16 0 0 1 40 0z" fill="${INK}"/><path d="M38 20q-6-10-12-10M62 20q6-10 12-10" fill="none" ${S}/>
       ${C(50, 58, 34, '#ff6f7d')}<path d="M50 25v67" stroke="${INK}" stroke-width="4"/>
       ${[[34, 46], [66, 46], [32, 68], [68, 68], [50, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${INK}"/>`).join('')}`) },
    pollito: { s: 'pollito', p: 'pollitos', g: 'm', ir: 'casa', c: '#fff3a8', svg: V(
      `<path d="M40 88v8M60 88v8" fill="none" stroke="#ffab73" stroke-width="5" stroke-linecap="round"/>
       ${C(50, 56, 34, '#fff3a8')}<path d="M24 60q-10 4-6 14 10-2 14-10" fill="#ffe27a" ${S}/><path d="M48 12q4 4 2 10" fill="none" ${S}/>
       ${ojos(50, 48, .9)}<path d="M44 56l6 8 6-8z" fill="#ffab73" ${S}/>${mof(50, 50, .9)}`) },
    magdalena: { s: 'magdalena', p: 'magdalenas', g: 'f', ir: 'comer', c: '#ffb3d1', svg: V(
      `<path d="M22 54h56l-8 38H30z" fill="#a7e2fb" ${S}/><path d="M36 56l4 34M50 56v34M64 56l-4 34" stroke="${INK}" stroke-width="3"/>
       <path d="M18 56c-4-12 6-20 14-18 0-12 14-18 22-10 8-8 22-2 20 10 8-2 16 8 10 18z" fill="#ffb3d1" ${S}/>
       ${C(52, 18, 7, '#ff6f7d')}<path d="M54 11q4-6 10-6" fill="none" ${S}/>${[[32, 46, '#ffd46b'], [46, 40, '#5fd39b'], [64, 46, '#6cc8f5']].map(([x, y, f]) => `<rect x="${x}" y="${y}" width="7" height="3" rx="1.5" fill="${f}" transform="rotate(-25 ${x} ${y})"/>`).join('')}`) },
    corazon: { s: 'corazón', p: 'corazones', g: 'm', ir: 'esconder', c: '#ff8fbf', svg: V(
      heart(50, 56, 40, '#ff8fbf') + cara(50, 46, .8)) },
    nube: { s: 'nube', p: 'nubes', g: 'f', ir: 'volar', c: '#d6f0ff', svg: V(
      `<path d="M24 76a16 16 0 0 1-2-32 22 22 0 0 1 40-10 17 17 0 0 1 26 14 15 15 0 0 1-4 28z" fill="#d6f0ff" ${S}/>${cara(52, 56, .8)}`) },
    luna: { s: 'luna', p: 'lunas', g: 'f', ir: 'esconder', c: '#fff3a8', svg: V(
      `<path d="M62 10a40 40 0 1 0 28 62A34 34 0 0 1 62 10z" fill="#fff3a8" ${S}/>${ojos(30, 50, .7)}${boca(30, 56, .7)}${spark(80, 24, 8)}`) },
    sol: { s: 'sol', p: 'soles', g: 'm', ir: 'esconder', c: '#ffd46b', svg: V(
      Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4, x1 = 50 + 32 * Math.cos(a), y1 = 50 + 32 * Math.sin(a), x2 = 50 + 44 * Math.cos(a), y2 = 50 + 44 * Math.sin(a);
        return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#ffab73" stroke-width="7" stroke-linecap="round"/>`; }).join('') +
      C(50, 50, 25, '#ffd46b') + cara(50, 48, .75)) },
    helado: { s: 'helado', p: 'helados', g: 'm', ir: 'comer', c: '#9be8c4', svg: V(
      `<path d="M30 50h40L50 96z" fill="#f2b56b" ${S}/><path d="M38 58l20 20M50 52l14 14M62 58L44 78" stroke="#d48d45" stroke-width="3" fill="none" stroke-linecap="round"/>
       ${C(50, 38, 25, '#9be8c4')}${ojos(50, 38, .7)}${boca(50, 43, .7)}<circle cx="50" cy="12" r="7" fill="#ff6f7d" ${S}/>`) },
    seta: { s: 'seta', p: 'setas', g: 'f', ir: 'esconder', c: '#ff8f8f', svg: V(
      `<path d="M36 56h28l4 30a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6z" fill="#fff4e3" ${S}/>${ojos(50, 70, .7)}${boca(50, 76, .7)}
       <path d="M8 58C10 30 30 12 50 12s40 18 42 46z" fill="#ff8f8f" ${S}/>${[[28, 40, 6], [50, 26, 7], [72, 40, 6], [50, 48, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('')}`) },
    caracol: { s: 'caracol', p: 'caracoles', g: 'm', ir: 'casa', c: '#ffb84d', svg: V(
      `<path d="M8 84h70c8 0 12-6 12-14V40" fill="#b8efd3" ${S}/><path d="M86 40q-2-12-8-16M92 40q4-12 2-18" fill="none" ${S}/>
       ${C(46, 56, 28, '#ffb84d')}<path d="M46 56m-4 0a4 4 0 1 1 8 0a9 9 0 1 1-17 0a14 14 0 1 1 28 0" fill="none" ${S}/>
       <circle cx="85" cy="52" r="2.6" fill="${INK}"/>`) },
    gatito: { s: 'gatito', p: 'gatitos', g: 'm', ir: 'casa', c: '#ffcfa0', svg: V(
      `<path d="M20 44L18 12l26 18zM80 44l2-32-26 18z" fill="#ffcfa0" ${S}/><path d="M24 22l2 14 10-6zM76 22l-2 14-10-6z" fill="#ffb3d1"/>
       <ellipse cx="50" cy="56" rx="36" ry="32" fill="#ffcfa0" ${S}/>${ojos(50, 52, 1.1)}<path d="M46 60h8l-4 4z" fill="#ff8fbf"/>
       ${boca(50, 64, .7)}<path d="M18 58h14M18 66l14-3M82 58H68M82 66l-14-3" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`) },
    osito: { s: 'osito', p: 'ositos', g: 'm', ir: 'casa', c: '#d9a066', svg: V(
      `${C(22, 26, 13, '#d9a066')}${C(78, 26, 13, '#d9a066')}<circle cx="22" cy="26" r="6" fill="#ffb3d1"/><circle cx="78" cy="26" r="6" fill="#ffb3d1"/>
       ${C(50, 56, 36, '#d9a066')}<ellipse cx="50" cy="68" rx="15" ry="12" fill="#fff4e3" ${S}/>${ojos(50, 50, 1.1)}
       <ellipse cx="50" cy="63" rx="5" ry="3.6" fill="${INK}"/>${boca(50, 70, .7)}`) },
    hoja: { s: 'hoja', p: 'hojas', g: 'f', ir: 'volar', c: '#5fd39b', svg: V(
      `<path d="M14 86C14 40 44 14 88 12c0 46-28 74-74 74z" fill="#5fd39b" ${S}/><path d="M14 86L70 30M40 60l-4-16M40 60l16 2M56 44l-2-14M56 44l14 2" fill="none" ${S}/>`) },
  };
  // qué le pasa a cada uno en las restas (frase con el número delante)
  const IR = {   // (texto del número, número)
    comer: (k, n) => `nos comemos ${k}.`,
    volar: (k, n) => `${k} se ${n === 1 ? 'va' : 'van'} volando.`,
    nadar: (k, n) => `${k} se ${n === 1 ? 'va' : 'van'} nadando.`,
    casa: (k, n) => `${k} se ${n === 1 ? 'va' : 'van'} a casa.`,
    esconder: (k, n) => `${k} se ${n === 1 ? 'esconde' : 'esconden'}.`,
  };
  window.DIBUJOS = D;
  window.DIBUJOS_IR = IR;
  window.DIBUJO = id => (D[id] ? D[id].svg : '');
  // dibujos de los menús (mismo estilo que ILL)
  ILL.donde = svg(`${[[16, 16], [62, 16], [16, 62], [62, 62]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="42" height="42" rx="10" fill="${['#c9b6ff', '#fff', '#c9b6ff', '#c9b6ff'][i]}" ${S}/>`).join('')}
    ${heart(83, 40, 9, '#ff8fbf')}<text x="37" y="94" font-size="30" font-weight="900" text-anchor="middle" fill="#fff" font-family="ui-rounded,system-ui,sans-serif">?</text>${spark(104, 12, 8)}`);
  ILL.serie = svg(`${[[30, 34, '#ff8fbf'], [86, 34, '#ffd46b'], [30, 88, '#6cc8f5'], [86, 88, '#5fd39b']].map(([x, y, f], i) => `<circle cx="${x}" cy="${y}" r="22" fill="${f}" ${S} ${i === 1 ? '' : 'opacity=".55"'}/>`).join('')}
    <path d="M86 34m-9 0l6 6 12-12" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>${spark(58, 61, 12, '#a083ff')}`);
})();
