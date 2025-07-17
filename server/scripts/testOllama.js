const axios = require("axios");

axios.post("http://localhost:11434/api/generate", {
  model: "llama3",
  prompt: "What is Astakenis?",
  stream: false
})
.then(res => console.log(res.data))
.catch(err => console.error("❌ ERROR:", err.message));
