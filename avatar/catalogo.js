/* =====================================================================
   Mi Mundo de Juegos · Catálogo del creador de avatar
   ---------------------------------------------------------------------
   Cada pieza es una CAPA independiente dibujada sobre el mismo lienzo
   (400 × 700 unidades, pies en y≈655, centro en x=200).

   Una capa puede ser:
     · una función  (ctx) => '<svg…>'      → ilustración vectorial
     · un objeto    { img: 'ruta.png' }      → PNG transparente por capas
       (la ruta admite {piel}, {pelo}, {ojos} para variantes de color)

   Los brazos usan su propio sistema local: origen en el hombro y el
   brazo apuntando hacia abajo (+y). Así las mangas siguen al brazo
   cuando saluda.

   Ver avatar/LEEME.md para la especificación de los PNG.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- utilidades ---------- */
  const lg = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
    `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">` +
    stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('') +
    `</linearGradient>`;
  const rg = (id, stops, cx = .5, cy = .5, r = .5, fx, fy) =>
    `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${fx != null ? ` fx="${fx}" fy="${fy}"` : ''}>` +
    stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('') +
    `</radialGradient>`;
  const mirror = body => `<g transform="translate(400 0) scale(-1 1)">${body}</g>`;
  // Borde festoneado a lo largo de una curva cuadrática (volantes, tul…)
  function scallops(x0, y0, cx, cy, x1, y1, n, depth) {
    const P = t => [(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1];
    let d = '';
    for (let i = 0; i < n; i++) {
      const [ax, ay] = P(i / n), [bx, by] = P((i + 1) / n), [mx, my] = P((i + .5) / n);
      d += (i ? '' : `M${ax.toFixed(1)} ${ay.toFixed(1)}`) + `Q${mx.toFixed(1)} ${(my + depth).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
    }
    return d;
  }

  /* ---------- paletas ---------- */
  const SKIN = [
    { id: 'clara', nombre: 'Clara', c: { light: '#fff1e8', base: '#ffdcc8', shade: '#f4b99f', deep: '#df9479', line: '#c9775f', blush: '#ff8f9a', lip: '#c94f5f' } },
    { id: 'morena', nombre: 'Morena', c: { light: '#d9a07a', base: '#b97a52', shade: '#9b603c', deep: '#7f4a2b', line: '#6a3b22', blush: '#e0646c', lip: '#8e3a3e' } },
  ];
  const EYES = [
    { id: 'marron', nombre: 'Marrones', c: { light: '#c98b55', iris: '#7d4a26', dark: '#3d200e' } },
    { id: 'verde', nombre: 'Verdes', c: { light: '#9fdc9a', iris: '#3f9a5c', dark: '#174a2e' } },
    { id: 'azul', nombre: 'Azules', c: { light: '#9fd6ff', iris: '#3d8ee0', dark: '#173f80' } },
  ];
  const HAIR_COLORS = [
    { id: 'castano', nombre: 'Castaño', c: { light: '#b07a52', base: '#7b4a2d', shade: '#55301b', line: '#3f2212' } },
    { id: 'rubio', nombre: 'Rubio', c: { light: '#ffe6a6', base: '#f2c46d', shade: '#d39a3e', line: '#a8742a' } },
    { id: 'negro', nombre: 'Negro', c: { light: '#6e5a66', base: '#3a2b31', shade: '#21171b', line: '#140d10' } },
    { id: 'pelirrojo', nombre: 'Pelirrojo', c: { light: '#ffad7a', base: '#dd6a3a', shade: '#b14a22', line: '#863516' } },
  ];

  /* =================== CUERPO BASE =================== */
  const FACE = 'M200 92C262 92 306 134 306 198C306 252 268 296 200 296C132 296 94 252 94 198C94 134 138 92 200 92Z';

  function defsBase(x) {
    const s = x.skin, e = x.eye, h = x.hair, u = x.u;
    return lg(`${u}sk`, [[0, s.shade], [.28, s.base], [.72, s.base], [1, s.shade]], 0, 0, 1, 0) +
      rg(`${u}fc`, [[0, s.light], [.45, s.base], [1, s.shade]], .46, .4, .62) +
      rg(`${u}bl`, [[0, s.blush, .75], [1, s.blush, 0]]) +
      rg(`${u}ir`, [[0, e.light], [.55, e.iris], [1, e.dark]], .5, .62, .6) +
      lg(`${u}hr`, [[0, h.light], [.35, h.base], [1, h.shade]]) +
      `<clipPath id="${u}face"><path d="${FACE}"/></clipPath>`;
  }

  function eye(x, side) { // dibujado alrededor de (0,0); side −1 = izquierda
    const u = x.u, lash = '#3a2430';
    const W = 'M-23 3C-23-21-12-30 1-30C14-30 24-21 24 3C24 23 13 31 1 31C-11 31-23 23-23 3Z';
    return `<clipPath id="${u}ey${side}"><path d="${W}"/></clipPath>` +
      `<path d="${W}" fill="#fff"/>` +
      `<g clip-path="url(#${u}ey${side})">` +
      `<path d="M-30-30H30V-14C14-22-14-22-30-14Z" fill="${x.skin.shade}" opacity=".35"/>` +
      `<circle cx="1" cy="6" r="20" fill="url(#${u}ir)"/>` +
      `<circle cx="1" cy="6" r="20" fill="none" stroke="${x.eye.dark}" stroke-width="2.2"/>` +
      `<circle cx="1" cy="7" r="10" fill="#1d1020"/>` +
      `<path d="M-14 16Q1 26 16 16" fill="none" stroke="${x.eye.light}" stroke-width="3" opacity=".6" stroke-linecap="round"/>` +
      `</g>` +
      `<circle cx="-7" cy="-4" r="6.8" fill="#fff"/><circle cx="10" cy="14" r="3.2" fill="#fff" opacity=".95"/><circle cx="-12" cy="10" r="1.8" fill="#fff" opacity=".8"/>` +
      `<path d="M-25-1C-22-27 21-33 27-6" fill="none" stroke="${lash}" stroke-width="5.5" stroke-linecap="round"/>` +
      `<path d="M${side * 25} ${-5}q${side * 8}-3 ${side * 11}-11M${side * 22} ${-14}q${side * 6}-5 ${side * 7}-13M${side * 15} ${-21}q${side * 3}-6 ${side * 2}-12" fill="none" stroke="${lash}" stroke-width="3.6" stroke-linecap="round"/>` +
      `<path d="M-14 30Q1 36 16 30" fill="none" stroke="${x.skin.deep}" stroke-width="2" opacity=".45" stroke-linecap="round"/>`;
  }

  const BASE = {
    defs: defsBase,
    legs: x => {
      const s = x.skin, u = x.u;
      return `<path d="M171 440C170 500 170 560 172 630L197 630C197 560 198 500 198 440Z" fill="url(#${u}sk)" stroke="${s.line}" stroke-width="2.5"/>` +
        `<path d="M202 440C202 500 203 560 203 630L228 630C230 560 230 500 229 440Z" fill="url(#${u}sk)" stroke="${s.line}" stroke-width="2.5"/>` +
        `<path d="M178 540q6 4 12 0M210 540q6 4 12 0" fill="none" stroke="${s.deep}" stroke-width="2" opacity=".35" stroke-linecap="round"/>`;
    },
    arm: (x, side) => { // side −1 = brazo izquierdo (pulgar hacia +x)
      const s = x.skin, u = x.u, t = -side;
      return `<path d="M-15 0C-18 40-14 80-12 108L12 108C14 80 18 40 15 0Z" fill="url(#${u}sk)" stroke="${s.line}" stroke-width="2.5"/>` +
        `<ellipse cx="${t * 10}" cy="114" rx="6" ry="9" transform="rotate(${t * -25} ${t * 10} 114)" fill="${s.base}" stroke="${s.line}" stroke-width="2.5"/>` +
        `<path d="M-13 103C-20 118-16 140 0 141C16 141 20 119 13 103Z" fill="${s.base}" stroke="${s.line}" stroke-width="2.5"/>` +
        `<path d="M-6 128q6 5 12 0" fill="none" stroke="${s.deep}" stroke-width="2" opacity=".4" stroke-linecap="round"/>`;
    },
    neck: x => {
      const s = x.skin;
      return `<path d="M180 280C180 300 178 316 176 334L224 334C222 316 220 300 220 280Z" fill="${s.base}" stroke="${s.line}" stroke-width="2.5"/>` +
        `<path d="M180 282Q200 306 220 282L221 298Q200 318 179 298Z" fill="${s.shade}" opacity=".8"/>`;
    },
    head: x => {
      const s = x.skin, h = x.hair, u = x.u;
      const ear = `<ellipse cx="97" cy="214" rx="14" ry="20" fill="${s.base}" stroke="${s.line}" stroke-width="2.5"/><path d="M99 204q-8 10 0 20" fill="none" stroke="${s.deep}" stroke-width="3" opacity=".5" stroke-linecap="round"/>`;
      return ear + mirror(ear) +
        `<path d="${FACE}" fill="url(#${u}fc)" stroke="${s.line}" stroke-width="3"/>` +
        `<ellipse cx="138" cy="246" rx="22" ry="14" fill="url(#${u}bl)"/><ellipse cx="262" cy="246" rx="22" ry="14" fill="url(#${u}bl)"/>` +
        `<path d="M134 242l3-3M140 244l3-3M260 244l3-3M266 242l3-3" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>` +
        // cejas
        `<path d="M140 164Q158 152 176 160" fill="none" stroke="${h.shade}" stroke-width="5.5" stroke-linecap="round"/>` +
        `<path d="M224 160Q242 152 260 164" fill="none" stroke="${h.shade}" stroke-width="5.5" stroke-linecap="round"/>` +
        // ojos (grupos animables: parpadeo)
        `<g transform="translate(157 208)"><g class="av-eye">${eye(x, -1)}</g></g>` +
        `<g transform="translate(243 208)"><g class="av-eye">${eye(x, 1)}</g></g>` +
        // nariz
        `<path d="M194 238Q200 243 206 238" fill="none" stroke="${s.deep}" stroke-width="3" stroke-linecap="round" opacity=".8"/><ellipse cx="202" cy="232" rx="4" ry="2.5" fill="#fff" opacity=".45"/>` +
        // boca: sonrisa tranquila / sonrisa abierta
        `<g class="av-mouth-c"><path d="M184 256Q200 271 216 256" fill="none" stroke="${s.lip}" stroke-width="4.5" stroke-linecap="round"/><path d="M180 254q2 3 5 3M220 254q-2 3-5 3" fill="none" stroke="${s.deep}" stroke-width="2" opacity=".5" stroke-linecap="round"/></g>` +
        `<g class="av-mouth-o" display="none"><path d="M181 252Q200 250 219 252Q217 279 200 280Q183 279 181 252Z" fill="#7d2635" stroke="${s.lip}" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="M189 269Q200 262 211 269Q207 278 200 278Q193 278 189 269Z" fill="#ff8a96"/><path d="M185 254L215 254Q214 260 200 260Q186 260 185 254Z" fill="#fff"/></g>`;
    },
  };

  /* =================== PEINADOS =================== */
  const hairShine = x => `<path d="M128 126C162 102 222 98 266 118" fill="none" stroke="${x.hair.light}" stroke-width="10" opacity=".6" stroke-linecap="round"/>` +
    `<path d="M142 140C160 128 176 124 190 122" fill="none" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/>`;

  const MELENA_BANGS = 'M94 238C82 140 136 82 204 84C278 86 320 146 306 238C303 200 292 172 274 156C262 164 248 164 236 160C242 154 244 148 244 142C222 150 196 142 176 126C168 140 152 152 132 156C114 170 102 198 94 238Z';
  const COLETAS_BANGS = 'M92 224C86 134 136 84 200 84C264 84 314 134 308 224C302 196 296 176 286 160Q272 168 258 150Q242 166 224 148Q207 164 190 148Q172 166 156 150Q138 168 120 160C108 178 98 202 92 224Z';

  const HAIR_STYLES = [
    {
      id: 'melena', nombre: 'Melena ondulada',
      layers: {
        hairBack: x => {
          const h = x.hair, u = x.u;
          return `<path d="M200 84C116 84 74 148 80 232C84 296 64 352 80 410C90 434 112 440 128 424C142 446 166 448 180 428L220 428C234 448 258 446 272 424C288 440 310 434 320 410C336 352 316 296 320 232C326 148 284 84 200 84Z" fill="url(#${u}hr)" stroke="${h.line}" stroke-width="3"/>` +
            `<path d="M108 270C100 330 98 372 112 412M292 270C300 330 302 372 288 412M128 300C124 350 126 390 140 420M272 300C276 350 274 390 260 420" fill="none" stroke="${h.shade}" stroke-width="3" opacity=".7" stroke-linecap="round"/>`;
        },
        hairFront: x => {
          const h = x.hair, u = x.u, s = x.skin;
          const lock = `<path d="M98 176C84 250 88 304 108 334C112 314 118 300 128 290C118 262 116 220 124 176Z" fill="url(#${u}hr)" stroke="${h.line}" stroke-width="3"/><path d="M104 240C100 270 104 296 112 316" fill="none" stroke="${h.shade}" stroke-width="2.5" opacity=".7" stroke-linecap="round"/>`;
          return `<path d="${MELENA_BANGS}" transform="translate(0 8)" fill="${s.deep}" opacity=".28" clip-path="url(#${u}face)"/>` +
            lock + mirror(lock) +
            `<path d="${MELENA_BANGS}" fill="url(#${u}hr)" stroke="${h.line}" stroke-width="3" stroke-linejoin="round"/>` +
            `<path d="M168 96C172 110 174 118 176 126M210 90C222 112 236 130 244 142M248 100C266 118 278 136 286 170M140 112C126 130 112 160 104 206" fill="none" stroke="${h.shade}" stroke-width="2.5" opacity=".65" stroke-linecap="round"/>` +
            hairShine(x);
        },
      },
    },
    {
      id: 'coletas', nombre: 'Dos coletas',
      layers: {
        hairBack: x => {
          const h = x.hair, u = x.u;
          const tail = `<path d="M116 176C72 162 42 200 52 248C58 284 38 318 54 354C64 382 94 388 108 366C122 342 106 318 114 292C122 262 136 222 134 192Z" fill="url(#${u}hr)" stroke="${h.line}" stroke-width="3"/>` +
            `<path d="M86 210C70 240 76 270 70 300C66 324 70 346 82 362M104 220C96 250 100 280 94 310" fill="none" stroke="${h.shade}" stroke-width="3" opacity=".7" stroke-linecap="round"/>` +
            `<path d="M72 230C68 250 70 262 66 276" fill="none" stroke="${h.light}" stroke-width="5" opacity=".55" stroke-linecap="round"/>`;
          return tail + mirror(tail) +
            `<path d="M200 84C120 84 84 140 88 216L312 216C316 140 280 84 200 84Z" fill="url(#${u}hr)" stroke="${h.line}" stroke-width="3"/>`;
        },
        hairFront: x => {
          const h = x.hair, u = x.u, s = x.skin;
          const tie = `<g transform="translate(-14 -22)"><path d="M114 166C104 172 104 192 116 198C126 192 128 174 114 166Z" fill="#ff7eb6" stroke="#d8578f" stroke-width="2.5"/><circle cx="110" cy="180" r="9" fill="#ff9ec7" stroke="#d8578f" stroke-width="2.5"/><circle cx="107" cy="177" r="3" fill="#fff" opacity=".8"/></g>`;
          return `<path d="${COLETAS_BANGS}" transform="translate(0 8)" fill="${s.deep}" opacity=".28" clip-path="url(#${u}face)"/>` +
            `<path d="${COLETAS_BANGS}" fill="url(#${u}hr)" stroke="${h.line}" stroke-width="3" stroke-linejoin="round"/>` +
            `<path d="M190 148C192 126 196 106 200 90M224 148C226 126 222 108 214 92M156 150C162 128 170 112 180 96M258 150C254 130 246 116 236 100" fill="none" stroke="${h.shade}" stroke-width="2.5" opacity=".6" stroke-linecap="round"/>` +
            hairShine(x) + tie + mirror(tie);
        },
      },
    },
  ];

  /* =================== CONJUNTOS =================== */
  const flowerPattern = (id, c1, c2) => `<pattern id="${id}" width="36" height="36" patternUnits="userSpaceOnUse">` +
    [[9, 9, c1], [27, 27, c2]].map(([cx, cy, c]) =>
      [0, 72, 144, 216, 288].map(a => `<circle cx="${cx + 3.4 * Math.cos(a * Math.PI / 180)}" cy="${cy + 3.4 * Math.sin(a * Math.PI / 180)}" r="2.7" fill="${c}"/>`).join('') +
      `<circle cx="${cx}" cy="${cy}" r="1.9" fill="#ffd46b"/>`).join('') + `</pattern>`;
  const starPath = (cx, cy, R, r) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; d += (i ? 'L' : 'M') + (cx + q * Math.cos(a)).toFixed(1) + ' ' + (cy + q * Math.sin(a)).toFixed(1) } return d + 'Z' };
  const starPattern = (id, c) => `<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse">` +
    `<path d="${starPath(11, 11, 6, 2.6)}" fill="${c}"/><path d="${starPath(33, 31, 4.5, 2)}" fill="${c}"/><circle cx="32" cy="9" r="1.6" fill="${c}"/><circle cx="10" cy="34" r="1.4" fill="${c}"/></pattern>`;

  const OUTFITS = [
    /* ---------- 1 · Vestido de flores ---------- */
    {
      id: 'vestido', nombre: 'Vestido de flores', tipo: 'vestido',
      layers: {
        defs: x => lg(`${x.u}dr`, [[0, '#ffc6df'], [.5, '#ff9ec7'], [1, '#f27aae']]) +
          lg(`${x.u}drs`, [[0, '#f27aae'], [.3, '#ff9ec7'], [.7, '#ff9ec7'], [1, '#f27aae']], 0, 0, 1, 0) +
          flowerPattern(`${x.u}fl`, '#fff', '#fff4fa'),
        legwear: () => {
          const sock = `<path d="M171 604L197 604L197 628L171 628Z" fill="#fff" stroke="#e7dce6" stroke-width="2"/><path d="M169 604Q177 598 184 604Q191 598 199 604" fill="#fff" stroke="#e7dce6" stroke-width="2"/>`;
          return sock + `<g transform="translate(32 0)">${sock}</g>`;
        },
        shoes: () => {
          const shoe = `<path d="M167 622C162 642 168 656 186 656C204 656 206 642 201 622Q184 630 167 622Z" fill="#e8506f" stroke="#b83355" stroke-width="2.5"/>` +
            `<path d="M169 630Q184 636 200 630" fill="none" stroke="#b83355" stroke-width="4"/><circle cx="196" cy="631" r="2.6" fill="#ffd46b"/>` +
            `<ellipse cx="178" cy="644" rx="6" ry="3" fill="#fff" opacity=".55"/>`;
          return shoe + `<g transform="translate(32 0)">${shoe}</g>`;
        },
        bottom: x => {
          const u = x.u, SK = 'M160 428C140 470 112 518 98 548C130 568 270 568 302 548C288 518 260 470 240 428Z';
          return `<path d="${scallops(96, 544, 200, 594, 304, 544, 14, 7)}L296 534Q200 572 104 534Z" fill="#fff" stroke="#eadbe6" stroke-width="2"/>` +
            `<path d="${SK}" fill="url(#${u}drs)" stroke="#d8578f" stroke-width="3" stroke-linejoin="round"/>` +
            `<path d="${SK}" fill="url(#${u}fl)" opacity=".85"/>` +
            `<path d="M184 442C172 484 156 522 144 558M216 442C228 484 244 522 256 558M200 444L200 566" fill="none" stroke="#d8578f" stroke-width="2.5" opacity=".35" stroke-linecap="round"/>` +
            `<path d="M100 546C134 566 266 566 300 546" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`;
        },
        sleeve: () => `<path d="M-21-6C-32 10-26 36-11 42C0 46 10 46 17 42C32 36 32 10 21-6C10-15-10-15-21-6Z" fill="#ff9ec7" stroke="#d8578f" stroke-width="2.5"/>` +
          `<path d="M-6-4C-8 12-6 28-2 40M8-4C10 12 10 28 6 40" fill="none" stroke="#d8578f" stroke-width="2" opacity=".35"/>` +
          `<path d="M-12 38Q2 46 16 38L16 44Q2 52-12 44Z" fill="#fff" stroke="#eadbe6" stroke-width="1.5"/>`,
        top: x => {
          const u = x.u, B = 'M158 324C176 334 224 334 242 324C252 330 256 344 252 360L240 432L160 432L148 360C144 344 148 330 158 324Z';
          const collar = `<path d="M200 334C192 354 168 356 158 336C170 326 188 328 200 334Z" fill="#fff" stroke="#e7dce6" stroke-width="2"/>`;
          const loop = `<path d="M198 430C184 414 166 418 168 432C170 446 186 444 198 432Z" fill="#b79cff" stroke="#8b6ae8" stroke-width="2.5"/><path d="M196 434L186 466L196 460L200 470Z" fill="#b79cff" stroke="#8b6ae8" stroke-width="2.5" stroke-linejoin="round"/>`;
          return `<path d="${B}" fill="url(#${u}dr)" stroke="#d8578f" stroke-width="3" stroke-linejoin="round"/>` +
            `<path d="${B}" fill="url(#${u}fl)" opacity=".85"/>` +
            `<path d="M152 360L162 430M248 360L238 430" stroke="#f27aae" stroke-width="7" opacity=".45" stroke-linecap="round"/>` +
            collar + mirror(collar) +
            `<path d="M157 420C180 428 220 428 243 420L245 440C220 448 180 448 155 440Z" fill="#b79cff" stroke="#8b6ae8" stroke-width="2.5"/>` +
            loop + mirror(loop) + `<ellipse cx="200" cy="432" rx="8" ry="9" fill="#a083ff" stroke="#8b6ae8" stroke-width="2.5"/><circle cx="197" cy="429" r="2.4" fill="#fff" opacity=".7"/>`;
        },
      },
    },
    /* ---------- 2 · Camiseta y vaqueros ---------- */
    {
      id: 'vaqueros', nombre: 'Camiseta y vaqueros', tipo: 'camiseta',
      layers: {
        defs: x => lg(`${x.u}ts`, [[0, '#fff0b8'], [.5, '#ffd86b'], [1, '#f2b93f']]) +
          lg(`${x.u}jn`, [[0, '#4f78c2'], [.3, '#6f9be0'], [.7, '#6f9be0'], [1, '#4f78c2']], 0, 0, 1, 0),
        legwear: () => `<path d="M171 606H197V626H171ZM203 606H229V626H203Z" fill="#fff" stroke="#e7dce6" stroke-width="2"/><path d="M172 612H196M204 612H228" stroke="#ff9ec7" stroke-width="3"/>`,
        shoes: () => {
          const shoe = `<path d="M165 618C160 640 166 657 186 657C206 657 207 640 202 618Q184 626 165 618Z" fill="#fff" stroke="#b9aecb" stroke-width="2.5"/>` +
            `<path d="M164 646Q184 654 205 646L204 652Q184 662 165 652Z" fill="#ffc2dc" stroke="#d8578f" stroke-width="2"/>` +
            `<path d="M175 626L193 628M174 633L194 635" stroke="#ff7eb6" stroke-width="3" stroke-linecap="round"/><path d="M170 640q14 5 28 0" fill="none" stroke="#d8cfe4" stroke-width="2"/>`;
          return shoe + `<g transform="translate(32 0)">${shoe}</g>`;
        },
        bottom: x => {
          const u = x.u, P = 'M162 428L238 428C240 500 238 560 237 612L205 612C205 560 203 500 200 466C197 500 195 560 195 612L163 612C162 560 160 500 162 428Z';
          return `<path d="${P}" fill="url(#${u}jn)" stroke="#3c5ea0" stroke-width="3" stroke-linejoin="round"/>` +
            `<path d="M161 596H197V614H161ZM203 596H239V614H203Z" fill="#9fc0f2" stroke="#3c5ea0" stroke-width="2.5"/>` +
            `<path d="M200 440V468M170 448Q182 456 186 470M230 448Q218 456 214 470" fill="none" stroke="#c3d8fa" stroke-width="2" stroke-dasharray="4 4"/>` +
            `<path d="M178 520q-4 30 0 60M222 520q4 30 0 60" fill="none" stroke="#3c5ea0" stroke-width="2" opacity=".35"/>`;
        },
        sleeve: () => `<path d="M-19-6C-25 10-23 30-19 46L19 46C23 30 25 10 19-6C10-13-10-13-19-6Z" fill="#ffd86b" stroke="#d19a2a" stroke-width="2.5"/>` +
          `<path d="M-19 38H19V46H-19Z" fill="#fff0b8" stroke="#d19a2a" stroke-width="2"/>`,
        top: x => {
          const u = x.u, T = 'M156 324C176 336 224 336 244 324C254 332 258 346 254 362L246 442C220 450 180 450 154 442L146 362C142 346 146 332 156 324Z';
          return `<path d="${T}" fill="url(#${u}ts)" stroke="#d19a2a" stroke-width="3" stroke-linejoin="round"/>` +
            `<path d="M176 330Q200 350 224 330" fill="none" stroke="#f2b93f" stroke-width="6" stroke-linecap="round"/>` +
            `<path d="M150 366L158 438M250 366L242 438" stroke="#f2b93f" stroke-width="6" opacity=".5" stroke-linecap="round"/>` +
            // arcoíris y corazón estampados
            `<path d="M170 404A30 30 0 0 1 230 404" fill="none" stroke="#ff8fbf" stroke-width="6" stroke-linecap="round"/>` +
            `<path d="M177 404A23 23 0 0 1 223 404" fill="none" stroke="#a083ff" stroke-width="6" stroke-linecap="round"/>` +
            `<path d="M184 404A16 16 0 0 1 216 404" fill="none" stroke="#6cc8f5" stroke-width="6" stroke-linecap="round"/>` +
            `<path d="M200 398C188 384 176 392 184 402L200 414L216 402C224 392 212 384 200 398Z" transform="translate(0 -26) scale(1)" fill="#ff6f9e" stroke="#d8578f" stroke-width="2"/>` +
            `<circle cx="166" cy="406" r="5" fill="#fff"/><circle cx="234" cy="406" r="5" fill="#fff"/>` +
            `<path d="M156 436C180 444 220 444 244 436" fill="none" stroke="#d19a2a" stroke-width="2" opacity=".5"/>`;
        },
      },
    },
    /* ---------- 3 · Pijama de estrellas ---------- */
    {
      id: 'pijama', nombre: 'Pijama de estrellas', tipo: 'pijama',
      layers: {
        defs: x => lg(`${x.u}pj`, [[0, '#cdd6ff'], [.5, '#a9b8ff'], [1, '#8796ec']]) +
          lg(`${x.u}pjs`, [[0, '#8796ec'], [.3, '#a9b8ff'], [.7, '#a9b8ff'], [1, '#8796ec']], 0, 0, 1, 0) +
          starPattern(`${x.u}st`, '#fff3a8'),
        shoes: () => {
          const sl = `<path d="M160 622C153 643 162 659 186 659C210 659 213 643 206 622Q184 632 160 622Z" fill="#ffc2dc" stroke="#e58bb3" stroke-width="2.5"/>` +
            `<path d="M160 624Q184 634 206 624" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 6"/>` +
            `<circle cx="183" cy="630" r="8" fill="#fff" stroke="#f1d4e3" stroke-width="2"/><ellipse cx="174" cy="646" rx="7" ry="3" fill="#fff" opacity=".5"/>`;
          return sl + `<g transform="translate(32 0)">${sl}</g>`;
        },
        bottom: x => {
          const u = x.u, P = 'M160 432L240 432C244 510 242 570 240 626L206 626C205 570 203 510 200 474C197 510 195 570 194 626L160 626C158 570 156 510 160 432Z';
          return `<path d="${P}" fill="url(#${u}pjs)" stroke="#6a78d0" stroke-width="3" stroke-linejoin="round"/>` +
            `<path d="${P}" fill="url(#${u}st)"/>` +
            `<path d="M159 610H195V627H159ZM205 610H241V627H205Z" fill="#fff" stroke="#c9cff5" stroke-width="2"/>` +
            `<path d="M178 500q-3 40 0 90M222 500q3 40 0 90" fill="none" stroke="#6a78d0" stroke-width="2" opacity=".35"/>`;
        },
        sleeve: x => `<path d="M-19-6C-25 30-18 80-15 106L15 106C18 80 25 30 19-6C10-13-10-13-19-6Z" fill="#a9b8ff" stroke="#6a78d0" stroke-width="2.5"/>` +
          `<path d="M-19-6C-25 30-18 80-15 106L15 106C18 80 25 30 19-6C10-13-10-13-19-6Z" fill="url(#${x.u}st)"/>` +
          `<path d="M-16 94H16V108H-16Z" fill="#fff" stroke="#c9cff5" stroke-width="2"/>`,
        top: x => {
          const u = x.u, T = 'M154 324C176 336 224 336 246 324C256 334 260 350 256 366L250 448C220 456 180 456 150 448L144 366C140 350 144 334 154 324Z';
          const lapel = `<path d="M178 330L200 368L170 352Z" fill="#fff" stroke="#c9cff5" stroke-width="2" stroke-linejoin="round"/>`;
          return `<path d="${T}" fill="url(#${u}pj)" stroke="#6a78d0" stroke-width="3" stroke-linejoin="round"/>` +
            `<path d="${T}" fill="url(#${u}st)"/>` +
            `<path d="M148 368L156 444M252 368L244 444" stroke="#8796ec" stroke-width="7" opacity=".5" stroke-linecap="round"/>` +
            lapel + mirror(lapel) +
            `<path d="M200 368V452" stroke="#6a78d0" stroke-width="2.5" opacity=".6"/>` +
            [384, 410, 436].map(y => `<circle cx="206" cy="${y}" r="4.5" fill="#fff" stroke="#c9cff5" stroke-width="2"/>`).join('') +
            `<path d="M154 446C180 454 220 454 246 446" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/>` +
            `<path d="${starPath(172, 392, 10, 4.4)}" fill="#ffd46b" stroke="#e0a93a" stroke-width="2" stroke-linejoin="round"/>`;
        },
      },
    },
  ];

  window.AV_CAT = {
    version: 1,
    lienzo: { w: 400, h: 700 },
    // Orden de dibujo (de atrás hacia delante)
    capas: ['hairBack', 'legs', 'legwear', 'shoes', 'bottom', 'arms', 'neck', 'top', 'head', 'hairFront', 'acc'],
    hombros: { L: [156, 338, 14], R: [244, 338, -14] }, // x, y, giro en reposo
    base: BASE,
    piel: SKIN,
    ojos: { colores: EYES, formas: [{ id: 'redondos', nombre: 'Redondos' }] },
    pelo: { colores: HAIR_COLORS, estilos: HAIR_STYLES },
    ropa: OUTFITS,
    defecto: { piel: 'clara', ojos: { color: 'marron', forma: 'redondos' }, pelo: { estilo: 'melena', color: 'castano' }, ropa: 'vestido', zapatos: null, accesorios: [] },
  };
})();
