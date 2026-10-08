const axios = require('axios');

// Mirkaneessi .env kee keessatti API_KEY jiraachuu isaa
const AI_API_KEY = process.env.AI_API_KEY || 'YOUR_API_KEY_AS_BAKKAA_GALCHI';
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions'; // Ykn Gemini URL

async function getAIResponse(userMessage) {
    try {
        if (!userMessage) {
            throw new Error("Yaadni maamilaa hin jiru (User message is empty).");
        }

        // Yoo API_KEY hin jiraanne, error dhiisuu malee deebii nagahee kenni
        if (AI_API_KEY === 'YOUR_API_KEY_AS_BAKKAA_GALCHI' || !AI_API_KEY) {
            return "Dhiifama, AI Assistant kun amma API Key hin qabu. Maaloo maallaqa qopheessaa. (API Key missing)";
        }

        // API-tti ergaa (Request to AI)
        const response = await axios.post(AI_API_URL, {
            model: "gpt-3.5-turbo", // Ykn "gemini-pro", ykn "deepseek-chat"
            messages: [
                { role: "system", content: "Ati DataPulse AI Assistant dha. Yaada maamilaa hubattee, seera fi hojiidhaan deebii kenni." },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${AI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000 // Yeroo gabaabaa keessatti deebii dhabe, error kennisi
        });

        // Deebii API irraa dhufe sakatta'i
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content;
        } else {
            throw new Error("Deebiin AI irraa dhufe qullaa'aa dha (Invalid response structure).");
        }

    } catch (error) {
        // Error kamaa qabee, app akka hin dhaabbannetti ittisuu
        console.error("AI Service Error:", error.message);
        
        if (error.code === 'ECONNABORTED') {
            return "Dhiifama, AI tajaajilli yeroo dheeraa fudhateera. Maaloo irra deebi'ii yaali.";
        } else if (error.response) {
            return `Dhiifama, AI irratti rakkoon uumame: ${error.response.status} - ${error.response.data.error?.message || 'Hubannoo hin qabu'}`;
        } else {
            return "Dhiifama, rakkoo wal qunnamtii (Network Error) irraa kan ka'e deebii kennuu hin dandeenye.";
        }
    }
}

module.exports = { getAIResponse };
