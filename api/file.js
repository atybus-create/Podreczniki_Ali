import crypto from 'node:crypto';
import { get } from '@vercel/blob';
function expected(){return crypto.createHmac('sha256',process.env.COOKIE_SECRET||'missing').update('authorized').digest('hex')}
function cookie(req,name){const raw=req.headers.cookie||'';for(const p of raw.split(';')){const [k,...v]=p.trim().split('=');if(k===name)return v.join('=')}return ''}
export default async function handler(req,res){
  if(cookie(req,'ali_session')!==expected()) return res.status(401).json({error:'Unauthorized'});
  const pathname=String(req.query.pathname||'');
  if(!pathname.startsWith('books/')) return res.status(400).json({error:'Invalid path'});
  const result=await get(pathname,{access:'private'});
  if(!result || result.statusCode!==200) return res.status(404).end('Not found');
  res.setHeader('Content-Type',result.blob.contentType||'application/octet-stream');
  res.setHeader('Cache-Control','private, max-age=3600');
  const reader=result.stream.getReader();
  while(true){const {done,value}=await reader.read();if(done)break;res.write(Buffer.from(value))}
  res.end();
}
