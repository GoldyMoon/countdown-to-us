const START = "2026-08-31";
const END = "2026-12-17";
const TZ = "America/Indiana/Indianapolis";

const meetPeriods = [
  { start: "2026-09-25", end: "2026-09-30", label: "9 月 25 日 — 9 月 30 日" },
  { start: "2026-10-16", end: "2026-10-28", label: "10 月 16 日 — 10 月 28 日" },
  { start: "2026-11-20", end: "2026-11-29", label: "11 月 20 日 — 11 月 29 日" }
];

const root = document.getElementById("petRoot");
const petButton = document.getElementById("petButton");
const bubble = document.getElementById("bubble");
const bubbleMain = document.getElementById("bubbleMain");
const bubbleSub = document.getElementById("bubbleSub");
const miniBar = document.getElementById("miniProgressBar");
const statusBadge = document.getElementById("statusBadge");
const hearts = document.getElementById("hearts");

function todayString(){
  const parts = new Intl.DateTimeFormat("en-CA",{
    timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"
  }).formatToParts(new Date());
  const m = Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return `${m.year}-${m.month}-${m.day}`;
}
function ms(d){const [y,m,day]=d.split("-").map(Number);return Date.UTC(y,m-1,day)}
function days(a,b){return Math.round((ms(b)-ms(a))/86400000)}
function clamp(v,a,b){return Math.min(Math.max(v,a),b)}

function updateStatus(){
  const today = todayString();
  const current = meetPeriods.find(p=>today>=p.start && today<=p.end);
  const next = meetPeriods.find(p=>p.start>today);
  const pct = clamp(days(START,today)/days(START,END)*100,0,100);
  miniBar.style.width = `${pct}%`;

  if(today>=END){
    bubbleMain.textContent = "学期结束啦！";
    bubbleSub.textContent = "可以和宝宝好好玩啦 ♡";
    statusBadge.textContent = "🎉";
  }else if(current){
    bubbleMain.textContent = "现在就在一起 ♡";
    bubbleSub.textContent = current.label;
    statusBadge.textContent = "♥";
  }else if(next){
    const left = Math.max(0,days(today,next.start));
    bubbleMain.textContent = `还有 ${left} 天见面`;
    bubbleSub.textContent = next.label;
    statusBadge.textContent = left<=3 ? "!!" : "♡";
  }else{
    bubbleMain.textContent = "最后冲刺";
    bubbleSub.textContent = `距离 12 月 17 日还有 ${Math.max(0,days(today,END))} 天`;
    statusBadge.textContent = "♡";
  }

  const hour = new Date().getHours();
  petButton.classList.toggle("sleepy", hour>=23 || hour<7);
}

function popHeart(){
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = Math.random()>.7 ? "💗" : "♡";
  heart.style.setProperty("--x", `${-28 + Math.random()*56}px`);
  heart.style.setProperty("--r", `${-16 + Math.random()*32}deg`);
  hearts.appendChild(heart);
  setTimeout(()=>heart.remove(),1100);
}

let dragging = false;
let moved = false;
let lastX = 0;
let lastY = 0;

petButton.addEventListener("pointerdown", (e)=>{
  dragging = true;
  moved = false;
  lastX = e.screenX;
  lastY = e.screenY;
  petButton.setPointerCapture(e.pointerId);
});

petButton.addEventListener("pointermove", (e)=>{
  if(!dragging) return;
  const dx = e.screenX-lastX;
  const dy = e.screenY-lastY;
  if(Math.abs(dx)+Math.abs(dy)>2) moved = true;
  if(dx || dy){
    window.desktopPet.moveBy(dx,dy);
    lastX = e.screenX;
    lastY = e.screenY;
  }
});

petButton.addEventListener("pointerup", (e)=>{
  dragging = false;
  try{petButton.releasePointerCapture(e.pointerId)}catch{}
});

petButton.addEventListener("click", ()=>{
  if(moved) return;
  bubble.classList.toggle("hidden");
  petButton.classList.remove("bump");
  void petButton.offsetWidth;
  petButton.classList.add("bump");
  popHeart();
});

petButton.addEventListener("dblclick", ()=>{
  window.desktopPet.openDashboard();
});

document.getElementById("closeBubble").addEventListener("click", ()=>bubble.classList.add("hidden"));
document.getElementById("openDashboard").addEventListener("click", ()=>window.desktopPet.openDashboard());
document.getElementById("quitApp").addEventListener("click", ()=>window.desktopPet.quit());

updateStatus();
setInterval(updateStatus, 60*1000);
