"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Building2,
  Castle,
  Coffee,
  Compass,
  GraduationCap,
  HeartPulse,
  Landmark,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Scale,
  ShoppingBasket,
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
  path?: string;
  open: boolean;
  icon: React.ReactNode;
};

const places: Place[] = [
  { id: "university", fr: "L'Université", ar: "الجامعة", description: "الدراسة والمحاضرات والحياة الجامعية", x: 730, y: 510, open: false, icon: <GraduationCap /> },
  { id: "market", fr: "Le Grand Marché", ar: "السوق الكبير", description: "الشراء والأسعار والتفاوض", x: 1425, y: 470, path: "/market", open: true, icon: <ShoppingBasket /> },
  { id: "stadium", fr: "Le Stade", ar: "ملعب كرة القدم", description: "المباريات والتدريب والإعلام", x: 2300, y: 500, open: false, icon: <Trophy /> },
  { id: "restaurant", fr: "Le Restaurant", ar: "المطعم", description: "الحجز والقائمة والطلب", x: 560, y: 1050, open: false, icon: <Utensils /> },
  { id: "hospital", fr: "L'Hôpital", ar: "المستشفى", description: "الأعراض والمواعيد وطلب المساعدة", x: 1210, y: 1090, open: false, icon: <HeartPulse /> },
  { id: "palace", fr: "Le Palais Royal", ar: "القصر الملكي", description: "قلب المملكة وقاعة الإنجازات", x: 1570, y: 820, open: false, icon: <Castle /> },
  { id: "court", fr: "Le Tribunal Royal", ar: "المحكمة الملكية", description: "القضايا والشهادة واللغة الرسمية", x: 1955, y: 1090, path: "/court", open: true, icon: <Scale /> },
  { id: "cafe", fr: "Chez Luc", ar: "المقهى", description: "التحية والجلوس والطلب والدفع", x: 1515, y: 1380, path: "/cafe", open: true, icon: <Coffee /> },
  { id: "zoo", fr: "Le Zoo", ar: "حديقة الحيوانات", description: "الحيوانات والطبيعة والاستكشاف", x: 2490, y: 1085, open: false, icon: <Trees /> },
  { id: "museum", fr: "Le Musée", ar: "المتحف", description: "التاريخ والفنون والثقافة", x: 870, y: 1580, open: false, icon: <Landmark /> },
  { id: "library", fr: "La Bibliothèque", ar: "المكتبة", description: "القراءة والبحث والمفردات", x: 2130, y: 1580, open: false, icon: <BookOpen /> },
  { id: "district", fr: "Le Quartier Nouveau", ar: "الحي الجديد", description: "مساحة توسع مستقبلية للمملكة", x: 330, y: 1820, open: false, icon: <Building2 /> }
];

const WORLD_W = 3200;
const WORLD_H = 2200;
const MIN_SCALE = 0.34;
const MAX_SCALE = 1.65;

export default function KingdomMapPage() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const pinchDistance = useRef<number | null>(null);
  const moved = useRef(false);

  const [scale, setScale] = useState(0.58);
  const [position, setPosition] = useState({ x: -760, y: -480 });
  const [selected, setSelected] = useState<Place | null>(null);
  const [dragging, setDragging] = useState(false);

  const clampScale = (value: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));

  const centerMap = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nextScale = viewport.clientWidth < 720 ? 0.48 : 0.68;
    setScale(nextScale);
    setPosition({
      x: viewport.clientWidth / 2 - 1580 * nextScale,
      y: viewport.clientHeight / 2 - 1050 * nextScale
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("chateau-world-camera-v3");
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
      localStorage.setItem("chateau-world-camera-v3", JSON.stringify({ scale, x: position.x, y: position.y }));
    }, 200);
    return () => window.clearTimeout(timer);
  }, [scale, position]);

  const transform = useMemo(
    () => `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
    [position, scale]
  );

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
        const cx = (active[0].x + active[1].x) / 2 - rect.left;
        const cy = (active[0].y + active[1].y) / 2 - rect.top;
        zoomAround(scale * (distance / pinchDistance.current), cx, cy);
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

  const openPlace = (place: Place) => {
    if (moved.current) return;
    setSelected(place);
  };

  return (
    <main className="world-map-v3" dir="rtl">
      <header className="world-map-topbar">
        <div className="world-profile">
          <div className="world-avatar"><Castle /></div>
          <div><strong>Le Château des Langues</strong><small>مملكة تعلم الفرنسية</small></div>
        </div>
        <div className="world-progress"><span>تقدم المملكة</span><div><i style={{ width: "25%" }} /></div><b>25%</b></div>
        <button className="world-menu" aria-label="القائمة">☰</button>
      </header>

      <section
        ref={viewportRef}
        className={`world-map-viewport-v3 ${dragging ? "dragging" : ""}`}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <div className="world-map-canvas-v3" style={{ width: WORLD_W, height: WORLD_H, transform }}>
          <div className="world-expansion expansion-north"><span>المرتفعات الملكية · منطقة توسع</span></div>
          <div className="world-expansion expansion-west"><span>الساحل الغربي · منطقة توسع</span></div>
          <div className="world-expansion expansion-east"><span>الغابة الشرقية · منطقة توسع</span></div>
          <div className="world-expansion expansion-south"><span>المدينة الجديدة · منطقة توسع</span></div>
          <div className="world-core-image" />

          {places.map((place) => (
            <button
              key={place.id}
              className={`world-hotspot ${place.open ? "open" : "soon"}`}
              style={{ left: place.x, top: place.y }}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => openPlace(place)}
              aria-label={`${place.ar} ${place.fr}`}
            >
              <span>{place.icon}</span>
              <i />
            </button>
          ))}
        </div>

        <div className="world-map-hint">اسحب الخريطة بإصبعك · قرّب بإصبعين · اضغط على المبنى</div>

        <div className="world-map-controls-v3">
          <button onClick={() => zoomCenter(0.12)} aria-label="تكبير"><Plus /></button>
          <button onClick={() => zoomCenter(-0.12)} aria-label="تصغير"><Minus /></button>
          <button onClick={centerMap} aria-label="إعادة التوسيط"><RotateCcw /></button>
        </div>

        <div className="world-compass-v3"><Compass /><span>الشمال</span></div>
      </section>

      {selected && (
        <div className="world-place-backdrop" onClick={() => setSelected(null)}>
          <article className="world-place-sheet" onClick={(event) => event.stopPropagation()}>
            <button className="world-place-close" onClick={() => setSelected(null)}><X /></button>
            <div className="world-place-icon">{selected.icon}</div>
            <span>{selected.fr}</span>
            <h2>{selected.ar}</h2>
            <p>{selected.description}</p>
            <div className={`world-place-state ${selected.open ? "open" : "soon"}`}>
              <MapPin /> {selected.open ? "العالم مفتوح الآن" : "سيُفتح في إصدار قادم"}
            </div>
            <button
              className="world-enter-button"
              disabled={!selected.open || !selected.path}
              onClick={() => selected.path && (window.location.href = selected.path)}
            >
              {selected.open ? "دخول العالم" : "قريبًا"}
            </button>
          </article>
        </div>
      )}
    </main>
  );
}
