const express = require("express");
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const { QdrantClient } = require("@qdrant/js-client-rest");

// 🔹 Function to generate embedding via Ollama
async function getEmbedding(prompt) {
  const response = await axios.post("http://localhost:11434/api/embeddings", {
    model: "nomic-embed-text",
    prompt,
  });
  return response.data.embedding;
}

// 🔹 Ask Route
router.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Get vector from embedding
    const queryVector = await getEmbedding(question);

    // Qdrant client
    const client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const results = await client.search("astakenis-site-content", {
      vector: queryVector,
      top: 3,
      with_payload: true,
    });

    const rawChunks = results.map((item) => item.payload.text || "").filter(Boolean);

    const contexts = rawChunks.join("\n\n").slice(0, 2000); // 🔥 limit to 2000 characters

    const prompt = `Answer the question based on this context:\n\n${contexts}\n\nQ: ${question}\nA:`;

    const chatResponse = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false,
    });

    const finalAnswer = chatResponse.data.response;
    res.json({ answer: finalAnswer });
  } catch (err) {
    console.error("❌ Error in /ask:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate response from LLM" });
  }
});

module.exports = router;
