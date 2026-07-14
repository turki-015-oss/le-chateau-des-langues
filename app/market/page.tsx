"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Coins, LockOpen, ShoppingBasket, Star, Volume2 } from "lucide-react";
import { marketDialogues, marketItems } from "@/data/market";

type Cart = Record<string, number>;

export default function MarketPage() {
  const [cart, setCart] = useState<Cart>({});
  const [step, setStep] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(30);
  const [showArabic, setShowArabic] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setXp(Number(localStorage.getItem("chateau-market-xp") || "0"));
    setCoins(Number(localStorage.getItem("chateau-coins") || "30"));
    setCompleted(localStorage.getItem("chateau-market-completed") === "true");
  }, []);

  const total = useMemo(
    () => marketItems.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0),
    [cart]
  );

  const itemCount = useMemo(
    () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
    [cart]
  );

  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "fr-FR";
    speech.rate = 0.82;
    speechSynthesis.speak(speech);
  };

  const addItem = (id: string) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
  };

  const removeItem = (id: string) => {
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) - 1) }));
  };

  const buy = () => {
    if (itemCount < 2) {
      setNotice("اختر منتجين على الأقل لإكمال المهمة.");
      return;
    }
    if (coins < total) {
      setNotice("العملات غير كافية.");
      return;
    }

    const nextCoins = coins - total + 10;
    const nextXp = xp + 40;
    setCoins(nextCoins);
    setXp(nextXp);
    setCompleted(true);
    setNotice("Très bien ! اكتملت مهمة السوق.");

    localStorage.setItem("chateau-coins", String(nextCoins));
    localStorage.setItem("chateau-market-xp", String(nextXp));
    localStorage.setItem("chateau-market-completed", "true");
    localStorage.setItem("chateau-cafe-unlocked", "true");
  };

  const dialogue = marketDialogues[step];

  return (
    <main className="market-world">
      <header className="market-header">
        <Link href="/" className="back-link"><ArrowRight size={20} /> المملكة</Link>
        <div className="market-stats">
          <span><Star size={17} /> {xp} XP</span>
          <span><Coins size={17} /> {coins}</span>
          <span><ShoppingBasket size={17} /> {itemCount}</span>
        </div>
      </header>

      <section className="market-hero">
        <div className="market-overlay" />
        <div className="market-copy">
          <span>A1 · Le Grand Marché</span>
          <h1>السوق الكبير</h1>
          <p>تحدث مع Hassan واشترِ احتياجاتك بالفرنسية.</p>
          <button onClick={() => setShowArabic((value) => !value)}>
            {showArabic ? "إخفاء الترجمة" : "إظهار الترجمة"}
          </button>
        </div>
      </section>

      <section className="market-layout">
        <aside className="hassan-panel">
          <div className="hassan-avatar">🧺</div>
          <span>Hassan</span>
          <h2>Le marchand</h2>
          <div className="market-dialogue">
            <button onClick={() => speak(dialogue.fr)}><Volume2 size={20} /> استمع</button>
            <strong>{dialogue.fr}</strong>
            {showArabic && <small>{dialogue.ar}</small>}
          </div>
          <div className="dialogue-controls">
            <button onClick={() => setStep((value) => Math.max(0, value - 1))}>السابق</button>
            <button onClick={() => setStep((value) => (value + 1) % marketDialogues.length)}>التالي</button>
          </div>
        </aside>

        <section className="market-products">
          <div className="market-section-title">
            <div><span>Votre mission</span><h2>اختر منتجين على الأقل</h2></div>
            <strong>{total} 🪙</strong>
          </div>

          <div className="product-grid">
            {marketItems.map((item) => (
              <article key={item.id} className="product-card">
                <div className="product-emoji">{item.emoji}</div>
                <h3>{item.fr}</h3>
                {showArabic && <p>{item.ar}</p>}
                <small>{item.price} pièces · {item.unit}</small>
                <button className="product-speak" onClick={() => speak(item.fr)}><Volume2 size={17} /></button>
                <div className="quantity-control">
                  <button onClick={() => removeItem(item.id)}>-</button>
                  <b>{cart[item.id] || 0}</b>
                  <button onClick={() => addItem(item.id)}>+</button>
                </div>
              </article>
            ))}
          </div>

          <button className="market-buy" onClick={buy}>Acheter maintenant</button>
          {notice && <div className="market-notice">{notice}</div>}
          {completed && (
            <div className="market-complete">
              <CheckCircle2 size={24} />
              <div><strong>Le marché est terminé</strong><span>حصلت على 40 XP و10 عملات، وفُتحت بوابة المقهى.</span></div>
              <LockOpen size={22} />
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
