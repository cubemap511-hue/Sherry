(() => {
  const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
  const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}};
  function photo(maid){
    const box=el('span',undefined,'maid-photo');box.style.setProperty('--portrait',/^#[a-f0-9]{6}$/i.test(maid.accent)?maid.accent:'#f8d8f0');
    if(safeUrl(maid.photo)){const img=el('img');img.src=safeUrl(maid.photo);img.alt=maid.name||'';img.loading='lazy';img.decoding='async';img.style.objectPosition=`${maid.photoX??50}% ${maid.photoY??50}%`;img.addEventListener('error',()=>{img.remove();box.append(el('span','PHOTO COMING SOON','profile-photo-empty'));},{once:true});box.append(img);}
    else box.append(el('span','♡','profile-photo-empty'));
    return box;
  }
  function card(maid,open){
    const node=el('button',undefined,'maid-card');node.type='button';node.setAttribute('aria-label',(maid.name||'メイド')+'のプロフィールを見る');
    if(open){node.setAttribute('aria-haspopup','dialog');node.setAttribute('aria-controls','maid-profile');node.addEventListener('click',()=>open(maid));}
    const caption=el('span',undefined,'maid-caption');caption.append(el('strong',maid.name||'メイド名'));if(maid.status)caption.append(el('span',maid.status));node.append(photo(maid),caption);
    if(maid.reading)node.append(el('p',maid.reading,'profile-reading'));if(maid.role)node.append(el('p',maid.role));if(maid.tagline)node.append(el('p',maid.tagline,'profile-tagline'));node.append(el('p','プロフィールを見る ↗'));return node;
  }
  function details(maid,container){
    container.replaceChildren();const portrait=photo(maid);portrait.id='maid-detail-photo';
    const info=el('div',undefined,'maid-profile');info.append(el('div',maid.englishName||'Meet our maid','eyebrow'));
    const name=el('h2',maid.name||'メイド名');if(container.closest('dialog'))name.id='maid-name';info.append(name);
    if(maid.reading)info.append(el('p',maid.reading,'profile-reading'));if(maid.role)info.append(el('p',maid.role));if(maid.status)info.append(el('span',maid.status,'profile-status'));if(maid.tagline)info.append(el('p',maid.tagline,'profile-tagline'));
    if(maid.description)info.append(el('p',maid.description,'profile-multiline'));
    const list=el('dl');for(const [label,value] of [['誕生日',maid.birthday],['身長',maid.height],['好きなもの',maid.likes],['趣味',maid.hobbies],['得意なこと',maid.specialty],['ひとこと',maid.message],...(maid.attributes||[]).map(row=>[row.label,row.value])]){if(!value)continue;const row=el('div');row.append(el('dt',label),el('dd',value,'profile-multiline'));list.append(row);}info.append(list);
    const links=el('div',undefined,'profile-links');for(const row of [{label:'X プロフィール',url:maid.social},{label:'VRChat',url:maid.vrchat},{label:'ウェブサイト',url:maid.website},...(maid.links||[])]){if(!safeUrl(row.url))continue;const a=el('a',row.label+' ↗','maid-social');a.href=safeUrl(row.url);a.target='_blank';a.rel='noopener noreferrer';links.append(a);}info.append(links);container.append(portrait,info);
  }
  window.MellowProfiles={card,details};
})();
