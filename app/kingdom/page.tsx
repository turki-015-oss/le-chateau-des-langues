"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  X
} from "lucide-react";

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
  { id: "university", fr: "L'Université", ar: "الجامعة", description: "الدراسة والمحاضرات والحياة الجامعية", x: 162, y: 265, w: 250, h: 220, open: false, icon: <GraduationCap /> },
  { id: "stadium", fr: "Le Stade", ar: "ملعب كرة القدم", description: "المباريات والتدريب والإعلام الرياضي", x: 715, y: 270, w: 250, h: 215, open: false, icon: <Trophy /> },
  { id: "cafe", fr: "Chez Luc", ar: "المقهى", description: "التحية والجلوس والطلب والدفع", x: 135, y: 535, w: 235, h: 210, path: "/cafe", open: true, icon: <Coffee /> },
  { id: "restaurant", fr: "Le Restaurant", ar: "المطعم", description: "الحجز والقائمة والطلب والشكوى", x: 730, y: 515, w: 220, h: 205, open: false, icon: <Utensils /> },
  { id: "market", fr: "Le Grand Marché", ar: "السوق الكبير", description: "الشراء والأسعار والتفاوض", x: 105, y: 760, w: 260, h: 220, path: "/market", open: true, icon: <ShoppingBasket /> },
  { id: "court", fr: "Le Tribunal Royal", ar: "المحكمة الملكية", description: "القضايا والشهادة واللغة الرسمية", x: 470, y: 760, w: 235, h: 215, path: "/court", open: true, icon: <Scale /> },
  { id: "hospital", fr: "L'Hôpital", ar: "المستشفى", description: "الأعراض والمواعيد وطلب المساعدة", x: 710, y: 710, w: 220, h: 205, open: false, icon: <Building2 /> },
  { id: "zoo", fr: "Le Zoo", ar: "حديقة الحيوانات", description: "الحيوانات والطبيعة والاستكشاف", x: 820, y: 835, w: 180, h: 235, open: false, icon: <Trees /> },
  { id: "library", fr: "La Bibliothèque", ar: "المكتبة", description: "القراءة والبحث والمفردات", x: 80, y: 1005, w: 245, h: 205, open: false, icon: <BookOpen /> },
  { id: "police", fr: "Le Commissariat", ar: "مركز الشرطة", description: "المواقف الأمنية وطلب المساعدة", x: 410, y: 1030, w: 250, h: 210, path: "/police", open: true, icon: <Landmark /> },
  { id: "hotel", fr: "L'Hôtel", ar: "الفندق", description: "الحجز والاستقبال والإقامة", x: 675, y: 985, w: 250, h: 215, open: false, icon: <Hotel /> },
  { id: "airport", fr: "L'Aéroport", ar: "المطار", description: "السفر والجوازات والرحلات", x: 70, y: 1190, w: 280, h: 155, open: false, icon: <Plane /> },
  { id: "station", fr: "La Gare", ar: "محطة القطار", description: "التذاكر والمواعيد والوجهات", x: 685, y: 1175, w: 285, h: 170, open: false, icon: <Train /> },
  { id: "palace", fr: "Le Château", ar: "القلعة الملكية", description: "قلب المملكة وقاعة الإنجازات", x: 335, y: 160, w: 360, h: 470, open: false, icon: <Castle /> }
];

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const pinchDistance = useRef<number | null>(null);
  const moved = useRef(false);

  const [scale, setScale] = useState(0.62);
  const [position, setPosition] = useState({ x: -620, y: -700 });
  const [selected, setSelected] = useState<Place | null>(null);
  const [dragging, setDragging] = useState(false);

  const clampScale = (value: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));

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
    setPosition({ x: cx - worldX * next, y: cy - worldY * next });
  };

  const zoomCenter = (delta: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    zoomAround(scale + delta, viewport.clientWidth / 2, viewport.clientHeight / 2);
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
      setPosition((current) => ({ x: current.x + dx, y: current.y + dy }));
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
        <div className="world-brand-v4"><Castle /><div><strong>Le Château des Langues</strong><small>مملكة تعلم الفرنسية</small></div></div>
        <div className="world-progress-v4"><span>تقدم المملكة</span><div><i style={{ width: "25%" }} /></div><b>25%</b></div>
        <button className="world-menu-v4" aria-label="القائمة">☰</button>
      </header>

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
                className={`building-hitbox ${place.open ? "open" : "soon"}`}
                style={{ left: place.x, top: place.y, width: place.w, height: place.h }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => !moved.current && setSelected(place)}
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

      {selected && (
        <div className="world-place-backdrop" onClick={() => setSelected(null)}>
          <article className="world-place-sheet" onClick={(event) => event.stopPropagation()}>
            <button className="world-place-close" onClick={() => setSelected(null)}><X /></button>
            <div className="world-place-icon">{selected.icon}</div>
            <span>{selected.fr}</span>
            <h2>{selected.ar}</h2>
            <p>{selected.description}</p>
            <div className={`world-place-state ${selected.open ? "open" : "soon"}`}><MapPin /> {selected.open ? "العالم مفتوح الآن" : "سيُفتح قريبًا"}</div>
            <button className="world-enter-button" disabled={!selected.open || !selected.path} onClick={() => selected.path && (window.location.href = selected.path)}>
              {selected.open ? "دخول العالم" : "قريبًا"}
            </button>
          </article>
        </div>
      )}
    </main>
  );
}
