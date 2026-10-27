import { cookies } from 'next/headers';
import { configured,cookieName,makeSession,sameOrigin,verifyPassword } from '@/lib/auth';
import { rateLimit } from '@/lib/store';
import { body,invalid } from '@/lib/api';
export const runtime='nodejs';
export async function POST(req:Request){
  if(!sameOrigin(req))return Response.json({error:'مبدأ درخواست معتبر نیست.'},{status:403});
  if(!configured())return Response.json({error:'ابتدا رمز مدیر و کلید نشست را طبق راهنمای نصب تنظیم کنید.'},{status:503});
  if(!await rateLimit('login',12,15*60*1000))return Response.json({error:'تلاش‌های ورود زیاد است. ۱۵ دقیقه دیگر دوباره امتحان کنید.'},{status:429});
  try{const data=await body(req);if(typeof data.password!=='string'||data.password.length>256)return invalid();if(data.username!==(process.env.ADMIN_USERNAME||'admin')||!verifyPassword(data.password,process.env.ADMIN_PASSWORD_HASH!))return Response.json({error:'نام کاربری یا رمز عبور صحیح نیست.'},{status:401});
    (await cookies()).set(cookieName,makeSession(),{httpOnly:true,sameSite:'strict',secure:process.env.COOKIE_SECURE!=='false'&&process.env.NODE_ENV==='production',path:'/',maxAge:28800});return Response.json({ok:true});
  }catch{return invalid();}
}
export async function DELETE(req:Request){if(!sameOrigin(req))return Response.json({error:'درخواست نامعتبر'},{status:403});(await cookies()).delete(cookieName);return Response.json({ok:true});}
