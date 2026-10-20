// Patterns & algebra, measurement, time and money.
function gSequences(L){
  const kind=L===1?'add':L===2?pick(['sub','add','double']):pick(['grow','square','fib','alt']);
  let t,next,rule,how,wrong;
  const jumps=a=>a.slice(1).map((v,i)=>{const d=v-a[i];return d>=0?`+${d}`:`−${-d}`;}).join(', ');
  if(kind==='add'){const s=R(1,L===1?20:50),k=L===1?R(2,10):R(11,25);t=[0,1,2,3].map(i=>s+i*k);next=s+4*k;rule=`Each number is <b>${k} more</b> than the one before.`;how=`${t[3]} + ${k} = ${next}`;wrong=[next+1,next-1,next+k,t[3]+k-1];}
  else if(kind==='sub'){const k=R(3,12),s=R(5*k+5,5*k+80);t=[0,1,2,3].map(i=>s-i*k);next=s-4*k;rule=`Each number is <b>${k} less</b> than the one before.`;how=`${t[3]} − ${k} = ${next}`;wrong=[next+1,next-1,next-k,t[3]+k];}
  else if(kind==='double'){const s=R(1,6);t=[0,1,2,3].map(i=>s*2**i);next=s*16;rule=`Each number is <b>double</b> the one before.`;how=`${t[3]} × 2 = ${next}`;wrong=[t[3]+(t[3]-t[2]),next+2,next-2,t[3]+2];}
  else if(kind==='grow'){const s=R(1,10),d0=R(1,4),inc=R(1,2);t=[s];for(let i=0;i<3;i++)t.push(t[i]+d0+i*inc);const nd=d0+3*inc;next=t[3]+nd;rule=`The jumps get <b>${inc} bigger</b> each time.`;how=`The next jump is +${nd}: ${t[3]} + ${nd} = ${next}`;wrong=[t[3]+nd-inc,next+inc,next-1,next+1];}
  else if(kind==='square'){const m=R(1,5);t=[0,1,2,3].map(i=>(m+i)**2);next=(m+4)**2;rule=`These are <b>square numbers</b>: ${t.map((v,i)=>`${m+i}×${m+i}`).join(', ')}.`;how=`${m+4} × ${m+4} = ${next}`;wrong=[t[3]+(t[3]-t[2]),next+1,next-1,t[3]+m+4];}
  else if(kind==='fib'){const a=R(1,5),b=R(a,a+5);t=[a,b,a+b,a+2*b];next=2*a+3*b;rule=`Each number is the <b>sum of the two before it</b>.`;how=`${t[2]} + ${t[3]} = ${next}`;wrong=[t[3]+(t[3]-t[2]),next+1,t[3]*2,next-1];}
  else{const s=R(10,30),a=R(5,12),b=R(1,a-1);t=[s,s+a,s+a-b,s+2*a-b];next=s+2*a-2*b;rule=`The pattern goes <b>+${a}, then −${b}</b>, over and over.`;how=`It's a −${b} turn: ${t[3]} − ${b} = ${next}`;wrong=[t[3]+a,next+1,next-1,t[3]-a];}
  return{text:`What number comes next?<br><span class="big seq">${t.join(', ')}, ${BOX}</span>`,...mc(next,wrong),
    hint:`Look at how much each number changes by. Is the jump the same every time?`,steps:[`Look at the jumps: ${jumps(t)}`,rule,`Next: ${how}`,`Answer: <b>${next}</b>`]};
}
function gMissingOp(L){
  if(L===1){const k=R(3,9),x=R(2,10),sub=Math.random()<.5;
    if(sub){const b=R(5,40),r=x*k;return{text:`<span class="big">${BOX} − ${b} = ${r}</span>`,...mc(r+b,[r-b,r+b+10,r+b-1,r]),hint:`Undo the subtraction by adding ${b}.`,steps:[`The opposite of subtracting ${b} is adding ${b}.`,`${r} + ${b} = <b>${r+b}</b>`]};}
    return{text:`<span class="big">${BOX} × ${k} = ${x*k}</span>`,...mc(x,[x+1,x-1,x*k-k,k]),hint:`Think about the ${k} times table.`,steps:[`What times ${k} makes ${x*k}?`,`${x} × ${k} = ${x*k}, so the answer is <b>${x}</b>.`]};}
  const x=R(2,12);
  if(L===2){const a=R(2,6),b=R(1,15),r=a*x+b;
    return{text:`<span class="big">${a} × ${BOX} + ${b} = ${r}</span>`,...mc(x,[(r+b)/a,r-b,Math.floor(r/a),x+1,x-1]),hint:`Work backwards. First undo the + ${b}.`,
      steps:[`Undo + ${b}: ${r} − ${b} = ${r-b}`,`Now ${a} × ${BOX} = ${r-b}, so ${BOX} = ${r-b} ÷ ${a} = ${x}`,`Check: ${a} × ${x} + ${b} = ${r} ✓`]};}
  if(Math.random()<.5){const b=R(2,9),a=R(2,6),y=R(b+1,b+12),r=(y-b)*a;
    return{text:`<span class="big">(${BOX} − ${b}) × ${a} = ${r}</span>`,...mc(y,[y-b,r/a-b,y+1,r-b]),hint:`Work backwards: first undo the × ${a}.`,
      steps:[`Undo × ${a}: ${r} ÷ ${a} = ${r/a}`,`So ${BOX} − ${b} = ${r/a}. Undo − ${b}: ${r/a} + ${b} = ${y}`,`Check: (${y} − ${b}) × ${a} = ${r} ✓`]};}
  const b=R(2,20),r=3*x+b;
  return{text:`<span class="big">${BOX} + ${BOX} + ${BOX} + ${b} = ${r}</span><br>Each box is the same number. What is it?`,...mc(x,[(r-b)/2,r-b,x+1,x-1,Math.floor(r/3)]),
    hint:`Three boxes plus ${b} makes ${r}. What do the three boxes make on their own?`,steps:[`Take away ${b}: ${r} − ${b} = ${r-b}`,`Three equal boxes make ${r-b}, so one box is ${r-b} ÷ 3 = ${x}`,`Check: ${x} + ${x} + ${x} + ${b} = ${r} ✓`]};
}
function gIoRule(L){
  let a,b;if(L===1){if(Math.random()<.5){a=1;b=R(3,15);}else{a=R(2,9);b=0;}}else{a=R(2,6);b=R(-5,9);if(b===0)b=3;}
  const f=x=>a*x+b,rs=(a,b)=>(a===1?'':`× ${a}`)+(b?`${a===1?'':' then '}${b>0?'+':'−'} ${Math.abs(b)}`:'');
  const pool=b<0?[3,4,5,6,7,8,10]:[1,2,3,4,5,6,7,8,10],ins=shuffle(pool).slice(0,L===3?4:3).sort((p,q)=>p-q);
  const ap=x=>a===1?`${x} ${b>0?'+':'−'} ${Math.abs(b)} = ${f(x)}`:b===0?`${x} × ${a} = ${f(x)}`:`${x} × ${a} = ${a*x}, then ${b>0?'+':'−'} ${Math.abs(b)} = ${f(x)}`;
  const tbl=rows=>`<table class="io"><tr><th>In</th>${rows.map(r=>`<td>${r[0]}</td>`).join('')}</tr><tr><th>Out</th>${rows.map(r=>`<td>${r[1]}</td>`).join('')}</tr></table>`;
  if(L<3){const tst=R(11,L===1?15:20),ans=f(tst);
    return{text:`The machine uses the same rule every time. What comes out when <b>${tst}</b> goes in?`,visual:tbl([...ins.map(x=>[x,f(x)]),[tst,'?']]),
      ...mc(ans,[ans+a,ans-a,tst+(f(ins[0])-ins[0]),ans+1]),hint:`Look at how each input changes into its output. Adding, multiplying, or both?`,
      steps:[...ins.map(x=>`Check: ${ap(x)} ✓`),`The rule is <b>${rs(a,b)}</b>.`,`${ap(tst)}`,`Answer: <b>${ans}</b>`]};}
  const i0=ins[0],o0=f(i0),cands=[[1,o0-i0],[a+1,o0-(a+1)*i0],[a-1,o0-(a-1)*i0],[a,b+1],[a,b-1],[a+2,o0-(a+2)*i0]].filter(([p,q])=>p>=1&&!(p===1&&q===0)&&!(p===a&&q===b)).map(([p,q])=>rs(p,q));
  return{text:`Which rule changes every <b>In</b> number into its <b>Out</b> number?`,visual:tbl(ins.map(x=>[x,f(x)])),...mc(rs(a,b),cands),
    hint:`Test each rule on every column, not just the first one.`,steps:[...ins.map(x=>`${ap(x)} ✓`),`The rule <b>${rs(a,b)}</b> works for every column. Other rules only work for some.`]};
}
function gPerimeter(L){
  const cm=v=>`${v} cm`;
  if(L===1){const w=R(3,12),h=R(2,9),P=2*(w+h);
    return{text:`What is the perimeter of this rectangle?`,visual:rectSVG(w,h,{bottom:cm(w),left:cm(h)}),...mc(P,[w+h,w*h,2*w+h,P+2],cm),
      hint:`Perimeter is the distance all the way around. A rectangle has 4 sides.`,steps:[`The four sides are ${w}, ${h}, ${w} and ${h} cm.`,`${w} + ${h} + ${w} + ${h} = <b>${P} cm</b>`]};}
  if(L===2){const[nm,n]=pick([['square',4],['regular pentagon',5],['regular hexagon',6],['regular octagon',8],['equilateral triangle',3]]),s=R(3,15),P=n*s;
    return{text:`A <b>${nm}</b> has sides of <b>${s} cm</b>. What is its perimeter?`,...mc(P,[s*(n-1),s*(n+1),s+n,P+2*s],cm),hint:`How many sides does a ${nm} have? They are all the same length.`,
      steps:[`A ${nm} has <b>${n}</b> equal sides.`,`${n} × ${s} = <b>${P} cm</b>`]};}
  const w=R(4,15),h=R(2,w-1),P=2*(w+h);
  return{text:`A rectangle has a perimeter of <b>${P} cm</b>. Its length is <b>${w} cm</b>. What is its width?`,visual:rectSVG(w,h,{bottom:cm(w),left:'?'}),
    ...mc(h,[P-w,P/2,P-2*w,h+1,P/2+w],cm),hint:`One length plus one width is half of the perimeter.`,
    steps:[`Half the perimeter is one length + one width: ${P} ÷ 2 = ${P/2} cm`,`Take away the length: ${P/2} − ${w} = <b>${h} cm</b>`,`Check: ${w} + ${h} + ${w} + ${h} = ${P} ✓`]};
}
function gArea(L){
  const sq=v=>`${v} cm²`;
  if(L===1){const w=R(3,8),h=R(2,6);
    return{text:`Each small square is 1 cm². What is the area of the rectangle?`,visual:rectSVG(w,h,{grid:true}),...mc(w*h,[2*(w+h),w+h,w*h+w,w*h-h],sq),
      hint:`Count the squares in one row, then count the rows.`,steps:[`There are ${w} squares in each row.`,`There are ${h} rows.`,`${h} × ${w} = <b>${w*h} cm²</b>`]};}
  if(L===2){const w=R(4,15),h=R(3,12);
    return{text:`What is the area of this rectangle?`,visual:rectSVG(w,h,{bottom:`${w} cm`,left:`${h} cm`}),...mc(w*h,[2*(w+h),w+h,w*h+10,(w+1)*h],sq),
      hint:`Area of a rectangle = length × width.`,steps:[`Area = length × width`,`${w} × ${h} = <b>${w*h} cm²</b>`]};}
  if(Math.random()<.5){const s=R(4,12),P=4*s;
    return{text:`A square has a perimeter of <b>${P} cm</b>. What is its area?`,...mc(s*s,[P,s*4,P*s,s*s+s,(s+1)*(s+1)],sq),hint:`Find the length of one side first.`,
      steps:[`A square has 4 equal sides: ${P} ÷ 4 = ${s} cm`,`Area = ${s} × ${s} = <b>${s*s} cm²</b>`]};}
  const w=R(3,9),h=R(4,12),A=w*h;
  return{text:`A rectangle has an area of <b>${A} cm²</b>. Its width is <b>${w} cm</b>. How long is it?`,...mc(h,[A-w,A/2,h+1,h-1,2*h],v=>`${v} cm`),hint:`Width × length = area. What times ${w} makes ${A}?`,
    steps:[`Width × length = ${A}`,`${A} ÷ ${w} = <b>${h} cm</b>`,`Check: ${w} × ${h} = ${A} ✓`]};
}
function gLShape(L){
  const W=R(6,12),H=R(5,10),cw=R(2,W-3),ch=R(2,H-3),A=W*H-cw*ch,P=2*(W+H),vis=lshapeSVG(W,H,cw,ch);
  if(L===3&&Math.random()<.5)return{text:`What is the <b>perimeter</b> of this shape? All corners are right angles.`,visual:vis,
    ...mc(P,[W+H+(W-cw)+(H-ch),P-cw,P+2*ch,A],v=>`${v} cm`),hint:`The two short sides on the top right add up to the full height and width.`,
    steps:[`The missing sides: the top edges add up to ${W} cm and the right edges add up to ${H} cm.`,`So the perimeter is the same as a ${W} × ${H} rectangle.`,`${W} + ${H} + ${W} + ${H} = <b>${P} cm</b>`]};
  return{text:`What is the <b>area</b> of this shape? All corners are right angles.`,visual:vis,...mc(A,[W*H,W*H-cw,P,A+ch,(W-cw)*(H-ch)],v=>`${v} cm²`),
    hint:`Imagine the full rectangle, then take away the missing corner.`,
    steps:[`Full rectangle: ${W} × ${H} = ${W*H} cm²`,`Missing corner is ${W} − ${W-cw} = ${cw} cm wide and ${H} − ${H-ch} = ${ch} cm tall: ${cw} × ${ch} = ${cw*ch} cm²`,`${W*H} − ${cw*ch} = <b>${A} cm²</b>`]};
}
function gConvert(L){
  const U=[['m','cm',100],['cm','mm',10],['kg','g',1000],['L','mL',1000],['km','m',1000]];
  if(L===1){const[big,small,f]=pick(U),n=R(2,9);
    return{text:`<span class="big">${n} ${big} = ${BOX} ${small}</span>`,...mc(n*f,[n*f/10,n*f*10,n+f,n*(f===10?100:10)]),hint:`1 ${big} = ${fmt(f)} ${small}.`,
      steps:[`1 ${big} = ${fmt(f)} ${small}`,`${n} × ${fmt(f)} = <b>${fmt(n*f)} ${small}</b>`]};}
  if(L===2){const[big,small,f]=pick(U.filter(u=>u[2]>=100)),n=R(1,9);
    if(Math.random()<.5){const m=f===100?R(5,95):R(1,19)*50,tot=n*f+m;
      return{text:`<span class="big">${n} ${big} ${m} ${small} = ${BOX} ${small}</span>`,...mc(tot,[+(`${n}${m}`),tot+f,n*f+m*10,n+m]),hint:`Change the ${big} into ${small} first, then add.`,
        steps:[`${n} ${big} = ${n} × ${fmt(f)} = ${fmt(n*f)} ${small}`,`${fmt(n*f)} + ${m} = <b>${fmt(tot)} ${small}</b>`]};}
    const tot=n*f+f/2;
    return{text:`<span class="big">${n}.5 ${big} = ${BOX} ${small}</span>`,...mc(tot,[n*f+5,n*f+50,n*f+f/10,tot*10]),hint:`0.5 means one half.`,
      steps:[`${n} ${big} = ${fmt(n*f)} ${small}`,`0.5 ${big} is half of ${fmt(f)}, which is ${fmt(f/2)} ${small}`,`${fmt(n*f)} + ${fmt(f/2)} = <b>${fmt(tot)} ${small}</b>`]};}
  const set=new Set();while(set.size<4)set.add(R(16,44)*5);const vals=[...set],fm=shuffle(['m','cm','mm','m']);
  const show=vals.map((v,i)=>fm[i]==='m'?`${v/100} m`:fm[i]==='cm'?`${v} cm`:`${v*10} mm`),big=Math.random()<.5,tg=big?Math.max(...vals):Math.min(...vals),ans=show[vals.indexOf(tg)];
  return{text:`Which length is the <b>${big?'longest':'shortest'}</b>?`,...mc(ans,show.filter(s=>s!==ans)),hint:`Change them all into centimetres. 1 m = 100 cm and 10 mm = 1 cm.`,
    steps:[`Change each one into cm:`,show.map((s,i)=>`${s} = ${vals[i]} cm`).join('<br>'),`The ${big?'longest':'shortest'} is ${tg} cm, which is <b>${ans}</b>`]};
}
function gVolumeCubes(L){
  if(L<3){const l=R(2,L===1?3:5),w=R(2,L===1?3:4),h=R(1,L===1?2:4),V=l*w*h;
    return{text:`These cubes are stacked to make a rectangular prism with no gaps. How many cubes are there?`,visual:prismSVG(l,w,h),
      ...mc(V,[l*w+w*h+l*h,h>1?l*w*(h-1):V+l,V+l*w,l*w,V-w]),hint:`Count the cubes in the top layer, then count the layers.`,
      steps:[`The top layer is ${l} by ${w}: ${l} × ${w} = ${l*w} cubes.`,`There ${h>1?`are ${h} layers`:'is 1 layer'}.`,`${l*w} × ${h} = <b>${V}</b> cubes. Some are hidden at the back, but they still count.`]};}
  if(Math.random()<.5){const l=R(4,10),w=R(3,6),h=R(2,5),V=l*w*h;
    return{text:`A box is <b>${l} cm</b> long, <b>${w} cm</b> wide and <b>${h} cm</b> high. How many 1 cm cubes fill it?`,...mc(V,[l+w+h,l*w,2*(l*w+w*h+l*h),V+l*w]),
      hint:`Work out how many cubes cover the bottom, then how many layers.`,steps:[`Bottom layer: ${l} × ${w} = ${l*w} cubes`,`${h} layers: ${l*w} × ${h} = <b>${V}</b> cubes`]};}
  const s=R(3,4),h=R(1,s-1),have=s*s*h,need=s**3;
  return{text:`Leo built this prism from cubes. How many more cubes does he need to make a big cube ${s} × ${s} × ${s}?`,visual:prismSVG(s,s,h),...mc(need-have,[need,have,s*s,need-have+s*s]),
    hint:`How many cubes are in the big cube? How many does he have already?`,steps:[`Big cube: ${s} × ${s} × ${s} = ${need} cubes`,`He has ${s} × ${s} × ${h} = ${have} cubes`,`${need} − ${have} = <b>${need-have}</b> more cubes`]};
}
function gClockRead(L){
  const h=R(1,12);let m;
  if(L===1)m=pick([0,30,0,30,15,45]);else if(L===2)m=R(0,11)*5;else{m=R(1,59);if(m%5===0)m+=R(1,4);}
  const T=(h,m)=>`${h}:${pad(m)}`,ans=T(h,m),nh=h%12+1,ph=h===1?12:h-1;
  const wrong=[m>=30?T(nh,m):T(ph,m),T(Math.round(m/5)%12||12,(h*5)%60),m%5===0&&m>5?T(h,m/5):T(h,(m+5)%60),T(h,(m+30)%60),m<30?T(nh,m):T(ph,m)];
  const mk=Math.floor(m/5),ex=m%5,steps=[`The <b>short hand</b> shows hours. It has passed ${h} but not reached ${nh}, so it's ${h}-something.`];
  if(m===0)steps.push(`The <b>long hand</b> points straight up at 12, so it's ${h} o'clock.`);
  else if(ex===0)steps.push(`The <b>long hand</b> points at the ${mk}. Count by fives: ${mk} × 5 = ${m} minutes.`);
  else steps.push(`The <b>long hand</b> is ${ex} small mark${ex>1?'s':''} past the ${mk||12}. ${mk} × 5 = ${mk*5}, then + ${ex} = ${m} minutes.`);
  steps.push(`The time is <b>${ans}</b>`);
  return{text:`What time does the clock show?`,visual:clockSVG(h,m),...mc(ans,wrong),hint:`The short hand tells the hour. The long hand tells the minutes: count by 5s for each number.`,steps};
}
function gElapsed(L){
  if(L===1){const s=R(8,15)*60+pick([0,30]),d=pick([15,30,45,60,90]),e=s+d;
    return{text:`Swimming lessons start at <b>${fmtTime(s)}</b> and last <b>${durStr(d)}</b>. What time do they finish?`,...mc(fmtTime(e),[fmtTime(e+15),fmtTime(e-15),fmtTime(e+60),fmtTime(e-60)]),
      hint:`Count on from the start time.`,steps:[`Start at ${fmtTime(s)}.`,`Count on ${durStr(d)}.`,`They finish at <b>${fmtTime(e)}</b>`]};}
  if(L===2){const s=R(96,200)*5,dh=R(1,2),dm=R(1,11)*5,d=dh*60+dm,e=s+d;
    return{text:`A movie starts at <b>${fmtTime(s)}</b> and goes for <b>${durStr(d)}</b>. What time does it finish?`,...mc(fmtTime(e),[fmtTime(e+10),fmtTime(e-10),fmtTime(e+60),fmtTime(e-60)]),
      hint:`Add the hours first, then the minutes. Remember 60 minutes make an hour.`,
      steps:[`Add the hours: ${fmtTime(s)} + ${dh} h = ${fmtTime(s+dh*60)}`,`Add the minutes: ${fmtTime(s+dh*60)} + ${dm} min = ${fmtTime(e)}${(s%60)+dm>=60?' (60 minutes roll over into the next hour)':''}`,`It finishes at <b>${fmtTime(e)}</b>`]};}
  const s=R(96,180)*5,d=R(1,3)*60+R(1,11)*5,e=s+d,naive=(Math.floor(e/60)-Math.floor(s/60))*60+Math.abs(e%60-s%60);
  const toNext=(60-s%60)%60,s1=s+toNext,hrs=Math.floor((e-s1)/60),rem=e-s1-hrs*60;
  return{text:`A train leaves at <b>${fmtTime(s)}</b> and arrives at <b>${fmtTime(e)}</b>. How long is the trip?`,...mc(durStr(d),[durStr(naive),durStr(d+5),durStr(d+60),durStr(d-60),durStr(d-5)].filter(x=>x!=='0 min')),
    hint:`Count up: first to the next o'clock, then whole hours, then the extra minutes.`,
    steps:[...(toNext?[`${fmtTime(s)} to ${fmtTime(s1)} is ${toNext} min.`]:[]),`${fmtTime(s1)} to ${fmtTime(s1+hrs*60)} is ${hrs} h.`,...(rem?[`${fmtTime(s1+hrs*60)} to ${fmtTime(e)} is ${rem} min.`]:[]),`Total: ${hrs} h + ${toNext+rem} min = <b>${durStr(d)}</b>`]};
}
function gTime24(L){
  const edge=L===3&&Math.random()<.5,t=edge?pick([0,12])*60+R(1,11)*5:R(1,23)*60+R(0,11)*5,h=Math.floor(t/60),m=t%60,s24=`${pad(h)}:${pad(m)}`;
  const rule=h===0?`Just after midnight the 24-hour clock starts at 00, so ${fmtTime(t)} is 00:${pad(m)}.`:h===12?`12 noon is 12 in both clocks.`:h>12?`For pm times after 1 pm, add 12 to the hour: ${h-12} + 12 = ${h}.`:`Morning (am) times keep the same hour.`;
  if(Math.random()<.5)return{text:`What is <b>${fmtTime(t)}</b> in 24-hour time?`,...mc(s24,[`${pad((h+12)%24)}:${pad(m)}`,`${pad(h%12)}:${pad(m)}`,`${pad((h+10)%24)}:${pad(m)}`,`${pad(h)}:${pad((m+10)%60)}`]),
    hint:`pm hours after 1 pm need 12 added.`,steps:[rule,`Answer: <b>${s24}</b>`]};
  return{text:`What is <b>${s24}</b> in 12-hour time?`,...mc(fmtTime(t),[fmtTime(t+720),fmtTime(t-600),fmtTime(t+60),fmtTime(t-120)]),hint:`If the hour is more than 12, take away 12 and it's pm.`,
    steps:[rule,`Answer: <b>${fmtTime(t)}</b>`]};
}
function gChange(L){
  const items=shuffle(['a sandwich','a juice','an apple','a muffin','a pencil case','a book','a ruler','a yo-yo','a hat','a puzzle']);
  let prices,qty=[1,1],pay;
  if(L===1){prices=[R(2,9)*100,R(2,9)*100];}else if(L===2){prices=[R(21,179)*5,R(21,179)*5];}else{prices=[R(21,99)*5,R(21,179)*5];qty=[R(2,4),1];}
  const total=prices[0]*qty[0]+prices[1]*qty[1];pay=total<1000?1000:total<2000?2000:5000;const ch=pay-total;
  const desc=prices.map((p,i)=>qty[i]>1?`<b>${qty[i]}</b> ${items[i].replace(/^an? /,'')}s at <b>${money(p)}</b> each`:`${items[i]} for <b>${money(p)}</b>`).join(' and ');
  return{text:`Ava buys ${desc}. She pays with a <b>${money(pay).replace('.00','')}</b> note. How much change should she get?`,...mc(ch,[total,ch+10,ch-10,ch+100,ch-100],money),
    hint:`Add up the cost first, then take it away from ${money(pay)}.`,
    steps:[...(qty[0]>1?[`${qty[0]} × ${money(prices[0])} = ${money(prices[0]*qty[0])}`]:[]),`Total: ${money(prices[0]*qty[0])} + ${money(prices[1])} = ${money(total)}`,`Change: ${money(pay)} − ${money(total)} = <b>${money(ch)}</b>`]};
}
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MONTHS=[['January',31],['February',28],['March',31],['April',30],['May',31],['June',30],['July',31],['August',31],['September',30],['October',31],['November',30],['December',31]];
function gCalendar(L){
  if(L===1){const i=R(0,6),n=R(2,12),ans=DAYS[(i+n)%7];
    return{text:`Today is <b>${DAYS[i]}</b>. What day will it be in <b>${n} days</b>?`,...mc(ans,shuffle(DAYS.filter(d=>d!==ans)).concat([DAYS[(i+n+1)%7]]).reverse()),
      hint:`Every 7 days it comes back to the same day.`,steps:[...(n>=7?[`In 7 days it is ${DAYS[i]} again.`,`${n} − 7 = ${n-7} more day${n-7===1?'':'s'}.`]:[`Count on ${n} days from ${DAYS[i]}.`]),`Answer: <b>${ans}</b>`]};}
  const mi=R(0,11),[mn,ml]=MONTHS[mi];
  if(L===2){const a=R(1,10),b=a+R(8,Math.min(20,ml-a)),i=R(0,6),diff=b-a,ans=DAYS[(i+diff)%7],same=[];for(let x=a;x<=b;x+=7)same.push(x);
    return{text:`If <b>${a} ${mn}</b> is a <b>${DAYS[i]}</b>, what day of the week is <b>${b} ${mn}</b>?`,...mc(ans,[DAYS[(i+diff+1)%7],DAYS[(i+diff+6)%7],DAYS[(i+diff+2)%7]]),
      hint:`Add 7 days at a time. Each jump lands on ${DAYS[i]} again.`,
      steps:[`Jump by 7s: ${same.map(x=>`${x} ${mn}`).join(', ')} are all ${DAYS[i]}s.`,`${b} is ${b-same[same.length-1]} day${b-same[same.length-1]===1?'':'s'} after ${same[same.length-1]}.`,`Answer: <b>${ans}</b>`]};}
  const[nn]=MONTHS[(mi+1)%12],a=R(ml-6,ml-1),b=R(3,15),days=(ml-a)+b;
  return{text:`Today is <b>${a} ${mn}</b>. How many days is it until <b>${b} ${nn}</b>?`,...mc(days,[days+1,days-1,(30-a)+b,(31-a)+b]),hint:`How many days does ${mn} have? Count to the end of the month first.`,
    steps:[`${mn} has ${ml} days.`,`From ${a} ${mn} to ${ml} ${mn} is ${ml} − ${a} = ${ml-a} days.`,`Then ${b} more days into ${nn}: ${ml-a} + ${b} = <b>${days}</b> days`]};
}
