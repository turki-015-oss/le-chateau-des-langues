import collections
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DICTIONARY = ROOT / "public" / "library" / "dictionary"
OVERRIDES = ROOT / "scripts" / "library-context-overrides.json"


def main() -> None:
    entries = []
    for path in sorted(DICTIONARY.glob("?.json")):
        entries.extend(json.loads(path.read_text(encoding="utf-8")))

    manifest = json.loads((DICTIONARY / "manifest.json").read_text(encoding="utf-8"))
    overrides = json.loads(OVERRIDES.read_text(encoding="utf-8"))
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

    checks = {
        "total": len(entries) == 5000,
        "unique_ids": len({entry["id"] for entry in entries}) == 5000,
        "unique_words": len({entry["word"] for entry in entries}) == 5000,
        "curated": len(curated) == len(overrides) == manifest["curatedExampleCount"],
        "duplicate_french": not duplicate_french,
        "duplicate_arabic": not duplicate_arabic,
        "core_fields": not bad_core,
        "gender_determiner": not bad_gender,
        "counterparts": not bad_counterparts,
        "manual_scope": {entry["id"] for entry in curated} == set(overrides),
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
    }, ensure_ascii=False, indent=2))
    if not all(checks.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
