const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend working 😈");
});

// SAFE GENERATE ROUTE
app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body?.prompt || "simple website";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: `Create a basic HTML website with styling for: ${prompt}`
          }
        ]
      })
    });

    // 🔥 SAFE JSON PARSE
    let data;
    try {
      data = await response.json();
    } catch {
      return res.send("<h2>Invalid API response 😢</h2>");
    }

    const html = data?.choices?.[0]?.message?.content;

    if (!html) {
      return res.send("<h2>No response from AI 😢</h2>");
    }

    res.send(html);

  } catch (err) {
    console.error("CRASH:", err);
    res.send("<h2>Server error 😢</h2>");
  }
});

// 🔥 IMPORTANT (Railway fix)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
