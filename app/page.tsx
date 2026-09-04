"use client";

import { BookOpen, MapPin, MessageCircle, Sparkles, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {cancelFrenchSpeech,speakFrench} from "@/lib/frenchSpeech";
import styles from "./entry.module.css";
import WelcomeBook from "@/components/WelcomeBook";
import SlideToEnter from "@/components/SlideToEnter";

function RomanColumn() {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6h20M8 10h16M10 12v13m4-13v13m4-13v13m4-13v13M8 26h16M6 29h20M10 9C3 11 3 3 8 3h16c5 0 5 8-2 6" /></svg>;
}

const features = [
  { icon: BookOpen, text: "تعلّم الفرنسية" },
  { icon: MapPin, text: "جولة حول الأماكن" },
  { icon: RomanColumn, text: "أساسيات اللغة عن طريق القلعة" },
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
        setWelcomeActive(false);
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
    <main className={styles.entry} aria-label="المدخل الرئيسي لتطبيق القلعة" onCopy={event => event.preventDefault()} onContextMenu={event => event.preventDefault()}>
      <header className={styles.topbar}>
        <span className={styles.wordmark} lang="fr" dir="ltr">LE CHÂTEAU<span>DES LANGUES</span></span>
      </header>
      <div className={styles.experience}>
        <section className={styles.identity} aria-label="القلعة">
          <div className={styles.stage}>
            <WelcomeBook />
          </div>
          <p className={styles.brandFr} lang="fr" dir="ltr">Le Château</p>
          <p className={styles.brandAr}>القلعة</p>
          <span className={styles.brandRule} aria-hidden="true" />
        </section>
        <section className={styles.welcome} aria-labelledby="entry-welcome">
          <div className={styles.greeting}>
            <span className={styles.eyebrow}><Sparkles aria-hidden="true" /> رحلتك إلى الفرنسية</span>
            <h1 id="entry-welcome" lang="fr" dir="ltr">Bienvenue</h1>
            <h2>مرحبًا بك</h2>
            <p>تجربة فرنسية فاخرة للتعلّم والاستكشاف داخل عالم القلعة.</p>
          </div>
          <div className={styles.features}>
            {features.map(({ icon: Icon, text }) => <div key={text} className={styles.feature}><span><Icon aria-hidden="true" /></span><p>{text}</p></div>)}
          </div>
          <div className={styles.audio} data-active={welcomeActive}>
            <button type="button" className={styles.listen} onClick={() => {
              if (welcomeActive) {
                clearTimers(); cancelFrenchSpeech(); utteranceRef.current = null;
                setWelcomeActive(false); setWelcomeText("");
              } else speakWelcome();
            }} aria-label={welcomeActive ? "إيقاف الترحيب" : "استمع إلى الترحيب"}>
              {welcomeActive ? <Square aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
            </button>
            <div className={styles.audioCopy}>
              <strong>{welcomeActive ? "الترحيب بك" : "استمع إلى الترحيب"}</strong>
              <span lang="fr" dir="ltr">{welcomeActive ? "Bienvenue au Château" : "Écouter le message de bienvenue"}</span>
            </div>
            <div className={styles.wave} aria-hidden="true">{[0,1,2,3,4].map(i => <i key={i} style={{ animationDelay: `${i * .13}s` }} />)}</div>
          </div>
          <div className={styles.transcript} aria-live="polite" lang="fr" dir="ltr"><p>{welcomeText || "Bienvenue au Château des Langues."}</p></div>
          <SlideToEnter onEnter={() => router.push("/kingdom")} />
        </section>
      </div>
    </main>
  );
}
