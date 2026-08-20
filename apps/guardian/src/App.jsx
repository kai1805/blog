import { useEffect, useState } from "react";
import { CATEGORIES } from "./problems.js";

const STORAGE_KEY = "guardian-tracker:done";

function loadDone() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

const totalCount = CATEGORIES.reduce((sum, c) => sum + c.problems.length, 0);

export default function App() {
  const [done, setDone] = useState(loadDone);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  function toggle(slug) {
    setDone({ ...done, [slug]: !done[slug] });
  }

  const doneCount = Object.values(done).filter(Boolean).length;

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <h1>LeetCode Guardian Tracker</h1>
      <p>
        Guardian is a contest-rating badge (top ~5%, roughly 2200+ rating), not a solve-count badge -
        but these Hard problems cover the patterns that show up most often as contest Q3/Q4. Progress
        is stored only in this browser (localStorage).
      </p>

      <ProgressBar done={doneCount} total={totalCount} label={`Overall: ${doneCount} / ${totalCount}`} />

      {CATEGORIES.map((cat) => {
        const catDone = cat.problems.filter((p) => done[p.slug]).length;
        return (
          <section key={cat.name} style={{ marginTop: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{cat.name}</h2>
            <ProgressBar done={catDone} total={cat.problems.length} />
            <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}>
              {cat.problems.map((p) => (
                <li
                  key={p.slug}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}
                >
                  <input
                    type="checkbox"
                    checked={!!done[p.slug]}
                    onChange={() => toggle(p.slug)}
                    id={p.slug}
                  />
                  <label
                    htmlFor={p.slug}
                    style={{ textDecoration: done[p.slug] ? "line-through" : "none", opacity: done[p.slug] ? 0.6 : 1 }}
                  >
                    <a
                      href={`https://leetcode.com/problems/${p.slug}/`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "inherit" }}
                    >
                      {p.id}. {p.title}
                    </a>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}

function ProgressBar({ done, total, label }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div>
      <div style={{ background: "#e5e5e5", borderRadius: 4, height: 8, overflow: "hidden" }}>
        <div style={{ background: "#2b6cb0", width: `${pct}%`, height: "100%" }} />
      </div>
      <small>{label ?? `${done} / ${total}`}</small>
    </div>
  );
}
