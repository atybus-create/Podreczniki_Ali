import { get } from '@vercel/blob';

const KEY = 'hist-read-016-030-20261114-Q7m4K9';
const ALLOWED = new Set(['016','017','018','019','020','021','022','023','024','025','026','027','028','029','030']);

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
  return res.status(200).json({page:id,contentType:result.blob.contentType||'image/jpeg',size:buf.length,contentBase64:buf.toString('base64')});
}
