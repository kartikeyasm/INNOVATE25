import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from test2 import search_similar_objects

app = Flask(__name__)

# Add these configurations
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = os.path.abspath(UPLOAD_FOLDER)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/search', methods=['POST'])
def search():
    try:
        # Get image path from request
        data = request.get_json()
        query_image_path = data.get('image_path')
        
        if not query_image_path:
            return jsonify({'error': 'No image path provided'}), 400

        # Get results using existing function
        top_results = search_similar_objects(query_image_path)
        
        # Process results
        results_list = []
        for res in top_results:
            video_name = res["frame"].split("_")[0]
            video_number = ''.join(filter(str.isdigit, video_name))
            
            results_list.append({
                "input_image": query_image_path,
                "timestamp": res["timestamp"],
                "video_number": video_number
            })
        
        # Sort by timestamp
        results_list.sort(key=lambda x: x["timestamp"])
        
        return jsonify({
            'status': 'success',
            'results': results_list
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_and_search():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file'}), 400
            
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Use the saved file path for search
        top_results = search_similar_objects(filepath)
        
        results_list = []
        for res in top_results:
            video_name = res["frame"].split("_")[0]
            video_number = ''.join(filter(str.isdigit, video_name))
            
            results_list.append({
                "input_image": filepath,
                "timestamp": res["timestamp"],
                "video_number": video_number
            })
        
        results_list.sort(key=lambda x: x["timestamp"])
        
        return jsonify({
            'status': 'success',
            'results': results_list
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)