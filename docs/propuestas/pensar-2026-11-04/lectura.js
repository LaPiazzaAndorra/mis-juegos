/* =====================================================================
   NORMA DE LECTURA DE AMAIA (15/11/2026) — apoyo de voz y pasos breves para todos los juegos de Pensar.
   - Cada mensaje (.pnTexto) de los juegos se parte en pasos: una frase por línea (sin cambiar lo que dice).
   - Al tocar un mensaje se oye (lleva un altavoz dibujado); al tocar el título de la barra, también.
   - Las mayúsculas y los tamaños están en lectura.css. Los Retos ya tienen su propio globo con altavoz.
   No cambia ningún dato, nivel ni recompensa. Se carga el último.
   ===================================================================== */
(function () {
  'use strict';
  // «Hay 3 manzanas. Llegan 2 más. ¿Cuántas hay ahora?» → tres líneas
  const pasos = t => t.match(/[^.!?…]+[.!?…]+[»"]?\s*|[^.!?…]+$/g) || [t];
  function preparar(el) {
    if (el.dataset.lx === el.textContent) return;
    const t = el.textContent, p = pasos(t.trim());
    if (p.length > 1) el.innerHTML = p.map(x => `<span class="lxPaso">${x.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join('');
    el.dataset.lx = el.textContent;
    // el mensaje puede ocupar más líneas: que cada juego vuelva a repartir el sitio (como al girar el iPhone)
    cancelAnimationFrame(preparar.raf); preparar.raf = requestAnimationFrame(() => dispatchEvent(new Event('resize')));
  }
  const vigilar = new MutationObserver(ms => { for (const m of ms) { const el = m.target.nodeType === 1 ? m.target.closest('.lxVoz') : m.target.parentElement && m.target.parentElement.closest('.lxVoz'); if (el) preparar(el); } });
  function enganchar() {
    document.querySelectorAll('section.pn .pnTexto').forEach(el => {
      if (el.classList.contains('lxVoz')) return;
      el.classList.add('lxVoz'); el.setAttribute('role', 'button'); el.setAttribute('aria-label', 'Escuchar');
      el.addEventListener('click', () => { const t = el.textContent.trim(); if (t) say(t); });
      preparar(el); vigilar.observe(el, { childList: true, characterData: true, subtree: true });
    });
    document.querySelectorAll('section.pn .bar .title').forEach(el => {
      if (el.dataset.lxTitulo || el.closest('.rt')) return; el.dataset.lxTitulo = '1';
      el.addEventListener('click', () => { const t = el.textContent.trim(); if (t) say(t.charAt(0) + t.slice(1).toLocaleLowerCase('es')); });
    });
  }
  enganchar();
  // por si alguna pantalla se crea más tarde
  new MutationObserver(enganchar).observe(document.body, { childList: true });
  window.LECTURA = { pasos, enganchar };
})();
