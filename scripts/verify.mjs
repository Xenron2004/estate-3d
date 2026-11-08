import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = '/vercel/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const BASE = process.env.BASE_URL ?? 'http://localhost:3111';

mkdirSync('/tmp/shots', { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--ignore-gpu-blocklist',
    '--disable-dev-shm-usage',
    '--window-size=1440,900',
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const errors = [];
const warnings = [];
page.on('console', (msg) => {
  const text = msg.text();
  if (msg.type() === 'error') errors.push(text);
  if (msg.type() === 'warning') warnings.push(text);
});
page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));
page.on('requestfailed', (req) => errors.push(`REQFAIL: ${req.url()} ${req.failure()?.errorText}`));

await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 5000));
await page.screenshot({ path: '/tmp/shots/01-hero.png' });

// scroll to the master plan
await page.evaluate(() => {
  document.getElementById('master-plan')?.scrollIntoView({ block: 'start' });
});
await new Promise((r) => setTimeout(r, 9000));
await page.screenshot({ path: '/tmp/shots/02-masterplan.png' });

// click in the middle of the canvas to try to select a parcel
const canvas = await page.$('#master-plan canvas');
if (canvas) {
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.42, box.y + box.height * 0.58);
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: '/tmp/shots/03-hover.png' });
    await page.mouse.click(box.x + box.width * 0.42, box.y + box.height * 0.58);
    await new Promise((r) => setTimeout(r, 3500));
    await page.screenshot({ path: '/tmp/shots/04-selected.png' });
  }
}

const webgl = await page.evaluate(() => {
  const canvasEl = document.querySelector("#master-plan canvas");
  if (!canvasEl) return { ok: false, reason: 'no canvas' };
  const gl = canvasEl.getContext('webgl2') || canvasEl.getContext('webgl');
  return {
    ok: Boolean(gl),
    width: canvasEl.width,
    height: canvasEl.height,
    renderer: gl ? (gl.getParameter(gl.RENDERER)) : null,
  };
});

// inventory + gallery
await page.evaluate(() => document.getElementById('plots')?.scrollIntoView({ block: 'start' }));
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: '/tmp/shots/05-plots.png' });

await page.evaluate(() => document.getElementById('gallery')?.scrollIntoView({ block: 'start' }));
await new Promise((r) => setTimeout(r, 14000));
await page.screenshot({ path: '/tmp/shots/06-gallery.png' });

const galleryImages = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#gallery img')).map((img) => ({
    src: (img).src.slice(0, 40),
    w: (img).naturalWidth,
  })),
);

await page.evaluate(() => document.getElementById('contact')?.scrollIntoView({ block: 'start' }));
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: '/tmp/shots/07-contact.png' });

console.log(JSON.stringify({ webgl, galleryImages, errors: errors.slice(0, 20), warnings: warnings.slice(0, 10) }, null, 2));

await browser.close();
