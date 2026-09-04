const TIME_ZONE = "America/Indiana/Indianapolis";
const START_DATE = "2026-08-31";
const END_DATE = "2026-12-17";

const schedule = [
  {type:"remote",badge:"REMOTE<br>12 天",title:"第一段 remote",description:"现在 → 9 月 11 日",start:"2026-08-31",end:"2026-09-10"},
  {type:"together",badge:"见面<br>4 天",title:"9 月 11 日 — 9 月 14 日",description:"4 天，Chicago冲冲冲",start:"2026-09-11",end:"2026-09-14"},
  {type:"remote",badge:"REMOTE<br>11 天",title:"第二段 remote",description:"9 月 15 日 → 9 月 25 日",start:"2026-09-15",end:"2026-09-24"},
  {type:"together",badge:"见面<br>5.5 天",title:"9 月 25 日 — 9 月 30 日",description:"5 天 + 1 晚，好好充电一下",start:"2026-09-25",end:"2026-09-30"},
  {type:"remote",badge:"REMOTE<br>15 天",title:"第三段 remote",description:"10 月 1 日 — 10 月 15 日",start:"2026-10-01",end:"2026-10-15"},
  {type:"together",badge:"见面<br>12.5 天",title:"10 月 16 日 — 10 月 28 日",description:"12 天 + 1 晚，这次可以待很久",start:"2026-10-16",end:"2026-10-28"},
  {type:"remote",badge:"REMOTE<br>22 天",title:"第四段 remote",description:"10 月 29 日 — 11 月 19 日",start:"2026-10-29",end:"2026-11-19"},
  {type:"together",badge:"见面<br>10.5 天",title:"11 月 20 日 — 11 月 29 日",description:"10 天 + 1 晚，离学期结束已经很近啦",start:"2026-11-20",end:"2026-11-29"},
  {type:"remote",badge:"REMOTE<br>≤17 天",title:"最后一段 remote",description:"11 月 30 日 — 12 月 16 日，最后冲刺！",start:"2026-11-30",end:"2026-12-16"}
];

const photos = Array.from({length:14}, (_,i)=>({
  src:`./assets/photos/photo-${String(i+1).padStart(2,"0")}.jpg`,
  caption:`我们的照片 ${i+1}`
}));

function todayInTZ(){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:TIME_ZONE,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const o=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return `${o.year}-${o.month}-${o.day}`;
}
function ms(d){const [y,m,day]=d.split("-").map(Number);return Date.UTC(y,m-1,day)}
function days(a,b){return Math.round((ms(b)-ms(a))/86400000)}
function clamp(v,a,b){return Math.min(Math.max(v,a),b)}

function renderTimeline(today){
  document.getElementById("timeline").innerHTML=schedule.map(s=>{
    const current=today>=s.start&&today<=s.end;
    const past=today>s.end;
    return `<article class="item ${s.type} ${current?"current":""} ${past?"past":""}">
      <div class="badge">${s.badge}</div>
      <div class="content">
        <span class="dot" aria-hidden="true"></span>
        <div class="title">${s.title}</div>
        <div class="desc">${s.description}</div>
      </div>
    </article>`;
  }).join("");
}

function updateProgress(today){
  const pct=clamp(days(START_DATE,today)/days(START_DATE,END_DATE)*100,0,100);
  const left=Math.max(0,days(today,END_DATE));
  requestAnimationFrame(()=>{
    document.getElementById("progressBar").style.width=`${pct}%`;
    document.getElementById("progressAvatar").style.left=`${pct}%`;
  });
  document.getElementById("progressText").textContent=
    today>=END_DATE?"已经到 12 月 17 日啦！":
    today<START_DATE?"还没开始":
    `已完成 ${pct.toFixed(1)}% · 还剩 ${left} 天`;
}

function updateNextMeet(today){
  const current=schedule.find(s=>s.type==="together"&&today>=s.start&&today<=s.end);
  const value=document.getElementById("nextMeetValue");
  const date=document.getElementById("nextMeetDate");
  if(current){value.textContent="现在就在一起";date.textContent=current.title;return}
  const next=schedule.find(s=>s.type==="together"&&s.start>today);
  if(next){value.textContent=`还有 ${Math.max(0,days(today,next.start))} 天`;date.textContent=next.title}
  else{value.textContent=today>=END_DATE?"学期结束啦":"最后冲刺";date.textContent="12 月 17 日"}
}

function renderPhotos(){
  const list=[...photos,...photos];
  document.getElementById("photoTrack").innerHTML=list.map((p,i)=>`
    <button type="button" class="photo-card" data-i="${i%photos.length}">
      <img src="${p.src}" alt="${p.caption}">
      <span class="photo-caption">${p.caption}</span>
    </button>`).join("");
}

function setupPhotoWall(){
  const vp=document.getElementById("photoViewport"), track=document.getElementById("photoTrack");
  const toggle=document.getElementById("wallToggle");
  let paused = false;
  let last = 0;

  function loop(t){
    if(!last) last=t;
    const dt=Math.min(32,t-last); last=t;
    if(!paused){
      vp.scrollLeft+=80*dt/1000;
      const half=track.scrollWidth/2;
      if(vp.scrollLeft>=half) vp.scrollLeft-=half;
    }
    requestAnimationFrame(loop);
  }
  toggle.addEventListener("click",()=>{paused=!paused;toggle.textContent=paused?"播放":"暂停"});
  document.getElementById("wallPrev").addEventListener("click",()=>vp.scrollBy({left:-340,behavior:"smooth"}));
  document.getElementById("wallNext").addEventListener("click",()=>vp.scrollBy({left:340,behavior:"smooth"}));
  vp.addEventListener("mouseenter",()=>paused=true);
  vp.addEventListener("mouseleave",()=>paused=false);

  track.addEventListener("click",e=>{
    const card=e.target.closest(".photo-card"); if(!card) return;
    const p=photos[Number(card.dataset.i)];
    const dlg=document.getElementById("lightbox");
    document.getElementById("lightboxImage").src=p.src;
    document.getElementById("lightboxImage").alt=p.caption;
    document.getElementById("lightboxCaption").textContent=p.caption;
    if(dlg.showModal) dlg.showModal();
  });
  document.getElementById("lightboxClose").addEventListener("click",()=>document.getElementById("lightbox").close());
  requestAnimationFrame(loop);
}

function setupLove(){
  let count=0;
  const stage=document.getElementById("heartStage");
  document.getElementById("loveButton").addEventListener("click",()=>{
    count++;
    document.getElementById("loveCount").textContent=`${count} ♡`;
    const h=document.createElement("span");
    h.className="heart";h.textContent=count%3===0?"💗":"♡";
    h.style.right=`${34+Math.random()*62}px`;
    stage.appendChild(h);
    setTimeout(()=>h.remove(),1400);
  });
}

const today=todayInTZ();
renderPhotos();
renderTimeline(today);
updateProgress(today);
updateNextMeet(today);
setupPhotoWall();
setupLove();
