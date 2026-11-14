import { get, put } from '@vercel/blob';
import sharp from 'sharp';

const ALLOWED=new Set([60,61,62,63,64,65,66,67,68,69,70,71,73,74,75,76,77,78,79,80,81,82,83,84,85,88,89,136,137,138,139,140,141,162,163,164,165,166,167,168,169,170,171,172,173,213,214,215,216,217,218,219,220,221,222]);
async function streamToBuffer(stream){const r=stream.getReader();const c=[];while(true){const x=await r.read();if(x.done)break;c.push(Buffer.from(x.value));}return Buffer.concat(c);}

export default async function handler(req,res){
  if(req.method!=='POST' && req.method!=='GET') return res.status(405).end();
  const out=[];
  for(const n of [...ALLOWED].sort((a,b)=>a-b)){
    const id=String(n).padStart(3,'0');
    const pathname=`books/historia-5/pages/${id}.jpg`;
    const g=await get(pathname,{access:'private'});
    if(!g||g.statusCode!==200){out.push({id,status:'missing'});continue;}
    const buf=await streamToBuffer(g.stream);
    const rotated=await sharp(buf).rotate(180).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toBuffer();
    await put(pathname,rotated,{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'image/jpeg'});
    out.push({id,status:'rotated',before:buf.length,after:rotated.length});
  }
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({ok:true,count:out.filter(x=>x.status==='rotated').length,pages:out});
}