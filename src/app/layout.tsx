import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './motion.css';
const estedad=localFont({src:'../../public/fonts/Estedad.woff2',variable:'--font-estedad',weight:'100 900',style:'normal',display:'swap',preload:true});
export const metadata:Metadata={title:'پیکسل پلنت | طراحی وب‌سایت، UI/UX و سئو',description:'پیکسل پلنت؛ طراحی و توسعه وب‌سایت اختصاصی، رابط و تجربه کاربری و خدمات سئو. نمونه‌کارهای سیاوش را ببینید و درباره پروژه خود صحبت کنید.',robots:{index:true,follow:true},openGraph:{title:'پیکسل پلنت',description:'از اولین پیکسل تا تجربه‌ای ماندگار.',locale:'fa_IR',type:'website'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl" className={estedad.variable}><body>{children}</body></html>;}
