import { promises as fs } from 'node:fs';
import path from 'node:path';
import lockfile from 'proper-lockfile';
import { randomUUID } from 'node:crypto';
import type { Project, Settings, Inquiry } from './schema';
export const dataDir=path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || path.join(process.cwd(),'data'));
type Database={projects:Project[];settings:Settings;inquiries:Inquiry[];limits:Record<string,{count:number;until:number}>};
const initial:Database={
  projects:[
    {id:'labkhandyab',title:'لبخندیاب',url:'https://labkhandyab.ir',description:'جست‌وجوی دندانپزشک و کلینیک، روی نقشه.',categories:['web'],image:'/projects/labkhandyab.jpg',published:true,order:0,color:'sage'},
    {id:'shaygansoft',title:'شایگان سافت',url:'https://shaygansoft.com',description:'معرفی نرم‌افزارها و خدمات شایگان سافت.',categories:['web'],image:'/projects/shaygansoft.jpg',published:true,order:1,color:'silver'},
    {id:'magieto',title:'مژیتو',url:'https://magieto.com',description:'فروشگاه اینترنتی محصولات آرایشی و بهداشتی.',categories:['web'],image:'/projects/magieto.jpg',published:true,order:2,color:'orange'}
  ],settings:{phone:'09126446994',whatsapp:'989126446994',telegram:'SiaVasHjL'},inquiries:[],limits:{}
};
async function readUnlocked():Promise<Database>{try{return JSON.parse(await fs.readFile(path.join(dataDir,'content.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return structuredClone(initial);throw e;}}
export async function readStore(){return readUnlocked();}
export async function mutateStore<T>(fn:(db:Database)=>T|Promise<T>):Promise<T>{
  await fs.mkdir(dataDir,{recursive:true});
  const release=await lockfile.lock(dataDir,{retries:{retries:12,minTimeout:30,maxTimeout:300},stale:15000});
  try{const db=await readUnlocked();const result=await fn(db);const temp=path.join(dataDir,`.content-${randomUUID()}.tmp`);await fs.writeFile(temp,JSON.stringify(db,null,2),{mode:0o600});await fs.rename(temp,path.join(dataDir,'content.json'));return result;}finally{await release();}
}
export async function rateLimit(key:string,max:number,windowMs:number){return mutateStore(db=>{const now=Date.now();for(const [k,v]of Object.entries(db.limits))if(v.until<now)delete db.limits[k];const item=db.limits[key]||{count:0,until:now+windowMs};item.count++;db.limits[key]=item;return item.count<=max;});}

