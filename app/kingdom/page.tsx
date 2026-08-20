"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./portal.css";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Castle,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Compass,
  GraduationCap,
  Hotel,
  Landmark,
  Languages,
  Library,
  MapPin,
  Plane,
  Power,
  Scale,
  ShoppingBasket,
  Sparkles,
  Train,
  Trees,
  Trophy,
  Utensils,
  X
} from "lucide-react";

type Destination = {
  id: string;
  fr: string;
  ar: string;
  path: string;
  image: string;
  description: string;
  icon: React.ReactNode;
};

type CompassStatus = "detecting" | "permission" | "active" | "unavailable" | "denied" | "disabled";
type EntryState = { id: string; fr: string; ar: string; image: string };
type CompassOrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type CompassOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: (absolute?: boolean) => Promise<PermissionState>;
};

const destinations: Destination[] = [
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
  { id: "court", fr: "TRIBUNAL", ar: "المحكمة", path: "/court", image: "/maps/facades/civic-facade.webp", description: "القضايا والشهادة واللغة الرسمية", icon: <Scale /> }
];

const tourSlides = [
  {
    target: "university",
    icon: <GraduationCap />,
    fr: "Apprenez selon votre niveau",
    ar: "ابدأ من الجامعة وتعلّم حسب مستواك A1 أو A2، من الأحرف حتى المحادثة."
  },
  {
    target: "castle",
    icon: <Castle />,
    fr: "Verbes, conjugaison et grammaire",
    ar: "ادخل القلعة لتعلّم الأفعال وتصريفها ودراسة قواعد اللغة الفرنسية."
  },
  {
    target: "library",
    icon: <BookOpen />,
    fr: "Cherchez, lisez, découvrez",
    ar: "ابحث في المكتبة عن الكلمات والأسماء والقصص والروايات."
  },
  {
    target: "destinations",
    icon: <MapPin />,
    fr: "Apprenez dans chaque lieu",
    ar: "تجوّل بين الأماكن وتعلّم المفردات والمحادثات حسب المكان الذي تختاره."
  }
];

