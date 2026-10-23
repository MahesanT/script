// Celebrations: confetti, star bursts, a koala mascot with jokes, a hopping kangaroo and little chimes.
// Everything draws into a fixed overlay outside #app, so re-renders don't cut animations short.
const FX={
  layer:null,ctx:null,parts:[],raf:0,audio:null,
  calm:()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,
  on:()=>!!(P.settings.fx??1),
  init(){if(this.layer)return;const l=document.createElement('div');l.id='fx';l.setAttribute('aria-hidden','true');l.innerHTML='<canvas></canvas>';document.body.appendChild(l);this.layer=l;this.ctx=l.querySelector('canvas').getContext('2d');}
};
const JOKES=['Koala-ty answer!','Eucalyp-TASTIC!','Your brain just did a backflip!','That answer was so good, I dropped my gum leaf!','Nailed it! (Not with a hammer. Please put the hammer down.)','Brain power: 1000%!','Even the kangaroos are jumping for you!','You’re on a roll… like a sausage roll!','Big brain energy!','Koalas sleep 20 hours a day. You just woke me up with that answer!','Correct-a-mundo!','Smarty-pants alert!'];
const AFTER=['You got there! That’s how champions learn.','Never gave up. Love it!','Second time lucky? No, second time SMART.','Mistakes are just brain stretches!'];
const STREAK3=['Three in a row! Too cool for school.','Hat-trick! 🎩','3 in a row! Sunglasses ON.'];
const STREAK5=['FIVE in a row! Unstoppable!','5 in a row! Someone call the brain police!','You’re on fire! (Not really. Stay safe.)'];
const LEVELUP=['LEVEL UP! Party time!','New level unlocked!','Level up! The koalas are throwing you a party!'];

function koalaSVG(extra){
  return`<svg viewBox="0 -14 120 144" width="120" height="144"><g class="kbody">
  <circle cx="24" cy="36" r="22" fill="#98A1B3"/><circle cx="96" cy="36" r="22" fill="#98A1B3"/><circle cx="24" cy="38" r="12" fill="#F2C4CF"/><circle cx="96" cy="38" r="12" fill="#F2C4CF"/>
  <circle cx="60" cy="64" r="42" fill="#B6BECD"/><circle cx="38" cy="78" r="7" fill="#F2C4CF" opacity=".7"/><circle cx="82" cy="78" r="7" fill="#F2C4CF" opacity=".7"/>
  <g class="keyes"><circle cx="44" cy="58" r="5.5" fill="#1D2433"/><circle cx="76" cy="58" r="5.5" fill="#1D2433"/><circle cx="46" cy="56" r="1.8" fill="#fff"/><circle cx="78" cy="56" r="1.8" fill="#fff"/></g>
  <ellipse cx="60" cy="73" rx="11" ry="14" fill="#2B3140"/><path d="M50 92 Q60 101 70 92" stroke="#2B3140" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="34" cy="118" rx="13" ry="9" fill="#98A1B3"/><ellipse cx="86" cy="118" rx="13" ry="9" fill="#98A1B3"/>${extra||''}</g></svg>`;
}
const SHADES='<g class="shades"><rect x="32" y="50" width="24" height="14" rx="5" fill="#111"/><rect x="64" y="50" width="24" height="14" rx="5" fill="#111"/><rect x="55" y="54" width="10" height="3" fill="#111"/></g>';
const HAT='<g class="hat"><path d="M44 26 L60 -6 L76 26 Z" fill="#FFD43B"/><path d="M48 18 L72 18 L69 12 L51 12 Z" fill="#E5484D"/><circle cx="60" cy="-6" r="6" fill="#E5484D"/></g>';
function kangarooSVG(){
  return`<svg viewBox="0 0 120 100" width="110" height="92"><g fill="#C68A4E">
  <path d="M8 70 Q30 62 46 66 L44 72 Q26 72 10 76 Z"/><ellipse cx="60" cy="60" rx="22" ry="26"/><ellipse cx="84" cy="30" rx="13" ry="11"/>
  <path d="M74 24 L70 6 L80 20 Z"/><path d="M84 20 L86 2 L92 18 Z"/><rect x="72" y="36" width="10" height="16" rx="5"/>
  <path d="M50 80 Q46 92 64 94 L78 94 Q80 88 70 86 L66 78 Z"/></g><ellipse cx="62" cy="64" rx="10" ry="12" fill="#E2B888"/>
  <circle cx="88" cy="28" r="2.2" fill="#1D2433"/><circle cx="97" cy="33" r="2" fill="#2B3140"/><path d="M76 46 L84 52" stroke="#A86F38" stroke-width="4" stroke-linecap="round"/></svg>`;
}

