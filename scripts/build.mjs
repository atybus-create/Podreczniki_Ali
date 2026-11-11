import fs from 'node:fs/promises';
import { put } from '@vercel/blob';
import { importBook } from './import-book.mjs';

const cfg=JSON.parse(await fs.readFile(new URL('../books.config.json',import.meta.url),'utf8'));
await fs.rm(new URL('../public',import.meta.url),{recursive:true,force:true});
await fs.mkdir(new URL('../public',import.meta.url),{recursive:true});
await fs.copyFile(new URL('../index.html',import.meta.url),new URL('../public/index.html',import.meta.url));
const catalog={generatedAt:new Date().toISOString(),books:[]};

for(const b of cfg.books){
  const result=await importBook({
    id:b.id,
    title:b.title,
    sourceBase:b.sourceBase,
    maxPages:b.maxPages||240,
    output:'/tmp/podreczniki-ali',
    upload:true,
    force:process.env.FORCE_BOOK_IMPORT==='1'
  });
  catalog.books.push({id:b.id,title:b.title,manifest:`books/${b.id}/manifest.json`});
}
await put('books/catalog.json',JSON.stringify(catalog),{
  access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'
});
console.log('CATALOG',catalog.books.map(b=>b.id).join(', '));
