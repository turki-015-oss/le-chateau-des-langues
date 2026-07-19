"use client";
import {useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft,BookOpen,Search,Volume2,Star,ChevronDown} from "lucide-react";

const P=["je","tu","il / elle","nous","vous","ils / elles"];
const VERBS=['être', 'avoir', 'aller', 'faire', 'pouvoir', 'vouloir', 'devoir', 'savoir', 'venir', 'voir', 'dire', 'prendre', 'mettre', 'partir', 'sortir', 'dormir', 'lire', 'écrire', 'boire', 'croire', 'recevoir', 'vivre', 'connaître', 'naître', 'mourir', 'courir', 'tenir', 'ouvrir', 'offrir', 'attendre', 'entendre', 'répondre', 'vendre', 'perdre', 'rendre', 'descendre', 'apprendre', 'comprendre', 'surprendre', 'parler', 'aimer', 'donner', 'travailler', 'chercher', 'trouver', 'penser', 'demander', 'regarder', 'écouter', 'jouer', 'arriver', 'rester', 'entrer', 'porter', 'passer', 'marcher', 'habiter', 'étudier', 'manger', 'commencer', 'acheter', 'appeler', 'préférer', 'espérer', 'envoyer', 'payer', 'essayer', 'nettoyer', 'employer', 'finir', 'choisir', 'réussir', 'grandir', 'grossir', 'maigrir', 'réfléchir', 'remplir', 'obéir', 'punir', 'bâtir', 'rougir', 'blanchir', 'agir', 'servir', 'sentir', 'mentir', 'couvrir', 'découvrir', 'souffrir', 'cueillir', 'accueillir', 'conduire', 'produire', 'traduire', 'construire', 'détruire', 'cuire', 'suivre', 'poursuivre', 'rire', 'sourire', 'plaire', 'taire', 'décrire', 'inscrire', 'reconnaître', 'paraître', 'apparaître', 'disparaître', 'valoir', 'falloir', 'pleuvoir', 'asseoir', 'fuir', 'conclure', 'inclure', 'exclure', 'résoudre', 'craindre', 'peindre', 'joindre', 'atteindre', 'éteindre', 'vaincre', 'convaincre', 'battre', 'rompre', 'interrompre', 'promettre', 'permettre', 'admettre', 'remettre', 'commettre', 'transmettre', 'reprendre', 'entreprendre', 'devenir', 'revenir', 'parvenir', 'prévenir', 'intervenir', 'obtenir', 'retenir', 'maintenir', 'parcourir', 'secourir'];
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
};
const I:Record<string,{p:string[],pp:string,f:string,imp?:string}>={
"être":{p:["suis","es","est","sommes","êtes","sont"],pp:"été",f:"ser",imp:"ét"},"avoir":{p:["ai","as","a","avons","avez","ont"],pp:"eu",f:"aur",imp:"av"},"aller":{p:["vais","vas","va","allons","allez","vont"],pp:"allé",f:"ir",imp:"all"},"faire":{p:["fais","fais","fait","faisons","faites","font"],pp:"fait",f:"fer"},"pouvoir":{p:["peux","peux","peut","pouvons","pouvez","peuvent"],pp:"pu",f:"pourr"},"vouloir":{p:["veux","veux","veut","voulons","voulez","veulent"],pp:"voulu",f:"voudr"},"devoir":{p:["dois","dois","doit","devons","devez","doivent"],pp:"dû",f:"devr"},"savoir":{p:["sais","sais","sait","savons","savez","savent"],pp:"su",f:"saur"},"venir":{p:["viens","viens","vient","venons","venez","viennent"],pp:"venu",f:"viendr"},"tenir":{p:["tiens","tiens","tient","tenons","tenez","tiennent"],pp:"tenu",f:"tiendr"},"voir":{p:["vois","vois","voit","voyons","voyez","voient"],pp:"vu",f:"verr"},"dire":{p:["dis","dis","dit","disons","dites","disent"],pp:"dit",f:"dir"},"prendre":{p:["prends","prends","prend","prenons","prenez","prennent"],pp:"pris",f:"prendr"},"mettre":{p:["mets","mets","met","mettons","mettez","mettent"],pp:"mis",f:"mettr"},"partir":{p:["pars","pars","part","partons","partez","partent"],pp:"parti",f:"partir"},"sortir":{p:["sors","sors","sort","sortons","sortez","sortent"],pp:"sorti",f:"sortir"},"dormir":{p:["dors","dors","dort","dormons","dormez","dorment"],pp:"dormi",f:"dormir"},"lire":{p:["lis","lis","lit","lisons","lisez","lisent"],pp:"lu",f:"lir"},"écrire":{p:["écris","écris","écrit","écrivons","écrivez","écrivent"],pp:"écrit",f:"écrir"},"boire":{p:["bois","bois","boit","buvons","buvez","boivent"],pp:"bu",f:"boir"},"croire":{p:["crois","crois","croit","croyons","croyez","croient"],pp:"cru",f:"croir"},"recevoir":{p:["reçois","reçois","reçoit","recevons","recevez","reçoivent"],pp:"reçu",f:"recevr"},"vivre":{p:["vis","vis","vit","vivons","vivez","vivent"],pp:"vécu",f:"vivr"},"connaître":{p:["connais","connais","connaît","connaissons","connaissez","connaissent"],pp:"connu",f:"connaîtr"},"naître":{p:["nais","nais","naît","naissons","naissez","naissent"],pp:"né",f:"naîtr"},"mourir":{p:["meurs","meurs","meurt","mourons","mourez","meurent"],pp:"mort",f:"mourr"},"courir":{p:["cours","cours","court","courons","courez","courent"],pp:"couru",f:"courr"},"ouvrir":{p:["ouvre","ouvres","ouvre","ouvrons","ouvrez","ouvrent"],pp:"ouvert",f:"ouvrir"},"offrir":{p:["offre","offres","offre","offrons","offrez","offrent"],pp:"offert",f:"offrir"}};

