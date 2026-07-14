"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Coins, Star, Volume2 } from "lucide-react";
import { familyCharacters, familyVocabulary } from "@/data/family";

export default function FamilyWorld() {
  const [characterIndex, setCharacterIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showArabic, setShowArabic] = useState(true);

  const character = familyCharacters[characterIndex];
  const question = character.questions[questionIndex % character.questions.length];

  const progress = useMemo(
    () => Math.round(((characterIndex + 1) / familyCharacters.length) * 100),
    [characterIndex]
  );

  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "fr-FR";
    speech.rate = 0.82;
    speechSynthesis.speak(speech);
  };

  const chooseAnswer = (index: number) => {
    if (index === question.correct) {
      setFeedback("Très bien ! إجابة صحيحة");
      setScore((value) => value + 1);
      setXp((value) => value + 20);
    } else {
      setFeedback("Essayons encore. حاول مرة أخرى");
    }
  };

  const nextQuestion = () => {
    setFeedback("");
    if (questionIndex + 1 < character.questions.length) {
      setQuestionIndex((value) => value + 1);
      return;
    }
    setQuestionIndex(0);
    setCharacterIndex((value) => (value + 1) % familyCharacters.length);
  };

  return (
    <main className="family-world">
      <header className="family-header">
        <Link href="/" className="back-link">
          <ArrowRight size={20} />
          العودة إلى المملكة
        </Link>

        <div className="family-progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="rewards">
          <span><Star size={17} /> {xp} XP</span>
          <span><Coins size={17} /> {score * 5}</span>
        </div>
      </header>

      <section className="family-hero">
        <div className="family-scene-overlay" />
        <div className="family-title">
          <span>A1 · Monde familial</span>
          <h1>Le Quartier des Familles</h1>
          <p>تعلّم الفرنسية من خلال الحياة اليومية داخل الحي العائلي.</p>
          <button onClick={() => setShowArabic((value) => !value)}>
            {showArabic ? "إخفاء الترجمة" : "إظهار الترجمة"}
          </button>
        </div>
      </section>

      <section className="family-layout">
        <aside className="character-list">
          <h2>شخصيات الحي</h2>
          {familyCharacters.map((item, index) => (
            <button
              key={item.id}
              className={characterIndex === index ? "active" : ""}
              onClick={() => {
                setCharacterIndex(index);
                setQuestionIndex(0);
                setFeedback("");
              }}
            >
              <span>{item.avatar}</span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.roleAr}</small>
              </div>
            </button>
          ))}
        </aside>

        <section className="conversation-panel">
          <div className="character-portrait">{character.avatar}</div>
          <span className="character-role">{character.roleAr}</span>
          <h2>{character.name}</h2>

          <div className="speech-card">
            <button onClick={() => speak(character.greeting)} aria-label="استمع للجملة">
              <Volume2 />
              <span>استمع</span>
            </button>
            <p>{character.greeting}</p>
            {showArabic && <small>{character.translation}</small>}
          </div>

          <div className="mission-card">
            <span>مهمتك الحالية</span>
            <h3>{question.prompt}</h3>
            {showArabic && <p>{question.translation}</p>}

            <div className="answer-grid">
              {question.answers.map((answer, index) => (
                <button key={answer} onClick={() => chooseAnswer(index)}>
                  {answer}
                </button>
              ))}
            </div>

            {feedback && (
              <div className="feedback">
                <CheckCircle2 size={19} />
                {feedback}
              </div>
            )}

            <button className="next-mission" onClick={nextQuestion}>
              المهمة التالية
            </button>
          </div>
        </section>

        <aside className="vocabulary-panel">
          <h2>مفردات العائلة</h2>
          {familyVocabulary.map(([fr, ar]) => (
            <button key={fr} onClick={() => speak(fr)}>
              <Volume2 size={17} />
              <div>
                <strong>{fr}</strong>
                {showArabic && <small>{ar}</small>}
              </div>
            </button>
          ))}
        </aside>
      </section>
    </main>
  );
}