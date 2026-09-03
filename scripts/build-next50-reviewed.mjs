import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const batchName = process.argv.find((arg) => arg.startsWith("--batch="))?.split("=", 2)[1] ?? "";
const batch = batchName ? `-${batchName}` : "";
const sourcePath = path.join(root, "scripts", `.conjugation-next50${batch}-source.json`);
const listPath = path.join(root, "scripts", `conjugation-next50${batch}.txt`);
const outputPath = path.join(root, "data", `reviewed-conjugations-next50${batch}.json`);
const pagePath = path.join(root, "app", "conjugation", "page.tsx");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const previous = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) : {};
const verbs = fs.readFileSync(listPath, "utf8").split(/\r?\n/u).map((x) => x.trim().split(":", 1)[0]).filter(Boolean);
const etreOnlyByBatch = {
  "": ["partir", "sortir", "naître", "mourir", "descendre", "arriver", "rester", "entrer", "monter", "passer"],
  b: ["apparaître"],
  c: ["devenir", "revenir", "parvenir", "intervenir"],
};
const dualAuxByBatch = {
  "": ["sortir", "descendre", "monter", "passer"],
  b: ["paraître", "apparaître", "disparaître"],
  c: [],
};
const etreOnly = new Set(etreOnlyByBatch[batchName] ?? []);
const dualAux = new Set(dualAuxByBatch[batchName] ?? []);
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

function readUsageExamples() {
  const page = fs.readFileSync(pagePath, "utf8");
  const marker = "const USAGES:Record<string,Usage[]>=";
  const start = page.indexOf(marker);
  if (start < 0) throw new Error("USAGES examples were not found");
  const objectStart = page.indexOf("{", start + marker.length);
  const objectEnd = page.indexOf("\n};", objectStart);
  if (objectEnd < 0) throw new Error("USAGES examples are not terminated");
  return Function(`"use strict"; return (${page.slice(objectStart, objectEnd + 2)});`)();
}

const usageExamples = readUsageExamples();
const safeFallbackTails = {
  mentir: "à son médecin",
  taire: "une information confidentielle",
  valoir: "beaucoup aux yeux de cette équipe",
  asseoir: "un enfant sur une chaise",
  exclure: "cette possibilité du rapport final",
  joindre: "la facture au courriel",
  atteindre: "l’objectif annuel en juin",
  vaincre: "l’adversaire lors de la finale",
  convaincre: "l’équipe de vérifier les faits",
  battre: "le record précédent",
  rompre: "le contrat d’un commun accord",
  interrompre: "la réunion pendant quelques minutes",
  promettre: "de respecter le délai convenu",
  permettre: "à l’équipe de poursuivre son travail",
  admettre: "une erreur devant l’équipe",
  remettre: "le dossier au responsable",
  commettre: "une erreur dans le calcul",
  transmettre: "le rapport au service concerné",
  devenir: "en mesure de gérer cette mission",
  prévenir: "le responsable de ce retard",
  maintenir: "la position initiale pendant les négociations",
};
const forcedSafeContexts = new Set(["valoir", "asseoir", "exclure", "joindre", "atteindre", "vaincre", "convaincre", "battre", "admettre", "devenir", "prévenir", "maintenir"]);

