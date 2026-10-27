import { isAdmin,configured } from '@/lib/auth';
import { readStore } from '@/lib/store';
import Admin from '@/components/Admin';
import Login from '@/components/Login';
export const dynamic='force-dynamic';
export const metadata={title:'مدیریت پیکسل پلنت',robots:{index:false,follow:false}};
export default async function Page(){if(!await isAdmin())return <Login configured={configured()}/>;const db=await readStore();return <Admin projects={db.projects} settings={db.settings} inquiries={db.inquiries}/>;}
