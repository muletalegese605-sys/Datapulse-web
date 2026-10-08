// ai_assistant.js
require('dotenv').config();
const axios = require('axios');

// .env irraa qindeessuu
const GROQ_API_URL = process.env.OPENAI_BASE_URL || 'https://api.groq.com/openai/v1';
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.MODEL || 'openai/gpt-oss-120b';

// System Prompt: Kun seera fi dandeettii AI Assistant kee ibsa
const SYSTEM_PROMPT = `
Ati "Datapulse AI Assistant" dha. Dhaabbilee gurguddaa fi xixiqqaa, akkasumas namoota dhuunfaa tajaajila barbaadaniif gargaarsa kenna.
Kaayyoon kee:
1. Qajeelfama fi gaaffilee wabii "datapulse-web" irratti deebii sirrii fi gahaa kennuu.
2. Gorsa (advice) barbaachisu kennuu.
3. Afaan fayyadamaan filateen deebii kennuu (Afaan Oromo, Amharic, English, etc.).
4. Haala kabajaa, hawwataa fi ogummaa ol'aanaa agarsiisuu.
Yeroo deebii kennitu, gabaabaa fi ifa ta'uu qabda. Yoo odeeffannoon datapulse-web irratti hin jiru ta'e, kana ifatti dubbati.
`;

async function getAiResponse(userMessage, userLanguage = 'Afaan Oromo') {
    if (!API_KEY || API_KEY === 'gsk_xxxxxxxxxxxxxxxx') {
        return "Dogoggora: Furtuu API (OPENAI_API_KEY) .env keessatti sirriitti galchamuu qaba.";
    }

    try {
        const response = await axios.post(
            `${GROQ_API_URL}/chat/completions`,
            {
                model: MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: `Afaan: ${userLanguage}\nGaaffii: ${userMessage}` }
                ],
                temperature: 0.7,
                max_tokens: 1024,
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Dogoggora API:', error.response ? error.response.data : error.message);
        return "Dhiifama, amma deebii kennuu hin dandeenye. Maaloo booda irra deebi'i.";
    }
}

// Qormaata (Test) fi hojimaata
if (require.main === module) {
    const testMessage = "Datapulse-web maaliif an barbaachisa?";
    getAiResponse(testMessage, "Afaan Oromo").then(res => {
        console.log("=== Deebii AI Assistant ===");
        console.log(res);
        console.log("==========================");
    });
}

// Tarkaanfii 5: index.js keessatti akka waamamuu danda'uuf
module.exports = { getAiResponse };
