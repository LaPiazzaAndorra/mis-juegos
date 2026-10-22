#!/usr/bin/env python3
"""
Copia AISLADA del juego para probar la Heladería nueva (21/10/2026). No es el juego de Amaia.

No modifica ningún archivo del juego: genera, dentro de esta carpeta, una copia de index.html con la Heladería nueva y
usa los demás archivos del juego tal cual (gracias a <base href="../../../">). La copia de Pintar
(../pintar-2026-10-21/, versión de referencia 708c2f2) no se toca: aquí Pintar es el del juego.

Cambios respecto a ../../../index.html (cada sustitución comprueba que el texto original existe una sola vez):
  1. «aislamiento.js» antes que nada: datos propios («hel1:» en localStorage, «hel1-» en IndexedDB). No lee, cambia
     ni migra las claves del juego ni las de las otras copias. Si no se puede, se detiene.
  2. Siempre en modo de pruebas, con su cinta y su propio manifiesto («PRUEBA HELADERÍA»). Sin service worker.
  3. Heladería:
     · entrada nueva con dos modos: «Inventar helados» (juego libre) y «Atender pedidos»; se puede cambiar de modo
       desde la propia heladería;
     · se ve entera en el iPhone (vertical y horizontal) y en el iPad, sin desplazar; el helado se adapta al espacio;
     · juego libre: cucurucho o vasito, hasta 4 bolas y 3 adornos, «quitar la última» (deshace el último cambio,
       también «empezar de nuevo»), «¡A probar!» (el animal lo
       saborea) y foto a «Mis dibujos». No da estrellas ni monedas;
     · pedidos con retos cortos por niveles: colores, cantidades (número y puntos), dos sabores con cantidades y
       memoria (el pedido se tapa; «👀» lo enseña otra vez sin castigo). Fallar da una pista concreta y se reintenta;
       nunca se quita nada;
     · contador de bolas en el mostrador para ayudar a contar;
     · economía SIN CAMBIOS: pedido correcto = +1 ⭐ (addStar), monedas = bolas + adorno, iceServed + 1, confeti cada 5.
     · nivel en una clave nueva «lv_heladeria» ({L, ok}): sigue el patrón lv_<juego> de Pensar, así entra en
       «Guardar mi progreso» sin cambiar progreso.js. Sube tras 3 aciertos en el nivel; nunca baja.
  4. «addToGallery» seguro (el de la copia de Pintar): si no cabe, no se borran dibujos antiguos.

Uso (desde la raíz del repositorio): python3 docs/propuestas/heladeria-2026-10-21/preparar_copia.py
"""
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[2]
CARPETA = 'docs/propuestas/heladeria-2026-10-21/'


def sustituir(texto, viejo, nuevo, veces=1):
    n = texto.count(viejo)
    assert n == veces, f'esperado {veces} vez/veces y encontrado {n}: {viejo[:80]!r}'
    return texto.replace(viejo, nuevo)


def bloque(texto, desde, hasta, nuevo):
    """Sustituye el texto entre dos marcas (la primera incluida, la segunda no), comprobando que son únicas."""
    assert texto.count(desde) == 1 and texto.count(hasta) == 1, (desde[:50], hasta[:50])
    i, j = texto.index(desde), texto.index(hasta)
    assert i < j
    return texto[:i] + nuevo + texto[j:]


MENU_ROLE_VIEJO = '<button class="big c1" data-go="ice"><span class="ill" data-ill="helado"></span>Heladería</button>'
MENU_ROLE_NUEVO = '<button class="big c1" data-go="m-ice"><span class="ill" data-ill="helado"></span>Heladería</button>'

MENU_ICE = """<section class="screen" id="m-ice">
  <div class="bar"><button class="btn" data-go="m-role">⬅️</button><div class="title">🍦 Heladería</div><div class="stars">⭐ <b class="sc">0</b></div></div>
  <div class="menu">
    <button class="big c5" data-go="ice" data-arg="libre"><span class="ill" data-ill="helado"></span>Inventar helados</button>
    <button class="big c4" data-go="ice" data-arg="pedidos"><span class="ill" data-ill="pedido"></span>Atender pedidos</button>
  </div>
</section>

<section class="screen" id="m-think">"""

