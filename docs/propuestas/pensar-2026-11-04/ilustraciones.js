/* =====================================================================
   Dibujos por etapas (copia aislada de Pensar, 4.ª entrega · ejemplos para revisar, 15/11/2026)
   Tres ilustraciones completas que se descubren por partes. Cada una sirve para «Unir puntos» y para «Repasar».
   Coordenadas en un cuadrado de 1000 × 1000 (como las láminas de Pintar).
     etapas[].t  = trazos de esa etapa, en orden: {d, c, w}  (c = cerrado: el último punto vuelve al primero; w = peso de puntos)
     extra       = detalles que aparecen al terminar (ojos, rayas, estrellas…); también cierran zonas para el cubo
   Todos los trazos y detalles juntos dejan zonas cerradas para colorear con el cubo de Pintar.
   Sin emojis ni imágenes: solo trazos, así funciona sin conexión.
   ===================================================================== */
(function () {
  'use strict';
  const circ = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
  const circT = (x, y, r) => `M${x} ${y - r}A${r} ${r} 0 1 1 ${x - .01} ${y - r}Z`;   // círculo que empieza arriba
  const estrella = (cx, cy, R, r) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r : R; p.push(`${(cx + k * Math.cos(a)).toFixed(0)} ${(cy + k * Math.sin(a)).toFixed(0)}`); } return 'M' + p.join('L') + 'Z'; };
  const T = (d, c = false, w = 1) => ({ d, c, w });   // w = peso: cuántos puntos se lleva en «Unir puntos» (más en lo que da la forma)

  const IL = {
    /* ---------- 1. Animal en una pequeña escena: el búho en su rama, de noche ---------- */
    buho: {
      n: 'un búho', titulo: 'El búho', fin: '¡Es un búho en su rama, de noche!',
      etapas: [
        { n: 'el cuerpo', voz: 'Primero, el cuerpo. ¿Qué animal será?',
          t: [T('M265 165Q330 228 430 222Q530 228 595 165Q640 255 618 340C700 445 690 640 620 732Q430 832 240 732C170 640 160 445 242 340Q220 255 265 165Z', true, 2.4)] },
        { n: 'la cara', voz: 'Ahora, la cara.',
          t: [T('M430 300C380 248 268 258 268 360C268 452 362 482 430 450C498 482 592 452 592 360C592 258 480 248 430 300Z', true, 1.4)] },
        { n: 'las alas', voz: 'Ahora, las dos alas.',
          t: [T('M252 470C196 560 214 680 300 724C322 640 312 540 252 470Z', true), T('M608 470C664 560 646 680 560 724C538 640 548 540 608 470Z', true)] },
        { n: 'la rama', voz: 'Ahora, la rama donde está sentado.',
          t: [T('M50 790C300 768 600 768 950 798L950 868C600 846 300 848 50 868Z', true, 0.4), T('M770 800Q830 740 890 722', false, .5), T('M890 722C915 672 975 676 990 702C962 744 918 748 890 722Z', true)] },
        { n: 'la luna', voz: 'Y por último, algo que brilla en el cielo.',
          t: [T('M800 70A130 130 0 0 0 800 330A210 210 0 0 1 800 70Z', true, 1.2)] },
      ],
      extra: [circ(352, 362, 58), circ(508, 362, 58), circ(362, 372, 24), circ(498, 372, 24), 'M410 428L450 428L430 482Z',
        'M375 560q27 28 55 0q28 28 55 0', 'M392 625q19 22 38 0q19 22 38 0', 'M410 690q10 16 20 0q10 16 20 0',
        circ(372, 792, 17), circ(402, 796, 17), circ(458, 796, 17), circ(488, 792, 17),
        estrella(120, 150, 46, 20), estrella(790, 590, 34, 15), estrella(890, 470, 28, 12), estrella(95, 520, 30, 13)],
    },

    /* ---------- 2. Vehículo: la furgoneta de los helados ---------- */
    furgoneta: {
      n: 'la furgoneta de los helados', titulo: 'La furgoneta', fin: '¡Es la furgoneta de los helados!',
      etapas: [
        { n: 'la carrocería', voz: 'Primero, la parte de fuera. ¿Qué será?',
          t: [T('M140 330H640Q680 330 690 370L718 470H862Q900 472 900 512V700Q900 730 870 730H800A90 90 0 0 0 620 730H380A90 90 0 0 0 200 730H130Q100 730 100 700V370Q100 330 140 330Z', true, 2.6)] },
        { n: 'las ruedas', voz: 'Ahora, las ruedas.',
          t: [T(circT(710, 740, 74), true, .8), T(circT(290, 740, 74), true, .8)] },
        { n: 'las ventanas', voz: 'Ahora, las ventanas: la del conductor y la de vender.',
          t: [T('M600 372H662L688 462H600Z', true), T('M200 440H520Q540 440 540 460V580Q540 600 520 600H200Q180 600 180 580V460Q180 440 200 440Z', true)] },
        { n: 'el toldo', voz: 'Ahora, el toldo para la sombra.',
          t: [T('M160 380H560V425Q535 455 510 425Q485 455 460 425Q435 455 410 425Q385 455 360 425Q335 455 310 425Q285 455 260 425Q235 455 210 425Q185 455 160 425Z', true, 1.3)] },
        { n: 'el cartel', voz: 'Y arriba, un cartel muy rico.',
          t: [T('M300 205L440 205L370 326Z', true), T('M290 210C268 140 320 72 370 84C420 72 472 140 450 210Q410 232 370 210Q330 232 290 210Z', true, 1.4)] },
      ],
      extra: [circ(710, 740, 28), circ(290, 740, 28), 'M590 345V710', 'M560 520H580', circ(864, 580, 20), 'M870 650H900',
        'M210 380V425', 'M260 380V425', 'M310 380V425', 'M360 380V425', 'M410 380V425', 'M460 380V425', 'M510 380V425',
        'M160 600H560V632H160Z', 'M325 248L400 248', 'M345 285L392 285', 'M330 220L380 290', 'M410 220L360 290',
        circ(370, 70, 22), 'M30 830H970', 'M110 880H230', 'M420 880H580', 'M770 880H890'],
    },

    /* ---------- 3. Personaje: el unicornio ---------- */
    unicornio: {
      n: 'un unicornio', titulo: 'El unicornio', fin: '¡Es un unicornio!',
      etapas: [
        { n: 'la cabeza', voz: 'Primero, la cabeza y el cuello. ¿Quién será?',
          t: [T('M300 905C300 700 330 480 420 360C470 300 540 290 590 330C660 380 720 470 770 560C800 620 760 682 700 670C640 660 600 640 560 660C540 740 560 820 580 905Z', true, 1.5)] },
        { n: 'la oreja', voz: 'Ahora, la oreja.',
          t: [T('M440 340L452 210L525 312Z', true)] },
        { n: 'el cuerno', voz: 'Ahora, algo mágico en la frente.',
          t: [T('M548 306L685 118L606 342Z', true)] },
        { n: 'la melena', voz: 'Ahora, la melena con sus rizos.',
          t: [T('M430 330C330 320 290 420 330 462C250 480 248 582 300 602C230 642 240 742 292 762C240 800 250 880 300 905', false, 1.5), T('M478 316C420 380 455 432 512 404')] },
        { n: 'la cara', voz: 'Ahora, el ojo y la sonrisa.',
          t: [T('M600 470Q632 500 664 470'), T('M700 642Q722 655 740 640')] },
        { n: 'la estrella mágica', voz: 'Y una estrella mágica que sale del cuerno.',
          t: [T(estrella(190, 215, 110, 48), true, 1.2)] },
      ],
      extra: ['M606 482L596 506', 'M632 492L632 518', 'M658 482L668 506', 'M738 598q10 -8 18 4', circ(640, 570, 26),
        'M574 258L640 280', 'M600 214L660 232', 'M626 172L672 186',
        'M330 462C360 470 380 500 360 530', 'M300 602C330 610 350 640 330 670', 'M292 762C320 770 340 800 320 830',
        estrella(840, 250, 40, 17), estrella(860, 820, 46, 20), estrella(140, 700, 34, 15),
        circ(760, 380, 14), circ(120, 440, 12)],
    },
  };
  window.ILUSTRACIONES = IL;
})();
