// Number strand: place value, + −, × ÷, fractions & decimals. Each generator takes a level 1–3.
function gPlaceValue(L){
  const n=L+3,digits=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,n),num=+digits.join(''),i=R(0,n-1),d=digits[i],p=n-1-i,ans=d*10**p;
  const wrong=[];for(let k=0;k<n;k++)if(k!==p)wrong.push(d*10**k);
  return{text:`What is the value of the digit <b class="hl">${d}</b> in <b>${fmt(num)}</b>?`,...mc(ans,shuffle(wrong)),
    hint:`Find which place the ${d} sits in. Count from the right: ones, tens, hundreds, thousands…`,
    steps:[`Write each digit under its place:${placeTable(num)}`,`The ${d} is in the <b>${PLACES[p]}</b> place.`,`So it is worth ${d} × ${fmt(10**p)} = <b>${fmt(ans)}</b>.`]};
}
function gRounding(L){
  const[lo,hi,u,name]=[[100,999,10,'ten'],[1000,9999,100,'hundred'],[10000,99999,1000,'thousand']][L-1],t=u/10;
  let n=R(lo,hi);if(Math.random()<.3)n=Math.floor(n/u)*u+5*t+(n%t);if(n%u===0)n+=t*R(1,9);
  const down=Math.floor(n/u)*u,up=down+u,k=Math.floor((n%u)/t),ans=k>=5?up:down;
  return{text:`Round <b>${fmt(n)}</b> to the nearest <b>${name}</b>.`,...mc(ans,[ans===up?down:up,Math.round(n/(u*10))*u*10,up+u,down-u,n]),
    hint:`Look at the digit just to the right of the ${name}s place. Is it 5 or more?`,
    steps:[`${fmt(n)} is between <b>${fmt(down)}</b> and <b>${fmt(up)}</b>.`,`The digit to the right of the ${name}s place is <b>${k}</b>.`,
      k>=5?`${k} is 5 or more, so round <b>up</b>.`:`${k} is less than 5, so round <b>down</b>.`,`Answer: <b>${fmt(ans)}</b>`]};
}
function gExpanded(L){
  const n=L+3;let ds;
  do{ds=Array.from({length:n},(_,i)=>i===0?R(1,9):(Math.random()<.35?0:R(1,9)));}while(!ds.slice(1).includes(0)||ds.filter(Boolean).length<3);
  const num=+ds.join(''),parts=ds.map((d,i)=>d*10**(n-1-i)).filter(Boolean),wrong=[+ds.filter(Boolean).join('')];
  shuffle(parts).forEach(pt=>{wrong.push(num-pt+pt*10);if(pt>=10)wrong.push(num-pt+pt/10);});
  return{text:`Which number is the same as<br><b>${parts.map(fmt).join(' + ')}</b>?`,...mc(num,wrong),
    hint:`Put each part in its place-value column. Empty columns need a zero.`,
    steps:[parts.map(pt=>`${fmt(pt)} → ${String(pt)[0]} in the ${PLACES[String(pt).length-1]}`).join('<br>'),`Columns with no part get a <b>0</b>:${placeTable(num)}`,`Answer: <b>${fmt(num)}</b>`]};
}
function gOrdering(L){
  const n=L+2,ds=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,n),set=new Set();let g=0;
  while(set.size<5&&g++<300){const p=shuffle(ds);if(p[0]!==0)set.add(+p.join(''));}
  const nums=[...set],big=Math.random()<.5,ans=big?Math.max(...nums):Math.min(...nums),sorted=nums.slice().sort((a,b)=>big?b-a:a-b);
  return{text:`Which number is the <b>${big?'largest':'smallest'}</b>?`,...mc(ans,nums.filter(x=>x!==ans)),
    hint:`Compare the digits in the biggest place first. If they match, move one place to the right.`,
    steps:[`All the numbers have ${n} digits, so compare from the left.`,`From ${big?'largest to smallest':'smallest to largest'}: ${sorted.map(fmt).join(', ')}`,`Answer: <b>${fmt(ans)}</b>`]};
}
const vsum=(a,op,b)=>`<div class="vsum"><span>${a}</span><span>${op} ${b}</span></div>`;
function gColAdd(L){
  const d=L+1,a=R(10**(d-1),10**d-1),b=R(10**(d-1),10**d-1),ans=a+b;
  const A=String(a).split('').reverse().map(Number),B=String(b).split('').reverse().map(Number);
  let carry=0;const steps=[],nc=[];
  for(let i=0;i<d;i++){const x=A[i],y=B[i],s=x+y+carry;nc.push((x+y)%10);
    steps.push(`<b>${cap(PLACES[i])}:</b> ${x} + ${y}${carry?' + 1 carried':''} = ${s}. `+(s>=10?`Write ${s%10}, carry 1 to the ${PLACES[i+1]}.`:`Write ${s}.`));carry=s>=10?1:0;}
  if(carry)steps.push(`Write the carried 1 in the ${PLACES[d]} place.`);steps.push(`Answer: <b>${fmt(ans)}</b>`);
  return{text:`Work out:`,visual:vsum(a,'+',b),...mc(ans,[+nc.reverse().join(''),ans+10,ans-10,ans+100,ans-1]),
    hint:`Line up the places. Start with the ones column and remember to carry.`,steps};
}
function gColSub(L){
  const d=L+1;let a,b;
  do{a=+Array.from({length:d},()=>R(1,9)).join('');b=R(10**(d-1),Math.max(10**(d-1),a-1));}while(a-b<5);
  const A=String(a).split('').reverse().map(Number),B=String(b).split('').reverse().map(Number),orig=A.slice(),steps=[];
  for(let i=0;i<d;i++){const x=A[i],y=B[i]||0;
    if(x<y){A[i+1]-=1;steps.push(`<b>${cap(PLACES[i])}:</b> ${x} − ${y}? ${x} is smaller, so trade 1 from the ${PLACES[i+1]} (it becomes ${A[i+1]}). Now ${x+10} − ${y} = <b>${x+10-y}</b>.`);}
    else steps.push(`<b>${cap(PLACES[i])}:</b> ${x} − ${y} = <b>${x-y}</b>.`);}
  const ans=a-b,flip=+orig.map((x,i)=>Math.abs(x-(B[i]||0))).reverse().join('');steps.push(`Answer: <b>${fmt(ans)}</b>`);
  return{text:`Work out:`,visual:vsum(a,'−',b),...mc(ans,[flip,ans+10,ans-10,ans+100]),
    hint:`Start with the ones. If the top digit is smaller, trade 1 from the next column.`,steps};
}
function gMissingAdd(L){
  const c=R(L===1?20:L===2?100:1000,L===1?99:L===2?999:9999),b=R(Math.floor(c/5),c-1),r=c-b,v=R(0,2);
  if(v===2)return{text:`<span class="big">${BOX} − ${fmt(b)} = ${fmt(r)}</span>`,...mc(c,[r-b,c+10,c-10,b]),
    hint:`Undo the subtraction by adding.`,steps:[`The opposite of subtracting is adding.`,`${fmt(r)} + ${fmt(b)} = <b>${fmt(c)}</b>`,`Check: ${fmt(c)} − ${fmt(b)} = ${fmt(r)} ✓`]};
  const text=v===0?`${BOX} + ${fmt(b)} = ${fmt(c)}`:`${fmt(c)} − ${BOX} = ${fmt(b)}`;
  return{text:`<span class="big">${text}</span>`,...mc(r,[c+b,r+10,r-10,r+1]),hint:`Use the opposite operation: what do you get when you take ${fmt(b)} from ${fmt(c)}?`,
    steps:[`Use the inverse: ${fmt(c)} − ${fmt(b)}`,`${fmt(c)} − ${fmt(b)} = <b>${fmt(r)}</b>`,`Check: ${v===0?`${fmt(r)} + ${fmt(b)} = ${fmt(c)}`:`${fmt(c)} − ${fmt(r)} = ${fmt(b)}`} ✓`]};
}
function gAddSubWord(L){
  const[lo,hi]=[[20,90],[120,900],[1200,9000]][L-1],N=()=>R(lo,hi),t=R(0,3);
  if(t===0){const a=N(),b=R(Math.floor(lo/2),Math.floor(hi/3)),c=R(Math.floor(lo/2),a),ans=a+b-c;
    return{text:`A school library had <b>${fmt(a)}</b> books. It bought <b>${fmt(b)}</b> new books, then lent out <b>${fmt(c)}</b>. How many books are on the shelves now?`,
      ...mc(ans,[a+b+c,a+b,a-c,ans+10,ans-10]),hint:`Two steps: add the new books, then take away the ones lent out.`,
      steps:[`Add the new books: ${fmt(a)} + ${fmt(b)} = ${fmt(a+b)}`,`Take away the books lent out: ${fmt(a+b)} − ${fmt(c)} = ${fmt(ans)}`,`Answer: <b>${fmt(ans)}</b> books`]};}
  if(t===1){const a=N(),b=N(),c=R(lo,a+b-1),ans=a+b-c,$=v=>'$'+fmt(v);
    return{text:`Zara saved <b>$${fmt(a)}</b> in March and <b>$${fmt(b)}</b> in April. She spent <b>$${fmt(c)}</b> on a scooter. How much money does she have left?`,
      ...mc(ans,[a+b+c,a+b,ans+10,ans-10],$),hint:`Find how much she saved altogether first.`,
      steps:[`Total saved: $${fmt(a)} + $${fmt(b)} = $${fmt(a+b)}`,`After the scooter: $${fmt(a+b)} − $${fmt(c)} = $${fmt(ans)}`,`Answer: <b>$${fmt(ans)}</b>`]};}
  if(t===2){const a=N(),b=R(Math.max(2,Math.floor(lo/4)),a-1),ans=2*a-b;
    return{text:`Year 4 collected <b>${fmt(a)}</b> cans for recycling. Year 3 collected <b>${fmt(b)}</b> fewer cans than Year 4. How many cans did the two classes collect altogether?`,
      ...mc(ans,[a+b,a-b,2*a+b,ans+10]),hint:`First work out how many cans Year 3 collected.`,
      steps:[`Year 3: ${fmt(a)} − ${fmt(b)} = ${fmt(a-b)}`,`Both classes: ${fmt(a)} + ${fmt(a-b)} = ${fmt(ans)}`,`Answer: <b>${fmt(ans)}</b> cans`]};}
  const a=N(),b=R(Math.floor(a/3),a-2),c=R(2,Math.max(3,Math.floor(lo/2))),ans=a-b+c;
  return{text:`There were <b>${fmt(a)}</b> people at the swimming carnival. <b>${fmt(b)}</b> were students and the rest were parents. Then <b>${fmt(c)}</b> more parents arrived. How many parents are there now?`,
    ...mc(ans,[a-b,a+b+c,a-b-c,ans+10]),hint:`Find how many parents there were at the start.`,
    steps:[`Parents at first: ${fmt(a)} − ${fmt(b)} = ${fmt(a-b)}`,`More arrive: ${fmt(a-b)} + ${fmt(c)} = ${fmt(ans)}`,`Answer: <b>${fmt(ans)}</b> parents`]};
}
function strat(a,b){const p=a*b;switch(a){
  case 2:return[`× 2 means double: ${b} + ${b} = ${p}`];
  case 3:return[`Double ${b} is ${2*b}`,`Add one more ${b}: ${2*b} + ${b} = ${p}`];
  case 4:return[`Double ${b}: ${2*b}`,`Double again: ${p}`];
  case 5:return[`${b} × 10 = ${10*b}`,`Half of that is ${p}`];
  case 6:return[`${b} × 5 = ${5*b}`,`Add one more ${b}: ${5*b} + ${b} = ${p}`];
  case 7:return[`${b} × 5 = ${5*b}`,`${b} × 2 = ${2*b}`,`${5*b} + ${2*b} = ${p}`];
  case 8:return[`${b} × 4 = ${4*b}`,`Double it: ${p}`];
  case 9:return[`${b} × 10 = ${10*b}`,`Take away one ${b}: ${10*b} − ${b} = ${p}`];
  case 10:return[`× 10 moves each digit one place to the left: ${p}`];
  case 11:return[`${b} × 10 = ${10*b}`,`Add one more ${b}: ${10*b} + ${b} = ${p}`];
  case 12:return[`${b} × 10 = ${10*b}`,`${b} × 2 = ${2*b}`,`${10*b} + ${2*b} = ${p}`];
  default:return[`${a} × ${b} = ${p}`];}}
