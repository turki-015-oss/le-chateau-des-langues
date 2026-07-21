import { notFound } from "next/navigation";
import WorldEntrance from "../../../components/WorldEntrance";

const worlds: Record<string,{titleFr:string;titleAr:string;subtitle:string;image:string;destination:string}> = {
 cafe:{titleFr:"Le Café",titleAr:"المقهى",subtitle:"المشروبات والمعجنات والمحادثة اليومية",image:"/worlds/cafe.png",destination:"/cafe"},
 castle:{titleFr:"Le Château",titleAr:"القلعة",subtitle:"تعلّم باحترافية",image:"/images/castle-v65/entry-scene.jpg",destination:"/castle"},
 police:{titleFr:"Le Commissariat",titleAr:"مركز الشرطة",subtitle:"الضباط والتقارير والسلامة",image:"/worlds/police.png",destination:"/police"},
 airport:{titleFr:"L’Aéroport",titleAr:"المطار",subtitle:"السفر والجوازات والرحلات الجوية",image:"/worlds/airport.png",destination:"/airport"},
 station:{titleFr:"La Gare",titleAr:"محطة القطار",subtitle:"التذاكر والمواعيد والوجهات",image:"/worlds/station.png",destination:"/station"},
 university:{titleFr:"L’Université",titleAr:"الجامعة",subtitle:"الدروس والمحاضرات والطلاب",image:"/worlds/university.png",destination:"/university"},
 stadium:{titleFr:"Le Stade",titleAr:"الملعب",subtitle:"المباريات والجمهور والرياضة",image:"/worlds/stadium.png",destination:"/stadium"},
 restaurant:{titleFr:"Le Restaurant",titleAr:"المطعم",subtitle:"الطعام والطلبات والمحادثة",image:"/worlds/restaurant.png",destination:"/restaurant"},
 market:{titleFr:"Le Marché",titleAr:"السوق",subtitle:"التسوق والأسعار والمفردات اليومية",image:"/worlds/market.png",destination:"/market"},
 library:{titleFr:"La Bibliothèque",titleAr:"المكتبة",subtitle:"الكتب والقراءة والهدوء",image:"/worlds/library.png",destination:"/library"},
 hotel:{titleFr:"L’Hôtel",titleAr:"الفندق",subtitle:"الحجز والغرف والاستقبال",image:"/worlds/hotel.png",destination:"/hotel"},
 zoo:{titleFr:"Le Zoo",titleAr:"حديقة الحيوانات",subtitle:"الحيوانات والطبيعة والاكتشاف",image:"/worlds/zoo.png",destination:"/zoo"}
};
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params; const w=worlds[slug]; if(!w) notFound(); return <WorldEntrance {...w}/>}