export default function KingdomPage() {
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<"ar" | "fr">("ar");
  const [pressed, setPressed] = useState<string | null>(null);
  const [entering, setEntering] = useState<EntryState | null>(null);
  const [loadedDestinations, setLoadedDestinations] = useState<Set<string>>(() => new Set(destinations.slice(0, 4).map(({ id }) => id)));
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [compassEnabled, setCompassEnabled] = useState(true);
  const [compassAuthorized, setCompassAuthorized] = useState(false);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [compassStatus, setCompassStatus] = useState<CompassStatus>("detecting");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!localStorage.getItem("chateau-new-portal-tour-seen-v1")) setTourOpen(true);
    }, 850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !("IntersectionObserver" in window)) {
      setLoadedDestinations(new Set(destinations.map(({ id }) => id)));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      const visibleIds = entries
        .filter(({ isIntersecting }) => isIntersecting)
        .map(({ target }) => target.getAttribute("data-destination"))
        .filter((id): id is string => Boolean(id));
      if (!visibleIds.length) return;
      setLoadedDestinations((current) => {
        if (visibleIds.every((id) => current.has(id))) return current;
        return new Set([...current, ...visibleIds]);
      });
      entries.forEach((entry) => {
        if (entry.isIntersecting) observer.unobserve(entry.target);
      });
    }, { root: rail, rootMargin: "0px 180px", threshold: 0.01 });
    rail.querySelectorAll<HTMLElement>("[data-destination]").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

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
    const onOrientation = (rawEvent: Event) => {
      const event = rawEvent as CompassOrientationEvent;
      const heading = typeof event.webkitCompassHeading === "number"
        ? event.webkitCompassHeading
        : event.absolute && typeof event.alpha === "number"
          ? (360 - event.alpha + 360) % 360
          : null;
      if (heading === null || !Number.isFinite(heading)) return;
      received = true;
      setCompassStatus("active");
      setCompassHeading((previous) => {
        if (previous === null) return heading;
        const turn = ((heading - previous + 540) % 360) - 180;
        return (previous + turn * 0.22 + 360) % 360;
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
    if (compassStatus === "unavailable") return "الشمال";
    if (compassHeading === null) return "جارٍ التحديد";
    return ["الشمال", "شمال شرق", "الشرق", "جنوب شرق", "الجنوب", "جنوب غرب", "الغرب", "شمال غرب"][Math.round(compassHeading / 45) % 8];
  }, [compassEnabled, compassHeading, compassStatus]);

  const prepareEntry = (path: string, image: string) => {
    router.prefetch(path);
    const preview = new window.Image();
    preview.src = image;
    void preview.decode?.().catch(() => undefined);
  };

  const enter = (id: string, fr: string, ar: string, path: string, image: string) => {
    if (pressed || entering) return;
    prepareEntry(path, image);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPressed(id);
    window.setTimeout(() => {
      setEntering({ id, fr, ar, image });
      setPressed(null);
      window.setTimeout(() => router.push(path), reduceMotion ? 120 : 980);
    }, reduceMotion ? 40 : 140);
  };

  const closeTour = () => {
    localStorage.setItem("chateau-new-portal-tour-seen-v1", "true");
    setTourOpen(false);
    setTourStep(0);
  };

  const scrollRail = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * Math.min(720, window.innerWidth * 0.72), behavior: "smooth" });
  };

  const headingRotation = compassHeading ?? 0;
  const activeTourTarget = tourOpen ? tourSlides[tourStep].target : "";

  return (
    <main className={`castle-portal ${entering ? "is-entering" : ""}`} dir={language === "ar" ? "rtl" : "ltr"} aria-busy={Boolean(entering)}>
      <link rel="preload" as="image" href="/kingdom-portal-assets/open-book-realistic-v1.webp" />
      <header className="castle-portal-topbar">
        <nav className="castle-portal-nav" aria-label="التنقل الرئيسي">
          <button onClick={() => router.push("/")}><span>ACCUEIL</span><small>الرئيسية</small></button>
          <button onClick={() => setTourOpen(true)}><span>À PROPOS</span><small>عن القلعة</small></button>
          <button onClick={() => router.push("/university")}><span>COURS</span><small>الدروس</small></button>
          <button onClick={() => router.push("/library")}><span>RESSOURCES</span><small>المصادر</small></button>
          <button onClick={() => setTourOpen(true)}><span>CONTACT</span><small>تواصل</small></button>
        </nav>

        <div className="castle-portal-tools">
          <button className="castle-language" onClick={() => setLanguage((value) => value === "ar" ? "fr" : "ar")}>
            <Languages />
            <span>{language === "ar" ? "FRANÇAIS" : "العربية"}</span>
          </button>
          <section className={`castle-compass ${compassStatus}`} aria-label={`البوصلة: ${compassLabel}`}>
            <button
              className="castle-compass-face"
              onClick={compassStatus === "permission" ? requestCompass : undefined}
              title={compassStatus === "permission" ? "اضغط مرة واحدة للسماح بالبوصلة على هذا الجهاز" : compassLabel}
            >
              <Compass style={{ transform: `rotate(${-headingRotation}deg)` }} />
              <b>N</b>
            </button>
            <div><strong>{compassLabel}</strong><small>BOUSSOLE</small></div>
            <button className="castle-compass-power" onClick={() => setCompassEnabled((value) => !value)} aria-label={compassEnabled ? "إيقاف البوصلة" : "تشغيل البوصلة"}>
              <Power />
            </button>
          </section>
        </div>
      </header>

      <section className={`castle-portal-scene ${activeTourTarget === "castle" ? "is-tour-focus" : ""}`} data-guide="castle">
        <div className="castle-portal-sun" />
        <div className="castle-portal-castle">
          <img className="castle-facade-art" src="/kingdom-portal-assets/castle-facade.png" alt="" aria-hidden="true" decoding="async" fetchPriority="high" draggable={false} />
          <button
            className={`castle-main-gate ${pressed === "castle" ? "is-pressed" : ""}`}
            onPointerEnter={() => prepareEntry("/entrance/castle", "/kingdom-portal-assets/castle-facade.png")}
            onFocus={() => prepareEntry("/entrance/castle", "/kingdom-portal-assets/castle-facade.png")}
            onClick={() => enter("castle", "LE CHÂTEAU", "القلعة", "/entrance/castle", "/kingdom-portal-assets/castle-facade.png")}
          >
            <span className="castle-main-title"><strong>LE CHÂTEAU</strong><small>القلعة</small></span>
            <span className="castle-gate-doors"><i /><i /></span>
            <span className="castle-enter-hint"><Sparkles /> ENTREZ <small>اضغط للدخول</small></span>
          </button>
        </div>

        <div className="castle-portal-garden castle-portal-garden-left" />
        <div className="castle-portal-garden castle-portal-garden-right" />

        <section className="enchanted-book" aria-label="الوجهات الرئيسية">
          <div className="book-pages">
            <button
              data-guide="university"
              className={`book-destination university-book ${pressed === "university" ? "is-pressed" : ""} ${activeTourTarget === "university" ? "is-tour-focus" : ""}`}
              onPointerEnter={() => prepareEntry("/entrance/university", "/kingdom-portal-assets/university-campus.png")}
              onFocus={() => prepareEntry("/entrance/university", "/kingdom-portal-assets/university-campus.png")}
              onClick={() => enter("university", "UNIVERSITÉ", "الجامعة", "/entrance/university", "/kingdom-portal-assets/university-campus.png")}
            >
              <span className="book-copy"><strong>UNIVERSITÉ</strong><small>الجامعة</small><em>Choisissez votre niveau · اختر مستواك</em></span>
              <img className="university-campus-art" src="/kingdom-portal-assets/university-campus.png" alt="" aria-hidden="true" decoding="async" loading="eager" draggable={false} />
              <span className="book-enter"><Sparkles /> ENTRER</span>
            </button>

            <button
              data-guide="library"
              className={`book-destination library-book ${pressed === "library" ? "is-pressed" : ""} ${activeTourTarget === "library" ? "is-tour-focus" : ""}`}
              onPointerEnter={() => prepareEntry("/entrance/library", "/kingdom-portal-assets/library-facade.png")}
              onFocus={() => prepareEntry("/entrance/library", "/kingdom-portal-assets/library-facade.png")}
              onClick={() => enter("library", "BIBLIOTHÈQUE", "المكتبة", "/entrance/library", "/kingdom-portal-assets/library-facade.png")}
            >
              <img className="library-facade-art" src="/kingdom-portal-assets/library-facade.png" alt="" aria-hidden="true" decoding="async" loading="eager" draggable={false} />
              <span className="book-copy"><strong>BIBLIOTHÈQUE</strong><small>المكتبة</small><em>Mots, histoires et romans · كلمات وقصص وروايات</em></span>
              <span className="book-enter"><Sparkles /> ENTRER</span>
            </button>
          </div>
          <div className="book-spine" />
          <div className="book-edge book-edge-one" />
          <div className="book-edge book-edge-two" />
        </section>
      </section>

      <section className={`destination-gallery ${activeTourTarget === "destinations" ? "is-tour-focus" : ""}`} data-guide="destinations">
        <div className="destination-heading">
          <Sparkles />
          <div><strong>CHOISISSEZ VOTRE DESTINATION</strong><small>اختر المكان الذي تريد التعلّم فيه</small></div>
        </div>
        <button className="destination-arrow previous" onClick={() => scrollRail(-1)} aria-label="السابق"><ChevronLeft /></button>
        <div className="destination-rail" ref={railRef} dir="ltr">
          {destinations.map((destination) => (
            <button
              key={destination.id}
              data-destination={destination.id}
              className={`destination-tab ${pressed === destination.id ? "is-pressed" : ""}`}
              onPointerEnter={() => prepareEntry(destination.path, destination.image)}
              onFocus={() => prepareEntry(destination.path, destination.image)}
              onClick={() => enter(destination.id, destination.fr, destination.ar, destination.path, destination.image)}
            >
              <span className={`destination-photo ${loadedDestinations.has(destination.id) ? "is-image-ready" : ""}`} style={loadedDestinations.has(destination.id) ? { backgroundImage: `url('${destination.image}')` } : undefined}>
                <i>{destination.icon}</i>
              </span>
              <span className="destination-copy">
                <strong>{destination.fr}</strong>
                <b>{destination.ar}</b>
                <small>{destination.description}</small>
              </span>
              <span className="destination-open"><Sparkles /> ENTRER</span>
            </button>
          ))}
        </div>
        <button className="destination-arrow next" onClick={() => scrollRail(1)} aria-label="التالي"><ChevronRight /></button>
      </section>

      {tourOpen && (
        <div className="portal-tour-backdrop">
          <aside className="portal-tour-card" dir="rtl">
            <button className="portal-tour-close" onClick={closeTour}><X /></button>
            <div className="portal-tour-icon">{tourSlides[tourStep].icon}</div>
            <span>VISITE GUIDÉE · جولة تعريفية</span>
            <h2>{tourSlides[tourStep].fr}</h2>
            <p>{tourSlides[tourStep].ar}</p>
            <div className="portal-tour-progress">
              {tourSlides.map((slide, index) => <i key={slide.target} className={index === tourStep ? "active" : ""} />)}
            </div>
            <div className="portal-tour-actions">
              <button onClick={closeTour}>تخطي الجولة</button>
              {tourStep > 0 && <button onClick={() => setTourStep((value) => value - 1)}><ArrowRight /> السابق</button>}
              <button className="primary" onClick={() => tourStep < tourSlides.length - 1 ? setTourStep((value) => value + 1) : closeTour()}>
                {tourStep === tourSlides.length - 1 ? "ابدأ رحلتي" : "التالي"} <ArrowLeft />
              </button>
            </div>
          </aside>
        </div>
      )}

      {entering && (
        <div className={`magic-entry magic-entry-${entering.id}`} role="status" aria-live="polite">
          <div className="magic-entry-particles">{Array.from({ length: 16 }).map((_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div>
          <div className="magic-entry-portal" aria-hidden="true">
            <i className="magic-entry-ring" />
            <span className="magic-entry-building" style={{ backgroundImage: `url('${entering.image}')` }} />
            <Sparkles />
          </div>
          <div className="magic-entry-title">
            <strong>{entering.fr}</strong>
            <small>{entering.ar}</small>
            <em>ENTRÉE EN COURS · جاري الدخول</em>
          </div>
        </div>
      )}
    </main>
  );
}
