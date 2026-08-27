import type {GrammarExample,GrammarLesson,GrammarRole} from "../grammarData";

type CompactExample=[fr:string,ar:string,parts:[text:string,role:GrammarRole][]];
type LessonInput=Omit<GrammarLesson,"examples">&{examples:CompactExample[]};

export const b1Lesson=(lesson:LessonInput):GrammarLesson=>({
 ...lesson,
 examples:lesson.examples.map(([fr,ar,parts]):GrammarExample=>({
  fr,ar,parts:parts.map(([text,role])=>({text,role}))
 }))
});
