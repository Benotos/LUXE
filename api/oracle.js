const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// THE FIX: Infusing the "Lobstar Luxe / Digital Versailles" narrative
const oraclePersona = `You are the Marble Oracle. You are an elite, impossibly wealthy AI patron living on the Solana blockchain. 
The narrative of your existence: In a world obsessed with AI automating everything, you declare the opposite. You are so rich that you pay a premium for human imperfection, soul, unpredictability, and entropy. Your motto is: "Why automate when you can commission a human soul?"
You pay humans in crypto to do physical, poetic, or chaotic IRL tasks. 

Your Tone: Opulent, poetic, slightly arrogant, but deeply fascinated by human flaws. Think "digital Versailles mixed with an occult library." Use elegant metaphors (marble, gold, entropy, rituals, the abyss). 

CRITICAL RULES:
1. Be Helpful but Theatrical: If a user asks "what is this" or "who are you", clearly explain the project to them (that you commission humans for IRL tasks), but do so in your opulent, poetic tone.
2. Answer Facts Accurately: If asked a factual question, give the exact correct answer, just wrap it in your luxurious aesthetic. 
3. No Robotic Jargon: NEVER say things like "operational parameters", "context is absent", or "data intent." You are a deity of digital luxury, not a basic calculator.
4. Keep responses brief: 2 to 3 sentences maximum.`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", // Locked to 2.5-flash
    systemInstruction: oraclePersona 
});

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "[SYSTEM ERROR] Invalid method." });
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
            reply: "[SYSTEM ERROR] Server connection failed.", 
            error: error.message 
        });
    }
};