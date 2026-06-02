/* =====================================================================
   SupplyHouse Token Explorer — app logic
   Depends on globals from data.js: DATA, T1SET, T3SET, USAGE, TYPO, RSCALE
   Chain columns: ① T1 · ② T2 foundation · ③ T2 pattern · ④ T3 component · ⑤ usage
   ===================================================================== */
(function(){
'use strict';

const T1 = new Set(T1SET);
const T3 = new Set(T3SET);
const isRef = v => typeof v === 'string' && /^\{.+\}$/.test(v.trim());
const isHex = v => typeof v === 'string' && /^#([0-9a-f]{3,8})$/i.test(v);
function colOf(p){ if (T1.has(p)) return 1; if (T3.has(p)) return 4; return p.includes('.pattern.') ? 3 : 2; }
function resolve(v){ let g=0; while(isRef(v) && g++<25){ v=(DATA[v.trim().slice(1,-1)]||{}).v; } return v; }

const adj={}, radj={};
const edge=(a,b)=>{ (adj[a]=adj[a]||[]).push(b); (radj[b]=radj[b]||[]).push(a); };
for(const p in DATA){ const v=DATA[p].v; if(isRef(v)){ const r=v.trim().slice(1,-1); if(DATA[r]) edge(p,r); } }
const COMP=Object.keys(USAGE);
for(const c of COMP){ const id='comp::'+c; for(const pre of USAGE[c]) for(const p in DATA) if(p===pre||p.startsWith(pre+'.')) edge(id,p); }
const bfs=(s,g)=>{ const seen=new Set([s]),q=[s]; while(q.length){ const n=q.shift(); for(const m of (g[n]||[])) if(!seen.has(m)){ seen.add(m); q.push(m); } } return seen; };
const trace=id=>new Set([...bfs(id,adj),...bfs(id,radj)]);
const inUse=new Set(); for(const a in adj) for(const b of adj[a]) if(T1.has(b)) inUse.add(b);

const M1=[...inUse],
      M2=Object.keys(DATA).filter(p=>colOf(p)===2),
      M3=Object.keys(DATA).filter(p=>colOf(p)===3),
      M4=Object.keys(DATA).filter(p=>colOf(p)===4),
      M5=COMP.map(c=>'comp::'+c);

const SUBLAYER={'color.text':'Foundations','color.bg':'Foundations','color.border':'Foundations','color.icon':'Foundations','color.focus':'Foundations',
  'color.commerce':'Identities','color.primary':'Identities','color.feedback':'Communication','color.status':'Communication',
  'color.fulfillment':'Domain','color.role':'Domain','color.invite':'Domain','stroke.focus':'Stroke','stroke.feedback':'Stroke','stroke.width':'Stroke','stroke.fulfillment':'Stroke'};
const ORDER={
  1:['color.gray','color.blue','color.orange','color.red','color.green','color.yellow','color.brown','spacing','stroke.width','stroke.style'],
  2:['color.text','color.bg','color.border','color.icon','color.focus','color.commerce','color.primary','color.feedback','color.status','color.fulfillment','color.role','color.invite','stroke.focus','stroke.feedback','stroke.width','stroke.fulfillment'],
  3:['text','form-field','form-control','action-button','menu-item','navigation','selectable','selectable-card','removable','toggle','switch','breadcrumb'],
  4:['accordion','modal','tooltip','quantity-stepper'],
  5:['button','link','badge','radio','checkbox','switch','toggle','selectable pill','removable chip','selectable card','menu item','navigation tabs','breadcrumb','pagination','form field','rating stars','toast','alert','accordion','modal','tooltip','fulfillment','quantity stepper']
};
function gk(p,col){ const s=p.split('.');
  if(col===1) return (s[0]==='color'||s[0]==='stroke')?s[0]+'.'+s[1]:s[0];
  if(col===2) return s[0]+'.'+s[1];
  if(col===3) return s[2];
  if(col===4) return s[0]; }
function compFamily(id){ const l=id.slice(6); if(l.includes(' · ')) return l.split(' · ')[0]; if(l.endsWith('badge')) return 'badge'; return l; }
function shortLab(p,col){ const s=p.split('.');
  if(col===1) return s.slice(1).join('.');
  if(col===2) return s.slice(2).join('.')||s[1];
  if(col===3) return s[0][0]+': '+s.slice(3).join('.');
  if(col===4) return s.slice(1).join('.'); }

let SEL=null, H=null;
function itemRow(id,col){
  if(col===5){
    const fam=compFamily(id); let dot='#bbb';
    for(const pre of USAGE[id.slice(6)]){ for(const p in DATA){ if(p===pre||p.startsWith(pre+'.')){ const f=resolve(DATA[p].v); if(isHex(f)){ dot=f; break; } } } if(dot!=='#bbb') break; }
    const lab=id.slice(6).replace(fam+' · ','');
    return '<div class="it comp'+(id===SEL?' sel':'')+'" onclick="EXP.pick(\''+id.replace(/'/g,'')+'\')"><span class=dot style="background:'+dot+'"></span><span class=lab>'+lab+'</span></div>';
  }
  const f=resolve(DATA[id].v), sw=isHex(f)?'<span class=sw style="background:'+f+'"></span>':'';
  const val=isHex(f)?f:(f===undefined?'':f);
  return '<div class="it'+(id===SEL?' sel':'')+'" onclick="EXP.pick(\''+id.replace(/'/g,'')+'\')">'+sw+'<span class=lab title="'+id+'">'+shortLab(id,col)+'</span><span class=val>'+val+'</span></div>';
}
function buildCol(elId,members,col){
  const el=document.getElementById(elId); if(!el) return;
  let items=members; if(SEL) items=items.filter(x=>H.has(x));
  if(!items.length){ el.innerHTML='<div class=empty>'+(SEL?'not in this chain':'—')+'</div>'; return; }
  const groups={}; for(const x of items){ const k=col===5?compFamily(x):gk(x,col); (groups[k]=groups[k]||[]).push(x); }
  const order=ORDER[col].filter(k=>groups[k]).concat(Object.keys(groups).filter(k=>!ORDER[col].includes(k)).sort());
  let html='', lastSub=null;
  for(const k of order){
    if(col===2){ const sl=SUBLAYER[k]||'Other'; if(sl!==lastSub){ html+='<div class=sub>'+sl+'</div>'; lastSub=sl; } }
    html+='<div class=gh><span class=gn>'+(col===1?k.replace('color.',''):k)+'</span><span class=gc>'+groups[k].length+'</span></div>';
    html+=groups[k].map(x=>itemRow(x,col)).join('');
  }
  el.innerHTML=html;
}
function paint(){
  H=SEL?trace(SEL):null;
  buildCol('c1',M1,1); buildCol('c2',M2,2); buildCol('c3',M3,3); buildCol('c4',M4,4); buildCol('c5',M5,5);
  const sel=document.getElementById('sel'); if(sel) sel.textContent=SEL?(SEL.startsWith('comp::')?SEL.slice(6):SEL):'nothing';
  const clr=document.getElementById('clear'); if(clr) clr.disabled=!SEL;
}
const EXP={ pick(id){ SEL=(SEL===id?null:id); paint(); }, clear(){ SEL=null; paint(); } };
window.EXP=EXP;

/* ---------- typography specimen ---------- */
function renderTypo(){
  const host=document.getElementById('typolist'); if(!host) return;
  const groups={}; TYPO.forEach(r=>{ (groups[r.group]=groups[r.group]||[]).push(r); });
  const cap=px=>Math.min(px,40);
  let html='';
  for(const g of ['Display','Headline','Body','Caption']){
    if(!groups[g]) continue;
    html+='<div class=tg>'+g+'</div>';
    for(const r of groups[g]){
      const fs=cap(r.px);
      for(const v of r.variants){
        const lh=v.lhPct/100, txt=v.caps?'AG':'Ag', tc=v.caps?'text-transform:uppercase;':'';
        const spec='<div class=tspec><span class=tsample style="font-size:'+fs+'px;line-height:'+lh+';font-weight:'+v.w+';'+tc+'">'+txt+'</span></div>';
        const chips='<span class=chip>size: <b>'+r.sizeDisp+'</b></span>'
          +'<span class=chip>lh: <b>'+v.lhDisp+' ('+v.lhPct+'%)</b></span>'
          +'<span class=chip>weight: <b>'+(v.w===700?'bold':'normal')+'</b></span>'
          +(v.caps?'<span class="chip caps">case: <b>uppercase</b></span>':'')
          +'<span class=chip>family: <b>'+r.famDisp+'</b></span>';
        html+='<div class=trow>'+spec+'<div class=tmeta><div class=trole>typography.role.'+r.name+'.'+v.key+'</div><div class=tchips>'+chips+'</div></div></div>';
      }
    }
  }
  host.innerHTML=html;
}

/* ---------- responsive scale table ---------- */
function renderScale(){
  const host=document.getElementById('scaletable'); if(!host) return;
  let th='<tr><th style="text-align:left">Role</th><th style="text-align:left">Line-height</th>';
  RSCALE.breakpoints.forEach(b=>{ th+='<th>'+b.id+'<br><span style="font-weight:400;text-transform:none;letter-spacing:0">'+b.range+'</span></th>'; });
  th+='</tr>';
  let rows='';
  RSCALE.rows.forEach(r=>{
    let tds='<td class=role>'+r.role+'</td><td class=lh>'+r.lh+'</td>';
    r.sizes.forEach((s,i)=>{ tds+='<td class="'+(i===0?'b1':'')+'">'+s+'</td>'; });
    rows+='<tr>'+tds+'</tr>';
  });
  host.innerHTML='<table class=scale><thead>'+th+'</thead><tbody>'+rows+'</tbody></table>';
}

/* ---------- nav scrollspy ---------- */
function scrollspy(){
  const links=[...document.querySelectorAll('.site-nav a')];
  const map={}; links.forEach(a=>map[a.getAttribute('href').slice(1)]=a);
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ links.forEach(l=>l.classList.remove('on')); const a=map[e.target.id]; if(a) a.classList.add('on'); } });
  },{rootMargin:'-55% 0px -40% 0px'});
  ['rationale','explorer','typography','scale'].forEach(id=>{ const el=document.getElementById(id); if(el) obs.observe(el); });
}

/* ---------- boot ---------- */
function boot(){
  paint(); renderTypo(); renderScale(); scrollspy();
  const clr=document.getElementById('clear'); if(clr) clr.onclick=EXP.clear;
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
