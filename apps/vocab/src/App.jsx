import { useEffect, useState } from "react";
import { WORDS } from "./words.js";

const DEF_CACHE_KEY = "vocab-trainer:definitions";
const SCORE_KEY = "vocab-trainer:score";
const MAX_LOOKUP_ATTEMPTS = 20;

function loadDefCache() {
  try {
    return JSON.parse(localStorage.getItem(DEF_CACHE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function loadScore() {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY)) ?? { correct: 0, total: 0 };
  } catch {
    return { correct: 0, total: 0 };
  }
}

function randomWord(exclude) {
  let word;
  do {
    word = WORDS[Math.floor(Math.random() * WORDS.length)];
  } while (word === exclude);
  return word;
}

function pickDistractors(correctWord, count) {
  const chosen = new Set([correctWord]);
  const out = [];
  while (out.length < count) {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    if (chosen.has(w)) continue;
    chosen.add(w);
    out.push(w);
  }
  return out;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fetches a definition from the Free Dictionary API (api.dictionaryapi.dev),
// caching results (including "not found") in localStorage so repeat words
// don't refetch.
async function getDefinition(word, cache, setCache) {
  const key = word.toLowerCase();
  if (key in cache) return cache[key];

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (res.status === 404) {
      const next = { ...cache, [key]: null };
      setCache(next);
      return null;
    }
    if (!res.ok) return null;

    const data = await res.json();
    // Prefer a reasonably descriptive definition over a terse gloss or
    // Wiktionary's occasional bare category label (e.g. "Anatomical uses.").
    const isWeak = (text) => text.length < 25 || /^[A-Z][a-z]+ uses\.?$/.test(text.trim());
    let best = null;
    for (const meaning of data?.[0]?.meanings ?? []) {
      for (const d of meaning.definitions ?? []) {
        if (!d.definition) continue;
        if (!best || (isWeak(best.definition) && d.definition.length > best.definition.length)) {
          best = { definition: d.definition, partOfSpeech: meaning.partOfSpeech };
        }
        if (!isWeak(d.definition)) break;
      }
      if (best && !isWeak(best.definition)) break;
    }
    if (!best) {
      const next = { ...cache, [key]: null };
      setCache(next);
      return null;
    }

    const text = best.partOfSpeech ? `(${best.partOfSpeech}) ${best.definition}` : best.definition;
    const next = { ...cache, [key]: text };
    setCache(next);
    return text;
  } catch {
    return null;
  }
}

export default function App() {
  const [defCache, setDefCacheState] = useState(loadDefCache);
  const [score, setScore] = useState(loadScore);
  const [question, setQuestion] = useState(null); // { word, definition, options }
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | correct | wrong | error

  function setCache(next) {
    setDefCacheState(next);
    localStorage.setItem(DEF_CACHE_KEY, JSON.stringify(next));
  }

  useEffect(() => {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
  }, [score]);

  async function loadQuestion(excludeWord) {
    setStatus("loading");
    setSelected(null);

    let cache = defCache;
    for (let attempt = 0; attempt < MAX_LOOKUP_ATTEMPTS; attempt++) {
      const word = randomWord(excludeWord);
      const definition = await getDefinition(word, cache, (next) => {
        cache = next;
        setCache(next);
      });
      if (definition) {
        const options = shuffle([word, ...pickDistractors(word, 3)]);
        setQuestion({ word, definition, options });
        setStatus("ready");
        return;
      }
    }
    setStatus("error");
  }

  useEffect(() => {
    loadQuestion(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(option) {
    if (status !== "ready") return;
    setSelected(option);
    const correct = option === question.word;
    setStatus(correct ? "correct" : "wrong");
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (correct) {
      setTimeout(() => loadQuestion(question.word), 700);
    }
  }

  function optionStyle(option) {
    if (status === "ready" || status === "loading") return {};
    if (option === question.word) return { borderColor: "#22c55e", background: "rgba(34,197,94,0.1)" };
    if (option === selected) return { borderColor: "#ef4444", background: "rgba(239,68,68,0.1)" };
    return {};
  }

  return (
    <main className="container">
      <h1>Vocabulary Trainer</h1>
      <p className="muted">
        Guess the word from its meaning ({WORDS.length} words, definitions from the Free Dictionary API).
        Score: {score.correct} / {score.total}
      </p>

      {status === "error" && (
        <div className="card">
          <p>Couldn't reach the dictionary API for several words in a row. Check your connection and try again.</p>
          <button className="btn" onClick={() => loadQuestion(null)}>Retry</button>
        </div>
      )}

      {status === "loading" && !question && <p className="muted">Loading question…</p>}

      {question && status !== "error" && (
        <>
          <div className="card" style={{ marginBottom: "1rem", opacity: status === "loading" ? 0.5 : 1 }}>
            <p style={{ margin: 0 }}>{question.definition}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {question.options.map((option) => (
              <button
                key={option}
                className="card"
                style={{ cursor: "pointer", textAlign: "left", ...optionStyle(option) }}
                onClick={() => choose(option)}
                disabled={status !== "ready"}
              >
                {option}
              </button>
            ))}
          </div>

          {status === "wrong" && (
            <button className="btn" style={{ marginTop: "1rem" }} onClick={() => loadQuestion(question.word)}>
              Next
            </button>
          )}
        </>
      )}
    </main>
  );
}
