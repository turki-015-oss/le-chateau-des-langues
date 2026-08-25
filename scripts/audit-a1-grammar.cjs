const fs=require("node:fs");
const path=require("node:path");

const dataDir=path.join(__dirname,"..","app","grammar","data");
const files=fs.readdirSync(dataDir).filter(name=>/^a1-.*\.ts$/.test(name)).sort();
const source=files.map(name=>fs.readFileSync(path.join(dataDir,name),"utf8")).join("\n");
const lessons=[...source.matchAll(/id:"([^"]+)",number:(\d+)/g)].map(match=>({id:match[1],number:Number(match[2])}));
const examples=[...source.matchAll(/fr:"([^"]+)",ar:"([^"]+)"/g)].map(match=>({fr:match[1],ar:match[2]}));
const pairs=[...source.matchAll(/correct:"([^"]+)",correctAr:"([^"]+)",incorrect:"([^"]+)",incorrectReason:"([^"]+)"/g)].map(match=>({correct:match[1],correctAr:match[2],incorrect:match[3],incorrectReason:match[4]}));
const errors=[];
const duplicates=values=>values.filter((value,index)=>values.indexOf(value)!==index);
const expected=Array.from({length:41},(_,index)=>index+1);

if(lessons.length!==41)errors.push(`Expected 41 lessons, found ${lessons.length}.`);
if(JSON.stringify(lessons.map(item=>item.number).sort((a,b)=>a-b))!==JSON.stringify(expected))errors.push("Lesson numbers are not the exact sequence 1..41.");
if(duplicates(lessons.map(item=>item.id)).length)errors.push("Duplicate lesson ids found.");
if(examples.length!==123)errors.push(`Expected 123 examples, found ${examples.length}.`);
if(duplicates(examples.map(item=>item.fr)).length)errors.push("Duplicate French examples found.");
if(duplicates(examples.map(item=>item.ar)).length)errors.push("Duplicate Arabic translations found.");
if(pairs.length!==41)errors.push(`Expected 41 correct/incorrect pairs, found ${pairs.length}.`);
if(examples.some(item=>!/[A-Za-zÀ-ÿŒœÆæ]/.test(item.fr)||!/[\u0600-\u06FF]/.test(item.ar)))errors.push("A bilingual example is incomplete.");
if(pairs.some(item=>!/[A-Za-zÀ-ÿŒœÆæ]/.test(item.correct)||!/[\u0600-\u06FF]/.test(item.correctAr)||!/[\u0600-\u06FF]/.test(item.incorrectReason)))errors.push("A bilingual correct/incorrect comparison is incomplete.");
if(/النافذة المعروفة|يأخذ المترو|يقوم بالتسوق|ترجمة حرفية/.test(source))errors.push("A banned literal-translation pattern was found.");

if(errors.length){console.error(JSON.stringify({ok:false,files,errors},null,2));process.exit(1)}
console.log(JSON.stringify({ok:true,files:files.length,lessons:lessons.length,examples:examples.length,exampleTranslations:examples.length,comparisonTranslations:pairs.length,comparisonReasons:pairs.length,comparisonPairs:pairs.length,duplicateExamples:0},null,2));
