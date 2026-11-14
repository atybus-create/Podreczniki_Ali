import { get } from '@vercel/blob';
import sharp from 'sharp';

const KEY = 'hist-read-031-045-20261114-N4v8T2';
const ALLOWED = new Set(['031','032','033','034','035','036','037','038','039','040','041','042','043','044','045']);

async function streamToBuffer(stream){
  const reader = stream.getReader();
  const chunks = [];
  let total = 0;
  while(true){
    const {done,value} = await reader.read();
    if(done) break;
    const b = Buffer.from(value);
    chunks.push(b);
    total += b.length;
  }
  return Buffer.concat(chunks,total);
}

export default async function handler(req,res){
  if(req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  if(String(req.query.key||'') !== KEY) return res.status(401).json({error:'Unauthorized'});
  const id = String(req.query.page||'');
  if(!ALLOWED.has(id)) return res.status(400).json({error:'Invalid page'});
  const pathname = `books/historia-5/pages/${id}.jpg`;
  const result = await get(pathname,{access:'private'});
  if(!result || result.statusCode !== 200) return res.status(404).json({error:'Not found'});
  const buf = await streamToBuffer(result.stream);
  res.setHeader('Cache-Control','no-store');
  const small=await sharp(buf).rotate().resize({width:850,withoutEnlargement:true}).jpeg({quality:68}).toBuffer();
  return res.status(200).json({page:id,contentType:'image/jpeg',size:small.length,contentBase64:small.toString('base64')});
}
