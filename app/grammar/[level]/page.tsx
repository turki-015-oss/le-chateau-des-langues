import Link from "next/link";
import { notFound } from "next/navigation";

const data = {
  a1: ["A1", "Débutant", "المبتدئ"],
  a2: ["A2", "Les bases", "الأساسيات"],
  b1: ["B1", "Intermédiaire", "المتوسط"],
  b2: ["B2", "Intermédiaire supérieur", "فوق المتوسط"],
  c1: ["C1", "Avancé", "المتقدم"],
  c2: ["C2", "Maîtrise", "الإتقان"],
} as const;

export default async function GrammarLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const item = data[level as keyof typeof data];
  if (!item) notFound();
  return (
    <main className="level-page" dir="rtl">
      <div className="level-panel">
        <span>{item[0]}</span>
        <h1 dir="ltr">{item[1]}</h1>
        <h2>{item[2]}</h2>
        <p>تم ربط هذا المستوى فعليًا. ستُضاف دروس القواعد داخله وفق الخطة المعتمدة دون تمارين.</p>
        <Link href="/grammar">العودة إلى قاعة القواعد</Link>
      </div>
    </main>
  );
}
