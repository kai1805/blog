import { useEffect, useState } from "react";

// Tesseract breaks every visual line, but blank lines mark real paragraph
// breaks. Join the wrapped lines inside each paragraph back into one line.
function reflowParagraphs(raw) {
  return raw
    .split(/\n\s*\n/)
    .map((para) =>
      para
        .replace(/([a-z])-\n(?=[a-z])/g, "$1") // re-join words hyphenated across lines
        .replace(/\s*\n\s*/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .join("\n\n");
}

export default function ScanImage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(null); // null when idle, else 0..1
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onPaste(e) {
      const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith("image/"));
      if (!item) return;
      e.preventDefault();
      scan(item.getAsFile());
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  useEffect(() => () => imageUrl && URL.revokeObjectURL(imageUrl), [imageUrl]);

  async function scan(blob) {
    setImageUrl(URL.createObjectURL(blob));
    setText("");
    setError(null);
    setCopied(false);
    setProgress(0);
    try {
      // Loaded on demand so the OCR engine doesn't bloat the quiz bundle.
      const { recognize } = await import("tesseract.js");
      const { data } = await recognize(blob, "eng", {
        logger: (m) => m.status === "recognizing text" && setProgress(m.progress),
      });
      setText(reflowParagraphs(data.text));
    } catch (err) {
      setError(err?.message ?? "Could not read the image.");
    } finally {
      setProgress(null);
    }
  }

  async function pasteFromButton() {
    try {
      for (const item of await navigator.clipboard.read()) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type) return scan(await item.getType(type));
      }
      setError("No image found on the clipboard.");
    } catch {
      setError("Clipboard access was blocked - press Ctrl+V on this page instead.");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setError("Could not copy to the clipboard.");
    }
  }

  const scanning = progress !== null;

  return (
    <>
      <p className="muted">Copy or screenshot an image, then press Ctrl+V here (or use the button) to extract its text.</p>
      <button className="btn" onClick={pasteFromButton} disabled={scanning}>
        Paste image from clipboard
      </button>

      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {scanning && (
        <>
          <p className="muted">Scanning... {Math.round(progress * 100)}%</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </>
      )}

      {imageUrl && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <img src={imageUrl} alt="Pasted" style={{ maxWidth: "100%", maxHeight: "300px" }} />
        </div>
      )}

      {!scanning && imageUrl && !error && (
        <div style={{ marginTop: "1rem" }}>
          <textarea
            readOnly
            value={text || "(no text found)"}
            rows={10}
            style={{ width: "100%", boxSizing: "border-box", font: "inherit", padding: "0.5rem" }}
          />
          {text && (
            <button className="btn" style={{ marginTop: "0.5rem" }} onClick={copy}>
              {copied ? "Copied!" : "Copy text"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
