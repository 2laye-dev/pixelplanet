import {readStore} from '@/lib/store';
import Home from '@/components/Home';
export const dynamic='force-dynamic';
export default async function Page(){const db=await readStore();return <Home projects={db.projects.filter(p=>p.published).sort((a,b)=>a.order-b.order)} settings={db.settings}/>;}
