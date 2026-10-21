#!/usr/bin/env python3
"""
Copia AISLADA del juego para probar las mejoras de «Pintar» (21/10/2026). No es el juego de Amaia.

No modifica ningún archivo del juego: genera, dentro de esta carpeta, una copia de index.html con los cambios de
Pintar y usa todos los demás archivos del juego tal cual (gracias a <base href="../../../">).

Cambios respecto a ../../../index.html (cada sustitución comprueba que el texto original existe una sola vez):
  1. «aislamiento.js» antes que nada: datos propios («pin1:» en localStorage, «pin1-» en IndexedDB). No lee, cambia
     ni migra las claves del juego ni las de las otras copias (d016, d021, d023, d026). Si no se puede, se detiene.
  2. Siempre en modo de pruebas, con su cinta y su propio manifiesto («PRUEBA PINTAR»). Sin service worker.
  3. Pintar:
     · todas las herramientas a la vista, sin desplazar la barra (en el iPhone vertical, en dos filas; en el iPhone
       horizontal, en columnas a los lados para que el papel sea más alto);
     · colores: los 15 a la vista, más fáciles de distinguir (marca ✓ en el elegido, sin agrandarlo), con su nombre
       dicho en voz alta; el pincel muestra el color elegido;
     · deshacer y REHACER (↪️), con más pasos (hasta 20, según la memoria) y sin perderlos al girar el dispositivo;
       girar ya no encoge el dibujo;
     · 🗑️ pide un segundo toque antes de borrar todo (y se puede deshacer);
     · guardar: cada dibujo se guarda en SU entrada de «Mis dibujos» (volver a guardar la actualiza, no duplica); un
       dibujo abierto desde la galería se guarda como copia nueva (el original no cambia); si no hay espacio, NO se
       borra ningún dibujo antiguo: se avisa y el dibujo sigue en pantalla.
     · el cubo no gasta un paso de deshacer cuando no pinta nada;
  4. Láminas nuevas candidatas (heladería, gatito, hada, unicornio, perrito, conejito, princesa, helado, mariposa, explorador, hada-jardin, sirena; laminas/*.png): primeras de la lista, con su proporción 2:3
     sin deformar, y relleno de las zonas diminutas (ver LAMINAS_JS). Las 19 láminas anteriores se conservan.

Uso (desde la raíz del repositorio): python3 docs/propuestas/pintar-2026-10-21/preparar_copia.py
"""
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[2]
CARPETA = 'docs/propuestas/pintar-2026-10-21/'


def sustituir(texto, viejo, nuevo, veces=1):
    n = texto.count(viejo)
    assert n == veces, f'esperado {veces} vez/veces y encontrado {n}: {viejo[:80]!r}'
    return texto.replace(viejo, nuevo)


# ---------------------------------------------------------------- HTML de la pantalla de Pintar
PAINT_VIEJO = """<section class="screen" id="paint">
  <div class="bar">
    <button class="btn" data-go="m-paint">⬅️</button>
    <button class="btn tool sel" data-tool="brush">🖌️</button>
    <button class="btn tool" data-tool="rainbow">🌈</button>
    <button class="btn tool" data-tool="fill">🪣</button>
    <button class="btn tool" data-tool="stamp">⭐</button>
    <button class="btn tool" data-tool="eraser">🧽</button>
    <div class="sep"></div>
    <button class="btn" id="undoBtn">↩️</button>
    <button class="btn" id="clearBtn">🗑️</button>
    <button class="btn" id="saveBtn">💾</button>
  </div>
  <div class="pwrap" id="pwrap"><div class="cv" id="cv"><canvas id="pc"></canvas><canvas id="oc"></canvas></div></div>
  <div class="bar" id="pbottom"><div id="sizes" style="display:flex;gap:8px"></div><div class="sep"></div><div id="colors" style="display:flex;gap:10px;align-items:center"></div><div id="stamps" style="display:none;gap:8px"></div></div>
</section>"""
PAINT_NUEVO = """<section class="screen" id="paint">
  <div class="ptop">
    <div class="pgrp ptools">
      <button class="btn" data-go="m-paint" aria-label="Volver">⬅️</button>
      <button class="btn tool sel" data-tool="brush" aria-label="Pincel">🖌️<i class="pdot" id="pdot"></i></button>
      <button class="btn tool" data-tool="rainbow" aria-label="Arcoíris">🌈</button>
      <button class="btn tool" data-tool="fill" aria-label="Cubo de pintura">🪣</button>
      <button class="btn tool" data-tool="stamp" aria-label="Pegatinas">⭐</button>
      <button class="btn tool" data-tool="eraser" aria-label="Goma">🧽</button>
    </div>
    <div class="pgrp pacts">
      <button class="btn" id="undoBtn" aria-label="Deshacer">↩️</button>
      <button class="btn" id="redoBtn" aria-label="Rehacer">↪️</button>
      <button class="btn" id="clearBtn" aria-label="Borrar todo">🗑️</button>
      <button class="btn" id="saveBtn" aria-label="Guardar">💾</button>
    </div>
  </div>
  <div class="pwrap" id="pwrap"><div class="cv" id="cv"><canvas id="pc"></canvas><canvas id="oc"></canvas></div></div>
  <div class="pbot" id="pbottom"><div id="sizes" class="pgrp psizes"></div><div id="colors" class="pal"></div><div id="stamps" class="pal" style="display:none"></div></div>
</section>"""

