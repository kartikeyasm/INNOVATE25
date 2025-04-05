import os
import cv2
import torch
import numpy as np
from PIL import Image
from ultralytics import YOLO
import open_clip
import matplotlib.pyplot as plt
from pymongo import MongoClient
from torchvision.models import resnet18
import torchvision.transforms as transforms
from sklearn.metrics.pairwise import cosine_similarity
import heapq

def video_to_frames_with_timestamp(video_path, output_folder, every_n_frames=1, stream_name="stream"):
    os.makedirs(output_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    saved_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % every_n_frames == 0:
            timestamp = frame_count / fps  # seconds
            filename = f"{stream_name}frame{saved_count:05d}.jpg"
            frame_path = os.path.join(output_folder, filename)
            cv2.imwrite(frame_path, frame)

            # Save timestamp in a .txt file with the same name
            with open(os.path.join(output_folder, f"{filename}.txt"), 'w') as f:
                f.write(str(timestamp))

            saved_count += 1

        frame_count += 1

    cap.release()
    print(f"Done! Extracted {saved_count} frames from {stream_name}")

# /video_to_frames_with_timestamp("video1.mp4", "output_frames", every_n_frames=5, stream_name="video1")
# video_to_frames_with_timestamp("video2.mp4", "output_frames", every_n_frames=5, stream_name="video2")



# Load models
device = "cuda" if torch.cuda.is_available() else "cpu"
yolo_model = YOLO("yolov8n.pt")
clip_model, _, clip_preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
clip_model = clip_model.to(device).eval()

# Output folders
os.makedirs("annotated_frames", exist_ok=True)
os.makedirs("cropped_objects", exist_ok=True)

def get_clip_embedding(image_array):
    image = Image.fromarray(cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB))
    image_tensor = clip_preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = clip_model.encode_image(image_tensor)
        embedding = embedding / embedding.norm(dim=-1, keepdim=True)
    return embedding.squeeze().cpu().numpy()

