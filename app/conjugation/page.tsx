"use client";
import {useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft,BookOpen,Search,Volume2,Star,ChevronDown} from "lucide-react";

const P=["je","tu","il / elle","nous","vous","ils / elles"];
const VERBS=['être', 'avoir', 'aller', 'faire', 'pouvoir', 'vouloir', 'devoir', 'savoir', 'venir', 'voir', 'dire', 'prendre', 'mettre', 'partir', 'sortir', 'dormir', 'lire', 'écrire', 'boire', 'croire', 'recevoir', 'vivre', 'connaître', 'naître', 'mourir', 'courir', 'tenir', 'ouvrir', 'offrir', 'attendre', 'entendre', 'répondre', 'vendre', 'perdre', 'rendre', 'descendre', 'apprendre', 'comprendre', 'surprendre', 'parler', 'aimer', 'donner', 'travailler', 'chercher', 'trouver', 'penser', 'demander', 'regarder', 'écouter', 'jouer', 'arriver', 'rester', 'entrer', 'porter', 'monter', 'passer', 'marcher', 'habiter', 'étudier', 'manger', 'commencer', 'acheter', 'appeler', 'préférer', 'espérer', 'envoyer', 'payer', 'essayer', 'nettoyer', 'employer', 'finir', 'choisir', 'réussir', 'grandir', 'grossir', 'maigrir', 'réfléchir', 'remplir', 'obéir', 'punir', 'bâtir', 'rougir', 'blanchir', 'agir', 'servir', 'sentir', 'mentir', 'couvrir', 'découvrir', 'souffrir', 'cueillir', 'accueillir', 'conduire', 'produire', 'traduire', 'construire', 'détruire', 'cuire', 'suivre', 'poursuivre', 'rire', 'sourire', 'plaire', 'taire', 'décrire', 'inscrire', 'reconnaître', 'paraître', 'apparaître', 'disparaître', 'valoir', 'falloir', 'pleuvoir', 'asseoir', 'fuir', 'conclure', 'inclure', 'exclure', 'résoudre', 'craindre', 'peindre', 'joindre', 'atteindre', 'éteindre', 'vaincre', 'convaincre', 'battre', 'rompre', 'interrompre', 'promettre', 'permettre', 'admettre', 'remettre', 'commettre', 'transmettre', 'reprendre', 'entreprendre', 'devenir', 'revenir', 'parvenir', 'prévenir', 'intervenir', 'obtenir', 'retenir', 'maintenir', 'parcourir', 'secourir', 'se lever', 'se laver', 'se coucher', 'se réveiller', "s’habiller", "se déshabiller", 'se préparer', 'se présenter', 'se reposer', 'se promener', 'se dépêcher', 'se marier', 'se souvenir', "s’appeler", "s’intéresser", "s’inquiéter", 'se sentir', 'se tromper', 'se perdre', 'se rencontrer', 'se parler', 'se voir', 'se comprendre', 'se demander', 'se servir', 'se rendre', 'se mettre', "s’arrêter", "s’amuser", 'se concentrer'];
const AR:Record<string,string>={
  "être": "يكون",
  "avoir": "يملك",
  "aller": "يذهب",
  "faire": "يفعل",
  "pouvoir": "يستطيع",
  "vouloir": "يريد",
  "devoir": "يجب عليه",
  "savoir": "يعرف",
  "venir": "يأتي",
  "voir": "يرى",
  "dire": "يقول",
  "prendre": "يأخذ",
  "mettre": "يضع",
  "partir": "يغادر",
  "sortir": "يخرج",
  "dormir": "ينام",
  "lire": "يقرأ",
  "écrire": "يكتب",
  "boire": "يشرب",
  "croire": "يعتقد",
  "recevoir": "يستقبل",
  "vivre": "يعيش",
  "connaître": "يعرف",
  "naître": "يولد",
  "mourir": "يموت",
  "courir": "يركض",
  "tenir": "يمسك",
  "ouvrir": "يفتح",
  "offrir": "يقدّم",
  "attendre": "ينتظر",
  "entendre": "يسمع",
  "répondre": "يجيب",
  "vendre": "يبيع",
  "perdre": "يفقد",
  "rendre": "يعيد",
  "descendre": "ينزل",
  "apprendre": "يتعلم",
  "comprendre": "يفهم",
  "surprendre": "يفاجئ",
  "parler": "يتحدث",
  "aimer": "يحب",
  "donner": "يعطي",
  "travailler": "يعمل",
  "chercher": "يبحث",
  "trouver": "يجد",
  "penser": "يفكر",
  "demander": "يسأل",
  "regarder": "يشاهد",
  "écouter": "يستمع",
  "jouer": "يلعب",
  "arriver": "يصل",
  "rester": "يبقى",
  "entrer": "يدخل",
  "porter": "يحمل",
  "monter": "يصعد / يركب",
  "passer": "يمر",
  "marcher": "يمشي",
  "habiter": "يسكن",
  "étudier": "يدرس",
  "manger": "يأكل",
  "commencer": "يبدأ",
  "acheter": "يشتري",
  "appeler": "يتصل",
  "préférer": "يفضّل",
  "espérer": "يأمل",
  "envoyer": "يرسل",
  "payer": "يدفع",
  "essayer": "يحاول",
  "nettoyer": "ينظف",
  "employer": "يستخدم",
  "finir": "ينهي",
  "choisir": "يختار",
  "réussir": "ينجح",
  "grandir": "يكبر",
  "grossir": "يزداد وزنه",
  "maigrir": "ينقص وزنه",
  "réfléchir": "يفكر بعمق",
  "remplir": "يملأ",
  "obéir": "يطيع",
  "punir": "يعاقب",
  "bâtir": "يبني",
  "rougir": "يحمرّ",
  "blanchir": "يبيّض",
  "agir": "يتصرف",
  "servir": "يخدم",
  "sentir": "يشعر",
  "mentir": "يكذب",
  "couvrir": "يغطي",
  "découvrir": "يكتشف",
  "souffrir": "يعاني",
  "cueillir": "يقطف",
  "accueillir": "يرحب",
  "conduire": "يقود",
  "produire": "ينتج",
  "traduire": "يترجم",
  "construire": "يبني",
  "détruire": "يدمر",
  "cuire": "يطبخ",
  "suivre": "يتبع",
  "poursuivre": "يتابع",
  "rire": "يضحك",
  "sourire": "يبتسم",
  "plaire": "يعجب",
  "taire": "يصمت",
  "décrire": "يصف",
  "inscrire": "يسجل",
  "reconnaître": "يتعرف",
  "paraître": "يبدو",
  "apparaître": "يظهر",
  "disparaître": "يختفي",
  "valoir": "يساوي",
  "falloir": "يلزم",
  "pleuvoir": "تمطر",
  "asseoir": "يجلس",
  "fuir": "يهرب",
  "conclure": "يستنتج",
  "inclure": "يشمل",
  "exclure": "يستبعد",
  "résoudre": "يحل",
  "craindre": "يخشى",
  "peindre": "يرسم",
  "joindre": "يربط",
  "atteindre": "يبلغ",
  "éteindre": "يطفئ",
  "vaincre": "يهزم",
  "convaincre": "يقنع",
  "battre": "يضرب",
  "rompre": "يكسر",
  "interrompre": "يقاطع",
  "promettre": "يعد",
  "permettre": "يسمح",
  "admettre": "يعترف",
  "remettre": "يعيد",
  "commettre": "يرتكب",
  "transmettre": "ينقل",
  "reprendre": "يستعيد",
  "entreprendre": "يتعهد",
  "devenir": "يصبح",
  "revenir": "يعود",
  "parvenir": "يصل إلى",
  "prévenir": "يحذر",
  "intervenir": "يتدخل",
  "obtenir": "يحصل على",
  "retenir": "يحتفظ",
  "maintenir": "يحافظ",
  "parcourir": "يجوب",
  "secourir": "ينقذ",
  "se lever": "يستيقظ / ينهض",
  "se laver": "يغتسل",
  "se coucher": "يذهب إلى النوم",
  "se réveiller": "يستيقظ",
  "s’habiller": "يرتدي ملابسه",
  "se déshabiller": "يخلع ملابسه",
  "se préparer": "يستعد",
  "se présenter": "يعرّف بنفسه",
  "se reposer": "يستريح",
  "se promener": "يتنزّه",
  "se dépêcher": "يسرع",
  "se marier": "يتزوج",
  "se souvenir": "يتذكّر",
  "s’appeler": "يُدعى / اسمه",
  "s’intéresser": "يهتمّ بـ",
  "s’inquiéter": "يقلق",
  "se sentir": "يشعر",
  "se tromper": "يخطئ",
  "se perdre": "يضلّ الطريق",
  "se rencontrer": "يلتقي",
  "se parler": "يتحدث بعضهم مع بعض",
  "se voir": "يرى بعضهم بعضًا",
  "se comprendre": "يفهم بعضهم بعضًا",
  "se demander": "يتساءل",
  "se servir": "يستخدم / يستعين بـ",
  "se rendre": "يتوجّه",
  "se mettre": "يبدأ / يضع نفسه",
  "s’arrêter": "يتوقف",
  "s’amuser": "يستمتع",
  "se concentrer": "يركّز",
};
const I:Record<string,{p:string[],pp:string,f:string,imp?:string}>={
"être":{p:["suis","es","est","sommes","êtes","sont"],pp:"été",f:"ser",imp:"ét"},"avoir":{p:["ai","as","a","avons","avez","ont"],pp:"eu",f:"aur",imp:"av"},"aller":{p:["vais","vas","va","allons","allez","vont"],pp:"allé",f:"ir",imp:"all"},"faire":{p:["fais","fais","fait","faisons","faites","font"],pp:"fait",f:"fer"},"pouvoir":{p:["peux","peux","peut","pouvons","pouvez","peuvent"],pp:"pu",f:"pourr"},"vouloir":{p:["veux","veux","veut","voulons","voulez","veulent"],pp:"voulu",f:"voudr"},"devoir":{p:["dois","dois","doit","devons","devez","doivent"],pp:"dû",f:"devr"},"savoir":{p:["sais","sais","sait","savons","savez","savent"],pp:"su",f:"saur"},"venir":{p:["viens","viens","vient","venons","venez","viennent"],pp:"venu",f:"viendr"},"tenir":{p:["tiens","tiens","tient","tenons","tenez","tiennent"],pp:"tenu",f:"tiendr"},"voir":{p:["vois","vois","voit","voyons","voyez","voient"],pp:"vu",f:"verr"},"dire":{p:["dis","dis","dit","disons","dites","disent"],pp:"dit",f:"dir"},"prendre":{p:["prends","prends","prend","prenons","prenez","prennent"],pp:"pris",f:"prendr"},"mettre":{p:["mets","mets","met","mettons","mettez","mettent"],pp:"mis",f:"mettr"},"partir":{p:["pars","pars","part","partons","partez","partent"],pp:"parti",f:"partir"},"sortir":{p:["sors","sors","sort","sortons","sortez","sortent"],pp:"sorti",f:"sortir"},"dormir":{p:["dors","dors","dort","dormons","dormez","dorment"],pp:"dormi",f:"dormir"},"lire":{p:["lis","lis","lit","lisons","lisez","lisent"],pp:"lu",f:"lir"},"écrire":{p:["écris","écris","écrit","écrivons","écrivez","écrivent"],pp:"écrit",f:"écrir"},"boire":{p:["bois","bois","boit","buvons","buvez","boivent"],pp:"bu",f:"boir"},"croire":{p:["crois","crois","croit","croyons","croyez","croient"],pp:"cru",f:"croir"},"recevoir":{p:["reçois","reçois","reçoit","recevons","recevez","reçoivent"],pp:"reçu",f:"recevr"},"vivre":{p:["vis","vis","vit","vivons","vivez","vivent"],pp:"vécu",f:"vivr"},"connaître":{p:["connais","connais","connaît","connaissons","connaissez","connaissent"],pp:"connu",f:"connaîtr"},"naître":{p:["nais","nais","naît","naissons","naissez","naissent"],pp:"né",f:"naîtr"},"mourir":{p:["meurs","meurs","meurt","mourons","mourez","meurent"],pp:"mort",f:"mourr"},"courir":{p:["cours","cours","court","courons","courez","courent"],pp:"couru",f:"courr"},"ouvrir":{p:["ouvre","ouvres","ouvre","ouvrons","ouvrez","ouvrent"],pp:"ouvert",f:"ouvrir"},"offrir":{p:["offre","offres","offre","offrons","offrez","offrent"],pp:"offert",f:"offrir"},"appeler":{p:["appelle","appelles","appelle","appelons","appelez","appellent"],pp:"appelé",f:"appeller"},"inquiéter":{p:["inquiète","inquiètes","inquiète","inquiétons","inquiétez","inquiètent"],pp:"inquiété",f:"inquiéter"},"souvenir":{p:["souviens","souviens","souvient","souvenons","souvenez","souviennent"],pp:"souvenu",f:"souviendr"},"attendre":{p:["attends","attends","attend","attendons","attendez","attendent"],pp:"attendu",f:"attendr"},"répondre":{p:["réponds","réponds","répond","répondons","répondez","répondent"],pp:"répondu",f:"répondr"},"apprendre":{p:["apprends","apprends","apprend","apprenons","apprenez","apprennent"],pp:"appris",f:"apprendr"},"conduire":{p:["conduis","conduis","conduit","conduisons","conduisez","conduisent"],pp:"conduit",f:"conduir"},"comprendre":{p:["comprends","comprends","comprend","comprenons","comprenez","comprennent"],pp:"compris",f:"comprendr"}};