# ---------------------------------------------------------------- estilos nuevos (van después de los del juego)
CSS = """<style>
/* ---------- Pintar · copia de prueba 21/10/2026 ----------
   Todo a la vista sin desplazar: rejilla con el papel en medio. Botones de 52–58 px y colores de 44 px o más. */
#paint.screen.on{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;
  grid-template-areas:"top" "mid" "bot"}
#paint .ptop{grid-area:top;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px 16px;padding:10px 10px 6px}
#paint .pwrap{grid-area:mid;padding:4px 10px}
#paint .pbot{grid-area:bot;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px 16px;padding:6px 10px 10px}
#paint .pgrp{display:flex;gap:8px;flex-wrap:nowrap;align-items:center}
#paint .btn{position:relative}
#paint .btn.off{opacity:.35}
#paint .pdot{position:absolute;right:5px;bottom:5px;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1.5px rgba(74,58,92,.35)}
#paint #clearBtn.arm{background:#ffe3e3;box-shadow:0 0 0 4px var(--red) inset,var(--shadow);animation:shake .45s}
/* paleta: rejilla de botones; el color va en un círculo dentro (zona táctil mayor que el círculo) */
#paint .pal{display:grid;grid-template-columns:repeat(var(--pc,15),var(--ps,52px));gap:6px;justify-content:center}
#paint .sw{width:var(--ps,52px);height:var(--ps,52px);border:none;border-radius:50%;padding:0;background:none!important;box-shadow:none;position:relative;display:flex;align-items:center;justify-content:center;transform:none}
#paint .sw i{display:block;width:calc(100% - 6px);height:calc(100% - 6px);border-radius:50%;border:3px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.25)}
#paint .sw.blanco i{border-color:#d9d0e4}
#paint .sw.sel i{box-shadow:0 0 0 3px var(--ink),0 2px 5px rgba(0,0,0,.25)}
#paint .sw.sel:after{content:"✓";position:absolute;font-size:calc(var(--ps,52px)*.5);font-weight:900;line-height:1;color:var(--ck,#fff);text-shadow:0 0 3px rgba(0,0,0,.35)}
#paint .sw:active{transform:scale(.9)}
#paint .stp{width:var(--ps,52px);height:var(--ps,52px);font-size:calc(var(--ps,52px)*.6);display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 3px 0 rgba(0,0,0,.1)}
#paint .sz{width:52px;height:52px}
/* tableta: una fila arriba; colores en 1 o 2 filas */
@media (max-width:1100px){#paint .pal{--pc:8}}
@media (min-width:1101px){#paint #stamps{--pc:9}}
/* iPhone vertical (estrecho): dos filas de botones arriba, colores en 2 filas de 8 */
@media (max-width:560px) and (orientation:portrait){
  #paint .ptop{gap:6px}
  #paint .btn{min-width:52px;width:52px;height:52px;font-size:26px;padding:0}
  #paint .pgrp{gap:6px}
  #paint .pal{--pc:8;--ps:min(44px,calc((100vw - 8px - 14px) / 8));gap:2px}
  #paint .pbot{gap:6px;padding-left:4px;padding-right:4px}
}
/* iPhone horizontal (bajito): herramientas a la izquierda, colores a la derecha, papel en medio */
@media (orientation:landscape) and (max-height:540px){
  #paint.screen.on{grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:minmax(0,1fr);grid-template-areas:"top mid bot"}
  #paint .ptop{flex-direction:row;flex-wrap:nowrap;align-items:center;padding:6px 0 6px 8px;gap:6px}
  #paint .ptop .pgrp{flex-direction:column;gap:6px}
  #paint .btn{min-width:46px;width:46px;height:46px;font-size:23px;padding:0;border-radius:16px}
  #paint .pdot{width:14px;height:14px;right:3px;bottom:3px}
  #paint .pwrap{padding:6px 4px}
  #paint .pbot{flex-direction:column;flex-wrap:nowrap;justify-content:center;padding:6px 8px 6px 0;gap:6px}
  #paint .psizes{gap:4px}
  #paint .sz{width:44px;height:44px}
  #paint .pal{--pc:3;--ps:44px;gap:4px}
  #paint .sep{display:none}
}
#paint .pbot{padding-bottom:calc(10px + env(safe-area-inset-bottom))}
.tplgrid button.lnueva{position:relative;box-shadow:0 0 0 4px #ffd46b inset,0 5px 0 rgba(0,0,0,.1)}
.lmarca{position:absolute;left:8px;top:8px;background:#fff3c4;color:#4a3a5c;font-weight:900;font-size:15px;padding:4px 10px;border-radius:12px;box-shadow:0 2px 0 rgba(0,0,0,.08)}
/* solo en esta copia: deja sitio a la cinta «PRUEBA PINTAR» para que no tape los colores */
#paint.screen.on{padding-bottom:calc(30px + env(safe-area-inset-bottom))}
</style>
"""

