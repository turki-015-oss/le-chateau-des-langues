"use client";

import Link from "next/link";
import { ArrowRight, Volume2 } from "lucide-react";
import {speakFrench} from "@/lib/frenchSpeech";

const dialogues = ['Bienvenue dans la salle royale.', 'Votre parcours mérite notre respect.', 'Le château vous ouvre ses portes.'];

export default function Page() {
  const speak = (text: string) => {
    void speakFrench(text);
  };

  return (
    <main className="simple-world">
      <header className="simple-world-header">
        <Link href="/" className="back-link">
          <ArrowRight size={20} />
          المملكة
        </Link>
        <strong>Les Princes du Château</strong>
      </header>

      <section className="simple-world-hero">
        <span>Monde en développement</span>
        <h1>أمراء القلعة</h1>
        <p>Les Princes du Château</p>
      </section>

      <section className="simple-character-card">
        <div className="simple-character-avatar">👑</div>
        <span>Khalid</span>

        {dialogues.map((line) => (
          <div className="simple-dialogue" key={line}>
            <button onClick={() => speak(line)}>
              <Volume2 size={18} />
              استمع
            </button>
            <strong>{line}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}
