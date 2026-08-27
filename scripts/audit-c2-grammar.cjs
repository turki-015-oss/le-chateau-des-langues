const fs=require("fs");
const path=require("path");

const root=path.join(process.cwd(),"app","grammar","data");
const source=fs.readFileSync(path.join(root,"c2-curriculum.ts"),"utf8");
const olderFiles=fs.readdirSync(root).filter(name=>/^(?:a1|a2|b1|b2|c1)-.*\.ts$/.test(name)&&!name.endsWith("-factory.ts"));
const olderSource=olderFiles.map(name=>fs.readFileSync(path.join(root,name),"utf8")).join("\n");
const seedRows=source.split(/\r?\n/).map(line=>line.trim()).filter(line=>line.startsWith('["')).map(line=>JSON.parse(line.replace(/,$/,"")));
const seeds=seedRows.map(row=>({titleFr:row[0],titleAr:row[1],formula:row[2],sourceFr:row[3],sourceAr:row[4],targetFr:row[5],targetAr:row[6],register:row[7]}));
const unitCodes=[...source.matchAll(/\{code:"([^"]+)",category:"([^"]+)",skill:"([^"]+)",seeds:\[/g)].map(match=>match[1]);
const olderFrench=new Set([
 ...[...olderSource.matchAll(/fr:"((?:[^"\\]|\\.)*)",ar:/g)].map(match=>match[1]),
 ...[...olderSource.matchAll(/\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"(?:,"[^"]+")?\]/g)].map(match=>match[1]),
]);
const olderTitles=new Set([...olderSource.matchAll(/titleFr:"([^"]+)"/g)].map(match=>match[1]));
const fail=[];

if(unitCodes.length!==20)fail.push(`expected 20 C2 units, got ${unitCodes.length}`);
if(new Set(unitCodes).size!==20)fail.push("duplicate C2 unit code");
if(seeds.length!==120)fail.push(`expected 120 C2 lessons, got ${seeds.length}`);
const titles=seeds.map(seed=>seed.titleFr);
const duplicateTitles=titles.filter((title,index,all)=>all.indexOf(title)!==index);
if(duplicateTitles.length)fail.push(`duplicate C2 titles: ${[...new Set(duplicateTitles)].join(" | ")}`);
const titleCollisions=titles.filter(title=>olderTitles.has(title));
if(titleCollisions.length)fail.push(`titles already used in A1-C1: ${[...new Set(titleCollisions)].join(" | ")}`);
const frenchExamples=seeds.flatMap(seed=>[`Dans l’exercice « ${seed.titleFr} », la formulation initiale doit être examinée dans son contexte.`,seed.targetFr,`Pour « ${seed.titleFr} », ce choix de formulation préserve le sens, la portée et le registre attendus.`]);
if(frenchExamples.length!==360)fail.push(`expected 360 generated examples, got ${frenchExamples.length}`);
const duplicateExamples=frenchExamples.filter((value,index,all)=>all.indexOf(value)!==index);
if(duplicateExamples.length)fail.push(`duplicate C2 examples: ${[...new Set(duplicateExamples)].join(" | ")}`);
const exampleCollisions=frenchExamples.filter(value=>olderFrench.has(value));
if(exampleCollisions.length)fail.push(`examples already used in A1-C1: ${[...new Set(exampleCollisions)].join(" | ")}`);
if(seeds.some(seed=>Object.values(seed).some(value=>!value.trim())))fail.push("empty field in a C2 lesson seed");
if(seeds.some(seed=>seed.sourceFr===seed.targetFr))fail.push("rewrite source and target must differ");
if(!source.includes("buildC2([...units].sort"))fail.push("C2 units are not normalized to the approved order");
const banned=["إذا تهتم","تم عمل","على المستوى من","ترجمة حرفية","قام بعمل قرار"];
for(const phrase of banned)if(source.includes(phrase))fail.push(`suspicious literal Arabic: ${phrase}`);

const report={ok:fail.length===0,units:unitCodes.length,lessons:seeds.length,examples:frenchExamples.length,comparisons:seeds.length,rewriteLabs:seeds.length,duplicateTitles:new Set(duplicateTitles).size,duplicateExamples:new Set(duplicateExamples).size,olderTitleCollisions:new Set(titleCollisions).size,olderExampleCollisions:new Set(exampleCollisions).size};
console.log(JSON.stringify(report,null,2));
if(fail.length){console.error(fail.join("\n"));process.exit(1)}
