// Saves progress to the viewer's own Claude account (the page's private db subtree), so a refresh,
// a cleared browser or another device keeps her history. Browser storage stays as a fast local copy.
const SYNC={ref:null,state:'local',busy:false,dirty:false,timer:0};
function cloudSave(){if(!SYNC.ref)return;SYNC.dirty=true;clearTimeout(SYNC.timer);SYNC.timer=setTimeout(flushCloud,1200);}
async function flushCloud(){
  if(!SYNC.ref||SYNC.busy||!SYNC.dirty)return;
  clearTimeout(SYNC.timer);SYNC.busy=true;SYNC.dirty=false;
  try{await SYNC.ref.set({p:JSON.parse(JSON.stringify(P)),updatedAt:P.updatedAt||Date.now()});SYNC.state='cloud';}
  catch(e){const c=e&&e.code;
    if(c==='unavailable'||c==='resource_exhausted'){SYNC.dirty=true;setTimeout(flushCloud,2500+Math.random()*2500);}
    else{SYNC.ref=null;SYNC.state='local';}}
  SYNC.busy=false;if(SYNC.dirty&&SYNC.ref)cloudSave();
}
async function initSync(){
  try{
    if(!window.claude||!window.claude.use)return;
    const[db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
    if(!db||!user)return;
    const id=await user.id();if(!id)return;
    const ref=db.doc('data/users/'+id+'/progress'),snap=await ref.get();
    SYNC.ref=ref;SYNC.state='cloud';
    const cloud=snap.exists?snap.data().p:null;
    if(cloud&&(cloud.updatedAt||0)>=(P.updatedAt||0)){P=normaliseP(cloud);saveLocal();if(!(S.screen==='sprint'&&S.sp&&S.sp.phase==='run'))render();}
    else{SYNC.dirty=true;flushCloud();}
  }catch(e){SYNC.ref=null;SYNC.state='local';}
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushCloud();});
window.addEventListener('pagehide',()=>flushCloud());
