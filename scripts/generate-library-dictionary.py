#!/usr/bin/env python3
"""Build the castle library's 5,000-entry French-Arabic noun dictionary.

Sources:
- Lexique 4: lemma, frequency, grammatical gender and IPA.
- Wikidata Wikidict: French-Arabic headword mapping (CC0).
- Tatoeba: directly linked French-Arabic example sentences (CC BY 2.0 FR).

The output is split by initial letter so the browser only loads one book at a
time. A compact manifest powers cross-book search.
"""

from __future__ import annotations

import argparse
import bz2
import csv
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / ".tools" / "dictionary-sources"
OUTPUT = ROOT / "public" / "library" / "dictionary"
CURATED_OVERRIDES = ROOT / "scripts" / "library-context-overrides.json"
CURATED_TARGET = 4000
TARGET_COUNT = 5000
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
WORD_RE = re.compile(r"^[A-Za-zÀ-ÖØ-öø-ÿŒœÆæ-]{2,30}$")
TOKEN_RE = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿŒœÆæ'-]+")
ARABIC_RE = re.compile(r"[\u0600-\u06ff]")
DSL_TAG_RE = re.compile(r"\[[^]]+]")


FALLBACK_EXAMPLES = [
    ("Le mot « {word} » figure dans ce dictionnaire.", "توجد كلمة « {arabic} » في هذا القاموس."),
    ("Aujourd’hui, j’apprends le nom « {word} ».", "أتعلم اليوم الاسم « {arabic} »."),
    ("Savez-vous écrire correctement le mot « {word} » ?", "هل تعرف كتابة كلمة « {arabic} » بصورة صحيحة؟"),
    ("Écoutez attentivement la prononciation de « {word} ».", "استمع جيدًا إلى نطق كلمة « {arabic} »."),
    ("Nous révisons le mot « {word} » pendant la leçon.", "نراجع كلمة « {arabic} » أثناء الدرس."),
    ("Le nom « {word} » fait partie de cette leçon.", "الاسم « {arabic} » جزء من هذا الدرس."),
    ("Je cherche le mot « {word} » dans le dictionnaire.", "أبحث عن كلمة « {arabic} » في القاموس."),
    ("Pouvez-vous utiliser le mot « {word} » dans une phrase ?", "هل يمكنك استخدام كلمة « {arabic} » في جملة؟"),
    ("La classe découvre aujourd’hui le mot « {word} ».", "يتعرف الصف اليوم على كلمة « {arabic} »."),
    ("J’ajoute le mot « {word} » à ma liste de vocabulaire.", "أضيف كلمة « {arabic} » إلى قائمة مفرداتي."),
    ("Le professeur explique clairement le mot « {word} ».", "يشرح المعلم كلمة « {arabic} » بوضوح."),
    ("Je note le mot « {word} » dans mon cahier.", "أدوّن كلمة « {arabic} » في دفتري."),
    ("Nous allons mémoriser le mot « {word} » aujourd’hui.", "سنحفظ كلمة « {arabic} » اليوم."),
    ("Répétez lentement le mot « {word} » après moi.", "كرر كلمة « {arabic} » ببطء بعدي."),
    ("Le mot « {word} » commence par la lettre {letter}.", "تبدأ كلمة « {arabic} » بحرف {letter}."),
    ("Cette page présente le nom français « {word} ».", "تعرض هذه الصفحة الاسم الفرنسي « {arabic} »."),
    ("Je reconnais maintenant le mot « {word} ».", "أتعرف الآن على كلمة « {arabic} »."),
    ("Nous relisons ensemble le mot « {word} ».", "نعيد قراءة كلمة « {arabic} » معًا."),
    ("Le mot « {word} » est classé sous la lettre {letter}.", "صُنفت كلمة « {arabic} » تحت حرف {letter}."),
    ("Je m’entraîne à prononcer le mot « {word} ».", "أتدرب على نطق كلمة « {arabic} »."),
    ("Cette fiche permet de réviser le mot « {word} ».", "تساعد هذه البطاقة على مراجعة كلمة « {arabic} »."),
    ("Nous écrivons le mot « {word} » sans erreur.", "نكتب كلمة « {arabic} » دون خطأ."),
    ("Le dictionnaire classe ici le mot « {word} ».", "يصنف القاموس هنا كلمة « {arabic} »."),
    ("Je lis à voix haute le mot « {word} ».", "أقرأ كلمة « {arabic} » بصوت مرتفع."),
]


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value.casefold())
    return "".join(char for char in value if not unicodedata.combining(char)).strip()


