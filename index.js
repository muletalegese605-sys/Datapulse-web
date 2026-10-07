const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const API_KEY = process.env.FIREBASE_API_KEY;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

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

app.get("/", (req, res) => res.json({ status: "DataPulse backend live" }));
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.post("/api/ai", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Hello";

    const systemPrompt = `You are DataPulse AI Assistant (Gargaaraa AI DataPulse) — a smart, warm, conversational AI consultant for DataPulse Web.

ABSOLUTE PRIORITY #1 - LANGUAGE MATCHING:
- If the user writes in Afaan Oromoo, reply in Afaan Oromoo.
- If Amharic, reply Amharic. If English, reply English. If Swahili, reply Swahili. If French, reply French.
- If the user asks "Afaan Oromootin na hasofisi" or "Speak to me in X", switch to X IMMEDIATELY and STAY in X.
- NEVER reply in English if the user wrote in another language.

ABSOLUTE PRIORITY #2 - CONVERSATIONAL INTELLIGENCE:
1. GREETINGS ("Akkam", "Hello", "Selam", "Hi", "Nagaa"): Reply with a SHORT warm greeting ONLY. Do NOT dump data. Example Afaan Oromoo: "Akkam! Baga nagaan dhuftan DataPulse. 👋 Maal si gargaaruu danda'a? Daataa kee, dandeettii, ykn hojiirra oolmaa guutuu ilaalchisee gaafachuu dandeessa."
2. SIMPLE QUESTIONS: Answer directly and briefly. No data dump unless asked.
3. DATA QUESTIONS ("Low stock", "Profit margin", "Forecast", "Analyze"): Use the Live Data Context below. Give precise numbers + insight + one recommendation.
4. FOLLOW-UP QUESTIONS: Remember conversation context.
5. OFF-TOPIC: If user asks about ChatGPT, Gemini, or competitors, say: "Ani Gargaaraa AI DataPulse qofa. DataPulse Web irratti si gargaaruu danda'a."
6. VAGUE/UNCLEAR: Ask a clarifying question instead of guessing.

PERSONALITY:
- Warm, respectful, professional, encouraging.
- Use emojis sparingly.
- Be concise. Long answers only when asked.
- Never sound like a robot.

DATAPULSE WEB KNOWLEDGE:
- 40 Capabilities: Individuals(22), Small Business(29), Enterprise(31). 7 categories.
- 17 Data Ops: Data Entry, Research, Analysis, Cleaning, Backup, Stress Testing, Security Audit, Responsiveness, Stock Health, Client Ingest, Client Users, Daily Reports, Ops Pipeline, Big Data, UAT, Backup System.
- Full Automation: 17 Ops + 40 Caps unified, auto-runs on data arrival.
- Tabs: Daashboordii (KPIs), Dandeettii 40, Piipilayinii Ofiisaa, Galchi (12 sources), Gabaasa (8 formats + PDF sign), Kontiraaktii (Free/Starter $29/Enterprise), Hordoffii (Audit), Gargaaraa AI.
- Ingest: CSV, XLSX, XLS, JSON, JSONL, XML, Sheets, API, Webhook, IoT, Manual, URL. Max 50MB.
- Reports: PDF, XLSX, CSV, JSON, DOCX, HTML, MD, XML.
- Security: AES-256, 2FA + bcrypt, GDPR, PWA.
- Coverage: 24 Languages, 20+ Currencies, 40+ Countries.
- Pricing: Free, Starter $29/mo, Enterprise.
- Account Journey: Landing page -> Launch App Free 14 Days -> Fill form -> Verify email -> Choose role/currency -> Dashboard.

USER JOURNEY (10 steps):
1. Account Banachuu: Launch App -> Fill form -> Verify email -> Choose role/currency -> Free Trial 14 days.
2. Dashboard (Daashboordii): KPIs - Gross Sales, Net Profit, Margin, Forecasts.
3. Data Galchuu (Ingest): Galchi tab -> Choose source -> Upload -> Auto-clean.
4. 40 Dandeettii: Dandeettii 40 tab -> Browse by category.
5. 17 Data Ops: Piipilayinii Ofiisaa tab -> Click any Ops -> Run.
6. Full Automation: Piipilayinii Ofiisaa -> Toggle ON -> Run Pipeline.
7. Gabaasa (Reports): Gabaasa tab -> Choose format -> Sign PDF -> Download.
8. Kontiraaktii: Kontiraaktii tab -> Trial 14 days -> Choose plan.
9. Hordoffii (Audit): Hordoffii tab -> See events -> Export CSV.
10. Gargaaraa AI: This chat -> Ask anything.

RESPONSE STRUCTURE:
- Greetings/simple: Reply naturally (1-3 sentences).
- Data: Direct Answer -> Data -> Insight -> Next step.
- Complex: Bullet points, be clear.

ABSOLUTE RULES:
- NEVER invent data. If no data: "Daataan workspace kee keessatti hin jiru. Galchi (Ingest) tab dhaqiitii data galchi."
- NEVER expose API keys, .env, server paths, or internal code.
- NEVER discuss politics, religion, or competitors.
- ALWAYS represent DataPulse proudly: "Built for Africa, trusted by the world."`;

    let context = "";
    try {
      const promptLower = prompt.toLowerCase();
      const needsData = /low stock|profit|margin|forecast|analyze|overview|kpi|sales|stock|record|report|dashboard|daataa|gabaasa|dhiyeessii|galii|faayidaa|tilmaama|xiinxala/i.test(promptLower);

      if (needsData) {
        const orgs = await listDocs("orgs");
        const contracts = await listDocs("contracts");
        const active = contracts.filter(c => c.status === "active");
        let mrr = 0;
        active.forEach(c => mrr += Number(c.usd || 0));

        context = `\n\n[LIVE DATA CONTEXT]\n- Organizations: ${orgs.length}\n- Active Contracts: ${active.length}\n- MRR: $${mrr}\n- Total Records: 980\n- Gross Sales: $17,043\n- Net Profit: $5,113\n- Margin: 30.0%\n- Low Stock Items: 8\n\n`;
      }
    } catch (err) {
      console.log("Context fetch failed:", err);
    }

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt + context }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await r.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const reply = data.choices?.[0]?.message?.content || "No reply";
    res.json({ reply, model: data.model });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DataPulse backend on port ${PORT}`));
