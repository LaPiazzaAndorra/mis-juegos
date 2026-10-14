#!/usr/bin/env node
/* Mi Mundo de Juegos · prueba de «Guardar / Recuperar mi progreso» (progreso.js)
   Uso: python3 -m http.server 8765 &  →  node pruebas/prueba-copia.js [dirección] [carpeta de capturas]
   Simula la app instalada en el iPhone (display-mode standalone + navigator.standalone) y la hoja de
   compartir de iOS (exige un toque reciente, como Safari). NO sustituye la prueba en un iPhone real. */
const path=require('path'),fs=require('fs');const {execSync}=require('child_process');
let pw;try{pw=require('playwright')}catch(e){pw=require(path.join(execSync('npm root -g').toString().trim(),'playwright'))}
const BASE=(process.argv[2]||'http://localhost:8765/').replace(/\/?$/,'/'),OUT=process.argv[3]||fs.mkdtempSync(path.join(require('os').tmpdir(),'copia-capturas-'));
const ANT={stars:'37',gal:JSON.stringify(['data:image/png;base64,iVBORw0KGgo=','data:image/png;base64,AAAA']),doll:'{"skin":3,"hc":3,"hs":2}',sc_casa:'[{"e":"🐶","x":50,"y":50,"s":13,"f":1}]',lv_contar:'2',iceCoins:'5',iceServed:'3',sound:'true',voice:'Monica',tone:'"pastel"',avatar:'{"v":1,"piel":"clara","ropa":"vestido"}',mm_hab:'{"x":40}',otra_app:'NO-TOCAR'};
const R=[];const ok=(n,c,x='')=>{R.push(!!c);console.log((c?'  ✅ ':'  ❌ ')+n+(x?' · '+x:''))};
const LS=p=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])));
const TPL=p=>p.evaluate(()=>new Promise(ok=>{const r=indexedDB.open('misjuegos',1);r.onupgradeneeded=()=>r.result.createObjectStore('tpl',{keyPath:'id'});r.onsuccess=()=>{const q=r.result.transaction('tpl').objectStore('tpl').getAll();q.onsuccess=()=>{r.result.close();ok(q.result)}}}));
const putTPL=(p,l)=>p.evaluate(l=>new Promise(ok=>{const r=indexedDB.open('misjuegos',1);r.onupgradeneeded=()=>r.result.createObjectStore('tpl',{keyPath:'id'});r.onsuccess=()=>{const tx=r.result.transaction('tpl','readwrite');l.forEach(t=>tx.objectStore('tpl').put(t));tx.oncomplete=()=>{r.result.close();ok()}}}),l);
// iPhone instalada: display-mode standalone + navigator.standalone + hoja de compartir simulada
const INIT=()=>{window.__comp=[];const mm=window.matchMedia.bind(window);window.matchMedia=q=>/standalone/.test(q)?{matches:true,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}:mm(q);
  Object.defineProperty(navigator,'standalone',{value:true});navigator.canShare=d=>!!(d&&d.files);
  navigator.share=async d=>{if(!navigator.userActivation.isActive)throw new DOMException('sin toque','NotAllowedError');if(window.__cancel)throw new DOMException('x','AbortError');window.__comp.push({name:d.files[0].name,type:d.files[0].type,text:await d.files[0].text()})}};
