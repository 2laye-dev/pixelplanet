import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { dataDir } from '@/lib/store';
import { guard,invalid,boundedBytes } from '@/lib/api';
export async function POST(req:Request){const denied=await guard(req);if(denied)return denied;if(Number(req.headers.get('content-length'))>5_300_000)return Response.json({error:'حداکثر حجم تصویر ۵ مگابایت است.'},{status:413});try{const raw=await boundedBytes(req,5_300_000);const formRequest=new Request(req.url,{method:'POST',headers:{'content-type':req.headers.get('content-type')||''},body:raw});const file=(await formRequest.formData()).get('file');if(!(file instanceof File)||file.size>5*1024*1024)return invalid();const bytes=Buffer.from(await file.arrayBuffer());let ext='';if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))ext='png';else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)ext='jpg';else if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')ext='webp';if(!ext)return Response.json({error:'فقط تصویر PNG، JPG یا WebP پذیرفته می‌شود.'},{status:400});const dir=path.join(dataDir,'uploads');await fs.mkdir(dir,{recursive:true});const name=`${randomUUID()}.${ext}`;await fs.writeFile(path.join(dir,name),bytes);return Response.json({url:`/api/media/${name}`});}catch{return invalid();}}

