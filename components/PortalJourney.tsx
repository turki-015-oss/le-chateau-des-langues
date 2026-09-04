"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

type PortalPlace = {
  id: string;
  fr: string;
  ar: string;
  image: string;
};

const places: Record<string, PortalPlace> = {
  castle: { id: "castle", fr: "LE CHÂTEAU", ar: "القلعة", image: "/kingdom-portal-assets/castle-facade.png" },
  university: { id: "university", fr: "UNIVERSITÉ", ar: "الجامعة", image: "/kingdom-portal-assets/university-campus-v2.webp" },
  library: { id: "library", fr: "BIBLIOTHÈQUE", ar: "المكتبة", image: "/kingdom-portal-assets/library-facade.png" },
  hospital: { id: "hospital", fr: "HÔPITAL", ar: "المستشفى", image: "/kingdom-portal-assets/destination-hospital.png" },
  airport: { id: "airport", fr: "AÉROPORT", ar: "المطار", image: "/kingdom-portal-assets/destination-airport.png" },
  station: { id: "station", fr: "GARE", ar: "محطة القطار", image: "/kingdom-portal-assets/destination-station.png" },
  market: { id: "market", fr: "MARCHÉ", ar: "السوق الكبير", image: "/kingdom-portal-assets/destination-market.png" },
  cafe: { id: "cafe", fr: "CAFÉ", ar: "المقهى", image: "/kingdom-portal-assets/destination-cafe-v2.webp" },
  restaurant: { id: "restaurant", fr: "RESTAURANT", ar: "المطعم", image: "/kingdom-portal-assets/destination-restaurant-v2.webp" },
  police: { id: "police", fr: "COMMISSARIAT", ar: "مركز الشرطة", image: "/kingdom-portal-assets/destination-police-v2.webp" },
  zoo: { id: "zoo", fr: "ZOO", ar: "حديقة الحيوانات", image: "/kingdom-portal-assets/destination-zoo-v2.webp" },
  hotel: { id: "hotel", fr: "HÔTEL", ar: "الفندق", image: "/kingdom-portal-assets/destination-hotel-v2.webp" },
  stadium: { id: "stadium", fr: "STADE", ar: "الملعب", image: "/kingdom-portal-assets/destination-stadium-v2.webp" },
  cinema: { id: "cinema", fr: "CINÉMA", ar: "صالة السينما", image: "/kingdom-portal-assets/destination-cinema-v2.webp" },
  court: { id: "court", fr: "TRIBUNAL", ar: "المحكمة", image: "/maps/facades/civic-facade.webp" },
};

function placeFromPath(pathname: string): PortalPlace | null {
  const entrance = pathname.match(/^\/entrance\/([^/]+)/)?.[1];
  if (entrance && places[entrance]) return places[entrance];
  if (pathname === "/conjugation" || pathname.startsWith("/grammar")) return places.castle;
  const segment = pathname.split("/").filter(Boolean)[0];
  return places[segment] ?? null;
}

export default function PortalJourney() {
  const pathname = usePathname();
  const router = useRouter();
  const currentPlace = useMemo(() => placeFromPath(pathname ?? "/"), [pathname]);
  const [exiting, setExiting] = useState<PortalPlace | null>(null);

  useEffect(() => {
    if (pathname !== "/kingdom") router.prefetch("/kingdom");
    if (pathname === "/kingdom") setExiting(null);
  }, [pathname, router]);

  useEffect(() => {
    const onReturn = (event: MouseEvent) => {
      if (!currentPlace || exiting || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : null;
      const trigger = target?.closest<HTMLElement>("[data-portal-return],a[href]");
      if (!trigger) return;

      const href = trigger instanceof HTMLAnchorElement ? new URL(trigger.href, window.location.href) : null;
      if (!trigger.hasAttribute("data-portal-return") && href?.pathname !== "/kingdom") return;

      event.preventDefault();
      sessionStorage.setItem("castle-portal-return", currentPlace.id);
      setExiting(currentPlace);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const currentParams = new URLSearchParams(window.location.search);
      const returnParams = new URLSearchParams({ return: currentPlace.id });
      const portalRail = currentParams.get("portalRail");
      const portalPage = currentParams.get("portalPage");
      if (portalRail !== null) returnParams.set("rail", portalRail);
      if (portalPage !== null) returnParams.set("page", portalPage);
      if (portalRail !== null || portalPage !== null) {
        sessionStorage.setItem("castle-portal-view", JSON.stringify({
          id: currentPlace.id,
          railX: portalRail === null ? 0 : Number(portalRail),
          pageY: portalPage === null ? 0 : Number(portalPage),
        }));
      }
      window.setTimeout(() => router.push(`/kingdom?${returnParams.toString()}`), reducedMotion ? 100 : 760);
    };

    document.addEventListener("click", onReturn, true);
    return () => document.removeEventListener("click", onReturn, true);
  }, [currentPlace, exiting, router]);

  if (!exiting) return null;

  return (
    <div className="portal-return-overlay" role="status" aria-live="polite" aria-label={`العودة من ${exiting.ar} إلى القلعة`}>
      <div className="portal-return-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => <i key={index} style={{ "--return-i": index } as React.CSSProperties} />)}
      </div>
      <div className="portal-return-window" aria-hidden="true">
        <i className="portal-return-ring" />
        <span style={{ backgroundImage: `url('${exiting.image}')` }} />
        <Sparkles />
      </div>
      <div className="portal-return-copy">
        <ArrowRight />
        <strong>RETOUR AU CHÂTEAU</strong>
        <small>العودة إلى واجهة القلعة</small>
      </div>
    </div>
  );
}
