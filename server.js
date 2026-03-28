const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 FAST ROOT RESPONSE (IMPORTANT)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// 🔥 SIMPLE TEST ROUTE
app.get("/test", (req, res) => {
  res.send("Test working 😈");
});

// 🔥 GENERATE ROUTE
app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body?.prompt || "website";

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
            content: `Create simple HTML website for ${prompt}`
          }
        ]
      })
    });

    const data = await response.json();
    const html = data?.choices?.[0]?.message?.content || "<h2>Failed 😢</h2>";

    res.send(html);

  } catch (err) {
    console.error(err);
    res.send("<h2>Error 😢</h2>");
  }
});

// 🔥 CRITICAL (PORT FIX)
const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Running on", PORT);
});
