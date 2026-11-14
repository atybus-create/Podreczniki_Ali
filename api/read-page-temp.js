import { get } from '@vercel/blob';
import sharp from 'sharp';
const ALLOWED=new Set(["131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150","151","152","153","154","155","156","157","158","159","160"]);
async function streamToBuffer(stream){const r=stream.getReader();const c=[];while(true){const x=await r.read();if(x.done)break;c.push(Buffer.from(x.value));}return Buffer.concat(c);}
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const id=String(req.query.page||''); if(!ALLOWED.has(id))return res.status(400).end();
 const result=await get(`books/historia-5/pages/${id}.jpg`,{access:'private'});
 if(!result||result.statusCode!==200)return res.status(404).end();
 const buf=await streamToBuffer(result.stream);
 const small=await sharp(buf).rotate().resize({width:850,withoutEnlargement:true}).jpeg({quality:68}).toBuffer();
 res.setHeader('Cache-Control','no-store');
 if(String(req.query.raw||'')==='1'){res.setHeader('Content-Type','image/jpeg');return res.status(200).send(small);}
 return res.status(200).json({page:id,contentBase64:small.toString('base64')});
}
