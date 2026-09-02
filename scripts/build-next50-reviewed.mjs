import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "scripts", ".conjugation-next50-source.json");
const listPath = path.join(root, "scripts", "conjugation-next50.txt");
const outputPath = path.join(root, "data", "reviewed-conjugations-next50.json");
const pagePath = path.join(root, "app", "conjugation", "page.tsx");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const previous = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) : {};
const verbs = fs.readFileSync(listPath, "utf8").split(/\r?\n/u).map((x) => x.trim().split(":", 1)[0]).filter(Boolean);
const etreOnly = new Set(["partir", "sortir", "naître", "mourir", "descendre", "arriver", "rester", "entrer", "monter", "passer"]);
const dualAux = new Set(["sortir", "descendre", "monter", "passer"]);
const personPairs = [["1sm", "1sf"], ["2sm", "2sf"], ["3sm", "3sf"], ["1pm", "1pf"], ["2pm", "2pf"], ["3pm", "3pf"]];
const subjects = ["je", "tu", "il / elle", "nous", "vous", "ils / elles"];
const subjSubjects = ["que je", "que tu", "qu’il / elle", "que nous", "que vous", "qu’ils / elles"];
const tenseMap = {
  "Présent": ["indicatif", "present"],
  "Passé composé": ["indicatif", "passe_compose"],
  "Imparfait": ["indicatif", "imparfait"],
  "Plus-que-parfait": ["indicatif", "plus_que_parfait"],
  "Passé simple": ["indicatif", "passe_simple"],
  "Passé antérieur": ["indicatif", "passe_anterieur"],
  "Futur simple": ["indicatif", "futur_simple"],
  "Futur antérieur": ["indicatif", "futur_anterieur"],
  "Conditionnel présent": ["conditionnel", "present"],
  "Conditionnel passé": ["conditionnel", "passe"],
  "Subjonctif présent": ["subjonctif", "present"],
  "Subjonctif passé": ["subjonctif", "passe"],
  "Subjonctif imparfait": ["subjonctif", "imparfait"],
  "Subjonctif plus-que-parfait": ["subjonctif", "plus_que_parfait"],
};

function readSmartExamples() {
  const page = fs.readFileSync(pagePath, "utf8");
  const marker = "const SMART:Record<string,[string,string][]>= ";
  const start = page.indexOf(marker);
  if (start < 0) throw new Error("SMART examples were not found");
  const objectStart = page.indexOf("{", start + marker.length);
  const objectEnd = page.indexOf("\n};", objectStart);
  if (objectEnd < 0) throw new Error("SMART examples are not terminated");
  return Function(`"use strict"; return (${page.slice(objectStart, objectEnd + 2)});`)();
}

const smartExamples = readSmartExamples();

function findEntry(verb) {
  if (source[verb]) return source[verb];
  const normalized = verb.normalize("NFD").replace(/\p{M}/gu, "");
  const key = Object.keys(source).find((candidate) => candidate.normalize("NFD").replace(/\p{M}/gu, "") === normalized);
  if (!key) throw new Error(`Missing source entry for ${verb}`);
  return source[key];
}

function valueFor(table, person) {
  const key = Object.keys(table).find((candidate) => candidate.split(";").includes(person));
  if (!key) throw new Error(`Missing person ${person}`);
  return table[key];
}

function elided(prefix, form) {
  if (!/^je$/u.test(prefix) && !/^que je$/u.test(prefix)) return `${prefix} ${form}`;
  const startsVowel = /^[haeiouyàâäéèêëîïôöùûüœ]/iu.test(form);
  if (!startsVowel) return `${prefix} ${form}`;
  return prefix === "je" ? `j’${form}` : `que j’${form}`;
}

function finiteRows(table, subjunctive = false) {
  return personPairs.map(([maleKey, femaleKey], index) => {
    const male = valueFor(table, maleKey);
    const female = valueFor(table, femaleKey);
    const prefix = (subjunctive ? subjSubjects : subjects)[index];
    if (index === 2 && male !== female) return `il ${male} / elle ${female}`.replace(/^il /u, subjunctive ? "qu’il " : "il ");
    let combined = male;
    if (male !== female) {
      const maleWords = male.split(" ");
      const femaleWords = female.split(" ");
      let common = 0;
      while (maleWords[common] && maleWords[common] === femaleWords[common]) common += 1;
      combined = common > 0
        ? `${maleWords.slice(0, common).join(" ")} ${maleWords.slice(common).join(" ")} / ${femaleWords.slice(common).join(" ")}`
        : `${male} / ${female}`;
    }
    return elided(prefix, combined);
  });
}

