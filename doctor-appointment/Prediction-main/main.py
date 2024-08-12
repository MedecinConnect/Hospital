import streamlit as st
import cv2
import numpy as np
from skimage.feature import graycomatrix, graycoprops
import pandas as pd
import os

# Fonction pour extraire uniquement les caractéristiques GLCM
def glcm(image):
    data = cv2.imread(image, 0)
    glcm_matrix = graycomatrix(data, [2], [0], None, symmetric=True, normed=True)
    dissimilarity = graycoprops(glcm_matrix, 'dissimilarity')[0, 0]
    contrast = graycoprops(glcm_matrix, 'contrast')[0, 0]
    correlation = graycoprops(glcm_matrix, 'correlation')[0, 0]
    energy = graycoprops(glcm_matrix, 'energy')[0, 0]
    homogeneity = graycoprops(glcm_matrix, 'homogeneity')[0, 0]
    return [dissimilarity, contrast, correlation, energy, homogeneity]

st.title("Prédiction de maladies à partir d'images")

# Option pour télécharger une image
uploaded_file = st.file_uploader("Téléchargez une image", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    # Sauvegarder l'image téléchargée temporairement
    with open("temp_image.jpg", "wb") as f:
        f.write(uploaded_file.getbuffer())
    
    st.image(uploaded_file, caption="Image téléchargée", use_column_width=True)
    
    # Extraire les caractéristiques de l'image (GLCM seulement)
    features_glcm = glcm("temp_image.jpg")
    
    # Imprimer la forme des caractéristiques extraites
    st.write(f"Forme des caractéristiques extraites : {len(features_glcm)}")

    # Lire le fichier CSV contenant les caractéristiques pour le COVID
    csv_file = "Covid/Covid_glcm.csv"  # Chemin du fichier CSV
    df = pd.read_csv(csv_file, header=None)
    
    # Extraire les caractéristiques du CSV pour comparaison
    X = df.iloc[:, :-1].values  # Toutes les colonnes sauf la dernière
    y = df.iloc[:, -1].values   # La dernière colonne est le label
    
    # Imprimer la forme des caractéristiques dans le CSV
    st.write(f"Forme des caractéristiques dans le CSV : {X.shape[1]}")
    
    if X.shape[1] != len(features_glcm):
        st.error(f"Le nombre de caractéristiques extraites ({len(features_glcm)}) ne correspond pas à celui du CSV ({X.shape[1]}).")
    else:
        # Comparer les caractéristiques extraites de l'image avec celles du CSV
        distances = np.linalg.norm(X - np.array(features_glcm), axis=1)
        closest_match_index = np.argmin(distances)
        prediction = y[closest_match_index]
        
        # Afficher le résultat de la prédiction
        if prediction == "COVID":
            st.success("Résultat : Vous avez des risques de COVID.")
        else:
            st.success("Résultat : Vous n'avez pas de risques de COVID.")
    
    # Supprimer l'image temporaire après traitement
    os.remove("temp_image.jpg")
