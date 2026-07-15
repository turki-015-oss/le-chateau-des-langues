"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Coffee,
  Coins,
  Medal,
  Star,
  Volume2,
  XCircle
} from "lucide-react";
import { cafeMenu, cafeReward, cafeScenes } from "@/data/cafe";

export default function CafePage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(30);
  const [showArabic, setShowArabic] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [order, setOrder] = useState<string[]>([]);

  const scene = cafeScenes[sceneIndex];
  const progress = useMemo(
    () => Math.round(((sceneIndex + 1) / cafeScenes.length) * 100),
    [sceneIndex]
  );

  useEffect(() => {
    setXp(Number(localStorage.getItem("chateau-cafe-xp") || "0"));
    setCoins(Number(localStorage.getItem("chateau-coins") || "30"));
    setCompleted(localStorage.getItem("chateau-cafe-completed") === "true");
  }, []);

  const speak = (text: string) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = 0.84;
    speechSynthesis.speak(u);
  };

  const tone = (success: boolean) => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(success ? 660 : 220, ctx.currentTime);
    osc.frequency.setValueAtTime(success ? 880 : 160, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  };

  const choose = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (scene.answers[index].correct) {
      setFeedback("correct");
      setScore((value) => value + 1);
      tone(true);
    } else {
      setFeedback("wrong");
      tone(false);
    }
  };

  const next = () => {
    if (selected === null) return;

    if (sceneIndex < cafeScenes.length - 1) {
      setSceneIndex((value) => value + 1);
      setSelected(null);
      setFeedback(null);
      return;
    }

    const nextXp = xp + cafeReward.xp;
    const nextCoins = coins + cafeReward.coins;
    setXp(nextXp);
    setCoins(nextCoins);
    setCompleted(true);

    localStorage.setItem("chateau-cafe-xp", String(nextXp));
    localStorage.setItem("chateau-coins", String(nextCoins));
    localStorage.setItem("chateau-cafe-completed", "true");
    localStorage.setItem("chateau-court-unlocked", "true");
  };

  const toggleOrder = (id: string) => {
    setOrder((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <main className="cafe-world">
      <header className="cafe-header">
        <Link href="/" className="back-link">
          <ArrowRight size={20} />
          المملكة
        </Link>

        <div className="cafe-progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="cafe-stats">
          <span><Star size={17} /> {xp} XP</span>
          <span><Coins size={17} /> {coins}</span>
        </div>
      </header>

      <section className="cafe-hero">
        <div className="cafe-hero-overlay" />
        <div className="cafe-copy">
          <span>A1 · Le Café</span>
          <h1>مقهى Luc</h1>
          <p>اطلب مشروبك، تحدث مع الزبائن، وادفع الحساب بالفرنسية.</p>
          <button onClick={() => setShowArabic((value) => !value)}>
            {showArabic ? "إخفاء الترجمة" : "إظهار الترجمة"}
          </button>
        </div>

        <div className="cafe-ambience">
          <Coffee size={56} />
          <strong>Ambiance du café</strong>
          <small>حوار، طلب، ومجاملة</small>
        </div>
      </section>

      <section className="cafe-layout">
        <aside className="cafe-menu-panel">
          <h2>La carte</h2>
          <p>اختر عناصر طلبك</p>

          <div className="cafe-menu-grid">
            {cafeMenu.map((item) => (
              <button
                key={item.id}
                className={order.includes(item.id) ? "selected" : ""}
                onClick={() => toggleOrder(item.id)}
              >
                <span>{item.emoji}</span>
                <strong>{item.fr}</strong>
                {showArabic && <small>{item.ar}</small>}
                <b>{item.price} 🪙</b>
              </button>
            ))}
          </div>
        </aside>

        <section className="cafe-dialogue-panel">
          <div className="cafe-character">
            <div className="cafe-avatar">
              {scene.speaker === "Luc" ? "🧑‍🍳" : scene.speaker === "Emma" ? "👩" : "👨"}
            </div>
            <span>{scene.speaker}</span>
          </div>

          <div className="cafe-speech">
            <button onClick={() => speak(scene.line)}>
              <Volume2 size={20} />
              صوت السؤال
            </button>
            <h2>{scene.line}</h2>
            {showArabic && <p>{scene.ar}</p>}
          </div>

          <div className="cafe-answers">
            {scene.answers.map((answer, index) => {
              const state =
                selected === null
                  ? ""
                  : answer.correct
                    ? "correct"
                    : selected === index
                      ? "wrong"
                      : "muted";

              return (
                <article key={answer.text} className={`cafe-answer ${state}`}>
                  <button
                    className="cafe-answer-main"
                    onClick={() => choose(index)}
                    disabled={selected !== null}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <div>
                      <strong>{answer.text}</strong>
                      {showArabic && <small>{answer.ar}</small>}
                    </div>
                  </button>

                  <button
                    className="cafe-answer-audio"
                    onClick={() => speak(answer.text)}
                  >
                    <Volume2 size={18} />
                  </button>
                </article>
              );
            })}
          </div>

          {feedback && (
            <div className={`cafe-feedback ${feedback}`}>
              {feedback === "correct" ? <CheckCircle2 /> : <XCircle />}
              <div>
                <strong>{feedback === "correct" ? "Très bien !" : "Essayons encore."}</strong>
                <span>
                  {feedback === "correct"
                    ? "إجابة صحيحة، تابع الحوار."
                    : "استمع إلى الجملة والخيارات ثم حاول مرة أخرى في السؤال التالي."}
                </span>
              </div>
            </div>
          )}

          <button
            className="cafe-next"
            onClick={next}
            disabled={selected === null}
          >
            {sceneIndex === cafeScenes.length - 1 ? "إنهاء الطلب" : "متابعة الحوار"}
          </button>
        </section>
      </section>

      {completed && (
        <section className="cafe-complete">
          <div className="cafe-medal">
            <Medal size={72} />
            <span>L</span>
          </div>
          <h2>{cafeReward.medal}</h2>
          <h3>{cafeReward.medalAr}</h3>
          <p>حصلت على {cafeReward.xp} XP و{cafeReward.coins} عملة.</p>
          <strong>النتيجة: {score} / {cafeScenes.length}</strong>
          <Link href="/">العودة إلى المملكة</Link>
        </section>
      )}
    </main>
  );
}