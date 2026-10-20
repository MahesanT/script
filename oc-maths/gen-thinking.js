// Thinking Skills (OC paper 3): logic, spatial reasoning, puzzles & codes, critical thinking.
function perms(a){if(a.length<=1)return[a.slice()];const out=[];a.forEach((x,i)=>{for(const p of perms(a.filter((_,j)=>j!==i)))out.push([x,...p]);});return out;}
const people=n=>shuffle(NAMES).slice(0,n);
const ORD=['','second ','third ','fourth '];
const TRAITS=[{more:'taller than',less:'shorter than',top:'tallest',bot:'shortest'},{more:'older than',less:'younger than',top:'oldest',bot:'youngest'},{more:'faster than',less:'slower than',top:'fastest',bot:'slowest'}];

function tOrdering(L){
  const n=L===3?5:4,tr=pick(TRAITS),ppl=people(n),order=shuffle(ppl);
  const pairs=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)pairs.push([order[i],order[j]]);
  const pool=L===1?shuffle(order.slice(0,-1).map((p,i)=>[p,order[i+1]])):shuffle(pairs);
  let cands=perms(ppl);const clues=[];
  for(const[a,b]of pool){if(cands.length===1)break;const nc=cands.filter(o=>o.indexOf(a)<o.indexOf(b));if(nc.length<cands.length){clues.push([a,b]);cands=nc;}}
  const k=R(0,n-1),ans=order[k],pos=k===0?`the ${tr.top}`:k===n-1?`the ${tr.bot}`:`the ${ORD[k]}${tr.top}`;
  const say=([a,b])=>Math.random()<.5?`${a} is ${tr.more} ${b}.`:`${b} is ${tr.less} ${a}.`;
  return{text:`${shuffle(clues).map(say).join(' ')}<br>Who is <b>${pos}</b>?`,...mc(ans,ppl.filter(p=>p!==ans)),
    hint:`Draw a line from ${tr.top} to ${tr.bot}. Place each person as you read the clues.`,
    steps:[`Write every clue the same way round, using "${tr.more}" (shown as &gt;): ${clues.map(([a,b])=>`${a} &gt; ${b}`).join(', ')}`,`Join them up. The only order that fits all the clues is: <b>${order.join(' &gt; ')}</b>`,`${cap(pos)} is <b>${ans}</b>.`]};
}
function tSeating(L){
  for(let tries=0;tries<20;tries++){
    const n=L===3?5:4,ppl=people(n),arr=shuffle(ppl),ix=(o,p)=>o.indexOf(p);
    const gen=()=>{const[a,b]=shuffle(ppl);switch(R(0,5)){
      case 0:return{s:`${a} sits at one end of the row.`,f:o=>ix(o,a)===0||ix(o,a)===n-1};
      case 1:return{s:`${a} sits next to ${b}.`,f:o=>Math.abs(ix(o,a)-ix(o,b))===1};
      case 2:return{s:`${a} does not sit next to ${b}.`,f:o=>Math.abs(ix(o,a)-ix(o,b))!==1};
      case 3:return{s:`${a} sits somewhere to the left of ${b}.`,f:o=>ix(o,a)<ix(o,b)};
      case 4:return{s:`${a} sits directly to the left of ${b}.`,f:o=>ix(o,b)-ix(o,a)===1};
      default:return{s:`${a} does not sit at either end.`,f:o=>ix(o,a)>0&&ix(o,a)<n-1};}};
    let cands=perms(ppl);const clues=[];let g=0;
    while(cands.length>1&&g++<400){const c=gen();if(!c.f(arr))continue;const nc=cands.filter(c.f);if(nc.length<cands.length){clues.push(c);cands=nc;}}
    if(cands.length!==1||clues.length>6)continue;
    const k=R(0,n-1),ans=arr[k],seat=k===0?'at the far left':k===n-1?'at the far right':`in seat ${k+1} from the left`;
    return{text:`${n} friends sit in a row of ${n} seats. Left and right are as you look at the row.<br>${clues.map(c=>c.s).join('<br>')}<br>Who sits <b>${seat}</b>?`,...mc(ans,ppl.filter(p=>p!==ans)),
      hint:`Draw ${n} boxes in a row. Start with the clue that tells you the most, then test the others.`,
      steps:[`Draw ${n} seats and try placing people so that every clue is true.`,...clues.map(c=>`${c.s} ✓`),`The only seating that works (left to right) is: <b>${arr.join(', ')}</b>`,`The person ${seat} is <b>${ans}</b>.`]};
  }
  return tOrdering(L);
}
const GROUPS=[{g:'the choir',p:'can play the recorder',pp:'can play the recorder',np:'cannot play the recorder'},{g:'the chess club',p:'wears glasses',pp:'wear glasses',np:'does not wear glasses'},
  {g:'Red House',p:'has a red hat',pp:'have a red hat',np:'does not have a red hat'},{g:'the swim squad',p:'can swim 50 metres',pp:'can swim 50 metres',np:'cannot swim 50 metres'}];