# ---------------------------------------------------------------- JavaScript de Pintar
JS_PALETA_VIEJO = """SIZES.forEach((s,i)=>{const b=document.createElement('button');b.className='sz'+(i===P.size?' sel':'');b.innerHTML=`<i style="width:${s+6}px;height:${s+6}px"></i>`;
  b.onclick=()=>{P.size=i;$$('.sz').forEach((x,j)=>x.classList.toggle('sel',j===i));sfx.pop()};$('#sizes').appendChild(b)});
COLORS.forEach(c=>{const b=document.createElement('button');b.className='sw'+(c===P.color?' sel':'');b.style.background=c;
  b.onclick=()=>{P.color=c;$$('.sw').forEach(x=>x.classList.toggle('sel',x===b));if(P.tool==='eraser'||P.tool==='rainbow'||P.tool==='stamp')setTool('brush');sfx.pop()};$('#colors').appendChild(b)});
STAMPS.forEach(s=>{const b=document.createElement('button');b.className='stp'+(s===P.stamp?' sel':'');b.textContent=s;
  b.onclick=()=>{P.stamp=s;$$('.stp').forEach(x=>x.classList.toggle('sel',x===b));sfx.pop()};$('#stamps').appendChild(b)});
function setTool(t){P.tool=t;$$('.tool').forEach(b=>b.classList.toggle('sel',b.dataset.tool===t));
  $('#colors').style.display=t==='stamp'?'none':'flex';$('#stamps').style.display=t==='stamp'?'flex':'none';}
$$('.tool').forEach(b=>b.onclick=()=>{setTool(b.dataset.tool);sfx.pop()});"""
JS_PALETA_NUEVO = """/* copia Pintar 21/10: nombres de los colores (se dicen al tocarlos) y marca ✓ con contraste */
const COLOR_NOMBRE={'#ff4d6d':'rojo','#ff8fab':'rosa','#ff9f1c':'naranja','#ffd60a':'amarillo','#8ac926':'verde','#2ec4b6':'turquesa',
  '#4cc9f0':'azul cielo','#3a86ff':'azul','#7b2cbf':'morado','#c77dff':'lila','#8d5524':'marrón','#f1c27d':'color arena',
  '#000000':'negro','#8a8a8a':'gris','#ffffff':'blanco'};
const TOOL_NOMBRE={brush:'Pincel',rainbow:'Arcoíris',fill:'Cubo de pintura',stamp:'Pegatinas',eraser:'Goma'};
const claro=c=>{const[r,g,b]=hex2rgb(c);return .3*r+.59*g+.11*b>170};
SIZES.forEach((s,i)=>{const b=document.createElement('button');b.className='sz'+(i===P.size?' sel':'');b.setAttribute('aria-label',['Fino','Mediano','Gordo'][i]);
  b.innerHTML=`<i style="width:${Math.min(40,s+6)}px;height:${Math.min(40,s+6)}px"></i>`;
  b.onclick=()=>{P.size=i;$$('.sz').forEach((x,j)=>x.classList.toggle('sel',j===i));sfx.pop()};$('#sizes').appendChild(b)});
COLORS.forEach(c=>{const b=document.createElement('button');b.className='sw'+(c===P.color?' sel':'')+(c==='#ffffff'?' blanco':'');
  b.innerHTML=`<i style="background:${c}"></i>`;b.style.setProperty('--ck',claro(c)?'#4a3a5c':'#fff');b.setAttribute('aria-label',COLOR_NOMBRE[c]||c);
  b.onclick=()=>{P.color=c;$$('.sw').forEach(x=>x.classList.toggle('sel',x===b));pDot();if(P.tool==='eraser'||P.tool==='rainbow'||P.tool==='stamp')setTool('brush');sfx.pop();say(COLOR_NOMBRE[c]||'')};$('#colors').appendChild(b)});
STAMPS.forEach(s=>{const b=document.createElement('button');b.className='stp'+(s===P.stamp?' sel':'');b.textContent=s;
  b.onclick=()=>{P.stamp=s;$$('.stp').forEach(x=>x.classList.toggle('sel',x===b));sfx.pop()};$('#stamps').appendChild(b)});
function pDot(){$('#pdot').style.background=P.color}
pDot();
function setTool(t){P.tool=t;$$('.tool').forEach(b=>b.classList.toggle('sel',b.dataset.tool===t));
  $('#colors').style.display=t==='stamp'?'none':'grid';$('#stamps').style.display=t==='stamp'?'grid':'none';}
$$('.tool').forEach(b=>b.onclick=()=>{setTool(b.dataset.tool);sfx.pop();say(TOOL_NOMBRE[b.dataset.tool]||'')});"""

