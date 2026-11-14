import { get } from '@vercel/blob';
import sharp from 'sharp';

async function streamToBuffer(stream){const r=stream.getReader();const c=[];while(true){const x=await r.read();if(x.done)break;c.push(Buffer.from(x.value));}return Buffer.concat(c);}

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).end();
  const start=Math.max(1,Math.min(222,Number(req.query.start||1)));
  const count=Math.max(1,Math.min(24,Number(req.query.count||24)));
  const cols=6, tileW=360, tileH=520, labelH=34;
  const items=[];
  for(let n=start;n<Math.min(223,start+count);n++){
    const id=String(n).padStart(3,'0');
    const g=await get(`books/historia-5/pages/${id}.jpg`,{access:'private'});
    if(!g||g.statusCode!==200) continue;
    const buf=await streamToBuffer(g.stream);
    const img=await sharp(buf).resize({width:tileW,height:tileH-labelH,fit:'contain',background:'#ffffff'}).jpeg({quality:58}).toBuffer();
    const label=Buffer.from(`<svg width="${tileW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="12" y="24" font-family="Arial" font-size="22" font-weight="700" fill="black">${id}</text></svg>`);
    const tile=await sharp({create:{width:tileW,height:tileH,channels:3,background:'#ffffff'}}).composite([{input:img,top:0,left:0},{input:label,top:tileH-labelH,left:0}]).jpeg({quality:70}).toBuffer();
    items.push({n,tile});
  }
  const rows=Math.ceil(items.length/cols);
  const sheet=await sharp({create:{width:cols*tileW,height:rows*tileH,channels:3,background:'#dddddd'}}).composite(items.map((x,i)=>({input:x.tile,left:(i%cols)*tileW,top:Math.floor(i/cols)*tileH}))).jpeg({quality:72}).toBuffer();
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({start,count:items.length,contentBase64:sheet.toString('base64')});
}