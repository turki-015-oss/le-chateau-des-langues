from __future__ import annotations

import concurrent.futures
import html
import json
import re
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
BATCH = next((arg.split("=", 1)[1] for arg in sys.argv[1:] if arg.startswith("--batch=")), "d")
VERBS = [line.split(":", 1)[0].strip() for line in (ROOT / "scripts" / f"conjugation-next50-{BATCH}.txt").read_text(encoding="utf-8").splitlines() if line.strip()]
OUT = ROOT / "scripts" / f".conjugation-next50-{BATCH}-source.json"
HEADERS = {"X-Requested-With": "XMLHttpRequest", "Accept": "application/json", "Referer": "https://www.dictionnaire-academie.fr/"}
PERSON_KEYS = ["1sm;1sf", "2sm;2sf", "3sm;3sf", "1pm;1pf", "2pm;2pf", "3pm;3pf"]
SECTION_MAP = {"ind": "indicatif", "con": "conditionnel", "sub": "subjonctif", "imp": "imperatif"}
TENSE_MAP = {
    "Présent": "present", "Imparfait": "imparfait", "Passé simple": "passe_simple", "Futur simple": "futur_simple",
    "Passé composé": "passe_compose", "Plus-que-parfait": "plus_que_parfait", "Passé antérieur": "passe_anterieur",
    "Futur antérieur": "futur_anterieur", "Passé": "passe",
}


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip().replace("’ ", "’")


def fetch(verb: str) -> tuple[str, dict]:
    session = requests.Session()
    search = session.post("https://www.dictionnaire-academie.fr/search", headers=HEADERS, data={"term": verb, "options": "1"}, timeout=45)
    search.raise_for_status()
    results = search.json().get("result", [])
    exact = next((item for item in results if clean(item.get("label", "")).casefold() == verb.casefold()), None)
    if not exact:
        raise RuntimeError(f"{verb}: exact dictionary entry not found")
    code = exact["url"].rstrip("/").split("/")[-1]
    response = session.get(f"https://www.dictionnaire-academie.fr/conjuguer/{code}", timeout=45)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, "html.parser", from_encoding="utf-8")
    voice = soup.select_one("#voix_active")
    if not voice:
        raise RuntimeError(f"{verb}: active conjugation table not found")
    result: dict = {"participe": {"passe": {}}}
    for tense in voice.select(".tense"):
        time = tense.find_parent(class_="time")
        section_id = (time.get("id") or "") if time else ""
        title_tag = tense.select_one("h4")
        if not title_tag:
            continue
        title = clean(title_tag.get_text(" ", strip=True))
        rows = [[clean(cell.get_text(" ", strip=True)) for cell in row.select("td")] for row in tense.select("tr")]
        rows = [row for row in rows if row]
        if section_id == "active_par":
            if title == "Présent" and rows:
                result["participe"]["present"] = rows[0][-1]
            elif title == "Passé" and rows:
                simple = [clean(part) for part in rows[0][-1].split(",")]
                for key, value in zip(("sm", "sf", "pm", "pf"), simple, strict=False):
                    result["participe"]["passe"][key] = value
                compound = rows[1][-1] if len(rows) > 1 else f"ayant {simple[0]}"
                for key in ("compound_sm", "compound_sf", "compound_pm", "compound_pf"):
                    result["participe"]["passe"][key] = compound
            continue
        match = re.fullmatch(r"active_(ind|con|sub|imp)", section_id)
        if not match or title not in TENSE_MAP:
            continue
        section = SECTION_MAP[match.group(1)]
        table = result.setdefault(section, {}).setdefault(TENSE_MAP[title], {})
        if section == "imperatif":
            imperative_keys = ("2sm;2sf", "1pm;1pf", "2pm;2pf")
            for key, row in zip(imperative_keys, rows, strict=False):
                # Imperative tables contain only the conjugated form; unlike
                # finite-mood tables, there is no subject cell to discard.
                table[key] = " ".join(row)
        else:
            for key, row in zip(PERSON_KEYS, rows, strict=False):
                table[key] = " ".join(row[1:])
    required = [("indicatif", "present"), ("indicatif", "passe_anterieur"), ("subjonctif", "plus_que_parfait"), ("imperatif", "present")]
    for section, tense in required:
        if not result.get(section, {}).get(tense) or not all(result[section][tense].values()):
            raise RuntimeError(f"{verb}: missing {section}/{tense}")
    return verb, {"rectification_1990": False, "rectification_1990_variante": None, "voix_active_avoir": result}


def main() -> None:
    collected: dict[str, dict] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fetch, verb): verb for verb in VERBS}
        for completed, future in enumerate(concurrent.futures.as_completed(futures), 1):
            verb = futures[future]
            key, value = future.result()
            collected[key] = value
            print(f"{completed}/{len(VERBS)} {verb}", flush=True)
    ordered = {verb: collected[verb] for verb in VERBS}
    OUT.write_text(json.dumps(ordered, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(ordered)} verbs to {OUT}")


if __name__ == "__main__":
    main()
