import crypto from 'node:crypto';
function expected(){return crypto.createHmac('sha256',process.env.COOKIE_SECRET||'missing').update('authorized').digest('hex')}
function cookie(req,name){const raw=req.headers.cookie||'';for(const p of raw.split(';')){const [k,...v]=p.trim().split('=');if(k===name)return v.join('=')}return ''}
export default function handler(req,res){return res.status(200).json({ok:cookie(req,'ali_session')===expected()})}
