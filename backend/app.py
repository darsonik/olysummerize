from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

MISTRAL_API_KEY = os.getenv("MISTRAL_API")
API_URL = "https://api.mistral.ai/v1/chat/completions"  # Updated endpoint

def summarize_text(text, summary_length='short'):
    if not MISTRAL_API_KEY:
        return "Error: MISTRAL_API_KEY not set in environment variables."
    
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Map summary_length to approximate token counts or instructions
    length_instruction = {
        "short": "Summarize using bullet points.",
        "medium": "Summarize in 3-4 sentences.",
        "long": "Summarize in a paragraph."
    }.get(summary_length, "Summarize using bullet points.")
    
    # Prompt for summarization
    prompt = f"{length_instruction} Here is the text to summarize:\n\n{text}"
    
    data = {
        "model": "mistral-large-latest",  # Replace with desired model
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500,  # Adjust based on desired length
        "temperature": 0.7
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()  # Raise an exception for bad status codes
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
    except requests.exceptions.RequestException as e:
        return f"Error: Unable to summarize text. {str(e)}"

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()  # Safer JSON parsing
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400
    
    text = data.get("text", "")
    summary_length = data.get("summary_length", "long")
    
    if not text:
        return jsonify({"error": "Text cannot be empty"}), 400
    
    summary = summarize_text(text, summary_length)
    return jsonify({"summary": summary})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)