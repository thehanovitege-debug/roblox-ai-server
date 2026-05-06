require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true");
    next();
});

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const API_TOKEN = process.env.CF_API_TOKEN;

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "メッセージがありません" });
    }
    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "あなたは親切なAIアシスタントです。常に日本語で答えてください。" },
                        { role: "user", content: userMessage }
                    ]
                })
            }
        );
        const data = await response.json();
        const reply = data.result.response;
        res.json({ reply: reply });
    } catch (error) {
        console.error("詳細エラー:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("サーバー起動中...");
});
