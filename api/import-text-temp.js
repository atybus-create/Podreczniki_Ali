import { put } from '@vercel/blob';

export const config={api:{bodyParser:false}};

async function readBody(req){
  const chunks=[];
  let size=0;
  for await (const chunk of req){
    size+=chunk.length;
    if(size>1_000_000) throw new Error('Payload too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(req.headers['x-import-key']!==process.env.HISTORY_IMPORT_SECRET) return res.status(401).json({error:'Unauthorized'});

  const pathname=String(req.headers['x-blob-path']||'');
  const m=pathname.match(/^books\/historia-5\/text\/(\d{3})\.json$/);
  if(!m) return res.status(400).json({error:'Invalid pathname'});
  const n=Number(m[1]);
  if(n<1 || n>15) return res.status(400).json({error:'Page out of allowed range'});

  try{
    const data=await readBody(req);
    if(!data.length) return res.status(400).json({error:'Empty body'});
    JSON.parse(data.toString('utf8'));
    await put(pathname,data,{
      access:'private',
      addRandomSuffix:false,
      allowOverwrite:false,
      contentType:'application/json'
    });
    return res.status(200).json({ok:true,pathname,size:data.length});
  }catch(e){
    return res.status(500).json({error:String(e?.message||e)});
  }
}
