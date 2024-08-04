import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

# Load the dataset
csv_path = './dataset/diabetes.csv'
df = pd.read_csv(csv_path)

# Example: Assume 'target' is the column you want to predict
X = df.drop('Outcome', axis=1)  # Features
y = df['Outcome']  # Target variable

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = GradientBoostingClassifier()
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred)}')

# Save the model
with open('saved_models/diabetes.pkl', 'wb') as file:
    pickle.dump(model, file)

print("Model saved successfully.")
