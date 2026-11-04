
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {getAuth,signInAnonymously} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {getDatabase,ref,get,set,update,push,remove,onValue,onChildAdded,onDisconnect,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js';
const firebaseConfig=window.COLOR_CLASH_FIREBASE_CONFIG;

const __Math = (() => {
/** 수학 6-2 4단원, 교과서 82~83쪽에 한정.
 *  소수의 비·분수의 비를 비의 성질로 간단한 자연수의 비로 나타내기.
 *  비례식의 외항/내항 성질, 비례배분, 비례식 응용은 출제하지 않음.
 *  모든 정답/보기는 방장 측에서 만들어 검증합니다.
 */
const rint=(a,b,r=Math.random)=>Math.floor(r()*(b-a+1))+a;
const shuffle=(items,r=Math.random)=>{
  const a=[...items];
  for(let i=a.length-1;i>0;i--){const j=rint(0,i,r);[a[i],a[j]]=[a[j],a[i]];}
  return a;
};
const id=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2);
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;};
const lcm=(a,b)=>a/gcd(a,b)*b;
const simplest=(a,b)=>{const g=gcd(a,b);return [a/g,b/g];};
const ratio=(a,b)=>`${a}：${b}`;
const decimal=(n,denom)=>{
  const digits=denom===100?2:1;
  return (n/denom).toFixed(digits).replace(/0+$/,'').replace(/\.$/,'');
};
/** '가장 간단한 자연수의 비'는 기약인 비 하나만 정답이 되도록 구성. */
function ratioChoices(a,b,r){
  const correct=ratio(a,b);
  const candidates=[
    ratio(a*2,b*2),               // 비율은 같지만 간단하지 않은 비
    ratio(b,a),ratio(a+1,b),ratio(a,b+1),
    ratio(Math.max(1,a-1),b),ratio(a,Math.max(1,b-1)),
    ratio(a*2,b),ratio(a,b*2),ratio(a+2,b+1),ratio(a+1,b+2),
    ratio(a*3,b*3),ratio(a+3,b),ratio(a,b+3)
  ];
  const wrong=shuffle([...new Set(candidates)].filter(v=>v!==correct),r).slice(0,3);
  const choices=shuffle([correct,...wrong],r);
  return {choices,correct:choices.indexOf(correct)};
}
/** 중간 과정의 비는 간단하지 않아도 됨: 정확히 두 항을 동시에 변환했는지 확인. */
function stepChoices(a,b,r){
  const correct=ratio(a,b);
  const candidates=[
    ratio(b,a),ratio(a+1,b),ratio(a,b+1),ratio(a*2,b),ratio(a,b*2),
    ratio(Math.max(1,a-1),b),ratio(a,Math.max(1,b-1)),ratio(a+1,b+1),
    ratio(a*2,b*2),ratio(a+2,b),ratio(a,b+2)
  ];
  const wrong=shuffle([...new Set(candidates)].filter(v=>v!==correct),r).slice(0,3);
  const choices=shuffle([correct,...wrong],r);
  return {choices,correct:choices.indexOf(correct)};
}
function makeQuestion(r=Math.random){
  const type=rint(0,10,r);
  let question;
  if(type===0){
    // 소수 한 자리 : 소수 한 자리 (교과서 82쪽)
    let a=rint(2,78,r),b=rint(2,78,r);
    if(a%10===0)a++;if(b%10===0)b++;
    const [x,y]=simplest(a,b);
    question={text:`${decimal(a,10)}：${decimal(b,10)}을 가장 간단한 자연수의 비로 나타내세요.`,
      hint:'두 항에 모두 10을 곱해 자연수의 비로 만들고, 두 항을 공약수로 나누세요.',...ratioChoices(x,y,r)};
  }else if(type===1){
    // 소수 두 자리 : 소수 두 자리
    let a=rint(12,175,r),b=rint(12,175,r);
    if(a%10===0)a++;if(b%10===0)b++;
    const [x,y]=simplest(a,b);
    question={text:`${decimal(a,100)}：${decimal(b,100)}을 가장 간단한 자연수의 비로 나타내세요.`,
      hint:'소수 둘째 자리까지 있으므로 두 항에 모두 100을 곱한 뒤 간단히 하세요.',...ratioChoices(x,y,r)};
  }else if(type===2){
    // 소수 : 자연수 (교과서 83쪽 2.5 : 3 유형)
    let a=rint(3,59,r);if(a%10===0)a++;
    const b=rint(1,9,r),[x,y]=simplest(a,b*10);
    question={text:`${decimal(a,10)}：${b}을 가장 간단한 자연수의 비로 나타내세요.`,
      hint:'자연수도 함께 10을 곱해야 비율이 같아요. 그다음 두 항을 약분하듯 나누세요.',...ratioChoices(x,y,r)};
  }else if(type===3){
    // 단위분수 : 단위분수 (교과서 83쪽 1/6 : 1/4 유형)
    let a=rint(2,12,r),b=rint(2,12,r);if(a===b)b=b===12?11:b+1;
    const [x,y]=simplest(b,a);
    question={text:`1/${a}：1/${b}을 가장 간단한 자연수의 비로 나타내세요.`,
      hint:'두 분모의 공배수를 전항과 후항에 똑같이 곱하면 분모가 없어져요.',...ratioChoices(x,y,r)};
  }else if(type===4){
    // 일반 분수 : 일반 분수 (교과서 83쪽 2/3 : 3/7 유형)
    const b=rint(3,12,r),d=rint(3,12,r);
    const a=rint(2,b-1,r),c=rint(2,d-1,r);
    const [x,y]=simplest(a*d,c*b);
    question={text:`${a}/${b}：${c}/${d}을 가장 간단한 자연수의 비로 나타내세요.`,
      hint:'분모의 공배수를 두 항에 똑같이 곱해 자연수의 비로 바꿔 보세요.',...ratioChoices(x,y,r)};
  }else if(type===5){
    // 소수 : 분수 (교과서 83쪽 0.7 : 2/5 유형)
    let a=rint(2,39,r);if(a%10===0)a++;
    const d=rint(3,10,r),c=rint(1,d-1,r);
    const [x,y]=simplest(a*d,c*10);
    question={text:`${decimal(a,10)}：${c}/${d}을 가장 간단한 자연수의 비로 나타내세요.`,
      hint:'소수와 분수의 두 항에 모두 10과 분모의 공배수를 이용해 곱해 보세요.',...ratioChoices(x,y,r)};
  }else if(type===6){
    // 교과서 83쪽의 자연수의 비 간단히 나타내기 (28:63 유형)
    const a=rint(2,13,r),b=rint(2,13,r),k=rint(2,8,r);
    const [x,y]=simplest(a*k,b*k);
    question={text:`${a*k}：${b*k}을 가장 간단한 자연수의 비로 나타내세요.`,
      hint:'전항과 후항을 모두 같은 공약수로 나누어 보세요.',...ratioChoices(x,y,r)};
  }else if(type===7){
    // 소수의 비를 10배하여 자연수의 비 만들기(중간 과정)
    let a=rint(2,57,r),b=rint(2,57,r);
    if(a%10===0)a++;if(b%10===0)b++;
    question={text:`${decimal(a,10)}：${decimal(b,10)}의 두 항에 모두 10을 곱하면 어떤 자연수의 비가 되나요?`,
      hint:'전항과 후항을 똑같이 10배하면 비율이 변하지 않아요.',...stepChoices(a,b,r)};
  }else if(type===8){
    // 분수의 비를 분모의 최소공배수로 곱하여 자연수의 비 만들기(중간 과정)
    const b=rint(3,12,r),d=rint(3,12,r),a=rint(1,b-1,r),c=rint(1,d-1,r);
    const k=lcm(b,d),x=a*k/b,y=c*k/d;
    question={text:`${a}/${b}：${c}/${d}의 전항과 후항에 모두 ${k}을(를) 곱하면 어떤 자연수의 비가 되나요?`,
      hint:`${k}는 두 분모 ${b}, ${d}의 공배수예요. 두 항에 각각 같은 수 ${k}를 곱하세요.`,...stepChoices(x,y,r)};
  }else if(type===9){
    // 분수 : 소수 (82-83쪽 배운 방법의 결합)
    const d=rint(3,10,r),c=rint(1,d-1,r);
    let a=rint(2,49,r);if(a%10===0)a++;
    const [x,y]=simplest(c*10,a*d);
    question={text:`${c}/${d}：${decimal(a,10)}을 가장 간단한 자연수의 비로 나타내세요.`,
      hint:'분수의 분모와 소수 자릿수를 함께 생각해 두 항에 같은 수를 곱해요.',...ratioChoices(x,y,r)};
  }else{
    // 교과서 수치와 직접 연결된 82~83쪽 대표 예제
    const examples=[
      ['2.1：5.6','3：8','두 항에 10을 곱하면 21：56, 다시 7로 나누면 돼요.'],
      ['1/6：1/4','2：3','두 항에 12를 곱해 자연수의 비로 나타내세요.'],
      ['0.7：2/5','7：4','두 항에 10을 곱하면 7：4가 돼요.'],
      ['28：63','4：9','두 항을 모두 7로 나누어 보세요.'],
      ['0.8：0.4','2：1','두 항에 모두 10을 곱한 뒤 4로 나누어 보세요.'],
      ['2.5：3','5：6','두 항에 모두 10을 곱한 뒤 5로 나누어 보세요.'],
      ['2/3：3/7','14：9','두 항에 21을 똑같이 곱해 보세요.']
    ];
    const [source,answer,hint]=examples[rint(0,examples.length-1,r)];
    const [x,y]=answer.split('：').map(Number);
    question={text:`${source}을 가장 간단한 자연수의 비로 나타내세요.`,hint,...ratioChoices(x,y,r)};
  }
  if(question.choices.length!==4||new Set(question.choices).size!==4||
     question.correct<0||question.correct>3)throw Error('보기 생성 오류');
  return {id:id(),topic:'비의 성질 활용 · 82~83쪽',...question};
}
return {makeQuestion};
})();
const {makeQuestion}=__Math;

