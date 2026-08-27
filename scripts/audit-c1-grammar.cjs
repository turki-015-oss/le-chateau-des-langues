const fs=require("fs");
const path=require("path");

const root=path.join(process.cwd(),"app","grammar","data");
const files=fs.readdirSync(root).filter(name=>name.startsWith("c1-")&&name!=="c1-factory.ts").sort();
const older=fs.readdirSync(root).filter(name=>/^(?:a1|a2|b1|b2)-.*\.ts$/.test(name)&&!name.endsWith("-factory.ts"));
const sources=files.map(name=>({name,text:fs.readFileSync(path.join(root,name),"utf8")}));
const source=sources.map(file=>file.text).join("\n");
const olderSource=older.map(name=>fs.readFileSync(path.join(root,name),"utf8")).join("\n");

const lessonPattern=/c1Lesson\(\{id:"([^"]+)",number:(\d+),titleFr:"([^"]+)",titleAr:"([^"]+)"/g;
const compactExamplePattern=/\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"(?:,"([^"]+)")?\]/g;
const comparisonPattern=/correct:"((?:[^"\\]|\\.)*)",correctAr:"((?:[^"\\]|\\.)*)",incorrect:"((?:[^"\\]|\\.)*)",incorrectReason:"((?:[^"\\]|\\.)*)"/g;
const lessons=[...source.matchAll(lessonPattern)].map(match=>({id:match[1],number:Number(match[2]),titleFr:match[3],titleAr:match[4]}));
const examples=[...source.matchAll(compactExamplePattern)].map(match=>({fr:match[1],ar:match[2],focus:match[3]}));
const comparisonPairs=[...source.matchAll(comparisonPattern)];
const olderFrench=new Set([
 ...[...olderSource.matchAll(/fr:"((?:[^"\\]|\\.)*)",ar:/g)].map(match=>match[1]),
 ...[...olderSource.matchAll(compactExamplePattern)].map(match=>match[1]),
]);
const olderTitles=new Set([...olderSource.matchAll(/titleFr:"([^"]+)"/g)].map(match=>match[1]));
const fail=[];

if(files.length!==16)fail.push(`expected 16 C1 data files, got ${files.length}`);
for(const file of sources){
 const count=[...file.text.matchAll(lessonPattern)].length;
 if(count!==6)fail.push(`${file.name} must contain 6 lessons, got ${count}`);
}
if(lessons.length!==96)fail.push(`expected 96 lessons, got ${lessons.length}`);
const numbers=lessons.map(lesson=>lesson.number).sort((a,b)=>a-b);
if(numbers.some((number,index)=>number!==index+1))fail.push("lesson numbering is not exactly 1..96");
if(lessons.some(lesson=>!lesson.id.startsWith("c1-")))fail.push("lesson id without c1- prefix");
const duplicateIds=lessons.map(lesson=>lesson.id).filter((id,index,all)=>all.indexOf(id)!==index);
if(duplicateIds.length)fail.push(`duplicate lesson ids: ${[...new Set(duplicateIds)].join(" | ")}`);
const duplicateTitles=lessons.map(lesson=>lesson.titleFr).filter((title,index,all)=>all.indexOf(title)!==index);
if(duplicateTitles.length)fail.push(`duplicate C1 lesson titles: ${[...new Set(duplicateTitles)].join(" | ")}`);
const repeatedOlderTitles=lessons.map(lesson=>lesson.titleFr).filter(title=>olderTitles.has(title));
if(repeatedOlderTitles.length)fail.push(`lesson titles already used in A1-B2: ${[...new Set(repeatedOlderTitles)].join(" | ")}`);
if(examples.length!==288)fail.push(`expected 288 examples, got ${examples.length}`);
if(comparisonPairs.length!==96)fail.push(`expected 96 comparison pairs, got ${comparisonPairs.length}`);
const duplicateFrench=examples.map(example=>example.fr).filter((fr,index,all)=>all.indexOf(fr)!==index);
if(duplicateFrench.length)fail.push(`duplicate C1 examples: ${[...new Set(duplicateFrench)].join(" | ")}`);
const collisions=examples.map(example=>example.fr).filter(fr=>olderFrench.has(fr));
if(collisions.length)fail.push(`examples already used in A1-B2: ${[...new Set(collisions)].join(" | ")}`);
if(examples.some(example=>!example.ar.trim()))fail.push("example without Arabic translation");
const missingFocus=examples.filter(example=>!example.fr.includes(example.focus));
if(missingFocus.length)fail.push(`highlight focus absent from sentence: ${missingFocus.map(example=>`${example.focus} → ${example.fr}`).join(" | ")}`);
const banned=["إذا تهتم","تم عمل","سوف يكون عنده","على المستوى من","التقييم الخبير","ترجمة حرفية"];
for(const phrase of banned)if(source.includes(phrase))fail.push(`suspicious literal Arabic: ${phrase}`);

const report={
 ok:fail.length===0,
 files:files.length,
 lessons:lessons.length,
 examples:examples.length,
 comparisonPairs:comparisonPairs.length,
 duplicateLessonIds:new Set(duplicateIds).size,
 duplicateLessonTitles:new Set(duplicateTitles).size,
 duplicateExamples:new Set(duplicateFrench).size,
 olderLevelTitleCollisions:new Set(repeatedOlderTitles).size,
 olderLevelExampleCollisions:new Set(collisions).size,
 missingHighlightFocus:missingFocus.length,
};

console.log(JSON.stringify(report,null,2));
if(fail.length){
 console.error(fail.join("\n"));
 process.exit(1);
}
