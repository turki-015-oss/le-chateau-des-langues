"use client";

import { useRouter } from "next/navigation";

export default function EntryPage() {
  const router = useRouter();
  return (
    <main className="approved-screen approved-entry" aria-label="مدخل القلعة">
      <div className="approved-canvas" style={{ backgroundImage: "url('/castle-v68/entry.png')" }}>
        <button className="approved-hotspot entry-close" onClick={() => router.push('/kingdom')} aria-label="إغلاق والعودة إلى الخريطة" />
        <button className="approved-hotspot entry-enter" onClick={() => router.push('/welcome')} aria-label="دخول العالم" />
        <span className="sr-only">Le Château — القلعة — تعلم باحترافية</span>
      </div>
    </main>
  );
}
