import streamlit as st
import requests

st.title("Prédiction de maladies à partir d'images")

# Option pour choisir la maladie à prédire
disease_choice = st.selectbox("Choisissez la maladie à prédire", ["COVID", "Glaucoma"])

# Option pour télécharger une image
uploaded_file = st.file_uploader("Téléchargez une image", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    # Afficher l'image téléchargée
    st.image(uploaded_file, caption="Image téléchargée", use_column_width=True)

    # Préparer les données pour l'API
    files = {'image': uploaded_file}
    data = {'disease': disease_choice}

    # Appeler l'API Flask
    response = requests.post("http://127.0.0.1:5000/predict", files=files, data=data)

    # Traiter la réponse
    if response.status_code == 200:
        result = response.json()['prediction']
        if disease_choice == "COVID":
            if result == "COVID":
                st.success("Résultat : L'image montre des signes compatibles avec le COVID.")
            else:
                st.success("Résultat : L'image ne montre pas de signes de COVID.")
        elif disease_choice == "Glaucoma":
            if result == "Glaucoma":
                st.success("Résultat : Vous avez des risques de glaucome.")
            else:
                st.success("Résultat : Vous n'avez pas de risques de glaucome.")
    else:
        st.error(f"Une erreur s'est produite : {response.json().get('error', 'Erreur inconnue')}")
