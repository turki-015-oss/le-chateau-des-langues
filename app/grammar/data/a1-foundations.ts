import type {GrammarLesson} from "../grammarData";

export const a1Foundations:GrammarLesson[]=[
 {id:"sentence",number:1,titleFr:"La phrase simple",titleAr:"الجملة الفرنسية البسيطة",category:"أساس الجملة",summary:"بناء جملة مثبتة قصيرة وواضحة بالترتيب الفرنسي الطبيعي.",rule:"تبدأ الجملة الفرنسية البسيطة غالبًا بفاعل، ثم فعل مصرّف، ثم مكمّل يوضح المعنى. يتغير شكل الفعل بحسب الفاعل.",formula:"Sujet + Verbe + Complément",examples:[
  {fr:"Je parle français.",ar:"أتحدث الفرنسية.",parts:[{text:"Je",role:"subject"},{text:"parle",role:"verb"},{text:"français",role:"object"}]},
  {fr:"Nadia habite à Paris.",ar:"تسكن نادية في باريس.",parts:[{text:"Nadia",role:"subject"},{text:"habite",role:"verb"},{text:"à Paris",role:"object"}]},
  {fr:"Les enfants jouent dans le jardin.",ar:"يلعب الأطفال في الحديقة.",parts:[{text:"Les enfants",role:"subject"},{text:"jouent",role:"verb"},{text:"dans le jardin",role:"object"}]}
 ],correct:"Nous étudions la grammaire.",correctAr:"نحن ندرس القواعد.",incorrect:"Nous la grammaire étudions.",incorrectReason:"في الجملة البسيطة يأتي الفعل المصرف بعد الفاعل، ثم يأتي المكمّل.",note:"قد يتغير الترتيب لأغراض أسلوبية، لكن ترتيب فاعل + فعل + مكمّل هو الأنسب في بداية التعلم."},
 {id:"subject-pronouns",number:2,titleFr:"Les pronoms sujets",titleAr:"ضمائر الفاعل",category:"الضمائر",summary:"اختيار الضمير الصحيح وربطه بتصريف الفعل.",rule:"ضمائر الفاعل هي je, tu, il, elle, on, nous, vous, ils, elles. يُستعمل vous للجمع أو لمخاطبة شخص واحد باحترام، ويُستعمل on كثيرًا بمعنى نحن في الحديث اليومي.",formula:"Pronom sujet + Verbe conjugué",examples:[
  {fr:"Elle travaille aujourd’hui.",ar:"هي تعمل اليوم.",parts:[{text:"Elle",role:"subject"},{text:"travaille",role:"verb"},{text:"aujourd’hui",role:"object"}]},
  {fr:"Vous parlez lentement.",ar:"أنتم تتحدثون ببطء.",parts:[{text:"Vous",role:"subject"},{text:"parlez",role:"verb"},{text:"lentement",role:"object"}]},
  {fr:"On déjeune ensemble.",ar:"نتناول الغداء معًا.",parts:[{text:"On",role:"subject"},{text:"déjeune",role:"verb"},{text:"ensemble",role:"object"}]}
 ],correct:"Ils arrivent à huit heures.",correctAr:"يصلون الساعة الثامنة.",incorrect:"Ils arrive à huit heures.",incorrectReason:"الفاعل ils جمع، لذلك نصرّف الفعل arrivent، لا arrive.",note:"يُصرّف on دائمًا مثل il وelle، حتى عندما يعني «نحن»."},
 {id:"tonic-pronouns",number:3,titleFr:"Les pronoms toniques",titleAr:"الضمائر المنفصلة",category:"الضمائر",summary:"التأكيد على الشخص واستعمال الضمير بعد حرف الجر.",rule:"الضمائر المنفصلة هي moi, toi, lui, elle, nous, vous, eux, elles. تأتي بعد حروف الجر، وبعد c’est، أو لتأكيد الشخص المقصود.",formula:"avec / pour / chez + moi, toi, lui…",examples:[
  {fr:"Tu viens avec moi ?",ar:"هل ستأتي معي؟",parts:[{text:"Tu",role:"subject"},{text:"viens",role:"verb"},{text:"avec",role:"marker"},{text:"moi",role:"object"}]},
  {fr:"Ce cadeau est pour elle.",ar:"هذه الهدية لها.",parts:[{text:"Ce cadeau",role:"subject"},{text:"est",role:"verb"},{text:"pour",role:"marker"},{text:"elle",role:"object"}]},
  {fr:"Moi, j’aime le thé.",ar:"أما أنا فأحب الشاي.",parts:[{text:"Moi",role:"subject"},{text:"j’",role:"subject"},{text:"aime",role:"verb"},{text:"le thé",role:"object"}]}
 ],correct:"Nous allons chez eux.",correctAr:"نذهب إلى منزلهم.",incorrect:"Nous allons chez ils.",incorrectReason:"بعد chez نستخدم الضمير المشدد eux، لا ضمير الفاعل ils.",note:"بعد حرف الجر لا نستعمل ضمير الفاعل il أو ils، بل lui أو eux."},
 {id:"articles",number:4,titleFr:"Les articles définis et indéfinis",titleAr:"أدوات التعريف والتنكير",category:"الأسماء",summary:"التمييز بين الاسم المعروف والاسم غير المحدد.",rule:"نستعمل le, la, l’, les عندما يكون الاسم معروفًا أو نتحدث عنه بصفة عامة، ونستعمل un, une, des عند تقديم شيء غير محدد. تتحول le وla إلى l’ قبل صوت متحرك أو h صامت.",formula:"le / la / l’ / les — un / une / des",examples:[
  {fr:"J’ouvre la fenêtre.",ar:"أفتح النافذة.",parts:[{text:"J’",role:"subject"},{text:"ouvre",role:"verb"},{text:"la",role:"marker"},{text:"fenêtre",role:"object"}]},
  {fr:"Il achète un livre.",ar:"يشتري كتابًا.",parts:[{text:"Il",role:"subject"},{text:"achète",role:"verb"},{text:"un",role:"marker"},{text:"livre",role:"object"}]},
  {fr:"Les chats aiment le calme.",ar:"تحب القطط الهدوء.",parts:[{text:"Les chats",role:"subject"},{text:"aiment",role:"verb"},{text:"le calme",role:"object"}]}
 ],correct:"L’école est ouverte.",correctAr:"المدرسة مفتوحة.",incorrect:"La école est ouverte.",incorrectReason:"نحذف صوت حرف العلة من الأداة قبل اسم يبدأ بصوت متحرك، فنقول l’école.",note:"الأداة تتبع الجنس النحوي للاسم، ويُحفظ الاسم معها: un livre، une table."},
 {id:"gender-number",number:5,titleFr:"Le genre et le nombre",titleAr:"المذكر والمؤنث والمفرد والجمع",category:"الأسماء",summary:"معرفة جنس الاسم وتكوين الجمع الأساسي.",rule:"لكل اسم فرنسي جنس نحوي. يُبنى الجمع غالبًا بإضافة s، وتبقى الكلمات المنتهية أصلًا بـ s أو x دون تغيير. لبعض الكلمات جموع خاصة مثل cheval → chevaux وjournal → journaux.",formula:"un étudiant → une étudiante · le livre → les livres",examples:[
  {fr:"Une étudiante française arrive.",ar:"تصل طالبة فرنسية.",parts:[{text:"Une",role:"marker"},{text:"étudiante",role:"subject"},{text:"française",role:"adjective"},{text:"arrive",role:"verb"}]},
  {fr:"Les voitures sont rouges.",ar:"السيارات حمراء.",parts:[{text:"Les voitures",role:"subject"},{text:"sont",role:"verb"},{text:"rouges",role:"adjective"}]},
  {fr:"Nous lisons deux journaux.",ar:"نقرأ صحيفتين.",parts:[{text:"Nous",role:"subject"},{text:"lisons",role:"verb"},{text:"deux journaux",role:"object"}]}
 ],correct:"Des maisons blanches.",correctAr:"منازل بيضاء.",incorrect:"Des maison blanche.",incorrectReason:"الاسم والصفة في الجمع يأخذان علامة الجمع كتابةً: maisons blanches.",note:"حرف الجمع الأخير لا يُنطق غالبًا، لكن الأداة والسياق يوضحان أن الاسم جمع."}
];
