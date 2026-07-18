"use client";
import { useRouter } from "next/navigation";
export default function Page(){const r=useRouter();return <main className="coming-world" dir="rtl"><button onClick={()=>r.push('/kingdom')}>العودة إلى الخريطة</button><div><span>L’Hôtel</span><h1>الفندق</h1><p>الحجز والغرف والاستقبال</p><b>تم فتح المبنى وإضافة شاشة الدخول المعتمدة. سيُبنى المحتوى التعليمي الكامل في المرحلة التالية.</b></div></main>}
