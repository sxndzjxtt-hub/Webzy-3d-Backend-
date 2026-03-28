const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Webzy backend running 🚀");
});

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
            content: `Create a clean modern website HTML with styling for: ${prompt}`
          }
        ]
      })
    });

    const data = await response.json();

    const html = data?.choices?.[0]?.message?.content 
      || "<h2 style='color:red'>AI failed 😢</h2>";

    res.send(html);

  } catch (err) {
    console.error("ERROR:", err);
    res.send("<h2 style='color:red'>Server crash 😢</h2>");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
