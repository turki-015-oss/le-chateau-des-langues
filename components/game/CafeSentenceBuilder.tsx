"use client";

export type SentencePuzzle = {
  id: string;
  promptAr: string;
  answer: string;
  words: string[];
};

type Props = {
  puzzle: SentencePuzzle;
  selectedWords: string[];
  result: "idle" | "correct" | "wrong";
  solved: number;
  total: number;
  best: number;
  onPick: (word: string, index: number) => void;
  onRemove: (index: number) => void;
  onCheck: () => void;
  onReset: () => void;
  onNext: () => void;
  onSpeak: (text: string) => void;
};

export default function CafeSentenceBuilder({
  puzzle,
  selectedWords,
  result,
  solved,
  total,
  best,
  onPick,
  onRemove,
  onCheck,
  onReset,
  onNext,
  onSpeak,
}: Props) {
  const usedCounts = selectedWords.reduce<Record<string, number>>((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const wordUsage: Record<string, number> = {};

  return (
    <section className="sentence-builder-card">
      <div className="sentence-builder-heading">
        <div>
          <span>Atelier des phrases</span>
          <h2>ورشة تركيب الجمل</h2>
          <p>رتّب الكلمات لتكوين العبارة الفرنسية الصحيحة.</p>
        </div>
        <div className="sentence-builder-stats">
          <b>{solved}/{total}</b>
          <small>أفضل نتيجة: {best}</small>
        </div>
      </div>

      <div className="sentence-builder-prompt">
        <span>المعنى المطلوب</span>
        <strong>{puzzle.promptAr}</strong>
        <button onClick={() => onSpeak(puzzle.answer)} aria-label="استمع إلى الجملة الصحيحة">🔊</button>
      </div>

      <div className={`sentence-builder-answer ${result}`}>
        {selectedWords.length ? selectedWords.map((word, index) => (
          <button key={`${word}-${index}`} onClick={() => onRemove(index)}>{word}</button>
        )) : <span>اضغط على الكلمات بالترتيب…</span>}
      </div>

      <div className="sentence-builder-words">
        {puzzle.words.map((word, index) => {
          wordUsage[word] = (wordUsage[word] || 0) + 1;
          const disabled = (usedCounts[word] || 0) >= wordUsage[word];
          return (
            <button
              key={`${word}-${index}`}
              disabled={disabled || result === "correct"}
              onClick={() => onPick(word, index)}
            >
              {word}
            </button>
          );
        })}
      </div>

      {result !== "idle" && (
        <div className={`sentence-builder-feedback ${result}`}>
          {result === "correct"
            ? "Très bien ! الجملة صحيحة وحصلت على 8 XP."
            : "Presque… راجع ترتيب الكلمات وحاول مرة أخرى."}
        </div>
      )}

      <div className="sentence-builder-actions">
        <button onClick={onReset}>إعادة الترتيب</button>
        {result === "correct" ? (
          <button className="primary" onClick={onNext}>الجملة التالية</button>
        ) : (
          <button className="primary" disabled={!selectedWords.length} onClick={onCheck}>تحقق</button>
        )}
      </div>
    </section>
  );
}
