import { put, get } from '@vercel/blob';
import he from 'he';
import fs from 'node:fs/promises';
import path from 'node:path';

function cleanText(html) {
  const m = html.match(/<pre[^>]*>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/i);
  const src = m ? m[1] : html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ');
  return he.decode(src.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,' '))
    .replace(/\r/g,'')
    .replace(/[ \t]+\n/g,'\n')
    .replace(/\n[ \t]+/g,'\n')
    .replace(/[ \t]{2,}/g,' ')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

async function fetchOk(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/157 Safari/537.36',
      'accept-language': 'pl-PL,pl;q=0.9,en;q=0.8'
    },
    redirect: 'follow'
  });
  return res;
}

export async function importBook({ id, title, sourceBase, maxPages=240, output='/tmp/book-import', upload=true, force=false }) {
  const prefix = `books/${id}`;
  if (upload && !force) {
    try {
      const existing = await get(`${prefix}/manifest.json`, { access:'private' });
      if (existing?.statusCode === 200) {
        console.log(`SKIP ${id}: manifest already exists`);
        return { skipped:true, id };
      }
    } catch {}
  }

  const local = path.join(output, id);
  await fs.mkdir(path.join(local,'pages'), {recursive:true});
  await fs.mkdir(path.join(local,'text'), {recursive:true});

  const candidates = Array.from({length:maxPages},(_,i)=>i+1);
  const successes = [];
  let cursor=0;
  const workers = 8;

  async function one(n) {
    const imageUrl = `${sourceBase}/files/mobile/${n}.jpg`;
    const htmlUrl = `${sourceBase}/files/basic-html/page${n}.html`;
    const [ir, hr] = await Promise.all([fetchOk(imageUrl), fetchOk(htmlUrl)]);
    if (!ir.ok || !hr.ok) return null;

    const [img, html] = await Promise.all([
      Buffer.from(await ir.arrayBuffer()),
      hr.text()
    ]);
    if (img.length < 5000 || html.length < 500) return null;

    const text = cleanText(html);
    const id3 = String(n).padStart(3,'0');
    const pageData = {
      bookId:id,
      sourcePage:n,
      title:(text.split('\n').find(Boolean)||`Strona ${n}`).slice(0,160),
      text,
      paragraphs:text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean)
    };

    await fs.writeFile(path.join(local,'pages',`${id3}.jpg`),img);
    await fs.writeFile(path.join(local,'text',`${id3}.json`),JSON.stringify(pageData,null,2),'utf8');

    if (upload) {
      await Promise.all([
        put(`${prefix}/pages/${id3}.jpg`, img, {
          access:'private', addRandomSuffix:false, allowOverwrite:true, contentType:'image/jpeg'
        }),
        put(`${prefix}/text/${id3}.json`, JSON.stringify(pageData), {
          access:'private', addRandomSuffix:false, allowOverwrite:true, contentType:'application/json'
        })
      ]);
    }
    console.log(`OK ${id} page ${n}: ${img.length} bytes, ${text.length} chars`);
    return {page:n,id:id3};
  }

  async function worker() {
    while (true) {
      const i=cursor++;
      if (i>=candidates.length) return;
      const n=candidates[i];
      try {
        const result=await one(n);
        if (result) successes.push(result);
      } catch(e) {
        console.log(`ERR ${id} page ${n}: ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({length:workers},worker));

  successes.sort((a,b)=>a.page-b.page);
  if (!successes.length) throw new Error(`No pages imported for ${id}`);

  // Keep the continuous run from the first page and stop at the first material gap.
  const continuous=[];
  let expected=successes[0].page;
  for(const p of successes){
    if(p.page!==expected) break;
    continuous.push(p);
    expected++;
  }

  const manifest={
    id,title,sourceBase,
    importedAt:new Date().toISOString(),
    pageCount:continuous.length,
    firstPage:continuous[0].page,
    lastPage:continuous.at(-1).page,
    pages:continuous
  };
  await fs.writeFile(path.join(local,'manifest.json'),JSON.stringify(manifest,null,2),'utf8');
  if(upload){
    await put(`${prefix}/manifest.json`,JSON.stringify(manifest),{
      access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'
    });
  }
  console.log(`DONE ${id}: ${manifest.pageCount} pages (${manifest.firstPage}-${manifest.lastPage})`);
  return manifest;
}

if(import.meta.url===`file://${process.argv[1]}`){
  const a=(k,d='')=>{const i=process.argv.indexOf(`--${k}`);return i>=0?process.argv[i+1]:d};
  await importBook({
    id:a('book-id','book'),
    title:a('title',a('book-id','book')),
    sourceBase:a('base'),
    maxPages:Number(a('max-pages','240')),
    output:a('output','/tmp/book-import'),
    upload:a('upload','false')==='true',
    force:a('force','false')==='true'
  });
}
