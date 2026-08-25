import type {GrammarLesson} from "../grammarData";

export const a1TimeAndTenses:GrammarLesson[]=[
 {id:"futur-proche",number:27,titleFr:"Le futur proche",titleAr:"المستقبل القريب",category:"الزمن",summary:"التحدث عن خطة أو حدث سيقع قريبًا.",rule:"نصرّف aller في الحاضر بحسب الفاعل، ثم نضع الفعل الذي يعبّر عن الحدث في المصدر.",formula:"Sujet + aller au présent + Infinitif",examples:[
  {fr:"Je vais appeler le médecin.",ar:"سأتصل بالطبيب.",parts:[{text:"Je",role:"subject"},{text:"vais",role:"verb"},{text:"appeler le médecin",role:"object"}]},
  {fr:"Nous allons visiter le musée demain.",ar:"سنزور المتحف غدًا.",parts:[{text:"Nous",role:"subject"},{text:"allons",role:"verb"},{text:"visiter le musée demain",role:"object"}]},
  {fr:"Ils vont prendre le train.",ar:"سيستقلون القطار.",parts:[{text:"Ils",role:"subject"},{text:"vont",role:"verb"},{text:"prendre le train",role:"object"}]}
 ],correct:"Elle va préparer le dîner.",correctAr:"ستحضّر العشاء.",incorrect:"Elle va prépare le dîner.",incorrectReason:"بعد aller المصرف يأتي الفعل الثاني في المصدر préparer.",note:"الفعل بعد aller يبقى في المصدر: va partir، allons manger، vont arriver."},
 {id:"polite-conditional",number:28,titleFr:"Le conditionnel de politesse",titleAr:"صيغ الطلب المهذب",category:"التواصل",summary:"طلب شيء أو خدمة بلطف باستعمال صيغ محفوظة شائعة في A1.",rule:"في A1 نتعلم صيغًا مهذبة جاهزة مثل je voudrais، j’aimerais وpourriez-vous من دون دراسة تصريف الشرط كاملًا. يلي je voudrais وj’aimerais اسم أو فعل في المصدر.",formula:"Je voudrais… · J’aimerais… · Pourriez-vous… ?",examples:[
  {fr:"Je voudrais un café, s’il vous plaît.",ar:"أود قهوة، من فضلك.",parts:[{text:"Je",role:"subject"},{text:"voudrais",role:"verb"},{text:"un café",role:"object"},{text:"s’il vous plaît",role:"marker"}]},
  {fr:"J’aimerais réserver une chambre.",ar:"أرغب في حجز غرفة.",parts:[{text:"J’",role:"subject"},{text:"aimerais",role:"verb"},{text:"réserver une chambre",role:"object"}]},
  {fr:"Pourriez-vous répéter, s’il vous plaît ?",ar:"هل يمكنكم إعادة ما قلتم، من فضلكم؟",parts:[{text:"Pourriez",role:"verb"},{text:"-vous",role:"subject"},{text:"répéter",role:"object"},{text:"s’il vous plaît",role:"marker"}]}
 ],correct:"Nous voudrions deux billets.",correctAr:"نود تذكرتين.",incorrect:"Nous voudrais deux billets.",incorrectReason:"الصيغة المهذبة الموافقة لـ nous هي voudrions، لا voudrais.",note:"هذه صيغ تهذيب عملية تُحفظ كما هي في A1؛ أما بناء زمن الشرط وتصريفاته كاملة فيأتي في مستوى لاحق."},
 {id:"time-date-duration",number:29,titleFr:"L’heure, la date et la durée",titleAr:"الوقت والتاريخ والمدة",category:"الزمن",summary:"تحديد الساعة واليوم والتاريخ ومدة النشاط.",rule:"نقول Il est للسؤال عن الساعة، ونستعمل à لموعد محدد، le مع أيام العادة أو التاريخ، en مع الشهر أو السنة والفصل، وpendant لمدة محددة.",formula:"Il est… · à + heure · le + jour/date · en + mois/année · pendant + durée",examples:[
  {fr:"Le cours commence à dix heures.",ar:"يبدأ الدرس الساعة العاشرة.",parts:[{text:"Le cours",role:"subject"},{text:"commence",role:"verb"},{text:"à dix heures",role:"object"}]},
  {fr:"Nous sommes le quinze mars.",ar:"اليوم هو الخامس عشر من مارس.",parts:[{text:"Nous",role:"subject"},{text:"sommes",role:"verb"},{text:"le quinze mars",role:"object"}]},
  {fr:"Elle travaille pendant deux heures.",ar:"تعمل لمدة ساعتين.",parts:[{text:"Elle",role:"subject"},{text:"travaille",role:"verb"},{text:"pendant deux heures",role:"object"}]}
 ],correct:"Je voyage en juillet.",correctAr:"أسافر في شهر يوليو.",incorrect:"Je voyage à juillet.",incorrectReason:"مع أسماء الشهور نستخدم en: en juillet.",note:"نقول lundi لحدث يقع يوم الاثنين، وle lundi لحدث معتاد يتكرر كل يوم اثنين."}
];
