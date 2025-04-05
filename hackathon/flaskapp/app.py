from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename
from test2 import search_similar_objects

app = Flask(__name__)

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
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({
            'status': 'success',
            'filepath': filepath
        })
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/search', methods=['POST'])
def search():
    try:
        data = request.get_json()
        filepath = data.get('filepath')
        
        if not filepath:
            return jsonify({'error': 'No filepath provided'}), 400

        # Get search results
        top_results = search_similar_objects(filepath)
        
        # Process results
        results_list = []
        for res in top_results:
            video_name = res["frame"].split("_")[0]
            video_number = ''.join(filter(str.isdigit, video_name))
            
            results_list.append({
                "input_image": filepath,
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
            'results': results_list
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)