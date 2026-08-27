#!/usr/bin/env python3
"""Create a stable, verified 5,000-entry expansion for the castle library.

The selection starts with common-noun lemmas in Morphalou 3.1, excludes every
headword already present in the original 5,000-entry collection, and then
cross-checks each remaining lemma against the French Wiktionary data published
by Kaikki. Arabic meanings and their French sense labels are taken from the
same Wiktionary record so an unrelated proper-name translation cannot slip in.

The resulting JSON is committed to the repository. Runtime builds never depend
on the network and later batches therefore remain byte-for-byte stable.
"""

from __future__ import annotations

import bz2
import concurrent.futures
import csv
import hashlib
import html
import importlib.util
import json
import re
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / ".tools" / "dictionary-sources"
MORPHALOU = SOURCES / "morphalou" / "Morphalou3.1_formatCSV" / "commonNoun_Morphalou3.1_CSV.csv"
CACHE = SOURCES / "kaikki-fr-word-cache"
OUTPUT = ROOT / "scripts" / "library-expansion-verified.json"
TRANSLATION_CACHE = SOURCES / "library-expansion-translation-cache.json"
TARGET = 5000
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
EXPANDED_WORD_RE = re.compile(r"^[A-Za-zÀ-ÖØ-öø-ÿŒœÆæ'’ -]{2,55}$")
ARABIC_RE = re.compile(r"[\u0600-\u06ff]")
TOKEN_RE = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿŒœÆæ'-]+")


SPEC = importlib.util.spec_from_file_location("dictionary_generator", ROOT / "scripts" / "generate-library-dictionary.py")
assert SPEC and SPEC.loader
GENERATOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(GENERATOR)


def normalize(value: str) -> str:
    return GENERATOR.normalize(value)


def existing_keys() -> set[str]:
    keys: set[str] = set()
    for path in sorted((ROOT / "public" / "library" / "dictionary").glob("?.json")):
        for entry in json.loads(path.read_text(encoding="utf-8")):
            keys.add(normalize(entry["word"]))
    # Curated display labels can intentionally replace the original lemma
    # (for example an ambiguous color name).  Also exclude the immutable
    # generator keys so an expansion can never reintroduce that original lemma.
    wikidict = GENERATOR.load_wikidict(SOURCES / "ar-fr_wikidict.dsl")
    for entry in GENERATOR.load_lexique(SOURCES / "lexique" / "Lexique4.tsv", wikidict)[:GENERATOR.BASE_COUNT]:
        keys.add(entry["key"])
    return keys


def lexique_frequencies() -> dict[str, float]:
    frequencies: dict[str, float] = {}
    source_path = SOURCES / "lexique" / "Lexique4.tsv"
    with source_path.open(encoding="utf-8", newline="") as source:
        for row in csv.DictReader(source, delimiter="\t"):
            if row.get("14_IsLem") != "1" or row.get("5_Cgram") != "NOM":
                continue
            key = normalize(row.get("4_Lemme", ""))
            try:
                value = float(row.get("12_FreqLemme") or 0)
            except ValueError:
                value = 0.0
            frequencies[key] = max(value, frequencies.get(key, 0.0))
    return frequencies


def translation_keys() -> tuple[set[str], set[str]]:
    """Return exact Wikidict keys and keys hidden by a final sense label."""
    exact: set[str] = set()
    parenthetical: set[str] = set()
    block: list[str] = []

    def consume(lines: list[str]) -> None:
        heads = [
            GENERATOR.clean_dsl(line)
            for line in lines
            if line and not line[0].isspace() and not line.startswith("#")
        ]
        if not any(GENERATOR.ARABIC_RE.search(head) for head in heads):
            return
        for head in heads:
            if GENERATOR.ARABIC_RE.search(head):
                continue
            for value in re.split(r"\s*[;|]\s*", head):
                value = GENERATOR.clean_dsl(value)
                if not value:
                    continue
                exact.add(normalize(value))
                base = re.sub(r"\s*\([^)]*\)\s*$", "", value).strip()
                if base != value:
                    parenthetical.add(normalize(base))

    with (SOURCES / "ar-fr_wikidict.dsl").open(encoding="utf-8") as source:
        for raw_line in source:
            line = raw_line.rstrip("\r\n")
            if line:
                block.append(line)
            elif block:
                consume(block)
                block = []
    if block:
        consume(block)
    return exact, parenthetical


