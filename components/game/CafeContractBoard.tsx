"use client";

import { CheckCircle2, Coins, Gift, ScrollText, Sparkles, Star } from "lucide-react";

export type CafeContract = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardCoins: number;
  rewardXp: number;
};

type Props = {
  contracts: CafeContract[];
  claimedIds: string[];
  onClaim: (contract: CafeContract) => void;
};

export default function CafeContractBoard({ contracts, claimedIds, onClaim }: Props) {
  return (
    <section className="cafe-contract-board">
      <div className="contract-board-heading">
        <div>
          <span><ScrollText size={17}/> Contrats du Royaume</span>
          <h2>لوحة العقود الملكية</h2>
        </div>
        <Gift size={30}/>
      </div>

      <p className="contract-board-intro">
        أكمل مهام المقهى، ثم استلم مكافآتك. تقدم العقود يُحفظ تلقائيًا.
      </p>

      <div className="contract-grid">
        {contracts.map((contract) => {
          const claimed = claimedIds.includes(contract.id);
          const complete = contract.progress >= contract.target;
          const percent = Math.min(100, Math.round((contract.progress / contract.target) * 100));

          return (
            <article key={contract.id} className={claimed ? "claimed" : complete ? "complete" : "active"}>
              <div className="contract-title-row">
                <strong>{contract.title}</strong>
                {claimed ? <CheckCircle2 size={20}/> : <Sparkles size={20}/>} 
              </div>
              <p>{contract.description}</p>
              <div className="contract-progress-copy">
                <span>{Math.min(contract.progress, contract.target)} / {contract.target}</span>
                <b>{percent}%</b>
              </div>
              <div className="contract-progress-bar"><span style={{ width: `${percent}%` }} /></div>
              <div className="contract-reward-row">
                <span><Coins size={15}/> {contract.rewardCoins}</span>
                <span><Star size={15}/> {contract.rewardXp} XP</span>
                <button disabled={!complete || claimed} onClick={() => onClaim(contract)}>
                  {claimed ? "تم الاستلام" : complete ? "استلم المكافأة" : "قيد التنفيذ"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
