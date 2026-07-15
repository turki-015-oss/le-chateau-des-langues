"use client";

import { ClipboardCheck, Volume2 } from "lucide-react";
import type { NpcProfile } from "@/engine/types";

type Props = {
  customer: NpcProfile;
  selectedItems: string[];
  correct: boolean;
  onSpeak: (text: string) => void;
};

export default function OrderTicket({ customer, selectedItems, correct, onSpeak }: Props) {
  return (
    <aside className={`order-ticket ${correct ? "ready" : ""}`}>
      <div className="ticket-top">
        <ClipboardCheck size={21} />
        <div>
          <span>Bon de commande</span>
          <strong>طلب {customer.name}</strong>
        </div>
      </div>
      <blockquote>{customer.requestFr}</blockquote>
      <button onClick={() => onSpeak(customer.requestFr)}>
        <Volume2 size={16} /> استمع مرة أخرى
      </button>
      <div className="ticket-status">
        <span>العناصر المختارة</span>
        <b>{selectedItems.length}</b>
      </div>
      <p>{correct ? "Commande correcte — جاهز للتقديم" : "اختر العناصر المطلوبة من القائمة"}</p>
    </aside>
  );
}
