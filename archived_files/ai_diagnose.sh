#!/bin/bash
echo "========================================="
echo "   DATAPULSE AI DIAGNOSTIC TOOL"
echo "========================================="
cd ~/datapulse-web/backend || { echo "❌ Backend folder hin argamne"; exit 1; }

echo -e "\n[1] Checking dependencies (axios)..."
if grep -q "axios" package.json; then echo "✅ axios installed"; else echo "❌ axios missing! Run: npm install axios"; fi

echo -e "\n[2] Checking .env file..."
if [ -f .env ]; then
    if grep -q "AI_API_KEY" .env; then echo "✅ AI_API_KEY found in .env"; else echo "⚠️ AI_API_KEY missing in .env"; fi
else
    echo "⚠️ .env file missing"
fi

echo -e "\n[3] Checking ai_service.js..."
if [ -f ai_service.js ]; then echo "✅ ai_service.js exists"; else echo "❌ ai_service.js missing"; fi

echo -e "\n[4] Checking index.js routes..."
if grep -q "/api/chat" index.js; then echo "✅ /api/chat route exists"; else echo "❌ /api/chat route missing"; fi

echo -e "\n[5] Testing local API..."
curl -s -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"message":"test"}' | grep -q "reply" && echo "✅ Local backend responds" || echo "❌ Local backend failed to respond"

echo -e "\n[6] Checking frontend API URL..."
cd ~/datapulse-web || exit
FRONTEND_URL=$(grep -r "api/chat" *.html *.js 2>/dev/null | grep -o "http[s]*://[^\"']*" | head -n 1)
if [ -n "$FRONTEND_URL" ]; then
    echo "✅ Frontend is pointing to: $FRONTEND_URL"
    if [[ "$FRONTEND_URL" == *"onrender.com"* ]]; then
        echo "✅ Looks like Render URL!"
    else
        echo "⚠️ Frontend is NOT pointing to Render! Update it to: https://datapulse-web-rzon.onrender.com/api/chat"
    fi
else
    echo "❌ Could not find fetch URL in frontend files."
fi
echo -e "\n========================================="
echo "Diagnostic Complete!"
