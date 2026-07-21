"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

const data:Record<string,{fr:string;ar:string;topics:string[]}>= {
 a1:{fr:'Débutant',ar:'المبتدئ',topics:['الحروف والنطق','الجنس والمفرد والجمع','أدوات التعريف والتنكير','الضمائر الشخصية','الأفعال في الحاضر (être, avoir)']},
 a2:{fr:'Les bases',ar:'الأساسيات',topics:['الماضي المركب','الماضي الناقص','المستقبل البسيط','ضمائر المفعول','المقارنة والتفضيل']},
 b1:{fr:'Intermédiaire',ar:'المتوسط',topics:['الأزمنة السردية','الشرط الحاضر','التابع الحاضر','الكلام المنقول','أدوات الربط']},
 b2:{fr:'Intermédiaire supérieur',ar:'فوق المتوسط',topics:['التابع بالتفصيل','الشرط الماضي','الجمل الشرطية المتقدمة','الضمائر الموصولة المركبة','مطابقة اسم المفعول']},
 c1:{fr:'Avancé',ar:'المتقدم',topics:['الماضي البسيط','التابع المتقدم','التقديم والتأخير','الحذف النحوي','الأسلوب الأكاديمي']},
 c2:{fr:'Maîtrise',ar:'الإتقان',topics:['الفروق الدقيقة بين الصيغ','الأسلوب الأدبي','إزالة الغموض','الإيقاع وبناء الجملة','التصحيح والتحرير']}
};
export default function GrammarLevelPage(){
 const router=useRouter(); const params=useParams<{level:string}>();
 const key=(params.level||'a1').toLowerCase(); const level=data[key]||data.a1;
 return <main className="v67-level-page" dir="rtl">
   <header><button onClick={()=>router.push('/grammar')}><ArrowLeft/></button><span>Le Château des Langues</span></header>
   <section className="v67-level-hero"><BookOpen/><p>{key.toUpperCase()}</p><h1 dir="ltr">{level.fr}</h1><h2>{level.ar}</h2></section>
   <section className="v67-level-list"><h3>الموضوعات</h3>{level.topics.map((t,i)=><article key={t}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{t}</strong><small>شرح واضح، صيغة، أمثلة صحيحة، ملاحظات وأخطاء شائعة.</small></div><ArrowLeft/></article>)}</section>
 </main>;
}