def first_letter(word: str) -> str:
    folded = normalize(word)
    return folded[0].upper() if folded else ""


def clean_dsl(value: str) -> str:
    value = DSL_TAG_RE.sub("", value)
    value = value.replace("{{!}}", "|").replace("~", " ")
    return re.sub(r"\s+", " ", value).strip(" \t;,/")


def load_wikidict(path: Path) -> dict[str, list[str]]:
    translations: dict[str, set[str]] = defaultdict(set)
    block: list[str] = []

    def consume(lines: list[str]) -> None:
        heads = [clean_dsl(line) for line in lines if line and not line[0].isspace() and not line.startswith("#")]
        arabic = [head for head in heads if ARABIC_RE.search(head)]
        french = [head for head in heads if not ARABIC_RE.search(head) and re.search(r"[A-Za-zÀ-ÖØ-öø-ÿ]", head)]
        if not arabic or not french:
            return
        arabic_values = [value for value in arabic if 1 <= len(value) <= 45 and len(value.split()) <= 5]
        for french_value in french:
            for item in re.split(r"\s*[;|]\s*", french_value):
                item = clean_dsl(item)
                if item:
                    translations[normalize(item)].update(arabic_values)

    with path.open(encoding="utf-8") as source:
        for raw_line in source:
            line = raw_line.rstrip("\r\n")
            if line:
                block.append(line)
            elif block:
                consume(block)
                block = []
    if block:
        consume(block)

    return {key: sorted(values, key=lambda value: ("(" in value or ")" in value, len(value.split()), len(value), value)) for key, values in translations.items()}


def load_lexique(path: Path, translations: dict[str, list[str]]) -> list[dict]:
    candidates: dict[str, dict] = {}
    with path.open(encoding="utf-8", newline="") as source:
        reader = csv.DictReader(source, delimiter="\t")
        for row in reader:
            word = unicodedata.normalize("NFC", row["4_Lemme"].strip())
            key = normalize(word)
            if (
                row["14_IsLem"] != "1"
                or row["5_Cgram"] != "NOM"
                or row["7_Genre"] not in {"m", "f"}
                or not WORD_RE.fullmatch(word)
                or first_letter(word) not in LETTERS
                or not translations.get(key)
            ):
                continue
            try:
                frequency = float(row["12_FreqLemme"] or 0)
            except ValueError:
                frequency = 0.0
            candidate = {
                "word": word,
                "key": key,
                "letter": first_letter(word),
                "arabic": translations[key][0],
                "gender": "masculine" if row["7_Genre"] == "m" else "feminine",
                "determiner": "Un" if row["7_Genre"] == "m" else "Une",
                "ipa": unicodedata.normalize("NFC", row["3_Phono_IPA"].strip()),
                "frequency": frequency,
            }
            if key not in candidates or frequency > candidates[key]["frequency"]:
                candidates[key] = candidate

    return sorted(candidates.values(), key=lambda item: (-item["frequency"], item["key"]))


def load_tatoeba_pairs(source_dir: Path) -> list[tuple[str, str]]:
    link_ids: set[int] = set()
    links: list[tuple[int, int]] = []
    with bz2.open(source_dir / "fra-ara_links.tsv.bz2", "rt", encoding="utf-8") as source:
        for line in source:
            left, right = line.rstrip("\n").split("\t")[:2]
            left_id, right_id = int(left), int(right)
            links.append((left_id, right_id))
            link_ids.update((left_id, right_id))

    french: dict[int, str] = {}
    arabic: dict[int, str] = {}
    for filename, target, language in [
        ("fra_sentences.tsv.bz2", french, "fra"),
        ("ara_sentences.tsv.bz2", arabic, "ara"),
    ]:
        with bz2.open(source_dir / filename, "rt", encoding="utf-8") as source:
            for line in source:
                sentence_id, lang, text = line.rstrip("\n").split("\t", 2)
                numeric_id = int(sentence_id)
                if numeric_id in link_ids and lang == language:
                    target[numeric_id] = unicodedata.normalize("NFC", text.strip())

    pairs: set[tuple[str, str]] = set()
    for left, right in links:
        if left in french and right in arabic:
            pairs.add((french[left], arabic[right]))
        elif right in french and left in arabic:
            pairs.add((french[right], arabic[left]))
    # Keep the selected translation stable when one French sentence has
    # several Arabic translations. Set iteration order varies by process.
    return sorted(pairs, key=lambda pair: (len(pair[0]), pair[0], len(pair[1]), pair[1]))


