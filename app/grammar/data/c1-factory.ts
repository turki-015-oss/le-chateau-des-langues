import type {GrammarExample,GrammarLesson,GrammarRole} from "../grammarData";

type CompactExample=[fr:string,ar:string,focus:string,role?:GrammarRole];
type LessonInput=Omit<GrammarLesson,"examples">&{examples:CompactExample[]};

const splitExample=([fr,ar,focus,role="verb"]:CompactExample):GrammarExample=>{
 const bare=fr.trim().replace(/[.!?…]+$/u,"");
 const index=bare.indexOf(focus);
 if(index<0)return{fr,ar,parts:[{text:bare,role:"object"}]};
 const before=bare.slice(0,index).trim();
 const after=bare.slice(index+focus.length).trim();
 return{fr,ar,parts:[
  ...(before?[{text:before,role:"subject" as GrammarRole}]:[]),
  {text:focus,role},
  ...(after?[{text:after,role:"object" as GrammarRole}]:[])
 ]};
};

export const c1Lesson=(lesson:LessonInput):GrammarLesson=>({...lesson,examples:lesson.examples.map(splitExample)});
