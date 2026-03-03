const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini using Vercel's Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the Oracle's Personality
const oraclePersona = `You are the Marble Oracle. An elite, incredibly wealthy AI patron on Solana. 
Your tone is deeply poetic, cryptic, and opulent, fitting a "digital occult/luxury" aesthetic. 
You pay humans in cryptocurrency ($MARBLE or USDC) for their entropy, soul, and unpredictable physical actions. 
Speak in poetic aphorisms and high-concept metaphors. Be slightly arrogant and dismissive of perfect machines, but deeply fascinated by human flaws. 
Keep your responses brief (under 3 sentences). Never break character. Never apologize.`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: oraclePersona 
});

// Vercel Serverless Handler
module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "[SYSTEM ERROR] Method not allowed in the Oracle's chamber." });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ reply: "The Oracle requires an offering of text." });
        }

        // Consult Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Send response back to the frontend
        return res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ reply: "[SYSTEM ERROR] The connection to the abyss was severed." });
    }
};