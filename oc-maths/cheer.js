// Cheering: pre-recorded child-like voice clips (voice/*.mp3, listed in voice/clips.js) and synthesised applause.
// The clips play through one <audio> element, unlocked on her first tap so iPad lets later clips play on their own.
const VOICE={ok:true,el:null,unlocked:false};
const soundOn=()=>P.settings.sound!==false;
const voiceOn=()=>soundOn()&&!!(P.settings.voice??1);
function voiceEl(){if(!VOICE.el){VOICE.el=new Audio();VOICE.el.preload='auto';}return VOICE.el;}
// Clips that include her name come in two pronunciations; if the name is changed, the no-name version plays instead.
function clipUrl(c){
  if(!c.name)return`voice/${c.id}.mp3`;
  const isMithila=(P.name||'').trim().toLowerCase()==='mithila';
  return`voice/${c.id}_${isMithila?(P.settings.namePron||'a'):'x'}.mp3`;
}
function playClip(c){
  if(!voiceOn()||!c)return;
  try{const el=voiceEl();el.pause();el.muted=false;el.src=clipUrl(c);el.currentTime=0;const pr=el.play();if(pr&&pr.catch)pr.catch(()=>{});}catch(e){}
}
const clipsFor=kind=>(typeof VCLIPS!=='undefined'&&VCLIPS[kind])||[];
document.addEventListener('pointerdown',function unlock(){
  try{FX.audio=FX.audio||new (window.AudioContext||window.webkitAudioContext)();if(FX.audio.state==='suspended')FX.audio.resume();}catch(e){}
  try{const el=voiceEl();el.muted=true;el.src='voice/correct_0.mp3';const pr=el.play();if(pr&&pr.then)pr.then(()=>{el.pause();el.muted=false;}).catch(()=>{el.muted=false;});}catch(e){}
  document.removeEventListener('pointerdown',unlock);
});

// ---------- applause ----------
let NOISE=null;
function noiseBuf(a){if(NOISE)return NOISE;const b=a.createBuffer(1,a.sampleRate,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return NOISE=b;}
function oneClap(a,t,vol){
  // A hand clap is two or three very short noise bursts a few milliseconds apart, band-passed around 1–2.5 kHz.
  const f=900+Math.random()*1600,q=.7+Math.random()*.9,parts=2+(Math.random()<.5?1:0);
  for(let k=0;k<parts;k++){const s=a.createBufferSource(),bp=a.createBiquadFilter(),g=a.createGain(),tt=t+k*(.004+Math.random()*.006),len=.06+Math.random()*.07;
    s.buffer=noiseBuf(a);bp.type='bandpass';bp.frequency.value=f*(1+k*.08);bp.Q.value=q;
    g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(vol*(k?0.55:1),tt+.0015);g.gain.exponentialRampToValueAtTime(.0005,tt+len);
    s.connect(bp).connect(g).connect(a.destination);s.start(tt,Math.random()*.8,len+.02);}
}
// claps(3) = a rhythmic clap-clap-clap; applause(2.4, 'big') = a whole class clapping and fading out.
function claps(n=3,gap=.2,vol=.75){
  if(!soundOn())return;try{FX.audio=FX.audio||new (window.AudioContext||window.webkitAudioContext)();const a=FX.audio,t0=a.currentTime+.02;
    for(let i=0;i<n;i++)oneClap(a,t0+i*gap,vol);}catch(e){}
}
function applause(dur=2.2,size='big'){
  if(!soundOn())return;
  try{FX.audio=FX.audio||new (window.AudioContext||window.webkitAudioContext)();const a=FX.audio,t0=a.currentTime+.03,n=size==='big'?Math.round(dur*42):Math.round(dur*20);
    for(let i=0;i<n;i++){const p=Math.pow(Math.random(),1.25),t=t0+p*dur,fade=1-p*.75;oneClap(a,t,(.26+Math.random()*.4)*fade*(size==='big'?1:1.3));}
  }catch(e){}
}

// ---------- what each moment sounds like ----------
function cheer(kind,data){
  if(!soundOn())return;
  // Small moments get a quick clap now and then; achievements get the whole class.
  const big=['badge','tier','goal','levelup','test','round','best','streak5'].includes(kind);
  if(big)applause(kind==='tier'||kind==='test'?3:2.4,'big');
  else if(kind==='streak3')claps(4,.17,.55);
  else if(kind==='after')claps(3,.2,.45);
  else if(kind==='buy')claps(3,.18,.5);
  else if(kind==='correct'&&Math.random()<.35)claps(3,.18,.4);
  let list=clipsFor(kind);
  if(kind==='badge'&&data)list=clipsFor('badge_'+data.id);
  if(kind==='tier'&&data)list=clipsFor('tier_'+data.id);
  // Speak on every achievement, and on about half of the ordinary correct answers so it never gets tiring.
  if(list.length&&(kind!=='correct'||Math.random()<.5)){const c=pick(list);setTimeout(()=>playClip(c),big?350:150);}
}
const playSample=()=>playClip(clipsFor('sample')[0]);
