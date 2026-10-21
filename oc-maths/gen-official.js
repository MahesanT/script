// Question styles modelled on the NSW Department of Education's published OC practice tests:
// multi-step "bus" problems (maths), 3D construction views, pet deductions, scheduling puzzles and
// "which statement, if true, best supports / weakens" arguments (Thinking Skills).
function gBusStop(L){
  if(L===1){const s=R(30,80),on=R(5,20),off=R(5,25),e=s+on-off;
    return{text:`There were <b>${s}</b> people on a bus. At the next stop, <b>${on}</b> people got on and some people got off. Then there were <b>${e}</b> people on the bus. How many people got off?`,
      ...mc(off,[s-e,e-s+on,on,off+on,s+on]),hint:`First work out how many people there would be if nobody got off.`,
      steps:[`If nobody got off: ${s} + ${on} = ${s+on}`,`But there were only ${e}, so ${s+on} − ${e} = <b>${off}</b> got off.`]};}
  if(L===2){const s=R(20,60),a=R(4,15),b=R(3,12),c=R(4,15),d=R(3,12),e=s+a-b+c-d;
    return{text:`A bus left the depot with <b>${s}</b> people. At the first stop ${a} got on and ${b} got off. At the second stop ${c} got on and ${d} got off. How many people were on the bus after the second stop?`,
      ...mc(e,[s+a+b+c+d,s+a+c,e+2*d,e-2*a,s-b-d]),hint:`Go one stop at a time: add the people who get on, take away the people who get off.`,
      steps:[`After stop 1: ${s} + ${a} − ${b} = ${s+a-b}`,`After stop 2: ${s+a-b} + ${c} − ${d} = <b>${e}</b>`]};}
  const end=R(12,40),on=R(4,16),mid=end-on,start=mid*2;
  if(mid<4)return gBusStop(2);
  return{text:`At the first stop, <b>half</b> the people on a bus got off. At the second stop, <b>${on}</b> people got on. Now there are <b>${end}</b> people on the bus. How many people were on the bus at the start?`,
    ...mc(start,[(end+on)*2,end*2,end-on,start+on,mid]),hint:`Work backwards from ${end}. Undo the last thing that happened first.`,
    steps:[`Undo "${on} got on": ${end} − ${on} = ${mid}`,`${mid} was half of the people at the start, so double it: ${mid} × 2 = <b>${start}</b>`,`Check: half of ${start} is ${mid}, plus ${on} = ${end} ✓`]};
}
// Cube construction with columns of different heights, drawn in the same isometric style as prismSVG.
function towerSVG(H){
  const l=H.length,w=H[0].length,a=24,c=a*Math.cos(Math.PI/6),s=a/2,P=(x,y,z)=>[(x-y)*c,(x+y)*s-z*a],top=Math.max(...H.flat());
  const cs=[[0,0,0],[l,0,0],[0,w,0],[l,w,0],[0,0,top],[l,0,top],[0,w,top],[l,w,top]].map(p=>P(...p));
  const minX=Math.min(...cs.map(p=>p[0]))-40,minY=Math.min(...cs.map(p=>p[1]))-6,W=Math.max(...cs.map(p=>p[0]))-minX+40,Ht=Math.max(...cs.map(p=>p[1]))-minY+28;
  const cubes=[];for(let x=0;x<l;x++)for(let y=0;y<w;y++)for(let z=0;z<H[x][y];z++)cubes.push([x,y,z]);
  cubes.sort((A,B)=>(A[0]+A[1]+A[2])-(B[0]+B[1]+B[2])||A[2]-B[2]);
  const poly=(pts,cls)=>`<polygon class="${cls}" points="${pts.map(p=>P(...p).map(n1).join(',')).join(' ')}"/>`;
  let g='';for(const[x,y,z]of cubes)g+=poly([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],'cube-t')+poly([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],'cube-r')+poly([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],'cube-l');
  const fr=P(l,w/2,0),sd=P(l/2,w,0);
  g+=`<text class="sv-label" x="${n1(fr[0]+14)}" y="${n1(fr[1]+22)}">Front</text><text class="sv-label" x="${n1(sd[0]-14)}" y="${n1(sd[1]+22)}" text-anchor="end">Side</text>`;
  return`<svg class="viz" viewBox="${n1(minX)} ${n1(minY)} ${n1(W)} ${n1(Ht)}" width="${Math.round(Math.min(340,W*1.2))}" role="img" aria-label="Model made of cubes">${g}</svg>`;
}
function viewSVG(cols){const s=16,h=Math.max(...cols,1);
  return`<svg class="tile" viewBox="0 0 ${cols.length*s+4} ${h*s+4}" width="${cols.length*s+4}" height="${h*s+4}" role="img" aria-label="View">${cols.flatMap((c,i)=>Array.from({length:c},(_,z)=>`<rect class="sv-net" x="${2+i*s}" y="${2+(h-1-z)*s}" width="${s}" height="${s}"/>`)).join('')}</svg>`;}