DISAMBIGUATION_BLOCKLIST = re.compile(
    r"\b(?:film|album|série|chanson|roman|personnage|commune|ville|village|localité|"
    r"municipalité|département|région|province|état|pays|rivière|fleuve|lac|île|montagne|"
    r"patronyme|toponyme|prénom|nom de famille|entreprise|marque|groupe|logiciel|jeu vidéo|"
    r"magazine|journal|équipe|station|aéroport|navire|bateau|acteur|personnalité)\b",
    re.IGNORECASE,
)
ARABIC_DISAMBIGUATION_BLOCKLIST = re.compile(
    r"(?:فيلم|ألبوم|مسلسل|أغنية|رواية|شخصية|مدينة|قرية|بلدية|مقاطعة|ولاية|إقليم|دولة|"
    r"نهر|بحيرة|جزيرة|جبل|اسم عائلة|شركة|علامة تجارية|لعبة فيديو|مجلة|صحيفة|فريق|مطار)"
)


def wikidict_meanings() -> dict[str, list[dict]]:
    """Keep exact headwords and safe parenthesized lexical senses separately."""
    meanings: dict[str, list[dict]] = defaultdict(list)
    block: list[str] = []

    def consume(lines: list[str]) -> None:
        heads = [
            GENERATOR.clean_dsl(line)
            for line in lines
            if line and not line[0].isspace() and not line.startswith("#")
        ]
        arabic = [
            head for head in heads
            if ARABIC_RE.search(head) and 1 <= len(head) <= 55 and len(head.split()) <= 6
        ]
        french = [head for head in heads if not ARABIC_RE.search(head)]
        if not arabic or not french:
            return
        for french_value in french:
            for value in re.split(r"\s*[;|]\s*", french_value):
                value = GENERATOR.clean_dsl(value)
                if not value:
                    continue
                match = re.search(r"\s*\(([^)]*)\)\s*$", value)
                label = clean_text(match.group(1)) if match else ""
                base = re.sub(r"\s*\([^)]*\)\s*$", "", value).strip()
                key = normalize(base)
                exact = base == value
                for arabic_value in arabic:
                    if (
                        not exact
                        and (
                            DISAMBIGUATION_BLOCKLIST.search(label)
                            or ARABIC_DISAMBIGUATION_BLOCKLIST.search(arabic_value)
                            or re.search(r"\b(?:18|19|20)\d{2}\b", label)
                        )
                    ):
                        continue
                    meanings[key].append({
                        "arabic": clean_text(arabic_value),
                        "sense": label,
                        "exact": exact,
                    })

    with (SOURCES / "ar-fr_wikidict.dsl").open(encoding="utf-8") as source:
        for raw_line in source:
            line = raw_line.rstrip("\r\n")
            if line:
                block.append(line)
            elif block:
                consume(block)
                block = []
    if block:
        consume(block)

    for key, values in meanings.items():
        unique = {(value["arabic"], value["sense"], value["exact"]): value for value in values}
        meanings[key] = sorted(
            unique.values(),
            key=lambda value: (
                not value["exact"],
                "(" in value["arabic"],
                len(value["arabic"].split()),
                len(value["arabic"]),
                value["arabic"],
            ),
        )
    return meanings


