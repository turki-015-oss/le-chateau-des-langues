"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Coffee,
  Coins,
  KeyRound,
  Medal,
  PackageOpen,
  ReceiptText,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  X,
  XCircle
} from "lucide-react";
import { cafeMenu, cafeReward, cafeScenes } from "@/data/cafe";
import {
  defaultInventory,
  loadInventory,
  saveInventory,
  type InventoryState
} from "@/data/inventory";

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
  const [soundOn, setSoundOn] = useState(true);
  const [showInventory, setShowInventory] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [inventory, setInventory] = useState<InventoryState>(defaultInventory);
  const [typedLength, setTypedLength] = useState(0);

  const scene = cafeScenes[sceneIndex];

  useEffect(() => {
    setXp(Number(localStorage.getItem("chateau-cafe-xp") || "0"));
    setCoins(Number(localStorage.getItem("chateau-coins") || "30"));
    setCompleted(localStorage.getItem("chateau-cafe-completed") === "true");
    setInventory(loadInventory());
  }, []);

  useEffect(() => {
    setTypedLength(0);
    const timer = window.setInterval(() => {
      setTypedLength((value) => {
        if (value >= scene.line.length) {
          window.clearInterval(timer);
          return value;
        }
        return value + 1;
      });
    }, 24);

    return () => window.clearInterval(timer);
  }, [sceneIndex, scene.line]);

  const progress = useMemo(
    () => Math.round(((sceneIndex + 1) / cafeScenes.length) * 100),
    [sceneIndex]
  );

  const orderItems = useMemo(
    () => cafeMenu.filter((item) => order.includes(item.id)),
    [order]
  );

  const orderTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price, 0),
    [orderItems]
  );

  const stars = useMemo(() => {
    const percentage = score / cafeScenes.length;
    if (percentage >= 0.9) return 3;
    if (percentage >= 0.6) return 2;
    return 1;
  }, [score]);

  const speak = (text: string) => {
    if (!soundOn) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.82;
    speechSynthesis.speak(utterance);
  };

  const playTone = (success: boolean) => {
    if (!soundOn) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.type = success ? "sine" : "square";
    oscillator.frequency.setValueAtTime(
      success ? 620 : 210,
      context.currentTime
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      success ? 930 : 145,
      context.currentTime + 0.22
    );

    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.38
    );

    oscillator.start();
    oscillator.stop(context.currentTime + 0.38);
  };

  const choose = (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    if (scene.answers[index].correct) {
      setFeedback("correct");
      setScore((value) => value + 1);
      playTone(true);
    } else {
      setFeedback("wrong");
      playTone(false);
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
    const vocabulary = Array.from(
      new Set([
        ...inventory.vocabulary,
        "un café",
        "un croissant",
        "s'il vous plaît",
        "l'addition",
        "une chaise libre"
      ])
    );

    const nextInventory: InventoryState = {
      medals: Array.from(
        new Set([...inventory.medals, cafeReward.medal])
      ),
      certificates: Array.from(
        new Set([...inventory.certificates, "Certificat du Café"])
      ),
      keys: Array.from(
        new Set([...inventory.keys, "Clé du Tribunal"])
      ),
      vocabulary,
      stars: Math.max(inventory.stars, stars)
    };

    setXp(nextXp);
    setCoins(nextCoins);
    setInventory(nextInventory);
    setCompleted(true);
    setShowReceipt(true);

    localStorage.setItem("chateau-cafe-xp", String(nextXp));
    localStorage.setItem("chateau-coins", String(nextCoins));
    localStorage.setItem("chateau-cafe-completed", "true");
    localStorage.setItem("chateau-court-unlocked", "true");
    saveInventory(nextInventory);
  };

  const restart = () => {
    setSceneIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setCompleted(false);
    setShowReceipt(false);
  };

  const toggleOrder = (id: string) => {
    setOrder((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <main className="cafe-pro-world">
      <header className="cafe-pro-header">
        <Link href="/" className="back-link">
          <ArrowRight size={20} />
          المملكة
        </Link>

        <div className="cafe-pro-progress-wrap">
          <div>
            <span>تقدم الحوار</span>
            <b>{progress}%</b>
          </div>
          <div className="cafe-pro-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="cafe-pro-hud">
          <span><Star size={17} /> {xp} XP</span>
          <span><Coins size={17} /> {coins}</span>
          <button onClick={() => setSoundOn((value) => !value)}>
            {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button onClick={() => setShowInventory(true)}>
            <PackageOpen size={19} />
          </button>
        </div>
      </header>

      <section className="cafe-pro-scene">
        <div className="cafe-pro-glow glow-one" />
        <div className="cafe-pro-glow glow-two" />

        <div className="cafe-pro-intro">
          <span><Sparkles size={17} /> A1 · Le Café</span>
          <h1>Chez Luc</h1>
          <p>مقهى فرنسي صغير داخل المملكة، حيث تتعلم الطلب والمجاملة والدفع من خلال الحوار.</p>
          <div className="cafe-pro-actions">
            <button onClick={() => setShowArabic((value) => !value)}>
              {showArabic ? "إخفاء الترجمة" : "إظهار الترجمة"}
            </button>
            <button onClick={() => setShowReceipt(true)}>
              <ReceiptText size={18} />
              الإيصال
            </button>
          </div>
        </div>

        <div className="luc-stage">
          <div className="luc-aura" />
          <div className="luc-character">
            <div className="luc-head">🧑‍🍳</div>
            <div className="luc-body">
              <span className="luc-arm left-arm" />
              <span className="luc-arm right-arm" />
              <span className="luc-apron">L</span>
            </div>
          </div>
          <div className="luc-nameplate">
            <strong>Luc</strong>
            <small>Le serveur du café</small>
          </div>
        </div>

        <div className="cafe-counter">
          <span>☕</span><span>🥐</span><span>🫖</span><span>🍊</span>
        </div>
      </section>

      <section className="cafe-pro-game">
        <aside className="cafe-pro-menu">
          <div className="panel-heading">
            <div>
              <span>La carte</span>
              <h2>قائمة المقهى</h2>
            </div>
            <b>{orderTotal} 🪙</b>
          </div>

          <div className="cafe-pro-menu-grid">
            {cafeMenu.map((item) => (
              <button
                key={item.id}
                className={order.includes(item.id) ? "selected" : ""}
                onClick={() => toggleOrder(item.id)}
              >
                <span>{item.emoji}</span>
                <div>
                  <strong>{item.fr}</strong>
                  {showArabic && <small>{item.ar}</small>}
                </div>
                <b>{item.price}</b>
              </button>
            ))}
          </div>

          <div className="order-summary">
            <strong>طلبك الحالي</strong>
            <p>
              {orderItems.length
                ? orderItems.map((item) => item.fr).join(" · ")
                : "لم تختر شيئًا بعد"}
            </p>
          </div>
        </aside>

        <section className="cafe-pro-dialogue">
          <div className="dialogue-stage">
            <div className="speaker-badge">
              <span>{scene.speaker === "Luc" ? "🧑‍🍳" : scene.speaker === "Emma" ? "👩" : "👨"}</span>
              <div>
                <strong>{scene.speaker}</strong>
                <small>Conversation {sceneIndex + 1}/{cafeScenes.length}</small>
              </div>
            </div>

            <button className="listen-line" onClick={() => speak(scene.line)}>
              <Volume2 size={19} />
              استمع
            </button>

            <div className="speech-bubble">
              <h2>{scene.line.slice(0, typedLength)}</h2>
              {showArabic && <p>{scene.ar}</p>}
            </div>
          </div>

          <div className="cafe-pro-answers">
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
                <article key={answer.text} className={`cafe-pro-answer ${state}`}>
                  <button
                    className="answer-choice"
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
                    className="answer-audio"
                    onClick={() => speak(answer.text)}
                  >
                    <Volume2 size={18} />
                  </button>
                </article>
              );
            })}
          </div>

          {feedback && (
            <div className={`cafe-pro-feedback ${feedback}`}>
              {feedback === "correct" ? <CheckCircle2 /> : <XCircle />}
              <div>
                <strong>{feedback === "correct" ? "Très bien !" : "Pas encore."}</strong>
                <span>
                  {feedback === "correct"
                    ? "اختيار ممتاز، استمر في المحادثة."
                    : "الاختيار غير مناسب للموقف. استمع إلى الجمل وقارن المعنى."}
                </span>
              </div>
            </div>
          )}

          <button
            className="cafe-pro-next"
            onClick={next}
            disabled={selected === null}
          >
            {sceneIndex === cafeScenes.length - 1
              ? "ادفع الحساب وأنهِ العالم"
              : "تابع الحوار"}
          </button>
        </section>
      </section>

      {showInventory && (
        <div className="inventory-overlay">
          <section className="inventory-panel">
            <button className="close-panel" onClick={() => setShowInventory(false)}>
              <X size={22} />
            </button>
            <PackageOpen size={43} />
            <h2>حقيبة الرحلة</h2>

            <div className="inventory-grid">
              <article>
                <Medal />
                <strong>الميداليات</strong>
                <span>{inventory.medals.length}</span>
              </article>
              <article>
                <Star />
                <strong>النجوم</strong>
                <span>{inventory.stars}</span>
              </article>
              <article>
                <KeyRound />
                <strong>المفاتيح</strong>
                <span>{inventory.keys.length}</span>
              </article>
              <article>
                <BookOpen />
                <strong>الكلمات</strong>
                <span>{inventory.vocabulary.length}</span>
              </article>
            </div>

            <div className="inventory-list">
              <strong>آخر الكلمات المحفوظة</strong>
              <p>{inventory.vocabulary.slice(-5).join(" · ") || "لا توجد كلمات محفوظة بعد"}</p>
            </div>
          </section>
        </div>
      )}

      {showReceipt && (
        <div className="receipt-overlay">
          <section className="receipt-card">
            <button className="close-panel" onClick={() => setShowReceipt(false)}>
              <X size={22} />
            </button>
            <ReceiptText size={45} />
            <h2>Reçu du Café</h2>
            <p>إيصال مقهى Luc</p>

            <div className="receipt-lines">
              {orderItems.length ? (
                orderItems.map((item) => (
                  <div key={item.id}>
                    <span>{item.fr}</span>
                    <b>{item.price} 🪙</b>
                  </div>
                ))
              ) : (
                <div><span>Aucune commande</span><b>0 🪙</b></div>
              )}
            </div>

            <div className="receipt-total">
              <span>Total</span>
              <b>{orderTotal} 🪙</b>
            </div>
          </section>
        </div>
      )}

      {completed && (
        <section className="cafe-pro-complete">
          <div className="celebration-sparkles">
            <span>✦</span><span>✧</span><span>✦</span><span>✧</span>
          </div>

          <div className="cafe-pro-medal">
            <Medal size={86} />
            <span>L</span>
          </div>

          <h2>{cafeReward.medal}</h2>
          <h3>{cafeReward.medalAr}</h3>
          <p>أصبحت زبونًا دائمًا في مقهى Luc.</p>

          <div className="completion-stars">
            {[1, 2, 3].map((value) => (
              <Star key={value} className={value <= stars ? "earned" : ""} />
            ))}
          </div>

          <div className="completion-rewards">
            <span>+{cafeReward.xp} XP</span>
            <span>+{cafeReward.coins} Coins</span>
            <span>🔑 Clé du Tribunal</span>
          </div>

          <div className="completion-actions">
            <button onClick={restart}>
              <RotateCcw size={18} />
              إعادة اللعب
            </button>
            <Link href="/">العودة إلى المملكة</Link>
          </div>
        </section>
      )}
    </main>
  );
}