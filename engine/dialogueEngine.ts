import type { DialogueNode } from "./types";

export function getChoiceState(
  node: DialogueNode,
  selectedIndex: number | null,
  choiceIndex: number
) {
  if (selectedIndex === null) return "";
  if (node.answers[choiceIndex]?.correct) return "correct";
  if (selectedIndex === choiceIndex) return "wrong";
  return "muted";
}

export function isCorrectChoice(node: DialogueNode, index: number) {
  return Boolean(node.answers[index]?.correct);
}