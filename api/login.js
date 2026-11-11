import crypto from 'node:crypto';

function cookieValue(){
  return crypto.createHmac('sha256',process.env.COOKIE_SECRET||'missing').update('authorized').digest('hex');
}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  let body=req.body||{};
  if(typeof body==='string'){try{body=JSON.parse(body)}catch{}}
  if(!process.env.APP_PIN || String(body.pin)!==String(process.env.APP_PIN)){
    return res.status(401).json({ok:false});
  }
  res.setHeader('Set-Cookie',`ali_session=${cookieValue()}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
  return res.status(200).json({ok:true});
}
