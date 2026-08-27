import type {GrammarExample,GrammarLesson,GrammarRole} from "../grammarData";

export type C2Seed=[titleFr:string,titleAr:string,formula:string,sourceFr:string,sourceAr:string,targetFr:string,targetAr:string,register:string];
export type C2Unit={code:string;category:string;skill:string;seeds:C2Seed[]};

const split=(fr:string,ar:string,focus:string,role:GrammarRole="marker"):GrammarExample=>{
 const bare=fr.trim().replace(/[.!?…]+$/u,"");
 const index=bare.indexOf(focus);
 if(index<0)return{fr,ar,parts:[{text:bare,role:"object"}]};
 const before=bare.slice(0,index).trim();
 const after=bare.slice(index+focus.length).trim();
 return{fr,ar,parts:[...(before?[{text:before,role:"subject" as GrammarRole}]:[]),{text:focus,role},...(after?[{text:after,role:"object" as GrammarRole}]:[])]};
};

const slug=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

export const buildC2=(units:C2Unit[]):GrammarLesson[]=>units.flatMap((unit,unitIndex)=>unit.seeds.map((seed,seedIndex)=>{
 const [titleFr,titleAr,formula,sourceFr,sourceAr,targetFr,targetAr,register]=seed;
 const number=unitIndex*6+seedIndex+1;
 const reviewFr=`Dans l’exercice « ${titleFr} », la formulation initiale doit être examinée dans son contexte.`;
 const reviewAr=`في تمرين «${titleAr}»، يجب فحص الصياغة الأولية داخل سياقها.`;
 const metaFr=`Pour « ${titleFr} », ce choix de formulation préserve le sens, la portée et le registre attendus.`;
 const metaAr=`في درس «${titleAr}»، يحفظ هذا الاختيار في الصياغة المعنى والنطاق والسجل المطلوب.`;
 return{
  id:`c2-${unit.code}-${slug(titleFr)}`,number,titleFr,titleAr,category:unit.category,
  summary:`ينمّي هذا الدرس القدرة على ${titleAr}، مع الحفاظ على المعنى الدقيق وتكييف الصياغة مع المقام.`,
  rule:`في مستوى C2 لا تكفي السلامة النحوية وحدها؛ يجب التحكم في ${unit.skill}، ثم اختبار أثر كل اختيار في القارئ والسياق من دون إضافة معلومة غير موجودة.`,
  formula,
  examples:[split(reviewFr,reviewAr,"la formulation initiale","subject"),split(targetFr,targetAr,targetFr.split(/\s+/).slice(0,2).join(" "),"verb"),split(metaFr,metaAr,"ce choix de formulation","marker")],
  correct:targetFr,correctAr:targetAr,
  incorrect:`Pour « ${titleFr} », il suffit de remplacer quelques mots sans vérifier la portée.`,
  incorrectReason:`التبديل المعجمي وحده لا يضمن ${titleAr}؛ يجب فحص النطاق والإحالة ودرجة الالتزام والسجل.`,
  note:`قارن الصياغتين في سياقهما الكامل؛ قد تكون العبارة سليمة في مقام، لكنها غير دقيقة أو غير ملائمة في مقام آخر.`,
  rewrite:{sourceFr,sourceAr,targetFr,targetAr,register,explanation:`نقلت الصياغة الجديدة الرسالة إلى سجل ${register} مع ضبط ${unit.skill} من دون تغيير الواقعة الأساسية.`}
 };
}));
