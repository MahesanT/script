// Question styles found in the department's three published OC practice tests (2026 entry),
// written as the app's own questions: "whose reasoning is correct?", "which statements are correct?",
// number pyramids, hidden cube faces, proportion, overnight durations, dice nets and limiting ingredients.

// ---------- Maths ----------
function gClaims(L){
  const N=pick(L===1?[10,12]:[10,11,12,15,20]),k=R(4,N-3),[a,b]=shuffle(Array.from({length:N},(_,i)=>i+1)),ev=Math.floor(N/2),od=N-ev,gt=N-k,lt=k-1,far=N+R(1,5);
  const pool=[
    {s:`Jess is equally likely to take out an even number or an odd number.`,t:ev===od,w:`There are ${ev} even and ${od} odd numbers, so this is ${ev===od?'correct':'not correct'}.`},
    {s:`Jess is more likely to take out a number greater than ${k} than a number less than ${k}.`,t:gt>lt,w:`${gt} numbers are greater than ${k} and ${lt} are less than ${k}, so this is ${gt>lt?'correct':'not correct'}.`},
    {s:`Jess is equally likely to take out the number ${a} or the number ${b}.`,t:true,w:`Each number is on exactly one counter, so ${a} and ${b} are equally likely. Correct.`},
    {s:`Jess is more likely to take out an odd number than an even number.`,t:od>ev,w:`${od} odd and ${ev} even numbers, so this is ${od>ev?'correct':'not correct'}.`},
    {s:`It is impossible for Jess to take out the number ${far}.`,t:true,w:`The counters only go up to ${N}, so ${far} is impossible. Correct.`},
    {s:`Jess is certain to take out a number less than ${N}.`,t:false,w:`She could take out ${N} itself, so it is not certain. Not correct.`},
  ];
  const cl=shuffle(pool).slice(0,3),T=cl.map(c=>c.t);
  const label=t=>{const on=[1,2,3].filter((_,i)=>t[i]);return on.length===0?'none of the statements':on.length===3?'all three statements':on.length===1?`statement ${on[0]} only`:`statements ${on[0]} and ${on[1]} only`;};
  const combos=[];for(let m=0;m<8;m++)combos.push([!!(m&1),!!(m&2),!!(m&4)]);
  return{text:`A bag has ${N} counters numbered 1 to ${N}. Jess takes out one counter without looking.<br>${cl.map((c,i)=>`<b>Statement ${i+1}:</b> ${c.s}`).join('<br>')}<br>Which of the statements are correct?`,
    ...mc(label(T),shuffle(combos.map(label).filter(l=>l!==label(T)))),hint:`Check each statement on its own. Count how many counters fit each part.`,
    steps:[...cl.map((c,i)=>`Statement ${i+1}: ${c.w}`),`So the answer is <b>${label(T)}</b>.`]};
}
function gPyramid(L){
  const hi=L===2?40:12,a=R(2,hi),b=R(2,hi),c=R(2,hi),M1=a+b,P=b+c,T=M1+P;
  const box=(v,cls='')=>`<span class="pb ${cls}">${v}</span>`;
  const vis=`<div class="pyr"><div>${box(T)}</div><div>${box(M1)}${box('P','q')}</div><div>${box(a)}${box('Q','q')}${box(c)}</div></div>`;
  const intro=`In this number pyramid, each number is the sum of the two numbers directly below it.`;
  if(L<3)return{text:`${intro} What number is <b>${L===1?'Q':'P'}</b>?`,visual:vis,...mc(L===1?b:P,L===1?[M1+a,T-M1,b+1,c]:[T+M1,b,P+1,T-a,M1]),
    hint:`Find a pair below a number you know, where only one is missing.`,steps:[`${a} + Q = ${M1}, so Q = ${M1} − ${a} = ${b}`,...(L===1?[]:[`${M1} + P = ${T}, so P = ${T} − ${M1} = ${P}`,`Check: Q + ${c} = ${b} + ${c} = ${P} ✓`]),`Answer: <b>${L===1?b:P}</b>`]};
  return{text:`${intro} What is <b>P × Q</b>?`,visual:vis,...mc(P*b,[P+b,P*c,(P+1)*b,T*b,P*(b+1)]),hint:`Find Q first using the bottom-left pair, then find P using the top.`,
    steps:[`${a} + Q = ${M1}, so Q = ${b}`,`${M1} + P = ${T}, so P = ${P}`,`P × Q = ${P} × ${b} = <b>${P*b}</b>`]};
}
function gHiddenFaces(L){
  const[l,w,h]=L===1?[R(3,5),1,1]:L===2?[R(2,4),R(2,3),1]:[R(2,3),R(2,3),2],n=l*w*h,touch=(l-1)*w*h+l*(w-1)*h+l*w*(h-1),hid=2*touch,vis=6*n-hid,askHidden=L!==2||Math.random()<.5;
  return{text:`${n} cubes are glued together to make this shape. You can pick it up and look at it from every side. How many small square faces <b>${askHidden?'cannot':'can'}</b> be seen?`,visual:prismSVG(l,w,h),
    ...mc(askHidden?hid:vis,askHidden?[touch,vis,hid+2,6*n,hid-2]:[hid,6*n,vis+2,vis-2,touch*3]),hint:`Wherever two cubes are glued together, two faces are hidden: one on each cube.`,
    steps:[`Count the places where two cubes are glued together: <b>${touch}</b>.`,`Each one hides 2 faces, so ${touch} × 2 = ${hid} faces are hidden.`,...(askHidden?[`Answer: <b>${hid}</b>`]:[`Altogether there are ${n} × 6 = ${6*n} faces.`,`${6*n} − ${hid} = <b>${vis}</b> faces can be seen.`])]};
}
function gProportion(L){
  const A=pick([['penguins','fish'],['koalas','gum leaves'],['horses','hay']]),B=A[0]==='penguins'?'sea lions':A[0]==='koalas'?'wombats':'cows',f=A[1],u=f==='hay'?'bales':'kg';
  const pa=R(2,5),na=pick([4,6,8]),pb=R(4,9),nb=pick([2,3,4]);
  if(L===1){const m=pick([2,3,5,10].filter(x=>x!==na)),ans=pa*m;
    return{text:`${na} ${A[0]} eat ${pa*na} ${u} of ${f} each week. Each one eats the same amount. How much do <b>${m}</b> ${A[0]} eat each week?`,...mc(ans,[pa*na+m,pa*na,ans+pa,m*na]),
      hint:`How much does one eat?`,steps:[`One eats ${pa*na} ÷ ${na} = ${pa} ${u}.`,`${m} eat ${m} × ${pa} = <b>${ans} ${u}</b>`]};}
  const ma=pick([na/2,na*2,na+2]),mb=pick([nb*2,nb*3,nb+1]),ans=ma*pa+mb*pb;
  return{text:`At the zoo, ${na} ${A[0]} eat ${pa*na} ${u} of ${f} a week and ${nb} ${B} eat ${pb*nb} ${u} a week. How much would <b>${ma} ${A[0]}</b> and <b>${mb} ${B}</b> eat in a week?`,
    ...mc(ans,[pa*na+pb*nb,ma*pb+mb*pa,ans+pa,ans-pb,(ma+mb)*pa]),hint:`Work out how much ONE of each animal eats.`,
    steps:[`One of the ${A[0]}: ${pa*na} ÷ ${na} = ${pa} ${u}. One of the ${B}: ${pb*nb} ÷ ${nb} = ${pb} ${u}.`,`${ma} × ${pa} = ${ma*pa} and ${mb} × ${pb} = ${mb*pb}`,`${ma*pa} + ${mb*pb} = <b>${ans} ${u}</b>`]};
}
function timeWords(t){const h=Math.floor(t/60)%24,m=t%60,nh=(h+1)%24,nm=x=>x===0?'midnight':x===12?'midday':`${x%12}`;
  if(m===0)return h===0?'midnight':h===12?'midday':`${h%12} o'clock`;if(m===30)return`half past ${nm(h)}`;if(m===15)return`quarter past ${nm(h)}`;if(m===45)return`quarter to ${nm(nh)}`;if(m===40)return`twenty to ${nm(nh)}`;return fmtTime(t);}
