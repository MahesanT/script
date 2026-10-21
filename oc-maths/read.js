// Reading (OC paper 1): passage-based questions in the official five-part layout.
// Texts live in read-p*.js; this file turns each part into ordinary question objects with a `passage`.
const READING=[];
const RPARTS=[
  {id:'rnarr',type:'narr',name:'Story questions',glyph:'¶',tone:'a'},
  {id:'rcloze',type:'cloze',name:'Choose the right word',glyph:'_ _',tone:'b'},
  {id:'rpoem',type:'poem',name:'Poetry',glyph:'♪',tone:'d'},
  {id:'rgap',type:'gap',name:'Missing sentences',glyph:'[ ]',tone:'c'},
  {id:'rext',type:'extract',name:'Matching extracts',glyph:'A–D',tone:'e'},
];
RPARTS.forEach(t=>{t.strand='Reading';t.gens=[];TOPIC[t.id]=t;});
const rPara=s=>s.trim().split(/\n\s*\n/).map(x=>`<p>${x.trim()}</p>`).join('');
const rGaps=(s,cur)=>s.replace(/\{(\d+)\}/g,(_,n)=>`<span class="gap${+n===cur?' cur':''}">(${n}) ……</span>`);
// Shuffle the options for multiple-choice parts so the answer isn't always in the same position.
function mixed(q){const idx=shuffle(q.choices.map((_,i)=>i));return{...q,choices:idx.map(i=>q.choices[i]),answer:idx.indexOf(q.answer)};}
function partQs(part,pid){return partQsRaw(part,pid).map(q=>part.type==='gap'||part.type==='extract'?q:mixed(q));}
function partQsRaw(part,pid){
  const id=RPARTS.find(r=>r.type===part.type).id,base={topic:id,level:0,gen:`${pid}:${part.type}`},head=`<h4>${part.title}</h4>`;
  if(part.type==='narr'||part.type==='poem'){
    const body=head+(part.type==='poem'?`<div class="poem">${part.passage.trim().split(/\n\s*\n/).map(v=>`<p>${v.trim().replace(/\n/g,'<br>')}</p>`).join('')}</div>`:rPara(part.passage));
    return part.qs.map(q=>({...base,passage:body,text:q.q,choices:q.o,answer:q.a,hint:q.h,steps:[q.e]}));}
  if(part.type==='cloze')return part.qs.map(q=>({...base,passage:head+rPara(rGaps(part.passage,q.n)),text:`Which word best fits gap <b>(${q.n})</b>?`,choices:q.o,answer:q.a,
    hint:'Read the whole sentence with each word in the gap. Only one fits both the meaning and the way the sentence is built.',steps:[q.e]}));
  if(part.type==='gap'){const L=Object.keys(part.sentences);
    return Object.keys(part.key).map(n=>({...base,passage:head+rPara(rGaps(part.passage,+n)),text:`Six sentences have been removed from the text. Which sentence best fits gap <b>(${n})</b>? There is one extra sentence you do not need.`,
      choices:L.map(k=>part.sentences[k]),answer:L.indexOf(part.key[n]),hint:'Read the sentences just before and after the gap. Look for linking words such as this, these, there, he, she, they or however.',steps:[part.ex[n]]}));}
  const body=head+['A','B','C','D'].map(k=>`<h5>Extract ${k}</h5>${rPara(part.extracts[k])}`).join('');
  return part.qs.map(q=>({...base,passage:body,text:`Which extract ${q.q}`,choices:['Extract A','Extract B','Extract C','Extract D'],answer:'ABCD'.indexOf(q.a),
    hint:'Skim all four extracts for the main idea in the question. More than one may look close, so check the exact words.',steps:[q.e]}));
}
const paperQs=p=>p.parts.flatMap(pt=>partQs(pt,p.id));
// Rotate through the texts so she sees the least-used one next.
function pickPart(type){
  const all=shuffle(READING.flatMap(p=>p.parts.filter(x=>x.type===type).map(x=>({p,x})))).sort((a,b)=>(P.readSeen[a.p.id+type]||0)-(P.readSeen[b.p.id+type]||0)),c=all[0];
  P.readSeen[c.p.id+type]=(P.readSeen[c.p.id+type]||0)+1;save();return partQs(c.x,c.p.id);
}
function pickPaper(){
  const p=shuffle(READING).sort((a,b)=>(P.readSeen[a.id]||0)-(P.readSeen[b.id]||0))[0];
  P.readSeen[p.id]=(P.readSeen[p.id]||0)+1;save();return paperQs(p);
}