const stem=(v:string)=>v.endsWith("er")||v.endsWith("ir")?v.slice(0,-2):v.replace(/re$/," ").trim();
const group=(v:string)=>v.endsWith("er")&&v!=="aller"?"1er groupe":v.endsWith("ir")?"2e / 3e groupe":"3e groupe";
const pres=(v:string)=>I[v]?.p||(v.endsWith("er")?[stem(v)+"e",stem(v)+"es",stem(v)+"e",stem(v)+"ons",stem(v)+"ez",stem(v)+"ent"]:v.endsWith("ir")?[stem(v)+"is",stem(v)+"is",stem(v)+"it",stem(v)+"issons",stem(v)+"issez",stem(v)+"issent"]:[stem(v)+"s",stem(v)+"s",stem(v),stem(v)+"ons",stem(v)+"ez",stem(v)+"ent"]);
const part=(v:string)=>I[v]?.pp||(v.endsWith("er")?stem(v)+"é":v.endsWith("ir")?stem(v)+"i":stem(v)+"u");
const fs=(v:string)=>I[v]?.f||(v.endsWith("re")?v.slice(0,-1):v);
const imp=(v:string)=>{const r=I[v]?.imp||pres(v)[3].replace(/ons$/," ").trim();return [r+"ais",r+"ais",r+"ait",r+"ions",r+"iez",r+"aient"]};
const fut=(v:string)=>["ai","as","a","ons","ez","ont"].map(x=>fs(v)+x);
const cond=(v:string)=>["ais","ais","ait","ions","iez","aient"].map(x=>fs(v)+x);
const sub=(v:string)=>{const r=pres(v)[5].replace(/ent$/," ").trim();return [r+"e",r+"es",r+"e",r+"ions",r+"iez",r+"ent"]};
const aux=(v:string)=>["aller","venir","partir","sortir","naître","mourir","arriver","entrer","rester","descendre","retourner","tomber"].includes(v)?"être":"avoir";
const AP={avoir:["ai","as","a","avons","avez","ont"],être:["suis","es","est","sommes","êtes","sont"]};
const AI={avoir:["avais","avais","avait","avions","aviez","avaient"],être:["étais","étais","était","étions","étiez","étaient"]};
const AF={avoir:["aurai","auras","aura","aurons","aurez","auront"],être:["serai","seras","sera","serons","serez","seront"]};
const rows=(x:string[])=>x.map((f,i)=>P[i]+" "+f);
const contexts=[
  ["aujourd’hui avec beaucoup d’attention.","اليوم باهتمام كبير."],
  ["chaque matin avant de commencer la journée.","كل صباح قبل بدء اليوم."],
  ["dans une situation nouvelle et intéressante.","في موقف جديد ومثير للاهتمام."],
  ["avec mes collègues pendant la réunion.","مع زملائي أثناء الاجتماع."],
  ["quand le moment est vraiment important.","عندما تكون اللحظة مهمة فعلًا."],
  ["pour atteindre un objectif clair.","لتحقيق هدف واضح."],
  ["sans hésiter devant les autres.","من دون تردد أمام الآخرين."],
  ["avec calme malgré les difficultés.","بهدوء رغم الصعوبات."],
  ["dans la ville pendant le week-end.","في المدينة خلال عطلة نهاية الأسبوع."],
  ["pour mieux comprendre cette expérience.","لفهم هذه التجربة بصورة أفضل."],
  ["après avoir préparé tous les détails.","بعد تجهيز جميع التفاصيل."],
  ["avec confiance dans ce nouveau projet.","بثقة في هذا المشروع الجديد."]
];
function speak(t:string){if(typeof window==='undefined'||!('speechSynthesis'in window))return;const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';u.rate=.82;u.pitch=1;const voices=speechSynthesis.getVoices();u.voice=voices.find(x=>x.lang.toLowerCase().startsWith('fr'))||null;speechSynthesis.cancel();speechSynthesis.speak(u)}
function cap(s:string){return s.charAt(0).toUpperCase()+s.slice(1)}
function ExampleRow({form,index,seed}:{form:string,index:number,seed:number}){const c=contexts[(index+seed)%contexts.length];const sentence=cap(form)+" "+c[0];return <article className="conj-example-row"><div className="conj-form-line" dir="ltr"><strong>{form}</strong><button onClick={()=>speak(form)} aria-label="نطق التصريف"><Volume2/></button></div><div className="conj-example-copy"><p dir="ltr">{sentence}</p><small>{c[1]}</small></div><button className="conj-sentence-audio" onClick={()=>speak(sentence)} aria-label="نطق المثال"><Volume2/></button></article>}
function Block({title,forms,seed}:{title:string,forms:string[],seed:number}){return <section className="conj-tense-pro"><h3>{title}<span>{forms.length} formes</span></h3><div>{forms.map((x,i)=><ExampleRow key={i} form={x} index={i} seed={seed}/>)}</div></section>}
export default function Page(){
 const r=useRouter(),[q,setQ]=useState(""),[v,setV]=useState("être"),[tab,setTab]=useState("Indicatif"),[openSearch,setOpenSearch]=useState(false);
 const list=useMemo(()=>VERBS.filter(x=>x.includes(q.toLowerCase().trim())).slice(0,100),[q]);
 const p=pres(v),pp=part(v),a=aux(v) as "avoir"|"être";
 const tabs=["Indicatif","Conditionnel","Subjonctif","Impératif","Infinitif","Participe","Gérondif"];
 return <main className="conj-page conj-pro" dir="rtl">
  <header className="conj-top"><button onClick={()=>r.push('/castle')}><ArrowLeft/></button><div><BookOpen/><span><strong>قاعة تصريف الأفعال</strong><small>La Salle de Conjugaison</small></span></div><div className="conj-rating"><Star/><Star/><Star/><Star/><Star/></div></header>
  <section className="conj-search-wrap"><div className="conj-search"><Search/><input dir="ltr" value={q} onFocus={()=>setOpenSearch(true)} onChange={e=>{setQ(e.target.value);setOpenSearch(true)}} placeholder="Rechercher un verbe..."/><ChevronDown/></div>{openSearch&&q&&<div className="conj-results">{list.length?list.map(x=><button key={x} onClick={()=>{setV(x);setQ('');setOpenSearch(false)}} dir="ltr"><strong>{x}</strong><small dir="rtl">{AR[x]}</small><span>{group(x)}</span></button>):<p>لم يُعثر على الفعل في الإصدار الحالي.</p>}</div>}</section>
  <nav className="conj-tabs" dir="ltr">{tabs.map(x=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{x}</button>)}</nav>
  <section className="conj-heading"><div><span>{group(v)}</span><h1 dir="ltr">{v}</h1><h2>{AR[v]||"فعل فرنسي"}</h2><p>تصريفات واضحة، أمثلة مختلفة، وترجمة عربية مع نطق فرنسي احترافي.</p></div><button onClick={()=>speak(v)}><Volume2/></button></section>
  <section className="conj-content">{tab==='Indicatif'&&<><h2>Indicatif</h2><div className="conj-grid-pro"><Block title="Présent" forms={rows(p)} seed={0}/><Block title="Passé composé" forms={rows(AP[a].map(x=>x+' '+pp))} seed={2}/><Block title="Imparfait" forms={rows(imp(v))} seed={4}/><Block title="Plus-que-parfait" forms={rows(AI[a].map(x=>x+' '+pp))} seed={6}/><Block title="Futur simple" forms={rows(fut(v))} seed={8}/><Block title="Futur antérieur" forms={rows(AF[a].map(x=>x+' '+pp))} seed={10}/></div></>}
  {tab==='Conditionnel'&&<><h2>Conditionnel</h2><div className="conj-grid-pro"><Block title="Présent" forms={rows(cond(v))} seed={1}/><Block title="Passé" forms={rows(["aurais","aurais","aurait","aurions","auriez","auraient"].map(x=>x+' '+pp))} seed={7}/></div></>}
  {tab==='Subjonctif'&&<><h2>Subjonctif</h2><div className="conj-grid-pro"><Block title="Présent" forms={sub(v).map((x,i)=>["que je","que tu","qu’il / elle","que nous","que vous","qu’ils / elles"][i]+' '+x)} seed={3}/><Block title="Passé" forms={["que j’aie","que tu aies","qu’il ait","que nous ayons","que vous ayez","qu’ils aient"].map(x=>x+' '+pp)} seed={9}/></div></>}
  {tab==='Impératif'&&<><h2>Impératif</h2><div className="conj-grid-pro"><Block title="Présent" forms={[p[1],p[3],p[4]]} seed={4}/><Block title="Passé" forms={["aie "+pp,"ayons "+pp,"ayez "+pp]} seed={8}/></div></>}
  {tab==='Infinitif'&&<><h2>Infinitif</h2><div className="conj-grid-pro"><Block title="Présent" forms={[v]} seed={2}/><Block title="Passé" forms={[a+' '+pp]} seed={6}/></div></>}
  {tab==='Participe'&&<><h2>Participe</h2><div className="conj-grid-pro"><Block title="Présent" forms={[p[3].replace(/ons$/,'ant')]} seed={5}/><Block title="Passé" forms={[pp,a+' '+pp]} seed={11}/></div></>}
  {tab==='Gérondif'&&<><h2>Gérondif</h2><div className="conj-grid-pro"><Block title="Présent" forms={["en "+p[3].replace(/ons$/,'ant')]} seed={0}/><Block title="Passé" forms={["en ayant "+pp]} seed={7}/></div></>}</section>
 </main>
}
