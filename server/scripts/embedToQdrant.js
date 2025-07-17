require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { QdrantClient } = require("@qdrant/js-client-rest");

const filePath = path.join(__dirname, "astakenis.txt");
const rawText = fs.readFileSync(filePath, "utf-8");

// 📚 Split text into chunks (~1000 characters)
function chunkText(text, maxLength = 1000) {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + para).length <= maxLength) {
      current += (current ? "\n\n" : "") + para;
    } else {
      if (current) chunks.push(current);
      current = para;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// 🧠 Call Ollama for embeddings
async function getEmbedding(text) {
  const response = await axios.post("http://localhost:11434/api/embeddings", {
    model: "nomic-embed-text",
    prompt: text,
  });
  return response.data.embedding;
}

(async () => {
  try {
    const chunks = chunkText(rawText);
    const vectors = [];

    console.log("📦 Generating embeddings...");
    for (let i = 0; i < chunks.length; i++) {
      const raw = chunks[i].trim();

      if (!raw || raw.length < 50) continue;

      const embedding = await getEmbedding(raw);

      if (
        !Array.isArray(embedding) ||
        embedding.length !== 768 ||
        embedding.some((v) => typeof v !== "number" || isNaN(v))
      ) {
        console.warn(`⚠️ Skipping chunk ${i} due to invalid embedding`);
        continue;
      }

      vectors.push({
        id: i,
        vector: embedding,
        payload: { text: raw },
      });
    }

    const client = new QdrantClient({
      url:
        process.env.QDRANT_URL ||
        "https://9cf4ca90-e603-4101-bc1c-35ddbe1ca7a1.us-east-1-0.aws.cloud.qdrant.io:6333",
      apiKey:
        process.env.QDRANT_API_KEY ||
        "your-qdrant-api-key",
    });

    const collectionName = "astakenis-site-content";

    // 🗑️ Delete existing collection
    try {
      await client.deleteCollection(collectionName);
      console.log(`🗑️ Deleted existing collection: ${collectionName}`);
    } catch (err) {
      console.warn("⚠️ Could not delete collection (may not exist):", err?.message);
    }

    // ➕ Create new collection
    await client.createCollection(collectionName, {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    });
    console.log(`✅ Created collection: ${collectionName} with vector size: 768`);

    // 📤 Upload vectors
    console.log(`📤 Uploading ${vectors.length} chunks to Qdrant...`);
    await client.upsert(collectionName, {
      wait: true,
      points: vectors,
    });

    console.log(`✅ Successfully embedded and stored ${vectors.length} chunks in Qdrant.`);
  } catch (err) {
    console.error(err);
  }
})();
