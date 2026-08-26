import {a1Foundations} from "./data/a1-foundations";
import {a1Determiners} from "./data/a1-determiners";
import {a1PresentVerbs} from "./data/a1-present-verbs";
import {a1Description} from "./data/a1-description";
import {a1SentenceForms} from "./data/a1-sentence-forms";
import {a1TimeAndTenses} from "./data/a1-time-and-tenses";
import {a1SpaceAndExpression} from "./data/a1-space-and-expression";
import {a1ActionsAndReference} from "./data/a1-actions-and-reference";
import {a2PastNarration} from "./data/a2-past-narration";
import {a2FutureAndTime} from "./data/a2-future-and-time";
import {a2ObjectPronouns} from "./data/a2-object-pronouns";
import {a2ReferenceAndIdentity} from "./data/a2-reference-and-identity";
import {a2DescriptionAndComparison} from "./data/a2-description-and-comparison";
import {a2SentenceNuance} from "./data/a2-sentence-nuance";
import {a2InteractionAndLinking} from "./data/a2-interaction-and-linking";

export type GrammarRole="subject"|"verb"|"object"|"marker"|"adjective";
export type GrammarExample={fr:string;ar:string;parts:{text:string;role:GrammarRole}[]};
export type GrammarLesson={id:string;number:number;titleFr:string;titleAr:string;category:string;summary:string;rule:string;formula:string;examples:GrammarExample[];correct:string;correctAr:string;incorrect:string;incorrectReason:string;note:string};

export const a1Lessons:GrammarLesson[]=[...a1Foundations,...a1Determiners,...a1PresentVerbs,...a1Description,...a1SentenceForms,...a1TimeAndTenses,...a1SpaceAndExpression,...a1ActionsAndReference];
export const a2Lessons:GrammarLesson[]=[...a2PastNarration,...a2FutureAndTime,...a2ObjectPronouns,...a2ReferenceAndIdentity,...a2DescriptionAndComparison,...a2SentenceNuance,...a2InteractionAndLinking];