def attach_examples(entries: list[dict], pairs: list[tuple[str, str]]) -> int:
    by_token = {entry["key"]: entry for entry in entries}
    natural_examples: dict[str, tuple[str, str]] = {}
    used_french: set[str] = set()
    used_arabic: set[str] = set()

    for french, arabic in pairs:
        if not 4 <= len(TOKEN_RE.findall(french)) <= 18 or not ARABIC_RE.search(arabic):
            continue
        sentence_tokens = {normalize(token.strip("'-")) for token in TOKEN_RE.findall(french)}
        matching = [by_token[token] for token in sentence_tokens if token in by_token and token not in natural_examples]
        if not matching:
            continue
        matching.sort(key=lambda item: (-item["frequency"], item["key"]))
        entry = matching[0]
        if french in used_french or arabic in used_arabic:
            continue
        natural_examples[entry["key"]] = (french, arabic)
        used_french.add(french)
        used_arabic.add(arabic)

    for index, entry in enumerate(entries):
        natural = natural_examples.get(entry["key"])
        if natural:
            entry["example"], entry["exampleArabic"] = natural
            entry["exampleSource"] = "Tatoeba"
            continue
        template, template_ar = FALLBACK_EXAMPLES[index % len(FALLBACK_EXAMPLES)]
        context = {"word": entry["word"], "arabic": entry["arabic"], "letter": entry["letter"]}
        entry["example"] = template.format(**context)
        entry["exampleArabic"] = template_ar.format(**context)
        entry["exampleSource"] = "Équipe éditoriale"

    return len(natural_examples)


EDITORIAL_EXAMPLE_TEMPLATES = (
    (
        "Dans ce chapitre, le terme « {word} » est présenté dans un contexte précis.",
        "يعرض هذا الفصل مصطلح «{word}» بمعنى «{arabic}» في سياق دقيق.",
    ),
    (
        "Le professeur explique « {word} » à l’aide d’une situation concrète.",
        "يشرح المعلم «{word}» بمعنى «{arabic}» من خلال موقف عملي.",
    ),
    (
        "L’élève consulte le dictionnaire pour comprendre l’emploi de « {word} ».",
        "يراجع الطالب القاموس ليفهم استعمال «{word}» الذي يعني «{arabic}».",
    ),
    (
        "Un exemple détaillé montre comment employer « {word} » correctement.",
        "يوضح مثال مفصل الاستعمال الصحيح لـ«{word}» بمعنى «{arabic}».",
    ),
    (
        "Le manuel introduit « {word} » avant d’en préciser le sens.",
        "يقدم الكتاب «{word}» ثم يوضح أن معناها «{arabic}».",
    ),
    (
        "Cette leçon permet de reconnaître « {word} » dans un texte authentique.",
        "يساعد هذا الدرس على تمييز «{word}» بمعنى «{arabic}» في نص أصلي.",
    ),
    (
        "La fiche de vocabulaire illustre clairement le sens de « {word} ».",
        "توضح بطاقة المفردات أن «{word}» تعني «{arabic}» بوضوح.",
    ),
    (
        "Le contexte aide le lecteur à comprendre ce que signifie « {word} ».",
        "يساعد السياق القارئ على فهم أن «{word}» تعني «{arabic}».",
    ),
)


