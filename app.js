const REELS=[
 {id:'fri',title:'Before you leave',items:[
  ['💧','Deep-water everything Friday night'],['🧺','Group plants in a bright spot'],['🪢','Set up wick watering'],
  ['👯','Ask a friend to sit your plants'],['🛁','Bottom-soak the thirsty ones'],['🏷️','Label care notes for the sitter']]},
 {id:'sat',title:'Saturday',items:[
  ['🌿','Plant nursery crawl'],['🏛️','Botanical garden day'],['🥾','Forest or beach hike'],
  ['🪴','Plant swap or thrift hunt'],['☕','Greenhouse café afternoon'],['🌸','Farmers market and flowers']]},
 {id:'sun',title:'Sunday',items:[
  ['🪴','Repot one root-bound plant'],['✂️','Take cuttings to propagate'],['🧼','Wipe leaves and prune'],
  ['🏺','Build a terrarium'],['🌱','Start seeds on the windowsill'],['📖','Slow day: plant book and tea']]}
];
const reelsEl=document.getElementById('reels'),planEl=document.getElementById('plan'),pull=document.getElementById('pull');
const state=REELS.map(()=>({i:-1,held:false}));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

REELS.forEach((r,n)=>{
  const d=document.createElement('div');d.className='reel';
  d.innerHTML=`<h2>${r.title}</h2><div class="window" id="w${n}"><div class="em">🐚</div><div class="tx">?</div></div>
  <button class="hold" id="h${n}" aria-pressed="false">Hold</button>`;
  reelsEl.appendChild(d);
  d.querySelector('.hold').onclick=e=>{state[n].held=!state[n].held;e.target.setAttribute('aria-pressed',state[n].held);};
});

function show(n,i){const w=document.getElementById('w'+n),[e,t]=REELS[n].items[i];
  w.querySelector('.em').textContent=e;w.querySelector('.tx').textContent=t;}
const rnd=n=>Math.floor(Math.random()*REELS[n].items.length);

function spin(){
  pull.disabled=true;
  const active=state.map((s,n)=>s.held&&s.i>=0?null:n).filter(n=>n!==null);
  if(!active.length){pull.disabled=false;return;}
  let done=0;
  active.forEach((n,k)=>{
    const w=document.getElementById('w'+n);w.classList.add('spin');
    const stopAt=reduce?0:700+k*450;
    const tick=setInterval(()=>show(n,rnd(n)),80);
    setTimeout(()=>{
      clearInterval(tick);
      let i=rnd(n);if(i===state[n].i&&REELS[n].items.length>1)i=(i+1)%REELS[n].items.length;
      state[n].i=i;show(n,i);w.classList.remove('spin');
      if(++done===active.length){pull.disabled=false;renderPlan();}
    },stopAt);
  });
}

function renderPlan(){
  const rows=REELS.map((r,n)=>{const [e,t]=r.items[state[n].i];return {l:r.title,e,t};});
  planEl.innerHTML='<ul>'+rows.map(x=>`<li><span class="em">${x.e}</span><span><b>${x.l}:</b> ${x.t}</span></li>`).join('')+'</ul><button class="copy" id="copy">Copy plan</button>';
  document.getElementById('copy').onclick=async e=>{
    const txt='My plant parent weekend:\n'+rows.map(x=>`${x.l}: ${x.t}`).join('\n');
    try{await navigator.clipboard.writeText(txt);e.target.textContent='Copied';}catch{e.target.textContent='Copy failed';}
    setTimeout(()=>e.target.textContent='Copy plan',1500);
  };
}

pull.onclick=spin;

const b=document.querySelector('.bubbles');
for(let i=0;i<14;i++){const s=document.createElement('i'),z=8+Math.random()*22;
  s.style.cssText=`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${10+Math.random()*14}s;animation-delay:${-Math.random()*20}s`;b.appendChild(s);}