const CHAINS=[{s:['Everyone who visits the zoo on Monday gets a free hat.','Everyone with a free hat can ride the zoo train.','{N} visited the zoo on Monday.'],r:'{N} can ride the zoo train.',w:['Everyone who rides the zoo train visited on Monday.','{N} did not get a free hat.','Only people with hats visit the zoo.']},
  {s:['All students who finish their reading log get a bookmark.','Everyone with a bookmark goes into the prize draw.','{N} finished the reading log.'],r:'{N} goes into the prize draw.',w:['{N} will win the prize draw.','Everyone in the prize draw finished a reading log.','{N} did not get a bookmark.']},
  {s:['Every child in Year 4 is going on the camp.','Everyone going on the camp needs a sleeping bag.','{N} is in Year 4.'],r:'{N} needs a sleeping bag.',w:['Everyone with a sleeping bag is in Year 4.','{N} is not going on the camp.','Only Year 4 children have sleeping bags.']}];
function tMustBeTrue(L){
  const N=pick(NAMES),G=pick(GROUPS),rep=s=>s.replace(/\{N\}/g,N),Q='<br>Which statement is <b>correct</b>?';
  const kind=L===1?pick(['fwd','rev']):L===2?pick(['fwd','rev','contra','some']):pick(['contra','some','chain','rev']);
  const all=`Everyone in ${G.g} ${G.p}.`;
  if(kind==='fwd')return{text:`${all} ${N} is in ${G.g}.${Q}`,...mc(`${N} ${G.p}.`,[`Everyone who ${G.p} is in ${G.g}.`,`${N} ${G.np}.`,`${N} is the only one in ${G.g} who ${G.p}.`]),
    hint:`The rule is about everyone in ${G.g}. Is ${N} one of them?`,steps:[`The rule says everyone in ${G.g} ${G.p}.`,`${N} is in ${G.g}, so the rule applies to ${N}.`,`Correct: <b>${N} ${G.p}.</b>`]};
  if(kind==='rev')return{text:`${all} ${N} ${G.p}.${Q}`,...mc(`We cannot be sure whether ${N} is in ${G.g}.`,[`${N} is in ${G.g}.`,`${N} is not in ${G.g}.`,`Everyone who ${G.p} is in ${G.g}.`]),
    hint:`Does the rule say that ONLY people in ${G.g} ${G.pp}?`,steps:[`The rule only tells us about people <b>in</b> ${G.g}.`,`It does not say that only people in ${G.g} ${G.pp}. Others might too.`,`So ${N} might be in ${G.g}, or might not. <b>We cannot be sure.</b>`]};
  if(kind==='contra')return{text:`${all} ${N} ${G.np}.${Q}`,...mc(`${N} is not in ${G.g}.`,[`${N} is in ${G.g}.`,`We cannot be sure whether ${N} is in ${G.g}.`,`Nobody in ${G.g} ${G.p}.`]),
    hint:`What would be true about ${N} if ${N} were in ${G.g}?`,steps:[`If ${N} were in ${G.g}, then ${N} would have to follow the rule.`,`But ${N} ${G.np}.`,`So <b>${N} is not in ${G.g}.</b>`]};
  if(kind==='some')return{text:`Some children in ${G.g} ${G.pp}. ${N} is in ${G.g}.${Q}`,...mc(`We cannot be sure whether ${N} ${G.p}.`,[`${N} ${G.p}.`,`${N} ${G.np}.`,`Everyone in ${G.g} ${G.pp}.`]),
    hint:`What does the word "some" tell you? Does it mean everyone?`,steps:[`"Some" means at least one, but not necessarily all.`,`${N} could be one of the children who ${G.pp}, or not.`,`So <b>we cannot be sure.</b>`]};
  const C=pick(CHAINS);
  return{text:`${C.s.map(rep).join(' ')}${Q}`,...mc(rep(C.r),C.w.map(rep)),hint:`Follow the rules one after the other, like a chain.`,
    steps:[`${rep(C.s[2])}`,`So the first rule applies: ${C.s[0]}`,`Then the second rule applies: ${C.s[1]}`,`Correct: <b>${rep(C.r)}</b>`]};
}
function tTruth(L){
  const thing=pick(['broke the window','ate the last biscuit','let the class guinea pig out','spilled the paint']),T=L===1?3:1;
  for(let g=0;g<800;g++){
    const ppl=people(4);
    const st=ppl.map(sp=>{const t=R(0,2),o=pick(ppl.filter(x=>x!==sp));
      return t===0?{sp,s:`"${o} did it."`,f:c=>c===o}:t===1?{sp,s:`"${o} did not do it."`,f:c=>c!==o}:{sp,s:`"I did not do it."`,f:c=>c!==sp};});
    const ok=ppl.filter(c=>st.filter(x=>x.f(c)).length===T);if(ok.length!==1)continue;const ans=ok[0];
    return{text:`One child ${thing}. Each child said one thing:<br>${st.map(x=>`<b>${x.sp}:</b> ${x.s}`).join('<br>')}<br>${L===1?'Three children are telling the truth and <b>one is lying</b>.':'Only <b>one</b> child is telling the truth.'} Who ${thing}?`,
      ...mc(ans,ppl.filter(p=>p!==ans)),hint:`Pretend each child did it, one at a time. Count how many statements would be true.`,
      steps:[...ppl.map(c=>{const n=st.filter(x=>x.f(c)).length;return`If ${c} did it: ${n} statement${n===1?' is':'s are'} true${n===T?' ✓':''}.`;}),`We need exactly ${T} true statement${T>1?'s':''}. That only works if <b>${ans}</b> did it.`]};
  }
  return tMustBeTrue(L);
}
const WORDS=['CAT','DOG','SUN','HAT','PEN','MAP','BOOK','FISH','TREE','STAR','MILK','LAMP','FROG','DRUM','KITE','NEST','BIRD','CAKE'];
const shiftW=(w,k)=>w.split('').map(ch=>String.fromCharCode(65+((ch.charCodeAt(0)-65+k+26)%26))).join('');
const fits=(w,k)=>w.split('').every(ch=>{const v=ch.charCodeAt(0)-65+k;return v>=0&&v<26;});
function tCodes(L){
  if(L===1&&Math.random()<.5){const[w1,w2]=shuffle(WORDS),num=(w,o=0)=>w.split('').map(c=>c.charCodeAt(0)-64+o).join('-');
    return{text:`In a code, A = 1, B = 2, C = 3 and so on. <b>${w1}</b> is written as <b>${num(w1)}</b>. How is <b>${w2}</b> written?`,...mc(num(w2),[num(w2,-1),num(w2,1),num(w2.split('').reverse().join(''))]),
      hint:`Count through the alphabet to find each letter's number.`,steps:[`Each letter is its place in the alphabet.`,w2.split('').map(c=>`${c} = ${c.charCodeAt(0)-64}`).join(', '),`So ${w2} is <b>${num(w2)}</b>`]};}
  const rev=L===3,k=L===1?1:pick(L===2?[2,3,-1,-2]:[1,-1,2]);let w1,w2;
  do{[w1,w2]=shuffle(WORDS);}while(!fits(w1,k)||!fits(w2,k)||!fits(w2,k+1)||!fits(w2,k-1)||!fits(w2,-k));
  const enc=w=>shiftW(rev?w.split('').reverse().join(''):w,k),ans=enc(w2),dir=k>0?'forward':'back',m=Math.abs(k);
  const wrong=[shiftW(rev?w2.split('').reverse().join(''):w2,k+1),shiftW(rev?w2.split('').reverse().join(''):w2,k-1),shiftW(rev?w2.split('').reverse().join(''):w2,-k)];if(rev)wrong.unshift(shiftW(w2,k));wrong.push(shiftW(w2,-k),w2.split('').reverse().join(''));const wr=wrong.filter(w=>w!==w2);
  const src=rev?w1.split('').reverse().join(''):w1;
  return{text:`In a secret code, <b>${w1}</b> is written as <b>${enc(w1)}</b>. How is <b>${w2}</b> written in the same code?`,...mc(ans,wr),
    hint:rev?`Two things happen to the word. Look at the letter order as well as the letters.`:`Compare each letter with its code letter. How far along the alphabet does it move?`,
    steps:[...(rev?[`First, the word is written backwards: ${w1} → ${src}`]:[]),`${rev?'Then each':'Each'} letter moves ${m} place${m>1?'s':''} ${dir} in the alphabet: ${src.split('').map((c,i)=>`${c} → ${enc(w1)[i]}`).join(', ')}`,
      `Do the same to ${w2}: ${rev?`${w2} → ${w2.split('').reverse().join('')}, then `:''}${(rev?w2.split('').reverse().join(''):w2).split('').map((c,i)=>`${c} → ${ans[i]}`).join(', ')}`,`Answer: <b>${ans}</b>`]};
}
function tileSVG(st){
  let g=`<rect class="sv-off" x="2" y="2" width="68" height="68" rx="4"/>`;
  if(st.type==='quad'){const[x,y]=[[2,2],[36,2],[36,36],[2,36]][st.q];g+=`<rect class="sv-on" x="${x}" y="${y}" width="34" height="34"/><line class="sv-axis" x1="36" y1="2" x2="36" y2="70"/><line class="sv-axis" x1="2" y1="36" x2="70" y2="36"/>`;}
  else{g+=`<g transform="rotate(${st.rot} 36 36)"><path class="sv-arrowhead" d="M36 12 L51 32 L41 32 L41 58 L31 58 L31 32 L21 32 Z"/></g>`;
    if(st.type==='both'){const[x,y]=[[13,13],[59,13],[59,59],[13,59]][st.q];g+=`<circle class="sv-dot" cx="${x}" cy="${y}" r="6"/>`;}}
  return`<svg class="tile" viewBox="0 0 72 72" width="64" height="64" role="img" aria-label="Pattern tile">${g}</svg>`;
}
function tShapeSeq(L){
  const type=L===1?pick(['quad','arrow']):L===2?pick(['arrow','quad','arrow']):'both',d=L===1?pick([90,-90]):pick([45,-45,90,-90,135]),e=pick([1,-1]),r0=pick([0,45,90,180,270]),q0=R(0,3);
  const N=v=>((v%360)+360)%360,Q=v=>((v%4)+4)%4,at=i=>({type,rot:N(r0+i*d),q:Q(q0+i*e)}),K=s=>`${s.rot}|${s.q}`;
  const ans=at(4),seq=[0,1,2,3].map(at);let wrong;
  if(type==='quad')wrong=[0,1,2,3].filter(q=>q!==ans.q).map(q=>({type,rot:0,q}));
  else if(type==='arrow')wrong=[{rot:N(ans.rot+d)},{rot:N(ans.rot-d)},{rot:N(ans.rot+180)},{rot:N(r0-4*d)},{rot:N(ans.rot+90)}].map(w=>({type,q:0,...w}));
  else wrong=[{rot:ans.rot,q:Q(ans.q+1)},{rot:ans.rot,q:Q(ans.q-1)},{rot:N(ans.rot+d),q:ans.q},{rot:N(ans.rot-d),q:ans.q},{rot:N(ans.rot+180),q:Q(ans.q+2)}].map(w=>({type,...w}));
  if(type==='quad'){ans.rot=0;seq.forEach(s=>s.rot=0);}else if(type==='arrow'){ans.q=0;}
  const store={};[ans,...wrong].forEach(s=>store[K(s)]=s);
  const turn=`The arrow turns ${Math.abs(d)}° ${d>0?'clockwise':'anticlockwise'} each time.`,move=`The ${type==='quad'?'shaded square':'dot'} moves one corner ${e>0?'clockwise':'anticlockwise'} each time.`;
  return{text:`Which picture comes next in the pattern?`,visual:`<div class="tiles">${seq.map(tileSVG).join('')}<span class="qtile">?</span></div>`,...mc(K(ans),wrong.map(K),k=>tileSVG(store[k])),
    hint:type==='both'?`Two things change each time. Watch the arrow, then watch the dot.`:`Look at what changes from one picture to the next.`,
    steps:[...(type!=='quad'?[turn]:[]),...(type!=='arrow'?[move]:[]),`Do the same once more to get the next picture:`,tileSVG(ans)]};
}
const canonCells=cells=>{const norm=c=>{const mr=Math.min(...c.map(x=>x[0])),mc_=Math.min(...c.map(x=>x[1]));return c.map(([r,q])=>[r-mr,q-mc_]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(x=>x.join(',')).join(';');};
  const keys=[];let x=cells;for(let f=0;f<2;f++){for(let i=0;i<4;i++){keys.push(norm(x));x=x.map(([r,c])=>[c,-r]);}x=x.map(([r,c])=>[r,-c]);}return keys.sort()[0];};
function orient(cells){let x=cells;for(let i=R(0,3);i>0;i--)x=x.map(([r,c])=>[c,-r]);if(Math.random()<.5)x=x.map(([r,c])=>[r,-c]);
  const mr=Math.min(...x.map(v=>v[0])),mc_=Math.min(...x.map(v=>v[1]));return x.map(([r,c])=>[r-mr,c-mc_]);}
function validNet(){const t=R(0,5);if(t<4){const a=R(0,3),b=R(0,3);return[[0,a],[1,0],[1,1],[1,2],[1,3],[2,b]];}
  return t===4?[[0,0],[0,1],[0,2],[1,2],[1,3],[1,4]]:[[0,0],[0,1],[1,1],[1,2],[2,2],[2,3]];}
function invalidNet(){const t=R(0,3);
  if(t===0){const a=R(0,3);let b;do{b=R(0,3);}while(b===a);return[[0,a],[0,b],[1,0],[1,1],[1,2],[1,3]];}
  if(t===1)return[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]];if(t===2){const a=R(0,4);return[[0,a],[1,0],[1,1],[1,2],[1,3],[1,4]];}
  return[[0,0],[0,1],[1,0],[1,1],[2,1],[2,2]];}
