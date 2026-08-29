#!/usr/bin/env node

/**
 * Build the 195 country-name entries that are merged into the existing A-Z
 * library books. The table deliberately contains no capitals, cities, or
 * political membership labels.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "scripts", "library-country-entries.json");
const arabicNames = new Intl.DisplayNames(["ar"], { type: "region" });

// ISO | French headword | gender | article | preposition | nationality (m.) | nationality (f.)
const SOURCE = `
AF|Afghanistan|M|l’|en|Afghan|Afghane
ZA|Afrique du Sud|F|l’|en|Sud-Africain|Sud-Africaine
AL|Albanie|F|l’|en|Albanais|Albanaise
DZ|Algérie|F|l’|en|Algérien|Algérienne
DE|Allemagne|F|l’|en|Allemand|Allemande
AD|Andorre|F|l’|en|Andorran|Andorrane
AO|Angola|M|l’|en|Angolais|Angolaise
AG|Antigua-et-Barbuda|M|∅|à|Antiguayen|Antiguayenne
SA|Arabie saoudite|F|l’|en|Saoudien|Saoudienne
AR|Argentine|F|l’|en|Argentin|Argentine
AM|Arménie|F|l’|en|Arménien|Arménienne
AU|Australie|F|l’|en|Australien|Australienne
AT|Autriche|F|l’|en|Autrichien|Autrichienne
AZ|Azerbaïdjan|M|l’|en|Azerbaïdjanais|Azerbaïdjanaise
BS|Bahamas|FP|les|aux|Bahaméen|Bahaméenne
BH|Bahreïn|M|∅|à|Bahreïnien|Bahreïnienne
BD|Bangladesh|M|le|au|Bangladais|Bangladaise
BB|Barbade|F|la|à la|Barbadien|Barbadienne
BE|Belgique|F|la|en|Belge|Belge
BZ|Belize|M|le|au|Bélizien|Bélizienne
BJ|Bénin|M|le|au|Béninois|Béninoise
BT|Bhoutan|M|le|au|Bhoutanais|Bhoutanaise
BY|Biélorussie|F|la|en|Biélorusse|Biélorusse
MM|Myanmar|M|le|au|Birman|Birmane
BO|Bolivie|F|la|en|Bolivien|Bolivienne
BA|Bosnie-Herzégovine|F|la|en|Bosnien|Bosnienne
BW|Botswana|M|le|au|Botswanais|Botswanaise
BR|Brésil|M|le|au|Brésilien|Brésilienne
BN|Brunei|M|le|au|Brunéien|Brunéienne
BG|Bulgarie|F|la|en|Bulgare|Bulgare
BF|Burkina Faso|M|le|au|Burkinabè|Burkinabè
BI|Burundi|M|le|au|Burundais|Burundaise
CV|Cap-Vert|M|le|au|Cap-Verdien|Cap-Verdienne
KH|Cambodge|M|le|au|Cambodgien|Cambodgienne
CM|Cameroun|M|le|au|Camerounais|Camerounaise
CA|Canada|M|le|au|Canadien|Canadienne
CL|Chili|M|le|au|Chilien|Chilienne
CN|Chine|F|la|en|Chinois|Chinoise
CY|Chypre|F|∅|à|Chypriote|Chypriote
CO|Colombie|F|la|en|Colombien|Colombienne
KM|Comores|FP|les|aux|Comorien|Comorienne
CG|Congo|M|le|au|Congolais|Congolaise
KP|Corée du Nord|F|la|en|Nord-Coréen|Nord-Coréenne
KR|Corée du Sud|F|la|en|Sud-Coréen|Sud-Coréenne
CR|Costa Rica|M|le|au|Costaricien|Costaricienne
CI|Côte d’Ivoire|F|la|en|Ivoirien|Ivoirienne
HR|Croatie|F|la|en|Croate|Croate
CU|Cuba|F|∅|à|Cubain|Cubaine
DK|Danemark|M|le|au|Danois|Danoise
DJ|Djibouti|M|∅|à|Djiboutien|Djiboutienne
DM|Dominique|F|la|à la|Dominiquais|Dominiquaise
EG|Égypte|F|l’|en|Égyptien|Égyptienne
AE|Émirats arabes unis|MP|les|aux|Émirati|Émiratie
EC|Équateur|M|l’|en|Équatorien|Équatorienne
ER|Érythrée|F|l’|en|Érythréen|Érythréenne
ES|Espagne|F|l’|en|Espagnol|Espagnole
EE|Estonie|F|l’|en|Estonien|Estonienne
SZ|Eswatini|M|l’|en|Eswatinien|Eswatinienne
US|États-Unis|MP|les|aux|Américain|Américaine
ET|Éthiopie|F|l’|en|Éthiopien|Éthiopienne
FJ|Fidji|FP|les|aux|Fidjien|Fidjienne
FI|Finlande|F|la|en|Finlandais|Finlandaise
FR|France|F|la|en|Français|Française
GA|Gabon|M|le|au|Gabonais|Gabonaise
GM|Gambie|F|la|en|Gambien|Gambienne
GE|Géorgie|F|la|en|Géorgien|Géorgienne
GH|Ghana|M|le|au|Ghanéen|Ghanéenne
GR|Grèce|F|la|en|Grec|Grecque
GD|Grenade|F|la|à la|Grenadien|Grenadienne
GT|Guatemala|M|le|au|Guatémaltèque|Guatémaltèque
GN|Guinée|F|la|en|Guinéen|Guinéenne
GW|Guinée-Bissau|F|la|en|Bissau-Guinéen|Bissau-Guinéenne
GQ|Guinée équatoriale|F|la|en|Équatoguinéen|Équatoguinéenne
GY|Guyana|M|le|au|Guyanien|Guyanienne
HT|Haïti|M|∅|en|Haïtien|Haïtienne
HN|Honduras|M|le|au|Hondurien|Hondurienne
HU|Hongrie|F|la|en|Hongrois|Hongroise
MH|Îles Marshall|FP|les|aux|Marshallais|Marshallaise
SB|Îles Salomon|FP|les|aux|Salomonais|Salomonaise
IN|Inde|F|l’|en|Indien|Indienne
ID|Indonésie|F|l’|en|Indonésien|Indonésienne
IQ|Irak|M|l’|en|Irakien|Irakienne
IR|Iran|M|l’|en|Iranien|Iranienne
IE|Irlande|F|l’|en|Irlandais|Irlandaise
IS|Islande|F|l’|en|Islandais|Islandaise
IL|Israël|M|∅|en|Israélien|Israélienne
IT|Italie|F|l’|en|Italien|Italienne
JM|Jamaïque|F|la|en|Jamaïcain|Jamaïcaine
JP|Japon|M|le|au|Japonais|Japonaise
JO|Jordanie|F|la|en|Jordanien|Jordanienne
KZ|Kazakhstan|M|le|au|Kazakh|Kazakhe
KE|Kenya|M|le|au|Kényan|Kényane
KG|Kirghizistan|M|le|au|Kirghiz|Kirghize
KI|Kiribati|FP|les|aux|Kiribatien|Kiribatienne
KW|Koweït|M|le|au|Koweïtien|Koweïtienne
LA|Laos|M|le|au|Laotien|Laotienne
LS|Lesotho|M|le|au|Lésothien|Lésothienne
LV|Lettonie|F|la|en|Letton|Lettonne
LB|Liban|M|le|au|Libanais|Libanaise
LR|Liberia|M|le|au|Libérien|Libérienne
LY|Libye|F|la|en|Libyen|Libyenne
LI|Liechtenstein|M|le|au|Liechtensteinois|Liechtensteinoise
LT|Lituanie|F|la|en|Lituanien|Lituanienne
LU|Luxembourg|M|le|au|Luxembourgeois|Luxembourgeoise
MK|Macédoine du Nord|F|la|en|Macédonien|Macédonienne
MG|Madagascar|M|∅|à|Malgache|Malgache
MY|Malaisie|F|la|en|Malaisien|Malaisienne
MW|Malawi|M|le|au|Malawite|Malawite
MV|Maldives|FP|les|aux|Maldivien|Maldivienne
ML|Mali|M|le|au|Malien|Malienne
MT|Malte|F|∅|à|Maltais|Maltaise
MA|Maroc|M|le|au|Marocain|Marocaine
MU|Maurice|F|∅|à|Mauricien|Mauricienne
MR|Mauritanie|F|la|en|Mauritanien|Mauritanienne
MX|Mexique|M|le|au|Mexicain|Mexicaine
FM|Micronésie|F|la|en|Micronésien|Micronésienne
MD|Moldavie|F|la|en|Moldave|Moldave
MC|Monaco|M|∅|à|Monégasque|Monégasque
MN|Mongolie|F|la|en|Mongol|Mongole
ME|Monténégro|M|le|au|Monténégrin|Monténégrine
MZ|Mozambique|M|le|au|Mozambicain|Mozambicaine
NA|Namibie|F|la|en|Namibien|Namibienne
NR|Nauru|F|∅|à|Nauruan|Nauruane
NP|Népal|M|le|au|Népalais|Népalaise
NI|Nicaragua|M|le|au|Nicaraguayen|Nicaraguayenne
NE|Niger|M|le|au|Nigérien|Nigérienne
NG|Nigeria|M|le|au|Nigérian|Nigériane
NO|Norvège|F|la|en|Norvégien|Norvégienne
NZ|Nouvelle-Zélande|F|la|en|Néo-Zélandais|Néo-Zélandaise
OM|Oman|M|∅|à|Omanais|Omanaise
UG|Ouganda|M|l’|en|Ougandais|Ougandaise
UZ|Ouzbékistan|M|l’|en|Ouzbek|Ouzbèke
PK|Pakistan|M|le|au|Pakistanais|Pakistanaise
PW|Palaos|FP|les|aux|Palaosien|Palaosienne
PS|Palestine|F|la|en|Palestinien|Palestinienne
PA|Panama|M|le|au|Panaméen|Panaméenne
PG|Papouasie-Nouvelle-Guinée|F|la|en|Papou-Néo-Guinéen|Papou-Néo-Guinéenne
PY|Paraguay|M|le|au|Paraguayen|Paraguayenne
NL|Pays-Bas|MP|les|aux|Néerlandais|Néerlandaise
PE|Pérou|M|le|au|Péruvien|Péruvienne
PH|Philippines|FP|les|aux|Philippin|Philippine
PL|Pologne|F|la|en|Polonais|Polonaise
PT|Portugal|M|le|au|Portugais|Portugaise
QA|Qatar|M|le|au|Qatari|Qatarie
CF|République centrafricaine|F|la|en|Centrafricain|Centrafricaine
CD|République démocratique du Congo|F|la|en|Congolais|Congolaise
DO|République dominicaine|F|la|en|Dominicain|Dominicaine
RO|Roumanie|F|la|en|Roumain|Roumaine
GB|Royaume-Uni|M|le|au|Britannique|Britannique
RU|Russie|F|la|en|Russe|Russe
RW|Rwanda|M|le|au|Rwandais|Rwandaise
KN|Saint-Christophe-et-Niévès|M|∅|à|Kittitien ou Névicien|Kittitienne ou Névicienne
LC|Sainte-Lucie|F|∅|à|Saint-Lucien|Saint-Lucienne
SM|Saint-Marin|M|∅|à|Saint-Marinais|Saint-Marinaise
VC|Saint-Vincent-et-les-Grenadines|M|∅|à|Saint-Vincentais|Saint-Vincentaise
SV|Salvador|M|le|au|Salvadorien|Salvadorienne
WS|Samoa|FP|les|aux|Samoan|Samoane
ST|Sao Tomé-et-Principe|M|∅|à|Santoméen|Santoméenne
SN|Sénégal|M|le|au|Sénégalais|Sénégalaise
RS|Serbie|F|la|en|Serbe|Serbe
SC|Seychelles|FP|les|aux|Seychellois|Seychelloise
SL|Sierra Leone|F|la|en|Sierra-Léonais|Sierra-Léonaise
SG|Singapour|M|∅|à|Singapourien|Singapourienne
SK|Slovaquie|F|la|en|Slovaque|Slovaque
SI|Slovénie|F|la|en|Slovène|Slovène
SO|Somalie|F|la|en|Somalien|Somalienne
SD|Soudan|M|le|au|Soudanais|Soudanaise
SS|Soudan du Sud|M|le|au|Sud-Soudanais|Sud-Soudanaise
LK|Sri Lanka|M|le|au|Sri-Lankais|Sri-Lankaise
SE|Suède|F|la|en|Suédois|Suédoise
CH|Suisse|F|la|en|Suisse|Suisse
SR|Suriname|M|le|au|Surinamien|Surinamienne
SY|Syrie|F|la|en|Syrien|Syrienne
TJ|Tadjikistan|M|le|au|Tadjik|Tadjike
TZ|Tanzanie|F|la|en|Tanzanien|Tanzanienne
TD|Tchad|M|le|au|Tchadien|Tchadienne
CZ|Tchéquie|F|la|en|Tchèque|Tchèque
TH|Thaïlande|F|la|en|Thaïlandais|Thaïlandaise
TL|Timor-Leste|M|le|au|Timorais|Timoraise
TG|Togo|M|le|au|Togolais|Togolaise
TO|Tonga|FP|les|aux|Tongien|Tongienne
TT|Trinité-et-Tobago|F|∅|à|Trinidadien|Trinidadienne
TN|Tunisie|F|la|en|Tunisien|Tunisienne
TM|Turkménistan|M|le|au|Turkmène|Turkmène
TR|Turquie|F|la|en|Turc|Turque
TV|Tuvalu|FP|les|aux|Tuvaluan|Tuvaluane
UA|Ukraine|F|l’|en|Ukrainien|Ukrainienne
UY|Uruguay|M|l’|en|Uruguayen|Uruguayenne
VU|Vanuatu|M|le|au|Ni-Vanuatu|Ni-Vanuatu
VA|Vatican|M|le|au|Vaticanais|Vaticanaise
VE|Venezuela|M|le|au|Vénézuélien|Vénézuélienne
VN|Viêt Nam|M|le|au|Vietnamien|Vietnamienne
YE|Yémen|M|le|au|Yéménite|Yéménite
ZM|Zambie|F|la|en|Zambien|Zambienne
ZW|Zimbabwe|M|le|au|Zimbabwéen|Zimbabwéenne
`;

const ARABIC_OVERRIDES = {
  BN: "بروناي",
  CD: "جمهورية الكونغو الديمقراطية",
  CG: "جمهورية الكونغو",
  CI: "كوت ديفوار",
  CV: "الرأس الأخضر",
  CZ: "التشيك",
  FM: "ميكرونيزيا",
  KN: "سانت كيتس ونيفيس",
  LC: "سانت لوسيا",
  MD: "مولدوفا",
  MM: "ميانمار",
  MK: "مقدونيا الشمالية",
  PS: "فلسطين",
  ST: "ساو تومي وبرينسيب",
  SZ: "إسواتيني",
  TL: "تيمور الشرقية",
  VA: "الفاتيكان",
};

const FRENCH_TEMPLATES = [
  (place) => `Nous préparons un voyage ${place} pour le printemps.`,
  (place) => `Elle souhaite étudier ${place} l’année prochaine.`,
  (place) => `Il travaille ${place} depuis plusieurs mois.`,
  (place) => `Ce documentaire présente la vie quotidienne ${place}.`,
  (place) => `Une délégation arrivera ${place} la semaine prochaine.`,
  (place) => `Ils ont vécu ${place} pendant leurs études.`,
  (place) => `Ma famille prévoit de séjourner ${place} cet été.`,
  (place) => `Le professeur organise un échange scolaire ${place}.`,
  (place) => `Nous aimerions passer quelques semaines ${place}.`,
  (place) => `Elle a rencontré ses collègues lors d’un séjour ${place}.`,
  (place) => `Cette association mène un projet éducatif ${place}.`,
  (place) => `Il espère retourner ${place} avant la fin de l’année.`,
];

const ARABIC_TEMPLATES = [
  (country) => `نخطط لرحلة إلى ${country} في فصل الربيع.`,
  (country) => `ترغب في الدراسة في ${country} العام المقبل.`,
  (country) => `يعمل في ${country} منذ عدة أشهر.`,
  (country) => `يعرض هذا الفيلم الوثائقي الحياة اليومية في ${country}.`,
  (country) => `سيصل وفد إلى ${country} الأسبوع المقبل.`,
  (country) => `عاشوا في ${country} خلال فترة دراستهم.`,
  (country) => `تخطط عائلتي للإقامة في ${country} هذا الصيف.`,
  (country) => `ينظم المعلم برنامج تبادل مدرسيًا في ${country}.`,
  (country) => `نود قضاء بضعة أسابيع في ${country}.`,
  (country) => `التقت بزملائها خلال إقامة في ${country}.`,
  (country) => `تنفذ هذه الجمعية مشروعًا تعليميًا في ${country}.`,
  (country) => `يأمل في العودة إلى ${country} قبل نهاية العام.`,
];

const rows = SOURCE.trim().split("\n").map((line) => line.split("|"));
if (rows.length !== 195) throw new Error(`Expected 195 countries, found ${rows.length}`);
if (new Set(rows.map(([code]) => code)).size !== 195) throw new Error("Duplicate ISO country code");
if (new Set(rows.map(([, word]) => word.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase())).size !== 195) {
  throw new Error("Duplicate French country name");
}

const entries = rows.map(([code, word, gender, article, prepositionPrefix, nationalityMasculine, nationalityFeminine], index) => {
  const arabic = ARABIC_OVERRIDES[code] ?? arabicNames.of(code);
  if (!arabic || arabic === code) throw new Error(`Missing Arabic country name for ${code}`);
  const preposition = `${prepositionPrefix} ${word}`;
  return {
    word,
    arabic,
    partOfSpeech: "proper_noun",
    grammarLabel: gender === "F" ? "Féminin"
      : gender === "M" ? "Masculin"
        : gender === "FP" ? "Féminin pluriel" : "Masculin pluriel",
    article: article === "∅" ? "sans article" : article,
    preposition,
    nationality: {
      masculine: nationalityMasculine,
      feminine: nationalityFeminine,
    },
    ipa: "",
    example: FRENCH_TEMPLATES[index % FRENCH_TEMPLATES.length](preposition),
    exampleArabic: ARABIC_TEMPLATES[index % ARABIC_TEMPLATES.length](arabic),
  };
});

fs.writeFileSync(OUTPUT, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: OUTPUT, count: entries.length }, null, 2));
