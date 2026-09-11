"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Coffee,
  Hotel,
  Landmark,
  Plane,
  Scale,
  ShoppingBasket,
  Sparkles,
  Train,
  Trees,
  Trophy,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import "./concept.css";
import SmartCompass from "./SmartCompass";

type ConceptDestination = {
  id: string;
  fr: string;
  ar: string;
  description: string;
  image: string;
  path: string;
  icon: React.ReactNode;
};

type MagicalEntry = Pick<ConceptDestination, "id" | "fr" | "ar" | "image" | "path"> & { originX: number; originY: number };
type ArrivalAudioRuntime = { context: AudioContext; buffers: AudioBuffer[]; ready: Promise<void> };
type ArrivalAudioWindow = Window & { __castleArrivalAudioRuntime?: ArrivalAudioRuntime };

const arrivalSoundCues = [
  // These cues mirror the 3.35s CSS arrival timeline: descent begins at 43%,
  // impact lands at 58%, then the garden and book react to the collision.
  { source: "/audio/cinematic-entry/descending-whoosh.wav", delay: 1400, volume: 0.42, playbackRate: 1.08, offset: 1.25, duration: 0.52 },
  { source: "/audio/cinematic-entry/heavy-boulder-thud.wav", delay: 1940, volume: 0.92, playbackRate: 1, offset: 0.28, duration: 0.55 },
  { source: "/audio/cinematic-entry/leaves-rustle.wav", delay: 1960, volume: 0.38, playbackRate: 1.05, offset: 0.85, duration: 0.8 },
  { source: "/audio/cinematic-entry/page-turn.wav", delay: 1940, volume: 0.72, playbackRate: 0.94, offset: 0.04, duration: 0.27 },
  { source: "/audio/cinematic-entry/birds-taking-off.mp3", delay: 1945, volume: 0.82, playbackRate: 1, offset: 0, duration: 2.2 },
];

function CastleAppIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M7 39V20l5-5 5 5v5h5V13l6-7 6 7v12h5v-5l5-5 5 5v19H7Z" fill="currentColor" opacity=".94" />
      <path d="M10 15 12 8l2 7M26 9l2-6 2 6M42 15l2-7 2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 39h38M17 25h14v14H17z" stroke="#fff1b2" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M21 39V30.5a3 3 0 0 1 6 0V39" fill="#082e24" stroke="#fff1b2" strokeWidth="1.4" />
      <path d="M10 23h4m20 0h4M25 17h6" stroke="#082e24" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const destinations: ConceptDestination[] = [
  { id: "hospital", fr: "HÔPITAL", ar: "المستشفى", path: "/hospital", image: "/kingdom-portal-assets/destination-hospital.png", description: "الصحة والمواعيد وطلب المساعدة", icon: <Building2 /> },
  { id: "airport", fr: "AÉROPORT", ar: "المطار", path: "/airport", image: "/kingdom-portal-assets/destination-airport.png", description: "السفر والجوازات والرحلات", icon: <Plane /> },
  { id: "station", fr: "GARE", ar: "محطة القطار", path: "/station", image: "/kingdom-portal-assets/destination-station.png", description: "التذاكر والمواعيد والوجهات", icon: <Train /> },
  { id: "market", fr: "MARCHÉ", ar: "السوق الكبير", path: "/market", image: "/kingdom-portal-assets/destination-market.png", description: "المنتجات والمفردات والمحادثات", icon: <ShoppingBasket /> },
  { id: "cafe", fr: "CAFÉ", ar: "المقهى", path: "/cafe", image: "/kingdom-portal-assets/destination-cafe-v2.webp", description: "التحية والجلوس والطلب", icon: <Coffee /> },
  { id: "restaurant", fr: "RESTAURANT", ar: "المطعم", path: "/restaurant", image: "/kingdom-portal-assets/destination-restaurant-v2.webp", description: "الحجز والقائمة والمحادثة", icon: <Utensils /> },
  { id: "police", fr: "COMMISSARIAT", ar: "مركز الشرطة", path: "/police", image: "/kingdom-portal-assets/destination-police-v2.webp", description: "المساعدة والمواقف الأمنية", icon: <Landmark /> },
  { id: "zoo", fr: "ZOO", ar: "حديقة الحيوانات", path: "/zoo", image: "/kingdom-portal-assets/destination-zoo-v2.webp", description: "الحيوانات والطبيعة والاستكشاف", icon: <Trees /> },
  { id: "hotel", fr: "HÔTEL", ar: "الفندق", path: "/hotel", image: "/kingdom-portal-assets/destination-hotel-v2.webp", description: "الحجز والاستقبال والإقامة", icon: <Hotel /> },
  { id: "stadium", fr: "STADE", ar: "الملعب", path: "/stadium", image: "/kingdom-portal-assets/destination-stadium-v2.webp", description: "الرياضة والمباريات والجمهور", icon: <Trophy /> },
  { id: "cinema", fr: "CINÉMA", ar: "صالة السينما", path: "/cinema", image: "/kingdom-portal-assets/destination-cinema-v2.webp", description: "الأفلام والعروض والحوار الثقافي", icon: <Clapperboard /> },
  { id: "court", fr: "TRIBUNAL", ar: "المحكمة", path: "/court", image: "/maps/facades/civic-facade.webp", description: "القضايا والشهادة واللغة الرسمية", icon: <Scale /> },
];