function gOvernight(L){
  const s=R(19,23)*60+pick([0,15,30,40,45]),e=R(L===1?5:6,L===3?16:11)*60+pick([0,5,15,30,45]),d=1440-s+e;
  const sw=L===3?timeWords(s):fmtTime(s);
  return{text:`Liu Wei got on a train at <b>${sw}</b>${L===3&&!/[ap]m/.test(sw)?' at night':''} and got off at <b>${fmtTime(e)}</b> the next day. How long was Liu Wei on the train?`,
    ...mc(durStr(d),[durStr(d+60),durStr(d-60),durStr(Math.abs(e-s)%1440||60),durStr(d+5),durStr(d-5),durStr(d+720)]),hint:`Split the time into two parts: up to midnight, then from midnight.`,
    steps:[`${fmtTime(s)} to midnight is ${durStr(1440-s)}.`,`Midnight to ${fmtTime(e)} is ${durStr(e)}.`,`Total: ${durStr(1440-s)} + ${durStr(e)} = <b>${durStr(d)}</b>`]};
}
function gFollowRule(L){
  let v=R(L===1?10:20,L===1?40:99);const start=v,n=L===1?3:L===2?5:6,st=[];
  for(let i=0;i<n;i++){const nx=v%2?v+1:v/2;st.push(`${v} is ${v%2?'odd, so add 1':'even, so halve it'} → ${nx}`);v=nx;}
  return{text:`Ari starts with <b>${start}</b> and follows these instructions:<br>• If the number is odd, add 1.<br>• If the number is even, halve it.<br>Ari does this <b>${n} times</b>. What number does Ari end with?`,
    ...mc(v,[v+1,v*2,v===1?3:v-1,Math.round(start/2**n),v+2]),hint:`Write each number down as you go so you don't lose your place.`,steps:[...st,`After ${n} steps Ari has <b>${v}</b>.`]};
}
function gFencePosts(L){
  const g=pick([2,3,5]);
  if(L===1){const s=g*R(3,8),n=s/g+1;return{text:`A fence is <b>${s} m</b> long in a straight line. There is a post at each end and a post every <b>${g} m</b>. How many posts are there?`,
    ...mc(n,[n-1,n+1,s,2*n]),hint:`Draw a short fence. Count the gaps and the posts.`,steps:[`There are ${s} ÷ ${g} = ${s/g} gaps.`,`A straight fence has one more post than gaps: ${s/g} + 1 = <b>${n}</b>`]};}
  const a=g*R(2,6),b=L===3?g*R(2,6):a,n=2*(a+b)/g;
  return{text:`A fence goes all the way around a ${L===3?`rectangular paddock ${a} m long and ${b} m wide`:`square paddock with sides of ${a} m`}. There is a post at every corner and a post every <b>${g} m</b>. How many posts are there?`,
    ...mc(n,[n+4,n-4,2*(a+b),n+1,(a/g+1)*4]),hint:`Around a closed shape, the number of posts equals the number of gaps.`,
    steps:[`The distance around is ${2*(a+b)} m.`,`Gaps: ${2*(a+b)} ÷ ${g} = ${n}.`,`Around a closed loop, posts = gaps, so there are <b>${n}</b> posts. (Corner posts are shared by two sides, so don't count them twice.)`]};
}

