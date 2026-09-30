import { useEffect, useRef, useState } from "react";
import { WORDS } from "./words.js";
import DEFINITIONS from "./definitions.json";

const SCORE_KEY = "vocab-trainer:score";
const BEST_COMPETITION_KEY = "vocab-trainer:competition-best";
const COMPETITION_SECONDS = 60;
const COMPETITION_FEEDBACK_MS = 500;

function loadScore() {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY)) ?? { correct: 0, total: 0 };
  } catch {
    return { correct: 0, total: 0 };
  }
}

function loadBestCompetitionScore() {
  try {
    return Number(localStorage.getItem(BEST_COMPETITION_KEY)) || 0;
  } catch {
    return 0;
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

function formatMeaning(meaning) {
  return meaning.partOfSpeech ? `(${meaning.partOfSpeech}) ${meaning.definition}` : meaning.definition;
}

function buildQuestion(excludeWord) {
  const word = randomWord(excludeWord);
  const [meaning, ...altMeanings] = DEFINITIONS[word.toLowerCase()].meanings;
  const options = shuffle([word, ...pickDistractors(word, 3)]);
  return { word, definition: formatMeaning(meaning), example: meaning.example, altMeanings, options };
}

export default function App() {
  const [mode, setMode] = useState("practice"); // practice | competition
  const [score, setScore] = useState(loadScore);
  const [question, setQuestion] = useState(() => buildQuestion(null));
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("ready"); // ready | correct | wrong

  const [competitionPhase, setCompetitionPhase] = useState("idle"); // idle | running | done
  const [timeLeft, setTimeLeft] = useState(COMPETITION_SECONDS);
  const [competitionStats, setCompetitionStats] = useState({ correct: 0, total: 0 });
  const [bestScore, setBestScore] = useState(loadBestCompetitionScore);

  // Refs mirroring state that the countdown/feedback timers need to read
  // without re-triggering (a timer effect keyed on these would reset itself
  // on every answer instead of ticking once per second).
  const phaseRef = useRef(competitionPhase);
  const statsRef = useRef(competitionStats);

  useEffect(() => {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    if (mode !== "competition" || competitionPhase !== "running") return;
    if (timeLeft <= 0) {
      phaseRef.current = "done";
      setCompetitionPhase("done");
      setBestScore((prev) => {
        const next = Math.max(prev, statsRef.current.correct);
        localStorage.setItem(BEST_COMPETITION_KEY, String(next));
        return next;
      });
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [mode, competitionPhase, timeLeft]);

  function startCompetition() {
    setCompetitionStats({ correct: 0, total: 0 });
    statsRef.current = { correct: 0, total: 0 };
    setTimeLeft(COMPETITION_SECONDS);
    setQuestion(buildQuestion(null));
    setSelected(null);
    setStatus("ready");
    phaseRef.current = "running";
    setCompetitionPhase("running");
  }

  function switchMode(nextMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    setSelected(null);
    setStatus("ready");
    phaseRef.current = "idle";
    setCompetitionPhase("idle");
    setQuestion(nextMode === "practice" ? buildQuestion(null) : null);
  }

  function choose(option) {
    if (status !== "ready") return;
    setSelected(option);
    const correct = option === question.word;
    setStatus(correct ? "correct" : "wrong");

    if (mode === "practice") {
      setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
      return;
    }

    setCompetitionStats((prev) => {
      const next = { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 };
      statsRef.current = next;
      return next;
    });
    const answeredWord = question.word;
    setTimeout(() => {
      if (phaseRef.current !== "running") return; // time ran out during the flash
      setQuestion(buildQuestion(answeredWord));
      setSelected(null);
      setStatus("ready");
    }, COMPETITION_FEEDBACK_MS);
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

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          className="btn"
          style={{ opacity: mode === "practice" ? 1 : 0.5 }}
          onClick={() => switchMode("practice")}
        >
          Practice
        </button>
        <button
          className="btn"
          style={{ opacity: mode === "competition" ? 1 : 0.5 }}
          onClick={() => switchMode("competition")}
        >
          60s Challenge
        </button>
      </div>

      {mode === "practice" && (
        <>
          <p className="muted">
            Guess the word from its meaning ({KNOWN_WORDS.length} words). Score: {score.correct} / {score.total}
          </p>

          {question && (
            <QuestionCard question={question} status={status} selected={selected} choose={choose} optionStyle={optionStyle} />
          )}

          {status !== "ready" && (
            <button className="btn" style={{ marginTop: "1rem" }} onClick={next}>
              Next
            </button>
          )}
        </>
      )}

      {mode === "competition" && competitionPhase === "idle" && (
        <div className="card">
          <p style={{ marginTop: 0 }}>
            Answer as many as you can before the clock runs out. Best so far: <strong>{bestScore}</strong> correct.
          </p>
          <button className="btn" onClick={startCompetition}>
            Start 60s Challenge
          </button>
        </div>
      )}

      {mode === "competition" && competitionPhase === "running" && (
        <>
          <p className="muted">
            Time left: {timeLeft}s &middot; Correct: {competitionStats.correct} / {competitionStats.total}
          </p>
          <div className="progress-track" style={{ marginBottom: "1rem" }}>
            <div
              className="progress-fill"
              style={{ width: `${(timeLeft / COMPETITION_SECONDS) * 100}%`, transition: "width 1s linear" }}
            />
          </div>

          {question && (
            <QuestionCard question={question} status={status} selected={selected} choose={choose} optionStyle={optionStyle} showDetails={false} />
          )}
        </>
      )}

      {mode === "competition" && competitionPhase === "done" && (
        <div className="card">
          <p style={{ marginTop: 0 }}>
            Time's up! You got <strong>{competitionStats.correct}</strong> correct out of {competitionStats.total} answered.
          </p>
          {competitionStats.correct >= bestScore && competitionStats.correct > 0 && (
            <p className="muted">New best!</p>
          )}
          {competitionStats.correct < bestScore && <p className="muted">Best: {bestScore} correct.</p>}
          <button className="btn" onClick={startCompetition}>
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}

function QuestionCard({ question, status, selected, choose, optionStyle, showDetails = true }) {
  return (
    <>
      <div className="card" style={{ marginBottom: "1rem" }}>
        <p style={{ margin: 0 }}>{question.definition}</p>

        {showDetails && status !== "ready" && (
          <>
            {question.example && (
              <p className="muted" style={{ marginTop: "0.75rem", marginBottom: 0, fontStyle: "italic" }}>
                "{question.example}"
              </p>
            )}
            {question.altMeanings.length > 0 && (
              <p className="muted" style={{ marginTop: "0.5rem", marginBottom: 0, fontSize: "0.9em" }}>
                Also: {question.altMeanings.map(formatMeaning).join("; ")}
              </p>
            )}
          </>
        )}
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
    </>
  );
}