JS_LAYOUT_VIEJO = """function layoutCanvas(reset){
  const r=$('#pwrap').getBoundingClientRect();let w=r.width-20,h=r.height-4;
  if(P.tpl){w=h=Math.min(w,h)}w=Math.floor(w);h=Math.floor(h);if(w<50||h<50)return;
  const cv=$('#cv');cv.style.width=w+'px';cv.style.height=h+'px';
  const W=Math.round(w*DPR),H=Math.round(h*DPR);
  if(!reset&&W===pc.width&&H===pc.height)return;
  let tmp=null;
  if(!reset&&pc.width>1){tmp=document.createElement('canvas');tmp.width=pc.width;tmp.height=pc.height;tmp.getContext('2d').drawImage(pc,0,0)}
  pc.width=oc.width=W;pc.height=oc.height=H;
  pctx.fillStyle='#fff';pctx.fillRect(0,0,W,H);
  if(tmp){const s=Math.min(W/tmp.width,H/tmp.height);pctx.drawImage(tmp,(W-tmp.width*s)/2,(H-tmp.height*s)/2,tmp.width*s,tmp.height*s)}
  octx.clearRect(0,0,W,H);if(P.tpl)drawTpl(octx,P.tpl,W,H);
  P.undo=[];
}
onShow.paint=async arg=>{
  P.tpl=(TPL[arg]||UTPL[arg])?arg:null;P.dirty=false;"""
JS_LAYOUT_NUEVO = """/* copia Pintar 21/10: el papel se crea al entrar; al girar o cambiar de tamaño solo se recoloca (mismo dibujo, sin
   encogerlo y sin perder deshacer/rehacer). */
let MAXU=6;
function layoutCanvas(reset){
  const r=$('#pwrap').getBoundingClientRect();let w=r.width-20,h=r.height-8;
  if(w<50||h<50)return;
  if(reset){
    if(P.tpl&&LN[P.tpl]){const ar=LN[P.tpl].naturalWidth/LN[P.tpl].naturalHeight||2/3;if(w/h>ar)w=h*ar;else h=w/ar}   // láminas nuevas: sin deformar
    else if(P.tpl){w=h=Math.min(w,h)}w=Math.floor(w);h=Math.floor(h);
    const W=Math.round(w*DPR),H=Math.round(h*DPR);
    pc.width=oc.width=W;pc.height=oc.height=H;
    pctx.fillStyle='#fff';pctx.fillRect(0,0,W,H);
    octx.clearRect(0,0,W,H);if(P.tpl)drawTpl(octx,P.tpl,W,H);
    P.zn=P.tpl&&LN[P.tpl]?zonasLamina():null;
    MAXU=Math.max(6,Math.min(20,Math.floor(90e6/(W*H*4))));   // pasos de deshacer según la memoria (≈90 MB como máximo)
    P.undo=[];P.redo=[];updUR();
  }
  const ar=pc.width/pc.height;let dw=w,dh=w/ar;if(dh>h){dh=h;dw=h*ar}
  const cv=$('#cv');cv.style.width=Math.floor(dw)+'px';cv.style.height=Math.floor(dh)+'px';
}
onShow.paint=async arg=>{
  P.tpl=(TPL[arg]||UTPL[arg]||LN[arg])?arg:null;P.dirty=false;P.saved=null;$('#clearBtn').classList.remove('arm');
  if(LN[arg])await LN[arg].decode().catch(()=>{});"""

