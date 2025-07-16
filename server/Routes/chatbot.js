const express = require("express");
const router = express.Router();
require("dotenv").config();

const { QdrantClient } = require("@qdrant/js-client-rest");
const {
  QdrantVectorStore,
} = require("@langchain/community/vectorstores/qdrant");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { RetrievalQAChain } = require("langchain/chains");

router.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Connect to Qdrant
    const client = new QdrantClient({
      url: "https://9cf4ca90-e603-4101-bc1c-35ddbe1ca7a1.us-east-1-0.aws.cloud.qdrant.io:6333",
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.TVAnWG2tkvPqxirbzuGedoPorrTCRBDGQG7HAJp1gws",
      checkCompatibility: false,
      config: { timeout: 5000 },
    });

    // Load vector store with real embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: "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",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        client,
        collectionName: "astakenis-site-content",
      }
    );
    const docs = await vectorStore.similaritySearch(question, 3);
    console.log(
      "🔍 Retrieved documents:",
      docs.map((d) => d.pageContent)
    );
    // Load ChatOpenAI
    const model = new ChatOpenAI({
      openAIApiKey: "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",
      modelName: "gpt-3.5-turbo",
      temperature: 0.3,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
      returnSourceDocuments: true,
    });
    const response = await chain.call({ query: question });

    res.json({ answer: response.text || "No answer found." });
  } catch (err) {
    console.error("❌ Error in /ask:", err?.message || err);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

module.exports = router;
