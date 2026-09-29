// 風向標主視覺：燕子風向標（身上嵌北斗七星）+ 十二地支環 + 透視羅盤
// 用法：<div data-vane></div>，載入本檔後自動填入 SVG
//   data-vane="classic"：初版構圖，羅盤與地支環交錯（主宣傳圖使用）
//   data-vane=""        ：羅盤移到地支環下方，地支避開桿與箭（大頭貼、封面、價目表使用）
(function () {
  const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  // 回傳 { lines, labels }，labels 另外疊在桿上方
  function ring(cx, cy, r, backed) {
    let lines = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#lineGrad)" stroke-width="1.2" opacity=".55"/>`;
    lines += `<circle cx="${cx}" cy="${cy}" r="${r - 34}" fill="none" stroke="url(#lineGrad)" stroke-width=".8" opacity=".35" stroke-dasharray="2 6"/>`;
    let labels = '';
    for (let i = 0; i < 12; i++) {
      // 子在正上方（北），順時針排列
      const a = (i * 30 - 90) * Math.PI / 180;
      const a2 = ((i * 30 + 15) - 90) * Math.PI / 180;
      const x1 = cx + Math.cos(a2) * (r - 34), y1 = cy + Math.sin(a2) * (r - 34);
      const x2 = cx + Math.cos(a2) * (r + 8), y2 = cy + Math.sin(a2) * (r + 8);
      lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#lineGrad)" stroke-width="1" opacity=".5"/>`;
      const tx = cx + Math.cos(a) * (r - 17), ty = cy + Math.sin(a) * (r - 17);
      const text = `<text x="${tx}" y="${ty}" class="vane-branch" text-anchor="middle" dominant-baseline="central">${BRANCHES[i]}</text>`;
      if (backed) labels += `<circle cx="${tx}" cy="${ty}" r="13" fill="#120e28"/>` + text;
      else lines += text;
    }
    for (let i = 0; i < 72; i++) {
      const a = (i * 5) * Math.PI / 180;
      const len = i % 6 === 0 ? 10 : 4;
      const x1 = cx + Math.cos(a) * (r + 14), y1 = cy + Math.sin(a) * (r + 14);
      const x2 = cx + Math.cos(a) * (r + 14 + len), y2 = cy + Math.sin(a) * (r + 14 + len);
      lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#cdb8ff" stroke-width=".8" opacity=".35"/>`;
    }
    return { lines, labels };
  }

  // 北斗七星亮星：斗柄沿翅膀，斗身落在身體（不另連線，沿用摺紙切面線條）
  const DIPPER = [
    ['搖光', 236, 110, 3.2],
    ['開陽', 272, 141, 3.6],
    ['玉衡', 305, 172, 3.4],
    ['天權', 337, 201, 3.0],
    ['天璣', 348, 250, 3.8],
    ['天璇', 404, 257, 3.8],
    ['天樞', 414, 233, 4.2],
  ];
  function dipper() {
    let s = '';
    DIPPER.forEach(([, x, y, r]) => {
      s += `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="url(#starGlow)"/>`;
      s += `<path d="M${x - r * 2.2} ${y} L${x + r * 2.2} ${y} M${x} ${y - r * 2.2} L${x} ${y + r * 2.2}" stroke="#fff" stroke-width=".8" opacity=".8"/>`;
      s += `<circle cx="${x}" cy="${y}" r="${r * .8}" fill="#fff"/>`;
    });
    return s;
  }

  // 燕子剪影（面向右），低多邊形切面 + 北斗七星星圖
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
      ${dipper()}
      <circle cx="440" cy="226" r="3" fill="#140f2a"/>
    </g>`;

  const DEFS = `
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
    <radialGradient id="starGlow">
      <stop offset="0" stop-color="#fff" stop-opacity=".95"/>
      <stop offset=".35" stop-color="#e9e2ff" stop-opacity=".55"/>
      <stop offset="1" stop-color="#b59cff" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  function compass(cy, rx, ry, rx2, ry2, arm, diag, lbl) {
    return `
  <g class="compass" stroke="url(#lineGrad)" fill="none">
    <ellipse cx="300" cy="${cy}" rx="${rx}" ry="${ry}" stroke-width="1.4" opacity=".8"/>
    <ellipse cx="300" cy="${cy}" rx="${rx2}" ry="${ry2}" stroke-width=".8" opacity=".4" stroke-dasharray="3 5"/>
    <line x1="${300 - arm}" y1="${cy}" x2="${300 + arm}" y2="${cy}" stroke="url(#goldGrad)" stroke-width="3"/>
    <line x1="${300 - diag[0]}" y1="${cy - diag[1]}" x2="${300 + diag[0]}" y2="${cy + diag[1]}" stroke="url(#goldGrad)" stroke-width="3"/>
  </g>
  <g class="compass-labels">
    <text x="${300 - lbl[0]}" y="${cy}" text-anchor="middle" dominant-baseline="central">W</text>
    <text x="${300 + lbl[0]}" y="${cy}" text-anchor="middle" dominant-baseline="central">E</text>
    <text x="${300 - lbl[1]}" y="${cy - lbl[2]}" text-anchor="middle" dominant-baseline="central">N</text>
    <text x="${300 + lbl[1]}" y="${cy + lbl[2]}" text-anchor="middle" dominant-baseline="central">S</text>
  </g>`;
  }

  function classic() {
    const r = ring(300, 300, 262, false);
    return `
<svg viewBox="0 0 600 720" xmlns="http://www.w3.org/2000/svg" class="vane-svg">${DEFS}
  <g class="vane-ring">${r.lines}</g>
  ${compass(500, 190, 44, 150, 34, 208, [70, 48], [230, 84, 64])}
  <rect x="297" y="70" width="6" height="650" fill="url(#poleGrad)"/>
  <path d="M300 18 L307 70 L293 70 Z" fill="url(#goldGrad)"/>
  <circle cx="300" cy="96" r="11" fill="url(#goldGrad)"/>
  <circle cx="300" cy="96" r="18" fill="none" stroke="#e3bf73" stroke-width="1" opacity=".5"/>
  <g filter="url(#glow)">
    <rect x="96" y="303" width="400" height="5" fill="url(#goldGrad)"/>
    <path d="M556 305.5 L494 280 L508 305.5 L494 331 Z" fill="url(#goldGrad)"/>
    <path d="M140 305 L80 262 L60 262 L112 305 L60 349 L80 349 Z" fill="url(#goldGrad)" opacity=".95"/>
    <path d="M176 305 L126 270 L112 270 L156 305 L112 340 L126 340 Z" fill="url(#goldGrad)" opacity=".7"/>
  </g>
  <g transform="translate(0,8)"><g filter="url(#glow)">${BIRD}</g></g>
  <circle cx="300" cy="305.5" r="7" fill="#140f2a" stroke="#e3bf73" stroke-width="2"/>
</svg>`;
  }

  function compact() {
    const r = ring(300, 300, 262, true);
    return `
<svg viewBox="0 0 600 740" xmlns="http://www.w3.org/2000/svg" class="vane-svg">${DEFS}
  <g class="vane-ring">${r.lines}</g>
  ${compass(650, 150, 30, 112, 22, 160, [48, 30], [182, 60, 44])}
  <rect x="297" y="112" width="6" height="628" fill="url(#poleGrad)"/>
  <path d="M300 72 L306 116 L294 116 Z" fill="url(#goldGrad)"/>
  <circle cx="300" cy="136" r="10" fill="url(#goldGrad)"/>
  <circle cx="300" cy="136" r="16" fill="none" stroke="#e3bf73" stroke-width="1" opacity=".5"/>
  <g filter="url(#glow)">
    <rect x="116" y="303" width="370" height="5" fill="url(#goldGrad)"/>
    <path d="M526 305.5 L472 283 L484 305.5 L472 328 Z" fill="url(#goldGrad)"/>
    <path d="M156 305 L104 268 L86 268 L130 305 L86 342 L104 342 Z" fill="url(#goldGrad)" opacity=".95"/>
    <path d="M188 305 L146 275 L133 275 L170 305 L133 335 L146 335 Z" fill="url(#goldGrad)" opacity=".7"/>
  </g>
  <g transform="translate(0,26)"><g filter="url(#glow)">${BIRD}</g></g>
  <circle cx="300" cy="305.5" r="7" fill="#140f2a" stroke="#e3bf73" stroke-width="2"/>
  <g class="vane-labels">${r.labels}</g>
</svg>`;
  }

  document.querySelectorAll('[data-vane]').forEach(el => {
    el.innerHTML = el.dataset.vane === 'classic' ? classic() : compact();
  });
})();
