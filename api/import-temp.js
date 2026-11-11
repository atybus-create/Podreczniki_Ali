import { put } from '@vercel/blob';

const IMPORT_KEY="geo-replace-20261111-8p-91f4c2a7";
const ALLOWED=new Set(["049","051","057","111","113","145","148","162"]);

export const config={api:{bodyParser:{sizeLimit:'2mb'}}};

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(req.headers['x-import-key']!==IMPORT_KEY) return res.status(401).json({error:'Unauthorized'});
  const {pathname,contentBase64,contentType}=req.body||{};
  const m=typeof pathname==='string' && pathname.match(/^books\/planeta-nowa-5\/(pages|text)\/(\d{3})\.(jpg|json)$/);
  if(!m || !ALLOWED.has(m[2])) return res.status(400).json({error:'Invalid pathname'});
  if(typeof contentBase64!=='string' || contentBase64.length>1_900_000) return res.status(400).json({error:'Invalid content'});
  const data=Buffer.from(contentBase64,'base64');
  await put(pathname,data,{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:contentType||'application/octet-stream'});
  return res.status(200).json({ok:true,pathname,size:data.length});
}
