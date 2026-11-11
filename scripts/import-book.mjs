import { chromium } from 'playwright';
import { put } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

const arg = (name, fallback='') => {
  const i = process.argv.indexOf('--'+name);
  return i >= 0 ? process.argv[i+1] : fallback;
};

const base = arg('base');
const bookId = arg('book-id', 'book');
const bookTitle = arg('title', bookId);
const maxPages = Number(arg('max-pages', '240'));
const startPage = Number(arg('start-page', '1'));
const output = arg('output', '/tmp/book-import');
const upload = arg('upload', 'false') === 'true';
const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!base) throw new Error('Missing --base URL');
if (upload && !token) throw new Error('BLOB_READ_WRITE_TOKEN is required for --upload true');

await fs.mkdir(path.join(output,'pages'), {recursive:true});
await fs.mkdir(path.join(output,'text'), {recursive:true});

const browser = await chromium.launch({headless:true});
const context = await browser.newContext({
  viewport: {width: 1400, height: 1900},
  deviceScaleFactor: 1,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/157 Safari/537.36'
});
const page = await context.newPage();

const pages = [];
let consecutiveFailures = 0;
let firstSuccess = false;

function pageUrl(n) {
  const sep = base.endsWith('/') ? '' : '/';
  return `${base}${sep}files/basic-html/page${n}.html`;
}
function p3(n){ return String(n).padStart(3,'0'); }

for (let n=startPage; n<=maxPages; n++) {
  const url = pageUrl(n);
  try {
    const response = await page.goto(url, {waitUntil:'domcontentloaded', timeout:45000, referer: base});
    const status = response?.status() ?? 0;
    if (!response || status >= 400) {
      consecutiveFailures++;
      console.log(`MISS page ${n}: HTTP ${status}`);
      if (firstSuccess && consecutiveFailures >= 4) break;
      continue;
    }
    await page.waitForLoadState('networkidle', {timeout:10000}).catch(()=>{});
    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const clean = (s) => (s || '').replace(/\u00a0/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
      const raw = clean(document.body?.innerText || '');
      const lines = raw.split(/\n+/).map(s=>s.trim()).filter(Boolean);
      return {
        title: document.title || '',
        text: raw,
        lines,
        width: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
        height: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0)
      };
    });

    if (!data.text && n > 3) {
      consecutiveFailures++;
      console.log(`EMPTY page ${n}`);
      if (firstSuccess && consecutiveFailures >= 4) break;
      continue;
    }

    firstSuccess = true;
    consecutiveFailures = 0;
    const id = p3(n);
    const imagePath = path.join(output,'pages',`${id}.jpg`);
    const jsonPath = path.join(output,'text',`${id}.json`);

    await page.screenshot({path:imagePath, fullPage:true, type:'jpeg', quality:88});
    const json = {
      bookId,
      sourcePage: n,
      sourceUrl: url,
      title: data.title,
      text: data.text,
      lines: data.lines
    };
    await fs.writeFile(jsonPath, JSON.stringify(json,null,2), 'utf8');

    if (upload) {
      const image = await fs.readFile(imagePath);
      await put(`books/${bookId}/pages/${id}.jpg`, image, {
        access:'private', token, addRandomSuffix:false, allowOverwrite:true, contentType:'image/jpeg'
      });
      await put(`books/${bookId}/text/${id}.json`, JSON.stringify(json), {
        access:'private', token, addRandomSuffix:false, allowOverwrite:true, contentType:'application/json'
      });
    }
    pages.push({page:n, id, image:`pages/${id}.jpg`, text:`text/${id}.json`});
    console.log(`OK page ${n} (${data.text.length} chars, ${data.width}x${data.height})`);
  } catch (e) {
    consecutiveFailures++;
    console.log(`ERR page ${n}: ${e.message}`);
    if (firstSuccess && consecutiveFailures >= 4) break;
  }
}

await browser.close();

if (!pages.length) throw new Error('No pages imported');

const manifest = {
  id: bookId,
  title: bookTitle,
  sourceBase: base,
  importedAt: new Date().toISOString(),
  pageCount: pages.length,
  firstPage: pages[0].page,
  lastPage: pages.at(-1).page,
  pages
};
await fs.writeFile(path.join(output,'manifest.json'), JSON.stringify(manifest,null,2),'utf8');

if (upload) {
  await put(`books/${bookId}/manifest.json`, JSON.stringify(manifest), {
    access:'private', token, addRandomSuffix:false, allowOverwrite:true, contentType:'application/json'
  });
}

console.log(JSON.stringify({ok:true, bookId, pageCount:pages.length, firstPage:manifest.firstPage, lastPage:manifest.lastPage, output}, null, 2));
