"use client";

import { BookOpen, Castle, MapPin, MessageCircle, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {cancelFrenchSpeech,speakFrench} from "@/lib/frenchSpeech";

const features = [
  { icon: BookOpen, text: "تعلّم الفرنسية" },
  { icon: MapPin, text: "جولة حول الأماكن" },
  { icon: Sparkles, text: "أساسيات اللغة عن طريق القلعة" },
  { icon: MessageCircle, text: "مفردات وجمل واختبارات" },
];

const welcomeSentences = [
  "Bienvenue au Château des Langues.",
  "Apprenez le français, explorez les lieux",
  "et progressez à travers des mots, des phrases et des tests."
];
const welcome = welcomeSentences.join(" ");

export default function EntryPage() {
  const router = useRouter();
  const [welcomeActive, setWelcomeActive] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const resetTimer = useRef<number | null>(null);
  const fallbackTimers = useRef<number[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const clearTimers = () => {
    fallbackTimers.current.forEach((id) => window.clearTimeout(id));
    fallbackTimers.current = [];
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = null;
  };

  useEffect(() => () => {
    clearTimers();
    cancelFrenchSpeech();
    utteranceRef.current = null;
  }, []);

  const speakWelcome = () => {
    if (welcomeActive) return;
    clearTimers();
    cancelFrenchSpeech();
    setWelcomeActive(true);
    setWelcomeText(welcomeSentences[0]);

    const sentenceEnds = welcomeSentences.reduce<number[]>((ends, sentence, index) => {
      const previous = index === 0 ? 0 : ends[index - 1] + 1;
      ends.push(previous + sentence.length);
      return ends;
    }, []);

    let receivedBoundary = false;

    // Fallback for browsers that do not provide speech boundaries.
    [2400, 5200].forEach((delay, index) => {
      fallbackTimers.current.push(window.setTimeout(() => {
        if (!receivedBoundary) setWelcomeText(welcomeSentences.slice(0, index + 2).join(" "));
      }, delay));
    });

    void speakFrench(welcome,{
      rate:.88,
      onBoundary:(event)=>{
        receivedBoundary=true;
        const index=sentenceEnds.findIndex((end)=>event.charIndex<end);
        const safeIndex=index<0?welcomeSentences.length-1:index;
        setWelcomeText(welcomeSentences.slice(0,safeIndex+1).join(" "));
      },
      onEnd:()=>{
        fallbackTimers.current.forEach((id)=>window.clearTimeout(id));
        fallbackTimers.current=[];
        utteranceRef.current=null;
        setWelcomeText(welcome);
        resetTimer.current=window.setTimeout(()=>{
          setWelcomeActive(false);
          setWelcomeText("");
        },10000);
      },
      onError:()=>{
        clearTimers();
        utteranceRef.current=null;
        setWelcomeActive(false);
        setWelcomeText("");
      }
    }).then((utterance)=>{
      utteranceRef.current=utterance;
      if(!utterance){
        clearTimers();
        setWelcomeActive(false);
        setWelcomeText("");
      }
    });
  };

  return (
    <main className="v69-entry" aria-label="المدخل الرئيسي لتطبيق القلعة">
      <div className="v69-entry-bg" aria-hidden="true" />
      <div className="v69-glow v69-glow-one" aria-hidden="true" />
      <div className="v69-glow v69-glow-two" aria-hidden="true" />
      <div className="v69-sparkles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <i key={i} style={{ "--x": `${(i * 47) % 100}%`, "--y": `${(i * 31) % 100}%`, "--delay": `${i * -0.35}s`, "--duration": `${4 + (i % 5)}s` } as React.CSSProperties} />
        ))}
      </div>
      <section className="v69-entry-panel">
        <div className="v69-brand-mark" aria-hidden="true"><Castle /></div>
        <p className="v69-brand-fr">Le Château</p>
        <h1>القلعة</h1>
        <div className="v69-divider"><span /></div>
        <h2>Bienvenue</h2>
        <p className="v69-welcome-ar">مرحبًا بك</p>
        <p className="v69-description">تجربة فرنسية فاخرة للتعلّم والاستكشاف داخل عالم القلعة.</p>
        <div className="v69-feature-list">
          {features.map(({ icon: Icon, text }) => <div key={text} className="v69-feature-row"><Icon aria-hidden="true" /><span>{text}</span></div>)}
        </div>
        <button className="v69-primary" onClick={() => router.push("/kingdom")}>دخول العالم</button>
        <button className={`v69-secondary ${welcomeActive ? "is-speaking" : ""}`} onClick={speakWelcome} disabled={welcomeActive}>
          {!welcomeActive && <Volume2 aria-hidden="true" />}
          <span>{welcomeActive ? (welcomeText || "Bienvenue…") : "استمع إلى الترحيب"}</span>
        </button>
      </section>
    </main>
  );
}
