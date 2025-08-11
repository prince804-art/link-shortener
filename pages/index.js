import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  async function shorten(e) {
    e && e.preventDefault();
    setResult("Creating...");
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code })
      });
      const data = await res.json();
      if (res.ok) setResult(data.short);
      else setResult(data.error || "Error");
    } catch (err) {
      setResult("Network error");
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Brand Link Shortener</h1>

      <form onSubmit={shorten}>
        <div style={{ marginBottom: 8 }}>
          <input
            type="url"
            placeholder="https://example.com/long-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Custom code (leave empty to auto-generate)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>Shorten</button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <strong>Result:</strong>
          <div style={{ marginTop: 6 }}>
            {result.startsWith("http") ? (
              <a href={result} target="_blank" rel="noreferrer">{result}</a>
            ) : (
              <pre>{result}</pre>
            )}
          </div>
        </div>
      )}

      <hr style={{ marginTop: 24 }} />
      <p style={{ color: "#666", fontSize: 13 }}>
        Tip: Keep codes short (3-8 chars). Codes must be unique.
      </p>
    </div>
  );
}
