// Space & geometry, data & chance, OC-style problem solving, and the topic list.
function gShape3d(L){
  const base={3:'triangular',4:'square',5:'pentagonal',6:'hexagonal'},props=(k,n)=>k==='prism'?{faces:n+2,edges:3*n,vertices:2*n}:{faces:n+1,edges:2*n,vertices:n+1};
  const nameOf=(k,n)=>k==='prism'?(n===4?'rectangular prism':`${base[n]} prism`):`${base[n]} pyramid`;
  const explain=(k,n)=>k==='prism'?[`A ${nameOf(k,n)} has two ${n}-sided ends joined by ${n} rectangles.`,`Faces: 2 ends + ${n} rectangles = ${n+2}. Edges: ${n} on top + ${n} on the bottom + ${n} joining = ${3*n}. Vertices: ${n} on top + ${n} on the bottom = ${2*n}.`]
    :[`A ${nameOf(k,n)} has a ${n}-sided base and ${n} triangles meeting at the top point.`,`Faces: 1 base + ${n} triangles = ${n+1}. Edges: ${n} around the base + ${n} up to the top = ${2*n}. Vertices: ${n} on the base + 1 at the top = ${n+1}.`];
  if(L===3){if(Math.random()<.5){const n=R(3,8),F=n+2;
      return{text:`A prism has <b>${F} faces</b>. How many <b>edges</b> does it have?`,...mc(3*n,[2*n,F*2,3*n+3,3*n-3]),hint:`A prism has 2 end faces. How many sides does each end have?`,
        steps:[`Take away the 2 ends: ${F} − 2 = ${n} rectangles, so each end has ${n} sides.`,`Edges: ${n} + ${n} + ${n} = <b>${3*n}</b>`]};}
    const n=R(3,8),E=2*n;return{text:`A pyramid has <b>${E} edges</b>. How many <b>vertices</b> does it have?`,...mc(n+1,[n,E,n+2,2*n+1]),hint:`Half the edges go around the base and half go up to the top.`,
      steps:[`${E} ÷ 2 = ${n}, so the base has ${n} sides.`,`Vertices: ${n} on the base + 1 at the top = <b>${n+1}</b>`]};}
  if(L===1){const[k,n,nm]=pick([['prism',4,'cube'],['prism',4,'rectangular prism'],['pyramid',4,'square pyramid'],['prism',3,'triangular prism']]),v=props(k,n).faces;
    return{text:`How many <b>faces</b> does a <b>${nm}</b> have?`,...mc(v,[v+1,v-1,v+2,v*2]),hint:`Faces are the flat surfaces. Imagine holding one and counting each flat side.`,steps:[...explain(k,n).slice(0,1),`It has <b>${v}</b> faces.`]};}
  const k=pick(['prism','pyramid']),n=R(3,6),what=pick(['edges','vertices']),v=props(k,n)[what];
  return{text:`How many <b>${what}</b> does a <b>${nameOf(k,n)}</b> have?`,...mc(v,[props(k,n)[what==='edges'?'vertices':'edges'],props(k,n).faces,v+1,v-1]),
    hint:what==='edges'?`Edges are where two faces meet.`:`Vertices are the corners, where edges meet.`,steps:[...explain(k,n),`Answer: <b>${v}</b> ${what}`]};
}
const POLY={3:'triangle',4:'quadrilateral',5:'pentagon',6:'hexagon',7:'heptagon',8:'octagon',10:'decagon'};
function gPolygons(L){
  const ns=Object.keys(POLY).map(Number);
  if(L===1){const n=pick(ns);
    if(Math.random()<.5)return{text:`How many sides does a <b>${POLY[n]}</b> have?`,...mc(n,[n+1,n-1,n+2]),hint:`Look at the start of the name: tri = 3, quad = 4, pent = 5, hex = 6, oct = 8, dec = 10.`,steps:[`"${POLY[n]}" means ${n} sides.`,`Answer: <b>${n}</b>`]};
    return{text:`A flat shape has <b>${n}</b> straight sides. What is it called?`,...mc(POLY[n],shuffle(ns.filter(x=>x!==n)).map(x=>POLY[x])),hint:`tri = 3, quad = 4, pent = 5, hex = 6, hept = 7, oct = 8, dec = 10.`,steps:[`A shape with ${n} sides is a <b>${POLY[n]}</b>.`]};}
  if(L===2){const[p,q]=shuffle([3,4,5,6,8]),a=R(2,5),b=R(2,5),ans=a*p+b*q;
    return{text:`Ari draws <b>${a} ${POLY[p]}s</b> and <b>${b} ${POLY[q]}s</b>. How many sides does she draw altogether?`,...mc(ans,[a+b,a*q+b*p,ans+p,ans-q]),hint:`How many sides does one ${POLY[p]} have? One ${POLY[q]}?`,
      steps:[`${a} ${POLY[p]}s: ${a} × ${p} = ${a*p} sides`,`${b} ${POLY[q]}s: ${b} × ${q} = ${b*q} sides`,`${a*p} + ${b*q} = <b>${ans}</b>`]};}
  const n=pick([5,6,8,10]),s=R(3,12),P=n*s;
  return{text:`A regular <b>${POLY[n]}</b> has a perimeter of <b>${P} cm</b>. How long is each side?`,...mc(s,[P-n,s+1,s-1,P/2],v=>`${v} cm`),hint:`A regular ${POLY[n]} has ${n} equal sides.`,
    steps:[`A ${POLY[n]} has ${n} equal sides.`,`${P} ÷ ${n} = <b>${s} cm</b>`]};
}
const DIR8=['North','North-east','East','South-east','South','South-west','West','North-west'];
function gTurns(L){
  const turnsN=L===1?1:2,eight=L===3;let d=eight?R(0,7):R(0,3)*2;const start=d,ts=[],steps=[];
  for(let i=0;i<turnsN;i++){const k=eight?pick([1,2,3,4,6]):pick([2,4,6]),cw=Math.random()<.5;ts.push([k,cw]);}
  const tn=(k,cw)=>eight?`${k*45}° ${cw?'clockwise':'anticlockwise'}`:`a ${({2:'quarter',4:'half',6:'three-quarter'})[k]} turn ${cw?'clockwise':'anticlockwise'}`;
  for(const[k,cw]of ts){const nd=(d+(cw?k:-k)+8)%8;steps.push(`Facing ${DIR8[d]}, turn ${tn(k,cw)}${eight?'':` (${k*45}°)`} → now facing <b>${DIR8[nd]}</b>.`);d=nd;}
  let opp=start;for(const[k,cw]of ts)opp=(opp+(cw?-k:k)+8)%8;
  const pool=eight?DIR8:DIR8.filter((_,i)=>i%2===0);
  return{text:`Sam is facing <b>${DIR8[start]}</b>. ${cap(ts.map(([k,cw])=>`he turns ${tn(k,cw)}`).join(', then '))}. Which way is he facing now?`,visual:compassSVG(eight),
    ...mc(DIR8[d],[DIR8[opp],...shuffle(pool)]),hint:`Clockwise goes the way clock hands move: North → East → South → West. A quarter turn is 90°.`,steps};
}
function gAngleType(L){
  const types=[['acute','less than a right angle (under 90°)'],['right angle','exactly 90°, like the corner of a page'],['obtuse','more than a right angle but less than a straight line (between 90° and 180°)'],['straight angle','exactly 180°, a straight line'],['reflex','more than a straight line (over 180°)']];
  if(L===3){if(Math.random()<.5){const h=R(1,6),a=h*30;
      return{text:`What is the angle between the hands of a clock at exactly <b>${h} o'clock</b>?`,visual:clockSVG(h,0),...mc(a,[h*5,a+30,a-30,h*60].filter(x=>x>0)),hint:`A full turn is 360° and there are 12 numbers. How many degrees between two numbers?`,
        steps:[`360° ÷ 12 = 30° between each number.`,`The hands are ${h} number${h>1?'s':''} apart: ${h} × 30° = <b>${a}°</b>`]};}
    const[nm,a]=pick([['a quarter turn',90],['a half turn',180],['a three-quarter turn',270],['a full turn',360]]);
    return{text:`How many degrees are there in <b>${nm}</b>?`,...mc(a,[90,180,270,360,a/2].filter(x=>x!==a)),hint:`A full turn is 360°.`,steps:[`A full turn is 360°.`,`${cap(nm)} is <b>${a}°</b>.`]};}
  const ti=L===1?R(0,2):R(0,4),deg=[R(25,75),90,R(105,165),180,R(200,330)][ti];
  return{text:`What type of angle is this?`,visual:angleSVG(deg),...mc(types[ti][0],shuffle(types.slice(0,L===1?4:5).map(t=>t[0]))),hint:`Compare it with a right angle, like the corner of a book.`,
    steps:[`This angle is about ${Math.round(deg/5)*5}°.`,`It is ${types[ti][1]}.`,`So it is <b>${types[ti][0]}</b>.`]};
}
function gBarGraph(L){
  const[title,cats,who]=pick([['Favourite fruit',['Apple','Banana','Mango','Grapes','Orange'],'children'],['Pets at home',['Dog','Cat','Fish','Bird','Rabbit'],'students'],['Sport played',['Soccer','Netball','Cricket','Swim','Tennis'],'students']]);
  const k=R(4,5),cs=cats.slice(0,k),step=L===1?1:L===2?2:5,top=L===1?10:L===2?20:50;let vals;
  do{vals=cs.map(()=>R(1,top/step)*step);}while(new Set(vals).size<k);
  const vis=`<p class="cap">${title}: number of ${who}</p>`+barSVG(cs,vals,L===3?10:step,L===3?10:2);
  if(L===1){const i=R(0,k-1);return{text:`How many ${who} chose <b>${cs[i]}</b>?`,visual:vis,...mc(vals[i],[vals[i]+1,vals[i]-1,Math.max(...vals)]),hint:`Find the top of the ${cs[i]} column, then look across to the numbers on the side.`,
    steps:[`Go to the top of the ${cs[i]} column.`,`Look straight across to the scale: it lines up with <b>${vals[i]}</b>.`]};}
  if(L===2){const[i,j]=shuffle([...cs.keys()]),[a,b]=vals[i]>vals[j]?[i,j]:[j,i],ans=vals[a]-vals[b];
    return{text:`How many more ${who} chose <b>${cs[a]}</b> than <b>${cs[b]}</b>?`,visual:vis,...mc(ans,[vals[a]+vals[b],vals[a],ans+2,ans-2]),hint:`Read both columns, then find the difference.`,
      steps:[`${cs[a]}: ${vals[a]}`,`${cs[b]}: ${vals[b]}`,`${vals[a]} − ${vals[b]} = <b>${ans}</b> more`]};}
  const sum=vals.reduce((x,y)=>x+y,0);
  return{text:`How many ${who} were surveyed altogether?`,visual:vis,...mc(sum,[sum+5,sum-5,sum+10,Math.max(...vals)*k]),hint:`Read every column. A column ending halfway between two lines is a 5.`,
    steps:[`Read each column: ${cs.map((c,i)=>`${c} ${vals[i]}`).join(', ')}`,`Add them: ${vals.join(' + ')} = <b>${sum}</b>`]};
}
function gChance(L){
  const COLS=['red','blue','green','yellow'];
  if(L===1){const cols=shuffle(COLS).slice(0,3);let ns;do{ns=cols.map(()=>R(1,7));}while(new Set(ns).size<3);
    if(Math.random()<.25){const miss=COLS.find(c=>!cols.includes(c));
      return{text:`Without looking, Kiara picks one marble from the bag. What is the chance it is <b>${miss}</b>?`,visual:marblesSVG(cols.map((c,i)=>({col:c,n:ns[i]}))),...mc('impossible',['certain','likely','unlikely']),
        hint:`Are there any ${miss} marbles in the bag?`,steps:[`There are no ${miss} marbles in the bag.`,`Something that cannot happen is <b>impossible</b>.`]};}
    const most=Math.random()<.6,tg=most?Math.max(...ns):Math.min(...ns),ans=cols[ns.indexOf(tg)];
    return{text:`Without looking, Kiara picks one marble. Which colour is she <b>${most?'most':'least'}</b> likely to pick?`,visual:marblesSVG(cols.map((c,i)=>({col:c,n:ns[i]}))),
      ...mc(ans,COLS.filter(c=>c!==ans)),hint:`Count how many marbles there are of each colour.`,steps:[`Count: ${cols.map((c,i)=>`${ns[i]} ${c}`).join(', ')}.`,`The colour with the ${most?'most':'fewest'} marbles is the ${most?'most':'least'} likely: <b>${ans}</b>.`]};}
  if(L===2){const cols=shuffle(COLS).slice(0,3),ns=cols.map(()=>R(1,6)),T=ns.reduce((a,b)=>a+b,0),i=R(0,2),c=ns[i];
    return{text:`What is the chance of picking a <b>${cols[i]}</b> marble?`,visual:marblesSVG(cols.map((c,i)=>({col:c,n:ns[i]}))),...mc(`${c}/${T}`,[`${c}/${T-c}`,`${T-c}/${T}`,`1/${T}`,`${c}/${T+1}`,`1/${c}`],fracFmt),
      hint:`Chance = number of ${cols[i]} marbles out of all the marbles.`,steps:[`There are ${cols.map((c,i)=>ns[i]).join(' + ')} = ${T} marbles.`,`${c} of them are ${cols[i]}.`,`The chance is ${F(c,T)}`]};}
  const r=R(2,6),b=R(r,r+6),g=R(1,6),x=b+g-r;
  return{text:`A bag has <b>${r} red</b>, <b>${b} blue</b> and <b>${g} green</b> marbles. How many red marbles must be added so that the chance of picking red is ${F(1,2)}?`,
    ...mc(x,[b+g,x+1,x-1,b-r,(r+b+g)/2]),hint:`For a ${F(1,2)} chance, the red marbles must equal all the other marbles.`,
    steps:[`A ${F(1,2)} chance means half the marbles are red, so red must equal non-red.`,`Non-red: ${b} + ${g} = ${b+g}`,`Red needed: ${b+g}. Red now: ${r}. Add ${b+g} − ${r} = <b>${x}</b>`]};
}
function gBackwards(L){
  const start=R(2,L===1?12:15);let v=start;const ops=[];
  for(let i=0;i<L;i++){const t=pick(i===0?['mul','add']:['mul','add','sub']);
    if(t==='mul'){const k=R(2,5);ops.push(['mul',k]);v*=k;}else if(t==='add'){const k=R(3,20);ops.push(['add',k]);v+=k;}else{const k=R(2,Math.min(15,v-1));ops.push(['sub',k]);v-=k;}}
  const ph={mul:k=>`multiply it by ${k}`,add:k=>`add ${k}`,sub:k=>`subtract ${k}`},inv={mul:(x,k)=>x/k,add:(x,k)=>x-k,sub:(x,k)=>x+k},iw={mul:'÷',add:'−',sub:'+'};
  let cur=v;const steps=[`Start from the answer, <b>${v}</b>, and undo each step in reverse order.`];
  for(const[t,k]of ops.slice().reverse()){const nx=inv[t](cur,k);steps.push(`Undo "${ph[t](k)}": ${cur} ${iw[t]} ${k} = ${nx}`);cur=nx;}
  steps.push(`I started with <b>${start}</b>.`);let wr=v;for(const[t,k]of ops)wr=inv[t](wr,k);
  return{text:`I think of a number. I ${ops.map(([t,k])=>ph[t](k)).join(', then I ')}. My answer is <b>${v}</b>. What number did I start with?`,...mc(start,[wr,start+1,start-1,start+2,v]),
    hint:`Work backwards from ${v}. Do the opposite of each step, starting with the last one.`,steps};
}
function gSumDiff(L){
  const[A,B]=twoNames();
  if(L<3){const sm=R(5,L===1?20:60),D=R(2,L===1?10:30),bg=sm+D,S=sm+bg;
    return{text:`${A} and ${B} have <b>${S}</b> shells altogether. ${B} has <b>${D} more</b> than ${A}. How many shells does ${B} have?`,...mc(bg,[sm,S/2,S-D,bg+D]),
      hint:`If you take away the extra ${D}, the rest can be shared equally.`,steps:[`Take away the extra: ${S} − ${D} = ${S-D}`,`Share equally: ${S-D} ÷ 2 = ${sm}. That's ${A}'s amount.`,`${B} has ${sm} + ${D} = <b>${bg}</b>`]};}
  const k=R(2,4),one=R(4,20),S=one*(k+1);
  return{text:`${B} has <b>${k} times</b> as many stickers as ${A}. Together they have <b>${S}</b>. How many stickers does ${B} have?`,...mc(one*k,[one,S/k,S-k,S/2]),
    hint:`Draw ${A}'s stickers as 1 box and ${B}'s as ${k} boxes of the same size.`,steps:[`${A} = 1 part, ${B} = ${k} parts. Altogether ${k+1} parts.`,`One part: ${S} ÷ ${k+1} = ${one}`,`${B}: ${k} × ${one} = <b>${one*k}</b>`]};
}
function gLegs(L){
  const bikes=L===3&&Math.random()<.5,[A,la,B,lb,As,Bs,lw]=bikes?['bicycles',2,'tricycles',3,'bicycle','tricycle','wheels']:['chickens',2,'cows',4,'chicken','cow','legs'];
  const b=R(2,L===1?5:L===2?10:18),a=R(2,L===1?6:L===2?12:20),H=a+b,legs=a*la+b*lb,extra=legs-H*la;
  return{text:bikes?`A bike shop has <b>${H}</b> bicycles and tricycles. Together they have <b>${legs}</b> wheels. How many tricycles are there?`:`A farm has chickens and cows. There are <b>${H}</b> heads and <b>${legs}</b> legs. How many cows are there?`,
    ...mc(b,[a,Math.round(legs/lb),b+1,b-1,Math.round(H/2)]),hint:`Pretend they are all ${A}. How many ${lw} would that be?`,
    steps:[`Pretend all ${H} are ${A}: ${H} × ${la} = ${H*la} ${lw}.`,`There are really ${legs}, so ${legs} − ${H*la} = ${extra} ${lw} are extra.`,`Each ${Bs} has ${lb-la} more ${lw} than a ${As}.`,`${extra} ÷ ${lb-la} = <b>${b}</b> ${B}`,`Check: ${a} × ${la} + ${b} × ${lb} = ${legs} ✓`]};
}
function gMatchsticks(L){
  const kinds=[['squares',3,'square'],['triangles',2,'triangle'],['houses',5,'house']],[kind,k,unit]=L===1?pick(kinds.slice(0,2)):pick(kinds),f=x=>k*x+1;
  const n=L===1?R(5,7):L===2?R(8,12):R(15,30),vis=sticksSVG(kind);
  if(L===3&&Math.random()<.5){const T=f(n);
    return{text:`Matchsticks make this pattern of ${kind}. Which pattern number uses exactly <b>${T}</b> matchsticks?`,visual:vis,...mc(n,[Math.floor(T/k),Math.floor(T/(k+1)),n+1,n-1]),
      hint:`Pattern 1 uses ${f(1)}. Each new ${unit} adds the same number of sticks.`,steps:[`Pattern 1 uses ${f(1)}. Each new ${unit} adds ${k}.`,`So pattern n uses ${k} × n + 1.`,`${T} − 1 = ${T-1}`,`${T-1} ÷ ${k} = <b>${n}</b>`]};}
  return{text:`Matchsticks make this pattern of ${kind}. How many matchsticks are needed for <b>pattern ${n}</b>?`,visual:vis,...mc(f(n),[k*n,(k+1)*n,f(1)*n,f(n)+k]),
    hint:`Count the sticks in patterns 1, 2 and 3. How many does each new ${unit} add?`,
    steps:[`Pattern 1 = ${f(1)}, pattern 2 = ${f(2)}, pattern 3 = ${f(3)}.`,`Each new ${unit} adds ${k} sticks, because it shares a side with the one before.`,`Pattern ${n}: ${f(1)} + ${k} × ${n-1} = <b>${f(n)}</b>`]};
}
function gAges(L){
  const[A,B]=twoNames();
  if(L===1){const a=R(5,10),d=R(2,6),c=R(2,8),ans=a+d+c;
    return{text:`${A} is <b>${a}</b>. ${B} is <b>${d} years older</b> than ${A}. How old will ${B} be in <b>${c} years</b>?`,...mc(ans,[a+c,a+d,ans+1,ans-1]),hint:`Work out how old ${B} is now first.`,
      steps:[`${B} now: ${a} + ${d} = ${a+d}`,`In ${c} years: ${a+d} + ${c} = <b>${ans}</b>`]};}
  if(L===2){const a=R(4,10),b=R(a+1,a+6),x=R(2,9),S=a+b+2*x;
    return{text:`${A} is <b>${a}</b> and ${B} is <b>${b}</b>. In how many years will their ages add up to <b>${S}</b>?`,...mc(x,[S-a-b,x+1,x-1,S-b]),hint:`Each year, BOTH of them get one year older.`,
      steps:[`Now their ages add to ${a} + ${b} = ${a+b}.`,`They need ${S} − ${a+b} = ${S-a-b} more years in total.`,`Each year adds 2 (one for each), so ${S-a-b} ÷ 2 = <b>${x}</b> years`]};}
  let C,k,x,c,m;do{C=R(6,14);k=R(2,4);x=R(2,8);c=C-x;m=k*C-x;}while(c<3||m-c<20||m>50);
  const kw={2:'twice',3:'three times',4:'four times'}[k];
  return{text:`${A} is <b>${c}</b> years old and her mum is <b>${m}</b>. In how many years will her mum be <b>${kw}</b> as old as ${A}?`,...mc(x,[x+1,x-1,Math.round(m/k)-c,m-k*c]),
    hint:`The difference between their ages never changes.`,
    steps:[`The age gap is always ${m} − ${c} = ${m-c} years.`,`When mum is ${kw} ${A}'s age, the gap is ${k-1} × ${A}'s age.`,`${A}'s age then: ${m-c} ÷ ${k-1} = ${C}`,`${C} − ${c} = <b>${x}</b> years. Check: ${A} ${C}, mum ${m+x} = ${k} × ${C} ✓`]};
}
function gBestBuy(L){
  const item=pick(['muesli bars','pens','apples','juice boxes','cupcakes']),us=shuffle([40,45,50,55,60,65,70,75,80,85,90,95]).slice(0,4),deals=us.map(u=>({q:L===1?pick([2,4]):R(2,L===2?6:8),u}));
  const lab=d=>`${d.q} ${item} for ${money(d.q*d.u)}`,best=deals.reduce((a,b)=>b.u<a.u?b:a);
  return{text:`Which is the <b>best buy</b> (the cheapest price for one)?`,...mc(lab(best),deals.filter(d=>d!==best).map(lab)),hint:`Work out the price of ONE item in each deal.`,
    steps:[...deals.map(d=>`${lab(d)}: ${money(d.q*d.u)} ÷ ${d.q} = ${d.u}c each`),`The cheapest is ${best.u}c each: <b>${lab(best)}</b>`]};
}
function gConsecutive(L){
  if(L===1){const m=R(8,40),S=2*m+1;return{text:`Two numbers next to each other (like 7 and 8) add up to <b>${S}</b>. What is the larger number?`,...mc(m+1,[m,Math.round(S/2)+1,m+2,S-m]),
    hint:`If the numbers were equal, each would be half of ${S}.`,steps:[`Take away 1 so the numbers are equal: ${S} − 1 = ${S-1}`,`${S-1} ÷ 2 = ${m}, the smaller number.`,`Larger: ${m} + 1 = <b>${m+1}</b>`]};}
  if(L===2){const m=R(10,60),S=3*m;return{text:`Three consecutive numbers add up to <b>${S}</b>. What is the largest of the three numbers?`,...mc(m+1,[m,m-1,m+2,S/3+3]),
    hint:`The middle number is the average of all three.`,steps:[`Middle number: ${S} ÷ 3 = ${m}`,`The numbers are ${m-1}, ${m}, ${m+1}.`,`Largest: <b>${m+1}</b>`]};}
  const m=2*R(6,40),S=3*m;return{text:`Three consecutive <b>even</b> numbers add up to <b>${S}</b>. What is the largest?`,...mc(m+2,[m+1,m,m+4,m-2]),
    hint:`Find the middle number first. Even numbers go up in 2s.`,steps:[`Middle number: ${S} ÷ 3 = ${m}`,`Consecutive even numbers go up by 2: ${m-2}, ${m}, ${m+2}`,`Largest: <b>${m+2}</b>`]};
}
const TOPICS=[
  {id:'place',name:'Place value',strand:'Number',glyph:'305',tone:'a',gens:[gPlaceValue,gRounding,gExpanded,gOrdering]},
  {id:'addsub',name:'Adding & subtracting',strand:'Number',glyph:'+−',tone:'a',gens:[gColAdd,gColSub,gMissingAdd,gAddSubWord]},
  {id:'multdiv',name:'Multiplying & dividing',strand:'Number',glyph:'×÷',tone:'a',gens:[gTables,gMultSplit,gDivRem,gMultDivWord,gFactors]},
  {id:'frac',name:'Fractions & decimals',strand:'Number',glyph:'¾',tone:'b',gens:[gFracOf,gEquivFrac,gFracShaded,gDecimals,gCompareFrac]},
  {id:'pattern',name:'Patterns & algebra',strand:'Algebra',glyph:'2·4·6',tone:'b',gens:[gSequences,gMissingOp,gIoRule]},
  {id:'measure',name:'Length, area & volume',strand:'Measurement',glyph:'cm²',tone:'c',gens:[gPerimeter,gArea,gLShape,gConvert,gVolumeCubes]},
  {id:'time',name:'Time, money & calendars',strand:'Measurement',glyph:'3:45',tone:'c',gens:[gClockRead,gElapsed,gTime24,gChange,gCalendar]},
  {id:'shape',name:'Shapes, angles & position',strand:'Space',glyph:'△',tone:'d',gens:[gShape3d,gPolygons,gTurns,gAngleType]},
  {id:'data',name:'Data & chance',strand:'Statistics',glyph:'▮▮▯',tone:'d',gens:[gBarGraph,gChance]},
  {id:'reason',name:'OC problem solving',strand:'Reasoning',glyph:'?!',tone:'e',gens:[gBackwards,gSumDiff,gLegs,gMatchsticks,gAges,gBestBuy,gConsecutive]},
];
const TOPIC=Object.fromEntries(TOPICS.map(t=>[t.id,t]));
function makeQ(tid,L,avoid){
  const t=TOPIC[tid];
  for(let tries=0;tries<12;tries++){
    const g=pick(t.gens);if(avoid&&g.name===avoid&&t.gens.length>1&&tries<6)continue;
    try{const q=g(L);if(q&&q.choices&&q.choices.length>=3&&q.answer>=0&&!/undefined|NaN/.test(q.text+q.choices.join('')+q.steps.join('')))return Object.assign(q,{topic:tid,level:L,gen:g.name});}
    catch(e){console.warn(g.name,e);}
  }
  return Object.assign(gTables(1),{topic:tid,level:1,gen:'gTables'});
}
