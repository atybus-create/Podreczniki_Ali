import { put } from '@vercel/blob';

export const config={api:{bodyParser:false}};

async function readBody(req){
  const chunks=[];
  let size=0;
  for await (const chunk of req){
    size+=chunk.length;
    if(size>4_400_000) throw new Error('Payload too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(req.headers['x-import-key']!==process.env.HISTORY_IMPORT_SECRET) return res.status(401).json({error:'Unauthorized'});

  const pathname=String(req.headers['x-blob-path']||'');
  const isPage=/^books\/historia-5\/pages\/(00[1-9]|0[1-9]\d|1\d\d|2[01]\d|222)\.jpg$/.test(pathname);
  const isManifest=pathname==='books/historia-5/manifest.json';
  if(!isPage && !isManifest) return res.status(400).json({error:'Invalid pathname'});

  try{
    const data=await readBody(req);
    if(!data.length) return res.status(400).json({error:'Empty body'});
    await put(pathname,data,{
      access:'private',
      addRandomSuffix:false,
      allowOverwrite:false,
      contentType:isPage?'image/jpeg':'application/json'
    });
    return res.status(200).json({ok:true,pathname,size:data.length});
  }catch(e){
    return res.status(500).json({error:String(e?.message||e)});
  }
}
