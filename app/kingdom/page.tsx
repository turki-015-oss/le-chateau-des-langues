"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import KingdomMapLayers from "../../components/KingdomMapLayers";
import {
  BookOpen,
  Building2,
  Castle,
  Coffee,
  Compass,
  GraduationCap,
  Hotel,
  Landmark,
  MapPin,
  Minus,
  Plane,
  Plus,
  RotateCcw,
  Scale,
  ShoppingBasket,
  Train,
  Trees,
  Trophy,
  Utensils,
  X,
  Search,
  Navigation,
  LockKeyhole,
  Hand,
  Sparkles,
  ChevronLeft,
  MousePointer2,
  UserRound,
  Save,
  LayoutGrid,
  Map as MapIcon,
  LogIn,
  LogOut,
  ImagePlus,
  CheckCircle2,
  Home
} from "lucide-react";

type PlayerProfile = {
  name: string;
  email: string;
  avatar: string;
  signedIn: boolean;
};

type CompassStatus = "detecting" | "permission" | "active" | "unavailable" | "denied";
type CompassOrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type CompassOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: (absolute?: boolean) => Promise<PermissionState>;
};

type Place = {
  id: string;
  fr: string;
  ar: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  path?: string;
  open: boolean;
  icon: React.ReactNode;
};

const places: Place[] = [
  { id: "profile", fr: "Profil", ar: "الملف الشخصي", description: "الصورة والحساب وإعدادات اللاعب", x: 10, y: 1034, w: 190, h: 64, open: true, icon: <UserRound /> },
  { id: "university", fr: "L'Université", ar: "الجامعة", description: "الدراسة والمحاضرات والحياة الجامعية", x: 75, y: 87, w: 162, h: 203, path: "/entrance/university", open: true, icon: <GraduationCap /> },
  { id: "stadium", fr: "Le Stade", ar: "ملعب كرة القدم", description: "المباريات والتدريب والإعلام الرياضي", x: 588, y: 141, w: 178, h: 174, path: "/entrance/stadium", open: true, icon: <Trophy /> },
  { id: "cafe", fr: "Chez Luc", ar: "المقهى", description: "التحية والجلوس والطلب والدفع", x: 55, y: 319, w: 193, h: 153, path: "/entrance/cafe", open: true, icon: <Coffee /> },
  { id: "restaurant", fr: "Le Restaurant", ar: "المطعم", description: "الحجز والقائمة والطلب والشكوى", x: 600, y: 306, w: 174, h: 149, path: "/entrance/restaurant", open: true, icon: <Utensils /> },
  { id: "market", fr: "Le Grand Marché", ar: "السوق الكبير", description: "الشراء والأسعار والتفاوض", x: 43, y: 484, w: 217, h: 161, path: "/entrance/market", open: true, icon: <ShoppingBasket /> },
  { id: "court", fr: "Le Tribunal Royal", ar: "المحكمة الملكية", description: "القضايا والشهادة واللغة الرسمية", x: 359, y: 513, w: 170, h: 153, path: "/court", open: true, icon: <Scale /> },
  { id: "hospital", fr: "L'Hôpital", ar: "المستشفى", description: "الأعراض والمواعيد وطلب المساعدة", x: 525, y: 430, w: 162, h: 157, path: "/hospital", open: true, icon: <Building2 /> },
  { id: "zoo", fr: "Le Zoo", ar: "حديقة الحيوانات", description: "الحيوانات والطبيعة والاستكشاف", x: 671, y: 563, w: 118, h: 145, path: "/entrance/zoo", open: true, icon: <Trees /> },
  { id: "library", fr: "La Bibliothèque", ar: "المكتبة", description: "القراءة والبحث والمفردات", x: 51, y: 654, w: 193, h: 153, path: "/entrance/library", open: true, icon: <BookOpen /> },
  { id: "police", fr: "Le Commissariat", ar: "مركز الشرطة", description: "المواقف الأمنية وطلب المساعدة", x: 280, y: 650, w: 221, h: 166, path: "/entrance/police", open: true, icon: <Landmark /> },
  { id: "hotel", fr: "L'Hôtel", ar: "الفندق", description: "الحجز والاستقبال والإقامة", x: 525, y: 629, w: 174, h: 157, path: "/entrance/hotel", open: true, icon: <Hotel /> },
  { id: "airport", fr: "L'Aéroport", ar: "المطار", description: "السفر والجوازات والرحلات", x: 36, y: 857, w: 237, h: 161, path: "/entrance/airport", open: true, icon: <Plane /> },
  { id: "station", fr: "La Gare", ar: "محطة القطار", description: "التذاكر والمواعيد والوجهات", x: 552, y: 848, w: 217, h: 182, path: "/entrance/station", open: true, icon: <Train /> },
  { id: "palace", fr: "Le Château", ar: "القلعة", description: "قلب القلعة وقاعات التعلّم", x: 260, y: 62, w: 288, h: 352, path: "/entrance/castle", open: true, icon: <Castle /> }
];


