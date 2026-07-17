"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  { id: "university", fr: "L'Université", ar: "الجامعة", description: "الدراسة والمحاضرات والحياة الجامعية", x: 95, y: 105, w: 205, h: 245, open: false, icon: <GraduationCap /> },
  { id: "stadium", fr: "Le Stade", ar: "ملعب كرة القدم", description: "المباريات والتدريب والإعلام الرياضي", x: 745, y: 170, w: 225, h: 210, open: false, icon: <Trophy /> },
  { id: "cafe", fr: "Chez Luc", ar: "المقهى", description: "التحية والجلوس والطلب والدفع", x: 70, y: 385, w: 245, h: 185, path: "/cafe", open: true, icon: <Coffee /> },
  { id: "restaurant", fr: "Le Restaurant", ar: "المطعم", description: "الحجز والقائمة والطلب والشكوى", x: 760, y: 370, w: 220, h: 180, open: false, icon: <Utensils /> },
  { id: "market", fr: "Le Grand Marché", ar: "السوق الكبير", description: "الشراء والأسعار والتفاوض", x: 55, y: 585, w: 275, h: 195, path: "/market", open: true, icon: <ShoppingBasket /> },
  { id: "court", fr: "Le Tribunal Royal", ar: "المحكمة الملكية", description: "القضايا والشهادة واللغة الرسمية", x: 455, y: 620, w: 215, h: 185, path: "/court", open: true, icon: <Scale /> },
  { id: "hospital", fr: "L'Hôpital", ar: "المستشفى", description: "الأعراض والمواعيد وطلب المساعدة", x: 665, y: 520, w: 205, h: 190, open: false, icon: <Building2 /> },
  { id: "zoo", fr: "Le Zoo", ar: "حديقة الحيوانات", description: "الحيوانات والطبيعة والاستكشاف", x: 850, y: 680, w: 150, h: 175, open: false, icon: <Trees /> },
  { id: "library", fr: "La Bibliothèque", ar: "المكتبة", description: "القراءة والبحث والمفردات", x: 65, y: 790, w: 245, h: 185, open: false, icon: <BookOpen /> },
  { id: "police", fr: "Le Commissariat", ar: "مركز الشرطة", description: "المواقف الأمنية وطلب المساعدة", x: 355, y: 785, w: 280, h: 200, path: "/police", open: true, icon: <Landmark /> },
  { id: "hotel", fr: "L'Hôtel", ar: "الفندق", description: "الحجز والاستقبال والإقامة", x: 665, y: 760, w: 220, h: 190, open: false, icon: <Hotel /> },
  { id: "airport", fr: "L'Aéroport", ar: "المطار", description: "السفر والجوازات والرحلات", x: 45, y: 1035, w: 300, h: 195, path: "/airport", open: true, icon: <Plane /> },
  { id: "station", fr: "La Gare", ar: "محطة القطار", description: "التذاكر والمواعيد والوجهات", x: 700, y: 1025, w: 275, h: 220, open: false, icon: <Train /> },
  { id: "palace", fr: "Le Château", ar: "القلعة الملكية", description: "قلب المملكة وقاعات التعلّم الملكية", x: 330, y: 75, w: 365, h: 425, path: "/castle", open: true, icon: <Castle /> }
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

const ART_W = 1024;
const ART_H = 1346;
const WORLD_W = 3200;
const WORLD_H = 4200;
const CITY_X = 1088;
const CITY_Y = 1260;
const CITY_W = 1024;
const CITY_H = 1346;
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
        <div className="world-progress-v4"><span>تقدم المملكة</span><div><i style={{ width: "25%" }} /></div><b>25%</b></div>
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
                  if (!moved.current) setSelected(place);
                }}
                onClick={(event) => event.preventDefault()}
                aria-label={`${place.ar} ${place.fr}`}
              >
                <span className="building-focus-ring" />
              </button>
            ))}
          </div>
        </div>

        <div className="world-map-hint-v4">اسحب لاستكشاف المملكة · قرّب بإصبعين · اضغط على المبنى</div>
        <div className="world-map-controls-v4">
          <button onClick={() => zoomCenter(0.12)} aria-label="تكبير"><Plus /></button>
          <button onClick={() => zoomCenter(-0.12)} aria-label="تصغير"><Minus /></button>
          <button onClick={centerMap} aria-label="إعادة التوسيط"><RotateCcw /></button>
        </div>
        <div className="world-compass-v4"><Compass /><span>الشمال</span></div>
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
            <div className={`world-place-state ${selected.open ? "open" : "soon"}`}><MapPin /> {selected.open ? "العالم مفتوح الآن" : "سيُفتح قريبًا"}</div>
            <button className="world-enter-button" disabled={!selected.open || !selected.path} onClick={() => enterPlace(selected)}>
              {selected.open ? "دخول العالم" : "قريبًا"}
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
