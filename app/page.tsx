"use client";

import { BookOpen, MapPin, MessageCircle, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

const welcomePhrase = "Bienvenue au Château des Langues";

const arrivalSoundSources = [
  "/audio/cinematic-entry/descending-whoosh.wav",
  "/audio/cinematic-entry/heavy-boulder-thud.wav",
  "/audio/cinematic-entry/leaves-rustle.wav",
  "/audio/cinematic-entry/page-turn.wav",
  "/audio/cinematic-entry/birds-taking-off.mp3",
];

type ArrivalAudioRuntime = { context: AudioContext; buffers: AudioBuffer[]; ready: Promise<void> };
type ArrivalAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
  __castleArrivalAudioRuntime?: ArrivalAudioRuntime;
};

export default function EntryPage() {
  const router = useRouter();
  const arrivalAudioRuntimeRef = useRef<ArrivalAudioRuntime | null>(null);
  const isEnteringRef = useRef(false);

  const prepareArrivalAudio = () => {
    if (arrivalAudioRuntimeRef.current) return arrivalAudioRuntimeRef.current;
    const AudioContextConstructor = window.AudioContext ?? (window as ArrivalAudioWindow).webkitAudioContext;
    if (!AudioContextConstructor) return null;
    const runtime: ArrivalAudioRuntime = {
      context: new AudioContextConstructor(),
      buffers: [],
      ready: Promise.resolve(),
    };
    arrivalAudioRuntimeRef.current = runtime;
    runtime.ready = Promise.all(arrivalSoundSources.map(async (source) => {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`Unable to preload arrival sound: ${source}`);
      return runtime.context.decodeAudioData(await response.arrayBuffer());
    })).then((buffers) => {
      runtime.buffers = buffers;
    }).catch(() => {
      runtime.buffers = [];
    });
    return runtime;
  };

  useEffect(() => {
    const runtime = prepareArrivalAudio();
    if (!runtime) return;

    return () => {
      if (isEnteringRef.current) return;
      void runtime.context.close().catch(() => { /* The context may already be closed. */ });
    };
  }, []);

  const enterKingdom = () => {
    if (isEnteringRef.current) return;
    isEnteringRef.current = true;

    // Resume Web Audio inside the swipe gesture. Unlike media-element priming,
    // this is silent on iOS and still permits precise audible cues after routing.
    const runtime = arrivalAudioRuntimeRef.current ?? prepareArrivalAudio();
    if (runtime) {
      // A one-sample silent Web Audio source unlocks the context during the
      // user's gesture without leaking any of the real cinematic sounds.
      const unlockSource = runtime.context.createBufferSource();
      unlockSource.buffer = runtime.context.createBuffer(1, 1, 22050);
      unlockSource.connect(runtime.context.destination);
      unlockSource.start();
      // Safari can leave resume() pending even though the gesture was accepted.
      // Never let that browser promise block navigation.
      void runtime.context.resume().catch(() => { /* The kingdom retries the primed context. */ });
      if (runtime.context.state !== "closed") {
        (window as ArrivalAudioWindow).__castleArrivalAudioRuntime = runtime;
      }
    }
    try { sessionStorage.setItem("castle-kingdom-arrival", "1"); } catch { /* Navigation still works when storage is restricted. */ }
    document.documentElement.classList.add("kingdom-arrival-loading");
    router.push("/kingdom");
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
          <div className={styles.welcomeWave} lang="fr" dir="ltr" aria-label={welcomePhrase}>
            {Array.from(welcomePhrase).map((letter,index)=><span key={`${letter}-${index}`} aria-hidden="true" style={{"--letter-index":index} as CSSProperties}>{letter===" "?"\u00a0":letter}</span>)}
          </div>
          <SlideToEnter onEnter={enterKingdom} />
        </section>
      </div>
    </main>
  );
}
