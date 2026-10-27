import { guard,body,invalid } from '@/lib/api';
import { settingsSchema } from '@/lib/schema';
import { mutateStore } from '@/lib/store';
export async function PUT(req:Request){const denied=await guard(req);if(denied)return denied;try{const parsed=settingsSchema.safeParse(await body(req));if(!parsed.success)return invalid();await mutateStore(db=>{db.settings=parsed.data;});return Response.json({ok:true});}catch{return invalid();}}
