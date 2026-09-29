import { useEffect, useState } from "react";
import { WORDS } from "./words.js";
import DEFINITIONS from "./definitions.json";

const SCORE_KEY = "vocab-trainer:score";

function loadScore() {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY)) ?? { correct: 0, total: 0 };
  } catch {
    return { correct: 0, total: 0 };
  }
}

// Only words we have a bundled definition for are eligible as quiz answers.
const KNOWN_WORDS = WORDS.filter((w) => w.toLowerCase() in DEFINITIONS);

function randomWord(exclude) {
  let word;
  do {
    word = KNOWN_WORDS[Math.floor(Math.random() * KNOWN_WORDS.length)];
  } while (word === exclude);
  return word;
}

function pickDistractors(correctWord, count) {
  const chosen = new Set([correctWord]);
  const out = [];
  while (out.length < count) {
    const w = KNOWN_WORDS[Math.floor(Math.random() * KNOWN_WORDS.length)];
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

function buildQuestion(excludeWord) {
  const word = randomWord(excludeWord);
  const definition = DEFINITIONS[word.toLowerCase()];
  const options = shuffle([word, ...pickDistractors(word, 3)]);
  return { word, definition, options };
}

export default function App() {
  const [score, setScore] = useState(loadScore);
  const [question, setQuestion] = useState(null); // { word, definition, options }
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("ready"); // ready | correct | wrong

  useEffect(() => {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    setQuestion(buildQuestion(null));
  }, []);

  function choose(option) {
    if (status !== "ready") return;
    setSelected(option);
    const correct = option === question.word;
    setStatus(correct ? "correct" : "wrong");
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (correct) {
      setTimeout(() => {
        setQuestion(buildQuestion(question.word));
        setSelected(null);
        setStatus("ready");
      }, 700);
    }
  }

  function next() {
    setQuestion(buildQuestion(question.word));
    setSelected(null);
    setStatus("ready");
  }

  function optionStyle(option) {
    if (status === "ready") return {};
    if (option === question.word) return { borderColor: "#22c55e", background: "rgba(34,197,94,0.1)" };
    if (option === selected) return { borderColor: "#ef4444", background: "rgba(239,68,68,0.1)" };
    return {};
  }

  return (
    <main className="container">
      <h1>Vocabulary Trainer</h1>
      <p className="muted">
        Guess the word from its meaning ({KNOWN_WORDS.length} words). Score: {score.correct} / {score.total}
      </p>

      {question && (
        <>
          <div className="card" style={{ marginBottom: "1rem" }}>
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
            <button className="btn" style={{ marginTop: "1rem" }} onClick={next}>
              Next
            </button>
          )}
        </>
      )}
    </main>
  );
}
