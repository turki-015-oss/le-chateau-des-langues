import argparse
import collections
import json
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DICTIONARY = ROOT / "public" / "library" / "dictionary"
OVERRIDES = ROOT / "scripts" / "library-context-overrides.json"
EXPANSION = ROOT / "scripts" / "library-expansion-verified.json"
EXPANSION_CORRECTIONS = ROOT / "scripts" / "library-expansion-contextual-corrections.json"
DIRECTION_ENTRIES = ROOT / "scripts" / "library-direction-entries.json"


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value.casefold())
    return "".join(character for character in value if not unicodedata.combining(character)).strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--expected-total", type=int)
    args = parser.parse_args()
    entries = []
    for path in sorted(DICTIONARY.glob("?.json")):
        entries.extend(json.loads(path.read_text(encoding="utf-8")))

    manifest = json.loads((DICTIONARY / "manifest.json").read_text(encoding="utf-8"))
    expected_total = args.expected_total or manifest["total"]
    overrides = json.loads(OVERRIDES.read_text(encoding="utf-8"))
    expansion = json.loads(EXPANSION.read_text(encoding="utf-8")) if EXPANSION.exists() else []
    corrections = json.loads(EXPANSION_CORRECTIONS.read_text(encoding="utf-8")) if EXPANSION_CORRECTIONS.exists() else {}
    directions = json.loads(DIRECTION_ENTRIES.read_text(encoding="utf-8")) if DIRECTION_ENTRIES.exists() else []
    curated = [entry for entry in entries if entry.get("exampleSource") == "Révision éditoriale"]
    duplicate_french = [
        text for text, count in collections.Counter(entry["example"] for entry in entries).items() if count > 1
    ]
    duplicate_arabic = [
        text for text, count in collections.Counter(entry["exampleArabic"] for entry in entries).items() if count > 1
    ]
    bad_core = [
        entry["id"]
        for entry in entries
        if any(not entry.get(key) for key in ("id", "word", "arabic", "example", "exampleArabic"))
    ]
    bad_gender = [
        entry["id"]
        for entry in entries
        if not entry.get("grammarLabel")
        and (entry.get("gender"), entry.get("determiner")) not in {("masculine", "Un"), ("feminine", "Une")}
    ]
    bad_counterparts = [
        entry["id"]
        for entry in entries
        if entry.get("counterpart")
        and any(
            not entry["counterpart"].get(key)
            for key in ("word", "arabic", "gender", "determiner", "example", "exampleArabic")
        )
    ]
    curated_by_letter = collections.Counter(entry["letter"] for entry in curated)
    by_id = {entry["id"]: entry for entry in entries}
    normalized_words = [normalize(entry["word"]) for entry in entries]
    counts = collections.Counter(entry["letter"] for entry in entries)
    expansion_keys = {normalize(entry["word"]) for entry in expansion}
    bad_letters = [
        entry["id"] for entry in entries
        if normalize(entry["word"]) in expansion_keys
        and (not normalize(entry["word"]) or entry["letter"] != normalize(entry["word"])[0].upper())
    ]
    bad_sources = [
        entry["id"] for entry in entries
        if entry.get("exampleSource") not in {
            "Tatoeba", "Équipe éditoriale", "Révision éditoriale", "Révision lexicographique", "Révision contextuelle", "Révision thématique"
        }
    ]
    base_changed = [
        entry_id for entry_id, values in overrides.items()
        if entry_id not in by_id or any(by_id[entry_id].get(key) != value for key, value in values.items())
    ]
    published_expansion = {
        normalize(entry["word"]) for entry in entries
        if normalize(entry["word"]) in expansion_keys
    }
    correction_keys = {normalize(word) for word in corrections}
    contextual_entries = [entry for entry in entries if entry.get("exampleSource") == "Révision contextuelle"]
    contextual_keys = {normalize(entry["word"]) for entry in contextual_entries}
    correction_mismatches = [
        word for word, values in corrections.items()
        if normalize(word) not in {normalize(entry["word"]) for entry in contextual_entries}
        or any(
            next(entry for entry in contextual_entries if normalize(entry["word"]) == normalize(word)).get(field) != value
            for field, value in values.items()
        )
    ]
    bad_contextual_examples = [
        entry["id"] for entry in contextual_entries
        if entry["example"].startswith("Le nom «") or normalize(entry["word"]) not in normalize(entry["example"])
    ]
    direction_keys = {normalize(entry["word"]) for entry in directions}
    published_directions = [entry for entry in entries if entry.get("directionTopic")]
    published_direction_by_key = {normalize(entry["word"]): entry for entry in published_directions}
    direction_mismatches = [
        source["word"] for source in directions
        if normalize(source["word"]) not in published_direction_by_key
        or any(
            published_direction_by_key[normalize(source["word"])].get(field) != value
            for field, value in source.items()
        )
    ]
    bad_direction_examples = [
        entry["id"] for entry in published_directions
        if normalize(entry["word"]) not in normalize(entry["example"])
        or not entry.get("exampleArabic")
    ]

    checks = {
        "total": len(entries) == expected_total == manifest["total"],
        "unique_ids": len({entry["id"] for entry in entries}) == expected_total,
        "unique_words": len(set(normalized_words)) == expected_total,
        "manifest_counts": dict(sorted(counts.items())) == manifest["counts"],
        "curated": len(curated) == len(overrides) == manifest["curatedExampleCount"],
        "duplicate_french": not duplicate_french,
        "duplicate_arabic": not duplicate_arabic,
        "core_fields": not bad_core,
        "gender_determiner": not bad_gender,
        "counterparts": not bad_counterparts,
        "manual_scope": {entry["id"] for entry in curated} == set(overrides),
        "base_unchanged": not base_changed,
        "letters": not bad_letters,
        "sources": not bad_sources,
        "expansion_count": len(published_expansion) == expected_total - 5000 - len(directions),
        "expansion_scope": published_expansion <= expansion_keys,
        "contextual_batch_size": len(corrections) > 0 and len(corrections) % 100 == 0,
        "contextual_scope": contextual_keys == correction_keys,
        "contextual_values": not correction_mismatches,
        "contextual_manifest": manifest.get("contextualExampleCount") == len(corrections),
        "contextual_examples": not bad_contextual_examples,
        "direction_scope": {normalize(entry["word"]) for entry in published_directions} == direction_keys,
        "direction_values": not direction_mismatches,
        "direction_examples": not bad_direction_examples,
        "direction_manifest": manifest.get("directionEntryCount") == len(directions),
        "manifest_search": len(manifest["search"]) == expected_total,
    }

    print(json.dumps({
        "checks": checks,
        "total": len(entries),
        "curated": len(curated),
        "curatedR": curated_by_letter["R"],
        "curatedS": curated_by_letter["S"],
        "curatedT": curated_by_letter["T"],
        "curatedU": curated_by_letter["U"],
        "curatedV": curated_by_letter["V"],
        "curatedW": curated_by_letter["W"],
        "curatedX": curated_by_letter["X"],
        "curatedY": curated_by_letter["Y"],
        "curatedZ": curated_by_letter["Z"],
        "duplicateFrench": len(duplicate_french),
        "duplicateArabic": len(duplicate_arabic),
        "badCore": len(bad_core),
        "badGender": len(bad_gender),
        "badCounterparts": len(bad_counterparts),
        "baseChanged": len(base_changed),
        "badLetters": len(bad_letters),
        "badSources": len(bad_sources),
        "publishedExpansion": len(published_expansion),
        "contextualReviewed": len(contextual_entries),
        "correctionMismatches": len(correction_mismatches),
        "badContextualExamples": len(bad_contextual_examples),
        "directionEntries": len(published_directions),
        "directionMismatches": len(direction_mismatches),
        "badDirectionExamples": len(bad_direction_examples),
    }, ensure_ascii=False, indent=2))
    if not all(checks.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