function voiceFor(entry, verb, auxiliary) {
  const wanted = auxiliary === "être" ? "voix_active_etre" : "voix_active_avoir";
  const voice = entry[wanted] ?? entry.voix_active ?? entry.voix_active_avoir ?? entry.voix_active_etre;
  if (!voice) throw new Error(`No active voice for ${verb} (${auxiliary})`);
  return voice;
}

function formsForVoice(verb, entry, auxiliary) {
  const voice = voiceFor(entry, verb, auxiliary);
  const forms = {};
  for (const [title, [mood, tense]] of Object.entries(tenseMap)) {
    if (!voice[mood]?.[tense]) throw new Error(`Missing ${mood}.${tense} for ${verb} (${auxiliary})`);
    forms[title] = finiteRows(voice[mood][tense], mood === "subjonctif");
  }
  forms["Impératif présent"] = Object.values(voice.imperatif.present);
  forms["Impératif passé"] = Object.values(voice.imperatif.passe);
  forms["Infinitif présent"] = [verb];
  const pp = voice.participe.passe;
  const simpleParticiples = [...new Set([pp.sm, pp.sf, pp.pm, pp.pf])];
  const compoundParticiples = [...new Set([pp.compound_sm, pp.compound_sf, pp.compound_pm, pp.compound_pf])];
  forms["Infinitif passé"] = auxiliary === "être"
    ? simpleParticiples.map((participle) => `être ${participle}`)
    : [`avoir ${pp.sm}`];
  forms["Participe présent"] = [voice.participe.present];
  forms["Participe passé"] = [...simpleParticiples, ...compoundParticiples];
  forms["Gérondif présent"] = [`en ${voice.participe.present}`];
  forms["Gérondif passé"] = compoundParticiples.map((participle) => `en ${participle}`);
  return { forms, pp: pp.sm };
}

function sentenceForm(form) {
  if (form.includes(" / ")) {
    const [left, right] = form.split(" / ");
    // The UI compresses identical masculine/feminine forms as
    // "il / elle dit" and "qu’ils / elles disent".  The first half alone
    // is only a pronoun, so rebuild the complete masculine clause before it
    // is used in an example sentence.
    const sharedPronoun = left.match(/^(il|ils|qu’il|qu’ils)$/u);
    if (sharedPronoun) {
      const remainder = right.replace(/^(?:elle|elles)\s+/u, "");
      return `${left} ${remainder}`;
    }
    return left;
  }
  return form;
}

function afterQue(text) {
  return text.replace(/^que il\b/u, "qu’il").replace(/^que ils\b/u, "qu’ils");
}

function capitalized(text) {
  return text ? text[0].toLocaleUpperCase("fr") + text.slice(1) : text;
}

function smartTail(verb, index, voice) {
  const sentence = smartExamples[verb]?.[Math.min(index, 5)]?.[0];
  if (!sentence) return "dans un contexte clair et concret";
  const table = voice.indicatif.present;
  const [maleKey, femaleKey] = personPairs[Math.min(index, 5)];
  const candidates = [...new Set([valueFor(table, maleKey), valueFor(table, femaleKey)])];
  const lower = sentence.toLocaleLowerCase("fr");
  for (const conjugated of candidates) {
    const position = lower.indexOf(conjugated.toLocaleLowerCase("fr"));
    if (position >= 0) {
      return sentence.slice(position + conjugated.length).trim().replace(/[.!?…]+$/u, "") || "dans ce contexte précis";
    }
  }
  return sentence.replace(/^\S+\s+/u, "").replace(/[.!?…]+$/u, "");
}