function gTables(L){
  const sets=[[2,3,4,5,10],[2,3,4,5,6,7,8,9,10],[3,4,6,7,8,9,11,12]][L-1],a=pick(sets),b=R(2,L===3?12:10),p=a*b,t=L===1?0:R(0,L===2?1:2);
  if(t===0)return{text:`<span class="big">${a} × ${b} = ${BOX}</span>`,...mc(p,[a*(b+1),a*(b-1),(a+1)*b,(a-1)*b,a+b]),
    hint:`Use a fact you already know. ${a} × ${b} is the same as ${b} × ${a}.`,steps:[...strat(a,b),`Answer: <b>${p}</b>`]};
  if(t===1)return{text:`<span class="big">${BOX} × ${b} = ${p}</span>`,...mc(a,[a+1,a-1,b,a+2,p-b]),hint:`Count by ${b}s until you reach ${p}. How many jumps?`,
    steps:[`Think: what times ${b} makes ${p}?`,`Count by ${b}s: ${Array.from({length:a},(_,i)=>(i+1)*b).join(', ')}`,`That's <b>${a}</b> jumps, so ${a} × ${b} = ${p}.`]};
  return{text:`<span class="big">${p} ÷ ${a} = ${BOX}</span>`,...mc(b,[b+1,b-1,a,b+2,p-a]),hint:`Division is the opposite of times. Think: ${a} × what = ${p}?`,
    steps:[`Turn it into a times question: ${a} × ${BOX} = ${p}`,...strat(a,b),`So ${p} ÷ ${a} = <b>${b}</b>`]};
}
function gMultSplit(L){
  let a,b;if(L===1){a=R(12,49);b=R(2,5);}else if(L===2){a=R(23,99);b=R(3,9);}else if(Math.random()<.5){a=R(102,499);b=R(3,9);}else{a=R(12,39);b=R(11,19);}
  if(a%10===0)a+=1;const ans=a*b;let steps;
  if(b<10){const parts=String(a).split('').map((d,i,arr)=>+d*10**(arr.length-1-i)).filter(Boolean);
    steps=[`Split ${a} into place-value parts: ${parts.join(' + ')}`,...parts.map(pt=>`${pt} × ${b} = ${fmt(pt*b)}`),`Add them: ${parts.map(pt=>fmt(pt*b)).join(' + ')} = <b>${fmt(ans)}</b>`];}
  else steps=[`Split ${b} into 10 + ${b-10}`,`${a} × 10 = ${fmt(a*10)}`,`${a} × ${b-10} = ${fmt(a*(b-10))}`,`Add them: ${fmt(a*10)} + ${fmt(a*(b-10))} = <b>${fmt(ans)}</b>`];
  const forgot=b<10?(a-a%10)*b+a%10:a*10+(b-10);
  return{text:`<span class="big">${a} × ${b} = ${BOX}</span>`,...mc(ans,[forgot,ans+10,ans-10,ans+b,a*(b-1)]),
    hint:b<10?`Split ${a} into hundreds, tens and ones. Multiply each part by ${b}, then add.`:`Split ${b} into 10 and ${b-10}. Multiply ${a} by each part, then add.`,steps};
}
function gDivRem(L){
  let d,q,r;if(L===1){d=R(2,10);q=R(2,10);r=0;}else if(L===2){d=R(3,9);q=R(3,12);r=R(1,d-1);}else{d=R(3,9);q=R(12,99);r=R(0,d-1);}
  const n=d*q+r,S=(q,r)=>r?`${q} r ${r}`:`${q}`,ans=S(q,r);
  const wrong=r?[S(q+1,r),S(q-1,r),S(q,r+1<d?r+1:r-1),S(q,0),S(q+1,0)]:[S(q+1,0),S(q-1,0),S(q,1),S(q+2,0)];
  let steps;
  if(q>=10){const t=Math.floor(q/10)*10,o=q-t;steps=[`${d} × ${t} = ${d*t}. That leaves ${n} − ${d*t} = ${n-d*t}.`,`${d} × ${o} = ${d*o}. That leaves ${n-d*t} − ${d*o} = ${r}.`,`${t} + ${o} = ${q} groups${r?`, with ${r} left over`:''}.`,`Answer: <b>${ans}</b>`];}
  else steps=[`Find the biggest multiple of ${d} that is not more than ${n}: ${d} × ${q} = ${d*q}.`,r?`${n} − ${d*q} = ${r} left over.`:`Nothing is left over.`,`Answer: <b>${ans}</b>`];
  return{text:`<span class="big">${n} ÷ ${d} = ${BOX}</span>`,...mc(ans,wrong),hint:`How many groups of ${d} fit into ${n}? Is anything left over?`,steps};
}
function gMultDivWord(L){
  const t=R(0,4),k=L===1?R(2,5):L===2?R(3,9):R(4,12);
  if(t===0){const rows=L===1?R(3,6):L===2?R(6,12):R(12,25),ans=rows*k;
    return{text:`The hall has <b>${rows}</b> rows of chairs with <b>${k}</b> chairs in each row. How many chairs are there?`,...mc(ans,[rows+k,ans+k,ans-k,ans+10]),
      hint:`Equal rows means multiply.`,steps:[`${rows} rows of ${k} is ${rows} × ${k}.`,`${rows} × ${k} = <b>${fmt(ans)}</b> chairs`]};}
  if(t===1){const each=L===1?R(2,6):L===2?R(4,12):R(12,30),tot=each*k;
    return{text:`<b>${tot}</b> stickers are shared equally between <b>${k}</b> friends. How many stickers does each friend get?`,...mc(each,[each+1,each-1,tot-k,each*2]),
      hint:`Sharing equally means divide.`,steps:[`Share ${tot} into ${k} equal groups: ${tot} ÷ ${k}`,`Check: ${k} × ${each} = ${tot}`,`Each friend gets <b>${each}</b>`]};}
  if(t===2){let n;do{n=R(k*2+1,k*(L===1?5:L===2?9:14));}while(n%k===0);const q=Math.floor(n/k),ans=q+1;
    return{text:`<b>${n}</b> children are going on an excursion. Each minibus holds <b>${k}</b> children. What is the smallest number of minibuses needed?`,...mc(ans,[q,q+2,n%k,q-1]),
      hint:`Work out ${n} ÷ ${k}. What happens to the children left over?`,
      steps:[`${n} ÷ ${k} = ${q} remainder ${n%k}`,`${q} minibuses carry ${q*k} children, but ${n%k} are still waiting.`,`They need one more minibus: ${q} + 1 = <b>${ans}</b>`]};}
  if(t===3){let n;do{n=R(k*2+1,k*(L===1?5:L===2?10:15));}while(n%k===0);const r=n%k,q=Math.floor(n/k);
    return{text:`A baker packs <b>${n}</b> cupcakes into boxes of <b>${k}</b>. How many cupcakes are left over?`,...mc(r,[q,k-r,r+1,q+1]),
      hint:`Fill as many full boxes as you can. What is left?`,steps:[`${q} full boxes hold ${k} × ${q} = ${q*k} cupcakes.`,`${n} − ${q*k} = ${r}`,`<b>${r}</b> cupcakes are left over.`]};}
  const price=L===1?R(2,9):L===2?R(6,25):R(15,48),n=L===1?R(2,5):L===2?R(3,9):R(6,15),ans=price*n,tn=price-price%10,on=price%10;
  return{text:`Movie tickets cost <b>$${price}</b> each. How much do <b>${n}</b> tickets cost?`,...mc(ans,[price+n,ans+price,ans-price,ans+10],v=>'$'+fmt(v)),
    hint:`${n} lots of $${price} means multiply.`,
    steps:[`${n} × $${price}`,...(price>10&&on?[`${n} × ${tn} = ${n*tn} and ${n} × ${on} = ${n*on}`,`${n*tn} + ${n*on} = ${ans}`]:[`${n} × ${price} = ${ans}`]),`Answer: <b>$${fmt(ans)}</b>`]};
}
function gFactors(L){
  if(L===1){const k=R(3,9),m=R(3,9),ans=k*m;
    return{text:`Which of these numbers is a multiple of <b>${k}</b>?`,...mc(ans,[ans+1,ans-1,ans+2,ans-2]),hint:`A multiple of ${k} is in the ${k} times table.`,
      steps:[`Count by ${k}s: ${Array.from({length:m+1},(_,i)=>(i+1)*k).join(', ')}`,`<b>${ans}</b> is ${k} × ${m}, so it is a multiple of ${k}.`]};}
  const N=pick(L===2?[12,16,18,20,24,15,28]:[30,36,40,42,48,60,64]),fs=[];for(let i=1;i<=N;i++)if(N%i===0)fs.push(i);
  const pairs=[];for(const f of fs){if(f*f>N)break;pairs.push(`${f} × ${N/f}`);}
  return{text:`How many factors does <b>${N}</b> have?`,...mc(fs.length,[fs.length-1,fs.length+1,fs.length-2,fs.length+2]),
    hint:`Find pairs of numbers that multiply to make ${N}. Start with 1 × ${N}.`,
    steps:[`Factor pairs: ${pairs.join(', ')}`,`The factors are ${fs.join(', ')}`,`Count them: <b>${fs.length}</b> factors`]};
}
function gFracOf(L){
  if(L<3){const d=pick(L===1?[2,3,4,5,10]:[3,4,5,6,8,10]),n=L===1?1:R(2,d-1),W=d*R(2,L===1?10:12),one=W/d,ans=one*n;
    return{text:`What is ${F(n,d)} of <b>${W}</b>?`,...mc(ans,[one,W-ans,ans+one,W/n,ans+1]),hint:`First find ${F(1,d)} of ${W} by dividing by ${d}.`,
      steps:[`One part: ${W} ÷ ${d} = ${one}`,...(n>1?[`You need ${n} parts: ${one} × ${n} = ${ans}`]:[]),`Answer: <b>${ans}</b>`]};}
  const d=pick([3,4,5,6,8]),n=R(1,d-1),W=d*R(3,12),one=W/d,part=one*n,ans=W-part;
  if(Math.random()<.5)return{text:`Mia had <b>$${W}</b>. She spent ${F(n,d)} of it on a book. How much money does she have left?`,...mc(ans,[part,one,ans+one,ans-one],v=>'$'+v),
    hint:`Work out how much she spent first.`,steps:[`${F(1,d)} of $${W} is $${W} ÷ ${d} = $${one}`,`She spent ${F(n,d)}: $${one} × ${n} = $${part}`,`Left: $${W} − $${part} = <b>$${ans}</b>`]};
  return{text:`There are <b>${W}</b> students in Year 4. ${F(n,d)} of them walk to school. How many students do <b>not</b> walk to school?`,...mc(ans,[part,one,ans+one,ans-one]),
    hint:`Find how many walk first, then take that away from ${W}.`,steps:[`${F(1,d)} of ${W} is ${W} ÷ ${d} = ${one}`,`Walkers: ${one} × ${n} = ${part}`,`Not walking: ${W} − ${part} = <b>${ans}</b>`]};
}
function gEquivFrac(L){
  if(L<3){const b=R(2,L===1?5:8),a=R(1,b-1),k=R(2,L===1?3:5);
    if(L===1||Math.random()<.5)return{text:`<span class="big">${F(a,b)} = ${F(BOX,b*k)}</span>`,...mc(a*k,[a+(b*k-b),a*k+1,a*k-1,a*(k+1)]),
      hint:`What was ${b} multiplied by to get ${b*k}? Do the same to the top.`,steps:[`${b} × ${k} = ${b*k}, so the bottom was multiplied by ${k}.`,`Multiply the top by ${k} too: ${a} × ${k} = ${a*k}`,`So ${F(a,b)} = ${F(a*k,b*k)}`]};
    return{text:`<span class="big">${F(a,b)} = ${F(a*k,BOX)}</span>`,...mc(b*k,[b+(a*k-a),b*k+1,b*k-1,b*(k+1)]),
      hint:`What was ${a} multiplied by to get ${a*k}? Do the same to the bottom.`,steps:[`${a} × ${k} = ${a*k}, so the top was multiplied by ${k}.`,`Multiply the bottom by ${k} too: ${b} × ${k} = ${b*k}`,`So ${F(a,b)} = ${F(a*k,b*k)}`]};}
  let a,b;do{b=R(3,9);a=R(1,b-1);}while(gcd(a,b)!==1);const k=R(2,4),N=a*k,D=b*k;
  const c=[[a+1,b],[a,b+1],[N-1,D],[N,D+1],[a+1,b+1],[a-1,b],[b-a,b],[a,b+2],[N+1,D]].filter(([x,y])=>x>0&&x<y&&x*b!==a*y).map(([x,y])=>`${x}/${y}`);
  return{text:`Which fraction is equal to ${F(N,D)}?`,...mc(`${a}/${b}`,c,fracFmt),hint:`Divide the top and the bottom by the same number. Try ${k}.`,
    steps:[`${N} and ${D} can both be divided by ${k}.`,`${N} ÷ ${k} = ${a} and ${D} ÷ ${k} = ${b}`,`So ${F(N,D)} = ${F(a,b)}`]};
}
function gFracShaded(L){
  if(L<3){const d=R(3,L===1?6:10),s=R(1,d-1),un=L===2&&Math.random()<.35,sh=new Set(Array.from({length:s},(_,i)=>i)),cnt=un?d-s:s,ans=`${cnt}/${d}`;
    return{text:`What fraction of the strip is ${un?'<b>not</b> shaded':'shaded'}?`,visual:gridSVG(1,d,sh),...mc(ans,[`${d-cnt}/${d}`,`${cnt}/${d-cnt}`,`${d-cnt}/${cnt}`,`${cnt}/${d+1}`,`1/${d}`],fracFmt),
      hint:`Count all the equal parts. That is the bottom number of the fraction.`,steps:[`The strip has <b>${d}</b> equal parts.`,`<b>${cnt}</b> parts are ${un?'not shaded':'shaded'}.`,`So the fraction is ${F(cnt,d)}`]};}
  const q=pick([2,3,4,5]),p=R(1,q-1),k=pick([2,3]),d=q*k,s=p*k,sh=new Set(shuffle(Array.from({length:d},(_,i)=>i)).slice(0,s));
  const c=[[q-p,q],[p,q+1],[p+1,q],[s,d-s],[p,d],[p,q+2],[q-p,q+1]].filter(([x,y])=>x>0&&x*q!==p*y).map(([x,y])=>`${x}/${y}`);
  return{text:`What fraction of the rectangle is shaded? Give it in <b>simplest form</b>.`,visual:gridSVG(k,q,sh),...mc(`${p}/${q}`,c,fracFmt),
    hint:`Write the fraction first, then divide the top and bottom by the same number.`,
    steps:[`There are ${d} squares and ${s} are shaded: ${F(s,d)}`,`Divide top and bottom by ${k}: ${s} ÷ ${k} = ${p}, ${d} ÷ ${k} = ${q}`,`Simplest form: ${F(p,q)}`]};
}
function gDecimals(L){
  if(L===1){const t=R(1,9);
    if(Math.random()<.5)return{text:`Which decimal means <b>${t} tenths</b>?`,...mc(`0.${t}`,[`0.0${t}`,`${t}.0`,`${t}0`,`1.${t}`]),hint:`The first place after the decimal point is tenths.`,
      steps:[`Tenths go in the first place after the decimal point.`,`${t} tenths = <b>0.${t}</b>`]};
    return{text:`Write ${F(t,10)} as a decimal.`,...mc(`0.${t}`,[`0.0${t}`,`${t}.10`,`1.${t}`,`${t}.0`]),hint:`${F(1,10)} is one tenth.`,
      steps:[`${F(t,10)} means ${t} tenths.`,`Tenths go straight after the decimal point: <b>0.${t}</b>`]};}
  if(L===2){const A=R(11,99),B=R(101,999),a=(A/10).toFixed(1),b=(B/100).toFixed(2),s=A*10+B,ans=(s/100).toFixed(2);
    return{text:`<span class="big">${a} + ${b} = ${BOX}</span>`,...mc(ans,[((A+B)/100).toFixed(2),((s+10)/100).toFixed(2),((s-10)/100).toFixed(2),(s/10).toFixed(1)]),
      hint:`Line up the decimal points. You can write ${a} as ${a}0.`,
      steps:[`Line up the decimal points. ${a} is the same as ${a}0.`,vsum(a+'0','+',b),`Add as usual and keep the point in line: <b>${ans}</b>`]};}
  const a=R(3,8),b=R(1,9),c=R(1,9),nums=[`0.${a}`,`0.${a-1}${b}${c}`,`0.0${a}${b}`,`0.${a-1}${b}`,`0.${a-1}0${b}`],big=Math.random()<.5,ans=big?nums[0]:nums[2];
  const p3=x=>x.padEnd(5,'0'),sorted=nums.slice().sort((x,y)=>big?(+y)-(+x):(+x)-(+y));
  return{text:`Which decimal is the <b>${big?'largest':'smallest'}</b>?`,...mc(ans,nums.filter(x=>x!==ans)),hint:`Give every number the same number of decimal places, then compare.`,
    steps:[`Write each with 3 decimal places: ${nums.map(p3).join(', ')}`,`Now compare them like whole numbers: ${sorted.map(p3).join(' > ').replace(/>/g,big?'>':'<')}`,`Answer: <b>${ans}</b>`]};
}
function gCompareFrac(L){
  if(L===1){const d=R(6,12),ns=shuffle(Array.from({length:d-1},(_,i)=>i+1)).slice(0,5),big=Math.random()<.6,ans=big?Math.max(...ns):Math.min(...ns);
    return{text:`Which fraction is the <b>${big?'largest':'smallest'}</b>?`,...mc(`${ans}/${d}`,ns.filter(n=>n!==ans).map(n=>`${n}/${d}`),fracFmt),
      hint:`The bottom numbers are the same, so the parts are the same size. Compare the top numbers.`,
      steps:[`All the fractions are ${d}ths, so every part is the same size.`,`The ${big?'most':'fewest'} parts is ${ans}.`,`Answer: ${F(ans,d)}`]};}
  if(L===2){const ds=shuffle([2,3,4,5,6,8,10,12]).slice(0,5),big=Math.random()<.6,ans=big?Math.min(...ds):Math.max(...ds);
    return{text:`Which fraction is the <b>${big?'largest':'smallest'}</b>?`,...mc(`1/${ans}`,ds.filter(x=>x!==ans).map(x=>`1/${x}`),fracFmt),
      hint:`Would you rather have one slice of a pizza cut into 2, or one slice of a pizza cut into 8?`,
      steps:[`Each fraction is one piece of a whole.`,`The more pieces a whole is cut into, the <b>smaller</b> each piece is.`,`So the ${big?'largest':'smallest'} is ${F(1,ans)}`]};}
  const pool=[];for(const d of[2,3,4,6,8,12])for(let n=1;n<d;n++)if(gcd(n,d)===1)pool.push([n,d]);
  const pk=shuffle(pool).slice(0,5),vals=pk.map(([n,d])=>n*24/d),big=Math.random()<.5,tg=big?Math.max(...vals):Math.min(...vals),[an,ad]=pk[vals.indexOf(tg)];
  return{text:`Which fraction is the <b>${big?'largest':'smallest'}</b>?`,...mc(`${an}/${ad}`,pk.filter(([n,d])=>!(n===an&&d===ad)).map(([n,d])=>`${n}/${d}`),fracFmt),
    hint:`Change them all into 24ths so you can compare.`,
    steps:[`Change each fraction into 24ths:`,pk.map(([n,d])=>`${F(n,d)} = ${F(n*24/d,24)}`).join('&ensp;'),`The ${big?'largest':'smallest'} is ${F(tg,24)}, which is ${F(an,ad)}`]};
}