const isPro=(v:string)=>v.startsWith("se ")||v.startsWith("s’")||v.startsWith("s'");
const baseVerb=(v:string)=>v.startsWith("se ")?v.slice(3):v.replace(/^s[’']/,"");
const stem=(v:string)=>{v=baseVerb(v);return v.endsWith("er")||v.endsWith("ir")?v.slice(0,-2):v.replace(/re$/," ").trim()};
const group=(v:string)=>{const b=baseVerb(v);return isPro(v)?"verbe pronominal":b.endsWith("er")&&b!=="aller"?"1er groupe":b.endsWith("ir")?"2e / 3e groupe":"3e groupe"};
const pres=(v:string)=>{v=baseVerb(v);return I[v]?.p||(v.endsWith("er")?[stem(v)+"e",stem(v)+"es",stem(v)+"e",stem(v)+"ons",stem(v)+"ez",stem(v)+"ent"]:v.endsWith("ir")?[stem(v)+"is",stem(v)+"is",stem(v)+"it",stem(v)+"issons",stem(v)+"issez",stem(v)+"issent"]:[stem(v)+"s",stem(v)+"s",stem(v),stem(v)+"ons",stem(v)+"ez",stem(v)+"ent"])};
const part=(v:string)=>{v=baseVerb(v);return I[v]?.pp||(v.endsWith("er")?stem(v)+"é":v.endsWith("ir")?stem(v)+"i":stem(v)+"u")};
const fs=(v:string)=>{v=baseVerb(v);return I[v]?.f||(v.endsWith("re")?v.slice(0,-1):v)};
const imp=(v:string)=>{const r=I[v]?.imp||pres(v)[3].replace(/ons$/," ").trim();return [r+"ais",r+"ais",r+"ait",r+"ions",r+"iez",r+"aient"]};
const fut=(v:string)=>["ai","as","a","ons","ez","ont"].map(x=>fs(v)+x);
const cond=(v:string)=>["ais","ais","ait","ions","iez","aient"].map(x=>fs(v)+x);
const sub=(v:string)=>{const r=pres(v)[5].replace(/ent$/," ").trim();return [r+"e",r+"es",r+"e",r+"ions",r+"iez",r+"ent"]};
const aux=(v:string)=>isPro(v)?"être":["aller","venir","partir","sortir","naître","mourir","arriver","entrer","rester","descendre","retourner","tomber"].includes(v)?"être":"avoir";
const AP={avoir:["ai","as","a","avons","avez","ont"],être:["suis","es","est","sommes","êtes","sont"]};
const AI={avoir:["avais","avais","avait","avions","aviez","avaient"],être:["étais","étais","était","étions","étiez","étaient"]};
const AF={avoir:["aurai","auras","aura","aurons","aurez","auront"],être:["serai","seras","sera","serons","serez","seront"]};
const vowel=/^[aeiouyhàâäéèêëîïôöùûü]/i;
const proPrefix=(i:number,form:string)=>{const short=vowel.test(form);return [[short?"j’":"je ",short?"m’":"me "],["tu ",short?"t’":"te "],["il / elle ",short?"s’":"se "],["nous ","nous "],["vous ","vous "],["ils / elles ",short?"s’":"se "]][i]};
const rows=(x:string[],v?:string)=>x.map((f,i)=>{if(!v||!isPro(v))return P[i]+" "+f;const [sub,ref]=proPrefix(i,f);return sub+ref+f});
const SMART:Record<string,[string,string][]>= {
"être":[["Je suis prêt pour la réunion de neuf heures.","أنا مستعد لاجتماع الساعة التاسعة."],["Tu es très patient avec les nouveaux employés.","أنت صبور جدًا مع الموظفين الجدد."],["Elle est responsable de ce projet international.","هي مسؤولة عن هذا المشروع الدولي."],["Nous sommes heureux de vous accueillir dans notre équipe.","نحن سعداء باستقبالكم في فريقنا."],["Vous êtes au bon endroit pour demander de l’aide.","أنتم في المكان المناسب لطلب المساعدة."],["Ils sont disponibles demain après-midi.","هم متاحون غدًا بعد الظهر."]],
"avoir":[["J’ai un rendez-vous chez le dentiste à midi.","لدي موعد عند طبيب الأسنان ظهرًا."],["Tu as beaucoup de courage dans les moments difficiles.","لديك شجاعة كبيرة في الأوقات الصعبة."],["Il a deux billets pour le concert de samedi.","لديه تذكرتان لحفل يوم السبت."],["Nous avons besoin de plus de temps pour terminer le rapport.","نحن بحاجة إلى وقت إضافي لإنهاء التقرير."],["Vous avez une excellente connaissance du marché local.","لديكم معرفة ممتازة بالسوق المحلية."],["Elles ont plusieurs idées pour améliorer le service.","لديهن عدة أفكار لتحسين الخدمة."]],
"faire":[["Je fais mes devoirs avant le dîner.","أنا أنجز واجباتي قبل العشاء."],["Tu fais un gâteau pour l’anniversaire de ta sœur.","أنت تصنع كعكة لعيد ميلاد أختك."],["Il fait du sport trois fois par semaine.","هو يمارس الرياضة ثلاث مرات في الأسبوع."],["Nous faisons les courses ensemble le vendredi.","نحن نتسوّق معًا يوم الجمعة."],["Vous faites un excellent travail sur ce projet.","أنتم تقومون بعمل ممتاز في هذا المشروع."],["Ils font une promenade après le déjeuner.","هم يذهبون في نزهة بعد الغداء."]],
"devoir":[["Je dois appeler le médecin avant midi.","يجب عليّ الاتصال بالطبيب قبل الظهر."],["Tu dois présenter ton passeport à l’entrée.","يجب عليك إبراز جواز سفرك عند المدخل."],["Elle doit prendre ce médicament après le repas.","يجب عليها تناول هذا الدواء بعد الوجبة."],["Nous devons respecter les règles de sécurité.","يجب علينا احترام قواعد السلامة."],["Vous devez signer le document en bas de la page.","يجب عليكم توقيع المستند أسفل الصفحة."],["Ils doivent arriver à l’aéroport deux heures avant le départ.","يجب عليهم الوصول إلى المطار قبل موعد الإقلاع بساعتين."]],
"prendre":[["Je prends le bus à sept heures pour aller au travail.","أنا أستقل الحافلة الساعة السابعة للذهاب إلى العمل."],["Tu prends toujours un café avant de commencer ta journée.","أنت تشرب دائمًا فنجان قهوة قبل أن تبدأ يومك."],["Il prend des notes pendant la réunion pour ne rien oublier.","هو يدوّن ملاحظات أثناء الاجتماع حتى لا ينسى شيئًا."],["Nous prenons le train de huit heures pour Paris.","نحن نستقل قطار الساعة الثامنة إلى باريس."],["Vous prenez la deuxième rue à droite après le feu.","أنتم تسلكون الشارع الثاني على اليمين بعد الإشارة."],["Elles prennent leur temps pour choisir une robe.","هن يأخذن وقتهن لاختيار فستان."]],
"regarder":[["Je regarde les informations chaque soir.","أنا أشاهد الأخبار كل مساء."],["Tu regardes la route pendant que tu conduis.","أنت تنظر إلى الطريق أثناء القيادة."],["Elle regarde une série française sans sous-titres.","هي تشاهد مسلسلًا فرنسيًا من دون ترجمة."],["Nous regardons les enfants jouer dans le jardin.","نحن نشاهد الأطفال وهم يلعبون في الحديقة."],["Vous regardez ce tableau avec beaucoup d’attention.","أنتم تنظرون إلى هذه اللوحة باهتمام كبير."],["Ils regardent le match dans un café près du stade.","هم يشاهدون المباراة في مقهى قرب الملعب."]],
"se lever":[["Je me lève à six heures pour aller au travail.","أنا أستيقظ الساعة السادسة للذهاب إلى العمل."],["Tu te lèves tôt quand tu as un examen.","أنت تستيقظ مبكرًا عندما يكون لديك اختبار."],["Elle se lève doucement pour ne pas réveiller son bébé.","هي تنهض بهدوء حتى لا توقظ طفلها."],["Nous nous levons avant le lever du soleil.","نحن نستيقظ قبل شروق الشمس."],["Vous vous levez dès que le réveil sonne.","أنتم تستيقظون فور رنين المنبّه."],["Ils se lèvent tard pendant les vacances.","هم يستيقظون متأخرين خلال الإجازة."]],
"se laver":[["Je me lave les mains avant de manger.","أنا أغسل يديّ قبل الأكل."],["Tu te laves le visage à l’eau froide.","أنت تغسل وجهك بالماء البارد."],["Il se lave après son entraînement.","هو يغتسل بعد تمرينه."],["Nous nous lavons rapidement avant de sortir.","نحن نغتسل بسرعة قبل الخروج."],["Vous vous lavez soigneusement les mains.","أنتم تغسلون أيديكم بعناية."],["Elles se lavent les cheveux le samedi.","هن يغسلن شعورهن يوم السبت."]],
"se coucher":[["Je me couche tôt les jours de travail.","أنا أذهب إلى النوم مبكرًا في أيام العمل."],["Tu te couches après avoir terminé ton livre.","أنت تذهب إلى النوم بعد أن تنهي كتابك."],["Elle se couche dès que les enfants dorment.","هي تذهب إلى النوم فور نوم الأطفال."],["Nous nous couchons plus tard le week-end.","نحن نذهب إلى النوم في وقت متأخر خلال عطلة نهاية الأسبوع."],["Vous vous couchez à une heure régulière.","أنتم تذهبون إلى النوم في وقت منتظم."],["Ils se couchent après le film.","هم يذهبون إلى النوم بعد الفيلم."]],
"se réveiller":[["Je me réveille sans réveil le vendredi.","أنا أستيقظ من دون منبّه يوم الجمعة."],["Tu te réveilles au bruit de la pluie.","أنت تستيقظ على صوت المطر."],["Il se réveille plusieurs fois pendant la nuit.","هو يستيقظ عدة مرات أثناء الليل."],["Nous nous réveillons de bonne humeur.","نحن نستيقظ بمزاج جيد."],["Vous vous réveillez avant vos enfants.","أنتم تستيقظون قبل أطفالكم."],["Elles se réveillent dès l’aube.","هن يستيقظن مع طلوع الفجر."]],
"s’habiller":[["Je m’habille rapidement avant de partir.","أنا أرتدي ملابسي بسرعة قبل المغادرة."],["Tu t’habilles élégamment pour la cérémonie.","أنت ترتدي ملابس أنيقة من أجل الحفل."],["Elle s’habille en noir pour le travail.","هي ترتدي ملابس سوداء للعمل."],["Nous nous habillons chaudement en hiver.","نحن نرتدي ملابس دافئة في الشتاء."],["Vous vous habillez selon le code de l’entreprise.","أنتم ترتدون الملابس وفق قواعد الشركة."],["Ils s’habillent seuls depuis cette année.","هم يرتدون ملابسهم بأنفسهم منذ هذا العام."]],
"se préparer":[["Je me prépare pour mon entretien d’embauche.","أنا أستعد لمقابلة العمل."],["Tu te prépares un café avant de sortir.","أنت تحضّر لنفسك قهوة قبل الخروج."],["Il se prépare mentalement pour la compétition.","هو يستعد ذهنيًا للمنافسة."],["Nous nous préparons à recevoir nos invités.","نحن نستعد لاستقبال ضيوفنا."],["Vous vous préparez pour un long voyage.","أنتم تستعدون لرحلة طويلة."],["Elles se préparent dans la loge.","هن يستعددن في غرفة التجهيز."]],
"se reposer":[["Je me repose une heure après le déjeuner.","أنا أستريح ساعة بعد الغداء."],["Tu te reposes mieux loin du bruit.","أنت تستريح بصورة أفضل بعيدًا عن الضوضاء."],["Elle se repose avant son service de nuit.","هي تستريح قبل مناوبتها الليلية."],["Nous nous reposons à l’ombre des arbres.","نحن نستريح في ظل الأشجار."],["Vous vous reposez après une semaine chargée.","أنتم تستريحون بعد أسبوع حافل."],["Ils se reposent dans leur chambre d’hôtel.","هم يستريحون في غرفتهم بالفندق."]],
"se promener":[["Je me promène au bord de la mer chaque matin.","أنا أتجوّل على شاطئ البحر كل صباح."],["Tu te promènes avec ton chien dans le parc.","أنت تتنزّه مع كلبك في الحديقة."],["Elle se promène dans les vieux quartiers de la ville.","هي تتجوّل في أحياء المدينة القديمة."],["Nous nous promenons après le dîner.","نحن نتنزّه بعد العشاء."],["Vous vous promenez malgré le temps frais.","أنتم تتنزّهون رغم برودة الطقس."],["Ils se promènent le long de la rivière.","هم يتنزّهون بمحاذاة النهر."]],
"se déshabiller":[["Je me déshabille dans ma chambre avant de prendre une douche.","أنا أخلع ملابسي في غرفتي قبل أن أستحم."],["Tu te déshabilles derrière le paravent de la cabine.","أنت تخلع ملابسك خلف ساتر غرفة تبديل الملابس."],["Il se déshabille rapidement après son entraînement.","هو يخلع ملابسه بسرعة بعد تمرينه."],["Nous nous déshabillons avant d’entrer dans le sauna.","نحن نخلع ملابسنا قبل دخول الساونا."],["Vous vous déshabillez dans les vestiaires réservés aux visiteurs.","أنتم تخلعون ملابسكم في غرف تبديل الملابس المخصصة للزوار."],["Elles se déshabillent pour essayer les tenues de scène.","هن يخلعن ملابسهن لتجربة أزياء العرض."]],
"se présenter":[["Je me présente au responsable dès mon arrivée.","أنا أعرّف بنفسي للمسؤول فور وصولي."],["Tu te présentes clairement au début de l’entretien.","أنت تعرّف بنفسك بوضوح في بداية المقابلة."],["Elle se présente comme la nouvelle directrice du service.","هي تعرّف بنفسها بصفتها المديرة الجديدة للقسم."],["Nous nous présentons à nos voisins autour d’un café.","نحن نعرّف بأنفسنا لجيراننا أثناء تناول القهوة."],["Vous vous présentez à l’accueil avec votre pièce d’identité.","أنتم تتوجهون إلى الاستقبال وتعرّفون بأنفسكم مع إبراز هوياتكم."],["Ils se présentent devant le jury à neuf heures précises.","هم يعرّفون بأنفسهم أمام لجنة التحكيم عند الساعة التاسعة تمامًا."]],
"se dépêcher":[["Je me dépêche pour ne pas manquer le dernier train.","أنا أسرع حتى لا يفوتني القطار الأخير."],["Tu te dépêches de terminer avant la fermeture du bureau.","أنت تسرع في الإنهاء قبل إغلاق المكتب."],["Il se dépêche parce que son vol embarque dans vingt minutes.","هو يسرع لأن الصعود إلى طائرته يبدأ بعد عشرين دقيقة."],["Nous nous dépêchons de ranger la salle avant l’arrivée des invités.","نحن نسرع في ترتيب القاعة قبل وصول الضيوف."],["Vous vous dépêchez sans oublier les consignes de sécurité.","أنتم تسرعون من دون أن تنسوا تعليمات السلامة."],["Elles se dépêchent d’acheter les billets avant qu’il n’y en ait plus.","هن يسرعن لشراء التذاكر قبل نفادها."]],
"se marier":[["Je me marie au printemps dans la ville de mon enfance.","أنا أتزوج في الربيع في مدينة طفولتي."],["Tu te maries avec la personne que tu aimes depuis longtemps.","أنت تتزوج الشخص الذي تحبه منذ زمن طويل."],["Elle se marie samedi entourée de sa famille.","هي تتزوج يوم السبت وسط عائلتها."],["Nous nous marions civilement avant la cérémonie familiale.","نحن نتزوج مدنيًا قبل الحفل العائلي."],["Vous vous mariez après plusieurs années de fiançailles.","أنتم تتزوجون بعد عدة سنوات من الخطوبة."],["Ils se marient dans une petite mairie près de la mer.","هم يتزوجون في دار بلدية صغيرة قرب البحر."]],
"se souvenir":[["Je me souviens parfaitement de notre première rencontre.","أنا أتذكر لقاءنا الأول تمامًا."],["Tu te souviens du mot de passe que nous avons choisi.","أنت تتذكر كلمة المرور التي اخترناها."],["Elle se souvient de chaque détail de son voyage au Maroc.","هي تتذكر كل تفصيل من رحلتها إلى المغرب."],["Nous nous souvenons avec émotion de notre ancien professeur.","نحن نتذكر مع التأثر معلمنا السابق."],["Vous vous souvenez de l’adresse du restaurant.","أنتم تتذكرون عنوان المطعم."],["Ils se souviennent encore des conseils de leur grand-père.","هم ما زالوا يتذكرون نصائح جدهم."]],
"s’appeler":[["Je m’appelle Turki et j’apprends le français chaque jour.","أنا اسمي تركي وأتعلم الفرنسية كل يوم."],["Tu t’appelles comment dans le jeu en ligne ?","ما اسمك في اللعبة الإلكترونية؟"],["Il s’appelle Youssef, comme son grand-père.","هو اسمه يوسف، مثل جده."],["Nous nous appelons les Explorateurs du Château.","نحن نُدعى مستكشفي القلعة."],["Vous vous appelez Monsieur Bernard, n’est-ce pas ?","اسمك السيد برنار، أليس كذلك؟"],["Elles s’appellent Lina et Salma.","هما اسمهما لينا وسلمى."]],
"s’intéresser":[["Je m’intéresse à l’histoire de la langue française.","أنا أهتم بتاريخ اللغة الفرنسية."],["Tu t’intéresses aux nouvelles technologies éducatives.","أنت تهتم بالتقنيات التعليمية الحديثة."],["Elle s’intéresse particulièrement à la littérature africaine.","هي تهتم خصوصًا بالأدب الأفريقي."],["Nous nous intéressons aux habitudes des voyageurs francophones.","نحن نهتم بعادات المسافرين الناطقين بالفرنسية."],["Vous vous intéressez à ce projet depuis sa création.","أنتم تهتمون بهذا المشروع منذ إنشائه."],["Ils s’intéressent aux résultats de l’étude scientifique.","هم يهتمون بنتائج الدراسة العلمية."]],
"s’inquiéter":[["Je m’inquiète quand mon fils rentre tard sans prévenir.","أنا أقلق عندما يعود ابني متأخرًا من دون أن يخبرني."],["Tu t’inquiètes inutilement pour un simple retard.","أنت تقلق بلا داعٍ بسبب تأخير بسيط."],["Elle s’inquiète de l’état de santé de sa mère.","هي تقلق بشأن الحالة الصحية لوالدتها."],["Nous nous inquiétons pour les voyageurs bloqués par la tempête.","نحن نقلق على المسافرين العالقين بسبب العاصفة."],["Vous vous inquiétez dès que le téléphone ne répond pas.","أنتم تقلقون بمجرد أن لا يجيب الهاتف."],["Ils s’inquiètent de la hausse rapide des prix.","هم يقلقون من الارتفاع السريع في الأسعار."]],
"se sentir":[["Je me sens plus confiant après cette formation.","أنا أشعر بثقة أكبر بعد هذا التدريب."],["Tu te sens fatigué après une longue journée de travail.","أنت تشعر بالتعب بعد يوم عمل طويل."],["Elle se sent en sécurité auprès de sa famille.","هي تشعر بالأمان بجانب عائلتها."],["Nous nous sentons prêts à relever ce défi.","نحن نشعر بأننا مستعدون لخوض هذا التحدي."],["Vous vous sentez mieux depuis que vous dormez suffisamment.","أنتم تشعرون بتحسن منذ أن أصبحتم تنامون وقتًا كافيًا."],["Elles se sentent libres de donner leur opinion.","هن يشعرن بحرية إبداء آرائهن."]],
"se tromper":[["Je me trompe parfois de sortie sur cette autoroute.","أنا أخطئ أحيانًا في اختيار المخرج على هذا الطريق السريع."],["Tu te trompes de numéro en appelant l’ancien bureau.","أنت تخطئ في الرقم عندما تتصل بالمكتب القديم."],["Il se trompe rarement dans ses calculs.","هو نادرًا ما يخطئ في حساباته."],["Nous nous trompons lorsque nous jugeons trop vite.","نحن نخطئ عندما نحكم بسرعة كبيرة."],["Vous vous trompez sur la date de la réunion.","أنتم مخطئون بشأن تاريخ الاجتماع."],["Ils se trompent de quai et montent dans le mauvais train.","هم يخطئون في الرصيف ويصعدون إلى القطار الخطأ."]],
"se perdre":[["Je me perds facilement dans les ruelles de la vieille ville.","أنا أضل الطريق بسهولة في أزقة المدينة القديمة."],["Tu te perds dans tes pensées pendant le trajet.","أنت تستغرق في أفكارك أثناء الرحلة."],["Elle se perd en forêt malgré la carte qu’elle tient.","هي تضل الطريق في الغابة رغم الخريطة التي تحملها."],["Nous nous perdons rarement grâce au système de navigation.","نحن نادرًا ما نضل الطريق بفضل نظام الملاحة."],["Vous vous perdez dans les détails au lieu d’aller à l’essentiel.","أنتم تضيعون في التفاصيل بدل الوصول إلى جوهر الموضوع."],["Ils se perdent de vue dans la foule du festival.","هم يفقدون رؤية بعضهم بعضًا وسط حشد المهرجان."]],
"se rencontrer":[["Je me rencontre avec mon conseiller une fois par mois.","أنا ألتقي مستشاري مرة كل شهر."],["Tu te rencontres avec l’équipe avant chaque match.","أنت تلتقي الفريق قبل كل مباراة."],["Elle se rencontre avec la cliente pour préciser ses besoins.","هي تلتقي العميلة لتحديد احتياجاتها بدقة."],["Nous nous rencontrons devant la bibliothèque après le cours.","نحن نلتقي أمام المكتبة بعد الدرس."],["Vous vous rencontrez régulièrement pour suivre l’avancement du projet.","أنتم تلتقون بانتظام لمتابعة تقدم المشروع."],["Ils se rencontrent pour la première fois lors d’une conférence.","هم يلتقون للمرة الأولى خلال مؤتمر."]],
"se parler":[["Je me parle à voix basse pour rester concentré.","أنا أتحدث إلى نفسي بصوت منخفض كي أبقى مركزًا."],["Tu te parles avec bienveillance après une erreur.","أنت تتحدث إلى نفسك بلطف بعد ارتكاب خطأ."],["Elle se parle devant le miroir avant sa présentation.","هي تتحدث إلى نفسها أمام المرآة قبل عرضها."],["Nous nous parlons chaque semaine par visioconférence.","نحن نتحدث بعضنا مع بعض كل أسبوع عبر مكالمة مرئية."],["Vous vous parlez franchement pour résoudre le désaccord.","أنتم تتحدثون بصراحة بعضكم مع بعض لحل الخلاف."],["Ils se parlent en français pendant toute la pause.","هم يتحدثون بالفرنسية بعضهم مع بعض طوال الاستراحة."]],
"se voir":[["Je me vois travailler à l’étranger dans quelques années.","أنا أرى نفسي أعمل في الخارج بعد بضع سنوات."],["Tu te vois dans le reflet de la vitre.","أنت ترى نفسك في انعكاس الزجاج."],["Elle se voit confier une mission importante.","هي تجد نفسها مكلفة بمهمة مهمة."],["Nous nous voyons tous les dimanches chez nos parents.","نحن نرى بعضنا بعضًا كل يوم أحد في منزل والدينا."],["Vous vous voyez demain pour finaliser le contrat.","أنتم تلتقون غدًا لوضع اللمسات الأخيرة على العقد."],["Elles se voient rarement depuis leur déménagement.","هن نادرًا ما يرين بعضهن بعضًا منذ انتقالهن."]],
"se comprendre":[["Je me comprends mieux depuis que j’écris mes pensées.","أنا أفهم نفسي بصورة أفضل منذ أن بدأت أكتب أفكاري."],["Tu te comprends sans avoir besoin de tout expliquer.","أنت تفهم نفسك من دون الحاجة إلى شرح كل شيء."],["Il se comprend difficilement quand il parle trop vite.","يصعب فهم كلامه عندما يتحدث بسرعة كبيرة."],["Nous nous comprenons malgré nos différences culturelles.","نحن نفهم بعضنا بعضًا رغم اختلافاتنا الثقافية."],["Vous vous comprenez parfaitement grâce à votre longue expérience commune.","أنتم تفهمون بعضكم بعضًا تمامًا بفضل خبرتكم المشتركة الطويلة."],["Ils se comprennent d’un simple regard.","هم يفهمون بعضهم بعضًا من مجرد نظرة."]],
"se demander":[["Je me demande pourquoi le magasin est encore fermé.","أنا أتساءل لماذا ما زال المتجر مغلقًا."],["Tu te demandes si tu as pris la bonne décision.","أنت تتساءل إن كنت قد اتخذت القرار الصحيح."],["Elle se demande comment annoncer la nouvelle à sa famille.","هي تتساءل كيف تخبر عائلتها بالخبر."],["Nous nous demandons quelle solution coûtera le moins cher.","نحن نتساءل أي حل سيكون أقل تكلفة."],["Vous vous demandez peut-être ce que signifie ce mot.","أنتم ربما تتساءلون عن معنى هذه الكلمة."],["Ils se demandent où passer leurs prochaines vacances.","هم يتساءلون أين يقضون عطلتهم القادمة."]],
"se servir":[["Je me sers de cette application pour réviser mes verbes.","أنا أستخدم هذا التطبيق لمراجعة أفعالي."],["Tu te sers une tasse de thé après le repas.","أنت تصب لنفسك كوبًا من الشاي بعد الوجبة."],["Elle se sert d’un dictionnaire pour vérifier l’orthographe.","هي تستخدم قاموسًا للتحقق من الإملاء."],["Nous nous servons des données pour améliorer le service.","نحن نستخدم البيانات لتحسين الخدمة."],["Vous vous servez librement au buffet.","أنتم تأخذون ما تريدون بأنفسكم من البوفيه."],["Ils se servent de cartes détaillées pour préparer l’expédition.","هم يستخدمون خرائط مفصلة للتحضير للبعثة."]],
"se rendre":[["Je me rends au bureau à pied lorsque le temps est agréable.","أنا أتوجه إلى المكتب سيرًا على الأقدام عندما يكون الطقس لطيفًا."],["Tu te rends compte de ton erreur avant d’envoyer le message.","أنت تدرك خطأك قبل إرسال الرسالة."],["Il se rend à l’hôpital pour un examen de contrôle.","هو يتوجه إلى المستشفى لإجراء فحص متابعة."],["Nous nous rendons disponibles pour répondre aux questions.","نحن نجعل أنفسنا متاحين للإجابة عن الأسئلة."],["Vous vous rendez directement à la porte d’embarquement.","أنتم تتوجهون مباشرة إلى بوابة الصعود."],["Elles se rendent chez leur grand-mère chaque vendredi.","هن يتوجهن إلى منزل جدتهن كل يوم جمعة."]],
"se mettre":[["Je me mets au travail dès que le bureau ouvre.","أنا أبدأ العمل بمجرد أن يفتح المكتب."],["Tu te mets près de la fenêtre pour mieux voir.","أنت تقف قرب النافذة كي ترى بصورة أفضل."],["Elle se met à rire en entendant cette histoire.","هي تبدأ بالضحك عندما تسمع هذه القصة."],["Nous nous mettons d’accord sur les priorités du projet.","نحن نتفق على أولويات المشروع."],["Vous vous mettez en file devant le guichet.","أنتم تقفون في صف أمام شباك الخدمة."],["Ils se mettent à courir lorsque la pluie commence.","هم يبدؤون بالركض عندما يبدأ المطر."]],
"s’arrêter":[["Je m’arrête à la boulangerie avant de rentrer.","أنا أتوقف عند المخبز قبل العودة إلى المنزل."],["Tu t’arrêtes quelques minutes pour admirer la vue.","أنت تتوقف بضع دقائق للاستمتاع بالمنظر."],["Le bus s’arrête devant la gare centrale.","تتوقف الحافلة أمام المحطة المركزية."],["Nous nous arrêtons dès que nous entendons l’alarme.","نحن نتوقف بمجرد أن نسمع جهاز الإنذار."],["Vous vous arrêtez au feu rouge même lorsque la rue est vide.","أنتم تتوقفون عند الإشارة الحمراء حتى عندما يكون الشارع خاليًا."],["Ils s’arrêtent de parler lorsque le professeur entre.","هم يتوقفون عن الكلام عندما يدخل المعلم."]],
"s’amuser":[["Je m’amuse à apprendre de nouvelles expressions françaises.","أنا أستمتع بتعلم تعبيرات فرنسية جديدة."],["Tu t’amuses avec tes cousins pendant le week-end.","أنت تستمتع مع أبناء عمومتك خلال عطلة نهاية الأسبوع."],["Elle s’amuse à photographier les oiseaux du jardin.","هي تستمتع بتصوير طيور الحديقة."],["Nous nous amusons beaucoup lors des soirées en famille.","نحن نستمتع كثيرًا خلال الأمسيات العائلية."],["Vous vous amusez tout en respectant les règles du parc.","أنتم تستمتعون مع احترام قواعد الحديقة."],["Ils s’amusent à inventer des histoires avant de dormir.","هم يستمتعون بابتكار القصص قبل النوم."]],
"se concentrer":[["Je me concentre mieux dans une pièce calme.","أنا أركز بصورة أفضل في غرفة هادئة."],["Tu te concentres sur la question la plus importante.","أنت تركز على السؤال الأكثر أهمية."],["Elle se concentre sur sa respiration avant la compétition.","هي تركز على تنفسها قبل المنافسة."],["Nous nous concentrons sur les besoins réels des utilisateurs.","نحن نركز على الاحتياجات الحقيقية للمستخدمين."],["Vous vous concentrez davantage lorsque votre téléphone est éteint.","أنتم تركزون أكثر عندما يكون هاتفكم مغلقًا."],["Ils se concentrent pour terminer l’exercice sans erreur.","هم يركزون لإنهاء التمرين من دون خطأ."]]
,"aller":[["Je vais à la bibliothèque après le travail.","أنا أذهب إلى المكتبة بعد العمل."],["Tu vas chez le médecin demain matin.","أنت تذهب إلى الطبيب صباح الغد."],["Elle va au marché pour acheter des légumes frais.","هي تذهب إلى السوق لشراء خضروات طازجة."],["Nous allons à Marseille en train ce week-end.","نحن نذهب إلى مرسيليا بالقطار في عطلة نهاية الأسبوع هذه."],["Vous allez directement à la salle de conférence.","أنتم تذهبون مباشرة إلى قاعة المؤتمر."],["Ils vont au stade pour assister au match.","هم يذهبون إلى الملعب لحضور المباراة."]]
,"pouvoir":[["Je peux vous aider à remplir ce formulaire.","أنا أستطيع مساعدتكم في تعبئة هذه الاستمارة."],["Tu peux ouvrir la fenêtre si tu as chaud.","أنت تستطيع فتح النافذة إذا كنت تشعر بالحر."],["Il peut résoudre ce problème sans calculatrice.","هو يستطيع حل هذه المسألة من دون آلة حاسبة."],["Nous pouvons reporter la réunion à jeudi.","نحن نستطيع تأجيل الاجتماع إلى يوم الخميس."],["Vous pouvez prendre place dans la salle d’attente.","أنتم تستطيعون الجلوس في غرفة الانتظار."],["Elles peuvent communiquer en français avec les clientes.","هن يستطعن التواصل بالفرنسية مع العميلات."]]
,"vouloir":[["Je veux apprendre à parler français avec assurance.","أنا أريد أن أتعلم التحدث بالفرنسية بثقة."],["Tu veux réserver une chambre avec vue sur la mer.","أنت تريد حجز غرفة مطلة على البحر."],["Elle veut changer de poste l’année prochaine.","هي تريد تغيير وظيفتها في العام المقبل."],["Nous voulons mieux comprendre les besoins des utilisateurs.","نحن نريد فهم احتياجات المستخدمين بصورة أفضل."],["Vous voulez recevoir la facture par courrier électronique.","أنتم تريدون استلام الفاتورة عبر البريد الإلكتروني."],["Ils veulent construire une école dans leur quartier.","هم يريدون بناء مدرسة في حيهم."]]
,"savoir":[["Je sais utiliser ce logiciel de gestion.","أنا أعرف كيفية استخدام برنامج الإدارة هذا."],["Tu sais où se trouve la gare la plus proche.","أنت تعرف أين تقع أقرب محطة قطار."],["Il sait préparer plusieurs plats français.","هو يعرف كيفية إعداد عدة أطباق فرنسية."],["Nous savons que la décision sera difficile.","نحن نعلم أن القرار سيكون صعبًا."],["Vous savez répondre calmement aux réclamations.","أنتم تعرفون كيفية الرد بهدوء على الشكاوى."],["Elles savent exactement ce qu’elles recherchent.","هن يعرفن بالضبط ما الذي يبحثن عنه."]]
,"venir":[["Je viens vous remettre les documents signés.","أنا آتي لتسليمكم المستندات الموقعة."],["Tu viens dîner chez nous ce soir.","أنت تأتي لتناول العشاء عندنا هذا المساء."],["Elle vient de terminer sa présentation.","هي أنهت عرضها للتو."],["Nous venons en avance pour préparer la salle.","نحن نأتي مبكرًا لتجهيز القاعة."],["Vous venez de plusieurs régions du pays.","أنتم تأتون من عدة مناطق في البلاد."],["Ils viennent chercher leurs enfants après l’école.","هم يأتون لاصطحاب أطفالهم بعد المدرسة."]]
,"voir":[["Je vois les montagnes depuis la fenêtre de ma chambre.","أنا أرى الجبال من نافذة غرفتي."],["Tu vois ton conseiller chaque lundi matin.","أنت تقابل مستشارك صباح كل يوم اثنين."],["Elle voit clairement la différence entre les deux modèles.","هي ترى بوضوح الفرق بين النموذجين."],["Nous voyons souvent nos voisins dans le parc.","نحن نرى جيراننا كثيرًا في الحديقة."],["Vous voyez que cette solution est plus économique.","أنتم ترون أن هذا الحل أكثر توفيرًا."],["Ils voient un film français au cinéma ce soir.","هم يشاهدون فيلمًا فرنسيًا في السينما هذا المساء."]]
,"dire":[["Je dis toujours la vérité à mes collègues.","أنا أقول الحقيقة دائمًا لزملائي."],["Tu dis bonjour au gardien en entrant.","أنت تقول صباح الخير للحارس عند الدخول."],["Il dit que le train aura dix minutes de retard.","هو يقول إن القطار سيتأخر عشر دقائق."],["Nous disons notre avis avec respect.","نحن نقول رأينا باحترام."],["Vous dites votre nom à l’agent d’accueil.","أنتم تقولون أسماءكم لموظف الاستقبال."],["Elles disent merci à toutes les personnes qui les ont aidées.","هن يقلن شكرًا لكل الأشخاص الذين ساعدوهن."]]
,"mettre":[["Je mets les clés dans la poche de ma veste.","أنا أضع المفاتيح في جيب سترتي."],["Tu mets la table avant l’arrivée des invités.","أنت ترتب المائدة قبل وصول الضيوف."],["Elle met vingt minutes pour se rendre au bureau.","هي تستغرق عشرين دقيقة للوصول إلى المكتب."],["Nous mettons nos téléphones en mode silencieux.","نحن نضع هواتفنا على الوضع الصامت."],["Vous mettez la signature au bas du contrat.","أنتم تضعون التوقيع أسفل العقد."],["Ils mettent leurs manteaux avant de sortir.","هم يرتدون معاطفهم قبل الخروج."]]
,"partir":[["Je pars de chez moi à sept heures précises.","أنا أغادر منزلي عند الساعة السابعة تمامًا."],["Tu pars en vacances avec ta famille en août.","أنت تسافر في إجازة مع عائلتك في شهر أغسطس."],["Elle part travailler à l’étranger pendant six mois.","هي تغادر للعمل في الخارج لمدة ستة أشهر."],["Nous partons dès que le taxi arrive.","نحن نغادر بمجرد وصول سيارة الأجرة."],["Vous partez de la porte numéro douze.","أنتم تنطلقون من البوابة رقم اثني عشر."],["Ils partent avant la fin de la cérémonie.","هم يغادرون قبل نهاية الحفل."]]
,"lire":[["Je lis un article économique pendant ma pause.","أنا أقرأ مقالًا اقتصاديًا أثناء استراحتي."],["Tu lis les instructions avant d’utiliser l’appareil.","أنت تقرأ التعليمات قبل استخدام الجهاز."],["Elle lit une histoire à ses enfants chaque soir.","هي تقرأ قصة لأطفالها كل مساء."],["Nous lisons les commentaires des clients avec attention.","نحن نقرأ تعليقات العملاء باهتمام."],["Vous lisez le contrat avant de le signer.","أنتم تقرؤون العقد قبل توقيعه."],["Ils lisent les nouvelles sur leur téléphone dans le train.","هم يقرؤون الأخبار على هواتفهم في القطار."]]
,"sortir":[["Je sors du bureau à dix-huit heures.","أنا أخرج من المكتب الساعة السادسة مساءً."],["Tu sors les clés de ton sac avant d’ouvrir la porte.","أنت تُخرج المفاتيح من حقيبتك قبل فتح الباب."],["Elle sort avec ses amies après le cours.","هي تخرج مع صديقاتها بعد الدرس."],["Nous sortons prendre l’air pendant la pause.","نحن نخرج لاستنشاق الهواء أثناء الاستراحة."],["Vous sortez à la prochaine station.","أنتم تنزلون في المحطة القادمة."],["Ils sortent les chaises sur la terrasse.","هم يُخرجون الكراسي إلى الشرفة."]]
,"dormir":[["Je dors huit heures quand je ne travaille pas de nuit.","أنا أنام ثماني ساعات عندما لا أعمل ليلًا."],["Tu dors près de la fenêtre parce que la chambre est chaude.","أنت تنام قرب النافذة لأن الغرفة حارة."],["Il dort profondément malgré le bruit de la rue.","هو ينام بعمق رغم ضجيج الشارع."],["Nous dormons dans un petit hôtel près de la gare.","نحن ننام في فندق صغير قرب محطة القطار."],["Vous dormez mieux après une journée calme.","أنتم تنامون بشكل أفضل بعد يوم هادئ."],["Elles dorment chez leur tante pendant le week-end.","هن ينمن في منزل خالتهن خلال عطلة نهاية الأسبوع."]]
,"écrire":[["J’écris un courriel au service des admissions.","أنا أكتب رسالة بريد إلكتروني إلى قسم القبول."],["Tu écris l’adresse sur l’enveloppe avec soin.","أنت تكتب العنوان على الظرف بعناية."],["Elle écrit un roman inspiré de son enfance.","هي تكتب رواية مستوحاة من طفولتها."],["Nous écrivons les décisions prises pendant la réunion.","نحن نكتب القرارات التي اتُّخذت أثناء الاجتماع."],["Vous écrivez vos remarques dans la dernière colonne.","أنتم تكتبون ملاحظاتكم في العمود الأخير."],["Ils écrivent à leurs familles chaque semaine.","هم يكتبون إلى عائلاتهم كل أسبوع."]]
,"boire":[["Je bois un verre d’eau avant de courir.","أنا أشرب كوبًا من الماء قبل الركض."],["Tu bois ton café sans sucre le matin.","أنت تشرب قهوتك من دون سكر في الصباح."],["Il boit une tisane pour apaiser sa gorge.","هو يشرب شايًا عشبيًا لتهدئة حلقه."],["Nous buvons du jus d’orange au petit-déjeuner.","نحن نشرب عصير البرتقال على الإفطار."],["Vous buvez suffisamment d’eau pendant le voyage.","أنتم تشربون كمية كافية من الماء أثناء الرحلة."],["Elles boivent du thé à la menthe après le repas.","هن يشربن شاي النعناع بعد الوجبة."]]
,"croire":[["Je crois que ce projet peut réussir.","أنا أعتقد أن هذا المشروع يمكن أن ينجح."],["Tu crois encore aux promesses de ce vendeur.","أنت ما زلت تصدق وعود هذا البائع."],["Elle croit en ses capacités malgré les difficultés.","هي تؤمن بقدراتها رغم الصعوبات."],["Nous croyons que le train arrivera à l’heure.","نحن نعتقد أن القطار سيصل في موعده."],["Vous croyez cette histoire sans vérifier les faits.","أنتم تصدقون هذه القصة من دون التحقق من الحقائق."],["Ils croient au travail d’équipe pour résoudre le problème.","هم يؤمنون بالعمل الجماعي لحل المشكلة."]]
,"recevoir":[["Je reçois les résultats de mon examen demain.","أنا أتلقى نتائج اختباري غدًا."],["Tu reçois un colis envoyé par ta sœur.","أنت تستلم طردًا أرسلته أختك."],["Il reçoit ses clients dans un bureau privé.","هو يستقبل عملاءه في مكتب خاص."],["Nous recevons souvent des visiteurs étrangers.","نحن نستقبل زوارًا أجانب كثيرًا."],["Vous recevez une confirmation par courrier électronique.","أنتم تتلقون تأكيدًا عبر البريد الإلكتروني."],["Elles reçoivent leurs diplômes à la fin de la cérémonie.","هن يستلمن شهاداتهن في نهاية الحفل."]]
,"tenir":[["Je tiens la porte pour la personne derrière moi.","أنا أمسك الباب للشخص الذي خلفي."],["Tu tiens un journal pour suivre tes progrès.","أنت تحتفظ بمذكرات لمتابعة تقدمك."],["Elle tient une petite boutique au centre-ville.","هي تدير متجرًا صغيرًا في وسط المدينة."],["Nous tenons notre promesse malgré les difficultés.","نحن نفي بوعدنا رغم الصعوبات."],["Vous tenez la rampe en descendant l’escalier.","أنتم تمسكون الدرابزين أثناء نزول السلم."],["Ils tiennent une réunion chaque lundi matin.","هم يعقدون اجتماعًا كل صباح اثنين."]]
,"rendre":[["Je rends le livre à la bibliothèque aujourd’hui.","أنا أعيد الكتاب إلى المكتبة اليوم."],["Tu rends ce travail avant la date limite.","أنت تسلّم هذا العمل قبل الموعد النهائي."],["Il rend sa chambre plus lumineuse avec de nouveaux rideaux.","هو يجعل غرفته أكثر إشراقًا بستائر جديدة."],["Nous rendons visite à nos grands-parents le vendredi.","نحن نزور أجدادنا يوم الجمعة."],["Vous rendez la monnaie au client avec exactitude.","أنتم تعيدون الباقي للعميل بدقة."],["Elles rendent hommage aux bénévoles de l’association.","هن يكرّمن متطوعي الجمعية."]]
,"descendre":[["Je descends les escaliers sans prendre l’ascenseur.","أنا أنزل الدرج من دون استخدام المصعد."],["Tu descends du bus devant l’hôpital.","أنت تنزل من الحافلة أمام المستشفى."],["Elle descend les valises de la voiture.","هي تُنزل الحقائب من السيارة."],["Nous descendons vers la plage avant le coucher du soleil.","نحن ننزل باتجاه الشاطئ قبل غروب الشمس."],["Vous descendez le volume pendant la réunion.","أنتم تخفضون مستوى الصوت أثناء الاجتماع."],["Ils descendent la rivière en canoë.","هم ينحدرون في النهر بقارب الكانو."]]
,"porter":[["Je porte un costume sombre pour l’entretien.","أنا أرتدي بدلة داكنة للمقابلة."],["Tu portes les courses jusqu’à la cuisine.","أنت تحمل المشتريات إلى المطبخ."],["Elle porte une attention particulière aux détails.","هي تولي اهتمامًا خاصًا للتفاصيل."],["Nous portons secours à un cycliste blessé.","نحن نُسعف راكب دراجة مصابًا."],["Vous portez plainte au commissariat après le vol.","أنتم تقدمون شكوى في مركز الشرطة بعد السرقة."],["Ils portent le nom de leur grand-père.","هم يحملون اسم جدهم."]]

,"monter":[["Je monte les escaliers jusqu’au troisième étage.","أنا أصعد الدرج حتى الطابق الثالث."],["Tu montes dans le train avant la fermeture des portes.","أنت تصعد إلى القطار قبل إغلاق الأبواب."],["Elle monte le chauffage quand la température baisse.","هي ترفع درجة التدفئة عندما تنخفض الحرارة."],["Nous montons une petite entreprise de services numériques.","نحن نؤسس شركة صغيرة للخدمات الرقمية."],["Vous montez les valises dans la chambre du premier étage.","أنتم ترفعون الحقائب إلى غرفة الطابق الأول."],["Ils montent à cheval chaque samedi matin.","هم يركبون الخيل صباح كل سبت."]]
,"passer":[["Je passe devant la boulangerie en allant au bureau.","أنا أمر أمام المخبز في طريقي إلى المكتب."],["Tu passes deux semaines à Nice cet été.","أنت تقضي أسبوعين في نيس هذا الصيف."],["Il passe un appel important depuis la salle d’attente.","هو يجري مكالمة مهمة من غرفة الانتظار."],["Nous passons l’examen de français lundi prochain.","نحن نتقدم لاختبار اللغة الفرنسية يوم الاثنين القادم."],["Vous passez le document à votre collègue de droite.","أنتم تمررون المستند إلى زميلكم الموجود على اليمين."],["Elles passent par le centre-ville pour éviter l’autoroute.","هن يمررن عبر وسط المدينة لتجنب الطريق السريع."]]
,"ouvrir":[["J’ouvre les volets dès que le soleil se lève.","أنا أفتح مصاريع النافذة فور شروق الشمس."],["Tu ouvres ton compte bancaire avec une pièce d’identité.","أنت تفتح حسابك البنكي باستخدام وثيقة هوية."],["Elle ouvre le colis avec précaution.","هي تفتح الطرد بحذر."],["Nous ouvrons la réunion par une brève présentation.","نحن نفتتح الاجتماع بعرض موجز."],["Vous ouvrez l’application depuis l’écran principal.","أنتم تفتحون التطبيق من الشاشة الرئيسية."],["Ils ouvrent un nouveau restaurant près du port.","هم يفتتحون مطعمًا جديدًا قرب الميناء."]]
,"offrir":[["J’offre un livre français à mon frère pour son anniversaire.","أنا أهدي أخي كتابًا فرنسيًا بمناسبة عيد ميلاده."],["Tu offres ton aide aux voyageurs qui semblent perdus.","أنت تعرض مساعدتك على المسافرين الذين يبدون تائهين."],["Elle offre un café à sa collègue pendant la pause.","هي تقدم فنجان قهوة لزميلتها أثناء الاستراحة."],["Nous offrons une réduction aux étudiants inscrits cette semaine.","نحن نقدم خصمًا للطلاب المسجلين هذا الأسبوع."],["Vous offrez à vos clients un service personnalisé.","أنتم تقدمون لعملائكم خدمة مخصصة."],["Ils offrent leur temps à une association locale.","هم يتطوعون بوقتهم لجمعية محلية."]]
,"attendre":[["J’attends le bus sous l’abri devant la gare.","أنا أنتظر الحافلة تحت المظلة أمام المحطة."],["Tu attends une réponse du service des admissions.","أنت تنتظر ردًا من قسم القبول."],["Elle attend son tour devant le guichet numéro quatre.","هي تنتظر دورها أمام الشباك رقم أربعة."],["Nous attendons que la pluie cesse avant de sortir.","نحن ننتظر حتى يتوقف المطر قبل الخروج."],["Vous attendez vos invités dans le hall de l’hôtel.","أنتم تنتظرون ضيوفكم في بهو الفندق."],["Ils attendent beaucoup de cette nouvelle formation.","هم يتوقعون الكثير من هذا التدريب الجديد."]]
,"répondre":[["Je réponds au courriel avant la fin de la matinée.","أنا أرد على البريد الإلكتروني قبل نهاية الصباح."],["Tu réponds correctement à la dernière question.","أنت تجيب إجابة صحيحة عن السؤال الأخير."],["Il répond au téléphone malgré le bruit du café.","هو يجيب على الهاتف رغم ضجيج المقهى."],["Nous répondons aux besoins réels des utilisateurs.","نحن نلبي الاحتياجات الحقيقية للمستخدمين."],["Vous répondez de vos décisions devant le conseil.","أنتم تتحملون مسؤولية قراراتكم أمام المجلس."],["Elles répondent avec calme aux clientes mécontentes.","هن يرددن بهدوء على العميلات غير الراضيات."]]
,"comprendre":[["Je comprends mieux ce chapitre après l’explication du professeur.","أنا أفهم هذا الفصل بصورة أفضل بعد شرح الأستاذ."],["Tu comprends pourquoi le train a été retardé.","أنت تفهم سبب تأخر القطار."],["Elle comprend trois langues étrangères sans difficulté.","هي تفهم ثلاث لغات أجنبية من دون صعوبة."],["Nous comprenons l’importance de protéger les données personnelles.","نحن ندرك أهمية حماية البيانات الشخصية."],["Vous comprenez bien les consignes affichées à l’entrée.","أنتم تفهمون جيدًا التعليمات المعروضة عند المدخل."],["Ils comprennent leur erreur après avoir relu le contrat.","هم يدركون خطأهم بعد إعادة قراءة العقد."]]
,"apprendre":[["J’apprends dix nouveaux mots français chaque matin.","أنا أتعلم عشر كلمات فرنسية جديدة كل صباح."],["Tu apprends à conduire avec un moniteur expérimenté.","أنت تتعلم القيادة مع مدرب ذي خبرة."],["Il apprend la nouvelle par un message de son directeur.","هو يعلم بالخبر من خلال رسالة من مديره."],["Nous apprenons de nos erreurs pour améliorer le projet.","نحن نتعلم من أخطائنا لتحسين المشروع."],["Vous apprenez aux enfants à respecter les règles de sécurité.","أنتم تعلمون الأطفال احترام قواعد السلامة."],["Elles apprennent leur texte avant la répétition générale.","هن يحفظن نصهن قبل البروفة النهائية."]]
,"connaître":[["Je connais un restaurant calme près de la bibliothèque.","أنا أعرف مطعمًا هادئًا قرب المكتبة."],["Tu connais bien les habitudes de tes clients réguliers.","أنت تعرف جيدًا عادات عملائك الدائمين."],["Elle connaît une période difficile depuis le début de l’année.","هي تمر بفترة صعبة منذ بداية العام."],["Nous connaissons les risques liés à cette décision.","نحن ندرك المخاطر المرتبطة بهذا القرار."],["Vous connaissez personnellement le responsable du projet.","أنتم تعرفون مسؤول المشروع شخصيًا."],["Ils connaissent Paris comme leur poche.","هم يعرفون باريس معرفة تامة."]]
,"conduire":[["Je conduis prudemment lorsque la route est mouillée.","أنا أقود بحذر عندما يكون الطريق مبللًا."],["Tu conduis tes enfants à l’école avant d’aller au travail.","أنت توصل أطفالك إلى المدرسة قبل الذهاب إلى العمل."],["Elle conduit une équipe de chercheurs internationaux.","هي تقود فريقًا من الباحثين الدوليين."],["Nous conduisons les visiteurs jusqu’à la salle principale.","نحن نرافق الزوار إلى القاعة الرئيسية."],["Vous conduisez les négociations avec beaucoup de patience.","أنتم تديرون المفاوضات بصبر كبير."],["Ils conduisent une étude sur les habitudes de lecture.","هم يجرون دراسة عن عادات القراءة."]]


,"vivre":[["Je vis près de la mer depuis trois ans.","أنا أعيش قرب البحر منذ ثلاث سنوات."],["Tu vis cette expérience avec beaucoup de courage.","أنت تعيش هذه التجربة بشجاعة كبيرة."],["Elle vit seule dans un appartement lumineux.","هي تعيش وحدها في شقة مضيئة."],["Nous vivons une période de changements importants.","نحن نعيش فترة من التغييرات المهمة."],["Vous vivez pleinement chaque moment du voyage.","أنتم تعيشون كل لحظة من الرحلة بكاملها."],["Ils vivent de leur travail artistique.","هم يكسبون عيشهم من عملهم الفني."]]
,"naître":[["Je nais dans une petite ville du sud.","أنا أولد في مدينة صغيرة في الجنوب."],["Tu nais avec une grande curiosité pour le monde.","أنت تولد بفضول كبير تجاه العالم."],["Il naît au début du printemps.","هو يولد في بداية الربيع."],["Nous naissons tous avec des talents différents.","نحن نولد جميعًا بمواهب مختلفة."],["Vous naissez dans une famille bilingue.","أنتم تولدون في عائلة ثنائية اللغة."],["Elles naissent le même jour dans le même hôpital.","هن يولدن في اليوم نفسه وفي المستشفى نفسه."]]
,"mourir":[["Je meurs de rire devant cette scène comique.","أنا أموت من الضحك أمام هذا المشهد الكوميدي."],["Tu meurs d’envie de visiter le Japon.","أنت تتوق بشدة إلى زيارة اليابان."],["La plante meurt sans lumière naturelle.","تموت النبتة من دون ضوء طبيعي."],["Nous mourons de faim après cette longue randonnée.","نحن نموت من الجوع بعد هذه الرحلة الطويلة سيرًا."],["Vous mourez d’impatience de connaître les résultats.","أنتم تكادون تموتون شوقًا لمعرفة النتائج."],["Les traditions meurent lorsqu’on cesse de les transmettre.","تموت التقاليد عندما نتوقف عن نقلها."]]
,"courir":[["Je cours trente minutes avant le travail.","أنا أركض ثلاثين دقيقة قبل العمل."],["Tu cours pour attraper le dernier bus.","أنت تركض للحاق بالحافلة الأخيرة."],["Il court un grand risque en refusant ce traitement.","هو يخاطر مخاطرة كبيرة برفضه هذا العلاج."],["Nous courons ensemble dans le parc chaque samedi.","نحن نركض معًا في الحديقة كل يوم سبت."],["Vous courez après plusieurs objectifs à la fois.","أنتم تسعون وراء عدة أهداف في الوقت نفسه."],["Elles courent une compétition nationale ce week-end.","هن يشاركن في سباق وطني في عطلة نهاية الأسبوع هذه."]]
,"entendre":[["J’entends les oiseaux depuis ma fenêtre.","أنا أسمع الطيور من نافذتي."],["Tu entends ce mot pour la première fois.","أنت تسمع هذه الكلمة للمرة الأولى."],["Elle entend bien défendre son opinion.","هي تنوي فعلًا الدفاع عن رأيها."],["Nous entendons un bruit étrange dans le couloir.","نحن نسمع صوتًا غريبًا في الممر."],["Vous entendez parfaitement les consignes du guide.","أنتم تسمعون تعليمات المرشد بوضوح تام."],["Ils entendent parler de ce projet à la radio.","هم يسمعون عن هذا المشروع في الإذاعة."]]
,"vendre":[["Je vends mon ancienne voiture à un voisin.","أنا أبيع سيارتي القديمة لأحد الجيران."],["Tu vends des produits locaux sur internet.","أنت تبيع منتجات محلية عبر الإنترنت."],["Elle vend son idée avec beaucoup de conviction.","هي تسوّق فكرتها بإقناع كبير."],["Nous vendons tous les billets avant midi.","نحن نبيع جميع التذاكر قبل الظهر."],["Vous vendez ce service à un prix raisonnable.","أنتم تبيعون هذه الخدمة بسعر معقول."],["Ils vendent leur maison pour déménager à Lyon.","هم يبيعون منزلهم للانتقال إلى ليون."]]
,"perdre":[["Je perds souvent mes clés dans la maison.","أنا أفقد مفاتيحي كثيرًا داخل المنزل."],["Tu perds patience lorsque le train est en retard.","أنت تفقد صبرك عندما يتأخر القطار."],["Il perd son match après une longue bataille.","هو يخسر مباراته بعد مواجهة طويلة."],["Nous perdons du temps dans les embouteillages.","نحن نضيّع الوقت في الازدحام المروري."],["Vous perdez une excellente occasion de progresser.","أنتم تفقدون فرصة ممتازة للتقدم."],["Elles perdent contact après la fin de leurs études.","هن يفقدن التواصل بعد انتهاء دراستهن."]]
,"surprendre":[["Je surprends mon ami avec un cadeau inattendu.","أنا أفاجئ صديقي بهدية غير متوقعة."],["Tu surprends tout le monde par ton calme.","أنت تفاجئ الجميع بهدوئك."],["Elle surprend une conversation derrière la porte.","هي تسمع مصادفة محادثة خلف الباب."],["Nous surprenons les visiteurs avec un accueil royal.","نحن نفاجئ الزوار باستقبال ملكي."],["Vous surprenez votre équipe en annonçant la nouvelle.","أنتم تفاجئون فريقكم بإعلان الخبر."],["Ils surprennent le voleur en pleine action.","هم يضبطون اللص متلبسًا."]]
,"parler":[["Je parle français avec mes collègues chaque matin.","أنا أتحدث الفرنسية مع زملائي كل صباح."],["Tu parles trop vite pendant la présentation.","أنت تتحدث بسرعة كبيرة أثناء العرض."],["Elle parle de son projet avec enthousiasme.","هي تتحدث عن مشروعها بحماس."],["Nous parlons au directeur après la réunion.","نحن نتحدث إلى المدير بعد الاجتماع."],["Vous parlez plusieurs langues avec aisance.","أنتم تتحدثون عدة لغات بطلاقة."],["Ils parlent affaires autour d’un café.","هم يتحدثون في الأعمال أثناء تناول القهوة."]]
,"aimer":[["J’aime apprendre de nouvelles expressions françaises.","أنا أحب تعلم تعبيرات فرنسية جديدة."],["Tu aimes ce quartier pour son calme.","أنت تحب هذا الحي لهدوئه."],["Elle aime que tout soit bien organisé.","هي تحب أن يكون كل شيء منظمًا جيدًا."],["Nous aimons voyager hors des périodes touristiques.","نحن نحب السفر خارج المواسم السياحية."],["Vous aimez mieux rester près de la fenêtre.","أنتم تفضّلون البقاء قرب النافذة."],["Ils aiment leurs enfants sans condition.","هم يحبون أطفالهم دون شرط."]]

,"donner":[["Je donne mon ancien ordinateur à une association locale.","أنا أعطي حاسوبي القديم لجمعية محلية."],["Tu donnes des conseils utiles aux nouveaux étudiants.","أنت تقدم نصائح مفيدة للطلاب الجدد."],["Elle donne une conférence sur l’entrepreneuriat féminin.","هي تلقي محاضرة عن ريادة الأعمال النسائية."],["Nous donnons notre avis avant la décision finale.","نحن نعطي رأينا قبل القرار النهائي."],["Vous donnez rendez-vous aux candidats lundi matin.","أنتم تحددون موعدًا للمرشحين صباح الاثنين."],["Ils donnent priorité aux demandes urgentes.","هم يعطون الأولوية للطلبات العاجلة."]]
,"travailler":[["Je travaille à distance trois jours par semaine.","أنا أعمل عن بُعد ثلاثة أيام في الأسبوع."],["Tu travailles sur un dossier confidentiel aujourd’hui.","أنت تعمل اليوم على ملف سري."],["Il travaille comme architecte dans une agence internationale.","هو يعمل مهندسًا معماريًا في وكالة دولية."],["Nous travaillons ensemble pour respecter le délai.","نحن نعمل معًا للالتزام بالموعد النهائي."],["Vous travaillez mieux dans un environnement calme.","أنتم تعملون بصورة أفضل في بيئة هادئة."],["Elles travaillent de nuit à l’hôpital cette semaine.","هن يعملن ليلًا في المستشفى هذا الأسبوع."]]
,"chercher":[["Je cherche mes lunettes depuis ce matin.","أنا أبحث عن نظارتي منذ هذا الصباح."],["Tu cherches un appartement près de l’université.","أنت تبحث عن شقة قرب الجامعة."],["Elle cherche à comprendre la cause du problème.","هي تسعى إلى فهم سبب المشكلة."],["Nous cherchons une solution moins coûteuse.","نحن نبحث عن حل أقل تكلفة."],["Vous cherchez le bureau des inscriptions au premier étage.","أنتم تبحثون عن مكتب التسجيل في الطابق الأول."],["Ils cherchent du travail dans le secteur touristique.","هم يبحثون عن عمل في قطاع السياحة."]]
,"trouver":[["Je trouve ce documentaire particulièrement instructif.","أنا أجد هذا الفيلم الوثائقي مفيدًا بصورة خاصة."],["Tu trouves toujours une place près de l’entrée.","أنت تجد دائمًا مكانًا قرب المدخل."],["Elle trouve le courage de recommencer après son échec.","هي تجد الشجاعة للبدء من جديد بعد فشلها."],["Nous trouvons cette proposition équilibrée et réaliste.","نحن نرى أن هذا الاقتراح متوازن وواقعي."],["Vous trouvez votre chemin grâce aux panneaux.","أنتم تجدون طريقكم بفضل اللوحات الإرشادية."],["Ils trouvent refuge dans une auberge de montagne.","هم يجدون مأوى في نُزل جبلي."]]
,"penser":[["Je pense souvent à mes objectifs de l’année.","أنا أفكر كثيرًا في أهدافي لهذا العام."],["Tu penses que le train partira à l’heure.","أنت تعتقد أن القطار سيغادر في موعده."],["Il pense à fermer toutes les fenêtres avant de partir.","هو يتذكر إغلاق جميع النوافذ قبل المغادرة."],["Nous pensons organiser la réunion jeudi prochain.","نحن نفكر في تنظيم الاجتماع الخميس المقبل."],["Vous pensez surtout au confort des visiteurs.","أنتم تفكرون خصوصًا في راحة الزوار."],["Elles pensent autrement depuis cette expérience.","هن يفكرن بطريقة مختلفة منذ هذه التجربة."]]
,"demander":[["Je demande un reçu après chaque paiement.","أنا أطلب إيصالًا بعد كل دفعة."],["Tu demandes ton chemin à un agent de police.","أنت تسأل شرطيًا عن الطريق."],["Elle demande au serveur de remplacer le plat.","هي تطلب من النادل استبدال الطبق."],["Nous demandons plus de précisions avant de signer.","نحن نطلب مزيدًا من التفاصيل قبل التوقيع."],["Vous demandez si la chambre est disponible ce soir.","أنتم تسألون ما إذا كانت الغرفة متاحة هذا المساء."],["Ils demandent de l’aide pour porter les cartons.","هم يطلبون المساعدة لحمل الصناديق."]]
,"écouter":[["J’écoute un podcast français pendant mon trajet.","أنا أستمع إلى بودكاست فرنسي أثناء تنقلي."],["Tu écoutes attentivement les consignes du médecin.","أنت تستمع باهتمام إلى تعليمات الطبيب."],["Elle écoute sa fille sans l’interrompre.","هي تستمع إلى ابنتها من دون مقاطعتها."],["Nous écoutons les propositions de chaque équipe.","نحن نستمع إلى مقترحات كل فريق."],["Vous écoutez de la musique classique pour vous détendre.","أنتم تستمعون إلى الموسيقى الكلاسيكية للاسترخاء."],["Ils écoutent le match à la radio dans la voiture.","هم يستمعون إلى المباراة عبر الراديو في السيارة."]]
,"jouer":[["Je joue aux échecs avec mon voisin le vendredi.","أنا ألعب الشطرنج مع جاري يوم الجمعة."],["Tu joues un rôle important dans cette négociation.","أنت تؤدي دورًا مهمًا في هذه المفاوضات."],["Elle joue du piano devant un petit public.","هي تعزف البيانو أمام جمهور صغير."],["Nous jouons contre l’équipe championne demain.","نحن نلعب ضد الفريق البطل غدًا."],["Vous jouez avec les mots pour rendre le texte amusant.","أنتم تتلاعبون بالكلمات لجعل النص ممتعًا."],["Ils jouent la dernière scène avec beaucoup d’émotion.","هم يؤدون المشهد الأخير بكثير من التأثر."]]
,"arriver":[["J’arrive au bureau avant huit heures chaque jour.","أنا أصل إلى المكتب قبل الساعة الثامنة كل يوم."],["Tu arrives à résoudre l’exercice sans aide.","أنت تنجح في حل التمرين من دون مساعدة."],["Elle arrive de Bruxelles par le train de midi.","هي تصل من بروكسل بقطار الظهر."],["Nous arrivons juste avant le début du spectacle.","نحن نصل قبيل بداية العرض مباشرة."],["Vous arrivez au terme d’un long projet.","أنتم تصلون إلى نهاية مشروع طويل."],["Ils arrivent avec une heure de retard à cause du brouillard.","هم يصلون متأخرين ساعة بسبب الضباب."]]
,"rester":[["Je reste chez moi pour terminer ce rapport.","أنا أبقى في المنزل لإنهاء هذا التقرير."],["Tu restes calme malgré la pression.","أنت تبقى هادئًا رغم الضغط."],["Elle reste en contact avec ses anciens collègues.","هي تبقى على تواصل مع زملائها السابقين."],["Nous restons deux nuits dans cet hôtel.","نحن نقيم ليلتين في هذا الفندق."],["Vous restez disponibles pendant toute la matinée.","أنتم تبقون متاحين طوال الصباح."],["Ils restent convaincus que le projet réussira.","هم يظلون مقتنعين بأن المشروع سينجح."]]

};

type Usage={fr:string;ar:string;example:string;translation:string};
const USAGES:Record<string,Usage[]>={
"prendre":[
 {fr:"prendre quelque chose",ar:"يأخذ شيئًا",example:"Je prends mon téléphone avant de sortir.",translation:"أنا آخذ هاتفي قبل الخروج."},
 {fr:"prendre un repas / un café",ar:"يتناول وجبة أو يشرب قهوة",example:"Elle prend son petit-déjeuner à huit heures.",translation:"هي تتناول فطورها الساعة الثامنة."},
 {fr:"prendre un médicament",ar:"يتناول دواءً",example:"Il prend ce médicament après le dîner.",translation:"هو يتناول هذا الدواء بعد العشاء."},
 {fr:"prendre le bus / le train",ar:"يستقل وسيلة نقل",example:"Nous prenons le train pour Lyon.",translation:"نحن نستقل القطار إلى ليون."},
 {fr:"prendre une décision",ar:"يتخذ قرارًا",example:"Vous prenez une décision importante.",translation:"أنتم تتخذون قرارًا مهمًا."},
 {fr:"prendre des photos",ar:"يلتقط صورًا",example:"Ils prennent des photos devant le musée.",translation:"هم يلتقطون صورًا أمام المتحف."}
],
"faire":[
 {fr:"faire un travail",ar:"ينجز عملًا",example:"Je fais un rapport pour mon directeur.",translation:"أنا أعد تقريرًا لمديري."},
 {fr:"faire du sport",ar:"يمارس الرياضة",example:"Elle fait du sport après le travail.",translation:"هي تمارس الرياضة بعد العمل."},
 {fr:"faire les courses",ar:"يتسوّق",example:"Nous faisons les courses le vendredi.",translation:"نحن نتسوّق يوم الجمعة."}
],
"devoir":[
 {fr:"devoir + infinitif",ar:"يجب أن / يتعين عليه",example:"Tu dois répondre avant demain.",translation:"يجب عليك الرد قبل الغد."},
 {fr:"devoir de l’argent",ar:"يكون مدينًا بالمال",example:"Il doit cinquante euros à son ami.",translation:"هو مدين لصديقه بخمسين يورو."},
 {fr:"devoir probablement",ar:"يفيد الاحتمال",example:"Elle doit être déjà arrivée.",translation:"لا بد أنها وصلت بالفعل."}
],
"regarder":[
 {fr:"regarder un film",ar:"يشاهد فيلمًا",example:"Ils regardent un film français.",translation:"هم يشاهدون فيلمًا فرنسيًا."},
 {fr:"regarder quelqu’un / quelque chose",ar:"ينظر إلى شخص أو شيء",example:"Regarde ce panneau avant de tourner.",translation:"انظر إلى هذه اللافتة قبل أن تنعطف."}
],
"être":[
 {fr:"être + adjectif",ar:"يصف حالة أو صفة",example:"Nous sommes prêts à commencer.",translation:"نحن مستعدون للبدء."},
 {fr:"être à / dans",ar:"يحدد المكان",example:"Elle est dans la salle de réunion.",translation:"هي في قاعة الاجتماع."},
 {fr:"être de",ar:"يدل على الأصل",example:"Je suis de Djeddah.",translation:"أنا من جدة."}
]
,"aller":[
 {fr:"aller à + lieu",ar:"يذهب إلى مكان",example:"Nous allons à l’université en métro.",translation:"نحن نذهب إلى الجامعة بالمترو."},
 {fr:"aller + infinitif",ar:"يدل على المستقبل القريب",example:"Je vais appeler le responsable maintenant.",translation:"سأتصل بالمسؤول الآن."},
 {fr:"aller bien / mal",ar:"يكون حاله جيدًا أو سيئًا",example:"Elle va beaucoup mieux aujourd’hui.",translation:"هي في حال أفضل بكثير اليوم."}
],
"pouvoir":[
 {fr:"pouvoir + infinitif",ar:"يستطيع القيام بفعل",example:"Vous pouvez entrer sans attendre.",translation:"يمكنكم الدخول من دون انتظار."},
 {fr:"pouvoir de permission",ar:"طلب الإذن أو منحه",example:"Est-ce que je peux utiliser votre téléphone ?",translation:"هل يمكنني استخدام هاتفكم؟"}
],
"vouloir":[
 {fr:"vouloir + nom",ar:"يريد شيئًا",example:"Je veux un billet aller-retour.",translation:"أنا أريد تذكرة ذهاب وعودة."},
 {fr:"vouloir + infinitif",ar:"يريد القيام بفعل",example:"Ils veulent apprendre le français.",translation:"هم يريدون تعلم الفرنسية."},
 {fr:"je voudrais",ar:"طلب مهذب",example:"Je voudrais une chambre calme, s’il vous plaît.",translation:"أود غرفة هادئة، من فضلك."}
],
"savoir":[
 {fr:"savoir + infinitif",ar:"يعرف كيفية القيام بشيء",example:"Elle sait conduire une voiture manuelle.",translation:"هي تعرف كيفية قيادة سيارة ذات ناقل يدوي."},
 {fr:"savoir que / où / comment",ar:"يعلم معلومة",example:"Nous savons où commence la visite.",translation:"نحن نعلم أين تبدأ الجولة."}
],
"venir":[
 {fr:"venir de + lieu",ar:"يأتي من مكان",example:"Il vient de Lyon.",translation:"هو يأتي من ليون."},
 {fr:"venir de + infinitif",ar:"الماضي القريب",example:"Je viens de recevoir votre message.",translation:"لقد استلمت رسالتكم للتو."},
 {fr:"venir + infinitif",ar:"يأتي للقيام بشيء",example:"Elle vient récupérer son dossier.",translation:"هي تأتي لاستلام ملفها."}
],
"voir":[
 {fr:"voir quelque chose",ar:"يرى شيئًا",example:"Je vois un bateau au loin.",translation:"أنا أرى قاربًا في البعيد."},
 {fr:"voir quelqu’un",ar:"يقابل شخصًا",example:"Nous voyons le directeur cet après-midi.",translation:"نحن نقابل المدير بعد ظهر اليوم."},
 {fr:"voir un film",ar:"يشاهد فيلمًا",example:"Ils voient un documentaire au cinéma.",translation:"هم يشاهدون فيلمًا وثائقيًا في السينما."}
],
"dire":[
 {fr:"dire quelque chose",ar:"يقول شيئًا",example:"Tu dis la vérité au médecin.",translation:"أنت تقول الحقيقة للطبيب."},
 {fr:"dire à quelqu’un de + infinitif",ar:"يطلب من شخص أن يفعل",example:"Elle dit aux enfants de ranger leur chambre.",translation:"هي تطلب من الأطفال ترتيب غرفتهم."}
],
"mettre":[
 {fr:"mettre un objet quelque part",ar:"يضع شيئًا في مكان",example:"Je mets le dossier sur votre bureau.",translation:"أنا أضع الملف على مكتبكم."},
 {fr:"mettre un vêtement",ar:"يرتدي قطعة ملابس",example:"Il met une veste avant de sortir.",translation:"هو يرتدي سترة قبل الخروج."},
 {fr:"mettre du temps",ar:"يستغرق وقتًا",example:"Le trajet met environ trente minutes.",translation:"تستغرق الرحلة نحو ثلاثين دقيقة."}
],
"partir":[
 {fr:"partir de + lieu",ar:"يغادر مكانًا",example:"Le train part de la voie cinq.",translation:"يغادر القطار من الرصيف الخامس."},
 {fr:"partir pour + destination",ar:"يتجه إلى وجهة",example:"Nous partons pour Genève demain.",translation:"نحن نتجه إلى جنيف غدًا."}
],
"lire":[
 {fr:"lire un texte",ar:"يقرأ نصًا",example:"Vous lisez le règlement avant la visite.",translation:"أنتم تقرؤون التعليمات قبل الزيارة."},
 {fr:"lire à voix haute",ar:"يقرأ بصوت مرتفع",example:"Elle lit le poème à voix haute.",translation:"هي تقرأ القصيدة بصوت مرتفع."}
]
,"sortir":[
 {fr:"sortir d’un lieu",ar:"يخرج من مكان",example:"Elle sort de la bibliothèque à midi.",translation:"هي تخرج من المكتبة عند الظهر."},
 {fr:"sortir quelque chose",ar:"يُخرج شيئًا",example:"Je sors mon passeport avant le contrôle.",translation:"أنا أُخرج جواز سفري قبل التفتيش."},
 {fr:"sortir avec quelqu’un",ar:"يخرج برفقة شخص",example:"Nous sortons avec nos amis ce soir.",translation:"نحن نخرج مع أصدقائنا هذا المساء."}
],
"dormir":[
 {fr:"dormir profondément",ar:"ينام بعمق",example:"Le bébé dort profondément après le bain.",translation:"الطفل ينام بعمق بعد الاستحمام."},
 {fr:"dormir chez quelqu’un",ar:"يبيت عند شخص",example:"Tu dors chez ton cousin ce week-end.",translation:"أنت تبيت عند ابن عمك في عطلة نهاية الأسبوع."}
],
"écrire":[
 {fr:"écrire à quelqu’un",ar:"يكتب إلى شخص",example:"J’écris à mon professeur pour demander un rendez-vous.",translation:"أنا أكتب إلى أستاذي لطلب موعد."},
 {fr:"écrire quelque chose",ar:"يكتب شيئًا",example:"Elle écrit son numéro sur une feuille.",translation:"هي تكتب رقمها على ورقة."}
],
"boire":[
 {fr:"boire une boisson",ar:"يشرب مشروبًا",example:"Nous buvons du café après le déjeuner.",translation:"نحن نشرب القهوة بعد الغداء."},
 {fr:"boire à la santé de quelqu’un",ar:"يشرب نخب شخص",example:"Ils boivent à la santé des nouveaux mariés.",translation:"هم يشربون نخب العروسين."}
],
"croire":[
 {fr:"croire que",ar:"يعتقد أن",example:"Je crois que la salle est encore ouverte.",translation:"أنا أعتقد أن القاعة ما زالت مفتوحة."},
 {fr:"croire quelqu’un",ar:"يصدق شخصًا",example:"Elle croit son médecin parce qu’il explique clairement le traitement.",translation:"هي تصدق طبيبها لأنه يشرح العلاج بوضوح."},
 {fr:"croire en",ar:"يؤمن بـ",example:"Nous croyons en la valeur de l’éducation.",translation:"نحن نؤمن بقيمة التعليم."}
],
"recevoir":[
 {fr:"recevoir un objet / un message",ar:"يتلقى شيئًا أو رسالة",example:"Vous recevez le code de confirmation par SMS.",translation:"أنتم تتلقون رمز التأكيد عبر رسالة نصية."},
 {fr:"recevoir quelqu’un",ar:"يستقبل شخصًا",example:"Le directeur reçoit les candidats dans son bureau.",translation:"المدير يستقبل المرشحين في مكتبه."}
],
"tenir":[
 {fr:"tenir un objet",ar:"يمسك شيئًا",example:"Il tient le parapluie au-dessus de sa fille.",translation:"هو يمسك المظلة فوق ابنته."},
 {fr:"tenir une promesse",ar:"يفي بوعد",example:"Tu tiens toujours tes promesses.",translation:"أنت تفي بوعودك دائمًا."},
 {fr:"tenir une réunion",ar:"يعقد اجتماعًا",example:"Nous tenons une réunion urgente cet après-midi.",translation:"نحن نعقد اجتماعًا عاجلًا بعد ظهر اليوم."}
],
"rendre":[
 {fr:"rendre quelque chose",ar:"يعيد شيئًا",example:"Je rends les clés au propriétaire.",translation:"أنا أعيد المفاتيح إلى المالك."},
 {fr:"rendre + adjectif",ar:"يجعل شيئًا على حال",example:"Cette musique rend l’ambiance plus agréable.",translation:"هذه الموسيقى تجعل الأجواء أكثر متعة."},
 {fr:"rendre visite à",ar:"يزور",example:"Elle rend visite à sa mère chaque semaine.",translation:"هي تزور والدتها كل أسبوع."}
],
"descendre":[
 {fr:"descendre d’un véhicule",ar:"ينزل من وسيلة نقل",example:"Nous descendons du train à Marseille.",translation:"نحن ننزل من القطار في مرسيليا."},
 {fr:"descendre quelque chose",ar:"يُنزل شيئًا",example:"Ils descendent les cartons au garage.",translation:"هم يُنزلون الصناديق إلى المرآب."},
 {fr:"descendre une rue",ar:"يسير نزولًا في شارع",example:"Vous descendez cette rue jusqu’à la place.",translation:"أنتم تسيرون نزولًا في هذا الشارع حتى الساحة."}
],
"porter":[
 {fr:"porter un vêtement",ar:"يرتدي لباسًا",example:"Elle porte une robe bleue pour la cérémonie.",translation:"هي ترتدي فستانًا أزرق للحفل."},
 {fr:"porter un objet",ar:"يحمل شيئًا",example:"Je porte une boîte lourde avec les deux mains.",translation:"أنا أحمل صندوقًا ثقيلًا بكلتا يديّ."},
 {fr:"porter plainte",ar:"يقدم شكوى",example:"Il porte plainte après la disparition de son téléphone.",translation:"هو يقدم شكوى بعد اختفاء هاتفه."}
]

,"monter":[
 {fr:"monter les escaliers",ar:"يصعد الدرج",example:"Elle monte les escaliers sans utiliser l’ascenseur.",translation:"هي تصعد الدرج من دون استخدام المصعد."},
 {fr:"monter dans un véhicule",ar:"يصعد إلى وسيلة نقل",example:"Nous montons dans le bus devant l’université.",translation:"نحن نصعد إلى الحافلة أمام الجامعة."},
 {fr:"monter quelque chose",ar:"يرفع شيئًا",example:"Ils montent les cartons au deuxième étage.",translation:"هم يرفعون الصناديق إلى الطابق الثاني."},
 {fr:"monter une entreprise",ar:"يؤسس مشروعًا أو شركة",example:"Tu montes une agence avec deux partenaires.",translation:"أنت تؤسس وكالة مع شريكين."}
],
"passer":[
 {fr:"passer devant / par",ar:"يمر أمام مكان أو عبره",example:"Je passe par la pharmacie avant de rentrer.",translation:"أنا أمر بالصيدلية قبل العودة."},
 {fr:"passer du temps",ar:"يقضي وقتًا",example:"Elle passe la soirée avec sa famille.",translation:"هي تقضي المساء مع عائلتها."},
 {fr:"passer un examen",ar:"يتقدم لاختبار",example:"Vous passez un examen oral demain.",translation:"أنتم تتقدمون لاختبار شفهي غدًا."},
 {fr:"passer quelque chose à quelqu’un",ar:"يمرر شيئًا إلى شخص",example:"Passe-moi le sel, s’il te plaît.",translation:"مرر لي الملح، من فضلك."}
],
"ouvrir":[
 {fr:"ouvrir une porte / un objet",ar:"يفتح بابًا أو شيئًا",example:"Il ouvre la fenêtre pour aérer la pièce.",translation:"هو يفتح النافذة لتهوية الغرفة."},
 {fr:"ouvrir un compte",ar:"يفتح حسابًا",example:"J’ouvre un compte d’épargne en ligne.",translation:"أنا أفتح حساب توفير عبر الإنترنت."},
 {fr:"ouvrir une réunion",ar:"يفتتح اجتماعًا",example:"La directrice ouvre la séance à neuf heures.",translation:"المديرة تفتتح الجلسة الساعة التاسعة."},
 {fr:"ouvrir un commerce",ar:"يفتتح متجرًا أو نشاطًا",example:"Ils ouvrent une boulangerie dans le quartier.",translation:"هم يفتتحون مخبزًا في الحي."}
],
"offrir":[
 {fr:"offrir un cadeau",ar:"يهدي هدية",example:"Nous offrons des fleurs à notre professeur.",translation:"نحن نهدي أستاذنا زهورًا."},
 {fr:"offrir un service",ar:"يقدم خدمة",example:"Cet hôtel offre un service de navette gratuit.",translation:"هذا الفندق يقدم خدمة نقل مجانية."},
 {fr:"offrir son aide",ar:"يعرض مساعدته",example:"Elle offre son aide à une nouvelle collègue.",translation:"هي تعرض مساعدتها على زميلة جديدة."},
 {fr:"s’offrir quelque chose",ar:"يشتري لنفسه شيئًا للمتعة",example:"Il s’offre un bon repas après son examen.",translation:"هو يكافئ نفسه بوجبة جيدة بعد اختباره."}
],
"attendre":[
 {fr:"attendre quelqu’un / quelque chose",ar:"ينتظر شخصًا أو شيئًا",example:"Nous attendons le médecin dans le couloir.",translation:"نحن ننتظر الطبيب في الممر."},
 {fr:"attendre que + subjonctif",ar:"ينتظر حتى يحدث شيء",example:"J’attends que le directeur soit disponible.",translation:"أنا أنتظر حتى يصبح المدير متاحًا."},
 {fr:"s’attendre à",ar:"يتوقع",example:"Ils s’attendent à une forte demande cet été.",translation:"هم يتوقعون طلبًا مرتفعًا هذا الصيف."}
],
"répondre":[
 {fr:"répondre à une question",ar:"يجيب عن سؤال",example:"Tu réponds à toutes les questions du formulaire.",translation:"أنت تجيب عن جميع أسئلة الاستمارة."},
 {fr:"répondre au téléphone",ar:"يجيب على الهاتف",example:"Elle répond au téléphone dès la première sonnerie.",translation:"هي تجيب على الهاتف من الرنة الأولى."},
 {fr:"répondre à un besoin",ar:"يلبي حاجة",example:"Ce programme répond aux besoins des débutants.",translation:"هذا البرنامج يلبي احتياجات المبتدئين."},
 {fr:"répondre de",ar:"يتحمل مسؤولية",example:"Le chef répond de la sécurité de son équipe.",translation:"الرئيس يتحمل مسؤولية سلامة فريقه."}
],
"comprendre":[
 {fr:"comprendre une idée",ar:"يفهم فكرة",example:"Je comprends enfin cette règle grammaticale.",translation:"أنا أفهم أخيرًا هذه القاعدة النحوية."},
 {fr:"comprendre pourquoi / comment",ar:"يفهم السبب أو الكيفية",example:"Nous comprenons comment fonctionne le système.",translation:"نحن نفهم كيفية عمل النظام."},
 {fr:"comprendre quelqu’un",ar:"يتفهم شخصًا",example:"Elle comprend son fils malgré son silence.",translation:"هي تتفهم ابنها رغم صمته."},
 {fr:"comprendre au sens d’inclure",ar:"يشمل",example:"Le prix comprend le petit-déjeuner et le transport.",translation:"السعر يشمل الإفطار والنقل."}
],
"apprendre":[
 {fr:"apprendre quelque chose",ar:"يتعلم شيئًا",example:"Vous apprenez le vocabulaire du voyage.",translation:"أنتم تتعلمون مفردات السفر."},
 {fr:"apprendre à + infinitif",ar:"يتعلم كيفية القيام بفعل",example:"Il apprend à utiliser le nouveau logiciel.",translation:"هو يتعلم استخدام البرنامج الجديد."},
 {fr:"apprendre une nouvelle",ar:"يعلم بخبر",example:"J’apprends la nouvelle en arrivant au bureau.",translation:"أنا أعلم بالخبر عند وصولي إلى المكتب."},
 {fr:"apprendre quelque chose à quelqu’un",ar:"يعلّم شخصًا شيئًا",example:"Elle apprend aux enfants à lire en français.",translation:"هي تعلم الأطفال القراءة بالفرنسية."}
],
"connaître":[
 {fr:"connaître une personne",ar:"يعرف شخصًا",example:"Je connais le médecin qui travaille dans cette clinique.",translation:"أنا أعرف الطبيب الذي يعمل في هذه العيادة."},
 {fr:"connaître un lieu",ar:"يعرف مكانًا",example:"Tu connais bien les rues du vieux quartier.",translation:"أنت تعرف جيدًا شوارع الحي القديم."},
 {fr:"connaître un sujet",ar:"يلم بموضوع",example:"Nous connaissons les règles de cette compétition.",translation:"نحن نعرف قواعد هذه المسابقة."},
 {fr:"connaître une situation",ar:"يمر بحالة أو تجربة",example:"L’entreprise connaît une croissance rapide.",translation:"الشركة تشهد نموًا سريعًا."}
],
"conduire":[
 {fr:"conduire un véhicule",ar:"يقود مركبة",example:"Elle conduit une voiture électrique en ville.",translation:"هي تقود سيارة كهربائية في المدينة."},
 {fr:"conduire quelqu’un quelque part",ar:"يوصل شخصًا إلى مكان",example:"Je conduis mon ami à l’aéroport.",translation:"أنا أوصل صديقي إلى المطار."},
 {fr:"conduire une équipe / un projet",ar:"يقود فريقًا أو مشروعًا",example:"Vous conduisez ce projet depuis janvier.",translation:"أنتم تقودون هذا المشروع منذ يناير."},
 {fr:"conduire à un résultat",ar:"يؤدي إلى نتيجة",example:"Cette erreur conduit à un retard important.",translation:"هذا الخطأ يؤدي إلى تأخير كبير."}
]
,"vivre":[{fr:"vivre dans un lieu",ar:"يعيش في مكان",example:"Elle vit dans un village entouré de montagnes.",translation:"هي تعيش في قرية محاطة بالجبال."},{fr:"vivre une expérience",ar:"يعيش تجربة",example:"Nous vivons une aventure inoubliable.",translation:"نحن نعيش مغامرة لا تُنسى."},{fr:"vivre de",ar:"يكسب عيشه من",example:"Il vit de la vente de ses tableaux.",translation:"هو يكسب عيشه من بيع لوحاته."}]
,"naître":[{fr:"naître à / en",ar:"يولد في مكان أو زمن",example:"Victor Hugo naît à Besançon en 1802.",translation:"يولد فيكتور هوغو في بيزانسون عام 1802."},{fr:"faire naître",ar:"يُنشئ أو يثير",example:"Cette découverte fait naître un nouvel espoir.",translation:"هذا الاكتشاف يبعث أملًا جديدًا."}]
,"mourir":[{fr:"mourir de maladie",ar:"يموت بسبب مرض",example:"Cet arbre meurt d’une maladie rare.",translation:"تموت هذه الشجرة بسبب مرض نادر."},{fr:"mourir de + sensation",ar:"تعبير عن شدة شعور",example:"Je meurs de soif après la course.",translation:"أنا أموت من العطش بعد السباق."},{fr:"mourir d’envie de",ar:"يتوق بشدة إلى",example:"Tu meurs d’envie de découvrir Paris.",translation:"أنت تتوق بشدة إلى اكتشاف باريس."}]
,"courir":[{fr:"courir pour le sport",ar:"يركض للرياضة",example:"Elle court cinq kilomètres chaque matin.",translation:"هي تركض خمسة كيلومترات كل صباح."},{fr:"courir un risque",ar:"يخاطر",example:"Vous courez un risque inutile.",translation:"أنتم تخاطرون مخاطرة غير ضرورية."},{fr:"courir après",ar:"يسعى وراء",example:"Ils courent après le succès rapide.",translation:"هم يسعون وراء النجاح السريع."}]
,"entendre":[{fr:"entendre un son",ar:"يسمع صوتًا",example:"J’entends la cloche de l’école.",translation:"أنا أسمع جرس المدرسة."},{fr:"entendre parler de",ar:"يسمع عن",example:"Nous entendons parler de cette méthode depuis longtemps.",translation:"نحن نسمع عن هذه الطريقة منذ زمن طويل."},{fr:"entendre + infinitif",ar:"ينوي",example:"Le ministre entend réformer le système.",translation:"الوزير ينوي إصلاح النظام."}]
,"vendre":[{fr:"vendre un produit",ar:"يبيع منتجًا",example:"Le magasin vend des vêtements français.",translation:"المتجر يبيع ملابس فرنسية."},{fr:"se vendre",ar:"يُباع",example:"Ce livre se vend très bien cette année.",translation:"هذا الكتاب يُباع جيدًا جدًا هذا العام."},{fr:"vendre une idée",ar:"يسوّق فكرة",example:"Il vend son projet aux investisseurs.",translation:"هو يسوّق مشروعه للمستثمرين."}]
,"perdre":[{fr:"perdre un objet",ar:"يفقد شيئًا",example:"Elle perd son billet avant l’embarquement.",translation:"هي تفقد تذكرتها قبل الصعود."},{fr:"perdre du temps",ar:"يضيّع الوقت",example:"Ne perdons pas de temps inutilement.",translation:"دعونا لا نضيّع الوقت بلا فائدة."},{fr:"perdre un match",ar:"يخسر مباراة",example:"L’équipe perd la finale aux tirs au but.",translation:"يخسر الفريق النهائي بركلات الترجيح."}]
,"surprendre":[{fr:"surprendre quelqu’un",ar:"يفاجئ شخصًا",example:"Cette réponse surprend le professeur.",translation:"هذه الإجابة تفاجئ المعلم."},{fr:"surprendre une conversation",ar:"يسمع محادثة مصادفة",example:"Je surprends leur conversation dans le hall.",translation:"أنا أسمع محادثتهم مصادفة في الردهة."},{fr:"prendre sur le fait",ar:"يضبط متلبسًا",example:"La police surprend le suspect devant la banque.",translation:"تضبط الشرطة المشتبه به أمام البنك."}]
,"parler":[{fr:"parler une langue",ar:"يتحدث لغة",example:"Elle parle couramment l’arabe et le français.",translation:"هي تتحدث العربية والفرنسية بطلاقة."},{fr:"parler à quelqu’un",ar:"يتحدث إلى شخص",example:"Je parle au réceptionniste de ma réservation.",translation:"أنا أتحدث إلى موظف الاستقبال عن حجزي."},{fr:"parler de",ar:"يتحدث عن",example:"Nous parlons de nos projets futurs.",translation:"نحن نتحدث عن مشاريعنا المستقبلية."}]
,"aimer":[{fr:"aimer quelqu’un",ar:"يحب شخصًا",example:"Elle aime profondément sa famille.",translation:"هي تحب عائلتها بعمق."},{fr:"aimer + infinitif",ar:"يحب القيام بفعل",example:"Nous aimons marcher au bord de la mer.",translation:"نحن نحب المشي على شاطئ البحر."},{fr:"aimer mieux",ar:"يفضّل",example:"Je préfère rester ici ce soir.",translation:"أنا أفضّل البقاء هنا هذا المساء."}]

,"donner":[{fr:"donner quelque chose à quelqu’un",ar:"يعطي شيئًا لشخص",example:"Elle donne les clés au nouveau locataire.",translation:"هي تعطي المفاتيح للمستأجر الجديد."},{fr:"donner un cours / une conférence",ar:"يقدّم درسًا أو محاضرة",example:"Le professeur donne un cours sur l’histoire moderne.",translation:"يقدم الأستاذ درسًا عن التاريخ الحديث."},{fr:"donner rendez-vous",ar:"يحدد موعدًا",example:"Je vous donne rendez-vous devant la gare.",translation:"أنا أحدد لكم موعدًا أمام المحطة."}]
,"travailler":[{fr:"travailler dans / pour",ar:"يعمل في جهة أو لصالحها",example:"Il travaille pour une entreprise de transport.",translation:"هو يعمل لدى شركة نقل."},{fr:"travailler sur",ar:"يعمل على موضوع أو مشروع",example:"Nous travaillons sur une nouvelle version de l’application.",translation:"نحن نعمل على نسخة جديدة من التطبيق."},{fr:"travailler dur",ar:"يعمل بجد",example:"Elles travaillent dur avant les examens.",translation:"هن يعملن بجد قبل الاختبارات."}]
,"chercher":[{fr:"chercher quelque chose",ar:"يبحث عن شيء",example:"Je cherche mon passeport dans la valise.",translation:"أنا أبحث عن جواز سفري في الحقيبة."},{fr:"chercher à + infinitif",ar:"يسعى إلى القيام بفعل",example:"L’équipe cherche à réduire les dépenses.",translation:"يسعى الفريق إلى خفض النفقات."},{fr:"venir chercher",ar:"يأتي لاصطحاب أو أخذ",example:"Mon frère vient chercher les enfants à cinq heures.",translation:"يأتي أخي لاصطحاب الأطفال الساعة الخامسة."}]
,"trouver":[{fr:"trouver quelque chose",ar:"يعثر على شيء",example:"Tu trouves les documents dans le tiroir du haut.",translation:"أنت تجد المستندات في الدرج العلوي."},{fr:"trouver + adjectif",ar:"يرى أن شيئًا يتصف بصفة",example:"Nous trouvons cette méthode très efficace.",translation:"نحن نرى أن هذه الطريقة فعالة جدًا."},{fr:"trouver refuge",ar:"يجد مأوى",example:"Les randonneurs trouvent refuge avant la tempête.",translation:"يجد المتنزهون مأوى قبل العاصفة."}]
,"penser":[{fr:"penser à",ar:"يفكر في أو يتذكر",example:"Pense à prendre ton chargeur.",translation:"تذكر أن تأخذ شاحنك."},{fr:"penser que",ar:"يعتقد أن",example:"Je pense que la réponse est correcte.",translation:"أنا أعتقد أن الإجابة صحيحة."},{fr:"penser + infinitif",ar:"ينوي أو يفكر في فعل",example:"Ils pensent déménager au printemps.",translation:"هم يفكرون في الانتقال في الربيع."}]
,"demander":[{fr:"demander quelque chose",ar:"يطلب شيئًا",example:"Elle demande une chambre avec balcon.",translation:"هي تطلب غرفة بشرفة."},{fr:"demander à quelqu’un de + infinitif",ar:"يطلب من شخص أن يفعل",example:"Le chef demande aux employés de patienter.",translation:"يطلب المدير من الموظفين الانتظار."},{fr:"demander son chemin",ar:"يسأل عن الطريق",example:"Nous demandons notre chemin à une habitante.",translation:"نحن نسأل إحدى السكان عن الطريق."}]
,"écouter":[{fr:"écouter quelqu’un",ar:"يستمع إلى شخص",example:"Le médecin écoute attentivement son patient.",translation:"يستمع الطبيب باهتمام إلى مريضه."},{fr:"écouter de la musique",ar:"يستمع إلى الموسيقى",example:"Vous écoutez du jazz pendant le dîner.",translation:"أنتم تستمعون إلى موسيقى الجاز أثناء العشاء."},{fr:"écouter un conseil",ar:"يأخذ بنصيحة",example:"Tu écoutes les conseils de ton entraîneur.",translation:"أنت تأخذ بنصائح مدربك."}]
,"jouer":[{fr:"jouer à + jeu / sport",ar:"يلعب لعبة أو رياضة",example:"Les enfants jouent au football dans la cour.",translation:"يلعب الأطفال كرة القدم في الساحة."},{fr:"jouer de + instrument",ar:"يعزف آلة موسيقية",example:"Elle joue de la guitare depuis dix ans.",translation:"هي تعزف الغيتار منذ عشر سنوات."},{fr:"jouer un rôle",ar:"يؤدي دورًا",example:"Cette décision joue un rôle décisif.",translation:"يؤدي هذا القرار دورًا حاسمًا."}]
,"arriver":[{fr:"arriver à un lieu",ar:"يصل إلى مكان",example:"Le bus arrive à la gare centrale.",translation:"تصل الحافلة إلى المحطة المركزية."},{fr:"arriver à + infinitif",ar:"ينجح في القيام بفعل",example:"J’arrive enfin à comprendre cette règle.",translation:"أنا أنجح أخيرًا في فهم هذه القاعدة."},{fr:"arriver de",ar:"يصل قادمًا من مكان",example:"Ils arrivent de Casablanca ce soir.",translation:"هم يصلون من الدار البيضاء هذا المساء."}]
,"rester":[{fr:"rester dans un lieu",ar:"يبقى في مكان",example:"Nous restons dans la salle jusqu’à midi.",translation:"نحن نبقى في القاعة حتى الظهر."},{fr:"rester + adjectif",ar:"يظل على حالة",example:"Elle reste silencieuse pendant l’entretien.",translation:"هي تظل صامتة أثناء المقابلة."},{fr:"rester en contact",ar:"يبقى على تواصل",example:"Vous restez en contact avec le service client.",translation:"أنتم تبقون على تواصل مع خدمة العملاء."}]


};
function speak(t:string){if(typeof window==='undefined'||!('speechSynthesis'in window))return;const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';u.rate=.82;u.pitch=1;const voices=speechSynthesis.getVoices();u.voice=voices.find(x=>x.lang.toLowerCase().startsWith('fr'))||null;speechSynthesis.cancel();speechSynthesis.speak(u)}
function cap(s:string){return s.charAt(0).toUpperCase()+s.slice(1)}
function ExampleRow({form,index,verb,title}:{form:string,index:number,verb:string,title:string}){
 const curated=title==="Présent"?SMART[verb]?.[index]:undefined;
 return <article className="conj-example-row"><div className="conj-form-line" dir="ltr"><strong>{form}</strong><button onClick={()=>speak(form)} aria-label="نطق التصريف"><Volume2/></button></div>{curated?<><div className="conj-example-copy"><p dir="ltr">{curated[0]}</p><small>{curated[1]}</small></div><button className="conj-sentence-audio" onClick={()=>speak(curated[0])} aria-label="نطق المثال"><Volume2/></button></>:<div className="conj-example-copy conj-review-note"><p>سيُضاف مثال مراجع لهذا الزمن في التحديث القادم.</p><small>لا نعرض جملة آلية غير موثوقة.</small></div>}</article>
}
function Block({title,forms,verb}:{title:string,forms:string[],verb:string}){return <section className="conj-tense-pro"><h3>{title}<span>{forms.length} formes</span></h3><div>{forms.map((x,i)=><ExampleRow key={i} form={x} index={i} verb={verb} title={title}/>)}</div></section>}
function UsagePanel({verb}:{verb:string}){const items=USAGES[verb];if(!items?.length)return null;return <section className="conj-usages"><div className="conj-usages-title"><span>Les usages du verbe</span><h3>استعمالات الفعل</h3></div><div className="conj-usages-grid">{items.map((u,i)=><article key={i}><div><strong dir="ltr">{u.fr}</strong><small>{u.ar}</small></div><p dir="ltr">{u.example}</p><em>{u.translation}</em><button onClick={()=>speak(u.example)} aria-label="نطق مثال الاستعمال"><Volume2/></button></article>)}</div></section>}
export default function Page(){
 const r=useRouter(),[q,setQ]=useState(""),[v,setV]=useState("être"),[tab,setTab]=useState("Indicatif"),[openSearch,setOpenSearch]=useState(false);
 const list=useMemo(()=>VERBS.filter(x=>x.toLowerCase().includes(q.toLowerCase().trim())||baseVerb(x).toLowerCase().includes(q.toLowerCase().trim())).slice(0,120),[q]);
 const p=pres(v),pp=part(v),a=aux(v) as "avoir"|"être";
 const tabs=["Indicatif","Conditionnel","Subjonctif","Impératif","Infinitif","Participe","Gérondif"];
 return <main className="conj-page conj-pro" dir="rtl">
  <header className="conj-top"><button onClick={()=>r.push('/castle')}><ArrowLeft/></button><div><BookOpen/><span><strong>قاعة تصريف الأفعال</strong><small>La Salle de Conjugaison</small></span></div><div className="conj-rating"><Star/><Star/><Star/><Star/><Star/></div></header>
  <section className="conj-search-wrap"><div className="conj-search"><Search/><input dir="ltr" value={q} onFocus={()=>setOpenSearch(true)} onChange={e=>{setQ(e.target.value);setOpenSearch(true)}} placeholder="Rechercher un verbe..."/><ChevronDown/></div>{openSearch&&q&&<div className="conj-results">{list.length?list.map(x=><button key={x} onClick={()=>{setV(x);setQ('');setOpenSearch(false)}} dir="ltr"><strong>{x}</strong><small dir="rtl">{AR[x]}</small><span>{group(x)}</span></button>):<p>لم يُعثر على الفعل في الإصدار الحالي.</p>}</div>}</section>
  <nav className="conj-tabs" dir="ltr">{tabs.map(x=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{x}</button>)}</nav>
  <section className="conj-heading"><div><span>{group(v)}</span><h1 dir="ltr">{v}</h1><h2>{AR[v]||"فعل فرنسي"}</h2><p>تصريفات واضحة، وأمثلة سياقية مراجعة في الحاضر. يضيف هذا الإصدار الدفعة الخامسة من الأفعال غير الضميرية مع استعمالاتها وترجمة عربية كاملة ونطق احترافي.</p><div className="conj-review-progress">v5.0 · دفعة المراجعة الخامسة · لا تُعرض أمثلة آلية غير موثوقة</div></div><button onClick={()=>speak(v)}><Volume2/></button></section>
  <UsagePanel verb={v}/>
  <section className="conj-content">{tab==='Indicatif'&&<><h2>Indicatif</h2><div className="conj-grid-pro"><Block title="Présent" forms={rows(p,v)} verb={v}/><Block title="Passé composé" forms={rows(AP[a].map(x=>x+' '+pp),v)} verb={v}/><Block title="Imparfait" forms={rows(imp(v),v)} verb={v}/><Block title="Plus-que-parfait" forms={rows(AI[a].map(x=>x+' '+pp),v)} verb={v}/><Block title="Futur simple" forms={rows(fut(v),v)} verb={v}/><Block title="Futur antérieur" forms={rows(AF[a].map(x=>x+' '+pp),v)} verb={v}/></div></>}
  {tab==='Conditionnel'&&<><h2>Conditionnel</h2><div className="conj-grid-pro"><Block title="Présent" forms={rows(cond(v),v)} verb={v}/><Block title="Passé" forms={rows(["aurais","aurais","aurait","aurions","auriez","auraient"].map(x=>x+' '+pp),v)} verb={v}/></div></>}
  {tab==='Subjonctif'&&<><h2>Subjonctif</h2><div className="conj-grid-pro"><Block title="Présent" forms={sub(v).map((x,i)=>["que je","que tu","qu’il / elle","que nous","que vous","qu’ils / elles"][i]+' '+x)} verb={v}/><Block title="Passé" forms={["que j’aie","que tu aies","qu’il ait","que nous ayons","que vous ayez","qu’ils aient"].map(x=>x+' '+pp)} verb={v}/></div></>}
  {tab==='Impératif'&&<><h2>Impératif</h2><div className="conj-grid-pro"><Block title="Présent" forms={[p[1],p[3],p[4]]} verb={v}/><Block title="Passé" forms={["aie "+pp,"ayons "+pp,"ayez "+pp]} verb={v}/></div></>}
  {tab==='Infinitif'&&<><h2>Infinitif</h2><div className="conj-grid-pro"><Block title="Présent" forms={[v]} verb={v}/><Block title="Passé" forms={[a+' '+pp]} verb={v}/></div></>}
  {tab==='Participe'&&<><h2>Participe</h2><div className="conj-grid-pro"><Block title="Présent" forms={[p[3].replace(/ons$/,'ant')]} verb={v}/><Block title="Passé" forms={[pp,a+' '+pp]} verb={v}/></div></>}
  {tab==='Gérondif'&&<><h2>Gérondif</h2><div className="conj-grid-pro"><Block title="Présent" forms={["en "+p[3].replace(/ons$/,'ant')]} verb={v}/><Block title="Passé" forms={["en ayant "+pp]} verb={v}/></div></>}</section>
 </main>
}