function netSVG(cells){const s=15,W=Math.max(...cells.map(c=>c[1]))+1,H=Math.max(...cells.map(c=>c[0]))+1;
  return`<svg class="tile net" viewBox="0 0 ${W*s+4} ${H*s+4}" width="${W*s+4}" height="${H*s+4}" role="img" aria-label="Net">${cells.map(([r,c])=>`<rect class="sv-net" x="${2+c*s}" y="${2+r*s}" width="${s}" height="${s}"/>`).join('')}</svg>`;}
function tNets(L){
  const not=L===3,pickN=(fn,n,avoid)=>{const out=[];let g=0;while(out.length<n&&g++<200){const c=fn(),k=canonCells(c);if(!avoid.has(k)){avoid.add(k);out.push(orient(c));}}return out;};
  const seen=new Set(),odd=pickN(not?invalidNet:validNet,1,seen)[0],rest=pickN(not?validNet:invalidNet,3,seen),store={},K=c=>JSON.stringify(c);
  [odd,...rest].forEach(c=>store[K(c)]=c);
  return{text:`Which of these nets <b>${not?'cannot':'can'}</b> be folded to make a cube?`,...mc(K(odd),rest.map(K),k=>netSVG(store[k])),
    hint:`A cube has 6 faces. Imagine folding the squares up around one square in the middle.`,
    steps:[`Rules for cube nets:`,`1. A cube net never has a 2 × 2 block of squares.`,`2. It never has 5 or more squares in a straight line.`,`3. If it has a row of 4, the other two squares must be on <b>opposite</b> sides of the row (one becomes the top, one the bottom).`,
      not?`Three nets follow all the rules. The answer is the one that breaks a rule.`:`Three nets break a rule. The answer is the only one that follows all of them.`]};
}
function gridCells(cells){const s=20;return`<svg class="tile" viewBox="0 0 64 64" width="60" height="60" role="img" aria-label="Shape">${[0,1,2].flatMap(r=>[0,1,2].map(c=>`<rect class="${cells.some(x=>x[0]===r&&x[1]===c)?'sv-on':'sv-cell'}" x="${2+c*s}" y="${2+r*s}" width="${s}" height="${s}"/>`)).join('')}</svg>`;}
function tRotate(L){
  const cw=c=>c.map(([r,q])=>[q,2-r]),mir=c=>c.map(([r,q])=>[r,2-q]),K=c=>c.map(x=>x.join(',')).sort().join(';');
  const conn=c=>{const seen=new Set([K([c[0]])]),st=[c[0]];while(st.length){const[r,q]=st.pop();for(const[a,b]of[[r+1,q],[r-1,q],[r,q+1],[r,q-1]]){const k=`${a},${b}`;if(c.some(x=>x[0]===a&&x[1]===b)&&!seen.has(k)){seen.add(k);st.push([a,b]);}}}return seen.size===c.length;};
  let cells,T;
  do{cells=shuffle([0,1,2].flatMap(r=>[0,1,2].map(q=>[r,q]))).slice(0,R(4,5));const r1=cw(cells),r2=cw(r1),r3=cw(r2),m=mir(cells);T={r1,r2,r3,m,m1:cw(m),m2:cw(cw(m)),m3:cw(cw(cw(m)))};}
  while(!conn(cells)||new Set([K(cells),...Object.values(T).map(K)]).size<8);
  const store={};const reg=c=>{store[K(c)]=c;return K(c);};const vis=`<p class="cap">The shape:</p>${gridCells(cells)}`;
  if(L===1)return{text:`Which picture shows this shape after a <b>half turn</b>?`,visual:vis,...mc(reg(T.r2),[reg(T.r1),reg(T.r3),reg(T.m)],k=>gridCells(store[k])),
    hint:`A half turn turns the shape upside down.`,steps:[`A half turn is 180°: the top row becomes the bottom row, and left swaps with right.`,`Imagine turning the page upside down and look for that picture.`]};
  if(L===2)return{text:`Which picture shows this shape after a <b>quarter turn clockwise</b>?`,visual:vis,...mc(reg(T.r1),[reg(T.r3),reg(T.r2),reg(T.m)],k=>gridCells(store[k])),
    hint:`Turn the page a quarter turn the way clock hands go. What was on the left ends up on top.`,steps:[`A quarter turn clockwise is 90°.`,`The left column moves to the top row, the top row moves to the right column, and so on.`,`Picture it turning, then find the matching shape.`]};
  const odd=pick([T.m,T.m1,T.m2,T.m3]);
  return{text:`Three of these pictures show the same shape, just turned around. Which one is <b>different</b>?`,visual:vis,...mc(reg(odd),[reg(T.r1),reg(T.r2),reg(T.r3)],k=>gridCells(store[k])),
    hint:`Turning a shape can never flip it over. Look for the one that is a mirror image.`,steps:[`Turning a shape on the page does not flip it.`,`One picture is a mirror image: you would have to lift it off the page and flip it over to make it match.`,`That flipped one is the answer.`]};
}
function tCombos(L){
  if(L===1){const a=R(2,5),b=R(2,4);return{text:`Ella has <b>${a}</b> T-shirts and <b>${b}</b> pairs of shorts. How many different outfits of one T-shirt and one pair of shorts can she make?`,...mc(a*b,[a+b,a*b+1,a*b-1,2*a*b]),
    hint:`Pick one T-shirt. How many pairs of shorts could go with it?`,steps:[`Each T-shirt can go with ${b} different pairs of shorts.`,`There are ${a} T-shirts: ${a} × ${b} = <b>${a*b}</b> outfits`]};}
  if(L===2&&Math.random()<.5){const n=R(4,7),h=n*(n-1)/2;return{text:`<b>${n}</b> friends meet and every friend shakes hands with every other friend once. How many handshakes are there?`,...mc(h,[n*(n-1),n*n,h+1,h-1,n]),
    hint:`The first friend shakes ${n-1} hands. How many new handshakes does the next friend make?`,steps:[`Friend 1 shakes ${n-1} hands, friend 2 makes ${n-2} new ones, and so on.`,`${Array.from({length:n-1},(_,i)=>n-1-i).join(' + ')} = <b>${h}</b>`]};}
  if(L===2){const k=R(3,5),ds=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,k).sort();return{text:`How many different 2-digit numbers can you make using the digits <b>${ds.join(', ')}</b>? Each digit can be used only once in a number.`,...mc(k*(k-1),[k*k,k*(k-1)/2,k+k,k*(k-1)+1]),
    hint:`How many choices are there for the tens digit? Then for the ones digit?`,steps:[`Tens digit: ${k} choices.`,`Ones digit: ${k-1} choices left (you can't repeat).`,`${k} × ${k-1} = <b>${k*(k-1)}</b> numbers`]};}
  if(Math.random()<.5){const n=R(5,8),c=n*(n-1)/2;return{text:`An ice-cream shop has <b>${n}</b> flavours. How many different cups of <b>two different</b> flavours can you choose? (Choc + vanilla is the same as vanilla + choc.)`,...mc(c,[n*(n-1),n*n,c+n,2*n]),
    hint:`Count the pairs in order, then think about pairs counted twice.`,steps:[`First scoop: ${n} choices. Second scoop: ${n-1} choices. ${n} × ${n-1} = ${n*(n-1)}.`,`Every pair has been counted twice (A+B and B+A).`,`${n*(n-1)} ÷ 2 = <b>${c}</b>`]};}
  const n=pick([3,4]),w=n===3?6:24;return{text:`<b>${n}</b> friends line up for a photo. In how many different orders can they stand?`,...mc(w,[n*n,n+n,w/2,n===3?9:16]),
    hint:`How many people could stand first? Then second?`,steps:[`First place: ${n} choices, second: ${n-1}, then ${n-2}${n===4?', then 1':''}.`,`${Array.from({length:n},(_,i)=>n-i).join(' × ')} = <b>${w}</b>`]};
}
function tBalance(L){
  const[A,B,C]=shuffle(['apples','pears','plums','lemons','oranges']),one=s=>s.slice(0,-1);
  if(L===1){const k=R(2,5),m=R(2,6);return{text:`1 ${one(A)} weighs the same as <b>${k} ${B}</b>. How many ${B} weigh the same as <b>${m} ${A}</b>?`,...mc(k*m,[k+m,k*m+k,m,k*(m-1)]),
    hint:`Each ${one(A)} can be swapped for ${k} ${B}.`,steps:[`Swap each ${one(A)} for ${k} ${B}.`,`${m} × ${k} = <b>${k*m}</b> ${B}`]};}
  if(L===2){const k=R(2,4),j=R(2,4),m=R(2,4);return{text:`1 ${one(A)} weighs the same as <b>${k} ${B}</b>. 1 ${one(B)} weighs the same as <b>${j} ${C}</b>. How many ${C} weigh the same as <b>${m} ${A}</b>?`,...mc(m*k*j,[m*k,m*j,m*(k+j),k*j]),
    hint:`Change the ${A} into ${B} first, then the ${B} into ${C}.`,steps:[`${m} ${A} = ${m} × ${k} = ${m*k} ${B}`,`${m*k} ${B} = ${m*k} × ${j} = <b>${m*k*j}</b> ${C}`]};}
  let p,q,j,wA;do{p=R(2,3);q=R(p+1,5);j=R(2,4);wA=q*j/p;}while(!Number.isInteger(wA));const m=p*R(1,3),ans=m*wA;
  return{text:`<b>${p} ${A}</b> weigh the same as <b>${q} ${B}</b>. 1 ${one(B)} weighs the same as <b>${j} ${C}</b>. How many ${C} weigh the same as <b>${m} ${A}</b>?`,...mc(ans,[m*q,ans+j,ans-j,q*j]),
    hint:`How many ${C} does one ${one(B)} make? Then how many do ${q} ${B} make?`,
    steps:[`${q} ${B} = ${q} × ${j} = ${q*j} ${C}, so ${p} ${A} = ${q*j} ${C}.`,`${m} ${A} is ${m/p} lot${m/p>1?'s':''} of ${p} ${A}: ${m/p} × ${q*j} = <b>${ans}</b> ${C}`]};
}
const CRIT=[
  {t:`Mum says: "If it rains, the picnic will be cancelled." The picnic was cancelled. Ali says, "So it must have rained."<br>Why is Ali's reasoning wrong?`,r:`The picnic could have been cancelled for a different reason.`,w:[`Mum did not say which day the picnic was on.`,`It never rains in summer.`,`Ali did not want to go to the picnic.`],h:`Does "if it rains, the picnic is cancelled" mean rain is the only reason it can be cancelled?`,s:[`Mum's rule: rain → cancelled.`,`It does not say: cancelled → rain. Something else (like a sick teacher) could cancel it.`,`So Ali can't be sure it rained.`]},
  {t:`Coach says: "Only players who come to every training session can be picked for the final." Zoe came to every session. Zoe says, "I will definitely be picked."<br>What is wrong with Zoe's thinking?`,r:`Coming to every session is needed, but it does not promise she will be picked.`,w:[`Zoe did not really come to every session.`,`The coach always picks the tallest players.`,`Players who miss training can still be picked.`],h:`"Only players who…" tells you who CAN be picked, not who WILL be picked.`,s:[`The rule gives a condition that must be met to be picked.`,`Meeting it means Zoe can be picked, not that she will be.`]},
  {t:`Sam says: "Our class should get a pet because pets help children feel calm."<br>Which statement, if true, most <b>weakens</b> Sam's argument?`,r:`A study found children in classes with pets were no calmer than other children.`,w:[`Many families have pets at home.`,`Fish are easy to look after.`,`Sam really likes rabbits.`],h:`Find the statement that shows Sam's reason might not be true.`,s:[`Sam's reason is that pets make children calm.`,`A study showing pets don't make children calmer attacks that reason directly.`]},
  {t:`Priya says: "Eating breakfast helps students do better in morning tests."<br>Which statement, if true, most <b>supports</b> Priya's claim?`,r:`In a study of 500 students, those who ate breakfast scored higher in morning tests.`,w:[`Priya likes toast for breakfast.`,`Some students buy lunch at school.`,`Morning tests are harder than afternoon tests.`],h:`Which statement gives evidence that links breakfast to test results?`,s:[`Support means evidence that makes the claim more likely to be true.`,`Only the study connects eating breakfast with doing better in tests.`]},
  {t:`The library is only open on weekdays. Today the library is open.<br>Which statement <b>must</b> be true?`,r:`Today is a weekday.`,w:[`Today is Monday.`,`The library will be closed tomorrow.`,`Today is Saturday.`],h:`If the library is only open on weekdays, what does "open today" tell you?`,s:[`The library is never open on the weekend.`,`It is open today, so today can't be the weekend.`,`It must be a weekday, but we can't tell which one.`]},
  {t:`Jack says: "I'll be on time for school because the bus always comes at 8 o'clock."<br>What is Jack <b>assuming</b>?`,r:`The bus will come at 8 o'clock today as well.`,w:[`School starts at 8 o'clock.`,`Jack lives close to school.`,`Other students catch the bus too.`],h:`What must be true for Jack's conclusion to work?`,s:[`Jack's conclusion depends on the bus being on time today.`,`He is assuming today will be the same as other days.`]},
  {t:`Ella thinks her bean plant grows faster in the sun.<br>Which test would <b>best</b> check her idea?`,r:`Grow two identical plants with the same water, one in the sun and one in the shade, then compare.`,w:[`Ask her friends what they think.`,`Give her plant twice as much water.`,`Put both plants in the sun and measure them.`],h:`A fair test changes only one thing.`,s:[`To test sunlight, only the sunlight should be different.`,`Everything else (plant type, water) must stay the same.`]},
  {t:`Tom asked 5 friends from his soccer team which sport is most popular at school. All 5 said soccer. Tom says, "Soccer is the most popular sport at our school."<br>What is the <b>problem</b> with Tom's conclusion?`,r:`He only asked a few people, and they all play soccer.`,w:[`Soccer is not a real sport.`,`He should have asked his teacher instead.`,`Five is an odd number.`],h:`Were the people Tom asked a fair sample of the whole school?`,s:[`Tom's group is small and all soccer players, so they are likely to choose soccer.`,`That doesn't tell us what the rest of the school thinks.`]},
  {t:`At the fair, every ride costs either 2 or 3 tickets. Kiara has 5 tickets and goes on exactly two rides.<br>Which statement <b>must</b> be true?`,r:`At least one of her rides cost 2 tickets.`,w:[`Both rides cost 3 tickets.`,`Both rides cost 2 tickets.`,`She has 1 ticket left over.`],h:`Try every pair of ride prices. Which pairs fit within 5 tickets?`,s:[`Possible pairs: 2 + 2 = 4, 2 + 3 = 5, 3 + 3 = 6.`,`3 + 3 is too many, so at least one ride must cost 2 tickets.`]},
  {t:`Five friends ran a race. Ali finished before Ben. Ben finished before Cara.<br>Which statement <b>must</b> be true?`,r:`Ali finished before Cara.`,w:[`Ali won the race.`,`Cara came last.`,`Ben came second.`],h:`There are five runners. You only know the order of three of them.`,s:[`Ali is ahead of Ben, and Ben is ahead of Cara, so Ali is ahead of Cara.`,`The other two runners could be anywhere, so we can't say who won or came last.`]},
  {t:`A shop owner says: "Our new sign is working. We sold more ice creams this week than last week."<br>Which statement, if true, most <b>weakens</b> this?`,r:`This week was much hotter than last week.`,w:[`The sign is bright yellow.`,`The shop also sells drinks.`,`Ice creams cost the same both weeks.`],h:`Is there another reason why more ice creams could have been sold?`,s:[`The owner thinks the sign caused the extra sales.`,`Hot weather is another explanation, so the sign might not be the reason.`]},
  {t:`Every Year 4 student who finished their project got a sticker. Leo did not get a sticker.<br>Which statement <b>must</b> be true?`,r:`If Leo is in Year 4, he did not finish his project.`,w:[`Leo is not in Year 4.`,`Leo finished his project.`,`Nobody in Year 4 got a sticker.`],h:`What would have happened if Leo were in Year 4 and had finished?`,s:[`A Year 4 student who finished would definitely have a sticker.`,`Leo has no sticker, so he can't be a Year 4 student who finished.`,`He might not be in Year 4 at all, or he is in Year 4 and didn't finish.`]},
];
function tCritical(){const c=pick(CRIT);return{text:c.t,...mc(c.r,c.w),hint:c.h,steps:c.s};}

const THINK=[
  {id:'logic',name:'Logic & deduction',strand:'Thinking',glyph:'⇒',tone:'d',gens:[tOrdering,tMustBeTrue,tTruth]},
  {id:'spatial',name:'Spatial reasoning',strand:'Thinking',glyph:'◩',tone:'b',gens:[tNets,tRotate,tShapeSeq]},
  {id:'puzzle',name:'Puzzles & codes',strand:'Thinking',glyph:'ABC',tone:'c',gens:[tCodes,tSeating,tCombos,tBalance]},
  {id:'critical',name:'Critical thinking',strand:'Thinking',glyph:'“?”',tone:'e',gens:[tCritical]},
];
THINK.forEach(t=>{TOPIC[t.id]=t;});