function TiltCard({ item, index, onEnter }: { item: ConceptDestination; index: number; onEnter: (item: ConceptDestination, element: HTMLElement) => void }) {

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    element.style.setProperty("--rotate-x", `${(0.5 - y) * 10}deg`);
    element.style.setProperty("--rotate-y", `${(x - 0.5) * 12}deg`);
    element.style.setProperty("--light-x", `${x * 100}%`);
    element.style.setProperty("--light-y", `${y * 100}%`);
  };

  const resetTilt = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--rotate-x", "0deg");
    event.currentTarget.style.setProperty("--rotate-y", "0deg");
    event.currentTarget.style.setProperty("--light-x", "50%");
    event.currentTarget.style.setProperty("--light-y", "20%");
  };

  return (
    <button
      type="button"
      className="concept-tilt-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      onClick={(event) => onEnter(item, event.currentTarget)}
      aria-label={`${item.fr} — ${item.ar}`}
    >
      <span className="concept-card-depth" aria-hidden="true" />
      <span className="concept-card-surface">
        <span className="concept-card-light" aria-hidden="true" />
        <span className="concept-card-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="concept-card-icon">{item.icon}</span>
        <span className="concept-card-image-wrap">
          <img src={item.image} alt="" className="concept-card-image" />
        </span>
        <span className="concept-card-copy">
          <small>DESTINATION</small>
          <strong dir="ltr">{item.fr}</strong>
          <b>{item.ar}</b>
          <em>{item.description}</em>
        </span>
      </span>
    </button>
  );
}

