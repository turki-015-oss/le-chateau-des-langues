"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, DoorOpen } from "lucide-react";

type Props = { titleFr:string; titleAr:string; subtitle:string; image:string; destination:string };

export default function WorldEntrance({titleFr,titleAr,subtitle,image,destination}:Props){
 const router=useRouter();
 return <main className="premium-entry" dir="rtl">
   <button className="premium-entry-back" onClick={()=>router.push('/kingdom')} aria-label="العودة"><ArrowLeft/></button>
   <section className="premium-entry-card">
     <div className="premium-entry-brand">Le Château des Langues</div>
     <div className="premium-entry-photo" style={{backgroundImage:`url('${image}')`}} />
     <div className="premium-entry-icon"><DoorOpen/></div>
     <p className="premium-entry-fr">{titleFr}</p>
     <h1>{titleAr}</h1>
     <p className="premium-entry-subtitle">{subtitle}</p>
     <button className="premium-entry-button" onClick={()=>router.push(destination)}><DoorOpen/> دخول العالم</button>
   </section>
 </main>
}
