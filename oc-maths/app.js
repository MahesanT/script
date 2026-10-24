// App: profile, practice sessions with locked help, OC mock test, times-table sprint, parent corner.
const KEY='ocmaths.v1';
function defaults(){return{name:'Mithila',stars:0,earned:0,topics:{},tests:[],sprintBest:0,readSeen:{},settings:{hintAfter:1,solveAfter:2,fx:1,sound:true,goal:20,voice:1,sayName:''},day:{last:'',streak:0,best:0},daily:'',log:{},badges:{},owned:[],wear:[],goalDays:0,perfect:0,bestRun:0,updatedAt:0};}
// Fill in any fields an older save is missing, so progress from earlier versions carries over.
function normaliseP(s){const d=defaults(),p=Object.assign(d,s||{});p.settings=Object.assign(defaults().settings,(s&&s.settings)||{});p.day=Object.assign(defaults().day,(s&&s.day)||{});
  for(const k of['readSeen','log','badges'])p[k]=(s&&s[k])||{};for(const k of['owned','wear','tests'])p[k]=Array.isArray(s&&s[k])?s[k]:[];
  if(!(s&&s.earned))p.earned=Math.max(p.earned||0,p.stars||0);if(p.day.best<p.day.streak)p.day.best=p.day.streak;if(!p.name)p.name='Mithila';return p;}
let P=defaults();
try{const s=JSON.parse(localStorage.getItem(KEY));if(s)P=normaliseP(s);}catch(e){}
const saveLocal=()=>{try{localStorage.setItem(KEY,JSON.stringify(P));}catch(e){}};
const save=()=>{P.updatedAt=Date.now();saveLocal();cloudSave();};
const tstat=id=>P.topics[id]||(P.topics[id]={level:1,att:0,first:0,streak:0,miss:0});
const LEVELS=['','Level 1 · Starter','Level 2 · Building','Level 3 · Exam ready'];
const today=()=>new Date().toLocaleDateString('en-CA');
function markDay(){const t=today();if(P.day.last===t)return;const y=new Date(Date.now()-864e5).toLocaleDateString('en-CA');P.day.streak=P.day.last===y?P.day.streak+1:1;P.day.last=t;P.day.best=Math.max(P.day.best||0,P.day.streak);}
const acc=s=>s.att?Math.round(100*s.first/s.att):null;
const oneCol=q=>q.choices.some(c=>c.length>40&&!c.includes('<svg'));
const mmss=s=>`${Math.floor(s/60)}:${pad(Math.floor(s%60))}`;
const paperName=t=>t==='think'?'Thinking Skills':t==='read'?'Reading':'Maths';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PRAISE=['Brilliant!','Spot on!','You nailed it!','Excellent thinking!','Correct!','Super work!'];

const app=document.getElementById('app');
let S={screen:'home'},timer=null;