const __Physics = (() => {
// Three.js 및 Firebase와 독립적으로 테스트할 수 있는 전투 물리 판정
const ARENA = 17.2;
const ROUND_MS = 240000;
const RESPAWN_MS = 2000;
const SHOT_COOLDOWN = 390;
const SPAWNS = [
  {x:-13.5,z:13.5}, {x:13.5,z:-13.5},
  {x:13.5,z:13.5}, {x:-13.5,z:-13.5}
];
const COVERS = [
  {x:0,z:0,w:4.6,d:4.6,h:3.3},
  {x:-9,z:-6,w:3.5,d:5.1,h:2.9},
  {x:9,z:6,w:3.5,d:5.1,h:2.9},
  {x:-8,z:9,w:4.8,d:2.9,h:2.5},
  {x:8,z:-9,w:4.8,d:2.9,h:2.5},
  {x:0,z:11,w:5.8,d:2.1,h:2.8},
  {x:0,z:-11,w:5.8,d:2.1,h:2.8}
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function canStand(x,z){
  return Number.isFinite(x)&&Number.isFinite(z)&&Math.abs(x)<=ARENA&&Math.abs(z)<=ARENA&&
    !COVERS.some(c=>Math.abs(x-c.x)<c.w/2+.59&&Math.abs(z-c.z)<c.d/2+.59);
}
function raySphere(o,d,c,r){
  const ox=o.x-c.x,oy=o.y-c.y,oz=o.z-c.z;
  const b=ox*d.x+oy*d.y+oz*d.z;
  const cc=ox*ox+oy*oy+oz*oz-r*r;
  const disc=b*b-cc;
  if(disc<0)return Infinity;
  const t=-b-Math.sqrt(disc);
  return t>=.03?t:Infinity;
}
function rayBox(o,d,c){
  let tmin=0,tmax=45;
  for(const [coord,min,max] of [
    ['x',c.x-c.w/2,c.x+c.w/2],['y',0,c.h],['z',c.z-c.d/2,c.z+c.d/2]]){
    if(Math.abs(d[coord])<1e-8){if(o[coord]<min||o[coord]>max)return Infinity;continue;}
    let t1=(min-o[coord])/d[coord],t2=(max-o[coord])/d[coord];
    if(t1>t2)[t1,t2]=[t2,t1];
    tmin=Math.max(tmin,t1);tmax=Math.min(tmax,t2);
    if(tmin>tmax)return Infinity;
  }
  return tmin>=.03?tmin:Infinity;
}
function direction(p){
  const c=Math.cos(p.pitch);
  return {x:-Math.sin(p.yaw)*c,y:Math.sin(p.pitch),z:-Math.cos(p.yaw)*c};
}
function traceShot(shooter, targets){
  const origin={x:shooter.x,y:1.56,z:shooter.z};
  const dir=direction(shooter);
  let wall=Infinity;
  for(const cover of COVERS)wall=Math.min(wall,rayBox(origin,dir,cover));
  let distance=27,target=null;
  for(const p of targets){
    if(p.id===shooter.id || p.deadUntil>0)continue;
    const d=raySphere(origin,dir,{x:p.x,y:1.23,z:p.z},.99);
    if(d<distance&&d<wall){distance=d;target=p;}
  }
  const t=target?distance:Math.min(27,wall);
  return {target,from:origin,to:{x:origin.x+dir.x*t,y:origin.y+dir.y*t,z:origin.z+dir.z*t}};
}
function calculateTeamScores(players,gameMode='team'){
  const list=Object.values(players);
  const n=gameMode==='ffa'?4:2;
  return Array.from({length:n},(_,team)=>list.filter(p=>p.team===team)
    .reduce((total,p)=>total+(Number(p.kills)||0),0));
}
function calculateRanking(players,gameMode='team'){
  const list=Object.values(players);
  const scores=calculateTeamScores(players,gameMode);
  return list.map(p=>({...p,score:gameMode==='ffa'?(p.kills||0):scores[p.team]}))
    .sort((a,b)=>b.score-a.score||(b.kills||0)-(a.kills||0)||
      (a.deaths||0)-(b.deaths||0)||(b.hits||0)-(a.hits||0));
}

return {ARENA,COVERS,SPAWNS,ROUND_MS,SHOT_COOLDOWN,RESPAWN_MS,clamp,canStand,traceShot,calculateRanking,calculateTeamScores};
})();
const {ARENA,COVERS,SPAWNS,ROUND_MS,SHOT_COOLDOWN,RESPAWN_MS,clamp,traceShot,calculateRanking,calculateTeamScores}=__Physics;
const serverCanStand=__Physics.canStand;

/**
 * COLOR CLASH — Firebase Realtime Database 멀티플레이 브리지.
 * 방장 탭이 정답, 이동, 명중, 색칠, 승리를 판정하고 Firebase를 방송 채널로 사용합니다.
 * Cloud Functions/별도 WebSocket/Blaze 요금제 없이 소규모 교실에서 시험하는 구조입니다.
 * 방장 창을 닫으면 판정이 중단됩니다. 기업용 안티치트/전용 FPS 서버의 대체품은 아닙니다.
 */

const MAX_PLAYERS=4;
const ROOM_CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const safeName=(raw)=>String(raw||'플레이어').replace(/[<>\x00-\x1f]/g,'').trim().slice(0,12)||'플레이어';
const isConfigured=()=>firebaseConfig.apiKey&&!firebaseConfig.apiKey.includes('YOUR_')&&!firebaseConfig.apiKey.includes('여기에_')&&
  firebaseConfig.projectId&&!firebaseConfig.projectId.includes('YOUR_')&&
  firebaseConfig.databaseURL&&!firebaseConfig.databaseURL.includes('YOUR_')&&
  firebaseConfig.appId&&!firebaseConfig.appId.includes('YOUR_');
const newCode=()=>Array.from({length:6},()=>ROOM_CHARS[rand(0,ROOM_CHARS.length-1)]).join('');
const createPlayer=(seat,gameMode='team')=>{
  const p=SPAWNS[seat.slot];
  return {id:seat.uid,name:seat.name,slot:seat.slot,team:gameMode==='ffa'?seat.slot:seat.slot%2,bot:!!seat.bot,
    x:p.x,z:p.z,yaw:Math.atan2(p.x,p.z),pitch:0,
    ammo:0,correct:0,hits:0,score:0,kills:0,deaths:0,slide:false,
    deadUntil:0,spawnVersion:0,segments:Array(6).fill('')};
};
const poseOk=(p)=>[p.x,p.z,p.yaw,p.pitch].every(Number.isFinite)&&
  Math.abs(p.x)<=18&&Math.abs(p.z)<=18&&Math.abs(p.yaw)<=1000&&Math.abs(p.pitch)<=1.1;

class FirebaseArena {
  constructor(dispatch){
    this.dispatch=dispatch;this.db=null;this.uid='';this.code='';this.mySlot=-1;
    this.meta=null;this.seats={};this.state=null;this.round=0;this.offset=0;
    this.unsubs=[];this.connUnsub=null;this.host=null;this.lastShots={};
    this.ready=false;this.busy=false;this.left=false;this.poseSeq=0;
    this.lastConnectError='';
  }
  now(){return Date.now()+this.offset;}
  root(path=''){return ref(this.db,`rooms/${this.code}${path?'/'+path:''}`);}
  send(m){this.dispatch(m);}
  error(message){this.send({type:'error',message});}
  async connect(){
    if(!isConfigured()){
      this.error('config.js에 Firebase 웹 앱의 API 키를 입력해 주세요.');return;
    }
    try{
      const app=initializeApp(firebaseConfig);
      this.db=getDatabase(app);
      const auth=getAuth(app);
      const login=await signInAnonymously(auth);
      this.uid=login.user.uid;
      this.ready=true;
      this.send({type:'connected'});
      this.unsubs.push(onValue(ref(this.db,'.info/serverTimeOffset'),s=>{
        this.offset=Number(s.val())||0;
      }));
      this.unsubs.push(onValue(ref(this.db,'.info/connected'),s=>{
        if(!s.val()||!this.code||this.left)return;
        this.registerDisconnect().catch(e=>console.warn('onDisconnect:',e));
      }));
      const room=(window.COLOR_CLASH_ROOM || new URLSearchParams(location.search).get('room'));
      if(room){const input=document.getElementById('joinCode');
        if(input)input.value=room.trim().toUpperCase().slice(0,6);}
    }catch(e){
      console.error('Firebase connection error:',e);
      this.error('Firebase 연결 실패: '+(e.code||e.message)+'. 익명 인증과 설정값을 확인해 주세요.');
    }
  }
  async registerDisconnect(){
    if(!this.code||this.mySlot<0)return;
    const seat=this.root(`seats/${this.mySlot}`);
    const pose=this.root(`poses/${this.uid}`);
    await onDisconnect(seat).remove();
    await onDisconnect(pose).remove();
    if(this.meta?.host===this.uid){
      await onDisconnect(this.root('meta/online')).set(false);
      await update(this.root('meta'),{online:true});
    }
  }
  async create(name,chosenMode){
    if(!this.ready)return this.error('Firebase 로그인이 아직 준비되지 않았어요. 설정을 확인해 주세요.');
    if(this.busy||this.code)return;
    this.busy=true;
    try{
      const playerName=safeName(name);let code='',created=false;
      for(let tries=0;tries<8&&!created;tries++){
        code=newCode();
        const path=ref(this.db,`rooms/${code}/meta`);
        const result=await runTransaction(path,old=>old?undefined:{
          host:this.uid,phase:'lobby',matchMode:chosenMode==='ffa'?'ffa':'team',botsWanted:2,round:0,online:true,createdAt:this.now()
        },{applyLocally:false});
        created=result.committed;
      }
      if(!created)throw Error('방 코드 생성이 실패했습니다. 다시 시도해 주세요.');
      this.code=code;this.mySlot=0;
      await set(this.root('seats/0'),{uid:this.uid,name:playerName,slot:0,bot:false});
      this.meta={host:this.uid,phase:'lobby',matchMode:chosenMode==='ffa'?'ffa':'team',botsWanted:2,round:0,online:true};
      await this.registerDisconnect();
      this.send({type:'joined',id:this.uid,code});
      this.watchRoom();
    }catch(e){console.error(e);this.error('방 만들기 실패: '+(e.code||e.message));
      this.code='';this.mySlot=-1;
    }finally{this.busy=false;}
  }
  async join(name,code){
    if(!this.ready)return this.error('Firebase 로그인이 아직 준비되지 않았어요.');
    if(this.busy||this.code)return;
    code=String(code||'').toUpperCase().trim();
    if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code))return this.error('6자리 방 코드를 확인해 주세요.');
    this.busy=true;
    try{
      const path=ref(this.db,`rooms/${code}/meta`);
      const meta=(await get(path)).val();
      if(!meta)throw Error('존재하지 않는 방이에요.');
      if(meta.phase!=='lobby')throw Error('이미 시작된 방이에요.');
      if(meta.online===false)throw Error('방장 접속이 끊긴 방이에요.');
      this.code=code;
      const occupied=(await get(this.root('seats'))).val()||{};
      if(Object.values(occupied).some(seat=>seat.uid===this.uid))
        throw Error('이미 이 브라우저 계정으로 참여 중이에요. 다른 기기나 별도 브라우저 프로필을 사용해 주세요.');
      let seatFound=-1;
      const playerName=safeName(name);
      for(let slot=0;slot<MAX_PLAYERS;slot++){
        const seatPath=this.root(`seats/${slot}`);
        const result=await runTransaction(seatPath,old=>old?undefined:{
          uid:this.uid,name:playerName,slot,bot:false
        },{applyLocally:false});
        if(result.committed){seatFound=slot;break;}
      }
      if(seatFound<0)throw Error('4명이 모두 입장한 방이에요.');
      this.mySlot=seatFound;this.meta=meta;
      await this.registerDisconnect();
      this.send({type:'joined',id:this.uid,code});
      this.watchRoom();
    }catch(e){console.error(e);this.error('방 입장 실패: '+(e.code||e.message));
      this.code='';this.mySlot=-1;
    }finally{this.busy=false;}
  }
  watchRoom(){
    const path=this.root();
    this.unsubs.push(onValue(this.root('meta'),snap=>{
      const m=snap.val();if(!m)return;
      const wasOnline=this.meta?.online;
      if((m.round||0)!==this.round)this.lastShots={};
      this.meta=m;this.round=m.round||0;
      if(m.online===false&&wasOnline!==false&&m.host!==this.uid){
        this.error('방장이 접속을 종료했어요. 새 방을 만들어 다시 시작해 주세요.');
        this.wasPaused=true;this.send({type:'paused'});
      }
      this.evaluatePhase();
    },e=>this.error('방 상태 수신 오류: '+e.message)));
    this.unsubs.push(onValue(this.root('seats'),snap=>{
      this.seats=snap.val()||{};
      this.evaluatePhase();
      if(this.host)this.host.checkLeavers();
    },e=>this.error('참가자 수신 오류: '+e.message)));
    this.unsubs.push(onValue(this.root('state'),snap=>{
      this.state=snap.val();
      this.evaluatePhase();
    },e=>this.error('경기 정보 수신 오류: '+e.message)));
    this.unsubs.push(onValue(this.root(`challenges/${this.uid}`),snap=>{
      const q=snap.val();
      if(q&&q.round===this.round&&this.meta?.phase==='playing')
        this.send({type:'quiz',...q});
    }));
    this.unsubs.push(onValue(this.root(`feedback/${this.uid}`),snap=>{
      const result=snap.val();
      if(result&&result.round===this.round)this.send({type:'quizResult',...result});
    }));
    this.unsubs.push(onValue(this.root('events'),snap=>{
      const events=snap.val()||{};
      for(const [uid,evt] of Object.entries(events)){
        if(!evt||evt.round!==this.round||evt.seq<=(this.lastShots[uid]||0))continue;
        this.lastShots[uid]=evt.seq;
        if(this.now()-evt.at>8000||this.now()-evt.at< -4000)continue;
        if(this.meta?.phase!=='playing')continue;
        this.send({type:'shot',...evt});
        if(evt.target)this.send({type:'paint',by:evt.by,to:evt.target});
      }
    }));
  }
  evaluatePhase(){
    if(!this.meta)return;
    const phase=this.meta.phase;
    if(phase==='lobby'){
      if(this.host){this.host.stop();this.host=null;}
      this.send({type:'lobby',code:this.code,hostId:this.meta.host,matchMode:this.meta.matchMode||'team',
        botsWanted:this.meta.botsWanted||0,
        players:Object.values(this.seats||{}).filter(s=>!s.bot).map(s=>({id:s.uid,name:s.name,slot:s.slot}))});
      return;
    }
    if(!this.state||this.state.round!==this.meta.round)return;
    if(phase==='playing'&&this.state.status==='playing'){
      const listed=Object.values(this.state.players||{}).map(p=>({...p,
        segments:Array.isArray(p.segments)?p.segments:Object.values(p.segments||{})}));
      if(!listed.some(p=>p.id===this.uid))return;
      const msLeft=Math.max(0,(this.meta.endsAt||this.now())-this.now());
      if(this.currentRound!==this.meta.round||this.clientPhase!=='playing'){
        this.currentRound=this.meta.round;this.clientPhase='playing';
        this.send({type:'started',msLeft,players:listed,matchMode:this.meta.matchMode||'team'});
      }else{
        if(this.wasPaused&&this.meta.online!==false){this.send({type:'resumed'});this.wasPaused=false;}
        this.send({type:'state',msLeft,players:listed,matchMode:this.meta.matchMode||'team'});
      }
      if(this.meta.host===this.uid&&!this.host){
        this.host=new HostController(this,this.state);
        this.host.start();
      }
      return;
    }
    if(phase==='ended'&&this.state.status==='ended'&&this.clientPhase!=='ended'){
      this.clientPhase='ended';
      if(this.host){this.host.stop();this.host=null;}
      this.send({type:'ended',matchMode:this.state.matchMode||this.meta.matchMode||'team',winnerTeam:this.state.winnerTeam??-1,teamScores:this.state.teamScores||[0,0],
        reason:this.state.reason||'time',ranking:this.state.ranking||[]});
    }
  }
  async start(){
    if(this.meta?.host!==this.uid||this.meta.phase!=='lobby')return;
    this.busy=true;
    try{
      const changed=await runTransaction(this.root('meta'),m=>{
        if(!m||m.host!==this.uid||m.phase!=='lobby')return;
        return {...m,phase:'starting'};
      },{applyLocally:false});
      if(!changed.committed)return;
      const all=(await get(this.root('seats'))).val()||{};
      if(Object.values(all).filter(p=>!p.bot).length<1)throw Error('최소 1명이 필요해요.');
      const open=[0,1,2,3].filter(slot=>!all[slot]);
      const want=open.length; // 남은 좌석을 모두 AI로 채워 정확한 2:2 팀전 시작
      const botNames=['젤리봇','라임봇','팝콘봇','크림봇'];
      for(let i=0;i<want;i++){
        const slot=open[i];
        const s={uid:`bot-${slot}`,name:botNames[i],slot,bot:true};
        await set(this.root(`seats/${slot}`),s);all[slot]=s;
      }
      const newRound=(this.meta.round||0)+1;
      const gameMode=this.meta.matchMode==='ffa'?'ffa':'team';
      const players=Object.fromEntries(Object.values(all).map(s=>[s.uid,createPlayer(s,gameMode)]));
      const startedAt=this.now();
      await set(this.root('state'),{round:newRound,status:'playing',matchMode:gameMode,players,msLeft:ROUND_MS});
      await update(this.root('meta'),{phase:'playing',round:newRound,startedAt,
        endsAt:startedAt+ROUND_MS,online:true});
    }catch(e){console.error(e);this.error('경기 시작 실패: '+(e.code||e.message));
      await update(this.root('meta'),{phase:'lobby'}).catch(()=>{});
    }finally{this.busy=false;}
  }
  async setMatchMode(requestedMode){
    if(this.meta?.host!==this.uid||this.meta.phase!=='lobby')return;
    const selected=requestedMode==='ffa'?'ffa':'team';
    try{await runTransaction(this.root('meta'),m=>
      m&&m.host===this.uid&&m.phase==='lobby'?{...m,matchMode:selected}:undefined,
      {applyLocally:false});}
    catch(e){this.error('경기 방식 변경 실패: '+(e.code||e.message));}
  }
  async setBots(n){
    if(this.meta?.host!==this.uid||this.meta.phase!=='lobby')return;
    try{await update(this.root('meta'),{botsWanted:clamp(Math.trunc(n),0,3)});}
    catch(e){this.error('봇 설정 실패: '+(e.code||e.message));}
  }
  async rematch(){
    if(this.meta?.host!==this.uid||this.meta.phase!=='ended')return;
    try{
      for(const [slot,s] of Object.entries(this.seats)){
        if(s.bot)await remove(this.root(`seats/${slot}`));
      }
      await update(this.root('meta'),{phase:'lobby',startedAt:0,endsAt:0});
      this.clientPhase='lobby';
      this.lastShots={};
    }catch(e){this.error('재대결 준비 실패: '+(e.code||e.message));}
  }
  async command(type,data={}){
    if(this.meta?.phase!=='playing'||!this.code)return;
    const cmd={type,round:this.round,at:serverTimestamp()};
    if(type==='shoot'){cmd.yaw=Number(data.yaw);cmd.pitch=Number(data.pitch);
    }
    if(type==='quizAnswer'){
      cmd.id=String(data.id||'').slice(0,80);
      cmd.choice=Number(data.choice);
    }
    try{await set(push(this.root(`commands/${this.uid}`)),cmd);}
    catch(e){this.error('명령 전송 오류: '+(e.code||e.message));}
  }
  async sendPose(p){
    if(this.meta?.phase!=='playing'||!poseOk(p))return;
    // 매 100 ms 이하로만 전송해 학교 Wi-Fi 및 DB 다운로드를 절약합니다.
    const now=performance.now();if(now-(this.lastPoseTime||0)<100)return;
    this.lastPoseTime=now;
    try{await set(this.root(`poses/${this.uid}`),{
      x:+p.x.toFixed(3),z:+p.z.toFixed(3),yaw:+p.yaw.toFixed(4),
      pitch:+p.pitch.toFixed(4),slide:!!p.slide,slot:this.mySlot,seq:++this.poseSeq
    });}
    catch(e){if(e.code==='PERMISSION_DENIED'&&this.meta?.phase!=='playing')return;
      if(this.poseSeq%30===0)console.warn('pose write:',e);
    }
  }
  async leave(){
    this.left=true;
    if(this.host){this.host.stop();this.host=null;}
    if(this.code&&this.mySlot>=0){
      try{await remove(this.root(`seats/${this.mySlot}`));}catch{}
      try{await remove(this.root(`poses/${this.uid}`));}catch{}
      if(this.meta?.host===this.uid){
        try{await update(this.root('meta'),{online:false});}catch{}
      }
    }
    for(const unsub of this.unsubs){try{unsub();}catch{}}
  }
  action(type,params={}){
    if(type==='create')return this.create(params.name,params.matchMode);
    if(type==='join')return this.join(params.name,params.code);
    if(type==='start')return this.start();
    if(type==='rematch')return this.rematch();
    if(type==='setBots')return this.setBots(params.count);
    if(type==='setMatchMode')return this.setMatchMode(params.matchMode);
    if(type==='pose')return this.sendPose(params);
    if(['quizRequest','quizAnswer','shoot'].includes(type))return this.command(type,params);
  }
}

