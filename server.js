const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
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
            content: `Create a modern animated website with sections (navbar, hero, about, contact) for: ${prompt}. Use HTML + CSS only.`
          }
        ]
      })
    });

    const data = await response.json();
    const html = data.choices[0].message.content;

    res.send(html);

  } catch (err) {
    res.status(500).send("Error generating website");
  }
});

app.get("/", (req, res) => {
  res.send("Webzy backend running 🚀");
});

app.listen(3000, () => console.log("Server running on 3000"));
