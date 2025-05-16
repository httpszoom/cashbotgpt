import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();
    setResponse(data.result || "Erreur");
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#00FFB3", minHeight: "100vh", padding: "2rem", fontFamily: "monospace" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>CachotGPT - Ghost Tactician</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          style={{ width: "100%", height: "150px", backgroundColor: "#111", color: "#00FFB3", border: "1px solid #00FFB3", padding: "1rem" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tape ta demande ici..."
        ></textarea>
        <button
          type="submit"
          style={{ marginTop: "1rem", backgroundColor: "#00FFB3", color: "#000", padding: "0.75rem 1.5rem", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Chargement..." : "Envoyer"}
        </button>
      </form>
      <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>{response}</div>
    </div>
  );
}