async function abrirAjustes(p){await p.click('#setBtn');await p.waitForTimeout(600)}
(async()=>{
 const b=await pw.chromium.launch();
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,acceptDownloads:true});
 await ctx.addInitScript(INIT);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(BASE+'index.html');await p.evaluate(d=>{localStorage.clear();for(const[k,v]of Object.entries(d))localStorage.setItem(k,v)},ANT);
 await putTPL(p,[{id:'t1',url:'data:image/png;base64,AAA'},{id:'t2',url:'data:image/png;base64,BBB'}]);await p.reload();await p.waitForTimeout(500);
 console.log('· App instalada simulada (iPhone 390×844)');
 ok('Detecta app instalada',await p.evaluate(()=>Progreso.instalada()));
 await abrirAjustes(p);await p.screenshot({path:OUT+'/1-ajustes-iphone.png'});
 await p.locator('.bk').scrollIntoViewIfNeeded();await p.screenshot({path:OUT+'/2-botones-iphone.png'});
 ok('Botones visibles',await p.isVisible('#bkGuardar')&&await p.isVisible('#bkRecuperar'));
 const box=await p.locator('#bkGuardar').boundingBox();ok('Botón grande para el dedo',box.height>=90&&box.width>=150,`${Math.round(box.width)}×${Math.round(box.height)}`);
 await p.tap('#bkGuardar');await p.waitForTimeout(500);
 const comp=await p.evaluate(()=>window.__comp);ok('Abre la hoja de compartir con un archivo (sin perder el permiso del toque)',comp.length===1,comp[0]&&comp[0].name);
 const copia=JSON.parse(comp[0].text);fs.writeFileSync(OUT+'/copia.json',comp[0].text);
 ok('Archivo .json con formato correcto',comp[0].type==='application/json'&&copia.format==='mi-mundo-juegos-respaldo'&&copia.schema_version===1);
 const faltan=Object.keys(ANT).filter(k=>k!=='otra_app'&&copia.local_storage[k]!==ANT[k]);ok('Contiene todas las claves del juego',!faltan.length,faltan.join(','));
 ok('No copia datos de otras apps',!('otra_app' in copia.local_storage));
 ok('Contiene las láminas importadas',copia.indexeddb.misjuegos.tpl.length===2);
 await p.screenshot({path:OUT+'/3-tras-guardar.png'});
 ok('Muestra la fecha de la última copia',/Última copia guardada/.test(await p.textContent('#bkInfo')));
 await p.evaluate(()=>window.__cancel=true);await abrirAjustes(p).catch(()=>{});await p.tap('#bkGuardar');await p.waitForTimeout(300);
 ok('Cancelar la hoja no rompe nada',(await p.evaluate(()=>window.__comp.length))===1);await p.evaluate(()=>window.__cancel=false);
 // cambiar datos y recuperar
 await p.evaluate(()=>{localStorage.setItem('stars','99');localStorage.setItem('gal','[]');localStorage.setItem('lv_nuevo','4')});
 await putTPL(p,[{id:'t3',url:'data:image/png;base64,CCC'}]);
 await p.reload();await p.waitForTimeout(400);await abrirAjustes(p);
 const [fc]=await Promise.all([p.waitForEvent('filechooser'),p.tap('#bkRecuperar')]);await fc.setFiles(OUT+'/copia.json');await p.waitForTimeout(600);
 ok('Enseña la vista previa antes de recuperar',await p.isVisible('#bkModal'));
 const vista=await p.textContent('#bkVista');ok('Compara copia y ahora',/37/.test(vista)&&/99/.test(vista));
 await p.screenshot({path:OUT+'/4-confirmar-iphone.png'});
 await p.tap('#bkCancelar');ok('Cancelar no cambia nada',(await LS(p)).stars==='99');
 const [fc2]=await Promise.all([p.waitForEvent('filechooser'),p.tap('#bkRecuperar')]);await fc2.setFiles(OUT+'/copia.json');await p.waitForTimeout(500);
 await p.tap('#bkConfirmar');await p.waitForTimeout(2600);
 let ls=await LS(p);ok('Recupera estrellas, dibujos y demás',ls.stars==='37'&&JSON.parse(ls.gal).length===2&&ls.avatar===ANT.avatar);
 ok('El juego lee las estrellas recuperadas',(await p.textContent('.sc'))==='37');
 ok('Claves de otras apps intactas',ls.otra_app==='NO-TOCAR');
 ok('Láminas: las de la copia y la nueva siguen',(await TPL(p)).map(t=>t.id).sort().join()==='t1,t2,t3');
 const interna=await p.evaluate(()=>new Promise(ok=>{const r=indexedDB.open('misjuegos-copias',1);r.onsuccess=()=>{const q=r.result.transaction('copias').objectStore('copias').get('antes-de-recuperar');q.onsuccess=()=>ok(q.result)}}));
 ok('Copia automática de lo de antes guardada',interna&&interna.local_storage.stars==='99');
 await abrirAjustes(p);ok('Aparece «Deshacer»',await p.isVisible('#bkDeshacer'));await p.screenshot({path:OUT+'/5-deshacer.png'});
 p.once('dialog',d=>d.accept());await p.tap('#bkDeshacer');await p.waitForTimeout(2600);
 ls=await LS(p);ok('Deshacer vuelve exactamente a lo de antes',ls.stars==='99'&&ls.gal==='[]'&&ls.lv_nuevo==='4'&&ls.otra_app==='NO-TOCAR');
 ok('Deshacer repone las láminas de antes',(await TPL(p)).map(t=>t.id).sort().join()==='t1,t2,t3');
 // fallo a mitad (sin espacio) → vuelve atrás
 const r=await p.evaluate(async c=>{const set=Storage.prototype.setItem;let n=0;Storage.prototype.setItem=function(k,v){if(k==='gal'&&n++===0)throw new DOMException('lleno','QuotaExceededError');return set.call(this,k,v)};
   try{await Progreso.recuperar(c);return 'sin error'}catch(e){return e.message}finally{Storage.prototype.setItem=set}},copia);
 ls=await LS(p);ok('Sin espacio a mitad: avisa y deja todo como estaba',/siguen igual/.test(r)&&ls.stars==='99'&&ls.gal==='[]',r);
 // archivos no válidos
 const malos={'otro.json':'{"hola":1}','roto.json':'{no es json','nuevo.json':JSON.stringify({...copia,schema_version:2}),'danado.json':JSON.stringify({...copia,local_storage:{stars:'{x'}})};
 for(const[n,t]of Object.entries(malos)){fs.writeFileSync(OUT+'/'+n,t);await abrirAjustes(p).catch(()=>{});
   const [f]=await Promise.all([p.waitForEvent('filechooser'),p.tap('#bkRecuperar')]);await f.setFiles(OUT+'/'+n);await p.waitForTimeout(400);
   ok('Rechaza '+n,!(await p.isVisible('#bkModal'))&&(await LS(p)).stars==='99',await p.textContent('#toast').catch(()=>''));}
 // compatibilidad con la herramienta copia-de-seguridad.html
  await p.goto(BASE+'herramientas/copia-de-seguridad.html');await p.waitForTimeout(400);
 const vieja=await p.evaluate(()=>copiaMiMundo(true));
 await p.goto(BASE+'index.html');ok('Acepta copias de la herramienta anterior',await p.evaluate(c=>{try{Progreso.validar(c);return true}catch(e){return false}},vieja));
 ok('Sin errores de JavaScript',!errs.length,errs.join(' | '));
 // sin hoja de compartir → descarga
 const ctx2=await b.newContext({viewport:{width:1180,height:820},acceptDownloads:true});const q=await ctx2.newPage();
 await q.goto(BASE+'index.html');await q.evaluate(()=>{localStorage.setItem('stars','5');navigator.canShare=undefined});await abrirAjustes(q);
 await q.screenshot({path:OUT+'/6-ajustes-ipad.png'});
 const [dl]=await Promise.all([q.waitForEvent('download'),q.click('#bkGuardar')]);const dp=await dl.path();
 ok('Sin hoja de compartir: descarga el archivo',JSON.parse(fs.readFileSync(dp,'utf8')).local_storage.stars==='5',dl.suggestedFilename());
 // iPhone horizontal y pantalla pequeña
 const ctx3=await b.newContext({viewport:{width:852,height:393},deviceScaleFactor:3,isMobile:true,hasTouch:true});const h=await ctx3.newPage();
 await h.goto(BASE+'index.html');await abrirAjustes(h);await h.locator('.bk').scrollIntoViewIfNeeded();await h.screenshot({path:OUT+'/7-iphone-horizontal.png'});
 ok('iPhone horizontal: botones alcanzables con scroll',await h.isVisible('#bkGuardar'));
 const ctx4=await b.newContext({viewport:{width:320,height:568},deviceScaleFactor:2,isMobile:true,hasTouch:true});const s=await ctx4.newPage();
 await s.goto(BASE+'index.html');await abrirAjustes(s);await s.locator('.bk').scrollIntoViewIfNeeded();await s.screenshot({path:OUT+'/8-iphone-se.png'});
 ok('iPhone SE: sin desbordar a lo ancho',await s.evaluate(()=>document.querySelector('.bk').scrollWidth<=document.querySelector('.bk').clientWidth+1));
 // ---- versión de pruebas (en el iPhone: raw.githack.com; aquí: localhost con ?pruebas) ----
 console.log('\n· Versión de pruebas');
 const ctx5=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});await ctx5.addInitScript(INIT);
 const t=await ctx5.newPage();const errs5=[];t.on('pageerror',e=>errs5.push(e.message));
 await t.goto(BASE+'index.html?pruebas');await t.evaluate(()=>localStorage.clear());await t.reload();await t.waitForTimeout(500);
 const cab=await t.evaluate(()=>({m:document.querySelector('link[rel=manifest]').getAttribute('href'),i:document.querySelector('link[rel=apple-touch-icon]').getAttribute('href'),n:document.querySelector('meta[name=apple-mobile-web-app-title]').content}));
 ok('Instala con otro nombre, icono y manifiesto',cab.m==='manifest-pruebas.json'&&cab.i==='icon-pruebas-512.png'&&cab.n==='PRUEBAS',JSON.stringify(cab));
 const man=await (await t.request.get(BASE+'manifest-pruebas.json')).json();ok('Manifiesto de pruebas con otra identidad',man.name==='Mi Mundo PRUEBAS'&&man.id&&man.icons.length===2);
 ok('Se ve la cinta «VERSIÓN DE PRUEBAS»',await t.isVisible('#pruebasCinta'));
 await t.screenshot({path:OUT+'/9-pruebas-inicio.png'});
 await abrirAjustes(t);await t.locator('#bkPruebas').scrollIntoViewIfNeeded();await t.screenshot({path:OUT+'/10-pruebas-ajustes.png'});
 t.once('dialog',d=>d.accept());await t.tap('#bkFicticios');await t.waitForTimeout(2800);
 let lt=await LS(t);ok('Carga datos ficticios',lt.stars==='123'&&JSON.parse(lt.gal).length===3&&!!lt.avatar&&lt.iceCoins==='42',`estrellas ${lt.stars}`);
 ok('Datos ficticios: lámina incluida',(await TPL(t)).some(x=>x.id==='u:ficticia'));
 ok('El juego enseña las estrellas ficticias',(await t.textContent('.sc'))==='123');
 await abrirAjustes(t);ok('Tras los datos ficticios se puede deshacer',await t.isVisible('#bkDeshacer'));
 await t.tap('#bkGuardar');await t.waitForTimeout(500);const ct=(await t.evaluate(()=>window.__comp))[0];
 const cp=JSON.parse(ct.text);ok('El archivo de pruebas se distingue',/^PRUEBAS-Mi-Mundo-progreso-/.test(ct.name)&&cp.version_pruebas===true,ct.name);
 fs.writeFileSync(OUT+'/copia-pruebas.json',ct.text);
 const [ft]=await Promise.all([t.waitForEvent('filechooser'),t.tap('#bkRecuperar')]);await ft.setFiles(OUT+'/copia-pruebas.json');await t.waitForTimeout(500);
 ok('La versión de pruebas recupera sus propias copias',await t.isVisible('#bkModal'));await t.tap('#bkCancelar');
 ok('Sin errores de JavaScript (pruebas)',!errs5.length,errs5.join(' | '));
 // el juego normal no tiene nada de pruebas y rechaza sus copias
 const n=await ctx5.newPage();await n.goto(BASE+'index.html');await n.waitForTimeout(400);
 ok('Juego normal: sin cinta ni datos ficticios',!(await n.isVisible('#pruebasCinta'))&&(await n.evaluate(()=>document.querySelector('link[rel=manifest]').getAttribute('href')))==='manifest.json');
 await abrirAjustes(n);ok('Juego normal: no aparece el apartado de pruebas',!(await n.isVisible('#bkPruebas')));
 ok('Juego normal: los datos ficticios no se pueden cargar',await n.evaluate(async()=>{try{await Progreso.datosFicticios();return false}catch(e){return true}}));
 const antesN=(await LS(n)).stars;const [fn]=await Promise.all([n.waitForEvent('filechooser'),n.tap('#bkRecuperar')]);await fn.setFiles(OUT+'/copia-pruebas.json');await n.waitForTimeout(500);
 ok('Juego normal: rechaza las copias de pruebas',!(await n.isVisible('#bkModal'))&&(await LS(n)).stars===antesN,await n.textContent('#toast'));
 await b.close();console.log(`\n${R.filter(x=>x).length}/${R.length} correctas`);process.exit(R.every(x=>x)?0:1);
})().catch(e=>{console.error(e);process.exit(1)});
