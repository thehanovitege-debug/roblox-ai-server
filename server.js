const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true");
    next();
});

const groq = new Groq({ apiKey: "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" });

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "メッセージがありません" });
    }
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: userMessage }],
            model: "llama-3.3-70b-versatile",
        });
        const reply = completion.choices[0].message.content;
        res.json({ reply: reply });
    } catch (error) {
        console.error("詳細エラー:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("サーバー起動中... ポート3000");
});