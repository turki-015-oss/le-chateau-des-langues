export type GrammaticalGender = "masculine" | "feminine";

export type DictionarySearchEntry = {
  id: string;
  letter: string;
  word: string;
  arabic: string;
  gender?: GrammaticalGender;
  determiner?: "Un" | "Une";
  grammarLabel?: string;
  nationality?: {
    masculine: string;
    feminine: string;
  };
};

export type DictionaryEntry = DictionarySearchEntry & {
  ipa: string;
  example: string;
  exampleArabic: string;
  partOfSpeech?: string;
  directionTopic?: boolean;
  countryTopic?: boolean;
  article?: "le" | "la" | "l’" | "les" | "sans article";
  preposition?: string;
  exampleSource: "Tatoeba" | "Équipe éditoriale" | "Révision éditoriale" | "Révision lexicographique" | "Révision contextuelle" | "Révision thématique";
  counterpart?: {
    word: string;
    arabic: string;
    gender: GrammaticalGender;
    determiner: "Un" | "Une";
    example: string;
    exampleArabic: string;
  };
};

export type DictionaryManifest = {
  version: number;
  total: number;
  naturalExampleCount: number;
  curatedExampleCount: number;
  lexicographicExampleCount?: number;
  contextualExampleCount?: number;
  directionEntryCount?: number;
  countryEntryCount?: number;
  countryAddedCount?: number;
  counts: Record<string, number>;
  search: DictionarySearchEntry[];
  sources: Array<{ name: string; url: string; use: string }>;
};

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export async function loadDictionaryManifest(): Promise<DictionaryManifest> {
  const response = await fetch("/library/dictionary/manifest.json");
  if (!response.ok) throw new Error("تعذر تحميل فهرس القاموس");
  return response.json();
}

export async function loadDictionaryLetter(letter: string): Promise<DictionaryEntry[]> {
  const normalizedLetter = letter.toUpperCase();
  if (!alphabet.includes(normalizedLetter)) return [];
  const response = await fetch(`/library/dictionary/${normalizedLetter}.json`);
  if (!response.ok) throw new Error(`تعذر تحميل قاموس حرف ${normalizedLetter}`);
  return response.json();
}