function frenchExample(verb, title, index, form, voice) {
  const shown = sentenceForm(form);
  const lower = afterQue(shown[0].toLocaleLowerCase("fr") + shown.slice(1));
  const imperativeMap = form.includes(" / ") || (voice.imperatif.present && Object.keys(voice.imperatif.present).length > 3)
    ? [1, 1, 3, 3, 4, 4]
    : [1, 3, 4];
  const genderedIndex = /(?:ées|ies|ues|tes)$/u.test(shown) ? 5 : /(?:ée|ie|ue|te)$/u.test(shown) ? 2 : /s$/u.test(shown) ? 5 : 2;
  const contextIndex = title.startsWith("Impératif") ? (imperativeMap[index] ?? 4)
    : title === "Participe passé" && /^(ayant|étant)/iu.test(shown) ? (/^étant/iu.test(shown) ? genderedIndex : 0)
    : title.startsWith("Gérondif") ? (/^en étant/iu.test(shown) ? genderedIndex : 0)
    : title.startsWith("Infinitif") || title === "Participe présent" ? 0
    : index;
  const tail = smartTail(verb, contextIndex, voice).replace(/\btoujours\b\s*/iu, "").trim();
  const core = `${capitalized(shown)} ${tail}`.trim();
  if (title === "Présent") return `${core}.`;
  if (title === "Passé composé") return `${core}, comme prévu.`;
  if (title === "Imparfait") return `${core}, à cette époque.`;
  if (title === "Plus-que-parfait") return `${core} avant le début de la réunion.`;
  if (title === "Passé simple") return `${core}, ce jour-là.`;
  if (title === "Passé antérieur") return `Dès que ${lower} ${tail}, la séance commença.`
    .replace(/^Dès que il\b/u, "Dès qu’il")
    .replace(/^Dès que ils\b/u, "Dès qu’ils");
  if (title === "Futur simple") return `${core} lors de la prochaine étape.`;
  if (title === "Futur antérieur") return `${core} avant la réunion de demain.`;
  if (title === "Conditionnel présent") return `${core} si les circonstances le permettaient.`;
  if (title === "Conditionnel passé") return `${core} si les informations étaient arrivées à temps.`;
  if (title === "Subjonctif présent") return `Le responsable souhaite ${lower} ${tail}.`;
  if (title === "Subjonctif passé") return `Le comité se réjouit ${lower} ${tail}.`;
  if (title === "Subjonctif imparfait") return `Le directeur souhaitait ${lower} ${tail}.`;
  if (title === "Subjonctif plus-que-parfait") return `Le témoin doutait ${lower} ${tail}.`;
  if (title === "Impératif présent") return `${core} dès maintenant.`;
  if (title === "Impératif passé") return `${core} avant l’heure convenue.`;
  if (title === "Infinitif présent") return `${capitalized(shown)} ${tail} demande une attention particulière.`;
  if (title === "Infinitif passé") return `Après ${lower} ${tail}, l’équipe a poursuivi son travail.`;
  if (title === "Participe présent") return `${core}, j’ai poursuivi ma mission.`;
  if (title === "Participe passé" && /^ayant/iu.test(shown)) return `${core}, j’ai pu continuer.`;
  if (title === "Participe passé" && /^étant/iu.test(shown)) {
    const subject = /(?:ées|ies|ues|tes)$/u.test(shown) ? "elles" : /(?:ée|ie|ue|te)$/u.test(shown) ? "elle" : /s$/u.test(shown) ? "ils" : "il";
    return `${core}, ${subject} ${subject === "ils" || subject === "elles" ? "ont" : "a"} pu continuer.`;
  }
  if (title === "Participe passé") return `La forme « ${shown} » illustre l’accord du participe passé du verbe ${verb}.`;
  if (title === "Gérondif présent") return `${core}, je facilite le travail.`;
  if (title === "Gérondif passé" && /^en étant/iu.test(shown)) {
    const subject = /(?:ées|ies|ues|tes)$/u.test(shown) ? "elles" : /(?:ée|ie|ue|te)$/u.test(shown) ? "elle" : /s$/u.test(shown) ? "ils" : "il";
    return `${core}, ${subject} ${subject === "ils" || subject === "elles" ? "ont" : "a"} transmis le compte rendu.`;
  }
  if (title === "Gérondif passé") return `${core}, j’ai transmis le compte rendu.`;
  throw new Error(`Unsupported title ${title}`);
}

const output = {};
for (const verb of verbs) {
  const entry = findEntry(verb);
  const auxiliary = etreOnly.has(verb) ? "être" : "avoir";
  const primary = formsForVoice(verb, entry, auxiliary);
  const voice = voiceFor(entry, verb, auxiliary);
  const knownTranslations = new Map(
    Object.values(previous[verb]?.examples ?? {}).flat().map((example) => [example.fr, example.ar]),
  );
  const examples = Object.fromEntries(Object.entries(primary.forms).map(([title, forms]) => [
    title,
    forms.map((form, index) => {
      const fr = frenchExample(verb, title, index, form, voice);
      const shown = sentenceForm(form);
      const formExplanation = title === "Participe passé" && fr.startsWith("La forme «")
        ? `توضح الصيغة الفرنسية « ${shown} » إحدى صيغ اسم المفعول من الفعل « ${verb} » بحسب الجنس والعدد.`
        : undefined;
      return { fr, ar: formExplanation ?? knownTranslations.get(fr) ?? "" };
    }),
  ]));
  output[verb] = {
    auxiliary: dualAux.has(verb) ? "être / avoir" : auxiliary,
    primaryAuxiliary: auxiliary,
    dualAuxiliary: dualAux.has(verb),
    pastParticiple: primary.pp,
    forms: primary.forms,
    examples,
  };
}

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Generated ${Object.keys(output).length} reviewed verbs at ${outputPath}`);