ICE_HTML_VIEJO_INICIO = '<!-- HELADERÍA -->'
ICE_HTML_VIEJO_FIN = '<!-- VESTIR -->'
ICE_HTML_NUEVO = """<!-- HELADERÍA (copia 21/10: juego libre y pedidos con retos) -->
<section class="screen" id="ice">
  <div class="bar ibar"><button class="btn" data-go="m-ice" aria-label="Volver">⬅️</button><div class="title" id="iceTitle">🍦 Heladería</div>
    <button class="btn imode" data-m="libre" aria-label="Inventar helados">🎨</button><button class="btn imode" data-m="pedidos" aria-label="Atender pedidos">🛎️</button>
    <div class="stars">🪙 <b id="coins">0</b></div></div>
  <div class="ice-main">
    <div class="cust"><div class="animal" id="iceAnimal">🐻</div><div class="bubble" id="iceOrder"></div>
      <div class="ilv" id="iceLv"></div></div>
    <div class="counter" id="iceWrap"><div id="iceBuild"></div><b class="icnt" id="iceCnt"></b></div>
  </div>
  <div class="ice-pick">
    <div class="prow" id="iceBases"></div>
    <div class="prow" id="iceFlavs"></div>
    <div class="prow" id="iceTops"></div>
    <div class="prow iacts"><button class="btn" id="iceUndo" aria-label="Quitar la última">↩️</button><button class="btn" id="iceReset" aria-label="Empezar de nuevo">🔄</button>
      <button class="btn" id="iceLook" aria-label="Mirar otra vez el pedido">👀</button>
      <button class="btn" id="iceTaste" aria-label="¡A probar!">😋</button><button class="btn" id="icePhoto" aria-label="Foto">📸</button>
      <button class="btn igive" id="iceGive">✅ ¡Toma!</button></div>
  </div>
</section>

"""

CSS = """<style>
/* ---------- Heladería · copia de prueba 21/10/2026 ----------
   Rejilla: barra arriba, cliente y mostrador en medio, elegir abajo (o a la derecha en el iPhone horizontal).
   Botones de 52–64 px; el helado se ajusta al espacio (--u lo calcula iceFit). */
#ice{--b:58px}
#ice.screen.on{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;grid-template-areas:"bar" "main" "pick";
  padding-bottom:calc(30px + env(safe-area-inset-bottom))}
#ice .ibar{grid-area:bar}
#ice .ibar .imode{width:var(--b);min-width:var(--b);padding:0}
#ice .ice-main{grid-area:main;display:flex;align-items:stretch;justify-content:center;gap:12px;padding:4px 12px;min-height:0}
#ice .cust{flex:1 1 44%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:0;min-width:0}
#ice .animal{font-size:clamp(56px,12vmin,120px)}
#ice .animal.happy{animation:pop .5s}
#ice .bubble{min-height:90px;min-width:140px;max-width:100%;padding:12px 16px;flex-direction:column;align-items:center;gap:6px}
#ice .bubble.cover{background:#f3ecfb}
#ice .ord{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center}
#ice .ord .n{font-size:clamp(34px,7vmin,54px);font-weight:900;color:var(--purple);line-height:1}
#ice .ord .x{font-size:24px;font-weight:900;opacity:.6}
#ice .bola{width:clamp(30px,6vmin,46px);height:clamp(26px,5.2vmin,40px);border-radius:50% 50% 44% 44%;box-shadow:inset -4px -4px 0 rgba(0,0,0,.08);border:2px solid rgba(74,58,92,.15)}
#ice .puntos{display:flex;gap:5px}
#ice .puntos i{width:12px;height:12px;border-radius:50%;background:var(--purple);display:block}
#ice .ord .ico{font-size:clamp(26px,5vmin,40px);line-height:1;display:flex;align-items:flex-end}
#ice .tapa{font-size:clamp(44px,9vmin,70px);line-height:1}
#ice .ilv{font-weight:900;color:var(--soft);font-size:15px;background:#fff;border-radius:14px;padding:4px 10px;box-shadow:0 2px 0 rgba(0,0,0,.06)}
#ice .counter{flex:0 1 auto;position:relative;min-width:0;min-height:0;height:100%;max-height:640px;max-width:55%;aspect-ratio:3/4;padding:12px;align-items:flex-end;overflow:hidden}
#ice .icnt{position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:50%;background:var(--purple);color:#fff;font-size:26px;display:flex;align-items:center;justify-content:center}
#ice .icnt:empty{display:none}
#ice .icnt.pulse{animation:pop .45s}
#ice .ice .itop{white-space:nowrap}
#ice .ice-pick{grid-area:pick;display:flex;flex-direction:column;gap:6px;padding:6px 10px 6px}
#ice .prow{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center}
#ice .prow .btn{width:var(--b);min-width:var(--b);height:var(--b);padding:0;font-size:calc(var(--b)*.5)}
#ice .prow .btn.sel{background:var(--lila2);box-shadow:0 0 0 4px var(--purple) inset,var(--shadow)}
#ice .prow .igive{width:auto;padding:0 18px;font-size:calc(var(--b)*.4);background:var(--green);color:#fff}
#ice .fl{width:var(--b);height:var(--b)}
#ice [hidden]{display:none!important}
@media (max-width:560px) and (orientation:portrait){#ice{--b:52px}#ice .prow{gap:6px}}
@media (min-width:700px) and (min-height:700px){#ice{--b:64px}#ice .bubble .ice.small{--u:.85px}#ice .bubble{min-width:200px;padding:18px 22px}}
/* iPhone horizontal (bajito): barra arriba; cliente y mostrador a la izquierda; elegir a la derecha */
@media (orientation:landscape) and (max-height:540px){
  #ice{--b:44px}
  #ice.screen.on{grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto minmax(0,1fr);grid-template-areas:"bar bar" "main pick"}
  #ice .ibar{padding:6px 10px}#ice .ibar .btn{height:46px;min-width:46px;width:46px;font-size:22px}
  #ice .ice-pick{justify-content:center;max-width:330px;gap:5px;padding:0 10px 0 0}
  #ice .prow{gap:5px}
  #ice .bubble{min-height:70px;padding:8px 12px}
  #ice .ilv{display:none}
}
</style>
"""

