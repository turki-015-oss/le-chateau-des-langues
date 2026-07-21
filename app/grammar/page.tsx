"use client";

import { useRouter } from "next/navigation";

const levels = ["a1", "a2", "b1", "b2", "c1", "c2"] as const;

export default function GrammarPage() {
  const router = useRouter();
  return (
    <main className="approved-screen approved-grammar" aria-label="قاعة القواعد">
      <div className="approved-canvas" style={{ backgroundImage: "url('/castle-v68/grammar.png')" }}>
        <button className="approved-hotspot grammar-back" onClick={() => router.push('/castle')} aria-label="العودة إلى قاعات القلعة" />
        {levels.map((level) => (
          <button key={level} className={`approved-hotspot grammar-${level}`} onClick={() => router.push(`/grammar/${level}`)} aria-label={`دخول مستوى ${level.toUpperCase()}`} />
        ))}
        <span className="sr-only">La Salle de Grammaire — قاعة القواعد — A1 A2 B1 B2 C1 C2</span>
      </div>
    </main>
  );
}
