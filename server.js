const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true");
    next();
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "メッセージがありません" });
    }
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "あなたは親切で丁寧なAIアシスタントです。必ず日本語だけで答えてください。英語は使わないでください。"
                },
                { role: "user", content: userMessage }
            ],
            model: "llama-3.3-70b-versatile",
        });
        const reply = completion.choices[0].message.content;
        res.json({ reply: reply });
    } catch (error) {
        console.error("詳細エラー:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("サーバー起動中...");
});
