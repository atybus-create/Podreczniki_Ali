import { get } from '@vercel/blob';
import sharp from 'sharp';
const ALLOWED=new Set(["071","072","073","074","075","076","077","078","079","080","081","082","083","084","085","086","087","088","089","090","091","092","093","094","095","096","097","098","099","100"]);
async function streamToBuffer(stream){const r=stream.getReader();const c=[];while(true){const x=await r.read();if(x.done)break;c.push(Buffer.from(x.value));}return Buffer.concat(c);}
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const id=String(req.query.page||''); if(!ALLOWED.has(id))return res.status(400).end();
 const result=await get(`books/historia-5/pages/${id}.jpg`,{access:'private'});
 if(!result||result.statusCode!==200)return res.status(404).end();
 const buf=await streamToBuffer(result.stream);
 const small=await sharp(buf).rotate().resize({width:850,withoutEnlargement:true}).jpeg({quality:68}).toBuffer();
 res.setHeader('Cache-Control','no-store');
 return res.status(200).json({page:id,contentBase64:small.toString('base64')});
}