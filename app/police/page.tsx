"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, Car, ChevronLeft, FileWarning, Headphones, IdCard, KeyRound, Menu, MessageCircle, PackageSearch, ShieldCheck, Siren, Smartphone, Star, Volume2, WalletCards } from "lucide-react";

const sections = [
  { id: "accueil", fr: "Accueil", ar: "الاستقبال", image: "/police-v39/accueil.webp", icon: ShieldCheck },
  { id: "vol", fr: "Déclarer un vol", ar: "الإبلاغ عن سرقة", image: "/police-v39/vol.webp", icon: FileWarning },
  { id: "passeport", fr: "Passeport perdu", ar: "جواز سفر مفقود", image: "/police-v39/passeport.webp", icon: IdCard },
  { id: "accident", fr: "Accident de voiture", ar: "حادث سيارة", image: "/police-v39/accident.webp", icon: Siren },
  { id: "objets", fr: "Objets trouvés", ar: "أغراض مفقودة", image: "/police-v39/objets.webp", icon: PackageSearch },
  { id: "vehicules", fr: "Véhicules de police", ar: "مركبات الشرطة", image: "/police-v39/vehicules.webp", icon: Car },
  { id: "grades", fr: "Les grades", ar: "الرتب الشرطية", image: "/police-v39/grades.webp", icon: Star },
  { id: "conversation", fr: "Conversations", ar: "المحادثات", image: "/police-v39/conversation.webp", icon: MessageCircle },
];

const phrases = [
  ["Bonjour, que s'est-il passé ?", "مرحبًا، ماذا حدث؟"],
  ["Je voudrais faire une déclaration.", "أريد تقديم بلاغ."],
  ["On m'a volé mon téléphone.", "لقد سرقوا هاتفي."],
  ["Où cela s'est-il passé ?", "أين حدث ذلك؟"],
  ["Devant le café, vers dix-huit heures.", "أمام المقهى، قرابة الساعة السادسة."],
  ["Pouvez-vous décrire le voleur ?", "هل تستطيع وصف السارق؟"],
];

const vocab = [
  { fr: "Le passeport", ar: "جواز السفر", image: "/police-v39/vocab-passport.webp", Icon: IdCard },
  { fr: "Le téléphone", ar: "الهاتف", image: "/police-v39/vocab-phone.webp", Icon: Smartphone },
  { fr: "Le portefeuille", ar: "المحفظة", image: "/police-v39/vocab-wallet.webp", Icon: WalletCards },
  { fr: "Les clés", ar: "المفاتيح", image: "/police-v39/vocab-keys.webp", Icon: KeyRound },
  { fr: "Le sac", ar: "الحقيبة", image: "/police-v39/vocab-bag.webp", Icon: PackageSearch },
  { fr: "Le voleur", ar: "السارق", image: "/police-v39/vocab-thief.webp", Icon: FileWarning },
];

const quiz = [
  { q: "Qu'est-ce qu'on a volé à Karim ?", ar: "ماذا سُرق من كريم؟", options: ["Son passeport", "Son téléphone", "Sa voiture"], answer: 1 },
  { q: "Où le vol a-t-il eu lieu ?", ar: "أين وقعت السرقة؟", options: ["Devant le café", "À l'hôtel", "Dans l'avion"], answer: 0 },
];

