import { get } from '@vercel/blob';

export default async function handler(req,res){
  const pathname=String(req.query.pathname||'');
  if(!pathname.startsWith('books/')) return res.status(400).json({error:'Invalid path'});
  const result=await get(pathname,{access:'private'});
  if(!result || result.statusCode!==200) return res.status(404).end('Not found');
  res.setHeader('Content-Type',result.blob.contentType||'application/octet-stream');
  // Catalogs and manifests change when new pages are imported. Never let a
  // browser keep an older page count after a production update.
  res.setHeader(
    'Cache-Control',
    pathname.endsWith('.json')
      ? 'private, no-store, max-age=0, must-revalidate'
      : 'private, max-age=3600'
  );
  res.setHeader('X-Content-Type-Options','nosniff');
  const reader=result.stream.getReader();
  while(true){
    const {done,value}=await reader.read();
    if(done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}
