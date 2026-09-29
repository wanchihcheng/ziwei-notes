// 將 design/*.html 輸出成 ../images/*.png
// 用法：node render.mjs [poster price avatar cover]
import { createRequire } from 'module';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));

const dir = path.dirname(fileURLToPath(import.meta.url));
// [寬, 高, 頁面檔（預設同名 .html）, 輸出倍率]
const pages = {
  poster: [1080, 1350], price: [1080, 1350], avatar: [640, 640], cover: [1080, 878], game: [1080, 1350],
  'game-a4': [1080, 1528, 'game.html?print', 2480 / 1080], // 白底 A4 列印版，輸出 2480×3508（300dpi）
};
const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(pages);

const browser = await chromium.launch();

// 雲端環境的瀏覽器不信任代理憑證，改由 Node 代抓 Google Fonts 再交給頁面
async function useNodeFonts(page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, async route => {
    const req = route.request();
    const res = await fetch(req.url(), { headers: { 'user-agent': req.headers()['user-agent'] } });
    await route.fulfill({
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') || '', 'access-control-allow-origin': '*' },
      body: Buffer.from(await res.arrayBuffer()),
    });
  });
}
for (const name of want) {
  const [width, height, file = name + '.html', scale = 1] = pages[name];
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await useNodeFonts(page);
  await page.goto('file://' + path.join(dir, file), { waitUntil: 'networkidle' });
  // 中文字體依 unicode-range 分片下載，逐一觸發頁面上實際用到的字
  await page.evaluate(async () => {
    const text = document.body.innerText + document.querySelector('svg')?.textContent;
    const fams = new Set([...document.querySelectorAll('*')].map(el => getComputedStyle(el).fontFamily.split(',')[0].trim()));
    for (const f of fams) for (const w of [300, 400, 500, 700, 900]) {
      await document.fonts.load(`${w} 40px ${f}`, text).catch(() => {});
      await document.fonts.load(`italic ${w} 40px ${f}`, text).catch(() => {});
    }
    await document.fonts.ready;
  });
  await page.waitForTimeout(400);
  await page.locator('.canvas').screenshot({ path: path.join(dir, '..', 'images', name + '.png') });
  console.log('rendered', name);
}
await browser.close();
