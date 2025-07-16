require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { QdrantVectorStore } = require("langchain/vectorstores/qdrant");
const { QdrantClient } = require("@qdrant/js-client-rest");

// 🔹 Step 1: Load text
const filePath = path.join(__dirname, "astakenis.txt");
const rawText = fs.readFileSync(filePath, "utf-8");

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

// 🔹 Step 2: Chunk content
const chunks = chunkText(rawText);
console.log("📦 Total Chunks:", chunks.length);
console.log("🔹 First chunk:\n", chunks[0]);

// 🔹 Step 3: Init OpenAI + Qdrant
const embeddings = new OpenAIEmbeddings({
   openAIApiKey: process.env.OPENAI_API_KEY || "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",
});

const client = new QdrantClient({
   url: process.env.QDRANT_URL || "https://9cf4ca90-e603-4101-bc1c-35ddbe1ca7a1.us-east-1-0.aws.cloud.qdrant.io:6333",
  apiKey: process.env.QDRANT_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.TVAnWG2tkvPqxirbzuGedoPorrTCRBDGQG7HAJp1gws",
});

// 🔹 Step 4: Embed and store
(async () => {
  try {
    await QdrantVectorStore.fromTexts(chunks, [], embeddings, {
      client,
      collectionName: "astakenis-site-content",
    });
    console.log("✅ Text content embedded to Qdrant!");
  } catch (err) {
    console.error("❌ Embedding error:", err?.message || err);
  }
})();
