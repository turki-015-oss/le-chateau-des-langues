import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const batch = process.argv.includes("--batch=b") ? "-b" : "";
const data = JSON.parse(fs.readFileSync(path.join(root, "data", `reviewed-conjugations-next50${batch}.json`), "utf8"));
const expectedTitles = ["Présent", "Passé composé", "Imparfait", "Plus-que-parfait", "Passé simple", "Passé antérieur", "Futur simple", "Futur antérieur", "Conditionnel présent", "Conditionnel passé", "Subjonctif présent", "Subjonctif passé", "Subjonctif imparfait", "Subjonctif plus-que-parfait", "Impératif présent", "Impératif passé", "Infinitif présent", "Infinitif passé", "Participe présent", "Participe passé", "Gérondif présent", "Gérondif passé"];
const failures = [];
const frenchSeen = new Map();

function shownForm(form) {
  return form.includes(" / ") ? form.split(" / ")[0] : form;
}

if (Object.keys(data).length !== 50) failures.push(`Expected 50 verbs, found ${Object.keys(data).length}`);

for (const [verb, record] of Object.entries(data)) {
  const titles = Object.keys(record.forms);
  if (titles.length !== expectedTitles.length || expectedTitles.some((title) => !titles.includes(title))) failures.push(`${verb}: incomplete tense inventory`);
  for (const title of expectedTitles) {
    const forms = record.forms[title] ?? [];
    const examples = record.examples[title] ?? [];
    if (!forms.length) failures.push(`${verb}/${title}: no forms`);
    if (forms.length !== examples.length) failures.push(`${verb}/${title}: ${forms.length} forms but ${examples.length} examples`);
    examples.forEach((example, index) => {
      const form = shownForm(forms[index] ?? "");
      if (!example.fr?.trim() || !example.ar?.trim()) failures.push(`${verb}/${title}/${index}: missing bilingual example`);
      if (form && !example.fr.toLocaleLowerCase("fr").includes(form.toLocaleLowerCase("fr"))) failures.push(`${verb}/${title}/${index}: example does not contain « ${form} »`);
      if (frenchSeen.has(example.fr)) failures.push(`${verb}/${title}/${index}: duplicate French example also used at ${frenchSeen.get(example.fr)}`);
      else frenchSeen.set(example.fr, `${verb}/${title}/${index}`);
      if (/\b(?:ils|elles) a (?:pu|transmis)\b/iu.test(example.fr)) failures.push(`${verb}/${title}/${index}: plural subject has singular auxiliary`);
      if (/^Dès que (?:il|ils)\b/iu.test(example.fr)) failures.push(`${verb}/${title}/${index}: missing French elision after que`);
      if (/\b(?:il|ils) que\b/iu.test(example.fr) || /\b(?:il|ils) merci\b/iu.test(example.fr)) failures.push(`${verb}/${title}/${index}: malformed subject or complement`);
      if (/\b(undefined|null)\b/iu.test(`${example.fr} ${example.ar}`)) failures.push(`${verb}/${title}/${index}: placeholder leaked`);
    });
  }
}

const report = { verbs: Object.keys(data).length, sectionsPerVerb: expectedTitles.length, examples: frenchSeen.size, failures };
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
