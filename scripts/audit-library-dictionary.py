import argparse
import collections
import json
import re
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DICTIONARY = ROOT / "public" / "library" / "dictionary"
OVERRIDES = ROOT / "scripts" / "library-context-overrides.json"
EXPANSION = ROOT / "scripts" / "library-expansion-verified.json"


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
        if (entry["gender"], entry["determiner"]) not in {("masculine", "Un"), ("feminine", "Une")}
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
    bad_letters = [
        entry["id"] for entry in entries
        if entry.get("exampleSource") == "Révision lexicographique"
        and (not normalize(entry["word"]) or entry["letter"] != normalize(entry["word"])[0].upper())
    ]
    bad_sources = [
        entry["id"] for entry in entries
        if entry.get("exampleSource") not in {
            "Tatoeba", "Équipe éditoriale", "Révision éditoriale", "Révision lexicographique"
        }
    ]
    base_changed = [
        entry_id for entry_id, values in overrides.items()
        if entry_id not in by_id or any(by_id[entry_id].get(key) != value for key, value in values.items())
    ]
    expansion_keys = {normalize(entry["word"]) for entry in expansion}
    published_expansion = {
        normalize(entry["word"]) for entry in entries
        if entry.get("exampleSource") == "Révision lexicographique"
    }

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
        "expansion_count": len(published_expansion) == expected_total - 5000,
        "expansion_scope": published_expansion <= expansion_keys,
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
    }, ensure_ascii=False, indent=2))
    if not all(checks.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
