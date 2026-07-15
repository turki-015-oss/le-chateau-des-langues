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
  XCircle,
  UserRound,
  Crown,
  Target
} from "lucide-react";
import { cafeCustomers, cafeMenu, cafeReward, cafeScenes } from "@/data/cafe";
import { loadWorldProgress, saveWorldProgress } from "@/data/game-engine";
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
  const [showMissionMap, setShowMissionMap] = useState(true);
  const [streak, setStreak] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [entered, setEntered] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const [customerIndex, setCustomerIndex] = useState(0);
  const [serviceMessage, setServiceMessage] = useState("");

  const scene = cafeScenes[sceneIndex];
  const customer = cafeCustomers[customerIndex];

  useEffect(() => {
    setXp(Number(localStorage.getItem("chateau-cafe-xp") || "0"));
    setCoins(Number(localStorage.getItem("chateau-coins") || "30"));
    setCompleted(localStorage.getItem("chateau-cafe-completed") === "true");
    setInventory(loadInventory());
    setReputation(Number(localStorage.getItem("chateau-cafe-reputation") || "0"));
    const saved = loadWorldProgress("cafe");
    if (saved.chapter > 0 && saved.chapter < cafeScenes.length && !saved.completed) {
      setSceneIndex(saved.chapter);
    }
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

  const orderIsCorrect = useMemo(() => {
    const chosen = [...order].sort().join("|");
    const expected = [...customer.order].sort().join("|");
    return chosen === expected;
  }, [order, customer.order]);

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
      setStreak((value) => value + 1);
      setReputation((value) => Math.min(100, value + 8));
      playTone(true);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setReputation((value) => Math.max(0, value - 3));
      playTone(false);
    }
  };

  const next = () => {
    if (selected === null) return;

    if (sceneIndex < cafeScenes.length - 1) {
      setSceneIndex((value) => value + 1);
      setSelected(null);
      setFeedback(null);
      saveWorldProgress({
        worldId: "cafe",
        chapter: sceneIndex + 1,
        score,
        attempts: sceneIndex + 1,
        completed: false,
        lastPlayedAt: new Date().toISOString()
      });
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
    localStorage.setItem("chateau-cafe-reputation", String(Math.min(100, reputation + 15)));
    saveInventory(nextInventory);
    saveWorldProgress({
      worldId: "cafe",
      chapter: cafeScenes.length - 1,
      score,
      attempts: cafeScenes.length,
      completed: true,
      lastPlayedAt: new Date().toISOString()
    });
  };

  const restart = () => {
    setSceneIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setCompleted(false);
    setShowReceipt(false);
    setStreak(0);
    setShowMissionMap(true);
    setReputation(0);
    setEntered(false);
    saveWorldProgress({
      worldId: "cafe",
      chapter: 0,
      score: 0,
      attempts: 0,
      completed: false,
      lastPlayedAt: new Date().toISOString()
    });
  };

  const toggleOrder = (id: string) => {
    setServiceMessage("");
    setOrder((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const validateOrder = () => {
    if (orderIsCorrect) {
      setServiceMessage("Commande parfaite ! الطلب مطابق تمامًا.");
      setReputation((value) => Math.min(100, value + 10));
      playTone(true);
    } else {
      setServiceMessage(`Presque… ${customer.name} طلب: ${customer.orderLabelAr}`);
      setReputation((value) => Math.max(0, value - 2));
      playTone(false);
    }
  };

  return (
    <main className="cafe-pro-world">
      {!entered && (
        <section className="cafe-entry-screen">
          <div className="cafe-entry-lights" />
          <div className="cafe-door-frame">
            <div className="cafe-door-sign">Chez Luc</div>
            <div className="cafe-door-window">☕</div>
            <button onClick={() => { setEntered(true); setAmbientOn(true); setCustomerIndex(Math.floor(Math.random() * cafeCustomers.length)); }}>
              <span>ادخل المقهى</span>
              <small>Entrer dans le café</small>
            </button>
          </div>
          <div className="cafe-entry-copy">
            <span>MISSION ROYALE · 01</span>
            <h1>أول يوم لك في مقهى Luc</h1>
            <p>ادخل، تحدث بالفرنسية، كوّن طلبك، وارفع سمعتك داخل المملكة.</p>
            <div>
              <b>5</b><small>مواقف</small>
              <b>70</b><small>XP</small>
              <b>1</b><small>ميدالية</small>
            </div>
          </div>
        </section>
      )}
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
          <span className="streak-pill">🔥 {streak}</span>
          <span className="reputation-pill">👑 {reputation}%</span>
          <button title="الصوت" onClick={() => setSoundOn((value) => !value)}>
            {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button title="الحقيبة" onClick={() => setShowInventory(true)}>
            <PackageOpen size={19} />
          </button>
        </div>
      </header>

      <section className="cafe-pro-scene">
        <div className="cafe-pro-glow glow-one" />
        <div className="cafe-pro-glow glow-two" />

        <div className="cafe-pro-intro">
          <span><Sparkles size={17} /> A1 · Le Café</span>
          <div className={`ambient-status ${ambientOn ? "on" : ""}`}>
            <i /> {ambientOn ? "Ambiance active" : "Ambiance silencieuse"}
          </div>
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

      <section className="royal-mission-strip" aria-label="خريطة مهام المقهى">
        <div>
          <span>Royal Game Engine · v2.0</span>
          <h2>رحلة المقهى</h2>
        </div>
        <div className="mission-nodes">
          {[
            ["الدخول", "Saluer"],
            ["الطلب", "Commander"],
            ["الجلوس", "S'asseoir"],
            ["الحديث", "Discuter"],
            ["الدفع", "Payer"]
          ].map(([ar, fr], index) => (
            <button
              key={fr}
              className={index < sceneIndex ? "done" : index === sceneIndex ? "active" : ""}
              onClick={() => {
                if (index <= sceneIndex) {
                  setSceneIndex(index);
                  setSelected(null);
                  setFeedback(null);
                  setShowMissionMap(false);
                }
              }}
            >
              <b>{index < sceneIndex ? "✓" : index + 1}</b>
              <span>{ar}<small>{fr}</small></span>
            </button>
          ))}
        </div>
        <button className="mission-toggle" onClick={() => setShowMissionMap((value) => !value)}>
          {showMissionMap ? "إخفاء تفاصيل المهمة" : "عرض تفاصيل المهمة"}
        </button>
        {showMissionMap && (
          <div className="mission-brief">
            <strong>المهمة الحالية: {scene.speaker === "Luc" ? "التحدث مع Luc" : `التفاعل مع ${scene.speaker}`}</strong>
            <p>استمع إلى الجملة، اختر الرد الطبيعي، وحافظ على سلسلة إجابات صحيحة لرفع تقييمك.</p>
          </div>
        )}
      </section>

      <section className="reputation-board">
        <div><span>سمعة المقهى</span><b>{reputation}/100</b></div>
        <div className="reputation-track"><span style={{width: `${reputation}%`}} /></div>
        <small>الإجابات الطبيعية ترفع ثقة Luc بك وتزيد المكافآت.</small>
      </section>

      <section className="customer-mission-card">
        <div className="customer-avatar" aria-hidden="true">{customer.avatar}</div>
        <div className="customer-copy">
          <span><UserRound size={16}/> زبون اليوم</span>
          <h2>{customer.name} <small>{customer.personality}</small></h2>
          <blockquote>“{customer.requestFr}”</blockquote>
          {showArabic && <p>{customer.requestAr}</p>}
        </div>
        <div className="customer-objective">
          <Target size={22}/>
          <strong>جهّز الطلب الصحيح</strong>
          <span>{customer.orderLabelAr}</span>
          <button onClick={() => speak(customer.requestFr)}><Volume2 size={17}/> استمع للزبون</button>
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
            <button className="validate-order" onClick={validateOrder} disabled={!orderItems.length}>
              <CheckCircle2 size={17}/> تحقق من الطلب
            </button>
            {serviceMessage && <div className={`service-message ${orderIsCorrect ? "success" : "retry"}`}>{serviceMessage}</div>}
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
            disabled={selected === null || (sceneIndex === cafeScenes.length - 1 && !orderIsCorrect)}
          >
            {sceneIndex === cafeScenes.length - 1
              ? (orderIsCorrect ? "ادفع الحساب وأنهِ العالم" : "نفّذ طلب الزبون الصحيح أولًا")
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