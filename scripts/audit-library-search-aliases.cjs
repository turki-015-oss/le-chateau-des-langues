const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = JSON.parse(fs.readFileSync(path.join(__dirname, "library-search-aliases.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public/library/dictionary/manifest.json"), "utf8"));

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ىیۍې]/g, "ي")
    .replace(/[ةۀە]/g, "ه")
    .replace(/[کڪ]/g, "ك")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[.,،؛;:!?؟…"'’‘`´“”«»()[\]{}|\\/_‐‑‒–—―-]+/g, " ")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("fr")
    .trim();
}

function rank(value, needle) {
  const normalized = normalize(value);
  const compact = normalized.replace(/\s/g, "");
  const compactNeedle = needle.replace(/\s/g, "");
  const compareCompact = /[a-z]/i.test(normalized) && /[a-z]/i.test(needle);
  if (!normalized) return null;
  if (normalized === needle || (compareCompact && compact === compactNeedle)) return 0;
  if (normalized.startsWith(needle) || (compareCompact && compact.startsWith(compactNeedle))) return 1;
  if (normalized.split(/[\s'’.-]+/).some((part) => part.startsWith(needle))) return 2;
  if (normalized.includes(needle) || (compareCompact && compact.includes(compactNeedle))) return 3;
  return null;
}

function search(query) {
  const needle = normalize(query);
  return manifest.search
    .map((entry) => {
      const primary = [rank(entry.word, needle), rank(entry.arabic, needle)].filter(Number.isInteger);
      const aliases = (entry.searchAliases ?? []).map((alias) => rank(alias, needle)).filter(Number.isInteger);
      const primaryRank = primary.length ? Math.min(...primary) : null;
      const aliasRank = aliases.length ? Math.min(...aliases) : null;
      if (primaryRank === null && aliasRank === null) return null;
      return {
        entry,
        score: Math.min(
          primaryRank !== null ? primaryRank * 3 : Number.POSITIVE_INFINITY,
          aliasRank !== null ? aliasRank * 3 + 1 : Number.POSITIVE_INFINITY,
        ),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.entry.word.length - b.entry.word.length)
    .slice(0, 12)
    .map(({ entry }) => entry);
}

const failures = [];
const batches = source.batches ?? [];
const sourceEntries = batches.flatMap((batch) => Object.entries(batch.entries ?? {}));
const manifestAliases = manifest.search.filter((entry) => entry.searchAliases?.length);
const sourceAliasCount = sourceEntries.reduce((sum, [, aliases]) => sum + aliases.length, 0);

if (!batches.length) failures.push("No synonym batches were found");
for (const batch of batches) {
  const count = Object.keys(batch.entries ?? {}).length;
  if (count !== 200) failures.push(`${batch.id}: expected 200 reviewed entries, found ${count}`);
}
if (new Set(sourceEntries.map(([id]) => id)).size !== sourceEntries.length) {
  failures.push("A dictionary entry appears in more than one synonym batch");
}
if (manifest.searchAliasBatchCount !== batches.length) failures.push("Manifest batch count is stale");
if (manifest.searchAliasEntryCount !== sourceEntries.length) failures.push("Manifest entry count is stale");
if (manifest.searchAliasCount !== sourceAliasCount) failures.push("Manifest alias count is stale");
if (manifestAliases.length !== sourceEntries.length) failures.push("Manifest alias-bearing entry count is stale");

const manifestById = new Map(manifest.search.map((entry) => [entry.id, entry]));
for (const [id, aliases] of sourceEntries) {
  const entry = manifestById.get(id);
  if (!entry) {
    failures.push(`Unknown dictionary id: ${id}`);
    continue;
  }
  if (!Array.isArray(aliases) || !aliases.length) failures.push(`${id}: empty alias list`);
  const normalized = aliases.map(normalize);
  if (normalized.some((alias) => !alias)) failures.push(`${id}: empty normalized alias`);
  if (new Set(normalized).size !== normalized.length) failures.push(`${id}: duplicate normalized alias`);
  if (normalized.includes(normalize(entry.arabic))) failures.push(`${id}: alias duplicates the displayed Arabic meaning`);
  if (JSON.stringify(entry.searchAliases) !== JSON.stringify(aliases)) failures.push(`${id}: generated aliases are stale`);
}

const properIds = new Set();
for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  const entries = JSON.parse(fs.readFileSync(path.join(root, `public/library/dictionary/${letter}.json`), "utf8"));
  for (const entry of entries) {
    if (entry.countryTopic || entry.partOfSpeech === "proper_noun") properIds.add(entry.id);
  }
}
for (const [id] of sourceEntries) {
  if (properIds.has(id)) failures.push(`${id}: proper names and countries cannot receive aliases`);
}

const expected = {
  "بيت": "maison",
  "مشاكل": "problème",
  "موبايل": "téléphone",
  "دكتور": "médecin",
  "طيارة": "avion",
  "مشفى": "hôpital",
  "شباك": "fenêtre",
  "كمبيوتر": "ordinateur",
  "لوري": "camion",
  "أتاي": "thé",
  "بلدة صغيرة": "village",
  "السكين": "couteau",
  "هرة": "chat",
  "كؤوس": "verre",
  "عرس": "mariage",
  "اعتلال": "maladie",
  "الويكند": "week-end",
  "أتوبيس": "bus",
  "كوبري": "pont",
  "مأمور الشرطة": "shérif",
  "دار القضاء": "tribunal",
  "حمام سباحة": "piscine",
  "أسانسير": "ascenseur",
  "جراج": "garage",
  "سندويتش": "sandwich",
  "الفرنسية": "français",
  "فطيرة بيتزا": "pizza",
  "موتور": "moteur",
  "أورام سرطانية": "cancer",
  "تساقط الثلوج": "neige",
  "جماهير": "foule",
  "سكاكر": "bonbon",
  "تقانة": "technologie",
  "شوربة": "soupe",
  "باركينغ": "parking",
  "صوفا": "canapé",
  "مرفأ": "port",
  "دار الكتب": "bibliothèque",
  "الظمأ": "soif",
  "غيمة": "nuage",
  "فكة": "monnaie",
  "دار الآثار": "musée",
  "ساتلايت": "satellite",
  "كرافتة": "cravate",
  "أوكسجين": "oxygène",
  "جوازات سفر": "passeport",
  "يوترن": "demi-tour",
  "رئيس البعثة الدبلوماسية": "ambassadeur",
  "فحص ما بعد الوفاة": "autopsie",
  "أوتوستراد": "autoroute",
  "شهر نيسان": "avril",
  "ملامسة المدرج": "atterrissage",
  "كلمة آمين": "amen",
  "هوفر": "aspirateur",
  "قاطور": "alligator",
  "قوس المطر": "arc-en-ciel",
  "إبينفرين": "adrénaline",
  "أرضي شوكي": "artichaut",
  "كاوكاو": "arachide",
  "أوتوموبيل": "automobile",
  "عمى الكلمات": "alexie",
  "أبارتهايد": "apartheid",
  "كتاب خرائط": "atlas",
  "عدم اكتراث": "apathie",
  "جرة أثرية": "amphore",
  "مجموعة جزر": "archipel",
  "مزيل القلق": "anxiolytique",
  "شيد اللمبة": "abat-jour",
  "قسطرة توسيع الأوعية": "angioplastie",
  "هوفركرافت": "aéroglisseur",
  "صفير الأذن": "acouphène",
  "جناس استهلالي": "allitération",
  "فك الرق": "affranchissement",
  "مدينة وضواحيها": "agglomération",
  "خطأ تاريخي زمني": "anachronisme",
  "ورقة إجابات مخفية": "antisèche",
  "حلة ضغط": "autocuiseur",
  "مقياس العجلة": "accéléromètre",
  "مسدس رش دقيق": "aérographe",
  "قيصر روماني أول": "auguste",
  "جوهرة زرقاء مخضرة": "aigue-marine",
  "قصر الأطراف الوراثي": "achondroplasie",
  "لغة منخفضة المستوى": "assembleur",
  "سنة واحدة": "an",
  "الشهر التاسع": "septembre",
  "هيدفون": "casque",
  "مؤسسة تعليم إعدادي": "collège",
  "عشاء عيد الشكر": "repas de Thanksgiving",
  "فندق سيارات": "motel",
  "عضو تنقية الدم": "rein",
  "وفاء بالعهد": "loyauté",
  "حلبة سباق": "circuit",
  "حزن الوفاة": "deuil",
  "ساعة برج": "horloge",
  "ثلاجة الموتى": "morgue",
  "تبديل عملة": "change",
  "سائل تناسلي ذكري": "sperme",
  "ثديي يعيش تحت الأرض": "taupe",
  "جهاز رادار": "radar",
  "الشهر الثاني عشر": "décembre",
  "رتبة عسكرية للأفراد": "caporal",
  "منتجات التبغ": "tabac",
  "سوق شعبي": "bazar",
  "فرقة آلات موسيقية": "orchestre",
  "حمضيات صفراء": "citron",
  "كوافير": "coiffeur",
  "عيادة المدرسة": "infirmerie",
  "جين وراثي": "gène",
  "مكان صرف الدواء": "pharmacie",
  "ممر المشاة": "trottoir",
  "الموت الأسود": "peste",
  "فان": "camionnette",
  "شهر تشرين الثاني": "novembre",
  "قبعة بيسبول": "casquette",
  "مخزن السطح": "grenier",
  "مئة جزء من المتر": "centimètre",
  "صورة فوتوغرافية سالبة": "négatif",
  "مجيب الهاتف": "répondeur",
  "مخدر أفيوني طبي": "morphine",
  "رابع حروف اليونانية": "delta",
  "الحبر الأعظم": "pape",
  "عقد زمني": "décennie",
  "وسيلة وقاية جنسية": "préservatif",
  "عظمة الفك": "mâchoire",
  "مادة كيميائية في الجسم": "hormone",
  "أرض مستنقعية": "marais",
  "دوران الرأس": "vertige",
  "اللغة الغيلية الأيرلندية": "irlandais",
  "شهادة نهاية الثانوية بفرنسا": "bac",
  "هزة الجماع": "orgasme",
  "متجر كتب": "librairie",
  "وحدة تحكم لاسلكية": "télécommande",
  "ارتفاع الطائرة من المدرج": "décollage",
  "مسؤول إداري فرنسي": "préfet",
  "مشروب أغاف مقطر": "tequila",
  "كتلة جليدية متحركة": "glacier",
  "ممثل الحكومة في الإقليم": "préfet",
  "قطعة نقدية فرنسية قديمة": "louis",
  "ألف جزء من الكيلوغرام": "gramme",
  "كائن من الأساطير الإسكندنافية": "troll",
  "مجسم سداسي الوجوه": "cube",
  "طائر جارح يتغذى على الجيف": "vautour",
  "علامة النسبة المئوية": "pourcentage",
  "ممارسة طقسية": "rite",
  "عدم ممارسة الجنس سابقا": "virginité",
  "مزيج جن وفيرموث": "martini",
  "جرم سماوي بذيل": "comète",
  "شاحنة بصندوق خلفي": "pick-up",
  "فن قتالي ياباني": "karaté",
  "وثيقة حماية اختراع": "brevet",
  "عصر إحياء الفنون": "renaissance",
  "احتشاء عضلة القلب": "infarctus",
  "بيت زجاجي زراعي": "serre",
  "أبرشية محلية": "paroisse",
  "مفتاح النور": "interrupteur",
  "قائد فرقة موسيقية": "maestro",
  "مقر الأسقف": "cathédrale",
  "عشرة آلاف متر مربع": "hectare",
  "ألف جزء من المتر": "millimètre",
  "عضو تخزين البول": "vessie",
  "قيادة الأركان": "état-major",
  "عصارة الخشخاش": "opium",
  "إسفين تثبيت": "cale",
  "مسابقة روديو": "rodéo",
  "مدة اثني عشر شهرا": "année",
  "إثبات الوجود بمكان آخر": "alibi",
  "سلاح سهام ميكانيكي": "arbalète",
  "تذكرة ذهاب": "aller",
  "فصل الخريف": "automne",
  "مستودع أسلحة": "arsenal",
  "حكم قضائي بالبراءة": "acquittement",
  "خطاف تثبيت السفينة": "ancre",
  "مركبة إيطالية بثلاث عجلات": "ape",
  "سوابق المريض": "anamnèse",
  "حرمان الأنسجة من الأكسجين": "anoxie",
  "عظم بين الساق والقدم": "astragale",
  "انعدام الشم": "anosmie",
  "موت الخلية المبرمج": "apoptose",
  "تضخم العقد اللمفاوية": "adénopathie",
  "الخوف من العناكب": "arachnophobie",
  "مستقيم مقارب": "asymptote",
  "غياب الدورة الشهرية": "aménorrhée",
  "بعوضة ناقلة للملاريا": "anophèle",
  "ترياق تسمم الباراسيتامول": "acétylcystéine",
};
for (const [query, word] of Object.entries(expected)) {
  if (!search(query).some((entry) => entry.word === word)) {
    failures.push(`Search '${query}' does not return '${word}' in the first 12 results`);
  }
}

if (failures.length) {
  console.error(JSON.stringify({ status: "failed", failures }, null, 2));
  process.exit(1);
}

const collisionMap = new Map();
for (const [id, aliases] of sourceEntries) {
  for (const alias of aliases) {
    const key = normalize(alias);
    collisionMap.set(key, [...(collisionMap.get(key) ?? []), id]);
  }
}
const sharedAliases = [...collisionMap.values()].filter((ids) => new Set(ids).size > 1).length;

console.log(JSON.stringify({
  status: "passed",
  batches: batches.length,
  reviewedEntries: sourceEntries.length,
  aliases: sourceAliasCount,
  liveSearchCases: Object.keys(expected).length,
  sharedAccurateAliases: sharedAliases,
}, null, 2));