ILL_PEDIDO = """  pedido:svg(`<rect x="18" y="58" width="84" height="48" rx="10" fill="#ffb3d1" ${S}/><path d="M18 70h84" stroke="${INK}" stroke-width="4"/>
    <path d="M40 58a20 20 0 0 1 40 0" fill="#fff3c4" ${S}/><circle cx="60" cy="34" r="6" fill="#ffd46b" ${S}/>${face(60,86,.8)}${spark(100,22,9)}${spark(18,30,7,'#a083ff')}`),
"""

ICE_JS_VIEJO_INICIO = '/* ================= HELADERÍA ================= */'
ICE_JS_VIEJO_FIN = '/* ================= VESTIR · creador de avatar ================= */'
ICE_JS_NUEVO = r"""/* ================= HELADERÍA (copia 21/10: juego libre y pedidos con retos) =================
   Economía sin cambios: pedido correcto = +1 ⭐, monedas = bolas + adorno, «iceServed» + 1. El juego libre no da nada.
   Nivel de los pedidos: «lv_heladeria» = {L, ok}; sube tras 3 aciertos; nunca baja. */
const FLAV=[{c:'#ff8fb8',n:'fresa',col:'rosa'},{c:'#8b5a3c',n:'chocolate',col:'marrón'},{c:'#fff1c9',n:'vainilla',col:'blanca'},
  {c:'#8de0b5',n:'menta',col:'verde'},{c:'#a98bff',n:'mora',col:'lila'},{c:'#fff176',n:'limón',col:'amarilla'}];
const TOPS=[{e:'🍒',n:'una cereza'},{e:'🍓',n:'una fresa'},{e:'⭐',n:'una estrella'},{e:'🍪',n:'una galleta'},{e:'🍫',n:'chocolate'}];
const BASES={cono:'cucurucho',vaso:'vasito'};
const CUST=['🐻','🐰','🐱','🦊','🐼','🐸','🐷','🦁','🐨','🐵','🦄','🐧','🐶','🐯','🐮','🐭'];
const NUM=['ninguna','una','dos','tres','cuatro'];
const NIVELES=[
  {t:'color',nom:'Colores'},          // 1 bola: «una bola rosa»
  {t:'cantidad',min:1,max:2,nom:'Contar'},  // 1–2 bolas iguales
  {t:'cantidad',min:2,max:3,top:true,nom:'Contar'},  // 2–3 bolas iguales y, a veces, adorno
  {t:'mezcla',nom:'Dos sabores'},     // «dos de fresa y una de limón»
  {t:'memoria',max:2,nom:'Memoria'},  // el pedido se tapa
  {t:'todo',nom:'De todo'}];
const MAXB=4,MAXT_LIBRE=3;
const leerNivel=()=>{const v=store.get('lv_heladeria',null),n={L:0,ok:0};if(v&&typeof v==='object'){n.L=clamp(v.L|0,0,NIVELES.length-1);n.ok=clamp(v.ok|0,0,2)}return n};
const ICE={served:store.get('iceServed',0),coins:store.get('iceCoins',0),mode:'pedidos',order:null,build:null,nv:leerNivel(),busy:false,hist:[]};
/* «quitar la última»: se guarda una copia del helado antes de cada cambio (hasta 20) */
const antesDeCambiar=()=>{ICE.hist.push(JSON.stringify(ICE.build));if(ICE.hist.length>20)ICE.hist.shift()};
const nuevoHelado=()=>{ICE.hist=[];return{base:null,scoops:[],tops:[]}};
const bolaHTML=f=>`<span class="bola" style="background:${FLAV[f].c}"></span>`;
function iceHTML(o,small){
  let h=`<div class="ice${small?' small':''}"><div class="itop">${(o.tops||[]).map(i=>TOPS[i].e).join('')}</div>`;
  for(let i=o.scoops.length-1;i>=0;i--)h+=`<div class="scoop" style="background:${FLAV[o.scoops[i]].c};z-index:${i+1}"></div>`;
  return h+(o.base?`<div class="${o.base}"></div>`:'<div class="nobase"></div>')+'</div>';
}
const cuenta=a=>{const c={};a.forEach(f=>c[f]=(c[f]||0)+1);return c};
function lista(o,porColor){
  const c=cuenta(o.scoops),k=Object.keys(c);
  const p=k.map(f=>(c[f]===1?'una bola':NUM[c[f]]+' bolas')+(porColor?' '+FLAV[f].col+(c[f]>1?'s':''):' de '+FLAV[f].n));
  return p.length>1?p.slice(0,-1).join(', ')+' y '+p.at(-1):p[0];
}
function orderText(o){
  const porColor=o.t==='color';
  return`Hola. Quiero un ${BASES[o.base]} con ${lista(o,porColor)}${o.tops.length?', y '+TOPS[o.tops[0]].n+' encima':''}. ¡Por favor!`;
}
/* ---------- pedidos ---------- */
function crearPedido(){
  let nv=NIVELES[ICE.nv.L],t=nv.t;
  if(t==='todo')t=pick(['color','cantidad','mezcla','memoria']);
  const o={t,base:pick(['cono','vaso']),scoops:[],tops:[]};
  const f1=rnd(FLAV.length);
  if(t==='color')o.scoops=[f1];
  else if(t==='cantidad'){const lo=nv.min||1,hi=nv.max||3;o.scoops=Array(lo+rnd(hi-lo+1)).fill(f1)}
  else if(t==='mezcla'){let f2;do f2=rnd(FLAV.length);while(f2===f1);o.scoops=[f1,f1,f2]}   // «dos de … y una de …»
  else{const m=nv.max||3,n=1+rnd(m);for(let i=0;i<n;i++)o.scoops.push(rnd(FLAV.length))}
  if((nv.top||ICE.nv.L>=4)&&rnd(2))o.tops=[rnd(TOPS.length)];
  return o;
}
function pintaPedido(tapar){
  const o=ICE.order,b=$('#iceOrder');b.classList.toggle('cover',!!tapar);
  if(tapar){b.innerHTML='<div class="tapa">🤔</div><div class="ord"><span class="ico">👀</span></div>';return}
  const base=`<span class="ico"><div class="ice small" style="--u:.3px"><div class="${o.base}"></div></div></span>`,top=o.tops.length?`<span class="ico">+ ${TOPS[o.tops[0]].e}</span>`:'';
  if(o.t==='cantidad'){const n=o.scoops.length;
    b.innerHTML=`<div class="ord"><span class="n">${n}</span><span class="x">×</span>${bolaHTML(o.scoops[0])}</div><div class="puntos">${'<i></i>'.repeat(n)}</div><div class="ord">${base}${top}</div>`}
  else if(o.t==='mezcla'){const c=cuenta(o.scoops);
    b.innerHTML=Object.keys(c).map(f=>`<div class="ord"><span class="n">${c[f]}</span><span class="x">×</span>${bolaHTML(+f)}</div>`).join('')+`<div class="ord">${base}${top}</div>`}
  else b.innerHTML=iceHTML(o,true);
}
let tapaT=null,sigT=null;   // tapar el pedido (memoria) · siguiente cliente tras un acierto
function verPedido(seg){
  clearTimeout(tapaT);pintaPedido(false);
  if(ICE.order&&ICE.order.t==='memoria')tapaT=setTimeout(()=>{if(ICE.mode==='pedidos'&&current==='ice')pintaPedido(true)},seg*1000);
}
function iceNew(){
  clearTimeout(sigT);ICE.order=crearPedido();ICE.build=nuevoHelado();ICE.busy=false;
  const a=$('#iceAnimal');a.textContent=pick(CUST);a.classList.remove('enter','happy');void a.offsetWidth;a.classList.add('enter');
  const nv=NIVELES[ICE.nv.L];$('#iceLv').textContent=`Nivel ${ICE.nv.L+1} · ${nv.nom} ${'●'.repeat(ICE.nv.ok)}${'○'.repeat(3-ICE.nv.ok)}`;
  verPedido(ICE.order.t==='memoria'?(ICE.order.scoops.length>1?5:4):0);iceDraw();
  const o=ICE.order;   // la voz solo habla si este pedido sigue en pantalla (se puede cambiar de modo antes)
  setTimeout(()=>{if(ICE.order===o&&current==='ice')say(o.t==='memoria'?'¡Mira bien mi helado y recuérdalo! '+orderText(o):orderText(o))},400);
}
/* ---------- juego libre ---------- */
function iceLibre(){
  clearTimeout(tapaT);clearTimeout(sigT);ICE.order=null;ICE.build=nuevoHelado();
  const a=$('#iceAnimal');a.textContent=pick(CUST);a.classList.remove('enter','happy');void a.offsetWidth;a.classList.add('enter');
  $('#iceOrder').classList.remove('cover');$('#iceOrder').innerHTML='<div class="tapa">🎨</div><div class="ord"><span class="ico">😋</span></div>';
  $('#iceLv').textContent='Juego libre';iceDraw();setTimeout(()=>{if(ICE.mode==='libre'&&current==='ice')say('¡Invéntate un helado! Cuando quieras, dámelo a probar.')},400);
}
function setMode(m){
  ICE.mode=m==='libre'?'libre':'pedidos';const L=ICE.mode==='libre';
  $$('#ice .imode').forEach(b=>b.classList.toggle('sel',b.dataset.m===ICE.mode));
  $('#iceTitle').textContent=L?'🎨 Inventar':'🛎️ Pedidos';
  $('#iceGive').hidden=L;$('#iceLook').hidden=L;$('#iceTaste').hidden=!L;$('#icePhoto').hidden=!L;
  L?iceLibre():iceNew();
}
/* ---------- dibujo y tamaño ---------- */
function iceFit(){
  const w=$('#iceWrap');if(!w.clientHeight)return;
  const n=Math.max(1,ICE.build?ICE.build.scoops.length:1),alto=34+n*100-(n-1)*32+110+30;   // adorno + bolas + base + margen
  const u=Math.min((w.clientHeight-28)/Math.max(alto,330),(w.clientWidth-24)/160,1.35);
  $('#iceBuild').firstElementChild&&$('#iceBuild').firstElementChild.style.setProperty('--u',Math.max(.35,u).toFixed(3)+'px');
}
function iceDraw(){
  const b=ICE.build;$('#iceBuild').innerHTML=iceHTML(b);$('#coins').textContent=ICE.coins;
  $('#iceCnt').textContent=b.scoops.length||'';
  $$('#iceBases .btn').forEach(x=>x.classList.toggle('sel',x.dataset.k===b.base));
  $$('#iceTops .btn').forEach(x=>x.classList.toggle('sel',b.tops.includes(+x.dataset.i)));
  iceFit();
}
window.addEventListener('resize',()=>{if(current==='ice')iceFit()});
(function(){
  Object.keys(BASES).forEach(k=>{const b=document.createElement('button');b.className='btn';b.dataset.k=k;b.setAttribute('aria-label',BASES[k]);
    b.innerHTML=`<div class="ice small" style="--u:.3px"><div class="${k}"></div></div>`;
    b.onclick=()=>{if(ICE.build.base!==k){antesDeCambiar();ICE.build.base=k}iceDraw();sfx.pop();say(BASES[k])};$('#iceBases').appendChild(b)});
  FLAV.forEach((f,i)=>{const b=document.createElement('button');b.className='fl';b.style.background=f.c;b.setAttribute('aria-label',f.n);
    b.onclick=()=>{const s=ICE.build.scoops;if(s.length>=MAXB){sfx.bad();say('¡Ya no caben más bolas!');return}
      antesDeCambiar();s.push(i);iceDraw();sfx.count(s.length);const c=$('#iceCnt');c.classList.remove('pulse');void c.offsetWidth;c.classList.add('pulse');
      const t=ICE.mode==='pedidos'&&ICE.order?ICE.order.t:'';
      say(t==='cantidad'||t==='mezcla'?NUM[s.length]:t==='color'?f.col:f.n)};$('#iceFlavs').appendChild(b)});
  TOPS.forEach((t,i)=>{const b=document.createElement('button');b.className='btn';b.dataset.i=i;b.textContent=t.e;b.setAttribute('aria-label',t.n);
    b.onclick=()=>{const T=ICE.build.tops,on=T.includes(i);
      if(ICE.mode==='libre'&&!on&&T.length>=MAXT_LIBRE){sfx.bad();say('¡Ya hay muchos adornos!');return}
      antesDeCambiar();
      if(ICE.mode==='libre'){if(on)T.splice(T.indexOf(i),1);else T.push(i)}
      else ICE.build.tops=on?[]:[i];
      iceDraw();sfx.pop()};$('#iceTops').appendChild(b)});
})();
$('#iceUndo').onclick=()=>{const s=ICE.hist.pop();if(!s){sfx.bad();return}ICE.build=JSON.parse(s);iceDraw();tone(420,.1,'triangle')};
/* empezar de nuevo también se puede deshacer */
$('#iceReset').onclick=()=>{const b=ICE.build;if(!b.base&&!b.scoops.length&&!b.tops.length)return;const h=ICE.hist.concat(JSON.stringify(b));ICE.build=nuevoHelado();ICE.hist=h.slice(-20);iceDraw();tone(300,.15,'triangle')};
$('#iceLook').onclick=()=>{if(!ICE.order)return;verPedido(3);say(orderText(ICE.order))};
$('#iceOrder').onclick=$('#iceAnimal').onclick=()=>{if(ICE.mode==='pedidos'&&ICE.order){if(ICE.order.t!=='memoria')verPedido(0);say(orderText(ICE.order))}else $('#iceTaste').click()};
$$('#ice .imode').forEach(b=>b.onclick=()=>{sfx.pop();setMode(b.dataset.m)});
$('#iceTaste').onclick=()=>{
  const b=ICE.build;if(!b.scoops.length){sfx.bad();say('¡Primero pon alguna bola!');return}
  const a=$('#iceAnimal');a.classList.remove('enter','happy');void a.offsetWidth;a.classList.add('happy');sfx.good();
  say(pick(['¡Mmm!','¡Qué rico!','¡Delicioso!'])+' '+lista(b,false)+(b.tops.length?', con '+b.tops.map(i=>TOPS[i].n).join(' y '):'')+'.');
};
$('#icePhoto').onclick=()=>{
  const b=ICE.build;if(!b.scoops.length){sfx.bad();say('¡Primero pon alguna bola!');return}
  const c=document.createElement('canvas');c.width=600;c.height=800;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,800);g.addColorStop(0,'#fff6fb');g.addColorStop(1,'#efe4ff');x.fillStyle=g;x.fillRect(0,0,600,800);
  const u=1.6,cx=300;let y=740;
  x.lineWidth=5;x.strokeStyle='#4a3a5c';x.lineJoin='round';
  if(b.base==='cono'){x.fillStyle='#e8a85c';x.beginPath();x.moveTo(cx-58*u,y-140*u);x.lineTo(cx+58*u,y-140*u);x.lineTo(cx,y);x.closePath();x.fill();x.stroke();y-=140*u}
  else if(b.base==='vaso'){x.fillStyle='#ff8fb8';x.beginPath();x.moveTo(cx-70*u,y-80*u);x.lineTo(cx+70*u,y-80*u);x.lineTo(cx+70*u,y-40*u);x.quadraticCurveTo(cx+70*u,y,cx,y);x.quadraticCurveTo(cx-70*u,y,cx-70*u,y-40*u);x.closePath();x.fill();x.stroke();y-=80*u}
  b.scoops.forEach(f=>{x.fillStyle=FLAV[f].c;x.beginPath();x.ellipse(cx,y-38*u,60*u,50*u,0,0,Math.PI*2);x.fill();x.stroke();y-=68*u});
  x.font=`${70*u}px system-ui,"Apple Color Emoji","Noto Color Emoji"`;x.textAlign='center';x.textBaseline='middle';
  b.tops.forEach((t,i)=>x.fillText(TOPS[t].e,cx+(i-(b.tops.length-1)/2)*70*u,y-10*u));
  if(addToGallery(c.toDataURL('image/jpeg',.85))){sfx.good();say('¡Foto guardada en Mis dibujos!')}
};
$('#iceGive').onclick=()=>{
  if(ICE.busy||!ICE.order)return;const o=ICE.order,b=ICE.build,srt=a=>a.slice().sort().join();
  if(b.base===o.base&&srt(b.scoops)===srt(o.scoops)&&b.tops.join()===o.tops.join()){
    ICE.busy=true;clearTimeout(tapaT);pintaPedido(false);
    ICE.served++;ICE.coins+=o.scoops.length+(o.tops.length?1:0);store.set('iceServed',ICE.served);store.set('iceCoins',ICE.coins);
    sfx.good();addStar();const a=$('#iceAnimal');a.classList.remove('enter','happy');void a.offsetWidth;a.classList.add('happy');
    let sube=false;ICE.nv.ok++;if(ICE.nv.ok>=3){if(ICE.nv.L<NIVELES.length-1){ICE.nv.L++;sube=true}ICE.nv.ok=0}store.set('lv_heladeria',ICE.nv);
    say(pick(['¡Gracias! ¡Qué rico!','¡Mmm, delicioso!','¡Justo lo que quería!','¡Eres la mejor heladera!'])+(sube?' ¡Has subido de nivel!':''));
    if(sube||ICE.served%5===0)confetti();iceDraw();sigT=setTimeout(()=>{if(ICE.mode==='pedidos'&&current==='ice')iceNew()},2400);
  }else{
    sfx.bad();const bb=$('#iceOrder');bb.classList.remove('shake');void bb.offsetWidth;bb.classList.add('shake');
    const co=cuenta(o.scoops),cb=cuenta(b.scoops),falta=Object.keys(co).find(f=>(cb[f]||0)<co[f]),sobra=Object.keys(cb).find(f=>(co[f]||0)<cb[f]);
    let msg='Mmm, no es lo que pedí. ¡Mira mi pedido!';
    if(b.base!==o.base)msg=`Yo quería un ${BASES[o.base]}.`;
    else if(b.scoops.length!==o.scoops.length){const n=b.scoops.length,m=o.scoops.length;msg=`Tienes ${NUM[n]} ${n===1?'bola':'bolas'} y yo quiero ${NUM[m]}. ¡Cuéntalas!`;
      const c=$('#iceCnt');c.classList.remove('pulse');void c.offsetWidth;c.classList.add('pulse')}
    else if(falta!=null)msg=o.t==='color'?`Yo quería una bola ${FLAV[falta].col}.`:`Me falta ${co[falta]-(cb[falta]||0)===1?'una bola':'bolas'} de ${FLAV[falta].n}`+(sobra!=null?` y sobra ${FLAV[sobra].n}.`:'.');
    else if(b.tops.join()!==o.tops.join())msg=o.tops.length?`Me falta ${TOPS[o.tops[0]].n} encima.`:'Yo no quería nada encima.';
    if(o.t==='memoria')verPedido(3);   // pista: se vuelve a ver un momento
    say(msg+' ¡Prueba otra vez!');
  }
};
onShow.ice=arg=>{ICE.coins=store.get('iceCoins',0);ICE.served=store.get('iceServed',0);ICE.nv=leerNivel();setMode(arg||ICE.mode)};
onLeave.ice=()=>{clearTimeout(tapaT);clearTimeout(sigT)};

"""

