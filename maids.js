(() => {
  const grid=document.getElementById('maid-grid'),note=document.querySelector('.maid-footnote'),modal=document.getElementById('maid-profile');
  let current=null,last='',loading=false;
  function open(profile){current=profile.id;MellowProfiles.details(profile,modal.querySelector('.maid-detail'));if(!modal.open)modal.showModal();}
  modal.addEventListener('close',()=>{current=null;});
  async function load(){
    if(loading)return;loading=true;
    try{
      const response=await fetch('https://mellowcherie-pastel.folksyinlet.chatgpt.site/api/maids',{cache:'no-store',credentials:'omit'});
      if(!response.ok)throw Error();const data=await response.json();if(!Array.isArray(data.maids))throw Error();
      const signature=JSON.stringify(data.maids);
      if(signature!==last){
        const focused=document.activeElement.closest?.('.maid-card')?.dataset.id;
        const cards=data.maids.map(p=>{const card=MellowProfiles.card(p,open);card.dataset.id=p.id;return card;});grid.replaceChildren(...cards);last=signature;
        if(focused)cards.find(card=>card.dataset.id===focused)?.focus({preventScroll:true});
        if(current){const profile=data.maids.find(p=>p.id===current);if(profile)MellowProfiles.details(profile,modal.querySelector('.maid-detail'));else modal.close();}
      }
      note.textContent=data.maids.length?'お写真をタップすると、詳しいプロフィールをご覧いただけます。':'メイドのプロフィールは、ただいま掲載準備中です。';
    }catch{note.textContent='プロフィールを読み込めませんでした。時間をおいて再読み込みしてください。';}
    finally{loading=false;}
  }
  note.textContent='プロフィールを読み込んでいます…';load();window.addEventListener('focus',load);document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});setInterval(()=>{if(!document.hidden)load();},30000);
})();
