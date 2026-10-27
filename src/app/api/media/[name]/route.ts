import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/lib/store';
export async function GET(_req:Request,ctx:{params:Promise<{name:string}>}){const {name}=await ctx.params;if(!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(name))return new Response(null,{status:404});try{const file=await fs.readFile(path.join(dataDir,'uploads',name));return new Response(file,{headers:{'Content-Type':`image/${name.endsWith('jpg')?'jpeg':name.split('.').pop()}`,'Cache-Control':'public, max-age=31536000, immutable'}});}catch{return new Response(null,{status:404});}}
