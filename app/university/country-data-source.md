# Fixed country learning data

`country-data.ts` is a local snapshot prepared on 2026-09-16. It uses French and Arabic country names and two-letter codes from [mledoze/countries](https://github.com/mledoze/countries) (ODbL 1.0; full license at `../../public/images/university/country-flags/COUNTRY-DATA-LICENSE.txt`). Names, translations and grammatical forms were reviewed and corrected for this lesson. The derived country dataset is available in this repository under the same ODbL 1.0 terms.

French location prepositions were checked against the [Government of Canada's country-name table](https://nos-langues.canada.ca/fr/cles-de-la-redaction/liste-des-noms-de-pays) and [preposition guidance](https://nos-langues.canada.ca/fr/cles-de-la-redaction/pays-preposition). Country names not present in that table were checked separately. The application reads only the committed snapshot; it does not call either data source at runtime.

The SVG files under `public/images/university/country-flags/` are a local snapshot of [flag-icons 7.3.2](https://github.com/lipis/flag-icons), licensed MIT. Its full license is `FLAG-ICONS-LICENSE.txt` beside the flags. No flag is loaded from a third-party URL at runtime.