def load_candidates() -> list[dict]:
    excluded = existing_keys()
    frequencies = lexique_frequencies()
    exact_keys, parenthetical_keys = translation_keys()
    meanings = wikidict_meanings()
    candidates: dict[str, dict] = {}

    with MORPHALOU.open(encoding="utf-8", newline="") as source:
        for _ in range(16):
            next(source)
        for row in csv.reader(source, delimiter=";"):
            word = unicodedata.normalize("NFC", (row[0] if row else "").strip())
            if not word:
                continue
            key = normalize(word)
            gender = (row[5] if len(row) > 5 else "").strip()
            if (
                key in excluded
                or key in candidates
                or gender not in {"masculine", "feminine"}
                or word != word.casefold()
                or not EXPANDED_WORD_RE.fullmatch(word)
                or len(word.split()) > 4
                or GENERATOR.first_letter(word) not in LETTERS
                or (key not in exact_keys and key not in parenthetical_keys)
                or not meanings.get(key)
            ):
                continue
            ipa = (row[7] if len(row) > 7 else "").strip()
            origins = set((row[8] if len(row) > 8 else "").strip().split())
            candidates[key] = {
                "word": word,
                "key": key,
                "letter": GENERATOR.first_letter(word),
                "gender": gender,
                "determiner": "Un" if gender == "masculine" else "Une",
                "morphalouPhonetic": ipa,
                "frequency": frequencies.get(key, 0.0),
                "sourceCoverage": len(origins),
                "exactTranslationKey": key in exact_keys,
                "wikidictMeanings": meanings[key],
            }

    return sorted(
        candidates.values(),
        key=lambda item: (
            -item["frequency"],
            -int(item["exactTranslationKey"]),
            -item["sourceCoverage"],
            len(item["word"]),
            item["key"],
        ),
    )


def kaikki_url(word: str) -> str:
    first = word[:1]
    first_two = word[:2]
    quote = lambda value: urllib.parse.quote(value, safe="-")
    return (
        "https://kaikki.org/frwiktionary/Fran%C3%A7ais/meaning/"
        f"{quote(first)}/{quote(first_two)}/{quote(word)}.jsonl"
    )


def cache_path(word: str) -> Path:
    digest = hashlib.sha1(word.encode("utf-8")).hexdigest()
    return CACHE / digest[:2] / f"{digest}.jsonl"


