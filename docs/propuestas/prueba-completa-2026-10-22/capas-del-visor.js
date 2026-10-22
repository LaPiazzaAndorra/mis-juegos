// Capas visibles del visor aprobado (base-aprobada-d013-2026-10-14/visor/) para cada combinación de ropa × peinado × piel ×
// color de pelo, y para cada adorno con cada peinado: la copia completa dibuja exactamente esas capas (preparar_copia.py las
// lee de capas-del-visor.json). Uso (desde la raíz, con «python3 -m http.server 8766» en marcha):
//   node docs/propuestas/prueba-completa-2026-10-22/capas-del-visor.js
const path=require('path');const {execSync}=require('child_process');const fs=require('fs');
let pw;try{pw=require('playwright')}catch(e){pw=require(path.join(execSync('npm root -g').toString().trim(),'playwright'))}
const B='http://localhost:8766/docs/propuestas/base-aprobada-d013-2026-10-14/visor/index.html';
(async()=>{const b=await pw.chromium.launch();const q=await (await b.newContext({viewport:{width:1000,height:1200}})).newPage();const errs=[];q.on('pageerror',e=>errs.push(String(e)));
await q.goto(B);await q.waitForFunction(()=>!document.getElementById('cargando'),null,{timeout:60000});
const cl=s=>q.evaluate(s=>document.querySelector(s).click(),s);
const vis=()=>q.evaluate(()=>[...document.querySelectorAll('#lienzo img')].filter(i=>!i.classList.contains('oculto')&&i.style.display!=='none').map(i=>i.id+'='+decodeURIComponent(new URL(i.src).pathname).replace(/^\//,'')));
await cl('[data-corona=no]');
const ROPAS={vestido:[['[data-ropa="vestido-ax"]']],camiseta:[['[data-ropa=camiseta]']],
 aventura:[['[data-ropa=aventura]'],['[data-mochila=centrada]']],'aventura-sin-mochila':[['[data-ropa=aventura]'],['[data-mochila=no]']],
 pijama:[['[data-ropa=pijama]']],hada:[['[data-ropa=hada]'],['[data-hada-alas=diseno]'],['[data-hada-varita=agarre]']],
 'hada-sin-alas':[['[data-ropa=hada]'],['[data-hada-alas=no]'],['[data-hada-varita=agarre]']],
 'hada-sin-varita':[['[data-ropa=hada]'],['[data-hada-alas=diseno]'],['[data-hada-varita=no]']],
 'hada-sin-nada':[['[data-ropa=hada]'],['[data-hada-alas=no]'],['[data-hada-varita=no]']]};
const PEIN={rizos:['[data-peinado=melena]'],coleta:['[data-peinado=coleta]','[data-cinta=si]'],'coleta-sin-cinta':['[data-peinado=coleta]','[data-cinta=no]'],
 coletas:['[data-peinado=coletas2]','[data-coletas2=con]'],'coletas-sin-sombrero':['[data-peinado=coletas2]','[data-coletas2=sin]']};
const PIEL={clara:'claro',dorada:'dorado',morena:'moreno',profunda:'profundo'};
const out={combos:{},adornos:{}};
for(const [r,cs] of Object.entries(ROPAS)){ for(const [c] of cs) await cl(c);
 for(const [pi,pv] of Object.entries(PIEL)){ await cl(`[data-piel=${pv}]`);
  for(const pe of ['castano','chocolate','miel','oscuro','jengibre']){ await cl(`[data-pelo-color=${pe}]`);
   for(const [e,ps] of Object.entries(PEIN)){ for(const s of ps) await cl(s); out.combos[[r,e,pi,pe].join('|')]=await vis(); }}}
 await cl('[data-peinado=melena]');}
// adornos: con el vestido, castaño, piel clara y dorada; cada adorno de pelo solo, y corona sola y con cada adorno
await cl('[data-ropa="vestido-ax"]');await cl('[data-pelo-color=castano]');
const ACC=['lazo','flores','mariposa','diadema','gorrito-b','gorra','lazos-coleteros'];
for(const [pi,pv] of Object.entries({clara:'claro',dorada:'dorado'})){ await cl(`[data-piel=${pv}]`);
 for(const [e,ps] of Object.entries(PEIN)){ for(const s of ps) await cl(s);
  for(const cor of ['no','si']) for(const a of ['ninguno',...ACC]){
   await cl('[data-acc-pelo=ninguno]');await cl('[data-corona=no]');
   await cl(`[data-corona=${cor}]`);await cl(`[data-acc-pelo="${a}"]`);
   const pres={acc:await q.evaluate(()=>document.querySelector('[data-acc-pelo][aria-pressed=true]').dataset.accPelo),corona:await q.evaluate(()=>document.querySelector('[data-corona=si]').getAttribute('aria-pressed')==='true')};
   out.adornos[[e,pi,cor,a].join('|')]={puesto:pres,capas:await vis()};
  }}}
await cl('[data-acc-pelo=ninguno]');await cl('[data-corona=no]');
// pintacaras y ojos (una muestra)
await cl('[data-peinado=melena]');await cl('[data-pintacaras=si]');await cl('[data-ojos-color*=lila]');
out.extra={'vestido|rizos|dorada|castano|lila|pintacaras':await vis()};
out.orden=await q.evaluate(()=>[...document.querySelectorAll('#lienzo img')].map(i=>i.id));out.errores=errs;fs.writeFileSync(__dirname+'/capas-del-visor.json',JSON.stringify(out,null,0));
console.log('combos',Object.keys(out.combos).length,'adornos',Object.keys(out.adornos).length,'errores',errs.length);await b.close();})();
