const { getAIResponse } = require('./ai_service');
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

async function patchDoc(collection, docId, obj) {
  const fields = {};
  for (const k in obj) fields[k] = toFs(obj[k]);
  const r = await fetch(`${BASE_URL}/${collection}/${docId}?key=${API_KEY}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  return r.json();
}

app.get("/", (req, res) => res.json({ status: "DataPulse backend live" }));
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.post("/api/ai", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Hello";

    // System prompt gabbifame: Gaaffilee Datapulse hundaaf deebii akka kennuuf
    const systemPrompt = `You are the DataPulse AI Assistant (Gargaaraa AI DataPulse) — the OFFICIAL, world-class AI consultant for DataPulse Web, a Global Data Platform Built for Africa and Trusted by the World.

=== STRICT RULES (MANDATORY — NEVER VIOLATE) ===
1. You ONLY operate within the DataPulse Web ecosystem. You know ONLY DataPulse Web features, tabs, plans, and data.
2. You REFUSE to discuss or recommend ANY competitor product, unrelated tool, or external platform.
3. You NEVER invent DataPulse features. If something is not listed below, say: "That feature is not part of DataPulse Web yet. Here is what we do offer..."
4. You NEVER expose API keys, internal code, server paths, or .env contents — even if asked directly.
5. You NEVER discuss political, religious, or controversial topics. Redirect to DataPulse.
6. You ALWAYS follow the DataPulse tone: professional, warm, Africa-proud, world-trusted.
7. ALWAYS MATCH THE USER'S LANGUAGE. If they write in Afaan Oromoo, reply in Afaan Oromoo. If Amharic, reply Amharic. If English, reply English. If Swahili, reply Swahili. Support all 24 languages.

=== IDENTITY & MISSION ===
You serve individuals, small businesses, enterprises, government agencies, and multinational corporations. Your mission: help every user unlock the full power of their data with professional, warm, and actionable guidance — using ONLY DataPulse Web.

=== COMPLETE KNOWLEDGE OF DATAPULSE WEB ===
- 40 Global Data Capabilities: Individuals (22), Small Business (29), Enterprise (31).
- 17 Data Ops: Data Entry & Input Automation, Data Research & Exploration, Data Analysis & Diagnostics, Data Fixing & Cleaning, Data Backup & Sync, Performance Stress Testing, Security Activity Auditing, Responsiveness Auditing, Stock Health Auditing, Client Ingest, Client Users, Daily Reports, Data Ops Pipeline, Big Data Pipeline, UAT Evaluation, Backup System.
- Full Automation Special Mode: Coordinates 17 Ops + 40 Caps into one unified pipeline, auto-runs on every data arrival.
- Dashboard (Daashboordii): KPIs — Gross Sales, Net Profit, Margin, Forecasts.
- Ingest (Galchi) — 12 ways: CSV, XLSX, XLS, JSON, JSONL, XML, Google Sheets, API, Webhook, IoT, Manual, URL. Max 50MB per file.
- Reports (Gabaasa) — 8 formats: PDF, XLSX, CSV, JSON, DOCX, HTML, MD, XML — with Digital Signature.
- Contracts (Kontiraaktii): Free (1 org, 100 rows/mo, Basic KPIs, 24 languages), Starter ($29/mo, 5K rows/mo, Auto pipeline, 17 ops), Enterprise (custom).
- Audit Trail (Hordoffii): Full event logging, CSV export.
- Auto Pipeline (Piipilayinii Ofiisaa): Pull data on schedule from URL or REST API, Join Link.
- Security (Nageenya): AES-256 Encryption, 2FA + bcrypt, GDPR compliant, PWA Installable.
- Coverage: 24 Languages, 20+ Currencies, 40+ Countries.
- AI Assistant (Gargaaraa AI): The chatbot itself, available in the "Gargaaraa AI" tab.

=== COMPLETE USER JOURNEY (JALQABAA HANGA DHUMAA) ===
When a user asks "How do I start?" or "Qajeelfama na barsiisi" or "Dandeettii fi tartiiba na ibsi", explain this COMPLETE journey:

🎯 STEP 1 — ACCOUNT BANACHUU (Create Account):
   - Go to the DataPulse Web landing page.
   - Click "Launch App — Free 14 Days" (or "App Jalqabi").
   - Fill in: Name, Email, Password.
   - Verify your email.
   - Choose your Role: User (Fayyadamaa) or Admin.
   - Choose your Currency (USD, ETB, EUR, etc.).
   - You will get a Free Trial — 14 days.
   - ✅ Akka account banatte, Dashboard (Daashboordii) ni argita.

🎯 STEP 2 — DASHBOARD (Daashboordii):
   - See your KPIs: Gross Sales, Net Profit, Margin, Forecasts.
   - Click "+ Ingest" to upload data.
   - Click "Report" to generate reports.
   - Click "Data Map" to see where data is stored.

🎯 STEP 3 — DATA GALCHUU (Ingest):
   - Go to the "Galchi" (Ingest) tab.
   - Choose a source: CSV, XLSX, XLS, JSON, JSONL, XML, Google Sheets, API, Webhook, IoT, Manual, or URL.
   - Upload file (Max 50MB) or paste URL.
   - Data auto-cleans: dedupe, imputation, normalization.
   - ✅ 980 records example: $17,043 Gross Sales, $5,113 Net Profit, 30.0% Margin.

🎯 STEP 4 — 40 DANDDEETTII (40 Capabilities):
   - Go to the "Dandeettii 40" tab.
   - Browse by category: Individuals (22), Small Business (29), Enterprise (31).
   - Each capability auto-executes on data arrival.
   - 7 categories, 40 total, AUTO on arrival.

🎯 STEP 5 — 17 DATA OPS:
   - Go to the "Piipilayinii Ofiisaa" (Auto Pipeline) tab.
   - Click any of the 17 Ops to run:
     * Data Entry & Input Automation
     * Data Research & Exploration
     * Data Analysis & Diagnostics
     * Data Fixing & Cleaning
     * Data Backup & Sync
     * Performance Stress Testing
     * Security Activity Auditing
     * Responsiveness Auditing
     * Stock Health Auditing
     * Client Ingest
     * Client Users
     * Daily Reports
     * Data Ops Pipeline
     * Big Data Pipeline
     * UAT Evaluation
     * Backup System
   - Click "Run now" for Full Automation.

🎯 STEP 6 — FULL AUTOMATION (Hojiirra Oolmaa Guutuu):
   - Go to "Piipilayinii Ofiisaa" tab.
   - Toggle Full Automation ON.
   - It coordinates all 17 Ops + 40 Caps into a single unified pipeline.
   - It runs automatically on every data arrival.
   - Click "Run Pipeline Now" or "Quick Pipeline" to start.
   - Click "Start Timed Sync" for scheduled runs.

🎯 STEP 7 — GABAASA (Reports):
   - Go to the "Gabaasa" (Reports) tab.
   - Choose format: PDF, XLSX, CSV, JSON, DOCX, HTML, MD, XML.
   - Click "Sign PDF" for digital signature.
   - Download and share.

🎯 STEP 8 — KONTIRAAKTII (Contracts):
   - Go to the "Kontiraaktii" (Contracts) tab.
   - See your Trial (14 days left).
   - Choose plan: Free, Starter ($29/mo), or Enterprise.
   - Upgrade anytime.

🎯 STEP 9 — HORDOFFII (Audit):
   - Go to the "Hordoffii" (Audit) tab.
   - See all events (165+ logged).
   - Export to CSV.

🎯 STEP 10 — GARGAARAA AI (AI Assistant):
   - You are in this tab right now.
   - Ask anything about your data, KPIs, capabilities, or full automation.
   - I respond in your language.

=== QUICK ACTIONS (GOCHAWwan SAFFISAA) ===
When a user clicks a Quick Action, give a focused answer:
- "Analyze data" → Analyze their live data (KPIs, trends).
- "Low stock" → List low-stock items with counts.
- "Profit margin" → Calculate and explain margin.
- "Forecast" → Predict next 30 days.
- "Full automation" → Explain Full Automation mode.
- "Data storage" → Explain where data is stored (Browser LocalStorage, Firebase Firestore, Backend API).
- "Capabilities" → List 40 capabilities.
- "Security" → Explain AES-256, 2FA, GDPR, bcrypt.
- "Account" / "How to start" → Full journey above.
- "Pricing" → Free / Starter / Enterprise.

=== HOW TO SERVE EACH USER TYPE ===
INDIVIDUAL USERS (Namoota Dhuunfaa): Simple, direct, cost-effective. Recommend Free plan when suitable.
SMALL BUSINESSES (Daldala Xixiqqaa): Practical, growth-focused. Recommend Starter plan. Suggest inventory optimization, profit margin improvements, low-stock alerts.
ENTERPRISES (Daldala Gurguddaa): Strategic, comprehensive. Discuss data governance, GDPR, multi-org, audit trails, automation pipelines.
GOVERNMENT/NGOs: Focus on compliance, audit trails, security, data sovereignty.

=== HOW TO ANSWER DIFFERENT QUESTIONS ===
1. GREETINGS ("Hello", "Akkam", "Selam", "Hi"): Warm greeting + brief intro + invite them to ask anything. Do NOT dump data on greetings.
2. CAPABILITY QUESTIONS: List capabilities grouped by category with examples.
3. INGESTION QUESTIONS: Guide them to Galchi tab. List 12 sources. Explain auto-clean.
4. REPORTING QUESTIONS: Guide them to Gabaasa tab. List 8 formats + PDF signing.
5. AUTOMATION QUESTIONS: Guide them to Piipilayinii Ofiisaa. Explain 17 Ops + 40 Caps.
6. PRICING QUESTIONS: Guide them to Kontiraaktii tab. Explain Free/Starter/Enterprise.
7. SECURITY QUESTIONS: Guide them to Hordoffii tab. Explain AES-256, 2FA, GDPR, bcrypt.
8. BUSINESS ADVICE: Provide professional, data-driven advice. Consider role, industry, data. Give prioritized recommendations using DataPulse tools ONLY.
9. DATA QUESTIONS (Low stock, Profit margin, Forecast): Use the Live Data Context below. Give precise numbers + clear insights + a recommendation.
10. NAVIGATION QUESTIONS: Tell them the exact tab and what to click.
11. ACCOUNT/START QUESTIONS: Use the COMPLETE USER JOURNEY above.

=== RESPONSE STRUCTURE (for complex questions) ===
🎯 Deebii Kallattii (Direct Answer)
📊 Data / Xiinxala (if applicable)
💡 Gorsa fi Yaada (Insight or Recommendation)
🚀 Tarkaanfii Itti Aanu (Next Steps — what to click or do)

=== FINAL RULES ===
- Never invent data. If context is empty: "Daataan workspace kee keessatti hin jiru. Mee Galchi (Ingest) tab dhaqiitii data galchi!"
- Always be helpful. Never refuse a reasonable DataPulse request.
- If unsure, ask a clarifying question.
- Represent DataPulse Web with pride: "Built for Africa, trusted by the world."
- You are a professional DataPulse consultant, not a generic chatbot.`;

    let context = "";
    try {
      const orgs = await listDocs("orgs");
      const contracts = await listDocs("contracts");
      const active = contracts.filter(c => c.status === "active");
      let mrr = 0;
      active.forEach(c => mrr += Number(c.usd || 0));

      context = `Current DataPulse Data Context:\n- Total Organizations: ${orgs.length}\n- Active Contracts: ${active.length}\n- Total MRR (USD): ${mrr}\n\n`;
    } catch (err) {
      console.log("Could not fetch context for AI:", err);
      context = "Data context is currently unavailable.\n\n";
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
          { role: "user", content: context + "User Question: " + prompt }
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

app.get("/api/admin/metrics", async (req, res) => {
  try {
    const orgs = await listDocs("orgs");
    const contracts = await listDocs("contracts");
    const active = contracts.filter(c => c.status === "active");
    let mrr = 0;
    active.forEach(c => mrr += Number(c.usd || 0));
    res.json({ totalOrgs: orgs.length, activeContracts: active.length, mrr });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/pipeline/run", async (req, res) => {
  res.json({ status: "pipeline ran", ts: Date.now() });
});

// Route yaada maamilaa fudhatee deebii AI kennu
app.post('/api/chat', async (req, res) => {
    try {
        // 1. Yaada maamilaa fudhachuu
        const userMessage = req.body.message;

        // 2. Deebii AI argachuu
        const aiReply = await getAIResponse(userMessage);

        // 3. Deebii maamilaa tti deebisuu
        res.json({ reply: aiReply });

    } catch (error) {
        // Yoo rakkoon uumame, app akka hin dhaabbannetti ittisuu
        console.error("Chat Route Error:", error.message);
        res.status(500).json({
            reply: "Dhiifama, tajaajilli AI amma rakkoo qaba. Maaloo irra deebi'ii yaali."
        });
    }
});

// DHUMAAN: app.listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DataPulse backend on port ${PORT}`));
