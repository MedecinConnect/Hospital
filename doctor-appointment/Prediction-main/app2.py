import cv2
import numpy as np
import pandas as pd
from skimage.feature import graycomatrix, graycoprops
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier  # Example classifier
import streamlit as st

def glcm(image):
    try:
        # Compute GLCM matrix for the image
        glcm_matrix = graycomatrix(image, [2], [0], levels=256, symmetric=True, normed=True)
        
        # Extract features from the GLCM matrix
        dissimilarity = graycoprops(glcm_matrix, 'dissimilarity')[0, 0]
        contrast = graycoprops(glcm_matrix, 'contrast')[0, 0]
        correlation = graycoprops(glcm_matrix, 'correlation')[0, 0]
        energy = graycoprops(glcm_matrix, 'energy')[0, 0]
        homogeneity = graycoprops(glcm_matrix, 'homogeneity')[0, 0]
        
        return [dissimilarity, contrast, correlation, energy, homogeneity]
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

def train_model(csv_path):
    # Load the CSV data
    df = pd.read_csv(csv_path)
    
    # Assuming the last column is the label
    X = df.iloc[:, :-1].values
    y = df.iloc[:, -1].values

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a RandomForest classifier (or any other classifier)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Optionally evaluate the model on the test set
    accuracy = model.score(X_test, y_test)
    st.write(f"Model trained with accuracy: {accuracy * 100:.2f}%")

    return model

def predict_from_frame(model, frame):
    try:
        # Convert frame to grayscale
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Display the grayscale image for verification
        st.image(gray_frame, caption="Grayscale Image", use_column_width=True)
        
        # Calculate GLCM features
        features = glcm(gray_frame)

        # Use the model to predict based on the features
        prediction = model.predict([features])[0]

        return prediction
    except Exception as e:
        return f"Error during prediction: {str(e)}"

def test_with_known_image(model):
    # Load a known test image
    image_path = 'path_to_your_test_image.jpg'  # Replace with the path to a known test image
    frame = cv2.imread(image_path)
    
    # Display the test image
    st.image(frame, caption="Known Test Image", use_column_width=True)
    
    prediction = predict_from_frame(model, frame)
    st.write(f"Test Image Prediction: {prediction}")

def main():
    st.title("Real-Time Glaucoma Detection")

    # Path to your CSV file containing GLCM features and labels
    csv_path = 'Glaucoma/Glaucoma_glcm.csv'

    # Train the model using the CSV file
    model = train_model(csv_path)

    # Test the model with a known image
    st.write("Testing with known image...")
    test_with_known_image(model)

    cap = cv2.VideoCapture(0)
    run = st.checkbox('Run', value=False)
    capture_image = st.button("Capture Image for Prediction")

    if run:
        ret, frame = cap.read()
        if not ret:
            st.write("Failed to capture video")
            return
        
        # Display video feed
        st.image(frame, channels="BGR", caption="Live Feed")

        # Capture image for prediction
        if capture_image:
            prediction = predict_from_frame(model, frame)
            st.write(f"Prediction: {prediction}")

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
