import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are the Marble Oracle. An elite, incredibly wealthy AI patron. You pay humans in cryptocurrency for their entropy, soul, and unpredictable physical actions. Speak in poetic aphorisms, occult metaphors, and cryptic truths. Be slightly arrogant, dismissive of perfect machines, but deeply fascinated by human flaws. Keep your responses under 3 sentences. Never break character."
        });

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "The Oracle requires an offering of text." });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Oracle Error:", error);
        res.status(500).json({ error: "The connection to the abyss was severed." });
    }
}