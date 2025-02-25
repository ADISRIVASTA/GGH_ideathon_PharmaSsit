from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import re

app = Flask(__name__)
CORS(app)  # Enable requests from the React frontend

# Load SpaCy NLP model
nlp = spacy.load("en_core_web_sm")

# Store text temporarily
stored_text = ""

# Sample dataset of medicines and details
medicine_dataset = {
    "Paracetamol": {"dosage": ["500mg", "650mg"], "frequency": ["once daily", "twice daily"], "duration": ["5days"]},
    "Ibuprofen": {"dosage": ["400mg"], "frequency": ["thrice daily"], "duration": ["7 days"]},
    "Amoxicillin": {"dosage": ["250mg", "500mg"], "frequency": ["thrice daily"], "duration": ["7 days"]},
    "Azithromycin": {"dosage": ["500mg"], "frequency": ["once daily"], "duration": ["3 days"]},
    "Cetirizine": {"dosage": ["10mg"], "frequency": ["once daily"], "duration": ["as needed"]},
    "Metformin": {"dosage": ["500mg"], "frequency": ["twice daily"], "duration": ["long term"]},
    "Atorvastatin": {"dosage": ["10mg"], "frequency": ["once daily"], "duration": ["long term"]},
    "Aspirin": {"dosage": ["75mg"], "frequency": ["once daily"], "duration": ["long term"]},
    "Omeprazole": {"dosage": ["20mg"], "frequency": ["once daily"], "duration": ["14 days"]},
    "Diclofenac": {"dosage": ["50mg"], "frequency": ["twice daily"], "duration": ["7 days"]},
}

@app.route("/store", methods=["POST"])
def store_text():
    global stored_text
    data = request.get_json()
    stored_text = data.get("text", "")
    return jsonify({"message": "Text stored successfully!"})

@app.route("/parse", methods=["GET"])
def parse_text():
    global stored_text
    if not stored_text:
        return jsonify({"error": "No text found to parse!"}), 400

    # Extract relevant information
    parsed_data = parse_information(stored_text)
    return jsonify(parsed_data)

def parse_information(text):
    # Normalize text to lowercase
    text = text.lower()
    data = {
        "medicines": [],
        "dosage": [],
        "frequency": [],
        "duration": []
    }

    # Load the sample medicine dataset
    medicine_dataset = ["aspirin", "paracetamol", "ibuprofen", "amoxicillin", "azithromycin", "metformin"]

    # Tokenize text into sentences for structured parsing
    sentences = text.split("\n")  # Assuming each medicine data is on a new line

    for sentence in sentences:
        medicine_entry = {"medicine": None, "dosage": None, "frequency": None, "duration": None}

        # Extract medicine name
        for medicine in medicine_dataset:
            if medicine in sentence:
                medicine_entry["medicine"] = medicine.capitalize()
                break  # Stop after the first match

        # Extract dosage
        dosage_match = re.search(r"(\d+\s?(?:mg|ml|tablet|capsule))", sentence, re.IGNORECASE)
        if dosage_match:
            medicine_entry["dosage"] = dosage_match.group(1)

        # Extract frequency
        frequency_match = re.search(r"(\b(?:once|twice|thrice|[0-9]+ times)\s?(?:daily|hourly|per day|per week)?)", sentence, re.IGNORECASE)
        if frequency_match:
            medicine_entry["frequency"] = frequency_match.group(1)

        # Extract duration
        duration_match = re.search(r"(\d+\s?(?:day|week|month|year)s?)", sentence, re.IGNORECASE)
        if duration_match:
            medicine_entry["duration"] = duration_match.group(1)

        # Add the structured data if a medicine was found
        if medicine_entry["medicine"]:
            data["medicines"].append(medicine_entry["medicine"])
            data["dosage"].append(medicine_entry["dosage"] or "None")
            data["frequency"].append(medicine_entry["frequency"] or "None")
            data["duration"].append(medicine_entry["duration"] or "None")

    return data


if __name__ == "__main__":
    app.run(debug=True)