JS_UNDO_VIEJO = """function pushUndo(){P.undo.push(pctx.getImageData(0,0,pc.width,pc.height));if(P.undo.length>6)P.undo.shift()}"""
JS_UNDO_NUEVO = """function snap(){return pctx.getImageData(0,0,pc.width,pc.height)}
function pushSnap(s){P.undo.push(s);if(P.undo.length>MAXU)P.undo.shift();P.redo=[];updUR()}
function pushUndo(){pushSnap(snap())}
function updUR(){$('#undoBtn').classList.toggle('off',!P.undo.length);$('#redoBtn').classList.toggle('off',!(P.redo&&P.redo.length))}"""

JS_DOWN_VIEJO = """  e.preventDefault();if(drawing!==null)return;const p=pt(e);pushUndo();P.dirty=true;
  if(P.tool==='fill'){floodFill(Math.floor(p.x),Math.floor(p.y),P.color);sfx.pop();return}"""
JS_DOWN_NUEVO = """  e.preventDefault();if(drawing!==null)return;const p=pt(e);
  if(P.tool==='fill'){const s=snap();if(floodFill(Math.floor(p.x),Math.floor(p.y),P.color)){pushSnap(s);P.dirty=true;sfx.pop()}return}
  pushUndo();P.dirty=true;"""

FILL_RET = [
    ("const W=pc.width,H=pc.height;if(x0<0||y0<0||x0>=W||y0>=H)return;", "const W=pc.width,H=pc.height;if(x0<0||y0<0||x0>=W||y0>=H)return false;"),
    ("const i0=(y0*W+x0)*4;if(o[i0+3]>110)return;", "const i0=(y0*W+x0)*4;if(o[i0+3]>110)return false;"),
    ("if(Math.abs(sr-r)<6&&Math.abs(sg-g)<6&&Math.abs(sb-b)<6)return;", "if(Math.abs(sr-r)<6&&Math.abs(sg-g)<6&&Math.abs(sb-b)<6)return false;"),
    ("    if(seen[k-1]||seen[k+1]||seen[k-W]||seen[k+W]){d[j]=r;d[j+1]=g;d[j+2]=b}}\n  pctx.putImageData(img,0,0);\n}",
     "    if(seen[k-1]||seen[k+1]||seen[k-W]||seen[k+W]){d[j]=r;d[j+1]=g;d[j+2]=b}}\n  pctx.putImageData(img,0,0);return true;\n}"),
]

