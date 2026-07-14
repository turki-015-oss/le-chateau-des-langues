export type CourtAnswer = {
  text: string;
  translation: string;
  correct: boolean;
};

export type CourtQuestion = {
  id: number;
  speaker: "Jules" | "Omar";
  question: string;
  translation: string;
  answers: CourtAnswer[];
  explanation: string;
  explanationAr: string;
};

export const courtCharacters = {
  judge: {
    name: "Jules",
    role: "Le juge",
    roleAr: "القاضي",
    avatar: "⚖️",
    greeting: "Bienvenue au tribunal. Écoutez attentivement avant de répondre.",
    greetingAr: "مرحبًا بك في المحكمة. استمع جيدًا قبل الإجابة."
  },
  clerk: {
    name: "Omar",
    role: "Le greffier",
    roleAr: "كاتب المحكمة",
    avatar: "📜",
    greeting: "Je vais vous présenter les faits de l'affaire.",
    greetingAr: "سأعرض عليك وقائع القضية."
  }
};

export const courtQuestions: CourtQuestion[] = [
  {
    id: 1,
    speaker: "Jules",
    question: "Pourquoi êtes-vous ici aujourd'hui ?",
    translation: "لماذا أنت هنا اليوم؟",
    answers: [
      {
        text: "Je suis ici pour témoigner.",
        translation: "أنا هنا للإدلاء بالشهادة.",
        correct: true
      },
      {
        text: "Je voudrais réserver une table.",
        translation: "أود حجز طاولة.",
        correct: false
      },
      {
        text: "Je prends le train de neuf heures.",
        translation: "سأستقل قطار الساعة التاسعة.",
        correct: false
      }
    ],
    explanation: "Dans un tribunal, on peut venir pour témoigner.",
    explanationAr: "في المحكمة يمكن أن يأتي الشخص للإدلاء بالشهادة."
  },
  {
    id: 2,
    speaker: "Omar",
    question: "Avez-vous vu ce qui s'est passé ?",
    translation: "هل رأيت ما حدث؟",
    answers: [
      {
        text: "Oui, j'ai tout vu.",
        translation: "نعم، رأيت كل شيء.",
        correct: true
      },
      {
        text: "Oui, je voudrais du café.",
        translation: "نعم، أريد قهوة.",
        correct: false
      },
      {
        text: "Non, je suis médecin.",
        translation: "لا، أنا طبيب.",
        correct: false
      }
    ],
    explanation: "La réponse doit confirmer ou nier le témoignage.",
    explanationAr: "يجب أن تؤكد الإجابة الشهادة أو تنفيها."
  },
  {
    id: 3,
    speaker: "Jules",
    question: "Pouvez-vous décrire la personne ?",
    translation: "هل يمكنك وصف الشخص؟",
    answers: [
      {
        text: "Il était grand et portait une veste noire.",
        translation: "كان طويلًا ويرتدي سترة سوداء.",
        correct: true
      },
      {
        text: "Le dessert était délicieux.",
        translation: "كانت الحلوى لذيذة.",
        correct: false
      },
      {
        text: "Le billet coûte vingt euros.",
        translation: "سعر التذكرة عشرون يورو.",
        correct: false
      }
    ],
    explanation: "Décrire une personne demande des détails physiques ou vestimentaires.",
    explanationAr: "وصف الشخص يحتاج إلى تفاصيل جسدية أو تتعلق بالملابس."
  },
  {
    id: 4,
    speaker: "Omar",
    question: "Êtes-vous sûr de votre déclaration ?",
    translation: "هل أنت متأكد من إفادتك؟",
    answers: [
      {
        text: "Oui, j'en suis absolument certain.",
        translation: "نعم، أنا متأكد تمامًا.",
        correct: true
      },
      {
        text: "Je préfère les pommes.",
        translation: "أفضل التفاح.",
        correct: false
      },
      {
        text: "La chambre est au deuxième étage.",
        translation: "الغرفة في الطابق الثاني.",
        correct: false
      }
    ],
    explanation: "Une déclaration officielle demande une réponse claire et précise.",
    explanationAr: "الإفادة الرسمية تحتاج إلى إجابة واضحة ودقيقة."
  },
  {
    id: 5,
    speaker: "Jules",
    question: "Le tribunal va maintenant rendre sa décision. Êtes-vous prêt ?",
    translation: "ستصدر المحكمة قرارها الآن. هل أنت مستعد؟",
    answers: [
      {
        text: "Oui, je suis prêt.",
        translation: "نعم، أنا مستعد.",
        correct: true
      },
      {
        text: "Non, je cherche un hôtel.",
        translation: "لا، أبحث عن فندق.",
        correct: false
      },
      {
        text: "Je voudrais acheter des tomates.",
        translation: "أريد شراء الطماطم.",
        correct: false
      }
    ],
    explanation: "La réponse correcte confirme que vous êtes prêt à entendre la décision.",
    explanationAr: "الإجابة الصحيحة تؤكد استعدادك لسماع القرار."
  }
];

export const courtRewards = {
  xp: 80,
  coins: 25,
  badge: "Médaille de la Justice",
  badgeAr: "ميدالية العدالة"
};