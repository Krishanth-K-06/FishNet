import json
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import StandardScaler
from datetime import datetime
import numpy as np
import os

def extract_features(data):
    features = []
    targets = []

    for fish_records in data.values():
        for entry in fish_records:
            if "timestamp" not in entry:
                continue

            dt = datetime.fromisoformat(entry["timestamp"])

            features.append([
                dt.month,
                dt.day,
                dt.hour,
                entry.get("temperature", 0),
                entry.get("depth", 0)
            ])
            targets.append([
                entry["latitude"],
                entry["longitude"]
            ])

    return np.array(features), np.array(targets)

def predict_next_locations(model, scaler, base_features):
    inputs = []
    for i in range(2):  # 2 predictions
        new_input = base_features.copy()
        new_input[0] = min(new_input[0] + i, 12)   # tweak month
        new_input[1] = min(new_input[1] + i, 31)   # tweak day
        new_input[2] = (new_input[2] + i * 2) % 24  # tweak hour
        inputs.append(new_input)

    inputs_scaled = scaler.transform(inputs)
    return model.predict(inputs_scaled)

def main():
    input_path = "C:\\Users\\Admin\\Desktop\\alg\\myapp\\Data\\fish.json"
    output_path = "C:\\Users\\Admin\\Desktop\\alg\\myapp\\Data\\predicted.json"

    with open(input_path, "r") as f:
        fish_data = json.load(f)

    X, y = extract_features(fish_data)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42))
    model.fit(X_scaled, y)

    predictions_output = {}

    print("\nPredicted Locations (ML-based):\n")

    for fish_name, records in fish_data.items():
        if not isinstance(records, list) or len(records) == 0:
            continue

        latest = records[-1]

        try:
            dt = datetime.fromisoformat(latest["timestamp"])
        except Exception as e:
            print(f"Error parsing timestamp for {fish_name}: {e}")
            continue

        base_input = [
            dt.month,
            dt.day,
            dt.hour,
            latest.get("temperature", 0),
            latest.get("depth", 0)
        ]

        predicted = predict_next_locations(model, scaler, base_input)

        fish_predictions = []
        print(f"{fish_name}:")
        for i, (lat, lon) in enumerate(predicted, 1):
            lat = round(float(lat), 6)
            lon = round(float(lon), 6)
            print(f"  Prediction {i}: Latitude = {lat}, Longitude = {lon}")
            fish_predictions.append({"latitude": lat, "longitude": lon})

        predictions_output[fish_name] = fish_predictions
        print("-" * 40)

    # Save all predictions to JSON file
    with open(output_path, "w") as json_file:
        json.dump(predictions_output, json_file, indent=4)

if __name__ == "__main__":
    main()
