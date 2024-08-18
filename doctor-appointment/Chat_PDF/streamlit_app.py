import streamlit as st
import requests

# URL de l'API Flask
API_URL = "http://127.0.0.1:5000/diagnostic"

def main():
    st.title("Chat Médical avec vos PDF")

    user_question = st.text_input("Posez une question concernant vos symptômes:")

    if st.button("Envoyer"):
        if user_question:
            response = requests.post(API_URL, json={"question": user_question})
            if response.status_code == 200:
                data = response.json()
                st.write("### Diagnostic Préliminaire :")
                st.write(data['diagnostic'])
                st.write("### Réponse du Chat :")
                st.write(data['response'])
                st.write("### Spécialistes Recommandés :")
                for specialist in data['specialistes']:
                    st.write(f"- {specialist['name']} ({specialist['specialty']})")
            else:
                st.error("Erreur lors de la communication avec l'API.")
        else:
            st.warning("Veuillez entrer une question.")

if __name__ == "__main__":
    main()
