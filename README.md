🛠️ Project by TEAM BLITZ
 **Problem Statement**
This project tackles two major challenges in a campus environment. 
The first is creating a Digital Lost & Found System, where students can report and track lost or found items based on location. 
The goal is to create a more connected and responsible campus by ensuring items can be easily found and returned.
The second challenge is improving the AI-Powered Canteen & Mess Management system, where AI is used to predict food demand, thereby minimizing waste in college messes and canteens.

**Proposed Solutions**
🔍 1. Image-Based Lost & Found Detection
We’ve built a smart lost-and-found model where users can upload an image of the lost item.
Using YOLO (You Only Look Once) and vector embeddings, we match and retrieve similar frames from CCTV recordings where the item appears.

✍️ 2. Description-Based Matching System
Alongside the image-based system, we've created a text-matching model that compares descriptions of lost and found items using sentence similarity techniques, allowing users to find matches even without images.

🧠 3. AI-Powered People Prediction Model
We developed a Random Forest-based prediction model to estimate the number of people visiting the canteen daily.
This helps in optimizing meal preparation and minimizing food wastage, making the campus more sustainable.

🌐 4. Student Portal with Authentication
To tie everything together, we created a Student Portal using Node.js for the backend and React.js for the frontend. 
This portal supports secure user authentication, password management, and a role-based login system, providing students with a seamless experience.
Secure user authentication

Password management

Role-based login system
