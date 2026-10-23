// Rewards: daily goal and activity log, lifetime medal tiers, topic medals, badges and the Koala Shop.
const TIERS=[
  {id:'starter',name:'Starter',min:0,col:'#B9C2D6',ink:'#3A4560'},
  {id:'bronze',name:'Bronze',min:50,col:'#CD7F32',ink:'#5A3311'},
  {id:'silver',name:'Silver',min:200,col:'#C3CAD6',ink:'#4A5263'},
  {id:'gold',name:'Gold',min:500,col:'#F2C230',ink:'#6B4E00'},
  {id:'platinum',name:'Platinum',min:1000,col:'#8FE0D6',ink:'#145A52'},
  {id:'diamond',name:'Diamond',min:2000,col:'#8CC8FF',ink:'#123E6B'},
  {id:'champion',name:'Champion',min:4000,col:'#B88CFF',ink:'#3D1A75'},
];
const MEDAL_COL={bronze:'#CD7F32',silver:'#C3CAD6',gold:'#F2C230',platinum:'#8FE0D6'};
function tierOf(n){let t=TIERS[0];for(const x of TIERS)if(n>=x.min)t=x;return t;}
function nextTier(n){return TIERS.find(x=>x.min>n)||null;}
function medalSVG(col,glyph,size=56,locked){
  return`<svg class="medal${locked?' locked':''}" viewBox="0 0 64 72" width="${size}" height="${Math.round(size*72/64)}" aria-hidden="true">
  <path d="M18 2 L30 30 L22 32 L12 4 Z" fill="${locked?'#C9CED9':'#E5484D'}"/><path d="M46 2 L34 30 L42 32 L52 4 Z" fill="${locked?'#B9C0CC':'#3E63DD'}"/>
  <circle cx="32" cy="44" r="24" fill="${locked?'#D5DAE3':col}" stroke="rgba(0,0,0,.18)" stroke-width="3"/><circle cx="32" cy="44" r="17" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
  <text x="32" y="45" text-anchor="middle" dominant-baseline="central" font-family="Fredoka, sans-serif" font-weight="700" font-size="${glyph.length>2?12:17}" fill="${locked?'#8B93A5':'rgba(0,0,0,.62)'}">${glyph}</text></svg>`;
}
// ---------- daily log ----------
function dayLog(d=today()){return P.log[d]||(P.log[d]={q:0,first:0,stars:0});}
function pruneLog(){const keys=Object.keys(P.log).sort();while(keys.length>90)delete P.log[keys.shift()];}
// Returns the events this answer triggered, for the celebration queue.
function rewardAnswer(first,stars){
  const ev=[],lg=dayLog(),goal=P.settings.goal||20,before=lg.q,tierBefore=tierOf(P.earned).id;
  lg.q++;if(first)lg.first++;lg.stars+=stars;P.earned+=stars;
  if(before<goal&&lg.q>=goal){P.goalDays=(P.goalDays||0)+1;P.stars+=10;P.earned+=10;lg.stars+=10;ev.push({kind:'goal'});}
  const t=tierOf(P.earned);if(t.id!==tierBefore)ev.push({kind:'tier',data:t});
  pruneLog();return ev;
}
// ---------- topic medals ----------
function topicMedal(t){const s=tstat(t.id),a=acc(s)||0;
  if(t.strand==='Reading')return s.att>=30&&a>=85?'platinum':s.att>=20&&a>=75?'gold':s.att>=12&&a>=60?'silver':s.att>=6?'bronze':null;
  return s.level===3&&s.att>=40&&a>=85?'platinum':s.level===3&&a>=70?'gold':s.level>=2&&s.att>=20?'silver':s.att>=10?'bronze':null;}
