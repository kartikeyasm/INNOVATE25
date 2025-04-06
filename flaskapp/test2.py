import os
import cv2
import torch
import numpy as np
from PIL import Image
from ultralytics import YOLO
import open_clip
import matplotlib.pyplot as plt
from pymongo import MongoClient
from torchvision.models import resnet18, ResNet18_Weights
import torchvision.transforms as transforms
from sklearn.metrics.pairwise import cosine_similarity
import heapq




# Load the pretrained model with new weights format
embedding_model = resnet18(weights=ResNet18_Weights.DEFAULT)
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