GAL_VIEJO = """function addToGallery(url){
  const g=store.get('gal',[]);g.unshift(url);
  while(g.length){if(store.set('gal',g)){toast('¡Guardado! 🖼️');return true}g.pop()}
  toast('No hay espacio 😢');return false;
}"""
GAL_NUEVO = """function addToGallery(url){   /* copia 21/10 (como en Pintar): si no cabe, NO se borran los dibujos antiguos */
  const g=store.get('gal',[]);g.unshift(url);
  if(store.set('gal',g)){toast('¡Guardado! 🖼️');return true}
  toast('No cabe más en Mis dibujos 😢\\nPide ayuda a un adulto.');return false;
}"""

if __name__ == '__main__':
    h = (RAIZ / 'index.html').read_text(encoding='utf-8')
    # 1-2. aislamiento, modo de pruebas, rutas y sin service worker
    h = sustituir(h, '<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="../../../">\n'
                  f'<script src="{CARPETA}aislamiento.js"></script>')
    h = sustituir(h, "window.MODO_PRUEBAS=['raw.githack.com','rawcdn.githack.com'].includes(location.hostname)||\n"
                     "  (['localhost','127.0.0.1'].includes(location.hostname)&&/[?&]pruebas\\b/.test(location.search));",
                  "window.MODO_PRUEBAS=true; /* copia aislada de la Heladería: siempre en modo de pruebas */")
    h = sustituir(h, "document.querySelector('link[rel=manifest]').href='manifest-pruebas.json';",
                  f"document.querySelector('link[rel=manifest]').href='{CARPETA}manifest.json';")
    h = sustituir(h, "content='PRUEBAS';document.title='PRUEBAS · Mi Mundo de Juegos'",
                  "content='PRUEBA HELADERÍA';document.title='PRUEBA HELADERÍA · Mi Mundo de Juegos'")
    h = sustituir(h, "if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});",
                  "/* copia aislada de la Heladería: no se registra ningún service worker (necesita conexión) */")
    h = sustituir(h, '🧪 VERSIÓN DE PRUEBAS · datos ficticios</div>', '🧪 PRUEBA HELADERÍA · datos propios</div>')
    # 3. Heladería
    h = sustituir(h, '<link rel="stylesheet" href="avatar/avatar.css">', '<link rel="stylesheet" href="avatar/avatar.css">\n' + CSS)
    h = sustituir(h, MENU_ROLE_VIEJO, MENU_ROLE_NUEVO)
    h = sustituir(h, '<section class="screen" id="m-think">', MENU_ICE)
    h = bloque(h, ICE_HTML_VIEJO_INICIO, ICE_HTML_VIEJO_FIN, ICE_HTML_NUEVO)
    h = sustituir(h, "  arcoiris:svg(", ILL_PEDIDO + "  arcoiris:svg(")
    h = bloque(h, ICE_JS_VIEJO_INICIO, ICE_JS_VIEJO_FIN, ICE_JS_NUEVO)
    # 4. galería segura
    h = sustituir(h, GAL_VIEJO, GAL_NUEVO)
    h = ('<!-- COPIA AISLADA para probar la Heladería nueva (generada por preparar_copia.py desde index.html). '
         'No es el juego de Amaia. -->\n') + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    print('index.html generado:', len(h), 'caracteres')
