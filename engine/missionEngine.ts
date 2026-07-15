import type { MissionStep } from "./types";

export const cafeMissionSteps: MissionStep[] = [
  { id: "greet", titleAr: "الدخول", titleFr: "Saluer", objectiveAr: "رحّب بالشخصية بطريقة طبيعية." },
  { id: "order", titleAr: "الطلب", titleFr: "Commander", objectiveAr: "افهم الطلب وحدد العناصر المطلوبة." },
  { id: "seat", titleAr: "الجلوس", titleFr: "S'asseoir", objectiveAr: "تعلم طلب مكان أو طاولة." },
  { id: "talk", titleAr: "الحديث", titleFr: "Discuter", objectiveAr: "واصل الحوار باختيار الرد المناسب." },
  { id: "pay", titleAr: "الدفع", titleFr: "Payer", objectiveAr: "أنه المهمة بعد تنفيذ الطلب الصحيح." }
];

export function clampMissionIndex(index: number, total: number) {
  return Math.max(0, Math.min(index, Math.max(0, total - 1)));
}