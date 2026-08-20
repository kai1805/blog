import { useEffect, useState } from "react";

const STORAGE_KEY = "vocab-trainer:words";

function loadWords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export default function App() {
  const [words, setWords] = useState(loadWords);
  const [term, setTerm] = useState("");
  const [meaning, setMeaning] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }, [words]);

  function addWord(e) {
    e.preventDefault();
    if (!term.trim() || !meaning.trim()) return;
    setWords([...words, { term: term.trim(), meaning: meaning.trim() }]);
    setTerm("");
    setMeaning("");
  }

  function removeWord(index) {
    setWords(words.filter((_, i) => i !== index));
  }

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Vocabulary Trainer</h1>
      <p>Words are stored only in this browser (localStorage).</p>

      <form onSubmit={addWord} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input placeholder="word" value={term} onChange={(e) => setTerm(e.target.value)} />
        <input placeholder="meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {words.map((w, i) => (
          <li key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0" }}>
            <span><strong>{w.term}</strong> - {w.meaning}</span>
            <button onClick={() => removeWord(i)}>Remove</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
