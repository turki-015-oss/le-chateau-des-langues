import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const batchName = process.argv.find((arg) => arg.startsWith("--batch="))?.split("=", 2)[1] ?? "";
const batch = batchName ? `-${batchName}` : "";
const dataPath = path.join(root, "data", `reviewed-conjugations-next50${batch}.json`);
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const pending = [];
const refreshImperativePast = process.argv.includes("--refresh-imperative-past");

function imperativeParaphrase(french) {
  return french
    .replace(/^Sois-toi /u, "Veille à t’être ")
    .replace(/^Soyons-nous /u, "Veillons à nous être ")
    .replace(/^Soyez-vous /u, "Veillez à vous être ")
    .replace(/^Aie /u, "Veille à avoir ")
    .replace(/^Ayons /u, "Veillons à avoir ")
    .replace(/^Ayez /u, "Veillez à avoir ")
    .replace(/^Sois /u, "Veille à être ")
    .replace(/^Soyons /u, "Veillons à être ")
    .replace(/^Soyez /u, "Veillez à être ");
}

for (const [verb, record] of Object.entries(data)) {
  for (const [title, examples] of Object.entries(record.examples)) {
    examples.forEach((example, index) => {
      if (!example.ar || (refreshImperativePast && title === "Impératif passé")) pending.push({ verb, title, index, example, translationInput: title === "Impératif passé" ? imperativeParaphrase(example.fr) : example.fr });
    });
  }
}

const groups = [];
for (let index = 0; index < pending.length; index += 8) groups.push(pending.slice(index, index + 8));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateGroup(group, attempt = 1) {
  const input = group.map((item, index) => `@@@${String(index).padStart(3, "0")}@@@\n${item.translationInput}`).join("\n");
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  for (const [key, value] of Object.entries({ client: "gtx", sl: "fr", tl: "ar", dt: "t", q: input })) url.searchParams.set(key, value);
  try {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    const translated = json[0].map((part) => part[0]).join("");
    const found = [...translated.matchAll(/@@@(\d{3})@@@\s*([\s\S]*?)(?=@@@\d{3}@@@|$)/gu)];
    if (found.length !== group.length) throw new Error(`Expected ${group.length} translations, got ${found.length}`);
    for (const match of found) {
      const item = group[Number(match[1])];
      item.example.ar = match[2].trim();
    }
  } catch (error) {
    if (attempt >= 5) throw error;
    await wait(800 * attempt);
    return translateGroup(group, attempt + 1);
  }
}

let completed = 0;
let lastCheckpoint = 0;
const workers = Array.from({ length: Math.min(3, groups.length) }, async (_, workerIndex) => {
  for (let index = workerIndex; index < groups.length; index += 3) {
    await translateGroup(groups[index]);
    completed += groups[index].length;
    if (completed - lastCheckpoint >= 200) {
      lastCheckpoint = completed;
      fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
      console.log(`Translated ${completed}/${pending.length}`);
    }
    await wait(150);
  }
});

await Promise.all(workers);
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Translated ${pending.length} examples.`);