export default function PolicePage() {
  const [active, setActive] = useState("accueil");
  const [answer, setAnswer] = useState<number | null>(null);
  const [question, setQuestion] = useState(0);

  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };

  const current = sections.find((item) => item.id === active) ?? sections[0];

  return (
    <main className="police-world">
      <header className="police-topbar">
        <Link href="/kingdom" className="police-icon-button" aria-label="Retour à la carte"><ArrowRight size={22} /></Link>
        <div><span>مركز الشرطة</span><strong>Le Commissariat de Police</strong></div>
        <button className="police-icon-button" aria-label="Menu"><Menu size={22} /></button>
      </header>

      <section className="police-hero">
        <img src="/police-v39/hero.webp" alt="Commissariat de police" />
        <div className="police-hero-overlay">
          <span className="police-badge"><ShieldCheck size={18}/> Monde de la police</span>
          <h1>Le Commissariat</h1>
          <p>تعلّم الفرنسية من خلال البلاغات، المفقودات والمواقف الأمنية اليومية.</p>
          <button onClick={() => speak("Bonjour, bienvenue au commissariat. Comment puis-je vous aider ?")}>
            <Volume2 size={20}/> Bonjour, bienvenue au commissariat.
          </button>
        </div>
      </section>

      <section className="police-section-grid" aria-label="Sections du commissariat">
        {sections.map(({ id, fr, ar, image, icon: Icon }, index) => (
          <button key={id} className={`police-section-card ${active === id ? "active" : ""}`} onClick={() => setActive(id)}>
            <img src={image} alt={fr} />
            <span className="police-section-number">{index + 1}</span>
            <div><Icon size={18}/><strong>{fr}</strong><small>{ar}</small></div>
          </button>
        ))}
      </section>

      <section className="police-content-panel">
        <div className="police-panel-heading">
          <div><span>{current.ar}</span><h2>{current.fr}</h2></div>
          <button onClick={() => speak(current.fr)}><Volume2 size={19}/></button>
        </div>
        <div className="police-dialogue-layout">
          <img src={current.image} alt={current.fr}/>
          <div className="police-dialogues">
            {phrases.slice(0, active === "conversation" || active === "vol" ? 6 : 4).map(([fr, ar], i) => (
              <button key={fr} className={i % 2 ? "visitor" : "officer"} onClick={() => speak(fr)}>
                <span><strong>{fr}</strong><small>{ar}</small></span><Volume2 size={18}/>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="police-content-panel">
        <div className="police-panel-heading">
          <div><span>المفردات الأساسية</span><h2>Le vocabulaire</h2></div><BookOpen size={24}/>
        </div>
        <div className="police-vocab-grid">
          {vocab.map(({ fr, ar, image, Icon }) => (
            <article key={fr} className="police-vocab-card">
              <img src={image} alt={fr}/>
              <div><Icon size={17}/><strong>{fr}</strong><small>{ar}</small></div>
              <button onClick={() => speak(fr)} aria-label={`Écouter ${fr}`}><Volume2 size={17}/></button>
            </article>
          ))}
        </div>
      </section>

      <section className="police-story-card">
        <div className="police-story-image"><img src="/police-v39/story.webp" alt="Karim au commissariat"/><span>Histoire A1</span></div>
        <div className="police-story-copy">
          <span>قصة مصغرة</span><h2>Karim au commissariat</h2>
          <p>Karim va au commissariat parce qu'on lui a volé son téléphone. Il explique au policier où et quand le vol s'est passé. Le policier prend sa déclaration et lui donne un numéro de dossier.</p>
          <p className="arabic">يذهب كريم إلى مركز الشرطة لأن هاتفه سُرق. يشرح للشرطي أين ومتى وقعت السرقة، ثم يسجل الشرطي البلاغ ويعطيه رقم القضية.</p>
          <button onClick={() => speak("Karim va au commissariat parce qu'on lui a volé son téléphone. Il explique au policier où et quand le vol s'est passé. Le policier prend sa déclaration et lui donne un numéro de dossier.")}><Headphones size={20}/> Écouter l'histoire</button>
        </div>
      </section>

      <section className="police-content-panel police-quiz">
        <div className="police-panel-heading"><div><span>اختبار الفهم</span><h2>Exercice</h2></div><span>{question + 1} / {quiz.length}</span></div>
        <h3>{quiz[question].q}</h3><p>{quiz[question].ar}</p>
        <div className="police-options">
          {quiz[question].options.map((option, index) => (
            <button key={option} className={answer === index ? (index === quiz[question].answer ? "correct" : "wrong") : ""} onClick={() => setAnswer(index)}>
              <span>{String.fromCharCode(65 + index)}.</span>{option}
            </button>
          ))}
        </div>
        <button className="police-next" onClick={() => { setQuestion((question + 1) % quiz.length); setAnswer(null); }}>Suivant <ChevronLeft size={18}/></button>
      </section>
    </main>
  );
}
