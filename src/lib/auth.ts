import { createHmac, timingSafeEqual, scryptSync, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
export const cookieName='pp_session';
export function configured(){return !!process.env.ADMIN_PASSWORD_HASH && (process.env.SESSION_SECRET?.length||0)>=32;}
export function hashPassword(value:string,salt=randomBytes(16).toString('hex')){return `${salt}:${scryptSync(value,salt,64).toString('hex')}`;}
export function verifyPassword(value:string,hash:string){try{const [salt,digest]=hash.split(':');if(!salt||!digest)return false;const expected=Buffer.from(digest,'hex');const actual=scryptSync(value,salt,64);return actual.length===expected.length&&timingSafeEqual(actual,expected);}catch{return false;}}
function signature(value:string){return createHmac('sha256',process.env.SESSION_SECRET!).update(value+process.env.ADMIN_PASSWORD_HASH).digest('base64url');}
export function makeSession(){if(!configured())throw new Error('Admin is not configured');const payload=Buffer.from(JSON.stringify({exp:Date.now()+8*60*60*1000,nonce:randomBytes(16).toString('hex')})).toString('base64url');return `${payload}.${signature(payload)}`;}
export function validSession(value:string|undefined){if(!configured()||!value)return false;try{const parts=value.split('.');if(parts.length!==2)return false;const [payload,sig]=parts;const expected=Buffer.from(signature(payload));const actual=Buffer.from(sig);return actual.length===expected.length&&timingSafeEqual(actual,expected)&&JSON.parse(Buffer.from(payload,'base64url').toString()).exp>Date.now();}catch{return false;}}
export async function isAdmin(){return validSession((await cookies()).get(cookieName)?.value);}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');const expected=process.env.SITE_URL?new URL(process.env.SITE_URL).origin:new URL(req.url).origin;return !!origin&&origin===expected;}
