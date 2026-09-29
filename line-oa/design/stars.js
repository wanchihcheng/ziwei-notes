// 以固定種子產生星點，讓每次輸出一致
(function(){
  document.querySelectorAll('.stars').forEach(el=>{
    const w=el.clientWidth,h=el.clientHeight;let seed=+(el.dataset.seed||7);
    const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    let s=`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">`;
    for(let i=0;i<110;i++){const x=rnd()*w,y=rnd()*h,r=rnd()*1.4+.3,o=rnd()*.6+.15;
      s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${rnd()>.8?'#e3bf73':'#e9e2ff'}" opacity="${o}"/>`}
    // 北斗七星（紫微垣意象）；data-dipper="0" 可關閉（星圖已放在燕子身上時）
    if(el.dataset.dipper!=='0'){
    const dip=[[.12,.1],[.17,.085],[.22,.095],[.26,.12],[.25,.165],[.31,.18],[.33,.14]];
    s+=`<polyline points="${dip.map(p=>p[0]*w+','+p[1]*h).join(' ')}" fill="none" stroke="#cdb8ff" stroke-width=".8" opacity=".35"/>`;
    dip.forEach(p=>s+=`<circle cx="${p[0]*w}" cy="${p[1]*h}" r="2.4" fill="#fff" opacity=".85"/>`);
    }
    s+='</svg>';el.innerHTML=s;
  });
})();
