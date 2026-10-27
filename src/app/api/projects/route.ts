import { randomUUID } from 'node:crypto';
import { readStore,mutateStore } from '@/lib/store';
import { projectSchema } from '@/lib/schema';
import { guard,body,invalid } from '@/lib/api';
export const dynamic='force-dynamic';
export async function GET(){return Response.json((await readStore()).projects.filter(p=>p.published).sort((a,b)=>a.order-b.order));}
export async function POST(req:Request){const denied=await guard(req);if(denied)return denied;try{const result=projectSchema.safeParse(await body(req));if(!result.success)return invalid();const project={...result.data,id:randomUUID(),title:result.data.title||new URL(result.data.url).hostname};await mutateStore(db=>{db.projects.push(project);});return Response.json(project,{status:201});}catch{return invalid();}}
