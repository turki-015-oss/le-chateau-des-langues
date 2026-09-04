"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowLeft,
  Building2,
  Castle,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Coffee,
  Hotel,
  Landmark,
  Plane,
  Power,
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

type ConceptDestination = {
  id: string;
  fr: string;
  ar: string;
  description: string;
  image: string;
  path: string;
  icon: React.ReactNode;
};

type CompassStatus = "detecting" | "permission" | "active" | "unavailable" | "denied" | "disabled";
type MagicalEntry = Pick<ConceptDestination, "id" | "fr" | "ar" | "image" | "path"> & { originX: number; originY: number };
type CompassOrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type CompassOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: (absolute?: boolean) => Promise<PermissionState>;
};

const destinations: ConceptDestination[] = [
  { id: "hospital", fr: "HÔPITAL", ar: "المستشفى", path: "/hospital", image: "/kingdom-portal-assets/destination-hospital.png", description: "الصحة والمواعيد وطلب المساعدة", icon: <Building2 /> },
  { id: "airport", fr: "AÉROPORT", ar: "المطار", path: "/entrance/airport", image: "/kingdom-portal-assets/destination-airport.png", description: "السفر والجوازات والرحلات", icon: <Plane /> },
  { id: "station", fr: "GARE", ar: "محطة القطار", path: "/entrance/station", image: "/kingdom-portal-assets/destination-station.png", description: "التذاكر والمواعيد والوجهات", icon: <Train /> },
  { id: "market", fr: "MARCHÉ", ar: "السوق الكبير", path: "/entrance/market", image: "/kingdom-portal-assets/destination-market.png", description: "المنتجات والمفردات والمحادثات", icon: <ShoppingBasket /> },
  { id: "cafe", fr: "CAFÉ", ar: "المقهى", path: "/entrance/cafe", image: "/kingdom-portal-assets/destination-cafe-v2.webp", description: "التحية والجلوس والطلب", icon: <Coffee /> },
  { id: "restaurant", fr: "RESTAURANT", ar: "المطعم", path: "/entrance/restaurant", image: "/kingdom-portal-assets/destination-restaurant-v2.webp", description: "الحجز والقائمة والمحادثة", icon: <Utensils /> },
  { id: "police", fr: "COMMISSARIAT", ar: "مركز الشرطة", path: "/entrance/police", image: "/kingdom-portal-assets/destination-police-v2.webp", description: "المساعدة والمواقف الأمنية", icon: <Landmark /> },
  { id: "zoo", fr: "ZOO", ar: "حديقة الحيوانات", path: "/entrance/zoo", image: "/kingdom-portal-assets/destination-zoo-v2.webp", description: "الحيوانات والطبيعة والاستكشاف", icon: <Trees /> },
  { id: "hotel", fr: "HÔTEL", ar: "الفندق", path: "/entrance/hotel", image: "/kingdom-portal-assets/destination-hotel-v2.webp", description: "الحجز والاستقبال والإقامة", icon: <Hotel /> },
  { id: "stadium", fr: "STADE", ar: "الملعب", path: "/entrance/stadium", image: "/kingdom-portal-assets/destination-stadium-v2.webp", description: "الرياضة والمباريات والجمهور", icon: <Trophy /> },
  { id: "cinema", fr: "CINÉMA", ar: "صالة السينما", path: "/entrance/cinema", image: "/kingdom-portal-assets/destination-cinema-v2.webp", description: "الأفلام والعروض والحوار الثقافي", icon: <Clapperboard /> },
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
        <span className="concept-card-enter"><span>ENTRER</span><ArrowLeft /></span>
      </span>
    </button>
  );
}

