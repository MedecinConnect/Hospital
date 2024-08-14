from flask import Flask, jsonify, request
import cv2
import numpy as np
from skimage.feature import graycomatrix, graycoprops
import pandas as pd
import os

app = Flask(__name__)

def glcm(image_path):
    data = cv2.imread(image_path, 0)
    glcm_matrix = graycomatrix(data, [2], [0], None, symmetric=True, normed=True)
    dissimilarity = graycoprops(glcm_matrix, 'dissimilarity')[0, 0]
    contrast = graycoprops(glcm_matrix, 'contrast')[0, 0]
    correlation = graycoprops(glcm_matrix, 'correlation')[0, 0]
    energy = graycoprops(glcm_matrix, 'energy')[0, 0]
    homogeneity = graycoprops(glcm_matrix, 'homogeneity')[0, 0]
    return [dissimilarity, contrast, correlation, energy, homogeneity]

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files or 'disease' not in request.form:
        return jsonify({"error": "Please provide an image and the disease type."}), 400

    image_file = request.files['image']
    disease_choice = request.form['disease']

    # Sauvegarder l'image temporairement
    image_path = "temp_image.jpg"
    image_file.save(image_path)

    # Extraire les caractéristiques GLCM
    features_glcm = glcm(image_path)

    # Chemin du fichier CSV en fonction du choix de maladie
    if disease_choice == "COVID":
        csv_file = "Covid/Covid_glcm.csv"
    else:
        csv_file = "Glaucoma/Glaucoma_glcm.csv"

    df = pd.read_csv(csv_file, header=None)

    # Extraire les caractéristiques du CSV pour comparaison
    X = df.iloc[:, :-1].values  # Toutes les colonnes sauf la dernière
    y = df.iloc[:, -1].values   # La dernière colonne est le label

    if X.shape[1] != len(features_glcm):
        return jsonify({"error": f"Le nombre de caractéristiques extraites ({len(features_glcm)}) ne correspond pas à celui du CSV ({X.shape[1]})."}), 400

    # Comparer les caractéristiques extraites de l'image avec celles du CSV
    distances = np.linalg.norm(X - np.array(features_glcm), axis=1)
    closest_match_index = np.argmin(distances)
    prediction = y[closest_match_index]

    # Supprimer l'image temporaire après traitement
    os.remove(image_path)

    # Retourner le résultat de la prédiction
    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True)
