from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Add this for better CORS handling

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return render_template('index.html')

# Add a health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