def fetch_word(candidate: dict) -> tuple[dict, str | None]:
    word = candidate["word"]
    destination = cache_path(word)
    if destination.exists() and destination.stat().st_size:
        cached = destination.read_text(encoding="utf-8")
        return candidate, None if cached == "__MISSING__" else cached

    request = urllib.request.Request(
        kaikki_url(word),
        headers={"User-Agent": "LeChateauDesLangues/1.0 dictionary-audit"},
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                payload = response.read().decode("utf-8")
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(payload, encoding="utf-8")
            return candidate, payload
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_text("__MISSING__", encoding="utf-8")
                return candidate, None
        except (urllib.error.URLError, TimeoutError, UnicodeError):
            pass
        time.sleep(0.6 * (attempt + 1))
    return candidate, None


def clean_text(value: str) -> str:
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def choose_arabic_translation(record: dict) -> dict | None:
    choices: list[dict] = []
    for translation in record.get("translations", []):
        word = clean_text(translation.get("word", ""))
        sense = clean_text(translation.get("sense", ""))
        if (
            translation.get("lang_code") != "ar"
            or not ARABIC_RE.search(word)
            or not 1 <= len(word) <= 55
            or len(word.split()) > 6
        ):
            continue
        choices.append({
            "word": word,
            "sense": sense,
            "sense_index": translation.get("sense_index"),
        })
    if not choices:
        return None
    # Kaikki preserves Wiktionary's sense order; the first translation belongs
    # to the first documented noun sense.  Re-sorting by spelling can silently
    # switch to a later homonym, so source order is intentional here.
    return choices[0]


def choose_record(candidate: dict, payload: str) -> dict | None:
    records: list[dict] = []
    for raw_line in payload.splitlines():
        try:
            record = json.loads(raw_line)
        except json.JSONDecodeError:
            continue
        if (
            record.get("lang_code") == "fr"
            and record.get("pos") == "noun"
            and normalize(record.get("word", "")) == candidate["key"]
        ):
            translation = choose_arabic_translation(record)
            record["_chosenArabic"] = translation
            records.append(record)
    if not records:
        return None

    expected_tag = candidate["gender"]
    return min(
        records,
        key=lambda record: (
            expected_tag not in record.get("tags", []),
            record["_chosenArabic"] is None,
            not bool((record["_chosenArabic"] or {}).get("sense")),
            len(record.get("senses", [])) == 0,
        ),
    )


def clean_definition(value: str) -> str:
    definition = clean_text(value)
    definition = re.sub(r"^\([^)]{1,45}\)\s*:?\s*", "", definition)
    definition = re.sub(
        r"\s*\((?:voir|voyez|cf\.)[^)]*\)\s*[.;:]?\s*$",
        "",
        definition,
        flags=re.IGNORECASE,
    )
    definition = re.sub(r"\.\s*Année\s*$", "", definition, flags=re.IGNORECASE)
    return definition.strip(" .;:")


def first_definition(record: dict, translation: dict) -> str:
    senses = record.get("senses", [])
    sense_index = translation.get("sense_index")
    if isinstance(sense_index, int) and 1 <= sense_index <= len(senses):
        indexed_glosses = senses[sense_index - 1].get("glosses") or []
        if indexed_glosses:
            indexed = clean_definition(indexed_glosses[-1])
            if indexed:
                return indexed

    definitions: list[str] = []
    for sense in senses:
        glosses = sense.get("glosses") or []
        if glosses:
            definition = clean_definition(glosses[-1])
            if definition:
                definitions.append(definition)
    if definitions:
        # Prefer an explanatory gloss over a terse domain label such as
        # "Politique".  The source order still breaks ties.
        definition = min(
            enumerate(definitions),
            key=lambda item: (
                len(item[1]) < 20,
                len(item[1].split()) < 4,
                item[0],
            ),
        )[1]
    else:
        definition = clean_definition(translation.get("sense", ""))
    if re.search(r"définition (?:manquante|incomplète|à compléter)|\(ajouter\)", definition, re.IGNORECASE):
        return ""
    if len(definition) > 220:
        definition = definition[:217].rsplit(" ", 1)[0].rstrip(" ,;:") + "…"
    return definition


def first_ipa(record: dict) -> str:
    for sound in record.get("sounds", []):
        ipa = clean_text(sound.get("ipa", "")).strip("/\\[] ")
        if ipa and len(ipa) <= 40:
            return ipa
    return ""


def choose_pivot_english(record: dict) -> dict:
    choices: list[dict] = []
    for translation in record.get("translations", []):
        word = clean_text(translation.get("word", ""))
        if translation.get("lang_code") == "en" and 1 <= len(word) <= 65 and len(word.split()) <= 7:
            choices.append({
                "word": word,
                "sense": clean_text(translation.get("sense", "")),
                "sense_index": translation.get("sense_index"),
            })
    if not choices:
        return {}
    return choices[0]


def choose_wikidict_fallback(candidate: dict) -> str:
    meanings = candidate["wikidictMeanings"]
    safe = [
        meaning for meaning in meanings
        if meaning["exact"]
        and ARABIC_RE.search(meaning["arabic"])
        and not ARABIC_DISAMBIGUATION_BLOCKLIST.search(meaning["arabic"])
        and not (not meaning["sense"] and ("(" in meaning["arabic"] or ")" in meaning["arabic"]))
        and not (
            not meaning["exact"]
            and meaning["sense"]
            and meaning["sense"][:1].isupper()
        )
    ]
    if not safe:
        return ""
    return min(
        safe,
        key=lambda meaning: (
            not meaning["exact"],
            len(meaning["arabic"].split()),
            len(meaning["arabic"]),
            meaning["arabic"],
        ),
    )["arabic"]


def build_entry(candidate: dict, record: dict) -> dict | None:
    translation = record["_chosenArabic"] or {}
    english_pivot = choose_pivot_english(record)
    definition = first_definition(record, translation or english_pivot)
    if not definition:
        return None
    word = candidate["word"]
    direct_arabic = translation.get("word", "")
    fallback_arabic = choose_wikidict_fallback(candidate)
    return {
        "word": word,
        "key": candidate["key"],
        "letter": candidate["letter"],
        "arabic": direct_arabic,
        "fallbackArabic": fallback_arabic or candidate["wikidictMeanings"][0]["arabic"],
        "pivotEnglish": english_pivot.get("word", ""),
        "definition": definition,
        "gender": candidate["gender"],
        "determiner": candidate["determiner"],
        "partOfSpeech": "noun",
        "ipa": first_ipa(record),
        "frequency": candidate["frequency"],
        "example": f"Le nom « {word} » est employé ici au sens suivant : « {definition}. »",
        "exampleArabic": "",
        "exampleSource": "Révision lexicographique",
    }


def installed_package(from_code: str, to_code: str):
    from argostranslate import translate

    languages = translate.get_installed_languages()
    source = next(language for language in languages if language.code == from_code)
    target = next(language for language in languages if language.code == to_code)
    translation = source.get_translation(target)
    while hasattr(translation, "underlying"):
        translation = translation.underlying
    return translation.pkg


def model_translate_batch(texts: list[str], from_code: str, to_code: str) -> list[str]:
    import ctranslate2
    from argostranslate import settings

    cache_key = f"{from_code}-{to_code}"
    cache = json.loads(TRANSLATION_CACHE.read_text(encoding="utf-8")) if TRANSLATION_CACHE.exists() else {}
    language_cache = cache.setdefault(cache_key, {})
    missing = [text for text in dict.fromkeys(texts) if text not in language_cache]
    if not missing:
        return [language_cache[text] for text in texts]

    package = installed_package(from_code, to_code)
    translator = ctranslate2.Translator(
        str(package.package_path / "model"),
        device=settings.device,
        inter_threads=max(2, settings.inter_threads),
        intra_threads=settings.intra_threads,
        compute_type=settings.compute_type,
    )
    tokenized = [package.tokenizer.encode(text) for text in missing]
    target_prefix = [[package.target_prefix]] * len(tokenized) if package.target_prefix else None
    results = translator.translate_batch(
        tokenized,
        target_prefix=target_prefix,
        replace_unknowns=True,
        max_batch_size=2048,
        batch_type="tokens",
        beam_size=1,
        num_hypotheses=1,
        length_penalty=0.2,
    )
    translated: list[str] = []
    for result in results:
        value = package.tokenizer.decode(result.hypotheses[0]).strip()
        if package.target_prefix and value.startswith(package.target_prefix):
            value = value[len(package.target_prefix):].lstrip()
        translated.append(clean_text(value))
    for source_text, translated_text in zip(missing, translated):
        language_cache[source_text] = translated_text
    TRANSLATION_CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    return [language_cache[text] for text in texts]


def add_verified_arabic(entries: list[dict]) -> None:
    missing_indexes = [index for index, entry in enumerate(entries) if not entry["arabic"]]
    pivot_texts = [entries[index]["pivotEnglish"] for index in missing_indexes]
    pivot_languages = ["en" if entries[index]["pivotEnglish"] else "" for index in missing_indexes]

    english_indexes = [offset for offset, language in enumerate(pivot_languages) if language == "en"]
    translated_pivots = [""] * len(pivot_texts)
    if english_indexes:
        values = model_translate_batch([pivot_texts[index] for index in english_indexes], "en", "ar")
        for index, value in zip(english_indexes, values):
            translated_pivots[index] = value

    for offset, entry_index in enumerate(missing_indexes):
        entries[entry_index]["arabic"] = translated_pivots[offset]

    still_missing = [index for index, entry in enumerate(entries) if not ARABIC_RE.search(entry["arabic"])]
    if still_missing:
        french_definitions = [entries[index]["definition"] for index in still_missing]
        english_definitions = model_translate_batch(french_definitions, "fr", "en")
        arabic_definitions = model_translate_batch(english_definitions, "en", "ar")
        for index, value in zip(still_missing, arabic_definitions):
            if ARABIC_RE.search(value):
                entries[index]["arabic"] = value.rstrip(" .؛،")

    direct_corrections = {
        "an": "سنة",
        "aller": "رحلة ذهاب",
        "caroline": "عملة فضية سويدية قديمة",
        "classe": "طبقة اجتماعية",
        "décapole": "إقليم يضم عشر مدن رئيسية",
        "face": "وجه",
        "job": "عمل مؤقت",
        "léonard": "لهجة بريتونية متداولة في منطقة ليون",
        "point": "غرزة",
    }
    for entry in entries:
        entry["arabic"] = direct_corrections.get(entry["word"], entry["arabic"].strip())
        entry["arabic"] = entry["arabic"].replace("سنه", "سنة").replace("(دياليكت)", "لهجة").replace("دياليكت", "لهجة")
        if not ARABIC_RE.search(entry["arabic"]):
            entry["arabic"] = entry["fallbackArabic"]
        entry["exampleArabic"] = f"يُستخدم الاسم الفرنسي «{entry['word']}» هنا بمعنى «{entry['arabic']}»."

    for entry in entries:
        entry.pop("pivotEnglish", None)
        entry.pop("definition", None)
        entry.pop("fallbackArabic", None)


def tatoeba_pairs() -> list[tuple[str, str]]:
    return GENERATOR.load_tatoeba_pairs(SOURCES)


def attach_natural_examples(entries: list[dict]) -> int:
    by_token = {entry["key"]: entry for entry in entries}
    used_french: set[str] = set()
    used_arabic: set[str] = set()
    assigned: set[str] = set()
    for french, arabic in tatoeba_pairs():
        if not 4 <= len(TOKEN_RE.findall(french)) <= 18 or not ARABIC_RE.search(arabic):
            continue
        tokens = {normalize(token.strip("'-")) for token in TOKEN_RE.findall(french)}
        matches = [by_token[token] for token in tokens if token in by_token and token not in assigned]
        if not matches or french in used_french or arabic in used_arabic:
            continue
        matches.sort(key=lambda item: (-item["frequency"], item["key"]))
        entry = matches[0]
        entry["example"] = french
        entry["exampleArabic"] = arabic
        entry["exampleSource"] = "Tatoeba"
        assigned.add(entry["key"])
        used_french.add(french)
        used_arabic.add(arabic)
    return len(assigned)


def validate(entries: list[dict], existing: set[str]) -> None:
    assert len(entries) == TARGET
    assert not ({entry["key"] for entry in entries} & existing)
    assert len({entry["key"] for entry in entries}) == TARGET
    assert len({entry["word"] for entry in entries}) == TARGET
    assert len({entry["example"] for entry in entries}) == TARGET
    assert len({entry["exampleArabic"] for entry in entries}) == TARGET
    assert all(entry["gender"] in {"masculine", "feminine"} for entry in entries)
    assert all(entry["determiner"] in {"Un", "Une"} for entry in entries)
    assert all(ARABIC_RE.search(entry["arabic"]) for entry in entries)
    assert all(entry["letter"] == GENERATOR.first_letter(entry["word"]) for entry in entries)


def main() -> None:
    candidates = load_candidates()
    print(f"candidates={len(candidates)}", flush=True)
    results: dict[str, dict] = {}
    completed = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
        futures = [pool.submit(fetch_word, candidate) for candidate in candidates]
        for future in concurrent.futures.as_completed(futures):
            candidate, payload = future.result()
            if payload:
                record = choose_record(candidate, payload)
                if record:
                    entry = build_entry(candidate, record)
                    if entry:
                        results[candidate["key"]] = entry
            completed += 1
            if completed % 100 == 0 or completed == len(candidates):
                print(f"checked={completed}/{len(candidates)} valid={len(results)}", flush=True)

    selected = [results[candidate["key"]] for candidate in candidates if candidate["key"] in results][:TARGET]
    if len(selected) < TARGET:
        raise SystemExit(f"Only {len(selected)} verified new entries were found")

    add_verified_arabic(selected)
    natural_count = 0
    existing = existing_keys()
    validate(selected, existing)
    public_entries = [
        {key: value for key, value in entry.items() if key not in {"key", "frequency"}}
        for entry in selected
    ]
    OUTPUT.write_text(json.dumps(public_entries, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "selected": len(public_entries),
        "naturalExamples": natural_count,
        "lexicographicExamples": len(public_entries) - natural_count,
        "first": public_entries[:2],
        "last": public_entries[-2:],
        "output": str(OUTPUT),
    }, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    main()
