import type { Metadata } from "next";
import GrandHall from "./GrandHall";

export const metadata: Metadata = {
  title: "القاعة الكبرى | La Grande Salle",
  description: "كيف تتعلم ومن أين تبدأ — دليل استخدام قلعة اللغات ونصائح الدراسة والمراجعة.",
};

const guides = [
  {
    id: "start", ar: "من أين أبدأ؟", fr: "Par où commencer ?",
    items: [
      { ar: "إذا كنت تبدأ الفرنسية من الصفر، افتح المستوى A1 في الجامعة وابدأ بالحروف والأصوات، ثم تابع الدروس بالترتيب.", fr: "Si vous débutez en français, ouvrez le niveau A1 à l’université. Commencez par les lettres et les sons, puis suivez les leçons dans l’ordre." },
      { ar: "إذا سبق لك التعلم، راجع الدروس الأولى في المستوى الذي تنوي دراسته. ارجع إلى الأساسيات التي تجد فيها صعوبة قبل المتابعة.", fr: "Si vous avez déjà étudié le français, révisez les premières leçons du niveau que vous souhaitez suivre. Reprenez les bases qui vous posent problème avant de continuer." },
      { ar: "اختر درسًا واحدًا في كل جلسة، وحدد هدفًا بسيطًا، مثل التعريف بنفسك أو فهم خمس كلمات جديدة.", fr: "Choisissez une seule leçon par séance et fixez-vous un objectif simple : vous présenter ou comprendre cinq nouveaux mots, par exemple." },
    ],
    links: [{ href: "/university/a1", ar: "ابدأ بالمستوى A1", fr: "Commencer au niveau A1" }],
  },
  {
    id: "app", ar: "دليل التطبيق", fr: "Guide de l’application",
    items: [
      { ar: "الجامعة هي مسارك للدراسة: افتح المستوى، ثم اختر الدرس لتتعلم وتتمرن على محتواه.", fr: "L’université vous guide dans votre apprentissage : ouvrez un niveau, puis choisissez une leçon pour étudier son contenu et vous entraîner." },
      { ar: "استخدم المكتبة للبحث عن الكلمات وفهم معانيها وأمثلتها المتاحة، ثم ارجع إلى درسك.", fr: "Utilisez la bibliothèque pour chercher des mots, comprendre leur sens et consulter les exemples disponibles, puis revenez à votre leçon." },
      { ar: "ارجع إلى قاعة القواعد لفهم تركيب الجملة، وإلى قاعة تصريف الأفعال لمراجعة الفعل مع الزمن والضمير المناسبين.", fr: "Consultez la salle de grammaire pour comprendre la construction des phrases et la salle de conjugaison pour revoir un verbe au temps et à la personne qui conviennent." },
    ],
    links: [
      { href: "/university", ar: "الجامعة", fr: "Université" },
      { href: "/library", ar: "المكتبة", fr: "Bibliothèque" },
      { href: "/grammar", ar: "القواعد", fr: "Grammaire" },
      { href: "/conjugation", ar: "تصريف الأفعال", fr: "Conjugaison" },
    ],
  },
  {
    id: "study", ar: "كيف أدرس؟", fr: "Comment étudier ?",
    items: [
      { ar: "اقرأ شرح الدرس، واستمع إلى الكلمات والجمل الفرنسية التي يظهر بجانبها زر النطق. كررها بصوتك بعد الاستماع.", fr: "Lisez les explications de la leçon et écoutez les mots et les phrases en français accompagnés d’un bouton audio. Répétez-les à voix haute après les avoir écoutés." },
      { ar: "افهم المثال كاملًا بدل ترجمة كل كلمة وحدها. حاول بعد ذلك تكوين جملة مشابهة تعبّر عنك.", fr: "Comprenez l’exemple dans son ensemble plutôt que de traduire chaque mot séparément. Essayez ensuite de construire une phrase semblable qui parle de vous." },
      { ar: "أنجز التدريب، ثم الاختبار إن كان متاحًا في الدرس. إذا أخطأت، ارجع إلى الشرح وافهم السبب قبل إعادة المحاولة.", fr: "Faites les exercices, puis le test s’il est proposé dans la leçon. En cas d’erreur, relisez les explications pour en comprendre la cause avant de réessayer." },
    ],
    links: [{ href: "/university", ar: "اختر درسًا", fr: "Choisir une leçon" }],
  },
  {
    id: "review", ar: "كيف أراجع؟", fr: "Comment réviser ?",
    items: [
      { ar: "ابدأ جلستك التالية بتذكّر ما تعلمته دون النظر إلى الإجابة، ثم افتح الدرس لتتحقق.", fr: "Au début de la séance suivante, essayez de vous rappeler ce que vous avez appris sans regarder la réponse, puis ouvrez la leçon pour vérifier." },
      { ar: "دوّن الكلمات أو القواعد التي أخطأت فيها، وراجعها مع مثال واضح، لا في قائمة منفصلة عن المعنى.", fr: "Notez les mots ou les règles qui vous ont posé problème et révisez-les avec un exemple clair, plutôt que dans une liste sans contexte." },
      { ar: "وزّع المراجعة على جلسات قصيرة ومتكررة. يمكنك مثلًا تخصيص خمس دقائق للمراجعة وعشر دقائق لدرس جديد، ثم تعديل المدة بما يناسبك.", fr: "Répartissez vos révisions en séances courtes et régulières. Vous pouvez, par exemple, consacrer cinq minutes aux révisions et dix minutes à une nouvelle leçon, puis adapter cette durée à vos besoins." },
    ],
    links: [{ href: "/university", ar: "ارجع إلى دروسك", fr: "Revenir aux leçons" }],
  },
  {
    id: "controls", ar: "تعليمات الأزرار", fr: "Guide des boutons",
    items: [
      { ar: "زر السماعة يشغّل النطق. عندما يكون بجوار إجابة، اضغط على السماعة للاستماع، وعلى الإجابة نفسها لاختيارها.", fr: "Le bouton en forme de haut-parleur lance la prononciation. Lorsqu’il se trouve à côté d’une réponse, appuyez sur le haut-parleur pour l’écouter et sur la réponse elle-même pour la sélectionner." },
      { ar: "اكتب الكلمة بالعربية أو الفرنسية في بحث المكتبة. افتح النتيجة المناسبة، واقرأ المعنى في سياقه.", fr: "Saisissez le mot en arabe ou en français dans la recherche de la bibliothèque. Ouvrez le résultat qui convient et lisez le sens dans son contexte." },
      { ar: "استخدم أسهم القوائم للتنقل بين صفحاتها. وزر «أعد الاختبار»، عند ظهوره، يبدأ محاولة جديدة. سهم العودة أعلى هذه القاعة يرجع إلى قاعات القلعة.", fr: "Utilisez les flèches des listes pour passer d’une page à l’autre. Le bouton permettant de refaire le test, lorsqu’il est affiché, lance une nouvelle tentative. La flèche de retour en haut de cette salle ramène aux salles du château." },
    ],
    links: [{ href: "/castle", ar: "قاعات القلعة", fr: "Les salles du château" }],
  },
];

export default function GrandHallPage() {
  return <GrandHall guides={guides} />;
}
