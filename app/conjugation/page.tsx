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
  <section className="conj-heading"><div><span>{group(v)}</span><h1 dir="ltr">{v}</h1><h2>{AR[v]||"فعل فرنسي"}</h2><p>تصريفات واضحة، وأمثلة سياقية مراجعة في الحاضر لجميع الأفعال الضميرية، وترجمة عربية كاملة مع النطق.</p></div><button onClick={()=>speak(v)}><Volume2/></button></section>
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
