/* =====================================================================
   Norma de lectura (D-038) · lo PROPIO de Pensar (va con lectura-pensar.css, después de la capa común)
   - Cada mensaje (.pnTexto) de los juegos se parte en pasos: una frase por línea (sin cambiar lo que dice).
   - Al tocar un mensaje se oye la instrucción (lo mismo que el botón 🗣️ de su pantalla, que en los iPhone estrechos se
     quita de la barra para que quepa el título); al tocar el título de la barra se oye su nombre.
   Las MAYÚSCULAS, los tamaños mínimos y los títulos sin «…» los pone la capa común (lectura-2026-11-17).
   No cambia ningún dato, nivel ni recompensa. Se carga la última.
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
      // tocar el mensaje hace lo mismo que el botón 🗣️ de su pantalla (la instrucción entera); si no hay, lee el mensaje
      el.addEventListener('click', () => { const b = el.closest('section') && el.closest('section').querySelector('.bar .btn[id$="Say"]');
        if (b) b.click(); else { const t = el.textContent.trim(); if (t) say(t); } });
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
  window.LecturaPensar = { pasos, enganchar };
})();