JS_BOTONES_VIEJO = """$('#undoBtn').onclick=()=>{const u=P.undo.pop();if(u){pctx.putImageData(u,0,0);sfx.pop()}};
$('#clearBtn').onclick=()=>{pushUndo();pctx.fillStyle='#fff';pctx.fillRect(0,0,pc.width,pc.height);tone(300,.2,'sawtooth',.06)};
function savePaint(){
  const sc=Math.min(1,1000/Math.max(pc.width,pc.height)),c=document.createElement('canvas');
  c.width=Math.round(pc.width*sc);c.height=Math.round(pc.height*sc);const x=c.getContext('2d');
  x.drawImage(pc,0,0,c.width,c.height);x.drawImage(oc,0,0,c.width,c.height);
  if(addToGallery(c.toDataURL('image/jpeg',.82)))P.dirty=false;
}
$('#saveBtn').onclick=()=>{savePaint();sfx.good();confetti();say('¡Qué dibujo tan bonito!')};"""
JS_BOTONES_NUEVO = """/* copia Pintar 21/10: deshacer y rehacer */
$('#undoBtn').onclick=()=>{const u=P.undo.pop();if(!u){sfx.bad();return}P.redo.push(snap());pctx.putImageData(u,0,0);P.dirty=true;updUR();sfx.pop()};
$('#redoBtn').onclick=()=>{const u=P.redo.pop();if(!u){sfx.bad();return}P.undo.push(snap());pctx.putImageData(u,0,0);P.dirty=true;updUR();sfx.pop()};
/* borrar todo: hace falta un segundo toque (y se puede deshacer) */
let clrT=null;
$('#clearBtn').onclick=()=>{const b=$('#clearBtn');
  if(!b.classList.contains('arm')){b.classList.add('arm');clearTimeout(clrT);clrT=setTimeout(()=>b.classList.remove('arm'),3500);sfx.pop();say('¿Borrar todo? Toca otra vez la papelera.');return}
  b.classList.remove('arm');clearTimeout(clrT);pushUndo();pctx.fillStyle='#fff';pctx.fillRect(0,0,pc.width,pc.height);P.dirty=true;
  tone(300,.2,'sawtooth',.06);say('Borrado. Si te arrepientes, toca la flecha.')};
/* guardar: cada dibujo tiene SU entrada en «Mis dibujos». Volver a guardar la actualiza (no duplica); un dibujo abierto
   desde la galería se guarda como copia nueva; si no cabe, no se borra nada antiguo. Mismo formato de «gal». */
function savePaint(){
  if(!P.dirty&&P.saved){toast('Ya está guardado ✓');return true}
  const sc=Math.min(1,1000/Math.max(pc.width,pc.height)),c=document.createElement('canvas');
  c.width=Math.round(pc.width*sc);c.height=Math.round(pc.height*sc);const x=c.getContext('2d');
  x.drawImage(pc,0,0,c.width,c.height);x.drawImage(oc,0,0,c.width,c.height);
  const url=c.toDataURL('image/jpeg',.82),g=store.get('gal',[]),i=P.saved?g.indexOf(P.saved):-1;
  if(i<0)g.unshift(url);else g[i]=url;
  if(store.set('gal',g)){P.saved=url;P.dirty=false;toast(i<0?'¡Guardado en Mis dibujos! 🖼️':'¡Dibujo actualizado! 🖼️');return true}
  toast('No cabe más en Mis dibujos 😢\\nPide ayuda a un adulto.\\nTu dibujo sigue aquí.');return false;
}
$('#saveBtn').onclick=()=>{const antes=P.saved;if(savePaint()&&P.saved!==antes){sfx.good();confetti();say('¡Qué dibujo tan bonito!')}};"""

