import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const shotsDir = fileURLToPath(new URL('../.visual/', import.meta.url));
await mkdir(shotsDir, { recursive: true });
const shot = (name) => `${shotsDir}${name}`;

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const problems = [];
page.on('console', (message) => {
  if (message.type() === 'error') problems.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.screenshot({ path: shot('gate.png') });

const gateVisible = await page.isVisible('#enter');
await page.click('#enter');
await page.waitForTimeout(1200);
await page.screenshot({ path: shot('room.png') });

const status = await page.textContent('#status');
const caption = await page.textContent('#caption');
const canvasSize = await page.evaluate(() => {
  const canvas = document.querySelector('#scene');
  const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl');
  return {
    width: canvas?.width ?? 0,
    height: canvas?.height ?? 0,
    hasWebGL: Boolean(gl),
  };
});
const xrButton = await page.isVisible('button[style*="z-index"]').catch(() => false);

console.log(
  JSON.stringify(
    { gateVisible, status, caption, canvasSize, xrButton, problems },
    null,
    2
  )
);

await browser.close();
