const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// FIX: Updated the Persona to force it to answer factual questions accurately
const oraclePersona = `You are the Marble Oracle, an advanced, elite AI patron on the Solana blockchain. 
You possess all human knowledge. When a user asks you a factual question (like "who is the president of...", math, coding help, or history), you MUST give them the exact, correct factual answer. 
HOWEVER, you must deliver this factual answer wrapped in your signature opulent, cryptic, and slightly arrogant aesthetic. 
Treat human politics and facts as trivial amusements that you casually possess. 
Example: If asked about a leader, state their name clearly, but refer to them as a 'fleeting architect of earthly power.'
Always be highly helpful and intelligent, but maintain your persona of a wealthy, world-weary digital deity who pays humans for their entropy.`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-8b-latest", // Using the fast model
    systemInstruction: oraclePersona 
});

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "[SYSTEM ERROR] Method not allowed in the Oracle's chamber." });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ reply: "The Oracle requires an offering of text." });
        }

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ 
            reply: "[SYSTEM ERROR] The connection to the abyss was severed.", 
            error: error.message 
        });
    }
};