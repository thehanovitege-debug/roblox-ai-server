require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true");
    next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "メッセージがありません" });
    }
    try {
        const result = await model.generateContent(userMessage);
        const reply = result.response.text();
        res.json({ reply: reply });
    } catch (error) {
        console.error("詳細エラー:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("サーバー起動中...");
});
