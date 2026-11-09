(() => {
  const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
  const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}};
  let viewer=null;
  const photos=maid=>[...new Set([maid.photo,...(Array.isArray(maid.photos)?maid.photos:[])].map(safeUrl).filter(Boolean))].slice(0,10);
  function swipe(surface,change){
    let start=null,suppress=0;
    surface.style.touchAction='pan-y pinch-zoom';
    surface.addEventListener('pointerdown',event=>{if(!event.isPrimary||event.button!==0)return;start={x:event.clientX,y:event.clientY,id:event.pointerId};surface.setPointerCapture(event.pointerId);});
    surface.addEventListener('pointerup',event=>{if(!start||start.id!==event.pointerId)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){suppress=Date.now()+400;change(dx<0?1:-1);}});
    surface.addEventListener('pointercancel',()=>{start=null;});
    surface.addEventListener('click',event=>{if(Date.now()<suppress){event.preventDefault();event.stopImmediatePropagation();}},true);
  }
  function closePhotos(){if(viewer?.open)viewer.close();}
  function album(maid){
    const urls=photos(maid);if(!urls.length)return photo(maid);
    let index=0;
    const box=el('div',undefined,'maid-photo-gallery'),open=el('button',undefined,'maid-photo-open');open.type='button';open.setAttribute('aria-haspopup','dialog');
    const controls=el('div',undefined,'maid-photo-controls'),previous=el('button','←'),next=el('button','→'),count=el('span');
    previous.type=next.type='button';previous.setAttribute('aria-label','前のメイド写真');next.setAttribute('aria-label','次のメイド写真');count.setAttribute('aria-live','polite');
    function render(){open.replaceChildren(photo({...maid,photo:urls[index],photoX:index===0?maid.photoX:50,photoY:index===0?maid.photoY:50}));open.setAttribute('aria-label',`${maid.name||'メイド'}の写真を大きく見る（${index+1} / ${urls.length}）`);count.textContent=`${index+1} / ${urls.length}`;}
    const change=delta=>{index=(index+delta+urls.length)%urls.length;render();};
    previous.addEventListener('click',()=>change(-1));next.addEventListener('click',()=>change(1));swipe(open,change);
    open.addEventListener('click',()=>showPhoto());
    function showPhoto(){
      closePhotos();const dialog=el('dialog',undefined,'maid-photo-viewer');viewer=dialog;
      const title=el('h2',(maid.name||'メイド')+'のフォトアルバム');title.id='maid-album-title';dialog.setAttribute('aria-labelledby',title.id);
      const close=el('button','×','maid-album-close');close.type='button';close.setAttribute('aria-label','フォトアルバムを閉じる');close.addEventListener('click',()=>dialog.close());
      const stage=el('div',undefined,'maid-album-stage'),img=el('img'),error=el('p','写真を読み込めませんでした。矢印で別の写真をご覧ください。','maid-album-error');error.hidden=true;img.draggable=false;stage.append(img,error);
      const bar=el('div',undefined,'maid-album-bar'),prev=el('button','←'),after=el('button','→'),status=el('span');prev.type=after.type='button';prev.setAttribute('aria-label','前の写真');after.setAttribute('aria-label','次の写真');status.setAttribute('aria-live','polite');bar.append(prev,status,after);
      const update=()=>{error.hidden=true;img.hidden=false;img.src=urls[index];img.alt=`${maid.name||'メイド'}の写真 ${index+1}`;status.textContent=`${index+1} / ${urls.length}`;render();};
      const move=delta=>{index=(index+delta+urls.length)%urls.length;update();};
      img.addEventListener('error',()=>{img.hidden=true;error.hidden=false;});prev.addEventListener('click',()=>move(-1));after.addEventListener('click',()=>move(1));swipe(stage,move);
      prev.hidden=after.hidden=urls.length<2;
      dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
      dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
      dialog.addEventListener('close',()=>{if(viewer===dialog)viewer=null;dialog.remove();},{once:true});
      dialog.append(title,close,stage,bar,el('p',urls.length>1?'左右にスワイプ、または矢印で写真を切り替えられます。':'','maid-album-hint'));document.body.append(dialog);update();dialog.showModal();close.focus();
    }
    controls.append(previous,count,next);previous.hidden=next.hidden=urls.length<2;box.append(open,controls);render();return box;
  }
  function photo(maid){
    const box=el('span',undefined,'maid-photo');box.style.setProperty('--portrait',/^#[a-f0-9]{6}$/i.test(maid.accent)?maid.accent:'#f8d8f0');
    if(safeUrl(maid.photo)){const img=el('img');img.src=safeUrl(maid.photo);img.alt=maid.name||'';img.loading='lazy';img.decoding='async';img.style.objectPosition=`${maid.photoX??50}% ${maid.photoY??50}%`;img.addEventListener('error',()=>{img.remove();box.append(el('span','PHOTO COMING SOON','profile-photo-empty'));},{once:true});box.append(img);}
    else box.append(el('span','♡','profile-photo-empty'));
    return box;
  }
  function card(maid,open){
    const node=el('button',undefined,'maid-card');node.type='button';node.setAttribute('aria-label',(maid.name||'メイド')+'のプロフィールを見る');
    if(open){node.setAttribute('aria-haspopup','dialog');node.setAttribute('aria-controls','maid-profile');node.addEventListener('click',()=>open(maid));}
    const caption=el('span',undefined,'maid-caption');caption.append(el('strong',maid.name||'メイド名'));if(maid.status)caption.append(el('span',maid.status));node.append(photo({...maid,photo:maid.photo||photos(maid)[0]}),caption);
    if(maid.reading)node.append(el('p',maid.reading,'profile-reading'));if(maid.role)node.append(el('p',maid.role));if(maid.tagline)node.append(el('p',maid.tagline,'profile-tagline'));node.append(el('p','プロフィールを見る ↗'));return node;
  }
  function details(maid,container){
    container.replaceChildren();const portrait=album(maid);portrait.id='maid-detail-photo';
    const info=el('div',undefined,'maid-profile');info.append(el('div',maid.englishName||'Meet our maid','eyebrow'));
    const name=el('h2',maid.name||'メイド名');if(container.closest('dialog'))name.id='maid-name';info.append(name);
    if(maid.reading)info.append(el('p',maid.reading,'profile-reading'));if(maid.role)info.append(el('p',maid.role));if(maid.status)info.append(el('span',maid.status,'profile-status'));if(maid.tagline)info.append(el('p',maid.tagline,'profile-tagline'));
    if(maid.description)info.append(el('p',maid.description,'profile-multiline'));
    const list=el('dl');for(const [label,value] of [['誕生日',maid.birthday],['身長',maid.height],['好きなもの',maid.likes],['趣味',maid.hobbies],['得意なこと',maid.specialty],['ひとこと',maid.message],...(maid.attributes||[]).map(row=>[row.label,row.value])]){if(!value)continue;const row=el('div');row.append(el('dt',label),el('dd',value,'profile-multiline'));list.append(row);}info.append(list);
    const links=el('div',undefined,'profile-links');for(const row of [{label:'X プロフィール',url:maid.social},{label:'VRChat',url:maid.vrchat},{label:'ウェブサイト',url:maid.website},...(maid.links||[])]){if(!safeUrl(row.url))continue;const a=el('a',row.label+' ↗','maid-social');a.href=safeUrl(row.url);a.target='_blank';a.rel='noopener noreferrer';links.append(a);}info.append(links);container.append(portrait,info);
  }
  window.MellowProfiles={card,details,closePhotos};
})();
