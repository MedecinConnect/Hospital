import streamlit as st
import openai
from dotenv import load_dotenv
import os

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

st.title("CliniqueAI")

if 'messages' not in st.session_state:
    st.session_state['messages'] = [{"role": "assistant", "content": "Bonjour, je suis le Dr. Hamza. Comment puis-je vous aider aujourd'hui ?"}]

def generate_response(prompt):
    try:
        medical_prompt = f"Vous êtes un docteur. Répondez aux questions de l'utilisateur en vous limitant strictement au domaine médical.\n\nUtilisateur : {prompt}\nDocteur :"
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
        
        # Ajout d'un lien à la fin de la réponse
        message += "\n\n[Consultez nos docteurs](http://localhost:3000/doctors)"
        
        return message
    except openai.error.RateLimitError:
        return "Désolé, j'ai dépassé le quota d'utilisation. Veuillez réessayer plus tard ou vérifier votre plan et les détails de facturation."

def send_message(selected_question):
    if selected_question:
        st.session_state.messages.append({"role": "user", "content": selected_question})
        response = generate_response(selected_question)
        st.session_state.messages.append({"role": "assistant", "content": response})

# Liste de questions médicales prédéfinies
questions = [
    "Quels sont les symptômes de la grippe ?",
    "Comment traiter un mal de tête ?",
    "Quels sont les effets secondaires des antibiotiques ?",
    "Que faire en cas de fièvre élevée ?",
    "Comment prévenir les infections ?",
    "Quels sont les signes d'une réaction allergique ?",
    "Quels sont les symptômes du diabète ?",
    "Comment gérer le stress au quotidien ?",
    "Quels sont les traitements pour l'hypertension ?",
    "Que faire en cas de brûlures ?",
    "Comment traiter une entorse ?",
    "Quels sont les signes d'une crise cardiaque ?",
    "Comment soigner une toux persistante ?",
    "Quels sont les symptômes de l'asthme ?",
    "Que faire en cas d'intoxication alimentaire ?",
    "Comment prévenir les maladies cardiovasculaires ?",
    "Quels sont les traitements pour la dépression ?",
    "Comment renforcer le système immunitaire ?",
    "Quels sont les risques liés au tabagisme ?",
    "Comment traiter une infection urinaire ?",
    "Quels sont les symptômes de l'arthrite ?",
    "Comment gérer les douleurs chroniques ?",
    "Que faire en cas de coup de chaleur ?",
    "Quels sont les bienfaits de l'exercice physique ?",
    "Comment traiter une sinusite ?",
    "Quels sont les symptômes de l'anémie ?",
    "Que faire en cas de coupure profonde ?",
    "Comment prévenir les allergies saisonnières ?",
    "Quels sont les traitements pour les migraines ?",
    "Comment gérer les symptômes de la ménopause ?"
]

st.selectbox("Choisissez une question :", questions, key="selected_question", on_change=lambda: send_message(st.session_state.selected_question))

if st.session_state.messages:
    for message in st.session_state.messages:
        role = "Vous" if message["role"] == "user" else "Dr. Hamza"
        st.write(f"**{role}**: {message['content']}")