LAMINAS_JS = """/* ---------- láminas nuevas candidatas (copia Pintar 21/10): ilustraciones 2:3, sin deformar ----------
   Zonas: al abrir una lámina nueva se calculan sus zonas (contorno = opacidad > 110, como el cubo). Las «diminutas»
   (menos de 14 × 14 px de pantalla: pelitos, pepitas, rejillas…) se agrupan con sus vecinas a través del contorno y se
   asocian a la zona grande que las rodea: al pintar una zona grande se pintan también sus diminutas, y al tocar una
   diminuta se pinta todo su grupo. Las rodeadas de tinta gruesa (brillos de los ojos) no se asocian: quedan blancas. */
const LNUEVAS={heladeria:'Heladería',gatito:'Gatito',hada:'Hada',unicornio:'Unicornio',perrito:'Perrito',conejito:'Conejito',princesa:'Princesa',helado:'Helado',mariposa:'Mariposa',explorador:'Osito explorador','hada-jardin':'Hada jardinera',sirena:'Sirena'},LN={};
Object.keys(LNUEVAS).forEach(k=>{const im=new Image();im.src='docs/propuestas/pintar-2026-10-21/laminas/'+k+'.png';LN['n:'+k]=im});
function zonasLamina(){
  const W=oc.width,H=oc.height,N=W*H,o=octx.getImageData(0,0,W,H).data,libre=new Uint8Array(N);
  for(let k=0;k<N;k++)libre[k]=o[k*4+3]<=110?1:0;
  const lab=new Int32Array(N),st=new Int32Array(N),sz=[0];let n=0;
  const vec=(q,f)=>{const x=q%W;if(x>0)f(q-1);if(x<W-1)f(q+1);if(q>=W)f(q-W);if(q<N-W)f(q+W)};
  for(let k=0;k<N;k++){if(!libre[k]||lab[k])continue;n++;let top=0,c=0;lab[k]=n;st[top++]=k;
    while(top){const q=st[--top];c++;vec(q,r=>{if(libre[r]&&!lab[r]){lab[r]=n;st[top++]=r}})}sz.push(c)}
  const css=parseFloat($('#cv').style.width)||W/DPR,esc=W/css,T=196*esc*esc,g=Math.max(2,Math.round(6*W/1024));
  const tiny=l=>l>0&&sz[l]<T;
  // grupos: diminutas + contorno a menos de g px de ellas
  const dist=new Int16Array(N).fill(-1);let top=0;
  for(let k=0;k<N;k++)if(tiny(lab[k])){dist[k]=0;st[top++]=k}
  for(let i=0;i<top;i++){const q=st[i];if(dist[q]>=g)continue;vec(q,r=>{if(dist[r]<0&&!libre[r]){dist[r]=dist[q]+1;st[top++]=r}})}
  const gr=new Int32Array(N);let ng=0;
  for(let k=0;k<N;k++){if(dist[k]<0||gr[k])continue;ng++;let tp=0;gr[k]=ng;const s2=[k];
    while(s2.length){const q=s2.pop();vec(q,r=>{if(dist[r]>=0&&!gr[r]){gr[r]=ng;s2.push(r)}})}}
  // zona grande que rodea cada grupo (la más votada a g+3 px; si no hay, ninguna)
  const vot=Array.from({length:ng+1},()=>new Map()),d2=new Int16Array(N).fill(-1),own=new Int32Array(N);top=0;
  for(let k=0;k<N;k++)if(gr[k]){d2[k]=0;own[k]=gr[k];st[top++]=k}
  for(let i=0;i<top;i++){const q=st[i];if(d2[q]>=g+3)continue;vec(q,r=>{if(d2[r]>=0)return;d2[r]=d2[q]+1;own[r]=own[q];
    if(libre[r]&&!tiny(lab[r])){const m=vot[own[q]];m.set(lab[r],(m.get(lab[r])||0)+1)}else st[top++]=r})}
  const padre=new Int32Array(ng+1);
  for(let c=1;c<=ng;c++){let best=0,bv=0,tot=0;vot[c].forEach((v,l)=>{tot+=v;if(v>bv){bv=v;best=l}});padre[c]=tot&&bv>=.6*tot?best:0}
  const grupoDe=new Int32Array(n+1);for(let k=0;k<N;k++)if(tiny(lab[k])&&!grupoDe[lab[k]])grupoDe[lab[k]]=gr[k];
  let nt=0;for(let l=1;l<=n;l++)if(tiny(l))nt++;
  return{W,lab,sz,T,tiny,grupoDe,padre,zonas:n,diminutas:nt,grupos:ng};
}
/* pinta también las diminutas que tocan a la zona pintada (llamada desde floodFill, antes de los bordes suaves) */
function rellenoDiminutas(x0,y0,d,seen,r,g,b){
  const Z=P.zn;if(!Z||Z.W!==pc.width)return;const l=Z.lab[y0*Z.W+x0];if(!l)return;
  const ok=Z.tiny(l)?(m=>Z.grupoDe[m]===Z.grupoDe[l]):(m=>Z.padre[Z.grupoDe[m]]===l);
  for(let k=0;k<Z.lab.length;k++){const m=Z.lab[k];if(m&&!seen[k]&&Z.tiny(m)&&ok(m)){seen[k]=1;const j=k*4;d[j]=r;d[j+1]=g;d[j+2]=b;d[j+3]=255}}
}
"""

