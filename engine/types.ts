export type RewardBundle = {
  xp: number;
  coins: number;
  reputation: number;
};

export type MissionStep = {
  id: string;
  titleAr: string;
  titleFr: string;
  objectiveAr: string;
};

export type NpcProfile = {
  id?: string;
  name: string;
  avatar: string;
  personality: string;
  requestFr: string;
  requestAr: string;
  order: readonly string[];
  orderLabelAr: string;
};

export type DialogueChoice = {
  text: string;
  ar: string;
  correct: boolean;
};

export type DialogueNode = {
  speaker: string;
  line: string;
  ar: string;
  answers: DialogueChoice[];
};