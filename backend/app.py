from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import time
import google.generativeai as genai

                 

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the Generative Model
model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat(history=[])


def get_gemini_response(question, textContent=""):
    try:
        prompt = f"Based on the following content:\n\n{textContent}\n\n{question}" if textContent else question
        response = chat.send_message(prompt, stream=True)
        return "".join([chunk.text for chunk in response])
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/generate-song', methods=['POST'])
def generate_song():
    data = request.json
    story = data.get('story')
    mood = data.get('mood') 
    language = data.get('language')

    if not story:
        return jsonify({'error': 'No story provided'}), 400
    if not mood:
        return jsonify({'error': 'No mood provided'}), 400
    if not language:
        return jsonify({'error': 'No language provided'}), 400

    # Get response from Gemini model
    song = get_gemini_response(f"Generate a {mood} holiday song in {language} based on this story: {story}")

    return jsonify({'song': song})

if __name__ == '__main__':
    app.run(debug=True)
