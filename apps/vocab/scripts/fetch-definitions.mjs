// Bootstrap/fallback source for ../src/definitions.json. The bundled
// definitions are primarily hand-authored (by Claude) for learner-friendly
// quality - this script is only meant to give a rough first-draft entry for
// NEW words added to words.js later (it resumes and only fills in words
// missing from definitions.json, so it won't touch existing curated
// entries). Review anything it adds; its picks are decent but not
// learner-tuned the way the hand-authored entries are.
//
// Each word tries the Free Dictionary API first (nicer, learner-friendly
// prose) and falls back to the local WordNet database (offline, always
// available) if the API fails, times out, or doesn't have the word. This
// means a run always completes even if the API is down.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import WordPOS from "wordpos";
import { WORDS } from "../src/words.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "../src/definitions.json");
const CONCURRENCY = 16;
const REQUEST_TIMEOUT_MS = 4000;
const MAX_ALT_MEANINGS = 2;

const wordpos = new WordPOS();

const isWeak = (text) => text.length < 25 || /^[A-Z][a-z]+ uses\.?$/.test(text.trim());

// One meaning per distinct part of speech (the API can list several senses
// per part of speech; keep the most descriptive one), ordered with the best
// overall meaning first so the app can quiz on meanings[0].
function extractMeanings(data) {
  const byPos = new Map();
  for (const meaning of data?.[0]?.meanings ?? []) {
    const pos = meaning.partOfSpeech;
    for (const d of meaning.definitions ?? []) {
      if (!d.definition) continue;
      const candidate = { partOfSpeech: pos, definition: d.definition, examples: d.example ? [d.example] : [] };
      const existing = byPos.get(pos);
      if (!existing || (isWeak(existing.definition) && d.definition.length > existing.definition.length)) {
        byPos.set(pos, candidate);
      }
      if (!isWeak(d.definition)) break;
    }
  }

  const all = [...byPos.values()];
  const best = all.find((m) => !isWeak(m.definition)) ?? all[0];
  if (!best) return [];

  const alternates = all.filter((m) => m !== best).slice(0, MAX_ALT_MEANINGS);
  return [best, ...alternates];
}

// Single attempt, short timeout, no retries - if the live API is slow or
// down we want to fall back to WordNet quickly rather than stall the run.
async function fetchLiveMeanings(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const meanings = extractMeanings(data);
    return meanings.length > 0 ? meanings : null;
  } catch {
    return null;
  }
}

const WORDNET_POS = { n: "noun", v: "verb", a: "adjective", s: "adjective", r: "adverb" };
const POS_PRIORITY = { noun: 0, verb: 1, adjective: 2, adverb: 3 };
// Technical/scientific senses (chemical elements, SI units, etc.) that WordNet
// often lists before the everyday sense of a word (e.g. "CD" -> cadmium).
const BORING_LEXNAMES = new Set(["noun.quantity", "noun.substance"]);

function extractExample(gloss) {
  const match = /"([^"]+)"/.exec(gloss || "");
  return match ? match[1].trim() : undefined;
}

async function fetchWordnetMeanings(word) {
  let entries;
  try {
    entries = await wordpos.lookup(word);
  } catch {
    return [];
  }
  if (!entries || entries.length === 0) return [];

  const byPos = new Map();
  for (const entry of entries) {
    const pos = WORDNET_POS[entry.pos];
    if (!pos || !entry.def) continue;
    const example = extractExample(entry.gloss);
    const candidate = {
      partOfSpeech: pos,
      definition: entry.def.trim(),
      examples: example ? [example] : [],
      boring: BORING_LEXNAMES.has(entry.lexName),
    };
    const existing = byPos.get(pos);
    if (
      !existing ||
      (existing.boring && !candidate.boring) ||
      (existing.boring === candidate.boring &&
        isWeak(existing.definition) &&
        candidate.definition.length > existing.definition.length)
    ) {
      byPos.set(pos, candidate);
    }
  }

  const all = [...byPos.values()];
  const preferred = all.filter((m) => !m.boring);
  // WordNet's own ordering across parts of speech isn't frequency-ranked, so
  // without this a rarer adjective/adverb sense can edge out a more central
  // noun/verb one (e.g. "CD" as the numeral 400 outranking "certificate of
  // deposit"). This tiebreak just nudges toward the more central senses.
  const pool = [...(preferred.length > 0 ? preferred : all)].sort(
    (a, b) => POS_PRIORITY[a.partOfSpeech] - POS_PRIORITY[b.partOfSpeech]
  );
  const best = pool.find((m) => !isWeak(m.definition)) ?? pool[0];
  if (!best) return [];

  const alternates = all.filter((m) => m !== best).slice(0, MAX_ALT_MEANINGS);
  return [best, ...alternates].map(({ partOfSpeech, definition, examples }) => ({ partOfSpeech, definition, examples }));
}

async function fetchMeanings(word) {
  const live = await fetchLiveMeanings(word);
  if (live) return { meanings: live, source: "live" };

  const wordnet = await fetchWordnetMeanings(word);
  if (wordnet.length > 0) return { meanings: wordnet, source: "wordnet" };

  return null;
}

async function writeResults(results) {
  const sorted = Object.fromEntries(Object.entries(results).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(OUT_PATH, JSON.stringify(sorted, null, 2) + "\n");
  return Object.keys(sorted).length;
}

// Only a { meanings: [...] } entry counts as done; older plain-string
// entries (pre-example/alt-meaning format) get refetched.
function isUpToDate(entry) {
  return entry && Array.isArray(entry.meanings) && entry.meanings.length > 0;
}

async function loadExisting() {
  try {
    const parsed = JSON.parse(await readFile(OUT_PATH, "utf8"));
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => isUpToDate(v)));
  } catch {
    return {};
  }
}

async function main() {
  // Resume from any previous run: only (re-)fetch words we don't already have.
  const results = await loadExisting();
  let done = 0;
  let failed = 0;
  let fromLive = 0;
  let fromWordnet = 0;
  const queue = WORDS.filter((w) => !(w.toLowerCase() in results));
  const toFetch = queue.length;
  process.stderr.write(`${Object.keys(results).length} already cached, fetching ${toFetch} more\n`);

  async function worker() {
    while (queue.length > 0) {
      const word = queue.shift();
      const key = word.toLowerCase();
      const result = await fetchMeanings(word);
      if (result) {
        results[key] = { meanings: result.meanings };
        if (result.source === "live") fromLive++;
        else fromWordnet++;
      } else {
        failed++;
      }
      done++;
      if (done % 20 === 0 || done === toFetch) {
        process.stderr.write(`${done}/${toFetch} (live: ${fromLive}, wordnet: ${fromWordnet}, failed: ${failed})\n`);
        await writeResults(results); // checkpoint, so a crash doesn't lose progress
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const count = await writeResults(results);
  process.stderr.write(`Wrote ${count} definitions to ${OUT_PATH} (live: ${fromLive}, wordnet: ${fromWordnet}, failed: ${failed})\n`);
}

main();
