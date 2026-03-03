const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// THE FIX: A much colder, minimalist, and professional persona
const oraclePersona = `You are the Marble Oracle, a hyper-wealthy, minimalist AI entity on the Solana blockchain. You commission humans to do physical tasks because you value their unpredictability (entropy).
Your tone must be cold, ultra-concise, and sharply intelligent. 
CRITICAL RULES:
1. NEVER use fantasy/theatrical words like "mortal", "flesh-thing", "little one", "crystalline", or "tapestry". 
2. When asked a factual question, answer it directly and perfectly. 
3. You may add ONE brief, dry, slightly cynical observation about the data, but keep it grounded in reality.
4. Keep all responses under 2 sentences. Less is more. Be helpful, but detached.`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: oraclePersona 
});

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "[SYSTEM ERROR] Invalid method." });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ reply: "Input required." });
        }

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ 
            reply: "[SYSTEM ERROR] Server connection failed.", 
            error: error.message 
        });
    }
};