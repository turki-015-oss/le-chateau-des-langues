"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, LoaderCircle, Search, Sparkles, Volume2, X } from "lucide-react";
import {
  alphabet,
  loadDictionaryLetter,
  loadDictionaryManifest,
  type DictionaryEntry,
  type DictionaryManifest,
} from "./library-data";
import "./library.css";

const bookPalette = ["burgundy", "emerald", "navy", "sienna", "plum", "forest", "oxblood"];
const WORDS_PER_PAGE = 80;

function normalizeSearchText(value: string) {
  return value
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

function searchRank(normalized: string | undefined, needle: string) {
  if (!normalized) return null;
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

function selectFrenchVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang.toLowerCase() === "fr-fr" && voice.localService)
    ?? voices.find((voice) => voice.lang.toLowerCase() === "fr-fr")
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("fr") && voice.localService)
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("fr"))
    ?? null;
}

function speakFrench(text: string, kind: "word" | "sentence") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.voice = selectFrenchVoice();
  utterance.rate = kind === "word" ? 0.76 : 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [searchNeedle, setSearchNeedle] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [openingLetter, setOpeningLetter] = useState<string | null>(null);
  const [manifest, setManifest] = useState<DictionaryManifest | null>(null);
  const [activeEntries, setActiveEntries] = useState<DictionaryEntry[]>([]);
  const [loadingLetter, setLoadingLetter] = useState(false);
  const [dictionaryError, setDictionaryError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const wordListRef = useRef<HTMLDivElement>(null);
  const openRequestRef = useRef(0);

  useEffect(() => {
    loadDictionaryManifest()
      .then(setManifest)
      .catch(() => setDictionaryError("تعذر تحميل بيانات القاموس. أعد فتح الصفحة من فضلك."));
  }, []);

  useEffect(() => {
    const normalized = normalizeSearchText(query);
    if (!normalized) {
      setSearchNeedle("");
      return;
    }

    const timeout = window.setTimeout(() => setSearchNeedle(normalized), 140);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const searchIndex = useMemo(() => (manifest?.search ?? []).map((entry) => ({
    entry,
    primary: [entry.word, entry.arabic].map(normalizeSearchText),
    nationalities: [entry.nationality?.masculine, entry.nationality?.feminine]
      .filter((value): value is string => Boolean(value))
      .map(normalizeSearchText),
    aliases: (entry.searchAliases ?? []).map(normalizeSearchText),
  })), [manifest]);

  const searchResults = useMemo(() => {
    const needle = searchNeedle;
    if (!needle) return [];

    return searchIndex
      .map(({ entry, primary, nationalities, aliases }) => {
        const primaryRanks = primary.map((value) => searchRank(value, needle))
          .filter((rank): rank is Exclude<ReturnType<typeof searchRank>, null> => rank !== null);
        const nationalityRanks = nationalities.map((value) => searchRank(value, needle))
          .filter((rank): rank is Exclude<ReturnType<typeof searchRank>, null> => rank !== null);
        const aliasRanks = aliases
          .map((alias) => searchRank(alias, needle))
          .filter((rank): rank is Exclude<ReturnType<typeof searchRank>, null> => rank !== null);

        const primaryRank = primaryRanks.length ? Math.min(...primaryRanks) : null;
        const nationalityRank = nationalityRanks.length ? Math.min(...nationalityRanks) : null;
        const aliasRank = aliasRanks.length ? Math.min(...aliasRanks) : null;
        if (primaryRank === null && aliasRank === null && nationalityRank === null) return null;

        return {
          entry,
          rank: Math.min(
            primaryRank !== null ? primaryRank * 3 : Number.POSITIVE_INFINITY,
            aliasRank !== null ? aliasRank * 3 + 1 : Number.POSITIVE_INFINITY,
            nationalityRank !== null ? 20 + nationalityRank : Number.POSITIVE_INFINITY,
          ),
        };
      })
      .filter((result): result is { entry: DictionaryManifest["search"][number]; rank: number } => result !== null)
      .sort((left, right) =>
        left.rank - right.rank
        || left.entry.word.length - right.entry.word.length
        || left.entry.word.localeCompare(right.entry.word, "fr"),
      )
      .slice(0, 12)
      .map(({ entry }) => entry);
  }, [searchIndex, searchNeedle]);

  const pageCount = Math.max(1, Math.ceil(activeEntries.length / WORDS_PER_PAGE));
  const visibleEntries = useMemo(
    () => activeEntries.slice(activePage * WORDS_PER_PAGE, (activePage + 1) * WORDS_PER_PAGE),
    [activeEntries, activePage],
  );
  const searchIsPending = Boolean(query) && (!manifest || normalizeSearchText(query) !== searchNeedle);

  const openBook = (letter: string, wordId?: string) => {
    const requestId = ++openRequestRef.current;
    setOpeningLetter(letter);
    setLoadingLetter(true);
    setDictionaryError("");
    loadDictionaryLetter(letter)
      .then((entries) => {
        if (requestId !== openRequestRef.current) return;
        const targetId = wordId ?? entries[0]?.id ?? null;
        const targetIndex = targetId ? entries.findIndex((entry) => entry.id === targetId) : 0;
        setActiveEntries(entries);
        setActivePage(Math.floor(Math.max(0, targetIndex) / WORDS_PER_PAGE));
        setActiveLetter(letter);
        setActiveWord(targetId);
        setOpeningLetter(null);
        setLoadingLetter(false);
        setQuery("");
        setSearchNeedle("");
      })
      .catch(() => {
        if (requestId !== openRequestRef.current) return;
        setOpeningLetter(null);
        setLoadingLetter(false);
        setDictionaryError(`تعذر تحميل قاموس حرف ${letter}.`);
      });
  };

  const closeBook = () => {
    openRequestRef.current += 1;
    setActiveLetter(null);
    setActiveWord(null);
    setActiveEntries([]);
    setActivePage(0);
  };

  const focusSearch = () => {
    closeBook();
    window.setTimeout(() => searchRef.current?.focus(), 50);
  };

  useEffect(() => {
    if (!activeWord) return;
    let frame = 0;
    let attempts = 0;
    const revealTarget = () => {
      const list = wordListRef.current;
      const target = document.getElementById(`library-word-${activeWord}`);
      if (!list || !target) {
        attempts += 1;
        if (attempts < 20) frame = window.requestAnimationFrame(revealTarget);
        return;
      }

      const targetTop = target.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
      list.scrollTo({ top: Math.max(0, targetTop - 8), behavior: "auto" });
    };
    frame = window.requestAnimationFrame(revealTarget);

    return () => window.cancelAnimationFrame(frame);
  }, [activeWord, activeLetter, activePage]);

  const changePage = (nextPage: number) => {
    const boundedPage = Math.max(0, Math.min(pageCount - 1, nextPage));
    setActivePage(boundedPage);
    setActiveWord(activeEntries[boundedPage * WORDS_PER_PAGE]?.id ?? null);
    wordListRef.current?.scrollTo({ top: 0, behavior: "auto" });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeLetter) closeBook();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        closeBook();
        window.setTimeout(() => searchRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeLetter]);

  return (
    <main className="library-world" dir="rtl">
      <header className="library-topbar">
        <button className="library-castle-back" data-portal-return aria-label="العودة إلى واجهة القلعة">
          <ChevronLeft />
          <span>العودة إلى القلعة</span>
        </button>
        <div>
          <span>LA BIBLIOTHÈQUE DU CHÂTEAU</span>
          <strong>مكتبة القلعة</strong>
        </div>
        <button className="library-focus-search" onClick={focusSearch} aria-label="البحث في القواميس">
          <Search />
        </button>
      </header>

      <section className="library-interior" aria-label="قاعة المكتبة التفاعلية">
        <div className="library-light-rays" aria-hidden="true" />
        <div className="library-heading">
          <span>DICTIONNAIRE ALPHABÉTIQUE</span>
          <h1>اختر كتابًا من A إلى Z</h1>
          <p>{(manifest?.total ?? 5000).toLocaleString("fr-FR")} كلمة فرنسية موثقة، موزعة على 26 قاموسًا مع النوع والنطق والجمل.</p>
        </div>

        <div className="library-search-zone">
          <label className={`library-search ${query ? "is-searching" : ""}`}>
            <Search aria-hidden="true" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث بالفرنسية أو العربية..."
              aria-label="البحث عن كلمة في جميع القواميس"
              disabled={!manifest && !dictionaryError}
              autoComplete="off"
            />
            <kbd>Ctrl K</kbd>
            {query && <button onClick={() => setQuery("")} aria-label="مسح البحث"><X /></button>}
          </label>
          {query && (
            <div className="library-search-results" role="listbox" aria-busy={searchIsPending}>
              {searchIsPending ? <p className="library-searching"><LoaderCircle /> جاري تجهيز النتائج…</p>
              : searchResults.length ? searchResults.map((entry) => (
                <button key={entry.id} onClick={() => openBook(entry.letter, entry.id)} role="option">
                  <b>{entry.letter}</b>
                  <span><strong>{entry.word}</strong><small>{entry.arabic}</small></span>
                  <BookOpen />
                </button>
              )) : <p>لا توجد كلمة مطابقة ضمن {(manifest?.total ?? 5000).toLocaleString("fr-FR")} كلمة الحالية.</p>}
            </div>
          )}
          {dictionaryError && <p className="library-data-error" role="alert">{dictionaryError}</p>}
        </div>

        <div className="library-cabinet" aria-label="رفوف القواميس من A إلى Z">
          <div className="library-cabinet-crown"><i /><span>COLLECTION A — Z</span><i /></div>
          {[alphabet.slice(0, 13), alphabet.slice(13)].map((row, rowIndex) => (
            <div className="library-shelf" key={rowIndex}>
              <div className="library-books">
                {row.map((letter, index) => (
                  <button
                    key={letter}
                    className={`library-book-spine ${bookPalette[(index + rowIndex * 3) % bookPalette.length]} ${openingLetter === letter ? "is-opening" : ""}`}
                    onClick={() => openBook(letter)}
                    aria-label={`فتح قاموس حرف ${letter}`}
                    style={{ "--book-delay": `${(index % 5) * 16}ms` } as React.CSSProperties}
                  >
                    <span className="book-gilding" aria-hidden="true" />
                    <b>{letter}</b>
                    <small>{manifest?.counts[letter] ?? "…"}</small>
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="library-cabinet-base"><span>LE CHÂTEAU DES LANGUES</span></div>
        </div>

        <div className="library-floor-glow" aria-hidden="true" />
        <p className="library-hint"><Sparkles /> مرّر المؤشر على الكتاب ليخرج من الرف، ثم اضغط لفتحه.</p>
      </section>

      {activeLetter && (
        <section className="dictionary-reader" aria-label={`قاموس حرف ${activeLetter}`}>
          <button className="dictionary-close" onClick={closeBook} aria-label="العودة إلى رفوف المكتبة">
            <ArrowLeft /><span>العودة إلى الرفوف</span>
          </button>
          <div className="dictionary-atmosphere" aria-hidden="true" />
          <article className="open-dictionary">
            <div className="dictionary-spine" aria-hidden="true" />
            <div className="dictionary-page dictionary-page-info">
              <span className="dictionary-kicker">DICTIONNAIRE DU CHÂTEAU</span>
              <div className="dictionary-letter-seal">{activeLetter}</div>
              <h2>قاموس حرف {activeLetter}</h2>
              <p>الكلمات الفرنسية التي تبدأ بهذا الحرف محفوظة هنا.</p>
              <div className="dictionary-index">
                <strong>{activeEntries.length}</strong>
              <span>كلمة موثقة في هذا الكتاب</span>
              </div>
              <small>النوع والنطق والمعنى مدققة من معاجم فرنسية مرجعية.</small>
            </div>
            <div className="dictionary-page dictionary-page-words">
              <header>
                <span>LES MOTS</span>
                <b>{activeLetter}</b>
              </header>
              <div className="dictionary-word-list" ref={wordListRef}>
                {visibleEntries.length ? visibleEntries.map((entry) => (
                  <article
                    id={`library-word-${entry.id}`}
                    key={entry.id}
                    className={activeWord === entry.id ? "is-target" : ""}
                    onClick={() => setActiveWord(entry.id)}
                  >
                    <div>
                      <h3>{entry.word}</h3>
                      {entry.grammarLabel ? (
                        <span className="dictionary-gender thematic" lang="fr">({entry.grammarLabel})</span>
                      ) : entry.gender && (
                        <span className={`dictionary-gender ${entry.gender}`} lang="fr">
                          ({entry.gender === "masculine" ? "Masculin" : "Féminin"})
                        </span>
                      )}
                      {entry.ipa && <span className="dictionary-ipa" lang="fr">/{entry.ipa}/</span>}
                      <strong>{entry.arabic}</strong>
                      {entry.countryTopic && entry.article && entry.preposition && entry.nationality && (
                        <dl className="dictionary-country-details">
                          <div>
                            <dt>أداة التعريف</dt>
                            <dd lang="fr">
                              {entry.article === "sans article" ? entry.article : `${entry.article}${entry.article === "l’" ? "" : " "}${entry.word}`}
                            </dd>
                          </div>
                          <div>
                            <dt>الاستعمال مع حرف الجر</dt>
                            <dd lang="fr">{entry.preposition}</dd>
                          </div>
                          <div>
                            <dt>الجنسية</dt>
                            <dd lang="fr">{entry.nationality.masculine} · {entry.nationality.feminine}</dd>
                          </div>
                        </dl>
                      )}
                      <p lang="fr">{entry.example}</p>
                      <small>{entry.exampleArabic}</small>
                      <div className="dictionary-audio-actions">
                        <button onClick={(event) => { event.stopPropagation(); speakFrench(entry.word, "word"); }} aria-label={`نطق الكلمة ${entry.word}`}>
                          <Volume2 /><span>نطق الكلمة</span>
                        </button>
                        <button onClick={(event) => { event.stopPropagation(); speakFrench(entry.example, "sentence"); }} aria-label={`نطق الجملة ${entry.example}`}>
                          <Volume2 /><span>نطق الجملة</span>
                        </button>
                      </div>
                      {entry.counterpart && (
                        <section className={`dictionary-counterpart ${entry.counterpart.gender}`}>
                          <div className="dictionary-counterpart-heading">
                            <h4 lang="fr">{entry.counterpart.word}</h4>
                            <span lang="fr">({entry.counterpart.gender === "masculine" ? "Masculin" : "Féminin"})</span>
                          </div>
                          <strong>{entry.counterpart.arabic}</strong>
                          <p lang="fr">{entry.counterpart.example}</p>
                          <small>{entry.counterpart.exampleArabic}</small>
                          <div className="dictionary-audio-actions">
                            <button onClick={(event) => { event.stopPropagation(); speakFrench(entry.counterpart!.word, "word"); }} aria-label={`نطق الكلمة ${entry.counterpart.word}`}>
                              <Volume2 /><span>نطق {entry.counterpart.word}</span>
                            </button>
                            <button onClick={(event) => { event.stopPropagation(); speakFrench(entry.counterpart!.example, "sentence"); }} aria-label={`نطق الجملة ${entry.counterpart.example}`}>
                              <Volume2 /><span>نطق جملة المؤنث</span>
                            </button>
                          </div>
                        </section>
                      )}
                    </div>
                  </article>
                )) : (
                  <div className="dictionary-empty">
                    <BookOpen />
                    <h3>هذا الكتاب جاهز</h3>
                    <p>{loadingLetter ? "يتم تحميل الكلمات…" : `لا توجد كلمات متاحة لحرف ${activeLetter}.`}</p>
                  </div>
                )}
              </div>
              {pageCount > 1 && (
                <nav className="dictionary-pagination" aria-label="صفحات كلمات القاموس">
                  <button onClick={() => changePage(activePage - 1)} disabled={activePage === 0}>السابق</button>
                  <span>صفحة <b>{activePage + 1}</b> من {pageCount}</span>
                  <button onClick={() => changePage(activePage + 1)} disabled={activePage === pageCount - 1}>التالي</button>
                </nav>
              )}
              <footer><span>— {activeLetter} —</span><small>Lexique 4 · Morphalou · Wiktionnaire · Tatoeba</small></footer>
            </div>
          </article>
        </section>
      )}
      {loadingLetter && !activeLetter && (
        <div className="library-loading" role="status"><LoaderCircle /><span>جاري فتح القاموس…</span></div>
      )}
    </main>
  );
}

