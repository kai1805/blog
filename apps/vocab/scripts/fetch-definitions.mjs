// One-time/offline build step: fetches a definition for every word in
// ../src/words.js from the Free Dictionary API and writes the results to
// ../src/definitions.json, which the app bundles and reads at runtime
// instead of calling the API live. Re-run this script whenever words.js
// changes or to refresh stale definitions.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { WORDS } from "../src/words.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "../src/definitions.json");
const CONCURRENCY = 8;
const MAX_RETRIES = 5;

const isWeak = (text) => text.length < 25 || /^[A-Z][a-z]+ uses\.?$/.test(text.trim());

function pickBest(data) {
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
  return best;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchDefinition(word) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

      if (res.status === 404) return null;
      if (res.status === 429) {
        await sleep(2000 * (attempt + 1));
        continue;
      }
      if (!res.ok) {
        await sleep(1000 * (attempt + 1));
        continue;
      }

      const data = await res.json();
      const best = pickBest(data);
      if (!best) return null;
      return best.partOfSpeech ? `(${best.partOfSpeech}) ${best.definition}` : best.definition;
    } catch {
      await sleep(1000 * (attempt + 1));
    }
  }
  return null;
}

async function writeResults(results) {
  const sorted = Object.fromEntries(Object.entries(results).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(OUT_PATH, JSON.stringify(sorted, null, 2) + "\n");
  return Object.keys(sorted).length;
}

async function loadExisting() {
  try {
    return JSON.parse(await readFile(OUT_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  // Resume from any previous run: only (re-)fetch words we don't already have.
  const results = await loadExisting();
  let done = 0;
  let failed = 0;
  const queue = WORDS.filter((w) => !(w.toLowerCase() in results));
  const toFetch = queue.length;
  process.stderr.write(`${Object.keys(results).length} already cached, fetching ${toFetch} more\n`);

  async function worker() {
    while (queue.length > 0) {
      const word = queue.shift();
      const key = word.toLowerCase();
      const def = await fetchDefinition(word);
      if (def) {
        results[key] = def;
      } else {
        failed++;
      }
      done++;
      if (done % 20 === 0 || done === toFetch) {
        process.stderr.write(`${done}/${toFetch} (${failed} without a definition)\n`);
        await writeResults(results); // checkpoint, so a crash doesn't lose progress
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const count = await writeResults(results);
  process.stderr.write(`Wrote ${count} definitions to ${OUT_PATH}\n`);
}

main();