function tViews(L){
  for(let g=0;g<200;g++){
    const l=L===1?2:3,w=L===3?3:2,H=Array.from({length:l},()=>Array.from({length:w},()=>R(L===1?1:0,3)));
    if(H.flat().every(v=>v===0)||H.some(r=>r.every(v=>v===0)))continue;
    // Front looks at the dark right-hand faces: along them, y runs right-to-left. Side looks at the light left-hand faces: x runs left-to-right.
    const front=Array.from({length:w},(_,i)=>Math.max(...H.map(r=>r[w-1-i]))),side=Array.from({length:l},(_,x)=>Math.max(...H[x]));
    if(front.includes(0)||side.includes(0))continue;
    const ask=Math.random()<.6?'front':'side',ans=ask==='front'?front:side,other=ask==='front'?side:front,K=c=>c.join('-');
    const bumped=ans.map((v,i)=>i===R(0,ans.length-1)?(v===3?2:v+1):v),wrong=[other,ans.slice().reverse(),bumped,ans.map(v=>Math.min(3,v+1)),H.map(r=>r.reduce((p,q)=>p+q,0)).slice(0,ans.length)];
    const ok=new Set([K(ans)]),ws=[];for(const x of wrong){if(x.every(v=>v>0&&v<=4)&&!ok.has(K(x))){ok.add(K(x));ws.push(x);}}
    if(ws.length<3)continue;
    const total=H.flat().reduce((p,q)=>p+q,0);
    return{text:`This model is made from <b>${total}</b> cubes. Which picture shows what you see when you look at it from the <b>${ask}</b>?`,visual:towerSVG(H),
      ...mc(K(ans),ws.map(K),k=>viewSVG(k.split('-').map(Number))),hint:`Stand where the "${cap(ask)}" label is. For each column you can see, find the tallest stack of cubes in that line.`,
      steps:[`From the ${ask} you see ${ans.length} columns. Each column shows the tallest stack in that line of cubes.`,`From left to right the heights are: ${ans.join(', ')}.`,`So the view is:`,viewSVG(ans)]};
  }
  return tRotate(L);
}
const PETS=[['dog','dogs'],['cat','cats'],['fish','fish'],['bird','birds'],['rabbit','rabbits'],['guinea pig','guinea pigs']];
function tPets(L){
  for(let g=0;g<300;g++){
    const ppl=people(3),pets=shuffle(PETS).slice(0,L===1?4:5),own=pets.map(()=>ppl.filter(()=>Math.random()<.5));
    if(own.some(o=>o.length===0))continue;
    const[A,B,C]=ppl,only=pets.filter((p,i)=>own[i].includes(A)&&own[i].length===1);
    if(only.length!==1)continue;
    const fact=(p,o)=>o.length===3?`Everyone keeps ${p[1]}.`:o.length===1?`Only ${o[0]} keeps ${p[1]}.`:`${o[0]} and ${o[1]} keep ${p[1]}, but ${ppl.find(x=>!o.includes(x))} does not.`;
    const ans=only[0][1],facts=shuffle(pets.map((p,i)=>fact(p,own[i])));
    return{text:`${A}, ${B} and ${C} each keep some pets.<br>${facts.join('<br>')}<br>Which pet does <b>${A}</b> keep that <b>neither ${B} nor ${C}</b> keeps?`,
      ...mc(ans,pets.filter(p=>p[1]!==ans).map(p=>p[1])),hint:`Draw a table with a row for each child and a column for each pet. Tick the boxes as you read.`,
      steps:[`Make a table from the clues:`,`<table class="io"><tr><th></th>${pets.map(p=>`<th>${p[0]}</th>`).join('')}</tr>${ppl.map(x=>`<tr><th>${x}</th>${own.map(o=>`<td>${o.includes(x)?'✓':''}</td>`).join('')}</tr>`).join('')}</table>`,`Look along ${A}'s row for a tick that ${B} and ${C} don't have: <b>${ans}</b>.`]};
  }
  return tMustBeTrue(L);
}
const DAYS5=['Monday','Tuesday','Wednesday','Thursday','Friday'];
function tSchedule(L){
  const acts=shuffle(['art','music','swimming','chess','soccer','drama','coding']).slice(0,L===3?5:4),n=acts.length,days=DAYS5.slice(0,n);
  for(let g=0;g<40;g++){
    const arr=shuffle(acts),ix=(o,a)=>o.indexOf(a);
    const gen=()=>{const[a,b]=shuffle(acts);switch(R(0,4)){
      case 0:return{s:`${cap(a)} is the day after ${b}.`,f:o=>ix(o,a)-ix(o,b)===1};
      case 1:return{s:`${cap(a)} is earlier in the week than ${b}.`,f:o=>ix(o,a)<ix(o,b)};
      case 2:return{s:`${cap(a)} is not on ${days[ix(arr,a)===0?1:0]}.`,f:o=>ix(o,a)!==(ix(arr,a)===0?1:0)};
      case 3:return{s:`${cap(a)} is on ${days[ix(arr,a)]}.`,f:o=>ix(o,a)===ix(arr,a)};
      default:return{s:`${cap(a)} and ${b} are not on days next to each other.`,f:o=>Math.abs(ix(o,a)-ix(o,b))>1};}};
    let cands=perms(acts);const clues=[];let k=0;
    while(cands.length>1&&k++<400){const c=gen();if(!c.f(arr))continue;if(clues.length===0&&c.s.includes(' is on '))continue;const nc=cands.filter(c.f);if(nc.length<cands.length){clues.push(c);cands=nc;}}
    if(cands.length!==1||clues.length>6)continue;
    const di=R(0,n-1),ans=arr[di];
    return{text:`Mia does one after-school activity each day from ${days[0]} to ${days[n-1]}: ${acts.join(', ')}.<br>${clues.map(c=>c.s).join('<br>')}<br>Which activity is on <b>${days[di]}</b>?`,
      ...mc(ans,acts.filter(a=>a!==ans)),hint:`Write the ${n} days in a row and fill in the activities you are sure about first.`,
      steps:[...clues.map(c=>`${c.s} ✓`),`The only timetable that fits every clue: ${days.map((d,i)=>`${d.slice(0,3)} ${arr[i]}`).join(', ')}`,`${days[di]} is <b>${ans}</b>.`]};
  }
  return tSeating(L);
}
CRIT.push(
  {t:`Coach Lee says: "Students who play chess every day get better at solving maths problems."<br>Which statement, if true, best <b>supports</b> Coach Lee's claim?`,r:`At our school, students who joined daily chess improved their maths scores more than students who did not.`,w:[`Chess is played on a board with 64 squares.`,`Some students prefer soccer to chess.`,`Coach Lee has played chess for twenty years.`],h:`Look for evidence that links playing chess with getting better at maths.`,s:[`The claim links daily chess to better maths.`,`Only one statement compares students who played chess with students who didn't, and shows the chess players improved more.`]},
  {t:`Ravi says: "Our school should start 30 minutes later, because students would be less tired in class."<br>Which statement, if true, best <b>supports</b> Ravi's argument?`,r:`A school that started later found its students were more alert in morning lessons.`,w:[`Some students live close to school.`,`Ravi likes to sleep in on weekends.`,`The school bell is very loud.`],h:`Which statement shows that starting later really makes students less tired?`,s:[`Ravi's reason is that a later start means less tired students.`,`Evidence from a school that tried it and found more alert students supports that reason.`]},
  {t:`Grace says: "Planting more trees in the playground will make it cooler at lunchtime."<br>Which statement, if true, most <b>weakens</b> Grace's argument?`,r:`The trees would take ten years to grow big enough to give shade.`,w:[`Trees give homes to birds.`,`The playground gets very hot in summer.`,`Many students eat lunch outside.`],h:`Which statement shows that planting trees might not make it cooler, at least not soon?`,s:[`Grace thinks the trees will cool the playground.`,`If the trees won't give shade for ten years, planting them won't make lunchtime cooler any time soon.`]},
  {t:`Dev says: "Our class reads more books than any other class, because we have the biggest class library."<br>Which statement, if true, most <b>weakens</b> Dev's reasoning?`,r:`Most students in Dev's class borrow their books from the town library, not the class library.`,w:[`Dev's class library has 300 books.`,`Reading is good for spelling.`,`Another class has a comfy reading corner.`],h:`Is the class library really the reason they read so much?`,s:[`Dev says the big class library is the reason they read more.`,`If the books mostly come from the town library, the class library is probably not the reason.`]},
  {t:`Mr Chen says: "If you finish your work early, you may read quietly or draw." Zara is drawing.<br>Which statement <b>must</b> be true?`,r:`We cannot be sure that Zara finished her work early.`,w:[`Zara finished her work early.`,`Zara did not finish her work.`,`Zara does not like reading.`],h:`Does the rule say that ONLY students who finished early are allowed to draw?`,s:[`The rule says what students can do if they finish early.`,`It does not say drawing is only for students who finished early, so Zara might be drawing for another reason.`,`So we cannot be sure.`]},
  {t:`Kiara wants to find out which brand of paper aeroplane flies furthest. Which plan is the <b>fairest</b> test?`,r:`Fold the same design with each brand of paper and throw each one the same way, several times.`,w:[`Fold a different design with each brand of paper.`,`Throw the first plane hard and the others gently.`,`Ask her friends which paper looks the nicest.`],h:`In a fair test, only one thing changes.`,s:[`She is testing the paper brand, so only the paper should change.`,`Same design, same throw, repeated several times makes it fair.`]},
);
TOPIC.reason.gens.push(gBusStop,gBusStop);
TOPIC.spatial.gens.push(tViews,tViews);
TOPIC.logic.gens.push(tPets);
TOPIC.puzzle.gens.push(tSchedule);
