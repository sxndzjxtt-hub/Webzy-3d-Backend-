const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());

// IMPORTANT: allow all methods
app.all("/generate", async (req, res) => {

  if (req.method !== "POST") {
    return res.send("Use POST request");
  }

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
            content: `Create a modern animated website for: ${prompt}`
          }
        ]
      })
    });

    const data = await response.json();
    res.send(data.choices[0].message.content);

  } catch (err) {
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => {
  res.send("Webzy backend running 🚀");
});

app.listen(3000, () => console.log("Server running"));
