"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import styles from "./page.module.css";

type Guide = {
  id: string; ar: string; fr: string;
  items: { ar: string; fr: string }[];
  links: { href: string; ar: string; fr: string }[];
};

// Display windows into the approved concept artwork; labels remain real text.
const artwork: Record<string, [number, number, number, number]> = {
  start: [478, 522, 289, 293], app: [101, 521, 285, 295],
  study: [478, 965, 289, 289], review: [99, 965, 286, 289],
  controls: [280, 1390, 293, 294],
};

export default function GrandHall({ guides }: { guides: Guide[] }) {
  const [active, setActive] = useState<Guide | null>(null);
  const [dragY, setDragY] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    if (!active || !dialog.current) return;
    const element = dialog.current;
    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow, rootOverflow: root.style.overflow, scrollBehavior: root.style.scrollBehavior };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    element.showModal();
    return () => {
      if (element.open) element.close();
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      root.style.overflow = previous.rootOverflow;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      opener.current?.focus({ preventScroll: true });
      root.style.scrollBehavior = previous.scrollBehavior;
    };
  }, [active]);

  const close = () => { setActive(null); setDragY(0); dragStart.current = null; };
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 700px), (pointer: coarse) and (max-width: 1100px)").matches || !event.isPrimary || event.button !== 0) return;
    dragStart.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientY - dragStart.current;
    dragStart.current = null;
    setDragY(0);
    if (distance > 80) close();
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.back} href="/castle" aria-label="العودة إلى قاعات القلعة"><ArrowRight aria-hidden="true" /></Link>
        <span className={styles.brand} lang="fr" dir="ltr">Le Château</span>
      </header>
      <section className={styles.content} aria-labelledby="grand-hall-title">
        <div className={styles.intro}>
          <h1 id="grand-hall-title">القاعة الكبرى</h1>
          <p lang="fr" dir="ltr">La Grande Salle</p>
          <span>كيف تتعلم ومن أين تبدأ</span>
          <span lang="fr" dir="ltr">Comment apprendre et par où commencer</span>
        </div>
        <div className={styles.grid}>
          {guides.map(guide => {
            const [x,y,w,h] = artwork[guide.id];
            const crop = { "--art-width": `${864 / w * 100}%`, "--art-height": `${1821 / h * 100}%`, "--art-left": `${-x / w * 100}%`, "--art-top": `${-y / h * 100}%` } as CSSProperties;
            return <button type="button" className={styles.app} key={guide.id} data-guide={guide.id} aria-haspopup="dialog" aria-expanded={active?.id === guide.id} aria-controls="guide-dialog" onClick={event => { opener.current = event.currentTarget; setActive(guide); }}>
              <span className={styles.art} style={crop} aria-hidden="true"><img src="/grand-hall-assets/guide-artwork.webp" alt="" width={864} height={1821} draggable={false} /></span>
              <span className={styles.label}><strong>{guide.ar}</strong><span lang="fr" dir="ltr">{guide.fr}</span></span>
            </button>;
          })}
        </div>
      </section>
      <dialog id="guide-dialog" className={styles.dialog} ref={dialog} aria-labelledby="guide-title" style={{ "--drag-y": `${dragY}px` } as CSSProperties} onCancel={event => { event.preventDefault(); close(); }} onClick={event => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      }}>
        {active && <>
          <div className={styles.grip} aria-hidden="true" onPointerDown={startDrag} onPointerMove={event => { if (dragStart.current !== null) setDragY(Math.max(0, event.clientY - dragStart.current)); }} onPointerUp={endDrag} onPointerCancel={() => { dragStart.current = null; setDragY(0); }}><span /></div>
          <header className={styles.panelHeader}>
            <div><h2 id="guide-title">{active.ar}</h2><p lang="fr" dir="ltr">{active.fr}</p></div>
            <button type="button" className={styles.close} onClick={close} aria-label="إغلاق التعليمات" autoFocus><X aria-hidden="true" /></button>
          </header>
          <div className={styles.instructions}>
            <ol>{active.items.map((item,index) => <li key={index}><p>{item.ar}</p><p lang="fr" dir="ltr">{item.fr}</p></li>)}</ol>
            <div className={styles.links}>{active.links.map(link => <Link key={link.href} href={link.href} onClick={close}><span>{link.ar}</span><span lang="fr" dir="ltr">{link.fr}</span></Link>)}</div>
          </div>
        </>}
      </dialog>
    </main>
  );
}