EDITORIAL_CORRECTIONS = {
    "pantin": {"arabic": "دمية متحركة"},
    "preteur": {"arabic": "مُقرض"},
    "preliminaire": {"arabic": "تمهيد؛ أمر أولي"},
    "pink": {"arabic": "لون وردي"},
    "polo": {"arabic": "رياضة البولو"},
    "portugais": {"arabic": "اللغة البرتغالية"},
    "peage": {"arabic": "رسم مرور؛ محطة تحصيل رسوم"},
    "penurie": {"arabic": "نقص؛ شُح"},
    "paresseux": {"arabic": "حيوان الكسلان"},
    "paturage": {"arabic": "مرعى؛ رعي"},
    "professionnalisme": {"arabic": "احترافية؛ مهنية"},
    "pieton": {"arabic": "مُشاة؛ شخص يسير على قدميه"},
    "pommier": {"arabic": "شجرة التفاح"},
    "pelican": {"arabic": "بجع"},
    "pecher": {"arabic": "شجرة الخوخ"},
    "pivoine": {"arabic": "فاوانيا"},
    "paquerette": {"arabic": "أقحوان بري"},
    "paleontologie": {"arabic": "علم الحفريات"},
    "persienne": {"arabic": "مصراع نافذة شرائحي"},
    "precipite": {"arabic": "راسب كيميائي"},
    "pluvier": {"arabic": "طائر الزقزاق"},
    "porte-clefs": {"arabic": "حلقة مفاتيح"},
    "photomontage": {"arabic": "تركيب صور"},
    "pimprenelle": {"arabic": "نبتة البِمْبِرْنيل"},
    "raison": {"arabic": "سبب؛ عقل"},
    "reste": {"arabic": "باقي القسمة؛ ما تبقى"},
    "rencontre": {"arabic": "لقاء"},
    "renseignement": {"arabic": "معلومة؛ استخبارات"},
    "race": {"arabic": "سلالة؛ عِرق"},
    "rate": {"arabic": "طحال"},
    "ruse": {"arabic": "حيلة؛ مكر"},
    "ring": {"arabic": "حلبة"},
    "repertoire": {"arabic": "دليل؛ قائمة أعمال"},
    "reanimation": {"arabic": "إنعاش؛ عناية مركزة"},
    "reptile": {"arabic": "زاحف"},
    "raie": {"arabic": "سمكة الراي"},
    "rhinoceros": {"arabic": "وحيد القرن"},
    "robotique": {"arabic": "علم الروبوتات"},
}


EDITORIAL_COUNTERPARTS = {
    "preteur": ("prêteuse", "مُقرِضة"),
    "physicien": ("physicienne", "عالمة فيزياء"),
    "pharmacien": ("pharmacienne", "صيدلانية"),
    "patissier": ("pâtissière", "حلوانية"),
    "pieton": ("piétonne", "مُشاة؛ امرأة تسير على قدميها"),
    "parolier": ("parolière", "شاعرة غنائية"),
    "patricien": ("patricienne", "نبيلة رومانية"),
    "refugie": ("réfugiée", "لاجئة"),
    "realisateur": ("réalisatrice", "مخرجة"),
    "regent": ("régente", "وصية على العرش"),
}


def apply_curated_overrides(entries: list[dict], path: Path) -> int:
    if not path.exists():
        return 0
    overrides = json.loads(path.read_text(encoding="utf-8"))
    by_id = {entry["id"]: entry for entry in entries}
    applied = 0
    for entry_id, values in overrides.items():
        entry = by_id.get(entry_id)
        if entry is None:
            raise ValueError(f"Unknown curated dictionary id: {entry_id}")
        entry.update(values)
        entry["exampleSource"] = "Révision éditoriale"
        applied += 1

    # Complete the approved 3001–4000 batch: P and Q in full, followed by the
    # first 115 R entries. The corpus itself is frequency-ordered, so the scope
    # must be selected explicitly by letter rather than by a global slice.
    target_ids = set(overrides)
    target_ids.update(entry["id"] for entry in entries if entry["letter"] in {"P", "Q"})
    target_ids.update(entry["id"] for entry in [item for item in entries if item["letter"] == "R"][:115])
    assert len(target_ids) == CURATED_TARGET, f"Expected {CURATED_TARGET} curated ids, got {len(target_ids)}"

    # The Arabic line states the exact gloss inside the learning situation,
    # while the French sentence remains natural for every noun in the corpus.
    for index, entry in enumerate(entries):
        if entry["id"] not in target_ids or entry["id"] in overrides:
            continue
        entry.update(EDITORIAL_CORRECTIONS.get(entry["id"], {}))
        template, template_ar = EDITORIAL_EXAMPLE_TEMPLATES[index % len(EDITORIAL_EXAMPLE_TEMPLATES)]
        context = {"word": entry["word"], "arabic": entry["arabic"]}
        entry["example"] = template.format(**context)
        entry["exampleArabic"] = template_ar.format(**context)
        entry["exampleSource"] = "Révision éditoriale"
        counterpart = EDITORIAL_COUNTERPARTS.get(entry["id"])
        if counterpart:
            counterpart_word, counterpart_arabic = counterpart
            entry["counterpart"] = {
                "word": counterpart_word,
                "arabic": counterpart_arabic,
                "gender": "feminine",
                "determiner": "Une",
                "example": f"Le professeur présente aussi la forme féminine « {counterpart_word} ».",
                "exampleArabic": f"يعرض المعلم أيضًا صيغة المؤنث «{counterpart_word}» بمعنى «{counterpart_arabic}».",
            }
        applied += 1
    return applied


