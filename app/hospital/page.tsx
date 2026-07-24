"use client";
import { useRouter } from "next/navigation";
export default function Page(){const r=useRouter();return <main className="coming-world" dir="rtl"><button onClick={()=>r.push('/kingdom')}>العودة إلى الخريطة</button><div><span>L’Hôpital</span><h1>المستشفى</h1><p>الأعراض والمواعيد وطلب المساعدة</p><b>تم فتح المبنى وربطه بالخريطة، مع الحفاظ على بقية محتوى المشروع.</b></div></main>}
