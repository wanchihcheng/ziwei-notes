// 風向標主視覺：燕子風向標 + 十二地支環 + 透視羅盤
// 用法：<div data-vane></div>，載入本檔後自動填入 SVG
(function () {
  const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  let labels = '';
  function ring(cx, cy, r) {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#lineGrad)" stroke-width="1.2" opacity=".55"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r - 34}" fill="none" stroke="url(#lineGrad)" stroke-width=".8" opacity=".35" stroke-dasharray="2 6"/>`;
    for (let i = 0; i < 12; i++) {
      // 子在正上方（北），順時針排列
      const a = (i * 30 - 90) * Math.PI / 180;
      const a2 = ((i * 30 + 15) - 90) * Math.PI / 180;
      const x1 = cx + Math.cos(a2) * (r - 34), y1 = cy + Math.sin(a2) * (r - 34);
      const x2 = cx + Math.cos(a2) * (r + 8), y2 = cy + Math.sin(a2) * (r + 8);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#lineGrad)" stroke-width="1" opacity=".5"/>`;
      const tx = cx + Math.cos(a) * (r - 17), ty = cy + Math.sin(a) * (r - 17);
      labels += `<circle cx="${tx}" cy="${ty}" r="13" fill="#120e28"/>`;
      labels += `<text x="${tx}" y="${ty}" class="vane-branch" text-anchor="middle" dominant-baseline="central">${BRANCHES[i]}</text>`;
    }
    for (let i = 0; i < 72; i++) {
      const a = (i * 5) * Math.PI / 180;
      const len = i % 6 === 0 ? 10 : 4;
      const x1 = cx + Math.cos(a) * (r + 14), y1 = cy + Math.sin(a) * (r + 14);
      const x2 = cx + Math.cos(a) * (r + 14 + len), y2 = cy + Math.sin(a) * (r + 14 + len);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#cdb8ff" stroke-width=".8" opacity=".35"/>`;
    }
    return s;
  }

  // 燕子剪影（面向右），以低多邊形切面表現科技感
  const BIRD = `
    <g class="bird">
      <path fill="url(#goldGrad)" d="
        M 468 236
        L 446 224
        C 432 212, 410 212, 396 222
        L 300 132
        L 214 96
        L 262 150
        L 330 232
        L 280 246
        L 150 214
        L 238 262
        L 168 300
        L 292 272
        C 340 280, 408 272, 440 248
        Z"/>
      <g stroke="#fff6dc" stroke-width="1" opacity=".55" fill="none">
        <path d="M396 222 L330 232 L440 248"/>
        <path d="M300 132 L330 232"/>
        <path d="M262 150 L396 222"/>
        <path d="M280 246 L292 272 L330 232"/>
        <path d="M238 262 L280 246"/>
      </g>
      <circle cx="438" cy="226" r="3.2" fill="#140f2a"/>
    </g>`;

  const SVG = `
<svg viewBox="0 0 600 740" xmlns="http://www.w3.org/2000/svg" class="vane-svg">
  <defs>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff1c9"/>
      <stop offset=".45" stop-color="#e3bf73"/>
      <stop offset="1" stop-color="#a8792a"/>
    </linearGradient>
    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b59cff"/>
      <stop offset="1" stop-color="#e3bf73"/>
    </linearGradient>
    <linearGradient id="poleGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e3bf73"/>
      <stop offset=".75" stop-color="#e3bf73" stop-opacity=".5"/>
      <stop offset="1" stop-color="#e3bf73" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <g class="vane-ring">${ring(300, 300, 262)}</g>

  <!-- 透視羅盤 -->
  <g class="compass" stroke="url(#lineGrad)" fill="none">
    <ellipse cx="300" cy="650" rx="150" ry="30" stroke-width="1.4" opacity=".8"/>
    <ellipse cx="300" cy="650" rx="112" ry="22" stroke-width=".8" opacity=".4" stroke-dasharray="3 5"/>
    <line x1="140" y1="650" x2="460" y2="650" stroke="url(#goldGrad)" stroke-width="2.5"/>
    <line x1="252" y1="620" x2="348" y2="680" stroke="url(#goldGrad)" stroke-width="2.5"/>
  </g>
  <g class="compass-labels">
    <text x="118" y="650" text-anchor="middle" dominant-baseline="central">W</text>
    <text x="482" y="650" text-anchor="middle" dominant-baseline="central">E</text>
    <text x="240" y="606" text-anchor="middle" dominant-baseline="central">N</text>
    <text x="362" y="696" text-anchor="middle" dominant-baseline="central">S</text>
  </g>

  <!-- 桿 -->
  <rect x="297" y="112" width="6" height="628" fill="url(#poleGrad)"/>
  <path d="M300 72 L306 116 L294 116 Z" fill="url(#goldGrad)"/>
  <circle cx="300" cy="136" r="10" fill="url(#goldGrad)"/>
  <circle cx="300" cy="136" r="16" fill="none" stroke="#e3bf73" stroke-width="1" opacity=".5"/>

  <!-- 箭 -->
  <g filter="url(#glow)">
    <rect x="116" y="303" width="370" height="5" fill="url(#goldGrad)"/>
    <path d="M526 305.5 L472 283 L484 305.5 L472 328 Z" fill="url(#goldGrad)"/>
    <path d="M156 305 L104 268 L86 268 L130 305 L86 342 L104 342 Z" fill="url(#goldGrad)" opacity=".95"/>
    <path d="M188 305 L146 275 L133 275 L170 305 L133 335 L146 335 Z" fill="url(#goldGrad)" opacity=".7"/>
    <g transform="translate(0,26)">${BIRD}</g>
  </g>
  <circle cx="300" cy="305.5" r="7" fill="#140f2a" stroke="#e3bf73" stroke-width="2"/>
  <g class="vane-labels">${labels}</g>
</svg>`;

  document.querySelectorAll('[data-vane]').forEach(el => { el.innerHTML = SVG; });
})();
