"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Volume2, X } from "lucide-react";

const worlds = [
  {title:"حي العائلة", fr:"Le Quartier Familial", level:"A1", scene:"أطفال يركضون في حديقة عربية، وأب وأم قرب منزل حجري حول القلعة.", position:"family"},
  {title:"السوق الشعبي", fr:"Le Marché", level:"A1", scene:"سوق خضار عربي شعبي مليء بالفواكه والتوابل والباعة والزوّار.", position:"market"},
  {title:"المطعم", fr:"Le Restaurant", level:"A2", scene:"مطعم عربي واقعي بفوانيس وطاولات خارجية وإطلالة مباشرة على القلعة.", position:"restaurant"},
  {title:"المستشفى", fr:"L’Hôpital", level:"B1", scene:"مستشفى حديث بطابع عربي مع أطباء وممرضين وسيارة إسعاف.", position:"hospital"},
  {title:"المواصلات", fr:"Les Transports", level:"A2", scene:"حصان عربي يركض بمحاذاة قطار حديث، وخلفهما أبراج القلعة.", position:"transport"},
  {title:"المطار", fr:"L’Aéroport", level:"A2", scene:"طائرة تقلع ومسافرون يحملون حقائبهم، والقلعة تظهر في الأفق.", position:"airport"},
];

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [selected, setSelected] = useState<(typeof worlds)[number] | null>(null);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("chateau-entered");
    if (saved === "yes") setEntered(true);
  }, []);

  const enter = () => {
    setEntered(true);
    localStorage.setItem("chateau-entered", "yes");
  };

  if (!entered) {
    return (
      <main className="intro">
        <div className="introShade" />
        <header className="introHeader">
          <div className="brandMini">🏰 <span>Le Château des Langues</span></div>
          <button className="soundToggle" onClick={() => setSound(!sound)}><Volume2 size={18}/> {sound ? "الصوت يعمل" : "تشغيل الصوت"}</button>
        </header>
        <section className="introContent">
          <span className="introEyebrow">Bienvenue au</span>
          <h1>Le Château<br/><em>des Langues</em></h1>
          <p>Chaque mot ouvre une porte.</p>
          <small>كل كلمة تفتح بابًا.</small>
          <button className="enterButton" onClick={enter}>ادخل القلعة</button>
          <a href="#kingdom" onClick={enter}>تخطي المقدمة <ChevronDown size={16}/></a>
        </section>
      </main>
    );
  }

  return (
    <main className="kingdomPage" id="kingdom">
      <header className="mainHeader">
        <div className="brandMini">🏰 <span>Le Château des Langues</span></div>
        <nav><a href="#worlds">العوالم</a><a href="#lesson">الدرس الحالي</a><a href="#progress">تقدمي</a></nav>
        <button className="profile">فارس القلعة · المستوى 23</button>
      </header>

      <section className="mapHero">
        <img src="/kingdom-map.png" alt="خريطة المملكة والقلعة العربية الخضراء" />
        <div className="mapOverlay">
          <span>كل العوالم مفتوحة</span>
          <h2>اختر مكانك داخل المملكة</h2>
          <p>تعلّم الفرنسية من خلال مواقف حقيقية داخل عالم عربي متكامل.</p>
        </div>
      </section>

      <section className="worldSection" id="worlds">
        <div className="sectionHead"><div><span>مشاهد واقعية</span><h2>عوالم القلعة</h2></div><p>جميع المناطق متاحة من البداية.</p></div>
        <div className="realWorldGrid">
          {worlds.map((world, index) => (
            <button key={world.fr} className={`realWorldCard card-${index+1}`} onClick={() => setSelected(world)}>
              <div className="worldShade"/>
              <div className="worldInfo">
                <span>{world.level}</span>
                <h3>{world.title}</h3>
                <p>{world.fr}</p>
                <small>{world.scene}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="lessonPreview" id="lesson">
        <div>
          <span>الدرس الحالي</span>
          <h2>La Porte des Salutations</h2>
          <p>ابدأ بالتحيات والتعارف والنطق الصحيح من داخل بوابة القلعة.</p>
          <button onClick={() => setSelected({title:"بوابة التحيات", fr:"La Porte des Salutations", level:"A1", scene:"حارس القلعة يرحب بك وتبدأ أول محادثة فرنسية.", position:"gate"})}>ابدأ الدرس</button>
        </div>
        <div className="lessonStat"><b>12</b><span>كلمة</span><b>8</b><span>جمل</span><b>5</b><span>تمارين</span></div>
      </section>

      {selected && <div className="modal" onClick={() => setSelected(null)}><div className="modalCard" onClick={e=>e.stopPropagation()}>
        <button className="modalClose" onClick={() => setSelected(null)}><X/></button>
        <span className="levelTag">{selected.level}</span>
        <h2>{selected.title}</h2><h3>{selected.fr}</h3><p>{selected.scene}</p>
        <button className="startWorld">دخول العالم</button>
      </div></div>}

      <footer>Le Château des Langues · v0.2</footer>
    </main>
  );
}