// ---------- views ----------
function vHeader(){
  const inTest=S.screen==='test';
  return`<header class="top"><div class="top-in">
    <button class="brand" data-act="${inTest?'':'home'}" ${inTest?'disabled':''}><span class="mark">÷</span>OC Maths Coach</button>
    <div class="tally"><span title="Stars to spend"><b class="starcount">★ ${P.stars}</b></span><span title="Days in a row">${P.day.streak||0}-day streak</span><button class="soundbtn" data-act="sound" aria-pressed="${P.settings.sound!==false}">${P.settings.sound===false?'Sound off':'Sound on'}</button></div>
  </div></header>`;
}
function vHome(){
  const doneToday=P.daily===today();
  const tile=t=>{const s=tstat(t.id),a=acc(s);
    return`<button class="topic" data-act="topic" data-arg="${t.id}"><span class="glyph tone-${t.tone}">${t.glyph}</span>
      <span class="tinfo"><span class="tname">${t.name}${topicMedal(t)?`<span class="tile-medal" title="${topicMedal(t)} medal">${medalSVG(MEDAL_COL[topicMedal(t)],'★',22)}</span>`:''}</span><span class="tmeta">${t.strand==='Reading'?`${READING.length} texts to practise`:`${t.strand} · Level ${s.level}`}</span>
      <span class="meter" aria-label="Level ${s.level} of 3"><i style="width:${t.strand==='Reading'?(a??0):Math.round(((s.level-1)/2*70)+(a??0)*.3)}%"></i></span>
      <span class="tmeta">${a===null?'Not started':`${a}% first try · ${s.att} done`}</span></span></button>`;};
  const bestOf=type=>{const ts=P.tests.filter(t=>(t.type||'maths')===type);return ts.length?Math.max(...ts.map(t=>t.score)):null;},best=bestOf('maths'),bestT=bestOf('think'),bestR=bestOf('read');
  return`<section class="hero">
    <button class="hero-koala" data-act="poke" aria-label="Say hello to the koala">${koalaSVG(wornSVG())}</button>
    <div class="hello"><p class="eyebrow">NSW Stage 2 maths · OC test practice</p>
      <h1>${P.name?`Hi ${esc(P.name)}!`:'Hi there!'} Ready to train?</h1>
      ${P.name?'':`<form class="nameform" id="nameform"><label for="nm">What's your name?</label><input id="nm" maxlength="20" autocomplete="off"><button class="btn primary sm">Save</button></form>`}
      <p class="lede">Pick a mode. Try every question yourself first. If you get stuck, a hint unlocks, and then the full working.</p></div>
  </section>
  ${vProgressCard()}
  <section class="modes">
    <button class="mode m-daily" data-act="daily"><span class="mtag">${doneToday?'Done today ✓':'10 questions'}</span><span class="mtitle">Daily 10</span><span class="mdesc">A mix of topics, with extra practice on the ones you find hardest.</span></button>
    <button class="mode m-test" data-act="test" data-arg="maths"><span class="mtag">35 questions · 40 min</span><span class="mtitle">Maths mock test</span><span class="mdesc">Same format as the Mathematical Reasoning paper. No help until you finish.${best!==null?` Best so far: <b>${best}/35</b>.`:''}</span></button>
    <button class="mode m-sprint" data-act="sprint"><span class="mtag">60 seconds</span><span class="mtitle">Times-table sprint</span><span class="mdesc">How many facts can you answer in a minute?${P.sprintBest?` Best: <b>${P.sprintBest}</b>.`:''}</span></button>
  </section>
  <h2 class="sec">Maths topics</h2>
  <div class="topics">${TOPICS.map(tile).join('')}</div>
  <h2 class="sec">Thinking Skills</h2>
  <p class="lede sm">The OC test's Thinking Skills paper: logic puzzles, shapes in your head, codes and judging arguments.</p>
  <div class="modes two"><button class="mode m-test" data-act="test" data-arg="think"><span class="mtag">30 questions · 30 min</span><span class="mtitle">Thinking Skills mock test</span><span class="mdesc">Same format as the OC Thinking Skills paper. No help until you finish.${bestT!==null?` Best so far: <b>${bestT}/30</b>.`:''}</span></button></div>
  <div class="topics">${THINK.map(tile).join('')}</div>
  <h2 class="sec">Reading</h2>
  <p class="lede sm">The OC Reading paper has five parts: a story, a passage with missing words, a poem, an article with missing sentences, and four short extracts to match.</p>
  <div class="modes two"><button class="mode m-test" data-act="test" data-arg="read"><span class="mtag">33 answers · 40 min</span><span class="mtitle">Reading mock test</span><span class="mdesc">A full paper in the same five-part layout as the OC Reading test. No help until you finish.${bestR!==null?` Best so far: <b>${bestR}/33</b>.`:''}</span></button></div>
  <div class="topics">${RPARTS.map(tile).join('')}</div>
  <p class="foot"><button class="link" data-act="parent">Parent corner</button> · progress and settings</p>`;
}
function working(q){
  return`<section class="working" aria-label="Worked solution"><h3>How to solve it</h3><ol>${q.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    <p class="answer-line">Answer: <span>${q.choices[q.answer]}</span></p></section>`;
}
function vQuestion(){
  const q=S.q,t=TOPIC[q.topic],st=P.settings;
  const canHint=!S.done&&S.tries>=st.hintAfter&&!S.hint,canSolve=!S.done&&S.tries>=st.solveAfter;
  const ch=q.choices.map((c,i)=>{let cls='choice';if(S.wrong.includes(i))cls+=' is-wrong';if(S.done&&i===q.answer)cls+=' is-right';
    return`<button class="${cls}" data-act="choose" data-arg="${i}" ${S.done||S.wrong.includes(i)?'disabled':''}><span class="key">${'ABCDEFG'[i]}</span><span class="val">${c}</span></button>`;}).join('');
  let fb='',fc='';
  if(S.done&&!S.revealed){fb=`${S.praise} <span class="earn">+${S.earned} ★</span>`;fc='ok';}
  else if(S.revealed){fb='Read the working carefully. You\'ll be ready for the next one.';fc='info';}
  else if(S.tries>0){fc='bad';fb=canSolve?'This one is tricky. Try again, or see how to solve it.':canHint||S.hint?'Not quite. Have another go.'+(canHint?' A hint is ready if you want it.':''):'Not quite. Have another go.';}
  const helpers=[canHint?`<button class="btn ghost" data-act="hint">Show a hint</button>`:'',canSolve?`<button class="btn ghost" data-act="solve">Show me how to solve it</button>`:'',
    S.done&&!S.revealed&&!S.work?`<button class="btn ghost" data-act="work">See the working</button>`:'',
    S.done?`<button class="btn primary" data-act="next">${S.i+1>=S.n?'Finish':'Next question'} →</button>`:'',
    !S.done&&S.tries<st.hintAfter?`<span class="locked">Help unlocks if you get stuck.</span>`:''].join('');
  return`<div class="qtop"><button class="link" data-act="home">← Home</button>
    <div class="prog"><span>${S.label} · Question ${S.i+1} of ${S.n}</span><div class="bar"><i style="width:${(S.i/S.n)*100}%"></i></div></div></div>
  <article class="qcard${S.anim?' enter':''}">
    <div class="qmeta"><span class="chip tone-${t.tone}">${t.name}</span><span class="lvl">${LEVELS[q.level]}</span>${S.run>=2?`<span class="combo">${flameSVG()} ${S.run} in a row</span>`:''}</div>
    ${q.passage?`<div class="passage" tabindex="0">${q.passage}</div>`:''}<div class="qtext">${q.text}</div>${q.visual?`<div class="visual">${q.visual}</div>`:''}
    <div class="choices${oneCol(q)?' one':''}">${ch}</div>
    <div class="feedback ${fc}" role="status">${fb}</div>
    <div class="helpers">${helpers}</div>
    ${S.hint&&!S.revealed?`<div class="hint"><b>Hint</b>${q.hint}</div>`:''}
    ${S.revealed||S.work?working(q):''}
  </article>`;
}
function vSummary(){
  const r=S.results,first=r.filter(x=>x.first).length,shown=r.filter(x=>x.revealed);
  return`<section class="panel center"><p class="eyebrow">${S.label} complete</p><h1>${first>=8?'Outstanding!':first>=5?'Great effort!':'Good practice!'}</h1>
    <div class="bigstats"><div><b>${first}/${r.length}</b><span>right first try</span></div><div><b>+${S.starsEarned} ★</b><span>stars earned</span></div><div><b>${shown.length}</b><span>needed the working</span></div></div>
    ${S.levelUps.length?`<p class="levelup">Level up in ${S.levelUps.map(id=>TOPIC[id].name).join(', ')}!</p>`:''}
    <div class="row">${shown.length?`<button class="btn primary" data-act="redoShown">Try the ${shown.length} tricky one${shown.length>1?'s':''} again</button>`:''}
      <button class="btn ${shown.length?'ghost':'primary'}" data-act="again">Another round</button><button class="btn ghost" data-act="home">Home</button></div></section>`;
}
function vTest(){
  const q=S.qs[S.i],left=Math.max(0,(S.end-Date.now())/1000),ans=S.ans.filter(a=>a!==null).length;
  const ch=q.choices.map((c,i)=>`<button class="choice${S.ans[S.i]===i?' is-picked':''}" data-act="tPick" data-arg="${i}"><span class="key">${'ABCDEFG'[i]}</span><span class="val">${c}</span></button>`).join('');
  const grid=S.qs.map((_,i)=>`<button class="cell${S.ans[i]!==null?' done':''}${S.flag[i]?' flag':''}${i===S.i?' cur':''}" data-act="tGo" data-arg="${i}" aria-label="Question ${i+1}">${i+1}</button>`).join('');
  return`<div class="testbar"><div><b>${paperName(S.testType)} mock test</b><span>Question ${S.i+1} of ${S.qs.length} · ${ans} answered</span></div><div id="timer" class="timer${left<300?' low':''}">${mmss(left)}</div></div>
  <article class="qcard"><div class="qmeta"><span class="chip tone-${TOPIC[q.topic].tone}">${TOPIC[q.topic].name}</span>${S.flag[S.i]?'<span class="lvl">Flagged</span>':''}</div>
    ${q.passage?`<div class="passage" tabindex="0">${q.passage}</div>`:''}<div class="qtext">${q.text}</div>${q.visual?`<div class="visual">${q.visual}</div>`:''}<div class="choices${oneCol(q)?' one':''}">${ch}</div>
    <div class="helpers"><button class="btn ghost" data-act="tPrev" ${S.i===0?'disabled':''}>← Back</button><button class="btn ghost" data-act="tFlag">${S.flag[S.i]?'Unflag':'Flag for later'}</button>
      <button class="btn primary" data-act="tNext">${S.i===S.qs.length-1?'Review':'Next →'}</button></div></article>
  <section class="panel"><h3 class="mini">Jump to a question</h3><div class="grid35">${grid}</div>
    ${S.confirm?`<div class="confirm"><p>${S.qs.length-ans?`You have <b>${S.qs.length-ans}</b> unanswered question${S.qs.length-ans>1?'s':''}. `:''}Finish the test now?</p><div class="row"><button class="btn primary" data-act="tFinish">Yes, finish</button><button class="btn ghost" data-act="tCancel">Keep going</button></div></div>`
      :`<div class="row"><button class="btn ghost" data-act="tAsk">Finish test</button></div>`}</section>`;
}
function vResult(){
  const R0=S.res,pct=Math.round(100*R0.score/R0.total),by={};
  S.qs.forEach((q,i)=>{const b=by[q.topic]||(by[q.topic]={c:0,t:0});b.t++;if(S.ans[i]===q.answer)b.c++;});
  const verdict=pct>=85?'Excellent. That is a very strong OC-level score.':pct>=70?'Strong result. Look over the ones you missed.':pct>=50?'Getting there. Practise the topics marked below.':'Keep training. Use topic practice on the weak areas first.';
  const rows=Object.entries(by).map(([id,b])=>`<tr><td>${TOPIC[id].name}</td><td class="num">${b.c}/${b.t}</td><td><span class="pill ${b.c/b.t>=.75?'ok':b.c/b.t>=.5?'mid':'bad'}">${b.c/b.t>=.75?'Strong':b.c/b.t>=.5?'OK':'Practise'}</span></td></tr>`).join('');
  const list=S.qs.map((q,i)=>{const a=S.ans[i],st=a===null?'skip':a===q.answer?'ok':'bad',open=S.open===i;
    return`<li class="rv ${st}"><button class="rvhead" data-act="rToggle" data-arg="${i}"><span class="rvn">${i+1}</span><span class="rvt">${TOPIC[q.topic].name}</span><span class="pill ${st==='ok'?'ok':st==='bad'?'bad':'mid'}">${st==='ok'?'Correct':st==='bad'?'Wrong':'Skipped'}</span></button>
    ${open?`<div class="rvbody">${q.passage?`<div class="passage" tabindex="0">${q.passage}</div>`:''}<div class="qtext">${q.text}</div>${q.visual?`<div class="visual">${q.visual}</div>`:''}
      <div class="choices${oneCol(q)?' one':''}">${q.choices.map((c,j)=>`<div class="choice static${j===q.answer?' is-right':''}${j===a&&a!==q.answer?' is-wrong':''}"><span class="key">${'ABCDEFG'[j]}</span><span class="val">${c}</span>${j===a?'<em>your answer</em>':''}</div>`).join('')}</div>
      ${S.solved[i]?working(q):`<div class="helpers"><button class="btn ghost" data-act="rSolve" data-arg="${i}">${st==='ok'?'See the working':'Show me how to solve it'}</button></div>`}</div>`:''}</li>`;}).join('');
  const wrongN=S.qs.filter((q,i)=>S.ans[i]!==q.answer).length;
  return`<section class="panel center"><p class="eyebrow">${paperName(S.testType)} mock test result</p><h1>${R0.score} / ${R0.total}</h1><p class="lede">${pct}% · time used ${mmss(R0.secs)}. ${verdict}</p>
    <div class="row">${wrongN?`<button class="btn primary" data-act="redoTest">Practise my ${wrongN} mistake${wrongN>1?'s':''}</button>`:''}<button class="btn ghost" data-act="home">Home</button></div></section>
  <section class="panel"><h2 class="sec">By topic</h2><div class="tablewrap"><table class="tbl"><tbody>${rows}</tbody></table></div></section>
  <section class="panel"><h2 class="sec">Review every question</h2><p class="lede sm">Tap a question to see it again. Try to work out the ones you missed before opening the working.</p><ol class="rvlist">${list}</ol></section>`;
}
function vSprint(){
  const sp=S.sp;
  if(sp.phase==='setup')return`<section class="panel center"><p class="eyebrow">Times-table sprint</p><h1>60 seconds. How many can you get?</h1>
    <p class="lede">Choose the tables to practise.</p><div class="chips">${Array.from({length:11},(_,i)=>i+2).map(n=>`<button class="tchip${sp.tables.includes(n)?' on':''}" data-act="spToggle" data-arg="${n}" aria-pressed="${sp.tables.includes(n)}">${n}×</button>`).join('')}</div>
    <div class="row"><button class="btn primary" data-act="spStart" ${sp.tables.length?'':'disabled'}>Start</button><button class="btn ghost" data-act="home">Home</button></div>${P.sprintBest?`<p class="lede sm">Best score: ${P.sprintBest}</p>`:''}</section>`;
  if(sp.phase==='done')return`<section class="panel center"><p class="eyebrow">Time's up</p><h1>${sp.score} correct</h1>
    <p class="lede">${sp.newBest?'New best score!':`Best score: ${P.sprintBest}`}</p>
    ${sp.wrongs.length?`<p class="lede sm">Facts to learn:</p><div class="facts">${sp.wrongs.map(([a,b])=>`<span>${a} × ${b} = <b>${a*b}</b></span>`).join('')}</div>`:''}
    <div class="row"><button class="btn primary" data-act="spStart">Go again</button><button class="btn ghost" data-act="sprint">Change tables</button><button class="btn ghost" data-act="home">Home</button></div></section>`;
  const left=Math.max(0,(sp.end-Date.now())/1000);
  return`<section class="panel center sprint"><div class="testbar flat"><div><b>Score ${sp.score}</b></div><div id="timer" class="timer${left<10?' low':''}">${mmss(left)}</div></div>
    <div class="fact ${sp.flash?'bad':''}">${sp.flash?`${sp.a} × ${sp.b} = <b>${sp.a*sp.b}</b>`:`${sp.a} × ${sp.b} = <span class="entry">${sp.input||'&nbsp;'}</span>`}</div>
    <div class="pad">${[1,2,3,4,5,6,7,8,9,'⌫',0,'✓'].map(k=>`<button class="padk" data-act="spKey" data-arg="${k}">${k}</button>`).join('')}</div></section>`;
}
function vParent(){
  const rows=[...TOPICS,...THINK,...RPARTS].map(t=>{const s=tstat(t.id),a=acc(s);return`<tr><td>${t.name}</td><td class="num">${t.strand==='Reading'?'–':s.level}</td><td class="num">${s.att}</td><td class="num">${a===null?'–':a+'%'}</td></tr>`;}).join('');
  const tests=P.tests.slice().reverse().map(t=>`<tr><td>${t.date}</td><td>${paperName(t.type||'maths')}</td><td class="num">${t.score}/${t.total||35}</td><td class="num">${mmss(t.secs)}</td></tr>`).join('');
  const weak=[...TOPICS,...THINK,...RPARTS].map(t=>({t,a:acc(tstat(t.id))})).filter(x=>x.a!==null&&tstat(x.t.id).att>=5).sort((x,y)=>x.a-y.a).slice(0,3);
  const sel=(id,val,opts)=>`<select id="${id}" data-set="${id}">${opts.map(([v,l])=>`<option value="${v}"${v===val?' selected':''}>${l}</option>`).join('')}</select>`;
  return`<div class="qtop"><button class="link" data-act="home">← Home</button></div>
  <section class="panel"><p class="eyebrow">Parent corner</p><h1>${P.name?esc(P.name)+"'s":'Your child\'s'} progress</h1>
    ${weak.length?`<p class="lede">Focus next on: <b>${weak.map(x=>x.t.name).join(', ')}</b>.</p>`:`<p class="lede">Weak areas will show here after a few practice rounds.</p>`}
    <div class="tablewrap"><table class="tbl"><thead><tr><th>Topic</th><th class="num">Level</th><th class="num">Questions</th><th class="num">First try</th></tr></thead><tbody>${rows}</tbody></table></div></section>
  <section class="panel"><h2 class="sec">Mock test history</h2>${tests?`<div class="tablewrap"><table class="tbl"><thead><tr><th>Date</th><th>Paper</th><th class="num">Score</th><th class="num">Time</th></tr></thead><tbody>${tests}</tbody></table></div>`:'<p class="lede sm">No mock tests yet.</p>'}</section>
  <section class="panel"><h2 class="sec">Help settings</h2>
    <div class="setting"><label for="hintAfter">Hint unlocks after</label>${sel('hintAfter',P.settings.hintAfter,[[1,'1 wrong try'],[2,'2 wrong tries']])}</div>
    <div class="setting"><label for="solveAfter">Full working and answer unlock after</label>${sel('solveAfter',P.settings.solveAfter,[[1,'1 wrong try'],[2,'2 wrong tries'],[3,'3 wrong tries']])}</div>
    <div class="setting"><label for="goal">Daily goal</label>${sel('goal',P.settings.goal||20,[[10,'10 questions'],[20,'20 questions'],[30,'30 questions'],[40,'40 questions']])}</div>
    <div class="setting"><label for="fx">Celebration animations</label>${sel('fx',P.settings.fx??1,[[1,'On'],[0,'Off']])}</div>
    <div class="setting"><label for="voice">Cheering voices${VOICE.ok?'':' (not supported on this device)'}</label><span class="row tight">${sel('voice',P.settings.voice??1,[[1,'On'],[0,'Off']])}<button class="btn ghost sm" data-act="testCheer">Play a sample</button></span></div>
    <div class="setting"><label for="pname">Name</label><input id="pname" data-set="name" value="${esc(P.name)}" maxlength="20"></div>
    <div class="setting"><label for="sayname">How the voice says her name<small class="hintline">If it sounds wrong, try a different spelling, such as "Mi-thi-laa" or "Mithilaa".</small></label><span class="row tight"><input id="sayname" data-set="sayName" value="${esc(P.settings.sayName||'')}" placeholder="${esc(P.name)}" maxlength="30"><button class="btn ghost sm" data-act="hearName">Hear it</button></span></div>
    <p class="lede sm">Levels adjust on their own: 3 right first try in a row moves a topic up; needing the working twice moves it down. ${SYNC.state==='cloud'?'<b>Progress is saved to your Claude account</b>, so refreshing the page, clearing the browser or switching devices keeps it, as long as you are signed in to the same Claude account.':'Progress is currently saved in this browser only. Open the page while signed in to Claude to save it to your account.'}</p>
    ${S.resetAsk?`<div class="confirm"><p>Delete all stars, levels and test history?</p><div class="row"><button class="btn danger" data-act="resetYes">Yes, reset</button><button class="btn ghost" data-act="resetNo">Cancel</button></div></div>`:`<div class="row"><button class="btn ghost" data-act="resetAsk">Reset all progress</button></div>`}</section>
  <section class="panel"><h2 class="sec">What's covered</h2><p class="lede sm">Questions follow the NSW Mathematics K–10 syllabus for Stage 2 (Years 3–4), stretching into early Stage 3 on Level 3: whole numbers to 6 digits, addition and subtraction, multiplication and division, fractions and decimals, patterns and algebra, length, area, volume, mass and capacity, time, money, 2D and 3D shapes, angles, position, data and chance. The Thinking Skills section covers the OC Thinking Skills paper (30 questions in 30 minutes): ordering and seating puzzles, "must be true" logic, truth-teller puzzles, cube nets, turning and flipping shapes, picture patterns, codes, counting and balance puzzles, and judging arguments (flaws, assumptions, what strengthens or weakens a claim). The Reading section has three full papers of original texts in the official five-part layout (story questions, choosing the right word, a poem, missing sentences and matching extracts: 33 answers in 40 minutes). The OC problem-solving topic and the maths mock test practise the multi-step reasoning style of the NSW Opportunity Class placement test (Mathematical Reasoning: 35 questions in 40 minutes). Formats follow the department's published practice tests: maths questions have five options (A–E), Thinking Skills questions have four. Question styles such as multi-step bus problems, views of cube models, pet and timetable deductions, and "which statement, if true, best supports" arguments are modelled on those samples, but every question is the app's own and is generated fresh, so she will not see the same paper twice.</p></section>`;
}

// ---------- flow ----------
function render(){
  const v={home:vHome,q:vQuestion,summary:vSummary,test:vTest,result:vResult,sprint:vSprint,parent:vParent,trophies:vTrophies,shop:vShop}[S.screen]();
  app.innerHTML=vHeader()+`<main class="wrap">${v}</main>`;S.anim=false;
  const g=app.querySelector('.passage .gap.cur');if(g){const box=g.closest('.passage');box.scrollTop=Math.max(0,g.offsetTop-80);}
}
function go(screen,extra){clearInterval(timer);timer=null;for(let i=FXQ.length-1;i>=0;i--)if(!['badge','goal','tier'].includes(FXQ[i].kind))FXQ.splice(i,1);S=Object.assign({screen},extra||{});render();window.scrollTo(0,0);}
function weakPlan(n,list){
  const w=list.map(t=>{const s=tstat(t.id),a=acc(s);return{id:t.id,w:1+(a===null?.6:(100-a)/50)+(t.id==='reason'?.5:0)};});
  const plan=[];while(plan.length<n){let r=Math.random()*w.reduce((x,y)=>x+y.w,0);const c=w.find(x=>(r-=x.w)<=0)||w[0];if(plan.filter(p=>p===c.id).length<2)plan.push(c.id);}
  return shuffle(plan);
}
function startSession(kind,arg){
  const base={kind,arg,i:0,results:[],starsEarned:0,levelUps:[]};
  if(kind==='topic'&&TOPIC[arg].strand==='Reading'){const list=pickPart(TOPIC[arg].type);Object.assign(base,{kind:'list',n:list.length,label:TOPIC[arg].name,list});}
  else if(kind==='topic')Object.assign(base,{n:10,label:TOPIC[arg].name});
  else if(kind==='daily')Object.assign(base,{n:10,label:'Daily 10',plan:shuffle([...weakPlan(7,TOPICS),...weakPlan(3,THINK)])});
  else Object.assign(base,{n:arg.length,label:'Try again',list:arg});
  clearInterval(timer);timer=null;S=Object.assign({screen:'q'},base);nextQ(true);
}
function nextQ(first){
  if(!first)S.i++;
  if(S.i>=S.n){if(S.kind==='daily'){P.daily=today();save();}S.screen='summary';const fr=S.results.filter(r=>r.first).length;if(S.n>=10&&fr===S.n)P.perfect=(P.perfect||0)+1;const ev=checkBadges();save();render();window.scrollTo(0,0);setTimeout(()=>celebrateAll([...(fr>=Math.ceil(S.n*.7)?[{kind:'round'}]:[]),...ev]),300);return;}
  let q;if(S.kind==='list')q={...S.list[S.i]};else if(S.kind==='redo'&&S.list[S.i].q&&TOPIC[S.list[S.i].topic].strand==='Reading')q={...S.list[S.i].q};else if(S.kind==='redo'){const o=S.list[S.i];q=makeQ(o.topic,o.level,null);if(o.gen){for(let k=0;k<20&&q.gen!==o.gen;k++)q=makeQ(o.topic,o.level,null);}}
  else{const tid=S.kind==='topic'?S.arg:S.plan[S.i];q=makeQ(tid,tstat(tid).level,S.q&&S.q.gen);}
  Object.assign(S,{q,tries:0,wrong:[],hint:false,revealed:false,done:false,work:false,anim:true});render();window.scrollTo(0,0);
}
function record(first,revealed,stars=0){
  const s=tstat(S.q.topic);s.att++;markDay();const ev=rewardAnswer(first,stars);
  if(first){s.first++;s.streak++;s.miss=0;if(s.streak>=3&&s.level<3){s.level++;s.streak=0;if(!S.levelUps.includes(S.q.topic))S.levelUps.push(S.q.topic);}}
  else{s.streak=0;if(revealed){s.miss++;if(s.miss>=2&&s.level>1){s.level--;s.miss=0;}}}
  S.results.push({topic:S.q.topic,level:S.q.level,gen:S.q.gen,q:S.q,first,revealed});ev.push(...checkBadges());save();return ev;
}
const ACT={
  home:()=>go('home'),parent:()=>go('parent'),
  topic:id=>startSession('topic',id),daily:()=>startSession('daily'),
  again:()=>startSession(S.kind==='redo'?'daily':S.kind==='list'?'topic':S.kind,S.arg),
  redoShown:()=>startSession('redo',S.results.filter(r=>r.revealed)),
  choose:i=>{i=+i;if(S.done||S.wrong.includes(i))return;
    if(i===S.q.answer){const lu=S.levelUps.length,first=S.tries===0;S.done=true;S.earned=first?3:S.tries===1?2:1;P.stars+=S.earned;S.starsEarned+=S.earned;S.praise=pick(PRAISE);
      S.run=first?(S.run||0)+1:0;P.bestRun=Math.max(P.bestRun||0,S.run);const ev=record(first,false,S.earned);render();
      const el=app.querySelector('.choice.is-right'),main=S.levelUps.length>lu?'levelup':!first?'after':S.run%5===0?'streak5':S.run===3?'streak3':'correct';
      flyStars(el,S.earned);celebrateAll([{kind:main},...ev],el);return;}
    else{S.wrong.push(i);S.tries++;S.run=0;}render();oops(app.querySelector(`.choice[data-arg="${i}"]`));},
  hint:()=>{S.hint=true;render();},
  solve:()=>{S.revealed=true;S.done=true;S.run=0;const ev=record(false,true);render();celebrateAll(ev.filter(e=>e.kind!=='correct'));},
  work:()=>{S.work=true;render();},
  next:()=>nextQ(),
  test:type=>{type=type==='think'||type==='read'?type:'maths';const plan=type==='read'?null:type==='think'?shuffle([...Array(8).fill('logic'),...Array(8).fill('spatial'),...Array(7).fill('puzzle'),...Array(7).fill('critical')])
      :shuffle([...Array(10).fill('reason'),...shuffle(TOPICS.filter(t=>t.id!=='reason').flatMap(t=>[t.id,t.id,t.id])).slice(0,25)]);
    const qs=type==='read'?pickPaper():[];if(plan)plan.forEach(tid=>{let q,k=0;do{q=makeQ(tid,Math.random()<.6?2:3);}while(k++<8&&qs.some(o=>o.text===q.text));qs.push(q);});
    const mins=type==='think'?30:40;go('test',{testType:type,qs,ans:Array(qs.length).fill(null),flag:Array(qs.length).fill(false),i:0,start:Date.now(),end:Date.now()+mins*60*1000,limit:mins*60,confirm:false});
    timer=setInterval(()=>{const left=(S.end-Date.now())/1000,el=document.getElementById('timer');if(left<=0)return ACT.tFinish();if(el){el.textContent=mmss(left);el.classList.toggle('low',left<300);}},1000);},
  tPick:i=>{S.ans[S.i]=+i;render();tap();},
  tGo:i=>{S.i=+i;render();},tPrev:()=>{if(S.i>0){S.i--;render();}},
  tNext:()=>{if(S.i<S.qs.length-1){S.i++;render();window.scrollTo(0,0);}else{S.confirm=true;render();}},
  tFlag:()=>{S.flag[S.i]=!S.flag[S.i];render();},tAsk:()=>{S.confirm=true;render();},tCancel:()=>{S.confirm=false;render();},
  tFinish:()=>{clearInterval(timer);timer=null;const secs=Math.min(S.limit,Math.round((Date.now()-S.start)/1000)),score=S.qs.filter((q,i)=>S.ans[i]===q.answer).length;
    P.tests.push({date:new Date().toLocaleDateString('en-AU'),score,total:S.qs.length,secs,type:S.testType});P.tests=P.tests.slice(-20);markDay();const tev=checkBadges();save();
    S.screen='result';S.res={score,total:S.qs.length,secs};S.open=null;S.solved={};render();window.scrollTo(0,0);setTimeout(()=>celebrateAll([...(score/S.qs.length>=.7?[{kind:'test'}]:[]),...tev]),300);},
  rToggle:i=>{S.open=S.open===+i?null:+i;render();},rSolve:i=>{S.solved[+i]=true;render();},
  redoTest:()=>startSession('redo',S.qs.filter((q,i)=>S.ans[i]!==q.answer).map(q=>({topic:q.topic,level:q.level,gen:q.gen,q}))),
  sprint:()=>go('sprint',{sp:{phase:'setup',tables:(S.sp&&S.sp.tables)||[2,3,4,5,6,7,8,9,10,11,12]}}),
  spToggle:n=>{n=+n;const t=S.sp.tables;S.sp.tables=t.includes(n)?t.filter(x=>x!==n):[...t,n].sort((a,b)=>a-b);render();},
  spStart:()=>{clearInterval(timer);Object.assign(S.sp,{phase:'run',score:0,wrongs:[],input:'',flash:false,end:Date.now()+60000});spNew();render();
    timer=setInterval(()=>{const left=(S.sp.end-Date.now())/1000,el=document.getElementById('timer');
      if(left<=0){clearInterval(timer);timer=null;S.sp.phase='done';S.sp.newBest=S.sp.score>P.sprintBest;if(S.sp.newBest)P.sprintBest=S.sp.score;markDay();const sev=checkBadges();save();render();celebrateAll([...(S.sp.newBest&&S.sp.score>0?[{kind:'best'}]:[]),...sev],document.querySelector('.panel h1'));return;}
      if(el){el.textContent=mmss(left);el.classList.toggle('low',left<10);}},250);},
  spKey:k=>{const sp=S.sp;if(sp.phase!=='run'||sp.flash)return;
    if(k==='⌫')sp.input=sp.input.slice(0,-1);else if(k==='✓'){if(sp.input)spCheck(true);return;}else if(sp.input.length<3)sp.input+=k;
    spCheck(false);render();},
  sound:()=>{P.settings.sound=P.settings.sound===false;save();render();if(P.settings.sound){chime([659,880],.08);claps(2,.18,.4);}else try{speechSynthesis.cancel();}catch(e){}},
  trophies:()=>go('trophies'),shop:()=>go('shop'),
  buy:id=>{const it=ITEM[id];if(!it||P.owned.includes(id)||P.stars<it.cost)return;P.stars-=it.cost;P.owned.push(id);ACT.wear(id,true);celebrate('buy',app.querySelector(`[data-arg="${id}"]`));},
  wear:(id,keep)=>{const it=ITEM[id];if(!it||!P.owned.includes(id))return;const on=P.wear.includes(id);P.wear=P.wear.filter(w=>ITEM[w]&&ITEM[w].slot!==it.slot);if(!on||keep)P.wear.push(id);save();render();},
  poke:()=>{celebrate('correct',app.querySelector('.hero-koala'));},
  hearName:()=>{const inp=document.getElementById('sayname');if(inp){P.settings.sayName=inp.value.trim();save();}say(`Great job, ${spokenName()}! You are a superstar!`);},
  testCheer:()=>{const was=P.settings.fx;P.settings.fx=1;cheer('badge',{name:'Super Listener'});P.settings.fx=was;},
  resetAsk:()=>{S.resetAsk=true;render();},resetNo:()=>{S.resetAsk=false;render();},
  resetYes:()=>{const name=P.name;P=defaults();P.name=name;save();flushCloud();go('parent');},
};
function spNew(){const sp=S.sp;let a,b;do{a=pick(sp.tables);b=R(2,12);}while(sp.a===a&&sp.b===b);sp.a=a;sp.b=b;sp.input='';}
function spCheck(force){const sp=S.sp,ans=sp.a*sp.b;
  if(+sp.input===ans){sp.score++;spNew();render();sprintPop(document.querySelector('.testbar b'));return;}
  if(force||sp.input.length>=String(ans).length){sp.wrongs.push([sp.a,sp.b]);sp.flash=true;render();
    setTimeout(()=>{if(S.sp===sp&&sp.phase==='run'){sp.flash=false;spNew();render();}},1100);}}

app.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.disabled)return;const a=el.dataset.act;if(ACT[a])ACT[a](el.dataset.arg);});
app.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='nameform'){const v=document.getElementById('nm').value.trim();if(v){P.name=v;save();render();}}});
app.addEventListener('change',e=>{const k=e.target.dataset.set;if(!k)return;if(k==='name'){P.name=e.target.value.trim()||'Mithila';}else if(k==='sayName'){P.settings.sayName=e.target.value.trim();}else P.settings[k]=+e.target.value;save();render();});
document.addEventListener('keydown',e=>{
  if(e.target.matches('input,select,textarea'))return;
  const k=e.key.toLowerCase(),idx='1234567'.indexOf(k)>=0?'1234567'.indexOf(k):'abcdefg'.indexOf(k);
  if(S.screen==='q'){if(idx>=0&&k.length===1&&idx<S.q.choices.length)ACT.choose(idx);else if(e.key==='Enter'&&S.done)ACT.next();}
  else if(S.screen==='test'){if(idx>=0&&k.length===1&&idx<S.qs[S.i].choices.length)ACT.tPick(idx);else if(e.key==='ArrowRight')ACT.tNext();else if(e.key==='ArrowLeft')ACT.tPrev();}
  else if(S.screen==='sprint'&&S.sp.phase==='run'){if(/^[0-9]$/.test(e.key))ACT.spKey(e.key);else if(e.key==='Backspace')ACT.spKey('⌫');else if(e.key==='Enter')ACT.spKey('✓');}
});
render();
initSync();
