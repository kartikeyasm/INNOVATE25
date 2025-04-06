from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os, base64
from werkzeug.utils import secure_filename
from test2 import search_similar_objects

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        data = request.json
        # print(data)
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400

        text = data.get('text', '')
        print(text)
        image_data = data['image']
        # print(image_data)
        
        # Remove the data:image/jpeg;base64, prefix
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 to binary
        image_binary = base64.b64decode(image_data)
        
        # Save the image
        filename = f"upload_{os.urandom(8).hex()}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        with open(filepath, 'wb') as f:
            f.write(image_binary)
        
        absolute_filepath = os.path.abspath(filepath)
        
        # Perform search
        top_results = search_similar_objects(absolute_filepath)
        
        # Process results
        results_list = []
        for res in top_results:
            video_name = res["frame"].split("_")[0]
            video_number = ''.join(filter(str.isdigit, video_name))
            
            results_list.append({
                "input_image": absolute_filepath,
                "timestamp": res["timestamp"],
                "video_number": video_number,
                "bbox": res.get("bbox"),
                "confidence": res.get("confidence"),
                "similarity": res.get("similarity"),
                "frame": res.get("frame")
            })
        
        # Sort by timestamp
        results_list.sort(key=lambda x: x["timestamp"])
        
        return jsonify({
            'status': 'success',
            'type': 'results',
            'text': text,
            'results': results_list
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)