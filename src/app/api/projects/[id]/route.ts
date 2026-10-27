import { mutateStore } from '@/lib/store';
import { projectSchema } from '@/lib/schema';
import { guard,body,invalid } from '@/lib/api';
type Context={params:Promise<{id:string}>};
export async function PUT(req:Request,ctx:Context){const denied=await guard(req);if(denied)return denied;try{const result=projectSchema.safeParse(await body(req));if(!result.success)return invalid();const {id}=await ctx.params;const found=await mutateStore(db=>{const i=db.projects.findIndex(p=>p.id===id);if(i<0)return false;db.projects[i]={...result.data,id,title:result.data.title||new URL(result.data.url).hostname};return true;});return Response.json({ok:found},{status:found?200:404});}catch{return invalid();}}
export async function DELETE(req:Request,ctx:Context){const denied=await guard(req);if(denied)return denied;const {id}=await ctx.params;await mutateStore(db=>{db.projects=db.projects.filter(p=>p.id!==id);});return Response.json({ok:true});}