// ---------- Thinking Skills ----------
const RULES=[
  {only:'Only students who go to the meeting at lunchtime today will be allowed to go on the excursion next week.',all:'Every student who goes to the meeting at lunchtime today will be allowed to go on the excursion next week.',p:'go to the meeting',q:'go on the excursion',
   PQ:'{n} is going to the meeting today, so {n} will definitely be allowed to go on the excursion.',nPnQ:'{n} has cricket practice at lunchtime and will miss the meeting, so {n} won\'t be allowed to go on the excursion.',QP:'{n} is allowed to go on the excursion, so {n} must have gone to the meeting.',nQnP:'{n} isn\'t allowed to go on the excursion, so {n} can\'t have gone to the meeting.'},
  {only:'Only children who have a swimming certificate may swim in the deep end of the pool.',all:'Every child who has a swimming certificate may swim in the deep end of the pool.',p:'have a swimming certificate',q:'swim in the deep end',
   PQ:'{n} has a swimming certificate, so {n} will definitely be allowed in the deep end.',nPnQ:'{n} doesn\'t have a swimming certificate, so {n} won\'t be allowed in the deep end.',QP:'{n} is allowed in the deep end, so {n} must have a swimming certificate.',nQnP:'{n} isn\'t allowed in the deep end, so {n} can\'t have a swimming certificate.'},
  {only:'Only students who have returned all their library books can borrow new books this week.',all:'Every student who has returned all their library books can borrow new books this week.',p:'return all your library books',q:'borrow new books',
   PQ:'{n} has returned every library book, so {n} will definitely be able to borrow new books.',nPnQ:'{n} still has a library book at home, so {n} won\'t be able to borrow new books this week.',QP:'{n} is allowed to borrow new books this week, so {n} must have returned every library book.',nQnP:'{n} isn\'t allowed to borrow new books this week, so {n} can\'t have returned every library book.'},
  {only:'Only choir members who come to every rehearsal will be chosen to sing a solo in the concert.',all:'Every choir member who comes to every rehearsal will be chosen to sing a solo in the concert.',p:'come to every rehearsal',q:'be chosen for a solo',
   PQ:'{n} has come to every rehearsal, so {n} will definitely be chosen to sing a solo.',nPnQ:'{n} missed a rehearsal last week, so {n} won\'t be chosen to sing a solo.',QP:'{n} has been chosen to sing a solo, so {n} must have come to every rehearsal.',nQnP:'{n} wasn\'t chosen to sing a solo, so {n} can\'t have come to every rehearsal.'},
  {only:'Only students who bring a signed permission note can go on the bus to the sports carnival.',all:'Every student who brings a signed permission note can go on the bus to the sports carnival.',p:'bring a signed note',q:'go on the bus',
   PQ:'{n} brought a signed note, so {n} will definitely be allowed on the bus.',nPnQ:'{n} forgot the permission note, so {n} won\'t be allowed on the bus.',QP:'{n} is allowed on the bus, so {n} must have brought a signed note.',nQnP:'{n} isn\'t allowed on the bus, so {n} can\'t have brought a signed note.'},
];
function tReasoning(L){
  const C=pick(RULES),kind=L===1?'only':pick(['only','all']),[X,Y,n1_,n2_]=people(4),types=['PQ','nPnQ','QP','nQnP'],[t1,t2]=shuffle(types);
  const valid={only:{PQ:false,nPnQ:true,QP:true,nQnP:false},all:{PQ:true,nPnQ:false,QP:false,nQnP:true}}[kind];
  const why=(who,t)=>{const ok=valid[t];const r={
    only:{PQ:`doing it is needed, but the rule doesn't promise it is enough. There could be other reasons someone isn't allowed.`,nPnQ:`you can only ${C.q} if you ${C.p}, so without it the answer is no.`,QP:`only people who ${C.p} can ${C.q}, so anyone who can must have done it.`,nQnP:`someone might ${C.p} and still not be allowed for another reason.`},
    all:{PQ:`the rule says that if you ${C.p}, you can ${C.q}.`,nPnQ:`the rule doesn't say that people who don't ${C.p} can't ${C.q}. Others might be allowed too.`,QP:`other people might be allowed to ${C.q} too, so we can't be sure.`,nQnP:`if they had done it, the rule says they would be allowed. So they can't have.`}}[kind][t];
    return`${ok?'✓':'✗'} ${ok?'correct':'not correct'}: ${r}`;};
  const s1=C[t1].replace(/\{n\}/g,n1_),s2=C[t2].replace(/\{n\}/g,n2_),v1=valid[t1],v2=valid[t2];
  const choices=[`${X} only`,`${Y} only`,`Both ${X} and ${Y}`,`Neither ${X} nor ${Y}`],answer=v1&&v2?2:v1?0:v2?1:3;
  return{text:`<div class="rulebox">${C[kind]}</div><b>${X}:</b> “${s1}”<br><b>${Y}:</b> “${s2}”<br>If the information in the box is true, whose reasoning is correct?`,choices,answer,
    hint:kind==='only'?`"Only" tells you what is NEEDED. It doesn't say that doing it is enough.`:`"Every…" tells you what is ENOUGH. It doesn't say it is the only way.`,
    steps:[`The rule: ${kind==='only'?`you can only ${C.q} if you ${C.p}`:`if you ${C.p}, you can ${C.q}`}.`,`${X}'s reasoning is ${why('x',t1)}`,`${Y}'s reasoning is ${why('y',t2)}`,`So the answer is <b>${choices[answer]}</b>.`]};
}
function diceSVG(cells){const s=26,W=Math.max(...cells.map(c=>c[1]))+1,H=Math.max(...cells.map(c=>c[0]))+1;
  return`<svg class="tile net" viewBox="0 0 ${W*s+4} ${H*s+4}" width="${W*s+4}" height="${H*s+4}" role="img" aria-label="Dice net">${cells.map(([r,c,v])=>`<rect class="sv-net" x="${2+c*s}" y="${2+r*s}" width="${s}" height="${s}"/><text class="sv-num" x="${2+c*s+s/2}" y="${2+r*s+s/2}">${v}</text>`).join('')}</svg>`;}
