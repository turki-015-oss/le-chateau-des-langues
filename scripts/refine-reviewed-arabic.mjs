import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const batchName = process.argv.find((arg) => arg.startsWith("--batch="))?.split("=", 2)[1] ?? "";
const suffix = batchName ? `-${batchName}` : "";
const dataPath = path.join(root, "data", `reviewed-conjugations-next50${suffix}.json`);
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const globalReplacements = [
  [/كان من الممكن أنني(?! قد)/gu, "كان من الممكن أنني قد"],
  [/من الممكن أنني(?! قد)/gu, "من الممكن أنني قد"],
  [/من الممكن أني(?! قد)/gu, "من الممكن أنني قد"],
  [/قمت بتمرير التقرير/gu, "أرسلت التقرير"],
  [/قمت بنقل التقرير/gu, "أرسلت التقرير"],
  [/مررت التقرير/gu, "أرسلت التقرير"],
  [/مرر التقرير/gu, "أرسل التقرير"],
  [/نقلت التقرير/gu, "أرسلت التقرير"],
  [/نقل التقرير/gu, "إرسال التقرير"],
  [/قمت بنقل المحضر/gu, "أرسلت محضر الاجتماع"],
  [/واصل الفريق عملهم/gu, "واصل الفريق عمله"],
];

for (const record of Object.values(data)) {
  for (const examples of Object.values(record.examples)) {
    for (const example of examples) {
      for (const [pattern, replacement] of globalReplacements) example.ar = example.ar.replace(pattern, replacement);
    }
  }
}

const presentCorrections = {
  b: {
    "Tu commences à comprendre la logique de cet exercice.": "تبدأ في فهم منطق هذا التمرين.",
    "Vous essayez de joindre le service client depuis ce matin.": "تحاولون الاتصال بخدمة العملاء منذ هذا الصباح.",
    "Tu emploies une expression trop familière dans ce courriel.": "تستخدم تعبيرًا دارجًا أكثر من اللازم في هذه الرسالة الإلكترونية.",
    "Je finis le rapport avant la réunion de demain.": "أنهي التقرير قبل اجتماع الغد.",
    "Je réussis cet exercice sans consulter la réponse.": "أنجح في حل هذا التمرين دون الرجوع إلى الإجابة.",
    "Il réussit son examen grâce à une préparation régulière.": "ينجح في امتحانه بفضل الاستعداد المنتظم.",
    "Nous réussissons à réduire les délais de livraison.": "ننجح في تقليص مُدد التسليم.",
    "Je grandis dans une famille qui valorise l’éducation.": "أنشأ في أسرة تقدّر التعليم.",
    "Vous grandissez dans un environnement multiculturel.": "تنشؤون في بيئة متعددة الثقافات.",
    "Ils grandissent paisiblement à la campagne.": "ينشؤون بهدوء في الريف.",
    "Je grossis légèrement pendant les vacances d’hiver.": "يزداد وزني قليلًا خلال عطلة الشتاء.",
    "Il maigrit progressivement grâce à une alimentation équilibrée.": "ينخفض وزنه تدريجيًا بفضل نظام غذائي متوازن.",
    "Je détruis plusieurs bâtiments anciens.": "أهدم عدة مبانٍ قديمة."
  },
  a: {
    "Je reçois les résultats de mon examen demain.": "أتلقى نتائج امتحاني غدًا.",
    "Vous recevez une confirmation par courrier électronique.": "تتلقون تأكيدًا عبر البريد الإلكتروني.",
    "Je vis près de la mer depuis trois ans.": "أعيش بالقرب من البحر منذ ثلاث سنوات.",
    "Il connaît une période difficile depuis le début de l’année.": "يمر بفترة صعبة منذ بداية العام.",
    "Je nais dans une petite ville du sud.": "أولد في بلدة صغيرة في الجنوب.",
    "Tu nais avec une grande curiosité pour le monde.": "تولد ولديك فضول كبير تجاه العالم.",
    "Nous naissons tous avec des talents différents.": "نولد جميعًا بمواهب مختلفة.",
    "Vous naissez dans une famille bilingue.": "تولدون في أسرة ثنائية اللغة.",
    "Ils naissent le même jour dans le même hôpital.": "يولدون في اليوم نفسه وفي المستشفى نفسه.",
    "Je meurs de rire devant cette scène comique.": "أموت من الضحك أمام هذا المشهد الطريف.",
    "J’offre un livre français à mon frère pour son anniversaire.": "أهدي أخي كتابًا فرنسيًا بمناسبة عيد ميلاده.",
    "Tu réponds correctement à la dernière question.": "تجيب إجابة صحيحة عن السؤال الأخير.",
    "Je rends le livre à la bibliothèque aujourd’hui.": "أعيد الكتاب إلى المكتبة اليوم.",
    "Ils comprennent leur erreur après avoir relu le contrat.": "يدركون خطأهم بعد إعادة قراءة العقد.",
    "Je cherche mes lunettes depuis ce matin.": "أبحث عن نظارتي منذ هذا الصباح.",
    "Ils jouent la dernière scène avec beaucoup d’émotion.": "يؤدون المشهد الأخير بإحساس كبير.",
    "Vous arrivez au terme d’un long projet.": "تصلون إلى نهاية مشروع طويل.",
    "Je reste chez moi pour terminer ce rapport.": "أبقى في المنزل لإنهاء هذا التقرير.",
    "Nous habitons cette région depuis notre enfance.": "نسكن هذه المنطقة منذ طفولتنا."
  }
};

const corrections = presentCorrections[batchName || "a"] ?? {};
for (const record of Object.values(data)) {
  for (const example of record.examples.Présent ?? []) if (corrections[example.fr]) example.ar = corrections[example.fr];
}

fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Refined contextual Arabic for batch ${batchName || "a"}: ${Object.keys(data).length} verbs.`);
