"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Castle,
  Coffee,
  Cross,
  GraduationCap,
  Landmark,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Scale,
  Shield,
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
  subtitle: string;
  x: number;
  y: number;
  zone: "inside" | "outside";
  path?: string;
  status?: "open" | "soon";
  icon: React.ReactNode;
};

const places: Place[] = [
  { id: "palace", fr: "Le Palais Royal", ar: "القصر الملكي", subtitle: "قلب المملكة", x: 930, y: 720, zone: "inside", status: "soon", icon: <Castle /> },
  { id: "cafe", fr: "Chez Luc", ar: "المقهى", subtitle: "التحية والطلب والدفع", x: 720, y: 900, zone: "inside", path: "/cafe", status: "open", icon: <Coffee /> },
  { id: "hospital", fr: "L'Hôpital", ar: "المستشفى", subtitle: "الأعراض والمواعيد", x: 1125, y: 900, zone: "inside", status: "soon", icon: <Cross /> },
  { id: "court", fr: "Le Tribunal Royal", ar: "المحكمة الملكية", subtitle: "الشهادة والأدلة", x: 1180, y: 600, zone: "inside", path: "/court", status: "open", icon: <Scale /> },
  { id: "police", fr: "La Police", ar: "الشرطة", subtitle: "البلاغات والتعليمات", x: 680, y: 610, zone: "inside", path: "/police", status: "open", icon: <Shield /> },
  { id: "market", fr: "Le Grand Marché", ar: "السوق الكبير", subtitle: "الشراء والأسعار", x: 390, y: 1070, zone: "outside", path: "/market", status: "open", icon: <ShoppingBasket /> },
  { id: "restaurant", fr: "Le Restaurant", ar: "المطعم", subtitle: "القائمة والحجز", x: 1460, y: 1090, zone: "outside", status: "soon", icon: <Utensils /> },
  { id: "university", fr: "L'Université", ar: "الجامعة", subtitle: "الدراسة والمحاضرات", x: 320, y: 410, zone: "outside", status: "soon", icon: <GraduationCap /> },
  { id: "stadium", fr: "Le Stade", ar: "ملعب كرة القدم", subtitle: "المباريات والإعلام", x: 1530, y: 390, zone: "outside", status: "soon", icon: <Trophy /> },
  { id: "zoo", fr: "Le Zoo", ar: "حديقة الحيوانات", subtitle: "الحيوانات والطبيعة", x: 1670, y: 790, zone: "outside", status: "soon", icon: <Trees /> },
  { id: "museum", fr: "Le Musée", ar: "المتحف", subtitle: "التاريخ والفنون", x: 230, y: 780, zone: "outside", status: "soon", icon: <Landmark /> }
];

const MIN_SCALE = 0.55;
const MAX_SCALE = 1.5;

