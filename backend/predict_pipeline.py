import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

import json
import numpy as np
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")

# Load saved model, scaler, and column order
model = joblib.load(os.path.join(MODEL_DIR, "random_forest.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

with open(os.path.join(MODEL_DIR, "columns.json")) as f:
    columns = json.load(f)


def preprocess_input(data: dict):
    """
    Converts raw user input into the exact feature vector expected by the model.
    """

    # Step 1: Convert to DataFrame-like dict
    x = {col: 0 for col in columns}   # create empty row with correct columns

    # Numeric fields
    x["age"] = float(data["age"])
    x["bmi"] = float(data["bmi"])
    x["children"] = float(data["children"])

    # Categorical one-hot encoding
    if data["sex"] == "male":
        x["sex_male"] = 1

    if data["smoker"] == "yes":
        x["smoker_yes"] = 1

    region_col = f"region_{data['region'].lower()}"
    if region_col in x:
        x[region_col] = 1

    # Step 2: Apply scaling to numeric columns
    num_cols = ["age", "bmi", "children"]
    scaled_values = scaler.transform(
        [[x[col] for col in num_cols]]
    )[0]

    for i, col in enumerate(num_cols):
        x[col] = scaled_values[i]

    # Step 3: Convert to numpy array in correct order
    final_input = np.array([x[col] for col in columns]).reshape(1, -1)

    return final_input


def predict_cost(data: dict):
    """
    Predict medical cost in dollars.
    """
    processed = preprocess_input(data)
    prediction_log = model.predict(processed)[0]  # model predicts log(charges)
    prediction = np.exp(prediction_log)           # convert back to original scale
    return float(prediction)