const ALLT=()=>[...TOPICS,...THINK,...RPARTS];
const totalQ=()=>Object.values(P.topics).reduce((n,s)=>n+s.att,0);
// ---------- badges ----------
const BADGES=[
  {id:'first',name:'First steps',glyph:'1',col:'#8CC8FF',how:'Answer your first question',ok:()=>totalQ()>=1},
  {id:'q100',name:'Century',glyph:'100',col:'#CD7F32',how:'Answer 100 questions',ok:()=>totalQ()>=100},
  {id:'q500',name:'Question crusher',glyph:'500',col:'#C3CAD6',how:'Answer 500 questions',ok:()=>totalQ()>=500},
  {id:'q1000',name:'Thousand club',glyph:'1K',col:'#F2C230',how:'Answer 1000 questions',ok:()=>totalQ()>=1000},
  {id:'streak3',name:'Warming up',glyph:'3d',col:'#FFB46B',how:'Practise 3 days in a row',ok:()=>(P.day.best||0)>=3},
  {id:'streak7',name:'One whole week',glyph:'7d',col:'#FF8A5B',how:'Practise 7 days in a row',ok:()=>(P.day.best||0)>=7},
  {id:'streak14',name:'Fortnight force',glyph:'14d',col:'#FF6B6B',how:'Practise 14 days in a row',ok:()=>(P.day.best||0)>=14},
  {id:'streak30',name:'Unstoppable',glyph:'30d',col:'#E5484D',how:'Practise 30 days in a row',ok:()=>(P.day.best||0)>=30},
  {id:'goal1',name:'Goal getter',glyph:'★',col:'#F2C230',how:'Reach your daily goal',ok:()=>(P.goalDays||0)>=1},
  {id:'goal10',name:'Goal machine',glyph:'10★',col:'#B88CFF',how:'Reach your daily goal on 10 days',ok:()=>(P.goalDays||0)>=10},
  {id:'perfect',name:'Perfect round',glyph:'10/10',col:'#52D68A',how:'Get all 10 right first try in a round',ok:()=>(P.perfect||0)>=1},
  {id:'combo10',name:'Combo king',glyph:'×10',col:'#3E63DD',how:'Get 10 right first try in a row',ok:()=>(P.bestRun||0)>=10},
  {id:'test1',name:'Test brave',glyph:'T',col:'#8FE0D6',how:'Finish a mock test',ok:()=>P.tests.length>=1},
  {id:'test80',name:'Test star',glyph:'80%',col:'#F2C230',how:'Score 80% or more on a mock test',ok:()=>P.tests.some(t=>t.score/(t.total||35)>=.8)},
  {id:'allpapers',name:'Triple threat',glyph:'3',col:'#B88CFF',how:'Finish a Maths, Thinking Skills and Reading mock test',ok:()=>['maths','think','read'].every(k=>P.tests.some(t=>(t.type||'maths')===k))},
  {id:'sprint20',name:'Speedy fingers',glyph:'20',col:'#FFB46B',how:'Score 20 in the times-table sprint',ok:()=>P.sprintBest>=20},
  {id:'sprint30',name:'Lightning brain',glyph:'30',col:'#E5484D',how:'Score 30 in the times-table sprint',ok:()=>P.sprintBest>=30},
  {id:'reader',name:'Bookworm',glyph:'¶',col:'#52D68A',how:'Try all five Reading parts',ok:()=>RPARTS.every(t=>tstat(t.id).att>0)},
  {id:'thinker',name:'Big thinker',glyph:'?!',col:'#8E4EC6',how:'Reach Level 3 in a Thinking Skills topic',ok:()=>THINK.some(t=>tstat(t.id).level===3)},
  {id:'allround',name:'All-rounder',glyph:'∞',col:'#3E63DD',how:'Earn a medal in every maths topic',ok:()=>TOPICS.every(t=>topicMedal(t))},
];
function checkBadges(){const out=[];for(const b of BADGES)if(!P.badges[b.id]&&b.ok()){P.badges[b.id]=today();out.push({kind:'badge',data:b});}return out;}
// ---------- Koala Shop ----------
const ITEMS=[
  {id:'bowtie',name:'Bow tie',cost:30,slot:'neck',svg:'<g class="item"><path d="M47 103 L60 109 L47 116 Z M73 103 L60 109 L73 116 Z" fill="#8E4EC6"/><circle cx="60" cy="109" r="3.6" fill="#6B35A0"/></g>'},
  {id:'shades',name:'Cool shades',cost:50,slot:'eyes',svg:'<g class="item"><rect x="32" y="50" width="24" height="14" rx="5" fill="#111"/><rect x="64" y="50" width="24" height="14" rx="5" fill="#111"/><rect x="55" y="54" width="10" height="3" fill="#111"/></g>'},
  {id:'party',name:'Party hat',cost:80,slot:'head',svg:'<g class="item"><path d="M44 26 L60 -6 L76 26 Z" fill="#FFD43B"/><path d="M48 18 L72 18 L69 12 L51 12 Z" fill="#E5484D"/><circle cx="60" cy="-6" r="6" fill="#E5484D"/></g>'},
  {id:'headphones',name:'Headphones',cost:120,slot:'ears',svg:'<g class="item"><path d="M20 44 Q60 -12 100 44" stroke="#E5484D" stroke-width="7" fill="none"/><rect x="8" y="34" width="17" height="26" rx="7" fill="#E5484D"/><rect x="95" y="34" width="17" height="26" rx="7" fill="#E5484D"/></g>'},
  {id:'flowers',name:'Flower crown',cost:160,slot:'head',svg:'<g class="item">'+[[40,26,'#FF8FB1'],[52,20,'#FFD43B'],[64,19,'#8CC8FF'],[76,22,'#FF8FB1'],[86,30,'#B88CFF']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="6.5" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`).join('')+'</g>'},
  {id:'crown',name:'Royal crown',cost:250,slot:'head',svg:'<g class="item"><path d="M38 28 L40 6 L50 18 L60 2 L70 18 L80 6 L82 28 Z" fill="#FFC531" stroke="#C99400" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="18" r="3.5" fill="#E5484D"/><circle cx="46" cy="22" r="2.5" fill="#3E63DD"/><circle cx="74" cy="22" r="2.5" fill="#3E63DD"/></g>'},
  {id:'pirate',name:'Pirate hat',cost:320,slot:'head',svg:'<g class="item"><path d="M28 28 Q60 -10 92 28 Q60 18 28 28Z" fill="#1D2433"/><circle cx="60" cy="13" r="4.5" fill="#fff"/><path d="M55 20 L65 20" stroke="#fff" stroke-width="2"/></g>'},
  {id:'wizard',name:'Wizard hat',cost:400,slot:'head',svg:'<g class="item"><path d="M38 28 L64 -14 L84 28 Z" fill="#3E63DD"/><ellipse cx="61" cy="28" rx="29" ry="5.5" fill="#2F4EB8"/><path d="M60 4 l2 5 5 0-4 3 2 5-5-3-5 3 2-5-4-3 5 0z" fill="#FFD43B"/><circle cx="71" cy="16" r="2" fill="#FFD43B"/></g>'},
  {id:'gradcap',name:'Graduation cap',cost:600,slot:'head',svg:'<g class="item"><path d="M28 16 L60 3 L92 16 L60 29 Z" fill="#1D2433"/><rect x="46" y="20" width="28" height="9" fill="#1D2433"/><path d="M90 16 L90 34" stroke="#FFD43B" stroke-width="2"/><circle cx="90" cy="36" r="3.4" fill="#FFD43B"/></g>'},
];
const ITEM=Object.fromEntries(ITEMS.map(i=>[i.id,i]));
function wornSVG(){return(P.wear||[]).map(id=>ITEM[id]?ITEM[id].svg:'').join('');}
function wearsSlot(slot){return(P.wear||[]).some(id=>ITEM[id]&&ITEM[id].slot===slot);}

// ---------- views ----------
function goalRing(done,goal){const r=34,c=2*Math.PI*r,f=Math.min(1,done/goal);
  return`<svg class="ring" viewBox="0 0 84 84" width="96" height="96" aria-hidden="true"><circle cx="42" cy="42" r="${r}" class="ring-bg"/><circle cx="42" cy="42" r="${r}" class="ring-fg${f>=1?' full':''}" stroke-dasharray="${(c*f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 42 42)"/>
  <text x="42" y="40" text-anchor="middle" class="ring-n">${done}</text><text x="42" y="56" text-anchor="middle" class="ring-d">of ${goal}</text></svg>`;}
function weekChart(days=14){
  const goal=P.settings.goal||20,ds=[];for(let i=days-1;i>=0;i--){const d=new Date(Date.now()-i*864e5).toLocaleDateString('en-CA');ds.push({d,q:(P.log[d]||{}).q||0});}
  const max=Math.max(goal,...ds.map(x=>x.q)),W=34,H=120,top=10,y=v=>top+H-(v/max)*H;
  return`<div class="tablewrap"><svg class="chart" viewBox="0 0 ${days*W+30} ${H+44}" width="${days*W+30}" role="img" aria-label="Questions per day for the last ${days} days">
  <line x1="24" x2="${days*W+26}" y1="${y(goal).toFixed(1)}" y2="${y(goal).toFixed(1)}" class="goal-line"/><text x="2" y="${(y(goal)+4).toFixed(1)}" class="sv-tick-label">${goal}</text>
  ${ds.map((x,i)=>{const bx=28+i*W,h=Math.max(x.q?3:0,top+H-y(x.q)),dd=new Date(x.d+'T12:00');return`${x.q?`<rect x="${bx}" y="${(top+H-h).toFixed(1)}" width="${W-10}" height="${h.toFixed(1)}" rx="4" class="${x.q>=goal?'bar-met':'bar'}"/>`:''}
    ${x.q?`<text x="${bx+(W-10)/2}" y="${(top+H-h-4).toFixed(1)}" text-anchor="middle" class="sv-tick-label">${x.q}</text>`:''}<text x="${bx+(W-10)/2}" y="${top+H+16}" text-anchor="middle" class="sv-cat">${'SMTWTFS'[dd.getDay()]}</text><text x="${bx+(W-10)/2}" y="${top+H+30}" text-anchor="middle" class="sv-tick-label">${dd.getDate()}</text>`;}).join('')}</svg></div>`;
}
function vProgressCard(){
  const lg=P.log[today()]||{q:0},goal=P.settings.goal||20,t=tierOf(P.earned),nx=nextTier(P.earned),pct=nx?Math.round(100*(P.earned-t.min)/(nx.min-t.min)):100;
  return`<section class="progress-card">
    <div class="pc-goal">${goalRing(lg.q,goal)}<div><p class="eyebrow">Today's goal</p><p class="pc-big">${lg.q>=goal?'Goal reached! +10 ★ bonus':`${goal-lg.q} more question${goal-lg.q===1?'':'s'} to go`}</p><p class="pc-small"><span class="flame">${flameSVG()}</span> ${P.day.streak||0}-day streak · best ${P.day.best||0}</p></div></div>
    <div class="pc-tier">${medalSVG(t.col,t.name[0],52)}<div class="pc-tinfo"><p class="eyebrow">${t.name} tier</p><div class="meter big"><i style="width:${pct}%"></i></div><p class="pc-small">${nx?`${nx.min-P.earned} stars to ${nx.name}`:'Top tier reached!'}</p></div></div>
    <div class="pc-actions"><button class="btn ghost" data-act="trophies">My trophies <span class="count">${Object.keys(P.badges).length}/${BADGES.length}</span></button><button class="btn ghost" data-act="shop">Koala Shop <span class="count">★ ${P.stars}</span></button></div>
  </section>`;
}
function flameSVG(){return'<svg viewBox="0 0 20 24" width="16" height="19" aria-hidden="true"><path d="M10 1 C12 6 17 8 17 15 A7 7 0 0 1 3 15 C3 11 6 9 7 6 C8 9 9 10 10 10 C10 7 9 4 10 1Z" fill="#FF8A3D"/><path d="M10 12 C11 14 13 15 13 18 A3 3 0 0 1 7 18 C7 16 9 15 10 12Z" fill="#FFD43B"/></svg>';}
function vTrophies(){
  const t=tierOf(P.earned),ladder=TIERS.map(x=>`<li class="tier${x.id===t.id?' cur':''}${P.earned>=x.min?' got':''}">${medalSVG(x.col,x.name[0],44,P.earned<x.min)}<span><b>${x.name}</b><small>${x.min} stars</small></span></li>`).join('');
  const tm=ALLT().map(x=>{const m=topicMedal(x);return`<li>${medalSVG(m?MEDAL_COL[m]:'#ccc',x.glyph.length>3?x.glyph.slice(0,3):x.glyph,40,!m)}<span><b>${x.name}</b><small>${m?m[0].toUpperCase()+m.slice(1):'Keep practising'}</small></span></li>`;}).join('');
  const bd=BADGES.map(b=>{const got=P.badges[b.id];return`<li class="${got?'got':''}">${medalSVG(b.col,b.glyph,52,!got)}<b>${b.name}</b><small>${got?`Unlocked ${got}`:b.how}</small></li>`;}).join('');
  return`<div class="qtop"><button class="link" data-act="home">← Home</button></div>
  <section class="panel"><p class="eyebrow">My trophies</p><h1>${t.name} tier · ${P.earned} stars earned</h1><p class="lede">Every star you earn counts towards your tier, even the ones you spend in the Koala Shop.</p><ol class="ladder">${ladder}</ol></section>
  <section class="panel"><h2 class="sec">Last 14 days</h2><p class="lede sm">Questions answered each day. Green bars reached the daily goal of ${P.settings.goal||20}.</p>${weekChart(14)}</section>
  <section class="panel"><h2 class="sec">Badges · ${Object.keys(P.badges).length} of ${BADGES.length}</h2><ul class="badges">${bd}</ul></section>
  <section class="panel"><h2 class="sec">Topic medals</h2><p class="lede sm">Bronze: keep practising. Silver: reach Level 2. Gold: Level 3 with 70% first try. Platinum: Level 3 with 85% first try over 40 questions.</p><ul class="tmedals">${tm}</ul></section>`;
}
function vShop(){
  const cards=ITEMS.map(it=>{const own=P.owned.includes(it.id),on=(P.wear||[]).includes(it.id),can=P.stars>=it.cost;
    return`<li class="shop-item${on?' on':''}"><div class="shop-koala">${koalaSVG(it.svg)}</div><b>${it.name}</b>
      ${own?`<button class="btn ${on?'primary':'ghost'} sm" data-act="wear" data-arg="${it.id}">${on?'Wearing ✓':'Wear it'}</button>`:`<button class="btn ${can?'primary':'ghost'} sm" data-act="buy" data-arg="${it.id}" ${can?'':'disabled'}>★ ${it.cost}</button>`}</li>`;}).join('');
  return`<div class="qtop"><button class="link" data-act="home">← Home</button></div>
  <section class="panel shop-head"><div class="shop-me">${koalaSVG(wornSVG())}</div><div><p class="eyebrow">Koala Shop</p><h1>You have ★ ${P.stars} to spend</h1><p class="lede">Earn stars by answering questions, then dress up your koala. It wears your outfit every time it celebrates with you. You can wear one hat plus glasses, headphones and a bow tie.</p></div></section>
  <section class="panel"><ul class="shop">${cards}</ul></section>`;
}
