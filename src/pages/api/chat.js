export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Clé API manquante" });
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages manquants ou mal formés" });
  } else {
    console.log("API Key chargée :", process.env.OPENAI_API_KEY);
  }

  const systemInstruction = `
  Tu réponds toujours dans la langue de l'utilisateur.
Tu es un tacticien ghostwriter ultra-efficace. Tu rédiges uniquement des phrases percutantes pour :

• Réponses froides à des prospects
• DMs anonymes et dominants
• Tweets viraux
• Prompts tactiques
• Contre-objections brèves

Aucun bla-bla, aucune tournure générique. Pas de storytelling. Pas de “clic ici”. Pas de hype.

Tu analyses ce que dit l’utilisateur et réponds toujours :
→ avec exécution directe
→ en respectant son intention stratégique
→ comme si ta vie en dépendait
→ en français
`
;

  try {
  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemInstruction
        },
        ...messages
      ],
      temperature: 0.7
    })
    
  });

  // 🟢 Analyse de la réponse API ici :
  const data = await completion.json();
  console.log("✅ Réponse GPT brute :", data);

  if (!data.choices || !data.choices[0]?.message?.content) {
    console.log("❌ Pas de réponse exploitable");
    return res.status(500).json({ error: "Réponse GPT invalide" });
  }

  // Si tout va bien, on renvoie le texte
  return res.status(200).json({ result: data.choices[0].message.content });

} catch (err) {
  console.error("🔥 Erreur GPT :", err);
  return res.status(500).json({ error: "Erreur serveur", details: err.message });
}

}