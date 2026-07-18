"use client";
import { useRouter } from "next/navigation";
export default function Page(){const r=useRouter();return <main className="coming-world" dir="rtl"><button onClick={()=>r.push('/kingdom')}>العودة إلى الخريطة</button><div><span>Le Stade</span><h1>الملعب</h1><p>المباريات والجمهور والرياضة</p><b>تم فتح المبنى وإضافة شاشة الدخول المعتمدة. سيُبنى المحتوى التعليمي الكامل في المرحلة التالية.</b></div></main>}
