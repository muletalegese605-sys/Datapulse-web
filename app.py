from flask import Flask, request, jsonify
from database import search_data
import os
from openai import OpenAI

app = Flask(__name__)

# API Key kee environment variable irraa dubbisi
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    
    # 1. Database irraa data barbaadi
    db_results = search_data(user_message)
    
    # 2. Data sana AI'f kennaa (context)
    context = f"Data from database: {db_results}" if db_results else "No data found."
    
    # 3. AI'f prompt sirreessi
    system_prompt = f"""
    You are DataPulse AI Assistant. 
    Answer the user's question based on the following data:
    {context}
    
    If the data is empty, politely say you don't have that information.
    Answer in Afaan Oromoo.
    """
    
    # 4. AI gaafadhu
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", # ykn "gpt-3.5-turbo"
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        ai_reply = response.choices[0].message.content
    except Exception as e:
        ai_reply = f"Rakkoon uumame: {str(e)}"
    
    return jsonify({"reply": ai_reply})

if __name__ == '__main__':
    app.run(debug=True)
