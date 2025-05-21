import { useState, useEffect } from "react";

const SYSTEM_PROMPT = "You are a helpful assistant."; // Added this as SYSTEM_PROMPT was used but not defined

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [project, setProject] = useState("");
  const [projectSet, setProjectSet] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_PROMPT }
  ]);

useEffect(() => {
  const savedProject = localStorage.getItem("cashbot_project");
  if (savedProject) {
    setProject(savedProject);
    setProjectSet(true);
  }
}, []);

const handleSetProject = () => {
  if (project.trim()) {
    localStorage.setItem("cashbot_project", project);
    setProjectSet(true);
  }
};


const resetProject = () => {
  localStorage.removeItem("cashbot_project");
  setProject("");
  setProjectSet(false);
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const userMessage = { role: "user", content: input };
  const updatedMessages = [...messages, userMessage];

  setInput(""); // Vide le champ tout de suite

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: updatedMessages }) // envoie tout l'historique
  });

  const data = await res.json();

  const assistantMessage = { role: "assistant", content: data.result };
  setMessages([...updatedMessages, assistantMessage]);
  setLoading(false);
};



  const handleExport = () => {
    // Concatène tout le contenu des messages assistant pour l'export
    const assistantMessages = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content)
      .join("\n\n");
    const blob = new Blob([assistantMessages], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cachotgpt-reponse.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (


    

    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
      zIndex: 0.5,
      transition: "opacity 0.5s ease-in-out"
    }}>


      {/* 🎥 Vidéo de fond */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          objectPosition: "center center",
          scale: 1.2,
          animation: "fadeIn 4s forwards",
        }}
      >
        <source src="/backGround.mp4" type="video/mp4" />
      </video>



      {/* 🧠 Contenu par-dessus */}
      <div style={{ position: "relative", zIndex: 1, padding: "2rem", color: "#00FFB3", maxWidth: "600px", margin: "0 auto" }}>

        <div style={{ marginBottom: "1rem", width: "100%" }}>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            style={{
              backgroundColor: "#000",
              color: "#00FFB3",
              border: "1px solid #00FFB3",
              padding: "0.75rem 1.25rem",
              boxShadow: "0 0 10px #00FFB3",
              fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
              fontWeight: "bold",
              cursor: "pointer",
              textShadow: "0 0 4px #00FFB3",
              borderRadius: "4px",
              width: "100%",
            }}
          >
            {showInstructions ? "Fermer" : "Instructions"}
          </button>

          {showInstructions && (
            <div
              style={{
                marginTop: "1rem",
                backgroundColor: "#000",
                color: "#00FFB3",
                border: "1px solid #00FFB3",
                padding: "1rem",
                boxShadow: "0 0 10px #00FFB3",
                fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
                lineHeight: "1.5",
                whiteSpace: "pre-line",
                borderRadius: "4px",
                width: "100%",
              }}
            >
              <p><strong>💡 Comment utiliser CashBot</strong></p>
              <ol style={{ paddingLeft: "1.2rem" }}>
                <li>Décris ton projet ou ton offre en une phrase.</li>
                <li>L’IA analyse ta cible, ton produit et tes leviers de persuasion.</li>
                <li>
                  Demande des phrases prêtes à l’emploi :
                  <ul>
                    <li>DMs à froid</li>
                    <li>Prompts</li>
                    <li>Tweets viraux</li>
                    <li>Contrer une objection client (trop cher, ça marche pas)</li>
                  </ul>
                </li>
                <li>
                  Poste. Envoie. Close.<br />
                  Télécharge ce qui fonctionne, répète ce qui convertit.
                </li>
              </ol>
            </div>
          )}
        </div>




        {!projectSet && (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
        Décris ton projet une fois pour toutes en une phrase:
      </h2>
      <textarea
        value={project}
        onChange={(e) => setProject(e.target.value)}
        placeholder="Ex: Je vends des formations pour freelancers en ligne"
        style={{
          width: "100%",
          padding: "1rem",
          backgroundColor: "#000",
          color: "#00FFB3",
          border: "1px solid #00FFB3",
          boxShadow: "0 0 8px #00FFB3",
          marginBottom: "1rem",
          resize: "none"
        }}
      ></textarea>
      <button
        onClick={handleSetProject}
        style={{
          backgroundColor: "#000",
          color: "#00FFB3",
          padding: "0.75rem 1.5rem",
          border: "1px solid #00FFB3",
          cursor: "pointer",
          fontWeight: "bold",
                  width: "100%",
                boxShadow: "0 0 8px #00FFB3, 0 0 16px #00FFB3",
                textShadow: "0 0 4px #00FFB3"
              }}
            >
              Enregistrer mon projet
            </button>
          </div>
        )}

        {projectSet && (
          <>
            <h1
              style={{
                fontSize: "2rem",
                marginBottom: "1rem",
                color: "#00FFB3",
                textShadow: "0 0 6px #00FFB3, 0 0 12px #00FFB3"
              }}
            >
              CashBot – Closing expert.
            </h1>

            <form onSubmit={handleSubmit}>
              <textarea
                style={{
                  width: "100%",
                  height: "150px",
                  backgroundColor: "#000",
                  color: "#00FFB3",
                  border: "1px solid #00FFB3",
                  padding: "1rem",
                  boxShadow: "0 0 8px #00FFB3",
                  outline: "none",
                  resize: "none"
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tape ta demande ici..."
              ></textarea>

              <button
                type="submit"
                style={{
                  marginTop: "1rem",
                  backgroundColor: "#000",
                  color: "#00FFB3",
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #00FFB3",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 0 8px #00FFB3, 0 0 16px #00FFB3",
                  textShadow: "0 0 4px #00FFB3",
                  transition: "all 0.3s ease-in-out"
                }}
              >
                {loading ? "Chargement..." : "Envoyer"}
              </button>
            </form>

            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button
                onClick={() => setMessages([{ role: "system", content: SYSTEM_PROMPT }])}
                style={{
                  backgroundColor: "#000",
                  color: "#FF4D4D",
                  border: "1px dashed #FF4D4D",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 0 6px #FF4D4D",
                  textShadow: "0 0 2px #FF4D4D",
                }}
              >
                🗑️ Vider la conversation
              </button>

              <button
                onClick={resetProject}
                style={{
                  backgroundColor: "#000",
                  color: "#FF4D4D",
                  border: "1px dashed #FF4D4D",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 0 6px #FF4D4D",
                  textShadow: "0 0 2px #FF4D4D",
                }}
              >
                🧽 Réinitialiser mon projet
              </button>
            </div>
          </>
        )}



        <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
          {messages
            .filter((m) => m.role === "assistant")
            .map((m, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>{m.content}</div>
            ))}
        </div>

        {messages.some((m) => m.role === "assistant") && (
          <button
            onClick={handleExport}
            style={{
              marginTop: "1rem",
              backgroundColor: "#000",
              color: "#00FFB3",
              padding: "0.5rem 1rem",
              border: "1px solid #00FFB3",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 6px #00FFB3",
              textShadow: "0 0 4px #00FFB3",
            }}
          >
            Exporter en .txt
          </button>
        )}
      </div>
    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `}</style>
    </div>
  );
}