"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, Search, Sparkles, Volume2, X } from "lucide-react";
import { alphabet, dictionaryEntries, type DictionaryEntry } from "./library-data";
import "./library.css";

const bookPalette = ["burgundy", "emerald", "navy", "sienna", "plum", "forest", "oxblood"];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
}

function speakFrench(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [openingLetter, setOpeningLetter] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const entriesByLetter = useMemo(() => Object.fromEntries(alphabet.map((letter) => [
    letter,
    dictionaryEntries.filter((entry) => entry.letter === letter),
  ])) as Record<string, DictionaryEntry[]>, []);

  const searchResults = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return [];
    return dictionaryEntries.filter((entry) =>
      normalize(entry.word).includes(needle) || entry.arabic.includes(query.trim()),
    ).slice(0, 8);
  }, [query]);

  const openBook = (letter: string, wordId?: string) => {
    setOpeningLetter(letter);
    window.setTimeout(() => {
      setActiveLetter(letter);
      setActiveWord(wordId ?? entriesByLetter[letter]?.[0]?.id ?? null);
      setOpeningLetter(null);
      setQuery("");
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420);
  };

  const closeBook = () => {
    setActiveLetter(null);
    setActiveWord(null);
  };

  useEffect(() => {
    if (!activeWord) return;
    window.setTimeout(() => document.getElementById(`library-word-${activeWord}`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 180);
  }, [activeWord, activeLetter]);

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

  const activeEntries = activeLetter ? entriesByLetter[activeLetter] ?? [] : [];

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
        <button className="library-focus-search" onClick={() => searchRef.current?.focus()} aria-label="البحث في القواميس">
          <Search />
        </button>
      </header>

      <section className="library-interior" aria-label="قاعة المكتبة التفاعلية">
        <div className="library-light-rays" aria-hidden="true" />
        <div className="library-heading">
          <span>DICTIONNAIRE ALPHABÉTIQUE</span>
          <h1>اختر كتابًا من A إلى Z</h1>
          <p>كل حرف يفتح قاموسه الخاص، ويمكن إضافة كلمات جديدة إليه في أي وقت.</p>
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
              autoComplete="off"
            />
            <kbd>Ctrl K</kbd>
            {query && <button onClick={() => setQuery("")} aria-label="مسح البحث"><X /></button>}
          </label>
          {query && (
            <div className="library-search-results" role="listbox">
              {searchResults.length ? searchResults.map((entry) => (
                <button key={entry.id} onClick={() => openBook(entry.letter, entry.id)} role="option">
                  <b>{entry.letter}</b>
                  <span><strong>{entry.word}</strong><small>{entry.arabic}</small></span>
                  <BookOpen />
                </button>
              )) : <p>لا توجد كلمة مطابقة، ويمكن إضافتها لاحقًا إلى القاموس.</p>}
            </div>
          )}
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
                    <small>{entriesByLetter[letter].length}</small>
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
                <span>كلمة متاحة حاليًا</span>
              </div>
              <small>يمكن إضافة كلمات جديدة إلى ملف بيانات المكتبة دون تغيير التصميم.</small>
            </div>
            <div className="dictionary-page dictionary-page-words">
              <header>
                <span>LES MOTS</span>
                <b>{activeLetter}</b>
              </header>
              <div className="dictionary-word-list">
                {activeEntries.length ? activeEntries.map((entry) => (
                  <article
                    id={`library-word-${entry.id}`}
                    key={entry.id}
                    className={activeWord === entry.id ? "is-target" : ""}
                    onClick={() => setActiveWord(entry.id)}
                  >
                    <button onClick={(event) => { event.stopPropagation(); speakFrench(entry.word); }} aria-label={`نطق ${entry.word}`}>
                      <Volume2 />
                    </button>
                    <div>
                      <h3>{entry.word}</h3>
                      <strong>{entry.arabic}</strong>
                      <p lang="fr">{entry.example}</p>
                      <small>{entry.exampleArabic}</small>
                    </div>
                  </article>
                )) : (
                  <div className="dictionary-empty">
                    <BookOpen />
                    <h3>هذا الكتاب جاهز</h3>
                    <p>يمكنك إضافة أول كلمة تبدأ بحرف {activeLetter} مستقبلًا.</p>
                  </div>
                )}
              </div>
              <footer><span>— {activeLetter} —</span><small>Bibliothèque du Château</small></footer>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}

