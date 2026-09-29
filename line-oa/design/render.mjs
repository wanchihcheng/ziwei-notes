// 將 design/*.html 輸出成 ../images/*.png
// 用法：node render.mjs [poster price avatar cover]
import { createRequire } from 'module';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));

const dir = path.dirname(fileURLToPath(import.meta.url));
const pages = { poster: [1080, 1350], price: [1080, 1350], avatar: [640, 640], cover: [1080, 878] };
const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(pages);

const browser = await chromium.launch();
for (const name of want) {
  const [width, height] = pages[name];
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(dir, name + '.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.locator('.canvas').screenshot({ path: path.join(dir, '..', 'images', name + '.png') });
  console.log('rendered', name);
}
await browser.close();
