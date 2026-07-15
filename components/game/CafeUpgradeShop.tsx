"use client";

import { CheckCircle2, Coins, LockKeyhole, ShoppingBag, Sparkles } from "lucide-react";

export type CafeUpgrade = {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  requiredLevel: number;
  effect: string;
};

type Props = {
  level: number;
  coins: number;
  ownedIds: string[];
  upgrades: CafeUpgrade[];
  onBuy: (upgrade: CafeUpgrade) => void;
};

export default function CafeUpgradeShop({ level, coins, ownedIds, upgrades, onBuy }: Props) {
  return (
    <section className="cafe-upgrade-shop">
      <div className="upgrade-shop-heading">
        <div>
          <span><ShoppingBag size={17}/> Boutique Royale</span>
          <h2>متجر تطوير المقهى</h2>
        </div>
        <b><Coins size={16}/> {coins}</b>
      </div>

      <p className="upgrade-shop-intro">استخدم عملاتك لتطوير المقهى والحصول على مكافآت أفضل أثناء خدمة الزبائن.</p>

      <div className="purchasable-upgrades">
        {upgrades.map((upgrade) => {
          const owned = ownedIds.includes(upgrade.id);
          const locked = level < upgrade.requiredLevel;
          const affordable = coins >= upgrade.price;
          return (
            <article key={upgrade.id} className={owned ? "owned" : locked ? "locked" : "available"}>
              <span className="upgrade-icon">{upgrade.icon}</span>
              <div className="upgrade-copy">
                <strong>{upgrade.title}</strong>
                <small>{upgrade.description}</small>
                <em><Sparkles size={13}/> {upgrade.effect}</em>
              </div>
              {owned ? (
                <div className="upgrade-owned"><CheckCircle2 size={18}/> مملوك</div>
              ) : locked ? (
                <div className="upgrade-locked"><LockKeyhole size={17}/> مستوى {upgrade.requiredLevel}</div>
              ) : (
                <button onClick={() => onBuy(upgrade)} disabled={!affordable}>
                  <Coins size={16}/> {upgrade.price}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
