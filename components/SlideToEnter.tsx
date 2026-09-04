"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowLeft, Check } from "lucide-react";
import styles from "@/app/entry.module.css";

export default function SlideToEnter({ onEnter }: { onEnter: () => void }) {
  const [distance, setDistance] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const completed = useRef(false);
  const gesture = useRef<{ id: number; start: number; travel: number; distance: number } | null>(null);
  const unlock = () => {
    if (completed.current) return;
    completed.current = true; setUnlocked(true); onEnter();
  };
  const finish = (event: PointerEvent<HTMLButtonElement>, cancel = false) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!cancel && current.distance >= current.travel * .85) {
      setDistance(current.travel); unlock();
    } else setDistance(0);
  };
  return <button type="button" className={styles.slideEntry} data-dragging={dragging} data-unlocked={unlocked}
    style={{ "--slide-distance": `${-distance}px` } as CSSProperties}
    aria-label="الدخول: اسحب لليسار، أو اضغط Enter" aria-disabled={unlocked}
    onPointerDown={event => {
      if (completed.current || !event.isPrimary || event.button !== 0) return;
      gesture.current = { id:event.pointerId, start:event.clientX, travel:Math.max(1,event.currentTarget.clientWidth - 68), distance:0 };
      event.currentTarget.setPointerCapture(event.pointerId); setDragging(true);
    }}
    onPointerMove={event => {
      const current = gesture.current;
      if (!current || current.id !== event.pointerId) return;
      current.distance = Math.max(0,Math.min(current.travel,current.start-event.clientX));
      setDistance(current.distance);
    }}
    onPointerUp={event => finish(event)} onPointerCancel={event => finish(event,true)} onLostPointerCapture={event => finish(event,true)}
    onClick={event => { if (event.detail === 0) unlock(); }}>
    <span className={styles.slideWave} aria-hidden="true" />
    <span className={styles.slideLabel}>الدخول<small lang="fr">Entrer dans le Château</small></span>
    <span className={styles.slideThumb} aria-hidden="true">{unlocked ? <Check /> : <ArrowLeft />}</span>
  </button>;
}
