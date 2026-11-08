import puppeteer from 'puppeteer-core';

const CHROME = '/vercel/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const BASE = process.env.BASE_URL ?? 'http://localhost:3111';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: [
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--disable-dev-shm-usage',
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on('console', (m) => console.log(`[console:${m.type()}]`, m.text().slice(0, 300)));
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 400)));

await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 90000 });
await page.evaluate(() => document.getElementById('master-plan')?.scrollIntoView({ block: 'start' }));
await new Promise((r) => setTimeout(r, 12000));

const info = await page.evaluate(() => {
  const canvases = Array.from(document.querySelectorAll('canvas'));
  return {
    canvasCount: canvases.length,
    canvases: canvases.map((c) => {
      const rect = c.getBoundingClientRect();
      const style = getComputedStyle(c);
      let pixel = null;
      try {
        const tmp = document.createElement('canvas');
        tmp.width = 4;
        tmp.height = 4;
        const ctx = tmp.getContext('2d');
        ctx.drawImage(c, 0, 0, 4, 4);
        const d = ctx.getImageData(1, 1, 1, 1).data;
        pixel = [d[0], d[1], d[2], d[3]];
      } catch (e) {
        pixel = `err: ${e.message}`;
      }
      return {
        id: c.parentElement?.id ?? c.parentElement?.className?.toString().slice(0, 60),
        rect: { w: Math.round(rect.width), h: Math.round(rect.height), top: Math.round(rect.top) },
        buffer: { w: c.width, h: c.height },
        display: style.display,
        opacity: style.opacity,
        visibility: style.visibility,
        pixel,
        dataUrlHead: (() => {
          try {
            return c.toDataURL('image/png').slice(0, 30);
          } catch (e) {
            return `err ${e.message}`;
          }
        })(),
      };
    }),
  };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
