"use client";

import { Target, UserRound, Volume2 } from "lucide-react";
import type { NpcProfile } from "@/engine/types";

type Props = {
  customer: NpcProfile;
  showArabic: boolean;
  onSpeak: (text: string) => void;
};

export default function CustomerMissionCard({
  customer,
  showArabic,
  onSpeak
}: Props) {
  return (
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
        <button onClick={() => onSpeak(customer.requestFr)}>
          <Volume2 size={17}/> استمع للزبون
        </button>
      </div>
    </section>
  );
}