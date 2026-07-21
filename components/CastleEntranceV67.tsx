"use client";
import { useRouter } from "next/navigation";

export default function CastleEntranceV67(){
  const router=useRouter();
  return <main className="v67-image-page v67-entry-page" dir="rtl">
    <div className="v67-image-stage">
      <img src="/images/castle-v67/entry.jpg" alt="مدخل القلعة" />
      <button className="v67-hotspot v67-entry-close" onClick={()=>router.push('/kingdom')} aria-label="إغلاق والعودة إلى الخريطة" />
      <button className="v67-hotspot v67-entry-enter" onClick={()=>router.push('/castle')} aria-label="دخول العالم" />
    </div>
  </main>;
}
