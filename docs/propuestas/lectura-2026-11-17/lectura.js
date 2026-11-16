/* =====================================================================
   Norma de lectura (D-038, docs/NORMA_TEXTOS_INFANTILES.md): capa COMÚN a todas las ramas
   ---------------------------------------------------------------------
   Se carga después de logros.js y antes de los módulos (Contar y Memoria, Mi Mundo), en las copias y en la publicación.
   Solo cambia lo que se VE y se OYE:
     · pone la clase «lectura» en <html> (lectura.css: MAYÚSCULAS, letra grande y buen contraste);
     · cambia algunos textos del juego base por frases más breves y sencillas (tabla TEXTOS, por coincidencia exacta);
       los módulos (Pensar, Mi Mundo) escriben ya sus textos según la norma en su propio código;
     · los mensajes («toast») salen también por la voz cuando el sonido está activado (sin los emojis), para que no haga
       falta leer; los técnicos y los de la zona de adultos («ADULTO») se quedan como están, sin mayúsculas ni voz.
   No toca datos guardados, identificadores ni respuestas: los textos se cambian solo en la pantalla.
   Otros módulos pueden añadir sus frases con Lectura.textos({ 'original': 'NUEVO' }).
   ===================================================================== */
(function () {
  'use strict';
  document.documentElement.classList.add('lectura');
  if (!document.documentElement.lang) document.documentElement.lang = 'es';
  // juego base (prueba completa: inicio, Pintar, Heladería, Vestir, Mi Mundo de pegatinas, logros)
  const TEXTOS = new Map(Object.entries({
    'Colorear dibujos': 'COLOREAR', 'Inventar helados': 'INVENTAR', 'Atender pedidos': 'SERVIR', 'Retos y logros': 'MIS LOGROS',
    'Añadir lámina': 'AÑADIR DIBUJO', 'Todavía no hay dibujos 🎨': 'AÚN NO HAY DIBUJOS 🎨', 'Aún sin guardar': 'SIN GUARDAR',
    'Conjunto de aventura': 'AVENTURA', '👆 toca cada uno para contar': '👆 TOCA Y CUENTA',
    'Retos (un logro al día por reto)': 'RETOS', 'Tareas de casa (las confirma un adulto)': 'TAREAS DE CASA',
    '🎁 Premios de prueba (provisionales)': '🎁 PREMIOS', 'Todavía ninguno': 'AÚN NINGUNO', 'Recoger los juguetes': 'RECOGER LOS JUGUETES',
    // mensajes
    'No cabe más en Mis dibujos 😢\nPide ayuda a un adulto.': 'NO CABE MÁS 😢\nPIDE AYUDA',
    'No cabe más en Mis dibujos 😢\nPide ayuda a un adulto.\nTu dibujo sigue aquí.': 'NO CABE MÁS 😢\nPIDE AYUDA',
    'Abriendo la lámina… ⏳': 'UN MOMENTO… ⏳', '¡Guardado en Mis dibujos! 🖼️': '¡GUARDADO! 🖼️', '¡Dibujo actualizado! 🖼️': '¡GUARDADO! 🖼️',
    'No se ha podido abrir el dibujo 😢': 'NO SE ABRE 😢', 'No se pudo guardar 😢': 'NO SE PUDO GUARDAR 😢',
    '¡Lámina añadida! 🎉': '¡DIBUJO NUEVO! 🎉', 'Esa imagen no sirve 😢': 'ESA IMAGEN NO SIRVE 😢',
    '¡Personaje guardado! 💖': '¡GUARDADA! 💖', 'Crea y guarda tu personaje en «Vestir» 👗': 'PRIMERO, VISTE A TU MUÑECA 👗',
  }));
  // con una parte que cambia
  const PATRONES = [
    [/^No se ha podido abrir esta lámina 😢\n/, () => 'NO SE ABRE 😢\nTOCA OTRA VEZ'],
    [/^Se ha quitado: (.*)$/, (m) => 'QUITADO: ' + m[1]],
  ];
  // mensajes de adultos o técnicos: sin cambios (ni mayúsculas ni voz)
  const ADULTO = [/^⚠️/, /copia/i, /progreso/i, /ficticios/i, /todo está como antes/, /^Era una foto/, /^Vuelve a tocar/, /Ese archivo/];
  function cambiar(t) {
    if (typeof t !== 'string') return t;
    if (TEXTOS.has(t)) return TEXTOS.get(t);
    for (const [re, f] of PATRONES) { const m = t.match(re); if (m) return f(m); }
    return t;
  }
  const esAdulto = t => typeof t === 'string' && ADULTO.some(re => re.test(t));
  const sinEmojis = t => t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️‍]/gu, '').replace(/\s+/g, ' ').trim();

  // los mensajes: frase sencilla y, si hay sonido y nada más hablando, también con voz
  if (typeof window.toast === 'function') {
    const toast0 = window.toast;
    window.toast = function (t) {
      const adulto = esAdulto(t), s = adulto ? t : cambiar(t);
      toast0(s);
      const el = document.getElementById('toast'); if (el) el.classList.toggle('adulto', adulto);
      if (!adulto && typeof say === 'function') setTimeout(() => {
        try { if (!window.speechSynthesis || !speechSynthesis.speaking) say(sinEmojis(s).toLowerCase()); } catch (e) {}
      }, 120);
    };
  }

  // los textos de la pantalla (solo los de la tabla; fuera de la zona de adultos)
  const FUERA = '#settings,#bkModal,#adModal,#offlineAviso,#pruebasCinta,svg,script,style,textarea,.adulto';
  function pasar(n) {
    if (n.nodeType === 3) {
      const v = n.nodeValue, t = v.trim(); if (!t || (!TEXTOS.has(t) && !PATRONES.some(([re]) => re.test(t)))) return;
      const el = n.parentElement; if (!el || el.closest(FUERA)) return;
      const nuevo = cambiar(t); if (nuevo !== t) n.nodeValue = v.replace(t, nuevo);
      return;
    }
    if (n.nodeType === 1 && !n.matches(FUERA)) for (const c of n.childNodes) pasar(c);
  }
  // (16/11) los títulos se vuelven a ajustar solo cuando cambia la pantalla (clase de una .screen) o hay contenido nuevo
  // fuera de los títulos: los cambios que hace ajustarTitulos en los títulos ya no lo vuelven a llamar (antes, en las
  // pantallas con título, era un bucle de unos 120 cambios por segundo) y los cambios de clase del juego (selección,
  // animaciones) no lo despiertan
  const enTitulo = n => { const e = n.nodeType === 1 ? n : n.parentElement; return !!(e && e.closest('.bar .title')); };
  const obs = new MutationObserver(ms => {
    let ajustar = false;
    for (const m of ms) {
      if (m.type === 'characterData') { pasar(m.target); if (!enTitulo(m.target)) ajustar = true; }
      else if (m.type === 'childList') { m.addedNodes.forEach(pasar); if (!enTitulo(m.target)) ajustar = true; }
      else if (m.target.classList && m.target.classList.contains('screen')) ajustar = true;
    }
    if (ajustar) pronto();
  });
  // los títulos de las barras que no caben en una línea: solo su icono (el nombre queda en la etiqueta para la voz)
  const ICONO = /^((?:\p{Extended_Pictographic}|\uFE0F|\u200D)+)\s*(.+)$/u;
  function ajustarTitulos() {
    document.querySelectorAll('.bar .title').forEach(el => {
      if (!el.getClientRects().length) return;
      // sin icono: en dos líneas
      if (!el.querySelector('.lt-txt') && !ICONO.test(el.textContent.trim())) { const tenia = el.classList.contains('lt-dos'); if (tenia) el.classList.remove('lt-dos'); if (el.scrollWidth > el.clientWidth + 1) el.classList.add('lt-dos'); return; }
      if (!el.querySelector('.lt-txt')) { const m = el.textContent.trim().match(ICONO); if (!m) return;
        el.textContent = ''; const i = document.createElement('span'); i.className = 'lt-ico'; i.textContent = m[1] + ' ';
        const s = document.createElement('span'); s.className = 'lt-txt'; s.textContent = m[2]; el.append(i, s); el.setAttribute('aria-label', m[2]); }
      // se mide sin la clase y solo se cambia si hace falta (sin cambios inútiles)
      const tenia = el.classList.contains('lt-icono'); if (tenia) el.classList.remove('lt-icono');
      const falta = el.scrollWidth > el.clientWidth + 1; if (falta) el.classList.add('lt-icono');
    });
  }
  let rafT = 0; const pronto = () => { if (!rafT) rafT = requestAnimationFrame(() => { rafT = 0; ajustarTitulos(); }); };
  function empezar() {
    pasar(document.body); ajustarTitulos();
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] });
    addEventListener('resize', pronto);
  }
  if (document.body) empezar(); else document.addEventListener('DOMContentLoaded', empezar);

  window.Lectura = {
    cambiar, esAdulto,
    textos(obj) { Object.entries(obj).forEach(([a, b]) => TEXTOS.set(a, b)); if (document.body) pasar(document.body); },
  };
})();
