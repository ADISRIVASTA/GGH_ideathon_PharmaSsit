# GGH_ideathon_PharmaSsit
💊 PharmaSsist:
A 🗣️ Speech-to-Text Pharmacy System for converting prescriptions into structured data and 📄 CSV downloads.

📹 Demo Video
▶️(https://drive.google.com/file/d/1aVuj3hwCkk6yjThIlwziMaR46TZ9Doms/view?usp=sharing)
📸 Project Screenshots

Flowchart:
![image](https://github.com/user-attachments/assets/41b9d473-aed3-4215-9158-64e42af16504)


🏠 Homepage
![Screenshot 2025-02-25 215545](https://github.com/user-attachments/assets/e430dea7-dee8-4090-a9bf-c26ca5d4b892)

🎙️ Speech-to-Text Input
![Screenshot 2025-02-25 203934](https://github.com/user-attachments/assets/b6dedeef-6dfc-4030-bd1a-e56c5f8395c1)

📊 Parsed Data Display
![Screenshot 2025-02-25 203723](https://github.com/user-attachments/assets/70ef19a9-b0a7-41a4-ab38-7b2002878d13)
Downloadable file
![Screenshot 2025-02-25 203947](https://github.com/user-attachments/assets/ad1a7aa6-0917-4f2c-b382-8fadb0abcfb1)


Features:
1️⃣ Speech-to-Text Prescription Input
Uses browser's SpeechRecognition API to convert spoken prescriptions into text.
Supports continuous speech recognition for ease of use.

2️⃣ NLP-Based Prescription Parsing
Uses SpaCy NLP and regex to extract key details from prescriptions:
Medicine Name
Dosage (e.g., 500mg, 10ml)
Frequency (e.g., once daily, twice daily)
Duration (e.g., 5 days, 2 weeks)
Processes typed and spoken text efficiently.

3️⃣ Cost Estimation for Medicines
Assigns random prices to extracted medicines.
Calculates and displays the total cost of the prescription dynamically.

4️⃣ CSV Data Export
Converts structured prescription data into a CSV file.
Allows easy downloading and sharing of prescription details.

5️⃣ Frontend-Backend Communication (React + Flask API)
React frontend for user interaction.
Flask backend processes and parses prescription text.
REST API endpoints for text storage and data retrieval.
Bonus Feature: User-Friendly UI
Displays parsed medicine details in a structured table.
Provides real-time updates on text storage and processing.


->🛠️ Technologies Used
🖥️ Frontend: React.js, HTML, CSS
🔙 Backend: Flask (Python)
🎙️ Speech Recognition: Browser SpeechRecognition API
📖 How to Run the Project
1. 🚀 Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-repo/pharmassist.git  
cd pharmassist  
2. 🐍 Install Backend Dependencies
bash
Copy
Edit
cd backend  
pip install -r requirements.txt  
3. ▶️ Start the Backend
bash
Copy
Edit
python app.py  
4. 🌐 Install Frontend Dependencies
      Open a new terminal:
      bash
      Copy
      Edit

cd frontend  
npm install  
6. 🌟 Start the Frontend
bash
Copy
Edit

npm run dev  
7. 🔗 Access the App
The app will be running on http://localhost:5173.
📂 Project Structure
pharmassist/  
├── backend/  
│   ├── app.py            # Flask backend API  
│   ├── requirements.txt  # Backend dependencies  
├── frontend/  
│   ├── src/              # React app source code  
│   ├── package.json      # Frontend dependencies  
├── README.md             # Project documentation  





