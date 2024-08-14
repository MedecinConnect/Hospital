from flask import Flask, request, jsonify
import openai
from dotenv import load_dotenv
import os

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)

def generate_response(prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Vous êtes un docteur. Répondez aux questions de l'utilisateur en vous limitant strictement au domaine médical."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        message = response['choices'][0]['message']['content'].strip()
        message += "\n\n[Consultez nos docteurs](http://localhost:3000/doctors)"
        return message
    except openai.error.RateLimitError:
        return "Désolé, j'ai dépassé le quota d'utilisation. Veuillez réessayer plus tard ou vérifier votre plan et les détails de facturation."

@app.route('/api/ask', methods=['POST'])
def ask():
    if not request.json or 'prompt' not in request.json:
        return jsonify({"error": "Le champ 'prompt' est requis."}), 400

    prompt = request.json.get("prompt", "")
    if not prompt:
        return jsonify({"error": "Le prompt ne peut pas être vide."}), 400

    response = generate_response(prompt)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