// ---------- sound (Web Audio, starts only after a tap) ----------
function chime(notes,len=.11,type='triangle',vol=.12){
  if(P.settings.sound===false)return;
  try{FX.audio=FX.audio||new (window.AudioContext||window.webkitAudioContext)();const a=FX.audio,t0=a.currentTime;
    notes.forEach((f,i)=>{const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;const t=t0+i*len;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+len*2.4);o.connect(g).connect(a.destination);o.start(t);o.stop(t+len*2.6);});
  }catch(e){}
}

// ---------- confetti ----------
function confetti(x,y,n=90,spread=1){
  FX.init();const c=FX.layer.querySelector('canvas'),dpr=window.devicePixelRatio||1;c.width=innerWidth*dpr;c.height=innerHeight*dpr;FX.ctx.setTransform(dpr,0,0,dpr,0,0);
  const cs=getComputedStyle(document.documentElement),cols=['--accent','--hi','--ok','--bad','--shade','--tone-d'].map(v=>cs.getPropertyValue(v).trim()||'#FFD43B');
  for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.3*spread,sp=6+Math.random()*9;
    FX.parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:Math.random()*6.28,vr:(Math.random()-.5)*.4,s:5+Math.random()*7,c:pick(cols),k:Math.random()<.25?'star':Math.random()<.5?'dot':'rect',life:0});}
  if(!FX.raf)FX.raf=requestAnimationFrame(tick);
}
function star(ctx,s){ctx.beginPath();for(let i=0;i<10;i++){const r=i%2?s*.45:s,a=i*Math.PI/5-Math.PI/2;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();}
function tick(){
  const ctx=FX.ctx;ctx.clearRect(0,0,innerWidth,innerHeight);
  FX.parts=FX.parts.filter(p=>p.life<140&&p.y<innerHeight+40);
  for(const p of FX.parts){p.life++;p.vy+=.28;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=Math.max(0,1-p.life/140);ctx.fillStyle=p.c;
    if(p.k==='star')star(ctx,p.s);else if(p.k==='dot'){ctx.beginPath();ctx.arc(0,0,p.s/2,0,6.28);ctx.fill();}else ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);ctx.restore();}
  FX.raf=FX.parts.length?requestAnimationFrame(tick):0;
}

// ---------- DOM pieces ----------
function fxEl(cls,html,ms){FX.init();const d=document.createElement('div');d.className=cls;d.innerHTML=html;FX.layer.appendChild(d);setTimeout(()=>d.remove(),ms);return d;}
function mascot(text,extra,big){
  FX.layer&&FX.layer.querySelectorAll('.koala').forEach(k=>k.remove());
  const prop=extra===HAT&&wearsSlot('head')?'':extra===SHADES&&wearsSlot('eyes')?'':(extra||'');
  fxEl(`koala${big?' big':''}`,`<div class="bubble">${text}</div>${koalaSVG(wornSVG()+prop)}`,2900);
}
function kangaroo(){fxEl('roo',`<div class="roo-in">${kangarooSVG()}</div>`,3200);}
function burst(el){if(!el)return;const r=el.getBoundingClientRect();
  for(let i=0;i<8;i++){const a=i*Math.PI/4,d=fxEl('spark','<svg viewBox="-10 -10 20 20" width="18" height="18"><path d="M0-9L2.6-2.8 9-2.8 3.9 1.1 5.6 7.5 0 3.8-5.6 7.5-3.9 1.1-9-2.8-2.6-2.8Z" fill="#FFD43B" stroke="#E5A800" stroke-width=".8"/></svg>',800);
    d.style.left=(r.left+r.width/2)+'px';d.style.top=(r.top+r.height/2)+'px';d.style.setProperty('--dx',Math.cos(a)*70+'px');d.style.setProperty('--dy',Math.sin(a)*50+'px');}}
function floatText(el,text){if(!el)return;const r=el.getBoundingClientRect(),d=fxEl('floaty',text,900);d.style.left=(r.left+r.width/2)+'px';d.style.top=r.top+'px';}
function banner(text){fxEl('fx-banner',text,2200);}