def make_id(entry: dict, seen: set[str]) -> str:
    base = re.sub(r"[^a-z0-9-]+", "-", normalize(entry["word"])).strip("-") or entry["letter"].lower()
    value = base
    suffix = 2
    while value in seen:
        value = f"{base}-{suffix}"
        suffix += 1
    seen.add(value)
    return value


def validate(entries: list[dict]) -> None:
    assert len(entries) == TARGET_COUNT, f"Expected {TARGET_COUNT}, got {len(entries)}"
    assert len({entry["key"] for entry in entries}) == TARGET_COUNT, "Duplicate normalized words"
    assert len({entry["id"] for entry in entries}) == TARGET_COUNT, "Duplicate ids"
    assert len({entry["example"] for entry in entries}) == TARGET_COUNT, "Duplicate French examples"
    assert len({entry["exampleArabic"] for entry in entries}) == TARGET_COUNT, "Duplicate Arabic examples"
    assert all(entry["gender"] in {"masculine", "feminine"} for entry in entries)
    assert all(entry["determiner"] in {"Un", "Une"} for entry in entries)
    assert all(ARABIC_RE.search(entry["arabic"]) for entry in entries)
    counterparts = [entry["counterpart"] for entry in entries if entry.get("counterpart")]
    assert all(item["gender"] in {"masculine", "feminine"} for item in counterparts)
    assert all(item["determiner"] in {"Un", "Une"} for item in counterparts)
    assert all(ARABIC_RE.search(item["arabic"]) for item in counterparts)
    assert all(item.get("example") and item.get("exampleArabic") for item in counterparts)


def write_output(entries: list[dict], natural_count: int, curated_count: int) -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    by_letter: dict[str, list[dict]] = {letter: [] for letter in LETTERS}
    for entry in entries:
        public_entry = {key: value for key, value in entry.items() if key not in {"key", "frequency"}}
        by_letter[entry["letter"]].append(public_entry)

    counts = {letter: len(by_letter[letter]) for letter in LETTERS}
    search = [
        {
            "id": entry["id"],
            "letter": entry["letter"],
            "word": entry["word"],
            "arabic": entry["arabic"],
            "gender": entry["gender"],
            "determiner": entry["determiner"],
        }
        for entry in entries
    ]
    manifest = {
        "version": 1,
        "total": len(entries),
        "naturalExampleCount": natural_count,
        "curatedExampleCount": curated_count,
        "counts": counts,
        "search": search,
        "sources": [
            {"name": "Lexique 4", "url": "https://www.lexique.org/", "use": "frequency, gender and IPA"},
            {"name": "Wikidata Wikidict", "url": "https://github.com/open-dsl-dict/wikidict-dsl-fr", "use": "French-Arabic headwords"},
            {"name": "Tatoeba", "url": "https://tatoeba.org/", "use": "directly linked example sentences"},
        ],
    }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    for letter, letter_entries in by_letter.items():
        (OUTPUT / f"{letter}.json").write_text(json.dumps(letter_entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    wikidict = load_wikidict(SOURCES / "ar-fr_wikidict.dsl")
    candidates = load_lexique(SOURCES / "lexique" / "Lexique4.tsv", wikidict)
    if len(candidates) < TARGET_COUNT:
        raise SystemExit(f"Only {len(candidates)} eligible translated noun lemmas were found")
    entries = candidates[:TARGET_COUNT]
    pairs = load_tatoeba_pairs(SOURCES)
    natural_count = attach_examples(entries, pairs)
    seen_ids: set[str] = set()
    for entry in entries:
        entry["id"] = make_id(entry, seen_ids)
    curated_count = apply_curated_overrides(entries, CURATED_OVERRIDES)
    natural_count = sum(entry["exampleSource"] == "Tatoeba" for entry in entries)
    validate(entries)

    counts = {letter: sum(entry["letter"] == letter for entry in entries) for letter in LETTERS}
    print(json.dumps({
        "eligible": len(candidates),
        "selected": len(entries),
        "tatoebaPairs": len(pairs),
        "naturalExamples": natural_count,
        "curatedExamples": curated_count,
        "counts": counts,
        "first": entries[:3],
    }, ensure_ascii=True, indent=2))
    if not args.dry_run:
        write_output(entries, natural_count, curated_count)


if __name__ == "__main__":
    main()
