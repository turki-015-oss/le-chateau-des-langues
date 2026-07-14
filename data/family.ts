export const familyCharacters = [
  {
    id: "youssef",
    name: "Youssef",
    roleAr: "الأب",
    avatar: "👨",
    greeting: "Bonjour ! Je m'appelle Youssef.",
    translation: "مرحبًا! اسمي يوسف.",
    questions: [
      {
        prompt: "Comment t'appelles-tu ?",
        translation: "ما اسمك؟",
        answers: ["Je m'appelle Faris.", "J'ai vingt ans.", "Je suis fatigué."],
        correct: 0
      },
      {
        prompt: "Comment ça va ?",
        translation: "كيف حالك؟",
        answers: ["Ça va très bien.", "Je m'appelle Adam.", "C'est ma sœur."],
        correct: 0
      }
    ]
  },
  {
    id: "maryam",
    name: "Maryam",
    roleAr: "الأم",
    avatar: "👩",
    greeting: "Bienvenue chez nous !",
    translation: "مرحبًا بك في منزلنا!",
    questions: [
      {
        prompt: "Qui est-elle ?",
        translation: "من هي؟",
        answers: ["C'est ma mère.", "C'est mon frère.", "C'est mon père."],
        correct: 0
      },
      {
        prompt: "Tu veux du thé ?",
        translation: "هل تريد الشاي؟",
        answers: ["Oui, s'il vous plaît.", "Je vais à l'école.", "Il fait froid."],
        correct: 0
      }
    ]
  },
  {
    id: "adam",
    name: "Adam",
    roleAr: "الابن",
    avatar: "👦",
    greeting: "Salut ! Tu veux jouer avec moi ?",
    translation: "مرحبًا! هل تريد اللعب معي؟",
    questions: [
      {
        prompt: "Quel âge as-tu ?",
        translation: "كم عمرك؟",
        answers: ["J'ai dix ans.", "Je suis à la maison.", "C'est mon ballon."],
        correct: 0
      }
    ]
  },
  {
    id: "layla",
    name: "Layla",
    roleAr: "الابنة",
    avatar: "👧",
    greeting: "Bonjour ! Ma couleur préférée est le vert.",
    translation: "مرحبًا! لوني المفضل هو الأخضر.",
    questions: [
      {
        prompt: "Quelle est ta couleur préférée ?",
        translation: "ما لونك المفضل؟",
        answers: ["J'aime le vert.", "J'ai une sœur.", "Je mange une pomme."],
        correct: 0
      }
    ]
  },
  {
    id: "grandmother",
    name: "Grand-mère",
    roleAr: "الجدة",
    avatar: "👵",
    greeting: "Bonjour mon enfant. Assieds-toi près de moi.",
    translation: "مرحبًا يا بني. اجلس بجانبي.",
    questions: [
      {
        prompt: "Qui est cette dame ?",
        translation: "من هذه السيدة؟",
        answers: ["C'est ma grand-mère.", "C'est ma professeure.", "C'est ma voisine."],
        correct: 0
      }
    ]
  }
];

export const familyVocabulary = [
  ["le père", "الأب"],
  ["la mère", "الأم"],
  ["le frère", "الأخ"],
  ["la sœur", "الأخت"],
  ["le fils", "الابن"],
  ["la fille", "الابنة"],
  ["la grand-mère", "الجدة"],
  ["le grand-père", "الجد"]
];