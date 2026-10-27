import { z } from 'zod';
export const categories = ['web','ux','seo'] as const;
export const categoryLabels = {web:'طراحی وب‌سایت',ux:'رابط و تجربه کاربری',seo:'سئو'};
export const publicUrl = z.string().trim().max(2048).transform(value => /^https?:\/\//i.test(value) ? value : `https://${value}`).pipe(z.url()).refine(value => {try{const u = new URL(value); return ['http:','https:'].includes(u.protocol) && !u.username && !u.password && u.hostname.includes('.');}catch{return false;}},'لینک معتبر وب‌سایت را وارد کنید.').transform(value=>new URL(value).href);
export const projectSchema = z.object({
  title:z.string().trim().max(100).default(''), url:publicUrl,
  description:z.string().trim().max(600).default(''),
  categories:z.array(z.enum(categories)).min(1).max(3),
  image:z.string().max(2048).default('').refine(v => !v || /^\/(?:projects\/[a-zA-Z0-9._-]+|api\/media\/[a-zA-Z0-9._-]+)$/.test(v),'تصویر را از بخش بارگذاری انتخاب کنید.'),
  published:z.boolean().default(true), order:z.number().int().min(0).max(9999).default(0), color:z.enum(['silver','orange','sage']).default('silver')
});
export type Project = z.infer<typeof projectSchema> & {id:string};
export const settingsSchema=z.object({phone:z.string().trim().regex(/^\+?[0-9]{10,15}$/),whatsapp:z.string().trim().regex(/^[0-9]{10,15}$/),telegram:z.string().trim().regex(/^[a-zA-Z0-9_]{5,32}$/)});
export type Settings=z.infer<typeof settingsSchema>;
export const inquirySchema=z.object({name:z.string().trim().min(2).max(100),contact:z.string().trim().min(5).max(200),service:z.enum(categories),message:z.string().trim().min(10).max(3000),website:z.string().max(0).optional()});
export type Inquiry=z.infer<typeof inquirySchema>&{id:string;createdAt:string;read:boolean};
