"use client";

export type ListeningPrompt = {
  id: string;
  fr: string;
  ar: string;
  hint: string;
};

type Props = {
  prompt: ListeningPrompt;
  answer: string;
  result: "idle" | "correct" | "wrong";
  solved: number;
  total: number;
  best: number;
  showHint: boolean;
  onAnswerChange: (value: string) => void;
  onListen: () => void;
  onCheck: () => void;
  onNext: () => void;
  onToggleHint: () => void;
};

export default function CafeListeningLab({
  prompt,
  answer,
  result,
  solved,
  total,
  best,
  showHint,
  onAnswerChange,
  onListen,
  onCheck,
  onNext,
  onToggleHint,
}: Props) {
  return (
    <section className="listening-lab-card">
      <div className="listening-lab-heading">
        <div>
          <span>Laboratoire d’écoute</span>
          <h2>مختبر الاستماع والإملاء</h2>
          <p>استمع إلى العبارة الفرنسية ثم اكتبها كما سمعتها.</p>
        </div>
        <div className="listening-lab-stats">
          <b>{solved}/{total}</b>
          <small>أفضل نتيجة: {best}</small>
        </div>
      </div>

      <div className="listening-stage">
        <button className="listening-play" onClick={onListen}>
          <span>🔊</span>
          <strong>استمع إلى العبارة</strong>
          <small>يمكنك إعادة التشغيل أكثر من مرة</small>
        </button>

        <button className="listening-hint-toggle" onClick={onToggleHint}>
          {showHint ? "إخفاء التلميح" : "إظهار تلميح"}
        </button>

        {showHint && (
          <div className="listening-hint">
            <span>المعنى</span>
            <strong>{prompt.ar}</strong>
            <small>{prompt.hint}</small>
          </div>
        )}
      </div>

      <label className="listening-input-wrap">
        <span>اكتب بالفرنسية</span>
        <textarea
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder="Écrivez la phrase ici…"
          autoCapitalize="sentences"
          spellCheck={false}
        />
      </label>

      {result !== "idle" && (
        <div className={`listening-result ${result}`}>
          {result === "correct" ? (
            <>
              <strong>Excellent !</strong>
              <span>كتبت العبارة بشكل صحيح وحصلت على XP.</span>
            </>
          ) : (
            <>
              <strong>Écoute encore.</strong>
              <span>الصياغة الصحيحة: {prompt.fr}</span>
            </>
          )}
        </div>
      )}

      <div className="listening-actions">
        <button onClick={onCheck} disabled={!answer.trim()}>تحقق من الكتابة</button>
        <button onClick={onNext}>العبارة التالية</button>
      </div>
    </section>
  );
}
