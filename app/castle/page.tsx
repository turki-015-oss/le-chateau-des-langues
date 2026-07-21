"use client";

import { useRouter } from "next/navigation";

const hotspots = [
  { cls: "hall-conjugation", label: "دخول قاعة تصريف الأفعال", path: "/conjugation" },
  { cls: "hall-grammar", label: "دخول قاعة القواعد", path: "/grammar" },
  { cls: "hall-achievements", label: "دخول قاعة الإنجازات", path: "/achievements" },
  { cls: "hall-library", label: "دخول المكتبة", path: "/library" },
  { cls: "hall-tests", label: "دخول قاعة الاختبارات", path: "/tests" },
];

export default function CastlePage() {
  const router = useRouter();
  return (
    <main className="approved-screen approved-halls" aria-label="قاعات القلعة">
      <div className="approved-canvas" style={{ backgroundImage: "url('/castle-v68/halls.png')" }}>
        <button className="approved-hotspot halls-back" onClick={() => router.push('/welcome')} aria-label="العودة" />
        {hotspots.map((item) => (
          <button key={item.cls} className={`approved-hotspot ${item.cls}`} onClick={() => router.push(item.path)} aria-label={item.label} />
        ))}
        <span className="sr-only">قاعات القلعة: قاعة تصريف الأفعال، قاعة القواعد، قاعة الإنجازات، المكتبة، قاعة الاختبارات.</span>
      </div>
    </main>
  );
}
