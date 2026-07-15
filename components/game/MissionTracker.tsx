"use client";

import type { MissionStep } from "@/engine/types";

type Props = {
  steps: MissionStep[];
  activeIndex: number;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (index: number) => void;
};

export default function MissionTracker({
  steps,
  activeIndex,
  expanded,
  onToggle,
  onSelect
}: Props) {
  const active = steps[activeIndex] ?? steps[0];

  return (
    <section className="royal-mission-strip" aria-label="خريطة مهام المقهى">
      <div>
        <span>Royal Game Engine · v2.1</span>
        <h2>رحلة المقهى</h2>
      </div>

      <div className="mission-nodes">
        {steps.map((step, index) => (
          <button
            key={step.id}
            className={index < activeIndex ? "done" : index === activeIndex ? "active" : ""}
            onClick={() => index <= activeIndex && onSelect(index)}
          >
            <b>{index < activeIndex ? "✓" : index + 1}</b>
            <span>{step.titleAr}<small>{step.titleFr}</small></span>
          </button>
        ))}
      </div>

      <button className="mission-toggle" onClick={onToggle}>
        {expanded ? "إخفاء تفاصيل المهمة" : "عرض تفاصيل المهمة"}
      </button>

      {expanded && active && (
        <div className="mission-brief">
          <strong>المهمة الحالية: {active.titleAr}</strong>
          <p>{active.objectiveAr}</p>
        </div>
      )}
    </section>
  );
}