function tDice(L){
  const make=()=>{const pr=shuffle([[1,6],[2,5],[3,4]]).map(p=>shuffle(p)),a=R(0,3),b=R(0,3);
    return[[0,a,pr[2][0]],[1,0,pr[0][0]],[1,1,pr[1][0]],[1,2,pr[0][1]],[1,3,pr[1][1]],[2,b,pr[2][1]]];};
  const tf=cells=>{let x=cells.map(c=>c.slice());for(let i=R(0,3);i>0;i--)x=x.map(([r,c,v])=>[c,-r,v]);if(Math.random()<.5)x=x.map(([r,c,v])=>[r,-c,v]);const mr=Math.min(...x.map(v=>v[0])),mc_=Math.min(...x.map(v=>v[1]));return x.map(([r,c,v])=>[r-mr,c-mc_,v]);};
  const good=make(),bads=[];
  while(bads.length<3){const g=make(),i=R(0,5);let j;do{j=R(0,5);}while(j===i||g[i][2]+g[j][2]===7);const t=g[i][2];g[i][2]=g[j][2];g[j][2]=t;bads.push(g);}
  const store={},K=c=>JSON.stringify(c),opts=[good,...bads].map(tf);opts.forEach(c=>store[K(c)]=c);
  return{text:`On a normal dice, the numbers on opposite faces always add up to <b>7</b>. Which net will fold to make a normal dice?`,...mc(K(opts[0]),opts.slice(1).map(K),k=>diceSVG(store[k])),
    hint:`In a row of 4 squares, the 1st and 3rd are opposite, and so are the 2nd and 4th. The two squares sticking out are opposite each other.`,
    steps:[`Find the pairs that will be opposite when folded:`,`• in the row of 4: the 1st with the 3rd, and the 2nd with the 4th`,`• the square above the row with the square below it`,`Only one net has all three pairs adding to 7:`,diceSVG(opts[0])]};
}
function tLimiting(L){
  const batch=pick([6,8,12]),need={flour:pick([100,150,200]),sugar:pick([50,75,100]),butter:pick([50,100]),eggs:pick([1,2,3])},unit={flour:'g',sugar:'g',butter:'g',eggs:''};
  const sets={};let have={};const ks=Object.keys(need),lim=pick(ks),ls=R(2,4);
  for(const k of ks){sets[k]=k===lim?ls:ls+R(1,3);have[k]=need[k]*sets[k]+(k===lim||need[k]===1?0:Math.floor(need[k]/2)*R(0,1));}
  const ans=ls*batch,fmtA=k=>k==='eggs'?`${have[k]} eggs`:`${have[k]} ${unit[k]} of ${k}`,fmtN=k=>k==='eggs'?`${need[k]} egg${need[k]>1?'s':''}`:`${need[k]} ${unit[k]} of ${k}`;
  return{text:`A recipe for <b>${batch} cupcakes</b> needs ${ks.map(fmtN).join(', ')}. Sam has ${ks.map(fmtA).join(', ')}. What is the greatest number of cupcakes Sam can make?`,
    ...mc(ans,[(ls+1)*batch,Math.min(...ks.filter(k=>k!==lim).map(k=>Math.floor(have[k]/need[k])))*batch,ls,ans-batch/2,batch*ks.length]),
    hint:`For each ingredient, work out how many batches Sam has enough for. The smallest number decides.`,
    steps:[...ks.map(k=>`${cap(k)}: ${have[k]} ÷ ${need[k]} → enough for ${Math.floor(have[k]/need[k])} batch${Math.floor(have[k]/need[k])>1?'es':''}`),`${cap(lim)} runs out first: ${ls} batches.`,`${ls} × ${batch} = <b>${ans}</b> cupcakes`]};
}
CRIT.push(
  {t:`A doctor has suggested that every primary school should have a vegetable garden.<br>Which one of these statements, if true, best <b>supports</b> the doctor's claim?`,r:`Children who grow vegetables are more likely to eat them.`,w:[`Some schools have very large playgrounds.`,`Vegetables can be bought at the supermarket.`,`Gardening tools can be expensive.`],h:`Look for a statement that gives a benefit of having a school vegetable garden.`,s:[`The claim needs a reason why a school garden is good for children.`,`If growing vegetables makes children eat them, that is a health benefit, so it supports the claim.`]},
  {t:`A librarian claims that children should read for twenty minutes every night.<br>Which one of these statements, if true, best <b>supports</b> the librarian's claim?`,r:`Reading every night helps children learn new words faster.`,w:[`Some books have lots of pictures.`,`The library is open on Saturday mornings.`,`Many children watch television at night.`],h:`Which statement gives a reason why reading every night is good?`,s:[`The claim needs a benefit of nightly reading.`,`Learning new words faster is a benefit, so it supports the claim.`]},
  {t:`A park ranger says that dogs must be kept on a lead in the national park.<br>Which one of these statements, if true, best <b>supports</b> the ranger's claim?`,r:`Dogs that run free often scare native birds away from their nests.`,w:[`Many families in the town own a dog.`,`The national park has a large car park.`,`Some dogs are very small.`],h:`Which statement shows a problem that leads would prevent?`,s:[`The claim needs a reason why dogs should be on leads.`,`Free-running dogs scaring birds from nests is a harm that leads prevent.`]},
  {t:`The principal says students should drink water instead of soft drink at school.<br>Which one of these statements, if true, best <b>supports</b> the principal's claim?`,r:`Drinking water instead of soft drink helps protect children's teeth.`,w:[`Soft drink comes in many different flavours.`,`The canteen sells sandwiches and fruit.`,`Water bottles come in many colours.`],h:`Look for a benefit of choosing water.`,s:[`The claim needs a reason why water is better.`,`Protecting teeth is a benefit of water over soft drink.`]},
  {t:`Ella: "Every time I wear my lucky socks, my netball team wins. If I wear them on Saturday, we will definitely win."<br>Which one of the following sentences shows the mistake Ella has made?`,r:`The socks might not be the reason the team wins.`,w:[`Ella might not be able to find her socks on Saturday.`,`The game might be on Sunday instead.`,`Ella's socks might be a different colour from her uniform.`],h:`Ella thinks one thing causes another. Is that really true?`,s:[`Ella has noticed two things happening together: lucky socks and winning.`,`That doesn't mean the socks cause the wins, so she can't be sure they will win.`]},
  {t:`Ms Patel saw that eight students had umbrellas this morning, so she decided that it must be raining.<br>Which one of the following sentences shows the mistake Ms Patel has made?`,r:`Students might carry umbrellas even when it is not raining.`,w:[`Some students might have forgotten their umbrellas.`,`It might rain later in the afternoon.`,`Eight is not very many students.`],h:`Does carrying an umbrella always mean it is raining?`,s:[`Ms Patel assumes umbrellas mean rain.`,`Students might bring umbrellas because rain was forecast, or for sun, so it might not be raining.`]},
  {t:`Finn: "The shop sold out of strawberry ice cream first, so strawberry must be the most popular flavour."<br>Which one of the following sentences shows the mistake Finn has made?`,r:`The shop might have had much less strawberry ice cream to start with.`,w:[`Some people don't like ice cream.`,`The shop might sell strawberry ice cream again tomorrow.`,`Chocolate ice cream is Finn's favourite.`],h:`Is there another reason strawberry could sell out first?`,s:[`Selling out first could just mean there was less of it.`,`So it doesn't prove strawberry is the most popular.`]},
  {t:`Oscar: "My cousin is very tall and she is great at basketball. So tall people are always great at basketball."<br>Which one of the following sentences shows the mistake Oscar has made?`,r:`One person is not enough to show what is always true.`,w:[`Oscar's cousin might not play basketball every week.`,`Basketball is played by two teams.`,`Oscar might be taller than his cousin one day.`],h:`Can you decide what is ALWAYS true from just one example?`,s:[`Oscar uses one example to make a rule about everyone.`,`One example can't show something is always true.`]},
);
TOPIC.reason.gens.push(gClaims,gProportion,gFencePosts);
TOPIC.pattern.gens.push(gPyramid,gFollowRule);
TOPIC.measure.gens.push(gHiddenFaces);
TOPIC.time.gens.push(gOvernight);
TOPIC.data.gens.push(gClaims);
TOPIC.logic.gens.push(tReasoning,tReasoning,tReasoning);
TOPIC.spatial.gens.push(tDice);
TOPIC.puzzle.gens.push(tLimiting);
TOPIC.critical.gens.push(tReasoning);
