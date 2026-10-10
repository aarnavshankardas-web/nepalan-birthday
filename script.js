const screens=[...document.querySelectorAll(".screen")];
const song=document.getElementById("birthdaySong");
let current=0;
let musicStarted=false;

function showScreen(id){
  screens.forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({top:0,behavior:"instant"});
  spawnFlowers();
}

function startMusic(){
  if(musicStarted) return;
  musicStarted=true;
  song.volume=.85;
  song.currentTime=0;
  song.play().catch(()=>{
    // If the browser still blocks audio, the same user click can retry it.
    const retry=()=>{ song.play().catch(()=>{}); document.removeEventListener("pointerdown",retry); };
    document.addEventListener("pointerdown",retry,{once:true});
  });
}

document.getElementById("openBtn").addEventListener("click",()=>{
  startMusic();
  showScreen("intro");
});

document.querySelectorAll(".next").forEach(btn=>{
  if(btn.id==="photoNext" || btn.id==="cakeNext" || btn.id==="letterNext") return;
  btn.addEventListener("click",()=>{
    if(btn.closest("#intro")) showScreen("photos");
  });
});

const memories=[...document.querySelectorAll(".memory")];
const dots=document.getElementById("photoDots");
let photoIndex=0;
memories.forEach((_,i)=>{
  const d=document.createElement("span");
  d.className="dot"+(i===0?" active":"");
  dots.appendChild(d);
});
function updatePhoto(){
  memories.forEach((m,i)=>m.classList.toggle("active",i===photoIndex));
  [...dots.children].forEach((d,i)=>d.classList.toggle("active",i===photoIndex));
  document.getElementById("photoNext").textContent =
    photoIndex===memories.length-1 ? "Now for the cake 🎂" : "Next memory 📸";
}
document.getElementById("photoNext").addEventListener("click",()=>{
  if(photoIndex<memories.length-1){
    photoIndex++;
    updatePhoto();
  }else{
    showScreen("cake");
  }
});

const confetti=document.getElementById("confetti");
document.getElementById("cutCake").addEventListener("click",()=>{
  document.getElementById("cakeGraphic").classList.add("cut");
  confetti.innerHTML="";
  const icons=["🎉","💗","🌸","✨","🎀","🥳","🌷"];
  for(let i=0;i<32;i++){
    const s=document.createElement("span");
    s.textContent=icons[Math.floor(Math.random()*icons.length)];
    s.style.setProperty("--x",`${(Math.random()-.5)*620}px`);
    s.style.setProperty("--y",`${(Math.random()-.7)*520}px`);
    s.style.animationDelay=`${Math.random()*.2}s`;
    confetti.appendChild(s);
  }
  document.getElementById("cutCake").classList.add("hidden");
  document.getElementById("cakeNext").classList.remove("hidden");
});
document.getElementById("cakeNext").addEventListener("click",()=>showScreen("letter"));
document.getElementById("letterNext").addEventListener("click",()=>showScreen("final"));
document.getElementById("envelopeLaunch").addEventListener("click",()=>showScreen("envelopeEnd"));

const envelope = document.getElementById("letterEnvelope");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");
function openFinalEnvelope(){
  envelope.classList.add("opened");
  openEnvelopeBtn.textContent = "Your message is open 💗";
  openEnvelopeBtn.disabled = true;
  openEnvelopeBtn.style.opacity = ".7";
}
openEnvelopeBtn.addEventListener("click",openFinalEnvelope);
document.getElementById("envSeal").addEventListener("click",openFinalEnvelope);
document.getElementById("envSeal").addEventListener("keydown",(event)=>{
  if(event.key==="Enter" || event.key===" "){event.preventDefault();openFinalEnvelope();}
});

function spawnFlowers(){
  const petals=document.getElementById("petals");
  petals.innerHTML="";
  const flowers=["🌸","🌷","🌼","🌹","✨","💗"];
  for(let i=0;i<18;i++){
    const el=document.createElement("span");
    el.className="falling";
    el.textContent=flowers[Math.floor(Math.random()*flowers.length)];
    el.style.left=`${Math.random()*100}%`;
    el.style.fontSize=`${14+Math.random()*18}px`;
    el.style.animationDuration=`${5+Math.random()*7}s`;
    el.style.animationDelay=`${Math.random()*4}s`;
    petals.appendChild(el);
  }
}
spawnFlowers();

// Keep the song alive as the user moves through the card.
// If the browser pauses it, a user interaction can restart it.
document.addEventListener("click",()=>{
  if(musicStarted && song.paused) song.play().catch(()=>{});
});
