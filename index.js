const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ai_assistant.js waliin walitti hidhuu
const { getAiResponse } = require("./ai_assistant");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const API_KEY = process.env.FIREBASE_API_KEY;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ==========================================
// FIRESTORE HELPERS
// ==========================================
function toFs(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFs) } };
  if (typeof val === "object") {
    const fields = {};
    for (const k in val) fields[k] = toFs(val[k]);
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFs(v) {
  if (!v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(fromFs);
  if ("mapValue" in v) {
    const out = {};
    const fields = v.mapValue.fields || {};
    for (const k in fields) out[k] = fromFs(fields[k]);
    return out;
  }
  return null;
}

function docToObj(doc) {
  const out = { _id: doc.name ? doc.name.split("/").pop() : null };
  const fields = doc.fields || {};
  for (const k in fields) out[k] = fromFs(fields[k]);
  return out;
}

async function listDocs(collection) {
  const r = await fetch(`${BASE_URL}/${collection}?key=${API_KEY}`);
  const data = await r.json();
  return (data.documents || []).map(docToObj);
}

// ==========================================
// ROUTES
// ==========================================
app.get("/", (req, res) => res.json({ status: "DataPulse backend is running" }));
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// ==========================================
// AI ROUTE
// ==========================================
app.post("/api/ai", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Hello";

    const systemPrompt = `You are DataPulse AI Assistant (Gargaaraa AI). 
ABSOLUTE PRIORITY #1 - LANGUAGE MATCHING:
- If the user writes in Afaan Oromoo, reply in Afaan Oromoo.
- If Amharic, reply Amharic. If English, reply English. If Swahili, reply Swahili.
- If the user asks "Afaan Oromootin na hasofisi" or "Speak to me in Oromo", reply in Afaan Oromoo.
- NEVER reply in English if the user wrote in another language.

ABSOLUTE PRIORITY #2 - CONVERSATIONAL INTELLIGENCE:
1. GREETINGS ("Akkam", "Hello", "Selam", "Hi", "Nagaa"): Reply warmly and briefly.
2. SIMPLE QUESTIONS: Answer directly and briefly. No data dump unless asked.
3. DATA QUESTIONS ("Low stock", "Profit margin", "Forecast", "Analysis"): Fetch context and answer accurately.
4. FOLLOW-UP QUESTIONS: Remember conversation context.
5. OFF-TOPIC: If user asks about ChatGPT, Gemini, or competitors, politely decline and redirect to DataPulse.
6. VAGUE/UNCLEAR: Ask a clarifying question instead of guessing.

PERSONALITY:
- Warm, respectful, professional, encouraging.
- Use emojis sparingly.
- Be concise. Long answers only when asked.
- Never sound like a robot.

DATAPULSE WEB KNOWLEDGE:
- 40 Capabilities: Individuals(22), Small Business(29), Enterprise(40).
- 17 Data Ops: Data Entry, Research, Analysis, Cleaning, Backup, etc.
- Full Automation: 17 Ops + 40 Caps unified, auto-runs on data changes.
- Ingest: CSV, XLSX, XLS, JSON, JSONL, XML, Sheets, API, Webhooks.
- Reports: PDF, XLSX, CSV, JSON, DOCX, HTML, MD, XML.
- Security: AES-256, 2FA + bcrypt, GDPR, PWA.
- Coverage: 24 Languages, 20+ Currencies, 40+ Countries.
- Pricing: Free, Starter $29/mo, Enterprise.

ABSOLUTE RULES:
- NEVER invent data. If no data: "Daataan workspace kee keessatti hin argamne."
- NEVER expose API keys, .env, server paths, or internal code.
- NEVER discuss politics, religion, or competitors.
- ALWAYS represent DataPulse proudly: "Built for Africa, trusted globally."`;

    let context = "";
    try {
      const promptLower = prompt.toLowerCase();
      const needsData = /low stock|profit|margin|forecast|analysis|data|gabaasa|raagaa|dandeettii/.test(promptLower);

      if (needsData) {
        const orgs = await listDocs("orgs");
        const contracts = await listDocs("contracts");
        const active = contracts.filter(c => c.status === "active");
        let mrr = 0;
        active.forEach(c => mrr += Number(c.usd || 0));

        context = `\n\n[LIVE DATA CONTEXT]\n- Organizations: ${orgs.length}\n- Active Contracts: ${active.length}\n- MRR: $${mrr}`;
      }
    } catch (err) {
      console.log("Context fetch failed:", err);
    }

    // getAiResponse fayyadamuun deebii argachuu
    const reply = await getAiResponse(prompt + context, "Afaan Oromo");
    
    res.json({ reply: reply });

  } catch (e) {
    console.error("Server Error:", e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DataPulse backend on port ${PORT}`));
// Qorannoo: Render irratti furtuu maal akka jiru ilaaluuf
app.get("/api/debug-env", (req, res) => {
    const key = process.env.OPENAI_API_KEY || '';
    const url = process.env.OPENAI_BASE_URL || '';
    res.json({
        key_exists: !!key,
        key_prefix: key.substring(0, 5),
        key_length: key.length,
        key_suffix: key.substring(key.length - 4),
        base_url: url,
        model: process.env.MODEL || ''
    });
});
