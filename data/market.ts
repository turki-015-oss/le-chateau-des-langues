export type MarketItem = {
  id: string;
  fr: string;
  ar: string;
  emoji: string;
  price: number;
  unit: string;
};

export const marketItems: MarketItem[] = [
  { id: "tomates", fr: "des tomates", ar: "طماطم", emoji: "🍅", price: 4, unit: "le kilo" },
  { id: "pommes", fr: "des pommes", ar: "تفاح", emoji: "🍎", price: 6, unit: "le kilo" },
  { id: "oranges", fr: "des oranges", ar: "برتقال", emoji: "🍊", price: 5, unit: "le kilo" },
  { id: "carottes", fr: "des carottes", ar: "جزر", emoji: "🥕", price: 3, unit: "le kilo" },
  { id: "pain", fr: "du pain", ar: "خبز", emoji: "🥖", price: 2, unit: "la pièce" },
  { id: "dattes", fr: "des dattes", ar: "تمر", emoji: "🌴", price: 8, unit: "la boîte" }
];

export const marketDialogues = [
  { speaker: "Hassan", fr: "Bonjour ! Qu'est-ce que vous désirez ?", ar: "مرحبًا! ماذا ترغب؟" },
  { speaker: "Vous", fr: "Je voudrais un kilo de tomates, s'il vous plaît.", ar: "أريد كيلوغرامًا من الطماطم، من فضلك." },
  { speaker: "Hassan", fr: "Très bien. Cela fait quatre pièces.", ar: "حسنًا. الحساب أربع عملات." }
];
