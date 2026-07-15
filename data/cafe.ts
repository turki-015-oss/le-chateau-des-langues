export type CafeAnswer = {
  text: string;
  ar: string;
  correct: boolean;
};

export type CafeScene = {
  id: number;
  speaker: "Luc" | "Emma" | "Pierre";
  line: string;
  ar: string;
  answers: CafeAnswer[];
};

export const cafeMenu = [
  { id: "cafe", fr: "un café", ar: "قهوة", emoji: "☕", price: 4 },
  { id: "the", fr: "un thé", ar: "شاي", emoji: "🫖", price: 3 },
  { id: "jus", fr: "un jus d'orange", ar: "عصير برتقال", emoji: "🍊", price: 5 },
  { id: "croissant", fr: "un croissant", ar: "كرواسون", emoji: "🥐", price: 4 },
  { id: "tarte", fr: "une tarte", ar: "فطيرة", emoji: "🥧", price: 6 },
  { id: "eau", fr: "une bouteille d'eau", ar: "قارورة ماء", emoji: "💧", price: 2 }
];

export const cafeScenes: CafeScene[] = [
  {
    id: 1,
    speaker: "Luc",
    line: "Bonjour ! Bienvenue au café. Qu'est-ce que vous désirez ?",
    ar: "مرحبًا! أهلًا بك في المقهى. ماذا ترغب؟",
    answers: [
      { text: "Je voudrais un café, s'il vous plaît.", ar: "أريد قهوة من فضلك.", correct: true },
      { text: "Je cherche la gare.", ar: "أبحث عن محطة القطار.", correct: false },
      { text: "Je suis malade.", ar: "أنا مريض.", correct: false }
    ]
  },
  {
    id: 2,
    speaker: "Luc",
    line: "Vous voulez quelque chose à manger ?",
    ar: "هل تريد شيئًا للأكل؟",
    answers: [
      { text: "Oui, un croissant, s'il vous plaît.", ar: "نعم، كرواسون من فضلك.", correct: true },
      { text: "Non, je suis policier.", ar: "لا، أنا شرطي.", correct: false },
      { text: "Le tribunal est fermé.", ar: "المحكمة مغلقة.", correct: false }
    ]
  },
  {
    id: 3,
    speaker: "Emma",
    line: "Excusez-moi, cette chaise est libre ?",
    ar: "عذرًا، هل هذا الكرسي شاغر؟",
    answers: [
      { text: "Oui, bien sûr. Vous pouvez vous asseoir.", ar: "نعم بالطبع، يمكنك الجلوس.", correct: true },
      { text: "Je prends deux cafés.", ar: "سآخذ قهوتين.", correct: false },
      { text: "Il est huit heures.", ar: "الساعة الثامنة.", correct: false }
    ]
  },
  {
    id: 4,
    speaker: "Pierre",
    line: "Le café est très bon aujourd'hui, n'est-ce pas ?",
    ar: "القهوة لذيذة جدًا اليوم، أليس كذلك؟",
    answers: [
      { text: "Oui, elle est excellente.", ar: "نعم، إنها ممتازة.", correct: true },
      { text: "Je vais à l'hôpital.", ar: "سأذهب إلى المستشفى.", correct: false },
      { text: "Le billet coûte dix euros.", ar: "التذكرة تكلف عشرة يورو.", correct: false }
    ]
  },
  {
    id: 5,
    speaker: "Luc",
    line: "Voilà votre commande. Cela fait huit pièces.",
    ar: "هذا طلبك. الحساب ثماني عملات.",
    answers: [
      { text: "Merci. Voici huit pièces.", ar: "شكرًا، تفضل ثماني عملات.", correct: true },
      { text: "Je voudrais réserver une chambre.", ar: "أود حجز غرفة.", correct: false },
      { text: "Appelez la police !", ar: "اتصل بالشرطة!", correct: false }
    ]
  }
];

export const cafeReward = {
  xp: 70,
  coins: 18,
  medal: "Médaille du Café",
  medalAr: "ميدالية المقهى"
};