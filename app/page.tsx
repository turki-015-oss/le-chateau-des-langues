"use client";

import { BookOpen, Castle, MapPin, MessageCircle, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const features = [
  { icon: BookOpen, text: "تعلّم الفرنسية" },
  { icon: MapPin, text: "جولة حول الأماكن" },
  { icon: Sparkles, text: "أساسيات اللغة عن طريق القلعة" },
  { icon: MessageCircle, text: "مفردات وجمل واختبارات" },
];

export default function EntryPage() {
  const router = useRouter();
  const [welcomeActive,setWelcomeActive]=useState(false);
  const [welcomeText,setWelcomeText]=useState("");
  const resetTimer=useRef<number|null>(null);
  const welcome="Bienvenue au Château des Langues. Apprenez le français, explorez les lieux et progressez à travers des mots, des phrases et des tests.";
  useEffect(()=>()=>{window.speechSynthesis?.cancel();if(resetTimer.current)window.clearTimeout(resetTimer.current)},[]);
  const speakWelcome=()=>{
    if(welcomeActive || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); setWelcomeActive(true); setWelcomeText("");
    window.dispatchEvent(new Event("lcdl:speech-start"));
    const u=new SpeechSynthesisUtterance(welcome);u.lang="fr-FR";u.rate=.88;
    const words=welcome.split(" "); let index=0;
    const reveal=()=>{index=Math.min(words.length,index+1);setWelcomeText(words.slice(0,index).join(" "));};
    const interval=window.setInterval(reveal,Math.max(180,(welcome.length/u.rate)/3));
    u.onboundary=(e)=>{if(e.name==="word"){const shown=welcome.slice(0,e.charIndex+e.charLength);setWelcomeText(shown)}};
    u.onend=()=>{window.clearInterval(interval);setWelcomeText(welcome);window.dispatchEvent(new Event("lcdl:speech-end"));resetTimer.current=window.setTimeout(()=>{setWelcomeActive(false);setWelcomeText("")},10000)};
    u.onerror=()=>{window.clearInterval(interval);window.dispatchEvent(new Event("lcdl:speech-end"));setWelcomeActive(false)};
    window.speechSynthesis.speak(u);
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
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="v69-feature-row">
              <Icon aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <button className="v69-primary" onClick={() => router.push("/kingdom")}>دخول العالم</button>
        <button className={`v69-secondary ${welcomeActive?"is-speaking":""}`} onClick={speakWelcome} disabled={welcomeActive}>
          {!welcomeActive&&<Volume2 aria-hidden="true" />}
          <span>{welcomeActive?(welcomeText||"Bienvenue…"):"استمع إلى الترحيب"}</span>
        </button>
      </section>
    </main>
  );
}