def process_frames_with_timestamps(frames_folder):
    results = []
    frame_files = sorted([f for f in os.listdir(frames_folder) if f.endswith('.jpg')])

    for fname in frame_files:
        frame_path = os.path.join(frames_folder, fname)
        timestamp_path = frame_path + ".txt"

        frame = cv2.imread(frame_path)
        if frame is None:
            continue

        try:
            with open(timestamp_path, 'r') as f:
                timestamp = float(f.read())
        except FileNotFoundError:
            timestamp = None  # Just in case

        display_frame = frame.copy()
        detections = yolo_model.predict(frame, verbose=False)[0]

        for i, box in enumerate(detections.boxes):
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cropped = frame[y1:y2, x1:x2]

            if cropped.size == 0:
                continue

            embedding = get_clip_embedding(cropped)

            crop_filename = f"{fname[:-4]}_obj{i}.jpg"
            crop_path = os.path.join("cropped_objects", crop_filename)
            cv2.imwrite(crop_path, cropped)

            results.append({
                "frame": fname,
                "timestamp": timestamp,
                "bbox": [x1, y1, x2, y2],
                "confidence": float(box.conf[0]),
                "embedding": embedding.tolist(),
                "cropped_image_path": crop_path
            })

            # Draw bbox on image
            label = f"{box.conf[0]:.2f}"
            cv2.rectangle(display_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(display_frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)

        # Save annotated frame
        annotated_path = os.path.join("annotated_frames", fname)
        cv2.imwrite(annotated_path, display_frame)

        print(f"Processed {fname} | Objects: {len(detections.boxes)} | Time: {timestamp:.2f}s")

    return results



# Step 1: Convert both videos to frames
video_to_frames_with_timestamp(f"C:/Users/Kartikeya/Documents/hackathon/videos/video1.mp4", "output_frames", every_n_frames=5, stream_name="video1")
video_to_frames_with_timestamp(f"C:/Users/Kartikeya/Documents/hackathon/videos/video2.mp4", "output_frames", every_n_frames=5, stream_name="video2")

# Step 2: Process all frames from both videos
results = process_frames_with_timestamps("output_frames")



def store_embeddings_in_mongo(results, db_name="object_db", collection_name="object_embeddings"):
    # Connect to MongoDB (change URI if using remote server or Mongo Atlas)
    client = MongoClient("mongodb+srv://jagritjain787:Rnxsw1A40JINrv0I@cluster0.hli27ts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client['test']
    collection = db['embeddings']

    # Optional: Clear previous entries
    collection.delete_many({})

    # Prepare and insert each result
    for obj in results:
        mongo_doc = {
            "frame": obj["frame"],                   # e.g., video1_frame_00012.jpg
            "timestamp": obj["timestamp"],           # e.g., 15.2
            "bbox": obj["bbox"],                     # [x1, y1, x2, y2]
            "confidence": obj["confidence"],         # 0.87
            # "class_id": obj["class_id"],             # YOLO class ID
            "embedding": obj["embedding"]   # The embedding is already a list; no need to call tolist()
        }
        collection.insert_one(mongo_doc)

    print(f"✅ Inserted {len(results)} objects into MongoDB collection '{collection_name}' in DB '{db_name}'")

store_embeddings_in_mongo(results)



# Load the pretrained model
embedding_model = resnet18(pretrained=True)
embedding_model.eval()

# Define preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def get_embedding(image):
    with torch.no_grad():
        tensor = transform(image).unsqueeze(0)  # Add batch dim
        embedding = embedding_model(tensor)
        return embedding.squeeze().numpy()



# Load the CLIP model and preprocessing function used for initial object detection
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, _, clip_preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
clip_model = clip_model.to(device).eval()

def get_clip_embedding(image_array):
    image = Image.fromarray(cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB))
    image_tensor = clip_preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = clip_model.encode_image(image_tensor)
        embedding = embedding / embedding.norm(dim=-1, keepdim=True)
    return embedding.squeeze().cpu().numpy()

def search_similar_objects(query_image_path, db_name="object_db", collection_name="object_embeddings", top_k=3):
    # Connect to MongoDB
    client = MongoClient("mongodb+srv://jagritjain787:Rnxsw1A40JINrv0I@cluster0.hli27ts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client['test']
    collection = db['embeddings']

    # Load and process query image using CLIP model for consistent embeddings
    img = Image.open(query_image_path).convert("RGB")
    img_array = np.array(img)
    query_embedding = get_clip_embedding(img_array)  # Use CLIP embedding

    # Compare with all stored embeddings
    similarities = []
    for doc in collection.find({}):
        db_embedding = np.array(doc["embedding"])
        sim = cosine_similarity([query_embedding], [db_embedding])[0][0]

        similarities.append((sim, {
            "frame": doc["frame"],
            "timestamp": doc["timestamp"],
            "bbox": doc["bbox"],
            "confidence": doc["confidence"],
            "similarity": sim,
            "video_stream": doc["frame"].split("_")[0]  # Extract video stream name
        }))

    # Get top-K most similar
    top_matches = heapq.nlargest(top_k, similarities, key=lambda x: x[0])
    return [match[1] for match in top_matches]

query_image_path = f"C:/Users/Kartikeya/Documents/hackathon/videos/bottle.jpg"  # Your input image
top_results = search_similar_objects(query_image_path)

results_list = []
for i, res in enumerate(top_results):
    # Split the frame name by underscore and get the second part (video name)
    video_name = res["frame"].split("_")[0]  # e.g., "video1" or "video2frame"

    # Extract digits from the video name
    video_number = ''.join(filter(str.isdigit, video_name))

    results_list.append({
        "input_image": query_image_path,
        "timestamp": res["timestamp"],
        "video_number": video_number
    })

# Sort the list by timestamp
results_list.sort(key=lambda x: x["timestamp"])

# Print the sorted results (optional)
for res in results_list:
    print(f"\n🔍 Match")
    print("📸 Input Image: ", res["input_image"])
    print("🕒 Timestamp: ", res["timestamp"], "sec")
    print("🎞  Video Number: ", res["video_number"])




# ... (Rest of the code remains the same) ...

def show_matches(top_results, frames_folder="output_frames"):
    for i, res in enumerate(top_results):
        path = os.path.join(frames_folder, res["frame"])
        frame = cv2.imread(path)

        if frame is None:
            print(f"⚠ Could not load frame: {res['frame']}")
            continue

        x1, y1, x2, y2 = map(int, res["bbox"])
        cropped = frame[y1:y2, x1:x2]

        # Use matplotlib's imshow to display the image in Colab
        plt.imshow(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))  # Convert BGR to RGB for matplotlib
        plt.title(f"Match {i+1}: {res['frame']}")
        plt.axis('off')  # Hide axes
        plt.show()

show_matches(top_results, frames_folder="output_frames")