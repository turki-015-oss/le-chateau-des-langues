"use client";

import { BookOpen, Brain, CheckCircle2, Headphones, RotateCcw, Volume2 } from "lucide-react";

export type LearningPhrase = {
  id: string;
  fr: string;
  ar: string;
  category: string;
};

type Props = {
  phrases: LearningPhrase[];
  masteredIds: string[];
  difficultIds: string[];
  reviewIndex: number;
  reviewAnswer: string;
  reviewResult: "idle" | "correct" | "wrong";
  onSpeak: (text: string) => void;
  onToggleMastery: (id: string) => void;
  onAnswerChange: (value: string) => void;
  onCheck: () => void;
  onNext: () => void;
};

export default function CafeLearningJournal({
  phrases,
  masteredIds,
  difficultIds,
  reviewIndex,
  reviewAnswer,
  reviewResult,
  onSpeak,
  onToggleMastery,
  onAnswerChange,
  onCheck,
  onNext,
}: Props) {
  const phrase = phrases[reviewIndex % phrases.length];
  const mastery = Math.round((masteredIds.length / Math.max(1, phrases.length)) * 100);

  return (
    <section className="learning-journal">
      <div className="journal-heading">
        <div>
          <span><BookOpen size={17} /> CARNET DU CAFÉ</span>
          <h2>دفتر تعلم المقهى</h2>
        </div>
        <b>{mastery}% إتقان</b>
      </div>

      <div className="journal-progress"><span style={{ width: `${mastery}%` }} /></div>

      <div className="journal-grid">
        <div className="phrase-library">
          <div className="journal-subheading">
            <strong>العبارات الأساسية</strong>
            <small>{masteredIds.length}/{phrases.length} محفوظة</small>
          </div>

          <div className="phrase-list">
            {phrases.map((item) => {
              const mastered = masteredIds.includes(item.id);
              const difficult = difficultIds.includes(item.id);
              return (
                <article key={item.id} className={`${mastered ? "mastered" : ""} ${difficult ? "difficult" : ""}`}>
                  <button className="phrase-audio" onClick={() => onSpeak(item.fr)} aria-label={`استمع إلى ${item.fr}`}>
                    <Volume2 size={17} />
                  </button>
                  <div>
                    <strong>{item.fr}</strong>
                    <span>{item.ar}</span>
                    <small>{item.category}{difficult ? " · يحتاج مراجعة" : ""}</small>
                  </div>
                  <button className="mastery-toggle" onClick={() => onToggleMastery(item.id)}>
                    {mastered ? <CheckCircle2 size={18} /> : "حفظ"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="quick-review">
          <div className="journal-subheading">
            <strong><Brain size={18} /> مراجعة سريعة</strong>
            <small>اكتب الجملة بالفرنسية</small>
          </div>

          <div className="review-card">
            <span>{phrase.category}</span>
            <h3>{phrase.ar}</h3>
            <button onClick={() => onSpeak(phrase.fr)}><Headphones size={17} /> استمع للمساعدة</button>
          </div>

          <input
            value={reviewAnswer}
            onChange={(event) => onAnswerChange(event.target.value)}
            placeholder="Écrivez la phrase en français..."
            dir="ltr"
          />

          {reviewResult !== "idle" && (
            <div className={`review-result ${reviewResult}`}>
              {reviewResult === "correct" ? "Très bien ! إجابة صحيحة." : `راجعها مرة أخرى: ${phrase.fr}`}
            </div>
          )}

          <div className="review-actions">
            <button onClick={onCheck} disabled={!reviewAnswer.trim()}>تحقق</button>
            <button onClick={onNext}><RotateCcw size={17} /> عبارة أخرى</button>
          </div>
        </div>
      </div>
    </section>
  );
}
