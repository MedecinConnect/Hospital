import streamlit as st
import requests

st.title("CliniqueAI - Consultation Médicale")

if 'messages' not in st.session_state:
    st.session_state['messages'] = [{"role": "assistant", "content": "Bonjour, je suis le Dr. Hamza. Comment puis-je vous aider aujourd'hui ?"}]

def send_message(prompt):
    # Appeler l'API Flask
    url = "http://127.0.0.1:5000/api/ask"  # URL de l'API Flask
    try:
        response = requests.post(url, json={"prompt": prompt})
        
        if response.status_code == 200:
            response_data = response.json()
            return response_data.get("response", "Aucune réponse reçue.")
        else:
            return response.json().get("error", "Une erreur est survenue.")
    except requests.exceptions.RequestException as e:
        return f"Erreur lors de la communication avec l'API : {e}"

def handle_message():
    if st.session_state.prompt:
        # Ajouter le message utilisateur à l'historique
        st.session_state.messages.append({"role": "user", "content": st.session_state.prompt})

        # Obtenir la réponse de l'API
        response = send_message(st.session_state.prompt)

        # Ajouter la réponse de l'assistant à l'historique
        st.session_state.messages.append({"role": "assistant", "content": response})

        # Vider le champ de saisie
        st.session_state.prompt = ""

# Affichage de l'historique des messages
for message in st.session_state.messages:
    role = "Vous" if message["role"] == "user" else "Dr. Hamza"
    st.write(f"**{role}**: {message['content']}")

# Champ de saisie pour l'utilisateur
st.text_input("Posez votre question médicale :", key="prompt", on_change=handle_message)
