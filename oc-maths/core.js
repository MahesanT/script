// Helpers, multiple-choice builder and SVG drawings shared by all question generators.
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
// Australian convention: no separator for 4 digits, a thin space from 5 digits (10 000).
const fmt=n=>{if(typeof n!=='number')return n;if(!Number.isInteger(n))return String(+n.toFixed(4));const s=String(Math.abs(n));const g=s.length<=4?s:s.replace(/\B(?=(\d{3})+(?!\d))/g,' ');return(n<0?'−':'')+g;};
const F=(n,d)=>`<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const fracFmt=s=>{const[x,y]=String(s).split('/');return F(x,y);};
const BOX='<span class="box" aria-label="missing number"></span>';
const money=c=>'$'+(c/100).toFixed(2);
const pad=m=>String(m).padStart(2,'0');
const cap=s=>s[0].toUpperCase()+s.slice(1);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const PLACES=['ones','tens','hundreds','thousands','ten thousands','hundred thousands','millions'];
const PL_ABBR=['O','T','H','Th','TTh','HTh','M'];
const NAMES=['Aisha','Ben','Chloe','Dev','Ella','Finn','Grace','Hiro','Isla','Jack','Kiara','Leo','Mia','Noah','Priya','Sam','Zara','Oscar','Lily','Ravi'];
const twoNames=()=>{const s=shuffle(NAMES);return[s[0],s[1]];};

function fmtTime(t){t=((t%1440)+1440)%1440;const h=Math.floor(t/60),m=t%60;return`${h%12||12}:${pad(m)} ${h<12?'am':'pm'}`;}
function durStr(d){const h=Math.floor(d/60),m=d%60;return[h?`${h} h`:'',m?`${m} min`:''].filter(Boolean).join(' ')||'0 min';}

function placeTable(num){const ds=String(num).split('');const n=ds.length;
  return`<table class="pt"><tr>${ds.map((_,i)=>`<th>${PL_ABBR[n-1-i]}</th>`).join('')}</tr><tr>${ds.map(d=>`<td>${d}</td>`).join('')}</tr></table>`;}

// Number of options per question: 5 (A–E) on the OC maths paper, 4 on Thinking Skills. makeQ sets it.
let MC_N=5;
// Build MC_N unique options. Numbers: no negatives, no fractions when the answer is whole.
function mc(ans,wrong,f){
  f=f||(v=>typeof v==='number'?fmt(v):String(v));
  const isNum=typeof ans==='number',isInt=isNum&&Number.isInteger(ans);
  const seen=new Set([String(ans)]),out=[];
  const ok=w=>{if(w==null)return false;if(typeof w==='number'){if(!isFinite(w)||w<0)return false;if(isInt&&!Number.isInteger(w))return false;}return!seen.has(String(w));};
  for(const w of wrong){if(out.length>=MC_N-1)break;if(ok(w)){seen.add(String(w));out.push(w);}}
  let g=0;
  while(isNum&&out.length<MC_N-1&&g++<300){
    const step=isInt?Math.max(1,Math.round(Math.abs(ans)/10)):0.1;
    let w=ans+(Math.random()<.5?-1:1)*R(1,4)*step;if(!isInt)w=+w.toFixed(2);
    if(ok(w)){seen.add(String(w));out.push(w);}
  }
  const all=shuffle([ans,...out]);
  return{choices:all.map(f),answer:all.findIndex(v=>String(v)===String(ans))};
}

// ---------- SVG drawings (all colours come from CSS classes so both themes work) ----------
const n1=v=>(+v).toFixed(1);
function rectSVG(w,h,o={}){
  const s=Math.min(220/w,130/h),W=w*s,H=h*s,ox=60,oy=16;
  let g=`<rect class="sv-shape" x="${ox}" y="${oy}" width="${n1(W)}" height="${n1(H)}"/>`;
  if(o.grid){for(let i=1;i<w;i++)g+=`<line class="sv-grid" x1="${n1(ox+i*s)}" y1="${oy}" x2="${n1(ox+i*s)}" y2="${n1(oy+H)}"/>`;
    for(let j=1;j<h;j++)g+=`<line class="sv-grid" x1="${ox}" y1="${n1(oy+j*s)}" x2="${n1(ox+W)}" y2="${n1(oy+j*s)}"/>`;}
  if(o.bottom)g+=`<text class="sv-label" x="${n1(ox+W/2)}" y="${n1(oy+H+24)}" text-anchor="middle">${o.bottom}</text>`;
  if(o.left)g+=`<text class="sv-label" x="${ox-10}" y="${n1(oy+H/2+5)}" text-anchor="end">${o.left}</text>`;
  return`<svg class="viz" viewBox="0 0 ${n1(ox+W+24)} ${n1(oy+H+36)}" width="${n1(ox+W+24)}" role="img" aria-label="Rectangle">${g}</svg>`;
}
function lshapeSVG(W,H,cw,ch){
  const s=Math.min(200/W,140/H),ox=64,oy=26,X=v=>n1(ox+v*s),Y=v=>n1(oy+v*s);
  const pts=[[0,0],[W-cw,0],[W-cw,ch],[W,ch],[W,H],[0,H]].map(([x,y])=>`${X(x)},${Y(y)}`).join(' ');
  return`<svg class="viz" viewBox="0 0 ${n1(ox+W*s+72)} ${n1(oy+H*s+36)}" width="${n1(ox+W*s+72)}" role="img" aria-label="L-shaped figure">
  <polygon class="sv-shape" points="${pts}"/>
  <text class="sv-label" x="${X((W-cw)/2)}" y="${n1(oy-8)}" text-anchor="middle">${W-cw} cm</text>
  <text class="sv-label" x="${n1(ox+W*s+8)}" y="${n1(+Y((ch+H)/2)+5)}">${H-ch} cm</text>
  <text class="sv-label" x="${X(W/2)}" y="${n1(oy+H*s+24)}" text-anchor="middle">${W} cm</text>
  <text class="sv-label" x="${ox-10}" y="${n1(+Y(H/2)+5)}" text-anchor="end">${H} cm</text></svg>`;
}
function gridSVG(rows,cols,shaded){
  const cw=Math.min(52,300/cols),ch=rows===1?54:44;let g='';
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c;g+=`<rect class="${shaded.has(i)?'sv-on':'sv-off'}" x="${n1(2+c*cw)}" y="${2+r*ch}" width="${n1(cw)}" height="${ch}"/>`;}
  return`<svg class="viz" viewBox="0 0 ${n1(cols*cw+4)} ${rows*ch+4}" width="${n1(cols*cw+4)}" role="img" aria-label="Shaded fraction diagram">${g}</svg>`;
}
function prismSVG(l,w,h){
  const a=24,c=a*Math.cos(Math.PI/6),s=a/2,P=(x,y,z)=>[(x-y)*c,(x+y)*s-z*a];
  const cs=[[0,0,0],[l,0,0],[0,w,0],[l,w,0],[0,0,h],[l,0,h],[0,w,h],[l,w,h]].map(p=>P(...p));
  const xs=cs.map(p=>p[0]),ys=cs.map(p=>p[1]);
  const minX=Math.min(...xs)-4,minY=Math.min(...ys)-4,W=Math.max(...xs)-minX+4,H=Math.max(...ys)-minY+4;
  const cubes=[];for(let x=0;x<l;x++)for(let y=0;y<w;y++)for(let z=0;z<h;z++)cubes.push([x,y,z]);
  cubes.sort((A,B)=>(A[0]+A[1]+A[2])-(B[0]+B[1]+B[2])||A[2]-B[2]);
  const poly=(pts,cls)=>`<polygon class="${cls}" points="${pts.map(p=>P(...p).map(n1).join(',')).join(' ')}"/>`;
  let g='';for(const[x,y,z]of cubes)g+=poly([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],'cube-t')+poly([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],'cube-r')+poly([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],'cube-l');
  return`<svg class="viz" viewBox="${n1(minX)} ${n1(minY)} ${n1(W)} ${n1(H)}" width="${Math.round(Math.min(320,W*1.25))}" role="img" aria-label="Prism made of cubes">${g}</svg>`;
}
function clockSVG(h,m){
  const cx=90,cy=90,r=82;let g=`<circle class="sv-face" cx="${cx}" cy="${cy}" r="${r}"/>`;
  for(let i=0;i<60;i++){const an=i*6*Math.PI/180,r1=i%5?r-7:r-13;
    g+=`<line class="sv-tick${i%5?'':' major'}" x1="${n1(cx+r1*Math.sin(an))}" y1="${n1(cy-r1*Math.cos(an))}" x2="${n1(cx+(r-3)*Math.sin(an))}" y2="${n1(cy-(r-3)*Math.cos(an))}"/>`;}
  for(let i=1;i<=12;i++){const an=i*30*Math.PI/180;g+=`<text class="sv-num" x="${n1(cx+(r-26)*Math.sin(an))}" y="${n1(cy-(r-26)*Math.cos(an))}">${i}</text>`;}
  const ha=((h%12)+m/60)*30*Math.PI/180,ma=m*6*Math.PI/180;
  g+=`<line class="sv-hour" x1="${cx}" y1="${cy}" x2="${n1(cx+40*Math.sin(ha))}" y2="${n1(cy-40*Math.cos(ha))}"/>`;
  g+=`<line class="sv-min" x1="${cx}" y1="${cy}" x2="${n1(cx+64*Math.sin(ma))}" y2="${n1(cy-64*Math.cos(ma))}"/>`;
  return`<svg class="viz" viewBox="0 0 180 180" width="200" role="img" aria-label="Analogue clock">${g}<circle class="sv-pin" cx="${cx}" cy="${cy}" r="5"/></svg>`;
}
function angleSVG(deg){
  const cx=130,cy=120,L=100,r=30,rad=deg*Math.PI/180,x2=cx+L*Math.cos(rad),y2=cy-L*Math.sin(rad);
  let mark;
  if(deg===90)mark=`<path class="sv-arc" d="M${cx+20} ${cy} L${cx+20} ${cy-20} L${cx} ${cy-20}"/>`;
  else{const ex=cx+r*Math.cos(rad),ey=cy-r*Math.sin(rad);mark=`<path class="sv-arc" d="M${cx+r} ${cy} A${r} ${r} 0 ${deg>180?1:0} 0 ${n1(ex)} ${n1(ey)}"/>`;}
  const H=deg>180?235:135;
  return`<svg class="viz" viewBox="0 0 260 ${H}" width="240" role="img" aria-label="Angle"><line class="sv-arm" x1="${cx}" y1="${cy}" x2="${cx+L}" y2="${cy}"/><line class="sv-arm" x1="${cx}" y1="${cy}" x2="${n1(x2)}" y2="${n1(y2)}"/>${mark}<circle class="sv-pin" cx="${cx}" cy="${cy}" r="4"/></svg>`;
}
function compassSVG(eight){
  const c=95;let g=`<circle class="sv-ring" cx="${c}" cy="${c}" r="58"/>`;
  const D=eight?['N','NE','E','SE','S','SW','W','NW']:['N','E','S','W'];
  D.forEach((d,i)=>{const an=i*(360/D.length)*Math.PI/180,big=d.length===1,rr=big?78:72;
    g+=`<line class="sv-axis" x1="${c}" y1="${c}" x2="${n1(c+58*Math.sin(an))}" y2="${n1(c-58*Math.cos(an))}"/>`;
    g+=`<text class="sv-num${big?'':' small'}" x="${n1(c+rr*Math.sin(an))}" y="${n1(c-rr*Math.cos(an))}">${d}</text>`;});
  return`<svg class="viz" viewBox="0 0 190 190" width="180" role="img" aria-label="Compass">${g}<circle class="sv-pin" cx="${c}" cy="${c}" r="4"/></svg>`;
}
function barSVG(cats,vals,tick,labelEvery){
  const W=340,H=230,ml=40,mb=44,mt=14,mr=10,maxV=Math.ceil(Math.max(...vals)/labelEvery)*labelEvery;
  const ph=H-mt-mb,pw=W-ml-mr,y=v=>mt+ph-(v/maxV)*ph;let g='';
  for(let v=0;v<=maxV;v+=tick){g+=`<line class="sv-gridline" x1="${ml}" y1="${n1(y(v))}" x2="${W-mr}" y2="${n1(y(v))}"/>`;
    if(v%labelEvery===0)g+=`<text class="sv-tick-label" x="${ml-6}" y="${n1(y(v)+4)}" text-anchor="end">${v}</text>`;}
  const slot=pw/cats.length,bw=slot*.58;
  cats.forEach((c,i)=>{const x=ml+slot*i+(slot-bw)/2;g+=`<rect class="sv-bar" x="${n1(x)}" y="${n1(y(vals[i]))}" width="${n1(bw)}" height="${n1(y(0)-y(vals[i]))}"/>`;
    g+=`<text class="sv-cat" x="${n1(x+bw/2)}" y="${H-mb+18}" text-anchor="middle">${c}</text>`;});
  g+=`<line class="sv-axis" x1="${ml}" y1="${mt}" x2="${ml}" y2="${n1(y(0))}"/><line class="sv-axis" x1="${ml}" y1="${n1(y(0))}" x2="${W-mr}" y2="${n1(y(0))}"/>`;
  return`<svg class="viz wide" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Column graph">${g}</svg>`;
}
function marblesSVG(counts){
  const all=[];counts.forEach(c=>{for(let i=0;i<c.n;i++)all.push(c.col);});const list=shuffle(all);
  const per=Math.min(8,Math.ceil(Math.sqrt(list.length*1.8))),gap=28,rows=Math.ceil(list.length/per),W=per*gap+28,H=rows*gap+28;
  let g=`<rect class="sv-jar" x="2" y="2" width="${W-4}" height="${H-4}" rx="18"/>`;
  list.forEach((col,i)=>{g+=`<circle class="m-${col}" cx="${14+(i%per)*gap+gap/2}" cy="${14+Math.floor(i/per)*gap+gap/2}" r="11"/>`;});
  return`<svg class="viz" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Bag of marbles">${g}</svg>`;
}
function sticksSVG(kind){
  const s=32,top=kind==='houses'?34:14,hh=28;let g='',x0=12;
  const seg=(a,b,c,d)=>{const dx=c-a,dy=d-b,L=Math.hypot(dx,dy),ux=dx/L*3,uy=dy/L*3;
    return`<line class="sv-stick" x1="${n1(a+ux)}" y1="${n1(b+uy)}" x2="${n1(c-ux)}" y2="${n1(d-uy)}"/><circle class="sv-head" cx="${n1(c-ux)}" cy="${n1(d-uy)}" r="3.4"/>`;};
  for(const n of[1,2,3]){let wdt;
    if(kind==='triangles'){const Z=[];for(let k=0;k<n+2;k++)Z.push(k%2===0?[x0+(k/2)*s,top+hh]:[x0+((k-1)/2)*s+s/2,top]);
      for(let i=0;i<=n;i++)g+=seg(...Z[i],...Z[i+1]);for(let i=0;i<n;i++)g+=seg(...Z[i],...Z[i+2]);wdt=Math.max(...Z.map(p=>p[0]))-x0;}
    else{for(let i=0;i<n;i++){g+=seg(x0+i*s,top,x0+(i+1)*s,top)+seg(x0+i*s,top+s,x0+(i+1)*s,top+s);
        if(kind==='houses')g+=seg(x0+i*s,top,x0+i*s+s/2,top-24)+seg(x0+i*s+s/2,top-24,x0+(i+1)*s,top);}
      for(let i=0;i<=n;i++)g+=seg(x0+i*s,top,x0+i*s,top+s);wdt=n*s;}
    g+=`<text class="sv-cat" x="${n1(x0+wdt/2)}" y="${top+s+22}" text-anchor="middle">Pattern ${n}</text>`;x0+=wdt+34;}
  return`<svg class="viz wide" viewBox="0 0 ${n1(x0)} ${top+s+30}" width="${n1(x0)}" role="img" aria-label="Matchstick patterns 1 to 3">${g}</svg>`;
}
