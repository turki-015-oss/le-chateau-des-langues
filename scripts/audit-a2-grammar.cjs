const fs=require("node:fs");
const path=require("node:path");

const dataDir=path.join(__dirname,"..","app","grammar","data");
const a2Files=fs.readdirSync(dataDir).filter(name=>/^a2-.*\.ts$/.test(name)).sort();
const a1Files=fs.readdirSync(dataDir).filter(name=>/^a1-.*\.ts$/.test(name)).sort();
const read=files=>files.map(name=>fs.readFileSync(path.join(dataDir,name),"utf8")).join("\n");
const source=read(a2Files);
const previous=read(a1Files);
const lessons=[...source.matchAll(/id:"([^"]+)",number:(\d+)/g)].map(match=>({id:match[1],number:Number(match[2])}));
const examples=[...source.matchAll(/fr:"([^"]+)",ar:"([^"]+)"/g)].map(match=>({fr:match[1],ar:match[2]}));
const previousExamples=[...previous.matchAll(/fr:"([^"]+)",ar:"([^"]+)"/g)].map(match=>({fr:match[1],ar:match[2]}));
const pairs=[...source.matchAll(/correct:"([^"]+)",correctAr:"([^"]+)",incorrect:"([^"]+)",incorrectReason:"([^"]+)"/g)].map(match=>({correct:match[1],correctAr:match[2],incorrect:match[3],incorrectReason:match[4]}));
const errors=[];
const duplicates=values=>[...new Set(values.filter((value,index)=>values.indexOf(value)!==index))];
const expected=Array.from({length:42},(_,index)=>index+1);

if(a2Files.length!==7)errors.push(`Expected 7 A2 data files, found ${a2Files.length}.`);
if(lessons.length!==42)errors.push(`Expected 42 lessons, found ${lessons.length}.`);
if(JSON.stringify(lessons.map(item=>item.number).sort((a,b)=>a-b))!==JSON.stringify(expected))errors.push("Lesson numbers are not the exact sequence 1..42.");
if(lessons.some(item=>!item.id.startsWith("a2-")))errors.push("Every A2 lesson id must start with a2-.");
if(duplicates(lessons.map(item=>item.id)).length)errors.push("Duplicate lesson ids found.");
if(examples.length!==126)errors.push(`Expected 126 examples, found ${examples.length}.`);
if(duplicates(examples.map(item=>item.fr)).length)errors.push("Duplicate French examples found inside A2.");
if(duplicates(examples.map(item=>item.ar)).length)errors.push("Duplicate Arabic translations found inside A2.");
if(examples.some(item=>previousExamples.some(old=>old.fr===item.fr)))errors.push("An A2 French example duplicates an A1 example.");
if(pairs.length!==42)errors.push(`Expected 42 correct/incorrect pairs, found ${pairs.length}.`);
if(examples.some(item=>!/[A-Za-zÀ-ÿŒœÆæ]/.test(item.fr)||!/[\u0600-\u06FF]/.test(item.ar)))errors.push("A bilingual example is incomplete.");
if(pairs.some(item=>!/[A-Za-zÀ-ÿŒœÆæ]/.test(item.correct)||!/[\u0600-\u06FF]/.test(item.correctAr)||!/[\u0600-\u06FF]/.test(item.incorrectReason)))errors.push("A bilingual comparison is incomplete.");
if(/إذا تهتم|ترجمة حرفية|النافذة المعروفة|يقوم بالتسوق/.test(source))errors.push("A banned translation pattern or known typo was found.");

if(errors.length){console.error(JSON.stringify({ok:false,files:a2Files,errors},null,2));process.exit(1)}
console.log(JSON.stringify({ok:true,files:a2Files.length,lessons:lessons.length,examples:examples.length,comparisonPairs:pairs.length,duplicateExamples:0,a1ExampleCollisions:0},null,2));
