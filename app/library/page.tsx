"use client";
import { useRouter } from "next/navigation";
export default function Page(){const r=useRouter();return <main className="coming-world" dir="rtl"><button onClick={()=>r.push('/kingdom')}>العودة إلى الخريطة</button><div><span>La Bibliothèque</span><h1>المكتبة</h1><p>الكتب والقراءة والبحث</p><b>تم فتح المبنى وإضافة شاشة الدخول المعتمدة. سيُبنى المحتوى التعليمي الكامل في المرحلة التالية.</b></div></main>}