export default function KingdomConceptPage() {
  const router = useRouter();
  const destinationRailRef = useRef<HTMLDivElement>(null);
  const entryTimerRef = useRef<number | null>(null);
  const arrivalTimerRef = useRef<number | null>(null);
  const arrivalPreparationTimerRef = useRef<number | null>(null);
  const arrivalAnimationFrameRef = useRef<number | null>(null);
  const arrivalAudioRuntimeRef = useRef<ArrivalAudioRuntime | null>(null);
  const arrivalAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const arrivalTimelineStartedRef = useRef(false);
  const [magicalEntry, setMagicalEntry] = useState<MagicalEntry | null>(null);
  const [arrivalPlaying, setArrivalPlaying] = useState(false);

  useEffect(() => {
    ["/castle", "/university", "/library", ...destinations.map(({ path }) => path)].forEach((path) => router.prefetch(path));
    let disposed = false;
    let arrivalRequested = false;
    try {
      arrivalRequested = sessionStorage.getItem("castle-kingdom-arrival") === "1";
      sessionStorage.removeItem("castle-kingdom-arrival");
    } catch { /* Direct visits remain available when storage is restricted. */ }
    if (arrivalRequested) {
      arrivalTimelineStartedRef.current = false;
      const runtime = (window as ArrivalAudioWindow).__castleArrivalAudioRuntime ?? null;
      arrivalAudioRuntimeRef.current = runtime;
      let arrivalStarted = false;
      const beginArrival = () => {
        if (arrivalStarted || disposed) return;
        arrivalStarted = true;
        if (arrivalPreparationTimerRef.current !== null) window.clearTimeout(arrivalPreparationTimerRef.current);
        document.documentElement.classList.remove("kingdom-arrival-loading");
        setArrivalPlaying(true);
        document.documentElement.classList.add("kingdom-arrival-pending");
      };
      if (runtime && runtime.buffers.length < arrivalSoundCues.length) {
        void runtime.ready.then(beginArrival);
        arrivalPreparationTimerRef.current = window.setTimeout(beginArrival, 5000);
      } else {
        beginArrival();
      }
    } else {
      document.documentElement.classList.remove("kingdom-arrival-loading");
      document.documentElement.classList.remove("kingdom-arrival-pending");
    }
    return () => {
      disposed = true;
      if (entryTimerRef.current !== null) window.clearTimeout(entryTimerRef.current);
      if (arrivalTimerRef.current !== null) window.clearTimeout(arrivalTimerRef.current);
      if (arrivalPreparationTimerRef.current !== null) window.clearTimeout(arrivalPreparationTimerRef.current);
      if (arrivalAnimationFrameRef.current !== null) window.cancelAnimationFrame(arrivalAnimationFrameRef.current);
      arrivalAudioSourcesRef.current.forEach((source) => {
        try { source.stop(); } catch { /* A finished source is already stopped. */ }
      });
      const runtime = arrivalAudioRuntimeRef.current;
      if (runtime && runtime.context.state !== "closed") {
        void runtime.context.close().catch(() => { /* The context may already be closed. */ });
      }
      document.documentElement.classList.remove("kingdom-arrival-pending");
      document.documentElement.classList.remove("kingdom-arrival-loading");
    };
  }, [router]);

  const startArrivalTimeline = (castleAnimation: Animation) => {
    if (arrivalTimelineStartedRef.current) return;
    arrivalTimelineStartedRef.current = true;
    const playedCues = new Set<number>();
    const finishArrival = () => {
      setArrivalPlaying(false);
      document.documentElement.classList.remove("kingdom-arrival-pending");
      arrivalAudioSourcesRef.current.forEach((source) => {
        try { source.stop(); } catch { /* A finished source is already stopped. */ }
      });
      arrivalAudioSourcesRef.current = [];
      const runtime = arrivalAudioRuntimeRef.current;
      if (runtime) void runtime.context.close().catch(() => { /* The context may already be closed. */ });
      delete (window as ArrivalAudioWindow).__castleArrivalAudioRuntime;
    };

    const animationDuration = Number(castleAnimation.effect?.getComputedTiming().duration ?? 0);
    if (animationDuration < 100) {
      finishArrival();
      return;
    }

    const synchronizeAudio = () => {
      const animationTime = typeof castleAnimation.currentTime === "number" ? castleAnimation.currentTime : 0;
      arrivalSoundCues.forEach((cue, index) => {
        if (playedCues.has(index) || animationTime < cue.delay) return;
        const runtime = arrivalAudioRuntimeRef.current;
        const buffer = runtime?.buffers[index];
        if (!runtime || !buffer || runtime.context.state === "closed") return;
        playedCues.add(index);
        const playCue = () => {
          if (runtime.context.state !== "running") return;
          const source = runtime.context.createBufferSource();
          const gain = runtime.context.createGain();
          source.buffer = buffer;
          source.playbackRate.value = cue.playbackRate;
          const now = runtime.context.currentTime;
          gain.gain.setValueAtTime(cue.volume, now);
          gain.gain.setValueAtTime(cue.volume, now + Math.max(0, cue.duration - 0.08));
          gain.gain.linearRampToValueAtTime(0, now + cue.duration);
          source.connect(gain).connect(runtime.context.destination);
          source.start(now, cue.offset, cue.duration);
          arrivalAudioSourcesRef.current.push(source);
        };
        if (runtime.context.state === "running") playCue();
        else void runtime.context.resume().then(playCue).catch(() => { /* The visual entrance continues. */ });
      });

      if (castleAnimation.playState === "finished" || animationTime >= animationDuration) {
        arrivalTimerRef.current = window.setTimeout(finishArrival, 1550);
        return;
      }
      arrivalAnimationFrameRef.current = window.requestAnimationFrame(synchronizeAudio);
    };
    arrivalAnimationFrameRef.current = window.requestAnimationFrame(synchronizeAudio);
  };

  const beginMagicalEntry = (item: Pick<ConceptDestination, "id" | "fr" | "ar" | "image" | "path">, element: HTMLElement) => {
    if (magicalEntry) return;
    const bounds = element.getBoundingClientRect();
    const entry = {
      ...item,
      originX: bounds.left + bounds.width / 2,
      originY: bounds.top + bounds.height / 2,
    };
    setMagicalEntry(entry);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    entryTimerRef.current = window.setTimeout(() => router.push(item.path), reducedMotion ? 120 : 1050);
  };

  const moveDestinations = (direction: -1 | 1) => {
    const rail = destinationRailRef.current;
    if (!rail) return;
    const firstCard = rail.querySelector<HTMLElement>(".concept-tilt-card");
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap || window.getComputedStyle(rail).gap) || 0;
    const step = (firstCard?.offsetWidth ?? Math.min(rail.clientWidth * 0.82, 390)) + gap;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const atStart = rail.scrollLeft <= Math.max(8, step * 0.35);
    const atEnd = rail.scrollLeft >= maxScroll - Math.max(8, step * 0.35);
    if (direction < 0 && atStart) {
      rail.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }
    if (direction > 0 && atEnd) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <main className={`kingdom-concept${arrivalPlaying ? " concept-arrival-active" : ""}`} dir="rtl">
      <header className="concept-topbar">
        <SmartCompass />
        <nav className="concept-main-nav" dir="ltr" aria-label="التنقل الرئيسي">
          <Link href="/">ACCUEIL</Link>
        </nav>
      </header>

      <section className="concept-hero">
        <img
          src="/kingdom-portal-assets/castle-facade.png"
          alt="واجهة القلعة"
          className="concept-hero-image"
          onAnimationStart={(event) => {
            if (event.animationName !== "conceptCastleArrival") return;
            const castleAnimation = event.currentTarget.getAnimations().find((animation) =>
              animation instanceof CSSAnimation && animation.animationName === "conceptCastleArrival"
            );
            if (castleAnimation) startArrivalTimeline(castleAnimation);
          }}
        />
        <div className="concept-hero-shade" />
        <div className="concept-castle-title">
          <h1 dir="ltr">LE CHÂTEAU</h1>
          <p>القلعة</p>
        </div>
        <div className="concept-castle-ground" aria-hidden="true"><span /><i /></div>
        <div className="concept-castle-garden concept-castle-garden-left" aria-hidden="true" />
        <div className="concept-castle-garden concept-castle-garden-right" aria-hidden="true" />
        {arrivalPlaying && <div className="concept-arrival-impact" aria-hidden="true">
          <span className="concept-arrival-impact-ring" />
          {Array.from({ length: 12 }).map((_, index) => <i key={index} style={{ "--impact-particle": index } as React.CSSProperties} />)}
        </div>}
        {arrivalPlaying && <div className="concept-arrival-birds" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, index) => {
            const direction = index % 2 === 0 ? -1 : 1;
            return <span
              key={index}
              className={direction < 0 ? "concept-bird concept-bird-left" : "concept-bird concept-bird-right"}
              style={{
                "--bird-top": `${46 + (index % 6) * 3.5}%`,
                "--bird-edge": `${2 + (index % 7) * 2.15}%`,
                "--bird-delay": `${(index % 14) * 18}ms`,
                "--bird-depth": 0.58 + (index % 5) * 0.13,
                "--bird-exit-x": `${direction * (82 + (index % 4) * 3)}vw`,
                "--bird-exit-y": `${-(13 + (index % 7) * 2.15)}vh`,
                "--bird-tilt": `${direction * -8}deg`,
              } as React.CSSProperties}
            ><i /></span>;
          })}
        </div>}
        <Link href="/castle" className="concept-castle-entry" aria-label="دخول قاعات القلعة" onClick={(event) => {
          event.preventDefault();
          beginMagicalEntry({ id: "castle", fr: "LE CHÂTEAU", ar: "قاعات القلعة", image: "/kingdom-portal-assets/castle-facade.png", path: "/castle" }, event.currentTarget);
        }}>
          <span className="concept-entry-app concept-entry-castle" aria-hidden="true"><CastleAppIcon /></span>
          <span><strong dir="ltr">ENTREZ</strong><small>دخول القلعة</small></span>
          <span className="concept-entry-app concept-entry-arrow" aria-hidden="true"><ArrowLeft /></span>
        </Link>
        <div className="concept-scene-book">
          {arrivalPlaying && <div className="concept-arrival-page-stack" aria-hidden="true">
            <img src="/kingdom-portal-assets/integrated-academy-book-v1.webp" alt="" />
          </div>}
          <div className="concept-open-book concept-integrated-book" dir="ltr">
            <img className="concept-book-base" src="/kingdom-portal-assets/integrated-academy-book-v1.webp" alt="كتاب مفتوح تخرج من صفحتيه الجامعة والمكتبة، وعناوينهما مطبوعة على الورق" />
            <div className="concept-book-pages">
              <Link href="/university" className="concept-book-page concept-book-university" aria-label="UNIVERSITÉ — الجامعة" onClick={(event) => {
                event.preventDefault();
                beginMagicalEntry({ id: "university", fr: "UNIVERSITÉ", ar: "الجامعة", image: "/kingdom-portal-assets/university-campus-front-v3.webp", path: "/university" }, event.currentTarget);
              }}>
              </Link>
              <Link href="/library" className="concept-book-page concept-book-library" aria-label="BIBLIOTHÈQUE — المكتبة" onClick={(event) => {
                event.preventDefault();
                beginMagicalEntry({ id: "library", fr: "BIBLIOTHÈQUE", ar: "المكتبة", image: "/kingdom-portal-assets/library-facade.png", path: "/library" }, event.currentTarget);
              }}>
              </Link>
            </div>
          </div>
          <div className="concept-book-platform" aria-hidden="true"><span /><i /></div>
        </div>
      </section>

      <section className="concept-destinations" id="concept-destinations">
        <div className="concept-destination-stage">
          <button type="button" className="concept-rail-arrow concept-rail-arrow-left" onClick={() => moveDestinations(-1)} aria-label="الوجهة السابقة"><ChevronLeft /></button>
          <div className="concept-card-grid" ref={destinationRailRef}>
            {destinations.map((item, index) => <TiltCard key={item.id} item={item} index={index} onEnter={beginMagicalEntry} />)}
          </div>
          <button type="button" className="concept-rail-arrow concept-rail-arrow-right" onClick={() => moveDestinations(1)} aria-label="الوجهة التالية"><ChevronRight /></button>
        </div>
      </section>
      {magicalEntry && (
        <div
          className={`concept-magic-entry concept-magic-entry-${magicalEntry.id}`}
          style={{ "--entry-x": `${magicalEntry.originX}px`, "--entry-y": `${magicalEntry.originY}px` } as React.CSSProperties}
          role="status"
          aria-live="polite"
          aria-label={`الدخول إلى ${magicalEntry.ar}`}
        >
          <div className="concept-magic-particles" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => <i key={index} style={{ "--particle": index } as React.CSSProperties} />)}
          </div>
          <div className="concept-magic-portal" aria-hidden="true">
            <i className="concept-magic-ring concept-magic-ring-one" />
            <i className="concept-magic-ring concept-magic-ring-two" />
            <span className="concept-magic-building" style={{ backgroundImage: `url('${magicalEntry.image}')` }} />
            <Sparkles />
          </div>
          <div className="concept-magic-copy">
            <strong dir="ltr">{magicalEntry.fr}</strong>
            <b>{magicalEntry.ar}</b>
            <small>جاري الدخول...</small>
          </div>
        </div>
      )}
    </main>
  );
}
