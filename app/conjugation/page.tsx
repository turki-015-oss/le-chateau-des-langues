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
"être":{p:["suis","es","est","sommes","êtes","sont"],pp:"été",f:"ser",imp:"ét"},"avoir":{p:["ai","as","a","avons","avez","ont"],pp:"eu",f:"aur",imp:"av"},"aller":{p:["vais","vas","va","allons","allez","vont"],pp:"allé",f:"ir",imp:"all"},"faire":{p:["fais","fais","fait","faisons","faites","font"],pp:"fait",f:"fer"},"pouvoir":{p:["peux","peux","peut","pouvons","pouvez","peuvent"],pp:"pu",f:"pourr"},"vouloir":{p:["veux","veux","veut","voulons","voulez","veulent"],pp:"voulu",f:"voudr"},"devoir":{p:["dois","dois","doit","devons","devez","doivent"],pp:"dû",f:"devr"},"savoir":{p:["sais","sais","sait","savons","savez","savent"],pp:"su",f:"saur"},"venir":{p:["viens","viens","vient","venons","venez","viennent"],pp:"venu",f:"viendr"},"tenir":{p:["tiens","tiens","tient","tenons","tenez","tiennent"],pp:"tenu",f:"tiendr"},"voir":{p:["vois","vois","voit","voyons","voyez","voient"],pp:"vu",f:"verr"},"dire":{p:["dis","dis","dit","disons","dites","disent"],pp:"dit",f:"dir"},"prendre":{p:["prends","prends","prend","prenons","prenez","prennent"],pp:"pris",f:"prendr"},"mettre":{p:["mets","mets","met","mettons","mettez","mettent"],pp:"mis",f:"mettr"},"partir":{p:["pars","pars","part","partons","partez","partent"],pp:"parti",f:"partir"},"sortir":{p:["sors","sors","sort","sortons","sortez","sortent"],pp:"sorti",f:"sortir"},"dormir":{p:["dors","dors","dort","dormons","dormez","dorment"],pp:"dormi",f:"dormir"},"lire":{p:["lis","lis","lit","lisons","lisez","lisent"],pp:"lu",f:"lir"},"écrire":{p:["écris","écris","écrit","écrivons","écrivez","écrivent"],pp:"écrit",f:"écrir"},"boire":{p:["bois","bois","boit","buvons","buvez","boivent"],pp:"bu",f:"boir"},"croire":{p:["crois","crois","croit","croyons","croyez","croient"],pp:"cru",f:"croir"},"recevoir":{p:["reçois","reçois","reçoit","recevons","recevez","reçoivent"],pp:"reçu",f:"recevr"},"vivre":{p:["vis","vis","vit","vivons","vivez","vivent"],pp:"vécu",f:"vivr"},"connaître":{p:["connais","connais","connaît","connaissons","connaissez","connaissent"],pp:"connu",f:"connaîtr"},"naître":{p:["nais","nais","naît","naissons","naissez","naissent"],pp:"né",f:"naîtr"},"mourir":{p:["meurs","meurs","meurt","mourons","mourez","meurent"],pp:"mort",f:"mourr"},"courir":{p:["cours","cours","court","courons","courez","courent"],pp:"couru",f:"courr"},"ouvrir":{p:["ouvre","ouvres","ouvre","ouvrons","ouvrez","ouvrent"],pp:"ouvert",f:"ouvrir"},"offrir":{p:["offre","offres","offre","offrons","offrez","offrent"],pp:"offert",f:"offrir"}};

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
"se promener":[["Je me promène au bord de la mer chaque matin.","أنا أتجوّل على شاطئ البحر كل صباح."],["Tu te promènes avec ton chien dans le parc.","أنت تتنزّه مع كلبك في الحديقة."],["Elle se promène dans les vieux quartiers de la ville.","هي تتجوّل في أحياء المدينة القديمة."],["Nous nous promenons après le dîner.","نحن نتنزّه بعد العشاء."],["Vous vous promenez malgré le temps frais.","أنتم تتنزّهون رغم برودة الطقس."],["Ils se promènent le long de la rivière.","هم يتنزّهون بمحاذاة النهر."]]
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
  <section className="conj-heading"><div><span>{group(v)}</span><h1 dir="ltr">{v}</h1><h2>{AR[v]||"فعل فرنسي"}</h2><p>تصريفات واضحة، أمثلة مختلفة، وترجمة عربية مع نطق فرنسي احترافي.</p></div><button onClick={()=>speak(v)}><Volume2/></button></section>
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