export default function KingdomConceptPage() {
  const router = useRouter();
  const destinationRailRef = useRef<HTMLDivElement>(null);
  const entryTimerRef = useRef<number | null>(null);
  const [magicalEntry, setMagicalEntry] = useState<MagicalEntry | null>(null);
  const [compassEnabled, setCompassEnabled] = useState(true);
  const [compassAuthorized, setCompassAuthorized] = useState(false);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [compassStatus, setCompassStatus] = useState<CompassStatus>("detecting");

  useEffect(() => {
    ["/entrance/castle", "/entrance/university", "/entrance/library", ...destinations.map(({ path }) => path)].forEach((path) => router.prefetch(path));
    return () => {
      if (entryTimerRef.current !== null) window.clearTimeout(entryTimerRef.current);
    };
  }, [router]);

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

  useEffect(() => {
    if (!compassEnabled) {
      setCompassStatus("disabled");
      setCompassHeading(null);
      return;
    }
    if (!("DeviceOrientationEvent" in window)) {
      setCompassStatus("unavailable");
      return;
    }
    const OrientationEvent = window.DeviceOrientationEvent as CompassOrientationConstructor;
    if (typeof OrientationEvent.requestPermission === "function" && !compassAuthorized) {
      setCompassStatus("permission");
      return;
    }

    let received = false;
    let frame: number | null = null;
    let latestHeading = 0;
    const onOrientation = (rawEvent: Event) => {
      const event = rawEvent as CompassOrientationEvent;
      const heading = typeof event.webkitCompassHeading === "number"
        ? event.webkitCompassHeading
        : event.absolute && typeof event.alpha === "number"
          ? (360 - event.alpha + 360) % 360
          : null;
      if (heading === null || !Number.isFinite(heading)) return;
      if (!received) setCompassStatus("active");
      received = true;
      latestHeading = ((heading % 360) + 360) % 360;
      // Use the freshest sensor reading once per display frame, without trailing smoothing.
      if (frame === null) frame = window.requestAnimationFrame(() => {
        frame = null;
        setCompassHeading(latestHeading);
      });
    };
    const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(eventName, onOrientation, true);
    setCompassStatus("detecting");
    const timer = window.setTimeout(() => {
      if (!received) setCompassStatus("unavailable");
    }, 2800);
    return () => {
      window.clearTimeout(timer);
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener(eventName, onOrientation, true);
    };
  }, [compassAuthorized, compassEnabled]);

  const requestCompass = async () => {
    const OrientationEvent = window.DeviceOrientationEvent as CompassOrientationConstructor;
    if (typeof OrientationEvent.requestPermission !== "function") {
      setCompassAuthorized(true);
      return;
    }
    try {
      const permission = await OrientationEvent.requestPermission(true);
      if (permission === "granted") {
        setCompassAuthorized(true);
        setCompassStatus("detecting");
      } else setCompassStatus("denied");
    } catch {
      setCompassStatus("denied");
    }
  };

  const compassLabel = useMemo(() => {
    if (!compassEnabled) return "متوقفة";
    if (compassStatus === "permission") return "تفعيل الاتجاه";
    if (compassStatus === "denied") return "الإذن مرفوض";
    if (compassStatus === "unavailable") return "البوصلة غير متاحة";
    if (compassHeading === null) return "جارٍ التحديد";
    return ["الشمال", "شمال شرق", "الشرق", "جنوب شرق", "الجنوب", "جنوب غرب", "الغرب", "شمال غرب"][Math.round(compassHeading / 45) % 8];
  }, [compassEnabled, compassHeading, compassStatus]);

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
    <main className="kingdom-concept" dir="rtl">
      <header className="concept-topbar">
        <section className={`concept-compass ${compassStatus}`} aria-label={`البوصلة: ${compassLabel}`}>
          <button
            type="button"
            className="concept-compass-face"
            onClick={compassStatus === "permission" ? requestCompass : undefined}
            title={compassStatus === "permission" ? "اضغط للسماح بالبوصلة" : compassLabel}
          >
            <span className="concept-compass-rotor" style={{ transform: `rotate(${-(compassHeading ?? 0)}deg)` }} aria-hidden="true">
            <span className="concept-compass-cardinals">
              <b className="north">N</b><b className="east">E</b><b className="south">S</b><b className="west">W</b>
            </span>
            <i className="concept-compass-needle">
              <span />
            </i>
            </span>
          </button>
          <div><strong>{compassLabel}</strong><small>{compassHeading === null ? "—" : `${Math.round(compassHeading)}°`} · BOUSSOLE</small></div>
          <button type="button" className="concept-compass-power" onClick={() => setCompassEnabled((value) => !value)} aria-label={compassEnabled ? "إيقاف البوصلة" : "تشغيل البوصلة"}>
            <Power />
          </button>
        </section>
        <nav className="concept-main-nav" dir="ltr" aria-label="التنقل الرئيسي">
          <Link href="/">ACCUEIL</Link>
          <Link href="/welcome">À PROPOS</Link>
        </nav>
      </header>

      <section className="concept-hero">
        <img src="/kingdom-portal-assets/castle-facade.png" alt="واجهة القلعة" className="concept-hero-image" />
        <div className="concept-hero-shade" />
        <div className="concept-castle-title">
          <h1 dir="ltr">LE CHÂTEAU</h1>
          <p>القلعة</p>
        </div>
        <div className="concept-castle-ground" aria-hidden="true"><span /><i /></div>
        <div className="concept-castle-garden concept-castle-garden-left" aria-hidden="true" />
        <div className="concept-castle-garden concept-castle-garden-right" aria-hidden="true" />
        <Link href="/entrance/castle" className="concept-castle-entry" aria-label="دخول القلعة" onClick={(event) => {
          event.preventDefault();
          beginMagicalEntry({ id: "castle", fr: "LE CHÂTEAU", ar: "القلعة", image: "/kingdom-portal-assets/castle-facade.png", path: "/entrance/castle" }, event.currentTarget);
        }}>
          <span className="concept-entry-app concept-entry-castle" aria-hidden="true"><Castle /></span>
          <span><strong dir="ltr">ENTREZ</strong><small>دخول القلعة</small></span>
          <span className="concept-entry-app concept-entry-arrow" aria-hidden="true"><ArrowLeft /></span>
        </Link>
        <div className="concept-scene-book">
          <div className="concept-open-book concept-integrated-book" dir="ltr">
            <img className="concept-book-base" src="/kingdom-portal-assets/integrated-academy-book-v1.webp" alt="كتاب مفتوح تخرج من صفحتيه الجامعة والمكتبة، وعناوينهما مطبوعة على الورق" />
            <div className="concept-book-pages">
              <Link href="/entrance/university" className="concept-book-page concept-book-university" aria-label="UNIVERSITÉ — الجامعة" onClick={(event) => {
                event.preventDefault();
                beginMagicalEntry({ id: "university", fr: "UNIVERSITÉ", ar: "الجامعة", image: "/kingdom-portal-assets/university-campus-front-v3.webp", path: "/entrance/university" }, event.currentTarget);
              }}>
              </Link>
              <Link href="/entrance/library" className="concept-book-page concept-book-library" aria-label="BIBLIOTHÈQUE — المكتبة" onClick={(event) => {
                event.preventDefault();
                beginMagicalEntry({ id: "library", fr: "BIBLIOTHÈQUE", ar: "المكتبة", image: "/kingdom-portal-assets/library-facade.png", path: "/entrance/library" }, event.currentTarget);
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
