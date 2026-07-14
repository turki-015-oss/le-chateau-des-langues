"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Gavel,
  Medal,
  Star,
  Volume2,
  XCircle
} from "lucide-react";
import {
  courtCharacters,
  courtQuestions,
  courtRewards
} from "@/data/court";

export default function CourtPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showArabic, setShowArabic] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const question = courtQuestions[questionIndex];
  const character =
    question.speaker === "Jules"
      ? courtCharacters.judge
      : courtCharacters.clerk;

  const progress = useMemo(
    () => Math.round(((questionIndex + 1) / courtQuestions.length) * 100),
    [questionIndex]
  );

  useEffect(() => {
    setXp(Number(localStorage.getItem("chateau-court-xp") || "0"));
    setCoins(Number(localStorage.getItem("chateau-coins") || "0"));
    setCompleted(
      localStorage.getItem("chateau-court-completed") === "true"
    );
  }, []);

  const speak = (text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.82;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const playSuccessTone = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.12, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.35
    );
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.35);
  };

  const playErrorTone = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(170, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.32
    );
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.32);
  };

  const chooseAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    if (question.answers[answerIndex].correct) {
      setFeedback("correct");
      setScore((value) => value + 1);
      playSuccessTone();
    } else {
      setFeedback("wrong");
      playErrorTone();
    }
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    if (questionIndex < courtQuestions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      return;
    }

    const nextXp = xp + courtRewards.xp;
    const nextCoins = coins + courtRewards.coins;

    setXp(nextXp);
    setCoins(nextCoins);
    setCompleted(true);

    localStorage.setItem("chateau-court-xp", String(nextXp));
    localStorage.setItem("chateau-coins", String(nextCoins));
    localStorage.setItem("chateau-court-completed", "true");
    localStorage.setItem("chateau-palace-unlocked", "true");
  };

  return (
    <main className="court-world">
      <header className="court-header">
        <Link href="/" className="back-link">
          <ArrowRight size={20} />
          المملكة
        </Link>

        <div className="court-progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="court-stats">
          <span><Star size={17} /> {xp} XP</span>
          <span><Coins size={17} /> {coins}</span>
        </div>
      </header>

      <section className="court-hero">
        <div className="court-hero-overlay" />

        <div className="court-hero-copy">
          <span>B2 · Le Tribunal Royal</span>
          <h1>المحكمة الملكية</h1>
          <p>
            استمع، افهم، ثم اختر الإجابة الفرنسية المناسبة داخل قاعة المحكمة.
          </p>

          <button onClick={() => setShowArabic((value) => !value)}>
            {showArabic ? "إخفاء الترجمة" : "إظهار الترجمة"}
          </button>
        </div>
      </section>

      <section className="court-layout">
        <aside className="court-character-card">
          <div className="court-avatar">{character.avatar}</div>
          <span>{character.name}</span>
          <h2>{character.role}</h2>
          <small>{character.roleAr}</small>

          <div className="court-character-greeting">
            <button onClick={() => speak(character.greeting)}>
              <Volume2 size={19} />
              استمع
            </button>
            <p>{character.greeting}</p>
            {showArabic && <small>{character.greetingAr}</small>}
          </div>
        </aside>

        <section className="court-question-panel">
          <div className="court-question-heading">
            <div>
              <span>
                السؤال {questionIndex + 1} من {courtQuestions.length}
              </span>
              <h2>{question.question}</h2>
              {showArabic && <p>{question.translation}</p>}
            </div>

            <button
              className="court-question-audio"
              onClick={() => speak(question.question)}
            >
              <Volume2 size={22} />
              صوت السؤال
            </button>
          </div>

          <div className="court-answer-list">
            {question.answers.map((answer, answerIndex) => {
              const isSelected = selectedAnswer === answerIndex;
              const isCorrect = answer.correct;
              const stateClass =
                selectedAnswer === null
                  ? ""
                  : isCorrect
                    ? "correct"
                    : isSelected
                      ? "wrong"
                      : "muted";

              return (
                <article
                  key={answer.text}
                  className={`court-answer ${stateClass}`}
                >
                  <button
                    className="court-answer-main"
                    onClick={() => chooseAnswer(answerIndex)}
                    disabled={selectedAnswer !== null}
                  >
                    <span>{String.fromCharCode(65 + answerIndex)}</span>
                    <div>
                      <strong>{answer.text}</strong>
                      {showArabic && <small>{answer.translation}</small>}
                    </div>
                  </button>

                  <button
                    className="court-answer-audio"
                    onClick={() => speak(answer.text)}
                    aria-label={`استمع إلى الإجابة ${answerIndex + 1}`}
                  >
                    <Volume2 size={18} />
                  </button>
                </article>
              );
            })}
          </div>

          {feedback && (
            <div className={`court-feedback ${feedback}`}>
              {feedback === "correct" ? (
                <CheckCircle2 size={22} />
              ) : (
                <XCircle size={22} />
              )}

              <div>
                <strong>
                  {feedback === "correct"
                    ? "Très bien !"
                    : "Essayons encore."}
                </strong>
                <p>
                  {feedback === "correct"
                    ? question.explanation
                    : "Écoutez les réponses puis choisissez celle qui correspond au contexte."}
                </p>
                {showArabic && (
                  <small>
                    {feedback === "correct"
                      ? question.explanationAr
                      : "استمع إلى الإجابات ثم اختر الإجابة المناسبة للسياق."}
                  </small>
                )}
              </div>
            </div>
          )}

          <button
            className="court-next"
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
          >
            {questionIndex === courtQuestions.length - 1
              ? "إصدار الحكم"
              : "السؤال التالي"}
          </button>
        </section>
      </section>

      {completed && (
        <section className="court-completion">
          <div className="court-medal">
            <Medal size={76} />
            <span>J</span>
          </div>

          <Gavel size={42} />
          <h2>{courtRewards.badge}</h2>
          <h3>{courtRewards.badgeAr}</h3>
          <p>
            أكملت المحكمة وحصلت على {courtRewards.xp} XP و
            {courtRewards.coins} عملة.
          </p>
          <strong>النتيجة: {score} / {courtQuestions.length}</strong>

          <Link href="/">العودة إلى المملكة</Link>
        </section>
      )}
    </main>
  );
}