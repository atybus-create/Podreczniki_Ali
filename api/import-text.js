import { put } from '@vercel/blob';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import * as tar from 'tar';

export const config = { maxDuration: 300 };

export default async function handler(req,res){
  const src=String(req.query.src||'');
  const allowed='https://sdmntprdenmarkeast.oaiusercontent.com/files/';
  if(!src.startsWith(allowed)) return res.status(400).json({error:'invalid source'});
  const r=await fetch(src);
  if(!r.ok) return res.status(502).json({error:'source fetch failed',status:r.status});
  const buf=Buffer.from(await r.arrayBuffer());
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'geo-'));
  const tgz=path.join(dir,'texts.tar.gz');
  await fs.writeFile(tgz,buf);
  await tar.x({file:tgz,cwd:dir});
  const textDir=path.join(dir,'text');
  const files=(await fs.readdir(textDir)).filter(x=>/^\d{3}\.json$/.test(x)).sort();
  let cursor=0,done=0;
  async function worker(){
    while(true){
      const i=cursor++;
      if(i>=files.length)return;
      const name=files[i];
      const data=await fs.readFile(path.join(textDir,name));
      await put('books/planeta-nowa-5/text/'+name,data,{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});
      done++;
    }
  }
  await Promise.all(Array.from({length:8},worker));
  return res.status(200).json({ok:true,uploaded:done});
}
