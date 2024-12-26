import os

import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from radiology_swarm.main import run_diagnosis_agents

load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app, origins=[os.getenv("CORS_ORIGIN")], supports_credentials=True)

# Configure the generative AI API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("API key not found. Please check your .env file.")
genai.configure(api_key=GEMINI_API_KEY)

# Define the model to use
MODEL_NAME = "gemini-1.5-pro"

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        image_file = request.files['image']
        
        # Open the image using PIL
        img = Image.open(image_file)

        # Generate content using the AI model
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(
            ["Provide a concise medical diagnosis for the provided X-ray image.", img], stream=False
        )
        response.resolve()
        return jsonify({"result": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route('/analyze-swarm', methods=['POST'])
def analyze_image_swarm():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        print("Inside swarm")

        image_file = request.files['image']
        temp_dir = os.path.join(BASE_DIR, "temp") 
        os.makedirs(temp_dir, exist_ok=True) 
        temp_file_path = os.path.join(temp_dir, image_file.filename)
        image_file.save(temp_file_path)

        run_diagnosis_agents(
            "Analyze this image and provide both an analysis and a treatment plan",
            img=temp_file_path,
            output_file_name="report.md"
        )
        output_file_path = os.path.join(BASE_DIR, "reports", "report.md")

        # Read the contents of the file
        if os.path.exists(output_file_path):
            with open(output_file_path, 'r') as f:
                file_content = f.read()
        else:
            return jsonify({"error": "Output file not found"}), 500

        os.remove(temp_file_path)
        os.remove(output_file_path)
        
        return jsonify({"result": file_content}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True, port=8000, threaded=False)