class HostController {
  constructor(arena,snapshot){
    this.arena=arena;this.round=snapshot.round;this.gameMode=snapshot.matchMode||arena.meta?.matchMode||'team';
    this.players=Object.fromEntries(Object.values(snapshot.players||{}).map(p=>[
      p.id,{...p,segments:Array.isArray(p.segments)?p.segments:Object.values(p.segments||{}),
        lastShot:0,lastPoseAt:0,lastPoseSeq:0,botNext:0,botAmmo:0,botOffset:Math.random()*6.28}
    ]));
    this.pending=new Map();this.subs=[];this.stopped=false;this.lastTick=performance.now();
    this.lastState=0;this.writeBusy=false;this.roundEnded=false;this.seq={};
  }
  start(){
    for(const p of Object.values(this.players)){
      if(p.bot)continue;
      this.subs.push(onChildAdded(this.arena.root(`commands/${p.id}`),snap=>{
        const cmd=snap.val();if(cmd)this.onCommand(p.id,snap.key,cmd);
      },e=>console.warn('commands read:',e)));
    }
    this.subs.push(onValue(this.arena.root('poses'),snap=>{
      const poses=snap.val()||{};
      for(const [uid,pose] of Object.entries(poses))this.acceptPose(uid,pose);
    }));
    this.timer=setInterval(()=>this.tick(),110);
  }
  stop(){this.stopped=true;clearInterval(this.timer);
    for(const unsub of this.subs)try{unsub();}catch{}
    this.subs=[];
  }
  checkLeavers(){
    if(this.stopped||this.roundEnded||this.arena.meta?.phase!=='playing')return;
    const still=new Set(Object.values(this.arena.seats||{}).map(s=>s.uid));
    let changed=false;
    let forfeitingTeam=-1;
    for(const [id,player] of Object.entries(this.players)){
      if(!still.has(id)&&!player.bot){
        if(this.gameMode==='ffa'){
          // 개인전 참가자가 나가도 경기 유지: 해당 자리는 AI가 이어서 플레이.
          player.bot=true;player.name=(player.name.slice(0,7)+' AI');
          player.botNext=0;player.botAmmo=0;player.botOffset=Math.random()*6.28;
          changed=true;
        }else{
          forfeitingTeam=player.team;
          delete this.players[id];changed=true;
        }
      }
    }
    if(changed){
      if(this.gameMode==='team')this.endRound(forfeitingTeam===-1?-1:1-forfeitingTeam,'left');
      else void this.flush(true);
    }
  }
  acceptPose(uid,pose){
    const p=this.players[uid];
    if(!p||p.bot||p.deadUntil>0||!pose||!poseOk(pose)||pose.slot!==p.slot)return;
    if(!Number.isInteger(pose.seq)||pose.seq<=(p.lastPoseSeq||0))return;
    const now=this.arena.now();
    const dt=clamp((now-(p.lastPoseAt||now-120))/1000,.08,.35);
    const reach=8.5*dt+.08;
    const dx=pose.x-p.x,dz=pose.z-p.z,dist=Math.hypot(dx,dz);
    const scale=dist>reach?reach/dist:1;
    const nx=p.x+dx*scale,nz=p.z+dz*scale;
    if(serverCanStand(nx,p.z))p.x=nx;
    if(serverCanStand(p.x,nz))p.z=nz;
    p.yaw=((pose.yaw+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
    p.pitch=clamp(pose.pitch,-.98,.98);p.slide=!!pose.slide;
    p.lastPoseSeq=pose.seq;p.lastPoseAt=now;
  }
  async onCommand(uid,key,cmd){
    if(this.stopped)return;
    try{
      if(cmd.round!==this.round||typeof cmd.at!=='number'||
        Math.abs(this.arena.now()-cmd.at)>6500)return;
      const p=this.players[uid];if(!p||p.bot||this.roundEnded)return;
      if(cmd.type==='shoot'){
        if(Number.isFinite(cmd.yaw)&&Math.abs(cmd.yaw)<1000) p.yaw=cmd.yaw;
        if(Number.isFinite(cmd.pitch)&&Math.abs(cmd.pitch)<=1.1) p.pitch=cmd.pitch;
        this.shoot(p);
      }
      else if(cmd.type==='quizRequest')await this.quizRequest(p);
      else if(cmd.type==='quizAnswer')await this.quizAnswer(p,cmd);
    }catch(e){console.warn('host command:',e);}
    finally{
      try{await remove(this.arena.root(`commands/${uid}/${key}`));}catch(e){console.warn('command cleanup:',e);}
    }
  }
  async quizRequest(p){
    let q=this.pending.get(p.id);
    if(!q){q=makeQuestion();this.pending.set(p.id,q);}
    const {correct,hint,...publicQuiz}=q;
    await set(this.arena.root(`challenges/${p.id}`),{...publicQuiz,round:this.round});
  }
  async quizAnswer(p,cmd){
    const q=this.pending.get(p.id);
    if(!q||q.id!==cmd.id||!Number.isInteger(cmd.choice)||cmd.choice<0||cmd.choice>3)return;
    this.pending.delete(p.id);
    const correct=cmd.choice===q.correct;
    if(correct){p.correct++;p.ammo=clamp(p.ammo+3,0,24);}
    // 문제는 클라이언트에서 검사하지 않으며, 정답 인덱스는 Firebase에 저장하지 않습니다.
    await set(this.arena.root(`feedback/${p.id}`),{
      round:this.round,id:q.id,correct,ammo:p.ammo,hint:q.hint,
      message:correct?'정답! 물감 총알 +3':'아쉬워요! 두 항에 같은 수를 곱하거나 나누는 방법을 다시 생각해 보세요.'
    });
    await this.flush(true);
  }
  shoot(p){
    const now=this.arena.now();
    if(this.roundEnded||p.deadUntil>0||p.ammo<=0||now-(p.lastShot||0)<SHOT_COOLDOWN)return;
    p.ammo--;p.lastShot=now;
    // 팀전: 아군 제외 / 개인전: 본인 제외. 아웃 상태인 적은 무적.
    const {target,from,to}=traceShot(p,Object.values(this.players)
      .filter(t=>t.team!==p.team && !t.deadUntil));
    let knockedOut=false;
    if(target){
      p.hits++;
      const eligible=target.segments.map((owner,i)=>owner===p.team?-1:i).filter(i=>i>=0);
      if(eligible.length){
        const slot=eligible[rand(0,eligible.length-1)];
        target.segments[slot]=p.team;
        // 같은 공격 색으로 6칸 모두 칠한 마지막 공격자에게만 아웃 점수를 줌.
        if(target.segments.length===6&&target.segments.every(owner=>owner===p.team)){
          p.kills=(p.kills||0)+1;
          target.deaths=(target.deaths||0)+1;
          target.deadUntil=now+RESPAWN_MS;
          // 보유 총알과 정답 기록은 부활 후에도 유지합니다.
          knockedOut=true;
        }
      }
    }
    this.seq[p.id]=(this.seq[p.id]||0)+1;
    set(this.arena.root(`events/${p.id}`),{
      seq:this.seq[p.id],round:this.round,at:now,by:p.id,hit:!!target,
      from,to,target:target?target.id:'',knockout:knockedOut,
      targetName:target?.name||''
    }).catch(e=>console.warn('shot publish:',e));
    void this.flush(true);
    // 경기 종료는 오직 제한 시간이 끝났을 때 아웃 수로 결정.
  }
  respawn(p){
    if(!p.deadUntil||this.arena.now()<p.deadUntil)return;
    const spawn=SPAWNS[p.slot];
    p.x=spawn.x;p.z=spawn.z;
    p.yaw=Math.atan2(spawn.x,spawn.z);p.pitch=0;
    p.segments=Array(6).fill('');
    p.deadUntil=0;p.spawnVersion=(p.spawnVersion||0)+1;
    p.lastPoseAt=this.arena.now();
    p.lastShot=0;
    p.botNext=this.arena.now()+900;
    void this.flush(true);
  }
  botStep(p,dt,now){
    if(p.deadUntil>0)return;
    const targets=Object.values(this.players).filter(other=>other.team!==p.team && !other.deadUntil);
    if(!targets.length)return;
    const t=targets.reduce((best,c)=>
      Math.hypot(c.x-p.x,c.z-p.z)<Math.hypot(best.x-p.x,best.z-p.z)?c:best,targets[0]);
    const dx=t.x-p.x,dz=t.z-p.z,dist=Math.hypot(dx,dz);
    const yaw=Math.atan2(-dx,-dz);
    let delta=((yaw-p.yaw+Math.PI*3)%(Math.PI*2))-Math.PI;
    p.yaw+=clamp(delta,-dt*2.5,dt*2.5);p.pitch=0;
    const orbit=p.botOffset+now*.00037;
    const mx=(dx/Math.max(dist,1))*(dist>6?1:-.45)+Math.cos(orbit)*.55;
    const mz=(dz/Math.max(dist,1))*(dist>6?1:-.45)+Math.sin(orbit)*.55;
    const size=Math.hypot(mx,mz)||1,step=dt*2.6;
    if(serverCanStand(p.x+mx/size*step,p.z))p.x+=mx/size*step;
    if(serverCanStand(p.x,p.z+mz/size*step))p.z+=mz/size*step;
    if(now>(p.botAmmo||0)){p.ammo=Math.min(6,p.ammo+1);p.botAmmo=now+rand(4300,7000);}
    if(now>(p.botNext||0)){
      p.botNext=now+rand(1700,3600);
      if(dist<15&&p.ammo&&Math.random()<.54){
        p.yaw=yaw+(Math.random()<.6?(Math.random()-.5)*.10:(Math.random()-.5)*.85);
        this.shoot(p);
      }
    }
  }
  tick(){
    if(this.stopped||this.roundEnded||this.arena.meta?.phase!=='playing')return;
    const now=performance.now();const dt=clamp((now-this.lastTick)/1000,0,.2);
    this.lastTick=now;
    const msLeft=Math.max(0,(this.arena.meta?.endsAt||0)-this.arena.now());
    if(msLeft<=0){this.endRound(null,'time');return;}
    for(const p of Object.values(this.players)){
      if(p.deadUntil>0){this.respawn(p);continue;}
      if(p.bot)this.botStep(p,dt,this.arena.now());
    }
    if(now-this.lastState>145)this.flush();
  }
  async flush(force=false){
    if(this.stopped||this.roundEnded||this.writeBusy)return;
    const now=performance.now();if(!force&&now-this.lastState<145)return;
    this.lastState=now;this.writeBusy=true;
    try{
      const players=Object.fromEntries(calculateRanking(this.players,this.gameMode).map(p=>{
        const {lastShot,lastPoseAt,lastPoseSeq,botNext,botAmmo,botOffset,...publicP}=p;
        return [p.id,publicP];
      }));
      await set(this.arena.root('state'),{
        round:this.round,status:'playing',matchMode:this.gameMode,msLeft:Math.max(0,this.arena.meta.endsAt-this.arena.now()),players
      });
    }catch(e){console.warn('broadcast:',e)}
    finally{this.writeBusy=false;}
  }
  async endRound(winnerTeam,reason){
    if(this.roundEnded||this.stopped)return;
    this.roundEnded=true;
    const ranking=calculateRanking(this.players,this.gameMode);
    const teamScores=calculateTeamScores(this.players,this.gameMode);
    const top=Math.max(...teamScores);
    const leaders=teamScores.map((score,i)=>score===top?i:-1).filter(i=>i>=0);
    const selected=reason==='time'
      ?(leaders.length===1?leaders[0]:-1)
      :(winnerTeam>=0&&winnerTeam<(this.gameMode==='ffa'?4:2)?winnerTeam:-1);
    try{
      const data={round:this.round,status:'ended',matchMode:this.gameMode,
        players:Object.fromEntries(ranking.map(p=>[p.id,p])),
        ranking,teamScores,winnerTeam:selected,reason,msLeft:0};
      await set(this.arena.root('state'),data);
      await update(this.arena.root('meta'),{phase:'ended',winnerTeam:selected,reason});
    }catch(e){console.error('end round:',e);this.arena.error('경기 종료 저장 실패: '+e.message);}
  }

}

/** AI practice automatically runs without an API key. It shares the production game rules. */
class DemoArena {
  constructor(dispatch){this.dispatch=dispatch;this.uid='local-teacher';this.code='DEMO01';this.mode='team';this.round=0;this.phase='intro';this.offset=0;this.players={};this.pending=null;this.loop=null;this.last=performance.now();this.started=0;}
  send(message){this.dispatch(message);}
  connect(){queueMicrotask(()=>this.send({type:'connected',demo:true}));}
  roster(){return [{id:this.uid,name:this.name||'플레이어',slot:0}];}
  announceLobby(){this.send({type:'lobby',code:this.code,hostId:this.uid,matchMode:this.mode,botsWanted:3,players:this.roster()});}
  create(name,matchMode){this.name=safeName(name);this.mode=matchMode==='ffa'?'ffa':'team';this.phase='lobby';this.send({type:'joined',id:this.uid,code:this.code});this.announceLobby();}
  start(){
    if(this.phase!=='lobby')return;
    this.round++;this.phase='playing';this.started=Date.now();this.pending=null;
    const seats=[{uid:this.uid,name:this.name,slot:0,bot:false},
      {uid:'demo-blue',name:'블루 스카이',slot:1,bot:true},{uid:'demo-yellow',name:'핑크 스파크',slot:2,bot:true},
      {uid:'demo-green',name:'터보 라임',slot:3,bot:true}];
    this.players=Object.fromEntries(seats.map(s=>[s.uid,createPlayer(s,this.mode)]));
    for(const p of Object.values(this.players)){p.botNext=Date.now()+1000+Math.random()*1500;p.botAmmo=Date.now()+1800;p.botOffset=Math.random()*Math.PI*2;}
    this.send({type:'started',msLeft:ROUND_MS,players:this.snapshot(),matchMode:this.mode});
    clearInterval(this.loop);this.last=performance.now();this.loop=setInterval(()=>this.tick(),100);
  }
  snapshot(){return Object.values(this.players).map(p=>({...p,segments:[...p.segments]}));}
  state(){this.send({type:'state',msLeft:Math.max(0,ROUND_MS-(Date.now()-this.started)),players:this.snapshot(),matchMode:this.mode});}
  shoot(p){
    const now=Date.now();if(p.deadUntil>0||p.ammo<1||now-(p.lastShot||0)<SHOT_COOLDOWN)return;
    p.ammo--;p.lastShot=now;
    const {target,from,to}=traceShot(p,Object.values(this.players).filter(t=>t.team!==p.team&&!t.deadUntil));
    let knockout=false;
    if(target){
      p.hits++;
      const possible=target.segments.map((owner,i)=>owner===p.team?-1:i).filter(i=>i>=0);
      if(possible.length){target.segments[possible[Math.floor(Math.random()*possible.length)]]=p.team;
        if(target.segments.every(owner=>owner===p.team)){
          p.kills++;target.deaths++;target.deadUntil=now+RESPAWN_MS;knockout=true;
        }
      }
    }
    this.send({type:'shot',by:p.id,from,to,hit:!!target,target:target?.id||'',knockout,targetName:target?.name||''});
    if(target)this.send({type:'paint',by:p.id,to:target.id});this.state();
  }
  botMove(p,dt,now){
    const enemies=Object.values(this.players).filter(t=>t.id!==p.id&&t.team!==p.team&&!t.deadUntil);
    if(!enemies.length)return;
    const target=enemies.reduce((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)<Math.hypot(b.x-p.x,b.z-p.z)?a:b);
    const dx=target.x-p.x,dz=target.z-p.z,dist=Math.hypot(dx,dz);
    const yaw=Math.atan2(-dx,-dz),angle=((yaw-p.yaw+Math.PI*3)%(Math.PI*2))-Math.PI;
    p.yaw+=clamp(angle,-dt*3.2,dt*3.2);p.pitch=-.025;
    const orbit=p.botOffset+now*.00034;
    const mx=(dx/Math.max(1,dist))*(dist>6?1:-.55)+Math.cos(orbit)*.73;
    const mz=(dz/Math.max(1,dist))*(dist>6?1:-.55)+Math.sin(orbit)*.73;
    const mag=Math.max(1,Math.hypot(mx,mz)),speed=3.2*dt;
    if(serverCanStand(p.x+mx/mag*speed,p.z))p.x+=mx/mag*speed;
    if(serverCanStand(p.x,p.z+mz/mag*speed))p.z+=mz/mag*speed;
    if(now>p.botAmmo){p.ammo=Math.min(7,p.ammo+2);p.botAmmo=now+3000+Math.random()*1400;}
    if(now>p.botNext){p.botNext=now+1150+Math.random()*2100;
      if(dist<23&&p.ammo&&Math.random()<.77){p.yaw=yaw+(Math.random()-.5)*.12;this.shoot(p);}
    }
  }
  tick(){
    if(this.phase!=='playing')return;
    const now=Date.now(),frame=performance.now();const dt=Math.min(.2,(frame-this.last)/1000);this.last=frame;
    for(const p of Object.values(this.players)){
      if(p.deadUntil){if(now>=p.deadUntil){
        const spawn=SPAWNS[p.slot];p.x=spawn.x;p.z=spawn.z;p.yaw=Math.atan2(spawn.x,spawn.z);p.pitch=0;p.deadUntil=0;p.segments=Array(6).fill('');p.spawnVersion++;
      }continue;}
      if(p.bot)this.botMove(p,dt,now);
    }
    if(now-this.started>=ROUND_MS){this.finish();return;}
    this.state();
  }
  finish(){
    if(this.phase!=='playing')return;this.phase='ended';clearInterval(this.loop);
    const ranking=calculateRanking(this.players,this.mode),teamScores=calculateTeamScores(this.players,this.mode);
    const top=Math.max(...teamScores),leaders=teamScores.map((s,i)=>s===top?i:-1).filter(i=>i>=0);
    this.send({type:'ended',matchMode:this.mode,ranking,teamScores,winnerTeam:leaders.length===1?leaders[0]:-1,reason:'time'});
  }
  action(type,params={}){
    if(type==='create')return this.create(params.name,params.matchMode);
    if(type==='join')return this.send({type:'error',message:'AI 연습 모드예요. 4인 온라인 대전은 config.js에 Firebase API 키를 입력해 주세요.'});
    if(type==='setMatchMode'){if(this.phase==='lobby'){this.mode=params.matchMode==='ffa'?'ffa':'team';this.announceLobby();}return;}
    if(type==='start')return this.start();
    if(type==='rematch'){clearInterval(this.loop);this.phase='lobby';this.announceLobby();return;}
    if(type==='pose'){const p=this.players[this.uid];if(this.phase==='playing'&&p&&!p.deadUntil&&poseOk(params))Object.assign(p,params);return;}
    if(this.phase!=='playing')return;
    const p=this.players[this.uid];if(!p)return;
    if(type==='shoot'){if(Number.isFinite(params.yaw))p.yaw=params.yaw;if(Number.isFinite(params.pitch))p.pitch=params.pitch;this.shoot(p);return;}
    if(type==='quizRequest'){
      if(p.deadUntil)return;this.pending=makeQuestion();const {correct,hint,...publicQuiz}=this.pending;
      this.send({type:'quiz',...publicQuiz,round:this.round});return;
    }
    if(type==='quizAnswer'){
      const q=this.pending;if(!q||q.id!==params.id||!Number.isInteger(params.choice))return;
      const right=params.choice===q.correct;this.pending=null;
      if(right){p.correct++;p.ammo=Math.min(24,p.ammo+3);}
      this.send({type:'quizResult',id:q.id,round:this.round,correct:right,ammo:p.ammo,hint:q.hint,
        message:right?'정답! 물감 총알 +3':'틀렸어요. 두 항에 같은 수를 곱하거나 나누는 방법을 확인하세요.'});
      this.state();
    }
  }
  async leave(){clearInterval(this.loop);}
}

let bridge=null;
function socketConnect(dispatch){
  bridge=isConfigured()?new FirebaseArena(dispatch):new DemoArena(dispatch);
  return bridge.connect();
}
function emit(type,params={}){
  if(!bridge)return false;
  void bridge.action(type,params);
  return true;
}
function leaveArena(){return bridge?.leave()||Promise.resolve();}

const connectFirebase=socketConnect;
const COLOR_CLASH_BUILD='2026-11-04-ko-fix-2';
console.info('COLOR CLASH build:',COLOR_CLASH_BUILD);
/* COLOR CLASH | GitHub Pages + Firebase Realtime Database · 3rd person 3D */
const $=id=>document.getElementById(id);
const TEAM_COLORS=['#ff5e95','#3baff1','#f6bd45','#32c4ad'];
const TEAM_NAMES=['빨강팀','파랑팀','노랑','초록'];
const SOLO_NAMES=['빨강','파랑','노랑','초록'];
let COLORS=[TEAM_COLORS[0],TEAM_COLORS[1],TEAM_COLORS[0],TEAM_COLORS[1]];
let currentMatchMode='team';
const isFFA=()=>currentMatchMode==='ffa';
const modeName=(team)=>isFFA()?`${SOLO_NAMES[team]||'알 수 없는'}색`:(TEAM_NAMES[team]||'알 수 없는 팀');
const maxPaintScore=()=>6; // 한 사람의 아웃 조건: 같은 색 6칸
function setCurrentMatchMode(choice){
  const desired=choice==='ffa'?'ffa':'team';
  if(desired===currentMatchMode)return;
  currentMatchMode=desired;
  COLORS=currentMatchMode==='ffa'?[...TEAM_COLORS]:[TEAM_COLORS[0],TEAM_COLORS[1],TEAM_COLORS[0],TEAM_COLORS[1]];
}
let THREE,renderer,scene,camera,weapon,weaponBarrel;
// 로컬 플레이어는 1인칭으로 보고 손에 든 총만 카메라 앞에 표시합니다.
let mode='intro',myId='',roomCode='',hostId='',status='lobby';
let players=[],avatarMap=new Map(),paintFX=[],shotsFX=[],myPose={x:0,z:12,yaw:0,pitch:0};
let mySpawnVersion=0,myKnockoutShown=false;
let lastFrame=performance.now(),lastPose=0,frameDt=0,lastShoot=0,clockTime=240000;
let gameActive=false,quizOpen=false,quizSubmitted=false,activeQuiz=null;
let isTouch=window.matchMedia('(pointer:coarse)').matches;
let lookPointer=null,mouseLocked=false,joystickState={x:0,y:0};
const keys=new Set();
const ui={intro:$('screenIntro'),lobby:$('screenLobby'),end:$('screenEnd'),hud:$('hud'),
  quiz:$('quizPanel'),help:$('helpOverlay')};
const setVisible=(el,show)=>{
  if(!el)return;
  el.classList.toggle('hidden',!show);
  // 별도로 관리하여 시작 직후 아웃 화면이 남아 있지 않게 함
  if(el.id==='knockoutOverlay'){
    el.hidden=!show;
    el.style.setProperty('display',show?'flex':'none','important');
  }
};
const showScreen=(next)=>{mode=next;setVisible(ui.intro,next==='intro');setVisible(ui.lobby,next==='lobby');setVisible(ui.end,next==='ended');setVisible(ui.hud,next==='playing');
  setVisible($('crosshair'),next==='playing'&&!quizOpen);
  $('crosshair').classList.toggle('visible',next==='playing'&&!quizOpen);};
function notify(message,kind=''){
  const wrap=$('toastStack'),div=document.createElement('div');div.className='toast '+kind;
  div.textContent=message;wrap.appendChild(div);setTimeout(()=>div.remove(),2050);
}
function handleMessage(m){
  if(m.type==='connected'){$('connStatus').innerHTML=m.demo?'<i></i> AI 연습 모드':'<i></i> FIREBASE ONLINE';return;}
  if(m.type==='joined'){
    myId=m.id;roomCode=m.code;showScreen('lobby');$('displayCode').textContent=m.code;
    return;
  }
  if(m.type==='lobby'){
    hostId=m.hostId;roomCode=m.code;setCurrentMatchMode(m.matchMode);
    showScreen('lobby');renderLobby(m);return;
  }
  if(m.type==='started'){
    status='playing';gameActive=true;clockTime=m.msLeft;setCurrentMatchMode(m.matchMode);
    players=m.players;setVisible($('knockoutOverlay'),false);myKnockoutShown=false;initRound(m.players);showScreen('playing');updateKnockoutState();
    if(isTouch){$('shootHint').textContent='경기장을 짧게 터치하면 그 위치로 발사! 드래그는 시점 회전';
      setTimeout(()=>setVisible($('shootHint'),false),4200);}
    else{$('shootHint').textContent='트랙패드 클릭/터치 = 해당 지점 발사 · 드래그 = 시점 회전';setVisible($('shootHint'),true);}
    notify('배틀 시작! Q를 눌러 총알부터 모아보세요.','good');return;
  }
  if(m.type==='state'){
    if(mode!=='playing')return;
    clockTime=m.msLeft;setCurrentMatchMode(m.matchMode);
    players=m.players;
    syncRespawnPose();synchronizeAvatars();updateHUD();updateKnockoutState();return;
  }
  if(m.type==='shot'){
    if(mode!=='playing')return;
    bulletTrail(m.from,m.to,m.by,m.hit);
    const shooterAvatar=avatarMap.get(m.by);if(shooterAvatar)shooterAvatar.recoil=.26;
    if(m.by===myId){kickGun();if(m.hit){flashMarker();playSound('hit');}if(m.knockout)notify(`${m.targetName||'상대'} 아웃! +1점`,'good');}
    return;
  }
  if(m.type==='paint'){
    if(mode!=='playing')return;
    const p=players.find(p=>p.id===m.to);
    const attacker=players.find(p=>p.id===m.by);
    if(p)paintBurst(p.x,p.z,attacker?TEAM_COLORS[attacker.team]:'#ff709b');
    const hitAvatar=avatarMap.get(m.to);if(hitAvatar)hitAvatar.hitAnim=.35;
    if(m.to===myId){
      const flash=$('hitFlash');flash.classList.remove('active');void flash.offsetWidth;flash.classList.add('active');
      setTimeout(()=>flash.classList.remove('active'),220);
      if(!players.find(v=>v.id===myId)?.deadUntil)notify(`${attacker?.name||'상대'}의 물감에 맞았어요!`,'bad');playSound('damage');
    }
    return;
  }
  if(m.type==='quiz'){activeQuiz=m;quizSubmitted=false;renderQuiz(m);return;}
  if(m.type==='quizResult'){renderQuizResult(m);return;}
  if(m.type==='ended'){if(document.pointerLockElement===$('world'))document.exitPointerLock();gameActive=false;status='ended';setCurrentMatchMode(m.matchMode);closeQuiz();setVisible($('knockoutOverlay'),false);renderEnd(m);showScreen('ended');playSound('end');return;}
  if(m.type==='paused'){gameActive=false;return;}
  if(m.type==='resumed'){gameActive=true;notify('방장 연결이 복구됐어요.','good');return;}
  if(m.type==='error'){notify(m.message,'bad');return;}
}
function renderLobby(data){
  const myHost=myId===hostId;
  setCurrentMatchMode(data.matchMode);
  $('lobbyMatchMode').value=currentMatchMode;
  $('lobbyMatchMode').disabled=!myHost;
  $('lobbyDescription').textContent=isFFA()
    ?'최대 4명 모두 다른 색으로 경쟁합니다. 다른 세 명을 내 색으로 칠해 보세요! 빈자리는 AI가 채웁니다.'
    :'친구에게 방 코드를 공유하세요. 빨강팀 2명 vs 파랑팀 2명! 빈자리는 AI가 채웁니다.';
  $('lobbyBotTitle').textContent=isFFA()?'개인별 다른 색 · 최대 4인':'자동 팀 구성 · 2명 vs 2명';
  $('lobbyBotDetails').textContent=isFFA()?'① 빨강 / ② 파랑 / ③ 노랑 / ④ 초록 · 빈자리는 AI 충원'
    :'①·③ 빨강팀 / ②·④ 파랑팀 · 빈자리는 AI 충원';
  $('lobbyNote').textContent=isFFA()
    ?'개인전: 한 사람을 같은 색 6칸으로 칠하면 아웃 +1점. 2초 후 부활하며 4분 뒤 아웃 수가 많은 사람이 승리!'
    :'팀전: 아군 피해 없음. 적을 같은 색 6칸으로 칠하면 팀에 +1점! 2초 후 부활하며 4분 뒤 팀 아웃 수로 승부!';
  const wrap=$('lobbyPlayers');wrap.replaceChildren();
  for(let slot=0;slot<4;slot++){
    const p=data.players.find(p=>p.slot===slot);
    const el=document.createElement('div');el.className='lobby-player'+(!p?' empty':'');
    const color=document.createElement('div');color.className='player-dot';
    color.style.background=COLORS[slot];color.textContent=p?'✦':String(slot+1);
    const details=document.createElement('div'),title=document.createElement('b'),sub=document.createElement('small');
    const team=isFFA()?slot:slot%2;
    title.textContent=p?p.name:'AI 대기';
    sub.textContent=`${modeName(team)} · `+(p?(p.id===data.hostId?'방장':p.id===myId?'나':'참가 완료'):'미입장 시 AI 자동 충원');
    details.append(title,sub);el.append(color,details);wrap.append(el);
  }
  setVisible($('startGame'),myHost);
  setVisible($('waitingHost'),!myHost);
  $('displayCode').textContent=data.code;
  $('copyRoom').textContent='초대 링크 복사 ↗';
}

function renderEnd(data){
  const scores=data.teamScores||calculateTeamScores(data.ranking||[],currentMatchMode);
  const myTeam=players.find(p=>p.id===myId)?.team;
  const winnerTeam=data.winnerTeam??-1;
  const win=winnerTeam>=0&&winnerTeam===myTeam;
  const winner=data.ranking?.find(p=>p.team===winnerTeam);
  $('endEyebrow').textContent='ROUND COMPLETE · KNOCKOUT SCORE';
  $('winnerTitle').textContent=winnerTeam===-1?'공동 1위 · 무승부! 🎨':
    win?(isFFA()?'개인전 우승! 🎉':'우리 팀 승리! 🎉'):
    (isFFA()?`${winner?.name||modeName(winnerTeam)} 우승!`:`${TEAM_NAMES[winnerTeam]} 승리!`);
  $('winnerDetail').textContent=data.reason==='left'?'참가자 퇴장으로 경기가 종료됐어요.':
    isFFA()?'4분 동안 상대를 가장 많이 아웃시킨 플레이어가 승리해요. 동점 1위는 무승부!':
    `빨강팀 ${scores[0]||0}아웃 : 파랑팀 ${scores[1]||0}아웃 · 더 많은 아웃을 기록한 팀 승리!`;
  $('winnerTitle').style.color=winnerTeam===-1?'':TEAM_COLORS[winnerTeam];
  const list=$('endRanking');list.replaceChildren();
  const ranking=[...(data.ranking||[])];
  if(!isFFA())ranking.sort((a,b)=>a.team-b.team||a.slot-b.slot);
  ranking.forEach((p)=>{
    const line=document.createElement('div');line.className='rank-row';
    const num=document.createElement('strong');num.textContent=isFFA()?String(1+ranking.filter(other=>other.score>p.score).length):(p.team===0?'R':'B');
    const dot=document.createElement('span');dot.className='score-color';dot.style.background=TEAM_COLORS[p.team];
    const name=document.createElement('div');name.className='rank-name';name.textContent=p.name+(p.id===myId?' (나)':'');
    const sub=document.createElement('small');sub.textContent=`${modeName(p.team)} · 정답 ${p.correct} · 명중 ${p.hits} · 아웃당함 ${p.deaths||0}`;name.append(sub);
    const score=document.createElement('span');score.className='rank-score';score.textContent=isFFA()?`${p.kills||0} 아웃`:`개인 ${p.kills||0} / 팀 ${scores[p.team]||0}`;
    line.append(num,dot,name,score);list.append(line);
  });
  const myHost=myId===hostId;
  setVisible($('rematch'),myHost);setVisible($('rematchWaiting'),!myHost);
}
function updateHUD(){
  const myself=players.find(p=>p.id===myId);if(!myself)return;
  $('ammoCount').textContent=myself.ammo;
  const s=Math.max(0,Math.ceil(clockTime/1000));$('timeLeft').textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  $('timeLeft').parentElement.classList.toggle('urgent',s<=30);
  const wrap=$('scoreList');wrap.replaceChildren();wrap.classList.toggle('free-for-all',isFFA());
  const scores=calculateTeamScores(players,currentMatchMode);
  const best=Math.max(5,...scores);
  const groups=isFFA()?[0,1,2,3]:[0,1];
  for(const team of groups){
    const item=document.createElement('div');item.className='score-player'+(team===myself.team?' me':'');
    item.style.setProperty('--self-color',TEAM_COLORS[team]);
    const top=document.createElement('div');top.className='score-row';
    const dot=document.createElement('div');dot.className='score-color';dot.style.background=TEAM_COLORS[team];
    const name=document.createElement('span');name.className='score-name';
    const rosterPlayers=players.filter(p=>p.team===team);
    name.textContent=isFFA()?(rosterPlayers[0]?.name||modeName(team))+(team===myself.team?' · 나':''):
      TEAM_NAMES[team]+(team===myself.team?' · 우리 팀':'');
    const val=document.createElement('span');val.className='score-val';val.textContent=`${scores[team]||0} 아웃`;
    top.append(dot,name,val);
    const bar=document.createElement('div');bar.className='score-progress';
    const fill=document.createElement('div');fill.style.background=TEAM_COLORS[team];
    fill.style.width=`${100*(scores[team]||0)/best}%`;
    bar.append(fill);item.append(top,bar);
    if(!isFFA()){
      const roster=document.createElement('small');roster.className='team-roster';
      roster.textContent=rosterPlayers.map(p=>`${p.name}${p.id===myId?'(나)':''} ${p.kills||0}아웃${p.bot?'🤖':''}`).join(' · ');
      item.append(roster);
    }
    wrap.append(item);
  }
  const slots=Array.isArray(myself.segments)?myself.segments:Object.values(myself.segments||{});
  const counts=[0,1,2,3].map(owner=>slots.filter(v=>v===owner).length);
  const filled=Math.max(...counts);
  $('paintStatus').textContent=`${filled} / 6`;
  $('myPaintMeter').classList.toggle('paint-danger',filled>=4);
  Array.from($('paintSlots').children).forEach((cell,i)=>{
    const owner=slots[i];cell.style.background=Number.isInteger(owner)&&owner>=0&&owner<4?TEAM_COLORS[owner]:'#e1e8f3';
  });
  drawMinimap();
}
function serverNowClient(){return Date.now()+(bridge?.offset||0);}
function syncRespawnPose(){
  const me=players.find(p=>p.id===myId);if(!me)return;
  if((me.spawnVersion||0)!==mySpawnVersion){
    mySpawnVersion=me.spawnVersion||0;
    myPose={x:me.x,z:me.z,yaw:me.yaw,pitch:0,slide:false};walkingVelocity={x:0,z:0};slideExpires=0;
    keys.clear();joystickState={x:0,y:0};$('joystickKnob').style.transform='';
    if(mode==='playing')notify('부활! 다시 배틀에 참여하세요.','good');
  }
}
function updateKnockoutState(){
  const overlay=$('knockoutOverlay');
  if(mode!=='playing'){
    setVisible(overlay,false);myKnockoutShown=false;return;
  }
  const me=players.find(p=>p.id===myId);
  const zones=Array.isArray(me?.segments)?me.segments:Object.values(me?.segments||{});
  // 아웃은 단순히 시간 값으로 판정하지 않음. 같은 상대 색 6칸도 확인.
  const sixPainted=zones.length===6 && Number.isInteger(zones[0]) &&
    zones[0]>=0 && zones[0]<4 && zones.every(c=>c===zones[0]);
  const deadline=Number(me?.deadUntil)||0;
  const remaining=Math.max(0,deadline-serverNowClient());
  const dead=Boolean(me && sixPainted && remaining>0);
  setVisible(overlay,dead);
  if(dead){
    $('respawnSecs').textContent=Math.max(1,Math.ceil(remaining/1000));
    if(!myKnockoutShown){
      myKnockoutShown=true;closeQuiz();notify('아웃! 2초 후 부활해요.','bad');
    }
  }else{
    myKnockoutShown=false;
  }
}

function drawMinimap(){
  const canvas=$('minimap'),ctx=canvas.getContext('2d');const W=canvas.width;
  ctx.clearRect(0,0,W,W);ctx.fillStyle='#e6edf9';ctx.fillRect(0,0,W,W);
  ctx.strokeStyle='#ffffffa8';ctx.lineWidth=1;
  for(let i=0;i<=8;i++){let t=i*W/8;ctx.beginPath();ctx.moveTo(t,0);ctx.lineTo(t,W);ctx.stroke();ctx.beginPath();ctx.moveTo(0,t);ctx.lineTo(W,t);ctx.stroke();}
  const xy=(x,z)=>[(x+18)*W/36,(z+18)*W/36];
  COVERS.forEach(c=>{ctx.fillStyle='#9daccb';const [x,z]=xy(c.x-c.w/2,c.z-c.d/2);ctx.fillRect(x,z,c.w*W/36,c.d*W/36)});
  players.forEach(p=>{
    const [x,z]=xy(p.x,p.z);const me=p.id===myId;
    ctx.beginPath();ctx.fillStyle=TEAM_COLORS[p.team];ctx.globalAlpha=p.deadUntil>0?.3:1;ctx.arc(x,z,me?6.4:4.8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    ctx.lineWidth=me?2.5:1.8;ctx.strokeStyle='white';ctx.stroke();
    if(me){ctx.beginPath();ctx.moveTo(x,z);ctx.lineTo(x-Math.sin(myPose.yaw)*12,z-Math.cos(myPose.yaw)*12);ctx.strokeStyle='#223657';ctx.lineWidth=2;ctx.stroke();}
  });
  ctx.strokeStyle='#a4b0c5';ctx.lineWidth=3;ctx.strokeRect(1.5,1.5,W-3,W-3);
}
function renderQuiz(q){
  setVisible($('quizFeedback'),false);setVisible($('quizNext'),false);
  $('quizQuestion').textContent=q.text;
  const container=$('quizChoices');container.replaceChildren();
  q.choices.forEach((option,i)=>{
    const button=document.createElement('button');button.className='choice';button.textContent=`${i+1}. ${option}`;
    button.addEventListener('click',()=>submitQuiz(i));container.append(button);
  });
}
function submitQuiz(i){
  if(!activeQuiz||quizSubmitted)return;
  quizSubmitted=true;
  document.querySelectorAll('.choice').forEach((el,index)=>{
    el.disabled=true;if(index===i)el.classList.add('selected');});
  activeQuiz.selected=i;
  emit('quizAnswer',{id:activeQuiz.id,choice:i});
}
function renderQuizResult(result){
  if(!activeQuiz)return;
  if(result.id && result.id!==activeQuiz.id)return;
  const selected=activeQuiz.selected;
  const choices=document.querySelectorAll('.choice');if(choices[selected])choices[selected].classList.add(result.correct?'correct':'wrong');
  const feedback=$('quizFeedback');feedback.textContent=`${result.message} ${result.hint}`;
  feedback.className='quiz-feedback '+(result.correct?'correct':'wrong');
  setVisible($('quizNext'),true);playSound(result.correct?'correct':'wrong');
}
function openQuiz(){
  if(mode!=='playing'||(players.find(p=>p.id===myId)?.deadUntil||0)>serverNowClient())return;
  quizOpen=true;setVisible(ui.quiz,true);setVisible($('myPaintMeter'),false);$('crosshair').classList.remove('visible');
  
  if(document.pointerLockElement===$('world'))document.exitPointerLock();
  if(!activeQuiz||quizSubmitted){activeQuiz=null;setVisible($('quizFeedback'),false);
    $('quizQuestion').textContent='소수·분수의 비 문제를 불러오는 중이에요.';
    $('quizChoices').replaceChildren();emit('quizRequest');}
}
function closeQuiz(){quizOpen=false;setVisible(ui.quiz,false);setVisible($('myPaintMeter'),mode==='playing');if(mode==='playing'){$('crosshair').classList.add('visible');if(!isTouch&&!mouseLocked)setVisible($('shootHint'),true);}}
function nextQuiz(){activeQuiz=null;quizSubmitted=false;setVisible($('quizFeedback'),false);setVisible($('quizNext'),false);
  $('quizQuestion').textContent='다음 문제를 불러오는 중이에요.';$('quizChoices').replaceChildren();emit('quizRequest');}
function toggleQuiz(){quizOpen?closeQuiz():openQuiz()}
// [1mControls & network UI[0m
$('createRoom').addEventListener('click',()=>{
  const name=$('nickname').value.trim()||'플레이어';try{localStorage.setItem('colorClashName',name);}catch{}
  const matchMode=document.querySelector('input[name="matchMode"]:checked')?.value||'team';
  emit('create',{name,matchMode});
});
$('joinRoom').addEventListener('click',()=>{
  const code=$('joinCode').value.trim().toUpperCase();if(code.length!==6)return notify('6자리 방 코드를 입력해 주세요.','bad');
  const name=$('nickname').value.trim()||'플레이어';try{localStorage.setItem('colorClashName',name);}catch{}emit('join',{name,code});
});
try{$('nickname').value=localStorage.getItem('colorClashName')||'';}catch{}
$('joinCode').addEventListener('keydown',e=>{if(e.key==='Enter')$('joinRoom').click()});
$('nickname').addEventListener('keydown',e=>{if(e.key==='Enter')$('createRoom').click()});
$('startGame').addEventListener('click',()=>emit('start'));
$('lobbyMatchMode').addEventListener('change',e=>emit('setMatchMode',{matchMode:e.target.value}));
$('copyRoom').addEventListener('click',async()=>{
  const base=window.COLOR_CLASH_APP_URL||'';
  const link=base?`${base}${base.includes('?')?'&':'?'}room=${encodeURIComponent(roomCode)}`:roomCode;
  try{
    if(!navigator.clipboard?.writeText)throw Error('clipboard blocked');
    await navigator.clipboard.writeText(link);
    notify(base?'초대 링크를 복사했어요.':'방 코드를 복사했어요.','good');
  }catch{
    const field=document.createElement('textarea');field.value=link;
    field.style.cssText='position:fixed;inset:30%;z-index:9000';
    document.body.append(field);field.select();
    let copied=false;try{copied=document.execCommand('copy');}catch{}
    field.remove();
    if(copied)notify('초대 링크를 복사했어요.','good');
    else window.prompt('링크를 길게 눌러 복사해 주세요.',link);
  }
});
$('leaveLobby').addEventListener('click',async()=>{await leaveArena();location.reload()});
$('endToHome').addEventListener('click',async()=>{await leaveArena();location.reload()});
$('rematch').addEventListener('click',()=>emit('rematch'));
$('quizOpen').addEventListener('click',toggleQuiz);$('quizClose').addEventListener('click',closeQuiz);
$('quizNext').addEventListener('click',nextQuiz);
$('mobileQuiz').addEventListener('click',toggleQuiz);
$('desktopFire').addEventListener('click',()=>shoot());
$('helpBtn').addEventListener('click',()=>{if(document.pointerLockElement===$('world'))document.exitPointerLock();setVisible(ui.help,true);});
$('helpClose').addEventListener('click',()=>setVisible(ui.help,false));
$('helpOkay').addEventListener('click',()=>setVisible(ui.help,false));
window.addEventListener('keydown',e=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
  if(e.code==='KeyQ'&&mode==='playing'&&!ui.help.classList.contains('hidden'))return;
  if(e.code==='KeyQ'&&mode==='playing'&&!e.repeat){toggleQuiz();e.preventDefault();}
  if(e.code==='Escape'&&quizOpen)closeQuiz();
  if((e.code==='Space'||e.code==='KeyF')&&mode==='playing'&&!quizOpen&&!e.repeat){shoot();e.preventDefault();}
  keys.add(e.code);
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>keys.clear());
// 기본 조작: 터치패드 클릭/터치로 해당 위치에 발사, 드래그 시점 변경. L은 FPS 마우스 잠금.
function aimAtPoint(clientX,clientY){
  if(!THREE||!camera)return null;
  const rect=$('world').getBoundingClientRect();if(rect.width<1||rect.height<1)return null;
  const cursor=new THREE.Vector2(((clientX-rect.left)/rect.width)*2-1,1-((clientY-rect.top)/rect.height)*2);
  const cast=new THREE.Raycaster();camera.updateMatrixWorld(true);cast.setFromCamera(cursor,camera);
  let best=54;
  // 터치 위치를 실제 탄도 원점에 투영합니다. FPS에서도 클릭한 점을 향해 발사합니다.
  for(const c of COVERS){
    const block=new THREE.Box3(new THREE.Vector3(c.x-c.w/2,0,c.z-c.d/2),
      new THREE.Vector3(c.x+c.w/2,c.h+.15,c.z+c.d/2));
    const found=cast.ray.intersectBox(block,new THREE.Vector3());
    if(found)best=Math.min(best,found.distanceTo(cast.ray.origin));
  }
  for(const p of players){
    if(p.id===myId||p.deadUntil>0)continue;
    const center=new THREE.Vector3(p.x,1.25,p.z),dist=cast.ray.distanceSqToPoint(center);
    if(dist>1.02*1.02)continue;
    const towards=center.clone().sub(cast.ray.origin).dot(cast.ray.direction);
    if(towards>.3)best=Math.min(best,Math.max(.3,towards-.5));
  }
  // Ground can be clicked: cap the target to the point where the ray meets y=0.
  if(cast.ray.direction.y<-.002){const distance=(0-cast.ray.origin.y)/cast.ray.direction.y;
    if(distance>2)best=Math.min(best,distance);}
  const target=cast.ray.at(best,new THREE.Vector3());
  const vec=target.sub(new THREE.Vector3(myPose.x,1.56,myPose.z)).normalize();
  return {yaw:Math.atan2(-vec.x,-vec.z),pitch:Math.asin(clamp(vec.y,-1,1))};
}
function showTapReticle(x,y){
  const reticle=$('tapReticle');reticle.style.left=x+'px';reticle.style.top=y+'px';
  reticle.classList.remove('pop');void reticle.offsetWidth;reticle.classList.add('pop');
}

// GitHub Pages does not impose Apps Script's iframe pointer-lock restriction.
// L / explicit button enable true desktop FPS aim; click still fires.
function toggleMouseMode(){
  if(mode!=='playing'||quizOpen||isTouch)return;
  if(document.pointerLockElement===$('world')){document.exitPointerLock();return;}
  $('world').requestPointerLock?.();
}
$('mouseModeBtn')?.addEventListener('click',toggleMouseMode);
window.addEventListener('keydown',event=>{
  if(event.code==='KeyC'&&!event.repeat&&mode==='playing'&&!quizOpen){
    event.preventDefault();slideExpires=performance.now()+740;
  }
  if(event.code==='KeyL'&&!event.repeat&&mode==='playing'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){
    event.preventDefault();toggleMouseMode();
  }
});
document.addEventListener('pointerlockchange',()=>{
  mouseLocked=document.pointerLockElement===$('world');
  setVisible($('cameraModeInfo'),!mouseLocked);
  $('mouseModeBtn')?.classList.toggle('active',mouseLocked);
  if(mouseLocked)setVisible($('shootHint'),false);
});
document.addEventListener('mousemove',event=>{
  if(!mouseLocked||mode!=='playing'||quizOpen)return;
  myPose.yaw-=event.movementX*.0026;
  myPose.pitch=clamp(myPose.pitch-event.movementY*.0023,-.72,.82);
});

$('world').addEventListener('contextmenu',e=>e.preventDefault());
$('world').style.touchAction='none';
$('world').addEventListener('pointerdown',e=>{
  if(mode!=='playing'||quizOpen||!gameActive)return;
  if(e.pointerType!=='touch'&&e.button!==0)return;
  if(mouseLocked){shoot();return;}
  lookPointer={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,
    drag:false,kind:e.pointerType,startAt:performance.now()};
  try{$('world').setPointerCapture(e.pointerId)}catch{}
});
$('world').addEventListener('pointermove',e=>{
  if(mouseLocked||!lookPointer||e.pointerId!==lookPointer.id||mode!=='playing'||quizOpen)return;
  const dx=e.clientX-lookPointer.x,dy=e.clientY-lookPointer.y;
  const travel=Math.hypot(e.clientX-lookPointer.startX,e.clientY-lookPointer.startY);
  const threshold=lookPointer.kind==='mouse'?8:15;
  if(travel>threshold)lookPointer.drag=true;
  // 작은 손떨림은 조준을 변경하지 않아 정확한 탭 발사가 가능하도록 합니다.
  if(lookPointer.drag){
    const sensitivity=lookPointer.kind==='mouse'?.0033:.0045;
    myPose.yaw-=dx*sensitivity;
    myPose.pitch=clamp(myPose.pitch-dy*sensitivity*.88,-.89,.89);
  }
  lookPointer.x=e.clientX;lookPointer.y=e.clientY;
});
function resetLook(e){
  if(mouseLocked||!lookPointer||e.pointerId!==lookPointer.id)return;
  const isTap=!lookPointer.drag && performance.now()-lookPointer.startAt<520 &&
    mode==='playing'&&!quizOpen&&gameActive&&e.type==='pointerup';
  lookPointer=null;
  if(isTap){
    const aimed=aimAtPoint(e.clientX,e.clientY);
    if(aimed){showTapReticle(e.clientX,e.clientY);shoot(aimed);}
    else shoot();
  }
}
$('world').addEventListener('pointerup',resetLook);
$('world').addEventListener('pointercancel',resetLook);
const joy=$('joystick');let joyID=null;
function joyMove(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  const dx=e.clientX-cx,dy=e.clientY-cy,d=Math.max(1,Math.hypot(dx,dy)),range=39;
  joystickState={x:Math.max(-1,Math.min(1,dx/range)),y:Math.max(-1,Math.min(1,dy/range))};
  const s=Math.min(range,d)/d;$('joystickKnob').style.transform=`translate(${dx*s}px,${dy*s}px)`;
}
joy.addEventListener('pointerdown',e=>{if(joyID!==null)return;joyID=e.pointerId;joy.setPointerCapture(e.pointerId);joyMove(e);});
joy.addEventListener('pointermove',e=>{if(e.pointerId===joyID)joyMove(e);});
function stopJoy(e){if(e.pointerId!==joyID)return;joyID=null;joystickState={x:0,y:0};$('joystickKnob').style.transform='';}
joy.addEventListener('pointerup',stopJoy);joy.addEventListener('pointercancel',stopJoy);
let firingHeld=false;let autoFireTimer;
$('mobileFire').addEventListener('pointerdown',e=>{e.preventDefault();firingHeld=true;shoot();
  autoFireTimer=setInterval(()=>{if(firingHeld)shoot();},420);});
for(const event of ['pointerup','pointercancel','pointerleave'])$('mobileFire').addEventListener(event,()=>{
  firingHeld=false;clearInterval(autoFireTimer);});
function shoot(aim=null){if(!gameActive||quizOpen||
  (players.find(p=>p.id===myId)?.deadUntil||0)>serverNowClient())return;
  if(Date.now()-lastShoot<405)return;
  lastShoot=Date.now();const mine=players.find(p=>p.id===myId);
  if(!mine?.ammo){notify('총알이 없어요! 소수·분수의 비 문제를 풀어보세요.');return;}
  const centerAim=aim||aimAtPoint(window.innerWidth/2,window.innerHeight/2);
  emit('shoot',{yaw:centerAim?.yaw??myPose.yaw,pitch:centerAim?.pitch??myPose.pitch});playSound('fire');
}
function flashMarker(){const el=$('hitMarker');el.classList.remove('active');void el.offsetWidth;el.classList.add('active');}
let soundCtx;
function playSound(which){
  try{soundCtx ||=new (window.AudioContext||window.webkitAudioContext)();
    if(soundCtx.state==='suspended')soundCtx.resume();
    const oscill=soundCtx.createOscillator(),gain=soundCtx.createGain(),now=soundCtx.currentTime;
    const pitches={fire:[450,180,.07],correct:[540,880,.19],wrong:[220,150,.16],hit:[750,1100,.11],damage:[170,80,.24],end:[420,690,.33]};
    const [a,b,d]=pitches[which]||pitches.fire;
    oscill.type=which==='damage'?'sawtooth':which==='correct'?'sine':'triangle';
    oscill.frequency.setValueAtTime(a,now);oscill.frequency.exponentialRampToValueAtTime(b,now+d);
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(which==='fire'?.055:.07,now+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,now+d);
    oscill.connect(gain);gain.connect(soundCtx.destination);oscill.start(now);oscill.stop(now+d+.015);
  }catch{}
}
// Three.js 3D scene
function mat(color,roughness=.74){return new THREE.MeshStandardMaterial({color,roughness,metalness:.06});}
function box(w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.castShadow=true;m.receiveShadow=true;return m;}
function sphere(radius,color,segments=16){const m=new THREE.Mesh(new THREE.SphereGeometry(radius,segments,12),mat(color));m.castShadow=true;return m;}
function cylinder(rt,rb,h,color,n=18){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),mat(color));m.castShadow=true;m.receiveShadow=true;return m;}
function labelTexture(text,color='#243c73',bg='rgba(255,255,255,0)'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;const ctx=canvas.getContext('2d');
  if(bg!=='rgba(255,255,255,0)'){ctx.fillStyle=bg;ctx.fillRect(0,0,512,160);}
  ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 63px Outfit, Arial, sans-serif';ctx.fillText(text,256,80,480);
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
function makePaintDecal(color, radius=1, seed=Math.random()){
  const shape=new THREE.Shape();
  const n=30;
  for(let i=0;i<=n;i++){
    const a=i/n*Math.PI*2;
    const wobble=1+.19*Math.sin(i*3.71+seed*100)+.1*Math.cos(i*6.4+seed*90);
    const r=radius*wobble;
    if(i===0)shape.moveTo(Math.cos(a)*r,Math.sin(a)*r);
    else shape.lineTo(Math.cos(a)*r,Math.sin(a)*r);
  }
  const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.79,depthWrite:false,side:THREE.DoubleSide}));
  mesh.rotation.x=-Math.PI/2;mesh.rotation.z=seed*6.2;
  return mesh;
}
function buildWorld(){
  const cv=$('world');renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance',alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<900?1.22:1.52));
  renderer.setSize(window.innerWidth,window.innerHeight,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.37;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene=new THREE.Scene();scene.background=new THREE.Color('#63dafa');scene.fog=new THREE.FogExp2('#87d9f5',.009);
  camera=new THREE.PerspectiveCamera(69,window.innerWidth/window.innerHeight,.07,130);
  camera.rotation.order='YXZ';scene.add(camera);
  scene.add(new THREE.HemisphereLight('#e7fbff','#6a6390',2.25));
  const sun=new THREE.DirectionalLight('#fff2e8',2.8);sun.position.set(-14,30,12);sun.castShadow=true;
  sun.shadow.mapSize.set(window.innerWidth<900?1024:2048,window.innerWidth<900?1024:2048);sun.shadow.camera.left=-33;sun.shadow.camera.right=33;
  sun.shadow.camera.top=33;sun.shadow.camera.bottom=-33;sun.shadow.camera.near=1;sun.shadow.camera.far=75;
  sun.shadow.bias=-.00035;scene.add(sun);
  const fill=new THREE.DirectionalLight('#7ccfff',.68);fill.position.set(14,10,-12);scene.add(fill);

  const floor=box(38,.48,38,'#8f9db4');floor.position.y=-.27;scene.add(floor);
  const arena=new THREE.Mesh(new THREE.PlaneGeometry(36,36),mat('#acb9cb',.92));
  arena.rotation.x=-Math.PI/2;arena.position.y=.005;arena.receiveShadow=true;scene.add(arena);
  // rooftop concrete grids: readable road markings and subtle roughness patches
  const seam=mat('#91a0b7');const lightStrip=new THREE.MeshBasicMaterial({color:'#e8f6ff',transparent:true,opacity:.38});
  for(let t=-15;t<=15;t+=5){
    const sx=box(.045,.014,36,'#7f8ba1');sx.position.set(t,.019,0);sx.castShadow=false;scene.add(sx);
    const sz=box(36,.014,.045,'#7f8ba1');sz.position.set(0,.019,t);sz.castShadow=false;scene.add(sz);
  }
  const track=new THREE.Mesh(new THREE.RingGeometry(11,11.17,96),new THREE.MeshBasicMaterial({color:'#f9e6f0',side:THREE.DoubleSide,transparent:true,opacity:.48}));
  track.rotation.x=-Math.PI/2;track.position.y=.04;scene.add(track);
  for(const [x,z] of [[-13,-13],[13,-13],[-13,13],[13,13]]){
    const a=new THREE.Mesh(new THREE.RingGeometry(1.5,1.58,48),new THREE.MeshBasicMaterial({color:'#eaf0ff',side:THREE.DoubleSide,transparent:true,opacity:.8}));
    a.rotation.x=-Math.PI/2;a.position.set(x,.05,z);scene.add(a);
  }
  // candy-pink rooftop perimeter, with safety rails and white horizontal accents
  const sides=[
    {x:0,z:-18,w:37.6,d:1.5,h:3.65},
    {x:0,z:18,w:37.6,d:1.5,h:3.65},
    {x:-18,z:0,w:1.5,d:37.6,h:3.65},
    {x:18,z:0,w:1.5,d:37.6,h:3.65}
  ];
  for(let i=0;i<sides.length;i++){
    const wall=sides[i],wallbody=box(wall.w,wall.h,wall.d,i%2?'#ff629e':'#ef4288');wallbody.position.set(wall.x,wall.h/2,wall.z);scene.add(wallbody);
    const edge=box(wall.w+.08,.26,wall.d+.08,'#fff1fa');edge.position.set(wall.x,wall.h-.14,wall.z);scene.add(edge);
    const stripe=box(wall.w+.03,.21,wall.d+.03,'#ffe0ed');stripe.position.set(wall.x,1.10,wall.z);scene.add(stripe);
    const base=box(wall.w+.10,.12,wall.d+.10,'#c83470');base.position.set(wall.x,.08,wall.z);scene.add(base);
  }
  // actual physics covers share exact positions with server authority.
  const concrete=['#949eaf','#8e99a9','#a1a9ba','#8898a9','#9ca9bb','#98a8b7','#8999a9'];
  COVERS.forEach((c,i)=>{
    const cover=new THREE.Group();cover.position.set(c.x,0,c.z);scene.add(cover);
    const body=box(c.w,c.h,c.d,concrete[i]);body.position.y=c.h/2;cover.add(body);
    const top=box(c.w+.15,.14,c.d+.15,'#cad2df');top.position.y=c.h+.06;cover.add(top);
    // broad hot-pink & cyan splashes visibly smeared across cover faces
    for(const side of [-1,1]){
      const splash=makePaintDecal(i%2?'#25cbf3':'#ff3e96',Math.min(1.35,c.w*.24),i*.23+(side>0?.07:.46));
      splash.rotation.set(0,side>0?0:Math.PI,0);
      splash.position.set((i%3-1)*.42,c.h*.60,side*(c.d/2+.014));cover.add(splash);
      const signage=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(c.w*.62,2.8),.47),
        new THREE.MeshBasicMaterial({map:labelTexture(['INK ZONE','ROOFTOP','6 HIT KO','COLOR LAB','RUN & AIM','MATH PLAY','PAINT LAB'][i],'#ffffff'),transparent:true,side:THREE.DoubleSide,depthWrite:false}));
      signage.position.set(0,c.h*.17,side*(c.d/2+.026));if(side<0)signage.rotation.y=Math.PI;cover.add(signage);
    }
    const edge=box(c.w+.05,.06,c.d+.05,i%2?'#57c9ee':'#ff7bac');edge.position.y=.12;cover.add(edge);
  });
  // Bold slanted ramps are visual rooftop features beside the combat platforms.
  for(const [x,z,rot] of [[-11,-13,.20],[11,13,-.20],[-12,6,-.13],[12,-6,.13]]){
    const ramp=box(5.5,.20,3.2,'#b3bdcd');ramp.position.set(x,.54,z);ramp.rotation.z=rot;
    ramp.castShadow=false;scene.add(ramp);
    const stripe=box(5.5,.035,.11,'#fb4b91');stripe.position.set(x,.65,z+1.3);stripe.rotation.z=rot;scene.add(stripe);
  }
  // Out-of-bounds skyline: high pink rooftop tower, bright water tower and HVAC props.
  const tower=new THREE.Group();tower.position.set(-6,0,-27);scene.add(tower);
  const towerBase=box(9,12,7,'#f94490');towerBase.position.y=6;tower.add(towerBase);
  const towerCap=box(10,1.25,8,'#ff83b6');towerCap.position.y=12.2;tower.add(towerCap);
  for(let i=-1;i<=1;i++){
    const window=box(1.05,4.3,.10,'#ffe6f0');window.position.set(i*2.1,7.2,3.55);tower.add(window);
    const inset=box(.65,3.65,.14,'#b8c9f2');inset.position.set(i*2.1,7.25,3.65);tower.add(inset);
  }
  const billboard=box(7.5,2.15,.2,'#2a3658');billboard.position.set(15,10,-24);scene.add(billboard);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(6.8,1.5),new THREE.MeshBasicMaterial({map:labelTexture('COLOR CLASH','#ffffff'),transparent:true,depthWrite:false}));
  sign.position.set(15,10,-23.87);scene.add(sign);
  const reservoir=new THREE.Group();reservoir.position.set(22,0,-26);scene.add(reservoir);
  for(const x of [-1,1])for(const z of [-1,1]){const leg=cylinder(.15,.15,7,'#c4d4eb');leg.position.set(x*1.6,3.5,z*1.6);reservoir.add(leg);}
  const drum=cylinder(2.85,2.85,4.6,'#f5e9ef',28);drum.position.y=9.4;reservoir.add(drum);
  const band=cylinder(2.90,2.90,.6,'#ed5394',28);band.position.y=10.1;reservoir.add(band);
  const band2=cylinder(2.90,2.90,.43,'#ed5394',28);band2.position.y=8.75;reservoir.add(band2);
  // Decorative paint puddles, feathered sprays, tiny droplets.
  const puddles=['#fe4590','#30c5f2','#ffcf48','#27d7ba'];
  for(let i=0;i<85;i++){
    const x=Math.sin(i*12.9898)*15.7,z=Math.cos(i*7.233)*15.7;
    const radius=.26+(i%7)*.14;
    const d=makePaintDecal(puddles[i%4],radius,i*.131);d.position.set(x,.047+i*.000015,z);scene.add(d);
    if(i%3===0){for(let j=0;j<3;j++){
      const drop=makePaintDecal(puddles[i%4],.06+(j%2)*.05,i*.3+j);drop.position.set(x+Math.cos(i+j)*radius*1.55,.051,z+Math.sin(i+j)*radius*1.4);scene.add(drop);
    }}
  }
  // Soft low-poly clouds and out-of-bounds silhouettes.
  for(let i=0;i<17;i++){
    const a=i/17*Math.PI*2,rad=40+(i%4)*8;
    const cloud=new THREE.Group();cloud.position.set(Math.sin(a)*rad,14+(i%6)*2.4,Math.cos(a)*rad);
    for(let j=-1;j<=1;j++){
      const puff=sphere(1.7+(j===0?.7:0),'#ffffff',12);puff.scale.set(1.8,.62,1.05);puff.position.x=j*1.8;puff.castShadow=false;cloud.add(puff);
    }
    scene.add(cloud);
  }
  // FPS viewmodel: 내 전신을 숨기고 카메라 우하단에 총만 표시.
  buildFirstPersonBlaster();
  camera.position.set(0,3.4,17);camera.lookAt(0,1.7,11);
  window.addEventListener('resize',()=>{
    renderer.setSize(window.innerWidth,window.innerHeight,false);
    camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();
  });
}
// 내 화면 전용 물감총. 다른 캐릭터의 3D 총과 분리되어 카메라를 따라옵니다.
function buildFirstPersonBlaster(){
  weapon=new THREE.Group();weapon.name='local-fps-paint-blaster';
  weapon.position.set(.46,-.43,-.91);
  weapon.rotation.set(.015,-.22,-.065);
  weapon.visible=false;camera.add(weapon);
  const paintPieces=[];
  const add=(mesh,paint=false)=>{
    mesh.castShadow=false;mesh.receiveShadow=false;
    // 화면 앞에 표시되는 무기만 장애물에 가려지지 않도록 마지막에 그립니다.
    mesh.material.depthTest=false;mesh.material.depthWrite=false;
    mesh.renderOrder=900;
    weapon.add(mesh);
    if(paint)paintPieces.push(mesh);
    return mesh;
  };
  const caseMain=add(box(.41,.27,.72,'#ecf5ff'));
  const lower=add(box(.35,.13,.62,'#273750'));
  lower.position.set(0,-.17,.04);
  const accent=add(box(.44,.10,.57,'#fb639b'),true);
  accent.position.set(0,.17,.035);
  const side=add(box(.075,.16,.40,'#829cb3'));
  side.position.set(-.24,0,-.02);
  const grip=add(box(.14,.30,.21,'#18243c'));
  grip.position.set(.06,-.32,.19);grip.rotation.x=-.19;
  const tip=add(cylinder(.115,.12,.63,'#2f4765',20));
  tip.rotation.x=Math.PI/2;tip.position.set(0,.01,-.54);
  const muzzle=add(cylinder(.153,.153,.135,'#fb639b',20),true);
  muzzle.rotation.x=Math.PI/2;muzzle.position.set(0,.01,-.88);
  const tank=add(sphere(.225,'#fb639b',20),true);
  tank.position.set(0,.29,.20);tank.scale.set(.92,.77,1.10);
  const tankCap=add(cylinder(.135,.135,.10,'#f9fdff',16));
  tankCap.position.set(0,.48,.22);
  const optic=add(box(.12,.095,.16,'#203651'));
  optic.position.set(0,.24,-.28);
  weapon.userData.paintPieces=paintPieces;
  weapon.userData.home={x:.46,y:-.43,z:-.91};
  weaponBarrel=muzzle;
}
function updateFirstPersonWeaponColor(slot){
  if(!weapon)return;
  const c=COLORS[slot]||'#fb639b';
  for(const mesh of weapon.userData.paintPieces||[])mesh.material.color.set(c);
}
function makeNameTag(p){
  const c=document.createElement('canvas');c.width=384;c.height=96;const ctx=c.getContext('2d');
  ctx.fillStyle='rgba(25,38,73,0.78)';ctx.beginPath();ctx.roundRect(8,14,368,68,22);ctx.fill();
  ctx.fillStyle=COLORS[p.slot];ctx.beginPath();ctx.arc(38,48,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='white';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 31px sans-serif';ctx.fillText(p.name,214,48,280);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
  spr.scale.set(1.95,.48,1);return spr;
}
function makeLimb(w,h,color){
  const m=sphere(1,color,16);m.scale.set(w,h,w);return m;
}
function addPanel(root,w,h,d,color,x,y,z){
  const m=box(w,h,d,color);m.position.set(x,y,z);root.add(m);return m;
}
function createAvatar(p){
  const group=new THREE.Group();group.position.set(p.x,0,p.z);scene.add(group);
  const color=COLORS[p.slot]||'#42dafa';
  const clothes=mat('#252e46'),shadows=mat('#121a30'),trim=mat(color,.36);
  const skin=mat(['#ffd5b0','#efd0b5','#f9c5a6','#d8a47c'][p.slot%4],.85);
  const hairColor=['#a92854','#216783','#573d49','#212739'][p.slot%4];
  const dark=mat('#212c47'),white=mat('#f7faff');
  const rig=new THREE.Group();group.add(rig);
  const hips=makeLimb(.36,.22,'#202c47');hips.position.y=1.01;rig.add(hips);
  const waist=addPanel(rig,.69,.22,.39,'#111c34',0,1.00,0);
  const belt=addPanel(rig,.74,.12,.45,color,0,1.03,0);belt.material.roughness=.55;
  const legs=[];
  [-1,1].forEach((side)=>{
    const pivot=new THREE.Group();pivot.position.set(side*.235,.96,0);rig.add(pivot);
    const thigh=makeLimb(.175,.38,'#293854');thigh.position.y=-.33;pivot.add(thigh);
    const knee=makeLimb(.18,.16,'#3a4760');knee.position.set(0,-.62,-.04);pivot.add(knee);
    const kneeGuard=addPanel(pivot,.25,.22,.11,'#61748b',0,-.61,-.18);
    const shin=new THREE.Group();shin.position.y=-.62;pivot.add(shin);
    const calf=makeLimb(.15,.31,'#222a40');calf.position.y=-.22;shin.add(calf);
    const boot=makeLimb(.21,.16,'#151b2d');boot.scale.z=.30;boot.position.set(0,-.40,-.11);shin.add(boot);
    const sole=addPanel(shin,.41,.065,.57,color,0,-.52,-.13);
    legs.push({pivot,shin});
  });
  const torsoPivot=new THREE.Group();torsoPivot.position.y=1.24;rig.add(torsoPivot);
  const body=makeLimb(.47,.54,'#283650');body.position.set(0,.47,0);body.scale.z=.31;torsoPivot.add(body);
  const shirt=makeLimb(.42,.45,['#28435f','#1d354e','#353956','#304753'][p.slot%4]);shirt.position.set(0,.47,-.06);shirt.scale.z=.34;torsoPivot.add(shirt);
  const jacketStripe=addPanel(torsoPivot,.72,.07,.48,color,0,.19,0);
  // Six individually paintable armor zones: three in front, three on back.
  const torso=[];
  for(const back of [false,true])for(let i=0;i<3;i++){
    const a=addPanel(torsoPivot,.23,.24,.11,'#eaf1f6',(i-1)*.245,.39,back?.345:-.345);
    a.material=mat('#eaf1f6',.38);torso.push(a);
    const stripe=addPanel(torsoPivot,.18,.035,.13,color,(i-1)*.245,.51,back?.35:-.35);
    stripe.material.transparent=true;stripe.material.opacity=.75;
  }
  const harness=addPanel(torsoPivot,.11,.72,.58,'#151f36',-.32,.51,.03);harness.rotation.z=-.16;
  const harness2=addPanel(torsoPivot,.11,.72,.58,'#151f36',.32,.51,.03);harness2.rotation.z=.16;
  const neck=makeLimb(.16,.18,skin.color);neck.position.set(0,1.01,0);torsoPivot.add(neck);
  // Adjustable aiming head, face, cheeks, eyebrows and visor.
  const headJoint=new THREE.Group();headJoint.position.set(0,1.19,0);torsoPivot.add(headJoint);
  const face=makeLimb(.34,.36,skin.color);face.scale.z=.32;face.position.y=.13;headJoint.add(face);
  const earL=sphere(.115,skin.color,14);earL.position.set(-.34,.1,0);headJoint.add(earL);
  const earR=sphere(.115,skin.color,14);earR.position.set(.34,.1,0);headJoint.add(earR);
  const hair=makeLimb(.355,.20,hairColor);hair.position.set(0,.38,.05);hair.scale.z=.36;headJoint.add(hair);
  // Short hair spikes, slightly irregular to avoid identical cloned character silhouettes.
  for(let j=0;j<7;j++){
    const strand=new THREE.Mesh(new THREE.ConeGeometry(.105,.24+(j%3)*.04,8),mat(hairColor,.65));
    strand.position.set((j-3)*.095,.54+(j%3)*.03,-.05+(j%2)*.055);
    strand.rotation.z=(j-3)*-.16;strand.rotation.x=-.17;headJoint.add(strand);
  }
  const glassesFrame=addPanel(headJoint,.70,.235,.13,'#18283e',0,.20,-.31);
  const visor=addPanel(headJoint,.58,.17,.135,['#6ce7f4','#7ddffa','#f2ca69','#8cebd1'][p.slot%4],0,.20,-.384);
  visor.material.transparent=true;visor.material.opacity=.83;visor.material.metalness=.2;
  for(const side of [-1,1]){
    const eye=sphere(.043,'#1d2d3c',12);eye.position.set(side*.125,.17,-.47);headJoint.add(eye);
    const cheek=sphere(.065,'#faab9c',10);cheek.position.set(side*.20,.025,-.32);cheek.scale.set(1,.33,.24);headJoint.add(cheek);
  }
  const mouth=addPanel(headJoint,.15,.025,.018,'#8d4c4c',0,-.005,-.317);mouth.position.z=-.329;
  // Backpack paint canister and hose: real silhouette from behind.
  const backpack=addPanel(torsoPivot,.62,.72,.37,'#14273c',0,.48,.49);
  const packColor=addPanel(torsoPivot,.46,.65,.10,color,0,.49,.71);
  const canister=cylinder(.22,.22,.79,color,20);canister.position.set(0,.51,.79);torsoPivot.add(canister);
  const cap=cylinder(.23,.23,.10,'#f3f6ff',20);cap.position.set(0,.95,.79);torsoPivot.add(cap);
  const hose=new THREE.Mesh(new THREE.TorusGeometry(.31,.049,8,24,Math.PI*1.26),mat('#1b273c'));
  hose.rotation.y=Math.PI/2;hose.position.set(.30,.58,.46);torsoPivot.add(hose);
  // 양팔을 각각 어깨 → 팔꿈치 → 손목으로 연결합니다.
  // 손목 목표는 물감총 손잡이(오른손), 앞쪽 받침(왼손)에 맞춥니다.
  const arms=[];
  for(const side of [-1,1]){
    const shoulderPos=new THREE.Vector3(side*.46,.83,-.03);
    const shoulderCap=makeLimb(.228,.22,color);shoulderCap.position.copy(shoulderPos);torsoPivot.add(shoulderCap);
    const upper=makeLimb(.17,.30,'#293753');torsoPivot.add(upper);
    const elbowJoint=makeLimb(.169,.167,'#41516a');torsoPivot.add(elbowJoint);
    const forearm=makeLimb(.145,.30,'#29334a');torsoPivot.add(forearm);
    const glove=makeLimb(.155,.13,'#121d31');torsoPivot.add(glove);
    arms.push({side,shoulderPos,upper,elbowJoint,forearm,glove});
  }
  // 다른 플레이어의 총은 몸 가운데가 아니라 오른손 쪽에 위치.
  const blaster=new THREE.Group();blaster.position.set(.28,.49,-.57);torsoPivot.add(blaster);
  addPanel(blaster,.54,.28,.71,'#e7edf7',0,0,0);
  addPanel(blaster,.53,.14,.51,color,0,.17,.06);
  const grip=addPanel(blaster,.17,.30,.18,'#1b2b45',.07,-.24,.20);grip.rotation.x=.12;
  const nozzle=cylinder(.13,.14,.61,'#2a3454',18);nozzle.rotation.x=Math.PI/2;nozzle.position.set(0,.01,-.60);blaster.add(nozzle);
  const nozzleRing=cylinder(.175,.175,.13,color,18);nozzleRing.rotation.x=Math.PI/2;nozzleRing.position.set(0,.01,-.95);blaster.add(nozzleRing);
  const tank=sphere(.24,color,16);tank.position.set(0,.26,.25);tank.scale.set(1,.8,1.15);blaster.add(tank);
  const barrel=blaster;
  // 팔꿈치와 손이 총의 손잡이와 받침을 실제로 잡도록 첫 자세도 맞춥니다.
  poseHeldBlasterArms({arms,blaster,recoil:0},0,0);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.61,.68,40),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,transparent:true,opacity:.50,depthWrite:false}));
  ring.rotation.x=-Math.PI/2;ring.position.y=.045;group.add(ring);
  const tag=makeNameTag(p);tag.position.y=3.72;group.add(tag);
  return {id:p.id,group,rig,torsoPivot,body,torso,head:face,headJoint,arms,legs,boots:[],pack:packColor,hat:hair,
    blaster,ring,phase:Math.random()*6,runStrength:0,lastPos:{x:p.x,z:p.z},recoil:0,hitAnim:0,
    targetX:p.x,targetZ:p.z,targetYaw:p.yaw,lastSegments:'',slot:p.slot,segments:[],spawnVersion:p.spawnVersion||0,spawnPulse:0,isSliding:false,slideBlend:0};
}
// 캡슐 형태의 팔을 두 관절점 사이에 연결. 팔이 항상 총을 향하게 합니다.
function putLimbBetween(mesh,a,b){
  mesh.position.copy(a).add(b).multiplyScalar(.5);
  const axis=new THREE.Vector3().subVectors(b,a),length=axis.length();
  if(length<.001)return;
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),axis.multiplyScalar(1/length));
  mesh.scale.y=length*.58; // 관절 사이를 살짝 겹쳐 빈틈 없는 팔 모양
}
function poseHeldBlasterArms(av,step=0,recoil=0){
  if(!av.arms)return;
  const kick=recoil*.55;
  const rightHand=new THREE.Vector3(.35,.23,-.37+kick);
  const leftHand=new THREE.Vector3(.005,.43,-.83+kick);
  for(const arm of av.arms){
    const right=arm.side===1;
    const shoulder=arm.shoulderPos;
    const elbow=right
      ?new THREE.Vector3(.66,.39+Math.abs(step)*.016,-.09+kick*.2)
      :new THREE.Vector3(-.46,.42+Math.abs(step)*.016,-.42+kick*.2);
    const hand=right?rightHand:leftHand;
    putLimbBetween(arm.upper,shoulder,elbow);
    putLimbBetween(arm.forearm,elbow,hand);
    arm.elbowJoint.position.copy(elbow);
    arm.glove.position.copy(hand);
  }
}
function updateAvatarVisual(av,p){
  // 자기 자신은 1인칭으로 보기 때문에 3D 몸·이름표·등의 물감통을 렌더하지 않음.
  av.group.visible=p.id!==myId && !(p.deadUntil>0);
  const signature=JSON.stringify(p.segments||[]);
  if(signature===av.lastSegments)return;
  av.lastSegments=signature;
  (p.segments||[]).forEach((owner,i)=>{
    av.torso[i].material.color.set(Number.isInteger(owner)&&owner>=0&&owner<4?TEAM_COLORS[owner]:'#eaf1f6');
    av.torso[i].material.emissive.set(Number.isInteger(owner)&&owner>=0&&owner<4?TEAM_COLORS[owner]:'#000000');
    av.torso[i].material.emissiveIntensity=Number.isInteger(owner)&&owner>=0&&owner<4?.15:0;
  });
}
function synchronizeAvatars(){
  const ids=new Set(players.map(p=>p.id));
  for(const [id,av]of avatarMap){if(!ids.has(id)){scene.remove(av.group);avatarMap.delete(id);}}
  for(const p of players){
    let av=avatarMap.get(p.id);
    if(!av){av=createAvatar(p);avatarMap.set(p.id,av);}
    av.targetX=p.id===myId?myPose.x:p.x;
    av.targetZ=p.id===myId?myPose.z:p.z;
    av.targetYaw=p.id===myId?myPose.yaw:p.yaw;
    av.isSliding=p.id===myId?!!myPose.slide:!!p.slide;
    if(av.spawnVersion!==undefined && av.spawnVersion!==p.spawnVersion)av.spawnPulse=1;
    av.spawnVersion=p.spawnVersion||0;
    updateAvatarVisual(av,p);
  }
}
function initRound(data){
  for(const av of avatarMap.values())scene.remove(av.group);
  avatarMap.clear();shotsFX.forEach(o=>scene.remove(o.mesh));shotsFX=[];
  paintFX.forEach(o=>scene.remove(o.mesh));paintFX=[];
  const me=data.find(p=>p.id===myId);
  if(me){mySpawnVersion=me.spawnVersion||0;myKnockoutShown=false;myPose={x:me.x,z:me.z,yaw:me.yaw,pitch:0};
    walkingVelocity={x:0,z:0};slideExpires=0;
  }
  synchronizeAvatars();updateHUD();closeQuiz();activeQuiz=null;quizSubmitted=false;
  if(me)updateFirstPersonWeaponColor(me.slot);
}
function canStand(x,z){
  if(Math.abs(x)>ARENA||Math.abs(z)>ARENA)return false;
  return !COVERS.some(c=>Math.abs(x-c.x)<c.w/2+.59&&Math.abs(z-c.z)<c.d/2+.59);
}
function sendPose(now){
  if(now-lastPose<53)return;lastPose=now;
  emit('pose',{...myPose});
}
let walkingVelocity={x:0,z:0};let slideExpires=0;
function movePlayer(dt){
  if((players.find(p=>p.id===myId)?.deadUntil||0)>serverNowClient()){
    walkingVelocity.x*=Math.exp(-dt*20);walkingVelocity.z*=Math.exp(-dt*20);
    return 0;
  }
  let f=0,s=0;
  if(keys.has('KeyW')||keys.has('ArrowUp'))f++;
  if(keys.has('KeyS')||keys.has('ArrowDown'))f--;
  if(keys.has('KeyD')||keys.has('ArrowRight'))s++;
  if(keys.has('KeyA')||keys.has('ArrowLeft'))s--;
  f-=joystickState.y;s+=joystickState.x;
  const length=Math.hypot(f,s),m=Math.max(1,length);
  const sliding=performance.now()<slideExpires;myPose.slide=sliding;
  const speed=sliding?7.25:(keys.has('ShiftLeft')||keys.has('ShiftRight')?6.8:5.25);
  const desiredX=(-Math.sin(myPose.yaw)*f+Math.cos(myPose.yaw)*s)/m*speed;
  const desiredZ=(-Math.cos(myPose.yaw)*f-Math.sin(myPose.yaw)*s)/m*speed;
  const blend=1-Math.exp(-dt*(length>.02?12.5:16));
  walkingVelocity.x+=(desiredX-walkingVelocity.x)*blend;
  walkingVelocity.z+=(desiredZ-walkingVelocity.z)*blend;
  const dx=walkingVelocity.x*Math.min(.06,dt),dz=walkingVelocity.z*Math.min(.06,dt);
  if(canStand(myPose.x+dx,myPose.z))myPose.x+=dx;else walkingVelocity.x=0;
  if(canStand(myPose.x,myPose.z+dz))myPose.z+=dz;else walkingVelocity.z=0;
  return Math.min(1,Math.hypot(walkingVelocity.x,walkingVelocity.z)/6);
}
function updateFirstPersonCamera(dt){
  if(!camera)return;
  // 눈높이에서 직접 조준하는 FPS 시점. 총은 카메라의 오른쪽 아래에만 표시됩니다.
  const eyeY=1.61-(myPose.slide?.21:0);
  const target=new THREE.Vector3(myPose.x,eyeY,myPose.z);
  camera.position.lerp(target,1-Math.exp(-Math.min(.06,dt)*22));
  camera.rotation.set(myPose.pitch,myPose.yaw,0,'YXZ');
  camera.updateMatrixWorld(true);
}
function bulletTrail(from,to,by,hit){
  const p=players.find(p=>p.id===by);
  const color=p?COLORS[p.slot]:'#fff09c';const a=new THREE.Vector3(from.x,from.y,from.z),b=new THREE.Vector3(to.x,to.y,to.z);
  const dir=b.clone().sub(a),dist=dir.length();if(dist<.05)return;
  const ball=new THREE.Mesh(new THREE.CylinderGeometry(.046,.046,dist,8),
    new THREE.MeshBasicMaterial({color,transparent:true,opacity:.90,depthWrite:false}));
  ball.position.copy(a.clone().add(b).multiplyScalar(.5));ball.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());
  scene.add(ball);shotsFX.push({mesh:ball,ttl:.21,initial:.21});
  if(!hit){const dot=sphere(.13,color,10);dot.position.copy(b);dot.material.transparent=true;
    scene.add(dot);paintFX.push({mesh:dot,ttl:.48,vx:0,vy:0,vz:0});}
}
function paintBurst(x,z,color){
  for(let i=0;i<14;i++){
    const blob=sphere(.065+Math.random()*.13,color,10);blob.material.transparent=true;
    blob.position.set(x,1.2+Math.random()*.9,z);scene.add(blob);
    const angle=Math.random()*6.283,sp=1.6+Math.random()*3.4;
    paintFX.push({mesh:blob,ttl:.55+Math.random()*.4,vx:Math.cos(angle)*sp,vy:2.5+Math.random()*1.8,vz:Math.sin(angle)*sp});
  }
}
let gunKick=0;function kickGun(){gunKick=.18;}
function animate(now){requestAnimationFrame(animate);
  const dt=Math.min(.06,Math.max(.001,(now-lastFrame)/1000));lastFrame=now;frameDt=dt;
  if(gameActive&&mode==='playing'){
    const moving=movePlayer(dt);sendPose(now);updateKnockoutState();
    const local=avatarMap.get(myId);
    for(const av of avatarMap.values()){
      const isMine=av.id===myId,oldX=av.group.position.x,oldZ=av.group.position.z;
      const blend=1-Math.exp(-dt*(isMine?32:10.5));
      av.group.position.x+=(av.targetX-av.group.position.x)*blend;
      av.group.position.z+=(av.targetZ-av.group.position.z)*blend;
      const diff=((av.targetYaw-av.group.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;
      av.group.rotation.y+=diff*blend;
      const drift=Math.hypot(av.group.position.x-oldX,av.group.position.z-oldZ)/Math.max(dt,.01);
      const speed=isMine?moving:Math.min(1,drift/5.5);
      av.runStrength+=(speed-av.runStrength)*(1-Math.exp(-dt*9));
      av.phase+=dt*(3.8+speed*10.5);
      const step=Math.sin(av.phase)*av.runStrength;
      const bounce=Math.abs(Math.sin(av.phase))*av.runStrength;
      av.rig.position.y=bounce*.07;
      av.rig.rotation.z=Math.sin(av.phase*.5)*av.runStrength*.035;
      av.slideBlend+=(Number(!!av.isSliding)-av.slideBlend)*(1-Math.exp(-dt*10));
      av.rig.position.y-=av.slideBlend*.38;
      av.torsoPivot.rotation.x=.08*av.runStrength+.015*Math.sin(now*.002)-av.slideBlend*.38;
      av.torsoPivot.rotation.z=-diff*.08;
      av.legs[0].pivot.rotation.x=step*.58;
      av.legs[1].pivot.rotation.x=-step*.58;
      av.legs[0].shin.rotation.x=Math.max(0,-step)*.53;
      av.legs[1].shin.rotation.x=Math.max(0,step)*.53;
      // 손을 몸통 아래에 고정하지 않고 총의 손잡이와 앞 받침에 계속 부착.
      poseHeldBlasterArms(av,step,av.recoil);
      av.headJoint.rotation.x=-(isMine?myPose.pitch:(players.find(p=>p.id===av.id)?.pitch||0))*.18;
      av.spawnPulse=Math.max(0,(av.spawnPulse||0)-dt*2);
      av.rig.scale.setScalar(1-.16*av.spawnPulse);
      av.rig.position.y+=Math.sin((1-av.spawnPulse)*Math.PI)*av.spawnPulse*.20;
      av.recoil=Math.max(0,av.recoil-dt*1.85);
      av.blaster.position.z=-.59+av.recoil*.55;
      av.blaster.rotation.x=-av.recoil*.4;
      av.hitAnim=Math.max(0,av.hitAnim-dt*2.4);
      av.torsoPivot.rotation.z+=av.hitAnim*.13*Math.sin(now*.07);
      if(av.ring?.material)av.ring.material.opacity=.32+Math.sin(now*.004+av.phase)*.08;
    }
    if(local){local.targetX=myPose.x;local.targetZ=myPose.z;local.targetYaw=myPose.yaw;}
    updateFirstPersonCamera(dt);
    const dead=(players.find(p=>p.id===myId)?.deadUntil||0)>serverNowClient();
    if(weapon){
      weapon.visible=gameActive&&!dead;
      const home=weapon.userData.home;
      const runBob=Math.sin(now*.014)*moving*.013;
      gunKick=Math.max(0,gunKick-dt*1.6);
      weapon.position.set(home.x+runBob,home.y+Math.abs(runBob)*.72,home.z+gunKick*.35);
      weapon.rotation.set(.015+gunKick*.20,-.22,-.065+Math.sin(now*.009)*moving*.018);
    }
  }else if(mode==='intro'||mode==='lobby'){
    if(weapon)weapon.visible=false;
    // Idle cinematic camera pans over the rooftop arena behind menus.
    const a=now*.000065;
    camera.position.set(Math.sin(a)*8.0,5.2,15.5+Math.cos(a)*2.0);
    camera.lookAt(0,1.6,0);
  }
  for(let i=shotsFX.length-1;i>=0;i--){const v=shotsFX[i];v.ttl-=dt;
    v.mesh.material.opacity=Math.max(0,v.ttl/v.initial);
    if(v.ttl<=0){scene.remove(v.mesh);v.mesh.geometry.dispose();v.mesh.material.dispose();shotsFX.splice(i,1);}}
  for(let i=paintFX.length-1;i>=0;i--){const v=paintFX[i];v.ttl-=dt;
    v.mesh.position.x+=v.vx*dt;v.mesh.position.y+=v.vy*dt;v.mesh.position.z+=v.vz*dt;
    v.vy-=9.5*dt;v.mesh.material.opacity=Math.max(0,Math.min(1,v.ttl*2));
    if(v.ttl<=0||v.mesh.position.y<.08){scene.remove(v.mesh);v.mesh.geometry.dispose();v.mesh.material.dispose();paintFX.splice(i,1);}}
  if(weapon&&mode!=='playing')weapon.visible=false;
  renderer.render(scene,camera);
}
async function initialize(){
  const loading=$('loadingText');
  let err;
  for(const cdn of [
    'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js',
    'https://unpkg.com/three@0.162.0/build/three.module.js'
  ]){
    try{THREE=await import(cdn);break;}catch(e){err=e;}
  }
  if(!THREE){
    loading.textContent='3D 라이브러리를 불러오지 못했어요. 인터넷 연결과 CDN 접근을 확인해 주세요.';
    console.error('Three.js load failed',err);return;
  }
  try{setVisible($('knockoutOverlay'),false);buildWorld();requestAnimationFrame(animate);
    void connectFirebase(handleMessage);setVisible($('loadingOverlay'),false);showScreen('intro');
  }catch(e){console.error(e);loading.textContent='3D를 실행할 수 없어요. 그래픽 가속이 켜진 최신 브라우저를 사용해 주세요.';}
}
initialize();

