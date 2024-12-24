from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

load_dotenv()

app = Flask(__name__)

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
            ["diagnosis this medical image in a short sentence", img], stream=False
        )
        response.resolve()
        return jsonify({"result": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
