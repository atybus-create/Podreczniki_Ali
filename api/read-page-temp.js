import { get } from '@vercel/blob';
import sharp from 'sharp';

const ALLOWED = new Set(["161","162","163","164","165","166","167","168","169","170","171","172","173","174","175","176","177","178","179","180","181","182","183","184","185","186","187","188","189","190"]);

async function streamToBuffer(stream) {
  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    chunks.push(Buffer.from(part.value));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const id = String(req.query.page || '');
  if (!ALLOWED.has(id)) return res.status(400).end();

  const result = await get(`books/historia-5/pages/${id}.jpg`, { access: 'private' });
  if (!result || result.statusCode !== 200) return res.status(404).end();

  const buf = await streamToBuffer(result.stream);
  let img = sharp(buf).rotate();
  const angle = Number(req.query.rot || 0);
  if ([90, 180, 270].includes(angle)) img = img.rotate(angle);

  const small = await img
    .resize({ width: 850, withoutEnlargement: true })
    .jpeg({ quality: 68 })
    .toBuffer();

  res.setHeader('Cache-Control', 'no-store');
  if (String(req.query.raw || '') === '1') {
    res.setHeader('Content-Type', 'image/jpeg');
    return res.status(200).send(small);
  }
  return res.status(200).json({ page: id, rotation: angle, contentBase64: small.toString('base64') });
}
