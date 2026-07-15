"use client";

import { History, Volume2 } from "lucide-react";

export type ConversationEntry = {
  speaker: string;
  text: string;
  ar?: string;
  correct?: boolean;
};

type Props = {
  entries: ConversationEntry[];
  onSpeak: (text: string) => void;
};

export default function ConversationHistory({ entries, onSpeak }: Props) {
  return (
    <section className="conversation-history">
      <div className="conversation-history-heading">
        <History size={20} />
        <div><span>Historique</span><h2>سجل المحادثة</h2></div>
        <b>{entries.length}</b>
      </div>
      <div className="conversation-history-list">
        {entries.length === 0 ? (
          <p>سيظهر هنا ما قيل داخل المقهى.</p>
        ) : entries.slice(-8).map((entry, index) => (
          <article key={`${entry.speaker}-${index}`} className={entry.correct === false ? "mistake" : ""}>
            <div><strong>{entry.speaker}</strong><span>{entry.text}</span>{entry.ar && <small>{entry.ar}</small>}</div>
            <button onClick={() => onSpeak(entry.text)} aria-label="استمع"><Volume2 size={17}/></button>
          </article>
        ))}
      </div>
    </section>
  );
}