GAL_VIEJO = """function addToGallery(url){
  const g=store.get('gal',[]);g.unshift(url);
  while(g.length){if(store.set('gal',g)){toast('¡Guardado! 🖼️');return true}g.pop()}
  toast('No hay espacio 😢');return false;
}"""
GAL_NUEVO = """function addToGallery(url){   /* copia Pintar 21/10: si no cabe, NO se borran los dibujos antiguos */
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
                  "window.MODO_PRUEBAS=true; /* copia aislada de Pintar: siempre en modo de pruebas */")
    h = sustituir(h, "document.querySelector('link[rel=manifest]').href='manifest-pruebas.json';",
                  f"document.querySelector('link[rel=manifest]').href='{CARPETA}manifest.json';")
    h = sustituir(h, "content='PRUEBAS';document.title='PRUEBAS · Mi Mundo de Juegos'",
                  "content='PRUEBA PINTAR';document.title='PRUEBA PINTAR · Mi Mundo de Juegos'")
    h = sustituir(h, "if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});",
                  "/* copia aislada de Pintar: no se registra ningún service worker (necesita conexión) */")
    h = sustituir(h, '🧪 VERSIÓN DE PRUEBAS · datos ficticios</div>', '🧪 PRUEBA PINTAR · datos propios</div>')
    # 3. Pintar
    h = sustituir(h, '<link rel="stylesheet" href="avatar/avatar.css">', '<link rel="stylesheet" href="avatar/avatar.css">\n' + CSS)
    h = sustituir(h, PAINT_VIEJO, PAINT_NUEVO)
    h = sustituir(h, "const P={tool:'brush',color:COLORS[0],size:1,stamp:STAMPS[0],tpl:null,img:null,dirty:false,undo:[]};",
                  "const P={tool:'brush',color:COLORS[0],size:1,stamp:STAMPS[0],tpl:null,img:null,dirty:false,undo:[],redo:[],saved:null};")
    h = sustituir(h, "function hex2rgb(h){const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255]}\n", "")
    h = sustituir(h, "let hue=0;\n", "let hue=0;\nfunction hex2rgb(h){const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255]}\n")
    h = sustituir(h, JS_PALETA_VIEJO, JS_PALETA_NUEVO)
    h = sustituir(h, JS_LAYOUT_VIEJO, JS_LAYOUT_NUEVO)
    h = sustituir(h, JS_UNDO_VIEJO, JS_UNDO_NUEVO)
    h = sustituir(h, JS_DOWN_VIEJO, JS_DOWN_NUEVO)
    for viejo, nuevo in FILL_RET:
        h = sustituir(h, viejo, nuevo)
    h = sustituir(h, JS_BOTONES_VIEJO, JS_BOTONES_NUEVO)
    h = sustituir(h, GAL_VIEJO, GAL_NUEVO)
    # láminas nuevas candidatas
    h = sustituir(h, "const UTPL={};\n", "const UTPL={};\n" + LAMINAS_JS)
    h = sustituir(h, "  if(name.startsWith('u:')){",
                  "  if(name.startsWith('n:')){x.restore();const im=LN[name];if(im&&im.complete&&im.naturalWidth){const s=Math.min(W/im.naturalWidth,H/im.naturalHeight);\n"
                  "    x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(im,(W-im.naturalWidth*s)/2,(H-im.naturalHeight*s)/2,im.naturalWidth*s,im.naturalHeight*s)}return}\n"
                  "  if(name.startsWith('u:')){")
    h = sustituir(h, "  // rellena también el borde suave junto a las líneas para que no queden halos blancos\n",
                  "  rellenoDiminutas(x0,y0,d,seen,r,g,b);   // copia Pintar 21/10: zonas diminutas de las láminas nuevas\n"
                  "  // rellena también el borde suave junto a las líneas para que no queden halos blancos\n")
    h = sustituir(h, "  await utplReady;const box=$('#tplgrid');box.innerHTML='';",
                  "  await utplReady;await Promise.all(Object.values(LN).map(i=>i.decode().catch(()=>{})));const box=$('#tplgrid');box.innerHTML='';")
    h = sustituir(h, "  add.onclick=()=>$('#tplFile').click();box.appendChild(add);\n",
                  "  add.onclick=()=>$('#tplFile').click();box.appendChild(add);\n"
                  "  Object.keys(LN).forEach(n=>{const b=document.createElement('button');b.dataset.go='paint';b.dataset.arg=n;b.className='lnueva';b.setAttribute('aria-label',LNUEVAS[n.slice(2)]);\n"
                  "    b.appendChild(thumb(n));b.insertAdjacentHTML('beforeend','<span class=\"lmarca\">✨ Nueva</span>');box.appendChild(b)});\n")
    h = ('<!-- COPIA AISLADA para probar las mejoras de Pintar (generada por preparar_copia.py desde index.html). '
         'No es el juego de Amaia. -->\n') + h
    (AQUI / 'index.html').write_text(h, encoding='utf-8')
    print('index.html generado:', len(h), 'caracteres')
