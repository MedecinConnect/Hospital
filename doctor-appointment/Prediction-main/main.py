from flask import Flask, jsonify, request
import cv2
import numpy as np
from skimage.feature import graycomatrix, graycoprops
import pandas as pd
import os
import tempfile
from flask_cors import CORS

app = Flask(__name__)

CORS(app)  # Enable CORS for all routes

def glcm(image_path):
    try:
        data = cv2.imread(image_path, 0)
        if data is None:
            raise ValueError("Unable to read the image file.")
        glcm_matrix = graycomatrix(data, [2], [0], None, symmetric=True, normed=True)
        dissimilarity = graycoprops(glcm_matrix, 'dissimilarity')[0, 0]
        contrast = graycoprops(glcm_matrix, 'contrast')[0, 0]
        correlation = graycoprops(glcm_matrix, 'correlation')[0, 0]
        energy = graycoprops(glcm_matrix, 'energy')[0, 0]
        homogeneity = graycoprops(glcm_matrix, 'homogeneity')[0, 0]
        return [dissimilarity, contrast, correlation, energy, homogeneity]
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files or 'disease' not in request.form:
        return jsonify({"error": "Please provide an image and the disease type."}), 400

    image_file = request.files['image']
    disease_choice = request.form['disease']

    try:
        # Sauvegarder l'image temporairement
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            image_path = tmp_file.name
            image_file.save(image_path)

        # Extraire les caractéristiques GLCM
        features_glcm = glcm(image_path)

        # Chemin du fichier CSV en fonction du choix de maladie
        if disease_choice == "COVID":
            csv_file = "Covid/Covid_glcm.csv"
        elif disease_choice == "Glaucoma":
            csv_file = "Glaucoma/Glaucoma_glcm.csv"
        else:
            return jsonify({"error": "Invalid disease choice."}), 400

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

        # Retourner le résultat de la prédiction
        return jsonify({"prediction": prediction})

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500

    finally:
        # Supprimer l'image temporaire après traitement
        if os.path.exists(image_path):
            os.remove(image_path)

if __name__ == "__main__":
    app.run(debug=True)
