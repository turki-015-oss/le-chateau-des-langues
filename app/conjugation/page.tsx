"use client";
import {useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft,BookOpen,Search,Volume2,Star,ChevronDown} from "lucide-react";

const P=["je","tu","il / elle","nous","vous","ils / elles"];
const VERBS=['être', 'avoir', 'aller', 'faire', 'pouvoir', 'vouloir', 'devoir', 'savoir', 'venir', 'voir', 'dire', 'prendre', 'mettre', 'partir', 'sortir', 'dormir', 'lire', 'écrire', 'boire', 'croire', 'recevoir', 'vivre', 'connaître', 'naître', 'mourir', 'courir', 'tenir', 'ouvrir', 'offrir', 'attendre', 'entendre', 'répondre', 'vendre', 'perdre', 'rendre', 'descendre', 'apprendre', 'comprendre', 'surprendre', 'parler', 'aimer', 'donner', 'travailler', 'chercher', 'trouver', 'penser', 'demander', 'regarder', 'écouter', 'jouer', 'arriver', 'rester', 'entrer', 'porter', 'passer', 'marcher', 'habiter', 'étudier', 'manger', 'commencer', 'acheter', 'appeler', 'préférer', 'espérer', 'envoyer', 'payer', 'essayer', 'nettoyer', 'employer', 'finir', 'choisir', 'réussir', 'grandir', 'grossir', 'maigrir', 'réfléchir', 'remplir', 'obéir', 'punir', 'bâtir', 'rougir', 'blanchir', 'agir', 'servir', 'sentir', 'mentir', 'couvrir', 'découvrir', 'souffrir', 'cueillir', 'accueillir', 'conduire', 'produire', 'traduire', 'construire', 'détruire', 'cuire', 'suivre', 'poursuivre', 'rire', 'sourire', 'plaire', 'taire', 'décrire', 'inscrire', 'reconnaître', 'paraître', 'apparaître', 'disparaître', 'valoir', 'falloir', 'pleuvoir', 'asseoir', 'fuir', 'conclure', 'inclure', 'exclure', 'résoudre', 'craindre', 'peindre', 'joindre', 'atteindre', 'éteindre', 'vaincre', 'convaincre', 'battre', 'rompre', 'interrompre', 'promettre', 'permettre', 'admettre', 'remettre', 'commettre', 'transmettre', 'reprendre', 'entreprendre', 'devenir', 'revenir', 'parvenir', 'prévenir', 'intervenir', 'obtenir', 'retenir', 'maintenir', 'parcourir', 'secourir', 'se lever', 'se laver', 'se coucher', 'se réveiller', "s’habiller", "se déshabiller", 'se préparer', 'se présenter', 'se reposer', 'se promener', 'se dépêcher', 'se marier', 'se souvenir', "s’appeler", "s’intéresser", "s’inquiéter", 'se sentir', 'se tromper', 'se perdre', 'se rencontrer', 'se parler', 'se voir', 'se comprendre', 'se demander', 'se servir', 'se rendre', 'se mettre', "s’arrêter", "s’amuser", 'se concentrer'];
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
"être":{p:["suis","es","est","sommes","êtes","sont"],pp:"été",f:"ser",imp:"ét"},"avoir":{p:["ai","as","a","avons","avez","ont"],pp:"eu",f:"aur",imp:"av"},"aller":{p:["vais","vas","va","allons","allez","vont"],pp:"allé",f:"ir",imp:"all"},"faire":{p:["fais","fais","fait","faisons","faites","font"],pp:"fait",f:"fer"},"pouvoir":{p:["peux","peux","peut","pouvons","pouvez","peuvent"],pp:"pu",f:"pourr"},"vouloir":{p:["veux","veux","veut","voulons","voulez","veulent"],pp:"voulu",f:"voudr"},"devoir":{p:["dois","dois","doit","devons","devez","doivent"],pp:"dû",f:"devr"},"savoir":{p:["sais","sais","sait","savons","savez","savent"],pp:"su",f:"saur"},"venir":{p:["viens","viens","vient","venons","venez","viennent"],pp:"venu",f:"viendr"},"tenir":{p:["tiens","tiens","tient","tenons","tenez","tiennent"],pp:"tenu",f:"tiendr"},"voir":{p:["vois","vois","voit","voyons","voyez","voient"],pp:"vu",f:"verr"},"dire":{p:["dis","dis","dit","disons","dites","disent"],pp:"dit",f:"dir"},"prendre":{p:["prends","prends","prend","prenons","prenez","prennent"],pp:"pris",f:"prendr"},"mettre":{p:["mets","mets","met","mettons","mettez","mettent"],pp:"mis",f:"mettr"},"partir":{p:["pars","pars","part","partons","partez","partent"],pp:"parti",f:"partir"},"sortir":{p:["sors","sors","sort","sortons","sortez","sortent"],pp:"sorti",f:"sortir"},"dormir":{p:["dors","dors","dort","dormons","dormez","dorment"],pp:"dormi",f:"dormir"},"lire":{p:["lis","lis","lit","lisons","lisez","lisent"],pp:"lu",f:"lir"},"écrire":{p:["écris","écris","écrit","écrivons","écrivez","écrivent"],pp:"écrit",f:"écrir"},"boire":{p:["bois","bois","boit","buvons","buvez","boivent"],pp:"bu",f:"boir"},"croire":{p:["crois","crois","croit","croyons","croyez","croient"],pp:"cru",f:"croir"},"recevoir":{p:["reçois","reçois","reçoit","recevons","recevez","reçoivent"],pp:"reçu",f:"recevr"},"vivre":{p:["vis","vis","vit","vivons","vivez","vivent"],pp:"vécu",f:"vivr"},"connaître":{p:["connais","connais","connaît","connaissons","connaissez","connaissent"],pp:"connu",f:"connaîtr"},"naître":{p:["nais","nais","naît","naissons","naissez","naissent"],pp:"né",f:"naîtr"},"mourir":{p:["meurs","meurs","meurt","mourons","mourez","meurent"],pp:"mort",f:"mourr"},"courir":{p:["cours","cours","court","courons","courez","courent"],pp:"couru",f:"courr"},"ouvrir":{p:["ouvre","ouvres","ouvre","ouvrons","ouvrez","ouvrent"],pp:"ouvert",f:"ouvrir"},"offrir":{p:["offre","offres","offre","offrons","offrez","offrent"],pp:"offert",f:"offrir"},"appeler":{p:["appelle","appelles","appelle","appelons","appelez","appellent"],pp:"appelé",f:"appeller"},"inquiéter":{p:["inquiète","inquiètes","inquiète","inquiétons","inquiétez","inquiètent"],pp:"inquiété",f:"inquiéter"},"souvenir":{p:["souviens","souviens","souvient","souvenons","souvenez","souviennent"],pp:"souvenu",f:"souviendr"},"comprendre":{p:["comprends","comprends","comprend","comprenons","comprenez","comprennent"],pp:"compris",f:"comprendr"}};

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
  <section className="conj-heading"><div><span>{group(v)}</span><h1 dir="ltr">{v}</h1><h2>{AR[v]||"فعل فرنسي"}</h2><p>تصريفات واضحة، وأمثلة سياقية مراجعة في الحاضر. يضيف هذا الإصدار الدفعة الثانية من الأفعال غير الضميرية مع استعمالاتها وترجمة عربية كاملة ونطق احترافي.</p><div className="conj-review-progress">v5.0 · دفعة المراجعة الثانية · لا تُعرض أمثلة آلية غير موثوقة</div></div><button onClick={()=>speak(v)}><Volume2/></button></section>
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
