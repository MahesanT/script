// Cheering: child-pitched voice lines (the device's own speech voices) and synthesised applause.
// No audio files: the voice comes from speechSynthesis and every clap is filtered noise from Web Audio.
const VOICE={v:null,ready:false,ok:'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window};
const soundOn=()=>P.settings.sound!==false;
const voiceOn=()=>soundOn()&&(P.settings.voice??1)&&VOICE.ok;
// Prefer a bright English voice, Australian first; any English voice will do.
function pickVoice(){
  if(!VOICE.ok)return;const vs=speechSynthesis.getVoices();if(!vs.length)return;
  const prefer=['Karen','Catherine','Samantha','Google UK English Female','Microsoft Natasha','Moira','Tessa','Google US English','Serena','Martha'];
  VOICE.v=prefer.map(n=>vs.find(v=>v.name.includes(n))).find(Boolean)||vs.find(v=>/^en[-_]AU/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null;VOICE.ready=true;
}
if(VOICE.ok){pickVoice();try{speechSynthesis.addEventListener('voiceschanged',pickVoice);}catch(e){}}
function say(text,{pitch=1.85,rate=1.08}={}){
  if(!voiceOn())return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);if(VOICE.v){u.voice=VOICE.v;u.lang=VOICE.v.lang;}else u.lang='en-AU';u.pitch=pitch;u.rate=rate;u.volume=1;speechSynthesis.speak(u);}catch(e){}
}
// iPad needs the first sound and speech to start inside a tap; this unlocks both on her first touch.
document.addEventListener('pointerdown',function unlock(){
  try{FX.audio=FX.audio||new (window.AudioContext||window.webkitAudioContext)();if(FX.audio.state==='suspended')FX.audio.resume();}catch(e){}
  if(VOICE.ok){try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}catch(e){}}
  document.removeEventListener('pointerdown',unlock);
},{once:false});

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
const nm=()=>P.name?`, ${P.name}`:'';
const LINES={
  correct:()=>pick(['Yes!','Awesome!','Great job'+nm()+'!','You got it!','Brilliant!','Woohoo!','Nailed it!','Super!']),
  after:()=>pick(['You got there!','Never give up! Yay!','Well done for trying again!','Yes! You worked it out!']),
  streak3:()=>pick(['Three in a row!','Hat trick! Woohoo!','Three in a row'+nm()+'! So cool!']),
  streak5:()=>pick(['Five in a row! You are on fire!','Five in a row! Unstoppable!','Wow! Five in a row'+nm()+'!']),
  levelup:()=>pick(['Level up! Yaaay!','Woohoo! You levelled up!','Level up'+nm()+'! You are getting so smart!']),
  goal:()=>pick(['Yaaay! Daily goal complete!','You did it! Daily goal smashed!','Hooray! Daily goal done'+nm()+'!']),
  round:()=>pick(['Round complete! Great job!','Yay! You finished the round!']),
  test:()=>pick(['Wow! What a score!','Amazing test'+nm()+'! Hooray!']),
  best:()=>pick(['New best score! Woohoo!','A new record! Yaaay!']),
  buy:()=>pick(['Ooh! Looking good!','So fancy! Yay!','I love it!']),
};
function cheer(kind,data){
  if(!soundOn())return;
  let line=LINES[kind]?LINES[kind]():'';
  if(kind==='badge'&&data)line=pick(['Woohoo! You unlocked ','Yaaay! New badge! ','Hooray! You earned ']).concat(data.name,'!');
  if(kind==='tier'&&data)line=`Amazing${nm()}! You reached ${data.name} tier!`;
  // Small moments get a quick clap now and then; achievements get the whole class.
  const big=['badge','tier','goal','levelup','test','round','best','streak5'].includes(kind);
  if(big)applause(kind==='tier'||kind==='test'?3:2.4,'big');
  else if(kind==='streak3')claps(4,.17,.55);
  else if(kind==='after')claps(3,.2,.45);
  else if(kind==='buy')claps(3,.18,.5);
  else if(kind==='correct'&&Math.random()<.35)claps(3,.18,.4);
  // Speak on every achievement, and on about half of the ordinary correct answers so it never gets tiring.
  if(line&&(kind!=='correct'||Math.random()<.5))setTimeout(()=>say(line,kind==='tier'||kind==='badge'?{pitch:1.9,rate:1.02}:{}),big?350:150);
}
