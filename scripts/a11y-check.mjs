import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

await page.keyboard.press('Tab');
const focused = await page.evaluate(() => {
  const el = document.activeElement;
  return {
    id: el?.id ?? null,
    tag: el?.tagName ?? null,
    label: el?.textContent?.trim().slice(0, 40) ?? null,
  };
});

await page.keyboard.press('Enter');
await page.waitForTimeout(800);

const afterEnter = await page.evaluate(() => ({
  gateHidden: document.querySelector('#gate')?.classList.contains('gate--hidden'),
  hudVisible: getComputedStyle(document.querySelector('#hud')).opacity,
  live: document.querySelector('.captioner')?.getAttribute('aria-live'),
  caption: document.querySelector('#caption')?.textContent?.slice(0, 60),
  status: document.querySelector('#status')?.textContent,
  skipLink: Boolean(document.querySelector('a[href^="#"]')),
}));

const headings = await page.evaluate(() =>
  [...document.querySelectorAll('h1,h2,h3')].map(
    (h) => `${h.tagName}: ${h.textContent.trim().slice(0, 30)}`
  )
);

console.log(JSON.stringify({ focused, afterEnter, headings }, null, 2));
await browser.close();