// Stars fly from the answer to the header counter, which bumps when they land.
function flyStars(el,n){
  const tgt=document.querySelector('.tally .starcount');if(!el||!tgt||FX.calm())return;
  const a=el.getBoundingClientRect(),b=tgt.getBoundingClientRect();
  for(let i=0;i<n;i++){const d=fxEl('flystar','<svg viewBox="-10 -10 20 20" width="22" height="22"><path d="M0-9L2.6-2.8 9-2.8 3.9 1.1 5.6 7.5 0 3.8-5.6 7.5-3.9 1.1-9-2.8-2.6-2.8Z" fill="#FFD43B" stroke="#E5A800" stroke-width=".8"/></svg>',1300);
    d.style.left=(a.left+a.width*.3+i*18)+'px';d.style.top=(a.top+a.height/2)+'px';d.style.setProperty('--tx',(b.left+b.width/2-(a.left+a.width*.3+i*18))+'px');d.style.setProperty('--ty',(b.top+b.height/2-(a.top+a.height/2))+'px');d.style.animationDelay=(i*.12)+'s';}
  setTimeout(()=>{tgt.classList.remove('bump');void tgt.offsetWidth;tgt.classList.add('bump');chime([1318],.05,'sine',.06);},900+n*120);
}
// A wrong answer gets a gentle wobble and a soft "boop", never a harsh buzzer.
function oops(el){if(!FX.on())return;if(el&&!FX.calm()){el.classList.add('shake');setTimeout(()=>el.classList.remove('shake'),500);}chime([330,262],.09,'sine',.07);}
function tap(){if(FX.on())chime([740],.03,'sine',.04);}
// Several rewards at once (a level-up, a badge and the daily goal) play one after another.
const FXQ=[];let fxBusy=false;
function celebrateAll(list,el){if(!list.length)return;for(let i=FXQ.length-1;i>=0;i--)if(FXQ[i].kind==='correct'||FXQ[i].kind==='after')FXQ.splice(i,1);FXQ.push(...list.map(e=>({...e,el})));if(!fxBusy)nextFx();}
function nextFx(){const e=FXQ.shift();if(!e){fxBusy=false;return;}fxBusy=true;celebrate(e.kind,e.el,e.data);setTimeout(nextFx,e.kind==='correct'||e.kind==='after'?1600:3000);}
function badgeCard(b){fxEl('badge-pop',`<div class="badge-in">${medalSVG(b.col,b.glyph,110)}<p>Badge unlocked!</p><b>${b.name}</b></div>`,2900);}

// ---------- entry points ----------
function celebrate(kind,el,data){
  if(!FX.on())return;
  if(FX.calm()){banner(kind==='after'?pick(AFTER):kind==='levelup'?pick(LEVELUP):'Correct!');return;}
  const r=el?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0},x=r.left+r.width/2,y=r.top+r.height/2;
  if(kind==='after'){burst(el);mascot(pick(AFTER));chime([523,659],.1);return;}
  if(kind==='levelup'){confetti(innerWidth*.25,innerHeight*.9,90);confetti(innerWidth*.75,innerHeight*.9,90);banner('LEVEL UP!');mascot(pick(LEVELUP),HAT,true);chime([523,659,784,1046,784,1046],.12,'square',.07);return;}
  if(kind==='streak5'){confetti(x,y,140,1.3);setTimeout(()=>confetti(innerWidth*.2,innerHeight*.85,70),250);setTimeout(()=>confetti(innerWidth*.8,innerHeight*.85,70),450);mascot(pick(STREAK5),SHADES,true);kangaroo();chime([523,659,784,1046,1318],.09);return;}
  if(kind==='streak3'){confetti(x,y,110);burst(el);mascot(pick(STREAK3),SHADES);chime([523,659,784,1046],.09);return;}
  if(kind==='test'){confetti(innerWidth*.3,innerHeight*.8,120);confetti(innerWidth*.7,innerHeight*.8,120);mascot('What a test result! You should be SO proud!',HAT,true);kangaroo();chime([523,659,784,1046,784,1046,1318],.12);return;}
  if(kind==='round'){confetti(innerWidth*.3,innerHeight*.8,100);confetti(innerWidth*.7,innerHeight*.8,100);mascot('Round complete! Brilliant work!',HAT,true);chime([523,659,784,1046],.1);return;}
  if(kind==='best'){confetti(x,y,120,1.2);banner('NEW BEST!');mascot('New best score! Your fingers are on fire!',SHADES,true);chime([523,659,784,1046,1318],.09);return;}
  if(kind==='goal'){confetti(innerWidth*.2,innerHeight*.9,90);confetti(innerWidth*.8,innerHeight*.9,90);banner('DAILY GOAL!');mascot('Daily goal smashed! Here are 10 bonus stars!',HAT,true);chime([523,659,784,1046,1318,1046,1318],.1);return;}
  if(kind==='tier'){confetti(innerWidth/2,innerHeight*.9,160,1.4);fxEl('badge-pop',`<div class="badge-in">${medalSVG(data.col,data.name[0],120)}<p>New tier!</p><b>${data.name}</b></div>`,2900);chime([392,523,659,784,1046],.14,'square',.06);return;}
  if(kind==='badge'){confetti(innerWidth/2,innerHeight*.45,90,1.6);badgeCard(data);chime([784,988,1175,1568],.1);return;}
  if(kind==='buy'){confetti(x,y,80);mascot(pick(['Ooh, fancy! Thank you!','I look AMAZING.','Best. Outfit. Ever.','Do I look clever in this?']),'',true);chime([659,784,988,1318],.08);return;}
  // plain first-try correct: confetti + stars, and sometimes the koala or a hopping kangaroo
  confetti(x,y,70);burst(el);chime([659,880],.09);
  const roll=Math.random();if(roll<.45)mascot(pick(JOKES));else if(roll<.62)kangaroo();
}
function sprintPop(el){if(!FX.on())return;floatText(el,'+1');chime([880],.06,'sine',.08);}
