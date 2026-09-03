import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pagePath = path.join(root, "app", "conjugation", "page.tsx");
const batchName = process.argv.find((arg) => arg.startsWith("--batch="))?.split("=", 2)[1] ?? "c";
const listPath = path.join(root, "scripts", `conjugation-next50-${batchName}.txt`);
const source = fs.readFileSync(pagePath, "utf8");

function objectAt(index) {
  const start = source.indexOf("{", index);
  let quote = "";
  let escaped = false;
  let depth = 0;
  for (let cursor = start; cursor < source.length; cursor += 1) {
    const char = source[cursor];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0) return source.slice(start, cursor + 1);
  }
  throw new Error(`Unterminated object after ${index}`);
}

const usages = {};
const initialMarker = "const USAGES:Record<string,Usage[]>=";
Object.assign(usages, Function(`"use strict"; return (${objectAt(source.indexOf(initialMarker))});`)());
const assignMarker = "Object.assign(USAGES,";
for (let index = source.indexOf(assignMarker); index >= 0; index = source.indexOf(assignMarker, index + assignMarker.length)) {
  Object.assign(usages, Function(`"use strict"; return (${objectAt(index + assignMarker.length)});`)());
}
const reviewedPath = path.join(root, "data", `reviewed-usages-next50-${batchName}.json`);
if (fs.existsSync(reviewedPath)) {
  const reviewed = JSON.parse(fs.readFileSync(reviewedPath, "utf8"));
  for (const [verb, items] of Object.entries(reviewed)) usages[verb] = [...(usages[verb] ?? []), ...items];
}

const verbs = fs.readFileSync(listPath, "utf8").split(/\r?\n/u).map((line) => line.trim().split(":", 1)[0]).filter(Boolean);
const failures = [];
const counts = {};
const details = {};
for (const verb of verbs) {
  const items = usages[verb] ?? [];
  counts[verb] = items.length;
  details[verb] = items.map((item) => item.fr);
  if (!items.length) failures.push(`${verb}: no usages`);
  if (items.length > 8) failures.push(`${verb}: ${items.length} usages exceeds the limit of 8`);
  const frenchLabels = new Set();
  const frenchExamples = new Set();
  for (const [index, item] of items.entries()) {
    if (![item.fr, item.ar, item.example, item.translation].every((value) => typeof value === "string" && value.trim())) failures.push(`${verb}/${index}: incomplete usage`);
    const label = item.fr.trim().toLocaleLowerCase("fr");
    const example = item.example.trim().toLocaleLowerCase("fr");
    if (frenchLabels.has(label)) failures.push(`${verb}/${index}: duplicate usage label`);
    if (frenchExamples.has(example)) failures.push(`${verb}/${index}: duplicate usage example`);
    frenchLabels.add(label);
    frenchExamples.add(example);
  }
}

console.log(JSON.stringify({ batch: batchName, verbs: verbs.length, minimum: Math.min(...Object.values(counts)), maximum: Math.max(...Object.values(counts)), counts, ...(process.argv.includes("--details") ? { details } : {}), failures }, null, 2));
if (failures.length) process.exit(1);