function findEntry(verb) {
  if (source[verb]) return source[verb];
  const sourceVerb = verb.replace(/^se\s+/u, "").replace(/^s[’'](?=\p{L})/u, "");
  if (source[sourceVerb]) return source[sourceVerb];
  const normalized = sourceVerb.normalize("NFD").replace(/\p{M}/gu, "");
  const key = Object.keys(source).find((candidate) => candidate.normalize("NFD").replace(/\p{M}/gu, "") === normalized);
  if (!key) throw new Error(`Missing source entry for ${verb}`);
  return source[key];
}

function valueFor(table, person) {
  const key = Object.keys(table).find((candidate) => candidate.split(";").includes(person));
  if (!key) throw new Error(`Missing person ${person}`);
  // The source can include a modern spelling variant after a semicolon.
  // Keep the first, standard display form so the learner never sees an
  // implementation delimiter inside the conjugation.
  return table[key].split(";")[0];
}

function elided(prefix, form) {
  if (!/^je$/u.test(prefix) && !/^que je$/u.test(prefix)) return `${prefix} ${form}`;
  const startsVowel = /^[haeiouyàâäéèêëîïôöùûüœ]/iu.test(form);
  if (!startsVowel) return `${prefix} ${form}`;
  return prefix === "je" ? `j’${form}` : `que j’${form}`;
}

function optionalValueFor(table, person) {
  const key = Object.keys(table).find((candidate) => candidate.split(";").includes(person));
  return key ? table[key].split(";")[0] : undefined;
}

function finiteRows(table, subjunctive = false, verb = "") {
  return personPairs.flatMap(([maleKey, femaleKey], index) => {
    const male = optionalValueFor(table, maleKey);
    const female = optionalValueFor(table, femaleKey);
    if (!male && !female) return [];
    if (verb === "falloir") return [subjunctive ? `qu’il ${male ?? female}` : `il ${male ?? female}`];
    if (verb === "pleuvoir" && index === 2) return [subjunctive ? `qu’il ${male ?? female}` : `il ${male ?? female}`];
    if (!male) return [elided(subjunctive ? (index === 2 ? "qu’elle" : subjSubjects[index]) : (index === 2 ? "elle" : subjects[index]), female)];
    if (!female) return [elided(subjunctive ? (index === 2 ? "qu’il" : subjSubjects[index]) : (index === 2 ? "il" : subjects[index]), male)];
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
    return [elided(prefix, combined)];
  });
}

function voiceFor(entry, verb, auxiliary) {
  if (/^(?:se\s+|s[’'])/u.test(verb)) {
    if (!entry.voix_prono) throw new Error(`No pronominal voice for ${verb}`);
    return entry.voix_prono;
  }
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
    forms[title] = finiteRows(voice[mood][tense], mood === "subjonctif", verb);
  }
  forms["Impératif présent"] = Object.values(voice.imperatif?.present ?? {}).map((value) => value.split(";")[0]);
  forms["Impératif passé"] = Object.values(voice.imperatif?.passe ?? {}).map((value) => value.split(";")[0]);
  forms["Infinitif présent"] = [verb];
  const pp = voice.participe.passe;
  const simpleParticiples = [...new Set([pp.sm, pp.sf, pp.pm, pp.pf])];
  const compoundParticiples = [...new Set([pp.compound_sm, pp.compound_sf, pp.compound_pm, pp.compound_pf])];
  const pronominal = /^(?:se\s+|s[’'])/u.test(verb);
  forms["Infinitif passé"] = auxiliary === "être"
    ? simpleParticiples.map((participle) => `${pronominal ? "s’être" : "être"} ${participle}`)
    : [`avoir ${pp.sm}`];
  forms["Participe présent"] = voice.participe.present ? [voice.participe.present] : [];
  forms["Participe passé"] = [...simpleParticiples, ...compoundParticiples];
  forms["Gérondif présent"] = voice.participe.present ? [`en ${voice.participe.present}`] : [];
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
  if (verb === "pleuvoir") return index === 1 ? "sur le boxeur pendant le combat" : "sur la ville pendant la nuit";
  if (forcedSafeContexts.has(verb)) return safeFallbackTails[verb];
  const smartSentence = smartExamples[verb]?.[Math.min(index, 5)]?.[0];
  const usagePool = usageExamples[verb]?.map((usage) => usage.example).filter(Boolean) ?? [];
  const sentences = smartSentence ? [smartSentence] : usagePool;
  if (!sentences.length && safeFallbackTails[verb]) return safeFallbackTails[verb];
  if (!sentences.length) throw new Error(`No contextual example is available for ${verb}`);
  const table = voice.indicatif.present;
  const candidates = [...new Set(Object.values(table).map((value) => value.split(";")[0]))];
  for (const sentence of sentences) {
    const lower = sentence.toLocaleLowerCase("fr").replace(/’/gu, "'");
    for (const conjugated of candidates) {
      const escaped = conjugated.toLocaleLowerCase("fr").replace(/’/gu, "'").replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
      const match = lower.match(new RegExp(`(?<!\\p{L})${escaped}(?!\\p{L})`, "u"));
      if (match?.index !== undefined) {
        return sentence.slice(match.index + match[0].length).trim().replace(/[.!?…]+$/u, "") || "dans ce contexte précis";
      }
    }
  }
  if (safeFallbackTails[verb]) return safeFallbackTails[verb];
  throw new Error(`Could not derive a safe contextual complement for ${verb}`);
}

function frenchExample(verb, title, index, form, voice) {
  const shown = sentenceForm(form);
  const lower = afterQue(shown[0].toLocaleLowerCase("fr") + shown.slice(1));
  const imperativeMap = form.includes(" / ")
    || (title === "Impératif passé" && Object.keys(voice.imperatif?.passe ?? {}).length > 3)
    || (voice.imperatif?.present && Object.keys(voice.imperatif.present).length > 3)
    ? [1, 1, 3, 3, 4, 4]
    : [1, 3, 4];
  const genderedIndex = /(?:ées|ies|ues|tes)$/u.test(shown) ? 5 : /(?:ée|ie|ue|te)$/u.test(shown) ? 2 : /s$/u.test(shown) ? 5 : 2;
  const contextIndex = title.startsWith("Impératif") ? (imperativeMap[index] ?? 4)
    : title === "Participe passé" && /^(ayant|étant)/iu.test(shown) ? (/^étant/iu.test(shown) ? genderedIndex : 0)
    : title.startsWith("Gérondif") ? (/^en (?:étant|s['’]étant)/iu.test(shown) ? genderedIndex : 0)
    : title === "Infinitif passé" && /^(?:être|s’être)/iu.test(shown) ? genderedIndex
    : title.startsWith("Infinitif") || title === "Participe présent" ? 0
    : index;
  let tail = smartTail(verb, contextIndex, voice).replace(/\btoujours\b\s*/iu, "").trim();
  const historicalTitles = new Set(["Passé composé", "Imparfait", "Plus-que-parfait", "Passé simple", "Passé antérieur", "Conditionnel passé", "Subjonctif imparfait", "Subjonctif plus-que-parfait"]);
  if (historicalTitles.has(title)) {
    tail = tail
      .replace(/\baujourd’hui\b/giu, "ce jour-là")
      .replace(/\bhier\b/giu, "la veille")
      .replace(/\bdemain\b/giu, "le lendemain")
      .replace(/\bla semaine prochaine\b/giu, "la semaine suivante")
      .replace(/\bde le lendemain\b/giu, "du lendemain");
  }
  const core = `${capitalized(shown)} ${tail}`.trim();
  if (verb === "pleuvoir" && /(?:ils|elles)/iu.test(shown)) return `La forme « ${lower} ${tail} » renvoie ici aux coups qui frappent le boxeur.`;
  if (verb === "falloir" && title === "Infinitif passé") return `La tournure « ${lower} ${tail} » exprime une nécessité antérieure.`;
  if (verb === "falloir" && title === "Participe passé" && /^ayant/iu.test(shown)) return `La tournure « ${lower} ${tail} » exprime une nécessité accomplie.`;
  if (verb === "falloir" && title === "Gérondif passé") return `La tournure « ${lower} ${tail} » est très rare en français contemporain.`;
  if (verb === "pleuvoir" && title === "Participe présent") return `La forme « ${shown} » apparaît surtout dans des constructions littéraires.`;
  if (verb === "pleuvoir" && title === "Participe passé" && /^ayant/iu.test(shown)) return `La tournure « ${lower} ${tail} » décrit une pluie antérieure.`;
  if (verb === "pleuvoir" && title.startsWith("Gérondif")) return `La tournure « ${lower} ${tail} » est rare et s’emploie surtout dans un style recherché.`;
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
  if (title === "Subjonctif présent") return `Il est possible ${lower} ${tail}.`;
  if (title === "Subjonctif passé") return `Il est possible ${lower} ${tail}.`;
  if (title === "Subjonctif imparfait") return `Il était possible ${lower} ${tail}.`;
  if (title === "Subjonctif plus-que-parfait") return `Il était possible ${lower} ${tail}.`;
  if (title === "Impératif présent") return `${core} dès maintenant.`;
  if (title === "Impératif passé") return /\bavant\b/iu.test(tail) ? `${core}.` : `${core} avant l’heure convenue.`;
  if (title === "Infinitif présent") return `${capitalized(shown)} ${tail} demande une attention particulière.`;
  if (title === "Infinitif passé") {
    if (/^(?:être|s’être)/iu.test(shown)) {
      const subject = /(?:ées|ies|ues|tes)$/u.test(shown) ? "elles" : /(?:ée|ie|ue|te)$/u.test(shown) ? "elle" : /s$/u.test(shown) ? "ils" : "il";
      return `Après ${lower} ${tail}, ${subject} ${subject === "ils" || subject === "elles" ? "ont" : "a"} poursuivi son travail.`;
    }
    return `Après ${lower} ${tail}, j’ai poursuivi mon travail.`;
  }
  if (title === "Participe présent") return `${core}, j’ai poursuivi ma mission.`;
  if (title === "Participe passé" && /^ayant/iu.test(shown)) return `${core}, j’ai pu continuer.`;
  if (title === "Participe passé" && /^étant/iu.test(shown)) {
    const subject = /(?:ées|ies|ues|tes)$/u.test(shown) ? "elles" : /(?:ée|ie|ue|te)$/u.test(shown) ? "elle" : /s$/u.test(shown) ? "ils" : "il";
    return `${core}, ${subject} ${subject === "ils" || subject === "elles" ? "ont" : "a"} pu continuer.`;
  }
  if (title === "Participe passé") return `La forme « ${shown} » illustre l’accord du participe passé du verbe ${verb}.`;
  if (title === "Gérondif présent") return `${core}, je facilite le travail.`;
  if (title === "Gérondif passé" && /^en (?:étant|s['’]étant)/iu.test(shown)) {
    const subject = /(?:ées|ies|ues|tes)$/u.test(shown) ? "elles" : /(?:ée|ie|ue|te)$/u.test(shown) ? "elle" : /s$/u.test(shown) ? "ils" : "il";
    return `${core}, ${subject} ${subject === "ils" || subject === "elles" ? "ont" : "a"} transmis le compte rendu.`;
  }
  if (title === "Gérondif passé") return `${core}, j’ai transmis le compte rendu.`;
  throw new Error(`Unsupported title ${title}`);
}

const output = {};
for (const verb of verbs) {
  const entry = findEntry(verb);
  const auxiliary = /^(?:se\s+|s[’'])/u.test(verb) || etreOnly.has(verb) ? "être" : "avoir";
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
        : verb === "pleuvoir" && title === "Participe présent"
          ? `تظهر الصيغة الفرنسية « ${shown} » غالبًا في تراكيب أدبية.`
        : verb === "pleuvoir" && title.startsWith("Gérondif")
          ? `الصيغة الفرنسية « ${shown} » نادرة وتظهر خصوصًا في الأسلوب الأدبي الرفيع.`
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