export default function KingdomMapPage() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDistance = useRef<number | null>(null);

  const [scale, setScale] = useState(0.72);
  const [position, setPosition] = useState({ x: -560, y: -420 });
  const [selected, setSelected] = useState<Place | null>(null);
  const [dragging, setDragging] = useState(false);

  const clampScale = (value: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));

  const centerMap = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nextScale = viewport.clientWidth < 700 ? 0.58 : 0.78;
    setScale(nextScale);
    setPosition({
      x: viewport.clientWidth / 2 - 950 * nextScale,
      y: viewport.clientHeight / 2 - 720 * nextScale
    });
  };

  useEffect(() => {
    centerMap();
    const saved = localStorage.getItem("chateau-kingdom-map-view");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { scale: number; x: number; y: number };
        setScale(clampScale(parsed.scale));
        setPosition({ x: parsed.x, y: parsed.y });
      } catch {
        // Ignore invalid stored map state.
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(
        "chateau-kingdom-map-view",
        JSON.stringify({ scale, x: position.x, y: position.y })
      );
    }, 250);
    return () => window.clearTimeout(timer);
  }, [scale, position]);

  const transform = useMemo(
    () => `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
    [position, scale]
  );

  const zoomAtCenter = (delta: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const next = clampScale(scale + delta);
    const cx = viewport.clientWidth / 2;
    const cy = viewport.clientHeight / 2;
    const worldX = (cx - position.x) / scale;
    const worldY = (cy - position.y) / scale;
    setScale(next);
    setPosition({ x: cx - worldX * next, y: cy - worldY * next });
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const pointX = event.clientX - rect.left;
    const pointY = event.clientY - rect.top;
    const next = clampScale(scale + (event.deltaY > 0 ? -0.08 : 0.08));
    const worldX = (pointX - position.x) / scale;
    const worldY = (pointY - position.y) / scale;
    setScale(next);
    setPosition({ x: pointX - worldX * next, y: pointY - worldY * next });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    lastPointer.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const active = [...pointers.current.values()];

    if (active.length === 2) {
      const distance = Math.hypot(active[0].x - active[1].x, active[0].y - active[1].y);
      if (lastPinchDistance.current) {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const rect = viewport.getBoundingClientRect();
        const centerX = (active[0].x + active[1].x) / 2 - rect.left;
        const centerY = (active[0].y + active[1].y) / 2 - rect.top;
        const next = clampScale(scale * (distance / lastPinchDistance.current));
        const worldX = (centerX - position.x) / scale;
        const worldY = (centerY - position.y) / scale;
        setScale(next);
        setPosition({ x: centerX - worldX * next, y: centerY - worldY * next });
      }
      lastPinchDistance.current = distance;
      return;
    }

    if (active.length === 1 && lastPointer.current) {
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      setPosition((current) => ({ x: current.x + dx, y: current.y + dy }));
      lastPointer.current = { x: event.clientX, y: event.clientY };
    }
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    lastPinchDistance.current = null;
    const remaining = [...pointers.current.values()];
    lastPointer.current = remaining[0] || null;
    if (!remaining.length) setDragging(false);
  };

  const openPlace = (place: Place) => {
    setSelected(place);
  };

  const enterSelected = () => {
    if (!selected?.path || selected.status !== "open") return;
    window.location.href = selected.path;
  };

  return (
    <main className="kingdom-map-page" dir="rtl">
      <header className="kingdom-map-header">
        <Link href="/" className="kingdom-back"><ArrowRight /> العودة للمملكة</Link>
        <div>
          <span>Royaume interactif</span>
          <h1>خريطة المملكة</h1>
        </div>
        <small>اسحب بإصبعك · قرّب بإصبعين · اضغط على المباني</small>
      </header>

      <section className="kingdom-map-shell">
        <div
          ref={viewportRef}
          className={`kingdom-map-viewport ${dragging ? "is-dragging" : ""}`}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
        >
          <div className="kingdom-world-canvas" style={{ transform }}>
            <div className="map-terrain terrain-a" />
            <div className="map-terrain terrain-b" />
            <div className="map-lake"><span>Le Lac Royal</span></div>
            <div className="map-river-main" />
            <div className="city-road road-ring" />
            <div className="city-road road-horizontal" />
            <div className="city-road road-vertical" />

            <div className="outer-city city-north"><i/><i/><i/><i/><i/></div>
            <div className="outer-city city-south"><i/><i/><i/><i/><i/><i/></div>
            <div className="outer-city city-west"><i/><i/><i/><i/></div>
            <div className="outer-city city-east"><i/><i/><i/><i/><i/></div>

            <div className="castle-district">
              <div className="castle-wall wall-top" />
              <div className="castle-wall wall-bottom" />
              <div className="castle-wall wall-left" />
              <div className="castle-wall wall-right" />
              <div className="castle-tower tower-nw" />
              <div className="castle-tower tower-ne" />
              <div className="castle-tower tower-sw" />
              <div className="castle-tower tower-se" />
              <div className="castle-gate">بوابة القلعة</div>
              <div className="castle-green-core">
                <span>La Citadelle Verte</span>
                <strong>القلعة الخضراء</strong>
              </div>
            </div>

            {places.map((place) => (
              <button
                key={place.id}
                className={`kingdom-place ${place.zone} ${place.status === "open" ? "is-open" : "is-soon"}`}
                style={{ left: place.x, top: place.y }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => openPlace(place)}
                aria-label={`${place.ar} - ${place.fr}`}
              >
                <span className="place-pin"><MapPin /></span>
                <span className="place-building">{place.icon}</span>
                <strong>{place.ar}</strong>
                <small>{place.fr}</small>
              </button>
            ))}

            <div className="map-compass"><b>N</b><span>✦</span></div>
          </div>

          <div className="kingdom-map-controls">
            <button onClick={() => zoomAtCenter(0.12)} aria-label="تكبير"><Plus /></button>
            <button onClick={() => zoomAtCenter(-0.12)} aria-label="تصغير"><Minus /></button>
            <button onClick={centerMap} aria-label="إعادة توسيط"><RotateCcw /></button>
          </div>

          <div className="kingdom-map-legend">
            <span><i className="open-dot" /> متاح الآن</span>
            <span><i className="soon-dot" /> قريبًا</span>
          </div>
        </div>
      </section>

      {selected && (
        <div className="place-sheet-backdrop" onClick={() => setSelected(null)}>
          <section className="place-sheet" onClick={(event) => event.stopPropagation()}>
            <button className="place-sheet-close" onClick={() => setSelected(null)}><X /></button>
            <div className="place-sheet-icon">{selected.icon}</div>
            <span>{selected.fr}</span>
            <h2>{selected.ar}</h2>
            <p>{selected.subtitle}</p>
            <div className={`place-status ${selected.status === "open" ? "open" : "soon"}`}>
              {selected.status === "open" ? "العالم متاح للدخول" : "هذا العالم موجود على الخريطة وسيُفتح قريبًا"}
            </div>
            <button className="place-enter" disabled={selected.status !== "open"} onClick={enterSelected}>
              {selected.status === "open" ? "دخول العالم" : "قريبًا"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
