import { isAdmin, sameOrigin } from './auth';
export async function guard(req:Request){if(!sameOrigin(req))return Response.json({error:'درخواست نامعتبر است.'},{status:403});if(!await isAdmin())return Response.json({error:'ابتدا وارد پنل شوید.'},{status:401});}
export async function boundedBytes(req:Request,limit:number){if(Number(req.headers.get('content-length'))>limit)throw new Error('TOO_LARGE');const reader=req.body?.getReader();if(!reader)throw new Error('EMPTY');let size=0;const chunks:Uint8Array[]=[];for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new Error('TOO_LARGE');}chunks.push(value);}return Buffer.concat(chunks);}
export async function body(req:Request){return JSON.parse((await boundedBytes(req,16000)).toString('utf8'));}
export function invalid(){return Response.json({error:'اطلاعات واردشده معتبر نیست. فیلدها را بررسی کنید.'},{status:400});}
