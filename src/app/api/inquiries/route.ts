import { randomUUID } from 'node:crypto';
import { inquirySchema } from '@/lib/schema';
import { mutateStore,rateLimit } from '@/lib/store';
import { sameOrigin } from '@/lib/auth';
import { body,guard,invalid } from '@/lib/api';
export async function POST(req:Request){if(!sameOrigin(req))return Response.json({error:'درخواست نامعتبر است.'},{status:403});try{const parsed=inquirySchema.safeParse(await body(req));if(!parsed.success)return invalid();const key=Buffer.from(parsed.data.contact).toString('base64url');if(!await rateLimit(`inquiry:${key}`,3,3600000)||!await rateLimit('inquiry:global',100,3600000))return Response.json({error:'درخواست‌های زیادی ثبت شده است. کمی بعد دوباره تلاش کنید یا در واتساپ پیام بدهید.'},{status:429});await mutateStore(db=>{db.inquiries.unshift({...parsed.data,id:randomUUID(),createdAt:new Date().toISOString(),read:false});});return Response.json({ok:true},{status:201});}catch{return invalid();}}
export async function PATCH(req:Request){const denied=await guard(req);if(denied)return denied;try{const data=await body(req);await mutateStore(db=>{const message=db.inquiries.find(m=>m.id===data.id);if(message)message.read=true;});return Response.json({ok:true});}catch{return invalid();}}