const avatarOptions = [
  { id: "royal", label: "الفارس", value: "🧑🏻‍⚔️" },
  { id: "student", label: "الطالب", value: "🧑🏻‍🎓" },
  { id: "explorer", label: "المستكشف", value: "🧭" },
  { id: "scholar", label: "الباحث", value: "🧑🏻‍🏫" },
  { id: "traveler", label: "المسافر", value: "🧳" },
  { id: "hero", label: "البطل", value: "🦸🏻" }
];

const defaultProfile: PlayerProfile = {
  name: "متعلم جديد",
  email: "",
  avatar: "🧑🏻‍🎓",
  signedIn: false
};

const ART_W = 808;
const ART_H = 1114;
const WORLD_W = 3200;
const WORLD_H = 4200;
const CITY_X = 1088;
const CITY_Y = 1260;
const CITY_W = 808;
const CITY_H = 1114;
const MIN_SCALE = 0.2;
const MAX_SCALE = 1.6;

export default function KingdomMapPage() {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const pinchDistance = useRef<number | null>(null);
  const moved = useRef(false);

  const [scale, setScale] = useState(0.62);
  const [position, setPosition] = useState({ x: -620, y: -700 });
  const [selected, setSelected] = useState<Place | null>(null);
  const [dragging, setDragging] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [entering, setEntering] = useState<Place | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [profile, setProfile] = useState<PlayerProfile>(defaultProfile);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "classic">("map");
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [compassStatus, setCompassStatus] = useState<CompassStatus>("detecting");
  const [compassAuthorized, setCompassAuthorized] = useState(false);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const clampScale = (value: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
  const clampPosition = (next: { x: number; y: number }, nextScale = scale) => {
    const viewport = viewportRef.current;
    if (!viewport) return next;
    const margin = 120;
    const minX = viewport.clientWidth - WORLD_W * nextScale - margin;
    const maxX = margin;
    const minY = viewport.clientHeight - WORLD_H * nextScale - margin;
    const maxY = margin;
    return {
      x: Math.min(maxX, Math.max(minX, next.x)),
      y: Math.min(maxY, Math.max(minY, next.y))
    };
  };

  const focusPlace = (place: Place) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const targetScale = Math.max(scale, viewport.clientWidth < 720 ? 0.85 : 0.95);
    const worldX = CITY_X + place.x + place.w / 2;
    const worldY = CITY_Y + place.y + place.h / 2;
    const next = {
      x: viewport.clientWidth / 2 - worldX * targetScale,
      y: viewport.clientHeight / 2 - worldY * targetScale
    };
    setScale(targetScale);
    setPosition(clampPosition(next, targetScale));
    setMenuOpen(false);
    window.setTimeout(() => setSelected(place), 260);
  };

  const filteredPlaces = places.filter((place) =>
    `${place.ar} ${place.fr}`.toLowerCase().includes(query.trim().toLowerCase())
  );


  const centerMap = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nextScale = viewport.clientWidth < 720 ? 0.58 : 0.72;
    setScale(nextScale);
    setPosition({
      x: viewport.clientWidth / 2 - (CITY_X + CITY_W / 2) * nextScale,
      y: viewport.clientHeight / 2 - (CITY_Y + CITY_H / 2) * nextScale
    });
  };

  useEffect(() => {
    if (!("DeviceOrientationEvent" in window)) {
      setCompassStatus("unavailable");
      return;
    }

    const OrientationEvent = window.DeviceOrientationEvent as CompassOrientationConstructor;
    if (typeof OrientationEvent.requestPermission === "function" && !compassAuthorized) {
      setCompassStatus("permission");
      return;
    }

    let receivedHeading = false;
    const handleOrientation = (rawEvent: Event) => {
      const event = rawEvent as CompassOrientationEvent;
      const webkitHeading = event.webkitCompassHeading;
      const nextHeading = typeof webkitHeading === "number" && Number.isFinite(webkitHeading)
        ? webkitHeading
        : event.absolute && typeof event.alpha === "number"
          ? (360 - event.alpha + 360) % 360
          : null;
      if (nextHeading === null) return;
      receivedHeading = true;
      setCompassStatus("active");
      setCompassHeading((previous) => {
        if (previous === null) return nextHeading;
        const shortestTurn = ((nextHeading - previous + 540) % 360) - 180;
        return (previous + shortestTurn * 0.24 + 360) % 360;
      });
    };

    const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(eventName, handleOrientation, true);
    setCompassStatus("detecting");
    const unavailableTimer = window.setTimeout(() => {
      if (!receivedHeading) setCompassStatus("unavailable");
    }, 2800);

    return () => {
      window.clearTimeout(unavailableTimer);
      window.removeEventListener(eventName, handleOrientation, true);
    };
  }, [compassAuthorized]);

  const requestCompassPermission = async () => {
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
      } else {
        setCompassStatus("denied");
      }
    } catch {
      setCompassStatus("denied");
    }
  };

  const compassDirection = compassHeading === null
    ? compassStatus === "permission" ? "تفعيل الاتجاه"
      : compassStatus === "denied" ? "الإذن مرفوض"
        : compassStatus === "unavailable" ? "الشمال ثابت"
          : "جارٍ التحديد"
    : ["الشمال", "شمال شرق", "الشرق", "جنوب شرق", "الجنوب", "جنوب غرب", "الغرب", "شمال غرب"][Math.round(compassHeading / 45) % 8];

  useEffect(() => {
    const saved = localStorage.getItem("chateau-world-camera-v4");
    if (saved) {
      try {
        const value = JSON.parse(saved) as { scale: number; x: number; y: number };
        setScale(clampScale(value.scale));
        setPosition({ x: value.x, y: value.y });
        return;
      } catch {}
    }
    centerMap();
    const savedProfile = localStorage.getItem("chateau-player-profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as PlayerProfile;
        setProfile({ ...defaultProfile, ...parsed });
        setNameInput(parsed.name || "");
        setEmailInput(parsed.email || "");
      } catch {}
    }
    const savedView = localStorage.getItem("chateau-view-mode");
    if (savedView === "classic") setViewMode("classic");
    const guideSeen = localStorage.getItem("chateau-kingdom-guide-seen");
    if (!guideSeen) window.setTimeout(() => setShowGuide(true), 450);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem("chateau-world-camera-v4", JSON.stringify({ scale, x: position.x, y: position.y }));
    }, 180);
    return () => window.clearTimeout(timer);
  }, [scale, position]);

  const transform = useMemo(() => `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`, [position, scale]);

  const zoomAround = (nextScale: number, cx: number, cy: number) => {
    const next = clampScale(nextScale);
    const worldX = (cx - position.x) / scale;
    const worldY = (cy - position.y) / scale;
    setScale(next);
    setPosition(clampPosition({ x: cx - worldX * next, y: cy - worldY * next }, next));
  };

  const zoomCenter = (delta: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    zoomAround(scale + delta, viewport.clientWidth / 2, viewport.clientHeight / 2);
  };


  const closeGuide = () => {
    localStorage.setItem("chateau-kingdom-guide-seen", "true");
    setShowGuide(false);
    setGuideStep(0);
  };

  const enterPlace = (place: Place) => {
    if (!place.open || !place.path) return;
    setEntering(place);
    window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      router.push(place.path!);
    }, 700);
  };

  const guideSlides = [
    { icon: <Hand />, title: "حرّك المملكة", text: "اسحب الخريطة بإصبع واحد لاستكشاف الأحياء والمناطق الجديدة." },
    { icon: <Plus />, title: "قرّب التفاصيل", text: "استخدم إصبعين للتكبير والتصغير، أو أزرار التحكم الجانبية." },
    { icon: <MousePointer2 />, title: "ادخل العوالم", text: "اضغط على المبنى نفسه لعرض معلوماته ثم ابدأ رحلتك التعليمية." }
  ];

  const saveProgress = () => {
    const payload = {
      camera: { scale, x: position.x, y: position.y },
      profile,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem("chateau-manual-save", JSON.stringify(payload));
    localStorage.setItem("chateau-world-camera-v4", JSON.stringify(payload.camera));
    setSaveMessage("تم حفظ التقدم على هذا الجهاز");
    window.setTimeout(() => setSaveMessage(""), 2200);
  };

  const changeViewMode = (mode: "map" | "classic") => {
    setViewMode(mode);
    localStorage.setItem("chateau-view-mode", mode);
    setMenuOpen(false);
  };

  const submitAuth = () => {
    if (!emailInput.trim() || !passwordInput.trim()) return;
    const nextProfile: PlayerProfile = {
      ...profile,
      name: authMode === "register" ? (nameInput.trim() || "متعلم جديد") : (profile.name || "متعلم جديد"),
      email: emailInput.trim(),
      signedIn: true
    };
    setProfile(nextProfile);
    localStorage.setItem("chateau-player-profile", JSON.stringify(nextProfile));
    setPasswordInput("");
  };

  const logout = () => {
    const next = { ...profile, signedIn: false };
    setProfile(next);
    localStorage.setItem("chateau-player-profile", JSON.stringify(next));
  };

  const chooseAvatar = (avatar: string) => {
    const next = { ...profile, avatar };
    setProfile(next);
    localStorage.setItem("chateau-player-profile", JSON.stringify(next));
  };

  const uploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const next = { ...profile, avatar: reader.result };
      setProfile(next);
      localStorage.setItem("chateau-player-profile", JSON.stringify(next));
    };
    reader.readAsDataURL(file);
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    zoomAround(scale + (event.deltaY > 0 ? -0.09 : 0.09), event.clientX - rect.left, event.clientY - rect.top);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    lastPointer.current = { x: event.clientX, y: event.clientY };
    moved.current = false;
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const active = [...pointers.current.values()];

    if (active.length === 2) {
      const distance = Math.hypot(active[0].x - active[1].x, active[0].y - active[1].y);
      if (pinchDistance.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        zoomAround(scale * (distance / pinchDistance.current), (active[0].x + active[1].x) / 2 - rect.left, (active[0].y + active[1].y) / 2 - rect.top);
      }
      pinchDistance.current = distance;
      moved.current = true;
      return;
    }

    if (lastPointer.current) {
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
      setPosition((current) => clampPosition({ x: current.x + dx, y: current.y + dy }));
      lastPointer.current = { x: event.clientX, y: event.clientY };
    }
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    pinchDistance.current = null;
    const remaining = [...pointers.current.values()];
    lastPointer.current = remaining[0] || null;
    if (!remaining.length) setDragging(false);
  };

  return (
    <main className="world-map-v4" dir="rtl">
      <header className="world-map-topbar-v4">
        <button className="world-player-v4" onClick={() => setProfileOpen(true)} aria-label="ملف اللاعب">
          <span className="world-player-avatar">{profile.avatar.startsWith("data:image") ? <img src={profile.avatar} alt="صورة اللاعب" /> : profile.avatar}</span>
          <div><strong>{profile.name}</strong><small>{profile.signedIn ? "الحساب متصل" : "اضغط لإعداد الحساب"}</small></div>
        </button>
        <div className="world-brand-v4"><Castle /><div><strong>Le Château des Langues</strong><small>مملكة تعلم الفرنسية</small></div></div>
        <button className="world-menu-v4" aria-label="القائمة" onClick={() => setMenuOpen(true)}>☰</button>
      </header>

      {viewMode === "map" ? (
      <section
        ref={viewportRef}
        className={`world-map-viewport-v4 ${dragging ? "dragging" : ""}`}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <div className="world-map-canvas-v4" style={{ width: WORLD_W, height: WORLD_H, transform }}>
          <div className="world-terrain terrain-north"><span>المرتفعات الملكية · توسعة مستقبلية</span></div>
          <div className="world-terrain terrain-west"><span>الساحل الغربي · توسعة مستقبلية</span></div>
          <div className="world-terrain terrain-east"><span>الغابات الشرقية · توسعة مستقبلية</span></div>
          <div className="world-terrain terrain-south"><span>المدينة الجديدة · توسعة مستقبلية</span></div>

          <div className="approved-city-map" style={{ left: CITY_X, top: CITY_Y, width: CITY_W, height: CITY_H }}>
            <KingdomMapLayers highDetail={scale >= 0.82} />
            <div className="kingdom-interaction-layer">
              {places.map((place) => (
                <button
                  key={place.id}
                  className={`building-hitbox ${place.open ? "open" : "soon"} ${selected?.id === place.id ? "selected" : ""}`}
                  style={{ left: place.x, top: place.y, width: place.w, height: place.h }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    moved.current = false;
                  }}
                  onPointerUp={(event) => {
                    event.stopPropagation();
                    if (!moved.current) { if (place.id === "profile") setProfileOpen(true); else setSelected(place); }
                  }}
                  onClick={(event) => event.preventDefault()}
                  aria-label={`${place.ar} ${place.fr}`}
                >
                  <span className="building-focus-ring" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="world-map-hint-v4">اسحب لاستكشاف المملكة · قرّب بإصبعين · اضغط على المبنى</div>
        <div className="world-map-controls-v4">
          <button onClick={() => zoomCenter(0.12)} aria-label="تكبير"><Plus /></button>
          <button onClick={() => zoomCenter(-0.12)} aria-label="تصغير"><Minus /></button>
          <button onClick={centerMap} aria-label="إعادة التوسيط"><RotateCcw /></button>
        </div>
        <button
          type="button"
          className={`world-compass-v4 ${compassStatus}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            if (compassStatus === "permission" || compassStatus === "denied") void requestCompassPermission();
          }}
          aria-label={compassStatus === "permission" ? "تفعيل إذن بوصلة الجهاز" : `اتجاه الجهاز: ${compassDirection}`}
          title={compassStatus === "permission" ? "يتطلب iPhone إذن الاتجاه مرة واحدة" : `اتجاه الجهاز: ${compassDirection}`}
        >
          <Compass style={{ transform: `rotate(${compassHeading === null ? 0 : -compassHeading}deg)` }} />
          <span>{compassDirection}</span>
          {compassHeading !== null && <small>{Math.round(compassHeading)}°</small>}
        </button>
      </section>
      ) : (
        <section className="classic-kingdom-page">
          <div className="classic-kingdom-hero"><Castle /><span>Vue classique</span><h1>عالم المملكة</h1><p>اختر وجهتك من الخانات الواضحة، ويمكنك العودة إلى الخريطة في أي وقت.</p></div>
          <div className="classic-place-grid">{places.map((place) => (
            <button key={place.id} className={place.open ? "open" : "soon"} onClick={() => place.open ? enterPlace(place) : setSelected(place)}>
              <span>{place.icon}</span><div><strong>{place.ar}</strong><small>{place.fr}</small><p>{place.description}</p></div>
              {place.open ? <Navigation /> : <LockKeyhole />}
            </button>
          ))}</div>
        </section>
      )}

      {menuOpen && (
        <aside className="world-nav-drawer">
          <div className="world-nav-head">
            <div><span>Navigation royale</span><h2>وجهات المملكة</h2></div>
            <button onClick={() => setMenuOpen(false)} aria-label="إغلاق"><X /></button>
          </div>
          <div className="world-nav-actions">
            <button onClick={saveProgress}><Save /><div><strong>حفظ التقدم</strong><small>حفظ يدوي على الجهاز</small></div></button>
            <button onClick={() => changeViewMode("classic")}><LayoutGrid /><div><strong>الصفحة العادية</strong><small>عرض الخانات بدل الخريطة</small></div></button>
            <button onClick={() => changeViewMode("map")}><MapIcon /><div><strong>الرجوع للخريطة</strong><small>عرض المملكة التفاعلية</small></div></button>
            <button onClick={() => setProfileOpen(true)}><UserRound /><div><strong>الملف والأفتار</strong><small>الصورة والحساب</small></div></button>
          </div>
          {saveMessage && <div className="world-save-message"><CheckCircle2 />{saveMessage}</div>}
          <label className="world-nav-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن مبنى..." /></label>
          <div className="world-nav-list">
            {filteredPlaces.map((place) => (
              <button key={place.id} onClick={() => focusPlace(place)} className={place.open ? "open" : "soon"}>
                <span>{place.icon}</span>
                <div><strong>{place.ar}</strong><small>{place.fr}</small></div>
                {place.open ? <Navigation /> : <LockKeyhole />}
              </button>
            ))}
          </div>
        </aside>
      )}

      {menuOpen && <button className="world-nav-overlay" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة" />}

      {selected && (
        <div className="world-place-backdrop" onClick={() => setSelected(null)}>
          <article className="world-place-sheet" onClick={(event) => event.stopPropagation()}>
            <button className="world-place-close" onClick={() => setSelected(null)}><X /></button>
            <div className="world-place-icon">{selected.icon}</div>
            <span>{selected.fr}</span>
            <h2>{selected.ar}</h2>
            <p>{selected.description}</p>
            <div className={`world-place-state ${selected.open ? "open" : "soon"}`}><MapPin /> {selected.open ? "متاح الآن" : "سيُفتح قريبًا"}</div>
            <button className="world-enter-button" disabled={!selected.open || !selected.path} onClick={() => enterPlace(selected)}>
              {selected.open ? "دخول المكان" : "قريبًا"}
            </button>
          </article>
        </div>
      )}

      {profileOpen && (
        <div className="profile-modal-backdrop" onClick={() => setProfileOpen(false)}>
          <section className="profile-modal" onClick={(event) => event.stopPropagation()}>
            <button className="profile-modal-close" onClick={() => setProfileOpen(false)}><X /></button>
            <div className="profile-avatar-large">{profile.avatar.startsWith("data:image") ? <img src={profile.avatar} alt="صورة اللاعب" /> : profile.avatar}</div>
            <span>Profil du joueur</span><h2>ملف اللاعب</h2>
            <div className="avatar-choice-grid">{avatarOptions.map((avatar) => <button key={avatar.id} className={profile.avatar === avatar.value ? "active" : ""} onClick={() => chooseAvatar(avatar.value)}><b>{avatar.value}</b><small>{avatar.label}</small></button>)}</div>
            <label className="avatar-upload"><ImagePlus /><span>إضافة صورة من الاستديو</span><input type="file" accept="image/*" onChange={uploadAvatar} /></label>
            {!profile.signedIn ? (
              <div className="local-auth-box">
                <div className="auth-tabs"><button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>تسجيل الدخول</button><button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>إنشاء حساب</button></div>
                {authMode === "register" && <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="اسم اللاعب" />}
                <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} type="email" placeholder="البريد الإلكتروني" />
                <input value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} type="password" placeholder="كلمة المرور" />
                <button className="auth-submit" onClick={submitAuth}><LogIn />{authMode === "login" ? "دخول" : "إنشاء الحساب"}</button>
                <small>الحساب في هذا الإصدار محفوظ محليًا على الجهاز.</small>
              </div>
            ) : (
              <div className="signed-profile"><CheckCircle2 /><div><strong>{profile.name}</strong><small>{profile.email}</small></div><button onClick={logout}><LogOut />تسجيل الخروج</button></div>
            )}
          </section>
        </div>
      )}

      {showGuide && (
        <div className="kingdom-guide-backdrop">
          <section className="kingdom-guide-card">
            <button className="kingdom-guide-skip" onClick={closeGuide}>تخطي</button>
            <div className="kingdom-guide-icon">{guideSlides[guideStep].icon}</div>
            <span>مرحبًا بك في المملكة</span>
            <h2>{guideSlides[guideStep].title}</h2>
            <p>{guideSlides[guideStep].text}</p>
            <div className="kingdom-guide-dots">
              {guideSlides.map((_, index) => <i key={index} className={index === guideStep ? "active" : ""} />)}
            </div>
            <button className="kingdom-guide-next" onClick={() => guideStep < guideSlides.length - 1 ? setGuideStep((v) => v + 1) : closeGuide()}>
              {guideStep < guideSlides.length - 1 ? <>التالي <ChevronLeft /></> : <>ابدأ الاستكشاف <Sparkles /></>}
            </button>
          </section>
        </div>
      )}

      {entering && (
        <div className="world-entry-transition">
          <div className="world-entry-emblem">{entering.icon}</div>
          <span>{entering.fr}</span>
          <h2>{entering.ar}</h2>
          <div className="world-entry-loader"><i /></div>
        </div>
      )}

    </main>
  );
}
