# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

app = Flask(__name__)
CORS(app)

# Load the GPT-2 tokenizer and model
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
model = GPT2LMHeadModel.from_pretrained('gpt2')

# Ensure the model is in evaluation mode
model.eval()

@app.route('/api/query', methods=['POST'])
def ai_query():
    data = request.get_json()
    user_query = data.get('query')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    location_info = f" at latitude {latitude} and longitude {longitude}" if latitude and longitude else ""
    prompt = f"Provide information about{location_info}: {user_query}"
    
    # Tokenize the prompt
    inputs = tokenizer.encode(prompt, return_tensors='pt')

    # Generate a response using the model
    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_length=150,
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            early_stopping=True
        )

    # Decode the generated text
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Return the response
    return jsonify({'text': response_text})

if __name__ == '__main__':
    app.run(debug=True)
