(() => {
  // Decorative bubbles stay behind content and never capture input.
  const bubbleColors=['233 155 207','185 160 235','158 216 238'];
  const bubbleSections=[...document.querySelectorAll('main > section')];
  for(const section of bubbleSections){
    section.classList.add('bubble-section');
    const layer=document.createElement('div');layer.className='pastel-bubbles';layer.setAttribute('aria-hidden','true');
    for(let i=0;i<10;i++){
      const bubble=document.createElement('span');bubble.className='pastel-bubble';
      const duration=25+Math.random()*19;
      for(const [key,value] of Object.entries({'--bubble-left':(i*10+Math.random()*7-3)+'%','--bubble-size':(85+Math.random()*115)+'px','--bubble-duration':duration+'s','--bubble-delay':(-Math.random()*duration)+'s','--bubble-drift':(Math.random()*100-50)+'px','--bubble-color':bubbleColors[i%3]}))bubble.style.setProperty(key,value);
      layer.append(bubble);
    }
    section.prepend(layer);
  }
  const resizeBubbles=()=>bubbleSections.forEach(section=>section.style.setProperty('--bubble-travel',(section.offsetHeight+440)+'px'));
  resizeBubbles();
  if(typeof ResizeObserver!=='undefined'){const bubbleResizeObserver=new ResizeObserver(resizeBubbles);bubbleSections.forEach(section=>bubbleResizeObserver.observe(section));}else window.addEventListener('resize',resizeBubbles);

  const shapes = [
    '<path d="M16 28S2 20 2 10C2 1 12 0 16 7C20 0 30 1 30 10C30 20 16 28 16 28Z"/>',
    '<path d="M13 13Q0 0 2 16Q0 30 13 19L9 30L17 26L21 31L19 19Q33 29 30 15Q33 0 19 13Z"/><ellipse cx="16" cy="16" rx="4" ry="5"/>'
  ];
  const colors = ['#e99bcf','#b9a0eb','#9ed8ee','#f2b8df'];
  let active = 0;
  document.addEventListener('click', event => {
    if (!event.detail || reduce.matches || document.body.classList.contains('paused') || !Element.prototype.animate) return;
    const host = event.target.closest('dialog[open]') || document.body;
    for (let i=0; i<7 && active<70; i++) {
      const particle = document.createElement('span');
      particle.className='click-particle'; particle.setAttribute('aria-hidden','true');
      const color=colors[Math.floor(Math.random()*colors.length)];
      particle.innerHTML='<svg viewBox="0 0 32 32" fill="'+color+'" stroke="#fff" stroke-width="1.3">'+shapes[Math.floor(Math.random()*shapes.length)]+'</svg>';
      particle.style.left=event.clientX+'px'; particle.style.top=event.clientY+'px';
      host.append(particle); active++;
      const angle=Math.random()*Math.PI*2, distance=40+Math.random()*70, dx=Math.cos(angle)*distance, dy=Math.sin(angle)*distance-45, rotation=Math.random()*160-80;
      const motion=particle.animate([
        {transform:'translate(-50%,-50%) scale(.25)',opacity:0},
        {transform:`translate(calc(-50% + ${dx*.45}px),calc(-50% + ${dy*.6}px)) rotate(${rotation*.5}deg) scale(1)`,opacity:1,offset:.25},
        {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy+45}px)) rotate(${rotation}deg) scale(.65)`,opacity:0}
      ],{duration:750+Math.random()*350,easing:'cubic-bezier(.2,.6,.4,1)'});
      let removed=false; const cleanup=()=>{if(!removed){removed=true;particle.remove();active--;}};
      motion.onfinish=cleanup; motion.oncancel=cleanup;
    }
  });

  const $=id=>document.getElementById(id);
  const dateKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const today=dateKey(new Date());
  let month=new Date(new Date().getFullYear(),new Date().getMonth(),1), selected=today, events=[], loading=true;
  const dateLabel=key=>new Date(key+'T12:00:00').toLocaleDateString('ja-JP',{year:'numeric',month:'long',day:'numeric',weekday:'short'});
  function render() {
    $('calendar-month').textContent=month.toLocaleDateString('ja-JP',{year:'numeric',month:'long'});
    const grid=$('calendar-days'); grid.replaceChildren();
    for(let i=0;i<month.getDay();i++){const blank=document.createElement('span');blank.className='calendar-day empty';blank.setAttribute('aria-hidden','true');grid.append(blank);}
    const count=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    for(let d=1;d<=count;d++){
      const key=dateKey(new Date(month.getFullYear(),month.getMonth(),d)), dayEvents=events.filter(e=>e.date===key), button=document.createElement('button');
      button.type='button';button.className='calendar-day'+(key===today?' today':'');button.setAttribute('aria-pressed',String(key===selected));
      button.setAttribute('aria-label',dateLabel(key)+(dayEvents.length?`、${dayEvents.length}件の予定`:''));if(key===today)button.setAttribute('aria-current','date');
      const number=document.createElement('span');number.textContent=d;button.append(number);
      if(dayEvents.length){const badge=document.createElement('small');badge.textContent='♡ '+dayEvents.length+'件';button.append(badge);}
      button.addEventListener('click',()=>{selected=key;render();});grid.append(button);
    }
    $('calendar-selected').textContent=dateLabel(selected)+'の予定';
    const list=$('calendar-events');list.replaceChildren();
    const dayEvents=events.filter(e=>e.date===selected).sort((a,b)=>(a.time||'').localeCompare(b.time||''));
    if(!dayEvents.length){const empty=document.createElement('p');empty.className='calendar-status';empty.textContent=loading?'予定を読み込んでいます…':'この日の予定はまだありません。';list.append(empty);}
    for(const entry of dayEvents){
      const card=document.createElement('article');card.className='calendar-event';const time=document.createElement('time');time.dateTime=entry.date+(entry.time?'T'+entry.time:'');time.textContent=entry.time||'時間未定';const title=document.createElement('h4');title.textContent=entry.title;card.append(time,title);
      if(entry.details){const details=document.createElement('p');details.textContent=entry.details;card.append(details);}
      list.append(card);
    }
  }
  async function api(path,options={}){
    const response=await fetch(path,{...options,cache:'no-store',credentials:'omit'});
    const data=await response.json().catch(()=>({error:'通信に失敗しました。'}));if(!response.ok)throw new Error(data.error||'通信に失敗しました。');return data;
  }
  async function load(){
    try{const data=await api('https://mellowcherie-pastel.folksyinlet.chatgpt.site/api/events');if(!Array.isArray(data.events)||data.events.some(e=>!e||typeof e.date!=='string'||typeof e.title!=='string'))throw Error('Invalid events data');events=data.events;loading=false;render();$('calendar-message').textContent='開催予定はすべてのお客様に共有されます。';}
    catch(error){loading=false;render();$('calendar-message').textContent='予定を取得できませんでした。再読み込みしてお試しください。';}
  }
  $('calendar-prev').addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);selected=dateKey(month);render();});
  $('calendar-next').addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);selected=dateKey(month);render();});
  $('calendar-today').addEventListener('click',()=>{selected=today;month=new Date(today+'T12:00:00');month.setDate(1);render();});
  window.addEventListener('focus',load);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
  setInterval(()=>{if(!document.hidden)load();},30000);
  render();load();
})();
